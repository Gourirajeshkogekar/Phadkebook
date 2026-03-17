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
const [accountAddresses, setAccountAddresses] = useState({});
const [activeAccountId, setActiveAccountId] = useState(null);

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
      const costcenterOptions = response.data
        .filter((cos) => cos.Active === 1) // ✅ only active ones
        .map((cos) => ({
          value: cos.Id,
          label: cos.CostCenterName,
        }));
      setCostcenteroptions(costcenterOptions);
    } catch (error) {
      // toast.error("Error fetching cost centers:", error);
      console.error("Error fetching cost centers:", error);
    }
  };

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

    // const today = dayjs();
    // const minDate = today.subtract(3, "day");
    // const maxDate = today.add(2, "day");

    // if (newValue.isBefore(minDate) || newValue.isAfter(maxDate)) {
    //   setDateError("You can select only 2 days before or after today");
    // } else {
    //   setDateError("");
    // }

    setDateError("");
    setSafedate(dayjs(newValue));
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

    // ✅ Validate voucher date
    if (!safedate || !dayjs(safedate).isValid() || dateError) {
      toast.error("Please correct all the date fields before submitting.");
      return;
    }

    // ✅ Calculate total Debit and Credit before saving
    let totalDebit = 0;
    let totalCredit = 0;

    rows.forEach((row) => {
      const amount = parseFloat(row.Amount) || 0;
      if (row.DOrC === "D") totalDebit += amount;
      else if (row.DOrC === "C") totalCredit += amount;
    });

    if (totalDebit !== totalCredit) {
      toast.error(
        `Debit (${totalDebit}) and Credit (${totalCredit}) amounts must be equal!`
      );
      return;
    }

    const formattedVoucherDate = dayjs(safedate).format("YYYY-MM-DD");

    const voucherData = {
      Id: isEditing ? id : "",
      VoucherType: "JV",
      VoucherNo: EntryNo ? EntryNo : null,
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

      const response = await axios.post(voucherUrl, voucherData, {
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
      });

      console.log("JV API Response:", response.data);

      const voucherId = isEditing ? id : parseInt(response.data.Id, 10);
      const voucherNo = isEditing ? EntryNo : parseInt(response.data.VoucherNo);

      // ✅ Save each JV detail row
      for (const [index, row] of rows.entries()) {
        const rowData = {
          VoucherId: voucherId,
          VoucherType: "JV",
          SRN: index + 1,
          VoucherNo: voucherNo,
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

      // ✅ Update frontend list
      if (isEditing) {
        setJvheaders((prev) =>
          prev.map((voucher) =>
            voucher.Id === id ? { ...voucher, ...voucherData } : voucher
          )
        );
      } else {
        setJvheaders((prev) => [...prev, { ...voucherData, Id: voucherId }]);
      }

      // ✅ Refresh data
      fetchVouchers();
      fetchVoucherdetails();

      // ✅ Success
      setIsDrawerOpen(false);
      toast.success(
        isEditing
          ? "JV & JV Details updated successfully!"
          : "JV & JV Details added successfully!"
      );
      resetForm();
    } catch (error) {
      console.error("Error saving record!", error);
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

                    <th>Account Id</th>
                    <th>Dr/Cr</th>
                    <th>Narration</th>
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
                          <Autocomplete
                            options={accountOptions}
                            value={
                              accountOptions.find(
                                (option) => option.value === row.AccountId
                              ) || null
                            }
                         onChange={(e, newValue) => {
  const id = newValue ? newValue.value : "";

  // ✅ Update row properly
  handleInputChange(index, "AccountId", id);

  // ✅ Fetch party details
  if (id) {
    fetchPartyDetails(id);
    setAccountId(id);   // optional (for party box)
  } else {
    setPartyDetails(null);
    setAccountId(null);
  }
}}
                           


                            
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
                                    width: "300px", // Adjust height here
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

                          {/* )} */}
                        </td>

                        <td>
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
                            className="jv-control"
                            placeholder="Enter Narration"
                          />
                        </td>

                        <td>
                          <input
                            type="number"
                            value={row.Amount}
                            onChange={(e) =>
                              handleInputChange(index, "Amount", e.target.value)
                            }
                            style={{
                              width: "150px",
                            }}
                            className="jv-control"
                            placeholder="Amount"
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


             {/* Ensure the box shows as soon as a PartyId is selected */}
         {AccountId && (
           <Box
             sx={{
               m: 1,
               width: "500px",
               p: 1,
               backgroundColor: "#336699",
               color: "white",
               borderRadius: 1,
               border: "1px solid #003366",
               minHeight: "70px", // Ensures box has a consistent size
               display: "flex",
               flexDirection: "column",
               justifyContent: "center"
             }}
           >
             {partyDetails ? (
               <>
                 {/* Case 1: Party Info exists - Show Name */}
                 <Typography fontWeight="bold" variant="body1">
                   {partyDetails.AccountName || "Account Name Not Available"} ({AccountId})
                 </Typography>
         
                 {/* Check for any address lines */}
                 {(partyDetails.Address1 || partyDetails.Address2 || partyDetails.Address3) ? (
                   <Box sx={{ mt: 0.2 }}>
                     {partyDetails.Address1 && <Typography variant="caption" display="block">{partyDetails.Address1}</Typography>}
                     {partyDetails.Address2 && <Typography variant="caption" display="block">{partyDetails.Address2}</Typography>}
                     {partyDetails.Address3 && <Typography variant="caption" display="block">{partyDetails.Address3}</Typography>}
                   </Box>
                 ) : (
                   <Typography variant="caption" sx={{ fontStyle: "italic", mt: 1, display: "block", color: "#FFD700" }}>
                     ⚠️ No address info available
                   </Typography>
                 )}
         
                 {partyDetails.MobileNo && (
                   <Typography variant="caption" display="block" mt={0.2}>
                     Mobile: {partyDetails.MobileNo}
                   </Typography>
                 )}
         
                 <Box sx={{ m:1, borderTop: "1px solid rgba(255,255,255,0.3)" }}>
                   <Typography fontWeight="bold">
                     Bal. = {partyDetails.Balance || "0.00"} Dr
                   </Typography>
                 </Box>
               </>
             ) : (
               /* Case 2: partyInfo is null or undefined (Still fetching or not found) */
               <Box sx={{ textAlign: "center" }}>
                  <Typography variant="body2" sx={{ fontStyle: "bold" }}>
                   Party details not Available
                  </Typography>
               </Box>
             )}
           </Box>
         )}

            <Box display="flex" justifyContent="flex-end" mt={1} gap={2}>
              <Box>
                <Typography variant="body2" fontWeight="bold">
                  Total Credit
                </Typography>
                <TextField
                  variant="outlined"
                  value={TotalCredit}
                  size="small"
                  margin="normal"
                  InputProps={{
                    sx: {
                      fontSize: "1.2rem",
                      fontWeight: "bold",
                      color: "green",
                      readOnly: true,
                    },
                  }}
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
                  InputProps={{
                    sx: {
                      fontSize: "1.2rem",
                      fontWeight: "bold",
                      color: "red",
                      readOnly: true,
                    },
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
            m={1}>
            <Button
              variant="contained"
              onClick={handleSubmit}
              sx={{
                backgroundColor: "#0a60bd",
                color: "white",
                "&:hover": {
                  backgroundColor: "navy",
                },
              }}>
              {isEditing ? "Update" : "Save"}
            </Button>

            <Box>
              <Button
                onClick={handleDrawerClose}
                variant="contained"
                sx={{
                  backgroundColor: "red",
                  color: "white",
                  "&:hover": {
                    backgroundColor: "darkred",
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
      </div>

      <ToastContainer />
    </div>
  );
}
export default JV;
