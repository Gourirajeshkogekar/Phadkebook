import React from "react";
import { Box, Typography, Button } from "@mui/material";
import PrintIcon from "@mui/icons-material/Print";
import { useLocation } from "react-router-dom";

export default function ReceiptRegisterPrint() {

  const { state } = useLocation() || {};

  const startDate = state?.startDate || "";
  const endDate = state?.endDate || "";

  // Replace with backend data later
  const rows = state?.rows || [];

  return (

    <Box sx={{ bgcolor: "#edf1f5", minHeight: "100vh", py: 2 }}>

      {/* ================= PRINT AREA ================= */}

      <Box
        id="print-area"
        sx={{
          width: "190mm",
          minHeight: "277mm",
          margin: "auto",
          background: "#fff",
          padding: "8mm",
          fontFamily: "Times New Roman",
          fontSize: "11px",
          color: "#000",
          boxShadow: "0 0 5px rgba(0,0,0,0.15)"
        }}
      >

        {/* ================= HEADER ================= */}

        <div style={{
          textAlign: "center",
          fontWeight: "bold",
          fontSize: "14px"
        }}>
          Phadke Prakashan, Kolhapur
        </div>

        <div style={{
          textAlign: "center",
          fontWeight: "bold",
          fontSize: "12px",
          marginTop: "2px"
        }}>
          Receipt Register
        </div>

        <div style={{
          textAlign: "center",
          fontSize: "11px",
          marginTop: "3px",
          marginBottom: "8px"
        }}>
          Period : {startDate} to {endDate}
        </div>


        {/* ================= TABLE ================= */}

        <table
          width="100%"
          style={{
            borderCollapse: "collapse",
            fontSize: "11px"
          }}
        >

          <thead>

            <tr>

              <th style={th}>Rcpt No</th>

              <th style={th}>Account Name</th>

              <th style={th}>Particulars</th>

              <th style={thRight}>Cash</th>

              <th style={thRight}>Chq</th>

              <th style={thRight}>DD</th>

            </tr>

          </thead>


          <tbody>

            {rows.length === 0 && (

              <tr>

                <td
                  colSpan="6"
                  style={{
                    textAlign: "center",
                    padding: "20px"
                  }}
                >
                  No receipt records for selected period
                </td>

              </tr>

            )}


            {rows.map((row, index) => (

              <tr key={index}>

                <td style={td}>{row.no}</td>

                <td style={td}>{row.account}</td>

                <td style={td}>{row.particular}</td>

                <td style={tdRight}>{row.cash}</td>

                <td style={tdRight}>{row.chq}</td>

                <td style={tdRight}>{row.dd}</td>

              </tr>

            ))}

          </tbody>

        </table>


        {/* ================= FOOTER ================= */}

        <div style={{
          borderTop: "1px solid black",
          marginTop: "10px"
        }} />

        <div style={{
          fontSize: "10px",
          marginTop: "4px"
        }}>
          Generated on : {new Date().toLocaleString()}
        </div>

      </Box>


      {/* ================= PRINT BUTTON ================= */}

      <Box textAlign="center" mt={2}>

        <Button
          variant="contained"
          size="small"
          startIcon={<PrintIcon />}
          onClick={() => window.print()}
        >
          Print
        </Button>

      </Box>


      {/* ================= PRINT CSS ================= */}

      <style>{`

        @page {
          size: A4;
          margin: 10mm;
        }

        @media print {

          body {
            background: white;
          }

          body * {
            visibility: hidden;
          }

          #print-area, #print-area * {
            visibility: visible;
          }

          #print-area {
            position: absolute;
            left: 0;
            top: 0;
            width: 190mm;
            padding: 8mm;
            box-shadow: none;
          }

        }

      `}</style>

    </Box>

  );

}


/* ================= TABLE STYLES ================= */

const th = {
  border: "1px solid black",
  padding: "4px",
  textAlign: "left",
  fontWeight: "bold"
};

const thRight = {
  border: "1px solid black",
  padding: "4px",
  textAlign: "right",
  fontWeight: "bold"
};

const td = {
  border: "1px solid black",
  padding: "4px",
  textAlign: "left"
};

const tdRight = {
  border: "1px solid black",
  padding: "4px",
  textAlign: "right"
};