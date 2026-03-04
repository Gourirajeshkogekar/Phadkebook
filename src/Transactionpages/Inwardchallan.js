import React, { useState, useMemo, useEffect } from "react";
import "./Inwardchallan.css";
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
import { useRef } from "react";
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

function Invertchallan() {
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

    fetchInvertChallan();
  }, []);

  const [pageIndex, setPageIndex] = useState(1); // Current page
  const [totalPages, setTotalPages] = useState(1);
  const [InvertDate, setInvertDate] = useState("");
  const [InvertNo, setInvertNo] = useState(null);
  const [AccountId, setAccountId] = useState("");
  const [DCNo, setDcno] = useState("");
  const [DCDate, setDcdate] = useState("");
  const [TotalCopies, setTotalCopies] = useState("");
  const [TotalAmount, setTotalAmount] = useState("");
  const [Remark, setRemark] = useState("");
  const [IsPaperPurchase, setIsPaperPurchase] = useState("false");

  const [editingIndex, setEditingIndex] = useState(-1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [id, setId] = useState("");

  const [invertdetailId, setInvertDetailId] = useState("");
  const [errors, setErrors] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [invertchallans, setInvertchallans] = useState([]);
  const [invertdetails, setInvertdetails] = useState([]);

  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [deleteIndex, setDeleteIndex] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(null);

  const [currentRow, setCurrentRow] = useState(null);

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
    fetchInvertChallan();
    fetchInvertDetail();
    fetchBooks();
    fetchAccounts();
  }, []);

  // const fetchInvertChallan = async () => {
  //   try {
  //     const response = await axios.get("https://publication.microtechsolutions.net.in/php/Invertchallanheaderget.php");
  //     setInvertchallans(response.data);
  //   } catch (error) {
  //     // toast.error("Error fetching Inward challans:", error);
  //   }
  // };

  useEffect(() => {
    fetchInvertChallan();
    console.log("this function is called");
  }, [pageIndex]); // Fetch data when page changes

  const fetchInvertChallan = async () => {
    try {
      const response = await axios.get(
        `https://publication.microtechsolutions.net.in/php/get/gettblpage.php?Table=InvertChallanHeader&PageNo=${pageIndex}`
      );
      console.log(response.data, "response of inward challan header");

      setInvertchallans(response.data.data);
      setTotalPages(response.data.total_pages);
    } catch (error) {
      // toast.error("Error fetching sells challans:", error);
    }
  };

  // Fetch the purchase details
  const fetchInvertDetail = async () => {
    try {
      const response = await axios.get(
        "https://publication.microtechsolutions.net.in/php/Invertchallandetailget.php"
      );
      // console.log(response.data, 'response of purchase return details')
      setInvertdetails(response.data);
    } catch (error) {
      // toast.error("Error fetching Inward details:", error);
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
    let total = 0;

    rows.forEach((row) => {
      totalCopies += Number(row.Copies) || 0;
      total += Number(row.Amount) || 0;
    });
    setTotalCopies(totalCopies);
    setTotalAmount(total);
  };

  const [inwarddate, setInwarddate] = useState(dayjs());
  const [inwarderror, setInwarderror] = useState("");

  const [supplierdate, setSupplierdate] = useState(dayjs());
  const [supplierdateerror, setSupplierdateerror] = useState("");

  const handleDateChange1 = (newValue) => {
    if (!newValue || !dayjs(newValue).isValid()) {
      setInwarderror("Invalid date");
      setInwarddate(null);
      return;
    }

    // const today = dayjs();
    // const minDate = today.subtract(3, "day");
    // const maxDate = today.add(2, "day");

    // if (newValue.isBefore(minDate) || newValue.isAfter(maxDate)) {
    //   setInwarderror("You can select only 2 days before or after today");
    // } else {
    //   setInwarderror("");
    // }
    setInwarderror("");
    setInwarddate(dayjs(newValue));
  };

  const handleDateChange2 = (newValue) => {
    if (!newValue || !dayjs(newValue).isValid()) {
      setSupplierdateerror("Invalid date");
      setSupplierdate(null);
      return;
    }

    // const today = dayjs();
    // const minDate = today.subtract(3, "day");
    // const maxDate = today.add(2, "day");

    // if (newValue.isBefore(minDate) || newValue.isAfter(maxDate)) {
    //   setSupplierdateerror("You can select only 2 days before or after today");
    // } else {
    //   setSupplierdateerror("");
    // }

    setSupplierdateerror("");
    setSupplierdate(dayjs(newValue));
  };




  const handleInputChange = (index, field, value) => {
    const updatedRows = [...rows];
    updatedRows[index][field] = value;

    // Always fetch rate based on BookId
    const selectedBook = bookOptions.find(
      (book) => book.value === updatedRows[index].BookId
    );
    updatedRows[index].Rate = selectedBook
      ? parseFloat(selectedBook.price) || 0
      : 0;

    // Parse inputs
    const copies = parseFloat(updatedRows[index].Copies) || 0;
    const rate = parseFloat(updatedRows[index].Rate) || 0;
    const discountPercentage =
      parseFloat(updatedRows[index].DiscountPercentage) || 0;

    // Calculate original amount
    const originalAmount = copies * rate;

    // Calculate discount
    const discountAmount = (originalAmount * discountPercentage) / 100;

    // Final amount after discount
    const amountAfterDiscount = originalAmount - discountAmount;

    // Set values
    updatedRows[index].DiscountAmount = discountAmount;
    updatedRows[index].Amount = amountAfterDiscount;

    setRows(updatedRows);
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
    toast.success("Book Details Deleted Succefully");
    calculateTotals();
  };

  const resetForm = () => {
    // setInvertDate("");
    setInwarddate(dayjs());
    setInwarderror("");
    setInvertNo("");
    setAccountId("");
    setDcno("");
    // setDcdate("");
    setSupplierdate(dayjs());
    setSupplierdateerror("");

    setTotalAmount("");
    setTotalCopies("");
    setRemark("");
    setIsPaperPurchase("");
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
    const invertchallan = invertchallans[currentRow.index];

    // Filter purchase details to match the selected PurchaseId
    const invertchallandetail = invertdetails.filter(
      (detail) => detail.InvertId === invertchallan.Id
    );

    // Map the details to rows
    let mappedRows = invertchallandetail.map((detail) => ({
      // InvertId:200,
      InvertId: detail.InvertId,
      BookId: detail.BookId,
      Copies: detail.Copies,
      Rate: detail.Rate,
      DiscountPercentage: detail.DiscountPercentage,
      DiscountAmount: detail.DiscountAmount,
      Amount: detail.Amount,
      Id: detail.Id, // Include the detail Id in the mapped row for tracking
    }));

    // ⭐ No API call needed — match from local bookOptions
    mappedRows = mappedRows.map((row) => {
      const book = bookOptions.find((b) => b.value === row.BookId);

      return {
        ...row,
        BookCode: book?.code || "",
        BookName: book?.label || "",
        Rate: row.Rate || book?.price || 0,
      };
    });

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

    const invertdate = dayjs(invertchallan.InvertDate.date);
    const dcdate = dayjs(invertchallan.DCDate.date);

    // Set the form fields
    // setInvertDate(invertdate);
    setInwarddate(invertdate);
    setInvertNo(invertchallan.InvertNo);

    setAccountId(invertchallan.AccountId);
    setDcno(invertchallan.DCNo);
    // setDcdate(dcdate);

    setSupplierdate(dcdate);
    setTotalAmount(invertchallan.TotalAmount);
    setTotalCopies(invertchallan.TotalCopies);
    setRemark(invertchallan.Remark);
    setIsPaperPurchase(invertchallan.IsPaperPurchase);

    //   console.log(invertchallan, 'invert challan ');
    //   console.log(invertchallandetail, 'invert challan detail')
    // console.log(mappedRows, 'mapped rows')
    // Set the rows for the table with all the details
    setRows(mappedRows);

    // Set editing state
    setEditingIndex(currentRow.index);
    setIsModalOpen(true);
    setIsEditing(true);
    setId(invertchallan.Id);
    handleMenuClose();
    // Determine which specific detail to edit
    const specificDetail = invertchallandetail.find(
      (detail) => detail.Id === currentRow.original.Id
    );
    if (specificDetail) {
      setInvertDetailId(specificDetail.Id); // Set the specific detail Id
    }

    fetchInvertDetail().then(() => {
      setIsLoading(false); // Stop loading after data is fetched
    });
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

    const urlencoded = new URLSearchParams();
    urlencoded.append("Id", deleteId);

    const requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: urlencoded,
      redirect: "follow",
    };

    fetch(
      "https://publication.microtechsolutions.net.in/php/Invertchallanheaderdelete.php",
      requestOptions
    )
      .then((response) => response.text())
      .then((result) => console.log(result))
      .catch((error) => console.error(error));
    toast.success("Inward Challan Deleted Successfully");
    setIsDeleteDialogOpen(false);
    // setDeleteIndex(deleteIndex)
    fetchInvertChallan();
  };

  const cancelDelete = () => {
    setIsDeleteDialogOpen(false);
    setDeleteIndex(null);
  };

  const bookCodeTimer = useRef(null);

  const handleBookCodeChange = (rowIndex, value) => {
    const updatedRows = [...rows];
    updatedRows[rowIndex].BookCode = value;
    setRows(updatedRows);

    // 🔴 Clear previous timer
    if (bookCodeTimer.current) {
      clearTimeout(bookCodeTimer.current);
    }

    // if book code is blank → reset row fields
    if (value.trim() === "") {
      updatedRows[rowIndex].BookName = "";
      updatedRows[rowIndex].BookNameMarathi = "";
      updatedRows[rowIndex].Price = "";
      updatedRows[rowIndex].BookRate = "";
      updatedRows[rowIndex].BookId = "";
      updatedRows[rowIndex].Copies = "";
      updatedRows[rowIndex].Amount = "";
      updatedRows[rowIndex].Discount = "";
      updatedRows[rowIndex].FinalAmount = "";

      setRows(updatedRows);
      return; // stop here
    }

    // 🟡 Wait until user finishes typing (500ms)
    bookCodeTimer.current = setTimeout(() => {
      // 🔒 Minimum length check (VERY IMPORTANT)
      if (value.length < 2) return;

      // Fetch data
      fetchBookDataForRow(rowIndex, value);
    }, 400);
  };

  const fetchBookDataForRow = async (rowIndex, bookCode) => {
    if (!bookCode) return; // guard clause

    try {
      const response = await fetch(
        `https://publication.microtechsolutions.net.in/php/Bookcodeget.php?BookCode=${bookCode}`
      );
      const data = await response.json();

      if (Array.isArray(data) && data.length > 0) {
        const book = data[0];

        setRows((prevRows) => {
          const updatedRows = [...prevRows];
          updatedRows[rowIndex] = {
            ...updatedRows[rowIndex],
            BookName: book.BookName || book.BookNameMarathi || "",
            Price: book.BookRate || 0,
            BookId: book.Id || "", // This is important
          };
          return updatedRows;
        });
      } else {
        // ❌ Now this WILL fire correctly
        toast.error("Invalid Book Code");
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to fetch Book");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // if (!val idateForm()) return;

    if (
      !inwarddate ||
      !dayjs(inwarddate).isValid() ||
      inwarderror ||
      !supplierdate ||
      !dayjs(supplierdate).isValid() ||
      supplierdateerror
    ) {
      toast.error("Please correct all the date fields before submitting.");
      return;
    }

    const formattedInvertDate = dayjs(inwarddate).format("YYYY-MM-DD");
    const formattedsupplierdate = dayjs(supplierdate).format("YYYY-MM-DD");

    const invertchallandata = {
      Id: isEditing ? id : "", // Include the Id for updating, null for new records
      InvertDate: formattedInvertDate,
      // InvertNo: InvertNo,
      AccountId: AccountId,
      DCNo: DCNo,
      DCDate: formattedsupplierdate,
      TotalAmount: TotalAmount,
      TotalCopies: TotalCopies,
      Remark: Remark,
      IsPaperPurchase: IsPaperPurchase,
      CreatedBy: !isEditing ? userId : undefined,
      UpdatedBy: isEditing ? userId : undefined,
    };

    try {
      const invertchallanurl = isEditing
        ? "https://publication.microtechsolutions.net.in/php/Invertchallanheaderupdate.php"
        : "https://publication.microtechsolutions.net.in/php/Invertchallanheaderpost.php";

      // Submit purchase header data
      const response = await axios.post(
        invertchallanurl,
        // qs.stringify(invertchallandata),
        invertchallandata,
        {
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
        }
      );

      // const purchasereturnId = isEditing ? id : parseInt(response.data.newId, 10);
      const invertid = isEditing ? id : parseInt(response.data.Id, 10);

      for (const row of rows) {
        const rowData = {
          InvertId: invertid,
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

        const invertchallandetailurl =
          isEditing && row.Id
            ? "https://publication.microtechsolutions.net.in/php/Invertchallandetailupdate.php"
            : "https://publication.microtechsolutions.net.in/php/Invertchallandetailpost.php";

        await axios.post(invertchallandetailurl, qs.stringify(rowData), {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
        });
      }

      fetchInvertChallan();
      fetchInvertDetail();
      setIsModalOpen(false);
      toast.success(
        isEditing
          ? "Inward challan & Inward challan Details updated successfully!"
          : "Inward challan & Inward Challan Details added successfully!"
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
        accessorKey: "InvertNo",
        header: "Inward Challan No",
        size: 50,
      },
      {
        accessorKey: "InvertDate.date",
        header: "Inward Date",
        size: 50,
        Cell: ({ cell }) => {
          // Using moment.js to format the date
          const date = moment(cell.getValue()).format("DD-MM-YYYY");
          return <span>{date}</span>;
        },
      },

      {
        accessorKey: "TotalAmount",
        header: "Total",
        size: 50,
      },

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
    [invertchallans]
  );

  const table = useMaterialReactTable({
    columns,
    data: invertchallans,
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
    <div className="invertc-container">
      <h1>Inward Challan</h1>

      <div className="invertctable-master">
        <div className="invertctable1-master">
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
          <div className="invertctable-container">
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
          </div>
        </div>

        {isModalOpen && (
          <div
            className="invertc-overlay"
            onClick={() => setIsModalOpen(false)}
          />
        )}

        <Modal open={isModalOpen}>
          <div className="invertc-modal">
            <h2
              style={{
                textAlign: "center",
                fontWeight: "620",
                margin: "2px",
                fontSize: "27px",
              }}>
              {editingIndex >= 0
                ? "Edit Inward Challan "
                : "Add Inward Challan"}
            </h2>
            <form className="invertc-form">
              <div>
                <label className="invertc-label">Inward No</label>
                <div>
                  <input
                    type="text"
                    id="InvertNo"
                    name="InvertNo"
                    value={InvertNo}
                    onChange={(e) => setInvertNo(e.target.value)}
                    style={{ background: "#f5f5f5" }}
                    className="invertc-control"
                    placeholder="Auto-Incremented"
                    readOnly
                  />
                </div>
              </div>

              <div>
                <label className="invertc-label">Inward Date</label>
                <div>
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DatePicker
                      value={inwarddate}
                      onChange={handleDateChange1}
                      format="DD-MM-YYYY"
                      slotProps={{
                        textField: {
                          size: "small",
                          fullWidth: true,
                          error: !!inwarderror,
                          helperText: inwarderror,
                        },
                      }}
                      sx={{
                        marginTop: "10px",
                        marginBottom: "5px",
                        width: "180px",
                      }}
                    />
                  </LocalizationProvider>
                </div>
              </div>

              <div>
                <label className="invertc-label"> Account</label>
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
                    sx={{ mt: 1.25, mb: 0.625, width: 450 }} // Equivalent to 10px and 5px
                  />
                </div>
              </div>

              <div>
                <label className="invertc-label">Supplier DC No</label>
                <div>
                  <input
                    type="text"
                    id="DCNo"
                    name="DCNo"
                    value={DCNo}
                    onChange={(e) => setDcno(e.target.value)}
                    maxLength={20}
                    className="invertc-control"
                    placeholder="Enter DC No"
                  />
                </div>
              </div>

              <div>
                <label className="invertc-label">Supplier DC Date</label>
                <div>
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DatePicker
                      value={supplierdate}
                      onChange={handleDateChange2}
                      format="DD-MM-YYYY"
                      slotProps={{
                        textField: {
                          size: "small",
                          fullWidth: true,
                          error: !!supplierdateerror,
                          helperText: supplierdateerror,
                        },
                      }}
                      sx={{
                        marginTop: "10px",
                        marginBottom: "5px",
                        width: "165px",
                      }}
                    />
                  </LocalizationProvider>
                </div>
              </div>
            </form>

            <div className="invertc-table">
              <table>
                <thead>
                  <tr>
                    <th>Serial No</th>
                    <th>Book Code</th>
                    <th>Book Name</th>
                    <th>Copies</th>
                    <th>Rate</th>
                    <th>Discount %</th>
                    <th>Amount</th>
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
                          <input
                            type="text"
                            value={row.BookCode || ""}
                            onChange={(e) =>
                              handleBookCodeChange(index, e.target.value)
                            }
                            placeholder="Enter Book Code"
                            style={{ width: "100px" }}
                            className="invertc-control"
                          />
                        </td>
                        <td>
                          <input
                            type="text"
                            value={row.BookName || row.BookNameMarathi || ""}
                            readOnly
                            placeholder="Book Name / Book Name Marathi"
                            style={{ width: "420px" }}
                            className="invertc-control"
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
                              width: "65px",
                            }}
                            className="invertc-control"
                            placeholder="Copies"
                          />
                        </td>
                        <td>
                          <input
                            type="text"
                            // value={row.Rate || row.BookRate || ""}

                            value={row.Price || row.Rate || ""}
                            readOnly
                            placeholder="Rate"
                            style={{ width: "100px" }}
                            className="invertc-control"
                          />
                        </td>
                        <td>
                          <input
                            type="number"
                            value={row.DiscountPercentage || ""}
                            onChange={(e) =>
                              handleInputChange(
                                index,
                                "DiscountPercentage",
                                e.target.value
                              )
                            }
                            style={{ width: "80px" }}
                            className="invertc-control"
                            placeholder="Discount"
                          />
                        </td>

                        <td>
                          <input
                            type="number"
                            value={row.Amount || ""}
                            readOnly
                            style={{ width: "100px" }}
                            placeholder="Amount"
                            className="invertc-control"
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
            <form className="invertc-form">
              <div>
                <label className="invertc-label">Total Copies</label>
                <div>
                  <input
                    type="text"
                    id="TotalCopies"
                    name="TotalCopies"
                    value={TotalCopies}
                    onChange={(e) => setTotalCopies(e.target.value)}
                    style={{
                      fontSize: "1.2rem",
                      fontWeight: "bold",
                      color: "black",
                    }}
                    className="invertc-control"
                    placeholder="Enter Total Copies"
                  />
                </div>
              </div>

              <div>
                <label className="invertc-label">Total Amount</label>
                <div>
                  <input
                    type="text"
                    id="TotalAmount"
                    name="TotalAmount"
                    value={TotalAmount}
                    onChange={(e) => {
                      const value = e.target.value;

                      // Regex to validate decimal numbers with at most 18 digits total and 2 decimal places
                      const regex = /^\d{0,18}(\.\d{0,2})?$/;

                      // Check if the value matches the regex
                      if (value === "" || regex.test(value)) {
                        setTotalAmount(value);
                      }
                    }}
                    style={{
                      fontSize: "1.2rem",
                      fontWeight: "bold",
                      color: "green",
                    }}
                    readOnly
                    className="invertc-control"
                    placeholder="Enter Total Amount"
                  />
                </div>
              </div>

              <div>
                <label className="invertc-label">Is Paper Purchase?:</label>

                <input
                  type="checkbox"
                  id="IsPaperPurchase"
                  name="IsPaperPurchase"
                  checked={IsPaperPurchase}
                  onChange={(e) => setIsPaperPurchase(e.target.checked)}
                  className="invertc-control"
                  placeholder="Enter Is Paper Purchase"
                />
              </div>
            </form>
            <div className="invertc-btn-container">
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

        {/* Confirmation Dialog for Delete */}
        <Dialog open={isDeleteDialogOpen} onClose={cancelDelete}>
          <DialogTitle style={{ color: "navy", fontWeight: "600" }}>
            Confirm Deletion
          </DialogTitle>
          <DialogContent>
            Are you sure you want to delete this{" "}
            <b style={{ color: "red" }}>
              <u>Inward Challan</u>
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

export default Invertchallan;
