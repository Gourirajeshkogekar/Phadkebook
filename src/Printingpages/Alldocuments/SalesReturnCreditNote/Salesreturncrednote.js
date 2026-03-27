// import React, { useState, useRef } from "react";
// import {
//   Box, Paper, Typography, TextField, Checkbox,
//   FormControlLabel, Button, Divider
// } from "@mui/material";
// import html2canvas from "html2canvas";
// import jsPDF from "jspdf";
// import SalesReturnCreditNotePrint from "./SalesreturncreditnotePrint";

// function SalesReturnCreditNote() {
//   const [startNo, setStartNo] = useState("");
//   const [endNo, setEndNo] = useState("");
//   const [allRequired, setAllRequired] = useState(false);
//   const [showPreview, setShowPreview] = useState(false);
//   const [printing, setPrinting] = useState(false);
//   const reportRef = useRef();

//   // Data to pass to the print component
//   const reportData = {
//     startNo,
//     endNo,
//     allRequired,
//   };

//   // This function now handles the actual PDF generation FROM the preview screen
//   const generatePDF = async () => {
//     setPrinting(true);
//     try {
//       const element = reportRef.current;
//       const canvas = await html2canvas(element, { scale: 2, useCORS: true });
//       const imgData = canvas.toDataURL("image/png");
//       const pdf = new jsPDF("p", "mm", "a4");
//       pdf.addImage(imgData, "PNG", 0, 0, 210, 297);
//       window.open(pdf.output("bloburl"), "_blank");
//     } catch (error) {
//       console.error("PDF Error:", error);
//     } finally {
//       setPrinting(false);
//     }
//   };

//   // PREVIEW SCREEN
//   if (showPreview) {
//     return (
//       <Box sx={{ minHeight: "100vh", py: 4, bgcolor: "#525659" }}>
//         <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, mb: 3 }}>
//           <Button 
//             variant="contained" 
//             onClick={generatePDF} // Triggers the PDF download
//             disabled={printing}
//           >
//             {printing ? "Generating PDF..." : "Confirm & Download"}
//           </Button>
//           <Button 
//             variant="contained" 
//             color="error" 
//             onClick={() => setShowPreview(false)}
//           >
//             Go Back
//           </Button>
//         </Box>
        
//         {/* The component being captured for PDF */}
//         <Box ref={reportRef}>
//           <SalesReturnCreditNotePrint data={reportData} />
//         </Box>
//       </Box>
//     );
//   }

//   const handleClose = () => {
//     setStartNo("");
//     setEndNo("");
//     setAllRequired(false);
//   };

//   return (
//     <Box sx={{ minHeight: "100vh", background: "linear-gradient(135deg, #f5f7fa 0%, #e4e8ee 100%)", display: "flex", justifyContent: "center", paddingTop: "60px" }}>
//       <Box>
//         <Typography variant="h6" fontWeight="700" textAlign="center" mb={4}>
//           Sales Return Credit Note
//         </Typography>

//         <Paper elevation={6} sx={{ width: 520, padding: "32px 36px", borderRadius: "12px" }}>
//           <Box display="flex" alignItems="center" mb={3}>
//             <Typography sx={{ width: 140, fontWeight: 600 }}>Start No :</Typography>
//             <TextField size="small" fullWidth value={startNo} onChange={(e) => setStartNo(e.target.value)} />
//           </Box>

//           <Box display="flex" alignItems="center" mb={3}>
//             <Typography sx={{ width: 140, fontWeight: 600 }}>End No :</Typography>
//             <TextField size="small" fullWidth value={endNo} onChange={(e) => setEndNo(e.target.value)} />
//           </Box>

//           <Divider sx={{ my: 2 }} />

//           <FormControlLabel
//             control={<Checkbox checked={allRequired} onChange={(e) => setAllRequired(e.target.checked)} />}
//             label={<Typography fontWeight={600}>All Challans are Required</Typography>}
//           />
//         </Paper>

//         <Box display="flex" justifyContent="center" gap={3} mt={4}>
//           <Button
//             variant="contained"
//             size="large"
//             sx={{ px: 5 }}
//             onClick={() => setShowPreview(true)} // Toggles the preview screen
//           >
//             Print Report
//           </Button>

//           <Button variant="contained" color="error" size="large" sx={{ px: 5 }} onClick={handleClose}>
//             Close
//           </Button>
//         </Box>
//       </Box>
//     </Box>
//   );
// }

// export default SalesReturnCreditNote;







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
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import SalesReturnCreditNotePrint from "./SalesreturncreditnotePrint";

function SalesReturnCreditNote(){

const [startNo,setStartNo] = useState("");
const [endNo,setEndNo] = useState("");
const [allRequired,setAllRequired] = useState(false);

const [showPreview,setShowPreview] = useState(false);
const [printing,setPrinting] = useState(false);

const [rows,setRows] = useState([]);

const reportRef = useRef();

const fetchData = async ()=>{

try{

const res = await axios.get(
"https://publication.microtechsolutions.net.in/php/get/getSalesReturnCreditNote.php",
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
alert("No Credit Note found in this range");
return;
}

setRows(api.data);

setShowPreview(true);

}catch(err){

console.log(err);

}

};

const generatePDF = async ()=>{

setPrinting(true);

try{

const element = reportRef.current;

const canvas = await html2canvas(element,{scale:2});

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
onClick={generatePDF}
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

<Box ref={reportRef}>
<SalesReturnCreditNotePrint rows={rows}/>
</Box>

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
Sales Return Credit Note
</Typography>

<Paper elevation={6} sx={{width:520,p:"32px 36px"}}>

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
onClick={fetchData}
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

export default SalesReturnCreditNote;