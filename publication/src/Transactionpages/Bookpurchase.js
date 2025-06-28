import React, {
  useState,
  useMemo,
  useEffect,
  useSyncExternalStore,
} from "react";
import "./Bookpurchase.css";
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

function Bookpurchase() {
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
  const [PurchaseAccountId, setPurchaseAccountId] = useState("");
  const [TaxId, setTaxId] = useState("");
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
  const [IsPaperPurchase, setIsPaperPurchase] = useState("false");
  const [Remark, setRemark] = useState("");

  const [currentRow, setCurrentRow] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);

  const handleMenuOpen = (event, row) => {
    setAnchorEl(event.currentTarget);
    setCurrentRow(row);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const [editingIndex, setEditingIndex] = useState(-1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [id, setId] = useState("");

  const [purchasedetailId, setPurchasedetailId] = useState("");
  const [errors, setErrors] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [purchases, setPurchases] = useState([]);
  const [purchaseDetails, setPurchaseDetails] = useState([]);

  //Dropdown for ID's

  const [bookOptions, setBookOptions] = useState([]);
  const [tdsOptions, setTdsOptions] = useState([]);
  const [accountOptions, setAccountOptions] = useState([]);

  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [deleteIndex, setDeleteIndex] = useState(null);
  const [deleteId, setDeleteId] = useState(null);

  const [rows, setRows] = useState([
    {
      BookCode: "",
      BookId: "", // Default value for the first row
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
    fetchBooks();
    fetchTDS();
    fetchAccounts();
  }, []);

  // const fetchPurchases = async () => {
  //   try {
  //     const response = await axios.get("https://publication.microtechsolutions.net.in/php/Purchaseget.php");
  //     setPurchases(response.data);

  //   } catch (error) {
  //     // toast.error("Error fetching Purchases:", error);
  //   }
  // };

  useEffect(() => {
    fetchPurchases();
    console.log("this function is called");
  }, [pageIndex]); // Fetch data when page changes

  const fetchPurchases = async () => {
    try {
      const response = await axios.get(
        `https://publication.microtechsolutions.net.in/php/get/gettblpage.php?Table=PurchaseHeader&PageNo=${pageIndex}`
      );
      // setSellschallans(response.data);
      console.log(response.data, "response of sells challan header");

      setPurchases(response.data.data);
      setTotalPages(response.data.total_pages);
    } catch (error) {
      // toast.error("Error fetching sells challans:", error);
    }
  };

  // Fetch the purchase details
  const fetchPurchasesDetails = async () => {
    try {
      const response = await axios.get(
        "https://publication.microtechsolutions.net.in/php/Purchasedetailget.php"
      );
      setPurchaseDetails(response.data);
    } catch (error) {
      // toast.error("Error fetching Purchase details:", error);
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

  const fetchTDS = async () => {
    try {
      const response = await axios.get(
        "https://publication.microtechsolutions.net.in/php/TDSMasterget.php"
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
      subtotal += Number(row.DiscountAmount) || 0;
      total += Number(row.Amount) || 0;
    });

    setTotalCopies(totalCopies);
    setSubTotal(subtotal);
    setTotal(total);
  };

  const handleInputChange = (index, field, value) => {
    const updatedRows = [...rows];

    // Update the value of the current field
    updatedRows[index][field] = value;

    if (field === "BookId") {
      // Update BookId and BookCode when a book is selected
      const selectedBook = bookOptions.find((option) => option.value === value);
      if (selectedBook) {
        updatedRows[index].BookCode = selectedBook.BookCode; // Assuming BookCode is available in the bookOptions
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

  const handleAddRow = () => {
    setRows([
      ...rows,
      {
        BookCode: "",
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

  const resetForm = () => {
    setPurchaseNo("");
    setPurchaseDate("");
    setSupplierId("");
    setBillNo("");
    setBillDate("");
    setPurchaseAccountId("");
    setTaxId("");
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

    setRows([
      {
        BookCode: "",
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
  }, [rows]);

  const handleNewClick = () => {
    resetForm();
    setIsModalOpen(true);
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
    const bookpurchase = purchases[currentRow.index];

    // Filter purchase details to match the selected PurchaseId
    const bookpurchasedetail = purchaseDetails.filter(
      (detail) => detail.PurchaseId === bookpurchase.Id
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

    // Map the details to rows
    const mappedRows = bookpurchasedetail.map((detail) => ({
      PurchaseId: detail.PurchaseId,
      BookCode: detail.BookCode,
      BookId: detail.BookId,
      Copies: detail.Copies,
      Rate: detail.Rate,
      DiscountPercentage: detail.DiscountPercentage,
      DiscountAmount: detail.DiscountAmount,
      Amount: detail.Amount,
      Id: detail.Id, // Include the detail Id in the mapped row for tracking
    }));

    const purchaseDate = convertDateForInput(bookpurchase.PurchaseDate.date);

    const billdate = convertDateForInput(bookpurchase.BillDate.date);

    // Set the form fields
    setPurchaseNo(bookpurchase.PurchaseNo);
    setPurchaseDate(purchaseDate);
    setSupplierId(bookpurchase.SupplierId);
    setBillNo(bookpurchase.BillNo);
    setBillDate(billdate);
    setPurchaseAccountId(bookpurchase.PurchaseAccountId);
    setTaxId(bookpurchase.TaxId);
    setCGST(bookpurchase.CGST);
    setSGST(bookpurchase.SGST);
    setIGST(bookpurchase.IGST);
    setSubTotal(bookpurchase.SubTotal);
    setExtra1(bookpurchase.Extra1);
    setExtra1Amount(bookpurchase.Extra1Amount);
    setExtra2(bookpurchase.Extra2);
    setExtra2Amount(bookpurchase.Extra2Amount);
    setExtra3(bookpurchase.Extra3);
    setExtra3Amount(bookpurchase.Extra3Amount);
    setRoundOff(bookpurchase.RoundOff);
    setTotal(bookpurchase.Total);
    setTotalCopies(bookpurchase.TotalCopies);
    setIsPaperPurchase(bookpurchase.IsPaperPurchase);
    setRemark(bookpurchase.Remark);

    // console.log(bookpurchase, 'book purchase')

    // console.log(BillDate, 'bill date')
    // Set the rows for the table with all the details
    setRows(mappedRows);

    // Set editing state
    setEditingIndex(currentRow.index);
    setIsModalOpen(true);
    setIsEditing(true);
    setId(bookpurchase.Id);
    handleMenuClose();
    // Determine which specific detail to edit
    const specificDetail = bookpurchasedetail.find(
      (detail) => detail.Id === currentRow.original.Id
    );
    if (specificDetail) {
      setPurchasedetailId(specificDetail.Id); // Set the specific detail Id
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

    const urlencoded = new URLSearchParams();
    urlencoded.append("Id", deleteId);

    const requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: urlencoded,
      redirect: "follow",
    };

    fetch(
      "https://publication.microtechsolutions.net.in/php/Purchasedelete.php",
      requestOptions
    )
      .then((response) => response.text())
      .then((result) => console.log(result))
      .catch((error) => console.error(error));
    toast.success("Purchase Deleted Successfully");
    setIsDeleteDialogOpen(false);
    // setDeleteIndex(deleteIndex)
    fetchPurchases();
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
    if (!PurchaseDate) {
      formErrors.PurchaseDate = "Purchase Date is required.";
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

    if (!BillDate) {
      formErrors.BillDate = "Bill date is required.";
      isValid = false;
    }

    if (!PurchaseAccountId) {
      formErrors.PurchaseAccountId = "Purchase acc Id is required.";
      isValid = false;
    }

    if (!TaxId) {
      formErrors.TaxId = "Tax Id is required.";
      isValid = false;
    }

    if (!CGST) {
      formErrors.CGST = "CGST is required.";
      isValid = false;
    }

    if (!SGST) {
      formErrors.SGST = "SGST is required.";
      isValid = false;
    }

    if (!IGST) {
      formErrors.IGST = "IGST is required.";
      isValid = false;
    }

    if (!SubTotal) {
      formErrors.SubTotal = "Sub total is required.";
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

    if (!Extra3) {
      formErrors.Extra3 = "Extra3 is required.";
      isValid = false;
    }
    if (!Extra3Amount) {
      formErrors.Extra3Amount = "Extra3 Amount is required.";
      isValid = false;
    }

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
    if (!validateForm()) return;

    const formattedPurchaseDate = moment(PurchaseDate).format("YYYY-MM-DD");
    const formattedBillDate = moment(BillDate).format("YYYY-MM-DD");

    const purchaseData = {
      Id: isEditing ? id : "", // Include the Id for updating, null for new records
      // PurchaseNo: PurchaseNo,
      PurchaseDate: formattedPurchaseDate,
      SupplierId: SupplierId,
      BillNo: BillNo,
      BillDate: formattedBillDate,
      PurchaseAccountId: PurchaseAccountId,
      TaxId: TaxId,
      CGST: CGST,
      SGST: SGST,
      IGST: IGST,
      SubTotal: SubTotal,
      Extra1: Extra1,
      Extra1Amount: Extra1Amount,
      Extra2: Extra2,
      Extra2Amount: Extra2Amount,
      Extra3: Extra3,
      Extra3Amount: Extra3Amount,
      RoundOff: RoundOff,
      Total: Total,
      TotalCopies: TotalCopies,
      IsPaperPurchase: IsPaperPurchase,
      Remark: Remark,

      CreatedBy: !isEditing ? userId : undefined,
      UpdatedBy: isEditing ? userId : undefined,
    };

    try {
      const purchaseUrl = isEditing
        ? "https://publication.microtechsolutions.net.in/php/Purchaseheaderupdate.php"
        : "https://publication.microtechsolutions.net.in/php/Purchaseheaderpost.php";

      // Submit purchase header data
      const response = await axios.post(
        purchaseUrl,
        // qs.stringify(purchaseData),
        purchaseData,
        {
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
        }
      );

      const purchaseId = isEditing ? id : parseInt(response.data.Id, 10);

      for (const row of rows) {
        const rowData = {
          PurchaseId: purchaseId,
          SerialNo: rows.indexOf(row) + 1,
          // BookCode: parseFloat(row.BookCode, 10),
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
      setIsModalOpen(false);
      toast.success(
        isEditing
          ? "Purchase & Purchase Details updated successfully!"
          : "Purchase & Purchase Details added successfully!"
      );
      resetForm(); // Reset the form fields after successful submission
    } catch (error) {
      // console.error("Error saving record:", error);
      toast.error("Error saving record!");
    }
  };

  // const handleSubmit = async (e) => {
  //   e.preventDefault();
  //   if (!validateForm()) return;

  //   const formattedPurchaseDate = moment(PurchaseDate).format('YYYY-MM-DD');
  //   const formattedBillDate = moment(BillDate).format('YYYY-MM-DD');

  //   const purchaseData = {
  //     PurchaseNo: PurchaseNo,
  //     PurchaseDate: formattedPurchaseDate,
  //     SupplierId: SupplierId,
  //     BillNo: BillNo,
  //     BillDate: formattedBillDate,
  //     PurchaseAccountId: PurchaseAccountId,
  //     TaxId: TaxId,
  //     CGST: CGST,
  //     SGST: SGST,
  //     IGST: IGST,
  //     SubTotal: SubTotal,
  //     Extra1: Extra1,
  //     Extra1Amount: Extra1Amount,
  //     Extra2: Extra2,
  //     Extra2Amount: Extra2Amount,
  //     Extra3: Extra3,
  //     Extra3Amount: Extra3Amount,
  //     RoundOff: RoundOff,
  //     Total: Total,
  //     TotalCopies: TotalCopies,
  //     IsPaperPurchase: IsPaperPurchase,
  //     Remark: Remark
  //   };

  //   try {
  //     const purchaseUrl = isEditing
  //       ? "https://publication.microtechsolutions.net.in/php/Purchaseupdate.php"
  //       : "https://publication.microtechsolutions.net.in/php/Purchasepost.php";

  //     const response = await axios.post(purchaseUrl, purchaseData, {
  //       headers: { "Content-Type": "application/x-www-form-urlencoded" },
  //     });

  //     const purchaseresp = response.data.Id;
  //     const purchaseId = parseInt(purchaseresp);

  //      for (const row of rows) {
  //   const rowData = {
  //         PurchaseId: purchaseId,
  //         SerialNo: rows.indexOf(row) + 1,
  //         BookId: parseInt(row.BookId, 10),
  //         Copies: parseInt(row.Copies, 10),
  //         Rate: parseFloat(row.Rate),
  //         DiscountPercentage: parseFloat(row.DiscountPercentage),
  //         DiscountAmount: parseFloat(row.DiscountAmount),
  //         Amount: parseFloat(row.Amount)
  //       };

  //       const purchasedetailUrl = isEditing
  //               ? "https://publication.microtechsolutions.net.in/php/Purchasedetailupdate.php"
  //               : "https://publication.microtechsolutions.net.in/php/Purchasedetailpost.php";

  //               await axios.post(purchasedetailUrl, qs.stringify(rowData), {
  //                 headers: {
  //                   "Content-Type": "application/x-www-form-urlencoded",
  //                 },
  //               });
  //           }

  //     toast.success(isEditing ? 'Purchase & Purchase Details updated successfully!' : 'Purchase & Purchase Details added successfully!');
  //     setIsModalOpen(false);
  //     fetchPurchases();
  //   } catch (error) {
  //     console.error("Error saving record:", error);
  //     toast.error('Error saving record!');
  //   }
  // };

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
    [purchases]
  );

  const table = useMaterialReactTable({
    columns,
    data: purchases,
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
    <div className="bookpurchase-container">
      <h1>Book Purchase</h1>

      <div className="bookpurchasetable-master">
        <div className="bookpurchasetable1-master">
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
          <div className="bookpurchasetable-container">
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

        {isModalOpen && (
          <div
            className="bookpurchase-overlay"
            onClick={() => setIsModalOpen(false)}
          />
        )}

        <Modal open={isModalOpen}>
          <div className="bookpurchase-modal">
            <h2
              style={{
                textAlign: "center",
                fontWeight: "620",
                margin: "2px",
                fontSize: "27px",
              }}>
              {editingIndex >= 0 ? "Edit Book Purchase " : "Add Book Purchase"}
            </h2>
            <form className="bookpurchase-form">
              <div>
                <label className="bookpurchase-label">
                  Purchase No <b className="required">*</b>
                </label>
                <div>
                  <input
                    type="text"
                    id="PurchaseNo"
                    name="PurchaseNo"
                    value={PurchaseNo}
                    onChange={(e) => setPurchaseNo(e.target.value)}
                    style={{ background: "#f5f5f5" }}
                    className="bookpurchase-control"
                    placeholder="Auto-Incremented"
                    readOnly
                  />
                </div>

                <div>
                  {errors.PurchaseNo && (
                    <b className="error-text">{errors.PurchaseNo}</b>
                  )}
                </div>
              </div>

              <div>
                <label className="bookpurchase-label">
                  Purchase Date <b className="required">*</b>
                </label>
                <div>
                  <input
                    type="date"
                    id="PurchaseDate"
                    name="PurchaseDate"
                    value={PurchaseDate}
                    onChange={(e) => setPurchaseDate(e.target.value)}
                    className="bookpurchase-control"
                    placeholder="Enter Purchase Date"
                  />
                </div>

                <div>
                  {errors.PurchaseDate && (
                    <b className="error-text">{errors.PurchaseDate}</b>
                  )}
                </div>
              </div>

              <div>
                <label className="bookpurchase-label">
                  Supplier <b className="required">*</b>
                </label>
                <div>
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
                        placeholder="Select Supp id"
                        size="small"
                        margin="none"
                        fullWidth
                      />
                    )}
                    sx={{ mt: 1.25, mb: 0.625, width: 170 }} // Equivalent to 10px and 5px
                  />
                </div>

                <div>
                  {errors.SupplierId && (
                    <b className="error-text">{errors.SupplierId}</b>
                  )}
                </div>
              </div>
              <div>
                <label className="bookpurchase-label">
                  Bill No <b className="required">*</b>
                </label>
                <div>
                  <input
                    type="text"
                    id="BillNo"
                    name="BillNo"
                    value={BillNo}
                    onChange={(e) => setBillNo(e.target.value)}
                    maxLength={15}
                    className="bookpurchase-control"
                    placeholder="Enter Bill No"
                  />
                </div>

                <div>
                  {errors.BillNo && (
                    <b className="error-text">{errors.BillNo}</b>
                  )}
                </div>
              </div>

              <div>
                <label className="bookpurchase-label">
                  Bill Date <b className="required">*</b>
                </label>
                <div>
                  <input
                    type="date"
                    id="BillDate"
                    name="BillDate"
                    value={BillDate}
                    onChange={(e) => setBillDate(e.target.value)}
                    className="bookpurchase-control"
                    placeholder="Enter Bill date"
                  />
                </div>

                <div>
                  {errors.BillDate && (
                    <b className="error-text">{errors.BillDate}</b>
                  )}
                </div>
              </div>

              <div>
                <label className="bookpurchase-label">
                  Purchase Account <b className="required">*</b>
                </label>
                <div>
                  <Autocomplete
                    options={accountOptions}
                    value={
                      accountOptions.find(
                        (option) => option.value === PurchaseAccountId
                      ) || null
                    }
                    onChange={(event, newValue) =>
                      setPurchaseAccountId(newValue ? newValue.value : null)
                    }
                    getOptionLabel={(option) => option.label} // Display only label in dropdown
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        placeholder="Select Acc id"
                        size="small"
                        margin="none"
                        fullWidth
                      />
                    )}
                    sx={{ mt: 1.25, mb: 0.625, width: 170 }} // Equivalent to 10px and 5px
                  />
                </div>

                <div>
                  {errors.PurchaseAccountId && (
                    <b className="error-text">{errors.PurchaseAccountId}</b>
                  )}
                </div>
              </div>
            </form>

            <div className="bookpurchase-table">
              <table>
                <thead>
                  <tr>
                    <th>Serial No</th>
                    <th>Book Code</th>
                    <th>
                      Book Name <b className="required">*</b>
                    </th>
                    <th>
                      Copies <b className="required">*</b>
                    </th>
                    <th>
                      Rate <b className="required">*</b>
                    </th>
                    <th>
                      Discount Percentage <b className="required">*</b>
                    </th>
                    <th>
                      Discount Amount <b className="required">*</b>
                    </th>
                    <th>
                      Amount <b className="required">*</b>
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
                          {bookOptions.find(
                            (option) => option.value === row.BookId
                          )?.code || ""}
                        </td>
                        <td>
                          <Autocomplete
                            options={bookOptions}
                            value={
                              bookOptions.find(
                                (option) => option.value === row.BookId
                              ) || null
                            }
                            onChange={(event, newValue) =>
                              handleInputChange(
                                index,
                                "BookId",
                                newValue ? newValue.value : ""
                              )
                            }
                            sx={{ width: 250 }} // Set width
                            getOptionLabel={(option) => option.label}
                            renderInput={(params) => (
                              <TextField
                                {...params}
                                placeholder="Select Book"
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
                        </td>
                        <td>
                          <input
                            type="number"
                            value={row.Copies}
                            onChange={(e) =>
                              handleInputChange(index, "Copies", e.target.value)
                            }
                            style={{
                              width: "150px",
                            }}
                            placeholder="Copies"
                          />
                        </td>
                        <td>
                          <input
                            type="number"
                            value={row.Rate}
                            onChange={(e) => {
                              const value = e.target.value;
                              // Regex to validate decimal numbers with at most 18 digits total and 2 decimal places
                              const regex = /^\d{0,18}(\.\d{0,2})?$/;

                              // Check if the value matches the regex
                              if (value === "" || regex.test(value)) {
                                handleInputChange(index, "Rate", value);
                              }
                            }}
                            style={{
                              width: "150px",
                            }}
                            placeholder="Rate"
                          />
                        </td>
                        <td>
                          <input
                            type="number"
                            value={row.DiscountPercentage}
                            onChange={(e) => {
                              const value = e.target.value;
                              // Regex to validate decimal numbers with at most 18 digits total and 2 decimal places
                              const regex = /^\d{0,18}(\.\d{0,2})?$/;

                              // Check if the value matches the regex
                              if (value === "" || regex.test(value)) {
                                handleInputChange(
                                  index,
                                  "DiscountPercentage",
                                  value
                                );
                              }
                            }}
                            style={{
                              width: "150px",
                            }}
                            placeholder="Discount %"
                          />
                        </td>
                        <td>
                          <input
                            type="number"
                            value={row.DiscountAmount}
                            readOnly
                            style={{
                              width: "150px",
                            }}
                            placeholder="Discount Amount"
                          />
                        </td>
                        <td>
                          <input
                            type="number"
                            value={row.Amount}
                            readOnly
                            style={{
                              width: "150px",
                            }}
                            placeholder="Amount"
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
            <form className="bookpurchase-form">
              <div>
                <label className="bookpurchase-label">
                  Tax <b className="required">*</b>
                </label>
                <div>
                  <Select
                    id="TaxId"
                    name="TaxId"
                    value={tdsOptions.find((option) => option.value === TaxId)}
                    onChange={(option) => setTaxId(option.value)}
                    options={tdsOptions}
                    styles={{
                      control: (base) => ({
                        ...base,
                        width: "170px",
                        marginTop: "10px",
                        borderRadius: "4px",
                        border: "1px solid rgb(223, 222, 222)",
                        marginBottom: "5px",
                      }),
                      menu: (base) => ({
                        ...base,
                        zIndex: 100,
                      }),
                    }}
                    placeholder="Select Tax id"
                  />
                </div>

                <div>
                  {errors.TaxId && <b className="error-text">{errors.TaxId}</b>}
                </div>
              </div>
              <div>
                <label className="bookpurchase-label">
                  CGST <b className="required">*</b>
                </label>
                <div>
                  <input
                    type="text"
                    id="CGST"
                    name="CGST"
                    value={CGST}
                    onChange={(e) => {
                      const value = e.target.value;

                      // Regex to validate decimal numbers with at most 18 digits total and 2 decimal places
                      const regex = /^\d{0,18}(\.\d{0,2})?$/;

                      // Check if the value matches the regex
                      if (value === "" || regex.test(value)) {
                        setCGST(value);
                      }
                    }}
                    className="bookpurchase-control"
                    placeholder="Enter CGST"
                  />
                </div>
                <div>
                  {errors.CGST && <b className="error-text">{errors.CGST}</b>}
                </div>
              </div>
              <div>
                <label className="bookpurchase-label">
                  SGST <b className="required">*</b>
                </label>
                <div>
                  <input
                    type="text"
                    id="SGST"
                    name="SGST"
                    value={SGST}
                    onChange={(e) => {
                      const value = e.target.value;

                      // Regex to validate decimal numbers with at most 18 digits total and 2 decimal places
                      const regex = /^\d{0,18}(\.\d{0,2})?$/;

                      // Check if the value matches the regex
                      if (value === "" || regex.test(value)) {
                        setSGST(value);
                      }
                    }}
                    className="bookpurchase-control"
                    placeholder="Enter SGST"
                  />
                </div>

                <div>
                  {errors.SGST && <b className="error-text">{errors.SGST}</b>}
                </div>
              </div>

              <div>
                <label className="bookpurchase-label">
                  IGST <b className="required">*</b>
                </label>
                <div>
                  <input
                    type="text"
                    id="IGST"
                    name="IGST"
                    value={IGST}
                    onChange={(e) => {
                      const value = e.target.value;

                      // Regex to validate decimal numbers with at most 18 digits total and 2 decimal places
                      const regex = /^\d{0,18}(\.\d{0,2})?$/;

                      // Check if the value matches the regex
                      if (value === "" || regex.test(value)) {
                        setIGST(value);
                      }
                    }}
                    className="bookpurchase-control"
                    placeholder="Enter IGST"
                  />
                </div>

                <div>
                  {errors.IGST && <b className="error-text">{errors.IGST}</b>}
                </div>
              </div>

              <div>
                <label className="bookpurchase-label">
                  Sub Total <b className="required">*</b>
                </label>
                <div>
                  <input
                    type="text"
                    id="SubTotal"
                    name="SubTotal"
                    value={SubTotal}
                    onChange={(e) => {
                      const value = e.target.value;

                      // Regex to validate decimal numbers with at most 18 digits total and 2 decimal places
                      const regex = /^\d{0,18}(\.\d{0,2})?$/;

                      // Check if the value matches the regex
                      if (value === "" || regex.test(value)) {
                        setSubTotal(value);
                      }
                    }}
                    className="bookpurchase-control"
                    placeholder="Enter Sub Total"
                  />
                </div>

                <div>
                  {errors.SubTotal && (
                    <b className="error-text">{errors.SubTotal}</b>
                  )}
                </div>
              </div>

              <div>
                <label className="bookpurchase-label">
                  Extra1 <b className="required">*</b>
                </label>
                <div>
                  <input
                    type="text"
                    id="Extra1"
                    name="Extra1"
                    value={Extra1}
                    onChange={(e) => setExtra1(e.target.value)}
                    maxLength={50}
                    className="bookpurchase-control"
                    placeholder="Enter Extra1"
                  />
                </div>

                <div>
                  {errors.Extra1 && (
                    <b className="error-text">{errors.Extra1}</b>
                  )}
                </div>
              </div>
              <div>
                <label className="bookpurchase-label">
                  Extra1 Amount <b className="required">*</b>
                </label>
                <div>
                  <input
                    type="text"
                    id="Extra1Amount"
                    name="Extra1Amount"
                    value={Extra1Amount}
                    onChange={(e) => {
                      const value = e.target.value;

                      // Regex to validate decimal numbers with at most 18 digits total and 2 decimal places
                      const regex = /^\d{0,18}(\.\d{0,2})?$/;

                      // Check if the value matches the regex
                      if (value === "" || regex.test(value)) {
                        setExtra1Amount(value);
                      }
                    }}
                    className="bookpurchase-control"
                    placeholder="Enter Extra1 Amount"
                  />
                </div>
                <div>
                  {errors.Extra1Amount && (
                    <b className="error-text">{errors.Extra1Amount}</b>
                  )}
                </div>
              </div>
              <div>
                <label className="bookpurchase-label">
                  Extra2 <b className="required">*</b>
                </label>
                <div>
                  <input
                    type="text"
                    id="Extra2"
                    name="Extra2"
                    value={Extra2}
                    onChange={(e) => setExtra2(e.target.value)}
                    maxLength={50}
                    className="bookpurchase-control"
                    placeholder="Enter Extra2"
                  />
                </div>

                <div>
                  {errors.Extra2 && (
                    <b className="error-text">{errors.Extra2}</b>
                  )}
                </div>
              </div>
              <div>
                <label className="bookpurchase-label">
                  Extra2 Amount <b className="required">*</b>
                </label>
                <div>
                  <input
                    type="text"
                    id="Extra2Amount"
                    name="Extra2Amount"
                    value={Extra2Amount}
                    onChange={(e) => {
                      const value = e.target.value;

                      // Regex to validate decimal numbers with at most 18 digits total and 2 decimal places
                      const regex = /^\d{0,18}(\.\d{0,2})?$/;

                      // Check if the value matches the regex
                      if (value === "" || regex.test(value)) {
                        setExtra2Amount(value);
                      }
                    }}
                    className="bookpurchase-control"
                    placeholder="Enter Extra2 Amount"
                  />
                </div>

                <div>
                  {errors.Extra2Amount && (
                    <b className="error-text">{errors.Extra2Amount}</b>
                  )}
                </div>
              </div>
              <div>
                <label className="bookpurchase-label">
                  Extra3 <b className="required">*</b>
                </label>
                <div>
                  <input
                    type="text"
                    id="Extra3"
                    name="Extra3"
                    value={Extra3}
                    onChange={(e) => setExtra3(e.target.value)}
                    maxLength={50}
                    className="bookpurchase-control"
                    placeholder="Enter Extra3"
                  />
                </div>

                <div>
                  {errors.Extra3 && (
                    <b className="error-text">{errors.Extra3}</b>
                  )}
                </div>
              </div>
              <div>
                <label className="bookpurchase-label">
                  Extra3 Amount <b className="required">*</b>
                </label>
                <div>
                  <input
                    type="text"
                    id="Extra3Amount"
                    name="Extra3Amount"
                    value={Extra3Amount}
                    onChange={(e) => {
                      const value = e.target.value;

                      // Regex to validate decimal numbers with at most 18 digits total and 2 decimal places
                      const regex = /^\d{0,18}(\.\d{0,2})?$/;

                      // Check if the value matches the regex
                      if (value === "" || regex.test(value)) {
                        setExtra3Amount(value);
                      }
                    }}
                    className="bookpurchase-control"
                    placeholder="Enter Extra3 Amount"
                  />
                </div>
                <div>
                  {errors.Extra3Amount && (
                    <b className="error-text">{errors.Extra3Amount}</b>
                  )}
                </div>
              </div>

              <div>
                <label className="bookpurchase-label">
                  Round Off <b className="required">*</b>
                </label>
                <div>
                  <input
                    type="text"
                    id="RoundOff"
                    name="RoundOff"
                    value={RoundOff}
                    onChange={(e) => {
                      const value = e.target.value;

                      // Regex to validate decimal numbers with at most 18 digits total and 2 decimal places
                      const regex = /^\d{0,18}(\.\d{0,2})?$/;

                      // Check if the value matches the regex
                      if (value === "" || regex.test(value)) {
                        setRoundOff(value);
                      }
                    }}
                    className="bookpurchase-control"
                    placeholder="Enter RoundOff"
                  />
                </div>

                <div>
                  {errors.RoundOff && (
                    <b className="error-text">{errors.RoundOff}</b>
                  )}
                </div>
              </div>

              <div>
                <label className="bookpurchase-label">
                  Total <b className="required">*</b>
                </label>
                <div>
                  <input
                    type="text"
                    id="Total"
                    name="Total"
                    value={Total}
                    onChange={(e) => {
                      const value = e.target.value;

                      // Regex to validate decimal numbers with at most 18 digits total and 2 decimal places
                      const regex = /^\d{0,18}(\.\d{0,2})?$/;

                      // Check if the value matches the regex
                      if (value === "" || regex.test(value)) {
                        setTotal(value);
                      }
                    }}
                    className="bookpurchase-control"
                    placeholder="Enter Total"
                  />
                </div>

                <div>
                  {errors.Total && <b className="error-text">{errors.Total}</b>}
                </div>
              </div>

              <div>
                <label className="bookpurchase-label">
                  Total Copies <b className="required">*</b>
                </label>
                <div>
                  <input
                    type="text"
                    id="TotalCopies"
                    name="TotalCopies"
                    value={TotalCopies}
                    onChange={(e) => setTotalCopies(e.target.value)}
                    className="bookpurchase-control"
                    placeholder="Enter Total Copies"
                  />
                </div>

                <div>
                  {errors.TotalCopies && (
                    <b className="error-text">{errors.TotalCopies}</b>
                  )}
                </div>
              </div>

              <div>
                <label className="bookpurchase-label">Is Paper Puchase:</label>
                <div>
                  <input
                    type="checkbox"
                    id="IsPaperPurchase"
                    name="IsPaperPurchase"
                    checked={IsPaperPurchase}
                    onChange={(e) => setIsPaperPurchase(e.target.checked)}
                    className="bookpurchase-control"
                    placeholder="Select Is paper purchase"
                  />
                </div>
                {/* <div>
                  {errors.IsPaperPurchase && (
                    <b className="error-text">{errors.IsPaperPurchase}</b>
                  )}
                </div> */}
              </div>

              <div>
                <label className="bookpurchase-label">
                  Remark <b className="required">*</b>
                </label>
                <div>
                  <input
                    type="text"
                    id="Remark"
                    name="Remark"
                    value={Remark}
                    onChange={(e) => setRemark(e.target.value)}
                    maxLength={300}
                    className="bookpurchase-control"
                    placeholder="Enter Remark"
                  />
                </div>

                <div>
                  {errors.Remark && (
                    <b className="error-text">{errors.Remark}</b>
                  )}
                </div>
              </div>
            </form>
            <div className="bookpurchase-btn-container">
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
                onClick={() => setIsModalOpen(false)}
                style={{
                  background: "red",
                  color: "white",
                }}>
                Cancel
              </Button>
            </div>
          </div>
        </Modal>

        {/* Confirmation Dialog for Delete */}
        <Dialog open={isDeleteDialogOpen} onClose={cancelDelete}>
          <DialogTitle style={{ color: "navy", fontWeight: "600" }}>
            Confirm Deletion
          </DialogTitle>
          <DialogContent>
            Are you sure you want to delete this{" "}
            <b style={{ color: "red" }}>
              <u>Book Purchase</u>
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
export default Bookpurchase;
