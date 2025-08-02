import React, { useState, useMemo, useEffect } from "react";
import "./Salesinvoice.css";
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

function Salesinvoice() {
  const [userId, setUserId] = useState("");
  const [yearid, setYearId] = useState("");
  const [dateError, setDateError] = useState(false);

  useEffect(() => {
    const storedUserId = sessionStorage.getItem("UserId");
    // const storedYearId = sessionStorage.getItem("YearId");

    if (storedUserId) {
      setUserId(storedUserId);
    } else {
      toast.error("User is not logged in.");
    }

    // if (storedYearId) {
    //   setYearId(storedYearId);
    // } else {
    //   toast.error("Year is not set.");
    // }

    fetchInvoiceheaders();
  }, []);

  const [pageIndex, setPageIndex] = useState(1); // Current page
  const [totalPages, setTotalPages] = useState(1);

  const [InvoiceNo, setInvoiceNo] = useState(null);
  const [InvoiceDate, setInvoiceDate] = useState("");
  const [AccountId, setAccountId] = useState("");
  const [ChallanId, setChallanId] = useState("");
  const [ReceiptNo, setReceiptNo] = useState("");
  const [ReceiptDate, setReceiptDate] = useState("");
  const [OrderNo, setOrderNo] = useState("");
  const [OrderDate, setOrderDate] = useState("");
  const [ReceiptSendThrough, setReceiptSendThrough] = useState("");
  const [ParcelSendThrough, setParcelSendThrough] = useState("");
  const [Bundles, setBundles] = useState("");

  const [Weight, setWeight] = useState("");
  const [Freight, setFreight] = useState("");
  const [Packing, setPacking] = useState("");
  const [CGSTPercentage, setCGSTPercentage] = useState("");
  const [CGSTAmount, setCGSTAmount] = useState("");
  const [SGSTPercentage, setSGSTPercentage] = useState("");
  const [SGSTAmount, setSGSTAmount] = useState("");
  const [IGSTPercentage, setIGSTPercentage] = useState("");
  const [IGSTAmount, setIGSTAmount] = useState("");
  const [Total, setTotal] = useState("");

  const [editingIndex, setEditingIndex] = useState(-1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [id, setId] = useState("");

  const [invoicedetailId, setInvoicedetailId] = useState("");
  const [errors, setErrors] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [invoiceheaders, setInvoiceheaders] = useState([]);
  const [invoicedetails, setInvoiceDetails] = useState([]);

  const [isPrinting, setIsPrinting] = useState(false);
  const [isPrintingModalOpen, setIsPrintingModalOpen] = useState(false); // For print modal
  const [printData, setPrintData] = useState(null); // Data to print

  //Dropdown for ID's
  const [bookOptions, setBookOptions] = useState([]);
  const [accountOptions, setAccountOptions] = useState([]);
  const [challanOptions, setChallanOptions] = useState([]);

  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [deleteIndex, setDeleteIndex] = useState(null);
  const [deleteId, setDeleteId] = useState(null);

  const [rows, setRows] = useState([
    {
      BookId: "",
      Copies: 0,
      Rate: 0, // ✅ Use 'Rate' instead of 'Price'
      DiscountPercentage: 0,
      DiscountAmount: 0,
      Amount: 0,
      FinalAmount: 0,
    },
  ]);

  useEffect(() => {
    // fetchInvoiceheaders();
    fetchInvoicedetails();
    fetchBooks();
    fetchAccounts();
    fetchChallans();
  }, []);

  // const fetchInvoiceheaders = async () => {
  //   try {
  //     const response = await axios.get("https://publication.microtechsolutions.net.in/php/gettable.php?Table=InvoiceHeader");
  //     setInvoiceheaders(response.data);
  //   } catch (error) {
  //     // toast.error("Error fetching Invoices:", error);
  //   }
  // };

  useEffect(() => {
    fetchInvoiceheaders();
    console.log("this function is called");
  }, [pageIndex]); // Fetch data when page changes

  const fetchInvoiceheaders = async () => {
    try {
      const response = await axios.get(
        `https://publication.microtechsolutions.net.in/php/get/gettblpage.php?Table=InvoiceHeader&PageNo=${pageIndex}`
      );
      // setSellschallans(response.data);
      console.log(response.data, "response of invoice header");

      setInvoiceheaders(response.data.data);
      setTotalPages(response.data.total_pages);
    } catch (error) {
      // toast.error("Error fetching sells challans:", error);
    }
  };

  // Fetch the purchase details
  const fetchInvoicedetails = async () => {
    try {
      const response = await axios.get(
        "https://publication.microtechsolutions.net.in/php/gettable.php?Table=InvoiceDetail"
      );
      // console.log(response.data, 'response of purchase return details')
      setInvoiceDetails(response.data);
    } catch (error) {
      // toast.error("Error fetching Invoice details:", error);
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

    setTotal(total);
  };

  const handleInputChange = (index, field, value) => {
    const updatedRows = [...rows];
    updatedRows[index][field] = value;

    // Always fetch rate based on BookId
    const selectedBook = bookOptions.find(
      (book) => book.value === updatedRows[index].BookId
    );
    updatedRows[index].Rate = selectedBook
      ? parseFloat(selectedBook.price) || 0
      : 0;

    // Parse copies and rate
    const copies = parseFloat(updatedRows[index].Copies) || 0;
    const rate = parseFloat(updatedRows[index].Rate) || 0;

    // Calculate amount
    updatedRows[index].Amount = copies * rate;

    // Calculate discount
    const discountPercentage =
      parseFloat(updatedRows[index].DiscountPercentage) || 0;
    updatedRows[index].DiscountAmount =
      (updatedRows[index].Amount * discountPercentage) / 100;

    // Final amount
    updatedRows[index].FinalAmount =
      updatedRows[index].Amount - updatedRows[index].DiscountAmount;

    // Update state
    setRows(updatedRows);
  };

  const handleAddRow = () => {
    setRows([
      ...rows,
      {
        BookId: "",
        Copies: 0,
        Rate: 0,
        DiscountPercentage: 0,
        DiscountAmount: 0,
        Amount: 0,
        FinalAmount: 0,
      },
    ]);
    calculateTotals();
  };

  const handleDeleteRow = (index) => {
    const updatedRows = rows.filter((_, i) => i !== index);
    setRows(updatedRows);
    calculateTotals();
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

  const fetchChallans = async () => {
    try {
      const response = await axios.get(
        "https://publication.microtechsolutions.net.in/php/gettable.php?Table=SellsChallanHeader"
      );
      const challanOptions = response.data.map((challan) => ({
        value: challan.Id,
        label: challan.ChallanNo,
      }));
      setChallanOptions(challanOptions);
    } catch (error) {
      // toast.error("Error fetching challans:", error);
    }
  };

  const fetchChallanDetails = async (selectedChallanId) => {
    // console.log(selectedChallanId, "sele challan id");
    try {
      const response = await axios.get(
        `https://publication.microtechsolutions.net.in/php/get/getbycolm.php?Table=SellsChallanDetail&Colname=ChallanId&Colvalue=${selectedChallanId}`
      );
      setRows(response.data); // Set fetched data to table rows
    } catch (error) {
      toast.error("Error fetching challan details");
    }
  };

  const resetForm = () => {
    setInvoiceNo("");
    // setInvoiceDate("");
    setInvoicesafedate(dayjs());
    setInverror("");
    setAccountId("");
    setChallanId("");
    setOrderNo("");
    // setOrderDate("");
    setOrdersafedate(dayjs());
    setOrdererror("");
    setReceiptNo("");
    // setReceiptDate("");
    setReceiptsafedate(dayjs());
    setReceipterror("");
    setWeight("");
    setBundles("");
    setFreight("");
    setReceiptSendThrough("");
    setParcelSendThrough("");
    setCGSTPercentage("");
    setCGSTAmount("");
    setSGSTAmount("");
    setSGSTPercentage("");
    setIGSTAmount("");
    setIGSTPercentage("");
    setTotal("");

    setRows([
      {
        BookId: "",
        Copies: 0,
        Rate: 0,
        DiscountPercentage: 0,
        DiscountAmount: 0,
        Amount: 0,
        FinalAmount: 0,
      },
    ]);
  };

  useEffect(() => {
    calculateTotals();
  }, [rows]);

  const handleNewClick = () => {
    resetForm();
    setIsModalOpen(true);
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

    setIsLoading(true); // Start loading

    console.log(currentRow, "row");

    const invoiceheader = invoiceheaders[currentRow.index];
    console.log(invoiceheader, "invoice header");

    // Filter purchase details to match the selected PurchaseId
    const invoicedetail = invoicedetails.filter(
      (detail) => detail.InvoiceId === invoiceheader.Id
    );

    // Map the details to rows
    const mappedRows = invoicedetail.map((detail) => ({
      InvoiceId: detail.InvoiceId,
      BookId: detail.BookId,
      Copies: detail.Copies,
      Rate: detail.Price,
      DiscountPercentage: detail.DiscountPercentage,
      DiscountAmount: detail.DiscountAmount,
      Amount: detail.Amount,
      FinalAmount: detail.FinalAmount,
      Id: detail.Id, // Include the detail Id in the mapped row for tracking
    }));

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

    const invoicedate = dayjs(invoiceheader.InvoiceDate?.date);
    const receiptdate = dayjs(invoiceheader.ReceiptDate?.date);
    const orderdate = dayjs(invoiceheader.OrderDate?.date);

    // Set the form fields
    setInvoiceNo(invoiceheader.InvoiceNo);
    // setInvoiceDate(invoicedate);
    setInvoicesafedate(invoicedate);
    setAccountId(invoiceheader.AccountId);
    setChallanId(invoiceheader.ChallanId);
    setReceiptNo(invoiceheader.ReceiptNo);
    // setReceiptDate(receiptdate);
    setReceiptsafedate(receiptdate);
    setWeight(invoiceheader.Weight);
    setBundles(invoiceheader.Bundles);
    setFreight(invoiceheader.Freight);
    setPacking(invoiceheader.Packing);
    setOrderNo(invoiceheader.OrderNo);
    // setOrderDate(orderdate);
    setOrdersafedate(orderdate);
    setReceiptSendThrough(invoiceheader.ReceiptSendThrough);
    setParcelSendThrough(invoiceheader.ParcelSendThrough);
    setCGSTPercentage(invoiceheader.CGSTPercentage);
    setCGSTAmount(invoiceheader.CGSTAmount);
    setSGSTAmount(invoiceheader.SGSTAmount);
    setSGSTPercentage(invoiceheader.SGSTPercentage);
    setIGSTAmount(invoiceheader.IGSTAmount);
    setIGSTPercentage(invoiceheader.IGSTPercentage);
    setTotal(invoiceheader.Total);

    setRows(mappedRows);

    // Set editing state
    setEditingIndex(currentRow.index);
    setIsModalOpen(true);
    setIsEditing(true);
    setId(invoiceheader.Id);
    handleMenuClose();

    // Determine which specific detail to edit
    const specificDetail = invoicedetail.find(
      (detail) => detail.Id === currentRow.original.Id
    );
    if (specificDetail) {
      setInvoicedetailId(specificDetail.Id); // Set the specific detail Id
    }

    fetchInvoicedetails().then(() => {
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
    setIsDeleteDialogOpen(true);
    handleMenuClose();
  };

  const confirmDelete = () => {
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/x-www-form-urlencoded");

    const url = `https://publication.microtechsolutions.net.in/php/deletetable.php?Id=${deleteId}&Table=InvoiceHeader`;

    const urlencoded = new URLSearchParams();
    urlencoded.append("Id", deleteId);
    urlencoded.append("Table", "InvoiceHeader");

    const requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: urlencoded,
      redirect: "follow",
    };

    fetch(url, requestOptions)
      .then((response) => response.text())
      .then((result) => {
        console.log(result);
        toast.success("Sales Invoice Deleted Successfully");
        setIsDeleteDialogOpen(false);
        fetchInvoiceheaders();
      })
      .catch((error) => {
        console.error("Error:", error);
        toast.error("Failed to delete Sales Invoice");
      });
  };

  const cancelDelete = () => {
    setIsDeleteDialogOpen(false);
    setDeleteIndex(null);
  };

  const validateForm = () => {
    let formErrors = {};
    let isValid = true;

    // if (!InvoiceNo) {
    //   formErrors.InvoiceNo = "Invoice No  is required.";
    //   isValid = false;
    // }
    if (!invoicesafedate) {
      formErrors.invoicesafedate = "Invoice Date is required.";
      isValid = false;
    }

    if (!ChallanId) {
      formErrors.ChallanId = "Challan is required.";
      isValid = false;
    }
    if (!AccountId) {
      formErrors.AccountId = "Account Id is required.";
      isValid = false;
    }
    if (!ReceiptNo) {
      formErrors.ReceiptNo = "Receipt No is required.";
      isValid = false;
    }

    if (!receiptsafedate) {
      formErrors.receiptsafedate = "Receipt Date is required.";
      isValid = false;
    }
    if (!Weight) {
      formErrors.Weight = "Weight is required.";
      isValid = false;
    }

    if (!Bundles) {
      formErrors.Bundles = "Bundles is required.";
      isValid = false;
    }
    if (!Freight) {
      formErrors.Freight = "Freight is required.";
      isValid = false;
    }
    if (!ReceiptSendThrough) {
      formErrors.ReceiptSendThrough = "Receipt Send Through is required.";
      isValid = false;
    }

    if (!ParcelSendThrough) {
      formErrors.ParcelSendThrough = "Parcel Send Through is required.";
      isValid = false;
    }
    if (!OrderNo) {
      formErrors.OrderNo = "Order No is required.";
      isValid = false;
    }
    if (!ordersafedate) {
      formErrors.ordersafedate = "Order Date is required.";
      isValid = false;
    }

    // if (!Total) {
    //   formErrors.Total = " Total is required.";
    //   isValid = false;
    // }

    setErrors(formErrors);
    return isValid;
  };

  const [invoicesafedate, setInvoicesafedate] = useState(dayjs());
  const [inverror, setInverror] = useState("");
  const [ordersafedate, setOrdersafedate] = useState(dayjs());
  const [ordererror, setOrdererror] = useState("");
  const [receiptsafedate, setReceiptsafedate] = useState(dayjs());
  const [receipterror, setReceipterror] = useState("");

  const handleDateChange1 = (newValue) => {
    if (!newValue || !dayjs(newValue).isValid()) {
      setInverror("Invalid date");
      setInvoicesafedate(null);
      return;
    }

    const today = dayjs();
    const minDate = today.subtract(3, "day");
    const maxDate = today.add(2, "day");

    if (newValue.isBefore(minDate) || newValue.isAfter(maxDate)) {
      setInverror("You can select only 2 days before or after today");
    } else {
      setInverror("");
    }

    setInvoicesafedate(newValue);
  };

  const handleDateChange2 = (newValue) => {
    if (!newValue || !dayjs(newValue).isValid()) {
      setOrdererror("Invalid date");
      setOrdersafedate(null);
      return;
    }

    const today = dayjs();
    const minDate = today.subtract(3, "day");
    const maxDate = today.add(2, "day");

    if (newValue.isBefore(minDate) || newValue.isAfter(maxDate)) {
      setOrdererror("You can select only 2 days before or after today");
    } else {
      setOrdererror("");
    }

    setOrdersafedate(newValue);
  };

  const handleDateChange3 = (newValue) => {
    if (!newValue || !dayjs(newValue).isValid()) {
      setReceipterror("Invalid date");
      setReceiptsafedate(null);
      return;
    }

    const today = dayjs();
    const minDate = today.subtract(3, "day");
    const maxDate = today.add(2, "day");

    if (newValue.isBefore(minDate) || newValue.isAfter(maxDate)) {
      setReceipterror("You can select only 2 days before or after today");
    } else {
      setReceipterror("");
    }

    setReceiptsafedate(newValue);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    if (
      !invoicesafedate ||
      !dayjs(invoicesafedate).isValid() ||
      !ordersafedate ||
      !dayjs(ordersafedate).isValid() ||
      !receiptsafedate ||
      !dayjs(receiptsafedate).isValid() ||
      dateError ||
      inverror ||
      ordererror ||
      receipterror
    ) {
      toast.error("Please correct all the date fields before submitting.");
      return;
    }

    const formattedInvoiceDate = dayjs(invoicesafedate).format("YYYY-MM-DD");
    const formattedReceiptDate = dayjs(receiptsafedate).format("YYYY-MM-DD");
    const formattedOrderDate = dayjs(ordersafedate).format("YYYY-MM-DD");

    const invoiceheaderData = {
      Id: isEditing ? id : "", // Include the Id for updating, null for new records
      InvoiceNo: InvoiceNo,
      InvoiceDate: formattedInvoiceDate,
      AccountId: AccountId,
      ChallanId: ChallanId,
      ReceiptNo: ReceiptNo,
      ReceiptDate: formattedReceiptDate,
      OrderNo: OrderNo,
      OrderDate: formattedOrderDate,
      Weight: Weight,
      Bundles: Bundles,
      Freight: Freight,
      Packing: Packing,
      ReceiptSendThrough: ReceiptSendThrough,
      ParcelSendThrough: ParcelSendThrough,
      SGSTPercentage: SGSTPercentage,
      SGSTAmount: SGSTPercentage,
      CGSTPercentage: CGSTPercentage,
      CGSTAmount: CGSTAmount,
      IGSTPercentage: IGSTPercentage,
      IGSTAmount: IGSTAmount,
      Total: Total,
      CreatedBy: !isEditing ? userId : undefined,
      UpdatedBy: isEditing ? userId : undefined,
    };

    try {
      const invoiceheaderurl = isEditing
        ? "https://publication.microtechsolutions.net.in/php/Invoiceheaderupdate.php"
        : "https://publication.microtechsolutions.net.in/php/Invoiceheaderpost.php";

      // Submit purchase header data
      const response = await axios.post(
        invoiceheaderurl,
        qs.stringify(invoiceheaderData),
        {
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
        }
      );

      // const purchasereturnId = isEditing ? id : parseInt(response.data.newId, 10);
      const invoiceheaderId = isEditing ? id : parseInt(response.data.Id, 10);

      for (const row of rows) {
        const rowData = {
          InvoiceId: invoiceheaderId,
          SerialNo: rows.indexOf(row) + 1,
          BookId: parseInt(row.BookId, 10),
          Copies: parseInt(row.Copies, 10),
          Price: parseFloat(row.Rate),
          DiscountPercentage: parseFloat(row.DiscountPercentage),
          DiscountAmount: parseFloat(row.DiscountAmount),
          Amount: parseFloat(row.Amount),
          FinalAmount: parseFloat(row.FinalAmount),
          CreatedBy: row.Id ? undefined : userId,
          UpdatedBy: row.Id ? userId : undefined,
          Id: row.Id,
        };

        const invoicedetailurl =
          isEditing && row.Id
            ? "https://publication.microtechsolutions.net.in/php/Invoicedetailupdate.php"
            : "https://publication.microtechsolutions.net.in/php/Invoicedetailpost.php";

        await axios.post(invoicedetailurl, qs.stringify(rowData), {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
        });
      }
      fetchInvoiceheaders();
      setIsModalOpen(false);

      toast.success(
        isEditing
          ? "Invoice & Invoice Details updated successfully!"
          : "Invoice & Invoice Details added successfully!"
      );
      resetForm(); // Reset the form fields after successful submission

      // fetchInvoicedetails();
    } catch (error) {
      // console.error("Error saving record:", error);
      toast.error("Error saving record!");
    }
  };

  const navigate = useNavigate();

  const handlePrint = () => {
    // navigate(`/transaction/salesinvoice/salesinvoiceprint/${currentRow.original.Id}`);
    navigate(
      `/transaction/salesinvoice/salesinvoiceprint/${currentRow.original.Id}`
    );
  };

  const [anchorEl, setAnchorEl] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(null);
  const [selectedIndex, setSelectedIndex] = useState(null);
  const [currentRow, setCurrentRow] = useState(null);

  const handleMenuOpen = (event, row) => {
    setAnchorEl(event.currentTarget);
    setCurrentRow(row);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
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
        accessorKey: "InvoiceNo",
        header: "Invoice No",
        size: 50,
      },

      {
        accessorKey: "InvoiceDate.date",
        header: "Invoice Date",
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
    [invoiceheaders]
  );

  const table = useMaterialReactTable({
    columns,
    data: invoiceheaders,
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
    <div className="salesinvoice-container">
      <h1>Sales Invoice</h1>

      <div className="salesinvoicetable-master">
        <div className="salesinvoicetable1-master">
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
          <div className="salesinvoicetable-container">
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
          </div>
        </div>

        {isModalOpen && (
          <div
            className="salesinvoice-overlay"
            onClick={() => setIsModalOpen(false)}
          />
        )}

        <Modal open={isModalOpen}>
          <div className="salesinvoice-modal">
            <h2
              style={{
                textAlign: "center",
                fontWeight: "620",
                margin: "2px",
                fontSize: "27px",
              }}>
              {editingIndex >= 0 ? "Edit Sales Invoice" : "Add Sales Invoice"}
            </h2>
            <form className="salesinvoice-form">
              <div>
                <label className="salesinvoice-label">
                  Invoice No <b className="required">*</b>
                </label>
                <div>
                  <input
                    type="text"
                    id="InvoiceNo"
                    name="InvoiceNo"
                    value={InvoiceNo}
                    onChange={(e) => setInvoiceNo(e.target.value)}
                    style={{ background: "#f5f5f5" }}
                    className="salesinvoice-control"
                    placeholder="Enter Invoice No"
                    disabled={isEditing} // Prevent editing in update mode
                  />
                </div>

                <div>
                  {errors.InvoiceNo && (
                    <b className="error-text">{errors.InvoiceNo}</b>
                  )}
                </div>
              </div>

              <div>
                <label className="salesinvoice-label">
                  Invoice Date <b className="required">*</b>
                </label>
                <div>
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DatePicker
                      value={invoicesafedate}
                      onChange={handleDateChange1}
                      format="DD-MM-YYYY"
                      slotProps={{
                        textField: {
                          size: "small",
                          fullWidth: true,
                          error: !!inverror,
                          helperText: inverror,
                        },
                      }}
                      sx={{
                        marginTop: "10px",
                        marginBottom: "5px",
                        width: "250px",
                      }}
                    />
                  </LocalizationProvider>
                </div>

                <div>
                  {errors.invoicesafedate && (
                    <b className="error-text">{errors.invoicesafedate}</b>
                  )}
                </div>
              </div>

              <div>
                <label className="salesinvoice-label">
                  {" "}
                  Account <b className="required">*</b>
                </label>
                <div>
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
                        placeholder="Select Acc id"
                        size="small"
                        margin="none"
                        fullWidth
                      />
                    )}
                    sx={{ mt: 1.25, mb: 0.625, width: 400 }} // Equivalent to 10px and 5px
                  />
                </div>
                <div>
                  {errors.AccountId && (
                    <b className="error-text">{errors.AccountId}</b>
                  )}
                </div>
              </div>

              <div>
                <label className="salesinvoice-label">
                  {" "}
                  Challan <b className="required">*</b>
                </label>
                <div>
                  <Autocomplete
                    options={challanOptions}
                    value={
                      challanOptions.find(
                        (option) => option.value === ChallanId
                      ) || null
                    }
                    onChange={(event, newValue) => {
                      const selectedId = newValue ? newValue.value : null;
                      setChallanId(selectedId);
                      if (selectedId) {
                        fetchChallanDetails(selectedId); // ← Call API on select
                      }
                    }}
                    getOptionLabel={(option) => option.label} // Display only label in dropdown
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        placeholder="Select Challan id"
                        size="small"
                        margin="none"
                        fullWidth
                      />
                    )}
                    sx={{ mt: 1.25, mb: 0.625, width: 170 }} // Equivalent to 10px and 5px
                  />
                </div>
                <div>
                  {errors.ChallanId && (
                    <b className="error-text">{errors.ChallanId}</b>
                  )}
                </div>
              </div>

              <div>
                <label className="salesinvoice-label">
                  Order No <b className="required">*</b>
                </label>
                <div>
                  <input
                    type="text"
                    id="OrderNo"
                    name="OrderNo"
                    value={OrderNo}
                    onChange={(e) => setOrderNo(e.target.value)}
                    maxLength={20}
                    className="salesinvoice-control"
                    placeholder="Enter Order No"
                  />
                </div>

                <div>
                  {errors.OrderNo && (
                    <b className="error-text">{errors.OrderNo}</b>
                  )}
                </div>
              </div>

              <div>
                <label className="salesinvoice-label">
                  Order Date <b className="required">*</b>
                </label>
                <div>
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DatePicker
                      value={ordersafedate}
                      onChange={handleDateChange2}
                      format="DD-MM-YYYY"
                      slotProps={{
                        textField: {
                          size: "small",
                          fullWidth: true,
                          error: !!ordererror,
                          helperText: ordererror,
                        },
                      }}
                      sx={{
                        marginTop: "10px",
                        marginBottom: "5px",
                        width: "250px",
                      }}
                    />
                  </LocalizationProvider>
                </div>
                <div>
                  {errors.ordersafedate && (
                    <b className="error-text">{errors.ordersafedate}</b>
                  )}
                </div>
              </div>

              <div>
                <label className="salesinvoice-label">
                  Receipt No <b className="required">*</b>
                </label>
                <div>
                  <input
                    type="text"
                    id="ReceiptNo"
                    name="ReceiptNo"
                    value={ReceiptNo}
                    onChange={(e) => setReceiptNo(e.target.value)}
                    maxLength={20}
                    className="salesinvoice-control"
                    placeholder="Enter Receipt No"
                  />
                </div>

                <div>
                  {errors.ReceiptNo && (
                    <b className="error-text">{errors.ReceiptNo}</b>
                  )}
                </div>
              </div>

              <div>
                <label className="salesinvoice-label">
                  Receipt Date <b className="required">*</b>
                </label>
                <div>
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DatePicker
                      value={receiptsafedate}
                      onChange={handleDateChange3}
                      format="DD-MM-YYYY"
                      slotProps={{
                        textField: {
                          size: "small",
                          fullWidth: true,
                          error: !!receipterror,
                          helperText: receipterror,
                        },
                      }}
                      sx={{
                        marginTop: "10px",
                        marginBottom: "5px",
                        width: "250px",
                      }}
                    />
                  </LocalizationProvider>
                </div>

                <div>
                  {errors.receiptsafedate && (
                    <b className="error-text">{errors.receiptsafedate}</b>
                  )}
                </div>
              </div>

              <div>
                <label className="salesinvoice-label">
                  Receipt Send Through <b className="required">*</b>
                </label>
                <div>
                  <input
                    type="text"
                    id="ReceiptSendThrough"
                    name="ReceiptSendThrough"
                    value={ReceiptSendThrough}
                    onChange={(e) => setReceiptSendThrough(e.target.value)}
                    className="salesinvoice-control"
                    placeholder="Enter Receipt send through"
                  />
                </div>

                <div>
                  {errors.ReceiptSendThrough && (
                    <b className="error-text">{errors.ReceiptSendThrough}</b>
                  )}
                </div>
              </div>

              <div>
                <label className="salesinvoice-label">
                  Parcel Send Through <b className="required">*</b>
                </label>
                <div>
                  <input
                    type="text"
                    id="ParcelSendThrough"
                    name="ParcelSendThrough"
                    value={ParcelSendThrough}
                    onChange={(e) => setParcelSendThrough(e.target.value)}
                    className="salesinvoice-control"
                    placeholder="Enter parcel send through"
                  />
                </div>

                <div>
                  {errors.ParcelSendThrough && (
                    <b className="error-text">{errors.ParcelSendThrough}</b>
                  )}
                </div>
              </div>

              <div>
                <label className="salesinvoice-label">
                  Bundles <b className="required">*</b>
                </label>
                <div>
                  <input
                    type="number"
                    id="Bundles"
                    name="Bundles"
                    value={Bundles}
                    onChange={(e) => setBundles(e.target.value)}
                    className="salesinvoice-control"
                    placeholder="Enter Bundles"
                  />
                </div>

                <div>
                  {errors.Bundles && (
                    <b className="error-text">{errors.Bundles}</b>
                  )}
                </div>
              </div>

              <div>
                <label className="salesinvoice-label">
                  Weight <b className="required">*</b>
                </label>
                <div>
                  <input
                    type="text"
                    id="Weight"
                    name="Weight"
                    value={Weight}
                    onChange={(e) => {
                      const value = e.target.value;

                      // Regex to validate decimal numbers with at most 18 digits total and 2 decimal places
                      const regex = /^\d{0,18}(\.\d{0,3})?$/;

                      // Check if the value matches the regex
                      if (value === "" || regex.test(value)) {
                        setWeight(value);
                      }
                    }}
                    className="salesinvoice-control"
                    placeholder="Enter Weight"
                  />
                </div>

                <div>
                  {errors.Weight && (
                    <b className="error-text">{errors.Weight}</b>
                  )}
                </div>
              </div>

              <div>
                <label className="salesinvoice-label">
                  Freight <b className="required">*</b>
                </label>
                <div>
                  <input
                    type="text"
                    id="Freight"
                    name="Freight"
                    value={Freight}
                    onChange={(e) => {
                      const value = e.target.value;

                      // Regex to validate decimal numbers with at most 18 digits total and 2 decimal places
                      const regex = /^\d{0,18}(\.\d{0,2})?$/;

                      // Check if the value matches the regex
                      if (value === "" || regex.test(value)) {
                        setFreight(value);
                      }
                    }}
                    className="salesinvoice-control"
                    placeholder="Enter Freight"
                  />
                </div>

                <div>
                  {errors.Freight && (
                    <b className="error-text">{errors.Freight}</b>
                  )}
                </div>
              </div>

              <div>
                <label className="salesinvoice-label">
                  Packing <b className="required">*</b>
                </label>
                <div>
                  <input
                    type="text"
                    id="Packing"
                    name="Packing"
                    value={Packing}
                    onChange={(e) => {
                      const value = e.target.value;

                      // Regex to validate decimal numbers with at most 18 digits total and 2 decimal places
                      const regex = /^\d{0,18}(\.\d{0,2})?$/;

                      // Check if the value matches the regex
                      if (value === "" || regex.test(value)) {
                        setPacking(value);
                      }
                    }}
                    className="salesinvoice-control"
                    placeholder="Enter Packing"
                  />
                </div>

                <div>
                  {errors.Packing && (
                    <b className="error-text">{errors.Packing}</b>
                  )}
                </div>
              </div>
            </form>

            <div className="salesinvoice-table">
              <table>
                <thead>
                  <tr sx={{ height: "10px" }}>
                    <th>Sr No</th>
                    <th>
                      Book Code<b className="required">*</b>
                    </th>

                    <th>
                      Book Name <b className="required">*</b>
                    </th>
                    <th>
                      Copies <b className="required">*</b>
                    </th>
                    <th>
                      Price <b className="required">*</b>
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
                    <th>Final Amount</th>
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
                            sx={{ width: 500 }} // Set width
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
                                    padding: "16px", // Adjust padding for better alignment
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
                              width: "80px",
                            }}
                            placeholder="Copies"
                            className="salesinvoice-control"
                          />
                        </td>
                        <td>
                          <td>
                            <input
                              type="number"
                              value={row.Rate}
                              readOnly
                              style={{ width: "100px" }}
                              className="salesinvoice-control"
                            />
                          </td>
                        </td>
                        <td>
                          <input
                            type="number"
                            value={row.DiscountPercentage}
                            onChange={(e) => {
                              const value = e.target.value;
                              const regex = /^\d{0,18}(\.\d{0,2})?$/;
                              if (value === "" || regex.test(value)) {
                                handleInputChange(
                                  index,
                                  "DiscountPercentage",
                                  value
                                );
                              }
                            }}
                            style={{
                              width: "80px",
                            }}
                            placeholder="Discount %"
                            className="salesinvoice-control"
                          />
                        </td>
                        <td>
                          <input
                            type="number"
                            value={row.DiscountAmount}
                            readOnly
                            style={{
                              width: "120px",
                            }}
                            placeholder="Discount Amount"
                            className="salesinvoice-control"
                          />
                        </td>
                        <td>
                          <input
                            type="number"
                            value={row.Amount}
                            readOnly
                            style={{
                              width: "120px",
                            }}
                            placeholder="Amount"
                            className="salesinvoice-control"
                          />
                        </td>
                        <td>
                          <input
                            type="number"
                            value={row.FinalAmount}
                            readOnly
                            style={{
                              width: "120px",
                            }}
                            placeholder="Final Amount"
                            className="salesinvoice-control"
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
            <form className="salesinvoice-form">
              <div>
                <label className="salesinvoice-label">
                  SGST % <b className="required">*</b>
                </label>
                <div>
                  <input
                    type="number"
                    id="SGSTPercentage"
                    name="SGSTPercentage"
                    value={SGSTPercentage}
                    onChange={(e) => setSGSTPercentage(e.target.value)}
                    className="salesinvoice-control"
                    placeholder="Enter Sgst %"
                  />
                </div>

                {/* <div>
                  {errors.SGSTPercentage && (
                    <b className="error-text">{errors.SGSTPercentage}</b>
                  )}
                </div> */}
              </div>
              <div>
                <label className="salesinvoice-label">
                  SGST Amount <b className="required">*</b>
                </label>
                <div>
                  <input
                    type="number"
                    id="SGSTAmount"
                    name="SGSTAmount"
                    value={SGSTAmount}
                    onChange={(e) => setSGSTAmount(e.target.value)}
                    className="salesinvoice-control"
                    placeholder="Enter sgst amount"
                  />
                </div>

                {/* <div>
                  {errors.SGSTAmount && (
                    <b className="error-text">{errors.SGSTAmount}</b>
                  )}
                </div> */}
              </div>
              <div>
                <label className="salesinvoice-label">
                  CGST % <b className="required">*</b>
                </label>
                <div>
                  <input
                    type="number"
                    id="CGSTPercentage"
                    name="CGSTPercentage"
                    value={CGSTPercentage}
                    onChange={(e) => setCGSTPercentage(e.target.value)}
                    className="salesinvoice-control"
                    placeholder="Enter cgst %"
                  />
                </div>

                {/* <div>
                  {errors.CGSTPercentage && (
                    <b className="error-text">{errors.CGSTPercentage}</b>
                  )}
                </div> */}
              </div>
              <div>
                <label className="salesinvoice-label">
                  CGST Amount <b className="required">*</b>
                </label>
                <div>
                  <input
                    type="number"
                    id="CGSTAmount"
                    name="CGSTAmount"
                    value={CGSTAmount}
                    onChange={(e) => setCGSTAmount(e.target.value)}
                    className="salesinvoice-control"
                    placeholder="Enter cgst amount"
                  />
                </div>

                {/* <div>
                  {errors.CGSTAmount && (
                    <b className="error-text">{errors.CGSTAmount}</b>
                  )}
                </div> */}
              </div>
              <div>
                <label className="salesinvoice-label">
                  IGST % <b className="required">*</b>
                </label>
                <div>
                  <input
                    type="text"
                    id="IGSTPercentage"
                    name="IGSTPercentage"
                    value={IGSTPercentage}
                    onChange={(e) => setIGSTPercentage(e.target.value)}
                    className="salesinvoice-control"
                    placeholder="Enter IGST %"
                  />
                </div>

                {/* <div>
                  {errors.IGSTPercentage && (
                    <b className="error-text">{errors.IGSTPercentage}</b>
                  )}
                </div> */}
              </div>
              <div>
                <label className="salesinvoice-label">
                  IGST Amount <b className="required">*</b>
                </label>
                <div>
                  <input
                    type="number"
                    id="IGSTAmount"
                    name="IGSTAmount"
                    value={IGSTAmount}
                    onChange={(e) => setIGSTAmount(e.target.value)}
                    className="salesinvoice-control"
                    placeholder="Enter igst amount"
                  />
                </div>

                {/* <div>
                  {errors.IGSTAmount && (
                    <b className="error-text">{errors.IGSTAmount}</b>
                  )}
                </div> */}
              </div>

              <div>
                <label className="salesinvoice-label">
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

                {/* <div>
                  {errors.Total && <b className="error-text">{errors.Total}</b>}
                </div> */}
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
              <u>Sales Invoice</u>
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
export default Salesinvoice;
