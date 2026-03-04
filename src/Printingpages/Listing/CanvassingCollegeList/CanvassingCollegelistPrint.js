import React from 'react';
import { Box, Paper, Button } from "@mui/material";
import PrintIcon from "@mui/icons-material/Print";
import { useLocation } from "react-router-dom";

export default function CanvassingCollegeListPrint() {
  const { state } = useLocation() || {};
  
  // Example data based on your specific screenshot
  const rows = state?.rows || [
    { city: "KOLHAPUR", cityCode: "1", district: "KOLHAPUR-CITY", code: "5", type: "D", collegeName: "GOVERNMENT POLYTECHNIC", address: "NEAR TEMBLAI MANDIR,\nKOLHAPUR-CITY\nKOLHAPUR", phone: "2520038" },
    { city: "JAYSINGPUR", cityCode: "37", district: "JAYSINGPUR", code: "37", type: "D", collegeName: "J.J.MAGDUM POLYTECHNIC COLLEGE", address: "JAYSINGPUR\nKOLHAPUR", phone: "" }
  ];

  const handlePrint = () => window.print();

  // Common font style to match Dot Matrix printers
  const dotMatrixStyle = {
    fontFamily: "'Courier New', Courier, monospace",
    fontSize: "13px",
    lineHeight: "1.2",
    color: "#000",
    textTransform: "uppercase"
  };

  return (
    <Box sx={{ background: "#bdbdbd", minHeight: "100vh", p: 3, "@media print": { p: 0, background: "#fff" } }}>
      
     
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
        {rows.map((r, i) => (
          <Box key={i} sx={{ mb: 5 }}>
            
            {/* LINE 1: CITY AND PAGE-LIKE CODES */}
            <Box sx={{ display: "grid", gridTemplateColumns: "150px 100px 200px 50px 1fr", mb: 1 }}>
              <span>{r.city}</span>
              <span>{r.cityCode}</span>
              <span>{r.district}</span>
              <span>{r.code}</span>
              <span style={{ textAlign: "right" }}>{r.type}</span>
            </Box>

            {/* LINE 2: COLLEGE NAME (INDENTED) */}
            <Box sx={{ fontWeight: "bold", mb: 0.5 }}>
              {r.collegeName}
            </Box>

            {/* LINE 3+: ADDRESS AND PHONE */}
            <Box sx={{ pl: "2ch" }}> {/* Indent by 2 characters */}
              <div style={{ whiteSpace: "pre-wrap" }}>{r.address}</div>
              {r.phone && <div style={{ marginTop: "4px" }}>PHONE : {r.phone}</div>}
            </Box>

            {/* OPTIONAL: DOT MATRIX SEPARATOR (If your old software had them) */}
            {/* <Box sx={{ borderBottom: "1px dashed #ccc", my: 2 }} /> */}
          </Box>
        ))}

        {rows.length === 0 && (
          <div style={{ textAlign: "center", marginTop: "100px" }}>* NO RECORDS FOUND *</div>
        )}
      </Paper>
    </Box>
  );
}