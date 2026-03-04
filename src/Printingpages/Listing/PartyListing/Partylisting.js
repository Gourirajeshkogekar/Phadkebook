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
  Stack
} from "@mui/material";

import PrintIcon from "@mui/icons-material/Print";
import CloseIcon from "@mui/icons-material/Close";

import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function PartyListing() {

  const navigate = useNavigate();
  const reportRef = useRef();

  const [groupHead, setGroupHead] = useState("");
  const [city, setCity] = useState("");

  const [mailingFormat, setMailingFormat] = useState(true);
  const [onlyNameMobile, setOnlyNameMobile] = useState(false);

  const [cities, setCities] = useState([]);
  const [groupHeads, setGroupHeads] = useState([]);

  const [printing, setPrinting] = useState(false);

  /* ================= LOAD DATA ================= */

  useEffect(() => {
    loadCities();
    loadGroupHeads();
  }, []);

  const loadCities = async () => {
    try {

      const res = await axios.get(
        "https://publication.microtechsolutions.net.in/php/Collegeget.php"
      );

      let list = [];

      if (Array.isArray(res.data)) {
        list = res.data;
      } else if (Array.isArray(res.data.data)) {
        list = res.data.data;
      } else if (Array.isArray(res.data.result)) {
        list = res.data.result;
      }

      // Unique City Names
      const uniqueCityNames = [
        ...new Set(list.map(item => item.CityName))
      ];

      setCities(uniqueCityNames);

    } catch (err) {
      console.error("City API Error:", err);
      setCities([]);
    }
  };

  const loadGroupHeads = async () => {
    try {

      const res = await axios.get(
        "https://publication.microtechsolutions.net.in/php/AccountGroupget.php"
      );

      let list = [];

      if (Array.isArray(res.data)) {
        list = res.data;
      } else if (Array.isArray(res.data.data)) {
        list = res.data.data;
      } else if (Array.isArray(res.data.result)) {
        list = res.data.result;
      }

      setGroupHeads(list);

    } catch (err) {
      console.error("Group Head API Error:", err);
      setGroupHeads([]);
    }
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

  /* ================= UI ================= */

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "#eef2f6", pt: 4 }}>
      <Box width={520} mx="auto">

        <Typography variant="h6"  textAlign='center' fontWeight={700} mb={3}>
          Party Listing
        </Typography>

        <Paper sx={{ p: 3, borderRadius: 3 }}>

          <Stack spacing={3}>

            {/* GROUP HEAD */}
            <TextField
              select
              size="small"
              label="Group Head"
              value={groupHead}
              onChange={(e) => setGroupHead(e.target.value)}
              fullWidth
            >
              <MenuItem value="">Select</MenuItem>
              {groupHeads.map((g, index) => (
                <MenuItem
                  key={index}
                  value={g.GroupName || g.AccountGroupName}
                >
                  {g.GroupName || g.AccountGroupName}
                </MenuItem>
              ))}
            </TextField>

            {/* CITY */}
            <TextField
              select
              size="small"
              label="City / District"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              fullWidth
            >
              <MenuItem value="">Select</MenuItem>
              {cities.map((c, index) => (
                <MenuItem key={index} value={c}>
                  {c}
                </MenuItem>
              ))}
            </TextField>

          </Stack>

          {/* OPTIONS */}
          <Grid container spacing={2} mt={3}>
            <Grid item xs={6}>
              <FormControlLabel
                control={
                  <Checkbox
                    size="small"
                    checked={mailingFormat}
                    onChange={(e) =>
                      setMailingFormat(e.target.checked)
                    }
                  />
                }
                label="Mailing Format"
              />
            </Grid>

            <Grid item xs={6}>
              <FormControlLabel
                control={
                  <Checkbox
                    size="small"
                    checked={onlyNameMobile}
                    onChange={(e) =>
                      setOnlyNameMobile(e.target.checked)
                    }
                  />
                }
                label="Only Name & Mobile"
              />
            </Grid>
          </Grid>

          {/* BUTTONS */}
          <Stack
            direction="row"
            spacing={2}
            justifyContent="center"
            mt={3}
          >
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
      </Box>

      {/* ================= PRINT STRUCTURE ================= */}

      <Box
        ref={reportRef}
        sx={{
          position: "absolute",
          left: "-9999px",
          width: "210mm",
          minHeight: "297mm",
          p: "20mm",
          bgcolor: "#fff",
          fontFamily: "serif",
          fontSize: "13px"
        }}
      >

        <Typography align="center" fontWeight="bold" fontSize={18}>
          PHADKE BOOK HOUSE
        </Typography>




      <Typography variant="h6" textAlign='center'  mb={2}>
         Party Listing
      </Typography>

        <Typography align="center" mb={3}>
          SUNDRY DEBTORS - COLL.
        </Typography>

        <table width="100%" style={{ borderCollapse: "collapse" }}>
          <thead>
            <tr>
              <th style={thStyle}>Area</th>
              <th style={thStyle}>Particulars</th>
              <th style={thStyle}>Account Group</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style={tdStyle}>{city || "ALL"}</td>
              <td style={tdStyle}>Sample Party Name</td>
              <td style={tdStyle}>{groupHead || ""}</td>
            </tr>
          </tbody>
        </table>

      </Box>

    </Box>
  );
}

const thStyle = {
  border: "1px solid black",
  padding: "6px",
  textAlign: "left"
};

const tdStyle = {
  border: "1px solid black",
  padding: "6px"
};