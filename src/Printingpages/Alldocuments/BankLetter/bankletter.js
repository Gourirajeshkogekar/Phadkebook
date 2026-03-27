// import React, { useState, useRef } from "react";
// import { useNavigate } from "react-router-dom";
// import {
//   Box,
//   Paper,
//   Typography,
//   TextField,
//   Checkbox,
//   FormControlLabel,
//   Button,
//   Stack,
//   Divider
// } from "@mui/material";
// import html2canvas from "html2canvas";
// import jsPDF from "jspdf";
// import BankletterPrint from "./BankletterPrint";

// function BankLetter() {
//   const [startNo, setStartNo] = useState("");
//   const [endNo, setEndNo] = useState("");
//   const [allRequired, setAllRequired] = useState(false);
//   const [printing, setPrinting] = useState(false);
//   const [showPreview, setShowPreview] = useState(false);

//   const reportRef = useRef();
//   const navigate = useNavigate();

//   const handlePrint = async () => {
//   setPrinting(true);
//   try {
//     const element = reportRef.current;
//     if (!element) return;

//     const canvas = await html2canvas(element, {
//       scale: 2, // 3 might be too heavy for some browsers, 2 is usually enough
//       useCORS: true,
//       logging: false,
//       backgroundColor: "#ffffff",
//     });

//     const imgData = canvas.toDataURL("image/png");
    
//     // Calculate PDF page size
//     const pdf = new jsPDF("p", "mm", "a4");
//     const imgProps = pdf.getImageProperties(imgData);
//     const pdfWidth = pdf.internal.pageSize.getWidth();
//     const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

//     pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
//           window.open(pdf.output("bloburl"), "_blank");

//     // Instead of window.open (which pop-up blockers stop), use save:
//     // pdf.save("Bank-Letter.pdf"); 

//   } catch (error) {
//     console.error("Print Error:", error);
//   } finally {
//     setPrinting(false);
//   }
// };

//   const handleClose = () => {
//     navigate(-1);
//   };

//   // THIS SECTION SHOWS THE FULL PAGE REPORT
//   if (showPreview) {
//     return (
//       <Box sx={{ bgcolor: "#525659", minHeight: "100vh", p: 3, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
//         <Stack direction="row" spacing={2} sx={{ mb: 3, position: 'sticky', top: 0, zIndex: 10 }}>
//           <Button variant="contained" onClick={handlePrint} disabled={printing} sx={{ bgcolor: '#1a73e8' }}>
//             {printing ? "Generating PDF..." : "Confirm & Download PDF"}
//           </Button>
//           <Button variant="contained" color="error" onClick={() => setShowPreview(false)}>
//             Back to Edit
//           </Button>
//         </Stack>

//         {/* This Paper simulates the A4 page at 100% resolution */}
//         <Paper elevation={10} sx={{ width: "210mm", bgcolor: 'white', overflow: 'hidden' }}>
//           <BankletterPrint ref={reportRef} />
//         </Paper>
//       </Box>
//     );
//   }

//   // THIS SECTION SHOWS THE INPUT FORM
//   return (
//     <Box sx={{ minHeight: "100vh", background: "linear-gradient(135deg, #f5f7fa 0%, #e4e8ee 100%)", display: "flex", justifyContent: "center", pt: "60px" }}>
//       <Box>
//         <Typography variant="h5" fontWeight="700" textAlign="center" mb={4}>
//           Bank Letter
//         </Typography>

//         <Paper elevation={6} sx={{ width: 520, padding: "32px 36px", borderRadius: "12px" }}>
//           <Box display="flex" alignItems="center" mb={3}>
//             <Typography sx={{ width: 130, fontWeight: 600 }}>Start No :</Typography>
//             <TextField size="small" fullWidth value={startNo} onChange={(e) => setStartNo(e.target.value)} />
//           </Box>

//           <Box display="flex" alignItems="center" mb={3}>
//             <Typography sx={{ width: 130, fontWeight: 600 }}>End No :</Typography>
//             <TextField size="small" fullWidth value={endNo} onChange={(e) => setEndNo(e.target.value)} />
//           </Box>

//           <Divider sx={{ my: 2 }} />

//           <FormControlLabel
//             control={<Checkbox checked={allRequired} onChange={(e) => setAllRequired(e.target.checked)} />}
//             label={<Typography fontWeight={600} fontSize="14px">All Challans are Required</Typography>}
//           />
//         </Paper>

//         <Box display="flex" justifyContent="center" gap={3} mt={4}>
//           <Button
//             variant="contained"
//             size="large"
//             onClick={() => setShowPreview(true)} // FIXED: Now shows the preview first
//             sx={{ px: 5, py: 1.2, borderRadius: "8px", fontWeight: 600, background: "linear-gradient(135deg, #1e88e5, #1565c0)" }}
//           >
//             Print Report
//           </Button>

//           <Button variant="contained" size="large" color="error" onClick={handleClose} sx={{ px: 5, py: 1.2, borderRadius: "8px" }}>
//             Close
//           </Button>
//         </Box>
//       </Box>
//     </Box>
//   );
// }

// export default BankLetter;




import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
Box,
Paper,
Typography,
TextField,
Checkbox,
FormControlLabel,
Button,
Stack,
Divider
} from "@mui/material";

import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import axios from "axios";
import BankletterPrint from "./BankletterPrint";

function BankLetter(){

const [startNo,setStartNo] = useState("");
const [endNo,setEndNo] = useState("");
const [allRequired,setAllRequired] = useState(false);

const [showPreview,setShowPreview] = useState(false);
const [printing,setPrinting] = useState(false);

const [letterData,setLetterData] = useState(null);

const reportRef = useRef();
const navigate = useNavigate();


/* =========================
   FETCH API
========================= */

const fetchLetter = async () => {

try{

const res = await axios.get(
"https://publication.microtechsolutions.net.in/php/get/getBankLetter.php",
{
params:{
startNumber:startNo,
endNumber:endNo,
allChallansRequired:allRequired
}
}
);

const api = res.data;

const rows = api.data.map((r)=>({
invoiceNo:r.InvoiceNo,
date:r.InvoiceDate,
amount:r.FormattedAmount,
receipt:r.ReceiptRef
}));

setLetterData({
companyName:api.printLetter.companyName,
companyAddress:api.printLetter.companyAddress,
purpose:api.printLetter.purpose,
bankLocation:api.printLetter.bankLocation,
partyName:api.printLetter.drawnOn,
signature:api.printLetter.signature,
grandTotal:api.grandTotal,
rows
});

setShowPreview(true);

}catch(err){

console.log("API ERROR:",err);

}

};


/* =========================
   PRINT FUNCTION
========================= */

const handlePrint = async () => {

setPrinting(true);

try{

const element = reportRef.current;

const canvas = await html2canvas(element,{
scale:2,
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

while(heightLeft > 0){

position = heightLeft - imgHeight;

pdf.addPage();

pdf.addImage(imgData,"PNG",0,position,imgWidth,imgHeight);

heightLeft -= pageHeight;

}

/* OPEN IN NEW TAB */

window.open(pdf.output("bloburl"),"_blank");

}catch(err){

console.log("Print Error:",err);

}finally{

setPrinting(false);

}

};


const handleClose = ()=>navigate(-1);


/* =========================
   PREVIEW PAGE
========================= */

if(showPreview){

return(

<Box
sx={{
bgcolor:"#525659",
minHeight:"100vh",
p:3,
display:"flex",
flexDirection:"column",
alignItems:"center"
}}
>

<Stack direction="row" spacing={2} sx={{mb:3}}>

<Button
variant="contained"
onClick={handlePrint}
disabled={printing}
>
{printing ? "Generating..." : "Confirm & Download PDF"}
</Button>

<Button
variant="contained"
color="error"
onClick={()=>setShowPreview(false)}
>
Back
</Button>

</Stack>

<Paper elevation={10} sx={{width:"210mm",bgcolor:"white"}}>

<BankletterPrint
ref={reportRef}
data={letterData}
/>

</Paper>

</Box>

)

}


/* =========================
   FORM PAGE
========================= */

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

<Typography variant="h5" fontWeight="700" textAlign="center" mb={4}>
Bank Letter
</Typography>

<Paper elevation={6} sx={{width:520,p:"32px 36px"}}>

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
onClick={fetchLetter}
>
Preview Report
</Button>

<Button
variant="contained"
size="large"
color="error"
onClick={handleClose}
>
Close
</Button>

</Box>

</Box>

</Box>

)

}

export default BankLetter