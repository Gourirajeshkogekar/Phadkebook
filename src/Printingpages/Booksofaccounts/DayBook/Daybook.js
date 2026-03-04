import React, { useState, useRef } from "react";
import {
  Box, Paper, Typography, TextField,
  Checkbox, FormControlLabel, Button,
  Radio, RadioGroup, Stack, Grid
} from "@mui/material";
import PrintIcon from "@mui/icons-material/Print";
import CloseIcon from "@mui/icons-material/Close";
import dayjs from "dayjs";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import DaybookPrint from "./DaybookPrint"


export default function DayBook() {
  const today = dayjs();
  const year = today.year();
  const month = today.month();

  let fyStart, fyEnd;

  if (month < 3) {
    fyStart = dayjs(`${year - 1}-04-01`);
    fyEnd = dayjs(`${year}-03-31`);
  } else {
    fyStart = dayjs(`${year}-04-01`);
    fyEnd = dayjs(`${year + 1}-03-31`);
  }

  const [startDate, setStartDate] = useState(fyStart.format("YYYY-MM-DD"));
  const [endDate, setEndDate] = useState(fyEnd.format("YYYY-MM-DD"));
  const [mode, setMode] = useState("selected");

  const [options, setOptions] = useState([
    { id: 1, label: "Credit Note", checked: false },
    { id: 2, label: "Debit Note", checked: false },
    { id: 3, label: "JV", checked: false },
    { id: 4, label: "Payments", checked: false },
    { id: 5, label: "Purchase", checked: false },
    { id: 6, label: "Purchase Return - Debit Note", checked: false },
    { id: 7, label: "Receipts", checked: false },
    { id: 8, label: "Sales Invoice", checked: false }
  ]);

  const toggleOption = (id) => {
    setOptions(prev =>
      prev.map(o =>
        o.id === id ? { ...o, checked: !o.checked } : o
      )
    );
  };

  const handleModeChange = (val) => {
    setMode(val);
    setOptions(prev =>
      prev.map(o => ({ ...o, checked: val === "all" }))
    );
  };

 

    const reportRef = useRef(null);
   const [printing, setPrinting] = useState(false);
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
    <Box sx={{
      minHeight: "100vh",
      background: "#eef2f6",
      display: "flex",
      justifyContent: "center",
      pt: 6
    }}>
      <Box width={540}>

        <Typography
          variant="h5"
          fontWeight={600}
          textAlign="center"
          mb={3}
        >
          Day Book
        </Typography>

        {/* PERIOD */}
        <Paper sx={{ p: 2.5, borderRadius: 3, mb: 3 }}>
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <TextField
                label="Start Date"
                type="date"
                size="small"
                fullWidth
                InputLabelProps={{ shrink: true }}
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
            </Grid>

            <Grid item xs={6}>
              <TextField
                label="End Date"
                type="date"
                size="small"
                fullWidth
                InputLabelProps={{ shrink: true }}
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
              />
            </Grid>
          </Grid>
        </Paper>

        {/* TRANSACTIONS */}
        <Paper sx={{ p: 2.5, borderRadius: 3, mb: 3 }}>
          <Typography fontWeight={600} mb={1}>
            Transactions
          </Typography>

          <RadioGroup
            row
            value={mode}
            onChange={(e) => handleModeChange(e.target.value)}
          >
            <FormControlLabel
              value="all"
              control={<Radio size="small" />}
              label="Select All"
            />
            <FormControlLabel
              value="selected"
              control={<Radio size="small" />}
              label="Selected"
            />
          </RadioGroup>

          <Box sx={{
            border: "1px solid #ccc",
            borderRadius: 2,
            p: 1,
            maxHeight: 150,
            overflow: "auto",
            mt: 1
          }}>
            {options.map(opt => (
              <FormControlLabel
                key={opt.id}
                control={
                  <Checkbox
                    size="small"
                    checked={opt.checked}
                    onChange={() => toggleOption(opt.id)}
                  />
                }
                label={opt.label}
              />
            ))}
          </Box>
        </Paper>

        {/* BUTTONS */}
        <Stack direction="row" spacing={2} justifyContent="center">
          <Button
            variant="contained"
            startIcon={<PrintIcon />}
            onClick={handlePrint}
          >
            Print
          </Button>

          <Button
            variant="contained"
            color="error"
            startIcon={<CloseIcon />}
            onClick={() => window.history.back()}
          >
            Close
          </Button>
        </Stack>

      </Box>

       <Box sx={{ position: "absolute", top: "-10000px", left: "-10000px" }}>
                <div ref={reportRef}>
                  <DaybookPrint state={{ startDate, endDate }} />
                </div>
              </Box>
    </Box>
  );
}