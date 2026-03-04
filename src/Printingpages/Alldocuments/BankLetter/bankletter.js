import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Paper,
  Typography,
  TextField,
  Checkbox,
  FormControlLabel,
  Button,
  Stack,
  Divider
} from "@mui/material";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import BankletterPrint from "./BankletterPrint";

function BankLetter() {
  const [startNo, setStartNo] = useState("");
  const [endNo, setEndNo] = useState("");
  const [allRequired, setAllRequired] = useState(false);
  const [printing, setPrinting] = useState(false);
  const [showPreview, setShowPreview] = useState(false);

  const reportRef = useRef();
  const navigate = useNavigate();

  const handlePrint = async () => {
  setPrinting(true);
  try {
    const element = reportRef.current;
    if (!element) return;

    const canvas = await html2canvas(element, {
      scale: 2, // 3 might be too heavy for some browsers, 2 is usually enough
      useCORS: true,
      logging: false,
      backgroundColor: "#ffffff",
    });

    const imgData = canvas.toDataURL("image/png");
    
    // Calculate PDF page size
    const pdf = new jsPDF("p", "mm", "a4");
    const imgProps = pdf.getImageProperties(imgData);
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

    pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
          window.open(pdf.output("bloburl"), "_blank");

    // Instead of window.open (which pop-up blockers stop), use save:
    // pdf.save("Bank-Letter.pdf"); 

  } catch (error) {
    console.error("Print Error:", error);
  } finally {
    setPrinting(false);
  }
};

  const handleClose = () => {
    navigate(-1);
  };

  // THIS SECTION SHOWS THE FULL PAGE REPORT
  if (showPreview) {
    return (
      <Box sx={{ bgcolor: "#525659", minHeight: "100vh", p: 3, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Stack direction="row" spacing={2} sx={{ mb: 3, position: 'sticky', top: 0, zIndex: 10 }}>
          <Button variant="contained" onClick={handlePrint} disabled={printing} sx={{ bgcolor: '#1a73e8' }}>
            {printing ? "Generating PDF..." : "Confirm & Download PDF"}
          </Button>
          <Button variant="contained" color="error" onClick={() => setShowPreview(false)}>
            Back to Edit
          </Button>
        </Stack>

        {/* This Paper simulates the A4 page at 100% resolution */}
        <Paper elevation={10} sx={{ width: "210mm", bgcolor: 'white', overflow: 'hidden' }}>
          <BankletterPrint ref={reportRef} />
        </Paper>
      </Box>
    );
  }

  // THIS SECTION SHOWS THE INPUT FORM
  return (
    <Box sx={{ minHeight: "100vh", background: "linear-gradient(135deg, #f5f7fa 0%, #e4e8ee 100%)", display: "flex", justifyContent: "center", pt: "60px" }}>
      <Box>
        <Typography variant="h5" fontWeight="700" textAlign="center" mb={4}>
          Bank Letter
        </Typography>

        <Paper elevation={6} sx={{ width: 520, padding: "32px 36px", borderRadius: "12px" }}>
          <Box display="flex" alignItems="center" mb={3}>
            <Typography sx={{ width: 130, fontWeight: 600 }}>Start No :</Typography>
            <TextField size="small" fullWidth value={startNo} onChange={(e) => setStartNo(e.target.value)} />
          </Box>

          <Box display="flex" alignItems="center" mb={3}>
            <Typography sx={{ width: 130, fontWeight: 600 }}>End No :</Typography>
            <TextField size="small" fullWidth value={endNo} onChange={(e) => setEndNo(e.target.value)} />
          </Box>

          <Divider sx={{ my: 2 }} />

          <FormControlLabel
            control={<Checkbox checked={allRequired} onChange={(e) => setAllRequired(e.target.checked)} />}
            label={<Typography fontWeight={600} fontSize="14px">All Challans are Required</Typography>}
          />
        </Paper>

        <Box display="flex" justifyContent="center" gap={3} mt={4}>
          <Button
            variant="contained"
            size="large"
            onClick={() => setShowPreview(true)} // FIXED: Now shows the preview first
            sx={{ px: 5, py: 1.2, borderRadius: "8px", fontWeight: 600, background: "linear-gradient(135deg, #1e88e5, #1565c0)" }}
          >
            Print Report
          </Button>

          <Button variant="contained" size="large" color="error" onClick={handleClose} sx={{ px: 5, py: 1.2, borderRadius: "8px" }}>
            Close
          </Button>
        </Box>
      </Box>
    </Box>
  );
}

export default BankLetter;