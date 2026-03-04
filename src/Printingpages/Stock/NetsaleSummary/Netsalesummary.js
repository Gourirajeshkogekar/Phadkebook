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
  Button,
  Stack,
  Autocomplete,
  Radio,
  RadioGroup,
  Select,
  MenuItem,Grid
} from "@mui/material";

import PrintIcon from "@mui/icons-material/Print";
import CloseIcon from "@mui/icons-material/Close";

export default function NetSaleSummary() {
  const reportRef = useRef();
  const [printing, setPrinting] = useState(false);

  /* ================= FINANCIAL YEAR DEFAULT ================= */

  const getFinancialYear = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = today.getMonth() + 1;

    let startYear = month >= 4 ? year : year - 1;
    let endYear = startYear + 1;

    return {
      start: `${startYear}-04-01`,
      end: `${endYear}-03-31`,
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

  const [selectedParty, setSelectedParty] = useState(null);
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [selectedCity, setSelectedCity] = useState("");
  const [partyBookwise, setPartyBookwise] = useState(false);

  const [bookCode, setBookCode] = useState("");
  const [bookList, setBookList] = useState([]);
  const [standards, setStandards] = useState([]);
const [selectedStandard, setSelectedStandard] = useState(null);

  /* ================= FETCH APIs ================= */

  useEffect(() => {
    axios
      .get("https://publication.microtechsolutions.net.in/php/Accountget.php")
      .then((res) => setAccounts(res.data || []));

    axios
      .get("https://publication.microtechsolutions.net.in/php/BookGroupget.php")
      .then((res) => setGroups(res.data || []));


       axios
      .get("https://publication.microtechsolutions.net.in/php/Standardget.php")
      .then((res) => setStandards(res.data || []));


    axios
      .get("https://publication.microtechsolutions.net.in/php/Cityget.php")
      .then((res) => setCities(res.data || []));
  }, []);

  /* ================= BOOK SEARCH ================= */

  const handleBookSearch = async () => {
    if (!bookCode) return;

    const res = await axios.get(
      `https://publication.microtechsolutions.net.in/php/Bookcodeget.php?BookCode=${bookCode}`,
    );

    setBookList(res.data || []);
  };

  const handleEnter = (e) => {
    if (e.key === "Enter") handleBookSearch();
  };

  /* ================= PRINT ================= */

  const handlePrint = async () => {
    setPrinting(true);

    setTimeout(async () => {
      try {
        const element = reportRef.current;
        if (!element) return;

        const canvas = await html2canvas(element, {
          scale: 2,
          useCORS: true,
          logging: false,
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

  const sectionBox = {
    border: "1px solid #dcdcdc",
    borderRadius: 1,
    p:1,
    background: "#ffffff",
  };

return (
    <Box sx={{ p: 1, bgcolor: "#f1f3f4", minHeight: "100vh" }}>
      <Typography variant="h6" sx={{  fontWeight: 700, mb: 1,textAlign:'center', color: '#1a237e' }}>
        Net Sale Summary
      </Typography>

      <Grid container spacing={1}>
        {/* PERIOD SECTION */}
        <Grid item xs={12}>
          <Paper sx={{ ...sectionBox, py: 0.5, px: 2 }}>
            <Stack direction="row" spacing={2} alignItems="center">
              <Typography fontSize={13} fontWeight={600}>Period:</Typography>
              <TextField type="date" size="small" variant="standard" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
              <Typography fontSize={13}>To</Typography>
              <TextField type="date" size="small" variant="standard" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
            </Stack>
          </Paper>
        </Grid>

        {/* LEFT COLUMN */}
        <Grid item xs={12} md={6}>
          <Stack spacing={1}>
            <Paper sx={sectionBox}>
              <Typography fontSize={12} fontWeight={700} color="primary">Party Selection</Typography>
              <RadioGroup row value={partyMode} onChange={(e) => setPartyMode(e.target.value)}>
                <FormControlLabel value="all" control={<Radio size="small" />} label={<Typography fontSize={12}>All</Typography>} />
                <FormControlLabel value="selected" control={<Radio size="small" />} label={<Typography fontSize={12}>Selected</Typography>} />
              </RadioGroup>
              <Stack direction="row" spacing={1} alignItems="center">
                <Autocomplete
                  size="small"
                  fullWidth
                  options={accounts}
                  getOptionLabel={(o) => o.AccountName || ""}
                  value={selectedParty}
                  onChange={(e, v) => setSelectedParty(v)}
                  renderInput={(params) => <TextField {...params} placeholder="Select Party" />}
                />
                <FormControlLabel
                  control={<Checkbox size="small" checked={partyBookwise} onChange={(e) => setPartyBookwise(e.target.checked)} />}
                  label={<Typography fontSize={11}>Partywise?</Typography>}
                />
              </Stack>
            </Paper>

            <Paper sx={sectionBox}>
              <Typography fontSize={12} fontWeight={700} color="primary">Book Standard</Typography>
              <RadioGroup row value={standardMode} onChange={(e) => setStandardMode(e.target.value)}>
                <FormControlLabel value="all" control={<Radio size="small" />} label={<Typography fontSize={12}>All</Typography>} />
                <FormControlLabel value="selected" control={<Radio size="small" />} label={<Typography fontSize={12}>Selected</Typography>} />
              </RadioGroup>
              <Autocomplete
                size="small"
                fullWidth
                options={standards}
                getOptionLabel={(o) => o.StandardName || ""}
                value={selectedStandard}
                onChange={(e, v) => setSelectedStandard(v)}
                disabled={standardMode === "all"}
                renderInput={(params) => <TextField {...params} size="small" placeholder="Select Standard" />}
              />
            </Paper>
          </Stack>
        </Grid>

        {/* RIGHT COLUMN */}
        <Grid item xs={12} md={6}>
          <Stack spacing={1}>
            <Paper sx={sectionBox}>
              <Typography fontSize={12} fontWeight={700} color="primary">Book Group</Typography>
              <RadioGroup row value={groupMode} onChange={(e) => setGroupMode(e.target.value)}>
                <FormControlLabel value="all" control={<Radio size="small" />} label={<Typography fontSize={12}>All</Typography>} />
                <FormControlLabel value="selected" control={<Radio size="small" />} label={<Typography fontSize={12}>Selected</Typography>} />
              </RadioGroup>
              <Box sx={{ height: '50px', overflowY: 'auto', mt: 0.5, border: '1px solid #eee', p: 0.5 }}>
                <Grid container>
                  {groups.map((group, index) => (
                    <Grid item xs={6} key={index}>
                      <FormControlLabel control={<Checkbox size="small" sx={{ p: 0.5 }} />} label={<Typography fontSize={11}>{group.BookGroupName}</Typography>} />
                    </Grid>
                  ))}
                </Grid>
              </Box>
            </Paper>

            <Paper sx={sectionBox}>
              <Typography fontSize={12} fontWeight={700} color="primary">District / City</Typography>
              <Select fullWidth size="small" value={selectedCity} onChange={(e) => setSelectedCity(e.target.value)}>
                {cities.map((city, index) => (
                  <MenuItem key={index} value={city.CityName} sx={{ fontSize: 12 }}>{city.CityName}</MenuItem>
                ))}
              </Select>
            </Paper>
          </Stack>
        </Grid>

        {/* BOOK SELECTION */}
        <Grid item xs={12}>
          <Paper sx={sectionBox}>
            <Typography fontSize={12} fontWeight={700} mb={0.5}>Book Selection (Enter Code)</Typography>
            <TextField
              size="small"
            
              value={bookCode}
              onChange={(e) => setBookCode(e.target.value)}
              onKeyDown={handleEnter}
            />
            <Box mt={1} sx={{ border: "1px solid #ddd", height: 80,width:'80%', overflowY: "auto" }}>
              <table width="100%" style={{ fontSize: "11px", borderCollapse: 'collapse' }}>
                <thead style={{ background: '#f5f5f5', position: 'sticky', top: 0 }}>
                  <tr>
                    <th style={{ border: '1px solid #ddd', padding: '2px' }}>Code</th>
                    <th style={{ border: '1px solid #ddd', padding: '2px', textAlign: 'left' }}>Book Name</th>
                  </tr>
                </thead>
                <tbody>
                  {bookList.map((book, index) => (
                    <tr key={index}>
                      <td style={{ border: '1px solid #ddd', textAlign: 'center' }}>{book.BookCode}</td>
                      <td style={{ border: '1px solid #ddd', paddingLeft: '4px' }}>{book.BookName}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </Box>
          </Paper>
        </Grid>
      </Grid>

      {/* ACTION BUTTONS - These will now stay on screen */}
      <Stack direction="row" spacing={2} justifyContent="center" mt={1.5}>
        <Button variant="contained" color="success" size="small" startIcon={<PrintIcon />} onClick={handlePrint} sx={{ px: 5 }}>
          PRINT
        </Button>
        <Button variant="contained" color="error" size="small" startIcon={<CloseIcon />} sx={{ px: 5 }}>
          CLOSE
        </Button>
      </Stack>
  {/* ================= HIDDEN PRINT SECTION ================= */}
      <div style={{ position: "absolute", left: "-9999px", top: 0 }}>
        <div
          ref={reportRef}
          style={{
            width: "794px",
            minHeight: "1123px",
            padding: "40px",
            fontFamily: "Times New Roman, serif",
            fontSize: "13px",
            background: "#fff",
            color: "#000",
            position: "relative"
          }}
        >
          <div style={{ textAlign: "center", fontSize: "18px", fontWeight: "bold" }}>
            M. V. Phadke & Co. Kolhapur
          </div>

          <div style={{ textAlign: "center", marginTop: "4px" }}>
            Net Sale Summary
          </div>

          <div style={{ textAlign: "center", marginTop: "4px" }}>
            From {startDate} To {endDate} (including Sales Return)
          </div>

          <div style={{ position: "absolute", right: "40px", top: "40px" }}>
            Page 1 of 1
          </div>

          <div style={{ marginTop: "15px", borderTop: "2px solid black" }} />
          <div style={{ marginTop: "2px", borderTop: "1px solid black" }} />

          <table
            width="100%"
            cellPadding="4"
            cellSpacing="0"
            style={{ marginTop: "10px", borderCollapse: "collapse", textAlign: "center" }}
          >
            <thead>
              <tr style={{ borderBottom: "1px solid black" }}>
                <th>Book Code</th>
                <th>Book Name</th>
                <th>Total Copies</th>
              </tr>
            </thead>
            <tbody>
              {bookList.map((book, index) => (
                <tr key={index}>
                  <td>{book.BookCode}</td>
                  <td style={{ textAlign: "left" }}>{book.BookName}</td>
                  <td>{book.CopiesSold || 0}</td>
                </tr>
              ))}

              <tr style={{ fontWeight: "bold", borderTop: "1px solid black" }}>
                <td colSpan="2">Total</td>
                <td>
                  {bookList.reduce(
                    (sum, item) => sum + Number(item.CopiesSold || 0),
                    0
                  )}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

    </Box>
  );
}