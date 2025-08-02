import React, { useState, useMemo, useEffect } from "react";
import "./JV.css";
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
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
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
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";

function JV() {
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

  const [EntryNo, setEntryNo] = useState(null);
  const [VoucherDate, setVoucherDate] = useState("");
  const [RefNo, setRefNo] = useState("");
  const [VoucherType, setVoucherType] = useState("PY");
  const [VoucherNo, setVoucherNo] = useState("");
  const [ChequeNo, setChequeNo] = useState("");
  const [ChequeDate, setChequeDate] = useState("");
  const [IsOldCheque, setIsoldcheque] = useState(false);
  const [AccountPayeeCheque, setAccountpayeecheque] = useState(false);
  const [Narration, setNarration] = useState("");
  const [DOrC, setDrOrCr] = useState("C");
  const [AccountId, setAccountId] = useState("");
  const [Amount, setAmount] = useState("");
  const [TotalCredit, setTotalcredit] = useState("");
  const [TotalDebit, setTotaldebit] = useState("");

  const [editingIndex, setEditingIndex] = useState(-1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [id, setId] = useState("");

  const [jvdetailId, setJvdetailId] = useState("");
  const [errors, setErrors] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [jvheaders, setJvheaders] = useState([]);
  const [jvdetails, setJvdetails] = useState([]);

  const [accountOptions, setAccountOptions] = useState([]);

  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [deleteIndex, setDeleteIndex] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const dOrCOptions = [
    { value: "D", label: "D" },
    { value: "C", label: "C" },
  ];

  const [costcenterOptions, setCostcenteroptions] = useState([]);

  const [rows, setRows] = useState([
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
    const creditTotal = rows
      .filter((row) => row.DOrC === "C")
      .reduce((sum, row) => sum + (parseFloat(row.Amount) || 0), 0);

    const debitTotal = rows
      .filter((row) => row.DOrC === "D")
      .reduce((sum, row) => sum + (parseFloat(row.Amount) || 0), 0);

    setTotalcredit(creditTotal.toFixed(2)); // Set credit total
    setTotaldebit(debitTotal.toFixed(2)); // Set debit total
  }, [rows]);

  useEffect(() => {
    fetchVouchers();
    fetchVoucherdetails();
    fetchAccounts();
    fetchCostcenters();
  }, []);

  const fetchVouchers = async () => {
    try {
      const response = await axios.get(
        "https://publication.microtechsolutions.net.in/php/Voucherhdget.php?VoucherType=JV"
      );
      setJvheaders(response.data);
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
      setJvdetails(response.data);
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

  const [rowErrors, setRowErrors] = useState([]); // array of objects per row

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

    setRowErrors(updatedErrors);
    setRows(updatedRows);
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
    // setVoucherDate("");
    setSafedate(dayjs());
    setDateError("");
    setEntryNo("");
    setRefNo("");
    setChequeNo("");
    setChequeDate("");

    setNarration("");
    setRowErrors([]); // ✅ reset row-wise errors

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

  const [safedate, setSafedate] = useState(dayjs());

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

  const handleEdit = () => {
    if (currentRow) {
      console.log("Editing item with ID:", currentRow.original.Id);
      setIdwiseData(currentRow.original.Id);
    }
    setIsLoading(true);

    console.log(currentRow, "row");
    const jvheader = jvheaders[currentRow.index];

    // Filter purchase details to match the selected PurchaseId
    const jvdetail = jvdetails.filter(
      (detail) => detail.VoucherId === jvheader.Id
    );

    // Convert date strings to DD-MM-YYYY format

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

    // const chequedetailDate = convertDateForInput(jvdetail.ChequeDate?.date);

    // Map the details to rows
    const mappedRows = jvdetail.map((detail) => ({
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
      ChequeDate: detail.ChequeDate.date
        ? convertDateForInput(detail.ChequeDate.date)
        : "", // Ensure valid date
      MICRCode: detail.MICRCode,
      BankName: detail.BankName,
      BankBranch: detail.BankBranch,
      Id: detail.Id,
    }));

    const voucherdate = moment(jvheader.VoucherDate?.date);

    // Set the form fields
    setEntryNo(jvheader.VoucherNo);
    // setVoucherDate(voucherdate);
    setSafedate(voucherdate);
    setRefNo(jvheader.RefNo);

    console.log(jvheader, "jv header");
    console.log(jvdetail, "jv detail");
    console.log(mappedRows, "mapped rows");
    setRows(mappedRows);

    // Set editing state
    setEditingIndex(currentRow.index);
    setIsDrawerOpen(true);
    setIsEditing(true);
    setId(jvheader.Id);
    handleMenuClose();
    // Determine which specific detail to edit
    const specificDetail = jvdetail.find(
      (detail) => detail.Id === currentRow.original.Id
    );
    if (specificDetail) {
      setJvdetailId(specificDetail.Id); // Set the specific detail Id
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
        toast.success("JV Deleted Successfully"); // Show success toast
        setIsDeleteDialogOpen(false); // Close delete dialog
        fetchVouchers(); // Refresh vouchers list
      })
      .catch((error) => {
        console.error("Error:", error);
        // toast.error('Failed to delete JV'); // Show error toast if it fails
      });
  };

  const cancelDelete = () => {
    setIsDeleteDialogOpen(false);
    setDeleteIndex(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // if (!validateForm()) return;

    if (!safedate || !dayjs(safedate).isValid() || dateError) {
      toast.error("Please correct all the date fields before submitting.");
      return;
    }

    const formattedVoucherDate = dayjs(safedate).format("YYYY-MM-DD");

    const voucherData = {
      Id: isEditing ? id : "", // Include the Id for updating, null for new records
      VoucherType: "JV",
      VoucherNo: EntryNo ? EntryNo : null, // Ensures it takes `null` if `VoucherNo` is not provided
      VoucherDate: formattedVoucherDate,
      ChequeNo: 123,
      ChequeDate: formattedVoucherDate,
      Narration: Narration,
      RefNo: RefNo,
      CreatedBy: !isEditing ? userId : undefined,
      UpdatedBy: isEditing ? userId : undefined,
    };

    try {
      const voucherUrl = isEditing
        ? "https://publication.microtechsolutions.net.in/php/Voucherhdupdate.php"
        : "https://publication.microtechsolutions.net.in/php/Voucherhdpost.php";

      // const response = await axios.post(voucherUrl, qs.stringify(voucherData), {
      const response = await axios.post(voucherUrl, voucherData, {
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
      });

      const voucherId = isEditing ? id : parseInt(response.data.Id, 10);
      const voucherNo = isEditing ? EntryNo : parseInt(response.data.VoucherNo);

      for (const [index, row] of rows.entries()) {
        const rowData = {
          VoucherId: voucherId,
          VoucherType: "JV",
          SRN: rows.indexOf(row) + 1,
          VoucherNo: EntryNo ? EntryNo : null,
          VoucherDate: formattedVoucherDate, // ✅ Fix

          AccountId: parseInt(row.AccountId, 10),
          Amount: parseFloat(row.Amount),
          DOrC: row.DOrC,
          Narration: row.Narration,
          CostCenterId: row.CostCenterId,
          ChequeNo: row.ChequeNo,
          ChequeDate: row.ChequeDate
            ? dayjs(row.ChequeDate).format("YYYY-MM-DD")
            : formattedVoucherDate, // ✅ Fix
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
        setJvheaders((prev) =>
          prev.map((voucher) =>
            voucher.Id === id ? { ...voucher, ...voucherData } : voucher
          )
        );
      } else {
        setJvheaders((prev) => [...prev, { ...voucherData, Id: voucherId }]);
      }

      fetchVouchers();
      fetchVoucherdetails();

      setIsDrawerOpen(false);
      toast.success(
        isEditing
          ? "JV & JV Details updated successfully!"
          : "JV & JV Details added successfully!"
      );
      resetForm(); // Reset the form fields after successful submission
    } catch (error) {
      // toast.error('Error saving record!');
      console.error("Error saving record!");
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
        accessorKey: "VoucherNo",
        header: "Entry No",
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
          <IconButton
            onClick={(event) => handleMenuOpen(event, row)} // Open the menu on click
          >
            <MoreVert />
          </IconButton>
        ),
      },
    ],
    [jvheaders]
  );

  const table = useMaterialReactTable({
    columns,
    data: jvheaders,
    muiTableHeadCellProps: {
      style: {
        backgroundColor: "#E9ECEF",
        color: "black",
        fontSize: "16px",
      },
    },
  });

  return (
    <div className="jv-container">
      <h1>JV</h1>

      <div className="jvtable-master">
        <div className="jvtable1-master">
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
          <div className="jvtable-container">
            <Box mt={2}>
              <MaterialReactTable table={table} />

              <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleMenuClose}>
                <MenuItem onClick={handleEdit}>Edit</MenuItem>
                <MenuItem onClick={handleDelete}>Delete</MenuItem>
              </Menu>
            </Box>
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
              <b>{isEditing ? "Edit JV" : "Create JV"}</b>
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
              gap: 2,
              m: 1,
              mt: 3,
            }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              <Box flex={3}>
                <Typography variant="body2" fontWeight="bold">
                  Entry No
                </Typography>
                <TextField
                  value={EntryNo}
                  onChange={(e) => setEntryNo(e.target.value)}
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
                    sx={{
                      marginTop: "10px",
                      marginBottom: "5px",
                      width: "250px",
                    }}
                  />
                </LocalizationProvider>
              </Box>

              <Box flex={3}>
                <Typography fontWeight="bold" variant="body2">
                  Ref No
                </Typography>
                <TextField
                  value={RefNo}
                  onChange={(e) => setRefNo(e.target.value)}
                  size="small"
                  margin="none"
                  placeholder="Ref No"
                  fullWidth
                />
              </Box>
            </Box>

            <div className="jv-table">
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

                    <th>
                      Cost Center Id <b className="required">*</b>
                    </th>
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
                          {/* {index === 0 ? (
          accountOptions.find(option => option.value === row.AccountId)?.label || ''
        ) : ( */}
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
                            sx={{ width: 550 }} // Set width
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
                                    // width: "200px", // Adjust height here
                                  },
                                  "& .MuiInputBase-input": {
                                    padding: "14px", // Adjust padding for better alignment
                                  },
                                }}
                              />
                            )}
                          />
                          {/* )} */}
                        </td>

                        <td>
                          {/* {index === 0 ? (
          // row.DOrC
          // 'D'
          dOrCOptions.find(option => option.value === row.DOrC)?.label || 'C'

        ) : ( */}
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
                            sx={{ width: 100 }} // Set width
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
                                    // width: "150px", // Adjust height here
                                  },
                                  "& .MuiInputBase-input": {
                                    padding: "14px", // Adjust padding for better alignment
                                  },
                                }}
                              />
                            )}
                          />

                          {/* )} */}
                        </td>

                        <td>
                          {/* {index === 0 ? (
          row.Narration
        ) : ( */}
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
                            style={{
                              width: "200px",
                            }}
                            className="jvvoucher-control"
                            placeholder="Enter Narration"
                          />
                          {/* )} */}
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
                            className="receiptvoucher-control"
                            placeholder="Amount"
                          />
                          {/* )} */}
                        </td>

                        <td>
                          {/* {index === 0 ? (
          row.CostCenterId
        ) : ( */}

                          <Autocomplete
                            options={costcenterOptions}
                            value={
                              costcenterOptions.find(
                                (option) => option.value === row.CostCenterId
                              ) || null
                            }
                            onChange={(event, newValue) =>
                              handleInputChange(
                                index,
                                "CostCenterId",
                                newValue ? newValue.value : ""
                              )
                            }
                            sx={{ width: 250 }} // Set width
                            getOptionLabel={(option) => option.label}
                            renderInput={(params) => (
                              <TextField
                                {...params}
                                placeholder="Select Cost Center"
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
                          {/* )} */}
                        </td>

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
                            className="jvvoucher-control"
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
                            value={
                              row.ChequeDate ||
                              new Date().toISOString().split("T")[0]
                            }
                            onChange={(e) =>
                              handleInputChange(
                                index,
                                "ChequeDate",
                                e.target.value
                              )
                            }
                            style={{ width: "150px" }}
                            placeholder="Cheque Date"
                            className="paymentvoucher-control"
                          />

                          {rowErrors[index]?.ChequeDate && (
                            <span style={{ color: "red", fontSize: "12px" }}>
                              {rowErrors[index].ChequeDate}
                            </span>
                          )}
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
                            className="jvvoucher-control"
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
                            className="jvvoucher-control"
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
                            className="jvvoucher-control"
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
                            className="jvvoucher-control"
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

            {/* Total Credit & Debit Inputs Below the Table */}
            <Box display="flex" justifyContent="flex-end" mt={1} gap={2}>
              <Box>
                <Typography variant="body2" fontWeight="bold">
                  Total Credit
                </Typography>
                <TextField
                  variant="outlined"
                  value={TotalCredit} // Calculate total credit
                  size="small"
                  margin="normal"
                  InputProps={{ readOnly: true }}
                />
              </Box>

              <Box>
                <Typography variant="body2" fontWeight="bold">
                  Total Debit
                </Typography>
                <TextField
                  variant="outlined"
                  value={TotalDebit}
                  size="small"
                  margin="normal"
                  InputProps={{ readOnly: true }}
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

        <Dialog open={isDeleteDialogOpen} onClose={cancelDelete}>
          <DialogTitle style={{ color: "navy", fontWeight: "600" }}>
            Confirm Deletion
          </DialogTitle>
          <DialogContent>
            Are you sure you want to delete this{" "}
            <b style={{ color: "red" }}>
              <u>JV Voucher</u>
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

        {/* <div className="bookpurchase-btn-container">
                  <Button
                    type="submit" onClick={handleSubmit}
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
                </div> */}
      </div>

      <ToastContainer />
    </div>
  );
}
export default JV;
