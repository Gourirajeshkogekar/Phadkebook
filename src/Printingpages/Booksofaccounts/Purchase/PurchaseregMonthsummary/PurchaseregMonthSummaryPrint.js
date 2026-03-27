// import React from "react";
// import {
//   Box,
//   Typography,
//   Divider
// } from "@mui/material";

// export default function PurchaseRegisterMonthlySummaryPrint({
//   startDate,
//   endDate
// }) {

//   return (

//     <Box
//       sx={{
//         width: "210mm",
//         minHeight: "297mm",
//         bgcolor: "#fff",
//         px: "18mm",
//         py: "14mm",
//         fontFamily: '"Times New Roman", serif'
//       }}
//     >


//       <Typography align="center" fontSize={18} fontWeight={700}>
//         Phadke Prakashan, Kolhapur
//       </Typography>


//       <Typography align="center" fontSize={14} mt={0.5}>
//         Purchase Register Monthly Summary
//       </Typography>


//       <Typography align="center" fontSize={12} mt={0.5}>
//         From {startDate} to {endDate}
//       </Typography>


//       <Divider sx={{ my: 2, borderColor: "#000" }}/>


//       <table
//         width="100%"
//         style={{
//           borderCollapse: "collapse",
//           fontSize: 12
//         }}
//       >

//         <thead>

//           <tr style={{ borderBottom: "1px solid #000" }}>
//             <th align="left">Type Of Purchase</th>
//             <th align="right">Basic</th>
//             <th align="right">Sales Tax</th>
//             <th align="right">Other</th>
//             <th align="right">Total</th>
//           </tr>

//         </thead>


//         <tbody>

//           <tr>
//             <td colSpan={5}
//               style={{
//                 paddingTop: 10,
//                 fontWeight: 700,
//                 textAlign: "center"
//               }}>
//               Apr-25
//             </td>
//           </tr>


//           <tr>
//             <td>GST 12%</td>
//             <td align="right">—</td>
//             <td align="right">—</td>
//             <td align="right">—</td>
//             <td align="right">—</td>
//           </tr>


//           <tr>
//             <td>GST 18%</td>
//             <td align="right">—</td>
//             <td align="right">—</td>
//             <td align="right">—</td>
//             <td align="right">—</td>
//           </tr>


//           <tr style={{
//             borderTop: "1px solid #000",
//             borderBottom: "1px solid #000"
//           }}>
//             <td style={{ fontWeight: 700 }}>
//               Total - Apr-25
//             </td>

//             <td align="right">—</td>
//             <td align="right">—</td>
//             <td align="right">—</td>
//             <td align="right">—</td>
//           </tr>


//         </tbody>

//       </table>


//     </Box>

//   );
// }


import React from "react";
import { Box, Typography, Divider } from "@mui/material";

export default function PurchaseRegisterMonthlySummaryPrint({
  startDate,
  endDate,
  rows=[]
}){

const toNumber=(v)=>Number(String(v||"").replace(/,/g,""))||0;

/* GROUP DATA BY MONTH */

const grouped={};

rows.forEach(row=>{
 if(!grouped[row.MonthYear]){
   grouped[row.MonthYear]=[];
 }
 grouped[row.MonthYear].push(row);
});

const grandTotal=rows.reduce(
 (sum,r)=>sum+toNumber(r.Total),0
);

return(

<Box sx={{
 width:"210mm",
 minHeight:"297mm",
 bgcolor:"#fff",
 px:"18mm",
 py:"14mm",
 fontFamily:'"Times New Roman", serif'
}}>

<Typography align="center" fontSize={18} fontWeight={700}>
Phadke Prakashan, Kolhapur
</Typography>

<Typography align="center" fontSize={14} mt={0.5}>
Purchase Register Monthly Summary
</Typography>

<Typography align="center" fontSize={12} mt={0.5}>
From {startDate} to {endDate}
</Typography>

<Divider sx={{my:2,borderColor:"#000"}}/>

<table width="100%" style={{borderCollapse:"collapse",fontSize:12}}>

<thead>

<tr style={{borderBottom:"1px solid #000"}}>
<th align="left">Type Of Purchase</th>
<th align="right">Basic</th>
<th align="right">Sales Tax</th>
<th align="right">Other</th>
<th align="right">Total</th>
</tr>

</thead>

<tbody>

{Object.keys(grouped).map((month,index)=>{

const monthRows=grouped[month];

const monthTotal=monthRows.reduce(
(sum,r)=>sum+toNumber(r.Total),0
);

return(

<React.Fragment key={index}>

<tr>
<td colSpan={5}
style={{
textAlign:"center",
fontWeight:700,
paddingTop:10
}}>
{month}
</td>
</tr>

{monthRows.map((row,i)=>(
<tr key={i}>

<td>{row["Type Of Purchase"]}</td>
<td align="right">{row.Basic}</td>
<td align="right">{row["Sales Tax"]}</td>
<td align="right">{row.Other}</td>
<td align="right">{row.Total}</td>

</tr>
))}

<tr style={{
borderTop:"1px solid #000",
borderBottom:"1px solid #000"
}}>

<td style={{fontWeight:700}}>
Total - {month}
</td>

<td></td>
<td></td>
<td></td>

<td align="right" style={{fontWeight:700}}>
{monthTotal.toLocaleString()}
</td>

</tr>

</React.Fragment>

);

})}

<tr>
<td colSpan={5}>
<Divider sx={{mt:2,borderColor:"#000"}}/>
</td>
</tr>

<tr>

<td style={{fontWeight:700}}>
Grand Total
</td>

<td></td>
<td></td>
<td></td>

<td align="right" style={{fontWeight:700}}>
{grandTotal.toLocaleString()}
</td>

</tr>

</tbody>

</table>

</Box>

);
}