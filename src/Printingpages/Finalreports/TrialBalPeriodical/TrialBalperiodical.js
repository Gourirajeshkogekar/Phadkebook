import React, { useEffect, useState,useRef } from "react";
import {
  Box, Paper, Typography, TextField, Button,
  Checkbox, FormControlLabel, IconButton, CircularProgress
} from "@mui/material";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import { useNavigate } from "react-router-dom";
import SubAccountAllocation from "../SubAccountAllocation";
import Trialbalperiodicprint from "./TrialbalperiodicalPrint";

import jsPDF from "jspdf";
import html2canvas from "html2canvas";


function TrialBalPeriodical() {
  const navigate = useNavigate();
 const reportRef = useRef(null); // Reference to the hidden report

  const [startDate, setStartDate] = useState("2025-04-01");
  const [endDate, setEndDate] = useState("2026-03-31");
    const [showAllocation, setShowAllocation] = useState(false);
  
  // State for Account Groups
  const [groups, setGroups] = useState([]);
  const [selected, setSelected] = useState([]);
  const [loading, setLoading] = useState(true);

  // Checkbox States
  const [printSumm, setPrintSumm] = useState(false);
  const [opBalancesOnly, setOpBalancesOnly] = useState(false);
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
    height: 240, // Optimized to prevent cutting
    overflowY: "auto",
    bgcolor: "#fff",
    fontSize: "0.75rem",
    fontFamily: "monospace"
  };

  /* ===== Fetch real backend groups ===== */
  useEffect(() => {
    setLoading(true);
    fetch("https://publication.microtechsolutions.net.in/php/AccountGroupget.php")
      .then((r) => r.json())
      .then((data) => {
        // Mapping GroupName from the API objects
        const groupNames = data.map((item) => item.GroupName);
        setGroups(groupNames);
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
    <Box sx={{ minHeight: "auto", background: "#f0f0f0", p: { xs: 1, md: 2 } }}>
      <Box sx={{ width: "100%", maxWidth: 900, mx: "auto" }}>
        
        {/* PAGE HEADING */}
        <Typography variant="h6" fontWeight={700} textAlign="center" mb={1} sx={{ color: "#333" }}>
          Trial Balance - Periodical
        </Typography>

        <Paper variant="outlined" sx={{ p: 2, bgcolor: "#f9f9f9" }}>
           {/* --- VIEW SWITCHER --- */}
                    {showAllocation ? (
                      // VIEW 1: The Allocation Table
                      <SubAccountAllocation onClose={() => setShowAllocation(false)} />
                    ) : (
                      // VIEW 2: The Main Form
                      <>
          {/* TOP SECTION: PERIOD & OPTIONS */}
          <Box display="grid" gridTemplateColumns="1.2fr 1fr" gap={2} mb={2}>
            
            {/* Period Box */}
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

            {/* Checkbox and Diff Button Box */}
            <Box display="flex" flexDirection="column" justifyContent="space-between">
              <Box display="flex" flexDirection="column">
                <FormControlLabel
                  sx={{ mb: -0.5 }}
                  control={<Checkbox size="small" checked={opBalancesOnly} onChange={e => setOpBalancesOnly(e.target.checked)} />}
                  label={<Typography variant="caption">Print Accounts having Op. balances only?</Typography>}
                />
                <FormControlLabel
                  control={<Checkbox size="small" checked={printSumm} onChange={e => setPrintSumm(e.target.checked)} />}
                  label={<Typography variant="caption">Print Summarised Trial Bal.?</Typography>}
                />
              </Box>
              <Button variant="outlined" size="small" sx={{ alignSelf: "flex-start", textTransform: 'none', fontSize: '0.75rem' }}>
                Show Diff. in Trial Balance
              </Button>
            </Box>
          </Box>

          {/* MIDDLE SECTION: GROUP SELECTOR */}
          <Box display="grid" gridTemplateColumns="1fr 50px 1fr" gap={1} alignItems="center">
            
            {/* Left Box (Available) */}
            <Box sx={listBoxStyle}>
              {loading ? (
                <Box display="flex" justifyContent="center" pt={2}><CircularProgress size={20} /></Box>
              ) : (
                groups.map(g => (
                  <Typography key={g} onClick={() => moveSingleRight(g)} 
                    sx={{ cursor: "pointer", p: 0.5, fontSize: '0.75rem', "&:hover": { bgcolor: "#316ac5", color: "#fff" } }}>
                    {g}
                  </Typography>
                ))
              )}
            </Box>

            {/* Middle Controls */}
            <Box display="flex" flexDirection="column" gap={0.5}>
              <Button variant="outlined" sx={{ minWidth: 40, p: 0.5 }} size="small" onClick={() => moveAllRight()}> {">>" } </Button>
              <Button variant="outlined" sx={{ minWidth: 40, p: 0.5 }} size="small" onClick={moveAllLeft}> {"<<"} </Button>
            </Box>

            {/* Right Box (Selected) */}
            <Box sx={listBoxStyle}>
              {selected.map(g => (
                <Typography key={g} onClick={() => moveSingleLeft(g)} 
                  sx={{ cursor: "pointer", p: 0.5, fontSize: '0.75rem', "&:hover": { bgcolor: "#316ac5", color: "#fff" } }}>
                  {g}
                </Typography>
              ))}
            </Box>
          </Box>

          {/* BOTTOM SECTION: ACTION BUTTONS */}
          <Box mt={2} display="flex" justifyContent="space-between" alignItems="flex-end">
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
                      <Trialbalperiodicprint state={{ startDate, endDate }} />
                    </div>
                  </Box>
    </Box>
  );
}

export default TrialBalPeriodical;