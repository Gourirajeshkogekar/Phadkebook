// import React, { useState, useRef } from "react";
// import { Box, Paper, Typography, TextField, Checkbox, FormControlLabel, Button, Divider } from "@mui/material";
// import DebitnotePrint from "./DebitnotePrint";
// import jsPDF from "jspdf";
// import html2canvas from "html2canvas";

// function DebitNote() {
//   const [startNo, setStartNo] = useState("");
//   const [endNo, setEndNo] = useState("");
//   const [allRequired, setAllRequired] = useState(false);
//   const [showPreview, setShowPreview] = useState(false);
//   const [printing, setPrinting] = useState(false);
//   const reportRef = useRef();

//   // Mock data based on the "PRASAD BOOK CENTER" screenshot
//   const mockData = {
//     debitNoteNo: startNo || "1",
//     date: "07-05-25",
//     to: "PRASAD BOOK CENTER, DHARASHIV",
//     address: "Near R.P. College, DHARASHIV",
//     district: "DHARASHIV",
//     amountWords: "One Only.",
//     particulars: [
//       { desc: "DN N 1", amount: "1.00" }
//     ],
//     totalAmount: "1.00"
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
//             {printing ? "Generating PDF..." : "Confirm & Download"}
//           </Button>
//           <Button variant="contained" color="error" onClick={() => setShowPreview(false)}>Go Back</Button>
//         </Box>
//         <DebitnotePrint ref={reportRef} data={mockData} />
//       </Box>
//     );
//   }

//   return (
//     <Box sx={{ minHeight: "100vh", background: "linear-gradient(135deg, #f5f7fa 0%, #e4e8ee 100%)", display: "flex", justifyContent: "center", pt: "60px" }}>
//       <Box>
//         <Typography variant="h6" fontWeight="700" textAlign="center" mb={4}>Debit Note</Typography>
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

// export default DebitNote;


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
import DebitnotePrint from "./DebitnotePrint";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { toast } from "react-toastify";
function DebitNote(){

const [startNo,setStartNo] = useState("");
const [endNo,setEndNo] = useState("");
const [allRequired,setAllRequired] = useState(false);

const [showPreview,setShowPreview] = useState(false);
const [printing,setPrinting] = useState(false);

const [printData,setPrintData] = useState(null);

const reportRef = useRef();

const fetchDebitNote = async ()=>{

try{

const res = await axios.get(
"https://publication.microtechsolutions.net.in/php/get/getDebitNote.php",
{
params:{
startNumber:startNo,
endNumber:endNo,
allChallansRequired:allRequired
}
}
);

const api = res.data;

if(!api.success || api.data.length === 0){
toast.error("No Debit Note found in this range");
return;
}

const firstRow = api.data[0];

const mapped = {

debitNoteNo:firstRow.DebitNoteNo,

date:new Date(firstRow.DebitNoteDate)
.toLocaleDateString("en-GB"),

to:firstRow.AccountName || "ACCOUNT NAME",

address:firstRow.Address || "",

district:firstRow.District || "",

amountWords:firstRow.TotalAmount,

particulars:api.data.map(row=>({
desc:`DN N ${row.DebitNoteNo}`,
amount:parseFloat(row.TotalAmount).toFixed(2)
})),

totalAmount:api.data
.reduce((sum,row)=>sum+parseFloat(row.TotalAmount),0)
.toFixed(2)

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
{printing ? "Generating PDF..." : "Confirm & Download"}
</Button>

<Button
variant="contained"
color="error"
onClick={()=>setShowPreview(false)}
>
Go Back
</Button>

</Box>

<DebitnotePrint
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
Debit Note
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
onClick={fetchDebitNote}
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

export default DebitNote;