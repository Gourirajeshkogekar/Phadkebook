import React, { useState, useEffect, useRef } from "react";
import {
  Box,
  Paper,
  Typography,
  TextField,
  Radio,
  RadioGroup,
  FormControlLabel,
  Button,
  Grid,
  Autocomplete,
  CircularProgress
} from "@mui/material";
import axios from "axios";
import PrintIcon from "@mui/icons-material/Print";
import CloseIcon from "@mui/icons-material/Close";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import ChallanRegisterPrint from "./ChallanregisterPrint";

export default function ChallanRegister() {
  const [startDate, setStartDate] = useState("2025-04-01");
  const [endDate, setEndDate] = useState("2026-03-31");
  const [showBooks, setShowBooks] = useState("No");
  
  // Single state for party list and loading
  const [parties, setParties] = useState([]); 
  const [party, setParty] = useState(null); 
  const [loadingParties, setLoadingParties] = useState(false);

  // Fetching accounts for the Party dropdown
  useEffect(() => {
    const fetchAccounts = async () => {
      setLoadingParties(true);
      try {
        const res = await axios.get(
          "https://publication.microtechsolutions.net.in/php/Accountget.php"
        );
        // The API returns an array of objects like { Id, AccountName, ... }
        setParties(Array.isArray(res.data) ? res.data : []);
      } catch (err) {
        console.error("Error fetching accounts:", err);
      } finally {
        setLoadingParties(false);
      }
    };
    fetchAccounts();
  }, []);

  const reportRef = useRef(null);
  const [printing, setPrinting] = useState(false);

  const handlePrint = async () => {
    setPrinting(true);
    setTimeout(async () => {
      try {
        const element = reportRef.current;
        if (!element) return;

        const canvas = await html2canvas(element, { 
          scale: 2, 
          useCORS: true,
          logging: false 
        });

        const imgData = canvas.toDataURL("image/png");
        const pdf = new jsPDF("p", "mm", "a4");
        pdf.addImage(imgData, "PNG", 0, 0, 210, 297);
        window.open(pdf.output("bloburl"), "_blank");
      } catch (error) {
        console.error("PDF Error:", error);
      } finally {
        setPrinting(false);
      }
    }, 500);
  };

  return (
    <Box sx={{ 
      display: "flex", 
      justifyContent: "center", 
      alignItems: "center", 
      minHeight: "90vh", 
      bgcolor: "#f5f5f5" ,   
    }}>
      <Paper elevation={3} sx={{  width: "100%", maxWidth: 800, bgcolor: "#fff",   }}>
        <Typography variant="h5" fontWeight={600} textAlign="center" mb={1}>
          Challan Register
        </Typography>

        <Grid container spacing={3}>
          {/* Period Selection */}
          <Grid item xs={12}>
            <Box component="fieldset" sx={{ border: "1px solid #ccc", p: 2, borderRadius: 1 }}>
              <legend style={{ fontSize: "14px", fontWeight: "bold", padding: "0 5px" }}>Period</legend>
              <Grid container spacing={2} alignItems="center">
                <Grid item xs={4}><Typography variant="body2">Start Date</Typography></Grid>
                <Grid item xs={8}>
                  <TextField type="date" size="small" fullWidth value={startDate} onChange={(e) => setStartDate(e.target.value)} />
                </Grid>
                <Grid item xs={4}><Typography variant="body2">End Date</Typography></Grid>
                <Grid item xs={8}>
                  <TextField type="date" size="small" fullWidth value={endDate} onChange={(e) => setEndDate(e.target.value)} />
                </Grid>
              </Grid>
            </Box>
          </Grid>

          {/* Show Books Toggle */}
          <Grid item xs={12}>
            <Box component="fieldset" sx={{ border: "1px solid #ccc", p: 2, borderRadius: 1 }}>
              <legend style={{ fontSize: "14px", fontWeight: "bold", padding: "0 5px" }}>Show Books ?</legend>
              <RadioGroup row value={showBooks} onChange={(e) => setShowBooks(e.target.value)}>
                <FormControlLabel value="Yes" control={<Radio size="small" />} label="Yes" />
                <FormControlLabel value="No" control={<Radio size="small" />} label="No" />
              </RadioGroup>
            </Box>
          </Grid>

          {/* Party Selection - Now connected to the API state */}
          <Grid item xs={12}>
            <Box component="fieldset" sx={{ border: "1px solid #ccc", p: 1, borderRadius: 1 }}>
              <legend style={{ fontSize: "14px", fontWeight: "bold", padding: "0 5px" }}>Party</legend>
              <Autocomplete
                size="small"
                options={parties}
                loading={loadingParties}
                getOptionLabel={(option) => option.AccountName || ""}
                value={party}
                onChange={(event, newValue) => setParty(newValue)}
                isOptionEqualToValue={(option, value) => option.Id === value.Id}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    placeholder="Search Party"
                    InputProps={{
                      ...params.InputProps,
                      endAdornment: (
                        <React.Fragment>
                          {loadingParties ? <CircularProgress color="inherit" size={20} /> : null}
                          {params.InputProps.endAdornment}
                        </React.Fragment>
                      ),
                    }}
                  />
                )}
              />
            </Box>
          </Grid>

          {/* Action Buttons */}
          <Grid item xs={12} sx={{ display: "flex", justifyContent: "center", gap: 2, mt: 1 }}>
            <Button variant="contained" startIcon={<PrintIcon />} onClick={handlePrint} disabled={printing}>
              {printing ? "Generating..." : "Print"}
            </Button>
            <Button variant="contained" color="error" startIcon={<CloseIcon />} onClick={() => window.history.back()}>
              Close
            </Button>
          </Grid>
        </Grid>
      </Paper>

      {/* Hidden Print Section */}
      <Box sx={{ position: "absolute", top: "-10000px", left: "-10000px" }}>
        <div ref={reportRef}>
          <ChallanRegisterPrint state={{ 
            startDate, 
            endDate, 
            partyName: party?.AccountName || "All Parties" 
          }} />
        </div>
      </Box>
    </Box>
  );
}