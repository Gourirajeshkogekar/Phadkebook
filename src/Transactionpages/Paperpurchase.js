import React, {
  useState,
  useMemo,
  useEffect,
  useSyncExternalStore,
} from "react";
import "./Paperpurchase.css";
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
import { Edit, Delete, Add, MoreVert, Print } from "@mui/icons-material";
import dayjs from "dayjs";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
function Paperpurchase() {
  const [userId, setUserId] = useState("");

  useEffect(() => {
    const storedUserId = sessionStorage.getItem("UserId");
    if (storedUserId) {
      setUserId(storedUserId);
    } else {
      toast.error("User is not logged in.");
    }

    fetchPurchases();
  }, []);

  const [pageIndex, setPageIndex] = useState(1); // Current page
  const [totalPages, setTotalPages] = useState(1);
  const [PurchaseNo, setPurchaseNo] = useState(null);
  const [PurchaseDate, setPurchaseDate] = useState("");
  const [SupplierId, setSupplierId] = useState("");
  const [BillNo, setBillNo] = useState("");
  const [BillDate, setBillDate] = useState("");
  const [BillAmount, setBillAmount] = useState("");
  const [SalesTaxId, setSalesTaxId] = useState("");
  const [PurchaseAccountId, setPurchaseAccountId] = useState("");
  const [TaxId, setTaxId] = useState("");
  const [AccountId, setAccountid] = useState("");
  const [CGST, setCGST] = useState("");
  const [SGST, setSGST] = useState("");
  const [IGST, setIGST] = useState("");
  const [SubTotal, setSubTotal] = useState("");
  const [Extra1, setExtra1] = useState("");
  const [Extra1Amount, setExtra1Amount] = useState("");
  const [Extra2, setExtra2] = useState("");
  const [Extra2Amount, setExtra2Amount] = useState("");
  const [Extra3, setExtra3] = useState("");
  const [Extra3Amount, setExtra3Amount] = useState("");
  const [RoundOff, setRoundOff] = useState("");
  const [Total, setTotal] = useState("");
  const [TotalCopies, setTotalCopies] = useState("");
  const [IsPaperPurchase, setIsPaperPurchase] = useState(false);
  const [Remark, setRemark] = useState("");

  const [currentRow, setCurrentRow] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);

  const salesTaxOptions = [
    { label: "C.S.T. 4%", taxId: 1 },
    { label: "CST 12.5%", taxId: 2 },
    { label: "Exempted", taxId: 3 },
    { label: "Expenses", taxId: 4 },
    { label: "GST 5%", taxId: 5 },
    { label: "GST 12%", taxId: 6 },
    { label: "GST 18%", taxId: 7 },
    { label: "GST 28%", taxId: 8 },
    { label: "IGST 5%", taxId: 9 },
    { label: "IGST 12%", taxId: 10 },
    { label: "IGST 18%", taxId: 11 },
    { label: "IGST 28%", taxId: 12 },
    { label: "Lbr Chgs.", taxId: 13 },
    { label: "R.D.", taxId: 14 },
    { label: "ROYALTY", taxId: 15 },
    { label: "Transit-Against C Form", taxId: 16 },
    { label: "U.R.D", taxId: 17 },
    { label: "VAT 4%", taxId: 18 },
    { label: "VAT 5%", taxId: 19 },
    { label: "VAT 6%", taxId: 20 },
    { label: "VAT 8%", taxId: 21 },
    { label: "VAT 12.5%", taxId: 22 },
    { label: "VAT 13.5%", taxId: 23 },
    { label: "VAT @5.5%", taxId: 24 },
  ];

  const [openPaperDialog, setOpenPaperDialog] = useState(false);
  const [selectedRowIndex, setSelectedRowIndex] = useState(null);

  const handlePaperSelect = (paper) => {
    setRows((prevRows) => {
      const updatedRows = [...prevRows];

      updatedRows[selectedRowIndex] = {
        ...updatedRows[selectedRowIndex],
        PaperId: paper.value,
        SizeCode: paper.code,
        PaperSizeName: paper.label, // ✅ MATCH TABLE
        Unit: paper.unit, // ✅ MATCH TABLE
      };

      return updatedRows;
    });

    setOpenPaperDialog(false);
  };

  const paperCodetimer = useRef(null);

  const handlePapercodechange = (rowIndex, value) => {
    const updatedRows = [...rows];
    updatedRows[rowIndex].SizeCode = value;
    setRows(updatedRows);

    // 🔴 Clear previous timer
    if (paperCodetimer.current) {
      clearTimeout(paperCodetimer.current);
    }

    // if book code is blank → reset row fields
    if (value.trim() === "") {
      updatedRows[rowIndex].PaperSizeName = "";

      updatedRows[rowIndex].MillName = "";
      updatedRows[rowIndex].Unit = "";
      updatedRows[rowIndex].MultipleFactor = "";
      updatedRows[rowIndex].OpeningStock = "";
      updatedRows[rowIndex].SizeCode = "";

      setRows(updatedRows);
      return; // stop here
    }
  };

  const handleMenuOpen = (event, row) => {
    setAnchorEl(event.currentTarget);
    setCurrentRow(row);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const [editingIndex, setEditingIndex] = useState(-1);

  const theme = useTheme();

  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));

  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const handleDrawerClose = () => {
    setIsDrawerOpen(false);
  };
  const [id, setId] = useState("");

  const [paperpurchasedetailId, setPaperpurchasedetailId] = useState("");
  const [errors, setErrors] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [purchases, setPurchases] = useState([]);
  const [purchaseDetails, setPurchaseDetails] = useState([]);

  //Dropdown for ID's

  const [paperOptions, setPaperoptions] = useState([]);
  const [tdsOptions, setTdsOptions] = useState([]);
  const [accountOptions, setAccountOptions] = useState([]);

  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [deleteIndex, setDeleteIndex] = useState(null);
  const [deleteId, setDeleteId] = useState(null);

  const [rows, setRows] = useState([
    {
      SizeCode: "", // ✅ USE THIS
      PaperId: "",
      PaperSizeName: "",
      Copies: 0,
      Rate: 0,
      DiscountPercentage: 0,
      DiscountAmount: 0,
      Amount: 0,
    },
  ]);

  useEffect(() => {
    fetchPurchases();
    fetchPurchasesDetails();
    fetchPapers();
    fetchTDS();
    fetchAccounts();
  }, []);

  const fetchPurchases = async () => {
    try {
      const response = await axios.get(
        `https://publication.microtechsolutions.net.in/php/get/getbyid.php?Table=Purchaseheader&Colname=IsPaperPurchase&Colvalue=true&Colname2=Active&Colvalue2=true
 `,
      );

      // setSellschallans(response.data);
      console.log(response.data, "response of paper purchase header");

      setPurchases(response.data);
    } catch (error) {
      console.error("Error fetching paper purchases:", error);
    }
  };

  // Fetch the purchase details
  const fetchPurchasesDetails = async () => {
    try {
      const response = await axios.get(
        "https://publication.microtechsolutions.net.in/php/Purchasedetailget.php",
      );
      setPurchaseDetails(response.data);
    } catch (error) {
      // toast.error("Error fetching Purchase details:", error);
    }
  };

  const fetchPapers = async () => {
    try {
      const response = await axios.get(
        "https://publication.microtechsolutions.net.in/php/Papersizeget.php",
      );
      const paperOptions = response.data.map((pp) => ({
        value: pp.Id,
        label: pp.PaperSizeName,
        code: pp.STRSize_Code,
        unit: pp.Unit,
      }));
      setPaperoptions(paperOptions);
    } catch (error) {
      // toast.error("Error fetching books:", error);
    }
  };

  const fetchTDS = async () => {
    try {
      const response = await axios.get(
        "https://publication.microtechsolutions.net.in/php/TDSMasterget.php",
      );
      const tdsOptions = response.data.map((tds) => ({
        value: tds.Id,
        label: tds.TDSHead,
      }));
      setTdsOptions(tdsOptions);
    } catch (error) {
      // toast.error("Error fetching tax:", error);
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
    }
  };

  // Calculation functions
  const calculateTotals = (updatedRows = rows) => {
    let totalCopies = 0;
    let subtotal = 0;

    // Loop through all rows and calculate
    updatedRows.forEach((row) => {
      const copies = parseFloat(row.Copies) || 0;
      const amount = parseFloat(row.Amount) || 0;

      totalCopies += copies; // 👈 keeps count of copies
      subtotal += amount; // 👈 keeps sum of amount
    });

    // Save subtotal & totalCopies
    setSubTotal(subtotal.toFixed(2));
    setTotalCopies(totalCopies); // 👈 now this updates state properly

    // Taxes
    const cgst = (subtotal * (parseFloat(CGST) || 0)) / 100;
    const sgst = (subtotal * (parseFloat(SGST) || 0)) / 100;
    const igst = (subtotal * (parseFloat(IGST) || 0)) / 100;

    const extra1 = parseFloat(Extra1Amount) || 0;
    const extra2 = parseFloat(Extra2Amount) || 0;
    const extra3 = parseFloat(Extra3Amount) || 0;

    const totalBeforeRound =
      subtotal + cgst + sgst + igst + extra1 + extra2 + extra3;
    const roundedTotal = Math.ceil(totalBeforeRound);

    setRoundOff(totalBeforeRound); // shows 0.48 if totalBeforeRound = 216.52
    setTotal(roundedTotal); // shows 217
  };

  const [purchasesafedate, setPurchasesafedate] = useState(dayjs());
  const [purchaseerror, setPurchaseerror] = useState("");
  const [billsafedate, setBillsafedate] = useState(dayjs());
  const [billerror, setBillerror] = useState("");

  const handleDateChange1 = (newValue) => {
    if (!newValue || !dayjs(newValue).isValid()) {
      setPurchaseerror("Invalid date");
      setPurchasesafedate(null);
      return;
    }

    // const today = dayjs();
    // const minDate = today.subtract(3, "day");
    // const maxDate = today.add(2, "day");

    // if (newValue.isBefore(minDate) || newValue.isAfter(maxDate)) {
    //   setPurchaseerror("You can select only 2 days before or after today");
    // } else {
    //   setPurchaseerror("");
    // }
    setPurchaseerror("");
    setPurchasesafedate(dayjs(newValue));
  };

  const handleDateChange2 = (newValue) => {
    if (!newValue || !dayjs(newValue).isValid()) {
      setBillerror("Invalid date");
      setBillsafedate(null);
      return;
    }

    // const today = dayjs();
    // const minDate = today.subtract(3, "day");
    // const maxDate = today.add(2, "day");

    // if (newValue.isBefore(minDate) || newValue.isAfter(maxDate)) {
    //   setBillerror("You can select only 2 days before or after today");
    // } else {
    //   setBillerror("");
    // }
    setBillerror("");
    setBillsafedate(dayjs(newValue));
  };

  const handleInputChange = (index, field, value) => {
    const updatedRows = [...rows];

    // Update the value of the current field
    updatedRows[index][field] = value;

    if (field === "PaperId") {
      // Update BookId and BookCode when a book is selected
      const selectedpaper = paperOptions.find(
        (option) => option.value === value,
      );
      if (selectedpaper) {
        updatedRows[index].STRSize_Code = selectedpaper.STRSize_Code; // Assuming BookCode is available in the bookOptions
      }
    }

    // Calculate the Amount when Copies and Rate are entered
    if (field === "Copies" || field === "Rate") {
      const copies = updatedRows[index].Copies || 0;
      const rate = updatedRows[index].Rate || 0;
      updatedRows[index].Amount = copies * rate;
    }

    // Calculate the DiscountAmount and FinalAmount when DiscountPercentage is entered
    if (
      field === "DiscountPercentage" ||
      field === "Copies" ||
      field === "Rate"
    ) {
      const discountPercentage = updatedRows[index].DiscountPercentage || 0;
      const amount = updatedRows[index].Amount || 0;
      updatedRows[index].DiscountAmount = (amount * discountPercentage) / 100;
      updatedRows[index].Amount = amount - updatedRows[index].DiscountAmount;
    }

    // Update the state with the new row data
    setRows(updatedRows);
    calculateTotals();
  };

  // const handleAddRow = () => {
  //   setRows([
  //     ...rows,
  //     {
  //       BookCode: "",
  //       BookId: "", // This will be empty for new rows
  //       SerialNo: "",
  //       Copies: "",
  //       Rate: "",
  //       DiscountPercentage: "",
  //       DiscountAmount: "",
  //       Amount: "",
  //     },
  //   ]);

  //   calculateTotals();
  // };

  const handleAddRow = () => {
    setRows([
      ...rows,
      {
        SizeCode: "",
        PaperId: "",
        PaperSizeName: "",
        Copies: 0,
        Rate: 0,
        DiscountPercentage: 0,
        DiscountAmount: 0,
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

  const resetForm = () => {
    setPurchaseNo("");
    // setPurchaseDate("");
    setPurchasesafedate(dayjs());
    setPurchaseerror("");
    setSupplierId("");
    setBillNo("");
    // setBillDate("");
    setBillsafedate(dayjs());
    setBillerror("");
    setPurchaseAccountId("");
    setSalesTaxId("");
    setCGST("");
    setSGST("");
    setIGST("");
    setSubTotal("");
    setExtra1("");
    setExtra1Amount("");
    setExtra2("");
    setExtra2Amount("");
    setExtra3("");
    setExtra3Amount("");
    setRoundOff("");
    setTotal("");
    setTotalCopies("");
    setIsPaperPurchase("");
    setRemark("");

    // setRows([
    //   {
    //     BookCode: "",
    //     BookId: "",
    //     Copies: 0,
    //     Rate: 0,
    //     DiscountPercentage: 0,
    //     DiscountAmount: 0,
    //     Amount: 0,
    //   },
    // ]);

    setRows([
      {
        SizeCode: "",
        PaperId: "",
        PaperSizeName: "",
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
  }, [
    rows,
    SubTotal,
    CGST,
    SGST,
    IGST,
    Extra1Amount,
    Extra2Amount,
    Extra3Amount,
    RoundOff,
  ]);

  const [GSTNo, setGSTNo] = useState("");

  const [isLocalGST, setIsLocalGST] = useState(false);

  useEffect(() => {
    setBillAmount(Total);
  }, [Total]);

  const handleAccountChange = async (event, newValue) => {
    const selectedId = newValue ? newValue.value : null;
    setSupplierId(selectedId);

    // 🔹 Reset GST values every time before applying new logic
    setGSTNo("");
    // setSGSTAmount("");
    setSGST("");
    setCGST("");
    // setCGSTAmount("");
    // setIGSTAmount("");
    setIGST("");
    setIsLocalGST(false);

    if (selectedId) {
      try {
        // ------------------------------
        // 1. Fetch address by AccountId (for GST logic)
        // ------------------------------
        const response = await axios.get(
          `https://publication.microtechsolutions.net.in/php/get/getbycolm.php?Table=Address&Colname=AccountId&Colvalue=${selectedId}`,
        );

        if (response.data && response.data.length > 0) {
          const address = response.data[0]; // take first address
          console.log(address, "address of acc id");
          if (address.GSTNo) {
            setGSTNo(address.GSTNo);

            if (address.GSTNo.startsWith("27")) {
              // Maharashtra → SGST + CGST
              setIsLocalGST(true);
              setIGST(0);
              // setIGSTAmount(0);
            } else {
              // Other states → IGST
              setIsLocalGST(false);
              setSGST(0);
              // setSGSTAmount(0);
              setCGST(0);
              // setCGSTAmount(0);
            }
          }
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }
  };

  const handleNewClick = () => {
    resetForm();
    setIsDrawerOpen(true);
    // setRows(rows);
    setIsEditing(false);
    setEditingIndex(-1);
  };

  const [idwiseData, setIdwiseData] = useState("");

  const [isLoading, setIsLoading] = useState(false);

  const handleEdit = () => {
    if (currentRow) {
      console.log("Editing item with ID:", currentRow.original.Id);
      setIdwiseData(currentRow.original.Id);
    }

    setIsLoading(true);
    const paperpurchase = purchases[currentRow.index];

    // Filter purchase details to match the selected PurchaseId
    const paperpurchasedetail = purchaseDetails.filter(
      (detail) => detail.PurchaseId === paperpurchase.Id,
    );

    // console.log(bookpurchasedetail, 'book purchasedetail')
    // Convert date strings to DD-MM-YYYY format
    const convertDateForInput = (dateStr) => {
      if (typeof dateStr === "string" && dateStr.includes("-")) {
        const [year, month, day] = dateStr.split(" ")[0].split("-");
        return `${year}-${month}-${day}`;
      } else {
        toast.error("Invalid date format:", dateStr);
        return ""; // Return an empty string or handle it as needed
      }
    };

    // // Map the details to rows
    // let mappedRows = paperpurchasedetail.map((detail) => ({
    //   PurchaseId: detail.PurchaseId,
    //   BookCode: "", // ✅ add this
    //   PaperId: detail.BookId,
    //   Copies: detail.Copies,
    //   Rate: detail.Rate,
    //   DiscountPercentage: detail.DiscountPercentage,
    //   DiscountAmount: detail.DiscountAmount,
    //   Amount: detail.Amount,
    //   Id: detail.Id, // Include the detail Id in the mapped row for tracking
    // }));

    // // ⭐ No API call needed — match from local paperOptions
    // mappedRows = mappedRows.map((row) => {
    //   const paper = paperOptions.find((b) => b.value === row.PaperId);

    //   return {
    //     ...row,
    //     BookCode: paper?.code || "",
    //     PaperSizeName: paper?.label || "",
    //   };
    // });

    let mappedRows = paperpurchasedetail.map((detail) => ({
      PurchaseId: detail.PurchaseId,
      PaperId: detail.BookId,
      SizeCode: "",
      PaperSizeName: "",
      Copies: detail.Copies,
      Rate: detail.Rate,
      DiscountPercentage: detail.DiscountPercentage,
      DiscountAmount: detail.DiscountAmount,
      Amount: detail.Amount,
      Id: detail.Id,
    }));

    mappedRows = mappedRows.map((row) => {
      const paper = paperOptions.find((p) => p.value === row.PaperId);
      return {
        ...row,
        SizeCode: paper?.code || "",
        PaperSizeName: paper?.label || "",
      };
    });

    const purchaseDate = dayjs(paperpurchase.PurchaseDate?.date);

    const billdate = dayjs(paperpurchase.BillDate?.date);

    // Set the form fields
    setPurchaseNo(paperpurchase.PurchaseNo);
    // setPurchaseDate(purchaseDate);
    setPurchasesafedate(purchaseDate);
    setSupplierId(paperpurchase.SupplierId);
    setBillNo(paperpurchase.BillNo);
    // setBillDate(billdate);
    setBillsafedate(billdate);
    setPurchaseAccountId(paperpurchase.PurchaseAccountId);
    setSalesTaxId(paperpurchase.TaxId);
    setCGST(paperpurchase.CGST);
    setSGST(paperpurchase.SGST);
    setIGST(paperpurchase.IGST);
    setSubTotal(paperpurchase.SubTotal);
    setExtra1(paperpurchase.Extra1);
    setExtra1Amount(paperpurchase.Extra1Amount);
    setExtra2(paperpurchase.Extra2);
    setExtra2Amount(paperpurchase.Extra2Amount);
    setExtra3(paperpurchase.Extra3);
    setExtra3Amount(paperpurchase.Extra3Amount);
    setRoundOff(paperpurchase.RoundOff);
    setTotal(paperpurchase.Total);
    setTotalCopies(paperpurchase.TotalCopies);
    setIsPaperPurchase(paperpurchase.IsPaperPurchase);
    setRemark(paperpurchase.Remark);

    // console.log(bookpurchase, 'book purchase')

    // console.log(BillDate, 'bill date')
    // Set the rows for the table with all the details
    setRows(mappedRows);

    // Set editing state
    setEditingIndex(currentRow.index);
    setIsDrawerOpen(true);
    setIsEditing(true);
    setId(paperpurchase.Id);
    handleMenuClose();
    // Determine which specific detail to edit
    const specificDetail = paperpurchasedetail.find(
      (detail) => detail.Id === currentRow.original.Id,
    );
    if (specificDetail) {
      setPaperpurchasedetailId(specificDetail.Id); // Set the specific detail Id
    }

    fetchPurchasesDetails().then(() => {
      setIsLoading(false); // Stop loading after data is fetched
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
    const url = `https://publication.microtechsolutions.net.in/php/deletetable.php?Id=${deleteId}&Table=Purchaseheader`;

    const urlencoded = new URLSearchParams();
    urlencoded.append("Id", deleteId);
    urlencoded.append("Table", "Purchaseheader");

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
        toast.success("Paper Purchase Deleted Successfully"); // Show success toast
        setIsDeleteDialogOpen(false); // Close delete dialog
        fetchPurchases(); // Refresh vouchers list
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

  const validateForm = () => {
    let formErrors = {};
    let isValid = true;

    // if (!PurchaseNo) {
    //   formErrors.PurchaseNo = "Purchase No  is required.";
    //   isValid = false;
    // }
    if (!purchasesafedate) {
      formErrors.purchasesafedate = "Purchase Date is required.";
      isValid = false;
    }

    if (!SupplierId) {
      formErrors.SupplierId = "Supplier Id is required.";
      isValid = false;
    }

    if (!BillNo) {
      formErrors.BillNo = "Bill No is required.";
      isValid = false;
    }

    if (!billsafedate) {
      formErrors.billsafedate = "Bill date is required.";
      isValid = false;
    }

    if (!PurchaseAccountId) {
      formErrors.PurchaseAccountId = "Purchase acc Id is required.";
      isValid = false;
    }

    if (!AccountId) {
      formErrors.AccountId = "Tax Id is required.";
      isValid = false;
    }

    // if (!CGST) {
    //   formErrors.CGST = "CGST is required.";
    //   isValid = false;
    // }

    // if (!SGST) {
    //   formErrors.SGST = "SGST is required.";
    //   isValid = false;
    // }

    // if (!IGST) {
    //   formErrors.IGST = "IGST is required.";
    //   isValid = false;
    // }

    if (!SubTotal) {
      formErrors.SubTotal = "Sub total is required.";
      isValid = false;
    }

    // if (!Extra1) {
    //   formErrors.Extra1 = "Extra1 is required.";
    //   isValid = false;
    // }

    // if (!Extra1Amount) {
    //   formErrors.Extra1Amount = "Extra1 Amount is required.";
    //   isValid = false;
    // }
    // if (!Extra2) {
    //   formErrors.Extra2 = "Extra2 is required.";
    //   isValid = false;
    // }
    // if (!Extra2Amount) {
    //   formErrors.Extra2Amount = "Extra2 Amount is required.";
    //   isValid = false;
    // }

    // if (!Extra3) {
    //   formErrors.Extra3 = "Extra3 is required.";
    //   isValid = false;
    // }
    // if (!Extra3Amount) {
    //   formErrors.Extra3Amount = "Extra3 Amount is required.";
    //   isValid = false;
    // }

    if (!RoundOff) {
      formErrors.RoundOff = "Round off is required.";
      isValid = false;
    }
    if (!Total) {
      formErrors.Total = "Total is required.";
      isValid = false;
    }

    if (!TotalCopies) {
      formErrors.TotalCopies = "Total Copies is required.";
      isValid = false;
    }
    if (!Remark) {
      formErrors.Remark = "Remark is required.";
      isValid = false;
    }

    // if (!IsPaperPurchase) {
    //   formErrors.IsPaperPurchase = "IsPaperPurchase is required.";
    //   isValid = false;
    // }

    setErrors(formErrors);
    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formattedPurchaseDate = dayjs(purchasesafedate).format("YYYY-MM-DD");
    const formattedBillDate = dayjs(billsafedate).format("YYYY-MM-DD");

    const purchaseData = {
      Id: isEditing ? id : "", // Include the Id for updating, null for new records
      // PurchaseNo: PurchaseNo,
      PurchaseDate: formattedPurchaseDate,
      SupplierId: SupplierId,
      BillNo: BillNo,
      BillDate: formattedBillDate,
      PurchaseAccountId: PurchaseAccountId,
      TaxId: SalesTaxId,
      CGST: CGST || 0,
      SGST: SGST || 0,
      IGST: IGST || 0,

      SubTotal: SubTotal || 0,
      RoundOff: RoundOff || 0,
      Extra1: 0,
      Extra1Amount: 0,
      Extra2: 0,
      Extra2Amount: 0,
      Extra3: 0,
      Extra3Amount: 0,
      Total: Total,
      TotalCopies: TotalCopies || 0,
      IsPaperPurchase: 1,
      Remark: Remark,
      PurchaseTypeId: 0, // Paper Purchase
      CreatedBy: !isEditing ? userId : undefined,
      UpdatedBy: isEditing ? userId : undefined,
    };

    try {
      const purchaseUrl = isEditing
        ? "https://publication.microtechsolutions.net.in/php/Purchaseupdate.php"
        : "https://publication.microtechsolutions.net.in/php/Purchasepost.php";

      // Submit purchase header data
      const response = await axios.post(
        purchaseUrl,
        // qs.stringify(purchaseData),
        purchaseData,
        {
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
        },
      );

      const purchaseId = isEditing ? id : parseInt(response.data.Id, 10);

      for (const row of rows) {
        const rowData = {
          PurchaseId: purchaseId,
          SerialNo: rows.indexOf(row) + 1,
          // BookCode: parseFloat(row.BookCode, 10),
          BookId: parseInt(row.PaperId, 10),
          Copies: parseInt(row.Copies, 10),
          Rate: parseFloat(row.Rate, 0),
          DiscountPercentage: parseFloat(row.DiscountPercentage, 0),
          DiscountAmount: parseFloat(row.DiscountAmount, 0),
          Amount: parseFloat(row.Amount, 0),
          Id: row.Id,

          CreatedBy: row.Id ? undefined : userId,
          UpdatedBy: row.Id ? userId : undefined,
        };

        // if (isEditing && row.Id) {
        //   // If editing, include PurchasedetailId for the update
        //   rowData.Id = row.PurchaseId;
        // }

        const purchasedetailUrl =
          isEditing && row.Id
            ? "https://publication.microtechsolutions.net.in/php/Purchasedetailupdate.php"
            : "https://publication.microtechsolutions.net.in/php/Purchasedetailpost.php";

        await axios.post(purchasedetailUrl, qs.stringify(rowData), {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
        });
      }

      fetchPurchases();
      fetchPurchasesDetails();
      setIsDrawerOpen(false);
      toast.success(
        isEditing
          ? "Paper Purchase & Paper Purchase Details updated successfully!"
          : "Paper Purchase & Paper Purchase Details added successfully!",
      );
      resetForm(); // Reset the form fields after successful submission
    } catch (error) {
      // console.error("Error saving record:", error);
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
        accessorKey: "PurchaseNo",
        header: "Purchase No",
        size: 50,
      },
      {
        accessorKey: "PurchaseDate.date",
        header: "Purchase Date",
        size: 50,
        Cell: ({ cell }) => {
          // Using moment.js to format the date
          const date = moment(cell.getValue()).format("DD-MM-YYYY");
          return <span>{date}</span>;
        },
      },
      {
        accessorKey: "BillNo",
        header: "Bill No",
        size: 50,
      },
      {
        accessorKey: "BillDate.date",
        header: "Bill Date",
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
    [purchases],
  );

  const table = useMaterialReactTable({
    columns,
    data: purchases,
    enablePagination: true, // ✅ default is true, can be omitted
    muiTableHeadCellProps: {
      style: {
        backgroundColor: "#E9ECEF",
        color: "black",
        fontSize: "16px",
      },
    },
  });
  return (
    <div className="paperpurchase-container">
      <h1>Paper Purchase</h1>

      <div className="paperpurchasetable-master">
        <div className="paperpurchasetable1-master">
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
          <div className="paperpurchasetable-container">
            <Box mt={2}>
              <MaterialReactTable table={table} />
              <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleMenuClose}>
                <MenuItem onClick={handleEdit}>Edit</MenuItem>
                <MenuItem onClick={handleDelete}>Delete</MenuItem>

                {/* <MenuItem onClick={handlePrint}>Print</MenuItem>  */}
              </Menu>
            </Box>{" "}
          </div>
          {/* Pagination Controls */}
          {/* <div
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
          </div>{" "} */}
        </div>

        <Drawer
          anchor="right"
          open={isDrawerOpen}
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
                {isEditing ? "Edit Paper Purchase" : "Create Paper Purchase"}
              </b>
            </Typography>{" "}
            <CloseIcon sx={{ cursor: "pointer" }} onClick={handleDrawerClose} />
          </Box>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: 1,
              ml: 2,
            }}>
            <form>
              <div className="paperpurchase-form">
                <div>
                  <label className="paperpurchase-label">PV No</label>
                  <div>
                    <input
                      type="text"
                      id="PurchaseNo"
                      name="PurchaseNo"
                      value={PurchaseNo}
                      onChange={(e) => setPurchaseNo(e.target.value)}
                      style={{ background: "#f5f5f5", width: "120px" }}
                      className="paperpurchase-control"
                      placeholder="Auto-Incremented"
                      readOnly
                    />
                  </div>
                </div>

                <div>
                  <label className="paperpurchase-label">Supplier</label>
                  <div>
                    <Autocomplete
                      options={accountOptions}
                      value={
                        accountOptions.find(
                          (option) => option.value === SupplierId,
                        ) || null
                      }
                      onChange={handleAccountChange}
                      getOptionLabel={(option) => option.label} // Display only label in dropdown
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          placeholder="Select Supplier"
                          size="small"
                          margin="none"
                          fullWidth
                        />
                      )}
                      sx={{ mt: 1.25, mb: 0.625, width: 300 }} // Equivalent to 10px and 5px
                    />
                  </div>
                </div>
              </div>

              <div className="paperpurchase-form">
                <div>
                  <label className="paperpurchase-label">Purchase Date</label>
                  <div>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                      <DatePicker
                        value={purchasesafedate}
                        onChange={handleDateChange1}
                        format="DD-MM-YYYY"
                        slotProps={{
                          textField: {
                            size: "small",
                            fullWidth: true,
                            error: !!purchaseerror,
                            helperText: purchaseerror,
                          },
                        }}
                        sx={{
                          marginTop: "10px",
                          marginBottom: "5px",
                          width: "180px",
                        }}
                      />
                    </LocalizationProvider>
                  </div>
                </div>

                <div>
                  <label className="paperpurchase-label">Bill No</label>
                  <div>
                    <input
                      type="text"
                      id="BillNo"
                      name="BillNo"
                      value={BillNo}
                      onChange={(e) => setBillNo(e.target.value)}
                      maxLength={15}
                      style={{ width: "100px" }}
                      className="paperpurchase-control"
                      placeholder="Enter Bill No"
                    />
                  </div>
                </div>

                <div>
                  <label className="paperpurchase-label">Bill Date</label>
                  <div>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                      <DatePicker
                        value={billsafedate}
                        onChange={handleDateChange2}
                        format="DD-MM-YYYY"
                        slotProps={{
                          textField: {
                            size: "small",
                            fullWidth: true,
                            error: !!billerror,
                            helperText: billerror,
                          },
                        }}
                        sx={{
                          marginTop: "10px",
                          marginBottom: "5px",
                          width: "180px",
                        }}
                      />
                    </LocalizationProvider>
                  </div>
                </div>

                <div>
                  <label className="paperpurchase-label">Bill Amount</label>
                  <div>
                    <input
                      type="text"
                      id="BillAmount"
                      name="BillAmount"
                      value={BillAmount}
                      onChange={(e) => setBillAmount(e.target.value)}
                      maxLength={15}
                      style={{ width: "100px" }}
                      className="paperpurchase-control"
                      placeholder="Enter Bill Amount"
                      readOnly
                    />
                  </div>
                </div>
              </div>
            </form>

            <div className="paperpurchase-table">
              <table>
                <thead>
                  <tr>
                    <th>Serial No</th>
                    <th>Paper Code</th>
                    <th>Paper Name</th>
                    <th>Quantity</th>
                    <th>Rate</th>
                    <th>Discount %</th>

                    <th>Amount </th>
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
                        <td
                          onClick={() => {
                            setSelectedRowIndex(index);
                            setOpenPaperDialog(true);
                          }}
                          style={{
                            cursor: "pointer",
                            color: "#1976d2",
                            textDecoration: "underline",
                          }}>
                          {row.SizeCode || row.BookCode || "Select Size Code"}
                        </td>

                        <td>
                          <input
                            type="text"
                            value={row.PaperSizeName || ""}
                            readOnly
                            placeholder="PaperSizeName"
                            style={{ width: "380px" }}
                            className="paperpurchase-control"
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
                            className="paperpurchase-control"
                            placeholder="Copies"
                          />
                        </td>

                        <td>
                          <input
                            type="number"
                            value={row.Rate}
                            onChange={(e) =>
                              handleInputChange(index, "Rate", e.target.value)
                            }
                            style={{
                              width: "65px",
                            }}
                            className="paperpurchase-control"
                            placeholder="Rate"
                          />
                        </td>

                        <td>
                          <input
                            type="number"
                            value={row.DiscountPercentage || ""}
                            onChange={(e) =>
                              handleInputChange(
                                index,
                                "DiscountPercentage",
                                e.target.value,
                              )
                            }
                            style={{ width: "80px" }}
                            className="paperpurchase-control"
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
                            className="paperpurchase-control"
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

            <div className="paperpurchase-footer">
              {/* LEFT SIDE */}
              <div className="pp-left">
                <div className="pp-field">
                  <label>Remarks</label>
                  <textarea
                    value={Remark}
                    onChange={(e) => setRemark(e.target.value)}
                    rows={4}
                    placeholder="Enter Remarks"
                  />
                </div>
                <div className="paperpurchase-form">
                  <div className="pp-field">
                    <label>Purchase Account</label>
                    <Autocomplete
                      options={accountOptions}
                      value={
                        accountOptions.find(
                          (option) => option.value === PurchaseAccountId,
                        ) || null
                      }
                      onChange={(e, v) =>
                        setPurchaseAccountId(v ? v.value : null)
                      }
                      renderInput={(params) => (
                        <TextField {...params} size="small" />
                      )}
                      sx={{ mt: 1.25, mb: 0.625, width: 300 }} // Equivalent to 10px and 5px
                    />
                  </div>
                  <div className="pp-field">
                    <label>Sales Tax HD</label>
                    <Autocomplete
                      options={salesTaxOptions}
                      value={
                        salesTaxOptions.find(
                          (opt) => opt.taxId === SalesTaxId,
                        ) || null
                      }
                      onChange={(e, v) => setSalesTaxId(v ? v.taxId : null)}
                      getOptionLabel={(option) => option.label}
                      renderInput={(params) => (
                        <TextField {...params} size="small" />
                      )}
                      sx={{ mt: 1.25, mb: 0.625, width: 300 }}
                    />
                  </div>
                </div>
              </div>

              {/* RIGHT SIDE */}
              <div className="pp-right">
                <div className="total-row">
                  <span>Total Copies</span>
                  <input
                    style={{ fontWeight: "700" }}
                    value={TotalCopies}
                    readOnly
                  />
                </div>

                <div className="total-row">
                  <span>SubTotal</span>
                  <input
                    style={{ fontWeight: "700" }}
                    value={SubTotal}
                    readOnly
                  />
                </div>
                <div className="total-row">
                  <span>CGST Amt</span>
                  <input
                    type="number"
                    value={CGST}
                    onChange={(e) => setCGST(e.target.value)}
                    readOnly={!isLocalGST} // 🔒 Readonly if NOT local GST
                    style={{ background: !isLocalGST ? "#f5f5f5" : "white" }}
                  />
                </div>

                <div className="total-row">
                  <span>SGST Amt</span>
                  <input
                    type="number"
                    value={SGST}
                    onChange={(e) => setSGST(e.target.value)}
                    readOnly={!isLocalGST} // 🔒 Readonly if NOT local GST
                    style={{ background: !isLocalGST ? "#f5f5f5" : "white" }}
                  />
                </div>

                <div className="total-row">
                  <span>IGST Amt</span>
                  <input
                    type="number"
                    value={IGST}
                    onChange={(e) => setIGST(e.target.value)}
                    readOnly={isLocalGST} // 🔒 Readonly if local GST
                    style={{ background: !isLocalGST ? "#f5f5f5" : "white" }}
                  />
                </div>

                <div className="total-row">
                  <span>Round Off</span>
                  <input value={RoundOff} />
                </div>

                <div className="total-row total-highlight">
                  <span>Total</span>
                  <input value={Total} readOnly />
                </div>
              </div>
            </div>
          </Box>
          <div className="paperpurchase-btn-container">
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
              onClick={() => setIsDrawerOpen(false)}
              style={{
                background: "red",
                color: "white",
              }}>
              Cancel
            </Button>
          </div>
        </Drawer>

        <Dialog
          open={openPaperDialog}
          onClose={() => setOpenPaperDialog(false)}
          maxWidth="md"
          fullWidth>
          <DialogTitle>Paper Size Master</DialogTitle>

          <DialogContent>
            <table className="reference-table">
              <thead>
                <tr>
                  <th>Paper Code</th>
                  <th>Paper Size</th>
                  <th>Unit</th>
                  <th>Action</th>
                </tr>
              </thead>

              <tbody>
                {paperOptions.map((paper) => (
                  <tr key={paper.value}>
                    <td>{paper.code}</td>
                    <td>{paper.label}</td>
                    <td>{paper.unit}</td>
                    <td>
                      <Button
                        size="small"
                        variant="contained"
                        onClick={() => handlePaperSelect(paper)}>
                        Select
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </DialogContent>

          <DialogActions>
            <Button onClick={() => setOpenPaperDialog(false)}>Close</Button>
          </DialogActions>
        </Dialog>

        {/* Confirmation Dialog for Delete */}
        <Dialog open={isDeleteDialogOpen} onClose={cancelDelete}>
          <DialogTitle style={{ color: "navy", fontWeight: "600" }}>
            Confirm Deletion
          </DialogTitle>
          <DialogContent>
            Are you sure you want to delete this{" "}
            <b style={{ color: "red" }}>
              <u>Paper Purchase</u>
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
export default Paperpurchase;
