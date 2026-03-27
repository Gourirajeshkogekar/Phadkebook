// import React from "react";
// import { useLocation } from "react-router-dom";
// import { Box, Typography, Button, Container } from "@mui/material";
// import PrintIcon from "@mui/icons-material/Print";

// function ChallanRegisterPrint() {
//   const { state } = useLocation();
//   const { startDate, endDate, showBooks, party } = state || {};

//   return (
//     <Box sx={{ background: "#525659", minHeight: "100vh", p: 2, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      
//       {/* Container for the Paper look */}
//       <Box
//         id="print-area"
//         sx={{
//           width: "210mm", // A4 Width
//           minHeight: "297mm", // A4 Height
//           bgcolor: "#fff",
//           p: "10mm 15mm",
//           boxShadow: "0 0 10px rgba(0,0,0,0.5)",
//           fontFamily: "'Times New Roman', Times, serif", // Professional Print Font
//         }}
//       >
//         {/* HEADER SECTION */}
//         <Box textAlign="center" mb={1}>
//           <Typography variant="h6" sx={{ fontWeight: 700, fontSize: "18px", textDecoration: 'none' }}>
//             Phadke Prakashan, Kolhapur.
//           </Typography>
//           <Typography sx={{ fontWeight: 600, fontSize: "14px", mt: 0.5 }}>
//             Challan Register
//           </Typography>
//           <Typography sx={{ fontSize: "12px" }}>
//             From {startDate || "01-04-25"} to {endDate || "31-03-26"}
//           </Typography>
//         </Box>

//         {/* DATA TABLE */}
//         <table width="100%" style={{ borderCollapse: "collapse", marginTop: "10px" }}>
//           <thead>
//             <tr style={{ borderTop: "1.5px solid #000", borderBottom: "1px solid #000" }}>
//               <th align="left" style={thStyle}>Date</th>
//               <th align="left" style={thStyle}>Chln. No</th>
//               <th align="left" style={thStyle}>Name of Party</th>
//               <th align="right" style={thStyle}>No. of Books</th>
//               <th align="left" style={thStyle}>Inv. No. & Dt.</th>
//               <th align="left" style={thStyle}>Parcel</th>
//               <th align="center" style={thStyle}>Bundles</th>
//             </tr>
//           </thead>
          
//           <tbody style={{ fontSize: "12px" }}>
//             {/* Example Empty Row to show structure */}
//             <tr>
//               <td colSpan="7" style={{ padding: "100px 0", textAlign: "center", fontStyle: "italic", color: "#888" }}>
//                 No Records Found for the Selected Period
//               </td>
//             </tr>

//             {/* DAY TOTAL SECTION */}
//             <tr style={{ borderTop: "1px solid #000" }}>
//               <td colSpan="3" align="right" style={{ padding: "8px 5px", fontWeight: "bold" }}>
//                 Day Total
//               </td>
//               <td align="right" style={{ padding: "8px 5px" }}></td>
//               <td colSpan="3"></td>
//             </tr>

//             {/* GRAND TOTAL SECTION (Optional if needed) */}
//             <tr style={{ borderTop: "1.5px solid #000", borderBottom: "1.5px solid #000" }}>
//               <td colSpan="3" align="right" style={{ padding: "8px 5px", fontWeight: "bold" }}>
//                 Grand Total
//               </td>
//               <td align="right" style={{ padding: "8px 5px" }}></td>
//               <td colSpan="3"></td>
//             </tr>
//           </tbody>
//         </table>
//       </Box>

     

//       {/* PRINT CSS STYLES */}
//       <style>{`
//         @media print {
//           @page { size: A4; margin: 0; }
//           body { background: none; margin: 0; padding: 0; }
//           #print-area { 
//             box-shadow: none; 
//             width: 100%; 
//             margin: 0;
//             padding: 15mm !important; 
//           }
//           button, .MuiButton-root { display: none !important; }
//         }
//       `}</style>
//     </Box>
//   );
// }

// // Helper Style for Table Headers
// const thStyle = {
//   padding: "8px 2px",
//   fontSize: "13px",
//   fontWeight: "bold",
// };

// export default ChallanRegisterPrint;



import React from "react";
import { Box, Typography } from "@mui/material";

function ChallanRegisterPrint({ data = [], startDate, endDate, showBooks }) {

  const rows = Array.isArray(data) ? data : [];

  const dayTotal = rows.length > 0 ? rows[0]["Day Total"] : "";
  const grandTotal = rows.length > 0 ? rows[0]["Grand Total"] : "";

  return (
    <Box
      sx={{
        width: "210mm",
        minHeight: "297mm",
        bgcolor: "#fff",
        p: "10mm 15mm",
        fontFamily: "Times New Roman",
      }}
    >

      {/* HEADER */}
      <Box textAlign="center" mb={2}>
        <Typography fontWeight="bold" fontSize="18px">
          Phadke Prakashan, Kolhapur.
        </Typography>

        <Typography fontWeight="bold" fontSize="14px">
          Challan Register
        </Typography>

        <Typography fontSize="12px">
          From {startDate} to {endDate}
        </Typography>
      </Box>

      {/* TABLE */}
      <table
        width="100%"
        style={{
          borderCollapse: "collapse",
          fontSize: "12px",
        }}
      >
        <thead>
          <tr
            style={{
              borderTop: "1.5px solid black",
              borderBottom: "1px solid black",
            }}
          >
            <th style={thStyle}>Date</th>
            <th style={thStyle}>Chln No</th>
            <th style={thStyle}>Name of Party</th>

            {showBooks === "Yes" && (
              <th style={thStyle}>Book Name</th>
            )}

            <th style={{ ...thStyle, textAlign: "right" }}>No. of Books</th>
            <th style={thStyle}>Inv No & Dt</th>
            <th style={thStyle}>Parcel</th>
            <th style={{ ...thStyle, textAlign: "center" }}>Bundles</th>
          </tr>
        </thead>

        <tbody>

          {rows.length > 0 ? (

            rows.map((row, index) => (

              <tr key={index} style={{ borderBottom: "1px solid #ddd" }}>

                <td style={tdStyle}>{row["Date"]}</td>

                <td style={tdStyle}>
                  {row["Chln. No"]}
                </td>

                <td style={tdStyle}>
                  {row["Name of Party"]}
                </td>

                {showBooks === "Yes" && (
                  <td style={tdStyle}>
                    {row["BookName"]}
                  </td>
                )}

                <td style={{ ...tdStyle, textAlign: "right" }}>
                  {row["No. of Books"]}
                </td>

                <td style={tdStyle}>
                  {row["Inv. No. & Dt."]}
                </td>

                <td style={tdStyle}>
                  {row["Parcel"]}
                </td>

                <td style={{ ...tdStyle, textAlign: "center" }}>
                  {row["Bundles"]}
                </td>

              </tr>

            ))

          ) : (

            <tr>
              <td colSpan="8" style={{ textAlign: "center", padding: "80px 0" }}>
                No Records Found
              </td>
            </tr>

          )}

          {/* DAY TOTAL */}
          {rows.length > 0 && (
            <tr style={{ borderTop: "1px solid black" }}>
              <td colSpan={showBooks === "Yes" ? 4 : 3}
                style={{ textAlign: "right", padding: "8px 4px", fontWeight: "bold" }}>
                Day Total
              </td>

              <td style={{ textAlign: "right", padding: "8px 4px", fontWeight: "bold" }}>
                {dayTotal}
              </td>

              <td colSpan="3"></td>
            </tr>
          )}

          {/* GRAND TOTAL */}
          {rows.length > 0 && (
            <tr style={{ borderTop: "1.5px solid black", borderBottom: "1.5px solid black" }}>
              <td colSpan={showBooks === "Yes" ? 4 : 3}
                style={{ textAlign: "right", padding: "8px 4px", fontWeight: "bold" }}>
                Grand Total
              </td>

              <td style={{ textAlign: "right", padding: "8px 4px", fontWeight: "bold" }}>
                {grandTotal}
              </td>

              <td colSpan="3"></td>
            </tr>
          )}

        </tbody>
      </table>

    </Box>
  );
}

const thStyle = {
  padding: "6px 4px",
  textAlign: "left",
  fontWeight: "bold",
};

const tdStyle = {
  padding: "6px 4px",
};

export default ChallanRegisterPrint;