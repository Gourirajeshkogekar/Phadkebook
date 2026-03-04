import React, { useState, useMemo, useEffect } from "react";
import "./Salesreturncreditnote.css";
import { useRef } from "react";
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
  const [ChallanNo, setChallanno] = useState("");
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

  const [bookHistory, setBookHistory] = useState({});

  const [adjustments, setAdjustments] = useState([
    {
      type: "ADD",
      particular: "",
      percentage: "",
      amount: "",
      isManual: false,
    },
  ]);

  const firstAdj = adjustments[0] || {};
  const secondAdj = adjustments[1] || {};

  const handlePercentageChange = (index, value) => {
    const updated = [...adjustments];
    updated[index].percentage = value;
    updated[index].isManual = false; // auto mode
    setAdjustments(updated);
  };

  const handleAmountChange = (index, value) => {
    const updated = [...adjustments];
    updated[index].amount = value;
    updated[index].isManual = true; // manual mode
    setAdjustments(updated);
  };

  useEffect(() => {
    const base = parseFloat(Ttl_subtotal || 0);

    if (!base) return;

    const updated = adjustments.map((row) => {
      if (row.percentage && !row.isManual && !isNaN(row.percentage)) {
        const amt = (base * parseFloat(row.percentage)) / 100;
        return { ...row, amount: amt.toFixed(2) };
      }
      return row;
    });

    setAdjustments(updated);
  }, [Ttl_subtotal, adjustments.map((a) => a.percentage).join(",")]);

  const handleTypeChange = (index, value) => {
    const updated = [...adjustments];
    updated[index].type = value;

    if (!updated[index].isManual && updated[index].percentage) {
      const base = parseFloat(Ttl_subtotal || 0);
      const percent = parseFloat(updated[index].percentage || 0);
      updated[index].amount = ((base * percent) / 100).toFixed(2);
    }

    setAdjustments(updated);
  };

  const handleAdjustmentChange = (index, field, value) => {
    const updated = [...adjustments];
    updated[index][field] = value;
    setAdjustments(updated);
  };

  const addAdjustmentRow = () => {
    if (adjustments.length >= 2) {
      toast.error("Only 2 Add / Less rows allowed");
      return;
    }

    setAdjustments([
      ...adjustments,
      { type: "ADD", particular: "", percentage: "", amount: "" },
    ]);
  };

  const removeAdjustmentRow = (index) => {
    const updated = adjustments.filter((_, i) => i !== index);
    setAdjustments(updated);
  };

  const adjustmentTotal = adjustments.reduce((sum, row) => {
    const amt = parseFloat(row.amount || 0);
    return row.type === "ADD" ? sum + amt : sum - amt;
  }, 0);

  const totalAmount = parseFloat(Ttl_subtotal || 0) + adjustmentTotal;

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
        "https://publication.microtechsolutions.net.in/php/get/gettable.php?Table=SalesReturnCreditnoteDetail"
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
      const dispmodeOptions = response.data
        .filter((dsp) => dsp.Active === "1" || dsp.Active === 1) // ✅ show only Active=1

        .map((dsp) => ({
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
      const invoicedetails = response.data
        .filter((inv) => String(inv.Active === "1"))
        .map((inv) => ({
          value: inv.Id,
          label: inv.InvoiceNo,
        }));
      setInvoicedetails(invoicedetails);
    } catch (error) {
      // toast.error("Error fetching challans:", error);
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

    // ✅ No min / max validation
    setDateError("");
    setSafedate(newValue);
  };

  const handleDateChange2 = (newValue) => {
    if (!newValue || !dayjs(newValue).isValid()) {
      setReceiptdateerror("Invalid date");
      setReceiptsafedate(null);
      return;
    }

    setDateError("");

    setReceiptsafedate(newValue);
  };

  const handleDateChange3 = (newValue) => {
    if (!newValue || !dayjs(newValue).isValid()) {
      setOrderdateerror("Invalid date");
      setOrdersafedate(null);
      return;
    }

    setDateError("");
    setOrdersafedate(newValue);
  };

  const handleDateChange4 = (newValue) => {
    if (!newValue || !dayjs(newValue).isValid()) {
      setReceiveddateerror("Invalid date");
      setReceivedsafedate(null);
      return;
    }

    setDateError("");
    setReceivedsafedate(newValue);
  };

  const handleInputChange = (index, field, value) => {
    const updatedRows = [...rows];
    updatedRows[index][field] = value;

    const copies = Number(updatedRows[index].Copies) || 0;
    const rate = Number(updatedRows[index].Price) || 0;
    const discount = Number(updatedRows[index].Discount) || 0;

    const baseAmount = copies * rate;
    const discountAmount = (baseAmount * discount) / 100;
    const finalAmount = baseAmount - discountAmount;

    updatedRows[index].Amount = finalAmount.toFixed(2);

    setRows(updatedRows);
  };

  const calculateTotals = (updatedRows = rows) => {
    let totalCopies = 0;
    let subtotal = 0;

    updatedRows.forEach((row) => {
      totalCopies += Number(row.Copies) || 0;
      subtotal += Number(row.Amount) || 0;
    });

    // Add / Less total
    const adjustmentTotal = adjustments.reduce((sum, row) => {
      const amt = parseFloat(row.amount || 0);
      return row.type === "ADD" ? sum + amt : sum - amt;
    }, 0);

    const finalTotal = subtotal + adjustmentTotal;

    setTtl_copies(totalCopies);
    setTtl_subtotal(subtotal.toFixed(2));
    setTtl_amount(finalTotal.toFixed(2)); // 🔥 IMPORTANT
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

  const handleDeleteRow = async (index) => {
    const rowToDelete = rows[index];
    // If row does not have ID, remove it directly (new unsaved row)
    if (!rowToDelete.Id) {
      const updatedRows = rows.filter((_, i) => i !== index);
      setRows(updatedRows);
      return;
    }
    try {
      const apiUrl =
        "https://publication.microtechsolutions.co.in/php/delete/delrecord.php";
      const formData = new FormData();
      formData.append("Id", rowToDelete.Id);
      formData.append("Table", "SalesReturnCreditNoteDetail");

      const response = await axios.post(apiUrl, formData);

      // Convert response to string (API may return text)
      const resText = JSON.stringify(response.data).toLowerCase();

      if (resText.includes("deleted")) {
        const updatedRows = rows.filter((_, i) => i !== index);
        setRows(updatedRows);
        toast.success("Row deleted successfully!");
      } else {
        toast.error("Failed to delete row!");
      }
    } catch (error) {
      toast.error("Error deleting row!");
    }
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
    setChallanno("");
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
    // setOther_Charge1("");
    // setOther_Charge1_percentage("");
    // setOther_Charge1_amt("");
    setTtl_amount("");
    setAdjustments([
      {
        type: "ADD",
        particular: "",
        percentage: "",
        amount: "",
        isManual: false,
      },
    ]);
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
    calculateTotals(rows);
  }, [rows, adjustments]);

  const handleNewClick = () => {
    resetForm();
    setIsDrawerOpen(true);
    setIsEditing(false);
    setEditingIndex(-1);
    setAdjustments([]);
  };

  const [isLoading, setIsLoading] = useState(false);

  const buildAdjustmentsForEdit = (data) => {
    const list = [];

    // ----- Other Charge 1 -----
    if (
      data.Other_Charge1 ||
      Number(data.Other_Charge1_amt) ||
      Number(data.Other_Charge1_percentage)
    ) {
      list.push({
        type: Number(data.Other_Charge1_amt) < 0 ? "LESS" : "ADD",
        particular: data.Other_Charge1 || "",
        percentage: data.Other_Charge1_percentage || "",
        amount: Math.abs(Number(data.Other_Charge1_amt || 0)),
        isManual: true,
      });
    }

    // ----- Other Charge 2 -----
    if (
      data.Other_Charge2 ||
      Number(data.Other_Charge2_amt) ||
      Number(data.Other_Charge2_percentage)
    ) {
      list.push({
        type: Number(data.Other_Charge2_amt) < 0 ? "LESS" : "ADD",
        particular: data.Other_Charge2 || "",
        percentage: data.Other_Charge2_percentage || "",
        amount: Math.abs(Number(data.Other_Charge2_amt || 0)),
        isManual: true,
      });
    }

    return list.length
      ? list
      : [
          {
            type: "ADD",
            particular: "",
            percentage: "",
            amount: "",
            isManual: false,
          },
        ];
  };

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

    console.log(salesreturncreditdetail, "details of salesreturn credit ");

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

    let mappedRows = salesreturncreditdetail.map((detail) => ({
      // PurchaseReturnId: detail.PurchaseReturnId,

      SalesReturnCreditNoteId: detail.SalesReturnCreditNoteId,
      BookId: detail.BookId,

      // BookCode: detail.BookCode,
      // BookName: detail.BookName,
      // BookNameMarathi: detail.BookNameMarathi,
      Copies: detail.Copies,
      Price: detail.Price,
      Discount: detail.Discount,
      Amount: detail.Amount,
      Id: detail.Id,
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

    setRows(mappedRows); // ✅ THIS WAS MISSING

    const creditdate = dayjs(salesreturncredit.Date?.date);
    const receiptdate = dayjs(salesreturncredit.ReceiptDate?.date);
    const orderdate = dayjs(salesreturncredit.OrderDate?.date);
    const receiveddate = dayjs(salesreturncredit.ReceivedDate?.date);

    // Set the form fields
    setNoteNo(salesreturncredit.NoteNo);
    setPartyrefno(salesreturncredit.Party_RefNo);
    setSafedate(creditdate);
    setAccountId(salesreturncredit.AccountId);
    setDebitAccountId(salesreturncredit.DebitAccountId);

    setReceiptno(salesreturncredit.ReceiptNo);
    setReceiptsafedate(receiptdate);
    setWeight(salesreturncredit.Weight);
    setBundles(salesreturncredit.Bundles);
    setFreight(salesreturncredit.Freight);
    setChallanno(salesreturncredit.ChallanNo);
    setDispatchId(salesreturncredit.DispatchId);
    setOrderNo(salesreturncredit.OrderNo);
    setOrdersafedate(orderdate);
    setReceivedsafedate(receiveddate);
    setReceivedThrough(salesreturncredit.ReceivedThrough);
    setPaymentOption(salesreturncredit.PaymentOption);
    setTtl_copies(salesreturncredit.setTtl_copies);
    setTtl_subtotal(salesreturncredit.Ttl_subtotal);
    // setOther_Charge1(salesreturncredit.Other_Charge1);
    // setOther_Charge1_percentage(salesreturncredit.Other_Charge1_percentage);
    // setOther_Charge1_amt(salesreturncredit.Other_Charge1_amt);

    setAdjustments(buildAdjustmentsForEdit(salesreturncredit));

    setTtl_amount(salesreturncredit.Ttl_amount);

    console.log(salesreturncredit, "salesreturncredit");
    console.log(salesreturncreditdetail, "salesreturncredit detail");
    console.log(mappedRows, "mapped rows");

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

        // Now call the last API with the fetched BookId
        if (AccountId && book.Id) {
          fetchBookHistory(rowIndex, book.Id, AccountId);
        }
      } else {
        // ❌ Now this WILL fire correctly
        toast.error("Invalid Book Code");
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to fetch Book");
    }
  };

  const fetchBookHistory = async (rowIndex, bookId, accountId) => {
    try {
      const res = await axios.get(
        `https://publication.microtechsolutions.net.in/php/get/getBookDetailsbyAccountId.php?BookId=${bookId}&AccountId=${accountId}`
      );

      const historyData = Array.isArray(res.data.data) ? res.data.data : []; // 🔹 take res.data.data

      setBookHistory((prev) => ({
        ...prev,
        [rowIndex]: historyData,
      }));
    } catch (err) {
      console.error("Error fetching book history", err);
      setBookHistory((prev) => ({
        ...prev,
        [rowIndex]: [],
      }));
    }
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
      InvoiceId: 0,
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
      // ✅ FIXED
      Other_Charge1: firstAdj.particular || "",
      Other_Charge1_percentage: Number(firstAdj.percentage) || 0,
      Other_Charge1_amt: Number(firstAdj.amount) || 0,
      // ✅ FIXED
      Other_Charge2: secondAdj.particular || "",
      Other_Charge2_percentage: Number(secondAdj.percentage) || 0,
      Other_Charge2_amt: Number(secondAdj.amount) || 0,
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
              width: isSmallScreen ? "100%" : "88%",
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

              <Box sx={{ width: "415px" }}>
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
                      fullWidth
                    />
                  )}
                />
              </Box>
            </Box>

            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
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

              <Box
                sx={{
                  display: "flex",
                  flexWrap: "nowrap", // Prevent wrapping
                  gap: 1,
                  overflowX: "auto",
                }}>
                <Box>
                  <Typography variant="body2" fontWeight="bold">
                    Receipt No
                  </Typography>
                  <TextField
                    type="number"
                    value={ReceiptNo}
                    onChange={(e) => setReceiptno(e.target.value)}
                    size="small"
                    margin="none"
                    placeholder="Enter Receipt no"
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
                    type="number"
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
                    type="number"
                    value={Freight}
                    onChange={(e) => setFreight(e.target.value)}
                    size="small"
                    margin="none"
                    placeholder="Freight"
                    fullWidth
                  />
                </Box>
              </Box>

              <Box sx={{ width: "220px" }}>
                <Typography variant="body2" fontWeight="bold">
                  Challan No
                </Typography>
                <TextField
                  type="text"
                  value={ChallanNo}
                  onChange={(e) => setChallanno(e.target.value)}
                  size="small"
                  margin="none"
                  placeholder="ChallanNo"
                />
              </Box>

              <Box sx={{ width: "300px" }}>
                <Typography fontWeight="bold" variant="body2">
                  Desp Mode
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
                      placeholder="Select Desp Mode"
                      size="small"
                      margin="none"
                    />
                  )}
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

            <Box
              sx={{
                display: "flex",
                flexWrap: "nowrap", // Prevents wrapping
                overflowX: "auto", // Allows horizontal scrolling if needed
                gap: 1,
              }}>
              <Box sx={{ width: "260px" }}>
                <Typography variant="body2" fontWeight="bold">
                  Order No
                </Typography>

                <TextField
                  type="number"
                  value={OrderNo}
                  onChange={(e) => setOrderNo(e.target.value)}
                  size="small"
                  margin="none"
                  placeholder="Order no"
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
                  Received Here on
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

              <Box>
                <Typography variant="body2" fontWeight="bold">
                  Received Through
                </Typography>
                <TextField
                  type="text"
                  value={ReceivedThrough}
                  onChange={(e) => setReceivedThrough(e.target.value)}
                  size="small"
                  margin="none"
                  placeholder="Received Through"
                  fullWidth
                />
              </Box>
            </Box>

            <div className="salesreturn-table">
              <table>
                <thead>
                  <tr>
                    <th>Sr No</th>
                    <th>Book Code</th>
                    <th>Book Name</th>
                    <th>Copies</th>
                    <th>Price</th>
                    <th>Discount</th>
                    <th>Amount</th>
                    <th>Actions</th>
                  </tr>
                </thead>

                <tbody>
                  {isLoading ? (
                    <tr>
                      <td
                        colSpan="10"
                        style={{ textAlign: "center", color: "blue" }}>
                        Loading data...
                      </td>
                    </tr>
                  ) : rows.length === 0 ? (
                    <tr>
                      <td
                        colSpan="10"
                        style={{ textAlign: "center", color: "red" }}>
                        No data available
                      </td>
                    </tr>
                  ) : (
                    rows.map((row, index) => (
                      <React.Fragment key={index}>
                        {/* 🔹 Main Book Row */}
                        <tr>
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
                              className="salesreturn-control"
                            />
                          </td>
                          <td>
                            <input
                              type="text"
                              value={row.BookName || row.BookNameMarathi || ""}
                              readOnly
                              placeholder="Book Name / Book Name Marathi"
                              style={{ width: "400px" }}
                              className="salesinvoice-control"
                            />
                          </td>
                          <td>
                            <input
                              type="number"
                              value={row.Copies}
                              onChange={(e) =>
                                handleInputChange(
                                  index,
                                  "Copies",
                                  e.target.value
                                )
                              }
                              style={{
                                width: "65px",
                              }}
                              className="salesreturn-control"
                              placeholder="Copies"
                            />
                          </td>
                          <td>
                            <input
                              type="text"
                              value={row.Price || ""}
                              readOnly
                              placeholder="Price"
                              style={{ width: "100px" }}
                              className="salesreturn-control"
                            />
                          </td>
                          <td>
                            <input
                              type="number"
                              value={row.Discount || ""}
                              onChange={(e) =>
                                handleInputChange(
                                  index,
                                  "Discount",
                                  e.target.value
                                )
                              }
                              style={{ width: "80px" }}
                              className="salesreturn-control"
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
                              className="salesreturn-control"
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
                      </React.Fragment>
                    ))
                  )}

                  {/* 🔹 Totals Row (NO index here) */}
                  <tr>
                    <td
                      colSpan="3"
                      style={{ textAlign: "right", fontWeight: "bold" }}>
                      Total Copies:
                    </td>
                    <td style={{ fontWeight: "bold" }}>{Ttl_copies}</td>
                    <td colSpan="2"></td>
                    <td style={{ fontWeight: "bold" }}>{Ttl_subtotal}</td>
                    <td></td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* 🔽 Book History Table */}
            {Object.keys(bookHistory).length > 0 && (
              <div
                className="book-history"
                style={{ marginTop: "5px" }}
                onClick={() => setBookHistory(false)}>
                <h4>Book History</h4>
                <div
                  style={{
                    fontSize: "14px",
                    color: "#0628ebff",
                    marginBottom: "6px",
                  }}>
                  ℹ Click anywhere inside this box to close the history
                </div>

                <table
                  style={{
                    width: "100%",
                    borderCollapse: "collapse",
                    border: "1px solid #ccc",
                  }}>
                  <thead>
                    <tr>
                      <th>Book Code</th>
                      <th>Trans Type</th>
                      <th>Date</th>
                      <th>Ref No</th>
                      <th>Copies</th>
                      <th>Disc %</th>
                    </tr>
                  </thead>
                  <tbody>
                    {rows.map((row, rowIndex) => {
                      const history = bookHistory[rowIndex] || [];
                      return history.map((h, i) => (
                        <tr key={`${rowIndex}-${i}`}>
                          <td>{row.BookCode}</td>
                          <td>{h.TransType}</td>
                          <td>{h.Date}</td>
                          <td>{h.RefNo}</td>
                          <td>{h.Copies}</td>
                          <td>{h.DiscountPercent}</td>
                        </tr>
                      ));
                    })}
                  </tbody>
                </table>
              </div>
            )}

            {/* Add / Less Section */}
            {/* Add / Less Section */}
            {/* Add / Less Section */}
            <Box mr={8} display="flex" justifyContent="flex-end">
              <Box width="500px">
                <Typography fontWeight="bold" mb={1}>
                  Add / Less
                </Typography>

                {adjustments.map((row, index) => (
                  <Box
                    key={index}
                    display="flex"
                    gap={1}
                    alignItems="center"
                    mb={1}>
                    <TextField
                      select
                      SelectProps={{ native: true }}
                      value={row.type}
                      onChange={(e) => handleTypeChange(index, e.target.value)}
                      size="small"
                      sx={{ width: 90 }}>
                      <option value="ADD">Add</option>
                      <option value="LESS">Less</option>
                    </TextField>

                    <TextField
                      placeholder="Particulars"
                      value={row.particular}
                      onChange={(e) =>
                        handleAdjustmentChange(
                          index,
                          "particular",
                          e.target.value
                        )
                      }
                      size="small"
                      sx={{ flex: 1 }}
                    />

                    <TextField
                      type="number"
                      placeholder="Percentage"
                      value={row.percentage}
                      onChange={(e) =>
                        handlePercentageChange(index, e.target.value)
                      }
                      size="small"
                      sx={{ width: 120 }}
                    />

                    <TextField
                      type="number"
                      placeholder="Amount"
                      value={row.amount}
                      onChange={(e) =>
                        handleAmountChange(index, e.target.value)
                      }
                      size="small"
                      sx={{ width: 120 }}
                    />

                    <Button
                      color="error"
                      variant="contained"
                      onClick={() => removeAdjustmentRow(index)}>
                      ×
                    </Button>
                  </Box>
                ))}

                <Button
                  variant="outlined"
                  onClick={addAdjustmentRow}
                  sx={{ mt: 1 }}>
                  + Add Row
                </Button>
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
                  InputProps={{
                    sx: {
                      fontSize: "1.2rem",
                      fontWeight: "bold",
                      height: "50px",
                      width: "205px",
                      color: "green",
                    },
                    readOnly: true,
                  }}
                />
              </Box>
            </Box>
          </Box>

          <Box
            display={"flex"}
            alignItems={"center"}
            justifyContent={"center"}
            gap={1}
            m={2}
            mt={10}>
            <Button
              variant="contained"
              onClick={handleSubmit}
              sx={{
                backgroundColor: "#0a60bd",
                color: "white",
                "&:hover": {
                  backgroundColor: "navy",
                  // Darker shade on hover (optional)
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
