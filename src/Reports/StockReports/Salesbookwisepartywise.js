import { useState, useEffect, useRef } from "react";
import {
  Box,
  Typography,
  Grid,
  Button,
  TextField,
  Checkbox,
  RadioGroup,
  FormControlLabel,
  Radio,
  Paper,
  Divider,
} from "@mui/material";

import PrintIcon from "@mui/icons-material/Print";
import CloseIcon from "@mui/icons-material/Close";

import axios from "axios";
import dayjs from "dayjs";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

export default function SalesBookwisePartywise() {
  const reportRef = useRef();
  const [printing, setPrinting] = useState(false);
  const [showBooks, setShowBooks] = useState("no");

  const today = dayjs();
  const fyYear = today.month() >= 3 ? today.year() : today.year() - 1;

  const [startDate, setStartDate] = useState(`${fyYear}-04-01`);
  const [endDate, setEndDate] = useState(`${fyYear + 1}-03-31`);

  const [publications, setPublications] = useState([]);
  const [selectedPublications, setSelectedPublications] = useState([]);

  const [parties, setParties] = useState([]);
  const [selectedParties, setSelectedParties] = useState([]);

  const [bookCode, setBookCode] = useState("");
  const [bookInfo, setBookInfo] = useState(null);

  useEffect(() => {
    loadInitialData();
  }, []);

  const loadInitialData = async () => {
    try {
      const [pubRes, accRes] = await Promise.all([
        axios.get("https://publication.microtechsolutions.net.in/php/Publicationget.php"),
        axios.get("https://publication.microtechsolutions.net.in/php/Accountget.php")
      ]);
      setPublications(pubRes.data.map(x => x.PublicationName || Object.values(x)[0]));
      setParties(accRes.data.map(x => x.AccountName || Object.values(x)[0]));
    } catch (err) {
      console.error("Failed to load data", err);
    }
  };

  const loadBookInfo = async (code) => {
    if (!code) return setBookInfo(null);
    try {
      const res = await axios.get(
        `https://publication.microtechsolutions.net.in/php/Bookcodeget.php?BookCode=${code}`
      );
      setBookInfo(res.data.length > 0 ? res.data[0] : null);
    } catch {
      setBookInfo(null);
    }
  };

  const togglePublication = (name) => {
    setSelectedPublications(prev =>
      prev.includes(name) ? prev.filter(x => x !== name) : [...prev, name]
    );
  };

  const toggleParty = (name) => {
    setSelectedParties(prev =>
      prev.includes(name) ? prev.filter(x => x !== name) : [...prev, name]
    );
  };

  const handlePrint = async () => {
    setPrinting(true);
    setTimeout(async () => {
      const element = reportRef.current;
      const canvas = await html2canvas(element, { scale: 2 });
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");
      pdf.addImage(imgData, "PNG", 0, 0, 210, 297);
      window.open(pdf.output("bloburl"), "_blank");
      setPrinting(false);
    }, 500);
  };

  return (
    <Box sx={{ p: 1, bgcolor: "#f4f6f8", minHeight: "90vh" }}>
      {/* HEADER WITH FIXED BORDER */}

     
     <Box sx={{ mb: 1, pb: 1, borderBottom: "1px solid #e0e0e0" }}>
        <Typography variant="h5" fontWeight={700} color="primary.main">
          Sales Bookwise Partywise
        </Typography>
        </Box>

      <Grid container spacing={2}>
        {/* LEFT COLUMN: OPTIONS & PUBLICATIONS */}
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 1,  }}>
            <Typography variant="subtitle2" color="primary" fontWeight="bold">Show Books?</Typography>
            <RadioGroup row value={showBooks} onChange={(e) => setShowBooks(e.target.value)}>
              <FormControlLabel value="yes" control={<Radio size="small" />} label="Yes" />
              <FormControlLabel value="no" control={<Radio size="small" />} label="No" />
            </RadioGroup>

            <Divider sx={{ my: 1 }} />

            <Typography variant="subtitle2" color="primary" fontWeight="bold">Period</Typography>
            <Box mt={1}>
              <TextField type="date" label="From" fullWidth size="small" value={startDate} onChange={(e) => setStartDate(e.target.value)} sx={{ mb: 1 }} InputLabelProps={{ shrink: true }} />
              <TextField type="date" label="To" fullWidth size="small" value={endDate} onChange={(e) => setEndDate(e.target.value)} InputLabelProps={{ shrink: true }} />
            </Box>
          </Paper>

          <Paper sx={{ p: 1 , mt:1}}>
            <Typography variant="subtitle2" color="primary" fontWeight="bold">Publication</Typography>
             <Box sx={{ maxHeight: 140, overflowY: "auto", display: 'flex', flexDirection: 'column' }}>
              {publications.map(pub => (
                <FormControlLabel
                  key={pub}
                  control={<Checkbox size="small" 
                    checked={selectedPublications.includes(pub)} 
                    onChange={() => togglePublication(pub)} />}
                  label={<Typography variant="body2">{pub}</Typography>}
                />
              ))}
            </Box>
          </Paper>
        </Grid>

        {/* MIDDLE COLUMN: BOOK CODE SEARCH */}
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 1, height: '400px' }}>
            <Typography variant="subtitle2" color="primary" fontWeight="bold">Book Search</Typography>
            <Divider sx={{ my: 1 }} />
            <TextField
              fullWidth
              size="small"
              placeholder="Enter Book Code"
              value={bookCode}
              onChange={(e) => {
                setBookCode(e.target.value);
                loadBookInfo(e.target.value);
              }}
            />
            {bookInfo && (
              <Box mt={2} p={1} sx={{ bgcolor: '#e3f2fd', borderRadius: 1 }}>
                <Typography variant="body2"><strong>Code:</strong> {bookInfo.BookCode}</Typography>
                <Typography variant="body2"><strong>Name:</strong> {bookInfo.BookName}</Typography>
              </Box>
            )}
          </Paper>
        </Grid>

        {/* RIGHT COLUMN: PARTY SELECTION */}
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 1, height: '380px', display: 'flex', flexDirection: 'column' }}>
            <Typography variant="subtitle2" color="primary" fontWeight="bold">Party</Typography>
            <Divider sx={{ my: 1 }} />
            <Box sx={{ flexGrow: 1, maxHeight: 400, overflowY: "auto", display: 'flex', flexDirection: 'column' }}>
              {parties.map(party => (
                <FormControlLabel
                  key={party}
                  control={<Checkbox size="small" checked={selectedParties.includes(party)} onChange={() => toggleParty(party)} />}
                  label={<Typography variant="body2" noWrap>{party}</Typography>}
                />
              ))}
            </Box>
            <Box mt={2} display="flex" gap={1}>
              <Button variant="contained" fullWidth startIcon={<PrintIcon />} onClick={handlePrint} disabled={printing}>Print</Button>
              <Button variant="outlined" fullWidth color="error" startIcon={<CloseIcon />}>Close</Button>
            </Box>
          </Paper>
        </Grid>
      </Grid>

        {/* PRINT AREA */}
   <Box
        ref={reportRef}
        sx={{
          width: "210mm",
          minHeight: "297mm",
          background: "#fff",
          padding: "20mm",
          position: "absolute",
          left: "-9999px"
        }}
      >

        <Typography align="center" fontWeight="bold">
          PHADKE BOOK HOUSE
        </Typography>

        <Typography align="center">
          From {startDate} To {endDate}
        </Typography>
<table
  width="100%"
  style={{
    borderCollapse: "collapse",
    marginTop: "10px",
    width: "100%"
  }}
>
  <thead>
    <tr style={{ borderBottom: "1px solid black" }}>
      <th style={{ textAlign: "left", padding: "6px" }}>
        Particulars
      </th>

      {showBooks === "yes" ? (
        <>
         
          <th style={{ textAlign: "right", padding: "6px" }}>
            Sale
          </th>
          <th style={{ textAlign: "right", padding: "6px" }}>
            Sale Return
          </th>
          <th style={{ textAlign: "right", padding: "6px" }}>
            Net Sale
          </th>
        </>
      ) : (
        <>
          <th style={{ textAlign: "right", padding: "6px" }}>
            Sale
          </th>
          <th style={{ textAlign: "right", padding: "6px" }}>
            Sale Return
          </th>
          <th style={{ textAlign: "right", padding: "6px" }}>
            Net Sale
          </th>
        </>
      )}
    </tr>
  </thead>

  <tbody>
    <tr>
      <td style={{ padding: "6px" }}>
        Report Structure Only
      </td>

      {showBooks === "yes" ? (
        <>
          <td style={{ textAlign: "center", padding: "6px" }}>
            {bookCode || ""}
          </td>
          <td style={{ padding: "6px" }}>
            {bookInfo?.BookName || ""}
          </td>
          <td style={{ textAlign: "right", padding: "6px" }}>
            43
          </td>
          <td style={{ textAlign: "right", padding: "6px" }}>
            0
          </td>
          <td style={{ textAlign: "right", padding: "6px" }}>
            43
          </td>
        </>
      ) : (
        <>
          <td style={{ textAlign: "right", padding: "6px" }}>
            43
          </td>
          <td style={{ textAlign: "right", padding: "6px" }}>
            0
          </td>
          <td style={{ textAlign: "right", padding: "6px" }}>
            43
          </td>
        </>
      )}
    </tr>

    {/* TOTAL ROW */}
    <tr style={{ borderTop: "1px solid black" }}>
      <td style={{ padding: "6px" }}>
        <strong>Total</strong>
      </td>

      {showBooks === "yes" ? (
        <>
          <td></td>
          <td></td>
          <td style={{ textAlign: "right", padding: "6px" }}>
            <strong>43</strong>
          </td>
          <td style={{ textAlign: "right", padding: "6px" }}>
            <strong>0</strong>
          </td>
          <td style={{ textAlign: "right", padding: "6px" }}>
            <strong>43</strong>
          </td>
        </>
      ) : (
        <>
          <td style={{ textAlign: "right", padding: "6px" }}>
            <strong>43</strong>
          </td>
          <td style={{ textAlign: "right", padding: "6px" }}>
            <strong>0</strong>
          </td>
          <td style={{ textAlign: "right", padding: "6px" }}>
            <strong>43</strong>
          </td>
        </>
      )}
    </tr>
  </tbody>
</table>
      </Box>

    </Box>
  );
}