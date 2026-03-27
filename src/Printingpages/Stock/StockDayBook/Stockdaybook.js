





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
import axios from "axios"; // ✅ ADDED
import dayjs from "dayjs";

import autoTable from "jspdf-autotable";
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

  // ✅ ADDED
  const [printData, setPrintData] = useState([]);
  const [activeCompany, setActiveCompany] = useState(null);

  useEffect(() => {
    fetch("https://publication.microtechsolutions.net.in/php/Accountget.php")
      .then(res => res.json())
      .then(data => {
        setParties(data);
        setLoading(false);
      })
      .catch(err => { console.error(err); setLoading(false); });
  }, []);

  useEffect(() => {
  const selected = localStorage.getItem("SelectedCompany");

  if (selected) {
    try {
      setActiveCompany(JSON.parse(selected));
    } catch (e) {
      console.error("Company parse error", e);
    }
  }
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

  // ✅ UPDATED ONLY THIS FUNCTION
  const handlePrint = async () => {
  try {
    const res = await axios.get(
      "https://publication.microtechsolutions.net.in/php/get/getStockDayBook.php",
      {
        params: {
          fromdate: startDate,
          todate: endDate,
        }
      }
    );

    const data = res.data.data || [];

    // ✅ GROUP SAME AS YOUR UI
    const grouped = {};
    data.forEach((row) => {
      const date = row.Date;
      const party = row.Party;

      if (!grouped[date]) grouped[date] = {};
      if (!grouped[date][party]) grouped[date][party] = [];

      grouped[date][party].push(row);
    });

    const doc = new jsPDF();

    // ✅ HEADER
    doc.setFontSize(14);
    doc.text(activeCompany?.CompanyName || "Company Name", 105, 10, { align: "center" });

    doc.setFontSize(10);
    doc.text(activeCompany?.Address1 || "", 105, 15, { align: "center" });
    doc.text("Stock Day Book", 105, 20, { align: "center" });

    doc.text(
      `From ${dayjs(startDate).format("DD-MM-YY")} To ${dayjs(endDate).format("DD-MM-YY")}`,
      105,
      25,
      { align: "center" }
    );

    let finalRows = [];
    
Object.keys(grouped).forEach((date, index) => {

  // ✅ STEP 1: ADD SPACE BETWEEN DATE GROUPS
  if (index !== 0) {
    finalRows.push([
      {
        content: "",
        colSpan: 6,
        styles: {
          minCellHeight: 6
        }
      }
    ]);
  }

  // ✅ STEP 2: DATE ROW (CENTER + BORDER)
  finalRows.push([
    {
      content: dayjs(date).format("DD-MM-YY"),
      colSpan: 6,
      styles: {
        halign: "center",
        fontStyle: "bold",
        textColor: [0, 0, 0],
        lineWidth: { top: 0.5, bottom: 0.5 }
      }
    }
  ]);

  // ✅ STEP 3: PARTY LOOP
  Object.keys(grouped[date]).forEach((party) => {

    // PARTY HEADER
    finalRows.push([
      {
        content: party,
        colSpan: 6,
        styles: {
          halign: "left",
          fontStyle: "bold",
          cellPadding: { left: 12 } // 👈 INDENT LIKE UI
        }
      }
    ]);

    // ✅ STEP 4: DATA ROWS
    grouped[date][party].forEach((row) => {
      finalRows.push([
        row["Ref. no."],
        dayjs(row.Date).format("DD-MM-YY"),
        row["Name of the Party"],
        row.Particulars,
        row.Inward,
        row.Outward
      ]);
    });

  });

});

    // ✅ TABLE
   autoTable(doc, {
  startY: 30,

  head: [[
    "Ref No",
    "Date",
    "Name of Party",
    "Particulars",
    "Inward",
    "Outward"
  ]],

  body: finalRows,

  styles: {
    fontSize: 8,
    cellPadding: 2,
    textColor: [0, 0, 0]
  },

  headStyles: {
    fillColor: [255, 255, 255],
    textColor: [0, 0, 0],
    fontStyle: "bold",
    lineWidth: { top: 0.5, bottom: 0.5 }
  },

  columnStyles: {
    0: { halign: "center" },
    1: { halign: "center" },
    2: { halign: "left" },
    3: { halign: "left" },
    4: { halign: "right" },
    5: { halign: "right" }
  },

  didParseCell: function (data) {
    const row = data.row.raw;

    // ✅ DATE or PARTY ROW
    if (row?.[0]?.colSpan === 6) {
      data.cell.styles.fontStyle = "bold";

      // DATE ROW → center
      if (data.cell.styles.halign === "center") {
        data.cell.styles.lineWidth = { top: 0.5, bottom: 0.5 };
      }
    }
  }
});

    doc.save("StockDayBook.pdf");

  } catch (error) {
    console.error(error);
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

          {/* BOOK SELECTION */}
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
                    <thead>
                      <tr>
                        <th>Code</th>
                        <th>Name</th>
                      </tr>
                    </thead>
                    <tbody>
                      {books.map((b, i) => (
                        <tr key={i}>
                          <td>{b.BookCode}</td>
                          <td>{b.BookName}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </Box>
              </Box>
            </Grid>
          </Grid>

          {/* BUTTONS */}
          <Grid item xs={3}>
            <Box sx={{display:'flex',justifyContent:'center',gap:1,mt:1}}>
              <Button variant="contained" startIcon={<PrintIcon />} onClick={handlePrint}>Print</Button>
              <Button variant="outlined" color="error" onClick={()=>navigate(-1)}>Close</Button>
            </Box>
          </Grid>

        </Paper>
      </Box>

      {/* PRINT AREA */}
      <Box sx={{ position:"fixed", zIndex:-1, opacity:0 }}>
        <div ref={reportRef}>
         <StockDayBookPrint 
  data={printData} 
  filters={{ startDate, endDate }} 
  company={activeCompany}
/>
        </div>
      </Box>
    </Box>
  );
}