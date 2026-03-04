import React, { useState, useRef } from "react";
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import SubAccountAllocation from "../SubAccountAllocation";
import FixedAssetHeaderPage from "./FixedassetschedulePrint";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

function FixedAssetSchedule() {
  const navigate = useNavigate();
  const [asOnDate, setAsOnDate] = useState("2026-03-31");
  const [showAllocation, setShowAllocation] = useState(false);
 const reportRef = useRef(null); // Reference to the hidden report
  const cardStyle = {
    p: 3,
    borderRadius: 2,
    background: "#fff",
    boxShadow: "0 6px 16px rgba(0,0,0,0.08)"
  };

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
    <Box sx={{ minHeight: "100vh", background: "#f4f6fa", pt: 6 }}>
      <Box sx={{ width: 900, mx: "auto" }}>

        {/* ===== PAGE TITLE ===== */}
                <Typography variant="h5" fontWeight={700} textAlign="center" mb={3} sx={{ color: "#333" }}>
      
          Fixed Asset Schedule
        </Typography>

        {/* ===== MAIN INPUT CARD ===== */}
        <Paper sx={cardStyle}>

           {/* --- VIEW SWITCHER --- */}
          {showAllocation ? (
            // VIEW 1: The Allocation Table
            <SubAccountAllocation onClose={() => setShowAllocation(false)} />
          ) : (
            // VIEW 2: The Main Form
            <>
          
          {/* DATE SELECTION SECTION */}
          <Box
            display="grid"
            gridTemplateColumns="160px 1fr 60px"
            gap={2}
            mb={2}
            alignItems="center"
          >
            <Typography fontWeight={600} color="text.primary">
              As On :
            </Typography>

            <TextField
              type="date"
              size="small"
              value={asOnDate}
              onChange={(e) => setAsOnDate(e.target.value)}
              fullWidth
            />

           
          </Box>

          {/* UTILITY ACTION (Right Aligned) */}
          <Box display="flex" justifyContent="flex-end" mb={2}>
            <Button 
              variant="outlined" 
              size="small"
              sx={{ textTransform: 'none', color: '#555', borderColor: '#ccc' }}
            >
              Show Diff. in Trial Balance
            </Button>
          </Box>

          {/* VERTICAL SPACER (To match legacy UI height) */}
          <Box height={140} />

          {/* SECONDARY ACTIONS (Bottom of Card) */}
          <Box display="flex" gap={2}>
            <Button
              variant="outlined"
              size="small"
              sx={{ textTransform: 'none' }}
                  onClick={() => setShowAllocation(true)}
            >
              Sub Account Allocation
            </Button>

          
          </Box>
</>
          )}
        </Paper>

        {/* ===== PRIMARY CONTROL BUTTONS ===== */}
        <Box
          mt={4}
          display="flex"
          justifyContent="center"
          gap={3}
        >
          <Button
            variant="contained"
            sx={{
              px: 6,
              py: 1.2,
              background: "#2b6cb0",
              fontWeight: 600,
              boxShadow: 3,
              textTransform: 'none',
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
            sx={{ 
              px: 6, 
              py: 1.2, 
              fontWeight: 600, 
              boxShadow: 3, 
              textTransform: 'none' 
            }}
            onClick={() => navigate(-1)}
          >
            Close
          </Button>
        </Box>

      </Box>


       <Box sx={{ position: "absolute", top: "-10000px", left: "-10000px" }}>
                    <div ref={reportRef}>
                      <FixedAssetHeaderPage state={{ asOnDate }} />
                    </div>
                  </Box>
    </Box>
  );
}

export default FixedAssetSchedule;