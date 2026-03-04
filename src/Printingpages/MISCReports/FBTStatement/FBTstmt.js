import React, { useState, useRef } from "react";
import {
  Box,
  Paper,
  Typography,
  Button,
  Stack
} from "@mui/material";
import { useNavigate } from "react-router-dom";

import { LocalizationProvider, DatePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";

import PrintIcon from "@mui/icons-material/Print";
import CloseIcon from "@mui/icons-material/Close";

import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import dayjs from "dayjs";

export default function FbtStmt() {

  const navigate = useNavigate();
  const reportRef = useRef();

  const [printing, setPrinting] = useState(false);

  /* ================= FINANCIAL YEAR DEFAULT ================= */

  const today = dayjs();
  const currentYear = today.month() >= 3 ? today.year() : today.year() - 1;

  const [startDate, setStartDate] = useState(
    dayjs(`${currentYear}-04-01`)
  );

  const [endDate, setEndDate] = useState(
    dayjs(`${currentYear + 1}-03-31`)
  );

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
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Box sx={{ minHeight: "100vh", bgcolor: "#eef2f6", pt: 4 }}>

        <Box width={520} mx="auto">

          <Typography variant="h5" fontWeight={600} textAlign="center" mb={2}>
            Period
          </Typography>

          <Paper sx={{ p: 3, borderRadius: 3, boxShadow: 3 }}>
            <Stack spacing={2}>

              {/* START DATE */}
              <Box display="grid" gridTemplateColumns="120px 1fr" gap={2}>
                <Typography fontWeight={600}>Start Date :</Typography>
                <DatePicker
                  value={startDate}
                  onChange={setStartDate}
                  slotProps={{
                    textField: { size: "small", fullWidth: true }
                  }}
                />
              </Box>

              {/* END DATE */}
              <Box display="grid" gridTemplateColumns="120px 1fr" gap={2}>
                <Typography fontWeight={600}>End Date :</Typography>
                <DatePicker
                  value={endDate}
                  onChange={setEndDate}
                  slotProps={{
                    textField: { size: "small", fullWidth: true }
                  }}
                />
              </Box>

            </Stack>
          </Paper>

          {/* BUTTONS */}
          <Stack direction="row" spacing={2} justifyContent="center" mt={3}>
            <Button
              variant="contained"
              startIcon={<PrintIcon />}
              onClick={handlePrint}
              disabled={printing}
              sx={{ px: 4, fontWeight: 600 }}
            >
              Print
            </Button>

            <Button
              variant="contained"
              color="error"
              startIcon={<CloseIcon />}
              onClick={() => navigate(-1)}
              sx={{ px: 4, fontWeight: 600 }}
            >
              Close
            </Button>
          </Stack>

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
            fontFamily: "serif"
          }}
        >

          <Typography align="center" fontWeight="bold" fontSize={18}>
            PHADKE BOOK HOUSE
          </Typography>

          <Typography align="center" mb={2}>
            FBT Statement
          </Typography>

          <Typography>
            Period : {startDate?.format("DD-MM-YYYY")} To{" "}
            {endDate?.format("DD-MM-YYYY")}
          </Typography>

          <hr />

          {/* Table Structure Only */}
          <table width="100%" style={{ borderCollapse: "collapse" }}>
            <thead>
              <tr>
                <th style={thStyle}>Sr No</th>
                <th style={thStyle}>Particular</th>
                <th style={thStyle}>Amount</th>
              </tr>
            </thead>
            <tbody>
              {/* Data will load here later */}
            </tbody>
          </table>

        </Box>

      </Box>
    </LocalizationProvider>
  );
}

/* ================= TABLE STYLE ================= */

const thStyle = {
  border: "1px solid black",
  padding: "6px",
  textAlign: "left"
};