


import { useState, useEffect,useRef } from "react";
import {
  Box, Paper, Typography, Grid, RadioGroup,
  FormControlLabel, Radio, Checkbox, TextField,
  Button, Stack, List, ListItemButton, ListItemText,
  IconButton, Divider
} from "@mui/material";

import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import KeyboardDoubleArrowRightIcon from "@mui/icons-material/KeyboardDoubleArrowRight";
import KeyboardDoubleArrowLeftIcon from "@mui/icons-material/KeyboardDoubleArrowLeft";
import PrintIcon from "@mui/icons-material/Print";
import CloseIcon from "@mui/icons-material/Close";
import autoTable from "jspdf-autotable";
import dayjs from "dayjs";

import { useNavigate } from "react-router-dom";
import axios from "axios";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import StockBookPrint from "./StockBookPrint";
export default function StockBook() {
  const navigate = useNavigate();

  const [mode, setMode] = useState("code");
  const [showSummary, setShowSummary] = useState(false);
  const [startDate, setStartDate] = useState("2025-04-01");
  const [endDate, setEndDate] = useState("2026-03-31");
  const [bookSearch, setBookSearch] = useState("");

  const [availableGroups, setAvailableGroups] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]); 
  const [selectedLeft, setSelectedLeft] = useState(null);
  const [selectedRight, setSelectedRight] = useState(null);
  const [activeCompany, setActiveCompany] = useState(null);

  const fetchGroups = async () => {
    try {
      const res = await axios.get("https://publication.microtechsolutions.net.in/php/BookGroupget.php");
      const data = Array.isArray(res.data) ? res.data : [];
      
      // Updated to match your API keys
      const names = data.map(item => {
        return item.BookGroupName || item.GroupName || (typeof item === 'string' ? item : null);
      }).filter(Boolean);
      
      setAvailableGroups(names.filter(name => !selectedItems.includes(name)));
    } catch (err) {
      console.error("Group Fetch Error:", err);
    }
  };

  useEffect(() => {
    if (mode === "group") fetchGroups();
  }, [mode]);

  const handleModeChange = (newMode) => {
    setMode(newMode);
    setSelectedItems([]); 
    setSelectedLeft(null);
    setSelectedRight(null);
  };

  
useEffect(() => {
  const selected = localStorage.getItem("SelectedCompany");

  if (selected) {
    try {
      const parsedCompany = JSON.parse(selected);
      setActiveCompany(parsedCompany);
    } catch (e) {
      console.error("Company parse error", e);
    }
  }
}, []);


  const handleBookSearch = async () => {
    if (!bookSearch.trim()) return;
    try {
      const res = await axios.get(`https://publication.microtechsolutions.net.in/php/Bookcodeget.php?BookCode=${bookSearch}`);
      const data = res.data;
     const book = Array.isArray(data) ? data[0] : data;

if (book && book.BookName) {
  const newItem = {
    name: book.BookName,
    code: book.BookCode || book.BookId || book.Code || book.Book_Code
  };

  console.log("BOOK OBJECT:", newItem); // 🔥 DEBUG

  if (!newItem.code) {
    alert("Book Code missing from API");
    return;
  }

  const exists = selectedItems.find(x => x.code === newItem.code);

  if (!exists) {
    setSelectedItems(prev => [...prev, newItem]);
  }

  setBookSearch("");

    } else {
      alert("Book Code not found");
    }

  } catch (err) {
    console.error("Book Search Error:", err);
  }
};

  /* ===== TRANSFER LOGIC ===== */
  const moveOneRight = () => {
    if (!selectedLeft) return;
    setSelectedItems(prev => [...prev, selectedLeft]);
    setAvailableGroups(prev => prev.filter(x => x !== selectedLeft));
    setSelectedLeft(null);
  };

  const moveAllRight = () => {
    if (availableGroups.length === 0) return;
    setSelectedItems(prev => [...prev, ...availableGroups]);
    setAvailableGroups([]);
  };

 const moveOneLeft = () => {
  if (!selectedRight) return;

  if (mode === "group") {
    setAvailableGroups(prev => [...prev, selectedRight]);
    setSelectedItems(prev => prev.filter(x => x !== selectedRight));
  } else {
    setSelectedItems(prev => prev.filter(x => x.code !== selectedRight.code));
  }

  setSelectedRight(null);
};

  const moveAllLeft = () => {
    if (selectedItems.length === 0) return;
    if (mode === "group") setAvailableGroups(prev => [...prev, ...selectedItems]);
    setSelectedItems([]);
  };


  const reportRef = useRef(null);
  
    const [printing, setPrinting] = useState(false);
// ✅ ADD THIS STATE (top with others)
const [stockData, setStockData] = useState([]);

/* ================= PRINT ================= */
const formatDate = (date) => {
  if (!date) return "";
  const [year, month, day] = date.split("-");
  return `${day}-${month}-${year}`;
};
const handlePrint = async () => {
  if (selectedItems.length === 0) {
    alert("Please select at least one Book or Group");
    return;
  }

  setPrinting(true);

  try {
    const params = {
      fromdate: formatDate(startDate),
      todate: formatDate(endDate),

      bookCodewise:
        mode === "code"
          ? selectedItems.map(x => x.code).join(",")
          : false,

      bookGroupwise:
        mode === "group"
          ? selectedItems.join(",")
          : false,

      showSummary: showSummary,
    };

    const res = await axios.get(
      `https://publication.microtechsolutions.net.in/php/get/getStockDayBook.php?CompanyId=${activeCompany.Id}`,
      { params }
    );

    const apiData = res.data?.data || [];

    if (apiData.length === 0) {
      alert("No data found");
      return;
    }

    const doc = new jsPDF();

    let balance = 0;

    const tableData = apiData.map(row => {
      const inward = parseFloat(row.Inward || 0);
      const outward = parseFloat(row.Outward || 0);

      balance = balance + inward - outward;

      return [
        dayjs(row.Date).format("DD-MM-YYYY"),
        row["Ref. no."] || "-",
        row.Party || "-",
        row.Particulars || "-",
        inward,
        outward,
        balance,
      ];
    });

    autoTable(doc, {
      margin: { top: 30 },

      head: [["Date", "Ref No", "Party", "Particulars", "Inward", "Outward", "Balance"]],
      body: tableData,

      styles: {
        fontSize: 9,
      },

      headStyles: {
        fillColor: [220, 220, 220],
        textColor: 0,
      },

      columnStyles: {
        4: { halign: "right" },
        5: { halign: "right" },
        6: { halign: "right" },
      },

      // ✅ HEADER EVERY PAGE
      didDrawPage: () => {
        doc.setFontSize(14);
       doc.text(
  activeCompany?.CompanyName || "PHADKE BOOK HOUSE",
  105,
  10,
  { align: "center" }
);

doc.setFontSize(10);
doc.text(
  activeCompany?.Address1 || "",
  105,
  15,
  { align: "center" }
);
doc.setFontSize(11);
doc.text("Stock Book", 105, 20, { align: "center" });

doc.text(
  `From ${dayjs(startDate).format("DD-MM-YYYY")} To ${dayjs(endDate).format("DD-MM-YYYY")}`,
  105,
  26,
  { align: "center" }
);

        const pageNumber = doc.internal.getNumberOfPages();
        doc.setFontSize(9);
        doc.text(`Page ${pageNumber}`, 200, 10, { align: "right" });
      },
    });

    window.open(doc.output("bloburl"), "_blank");

  } catch (error) {
    console.error("PDF Error:", error);
  } finally {
    setPrinting(false);
  }
};

  const fieldSet = {
    border: "1px solid #ccc",
    p: 2,
    position: "relative",
    borderRadius: 1,
    bgcolor: "#fcfcfc"
  };

  const legend = {
    position: "absolute",
    top: -12,
    left: 10,
    bgcolor: "#f8f9fa",
    px: 0.5,
    fontSize: "0.75rem",
    fontWeight: "bold",
    color: "#555"
  };

 return (
  <Box sx={{ 
    minHeight: "90vh", 
    background: "#f0f2f5", 
    display: "flex", 
    justifyContent: "center", 
    alignItems: "center" ,
 
  }}>
    <Paper 
      elevation={4} 
      sx={{ 
        width: "100%",
        maxWidth: 900, 
        maxHeight: "75vh", 
        overflowY: "auto",  
padding:4,
        border: "1px solid #bbb",
         bgcolor: "#f8f9fa",
        display: "flex",
        flexDirection: "column"
      }}
    >
     <Typography 
             variant="h6" 
             fontWeight={700} 
            sx={{ variant:'h6', textAlign:'center', fontWeight: 700, color: '#1a237e', mb:1}}
           >
             Stock Book
           </Typography>

      <Grid container spacing={2}>
        {/* Mode Selection */}
        <Grid item xs={12} md={4}>
          <Box sx={fieldSet}>
              <Typography sx={legend}>Select Mode</Typography>
              <RadioGroup value={mode} onChange={e => handleModeChange(e.target.value)}>
                  <FormControlLabel value="code" control={<Radio size="small"/>} label="Book Code wise" />
                  <FormControlLabel value="group" control={<Radio size="small"/>} label="Book Group wise" />
              </RadioGroup>
          </Box>
        </Grid>

        {/* Options */}
        <Grid item xs={12} md={3}>
          <Box sx={{ ...fieldSet, height: '50px', display: 'flex', alignItems: 'center' }}>
              <Typography sx={legend}>Options</Typography>
              <FormControlLabel
                control={<Checkbox size="small" checked={showSummary} onChange={e => setShowSummary(e.target.checked)} />}
                label="Show Summary"
              />
          </Box>
        </Grid>

        {/* Period Selection */}
        <Grid item xs={12} md={5}>
          <Box sx={fieldSet}>
              <Typography sx={legend}>For Period</Typography>
              <Stack spacing={1}>
                  <Stack direction="row" spacing={1} alignItems="center">
                      <Typography variant="caption" sx={{ width: 80 }}>Start Date</Typography>
                      <TextField type="date" size="small" fullWidth value={startDate} onChange={e => setStartDate(e.target.value)} />
                  </Stack>
                  <Stack direction="row" spacing={1} alignItems="center">
                      <Typography variant="caption" sx={{ width: 80 }}>End Date</Typography>
                      <TextField type="date" size="small" fullWidth value={endDate} onChange={e => setEndDate(e.target.value)} />
                  </Stack>
              </Stack>
          </Box>
        </Grid>

        {/* Main Selection Area */}
        <Grid item xs={12}>
          <Grid container spacing={2} alignItems="center">
            {/* Left Side: Search or Groups */}
            <Grid item xs={12} md={5}>
              {mode === "group" ? (
                <Box sx={fieldSet}>
                  <Typography sx={legend}>List of Book Groups</Typography>
                  <Paper variant="outlined" sx={{ height: 200, overflow: "auto" }}>
                    <List dense>
                      {availableGroups.map((group, idx) => (
                        <ListItemButton key={`left-${idx}`} selected={selectedLeft === group} onClick={() => setSelectedLeft(group)}>
                          <ListItemText primary={group} />
                        </ListItemButton>
                      ))}
                    </List>
                  </Paper>
                </Box>
              ) : (
                <Box sx={{ ...fieldSet, height: 200, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                  <Typography sx={legend}>Book Search</Typography>
                  <Typography variant="body2" sx={{ mb: 1, fontWeight: 'bold' }}>Enter Book Code:</Typography>
                  <Stack direction="row" spacing={1}>
                      <TextField 
                          fullWidth size="small" 
                          autoFocus
                          placeholder="Type code..." 
                          value={bookSearch}
                          onChange={e => setBookSearch(e.target.value)}
                          onKeyDown={e => e.key === 'Enter' && handleBookSearch()}
                      />
                      <Button variant="contained" color="primary" onClick={handleBookSearch}><ArrowForwardIcon /></Button>
                  </Stack>
                </Box>
              )}
            </Grid>

            {/* Transfer Buttons */}
            <Grid item xs={12} md={1}>
              <Stack direction={{ xs: 'row', md: 'column' }} spacing={1} justifyContent="center" alignItems="center">
                <IconButton size="small" sx={{ border: "1px solid #ccc" }} onClick={moveOneRight} disabled={mode === 'code' || !selectedLeft}><ArrowForwardIcon fontSize="small"/></IconButton>
                <IconButton size="small" sx={{ border: "1px solid #ccc" }} onClick={moveAllRight} disabled={mode === 'code' || availableGroups.length === 0}><KeyboardDoubleArrowRightIcon fontSize="small"/></IconButton>
                <IconButton size="small" sx={{ border: "1px solid #ccc" }} onClick={moveOneLeft} disabled={!selectedRight}><ArrowBackIcon fontSize="small"/></IconButton>
                <IconButton size="small" sx={{ border: "1px solid #ccc" }} onClick={moveAllLeft} disabled={selectedItems.length === 0}><KeyboardDoubleArrowLeftIcon fontSize="small"/></IconButton>
              </Stack>
            </Grid>

            {/* Right Side: Selected Items */}
            <Grid item xs={12} md={6}>
              <Box sx={fieldSet}>
                <Typography sx={legend}>{mode === 'code' ? 'Selected Book(s)' : 'Selected Book Group(s)'}</Typography>
                <Paper variant="outlined" sx={{ height: 200, overflow: "auto", bgcolor: '#fff' }}>
                  <List dense>
                    {selectedItems.map((item, idx) => (
                      <ListItemButton key={`right-${idx}`} selected={selectedRight === item} onClick={() => setSelectedRight(item)}>
                     <ListItemText primary={typeof item === "string" ? item : item.name} />
                      </ListItemButton>
                    ))}
                  </List>
                </Paper>
              </Box>
            </Grid>
          </Grid>
        </Grid>
      </Grid>

      <Divider sx={{ my: 2 }} />

      {/* Action Buttons */}
      <Stack direction="row" spacing={2} justifyContent="center" sx={{ pb: 1 }}>
        <Button 
          variant="contained" 
          startIcon={<PrintIcon />} 
          onClick={handlePrint} 
          sx={{ px: { xs: 2, md: 5 }, bgcolor: "#2e7d32", "&:hover": { bgcolor: "#1b5e20" } }}
        >
          Print Report
        </Button>
        <Button 
          variant="contained" 
          color="error" 
          startIcon={<CloseIcon />} 
          onClick={() => navigate(-1)} 
          sx={{ px: { xs: 2, md: 5 } }}
        >
          Close
        </Button>
      </Stack>
    </Paper>


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
        <StockBookPrint 
  data={stockData}   // ✅ ADD THIS
  filters={{ startDate, endDate }} 
/>

      </div>
    </Box>
  </Box>
)
}




















































































