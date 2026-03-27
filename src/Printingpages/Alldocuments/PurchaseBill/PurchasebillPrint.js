// import React, { forwardRef } from "react";
// import { Box, Paper, Typography, Table, TableHead, TableRow, TableCell, TableBody, TextField } from "@mui/material";

// const PurchaseBillPrint = forwardRef(({ data, isPrinting, setBillNo, setBillDate }, ref) => {
//   const rows = data?.rows || [];

//   return (
//     <Box ref={ref} sx={{ bgcolor: "white", p: 0 }}>
//       <Paper elevation={0} sx={{ width: "210mm", minHeight: "297mm", mx: "auto", px: "15mm", py: "10mm" }}>
//         <Box textAlign="center" mb={2}>
//           <Typography fontWeight={700} fontSize={18}>Phadke Prakashan, Kolhapur.</Typography>
//           <Typography fontSize={12} fontWeight={600}>Phadke Bhavan, Near Hari Mandir, Dudhali Kolhapur 416012</Typography>
//         </Box>

//         <Box sx={{ borderBottom: "1px solid black", mb: 2 }} />

//         <Box display="flex" justifyContent="space-between" mb={2}>
//           <Box sx={{ lineHeight: 1.8 }}>
//             <Typography fontSize={13} fontWeight={600}>From : {data?.vendorName}</Typography>
//             <Typography fontSize={13} fontWeight={600}>Transaction Date :</Typography>
//             <Typography fontSize={13} fontWeight={600}>Transaction No. :</Typography>
//           </Box>

//           <Box textAlign="right" sx={{ width: 220 }}>
//             {/* 🔹 Logic: While generating PDF (isPrinting is true), show ONLY the text */}
//             {isPrinting ? (
//               <Box>
//                 <Typography fontSize={13} fontWeight={600}>Bill No.: {data.billNo || "_______"}</Typography>
//                 <Typography fontSize={13} fontWeight={600}>Bill Date.: {data.billDate || "_______"}</Typography>
//               </Box>
//             ) : (
//               <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
//                 <TextField
//                   placeholder="Bill No."
//                   size="small"
//                   variant="standard"
//                   value={data.billNo}
//                   onChange={(e) => setBillNo(e.target.value)}
//                   inputProps={{ style: { textAlign: 'right', fontSize: '13px', fontWeight: 600 } }}
//                 />
//                 <TextField
//                   type="date"
//                   size="small"
//                   variant="standard"
//                   value={data.billDate}
//                   onChange={(e) => setBillDate(e.target.value)}
//                   inputProps={{ style: { textAlign: 'right', fontSize: '13px', fontWeight: 600 } }}
//                 />
//               </Box>
//             )}
//           </Box>
//         </Box>

//         <Table size="small">
//           <TableHead>
//             <TableRow>
//               <TableCell sx={{ fontWeight: 700, borderTop: '1px solid black', borderBottom: '1px solid black' }}>Sr. No</TableCell>
//               <TableCell sx={{ fontWeight: 700, borderTop: '1px solid black', borderBottom: '1px solid black' }}>Book Code</TableCell>
//               <TableCell sx={{ fontWeight: 700, borderTop: '1px solid black', borderBottom: '1px solid black' }}>Book Name</TableCell>
//               <TableCell align="right" sx={{ fontWeight: 700, borderTop: '1px solid black', borderBottom: '1px solid black' }}>Copies</TableCell>
//               <TableCell align="right" sx={{ fontWeight: 700, borderTop: '1px solid black', borderBottom: '1px solid black' }}>Price</TableCell>
//               <TableCell align="right" sx={{ fontWeight: 700, borderTop: '1px solid black', borderBottom: '1px solid black' }}>Disc. %</TableCell>
//               <TableCell align="right" sx={{ fontWeight: 700, borderTop: '1px solid black', borderBottom: '1px solid black' }}>Amount</TableCell>
//             </TableRow>
//           </TableHead>
//           <TableBody>
//             {rows.map((r, i) => (
//               <TableRow key={i}>
//                 <TableCell sx={{ border: 'none' }}>{i + 1}</TableCell>
//                 <TableCell sx={{ border: 'none' }}>{r.code}</TableCell>
//                 <TableCell sx={{ border: 'none' }}>{r.name}</TableCell>
//                 <TableCell align="right" sx={{ border: 'none' }}>{r.qty}</TableCell>
//                 <TableCell align="right" sx={{ border: 'none' }}>{r.price}</TableCell>
//                 <TableCell align="right" sx={{ border: 'none' }}>{r.disc}</TableCell>
//                 <TableCell align="right" sx={{ border: 'none' }}>{r.amount}</TableCell>
//               </TableRow>
//             ))}
//           </TableBody>
//         </Table>
//         <Box sx={{ borderTop: "1px solid black", mt: 1 }} />
//       </Paper>
//     </Box>
//   );
// });

// export default PurchaseBillPrint;



import React, { forwardRef } from "react";
import {
  Box,
  Paper,
  Typography,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  TextField
} from "@mui/material";

const PurchaseBillPrint = forwardRef(
  ({ data = {}, isPrinting = false, setBillNo, setBillDate }, ref) => {

  const rows = data?.rows || [];

  /* SAFE NUMBER FORMAT */
  const formatNumber = (val) => {
    if (val === null || val === undefined) return "";
    return String(val);
  };

  return (
    <Box ref={ref} sx={{ bgcolor: "white", p: 0 }}>

      <Paper
        elevation={0}
        sx={{
          width: "210mm",
          minHeight: "297mm",
          mx: "auto",
          px: "15mm",
          py: "10mm"
        }}
      >

        {/* ================= HEADER ================= */}

        <Box textAlign="center" mb={2}>
          <Typography fontWeight={700} fontSize={18}>
            Phadke Prakashan, Kolhapur.
          </Typography>

          <Typography fontSize={12} fontWeight={600}>
            Phadke Bhavan, Near Hari Mandir, Dudhali Kolhapur 416012
          </Typography>
        </Box>

        <Box sx={{ borderBottom: "1px solid black", mb: 2 }} />

        {/* ================= BILL INFO ================= */}

        <Box display="flex" justifyContent="space-between" mb={2}>

          <Box sx={{ lineHeight: 1.8 }}>
            <Typography fontSize={13} fontWeight={600}>
              From : {data?.vendorName || ""}
            </Typography>

            <Typography fontSize={13} fontWeight={600}>
              Transaction Date :
            </Typography>

            <Typography fontSize={13} fontWeight={600}>
              Transaction No. :
            </Typography>
          </Box>

          <Box textAlign="right" sx={{ width: 220 }}>

            {isPrinting ? (

              <Box>
                <Typography fontSize={13} fontWeight={600}>
                  Bill No.: {data.billNo || "________"}
                </Typography>

                <Typography fontSize={13} fontWeight={600}>
                  Bill Date.: {data.billDate || "________"}
                </Typography>
              </Box>

            ) : (

              <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>

                <TextField
                  placeholder="Bill No."
                  size="small"
                  variant="standard"
                  value={data.billNo || ""}
                  onChange={(e) => setBillNo(e.target.value)}
                  inputProps={{
                    style: {
                      textAlign: "right",
                      fontSize: "13px",
                      fontWeight: 600
                    }
                  }}
                />

                <TextField
                  type="date"
                  size="small"
                  variant="standard"
                  value={data.billDate || ""}
                  onChange={(e) => setBillDate(e.target.value)}
                  inputProps={{
                    style: {
                      textAlign: "right",
                      fontSize: "13px",
                      fontWeight: 600
                    }
                  }}
                />

              </Box>

            )}

          </Box>

        </Box>

        {/* ================= TABLE ================= */}

        <Table size="small">

          <TableHead>

            <TableRow>

              <TableCell sx={{ fontWeight: 700, borderTop: "1px solid black", borderBottom: "1px solid black" }}>
                Sr. No
              </TableCell>

              <TableCell sx={{ fontWeight: 700, borderTop: "1px solid black", borderBottom: "1px solid black" }}>
                Book Code
              </TableCell>

              <TableCell sx={{ fontWeight: 700, borderTop: "1px solid black", borderBottom: "1px solid black" }}>
                Book Name
              </TableCell>

              <TableCell align="right" sx={{ fontWeight: 700, borderTop: "1px solid black", borderBottom: "1px solid black" }}>
                Copies
              </TableCell>

              <TableCell align="right" sx={{ fontWeight: 700, borderTop: "1px solid black", borderBottom: "1px solid black" }}>
                Price
              </TableCell>

              <TableCell align="right" sx={{ fontWeight: 700, borderTop: "1px solid black", borderBottom: "1px solid black" }}>
                Disc. %
              </TableCell>

              <TableCell align="right" sx={{ fontWeight: 700, borderTop: "1px solid black", borderBottom: "1px solid black" }}>
                Amount
              </TableCell>

            </TableRow>

          </TableHead>

          <TableBody>

            {rows.length === 0 && (
              <TableRow>
                <TableCell colSpan={7} align="center">
                  No Data Found
                </TableCell>
              </TableRow>
            )}

            {rows.map((r, i) => (

              <TableRow key={i}>

                <TableCell sx={{ border: "none" }}>
                  {r.sr || i + 1}
                </TableCell>

                <TableCell sx={{ border: "none" }}>
                  {r.code}
                </TableCell>

                <TableCell sx={{ border: "none" }}>
                  {r.name}
                </TableCell>

                <TableCell align="right" sx={{ border: "none" }}>
                  {formatNumber(r.qty)}
                </TableCell>

                <TableCell align="right" sx={{ border: "none" }}>
                  {formatNumber(r.price)}
                </TableCell>

                <TableCell align="right" sx={{ border: "none" }}>
                  {formatNumber(r.disc)}
                </TableCell>

                <TableCell align="right" sx={{ border: "none" }}>
                  {formatNumber(r.amount)}
                </TableCell>

              </TableRow>

            ))}

          </TableBody>

        </Table>

        <Box sx={{ borderTop: "1px solid black", mt: 1 }} />

      </Paper>

    </Box>
  );
});

export default PurchaseBillPrint;