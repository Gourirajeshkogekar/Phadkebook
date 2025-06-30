import React, { useState, useMemo, useEffect } from "react";
import "./Receiptvoucher.css";
import Select from "react-select";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  Button,
  Modal,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";
import {
  MaterialReactTable,
  useMaterialReactTable,
} from "material-react-table";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { RiDeleteBin5Line } from "react-icons/ri";
import moment from "moment";
import qs from "qs";
import { Edit, Delete, Add, MoreVert, Print } from "@mui/icons-material";
import { DatePicker } from "@mui/x-date-pickers";
import {
  Box,
  Typography,
  TextField,
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
import dayjs from "dayjs";
import { setDate } from "date-fns";

function Receiptvoucher() {
  const [userId, setUserId] = useState("");
  const [yearid, setYearId] = useState("");

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
  }, [userId]);

  const [pageIndex, setPageIndex] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [dateError, setDateError] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(null);
  const [selectedIndex, setSelectedIndex] = useState(null);
  const [PartyId, setPartyid] = useState("");
  const [BankId, setBankId] = useState("");
  const [AccountId, setAccountId] = useState("");
  const [Amount, setAmount] = useState("");
  const [ChequeorDDType, setChequeorDDType] = useState("cheque"); // "cheque" or "dd"
  const [ChequeorDDBankName, setChequeBankName] = useState("");
  const [Towards, setTowards] = useState("");
  const [TowardsId, setTowardsId] = useState("");
  const [KachiPavatiNo, setKachiPavatiNo] = useState("");
  const [KachiPavatiDate, setKachiPavatiDate] = useState(null);
  const [VoucherType, setVoucherType] = useState("RE");
  const [PaymentType, setPaymenttype] = useState("");
  const [VoucherNo, setVoucherNo] = useState(null);
  const [VoucherDate, setVoucherDate] = useState("");
  const [ChequeNo, setChequeNo] = useState("");
  const [ChequeDate, setChequeDate] = useState("");
  const [Narration, setNarration] = useState("");

  const [IsOldCheque, setIsoldcheque] = useState(false);
  const [AccountPayeeCheque, setAccountpayeecheque] = useState(false);

  const [selectedCashorbank, setSelectedCashorbank] = useState("");
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [deleteIndex, setDeleteIndex] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const [editingIndex, setEditingIndex] = useState(-1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [id, setId] = useState("");
  const [type, setType] = useState("");
  const [voucherdetailId, setVoucherdetailId] = useState("");
  const [errors, setErrors] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [receipts, setReceipts] = useState([]);
  const [receiptdetails, setReceiptdetails] = useState([]);
  const [accountOptions, setAccountOptions] = useState([]);

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
    fetchReceipts();
    fetchVouchers();
    fetchAccounts();
  }, []);

  const fetchReceipts = async () => {
    try {
      const response = await axios.get(
        "https://publication.microtechsolutions.net.in/php/Vouchertypeget.php?VoucherType=RE"
      );
      console.log(response.data, "receipt vouchers");
      setReceipts(response.data);
    } catch (error) {
      console.error("Error fetching Vouchers:", error); // Log the error for debugging
      // toast.error("Error fetching Vouchers: " + error.message); // Provide more context in the toast message
    }
  };

  const fetchVouchers = async () => {
    try {
      const response = await axios.get(
        "https://publication.microtechsolutions.net.in/php/Voucherhdget.php?VoucherType=RE"
      );
      setReceipts(response.data);
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
      setReceiptdetails(response.data);
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

  const resetForm = () => {
    setVoucherNo("");
    setVoucherDate("");
    setSelectedCashorbank("");
    setPartyid("");
    setBankId("");
    setAmount("");
    setChequeBankName("");
    setChequeDate("");
    setChequeNo("");
    setTowards("");
    setKachiPavatiDate("");
    setKachiPavatiNo("");
    setPaymenttype("");
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

    console.log(currentRow, "row");
    const voucherheader = receipts[currentRow.index];

    // Filter purchase details to match the selected PurchaseId
    const voucherdetail = receiptdetails.filter(
      (detail) => detail.VoucherId === voucherheader.Id
    );

    console.log(voucherdetail, "voucherdetails");
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

    const formattedchequedate = convertDateForInput(
      voucherheader.ChequeDate?.date
    );
    const formattedvoucherdate = convertDateForInput(
      voucherheader.VoucherDate?.date
    );
    const formattedkachipavtidate = convertDateForInput(
      voucherheader.KachiPavatiDate?.date
    );
    setVoucherNo(voucherheader.VoucherNo);
    setVoucherDate(formattedvoucherdate); // Convert to Date object if needed
    // setSelectedCashorbank(voucherheader.selectedCashorbank);

    setPartyid(voucherdetail[0]?.AccountId);
    setBankId(voucherdetail[1]?.AccountId);

    // setPartyid(voucherdetail[1]?.AccountId);
    // setBankId(voucherdetail[0]?.AccountId);

    setAmount(voucherdetail[0]?.Amount);
    setChequeBankName(voucherdetail[1]?.BankName);
    // setTowardsId(voucherdetail[1]?.AccountId);
    setTowards(Number(voucherheader.Towards));
    setNarration(voucherheader.Narration);
    setChequeNo(voucherheader.ChequeNo);
    setChequeDate(formattedchequedate); // Convert to Date object
    setKachiPavatiDate(formattedkachipavtidate);
    setKachiPavatiNo(voucherheader.KachiPavatiNo);
    setPaymenttype(voucherheader.PaymentType);
    console.log(voucherheader, "voucher header");
    console.log(voucherdetail, "voucher detail");
    setEditingIndex(currentRow.index);
    setIsDrawerOpen(true);
    setIsEditing(true);
    setId(voucherheader.Id);
    handleMenuClose();

    // Determine which specific detail to edit
    const specificDetail = voucherdetail.find(
      (detail) => detail.Id === currentRow.original.Id
    );
    if (specificDetail) {
      setVoucherdetailId(specificDetail.Id); // Set the specific detail Id
    }

    fetchVoucherdetails();
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
      "https://publication.microtechsolutions.net.in/php/Voucherhddelete.php",
      requestOptions
    )
      .then((response) => response.text())
      .then((result) => console.log(result))
      .catch((error) => console.error(error));
    toast.success("Receipt Voucher Deleted Successfully");
    setIsDeleteDialogOpen(false);
    // setDeleteIndex(deleteIndex)
    fetchReceipts();
  };

  const cancelDelete = () => {
    setIsDeleteDialogOpen(false);
    setDeleteIndex(null);
  };

  const validateForm = () => {
    let formErrors = {};
    let isValid = true;

    if (!VoucherNo) {
      formErrors.VoucherNo = "Voucher No is required.";
      isValid = false;
    }

    setErrors(formErrors);
    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formattedVoucherdate = moment(VoucherDate).format("YYYY-MM-DD");
    const formattedchequedate = moment(ChequeDate).format("YYYY-MM-DD");
    const formattedkachipavtidate =
      moment(KachiPavatiDate).format("YYYY-MM-DD");

    const headerData = {
      Id: isEditing ? id : "",
      VoucherType: "RE",
      VoucherNo: VoucherNo ? VoucherNo : null, // Ensures it takes `null` if `VoucherNo` is not provided
      VoucherDate: formattedVoucherdate,
      ChequeNo: ChequeNo,
      ChequeDate: formattedchequedate,
      RefNo: "RefNo",
      Narration: Narration,
      KachiPavatiNo: KachiPavatiNo,
      KachiPavatiDate: formattedkachipavtidate,
      Towards: Towards,
      PaymentType: PaymentType,
      CreatedBy: !isEditing ? userId : undefined,
      UpdatedBy: isEditing ? userId : undefined,
    };

    try {
      const voucherurl = isEditing
        ? "https://publication.microtechsolutions.net.in/php/Voucherhdupdate.php"
        : "https://publication.microtechsolutions.net.in/php/Voucherhdpost.php";

      // Submit purchase header data
      // const response = await axios.post(voucherurl, qs.stringify(headerData), {
      const response = await axios.post(voucherurl, headerData, {
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
      });

      console.log(response.data, "receipt response");

      // const voucherid = isEditing ? id : parseInt(response.data.Id, 10);
      const voucherId = isEditing ? id : parseInt(response.data.Id, 10);

      const voucherNo = isEditing ? VoucherNo : response.data.VoucherNo;

      const srn1Id = voucherId; // Same ID for SRN:1
      const srn2Id = srn1Id + 1; // Generate a different ID for SRN:2 (You can modify this logic)

      const formattedVoucherdate = moment(VoucherDate).format("YYYY-MM-DD");
      const formattedchequedate = moment(ChequeDate).format("YYYY-MM-DD");

      const detailsData = [
        {
          Id: isEditing ? srn1Id : null,
          VoucherId: voucherId,
          VoucherType: "RE",
          SRN: 1,
          VoucherNo: VoucherNo ? voucherNo : null, // Ensures it takes `null` if `VoucherNo` is not provided
          VoucherDate: formattedVoucherdate,
          AccountId: parseInt(BankId, 10),
          Amount: parseFloat(Amount),
          DOrC: "D",
          Narration: Narration,
          CostCenterId: 1,
          ChequeNo: ChequeNo,
          ChequeDate: formattedchequedate,
          ChequeAmount: Amount,
          MICRCode: "MICR123",
          BankName: ChequeorDDBankName,
          BankBranch: ChequeorDDBankName,
          IsOldCheque: IsOldCheque,
          AccountPayeeCheque: AccountPayeeCheque,
          CreatedBy: !isEditing ? userId : undefined,
          UpdatedBy: isEditing ? userId : undefined,
        },
        {
          Id: isEditing ? srn2Id : null,
          VoucherId: voucherId,
          VoucherType: "RE",
          SRN: 2,
          VoucherNo: VoucherNo ? voucherNo : null, // Ensures it takes `null` if `VoucherNo` is not provided
          VoucherDate: formattedVoucherdate,
          AccountId: parseInt(PartyId, 10),
          Amount: parseFloat(Amount),
          DOrC: "C",
          Narration: Narration,
          CostCenterId: 1,
          ChequeNo: ChequeNo,
          ChequeDate: formattedchequedate,
          ChequeAmount: Amount,
          MICRCode: "MICR123",
          BankName: ChequeorDDBankName,
          BankBranch: ChequeorDDBankName,
          IsOldCheque: IsOldCheque,
          AccountPayeeCheque: AccountPayeeCheque,
          CreatedBy: !isEditing ? userId : undefined,
          UpdatedBy: isEditing ? userId : undefined,
        },
      ];

      const voucherdetailurl =
        isEditing && voucherId
          ? "https://publication.microtechsolutions.net.in/php/Voucherdetailupdate.php"
          : "https://publication.microtechsolutions.net.in/php/Voucherdetailpost.php";

      // Send the detailsData in two separate API requests
      await axios.post(voucherdetailurl, qs.stringify(detailsData[0]), {
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
      });

      await axios.post(voucherdetailurl, qs.stringify(detailsData[1]), {
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
      });

      fetchVouchers();
      fetchVoucherdetails();
      setIsDrawerOpen(false);
      toast.success(
        isEditing
          ? "Receipt Voucher & Receipt Voucher Details updated successfully!"
          : "Receipt Voucher & Receipt Voucher Details added successfully!"
      );
      resetForm();
    } catch (error) {
      console.error("Error saving record:", error);
      // toast.error('Error saving record!');
    }
  };

  const navigate = useNavigate();
  const handlePrint = () => {
    navigate(
      `/transaction/receiptvoucher/receiptvoucherprint/${currentRow.original.Id}`
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
        accessorKey: "VoucherType",
        header: "Voucher Type",
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
          const date = moment(cell.getValue()).format("DD-MM-YYYY");
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
    [receipts]
  );

  const table = useMaterialReactTable({
    columns,
    data: receipts,
    muiTableHeadCellProps: {
      style: {
        backgroundColor: "#E9ECEF",
        color: "black",
        fontSize: "16px",
      },
    },
  });

  return (
    <div className="receiptvoucher-container">
      <h1>Receipt Voucher</h1>

      <div className="receiptvouchertable-master">
        <div className="receiptvouchertable1-master">
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
          <div className="receiptvouchertable-container">
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
        </div>

        {isDrawerOpen && <div onClick={() => setIsDrawerOpen(false)} />}

        <Drawer
          anchor="right"
          open={isDrawerOpen}
          // onClose={handleDrawerClose}
          PaperProps={{
            sx: {
              borderRadius: isSmallScreen ? "0" : "10px 0 0 10px",
              width: isSmallScreen ? "100%" : "65%",
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
                {isEditing ? "Edit Receipt Voucher" : "Create Receipt Voucher"}
              </b>
            </Typography>{" "}
            <CloseIcon sx={{ cursor: "pointer" }} onClick={handleDrawerClose} />
          </Box>
          <Divider
          // sx={{
          //   width: '1000px',
          //   borderColor: 'navy',
          //   borderWidth: 1,

          // }}
          />

          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: 2,
              m: 1,
              mt: 0,
            }}>
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                gap: 1,
              }}
              mt={1}>
              <Box flex={2}>
                <Typography variant="body2" fontWeight="bold">
                  Receipt No
                </Typography>
                <TextField
                  type="number"
                  value={VoucherNo}
                  onChange={(e) => setVoucherNo(e.target.value)}
                  size="small"
                  margin="none"
                  style={{ background: "#f5f5f5" }}
                  placeholder="Receipt No"
                  fullWidth
                  disabled={isEditing} // Prevent editing in update mode
                />
              </Box>
              <Box flex={3}>
                <Typography variant="body2" fontWeight="bold">
                  Receipt Date
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
                      />
                    )}
                    slotProps={{
                      textField: { size: "small", fullWidth: true },
                    }}
                    format="dd-MM-yyyy"
                  />
                </LocalizationProvider>
              </Box>
              <Box>
                <Box flex={2} ml={3}>
                  <Typography variant="body2" fontWeight="bold">
                    Cash/Bank
                  </Typography>
                  <RadioGroup
                    value={PaymentType}
                    onChange={(e) => setPaymenttype(Number(e.target.value))}
                    row>
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
                      label="MBB Receipt"
                    />
                  </RadioGroup>
                </Box>
              </Box>{" "}
            </Box>

            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              <Box flex={2}>
                <Typography fontWeight="bold" variant="body2">
                  Party Name
                </Typography>
                <Autocomplete
                  options={accountOptions}
                  value={
                    accountOptions.find((option) => option.value === PartyId) ||
                    null
                  }
                  onChange={(event, newValue) =>
                    setPartyid(newValue ? newValue.value : null)
                  }
                  getOptionLabel={(option) => option.label} // Display only label in dropdown
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      placeholder="Select Party Name"
                      size="small"
                      margin="none"
                      fullWidth
                    />
                  )}
                />
              </Box>

              <Box flex={2}>
                <Typography fontWeight="bold" variant="body2">
                  Bank Name
                </Typography>
                <Autocomplete
                  options={accountOptions}
                  value={
                    accountOptions.find((option) => option.value === BankId) ||
                    null
                  }
                  onChange={(event, newValue) =>
                    setBankId(newValue ? newValue.value : null)
                  }
                  getOptionLabel={(option) => option.label} // Display only label in dropdown
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      placeholder="Select Bank Name"
                      size="small"
                      margin="none"
                      fullWidth
                    />
                  )}
                />
              </Box>

              <Box flex={2}>
                <Typography fontWeight="bold" variant="body2">
                  Amount
                </Typography>
                <TextField
                  type="number"
                  value={Amount}
                  onChange={(e) => setAmount(e.target.value)}
                  size="small"
                  margin="none"
                  placeholder="Amount"
                  fullWidth
                />
              </Box>
            </Box>

            <Box sx={{ display: "flex", gap: 1 }} mt={2} component="fieldset">
              <Box>
                <Typography variant="body2" fontWeight="bold">
                  Cheque/DD
                </Typography>
                <FormControl size="small" margin="none">
                  <RadioGroup
                    value={ChequeorDDType}
                    onChange={(e) => setChequeorDDType(e.target.value)}
                    row>
                    <FormControlLabel
                      value="cheque"
                      control={<Radio />}
                      label="Cheque"
                      size="small"
                    />
                    <FormControlLabel
                      value="dd"
                      control={<Radio />}
                      label="DD"
                      size="small"
                    />
                  </RadioGroup>
                </FormControl>
              </Box>

              <Box
                sx={{ display: "flex", alignItems: "center", gap: 1 }}
                ml={2}>
                {/* Bank Name */}
                <Box flex={2}>
                  <Typography fontWeight="bold" variant="body2">
                    Bank Name
                  </Typography>
                  {/* <Autocomplete
                    options={accountOptions}
                    value={
                      accountOptions.find(
                        (option) => option.value === ChequeorDDBankName
                      ) || null
                    }
                    onChange={(event, newValue) =>
                      setChequeBankName(newValue ? newValue.value : null)
                    }
                    getOptionLabel={(option) => option.label}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        placeholder="Select Bank Name"
                        size="small"
                        margin="none"
                        fullWidth
                      />
                    )}
                  /> */}
                  <TextField
                    value={ChequeorDDBankName}
                    onChange={(e) => setChequeBankName(e.target.value)}
                    placeholder="Enter Bank Name"
                    size="small"
                    margin="none"
                    fullWidth
                  />
                </Box>

                {/* Cheque or DD No */}
                <Box flex={2}>
                  <Typography fontWeight="bold" variant="body2">
                    {ChequeorDDType === "cheque" ? "Cheque No" : "DD No"}
                  </Typography>
                  <TextField
                    value={ChequeNo}
                    onChange={(e) => setChequeNo(e.target.value)}
                    size="small"
                    margin="none"
                    placeholder={
                      ChequeorDDType === "cheque" ? "Cheque No" : "DD No"
                    }
                    fullWidth
                  />
                </Box>

                <Box flex={2}>
                  <Typography fontWeight="bold" variant="body2">
                    Cheque Date{" "}
                  </Typography>
                  <LocalizationProvider dateAdapter={AdapterDateFns}>
                    <DatePicker
                      value={ChequeDate ? new Date(ChequeDate) : null}
                      onChange={(newValue) => setChequeDate(newValue)}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          error={!!errors.ChequeDate}
                          helperText={errors.ChequeDate}
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
            </Box>

            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }} mt={3}>
              <Box flex={2}>
                <Typography fontWeight="bold" variant="body2">
                  Towards
                </Typography>
                <Autocomplete
                  options={accountOptions}
                  value={
                    accountOptions.find((option) => option.value === Towards) ||
                    null
                  }
                  onChange={(event, newValue) =>
                    setTowards(newValue ? newValue.value : null)
                  }
                  getOptionLabel={(option) => option.label}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      placeholder="Select Towards"
                      size="small"
                      margin="none"
                      fullWidth
                    />
                  )}
                />
              </Box>

              <Box flex={2}>
                <Typography fontWeight="bold" variant="body2">
                  Kachi Pavati No
                </Typography>
                <TextField
                  value={KachiPavatiNo}
                  onChange={(e) => setKachiPavatiNo(e.target.value)}
                  size="small"
                  margin="none"
                  placeholder="Kachi Pavati No"
                  fullWidth
                />
              </Box>

              <Box flex={2}>
                <Typography fontWeight="bold" variant="body2">
                  Kachi Pavati Date
                </Typography>
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                  <DatePicker
                    value={KachiPavatiDate ? new Date(KachiPavatiDate) : null} // Convert to Date object
                    onChange={(newValue) => setKachiPavatiDate(newValue)}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        error={!!errors.KachiPavatiDate}
                        helperText={errors.KachiPavatiDate}
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
          </Box>

          <Box
            display={"flex"}
            alignItems={"center"}
            justifyContent={"center"}
            gap={1}
            m={3}>
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
              <u>Receipt Voucher</u>
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
export default Receiptvoucher;
