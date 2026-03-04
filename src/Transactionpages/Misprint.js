import React, {
  useState,
  useMemo,
  useEffect,
  useSyncExternalStore,
} from "react";
import "./Misprint.css";
import Select from "react-select";
import axios from "axios";
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  Button,
  TextField,
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
  MaterialReactTable,
  useMaterialReactTable,
} from "material-react-table";
import { ToastContainer, toast } from "react-toastify";
import {
  Alert,
  useMediaQuery,
  Autocomplete,
  Drawer,
  Divider,
} from "@mui/material";
import "react-toastify/dist/ReactToastify.css";
import moment from "moment";
import qs from "qs";
import { useTheme } from "@mui/material/styles";
import { Edit, Delete, Add, MoreVert, Print } from "@mui/icons-material";
import CloseIcon from "@mui/icons-material/Close";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { DatePicker } from "@mui/x-date-pickers";
import { RiDeleteBin5Line } from "react-icons/ri";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import { useRef } from "react";

function Misprint() {
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

    fetchMisprints();
  }, []);

  const [pageIndex, setPageIndex] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(false);

  const [anchorEl, setAnchorEl] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(null);
  const [selectedIndex, setSelectedIndex] = useState(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [deleteIndex, setDeleteIndex] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const [ChallanNo, setChallanNo] = useState(null);
  const [Date, setDate] = useState("");
  const [Particulars, setParticulars] = useState("");
  const [AccountId, setAccountId] = useState("");

  const [editingIndex, setEditingIndex] = useState(-1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [id, setId] = useState("");

  const [misprintdetailId, setMisprintdetailId] = useState("");
  const [errors, setErrors] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [misprints, setMisprints] = useState([]);
  const [misprintdetails, setMisprintdetails] = useState([]);

  const [bookCodes, setBookcodes] = useState([]);
  const [bookOptions, setBookOptions] = useState([]);
  const [accountOptions, setAccountOptions] = useState([]);

  const [TotalCopies, setTotalCopies] = useState("");
  const [TotalAmount, setTotalAmount] = useState("");

  const [rows, setRows] = useState([
    {
      BookId: "", // Default value for the first row
      Copies: 0,
      BookRate: 0,
      DiscountPercentage: 0,
      DiscountAmount: 0,
      Amount: 0,
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
    fetchBooks();
    fetchAccounts();
    fetchMisprintdetails();
  }, []);

  useEffect(() => {
    fetchMisprints();
    console.log("this function is called");
  }, [pageIndex]);

  const fetchMisprints = async () => {
    try {
      const response = await axios.get(
        `https://publication.microtechsolutions.net.in/php/get/gettblpage.php?Table=Missprint&PageNo=${pageIndex}`
      );
      console.log(response.data, "response of missprint header");

      setMisprints(response.data.data);
      setTotalPages(response.data.total_pages);
    } catch (error) {
      console.error("Error fetching convassor headers:", error);
    }
  };

  const fetchMisprintdetails = async () => {
    try {
      const response = await axios.get(
        "https://publication.microtechsolutions.net.in/php/get/gettable.php?Table=Missprintdetail"
      );
      console.log(response.data, "response of missprint details");
      setMisprintdetails(response.data);
    } catch (error) {
      console.error("Error fetching missprint details:", error);
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

  const [safedate, setSafedate] = useState(dayjs());
  const [dateerror, setdateerror] = useState("");

  const handleDateChange1 = (newValue) => {
    if (!newValue || !dayjs(newValue).isValid()) {
      setdateerror("Invalid date");
      setSafedate(null);
      return;
    }

    // const today = dayjs();
    // const minDate = today.subtract(3, "day");
    // const maxDate = today.add(2, "day");

    // if (newValue.isBefore(minDate) || newValue.isAfter(maxDate)) {
    //   setdateerror("You can select only 2 days before or after today");
    // } else {
    //   setdateerror("");
    // }

    setdateerror("");

    setSafedate(dayjs(newValue));
  };

  const handleInputChange = (index, field, value) => {
    const updatedRows = [...rows];
    updatedRows[index][field] = value;

    // Always fetch rate based on BookId
    const selectedBook = bookOptions.find(
      (book) => book.value === updatedRows[index].BookId
    );
    updatedRows[index].BookRate = selectedBook
      ? parseFloat(selectedBook.price) || 0
      : 0;

    // Parse inputs
    const copies = parseFloat(updatedRows[index].Copies) || 0;
    const rate = parseFloat(updatedRows[index].BookRate) || 0;
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

  const handleAddRow = () => {
    setRows([
      ...rows,
      {
        BookId: "", // This will be empty for new rows
        SerialNo: "",
        Copies: "",
        BookRate: "",
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
    const url = `https://publication.microtechsolutions.net.in/php/deletetable.php?Id=${deleteId}&Table=Missprint`;

    const urlencoded = new URLSearchParams();
    urlencoded.append("Id", deleteId);
    urlencoded.append("Table", "Missprint");

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
        toast.success("Missprint Deleted Successfully"); // Show success toast
        setIsDeleteDialogOpen(false); // Close delete dialog
        fetchMisprints(); // Refresh vouchers list
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
    setAccountId("");
    setChallanNo("");
    // setDate("");
    setSafedate(dayjs());
    setdateerror("");
    setParticulars("");
    setRows([
      {
        BookCode: "",
        BookId: "", // Default value for the first row
        Copies: 0,
        BookRate: 0,
        Amount: 0,
      },
    ]);
  };

  const handleNewClick = () => {
    resetForm();
    setIsDrawerOpen(true);
    setIsEditing(false);
    setEditingIndex(-1);
  };

  const [idwiseData, setIdwiseData] = useState("");

  const handleEdit = () => {
    if (currentRow) {
      console.log("Editing item with ID:", currentRow.original.Id);
      setIdwiseData(currentRow.original.Id);
    }
    setIsLoading(true);

    console.log(currentRow, "row");
    const misprint = misprints[currentRow.index];

    console.log(misprint, "misprint to edit ");
    // Filter purchase details to match the selected PurchaseId
    const misprintdetail = misprintdetails.filter(
      (detail) => detail.MissprintId === misprint.Id
    );

    // Map the details to rows
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

    let mappedRows = misprintdetail.map((detail) => ({
      // PurchaseReturnId: detail.PurchaseReturnId,

      MissprintId: detail.MissprintId,
      // SerialNo:detail.SerialNo,
      BookId: detail.BookId,
      Copies: detail.Copies,
      BookRate: detail.BookRate,
      Amount: detail.Amount,
      Id: detail.Id, // Include the detail Id in the mapped row for tracking
    }));

    mappedRows = mappedRows.map((row) => {
      const book = bookOptions.find((b) => b.value === row.BookId);

      return {
        ...row,
        BookCode: book?.code || "",
        BookName: book?.label || "",
        Rate: row.Rate || book?.price || 0,
      };
    });

    const date = dayjs(misprint.Date?.date);

    // Set the form fields
    setChallanNo(misprint.ChallanNo);
    // setDate(date);
    setSafedate(date);
    setParticulars(misprint.Particulars);
    setAccountId(misprint.AccountId);

    console.log(misprint, "misprint");
    console.log(misprintdetail, "misprint detail");
    console.log(mappedRows, "mapped rows");
    // Set the rows for the table with all the details
    setRows(mappedRows);

    // Set editing state
    setEditingIndex(currentRow.index);
    setIsDrawerOpen(true);
    setIsEditing(true);
    setId(misprint.Id);
    handleMenuClose();
    // Determine which specific detail to edit
    const specificDetail = misprintdetail.find(
      (detail) => detail.Id === currentRow.original.Id
    );
    if (specificDetail) {
      setMisprintdetailId(specificDetail.Id); // Set the specific detail Id
    }

    fetchMisprintdetails().then(() => {
      setIsLoading(false); // Stop loading after data is fetched
    });
  };

  const totalCopies = rows.reduce(
    (sum, row) => sum + (parseInt(row.Copies) || 0),
    0
  );

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

  useEffect(() => {
    calculateTotals();
  }, [rows]);

  const validateForm = () => {
    let formErrors = {};
    let isValid = true;

    setErrors(formErrors);
    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    if (!safedate || !dayjs(safedate).isValid() || dateerror) {
      toast.error("Please correct all the date fields before submitting.");
      return;
    }

    const formattedDate = dayjs(safedate).format("YYYY-MM-DD");

    const misprintData = {
      Id: isEditing ? id : "", // Include the Id for updating, null for new records
      ChallanNo: ChallanNo,
      Date: formattedDate, // Convert branch name to corresponding number
      Particulars: Particulars,
      AccountId: AccountId,
      Ttl_Copies: totalCopies,
      CreatedBy: !isEditing ? userId : undefined,
      UpdatedBy: isEditing ? userId : undefined,
    };

    try {
      const misprinturl = isEditing
        ? "https://publication.microtechsolutions.net.in/php/update/missprint.php"
        : "https://publication.microtechsolutions.net.in/php/post/missprint.php";

      // Submit purchase header data
      const response = await axios.post(
        misprinturl,
        qs.stringify(misprintData),
        {
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
        }
      );

      // const purchasereturnId = isEditing ? id : parseInt(response.data.newId, 10);
      const missprintId = isEditing ? id : parseInt(response.data.Id, 10);

      for (const row of rows) {
        const rowData = {
          MissprintId: missprintId,
          SerialNo: rows.indexOf(row) + 1,
          // BookCode: row.BookCode,
          BookId: row.BookId,
          Copies: row.Copies,
          BookRate: row.BookRate,
          Amount: row.Amount,
          Id: row.Id,
          CreatedBy: row.Id ? undefined : userId,
          UpdatedBy: row.Id ? userId : undefined,
        };

        const misprintdetailurl =
          isEditing && row.Id
            ? "https://publication.microtechsolutions.net.in/php/update/missprintdetail.php"
            : "https://publication.microtechsolutions.net.in/php/post/missprintdetail.php";

        await axios.post(misprintdetailurl, qs.stringify(rowData), {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
        });
      }

      fetchMisprints();
      fetchMisprintdetails();
      setIsDrawerOpen(false);
      toast.success(
        isEditing
          ? "Missprint & Missprint Details updated successfully!"
          : "Missprint  & Missprint Details added successfully!"
      );
      resetForm(); // Reset the form fields after successful submission
    } catch (error) {
      console.error("Error saving record:", error);
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
        accessorKey: "ChallanNo",
        header: "Challan No",
        size: 50,
      },
      {
        accessorKey: "Particulars",
        header: "Particulars",
        size: 50,
      },

      {
        accessorKey: "actions",
        header: "Actions",
        size: 150,
        Cell: ({ row }) => (
          <IconButton onClick={(event) => handleMenuOpen(event, row)}>
            <MoreVert />
          </IconButton>
        ),
      },
    ],
    [] // Remove misprints if it's not used inside the function
  );

  const table = useMaterialReactTable({
    columns,
    data: misprints,
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
    <div className="misprint-container">
      <h1>Missprint</h1>

      <div className="misprinttable-master">
        <div className="misprinttable1-master">
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
          <div className="misprinttable-container">
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

        {isDrawerOpen && <div onClick={() => setIsDrawerOpen(false)} />}

        <Drawer
          anchor="right"
          open={isDrawerOpen}
          // onClose={handleDrawerClose}
          PaperProps={{
            sx: {
              borderRadius: isSmallScreen ? "0" : "10px 0 0 10px",
              width: isSmallScreen ? "100%" : "80%",
              zIndex: 1000,
              paddingLeft: "16px",
            },
          }}>
          {/* <div className="bankreconcil-modal"> */}
          <Box
            sx={{
              padding: 2,
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}>
            <Typography variant="h6">
              <b>{isEditing ? "Edit Missprint" : "Create Missprint "}</b>
            </Typography>{" "}
            <CloseIcon sx={{ cursor: "pointer" }} onClick={handleDrawerClose} />
          </Box>
          <form className="misprint-form">
            <div>
              <label className="misprint-label">Challan No:</label>
              <div>
                <input
                  type="text"
                  id="ChallanNo"
                  name="ChallanNo"
                  value={ChallanNo}
                  onChange={(e) => setChallanNo(e.target.value)}
                  className="misprint-control"
                  style={{ background: "#f5f5f5" }}
                  placeholder="Auto-Incremented"
                  readOnly
                />
              </div>

              {/* <div>
                          {errors.ChallanNo && <b className="error-text">{errors.ChallanNo}</b>}
                        </div> */}
            </div>
            <div>
              <label className="misprint-label">Date:</label>
              <div>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DatePicker
                    value={safedate}
                    onChange={handleDateChange1}
                    format="DD-MM-YYYY"
                    slotProps={{
                      textField: {
                        size: "small",
                        fullWidth: true,
                        error: !!dateerror,
                        helperText: dateerror,
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

              {/* <div>
                          {errors.Date && <b className="error-text">{errors.Date}</b>}
                        </div> */}
            </div>

            <div>
              <label className="misprint-label">Particulars:</label>
              <div>
                <input
                  type="text"
                  id="Particulars"
                  name="Particulars"
                  value={Particulars}
                  onChange={(e) => setParticulars(e.target.value)}
                  style={{ width: "300px" }}
                  className="misprint-control"
                  placeholder="Enter Particulars"
                />
              </div>

              {/* <div>
                          {errors.Particulars && <b className="error-text">{errors.Particulars}</b>}
                        </div> */}
            </div>

            <div>
              <label className="misprint-label">Account Id:</label>
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
                  sx={{ mt: 1.25, mb: 0.625, width: 350 }} // Equivalent to 10px and 5px
                />
              </div>
              {/* <div>
                          {errors.AccountId && <b className="error-text">{errors.AccountId}</b>}
                        </div> */}
            </div>
          </form>

          <div className="misprint-table">
            <table>
              <thead>
                <tr>
                  <th>Serial No</th>
                  <th style={{ width: "80px", minWidth: "150px" }}>
                    Book Code
                  </th>
                  <th>Book Name</th>
                  <th>Copies</th>
                  <th> Rate</th>
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
                ) : rows.length === 0 ? (
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
                          className="misprint-control"
                        />
                      </td>
                      <td>
                        <input
                          type="text"
                          value={row.BookName || row.BookNameMarathi || ""}
                          readOnly
                          placeholder="Book Name / Book Name Marathi"
                          style={{ width: "420px" }}
                          className="misprint-control"
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
                          className="misprint-control"
                          placeholder="Copies"
                        />
                      </td>
                      <td>
                        <input
                          type="text"
                          value={row.BookRate || row.Price || ""}
                          readOnly
                          placeholder="Book Rate"
                          style={{ width: "100px" }}
                          className="misprint-control"
                        />
                      </td>

                      <td>
                        <input
                          type="number"
                          value={row.Amount || ""}
                          readOnly
                          style={{ width: "100px" }}
                          placeholder="Amount"
                          className="misprint-control"
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
              <tfoot>
                <tr>
                  <td
                    colSpan="3"
                    style={{
                      textAlign: "right",
                      fontWeight: "bold",
                      paddingLeft: "20px",
                    }}>
                    Total Copies:
                  </td>
                  <td
                    style={{
                      fontWeight: "bold",
                      paddingLeft: "10px", // 👈 adds space before Copies
                    }}>
                    {TotalCopies}
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>

          <div className="misprint-btn-container">
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
              onClick={() => setIsDrawerOpen(false)}
              style={{
                background: "red",
                color: "white",
              }}>
              Cancel
            </Button>
          </div>
        </Drawer>

        <Dialog open={isDeleteDialogOpen} onClose={cancelDelete}>
          <DialogTitle style={{ color: "navy", fontWeight: "600" }}>
            Confirm Deletion
          </DialogTitle>
          <DialogContent>
            Are you sure you want to delete this{" "}
            <b style={{ color: "red" }}>
              <u>Missprint</u>
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
export default Misprint;
