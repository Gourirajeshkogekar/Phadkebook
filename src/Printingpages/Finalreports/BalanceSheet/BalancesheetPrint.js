import React, { forwardRef } from "react";
import { Box, Typography } from "@mui/material";

function formatDate(d) {
  if (!d) return "";
  const dt = new Date(d);
  return dt.toLocaleDateString("en-GB");
}

// Using forwardRef so the Parent can "see" this component to take the screenshot
const BalanceHeaderPage = forwardRef(({ state }, ref) => {
  const asOn = formatDate(state?.asOnDate);

  return (
    <Box
      ref={ref}
      sx={{
        width: "210mm", // Standard A4 Width
        minHeight: "297mm", // Standard A4 Height
        p: "15mm",
        background: "white",
        mx: "auto",
        color: "#000",
      }}
    >
      {/* ===== COMPANY NAME ===== */}
      <Typography
        textAlign="center"
        fontSize={22}
        fontWeight={800}
        sx={{ fontFamily: "serif", textTransform: "uppercase" }}
      >
        PHADKE BOOK HOUSE
      </Typography>

      {/* ===== REPORT TITLE ===== */}
      <Typography
        textAlign="center"
        fontSize={14}
        fontWeight={600}
        sx={{ fontFamily: "serif", mb: 1 }}
      >
        Balance Sheet As on {asOn}
      </Typography>

      {/* ===== HEADER DOUBLE LINE ===== */}
      <Box sx={{ borderTop: "1.5px dashed #000", mt: 2 }} />
      <Box sx={{ borderTop: "1px dashed #000", mt: "2px", mb: 1 }} />

      {/* ===== COLUMN HEADERS ===== */}
      <Box
        display="grid"
        gridTemplateColumns="1fr 120px 120px 1fr 120px 120px"
        alignItems="center"
        sx={{ px: 1 }}
      >
        <Typography fontWeight={700} fontSize={13} sx={{ fontFamily: "serif" }}>
          Particulars
        </Typography>
        <Typography textAlign="right" fontWeight={700} fontSize={13} sx={{ fontFamily: "serif" }}>
          Amount
        </Typography>
        <Typography textAlign="right" fontWeight={700} fontSize={13} sx={{ fontFamily: "serif", pr: 2 }}>
          Amount
        </Typography>

        <Typography fontWeight={700} fontSize={13} sx={{ fontFamily: "serif", borderLeft: "1px solid #000", pl: 2 }}>
          Particulars
        </Typography>
        <Typography textAlign="right" fontWeight={700} fontSize={13} sx={{ fontFamily: "serif" }}>
          Amount
        </Typography>
        <Typography textAlign="right" fontWeight={700} fontSize={13} sx={{ fontFamily: "serif" }}>
          Amount
        </Typography>
      </Box>

      {/* ===== BOTTOM DASH ===== */}
      <Box sx={{ borderTop: "1.5px dashed #000", mt: 1 }} />

      {/* Placeholder for Data Rows */}
      <Box sx={{ height: "200mm" }}>
        {/* You can map your balance sheet data here later */}
      </Box>
    </Box>
  );
});

export default BalanceHeaderPage;