import { useEffect, useState, useRef } from "react";
import axios from "axios";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

import {
  Box,
  Paper,
  Typography,
  TextField,
  Checkbox,
  FormControlLabel,
  Radio,
  RadioGroup,
  Button,
  Stack,
  Select,
  MenuItem,
 Autocomplete, Grid
} from "@mui/material";

import PrintIcon from "@mui/icons-material/Print";
import CloseIcon from "@mui/icons-material/Close";

export default function BookPurchaseReport() {

  const reportRef = useRef();
  const [printing, setPrinting] = useState(false);
  const [standards, setStandards] = useState([]);
const [selectedStandard, setSelectedStandard] = useState(null);

  /* ================= FINANCIAL YEAR DEFAULT ================= */

  const getFinancialYear = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = today.getMonth() + 1;

    let startYear = month >= 4 ? year : year - 1;
    let endYear = startYear + 1;

    return {
      start: `${startYear}-04-01`,
      end: `${endYear}-03-31`
    };
  };

  const fy = getFinancialYear();

  /* ================= STATE ================= */

  const [startDate, setStartDate] = useState(fy.start);
  const [endDate, setEndDate] = useState(fy.end);

  const [accounts, setAccounts] = useState([]);
  const [groups, setGroups] = useState([]);
  const [cities, setCities] = useState([]);

  const [partyMode, setPartyMode] = useState("all");
  const [standardMode, setStandardMode] = useState("all");
  const [groupMode, setGroupMode] = useState("all");

  const [selectedCity, setSelectedCity] = useState("");
  const [partyBookwise, setPartyBookwise] = useState(false);

  const [bookCode, setBookCode] = useState("");
  const [bookList, setBookList] = useState([]);
 
  /* ================= FETCH APIs ================= */

  useEffect(() => {
    axios.get("https://publication.microtechsolutions.net.in/php/Accountget.php")
      .then(res => setAccounts(res.data || []));

    axios.get("https://publication.microtechsolutions.net.in/php/BookGroupget.php")
      .then(res => setGroups(res.data || []));

    axios.get("https://publication.microtechsolutions.net.in/php/Cityget.php")
      .then(res => setCities(res.data || []));
  }, []);

  /* ================= BOOK SEARCH ================= */

  const handleBookSearch = async () => {
    if (!bookCode) return;

    const res = await axios.get(
      `https://publication.microtechsolutions.net.in/php/Bookcodeget.php?BookCode=${bookCode}`
    );

    setBookList(res.data || []);
  };

  const handleEnter = (e) => {
    if (e.key === "Enter") handleBookSearch();
  };

  /* ================= PRINT FUNCTION ================= */

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

      } catch (error) {
        console.error("PDF Error:", error);
      } finally {
        setPrinting(false);
      }
    }, 500);
  };

  /* ================= UI STYLE ================= */

  // Refined sectionBox for a tighter look
  const sectionBox = {
    border: "1px solid #dcdcdc",
    borderRadius: 1,
    p: 1, // Reduced from standard padding
    background: "#ffffff",
  };

  return (
    <Box sx={{ p: 1.5, bgcolor: "#f4f6f9", minHeight: "100vh" }}>
      <Typography variant="h6" sx={{ fontSize: '1.1rem', mb: 1, fontWeight: 700, color: '#1a237e' }}>
        Book Purchase Report
      </Typography>

      {/* ================= PERIOD ================= */}
      <Paper sx={{ ...sectionBox, mb: 1, py: 0.5 }}>
        <Stack direction="row" spacing={2} alignItems="center">
          <Typography fontSize={13} fontWeight={600}>Period:</Typography>
          <TextField
            type="date"
            size="small"
            variant="standard"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />
          <Typography fontSize={13}>To</Typography>
          <TextField
            type="date"
            size="small"
            variant="standard"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
          />
        </Stack>
      </Paper>

      {/* ================= MAIN GRID ================= */}
      <Grid container spacing={1}>
        
        {/* LEFT COLUMN */}
        <Grid item xs={12} md={6}>
          <Stack spacing={1}>
            {/* PARTY */}
            <Paper sx={sectionBox}>
              <Typography fontSize={12} fontWeight={700} color="primary">Party Selection</Typography>
              <RadioGroup row value={partyMode} onChange={(e) => setPartyMode(e.target.value)}>
                <FormControlLabel value="all" control={<Radio size="small" />} label={<Typography fontSize={12}>All Parties</Typography>} />
                <FormControlLabel value="selected" control={<Radio size="small" />} label={<Typography fontSize={12}>Selected</Typography>} />
              </RadioGroup>
              <FormControlLabel
                control={<Checkbox size="small" checked={partyBookwise} onChange={(e) => setPartyBookwise(e.target.checked)} />}
                label={<Typography fontSize={11}>Partywise, Bookwise?</Typography>}
              />
            </Paper>

            {/* BOOK STANDARD */}
            <Paper sx={sectionBox}>
              <Typography fontSize={12} fontWeight={700} color="primary">Book Standard</Typography>
              <RadioGroup row value={standardMode} onChange={(e) => setStandardMode(e.target.value)}>
                <FormControlLabel value="all" control={<Radio size="small" />} label={<Typography fontSize={12}>All</Typography>} />
                <FormControlLabel value="selected" control={<Radio size="small" />} label={<Typography fontSize={12}>Selected</Typography>} />
              </RadioGroup>
              {standardMode === "selected" && (
                <Autocomplete
                  size="small"
                  fullWidth
                  options={standards}
                  getOptionLabel={(o) => o.StandardName || ""}
                  value={selectedStandard}
                  onChange={(e, v) => setSelectedStandard(v)}
                  renderInput={(params) => <TextField {...params} size="small" placeholder="Select Standard" sx={{ mt: 0.5 }} />}
                />
              )}
            </Paper>
          </Stack>
        </Grid>

        {/* RIGHT COLUMN */}
        <Grid item xs={12} md={6}>
          <Stack spacing={1}>
            {/* BOOK GROUP - Constrained height with Grid layout */}
            <Paper sx={sectionBox}>
              <Typography fontSize={12} fontWeight={700} color="primary">Book Group</Typography>
              <RadioGroup row value={groupMode} onChange={(e) => setGroupMode(e.target.value)}>
                <FormControlLabel value="all" control={<Radio size="small" />} label={<Typography fontSize={12}>All Group</Typography>} />
                <FormControlLabel value="selected" control={<Radio size="small" />} label={<Typography fontSize={12}>Selected</Typography>} />
              </RadioGroup>
              <Box sx={{ height: '75px', overflowY: 'auto', mt: 0.5, border: '1px solid #f0f0f0', p: 0.5 }}>
                <Grid container>
                  {groups.map((group, index) => (
                    <Grid item xs={6} key={index}>
                      <FormControlLabel 
                        control={<Checkbox size="small" sx={{ p: 0.5 }} />} 
                        label={<Typography fontSize={11}>{group.BookGroupName}</Typography>} 
                      />
                    </Grid>
                  ))}
                </Grid>
              </Box>
            </Paper>

            {/* DISTRICT */}
            <Paper sx={sectionBox}>
              <Typography fontSize={12} fontWeight={700} color="primary">District</Typography>
              <Select fullWidth size="small" value={selectedCity} onChange={(e) => setSelectedCity(e.target.value)} sx={{ mt: 0.5 }}>
                {cities.map((city, index) => (
                  <MenuItem key={index} value={city.CityName} sx={{ fontSize: 12 }}>{city.CityName}</MenuItem>
                ))}
              </Select>
            </Paper>
          </Stack>
        </Grid>

        {/* BOOK SELECTION - Full width at bottom but limited height */}
     {/* BOOK SELECTION - Refined Table Design */}
<Grid item xs={12}>
  <Paper sx={{ ...sectionBox, border: "1px solid #3f51b5" }}> {/* Blue accent border */}
    <Typography fontSize={12} fontWeight={700} color="primary" mb={0.5}>
      Book Selection
    </Typography>
    
    <Box sx={{ display: 'flex', padding: '2px', gap: 2, alignItems: 'start' }}>
      {/* Input Field */}
      <TextField
        size="small"
        placeholder="Enter Book Code..."
        value={bookCode}
        onChange={(e) => setBookCode(e.target.value)}
        onKeyDown={handleEnter}
        sx={{ 
          width: '200px',
          '& .MuiInputBase-input': { fontSize: '12px', py: '6px' } 
        }}
      />

      {/* Modern Table Container */}
      <Box sx={{ 
        border: "1px solid #ddd", 
        height: 90, 
        width: '100%', 
        overflowY: "auto",
        borderRadius: '4px',
        boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.1)'
      }}>
        <table width="100%" style={{ fontSize: "11px", borderCollapse: 'collapse', fontFamily: 'sans-serif' }}>
          <thead style={{ 
            background: '#3f51b5', // Professional Blue
            color: 'white', 
            position: 'sticky', 
            top: 0,
            zIndex: 1 
          }}>
            <tr>
              <th style={{ padding: '6px', borderRight: '1px solid #ffffff33', textAlign: 'center', width: '20%' }}>Code</th>
              <th style={{ padding: '6px', textAlign: 'left', width: '80%' }}>Book Description</th>
            </tr>
          </thead>
          <tbody>
            {bookList.length > 0 ? (
              bookList.map((book, index) => (
                <tr key={index} style={{ 
                  backgroundColor: index % 2 === 0 ? '#ffffff' : '#f9faff', // Zebra stripes
                  borderBottom: '1px solid #eee'
                }}>
                  <td style={{ 
                    padding: '5px', 
                    textAlign: 'center', 
                    fontWeight: 'bold',
                    color: '#333',
                    borderRight: '1px solid #eee'
                  }}>
                    {book.BookCode}
                  </td>
                  <td style={{ padding: '5px 10px', color: '#444' }}>
                    {book.BookName}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="2" style={{ textAlign: 'center', padding: '10px', color: '#999', fontStyle: 'italic' }}>
                  No books selected. Search by code above.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </Box>
    </Box>
  </Paper>
</Grid>
      </Grid>

      {/* ================= BUTTONS ================= */}
      <Stack direction="row" spacing={2} justifyContent="center" mt={2}>
        <Button variant="contained" size="small" color="success" startIcon={<PrintIcon />} onClick={handlePrint} sx={{ px: 4 }}>
          Print Report
        </Button>
        <Button variant="contained" size="small" color="error" startIcon={<CloseIcon />} sx={{ px: 4 }}>
          Close
        </Button>
      </Stack>

      {/* ================= PRINT STRUCTURE ================= */}
      <div style={{ position: "absolute", left: "-9999px" }}>
        <div
          ref={reportRef}
          style={{
            width: "794px",
            minHeight: "1123px",
            padding: "40px",
            fontFamily: "serif",
            fontSize: "12px",
            background: "#fff"
          }}
        >
          <div style={{ textAlign: "center", fontWeight: "bold", fontSize: "16px" }}>
            M. V. Phadke & Co. Kolhapur
          </div>

          <div style={{ textAlign: "center", marginTop: "5px" }}>
            Book Purchase Report
          </div>

          <div style={{ textAlign: "center", marginTop: "5px" }}>
            From {startDate} To {endDate}
          </div>

          <hr />

          <table width="100%" border="1" cellPadding="5">
            <thead>
              <tr>
                <th>Sr No</th>
                <th>Book Code</th>
                <th>Book Name</th>
              </tr>
            </thead>
            <tbody>
              {bookList.map((book, index) => (
                <tr key={index}>
                  <td>{index + 1}</td>
                  <td>{book.BookCode}</td>
                  <td>{book.BookName}</td>
                </tr>
              ))}
            </tbody>
          </table>

        </div>
      </div>

    </Box>
  );
}