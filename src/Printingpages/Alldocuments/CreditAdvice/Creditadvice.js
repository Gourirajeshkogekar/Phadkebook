// import React, { useState, useRef } from "react";
// import { Box, Paper, Typography, TextField, Checkbox, FormControlLabel, Button, Divider } from "@mui/material";
// import CreditadvicePrint from "./CreditadvicePrint";
// import jsPDF from "jspdf";
// import html2canvas from "html2canvas";

// function CreditAdvice() {
//   const [startNo, setStartNo] = useState("");
//   const [endNo, setEndNo] = useState("");
//   const [allRequired, setAllRequired] = useState(false);
//   const [showPreview, setShowPreview] = useState(false);
//   const [printing, setPrinting] = useState(false);
//   const reportRef = useRef();

//   // Mock data based on your "MAHALAXMI STATIONERS" screenshot
//   const mockData = {
//     adviceNo: startNo || "2",
//     date: "07-05-25",
//     to: "MAHALAXMI STATIONERS, KADEGAON",
//     address: "Opp. Sonhira Petrol Pump, Matoshri Bayabai College, Near Tara Hospital KADEGAON",
//     district: "SANGLI",
//     amountWords: "Thirty Only.",
//     particulars: [
//       { desc: "CN N 2", amount: "30.00" }
//     ],
//     totalAmount: "30.00"
//   };

//   const handlePrint = async () => {
//     setPrinting(true);
//     setTimeout(async () => {
//       try {
//         const element = reportRef.current;
//         const canvas = await html2canvas(element, { scale: 2, useCORS: true });
//         const imgData = canvas.toDataURL("image/png");
//         const pdf = new jsPDF("p", "mm", "a4");
//         pdf.addImage(imgData, "PNG", 0, 0, 210, 297);
//         window.open(pdf.output("bloburl"), "_blank");
//       } catch (error) {
//         console.error("PDF Error:", error);
//       } finally {
//         setPrinting(false);
//       }
//     }, 150);
//   };

//   if (showPreview) {
//     return (
//       <Box sx={{ minHeight: "100vh", py: 4, bgcolor: "#525659" }}>
//         <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, mb: 3 }}>
//           <Button variant="contained" onClick={handlePrint} disabled={printing}>
//             {printing ? "Generating..." : "Confirm & Download"}
//           </Button>
//           <Button variant="contained" color="error" onClick={() => setShowPreview(false)}>Go Back</Button>
//         </Box>
//         <CreditadvicePrint ref={reportRef} data={mockData} isPrinting={printing} />
//       </Box>
//     );
//   }

//   return (
//     <Box sx={{ minHeight: "100vh", background: "linear-gradient(135deg, #f5f7fa 0%, #e4e8ee 100%)", display: "flex", justifyContent: "center", pt: "60px" }}>
//       <Box>
//         <Typography variant="h6" fontWeight="700" textAlign="center" mb={4}>Credit Advice</Typography>
//         <Paper elevation={6} sx={{ width: 520, p: "32px 36px", borderRadius: "12px" }}>
//           <Box display="flex" alignItems="center" mb={3}>
//             <Typography sx={{ width: 130, fontWeight: 600 }}>Start No :</Typography>
//             <TextField size="small" fullWidth value={startNo} onChange={(e) => setStartNo(e.target.value)} />
//           </Box>
//           <Box display="flex" alignItems="center" mb={3}>
//             <Typography sx={{ width: 130, fontWeight: 600 }}>End No :</Typography>
//             <TextField size="small" fullWidth value={endNo} onChange={(e) => setEndNo(e.target.value)} />
//           </Box>
//           <Divider sx={{ my: 2 }} />
//           <FormControlLabel control={<Checkbox checked={allRequired} onChange={(e) => setAllRequired(e.target.checked)} />} label={<Typography fontWeight={600}>All Challans are Required</Typography>} />
//         </Paper>
//         <Box display="flex" justifyContent="center" gap={3} mt={4}>
//           <Button variant="contained" size="large" onClick={() => setShowPreview(true)}>Print Report</Button>
//           <Button variant="contained" color="error" size="large" onClick={() => {setStartNo(""); setEndNo("");}}>Close</Button>
//         </Box>
//       </Box>
//     </Box>
//   );
// }

// export default CreditAdvice;




import React, { useState, useRef } from "react";
import {
Box,
Paper,
Typography,
TextField,
Checkbox,
FormControlLabel,
Button,
Divider
} from "@mui/material";

import axios from "axios";
import CreditadvicePrint from "./CreditadvicePrint";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

function CreditAdvice(){

const [startNo,setStartNo] = useState("");
const [endNo,setEndNo] = useState("");
const [allRequired,setAllRequired] = useState(false);

const [showPreview,setShowPreview] = useState(false);
const [printing,setPrinting] = useState(false);

const [printData,setPrintData] = useState(null);

const reportRef = useRef();

const fetchCreditAdvice = async ()=>{

try{

const res = await axios.get(
"https://publication.microtechsolutions.net.in/php/get/getCreditAdvice.php",
{
params:{
startNumber:startNo,
endNumber:endNo,
allChallansRequired:allRequired
}
}
);

const api = res.data;

if(!api.success) return;

const firstRow = api.data[0];

const mapped = {

adviceNo:firstRow.CreditAdviceNo,

date:new Date(firstRow.CreditAdviceDate)
.toLocaleDateString("en-GB"),

to:firstRow.AccountName,

address:"",

district:"",

amountWords:firstRow.TotalAmount,

particulars:api.data.map(row=>({
desc:row.AccountName,
amount:parseFloat(row.TotalAmount).toFixed(2)
})),

totalAmount:parseFloat(api.totalCreditAmount).toFixed(2)

};

setPrintData(mapped);

setShowPreview(true);

}catch(err){

console.log("API ERROR",err);

}

};

const handlePrint = async ()=>{

setPrinting(true);

try{

const element = reportRef.current;

const canvas = await html2canvas(element,{
scale:2,
useCORS:true
});

const imgData = canvas.toDataURL("image/png");

const pdf = new jsPDF("p","mm","a4");

const imgWidth = 210;
const imgHeight = canvas.height * imgWidth / canvas.width;

pdf.addImage(imgData,"PNG",0,0,imgWidth,imgHeight);

window.open(pdf.output("bloburl"),"_blank");

}catch(err){

console.log("PDF ERROR",err);

}finally{

setPrinting(false);

}

};

if(showPreview){

return(

<Box sx={{minHeight:"100vh",py:4,bgcolor:"#525659"}}>

<Box display="flex" justifyContent="center" gap={2} mb={3}>

<Button
variant="contained"
onClick={handlePrint}
disabled={printing}
>
{printing ? "Generating..." : "Confirm & Download"}
</Button>

<Button
variant="contained"
color="error"
onClick={()=>setShowPreview(false)}
>
Go Back
</Button>

</Box>

<CreditadvicePrint
ref={reportRef}
data={printData}
/>

</Box>

)

}

return(

<Box
sx={{
minHeight:"100vh",
background:"linear-gradient(135deg,#f5f7fa 0%,#e4e8ee 100%)",
display:"flex",
justifyContent:"center",
pt:"60px"
}}
>

<Box>

<Typography
variant="h6"
fontWeight="700"
textAlign="center"
mb={4}
>
Credit Advice
</Typography>

<Paper
elevation={6}
sx={{width:520,p:"32px 36px",borderRadius:"12px"}}
>

<Box display="flex" alignItems="center" mb={3}>

<Typography sx={{width:130,fontWeight:600}}>
Start No :
</Typography>

<TextField
size="small"
fullWidth
value={startNo}
onChange={(e)=>setStartNo(e.target.value)}
/>

</Box>

<Box display="flex" alignItems="center" mb={3}>

<Typography sx={{width:130,fontWeight:600}}>
End No :
</Typography>

<TextField
size="small"
fullWidth
value={endNo}
onChange={(e)=>setEndNo(e.target.value)}
/>

</Box>

<Divider sx={{my:2}}/>

<FormControlLabel
control={
<Checkbox
checked={allRequired}
onChange={(e)=>setAllRequired(e.target.checked)}
/>
}
label={
<Typography fontWeight={600}>
All Challans are Required
</Typography>
}
/>

</Paper>

<Box display="flex" justifyContent="center" gap={3} mt={4}>

<Button
variant="contained"
size="large"
onClick={fetchCreditAdvice}
>
Print Report
</Button>

<Button
variant="contained"
color="error"
size="large"
onClick={()=>{
setStartNo("");
setEndNo("");
}}
>
Close
</Button>

</Box>

</Box>

</Box>

)

}

export default CreditAdvice;