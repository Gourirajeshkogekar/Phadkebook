// import React, { useState , useRef} from "react";
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
// import CreditNoteRegisterPrint from "./CreditnoteregisterPrint";
// import html2canvas from "html2canvas";
// import jsPDF from "jspdf";



// export default function CreditNoteRegister() {

 

//   const today = dayjs();
//   const year = today.year();
//   const month = today.month(); // Jan = 0

//   let fyStart, fyEnd;

//   if (month < 3) {
//     // Jan–Mar → Previous FY
//     fyStart = dayjs(`${year - 1}-04-01`);
//     fyEnd = dayjs(`${year}-03-31`);
//   } else {
//     // Apr–Dec → Current FY
//     fyStart = dayjs(`${year}-04-01`);
//     fyEnd = dayjs(`${year + 1}-03-31`);
//   }

//   const [startDate, setStartDate] = useState(fyStart.format("YYYY-MM-DD"));
//   const [endDate, setEndDate] = useState(fyEnd.format("YYYY-MM-DD"));

   

//   const reportRef = useRef(null);
//        const [printing, setPrinting] = useState(false);
//     const handlePrint = async () => {
//         setPrinting(true);
//         // Give the DOM a moment to ensure the hidden report is ready
//         setTimeout(async () => {
//           try {
//             const element = reportRef.current;
//             if (!element) return;
    
//             // Capture the element as a canvas
//             const canvas = await html2canvas(element, { 
//               scale: 2, 
//               useCORS: true,
//               logging: false 
//             });
    
//             const imgData = canvas.toDataURL("image/png");
//             const pdf = new jsPDF("p", "mm", "a4");
            
//             // Add image to PDF (A4 size is 210mm x 297mm)
//             pdf.addImage(imgData, "PNG", 0, 0, 210, 297);
            
//             // Open the PDF in a new Chrome tab
//             window.open(pdf.output("bloburl"), "_blank");
//           } catch (error) {
//             console.error("PDF Error:", error);
//           } finally {
//             setPrinting(false);
//           }
//         }, 500); // 500ms is safer for rendering complex reports
//       };


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
//           Credit Note Register
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
//                 <div ref={reportRef}>
//                   <CreditNoteRegisterPrint state={{ startDate, endDate }} />
//                 </div>
//               </Box>
//     </Box>
//   );
// }











































































import React, { useState, useRef } from "react";
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
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import CreditNoteRegisterPrint from "./CreditnoteregisterPrint";

export default function CreditNoteRegister() {

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
  const [rows, setRows] = useState([]);

  const reportRef = useRef(null);

  const handlePrint = async () => {

    try {

      /* API CALL */

      const res = await axios.get(
        "https://publication.microtechsolutions.net.in/php/get/getCreditNoteRegister.php",
        {
          params: {
            fromdate: startDate,
            todate: endDate
          }
        }
      );

      setRows(res.data || []);

      setTimeout(async () => {

        const element = reportRef.current;

        const canvas = await html2canvas(element, {
          scale: 2,
          useCORS: true
        });

        const pdf = new jsPDF("p", "mm", "a4");

        const pageWidth = 210;
        const pageHeight = 297;

        /* HEADER HEIGHT */
        const headerHeight = 40;

        const imgWidth = pageWidth;

        /* SAFE PAGE SLICE HEIGHT */
        const pageCanvasHeight =
          (canvas.width * (pageHeight - headerHeight - 5)) / pageWidth;

        let renderedHeight = 0;
        let pageNumber = 0;

        while (renderedHeight < canvas.height) {

          const pageCanvas = document.createElement("canvas");
          const ctx = pageCanvas.getContext("2d");

          pageCanvas.width = canvas.width;

          pageCanvas.height = Math.min(
            pageCanvasHeight,
            canvas.height - renderedHeight
          );

          ctx.drawImage(
            canvas,
            0,
            renderedHeight,
            canvas.width,
            pageCanvas.height,
            0,
            0,
            canvas.width,
            pageCanvas.height
          );

          const imgData = pageCanvas.toDataURL("image/png");

          if (pageNumber > 0) pdf.addPage();

          /* HEADER */

          pdf.setFont("Times", "bold");
          pdf.setFontSize(16);
          pdf.text("Phadke Prakashan, Kolhapur.", 105, 10, { align: "center" });

          pdf.setFontSize(14);
          pdf.text("Credit Note Register", 105, 18, { align: "center" });

          pdf.setFontSize(11);
          pdf.text(
            `From ${startDate} to ${endDate}`,
            105,
            26,
            { align: "center" }
          );

          /* TABLE IMAGE */

          pdf.addImage(
            imgData,
            "PNG",
            0,
            headerHeight,
            imgWidth,
            (pageCanvas.height * imgWidth) / canvas.width
          );

          renderedHeight += pageCanvasHeight;
          pageNumber++;

        }

        window.open(pdf.output("bloburl"), "_blank");

      }, 700);

    } catch (err) {
      console.error("API ERROR", err);
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
          Credit Note Register
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

      {/* HIDDEN PRINT AREA */}

      <Box
        sx={{
          position: "absolute",
          top: "-10000px",
          left: "-10000px"
        }}
      >
        <div ref={reportRef}>
          <CreditNoteRegisterPrint rows={rows} />
        </div>
      </Box>

    </Box>

  );

}