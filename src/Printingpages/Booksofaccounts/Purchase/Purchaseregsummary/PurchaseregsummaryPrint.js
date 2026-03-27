// import React from "react";
// import { Box, Typography, Divider } from "@mui/material";

// export default function PurchaseRegisterSummaryPrint({
//   startDate,
//   endDate
// }) {

//   return (

//     <Box sx={{
//       width: "210mm",
//       minHeight: "297mm",
//       bgcolor: "#fff",
//       px: "18mm",
//       py: "14mm",
//       fontFamily: '"Times New Roman", serif'
//     }}>


//       <Typography align="center" fontSize={18} fontWeight={700}>
//         Phadke Prakashan, Kolhapur
//       </Typography>


//       <Typography align="center" fontSize={14} mt={0.5}>
//         Purchase Register Summary
//       </Typography>


//       <Typography align="center" fontSize={12} mt={0.5}>
//         From {startDate} to {endDate}
//       </Typography>


//       <Divider sx={{ my: 2, borderColor: "#000" }}/>


//       <table width="100%" style={{
//         borderCollapse: "collapse",
//         fontSize: 12
//       }}>

//         <thead>

//           <tr style={{ borderBottom: "1px solid #000" }}>

//             <th align="left">Type Of Purchase</th>
//             <th align="right">Basic</th>
//             <th align="right">Sales Tax</th>
//             <th align="right">Other Service Tax</th>
//             <th align="right">Cess</th>
//             <th align="right">Total</th>

//           </tr>

//         </thead>


//         <tbody>

//           <tr>
//             <td colSpan={6}
//               style={{
//                 paddingTop: 30,
//                 textAlign: "center",
//                 color: "#777"
//               }}>
//               Backend summary rows will render here
//             </td>
//           </tr>


//           <tr>
//             <td colSpan={6}>
//               <Divider sx={{ mt: 3, borderColor: "#000" }}/>
//             </td>
//           </tr>


//           <tr>

//             <td style={{ fontWeight: 700 }}>
//               Grand Total
//             </td>

//             <td align="right">—</td>
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

export default function PurchaseRegisterSummaryPrint({
  startDate,
  endDate,
  rows = []
}) {

  const toNumber = (val) =>
    Number(String(val).replace(/,/g,"")) || 0;

  const grandTotal = rows.reduce(
    (sum,row)=> sum + toNumber(row["Grand Total"]),
    0
  );


  return (

    <Box sx={{
      width: "210mm",
      minHeight: "297mm",
      bgcolor: "#fff",
      px: "18mm",
      py: "14mm",
      fontFamily: '"Times New Roman", serif'
    }}>


      <Typography align="center" fontSize={18} fontWeight={700}>
        Phadke Prakashan, Kolhapur
      </Typography>


      <Typography align="center" fontSize={14} mt={0.5}>
        Purchase Register Summary
      </Typography>


      <Typography align="center" fontSize={12} mt={0.5}>
        From {startDate} to {endDate}
      </Typography>


      <Divider sx={{ my: 2, borderColor: "#000" }}/>


      <table width="100%" style={{
        borderCollapse: "collapse",
        fontSize: 12
      }}>

        <thead>

          <tr style={{ borderBottom: "1px solid #000" }}>

            <th align="left">Type Of Purchase</th>
            <th align="right">Basic</th>
            <th align="right">Sales Tax</th>
            <th align="right">Other Service Tax</th>
            <th align="right">Cess</th>
            <th align="right">Total</th>

          </tr>

        </thead>


        <tbody>

          {rows.map((row,index)=>(
            <tr key={index}>

              <td>{row["Type Of Purchase"]}</td>

              <td align="right">{row.Basic}</td>

              <td align="right">{row["Sales Tax"]}</td>

              <td align="right">{row["Other Service Tax"]}</td>

              <td align="right">{row.Cess}</td>

              <td align="right">{row.Total}</td>

            </tr>
          ))}


          <tr>
            <td colSpan={6}>
              <Divider sx={{ mt: 2, borderColor: "#000" }}/>
            </td>
          </tr>


          <tr>

            <td style={{ fontWeight: 700 }}>
              Grand Total
            </td>

            <td></td>
            <td></td>
            <td></td>
            <td></td>

            <td align="right" style={{ fontWeight: 700 }}>
              {grandTotal.toLocaleString()}
            </td>

          </tr>

        </tbody>

      </table>

    </Box>
  );
}


