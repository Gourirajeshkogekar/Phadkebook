// import React, { useEffect, useState } from "react";
// import { Box, Typography, Divider, Button } from "@mui/material";
// import PrintIcon from "@mui/icons-material/Print";

// export default function JournalRegisterPrint() {

//   const [data, setData] = useState(null);

//   useEffect(() => {
//     const stored = JSON.parse(localStorage.getItem("journalRegisterData"));
//     setData(stored);
//   }, []);

//   return (
//     <Box
//       sx={{
//         minHeight: "100vh",
//         background: "#e9edf3",
//         p: 4,
//         fontFamily: `"Inter","Roboto","Segoe UI",Arial,sans-serif`
//       }}
//     >
//       <Box
//         id="print-area"
//         sx={{
//           maxWidth: 950,
//           mx: "auto",
//           bgcolor: "#fff",
//           p: 6,
//           borderRadius: 2,
//           boxShadow: "0 25px 70px rgba(0,0,0,0.18)"
//         }}
//       >

//         {/* HEADER */}
//         <Typography align="center" fontWeight={700} fontSize={20}>
//           PHADKE PRAKASHAN, KOLHAPUR
//         </Typography>

//         <Typography
//           align="center"
//           mt={1}
//           letterSpacing={6}
//           fontWeight={700}
//         >
//           JOURNAL REGISTER
//         </Typography>

//         <Typography align="center" mt={1} fontSize={14}>
//           From {data?.startDate} to {data?.endDate}
//         </Typography>

//         <Divider sx={{ my: 3, borderColor: "#000" }} />

//         {/* TABLE HEADER */}
//         <Box
//           sx={{
//             display: "grid",
//             gridTemplateColumns: "160px 1.4fr 1.6fr 140px 140px",
//             fontWeight: 700,
//             fontSize: 13
//           }}
//         >
//           <div>Entry No / Ref</div>
//           <div>Account Name</div>
//           <div>Particulars</div>
//           <div style={{ textAlign: "right" }}>Debit</div>
//           <div style={{ textAlign: "right" }}>Credit</div>
//         </Box>

//         <Divider sx={{ borderColor: "#000", my: 2 }} />

//         {/* EMPTY STRUCTURE */}
//         <Box
//           sx={{
//             py: 8,
//             textAlign: "center",
//             color: "#607d8b"
//           }}
//         >
//           Journal transaction rows will render here after API integration
//         </Box>

//       </Box>

    

//       {/* PRINT CSS */}
//       <style>{`
//         @media print {
//           body * { visibility: hidden; }
//           #print-area, #print-area * { visibility: visible; }

//           #print-area {
//             position: absolute;
//             left: 0;
//             top: 0;
//             width: 100%;
//             box-shadow: none;
//             border-radius: 0;
//           }
//         }
//       `}</style>

//     </Box>
//   );
// }




import { useEffect } from "react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export default function JournalRegisterPrint({ printing }) {

  useEffect(() => {

    if (!printing) return;

    const stored = JSON.parse(localStorage.getItem("journalRegisterData"));

    if (!stored) return;

    const rows = stored.rows || [];

    /* ===============================
       GROUP DATA BY PARTICULARS
    =============================== */

    const groupedRows = rows.reduce((acc, row) => {

      const key = row["Particulars"] || "Unknown";

      if (!acc[key]) acc[key] = [];

      acc[key].push(row);

      return acc;

    }, {});

    /* ===============================
       FORMAT AMOUNT
    =============================== */

    const formatAmount = (val) => {

      const num = Number((val || "0").toString().replace(/,/g, ""));

      return num.toLocaleString("en-IN", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      });

    };

    /* ===============================
       PREPARE TABLE DATA
    =============================== */

    const tableRows = [];

    Object.keys(groupedRows).forEach((particular) => {

      const group = groupedRows[particular];

      let debitTotal = 0;
      let creditTotal = 0;

      /* GROUP TITLE */

      tableRows.push([
        {
          content: particular,
          colSpan: 5,
          styles: {
            halign: "center",
            fontStyle: "bold"
          }
        }
      ]);

      group.forEach((row) => {

        const debit = Number((row["Debit"] || "0").replace(/,/g, ""));
        const credit = Number((row["Credit"] || "0").replace(/,/g, ""));

        debitTotal += debit;
        creditTotal += credit;

        tableRows.push([
          row["Entry No. / Ref"] || "",
          row["Account Name"] || "",
          row["Particulars"] || "",
          formatAmount(debit),
          formatAmount(credit)
        ]);

      });

      /* DAY TOTAL */

      tableRows.push([
        "",
        {
          content: "Day Total",
          colSpan: 2,
          styles: { halign: "right", fontStyle: "bold" }
        },
        formatAmount(debitTotal),
        formatAmount(creditTotal)
      ]);

    });

    /* ===============================
       CREATE PDF
    =============================== */

    const pdf = new jsPDF("p", "mm", "a4");

    const pageWidth = pdf.internal.pageSize.getWidth();

    autoTable(pdf, {

      margin: { top: 40 },

      head: [[
        "Entry No / Ref",
        "Account Name",
        "Particulars",
        "Debit",
        "Credit"
      ]],

      body: tableRows,

      styles: {
        fontSize: 9,
        textColor: [0,0,0]
      },

      headStyles: {
        fillColor: [230,230,230],
        textColor: [0,0,0],
        fontStyle: "bold"
      },

      columnStyles: {
        3: { halign: "right" },
        4: { halign: "right" }
      },

      /* HEADER REPEAT */

      didDrawPage: () => {

        pdf.setFont("helvetica","bold");
        pdf.setFontSize(16);

        pdf.text(
          "PHADKE PRAKASHAN, KOLHAPUR",
          pageWidth / 2,
          10,
          { align: "center" }
        );

        pdf.setFontSize(13);

        pdf.text(
          "JOURNAL REGISTER",
          pageWidth / 2,
          17,
          { align: "center" }
        );

        pdf.setFont("helvetica","normal");
        pdf.setFontSize(11);

        pdf.text(
          `From ${stored.startDate} To ${stored.endDate}`,
          pageWidth / 2,
          24,
          { align: "center" }
        );

      }

    });

    /* OPEN PDF */

    window.open(pdf.output("bloburl"), "_blank");

  }, [printing]);

  return null;
}