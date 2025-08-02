import React, { useState, useMemo, useEffect } from "react";
import "./Salesreturncreditnote.css";
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
import {
  Edit,
  Delete,
  Add,
  MoreVert,
  Print,
  Discount,
} from "@mui/icons-material";
import dayjs from "dayjs";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";

function Salesreturncreditnote() {
  const [userId, setUserId] = useState("");
  const [yearid, setYearId] = useState("");
  const [fromdate, setFromdate] = useState("");
  const [newErrors, setNewerrors] = useState("");
  const [todate, setTodate] = useState("");
  const [dateError, setDateError] = useState(false);

  useEffect(() => {
    const storedUserId = sessionStorage.getItem("UserId");
    const storedYearId = sessionStorage.getItem("YearId");
    const storedFromDate = sessionStorage.getItem("FromDate");
    const storedToDate = sessionStorage.getItem("ToDate");

    if (storedUserId) {
      setUserId(storedUserId);
    } else {
      toast.error("User is not logged in.");
    }

    if (storedYearId) {
      setYearId(storedYearId);
      console.log(storedYearId, "yearid");
    } else {
      toast.error("Year is not set.");
    }

    if (storedFromDate) {
      setFromdate(storedFromDate);
    }
    if (storedToDate) {
      setTodate(storedToDate);
    }

    fetchSalereturncredits();
  }, []);

  const [pageIndex, setPageIndex] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [NoteNo, setNoteNo] = useState(null);
  const [Party_RefNo, setPartyrefno] = useState("");
  const today = new Date();
  const twoDaysAfter = new Date();
  twoDaysAfter.setDate(today.getDate() + 2);

  const [creditnotedate, setDate] = useState("");
  const [AccountId, setAccountId] = useState("");
  const [DebitAccountId, setDebitAccountId] = useState("");
  const [InvoiceId, setInvoiceId] = useState("");
  const [ReceiptNo, setReceiptno] = useState("");
  const [ReceiptDate, setReceiptDate] = useState("");
  const [Weight, setWeight] = useState("");
  const [Bundles, setBundles] = useState("");
  const [Freight, setFreight] = useState("");
  const [ChallanNo, setChallanNo] = useState("");
  const [DispatchId, setDispatchId] = useState("");
  const [OrderNo, setOrderNo] = useState("");
  const [OrderDate, setOrderdate] = useState("");
  const [ReceivedDate, setReceivedDate] = useState("");
  const [ReceivedThrough, setReceivedThrough] = useState("");
  const [PaymentOption, setPaymentOption] = useState("");
  const [Ttl_copies, setTtl_copies] = useState("");
  const [Ttl_subtotal, setTtl_subtotal] = useState("");
  const [Other_Charge1, setOther_Charge1] = useState("");
  const [Other_Charge1_percentage, setOther_Charge1_percentage] = useState("");
  const [Other_Charge1_amt, setOther_Charge1_amt] = useState("");
  const [Ttl_amount, setTtl_amount] = useState("");

  const [editingIndex, setEditingIndex] = useState(-1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [id, setId] = useState("");

  const [salescreditdetailId, setSalescreditdetailId] = useState("");
  const [errors, setErrors] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [salesreturncredits, setSalesreturncredits] = useState([]);
  const [salesreturncreditdetails, setSalesreturncreditdetails] = useState([]);
  const [invoicedetails, setInvoicedetails] = useState([]);
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

  const [idwiseData, setIdwiseData] = useState("");

  //Dropdown for ID's
  const [bookOptions, setBookOptions] = useState([]);
  const [bookcodeOptions, setBookcodeoptions] = useState([]);
  const [despmodeOptions, setDespmodeoptions] = useState([]);

  const [accountOptions, setAccountOptions] = useState([]);
  const [rows, setRows] = useState([
    {
      SerialNo: "",
      BookId: "", // Default value for the first row
      Copies: 0,
      Price: 0,
      Discount: 0,
      Amount: "",
    },
  ]);

  useEffect(() => {
    fetchSalereturncreditdetails();
    fetchBooks();
    fetchAccounts();
    fetchDespModes();
    fetchInvoices();
  }, []);

  useEffect(() => {
    fetchSalereturncredits();
    console.log("this function is called");
  }, [pageIndex]);

  const fetchSalereturncredits = async () => {
    try {
      const response = await axios.get(
        `https://publication.microtechsolutions.net.in/php/get/gettblpage.php?Table=SalesReturnCreditNote&PageNo=${pageIndex}`
      );
      console.log(response.data, "response of sales return credit note");

      setSalesreturncredits(response.data.data);
      setTotalPages(response.data.total_pages);
    } catch (error) {
      console.error("Error fetching sales return credit notes:", error);
    }
  };

  const fetchSalereturncreditdetails = async () => {
    try {
      const response = await axios.get(
        "https://publication.microtechsolutions.net.in/php/get/gettable.php?Table=SalesReturnCreditNoteDetail"
      );
      console.log(
        response.data,
        "response of sales return credit note details"
      );
      setSalesreturncreditdetails(response.data);
    } catch (error) {
      console.error("Error fetching salesreturn credit note details:", error);
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

  const fetchDespModes = async () => {
    try {
      const response = await axios.get(
        "https://publication.microtechsolutions.net.in/php/Dispatchmodeget.php"
      );
      const dispmodeOptions = response.data.map((dsp) => ({
        value: dsp.Id,
        label: dsp.DispatchModeName,
      }));
      setDespmodeoptions(dispmodeOptions);
    } catch (error) {
      // toast.error("Error fetching desp modes:", error);
    }
  };

  const fetchInvoices = async () => {
    try {
      const response = await axios.get(
        "https://publication.microtechsolutions.net.in/php/gettable.php?Table=Invoiceheader"
      );
      const invoicedetails = response.data.map((inv) => ({
        value: inv.Id,
        label: inv.InvoiceNo,
      }));
      setInvoicedetails(invoicedetails);
    } catch (error) {
      // toast.error("Error fetching challans:", error);
    }
  };

  const fetchInvoiceDetails = async (selectedInvoiceId) => {
    console.log(selectedInvoiceId, "sele invoice id");
    try {
      const response = await axios.get(
        `https://publication.microtechsolutions.net.in/php/get/getbycolm.php?Table=Invoicedetail&Colname=InvoiceId&Colvalue=${selectedInvoiceId}`
      );
      setRows(response.data); // Set fetched data to table rows
    } catch (error) {
      toast.error("Error fetching Invoice details");
    }
  };

  // Fetch invoices for selected account
  const fetchInvoicesByAccount = async (accountId) => {
    try {
      const response = await axios.get(
        `https://publication.microtechsolutions.net.in/php/get/getbycolm.php?Table=Invoiceheader&Colname=AccountId&Colvalue=${accountId}`
      );
      const data = response.data;

      // Map to format: { value: ..., label: ... }
      const formattedInvoices = data.map((invoice) => ({
        value: invoice.Id,
        label: invoice.InvoiceNo,
      }));

      setInvoicedetails(formattedInvoices);
    } catch (error) {
      console.error("Error fetching invoices:", error);
      setInvoicedetails([]);
    }
  };

  const [safedate, setSafedate] = useState(dayjs());
  const [receiptsafedate, setReceiptsafedate] = useState(dayjs());
  const [ordersafedate, setOrdersafedate] = useState(dayjs());
  const [receivedsafedate, setReceivedsafedate] = useState(dayjs());
  const [receiptdateerror, setReceiptdateerror] = useState("");
  const [orderdateerror, setOrderdateerror] = useState("");
  const [receiveddateerror, setReceiveddateerror] = useState("");

  const handleDateChange1 = (newValue) => {
    if (!newValue || !dayjs(newValue).isValid()) {
      setDateError("Invalid date");
      setSafedate(null);
      return;
    }

    const today = dayjs();
    const minDate = today.subtract(3, "day");
    const maxDate = today.add(2, "day");

    if (newValue.isBefore(minDate) || newValue.isAfter(maxDate)) {
      setDateError("You can select only 2 days before or after today");
    } else {
      setDateError("");
    }

    setSafedate(newValue);
  };

  const handleDateChange2 = (newValue) => {
    if (!newValue || !dayjs(newValue).isValid()) {
      setReceiptdateerror("Invalid date");
      setReceiptsafedate(null);
      return;
    }

    const today = dayjs();
    const minDate = today.subtract(3, "day");
    const maxDate = today.add(2, "day");

    if (newValue.isBefore(minDate) || newValue.isAfter(maxDate)) {
      setReceiptdateerror("You can select only 2 days before or after today");
    } else {
      setReceiptdateerror("");
    }

    setReceiptsafedate(newValue);
  };

  const handleDateChange3 = (newValue) => {
    if (!newValue || !dayjs(newValue).isValid()) {
      setOrderdateerror("Invalid date");
      setOrdersafedate(null);
      return;
    }

    const today = dayjs();
    const minDate = today.subtract(3, "day");
    const maxDate = today.add(2, "day");

    if (newValue.isBefore(minDate) || newValue.isAfter(maxDate)) {
      setOrderdateerror("You can select only 2 days before or after today");
    } else {
      setOrderdateerror("");
    }

    setOrdersafedate(newValue);
  };

  const handleDateChange4 = (newValue) => {
    if (!newValue || !dayjs(newValue).isValid()) {
      setReceiveddateerror("Invalid date");
      setReceivedsafedate(null);
      return;
    }

    const today = dayjs();
    const minDate = today.subtract(3, "day");
    const maxDate = today.add(2, "day");

    if (newValue.isBefore(minDate) || newValue.isAfter(maxDate)) {
      setReceiveddateerror("You can select only 2 days before or after today");
    } else {
      setReceiveddateerror("");
    }

    setReceivedsafedate(newValue);
  };

  const handleInputChange = (index, field, value) => {
    const updatedRows = [...rows];
    updatedRows[index][field] = value;

    if (["Copies", "Price", "Discount"].includes(field)) {
      const copies = parseFloat(updatedRows[index].Copies) || 0;
      const price = parseFloat(updatedRows[index].Price) || 0;
      const discount = parseFloat(updatedRows[index].Discount) || 0;

      const amount = copies * price * (1 - discount / 100);
      updatedRows[index].Amount = amount.toFixed(2);
    }

    setRows(updatedRows);
    calculateTotals(updatedRows); // Pass updated rows
  };

  const calculateTotals = (updatedRows = rows) => {
    let totalCopies = 0;
    let subtotal = 0;

    updatedRows.forEach((row) => {
      totalCopies += Number(row.Copies) || 0;
      const discountedAmount =
        (Number(row.Price) || 0) *
        (Number(row.Copies) || 0) *
        (1 - (Number(row.Discount) || 0) / 100);
      subtotal += discountedAmount;
    });

    const calculatedOtherCharge1 =
      (subtotal * (parseFloat(Other_Charge1_percentage) || 0)) / 100;
    const finalTotal =
      subtotal + (parseFloat(Other_Charge1) || 0) + calculatedOtherCharge1;

    setTtl_copies(totalCopies);
    setTtl_subtotal(subtotal.toFixed(2));
    setOther_Charge1_amt(calculatedOtherCharge1.toFixed(2));
    setTtl_amount(finalTotal.toFixed(2));
  };

  const handleOtherChargePercentageChange = (value) => {
    setOther_Charge1_percentage(value);
    const calculatedOtherCharge1 =
      (parseFloat(Ttl_subtotal) * (parseFloat(value) || 0)) / 100;
    setOther_Charge1_amt(calculatedOtherCharge1);

    // Update final total
    const finalTotal = parseFloat(Ttl_subtotal) + calculatedOtherCharge1;
    setTtl_amount(finalTotal);
  };

  const handleAddRow = () => {
    setRows([
      ...rows,
      {
        SerialNo: "",
        BookId: "", // Default value for the first row
        Copies: 0,
        Price: 0,
        Discount: 0,
        Amount: 0,
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
    setIsDeleteDialogOpen(true); // Show confirmation dialog
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
      `https://publication.microtechsolutions.net.in/php/deletetable.php?Id=${deleteId}&Table=SalesReturnCreditNote`,
      requestOptions
    )
      .then((response) => response.text())
      .then((result) => console.log(result))
      .catch((error) => console.error(error));
    toast.success("Sales return Credit Note Deleted Successfully");
    setIsDeleteDialogOpen(false);
    // setDeleteIndex(deleteIndex)
    fetchSalereturncredits();
  };

  const cancelDelete = () => {
    setIsDeleteDialogOpen(false);
    setDeleteIndex(null);
  };
  const resetForm = () => {
    setNoteNo("");
    setPartyrefno("");
    // setDate("");
    setSafedate(dayjs());
    setDateError("");
    setAccountId("");
    setDebitAccountId("");
    setInvoiceId("");
    setReceiptno("");
    // setReceiptDate("");
    setReceiptsafedate(dayjs());
    setReceiptdateerror("");
    setWeight("");
    setBundles("");
    setFreight("");
    setChallanNo("");
    setDispatchId("");
    setOrderNo("");
    // setOrderdate("");
    setOrdersafedate(dayjs());
    setOrderdateerror("");
    // setReceivedDate("");
    setReceivedsafedate(dayjs());
    setReceiveddateerror("");
    setReceivedThrough("");
    setPaymentOption("");
    setTtl_copies("");
    setTtl_subtotal("");
    setOther_Charge1("");
    setOther_Charge1_percentage("");
    setOther_Charge1_amt("");
    setTtl_amount("");

    setRows([
      {
        SerialNo: "",
        BookId: "", // Default value for the first row
        Copies: 0,
        Price: 0,
        Discount: 0,
        Amount: 0,
      },
    ]);
  };

  useEffect(() => {
    calculateTotals();
  }, [rows]);

  const handleNewClick = () => {
    resetForm();
    setIsDrawerOpen(true);
    setIsEditing(false);
    setEditingIndex(-1);
  };

  const [isLoading, setIsLoading] = useState(false);

  const handleEdit = () => {
    if (currentRow) {
      console.log(currentRow, "currentrow");
      console.log("Editing item with ID:", currentRow.original.Id);
      setIdwiseData(currentRow.original.Id);
    }

    setIsLoading(true);
    console.log(currentRow, "row");
    const salesreturncredit = salesreturncredits[currentRow.index];

    console.log(salesreturncredit, "sales return credit note");
    // Filter purchase details to match the selected PurchaseId
    const salesreturncreditdetail = salesreturncreditdetails.filter(
      (detail) => detail.SalesReturnCreditNoteId === salesreturncredit.Id
    );

    console.log(salesreturncreditdetail, "details");

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

    const mappedRows = salesreturncreditdetail.map((detail) => ({
      // PurchaseReturnId: detail.PurchaseReturnId,

      SalesReturnCreditNoteId: detail.SalesReturnCreditNoteId,
      // SerialNo:detail.SerialNo,
      BookId: detail.BookId,
      Copies: detail.Copies,
      Price: detail.Price,
      Discount: detail.Discount,
      Amount: detail.Amount,
      Id: detail.Id, // Include the detail Id in the mapped row for tracking
    }));

    const creditdate = dayjs(salesreturncredit.Date?.date);
    const receiptdate = dayjs(salesreturncredit.ReceiptDate?.date);
    const orderdate = dayjs(salesreturncredit.OrderDate?.date);
    const receiveddate = dayjs(salesreturncredit.ReceivedDate?.date);

    // Set the form fields
    setNoteNo(salesreturncredit.NoteNo);
    setPartyrefno(salesreturncredit.Party_RefNo);
    // setDate(creditdate);
    setSafedate(creditdate);
    setAccountId(salesreturncredit.AccountId);
    setDebitAccountId(salesreturncredit.DebitAccountId);
    setInvoiceId(salesreturncredit.InvoiceId);
    if (salesreturncredit.InvoiceId) {
      fetchInvoiceDetails(salesreturncredit.InvoiceId);
    }
    setReceiptno(salesreturncredit.ReceiptNo);
    // setReceiptDate(receiptdate);
    setReceiptsafedate(receiptdate);
    setWeight(salesreturncredit.Weight);
    setBundles(salesreturncredit.Bundles);
    setFreight(salesreturncredit.Freight);
    setChallanNo(salesreturncredit.ChallanNo);
    setDispatchId(salesreturncredit.DispatchId);
    setOrderNo(salesreturncredit.OrderNo);
    // setOrderdate(orderdate);
    setOrdersafedate(orderdate);
    // setReceivedDate(receiveddate);
    setReceivedsafedate(receiveddate);
    setReceivedThrough(salesreturncredit.ReceivedThrough);
    setPaymentOption(salesreturncredit.PaymentOption);
    setTtl_copies(salesreturncredit.setTtl_copies);
    setTtl_subtotal(salesreturncredit.Ttl_subtotal);
    setOther_Charge1(salesreturncredit.Other_Charge1);
    setOther_Charge1_percentage(salesreturncredit.Other_Charge1_percentage);
    setOther_Charge1_amt(salesreturncredit.Other_Charge1_amt);
    setTtl_amount(salesreturncredit.Ttl_amount);

    console.log(salesreturncredit, "salesreturncredit");
    console.log(salesreturncreditdetail, "salesreturncredit detail");
    console.log(mappedRows, "mapped rows");
    // Set the rows for the table with all the details
    // setRows(mappedRows);
    setRows([]); // Clear stale rows before fetching new ones
    fetchInvoiceDetails(salesreturncredit.InvoiceId);

    // Set editing state
    setEditingIndex(currentRow.index);
    setIsDrawerOpen(true);
    setIsEditing(true);
    setId(salesreturncredit.Id);
    handleMenuClose();
    // Determine which specific detail to edit
    const specificDetail = salesreturncreditdetail.find(
      (detail) => detail.Id === currentRow.original.Id
    );
    if (specificDetail) {
      setSalescreditdetailId(specificDetail.Id); // Set the specific detail Id
    }

    fetchSalereturncreditdetails().then(() => {
      setIsLoading(false); // Stop loading after data is fetched
    });
  };
  const validateForm = () => {
    let formErrors = {};
    let isValid = true;

    if (!creditnotedate) {
      formErrors.creditnotedate = "Credit Note date is required";
      isValid = false;
    } else {
      const creditNoteDateObj = new Date(creditnotedate);
      const fromDateObj = new Date(fromdate);
      const toDateObj = new Date(todate);

      if (creditNoteDateObj < fromDateObj) {
        formErrors.creditnotedate = `Date cannot be before ${fromDateObj.toLocaleDateString()}`;
        isValid = false;
      } else if (creditNoteDateObj > toDateObj) {
        formErrors.creditnotedate = `Date cannot be after ${toDateObj.toLocaleDateString()}`;
        isValid = false;
      }
    }

    setErrors(formErrors);
    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // if (!validateForm()) return;

    if (
      !safedate ||
      !dayjs(safedate).isValid() ||
      dateError ||
      !receiptsafedate ||
      !dayjs(receiptsafedate).isValid() ||
      receiptdateerror ||
      !ordersafedate ||
      !dayjs(ordersafedate).isValid() ||
      orderdateerror ||
      !receivedsafedate ||
      !dayjs(receivedsafedate).isValid() ||
      receiveddateerror
    ) {
      toast.error("Please correct all the date fields before submitting.");
      return;
    }

    const backendDate = salesreturncredits.Date;
    const formattedDate = dayjs(safedate).format("YYYY-MM-DD");
    const formattedReceiptDate = dayjs(receiptsafedate).format("YYYY-MM-DD");
    const formattedOrderDate = dayjs(ordersafedate).format("YYYY-MM-DD");
    const formattedReceivedDate = dayjs(receivedsafedate).format("YYYY-MM-DD");

    const salesreturncreditdata = {
      Id: isEditing ? id : "", // Include the Id for updating, null for new records
      Party_RefNo: Party_RefNo,
      Date: formattedDate, // Convert branch name to corresponding number
      AccountId: AccountId,
      DebitAccountId: DebitAccountId,
      InvoiceId: InvoiceId,
      ReceiptNo: ReceiptNo,
      ReceiptDate: formattedReceiptDate,
      Weight: Weight,
      Bundles: Bundles,
      Freight: Freight,
      ChallanNo: ChallanNo,
      DispatchId: DispatchId,
      OrderNo: OrderNo,
      OrderDate: formattedOrderDate,
      ReceivedDate: formattedReceivedDate,
      ReceivedThrough: ReceivedThrough,
      PaymentOption: PaymentOption,
      Ttl_copies: Ttl_copies,
      Ttl_subtotal: Ttl_subtotal,
      Other_Charge1: Other_Charge1,
      Other_Charge1_percentage: Other_Charge1_percentage,
      Other_Charge1_amt: Other_Charge1_amt,
      Ttl_amount: Ttl_amount,
      CreatedBy: !isEditing ? userId : undefined,
      UpdatedBy: isEditing ? userId : undefined,
    };

    try {
      const salesreturncrediturl = isEditing
        ? "https://publication.microtechsolutions.net.in/php/update/salesreturncreditnote.php"
        : "https://publication.microtechsolutions.net.in/php/post/salesreturncreditnote.php";

      // Submit purchase header data
      const response = await axios.post(
        salesreturncrediturl,
        qs.stringify(salesreturncreditdata),
        {
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
        }
      );

      // const purchasereturnId = isEditing ? id : parseInt(response.data.newId, 10);
      const salesreturncreditnoteId = isEditing
        ? id
        : parseInt(response.data.Id, 10);

      for (const row of rows) {
        const rowData = {
          SalesReturnCreditNoteId: salesreturncreditnoteId,
          SerialNo: rows.indexOf(row) + 1,
          BookId: row.BookId,
          Copies: row.Copies,
          Price: row.Price,
          Discount: row.Discount,
          Amount: row.Amount,
          Id: row.Id,
          ...(row?.Id && row.Id > 0
            ? { UpdatedBy: userId }
            : { CreatedBy: userId }),
        };

        const salesreturncreditdetailurl =
          row?.Id && row.Id > 0
            ? "https://publication.microtechsolutions.net.in/php/update/salesreturncreditnotedetail.php"
            : "https://publication.microtechsolutions.net.in/php/post/salesreturncreditnotedetail.php";

        await axios.post(salesreturncreditdetailurl, qs.stringify(rowData), {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
        });
      }

      fetchSalereturncredits();
      fetchSalereturncreditdetails();
      setIsDrawerOpen(false);
      toast.success(
        isEditing
          ? "Salesreturn Credit & Salesreturn Credit Details updated successfully!"
          : "Salesreturn Credit  & Salesreturn Credit Details added successfully!"
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
      `/transaction/salesreturn-creditnote/creditnoteprint/${currentRow.original.Id}`
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
        accessorKey: "Party_RefNo",
        header: "Party Ref No",
        size: 50,
      },
      {
        accessorKey: "NoteNo",
        header: "Note No",
        size: 50,
      },
      // {
      //   accessorKey: "PurchaseReturnDate.date",
      //   header: "Purchase Return Date",
      //   size: 50,
      //   Cell: ({ cell }) => {
      //     // Using moment.js to format the date
      //     const date = moment(cell.getValue()).format('DD-MM-YYYY');
      //     return <span>{date}</span>;
      //   },
      // },

      // {
      //   accessorKey: "Total",
      //   header: "Total",
      //   size: 50,
      // },
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
    [salesreturncredits]
  );

  const table = useMaterialReactTable({
    columns,
    data: salesreturncredits,
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
    <div className="salesreturn-container">
      <h1>Sales Return Credit Note</h1>

      <div className="salesreturntable-master">
        <div className="salesreturntable1-master">
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
          <div className="salesreturntable-container">
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
              width: isSmallScreen ? "100%" : "85%",
              zIndex: 1000,
              paddingLeft: "5px",
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
                  ? "Edit Sales Return Credit note"
                  : "Create Sales Return Credit note"}
              </b>
            </Typography>{" "}
            <CloseIcon sx={{ cursor: "pointer" }} onClick={handleDrawerClose} />
          </Box>

          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              // border: "1px solid red",
              gap: 1,
              ml: 2,
            }}>
            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
              <Box>
                <Typography variant="body2" fontWeight="bold">
                  Note No
                </Typography>
                <TextField
                  value={NoteNo}
                  onChange={(e) => setNoteNo(e.target.value)}
                  size="small"
                  margin="none"
                  style={{ background: "#f5f5f5" }}
                  placeholder="Auto-Incremented"
                  InputProps={{ readOnly: true }}
                />
              </Box>
              <Box>
                <Typography variant="body2" fontWeight="bold">
                  Party's Ref No
                </Typography>
                <TextField
                  value={Party_RefNo}
                  onChange={(e) => setPartyrefno(e.target.value)}
                  size="small"
                  margin="none"
                  placeholder="party ref No"
                  fullWidth
                />
              </Box>

              <Box>
                <Typography variant="body2" fontWeight="bold">
                  Date
                </Typography>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DatePicker
                    value={safedate}
                    onChange={handleDateChange1}
                    format="DD-MM-YYYY"
                    slotProps={{
                      textField: {
                        size: "small",
                        fullWidth: true,
                        error: !!dateError,
                        helperText: dateError,
                      },
                    }}
                  />
                </LocalizationProvider>
              </Box>

              <Box sx={{ width: "450px" }}>
                <Typography fontWeight="bold" variant="body2">
                  Debit Account
                </Typography>
                <Autocomplete
                  options={accountOptions}
                  value={
                    accountOptions.find(
                      (option) => option.value === DebitAccountId
                    ) || null
                  }
                  onChange={(event, newValue) =>
                    setDebitAccountId(newValue ? newValue.value : null)
                  }
                  getOptionLabel={(option) => option.label} // Display only label in dropdown
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      placeholder="Select Debit acc"
                      size="small"
                      margin="none"
                    />
                  )}
                />
              </Box>

              <Box sx={{ width: "450px" }}>
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
                  onChange={(event, newValue) => {
                    const selectedAccountId = newValue ? newValue.value : null;
                    setAccountId(selectedAccountId);
                    setInvoiceId(null); // Reset invoice selection
                    if (selectedAccountId) {
                      fetchInvoicesByAccount(selectedAccountId); // Fetch invoices
                    }
                  }}
                  getOptionLabel={(option) => option.label} // Display only label in dropdown
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      placeholder="Select Party Name"
                      size="small"
                      fullWidth
                    />
                  )}
                />
              </Box>

              <Box sx={{ width: "100px" }}>
                <Typography fontWeight="bold" variant="body2">
                  Invoice No
                </Typography>
                <Autocomplete
                  options={invoicedetails}
                  value={
                    invoicedetails.find(
                      (option) => option.value === InvoiceId
                    ) || null
                  }
                  onChange={(event, newValue) => {
                    const selectedId = newValue ? newValue.value : null;
                    setInvoiceId(selectedId);
                    if (selectedId) {
                      fetchInvoiceDetails(selectedId); // ← Call API on select
                    }
                  }}
                  getOptionLabel={(option) => option.label} // Display only label in dropdown
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      placeholder="Select Invoice id"
                      size="small"
                      margin="none"
                      fullWidth
                    />
                  )}
                  sx={{ mb: 0.625, width: 170 }}
                />
              </Box>
            </Box>

            <Box
              sx={{
                display: "flex",
                flexWrap: "nowrap", // Prevent wrapping
                gap: 1,
                overflowX: "auto", // Allow horizontal scrolling if needed
              }}>
              <Box>
                <Typography variant="body2" fontWeight="bold">
                  Receipt No
                </Typography>
                <TextField
                  value={ReceiptNo}
                  onChange={(e) => setReceiptno(e.target.value)}
                  size="small"
                  margin="none"
                  placeholder="Receipt No"
                  fullWidth
                />
              </Box>

              <Box sx={{ width: "220px" }}>
                <Typography variant="body2" fontWeight="bold">
                  Receipt Date
                </Typography>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DatePicker
                    value={receiptsafedate}
                    onChange={handleDateChange2}
                    format="DD-MM-YYYY"
                    slotProps={{
                      textField: {
                        size: "small",
                        fullWidth: true,
                        error: !!receiptdateerror,
                        helperText: receiptdateerror,
                      },
                    }}
                  />
                </LocalizationProvider>
              </Box>

              <Box sx={{ minWidth: "260px" }}>
                <Typography variant="body2" fontWeight="bold">
                  Weight
                </Typography>
                <TextField
                  value={Weight}
                  onChange={(e) => setWeight(e.target.value)}
                  size="small"
                  margin="none"
                  placeholder="Weight"
                  fullWidth
                />
              </Box>
              <Box>
                <Typography variant="body2" fontWeight="bold">
                  Bundles
                </Typography>
                <TextField
                  type="number"
                  value={Bundles}
                  onChange={(e) => setBundles(e.target.value)}
                  size="small"
                  margin="none"
                  placeholder="Bundles"
                  fullWidth
                />
              </Box>

              <Box>
                <Typography variant="body2" fontWeight="bold">
                  Freight
                </Typography>
                <TextField
                  value={Freight}
                  onChange={(e) => setFreight(e.target.value)}
                  size="small"
                  margin="none"
                  placeholder="Freight"
                  fullWidth
                />
              </Box>
            </Box>

            <Box
              sx={{
                display: "flex",
                flexWrap: "nowrap", // Prevents wrapping
                overflowX: "auto", // Allows horizontal scrolling if needed
                gap: 1,
              }}>
              <Box sx={{ width: "220px" }}>
                <Typography variant="body2" fontWeight="bold">
                  Challan No
                </Typography>
                <TextField
                  value={ChallanNo}
                  onChange={(e) => setChallanNo(e.target.value)}
                  size="small"
                  margin="none"
                  placeholder="Challan No"
                  fullWidth
                />
              </Box>

              <Box sx={{ width: "220px" }}>
                <Typography fontWeight="bold" variant="body2">
                  Dispatch Mode
                </Typography>
                <Autocomplete
                  options={despmodeOptions}
                  value={
                    despmodeOptions.find(
                      (option) => option.value === DispatchId
                    ) || null
                  }
                  onChange={(event, newValue) =>
                    setDispatchId(newValue ? newValue.value : null)
                  }
                  getOptionLabel={(option) => option.label} // Display only label in dropdown
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      placeholder="Select Disp Mode"
                      size="small"
                      margin="none"
                      fullWidth
                    />
                  )}
                />
              </Box>

              <Box sx={{ width: "260px" }}>
                <Typography variant="body2" fontWeight="bold">
                  Order No
                </Typography>
                <TextField
                  value={OrderNo}
                  onChange={(e) => setOrderNo(e.target.value)}
                  size="small"
                  margin="none"
                  placeholder="Order No"
                />
              </Box>

              <Box sx={{ width: "220px" }}>
                <Typography variant="body2" fontWeight="bold">
                  Order Date
                </Typography>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DatePicker
                    value={ordersafedate}
                    onChange={handleDateChange3}
                    format="DD-MM-YYYY"
                    slotProps={{
                      textField: {
                        size: "small",
                        fullWidth: true,
                        error: !!orderdateerror,
                        helperText: orderdateerror,
                      },
                    }}
                  />
                </LocalizationProvider>
              </Box>

              <Box sx={{ width: "220px" }}>
                <Typography variant="body2" fontWeight="bold">
                  Received Date
                </Typography>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DatePicker
                    value={receivedsafedate}
                    onChange={handleDateChange4}
                    format="DD-MM-YYYY"
                    slotProps={{
                      textField: {
                        size: "small",
                        fullWidth: true,
                        error: !!receiveddateerror,
                        helperText: receiveddateerror,
                      },
                    }}
                  />
                </LocalizationProvider>
              </Box>
            </Box>

            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
              <Box>
                <Typography variant="body2" fontWeight="bold">
                  Received Through
                </Typography>
                <TextField
                  value={ReceivedThrough}
                  onChange={(e) => setReceivedThrough(e.target.value)}
                  size="small"
                  margin="none"
                  placeholder="Received Through"
                />
              </Box>

              <Box sx={{ width: "300px" }}>
                <Typography variant="body2" fontWeight="bold">
                  Payment Option
                </Typography>
                <RadioGroup
                  row
                  value={PaymentOption}
                  onChange={(e) =>
                    setPaymentOption(parseInt(e.target.value, 10))
                  } // Convert to integer
                >
                  <FormControlLabel
                    value={0}
                    control={<Radio />}
                    label="To Pay"
                  />
                  <FormControlLabel
                    value={1}
                    control={<Radio />}
                    label="Paid"
                  />
                </RadioGroup>
              </Box>
            </Box>

            <div className="salesreturn-table">
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
                      Disc(%)<b className="required">*</b>
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
                              width: "70px",
                            }}
                            placeholder="Copies"
                          />
                        </td>
                        <td>
                          <input
                            type="number"
                            value={row.Price}
                            onChange={(e) =>
                              handleInputChange(index, "Price", e.target.value)
                            }
                            style={{
                              width: "100px",
                            }}
                            placeholder="Price"
                          />
                        </td>
                        <td>
                          <input
                            type="number"
                            value={row.Discount}
                            onChange={(e) => {
                              const value = e.target.value;
                              const regex = /^\d{0,18}(\.\d{0,2})?$/;
                              if (value === "" || regex.test(value)) {
                                handleInputChange(index, "Discount", value);
                              }
                            }}
                            style={{
                              width: "80px",
                            }}
                            placeholder="Discount %"
                            className="salesreturn-control"
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

                  {/* Totals Row */}
                  <tr>
                    <td
                      colSpan="3"
                      style={{ textAlign: "right", fontWeight: "bold" }}>
                      Total:
                    </td>
                    <td>{Ttl_copies}</td>
                    <td colSpan="2"></td>
                    <td>{Ttl_subtotal}</td>
                    <td></td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Other Charges Section */}
            <Box
              display="flex"
              justifyContent="flex-end"
              gap={2}
              mt={1}
              mr={12}>
              <Box>
                <Typography variant="body2" fontWeight="bold">
                  Other charge 1
                </Typography>

                <TextField
                  type="text"
                  value={Other_Charge1}
                  onChange={(e) => setOther_Charge1(e.target.value)}
                  variant="outlined"
                />
              </Box>
              <Box>
                <Typography variant="body2" fontWeight="bold">
                  Other charge 1 %
                </Typography>
                <TextField
                  type="number"
                  value={Other_Charge1_percentage}
                  onChange={(e) =>
                    handleOtherChargePercentageChange(e.target.value)
                  }
                  variant="outlined"
                />
              </Box>

              <Box>
                <Typography variant="body2" fontWeight="bold">
                  Other charge1 Amount
                </Typography>
                <TextField
                  type="number"
                  value={Other_Charge1_amt}
                  onChange={(e) => setOther_Charge1_amt(e.target.value)}
                  variant="outlined"
                />
              </Box>
            </Box>

            {/* Final Total */}
            <Box mt={1} display="flex" justifyContent="flex-end" mr={12}>
              <Box>
                <Typography variant="body2" fontWeight="bold">
                  Total Amount
                </Typography>
                <TextField
                  type="number"
                  value={Ttl_amount}
                  variant="outlined"
                />{" "}
              </Box>
            </Box>
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
              <u>Sales return Credit Note</u>
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
export default Salesreturncreditnote;
