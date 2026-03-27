// import React from 'react';
// import { Box, Typography } from '@mui/material';

// const InwardregPrint = ({ state, data = [] }) => {
//   const { startDate, endDate } = state || {};

//   return (
//     <Box sx={{ p: 4, backgroundColor: "#fff", color: "#000", minHeight: "297mm" }}>
//       {/* --- REPORT HEADER --- */}
//       <Box textAlign="center" mb={3} sx={{ borderBottom: "2px solid #000", pb: 2 }}>
//         <Typography variant="h5" fontWeight="bold" sx={{ textTransform: "uppercase" }}>
//        Company Name
//         </Typography>
//         <Typography variant="h6">Inward Register Report</Typography>
//         <Typography variant="body2">
//           Period: {startDate} To {endDate}
//         </Typography>
//       </Box>

//       {/* --- DATA TABLE --- */}
//       <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "12px" }}>
//         <thead>
//           <tr style={{ backgroundColor: "#f2f2f2" }}>
//             <th style={tableHeaderStyle}>Sr. No.</th>
//             <th style={tableHeaderStyle}>Date</th>
//             <th style={tableHeaderStyle}>Inward No</th>
//             <th style={tableHeaderStyle}>Party Name</th>
//             <th style={tableHeaderStyle}>Particulars</th>
//             <th style={tableHeaderStyle}>Qty</th>
//             <th style={tableHeaderStyle}>Amount</th>
//           </tr>
//         </thead>
//         <tbody>
//           {data.length > 0 ? (
//             data.map((item, index) => (
//               <tr key={index}>
//                 <td style={tableCellStyle}>{index + 1}</td>
//                 <td style={tableCellStyle}>{item.Date}</td>
//                 <td style={tableCellStyle}>{item.InwardNo}</td>
//                 <td style={tableCellStyle}>{item.PartyName}</td>
//                 <td style={tableCellStyle}>{item.Particulars}</td>
//                 <td style={tableCellStyle}>{item.Qty}</td>
//                 <td style={tableCellStyle}>{item.Amount}</td>
//               </tr>
//             ))
//           ) : (
//             <tr>
//               <td colSpan="7" style={{ ...tableCellStyle, textAlign: "center", padding: "20px" }}>
//                 No records found for the selected period.
//               </td>
//             </tr>
//           )}
//         </tbody>
//         {/* --- OPTIONAL FOOTER FOR TOTALS --- */}
//         <tfoot>
//           <tr style={{ fontWeight: "bold", backgroundColor: "#f9f9f9" }}>
//             <td colSpan="5" style={tableCellStyle}>Total</td>
//             <td style={tableCellStyle}>
//               {data.reduce((sum, item) => sum + (Number(item.Qty) || 0), 0)}
//             </td>
//             <td style={tableCellStyle}>
//               {data.reduce((sum, item) => sum + (Number(item.Amount) || 0), 0).toFixed(2)}
//             </td>
//           </tr>
//         </tfoot>
//       </table>

//       {/* --- SIGNATURE SECTION --- */}
//       <Box mt={10} display="flex" justifyContent="space-between">
//         <Typography sx={{ borderTop: "1px solid #000", width: "150px", textAlign: "center" }}>
//           Prepared By
//         </Typography>
//         <Typography sx={{ borderTop: "1px solid #000", width: "150px", textAlign: "center" }}>
//           Authorized Signatory
//         </Typography>
//       </Box>
//     </Box>
//   );
// };

// // --- STYLES ---
// const tableHeaderStyle = {
//   border: "1px solid #000",
//   padding: "8px",
//   textAlign: "left",
//   fontWeight: "bold",
// };

// const tableCellStyle = {
//   border: "1px solid #000",
//   padding: "8px",
//   textAlign: "left",
// };

// export default InwardregPrint;

import React from 'react';
import { Box, Typography } from '@mui/material';

const InwardregPrint = ({ state, data = [] }) => {
  const { startDate, endDate } = state || {};

  return (
    <Box sx={{ p: 4, backgroundColor: "#fff", color: "#000", minHeight: "297mm" }}>
      {/* --- REPORT HEADER --- */}
      <Box textAlign="center" mb={3} sx={{ borderBottom: "2px solid #000", pb: 2 }}>
        <Typography variant="h5" fontWeight="bold" sx={{ textTransform: "uppercase" }}>
          Phadke Prakashan, Kolhapur
        </Typography>
        <Typography variant="h6">Inward Register Report</Typography>
        <Typography variant="body2">
          Period: {startDate} To {endDate}
        </Typography>
      </Box>

      {/* --- DATA TABLE --- */}
      <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "12px" }}>
        <thead>
          <tr style={{ backgroundColor: "#f2f2f2" }}>
            <th style={tableHeaderStyle}>Sr. No.</th>
            <th style={tableHeaderStyle}>Date</th>
            <th style={tableHeaderStyle}>Inward No</th>
            <th style={tableHeaderStyle}>Party Name</th>
            <th style={tableHeaderStyle}>Particulars</th>
            <th style={tableHeaderStyle}>Qty</th>
            <th style={tableHeaderStyle}>Amount</th>
          </tr>
        </thead>
        <tbody>
          {data.length > 0 ? (
            data.map((item, index) => (
              <tr key={index}>
                <td style={tableCellStyle}>{index + 1}</td>
                <td style={tableCellStyle}>{item.Date}</td>
                <td style={tableCellStyle}>{item.InwardNo}</td>
                <td style={tableCellStyle}>{item.PartyName}</td>
                <td style={tableCellStyle}>{item.Particulars}</td>
                <td style={tableCellStyle}>{item.Qty}</td>
                <td style={tableCellStyle}>{item.Amount}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="7" style={{ ...tableCellStyle, textAlign: "center", padding: "20px" }}>
                No records found for the selected period.
              </td>
            </tr>
          )}
        </tbody>
        {/* --- OPTIONAL FOOTER FOR TOTALS --- */}
        <tfoot>
          <tr style={{ fontWeight: "bold", backgroundColor: "#f9f9f9" }}>
            <td colSpan="5" style={tableCellStyle}>Total</td>
            <td style={tableCellStyle}>
              {data.reduce((sum, item) => sum + (Number(item.Qty) || 0), 0)}
            </td>
            <td style={tableCellStyle}>
              {data.reduce((sum, item) => sum + (Number(item.Amount) || 0), 0).toFixed(2)}
            </td>
          </tr>
        </tfoot>
      </table>

      {/* --- SIGNATURE SECTION --- */}
      <Box mt={10} display="flex" justifyContent="space-between">
        <Typography sx={{ borderTop: "1px solid #000", width: "150px", textAlign: "center" }}>
          Prepared By
        </Typography>
        <Typography sx={{ borderTop: "1px solid #000", width: "150px", textAlign: "center" }}>
          Authorized Signatory
        </Typography>
      </Box>
    </Box>
  );
};

// --- STYLES ---
const tableHeaderStyle = {
  border: "1px solid #000",
  padding: "8px",
  textAlign: "left",
  fontWeight: "bold",
};

const tableCellStyle = {
  border: "1px solid #000",
  padding: "8px",
  textAlign: "left",
};

export default InwardregPrint;