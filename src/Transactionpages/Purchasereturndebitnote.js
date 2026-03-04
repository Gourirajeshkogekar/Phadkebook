import React, {
  useState,
  useMemo,
  useEffect,
  useSyncExternalStore,
} from "react";
import "./Purchasereturndebitnote.css";
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
import { set } from "date-fns";

function Purchasereturndebitnote() {
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

    fetchPurchasereturns();
  }, []);

  useEffect(() => {
    const today = new Date();
    const formattedToday = today.toISOString().split("T")[0];
    setPurchaseReturnDate(formattedToday); // set today's date as default
  }, []);

  const getToday = () => {
    return new Date().toISOString().split("T")[0];
  };

  const getMaxDate = () => {
    const today = new Date();
    today.setDate(today.getDate() + 2); // add 2 days
    return today.toISOString().split("T")[0];
  };

  const [pageIndex, setPageIndex] = useState(1); // Current page
  const [totalPages, setTotalPages] = useState(1);
  const [PurchaseReturnNo, setPurchaseReturnNo] = useState(null);
  const [PurchaseReturnDate, setPurchaseReturnDate] = useState(dayjs());
  const [RefrenceNo, setRefrenceNo] = useState("");
  const [SupplierId, setSupplierId] = useState("");
  const [AccountId, setAccountId] = useState("");
  const [CreditAccountId, setCreditAccountId] = useState("");

  const [SubTotal, setSubTotal] = useState("");
  const [Extra1, setExtra1] = useState("");
  const [Extra1Percentage, setExtr1Percentage] = useState("");
  const [Extra1Amount, setExtra1Amount] = useState("");
  const [Extra2, setExtra2] = useState("");
  const [Extra2Percentage, setExtr2Percentage] = useState("");

  const [Extra2Amount, setExtra2Amount] = useState("");
  const [Total, setTotal] = useState("");
  const [TotalCopies, setTotalCopies] = useState("");

  const [Remark, setRemark] = useState("");

  const [editingIndex, setEditingIndex] = useState(-1);
  const [id, setId] = useState("");
  const [anchorEl, setAnchorEl] = useState(null);

  const [purchasereturndetailId, setPurchasereturndetailId] = useState("");
  const [errors, setErrors] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [purchasereturns, setPurchasereturns] = useState([]);
  const [purchasereturndetails, setPurchasereturnDetails] = useState([]);
  const theme = useTheme();

  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));

  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const handleDrawerClose = () => {
    setIsDrawerOpen(false);
  };
  const [currentRow, setCurrentRow] = useState(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [deleteIndex, setDeleteIndex] = useState(null);
  const [deleteId, setDeleteId] = useState(null);

  const [adjustments, setAdjustments] = useState([
    {
      type: "ADD",
      particular: "",
      percentage: "",
      amount: "",
      isManual: false, // to detect manual amount edit
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
    const base = parseFloat(SubTotal || 0);

    if (!base) return;

    const updated = adjustments.map((row) => {
      if (row.percentage && !row.isManual && !isNaN(row.percentage)) {
        const amt = (base * parseFloat(row.percentage)) / 100;
        return { ...row, amount: amt.toFixed(2) };
      }
      return row;
    });

    setAdjustments(updated);
  }, [SubTotal, adjustments.map((a) => a.percentage).join(",")]);

  const handleTypeChange = (index, value) => {
    const updated = [...adjustments];
    updated[index].type = value;

    if (!updated[index].isManual && updated[index].percentage) {
      const base = parseFloat(SubTotal || 0);
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

  const totalAmount = parseFloat(SubTotal || 0) + adjustmentTotal;

  const handleMenuOpen = (event, row) => {
    setAnchorEl(event.currentTarget);
    setCurrentRow(row);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  //Dropdown for ID's
  const [bookOptions, setBookOptions] = useState([]);
  const [accountOptions, setAccountOptions] = useState([]);
  const [rows, setRows] = useState([
    {
      BookId: "", // Default value for the first row
      Copies: 0,
      Rate: 0,
      DiscountPercentage: 0,
      DiscountAmount: 0,
      Amount: 0,
    },
  ]);

  useEffect(() => {
    // fetchPurchasereturns();
    fetchPurchasereturnDetails();
    fetchBooks();
    fetchAccounts();
  }, []);

  useEffect(() => {
    fetchPurchasereturns();
    console.log("this function is called");
  }, [pageIndex]); // Fetch data when page changes

  const fetchPurchasereturns = async () => {
    try {
      const response = await axios.get(
        `https://publication.microtechsolutions.net.in/php/get/gettblpage.php?Table=PurchaseReturnHeader&PageNo=${pageIndex}`
      );
      // setSellschallans(response.data);
      console.log(response.data, "response of purchase return header");

      setPurchasereturns(response.data.data);
      setTotalPages(response.data.total_pages);
    } catch (error) {
      // toast.error("Error fetching sells challans:", error);
    }
  };

  // Fetch the purchase details
  const fetchPurchasereturnDetails = async () => {
    try {
      const response = await axios.get(
        "https://publication.microtechsolutions.net.in/php/Purchasereturndetailget.php"
      );
      // console.log(response.data, 'response of purchase return details')
      setPurchasereturnDetails(response.data);
    } catch (error) {
      // toast.error("Error fetching Purchase return details:", error);
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
        price: book.BookRate,
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

  // Calculation functions
  const calculateTotals = () => {
    let totalCopies = 0;
    let subtotal = 0;
    let total = 0;

    rows.forEach((row) => {
      totalCopies += Number(row.Copies) || 0;
      subtotal += Number(row.Amount) || 0; // Subtotal should be sum of row amounts
    });

    // Add extra amounts if present
    const extra1 = parseFloat(Extra1Amount) || 0;
    const extra2 = parseFloat(Extra2Amount) || 0;

    total = subtotal + extra1 + extra2;

    setTotalCopies(totalCopies);
    setSubTotal(subtotal.toFixed(2));
    setTotal(total.toFixed(2));
  };

  const [purchasesafedate, setPurchasesafedate] = useState(dayjs());
  const [purchaseerror, setPurchaseerror] = useState("");
  const [receiveddateerror, setReceiveddateerror] = useState("");
  const [safedate, setSafedate] = useState(dayjs());

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

  const handleInputChange = (index, field, value) => {
    const updatedRows = [...rows];

    updatedRows[index][field] = value;

    // If BookId is changed, update Rate from bookOptions
    if (field === "BookId") {
      const selectedBook = bookOptions.find((book) => book.value === value);
      updatedRows[index].Rate = selectedBook?.price || 0;
    }

    // Extract necessary values
    const copies = parseFloat(updatedRows[index].Copies) || 0;
    const rate = parseFloat(updatedRows[index].Rate) || 0;
    const discountPercentage =
      parseFloat(updatedRows[index].DiscountPercentage) || 0;

    // Recalculate Amount and DiscountAmount
    const amountBeforeDiscount = copies * rate;
    const discountAmount = (amountBeforeDiscount * discountPercentage) / 100;
    const finalAmount = amountBeforeDiscount - discountAmount;

    updatedRows[index].DiscountAmount = discountAmount;
    updatedRows[index].Amount = finalAmount;

    setRows(updatedRows);
    calculateTotals();
  };

  const handleAddRow = () => {
    setRows([
      ...rows,
      {
        BookId: "", // This will be empty for new rows
        SerialNo: "",
        Copies: "",
        Rate: "",
        DiscountPercentage: "",
        DiscountAmount: "",
        Amount: "",
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
    setIsDeleteDialogOpen(true);
    handleMenuClose();
  };

  const confirmDelete = () => {
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/x-www-form-urlencoded");

    // Prepare URL with dynamic parameters
    const url = `https://publication.microtechsolutions.net.in/php/deletetable.php?Id=${deleteId}&Table=PurchaseReturnHeader`;

    const urlencoded = new URLSearchParams();
    urlencoded.append("Id", deleteId);
    urlencoded.append("Table", "PurchaseReturnHeader");

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
        toast.success("Purchase return debit note Deleted Successfully"); // Show success toast
        setIsDeleteDialogOpen(false); // Close delete dialog
        fetchPurchasereturns(); // Refresh vouchers list
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

  const resetForm = () => {
    setPurchaseReturnNo("");
    // setPurchaseReturnDate("");
    setPurchasesafedate(dayjs());
    setPurchaseerror("");
    setRefrenceNo("");
    setSupplierId("");
    setAccountId("");
    setSubTotal("");

    setTotal("");
    setTotalCopies("");
    setRemark("");
    setAdjustments([
      {
        type: "ADD",
        particular: "",
        percentage: "",
        amount: "",
        isManual: false, // to detect manual amount edit
      },
    ]);
    setRows([
      {
        BookId: "",
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
  }, [rows, adjustments]);

  const handleNewClick = () => {
    resetForm();
    setIsDrawerOpen(true);
    setIsEditing(false);
    setEditingIndex(-1);
  };

  const [isLoading, setIsLoading] = useState(false);

  const [idwiseData, setIdwiseData] = useState("");

  const buildAdjustmentsForEdit = (data) => {
    const list = [];

    // ----- Other Charge 1 -----
    if (
      data.Extra1 ||
      Number(data.Extra1Amount) ||
      Number(data.Extra1Percentage)
    ) {
      list.push({
        type: Number(data.Extra1Amount) < 0 ? "LESS" : "ADD",
        particular: data.Extra1 || "",
        percentage: data.Extra1Percentage || "",
        amount: Math.abs(Number(data.Extra1Amount || 0)),
        isManual: true,
      });
    }

    // ----- Other Charge 2 -----
    if (
      data.Extra2 ||
      Number(data.Extra2Amount) ||
      Number(data.Extra2Percentage)
    ) {
      list.push({
        type: Number(data.Extra2Amount) < 0 ? "LESS" : "ADD",
        particular: data.Extra2 || "",
        percentage: data.Extra2Percentage || "",
        amount: Math.abs(Number(data.Extra2Amount || 0)),
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
      console.log("Editing item with ID:", currentRow.original.Id);
      setIdwiseData(currentRow.original.Id);
    }
    setIsLoading(true);

    const purchasereturn = purchasereturns[currentRow.index];

    console.log(purchasereturn, "purchasereturn to edit");
    // Filter purchase details to match the selected PurchaseId
    const purchasereturndetail = purchasereturndetails.filter(
      (detail) => detail.PurchaseReturnId === purchasereturn.Id
    );

    // Map the details to rows
    let mappedRows = purchasereturndetail.map((detail) => ({
      // PurchaseReturnId: detail.PurchaseReturnId,

      PurchaseReturnId: detail.PurchaseReturnId,
      BookId: detail.BookId,

      Copies: detail.Copies,
      Rate: detail.Rate,
      DiscountPercentage: detail.DiscountPercentage,
      DiscountAmount: detail.DiscountAmount,
      Amount: detail.Amount,
      Id: detail.Id, // Include the detail Id in the mapped row for tracking
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

    const convertDateForInput = (dateStr) => {
      if (typeof dateStr === "string" && dateStr.includes("-")) {
        const [year, month, day] = dateStr.split(" ")[0].split("-");
        return `${year}-${month}-${day}`;
      } else {
        console.error("Invalid date format:", dateStr);
        return ""; // Return an empty string or handle it as needed
      }
    };

    const purchasereturnDate = convertDateForInput(
      purchasereturn.PurchaseReturnDate.date
    );

    setPurchaseReturnNo(purchasereturn.PurchaseReturnNo);
    setPurchaseReturnDate(purchasereturnDate);
    setRefrenceNo(purchasereturn.RefrenceNo);
    setSupplierId(purchasereturn.SupplierId);
    setAccountId(purchasereturn.AccountId);
    setSubTotal(purchasereturn.SubTotal);

    setAdjustments(buildAdjustmentsForEdit(purchasereturn));

    setTotal(purchasereturn.Total);
    setTotalCopies(purchasereturn.TotalCopies);
    setRemark(purchasereturn.Remark);

    setRows(mappedRows);

    // Set editing state
    setEditingIndex(currentRow.index);
    setIsDrawerOpen(true);
    setIsEditing(true);
    setId(purchasereturn.Id);
    handleMenuClose();
    // Determine which specific detail to edit
    const specificDetail = purchasereturndetail.find(
      (detail) => detail.Id === currentRow.original.Id
    );
    if (specificDetail) {
      setPurchasereturndetailId(specificDetail.Id); // Set the specific detail Id
    }

    fetchPurchasereturnDetails().then(() => {
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
      updatedRows[rowIndex].Rate = "";
      updatedRows[rowIndex].BookRate = "";
      updatedRows[rowIndex].BookId = "";
      updatedRows[rowIndex].Copies = "";
      updatedRows[rowIndex].Amount = "";
      updatedRows[rowIndex].DiscountPercentage = "";
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
            Rate: book.BookRate || 0,
            BookId: book.Id || "", // This is important
          };
          return updatedRows;
        });

        // // Now call the last API with the fetched BookId
        // if (AccountId && book.Id) {
        //   fetchBookHistory(rowIndex, book.Id, AccountId);
        // }
      } else {
        // ❌ Now this WILL fire correctly
        toast.error("Invalid Book Code");
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to fetch Book");
    }
  };

  const validateForm = () => {
    let formErrors = {};
    let isValid = true;

    if (!purchasesafedate) {
      formErrors.purchasesafedate = "Purchase Return Date is required.";
      isValid = false;
    }

    if (!RefrenceNo) {
      formErrors.RefrenceNo = "Reference No is required.";
      isValid = false;
    }
    if (!AccountId) {
      formErrors.AccountId = "Account Id is required.";
      isValid = false;
    }
    if (!SupplierId) {
      formErrors.SupplierId = "Supplier Id is required.";
      isValid = false;
    }

    if (!SubTotal) {
      formErrors.SubTotal = "Sub Total  is required.";
      isValid = false;
    }
    if (!Extra1) {
      formErrors.Extra1 = "Extra1 is required.";
      isValid = false;
    }

    if (!Extra1Amount) {
      formErrors.Extra1Amount = "Extra1 Amount is required.";
      isValid = false;
    }
    if (!Extra2) {
      formErrors.Extra2 = "Extra2 is required.";
      isValid = false;
    }
    if (!Extra2Amount) {
      formErrors.Extra2Amount = "Extra2 Amount is required.";
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

    setErrors(formErrors);
    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // if (!validateForm()) return;

    if (
      !purchasesafedate ||
      !dayjs(purchasesafedate).isValid() ||
      purchaseerror
    ) {
      toast.error("Please correct all the date fields before submitting.");
      return;
    }

    const formattedPurchaseReturnDate =
      moment(purchasesafedate).format("YYYY-MM-DD");

    const purchasereturnData = {
      Id: isEditing ? id : "", // Include the Id for updating, null for new records
      PurchaseReturnNo: PurchaseReturnNo,
      PurchaseReturnDate: formattedPurchaseReturnDate,
      RefrenceNo: RefrenceNo,
      SupplierId: SupplierId,
      AccountId: AccountId,
      SubTotal: SubTotal,
      Extra1: firstAdj.particular || "",
      Extra1Percentage: firstAdj.percentage || "",
      Extra1Amount: Number(firstAdj.amount) || 0,
      Extra2: secondAdj.particular || "",
      Extra2Percentage: secondAdj.percentage || "",
      Extra2Amount: Number(secondAdj.amount) || 0,
      Total: Total,
      TotalCopies: TotalCopies,
      Remark: Remark,
      CreatedBy: !isEditing ? userId : undefined,
      UpdatedBy: isEditing ? userId : undefined,
    };

    try {
      const purchasereturnUrl = isEditing
        ? "https://publication.microtechsolutions.net.in/php/Purchasereturnheaderupdate.php"
        : "https://publication.microtechsolutions.net.in/php/Purchasereturnheaderpost.php";

      // Submit purchase header data
      const response = await axios.post(
        purchasereturnUrl,
        qs.stringify(purchasereturnData),
        {
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
        }
      );

      // const purchasereturnId = isEditing ? id : parseInt(response.data.newId, 10);
      const purchasereturnId = isEditing ? id : parseInt(response.data.Id, 10);

      for (const row of rows) {
        const rowData = {
          PurchaseReturnId: purchasereturnId,
          SerialNo: rows.indexOf(row) + 1,
          BookId: parseInt(row.BookId, 10),
          Copies: parseInt(row.Copies, 10),
          Rate: parseFloat(row.Rate),
          DiscountPercentage: parseFloat(row.DiscountPercentage),
          DiscountAmount: parseFloat(row.DiscountAmount),
          Amount: parseFloat(row.Amount),
          Id: row.Id,
          CreatedBy: row.Id ? undefined : userId,
          UpdatedBy: row.Id ? userId : undefined,
        };

        const purchasereturndetailUrl =
          isEditing && row.Id
            ? "https://publication.microtechsolutions.net.in/php/Purchasereturndetailupdate.php"
            : "https://publication.microtechsolutions.net.in/php/Purchasereturndetailpost.php";

        await axios.post(purchasereturndetailUrl, qs.stringify(rowData), {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
        });
      }

      fetchPurchasereturns();
      fetchPurchasereturnDetails();
      setIsDrawerOpen(false);
      toast.success(
        isEditing
          ? "Purchase return & Purchase Return Details updated successfully!"
          : "Purchase return & Purchase Return Details added successfully!"
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
        accessorKey: "PurchaseReturnNo",
        header: "Purchase No",
        size: 50,
      },
      {
        accessorKey: "PurchaseReturnDate.date",
        header: "Purchase Return Date",
        size: 50,
        Cell: ({ cell }) => {
          // Using moment.js to format the date
          const date = moment(cell.getValue()).format("DD-MM-YYYY");
          return <span>{date}</span>;
        },
      },

      {
        accessorKey: "Total",
        header: "Total",
        size: 50,
      },
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
    [purchasereturns]
  );

  const table = useMaterialReactTable({
    columns,
    data: purchasereturns,
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
    <div className="preturn-container">
      <h1>Purchase Return Debit Note</h1>

      <div className="preturntable-master">
        <div className="preturntable1-master">
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
          <div className="preturntable-container">
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
          </div>{" "}
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
                  ? "Edit Purchase Return Debit note"
                  : "Create Purchase Return Debit note"}
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
                  value={PurchaseReturnNo}
                  onChange={(e) => setPurchaseReturnNo(e.target.value)}
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
                  value={RefrenceNo}
                  onChange={(e) => setRefrenceNo(e.target.value)}
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
                      (option) => option.value === SupplierId
                    ) || null
                  }
                  onChange={(event, newValue) =>
                    setSupplierId(newValue ? newValue.value : null)
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
                  Credit Account
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
                      placeholder="Select Credit acc"
                      size="small"
                      margin="none"
                    />
                  )}
                />
              </Box>
            </Box>

            <div className="preturn-table">
              <table>
                <thead>
                  <tr>
                    <th>Serial No</th>
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
                              className="preturn-control"
                            />
                          </td>
                          <td>
                            <input
                              type="text"
                              value={row.BookName || row.BookNameMarathi || ""}
                              readOnly
                              placeholder="Book Name / Book Name Marathi"
                              style={{ width: "400px" }}
                              className="preturn-control"
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
                              className="preturn-control"
                              placeholder="Copies"
                            />
                          </td>
                          <td>
                            <input
                              type="text"
                              value={row.Rate || row.BookRate || ""}
                              readOnly
                              placeholder="Rate"
                              style={{ width: "100px" }}
                              className="preturn-control"
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
                                  e.target.value
                                )
                              }
                              style={{ width: "80px" }}
                              className="preturn-control"
                              placeholder="Discount Percentage"
                            />
                          </td>

                          <td>
                            <input
                              type="number"
                              value={row.Amount || ""}
                              readOnly
                              style={{ width: "100px" }}
                              placeholder="Amount"
                              className="preturn-control"
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
                    <td style={{ fontWeight: "bold", paddingLeft: "10px" }}>
                      {TotalCopies}
                    </td>
                    <td colSpan="2"></td>
                    <td style={{ fontWeight: "bold" }}>{SubTotal}</td>
                    <td></td>
                  </tr>
                </tbody>
              </table>
            </div>

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
            <Box mt={1} display="flex" justifyContent="flex-end" mr={15}>
              <Box>
                <Typography variant="body2" fontWeight="bold">
                  Total Amount
                </Typography>
                <TextField
                  type="number"
                  value={totalAmount}
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

          <div className="preturn-btn-container">
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

        <Dialog open={isDeleteDialogOpen} onClose={cancelDelete}>
          <DialogTitle style={{ color: "navy", fontWeight: "600" }}>
            Confirm Deletion
          </DialogTitle>
          <DialogContent>
            Are you sure you want to delete this{" "}
            <b style={{ color: "red" }}>
              <u>Purchase return Debit note</u>
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
export default Purchasereturndebitnote;
