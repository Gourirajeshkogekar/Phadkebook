import React from "react";
import { Box, Typography } from "@mui/material";

function DebitNoteRegisterPrint() {
  const params = new URLSearchParams(window.location.search);
  const startDate = params.get("start") || "01-04-25";
  const endDate = params.get("end") || "31-03-26";

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "#808080", p: 4, display: 'flex', justifyContent: 'center' }}>
      <Box
        id="print-area"
        sx={{
          width: "210mm", // Standard A4 width
          minHeight: "297mm",
          bgcolor: "#fff",
          p: "15mm",
          boxShadow: "5px 5px 15px rgba(0,0,0,0.3)",
          fontFamily: "'Times New Roman', Times, serif", // Matching the legacy print look
          color: "#000"
        }}
      >
        {/* Header Section */}
        <Typography align="center" variant="h6" sx={{ fontWeight: "bold", fontSize: "18px" }}>
          Phadke Prakashan, Kolhapur.
        </Typography>

        <Typography align="center" sx={{ fontWeight: "bold", fontSize: "16px", letterSpacing: 2, mt: 0.5 }}>
          D e b i t  N o t e  R e g i s t e r
        </Typography>

        <Typography align="center" sx={{ fontSize: "14px", mb: 2 }}>
          From {startDate} to {endDate}
        </Typography>

        {/* Table Section */}
        <table width="100%" style={{ borderCollapse: "collapse", borderTop: "1.5px solid #000" }}>
          <thead>
            <tr style={{ borderBottom: "1.5px solid #000" }}>
              <th align="left" style={headerStyle}>Entry No./<br/>Ref.No.</th>
              <th align="left" style={headerStyle}>Account Name</th>
              <th align="left" style={headerStyle}>Particulars</th>
              <th align="right" style={headerStyle}>Debit</th>
              <th align="right" style={headerStyle}>Credit</th>
            </tr>
          </thead>

          <tbody>
            {/* Empty space for data as seen in your screenshot */}
            <tr>
              <td colSpan="5" style={{ height: "400px", verticalAlign: "top", textAlign: "center", paddingTop: "20px", color: "#999" }}>
                [ Data Rows Render Here ]
              </td>
            </tr>

            {/* Totals Section */}
            <tr style={{ borderTop: "1.5px solid #000" }}>
              <td colSpan="3" align="right" style={{ padding: "8px 10px", fontWeight: "bold" }}>Day Total</td>
              <td align="right" style={{ padding: "8px" }}></td>
              <td align="right" style={{ padding: "8px" }}></td>
            </tr>
            <tr style={{ borderBottom: "1.5px solid #000" }}>
              <td colSpan="3" align="right" style={{ padding: "8px 10px", fontWeight: "bold" }}>Grand Total</td>
              <td align="right" style={{ padding: "8px" }}></td>
              <td align="right" style={{ padding: "8px" }}></td>
            </tr>
          </tbody>
        </table>
      </Box>

      <style>{`
        @media print {
          body { background: none !important; margin: 0; padding: 0; }
          @page { size: auto; margin: 10mm; }
          #print-area { 
            box-shadow: none !important; 
            width: 100% !important; 
            margin: 0 !important;
            padding: 0 !important;
          }
          /* Hide everything else when printing */
          header, footer, button { display: none !important; }
        }
      `}</style>
    </Box>
  );
}

const headerStyle = {
  padding: "8px 4px",
  fontSize: "14px",
  fontWeight: "bold",
};

export default DebitNoteRegisterPrint;