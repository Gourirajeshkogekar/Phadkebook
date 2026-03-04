import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import {
  Box, Paper, Typography, TextField, RadioGroup, FormControlLabel,
  Radio, Button, Container, Grid, Autocomplete, Stack
} from "@mui/material";
import PrintIcon from "@mui/icons-material/Print";
import CloseIcon from "@mui/icons-material/Close";
import { useReactToPrint } from "react-to-print"; // Recommendation: use this for better print quality
import TDSPrintTemplate from "./TdsPrintTemplate"; // We will create this next
import html2canvas from "html2canvas";
import jsPDF from "jspdf";




export default function TDSRegister() {
  const reportRef = useRef();
  const [parties, setParties] = useState([]);
  const [selectedParty, setSelectedParty] = useState(null);
  const [summaryMode, setSummaryMode] = useState("no");
  
  const [dates, setDates] = useState({
    start: new Date(new Date().getFullYear(), 3, 1).toISOString().split('T')[0],
    end: new Date(new Date().getFullYear() + 1, 2, 31).toISOString().split('T')[0]
  });

  useEffect(() => {
    axios.get("https://publication.microtechsolutions.net.in/php/Accountget.php")
      .then(res => setParties(res.data || []));
  }, []);



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

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Typography variant="h5" fontWeight={700} mb={3} color="primary" textAlign="center">
        TDS Register 
      </Typography>

      <Paper elevation={3} sx={{ p: 4, borderRadius: 2 }}>
        <Grid container spacing={4}>
          {/* LEFT SIDE: PERIOD & SUMMARY */}
          <Grid item xs={12} md={6}>
            <Typography variant="subtitle2" fontWeight={700} gutterBottom>
              REPORT PERIOD
            </Typography>
            <Stack direction="row" spacing={2} sx={{ mt: 1, mb: 4 }}>
              <TextField
                label="From Date"
                type="date"
                size="small"
                fullWidth
                InputLabelProps={{ shrink: true }}
                value={dates.start}
                onChange={(e) => setDates({ ...dates, start: e.target.value })}
              />
              <TextField
                label="To Date"
                type="date"
                size="small"
                fullWidth
                InputLabelProps={{ shrink: true }}
                value={dates.end}
                onChange={(e) => setDates({ ...dates, end: e.target.value })}
              />
            </Stack>

            <Typography variant="subtitle2" fontWeight={700} gutterBottom>
              SUMMARY OPTIONS
            </Typography>
            <RadioGroup
              row
              value={summaryMode}
              onChange={(e) => setSummaryMode(e.target.value)}
            >
              <FormControlLabel value="yes" control={<Radio />} label="Show Summary" />
              <FormControlLabel value="no" control={<Radio />} label="Detailed View" />
            </RadioGroup>
          </Grid>

          {/* RIGHT SIDE: PARTY SELECTION & ACTIONS */}
          <Grid item xs={12} md={6}>
            <Typography variant="subtitle2" fontWeight={700} gutterBottom>
              SELECT PARTY (Searchable)
            </Typography>
            <Autocomplete
              options={parties}
              getOptionLabel={(option) => option.AccountName || ""}
              value={selectedParty}
              onChange={(event, newValue) => setSelectedParty(newValue)}
              renderInput={(params) => (
                <TextField {...params}   size="small" fullWidth />
              )}
              sx={{ mt: 1, mb: 4 }}
            />

            <Stack direction="row" spacing={2} sx={{ mt: 4 }}>
              <Button
                variant="contained"
                fullWidth
                startIcon={<PrintIcon />}
                onClick={handlePrint}
                sx={{ bgcolor: "#1a237e", height: 45 }}
              >
                GENERATE PRINT
              </Button>
              <Button
                variant="outlined"
                fullWidth
                color="error"
                startIcon={<CloseIcon />}
                sx={{ height: 45 }}
              >
                CLOSE
              </Button>
            </Stack>
          </Grid>
        </Grid>
      </Paper>

      {/* Hidden Print Section */}
      <Box sx={{ display: "none", displayPrint: "block" }}>
        <TDSPrintTemplate 
           ref={reportRef} 
           data={{ dates, selectedParty, summaryMode }} 
        />
      </Box>
    </Container>
  );
}