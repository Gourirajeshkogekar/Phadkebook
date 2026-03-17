import React, { useState, useMemo, useEffect } from "react";
import "./Paymentvoucher.css";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Button, TextField, Modal } from "@mui/material";
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
  Grid,
  Table,
  TableBody,
  TableCell,
  Checkbox,
  TableContainer,
  TableHead,
  Typography,
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
import { DatePicker } from "@mui/x-date-pickers";
import { Edit, Delete, Add, MoreVert, Print } from "@mui/icons-material";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import PrintIcon from "@mui/icons-material/Print";

import { Select as MuiSelect, Select } from "@mui/material";
import { v4 as uuidv4 } from "uuid";

function Paymentvoucher() {
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

    fetchVouchers();
  }, []);

  const [anchorEl, setAnchorEl] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(null);
  const [selectedIndex, setSelectedIndex] = useState(null);
  const [VoucherType, setVoucherType] = useState("PY");
  const [VoucherNo, setVoucherNo] = useState(null);
  const [VoucherDate, setVoucherDate] = useState(dayjs());
  const [ChequeDate, setChequeDate] = useState(dayjs());

  const [PaymentType, setPaymentType] = useState("");

  const [editingRowId, setEditingRowId] = useState(null);

  const paymentTypeMap = {
    0: "Cash",
    1: "Bank",
    2: "UPI",
  };
  const [ChequeNo, setChequeNo] = useState("");
  const [Balance, setBalance] = useState("");

  // const [ChequeDate, setChequeDate] = useState("");
  const [IsOldCheque, setIsoldcheque] = useState(false);
  const [AccountPayeeCheque, setAccountpayeecheque] = useState(false);
  const [Narration, setNarration] = useState("");
  const [DOrC, setDrOrCr] = useState("C");
  const [AccountId, setAccountId] = useState("");
  const [bankAccountId, setBankAccountId] = useState(null); // Cash/Bank
  const [partyAccountId, setPartyAccountId] = useState(null); // Party
  const [bankRow, setBankRow] = useState(null);

  const [Amount, setAmount] = useState("");

  // const [TotalDebit, setTotaldebit] = useState("");
  // const [TotalCredit, setTotalcredit] = useState("");

  const handleafterprint = (e) => {
    e.preventDefault();
  };

  const [editingIndex, setEditingIndex] = useState(-1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [id, setId] = useState("");

  const [paymentdetailId, setPaymentdetailId] = useState("");
  const [errors, setErrors] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [payments, setPayments] = useState([]);
  const [paymentdetails, setPaymentdetails] = useState([]);

  const [accountOptions, setAccountOptions] = useState([]);
  const [banks, setBanks] = useState([]);
  const [selectedBank, setSelectedBank] = useState("");
  const [selectedParty, setSelectedParty] = useState("");
  const [parties, setParties] = useState([]);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [deleteIndex, setDeleteIndex] = useState(null);
  const [deleteId, setDeleteId] = useState(null);

  const [rows, setRows] = useState([
    {
      SerialNo: "",
      AccountId: "",
      Amount: 0,
      DOrC: "",
      CostCenterId: 0,
      Narration: "",
      ChequeNo: 0,
      ChequeDate: "",
      ChequeAmount: 0,
      MICRCode: "",
      BankName: "",
      BankBranch: "",
      IsOldCheque: "",
      AccountPayeeCheque: "",
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

  const [editIndex, setEditIndex] = useState(null);
  const [accountList, setAccountList] = useState([]); // Your accounts

  const handleChange = (e) => {
    const { name, value } = e.target;
    setRows((prev) => ({ ...prev, [name]: value }));
  };

  const handleAdd = () => {
    if (!rows.AccountId || !rows.Amount) return; // Basic validation

    if (editIndex !== null) {
      // Update existing row
      const updatedRows = rows.map((row, idx) =>
        idx === editIndex ? { ...rows } : row,
      );
      setRows(updatedRows);
      setEditIndex(null);
    } else {
      // Add new row
      setRows([...rows, { ...rows }]);
    }

    // Reset form
    setRows({ AccountId: "", DOrC: "", Amount: "", Narration: "" });
  };

  const handleRowClick = (row, index) => {
    setRows(row);
    setEditIndex(index);
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
    fetchPayments();
    fetchVouchers();
    fetchVoucherdetails();
    fetchAccounts();
  }, []);

  useEffect(() => {
    if (
      isEditing &&
      accountOptions.length > 0 &&
      bankAccountId &&
      partyAccountId
    ) {
      // forces Autocomplete re-evaluation
      setBankAccountId((prev) => prev);
      setPartyAccountId((prev) => prev);
    }
  }, [accountOptions]);

  useEffect(() => {
    let debit = 0;
    let credit = 0;

    rows.forEach((row) => {
      const amt = Number(row.Amount) || 0;

      if (row.DOrC === "D") {
        debit += amt;
      } else if (row.DOrC === "C") {
        credit += amt;
      }
    });

    setTotalDebit(debit);
    setTotalCredit(credit);
  }, [rows]);

    const fetchPayments = async () => {
    try {
      const response = await axios.get(
        "https://publication.microtechsolutions.net.in/php/Vouchertypeget.php?VoucherType=PY",
      );
      console.log(response.data, "payment vouchers");
      setPayments(response.data);
    } catch (error) {
      console.error("Error fetching Vouchers:", error); // Log the error for debugging
      // toast.error("Error fetching Vouchers: " + error.message); // Provide more context in the toast message
    }
  };

  const fetchVouchers = async () => {
    try {
      const response = await axios.get(
        "https://publication.microtechsolutions.net.in/php/Voucherhdget.php?VoucherType=PY",
      );
      setPayments(response.data);
    } catch (error) {
      // toast.error("Error fetching Vouchers:", error);
      console.error("Error fetching Vouchers:", error);
    }
  };

  const fetchVoucherdetails = async () => {
    try {
      const response = await axios.get(
        "https://publication.microtechsolutions.net.in/php/Voucherdetailget.php",
      );
      setPaymentdetails(response.data);
    } catch (error) {
      // toast.error("Error fetching Voucher details:", error);
      console.error("Error fetching Voucher details:", error);
    }
  };

  const fetchAccounts = async () => {
    try {
      const response = await axios.get(
        "https://publication.microtechsolutions.net.in/php/Accountget.php",
      );
      const accountOptions = response.data.map((acc) => ({
        value: acc.Id,
        label: acc.AccountName,
      }));
      setAccountOptions(accountOptions);
    } catch (error) {
      toast.error("Error fetching Accounts:", error);
    }

    
  };

  const [bankOptions, setBankOptions] = useState([])

  useEffect(() => {
  const fetchBanks = async () => {
    try {
      const response = await axios.get(
        "https://publication.microtechsolutions.net.in/php/get/getbycolm.php?Table=Account&Colname=GroupId&Colvalue=10"
      );
      
      // Map the API data to the format MUI Autocomplete needs
      const formattedData = response.data.map((item) => ({
        label: item.AccountName,
        value: item.Id,
        // You can keep the whole item if you need it later
        raw: item 
      }));

      setBankOptions(formattedData);
    } catch (error) {
      console.error("Error fetching bank accounts:", error);
    }
  };

  fetchBanks();
}, []);

const [partyDetails, setPartyDetails] = useState(null);
 const fetchPartyDetails = async (accountId) => {
  try {
    const response = await axios.get(
      `https://publication.microtechsolutions.net.in/php/Addressget.php?AccountId=${accountId}`
    );

    console.log("Party Details:", response.data);

    if (
      response.data?.status === "success" &&
      response.data?.data?.length > 0
    ) {
      setPartyDetails(response.data.data[0]); // ✅ correct path
    } else {
      setPartyDetails(null);
    }
  } catch (error) {
    console.error("Error fetching party details:", error);
    setPartyDetails(null);
  }
};

  const handleInputChange = (index, field, value) => {
    const updatedRows = [...rows];
    updatedRows[index][field] = value;

    const selectedDate = dayjs(value);
    const today = dayjs();
    const minDate = today.subtract(3, "day");
    const maxDate = today.add(2, "day");

    const updatedErrors = [...rowErrors];
    if (!updatedErrors[index]) {
      updatedErrors[index] = {};
    }

    if (field === "ChequeDate") {
      if (!selectedDate.isValid()) {
        updatedErrors[index][field] = "Invalid date";
      } else if (
        selectedDate.isBefore(minDate) ||
        selectedDate.isAfter(maxDate)
      ) {
        updatedErrors[index][field] =
          "You can select only 2 days before or after today";
      } else {
        updatedErrors[index][field] = ""; // Clear error
      }
    }
    let totalCredit = 0;
    let totalDebit = 0;

    console.log("Updated Rows:", updatedRows); // Debugging

    updatedRows.forEach((row, rowIndex) => {
      console.log(`Row: ${JSON.stringify(row)}`); // Debug each row

      let amount = parseFloat(row.Amount) || 0; // Ensure valid number

      if (rowIndex === 0) {
        // ✅ Automatically take first row's amount as Total Credit
        totalCredit = amount;
      } else {
        if (row.DOrC === "D") {
          totalDebit += amount;
        }
      }
    });

    console.log("Total Credit:", totalCredit, "Total Debit:", totalDebit);

    setRows(updatedRows);
    setRowErrors(updatedErrors);

    // setTotalcredit(totalCredit); // ✅ First row's amount is now Total Credit
    // setTotaldebit(totalDebit);
  };

  const handleAddRow = () => {
    setRows([
      ...rows,
      {
        SerialNo: "",
        AccountId: "", // Default value for the first row
        Amount: 0,
        DOrC: "",
        CostCenterId: 0,
        Narration: "",
        ChequeNo: 0,
        ChequeDate: "",
        ChequeAmount: 0,
        MICRCode: "",
        BankName: "",
        BankBranch: "",
        IsOldCheque: "",
        AccountPayeeCheque: "",
      },
    ]);
  };

  const handleDeleteRow = (index) => {
    const updatedRows = rows.filter((_, i) => i !== index);
    setRows(updatedRows);
  };

  const resetForm = () => {
    setVouchersafedate(dayjs());
    setDateError("");
    setVoucherNo("");
    setChequeNo("");
    setchequesafeDate(dayjs());
    setChequedateerror("");
    setNarration("");
    setAmount("");
    setIsoldcheque("");
    setAccountpayeecheque("");
    setAccountId("");
    setRowAmount("");
    setRowNarration("");
    setBankAccountId("");
    setPartyAccountId("");

    setRows([
      {
        SerialNo: "",
        AccountId: "", // Default value for the first row
        Amount: 0,
        DOrC: "",
        bankAccountId: "",
        partyAccountId: "",
        rowAmount: 0,
        rowNarration: "",
        rowDC: "",
        CostCenterId: 0,
        Narration: "",
        ChequeNo: 0,
        ChequeDate: "",
        ChequeAmount: 0,
        MICRCode: "",
        BankName: "",
        BankBranch: "",
        IsOldCheque: false,
        AccountPayeeCheque: false,
      },
    ]);

    setRows([]);
  };

  const handleNewClick = () => {
    resetForm();

    setIsDrawerOpen(true);
    setIsEditing(false);
    setEditingIndex(-1);
  };

  const [isLoading, setIsLoading] = useState(false);

  const [idwiseData, setIdwiseData] = useState("");

  const handleEditRow = (row) => {
    // ❌ never edit BANK row
    if (row.type === "BANK") return;

    setEditingRowId(row?.id);

    setPartyAccountId(row?.AccountId);
    setRowAmount(row?.Amount);
    setRowDC(row?.DOrC);
    setRowNarration(row?.Narration);
  };

  const handleEdit = () => {
    if (currentRow) {
      console.log("Editing item with ID:", currentRow.original.Id);
      setIdwiseData(currentRow.original.Id);
    }

    
    setIsLoading(true);
    console.log(currentRow, "row");
    const paymentheader = payments[currentRow.index];

    console.log(paymentheader, "payment voucher header");
    // Filter purchase details to match the selected PurchaseId
    const paymentdetail = paymentdetails.filter(
      (detail) => detail.VoucherId === paymentheader.Id,
    );

    console.log(paymentdetail, "paymentdetail");

    // Helper function to safely parse date strings
    const convertDateForInput = (dateStr) => {
      if (typeof dateStr === "string" && dateStr.includes("-")) {
        const [year, month, day] = dateStr.split(" ")[0].split("-");
        return `${year}-${month}-${day}`;
      } else if (dateStr?.date) {
        const [year, month, day] = dateStr.date.split(" ")[0].split("-");
        return `${year}-${month}-${day}`;
      } else {
        return null;
      }
    };

    // --- Safely parse and set VoucherDate ---
    const voucherdate = convertDateForInput(paymentheader.VoucherDate?.date);
    if (voucherdate && dayjs(voucherdate).isValid()) {
      setVouchersafedate(dayjs(voucherdate));
    } else {
      setVouchersafedate(null);
      console.warn("Invalid VoucherDate:", paymentheader.VoucherDate);
    }

    const chequeDate = convertDateForInput(paymentheader.ChequeDate?.date);
    if (chequeDate && dayjs(chequeDate).isValid()) {
      setchequesafeDate(dayjs(chequeDate));
    } else {
      setchequesafeDate(null);
      console.warn("Invalid ChequeDate:", paymentheader.ChequeDate);
    }

    const mappedRows = paymentdetail.map((detail) => {
      const acc = accountOptions.find((a) => a.value === detail.AccountId);

      return {
        id: uuidv4(), // ✅ frontend-only id
        dbId: detail.Id, // ✅ backend id (important for update)

        VoucherId: detail?.VoucherId,
        AccountId: detail?.AccountId,
        AccountName: acc ? acc.label : "",
        Amount: detail?.Amount,
        DOrC: detail?.DOrC,
        Narration: detail?.Narration,
        type: detail?.DOrC === "C" ? "BANK" : "PARTY",

        IsOldCheque: detail?.IsOldCheque === 1,
        AccountPayeeCheque: detail?.AccountPayeeCheque === 1,

        CostCenterId: detail?.CostCenterId,
        ChequeNo: detail?.ChequeNo,
        ChequeAmount: detail?.ChequeAmount,
        ChequeDate: detail?.ChequeDate
          ? convertDateForInput(detail?.ChequeDate.date)
          : "",
        MICRCode: detail?.MICRCode,
        BankName: detail?.BankName,
        BankBranch: detail?.BankBranch,
      };
    });

    const bankRow = mappedRows.find((r) => r.DOrC === "C");
    const partyRow = mappedRows.find((r) => r.DOrC === "D");
    // Prefer bank row, fallback to party row
    const chequeRow = bankRow || partyRow;

    if (chequeRow) {
      setAccountpayeecheque(chequeRow.AccountPayeeCheque === true);
    }
    if (bankRow) {
      setBankAccountId(bankRow?.AccountId);
      setRowNarration(partyRow?.Narration);
    }

    if (partyRow) {
      setPartyAccountId(partyRow.AccountId);
      setRowAmount(partyRow.Amount);
      setRowNarration(partyRow?.Narration);
    }

    setVoucherNo(paymentheader?.VoucherNo);
    setVouchersafedate(dayjs(voucherdate));
    setchequesafeDate(dayjs(chequeDate));
    setChequeNo(paymentheader?.ChequeNo);
    setPaymentType(Number(paymentheader?.PaymentType));
    console.log(paymentheader, "payment header");
    console.log(paymentdetail, "payment detail");
    console.log(mappedRows, "mapped rows");

    setRows([]); // clear old rows
    setRows(mappedRows); // load DB rows
    setEditingIndex(currentRow.index);
    setIsDrawerOpen(true);
    setIsEditing(true);
    setId(paymentheader.Id);
    handleMenuClose();
    const specificDetail = paymentdetail.find(
      (detail) => detail.Id === currentRow.original.Id,
    );
    if (specificDetail) {
      setPaymentdetailId(specificDetail.Id);
    }

    fetchVoucherdetails().then(() => {
      setIsLoading(false);
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
    setIsDeleteDialogOpen(true); // Show confirmation dialog
    handleMenuClose();
  };

  const confirmDelete = () => {
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/x-www-form-urlencoded");

    // Prepare URL with dynamic parameters
    const url = `https://publication.microtechsolutions.net.in/php/Voucherhddelete.php`;

    const urlencoded = new URLSearchParams();
    urlencoded.append("Id", deleteId);

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
        toast.success("Payment Voucher Deleted Successfully"); // Show success toast
        setIsDeleteDialogOpen(false); // Close delete dialog
        fetchVouchers(); // Refresh vouchers list
        fetchPayments()
      })
      .catch((error) => {
        console.error("Error:", error);
        // toast.error('Failed to delete Payment Voucher'); // Show error toast if it fails
      });
  };

  const cancelDelete = () => {
    setIsDeleteDialogOpen(false);
    setDeleteIndex(null);
  };

  const [vouchersafedate, setVouchersafedate] = useState(dayjs());

  const handleDateChange1 = (newValue) => {
    if (!newValue || !dayjs(newValue).isValid()) {
      setDateError("Invalid date");
      setVouchersafedate(null);
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

    setVouchersafedate(newValue);
  };

  const [chequesafeDate, setchequesafeDate] = useState(dayjs());
  const [chequedateerror, setChequedateerror] = useState(false);

  const handleDateChange2 = (newValue) => {
    if (!newValue || !dayjs(newValue).isValid()) {
      setChequedateerror("Invalid date");
      setchequesafeDate(null);
      return;
    }

    const today = dayjs();
    const minDate = today.subtract(3, "day");
    const maxDate = today.add(2, "day");

    if (newValue.isBefore(minDate) || newValue.isAfter(maxDate)) {
      setChequedateerror("You can select only 2 days before or after today");
    } else {
      setChequedateerror("");
    }

    setchequesafeDate(newValue);
  };

  const [rowErrors, setRowErrors] = useState([]);
  const isCashOrBankAccount = (accountId) => {
    return Number(accountId) === Number(bankAccountId);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    let TotalDebit = 0;
    let TotalCredit = 0;

    rows.forEach((row) => {
      const amount = parseFloat(row.Amount || 0);
      const dc = row.DOrC;

      if (dc === "D") {
        TotalDebit += amount;
      } else if (dc === "C") {
        TotalCredit += amount;
      }
    });

    if (TotalDebit !== TotalCredit) {
      toast.error(
        `Debit (${TotalDebit}) and Credit (${TotalCredit}) amounts must be equal!`,
      );
      return;
    }

    const cashBankRows = rows.filter((r) => isCashOrBankAccount(r.AccountId));

    const totalCashBank = cashBankRows.reduce(
      (sum, r) => sum + (r.DOrC === "C" ? r.Amount : -r.Amount),
      0,
    );

    if (totalCashBank <= 0) {
      toast.error("Payment Voucher must reduce Cash/Bank balance");
      return;
    }

    const bankCredits = rows.filter(
      (r) => isCashOrBankAccount(r.AccountId) && r.DOrC === "C",
    );

    if (bankCredits.length !== 1) {
      toast.error("Exactly one Cash/Bank Credit entry is required");
      return;
    }

    const formattedVoucherDate = dayjs(VoucherDate).format("YYYY-MM-DD");
    const formattedChequeDate = dayjs(ChequeDate).format("YYYY-MM-DD");

    const voucherData = {
      Id: isEditing ? id : "",
      VoucherType: "PY",
      VoucherNo: VoucherNo ? VoucherNo : null,
      VoucherDate: formattedVoucherDate,
      ChequeNo: ChequeNo,
      ChequeDate: formattedChequeDate,
      RefNo: "RefNo",
      Narration: Narration,
      PaymentType: PaymentType,
      CreatedBy: !isEditing ? userId : undefined,
      UpdatedBy: isEditing ? userId : undefined,
    };

    try {
      const voucherUrl = isEditing
        ? "https://publication.microtechsolutions.net.in/php/Voucherhdupdate.php"
        : "https://publication.microtechsolutions.net.in/php/Voucherhdpost.php";

      const response = await axios.post(voucherUrl, voucherData, {
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
      });

      console.log("PY API Response:", response.data);

      const voucherId = isEditing ? id : parseInt(response.data.Id, 10);
      const voucherNo = isEditing
        ? VoucherNo
        : parseInt(response.data.VoucherNo);

      for (const [index, row] of rows.entries()) {
        const rowData = {
          VoucherId: voucherId,
          VoucherType: "PY",
          SRN: index + 1,
          VoucherNo: VoucherNo ? voucherNo : null,
          VoucherDate: formattedVoucherDate,
          AccountId: parseInt(row.AccountId, 10),
          Amount: parseFloat(row.Amount),
          DOrC: row.DOrC,
          Narration: row.Narration,
          CostCenterId: row.CostCenterId,
  ChequeNo: ChequeNo,          // ✅ USE HEADER VALUE
          ChequeDate: row.ChequeDate
            ? dayjs(row.ChequeDate).format("YYYY-MM-DD")
            : formattedVoucherDate,
          ChequeAmount: row.ChequeAmount,
          MICRCode: row.MICRCode,
          BankName: row.BankName,
          BankBranch: row.BankBranch,
          IsOldCheque: IsOldCheque,
          AccountPayeeCheque: AccountPayeeCheque ? 1 : 0,
          // Id: row.Id,
          // CreatedBy: row.Id ? undefined : userId,
          // UpdatedBy: row.Id ? userId : undefined,
          Id: row.dbId, // ✅ backend id
          CreatedBy: row.dbId ? undefined : userId,
          UpdatedBy: row.dbId ? userId : undefined,
        };

        // const voucherdetailurl =
        //   isEditing && row.Id
        //     ? "https://publication.microtechsolutions.net.in/php/Voucherdetailupdate.php"
        //     : "https://publication.microtechsolutions.net.in/php/Voucherdetailpost.php";

        const voucherdetailurl =
          isEditing && row.dbId
            ? "https://publication.microtechsolutions.net.in/php/Voucherdetailupdate.php"
            : "https://publication.microtechsolutions.net.in/php/Voucherdetailpost.php";

        await axios.post(voucherdetailurl, qs.stringify(rowData), {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
        });
      }

      // rest of your success logic...

      // ✅ Step 7: Update frontend
      if (isEditing) {
        setPayments((prev) =>
          prev.map((voucher) =>
            voucher.Id === id ? { ...voucher, ...voucherData } : voucher,
          ),
        );
      } else {
        setPayments((prev) => [...prev, { ...voucherData, Id: voucherId }]);
      }

      fetchVouchers();
      fetchVoucherdetails();

      setIsDrawerOpen(false);
      toast.success(
        isEditing
          ? "Payment Voucher & Details updated successfully!"
          : "Payment Voucher & Details added successfully!",
      );
      resetForm();
    } catch (error) {
      console.error("Error saving record!", error);
      toast.error("Error saving record!");
    }
  };

  const navigate = useNavigate();

  const handlePrint = () => {
    navigate(
      `/transaction/paymentvoucher/paymentvoucherprint/${currentRow.original.Id}`,
    );
  };

  const dOrCOptions = [
    { value: "D", label: "D" },
    { value: "C", label: "C" },
  ];

  const [rowAmount, setRowAmount] = useState("");
  const [rowDC, setRowDC] = useState("D");
  const [rowNarration, setRowNarration] = useState("");

  // Totals
  const [TotalDebit, setTotalDebit] = useState(0);
  const [TotalCredit, setTotalCredit] = useState(0);


useEffect(() => {
  if (bankAccountId && rows.length > 0) {
    const bankAcc = accountOptions.find((a) => a.value === bankAccountId);
    if (bankAcc) {
      setRows((prev) =>
        prev.map((r) =>
          r.type === "BANK"
            ? { ...r, AccountId: bankAccountId, AccountName: bankAcc.label }
            : r
        )
      );
    }
  }
}, [bankAccountId]);

//   const addRow = () => {
//   // 1. Validation: Ensure we have a party, an amount, and the header bank account selected
//   if (!partyAccountId || !rowAmount || !bankAccountId) {
//     toast.error("Please select an Account, Amount, and Cash/Bank A/c first.");
//     return;
//   }

//   const partyAcc = accountOptions.find((a) => a.value === partyAccountId);

//   setRows((prev) => {
//     // 2. Keep all existing "PARTY" rows
//     let currentPartyRows = prev.filter((r) => r.type === "PARTY");

//     if (editingRowId) {
//       // 3. If editing, find that specific row and update it
//       currentPartyRows = currentPartyRows.map((r) =>
//         r.id === editingRowId
//           ? {
//               ...r,
//               AccountId: partyAccountId,
//               AccountName: partyAcc.label,
//               Amount: Number(rowAmount),
//               DOrC: "D",
//               Narration: rowNarration,
//             }
//           : r
//       );
//     } else {
//       // 4. If adding, push the new row into the array (allowing multiple rows)
//       currentPartyRows.push({
//         id: uuidv4(),
//         AccountId: partyAccountId,
//         AccountName: partyAcc.label,
//         Amount: Number(rowAmount),
//         DOrC: "D",
//         Narration: rowNarration,
//         type: "PARTY",
//       });
//     }

//     // 5. Recalculate the single "BANK" row based on the sum of ALL party rows
//     const totalPartyAmount = currentPartyRows.reduce(
//       (sum, r) => sum + Number(r.Amount),
//       0
//     );

//     const bankAcc = accountOptions.find((a) => a.value === bankAccountId);

//     const updatedBankRow = {
//       id: "BANK", // Keep ID constant so it overwrites the old bank row
//       AccountId: bankAccountId,
//       AccountName: bankAcc.label,
//       Amount: totalPartyAmount,
//       DOrC: "C",
//       Narration: "Payment",
//       type: "BANK",
//     };

//     // 6. Return the list of all parties + the updated single bank row
//     return [...currentPartyRows, updatedBankRow];
//   });

//   // 7. Reset the row form fields for the next entry
//   setEditingRowId(null);
//   setPartyAccountId(null);
//   setRowAmount("");
//   setRowNarration("");
// };

const addRow = () => {
  // 1. Validation
  if (!partyAccountId || !rowAmount || !bankAccountId) {
    toast.error("Please select an Account, Amount, and Cash/Bank A/c first.");
    return;
  }

  const partyAcc = accountOptions.find((a) => a.value === partyAccountId);

 setRows((prev) => {
  // 1. Get all existing party rows, excluding any old bank rows
  let currentPartyRows = prev.filter((r) => r.type === "PARTY");

  if (editingRowId) {
    // Update existing party row
    currentPartyRows = currentPartyRows.map((r) =>
      r.id === editingRowId
        ? {
            ...r,
            AccountId: partyAccountId,
            AccountName: partyAcc.label,
            Amount: Number(rowAmount),
            DOrC: "D",
            Narration: rowNarration,
          }
        : r
    );
  } else {
    // Add new party row
    currentPartyRows.push({
      id: uuidv4(),
      AccountId: partyAccountId,
      AccountName: partyAcc.label,
      Amount: Number(rowAmount),
      DOrC: "D",
      Narration: rowNarration,
      type: "PARTY",
    });
  }

  // 2. Calculate sum of all party rows
  const totalPartyAmount = currentPartyRows.reduce(
    (sum, r) => sum + Number(r.Amount),
    0
  );

  const bankAcc = accountOptions.find((a) => a.value === bankAccountId);

  const updatedBankRow = {
    id: "BANK",
    AccountId: bankAccountId,
    AccountName: bankAcc.label,
    Amount: totalPartyAmount,
    DOrC: "C",
    Narration: "Payment",
    type: "BANK",
  };

  // 3. CRITICAL: Assemble array with Bank at index 0
  return [updatedBankRow, ...currentPartyRows];
});

  // 7. Reset form
  setEditingRowId(null);
  setPartyAccountId(null);
  setRowAmount("");
  setRowNarration("");
};

  const deleteRow = async (rowId) => {
    setRows((prev) => {
      const row = prev.find((r) => r.id === rowId);

      // ❌ Bank row protection
      if (row?.type === "BANK") {
        toast.warning("Bank row cannot be deleted");
        return prev;
      }

      const partyRows = prev.filter(
        (r) => r.type === "PARTY" && r.id !== rowId,
      );

      // ❌ At least one party required
      if (partyRows.length < 1) {
        toast.warning("At least one party entry is required");
        return prev;
      }

      // 🔥 Recalculate BANK row
      const total = partyRows.reduce((s, r) => s + Number(r.Amount), 0);
      const bankRow = prev.find((r) => r.type === "BANK");

      return [
        ...partyRows,
        {
          ...bankRow,
          Amount: total,
        },
      ];
    });

    // ✅ BACKEND DELETE (EDIT MODE ONLY)
    if (isEditing) {
      const row = rows.find((r) => r.id === rowId);

      if (row?.dbId) {
        try {
          await axios.post(
            "https://publication.microtechsolutions.net.in/php/Voucherdetaildelete.php",
            qs.stringify({ Id: row.dbId }),
            {
              headers: {
                "Content-Type": "application/x-www-form-urlencoded",
              },
            },
          );
        } catch (err) {
          toast.error("Failed to delete row from server");
          console.error(err);
        }
      }
    }

    // 🧹 Reset edit form if needed
    if (editingRowId === rowId) {
      setEditingRowId(null);
      setPartyAccountId(null);
      setRowAmount("");
      setRowNarration("");
    }
  };

  const columns = useMemo(
    () => [
      {
        accessorKey: "SrNo",
        header: "Sr.No",
        size: 10,
        Cell: ({ row }) => row.index + 1,
      },

   

      

      {
        accessorKey: "VoucherNo",
        header: "V No",
        size: 70,
      },
      {
        accessorKey: "VoucherDate.date",
        header: "Voucher Date",
        size: 100,
        Cell: ({ cell }) => {
           const date = dayjs(cell.getValue()).format("DD-MM-YYYY");
          return <span>{date}</span>;
        },
      },

         {
      accessorKey: "AccountName", // Matches your JSON key exactly
      header: "Account Name",
      size: 150,
    },
    {
      accessorKey: "Amount", // Matches your JSON key exactly
      header: "Amount",
      size: 80,
      // Optional: Formats the string "100.00" to look like currency
      Cell: ({ cell }) => parseFloat(cell.getValue() || 0).toFixed(2),
    },

      {
        accessorKey: "actions",
        header: "Actions",
        size: 80,
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
    [payments],
  );

 const table = useMaterialReactTable({
  columns,
  data: payments,
  enableColumnResizing: true, // Optional: let users resize columns
  layoutMode: 'grid',         // CRITICAL: Helps manage column widths
  initialState: {
  columnPinning: { right: ['actions'] }, // 'actions' is the accessorKey
},
  displayColumnDefOptions: {
    'mrt-row-actions': {
      size: 50, // Force specific size for actions
    },
  },
  muiTableContainerProps: {
    sx: {
      width: '100%',
      overflowX: 'auto', // Ensures the internal container scrolls
    },
  },
  muiTableHeadCellProps: {
    style: {
      backgroundColor: "#E9ECEF",
      color: "black",
      fontSize: "16px",
    },
  },
});

  return (
    <div className="paymentvoucher-container">
      <h1>Payment Voucher</h1>

      <div className="paymentvouchertable-master">
        <div className="paymentvouchertable1-master">
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
          <div className="paymentvouchertable-container">
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
            },
          }}>
          <Box
            sx={{
              padding: 1,
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}>
            <Typography variant="h6">
              <b>
                {isEditing ? "Edit Payment Voucher" : "Create Payment Voucher"}
              </b>
            </Typography>{" "}
            <CloseIcon sx={{ cursor: "pointer" }} onClick={handleDrawerClose} />
          </Box>

          <Paper sx={{ p: 1, mb: 1 }} elevation={2}>
            <Grid container spacing={1} alignItems="center">
              <Grid item xs={2}>
                <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                  Entry No
                </Typography>{" "}
                <TextField
                  size="small"
                  value={VoucherNo}
                  onChange={(e) => setVoucherNo(e.target.value)}
                />
              </Grid>

              <Grid item xs={3}>
                <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                  Date
                </Typography>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DatePicker
                    value={VoucherDate}
                    onChange={(newValue) => setVoucherDate(newValue)}
                    format="DD-MM-YYYY"
                    slotProps={{
                      textField: { size: "small", fullWidth: true },
                    }}
                  />
                </LocalizationProvider>
              </Grid>

              <Grid item xs={5}>
                <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                  Cash/Bank A/c
                </Typography>
                <Autocomplete
                  options={bankOptions}
                  value={
                    bankOptions.find((o) => o.value === bankAccountId) ||
                    null
                  }
                  onChange={(e, newValue) => {
                    setBankAccountId(newValue ? newValue.value : null);
                  }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      size="small"
                      placeholder="Select Cash/Bank"
                    />
                  )}
                />
              </Grid>

              <Grid item xs={3}>
                <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                  Cheque No
                </Typography>
                <TextField
                  size="small"
                  value={ChequeNo}
                  onChange={(e) => setChequeNo(e.target.value)}
                  fullWidth
                />
              </Grid>

              <Grid item xs={2}>
                <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                  Cheque Date
                </Typography>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DatePicker
                    value={ChequeDate}
                    onChange={(newValue) => setChequeDate(newValue)}
                    format="DD-MM-YYYY"
                    slotProps={{
                      textField: { size: "small", fullWidth: true },
                    }}
                  />
                </LocalizationProvider>
              </Grid>

              <Grid item xs={3}>
                <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                  Balance
                </Typography>
                <TextField
                  size="small"
                  value={Balance}
                  onChange={(e) => setBalance(e.target.value)}
                  fullWidth
                />
              </Grid>
              <Grid item xs={12}>
                <Box
                  sx={{
                    mt: 0,
                    p: 1,
                    bgcolor: "#E8F5FF",
                    borderRadius: 1,
                  }}>
                  <Grid container alignItems="center" spacing={2} wrap="wrap">
                    {/* Payment Mode Label */}
                    <Grid item>
                      <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                        Payment Mode
                      </Typography>
                    </Grid>

                    {/* Radio Buttons */} 
                    <Grid item>
                      <RadioGroup
                        row
                        value={PaymentType}
                        onChange={(e) =>
                          setPaymentType(Number(e.target.value))
                        }>
                        <FormControlLabel
                          value={0}
                          control={<Radio />}
                          label={
                            <Typography fontWeight="bold">Cash</Typography>
                          }
                        />
                        <FormControlLabel
                          value={1}
                          control={<Radio />}
                          label={
                            <Typography fontWeight="bold">Bank</Typography>
                          }
                        />
                        <FormControlLabel
                          value={2}
                          control={<Radio />}
                          label={<Typography fontWeight="bold">UPI</Typography>}
                        />
                      </RadioGroup>
                    </Grid>

                    {/* Particulars Label */}
                    <Grid item>
                      <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                        Cash / Bank Particulars
                      </Typography>
                    </Grid>

                    {/* Checkbox */}
                    <Grid item>
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={AccountPayeeCheque}
                            onChange={(e) =>
                              setAccountpayeecheque(e.target.checked)
                            }
                          />
                        }
                        label={
                          <Typography fontWeight="bold">
                            Account Payee Cheque?
                          </Typography>
                        }
                      />
                    </Grid>

                    <Grid>
                      <Button variant="contained" color="primary" size="large">
                        Print <br />
                        Cheque
                      </Button>
                    </Grid>
                  </Grid>
                </Box>
              </Grid>
            </Grid>
          </Paper>

          {/* Row form - Account (Parties), Amount, Dr/Cr, Narration, Add/Drop */}
          <Paper sx={{ p: 1, mb: 1 }} elevation={2}>
            <Grid container spacing={1} alignItems="center">
              <Grid item xs={6}>
                <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                  Account
                </Typography>
                <Autocomplete
                  options={accountOptions}
                  value={
                    accountOptions.find((o) => o.value === partyAccountId) ||
                    null
                  }
                 onChange={(e, newValue) => {
  const id = newValue ? newValue.value : null;
  setPartyAccountId(id);

  if (id) {
    fetchPartyDetails(id);  // 🔥 CALL API
  } else {
    setPartyDetails(null);
  }
}}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      size="small"
                      placeholder="Select Party"
                    />
                  )}
                />
              </Grid>

              <Grid item xs={2}>
                <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                  Amount
                </Typography>
                <TextField
                  size="small"
                  value={rowAmount}
                  onChange={(e) => setRowAmount(e.target.value)}
                  fullWidth
                />
              </Grid>

              <Grid item xs={1}>
                <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                  Dr/Cr
                </Typography>
                <MuiSelect
                  value={rowDC}
                  size="small"
                  onChange={(e) => setRowDC(e.target.value)}
                  fullWidth>
                  <MenuItem value={"D"}>D</MenuItem>
                  <MenuItem value={"C"}>C</MenuItem>
                </MuiSelect>
              </Grid>

              <Grid item xs={2}>
                <Button variant="contained" onClick={addRow}>
                  {editingRowId ? "Update Row" : "Add"}
                </Button>

                <Button
                  variant="outlined"
                  onClick={() => {
                    setEditingRowId(null);
                    setPartyAccountId(null);
                    setRowAmount("");
                    setRowDC("D");
                    setRowNarration("");
                  }}
                  sx={{ mt: 2, ml: 1 }}>
                  Drop
                </Button>
              </Grid>

              <Grid item xs={12}>
                <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                  Narration
                </Typography>
                <TextField
                  size="small"
                  fullWidth
                  value={rowNarration}
                  onChange={(e) => setRowNarration(e.target.value)}
                />
              </Grid>
            </Grid>
          </Paper>

          {/* Table */}
          <Paper elevation={2}>
<TableContainer sx={{ maxHeight: 200, overflowY: 'auto' }}>
                <Table stickyHeader size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Sr.No</TableCell>
                    <TableCell>Account Name</TableCell>
                    <TableCell>Amount</TableCell>
                    <TableCell>Dr/Cr</TableCell>
                    <TableCell>Particulars</TableCell>
                    <TableCell>Action</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {rows.map((r, i) => (
                    <TableRow
                      key={r.id}
                      onClick={() => handleEditRow(r)}
                      sx={{
                        cursor: r.type === "BANK" ? "not-allowed" : "pointer",
                        backgroundColor:
                          r.type === "BANK" ? "#f5f5f5" : "inherit",
                      }}>
                      <TableCell>{i + 1}</TableCell>
                      <TableCell>{r.AccountName}</TableCell>
                      <TableCell>{r.Amount}</TableCell>
                      <TableCell>{r.DOrC}</TableCell>
                      <TableCell>{r.Narration}</TableCell>
                      <TableCell>
                        <Button
                          size="small"
                          color="error"
                          disabled={r.type === "BANK"}
                          onClick={(e) => {
                            e.stopPropagation(); // 🔥 prevents edit click
                            deleteRow(r.id); // 🔥 pass correct row id
                          }}>
                          Delete
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}

                  {rows.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={6} align="center">
                        No entries
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>

            <Box
              sx={{
                display: "flex",
                justifyContent: "flex-end",
                p: 1,
                gap: 2,
              }}>
              <Box
                sx={{
                  p: 1,
                  bgcolor: "#F3E5F5",
                  minWidth: 120,
                  textAlign: "center",
                }}>
                <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                  Total Debit
                </Typography>
                <Typography>
                  <b>{TotalDebit}</b>
                </Typography>
              </Box>

              <Box
                sx={{
                  p: 1,
                  bgcolor: "#F3E5F5",
                  minWidth: 120,
                  textAlign: "center",
                }}>
                <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                  Total Credit
                </Typography>
                <Typography>
                  <b>{TotalCredit}</b>
                </Typography>
              </Box>
            </Box>

            {TotalDebit !== TotalCredit && (
              <Alert severity="error" sx={{ mt: 1 }}>
                Debit and Credit totals must be equal
              </Alert>
            )}
          </Paper>


         
         {/* Ensure the box shows as soon as a PartyId is selected */}
{partyAccountId && (
  <Box
    sx={{
      m: 1,
      width: "500px",
      p: 1.5,
      backgroundColor: "#336699",
      color: "white",
      borderRadius: 1,
      border: "1px solid #003366",
      height: "150px",
      display: "flex",
      flexDirection: "column",
      justifyContent: "center"
    }}
  >
    {partyDetails ? (
      <>
        <Typography fontWeight="bold" variant="body1">
          {partyDetails.AccountName || "Account Name Not Available"} ({partyAccountId})
        </Typography>

        {(partyDetails.Address1 || partyDetails.Address2 || partyDetails.Address3) ? (
          <Box sx={{ mt: 0.5 }}>
            {partyDetails.Address1 && (
              <Typography variant="caption" display="block">
                {partyDetails.Address1}
              </Typography>
            )}
            {partyDetails.Address2 && (
              <Typography variant="caption" display="block">
                {partyDetails.Address2}
              </Typography>
            )}
            {partyDetails.Address3 && (
              <Typography variant="caption" display="block">
                {partyDetails.Address3}
              </Typography>
            )}
          </Box>
        ) : (
          <Typography
            variant="caption"
            sx={{ fontStyle: "italic", mt: 1, display: "block", color: "#FFD700" }}
          >
            No address info available
          </Typography>
        )}

        {partyDetails.MobileNo && (
          <Typography variant="caption" display="block" mt={0.5}>
            Mobile: {partyDetails.MobileNo}
          </Typography>
        )}

        <Box sx={{ mt: 1, pt: 1, borderTop: "1px solid rgba(255,255,255,0.3)" }}>
          <Typography fontWeight="bold">
            Bal. = {partyDetails.Balance || "0.00"} Dr
          </Typography>
        </Box>
      </>
    ) : (
      <Typography variant="body2">
        Loading or Party details not available...
      </Typography>
    )}
  </Box>
)}
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

        {/* Confirmation Dialog for Delete */}
        <Dialog open={isDeleteDialogOpen} onClose={cancelDelete}>
          <DialogTitle style={{ color: "navy", fontWeight: "600" }}>
            Confirm Deletion
          </DialogTitle>
          <DialogContent>
            Are you sure you want to delete this{" "}
            <b style={{ color: "red" }}>
              <u>Payment Voucher</u>
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

export default Paymentvoucher;
