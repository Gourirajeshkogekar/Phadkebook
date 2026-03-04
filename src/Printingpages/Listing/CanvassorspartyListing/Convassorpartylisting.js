import { useState, useEffect, useRef } from "react";
import {
  Box,
  Paper,
  Typography,
  Grid,
  List,
  ListItemButton,
  ListItemText,
  TextField,
  MenuItem,
  Checkbox,
  FormControlLabel,
  Button,
  Stack,
  Divider,
  CircularProgress
} from "@mui/material";

import PrintIcon from "@mui/icons-material/Print";
import CloseIcon from "@mui/icons-material/Close";

import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function CanvassorPartyListing() {

  const navigate = useNavigate();
  const reportRef = useRef();

  const [canvassors, setCanvassors] = useState([]);
  const [groupHeads, setGroupHeads] = useState([]);

  const [selectedCanvassor, setSelectedCanvassor] = useState(null);
  const [groupHead, setGroupHead] = useState("");
  const [onlyNameMobile, setOnlyNameMobile] = useState(false);

  const [loading, setLoading] = useState(false);
  const [printing, setPrinting] = useState(false);


  /* ================= LOAD CANVASSOR ================= */

  useEffect(() => {
    loadCanvassors();
    loadGroupHeads();
  }, []);

  const loadCanvassors = async () => {
    try {
      setLoading(true);
      const res = await axios.get(
        "https://publication.microtechsolutions.net.in/php/get/getCanvassorMaster.php"
      );
      setCanvassors(Array.isArray(res.data) ? res.data : []);
    } catch {
      setCanvassors([]);
    } finally {
      setLoading(false);
    }
  };


  /* ================= LOAD GROUP HEAD ================= */

  const loadGroupHeads = async () => {
    try {
      const res = await axios.get(
        "https://publication.microtechsolutions.net.in/php/AccountGroupget.php"
      );
      setGroupHeads(Array.isArray(res.data) ? res.data : []);
    } catch {
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

    <Box sx={{ p: 1, background: "#f3f4f6", minHeight: "90vh" }}>

      <Typography variant="h6" textAlign='center' fontWeight={700} mb={2}>
        Canvassor Party Listing
      </Typography>

      <Paper elevation={4} sx={{ p: 1, borderRadius: 2 }}>

        <Grid container spacing={3}>

          {/* LEFT LIST */}

          <Grid item xs={12} md={4}>
            <Typography fontWeight={700} mb={1}>
              Canvassor Name
            </Typography>

            <Box sx={listBoxStyle}>

              {loading
                ?
                <CircularProgress />
                :
                <List dense>

                  {canvassors.map((c) => (
                    <ListItemButton
                      key={c.Id}
                      selected={selectedCanvassor?.Id === c.Id}
                      onClick={() => setSelectedCanvassor(c)}
                    >
                      <ListItemText
                        primary={c.CanvassorName || c.name}
                        secondary={c.CityName}
                      />
                    </ListItemButton>
                  ))}

                </List>
              }

            </Box>
          </Grid>


          {/* RIGHT */}

          <Grid item xs={12} md={8}>

            <Paper sx={{ p: 1, mb: 1 }}>
              <Typography fontWeight={700} mb={1}>
                Group Head
              </Typography>

              <TextField
                select
                size="small"
                fullWidth
                value={groupHead}
                onChange={(e) => setGroupHead(e.target.value)}
              >
                <MenuItem value="">Select</MenuItem>
                {groupHeads.map((g) => (
                  <MenuItem key={g.Id} value={g.GroupName || g.AccountGroupName}>
                    {g.GroupName || g.AccountGroupName}
                  </MenuItem>
                ))}
              </TextField>
            </Paper>

            <Paper sx={{ p: 1 }}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={onlyNameMobile}
                    onChange={(e) =>
                      setOnlyNameMobile(e.target.checked)
                    }
                  />
                }
                label="Print Only Name & Mobile No."
              />
            </Paper>

          </Grid>

        </Grid>


        {/* BUTTONS */}

        <Stack direction="row" spacing={4} justifyContent="center" mt={2}>
          <Button
            variant="contained"
            startIcon={<PrintIcon />}
            onClick={handlePrint}
            disabled={printing}
          >
            PRINT
          </Button>

          <Button
            variant="contained"
            color="error"
            startIcon={<CloseIcon />}
            onClick={() => navigate(-1)}
          >
            CLOSE
          </Button>
        </Stack>

      </Paper>



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
          fontFamily: "serif"
        }}
      >

        <Typography align="center" fontWeight="bold" fontSize={18}>
          PHADKE BOOK HOUSE
        </Typography>

      <Typography variant="h6" textAlign='center'   mb={2}>
        Canvassor Party Listing
      </Typography>
        <Typography align="center" mb={3}>
          SUNDRY DEBTORS - COLL.
        </Typography>

        <table
          width="100%"
          style={{
            borderCollapse: "collapse",
            fontSize: "12px"
          }}
        >
          <thead>
            <tr>
              <th style={thStyle}>Area</th>
              <th style={thStyle}>Particulars</th>
              <th style={thStyle}>Account Group</th>
            </tr>
          </thead>

          <tbody>

            {selectedCanvassor && (
              <tr>
                <td style={tdStyle}>
                  {selectedCanvassor.CityName || ""}
                </td>
                <td style={tdStyle}>
                  {selectedCanvassor.CanvassorName}
                </td>
                <td style={tdStyle}>
                  {groupHead || ""}
                </td>
              </tr>
            )}

          </tbody>

        </table>

      </Box>

    </Box>

  );
}


/* ================= STYLES ================= */

const listBoxStyle = {
  border: "1px solid #999",
  padding: 5,
  height: 300,
  overflowY: "auto",
  background: "#fff"
};

const thStyle = {
  border: "1px solid black",
  padding: "6px",
  textAlign: "left"
};

const tdStyle = {
  border: "1px solid black",
  padding: "6px"
};