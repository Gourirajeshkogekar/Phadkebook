import React, { useState, useMemo, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Salestoconvassor.css";
import Select from "react-select";
import axios from "axios";
import {
  Modal,
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

function Salestoconvassor() {
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

    fetchSellsforcanvassor();
  }, []);

  const [isLoading, setIsLoading] = useState(false);

  const [pageIndex, setPageIndex] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [InvoiceNo, setInvoiceNo] = useState(null);
  const [InvoiceDate, setInvoiceDate] = useState("");
  const [BillType, setBillType] = useState("");

  const [AccountId, setAccountId] = useState("");
  const [ReceiptNo, setReceiptNo] = useState("");
  const [ReceiptDate, setReceiptDate] = useState("");
  const [Weight, setWeight] = useState("");

  const [Bundles, setBundles] = useState("");
  const [Freight, setFreight] = useState("");
  const [DispatchModeId, setDispatchModeId] = useState("");
  const [PaymentMode, setPaymentMode] = useState("");
  const [OrderNo, setOrderNo] = useState("");
  const [OrderDate, setOrderDate] = useState("");
  const [ReceivedOn, setReceivedOn] = useState("");
  const [ReceivedThrough, setReceivedThrough] = useState("");

  const [CanvassorId, setCanvassorId] = useState("");
  const [TotalCopies, setTotalCopies] = useState("");
  const [SubTotal, setSubTotal] = useState("");

  const [Total, setTotal] = useState("");
  const [Remark, setRemark] = useState("");
  const [IsPaperPurchase, setIsPaperPurchase] = useState("false");

  const [editingIndex, setEditingIndex] = useState(-1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [id, setId] = useState("");

  const [sellsdetailId, setSellsdetailId] = useState("");
  const [errors, setErrors] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [sellsforcanvassors, setSellsforcanvassors] = useState([]);
  const [sellsforcanvassordetails, setSellsforcanvassordetails] = useState([]);

  //Dropdown for ID's
  const [bookOptions, setBookOptions] = useState([]);
  const [accountOptions, setAccountOptions] = useState([]);
  const [canvassorOptions, setCanvassorOptions] = useState([]);
  const [dispatchmodeOptions, setDispatchmodeOptions] = useState([]);

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

  useEffect(() => {
    // fetchSellsforcanvassor();
    fetchSellsdetailsforcanvassor();
    fetchBooks();
    fetchAccounts();
    fetchDispatchmodes();
    fetchAssigncanvassors();
  }, []);

  useEffect(() => {
    fetchSellsforcanvassor();
    console.log("this function is called");
  }, [pageIndex]);

  const fetchSellsforcanvassor = async () => {
    try {
      const response = await axios.get(
        `https://publication.microtechsolutions.net.in/php/get/gettblpage.php?Table=SellsForCanvassorHeader&PageNo=${pageIndex}`
      );
      console.log(response.data, "response of Sales for convassor headers");

      setSellsforcanvassors(response.data.data);
      setTotalPages(response.data.total_pages);
    } catch (error) {
      console.error("Error fetching Sales for convassor headers:", error);
    }
  };

  // const fetchSellsforcanvassor = async () => {
  //   try {
  //     const response = await axios.get("https://publication.microtechsolutions.net.in/php/Sellsheaderget.php");
  //     setSellsforcanvassors(response.data);
  //   } catch (error) {
  //     // toast.error("Error fetching Sells :", error);
  //     console.error("Error fetching Sells :", error);

  //   }
  // };

  // Fetch the purchase details
  const fetchSellsdetailsforcanvassor = async () => {
    try {
      const response = await axios.get(
        "https://publication.microtechsolutions.net.in/php/get/gettable.php?Table=SellsForCanvassorDetail"
      );
      setSellsforcanvassordetails(response.data);
    } catch (error) {
      // toast.error("Error fetching Sells details:", error);
      console.error("Error fetching Sales details:", error);
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

  const fetchAssigncanvassors = async () => {
    try {
      const response = await axios.get(
        "https://publication.microtechsolutions.net.in/php/AssignCanvassorget.php"
      );
      const canvassorOptions = response.data.map((can) => ({
        value: can.Id,
        label: can.CanvassorName,
      }));
      setCanvassorOptions(canvassorOptions);
    } catch (error) {
      // toast.error("Error fetching Canvassors:", error);
    }
  };

  const fetchDispatchmodes = async () => {
    try {
      const response = await axios.get(
        "https://publication.microtechsolutions.net.in/php/Dispatchmodeget.php"
      );
      const dispatchmodeOptions = response.data.map((dis) => ({
        value: dis.Id,
        label: dis.DispatchModeName,
      }));
      setDispatchmodeOptions(dispatchmodeOptions);
    } catch (error) {
      // toast.error("Error fetching dispatch modes:", error);
    }
  };

  // Calculation functions
  const calculateTotals = () => {
    let subtotal = 0;
    let totalCopies = 0;
    let total = 0;

    rows.forEach((row) => {
      totalCopies += Number(row.Copies) || 0;
      total += Number(row.Amount) || 0;
      subtotal += Number(row.DiscountAmount) || 0;
    });
    setTotalCopies(totalCopies);
    setTotal(total);
    setSubTotal(subtotal);
  };

  const [inverror, setInverror] = useState("");
  const [receipterror, setReceipterror] = useState("");
  const [ordererror, setOrdererror] = useState("");
  const [receivederror, setReceivederror] = useState("");

  const [invdate, setInvdate] = useState(dayjs());

  const [receiptdate, setReceiptdate] = useState(dayjs());
  const [orderdate, setOrderdate] = useState(dayjs());
  const [receiveddate, setReceiveddate] = useState(dayjs());

  const handleDateChange1 = (newValue) => {
    if (!newValue || !dayjs(newValue).isValid()) {
      setInverror("Invalid date");
      setInvdate(null);
      return;
    }

    const today = dayjs();
    const minDate = today.subtract(3, "day");
    const maxDate = today.add(2, "day");

    if (newValue.isBefore(minDate) || newValue.isAfter(maxDate)) {
      setInverror("You can select only 2 days before or after today");
    } else {
      setInverror("");
    }

    setInvdate(newValue);
  };

  const handleDateChange2 = (newValue) => {
    if (!newValue || !dayjs(newValue).isValid()) {
      setReceipterror("Invalid date");
      setReceiptdate(null);
      return;
    }

    const today = dayjs();
    const minDate = today.subtract(3, "day");
    const maxDate = today.add(2, "day");

    if (newValue.isBefore(minDate) || newValue.isAfter(maxDate)) {
      setReceipterror("You can select only 2 days before or after today");
    } else {
      setReceipterror("");
    }

    setReceiptdate(newValue);
  };

  const handleDateChange3 = (newValue) => {
    if (!newValue || !dayjs(newValue).isValid()) {
      setOrdererror("Invalid date");
      setOrderdate(null);
      return;
    }

    const today = dayjs();
    const minDate = today.subtract(3, "day");
    const maxDate = today.add(2, "day");

    if (newValue.isBefore(minDate) || newValue.isAfter(maxDate)) {
      setOrdererror("You can select only 2 days before or after today");
    } else {
      setOrdererror("");
    }

    setOrderdate(newValue);
  };

  const handleDateChange4 = (newValue) => {
    if (!newValue || !dayjs(newValue).isValid()) {
      setReceivederror("Invalid date");
      setReceiveddate(null);
      return;
    }

    const today = dayjs();
    const minDate = today.subtract(3, "day");
    const maxDate = today.add(2, "day");

    if (newValue.isBefore(minDate) || newValue.isAfter(maxDate)) {
      setReceivederror("You can select only 2 days before or after today");
    } else {
      setReceivederror("");
    }

    setReceiveddate(newValue);
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

    const copies = parseFloat(updatedRows[index].Copies) || 0;
    const rate = parseFloat(updatedRows[index].Rate) || 0;

    // Calculate original total
    const originalAmount = copies * rate;

    // Discount logic
    const discountPercentage =
      parseFloat(updatedRows[index].DiscountPercentage) || 0;
    const discountAmount = (originalAmount * discountPercentage) / 100;

    // Amount after discount (final amount)
    const finalAmount = originalAmount - discountAmount;

    // Assign values
    updatedRows[index].DiscountAmount = discountAmount;
    updatedRows[index].Amount = finalAmount; // This will show in the "Amount" column

    // Update state
    setRows(updatedRows);
  };
  const handleAddRow = () => {
    setRows([
      ...rows,
      {
        SerialNo: "",

        BookId: "", // This will be empty for new rows
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
    toast.success("Book details Deleted Succefully");
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
    const url = `https://publication.microtechsolutions.net.in/php/deletetable.php?Id=${deleteId}&Table=SellsForCanvassorHeader`;

    const urlencoded = new URLSearchParams();
    urlencoded.append("Id", deleteId);
    urlencoded.append("Table", "SellsForCanvassorHeader");

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
        toast.success("Sales to Convassor Deleted Successfully"); // Show success toast
        setIsDeleteDialogOpen(false); // Close delete dialog
        fetchSellsforcanvassor(); // Refresh vouchers list
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
    // setInvoiceDate("");
    setInvdate(dayjs());
    setInverror("");
    setInvoiceNo("");
    setBillType("");
    // setReceiptDate("");
    setReceiptdate(dayjs());
    setReceipterror("");
    setReceiptNo("");
    setWeight("");
    setBundles("");
    setFreight("");
    setDispatchModeId("");
    setPaymentMode("");
    setCanvassorId("");
    // setOrderDate("");
    setOrderdate(dayjs());
    setOrdererror("");
    setOrderNo("");
    // setReceivedOn("");
    setReceiveddate(dayjs());
    setReceivederror("");
    setReceivedThrough("");
    setAccountId("");
    setSubTotal("");
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

  const [idwiseData, setIdwiseData] = useState("");

  const handleEdit = () => {
    if (currentRow) {
      console.log("Editing item with ID:", currentRow.original.Id);
      setIdwiseData(currentRow.original.Id);
    }

    console.log(currentRow, "row");
    setIsLoading(true);
    const sellsheader = sellsforcanvassors[currentRow.index];

    // Filter purchase details to match the selected PurchaseId
    const sellsdetail = sellsforcanvassordetails.filter(
      (detail) => detail.SellsForCanvassorId === sellsheader.Id
    );

    // Map the details to rows
    const mappedRows = sellsdetail.map((detail) => ({
      SellsForCanvassorId: detail.SellsForCanvassorId,
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

    const invoicedate = dayjs(sellsheader.InvoiceDate?.date);
    const receiptdate = dayjs(sellsheader.ReceiptDate?.date);
    const orderdate = dayjs(sellsheader.OrderDate?.date);
    const receivedondate = dayjs(sellsheader.ReceivedOn?.date);

    // Set the form fields
    // setInvoiceDate(invoicedate);
    setInvdate(invoicedate);
    // setReceiptDate(receiptdate);
    setReceiptdate(receiptdate);
    // setOrderDate(orderdate);
    setOrderdate(orderdate);
    setInvoiceNo(sellsheader.InvoiceNo);
    setBillType(sellsheader.BillType);

    setAccountId(sellsheader.AccountId);
    setReceiptNo(sellsheader.ReceiptNo);
    setWeight(sellsheader.Weight);
    setBundles(sellsheader.Bundles);
    setFreight(sellsheader.Freight);
    setDispatchModeId(sellsheader.DispatchModeId);
    setPaymentMode(sellsheader.PaymentMode);
    setOrderNo(sellsheader.OrderNo);
    // setReceivedOn(receivedondate);
    setReceiveddate(receivedondate);
    setReceivedThrough(sellsheader.ReceivedThrough);
    setCanvassorId(sellsheader.CanvassorId);
    setTotalCopies(sellsheader.TotalCopies);
    setSubTotal(sellsheader.SubTotal);
    setTotal(sellsheader.Total);
    setRemark(sellsheader.Remark);
    //   console.log(sellsheader, 'sells header');
    //   console.log(sellsdetail, 'sells detail')
    // console.log(mappedRows, 'mapped rows')
    // Set the rows for the table with all the details
    setRows(mappedRows);

    // Set editing state
    setEditingIndex(currentRow.index);
    setIsModalOpen(true);
    setIsEditing(true);
    setId(sellsheader.Id);
    handleMenuClose();

    // Determine which specific detail to edit
    const specificDetail = sellsdetail.find(
      (detail) => detail.Id === currentRow.original.Id
    );
    if (specificDetail) {
      setSellsdetailId(specificDetail.Id); // Set the specific detail Id
    }

    fetchSellsdetailsforcanvassor().then(() => {
      setIsLoading(false); // Stop loading after data is fetched
    });
  };

  const validateForm = () => {
    let formErrors = {};
    let isValid = true;

    // if (!InvoiceNo) {
    //   formErrors.InvoiceNo = "Invoice No is required.";
    //   isValid = false;
    // }
    if (!invdate) {
      formErrors.invdate = "Invoice Date is required.";
      isValid = false;
    }

    if (!BillType) {
      formErrors.BillType = "Bill Type is required.";
      isValid = false;
    }
    if (!AccountId) {
      formErrors.AccountId = "Account Id is required.";
      isValid = false;
    }
    if (!ReceiptNo) {
      formErrors.ReceiptNo = "Receipt No is required.";
      isValid = false;
    }

    if (!receiptdate) {
      formErrors.receiptdate = "Receipt Date is required.";
      isValid = false;
    }
    if (!Weight) {
      formErrors.Weight = "Weight is required.";
      isValid = false;
    }

    if (!Bundles) {
      formErrors.Bundles = "Bundles is required.";
      isValid = false;
    }
    if (!Freight) {
      formErrors.Freight = "Freight is required.";
      isValid = false;
    }
    if (!DispatchModeId) {
      formErrors.DispatchModeId = "Dispatch Mode Id is required.";
      isValid = false;
    }

    if (!PaymentMode) {
      formErrors.PaymentMode = "Payment Mode is required.";
      isValid = false;
    }
    if (!OrderNo) {
      formErrors.OrderNo = "Order No is required.";
      isValid = false;
    }
    if (!orderdate) {
      formErrors.orderdate = "Order Date is required.";
      isValid = false;
    }
    if (!receiveddate) {
      formErrors.receiveddate = "Received On is required.";
      isValid = false;
    }
    if (!ReceivedThrough) {
      formErrors.ReceivedThrough = "Received Through is required.";
      isValid = false;
    }
    if (!CanvassorId) {
      formErrors.CanvassorId = "Convassor Id is required.";
      isValid = false;
    }
    if (!TotalCopies) {
      formErrors.TotalCopies = "Total Copies is required.";
      isValid = false;
    }
    if (!SubTotal) {
      formErrors.SubTotal = "Sub total is required.";
      isValid = false;
    }
    if (!Total) {
      formErrors.Total = "Total is required.";
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
      !invdate ||
      !dayjs(invdate).isValid() ||
      inverror ||
      !receiptdate ||
      !dayjs(receiptdate).isValid() ||
      receipterror ||
      !orderdate ||
      !dayjs(orderdate).isValid() ||
      ordererror ||
      !receiveddate ||
      !dayjs(receiveddate).isValid() ||
      receivederror
    ) {
      toast.error("Please correct all the date fields before submitting.");
      return;
    }

    const formattedinvoicedate = dayjs(invdate).format("YYYY-MM-DD");
    const formattedreceiptdate = dayjs(receiptdate).format("YYYY-MM-DD");
    const formattedorderdate = dayjs(orderdate).format("YYYY-MM-DD");
    const formattedreceivedon = dayjs(receiveddate).format("YYYY-MM-DD");

    const sellsheaderdata = {
      Id: isEditing ? id : "", // Include the Id for updating, null for new records
      InvoiceNo: InvoiceNo ? InvoiceNo : null, // Ensures it takes `null` if `VoucherNo` is not provided
      InvoiceDate: formattedinvoicedate,
      BillType: BillType,
      AccountId: AccountId,
      ReceiptNo: ReceiptNo,
      ReceiptDate: formattedreceiptdate,
      Weight: Weight,
      Bundles: Bundles,
      Freight: Freight,
      DispatchModeId: DispatchModeId,
      PaymentMode: PaymentMode,
      OrderNo: OrderNo,
      OrderDate: formattedorderdate,
      ReceivedOn: formattedreceivedon,
      ReceivedThrough: ReceivedThrough,
      CanvassorId: CanvassorId,
      TotalCopies: TotalCopies,
      SubTotal: SubTotal,
      Total: Total,
      Remark: Remark,
      CreatedBy: !isEditing ? userId : undefined,
      UpdatedBy: isEditing ? userId : undefined,
    };

    try {
      const sellsheaderurl = isEditing
        ? "https://publication.microtechsolutions.net.in/php/Sellsforcanvassorheaderupdate.php"
        : "https://publication.microtechsolutions.net.in/php/Sellsforcanvassorheaderpost.php";

      // Submit purchase header data
      const response = await axios.post(
        sellsheaderurl,
        // qs.stringify(sellsheaderdata),
        sellsheaderdata,
        {
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
        }
      );

      // const purchasereturnId = isEditing ? id : parseInt(response.data.newId, 10);
      const sellsid = isEditing ? id : parseInt(response.data.Id, 10);

      for (const row of rows) {
        const rowData = {
          SellsForCanvassorId: sellsid,
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

        const sellsdetailurl =
          isEditing && row.Id
            ? "https://publication.microtechsolutions.net.in/php/Sellsforcanvassordetailupdate.php"
            : "https://publication.microtechsolutions.net.in/php/Sellsforcanvassordetailpost.php";

        await axios.post(sellsdetailurl, qs.stringify(rowData), {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
        });
      }

      fetchSellsdetailsforcanvassor();
      fetchSellsforcanvassor();
      setIsModalOpen(false);
      toast.success(
        isEditing
          ? "Sales for Convassor & Sales for Convassor updated successfully!"
          : "Sales Invoice & Sales Invoice Details added successfully!"
      );
      resetForm(); // Reset the form fields after successful submission
    } catch (error) {
      // console.error("Error saving record:", error);
      toast.error("Error saving record!");
    }
  };

  const navigate = useNavigate();
  const handlePrint = () => {
    navigate(
      // `/transaction/salestoconvassor/salestoconvassorprint/${currentRow.original.Id}`
      `/transaction/salestoconvassor/salestoconvassorprint/${currentRow.original.Id}`
    );
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
        accessorKey: "InvoiceNo",
        header: "Invoice No",
        size: 50,
      },
      {
        accessorKey: "InvoiceDate.date",
        header: "Invoice Date",
        size: 50,
        Cell: ({ cell }) => {
          const date = moment(cell.getValue()).format("DD-MM-YYYY");
          return <span>{date}</span>;
        },
      },
      {
        accessorKey: "Remark",
        header: "Remark",
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
    [sellsforcanvassors]
  );

  const table = useMaterialReactTable({
    columns,
    data: sellsforcanvassors,
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
    <div className="salestoconvassor-container">
      <h1>Sales For Convassor</h1>

      <div className="salestoconvassortable-master">
        <div className="salestoconvassortable1-master">
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
          <div className="salestoconvassortable-container">
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
            </Box>
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
            className="salestoconvassor-overlay"
            onClick={() => setIsModalOpen(false)}
          />
        )}

        <Modal open={isModalOpen}>
          <div className="salestoconvassor-modal">
            <h2
              style={{
                textAlign: "center",
                fontWeight: "620",
                margin: "2px",
                fontSize: "27px",
              }}>
              {editingIndex >= 0
                ? "Edit Sales For Convassor"
                : "Add Sales For Convassor"}
            </h2>
            <form className="salestoconvassor-form">
              <div>
                <label className="salestoconvassor-label">
                  Invoice No <b className="required">*</b>
                </label>
                <div>
                  <input
                    type="text"
                    id="InvoiceNo"
                    name="InvoiceNo"
                    value={InvoiceNo}
                    onChange={(e) => setInvoiceNo(e.target.value)}
                    style={{ background: "#f5f5f5" }}
                    className="salestoconvassor-control"
                    placeholder="Enter Invoice No"
                    disabled={isEditing} // Prevent editing in update mode
                  />
                </div>

                <div>
                  {errors.InvoiceNo && (
                    <b className="error-text">{errors.InvoiceNo}</b>
                  )}
                </div>
              </div>

              <div>
                <label className="salestoconvassor-label">
                  Invoice Date <b className="required">*</b>
                </label>
                <div>
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DatePicker
                      value={invdate}
                      onChange={handleDateChange1}
                      format="DD-MM-YYYY"
                      slotProps={{
                        textField: {
                          size: "small",
                          fullWidth: true,
                          error: !!inverror,
                          helperText: inverror,
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
                <div>
                  {errors.invdate && (
                    <b className="error-text">{errors.invdate}</b>
                  )}
                </div>
              </div>

              <div>
                <label className="salestoconvassor-label">
                  Bill Type <b className="required">*</b>
                </label>
                <div>
                  <input
                    type="text"
                    id="BillType"
                    name="BillType"
                    value={BillType}
                    onChange={(e) => {
                      const inputValue = e.target.value;
                      if (
                        inputValue.length <= 1 &&
                        /^[a-zA-Z0-9]*$/.test(inputValue)
                      ) {
                        setBillType(inputValue); // Only set the value if it's one letter/digit
                      }
                    }}
                    maxLength={1}
                    className="salestoconvassor-control"
                    placeholder="Enter BillType"
                  />
                </div>

                <div>
                  {errors.BillType && (
                    <b className="error-text">{errors.BillType}</b>
                  )}
                </div>
              </div>

              <div>
                <label className="salestoconvassor-label">
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
                        placeholder="Select Account id"
                        size="small"
                        margin="none"
                        fullWidth
                      />
                    )}
                    sx={{ mt: 1.25, mb: 0.625, width: 400 }} // Equivalent to 10px and 5px
                  />
                </div>

                <div>
                  {errors.AccountId && (
                    <b className="error-text">{errors.AccountId}</b>
                  )}
                </div>
              </div>

              <div>
                <label className="salestoconvassor-label">
                  Receipt No <b className="required">*</b>
                </label>
                <div>
                  <input
                    type="number"
                    id="ReceiptNo"
                    name="ReceiptNo"
                    value={ReceiptNo}
                    onChange={(e) => setReceiptNo(e.target.value)}
                    maxLength={20}
                    className="salestoconvassor-control"
                    placeholder="Enter Receipt No"
                  />
                </div>

                <div>
                  {errors.ReceiptNo && (
                    <b className="error-text">{errors.ReceiptNo}</b>
                  )}
                </div>
              </div>

              <div>
                <label className="salestoconvassor-label">
                  Receipt Date <b className="required">*</b>
                </label>
                <div>
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DatePicker
                      value={receiptdate}
                      onChange={handleDateChange2}
                      format="DD-MM-YYYY"
                      slotProps={{
                        textField: {
                          size: "small",
                          fullWidth: true,
                          error: !!receipterror,
                          helperText: receipterror,
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

                <div>
                  {errors.receiptdate && (
                    <b className="error-text">{errors.receiptdate}</b>
                  )}
                </div>
              </div>

              <div>
                <label className="salestoconvassor-label">
                  Weight <b className="required">*</b>
                </label>
                <div>
                  <input
                    type="text"
                    id="Weight"
                    name="Weight"
                    value={Weight}
                    onChange={(e) => {
                      const value = e.target.value;

                      // Regex to validate decimal numbers with at most 18 digits total and 2 decimal places
                      const regex = /^\d{0,18}(\.\d{0,2})?$/;

                      // Check if the value matches the regex
                      if (value === "" || regex.test(value)) {
                        setWeight(value);
                      }
                    }}
                    className="salestoconvassor-control"
                    placeholder="Enter Weight"
                  />
                </div>

                <div>
                  {errors.Weight && (
                    <b className="error-text">{errors.Weight}</b>
                  )}
                </div>
              </div>

              <div>
                <label className="salestoconvassor-label">
                  Bundles <b className="required">*</b>
                </label>
                <div>
                  <input
                    type="number"
                    id="Bundles"
                    name="Bundles"
                    value={Bundles}
                    onChange={(e) => setBundles(e.target.value)}
                    className="salestoconvassor-control"
                    placeholder="Enter Bundles"
                  />
                </div>

                <div>
                  {errors.Bundles && (
                    <b className="error-text">{errors.Bundles}</b>
                  )}
                </div>
              </div>

              <div>
                <label className="salestoconvassor-label">
                  Freight <b className="required">*</b>
                </label>
                <div>
                  <input
                    type="number"
                    id="Freight"
                    name="Freight"
                    value={Freight}
                    onChange={(e) => {
                      const value = e.target.value;

                      // Regex to validate decimal numbers with at most 18 digits total and 2 decimal places
                      const regex = /^\d{0,18}(\.\d{0,2})?$/;

                      // Check if the value matches the regex
                      if (value === "" || regex.test(value)) {
                        setFreight(value);
                      }
                    }}
                    className="salestoconvassor-control"
                    placeholder="Enter Freight"
                  />
                </div>

                <div>
                  {errors.Freight && (
                    <b className="error-text">{errors.Freight}</b>
                  )}
                </div>
              </div>

              <div>
                <label className="salestoconvassor-label">
                  {" "}
                  Dispatch Mode <b className="required">*</b>
                </label>
                <div>
                  <Autocomplete
                    options={dispatchmodeOptions}
                    value={
                      dispatchmodeOptions.find(
                        (option) => option.value === DispatchModeId
                      ) || null
                    }
                    onChange={(event, newValue) =>
                      setDispatchModeId(newValue ? newValue.value : null)
                    }
                    getOptionLabel={(option) => option.label} // Display only label in dropdown
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        placeholder="Select Dispatch id"
                        size="small"
                        margin="none"
                        fullWidth
                      />
                    )}
                    sx={{ mt: 1.25, mb: 0.625, width: 300 }} // Equivalent to 10px and 5px
                  />
                </div>

                <div>
                  {errors.DispatchModeId && (
                    <b className="error-text">{errors.DispatchModeId}</b>
                  )}
                </div>
              </div>

              <div>
                <label className="salestoconvassor-label">
                  Payment Mode <b className="required">*</b>
                </label>
                <div>
                  <input
                    type="text"
                    id="PaymentMode"
                    name="PaymentMode"
                    value={PaymentMode}
                    onChange={(e) => {
                      const inputValue = e.target.value;
                      if (
                        inputValue.length <= 1 &&
                        /^[a-zA-Z0-9]*$/.test(inputValue)
                      ) {
                        setPaymentMode(inputValue); // Only set the value if it's one letter/digit
                      }
                    }}
                    maxLength={1}
                    className="salestoconvassor-control"
                    placeholder="Enter Payment Mode"
                  />
                </div>

                <div>
                  {errors.PaymentMode && (
                    <b className="error-text">{errors.PaymentMode}</b>
                  )}
                </div>
              </div>

              <div>
                <label className="salestoconvassor-label">
                  {" "}
                  Canvassor <b className="required">*</b>
                </label>
                <div>
                  <Autocomplete
                    options={canvassorOptions}
                    value={
                      canvassorOptions.find(
                        (option) => option.value === CanvassorId
                      ) || null
                    }
                    onChange={(event, newValue) =>
                      setCanvassorId(newValue ? newValue.value : null)
                    }
                    getOptionLabel={(option) => option.label} // Display only label in dropdown
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        placeholder="Select Canv id"
                        size="small"
                        margin="none"
                        fullWidth
                      />
                    )}
                    sx={{ mt: 1.25, mb: 0.625, width: 400 }} // Equivalent to 10px and 5px
                  />
                </div>

                <div>
                  {errors.CanvassorId && (
                    <b className="error-text">{errors.CanvassorId}</b>
                  )}
                </div>
              </div>
            </form>

            <div className="salestoconvassor-table">
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
                            sx={{ width: 450 }} // Set width
                            getOptionLabel={(option) => option.label}
                            renderInput={(params) => (
                              <TextField
                                {...params}
                                placeholder="Select Bookid"
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
                          />
                        </td>
                        <td>
                          <input
                            type="number"
                            value={row.Rate}
                            readOnly
                            style={{ width: "100px" }}
                            className="salestoconvassor-control"
                          />
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
                          />
                        </td>
                        <td>
                          <input
                            type="number"
                            value={row.DiscountAmount}
                            readOnly
                            style={{
                              width: "100px",
                            }}
                            placeholder="Discount Amount"
                          />
                        </td>
                        <td>
                          <input
                            type="number"
                            value={row.Amount}
                            readOnly
                            style={{
                              width: "100px",
                            }}
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
            <form className="salestoconvassor-form">
              <div>
                <label className="salestoconvassor-label">
                  Order No <b className="required">*</b>
                </label>
                <div>
                  <input
                    type="text"
                    id="OrderNo"
                    name="OrderNo"
                    value={OrderNo}
                    onChange={(e) => setOrderNo(e.target.value)}
                    maxLength={20}
                    className="salestoconvassor-control"
                    placeholder="Enter Order No"
                  />
                </div>
                <div>
                  {errors.OrderNo && (
                    <b className="error-text">{errors.OrderNo}</b>
                  )}
                </div>
              </div>

              <div>
                <label className="salestoconvassor-label">
                  Order Date <b className="required">*</b>
                </label>
                <div>
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DatePicker
                      value={orderdate}
                      onChange={handleDateChange3}
                      format="DD-MM-YYYY"
                      slotProps={{
                        textField: {
                          size: "small",
                          fullWidth: true,
                          error: !!ordererror,
                          helperText: ordererror,
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

                <div>
                  {errors.orderdate && (
                    <b className="error-text">{errors.orderdate}</b>
                  )}
                </div>
              </div>

              <div>
                <label className="salestoconvassor-label">
                  Received On <b className="required">*</b>
                </label>
                <div>
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DatePicker
                      value={receiveddate}
                      onChange={handleDateChange4}
                      format="DD-MM-YYYY"
                      slotProps={{
                        textField: {
                          size: "small",
                          fullWidth: true,
                          error: !!receivederror,
                          helperText: receivederror,
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

                <div>
                  {errors.receiveddate && (
                    <b className="error-text">{errors.receiveddate}</b>
                  )}
                </div>
              </div>

              <div>
                <label className="salestoconvassor-label">
                  Received Through <b className="required">*</b>
                </label>
                <div>
                  <input
                    type="text"
                    id="ReceivedThrough"
                    name="ReceivedThrough"
                    value={ReceivedThrough}
                    onChange={(e) => setReceivedThrough(e.target.value)}
                    maxLength={50}
                    className="salestoconvassor-control"
                    placeholder="Enter Received Through"
                  />
                </div>
                <div>
                  {errors.ReceivedThrough && (
                    <b className="error-text">{errors.ReceivedThrough}</b>
                  )}
                </div>
              </div>

              <div>
                <label className="salestoconvassor-label">
                  Total Copies <b className="required">*</b>
                </label>
                <div>
                  <input
                    type="text"
                    id="TotalCopies"
                    name="TotalCopies"
                    value={TotalCopies}
                    onChange={(e) => setTotalCopies(e.target.value)}
                    className="salestoconvassor-control"
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
                <label className="salestoconvassor-label">
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
                    className="salestoconvassor-control"
                    placeholder="Enter Sub Total"
                  />
                </div>{" "}
                <div>
                  {errors.SubTotal && (
                    <b className="error-text">{errors.SubTotal}</b>
                  )}
                </div>
              </div>

              <div>
                <label className="salestoconvassor-label">
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
                    className="salestoconvassor-control"
                    placeholder="Enter Total "
                  />
                </div>{" "}
                <div>
                  {errors.Total && <b className="error-text">{errors.Total}</b>}
                </div>
              </div>

              <div>
                <label className="salestoconvassor-label">
                  Remarks <b className="required">*</b>
                </label>
                <div>
                  <input
                    type="text"
                    id="Remark"
                    name="Remark"
                    value={Remark}
                    onChange={(e) => setRemark(e.target.value)}
                    maxLength={200}
                    className="salestoconvassor-control"
                    placeholder="Enter Remark"
                  />
                </div>
                <div>
                  {errors.Remark && (
                    <b className="error-text">{errors.Remark}</b>
                  )}
                </div>{" "}
              </div>
            </form>
            <div className="salestoconvassor-btn-container">
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
              <u>Sales to Convassor</u>
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

export default Salestoconvassor;
