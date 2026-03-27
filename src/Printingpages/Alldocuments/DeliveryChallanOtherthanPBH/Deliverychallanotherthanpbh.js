// import React, { useState, useRef } from "react";
// import { Box, Paper, Typography, TextField, Checkbox, FormControlLabel, Button, Divider } from "@mui/material";
// import html2canvas from "html2canvas";
// import jsPDF from "jspdf";
// import DeliveryChallanPrint from "./DeliverychallanPrint";

// function DeliveryChallanOtherThanPBH() {
//   const [startNo, setStartNo] = useState("");
//   const [endNo, setEndNo] = useState("");
//   const [allRequired, setAllRequired] = useState(false);
//   const [printing, setPrinting] = useState(false);
//   const [showPreview, setShowPreview] = useState(false);
//   const reportRef = useRef();

//   // Mock data to match your screenshot layout
//   const mockData = {
//     rows: [
//       { id: "P 5440", class: "School L.", name: "Model Essays, Grammer & Communication Skill", qty: 2, rate: "45.00" },
//       { id: "P 6348", class: "School L.", name: "सुबोध हिंदी लेखन", qty: 14, rate: "50.00" },
//       { id: "P 6425", class: "Std. XI", name: "Basic Electricity & Semiconductor Devices", qty: 2, rate: "120.00" },
//     ]
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
//       <Box sx={{ minHeight: "100vh", py: 4, bgcolor: "#525659" }}>
//         <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, mb: 3 }}>
//           <Button variant="contained" onClick={handlePrint} disabled={printing} sx={{ bgcolor: '#1976d2' }}>
//             {printing ? "Generating..." : "Confirm & Download"}
//           </Button>
//           <Button variant="contained" color="error" onClick={() => setShowPreview(false)}>Go Back</Button>
//         </Box>
//         <DeliveryChallanPrint ref={reportRef} data={mockData} isPrinting={printing} />
//       </Box>
//     );
//   }

//   return (
//     <Box sx={{ minHeight: "100vh", bgcolor: "#f5f7fa", display: "flex", justifyContent: "center", pt: 8 }}>
//       <Box>
//         <Typography variant="h6" fontWeight="700" textAlign="center" mb={4}>Delivery Challan Other Than PBH</Typography>
//         <Paper elevation={6} sx={{ width: 520, p: 4, borderRadius: 3 }}>
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
//           <Button variant="contained" color="error" size="large">Close</Button>
//         </Box>
//       </Box>
//     </Box>
//   );
// }

// export default DeliveryChallanOtherThanPBH;






import React, { useState, useRef } from "react";
import { Box, Paper, Typography, TextField, Checkbox, FormControlLabel, Button, Divider } from "@mui/material";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import DeliveryChallanPrint from "./DeliverychallanPrint";
import axios from "axios";

function DeliveryChallanOtherThanPBH() {

  const [startNo, setStartNo] = useState("");
  const [endNo, setEndNo] = useState("");
  const [allRequired, setAllRequired] = useState(false);

  const [rows, setRows] = useState([]);

  const [printing, setPrinting] = useState(false);
  const [showPreview, setShowPreview] = useState(false);

  const reportRef = useRef();

  /* ===============================
     FETCH API
  =============================== */

  const fetchChallan = async () => {

    try{

      const response = await axios.get(
        "https://publication.microtechsolutions.net.in/php/get/getDeliveryChallanOtherThanPBH.php",
        {
          params:{
            startNumber:startNo,
            endNumber:endNo,
            allChallansRequired:allRequired
          }
        }
      );

      const apiRows = response.data?.data || [];

      /* MAP API DATA */

      const mappedRows = apiRows.map((item,index)=>({

        id:`P ${item.Code}`,
        class:item.Class,
        name:item.Description,
        qty:item.Qty,
        rate:item.Rate

      }));

      setRows(mappedRows);

      setShowPreview(true);

    }catch(err){

      console.error("API ERROR:",err);

    }

  };

  /* ===============================
     PRINT PDF
  =============================== */

  const handlePrint = async () => {

    setPrinting(true);

    setTimeout(async () => {

      try {

        const element = reportRef.current;

        const canvas = await html2canvas(element,{
          scale:2,
          useCORS:true,
          backgroundColor:"#ffffff"
        });

        const imgData = canvas.toDataURL("image/png");

        const pdf = new jsPDF("p","mm","a4");

        pdf.addImage(imgData,"PNG",0,0,210,297);

        window.open(pdf.output("bloburl"),"_blank");

      } catch (error) {

        console.error("PDF Error:",error);

      } finally {

        setPrinting(false);

      }

    },150);

  };

  const data = { rows };

  if(showPreview){

    return(

      <Box sx={{ minHeight:"100vh", py:4, bgcolor:"#525659" }}>

        <Box sx={{ display:'flex', justifyContent:'center', gap:2, mb:3 }}>

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

        <DeliveryChallanPrint
          ref={reportRef}
          data={data}
          isPrinting={printing}
        />

      </Box>

    );

  }

  return (

    <Box sx={{ minHeight:"100vh", bgcolor:"#f5f7fa", display:"flex", justifyContent:"center", pt:8 }}>

      <Box>

        <Typography variant="h6" fontWeight="700" textAlign="center" mb={4}>
          Delivery Challan Other Than PBH
        </Typography>

        <Paper elevation={6} sx={{ width:520, p:4, borderRadius:3 }}>

          <Box display="flex" alignItems="center" mb={3}>
            <Typography sx={{ width:130, fontWeight:600 }}>
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
            <Typography sx={{ width:130, fontWeight:600 }}>
              End No :
            </Typography>

            <TextField
              size="small"
              fullWidth
              value={endNo}
              onChange={(e)=>setEndNo(e.target.value)}
            />
          </Box>

          <Divider sx={{ my:2 }} />

          <FormControlLabel
            control={
              <Checkbox
                checked={allRequired}
                onChange={(e)=>setAllRequired(e.target.checked)}
              />
            }
            label={<Typography fontWeight={600}>All Challans are Required</Typography>}
          />

        </Paper>

        <Box display="flex" justifyContent="center" gap={3} mt={4}>

          <Button
            variant="contained"
            size="large"
            onClick={fetchChallan}
          >
            Print Report
          </Button>

          <Button
            variant="contained"
            color="error"
            size="large"
          >
            Close
          </Button>

        </Box>

      </Box>

    </Box>

  );

}

export default DeliveryChallanOtherThanPBH;