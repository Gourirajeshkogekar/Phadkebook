import { useState, useEffect, useRef } from "react";

import {
  Box,
  Paper,
  Typography,
  Grid,
  Button,
  Stack,
  TextField,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Divider,
  Radio,
  RadioGroup,
  FormControlLabel,
  CircularProgress
} from "@mui/material";

import EventIcon from "@mui/icons-material/Event";
import TagIcon from "@mui/icons-material/Tag";
import PrintIcon from "@mui/icons-material/Print";
import CloseIcon from "@mui/icons-material/Close";

import { useNavigate } from "react-router-dom";

import axios from "axios";
import dayjs from "dayjs";

import html2canvas from "html2canvas";
import jsPDF from "jspdf";

export default function BooksDetails() {

  const navigate = useNavigate();
  const reportRef = useRef();

  const [panel, setPanel] = useState("period");
  const [showDetails, setShowDetails] = useState("yes");
  const [printing, setPrinting] = useState(false);

  /* ================= FINANCIAL YEAR ================= */

  const today = dayjs();
  const fyYear = today.month() >= 3 ? today.year() : today.year() - 1;

  const [startDate, setStartDate] =
    useState(`${fyYear}-04-01`);

  const [endDate, setEndDate] =
    useState(`${fyYear + 1}-03-31`);

  /* ================= BOOK API ================= */

  const [books, setBooks] = useState([]);
  const [loadingBooks, setLoadingBooks] = useState(false);
  const [searchCode, setSearchCode] = useState("");

  useEffect(() => {

    if (!searchCode) {
      setBooks([]);
      return;
    }

    loadBooks(searchCode);

  }, [searchCode]);

  const loadBooks = async (code) => {

    try {

      setLoadingBooks(true);

      const res = await axios.get(
        `https://publication.microtechsolutions.net.in/php/Bookcodeget.php?BookCode=${code}`
      );

      if (Array.isArray(res.data))
        setBooks(res.data);
      else
        setBooks([]);

    }
    catch {
      setBooks([]);
    }
    finally {
      setLoadingBooks(false);
    }

  };

  /* ================= PRINT ================= */

  const handlePrint = async () => {

    setPrinting(true);

    setTimeout(async () => {

      try {

        const element = reportRef.current;

        const canvas = await html2canvas(element, {
          scale: 2,
          useCORS: true
        });

        const imgData = canvas.toDataURL("image/png");

        const pdf = new jsPDF("p", "mm", "a4");

        pdf.addImage(imgData, "PNG", 0, 0, 210, 297);

        window.open(pdf.output("bloburl"), "_blank");

      }
      catch (err) {

        console.error(err);

      }
      finally {

        setPrinting(false);

      }

    }, 500);

  };


  return (

    <Box sx={{
      minHeight: "100vh",
      background: "#f4f6f8",
      p: 1

    }}>

      <Box sx={{ mb: 1, pb: 1, borderBottom: "2px solid #e0e0e0" }}>
        <Typography variant="h5" fontWeight={700} color="primary.main">
         Book Details
        </Typography>
        </Box>

      <Grid container spacing={3}>

        {/* LEFT MENU */}

        <Grid item xs={12} md={3}>

          <Paper sx={{ p: 1 }}>

            <Box spacing={2}>

              <Button
                variant={panel === "period" ? "contained" : "outlined"}
                startIcon={<EventIcon />}
                onClick={() => setPanel("period")}
              >
                Period
              </Button>

              <Button
                variant={panel === "book" ? "contained" : "outlined"}
                startIcon={<TagIcon />}
                onClick={() => setPanel("book")}
              >
                Book Code
              </Button>

            </Box>

          </Paper>

        </Grid>


        {/* RIGHT PANEL */}

        <Grid item xs={12} md={9}>

          <Paper sx={{ p: 1 }}>

            {/* Show Details */}

            <Typography fontWeight={600}>
              Show Details
            </Typography>

            <RadioGroup
              row
              value={showDetails}
              onChange={(e) => setShowDetails(e.target.value)}
            >
              <FormControlLabel value="yes" control={<Radio />} label="Yes" />
              <FormControlLabel value="no" control={<Radio />} label="No" />
            </RadioGroup>

            <Divider sx={{ my: 3 }} />

            {/* Period */}

            <Typography fontWeight={600}>
              Period
            </Typography>

            <Grid container spacing={2} mt={1}>

              <Grid item xs={6}>
                <TextField
                  label="Start Date"
                  type="date"
                  fullWidth
                  size="small"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>

              <Grid item xs={6}>
                <TextField
                  label="End Date"
                  type="date"
                  fullWidth
                  size="small"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>

            </Grid>

            {/* Book Code */}

            {panel === "book" && (

              <Box mt={1}>

                <TextField
                  label="Enter Book Code"
                  fullWidth
                  size="small"
                  value={searchCode}
                  onChange={(e) => setSearchCode(e.target.value)}
                />

                <Paper sx={{ mt: 1, maxHeight: 240, overflow: "auto" }}>

                  {loadingBooks
                    ? <CircularProgress sx={{ m: 2 }} />
                    :
                    <Table size="small">

                      <TableHead>

                        <TableRow>

                          <TableCell><b>Code</b></TableCell>
                          <TableCell><b>Name</b></TableCell>

                        </TableRow>

                      </TableHead>

                      <TableBody>

                        {books.length === 0 &&
                          <TableRow>
                            <TableCell colSpan={2}>
                              No Books Found
                            </TableCell>
                          </TableRow>
                        }

                        {books.map((book, index) => (

                          <TableRow key={index}>

                            <TableCell>{book.BookCode}</TableCell>

                            <TableCell>{book.BookName}</TableCell>

                          </TableRow>

                        ))}

                      </TableBody>

                    </Table>
                  }

                </Paper>

              </Box>

            )}

            {/* Buttons */}

            <Stack direction="row" spacing={2} justifyContent="center" mt={1}>

              <Button
                variant="contained"
                startIcon={<PrintIcon />}
                onClick={handlePrint}
                disabled={printing}
              >
                Print
              </Button>

              <Button
                variant="contained"
                color="error"
                startIcon={<CloseIcon />}
                onClick={() => navigate(-1)}
              >
                Close
              </Button>

            </Stack>

          </Paper>

        </Grid>

      </Grid>


      {/* ================= PRINT AREA ================= */}

      <Box
        ref={reportRef}
        sx={{
          position: "absolute",
          left: "-9999px",
          width: "210mm",
          minHeight: "297mm",
          bgcolor: "#fff",
          p: "15mm",
          fontSize: "12px",
          fontFamily: "serif"
        }}
      >

        <Typography align="center" fontWeight="bold" fontSize={18}>
          PHADKE BOOK HOUSE
        </Typography>

        <Typography align="center" fontSize={14}>
          Book Details Report
        </Typography>

        <Typography align="center" fontSize={12}>
          From {startDate} To {endDate}
        </Typography>

        <Divider sx={{ my: 2 }} />

        <table style={{
          width: "100%",
          borderCollapse: "collapse"
        }}>

          <thead>

            <tr>

              <th style={thStyle}>Sr No</th>
              <th style={thStyle}>Book Code</th>
              <th style={thStyle}>Book Name</th>
              <th style={thStyle}>Sales</th>
              <th style={thStyle}>Challan</th>
              <th style={thStyle}>Total</th>

            </tr>

          </thead>

          <tbody>

            <tr>

              <td colSpan="6" style={tdStyleCenter}>
                Report Structure Only — Data will load from backend
              </td>

            </tr>

          </tbody>

        </table>

      </Box>

    </Box>

  );

}

/* ================= PRINT STYLES ================= */

const thStyle = {
  border: "1px solid black",
  padding: "6px",
  fontWeight: "bold"
};

const tdStyleCenter = {
  border: "1px solid black",
  padding: "8px",
  textAlign: "center"
};










































