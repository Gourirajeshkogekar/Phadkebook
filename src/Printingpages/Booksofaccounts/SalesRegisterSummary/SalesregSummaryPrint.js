// import React from "react";
// import { Box, Typography, Button } from "@mui/material";
 
// function SalesregsummaryPrint({ state }) {
//   const { startDate = "01-04-25", endDate = "31-03-26", rows = [] } = state || {};

//   const calculateTotal = (key) => rows.reduce((sum, r) => sum + (Number(r[key]) || 0), 0);

//   const totals = {
//     net: calculateTotal("netAmount"),
//     other: calculateTotal("otherCharges"),
//     cash: calculateTotal("cash"),
//     credit: calculateTotal("credit"),
//   };

//   return (
//     <Box sx={{ bgcolor: "#525659", minHeight: "100vh", py: 3, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
//       {/* ================= PRINT SHEET ================= */}
//       <Box
//         id="print-area"
//         sx={{
//           width: "210mm",
//           minHeight: "297mm",
//           bgcolor: "#fff",
//           px: "15mm", // Slightly wider margins like the original
//           py: "15mm",
//           fontFamily: '"Times New Roman", Times, serif',
//           color: "#000",
//         }}
//       >
//         {/* ================= HEADER ================= */}
//         <Typography align="center" sx={{ fontSize: "18px", fontWeight: "bold", mb: 0.5 }}>
//           Phadke Prakashan, Kolhapur.
//         </Typography>

//         <Typography align="center" sx={{ fontSize: "14px", fontWeight: "bold", mb: 0.5 }}>
//           Sales Register Summary
//         </Typography>

//         <Typography align="center" sx={{ fontSize: "12px", mb: 3 }}>
//           From {startDate} to {endDate}
//         </Typography>

//         {/* ================= TABLE ================= */}
//         <table
//           width="100%"
//           style={{
//             borderCollapse: "collapse",
//             fontSize: "12px",
//             lineHeight: "1.2"
//           }}
//         >
//           <thead>
//             {/* Top Border */}
//             <tr style={{ borderTop: "1px solid #000" }}>
//               <th align="left" style={{ padding: "8px 4px", fontWeight: "normal" }}>Date</th>
//               <th align="left" style={{ padding: "8px 4px", fontWeight: "normal" }}>Particulars</th>
//               <th align="right" style={{ padding: "8px 4px", fontWeight: "normal" }}>Net Amount</th>
//               <th align="right" style={{ padding: "8px 4px", fontWeight: "normal", width: "100px" }}>Other Charges/<br/>Round Off</th>
//               <th colSpan={2} align="center" style={{ padding: "4px", fontWeight: "normal" }}>
//                 <div style={{ borderBottom: "1px solid #000", marginBottom: "4px", paddingBottom: "4px" }}>Invoice Amount</div>
//                 <div style={{ display: 'flex', justifyContent: 'space-between' }}>
//                   <span style={{ width: "50%", textAlign: "right", paddingRight: "10px" }}>Cash</span>
//                   <span style={{ width: "50%", textAlign: "right" }}>Credit</span>
//                 </div>
//               </th>
//             </tr>
//             {/* Bottom Border of Header */}
//             <tr style={{ borderBottom: "1px solid #000" }}><td colSpan={6} style={{ height: "0px" }}></td></tr>
//           </thead>

//           <tbody style={{ verticalAlign: "top" }}>
//             {/* Spacing row */}
//             <tr style={{ height: "8px" }}><td colSpan={6}></td></tr>
            
//             {rows.length === 0 ? (
//               <tr>
//                 <td colSpan={6} style={{ padding: 40, textAlign: "center", fontStyle: "italic" }}>
//                   No Data Available
//                 </td>
//               </tr>
//             ) : (
//               rows.map((r, i) => (
//                 <tr key={i}>
//                   <td style={{ padding: "2px 4px", width: "15%" }}>{r.date}</td>
//                   <td style={{ padding: "2px 4px", width: "20%" }}>{r.particulars}</td>
//                   <td align="right" style={{ padding: "2px 4px", width: "15%" }}>{Number(r.netAmount).toFixed(2)}</td>
//                   <td align="right" style={{ padding: "2px 4px", width: "15%" }}>
//                     {r.otherCharges ? Number(r.otherCharges).toFixed(2) : ""}
//                   </td>
//                   <td align="right" style={{ padding: "2px 4px", width: "15%" }}>
//                     {r.cash ? Number(r.cash).toFixed(2) : ""}
//                   </td>
//                   <td align="right" style={{ padding: "2px 4px", width: "20%" }}>
//                     {r.credit ? Number(r.credit).toFixed(2) : ""}
//                   </td>
//                 </tr>
//               ))
//             )}
//             {/* Bottom spacing before total */}
//             <tr style={{ height: "20px" }}><td colSpan={6}></td></tr>
//           </tbody>

//           <tfoot>
//             {/* Grand Total Line */}
//             <tr style={{ borderTop: "1px solid #000" }}>
//               <td colSpan={2} align="right" style={{ padding: "8px 4px", fontWeight: "bold" }}>Grand Total</td>
//               <td align="right" style={{ padding: "8px 4px", fontWeight: "bold" }}>{totals.net.toFixed(2)}</td>
//               <td align="right" style={{ padding: "8px 4px", fontWeight: "bold" }}>{totals.other.toFixed(2)}</td>
//               <td align="right" style={{ padding: "8px 4px", fontWeight: "bold" }}>{totals.cash.toFixed(2)}</td>
//               <td align="right" style={{ padding: "8px 4px", fontWeight: "bold" }}>{totals.credit.toFixed(2)}</td>
//             </tr>
//             {/* Double Border effect at the end */}
//             <tr style={{ borderTop: "1px solid #000" }}>
//                <td colSpan={6} style={{ borderTop: "1px solid #000", height: "2px" }}></td>
//             </tr>
//           </tfoot>
//         </table>
//       </Box>

     

//       <style>{`
//         @media print {
//           @page { size: A4; margin: 0; }
//           body { background: none !important; }
//           .no-print { display: none !important; }
//           #print-area {
//             box-shadow: none !important;
//             width: 100% !important;
//             margin: 0 !important;
//           }
//         }
//       `}</style>
//     </Box>
//   );
// }

// export default SalesregsummaryPrint;


import React from "react";
import { Box, Typography, Button } from "@mui/material";
 
function SalesregsummaryPrint({ state }) {
  const { startDate = "01-04-25", endDate = "31-03-26", rows = [] } = state || {};

  const calculateTotal = (key) => rows.reduce((sum, r) => sum + (Number(r[key]) || 0), 0);

  const totals = {
    net: calculateTotal("netAmount"),
    other: calculateTotal("otherCharges"),
    cash: calculateTotal("cash"),
    credit: calculateTotal("credit"),
  };

  return (
    <Box sx={{ bgcolor: "#525659", minHeight: "100vh", py: 3, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      {/* ================= PRINT SHEET ================= */}
      <Box
        id="print-area"
        sx={{
          width: "210mm",
          minHeight: "297mm",
          bgcolor: "#fff",
          px: "15mm", // Slightly wider margins like the original
          py: "15mm",
          fontFamily: '"Times New Roman", Times, serif',
          color: "#000",
        }}
      >
        {/* ================= HEADER ================= */}
        <Typography align="center" sx={{ fontSize: "18px", fontWeight: "bold", mb: 0.5 }}>
          Phadke Prakashan, Kolhapur.
        </Typography>

        <Typography align="center" sx={{ fontSize: "14px", fontWeight: "bold", mb: 0.5 }}>
          Sales Register Summary
        </Typography>

        <Typography align="center" sx={{ fontSize: "12px", mb: 3 }}>
          From {startDate} to {endDate}
        </Typography>

        {/* ================= TABLE ================= */}
        <table
          width="100%"
          style={{
            borderCollapse: "collapse",
            fontSize: "12px",
            lineHeight: "1.2"
          }}
        >
          <thead>
            {/* Top Border */}
            <tr style={{ borderTop: "1px solid #000" }}>
              <th align="left" style={{ padding: "8px 4px", fontWeight: "normal" }}>Date</th>
              <th align="left" style={{ padding: "8px 4px", fontWeight: "normal" }}>Particulars</th>
              <th align="right" style={{ padding: "8px 4px", fontWeight: "normal" }}>Net Amount</th>
              <th align="right" style={{ padding: "8px 4px", fontWeight: "normal", width: "100px" }}>Other Charges/<br/>Round Off</th>
              <th colSpan={2} align="center" style={{ padding: "4px", fontWeight: "normal" }}>
                <div style={{ borderBottom: "1px solid #000", marginBottom: "4px", paddingBottom: "4px" }}>Invoice Amount</div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ width: "50%", textAlign: "right", paddingRight: "10px" }}>Cash</span>
                  <span style={{ width: "50%", textAlign: "right" }}>Credit</span>
                </div>
              </th>
            </tr>
            {/* Bottom Border of Header */}
            <tr style={{ borderBottom: "1px solid #000" }}><td colSpan={6} style={{ height: "0px" }}></td></tr>
          </thead>

          <tbody style={{ verticalAlign: "top" }}>
            {/* Spacing row */}
            <tr style={{ height: "8px" }}><td colSpan={6}></td></tr>
            
            {rows.length === 0 ? (
              <tr>
                <td colSpan={6} style={{ padding: 40, textAlign: "center", fontStyle: "italic" }}>
                  No Data Available
                </td>
              </tr>
            ) : (
              rows.map((r, i) => (
                <tr key={i}>
                  <td style={{ padding: "2px 4px", width: "15%" }}>{r.date}</td>
                  <td style={{ padding: "2px 4px", width: "20%" }}>{r.particulars}</td>
                  <td align="right" style={{ padding: "2px 4px", width: "15%" }}>{Number(r.netAmount).toFixed(2)}</td>
                  <td align="right" style={{ padding: "2px 4px", width: "15%" }}>
                    {r.otherCharges ? Number(r.otherCharges).toFixed(2) : ""}
                  </td>
                  <td align="right" style={{ padding: "2px 4px", width: "15%" }}>
                    {r.cash ? Number(r.cash).toFixed(2) : ""}
                  </td>
                  <td align="right" style={{ padding: "2px 4px", width: "20%" }}>
                    {r.credit ? Number(r.credit).toFixed(2) : ""}
                  </td>
                </tr>
              ))
            )}
            {/* Bottom spacing before total */}
            <tr style={{ height: "20px" }}><td colSpan={6}></td></tr>
          </tbody>

          <tfoot>
            {/* Grand Total Line */}
            <tr style={{ borderTop: "1px solid #000" }}>
              <td colSpan={2} align="right" style={{ padding: "8px 4px", fontWeight: "bold" }}>Grand Total</td>
              <td align="right" style={{ padding: "8px 4px", fontWeight: "bold" }}>{totals.net.toFixed(2)}</td>
              <td align="right" style={{ padding: "8px 4px", fontWeight: "bold" }}>{totals.other.toFixed(2)}</td>
              <td align="right" style={{ padding: "8px 4px", fontWeight: "bold" }}>{totals.cash.toFixed(2)}</td>
              <td align="right" style={{ padding: "8px 4px", fontWeight: "bold" }}>{totals.credit.toFixed(2)}</td>
            </tr>
            {/* Double Border effect at the end */}
            <tr style={{ borderTop: "1px solid #000" }}>
               <td colSpan={6} style={{ borderTop: "1px solid #000", height: "2px" }}></td>
            </tr>
          </tfoot>
        </table>
      </Box>

     

      <style>{`
        @media print {
          @page { size: A4; margin: 0; }
          body { background: none !important; }
          .no-print { display: none !important; }
          #print-area {
            box-shadow: none !important;
            width: 100% !important;
            margin: 0 !important;
          }
        }
      `}</style>
    </Box>
  );
}

export default SalesregsummaryPrint;































