// import React from "react";
// import { Box, Typography, Button } from "@mui/material";
// import PrintIcon from "@mui/icons-material/Print";
// import { useLocation } from "react-router-dom";

// function TransactionSummaryPrint() {
//   const { state } = useLocation() || {};

//   const {
//     startDate = "",
//     endDate = "",
//     accountGroup = "",
//     transactions = [],
//     rows = [] // 👈 backend sends this
//   } = state || {};

//   /* ===== helpers ===== */

//   const num = (v) =>
//     Number(v || 0).toLocaleString("en-IN", {
//       minimumFractionDigits: 2,
//       maximumFractionDigits: 2
//     });

//   const grandTotal = rows.reduce(
//     (s, r) => s + Number(r.total || 0),
//     0
//   );

//   /* ===== UI ===== */

//   return (
//     <Box sx={{ background: "#dfe3ea", minHeight: "100vh", py: 3 }}>

//       {/* ================= PRINT PAGE ================= */}

//       <Box
//         id="print-area"
//         sx={{
//           width: "210mm",
//           minHeight: "297mm",
//           mx: "auto",
//           bgcolor: "#fff",
//           px: "18mm",
//           py: "14mm",
//           fontFamily: '"Times New Roman", serif',
//           fontSize: 13,
//           color: "#000"
//         }}
//       >

//         {/* ===== HEADER ===== */}

//         <Typography align="center" fontSize={18} fontWeight={700}>
//           Phadke Prakashan, Kolhapur
//         </Typography>

//         <Typography align="center" fontSize={14} fontWeight={600}>
//           Transaction Summary
//         </Typography>

//         <Typography align="center" fontSize={12}>
//           From {startDate} to {endDate}
//           {accountGroup && `   Select Group - ${accountGroup}`}
//         </Typography>

//         <Typography align="right" fontSize={11} mt={1}>
//           Page 1 of 1
//         </Typography>

//         {/* ===== LINE ===== */}

//         <Box borderTop="1px solid #000" mt={1} mb={2} />

//         {/* ===== TRANSACTION LINE ===== */}

//         <Typography fontSize={12} mb={2}>
//           <b>Selected Transactions:</b>{" "}
//           {transactions.length ? transactions.join(", ") : "All"}
//         </Typography>

//         {/* ===== TABLE ===== */}

//         <table
//           width="100%"
//           style={{
//             borderCollapse: "collapse",
//             fontSize: 13
//           }}
//         >
//           <thead>
//             <tr
//               style={{
//                 borderTop: "1px solid #000",
//                 borderBottom: "1px solid #000"
//               }}
//             >
//               <th align="left" style={{ padding: "6px 4px" }}>
//                 Type of Sales
//               </th>
//               <th align="right">Basic Amount</th>
//               <th align="right">Sales Tax</th>
//               <th align="right">Other</th>
//               <th align="right">Total</th>
//             </tr>
//           </thead>

//           <tbody>

//             {rows.length === 0 && (
//               <tr>
//                 <td colSpan="5" style={{ padding: 20, textAlign: "center" }}>
//                   No data from backend
//                 </td>
//               </tr>
//             )}

//             {rows.map((r, i) => (
//               <tr key={i}>
//                 <td style={{ padding: "6px 4px" }}>{r.type}</td>
//                 <td align="right">{num(r.basic)}</td>
//                 <td align="right">{num(r.tax)}</td>
//                 <td align="right">{num(r.other)}</td>
//                 <td align="right">{num(r.total)}</td>
//               </tr>
//             ))}

//             {/* ===== TOTAL ===== */}

//             {rows.length > 0 && (
//               <tr
//                 style={{
//                   borderTop: "1px solid #000",
//                   borderBottom: "3px double #000",
//                   fontWeight: 700
//                 }}
//               >
//                 <td style={{ padding: "6px 4px" }}>
//                   *** TOTAL ***
//                 </td>
//                 <td />
//                 <td />
//                 <td />
//                 <td align="right">{num(grandTotal)}</td>
//               </tr>
//             )}

//           </tbody>
//         </table>

//         {/* ===== FOOTER ===== */}

//         <Typography fontSize={11} mt={6}>
//           Generated on : {new Date().toLocaleString()}
//         </Typography>

//       </Box>

     

 
//       <style>{`
//         @page { size: A4; margin: 12mm; }

//         @media print {
//           body * { visibility: hidden; }

//           #print-area, #print-area * {
//             visibility: visible;
//           }

//           #print-area {
//             position: absolute;
//             left: 0;
//             top: 0;
//             width: 210mm;
//           }
//         }
//       `}</style>

//     </Box>
//   );
// }

// export default TransactionSummaryPrint;

import React from "react";
import { Box, Typography, Button } from "@mui/material";
import PrintIcon from "@mui/icons-material/Print";
import { useLocation } from "react-router-dom";

function TransactionSummaryPrint() {
  const { state } = useLocation() || {};

  const {
    startDate = "",
    endDate = "",
    accountGroup = "",
    transactions = [],
    rows = [] // 👈 backend sends this
  } = state || {};

  /* ===== helpers ===== */

  const num = (v) =>
    Number(v || 0).toLocaleString("en-IN", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });

  const grandTotal = rows.reduce(
    (s, r) => s + Number(r.total || 0),
    0
  );

  /* ===== UI ===== */

  return (
    <Box sx={{ background: "#dfe3ea", minHeight: "100vh", py: 3 }}>

      {/* ================= PRINT PAGE ================= */}

      <Box
        id="print-area"
        sx={{
          width: "210mm",
          minHeight: "297mm",
          mx: "auto",
          bgcolor: "#fff",
          px: "18mm",
          py: "14mm",
          fontFamily: '"Times New Roman", serif',
          fontSize: 13,
          color: "#000"
        }}
      >

        {/* ===== HEADER ===== */}

        <Typography align="center" fontSize={18} fontWeight={700}>
          Phadke Prakashan, Kolhapur
        </Typography>

        <Typography align="center" fontSize={14} fontWeight={600}>
          Transaction Summary
        </Typography>

        <Typography align="center" fontSize={12}>
          From {startDate} to {endDate}
          {accountGroup && `   Select Group - ${accountGroup}`}
        </Typography>

        <Typography align="right" fontSize={11} mt={1}>
          Page 1 of 1
        </Typography>

        {/* ===== LINE ===== */}

        <Box borderTop="1px solid #000" mt={1} mb={2} />

        {/* ===== TRANSACTION LINE ===== */}

        <Typography fontSize={12} mb={2}>
          <b>Selected Transactions:</b>{" "}
          {transactions.length ? transactions.join(", ") : "All"}
        </Typography>

        {/* ===== TABLE ===== */}

        <table
          width="100%"
          style={{
            borderCollapse: "collapse",
            fontSize: 13
          }}
        >
          <thead>
            <tr
              style={{
                borderTop: "1px solid #000",
                borderBottom: "1px solid #000"
              }}
            >
              <th align="left" style={{ padding: "6px 4px" }}>
                Type of Sales
              </th>
              <th align="right">Basic Amount</th>
              <th align="right">Sales Tax</th>
              <th align="right">Other</th>
              <th align="right">Total</th>
            </tr>
          </thead>

          <tbody>

            {rows.length === 0 && (
              <tr>
                <td colSpan="5" style={{ padding: 20, textAlign: "center" }}>
                  No data from backend
                </td>
              </tr>
            )}

            {rows.map((r, i) => (
              <tr key={i}>
                <td style={{ padding: "6px 4px" }}>{r.type}</td>
                <td align="right">{num(r.basic)}</td>
                <td align="right">{num(r.tax)}</td>
                <td align="right">{num(r.other)}</td>
                <td align="right">{num(r.total)}</td>
              </tr>
            ))}

            {/* ===== TOTAL ===== */}

            {rows.length > 0 && (
              <tr
                style={{
                  borderTop: "1px solid #000",
                  borderBottom: "3px double #000",
                  fontWeight: 700
                }}
              >
                <td style={{ padding: "6px 4px" }}>
                  *** TOTAL ***
                </td>
                <td />
                <td />
                <td />
                <td align="right">{num(grandTotal)}</td>
              </tr>
            )}

          </tbody>
        </table>

        {/* ===== FOOTER ===== */}

        <Typography fontSize={11} mt={6}>
          Generated on : {new Date().toLocaleString()}
        </Typography>

      </Box>

     

 
      <style>{`
        @page { size: A4; margin: 12mm; }

        @media print {
          body * { visibility: hidden; }

          #print-area, #print-area * {
            visibility: visible;
          }

          #print-area {
            position: absolute;
            left: 0;
            top: 0;
            width: 210mm;
          }
        }
      `}</style>

    </Box>
  );
}

export default TransactionSummaryPrint;