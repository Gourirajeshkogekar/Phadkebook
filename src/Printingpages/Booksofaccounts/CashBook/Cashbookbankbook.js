import React, { useState,useRef } from "react";
import {
  Box,
  Paper,
  Typography,
  Checkbox,
  FormControlLabel,
  Button,
  Stack,
  Grid
} from "@mui/material";
import PrintIcon from "@mui/icons-material/Print";
import CloseIcon from "@mui/icons-material/Close";
import { useNavigate } from "react-router-dom";

import { LocalizationProvider, DatePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import CashBookPrint from "./CashBookPrint";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

export default function BankBookCashBook() {

  const navigate = useNavigate();

  /* ===============================
     Financial Year Default
  =============================== */

  const today = dayjs();
  const currentYear = today.year();
  const currentMonth = today.month();

  let fyStart, fyEnd;

  if (currentMonth < 3) {
    fyStart = dayjs(`${currentYear - 1}-04-01`);
    fyEnd = dayjs(`${currentYear}-03-31`);
  } else {
    fyStart = dayjs(`${currentYear}-04-01`);
    fyEnd = dayjs(`${currentYear + 1}-03-31`);
  }

  const [startDate, setStartDate] = useState(fyStart);
  const [endDate, setEndDate] = useState(fyEnd);
  const [printDaily, setPrintDaily] = useState(false);

  /* ===============================
     OPEN PRINT PAGE IN NEW TAB
  =============================== */
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
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Box sx={{ minHeight: "100vh", bgcolor: "#f4f6f9", p: 4 }}>

        <Box maxWidth={600} mx="auto">

          <Typography variant="h5" fontWeight={700} textAlign="center" mb={3}>
            Cash / Bank Book
          </Typography>

          <Paper sx={{ p: 3, mb: 3 }}>
            <Typography fontWeight={600} mb={2}>Period</Typography>

            <Grid container spacing={2}>
              <Grid item xs={6}>
                <DatePicker
                  label="Start Date"
                  value={startDate}
                  onChange={setStartDate}
                  slotProps={{ textField: { size: "small", fullWidth: true } }}
                />
              </Grid>

              <Grid item xs={6}>
                <DatePicker
                  label="End Date"
                  value={endDate}
                  onChange={setEndDate}
                  slotProps={{ textField: { size: "small", fullWidth: true } }}
                />
              </Grid>
            </Grid>
          </Paper>

          <Paper sx={{ p: 3, mb: 3 }}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={printDaily}
                  onChange={(e) => setPrintDaily(e.target.checked)}
                />
              }
              label="Print Daily Totals"
            />
          </Paper>

          <Stack direction="row" spacing={2} justifyContent="center">
            <Button
              variant="contained"
              startIcon={<PrintIcon />}
              onClick={handlePrint}
            >
              Print Report
            </Button>

            <Button
              variant="contained"
              color="error"
              startIcon={<CloseIcon />}
              onClick={() => navigate(-1)}
            >
              Close
            </Button>
          </Stack>

        </Box>

         <Box sx={{ position: "absolute", top: "-10000px", left: "-10000px" }}>
                <div ref={reportRef}>
                  <CashBookPrint state={{ startDate, endDate }} />
                </div>
              </Box>

      </Box>
    </LocalizationProvider>
  );
}