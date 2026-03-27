import React from 'react';
import { Box, Paper } from "@mui/material";

export default function CanvassingCollegeListPrint({ data = [] }) {
  
  // Common font style to match Dot Matrix printers
  const dotMatrixStyle = {
    fontFamily: "'Courier New', Courier, monospace",
    fontSize: "13px",
    lineHeight: "1.2",
    color: "#000",
    textTransform: "uppercase"
  };

  return (
    <Box sx={{ background: "#fff", p: 0 }}>
      <Paper
        elevation={0}
        sx={{
          width: "210mm",
          minHeight: "297mm",
          mx: "auto",
          p: "15mm",
          background: "#fff",
          ...dotMatrixStyle
        }}
      >
        {data.map((r, i) => (
          <Box key={i} sx={{ mb: 5, breakInside: "avoid" }}>
            
            {/* LINE 1: CITY AND SR NO */}
            <Box sx={{ display: "grid", gridTemplateColumns: "200px 100px 1fr", mb: 1 }}>
              <span>CITY: {r.City}</span>
              <span>AREA: {r.Area}</span>
              <span style={{ textAlign: "right" }}>SR.NO: {r.SrNo}</span>
            </Box>

            {/* LINE 2: COLLEGE NAME (BOLD) */}
            <Box sx={{ fontWeight: "bold", mb: 0.5, fontSize: "15px" }}>
              {r.CollegeName}
            </Box>

            {/* LINE 3+: ADDRESS AND PHONE */}
            <Box sx={{ pl: "2ch" }}>
              <div style={{ whiteSpace: "pre-wrap" }}>{r.Address}</div>
              {r.MobileNo && (
                <div style={{ marginTop: "4px" }}>
                  CONTACT : {r.MobileNo}
                </div>
              )}
            </Box>
            
            {/* Separator line */}
            <Box sx={{ borderBottom: "1px dashed #000", mt: 2, mb: 2, opacity: 0.3 }} />
          </Box>
        ))}

        {data.length === 0 && (
          <div style={{ textAlign: "center", marginTop: "100px" }}>
            * NO RECORDS FOUND *
          </div>
        )}
      </Paper>
    </Box>
  );
}