import React, { useState, useRef } from "react";
import { Box, Paper, Typography, TextField, Checkbox, FormControlLabel, Button, Divider } from "@mui/material";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import PurchaseBillPrint from "./PurchasebillPrint";
import { useNavigate } from "react-router-dom";

function PurchaseBill() {
  const [startNo, setStartNo] = useState("");
  const [endNo, setEndNo] = useState("");
  
  // 🔹 Move Bill states here
  const [billNo, setBillNo] = useState("");
  const [billDate, setBillDate] = useState("");
  
  const [allRequired, setAllRequired] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [printing, setPrinting] = useState(false);
  const reportRef = useRef();

  const mockData = {
    startNo,
    endNo,
    billNo,     // 🔹 Pass state to mockData
    billDate,   // 🔹 Pass state to mockData
    vendorName: "M/S Sample Supplier",
    rows: [
      { code: "BK001", name: "Marathi Sahitya", qty: 50, price: 200, disc: 10, amount: 9000 },
      { code: "BK002", name: "History of India", qty: 20, price: 500, disc: 15, amount: 8500 }
    ]
  };

  const navigate = useNavigate();
  const handleClose = () => navigate(-1);

  const handlePrint = async () => {
    setPrinting(true);
    // 🔹 Small timeout to ensure React re-renders the "Plain Text" version for the screenshot
    setTimeout(async () => {
      try {
        const element = reportRef.current;
        if (!element) return;

        const canvas = await html2canvas(element, { scale: 2, useCORS: true, backgroundColor: "#ffffff" });
        const imgData = canvas.toDataURL("image/png");
        const pdf = new jsPDF("p", "mm", "a4");
        pdf.addImage(imgData, "PNG", 0, 0, 210, 297);
        window.open(pdf.output("bloburl"), "_blank");
      } catch (error) {
        console.error("PDF Generation Error:", error);
      } finally {
        setPrinting(false);
      }
    }, 100); 
  };

  if (showPreview) {
    return (
      <Box sx={{ minHeight: "100vh", py: 4, bgcolor: "#525659" }}>
        <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, mb: 3 }} className="no-print">
          <Button variant="contained" onClick={handlePrint} disabled={printing}>
            {printing ? "Generating PDF..." : "Confirm & Download"}
          </Button>
          <Button variant="contained" color="error" onClick={() => setShowPreview(false)}>
            Go Back
          </Button>
        </Box>
        <PurchaseBillPrint 
          ref={reportRef} 
          data={mockData} 
          isPrinting={printing}
          // 🔹 Pass setters so the child can still update the value
          setBillNo={setBillNo}
          setBillDate={setBillDate}
        />
      </Box>
    );
  }

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #f5f7fa 0%, #e4e8ee 100%)",
        display: "flex",
        justifyContent: "center",
        paddingTop: "60px"
      }}
    >
      <Box>
        {/* PAGE HEADING */}
        <Typography
          variant="h6"
          fontWeight="700"
          textAlign="center"
          mb={4}
        >
          Purchase Bill
        </Typography>

        {/* CARD */}
        <Paper
          elevation={6}
          sx={{
            width: 520,
            padding: "32px 36px",
            borderRadius: "12px"
          }}
        >
          {/* START NO */}
          <Box display="flex" alignItems="center" mb={3}>
            <Typography sx={{ width: 140, fontWeight: 600 }}>
              Start No :
            </Typography>
            <TextField
              size="small"
              fullWidth
              value={startNo}
              onChange={(e) => setStartNo(e.target.value)}
            />
          </Box>

          {/* END NO */}
          <Box display="flex" alignItems="center" mb={3}>
            <Typography sx={{ width: 140, fontWeight: 600 }}>
              End No :
            </Typography>
            <TextField
              size="small"
              fullWidth
              value={endNo}
              onChange={(e) => setEndNo(e.target.value)}
            />
          </Box>

          <Divider sx={{ my: 2 }} />

          {/* CHECKBOX */}
          <FormControlLabel
            control={
              <Checkbox
                checked={allRequired}
                onChange={(e) => setAllRequired(e.target.checked)}
              />
            }
            label={
              <Typography fontWeight={600}>
                All Challans are Required
              </Typography>
            }
          />
        </Paper>

        {/* BUTTONS */}
        <Box display="flex" justifyContent="center" gap={3} mt={4}>
          <Button
            variant="contained"
            size="large"
            sx={{ px: 5 }}
            onClick={() => setShowPreview(true)} // FIXED: Now shows the preview first
          >
            Print Report
          </Button>

          <Button
            variant="contained"
            color="error"
            size="large"
            sx={{ px: 5 }}
            onClick={handleClose}
          >
            Close
          </Button>
        </Box>
      </Box>
    </Box>
  );
}

export default PurchaseBill;