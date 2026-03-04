import React, { useState, useRef } from 'react';
import { Box, Paper, Typography, TextField, Checkbox, FormControlLabel, Button, Stack, CircularProgress } from "@mui/material";
import { useNavigate } from "react-router-dom";
import SalesInvoicePrint from './SalesinvPrint';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

// MOCK DATA: To simulate the screenshot layout immediately
const MOCK_DATA = [
  { BookCode: "P 5440", StandardName: "School L.", BookName: "Model Essays, Grammer & Communication Skill", Copies: 2, Price: 45.00, Amount: 90.00, Discount: 30, DiscountAmount: 63.00, GSTNo: "27AGGPP8699E1ZP", NoteNo: "00001", Date: "01-04-25" },
  { BookCode: "P 6348", StandardName: "School L.", BookName: "सुबोध हिंदी लेखन", Copies: 14, Price: 50.00, Amount: 700.00, Discount: 30, DiscountAmount: 490.00 },
  { BookCode: "P 6425", StandardName: "Std. XI", BookName: "Basic Electricity & Semiconductor Devices", Copies: 2, Price: 120.00, Amount: 240.00, Discount: 30, DiscountAmount: 168.00 },
  { BookCode: "P 6439", StandardName: "Std. XI", BookName: "Practical Electronics", Copies: 2, Price: 100.00, Amount: 200.00, Discount: 30, DiscountAmount: 140.00 },
  { BookCode: "P 5843", StandardName: "Std. XII", BookName: "Practical Electronics", Copies: 2, Price: 120.00, Amount: 240.00, Discount: 30, DiscountAmount: 168.00 },
];

function SalesInvoice() {
  const navigate = useNavigate();
  const [startNo, setStartNo] = useState("");
  const [endNo, setEndNo] = useState("");

    const [allchallansreqd, setAllchallansreqd] = useState(false);
  
      const [printcanvassorsbill, setPrintcanvassorsbill] = useState(false);
    
  const [printing, setPrinting] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const reportRef = useRef();

  const handleShowPreview = () => {
    setPrinting(true);
    // Simulate a short delay then show preview
    setTimeout(() => {
      setShowPreview(true);
      setPrinting(false);
    }, 500);
  };

  const handlePrint = async () => {
    setPrinting(true);
    try {
      const element = reportRef.current;
      const canvas = await html2canvas(element, { scale: 3, useCORS: true });
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");
      pdf.addImage(imgData, "PNG", 0, 0, 210, 297);
      window.open(pdf.output("bloburl"), "_blank");
    } catch (error) {
      console.error("Print Error:", error);
    } finally {
      setPrinting(false);
    }
  };

 // ... other imports
if (showPreview) {
  return (
    <Box sx={{ 
      bgcolor: "white", // Change from #525659 to white
      minHeight: "100vh", 
      p: 0, // Remove padding so it feels more like a full-screen preview
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center'
    }}>
      {/* ACTION BAR: Fixed at the top, hidden during actual print if using window.print() */}
      <Stack 
        direction="row" 
        spacing={2} 
        justifyContent="center" 
        sx={{ 
          py: 2, 
          width: '100%', 
          borderBottom: '1px solid #ddd',
          bgcolor: '#f8f9fa' 
        }}
      >
        <Button variant="contained" color="primary" onClick={handlePrint} disabled={printing}>
          {printing ? "Generating..." : "Print Report"}
        </Button>
        <Button variant="outlined" color="error" onClick={() => setShowPreview(false)}>
          Back
        </Button>
      </Stack>

      {/* PAPER AREA: No elevation/shadow to keep it looking flat like the screenshot */}
      <Box sx={{ mt: 4, width: "210mm", bgcolor: 'white' }}>
        <SalesInvoicePrint ref={reportRef} data={MOCK_DATA} />
      </Box>
    </Box>
  );
}

  return (
    <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "80vh", p: 2 }}>
      <Paper elevation={3} sx={{ width: "100%", maxWidth: 450, borderRadius: 2, overflow: "hidden" }}>
        <Box sx={{ bgcolor: "#1e293b", p: 2, color: "white", textAlign: 'center' }}>
          <Typography variant="h6">Sales Invoice</Typography>
        </Box>

                <Box sx={{ p: 4 }}>
        
         <Box display="flex" flexDirection="column" gap={3}>
                   
                   <Box display="flex" alignItems="center" justifyContent="space-between">
                     <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                       Start Number:
                     </Typography>
                     <TextField 
                       size="small" 
                       variant="outlined"
                       value={startNo} 
                       onChange={(e) => setStartNo(e.target.value)}
                       sx={{ width: 150 }}
                       inputProps={{ style: { textAlign: 'right' } }}
                     />
                   </Box>
       
                   <Box display="flex" alignItems="center" justifyContent="space-between">
                     <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                       End Number:
                     </Typography>
                     <TextField 
                       size="small" 
                       variant="outlined"
                       value={endNo} 
                       onChange={(e) => setEndNo(e.target.value)}
                       sx={{ width: 150 }}
                       inputProps={{ style: { textAlign: 'right' } }}
                     />


                   </Box>
                   <FormControlLabel 
                                 control={
                                   <Checkbox 
                                     checked={allchallansreqd} 
                                     onChange={(e) => setAllchallansreqd(e.target.checked)} 
                                     color="primary"
                                   />
                                 }
                                 label={
                                   <Typography variant="body2" sx={{ color: "#64748b" }}>
                                     All Challans Required
                                   </Typography>
                                 }
                               />

                               <FormControlLabel 
                                             control={
                                               <Checkbox 
                                                 checked={printcanvassorsbill} 
                                                 onChange={(e) => setPrintcanvassorsbill(e.target.checked)} 
                                                 color="primary"
                                               />
                                             }
                                             label={
                                               <Typography variant="body2" sx={{ color: "#64748b" }}>
                                                 Print Canvassor's Bill
                                               </Typography>
                                             }
                                           />
       

 
  <Box display="flex" gap={2} mt={4}>
    <Button 
      fullWidth  // Added fullWidth to match your layout
      variant="contained" 
      color="primary" 
      onClick={handleShowPreview} // CHANGE THIS from handlePrint to handleShowPreview
      disabled={printing}
      sx={{ py: 1.2 }}
    >
      {printing ? <CircularProgress size={24} color="inherit" /> : "Preview / Print"}
    </Button>
    <Button 
      fullWidth
      variant="outlined" 
      color="error" 
      onClick={() => navigate(-1)}
      sx={{ py: 1.2 }}
    >
      Close
    </Button>
  </Box></Box>
        </Box>
      </Paper>
    </Box>
  );
}

export default SalesInvoice;