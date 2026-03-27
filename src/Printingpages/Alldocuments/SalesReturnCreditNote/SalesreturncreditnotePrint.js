// import React, { forwardRef, useEffect, useState } from "react";
// import { Box, Paper, Typography, CircularProgress } from "@mui/material";

// const SalesReturnCreditNotePrint = forwardRef(({ data }, ref) => {
//   const { startNo, endNo, allRequired } = data || {};
//   const [rows, setRows] = useState([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const loadData = async () => {
//       try {
//         const res = await fetch(`/api/credit-notes?start=${startNo}&end=${endNo}&all=${allRequired}`);
//         const result = await res.json();
//         // Fallback to empty array if no data, or mock data for testing
//         setRows(result || []);
//       } catch (err) {
//         setRows([]);
//       } finally {
//         setLoading(false);
//       }
//     };
//     loadData();
//   }, [startNo, endNo, allRequired]);

//   if (loading) return <Box sx={{ textAlign: 'center', p: 5 }}><CircularProgress /></Box>;

//   return (
//     <Paper
//       ref={ref}
//       elevation={0}
//       sx={{
//         width: "210mm",
//         minHeight: "297mm",
//         mx: "auto",
//         p: "20mm",
//         background: "white",
//         color: "black",
//         position: "relative",
//         fontFamily: "'Courier New', Courier, monospace", // Mimics dot-matrix/accounting print
//       }}
//     >
//       {/* HEADER SECTION - Matching salesreturncreditnoteprint.png */}
//       <Box sx={{ mt: 10, ml: 10 }}>
//         <Typography sx={{ fontSize: "16px", fontWeight: "bold", letterSpacing: "1px" }}>
//           PHADKE BOOK HOUSE, KOLHAPUR.
//         </Typography>
//         <Typography sx={{ fontSize: "13px", mt: 1 }}>
//           Phadke Bhavan, Near Hari Mandir, Dudhali
//         </Typography>
//         <Typography sx={{ fontSize: "14px", fontWeight: "bold", mt: 1 }}>
//           KOLHAPUR
//         </Typography>
//         <Typography sx={{ fontSize: "13px" }}>
//           Dist. - KOLHAPUR
//         </Typography>
//       </Box>

//       {/* BILL METADATA (Top Right Positions) */}
//       <Box sx={{ position: "absolute", top: "115px", right: "120px", textAlign: "right" }}>
//         <Typography sx={{ fontSize: "15px", fontWeight: "bold" }}>00001</Typography>
//       </Box>
      
//       <Box sx={{ position: "absolute", top: "155px", right: "140px", textAlign: "right" }}>
//         <Typography sx={{ fontSize: "14px" }}>18-04-25</Typography>
//       </Box>

//       {/* PARTY NAME (Centered right as per image) */}
//       <Box sx={{ position: "absolute", top: "250px", right: "120px", textAlign: "right" }}>
//         <Typography sx={{ fontSize: "15px", fontWeight: "bold" }}>
//           V.G. Shivdare College
//         </Typography>
//       </Box>

//       {/* ITEMS TABLE - Minimal styling to match the screenshot spacing */}
//       <Box sx={{ mt: 20 ,}}>
//         <table width="100%" style={{ borderCollapse: 'collapse' }}>
//           <tbody>
//             {rows.length > 0 ? rows.map((r, i) => (
//               <ItemRow key={i} index={i+1} r={r} />
//             )) : (
//               // Mock row to match your exact screenshot data for visual confirmation
//               <ItemRow 
//                 index={1} 
//                 r={{
//                   bookCode: "P 6494",
//                   class: "M.COM / B.COM",
//                   bookName: "Income Tax (For A.Y. 2024-2025) (Herekar)",
//                   copies: 5,
//                   price: "350.00",
//                   total: "1,750.00",
//                   disc: "30",
//                   amount: "1,225.00"
//                 }} 
//               />
//             )}
//           </tbody>
//         </table>
//       </Box>
//     </Paper>
//   );
// });

// // Helper component for the row to maintain that specific "wide" layout
// const ItemRow = ({ index, r }) => (
//   <tr style={{ fontSize: '13px', verticalAlign: 'top' }}>
//     <td style={{ width: '40px', paddingBottom: '10px' }}>{index}</td>
//     <td style={{ width: '80px' }}>{r.bookCode}</td>
//     <td style={{ width: '100px' }}>
//       <div style={{ lineHeight: '1.2' }}>{r.class.split(' / ').map(c => <div key={c}>{c}</div>)}</div>
//     </td>
//     <td style={{ width: '280px', paddingLeft: '10px' }}>{r.bookName}</td>
//     <td style={{ width: '40px', textAlign: 'center' }}>{r.copies}</td>
//     <td style={{ width: '80px', textAlign: 'right' }}>{r.price}</td>
//     <td style={{ width: '90px', textAlign: 'right' }}>{r.total}</td>
//     <td style={{ width: '40px', textAlign: 'right' }}>{r.disc}</td>
//     <td style={{ width: '100px', textAlign: 'right' }}>{r.amount}</td>
//   </tr>
// );

// export default SalesReturnCreditNotePrint;




import React, { forwardRef } from "react";
import { Box, Paper, Typography } from "@mui/material";

const SalesReturnCreditNotePrint = forwardRef(({ rows = [] }, ref) => {

const party = rows[0]?.PartyDetails || "";
const invoiceNo = rows[0]?.InvoiceNo || "";
const date = new Date().toLocaleDateString("en-GB");

return(

<Paper
ref={ref}
elevation={0}
sx={{
width:"210mm",
minHeight:"297mm",
mx:"auto",
p:"20mm",
background:"white",
color:"#000",
// fontFamily:"Courier New, monospace"
}}
>

{/* HEADER */}

<Box mt={8} ml={8}>

<Typography
sx={{
fontSize:"17px",
fontWeight:800,
letterSpacing:"0.5px",
color:"#000"
}}
>
PHADKE BOOK HOUSE, KOLHAPUR.
</Typography>

<Typography
sx={{
fontSize:"15px",
fontWeight:600,
color:"#000"
}}
>
Phadke Bhavan, Near Hari Mandir, Dudhali
</Typography>

<Typography
sx={{
fontSize:"15px",
fontWeight:700,
color:"#000"
}}
>
KOLHAPUR
</Typography>

<Typography
sx={{
fontSize:"15px",
fontWeight:600,
color:"#000"
}}
>
Dist. - KOLHAPUR
</Typography>

</Box>


{/* INVOICE */}

<Box position="absolute" top="110px" right="120px">

<Typography
sx={{
fontSize:"16px",
fontWeight:800,
color:"#000"
}}
>
{invoiceNo}
</Typography>

</Box>


{/* DATE */}

<Box position="absolute" top="150px" right="120px">

<Typography
sx={{
fontSize:"15px",
fontWeight:600,
color:"#000"
}}
>
{date}
</Typography>

</Box>


{/* PARTY */}

<Box position="absolute" top="250px" right="120px">

<Typography
sx={{
fontSize:"16px",
fontWeight:800,
color:"#000"
}}
>
{party}
</Typography>

</Box>


{/* TABLE */}

<Box mt={18}>

<table
width="100%"
style={{
borderCollapse:"collapse",
fontSize:"15px",
fontWeight:600,
color:"#000"
}}
>

<tbody>

{rows.map((r,i)=>(

<tr key={i}>

<td style={{width:"40px",paddingBottom:"8px"}}>
{r["SR.No."]}
</td>

<td style={{width:"80px"}}>
{r.BookCode}
</td>

<td style={{width:"320px"}}>
{r.Particulars}
</td>

<td style={{width:"80px",textAlign:"right"}}>
{r.Rate}
</td>

<td style={{width:"90px",textAlign:"right"}}>
{r.Amount}
</td>

<td style={{width:"60px",textAlign:"right"}}>
{r.DiscCode}
</td>

<td style={{
width:"100px",
textAlign:"right",
fontWeight:700
}}>
{r.NetAmount}
</td>

</tr>

))}

</tbody>

</table>

</Box>

</Paper>

)

});

export default SalesReturnCreditNotePrint;