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
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
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

  useEffect(() => {
    const today = new Date();
    const formattedToday = today.toISOString().split("T")[0];
    setVoucherDate(formattedToday);
  }, []);

  // Get today's date and max (today + 2 days)
  const today = new Date().toISOString().split("T")[0];
  const maxDate = new Date();
  maxDate.setDate(maxDate.getDate() + 2);
  const formattedMaxDate = maxDate.toISOString().split("T")[0];

  const [pageIndex, setPageIndex] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [dateError, setDateError] = useState(false);
  const [chequedateerror, setchequedateerror] = useState(false);
  const [kachipavatidateerror, setkachipavatidateerror] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(null);
  const [selectedIndex, setSelectedIndex] = useState(null);
  const [PartyId, setPartyid] = useState("");
  const [BankId, setBankId] = useState("");
  const [AccountId, setAccountId] = useState("");
  const [Amount, setAmount] = useState("");
  const [ChequeorDDType, setChequeorDDType] = useState("cheque"); // "cheque" or "dd"
  const [ChequeorDDBankName, setChequeBankName] = useState("");
  const [BankName, setBankName] = useState("")
  const [Towards, setTowards] = useState("");
  const [TowardsId, setTowardsId] = useState("");
  const [KachiPavatiNo, setKachiPavatiNo] = useState("");
  const [KachiPavatiDate, setKachiPavatiDate] = useState(dayjs());
  const [VoucherType, setVoucherType] = useState("RE");

  const [PaymentType, setPaymenttype] = useState(0); // 0: Cash, 1: Bank, 2: MBB Receipt
  const isCash = PaymentType === 0;
  const isBank = PaymentType === 1;
  const isMBB = PaymentType === 2;

  const [VoucherNo, setVoucherNo] = useState(null);
  const [VoucherDate, setVoucherDate] = useState(dayjs());
  const [ChequeNo, setChequeNo] = useState("");
  const [ChequeDate, setChequeDate] = useState(dayjs());
  const [Narration, setNarration] = useState("");

  const [IsOldCheque, setIsoldcheque] = useState(false);
  const [AccountPayeeCheque, setAccountpayeecheque] = useState(false);
  const [CanvassorName, setCanvassorName] = useState("");

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

  const [srn1Id, setSrn1Id] = useState(null); // Debit detail Id
  const [srn2Id, setSrn2Id] = useState(null); // Credit detail Id

  // const handleDateChange1 = (newDate1) => {
  //   if (!newDate1 || !dayjs.isDayjs(newDate1) || !newDate1.isValid()) return;
  //   setVoucherDate(newDate1);
  //   console.log("Selected date:", newDate1.format("YYYY-MM-DD"));

  // };
  const [selectedAccount, setSelectedAccount] = useState(null);

  const [receiptsafeDate, setReceiptsafeDate] = useState(dayjs());

 
  const handleDateChange1 = (newValue) => {
    if (!newValue || !dayjs(newValue).isValid()) {
      setDateError("Invalid date");
      setReceiptsafeDate(null);
      return;
    }

    setDateError("");
    setReceiptsafeDate(dayjs(newValue));
  };

  const [chequesafeDate, setchequesafeDate] = useState(dayjs());

  const handleDateChange2 = (newValue) => {
    if (!newValue || !dayjs(newValue).isValid()) {
      setchequedateerror("Invalid date");
      setchequesafeDate(null);
      return;
    }

    setDateError("");
    setchequesafeDate(dayjs(newValue));
  };

  const [kachipavatisafeDate, setkachipavatisafeDate] = useState(dayjs());

  const handleDateChange3 = (newValue) => {
    if (!newValue || !dayjs(newValue).isValid()) {
      setkachipavatidateerror("Invalid date");
      setkachipavatisafeDate(null);
      return;
    }

    setDateError("");
    setkachipavatisafeDate(dayjs(newValue));
  };

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

  const DEFAULT_CASH_BANK_ID = 1; // or 999 or whatever exists in DB
  useEffect(() => {
    if (PaymentType === 0) {
      setBankId(DEFAULT_CASH_BANK_ID); // 🔥 invisible but required
    }
  }, [PaymentType]);

  const fetchReceipts = async () => {
    try {
      const response = await axios.get(
        "https://publication.microtechsolutions.net.in/php/Vouchertypeget.php?VoucherType=RE",
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

    const sortedData = [...response.data].sort((a, b) => {
      const dateA = new Date(a.VoucherDate?.date);
      const dateB = new Date(b.VoucherDate?.date);
      return dateA - dateB; // 🔥 OLD → NEW
    });

    setReceipts(sortedData);
  } catch (error) {
    console.error("Error fetching Vouchers:", error);
  }
};

  const fetchVoucherdetails = async () => {
    try {
      const response = await axios.get(
        "https://publication.microtechsolutions.net.in/php/Voucherdetailget.php",
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
        "https://publication.microtechsolutions.net.in/php/Accountget.php",
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
useEffect(() => {
    
    fetchCities();
     
    fetchAreas()
  }, []);


  useEffect(() => {
  if (PartyId) {
    fetchPartyInfo(PartyId);
  } else {
    setPartyDetails(null);
  }
}, [PartyId]);
const [partyInfo, setPartyInfo] = useState(null);

const [partyDetails, setPartyDetails] = useState(null);



  const fetchPartyInfo = async (accountId) => {
  try {
    const response = await axios.get(
      `https://publication.microtechsolutions.net.in/php/Addressget.php?AccountId=${accountId}`
    );

    console.log("Party API Response:", response.data);

    if (
      response.data?.status === "success" &&
      response.data?.data?.length > 0
    ) {
      // 🔥 If multiple records exist → pick latest UpdatedOn
      const sorted = [...response.data.data].sort(
        (a, b) =>
          new Date(b.UpdatedOn.date) - new Date(a.UpdatedOn.date)
      );

      setPartyInfo(sorted[0]); // ✅ most recently updated address
    } else {
      setPartyInfo(null);
    }
  } catch (error) {
    console.error("Error fetching party info:", error);
    setPartyInfo(null);
  }
};


  const [cities, setCities] = useState([]);
  const [areas, setareas] = useState([]);



const fetchCities = async () => {
    try {
      const response = await axios.get(
        "https://publication.microtechsolutions.net.in/php/Cityget.php",
      );
      const cityOptions = response.data.map((city) => ({
        value: city.Id,
        label: city.CityName,
      }));
      setCities(cityOptions);
    } catch (error) {
      // toast.error("Error fetching cities:", error);
    }
  };

  const fetchAreas = async () => {
    try {
      const response = await axios.get(
        "https://publication.microtechsolutions.net.in/php/Areaget.php",
      );
      const areaOptions = response.data.map((area) => ({
        value: area.Id,
        label: area.AreaName,
      }));
      setareas(areaOptions);
    } catch (error) {
      // toast.error("Error fetching areas:", error);
    }
  };

  
  const getAreaName = (areaId) =>
    areas.find((a) => a.value === areaId)?.label || "";

  const getCityName = (cityId) =>
    cities.find((c) => c.value === cityId)?.label || "";

  
  const TOWARDS_OPTIONS = [
    { value: 1, label: "Cash Received" },
    { value: 2, label: "Cash Received – Sales Counter" },
    { value: 3, label: "On Account" },
    { value: 4, label: "CORE BANKING BANK A/C NO." },
    { value: 5, label: "Cash Withdrawn Self Chq. No." },
    { value: 6, label: "CORE BANKING BANK A/C NO. HDFC" },
  ];

  const resetForm = () => {
    setVoucherNo("");
    // setVoucherDate("");
    setReceiptsafeDate(dayjs());
    setDateError("");
    setSelectedCashorbank("");
    setPartyid("");
    setBankId("");
    setAmount("");
    setChequeBankName("");
    // setChequeDate("");
    setchequesafeDate(dayjs());
    setchequedateerror("");
    setChequeNo("");
    setTowards("");
    setCanvassorName("");
    // setKachiPavatiDate("");
    setkachipavatisafeDate(dayjs());
    setkachipavatidateerror("");
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

  const handleEdit = async () => {
    if (currentRow) {
      console.log("Editing item with ID:", currentRow.original.Id);
      setIdwiseData(currentRow.original.Id);
    }

    console.log(currentRow, "row");
    const voucherheader = receipts[currentRow.index];

    const response = await axios.get(
      "https://publication.microtechsolutions.net.in/php/Voucherdetailget.php",
    );
    setReceiptdetails(response.data);

    // filter details for this voucherId
    const voucherdetail = response.data.filter(
      (detail) => detail.VoucherId === voucherheader.Id,
    );

    console.log(voucherdetail, "voucherdetails");
    const convertDateForInput = (dateStr) => {
      if (typeof dateStr === "string" && dateStr.includes("-")) {
        const [year, month, day] = dateStr.split(" ")[0].split("-");
        return dayjs(`${year}-${month}-${day}`);
      }
      return null;
    };
    const formattedchequedate = convertDateForInput(
      voucherheader.ChequeDate?.date,
    );
    const formattedvoucherdate = convertDateForInput(
      voucherheader.VoucherDate?.date,
    );
    const formattedkachipavtidate = convertDateForInput(
      voucherheader.KachiPavatiDate?.date,
    );

    const debitRow = voucherdetail.find((d) => d.DOrC === "D");
    const creditRow = voucherdetail.find((d) => d.DOrC === "C");

    console.log(debitRow, "debit row");
    console.log(creditRow, "credit row");
    // ✅ store real detail IDs
    setSrn1Id(debitRow?.Id || null);
    setSrn2Id(creditRow?.Id || null);

    setBankId(debitRow?.AccountId || null);
    setPartyid(creditRow?.AccountId || null);

    setAmount(debitRow?.Amount || "");
    setReceiptsafeDate(dayjs(formattedvoucherdate));
    setchequesafeDate(dayjs(formattedchequedate));
    setkachipavatisafeDate(dayjs(formattedkachipavtidate));
    setVoucherNo(voucherheader.VoucherNo);
    // setBankId(voucherdetail[0]?.AccountId);
    // setPartyid(voucherdetail[1]?.AccountId);
    // setAmount(voucherdetail[0]?.Amount);
    setChequeBankName(voucherdetail[1]?.BankName);
    setTowards(Number(voucherheader.Towards));
    setCanvassorName(voucherheader.CanvassorName || "");

    setNarration(voucherheader.Narration);
    setChequeNo(voucherheader.ChequeNo);
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
      (detail) => detail.Id === currentRow.original.Id,
    );
    if (specificDetail) {
      setVoucherdetailId(specificDetail.Id); // Set the specific detail Id
    }

    fetchVoucherdetails();
  };

  const [selectedVoucher, setSelectedVoucher] = useState(null);

  useEffect(() => {
    if (!selectedVoucher) return;
    const { voucherheader, voucherdetail, row } = selectedVoucher;

    const convertDateForInput = (dateStr) => {
      if (typeof dateStr === "string" && dateStr.includes("-")) {
        const [year, month, day] = dateStr.split(" ")[0].split("-");
        return dayjs(`${year}-${month}-${day}`);
      }
      return null;
    };

    const formattedchequedate = convertDateForInput(
      voucherheader.ChequeDate?.date,
    );
    const formattedvoucherdate = convertDateForInput(
      voucherheader.VoucherDate?.date,
    );
    const formattedkachipavtidate = convertDateForInput(
      voucherheader.KachiPavatiDate?.date,
    );

    setReceiptsafeDate(dayjs(formattedvoucherdate));
    setchequesafeDate(dayjs(formattedchequedate));
    setkachipavatisafeDate(dayjs(formattedkachipavtidate));

    setVoucherNo(voucherheader.VoucherNo);
    setBankId(voucherdetail[0]?.AccountId);
    setPartyid(voucherdetail[1]?.AccountId);
    setAmount(voucherdetail[0]?.Amount);
    setChequeBankName(voucherdetail[1]?.BankName);
    setTowards(Number(voucherheader.Towards));
    setNarration(voucherheader.Narration);
    setChequeNo(voucherheader.ChequeNo);
    setKachiPavatiNo(voucherheader.KachiPavatiNo);
    setPaymenttype(voucherheader.PaymentType);

    setEditingIndex(row.index);
    setIsEditing(true);
    setId(voucherheader.Id);

    const specificDetail = voucherdetail.find(
      (detail) => detail.Id === row.original.Id,
    );
    if (specificDetail) {
      setVoucherdetailId(specificDetail.Id);
    }

    setIsDrawerOpen(true); // ✅ only once, after states are ready
    fetchVoucherdetails();
  }, [selectedVoucher]);

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
      requestOptions,
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
  const CASH_ACCOUNT_ID = 1; // Cash in Hand

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !receiptsafeDate ||
      !dayjs(receiptsafeDate).isValid() ||
      dateError ||
      !chequesafeDate ||
      !dayjs(chequesafeDate).isValid() ||
      chequedateerror ||
      !kachipavatisafeDate ||
      !dayjs(kachipavatisafeDate).isValid() ||
      kachipavatidateerror
    ) {
      toast.error("Please correct all the date fields before submitting.");
      return;
    }

    console.log("receiptsafeDate state before formatting:", receiptsafeDate);

    const formattedVoucherdate = dayjs(receiptsafeDate).format("YYYY-MM-DD");
    console.log(formattedVoucherdate, "format voucher date");
    console.log(
      "moment(receiptsafeDate).format:",
      dayjs(receiptsafeDate).format("YYYY-MM-DD"),
    );
    const formattedchequedate = dayjs(chequesafeDate).format("YYYY-MM-DD");
    const formattedkachipavtidate =
      dayjs(kachipavatisafeDate).format("YYYY-MM-DD");

    const headerData = {
      Id: isEditing ? id : "",
      VoucherType: "RE",
      VoucherNo: VoucherNo ? VoucherNo : null,
      VoucherDate: formattedVoucherdate,
      ChequeNo: ChequeNo,
      ChequeDate: formattedchequedate,
      RefNo: "RefNo",
      Narration: Narration,
      KachiPavatiNo: KachiPavatiNo,
      KachiPavatiDate: formattedkachipavtidate,
      Towards: Towards,
      CanvassorName: CanvassorName, // ✅ added

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

      const formattedVoucherdate = dayjs(receiptsafeDate).format("YYYY-MM-DD");
      const formattedchequedate = dayjs(chequesafeDate).format("YYYY-MM-DD");

     
      

      const detailsData = [
        {
          Id: isEditing ? srn1Id : null, // ✅ real ID
          VoucherId: voucherId,
          VoucherType: "RE",
          SRN: 1,
          VoucherNo: voucherNo,
          VoucherDate: formattedVoucherdate,
          // 🔴 Debit side
          AccountId:
            PaymentType === 0
              ? DEFAULT_CASH_BANK_ID // 👈 hidden bank
              : Number(BankId),
          Amount: Number(Amount),
          DOrC: "D",
          Narration,
          CostCenterId: 1,
          BankName: BankName,
          ChequeNo: ChequeNo,
          ChequeDate: formattedchequedate,
          CreatedBy: !isEditing ? userId : undefined,
          UpdatedBy: isEditing ? userId : undefined,
        },
        {
          Id: isEditing ? srn2Id : null, // ✅ real ID
          VoucherId: voucherId,
          VoucherType: "RE",
          SRN: 2,
          VoucherNo: voucherNo,
          VoucherDate: formattedVoucherdate,
          AccountId: Number(PartyId),
          Amount: Number(Amount),
          DOrC: "C",
          Narration,
          CostCenterId: 1,
                    BankName: BankName,

          ChequeNo:ChequeNo,
          ChequeDate: formattedchequedate,
          CreatedBy: !isEditing ? userId : undefined,
          UpdatedBy: isEditing ? userId : undefined,
        },
      ];

      console.log("UPDATE DETAIL IDS:", srn1Id, srn2Id);
      console.log("UPDATED AMOUNT:", Amount);

      const voucherdetailurl =
        isEditing && voucherId
          ? "https://publication.microtechsolutions.net.in/php/Voucherdetailupdate.php"
          : "https://publication.microtechsolutions.net.in/php/Voucherdetailpost.php";

      // 🔹 Debit row
      if (!isEditing || srn1Id) {
        await axios.post(voucherdetailurl, qs.stringify(detailsData[0]), {
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
        });
      }

      // 🔹 Credit row
      if (!isEditing || srn2Id) {
        await axios.post(voucherdetailurl, qs.stringify(detailsData[1]), {
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
        });
      }

      fetchVouchers();
      fetchVoucherdetails();
      setIsDrawerOpen(false);
      toast.success(
        isEditing
          ? "Receipt Voucher & Receipt Voucher Details updated successfully!"
          : "Receipt Voucher & Receipt Voucher Details added successfully!",
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
      `/transaction/receiptvoucher/receiptvoucherprint/${currentRow.original.Id}`,
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
    [receipts],
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
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DatePicker
                    // label="Receipt Date"
                    value={receiptsafeDate || null}
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
              <Box>
                <Box flex={2} ml={3}>
                  <Typography variant="body2" fontWeight="bold">
                    Cash/Bank/MBB Receipt
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
                {/* <Autocomplete
                  options={accountOptions}
                  value={
                    accountOptions.find((o) => o.value === PartyId) || null
                  }
                  onChange={(e, newValue) =>
                    setPartyid(newValue ? newValue.value : null)
                  }
                  getOptionLabel={(option) => option.label}
                  // disabled={PaymentType === 0}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      placeholder={PaymentType === 0 ? "" : "Select Party Name"}
                      size="small"
                      fullWidth
                    />
                  )}
                /> */}

               <Autocomplete
  options={accountOptions}
  value={accountOptions.find((o) => o.value === PartyId) || null}
  onChange={(e, newValue) => {
    const id = newValue ? newValue.value : null;
    setPartyid(id);

    if (id) {
      fetchPartyInfo(id); // 🔥 now defined
    } else {
      setPartyInfo(null);
    }
  }}
  getOptionLabel={(option) => option.label}
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

              {(isBank || isMBB) && (
                <Box flex={2}>
                  <Typography fontWeight="bold" variant="body2">
                    Bank Name
                  </Typography>
                  <Autocomplete
                    options={accountOptions}
                    value={
                      accountOptions.find(
                        (option) => option.value === BankId,
                      ) || null
                    }
                    onChange={(event, newValue) =>{
                                          setSelectedAccount(newValue || null);
                                                                setBankId(newValue ? newValue.value : null)


                    }

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
              )}

              <Box flex={1}>
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
            {isBank && (
              <Box sx={{ display: "flex", gap: 1 }} mt={2} component="fieldset">
                <Box>
                  <Typography variant="body2" fontWeight="bold">
                    Cheque/NEFT
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
                        value="neft"
                        control={<Radio />}
                        label="NEFT"
                        size="small"
                      />

                      <FormControlLabel
                        value="upi"
                        control={<Radio />}
                        label="UPI"
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
                      value={BankName}
                      onChange={(e) => setBankName(e.target.value)}
                      placeholder="Enter Bank Name"
                      size="small"
                      margin="none"
                      fullWidth
                    />
                  </Box>

                  {/* Cheque or DD No */}
                  <Box flex={2}>
                    <Typography fontWeight="bold" variant="body2">
                      {ChequeorDDType === "cheque"
                        ? "Cheque No"
                        : ChequeorDDType === "upi"
                          ? "UPI Id"
                          : "Transaction ID / UTR No"}
                    </Typography>
                    <TextField
                      value={ChequeNo}
                      onChange={(e) => setChequeNo(e.target.value)}
                      size="small"
                      margin="none"
                      placeholder={
                        ChequeorDDType === "cheque"
                          ? "Enter Cheque No"
                          : ChequeorDDType === "dd"
                            ? "Enter DD No"
                            : "Enter Transaction ID / UTR No"
                      }
                      fullWidth
                    />
                  </Box>

                  <Box flex={2}>
                    <Typography fontWeight="bold" variant="body2">
                      {ChequeorDDType === "cheque"
                        ? "Cheque Date"
                        : ChequeorDDType === "dd"
                          ? "DD Date"
                          : "Transaction Date"}
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
              </Box>
            )}

            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }} mt={3}>
              <Box flex={2}>
                <Typography fontWeight="bold" variant="body2">
                  Towards
                </Typography>
                <Autocomplete
                  options={TOWARDS_OPTIONS}
                  value={
                    TOWARDS_OPTIONS.find(
                      (option) => option.value === Towards,
                    ) || null
                  }
                  onChange={(event, newValue) =>
                    setTowards(newValue ? newValue.value : null)
                  }
                  getOptionLabel={(option) => option.label}
                  isOptionEqualToValue={(option, value) =>
                    option.value === value.value
                  }
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
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DatePicker
                    value={kachipavatisafeDate}
                    onChange={handleDateChange3}
                    format="DD-MM-YYYY"
                    slotProps={{
                      textField: {
                        size: "small",
                        fullWidth: true,
                        error: !!kachipavatidateerror,
                        helperText: kachipavatidateerror,
                      },
                    }}
                  />
                </LocalizationProvider>
              </Box>
            </Box>

            {/* 🔹 Canvassor – smaller width */}
            <Box sx={{ display: "flex", gap: 2 }} mt={3}>
              <Box flex={4}>
                <Typography fontWeight="bold" variant="body2">
                  Canvassor?
                </Typography>
                <TextField
                  value={CanvassorName}
                  onChange={(e) => setCanvassorName(e.target.value)}
                  size="small"
                  margin="none"
                  placeholder="Enter Canvassor Name"
                  small
                  style={{ width: "400px", marginTop: "5" }}
                />
              </Box>
            </Box>



          </Box>



{/* Ensure the box shows as soon as a PartyId is selected */}
{PartyId && (
  <Box
    sx={{
      m: 1,
      width: "500px",
      p: 1,
      backgroundColor: "#336699",
      color: "white",
      borderRadius: 1,
      border: "1px solid #003366",
      minHeight: "140px", // Ensures box has a consistent size
      display: "flex",
      flexDirection: "column",
      justifyContent: "center"
    }}
  >
    {partyInfo ? (
      <>
        {/* Case 1: Party Info exists - Show Name */}
        <Typography fontWeight="bold" variant="body1">
          {partyInfo.AccountName || "Account Name Not Available"} ({PartyId})
        </Typography>

        {/* Check for any address lines */}
        {(partyInfo.Address1 || partyInfo.Address2 || partyInfo.Address3) ? (
          <Box sx={{ mt: 0.5 }}>
            {partyInfo.Address1 && <Typography variant="caption" display="block">{partyInfo.Address1}</Typography>}
            {partyInfo.Address2 && <Typography variant="caption" display="block">{partyInfo.Address2}</Typography>}
            {partyInfo.Address3 && <Typography variant="caption" display="block">{partyInfo.Address3}</Typography>}
          </Box>
        ) : (
          <Typography variant="caption" sx={{ fontStyle: "italic", mt: 1, display: "block", color: "#FFD700" }}>
            ⚠️ No address info available
          </Typography>
        )}

        {partyInfo.MobileNo && (
          <Typography variant="caption" display="block" mt={0.2}>
            Mobile: {partyInfo.MobileNo}
          </Typography>
        )}

        <Box sx={{ mt: 0.3, pt: 1, borderTop: "1px solid rgba(255,255,255,0.3)" }}>
          <Typography fontWeight="bold">
            Bal. = {partyInfo.Balance || "0.00"} Dr
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
