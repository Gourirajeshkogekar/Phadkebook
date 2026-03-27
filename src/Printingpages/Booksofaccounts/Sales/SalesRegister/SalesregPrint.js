// import React from "react";
// import { Box, Typography, Divider, Button } from "@mui/material";
// import PrintIcon from "@mui/icons-material/Print";
// import { useLocation } from "react-router-dom";

// function SalesRegisterPrint() {
//   const { state } = useLocation() || {};
//   const { startDate, endDate } = state || {};

//   return (
//     <Box
//       sx={{
//         bgcolor: "#e9edf3",
//         minHeight: "100vh",
//         py: 4,
//         fontFamily: '"Times New Roman", Georgia, serif'
//       }}
//     >
//       {/* ================= PRINT SHEET ================= */}
//       <Box
//         id="print-area"
//         sx={{
//           width: "210mm",              // ✅ A4 width
//           minHeight: "297mm",
//           mx: "auto",
//           bgcolor: "#fff",
//           px: "18mm",
//           py: "16mm",
//           boxShadow: "0 0 25px rgba(0,0,0,0.15)",
//           overflow: "hidden"           // ✅ no scroll
//         }}
//       >

//         {/* ================= HEADER ================= */}
//         <Typography
//           align="center"
//           sx={{ fontSize: 20, fontWeight: 700 }}
//         >
//           Phadke Prakashan, Kolhapur
//         </Typography>

//         <Typography
//           align="center"
//           sx={{
//             fontSize: 15,
//             fontWeight: 700,
//             letterSpacing: 3,
//             mt: 1
//           }}
//         >
//           SALES REGISTER
//         </Typography>

//         <Typography
//           align="center"
//           sx={{ fontSize: 13, mt: 1 }}
//         >
//           From {startDate} to {endDate}
//         </Typography>

//         <Divider sx={{ my: 2, borderColor: "#000" }} />

//         {/* ================= TABLE HEADER ================= */}

//         {/* HEADER ROW 1 */}
//         <Box
//           sx={{
//             display: "grid",
//             gridTemplateColumns:
//               "50px 2.4fr 60px 80px 80px 110px 110px 140px",
//             fontSize: 12,
//             fontWeight: 700,
//             alignItems: "center"
//           }}
//         >
//           <Box>Sr No</Box>
//           <Box>Party Name & Place</Box>
//           <Box>P.S</Box>
//           <Box>Bill No</Box>
//           <Box>No Books</Box>

//           {/* Group Header */}
//           <Box
//             sx={{
//               gridColumn: "6 / span 2",
//               textAlign: "center",
//               borderBottom: "1px solid #000"
//             }}
//           >
//             Invoice Amount
//           </Box>

//           <Box>Dispatch Mode</Box>
//         </Box>

//         {/* HEADER ROW 2 */}
//         <Box
//           sx={{
//             display: "grid",
//             gridTemplateColumns:
//               "50px 2.4fr 60px 80px 80px 110px 110px 140px",
//             fontSize: 11,
//             fontWeight: 700,
//             mt: 0.5
//           }}
//         >
//           <Box />
//           <Box />
//           <Box />
//           <Box />
//           <Box />
//           <Box textAlign="right">Cash</Box>
//           <Box textAlign="right">Credit</Box>
//           <Box />
//         </Box>

//         <Divider sx={{ my: 1.5, borderColor: "#000" }} />

//         {/* ================= DATA AREA ================= */}
//         <Typography
//           align="center"
//           sx={{ mt: 8, fontSize: 13, color: "#666" }}
//         >
//           Backend rows will render here
//         </Typography>

//       </Box>

      

//        <style>{`
//         @page {
//           size: A4;
//           margin: 10mm;
//         }

//         @media print {
//           body {
//             background: white;
//           }

//           body * {
//             visibility: hidden;
//           }

//           #print-area, #print-area * {
//             visibility: visible;
//           }

//           #print-area {
//             position: absolute;
//             left: 0;
//             top: 0;
//             width: 210mm;
//             box-shadow: none;
//           }
//         }
//       `}</style>
//     </Box>
//   );
// }

// export default SalesRegisterPrint;






import React from "react";
import { Box, Typography, Divider } from "@mui/material";

function SalesRegisterPrint({ data = [], startDate, endDate }) {

  const rows = Array.isArray(data) ? data : [];

  const format = (val) =>
    val
      ? Number(val).toLocaleString("en-IN", {
          minimumFractionDigits: 2
        })
      : "";

  return (
    <Box sx={{ bgcolor:"#fff", width:"210mm", minHeight:"297mm", p:"18mm" }}>

      <Typography align="center" fontWeight={700} fontSize={20}>
        Phadke Prakashan, Kolhapur
      </Typography>

      <Typography align="center" fontWeight={700} fontSize={15} mt={1}>
        SALES REGISTER
      </Typography>

      <Typography align="center" fontSize={13} mt={1}>
        From {startDate} to {endDate}
      </Typography>

      <Divider sx={{ my:2 }}/>

      {/* HEADER */}

      <Box sx={{
        display:"grid",
        gridTemplateColumns:"50px 2fr 60px 80px 80px 100px 100px 120px",
        fontWeight:700,
        fontSize:12
      }}>
        <Box>Sr</Box>
        <Box>Party Name</Box>
        <Box>P.S</Box>
        <Box>Bill</Box>
        <Box>Books</Box>
        <Box textAlign="right">Cash</Box>
        <Box textAlign="right">Credit</Box>
        <Box>Dispatch</Box>
      </Box>

      <Divider sx={{my:1}}/>

      {/* ROWS */}

      {rows.map((row,i)=>{

        const cash = row["Cash Credit"]==="Cash" ? format(row["Invoice Amount"]) : "";
        const credit = row["Cash Credit"]==="Credit" ? format(row["Invoice Amount"]) : "";

        return(
          <Box key={i} sx={{
            display:"grid",
            gridTemplateColumns:"50px 2fr 60px 80px 80px 100px 100px 120px",
            fontSize:12,
            py:0.5
          }}>
            <Box>{row["Sr No"]}</Box>
            <Box>{row["Party Name & Place"]}</Box>
            <Box>{row["P.S"]}</Box>
            <Box>{row["Bill No"]}</Box>
            <Box>{row["No Books"]}</Box>
            <Box textAlign="right">{cash}</Box>
            <Box textAlign="right">{credit}</Box>
            <Box>{row["Dispatch Mode"]}</Box>
          </Box>
        );

      })}

    </Box>
  );
}

export default SalesRegisterPrint;