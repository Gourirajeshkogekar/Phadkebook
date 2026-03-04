import React, { useState, useRef ,useEffect} from "react";
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  MenuItem,CircularProgress,
  Grid
} from "@mui/material";
import Autocomplete from "@mui/material/Autocomplete"; // Ensure this is imported

import DateRangeIcon from "@mui/icons-material/DateRange";
import AccountBalanceIcon from "@mui/icons-material/AccountBalance";
import PrintIcon from "@mui/icons-material/Print";
import CloseIcon from "@mui/icons-material/Close";

import { useNavigate } from "react-router-dom";
import CashflowmonthwisePrint from "./CashflowmonthwisePrint";
import jsPDF from "jspdf";

import html2canvas from "html2canvas";


export default function CashFlowMonthwise() {
  const navigate = useNavigate();

  const [startDate, setStartDate] = useState("2026-04-01");
  const [endDate, setEndDate] = useState("2026-03-31");
  const [accountGroup, setAccountGroup] = useState("");

   const [groups, setGroups] = useState([]);
    const [loading, setLoading] = useState(true);
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

  const handleClose = () => navigate(-1);

  // --- FETCH DATA FROM API ---
    useEffect(() => {
      fetch("https://publication.microtechsolutions.net.in/php/AccountGroupget.php")
        .then((response) => response.json())
        .then((data) => {
          setGroups(data);
          setLoading(false);
        })
        .catch((error) => {
          console.error("Error fetching account groups:", error);
          setLoading(false);
        });
    }, []);

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
      <Box width={540}>

        {/* ===== TITLE ===== */}

        <Typography
          variant="h5"
          fontWeight={600}
          textAlign="center"
          mb={2}
        >
          Cash Flow Monthwise
        </Typography>

        {/* ===== PERIOD ===== */}

        <Paper elevation={5} sx={{ p: 2.5, borderRadius: 2.5, mb: 2.5 }}>
          <Box display="flex" alignItems="center" gap={1} mb={1.5}>
            <DateRangeIcon fontSize="small" color="primary" />
            <Typography fontWeight={600} fontSize={15}>
              Period
            </Typography>
          </Box>

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

       {/* ACCOUNT GROUP SECTION */}
        <Paper elevation={5} sx={{ p: 2.5, borderRadius: 2.5 }}>
          <Box display="flex" alignItems="center" gap={1} mb={1.5}>
            <AccountBalanceIcon fontSize="small" color="primary" />
            <Typography fontWeight={600} fontSize={15}>Account Group</Typography>
          </Box>

           <Autocomplete
              id="account-group-autocomplete"
              options={groups}
              loading={loading}
              // Logic to find the current object based on the stored string value
              value={groups.find((g) => g.GroupName === accountGroup) || null}
              // Extract GroupName when an item is selected
              onChange={(event, newValue) => {
                setAccountGroup(newValue ? newValue.GroupName : "");
              }}
              // This tells Autocomplete which property to show in the list
              getOptionLabel={(option) => option.GroupName.replace(/\r?\n|\r/g, " ") || ""}
              renderInput={(params) => (
                <TextField
                  {...params}
                   size="small"
                  fullWidth
                  placeholder="Type to filter..."
                  InputProps={{
                    ...params.InputProps,
                    endAdornment: (
                      <React.Fragment>
                        {loading ? <CircularProgress color="inherit" size={20} /> : null}
                        {params.InputProps.endAdornment}
                      </React.Fragment>
                    ),
                  }}
                />
              )}
            />
        </Paper>

        {/* ===== BUTTONS ===== */}

        <Box display="flex" justifyContent="center" gap={2.5} mt={3}>
          <Button
            variant="contained"
            size="medium"
            startIcon={<PrintIcon />}
            onClick={handlePrint}
            sx={{
              px: 3.5,
              py: 1,
              fontSize: 14,
              fontWeight: 600,
              borderRadius: 2,
              minWidth: 160
            }}
          >
            Print Report
          </Button>

          <Button
            variant="contained"
            color="error"
            size="medium"
            startIcon={<CloseIcon />}
            onClick={handleClose}
            sx={{
              px: 3.5,
              py: 1,
              fontSize: 14,
              fontWeight: 600,
              borderRadius: 2,
              minWidth: 130
            }}
          >
            Close
          </Button>
        </Box>

      </Box>
       <Box sx={{ position: "absolute", top: "-10000px", left: "-10000px" }}>
                      <div ref={reportRef}>
                        <CashflowmonthwisePrint state={{ startDate, endDate }} />
                      </div>
                    </Box>
    </Box>
  );
}