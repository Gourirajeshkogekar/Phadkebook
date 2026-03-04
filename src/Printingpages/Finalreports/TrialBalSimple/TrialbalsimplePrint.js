import React from "react";
import { Box, Typography } from "@mui/material";
import { useLocation } from "react-router-dom";

export default function TrialBalanceSimplePrint() {
  const { state } = useLocation();

  // Narrower column widths for a tighter look
  const colWidths = {
    sr: "40px",
    name: "1fr",
    debit: "110px",
    credit: "110px",
    balance: "110px",
  };

  const gridTemplate = `${colWidths.sr} ${colWidths.name} ${colWidths.debit} ${colWidths.credit} ${colWidths.balance}`;

  return (
    <Box sx={{ bgcolor: "#fff", minHeight: "100vh", color: "#000", fontFamily: "'Times New Roman', Times, serif", p: 1 }}>
      <Box sx={{ maxWidth: "800px", mx: "auto" }}>
        
        {/* HEADER - Reduced sizes */}
        <Typography sx={{ fontWeight: 700, fontSize: "16px", textAlign: "center", textTransform: "uppercase", mb: 0 }}>
          Phadke Book House
        </Typography>
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 1 }}>
          <Box sx={{ flex: 1 }} />
          <Typography sx={{ fontWeight: 700, fontSize: "12px", textAlign: "center", flex: 2 }}>
            Trial Balance as on {state?.endDate || "31/03/2026"} (Detail)
          </Typography>
          <Typography sx={{ flex: 1, textAlign: "right", fontSize: "10px" }}>
            Page 1 of 1
          </Typography>
        </Box>

        {/* TABLE HEADER - Compacted */}
        <Box sx={{ display: "grid", gridTemplateColumns: gridTemplate, borderTop: "1.5px solid #000", borderBottom: "1px solid #000", py: 0.2 }}>
          {["Sr. No", "Account Name", "Debit", "Credit", "Balance"].map((head, i) => (
            <Typography key={head} sx={{ fontWeight: 700, fontSize: "11px", textAlign: i > 1 ? "right" : "left" }}>
              {head}
            </Typography>
          ))}
        </Box>

        {/* DATA ROW SECTION */}
        <Box sx={{ mt: 0.5 }}>
          <Typography sx={{ fontWeight: 700, textDecoration: "underline", fontSize: "11px", mt: 0.5 }}>
            ADVANCE INCOME TAX
          </Typography>

          {/* Sub-Account Row - Reduced padding and font */}
          <Box sx={{ display: "grid", gridTemplateColumns: gridTemplate, py: 0.1 }}>
            <Typography sx={{ fontSize: "10.5px" }}>1</Typography>
            <Typography sx={{ fontSize: "10.5px", pl: 2 }}>INCOME TAX TDS(BANK BOI)</Typography>
            <Typography sx={{ fontSize: "10.5px", textAlign: "right" }}>214,290.00</Typography>
            <Typography sx={{ fontSize: "10.5px", textAlign: "right" }}>-</Typography>
            <Typography sx={{ fontSize: "10.5px", textAlign: "right" }}>-</Typography>
          </Box>

          {/* SUB TOTAL AREA - Tightened */}
          <Box sx={{ display: "grid", gridTemplateColumns: gridTemplate, mt: 0.5 }}>
            <Box />
            <Box sx={{ borderTop: "1px solid #000", gridColumn: "2 / span 4", display: "grid", gridTemplateColumns: `1fr ${colWidths.debit} ${colWidths.credit} ${colWidths.balance}`, pt: 0.1 }}>
                <Typography sx={{ fontWeight: 700, fontSize: "10.5px", textAlign: "center" }}>Sub Total</Typography>
                <Typography sx={{ fontWeight: 700, fontSize: "10.5px", textAlign: "right", borderTop: "1px solid #000" }}>214,290.00</Typography>
                <Typography sx={{ fontWeight: 700, fontSize: "10.5px", textAlign: "right", borderTop: "1px solid #000" }}>-</Typography>
                <Typography sx={{ fontWeight: 700, fontSize: "10.5px", textAlign: "right" }}>214,290.00 Dr</Typography>
            </Box>
          </Box>

          {/* GRAND TOTAL AREA - Significantly shorter padding */}
          <Box sx={{ display: "grid", gridTemplateColumns: gridTemplate, mt: 1, borderTop: "1px solid #000", borderBottom: "3px double #000", py: 0.3 }}>
            <Box />
            <Typography sx={{ fontWeight: 700, fontSize: "12px", textAlign: "center" }}>Grand Total</Typography>
            <Typography sx={{ fontWeight: 700, fontSize: "12px", textAlign: "right" }}>214,290.00</Typography>
            <Typography sx={{ fontWeight: 700, fontSize: "12px", textAlign: "right" }}>-</Typography>
            <Typography sx={{ fontWeight: 700, fontSize: "12px", textAlign: "right" }}>214,290.00 Dr</Typography>
          </Box>
        </Box>

        {/* FOOTER NOTE */}
        <Typography sx={{ display: "block", mt: 2, fontStyle: "italic", fontSize: "10px" }}>
          ** End of Report **
        </Typography>
      </Box>

      <style>
        {`
          @media print {
            body { margin: 0; padding: 0; }
            @page { size: A4 portrait; margin: 10mm; }
            .no-print { display: none !important; }
          }
        `}
      </style>
    </Box>
  );
}