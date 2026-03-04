import React, { useState, useRef } from "react";
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  IconButton,
  Grid,
  CircularProgress
} from "@mui/material";

import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import PrintIcon from "@mui/icons-material/Print";
import CloseIcon from "@mui/icons-material/Close";

import dayjs from "dayjs";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

export default function ReceiptRegister() {

  const reportRef = useRef();

  const [printing, setPrinting] = useState(false);

 

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
     PRINT FUNCTION (FIXED)
  =============================== */

  const handlePrint = async () => {

    setPrinting(true);

    setTimeout(async () => {

      try {

        const element = reportRef.current;
        if (!element) return;

        const canvas = await html2canvas(element, {
          scale: 2,
          useCORS: true
        });

        const imgData = canvas.toDataURL("image/png");

        const pdf = new jsPDF("p", "mm", "a4");

        const pageWidth = pdf.internal.pageSize.getWidth();
        const pageHeight = pdf.internal.pageSize.getHeight();

        const imgWidth = canvas.width;
        const imgHeight = canvas.height;

        const ratio = Math.min(
          pageWidth / imgWidth,
          pageHeight / imgHeight
        );

        const finalWidth = imgWidth * ratio;
        const finalHeight = imgHeight * ratio;

        const marginX = (pageWidth - finalWidth) / 2;
        const marginY = 10;

        pdf.addImage(
          imgData,
          "PNG",
          marginX,
          marginY,
          finalWidth,
          finalHeight
        );

        window.open(pdf.output("bloburl"), "_blank");

      }
      catch (error) {

        console.error(error);

      }
      finally {

        setPrinting(false);

      }

    }, 300);

  };

  const handleClose = () => window.history.back();

 

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
          Receipt Register
        </Typography>


        <Paper elevation={5} sx={{ p: 2.5 }}>

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
                InputProps={{
                  endAdornment: (
                    <IconButton size="small">
                      <CalendarMonthIcon/>
                    </IconButton>
                  )
                }}
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
                InputProps={{
                  endAdornment: (
                    <IconButton size="small">
                      <CalendarMonthIcon/>
                    </IconButton>
                  )
                }}
              />

            </Grid>

          </Grid>

        </Paper>


        <Box display="flex" justifyContent="center" gap={2.5} mt={3}>

          <Button
            variant="contained"
            startIcon={
              printing
              ? <CircularProgress size={18} color="inherit"/>
              : <PrintIcon/>
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
         HIDDEN REPORT (PDF CONTENT)
      =============================== */}

      <Box
        ref={reportRef}
        sx={{
          position: "absolute",
          left: "-9999px",
          width: "190mm",
          background: "#fff",
          padding: "6mm",
          fontFamily: "Times New Roman",
          fontSize: "11px"
        }}
      >

        <div style={{
          textAlign: "center",
          fontWeight: "bold",
          fontSize: "14px"
        }}>
          Phadke Prakashan, Kolhapur
        </div>

        <div style={{
          textAlign: "center",
          fontSize: "12px",
          marginBottom: "6px"
        }}>
          Receipt Register
        </div>

        <div style={{
          textAlign: "center",
          fontSize: "11px",
          marginBottom: "10px"
        }}>
          From {startDate} to {endDate}
        </div>


        <table width="100%" style={{
          borderCollapse: "collapse",
          fontSize: "11px"
        }}>

          <thead>

            <tr>

              <th style={th}>Rcpt No</th>
              <th style={th}>Account Name</th>
              <th style={th}>Particulars</th>
              <th style={thRight}>Cash</th>
              <th style={thRight}>Chq</th>
              <th style={thRight}>DD</th>

            </tr>

          </thead>

          <tbody>

            <tr>

              <td colSpan="6" style={{
                textAlign: "center",
                padding: "15px"
              }}>
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
  border: "1px solid black",
  padding: "4px",
  textAlign: "left"
};

const thRight = {
  border: "1px solid black",
  padding: "4px",
  textAlign: "right"
};