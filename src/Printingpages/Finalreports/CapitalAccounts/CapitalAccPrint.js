import React from "react";
import { Box, Typography, Divider } from "@mui/material";

const CapitalAccPrint = ({ data }) => {
  // Fallback data structure for development/testing
  const reportData = data || {
    companyName: "PHADKE BOOK HOUSE",
    accountTitle: "CAPITAL ACCOUNTS",
    dateRange: "as on 31-03-26",
    ownerName: "SHRI PHADKE MANDAR",
    leftSide: [
      { particulars: "To DRAWINGS", amount: "150000.00" },
      { particulars: "To RECEIVED CHEQUE", amount: "500000.00" },
      { particulars: "To P.P.F.", amount: "150000.00" },
      { particulars: "To BALANCE C/D", amount: "2791860.79" },
    ],
    rightSide: [
      { particulars: "By BALANCE B/D", amount: "3591860.79" },
    ],
    total: "3591860.79"
  };

  const textStyle = { fontSize: "11px", fontFamily: "'Times New Roman', serif" };
  const headerStyle = { ...textStyle, fontWeight: 700, textAlign: "center" };

  return (
    <Box sx={{ bgcolor: "#fff", p: "15mm", minHeight: "100vh", color: "#000" }}>
      <Box sx={{ maxWidth: "800px", mx: "auto", border: "1px solid #000", p: 1 }}>
        
        {/* TOP HEADER */}
        <Typography sx={{ ...headerStyle, fontSize: "16px" }}>{reportData.companyName}</Typography>
        <Typography sx={{ ...headerStyle, fontSize: "13px" }}>{reportData.accountTitle}</Typography>
        <Box sx={{ display: "flex", justifyContent: "center", position: "relative" }}>
          <Typography sx={{ ...textStyle, fontSize: "10px" }}>{reportData.dateRange}</Typography>
          <Typography sx={{ ...textStyle, fontSize: "10px", position: "absolute", right: 0 }}>Page 1 of 1</Typography>
        </Box>

        {/* OWNER NAME SECTION */}
        <Box sx={{ borderTop: "1px solid #000", borderBottom: "1px solid #000", mt: 1, py: 0.5 }}>
          <Typography sx={{ ...headerStyle, textDecoration: "underline" }}>{reportData.ownerName}</Typography>
        </Box>

        {/* TABLE HEADERS */}
        <Box sx={{ display: "flex", borderBottom: "1px solid #000" }}>
          <Box sx={{ flex: 1, display: "flex", borderRight: "1px solid #000", px: 0.5 }}>
            <Typography sx={{ ...headerStyle, flex: 1, textAlign: "left" }}>Particulars</Typography>
            <Typography sx={{ ...headerStyle, width: "80px", textAlign: "right" }}>Amount</Typography>
          </Box>
          <Box sx={{ flex: 1, display: "flex", px: 0.5 }}>
            <Typography sx={{ ...headerStyle, flex: 1, textAlign: "left" }}>Particulars</Typography>
            <Typography sx={{ ...headerStyle, width: "80px", textAlign: "right" }}>Amount</Typography>
          </Box>
        </Box>

        {/* ACCOUNT CONTENT */}
        <Box sx={{ display: "flex", minHeight: "200px" }}>
          {/* Left Column (To) */}
          <Box sx={{ flex: 1, borderRight: "1px solid #000", pt: 1 }}>
            {reportData.leftSide.map((row, index) => (
              <Box key={index} sx={{ display: "flex", px: 0.5, mb: 0.2 }}>
                <Typography sx={{ ...textStyle, flex: 1 }}>{row.particulars}</Typography>
                <Typography sx={{ ...textStyle, width: "80px", textAlign: "right" }}>{row.amount}</Typography>
              </Box>
            ))}
          </Box>
          {/* Right Column (By) */}
          <Box sx={{ flex: 1, pt: 1 }}>
            {reportData.rightSide.map((row, index) => (
              <Box key={index} sx={{ display: "flex", px: 0.5, mb: 0.2 }}>
                <Typography sx={{ ...textStyle, flex: 1 }}>{row.particulars}</Typography>
                <Typography sx={{ ...textStyle, width: "80px", textAlign: "right" }}>{row.amount}</Typography>
              </Box>
            ))}
          </Box>
        </Box>

        {/* TOTAL FOOTER */}
        <Box sx={{ display: "flex", borderTop: "1px solid #000", borderBottom: "1px solid #000" }}>
          <Box sx={{ flex: 1, display: "flex", borderRight: "1px solid #000", px: 0.5 }}>
            <Box sx={{ flex: 1 }} />
            <Typography sx={{ ...headerStyle, width: "80px", textAlign: "right" }}>{reportData.total}</Typography>
          </Box>
          <Box sx={{ flex: 1, display: "flex", px: 0.5 }}>
            <Box sx={{ flex: 1 }} />
            <Typography sx={{ ...headerStyle, width: "80px", textAlign: "right" }}>{reportData.total}</Typography>
          </Box>
        </Box>
      </Box>

      <style>
        {`
          @media print {
            body { margin: 0; padding: 0; }
            @page { size: A4 portrait; margin: 0; }
          }
        `}
      </style>
    </Box>
  );
};

export default CapitalAccPrint;