// import React, { useState, forwardRef , useRef} from "react";
// import { Box, Paper, Typography, TextField, Button, Divider } from "@mui/material";
// import jsPDF from "jspdf";
// import html2canvas from "html2canvas";
// const BankLetterPrint = forwardRef((props, ref) => {

//   const [date, setDate] = useState("");
//   const [invoiceNo, setInvoiceNo] = useState("00001");
//   const [receiptNo, setReceiptNo] = useState("1000")
//   const [amount, setAmount] = useState("204,962.00");
//   const [amountWords, setAmountWords] = useState(
//     "Two hundred four thousand nine hundred sixty-two"
//   );
//   const [partyName, setPartyName] = useState(
//     "PHADKE BOOK HOUSE, KOLHAPUR"
//   );
// /* ✅ totally borderless textfield */ const noBorderField = { "& .MuiOutlinedInput-root": { "& fieldset": { border: "none" }, "&:hover fieldset": { border: "none" }, "&.Mui-focused fieldset": { border: "none" } }, "& .MuiInputBase-input": { padding: "2px 4px", fontSize: "15px" }, background: "transparent" };
//   const [printing , setPrinting ] = useState(false);

//     const reportRef = useRef();
  
  
// return (
//     <Box
//       sx={{
//         minHeight: "100vh",
//         background:
//           "linear-gradient(135deg,#eef2f7,#dfe6ee)",
//         py: 6
//       }}
//     >
//      <Paper
//   ref={ref}

//         sx={{
//           width: "820px",
//           mx: "auto",
//           p: 6,
//           borderRadius: 3,
//           boxShadow: "0 10px 30px rgba(0,0,0,0.12)",
//           border: "1px solid #d0d7e2"
//         }}
//       >
//         {/* HEADER */}
//         <Typography align="center" fontWeight={700} fontSize={22}>
//           Phadke Prakashan, Kolhapur
//         </Typography>

//         <Typography align="center" fontSize={14} color="text.secondary">
//           Phadke Bhavan, Near Hari Mandir, Dudhali Kolhapur 416012
//         </Typography>

//         <Divider sx={{ my: 2 }} />

//         <Typography fontWeight={700} mb={3}>
//           Collection through Bank
//         </Typography>

//         {/* DATE */}
//         <Box display="flex" justifyContent="space-between" mb={3}>
//           <Typography>Kolhapur</Typography>

//           <TextField
//             variant="outlined"
//             size="small"
//             placeholder="Date"
//             value={date}
//             onChange={(e) => setDate(e.target.value)}
//             sx={{ width: 150, ...noBorderField }}
//           />
//         </Box>

//         <Typography mb={2}>The Manager</Typography>

//         {/* INVOICE */}
//         <Box display="flex" gap={2} alignItems="center" mb={2}>
//           <Typography fontWeight={600}>
//             Invoice No:
//           </Typography>

//           <TextField
//             size="small"
//             value={invoiceNo}
//             onChange={(e) => setInvoiceNo(e.target.value)}
//             sx={{ width: 90, ...noBorderField }}
//           />

//           <Typography fontWeight={600}>
//             Amount Rs:
//           </Typography>

//           <TextField
//             size="small"
//             value={amount}
//             onChange={(e) => setAmount(e.target.value)}
//             sx={{ width: 140, ...noBorderField }}
//           />
//         </Box>

//         <Typography mb={2}>Dear Sir,</Typography>

//         {/* PARTY */}
//         <Box mb={2}>
//           Drawn On:
//           <TextField
//             size="small"
//             value={partyName}
//             onChange={(e) => setPartyName(e.target.value)}
//             sx={{ ml: 2, width: 480, ...noBorderField }}
//           />
//         </Box>

//         {/* WORDS */}
//         <Box mb={2}>
//           Amount in Words:
//           <TextField
//             size="small"
//             value={amountWords}
//             onChange={(e) => setAmountWords(e.target.value)}
//             sx={{ ml: 2, width: 520, ...noBorderField }}
//           />
//         </Box>

//         {/* PARAGRAPH */}
//         <Typography lineHeight={1.9} fontSize={15} mb={3}>
//           We are enclosing our Invoice for Rs.
//           <b> {amountWords} </b>
//           and Ps. zero only together with Opening Stock as on
//           01.04.2025 Receipt No.
//           <TextField
//             size="small"
//             value={receiptNo}
//             onChange={(e) => setReceiptNo(e.target.value)}
//             sx={{ width: 100, ...noBorderField }}
//           />
//           for collection. A Demand Draft on Kolhapur for Rs.
//           {amount} may be sent to us soon after collection.
//           Please deliver the documents on payment.
//         </Typography>

//         {/* CENTER NOTE */}
//         <Typography
//           align="center"
//           fontWeight={700}
//           letterSpacing={1}
//           mb={4}
//         >
//           YOUR CHARGES MAY BE RECOVERED FROM THE PARTY
//         </Typography>

//         <Typography fontWeight={700}>
//           Draft Value – Rs. {amount}/-
//         </Typography>

//         {/* SIGN */}
//         <Box mt={8} textAlign="right">
//           <Typography>Yours faithfully,</Typography>
//           <Typography fontWeight={700}>
//             For Phadke Prakashan, Kolhapur
//           </Typography>
//           <Typography mt={5}>
//             Authorised Signatory
//           </Typography>
//         </Box>

    
//       </Paper>

//       {/* PRINT STYLE */}
//       <style>
//         {`
//         @media print {
//           .no-print { display:none; }
//           body { background:white; }
//           @page { margin:18mm; }
//         }
//         `}
//       </style>
//     </Box>
// )
// })

// export default BankLetterPrint;




import React, { forwardRef } from "react";
import { Box, Typography, Divider } from "@mui/material";

const BankletterPrint = forwardRef(({ data }, ref) => {

if (!data) return null;

return (

<Box ref={ref}>

{data.rows.map((row,index)=>(

<Box
key={index}
sx={{
width:"210mm",
minHeight:"297mm",
p:"25mm",
boxSizing:"border-box",
fontFamily:"Times New Roman",
bgcolor:"white",
lineHeight:1.8,
pageBreakAfter:"always"
}}
>

{/* HEADER */}

<Typography align="center" fontWeight={700} fontSize={20}>
{data.companyName}
</Typography>

<Typography align="center" fontSize={14}>
{data.companyAddress}
</Typography>

<Divider sx={{my:2}}/>

{/* SUBJECT */}

<Box display="flex" justifyContent="space-between">

<Typography sx={{textDecoration:"underline"}}>
Collection through Bank
</Typography>

<Box textAlign="right">
<Typography>{data.bankLocation}</Typography>
<Typography>Date :</Typography>
</Box>

</Box>

{/* MANAGER */}

<Typography mt={4}>
The Manager
</Typography>

{/* INVOICE */}

<Typography mt={3} fontWeight={600}>

Invoice No.: {row.invoiceNo} dated {row.date} for Rs. {row.amount}/-

</Typography>

<Typography mt={2}>
Dear Sir,
</Typography>

{/* DRAWN ON */}

<Typography mt={2}>
Drawn On <b>{data.partyName}</b>
</Typography>

<Typography>
Phadke Bhavan, Near Hari Mandir, Dudhali
</Typography>

<Typography>
KOLHAPUR
</Typography>

<Typography>
Dist: KOLHAPUR
</Typography>

{/* LETTER BODY */}

<Typography mt={3} textAlign="justify">

We are enclosing our Invoice for Rs. {data.grandTotal} and Ps. zero only together with
Opening Stock as on 01.04.2025 Receipt No. {row.receipt} for collection.

A Demand Draft on Kolhapur for Rs. {data.grandTotal} may be sent to us soon after
collection. Please deliver the documents on payment.

</Typography>

{/* CENTER NOTE */}

<Typography
align="center"
fontWeight={700}
mt={4}
letterSpacing={1}
>
YOUR CHARGES MAY BE RECOVERED FROM THE PARTY
</Typography>

{/* DRAFT VALUE */}

<Typography mt={4} fontWeight={600}>
Draft Value - Rs. {data.grandTotal}/-
</Typography>

{/* RECEIPT */}

<Box mt={4}>

<Typography>Encl.</Typography>

<Typography>
Receipt No : {row.receipt}
</Typography>

<Typography>
Dated :
</Typography>

</Box>

{/* SIGNATURE */}

<Box mt={8} textAlign="right">

{data.signature?.split("\n").map((line,i)=>(
<Typography key={i}>{line}</Typography>
))}

</Box>

</Box>

))}

</Box>

)

})

export default BankletterPrint