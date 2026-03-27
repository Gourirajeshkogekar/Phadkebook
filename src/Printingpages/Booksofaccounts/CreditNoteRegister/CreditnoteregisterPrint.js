// import React from "react";
// import { Box, Typography } from "@mui/material";

// function CreditNoteRegisterPrint() {
//   const params = new URLSearchParams(window.location.search);
//   const startDate = params.get("start") || "01-04-25";
//   const endDate = params.get("end") || "31-03-26";

//   return (
//     <Box sx={{ minHeight: "100vh", bgcolor: "#808080", p: 4, display: 'flex', justifyContent: 'center' }}>
//       <Box
//         id="print-area"
//         sx={{
//           width: "210mm", // Standard A4 width
//           minHeight: "297mm",
//           bgcolor: "#fff",
//           p: "15mm",
//           boxShadow: "5px 5px 15px rgba(0,0,0,0.3)",
//           fontFamily: "'Times New Roman', Times, serif", // Matching the legacy print look
//           color: "#000"
//         }}
//       >
//         {/* Header Section */}
//         <Typography align="center" variant="h6" sx={{ fontWeight: "bold", fontSize: "18px" }}>
//           Phadke Prakashan, Kolhapur.
//         </Typography>

//         <Typography align="center" sx={{ fontWeight: "bold", fontSize: "16px", letterSpacing: 2, mt: 0.5 }}>
//           C r e d i t  N o t e  R e g i s t e r
//         </Typography>

//         <Typography align="center" sx={{ fontSize: "14px", mb: 2 }}>
//           From {startDate} to {endDate}
//         </Typography>

//         {/* Table Section */}
//         <table width="100%" style={{ borderCollapse: "collapse", borderTop: "1.5px solid #000" }}>
//           <thead>
//             <tr style={{ borderBottom: "1.5px solid #000" }}>
//               <th align="left" style={headerStyle}>Entry No./<br/>Ref.No.</th>
//               <th align="left" style={headerStyle}>Account Name</th>
//               <th align="left" style={headerStyle}>Particulars</th>
//               <th align="right" style={headerStyle}>Debit</th>
//               <th align="right" style={headerStyle}>Credit</th>
//             </tr>
//           </thead>

//           <tbody>
//             {/* Empty space for data as seen in your screenshot */}
//             <tr>
//               <td colSpan="5" style={{ height: "400px", verticalAlign: "top", textAlign: "center", paddingTop: "20px", color: "#999" }}>
//                 [ Data Rows Render Here ]
//               </td>
//             </tr>

//             {/* Totals Section */}
//             <tr style={{ borderTop: "1.5px solid #000" }}>
//               <td colSpan="3" align="right" style={{ padding: "8px 10px", fontWeight: "bold" }}>Day Total</td>
//               <td align="right" style={{ padding: "8px" }}></td>
//               <td align="right" style={{ padding: "8px" }}></td>
//             </tr>
//             <tr style={{ borderBottom: "1.5px solid #000" }}>
//               <td colSpan="3" align="right" style={{ padding: "8px 10px", fontWeight: "bold" }}>Grand Total</td>
//               <td align="right" style={{ padding: "8px" }}></td>
//               <td align="right" style={{ padding: "8px" }}></td>
//             </tr>
//           </tbody>
//         </table>
//       </Box>

//       <style>{`
//         @media print {
//           body { background: none !important; margin: 0; padding: 0; }
//           @page { size: auto; margin: 10mm; }
//           #print-area { 
//             box-shadow: none !important; 
//             width: 100% !important; 
//             margin: 0 !important;
//             padding: 0 !important;
//           }
//           /* Hide everything else when printing */
//           header, footer, button { display: none !important; }
//         }
//       `}</style>
//     </Box>
//   );
// }

// const headerStyle = {
//   padding: "8px 4px",
//   fontSize: "14px",
//   fontWeight: "bold",
// };

// export default CreditNoteRegisterPrint;


import React from "react";
import { Box } from "@mui/material";

function CreditNoteRegisterPrint({ rows = [] }) {

  /* Extract date from Particulars */
  const getDate = (text = "") => {
    const match = text.match(/\d{2}-\d{2}-\d{4}/);
    return match ? match[0] : "Unknown";
  };

  /* Group rows by date */
  const grouped = {};

  rows.forEach((row) => {
    const date = getDate(row["Particulars"]);

    if (!grouped[date]) grouped[date] = [];

    grouped[date].push(row);
  });

  let grandCredit = 0;

  return (

    <Box
      sx={{
        width: "210mm",
        background: "#fff",
        padding: "8mm",
        fontFamily: "Times New Roman"
      }}
    >

      <table
        width="100%"
        style={{
          borderCollapse: "collapse",
          pageBreakInside: "auto"
        }}
      >

        {/* TABLE HEADER */}

        <thead
          style={{
            borderTop: "2px solid black",
            borderBottom: "2px solid black",
            display: "table-header-group"
          }}
        >
          <tr>
            <th style={cell}>Entry No./Ref.No.</th>
            <th style={cell}>Account Name</th>
            <th style={cell}>Particulars</th>
            <th style={{ ...cell, textAlign: "right" }}>Debit</th>
            <th style={{ ...cell, textAlign: "right" }}>Credit</th>
          </tr>
        </thead>

        {Object.keys(grouped).map((date, index) => {

          const list = grouped[date];

          let dayTotal = 0;

          list.forEach((r) => {
            const credit = Number((r["Credit"] || "0").replace(/,/g, ""));
            dayTotal += credit;
          });

          grandCredit += dayTotal;

          return (

            <tbody key={index} style={{ pageBreakInside: "avoid" }}>

              {/* DATE ROW */}

              <tr style={{ pageBreakInside: "avoid" }}>
                <td
                  colSpan={5}
                  style={{
                    ...cell,
                    fontWeight: "bold",
                    background: "#f2f2f2"
                  }}
                >
                  {date}
                </td>
              </tr>

              {/* DATA ROWS */}

              {list.map((row, i) => (

                <tr key={i} style={{ pageBreakInside: "avoid" }}>
                  <td style={cell}>{row["Entry No./Ref.No."]}</td>

                  <td style={{ ...cell, textAlign: "left" }}>
                    {row["Account Name"]}
                  </td>

                  <td style={{ ...cell, textAlign: "left" }}>
                    {row["Particulars"]}
                  </td>

                  <td style={{ ...cell, textAlign: "right" }}>
                    {row["Debit"]}
                  </td>

                  <td style={{ ...cell, textAlign: "right" }}>
                    {row["Credit"]}
                  </td>
                </tr>

              ))}

              {/* DAY TOTAL */}

              <tr style={{ pageBreakInside: "avoid" }}>
                <td
                  colSpan={4}
                  style={{
                    ...cell,
                    fontWeight: "bold",
                    textAlign: "right"
                  }}
                >
                  Day Total
                </td>

                <td
                  style={{
                    ...cell,
                    textAlign: "right",
                    fontWeight: "bold"
                  }}
                >
                  {dayTotal.toLocaleString("en-IN", {
                    minimumFractionDigits: 2
                  })}
                </td>
              </tr>

            </tbody>

          );

        })}

        {/* GRAND TOTAL */}

        <tfoot>

          <tr style={{ borderTop: "2px solid black" }}>

            <td
              colSpan={4}
              style={{
                ...cell,
                fontWeight: "bold",
                textAlign: "right"
              }}
            >
              Grand Total
            </td>

            <td
              style={{
                ...cell,
                textAlign: "right",
                fontWeight: "bold"
              }}
            >
              {grandCredit.toLocaleString("en-IN", {
                minimumFractionDigits: 2
              })}
            </td>

          </tr>

        </tfoot>

      </table>

    </Box>

  );
}

const cell = {
  border: "1px solid black",
  padding: "6px",
  fontSize: "12px",
  textAlign: "center",
  verticalAlign: "middle"
};

export default CreditNoteRegisterPrint;