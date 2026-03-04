import React from "react";
import { Box, Paper, Typography } from "@mui/material";
import { useLocation } from "react-router-dom";

function formatDate(d) {
  if (!d) return "";
  return new Date(d).toLocaleDateString("en-GB");
}

export default function FixedAssetHeaderPage() {
  const { state } = useLocation();
  const asOn = formatDate(state?.asOnDate);

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: "linear-gradient(180deg,#eef2f6,#e4eaf2)",
        p: 3
      }}
    >
      <Paper
        sx={{
          maxWidth: 1100,
          mx: "auto",
          p: 3,
          borderRadius: 2,
          boxShadow: "0 10px 28px rgba(0,0,0,0.10)"
        }}
      >

        {/* ===== COMPANY CENTER ===== */}
        <Box position="relative">
          <Typography
            textAlign="center"
            fontWeight={800}
            fontSize={18}
            letterSpacing={1}
          >
            PHADKE BOOK HOUSE
          </Typography>

          <Typography
            position="absolute"
            right={0}
            top={0}
            fontSize={12}
            color="text.secondary"
          >
            Page # 1
          </Typography>
        </Box>

        {/* ===== TITLE ===== */}
        <Typography
          textAlign="center"
          fontWeight={700}
          fontSize={15}
          letterSpacing={5}
          mt={1}
        >
          FIXED ASSET SCHEDULE
        </Typography>

        <Typography
          textAlign="center"
          fontSize={12}
          color="text.secondary"
          mt={0.5}
        >
          as on {asOn}
        </Typography>

        {/* ===== DIVIDER ===== */}
        <Box mt={2} mb={1} sx={{ borderTop: "1.5px dashed #444" }} />

        {/* ================= HEADER GRID — FIT ONE PAGE ================= */}

        {/* TOP HEADER */}
        <Box
          display="grid"
          gridTemplateColumns="
            4% 14% 9%
            16%
            8%
            10%
            6%
            23%
            10%
          "
          border="1px solid #cfcfcf"
          fontWeight={700}
          fontSize={11}
          sx={{ background: "#f4f6f8" }}
        >
          <Cell>Sr</Cell>
          <Cell>Name of Asset</Cell>
          <Cell>Opening</Cell>
          <Cell center>Additions During Year</Cell>
          <Cell>Total Add</Cell>
          <Cell>Sold/Disp</Cell>
          <Cell>Total</Cell>
          <Cell center>Depreciation</Cell>
          <Cell>W.D.V.</Cell>
        </Box>

        {/* SUB HEADER */}
        <Box
          display="grid"
          gridTemplateColumns="
            4% 14% 9%
            8% 8%
            8%
            10%
            6%
            5% 6% 6% 6%
            10%
          "
          borderLeft="1px solid #cfcfcf"
          borderRight="1px solid #cfcfcf"
          borderBottom="1px solid #cfcfcf"
          fontSize={10}
        >
          <Cell />
          <Cell />
          <Cell />

          <Cell>Upto</Cell>
          <Cell>After</Cell>

          <Cell />
          <Cell />
          <Cell />

          <Cell>Rate%</Cell>
          <Cell>Full</Cell>
          <Cell>Half</Cell>
          <Cell>Total</Cell>

          <Cell />
        </Box>

      </Paper>

      {/* ===== PRINT SETTINGS — FORCE ONE PAGE ===== */}
      <style>
        {`
          @media print {
            @page { size: landscape; margin: 12mm; }
            body { background:white; }
          }
        `}
      </style>
    </Box>
  );
}

/* ===== CELL ===== */

function Cell({ children, center }) {
  return (
    <Box
      sx={{
        px: 0.7,
        py: 0.9,
        borderRight: "1px solid #dcdcdc",
        borderTop: "1px solid #e6e6e6",
        textAlign: center ? "center" : "left"
      }}
    >
      {children}
    </Box>
  );
}