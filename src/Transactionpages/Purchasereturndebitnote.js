import React, {
  useState,
  useMemo,
  useEffect,
  useSyncExternalStore,
} from "react";
import "./Purchasereturndebitnote.css";
import { useNavigate } from "react-router-dom";
import Select from "react-select";
import axios from "axios";
import { Button, TextField, Modal, setRef } from "@mui/material";
import {
  MaterialReactTable,
  useMaterialReactTable,
} from "material-react-table";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { RiDeleteBin5Line } from "react-icons/ri";
import { CiEdit } from "react-icons/ci";
import moment from "moment";
import qs from "qs";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";

import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  MenuItem,
  InputLabel,
  FormControl,
  Menu,
  FormControlLabel,
  RadioGroup,
  Radio,
} from "@mui/material";

import {
  Alert,
  useMediaQuery,
  Autocomplete,
  Drawer,
  Divider,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { useTheme } from "@mui/material/styles";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { DatePicker } from "@mui/x-date-pickers";
import { Edit, Delete, Add, MoreVert, Print } from "@mui/icons-material";
import dayjs from "dayjs";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";

function Purchasereturndebitnote() {
  const [userId, setUserId] = useState("");
  const [yearid, setYearId] = useState("");
  const [dateError, setDateError] = useState(false);

  useEffect(() => {
    const storedUserId = sessionStorage.getItem("UserId");
    const storedYearId = sessionStorage.getItem("YearId");

    if (storedUserId) {
      setUserId(storedUserId);
    } else {
      toast.error("User is not logged in.");
    }

    if (storedYearId) {
      setYearId(storedYearId);
    } else {
      toast.error("Year is not set.");
    }

    fetchPurchasereturns();
  }, []);

  useEffect(() => {
    const today = new Date();
    const formattedToday = today.toISOString().split("T")[0];
    setPurchaseReturnDate(formattedToday); // set today's date as default
  }, []);

  const getToday = () => {
    return new Date().toISOString().split("T")[0];
  };

  const getMaxDate = () => {
    const today = new Date();
    today.setDate(today.getDate() + 2); // add 2 days
    return today.toISOString().split("T")[0];
  };

  const [pageIndex, setPageIndex] = useState(1); // Current page
  const [totalPages, setTotalPages] = useState(1);
  const [PurchaseReturnNo, setPurchaseReturnNo] = useState(null);
  const [PurchaseReturnDate, setPurchaseReturnDate] = useState("");
  const [RefrenceNo, setRefrenceNo] = useState("");
  const [SupplierId, setSupplierId] = useState("");
  const [AccountId, setAccountId] = useState("");
  const [SubTotal, setSubTotal] = useState("");
  const [Extra1, setExtra1] = useState("");
  const [Extra1Amount, setExtra1Amount] = useState("");
  const [Extra2, setExtra2] = useState("");
  const [Extra2Amount, setExtra2Amount] = useState("");
  const [Total, setTotal] = useState("");
  const [TotalCopies, setTotalCopies] = useState("");
  const [Remark, setRemark] = useState("");

  const [editingIndex, setEditingIndex] = useState(-1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [id, setId] = useState("");
  const [anchorEl, setAnchorEl] = useState(null);

  const [purchasereturndetailId, setPurchasereturndetailId] = useState("");
  const [errors, setErrors] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [purchasereturns, setPurchasereturns] = useState([]);
  const [purchasereturndetails, setPurchasereturnDetails] = useState([]);

  const [currentRow, setCurrentRow] = useState(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [deleteIndex, setDeleteIndex] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const handleMenuOpen = (event, row) => {
    setAnchorEl(event.currentTarget);
    setCurrentRow(row);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  //Dropdown for ID's
  const [bookOptions, setBookOptions] = useState([]);
  const [accountOptions, setAccountOptions] = useState([]);
  const [rows, setRows] = useState([
    {
      BookId: "", // Default value for the first row
      Copies: 0,
      Rate: 0,
      DiscountPercentage: 0,
      DiscountAmount: 0,
      Amount: 0,
    },
  ]);

  useEffect(() => {
    // fetchPurchasereturns();
    fetchPurchasereturnDetails();
    fetchBooks();
    fetchAccounts();
  }, []);

  // const fetchPurchasereturns = async () => {
  //   try {
  //     const response = await axios.get("https://publication.microtechsolutions.net.in/php/Purchasereturnheaderget.php");
  //     setPurchasereturns(response.data);
  //   } catch (error) {
  //     // toast.error("Error fetching Purchase returns:", error);
  //   }
  // };

  useEffect(() => {
    fetchPurchasereturns();
    console.log("this function is called");
  }, [pageIndex]); // Fetch data when page changes

  const fetchPurchasereturns = async () => {
    try {
      const response = await axios.get(
        `https://publication.microtechsolutions.net.in/php/get/gettblpage.php?Table=PurchaseReturnHeader&PageNo=${pageIndex}`
      );
      // setSellschallans(response.data);
      console.log(response.data, "response of purchase return header");

      setPurchasereturns(response.data.data);
      setTotalPages(response.data.total_pages);
    } catch (error) {
      // toast.error("Error fetching sells challans:", error);
    }
  };

  // Fetch the purchase details
  const fetchPurchasereturnDetails = async () => {
    try {
      const response = await axios.get(
        "https://publication.microtechsolutions.net.in/php/Purchasereturndetailget.php"
      );
      // console.log(response.data, 'response of purchase return details')
      setPurchasereturnDetails(response.data);
    } catch (error) {
      // toast.error("Error fetching Purchase return details:", error);
    }
  };

  const fetchBooks = async () => {
    try {
      const response = await axios.get(
        "https://publication.microtechsolutions.net.in/php/Bookget.php"
      );
      const bookOptions = response.data.map((book) => ({
        value: book.Id,
        label: book.BookName || book.BookNameMarathi,
        code: book.BookCode,
        price: book.BookRate,
      }));
      setBookOptions(bookOptions);
    } catch (error) {
      // toast.error("Error fetching books:", error);
    }
  };

  const fetchAccounts = async () => {
    try {
      const response = await axios.get(
        "https://publication.microtechsolutions.net.in/php/Accountget.php"
      );
      const accountOptions = response.data.map((acc) => ({
        value: acc.Id,
        label: acc.AccountName,
      }));
      setAccountOptions(accountOptions);
    } catch (error) {
      // toast.error("Error fetching Accounts:", error);
    }
  };

  // Calculation functions
  const calculateTotals = () => {
    let totalCopies = 0;
    let subtotal = 0;
    let total = 0;

    rows.forEach((row) => {
      totalCopies += Number(row.Copies) || 0;
      subtotal += Number(row.DiscountAmount) || 0;
      total += Number(row.Amount) || 0;
    });
    setTotalCopies(totalCopies);
    setSubTotal(subtotal);
    setTotal(total);
  };
  const [purchasesafedate, setPurchasesafedate] = useState(dayjs());
  const [purchaseerror, setPurchaseerror] = useState("");
  const [receiveddateerror, setReceiveddateerror] = useState("");

  const handleDateChange1 = (newValue) => {
    if (!newValue || !dayjs(newValue).isValid()) {
      setPurchaseerror("Invalid date");
      setPurchasesafedate(null);
      return;
    }

    const today = dayjs();
    const minDate = today.subtract(3, "day");
    const maxDate = today.add(2, "day");

    if (newValue.isBefore(minDate) || newValue.isAfter(maxDate)) {
      setPurchaseerror("You can select only 2 days before or after today");
    } else {
      setPurchaseerror("");
    }

    setPurchasesafedate(newValue);
  };

  const handleInputChange = (index, field, value) => {
    const updatedRows = [...rows];

    updatedRows[index][field] = value;

    // If BookId is changed, update Rate from bookOptions
    if (field === "BookId") {
      const selectedBook = bookOptions.find((book) => book.value === value);
      updatedRows[index].Rate = selectedBook?.price || 0;
    }

    // Extract necessary values
    const copies = parseFloat(updatedRows[index].Copies) || 0;
    const rate = parseFloat(updatedRows[index].Rate) || 0;
    const discountPercentage =
      parseFloat(updatedRows[index].DiscountPercentage) || 0;

    // Recalculate Amount and DiscountAmount
    const amountBeforeDiscount = copies * rate;
    const discountAmount = (amountBeforeDiscount * discountPercentage) / 100;
    const finalAmount = amountBeforeDiscount - discountAmount;

    updatedRows[index].DiscountAmount = discountAmount;
    updatedRows[index].Amount = finalAmount;

    setRows(updatedRows);
    calculateTotals();
  };

  const handleAddRow = () => {
    setRows([
      ...rows,
      {
        BookId: "", // This will be empty for new rows
        SerialNo: "",
        Copies: "",
        Rate: "",
        DiscountPercentage: "",
        DiscountAmount: "",
        Amount: "",
      },
    ]);
    calculateTotals();
  };

  const handleDeleteRow = (index) => {
    const updatedRows = rows.filter((_, i) => i !== index);
    setRows(updatedRows);
    calculateTotals();
  };

  const handleDelete = () => {
    const row = currentRow;
    const index = row?.index;
    const Id = row?.original?.Id;

    console.log(Id, "id to delete");
    if (!Id) {
      toast.error("No Id found for delete");
      return;
    }
    setDeleteIndex(index);
    setDeleteId(Id);
    setIsDeleteDialogOpen(true);
    handleMenuClose();
  };

  const confirmDelete = () => {
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/x-www-form-urlencoded");

    // Prepare URL with dynamic parameters
    const url = `https://publication.microtechsolutions.net.in/php/deletetable.php?Id=${deleteId}&Table=PurchaseReturnHeader`;

    const urlencoded = new URLSearchParams();
    urlencoded.append("Id", deleteId);
    urlencoded.append("Table", "PurchaseReturnHeader");

    const requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: urlencoded,
      redirect: "follow",
    };

    // Send the request to the server with dynamic URL
    fetch(url, requestOptions)
      .then((response) => response.text()) // Handle the response
      .then((result) => {
        console.log(result);
        toast.success("Purchase return debit note Deleted Successfully"); // Show success toast
        setIsDeleteDialogOpen(false); // Close delete dialog
        fetchPurchasereturns(); // Refresh vouchers list
      })
      .catch((error) => {
        console.error("Error:", error);
        // toast.error('Failed to delete Sales challan'); // Show error toast if it fails
      });
  };

  const cancelDelete = () => {
    setIsDeleteDialogOpen(false);
    setDeleteIndex(null);
  };

  const resetForm = () => {
    setPurchaseReturnNo("");
    // setPurchaseReturnDate("");
    setPurchasesafedate(dayjs());
    setPurchaseerror("");
    setRefrenceNo("");
    setSupplierId("");
    setAccountId("");
    setSubTotal("");
    setExtra1("");
    setExtra1Amount("");
    setExtra2("");
    setExtra2Amount("");
    setTotal("");
    setTotalCopies("");
    setRemark("");
    setRows([
      {
        BookId: "",
        Copies: 0,
        Rate: 0,
        DiscountPercentage: 0,
        DiscountAmount: 0,
        Amount: 0,
      },
    ]);
  };

  useEffect(() => {
    calculateTotals();
  }, [rows]);

  const handleNewClick = () => {
    resetForm();
    setIsModalOpen(true);
    setIsEditing(false);
    setEditingIndex(-1);
  };

  const [isLoading, setIsLoading] = useState(false);

  const [idwiseData, setIdwiseData] = useState("");

  const handleEdit = () => {
    if (currentRow) {
      console.log("Editing item with ID:", currentRow.original.Id);
      setIdwiseData(currentRow.original.Id);
    }
    setIsLoading(true);

    const purchasereturn = purchasereturns[currentRow.index];

    // Filter purchase details to match the selected PurchaseId
    const purchasereturndetail = purchasereturndetails.filter(
      (detail) => detail.PurchaseReturnId === purchasereturn.Id
    );

    // Map the details to rows
    const mappedRows = purchasereturndetail.map((detail) => ({
      // PurchaseReturnId: detail.PurchaseReturnId,

      PurchaseReturnId: detail.PurchaseReturnId,
      BookId: detail.BookId,
      Copies: detail.Copies,
      Rate: detail.Rate,
      DiscountPercentage: detail.DiscountPercentage,
      DiscountAmount: detail.DiscountAmount,
      Amount: detail.Amount,
      Id: detail.Id, // Include the detail Id in the mapped row for tracking
    }));

    // Convert date strings to DD-MM-YYYY format
    const convertDateForInput = (dateStr) => {
      if (typeof dateStr === "string" && dateStr.includes("-")) {
        const [year, month, day] = dateStr.split(" ")[0].split("-");
        return `${year}-${month}-${day}`;
      } else {
        console.error("Invalid date format:", dateStr);
        return ""; // Return an empty string or handle it as needed
      }
    };

    const purchasereturnDate = convertDateForInput(
      purchasereturn.PurchaseReturnDate.date
    );

    // Set the form fields
    setPurchaseReturnNo(purchasereturn.PurchaseReturnNo);
    setPurchaseReturnDate(purchasereturnDate);
    setRefrenceNo(purchasereturn.RefrenceNo);
    setSupplierId(purchasereturn.SupplierId);
    setAccountId(purchasereturn.AccountId);
    setSubTotal(purchasereturn.SubTotal);
    setExtra1(purchasereturn.Extra1);
    setExtra1Amount(purchasereturn.Extra1Amount);
    setExtra2(purchasereturn.Extra2);
    setExtra2Amount(purchasereturn.Extra2Amount);
    setTotal(purchasereturn.Total);
    setTotalCopies(purchasereturn.TotalCopies);
    setRemark(purchasereturn.Remark);

    //   console.log(purchasereturn, 'purchase return');
    //   console.log(purchasereturndetail, 'purchase return detail')
    // console.log(mappedRows, 'mapped rows')
    // Set the rows for the table with all the details
    setRows(mappedRows);

    // Set editing state
    setEditingIndex(currentRow.index);
    setIsModalOpen(true);
    setIsEditing(true);
    setId(purchasereturn.Id);
    handleMenuClose();
    // Determine which specific detail to edit
    const specificDetail = purchasereturndetail.find(
      (detail) => detail.Id === currentRow.original.Id
    );
    if (specificDetail) {
      setPurchasereturndetailId(specificDetail.Id); // Set the specific detail Id
    }

    fetchPurchasereturnDetails().then(() => {
      setIsLoading(false); // Stop loading after data is fetched
    });
  };

  const validateForm = () => {
    let formErrors = {};
    let isValid = true;

    // if (!PurchaseReturnNo) {
    //   formErrors.PurchaseReturnNo = "Purchase Return No  is required.";
    //   isValid = false;
    // }
    if (!purchasesafedate) {
      formErrors.purchasesafedate = "Purchase Return Date is required.";
      isValid = false;
    }

    if (!RefrenceNo) {
      formErrors.RefrenceNo = "Reference No is required.";
      isValid = false;
    }
    if (!AccountId) {
      formErrors.AccountId = "Account Id is required.";
      isValid = false;
    }
    if (!SupplierId) {
      formErrors.SupplierId = "Supplier Id is required.";
      isValid = false;
    }

    if (!SubTotal) {
      formErrors.SubTotal = "Sub Total  is required.";
      isValid = false;
    }
    if (!Extra1) {
      formErrors.Extra1 = "Extra1 is required.";
      isValid = false;
    }

    if (!Extra1Amount) {
      formErrors.Extra1Amount = "Extra1 Amount is required.";
      isValid = false;
    }
    if (!Extra2) {
      formErrors.Extra2 = "Extra2 is required.";
      isValid = false;
    }
    if (!Extra2Amount) {
      formErrors.Extra2Amount = "Extra2 Amount is required.";
      isValid = false;
    }

    if (!Total) {
      formErrors.Total = "Total is required.";
      isValid = false;
    }
    if (!TotalCopies) {
      formErrors.TotalCopies = "Total Copies is required.";
      isValid = false;
    }
    if (!Remark) {
      formErrors.Remark = "Remark is required.";
      isValid = false;
    }

    setErrors(formErrors);
    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    if (
      !purchasesafedate ||
      !dayjs(purchasesafedate).isValid() ||
      purchaseerror
    ) {
      toast.error("Please correct all the date fields before submitting.");
      return;
    }

    const formattedPurchaseReturnDate =
      moment(purchasesafedate).format("YYYY-MM-DD");

    const purchasereturnData = {
      Id: isEditing ? id : "", // Include the Id for updating, null for new records
      PurchaseReturnNo: PurchaseReturnNo,
      PurchaseReturnDate: formattedPurchaseReturnDate,
      RefrenceNo: RefrenceNo,
      SupplierId: SupplierId,
      AccountId: AccountId,
      SubTotal: SubTotal,
      Extra1: Extra1,
      Extra1Amount: Extra1Amount,
      Extra2: Extra2,
      Extra2Amount: Extra2Amount,
      Total: Total,
      TotalCopies: TotalCopies,
      Remark: Remark,
      CreatedBy: !isEditing ? userId : undefined,
      UpdatedBy: isEditing ? userId : undefined,
    };

    try {
      const purchasereturnUrl = isEditing
        ? "https://publication.microtechsolutions.net.in/php/Purchasereturnheaderupdate.php"
        : "https://publication.microtechsolutions.net.in/php/Purchasereturnheaderpost.php";

      // Submit purchase header data
      const response = await axios.post(
        purchasereturnUrl,
        qs.stringify(purchasereturnData),
        {
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
        }
      );

      // const purchasereturnId = isEditing ? id : parseInt(response.data.newId, 10);
      const purchasereturnId = isEditing ? id : parseInt(response.data.Id, 10);

      for (const row of rows) {
        const rowData = {
          PurchaseReturnId: purchasereturnId,
          SerialNo: rows.indexOf(row) + 1,
          BookId: parseInt(row.BookId, 10),
          Copies: parseInt(row.Copies, 10),
          Rate: parseFloat(row.Rate),
          DiscountPercentage: parseFloat(row.DiscountPercentage),
          DiscountAmount: parseFloat(row.DiscountAmount),
          Amount: parseFloat(row.Amount),
          Id: row.Id,
          CreatedBy: row.Id ? undefined : userId,
          UpdatedBy: row.Id ? userId : undefined,
        };

        const purchasereturndetailUrl =
          isEditing && row.Id
            ? "https://publication.microtechsolutions.net.in/php/Purchasereturndetailupdate.php"
            : "https://publication.microtechsolutions.net.in/php/Purchasereturndetailpost.php";

        await axios.post(purchasereturndetailUrl, qs.stringify(rowData), {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
        });
      }

      fetchPurchasereturns();
      fetchPurchasereturnDetails();
      setIsModalOpen(false);
      toast.success(
        isEditing
          ? "Purchase return & Purchase Return Details updated successfully!"
          : "Purchase return & Purchase Return Details added successfully!"
      );
      resetForm(); // Reset the form fields after successful submission
    } catch (error) {
      // console.error("Error saving record:", error);
      toast.error("Error saving record!");
    }
  };

  const columns = useMemo(
    () => [
      {
        accessorKey: "SrNo",
        header: "Sr.No",
        size: 50,
        Cell: ({ row }) => row.index + 1,
      },

      {
        accessorKey: "PurchaseReturnNo",
        header: "Purchase No",
        size: 50,
      },
      {
        accessorKey: "PurchaseReturnDate.date",
        header: "Purchase Return Date",
        size: 50,
        Cell: ({ cell }) => {
          // Using moment.js to format the date
          const date = moment(cell.getValue()).format("DD-MM-YYYY");
          return <span>{date}</span>;
        },
      },

      {
        accessorKey: "Total",
        header: "Total",
        size: 50,
      },
      // {
      //   accessorKey: "TotalCopies",
      //   header: "Total Copies",
      //   size: 50,
      // },
      // {
      //   accessorKey: "Remark",
      //   header: "Remark",
      //   size: 50,
      // },

      {
        accessorKey: "actions",
        header: "Actions",
        size: 150,
        Cell: ({ row }) => (
          <div>
            <IconButton
              onClick={(event) => handleMenuOpen(event, row)} // Open the menu on click
            >
              <MoreVert />
            </IconButton>
          </div>
        ),
      },
    ],
    [purchasereturns]
  );

  const table = useMaterialReactTable({
    columns,
    data: purchasereturns,
    enablePagination: false,
    muiTableHeadCellProps: {
      style: {
        backgroundColor: "#E9ECEF", // Replace with your desired color
        color: "black",
        fontSize: "16px",
      },
    },
  });

  return (
    <div className="preturn-container">
      <h1>Purchase Return Debit Note</h1>

      <div className="preturntable-master">
        <div className="preturntable1-master">
          <Button
            onClick={handleNewClick}
            style={{
              color: "#FFFF",
              fontWeight: "700",
              background: "#0a60bd",
              width: "15%",
            }}>
            New
          </Button>
          <div className="preturntable-container">
            <Box mt={2}>
              <MaterialReactTable table={table} />
              <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleMenuClose}>
                <MenuItem onClick={handleEdit}>Edit</MenuItem>
                <MenuItem onClick={handleDelete}>Delete</MenuItem>

                {/* <MenuItem onClick={handlePrint}>Print</MenuItem>  */}
              </Menu>
            </Box>{" "}
          </div>
          {/* Pagination Controls */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              marginTop: "10px",
            }}>
            <Button
              onClick={() =>
                setPageIndex((prev) => Math.max(Number(prev) - 1, 1))
              }>
              ◀ Prev
            </Button>
            <input
              type="number"
              value={pageIndex}
              onChange={(e) => {
                const newPage = Number(e.target.value); // Convert to Number
                if (!isNaN(newPage) && newPage >= 1) {
                  setPageIndex(newPage);
                }
              }}
              style={{
                width: "50px",
                textAlign: "center",
                margin: "0 10px",
                marginBottom: "5px",
              }}
            />
            <Button onClick={() => setPageIndex((prev) => Number(prev) + 1)}>
              Next ▶
            </Button>{" "}
            Total Pages : {totalPages}
          </div>{" "}
        </div>

        {isModalOpen && (
          <div
            className="preturn-overlay"
            onClick={() => setIsModalOpen(false)}
          />
        )}

        <Modal open={isModalOpen}>
          <div className="preturn-modal">
            <h2
              style={{
                textAlign: "center",
                fontWeight: "620",
                margin: "2px",
                fontSize: "27px",
              }}>
              {editingIndex >= 0
                ? "Edit Purchase Return Debit Note "
                : "Add Purchase Return Debit Note"}
            </h2>
            <form className="preturn-form">
              <div>
                <label className="preturn-label">
                  Purchase Return No <b className="required">*</b>
                </label>
                <div>
                  <input
                    type="text"
                    id="PurchaseReturnNo"
                    name="PurchaseReturnNo"
                    value={PurchaseReturnNo}
                    onChange={(e) => setPurchaseReturnNo(e.target.value)}
                    style={{ background: "#f5f5f5" }}
                    className="preturn-control"
                    placeholder="Auto-Incremented"
                    readOnly
                  />
                </div>

                <div>
                  {errors.PurchaseReturnNo && (
                    <b className="error-text">{errors.PurchaseReturnNo}</b>
                  )}
                </div>
              </div>

              <div>
                <label className="preturn-label">
                  Purchase Return Date <b className="required">*</b>
                </label>
                <div>
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DatePicker
                      value={purchasesafedate}
                      onChange={handleDateChange1}
                      format="DD-MM-YYYY"
                      slotProps={{
                        textField: {
                          size: "small",
                          fullWidth: true,
                          error: !!purchaseerror,
                          helperText: purchaseerror,
                        },
                      }}
                      sx={{
                        marginTop: "10px",
                        marginBottom: "5px",
                        width: "250px",
                      }}
                    />
                  </LocalizationProvider>
                </div>

                <div>
                  {errors.PurchaseReturnDate && (
                    <b className="error-text">{errors.PurchaseReturnDate}</b>
                  )}
                </div>
              </div>

              <div>
                <label className="preturn-label">
                  Reference No <b className="required">*</b>
                </label>
                <div>
                  <input
                    type="text"
                    id="RefrenceNo"
                    name="RefrenceNo"
                    value={RefrenceNo}
                    onChange={(e) => setRefrenceNo(e.target.value)}
                    maxLength={50}
                    className="preturn-control"
                    placeholder="Enter Reference No"
                  />
                </div>

                <div>
                  {errors.RefrenceNo && (
                    <b className="error-text">{errors.RefrenceNo}</b>
                  )}
                </div>
              </div>

              <div>
                <label className="preturn-label">
                  Supplier <b className="required">*</b>
                </label>
                <div>
                  <Autocomplete
                    options={accountOptions}
                    value={
                      accountOptions.find(
                        (option) => option.value === SupplierId
                      ) || null
                    }
                    onChange={(event, newValue) =>
                      setSupplierId(newValue ? newValue.value : null)
                    }
                    getOptionLabel={(option) => option.label} // Display only label in dropdown
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        placeholder="Select Supp id"
                        size="small"
                        margin="none"
                        fullWidth
                      />
                    )}
                    sx={{ mt: 1.25, mb: 0.625, width: 310 }} // Equivalent to 10px and 5px
                  />
                </div>
                <div>
                  {errors.SupplierId && (
                    <b className="error-text">{errors.SupplierId}</b>
                  )}
                </div>
              </div>

              <div>
                <label className="preturn-label">
                  {" "}
                  Account <b className="required">*</b>
                </label>
                <div>
                  <Autocomplete
                    options={accountOptions}
                    value={
                      accountOptions.find(
                        (option) => option.value === AccountId
                      ) || null
                    }
                    onChange={(event, newValue) =>
                      setAccountId(newValue ? newValue.value : null)
                    }
                    getOptionLabel={(option) => option.label} // Display only label in dropdown
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        placeholder="Select Acc id"
                        size="small"
                        margin="none"
                        fullWidth
                      />
                    )}
                    sx={{ mt: 1.25, mb: 0.625, width: 300 }} // Equivalent to 10px and 5px
                  />
                </div>
                <div>
                  {errors.AccountId && (
                    <b className="error-text">{errors.AccountId}</b>
                  )}
                </div>
              </div>
            </form>

            <div className="preturn-table">
              <table>
                <thead>
                  <tr>
                    <th>Serial No</th>
                    <th>Book Code</th>
                    <th>
                      Book Name <b className="required">*</b>
                    </th>
                    <th>
                      Copies <b className="required">*</b>
                    </th>
                    <th>
                      Rate <b className="required">*</b>
                    </th>
                    <th>
                      Discount Percentage <b className="required">*</b>
                    </th>
                    <th>
                      Discount Amount <b className="required">*</b>
                    </th>
                    <th>
                      Amount <b className="required">*</b>
                    </th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {isLoading ? (
                    <tr>
                      <td
                        colSpan="10"
                        style={{
                          textAlign: "center",
                          fontWeight: "bold",
                          padding: "10px",
                          color: "blue",
                        }}>
                        Loading data...
                      </td>
                    </tr>
                  ) : rows.length === 0 ? ( // Check if rows is empty
                    <tr>
                      <td
                        colSpan="10"
                        style={{
                          textAlign: "center",
                          fontWeight: "bold",
                          padding: "10px",
                          color: "red",
                        }}>
                        No data available
                      </td>
                    </tr>
                  ) : (
                    rows.map((row, index) => (
                      <tr key={index}>
                        <td>{index + 1}</td>

                        <td>
                          {bookOptions.find(
                            (option) => option.value === row.BookId
                          )?.code || ""}
                        </td>
                        <td>
                          <Autocomplete
                            options={bookOptions}
                            value={
                              bookOptions.find(
                                (option) => option.value === row.BookId
                              ) || null
                            }
                            onChange={(event, newValue) =>
                              handleInputChange(
                                index,
                                "BookId",
                                newValue ? newValue.value : ""
                              )
                            }
                            sx={{ width: 500 }} // Set width
                            getOptionLabel={(option) => option.label}
                            renderInput={(params) => (
                              <TextField
                                {...params}
                                placeholder="Select Book"
                                size="big"
                                fullWidth
                                sx={{
                                  "& .MuiInputBase-root": {
                                    height: "50px",
                                    // width: "200px", // Adjust height here
                                  },
                                  "& .MuiInputBase-input": {
                                    padding: "14px", // Adjust padding for better alignment
                                  },
                                }}
                              />
                            )}
                          />
                        </td>
                        <td>
                          <input
                            type="number"
                            value={row.Copies}
                            onChange={(e) =>
                              handleInputChange(index, "Copies", e.target.value)
                            }
                            style={{
                              width: "100px",
                            }}
                            placeholder="Copies"
                            className="preturn-control"
                          />
                        </td>
                        <td>
                          <input
                            type="number"
                            value={row.Rate}
                            readOnly
                            style={{ width: "150px" }}
                            placeholder="Rate"
                            className="preturn-control"
                          />
                          {/* 
                          {bookOptions.find(
                            (option) => option.value === row.BookId
                          )?.price || ""} */}
                        </td>
                        <td>
                          <input
                            type="number"
                            value={row.DiscountPercentage}
                            onChange={(e) => {
                              const value = e.target.value;
                              // Regex to validate decimal numbers with at most 18 digits total and 2 decimal places
                              const regex = /^\d{0,18}(\.\d{0,2})?$/;

                              // Check if the value matches the regex
                              if (value === "" || regex.test(value)) {
                                handleInputChange(
                                  index,
                                  "DiscountPercentage",
                                  value
                                );
                              }
                            }}
                            style={{
                              width: "100px",
                            }}
                            placeholder="Discount %"
                            className="preturn-control"
                          />
                        </td>
                        <td>
                          <input
                            type="number"
                            value={row.DiscountAmount}
                            readOnly
                            style={{
                              width: "150px",
                            }}
                            placeholder="Discount Amount"
                            className="preturn-control"
                          />
                        </td>
                        <td>
                          <input
                            type="number"
                            value={row.Amount}
                            readOnly
                            style={{
                              width: "150px",
                            }}
                            placeholder="Amount"
                            className="preturn-control"
                          />
                        </td>
                        <td>
                          <div
                            style={{
                              display: "flex",
                              justifyContent: "space-between",
                            }}>
                            <Button
                              onClick={handleAddRow}
                              style={{
                                background: "#0a60bd",
                                color: "white",
                                marginRight: "5px",
                              }}>
                              Add
                            </Button>
                            <Button
                              onClick={() => handleDeleteRow(index)}
                              style={{ background: "red", color: "white" }}>
                              <RiDeleteBin5Line />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
            <form className="preturn-form">
              <div>
                <label className="preturn-label">
                  Sub Total <b className="required">*</b>
                </label>
                <div>
                  <input
                    type="text"
                    id="SubTotal"
                    name="SubTotal"
                    value={SubTotal}
                    onChange={(e) => {
                      const value = e.target.value;

                      // Regex to validate decimal numbers with at most 18 digits total and 2 decimal places
                      const regex = /^\d{0,18}(\.\d{0,2})?$/;

                      // Check if the value matches the regex
                      if (value === "" || regex.test(value)) {
                        setSubTotal(value);
                      }
                    }}
                    className="preturn-control"
                    placeholder="Enter Sub Total"
                  />
                </div>

                <div>
                  {errors.SubTotal && (
                    <b className="error-text">{errors.SubTotal}</b>
                  )}
                </div>
              </div>

              <div>
                <label className="preturn-label">
                  Extra1 <b className="required">*</b>
                </label>
                <div>
                  <input
                    type="text"
                    id="Extra1"
                    name="Extra1"
                    value={Extra1}
                    onChange={(e) => setExtra1(e.target.value)}
                    maxLength={50}
                    className="preturn-control"
                    placeholder="Enter Extra1"
                  />
                </div>

                <div>
                  {errors.Extra1 && (
                    <b className="error-text">{errors.Extra1}</b>
                  )}
                </div>
              </div>
              <div>
                <label className="preturn-label">
                  Extra1 Amount <b className="required">*</b>
                </label>
                <div>
                  <input
                    type="text"
                    id="Extra1Amount"
                    name="Extra1Amount"
                    value={Extra1Amount}
                    onChange={(e) => {
                      const value = e.target.value;

                      // Regex to validate decimal numbers with at most 18 digits total and 2 decimal places
                      const regex = /^\d{0,18}(\.\d{0,2})?$/;

                      // Check if the value matches the regex
                      if (value === "" || regex.test(value)) {
                        setExtra1Amount(value);
                      }
                    }}
                    className="preturn-control"
                    placeholder="Enter Extra1 Amount"
                  />
                </div>
                <div>
                  {errors.Extra1Amount && (
                    <b className="error-text">{errors.Extra1Amount}</b>
                  )}
                </div>
              </div>
              <div>
                <label className="preturn-label">
                  Extra2 <b className="required">*</b>
                </label>
                <div>
                  <input
                    type="text"
                    id="Extra2"
                    name="Extra2"
                    value={Extra2}
                    onChange={(e) => setExtra2(e.target.value)}
                    maxLength={50}
                    className="preturn-control"
                    placeholder="Enter Extra2"
                  />
                </div>

                <div>
                  {errors.Extra2 && (
                    <b className="error-text">{errors.Extra2}</b>
                  )}
                </div>
              </div>
              <div>
                <label className="preturn-label">
                  Extra2 Amount <b className="required">*</b>
                </label>
                <div>
                  <input
                    type="text"
                    id="Extra2Amount"
                    name="Extra2Amount"
                    value={Extra2Amount}
                    onChange={(e) => {
                      const value = e.target.value;

                      // Regex to validate decimal numbers with at most 18 digits total and 2 decimal places
                      const regex = /^\d{0,18}(\.\d{0,2})?$/;

                      // Check if the value matches the regex
                      if (value === "" || regex.test(value)) {
                        setExtra2Amount(value);
                      }
                    }}
                    className="preturn-control"
                    placeholder="Enter Extra2 Amount"
                  />
                </div>

                <div>
                  {errors.Extra2Amount && (
                    <b className="error-text">{errors.Extra2Amount}</b>
                  )}
                </div>
              </div>

              <div>
                <label className="preturn-label">
                  Total <b className="required">*</b>
                </label>
                <div>
                  <input
                    type="text"
                    id="Total"
                    name="Total"
                    value={Total}
                    onChange={(e) => {
                      const value = e.target.value;

                      // Regex to validate decimal numbers with at most 18 digits total and 2 decimal places
                      const regex = /^\d{0,18}(\.\d{0,2})?$/;

                      // Check if the value matches the regex
                      if (value === "" || regex.test(value)) {
                        setTotal(value);
                      }
                    }}
                    className="bookpurchase-control"
                    placeholder="Enter Total"
                  />
                </div>

                <div>
                  {errors.Total && <b className="error-text">{errors.Total}</b>}
                </div>
              </div>

              <div>
                <label className="bookpurchase-label">
                  Total Copies <b className="required">*</b>
                </label>
                <div>
                  <input
                    type="text"
                    id="TotalCopies"
                    name="TotalCopies"
                    value={TotalCopies}
                    onChange={(e) => setTotalCopies(e.target.value)}
                    className="bookpurchase-control"
                    placeholder="Enter Total Copies"
                  />
                </div>
                <div>
                  {errors.TotalCopies && (
                    <b className="error-text">{errors.TotalCopies}</b>
                  )}
                </div>
              </div>

              <div>
                <label className="bookpurchase-label">
                  Remark <b className="required">*</b>
                </label>
                <div>
                  <input
                    type="text"
                    id="Remark"
                    name="Remark"
                    value={Remark}
                    onChange={(e) => setRemark(e.target.value)}
                    maxLength={300}
                    className="bookpurchase-control"
                    placeholder="Enter Remark"
                  />
                </div>

                <div>
                  {errors.Remark && (
                    <b className="error-text">{errors.Remark}</b>
                  )}
                </div>
              </div>
            </form>
            <div className="bookpurchase-btn-container">
              <Button
                type="submit"
                onClick={handleSubmit}
                style={{
                  background: "#0a60bd",
                  color: "white",
                }}>
                {editingIndex >= 0 ? "Update" : "Save"}
              </Button>
              <Button
                onClick={() => setIsModalOpen(false)}
                style={{
                  background: "red",
                  color: "white",
                }}>
                Cancel
              </Button>
            </div>
          </div>
        </Modal>

        <Dialog open={isDeleteDialogOpen} onClose={cancelDelete}>
          <DialogTitle style={{ color: "navy", fontWeight: "600" }}>
            Confirm Deletion
          </DialogTitle>
          <DialogContent>
            Are you sure you want to delete this{" "}
            <b style={{ color: "red" }}>
              <u>Purchase return Debit note</u>
            </b>
            ?
          </DialogContent>
          <DialogActions>
            <Button
              onClick={cancelDelete}
              style={{
                background: "red",
                color: "white",
                marginRight: "5px",
              }}>
              Cancel
            </Button>
            <Button
              onClick={confirmDelete}
              style={{
                background: "#0a60bd",
                color: "white",
                marginRight: "5px",
              }}>
              Confirm
            </Button>
          </DialogActions>
        </Dialog>
      </div>
      <ToastContainer />
    </div>
  );
}
export default Purchasereturndebitnote;
