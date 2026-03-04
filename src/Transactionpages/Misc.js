import React, { useState, useMemo, useEffect } from "react";
import "./Paymentvoucher.css";
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
  Checkbox,
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
import { DatePicker } from "@mui/x-date-pickers";
import { Edit, Delete, Add, MoreVert, Print } from "@mui/icons-material";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import PrintIcon from "@mui/icons-material/Print";

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

    fetchPayments();
  }, []);

  const [anchorEl, setAnchorEl] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(null);
  const [selectedIndex, setSelectedIndex] = useState(null);
  const [VoucherType, setVoucherType] = useState("PY");
  const [VoucherNo, setVoucherNo] = useState(null);
  const [VoucherDate, setVoucherDate] = useState("");
  const [PaymentType, setPaymentType] = useState("");
  const [ChequeNo, setChequeNo] = useState("");
  const [ChequeDate, setChequeDate] = useState("");
  const [IsOldCheque, setIsoldcheque] = useState(false);
  const [AccountPayeeCheque, setAccountpayeecheque] = useState(false);
  const [Narration, setNarration] = useState("");
  const [DOrC, setDrOrCr] = useState("C");
  const [AccountId, setAccountId] = useState("");
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

  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [deleteIndex, setDeleteIndex] = useState(null);
  const [deleteId, setDeleteId] = useState(null);

  // const [rows, setRows] = useState([
  //   {
  //     SerialNo: "",
  //     AccountId: "", // Default value for the first row
  //     Amount: 0,
  //     DOrC: "C",
  //     CostCenterId: 0,
  //     Narration: "",
  //     ChequeNo: 0,
  //     ChequeDate: "",
  //     ChequeAmount: 0,
  //     MICRCode: "",
  //     BankName: "",
  //     BankBranch: "",
  //     IsOldCheque: "",
  //     AccountPayeeCheque: "",
  //   },
  // ]);

  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const handleDrawerOpen = () => {
    setIsDrawerOpen(true);
  };

  const handleDrawerClose = () => {
    setIsDrawerOpen(false);
  };

  const [rows, setRows] = useState([]);
  const [formData, setFormData] = useState({
    AccountId: "",
    DOrC: "",
    Amount: "",
    Narration: "",
  });
  const [editIndex, setEditIndex] = useState(null);
  const [accountList, setAccountList] = useState([]); // Your accounts

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAdd = () => {
    if (!formData.AccountId || !formData.Amount) return; // Basic validation

    if (editIndex !== null) {
      // Update existing row
      const updatedRows = rows.map((row, idx) =>
        idx === editIndex ? { ...formData } : row
      );
      setRows(updatedRows);
      setEditIndex(null);
    } else {
      // Add new row
      setRows([...rows, { ...formData }]);
    }

    // Reset form
    setFormData({ AccountId: "", DOrC: "", Amount: "", Narration: "" });
  };

  const handleRowClick = (row, index) => {
    setFormData(row);
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
    fetchCostcenters();
  }, []);

  const fetchPayments = async () => {
    try {
      const response = await axios.get(
        "https://publication.microtechsolutions.net.in/php/Vouchertypeget.php?VoucherType=PY"
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
        "https://publication.microtechsolutions.net.in/php/Voucherhdget.php?VoucherType=PY"
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
        "https://publication.microtechsolutions.net.in/php/Voucherdetailget.php"
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
        "https://publication.microtechsolutions.net.in/php/Accountget.php"
      );

      setAccountOptions(response.data); // <-- Keep original structure
    } catch (error) {
      console.error("Error fetching accounts:", error);
    }
  };

  const fetchCostcenters = async () => {
    try {
      const response = await axios.get(
        "https://publication.microtechsolutions.net.in/php/Costcenterget.php"
      );
      const costcenterOptions = response.data.map((cos) => ({
        value: cos.Id,
        label: cos.CostCenterName,
      }));
      setCostcenteroptions(costcenterOptions);
    } catch (error) {
      // toast.error("Error fetching cost centers:", error);
      console.error("Error fetching cost centers:", error);
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

  // Calculate totals dynamically
  let TotalDebit = rows
    .filter((row) => row.DOrC === "D")
    .reduce((sum, row) => sum + Number(row.Amount || 0), 0);

  let TotalCredit = rows
    .filter((row) => row.DOrC === "C")
    .reduce((sum, row) => sum + Number(row.Amount || 0), 0);

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
    // setVoucherDate("");
    setVouchersafedate(dayjs());
    setDateError("");
    setVoucherNo("");
    setChequeNo("");
    // setChequeDate("");
    setchequesafeDate(dayjs());
    setChequedateerror("");
    setNarration("");
    // setTotalcredit("");
    // setTotaldebit("");
    setAmount("");
    setIsoldcheque("");
    setAccountpayeecheque("");
    setAccountId("");
    setFormData([
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
      (detail) => detail.VoucherId === paymentheader.Id
    );

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

    // --- Safely parse and set ChequeDate ---
    const chequeDate = convertDateForInput(paymentheader.ChequeDate?.date);
    if (chequeDate && dayjs(chequeDate).isValid()) {
      setchequesafeDate(dayjs(chequeDate));
    } else {
      setchequesafeDate(null);
      console.warn("Invalid ChequeDate:", paymentheader.ChequeDate);
    }

    // Map the details to rows
    const mappedRows = paymentdetail.map((detail) => ({
      VoucherId: detail.VoucherId,
      // SRN:detail.SRN ,
      AccountId: detail.AccountId,
      Amount: detail.Amount,
      DOrC: detail.DOrC,
      IsOldCheque: detail.IsOldCheque,
      AccountPayeeCheque: detail.AccountPayeeCheque,
      Narration: detail.Narration,
      CostCenterId: detail.CostCenterId,
      ChequeNo: detail.ChequeNo,
      ChequeAmount: detail.ChequeAmount,
      ChequeDate: detail.ChequeDate
        ? convertDateForInput(detail.ChequeDate.date)
        : "", // Ensure valid date
      MICRCode: detail.MICRCode,
      BankName: detail.BankName,
      BankBranch: detail.BankBranch,
      Id: detail.Id,
    }));

    // const voucherdate = convertDateForInput(paymentheader.VoucherDate?.date);

    // const chequeDate = convertDateForInput(paymentheader.ChequeDate?.date);

    // Set the form fields
    setVoucherNo(paymentheader.VoucherNo);
    setVouchersafedate(dayjs(voucherdate));
    setchequesafeDate(dayjs(chequeDate));

    // setVoucherDate(voucherdate);
    setAccountId(paymentheader.AccountId);
    setChequeNo(paymentheader.ChequeNo);
    // setChequeDate(chequeDate);
    setAccountId(paymentdetail[0]?.AccountId);
    setNarration(paymentdetail[0]?.Narration);
    // setTotalcredit(paymentdetail[0]?.Amount);
    // setTotaldebit(paymentdetail[1]?.Amount);
    setPaymentType(paymentheader.PaymentType);
    setAmount(paymentdetail[0]?.Amount);
    setAccountpayeecheque(paymentdetail[0]?.AccountPayeeCheque);
    setIsoldcheque(paymentdetail[0]?.IsOldCheque);

    console.log(paymentheader, "payment header");
    console.log(paymentdetail, "payment detail");
    console.log(mappedRows, "mapped rows");
    // Set the rows for the table with all the details
    setRows(mappedRows);

    // Set editing state
    setEditingIndex(currentRow.index);
    setIsDrawerOpen(true);
    setIsEditing(true);
    setId(paymentheader.Id);
    handleMenuClose();
    // Determine which specific detail to edit
    const specificDetail = paymentdetail.find(
      (detail) => detail.Id === currentRow.original.Id
    );
    if (specificDetail) {
      setPaymentdetailId(specificDetail.Id); // Set the specific detail Id
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
        fetchPayments(); // Refresh vouchers list
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

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !vouchersafedate ||
      !dayjs(vouchersafedate).isValid() ||
      dateError ||
      !chequesafeDate ||
      !dayjs(chequesafeDate).isValid() ||
      chequedateerror
    ) {
      toast.error("Please correct all the date fields before submitting.");
      return;
    }

    let TotalDebit = 0;
    let TotalCredit = 0;

    rows.forEach((row) => {
      const amount = parseFloat(row.Amount || 0);
      const dc = row.DOrC; // Correct property

      if (dc === "D") {
        TotalDebit += amount;
      } else if (dc === "C") {
        TotalCredit += amount;
      }
    });

    if (TotalDebit !== TotalCredit) {
      toast.error(
        `Debit (${TotalDebit}) and Credit (${TotalCredit}) amounts must be equal!`
      );
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
          ChequeNo: row.ChequeNo,
          ChequeDate: row.ChequeDate
            ? dayjs(row.ChequeDate).format("YYYY-MM-DD")
            : formattedVoucherDate,
          ChequeAmount: row.ChequeAmount,
          MICRCode: row.MICRCode,
          BankName: row.BankName,
          BankBranch: row.BankBranch,
          IsOldCheque: IsOldCheque,
          AccountPayeeCheque: AccountPayeeCheque,
          Id: row.Id,
          CreatedBy: row.Id ? undefined : userId,
          UpdatedBy: row.Id ? userId : undefined,
        };

        const voucherdetailurl =
          isEditing && row.Id
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
            voucher.Id === id ? { ...voucher, ...voucherData } : voucher
          )
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
          : "Payment Voucher & Details added successfully!"
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
      `/transaction/paymentvoucher/paymentvoucherprint/${currentRow.original.Id}`
    );
  };

  const dOrCOptions = [
    { value: "D", label: "D" },
    { value: "C", label: "C" },
  ];

  const [costcenterOptions, setCostcenteroptions] = useState([]);

  const columns = useMemo(
    () => [
      {
        accessorKey: "SrNo",
        header: "Sr.No",
        size: 50,
        Cell: ({ row }) => row.index + 1,
      },

      {
        accessorKey: "AccountId",
        header: "Account Name",
        size: 50,
      },

      {
        accessorKey: "VoucherNo",
        header: "Voucher No",
        size: 50,
      },
      {
        accessorKey: "VoucherDate.date",
        header: "Voucher Date",
        size: 50,
        Cell: ({ cell }) => {
          // Using moment.js to format the date
          const date = dayjs(cell.getValue()).format("DD-MM-YYYY");
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
    [payments]
  );

  const table = useMaterialReactTable({
    columns,
    data: payments,
    muiTableHeadCellProps: {
      style: {
        backgroundColor: "#E9ECEF", // Replace with your desired color
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
              padding: 2,
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

          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: 1,
              m: 1,
              mt: 2,
            }}>
            <Box sx={{ display: "flex", gap: 1 }}>
              {/* left side of drawer */}
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 1,
                  padding: 2,
                  // border: "1px solid red",
                }}>
                {/* Entry No & Voucher Date Row */}
                <Box sx={{ display: "flex", gap: 1 }}>
                  <Box flex={1}>
                    <Typography variant="body2" fontWeight="bold">
                      Entry No
                    </Typography>
                    <TextField
                      value={VoucherNo}
                      onChange={(e) => setVoucherNo(e.target.value)}
                      size="small"
                      margin="none"
                      style={{ background: "#f5f5f5" }}
                      placeholder="Auto-Incremented"
                      InputProps={{ readOnly: true }}
                      fullWidth
                    />
                  </Box>

                  <Box flex={1}>
                    <Typography variant="body2" fontWeight="bold">
                      Voucher Date
                    </Typography>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                      <DatePicker
                        value={vouchersafedate || null}
                        // onChange={(newValue) => setVouchersafedate(newValue)}
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
                </Box>

                {/* Payment Type Below Voucher Date */}
                <Box sx={{ padding: 1 }}>
                  <Typography variant="body2" fontWeight="bold">
                    Payment Type
                  </Typography>
                  <RadioGroup
                    row
                    value={PaymentType}
                    onChange={(e) => setPaymentType(e.target.value)}>
                    <FormControlLabel
                      value={0}
                      control={<Radio />}
                      label="Cash"
                    />
                    <FormControlLabel
                      value={1}
                      control={<Radio />}
                      label="Bank"
                    />
                    <FormControlLabel
                      value={2}
                      control={<Radio />}
                      label="NEFT"
                    />
                  </RadioGroup>
                </Box>
              </Box>

              {/* Right side of drawer */}
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column", // Stack items vertically
                  gap: 1,
                  // border: "1px solid green",
                  padding: 2, // Add some padding for better spacing
                }}>
                {/* Account ID (First Row) */}
                <Box>
                  <Typography variant="body2" fontWeight="bold">
                    Cash/Bank Account Name
                  </Typography>
                  <TextField
                    select
                    fullWidth
                    // label="Cash/Bank Account Name"
                    name="AccountId"
                    value={formData.AccountId}
                    onChange={handleChange}
                    size="small"
                    SelectProps={{
                      MenuProps: {
                        PaperProps: { sx: { maxHeight: 250, width: 350 } },
                      },
                    }}>
                    {accountOptions.map((acc) => (
                      <MenuItem key={acc.Id} value={acc.Id}>
                        {acc.AccountName}
                      </MenuItem>
                    ))}
                  </TextField>
                </Box>
                {/* Cheque No & Cheque Date (Second Row) */}
                <Box sx={{ display: "flex", gap: 1 }}>
                  <Box flex={1}>
                    <Typography variant="body2" fontWeight="bold">
                      Cheque No
                    </Typography>
                    <TextField
                      value={ChequeNo}
                      onChange={(e) => setChequeNo(e.target.value)}
                      size="small"
                      margin="none"
                      placeholder="Cheque No"
                      fullWidth
                    />
                  </Box>

                  <Box flex={1}>
                    <Typography variant="body2" fontWeight="bold">
                      Cheque Date
                    </Typography>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                      <DatePicker
                        value={chequesafeDate}
                        onChange={handleDateChange2}
                        format="DD-MM-YYYY"
                        slotProps={{
                          textField: {
                            size: "small",
                            fullWidth: true,
                            error: !!chequedateerror,
                            helperText: chequedateerror,
                          },
                        }}
                      />
                    </LocalizationProvider>
                  </Box>
                </Box>
                <Box>
                  <Typography variant="body2" fontWeight="bold">
                    Cash/ Bank Particulars
                  </Typography>
                  <Box sx={{ display: "flex", gap: 1 }}>
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={AccountPayeeCheque}
                          onChange={(e) =>
                            setAccountpayeecheque(e.target.checked)
                          }
                        />
                      }
                      label="Account Payee Cheque?"
                    />
                    <Box sx={{ textAlign: "right", mt: 2 }}>
                      <Button
                        startIcon={<PrintIcon />}
                        variant="contained"
                        sx={{
                          backgroundColor: "#1976d2",
                          color: "#fff",
                          px: 3,
                          py: 1,
                          borderRadius: "10px",
                          textTransform: "none",
                        }}>
                        Print Cheque
                      </Button>
                    </Box>{" "}
                  </Box>
                </Box>
              </Box>
            </Box>
            <Box sx={{ p: 2 }}>
              {/* ================= FORM =================== */}
              <Box
                sx={{
                  display: "grid",
                  gridTemplateColumns: "2fr 1fr 1fr auto auto", // AccountName, Dr/Cr, Amount, Update, Drop
                  gap: 1,
                  alignItems: "center",
                  mb: 2,
                }}>
                <TextField
                  select
                  fullWidth
                  label="Account Name"
                  name="AccountId"
                  value={formData.AccountId}
                  onChange={handleChange}
                  size="small"
                  SelectProps={{
                    MenuProps: {
                      PaperProps: { sx: { maxHeight: 250, width: 300 } },
                    },
                  }}>
                  {accountOptions.map((acc) => (
                    <MenuItem key={acc.Id} value={acc.Id}>
                      {acc.AccountName}
                    </MenuItem>
                  ))}
                </TextField>

                <TextField
                  select
                  label="Dr/Cr"
                  name="DOrC"
                  value={formData.DOrC}
                  onChange={handleChange}
                  size="small">
                  <MenuItem value="D">D</MenuItem>
                  <MenuItem value="C">C</MenuItem>
                </TextField>

                <TextField
                  label="Amount"
                  name="Amount"
                  value={formData.Amount}
                  onChange={handleChange}
                  size="small"
                  type="number"
                />

                <Button
                  variant="contained"
                  sx={{ height: "40px", borderRadius: "10px", px: 2 }}
                  onClick={handleAdd}>
                  {editIndex !== null ? "Update" : "Add"}
                </Button>

                {editIndex !== null && (
                  <Button
                    variant="outlined"
                    color="error"
                    sx={{ height: "40px", borderRadius: "10px", px: 2 }}
                    onClick={handleDelete}>
                    Drop
                  </Button>
                )}

                <TextField
                  label="Narration"
                  name="Narration"
                  value={formData.Narration}
                  onChange={handleChange}
                  size="small"
                  sx={{ gridColumn: "1 / -1" }}
                />
              </Box>

              <TableContainer component={Paper}>
                <Table size="small">
                  <TableHead>
                    <TableRow sx={{ background: "#f5f5f5" }}>
                      <TableCell>Sr No</TableCell>
                      <TableCell>Account Name</TableCell>
                      <TableCell>Amount</TableCell>
                      <TableCell>Dr/Cr</TableCell>
                      <TableCell>Particulars</TableCell>
                    </TableRow>
                  </TableHead>

                  <TableBody>
                    {rows.map((row, index) => {
                      const accName =
                        accountOptions.find((a) => a.Id === row.AccountId)
                          ?.AccountName || "";

                      return (
                        <TableRow
                          key={index}
                          onClick={() => handleRowClick(row, index)}
                          sx={{
                            cursor: "pointer",
                            "&:hover": { backgroundColor: "#e3f2fd" },
                          }}>
                          <TableCell>{index + 1}</TableCell>
                          <TableCell>{accName}</TableCell>
                          <TableCell>{row.Amount}</TableCell>
                          <TableCell>{row.DOrC}</TableCell>
                          <TableCell>{row.Narration}</TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </TableContainer>
            </Box>

            <Box
              display="flex"
              justifyContent="flex-end"
              mt={0.5}
              gap={1}
              mb={3}>
              <Box>
                <Typography variant="body2" fontWeight="bold">
                  Total Credit
                </Typography>
                <TextField
                  value={TotalCredit}
                  size="small"
                  margin="none"
                  placeholder="Total Credit"
                  InputProps={{
                    readOnly: true,
                    sx: {
                      fontSize: "1.2rem",
                      fontWeight: "bold",
                      color: "green",
                    },
                  }}
                  fullWidth
                />
              </Box>

              <Box>
                <Typography variant="body2" fontWeight="bold">
                  Total Debit
                </Typography>
                <TextField
                  value={TotalDebit}
                  size="small"
                  margin="none"
                  placeholder="Total Debit"
                  InputProps={{
                    readOnly: true,
                    sx: {
                      fontSize: "1.2rem",
                      fontWeight: "bold",
                      color: "red",
                    },
                  }}
                  fullWidth
                />
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
