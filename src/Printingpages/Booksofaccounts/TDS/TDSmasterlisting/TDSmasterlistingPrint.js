// import React from "react";
// import { Box, Typography } from "@mui/material";

// export default function TDSMasterListingPrint({
//   startDate,
//   endDate,
//   rows = []
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

//       <Typography align="center" fontSize={14} mt={1}>
//         TDS Master Listing
//       </Typography>

//       <Typography align="center" fontSize={12} mt={1} mb={2}>
//         Period : {startDate} to {endDate}
//       </Typography>


//       <table width="100%" style={{
//         borderCollapse: "collapse",
//         fontSize: 12
//       }}>

//         <thead>

//           <tr>
//             <th style={th}>Sr</th>
//             <th style={th}>TDS Head</th>
//             <th style={th}>Section</th>
//             <th style={th}>Surcharge %</th>
//             <th style={th}>Net %</th>
//             <th style={th}>Account Head</th>
//           </tr>

//         </thead>

//         <tbody>

//           {rows.map(row => (

//             <tr key={row.sr}>

//               <td style={td}>{row.sr}</td>

//               <td style={td}>{row.head}</td>

//               <td style={td}>{row.section}</td>

//               <td style={td}>{row.sur}</td>

//               <td style={td}>{row.net}</td>

//               <td style={td}>{row.acc}</td>

//             </tr>

//           ))}

//         </tbody>

//       </table>


//       <Typography mt={3} fontSize={11}>
//         Generated on : {new Date().toLocaleString()}
//       </Typography>

//     </Box>

//   );

// }


// const th = {
//   border: "1px solid #000",
//   padding: "6px",
//   fontWeight: "bold"
// };

// const td = {
//   border: "1px solid #000",
//   padding: "6px"
// };



import React from "react";
import { Box, Typography } from "@mui/material";

export default function TDSMasterListingPrint({
  startDate,
  endDate,
  rows = []
}) {

  return (

    <Box
      sx={{
        width: "210mm",
        minHeight: "297mm",
        bgcolor: "#fff",
        px: "18mm",
        py: "14mm",
        fontFamily: '"Times New Roman", serif'
      }}
    >

      {/* HEADER */}

      <Typography align="center" fontSize={18} fontWeight={700}>
        Phadke Prakashan, Kolhapur
      </Typography>

      <Typography align="center" fontSize={14} mt={1}>
        TDS Master Listing
      </Typography>

      <Typography align="center" fontSize={12} mt={1} mb={2}>
        Period : {startDate} to {endDate}
      </Typography>


      {/* TABLE */}

      <table
        width="100%"
        style={{
          borderCollapse: "collapse",
          fontSize: 12
        }}
      >

        <thead>

          <tr>
            <th style={th}>Sr</th>
            <th style={th}>TDS Head</th>
            <th style={th}>Section</th>
            <th style={th}>Surcharge %</th>
            <th style={th}>Net %</th>
            <th style={th}>Account Head</th>
          </tr>

        </thead>

        <tbody>

          {rows.map((row, index) => (

            <tr key={index}>

              <td style={td}>{row["Sr"]}</td>

              <td style={td}>{row["TDS Head"]}</td>

              <td style={td}>{row["Section"]}</td>

              <td style={td}>{row["Surcharge %"]}</td>

              <td style={td}>{row["Net %"]}</td>

              <td style={td}>{row["Account Head"]}</td>

            </tr>

          ))}

        </tbody>

      </table>


      {/* FOOTER */}

      <Typography mt={3} fontSize={11}>
        Generated on : {new Date().toLocaleString()}
      </Typography>

    </Box>

  );

}

const th = {
  border: "1px solid #000",
  padding: "6px",
  fontWeight: "bold",
  textAlign: "left"
};

const td = {
  border: "1px solid #000",
  padding: "6px"
};