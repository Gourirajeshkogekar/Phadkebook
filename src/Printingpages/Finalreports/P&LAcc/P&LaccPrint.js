import React from "react";
import { Box, Paper, Typography, Divider, Grid } from "@mui/material";
import { useLocation } from "react-router-dom";

// Helper to format currency
const formatCurr = (v) => 
  v ? new Intl.NumberFormat('en-IN', { minimumFractionDigits: 2 }).format(v) : "0.00";

function formatDate(d) {
  if (!d) return "";
  const dt = new Date(d);
  return dt.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric"
  });
}

export default function PLPrintReport() {
  const { state } = useLocation();
  const start = formatDate(state?.startDate || "2025-04-01");
  const end = formatDate(state?.endDate || "2026-03-31");

  // Custom Styles for the Report
  const textStyle = { fontFamily: "'Times New Roman', serif", fontSize: "13px" };
  const headerStyle = { ...textStyle, fontWeight: 700, textTransform: "uppercase" };
  const borderDashed = { my: 1, borderBottom: "1.5px dashed #000" };

  return (
    <Box sx={{ background: "#525659", minHeight: "100vh", p: { xs: 0, sm: 4 }, display: 'flex', justifyContent: 'center' }}>
      <Paper
        className="print-container"
        sx={{
          width: "210mm", // A4 Width
          minHeight: "297mm",
          p: "15mm",
          background: "#fff",
          boxShadow: "0 0 10px rgba(0,0,0,0.5)",
          color: "#000"
        }}
      >
        {/* ===== COMPANY HEADER ===== */}
        <Typography textAlign="center" variant="h5" sx={{ fontWeight: 800, fontFamily: 'serif' }}>
          PHADKE BOOK HOUSE
        </Typography>
        <Typography textAlign="center" sx={{ ...textStyle, mt: 0.5 }}>
          Profit and Loss Account from {start} to {end}
        </Typography>

        <Divider sx={borderDashed} />

        {/* ===== TABLE HEADERS ===== */}
        <Grid container sx={headerStyle}>
          <Grid item xs={3.5}>Particulars</Grid>
          <Grid item xs={1.2} textAlign="right">Amount</Grid>
          <Grid item xs={1.3} textAlign="right">Amount</Grid>
          <Grid item xs={3.5} sx={{ pl: 2 }}>Particulars</Grid>
          <Grid item xs={1.2} textAlign="right">Amount</Grid>
          <Grid item xs={1.3} textAlign="right">Amount</Grid>
        </Grid>

        <Divider sx={borderDashed} />

        {/* ===== TRADING SECTION (PURCHASES & SALES) ===== */}
        <Box sx={{ display: 'flex', position: 'relative' }}>
          {/* Vertical Divider Line */}
          <Box sx={{ position: 'absolute', left: '50%', top: 0, bottom: 0, borderLeft: '1px dotted #000' }} />

          <Grid container sx={textStyle}>
            {/* LEFT SIDE: PURCHASES */}
            <Grid item xs={6} sx={{ pr: 1 }}>
              <Typography sx={{ fontWeight: 700, textDecoration: 'underline', mb: 1 }}>BOOK PURCHASES</Typography>
              <Box display="flex" justifyContent="space-between">
                <Typography>BOOKS PURCHASE</Typography>
                <Typography>{formatCurr(10392796.00)}</Typography>
              </Box>
              <Box display="flex" justifyContent="space-between">
                <Typography>FREIGHT A/C</Typography>
                <Typography>-364.00</Typography>
              </Box>
              <Box display="flex" justifyContent="space-between" mb={1}>
                <Typography>PURCHASE RETURN</Typography>
                <Typography>-746815.00</Typography>
              </Box>
              
              <Box display="flex" justifyContent="space-between" sx={{ mt: 2 }}>
                <Typography sx={{ fontWeight: 700 }}>Gross Profit ---&gt;</Typography>
                <Typography sx={{ fontWeight: 700 }}>822993.00</Typography>
              </Box>
            </Grid>

            {/* RIGHT SIDE: SALES */}
            <Grid item xs={6} sx={{ pl: 2 }}>
              <Typography sx={{ fontWeight: 700, textDecoration: 'underline', mb: 1 }}>SALES</Typography>
              <Box display="flex" justifyContent="space-between">
                <Typography>SALES</Typography>
                <Typography>{formatCurr(11341390.00)}</Typography>
              </Box>
              <Box display="flex" justifyContent="space-between">
                <Typography>SALES RETURN</Typography>
                <Typography>-872780.00</Typography>
              </Box>
              
              <Box sx={{ mt: 8 }} display="flex" justifyContent="space-between">
                <Box />
                <Typography sx={{ pr: 6 }}>{formatCurr(10468610.00)}</Typography>
              </Box>
            </Grid>
          </Grid>
        </Box>

        {/* TOTALS WITH DOUBLE UNDERLINE */}
        <Grid container sx={{ ...headerStyle, mt: 1 }}>
          <Grid item xs={6} sx={{ pr: 1, textAlign: 'right' }}>
            <Box sx={{ borderTop: '1px solid #000', borderBottom: '4px double #000', py: 0.5 }}>
               {formatCurr(10468610.00)}
            </Box>
          </Grid>
          <Grid item xs={6} sx={{ pl: 2, textAlign: 'right' }}>
            <Box sx={{ borderTop: '1px solid #000', borderBottom: '4px double #000', py: 0.5 }}>
               {formatCurr(10468610.00)}
            </Box>
          </Grid>
        </Grid>

        {/* ===== INDIRECT EXPENSES SECTION ===== */}
        <Box sx={{ mt: 2, display: 'flex', position: 'relative' }}>
          <Box sx={{ position: 'absolute', left: '50%', top: 0, bottom: 0, borderLeft: '1px dotted #000' }} />
          
          <Grid container sx={textStyle}>
            {/* LEFT SIDE: EXPENSES */}
            <Grid item xs={6} sx={{ pr: 1 }}>
              <Typography sx={{ fontWeight: 700, textDecoration: 'underline', mb: 1 }}>EXPENSES</Typography>
              {[
                { label: "BANK COMMISSION", val: "1127.51" },
                { label: "COMMISSION", val: "70.50" },
                { label: "COMPUTER A.M.C. CHARGES", val: "4500.00" },
                { label: "CONSULTING CHARGES", val: "22300.00" },
                { label: "COURIER EXPENSES", val: "160.00" },
                { label: "EMPLOYERS CONTRIBUTION TO P.F.", val: "79188.00" },
                { label: "GST (INTEREST)", val: "600.00" }
              ].map((row, i) => (
                <Box key={i} display="flex" justifyContent="space-between">
                  <Typography fontSize={12}>{row.label}</Typography>
                  <Typography>{row.val}</Typography>
                </Box>
              ))}
            </Grid>

            {/* RIGHT SIDE: GROSS PROFIT B/F */}
            <Grid item xs={6} sx={{ pl: 2 }}>
               <Box display="flex" justifyContent="space-between">
                  <Typography sx={{ fontWeight: 700 }}>Gross Profit ---&gt;</Typography>
                  <Typography>{formatCurr(822993.00)}</Typography>
               </Box>
            </Grid>
          </Grid>
        </Box>

      </Paper>

      {/* ===== PRINT SPECIFIC CSS ===== */}
      <style>
        {`
        @media print {
          @page { size: A4; margin: 0; }
          body { background: none; margin: 0; padding: 0; }
          .print-container {
            box-shadow: none !important;
            width: 100% !important;
            margin: 0 !important;
            padding: 10mm !important;
          }
          button { display: none !important; }
        }
        `}
      </style>
    </Box>
  );
}