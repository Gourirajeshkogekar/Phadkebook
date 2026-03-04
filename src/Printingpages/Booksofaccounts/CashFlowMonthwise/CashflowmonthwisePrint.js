import React from "react";
import { Box, Typography, Button } from "@mui/material";
import PrintIcon from "@mui/icons-material/Print";
import { useLocation } from "react-router-dom";

function CashFlowMonthwisePrint() {
  const { state } = useLocation() || {};
  const { startDate, endDate } = state || {};

  return (
    <Box sx={{ bgcolor: "#e9edf3", minHeight: "100vh", py: 3 }}>

      <Box id="print-area" sx={{
        width: "210mm",
        minHeight: "297mm",
        mx: "auto",
        bgcolor: "#fff",
        px: "18mm",
        py: "14mm",
        boxShadow: "0 0 20px rgba(0,0,0,0.15)",
        fontFamily: '"Times New Roman", serif',
        fontSize: 13
      }}>

        <Typography align="center" fontWeight={700}>
          Phadke Prakashan, Kolhapur.
        </Typography>

        <Typography align="center" fontSize={12}>
          Phadke Bhavan, Near Hari Mandir, Dudhal Kolhapur 416012
        </Typography>

        <Typography align="center" mt={1}>
          Cash Flow Monthwise
        </Typography>

        <Typography align="center" fontSize={12}>
          From {startDate} to {endDate}
        </Typography>

        <Typography align="right" fontSize={12} mt={-3}>
          Page # 1
        </Typography>

        {/* dashed header line */}
        <Box mt={2} borderTop="1px dashed #000" />

        {/* table header */}
        <Box
          display="grid"
          gridTemplateColumns="140px 1fr 1fr 1fr 1fr"
          fontWeight={700}
          mt={1}
        >
          <div>Date</div>
          <div>Opening Balance</div>
          <div>Debit</div>
          <div>Credit</div>
          <div>Closing Balance</div>
        </Box>

        <Box borderTop="1px dashed #000" mt={0.5} />

        {/* backend rows area */}
        <Box mt={5}>
          <Typography fontSize={12}>
            (Monthwise cash flow data will render here from backend)
          </Typography>
        </Box>

        <Box mt={6} borderTop="1px solid #000" />

      </Box>

     

      <style>{`
        @page { size: A4; margin: 10mm; }
        @media print {
          body * { visibility: hidden; }
          #print-area, #print-area * { visibility: visible; }
          #print-area {
            position: absolute;
            left: 0;
            top: 0;
            width: 210mm;
            box-shadow: none;
          }
        }
      `}</style>

    </Box>
  );
}

export default CashFlowMonthwisePrint;