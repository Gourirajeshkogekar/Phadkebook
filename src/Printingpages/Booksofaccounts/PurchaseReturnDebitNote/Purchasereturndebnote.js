// import React, { useState, useRef } from "react";
// import {
//   Box,
//   Paper,
//   Typography,
//   TextField,
//   Button,
//   Grid,
//   CircularProgress
// } from "@mui/material";

// import PrintIcon from "@mui/icons-material/Print";
// import CloseIcon from "@mui/icons-material/Close";

// import dayjs from "dayjs";
// import html2canvas from "html2canvas";
// import jsPDF from "jspdf";

// export default function PurchaseReturnDebitNoteRegister() {

//   const reportRef = useRef();

//   const [printing, setPrinting] = useState(false);

//   /* ===============================
//      FINANCIAL YEAR DEFAULT
//   =============================== */

//   const getFinancialYear = () => {

//     const today = dayjs();
//     const year = today.year();
//     const month = today.month();

//     if (month < 3) {
//       return {
//         start: `${year - 1}-04-01`,
//         end: `${year}-03-31`
//       };
//     } else {
//       return {
//         start: `${year}-04-01`,
//         end: `${year + 1}-03-31`
//       };
//     }

//   };

//   const fy = getFinancialYear();

//   const [startDate, setStartDate] = useState(fy.start);
//   const [endDate, setEndDate] = useState(fy.end);

//   /* ===============================
//      HANDLE PRINT (PDF)
//   =============================== */

//   const handlePrint = async () => {

//     setPrinting(true);

//     setTimeout(async () => {

//       try {

//         const element = reportRef.current;

//         if (!element) return;

//         const canvas = await html2canvas(element, {
//           scale: 1,
//           useCORS: true
//         });

//         const imgData = canvas.toDataURL("image/png");

//         const pdf = new jsPDF("p", "mm", "a4");

//         const imgWidth = 210;
//         const imgHeight = (canvas.height * imgWidth) / canvas.width;

//         pdf.addImage(imgData, "PNG", 0, 0, imgWidth, imgHeight);

//         window.open(pdf.output("bloburl"), "_blank");

//       }
//       catch (error) {

//         console.error("PDF Error:", error);

//       }
//       finally {

//         setPrinting(false);

//       }

//     }, 500);

//   };


//   const handleClose = () => {

//     window.history.back();

//   };


//   /* ===============================
//      UI
//   =============================== */

//   return (

//     <Box
//       sx={{
//         minHeight: "100vh",
//         background: "linear-gradient(135deg,#eef2f7,#e3e8f0)",
//         display: "flex",
//         justifyContent: "center",
//         pt: 4
//       }}
//     >

//       <Box width={520}>

//         <Typography
//           variant="h5"
//           fontWeight={600}
//           textAlign="center"
//           mb={2}
//         >
//           Purchase Return Debit Note Register
//         </Typography>


//         <Paper elevation={5} sx={{ p: 3, borderRadius: 2 }}>

//           <Typography fontWeight={600} mb={2}>
//             Period
//           </Typography>

//           <Grid container spacing={2}>

//             <Grid item xs={6}>
//               <TextField
//                 label="Start Date"
//                 type="date"
//                 fullWidth
//                 size="small"
//                 value={startDate}
//                 onChange={(e)=>setStartDate(e.target.value)}
//                 InputLabelProps={{ shrink: true }}
//               />
//             </Grid>

//             <Grid item xs={6}>
//               <TextField
//                 label="End Date"
//                 type="date"
//                 fullWidth
//                 size="small"
//                 value={endDate}
//                 onChange={(e)=>setEndDate(e.target.value)}
//                 InputLabelProps={{ shrink: true }}
//               />
//             </Grid>

//           </Grid>

//         </Paper>


//         <Box display="flex" justifyContent="center" gap={3} mt={3}>

//           <Button
//             variant="contained"
//             startIcon={
//               printing ?
//               <CircularProgress size={18} color="inherit"/> :
//               <PrintIcon/>
//             }
//             onClick={handlePrint}
//             disabled={printing}
//           >
//             {printing ? "Generating PDF..." : "Print Report"}
//           </Button>


//           <Button
//             variant="contained"
//             color="error"
//             startIcon={<CloseIcon/>}
//             onClick={handleClose}
//           >
//             Close
//           </Button>

//         </Box>

//       </Box>


//       {/* ===============================
//          HIDDEN REPORT FOR PDF
//       =============================== */}

//       <Box
//         ref={reportRef}
//         sx={{
//           position: "absolute",
//           left: "-9999px",
//           width: "210mm",
//           padding: "10mm",
//           fontFamily: "Times New Roman",
//           fontSize: "11px"
//         }}
//       >

//         <div style={{ textAlign:"center", fontWeight:"bold", fontSize:"14px" }}>
//           Phadke Prakashan, Kolhapur
//         </div>

//         <div style={{ textAlign:"center", fontSize:"12px" }}>
//           PURCHASE RETURN DEBIT NOTE REGISTER
//         </div>

//         <div style={{ textAlign:"center", fontSize:"11px", marginBottom:"10px" }}>
//           From {startDate} to {endDate}
//         </div>


//         <table width="100%" style={{ borderCollapse:"collapse" }}>

//           <thead>
//             <tr>
//               <th style={th}>Entry No</th>
//               <th style={th}>Account Name</th>
//               <th style={th}>Particulars</th>
//               <th style={thRight}>Debit</th>
//               <th style={thRight}>Credit</th>
//             </tr>
//           </thead>

//           <tbody>
//             <tr>
//               <td colSpan="5" style={{ textAlign:"center", padding:"10px" }}>
//                 Backend data will render here
//               </td>
//             </tr>
//           </tbody>

//         </table>

//       </Box>

//     </Box>

//   );

// }


// const th = {
//   border:"1px solid black",
//   padding:"4px",
//   textAlign:"left"
// };

// const thRight = {
//   border:"1px solid black",
//   padding:"4px",
//   textAlign:"right"
// };




import React, { useState } from "react";
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Grid,
  CircularProgress
} from "@mui/material";

import PrintIcon from "@mui/icons-material/Print";
import CloseIcon from "@mui/icons-material/Close";

import axios from "axios";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import dayjs from "dayjs";

export default function PurchaseReturnDebitNoteRegister() {

  const [printing, setPrinting] = useState(false);

  /* ===============================
     FINANCIAL YEAR
  =============================== */

  const getFinancialYear = () => {

    const today = dayjs();
    const year = today.year();
    const month = today.month();

    if (month < 3) {
      return {
        start: `${year - 1}-04-01`,
        end: `${year}-03-31`
      };
    } else {
      return {
        start: `${year}-04-01`,
        end: `${year + 1}-03-31`
      };
    }

  };

  const fy = getFinancialYear();

  const [startDate, setStartDate] = useState(fy.start);
  const [endDate, setEndDate] = useState(fy.end);


  /* ===============================
     PRINT REPORT
  =============================== */

  const handlePrint = async () => {

    try {

      setPrinting(true);

      const response = await axios.get(
        "https://publication.microtechsolutions.net.in/php/get/getPurchaseReturnDebitNote.php",
        {
          params: {
            fromdate: startDate,
            todate: endDate
          }
        }
      );

      const rows = response?.data?.data || [];
      const totalDebit = response?.data?.totalDebits || "0.00";

      generatePDF(rows, totalDebit);

    } catch (error) {

      console.error("API ERROR:", error);
      alert("API connection failed");

    }

    setPrinting(false);

  };


  /* ===============================
     GENERATE PDF
  =============================== */

 const generatePDF = (rows, totalDebit) => {

  const doc = new jsPDF("p", "mm", "a4");

  const bodyRows = rows
    .filter(r => r.Account_Name !== "**TOTAL**")
    .map((r, index) => [
      index + 1,
      r.Account_Name || "",
      r.Particulars || "",
      r.Debit || "",
      r.Credit || ""
    ]);

  autoTable(doc, {

    startY: 40,

    margin: {
      top: 35
    },

    head: [[
      "Entry No / Ref.No",
      "Account Name",
      "Particulars",
      "Debit",
      "Credit"
    ]],

    body: bodyRows,

    styles: {
      fontSize: 9
    },

    columnStyles: {
      0: { cellWidth: 30 },
      1: { cellWidth: 55 },
      2: { cellWidth: 65 },
      3: { halign: "right", cellWidth: 20 },
      4: { halign: "right", cellWidth: 20 }
    },

    didDrawPage: function () {

      doc.setFontSize(14);
      doc.text("Phadke Prakashan, Kolhapur.", 105, 10, { align: "center" });

      doc.setFontSize(12);
      doc.text("Purchase Return Debit Note", 105, 16, { align: "center" });

      doc.setFontSize(10);
      doc.text(`From ${startDate} to ${endDate}`, 105, 22, { align: "center" });

      doc.setLineWidth(0.3);
      doc.line(10, 26, 200, 26);

    }

  });

  const finalY = doc.lastAutoTable.finalY + 8;

  doc.setFontSize(10);

  doc.text("Day Total", 140, finalY);
  doc.text(totalDebit.toString(), 195, finalY, { align: "right" });

  doc.text("Grand Total", 140, finalY + 6);
  doc.text(totalDebit.toString(), 195, finalY + 6, { align: "right" });

  window.open(doc.output("bloburl"));

};

  


  const handleClose = () => window.history.back();


  /* ===============================
     UI
  =============================== */

  return (

    <Box
      sx={{
        minHeight: "100vh",
        background: "linear-gradient(135deg,#eef2f7,#e3e8f0)",
        display: "flex",
        justifyContent: "center",
        pt: 4
      }}
    >

      <Box width={520}>

        <Typography
          variant="h5"
          fontWeight={600}
          textAlign="center"
          mb={2}
        >
          Purchase Return Debit Note Register
        </Typography>


        <Paper elevation={5} sx={{ p: 3, borderRadius: 2 }}>

          <Typography fontWeight={600} mb={2}>
            Period
          </Typography>

          <Grid container spacing={2}>

            <Grid item xs={6}>
              <TextField
                label="Start Date"
                type="date"
                fullWidth
                size="small"
                value={startDate}
                onChange={(e)=>setStartDate(e.target.value)}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>

            <Grid item xs={6}>
              <TextField
                label="End Date"
                type="date"
                fullWidth
                size="small"
                value={endDate}
                onChange={(e)=>setEndDate(e.target.value)}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>

          </Grid>

        </Paper>


        <Box display="flex" justifyContent="center" gap={3} mt={3}>

          <Button
            variant="contained"
            startIcon={
              printing
              ? <CircularProgress size={18} color="inherit"/>
              : <PrintIcon/>
            }
            onClick={handlePrint}
            disabled={printing}
          >
            {printing ? "Generating PDF..." : "Print Report"}
          </Button>


          <Button
            variant="contained"
            color="error"
            startIcon={<CloseIcon/>}
            onClick={handleClose}
          >
            Close
          </Button>

        </Box>

      </Box>

    </Box>

  );

}