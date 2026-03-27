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

// import html2canvas from "html2canvas";
// import jsPDF from "jspdf";
// import dayjs from "dayjs";

// export default function TdsAndParty() {

//   const reportRef = useRef();

//   const [printing, setPrinting] = useState(false);

//   /* ===============================
//      DEFAULT FINANCIAL YEAR
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
//      HANDLE PRINT → PDF
//   =============================== */

//   const handlePrint = async () => {

//     setPrinting(true);

//     setTimeout(async () => {

//       try {

//         const element = reportRef.current;

//         if (!element) return;

//         const canvas = await html2canvas(element, {
//           scale: 1,
//           useCORS: true,
//           logging: false
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


//   const handleClose = () => window.history.back();


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
//           TDS & Party Report
//         </Typography>


//         <Paper sx={{ p: 3, borderRadius: 2 }}>

//           <Typography fontWeight={600} mb={2}>
//             Period
//           </Typography>

//           <Grid container spacing={2}>

//             <Grid item xs={6}>
//               <TextField
//                 label="Start Date"
//                 type="date"
//                 size="small"
//                 fullWidth
//                 value={startDate}
//                 onChange={(e)=>setStartDate(e.target.value)}
//                 InputLabelProps={{ shrink:true }}
//               />
//             </Grid>

//             <Grid item xs={6}>
//               <TextField
//                 label="End Date"
//                 type="date"
//                 size="small"
//                 fullWidth
//                 value={endDate}
//                 onChange={(e)=>setEndDate(e.target.value)}
//                 InputLabelProps={{ shrink:true }}
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
//             sx={{ minWidth:160 }}
//           >
//             {printing ? "Generating PDF..." : "Print Report"}
//           </Button>


//           <Button
//             variant="contained"
//             color="error"
//             startIcon={<CloseIcon/>}
//             onClick={handleClose}
//             sx={{ minWidth:120 }}
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
//           position:"absolute",
//           left:"-9999px",
//           width:"210mm",
//           padding:"10mm",
//           fontFamily:"Times New Roman",
//           fontSize:"11px"
//         }}
//       >

//         <div style={{ textAlign:"center", fontWeight:"bold", fontSize:"14px" }}>
//           Phadke Prakashan, Kolhapur
//         </div>

//         <div style={{ textAlign:"center", fontSize:"13px", marginTop:"2px" }}>
//           List of Parties whose TDS deducted / not deducted
//         </div>

//         <div style={{ textAlign:"center", fontSize:"11px", marginBottom:"10px" }}>
//           From {startDate} to {endDate}
//         </div>


//         <table width="100%" style={{ borderCollapse:"collapse" }}>

//           <thead>
//             <tr>
//               <th style={th}>Sr No</th>
//               <th style={th}>Party Name</th>
//               <th style={thRight}>Amount</th>
//               <th style={thRight}>TDS</th>
//             </tr>
//           </thead>

//           <tbody>
//             <tr>
//               <td colSpan="4" style={{ textAlign:"center", padding:"10px" }}>
//                 Backend data will render here
//               </td>
//             </tr>
//           </tbody>

//         </table>

//       </Box>

//     </Box>

//   );

// }


// /* TABLE STYLE */

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

export default function TdsAndParty() {

  const [printing, setPrinting] = useState(false);

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
        "https://publication.microtechsolutions.net.in/php/get/getTDSandParty.php",
        {
          params: {
            fromdate: startDate,
            todate: endDate
          }
        }
      );

      const rows = response?.data?.data || [];

      generatePDF(rows);

    } catch (error) {

      console.error("API Error:", error);
      alert("API connection failed");

    }

    setPrinting(false);

  };


  /* ===============================
     GENERATE PDF
  =============================== */

  const generatePDF = (rows) => {

    const doc = new jsPDF("p", "mm", "a4");

    const tableRows = rows.map((r) => [
      r.SrNo || "",
      r.PartyName || "",
      r.Amount || "",
      r.TDS || ""
    ]);

    autoTable(doc, {

      startY: 35,

      head: [[
        "Sr No",
        "Name of the Party",
        "Amount credited",
        "TDS Deducted"
      ]],

      body: tableRows,

      styles: {
        fontSize: 9
      },

      columnStyles: {
        0: { halign: "center", cellWidth: 20 },
        1: { halign: "left", cellWidth: 90 },
        2: { halign: "right", cellWidth: 40 },
        3: { halign: "right", cellWidth: 40 }
      },

      didDrawPage: function () {

        doc.setFontSize(14);
        doc.text("Phadke Prakashan, Kolhapur", 105, 10, { align: "center" });

        doc.setFontSize(12);
        doc.text(
          "List of Parties whose TDS deducted / not deducted",
          105,
          16,
          { align: "center" }
        );

        doc.setFontSize(10);
        doc.text(`From ${startDate} to ${endDate}`, 105, 22, {
          align: "center"
        });

      }

    });

    window.open(doc.output("bloburl"), "_blank");

  };


  const handleClose = () => window.history.back();


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
          TDS & Party Report
        </Typography>

        <Paper sx={{ p: 3, borderRadius: 2 }}>

          <Typography fontWeight={600} mb={2}>
            Period
          </Typography>

          <Grid container spacing={2}>

            <Grid item xs={6}>
              <TextField
                label="Start Date"
                type="date"
                size="small"
                fullWidth
                value={startDate}
                onChange={(e)=>setStartDate(e.target.value)}
                InputLabelProps={{ shrink:true }}
              />
            </Grid>

            <Grid item xs={6}>
              <TextField
                label="End Date"
                type="date"
                size="small"
                fullWidth
                value={endDate}
                onChange={(e)=>setEndDate(e.target.value)}
                InputLabelProps={{ shrink:true }}
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
            sx={{ minWidth:160 }}
          >
            {printing ? "Generating PDF..." : "Print Report"}
          </Button>


          <Button
            variant="contained"
            color="error"
            startIcon={<CloseIcon/>}
            onClick={handleClose}
            sx={{ minWidth:120 }}
          >
            Close
          </Button>

        </Box>

      </Box>

    </Box>

  );

}