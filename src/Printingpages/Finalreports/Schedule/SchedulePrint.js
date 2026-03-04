import React from "react";
import { Box, Typography } from "@mui/material";
import { useLocation } from "react-router-dom";

function fmt(d) {
  if (!d) return "   /   / 2026"; 
  return new Date(d).toLocaleDateString("en-GB");
}

export default function SchedulePrintPage() {
  const { state } = useLocation();
  const asOn = fmt(state?.endDate);

  // Even tighter column widths for a high-density look
  const colWidths = "40px 1fr 100px 100px 100px";

  return (
    <Box sx={{ bgcolor: "#fff", minHeight: "100vh", color: "#000", p: 0.5, fontFamily: "'Times New Roman', Times, serif" }}>
      <Box sx={{ maxWidth: "750px", mx: "auto" }}>
        
        {/* ================= HEADER ================= */}
        <Box sx={{ position: "relative", mb: 0 }}>
          <Typography textAlign="center" sx={{ fontSize: "12px", fontWeight: 700, textTransform: "uppercase", lineHeight: 1.2 }}>
            PHADKE BOOK HOUSE
          </Typography>
          <Typography sx={{ position: "absolute", right: 0, top: 0, fontSize: "9px" }}>
            Page 1 of 1
          </Typography>
        </Box>

        <Typography textAlign="center" sx={{ fontSize: "11px", fontWeight: 700, mb: 0.5 }}>
          Schedule As On {asOn}
        </Typography>

        {/* ================= COMPACT TABLE HEADER ================= */}
        <Box
          display="grid"
          gridTemplateColumns={colWidths}
          sx={{
            borderTop: "1px solid #000",
            borderBottom: "1px solid #000",
            py: 0.1,
            px: 0.5
          }}
        >
          {["Sr. No", "Account Name", "Debit", "Credit", "Balance"].map((label, i) => (
            <Typography key={label} sx={{ fontWeight: 700, fontSize: "10px", textAlign: i > 1 ? "right" : "left" }}>
              {label}
            </Typography>
          ))}
        </Box>

        {/* ================= BLANK DATA SECTION ================= */}
        <Box sx={{ mt: 0.5 }}>
          {/* Main Category Title Placeholder */}
          <Typography sx={{ fontWeight: 700, textDecoration: "underline", fontSize: "10px", textAlign: "center", mb: 0.2 }}>
            &nbsp;
          </Typography>

          {/* High-density empty rows */}
          {[...Array(10)].map((_, index) => (
            <Box key={index} display="grid" gridTemplateColumns={colWidths} sx={{ py: 0, px: 0.5, borderBottom: "0.2px solid #eee" }}>
              <Typography sx={{ fontSize: "9.5px", color: "#666" }}>{index + 1}</Typography>
              <Typography sx={{ fontSize: "9.5px" }}>&nbsp;</Typography>
              <Typography sx={{ fontSize: "9.5px", textAlign: "right" }}>-</Typography>
              <Typography sx={{ fontSize: "9.5px", textAlign: "right" }}>-</Typography>
              <Typography sx={{ fontSize: "9.5px", textAlign: "right" }}>-</Typography>
            </Box>
          ))}

          {/* ================= TOTALS ================= */}
          <Box
            display="grid"
            gridTemplateColumns={colWidths}
            sx={{
              mt: 1,
              pt: 0.2,
              borderTop: "1px solid #000",
              borderBottom: "2.5px double #000",
              px: 0.5,
              pb: 0.2
            }}
          >
            <Box />
            <Typography sx={{ fontWeight: 700, fontSize: "10px", textAlign: "center" }}>Grand Total</Typography>
            <Typography sx={{ fontWeight: 700, fontSize: "10px", textAlign: "right" }}>0.00</Typography>
            <Typography sx={{ fontWeight: 700, fontSize: "10px", textAlign: "right" }}>0.00</Typography>
            <Typography sx={{ fontWeight: 700, fontSize: "10px", textAlign: "right" }}>0.00</Typography>
          </Box>
        </Box>

        <Typography sx={{ mt: 1, fontSize: "8px", fontStyle: "italic" }}>
          ** End of Report **
        </Typography>
      </Box>

      {/* ================= PRINT SETTINGS ================= */}
      <style>
        {`
          @media print {
            body { margin: 0; padding: 0; background: white !important; -webkit-print-color-adjust: exact; }
            @page { 
              size: A4 portrait; 
              margin: 8mm; /* Reduced page margins */
            }
          }
        `}
      </style>
    </Box>
  );
}