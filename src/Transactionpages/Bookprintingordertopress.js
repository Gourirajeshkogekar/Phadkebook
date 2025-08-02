import React, { useState, useMemo, useEffect } from "react";
import "./Bookprintingordertopress.css";
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
import { Edit, Delete, Add, MoreVert, Print, Bed } from "@mui/icons-material";
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
import dayjs from "dayjs";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers";
function Bookprintingordertopress() {
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

    fetchBookprintingorders();
  }, []);

  const [pageIndex, setPageIndex] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [OrderNo, setOrderno] = useState(null);
  const [Trans_dt, setTrans_dt] = useState("");
  const [PressId, setPressid] = useState("");
  const [BookCode, setBookcode] = useState("");
  const [BookId, setBookId] = useState("");
  const [BookStandardId, setBookStandardId] = useState("");
  const [Copies_to_print, setCopiestoprint] = useState("");
  const [PaperId, setPaperId] = useState("");
  const [Ordertype, setOrdertype] = useState("New"); // Default to "new"
  const [Ttl_forms, setTtl_forms] = useState("");
  const [PlateMakerId, setPlateMakerId] = useState("");
  const [Remarks, setRemarks] = useState("");

  //states for the Id's Array..
  const [pressOptions, setPressoptions] = useState([]);
  const [paperOptions, setPaperoptions] = useState([]);
  const [bookstandardOptions, setBookstandardOptions] = useState([]);
  const [bookOptions, setBookoptions] = useState([]);
  const [platemakerOptions, setPlatemakeroptions] = useState([]);

  const [editingIndex, setEditingIndex] = useState(-1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [id, setId] = useState("");

  const [bookprintingorderdetailId, setBookprintingorderdetailid] =
    useState("");
  const [errors, setErrors] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [bookprintingorders, setBookprintingorders] = useState([]);
  const [bookprintingorderdetails, setBookprintingorderdetails] = useState([]);

  const [anchorEl, setAnchorEl] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(null);
  const [selectedIndex, setSelectedIndex] = useState(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [deleteIndex, setDeleteIndex] = useState(null);
  const [deleteId, setDeleteId] = useState(null);

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

  const [rows, setRows] = useState([
    {
      From: "",
      To: "",
      No_of_forms: "",
      No_of_paper: "",
      Remarks: "",
    },
  ]);

  useEffect(() => {
    fetchBookPrintingdetails();
    fetchBooks();
    fetchBookcodes();
    fetchPapers();
    fetchPress();
    fetchPlatemakers();
    fetchStandards();
  }, []);

  useEffect(() => {
    fetchBookprintingorders();
    console.log("this function is called");
  }, [pageIndex]);

  const fetchBookprintingorders = async () => {
    try {
      const response = await axios.get(
        `https://publication.microtechsolutions.net.in/php/get/gettblpage.php?Table=BookPrintOrder&PageNo=${pageIndex}`
      );
      console.log(response.data, "response of book printing orders");

      setBookprintingorders(response.data.data);
      setTotalPages(response.data.total_pages);
    } catch (error) {
      console.error("Error fetching book printing orders:", error);
    }
  };

  const fetchBookPrintingdetails = async () => {
    try {
      const response = await axios.get(
        "https://publication.microtechsolutions.net.in/php/get/gettable.php?Table=BookPrintOrderDetail"
      );
      console.log(response.data, "response of book printing details");
      setBookprintingorderdetails(response.data);
    } catch (error) {
      console.error("Error fetching book printing details:", error);
    }
  };

  const fetchStandards = async () => {
    try {
      const response = await axios.get(
        "https://publication.microtechsolutions.net.in/php/Standardget.php"
      );
      const bookstandardOptions = response.data.map((std) => ({
        value: std.Id,
        label: std.StandardName,
      }));
      console.log(bookstandardOptions, "standards");
      setBookstandardOptions(bookstandardOptions);
    } catch (error) {
      // toast.error("Error fetching stds:", error);
    }
  };

  const fetchBooks = async () => {
    try {
      const response = await axios.get(
        "https://publication.microtechsolutions.net.in/php/Bookget.php"
      );
      const bookOptions = response.data.map((book) => ({
        value: book.Id,
        label: book.BookName,
      }));
      setBookoptions(bookOptions);
    } catch (error) {
      // toast.error("Error fetching books:", error);
    }
  };

  const [bookcodeoptions, setBookcodeoptions] = useState([]);

  const fetchBookcodes = async () => {
    try {
      const response = await axios.get(
        "https://publication.microtechsolutions.net.in/php/Bookget.php"
      );
      const bookcodeOptions = response.data.map((book) => ({
        value: book.Id,
        label: book.BookCode,
      }));
      setBookcodeoptions(bookcodeOptions);

      console.log(bookcodeOptions, "bookcodes");
    } catch (error) {
      // toast.error("Error fetching book codes:", error);
    }
  };

  const fetchPapers = async () => {
    try {
      const response = await axios.get(
        "https://publication.microtechsolutions.net.in/php/PaperSizeget.php"
      );
      const paperOptions = response.data.map((pp) => ({
        value: pp.Id,
        label: pp.PaperSizeName,
      }));
      setPaperoptions(paperOptions);
    } catch (error) {
      // toast.error("Error fetching papers:", error);
    }
  };

  const fetchPress = async () => {
    try {
      const response = await axios.get(
        "https://publication.microtechsolutions.net.in/php/PressMasterget.php"
      );
      const pressOptions = response.data.map((press) => ({
        value: press.Id,
        label: press.PressName,
      }));
      setPressoptions(pressOptions);
    } catch (error) {
      // toast.error("Error fetching press:", error);
    }
  };

  const fetchPlatemakers = async () => {
    try {
      const response = await axios.get(
        "https://publication.microtechsolutions.net.in/php/get/gettable.php?Table=PlateMaker"
      );
      const platemakerOptions = response.data.map((plate) => ({
        value: plate.Id,
        label: plate.Name,
      }));
      setPlatemakeroptions(platemakerOptions);
    } catch (error) {
      // toast.error("Error fetching plates:", error);
    }
  };

  const [transerror, setTranserror] = useState("");

  const [transdate, setTransdate] = useState(dayjs());

  const handleDateChange1 = (newValue) => {
    if (!newValue || !dayjs(newValue).isValid()) {
      setTranserror("Invalid date");
      setTransdate(null);
      return;
    }

    const today = dayjs();
    const minDate = today.subtract(3, "day");
    const maxDate = today.add(2, "day");

    if (newValue.isBefore(minDate) || newValue.isAfter(maxDate)) {
      setTranserror("You can select only 2 days before or after today");
    } else {
      setTranserror("");
    }

    setTransdate(newValue);
  };

  const handleInputChange = (index, field, value) => {
    const updatedRows = [...rows];

    // Update the value of the current field
    updatedRows[index][field] = value;

    // Update the state with the new row data
    setRows(updatedRows);
  };

  const TotalForms = rows.reduce(
    (total, row) => total + parseInt(row.No_of_forms || 0, 10),
    0
  );

  const handleAddRow = () => {
    setRows([
      ...rows,
      {
        From: "",
        To: "",
        No_of_forms: "",
        No_of_paper: "",
        Remarks: "",
      },
    ]);
  };

  const handleDeleteRow = (index) => {
    const updatedRows = rows.filter((_, i) => i !== index);
    setRows(updatedRows);
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
    const url = `https://publication.microtechsolutions.net.in/php/deletetable.php?Id=${deleteId}&Table=BookPrintOrder`;

    const urlencoded = new URLSearchParams();
    urlencoded.append("Id", deleteId);
    urlencoded.append("Table", "BookPrintOrder");

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
        toast.success("Book Print Order Deleted Successfully"); // Show success toast
        setIsDeleteDialogOpen(false); // Close delete dialog
        fetchBookprintingorders(); // Refresh vouchers list
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
    setOrderno("");
    // setTrans_dt("");
    setTransdate(dayjs());
    setTranserror("");
    setPressid("");
    setBookId("");
    setBookStandardId("");
    setOrdertype("");
    setCopiestoprint("");
    setPaperId("");
    setPlateMakerId("");
    setRemarks("");
    setRows([
      {
        From: "",
        To: "",
        No_of_forms: "",
        No_of_paper: "",
        Remarks: "",
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

    console.log(currentRow, "row");
    const bookprintingheader = bookprintingorders[currentRow.index];

    // Filter purchase details to match the selected PurchaseId
    const bookprintingdetail = bookprintingorderdetails.filter(
      (detail) => detail.BookPrintOrderId === bookprintingheader.Id
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

    const mappedRows = bookprintingdetail.map((detail) => ({
      // PurchaseReturnId: detail.PurchaseReturnId,

      BookPrintOrderId: detail.BookPrintOrderId,
      // SerialNo:detail.SerialNo,
      From: detail.From,
      To: detail.To,
      No_of_forms: detail.No_of_forms,
      No_of_paper: detail.No_of_paper,
      Remarks: detail.Remarks,
      Id: detail.Id, // Include the detail Id in the mapped row for tracking
    }));

    const transdate = dayjs(bookprintingheader.Trans_dt?.date);

    // Set the form fields

    setOrderno(bookprintingheader.OrderNo);
    // setTrans_dt(transdate);
    setTransdate(transdate);
    setPressid(bookprintingheader.PressId);
    setBookId(bookprintingheader.BookId);
    setBookStandardId(bookprintingheader.StdId);
    setOrdertype(bookprintingheader.Ordertype);
    setCopiestoprint(bookprintingheader.Copies_to_print);
    setPaperId(bookprintingheader.PaperId);
    setTtl_forms(bookprintingheader.Ttl_forms);
    setPlateMakerId(bookprintingheader.PlateMakerId);
    setRemarks(bookprintingheader.Remarks);

    console.log(bookprintingheader, "bookprintingheader");
    console.log(bookprintingdetail, "bookprinting detail");
    console.log(mappedRows, "mapped rows");
    // Set the rows for the table with all the details
    setRows(mappedRows);

    // Set editing state
    setEditingIndex(currentRow.index);
    setIsDrawerOpen(true);
    setIsEditing(true);
    setId(bookprintingheader.Id);
    handleMenuClose();
    // Determine which specific detail to edit
    const specificDetail = bookprintingdetail.find(
      (detail) => detail.Id === currentRow.original.Id
    );
    if (specificDetail) {
      setBookprintingorderdetailid(specificDetail.Id); // Set the specific detail Id
    }

    fetchBookPrintingdetails();
  };

  const validateForm = () => {
    let formErrors = {};
    let isValid = true;

    setErrors(formErrors);
    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    if (!transdate || !dayjs(transdate).isValid() || transerror) {
      toast.error("Please correct all the date fields before submitting.");
      return;
    }

    const formattedtransdate = dayjs(transdate).format("YYYY-MM-DD");

    const bookprintingData = {
      Id: isEditing ? id : "", // Include the Id for updating, null for new records
      Trans_dt: formattedtransdate,
      PressId: PressId,
      BookId: BookId,
      StdId: BookStandardId,
      Ordertype: Ordertype,
      Copies_to_print: Copies_to_print,
      PaperId: PaperId,
      Ttl_forms: TotalForms,
      PlateMakerId: PlateMakerId,
      Remarks: Remarks,
      CreatedBy: !isEditing ? userId : undefined,
      UpdatedBy: isEditing ? userId : undefined,
    };

    try {
      const bookprintingurl = isEditing
        ? "https://publication.microtechsolutions.net.in/php/update/bookprintorder.php"
        : "https://publication.microtechsolutions.net.in/php/post/bookprintorder.php";

      // Submit purchase header data
      const response = await axios.post(
        bookprintingurl,
        qs.stringify(bookprintingData),
        {
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
        }
      );

      // const purchasereturnId = isEditing ? id : parseInt(response.data.newId, 10);
      const bookPrintOrderId = isEditing ? id : parseInt(response.data.Id, 10);

      for (const row of rows) {
        const rowData = {
          BookPrintOrderId: bookPrintOrderId,
          SerialNo: rows.indexOf(row) + 1,
          From: row.From,
          To: row.To,
          No_of_forms: row.No_of_forms,
          No_of_paper: row.No_of_paper,
          Remarks: row.Remarks,
          Id: row.Id,
          CreatedBy: row.Id ? undefined : userId,
          UpdatedBy: row.Id ? userId : undefined,
        };

        const bookprintingdetailurl =
          isEditing && row.Id
            ? "https://publication.microtechsolutions.net.in/php/update/bookprintorderdetail.php"
            : "https://publication.microtechsolutions.net.in/php/post/bookprintorderdetail.php";

        await axios.post(bookprintingdetailurl, qs.stringify(rowData), {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
        });
      }

      fetchBookprintingorders();
      fetchBookPrintingdetails();
      setIsDrawerOpen(false);
      toast.success(
        isEditing
          ? "Book printing order & Book printing order Details updated successfully!"
          : "Book printing order & Book printing order Details added successfully!"
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
        accessorKey: "OrderNo",
        header: "Order No",
        size: 50,
      },
      {
        accessorKey: "Copies_to_print",
        header: "Copies to print",
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
    [bookprintingorders, bookstandardOptions]
  );

  const table = useMaterialReactTable({
    columns,
    data: bookprintingorders,
    muiTableHeadCellProps: {
      style: {
        backgroundColor: "#E9ECEF", // Replace with your desired color
        color: "black",
        fontSize: "16px",
      },
    },
  });

  return (
    <div className="bookprinting-container">
      <h1>Book Print Order to Press</h1>

      <div className="bookprintingtable-master">
        <div className="bookprintingtable1-master">
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
          <div className="bookprintingtable-container">
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
            className="bookprinting-overlay"
            onClick={() => setIsModalOpen(false)}
          />
        )}

        <Drawer
          anchor="right"
          open={isDrawerOpen}
          // onClose={handleDrawerClose}
          PaperProps={{
            sx: {
              borderRadius: isSmallScreen ? "0" : "10px 0 0 10px",
              width: isSmallScreen ? "100%" : "88%",
              zIndex: 1000,
              paddingLeft: "16px",
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
              <b>
                {isEditing
                  ? "Edit Book printing Order Details"
                  : "Create Book printing Order"}
              </b>
            </Typography>{" "}
            <CloseIcon sx={{ cursor: "pointer" }} onClick={handleDrawerClose} />
          </Box>
          <form className="bookprinting-form">
            <div>
              <label className="bookprinting-label">
                Order No <b className="required">*</b>
              </label>
              <div>
                <input
                  type="text"
                  id="OrderNo"
                  name="OrderNo"
                  value={OrderNo}
                  onChange={(e) => setOrderno(e.target.value)}
                  style={{ background: "#f5f5f5" }}
                  className="bookprinting-control"
                  placeholder="Auto-Incremented"
                  readOnly
                />
              </div>
            </div>

            <div>
              <label className="bookprinting-label">
                Transaction Date <b className="required">*</b>
              </label>
              <div>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DatePicker
                    value={transdate}
                    onChange={handleDateChange1}
                    format="DD-MM-YYYY"
                    slotProps={{
                      textField: {
                        size: "small",
                        fullWidth: true,
                        error: !!transerror,
                        helperText: transerror,
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
                          {errors.PurchaseReturnDate && <b className="error-text">{errors.PurchaseReturnDate}</b>}
                        </div> */}
            </div>

            <div>
              <label className="bookprinting-label">
                Press Name<b className="required">*</b>
              </label>
              <div>
                <Autocomplete
                  options={pressOptions}
                  value={
                    pressOptions.find((option) => option.value === PressId) ||
                    null
                  }
                  onChange={(event, newValue) =>
                    setPressid(newValue ? newValue.value : null)
                  }
                  getOptionLabel={(option) => option.label} // Display only label in dropdown
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      placeholder="Select Press id"
                      size="small"
                      margin="none"
                      fullWidth
                    />
                  )}
                  sx={{ mt: 1.25, mb: 0.625, width: 280 }} // Equivalent to 10px and 5px
                />
              </div>

              {/* <div>
                          {errors.RefrenceNo && <b className="error-text">{errors.RefrenceNo}</b>}
                        </div> */}
            </div>

            <div>
              <label className="bookprinting-label">
                Book Code <b className="required">*</b>
              </label>
              <div>
                <input
                  id="BookCode"
                  name="BookCode"
                  value={
                    bookcodeoptions.find((option) => option.value === BookId)
                      ?.label || ""
                  }
                  readOnly
                  className="bookprinting-control"
                  style={{ background: "#f5f5f5" }}
                  placeholder="Book Code"
                />
              </div>
            </div>

            <div>
              <label className="bookprinting-label">
                Book <b className="required">*</b>
              </label>
              <div>
                <Autocomplete
                  options={bookOptions}
                  value={
                    bookOptions.find((option) => option.value === BookId) ||
                    null
                  }
                  onChange={(event, newValue) =>
                    setBookId(newValue ? newValue.value : null)
                  }
                  getOptionLabel={(option) => option.label} // Display only label in dropdown
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      placeholder="Select Book id"
                      size="small"
                      margin="none"
                      fullWidth
                    />
                  )}
                  sx={{ mt: 1.25, mb: 0.625, width: 300 }} // Equivalent to 10px and 5px
                />
              </div>
              {/* <div>
                          {errors.AccountId && <b className="error-text">{errors.AccountId}</b>}
                        </div> */}
            </div>

            <div>
              <label className="bookprinting-label">
                Standard<b className="required">*</b>
              </label>
              <div>
                <Select
                  id="BookStandardId"
                  name="BookStandardId"
                  // value={bookstandardOptions.find(
                  //   (option) => option.value === BookStandardId
                  // )}

                  value={bookstandardOptions.find(
                    (option) =>
                      option.value.toString() === BookStandardId.toString()
                  )}
                  isClearable
                  onChange={(option) =>
                    setBookStandardId(option ? option.value : "")
                  }
                  // ref={bookstandardidRef}
                  // onKeyDown={(e) => handleKeyDown(e, publicationRef)}
                  options={bookstandardOptions}
                  styles={{
                    control: (base) => ({
                      ...base,
                      width: "170px",
                      marginTop: "10px",
                      marginBottom: "5px",
                      border: "1px solid rgb(223, 222, 222)",
                      borderRadius: "4px",
                    }),
                    menu: (base) => ({
                      ...base,
                      zIndex: 100,
                    }),
                  }}
                  placeholder="Select Standard "
                />
                {/* <Autocomplete
                  options={stdOptions}
                  value={
                    stdOptions.find((option) => option.value === StdId) || null
                  }
                  onChange={(event, newValue) =>
                    setStdId(newValue ? newValue.value : null)
                  }
                  getOptionLabel={(option) => option?.label || ""}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      placeholder="Select std id"
                      size="small"
                      margin="none"
                      fullWidth
                    />
                  )}
                  sx={{ mt: 1.25, mb: 0.625, width: 170 }}
                /> */}
              </div>
              {/* <div>
                          {errors.AccountId && <b className="error-text">{errors.AccountId}</b>}
                        </div> */}
            </div>

            <div>
              <label className="bookprinting-label">Order Type</label>
              <div>
                <label>
                  <input
                    type="radio"
                    name="Ordertype"
                    value="1"
                    checked={Ordertype === 1}
                    onChange={() => setOrdertype(1)}
                    style={{ marginBottom: "5px" }}
                  />
                  New Order
                </label>
              </div>
              <div>
                <label>
                  <input
                    type="radio"
                    name="Ordertype"
                    value="2"
                    checked={Ordertype === 2}
                    onChange={() => setOrdertype(2)}
                    style={{ marginBottom: "5px" }}
                  />
                  Old Order
                </label>
              </div>
            </div>

            <div>
              <label className="bookprinting-label">
                Copies to Print<b className="required">*</b>
              </label>
              <div>
                <input
                  id="Copies_to_print"
                  name="Copies_to_print"
                  value={Copies_to_print}
                  onChange={(e) => setCopiestoprint(e.target.value)}
                  className="bookprinting-control"
                  placeholder="Enter Copies to print"
                />
              </div>
              {/* <div>
                          {errors.AccountId && <b className="error-text">{errors.AccountId}</b>}
                        </div> */}
            </div>

            <div>
              <label className="bookprinting-label">
                Paper Type<b className="required">*</b>
              </label>
              <div>
                <Autocomplete
                  options={paperOptions}
                  value={
                    paperOptions.find((option) => option.value === PaperId) ||
                    null
                  }
                  onChange={(event, newValue) =>
                    setPaperId(newValue ? newValue.value : null)
                  }
                  getOptionLabel={(option) => option.label} // Display only label in dropdown
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      placeholder="Select Paper id"
                      size="small"
                      margin="none"
                      fullWidth
                    />
                  )}
                  sx={{ mt: 1.25, mb: 0.625, width: 170 }} // Equivalent to 10px and 5px
                />
              </div>
              {/* <div>
                          {errors.AccountId && <b className="error-text">{errors.AccountId}</b>}
                        </div> */}
            </div>
          </form>

          <div className="bookprinting-table">
            <table>
              <thead>
                <tr>
                  <th>Serial No</th>
                  <th>
                    From<b className="required">*</b>
                  </th>
                  <th>
                    To<b className="required">*</b>
                  </th>
                  <th>
                    No of Forms<b className="required">*</b>
                  </th>
                  <th>
                    No of Paper<b className="required">*</b>
                  </th>
                  <th>
                    Remarks<b className="required">*</b>
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
                        <input
                          type="number"
                          value={row.From}
                          onChange={(e) =>
                            handleInputChange(index, "From", e.target.value)
                          }
                          style={{
                            width: "150px",
                          }}
                          placeholder="From"
                        />
                      </td>
                      <td>
                        <input
                          type="number"
                          value={row.To}
                          onChange={(e) =>
                            handleInputChange(index, "To", e.target.value)
                          }
                          style={{
                            width: "150px",
                          }}
                          placeholder="To"
                        />
                      </td>
                      <td>
                        <input
                          type="number"
                          value={row.No_of_forms}
                          onChange={(e) =>
                            handleInputChange(
                              index,
                              "No_of_forms",
                              e.target.value
                            )
                          }
                          style={{
                            width: "150px",
                          }}
                          placeholder="No of Forms"
                        />
                      </td>
                      <td>
                        <input
                          type="number"
                          value={row.No_of_paper}
                          onChange={(e) =>
                            handleInputChange(
                              index,
                              "No_of_paper",
                              e.target.value
                            )
                          }
                          style={{
                            width: "150px",
                          }}
                          placeholder="No of Papers "
                        />
                      </td>
                      <td>
                        <input
                          type="text"
                          value={row.Remarks}
                          onChange={(e) =>
                            handleInputChange(index, "Remarks", e.target.value)
                          }
                          style={{
                            width: "200px",
                          }}
                          placeholder="Remarks"
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

              {/* Footer row for Total Forms */}
              <tfoot>
                <tr>
                  <td colSpan={2}></td>
                  <td>
                    <strong>Total Forms:</strong>{" "}
                  </td>
                  <td> {TotalForms}</td>

                  <td></td>
                  <td colSpan={2}></td>
                </tr>
              </tfoot>
            </table>
          </div>
          <form className="bookprinting-form">
            <div>
              <label className="bookprinting-label">
                Plate Maker <b className="required">*</b>
              </label>
              <div>
                <Autocomplete
                  options={platemakerOptions}
                  value={
                    platemakerOptions.find(
                      (option) => option.value === PlateMakerId
                    ) || null
                  }
                  onChange={(event, newValue) =>
                    setPlateMakerId(newValue ? newValue.value : null)
                  }
                  getOptionLabel={(option) => option.label} // Display only label in dropdown
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      placeholder="Select PlateMaker id"
                      size="small"
                      margin="none"
                      fullWidth
                    />
                  )}
                  sx={{ mt: 1.25, mb: 0.625, width: 170 }} // Equivalent to 10px and 5px
                />
              </div>
              {/* 
                  <div>
                          {errors.Extra1 && <b className="error-text">{errors.Extra1}</b>}
                        </div> */}
            </div>
            <div>
              <label className="bookprinting-label">
                Remarks<b className="required">*</b>
              </label>
              <div>
                <textarea
                  type="text"
                  id="Remarks"
                  name="Remarks"
                  value={Remarks}
                  onChange={(e) => setRemarks(e.target.value)}
                  className="bookprinting-control"
                  placeholder="Enter Remarks"
                />
              </div>
              {/* <div>
                          {errors.Extra1Amount && <b className="error-text">{errors.Extra1Amount}</b>}
                        </div> */}
            </div>
          </form>
          <div className="bookprinting-btn-container">
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

          {/* </div> */}
        </Drawer>

        <Dialog open={isDeleteDialogOpen} onClose={cancelDelete}>
          <DialogTitle style={{ color: "navy", fontWeight: "600" }}>
            Confirm Deletion
          </DialogTitle>
          <DialogContent>
            Are you sure you want to delete this{" "}
            <b style={{ color: "red" }}>
              <u>Book print order</u>
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
export default Bookprintingordertopress;
