import React, { useEffect, useState, useRef } from "react";
import {
  Box, Paper, Typography, TextField, Button,
  Checkbox, FormControlLabel, CircularProgress
} from "@mui/material";
import { useNavigate } from "react-router-dom";
// Import your shared component
import SubAccountAllocation from "../SubAccountAllocation";
import CapitalAccountPrint from "./CapitalAccPrint";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";


function Capitalaccounts() {
  const navigate = useNavigate();
 const reportRef = useRef(null); // Reference to the hidden report
  // View State: Toggle between main form and allocation table
  const [showAllocation, setShowAllocation] = useState(false);

  // Form States
  const [startDate, setStartDate] = useState("2025-04-01");
  const [endDate, setEndDate] = useState("2026-03-31");
  const [groups, setGroups] = useState([]);
  const [selected, setSelected] = useState([]);
  const [loading, setLoading] = useState(true);
  const [printSumm, setPrintSumm] = useState(false);
  const [opening, setOpening] = useState(false);
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

  const listBoxStyle = {
    border: "1px solid #999",
    p: 1,
    height: 240,
    overflowY: "auto",
    bgcolor: "#fff",
    fontSize: "0.75rem",
    fontFamily: "monospace"
  };

  useEffect(() => {
    setLoading(true);
    fetch("https://publication.microtechsolutions.net.in/php/AccountGroupget.php")
      .then((res) => res.json())
      .then((data) => {
        setGroups(data.map((item) => item.GroupName));
        setLoading(false);
      })
      .catch((err) => {
        console.error("Fetch error:", err);
        setLoading(false);
      });
  }, []);

  // Selection Logic
  const moveAllRight = () => { setSelected([...selected, ...groups]); setGroups([]); };
  const moveAllLeft = () => { setGroups([...groups, ...selected]); setSelected([]); };
  const moveSingleRight = (item) => {
    setSelected([...selected, item]);
    setGroups(groups.filter(g => g !== item));
  };
  const moveSingleLeft = (item) => {
    setGroups([...groups, item]);
    setSelected(selected.filter(g => g !== item));
  };

  return (
    <Box sx={{ minHeight: "100vh", background: "#f0f0f0", p: { xs: 1, md: 2 } }}>
      <Box sx={{ width: "100%", maxWidth: 900, mx: "auto" }}>
        
        <Typography variant="h6" fontWeight={700} textAlign="center" mb={1} sx={{ color: "#333" }}>
Capital Accounts
        </Typography>

        <Paper variant="outlined" sx={{ p: 2, bgcolor: "#f9f9f9" }}>
          
          {/* --- VIEW SWITCHER --- */}
          {showAllocation ? (
            // VIEW 1: The Allocation Table
            <SubAccountAllocation onClose={() => setShowAllocation(false)} />
          ) : (
            // VIEW 2: The Main Form
            <>
              {/* PERIOD SECTION */}
              <Box display="grid" gridTemplateColumns="1.2fr 1fr" gap={2} mb={2}>
                <Box sx={{ border: "1px solid #ccc", p: 1.5, borderRadius: 1, position: "relative" }}>
                  <Typography variant="caption" sx={{ position: "absolute", top: -10, left: 10, bgcolor: "#f9f9f9", px: 1, fontWeight: 'bold' }}>
                    Period
                  </Typography>
                  <Box display="flex" alignItems="center" gap={1} mb={1}>
                    <Typography variant="caption" width={70}>Start Date</Typography>
                    <TextField type="date" size="small" value={startDate} onChange={e => setStartDate(e.target.value)} />
                  </Box>
                  <Box display="flex" alignItems="center" gap={1}>
                    <Typography variant="caption" width={70}>End Date</Typography>
                    <TextField type="date" size="small" value={endDate} onChange={e => setEndDate(e.target.value)} />
                  </Box>
                   
                </Box>

                               <Box sx={{   p: 1.5, borderRadius: 1, position: "relative" }}>


                    <Button variant="outlined" size="small" sx={{ textTransform: 'none', fontSize: '0.75rem' , padding:'10px', mt:2}}>
                                                  Show Diff. in Trial Balance
                                                </Button></Box>

               
              </Box>

              {/* SELECTOR SECTION */}
              <Box display="grid" gridTemplateColumns="1fr 50px 1fr" gap={1} alignItems="center" mb={3}>
                <Box sx={listBoxStyle}>
                  {loading ? <CircularProgress size={20} /> : groups.map(g => (
                    <Typography key={g} onClick={() => moveSingleRight(g)} sx={{ cursor: "pointer", p: 0.5, fontSize: '0.75rem', "&:hover": { bgcolor: "#316ac5", color: "#fff" } }}>
                      {g}
                    </Typography>
                  ))}
                </Box>
                <Box display="flex" flexDirection="column" gap={0.5}>
                  <Button variant="outlined" sx={{ minWidth: 40 }} size="small" onClick={moveAllRight}>{">>"}</Button>
                  <Button variant="outlined" sx={{ minWidth: 40 }} size="small" onClick={moveAllLeft}>{"<<"}</Button>
                </Box>
                <Box sx={listBoxStyle}>
                  {selected.map(g => (
                    <Typography key={g} onClick={() => moveSingleLeft(g)} sx={{ cursor: "pointer", p: 0.5, fontSize: '0.75rem', "&:hover": { bgcolor: "#316ac5", color: "#fff" } }}>
                      {g}
                    </Typography>
                  ))}
                </Box>
              </Box>

              {/* ACTION BUTTONS */}
              <Box display="flex" justifyContent="space-between" alignItems="flex-end">
                <Button 
                  variant="contained" 
                  sx={{ bgcolor: "#3597f3", color: "#000",   textTransform: 'none',   fontSize: '0.8rem' }}
                  onClick={() => setShowAllocation(true)}
                >
                  Sub Account Allocation
                </Button>

                <Box display="flex"   gap={0.5}>
                  <Button variant="contained" size="small" sx={{ textTransform: 'none', minWidth: 100 }}
                  onClick={handlePrint}>
                    Print Report
                  </Button>
                  <Button 
                                    sx={{ bgcolor: "#fa1b1b", color: "#000", textTransform: 'none',   fontSize: '0.8rem' }}

                    onClick={() => navigate(-1)}>
                    Close
                  </Button>
                </Box>
              </Box>
            </>
          )}
        </Paper>
      </Box>


       <Box sx={{ position: "absolute", top: "-10000px", left: "-10000px" }}>
              <div ref={reportRef}>
                <CapitalAccountPrint state={{ startDate, endDate }} />
              </div>
            </Box>
    </Box>
  );
}

export default Capitalaccounts
;