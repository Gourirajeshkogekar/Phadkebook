// import React, { useState, useRef } from "react";
// import {
//   Box,
//   Paper,
//   Typography,
//   TextField,
//   Checkbox,
//   FormControlLabel,
//   Button,
//   Divider
// } from "@mui/material";
// import InvoiceotherthanPBHPrint from "./InvoiceotherthanPBHPrint";
// import jsPDF from "jspdf";
// import html2canvas from "html2canvas";

// function InvoiceOtherThanPBH() {
//   const [startNo, setStartNo] = useState("");
//   const [endNo, setEndNo] = useState("");
//   const [allRequired, setAllRequired] = useState(false);
//   const [printBill, setPrintBill] = useState(false);
//   const [printing, setPrinting] = useState(false);
//   const [showPreview, setShowPreview] = useState(false);
//   const reportRef = useRef();

//   // ✅ Define mockData here so it is accessible to the component
//   const mockData = {
//     startNo: startNo,
//     rows: [
//       { code: "P 6217", cls: "2nd Year", name: "पर्यावरण अभ्यास", qty: 6, rate: 200.00, disc: 30 },
//       { code: "P 6360", cls: "B. Sc. I", name: "Zoology P.I -DSC 15 A- Sem.I", qty: 2, rate: 60.00, disc: 30 },
//       { code: "P 6365", cls: "B. Sc. I", name: "Zoology P.II -DSC 16 A- Sem.I", qty: 1, rate: 70.00, disc: 30 },
//       { code: "P 6376", cls: "B. Sc. I", name: "Mathematics Paper I -DSC-A5- Calculus- Semester I", qty: 1, rate: 80.00, disc: 30 },
//     ]
//   };

//   const handleClose = () => {
//     setStartNo("");
//     setEndNo("");
//     setAllRequired(false);
//     setPrintBill(false);
//   };

//   const handlePrint = async () => {
//     setPrinting(true);
//     setTimeout(async () => {
//       try {
//         const element = reportRef.current;
//         if (!element) return;
//         const canvas = await html2canvas(element, { scale: 2, useCORS: true, backgroundColor: "#ffffff" });
//         const imgData = canvas.toDataURL("image/png");
//         const pdf = new jsPDF("p", "mm", "a4");
//         pdf.addImage(imgData, "PNG", 0, 0, 210, 297);
//         window.open(pdf.output("bloburl"), "_blank");
//       } catch (error) {
//         console.error("PDF Generation Error:", error);
//       } finally {
//         setPrinting(false);
//       }
//     }, 150);
//   };

//   if (showPreview) {
//     return (
//       <Box sx={{ minHeight: "100vh", py: 4,  bgcolor: "#525659" }}>
//         <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, mb: 3 }}>
//           <Button variant="contained" onClick={handlePrint} disabled={printing}>
//             {printing ? "Generating PDF..." : "Confirm & Download"}
//           </Button>
//           <Button variant="contained" color="error" onClick={() => setShowPreview(false)}>Go Back</Button>
//         </Box>
//         {/* ✅ Pass mockData here */}
//         <InvoiceotherthanPBHPrint ref={reportRef} data={mockData} isPrinting={printing} />
//       </Box>
//     );
//   }

//   return (
//     <Box sx={{ minHeight: "100vh", background: "linear-gradient(135deg, #f5f7fa 0%, #e4e8ee 100%)", display: "flex", justifyContent: "center", paddingTop: "60px" }}>
//       <Box>
//         <Typography variant="h6" fontWeight="700" textAlign="center" mb={4}>
//           Invoice Challan Other Than PBH
//         </Typography>

//         <Paper elevation={6} sx={{ width: 540, padding: "32px 36px", borderRadius: "12px" }}>
//           <Box display="flex" alignItems="center" mb={3}>
//             <Typography sx={{ width: 140, fontWeight: 600 }}>Start No :</Typography>
//             <TextField size="small" fullWidth value={startNo} onChange={(e) => setStartNo(e.target.value)} />
//           </Box>
//           <Box display="flex" alignItems="center" mb={3}>
//             <Typography sx={{ width: 140, fontWeight: 600 }}>End No :</Typography>
//             <TextField size="small" fullWidth value={endNo} onChange={(e) => setEndNo(e.target.value)} />
//           </Box>
//           <Divider sx={{ my: 2 }} />
//           <FormControlLabel control={<Checkbox checked={allRequired} onChange={(e) => setAllRequired(e.target.checked)} />} label={<Typography fontWeight={600}>All Challans are Required</Typography>} />
//           <FormControlLabel control={<Checkbox checked={printBill} onChange={(e) => setPrintBill(e.target.checked)} />} label={<Typography fontWeight={600}>Print Canvassor’s Bill</Typography>} />
//         </Paper>

//         <Box display="flex" justifyContent="center" gap={3} mt={4}>
//           <Button variant="contained" size="large" sx={{ px: 5 }} onClick={() => setShowPreview(true)}>
//             Print Preview
//           </Button>
//           <Button variant="contained" color="error" size="large" sx={{ px: 5 }} onClick={handleClose}>
//             Close
//           </Button>
//         </Box>
//       </Box>
//     </Box>
//   );
// }

// export default InvoiceOtherThanPBH;



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
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import InvoiceotherthanPBHPrint from "./InvoiceotherthanPBHPrint";

function InvoiceOtherThanPBH(){

const [startNo,setStartNo] = useState("");
const [endNo,setEndNo] = useState("");
const [allRequired,setAllRequired] = useState(false);
const [printBill,setPrintBill] = useState(false);

const [showPreview,setShowPreview] = useState(false);
const [printing,setPrinting] = useState(false);

const [printData,setPrintData] = useState(null);

const reportRef = useRef();

const fetchData = async ()=>{

try{

const res = await axios.get(
"https://publication.microtechsolutions.net.in/php/get/getInvoiceChallanOtherThanPBH.php",
{
params:{
startNumber:startNo,
endNumber:endNo,
allChallansRequired:allRequired ? 1 : 0,
printCanvassorsBill:printBill ? 1 : 0
}
}
);

const api = res.data;

if(api.status !== "success" || api.data.length === 0){
alert("No data found");
return;
}

/* MAP API DATA */

const rows = api.data.map(r=>({

code:r["Book Code"],

cls:r["Class"],

name:r["Description"],

qty:parseFloat(r["Qty"]),

rate:parseFloat(r["Rate"]),

disc:0,

amount:parseFloat(r["Amount"])

}));

setPrintData({
startNo,
rows
});

setShowPreview(true);

}catch(err){

console.log(err);

}

};

const handlePrint = async ()=>{

setPrinting(true);

try{

const element = reportRef.current;

const canvas = await html2canvas(element,{
scale:3
});

const imgData = canvas.toDataURL("image/png");

const pdf = new jsPDF("p","mm","a4");

const imgWidth = 210;
const imgHeight = canvas.height * imgWidth / canvas.width;

pdf.addImage(imgData,"PNG",0,0,imgWidth,imgHeight);

window.open(pdf.output("bloburl"),"_blank");

}catch(err){

console.log(err);

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

<InvoiceotherthanPBHPrint
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
background:"linear-gradient(135deg,#f5f7fa,#e4e8ee)",
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
Invoice Challan Other Than PBH
</Typography>

<Paper elevation={6} sx={{width:540,p:"32px 36px"}}>

<Box display="flex" alignItems="center" mb={3}>

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

<Box display="flex" alignItems="center" mb={3}>

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

<Divider sx={{my:2}}/>

<FormControlLabel
control={
<Checkbox
checked={allRequired}
onChange={(e)=>setAllRequired(e.target.checked)}
/>
}
label="All Challans are Required"
/>

<FormControlLabel
control={
<Checkbox
checked={printBill}
onChange={(e)=>setPrintBill(e.target.checked)}
/>
}
label="Print Canvassor’s Bill"
/>

</Paper>

<Box display="flex" justifyContent="center" gap={3} mt={4}>

<Button
variant="contained"
size="large"
onClick={fetchData}
>
Print Preview
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

export default InvoiceOtherThanPBH;