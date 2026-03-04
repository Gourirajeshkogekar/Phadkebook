import React from "react";
import { Box, Typography, Button } from "@mui/material";
import PrintIcon from "@mui/icons-material/Print";
import { useLocation } from "react-router-dom";

function SalesRegisterPrint() {
  const { state } = useLocation() || {};
  const { startDate, endDate, rows = [] } = state || {};

  return (
    <Box
      sx={{
        bgcolor: "#e6eaef",
        minHeight: "100vh",
        py: 3,
        fontFamily: `"Times New Roman", Georgia, serif`
      }}
    >
      {/* ================= A4 PAGE ================= */}
      <Box
        id="print-area"
        sx={{
          width: "210mm",
          minHeight: "297mm",
          mx: "auto",
          bgcolor: "#fff",
          px: "16mm",
          py: "12mm",
          boxShadow: "0 0 30px rgba(0,0,0,0.18)"
        }}
      >

        {/* ================= HEADER ================= */}
        <Typography align="center" fontSize={18} fontWeight={700}>
          Phadke Prakashan, Kolhapur.
        </Typography>

        <Typography align="center" fontSize={14} mt={0.5}>
          Sales Register Summary
        </Typography>

        <Typography align="center" fontSize={12} mt={0.5}>
          From {startDate} to {endDate}
        </Typography>

        {/* double line */}
        <Box sx={{ borderTop: "1px solid #000", mt: 1 }} />
        <Box sx={{ borderTop: "1px solid #000", mt: 0.3, mb: 1 }} />

        {/* ================= TABLE ================= */}
        <table
          width="100%"
          style={{
            borderCollapse: "collapse",
            fontSize: "12px"
          }}
        >
          <thead>
            {/* header row */}
            <tr>
              <th align="left" width="12%">Date</th>
              <th align="left" width="28%">Particulars</th>
              <th align="right" width="14%">Net Amount</th>
              <th align="right" width="16%">Other Charges / Round Off</th>
              <th colSpan="2" align="center" width="18%">
                Invoice Amount
              </th>
            </tr>

            {/* sub header */}
            <tr style={{ borderBottom: "1px solid #000" }}>
              <th />
              <th />
              <th />
              <th />
              <th align="right" style={{ borderTop: "1px solid #000" }}>
                Cash
              </th>
              <th align="right" style={{ borderTop: "1px solid #000" }}>
                Credit
              </th>
            </tr>
          </thead>

          <tbody>
            {/* ================= BACKEND DATA HERE ================= */}
            {rows.map((r, i) => (
              <tr key={i}>
                <td>{r.date}</td>
                <td>{r.particulars}</td>
                <td align="right">{r.netAmount}</td>
                <td align="right">{r.roundOff}</td>
                <td align="right">{r.cash}</td>
                <td align="right">{r.credit}</td>
              </tr>
            ))}

            {/* optional total row structure */}
            <tr style={{ borderTop: "1px solid #000" }}>
              <td colSpan="6" style={{ height: 20 }} />
            </tr>

            <tr style={{ borderTop: "1px solid #000" }}>
              <td />
              <td><b>Total</b></td>
              <td align="right">{/* totalNet */}</td>
              <td align="right">{/* totalRound */}</td>
              <td align="right">{/* totalCash */}</td>
              <td align="right">{/* totalCredit */}</td>
            </tr>
          </tbody>
        </table>

      </Box>

      

      {/* ================= PRINT CSS ================= */}
      <style>{`
        @page { size: A4; margin: 12mm; }

        @media print {
          body * { visibility: hidden; }
          #print-area, #print-area * { visibility: visible; }

          #print-area {
            position: absolute;
            left: 0;
            top: 0;
            width: 210mm;
            box-shadow: none;
          }
        }

        th {
          font-weight: 700;
          padding: 4px 2px;
        }

        td {
          padding: 3px 2px;
          vertical-align: top;
        }
      `}</style>
    </Box>
  );
}

export default SalesRegisterPrint;