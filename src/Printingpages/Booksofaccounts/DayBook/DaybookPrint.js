// import React from "react";
// import { Box, Typography } from "@mui/material";

// function DayBookPrint() {
//   const params = new URLSearchParams(window.location.search);
//   const startDate = params.get("start") || "01-04-25";
//   const endDate = params.get("end") || "31-03-26";
//   const types = params.get("types");

//   // Create an array of 25 empty rows to fill the page
//   const emptyRows = Array.from({ length: 25 });

//   return (
//     <Box sx={{ minHeight: "100vh", background: "#e9edf3", p: { xs: 1, sm: 4 } }}>
//       <Box
//         id="print-area"
//         sx={{
//           maxWidth: 1100,
//           mx: "auto",
//           bgcolor: "#fff",
//           p: "10mm", // Standard print padding
//           fontFamily: `'Times New Roman', Times, serif`,
//           color: "#000",
//           minHeight: "297mm", // A4 Height
//           boxSizing: "border-box"
//         }}
//       >
//         {/* HEADER */}
//         <Typography align="center" fontWeight={700} fontSize={18} sx={{ mb: 0.5 }}>
//           Phadke Prakashan, Kolhapur.
//         </Typography>
//         <Typography align="center" sx={{ letterSpacing: 4, fontWeight: 600, fontSize: 16, mb: 0.5 }}>
//           D a y B o o k
//         </Typography>
//         <Typography align="center" fontSize={13} mb={2}>
//           From {startDate} to {endDate} ({types || "Transaction Datewise"})
//         </Typography>

//         {/* FULL BORDERED TABLE */}
//         <table style={{ 
//           width: "100%", 
//           borderCollapse: "collapse", 
//           fontSize: "11px", 
//           border: "1px solid #000" // Outer border
//         }}>
//           <thead>
//             <tr style={{ backgroundColor: "#f9f9f9" }}>
//               <th style={cellStyle}>User Id</th>
//               <th style={cellStyle}>Entry No</th>
//               <th style={cellStyle}>Ref No</th>
//               <th style={cellStyle}>Tr.Type</th>
//               <th style={{ ...cellStyle, textAlign: "left", width: "20%" }}>Account Name</th>
//               <th style={{ ...cellStyle, textAlign: "left", width: "25%" }}>Particulars</th>
//               <th style={cellStyle}>Cheq No</th>
//               <th style={{ ...cellStyle, textAlign: "right" }}>Debit</th>
//               <th style={{ ...cellStyle, textAlign: "right" }}>Credit</th>
//             </tr>
//           </thead>
//           <tbody>
//             {emptyRows.map((_, index) => (
//               <tr key={index} style={{ height: "28px" }}> {/* Fixed height for rows */}
//                 <td style={cellStyle}></td>
//                 <td style={cellStyle}></td>
//                 <td style={cellStyle}></td>
//                 <td style={cellStyle}></td>
//                 <td style={cellStyle}></td>
//                 <td style={cellStyle}></td>
//                 <td style={cellStyle}></td>
//                 <td style={cellStyle}></td>
//                 <td style={cellStyle}></td>
//               </tr>
//             ))}
//           </tbody>
//           <tfoot>
//             <tr style={{ fontWeight: 'bold', height: '30px' }}>
//               <td colSpan={7} style={{ ...cellStyle, textAlign: 'right', paddingRight: '10px' }}>Total:</td>
//               <td style={cellStyle}></td>
//               <td style={cellStyle}></td>
//             </tr>
//           </tfoot>
//         </table>
//       </Box>

//       <style>{`
//         @media print {
//           @page { size: A4; margin: 0; }
//           body { background: none !important; margin: 0; padding: 0; }
//           body * { visibility: hidden; }
//           #print-area, #print-area * { visibility: visible; }
//           #print-area {
//             position: absolute;
//             left: 0;
//             top: 0;
//             width: 100%;
//             border: none;
//           }
//         }
//       `}</style>
//     </Box>
//   );
// }

// // Unified cell style for both th and td to ensure borders connect
// const cellStyle = {
//   padding: "4px 4px",
//   border: "1px solid #000", // Full grid borders
//   fontSize: "11px",
//   textAlign: "center"
// };

// export default DayBookPrint;





import React from "react";
import { Box } from "@mui/material";
import dayjs from "dayjs";

function DayBookPrint({ startDate, endDate, rows = [] }) {

  /* SORT DATA BY DATE */

  const sortedRows = [...rows].sort((a, b) => {
    return new Date(a.Date) - new Date(b.Date);
  });

  /* GROUP DATA BY DATE */

  const grouped = {};

  sortedRows.forEach((row) => {

    const dateKey = row["Date"]
      ? dayjs(row["Date"]).format("DD-MM-YYYY")
      : "No Date";

    if (!grouped[dateKey]) grouped[dateKey] = [];

    grouped[dateKey].push(row);

  });

  let grandDebit = 0;
  let grandCredit = 0;

  return (

    <Box
      sx={{
        width: "210mm",
        minHeight: "297mm",
        padding: "10mm",
        background: "#fff",
        fontFamily: "Times New Roman"
      }}
    >

      <table
        style={{
          width: "100%",
          borderCollapse: "collapse",
          fontSize: "11px"
        }}
      >

        {/* HEADER (REPEATS ON EVERY PAGE) */}

        <thead>

          <tr>
            <th colSpan="9" style={{ border: "none", fontSize: "18px", paddingBottom: "4px" }}>
              Phadke Prakashan, Kolhapur.
            </th>
          </tr>

          <tr>
            <th colSpan="9" style={{ border: "none", fontSize: "16px", paddingBottom: "4px" }}>
              Day Book
            </th>
          </tr>

          <tr>
            <th colSpan="9" style={{ border: "none", fontSize: "13px", paddingBottom: "10px" }}>
              From {dayjs(startDate).format("DD-MM-YYYY")} to {dayjs(endDate).format("DD-MM-YYYY")} (System Datewise)
            </th>
          </tr>

          {/* COLUMN HEADER */}

          <tr>
            <th style={cell}>User Id</th>
            <th style={cell}>Entry</th>
            <th style={cell}>Ref</th>
            <th style={cell}>Trans Type</th>
            <th style={{ ...cell, textAlign: "left" }}>Account Name</th>
            <th style={{ ...cell, textAlign: "left" }}>Particulars</th>
            <th style={cell}>Cheque No</th>
            <th style={{ ...cell, textAlign: "right" }}>Debit</th>
            <th style={{ ...cell, textAlign: "right" }}>Credit</th>
          </tr>

        </thead>

        <tbody>

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

              <React.Fragment key={index}>

                {/* DATE HEADER */}

                <tr>
                  <td
                    colSpan={9}
                    style={{
                      ...cell,
                      textAlign: "center",
                      fontWeight: "bold",
                      background: "#f3f3f3"
                    }}
                  >
                    {date}
                  </td>
                </tr>

                {/* ROWS */}

                {list.map((row, i) => (

                  <tr key={i}>

                    <td style={cell}>{row["User Id"]}</td>
                    <td style={cell}>{row["EntryNo."]}</td>
                    <td style={cell}>{row["RefNo."]}</td>
                    <td style={cell}>{row["Tr.Type"]}</td>

                    <td style={{ ...cell, textAlign: "left" }}>
                      {row["Account Name"]}
                    </td>

                    <td style={{ ...cell, textAlign: "left" }}>
                      {row["Particulars"]}
                    </td>

                    <td style={cell}>{row["Cheq No"]}</td>

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

                  <td colSpan={7}
                    style={{
                      ...cell,
                      textAlign: "right",
                      fontWeight: "bold"
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

              </React.Fragment>

            );

          })}

        </tbody>

        {/* GRAND TOTAL */}

        <tfoot>

          <tr>

            <td colSpan={7}
              style={{
                ...cell,
                textAlign: "right",
                fontWeight: "bold"
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
          thead{
            display: table-header-group;
          }

          tfoot{
            display: table-footer-group;
          }

          tr{
            page-break-inside: avoid;
          }
        `}
      </style>

    </Box>

  );

}

const cell = {
  border: "1px solid black",
  padding: "4px",
  fontSize: "11px",
  textAlign: "center"
};

export default DayBookPrint;