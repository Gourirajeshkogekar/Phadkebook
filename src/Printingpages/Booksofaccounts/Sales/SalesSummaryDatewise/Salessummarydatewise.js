// import React, { useState , useRef, useEffect} from "react";
// import {
//   Box,
//   Paper,
//   Typography,
//   TextField,
//   Checkbox,
//   FormControlLabel,
//   Radio,
//   RadioGroup,
//   Select,
//   MenuItem,
//   Button,
//   Grid, CircularProgress
// } from "@mui/material";
// import axios from "axios";
// import PrintIcon from "@mui/icons-material/Print";
// import CloseIcon from "@mui/icons-material/Close";
// import DateRangeIcon from "@mui/icons-material/DateRange";
// import PeopleIcon from "@mui/icons-material/People";

// import { useNavigate } from "react-router-dom";
// import html2canvas from "html2canvas";
// import {Autocomplete} from "@mui/material";

// import jsPDF from "jspdf";
// import SalessummarydatewisePrint from "./SalessummarydatewisePrint"

// export default function SalesSummaryDatewise() {
//   const navigate = useNavigate();

//   const [startDate, setStartDate] = useState("2026-04-01");
//   const [endDate, setEndDate] = useState("2026-03-31");
//   const [showSummary, setShowSummary] = useState("no");
//   const [excelOutput, setExcelOutput] = useState(false);
//   const [salesToCanvassor, setSalesToCanvassor] = useState(false);
// const [partyList, setPartyList] = useState([]);
// const [party, setParty] = useState("");
//  const [loading, setLoading] = useState(true);
 

//  useEffect(() => {
//    const fetchAccounts = async () => {
//      try {
//        setLoading(true); // Ensure loading starts when the request begins
//        const res = await axios.get(
//          "https://publication.microtechsolutions.net.in/php/Accountget.php"
//        );
       
//        // Axios returns the JSON inside res.data
//        // Based on your JSON sample, res.data is the array directly
//        setPartyList(res.data || []);
//      } catch (err) {
//        console.error("Error fetching accounts:", err);
//        setPartyList([]); // Clear list on error
//      } finally {
//        setLoading(false); // THIS IS THE MISSING PIECE: It unlocks the dropdown
//      }
//    };
 
//    fetchAccounts();
//  }, []);

//    const reportRef = useRef(null);
//           const [printing, setPrinting] = useState(false);
//        const handlePrint = async () => {
//            setPrinting(true);
//            // Give the DOM a moment to ensure the hidden report is ready
//            setTimeout(async () => {
//              try {
//                const element = reportRef.current;
//                if (!element) return;
       
//                // Capture the element as a canvas
//                const canvas = await html2canvas(element, { 
//                  scale: 2, 
//                  useCORS: true,
//                  logging: false 
//                });
       
//                const imgData = canvas.toDataURL("image/png");
//                const pdf = new jsPDF("p", "mm", "a4");
               
//                // Add image to PDF (A4 size is 210mm x 297mm)
//                pdf.addImage(imgData, "PNG", 0, 0, 210, 297);
               
//                // Open the PDF in a new Chrome tab
//                window.open(pdf.output("bloburl"), "_blank");
//              } catch (error) {
//                console.error("PDF Error:", error);
//              } finally {
//                setPrinting(false);
//              }
//            }, 500); // 500ms is safer for rendering complex reports
//          };

//   const handleClose = () => navigate(-1);

//   return (
//     <Box
//       sx={{
//         minHeight: "100vh",
//         background: "linear-gradient(135deg,#eef2f7,#e3e8f0)",
//         display: "flex",
//         justifyContent: "center",
//         pt: 1
//       }}
//     >
//       <Box width={680}>

 
//         <Typography
//           variant="h5"
//           fontWeight={600}
//           textAlign="center"
         
//         >
//           Sales Summary Datewise
//         </Typography>

 
//         <Paper elevation={4} sx={{ p: 2, mb: 1, borderRadius: 1 }}>
//           <Box display="flex" alignItems="center" gap={1} mb={1}>
//             <DateRangeIcon fontSize="small" color="primary" />
//             <Typography fontWeight={600} fontSize={15}>
//               Period
//             </Typography>
//           </Box>

//           <Grid container spacing={2}>
//             <Grid item xs={6}>
//               <TextField
//                 label="Start Date"
//                 type="date"
//                 size="small"
//                 fullWidth
//                 InputLabelProps={{ shrink: true }}
//                 value={startDate}
//                 onChange={e => setStartDate(e.target.value)}
//               />
//             </Grid>

//             <Grid item xs={6}>
//               <TextField
//                 label="End Date"
//                 type="date"
//                 size="small"
//                 fullWidth
//                 InputLabelProps={{ shrink: true }}
//                 value={endDate}
//                 onChange={e => setEndDate(e.target.value)}
//               />
//             </Grid>
//           </Grid>

//           <FormControlLabel
//             sx={{ mt: 1 }}
//             control={
//               <Checkbox
//                 size="small"
//                 checked={excelOutput}
//                 onChange={e => setExcelOutput(e.target.checked)}
//               />
//             }
//             label={<Typography fontSize={14}>Excel Output?</Typography>}
//           />
//         </Paper>

 
//         <Paper elevation={4} sx={{ p: 1, mb: 1, borderRadius: 2.5 }}>
//           <Typography fontWeight={600} fontSize={15} mb={0.5}>
//             Show Summary ?
//           </Typography>

//           <RadioGroup
//             row
//             value={showSummary}
//             onChange={e => setShowSummary(e.target.value)}
//           >
//             <FormControlLabel
//               value="yes"
//               control={<Radio size="small" />}
//               label="Yes"
//             />
//             <FormControlLabel
//               value="no"
//               control={<Radio size="small" />}
//               label="No"
//             />
//           </RadioGroup>
//         </Paper>

 
//         <Paper elevation={4} sx={{ p: 2, mb: 2, borderRadius: 2.5 }}>
//           <FormControlLabel
//             control={
//               <Checkbox
//                 size="small"
//                 checked={salesToCanvassor}
//                 onChange={e => setSalesToCanvassor(e.target.checked)}
//               />
//             }
//             label={
//               <Typography fontSize={14}>
//                 Sales To Canvassors?
//               </Typography>
//             }
//           />
//         </Paper>

//         {/* ================= PARTY ================= */}

//         <Paper elevation={4} sx={{ p: 2, borderRadius: 2.5 }}>
//           <Box display="flex" alignItems="center" gap={1} mb={1}>
//             <PeopleIcon fontSize="small" color="primary" />
//             <Typography fontWeight={600} fontSize={15}>
//               Party
//             </Typography>
//           </Box>

//        <Autocomplete
//       id="party-autocomplete"
//       size="small"
//       fullWidth
//       options={partyList}
//       loading={loading}
//       // Use AccountName for display
//       getOptionLabel={(option) => option.AccountName || ""}
//       // Compare by ID to avoid selection issues
//       isOptionEqualToValue={(option, value) => option.Id === value?.Id}
//       value={party} 
//       onChange={(event, newValue) => {
//         setParty(newValue);
//       }}
//       renderInput={(params) => (
//         <TextField
//           {...params}
//            placeholder="Type to search..."
//           InputProps={{
//             ...params.InputProps,
//             endAdornment: (
//               <React.Fragment>
//                 {loading ? <CircularProgress color="inherit" size={20} /> : null}
//                 {params.InputProps.endAdornment}
//               </React.Fragment>
//             ),
//           }}
//         />
//       )}
//     />
//         </Paper>

//         {/* ================= BUTTONS ================= */}

//         <Box
//           display="flex"
//           justifyContent="center"
//           gap={3}
//           mt={3}
//         >
//           <Button
//             variant="contained"
//             size="medium"
//             startIcon={<PrintIcon />}
//             onClick={handlePrint}
//             sx={{
//               px: 4,
//               py: 1,
//               fontSize: 14,
//               fontWeight: 600,
//               borderRadius: 2,
//               minWidth: 160
//             }}
//           >
//             Print Report
//           </Button>

//           <Button
//             variant="contained"
//             color="error"
//             size="medium"
//             startIcon={<CloseIcon />}
//             onClick={handleClose}
//             sx={{
//               px: 4,
//               py: 1,
//               fontSize: 14,
//               fontWeight: 600,
//               borderRadius: 2,
//               minWidth: 130
//             }}
//           >
//             Close
//           </Button>
//         </Box>

//       </Box>

//          <Box sx={{ position: "absolute", top: "-10000px", left: "-10000px" }}>
//                       <div ref={reportRef}>
//                         <SalessummarydatewisePrint state={{ startDate, endDate }} />
//                       </div>
//                     </Box>
//     </Box>
//   );
// }




import React, { useState, useEffect } from "react";
import {
  Box,
  Paper,
  Typography,
  TextField,
  Checkbox,
  FormControlLabel,
  Radio,
  RadioGroup,
  Button,
  Grid,
  CircularProgress
} from "@mui/material";

import { Autocomplete } from "@mui/material";
import axios from "axios";

import PrintIcon from "@mui/icons-material/Print";
import CloseIcon from "@mui/icons-material/Close";
import DateRangeIcon from "@mui/icons-material/DateRange";
import PeopleIcon from "@mui/icons-material/People";

import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

import { useNavigate } from "react-router-dom";

export default function SalesSummaryDatewise() {

  const navigate = useNavigate();

  const [startDate, setStartDate] = useState("2025-04-01");
  const [endDate, setEndDate] = useState("2026-03-31");

  const [excelOutput, setExcelOutput] = useState(false);
  const [showSummary, setShowSummary] = useState("no");

  const [partyList, setPartyList] = useState([]);
  const [party, setParty] = useState(null);

  const [loading, setLoading] = useState(true);

  useEffect(() => {

    const fetchAccounts = async () => {

      try {

        const res = await axios.get(
          "https://publication.microtechsolutions.net.in/php/Accountget.php"
        );

        setPartyList(res.data || []);

      } catch (err) {

        console.error(err);

      } finally {

        setLoading(false);

      }

    };

    fetchAccounts();

  }, []);

  /* ================= PRINT REPORT ================= */

  const handlePrint = async () => {

    try {

      const response = await axios.get(
        "https://publication.microtechsolutions.net.in/php/get/getSalesSummaryDatewise.php",
        {
          params: {
            fromdate: startDate,
            todate: endDate,
            excelOutput: excelOutput ? "yes" : "no",
            showSummary: showSummary,
            party: party?.Id || ""
          }
        }
      );

      const rows = Array.isArray(response.data) ? response.data : [];

      /* ===== TOTALS ===== */

      const totalNet = rows.reduce((a,b)=>a+Number(b["Net Amount"]||0),0);
      const totalRound = rows.reduce((a,b)=>a+Number(b["Other Charges / Round Off"]||0),0);
      const totalCash = rows.reduce((a,b)=>a+Number(b["Cash"]||0),0);
      const totalCredit = rows.reduce((a,b)=>a+Number(b["Credit"]||0),0);

      /* ===== TABLE BODY ===== */

      const body = rows.map(r=>[
        r["Date"],
        r["Particulars"],
        Number(r["Net Amount"]||0).toLocaleString("en-IN",{minimumFractionDigits:2}),
        Number(r["Other Charges / Round Off"]||0).toLocaleString("en-IN",{minimumFractionDigits:2}),
        Number(r["Cash"]||0).toLocaleString("en-IN",{minimumFractionDigits:2}),
        Number(r["Credit"]||0).toLocaleString("en-IN",{minimumFractionDigits:2})
      ]);

      body.push([
        "",
        "Total",
        totalNet.toLocaleString("en-IN",{minimumFractionDigits:2}),
        totalRound.toLocaleString("en-IN",{minimumFractionDigits:2}),
        totalCash.toLocaleString("en-IN",{minimumFractionDigits:2}),
        totalCredit.toLocaleString("en-IN",{minimumFractionDigits:2})
      ]);

      const pdf = new jsPDF("p","mm","a4");

      const pageWidth = pdf.internal.pageSize.getWidth();

      autoTable(pdf,{
        startY:40,

        head:[[
          "Date",
          "Particulars",
          "Net Amount",
          "Other Charges / Round Off",
          "Cash",
          "Credit"
        ]],

        body,

        styles:{
          fontSize:9
        },

        columnStyles:{
          2:{halign:"right"},
          3:{halign:"right"},
          4:{halign:"right"},
          5:{halign:"right"}
        },

        didDrawPage:()=>{

          pdf.setFontSize(14);
          pdf.setFont("times","bold");

          pdf.text(
            "Phadke Prakashan, Kolhapur.",
            pageWidth/2,
            10,
            {align:"center"}
          );

          pdf.setFontSize(12);

          pdf.text(
            "Sales Register Summary",
            pageWidth/2,
            17,
            {align:"center"}
          );

          pdf.setFontSize(10);

          pdf.text(
            `From ${startDate} to ${endDate}`,
            pageWidth/2,
            23,
            {align:"center"}
          );

        }

      });

      window.open(pdf.output("bloburl"),"_blank");

    } catch(err){

      console.error("API Error:",err);

    }

  };

  const handleClose = () => navigate(-1);

  return (

    <Box sx={{
      minHeight:"100vh",
      background:"#eef2f7",
      display:"flex",
      justifyContent:"center",
      pt:1
    }}>

      <Box width={680}>

        <Typography variant="h5" textAlign="center" fontWeight={600}>
          Sales Summary Datewise
        </Typography>

        {/* PERIOD */}

        <Paper sx={{p:2,mb:1}}>

          <Box display="flex" alignItems="center" gap={1} mb={1}>
            <DateRangeIcon color="primary"/>
            <Typography fontWeight={600}>Period</Typography>
          </Box>

          <Grid container spacing={2}>

            <Grid item xs={6}>
              <TextField
                type="date"
                label="Start Date"
                fullWidth
                size="small"
                InputLabelProps={{shrink:true}}
                value={startDate}
                onChange={(e)=>setStartDate(e.target.value)}
              />
            </Grid>

            <Grid item xs={6}>
              <TextField
                type="date"
                label="End Date"
                fullWidth
                size="small"
                InputLabelProps={{shrink:true}}
                value={endDate}
                onChange={(e)=>setEndDate(e.target.value)}
              />
            </Grid>

          </Grid>

          <FormControlLabel
            control={<Checkbox checked={excelOutput} onChange={(e)=>setExcelOutput(e.target.checked)}/>}
            label="Excel Output?"
          />

        </Paper>

        {/* SUMMARY */}

        <Paper sx={{p:2,mb:2}}>

          <Typography fontWeight={600}>Show Summary ?</Typography>

          <RadioGroup row value={showSummary} onChange={(e)=>setShowSummary(e.target.value)}>
            <FormControlLabel value="yes" control={<Radio/>} label="Yes"/>
            <FormControlLabel value="no" control={<Radio/>} label="No"/>
          </RadioGroup>

        </Paper>

        {/* PARTY */}

        <Paper sx={{p:2}}>

          <Box display="flex" alignItems="center" gap={1} mb={1}>
            <PeopleIcon color="primary"/>
            <Typography fontWeight={600}>Party</Typography>
          </Box>

          <Autocomplete
            size="small"
            options={partyList}
            loading={loading}
            getOptionLabel={(option)=>option.AccountName||""}
            value={party}
            onChange={(e,val)=>setParty(val)}
            renderInput={(params)=>(
              <TextField
                {...params}
                placeholder="Type to search..."
                InputProps={{
                  ...params.InputProps,
                  endAdornment:(
                    <>
                      {loading && <CircularProgress size={20}/>}
                      {params.InputProps.endAdornment}
                    </>
                  )
                }}
              />
            )}
          />

        </Paper>

        {/* BUTTONS */}

        <Box display="flex" justifyContent="center" gap={3} mt={3}>

          <Button variant="contained" startIcon={<PrintIcon/>} onClick={handlePrint}>
            Print Report
          </Button>

          <Button variant="contained" color="error" startIcon={<CloseIcon/>} onClick={handleClose}>
            Close
          </Button>

        </Box>

      </Box>

    </Box>

  );

}