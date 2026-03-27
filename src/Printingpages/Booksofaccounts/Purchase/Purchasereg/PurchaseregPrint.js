// import React from "react";
// import { Box, Typography, Button } from "@mui/material";
// import PrintIcon from "@mui/icons-material/Print";

// function PurchaseregPrint({ state }) {
  
//   const { 
//     startDate = "01-04-25", 
//     endDate = "31-03-26", 
//     partyName = "ADHIKARI SWATI UMESH", 
//     rows = [] 
//   } = state || {};

//    const calculateTotal = (key) => rows.reduce((sum, r) => sum + (Number(r[key]) || 0), 0);

//   return (
//     <Box sx={{ bgcolor: "#525659", minHeight: "100vh",   display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      
//        <Box
//         id="print-area"
//         sx={{
//           width: "297mm",  
//           minHeight: "210mm",
//           bgcolor: "#fff",
          
//           fontFamily: '"Times New Roman", Times, serif',
//           color: "#000",
//         }}
//       >
//          <Typography align="center" sx={{ fontSize: "16px", fontWeight: "bold", mb: 0 }}>
//           Phadke Prakashan, Kolhapur.
//         </Typography>

//         <Typography align="center" sx={{ fontSize: "13px", fontWeight: "bold", mb: 0 }}>
//           Purchase Register ()
//         </Typography>

//         <Typography align="center" sx={{ fontSize: "11px", mb: 2 }}>
//           Selected Party - {partyName} From {startDate} to {endDate}(BOOK PRINTING CHARGES)
//           <span style={{ float: 'right' }}>Page 1 of 1</span>
//         </Typography>

//          <table
//           width="100%"
//           style={{
//             borderCollapse: "collapse",
//             fontSize: "10px", 
//           }}
//         >
//           <thead>
//             <tr style={{ borderTop: "1px solid #000", borderBottom: "1px solid #000" }}>
//               <th align="left" style={{ padding: "4px 2px" }}>Date</th>
//               <th align="left" style={{ padding: "4px 2px" }}>PV No.</th>
//               <th align="left" style={{ padding: "4px 2px" }}>Supplier Name</th>
//               <th align="left" style={{ padding: "4px 2px" }}>GSTIN</th>
//               <th align="left" style={{ padding: "4px 2px" }}>Bill No.</th>
//               <th align="left" style={{ padding: "4px 2px" }}>Bill Date</th>
//               <th align="right" style={{ padding: "4px 2px" }}>Bill Amt.</th>
//               <th align="left" style={{ padding: "4px 2px" }}>Purchase Type</th>
//               <th align="right" style={{ padding: "4px 2px" }}>Taxable</th>
//               <th align="right" style={{ padding: "4px 2px" }}>IGST/VAT</th>
//               <th align="right" style={{ padding: "4px 2px" }}>CGST</th>
//               <th align="right" style={{ padding: "4px 2px" }}>SGST</th>
//               <th align="left" style={{ padding: "4px 2px" }}>Account Head</th>
//               <th align="right" style={{ padding: "4px 2px" }}>Amount</th>
//             </tr>
//           </thead>

//           <tbody>
//             {rows.length === 0 ? (
//               <tr>
//                 <td colSpan={14} style={{ padding: 40, textAlign: "center", fontStyle: "italic", borderBottom: "1px solid #000" }}>
//                   No Data Available
//                 </td>
//               </tr>
//             ) : (
//               rows.map((r, i) => (
//                 <tr key={i}>
//                   <td style={{ padding: "2px" }}>{r.date}</td>
//                   <td style={{ padding: "2px" }}>{r.pvNo}</td>
//                   <td style={{ padding: "2px" }}>{r.supplierName}</td>
//                   <td style={{ padding: "2px" }}>{r.gstin}</td>
//                   <td style={{ padding: "2px" }}>{r.billNo}</td>
//                   <td style={{ padding: "2px" }}>{r.billDate}</td>
//                   <td align="right" style={{ padding: "2px" }}>{Number(r.billAmt).toFixed(2)}</td>
//                   <td style={{ padding: "2px" }}>{r.purchaseType}</td>
//                   <td align="right" style={{ padding: "2px" }}>{Number(r.taxable).toFixed(2)}</td>
//                   <td align="right" style={{ padding: "2px" }}>{Number(r.igst).toFixed(2)}</td>
//                   <td align="right" style={{ padding: "2px" }}>{Number(r.cgst).toFixed(2)}</td>
//                   <td align="right" style={{ padding: "2px" }}>{Number(r.sgst).toFixed(2)}</td>
//                   <td style={{ padding: "2px" }}>{r.accountHead}</td>
//                   <td align="right" style={{ padding: "2px" }}>{Number(r.amount).toFixed(2)}</td>
//                 </tr>
//               ))
//             )}
//           </tbody>

//           <tfoot>
//             <tr style={{ borderTop: "1px solid #000", borderBottom: "1px solid #000" }}>
//               <td colSpan={6} align="center" style={{ padding: "4px", fontWeight: "bold" }}>Total</td>
//               <td align="right" style={{ fontWeight: "bold" }}>{calculateTotal("billAmt").toFixed(2)}</td>
//               <td></td>
//               <td align="right" style={{ fontWeight: "bold" }}>{calculateTotal("taxable").toFixed(2)}</td>
//               <td align="right" style={{ fontWeight: "bold" }}>{calculateTotal("igst").toFixed(2)}</td>
//               <td align="right" style={{ fontWeight: "bold" }}>{calculateTotal("cgst").toFixed(2)}</td>
//               <td align="right" style={{ fontWeight: "bold" }}>{calculateTotal("sgst").toFixed(2)}</td>
//               <td></td>
//               <td align="right" style={{ fontWeight: "bold" }}>{calculateTotal("amount").toFixed(2)}</td>
//             </tr>
//           </tfoot>
//         </table>
//       </Box>

      

//       <style>{`
//         @media print {
//           @page { 
//             size: A4 landscape; 
//             margin: 5mm; 
//           }
//           body { background: none !important; }
//           .no-print { display: none !important; }
//           #print-area {
//             box-shadow: none !important;
//             width: 100% !important;
//             margin: 0 !important;
//             padding: 0 !important;
//           }
//         }
//       `}</style>
//     </Box>
//   );
// }

// export default PurchaseregPrint;




import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

function PurchaseregPrint({ state }) {

  const {
    startDate = "",
    endDate = "",
    partyName = "",
    rows: rawRows = []
  } = state || {};

  const rows = Array.isArray(rawRows) ? rawRows : [];

  /* ---------- Convert numbers ---------- */

  const toNumber = (val) => {
    if (!val) return 0;
    return Number(String(val).replace(/,/g, ""));
  };

  /* ---------- Totals ---------- */

  const totalBill = rows.reduce((s, r) => s + toNumber(r.Bill_Amt), 0);
  const totalTaxable = rows.reduce((s, r) => s + toNumber(r.Taxable_IGST_VAT), 0);
  const totalCGST = rows.reduce((s, r) => s + toNumber(r.CGST), 0);
  const totalSGST = rows.reduce((s, r) => s + toNumber(r.SGST), 0);
  const totalAmount = rows.reduce((s, r) => s + toNumber(r.Amount), 0);

  /* ---------- Table Data ---------- */

  const body = rows.map((r) => [
    r.Date || "",
    r.PV_No || "",
    r.Supplier_Name || "",
    r.GSTIN || "",
    r.Bill_No || "",
    r.Bill_Date || "",
    r.Bill_Amt || "0.00",
    r.Purchase_Type || "",
    r.Taxable_IGST_VAT || "0.00",
    "",
    r.CGST || "0.00",
    r.SGST || "0.00",
    r.Account_Head || "",
    r.Amount || "0.00"
  ]);

  /* ---------- Total Row ---------- */

  body.push([
    "",
    "",
    "Total",
    "",
    "",
    "",
    totalBill.toFixed(2),
    "",
    totalTaxable.toFixed(2),
    "",
    totalCGST.toFixed(2),
    totalSGST.toFixed(2),
    "",
    totalAmount.toFixed(2)
  ]);

  /* ---------- Create PDF ---------- */

  const pdf = new jsPDF("l", "mm", "a4");

  const pageWidth = pdf.internal.pageSize.getWidth();

  autoTable(pdf, {

    startY: 35,

    head: [[
      "Date",
      "PV No",
      "Supplier Name",
      "GSTIN",
      "Bill No",
      "Bill Date",
      "Bill Amt",
      "Purchase Type",
      "Taxable",
      "IGST/VAT",
      "CGST",
      "SGST",
      "Account Head",
      "Amount"
    ]],

    body,

    styles: {
      fontSize: 8,
      font: "times"
    },

    columnStyles: {
      6: { halign: "right" },
      8: { halign: "right" },
      10: { halign: "right" },
      11: { halign: "right" },
      13: { halign: "right" }
    },

    didDrawPage: function () {

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
        "Purchase Register",
        pageWidth / 2,
        17,
        { align: "center" }
      );

      pdf.setFontSize(10);

      pdf.text(
        `Selected Party - ${partyName || "All Parties"}  From ${startDate} to ${endDate}`,
        pageWidth / 2,
        23,
        { align: "center" }
      );

    }

  });

  /* ---------- Open PDF ---------- */

  window.open(pdf.output("bloburl"), "_blank");

  return null;
}

export default PurchaseregPrint; 