import React, { useState, useEffect, useRef } from 'react';
import { 
  Box, Typography, Grid, Paper, TextField, MenuItem, CircularProgress, 
  Stack, Button, FormControlLabel, Radio, RadioGroup,
  Autocomplete
} from "@mui/material";
import { 
  Book as BookIcon
} from '@mui/icons-material';
import axios from 'axios';
import PartywisePaperwisePaperOutward from "./Reports/PartywisePaperwisePaperOutward";
import PaperwisePartywiseOutward from "./Reports/PaperwisePartywiseOutward";
import GodownwisepaperReport from './Reports/GodownwisePaperwisesummary';
import PartywisePaperwiseInwardSummary from './Reports/PartywisePaperwiseInwardSummary';
import Paperstockbook from './Reports/Paperstockbook';
import PaperConsumptionDetails from './Reports/PaperConsumptionDetails';


const reportTypes = [
  { id: 1, title: "Partywise Paperwise Outward Summary", api: "get_partywise_outward.php" },
  { id: 2, title: "Paperwise-Partywise Outward Summary", api: "get_paperwise_outward.php" },
  { id: 3, title: "Partywise-Paperwise Inward Summary", api: "get_partywise_inward.php" },
  { id: 4, title: "Godownwise-Paperwise Summary", api: "get_godownwise.php" },
  { id: 5, title: "Paper Stock Book", api: "get_stock_book.php" },
  { id: 6, title: "Paper Consumption Details", api: "get_consumption.php" },
];

function BookPrintingOrder() {
  const [view, setView] = useState('form'); 
  const [formData, setFormData] = useState({
    startDate: "2025-04-01", 
    endDate: "2026-03-31",
    press: "", 
    paperSize: "", 
    selectedBooks: [], 
    selectedReport: 1
  });

  const [masters, setMasters] = useState({ press: [], paper: [], books: [] });
  const [reportData, setReportData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [p, s, b] = await Promise.all([
          axios.get('https://publication.microtechsolutions.net.in/php/PressMasterget.php'),
          axios.get('https://publication.microtechsolutions.net.in/php/PaperSizeget.php'),
          axios.get('https://publication.microtechsolutions.net.in/php/bookget.php')
        ]);
        setMasters({ 
            press: Array.isArray(p.data) ? p.data : [], 
            paper: Array.isArray(s.data) ? s.data : [], 
            books: Array.isArray(b.data) ? b.data : [] 
        });
      } catch (e) { 
          console.error("Fetch Error:", e); 
      } finally { 
          setLoading(false); 
      }
    };
    fetchData();
  }, []);

const generateReport = async () => {
  if (formData.selectedBooks.length === 0) return alert("Please select books!");
  
  setLoading(true);
  try {
    const selectedReportObj = reportTypes.find(r => r.id === formData.selectedReport);

    // --- MOCK DATA FOR DEVELOPMENT ---
    // You can remove this 'if' block once your PHP files are uploaded
    const isBackendReady = false; 

    if (!isBackendReady) {
      console.warn("Using Mock Data because backend is not ready.");
      
      // Create a fake response based on the report selected
      const fakeData = [
        { 
          Date: "2025-04-10", 
          DCNo: "DC/1001", 
          PartyName: "ANAND OFFSET PRINTERS", 
          PaperName: "ANDHRA DELUX 23",
          Godown: "Godown - 1", 
          Bundles: 10, 
          Qty: 17.000, 
          Unit: "REAM" 
        },
        { 
          Date: "2025-04-12", 
          DCNo: "DC/1002", 
          PartyName: "ANAND OFFSET PRINTERS", 
          PaperName: "CENTURY 20X30",
          Godown: "Godown - 1", 
          Bundles: 5, 
          Qty: 16.000, 
          Unit: "REAM" 
        }
      ];

      setReportData(fakeData);
      setView('report');
      setLoading(false);
      return; // Stop here and don't call the actual API
    }
    // ---------------------------------

    const response = await axios.post(`https://publication.microtechsolutions.net.in/php/${selectedReportObj.api}`, {
      start: formData.startDate,
      end: formData.endDate,
      press: formData.press,
      paper: formData.paperSize,
      books: formData.selectedBooks.map(b => b.BookCode)
    });
    
    if (response.data) {
      setReportData(response.data);
      setView('report'); 
    }
  } catch (error) {
    console.error("Full Error:", error);
    alert(`Error: ${error.message}`);
  } finally {
    setLoading(false);
  }
};

  // --- THE SWITCH TO REPORT COMPONENT ---
  if (view === 'report') {
  // Find the selected report object to get its title
  const currentReport = reportTypes.find(r => r.id === formData.selectedReport);
  
  const commonProps = {
    reportData: reportData,
    params: formData,
    onBack: () => setView('form'),
    // PASS THE TITLE HERE
    title: currentReport ? currentReport.title : "Report" 
  };

  switch (formData.selectedReport) {
    case 1:
      return <PartywisePaperwisePaperOutward {...commonProps} />;
    case 2:
      return <PaperwisePartywiseOutward {...commonProps} />;
       case 3:
      return <PartywisePaperwiseInwardSummary {...commonProps} />;
       case 4:
      return <GodownwisepaperReport {...commonProps} />;
       case 5:
      return <Paperstockbook {...commonProps} />;
       case 6:
      return <PaperConsumptionDetails {...commonProps} />;
    // ... add other cases
    default:
      return (
        <Box sx={{ p: 5, textAlign: 'center' }}>
          <Typography>Report not implemented yet.</Typography>
          <Button onClick={() => setView('form')}>Go Back</Button>
        </Box>
      );
  }
}

  if (loading) return <Box sx={{ display: 'flex', justifyContent: 'center', mt: 10 }}><CircularProgress /></Box>;

  return (
    <Box sx={{ p: 2, bgcolor: '#f4f4f4', minHeight: '100vh' }}>
      <Paper sx={{ p: 3, maxWidth: 900, mx: 'auto', border: '1px solid #ccc', borderRadius: 2 }}>
       {/* Replace your current Stack/Typography section with this */}
<Box sx={{ mb: 3 }}>
  <Typography 
    variant="h6" 
    sx={{ 
      fontWeight: 'bold', 
      textAlign: 'center',
      width: '100%',
      // color: 'primary.main', // Optional: gives it a nice theme color
      // borderBottom: '2px solid #eee', // Optional: adds a separator line like legacy reports
       
    }}
  >
    Book Printing Order
  </Typography>
</Box>

        <Grid container spacing={1}>
          {/* Period Section */}
          <Grid item xs={12} md={6}>
            <Typography sx={{fontWeight:'bold'}}>Start date</Typography>
            <TextField 
              fullWidth size="small" type="date"   InputLabelProps={{ shrink: true }} 
              value={formData.startDate} onChange={e => setFormData({...formData, startDate: e.target.value})} 
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography sx={{fontWeight:'bold'}}>End date</Typography>
            <TextField 
              fullWidth size="small" type="date"  InputLabelProps={{ shrink: true }} 
              value={formData.endDate} onChange={e => setFormData({...formData, endDate: e.target.value})} 
            />
          </Grid>

          {/* Press Dropdown */}
          <Grid item xs={12} md={6}>
           {/* PRESS DROPDOWN */}
<Grid item xs={12} md={6}>
              <Typography sx={{fontWeight:'bold'}}>Press</Typography>

  <TextField 
    select 
    fullWidth 
    size="small" 
     // We use String() to ensure "1" (string) matches 1 (number) from API
    value={formData.press ? String(formData.press) : ""} 
    onChange={e => setFormData({...formData, press: e.target.value})}
  >
    <MenuItem value=""><em>-- None --</em></MenuItem>
    {masters.press.map((p) => (
      // CHECK YOUR CONSOLE: If it's not p.PressID, it might be p.Id or p.PressId
      <MenuItem key={p.PressID || p.Id} value={String(p.PressID || p.Id)}>
        {p.PressName}
      </MenuItem>
    ))}
  </TextField>
</Grid>
          </Grid>

          {/* FIXED PAPER SIZE DROPDOWN - Mapped to 'Id' from your API response */}
          <Grid item xs={12} md={6}>

                        <Typography sx={{fontWeight:'bold'}}>Paper Size</Typography>

            <TextField 
              select fullWidth size="small"  
              value={formData.paperSize} 
              onChange={e => setFormData({...formData, paperSize: e.target.value})}
            >
              <MenuItem value=""><em>-- All Sizes --</em></MenuItem>
              {masters.paper.map((s) => (
                <MenuItem key={s.Id} value={s.Id}>
                  {s.PaperSizeName}
                </MenuItem>
              ))}
            </TextField>
          </Grid>

          {/* Book Selection */}
          <Grid item xs={12}>
                        <Typography sx={{fontWeight:'bold'}}>Book Selection</Typography>

            <Autocomplete
              multiple
              size="small"
              options={masters.books}
              getOptionLabel={(option) => `[${option.BookCode}] ${option.BookName} ${option.BookNameMarathi}`}
              value={formData.selectedBooks}
              onChange={(e, v) => setFormData({...formData, selectedBooks: v})}
              renderInput={(p) => <TextField {...p}  placeholder="Search books..." />}
              sx={{ bgcolor: 'white' }}
            />
          </Grid>

          {/* Report Selection */}
          <Grid item xs={12}>
            <Box sx={{ p: 1, border: '1px solid #ddd', borderRadius: 1, mt: 1, bgcolor: '#fff' }}>
              <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 'bold' }}>Select Report Type:</Typography>
              <RadioGroup 
                value={formData.selectedReport} 
                onChange={(e) => setFormData({...formData, selectedReport: parseInt(e.target.value)})}
              >
                <Grid container>
                  {reportTypes.map(r => (
                    <Grid item xs={12} sm={6} key={r.id}>
                      <FormControlLabel value={r.id} control={<Radio size="small" />} label={<Typography variant="body2">{r.title}</Typography>} />
                    </Grid>
                  ))}
                </Grid>
              </RadioGroup>
            </Box>
          </Grid>

          {/* Action Buttons */}
          <Grid item xs={12}>
            <Stack direction="row" spacing={2} sx={{ mt: 1, justifyContent: 'flex-end' }}>
              <Button variant="outlined" color="inherit" onClick={() => window.location.reload()}>Cancel</Button>
              <Button variant="contained" color="primary" onClick={generateReport} sx={{ px: 4 }}>
                Generate Report
              </Button>
            </Stack>
          </Grid>
        </Grid>
      </Paper>
    </Box>
  );
}

export default BookPrintingOrder;