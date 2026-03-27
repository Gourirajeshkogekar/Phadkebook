// import React, { useState, useRef } from "react";
// import { useNavigate } from "react-router-dom";
// import { Box, Paper, Typography, TextField, Checkbox, FormControlLabel, CircularProgress, Button, Stack, Radio, RadioGroup } from "@mui/material";
// import jsPDF from "jspdf";
// import html2canvas from "html2canvas";
// import ReceiptPrint from "./ReceiptPrint";

// const MOCK_DATA = {
//   serialNo: "1",
//   date: "06-05-25",
//   amount: "90,000.00",
//   bankDetails: "BANK OF INDIA, C/A  A/C 090220110000887  DIST.:KOLHAPUR",
//   amountInWords: "Ninety thousand Only.",
//   particulars: "Cash Withdrawn Self Chq. No.330132",
//   paymentMode: "Cash"
// };

// function Receipt() {
//   const [startNo, setStartNo] = useState("");
//   const [endNo, setEndNo] = useState("");
//   const [allRequired, setAllRequired] = useState(false);
//   const [receiptPart, setReceiptPart] = useState("first");
//   const [printing, setPrinting] = useState(false);
//   const [showPreview, setShowPreview] = useState(false); 
  
//   const reportRef = useRef();
//   const navigate = useNavigate();

//   const handlePrint = async () => {
//     setPrinting(true);
//     try {
//       const element = reportRef.current;
//       // High scale (3) ensures it captures at 100% resolution for crisp text
//       const canvas = await html2canvas(element, { 
//         scale: 3, 
//         useCORS: true,
//         backgroundColor: "#ffffff" 
//       });
      
//       const imgData = canvas.toDataURL("image/png");
//       const pdf = new jsPDF("p", "mm", "a4");
//       pdf.addImage(imgData, "PNG", 0, 0, 210, 297);
//       window.open(pdf.output("bloburl"), "_blank");
//     } catch (error) {
//       console.error("Print Error:", error);
//     } finally {
//       setPrinting(false);
//     }
//   };

//   if (showPreview) {
//     return (
//       <Box sx={{  minHeight: "100vh", p: 3, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
//         <Stack direction="row" spacing={2} sx={{ mb: 3, position: 'sticky', top: 0, zIndex: 10 }}>
//           <Button variant="contained" onClick={handlePrint} disabled={printing} sx={{ bgcolor: '#1a73e8' }}>
//             {printing ? "Generating PDF..." : "Confirm & Print"}
//           </Button>
//           <Button variant="contained" color="error" onClick={() => setShowPreview(false)}>
//             Back to Form
//           </Button>
//         </Stack>
        
//         {/* The Receipt actually visible to the DOM for html2canvas to "see" it */}
//         <Paper elevation={10} sx={{ width: "210mm", bgcolor: 'white', overflow: 'hidden' }}>
//           <ReceiptPrint ref={reportRef} data={MOCK_DATA} />
//         </Paper>
//       </Box>
//     );
//   }

//   return (
//     <Box sx={{ minHeight: "100vh", background: "linear-gradient(135deg, #f5f7fa 0%, #e4e8ee 100%)", display: "flex", justifyContent: "center", pt: 2 }}>
//       <Box>
//         <Typography variant="h6" fontWeight="700" textAlign="center" mb={2}>Receipt</Typography>
        
//         <Paper elevation={6} sx={{ width: 540, padding: "30px 36px", borderRadius: "12px", mb: 2 }}>
//           <Stack spacing={2}>
//             <Box display="flex" alignItems="center">
//               <Typography sx={{ width: 140, fontWeight: 600 }}>Start No :</Typography>
//               <TextField size="small" fullWidth value={startNo} onChange={(e) => setStartNo(e.target.value)} />
//             </Box>
//             <Box display="flex" alignItems="center">
//               <Typography sx={{ width: 140, fontWeight: 600 }}>End No :</Typography>
//               <TextField size="small" fullWidth value={endNo} onChange={(e) => setEndNo(e.target.value)} />
//             </Box>
//             <FormControlLabel control={<Checkbox checked={allRequired} onChange={(e) => setAllRequired(e.target.checked)} />}
//               label={<Typography fontWeight={600}>All Challans are Required</Typography>} />
//           </Stack>
//         </Paper>

//         <Typography variant="h6" fontWeight="700" textAlign="center" mb={1}>First Copy of Receipt</Typography>
        
//         <Paper elevation={6} sx={{ width: 540, padding: "26px 36px", borderRadius: "12px" }}>
//           <RadioGroup value={receiptPart} onChange={(e) => setReceiptPart(e.target.value)}>
//             <FormControlLabel value="first" control={<Radio />} label={<Typography fontWeight={600}>First Part</Typography>} />
//             <FormControlLabel value="second" control={<Radio />} label={<Typography fontWeight={600}>Second Part</Typography>} />
//           </RadioGroup>
//         </Paper>

//         <Box display="flex" gap={2} mt={2}>
//           <Button 
//             fullWidth 
//             variant="contained" 
//             onClick={() => setShowPreview(true)} 
//             sx={{ py: 1.2, bgcolor: "#2563eb" }}
//           >
//             Preview Report
//           </Button>
//           <Button fullWidth variant="outlined" color="error" onClick={() => navigate(-1)}>Close</Button>
//         </Box>
//       </Box>
//     </Box>
//   );
// }

// export default Receipt;



import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
Box,
Paper,
Typography,
TextField,
Checkbox,
FormControlLabel,
CircularProgress,
Button,
Stack,
Radio,
RadioGroup
} from "@mui/material";

import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import axios from "axios";
import ReceiptPrint from "./ReceiptPrint";

function Receipt(){

const [startNo,setStartNo] = useState("");
const [endNo,setEndNo] = useState("");
const [allRequired,setAllRequired] = useState(false);
const [receiptPart,setReceiptPart] = useState("first");

const [printing,setPrinting] = useState(false);
const [showPreview,setShowPreview] = useState(false);

const [receiptData,setReceiptData] = useState([]);

const reportRef = useRef();
const navigate = useNavigate();

const fetchReceipt = async ()=>{

setPrinting(true);

try{

const response = await axios.get(
"https://publication.microtechsolutions.net.in/php/get/getReceipt.php",
{
params:{
startNumber:startNo,
endNumber:endNo,
allChallansRequired:allRequired,
recieptCopy:receiptPart
}
}
);

const api = response.data;

const mapped = api.data.map((item)=>({

serialNo:item.SrNo,

date:item.SaleDate,

amount:item.FormattedAmount,

bankDetails:
`${api.printLayout.header1}
${api.printLayout.header2}
${api.printLayout.header3}
${api.printLayout.header4}`,

amountInWords:api.printLayout.footer,

particulars:`Receipt Ref ${item.ReceiptRef}`,

paymentMode:item.CopyType

}));

setReceiptData(mapped);

setShowPreview(true);

}catch(err){

console.error("API ERROR",err);

}finally{

setPrinting(false);

}

};

const handlePrint = async ()=>{

setPrinting(true);

try{

const element = reportRef.current;

const canvas = await html2canvas(element,{
scale:3,
useCORS:true,
backgroundColor:"#ffffff"
});

const imgData = canvas.toDataURL("image/png");

const pdf = new jsPDF("p","mm","a4");

const imgWidth = 210;
const pageHeight = 297;

const imgHeight = canvas.height * imgWidth / canvas.width;

let heightLeft = imgHeight;
let position = 0;

pdf.addImage(imgData,"PNG",0,position,imgWidth,imgHeight);
heightLeft -= pageHeight;

while(heightLeft >= 0){

position = heightLeft - imgHeight;

pdf.addPage();

pdf.addImage(imgData,"PNG",0,position,imgWidth,imgHeight);

heightLeft -= pageHeight;

}

window.open(pdf.output("bloburl"),"_blank");

}catch(err){

console.error("Print Error:",err);

}finally{

setPrinting(false);

}

};

if(showPreview){

return(

<Box sx={{minHeight:"100vh",p:3,display:"flex",flexDirection:"column",alignItems:"center"}}>

<Stack direction="row" spacing={2} sx={{mb:3}}>

<Button
variant="contained"
onClick={handlePrint}
disabled={printing}
>
{printing ? "Generating PDF..." : "Confirm & Print"}
</Button>

<Button
variant="contained"
color="error"
onClick={()=>setShowPreview(false)}
>
Back to Form
</Button>

</Stack>

<Paper elevation={10} sx={{width:"210mm",bgcolor:"white"}}>

<ReceiptPrint
ref={reportRef}
data={receiptData}
/>

</Paper>

</Box>

);

}

return(

<Box
sx={{
minHeight:"100vh",
background:"linear-gradient(135deg,#f5f7fa 0%,#e4e8ee 100%)",
display:"flex",
justifyContent:"center",
pt:2
}}
>

<Box>

<Typography variant="h6" fontWeight="700" textAlign="center" mb={2}>
Receipt
</Typography>

<Paper elevation={6} sx={{width:540,p:"30px 36px",borderRadius:"12px",mb:2}}>

<Stack spacing={2}>

<Box display="flex" alignItems="center">
<Typography sx={{width:140,fontWeight:600}}>
Start No :
</Typography>
<TextField
size="small"
fullWidth
value={startNo}
onChange={(e)=>setStartNo(e.target.value)}
/>
</Box>

<Box display="flex" alignItems="center">
<Typography sx={{width:140,fontWeight:600}}>
End No :
</Typography>
<TextField
size="small"
fullWidth
value={endNo}
onChange={(e)=>setEndNo(e.target.value)}
/>
</Box>

<FormControlLabel
control={
<Checkbox
checked={allRequired}
onChange={(e)=>setAllRequired(e.target.checked)}
/>
}
label={<Typography fontWeight={600}>All Challans are Required</Typography>}
/>

</Stack>

</Paper>

<Typography variant="h6" fontWeight="700" textAlign="center" mb={1}>
First Copy of Receipt
</Typography>

<Paper elevation={6} sx={{width:540,p:"26px 36px",borderRadius:"12px"}}>

<RadioGroup
value={receiptPart}
onChange={(e)=>setReceiptPart(e.target.value)}
>

<FormControlLabel
value="first"
control={<Radio/>}
label={<Typography fontWeight={600}>First Part</Typography>}
/>

<FormControlLabel
value="second"
control={<Radio/>}
label={<Typography fontWeight={600}>Second Part</Typography>}
/>

</RadioGroup>

</Paper>

<Box display="flex" gap={2} mt={2}>

<Button
fullWidth
variant="contained"
onClick={fetchReceipt}
sx={{py:1.2,bgcolor:"#2563eb"}}
>
{printing ? <CircularProgress size={24}/> : "Preview Report"}
</Button>

<Button
fullWidth
variant="outlined"
color="error"
onClick={()=>navigate(-1)}
>
Close
</Button>

</Box>

</Box>

</Box>

);

}

export default Receipt;