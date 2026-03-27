// import React from "react";
// import { Box, Typography, Button } from "@mui/material";
// import PrintIcon from "@mui/icons-material/Print";
// import { useLocation } from "react-router-dom";

// function SalesRegisterPrint() {
//   const { state } = useLocation() || {};
//   const { startDate, endDate, rows = [] } = state || {};

//   return (
//     <Box
//       sx={{
//         bgcolor: "#e6eaef",
//         minHeight: "100vh",
//         py: 3,
//         fontFamily: `"Times New Roman", Georgia, serif`
//       }}
//     >
//       {/* ================= A4 PAGE ================= */}
//       <Box
//         id="print-area"
//         sx={{
//           width: "210mm",
//           minHeight: "297mm",
//           mx: "auto",
//           bgcolor: "#fff",
//           px: "16mm",
//           py: "12mm",
//           boxShadow: "0 0 30px rgba(0,0,0,0.18)"
//         }}
//       >

//         {/* ================= HEADER ================= */}
//         <Typography align="center" fontSize={18} fontWeight={700}>
//           Phadke Prakashan, Kolhapur.
//         </Typography>

//         <Typography align="center" fontSize={14} mt={0.5}>
//           Sales Register Summary
//         </Typography>

//         <Typography align="center" fontSize={12} mt={0.5}>
//           From {startDate} to {endDate}
//         </Typography>

//         {/* double line */}
//         <Box sx={{ borderTop: "1px solid #000", mt: 1 }} />
//         <Box sx={{ borderTop: "1px solid #000", mt: 0.3, mb: 1 }} />

//         {/* ================= TABLE ================= */}
//         <table
//           width="100%"
//           style={{
//             borderCollapse: "collapse",
//             fontSize: "12px"
//           }}
//         >
//           <thead>
//             {/* header row */}
//             <tr>
//               <th align="left" width="12%">Date</th>
//               <th align="left" width="28%">Particulars</th>
//               <th align="right" width="14%">Net Amount</th>
//               <th align="right" width="16%">Other Charges / Round Off</th>
//               <th colSpan="2" align="center" width="18%">
//                 Invoice Amount
//               </th>
//             </tr>

//             {/* sub header */}
//             <tr style={{ borderBottom: "1px solid #000" }}>
//               <th />
//               <th />
//               <th />
//               <th />
//               <th align="right" style={{ borderTop: "1px solid #000" }}>
//                 Cash
//               </th>
//               <th align="right" style={{ borderTop: "1px solid #000" }}>
//                 Credit
//               </th>
//             </tr>
//           </thead>

//           <tbody>
//             {/* ================= BACKEND DATA HERE ================= */}
//             {rows.map((r, i) => (
//               <tr key={i}>
//                 <td>{r.date}</td>
//                 <td>{r.particulars}</td>
//                 <td align="right">{r.netAmount}</td>
//                 <td align="right">{r.roundOff}</td>
//                 <td align="right">{r.cash}</td>
//                 <td align="right">{r.credit}</td>
//               </tr>
//             ))}

//             {/* optional total row structure */}
//             <tr style={{ borderTop: "1px solid #000" }}>
//               <td colSpan="6" style={{ height: 20 }} />
//             </tr>

//             <tr style={{ borderTop: "1px solid #000" }}>
//               <td />
//               <td><b>Total</b></td>
//               <td align="right">{/* totalNet */}</td>
//               <td align="right">{/* totalRound */}</td>
//               <td align="right">{/* totalCash */}</td>
//               <td align="right">{/* totalCredit */}</td>
//             </tr>
//           </tbody>
//         </table>

//       </Box>

      

//       {/* ================= PRINT CSS ================= */}
//       <style>{`
//         @page { size: A4; margin: 12mm; }

//         @media print {
//           body * { visibility: hidden; }
//           #print-area, #print-area * { visibility: visible; }

//           #print-area {
//             position: absolute;
//             left: 0;
//             top: 0;
//             width: 210mm;
//             box-shadow: none;
//           }
//         }

//         th {
//           font-weight: 700;
//           padding: 4px 2px;
//         }

//         td {
//           padding: 3px 2px;
//           vertical-align: top;
//         }
//       `}</style>
//     </Box>
//   );
// }

// export default SalesRegisterPrint;


import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export default function SalesSummaryDatewisePrint({
  startDate,
  endDate,
  party = "",
  rows = []
}) {

  const totalNet = rows.reduce((a, b) => a + Number(b["Net Amount"] || 0), 0);
  const totalRound = rows.reduce(
    (a, b) => a + Number(b["Other Charges / Round Off"] || 0),
    0
  );
  const totalCash = rows.reduce((a, b) => a + Number(b["Cash"] || 0), 0);
  const totalCredit = rows.reduce((a, b) => a + Number(b["Credit"] || 0), 0);

  const pdf = new jsPDF("p", "mm", "a4");

  const pageWidth = pdf.internal.pageSize.getWidth();

  /* ================= TABLE BODY ================= */

  const body = rows.map((r) => [
    r["Date"],
    r["Particulars"],
    Number(r["Net Amount"] || 0).toLocaleString("en-IN", {
      minimumFractionDigits: 2
    }),
    Number(r["Other Charges / Round Off"] || 0).toLocaleString("en-IN", {
      minimumFractionDigits: 2
    }),
    Number(r["Cash"] || 0).toLocaleString("en-IN", {
      minimumFractionDigits: 2
    }),
    Number(r["Credit"] || 0).toLocaleString("en-IN", {
      minimumFractionDigits: 2
    })
  ]);

  /* ================= TOTAL ROW ================= */

  body.push([
    "",
    "Total",
    totalNet.toLocaleString("en-IN", { minimumFractionDigits: 2 }),
    totalRound.toLocaleString("en-IN", { minimumFractionDigits: 2 }),
    totalCash.toLocaleString("en-IN", { minimumFractionDigits: 2 }),
    totalCredit.toLocaleString("en-IN", { minimumFractionDigits: 2 })
  ]);

  /* ================= TABLE ================= */

  autoTable(pdf, {
    startY: 40,

    head: [
      [
        "Date",
        "Particulars",
        "Net Amount",
        "Other Charges / Round Off",
        "Cash",
        "Credit"
      ]
    ],

    body: body,

    styles: {
      fontSize: 9,
      font: "times"
    },

    headStyles: {
      fillColor: [255, 255, 255],
      textColor: [0, 0, 0],
      lineWidth: 0.2
    },

    columnStyles: {
      2: { halign: "right" },
      3: { halign: "right" },
      4: { halign: "right" },
      5: { halign: "right" }
    },

    didDrawPage: function (data) {

      /* HEADER */

      pdf.setFont("times", "bold");
      pdf.setFontSize(14);

      pdf.text(
        "Phadke Prakashan, Kolhapur.",
        pageWidth / 2,
        10,
        { align: "center" }
      );

      pdf.setFontSize(12);

      pdf.text(
        "Sales Register Summary",
        pageWidth / 2,
        17,
        { align: "center" }
      );

      pdf.setFontSize(10);

      pdf.text(
        `From ${startDate} to ${endDate} ${party || ""}`,
        pageWidth / 2,
        23,
        { align: "center" }
      );

      /* PAGE NUMBER */

      const pageNumber = pdf.internal.getNumberOfPages();

      pdf.text(
        `Page ${pageNumber}`,
        pageWidth - 20,
        10
      );

    }
  });

  /* ================= OPEN PDF ================= */

  window.open(pdf.output("bloburl"), "_blank");

  return null;
}