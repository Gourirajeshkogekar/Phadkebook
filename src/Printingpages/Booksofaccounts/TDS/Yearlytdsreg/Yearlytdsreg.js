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

import DateRangeIcon from "@mui/icons-material/DateRange";
import PrintIcon from "@mui/icons-material/Print";
import CloseIcon from "@mui/icons-material/Close";

import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import dayjs from "dayjs";

export default function YearlyTDSRegister() {

  const reportRef = useRef();

  const [printing, setPrinting] = useState(false);

  /* =====================================
     FINANCIAL YEAR DEFAULT
  ===================================== */

  const getFinancialYear = () => {

    const today = dayjs();
    const year = today.year();
    const month = today.month();

    if (month < 3) {

      return {
        startDate: `${year - 1}-04-01`,
        endDate: `${year}-03-31`
      };

    } else {

      return {
        startDate: `${year}-04-01`,
        endDate: `${year + 1}-03-31`
      };

    }

  };

  const fy = getFinancialYear();

  const [startDate, setStartDate] = useState(fy.startDate);
  const [endDate, setEndDate] = useState(fy.endDate);


 

  const handlePrint = async () => {

    setPrinting(true);

    setTimeout(async () => {

      try {

        const element = reportRef.current;

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

        const newWidth = imgWidth * ratio;
        const newHeight = imgHeight * ratio;

        const x = (pageWidth - newWidth) / 2;
        const y = 10;

        pdf.addImage(
          imgData,
          "PNG",
          x,
          y,
          newWidth,
          newHeight
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


  const handleClose = () => {

    window.history.back();

  };


  return (

    <Box
      sx={{
        minHeight: "100vh",
        background: "#eef2f7",
        display: "flex",
        justifyContent: "center",
        pt: 5
      }}
    >

      <Box width={520}>

        {/* TITLE */}

        <Typography
          variant="h6"
          fontWeight={600}
          textAlign="center"
          mb={3}
        >
          Yearly TDS Register
        </Typography>


        {/* PERIOD */}

        <Paper sx={{ p: 3 }}>

          <Box display="flex" alignItems="center" gap={1} mb={2}>

            <DateRangeIcon color="primary"/>

            <Typography fontWeight={600}>
              Period
            </Typography>

          </Box>

          <Grid container spacing={2}>

            <Grid item xs={6}>

              <TextField
                label="Start Date"
                type="date"
                fullWidth
                size="small"
                InputLabelProps={{ shrink: true }}
                value={startDate}
                onChange={(e)=>setStartDate(e.target.value)}
              />

            </Grid>


            <Grid item xs={6}>

              <TextField
                label="End Date"
                type="date"
                fullWidth
                size="small"
                InputLabelProps={{ shrink: true }}
                value={endDate}
                onChange={(e)=>setEndDate(e.target.value)}
              />

            </Grid>

          </Grid>

        </Paper>


        {/* BUTTONS */}

        <Box textAlign="center" mt={3}>

          <Button
            variant="contained"
            startIcon={
              printing
              ? <CircularProgress size={18}/>
              : <PrintIcon/>
            }
            onClick={handlePrint}
          >
            {printing ? "Generating PDF..." : "Print Report"}
          </Button>


          <Button
            variant="contained"
            color="error"
            sx={{ ml: 2 }}
            startIcon={<CloseIcon/>}
            onClick={handleClose}
          >
            Close
          </Button>

        </Box>

      </Box>


      {/* =====================================
         HIDDEN REPORT (SMALL FONT)
      ===================================== */}

      <Box
        ref={reportRef}
        sx={{
          position: "absolute",
          left: "-9999px",
          width: "190mm",
          bgcolor: "#fff",
          p: 2,
          fontFamily: "Times New Roman",
          fontSize: "11px"
        }}
      >

        <Typography align="center" fontSize="14px" fontWeight="bold">
          Phadke Prakashan, Kolhapur
        </Typography>

        <Typography align="center" fontSize="12px">
          Yearly TDS Register
        </Typography>

        <Typography align="center" fontSize="11px" mb={1}>
          Period : {startDate} to {endDate}
        </Typography>


        <table width="100%" style={{ borderCollapse:"collapse" }}>

          <thead>

            <tr>

              <th style={th}>Sr</th>
              <th style={th}>PAN</th>
              <th style={th}>Account Name</th>
              <th style={th}>Address</th>
              <th style={th}>Type</th>

            </tr>

          </thead>

          <tbody>

            <tr>

              <td style={td}>1</td>
              <td style={td}>ABCDE1234F</td>
              <td style={td}>Sample Account</td>
              <td style={td}>Kolhapur</td>
              <td style={td}>Individual</td>

            </tr>

          </tbody>

        </table>

      </Box>

    </Box>

  );

}


/* TABLE STYLE */

const th = {
  border: "1px solid black",
  padding: "4px",
  fontSize: "11px"
};

const td = {
  border: "1px solid black",
  padding: "4px",
  fontSize: "11px"
};