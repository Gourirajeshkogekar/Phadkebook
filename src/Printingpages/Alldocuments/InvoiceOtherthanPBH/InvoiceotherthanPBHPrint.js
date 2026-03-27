// import React, { forwardRef, useState } from "react";
// import { Box, Paper, Typography, TextField } from "@mui/material";

// const InvoiceotherthanPBHPrint = forwardRef(({ data, isPrinting }, ref) => {
//   const [memoNo, setMemoNo] = useState(data?.startNo || "00001");
//   const [memoDate, setMemoDate] = useState("01-04-2025");
//   const rows = data?.rows || [];

//   return (
//     <Box ref={ref} sx={{ bgcolor: "white", p: 0 }}>
//       <Paper elevation={0} sx={{ width: "210mm", minHeight: "297mm", mx: "auto", px: "15mm", py: "15mm" }}>
        
//         {/* Header Section */}
//         <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={4}>
//           <Box sx={{ mt: 10 }}> {/* Pushed down slightly to match image */}
//             <Typography fontWeight={700} fontSize={15}>PHADKE BOOK HOUSE, KOLHAPUR.</Typography>
//             <Typography fontSize={12}>Phadke Bhavan, Near Hari Mandir, Dudhali</Typography>
//             <Typography fontSize={12} fontWeight={700}>KOLHAPUR</Typography>
//             <Typography fontSize={12} sx={{ mt: 1 }}>Dist. - KOLHAPUR</Typography>
//           </Box>

//           <Box textAlign="right">
//              <Box mb={2}>
//                 {isPrinting ? (
//                     <Typography fontWeight={700}>Credit Memo No.: &nbsp; {memoNo}</Typography>
//                 ) : (
//                     <TextField label="Memo No" variant="standard" size="small" value={memoNo} onChange={(e)=>setMemoNo(e.target.value)} />
//                 )}
//                 <Typography fontWeight={700} fontSize={13}>{memoDate}</Typography>
//              </Box>
//           </Box>
//         </Box>

//         {/* Sub-Title */}
//         <Box textAlign="center" mb={5}>
//             <Typography fontWeight={700} fontSize={13}>Opening Stock as</Typography>
//             <Typography fontWeight={700} fontSize={13}>on {memoDate}</Typography>
//         </Box>

//         {/* Table rows without borders to match screenshot */}
//         <Box sx={{ mt: 5 }}>
//           {rows.map((row, index) => {
//             const amount = (row.qty * row.rate).toFixed(2);
//             return (
//               <Box key={index} display="flex" sx={{ mb: 1, fontSize: '11px' }}>
//                 <Typography sx={{ width: '25px', fontSize: 'inherit' }}>{index + 1}</Typography>
//                 <Typography sx={{ width: '60px', fontSize: 'inherit' }}>{row.code}</Typography>
//                 <Typography sx={{ width: '70px', fontSize: 'inherit' }}>{row.cls}</Typography>
//                 <Typography sx={{ flexGrow: 1, fontSize: 'inherit', px: 1 }}>{row.name}</Typography>
//                 <Typography sx={{ width: '40px', textAlign: 'right', fontSize: 'inherit' }}>{row.qty}</Typography>
//                 <Typography sx={{ width: '70px', textAlign: 'right', fontSize: 'inherit' }}>{row.rate.toFixed(2)}</Typography>
//                 <Typography sx={{ width: '80px', textAlign: 'right', fontSize: 'inherit' }}>{amount}</Typography>
//                 <Typography sx={{ width: '40px', textAlign: 'right', fontSize: 'inherit' }}>{row.disc}</Typography>
//               </Box>
//             );
//           })}
//         </Box>

//         {/* Total Section would go here */}
//       </Paper>
//     </Box>
//   );
// });

// export default InvoiceotherthanPBHPrint;



import React, { forwardRef, useState } from "react";
import { Box, Paper, Typography, TextField } from "@mui/material";

const InvoiceotherthanPBHPrint = forwardRef(({ data }, ref) => {

const [memoNo,setMemoNo] = useState(data?.startNo || "00001");
const [memoDate,setMemoDate] = useState("01-04-2025");

const rows = data?.rows || [];

return(

<Box ref={ref} sx={{bgcolor:"white"}}>

<Paper sx={{width:"210mm",minHeight:"297mm",mx:"auto",p:"15mm"}}>

{/* HEADER */}

<Box display="flex" justifyContent="space-between" mb={5}>

<Box mt={8}>

<Typography fontWeight={700}>
PHADKE BOOK HOUSE, KOLHAPUR.
</Typography>

<Typography>
Phadke Bhavan, Near Hari Mandir, Dudhali
</Typography>

<Typography fontWeight={700}>
KOLHAPUR
</Typography>

<Typography>
Dist. - KOLHAPUR
</Typography>

</Box>

<Box textAlign="right">

<Typography fontWeight={700}>
Credit Memo No: {memoNo}
</Typography>

<Typography fontWeight={700}>
{memoDate}
</Typography>

</Box>

</Box>


{/* SUBTITLE */}

<Box textAlign="center" mb={5}>

<Typography fontWeight={700}>
Opening Stock as
</Typography>

<Typography fontWeight={700}>
on {memoDate}
</Typography>

</Box>


{/* ROWS */}

<Box>

{rows.map((row,index)=>{

const total = (row.qty * row.rate).toFixed(2);

return(

<Box
key={index}
display="flex"
sx={{fontSize:"13px",mb:1}}
>

<Typography sx={{width:25}}>
{index+1}
</Typography>

<Typography sx={{width:60}}>
{row.code}
</Typography>

<Typography sx={{width:80}}>
{row.cls}
</Typography>

<Typography sx={{flex:1}}>
{row.name}
</Typography>

<Typography sx={{width:40,textAlign:"right"}}>
{row.qty}
</Typography>

<Typography sx={{width:70,textAlign:"right"}}>
{row.rate.toFixed(2)}
</Typography>

<Typography sx={{width:80,textAlign:"right"}}>
{total}
</Typography>

<Typography sx={{width:40,textAlign:"right"}}>
{row.disc}
</Typography>

</Box>

)

})}

</Box>

</Paper>

</Box>

)

});

export default InvoiceotherthanPBHPrint;