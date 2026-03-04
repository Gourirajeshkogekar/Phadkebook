

import { useEffect, useState, useRef } from "react";
import axios from "axios";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

import {
  Box,
  Paper,
  Typography,
  TextField,
  RadioGroup,
  FormControlLabel,
  Radio,
  Button,
  Stack,
  Autocomplete,
  Dialog,
  DialogTitle,
  DialogActions,
  Checkbox,
  Grid
} from "@mui/material";

import PrintIcon from "@mui/icons-material/Print";
import CloseIcon from "@mui/icons-material/Close";

export default function NetSale() {

  const reportRef = useRef();
  const [printing, setPrinting] = useState(false);

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

  const [startDate, setStartDate] = useState(fy.start);
  const [endDate, setEndDate] = useState(fy.end);

  const [accounts, setAccounts] = useState([]);
  const [standards, setStandards] = useState([]);
  const [groups, setGroups] = useState([]);
  const [cities, setCities] = useState([]);

  const [selectedParty, setSelectedParty] = useState(null);
  const [selectedStandard, setSelectedStandard] = useState(null);
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [selectedCity, setSelectedCity] = useState(null);

  const [bookCode, setBookCode] = useState("");
  const [bookList, setBookList] = useState([]);

  const [salesReturnDialog, setSalesReturnDialog] = useState(false);
  const [authorDialog, setAuthorDialog] = useState(false);
  const [royaltyDialog, setRoyaltyDialog] = useState(false);

  const [includeSalesReturn, setIncludeSalesReturn] = useState(false);
  const [printAuthorName, setPrintAuthorName] = useState(false);
  const [onlyRoyaltyBooks, setOnlyRoyaltyBooks] = useState(false);

  useEffect(() => {
    axios.get("https://publication.microtechsolutions.net.in/php/Accountget.php")
      .then(res => setAccounts(res.data || []));
    axios.get("https://publication.microtechsolutions.net.in/php/Standardget.php")
      .then(res => setStandards(res.data || []));
    axios.get("https://publication.microtechsolutions.net.in/php/BookGroupget.php")
      .then(res => setGroups(res.data || []));
    axios.get("https://publication.microtechsolutions.net.in/php/Cityget.php")
      .then(res => setCities(res.data || []));
  }, []);

  const handleBookSearch = async () => {
    if (!bookCode) return;
    const res = await axios.get(
      `https://publication.microtechsolutions.net.in/php/Bookcodeget.php?BookCode=${bookCode}`
    );
    setBookList(res.data || []);
  };

  const handlePrint = () => setSalesReturnDialog(true);

  const proceedPrint = async () => {
    setPrinting(true);
    setTimeout(async () => {
      const canvas = await html2canvas(reportRef.current, { scale: 2 });
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");
      pdf.addImage(imgData, "PNG", 0, 0, 210, 297);
      window.open(pdf.output("bloburl"), "_blank");
      setPrinting(false);
    }, 500);
  };

  const boxStyle = {
    border: "1px solid #cfcfcf",
    p: 1,
    background: "#fff"
  };

  return (
    <Box sx={{ p: 1, bgcolor: "#efefef", minHeight: "100vh" }}>

      <Typography variant="h6" fontWeight={600}  >
        Net Sale
      </Typography>

      {/* PERIOD */}
      <Paper sx={{ ...boxStyle, mb: 1 }}>
        <Typography fontWeight={600} mb={1}>Period</Typography>
        <Stack direction="row" spacing={2} alignItems="center">
          <TextField type="date" size="small"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)} />
          <TextField type="date" size="small"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)} />
          <FormControlLabel
            control={<Checkbox />}
            label="print only closing stock"
          />
        </Stack>
      </Paper>

      {/* MAIN GRID */}
      <Grid container spacing={3}>

        {/* LEFT COLUMN */}
        <Grid item xs={12} md={6}>
          <Stack spacing={2}>

            <Paper sx={boxStyle}>
              <Typography fontWeight={600}>Publication</Typography>
              <RadioGroup row>
                <FormControlLabel value="all" control={<Radio />} label="All Publication" />
                <FormControlLabel value="selected" control={<Radio />} label="Selecting Publication" />
              </RadioGroup>
              <Autocomplete
                options={accounts}
                getOptionLabel={(o) => o.AccountName || ""}
                value={selectedParty}
                onChange={(e, v) => setSelectedParty(v)}
                renderInput={(params) => <TextField {...params} size="small" />}
              />
            </Paper>

            <Paper sx={boxStyle}>
              <Typography fontWeight={600}>Boook Standard</Typography>
              <RadioGroup row>
                <FormControlLabel value="all" control={<Radio />} label="All Publication" />
                <FormControlLabel value="selected" control={<Radio />} label="Selecting Book Standard" />
              </RadioGroup>
              <Autocomplete
                options={standards}
                getOptionLabel={(o) => o.StandardName || ""}
                value={selectedStandard}
                onChange={(e, v) => setSelectedStandard(v)}
                renderInput={(params) => <TextField {...params} size="small" />}
              />
            </Paper>
 <Paper sx={boxStyle}>
              <Typography fontWeight={600}>District</Typography>
              <Autocomplete
                options={cities}
                getOptionLabel={(o) => o.CityName || ""}
                value={selectedCity}
                onChange={(e, v) => setSelectedCity(v)}
                renderInput={(params) => <TextField {...params} size="small" />}
              />
            </Paper>
          </Stack>
        </Grid>

        {/* RIGHT COLUMN */}
        <Grid item xs={12} md={6}>
          <Stack spacing={3}>

            <Paper sx={boxStyle}>
              <Typography fontWeight={600}>Book Group</Typography>
              <RadioGroup row>
                <FormControlLabel value="all" control={<Radio />} label="All Publication" />
                <FormControlLabel value="selected" control={<Radio />} label="Selecting Book Group" />
              </RadioGroup>
              <Autocomplete
                options={groups}
                getOptionLabel={(o) => o.BookGroupName || ""}
                value={selectedGroup}
                onChange={(e, v) => setSelectedGroup(v)}
                renderInput={(params) => <TextField {...params} size="small" />}
              />
            </Paper>

           

            <Paper sx={boxStyle}  >
              <Typography fontWeight={600}>Book Selection</Typography>
              <TextField
                size="small"
                fullWidth
                placeholder="Enter Book Code"
                value={bookCode}
                onChange={(e) => setBookCode(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleBookSearch()}
              />
              <Box mt={1} sx={{ border: "1px solid #999", height: 100, overflowY: "auto" }}>
                <table width="100%" border="1" style={{ borderCollapse: "collapse" }}>
                  <thead>
                    <tr>
                      <th style={{fontSize:'14px'}}>Book Code</th>
                      <th>Book Name</th>
                    </tr>
                  </thead>
                  <tbody>
                    {bookList.map((book, index) => (
                      <tr key={index}>
                        <td>{book.BookCode}</td>
                        <td>{book.BookName}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </Box>
            </Paper>

          </Stack>
        </Grid>
      </Grid>

      {/* BUTTONS */}
      <Stack direction="row" spacing={4} justifyContent="center" padding={1}>
        <Button variant="contained" startIcon={<PrintIcon />} onClick={handlePrint}>
          Print
        </Button>
        <Button variant="contained" color="error" startIcon={<CloseIcon />}>
          Close
        </Button>
      </Stack>



{/* ================= UPDATED PRINT STRUCTURE ================= */}
<div style={{ position: "absolute", left: "-9999px", top: 0 }}>
  <div
    ref={reportRef}
    style={{
      width: "794px",
      minHeight: "1123px",
      padding: "40px",
      fontFamily: "serif",
      fontSize: "12px",
      background: "#fff",
      color: "#000"
    }}
  >

    {/* Company Header */}
    <div style={{ textAlign: "center", fontWeight: "bold", fontSize: "18px" }}>
      M. V. Phadke & Co. Kolhapur
    </div>

    <div style={{ textAlign: "center", marginTop: "5px", fontSize: "14px" }}>
      Net Sale
    </div>

    <div style={{ textAlign: "center", marginTop: "5px", marginBottom: "10px" }}>
      From {startDate} To {endDate}
      {includeSalesReturn
        ? " (including Sales Return)"
        : " (Sales Only)"}
    </div>

    <hr style={{ border: "1px solid black" }} />

    {/* Table */}
    <table
      width="100%"
      border="1"
      cellPadding="5"
      cellSpacing="0"
      style={{
        borderCollapse: "collapse",
        textAlign: "center",
        marginTop: "10px"
      }}
    >
      <thead style={{ fontWeight: "bold" }}>
        <tr>
          <th>Sr. No.</th>
          <th>Book Code</th>
          <th style={{ textAlign: "left" }}>Name of the Book</th>
          <th>Edition</th>
          <th>Price</th>

          {printAuthorName && (
            <th style={{ textAlign: "left" }}>
              Name of the Author(s)
            </th>
          )}

          <th>Roylt Perc.</th>
          <th>Copies Sold</th>
          <th>Copies Return</th>
          <th>Net Copies</th>
        </tr>
      </thead>

      <tbody>
        {bookList.map((book, index) => {

          const sold = Number(book.CopiesSold || 0);
          const returned = Number(book.CopiesReturn || 0);
          const net = sold - returned;

          return (
            <tr key={index}>
              <td>{index + 1}</td>
              <td>{book.BookCode}</td>
              <td style={{ textAlign: "left" }}>{book.BookName}</td>
              <td>{book.Edition || ""}</td>
              <td>{book.Price || ""}</td>

              {printAuthorName && (
                <td style={{ textAlign: "left" }}>
                  {book.AuthorName || ""}
                </td>
              )}

              <td>{book.RoyaltyPercent || "0.00"}</td>
              <td>{sold}</td>
              <td>{includeSalesReturn ? returned : 0}</td>
              <td>{includeSalesReturn ? net : sold}</td>
            </tr>
          );
        })}
      </tbody>
    </table>

  </div>
</div>


      {/* POPUPS */}
      <Dialog open={salesReturnDialog}>
        <DialogTitle>Include Sales Return?</DialogTitle>
        <DialogActions>
          <Button onClick={() => {
            setIncludeSalesReturn(true);
            setSalesReturnDialog(false);
            setAuthorDialog(true);
          }}>Yes</Button>
          <Button onClick={() => {
            setIncludeSalesReturn(false);
            setSalesReturnDialog(false);
            setAuthorDialog(true);
          }}>No</Button>
        </DialogActions>
      </Dialog>

      <Dialog open={authorDialog}>
        <DialogTitle>Print Authors Name?</DialogTitle>
        <DialogActions>
          <Button onClick={() => {
            setPrintAuthorName(true);
            setAuthorDialog(false);
            setRoyaltyDialog(true);
          }}>Yes</Button>
          <Button onClick={() => {
            setPrintAuthorName(false);
            setAuthorDialog(false);
            setRoyaltyDialog(true);
          }}>No</Button>
        </DialogActions>
      </Dialog>

      <Dialog open={royaltyDialog}>
        <DialogTitle>Print Only Royalty Applicable Books?</DialogTitle>
        <DialogActions>
          <Button onClick={() => {
            setOnlyRoyaltyBooks(true);
            setRoyaltyDialog(false);
            proceedPrint();
          }}>Yes</Button>
          <Button onClick={() => {
            setOnlyRoyaltyBooks(false);
            setRoyaltyDialog(false);
            proceedPrint();
          }}>No</Button>
        </DialogActions>
      </Dialog>

    </Box>
  );
}




