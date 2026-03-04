import React, { useState, useRef } from "react";
import {
  Box, Paper, Typography, TextField, Button, IconButton, CircularProgress
} from "@mui/material";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import { useNavigate } from "react-router-dom";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import PLAWithlastYearprint from "./PLAWithLastYearprint"; // Ensure this component is exported correctly

function PLAWithLastyear() {
  const navigate = useNavigate();
  const reportRef = useRef(null); // Reference to the hidden report

  const [startDate, setStartDate] = useState("2025-04-01");
  const [endDate, setEndDate] = useState("2026-03-31");
  const [printing, setPrinting] = useState(false);

  // ✅ The handlePrint function you requested
  const handlePrint = async () => {
    setPrinting(true);
    // Give the DOM a moment to ensure the hidden report is ready
    setTimeout(async () => {
      try {
        const element = reportRef.current;
        if (!element) return;

        // Capture the element as a canvas
        const canvas = await html2canvas(element, { 
          scale: 2, 
          useCORS: true,
          logging: false 
        });

        const imgData = canvas.toDataURL("image/png");
        const pdf = new jsPDF("p", "mm", "a4");
        
        // Add image to PDF (A4 size is 210mm x 297mm)
        pdf.addImage(imgData, "PNG", 0, 0, 210, 297);
        
        // Open the PDF in a new Chrome tab
        window.open(pdf.output("bloburl"), "_blank");
      } catch (error) {
        console.error("PDF Error:", error);
      } finally {
        setPrinting(false);
      }
    }, 500); // 500ms is safer for rendering complex reports
  };

  return (
    <Box sx={{ minHeight: "100vh", background: "#f0f0f0", p: 3 }}>
      <Box sx={{ width: "100%", maxWidth: 600, mx: "auto" }}>
        
        <Typography variant="h5" fontWeight={700} textAlign="center" mb={3} sx={{ color: "#333" }}>
          P & L A/c With Last Year
        </Typography>

        <Paper variant="outlined" sx={{ p: 3, bgcolor: "#f9f9f9" }}>
          {/* AS ON SECTION */}
          <Box sx={{ border: "1px solid #ccc", p: 2, borderRadius: 1, position: "relative", mb: 3 }}>
            <Typography variant="caption" sx={{ position: "absolute", top: -10, left: 10, bgcolor: "#f9f9f9", px: 1, fontWeight: 'bold' }}>
              As On?
            </Typography>
            
            <Box display="flex" flexDirection="column" gap={2}>
              <Box display="flex" alignItems="center" gap={1}>
                <Typography variant="body2" sx={{fontWeight:'bold'}} width={80}>Start Date</Typography>
                <TextField type="date" size="small" value={startDate} onChange={e => setStartDate(e.target.value)} />
               </Box>
              <Box display="flex" alignItems="center" gap={1}>
                <Typography variant="body2" width={80} sx={{fontWeight:'bold'}}>End Date</Typography>
                <TextField type="date" size="small" value={endDate} onChange={e => setEndDate(e.target.value)} />
              </Box>
            </Box>
  <Button variant="outlined" size="small" sx={{ textTransform: 'none', fontSize: '0.75rem' , padding:'10px', mt:2}}>
                                Show Diff. in Trial Balance
                              </Button>
          
          </Box>

           
              
           

            <Box display="flex"   gap={1}>
              <Button 
                variant="contained" 
                disabled={printing}
                sx={{ textTransform: 'none', minWidth: 120 }}
                onClick={handlePrint}
              >
                {printing ? <CircularProgress size={20} color="inherit" /> : "Print Report"}
              </Button>
              <Button variant="contained" color="inherit" sx={{ textTransform: 'none', minWidth: 120, border: '1px solid #999' }} onClick={() => navigate(-1)}>
                Close
              </Button>
            </Box>
         </Paper>
      </Box>

      {/* ✅ HIDDEN CONTAINER FOR PDF GENERATION */}
      {/* We keep it in the DOM but move it far off-screen so the user doesn't see it */}
      <Box sx={{ position: "absolute", top: "-10000px", left: "-10000px" }}>
        <div ref={reportRef}>
          <PLAWithlastYearprint state={{ startDate, endDate }} />
        </div>
      </Box>
    </Box>
  );
}

export default PLAWithLastyear;