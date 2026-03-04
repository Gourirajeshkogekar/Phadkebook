import React from "react";
import { Box, Typography } from "@mui/material";
import { useLocation } from "react-router-dom";

function fmt(d) {
  if (!d) return "";
  return new Date(d).toLocaleDateString("en-GB");
}

/* ===== LEDGER ROW ===== */
// We use a specific grid to ensure "Last Yr", "Particulars", and "Amount" align perfectly
const rowGrid = "70px 1fr 90px 90px";

function LedgerRow({ ly, p, a1, a2, isBold = false }) {
  return (
    <Box
      display="grid"
      gridTemplateColumns={rowGrid}
      columnGap={1}
      py={0.2}
      sx={{ fontWeight: isBold ? 700 : 400 }}
    >
      <Typography variant="body2" sx={{ fontSize: '0.8rem' }}>{ly}</Typography>
      <Typography variant="body2" sx={{ fontSize: '0.8rem', textTransform: 'uppercase' }}>{p}</Typography>
      <Typography variant="body2" textAlign="right" sx={{ fontSize: '0.8rem' }}>{a1}</Typography>
      <Typography variant="body2" textAlign="right" sx={{ fontSize: '0.8rem' }}>{a2}</Typography>
    </Box>
  );
}

export default function PLLastYearPrintPage() {
  const { state } = useLocation();

  return (
    <Box sx={{ bgcolor: "#fff", minHeight: "100vh", p: 2, color: "#000", fontFamily: 'serif' }}>
      {/* Container for the actual A4 page */}
      <Box sx={{ maxWidth: "1100px", mx: "auto" }}>
        
        {/* HEADER SECTION */}
        <Typography textAlign="center" variant="h5" sx={{ fontWeight: 700, letterSpacing: 1 }}>
          PHADKE BOOK HOUSE
        </Typography>
        <Typography textAlign="center" variant="body1" sx={{ fontWeight: 600 }}>
          Profit and Loss Account from {fmt(state?.startDate)} to {fmt(state?.endDate)}
        </Typography>

        {/* TOP DIVIDER */}
        <Box sx={{ borderTop: "1px dashed #000", mt: 2, mb: 1 }} />

        {/* TABLE HEADINGS */}
        <Box display="grid" gridTemplateColumns="1fr 20px 1fr" gap={2} sx={{ fontWeight: 700, borderBottom: '1px dashed #000', pb: 0.5 }}>
          <Box display="grid" gridTemplateColumns={rowGrid} columnGap={1}>
            <Typography variant="body2" fontWeight={700}>Last Yr</Typography>
            <Typography variant="body2" fontWeight={700}>Particulars</Typography>
            <Typography variant="body2" fontWeight={700} textAlign="right">Amount</Typography>
            <Typography variant="body2" fontWeight={700} textAlign="right">Amount</Typography>
          </Box>
          <Typography textAlign="center">|</Typography>
          <Box display="grid" gridTemplateColumns={rowGrid} columnGap={1}>
            <Typography variant="body2" fontWeight={700}>Last Yr</Typography>
            <Typography variant="body2" fontWeight={700}>Particulars</Typography>
            <Typography variant="body2" fontWeight={700} textAlign="right">Amount</Typography>
            <Typography variant="body2" fontWeight={700} textAlign="right">Amount</Typography>
          </Box>
        </Box>

        {/* MAIN BODY AREA */}
        <Box display="grid" gridTemplateColumns="1fr 20px 1fr" gap={2} sx={{ minHeight: "500px" }}>
          
          {/* LEFT SIDE: EXPENSES */}
          <Box sx={{ pt: 1 }}>
            <Typography variant="body2" fontWeight={700} sx={{ textDecoration: 'underline', mb: 1 }}>BOOK PURCHASES</Typography>
            <LedgerRow ly="9,10,000" p="BOOKS PURCHASE" a1="10,39,279.00" a2="" />
            <LedgerRow ly="300" p="FREIGHT A/C" a1="-364.00" a2="" />
            <LedgerRow ly="-60,000" p="PURCHASE RETURN" a1="-74,815.00" a2="9,64,561.00" />
            
            <LedgerRow ly="" p="Gross Profit --->" a1="" a2="82,299.00" isBold />
            
            {/* Double lines for totals */}
            <Box sx={{ borderTop: '1px solid #000', borderBottom: '3px double #000', mt: 1, py: 0.2 }}>
               <LedgerRow ly="" p="" a1="" a2="10,46,860.00" isBold />
            </Box>

            <Typography variant="body2" fontWeight={700} sx={{ textDecoration: 'underline', mt: 3, mb: 1 }}>EXPENSES</Typography>
            <LedgerRow ly="1,200" p="BANK COMMISSION" a1="1,127.51" a2="" />
            <LedgerRow ly="50" p="COMMISSION" a1="70.50" a2="" />
          </Box>

          {/* VERTICAL DIVIDER */}
          <Box sx={{ borderLeft: "1px dashed #000", height: "100%" }} />

          {/* RIGHT SIDE: INCOME */}
          <Box sx={{ pt: 1 }}>
            <Typography variant="body2" fontWeight={700} sx={{ textDecoration: 'underline', mb: 1 }}>SALES</Typography>
            <LedgerRow ly="10,80,000" p="SALES" a1="11,34,139.00" a2="" />
            <LedgerRow ly="-70,000" p="SALES RETURN" a1="-87,278.00" a2="10,46,861.00" />

            {/* Total matching the left side */}
            <Box sx={{ borderTop: '1px solid #000', borderBottom: '3px double #000', mt: 5.4, py: 0.2 }}>
               <LedgerRow ly="" p="" a1="" a2="10,46,861.00" isBold />
            </Box>

            <Box sx={{ mt: 1 }}>
               <LedgerRow ly="" p="Gross Profit --->" a1="" a2="82,299.00" isBold />
            </Box>
          </Box>
        </Box>

      </Box>

      {/* PRINT SETTINGS */}
      <style>
        {`
          @media print {
            body { margin: 0; padding: 0; }
            @page { size: A4 portrait; margin: 10mm; }
            .MuiBox-root { box-shadow: none !important; }
          }
        `}
      </style>
    </Box>
  );
}