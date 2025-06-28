import React, { useState, useMemo, useEffect } from "react";
import "./SalesChallan.css";
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

function SalesChallan() {
  const [userId, setUserId] = useState("");
  const [yearid, setYearId] = useState("");
  const [dateError, setDateError] = useState(false);

  useEffect(() => {
    const storedUserId = sessionStorage.getItem("UserId");
    // const storedYearId = sessionStorage.getItem("YearId");

    if (storedUserId) {
      setUserId(storedUserId);
    } else {
      toast.error("User is not logged in.");
    }

    // if (storedYearId) {
    //   setYearId(storedYearId);
    // } else {
    //   toast.error("Year is not set.");
    // }

    fetchSellschallan();
  }, []);

  const [pageIndex, setPageIndex] = useState(1); // Current page
  const [totalPages, setTotalPages] = useState(1);

  const [anchorEl, setAnchorEl] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(null);
  const [selectedIndex, setSelectedIndex] = useState(null);
  const [ChallanNo, setChallanNo] = useState(null);
  const [ChallanDate, setChallanDate] = useState("");
  const [AccountId, setAccountId] = useState("");
  const [TotalCopies, setTotalcopies] = useState("");
  const [TotalAmount, setTotalamount] = useState("");
  const [Transport, setTransport] = useState("");

  const [PrintDCNo, setPrintDCno] = useState("");
  const [PrintCopies, setPrintcopies] = useState("");

  const handleafterprint = (e) => {
    e.preventDefault();
  };

  const [editingIndex, setEditingIndex] = useState(-1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [id, setId] = useState("");

  const [sellschallandetailId, setSellschallandetailId] = useState("");
  const [errors, setErrors] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [selleschallans, setSellschallans] = useState([]);
  const [sellschallanDetails, setSellschallanDetails] = useState([]);

  //Dropdown for ID's
  const [bookOptions, setBookOptions] = useState([]);
  const [accountOptions, setAccountOptions] = useState([]);

  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [deleteIndex, setDeleteIndex] = useState(null);
  const [deleteId, setDeleteId] = useState(null);

  const [rows, setRows] = useState([
    {
      SerialNo: "",
      BookId: "",
      Copies: "",
      Rate: "",
      Amount: "",
    },
  ]);

  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const handleDrawerOpen = () => {
    setIsDrawerOpen(true);
  };

  const handleDrawerClose = () => {
    setIsDrawerOpen(false);
  };

  const [currentRow, setCurrentRow] = useState(null);

  const handleMenuOpen = (event, row) => {
    setAnchorEl(event.currentTarget);
    setCurrentRow(row);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  useEffect(() => {
    // fetchSellschallan();
    fetchSellschallandetails();
    fetchBooks();
    fetchAccounts();
    fetchSellschallan();
  }, []);

  useEffect(() => {
    fetchSellschallan();
    console.log("this function is called");
  }, [pageIndex]); // Fetch data when page changes

  const fetchSellschallan = async () => {
    try {
      const response = await axios.get(
        `https://publication.microtechsolutions.net.in/php/get/gettblpage.php?Table=SellsChallanHeader&PageNo=${pageIndex}`
      );
      // setSellschallans(response.data);
      console.log(response.data, "response of sells challan header");

      setSellschallans(response.data.data);
      setTotalPages(response.data.total_pages);
    } catch (error) {
      // toast.error("Error fetching sells challans:", error);
    }
  };

  const fetchSellschallandetails = async () => {
    try {
      const response = await axios.get(
        "https://publication.microtechsolutions.net.in/php/gettable.php?Table=SellsChallanDetail"
      );
      console.log(response.data, "response of sells challan details");
      setSellschallanDetails(response.data);
    } catch (error) {
      // toast.error("Error fetching sells challan details:", error);
    }
  };

  const handleInputChange = (index, field, value) => {
    const updatedRows = [...rows];

    // Update the value of the current field
    updatedRows[index][field] = value;

    // Calculate the Amount when Copies and Rate are entered
    if (field === "Copies" || field === "Rate") {
      const copies = updatedRows[index].Copies || 0;
      const rate = updatedRows[index].Rate || 0;
      updatedRows[index].Amount = copies * rate;
    }

    // Calculate the DiscountAmount and FinalAmount when DiscountPercentage is entered
    if (
      field === "DiscountPercentage" ||
      field === "Copies" ||
      field === "Rate"
    ) {
      const discountPercentage = updatedRows[index].DiscountPercentage || 0;
      const amount = updatedRows[index].Amount || 0;
      updatedRows[index].DiscountAmount = (amount * discountPercentage) / 100;
      updatedRows[index].Amount = amount - updatedRows[index].DiscountAmount;
    }

    // Update the state with the new row data
    setRows(updatedRows);
    // calculateTotals();
  };

  const handleAddRow = () => {
    setRows([
      ...rows,
      {
        SerialNo: "",
        BookId: "",
        Copies: "",
        Rate: "",
        Amount: "",
      },
    ]);
  };

  const handleDeleteRow = (index) => {
    const updatedRows = rows.filter((_, i) => i !== index);
    setRows(updatedRows);
  };

  const fetchBooks = async () => {
    try {
      const response = await axios.get(
        "https://publication.microtechsolutions.net.in/php/Bookget.php"
      );
      const bookOptions = response.data.map((book) => ({
        value: book.Id,
        // label: book.BookNameMarathi,
        label: book.BookName || book.BookNameMarathi,

        code: book.BookCode,
      }));
      setBookOptions(bookOptions);
      console.log(bookOptions, "book options");
    } catch (error) {
      // toast.error("Error fetching books:", error);
    }
  };

  // const fetchBooks = async () => {
  //   try {
  //     const response = await axios.get(
  //       "https://publication.microtechsolutions.net.in/php/Bookget.php"
  //     );

  //     const bookOptions = response.data.map((book) => {
  //       const marathi = book.BookNameMarathi?.trim();
  //       const english = book.BookName?.trim();

  //       let label = "";
  //       if (marathi && english) {
  //         label = `${marathi} (${english})`;
  //       } else if (marathi) {
  //         label = marathi;
  //       } else if (english) {
  //         label = english;
  //       }

  //       return {
  //         value: book.Id,
  //         label: label,
  //         code: book.BookCode,
  //       };
  //     });

  //     setBookOptions(bookOptions);
  //     console.log(bookOptions, "book options");
  //   } catch (error) {
  //     console.error("Error fetching books:", error);
  //     // toast.error("Error fetching books");
  //   }
  // };

  // const [bookcodeoptions, setBookcodeoptions] = useState([]);

  //   const fetchBookcodes = async () => {
  //     try {
  //       const response = await axios.get("https://publication.microtechsolutions.net.in/php/Bookget.php");
  //       const bookcodeOptions = response.data.map((book) => ({
  //         value: book.Id,
  //         label: book.BookCode,
  //       }));
  //       setBookcodeoptions(bookcodeOptions);

  //       console.log(bookcodeOptions, 'bookcodes')
  //     } catch (error) {
  //       // toast.error("Error fetching book codes:", error);
  //     }
  //   };

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

  const resetForm = () => {
    setChallanDate("");
    setChallanNo("");
    setAccountId("");
    setTotalamount("");
    setTotalcopies("");
    setTransport("");
    setRows([
      {
        SerialNo: "",
        BookId: "",
        Copies: "",
        Rate: "",
        Amount: "",
      },
    ]);
  };

  const handleNewClick = () => {
    resetForm();
    setIsDrawerOpen(true);
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

    setIsLoading(true); // Start loading

    console.log(currentRow, "row");
    const sellschallan = selleschallans[currentRow.index];

    const sellschallandetail = sellschallanDetails.filter(
      (detail) => detail.ChallanId === sellschallan.Id
    );

    // Map the details to rows

    const mappedRows = sellschallandetail.map((detail) => ({
      // PurchaseReturnId: detail.PurchaseReturnId,

      ChallanId: detail.ChallanId,
      // SerialNo:detail.SerialNo,
      BookId: detail.BookId,
      Copies: detail.Copies,
      Rate: detail.Rate,
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

    const challanDate = convertDateForInput(sellschallan.ChallanDate?.date);

    // Set the form fields
    setChallanNo(sellschallan.ChallanNo);
    setChallanDate(challanDate);
    setAccountId(sellschallan.AccountId);
    setTotalcopies(sellschallan.TotalCopies);
    setTotalamount(sellschallan.TotalAmount);
    setTransport(sellschallan.Transport);

    console.log(sellschallan, "sells challan");
    console.log(sellschallandetail, "sells challan detail");
    console.log(mappedRows, "mapped rows");
    // Set the rows for the table with all the details
    setRows(mappedRows);

    // Set editing state
    setEditingIndex(currentRow.index);
    setIsDrawerOpen(true);
    setIsEditing(true);
    setId(sellschallan.Id);
    handleMenuClose();

    // Determine which specific detail to edit
    const specificDetail = sellschallandetail.find(
      (detail) => detail.Id === currentRow.original.Id
    );
    if (specificDetail) {
      setSellschallandetailId(specificDetail.Id); // Set the specific detail Id
    }

    fetchSellschallandetails().then(() => {
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

    // Prepare URL with dynamic parameters
    const url = `https://publication.microtechsolutions.net.in/php/deletetable.php?Id=${deleteId}&Table=SellsChallanHeader`;

    const urlencoded = new URLSearchParams();
    urlencoded.append("Id", deleteId);
    urlencoded.append("Table", "SellsChallanHeader");

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
        toast.success("Sales challan Deleted Successfully"); // Show success toast
        setIsDeleteDialogOpen(false); // Close delete dialog
        fetchSellschallan(); // Refresh vouchers list
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

  const validateForm = () => {
    let formErrors = {};
    let isValid = true;

    // if (!ChallanNo) {
    //   formErrors.ChallanNo = "Challan No  is required.";
    //   isValid = false;
    // }
    if (!ChallanDate) {
      formErrors.ChallanDate = "Challan Date is required.";
      isValid = false;
    }

    if (!AccountId) {
      formErrors.AccountId = "Account Id is required.";
      isValid = false;
    }
    if (!TotalCopies) {
      formErrors.TotalCopies = "Total copies is required.";
      isValid = false;
    }

    if (!TotalAmount) {
      formErrors.TotalAmount = "Total amount  is required.";
      isValid = false;
    }
    if (!Transport) {
      formErrors.Transport = "Transport is required.";
      isValid = false;
    }

    setErrors(formErrors);
    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    const formattedChallandate = moment(ChallanDate).format("YYYY-MM-DD");

    const sellschallandata = {
      Id: isEditing ? id : "", // Include the Id for updating, null for new records
      // ChallanNo: ChallanNo,
      ChallanDate: formattedChallandate,
      AccountId: AccountId,
      TotalCopies: TotalCopies,
      TotalAmount: TotalAmount,
      Transport: Transport,
      CreatedBy: !isEditing ? userId : undefined,
      UpdatedBy: isEditing ? userId : undefined,
    };

    try {
      const sellschallanurl = isEditing
        ? "https://publication.microtechsolutions.net.in/php/Sellschallanheaderupdate.php"
        : "https://publication.microtechsolutions.net.in/php/Sellschallanheaderpost.php";

      // Submit purchase header data
      const response = await axios.post(
        sellschallanurl,
        qs.stringify(sellschallandata),
        {
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
        }
      );

      console.log(response.data, "selleschallan post");

      // const purchasereturnId = isEditing ? id : parseInt(response.data.newId, 10);
      const challanid = isEditing ? id : parseInt(response.data.Id, 10);

      for (const row of rows) {
        const rowData = {
          ChallanId: challanid,
          SerialNo: rows.indexOf(row) + 1,
          BookId: parseInt(row.BookId, 10),
          Copies: parseInt(row.Copies, 10),
          Rate: parseFloat(row.Rate),
          Amount: parseFloat(row.Amount),
          Id: row.Id,
          CreatedBy: row.Id ? undefined : userId,
          UpdatedBy: row.Id ? userId : undefined,
        };

        // if (isEditing && row.Id) {
        //   // If editing, include PurchasedetailId for the update
        //   rowData.Id = row.PurchaseId;
        // }

        const sellschallandetailurl =
          isEditing && row.Id
            ? "https://publication.microtechsolutions.net.in/php/Sellschallandetailupdate.php"
            : "https://publication.microtechsolutions.net.in/php/Sellschallandetailpost.php";

        await axios.post(sellschallandetailurl, qs.stringify(rowData), {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
        });
      }

      fetchSellschallan();
      fetchSellschallandetails();
      setIsDrawerOpen(false);
      toast.success(
        isEditing
          ? "Sales challan & Sells challan Details updated successfully!"
          : "Sales challan & Sells challan Details added successfully!"
      );
      resetForm(); // Reset the form fields after successful submission
    } catch (error) {
      console.error("Error saving record:", error);
      toast.error("Error saving record!");
    }
  };

  const navigate = useNavigate();

  const handlePrint = () => {
    navigate(
      `/transaction/saleschallan/saleschallanprint/${currentRow.original.Id}`
    );
  };

  // console.log(currentRow.original.Id, 'Id sending for print')

  const columns = useMemo(
    () => [
      {
        accessorKey: "SrNo",
        header: "Sr.No",
        size: 50,
        Cell: ({ row }) => row.index + 1,
      },

      {
        accessorKey: "ChallanNo",
        header: "Challan No",
        size: 50,
      },
      {
        accessorKey: "ChallanDate.date",
        header: "Challan Date",
        size: 50,
        Cell: ({ cell }) => {
          // Using moment.js to format the date
          const date = moment(cell.getValue()).format("DD-MM-YYYY");
          return <span>{date}</span>;
        },
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
    [selleschallans]
  );

  const table = useMaterialReactTable({
    columns,
    data: selleschallans,
    enablePagination: false,
    muiTableHeadCellProps: {
      style: {
        backgroundColor: "#E9ECEF", // Replace with your desired color
        color: "black",
        fontSize: "16px",
      },
    },
  });

  useEffect(() => {
    const totalCopiesSum = rows.reduce(
      (sum, row) => sum + Number(row.Copies || 0),
      0
    );
    const totalAmountSum = rows.reduce(
      (sum, row) => sum + Number(row.Amount || 0),
      0
    );

    setTotalcopies(totalCopiesSum);
    setTotalamount(totalAmountSum);
  }, [rows]); // Runs whenever 'rows' change

  return (
    <div className="saleschallan-container">
      <h1>Sales Challan</h1>

      <div className="saleschallantable-master">
        <div className="saleschallantable1-master">
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
          <div className="saleschallantable-container">
            <Box mt={2}>
              <MaterialReactTable table={table} />
              <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleMenuClose}>
                <MenuItem onClick={handleEdit}>Edit</MenuItem>
                <MenuItem onClick={handleDelete}>Delete</MenuItem>

                <MenuItem onClick={handlePrint}>Print</MenuItem>
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

        {isDrawerOpen && <div onClick={() => setIsDrawerOpen(false)} />}

        <Drawer
          anchor="right"
          open={isDrawerOpen}
          // onClose={handleDrawerClose}
          PaperProps={{
            sx: {
              borderRadius: isSmallScreen ? "0" : "10px 0 0 10px",
              width: isSmallScreen ? "100%" : "70%",
              zIndex: 1000,
            },
          }}>
          <Box
            sx={{
              padding: 2,
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}>
            <Typography variant="h6">
              <b>{isEditing ? "Edit Sales Challan" : "Create Sales Challan"}</b>
            </Typography>{" "}
            <CloseIcon sx={{ cursor: "pointer" }} onClick={handleDrawerClose} />
          </Box>
          {/* <Divider
sx={{
width: '1000px',
borderColor: 'navy', 
borderWidth: 1, 

}}
/> */}

          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: 1,
              m: 1,
              mt: 2,
            }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              <Box flex={3}>
                <Typography variant="body2" fontWeight="bold">
                  Challan No
                </Typography>
                <TextField
                  value={ChallanNo}
                  onChange={(e) => setChallanNo(e.target.value)}
                  size="small"
                  margin="none"
                  style={{ background: "#f5f5f5" }}
                  placeholder="Auto-Incremented"
                  InputProps={{ readOnly: true }}
                  fullWidth
                />
              </Box>

              <Box flex={3}>
                <Typography variant="body2" fontWeight="bold">
                  {" "}
                  Challan Date
                </Typography>
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                  <DatePicker
                    value={ChallanDate ? new Date(ChallanDate) : null} // Convert to Date object
                    onChange={(newValue) => setChallanDate(newValue)}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        error={!!errors.ChallanDate}
                        helperText={errors.ChallanDate}
                      />
                    )}
                    slotProps={{
                      textField: { size: "small", fullWidth: true },
                    }}
                    format="dd-MM-yyyy"
                  />
                </LocalizationProvider>
                {/* {errors.ChallanDate && (
                  <b className="error-text">{errors.ChallanDate}</b>
                )} */}
              </Box>

              <Box flex={3}>
                <Typography fontWeight="bold" variant="body2">
                  Party Name
                </Typography>
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
                      placeholder="Select Party Name"
                      size="small"
                      margin="none"
                      fullWidth
                    />
                  )}
                />
              </Box>

              <Box flex={3}>
                <Typography variant="body2" fontWeight="bold">
                  Parcel
                </Typography>
                <TextField
                  value={Transport}
                  onChange={(e) => setTransport(e.target.value)}
                  size="small"
                  margin="none"
                  placeholder="Parcel"
                  fullWidth
                />
              </Box>
            </Box>
            <div className="saleschallan-table">
              <table>
                <thead>
                  <tr>
                    <th>Serial No</th>
                    <th>
                      Book Code<b className="required">*</b>
                    </th>
                    <th>
                      Book Name<b className="required">*</b>
                    </th>
                    <th>
                      Copies<b className="required">*</b>
                    </th>
                    <th>
                      Price<b className="required">*</b>
                    </th>
                    <th>
                      Amount<b className="required">*</b>
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
                            sx={{ width: "200px" }} // Set width
                            getOptionLabel={(option) => option.label} // Fix the typo
                            renderInput={(params) => (
                              <TextField
                                {...params}
                                placeholder="Select Book"
                                size="small"
                                fullWidth
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
                            placeholder="Copies"
                          />
                        </td>
                        <td>
                          <input
                            type="number"
                            value={row.Rate}
                            onChange={(e) =>
                              handleInputChange(index, "Rate", e.target.value)
                            }
                            placeholder="Rate"
                          />
                        </td>

                        <td>
                          <input
                            type="number"
                            value={row.Amount}
                            readOnly
                            placeholder="Amount"
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

            <Box
              display="flex"
              justifyContent="flex-end"
              mt={0.5}
              gap={1}
              mb={3}>
              <Box>
                <Typography variant="body2" fontWeight="bold">
                  Total Copies
                </Typography>
                <TextField
                  value={TotalCopies}
                  onChange={(e) => setTotalcopies(e.target.value)}
                  size="small"
                  margin="none"
                  placeholder="Total copies"
                  fullWidth
                />
              </Box>

              <Box>
                <Typography variant="body2" fontWeight="bold">
                  Total Amount
                </Typography>
                <TextField
                  value={TotalAmount}
                  onChange={(e) => setTotalamount(e.target.value)}
                  size="small"
                  margin="none"
                  placeholder="Total Amount"
                  fullWidth
                />
              </Box>
            </Box>

            {/* <Box display="flex" justifyContent="flex-start" mt={2} gap={2}>
              <Box >
                <Typography variant="body2" fontWeight='bold'>Print DC No</Typography>
                <TextField
                  value={PrintDCNo} // Calculate total credit
                  onChange={(e) => setPrintDCno(e.target.value)}
                  placeholder="DC No"
                  size="small"
                    margin="none" fullWidth
                />
              </Box>


              <Box >
                <Typography variant="body2" fontWeight='bold'>Copies</Typography>
                <TextField
                  value={PrintCopies} // Calculate total credit
                  onChange={(e) => setPrintcopies(e.target.value)}
                  placeholder="Print Copies"
                  size="small"
                    margin="none"  fullWidth
                />
              </Box>


            </Box> */}
          </Box>

          <Box
            display={"flex"}
            alignItems={"center"}
            justifyContent={"center"}
            gap={1}
            m={1}>
            <Button
              variant="contained"
              onClick={handleSubmit}
              sx={{
                backgroundColor: "#0a60bd",
                color: "white",
                "&:hover": {
                  backgroundColor: "navy", // Darker shade on hover (optional)
                },
              }}>
              {isEditing ? "Update" : "Save"}
            </Button>

            <Box>
              <Button
                onClick={handleDrawerClose}
                variant="contained" // Use 'contained' to apply background color styles
                sx={{
                  backgroundColor: "red", // Set background color to red
                  color: "white", // Optional: text color inside the button
                  "&:hover": {
                    backgroundColor: "darkred", // Darker shade on hover (optional)
                  },
                }}>
                Cancel
              </Button>
            </Box>
          </Box>
        </Drawer>

        <Dialog open={isDeleteDialogOpen} onClose={cancelDelete}>
          <DialogTitle style={{ color: "navy", fontWeight: "600" }}>
            Confirm Deletion
          </DialogTitle>
          <DialogContent>
            Are you sure you want to delete this{" "}
            <b style={{ color: "red" }}>
              <u>Sells Challan</u>
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

export default SalesChallan;
