import React from "react";
import { Box, Button } from "@mui/material";
import PrintIcon from "@mui/icons-material/Print";
import { useLocation } from "react-router-dom";

export default function YearlyTDSRegisterPrint() {

  const { state } = useLocation() || {};

  const startDate = state?.startDate || "";
  const endDate = state?.endDate || "";
  const rows = state?.rows || [];

  return (

    <Box sx={{
      background: "#edf1f5",
      minHeight: "100vh",
      py: 1
    }}>

      {/* ================= A4 PAGE ================= */}

      <Box
        id="print-area"
        sx={{
          width: "210mm",
          minHeight: "297mm",
          margin: "auto",
          background: "#fff",
          padding: "5mm 7mm",
          boxShadow: "0 0 3px rgba(0,0,0,0.1)",
          fontFamily: "Times New Roman, serif",
          fontSize: "10px",
          color: "#000",
          lineHeight: "1.3"
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
          Yearly TDS Register
        </div>

        <div style={{
          textAlign: "center",
          fontSize: "10px",
          marginTop: "2px",
          marginBottom: "5px"
        }}>
          Period : {startDate} to {endDate}
        </div>

        {/* LINE */}

        <div style={{
          borderBottom: "1px solid black",
          marginBottom: "4px"
        }}/>


        {/* ================= TABLE ================= */}

        <table
          width="100%"
          style={{
            borderCollapse: "collapse",
            fontSize: "10px"
          }}
        >

          <thead>

            <tr>

              <th style={thCenter}>Sr</th>

              <th style={th}>PAN</th>

              <th style={th}>Account Name</th>

              <th style={th}>Address</th>

              <th style={th}>Type</th>

            </tr>

          </thead>


          <tbody>

            {rows.length > 0 ? (

              rows.map((row, index) => (

                <tr key={index}>

                  <td style={tdCenter}>{index + 1}</td>

                  <td style={td}>{row.pan}</td>

                  <td style={td}>{row.name}</td>

                  <td style={td}>{row.address}</td>

                  <td style={td}>{row.type}</td>

                </tr>

              ))

            ) : (

              <tr>

                <td
                  colSpan="5"
                  style={{
                    textAlign: "center",
                    padding: "8px",
                    fontSize: "10px"
                  }}
                >
                  No Data Available
                </td>

              </tr>

            )}

          </tbody>

        </table>


        {/* FOOTER LINE */}

        <div style={{
          borderBottom: "1px solid black",
          marginTop: "6px"
        }}/>


        {/* FOOTER */}

        <div style={{
          fontSize: "9px",
          marginTop: "3px"
        }}>
          Generated on : {new Date().toLocaleString()}
        </div>

      </Box>


      {/* PRINT BUTTON */}

      <Box textAlign="center" mt={1} className="no-print">

        <Button
          variant="contained"
          size="small"
          startIcon={<PrintIcon />}
          onClick={() => window.print()}
        >
          Print
        </Button>

      </Box>


      {/* ================= PRINT SETTINGS ================= */}

      <style>{`

        @page {
          size: A4;
          margin: 6mm;
        }

        body {
          margin: 0;
          padding: 0;
        }

        @media print {

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
            width: 210mm;
            padding: 5mm 7mm;
            box-shadow: none;
          }

          .no-print {
            display: none;
          }

        }

      `}</style>

    </Box>

  );

}


/* ================= TABLE STYLE ================= */

const th = {
  border: "1px solid black",
  padding: "3px",
  textAlign: "left",
  fontWeight: "bold"
};

const thCenter = {
  border: "1px solid black",
  padding: "3px",
  textAlign: "center",
  width: "35px",
  fontWeight: "bold"
};

const td = {
  border: "1px solid black",
  padding: "3px",
  textAlign: "left"
};

const tdCenter = {
  border: "1px solid black",
  padding: "3px",
  textAlign: "center"
};