import React, { useState, useEffect,useRef } from "react";
import {
  Box, Paper, Typography, Grid, TextField, RadioGroup,
  FormControlLabel, Radio, Checkbox, Button,
  Stack, Autocomplete, CircularProgress
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import PrintIcon from "@mui/icons-material/Print";
import CloseIcon from "@mui/icons-material/Close";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import StockDayBookPrint from "./StockdaybookPrint";


const TRANSACTION_TITLES = [
  
   "Sales Challan", "Sales Invoice", "Sales Return-CN",
  "Purchase Return-DN", "Book Purchase", "Paper Purchase", "Inward Challan",
  "Canvassor Details", "Paper Outward", "Paper Received from Binder", "Misprint"

];



export default function StockDayBook() {
  const navigate = useNavigate();

  const [startDate, setStartDate] = useState("2025-04-01");
  const [endDate, setEndDate] = useState("2026-03-31");
  const [partyMode, setPartyMode] = useState("all");
  const [transactionMode, setTransactionMode] = useState("both");
  const [typeSelection, setTypeSelection] = useState("all");
  
  const [parties, setParties] = useState([]);
  const [selectedParty, setSelectedParty] = useState(null);
  const [bookSearch, setBookSearch] = useState("");
  const [books, setBooks] = useState([]);
  const [selectedTypes, setSelectedTypes] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("https://publication.microtechsolutions.net.in/php/Accountget.php")
      .then(res => res.json())
      .then(data => {
        setParties(data);
        setLoading(false);
      })
      .catch(err => { console.error(err); setLoading(false); });
  }, []);

  const handleBookKeyDown = async (e) => {
    if (e.key === "Enter" && bookSearch) {
      try {
        const res = await fetch(`https://publication.microtechsolutions.net.in/php/Bookcodeget.php?BookCode=${bookSearch}`);
        const data = await res.json();
        setBooks(Array.isArray(data) ? data : [data]);
      } catch (err) { console.error(err); }
    }
  };

  const reportRef = useRef(null);

  const [printing, setPrinting] = useState(false);

// In StockDayBook.js
const handlePrint = async () => {
  if (!reportRef.current) return;
  setPrinting(true);

  try {
    // Wait for data and rendering
    await new Promise((resolve) => setTimeout(resolve, 1500)); 

    const element = reportRef.current;
    const canvas = await html2canvas(element, {
      scale: 2,
      useCORS: true,
      logging: false,
      windowWidth: 800, // Match the Box width in StockDayBookPrint
    });

    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF("p", "mm", "a4");
    
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

    pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
    window.open(pdf.output("bloburl"), "_blank");
  } catch (error) {
    console.error("PDF Error:", error);
  } finally {
    setPrinting(false);
  }
};

  const toggleType = (t) => setSelectedTypes(prev => ({ ...prev, [t]: !prev[t] }));

  if (loading) return <Box p={6} textAlign="center"><CircularProgress /></Box>;

  return (
    <Box sx={{ height: "92vh", display: "flex", justifyContent: "center", alignItems: "flex-start", bgcolor: "#f4f7f9"}}>
<Box width={850}>
        <Typography 
          variant="h6" 
          fontWeight={700} 
          sx={{ 
            mb: 1, 
            textAlign: "center", 
            color: "#333",
            textTransform: "uppercase",
            letterSpacing: 1
          }}
        >
          Stock Day Book
        </Typography>
        <Paper sx={{ p: 1, border: "1px solid #bbb", borderRadius: 1, position: "relative" }}>
          {/* PERIOD & PARTY SELECTION */}
          <Grid container spacing={1} mb={1}>
            <Grid item xs={5}>
              <Box sx={{ border: "1px solid #ccc", p: 1, borderRadius: 1, position: 'relative' }}>
                <Typography variant="caption" sx={{ position: 'absolute', top: -10, left: 10, bgcolor: 'white', px: 0.5, fontWeight: 700 }}>Period</Typography>
                <Stack direction="row" spacing={1} mt={0.5}>
                  <TextField type="date" size="small" fullWidth value={startDate} onChange={e => setStartDate(e.target.value)} />
                  <TextField type="date" size="small" fullWidth value={endDate} onChange={e => setEndDate(e.target.value)} />
                </Stack>
              </Box>
            </Grid>
            <Grid item xs={7}>
              <Box sx={{ border: "1px solid #ccc", p: 0.5, px: 1.5, borderRadius: 1, position: 'relative' }}>
                <Typography variant="caption" sx={{ position: 'absolute', top: -10, left: 10, bgcolor: 'white', px: 0.5, fontWeight: 700 }}>Party Selection</Typography>
                <Stack direction="row" alignItems="center" spacing={1}>
                  <RadioGroup row value={partyMode} onChange={e => setPartyMode(e.target.value)}>
                    <FormControlLabel value="all" control={<Radio size="small" />} label={<Typography variant="body2">All</Typography>} />
                    <FormControlLabel value="selected" control={<Radio size="small" />} label={<Typography variant="body2">Selected</Typography>} />
                  </RadioGroup>
                  <Autocomplete
                    disabled={partyMode === "all"}
                    options={parties}
                    getOptionLabel={(option) => option.AccountName || ""}
                    size="small"
                    fullWidth
                    renderInput={(params) => <TextField {...params} placeholder="Search Party..." />}
                  />
                </Stack>
              </Box>
            </Grid>
          </Grid>

          {/* TRANSACTION FLOW */}
          <Box sx={{ border: "1px solid #ccc", px: 1.5, py: 0.5, borderRadius: 1, mb: 1, position: 'relative' }}>
            <Typography variant="caption" sx={{ position: 'absolute', top: -10, left: 10, bgcolor: 'white', px: 0.5, fontWeight: 700 }}>Transaction</Typography>
            <RadioGroup row value={transactionMode} onChange={e => setTransactionMode(e.target.value)}>
              <FormControlLabel value="both" control={<Radio size="small" />} label={<Typography variant="body2">Both Inward & Outward</Typography>} />
              <FormControlLabel value="inward" control={<Radio size="small" />} label={<Typography variant="body2">Inward</Typography>} />
              <FormControlLabel value="outward" control={<Radio size="small" />} label={<Typography variant="body2">Outward</Typography>} />
            </RadioGroup>
          </Box>

          {/* TRANSACTION TYPES GRID */}
          <Box sx={{ border: "1px solid #ccc", p: 1, borderRadius: 1, mb: 1, position: 'relative' }}>
            <Typography variant="caption" sx={{ position: 'absolute', top: -10, left: 11, bgcolor: 'white', px: 0.5, fontWeight: 700 }}>Transaction Type</Typography>
            <RadioGroup row value={typeSelection} onChange={e => setTypeSelection(e.target.value)}>
              <FormControlLabel value="all" control={<Radio size="small" />} label={<Typography variant="body2">All Transactions</Typography>} />
              <FormControlLabel value="selected" control={<Radio size="small" />} label={<Typography variant="body2">Selected</Typography>} />
            </RadioGroup>
            
            <Box sx={{ maxHeight: 100, overflowY: 'auto', bgcolor: typeSelection === 'all' ? '#f5f5f5' : 'transparent', p: 0.5, border: '1px solid #eee' }}>
              <Grid container>
                {TRANSACTION_TITLES.map(title => (
                  <Grid item xs={3} key={title}>
                    <FormControlLabel
                      control={<Checkbox size="small" sx={{ p: 0.4 }} disabled={typeSelection === 'all'} checked={typeSelection === 'all' ? true : !!selectedTypes[title]} onChange={() => toggleType(title)} />}
                      label={<Typography sx={{ fontSize: '0.7rem' }}>{title}</Typography>}
                    />
                  </Grid>
                ))}
              </Grid>
            </Box>
          </Box>

          {/* BOOK SELECTION & BUTTONS */}
          <Grid container spacing={2} alignItems="flex-end">
            <Grid item xs={9}>
              <Box sx={{ border: "1px solid #ccc", p: 1, borderRadius: 1, position: 'relative' }}>
                <Typography variant="caption" sx={{ position: 'absolute', top: -10, left: 10, bgcolor: 'white', px: 0.5, fontWeight: 700 }}>Book Selection</Typography>
                <TextField 
                  placeholder="Book Code + Enter" 
                  size="small" 
                  fullWidth 
                  value={bookSearch}
                  onChange={(e) => setBookSearch(e.target.value)}
                  onKeyDown={handleBookKeyDown}
                  sx={{ mb: 0.5, mt: 0.5 }}
                />
                <Box sx={{ height: 70, overflow: "auto", border: "1px solid #eee" }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '11px' }}>
                    <thead style={{ position: 'sticky', top: 0, backgroundColor: '#f5f5f5' }}>
                      <tr>
                        <th style={{ textAlign: 'left', padding: '4px' }}>Code</th>
                        <th style={{ textAlign: 'left', padding: '4px' }}>Name</th>
                      </tr>
                    </thead>
                    <tbody>
                      {books.map((b, i) => (
                        <tr key={i} style={{ borderBottom: '1px solid #eee' }}>
                          <td style={{ padding: '2px 4px' }}>{b.BookCode || b.code}</td>
                          <td style={{ padding: '2px 4px' }}>{b.BookName || b.name}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </Box>
              </Box>
            </Grid>
           
          </Grid>

           <Grid item xs={3}>
              <Box   sx={{display:'flex',justifyContent:'center',  gap:1, mt:1}}>
                <Button variant="contained" startIcon={<PrintIcon />} size="small"  sx={{ bgcolor: "#2e7d32", fontSize: '0.75rem' }} onClick={handlePrint}>Print</Button>
                <Button variant="outlined" color="error" startIcon={<CloseIcon />} size="small"  sx={{ fontSize: '0.75rem' }} onClick={() => navigate(-1)}>Close</Button>
              </Box>
            </Grid>
        </Paper>
      </Box>

     {/* HIDDEN PRINT AREA - Now positioned behind and invisible instead of off-screen */}
<Box 
  sx={{ 
    position: "fixed", 
    zIndex: -1, 
    top: 0, 
    left: 0, 
    opacity: 0, 
    pointerEvents: "none" 
  }}
>
  <div ref={reportRef}>
    <StockDayBookPrint 
      filters={{ 
        startDate, 
        endDate, 
        partyMode, 
        selectedParty, 
        transactionMode, 
        typeSelection, 
        selectedTypes, 
        books 
      }} 
    />
  </div>
</Box>
    </Box>
  );
}