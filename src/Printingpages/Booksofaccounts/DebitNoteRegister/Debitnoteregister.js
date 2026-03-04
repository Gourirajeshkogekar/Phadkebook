import React, { useState, useRef } from "react";
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Grid,
  Stack
} from "@mui/material";
import PrintIcon from "@mui/icons-material/Print";
import CloseIcon from "@mui/icons-material/Close";
import dayjs from "dayjs";
import DebitNoteRegisterPrint from "./DebitnoteregisterPrint";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

export default function DebitNoteRegister() {

  

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
      }, 500);  
    };
  

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: "#eef2f6",
        display: "flex",
        justifyContent: "center",
        pt: 7
      }}
    >
      <Box width={480}>

        <Typography
          variant="h5"
          fontWeight={600}
          textAlign="center"
          mb={2.5}
        >
          Debit Note Register
        </Typography>

        <Paper sx={{ p: 2.5, borderRadius: 3, mb: 3 }}>
          <Typography fontWeight={600} mb={1.5}>
            Period
          </Typography>

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

        <Stack direction="row" spacing={2.5} justifyContent="center">
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
                        <DebitNoteRegisterPrint state={{ startDate, endDate }} />
                      </div>
                    </Box>
    </Box>
  );
}