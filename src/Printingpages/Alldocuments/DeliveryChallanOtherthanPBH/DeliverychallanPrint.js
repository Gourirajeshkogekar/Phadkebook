// import React, { forwardRef, useState } from "react";
// import { Box, Paper, Typography, TextField } from "@mui/material";

// const DeliveryChallanPrint = forwardRef(({ data, isPrinting }, ref) => {
//   const [memoNo, setMemoNo] = useState("1");
//   const [memoDate, setMemoDate] = useState("01-04-25");
//   const rows = data?.rows || [];

//   return (
//     <Box ref={ref} sx={{ bgcolor: "white", p: 0 }}>
//       <Paper elevation={0} sx={{ width: "210mm", minHeight: "297mm", mx: "auto", px: "15mm", py: "10mm", position: 'relative' }}>
        
//         {/* Top Header Row (Page No and Date) */}
//         <Box display="flex" justifyContent="center" gap={15} mb={4}>
//           {isPrinting ? (
//             <>
//               <Typography sx={{ fontWeight: 700 }}>{memoNo}</Typography>
//               <Typography sx={{ fontWeight: 700 }}>{memoDate}</Typography>
//             </>
//           ) : (
//             <>
//               <TextField label="Sr/Memo No" size="small" variant="standard" value={memoNo} onChange={(e)=>setMemoNo(e.target.value)} />
//               <TextField label="Date" size="small" variant="standard" value={memoDate} onChange={(e)=>setMemoDate(e.target.value)} />
//             </>
//           )}
//         </Box>

//         {/* Company Two-Column Header */}
//         <Box display="flex" justifyContent="space-between" mb={6}>
//           {/* Left Company */}
//           <Box sx={{ width: '45%' }}>
//             <Typography variant="body1" fontWeight={700}>Phadke Prakashan, Kolhapur.</Typography>
//             <Typography variant="caption" display="block">Phadke Bhavan, Near Hari Mandir, Dudhali</Typography>
//             <Typography variant="caption" display="block">Kolhapur - 416012</Typography>
//             <Typography variant="caption" display="block">Tel. No. - 2540 211</Typography>
//           </Box>

//           {/* Right Company */}
//           <Box sx={{ width: '45%' }}>
//             <Typography variant="body1" fontWeight={700}>PHADKE BOOK HOUSE, KOLHAPUR.</Typography>
//             <Typography variant="caption" display="block">Phadke Bhavan, Near Hari</Typography>
//             <Typography variant="caption" display="block">Mandir, Dudhali KOLHAPUR Dist. KOLHAPUR - 416012</Typography>
//             <Typography variant="caption" display="block">Tel. No.</Typography>
//           </Box>
//         </Box>

//         {/* Data Rows (Matching the screenshot spacing) */}
//         <Box sx={{ mt: 2 }}>
//           {rows.map((row, index) => (
//             <Box key={index} display="flex" sx={{ mb: 0.5, fontSize: '12px' }}>
//               <Typography sx={{ width: '30px', fontSize: 'inherit' }}>{index + 1}</Typography>
//               <Typography sx={{ width: '80px', fontSize: 'inherit' }}>{row.id}</Typography>
//               <Typography sx={{ width: '100px', fontSize: 'inherit' }}>{row.class}</Typography>
//               <Typography sx={{ flexGrow: 1, fontSize: 'inherit' }}>{row.name}</Typography>
//               <Typography sx={{ width: '60px', textAlign: 'right', fontSize: 'inherit' }}>{row.qty}</Typography>
//               <Typography sx={{ width: '80px', textAlign: 'right', fontSize: 'inherit' }}>{row.rate}</Typography>
//             </Box>
//           ))}
//         </Box>
//       </Paper>
//     </Box>
//   );
// });

// export default DeliveryChallanPrint;



import React, { forwardRef, useState } from "react";
import { Box, Paper, Typography, TextField } from "@mui/material";

const DeliveryChallanPrint = forwardRef(({ data, isPrinting }, ref) => {

  const [memoNo, setMemoNo] = useState("1");
  const [memoDate, setMemoDate] = useState("01-04-25");

  const rows = data?.rows || [];

  return (

    <Box ref={ref} sx={{ bgcolor:"white", p:0 }}>

      <Paper
        elevation={0}
        sx={{
          width:"210mm",
          minHeight:"297mm",
          mx:"auto",
          px:"15mm",
          py:"10mm"
        }}
      >

        {/* Memo No + Date */}

        <Box display="flex" justifyContent="center" gap={15} mb={4}>

          {isPrinting ? (

            <>
              <Typography fontWeight={700}>{memoNo}</Typography>
              <Typography fontWeight={700}>{memoDate}</Typography>
            </>

          ) : (

            <>
              <TextField
                label="Memo No"
                size="small"
                variant="standard"
                value={memoNo}
                onChange={(e)=>setMemoNo(e.target.value)}
              />

              <TextField
                label="Date"
                size="small"
                variant="standard"
                value={memoDate}
                onChange={(e)=>setMemoDate(e.target.value)}
              />
            </>

          )}

        </Box>

        {/* Company Header */}

        <Box display="flex" justifyContent="space-between" mb={6}>

          <Box sx={{ width:"45%" }}>
            <Typography fontWeight={700}>Phadke Prakashan, Kolhapur.</Typography>
            <Typography variant="caption" display="block">Phadke Bhavan, Near Hari Mandir, Dudhali</Typography>
            <Typography variant="caption" display="block">Kolhapur - 416012</Typography>
            <Typography variant="caption" display="block">Tel. No. - 2540 211</Typography>
          </Box>

          <Box sx={{ width:"45%" }}>
            <Typography fontWeight={700}>PHADKE BOOK HOUSE, KOLHAPUR.</Typography>
            <Typography variant="caption" display="block">Phadke Bhavan, Near Hari</Typography>
            <Typography variant="caption" display="block">Mandir, Dudhali Kolhapur</Typography>
          </Box>

        </Box>

        {/* Rows */}

        <Box>

          {rows.map((row,index)=>(
            <Box key={index} display="flex" mb={0.5}>

              <Typography sx={{ width:"30px" }}>
                {index+1}
              </Typography>

              <Typography sx={{ width:"80px" }}>
                {row.id}
              </Typography>

              <Typography sx={{ width:"100px" }}>
                {row.class}
              </Typography>

              <Typography sx={{ flexGrow:1 }}>
                {row.name}
              </Typography>

              <Typography sx={{ width:"60px", textAlign:"right" }}>
                {row.qty}
              </Typography>

              <Typography sx={{ width:"80px", textAlign:"right" }}>
                {row.rate}
              </Typography>

            </Box>
          ))}

        </Box>

      </Paper>

    </Box>

  );

});

export default DeliveryChallanPrint;