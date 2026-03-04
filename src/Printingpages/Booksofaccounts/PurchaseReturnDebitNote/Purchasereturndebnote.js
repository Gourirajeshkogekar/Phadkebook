import React, { useState, useRef } from "react";
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Grid,
  CircularProgress
} from "@mui/material";

import PrintIcon from "@mui/icons-material/Print";
import CloseIcon from "@mui/icons-material/Close";

import dayjs from "dayjs";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

export default function PurchaseReturnDebitNoteRegister() {

  const reportRef = useRef();

  const [printing, setPrinting] = useState(false);

  /* ===============================
     FINANCIAL YEAR DEFAULT
  =============================== */

  const getFinancialYear = () => {

    const today = dayjs();
    const year = today.year();
    const month = today.month();

    if (month < 3) {
      return {
        start: `${year - 1}-04-01`,
        end: `${year}-03-31`
      };
    } else {
      return {
        start: `${year}-04-01`,
        end: `${year + 1}-03-31`
      };
    }

  };

  const fy = getFinancialYear();

  const [startDate, setStartDate] = useState(fy.start);
  const [endDate, setEndDate] = useState(fy.end);

  /* ===============================
     HANDLE PRINT (PDF)
  =============================== */

  const handlePrint = async () => {

    setPrinting(true);

    setTimeout(async () => {

      try {

        const element = reportRef.current;

        if (!element) return;

        const canvas = await html2canvas(element, {
          scale: 1,
          useCORS: true
        });

        const imgData = canvas.toDataURL("image/png");

        const pdf = new jsPDF("p", "mm", "a4");

        const imgWidth = 210;
        const imgHeight = (canvas.height * imgWidth) / canvas.width;

        pdf.addImage(imgData, "PNG", 0, 0, imgWidth, imgHeight);

        window.open(pdf.output("bloburl"), "_blank");

      }
      catch (error) {

        console.error("PDF Error:", error);

      }
      finally {

        setPrinting(false);

      }

    }, 500);

  };


  const handleClose = () => {

    window.history.back();

  };


  /* ===============================
     UI
  =============================== */

  return (

    <Box
      sx={{
        minHeight: "100vh",
        background: "linear-gradient(135deg,#eef2f7,#e3e8f0)",
        display: "flex",
        justifyContent: "center",
        pt: 4
      }}
    >

      <Box width={520}>

        <Typography
          variant="h5"
          fontWeight={600}
          textAlign="center"
          mb={2}
        >
          Purchase Return Debit Note Register
        </Typography>


        <Paper elevation={5} sx={{ p: 3, borderRadius: 2 }}>

          <Typography fontWeight={600} mb={2}>
            Period
          </Typography>

          <Grid container spacing={2}>

            <Grid item xs={6}>
              <TextField
                label="Start Date"
                type="date"
                fullWidth
                size="small"
                value={startDate}
                onChange={(e)=>setStartDate(e.target.value)}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>

            <Grid item xs={6}>
              <TextField
                label="End Date"
                type="date"
                fullWidth
                size="small"
                value={endDate}
                onChange={(e)=>setEndDate(e.target.value)}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>

          </Grid>

        </Paper>


        <Box display="flex" justifyContent="center" gap={3} mt={3}>

          <Button
            variant="contained"
            startIcon={
              printing ?
              <CircularProgress size={18} color="inherit"/> :
              <PrintIcon/>
            }
            onClick={handlePrint}
            disabled={printing}
          >
            {printing ? "Generating PDF..." : "Print Report"}
          </Button>


          <Button
            variant="contained"
            color="error"
            startIcon={<CloseIcon/>}
            onClick={handleClose}
          >
            Close
          </Button>

        </Box>

      </Box>


      {/* ===============================
         HIDDEN REPORT FOR PDF
      =============================== */}

      <Box
        ref={reportRef}
        sx={{
          position: "absolute",
          left: "-9999px",
          width: "210mm",
          padding: "10mm",
          fontFamily: "Times New Roman",
          fontSize: "11px"
        }}
      >

        <div style={{ textAlign:"center", fontWeight:"bold", fontSize:"14px" }}>
          Phadke Prakashan, Kolhapur
        </div>

        <div style={{ textAlign:"center", fontSize:"12px" }}>
          PURCHASE RETURN DEBIT NOTE REGISTER
        </div>

        <div style={{ textAlign:"center", fontSize:"11px", marginBottom:"10px" }}>
          From {startDate} to {endDate}
        </div>


        <table width="100%" style={{ borderCollapse:"collapse" }}>

          <thead>
            <tr>
              <th style={th}>Entry No</th>
              <th style={th}>Account Name</th>
              <th style={th}>Particulars</th>
              <th style={thRight}>Debit</th>
              <th style={thRight}>Credit</th>
            </tr>
          </thead>

          <tbody>
            <tr>
              <td colSpan="5" style={{ textAlign:"center", padding:"10px" }}>
                Backend data will render here
              </td>
            </tr>
          </tbody>

        </table>

      </Box>

    </Box>

  );

}


const th = {
  border:"1px solid black",
  padding:"4px",
  textAlign:"left"
};

const thRight = {
  border:"1px solid black",
  padding:"4px",
  textAlign:"right"
};