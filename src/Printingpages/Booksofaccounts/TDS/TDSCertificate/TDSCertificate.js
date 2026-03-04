import React, { useState, useEffect, useRef } from "react";

import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  MenuItem,
  RadioGroup,
  FormControlLabel,
  Radio,
  Grid,
  CircularProgress
} from "@mui/material";

import DateRangeIcon from "@mui/icons-material/DateRange";
import PrintIcon from "@mui/icons-material/Print";
import CloseIcon from "@mui/icons-material/Close";

import dayjs from "dayjs";

import html2canvas from "html2canvas";
import jsPDF from "jspdf";

export default function TDSCertificate() {

  /* ===============================
     REF + PRINT STATE
  =============================== */

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
    }
    else {
      return {
        start: `${year}-04-01`,
        end: `${year + 1}-03-31`
      };
    }
  };

  const fy = getFinancialYear();

  const [startDate, setStartDate] = useState(fy.start);
  const [endDate, setEndDate] = useState(fy.end);

  const [party, setParty] = useState("");
  const [showBooks, setShowBooks] = useState("no");

  /* ===============================
     PARTY API
  =============================== */

  const [partyList, setPartyList] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {

    fetch("https://publication.microtechsolutions.net.in/php/Accountget.php")
      .then(res => res.json())
      .then(data => {

        const parties = data.map(item => item.AccountName);

        setPartyList(parties);
        setLoading(false);

      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });

  }, []);

  /* ===============================
     YOUR HANDLE PRINT FUNCTION
  =============================== */

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

      }
      catch (error) {

        console.error("PDF Error:", error);

      }
      finally {

        setPrinting(false);

      }

    }, 500);

  };

  const handleClose = () => window.history.back();

  /* ===============================
     UI
  =============================== */

  return (

    <Box sx={{
      minHeight: "100vh",
      background: "linear-gradient(135deg,#eef2f7,#e3e8f0)",
      display: "flex",
      justifyContent: "center",
      pt: 4
    }}>

      <Box width={540}>

        <Typography variant="h5" fontWeight={600} textAlign="center" mb={2}>
          TDS Certificate
        </Typography>

        {/* PERIOD */}

        <Paper elevation={5} sx={{ p: 2.5, mb: 2 }}>

          <Box display="flex" gap={1} mb={1}>
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
                value={startDate}
                InputLabelProps={{ shrink:true }}
                onChange={(e)=>setStartDate(e.target.value)}
              />
            </Grid>

            <Grid item xs={6}>
              <TextField
                label="End Date"
                type="date"
                fullWidth
                size="small"
                value={endDate}
                InputLabelProps={{ shrink:true }}
                onChange={(e)=>setEndDate(e.target.value)}
              />
            </Grid>

          </Grid>

        </Paper>


        {/* SHOW BOOKS */}

        <Paper elevation={5} sx={{ p:2.5, mb:2 }}>

          <Typography fontWeight={600}>
            Show Books ?
          </Typography>

          <RadioGroup row value={showBooks}
            onChange={(e)=>setShowBooks(e.target.value)}>

            <FormControlLabel value="yes" control={<Radio/>} label="Yes"/>
            <FormControlLabel value="no" control={<Radio/>} label="No"/>

          </RadioGroup>

        </Paper>


        {/* PARTY */}

        <Paper elevation={5} sx={{ p:2.5 }}>

          <Typography fontWeight={600}>
            Party
          </Typography>

          <TextField
            select
            fullWidth
            size="small"
            value={party}
            onChange={(e)=>setParty(e.target.value)}
          >

            <MenuItem value="">Select Party</MenuItem>

            {loading ? (
              <MenuItem>
                <CircularProgress size={18}/>
              </MenuItem>
            ) : (
              partyList.map((p,index)=>(
                <MenuItem key={index} value={p}>
                  {p}
                </MenuItem>
              ))
            )}

          </TextField>

        </Paper>


        {/* BUTTONS */}

        <Box display="flex" justifyContent="center" gap={2} mt={3}>

          <Button
            variant="contained"
            startIcon={<PrintIcon/>}
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
         HIDDEN PRINT TEMPLATE
      =============================== */}

      <Box
        ref={reportRef}
        sx={{
          width:"210mm",
          minHeight:"297mm",
          padding:"15mm",
          background:"#fff",
          position:"absolute",
          left:"-9999px",
          top:0,
          fontFamily:"Times New Roman"
        }}
      >

        <Typography align="center" fontWeight={700}>
          FORM NO. 16A
        </Typography>

        <Typography align="center" fontSize="12px">
          TDS Certificate
        </Typography>

        <Box mt={2}>

          <Typography fontSize="12px">
            Deductor : Phadke Prakashan, Kolhapur
          </Typography>

          <Typography fontSize="12px">
            Party : {party}
          </Typography>

          <Typography fontSize="12px">
            Period : {startDate} to {endDate}
          </Typography>

        </Box>

      </Box>

    </Box>

  );

}