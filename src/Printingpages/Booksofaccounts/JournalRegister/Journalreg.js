
// import React, { useState, useRef } from "react";
// import {
//   Box,
//   Paper,
//   Typography,
//   Button,
//   Stack,
//   Grid
// } from "@mui/material";
// import { useNavigate } from "react-router-dom";
// import PrintIcon from "@mui/icons-material/Print";
// import CloseIcon from "@mui/icons-material/Close";

// import { LocalizationProvider, DatePicker } from "@mui/x-date-pickers";
// import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
// import dayjs from "dayjs";
// import jsPDF from "jspdf";
// import html2canvas from "html2canvas";
// import JournalRegisterPrint from "./JournalregPrint";


// export default function JournalRegister() {
//   const navigate = useNavigate();
//    /* ===============================
//      Financial Year Default
//   =============================== */

//   const today = dayjs();
//   const year = today.year();
//   const month = today.month();

//   let fyStart, fyEnd;

//   if (month < 3) {
//     fyStart = dayjs(`${year - 1}-04-01`);
//     fyEnd = dayjs(`${year}-03-31`);
//   } else {
//     fyStart = dayjs(`${year}-04-01`);
//     fyEnd = dayjs(`${year + 1}-03-31`);
//   }

//   const [startDate, setStartDate] = useState(fyStart);
//   const [endDate, setEndDate] = useState(fyEnd);

//      const reportRef = useRef(null);
//    const [printing, setPrinting] = useState(false);

//   const handlePrint = async () => {
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


//   const handleClose = () => navigate(-1);

//   return (
//     <LocalizationProvider dateAdapter={AdapterDayjs}>
//       <Box
//         sx={{
//           minHeight: "100vh",
//           background: "linear-gradient(135deg,#eef2f7,#dbe6f1)",
//           display: "flex",
//           justifyContent: "center",
//           pt: 6
//         }}
//       >
//         <Box width={520}>

//           <Typography
//             variant="h5"
//             fontWeight={700}
//             textAlign="center"
//             mb={3}
//           >
//             Journal Register
//           </Typography>

//           <Paper
//             sx={{
//               p: 3,
//               borderRadius: 3,
//               boxShadow: "0 10px 30px rgba(0,0,0,0.1)",
//               mb: 4
//             }}
//           >
//             <Typography fontWeight={600} mb={2}>
//               Period
//             </Typography>

//             <Grid container spacing={2}>
//               <Grid item xs={6}>
//                 <DatePicker
//                   label="Start Date"
//                   value={startDate}
//                   onChange={setStartDate}
//                   slotProps={{
//                     textField: { size: "small", fullWidth: true }
//                   }}
//                 />
//               </Grid>

//               <Grid item xs={6}>
//                 <DatePicker
//                   label="End Date"
//                   value={endDate}
//                   onChange={setEndDate}
//                   slotProps={{
//                     textField: { size: "small", fullWidth: true }
//                   }}
//                 />
//               </Grid>
//             </Grid>
//           </Paper>

//           <Stack direction="row" spacing={3} justifyContent="center">
//             <Button
//               variant="contained"
//               startIcon={<PrintIcon />}
//               onClick={handlePrint}
//               sx={{
//                 px: 5,
//                 fontWeight: 600,
//                 borderRadius: 2,
//                 background: "linear-gradient(90deg,#1565c0,#1976d2)"
//               }}
//             >
//               Print Report
//             </Button>

//             <Button
//               variant="contained"
//               color="error"
//               startIcon={<CloseIcon />}
//               onClick={handleClose}
//               sx={{ px: 5, fontWeight: 600, borderRadius: 2 }}
//             >
//               Close
//             </Button>
//           </Stack>

//         </Box>


//          <Box sx={{ position: "absolute", top: "-10000px", left: "-10000px" }}>
//                 <div ref={reportRef}>
//                   <JournalRegisterPrint state={{ startDate, endDate }} />
//                 </div>
//               </Box>
//       </Box>
//     </LocalizationProvider>
//   );
// }




import React, { useState } from "react";
import {
  Box,
  Paper,
  Typography,
  Button,
  Stack,
  Grid
} from "@mui/material";

import { useNavigate } from "react-router-dom";
import PrintIcon from "@mui/icons-material/Print";
import CloseIcon from "@mui/icons-material/Close";

import { LocalizationProvider, DatePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";

import dayjs from "dayjs";
import axios from "axios";

import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export default function JournalRegister() {

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

  /* ===============================
     PRINT REPORT
  =============================== */

  const handlePrint = async () => {

    try {

      const fromdate = startDate.format("YYYY-MM-DD");
      const todate = endDate.format("YYYY-MM-DD");

      const response = await axios.get(
        "https://publication.microtechsolutions.net.in/php/get/getJournalRegister.php",
        {
          params: { fromdate, todate }
        }
      );

      const rows = response.data || [];

      if (!rows.length) {
        alert("No data found");
        return;
      }

      /* GROUP BY PARTICULARS */

      const groupedRows = rows.reduce((acc, row) => {

        const key = row["Particulars"] || "Unknown";

        if (!acc[key]) acc[key] = [];

        acc[key].push(row);

        return acc;

      }, {});

      /* FORMAT AMOUNT */

      const formatAmount = (val) => {

        const num = Number((val || "0").toString().replace(/,/g, ""));

        return num.toLocaleString("en-IN", {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2
        });

      };

      /* PREPARE TABLE */

      const tableRows = [];

      Object.keys(groupedRows).forEach((particular) => {

        const group = groupedRows[particular];

        let debitTotal = 0;
        let creditTotal = 0;

        tableRows.push([
          {
            content: particular,
            colSpan: 5,
            styles: { halign: "center", fontStyle: "bold" }
          }
        ]);

        group.forEach((row) => {

          const debit = Number((row["Debit"] || "0").replace(/,/g, ""));
          const credit = Number((row["Credit"] || "0").replace(/,/g, ""));

          debitTotal += debit;
          creditTotal += credit;

          tableRows.push([
            row["Entry No. / Ref"] || "",
            row["Account Name"] || "",
            row["Particulars"] || "",
            formatAmount(debit),
            formatAmount(credit)
          ]);

        });

        tableRows.push([
          "",
          { content: "Day Total", colSpan: 2, styles: { halign: "right", fontStyle: "bold" } },
          formatAmount(debitTotal),
          formatAmount(creditTotal)
        ]);

      });

      /* CREATE PDF */

      const pdf = new jsPDF("p", "mm", "a4");

      const pageWidth = pdf.internal.pageSize.getWidth();

      autoTable(pdf, {

        margin: { top: 40 },

        head: [[
          "Entry No / Ref",
          "Account Name",
          "Particulars",
          "Debit",
          "Credit"
        ]],

        body: tableRows,

        styles: {
          fontSize: 9,
          textColor: [0,0,0]
        },

        headStyles: {
          fillColor: [230,230,230],
          textColor: [0,0,0],
          fontStyle: "bold"
        },

        columnStyles: {
          3: { halign: "right" },
          4: { halign: "right" }
        },

        didDrawPage: () => {

          pdf.setFont("helvetica","bold");
          pdf.setFontSize(16);

          pdf.text(
            "PHADKE PRAKASHAN, KOLHAPUR",
            pageWidth / 2,
            10,
            { align: "center" }
          );

          pdf.setFontSize(13);

          pdf.text(
            "JOURNAL REGISTER",
            pageWidth / 2,
            17,
            { align: "center" }
          );

          pdf.setFont("helvetica","normal");
          pdf.setFontSize(11);

          pdf.text(
            `From ${startDate.format("DD-MM-YYYY")} To ${endDate.format("DD-MM-YYYY")}`,
            pageWidth / 2,
            24,
            { align: "center" }
          );

        }

      });

      window.open(pdf.output("bloburl"), "_blank");

    } catch (error) {
      console.error("API ERROR:", error);
    }

  };

  const handleClose = () => navigate(-1);

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>

      <Box
        sx={{
          minHeight: "100vh",
          background: "linear-gradient(135deg,#eef2f7,#dbe6f1)",
          display: "flex",
          justifyContent: "center",
          pt: 6
        }}
      >

        <Box width={520}>

          <Typography
            variant="h5"
            fontWeight={700}
            textAlign="center"
            mb={3}
          >
            Journal Register
          </Typography>

          <Paper
            sx={{
              p: 3,
              borderRadius: 3,
              boxShadow: "0 10px 30px rgba(0,0,0,0.1)",
              mb: 4
            }}
          >

            <Typography fontWeight={600} mb={2}>
              Period
            </Typography>

            <Grid container spacing={2}>

              <Grid item xs={6}>
                <DatePicker
                  label="Start Date"
                  value={startDate}
                  onChange={setStartDate}
                  slotProps={{
                    textField: { size: "small", fullWidth: true }
                  }}
                />
              </Grid>

              <Grid item xs={6}>
                <DatePicker
                  label="End Date"
                  value={endDate}
                  onChange={setEndDate}
                  slotProps={{
                    textField: { size: "small", fullWidth: true }
                  }}
                />
              </Grid>

            </Grid>

          </Paper>

          <Stack direction="row" spacing={3} justifyContent="center">

            <Button
              variant="contained"
              startIcon={<PrintIcon />}
              onClick={handlePrint}
              sx={{
                px: 5,
                fontWeight: 600,
                borderRadius: 2,
                background: "linear-gradient(90deg,#1565c0,#1976d2)"
              }}
            >
              Print Report
            </Button>

            <Button
              variant="contained"
              color="error"
              startIcon={<CloseIcon />}
              onClick={handleClose}
              sx={{ px: 5, fontWeight: 600, borderRadius: 2 }}
            >
              Close
            </Button>

          </Stack>

        </Box>

      </Box>

    </LocalizationProvider>
  );
}