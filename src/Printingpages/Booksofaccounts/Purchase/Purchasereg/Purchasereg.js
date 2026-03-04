import React, { useState, useRef, useEffect } from "react";
import {
  Box,
  Paper,
  Typography,
  TextField,
  Radio,
  RadioGroup,
  FormControlLabel,
  Checkbox,
  Select,
  MenuItem,
  Button,
  Grid,
  Autocomplete,
  CircularProgress
} from "@mui/material";
import PrintIcon from "@mui/icons-material/Print";
import CloseIcon from "@mui/icons-material/Close";
import DateRangeIcon from "@mui/icons-material/DateRange";
import { useNavigate } from "react-router-dom";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import PurchaseregPrint from "./PurchaseregPrint";




const salesTaxOptions = [
  { label: "C.S.T. 4%", taxId: 1 },
  { label: "CST 12.5%", taxId: 2 },
  { label: "Exempted", taxId: 3 },
  { label: "Expenses", taxId: 4 },
  { label: "GST 5%", taxId: 5 },
  { label: "GST 12%", taxId: 6 },
  { label: "GST 18%", taxId: 7 },
  { label: "GST 28%", taxId: 8 },
  { label: "IGST 5%", taxId: 9 },
  { label: "IGST 12%", taxId: 10 },
  { label: "IGST 18%", taxId: 11 },
  { label: "IGST 28%", taxId: 12 },
  { label: "Lbr Chgs.", taxId: 13 },
  { label: "R.D.", taxId: 14 },
  { label: "ROYALTY", taxId: 15 },
  { label: "Transit-Against C Form", taxId: 16 },
  { label: "U.R.D", taxId: 17 },
  { label: "VAT 4%", taxId: 18 },
  { label: "VAT 5%", taxId: 19 },
  { label: "VAT 6%", taxId: 20 },
  { label: "VAT 8%", taxId: 21 },
  { label: "VAT 12.5%", taxId: 22 },
  { label: "VAT 13.5%", taxId: 23 },
  { label: "VAT @5.5%", taxId: 24 },
];

export default function PurchaseRegister() {
  const navigate = useNavigate();

  const [startDate, setStartDate] = useState("2026-04-01");
  const [endDate, setEndDate] = useState("2026-03-31");
  const [showListing, setShowListing] = useState("no");
  const [party, setParty] = useState(null); // Stores the selected object
  const [parties, setParties] = useState([]); // Stores API data
  const [loadingParties, setLoadingParties] = useState(true);
  const [selectedTaxIds, setSelectedTaxIds] = useState([]);

  const reportRef = useRef();
  const [printing, setPrinting] = useState(false);

  // FETCH DATA FROM API
  useEffect(() => {
    const fetchParties = async () => {
      try {
        const response = await fetch("https://publication.microtechsolutions.net.in/php/Accountget.php");
        const data = await response.json();
        setParties(data);
      } catch (error) {
        console.error("Error fetching account data:", error);
      } finally {
        setLoadingParties(false);
      }
    };
    fetchParties();
  }, []);

  const handlePrint = async () => {
    setPrinting(true);
    setTimeout(async () => {
      try {
        const element = reportRef.current;
        if (!element) return;
        const canvas = await html2canvas(element, { scale: 2, useCORS: true });
        const imgData = canvas.toDataURL("image/png");
        const pdf = new jsPDF("p", "mm", "a4");
        const pageWidth = pdf.internal.pageSize.getWidth();
        const pageHeight = pdf.internal.pageSize.getHeight();
        const imgWidth = canvas.width;
        const imgHeight = canvas.height;
        const ratio = Math.min(pageWidth / imgWidth, pageHeight / imgHeight);
        const finalWidth = imgWidth * ratio;
        const finalHeight = imgHeight * ratio;
        pdf.addImage(imgData, "PNG", (pageWidth - finalWidth) / 2, 10, finalWidth, finalHeight);
        window.open(pdf.output("bloburl"), "_blank");
      } catch (error) {
        console.error(error);
      } finally {
        setPrinting(false);
      }
    }, 300);
  };

  const handleClose = () => navigate(-1);

  return (
    <Box sx={{ minHeight: "100vh", background: "linear-gradient(135deg,#eef2f7,#e3e8f0)", display: "flex", justifyContent: "center", pt: 1 }}>
      <Box width={700}>
        <Typography variant="h5" fontWeight={600} textAlign="center" mb={1}>Purchase Register</Typography>

        <Paper elevation={4} sx={{ p: 1, mb: 1, borderRadius: 1 }}>
          <Box display="flex" alignItems="center" gap={1} mb={1}>
            <DateRangeIcon fontSize="small" color="primary" />
            <Typography fontWeight={600} fontSize={15}>Period</Typography>
          </Box>
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <TextField label="Start Date" type="date" size="small" fullWidth InputLabelProps={{ shrink: true }} value={startDate} onChange={e => setStartDate(e.target.value)} />
            </Grid>
            <Grid item xs={6}>
              <TextField label="End Date" type="date" size="small" fullWidth InputLabelProps={{ shrink: true }} value={endDate} onChange={e => setEndDate(e.target.value)} />
            </Grid>
          </Grid>
        </Paper>

        <Paper elevation={4} sx={{ p: 2, mb: 2, borderRadius: 1 }}>
          <Typography fontWeight={600} fontSize={15}>Show Bill Listing ?</Typography>
          <RadioGroup row value={showListing} onChange={e => setShowListing(e.target.value)}>
            <FormControlLabel value="yes" control={<Radio size="small" />} label="Yes" />
            <FormControlLabel value="no" control={<Radio size="small" />} label="No" />
          </RadioGroup>
        </Paper>

        <Paper elevation={4} sx={{ p: 2, mb: 2, borderRadius: 1 }}>
          <Grid container spacing={3}>
            {/* Party Section with Autocomplete */}
            <Grid item xs={6}>
              <Typography fontWeight={700} fontSize={15} mb={1}>Party</Typography>
              <Autocomplete
                size="large"
                options={parties}
                loading={loadingParties}
                getOptionLabel={(option) => option.AccountName || ""}
                value={party}
                onChange={(event, newValue) => setParty(newValue)}
                isOptionEqualToValue={(option, value) => option.Id === value.Id}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    placeholder="Search Party"
                    InputProps={{
                      ...params.InputProps,
                      endAdornment: (
                        <React.Fragment>
                          {loadingParties ? <CircularProgress color="inherit" size={20} /> : null}
                          {params.InputProps.endAdornment}
                        </React.Fragment>
                      ),
                    }}
                  />
                )}
              />
            </Grid>

            
          </Grid>
        </Paper>

            <Paper elevation={4} sx={{ p: 2, mb: 2, borderRadius: 1 }}>
          <Grid container spacing={3}>
           

            {/* Tax Head Section */}
            <Grid item xs={6}>
              <Typography fontWeight={700} fontSize={15} mb={1}>Tax Head</Typography>
              <Select
                multiple
                fullWidth
                size="small"
                value={selectedTaxIds}
                onChange={(e) => setSelectedTaxIds(e.target.value)}
                renderValue={(selected) => {
                  if (selected.length === 0) return "Select Tax Heads";
                  return salesTaxOptions
                    .filter((opt) => selected.includes(opt.taxId))
                    .map((opt) => opt.label)
                    .join(", ");
                }}
                displayEmpty
                MenuProps={{ PaperProps: { style: { maxHeight: 250, width: 250 } } }}
              >
                <MenuItem disabled value=""><em>Select Tax Heads</em></MenuItem>
                {salesTaxOptions.map((tax) => (
                  <MenuItem key={tax.taxId} value={tax.taxId} sx={{ p: 0 }}>
                    <Checkbox size="small" checked={selectedTaxIds.indexOf(tax.taxId) > -1} />
                    <Typography fontSize={13}>{tax.label}</Typography>
                  </MenuItem>
                ))}
              </Select>
            </Grid>
          </Grid>
        </Paper>

        <Box display="flex" justifyContent="center" gap={3} mt={3}>
          <Button variant="contained" startIcon={<PrintIcon />} onClick={handlePrint} sx={{ px: 4, py: 1, fontWeight: 600, borderRadius: 2, minWidth: 160 }}>
            Print Report
          </Button>
          <Button variant="contained" color="error" startIcon={<CloseIcon />} onClick={handleClose} sx={{ px: 4, py: 1, fontWeight: 600, borderRadius: 2, minWidth: 130 }}>
            Close
          </Button>
        </Box>
      </Box>

      
                <Box sx={{ position: "absolute", top: "-10000px", left: "-10000px" }}>
                      <div ref={reportRef}>
                        <PurchaseregPrint state={{ startDate, endDate }} />
                      </div>
                    </Box>
    </Box>
  );
}