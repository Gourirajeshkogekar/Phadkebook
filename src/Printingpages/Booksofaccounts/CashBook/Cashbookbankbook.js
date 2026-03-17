// import React, { useState,useRef, useEffect } from "react";
// import {
//   Box,
//   Paper,
//   Typography,
//   Checkbox,
//   FormControlLabel,
//   Button,
//   Stack,
//   Grid, Autocomplete, TextField, CircularProgress
// } from "@mui/material";
// import PrintIcon from "@mui/icons-material/Print";
// import CloseIcon from "@mui/icons-material/Close";
// import { useNavigate } from "react-router-dom";

// import { LocalizationProvider, DatePicker } from "@mui/x-date-pickers";
// import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
// import dayjs from "dayjs";
// import CashBookPrint from "./CashBookPrint";
// import jsPDF from "jspdf";
// import html2canvas from "html2canvas";

// export default function BankBookCashBook() {

//   const navigate = useNavigate();

//   /* ===============================
//      Financial Year Default
//   =============================== */

//   const today = dayjs();
//   const currentYear = today.year();
//   const currentMonth = today.month();

//   let fyStart, fyEnd;

//   if (currentMonth < 3) {
//     fyStart = dayjs(`${currentYear - 1}-04-01`);
//     fyEnd = dayjs(`${currentYear}-03-31`);
//   } else {
//     fyStart = dayjs(`${currentYear}-04-01`);
//     fyEnd = dayjs(`${currentYear + 1}-03-31`);
//   }

//   const [startDate, setStartDate] = useState(fyStart);
//   const [endDate, setEndDate] = useState(fyEnd);
//   const [printDaily, setPrintDaily] = useState(false);

//   /* ===============================
//      OPEN PRINT PAGE IN NEW TAB
//   =============================== */
//  const reportRef = useRef(null);
//    const [printing, setPrinting] = useState(false);
//    const [selectedBook, setSelectedBook] = useState(null);
//  const [loadingAccounts, setLoadingAccounts] = useState(true);
// const [accountOptions, setAccountOptions] = useState([]); // API Data




//    // --- Fetch Accounts from API ---
//   useEffect(() => {
//     fetch("https://publication.microtechsolutions.net.in/php/Accountget.php")
//       .then((res) => res.json())
//       .then((data) => {
//         // You might want to filter for specific types (e.g., TypeCode 'B' often means Bank/Cash)
//         // or simply show all accounts as per your screenshot logic.
//         setAccountOptions(data || []);
//         setLoadingAccounts(false);
//       })
//       .catch((err) => {
//         console.error("Error fetching accounts:", err);
//         setLoadingAccounts(false);
//       });
//   }, []);

//  const handlePrint = async () => {
//     setPrinting(true);
//     // Give the DOM a moment to ensure the hidden report is ready
//     setTimeout(async () => {
//       try {
//         const element = reportRef.current;
//         if (!element) return;

//         // Capture the element as a canvas
//         const canvas = await html2canvas(element, { 
//           scale: 2, 
//           useCORS: true,
//           logging: false 
//         });

//         const imgData = canvas.toDataURL("image/png");
//         const pdf = new jsPDF("p", "mm", "a4");
        
//         // Add image to PDF (A4 size is 210mm x 297mm)
//         pdf.addImage(imgData, "PNG", 0, 0, 210, 297);
        
//         // Open the PDF in a new Chrome tab
//         window.open(pdf.output("bloburl"), "_blank");
//       } catch (error) {
//         console.error("PDF Error:", error);
//       } finally {
//         setPrinting(false);
//       }
//     }, 500); // 500ms is safer for rendering complex reports
//   };

//   return (
//     <LocalizationProvider dateAdapter={AdapterDayjs}>
//       <Box sx={{ minHeight: "100vh", bgcolor: "#f4f6f9", p: 4 }}>

//         <Box maxWidth={600} mx="auto">

//           <Typography variant="h5" fontWeight={700} textAlign="center" mb={3}>
//             Cash / Bank Book
//           </Typography>

//           <Paper sx={{ p: 3, mb: 3 }}>
//             <Typography fontWeight={600} mb={2}>Period</Typography>

//             <Grid container spacing={2}>
//               <Grid item xs={6}>
//                 <DatePicker
//                   label="Start Date"
//                   value={startDate}
//                   onChange={setStartDate}
//                   slotProps={{ textField: { size: "small", fullWidth: true } }}
//                 />
//               </Grid>

//               <Grid item xs={6}>
//                 <DatePicker
//                   label="End Date"
//                   value={endDate}
//                   onChange={setEndDate}
//                   slotProps={{ textField: { size: "small", fullWidth: true } }}
//                 />
//               </Grid>
//             </Grid>
//           </Paper>

//        {/* FIXED: Autocomplete now uses fetched accountOptions */}
//           <Paper sx={{ p: 3, mb: 3 }}>
//             <Typography fontWeight={600} mb={2}>Cash/Bank Book</Typography>
//             <Autocomplete
//               size="small"
//               options={accountOptions}
//               loading={loadingAccounts}
//               // FIXED: Changed .label to .AccountName to match your API
//               getOptionLabel={(option) => option.AccountName || ""}
//               value={selectedBook}
//               onChange={(event, newValue) => setSelectedBook(newValue)}
//               renderInput={(params) => (
//                 <TextField 
//                   {...params} 
//                   // label="Select Account" 
//                   placeholder="Search book..." 
//                   InputProps={{
//                     ...params.InputProps,
//                     endAdornment: (
//                       <>
//                         {loadingAccounts ? <CircularProgress color="inherit" size={20} /> : null}
//                         {params.InputProps.endAdornment}
//                       </>
//                     ),
//                   }}
//                 />
//               )}
//             />
            
//             <Box mt={2}>
//               <FormControlLabel
//                 control={
//                   <Checkbox
//                     checked={printDaily}
//                     onChange={(e) => setPrintDaily(e.target.checked)}
//                   />
//                 }
//                 label="Print Daily Totals?"
//               />
//             </Box>
//           </Paper>

//           <Stack direction="row" spacing={2} justifyContent="center">
//             <Button
//               variant="contained"
//               startIcon={<PrintIcon />}
//               onClick={handlePrint}
//             >
//               Print Report
//             </Button>

//             <Button
//               variant="contained"
//               color="error"
//               startIcon={<CloseIcon />}
//               onClick={() => navigate(-1)}
//             >
//               Close
//             </Button>
//           </Stack>

//         </Box>

//          <Box sx={{ position: "absolute", top: "-10000px", left: "-10000px" }}>
//                 <div ref={reportRef}>
//                   <CashBookPrint state={{ startDate, endDate }} />
//                 </div>
//               </Box>

//       </Box>
//     </LocalizationProvider>
//   );
// }






import React, { useState, useRef, useEffect } from "react";
import {
  Box,
  Paper,
  Typography,
  Checkbox,
  FormControlLabel,
  Button,
  Stack,
  Grid,
  Autocomplete,
  TextField,
  CircularProgress
} from "@mui/material";

import PrintIcon from "@mui/icons-material/Print";
import CloseIcon from "@mui/icons-material/Close";
import { useNavigate } from "react-router-dom";

import { LocalizationProvider, DatePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";

import autoTable from "jspdf-autotable";
import jsPDF from "jspdf";

import dayjs from "dayjs";
import axios from "axios";

export default function BankBookCashBook() {

  const navigate = useNavigate();

  const today = dayjs();
  const year = today.year();
  const month = today.month();

  let fyStart, fyEnd;

  if (month < 3) {
    fyStart = dayjs(`${year - 1}-04-01`);
    fyEnd = dayjs(`${year}-03-31`);
  } else {
    fyStart = dayjs(`${year}-04-01`);
    fyEnd = dayjs(`${year + 1}-03-31`);
  }

  const [startDate, setStartDate] = useState(fyStart);
  const [endDate, setEndDate] = useState(fyEnd);

  const [printDaily, setPrintDaily] = useState(false);

  const [selectedBook, setSelectedBook] = useState(null);
  const [accountOptions, setAccountOptions] = useState([]);
  const [loadingAccounts, setLoadingAccounts] = useState(true);

  /* ===============================
     LOAD ACCOUNTS
  =============================== */

  useEffect(() => {

    axios
      .get("https://publication.microtechsolutions.net.in/php/Accountget.php")
      .then((res) => {

        const accounts = Array.isArray(res.data) ? res.data : [];

        setAccountOptions(accounts);
        setLoadingAccounts(false);

      })
      .catch(() => {
        setLoadingAccounts(false);
      });

  }, []);

  /* ===============================
     HANDLE PRINT
  =============================== */

  const handlePrint = async () => {

    try {

      if (!selectedBook) {
        alert("Please select Cash / Bank Account");
        return;
      }

      const accountId = selectedBook?.Id;

      const fromdate = startDate.format("YYYY-MM-DD");
      const todate = endDate.format("YYYY-MM-DD");

      const response = await axios.get(
        "https://publication.microtechsolutions.net.in/php/get/getCashBookBankBook.php",
        {
          params: {
            fromdate,
            todate,
            AccountId: accountId,
            printDailyTotals: printDaily ? 1 : 0
          }
        }
      );

      const rows = response.data?.data || [];
      const totals = response.data?.dailyTotals || [];

      if (!rows.length) {
        alert("No data found.");
        return;
      }



      const sortedRows = [...rows].sort((a, b) => {

        const [da, ma, ya] = a.Date.split("-");
        const [db, mb, yb] = b.Date.split("-");

        return new Date(`${ya}-${ma}-${da}`) - new Date(`${yb}-${mb}-${db}`);

      });

      /* ===============================
         GROUP DATE
      =============================== */

      const grouped = {};

      sortedRows.forEach(row => {

        const date = row.Date;

        if (!grouped[date]) grouped[date] = [];

        grouped[date].push(row);

      });

      /* ===============================
         PREPARE TABLE
      =============================== */

      const tableRows = [];

      Object.keys(grouped).forEach(date => {

        const [d, m, y] = date.split("-");

        const formattedDate = new Date(`${y}-${m}-${d}`)
          .toLocaleDateString("en-GB", {
            weekday: "long",
            day: "numeric",
            month: "long",
            year: "numeric"
          });

        /* DATE HEADER */

        tableRows.push([
          {
            content: formattedDate,
            colSpan: 7,
            styles: { halign: "center", fontStyle: "bold" }
          }
        ]);

        /* TRANSACTIONS */

        grouped[date].forEach(r => {

          tableRows.push([
            r["Entry No."],
            r["Account"],
            r["Particulars"],
            r["Chq.No."],
            r["Debit"],
            r["Credit"],
            r["Balance"]
          ]);

        });

        /* DAILY TOTAL */

        const dayTotal = totals.find(t => t.Date === date);

        if (dayTotal) {

          tableRows.push([
            "",
            {
              content: "Daily Total",
              colSpan: 3,
              styles: { halign: "right", fontStyle: "bold" }
            },
            dayTotal.Debit,
            dayTotal.Credit,
            dayTotal.Balance
          ]);

        }

      });

      /* ===============================
         GENERATE PDF
      =============================== */

      const pdf = new jsPDF("p", "mm", "a4");

      const pdfWidth = pdf.internal.pageSize.getWidth();
 autoTable(pdf, {

  margin: {
    top: 40   // reserve space for header on every page
  },

  head: [[
    "Entry No",
    "Account",
    "Particulars",
    "Chq No",
    "Debit",
    "Credit",
    "Balance"
  ]],

  body: tableRows,

  styles: {
    fontSize: 9,
    textColor: [0, 0, 0]
  },

  headStyles: {
    fillColor: [230, 230, 230],
    textColor: [0, 0, 0],
    fontStyle: "bold"
  },

  columnStyles: {
    4: { halign: "right" },
    5: { halign: "right" },
    6: { halign: "right" }
  },

  didDrawPage: () => {

    const pageWidth = pdf.internal.pageSize.getWidth();

    /* COMPANY NAME */

    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(16);

    pdf.text(
      "PHADKE PRAKASHAN, KOLHAPUR",
      pageWidth / 2,
      10,
      { align: "center" }
    );

    /* REPORT TITLE */

    pdf.setFontSize(13);

    pdf.text(
      "CASH / BANK BOOK",
      pageWidth / 2,
      17,
      { align: "center" }
    );

    /* DATE RANGE */

    pdf.setFont("helvetica", "normal");
    pdf.setFontSize(11);

    pdf.text(
      `From ${startDate.format("DD-MM-YYYY")} To ${endDate.format("DD-MM-YYYY")}`,
      pageWidth / 2,
      24,
      { align: "center" }
    );

    /* ACCOUNT NAME */

    pdf.text(
      selectedBook.AccountName,
      14,
      32
    );

  }

});

      window.open(pdf.output("bloburl"), "_blank");

    } catch (error) {

      console.error("PRINT ERROR:", error);
      alert("Error generating report");

    }

  };

  /* ===============================
     UI
  =============================== */

  return (

    <LocalizationProvider dateAdapter={AdapterDayjs}>

      <Box sx={{ minHeight: "100vh", bgcolor: "#f4f6f9", p: 4 }}>

        <Box maxWidth={600} mx="auto">

          <Typography variant="h5" fontWeight={700} textAlign="center" mb={3}>
            Cash / Bank Book
          </Typography>

          <Paper sx={{ p: 3, mb: 3 }}>

            <Typography fontWeight={600} mb={2}>Period</Typography>

            <Grid container spacing={2}>

              <Grid item xs={6}>

                <DatePicker
                  label="Start Date"
                  value={startDate}
                  onChange={(value) => setStartDate(value)}
                  slotProps={{
                    textField: { size: "small", fullWidth: true }
                  }}
                />

              </Grid>

              <Grid item xs={6}>

                <DatePicker
                  label="End Date"
                  value={endDate}
                  onChange={(value) => setEndDate(value)}
                  slotProps={{
                    textField: { size: "small", fullWidth: true }
                  }}
                />

              </Grid>

            </Grid>

          </Paper>

          <Paper sx={{ p: 3, mb: 3 }}>

            <Typography fontWeight={600} mb={2}>
              Cash / Bank Book
            </Typography>

            <Autocomplete
              options={accountOptions}
              loading={loadingAccounts}
              getOptionLabel={(option) => option?.AccountName || ""}
              isOptionEqualToValue={(option, value) => option.Id === value.Id}
              value={selectedBook}
              onChange={(e, v) => setSelectedBook(v)}
              renderInput={(params) => (
                <TextField
                  {...params}
                  placeholder="Search Account..."
                  InputProps={{
                    ...params.InputProps,
                    endAdornment: (
                      <>
                        {loadingAccounts && <CircularProgress size={20} />}
                        {params.InputProps.endAdornment}
                      </>
                    )
                  }}
                />
              )}
            />

            <Box mt={2}>

              <FormControlLabel
                control={
                  <Checkbox
                    checked={printDaily}
                    onChange={(e) => setPrintDaily(e.target.checked)}
                  />
                }
                label="Print Daily Totals?"
              />

            </Box>

          </Paper>

          <Stack direction="row" spacing={2} justifyContent="center">

            <Button
              variant="contained"
              startIcon={<PrintIcon />}
              onClick={handlePrint}
            >
              Print Report
            </Button>

            <Button
              variant="contained"
              color="error"
              startIcon={<CloseIcon />}
              onClick={() => navigate(-1)}
            >
              Close
            </Button>

          </Stack>

        </Box>

      </Box>

    </LocalizationProvider>

  );

}