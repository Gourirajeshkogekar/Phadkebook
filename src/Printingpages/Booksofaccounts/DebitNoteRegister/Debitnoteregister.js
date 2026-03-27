// import React, { useState, useRef } from "react";
// import {
//   Box,
//   Paper,
//   Typography,
//   TextField,
//   Button,
//   Grid,
//   Stack
// } from "@mui/material";
// import PrintIcon from "@mui/icons-material/Print";
// import CloseIcon from "@mui/icons-material/Close";
// import dayjs from "dayjs";
// import DebitNoteRegisterPrint from "./DebitnoteregisterPrint";
// import jsPDF from "jspdf";
// import html2canvas from "html2canvas";

// export default function DebitNoteRegister() {

  

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

//   const [startDate, setStartDate] = useState(fyStart.format("YYYY-MM-DD"));
//   const [endDate, setEndDate] = useState(fyEnd.format("YYYY-MM-DD"));

 

//   const reportRef = useRef(null);
//      const [printing, setPrinting] = useState(false);
//   const handlePrint = async () => {
//       setPrinting(true);
//       // Give the DOM a moment to ensure the hidden report is ready
//       setTimeout(async () => {
//         try {
//           const element = reportRef.current;
//           if (!element) return;
  
//           // Capture the element as a canvas
//           const canvas = await html2canvas(element, { 
//             scale: 2, 
//             useCORS: true,
//             logging: false 
//           });
  
//           const imgData = canvas.toDataURL("image/png");
//           const pdf = new jsPDF("p", "mm", "a4");
          
//           // Add image to PDF (A4 size is 210mm x 297mm)
//           pdf.addImage(imgData, "PNG", 0, 0, 210, 297);
          
//           // Open the PDF in a new Chrome tab
//           window.open(pdf.output("bloburl"), "_blank");
//         } catch (error) {
//           console.error("PDF Error:", error);
//         } finally {
//           setPrinting(false);
//         }
//       }, 500);  
//     };
  

//   return (
//     <Box
//       sx={{
//         minHeight: "100vh",
//         background: "#eef2f6",
//         display: "flex",
//         justifyContent: "center",
//         pt: 7
//       }}
//     >
//       <Box width={480}>

//         <Typography
//           variant="h5"
//           fontWeight={600}
//           textAlign="center"
//           mb={2.5}
//         >
//           Debit Note Register
//         </Typography>

//         <Paper sx={{ p: 2.5, borderRadius: 3, mb: 3 }}>
//           <Typography fontWeight={600} mb={1.5}>
//             Period
//           </Typography>

//           <Grid container spacing={2}>
//             <Grid item xs={6}>
//               <TextField
//                 label="Start Date"
//                 type="date"
//                 size="small"
//                 fullWidth
//                 InputLabelProps={{ shrink: true }}
//                 value={startDate}
//                 onChange={(e) => setStartDate(e.target.value)}
//               />
//             </Grid>

//             <Grid item xs={6}>
//               <TextField
//                 label="End Date"
//                 type="date"
//                 size="small"
//                 fullWidth
//                 InputLabelProps={{ shrink: true }}
//                 value={endDate}
//                 onChange={(e) => setEndDate(e.target.value)}
//               />
//             </Grid>
//           </Grid>
//         </Paper>

//         <Stack direction="row" spacing={2.5} justifyContent="center">
//           <Button
//             variant="contained"
//             startIcon={<PrintIcon />}
//             onClick={handlePrint}
//           >
//             Print
//           </Button>

//           <Button
//             variant="contained"
//             color="error"
//             startIcon={<CloseIcon />}
//             onClick={() => window.history.back()}
//           >
//             Close
//           </Button>
//         </Stack>

//       </Box>

//        <Box sx={{ position: "absolute", top: "-10000px", left: "-10000px" }}>
//                       <div ref={reportRef}>
//                         <DebitNoteRegisterPrint state={{ startDate, endDate }} />
//                       </div>
//                     </Box>
//     </Box>
//   );
// }




import React, { useState } from "react";
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Grid,
  Stack
} from "@mui/material";

import PrintIcon from "@mui/icons-material/Print";
import CloseIcon from "@mui/icons-material/Close";

import dayjs from "dayjs";
import axios from "axios";

import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export default function DebitNoteRegister() {

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

  const [startDate, setStartDate] = useState(fyStart.format("YYYY-MM-DD"));
  const [endDate, setEndDate] = useState(fyEnd.format("YYYY-MM-DD"));

  /* ===============================
     PRINT FUNCTION
  =============================== */

  const handlePrint = async () => {

    try {

      const res = await axios.get(
        "https://publication.microtechsolutions.net.in/php/get/getDebitNoteRegister.php",
        {
          params: {
            fromdate: startDate,
            todate: endDate
          }
        }
      );

      const rows = res.data || [];

      if (!rows.length) {
        alert("No data found");
        return;
      }

      const getDate = (text = "") => {
        const match = text.match(/\d{2}-\d{2}-\d{4}/);
        return match ? match[0] : "Unknown";
      };

      const grouped = {};

      rows.forEach((row) => {

        const date = getDate(row["Particulars"]);

        if (!grouped[date]) grouped[date] = [];

        grouped[date].push(row);

      });

      let grandDebit = 0;
      let grandCredit = 0;

      const body = [];

      Object.keys(grouped).forEach(date => {

        const list = grouped[date];

        let dayDebit = 0;
        let dayCredit = 0;

        body.push([
          {
            content: date,
            colSpan: 5,
            styles: { halign: "center", fontStyle: "bold" }
          }
        ]);

        list.forEach(row => {

          const debit = Number((row["Debit"] || "0").replace(/,/g, ""));
          const credit = Number((row["Credit"] || "0").replace(/,/g, ""));

          dayDebit += debit;
          dayCredit += credit;

          body.push([
            row["Entry No./Ref.No."],
            row["Account Name"],
            row["Particulars"],
            debit.toLocaleString("en-IN",{minimumFractionDigits:2}),
            credit.toLocaleString("en-IN",{minimumFractionDigits:2})
          ]);

        });

        grandDebit += dayDebit;
        grandCredit += dayCredit;

        body.push([
          "",
          "",
          {
            content: "Day Total",
            styles:{halign:"right",fontStyle:"bold"}
          },
          dayDebit.toLocaleString("en-IN",{minimumFractionDigits:2}),
          dayCredit.toLocaleString("en-IN",{minimumFractionDigits:2})
        ]);

      });

      body.push([
        "",
        "",
        {
          content: "Grand Total",
          styles:{halign:"right",fontStyle:"bold"}
        },
        grandDebit.toLocaleString("en-IN",{minimumFractionDigits:2}),
        grandCredit.toLocaleString("en-IN",{minimumFractionDigits:2})
      ]);

      const pdf = new jsPDF("p","mm","a4");

      const pageWidth = pdf.internal.pageSize.getWidth();

      autoTable(pdf,{

        margin:{top:40},

        head:[[
          "Entry No./Ref.No.",
          "Account Name",
          "Particulars",
          "Debit",
          "Credit"
        ]],

        body,

        styles:{
          fontSize:9,
          textColor:[0,0,0]
        },

        columnStyles:{
          3:{halign:"right"},
          4:{halign:"right"}
        },

        didDrawPage:()=>{

          pdf.setFont("times","bold");
          pdf.setFontSize(16);

          pdf.text(
            "Phadke Prakashan, Kolhapur.",
            pageWidth/2,
            10,
            {align:"center"}
          );

          pdf.setFontSize(14);

          pdf.text(
            "Debit Note Register",
            pageWidth/2,
            18,
            {align:"center"}
          );

          pdf.setFontSize(11);

          pdf.text(
            `From ${dayjs(startDate).format("DD-MM-YYYY")} to ${dayjs(endDate).format("DD-MM-YYYY")}`,
            pageWidth/2,
            25,
            {align:"center"}
          );

        }

      });

      window.open(pdf.output("bloburl"),"_blank");

    } catch(err){

      console.error("API ERROR",err);

    }

  };

  return (

    <Box
      sx={{
        minHeight: "100vh",
        background: "#eef2f6",
        display: "flex",
        justifyContent: "center",
        pt: 7
      }}
    >

      <Box width={480}>

        <Typography
          variant="h5"
          fontWeight={600}
          textAlign="center"
          mb={2.5}
        >
          Debit Note Register
        </Typography>

        <Paper sx={{ p: 2.5, borderRadius: 3, mb: 3 }}>

          <Typography fontWeight={600} mb={1.5}>
            Period
          </Typography>

          <Grid container spacing={2}>

            <Grid item xs={6}>
              <TextField
                label="Start Date"
                type="date"
                size="small"
                fullWidth
                InputLabelProps={{ shrink: true }}
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
            </Grid>

            <Grid item xs={6}>
              <TextField
                label="End Date"
                type="date"
                size="small"
                fullWidth
                InputLabelProps={{ shrink: true }}
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
              />
            </Grid>

          </Grid>

        </Paper>

        <Stack direction="row" spacing={2.5} justifyContent="center">

          <Button
            variant="contained"
            startIcon={<PrintIcon />}
            onClick={handlePrint}
          >
            Print
          </Button>

          <Button
            variant="contained"
            color="error"
            startIcon={<CloseIcon />}
            onClick={() => window.history.back()}
          >
            Close
          </Button>

        </Stack>

      </Box>

    </Box>

  );

}