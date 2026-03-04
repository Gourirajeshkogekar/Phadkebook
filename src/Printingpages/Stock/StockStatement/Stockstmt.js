import { useState, useEffect, useRef } from "react";
import {
  Box, Paper, Typography, Grid, TextField, RadioGroup,
  FormControlLabel, Radio, Checkbox, Button, MenuItem,
  Stack, Divider
} from "@mui/material";
import PrintIcon from "@mui/icons-material/Print";
import CloseIcon from "@mui/icons-material/Close";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import StockStatementPrint from "./StockstmtPrint";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

export default function StockStatement() {
  const navigate = useNavigate();

  // API Data States
  const [publications, setPublications] = useState([]);
  const [standards, setStandards] = useState([]);
  const [bookGroups, setBookGroups] = useState([]);
  const [books, setBooks] = useState([]);
  const [bookSearchCode, setBookSearchCode] = useState("");

  // Selection States
  const [startDate, setStartDate] = useState("2025-04-01");
  const [endDate, setEndDate] = useState("2026-03-31");
  const [publicationMode, setPublicationMode] = useState("all");
  const [selectedPublication, setSelectedPublication] = useState("");
  const [bookStandardMode, setBookStandardMode] = useState("all");
  const [selectedStandard, setSelectedStandard] = useState("");
  const [bookGroupMode, setBookGroupMode] = useState("all");
  const [closingOnly, setClosingOnly] = useState(false);
  const [selectedGroups, setSelectedGroups] = useState({});
  const [selectedBook, setSelectedBook] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [pubRes, stdRes, grpRes, bookRes] = await Promise.all([
          axios.get("https://publication.microtechsolutions.net.in/php/Publicationget.php"),
          axios.get("https://publication.microtechsolutions.net.in/php/Standardget.php"),
          axios.get("https://publication.microtechsolutions.net.in/php/BookGroupget.php"),
          axios.get("https://publication.microtechsolutions.net.in/php/Bookcodeget.php?BookCode=")
        ]);
        setPublications(pubRes.data || []);
        setStandards(stdRes.data || []);
        setBookGroups(grpRes.data || []);
        setBooks(bookRes.data || []);
      } catch (err) {
        console.error("Data Fetch Error:", err);
      }
    };
    fetchData();
  }, []);

  const handleBookSearch = async (e) => {
    if (e.key === "Enter") {
      const res = await axios.get(`https://publication.microtechsolutions.net.in/php/Bookcodeget.php?BookCode=${bookSearchCode}`);
      setBooks(res.data || []);
    }
  };

  const toggleGroup = (name) => {
    setSelectedGroups(prev => ({ ...prev, [name]: !prev[name] }));
  };

  const reportRef = useRef(null);
  const [printing, setPrinting] = useState(false);

  const handlePrint = async () => {
    setPrinting(true);
    setTimeout(async () => {
      try {
        const element = reportRef.current;
        if (!element) return;
        const canvas = await html2canvas(element, { scale: 2, useCORS: true, logging: false });
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

  // --- Styled Components Logic ---
  const fieldSet = {
    border: "1px solid #d1d9e6",
    p: "6px",
    mt: 1,
    position: "relative",
    borderRadius: "8px",
    bgcolor: "#ffffff",
    boxShadow: "0 1px 3px rgba(0,0,0,0.02)"
  };

  const legend = {
    position: "absolute",
    top: -12,
    left: 12,
    bgcolor: "#f8f9fa",
    px: 1,
    fontSize: "0.75rem",
    fontWeight: "600",
    color: "#3f51b5",
    textTransform: "uppercase",
    letterSpacing: "0.5px"
  };

  const smallText = { fontSize: '13px', color: '#555' };

  return (
    <Box sx={{ height: "90vh", background: "#f0f2f5", display: "flex", justifyContent: "center", alignItems: "center", overflow: "hidden" }}>
      <Paper elevation={0} sx={{ width: 850,  borderRadius: "6px", border: "1px solid #e0e0e0", bgcolor: "#f8f9fa", boxShadow: '0 10px 25px rgba(0,0,0,0.05)' }}>
        
        <Box sx={{ mb: 1}}>
          <Typography variant="h6" sx={{ fontWeight: "700", textAlign: "center", color: "#1a237e", letterSpacing: '-0.5px' }}>
            Stock Statement
          </Typography>
          <Divider sx={{ mt: 1,   width: '40px', mx: 'auto', borderBottomWidth: 3, borderColor: '#3f51b5', borderRadius: 1 }} />
        </Box>

        {/* Period Section */}
        <Box sx={fieldSet}>
          <Typography sx={legend}>Period Selection</Typography>
          <Grid container spacing={3} alignItems="center">
            <Grid item xs={3.5}><Stack direction="row" spacing={1} alignItems="center">
              <Typography sx={smallText}>From</Typography>
              <TextField type="date" size="small" fullWidth value={startDate} onChange={e => setStartDate(e.target.value)} InputProps={{ sx: { height: 32, fontSize: '12px', borderRadius: '6px' }}} />
            </Stack></Grid>
            <Grid item xs={3.5}><Stack direction="row" spacing={1} alignItems="center">
              <Typography sx={smallText}>To</Typography>
              <TextField type="date" size="small" fullWidth value={endDate} onChange={e => setEndDate(e.target.value)} InputProps={{ sx: { height: 32, fontSize: '12px', borderRadius: '6px' }}} />
            </Stack></Grid>
            <Grid item xs={5} sx={{ textAlign: 'right' }}>
              <FormControlLabel control={<Checkbox size="small" checked={closingOnly} onChange={e => setClosingOnly(e.target.checked)} color="primary" />} 
                label={<Typography sx={{ fontSize: '12px', fontWeight: 500 }}>Print Only Closing Stock?</Typography>} />
            </Grid>
          </Grid>
        </Box>

        <Grid container spacing={2}>
          <Grid item xs={6}>
            {/* Publication Select */}
            <Box sx={fieldSet}>
              <Typography sx={legend}>Publications</Typography>
              <RadioGroup row value={publicationMode} onChange={e => setPublicationMode(e.target.value)} sx={{ mb: 1 }}>
                <FormControlLabel value="all" control={<Radio size="small" />} label={<Typography sx={smallText}>All</Typography>} />
                <FormControlLabel value="selected" control={<Radio size="small" />} label={<Typography sx={smallText}>Selected</Typography>} />
              </RadioGroup>
              <TextField select fullWidth size="small" disabled={publicationMode === "all"} value={selectedPublication} onChange={(e) => setSelectedPublication(e.target.value)} SelectProps={{ sx: { height: 32, fontSize: '12px' }}}>
                {publications.map((p) => (
                  <MenuItem key={p.PublicationName} value={p.PublicationName} sx={{ fontSize: '12px' }}>{p.PublicationName}</MenuItem>
                ))}
              </TextField>
            </Box>

            {/* Standard Select */}
            <Box sx={fieldSet}>
              <Typography sx={legend}>Book Standard</Typography>
              <RadioGroup row value={bookStandardMode} onChange={e => setBookStandardMode(e.target.value)} sx={{ mb: 1 }}>
                <FormControlLabel value="all" control={<Radio size="small" />} label={<Typography sx={smallText}>All</Typography>} />
                <FormControlLabel value="selected" control={<Radio size="small" />} label={<Typography sx={smallText}>Selected</Typography>} />
              </RadioGroup>
              <TextField select fullWidth size="small" disabled={bookStandardMode === "all"} value={selectedStandard} onChange={(e) => setSelectedStandard(e.target.value)} SelectProps={{ sx: { height: 32, fontSize: '12px' }}}>
                {standards.map((s) => (
                  <MenuItem key={s.StandardName} value={s.StandardName} sx={{ fontSize: '12px' }}>{s.StandardName}</MenuItem>
                ))}
              </TextField>
            </Box>
          </Grid>

          <Grid item xs={6}>
            {/* Group Selection */}
            <Box sx={{ ...fieldSet, height: '150px' }}>
              <Typography sx={legend}>Book Group</Typography>
              <RadioGroup row value={bookGroupMode} onChange={e => setBookGroupMode(e.target.value)} sx={{ mb: 1 }}>
                <FormControlLabel value="all" control={<Radio size="small" />} label={<Typography sx={smallText}>All</Typography>} />
                <FormControlLabel value="selected" control={<Radio size="small" />} label={<Typography sx={smallText}>Selected</Typography>} />
              </RadioGroup>
              <Box sx={{ p: 1, height: 80, overflowY: 'auto', border: '1px solid #eef2f6', borderRadius: '6px', bgcolor: '#fff' }}>
                <Grid container>
                  {bookGroups.map((grp) => (
                    <Grid item xs={6} key={grp.BookGroupName}>
                      <FormControlLabel control={<Checkbox size="small" checked={!!selectedGroups[grp.BookGroupName]} 
                        onChange={() => toggleGroup(grp.BookGroupName)} disabled={bookGroupMode === 'all'} />}
                        label={<Typography sx={{fontSize: '11px'}}>{grp.BookGroupName}</Typography>} />
                    </Grid>
                  ))}
                </Grid>
              </Box>
            </Box>
          </Grid>
        </Grid>

        {/* Book Selection */}
        <Box sx={fieldSet}>
          <Typography sx={legend}>Book Selection</Typography>
          <TextField 
            placeholder="Search by Code (Press Enter)" 
        size="small" 
            value={bookSearchCode}
            onChange={(e) => setBookSearchCode(e.target.value)}
            onKeyDown={handleBookSearch}
            variant="outlined"
            sx={{ mb: 1, '& .MuiInputBase-root': { height:25, fontSize: '12px', borderRadius: '6px' } }}
          />
          <Box sx={{ height: 75, overflow: 'auto', border: '1px solid #eef2f6', borderRadius: '6px' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12px', fontFamily: 'sans-serif' }}>
              <thead style={{ position: 'sticky', top: 0, background: '#5d72eb', color: 'white', zIndex: 1 }}>
                <tr>
                  <th style={{ textAlign: 'left', padding: '8px 12px', width: '20%' }}>Code</th>
                  <th style={{ textAlign: 'left', padding: '8px 12px' }}>Book Name</th>
                </tr>
              </thead>
              <tbody>
                {books.map((b, i) => (
                  <tr key={i} onClick={() => setSelectedBook(b)} 
                      style={{ cursor: 'pointer', background: selectedBook?.BookCode === b.BookCode ? '#e8eaf6' : (i % 2 === 0 ? '#fff' : '#fafafa'), borderBottom: '1px solid #f0f0f0', transition: '0.2s' }}>
                    <td style={{ padding: '6px 12px', fontWeight: '600', color: '#3f51b5' }}>{b.BookCode}</td>
                    <td style={{ padding: '6px 12px', color: '#333' }}>{b.BookName}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Box>
        </Box>

        <Stack direction="row" spacing={2} justifyContent="center" sx={{ mt: 1}}>
          <Button variant="contained" disabled={printing} startIcon={<PrintIcon />} onClick={handlePrint} 
            sx={{ bgcolor: "#3f51b5", color: "#fff", textTransform: 'none', px: 4, borderRadius: '8px', fontWeight: '600', '&:hover': {bgcolor: '#303f9f'} }}>
            {printing ? "Preparing..." : "Print Report"}
          </Button>
          <Button variant="outlined" color="error" startIcon={<CloseIcon />} onClick={() => navigate(-1)} 
            sx={{ textTransform: 'none', px: 4, borderRadius: '8px', fontWeight: '600' }}>
            Close
          </Button>
        </Stack>
      </Paper>

      {/* Hidden printing area */}
      <Box sx={{ position: "absolute", top: "-10000px", left: "-10000px" }}>
        <div ref={reportRef}>
          <StockStatementPrint state={{ startDate, endDate }} />
        </div>
      </Box>
    </Box>
  );
}