import React, { useState, useMemo, useEffect, useRef } from "react";
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
  const [ReceivedHereOn, setReceivedHereOn] = useState("");
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
  const [Total, setTotal] = useState(0);
  const [addresses, setAddresses] = useState([]);
  const [GSTNo, setGSTNo] = useState("");
 const [Cash, setCash] = useState(false);
const [Credit, setCredit] = useState(true); // boolean

  const [OnSale, setOnSale] = useState(false);
  const [paymentType, setPaymentType] = useState("ToPay");
  const [invoiceType, setInvoiceType] = useState("Credit"); // ✅ default Credit

  // possible values: "ToPay" | "Paid"

  const [Remarks, setRemarks] = useState("");
  const [isLocalGST, setIsLocalGST] = useState(false); // true → SGST+CGST, false → IGST

  const [editingIndex, setEditingIndex] = useState(-1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [id, setId] = useState("");

  const [invoicedetailId, setInvoicedetailId] = useState("");
  const [errors, setErrors] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [invoiceheaders, setInvoiceheaders] = useState([]);
  const [invoicedetails, setInvoiceDetails] = useState([]);
  const [challandetails, setChallandetails] = useState([]);
  const [dispatchmodeOptions, setDispatchmodeoptions] = useState([]);
  const [Transport, setTransport] = useState("");
  const [isPrinting, setIsPrinting] = useState(false);
  const [isPrintingModalOpen, setIsPrintingModalOpen] = useState(false); // For print modal
  const [printData, setPrintData] = useState(null); // Data to print

  //Dropdown for ID's
  const [bookOptions, setBookOptions] = useState([]);
  const [accountOptions, setAccountOptions] = useState([]);
  const [canvassorOptions, setCanvassorOptions] = useState([]);
  const [CanvassorId, setCanvassorId] = useState(null);
  const [challanOptions, setChallanOptions] = useState([]);

  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [deleteIndex, setDeleteIndex] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const [selectedFooter, setSelectedFooter] = useState([]);
  const [TaxableAmount, setTaxableAmount] = useState(0)

const showSalesSection = Boolean(ChallanId);

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
  const [footerRows, setFooterRows] = useState([]);

  useEffect(() => {
    // fetchInvoiceheaders();
    fetchInvoicedetails();
    fetchBooks();
    fetchAccounts();
    fetchChallans();
    fetchAddresses();
    fetchDispatchmodes();
    fetchCanvassors();
  }, []);

  useEffect(() => {
    fetchInvoiceheaders();
    console.log("this function is called");
  }, [pageIndex]); // Fetch data when page changes

  const fetchInvoiceheaders = async () => {
    try {
      const response = await axios.get(
        `https://publication.microtechsolutions.net.in/php/get/gettblpage.php?Table=InvoiceHeader&PageNo=${pageIndex}`,
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
        "https://publication.microtechsolutions.net.in/php/gettable.php?Table=InvoiceDetail",
      );
      // console.log(response.data, 'response of purchase return details')
      setInvoiceDetails(response.data);
    } catch (error) {
      // toast.error("Error fetching Invoice details:", error);
    }
  };

  const [rowFinalTotal, setRowFinalTotal] = useState(0);
  const [rowTotal, setRowTotal] = useState(0);

useEffect(() => {
  calculateTotals();
}, [rows, footerRows]);





const calculateTotals = () => {
  const safeRows = Array.isArray(rows) ? rows : [];
  const safeFooter = Array.isArray(footerRows) ? footerRows : [];

  // 1️⃣ Base total (after item discount)
  const rowFinalTotal = safeRows.reduce(
    (sum, row) => sum + (Number(row.FinalAmount) || 0),
    0
  );

  // 2️⃣ Footer impact (ADD / LESS / COMMISSION / ABS)
const footerImpact = safeFooter.reduce((sum, row) => {
  if (!row.IsApplicable) return sum;
  return sum + (Number(row.Amount) || 0);
}, 0);



  // 3️⃣ Subtotal after footer
  const subTotalAfterFooter = rowFinalTotal + footerImpact;

  // 4️⃣ GST
  const sgstAmt = isLocalGST
    ? (subTotalAfterFooter * (Number(SGSTPercentage) || 0)) / 100
    : 0;

  const cgstAmt = isLocalGST
    ? (subTotalAfterFooter * (Number(CGSTPercentage) || 0)) / 100
    : 0;

  const igstAmt = !isLocalGST
    ? (subTotalAfterFooter * (Number(IGSTPercentage) || 0)) / 100
    : 0;

  const grandTotal =
    subTotalAfterFooter + sgstAmt + cgstAmt + igstAmt;

  // 5️⃣ Update states
  setRowFinalTotal(rowFinalTotal.toFixed(2));
  setTaxableAmount(subTotalAfterFooter.toFixed(2));
  setSGSTAmount(sgstAmt.toFixed(2));
  setCGSTAmount(cgstAmt.toFixed(2));
  setIGSTAmount(igstAmt.toFixed(2));
  setTotal(grandTotal.toFixed(2));
};


//  const calculateTotals = () => {
//   const safeRows = Array.isArray(rows) ? rows : [];

//     const rowSubtotal = safeRows.reduce((acc, row) => acc + (Number(row.FinalAmount) || 0), 0);

//   const taxable = rows.reduce(
//     (sum, row) => sum + Number(row.Amount || 0),
//     0
//   );

//   const footerTotal = footerRows.reduce(
//     (sum, f) => sum + Number(f.Amount || 0),
//     0
//   );

//   setRowFinalTotal(rowSubtotal)
//   setTaxableAmount(taxable.toFixed(2));
//   setTotal((taxable + footerTotal).toFixed(2));
// };




 const calculateFooterAdjustment = (subtotal, footerRows) => {
  const safeFooterRows = Array.isArray(footerRows) ? footerRows : [];
  let adjustment = 0;

  safeFooterRows.forEach((row) => {
    const perc = Number(row.Percentage) || 0;
    const amt = Number(row.Amount) || 0;

    // If Amount is zero, use Percentage of subtotal
    const safeAmount = amt !== 0 ? amt : (perc > 0 ? (subtotal * perc) / 100 : 0);

    switch (row.CalcType) {
      case "ADD":
      case "ABS":
        adjustment += safeAmount;
        break;

      case "LESS":
      case "COMMISSION":
        adjustment -= safeAmount;
        break;

      default:
        break;
    }
  });

  return adjustment;
};



 


 

  const handleInputChange = (index, field, value) => {
    const updatedRows = [...rows];
    updatedRows[index][field] = value;

    // ✅ Only update rate if BookId changes
    if (field === "BookId") {
      const selectedBook = bookOptions.find(
        (book) => book.value === updatedRows[index].BookId,
      );
      updatedRows[index].Rate = selectedBook
        ? parseFloat(selectedBook.price) || 0
        : 0;
    }

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

    setRows(updatedRows);

// calculateTotals();
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
    // calculateTotals();
  };

  // const handleDeleteRow = (index) => {
  //   const updatedRows = rows.filter((_, i) => i !== index);
  //   setRows(updatedRows);
  //   calculateTotals();
  // };

  const handleDeleteRow = async (index) => {
    const rowToDelete = rows[index];

    // If row does not have ID, remove it directly (new unsaved row)
    if (!rowToDelete.Id) {
      const updatedRows = rows.filter((_, i) => i !== index);
      setRows(updatedRows);
      return;
    }

    try {
      const apiUrl =
        "https://publication.microtechsolutions.co.in/php/delete/delrecord.php";

      const formData = new FormData();
      formData.append("Id", rowToDelete.Id);
      formData.append("Table", "Invoicedetail");

      const response = await axios.post(apiUrl, formData);

      // Convert response to string (API may return text)
      const resText = JSON.stringify(response.data).toLowerCase();

      if (resText.includes("deleted")) {
        const updatedRows = rows.filter((_, i) => i !== index);
        setRows(updatedRows);
        toast.success("Row deleted successfully!");
      } else {
        toast.error("Failed to delete row!");
      }
    } catch (error) {
      toast.error("Error deleting row!");
    }
  };

  const fetchBooks = async () => {
    try {
      const response = await axios.get(
        "https://publication.microtechsolutions.net.in/php/Bookget.php",
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
      // 1) fetch account master
      const respAcc = await axios.get(
        "https://publication.microtechsolutions.net.in/php/Accountget.php",
      );
      const accountOptionsFromMaster = (respAcc.data || []).map((acc) => ({
        value: acc.Id,
        label: acc.AccountName,
      }));

      // build a map for quick lookup
      const accountMap = new Map(
        accountOptionsFromMaster.map((a) => [String(a.value), a]),
      );

      // // 2) fetch recent challans (only need AccountId from challans)
      // const challansResp = await axios.get(
      //   "https://publication.microtechsolutions.net.in/php/gettable.php?Table=SellsChallanHeader",
      // );
      // const challans = challansResp.data || [];

      // // find unique account ids used in challans
      // const challanAccountIds = Array.from(
      //   new Set(challans.map((c) => String(c.AccountId)).filter(Boolean)),
      // );


      // 2) Fetch challans
    const challansResp = await axios.get(
      "https://publication.microtechsolutions.net.in/php/gettable.php?Table=SellsChallanHeader",
    );
    const challans = challansResp.data || [];

    // --- NEW FILTER LOGIC ---
    // Only consider accounts that have at least one challan where IsInvoice is NOT 1
    const activeChallanAccountIds = Array.from(
      new Set(
        challans
          .filter((c) => {
            // Check if IsInvoice is 0 or null (not converted yet)
            // Note: handles both string "1" and number 1
            return String(c.IsInvoice) !== "1"; 
          })
          .map((c) => String(c.AccountId))
          .filter(Boolean)
      ),
    );

      // 3) for any challan AccountId not present in master, try to fetch Account by Id
      const missingIds = activeChallanAccountIds.filter((id) => !accountMap.has(id));

      if (missingIds.length > 0) {
        // fetch each missing account's details (parallel)
        const fetches = missingIds.map((id) =>
          axios
            .get(
              `https://publication.microtechsolutions.net.in/php/get/getbycolm.php?Table=Account&Colname=Id&Colvalue=${id}`,
            )
            .then((r) => ({ id, data: r.data }))
            .catch(() => ({ id, data: null })),
        );

        const results = await Promise.all(fetches);
        results.forEach((r) => {
          if (Array.isArray(r.data) && r.data.length > 0) {
            const a = r.data[0];
            const option = {
              value: a.Id,
              label: a.AccountName || `Account ${a.Id}`,
            };
            accountMap.set(String(a.Id), option);
          } else {
            // fallback - show the numeric AccountId as label if we couldn't fetch a name
            accountMap.set(String(r.id), {
              value: r.id,
              label: `Account ${r.id}`,
            });
          }
        });
      }

      // 4) create final merged list WITH PRIORITY
      const allAccounts = Array.from(accountMap.values());

      // challan IDs should appear first
      const priorityAccounts = [];
      const normalAccounts = [];

      // place challan accounts first in same order they appear
      activeChallanAccountIds.forEach((id) => {
        const acc = accountMap.get(String(id));
        if (acc) priorityAccounts.push(acc);
      });

      // add remaining accounts (avoid duplicates)
      allAccounts.forEach((acc) => {
        if (!activeChallanAccountIds.includes(String(acc.value))) {
          normalAccounts.push(acc);
        }
      });

      // final order: recent challans → then other accounts
      // Only include accounts present in Challans
      const mergedOptions = [...priorityAccounts, ...normalAccounts]
        // show only challan accounts
        .filter((acc) => activeChallanAccountIds.includes(String(acc.value)))
        // remove accounts which already have invoices
        .filter((acc) => !invoiceheaders.includes(String(acc.value)));

      setAccountOptions(mergedOptions);
    } catch (error) {
      console.error("Error fetching accounts+challans:", error);
      // Fallback to whatever you had earlier
      try {
        const resp = await axios.get(
          "https://publication.microtechsolutions.net.in/php/Accountget.php",
        );
        const accountOptions = resp.data.map((acc) => ({
          value: acc.Id,
          label: acc.AccountName,
        }));
        setAccountOptions(accountOptions);
      } catch (e) {
        console.error("Fallback account fetch also failed", e);
      }
    }
  };

  const fetchAddresses = async (Accid) => {
    try {
      const response = await axios.get(
        `https://publication.microtechsolutions.net.in/php/get/getbycolm.php?Table=Address&Colname=AccountId&Colvalue=${Accid}`,
      );
      const addressOptions = response.data.map((add) => ({
        value: add.Id,
        label: add.GSTNo,
        gst: add.Address1,
      }));
      setAddresses(addressOptions);
    } catch (error) {
      // toast.error("Error fetching Address:", error);
    }
  };

  const fetchChallans = async () => {
    try {
      const response = await axios.get(
        "https://publication.microtechsolutions.net.in/php/gettable.php?Table=SellsChallanHeader",
      );
      const challanOptions = response.data
        .filter(
          (challan) =>
            (challan.Active === "1" || challan.Active === 1) &&
            (challan.IsInvoice === "0" || challan.IsInvoice === 0),
        )
        .map((challan) => ({
          value: challan.Id,
          label: challan.ChallanNo,
        }));
      setChallanOptions(challanOptions);
    } catch (error) {
      // toast.error("Error fetching challans:", error);
    }
  };

  const fetchChallanDetails = async (selectedChallanId) => {
    try {
      const response = await axios.get(
        `https://publication.microtechsolutions.net.in/php/get/getbycolm.php?Table=SellsChallanDetail&Colname=ChallanId&Colvalue=${selectedChallanId}`,
      );

      const challanRows = response.data;

      // 🔥 Fetch all rows in parallel using Promise.all (this is the fix)
      const finalRows = await Promise.all(
        challanRows.map(async (item) => {
          const bookResp = await axios.get(
            `https://publication.microtechsolutions.net.in/php/get/getbycolm.php?Table=Book&Colname=Id&Colvalue=${item.BookId}`,
          );

          const book = bookResp.data[0] || {};

          const rate = Number(book.BookRate) || 0;
          const copies = Number(item.Copies) || 0;
          const discount = Number(item.DiscountPercentage) || 0;

          return {
            BookId: item.BookId,
            BookCode: book.BookCode || "",
            BookName: book.BookName || book.BookNameMarathi || "",
            Rate: rate,
            Copies: copies,
            Amount: copies * rate,
            DiscountPercentage: discount,
            FinalAmount: (copies * rate * (100 - discount)) / 100,
          };
        }),
      );

      setRows(finalRows);
    } catch (error) {
      toast.error("Error fetching challan details");
    }
  };

  const fetchDispatchmodes = async () => {
    try {
      const response = await axios.get(
        "https://publication.microtechsolutions.net.in/php/Dispatchmodeget.php",
      );
      const dispatchmodeOptions = response.data.map((dispmode) => ({
        value: dispmode.Id,
        label: dispmode.DispatchModeName,
      }));
      setDispatchmodeoptions(dispatchmodeOptions);
    } catch (error) {
      // toast.error("Error fetching parcels:", error);
    }
  };

  const fetchCanvassors = async () => {
    try {
      const response = await axios.get(
        "https://publication.microtechsolutions.net.in/php/get/getCanvassorMaster.php",
      );
      const canvassorOptions = response.data.map((can) => ({
        value: can.Id,
        label: can.CanvassorName,
      }));
      setCanvassorOptions(canvassorOptions);
    } catch (error) {
      // toast.error("Error fetching canvassors:", error);
    }
  };

  const resetForm = () => {
    setInvoiceNo("");
    // setInvoiceDate("");
    setInvoicesafedate(dayjs());
    setInverror("");
    setAccountId("");
    setGSTNo("");
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
    setPacking("");
    setReceiptSendThrough("");
    setParcelSendThrough("");
    setCGSTPercentage("");
    setCGSTAmount("");
    setSGSTAmount("");
    setSGSTPercentage("");
    setIGSTAmount("");
    setIGSTPercentage("");
    setTransport("");
    setRemarks("");
    setCanvassorId("")
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
}, [
  rows,
  footerRows,
  SGSTPercentage,
  CGSTPercentage,
  IGSTPercentage,
  isLocalGST,
]);


  const handleNewClick = () => {
    resetForm();

    // open modal instantly
    setIsModalOpen(true);
    setIsEditing(false);
    setEditingIndex(-1);

    // fetch in background (does not delay modal)
    fetchAccounts();
    fetchChallans();
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
      (detail) => detail.InvoiceId === invoiceheader.Id,
    );

    console.log(invoicedetail, "invoice details");

    // Map the details to rows
    let mappedRows = invoicedetail.map((detail) => ({
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

    setInvoiceNo(invoiceheader.InvoiceNo);
    setInvoicesafedate(invoicedate);
    setAccountId(invoiceheader.AccountId);
    setChallanId(invoiceheader.ChallanId);
    setCash(invoiceheader.Cash === 1);
    setCredit(invoiceheader.Credit === 1);
    setReceiptNo(invoiceheader.ReceiptNo);
    setReceiptsafedate(receiptdate);
    setWeight(invoiceheader.Weight);
    setBundles(invoiceheader.Bundles);
    setFreight(invoiceheader.Freight);
    setPacking(invoiceheader.Packing);
    setOrderNo(invoiceheader.OrderNo);
    setOrdersafedate(orderdate);
    setreceivedhereon(dayjs(invoiceheader.ReceivedHereOn?.date));
    setPaymentType(invoiceheader.ToPay === 1 ? "ToPay" : "Paid");
    setReceiptSendThrough(invoiceheader.ReceiptSendThrough);
    setParcelSendThrough(invoiceheader.ParcelSendThrough);
    setCGSTPercentage(invoiceheader.CGSTPercentage);
    setCGSTAmount(invoiceheader.CGSTAmount);
    setSGSTAmount(invoiceheader.SGSTAmount);
    setSGSTPercentage(invoiceheader.SGSTPercentage);
    setIGSTAmount(invoiceheader.IGSTAmount);
    setIGSTPercentage(invoiceheader.IGSTPercentage);
    setTransport(invoiceheader.DispatchId);
    setCanvassorId(invoiceheader.CanvassorId);
    setRemarks(invoiceheader.Remarks);
    setTotal(invoiceheader.Total);

    setRows(mappedRows);

    setEditingIndex(currentRow.index);
    setIsModalOpen(true);
    setIsEditing(true);
    setId(invoiceheader.Id);
    handleMenuClose();

    // Determine which specific detail to edit
    const specificDetail = invoicedetail.find(
      (detail) => detail.Id === currentRow.original.Id,
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
    try {
      const response = await fetch(
        `https://publication.microtechsolutions.net.in/php/Bookcodeget.php?BookCode=${bookCode}`,
      );

      const data = await response.json();

      if (Array.isArray(data) && data.length > 0) {
        const book = data[0];

        const updatedRows = [...rows];
        updatedRows[rowIndex].BookName =
          book.BookName || book.BookNameMarathi || "";
        updatedRows[rowIndex].Rate = book.BookRate || 0;

        // **FIXED**
        updatedRows[rowIndex].BookId = book.Id || "";

        setRows(updatedRows);
      } else {
        toast.error("Invalid Book Code");
      }
    } catch (err) {
      toast.error("Failed to fetch Book");
    }
  };

  const [invoicesafedate, setInvoicesafedate] = useState(dayjs());
  const [inverror, setInverror] = useState("");
  const [ordersafedate, setOrdersafedate] = useState(dayjs());
  const [ordererror, setOrdererror] = useState("");
  const [receiptsafedate, setReceiptsafedate] = useState(dayjs());
  const [receipterror, setReceipterror] = useState("");
  const [receivedhereon, setreceivedhereon] = useState(dayjs());
  const [receivederror, setreceivederror] = useState("");

  const handleDateChange1 = (newValue) => {
    if (!newValue || !dayjs(newValue).isValid()) {
      setInverror("Invalid date");
      setInvoicesafedate(null);
      return;
    }

    setDateError("");
    setInvoicesafedate(newValue);
  };

  const handleDateChange2 = (newValue) => {
    if (!newValue || !dayjs(newValue).isValid()) {
      setOrdererror("Invalid date");
      setOrdersafedate(null);
      return;
    }

    setDateError("");

    setOrdersafedate(newValue);
  };

  const handleDateChange3 = (newValue) => {
    if (!newValue || !dayjs(newValue).isValid()) {
      setReceipterror("Invalid date");
      setReceiptsafedate(null);
      return;
    }

    setDateError("");

    setReceiptsafedate(newValue);
  };

  const handleDateChange4 = (newValue) => {
    if (!newValue || !dayjs(newValue).isValid()) {
      setreceivederror("Invalid date");
      setreceivedhereon(null);
      return;
    }

    setDateError("");

    setReceiptsafedate(newValue);
  };
  useEffect(() => {
    if (!footerRows.length) {
      setCalculatedFooter([]);
      return;
    }

    const calculated = footerRows.map((row) => ({
      Particular: row.Particulars, // display only
      Percentage: Number(row.Percentage || 0), // display only
      calculatedAmount: Number(row.Amount || 0), // ✅ DIRECT VALUE
    }));

    setCalculatedFooter(calculated);
  }, [footerRows]);

  const handleAccountChange = async (event, newValue) => {
    const selectedId = newValue ? newValue.value : null;
    setAccountId(selectedId);

    // 🔹 Reset GST values every time before applying new logic
    setGSTNo("");
    setSGSTAmount("");
    setSGSTPercentage("");
    setCGSTPercentage("");
    setCGSTAmount("");
    setIGSTAmount("");
    setIGSTPercentage("");
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
              setIGSTPercentage(0);
              setIGSTAmount(0);
            } else {
              // Other states → IGST
              setIsLocalGST(false);
              setSGSTPercentage(0);
              setSGSTAmount(0);
              setCGSTPercentage(0);
              setCGSTAmount(0);
            }
          }
        }

        // ------------------------------
        // 2. Fetch challans by AccountId
        // ------------------------------
        const challanRes = await axios.get(
          `https://publication.microtechsolutions.net.in/php/get/getbycolm.php?Table=SellsChallanHeader&Colname=AccountId&Colvalue=${selectedId}`,
        );

        if (challanRes.data) {
          setChallanOptions(
            challanRes.data
              .filter(
                (challan) => challan.Active === "1" || challan.Active === 1,
              )
              .map((c) => ({
                value: c.Id,
                label: c.ChallanNo,
              })),
          );
          console.log(challanOptions, "challan no");
        }

        /* =====================================
       3️⃣ FETCH SALES FOOTER (NEW)
    ===================================== */
        const footerRes = await axios.get(
          `https://publication.microtechsolutions.net.in/php/get/getbycolm.php?Table=AccountMasterSalesInfo&Colname=AccountId&Colvalue=${selectedId}`,
        );

        if (footerRes.data) {
          const applicableRows = footerRes.data.filter(
            (r) => r.IsApplicable === 1 || r.IsApplicable === "1",
          );

          setFooterRows(applicableRows);
  calculateTotals(); // 🔥 ADD THIS

          // setFooterRows(applicableRows);
        }

        // Reset previous challan selection
        setChallanId(null);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }
  };

  const [calculatedFooter, setCalculatedFooter] = useState([]);

  useEffect(() => {
    const onStorage = (e) => {
      if (e.key === "lastChallanSavedAt") {
        fetchAccounts();
        fetchChallans();
      }
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const isMinusParticular = (particulars = "") => {
  const p = particulars.trim().toUpperCase();
  return p.startsWith("LESS") || p === "COMMISSION";
};


const handleFooterChange = (index, field, value) => {
  setFooterRows(prev =>
    prev.map((row, i) => {
      if (i !== index) return row;

      let updatedRow = { ...row, [field]: value };

      const base = Number(rowFinalTotal || 0);
      const percentage = Number(updatedRow.Percentage || 0);

      const isMinus = isMinusParticular(row.Particulars);

      if (field === "Percentage") {
        let amt = (base * percentage) / 100;
        updatedRow.Amount = isMinus
          ? (-amt).toFixed(2)
          : amt.toFixed(2);
      }

      if (field === "Amount") {
        let amt = Number(value || 0);
        updatedRow.Amount = isMinus
          ? (-Math.abs(amt)).toFixed(2)
          : Math.abs(amt).toFixed(2);
      }

      return updatedRow;
    })
  );
};




const updateFooterRow = (index, field, value) => {
  const updated = [...footerRows];
  updated[index][field] = value === "" ? 0 : value;
  setFooterRows(updated);
  calculateTotals(); // 🔥 ADD THIS LINE
};




  const footerNetAmount = footerRows.reduce((sum, row) => {
    if (!row.IsApplicable) return sum;
    return sum + row.sign * Number(row.Amount || 0);
  }, 0);

  const footerImpact = footerRows.reduce((sum, row) => {
    return sum + row.sign * Number(row.Amount || 0);
  }, 0);


  const handleSubmit = async (e) => {
    e.preventDefault();
    // if (!validateForm()) return;

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
    const formattedReceivedHereOn = dayjs().format("YYYY-MM-DD");
    const toNumberOrNull = (val) => {
      const num = parseFloat(val);
      return isNaN(num) ? null : num;
    };

    const invoiceheaderData = {
      // ...(isEditing ? { Id: id } : {}), // only send Id if editing

      Id: isEditing ? id : "",

      InvoiceNo: InvoiceNo,
      InvoiceDate: formattedInvoiceDate,
      Cash: Cash ? 1 : 0,
      Credit: Credit ? 1 : 0,
      OnSale: OnSale ? 1 : 0,
      AccountId: AccountId,
      ChallanId: ChallanId,
      ReceiptNo: ReceiptNo,
      ReceiptDate: formattedReceiptDate,
      OrderNo: OrderNo,
      OrderDate: formattedOrderDate,
      ReceivedHereOn: formattedReceivedHereOn,
      DispatchId: Transport,
      ReceiptSendThrough: ReceiptSendThrough,
      ParcelSendThrough: ParcelSendThrough,
      Bundles: Bundles,

      Weight: Weight,
      Freight: Freight,
      Packing: Packing,
      ToPay: paymentType === "ToPay" ? 1 : 0,
      Paid: paymentType === "Paid" ? 1 : 0,
      SGSTPercentage: isLocalGST ? toNumberOrNull(SGSTPercentage) : 0,
      SGSTAmount: isLocalGST ? toNumberOrNull(SGSTAmount) : 0,
      CGSTPercentage: isLocalGST ? toNumberOrNull(CGSTPercentage) : 0,
      CGSTAmount: isLocalGST ? toNumberOrNull(CGSTAmount) : 0,
      IGSTPercentage: !isLocalGST ? toNumberOrNull(IGSTPercentage) : 0,
      IGSTAmount: !isLocalGST ? toNumberOrNull(IGSTAmount) : 0,
CanvassorId:CanvassorId,
Remarks: Remarks,
      Total: Total,
      IsInvoice: 1,
      CreatedBy: !isEditing ? userId : undefined,
      UpdatedBy: isEditing ? userId : undefined,
      // ...(!isEditing ? { CreatedBy: userId } : { UpdatedBy: userId }),
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
        },
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
      fetchInvoicedetails();
      setIsModalOpen(false);

      toast.success(
        isEditing
          ? "Invoice & Invoice Details updated successfully!"
          : "Invoice & Invoice Details added successfully!",
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
    navigate(
      `/transaction/salesinvoice/salesinvoiceprint/${currentRow.original.Id}`,
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


   

  const loadFooterMaster = async () => {
    const res = await axios.get(
      "https://publication.microtechsolutions.net.in/php/get/getAccountMasterSalesInfo.php",
    );

    const rows = res.data.AllSalesInfo.map((r) => {
      const name = r.Particulars.toLowerCase();

      const isMinus =
        name.startsWith("less") ||
        name.startsWith("abs") ||
        name.includes("commission");

      return {
        Particulars: r.Particulars,
        Percentage: 0,
        Amount: 0,
        sign: isMinus ? -1 : 1, // 🔥 ADD / LESS logic
      };
    });

    setFooterRows(rows);
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
    [invoiceheaders],
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
            <form className="salesinvoice-form" onSubmit={handleSubmit}>

              

             
              <div>
                <label className="salesinvoice-label">Invoice No</label>
                <div>
                  <input
                    type="number"
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
                <label className="salesinvoice-label">Invoice Date</label>
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

 {/* INVOICE TYPE (Cash / Credit) */}
<div style={{ marginTop: "10px" }}>
  <label className="salesinvoice-label">Type</label>

  <div
    style={{
      display: "flex",
      alignItems: "center",
      gap: "25px",
      marginTop: "6px",
      marginLeft: "5px",
    }}
  >
    <label style={{ display: "flex", alignItems: "center", gap: "6px" }}>
      <input
        type="radio"
        name="invoiceType"
        value="Cash"
        checked={invoiceType === "Cash"}
        onChange={(e) => setInvoiceType(e.target.value)}
      />
      Cash
    </label>

    <label style={{ display: "flex", alignItems: "center", gap: "6px" }}>
      <input
        type="radio"
        name="invoiceType"
        value="Credit"
        checked={invoiceType === "Credit"} // ✅ default
        onChange={(e) => setInvoiceType(e.target.value)}
      />
      Credit
    </label>
  </div>

  {errors.InvoiceType && (
    <b className="error-text">{errors.InvoiceType}</b>
  )}
</div>


              <div  >
               <label className="salesinvoice-label"> Account</label>
                <div>
                  <Autocomplete
                    options={accountOptions}
                    value={
                      accountOptions.find(
                        (option) => option.value === AccountId,
                      ) || null
                    }
                    onChange={handleAccountChange}
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
                    sx={{ mt: 1.25, mb: 0.625, width: 350 }} // Equivalent to 10px and 5px
                  />
                </div>
                <div>
                  {errors.AccountId && (
                    <b className="error-text">{errors.AccountId}</b>
                  )}
                </div>
              </div>

             

              <div>
                <label className="salesinvoice-label"> Challan</label>
                <div>
                  <Autocomplete
                    options={challanOptions}
                    value={
                      challanOptions.find(
                        (option) => option.value === ChallanId,
                      ) || null
                    }
                    onChange={(event, newValue) => {
                      const selectedId = newValue ? newValue.value : null;
                      setChallanId(selectedId);
                      if (selectedId) {
                        fetchChallanDetails(selectedId); // ← Call API on select
                      } else setChallanId(ChallanId);
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
                    sx={{ mt: 1.25, mb: 0.625, width: 230 }} // Equivalent to 10px and 5px
                  />
                </div>
                <div>
                  {errors.ChallanId && (
                    <b className="error-text">{errors.ChallanId}</b>
                  )}
                </div>
              </div>
 

              <div>
                <label className="salesinvoice-label">Receipt No</label>
                <div>
                  <input
                    type="number"
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
                <label className="salesinvoice-label">Receipt Date</label>
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
                <label className="salesinvoice-label">Bundles</label>
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
                <label className="salesinvoice-label">Weight</label>
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
                <label className="salesinvoice-label">Freight</label>
                <div>
                  <input
                    type="number"
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
                <label className="salesinvoice-label">Packing</label>
                <div>
                  <input
                    type="number"
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

              <div>
                <label className="salesinvoice-label">Order No</label>
                <div>
                  <input
                    type="number"
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
                <label className="salesinvoice-label">Order Date</label>
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
                <label className="salesinvoice-label">Received Here on</label>
                <div>
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DatePicker
                      value={receivedhereon}
                      onChange={handleDateChange4}
                      format="DD-MM-YYYY"
                      slotProps={{
                        textField: {
                          size: "small",
                          fullWidth: true,
                          error: !!receivederror,
                          helperText: receivederror,
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
                  {errors.ReceiptSendThrough && (
                    <b className="error-text">{errors.ReceiptSendThrough}</b>
                  )}
                </div>
              </div>

              <div>
                <label className="salesinvoice-label"> Dispatch Mode</label>
                <div>
                  <Autocomplete
                    options={dispatchmodeOptions}
                    value={
                      dispatchmodeOptions.find(
                        (option) => option.value === Transport,
                      ) || null
                    }
                    onChange={(event, newValue) =>
                      setTransport(newValue ? newValue.value : null)
                    }
                    getOptionLabel={(option) => option.label}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        placeholder="Select Dispatch Mode"
                        size="small"
                        margin="none"
                        sx={{ mt: 1.25, mb: 0.625, width: 250 }} // Equivalent to 10px and 5px
                        fullWidth
                      />
                    )}
                  />
                </div>
              </div>
 


              <div>
                <label className="salesinvoice-label">Payment Type</label>
                <div>
                  <RadioGroup
                    row
                    value={paymentType}
                    onChange={(e) => setPaymentType(e.target.value)}>
                    <FormControlLabel
                      value="ToPay"
                      control={<Radio size="small" />}
                      label="To Pay"
                    />
                    <FormControlLabel
                      value="Paid"
                      control={<Radio size="small" />}
                      label="Paid"
                    />
                  </RadioGroup>
                </div>
              </div>

              <div style={{display:'none'}}>
                <label className="salesinvoice-label">GST No</label>
                <div>
                  <input
                    label="GST No"
                    value={GSTNo}
                    className="salesinvoice-control"
                    fullWidth
                    // disabled
                  />
                </div>
              </div>
            </form>




            <div className="salesinvoice-table">
              <table>
                <thead>
                  <tr sx={{ height: "10px" }}>
                    <th>Sr No</th>
                    <th>Book Code</th>
                    <th>Book Name</th>
                    <th>Copies</th>
                    <th>Price</th>
                    {/* <th>Amount</th> */}
                    <th>Discount %</th>
                    {/* <th>
                      Discount Amount  
                    </th> */}
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
                          // padding: "10px",
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
                          <input
                            type="text"
                            value={row.BookCode || ""}
                            onChange={(e) =>
                              handleBookCodeChange(index, e.target.value)
                            }
                            placeholder="Enter Book Code"
                            style={{ width: "100px" }}
                            className="salesinvoice-control"
                          />
                        </td>
                        <td>
                          <input
                            type="text"
                            value={row.BookName || row.BookNameMarathi || ""}
                            readOnly
                            placeholder="Book Name / Book Name Marathi"
                            style={{ width: "400px" }}
                            className="salesinvoice-control"
                          />
                        </td>
                        <td>
                          <input
                            type="number"
                            value={row.Copies || ""}
                            onChange={(e) =>
                              handleInputChange(index, "Copies", e.target.value)
                            }
                            style={{ width: "80px" }} // Use style instead of sx
                            placeholder="Copies"
                            className="salesinvoice-control"
                          />
                        </td>
                   
                          <td>
                            <input
                              type="text"
                              value={row.Rate || row.BookRate || ""}
                              readOnly
                              placeholder="Rate"
                              style={{ width: "100px" }}
                              className="salesinvoice-control"
                            />
                         
                        </td>

                        {/* <td>
                          <input
                            type="number"
                            value={row.Amount}
                            readOnly
                            style={{
                              width: "100px",
                            }}
                            placeholder="Amount"
                            className="salesinvoice-control"
                          />
                        </td> */}
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
                                  value,
                                );
                              }
                            }}
                            style={{
                              width: "70px",
                            }}
                            placeholder="Discount %"
                            className="salesinvoice-control"
                          />
                        </td>

                        <td>
                          <input
                            type="number"
                            value={row.FinalAmount}
                            readOnly
                            style={{
                              width: "100px",
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

                 <tfoot>
    <tr>
      <td colSpan="7" style={{ textAlign: "right", fontWeight: "bold" }}>Sub Total:</td>
      <td style={{ fontWeight: "bold" }}>{rowFinalTotal }</td>
      <td colSpan="2"></td>
    </tr>
  </tfoot>
              </table>
            </div>


{showSalesSection && (
 
              <div
                className="sales-footer-wrapper"
                style={{
                  marginTop: "20px",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "flex-start",
                }}>
                {/* Left empty space (VB look) */}
                <div style={{ flex: 1 }}></div>

                {/* Footer Table */}
                <table
                  className="sales-footer-table"
                  style={{
                    width: "500px",
                    border: "1px solid black",
                    borderCollapse: "collapse",
                  }}>
                  <thead>
                    <tr>
                      <th style={{ border: "1px solid black" , width:'150px'}}>Particular</th>
                      <th
                        style={{
                          border: "1px solid black",
                          width: "100px",
                          alignItems: "center",
                        }}>
                        Perc %
                      </th>
                      <th
                        style={{
                          border: "1px solid black",
                          alignItems: "right",
                          width: "100px",
                        }}>
                        Amount
                      </th>
                    </tr>
                  </thead>
                <tbody>


  {footerRows.map((row, i) => (
    <tr key={i}>
<td style={{ border: "1px solid black" , width:'200px'}}>
  {isMinusParticular(row.Particulars)
    ? `(-) ${row.Particulars}`
    : `(+) ${row.Particulars}`}
</td>





      <td style={{ border: "1px solid black" }}>
        <input
          type="number"
          value={row.Percentage || ""}
          onChange={(e) =>
            handleFooterChange(i, "Percentage", e.target.value)
          }
        />
      </td>

      <td  >
    <input
  type="number"
  value={row.Amount || ""}
  readOnly={Number(row.Percentage) > 0}
  onChange={(e) =>
    handleFooterChange(i, "Amount", e.target.value)
  }
/>

      </td>
    </tr>
  ))}
</tbody>

                </table>
              </div>
            )}

            {/* TOTAL BELOW FOOTER (VB STYLE) */}
            <div
              style={{
                marginTop: "8px",
                display: "flex",
                justifyContent: "flex-end",
                width: "100%",
              }}>
              <div
                style={{
                  width: "450px",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  borderTop: "2px solid black",
                  paddingTop: "6px",
                }}>
                <label
                  style={{
                    fontWeight: "bold",
                    fontSize: "16px",
                  }}>
                  Total
                </label>
<input type="number" readOnly value={Number(Total || 0).toFixed(2)} />




              </div>
            </div>

            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <div>
                <label className="salesinvoice-label"> Canvassor</label>
                <div>
                  <Autocomplete
                    options={canvassorOptions}
                    value={
                      canvassorOptions.find(
                        (option) => option.value === CanvassorId,
                      ) || null
                    }
                    onChange={(event, newValue) => {
                      setCanvassorId(newValue ? newValue.value : null);
                    }}
                    getOptionLabel={(option) => option.label || ""}
                    isOptionEqualToValue={(option, value) =>
                      option.value === value.value
                    }
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        placeholder="Select Canvassor"
                        size="small"
                        sx={{ mt: 1.25, width: 300 }}
                        fullWidth
                      />
                    )}
                  />
                </div>
              </div>

              <div>
                <label className="salesinvoice-label">Remarks</label>
                <div>
                  <input
                    type="text"
                    id="Remarks"
                    name="Remarks"
                    value={Remarks}
                    onChange={(e) => setRemarks(e.target.value)}
                    style={{ width: "300px", background: "skyblue" }}
                    className="salesinvoice-control"
                    placeholder="Enter Remarks"
                  />
                </div>
              </div>
            </div>

            <form className="salesinvoice-form" style={{ display: "none" }}>
              <div>
                <label className="salesinvoice-label">SGST %</label>
                <div>
                  <input
                    type="number"
                    id="SGSTPercentage"
                    name="SGSTPercentage"
                    value={SGSTPercentage}
                    onChange={(e) => {
                      setSGSTPercentage(e.target.value);
                    }}
                    className="salesinvoice-control"
                    placeholder="Enter Sgst %"
                    disabled={!isLocalGST} // ✅ disable if not local
                    style={{
                      backgroundColor: isLocalGST ? "#e6ffe6" : "#f9f9f9",
                      border: `1px solid ${
                        isLocalGST ? "#086397ff" : "orange"
                      }`,
                    }}
                  />
                </div>
              </div>
              <div>
                <label className="salesinvoice-label">SGST Amount</label>
                <div>
                  <input
                    type="number"
                    id="SGSTAmount"
                    name="SGSTAmount"
                    value={SGSTAmount}
                    onChange={(e) => setSGSTAmount(e.target.value)}
                    className="salesinvoice-control"
                    placeholder="Enter sgst amount"
                    disabled={!isLocalGST}
                    style={{
                      backgroundColor: isLocalGST ? "#e6ffe6" : "#f9f9f9",
                      border: `1px solid ${
                        isLocalGST ? "#086397ff" : "orange"
                      }`,
                    }}
                  />
                </div>
              </div>
              <div>
                <label className="salesinvoice-label">CGST %</label>
                <div>
                  <input
                    type="number"
                    id="CGSTPercentage"
                    name="CGSTPercentage"
                    value={CGSTPercentage}
                    onChange={(e) => {
                      setCGSTPercentage(e.target.value);
                    }}
                    className="salesinvoice-control"
                    placeholder="Enter cgst %"
                    disabled={!isLocalGST}
                    style={{
                      backgroundColor: isLocalGST ? "#e6ffe6" : "#f9f9f9",
                      border: `1px solid ${
                        isLocalGST ? "#086397ff" : "orange"
                      }`,
                    }}
                  />
                </div>
              </div>
              <div>
                <label className="salesinvoice-label">CGST Amount</label>
                <div>
                  <input
                    type="number"
                    id="CGSTAmount"
                    name="CGSTAmount"
                    value={CGSTAmount}
                    onChange={(e) => setCGSTAmount(e.target.value)}
                    className="salesinvoice-control"
                    placeholder="Enter cgst amount"
                    disabled={!isLocalGST}
                    style={{
                      backgroundColor: isLocalGST ? "#e6ffe6" : "#f9f9f9",
                      border: `1px solid ${
                        isLocalGST ? "#086397ff" : "orange"
                      }`,
                    }}
                  />
                </div>
              </div>
              <div>
                <label className="salesinvoice-label">IGST %</label>
                <div>
                  <input
                    type="number"
                    id="IGSTPercentage"
                    name="IGSTPercentage"
                    value={IGSTPercentage}
                    onChange={(e) => {
                      setIGSTPercentage(e.target.value);
                    }}
                    className="salesinvoice-control"
                    placeholder="Enter IGST %"
                    disabled={isLocalGST}
                    style={{
                      backgroundColor: !isLocalGST ? "#e6ffe6" : "#f9f9f9",
                      border: `1px solid ${
                        !isLocalGST ? "#086397ff" : "orange"
                      }`,
                    }}
                  />
                </div>
              </div>
              <div>
                <label className="salesinvoice-label">IGST Amount</label>
                <div>
                  <input
                    type="number"
                    id="IGSTAmount"
                    name="IGSTAmount"
                    value={IGSTAmount}
                    onChange={(e) => setIGSTAmount(e.target.value)}
                    className="salesinvoice-control"
                    placeholder="Enter igst amount"
                    disabled={isLocalGST}
                    style={{
                      backgroundColor: !isLocalGST ? "#e6ffe6" : "#f9f9f9",
                      border: `1px solid ${
                        !isLocalGST ? "#086397ff" : "orange"
                      }`,
                    }}
                  />
                </div>
              </div>

              <div>
                <label className="salesinvoice-label">Total</label>
                <div>
                  <input
                    type="text"
                    id="Total"
                    name="Total"
                    value={Number(Total).toFixed(2)} // ensures 2 decimals
                    readOnly
                    className="salesinvoice-control"
                    style={{
                      fontWeight: "bold",
                      fontSize: "1.2rem", // larger size
                      color: "#000", // strong text
                      backgroundColor: "#f9f9f9", // subtle background
                      // border: "2px solid #333", // darker border
                    }}
                  />
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
