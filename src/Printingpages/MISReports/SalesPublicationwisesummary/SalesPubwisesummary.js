import { useState, useEffect, useRef } from "react";

import {
  Box,
  Paper,
  Typography,
  Radio,
  RadioGroup,
  FormControlLabel,
  Button,
  Grid,
  Stack,
  Checkbox,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  TextField,
  Divider,
  CircularProgress,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody
} from "@mui/material";

import PrintIcon from "@mui/icons-material/Print";
import CloseIcon from "@mui/icons-material/Close";
import MenuBookIcon from "@mui/icons-material/MenuBook";
import EventIcon from "@mui/icons-material/Event";

import { useNavigate } from "react-router-dom";

import axios from "axios";
import dayjs from "dayjs";

import html2canvas from "html2canvas";
import jsPDF from "jspdf";

export default function SalesPublicationSummary() {

  const navigate = useNavigate();
  const reportRef = useRef();

  const [printing, setPrinting] = useState(false);

  const [mode, setMode] = useState("month");

  const [showPub, setShowPub] = useState(true);
  const [showPeriod, setShowPeriod] = useState(false);

  const [publications, setPublications] = useState([]);
  const [loading, setLoading] = useState(false);

  const [selectedPubs, setSelectedPubs] = useState([]);
const [activeTab, setActiveTab] = useState("publication"); // Integrated filter state
  /* ================= FINANCIAL YEAR ================= */

  const today = dayjs();

  const fyYear =
    today.month() >= 3
      ? today.year()
      : today.year() - 1;

  const [startDate, setStartDate] =
    useState(`${fyYear}-04-01`);

  const [endDate, setEndDate] =
    useState(`${fyYear + 1}-03-31`);

  /* ================= FETCH PUBLICATIONS ================= */

  useEffect(() => {
    fetchPublications();
  }, []);

  const fetchPublications = async () => {

    try {

      setLoading(true);

      const res = await axios.get(
        "https://publication.microtechsolutions.net.in/php/Publicationget.php"
      );

      if (Array.isArray(res.data)) {

        const names = res.data.map(
          x =>
            x.PublicationName ||
            x.Publication ||
            Object.values(x)[0]
        );

        setPublications(names);

      }

    }
    catch {
      setPublications([]);
    }
    finally {
      setLoading(false);
    }

  };

  /* ================= SELECT ================= */

  const togglePub = (name) => {

    setSelectedPubs(prev =>
      prev.includes(name)
        ? prev.filter(x => x !== name)
        : [...prev, name]
    );

  };

  const handleSelectAll = () => {

    if (selectedPubs.length === publications.length)
      setSelectedPubs([]);
    else
      setSelectedPubs(publications);

  };

  /* ================= PRINT FUNCTION ================= */

  const handlePrint = async () => {

    if (!reportRef.current) return;

    setPrinting(true);

    setTimeout(async () => {

      try {

        const canvas =
          await html2canvas(reportRef.current, {
            scale: 2,
            useCORS: true
          });

        const imgData =
          canvas.toDataURL("image/png");

        const pdf =
          new jsPDF("p", "mm", "a4");

        const width = 190;
        const height =
          (canvas.height * width) /
          canvas.width;

        pdf.addImage(
          imgData,
          "PNG",
          10,
          10,
          width,
          height
        );

        window.open(
          pdf.output("bloburl"),
          "_blank"
        );

      }
      catch (err) {

        console.error(err);

      }
      finally {

        setPrinting(false);

      }

    }, 500);

  };

  /* ================= UI ================= */

  return (

   <Box>
      {/* 1. Header Section */}
      <Box sx={{ mb: 3, pb: 1, borderBottom: "2px solid #e0e0e0" }}>
        <Typography variant="h5" fontWeight={700} color="primary.main">
          Sales Publicationwise Summary
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Configure your report parameters below
        </Typography>
      </Box>

      <Grid container spacing={4}>
        {/* 2. Configuration Options */}
        <Grid item xs={12} md={5}>
          <Typography variant="subtitle2" fontWeight={700} gutterBottom>
            REPORT MODE
          </Typography>
          <RadioGroup row value={mode} onChange={(e) => setMode(e.target.value)}>
            <FormControlLabel value="date" control={<Radio size="small" />} label="Datewise" />
            <FormControlLabel value="month" control={<Radio size="small" />} label="Monthwise" />
          </RadioGroup>

          <Divider sx={{ my: 3 }} />

          {/* Conditional Filter View */}
          {activeTab === "publication" ? (
            <Box>
              <Stack direction="row" justifyContent="space-between" alignItems="center" mb={1}>
                <Typography variant="subtitle2" fontWeight={700}>SELECT PUBLICATIONS</Typography>
                <Button size="small" onClick={handleSelectAll} sx={{ textTransform: 'none' }}>
                  {selectedPubs.length === publications.length ? "Deselect All" : "Select All"}
                </Button>
              </Stack>
              <Paper variant="outlined" sx={{ height: 300, overflow: 'auto', bgcolor: '#fff' }}>
                {loading ? <Box p={2} textAlign="center"><CircularProgress size={24}/></Box> : (
                  <List dense>
                    {publications.map((pub, i) => (
                      <ListItemButton key={i} onClick={() => setSelectedPubs(prev => prev.includes(pub) ? prev.filter(x => x !== pub) : [...prev, pub])}>
                        <ListItemIcon><Checkbox checked={selectedPubs.includes(pub)} size="small" /></ListItemIcon>
                        <ListItemText primary={pub} primaryTypographyProps={{ fontSize: 13 }} />
                      </ListItemButton>
                    ))}
                  </List>
                )}
              </Paper>
            </Box>
          ) : (
            <Box>
              <Typography variant="subtitle2" fontWeight={700} mb={2}>SELECT PERIOD</Typography>
              <Stack spacing={2}>
                <TextField label="Start Date" type="date" fullWidth size="small" value={startDate} onChange={(e) => setStartDate(e.target.value)} InputLabelProps={{ shrink: true }} />
                <TextField label="End Date" type="date" fullWidth size="small" value={endDate} onChange={(e) => setEndDate(e.target.value)} InputLabelProps={{ shrink: true }} />
              </Stack>
            </Box>
          )}
        </Grid>

        {/* 3. Summary/Preview Info Area */}
        <Grid item xs={12} md={7}>
          <Paper variant="outlined" sx={{ p: 2, bgcolor: "#fafafa", height: '100%', borderStyle: 'dashed' }}>
            <Typography variant="subtitle2" color="text.secondary" fontWeight={700} gutterBottom>
              SELECTION SUMMARY
            </Typography>
            <Stack spacing={1}>
              <Typography variant="body2"><strong>Mode:</strong> {mode === 'date' ? 'Datewise' : 'Monthwise'}</Typography>
              <Typography variant="body2"><strong>Period:</strong> {startDate} to {endDate}</Typography>
              <Typography variant="body2"><strong>Selected:</strong> {selectedPubs.length} Publications</Typography>
            </Stack>
            
            <Box mt={4}>
               <Typography variant="caption" color="warning.main" display="block" sx={{ mb: 2 }}>
                 * Ensure all publications are selected for a complete summary.
               </Typography>
               <Stack direction="row" spacing={2}>
                  <Button variant="contained" startIcon={<PrintIcon />} onClick={handlePrint}  fullWidth>
                    Print Report
                  </Button>
                  <Button variant="outlined" color="error" startIcon={<CloseIcon />} fullWidth>
                    Close
                  </Button>
               </Stack>
            </Box>
          </Paper>
        </Grid>
      </Grid>
   


      {/* ================= PRINT AREA ================= */}

      <Box
        ref={reportRef}
        sx={{
          position:"absolute",
          left:"-9999px",
          width:"210mm",
          minHeight:"297mm",
          background:"#fff",
          padding:"15mm",
          fontSize:"11px",
          fontFamily:"serif"
        }}
      >

        {/* HEADER */}

        <Typography align="center" fontWeight="bold" fontSize={16}>
          PHADKE BOOK HOUSE
        </Typography>

        <Typography align="center" fontSize={13}>
          Sales Publicationwise Summary
        </Typography>

        <Typography align="center" fontSize={11}>
          From {startDate} To {endDate}
        </Typography>

        <Divider sx={{ my:1 }}/>


        {/* TABLE STRUCTURE */}

        <Table size="small">

          <TableHead>

            <TableRow>

              <TableCell sx={headerCell}>
                Particulars
              </TableCell>

              <TableCell align="right" sx={headerCell}>
                Sale
              </TableCell>

              <TableCell align="right" sx={headerCell}>
                Sale Return
              </TableCell>

              <TableCell align="right" sx={headerCell}>
                Net Sale
              </TableCell>

            </TableRow>

          </TableHead>

          <TableBody>

            <TableRow>

              <TableCell colSpan={4} align="center">
                (Data will load from backend)
              </TableCell>

            </TableRow>

          </TableBody>

        </Table>

      </Box>

    </Box>

  );

}

/* ================= STYLES ================= */

const listBoxStyle = {

  border:"1px solid #bbb",
  padding:"6px",
  height:"240px",
  overflowY:"auto",
  background:"#fff"

};

const headerCell = {

  fontWeight:"bold",
  borderBottom:"1px solid black"

};






























