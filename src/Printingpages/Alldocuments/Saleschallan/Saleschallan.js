// import React, { useState, useRef } from "react";
// import { 
//   Box, Typography, TextField, Checkbox, FormControlLabel, 
//   Button, CircularProgress, Paper, Divider 
// } from "@mui/material";
// import html2canvas from "html2canvas";
// import jsPDF from "jspdf";
// import { useNavigate } from "react-router-dom";
// import SalesChallanPrint from "./SaleschallanPrint";

// function SalesChallanForm() {
//   const [startNo, setStartNo] = useState("1");
//   const [endNo, setEndNo] = useState("1");
//   const [allRequired, setAllRequired] = useState(false);
//   const [printing, setPrinting] = useState(false);
  
//   const reportRef = useRef();
//   const navigate = useNavigate();

//   const handlePrint = async () => {
//     setPrinting(true);
//     try {
//       const element = reportRef.current;
//       const canvas = await html2canvas(element, { 
//         scale: 3, 
//         useCORS: true,
//         logging: false
//       });
      
//       const imgData = canvas.toDataURL("image/png");
//       const pdf = new jsPDF("p", "mm", "a4");
//       const pdfWidth = pdf.internal.pageSize.getWidth();
//       const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
      
//       pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
//       window.open(pdf.output("bloburl"), "_blank");
//     } catch (error) {
//       console.error("Print Error:", error);
//     } finally {
//       setPrinting(false);
//     }
//   };

//   return (
//     <Box 
//       sx={{ 
//         display: "flex", 
//         justifyContent: "center", 
//         alignItems: "center", 
//         minHeight: "80vh", // Centers vertically in the main content area
//         p: 2 
//       }}
//     >
//       {/* HIDDEN REPORT CONTAINER */}
//       <Box sx={{ position: "absolute", left: "-9999px", top: 0 }}>
//         <SalesChallanPrint ref={reportRef} />
//       </Box>

//       {/* OFFICIAL FORM CARD */}
//       <Paper 
//         elevation={3} 
//         sx={{ 
//           width: "100%", 
//           maxWidth: 450, 
//           borderRadius: 2,
//           overflow: "hidden" 
//         }}
//       >
//         {/* Header Bar */}
//         <Box sx={{ bgcolor: "#1e293b", p: 2 }}>
//           <Typography variant="h6" sx={{ color: "white", fontWeight: 600, textAlign:'center'}}>             Sales Challan
//           </Typography>
//         </Box>

//         <Box sx={{ p: 4 }}>
//           <Box display="flex" flexDirection="column" gap={3}>
            
//             <Box display="flex" alignItems="center" justifyContent="space-between">
//               <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
//                 Start Number:
//               </Typography>
//               <TextField 
//                 size="small" 
//                 variant="outlined"
//                 value={startNo} 
//                 onChange={(e) => setStartNo(e.target.value)}
//                 sx={{ width: 150 }}
//                 inputProps={{ style: { textAlign: 'right' } }}
//               />
//             </Box>

//             <Box display="flex" alignItems="center" justifyContent="space-between">
//               <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
//                 End Number:
//               </Typography>
//               <TextField 
//                 size="small" 
//                 variant="outlined"
//                 value={endNo} 
//                 onChange={(e) => setEndNo(e.target.value)}
//                 sx={{ width: 150 }}
//                 inputProps={{ style: { textAlign: 'right' } }}
//               />
//             </Box>

//             <Divider sx={{ my: 1 }} />

//             <FormControlLabel 
//               control={
//                 <Checkbox 
//                   checked={allRequired} 
//                   onChange={(e) => setAllRequired(e.target.checked)} 
//                   color="primary"
//                 />
//               }
//               label={
//                 <Typography variant="body2" sx={{ color: "#64748b" }}>
//                   Include all available challans in this range
//                 </Typography>
//               }
//             />
//           </Box>

//           <Box display="flex" gap={2} mt={4}>
//             <Button 
//               fullWidth
//               variant="contained" 
//               disabled={printing} 
//               onClick={handlePrint}
//               sx={{ 
//                 py: 1.2, 
//                 bgcolor: "#2563eb",
//                 '&:hover': { bgcolor: "#1d4ed8" }
//               }}
//             >
//               {printing ? <CircularProgress size={24} color="inherit" /> : "Print Report"}
//             </Button>
//             <Button 
//               fullWidth
//               variant="outlined" 
//               color="error" 
//               onClick={() => navigate(-1)}
//               sx={{ py: 1.2 }}
//             >
//               Close
//             </Button>
//           </Box>
//         </Box>
//       </Paper>
//     </Box>
//   );
// }

// export default SalesChallanForm;




import React, { useState } from "react";
import {
  Box,
  Typography,
  TextField,
  Checkbox,
  FormControlLabel,
  Button,
  CircularProgress,
  Paper,
  Divider
} from "@mui/material";

import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function SalesChallanForm() {

  const [startNo, setStartNo] = useState("");
  const [endNo, setEndNo] = useState("");
  const [allRequired, setAllRequired] = useState(false);
  const [printing, setPrinting] = useState(false);

  const navigate = useNavigate();

  const handlePrint = async () => {

    setPrinting(true);

    try {

      const response = await axios.get(
        "https://publication.microtechsolutions.net.in/php/get/getSalesChallan.php",
        {
          params: {
            startNumber: startNo,
            endNumber: endNo,
            includeAll: allRequired
          }
        }
      );

      const rows = response.data?.data || [];

      const doc = new jsPDF("p", "mm", "a4");

      /* HEADER */

      doc.setFont("Times","Bold");
      doc.setFontSize(14);
      doc.text("Phadke Prakashan, Kolhapur.", 14, 15);

      doc.setFontSize(10);
      doc.text("Phadke Bhavan, Near Hari Mandir, Dudhali", 14, 20);
      doc.text("Kolhapur - 416012", 14, 25);

      doc.setFontSize(14);
      doc.text("PHADKE BOOK HOUSE", 140, 15);

      doc.setFontSize(12);
      doc.text("Sales Challan", 140, 22);

      /* TABLE */

      const tableColumn = [
        "Sr",
        "Code",
        "Class",
        "Description",
        "Qty",
        "Rate"
      ];

      const tableRows = rows.map((item) => [
        item.Sr,
        item.Code,
        item.Class,
        item.Description,
        item.Qty,
        Number(item.Rate).toFixed(2)
      ]);

      autoTable(doc,{
        startY:35,
        head:[tableColumn],
        body:tableRows,
        theme:"grid",
        styles:{
          fontSize:9
        },
        headStyles:{
          fillColor:[240,240,240],
          textColor:0
        },
        columnStyles:{
          4:{halign:"right"},
          5:{halign:"right"}
        }
      });

      window.open(doc.output("bloburl"),"_blank");

      setPrinting(false);

    } catch (error) {

      console.error("API Error:", error);
      setPrinting(false);

    }

  };

  return (

    <Box
      sx={{
        minHeight: "100vh",
        bgcolor: "#eef2f7",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        pt: 6
      }}
    >

      {/* PAGE TITLE */}

      <Typography
        variant="h5"
        sx={{
          fontWeight: "bold",
          mb: 4
        }}
      >
        Sales Challan
      </Typography>

      {/* FORM CARD */}

      <Paper
        elevation={4}
        sx={{
          width: 650,
          p: 5,
          borderRadius: 3
        }}
      >

        {/* START NUMBER */}

        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            mb: 4
          }}
        >

          <Typography
            sx={{
              width: 150,
              fontWeight: "bold"
            }}
          >
            Start No :
          </Typography>

          <TextField
            fullWidth
            size="small"
            value={startNo}
            onChange={(e)=>setStartNo(e.target.value)}
          />

        </Box>

        {/* END NUMBER */}

        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            mb: 4
          }}
        >

          <Typography
            sx={{
              width: 150,
              fontWeight: "bold"
            }}
          >
            End No :
          </Typography>

          <TextField
            fullWidth
            size="small"
            value={endNo}
            onChange={(e)=>setEndNo(e.target.value)}
          />

        </Box>

        <Divider sx={{ mb:3 }}/>

        {/* CHECKBOX */}

        <FormControlLabel
          control={
            <Checkbox
              checked={allRequired}
              onChange={(e)=>setAllRequired(e.target.checked)}
            />
          }
          label={
            <Typography sx={{ fontWeight:"bold" }}>
              All Challans are Required
            </Typography>
          }
        />

      </Paper>

      {/* BUTTONS */}

      <Box
        sx={{
          display: "flex",
          gap: 3,
          mt: 4
        }}
      >

        <Button
          variant="contained"
          sx={{
            width: 180,
            height: 45,
            fontWeight: "bold",
            bgcolor:"#2d6fb7"
          }}
          disabled={printing}
          onClick={handlePrint}
        >
          {printing ? <CircularProgress size={22}/> : "PRINT REPORT"}
        </Button>

        <Button
          variant="contained"
          color="error"
          sx={{
            width: 140,
            height: 45,
            fontWeight: "bold"
          }}
          onClick={()=>navigate(-1)}
        >
          CLOSE
        </Button>

      </Box>

    </Box>

  );
}

export default SalesChallanForm;