import React, { useEffect, useState,useRef } from "react";
import {
  Box, Paper, Typography, TextField, Button,
  Checkbox, FormControlLabel, Radio,
  RadioGroup, CircularProgress, Grid, Autocomplete
} from "@mui/material";

import { useNavigate } from "react-router-dom";
import PrintIcon from "@mui/icons-material/Print";
import CloseIcon from "@mui/icons-material/Close";
import TransactionsummaryPrint from './TransactionsummaryPrint';
import html2canvas from "html2canvas";
import jsPDF from "jspdf";


const TRANSACTION_OPTIONS = [
  "Debit Note", "Credit Note", "Bank Reconcilation", "Sales Challan", 
  "Sales Invoice", "Sales Return-Credit Note", "Purchase Return-Debit Note", 
  "Book Purchase", "Paper Purchase", "Inward Challan", "Canvassor Details", 
  "Paper Outward for Book Printing", "Paper Received from Binder", "MissPrint", 
  "Sales For Canvassor", "Book Printing order to Press", "Raddi Sales"
];

export default function TransactionSummury() {
  const navigate = useNavigate();
  const [startDate, setStartDate] = useState("2025-04-01");
  const [endDate, setEndDate] = useState("2026-03-31");
  const [mode, setMode] = useState("selected");
  const [checked, setChecked] = useState(
    TRANSACTION_OPTIONS.reduce((acc, curr) => ({ ...acc, [curr]: true }), {})
  );
  const [accountGroups, setAccountGroups] = useState([]);
  const [selectedAccountGroup, setSelectedAccountGroup] = useState(null);
  const [loading, setLoading] = useState(true);



 const reportRef = useRef(null);
  const [printing, setPrinting] = useState(false);
  const handlePrint = async () => {
    if (!reportRef.current) return;
    setPrinting(true);

    try {
 
      // Small delay to allow the hidden component to render the dynamic data
      await new Promise((resolve) => setTimeout(resolve, 500));

      const element = reportRef.current;
      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        logging: false,
      });

      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");
      
      // A4 dimensions: 210mm x 297mm
      pdf.addImage(imgData, "PNG", 0, 0, 210, 297);
      window.open(pdf.output("bloburl"), "_blank");
    } catch (error) {
      console.error("PDF Generation Error:", error);
    } finally {
      setPrinting(false);
    }
  };

  useEffect(() => {
    async function loadData() {
      try {
        const response = await fetch("https://publication.microtechsolutions.net.in/php/AccountGroupget.php");
        const data = await response.json();
        setAccountGroups(data);
      } catch (e) {
        console.error("Error fetching account groups:", e);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const handleCheck = (title) => {
    setChecked(prev => ({ ...prev, [title]: !prev[title] }));
  };

  if (loading) {
    return <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}><CircularProgress /></Box>;
  }

  return (
    <Box sx={{ 
      height: "calc(100vh - 70px)", // Adjusts for a standard header height
      display: "flex", 
      justifyContent: "center", 
      alignItems: "center", 
      bgcolor: "#f4f7f9",
      p: 1 
    }}>
      <Box width={750}> {/* Slightly wider to accommodate 3 columns comfortably */}
        <Typography variant="h6" fontWeight={700} textAlign="center" mb={1} color="#333">
          Transaction Summary
        </Typography>

        <Paper sx={{ p: 1, borderRadius: 2, border: "1px solid #ced4da", boxShadow: "none" }}>
          
          {/* PERIOD SECTION */}
          <Box mb={1.5}>
            <Typography variant="caption" fontWeight={700} color="primary" sx={{ display: 'block', mb: 0.5, textTransform: 'uppercase' }}>Period</Typography>
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <TextField label="Start Date" type="date" size="small" fullWidth InputLabelProps={{ shrink: true }} value={startDate} onChange={(e) => setStartDate(e.target.value)} />
              </Grid>
              <Grid item xs={6}>
                <TextField label="End Date" type="date" size="small" fullWidth InputLabelProps={{ shrink: true }} value={endDate} onChange={(e) => setEndDate(e.target.value)} />
              </Grid>
            </Grid>
          </Box>

          {/* TRANSACTION SECTION */}
          <Box mb={1.5}>
            <Box display="flex" alignItems="center" justifyContent="space-between" sx={{ mb: 0.5 }}>
              <Typography variant="caption" fontWeight={700} color="primary" sx={{ textTransform: 'uppercase' }}>Transaction</Typography>
              <RadioGroup row value={mode} onChange={(e) => setMode(e.target.value)}>
                <FormControlLabel value="all" control={<Radio size="small" sx={{ p: 0.5 }} />} label={<Typography variant="caption">Select All</Typography>} />
                <FormControlLabel value="selected" control={<Radio size="small" sx={{ p: 0.5 }} />} label={<Typography variant="caption">Selected</Typography>} />
              </RadioGroup>
            </Box>

            <Box sx={{ 
              border: "1px solid #ddd", 
              borderRadius: 1, 
              p: 1, 
              bgcolor: mode === 'all' ? '#f5f5f5' : '#fff',
              maxHeight: "35vh", // Scales with screen height
              overflowY: "auto"
            }}>
              <Grid container spacing={0}>
                {TRANSACTION_OPTIONS.map(title => (
                  <Grid item xs={4} key={title}> {/* 3 Columns for better vertical fit */}
                    <FormControlLabel
                      sx={{ margin: 0 }}
                      control={
                        <Checkbox
                          size="small"
                          sx={{ p: 0.5 }}
                          disabled={mode === "all"}
                          checked={mode === "all" ? true : !!checked[title]}
                          onChange={() => handleCheck(title)}
                        />
                      }
                      label={<Typography sx={{ fontSize: "0.75rem", whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{title}</Typography>}
                    />
                  </Grid>
                ))}
              </Grid>
            </Box>
          </Box>

          {/* ACCOUNT GROUP */}
          <Box mb={2}>
            <Typography variant="caption" fontWeight={700} color="primary" sx={{ display: 'block', mb: 0.5, textTransform: 'uppercase' }}>Account Group</Typography>
            <Autocomplete
              options={accountGroups}
              getOptionLabel={(option) => option.GroupName || ""}
              value={selectedAccountGroup}
              onChange={(e, val) => setSelectedAccountGroup(val)}
              renderInput={(params) => (
                <TextField {...params} placeholder="Search Group..." size="small" fullWidth />
              )}
            />
          </Box>

          {/* BUTTONS */}
          <Box display="flex" justifyContent="center" gap={2}>
            <Button 
              variant="contained" 
              startIcon={<PrintIcon />} 
              size="medium"
              onClick={handlePrint}
              sx={{ bgcolor: "#2e7d32", "&:hover": { bgcolor: "#1b5e20" }, px: 5 }}
            >
              Print
            </Button>
            <Button 
              variant="outlined" 
              color="error" 
              size="medium"
              startIcon={<CloseIcon />} 
              onClick={() => navigate(-1)}
              sx={{ px: 5 }}
            >
              Close
            </Button>
          </Box>
        </Paper>
      </Box>

        <Box sx={{ position: "absolute", top: "-10000px", left: "-10000px",  }}>
                    <div ref={reportRef} style={{ width: "210mm" }}>
                      <TransactionsummaryPrint 
                        state={{ startDate, endDate, }} 
                      />
                    </div>
                  </Box>
    </Box>
  );
}