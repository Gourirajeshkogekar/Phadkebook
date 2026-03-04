import { useState, useEffect, useRef } from "react";
import {
  Box,
  Paper,
  Typography,
  Grid,
  Button,
  Stack,
  TextField,
  Checkbox,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Divider,
  CircularProgress,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  InputAdornment
} from "@mui/material";

import EventIcon from "@mui/icons-material/Event";
import BusinessIcon from "@mui/icons-material/Business";
import PrintIcon from "@mui/icons-material/Print";
import CloseIcon from "@mui/icons-material/Close";
import SearchIcon from "@mui/icons-material/Search";

import axios from "axios";
import dayjs from "dayjs";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { useNavigate } from "react-router-dom";
import React from "react";



export default function PartywiseSalesReceipt() {
  const reportRef = useRef();
  const [panel, setPanel] = useState("period");
  const [printing, setPrinting] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  /* ================= FINANCIAL YEAR LOGIC ================= */
  const today = dayjs();
  const fyYear = today.month() >= 3 ? today.year() : today.year() - 1;
  const [startDate, setStartDate] = useState(`${fyYear}-04-01`);
  const [endDate, setEndDate] = useState(`${fyYear + 1}-03-31`);

  /* ================= DATA STATES ================= */
  const [cities, setCities] = useState([]);
  const [selectedCities, setSelectedCities] = useState([]);
  const [loadingCities, setLoadingCities] = useState(false);
  const [reportData, setReportData] = useState([]);
const navigate = useNavigate("")
  useEffect(() => {
    loadCities();
  }, []);

  const loadCities = async () => {
    try {
      setLoadingCities(true);
      const res = await axios.get("https://publication.microtechsolutions.net.in/php/Cityget.php");
      const list = res.data.map(x => x.CityName || Object.values(x)[0]);
      setCities(list);
    } catch {
      setCities([]);
    } finally {
      setLoadingCities(false);
    }
  };

  const toggleCity = (name) => {
    setSelectedCities(prev =>
      prev.includes(name) ? prev.filter(x => x !== name) : [...prev, name]
    );
  };

  const handleSelectAll = () => {
    if (selectedCities.length === cities.length) {
      setSelectedCities([]);
    } else {
      setSelectedCities(cities);
    }
  };

  const filteredCities = cities.filter(city => 
    city.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handlePrint = async () => {
    setPrinting(true);
    setTimeout(async () => {
      try {
        const element = reportRef.current;
        if (!element) return;
        const canvas = await html2canvas(element, { scale: 2, useCORS: true });
        const imgData = canvas.toDataURL("image/png");
        const pdf = new jsPDF("p", "mm", "a4");
        pdf.addImage(imgData, "PNG", 0, 0, 210, 297, "", "FAST");
        window.open(pdf.output("bloburl"), "_blank");
      } catch (err) {
        console.error(err);
      } finally {
        setPrinting(false);
      }
    }, 500);
  };

  return (
    <Box sx={{ minHeight: "90vh", p: 1, bgcolor: "#f5f7f9" }}>
      {/* HEADER */}
      <Box sx={{ mb: 1, pb: 1, borderBottom: "2px solid #1976d2" }}>
        <Typography variant="h5" fontWeight={700} color="primary.main">
          Partywise Sales & Receipt
        </Typography>
      </Box>

      <Grid container spacing={2}>
        {/* LEFT NAVIGATION PANEL */}
        <Grid item xs={12} md={3}>
          <Paper elevation={2} sx={{ borderRadius: 1, overflow: 'hidden' }}>
            <Stack>
              <ListItemButton 
                selected={panel === "period"} 
                onClick={() => setPanel("period")}
                sx={{ py: 2, "&.Mui-selected": { borderRight: "4px solid #1976d2" } }}
              >
                <ListItemIcon><EventIcon color={panel === "period" ? "primary" : "inherit"} /></ListItemIcon>
                <ListItemText primary="Period" primaryTypographyProps={{ fontWeight: panel === "period" ? 700 : 500 }} />
              </ListItemButton>
              
              <Divider />
              
              <ListItemButton 
                selected={panel === "city"} 
                onClick={() => setPanel("city")}
                sx={{ py: 2, "&.Mui-selected": { borderRight: "4px solid #1976d2" } }}
              >
                <ListItemIcon><BusinessIcon color={panel === "city" ? "primary" : "inherit"} /></ListItemIcon>
                <ListItemText primary="City / District" primaryTypographyProps={{ fontWeight: panel === "city" ? 700 : 500 }} />
              </ListItemButton>
            </Stack>
          </Paper>
        </Grid>

    {/* RIGHT CONTENT PANEL */}
<Grid item xs={12} md={9}>
  <Paper 
    elevation={2} 
    sx={{ 
      p: 2, 
      borderRadius: 1, 
      height: 'fit-content', // This shrinks the paper to fit the content
      display: 'flex', 
      flexDirection: 'column' 
    }}
  >
    {/* CONTENT AREA - REMOVED flexGrow: 1 */}
    <Box sx={{ mb: 1 }}>
      {panel === "period" ? (
        <Box>
          <Typography variant="h6" fontWeight={600} gutterBottom color="primary">Date Range Selection</Typography>
          <Divider sx={{ mb: 2 }} />
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField label="From Date" type="date" fullWidth InputLabelProps={{ shrink: true }} value={startDate} onChange={(e) => setStartDate(e.target.value)} />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField label="To Date" type="date" fullWidth InputLabelProps={{ shrink: true }} value={endDate} onChange={(e) => setEndDate(e.target.value)} />
            </Grid>
          </Grid>
        </Box>
      ) : (
        <Box sx={{ display: 'flex', flexDirection: 'column' }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
            <Typography variant="h6" fontWeight={600} color="primary">City / District Selection</Typography>
            <Button size="small" onClick={handleSelectAll}>Select All</Button>
          </Box>
          <TextField
            fullWidth size="small" placeholder="Search city..." sx={{ mb: 1 }}
            value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
            InputProps={{ startAdornment: (<InputAdornment position="start"><SearchIcon fontSize="small" /></InputAdornment>) }}
          />
          <Box sx={{ 
            maxHeight: '200px', // Keeps the list scrollable but contained
            overflowY: "auto", 
            bgcolor: "#fafafa", 
            borderRadius: 1, 
            border: "1px solid #eee"
          }}>
            {loadingCities ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', p: 1 }}><CircularProgress size={24} /></Box>
            ) : (
              <List dense>
                {cities.filter(c => c.toLowerCase().includes(searchTerm.toLowerCase())).map((city) => (
                  <ListItemButton key={city} onClick={() => toggleCity(city)} sx={{ py: 0.5 }}>
                    <ListItemIcon sx={{ minWidth: 40 }}><Checkbox checked={selectedCities.includes(city)} size="small" /></ListItemIcon>
                    <ListItemText primary={city} />
                  </ListItemButton>
                ))}
              </List>
            )}
          </Box>
        </Box>
      )}
    </Box>

    {/* ACTION BUTTONS - NOW SITTING DIRECTLY BELOW CONTENT */}
    <Box sx={{ mt: 1 }}>
      <Divider sx={{ mb: 2 }} />
      <Stack direction="row" spacing={2} justifyContent="flex-end">
        <Button
          variant="contained"
          startIcon={<PrintIcon />}
          onClick={handlePrint}
          disabled={printing}
          sx={{ minWidth: 120, textTransform: 'none', fontWeight: 600 }}
        >
          {printing ? "Processing..." : "Print Report"}
        </Button>
        <Button 
          variant="outlined" 
          color="error" 
          startIcon={<CloseIcon />}
          onClick={() => navigate(-1)}
          sx={{ minWidth: 120, textTransform: 'none', fontWeight: 600 }}
        >
          Cancel
        </Button>
      </Stack>
    </Box>
  </Paper>
</Grid></Grid>



    {/* ================= HIDDEN PRINT AREA ================= */}
<Box
  ref={reportRef}
  sx={{
    position: "absolute",
    left: "-9999px",
    width: "210mm",
    p: "10mm",
    bgcolor: "#fff",
    color: "#000",
    fontFamily: "'Times New Roman', Times, serif", // Classic report font
  }}
>
  {/* Report Header */}
  <Typography align="center" sx={{ fontSize: "20px", fontWeight: "bold", textTransform: "uppercase" }}>
    PHADKE BOOK HOUSE
  </Typography>
  <Typography align="center" sx={{ fontSize: "14px", fontWeight: 500 }}>
    Partywise Sales & Receipt Statement
  </Typography>
  <Typography align="center" sx={{ fontSize: "12px", mb: 2 }}>
    From {dayjs(startDate).format("DD-MM-YYYY")} To {dayjs(endDate).format("DD-MM-YYYY")}
  </Typography>

  <Table
    size="small"
    sx={{
      mt: 1,
      "& .MuiTableCell-root": {
        border: "none", // Most classic reports use minimal borders
        borderBottom: "1px solid #ccc",
        fontSize: "11px",
        p: "4px 2px",
        color: "#000",
      },
    }}
  >
    <TableHead>
      <TableRow sx={{ borderTop: "2px solid black", borderBottom: "2px solid black" }}>
        <TableCell sx={{ fontWeight: "bold", width: "40px" }}>Sr. No.</TableCell>
        <TableCell sx={{ fontWeight: "bold" }}>Name Of Party</TableCell>
        <TableCell align="right" sx={{ fontWeight: "bold" }}>OP. Bal</TableCell>
        <TableCell align="right" sx={{ fontWeight: "bold" }}>Bills</TableCell>
        <TableCell align="right" sx={{ fontWeight: "bold" }}>Other</TableCell>
        <TableCell align="right" sx={{ fontWeight: "bold" }}>Receipt</TableCell>
        <TableCell align="right" sx={{ fontWeight: "bold" }}>Closing Bal</TableCell>
      </TableRow>
    </TableHead>
    <TableBody>
      {/* Logic Note: If you have data grouped by district, 
          you would map through districts first. 
          Example UI implementation based on your screenshot:
      */}
      {reportData.length > 0 ? (
        reportData.map((district, dIdx) => (
          <React.Fragment key={dIdx}>
            {/* District Header Row */}
            <TableRow>
              <TableCell colSpan={7} sx={{ py: 1 }}>
                <Typography variant="body2" sx={{ fontWeight: "bold", textAlign: "center", textDecoration: 'underline' }}>
                  Dist. : {district.cityName.toUpperCase()}
                </Typography>
              </TableCell>
            </TableRow>

            {/* Parties in that District */}
            {district.parties.map((party, pIdx) => (
              <TableRow key={pIdx}>
                <TableCell>{pIdx + 1}</TableCell>
                <TableCell>{party.name}</TableCell>
                <TableCell align="right">{party.opBal.toFixed(2)}</TableCell>
                <TableCell align="right">{party.bills.toFixed(2)}</TableCell>
                <TableCell align="right">{party.other.toFixed(2)}</TableCell>
                <TableCell align="right">{party.receipt.toFixed(2)}</TableCell>
                <TableCell align="right">{party.closingBal.toFixed(2)}</TableCell>
              </TableRow>
            ))}

            {/* District Sub-Total Row */}
            <TableRow sx={{ "& .MuiTableCell-root": { borderTop: "1px dashed black", borderBottom: "1px dashed black", fontWeight: "bold" } }}>
              <TableCell colSpan={2} align="right">Sub Total ......</TableCell>
              <TableCell align="right">{district.totalOpBal.toFixed(2)}</TableCell>
              <TableCell align="right">{district.totalBills.toFixed(2)}</TableCell>
              <TableCell align="right">0.00</TableCell>
              <TableCell align="right">{district.totalReceipt.toFixed(2)}</TableCell>
              <TableCell align="right">{district.totalClosing.toFixed(2)}</TableCell>
            </TableRow>
          </React.Fragment>
        ))
      ) : (
        <TableRow>
          <TableCell colSpan={7} align="center" sx={{ py: 5 }}>
            No Data Available for selected period/cities
          </TableCell>
        </TableRow>
      )}
    </TableBody>
  </Table>
</Box></Box>
  )}