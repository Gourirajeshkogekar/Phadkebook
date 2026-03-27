// import React from 'react';
// import { Box, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@mui/material";

// const SalesChallanPrint = React.forwardRef((props, ref) => {
//   // Mock data representing the items in your screenshot
//   const items = [
//     { id: 1, code: "P 5440", class: "School L.", desc: "Model Essays, Grammar & Communication Skill", qty: 2, rate: 45.00 },
//     { id: 2, code: "P 6348", class: "School L.", desc: "सुबोध हिंदी लेखन", qty: 14, rate: 50.00 },
//     { id: 3, code: "P 6425", class: "Std. XI", desc: "Basic Electricity & Semiconductor Devices", qty: 2, rate: 120.00 },
//     // ... add more items as per your screenshot
//   ];

//   return (
//     <Box 
//       ref={ref} 
//       sx={{ 
//         width: "210mm", 
//         minHeight: "297mm", 
//         p: "10mm", 
//         bgcolor: "white", 
//         color: "black",
//         fontFamily: "'Times New Roman', serif"
//       }}
//     >
//       {/* HEADER SECTION */}
//       <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 4, borderBottom: '1px solid black', pb: 2 }}>
//         <Box>
//           <Typography variant="h6" sx={{ fontWeight: 'bold' }}>Phadke Prakashan, Kolhapur.</Typography>
//           <Typography variant="caption" display="block">Phadke Bhavan, Near Hari Mandir, Dudhali</Typography>
//           <Typography variant="caption" display="block">Kolhapur - 416012. Tel No. - 2540 211</Typography>
//         </Box>
//         <Box sx={{ textAlign: 'right' }}>
//           <Typography variant="h6" sx={{ fontWeight: 'bold' }}>PHADKE BOOK HOUSE, KOLHAPUR.</Typography>
//           <Typography variant="caption" display="block">Phadke Bhavan, Kolhapur. Tel No.</Typography>
//           <Typography variant="body2" sx={{ mt: 1, fontWeight: 'bold' }}>01-04-25</Typography>
//         </Box>
//       </Box>

//       {/* ITEMS TABLE */}
//       <TableContainer>
//         <Table size="small" sx={{ "& td, & th": { border: "none", fontSize: "12px", py: 0.5 } }}>
//           <TableHead>
//             <TableRow sx={{ borderBottom: '1px solid black' }}>
//               <TableCell sx={{ fontWeight: 'bold' }}>Sr.</TableCell>
//               <TableCell sx={{ fontWeight: 'bold' }}>Code</TableCell>
//               <TableCell sx={{ fontWeight: 'bold' }}>Class</TableCell>
//               <TableCell sx={{ fontWeight: 'bold' }}>Description</TableCell>
//               <TableCell align="right" sx={{ fontWeight: 'bold' }}>Qty</TableCell>
//               <TableCell align="right" sx={{ fontWeight: 'bold' }}>Rate</TableCell>
//             </TableRow>
//           </TableHead>
//           <TableBody>
//             {items.map((item) => (
//               <TableRow key={item.id}>
//                 <TableCell>{item.id}</TableCell>
//                 <TableCell>{item.code}</TableCell>
//                 <TableCell>{item.class}</TableCell>
//                 <TableCell>{item.desc}</TableCell>
//                 <TableCell align="right">{item.qty}</TableCell>
//                 <TableCell align="right">{item.rate.toFixed(2)}</TableCell>
//               </TableRow>
//             ))}
//           </TableBody>
//         </Table>
//       </TableContainer>
//     </Box>
//   );
// });

// export default SalesChallanPrint;



import React, { useEffect } from "react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

const SalesChallanPrint = React.forwardRef(({ rows = [] }, ref) => {

  useEffect(() => {

    if (!rows || rows.length === 0) return;

    const doc = new jsPDF("p", "mm", "a4");

    /* HEADER LEFT */

    doc.setFont("Times", "bold");
    doc.setFontSize(14);
    doc.text("Phadke Prakashan, Kolhapur.", 14, 15);

    doc.setFont("Times", "normal");
    doc.setFontSize(10);
    doc.text("Phadke Bhavan, Near Hari Mandir, Dudhali", 14, 21);
    doc.text("Kolhapur - 416012", 14, 26);

    /* HEADER RIGHT */

    doc.setFont("Times", "bold");
    doc.setFontSize(14);
    doc.text("PHADKE BOOK HOUSE", 135, 15);

    doc.setFontSize(11);
    doc.text("Sales Challan", 160, 22);

    /* TABLE HEADERS */

    const tableColumn = [
      "Sr",
      "Code",
      "Class",
      "Description",
      "Qty",
      "Rate"
    ];

    /* TABLE DATA */

    const tableRows = rows.map((item) => [
      item.Sr,
      item.BookCode,
      item.Class,
      item.Description,
      item.Qty,
      Number(item.Rate).toFixed(2)
    ]);

    /* AUTOTABLE */

    autoTable(doc, {
      startY: 35,
      head: [tableColumn],
      body: tableRows,
      theme: "grid",

      styles: {
        font: "times",
        fontSize: 10
      },

      headStyles: {
        fillColor: [255, 255, 255],
        textColor: 0,
        lineWidth: 0.2
      },

      columnStyles: {
        4: { halign: "right" },
        5: { halign: "right" }
      }
    });

    /* OPEN PDF */

    window.open(doc.output("bloburl"), "_blank");

  }, [rows]);

  return null;

});

export default SalesChallanPrint;