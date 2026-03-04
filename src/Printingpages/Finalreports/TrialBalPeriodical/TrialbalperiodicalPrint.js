import React from "react";
import { Box, Typography } from "@mui/material";
import { useLocation } from "react-router-dom";

export default function TrialbalperiodicalPrint() {
  const { state } = useLocation();

  // 8 Column Grid: SrNo(50px), Name(1fr), then 6 Amount columns (90px each)
  const gridTemplate = "50px 1.5fr repeat(6, 100px)";

  return (
    <Box sx={{ bgcolor: "#fff", p: 4, minHeight: "100vh", color: "#000", fontFamily: "'Times New Roman', serif" }}>
      <Box sx={{ maxWidth: "1200px", mx: "auto" }}>
        
        {/* HEADER */}
        <Typography variant="h6" align="center" sx={{ fontWeight: 700 }}>
          PHADKE BOOK HOUSE
        </Typography>
        <Typography variant="body2" align="center" sx={{ fontWeight: 600 }}>
          Groupwise - Periodical Trial Balance
        </Typography>
        <Box sx={{ display: "flex", justifyContent: "space-between", mt: 0.5 }}>
          <Box sx={{ flex: 1 }} />
          <Typography variant="body2" sx={{ fontWeight: 600 }}>
            from {state?.startDate || "01-04-25"} to {state?.endDate || "31-03-26"} (Detail)
          </Typography>
          <Typography variant="caption" sx={{ flex: 1, textAlign: "right" }}>
            Page 1 of 1
          </Typography>
        </Box>

        {/* COMPLEX NESTED TABLE HEADER */}
        <Box sx={{ mt: 2, borderTop: "1px solid #000", borderBottom: "1px solid #000" }}>
          {/* Top Row Headers */}
          <Box sx={{ display: "grid", gridTemplateColumns: gridTemplate, py: 0.5 }}>
            <Typography variant="caption" sx={{ fontWeight: 700 }}>Sr.</Typography>
            <Typography variant="caption" sx={{ fontWeight: 700 }}>Account Name</Typography>
            <Typography variant="caption" sx={{ fontWeight: 700, textAlign: "center", gridColumn: "3 / span 2", borderBottom: "1px solid #000", mb: 0.5 }}>Opening Balance</Typography>
            <Typography variant="caption" sx={{ fontWeight: 700, textAlign: "center", gridColumn: "5 / span 2", borderBottom: "1px solid #000", mb: 0.5 }}>Transactions</Typography>
            <Typography variant="caption" sx={{ fontWeight: 700, textAlign: "center", gridColumn: "7 / span 2", borderBottom: "1px solid #000", mb: 0.5 }}>Closing Balance</Typography>
          </Box>
          {/* Bottom Row Headers (Dr/Cr) */}
          <Box sx={{ display: "grid", gridTemplateColumns: gridTemplate, pb: 0.5 }}>
            <Typography variant="caption" sx={{ fontWeight: 700 }}>No.</Typography>
            <Box /> {/* Empty for name */}
            <Typography variant="caption" sx={{ fontWeight: 700, textAlign: "right" }}>Debit</Typography>
            <Typography variant="caption" sx={{ fontWeight: 700, textAlign: "right" }}>Credit</Typography>
            <Typography variant="caption" sx={{ fontWeight: 700, textAlign: "right" }}>Debit</Typography>
            <Typography variant="caption" sx={{ fontWeight: 700, textAlign: "right" }}>Credit</Typography>
            <Typography variant="caption" sx={{ fontWeight: 700, textAlign: "right" }}>Debit</Typography>
            <Typography variant="caption" sx={{ fontWeight: 700, textAlign: "right" }}>Credit</Typography>
          </Box>
        </Box>

        {/* DATA CONTENT */}
        <Box sx={{ mt: 1 }}>
          <Typography variant="caption" sx={{ fontWeight: 700, textDecoration: "underline", display: "block", mb: 0.5 }}>
            BANK DEPOSIT
          </Typography>

          {/* Example Row */}
          <Box sx={{ display: "grid", gridTemplateColumns: gridTemplate, py: 0.3 }}>
            <Typography variant="caption">21</Typography>
            <Typography variant="caption" sx={{ fontSize: "0.75rem", lineHeight: 1.1 }}>
              FIX DEPOSIT -090245110021409 <br /> M/D-28.03.26
            </Typography>
            <Typography variant="caption" textAlign="right">-</Typography>
            <Typography variant="caption" textAlign="right">-</Typography>
            <Typography variant="caption" textAlign="right">5,000,000.00</Typography>
            <Typography variant="caption" textAlign="right">-</Typography>
            <Typography variant="caption" textAlign="right">5,000,000.00</Typography>
            <Typography variant="caption" textAlign="right">-</Typography>
          </Box>

          {/* SUB TOTAL */}
          <Box sx={{ display: "grid", gridTemplateColumns: gridTemplate, mt: 2 }}>
            <Box />
            <Typography variant="caption" sx={{ fontWeight: 700, textAlign: "right", pr: 2 }}>Sub Total</Typography>
            {/* Amount border for subtotal */}
            <Typography variant="caption" sx={{ textAlign: "right", borderTop: "1px solid #000", fontWeight: 700 }}>22,791,687.00</Typography>
            <Typography variant="caption" sx={{ textAlign: "right", borderTop: "1px solid #000", fontWeight: 700 }}>-</Typography>
            <Typography variant="caption" sx={{ textAlign: "right", borderTop: "1px solid #000", fontWeight: 700 }}>5,000,000.00</Typography>
            <Typography variant="caption" sx={{ textAlign: "right", borderTop: "1px solid #000", fontWeight: 700 }}>9,824,818.00</Typography>
            <Typography variant="caption" sx={{ textAlign: "right", borderTop: "1px solid #000", fontWeight: 700 }}>18,115,011.00</Typography>
            <Typography variant="caption" sx={{ textAlign: "right", borderTop: "1px solid #000", fontWeight: 700 }}>148,142.00</Typography>
          </Box>

          {/* GRAND TOTAL */}
          <Box sx={{ display: "grid", gridTemplateColumns: gridTemplate, mt: 1, borderTop: "1px solid #000", borderBottom: "3px double #000", py: 0.5 }}>
            <Box />
            <Typography variant="caption" sx={{ fontWeight: 700, textAlign: "right", pr: 2 }}>Grand Total</Typography>
            <Typography variant="caption" sx={{ textAlign: "right", fontWeight: 700 }}>22,791,687.00</Typography>
            <Typography variant="caption" sx={{ textAlign: "right", fontWeight: 700 }}>-</Typography>
            <Typography variant="caption" sx={{ textAlign: "right", fontWeight: 700 }}>5,000,000.00</Typography>
            <Typography variant="caption" sx={{ textAlign: "right", fontWeight: 700 }}>9,824,818.00</Typography>
            <Typography variant="caption" sx={{ textAlign: "right", fontWeight: 700 }}>18,115,011.00</Typography>
            <Typography variant="caption" sx={{ textAlign: "right", fontWeight: 700 }}>148,142.00</Typography>
          </Box>

          {/* DIFFERENCE ROW (As seen in the very bottom of your screenshot) */}
          <Box sx={{ display: "grid", gridTemplateColumns: gridTemplate, mt: 0.5 }}>
            <Box />
            <Box />
            <Typography variant="caption" sx={{ textAlign: "right" }}>22,791,687.00</Typography>
            <Box />
            <Typography variant="caption" sx={{ textAlign: "right" }}>4,824,818.00</Typography>
            <Box />
            <Typography variant="caption" sx={{ textAlign: "right" }}>-17,966,869.00</Typography>
            <Box />
          </Box>
        </Box>
      </Box>

      <style>
        {`
          @media print {
            @page { size: A4 landscape; margin: 10mm; }
            body { margin: 0; }
          }
        `}
      </style>
    </Box>
  );
}