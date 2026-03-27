// import React, { forwardRef } from "react";
// import { Box, Typography, Table, TableBody, TableCell, TableContainer, TableRow, Grid } from "@mui/material";

// const SalesInvoicePrint = forwardRef(({ data }, ref) => {
//   return (
//     <Box
//       ref={ref}
//       sx={{
//         width: "210mm",
//         minHeight: "297mm",
//         p: "15mm 15mm",
//         bgcolor: "white",
//         color: "black",
//         fontFamily: "'Times New Roman', Times, serif", // Changed to match classic print look
//       }}
//     >
//       {/* HEADER SECTION */}
//       <Grid container sx={{ mb: 4 }}>
//         <Grid item xs={7}>
//           <Typography sx={{ fontWeight: 900, fontSize: '1.2rem' }}>
//             PHADKE BOOK HOUSE, KOLHAPUR.
//           </Typography>
//           <Typography variant="body2">Phadke Bhavan, Near Hari Mandir, Dudhali</Typography>
//           <Typography sx={{ fontWeight: 'bold' }}>KOLHAPUR</Typography>
//           <Typography variant="caption">Dist. - KOLHAPUR, PIN 416012</Typography>
//           <Typography variant="body2" sx={{ mt: 1, fontWeight: 'bold' }}>
//             GSTIN : 27AGGPP8699E1ZP
//           </Typography>
//         </Grid>

//         <Grid item xs={5} sx={{ textAlign: 'right' }}>
//           <Box sx={{ display: 'inline-block', textAlign: 'left' }}>
//             <Typography sx={{ fontWeight: 'bold', fontSize: '1rem' }}>
//               Credit Memo No.: &nbsp; 00001
//             </Typography>
//             <Typography sx={{ fontWeight: 'bold', pl: 8 }}>
//               01-04-25
//             </Typography>
//             <Typography sx={{ pl: 10, mt: 1 }}>1</Typography>
//           </Box>
//         </Grid>
//       </Grid>

//       <Typography sx={{ fontWeight: 'bold', mb: 4 }}>
//         Opening Stock as on 01.04.2025
//       </Typography>

//       {/* TABLE SECTION: Removed all borders to match the target screenshot */}
//       <TableContainer component={Box}>
//         <Table size="small" sx={{ 
//           "& .MuiTableCell-root": { 
//             border: 'none', 
//             fontSize: '0.85rem',
//             padding: '2px 4px',
//             fontFamily: 'monospace' // Monospace for numbers makes them align perfectly
//           } 
//         }}>
//           <TableBody>
//             {data.map((item, index) => (
//               <TableRow key={index}>
//                 <TableCell sx={{ width: '30px' }}>{index + 1}</TableCell>
//                 <TableCell sx={{ width: '80px' }}>{item.BookCode}</TableCell>
//                 <TableCell sx={{ width: '100px' }}>{item.StandardName}</TableCell>
//                 <TableCell sx={{ width: '320px' }}>{item.BookName}</TableCell>
//                 <TableCell align="right">{item.Copies}</TableCell>
//                 <TableCell align="right">{item.Price.toFixed(2)}</TableCell>
//                 <TableCell align="right">{item.Amount.toFixed(2)}</TableCell>
//                 <TableCell align="right">{item.Discount}</TableCell>
//                 <TableCell align="right" sx={{ fontWeight: 'bold' }}>
//                   {item.DiscountAmount.toFixed(2)}
//                 </TableCell>
//               </TableRow>
//             ))}
//           </TableBody>
//         </Table>
//       </TableContainer>
//     </Box>
//   );
// });

// export default SalesInvoicePrint;




import React, { forwardRef } from "react";
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  Grid,
} from "@mui/material";

const SalesInvoicePrint = forwardRef(({ data }, ref) => {
  return (
    <Box
      ref={ref}
      sx={{
        width: "210mm",
        minHeight: "297mm",
        p: "25mm",
        bgcolor: "white",
        fontFamily: "Times New Roman",
      }}
    >
      <Grid container sx={{ mb: 4 }}>
        <Grid item xs={7}>
          <Typography sx={{ fontWeight: 700, fontSize: "1.2rem" }}>
            PHADKE BOOK HOUSE, KOLHAPUR.
          </Typography>

          <Typography variant="body2">
            Phadke Bhavan, Near Hari Mandir, Dudhali
          </Typography>

          <Typography sx={{ fontWeight: "bold" }}>KOLHAPUR</Typography>

          <Typography variant="caption">
            Dist. - KOLHAPUR, PIN 416012
          </Typography>

          <Typography sx={{ mt: 1, fontWeight: "bold" }}>
            GSTIN : 27AGGPP8699E1ZP
          </Typography>
        </Grid>

        <Grid item xs={5} sx={{ textAlign: "right" }}>
          <Typography sx={{ fontWeight: "bold" }}>
            Credit Memo No. : 00001
          </Typography>

          <Typography>01-04-25</Typography>

          <Typography>1</Typography>
        </Grid>
      </Grid>

      <Typography sx={{ fontWeight: "bold", mb: 4 }}>
        Opening Stock as on 01.04.2025
      </Typography>

      <TableContainer component={Box}>
        <Table
          size="small"
          sx={{
            "& .MuiTableCell-root": {
              border: "none",
              padding: "3px",
              fontSize: "13px",
            },
          }}
        >
          <TableBody>
            {data.map((item, index) => (
              <TableRow key={index}>
                <TableCell>{index + 1}</TableCell>

                <TableCell>{item.BookCode}</TableCell>

                <TableCell>{item.StandardName}</TableCell>

                <TableCell>{item.BookName}</TableCell>

                <TableCell align="right">{item.Copies}</TableCell>

                <TableCell align="right">
                  {Number(item.Price).toFixed(2)}
                </TableCell>

                <TableCell align="right">
                  {Number(item.Amount).toFixed(2)}
                </TableCell>

                <TableCell align="right">{item.Discount}</TableCell>

                <TableCell align="right">
                  {Number(item.DiscountAmount).toFixed(2)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
});

export default SalesInvoicePrint;