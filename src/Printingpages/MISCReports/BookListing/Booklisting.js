import { useState, useEffect, useRef } from "react";
import {
  Box,
  Paper,
  Typography,
  Grid,
  TextField,
  MenuItem,
  Checkbox,
  FormControlLabel,
  Button,
  Divider,
  Stack
} from "@mui/material";
import PrintIcon from "@mui/icons-material/Print";
import CloseIcon from "@mui/icons-material/Close";
import { useNavigate } from "react-router-dom";

import axios from "axios";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

export default function BookListing() {

  const navigate = useNavigate();
  const reportRef = useRef(null);

  // Dropdown Data
  const [publications, setPublications] = useState([]);
  const [bookGroups, setBookGroups] = useState([]);
  const [standards, setStandards] = useState([]);
  const [paperSizes, setPaperSizes] = useState([]);
  const [presses, setPresses] = useState([]);

  // Selected Values
  const [publication, setPublication] = useState("");
  const [bookGroup, setBookGroup] = useState("");
  const [standard, setStandard] = useState("");
  const [paperSize, setPaperSize] = useState("");
  const [press, setPress] = useState("");

  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const [printConsumption, setPrintConsumption] = useState(false);
  const [paperWastage, setPaperWastage] = useState("");
  const [bookCode, setBookCode] = useState("");
  const [pressDateWise, setPressDateWise] = useState(false);

  const tf = { size: "small", fullWidth: true };

  // Financial Year Default
  useEffect(() => {
    const today = new Date();
    const year = today.getFullYear();
    const month = today.getMonth() + 1;

    let startFY, endFY;

    if (month >= 4) {
      startFY = new Date(year, 3, 1);
      endFY = new Date(year + 1, 2, 31);
    } else {
      startFY = new Date(year - 1, 3, 1);
      endFY = new Date(year, 2, 31);
    }

    setStartDate(startFY.toISOString().split("T")[0]);
    setEndDate(endFY.toISOString().split("T")[0]);
  }, []);

  // APIs
  useEffect(() => {
    axios.get("https://publication.microtechsolutions.net.in/php/Publicationget.php")
      .then(res => setPublications(res.data || []));

    axios.get("https://publication.microtechsolutions.net.in/php/BookGroupget.php")
      .then(res => setBookGroups(res.data || []));

    axios.get("https://publication.microtechsolutions.net.in/php/Standardget.php")
      .then(res => setStandards(res.data || []));

    axios.get("https://publication.microtechsolutions.net.in/php/Papersizeget.php")
      .then(res => setPaperSizes(res.data || []));

    axios.get("https://publication.microtechsolutions.net.in/php/PressMasterget.php")
      .then(res => setPresses(res.data || []));
  }, []);

  // PRINT FUNCTION
 const handlePrint = async () => {

  const element = reportRef.current;
  if (!element) return;

  element.style.display = "block";

  const canvas = await html2canvas(element, {
    scale: 1.5,   // reduced scale (important)
    useCORS: true
  });

  const imgData = canvas.toDataURL("image/png");

  const pdf = new jsPDF("p", "mm", "a4");

  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();

  pdf.addImage(imgData, "PNG", 0, 0, pageWidth, pageHeight);

  window.open(pdf.output("bloburl"), "_blank");

  element.style.display = "none";
};


return (
    <Box sx={{ minHeight: "90vh", bgcolor: "#eef2f6", display: 'flex', alignItems: 'center', p: 2 }}>
      
      <Box sx={{ width: "100%", maxWidth: 1000, mx: "auto" }}>
        
        <Typography variant="h6" textAlign='center'  fontWeight={700} mb={2} color="#1a237e">
          Book Listing
        </Typography>

        <Paper sx={{ p: 3, borderRadius: 2, boxShadow: 4 }}>
          <Grid container spacing={4}>
            
            {/* LEFT PART: Main Selections */}
            <Grid item xs={12} md={6}>
              <Typography variant="subtitle2" color="primary" fontWeight={700} gutterBottom>
                FILTERS
              </Typography>
              <Stack spacing={2.5} mt={1}>
                <TextField select label="Publication" {...tf} value={publication} onChange={e => setPublication(e.target.value)}>
                  <MenuItem value="">Select</MenuItem>
                  {publications.map((p, i) => <MenuItem key={i} value={p.PublicationName}>{p.PublicationName}</MenuItem>)}
                </TextField>

                <TextField select label="Book Group" {...tf} value={bookGroup} onChange={e => setBookGroup(e.target.value)}>
                  <MenuItem value="">Select</MenuItem>
                  {bookGroups.map((g, i) => <MenuItem key={i} value={g.BookGroupName}>{g.BookGroupName}</MenuItem>)}
                </TextField>

                <TextField select label="Book Standard" {...tf} value={standard} onChange={e => setStandard(e.target.value)}>
                  <MenuItem value="">Select</MenuItem>
                  {standards.map((s, i) => <MenuItem key={i} value={s.StandardName}>{s.StandardName}</MenuItem>)}
                </TextField>

                <TextField select label="Paper Size" {...tf} value={paperSize} onChange={e => setPaperSize(e.target.value)}>
                  <MenuItem value="">Select</MenuItem>
                  {paperSizes.map((ps, i) => <MenuItem key={i} value={ps.PaperSizeName}>{ps.PaperSizeName}</MenuItem>)}
                </TextField>

                <TextField select label="Press" {...tf} value={press} onChange={e => setPress(e.target.value)}>
                  <MenuItem value="">Select</MenuItem>
                  {presses.map((pr, i) => <MenuItem key={i} value={pr.PressName}>{pr.PressName}</MenuItem>)}
                </TextField>
              </Stack>
            </Grid>

            {/* RIGHT PART: Parameters & Dates */}
            <Grid item xs={12} md={6}>
              <Typography variant="subtitle2" color="primary" fontWeight={700} gutterBottom>
                REPORT PARAMETERS
              </Typography>

              <Box sx={{ mt: 1, p: 2, border: "1px solid #d1d9e6", borderRadius: 2, bgcolor: "#f8faff" }}>
                <Typography fontWeight={600} mb={1.5} fontSize={13}>Publication Date</Typography>
                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <TextField type="date" label="Start" {...tf} InputLabelProps={{ shrink: true }} value={startDate} onChange={e => setStartDate(e.target.value)} />
                  </Grid>
                  <Grid item xs={6}>
                    <TextField type="date" label="End" {...tf} InputLabelProps={{ shrink: true }} value={endDate} onChange={e => setEndDate(e.target.value)} />
                  </Grid>
                </Grid>
              </Box>

              <Box sx={{ mt: 2, p: 2, border: "1px solid #d1d9e6", borderRadius: 2 }}>
                <FormControlLabel
                  control={<Checkbox size="small" checked={printConsumption} onChange={e => setPrintConsumption(e.target.checked)} />}
                  label={<Typography variant="body2">Print Consumption ?</Typography>}
                />
                
                <Grid container spacing={2} sx={{ mt: 0.5 }}>
                  <Grid item xs={6}>
                    <TextField label="Paper Wastage %" {...tf} value={paperWastage} onChange={e => setPaperWastage(e.target.value)} />
                  </Grid>
                  <Grid item xs={6}>
                    <TextField label="Book Code ?" {...tf} value={bookCode} onChange={e => setBookCode(e.target.value)} />
                  </Grid>
                </Grid>

                <FormControlLabel
                  sx={{ mt: 1.5 }}
                  control={<Checkbox size="small" checked={pressDateWise} onChange={e => setPressDateWise(e.target.checked)} />}
                  label={<Typography variant="body2">Press wise-Date wise Report ?</Typography>}
                />
              </Box>

              {/* ACTION BUTTONS */}
              <Stack direction="row" spacing={2} mt={4}>
                <Button variant="contained" fullWidth startIcon={<PrintIcon />} onClick={handlePrint} sx={{ height: 45, bgcolor: "#1a237e" }}>
                  Print
                </Button>
                <Button variant="outlined" fullWidth color="error" startIcon={<CloseIcon />} onClick={() => navigate(-1)} sx={{ height: 45 }}>
                  Close
                </Button>
              </Stack>
            </Grid>

          </Grid>
        </Paper>
      </Box>

         

         
      {/* ================= HIDDEN REPORT ================= */}
     <Box
  ref={reportRef}
  sx={{
    display: "none",
    width: "794px", // exact A4 width in px
    minHeight: "1123px", // exact A4 height
    margin: "auto",
    backgroundColor: "#fff",
    padding: "40px",
    fontFamily: "Times New Roman",
    fontSize: "11px",
    color: "#000"
  }}
>
  <Typography align="center" sx={{ fontSize: "18px", fontWeight: 600 }}>
    Phadke Prakashan, Kolhapur.
  </Typography>

  <Typography align="center" sx={{ fontSize: "14px", mb: 1 }}>
    Paper Consumption
  </Typography>

  <Typography align="center" sx={{ fontSize: "12px", mb: 3 }}>
    {bookGroup || "TEXT Book Group"} Feeding Date From {startDate} To {endDate}
  </Typography>

  <table
    width="100%"
    style={{
      borderCollapse: "collapse",
      fontSize: "10px"
    }}
    border="1"
    cellPadding="4"
  >
    <thead>
      <tr style={{ backgroundColor: "#f2f2f2" }}>
        <th>Sr No</th>
        <th>Book Code</th>
        <th>Book Name</th>
        <th>Price</th>
        <th>Edition</th>
        <th>Pub Date</th>
        <th>Print Order</th>
        <th>Pages</th>
        <th>Forms</th>
        <th>Consumption</th>
        <th>Wastage</th>
        <th>Reams</th>
        <th>Press</th>
        <th>Paper Size</th>
      </tr>
    </thead>

    <tbody>
      {[...Array(15)].map((_, i) => (
        <tr key={i}>
          {Array.from({ length: 14 }).map((_, j) => (
            <td key={j} style={{ height: "22px" }}></td>
          ))}
        </tr>
      ))}
    </tbody>
  </table>

  <Box mt={2}>
    <Typography sx={{ fontSize: "11px" }}>
      Paper Wastage % : {paperWastage || "0.00"}
    </Typography>
  </Box>
</Box>


    </Box>
  );
}