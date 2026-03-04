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
  Checkbox,
  Button,
  Grid,
  Autocomplete,
  Container,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody
} from "@mui/material";

import PrintIcon from "@mui/icons-material/Print";
import CloseIcon from "@mui/icons-material/Close";

export default function Stockstmtdetails() {

const [printing, setPrinting] = useState(false);


  /* ================= FINANCIAL YEAR ================= */

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
  const [closingOnly, setClosingOnly] = useState(false);

  const [publicationMode, setPublicationMode] = useState("all");
  const [groupMode, setGroupMode] = useState("all");
  const [standardMode, setStandardMode] = useState("all");

  const [publications, setPublications] = useState([]);
  const [groups, setGroups] = useState([]);
  const [standards, setStandards] = useState([]);

  const [selectedPublication, setSelectedPublication] = useState(null);
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [selectedStandard, setSelectedStandard] = useState(null);

  const [bookCode, setBookCode] = useState("");
  const [bookDetails, setBookDetails] = useState(null);
  const reportRef = useRef();

  /* ================= FETCH ================= */

  useEffect(() => {
    axios.get("https://publication.microtechsolutions.net.in/php/Publicationget.php")
      .then(res => setPublications(res.data || []));

    axios.get("https://publication.microtechsolutions.net.in/php/BookGroupget.php")
      .then(res => setGroups(res.data || []));

    axios.get("https://publication.microtechsolutions.net.in/php/Standardget.php")
      .then(res => setStandards(res.data || []));
  }, []);

  /* ================= BOOK SEARCH ================= */

  const handleBookSearch = async () => {
    if (!bookCode) return;

    try {
      const res = await axios.get(
        `https://publication.microtechsolutions.net.in/php/Bookcodeget.php?BookCode=${bookCode}`
      );
      setBookDetails(res.data?.[0] || null);
    } catch (err) {
      console.error(err);
    }
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


  const boxStyle = {
    border: "1px solid #ccc",
    borderRadius: 1,
    p: 1,
    background: "#fff"
  };

  return (
    <Container maxWidth="lg">
      <Box sx={{ p: 1, bgcolor: "#f4f6f9", minHeight: "90vh" }}>

        <Typography variant="h6"  fontWeight={600}>
          Stock Statement Details
        </Typography>


        <Paper sx={boxStyle}>
          <Typography fontWeight={600} >Period</Typography>

          <Grid container spacing={2} alignItems="center">
            <Grid item xs={3}>
              <TextField type="date" fullWidth value={startDate}
                onChange={(e) => setStartDate(e.target.value)} />
            </Grid>

            <Grid item xs={3}>
              <TextField type="date" fullWidth value={endDate}
                onChange={(e) => setEndDate(e.target.value)} />
            </Grid>

            <Grid item xs={6}>
              <FormControlLabel
                control={<Checkbox checked={closingOnly}
                  onChange={(e) => setClosingOnly(e.target.checked)} />}
                label="Print Only Closing Stock"
              />
            </Grid>
          </Grid>
        </Paper>

        <Box mt={1} />

 
        <Grid container spacing={3}>

          {/* Publication */}
          <Grid item xs={6}>
            <Paper sx={boxStyle}>
              <Typography fontWeight={600}>Publication</Typography>

              <RadioGroup row value={publicationMode}
                onChange={(e) => setPublicationMode(e.target.value)}>
                <FormControlLabel value="all" control={<Radio />} label="All Publication" />
                <FormControlLabel value="selected" control={<Radio />} label="Selecting Publication" />
              </RadioGroup>

              {publicationMode === "selected" && (
                <Autocomplete
                  fullWidth
                  options={publications}
                  getOptionLabel={(option) => option.PublicationName || ""}
                  value={selectedPublication}
                  onChange={(e, val) => setSelectedPublication(val)}
                  renderInput={(params) =>
                    <TextField {...params} placeholder="Select Publication" />}
                />
              )}
            </Paper>
          </Grid>

          {/* Book Group */}
          <Grid item xs={6}>
            <Paper sx={boxStyle}>
              <Typography fontWeight={600}>Book Group</Typography>

              <RadioGroup row value={groupMode}
                onChange={(e) => setGroupMode(e.target.value)}>
                <FormControlLabel value="all" control={<Radio />} label="All Publication" />
                <FormControlLabel value="selected" control={<Radio />} label="Selecting Book Group" />
              </RadioGroup>

              {groupMode === "selected" && (
                <Autocomplete
                  fullWidth
                  options={groups}
                  getOptionLabel={(option) => option.BookGroupName || ""}
                  value={selectedGroup}
                  onChange={(e, val) => setSelectedGroup(val)}
                  renderInput={(params) =>
                    <TextField {...params} placeholder="Select Book Group" />}
                />
              )}
            </Paper>
          </Grid>

           <Grid item xs={6}  >
            <Paper sx={boxStyle}>
              <Typography fontWeight={600}>Book Standard</Typography>

              <RadioGroup row value={standardMode}
                onChange={(e) => setStandardMode(e.target.value)}>
                <FormControlLabel value="all" control={<Radio />} label="All Publication" />
                <FormControlLabel value="selected" control={<Radio />} label="Selecting Standard" />
              </RadioGroup>

              {standardMode === "selected" && (
                <Autocomplete
                  fullWidth
                  options={standards}
                  getOptionLabel={(option) => option.StandardName || ""}
                  value={selectedStandard}
                  onChange={(e, val) => setSelectedStandard(val)}
                  renderInput={(params) =>
                    <TextField {...params} placeholder="Select Standard" />}
                />
              )}
            </Paper>
          </Grid>


{/* Book Selection */}
<Grid item xs={6}>
  <Paper
    sx={{
      border: "1px solid #bdbdbd",
      borderRadius: 1,
      background: "#fff",
      p: 0
    }}
  >
    <Typography
      sx={{
        p: 1,
        borderBottom: "1px solid #bdbdbd",
        fontWeight: 600
      }}
    >
      Book Selection
    </Typography>

    <Box sx={{ p: 1 }}>

      {/* BOOK CODE INPUT */}
      <TextField
        fullWidth
        placeholder="Enter Book Code"
        value={bookCode}
        onChange={(e) => setBookCode(e.target.value)}
        onKeyDown={handleEnter}
        sx={{ mb: 1 }}
      />

      {/* SMALL HEIGHT TABLE */}
      <Box
        sx={{
          border: "1px solid #bdbdbd",
          height: 100,   // 🔥 reduced height
          overflowY: "auto"
        }}
      >
        <table width="100%" style={{ borderCollapse: "collapse" }}>
          <thead>
            <tr>
              <th
                style={{
                  border: "1px solid #bdbdbd",
                  padding: "4px",
                  textAlign: "left"
                }}
              >
                Book Code
              </th>
              <th
                style={{
                  border: "1px solid #bdbdbd",
                  padding: "4px",
                  textAlign: "left"
                }}
              >
                Book Name
              </th>
            </tr>
          </thead>
          <tbody>
            {bookDetails && (
              <tr>
                <td
                  style={{
                    border: "1px solid #bdbdbd",
                    padding: "4px"
                  }}
                >
                  {bookCode}
                </td>
                <td
                  style={{
                    border: "1px solid #bdbdbd",
                    padding: "4px"
                  }}
                >
                  {bookDetails.BookName}
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
<Box mt={2} textAlign="center">

  <Button
    variant="contained"
    startIcon={<PrintIcon />}
    onClick={handlePrint}
    sx={{
      backgroundColor: "#1976d2",
      px: 5,
      py: 1.5,
      mr: 3,
      borderRadius: 2,
      boxShadow: "0 4px 10px rgba(0,0,0,0.2)",
      "&:hover": {
        backgroundColor: "#1565c0"
      }
    }}
  >
    PRINT
  </Button>

  <Button
    variant="contained"
    startIcon={<CloseIcon />}
    sx={{
      backgroundColor: "#d32f2f",
      px: 5,
      py: 1.5,
      borderRadius: 2,
      boxShadow: "0 4px 10px rgba(0,0,0,0.2)",
      "&:hover": {
        backgroundColor: "#b71c1c"
      }
    }}
  >
    CLOSE
  </Button>

</Box>


{/* ================= PRINT STRUCTURE ================= */}
{/* ================= PRINT STRUCTURE ================= */}
<div style={{ position: "absolute", left: "-9999px", top: 0 }}>
  <div
    ref={reportRef}
    style={{
      width: "794px",
      minHeight: "1123px",
      padding: "30px 40px",
      fontFamily: "Times New Roman",
      fontSize: "12px",
      background: "#ffffff",
      color: "#000"
    }}
  >

    {/* HEADER */}
    <div style={{ textAlign: "center", fontWeight: "bold", fontSize: "18px" }}>
      PHADKE BOOK HOUSE
    </div>

    <div style={{ textAlign: "center", marginTop: "3px" }}>
      Stock Statement
    </div>

    <div style={{ textAlign: "center", marginTop: "3px" }}>
      From {startDate} To {endDate}
    </div>

    <div style={{ position: "absolute", right: "40px", top: "35px" }}>
      Page 1 of 1
    </div>

    <hr style={{ marginTop: "15px" }} />

    {/* TABLE HEADER */}
    <table
      width="100%"
      style={{
        borderCollapse: "collapse",
        marginTop: "10px",
        textAlign: "center"
      }}
    >
      <thead>
        <tr style={{ borderBottom: "1px solid #000" }}>
          <th style={{ textAlign: "left" }}>Sr No</th>
          <th style={{ textAlign: "left" }}>Particulars</th>
          <th>Op Stock</th>
          <th>Inward</th>
          <th>Purchase</th>
          <th>Sales</th>
          <th>Closing</th>
        </tr>
      </thead>

      <tbody>
        {bookDetails && (
          <tr style={{ borderBottom: "1px solid #000" }}>
            <td>1</td>
            <td style={{ textAlign: "left" }}>
              {bookCode} - {bookDetails.BookName}
            </td>
            <td>{bookDetails.OpStock || 0}</td>
            <td>{bookDetails.Inward || 0}</td>
            <td>{bookDetails.Purchase || 0}</td>
            <td>{bookDetails.Sales || 0}</td>
            <td>{bookDetails.ClosingStock || 0}</td>
          </tr>
        )}
      </tbody>
    </table>

  </div>
</div>

</Box>
</Container>
  );
}