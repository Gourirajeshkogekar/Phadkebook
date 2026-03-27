// import React from "react";
// import { Box, Typography } from "@mui/material";

// function DebitNoteRegisterPrint() {
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
//           D e b i t  N o t e  R e g i s t e r
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

// export default DebitNoteRegisterPrint;



import React from "react";
import { Box, Typography } from "@mui/material";
import dayjs from "dayjs";

function DebitNoteRegisterPrint({ startDate, endDate, rows = [] }) {

  /* EXTRACT DATE FROM PARTICULARS */

  const getDate = (text = "") => {
    const match = text.match(/\d{2}-\d{2}-\d{4}/);
    return match ? match[0] : "Unknown";
  };

  /* GROUP DATA BY DATE */

  const grouped = {};

  rows.forEach((row) => {
    const date = getDate(row["Particulars"]);
    if (!grouped[date]) grouped[date] = [];
    grouped[date].push(row);
  });

  let grandDebit = 0;
  let grandCredit = 0;

  return (

    <Box
      sx={{
        width: "210mm",
        minHeight: "297mm",
        background: "#fff",
        padding: "12mm",
        fontFamily: "Times New Roman"
      }}
    >

      <table
        style={{
          width: "100%",
          borderCollapse: "collapse"
        }}
      >

        {/* REPORT HEADER (REPEATS ON EVERY PAGE) */}

        <thead style={{ display: "table-header-group" }}>

          <tr>
            <th colSpan={5} style={{ border: "none", paddingBottom: "5px" }}>
              <Typography align="center" fontWeight="bold" fontSize={18}>
                Phadke Prakashan, Kolhapur.
              </Typography>
            </th>
          </tr>

          <tr>
            <th colSpan={5} style={{ border: "none", paddingBottom: "5px" }}>
              <Typography align="center" fontWeight="bold" fontSize={16}>
                Debit Note Register
              </Typography>
            </th>
          </tr>

          <tr>
            <th colSpan={5} style={{ border: "none", paddingBottom: "10px" }}>
              <Typography align="center" fontSize={12}>
                From {dayjs(startDate).format("DD-MM-YYYY")} to {dayjs(endDate).format("DD-MM-YYYY")}
              </Typography>
            </th>
          </tr>

          {/* COLUMN HEADER */}

          <tr>
            <th style={cell}>Entry No./Ref.No.</th>
            <th style={cell}>Account Name</th>
            <th style={cell}>Particulars</th>
            <th style={{ ...cell, textAlign: "right" }}>Debit</th>
            <th style={{ ...cell, textAlign: "right" }}>Credit</th>
          </tr>

        </thead>

        {/* TABLE BODY */}

        {Object.keys(grouped).map((date, index) => {

          const list = grouped[date];

          let dayDebit = 0;
          let dayCredit = 0;

          list.forEach((r) => {

            const debit = Number((r["Debit"] || "0").replace(/,/g, ""));
            const credit = Number((r["Credit"] || "0").replace(/,/g, ""));

            dayDebit += debit;
            dayCredit += credit;

          });

          grandDebit += dayDebit;
          grandCredit += dayCredit;

          return (

            <tbody key={index} style={{ pageBreakInside: "avoid" }}>

              {/* DATE ROW */}

              <tr>
                <td
                  colSpan={5}
                  style={{
                    ...cell,
                    fontWeight: "bold",
                    background: "#f3f3f3",
                    textAlign: "center"
                  }}
                >
                  {date}
                </td>
              </tr>

              {/* DATA ROWS */}

              {list.map((row, i) => (

                <tr key={i}>

                  <td style={cell}>
                    {row["Entry No./Ref.No."]}
                  </td>

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

              <tr>

                <td
                  colSpan={3}
                  style={{
                    ...cell,
                    fontWeight: "bold",
                    textAlign: "right"
                  }}
                >
                  Day Total
                </td>

                <td style={{ ...cell, textAlign: "right", fontWeight: "bold" }}>
                  {dayDebit.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                </td>

                <td style={{ ...cell, textAlign: "right", fontWeight: "bold" }}>
                  {dayCredit.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                </td>

              </tr>

            </tbody>

          );

        })}

        {/* GRAND TOTAL */}

        <tfoot style={{ display: "table-footer-group" }}>

          <tr>

            <td
              colSpan={3}
              style={{
                ...cell,
                fontWeight: "bold",
                textAlign: "right"
              }}
            >
              Grand Total
            </td>

            <td style={{ ...cell, textAlign: "right", fontWeight: "bold" }}>
              {grandDebit.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
            </td>

            <td style={{ ...cell, textAlign: "right", fontWeight: "bold" }}>
              {grandCredit.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
            </td>

          </tr>

        </tfoot>

      </table>

      {/* PRINT CSS */}

      <style>
        {`
          table{
            page-break-inside:auto;
          }

          tr{
            page-break-inside:avoid;
            page-break-after:auto;
          }

          thead{
            display:table-header-group;
          }

          tfoot{
            display:table-footer-group;
          }
        `}
      </style>

    </Box>

  );

}

const cell = {
  border: "1px solid black",
  padding: "6px",
  fontSize: "12px",
  textAlign: "center"
};

export default DebitNoteRegisterPrint;