import React from "react";
import { Box, Typography } from "@mui/material";

function DayBookPrint() {
  const params = new URLSearchParams(window.location.search);
  const startDate = params.get("start") || "01-04-25";
  const endDate = params.get("end") || "31-03-26";
  const types = params.get("types");

  // Create an array of 25 empty rows to fill the page
  const emptyRows = Array.from({ length: 25 });

  return (
    <Box sx={{ minHeight: "100vh", background: "#e9edf3", p: { xs: 1, sm: 4 } }}>
      <Box
        id="print-area"
        sx={{
          maxWidth: 1100,
          mx: "auto",
          bgcolor: "#fff",
          p: "10mm", // Standard print padding
          fontFamily: `'Times New Roman', Times, serif`,
          color: "#000",
          minHeight: "297mm", // A4 Height
          boxSizing: "border-box"
        }}
      >
        {/* HEADER */}
        <Typography align="center" fontWeight={700} fontSize={18} sx={{ mb: 0.5 }}>
          Phadke Prakashan, Kolhapur.
        </Typography>
        <Typography align="center" sx={{ letterSpacing: 4, fontWeight: 600, fontSize: 16, mb: 0.5 }}>
          D a y B o o k
        </Typography>
        <Typography align="center" fontSize={13} mb={2}>
          From {startDate} to {endDate} ({types || "Transaction Datewise"})
        </Typography>

        {/* FULL BORDERED TABLE */}
        <table style={{ 
          width: "100%", 
          borderCollapse: "collapse", 
          fontSize: "11px", 
          border: "1px solid #000" // Outer border
        }}>
          <thead>
            <tr style={{ backgroundColor: "#f9f9f9" }}>
              <th style={cellStyle}>User Id</th>
              <th style={cellStyle}>Entry No</th>
              <th style={cellStyle}>Ref No</th>
              <th style={cellStyle}>Tr.Type</th>
              <th style={{ ...cellStyle, textAlign: "left", width: "20%" }}>Account Name</th>
              <th style={{ ...cellStyle, textAlign: "left", width: "25%" }}>Particulars</th>
              <th style={cellStyle}>Cheq No</th>
              <th style={{ ...cellStyle, textAlign: "right" }}>Debit</th>
              <th style={{ ...cellStyle, textAlign: "right" }}>Credit</th>
            </tr>
          </thead>
          <tbody>
            {emptyRows.map((_, index) => (
              <tr key={index} style={{ height: "28px" }}> {/* Fixed height for rows */}
                <td style={cellStyle}></td>
                <td style={cellStyle}></td>
                <td style={cellStyle}></td>
                <td style={cellStyle}></td>
                <td style={cellStyle}></td>
                <td style={cellStyle}></td>
                <td style={cellStyle}></td>
                <td style={cellStyle}></td>
                <td style={cellStyle}></td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr style={{ fontWeight: 'bold', height: '30px' }}>
              <td colSpan={7} style={{ ...cellStyle, textAlign: 'right', paddingRight: '10px' }}>Total:</td>
              <td style={cellStyle}></td>
              <td style={cellStyle}></td>
            </tr>
          </tfoot>
        </table>
      </Box>

      <style>{`
        @media print {
          @page { size: A4; margin: 0; }
          body { background: none !important; margin: 0; padding: 0; }
          body * { visibility: hidden; }
          #print-area, #print-area * { visibility: visible; }
          #print-area {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            border: none;
          }
        }
      `}</style>
    </Box>
  );
}

// Unified cell style for both th and td to ensure borders connect
const cellStyle = {
  padding: "4px 4px",
  border: "1px solid #000", // Full grid borders
  fontSize: "11px",
  textAlign: "center"
};

export default DayBookPrint;