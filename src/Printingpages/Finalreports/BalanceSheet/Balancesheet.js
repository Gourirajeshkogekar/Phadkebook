import React, { useState,useRef } from "react";
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import BalanceHeaderPage from "./BalancesheetPrint";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";



function BalanceSheet() {
  const navigate = useNavigate();
  const [asOnDate, setAsOnDate] = useState("2026-03-31");
 const reportRef = useRef(null); // Reference to the hidden report
  const [printing, setPrinting] = useState(false);

  const cardStyle = {
    p: 3,
    borderRadius: 2,
    background: "#fff",
    boxShadow: "0 6px 16px rgba(0,0,0,0.08)"
  };


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
           Balance Sheet
          </Typography>

        <Paper sx={cardStyle}>
          {/* Date Selection Grid */}
          <Box
            display="grid"
            gridTemplateColumns="160px 1fr 60px"
            gap={2}
            mb={2}
            alignItems="center"
          >
            <Typography fontWeight={600}>
              As On :
            </Typography>

            <TextField
              type="date"
              size="small"
              value={asOnDate}
              onChange={(e) => setAsOnDate(e.target.value)}
            />

           </Box>

          {/* Right Aligned Utility Button */}
          <Box display="flex" justifyContent="flex-end" mb={2}>
            <Button variant="outlined">
              Show Diff. in Trial Balance
            </Button>
          </Box>

          

         
        </Paper>

        {/* ✅ Main Action Buttons */}
        <Box mt={4} display="flex" justifyContent="center" gap={3}>
          <Button
            variant="contained"
            sx={{
              px: 5,
              background: "#2b6cb0",
              boxShadow: 3,
              "&:hover": { background: "#1f4f82" }
            }}
            onClick={handlePrint
            }
          >
            Print Report
          </Button>

          <Button
            variant="contained"
            color="error"
            sx={{ px: 5, boxShadow: 3 }}
            onClick={() => navigate(-1)}
          >
            Close
          </Button>
        </Box>

      </Box>

       <Box sx={{ position: "absolute", top: "-10000px", left: "-10000px" }}>
              <div ref={reportRef}>
                <BalanceHeaderPage state={{ asOnDate }} />
              </div>
            </Box>
    </Box>
  );
}

export default BalanceSheet;