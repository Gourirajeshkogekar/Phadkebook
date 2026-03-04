import React, { useState, useEffect, useRef } from "react";
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Checkbox,
  FormControlLabel,
  Radio,
  RadioGroup,
  Grid,
  CircularProgress,
  Autocomplete
} from "@mui/material";

import PrintIcon from "@mui/icons-material/Print";
import CloseIcon from "@mui/icons-material/Close";
import { useNavigate } from "react-router-dom";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

// Import your print component
import SalesregsummaryPrint from "./SalesregSummaryPrint";

export default function SalesRegSummary() {
  const navigate = useNavigate();
  const reportRef = useRef(null);
const [reportRows, setReportRows] = useState([]);
  // --- States ---
  const [startDate, setStartDate] = useState("2026-04-01");
  const [endDate, setEndDate] = useState("2026-03-31");
  const [excelOutput, setExcelOutput] = useState(false);
  const [showSummary, setShowSummary] = useState("no");
  const [salesToCanvassors, setSalesToCanvassors] = useState(false);
  const [accountGroup, setAccountGroup] = useState("");
  
  // --- API & Printing States ---
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [printing, setPrinting] = useState(false);

  // --- Fetch Account Groups ---
  useEffect(() => {
    fetch("https://publication.microtechsolutions.net.in/php/AccountGroupget.php")
      .then((res) => res.json())
      .then((data) => {
        setGroups(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Fetch error:", err);
        setLoading(false);
      });
  }, []);

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

  const handleClose = () => navigate(-1);

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: "linear-gradient(135deg,#eef2f7,#e3e8f0)",
        display: "flex",
        justifyContent: "center",
        pt: 2
      }}
    >
      <Box width={560}>
        <Typography variant="h5" fontWeight={600} textAlign="center" mb={1}>
          Sales Register Summary
        </Typography>

        <Paper sx={{ p: 2, borderRadius: 1, mb: 1 }}>
          <Typography fontWeight={600} fontSize={15} mb={2}>Period</Typography>
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <TextField
                label="Start Date" type="date" size="small" fullWidth
                InputLabelProps={{ shrink: true }}
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                label="End Date" type="date" size="small" fullWidth
                InputLabelProps={{ shrink: true }}
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
              />
            </Grid>
          </Grid>
          <FormControlLabel
            sx={{ mt: 1 }}
            control={<Checkbox size="small" checked={excelOutput} onChange={(e) => setExcelOutput(e.target.checked)} />}
            label="Excel output"
          />
        </Paper>

        <Paper sx={{ p: 2, borderRadius: 1, mb: 2 }}>
          <Typography fontWeight={600} fontSize={15}>Show Summary ?</Typography>
          <RadioGroup row value={showSummary} onChange={(e) => setShowSummary(e.target.value)}>
            <FormControlLabel value="yes" control={<Radio size="small" />} label="Yes" />
            <FormControlLabel value="no" control={<Radio size="small" />} label="No" />
          </RadioGroup>
          <FormControlLabel
            control={<Checkbox size="small" checked={salesToCanvassors} onChange={(e) => setSalesToCanvassors(e.target.checked)} />}
            label="Sales To Canvassors"
          />
        </Paper>

        <Paper sx={{ p: 2, borderRadius: 1, mb: 3 }}>
          <Typography fontWeight={600} fontSize={15} mb={1}>Account Group</Typography>
          <Autocomplete
            size="small"
            fullWidth
            options={groups}
            loading={loading}
            getOptionLabel={(option) => option.GroupName || ""}
            value={groups.find((g) => g.GroupName === accountGroup) || null}
            onChange={(e, newValue) => setAccountGroup(newValue ? newValue.GroupName : "")}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Select Account Group"
                InputProps={{
                  ...params.InputProps,
                  endAdornment: (
                    <>
                      {loading ? <CircularProgress color="inherit" size={20} /> : null}
                      {params.InputProps.endAdornment}
                    </>
                  ),
                }}
              />
            )}
          />
        </Paper>

        <Box display="flex" justifyContent="center" gap={2.5}>
          <Button
            variant="contained"
            disabled={printing}
            startIcon={printing ? <CircularProgress size={20} /> : <PrintIcon />}
            onClick={handlePrint}
            sx={{ px: 3.5, py: 1, fontWeight: 600, borderRadius: 2, minWidth: 170 }}
          >
            {printing ? "Generating..." : "Print Report"}
          </Button>

          <Button
            variant="contained"
            color="error"
            startIcon={<CloseIcon />}
            onClick={handleClose}
            sx={{ px: 3.5, py: 1, fontWeight: 600, borderRadius: 2, minWidth: 120 }}
          >
            Close
          </Button>
        </Box>
      </Box>

      {/* HIDDEN PRINT AREA */}
      <Box sx={{ position: "absolute", top: "-10000px", left: "-10000px",  }}>
        <div ref={reportRef} style={{ width: "210mm" }}>
          <SalesregsummaryPrint 
            state={{ startDate, endDate, accountGroup, showSummary, salesToCanvassors }} 
          />
        </div>
      </Box>
    </Box>
  );
}