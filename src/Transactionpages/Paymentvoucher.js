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
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { DatePicker } from "@mui/x-date-pickers";
import { Edit, Delete, Add, MoreVert, Print } from "@mui/icons-material";

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

  const [TotalDebit, setTotaldebit] = useState("");
  const [TotalCredit, setTotalcredit] = useState("");

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

  const [rows, setRows] = useState([
    {
      SerialNo: "",
      AccountId: "", // Default value for the first row
      Amount: 0,
      DOrC: "C",
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
      const accountOptions = response.data.map((acc) => ({
        value: acc.Id,
        label: acc.AccountName,
      }));
      setAccountOptions(accountOptions);
    } catch (error) {
      // toast.error("Error fetching Accounts:", error);
      console.error("Error fetching Accounts:", error);
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

  // const handleInputChange = (index, field, value) => {
  //   const updatedRows = [...rows];
  //   updatedRows[index] = { ...updatedRows[index], [field]: value };

  //   // Recalculate total debit and credit
  //   let totalCredit = 0;
  //   let totalDebit = 0;

  //   updatedRows.forEach(row => {
  //     if (row.DOrC === "C") {
  //       totalCredit += parseFloat(row.Amount) || 0;
  //     } else if (row.DOrC === "D") {
  //       totalDebit += parseFloat(row.Amount) || 0;
  //     }
  //   });

  //   setRows(updatedRows);
  //   setTotalcredit(totalCredit);
  //   setTotaldebit(totalDebit);
  // };

  // const handleInputChange = (index, field, value) => {
  //   const updatedRows = [...rows];
  //   updatedRows[index] = { ...updatedRows[index], [field]: value };

  //   let totalCredit = 0;
  //   let totalDebit = 0;

  //   console.log("Updated Rows:", updatedRows); // Debugging

  //   updatedRows.forEach((row) => {
  //     console.log(`Row: ${JSON.stringify(row)}`); // Debug each row

  //     let amount = parseFloat(row.Amount) || 0;
  //     if (row.DOrC === "C") {
  //       totalCredit += amount;
  //     } else if (row.DOrC === "D") {
  //       totalDebit += amount;
  //     }
  //   });

  //   console.log("Total Credit:", totalCredit, "Total Debit:", totalDebit);

  //   setRows(updatedRows);
  //   setTotalcredit(Amount);
  //   setTotaldebit(totalDebit);
  // };

  const handleInputChange = (index, field, value) => {
    const updatedRows = [...rows];
    updatedRows[index] = { ...updatedRows[index], [field]: value };

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
    setTotalcredit(totalCredit); // ✅ First row's amount is now Total Credit
    setTotaldebit(totalDebit);
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
    setVoucherDate("");
    setVoucherNo("");
    setChequeNo("");
    setChequeDate("");
    setNarration("");
    setTotalcredit("");
    setTotaldebit("");
    setAmount("");
    setIsoldcheque("");
    setAccountpayeecheque("");
    setAccountId("");
    setRows([
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

    // Filter purchase details to match the selected PurchaseId
    const paymentdetail = paymentdetails.filter(
      (detail) => detail.VoucherId === paymentheader.Id
    );

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

    const chequedetailDate = convertDateForInput(
      paymentdetail.ChequeDate?.date
    );

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

    const voucherdate = convertDateForInput(paymentheader.VoucherDate?.date);

    const chequeDate = convertDateForInput(paymentheader.ChequeDate?.date);

    // Set the form fields
    setVoucherNo(paymentheader.VoucherNo);
    setVoucherDate(voucherdate);
    setAccountId(paymentheader.AccountId);
    setChequeNo(paymentheader.ChequeNo);
    setChequeDate(chequeDate);
    setAccountId(paymentdetail[0]?.AccountId);
    setNarration(paymentdetail[0]?.Narration);
    setTotalcredit(paymentdetail[0]?.Amount);
    setTotaldebit(paymentdetail[1]?.Amount);
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

  // const validateForm = () => {
  //   let formErrors = {};
  //   let isValid = true;

  //   setErrors(formErrors);
  //   return isValid;
  // };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // if (!validateForm()) return;

    const formattedVoucherDate = moment(VoucherDate).format("YYYY-MM-DD");
    const formattedChequeDate = moment(ChequeDate).format("YYYY-MM-DD");

    const voucherData = {
      Id: isEditing ? id : "", // Include the Id for updating, null for new records
      VoucherType: "PY",
      VoucherNo: VoucherNo ? VoucherNo : null, // Ensures it takes `null` if `VoucherNo` is not provided
      VoucherDate: formattedVoucherDate,
      ChequeNo: ChequeNo,
      ChequeDate: formattedChequeDate,
      RefNo: "RefNo",
      Narration: Narration,
      CreatedBy: !isEditing ? userId : undefined,
      UpdatedBy: isEditing ? userId : undefined,
    };

    try {
      const voucherUrl = isEditing
        ? "https://publication.microtechsolutions.net.in/php/Voucherhdupdate.php"
        : "https://publication.microtechsolutions.net.in/php/Voucherhdpost.php";

      // Submit purchase header data
      // const response = await axios.post(voucherUrl, qs.stringify(voucherData), {
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
          SRN: rows.indexOf(row) + 1,
          VoucherNo: VoucherNo ? voucherNo : null,
          VoucherDate: VoucherDate,
          AccountId: parseInt(row.AccountId, 10),
          Amount: parseFloat(row.Amount),
          DOrC: index === 0 ? "C" : row.DOrC, // Set to 'D' for the first row
          Narration: row.Narration,
          CostCenterId: row.CostCenterId,
          ChequeNo: row.ChequeNo,
          ChequeDate: row.ChequeDate,
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
          ? "Payment Voucher & Payment Voucher Details updated successfully!"
          : "Payment Voucher & Payment Voucher Details added successfully!"
      );
      resetForm(); // Reset the form fields after successful submission
    } catch (error) {
      // toast.error('Error saving record!');
      console.error("Error saving record!");
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
              width: isSmallScreen ? "100%" : "80%",
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
                    <LocalizationProvider dateAdapter={AdapterDateFns}>
                      <DatePicker
                        value={VoucherDate ? new Date(VoucherDate) : null}
                        onChange={(newValue) => setVoucherDate(newValue)}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            error={!!errors.VoucherDate}
                            helperText={errors.VoucherDate}
                            size="small"
                            fullWidth
                          />
                        )}
                        slotProps={{
                          textField: { size: "small", fullWidth: true },
                        }}
                        format="dd-MM-yyyy"
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
                      value="cash"
                      control={<Radio />}
                      label="Cash"
                    />
                    <FormControlLabel
                      value="bank"
                      control={<Radio />}
                      label="Bank"
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
                  <Typography fontWeight="bold" variant="body2">
                    Cash/Bank Account
                  </Typography>
                  <Autocomplete
                    options={accountOptions}
                    value={
                      accountOptions.find(
                        (option) => option.value === AccountId
                      ) || null
                    }
                    onChange={(event, newValue) => {
                      setAccountId(newValue ? newValue.value : null);
                      if (rows.length > 0) {
                        handleInputChange(
                          0,
                          "AccountId",
                          newValue ? newValue.value : null
                        ); // Update first row
                      }
                    }}
                    getOptionLabel={(option) => option.label} // Display only label in dropdown
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        placeholder="Select Cash/Bank Name"
                        size="small"
                        margin="none"
                        fullWidth
                      />
                    )}
                  />
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
                    <LocalizationProvider dateAdapter={AdapterDateFns}>
                      <DatePicker
                        value={ChequeDate ? new Date(ChequeDate) : null} // Convert to Date object
                        onChange={(newValue) => setChequeDate(newValue)}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            error={!!errors.ChequeDate}
                            helperText={errors.ChequeDate}
                            size="small"
                            fullWidth
                          />
                        )}
                        slotProps={{
                          textField: { size: "small", fullWidth: true },
                        }}
                        format="dd-MM-yyyy"
                      />
                    </LocalizationProvider>
                  </Box>
                </Box>

                {/* Checkboxes (Third Row) */}
                <Box>
                  <Typography variant="body2" fontWeight="bold">
                    Cash/ Bank Particulars
                  </Typography>
                  <Box sx={{ display: "flex", gap: 1 }}>
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={IsOldCheque}
                          onChange={(e) => setIsoldcheque(e.target.checked)}
                        />
                      }
                      label="Is Old Cheque?"
                    />
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
                  </Box>
                </Box>
              </Box>
            </Box>
            <Box sx={{ display: "flex", padding: 1 }}>
              <Box flex={1}>
                <Typography variant="body2" fontWeight="bold">
                  Amount
                </Typography>
                <TextField
                  type="number"
                  value={Amount}
                  //  onChange={(e) => setAmount(e.target.value)}
                  onChange={(e) => {
                    setAmount(e.target.value);
                    setTotalcredit(e.target.value);

                    if (rows.length > 0) {
                      handleInputChange(0, "Amount", e.target.value); // Update first row
                    }
                  }}
                  size="small"
                  margin="none"
                  placeholder="Amount"
                />
              </Box>
              <Box flex={1}>
                <Typography fontWeight="bold" variant="body2">
                  Narration
                </Typography>
                <TextField
                  value={Narration}
                  onChange={(e) => {
                    setNarration(e.target.value);
                    if (rows.length > 0) {
                      handleInputChange(0, "Narration", e.target.value); // Update first row
                    }
                  }}
                  size="small"
                  margin="none"
                  placeholder="Narration"
                />
              </Box>
            </Box>
            <div className="paymentvoucher-table">
              <table>
                <thead>
                  <tr>
                    <th>Serial No</th>

                    <th>
                      Account Id <b className="required">*</b>
                    </th>
                    <th>
                      Dr/Cr <b className="required">*</b>
                    </th>
                    <th>
                      Narration <b className="required">*</b>
                    </th>
                    <th>
                      Amount <b className="required">*</b>
                    </th>

                    {/* <th>
                      Cost Center Id <b className="required">*</b>
                    </th> */}
                    <th>
                      Cheque No <b className="required">*</b>
                    </th>
                    <th>
                      Cheque Date <b className="required">*</b>
                    </th>

                    <th>
                      Cheque Amount <b className="required">*</b>
                    </th>
                    <th>
                      MICR Code <b className="required">*</b>
                    </th>
                    <th>
                      Bank Name <b className="required">*</b>
                    </th>
                    <th>
                      Bank Branch <b className="required">*</b>
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
                          {index === 0 ? (
                            accountOptions.find(
                              (option) => option.value === row.AccountId
                            )?.label || ""
                          ) : (
                            <Autocomplete
                              options={accountOptions}
                              value={
                                accountOptions.find(
                                  (option) => option.value === row.AccountId
                                ) || null
                              }
                              onChange={(event, newValue) =>
                                handleInputChange(
                                  index,
                                  "AccountId",
                                  newValue ? newValue.value : ""
                                )
                              }
                              sx={{ width: 300 }} // ✅ Set desired width here
                              getOptionLabel={(option) => option.label}
                              renderInput={(params) => (
                                <TextField
                                  {...params}
                                  placeholder="Select Acc"
                                  size="big"
                                  fullWidth
                                  sx={{
                                    "& .MuiInputBase-root": {
                                      height: "50px",
                                      // width: "250px", // Adjust height here
                                    },
                                    "& .MuiInputBase-input": {
                                      // padding: "14px", // Adjust padding for better alignment
                                    },
                                  }}
                                />
                              )}
                            />
                          )}
                        </td>

                        <td>
                          {index === 0 ? (
                            row.DOrC || "C" // Ensure it shows "C" if undefined
                          ) : (
                            //   <Select
                            //     value={dOrCOptions.find(
                            //       (option) => option.value === row.DOrC
                            //     )}
                            //     onChange={(option) =>
                            //       handleInputChange(index, "DOrC", option.value)
                            //     }
                            //     options={dOrCOptions}
                            //     placeholder="DOrC"
                            //     styles={{
                            //       control: (base) => ({ ...base, width: "70px" }),
                            //       menu: (base) => ({ ...base, zIndex: 100 }),
                            //     }}
                            //   />
                            // )}
                            <Autocomplete
                              options={dOrCOptions}
                              value={
                                dOrCOptions.find(
                                  (option) => option.value === row.DOrC
                                ) || null
                              }
                              onChange={(event, newValue) =>
                                handleInputChange(
                                  index,
                                  "DOrC",
                                  newValue ? newValue.value : ""
                                )
                              }
                              sx={{ width: "250" }} // Set width
                              getOptionLabel={(option) => option.label}
                              renderInput={(params) => (
                                <TextField
                                  {...params}
                                  placeholder="Select DOrC"
                                  size="big"
                                  fullWidth
                                  sx={{
                                    "& .MuiInputBase-root": {
                                      height: "50px",
                                      width: "150px", // Adjust height here
                                    },
                                    "& .MuiInputBase-input": {
                                      padding: "14px", // Adjust padding for better alignment
                                    },
                                  }}
                                />
                              )}
                            />
                          )}
                        </td>

                        <td>
                          {index === 0 ? (
                            row.Narration
                          ) : (
                            <input
                              type="text"
                              value={row.Narration}
                              onChange={(e) => {
                                const value = e.target.value;
                                // Limit to 500 characters
                                if (value.length <= 500) {
                                  handleInputChange(index, "Narration", value);
                                }
                              }}
                              className="paymentvoucher-control"
                              placeholder="Enter Narration"
                              style={{
                                width: "200px",
                              }} // Set width here (or use 100% if preferred)
                            />
                          )}
                        </td>

                        <td>
                          {/* {index === 0 ? (
          row.Amount
        ) : ( */}
                          <input
                            type="number"
                            value={row.Amount}
                            onChange={(e) =>
                              handleInputChange(index, "Amount", e.target.value)
                            }
                            style={{
                              width: "150px",
                            }}
                            className="paymentvoucher-control"
                            placeholder="Amount"
                          />
                          {/* )} */}
                        </td>

                        {/* <td>
                           {index === 0 ? (
          row.CostCenterId
        ) : (

                          <Select
                            value={costcenterOptions.find(
                              (option) => option.value === row.CostCenterId
                            )}
                            onChange={(option) =>
                              handleInputChange(
                                index,
                                "CostCenterId",
                                option.value
                              )
                            }
                            options={costcenterOptions}
                            placeholder="CostCenterId"
                            styles={{
                              control: (base) => ({
                                ...base,
                                width: "150px",
                              }),

                              menu: (base) => ({
                                ...base,
                                zIndex: 100,
                              }),
                            }}
                          />
                          )}
                        </td> */}

                        <td>
                          {/* {index === 0 ? (
          row.CheckNo
        ) : ( */}
                          <input
                            type="text"
                            value={row.ChequeNo}
                            onChange={(e) => {
                              const value = e.target.value;
                              if (value.length <= 15) {
                                handleInputChange(index, "ChequeNo", value);
                              }
                            }}
                            style={{
                              width: "150px",
                            }}
                            className="paymentvoucher-control"
                            placeholder="ChequeNo"
                          />
                          {/* )} */}
                        </td>

                        <td>
                          {/* {index === 0 ? (
          row.CheckDate
        ) : ( */}

                          <input
                            type="date"
                            value={row.ChequeDate}
                            onChange={(e) =>
                              handleInputChange(
                                index,
                                "ChequeDate",
                                e.target.value
                              )
                            }
                            placeholder="Cheque Date"
                            className="receiptvoucher-control"
                          />
                          {/* )} */}
                        </td>

                        <td>
                          {/* {index === 0 ? (
          row.CheckAmount
        ) : ( */}
                          <input
                            type="number"
                            value={row.ChequeAmount}
                            onChange={(e) => {
                              const value = e.target.value;
                              // Validate for Check Amount as well
                              const regex = /^\d{0,18}(\.\d{0,2})?$/;

                              // Check if the value matches the regex
                              if (value === "" || regex.test(value)) {
                                handleInputChange(index, "ChequeAmount", value);
                              }
                            }}
                            style={{
                              width: "100px",
                            }}
                            placeholder="Cheque Amount"
                            className="receiptvoucher-control"
                          />
                          {/* )} */}
                        </td>
                        <td>
                          {/* {index === 0 ? (
          row.MICRCode
        ) : ( */}
                          <input
                            type="text"
                            value={row.MICRCode}
                            onChange={(e) => {
                              const value = e.target.value;
                              if (value.length <= 30) {
                                handleInputChange(index, "MICRCode", value);
                              }
                            }}
                            style={{
                              width: "150px",
                            }}
                            placeholder="MICR Code"
                            className="receiptvoucher-control"
                          />
                          {/* )} */}
                        </td>
                        <td>
                          {/* {index === 0 ? (
          row.BankName
        ) : ( */}
                          <input
                            type="text"
                            value={row.BankName}
                            onChange={(e) => {
                              const value = e.target.value;
                              if (value.length <= 50) {
                                handleInputChange(index, "BankName", value);
                              }
                            }}
                            style={{
                              width: "150px",
                            }}
                            placeholder="Bank Name"
                            className="receiptvoucher-control"
                          />
                          {/* )} */}
                        </td>
                        <td>
                          {/* {index === 0 ? (
          row.BankBranch
        ) : ( */}
                          <input
                            type="text"
                            value={row.BankBranch}
                            onChange={(e) => {
                              const value = e.target.value;
                              if (value.length <= 50) {
                                handleInputChange(index, "BankBranch", value);
                              }
                            }}
                            style={{
                              width: "150px",
                            }}
                            placeholder="Bank Branch"
                            className="receiptvoucher-control"
                          />
                          {/* )} */}
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
                  Total Credit
                </Typography>
                <TextField
                  value={TotalCredit}
                  onChange={(e) => setTotalcredit(e.target.value)}
                  size="small"
                  margin="none"
                  placeholder="Total Credit"
                  fullWidth
                />
              </Box>

              <Box>
                <Typography variant="body2" fontWeight="bold">
                  Total Debit
                </Typography>
                <TextField
                  value={TotalDebit}
                  onChange={(e) => setTotaldebit(e.target.value)}
                  size="small"
                  margin="none"
                  placeholder="Total debit"
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
