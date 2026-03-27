// import React, { useState, useRef, useEffect } from "react";
// import {
//   Box,
//   Paper,
//   Typography,
//   TextField,
//   Radio,
//   RadioGroup,
//   FormControlLabel,
//   Checkbox,
//   Select,
//   MenuItem,
//   Button,
//   Grid,
//   Autocomplete,
//   CircularProgress
// } from "@mui/material";
// import PrintIcon from "@mui/icons-material/Print";
// import CloseIcon from "@mui/icons-material/Close";
// import DateRangeIcon from "@mui/icons-material/DateRange";
// import { useNavigate } from "react-router-dom";
// import html2canvas from "html2canvas";
// import jsPDF from "jspdf";
// import PurchaseregPrint from "./PurchaseregPrint";




// const salesTaxOptions = [
//   { label: "C.S.T. 4%", taxId: 1 },
//   { label: "CST 12.5%", taxId: 2 },
//   { label: "Exempted", taxId: 3 },
//   { label: "Expenses", taxId: 4 },
//   { label: "GST 5%", taxId: 5 },
//   { label: "GST 12%", taxId: 6 },
//   { label: "GST 18%", taxId: 7 },
//   { label: "GST 28%", taxId: 8 },
//   { label: "IGST 5%", taxId: 9 },
//   { label: "IGST 12%", taxId: 10 },
//   { label: "IGST 18%", taxId: 11 },
//   { label: "IGST 28%", taxId: 12 },
//   { label: "Lbr Chgs.", taxId: 13 },
//   { label: "R.D.", taxId: 14 },
//   { label: "ROYALTY", taxId: 15 },
//   { label: "Transit-Against C Form", taxId: 16 },
//   { label: "U.R.D", taxId: 17 },
//   { label: "VAT 4%", taxId: 18 },
//   { label: "VAT 5%", taxId: 19 },
//   { label: "VAT 6%", taxId: 20 },
//   { label: "VAT 8%", taxId: 21 },
//   { label: "VAT 12.5%", taxId: 22 },
//   { label: "VAT 13.5%", taxId: 23 },
//   { label: "VAT @5.5%", taxId: 24 },
// ];

// export default function PurchaseRegister() {
//   const navigate = useNavigate();

//   const [startDate, setStartDate] = useState("2026-04-01");
//   const [endDate, setEndDate] = useState("2026-03-31");
//   const [showListing, setShowListing] = useState("no");
//   const [party, setParty] = useState(null); // Stores the selected object
//   const [parties, setParties] = useState([]); // Stores API data
//   const [loadingParties, setLoadingParties] = useState(true);
//   const [selectedTaxIds, setSelectedTaxIds] = useState([]);

//   const reportRef = useRef();
//   const [printing, setPrinting] = useState(false);

//   // FETCH DATA FROM API
//   useEffect(() => {
//     const fetchParties = async () => {
//       try {
//         const response = await fetch("https://publication.microtechsolutions.net.in/php/Accountget.php");
//         const data = await response.json();
//         setParties(data);
//       } catch (error) {
//         console.error("Error fetching account data:", error);
//       } finally {
//         setLoadingParties(false);
//       }
//     };
//     fetchParties();
//   }, []);

//   const handlePrint = async () => {
//     setPrinting(true);
//     setTimeout(async () => {
//       try {
//         const element = reportRef.current;
//         if (!element) return;
//         const canvas = await html2canvas(element, { scale: 2, useCORS: true });
//         const imgData = canvas.toDataURL("image/png");
//         const pdf = new jsPDF("p", "mm", "a4");
//         const pageWidth = pdf.internal.pageSize.getWidth();
//         const pageHeight = pdf.internal.pageSize.getHeight();
//         const imgWidth = canvas.width;
//         const imgHeight = canvas.height;
//         const ratio = Math.min(pageWidth / imgWidth, pageHeight / imgHeight);
//         const finalWidth = imgWidth * ratio;
//         const finalHeight = imgHeight * ratio;
//         pdf.addImage(imgData, "PNG", (pageWidth - finalWidth) / 2, 10, finalWidth, finalHeight);
//         window.open(pdf.output("bloburl"), "_blank");
//       } catch (error) {
//         console.error(error);
//       } finally {
//         setPrinting(false);
//       }
//     }, 300);
//   };

//   const handleClose = () => navigate(-1);

//   return (
//     <Box sx={{ minHeight: "100vh", background: "linear-gradient(135deg,#eef2f7,#e3e8f0)", display: "flex", justifyContent: "center", pt: 1 }}>
//       <Box width={700}>
//         <Typography variant="h5" fontWeight={600} textAlign="center" mb={1}>Purchase Register</Typography>

//         <Paper elevation={4} sx={{ p: 1, mb: 1, borderRadius: 1 }}>
//           <Box display="flex" alignItems="center" gap={1} mb={1}>
//             <DateRangeIcon fontSize="small" color="primary" />
//             <Typography fontWeight={600} fontSize={15}>Period</Typography>
//           </Box>
//           <Grid container spacing={2}>
//             <Grid item xs={6}>
//               <TextField label="Start Date" type="date" size="small" fullWidth InputLabelProps={{ shrink: true }} value={startDate} onChange={e => setStartDate(e.target.value)} />
//             </Grid>
//             <Grid item xs={6}>
//               <TextField label="End Date" type="date" size="small" fullWidth InputLabelProps={{ shrink: true }} value={endDate} onChange={e => setEndDate(e.target.value)} />
//             </Grid>
//           </Grid>
//         </Paper>

//         <Paper elevation={4} sx={{ p: 2, mb: 2, borderRadius: 1 }}>
//           <Typography fontWeight={600} fontSize={15}>Show Bill Listing ?</Typography>
//           <RadioGroup row value={showListing} onChange={e => setShowListing(e.target.value)}>
//             <FormControlLabel value="yes" control={<Radio size="small" />} label="Yes" />
//             <FormControlLabel value="no" control={<Radio size="small" />} label="No" />
//           </RadioGroup>
//         </Paper>

//         <Paper elevation={4} sx={{ p: 2, mb: 2, borderRadius: 1 }}>
//           <Grid container spacing={3}>
//             {/* Party Section with Autocomplete */}
//             <Grid item xs={6}>
//               <Typography fontWeight={700} fontSize={15} mb={1}>Party</Typography>
//               <Autocomplete
//                 size="large"
//                 options={parties}
//                 loading={loadingParties}
//                 getOptionLabel={(option) => option.AccountName || ""}
//                 value={party}
//                 onChange={(event, newValue) => setParty(newValue)}
//                 isOptionEqualToValue={(option, value) => option.Id === value.Id}
//                 renderInput={(params) => (
//                   <TextField
//                     {...params}
//                     placeholder="Search Party"
//                     InputProps={{
//                       ...params.InputProps,
//                       endAdornment: (
//                         <React.Fragment>
//                           {loadingParties ? <CircularProgress color="inherit" size={20} /> : null}
//                           {params.InputProps.endAdornment}
//                         </React.Fragment>
//                       ),
//                     }}
//                   />
//                 )}
//               />
//             </Grid>

            
//           </Grid>
//         </Paper>

//             <Paper elevation={4} sx={{ p: 2, mb: 2, borderRadius: 1 }}>
//           <Grid container spacing={3}>
           

//             {/* Tax Head Section */}
//             <Grid item xs={6}>
//               <Typography fontWeight={700} fontSize={15} mb={1}>Tax Head</Typography>
//               <Select
//                 multiple
//                 fullWidth
//                 size="small"
//                 value={selectedTaxIds}
//                 onChange={(e) => setSelectedTaxIds(e.target.value)}
//                 renderValue={(selected) => {
//                   if (selected.length === 0) return "Select Tax Heads";
//                   return salesTaxOptions
//                     .filter((opt) => selected.includes(opt.taxId))
//                     .map((opt) => opt.label)
//                     .join(", ");
//                 }}
//                 displayEmpty
//                 MenuProps={{ PaperProps: { style: { maxHeight: 250, width: 250 } } }}
//               >
//                 <MenuItem disabled value=""><em>Select Tax Heads</em></MenuItem>
//                 {salesTaxOptions.map((tax) => (
//                   <MenuItem key={tax.taxId} value={tax.taxId} sx={{ p: 0 }}>
//                     <Checkbox size="small" checked={selectedTaxIds.indexOf(tax.taxId) > -1} />
//                     <Typography fontSize={13}>{tax.label}</Typography>
//                   </MenuItem>
//                 ))}
//               </Select>
//             </Grid>
//           </Grid>
//         </Paper>

//         <Box display="flex" justifyContent="center" gap={3} mt={3}>
//           <Button variant="contained" startIcon={<PrintIcon />} onClick={handlePrint} sx={{ px: 4, py: 1, fontWeight: 600, borderRadius: 2, minWidth: 160 }}>
//             Print Report
//           </Button>
//           <Button variant="contained" color="error" startIcon={<CloseIcon />} onClick={handleClose} sx={{ px: 4, py: 1, fontWeight: 600, borderRadius: 2, minWidth: 130 }}>
//             Close
//           </Button>
//         </Box>
//       </Box>

      
//                 <Box sx={{ position: "absolute", top: "-10000px", left: "-10000px" }}>
//                       <div ref={reportRef}>
//                         <PurchaseregPrint state={{ startDate, endDate }} />
//                       </div>
//                     </Box>
//     </Box>
//   );
// }


import React, { useState, useEffect } from "react";
import {
  Box, Paper, Typography, TextField, Radio, RadioGroup,
  FormControlLabel, Checkbox, Select, MenuItem, Button,
  Grid, Autocomplete, CircularProgress
} from "@mui/material";

import PrintIcon from "@mui/icons-material/Print";
import CloseIcon from "@mui/icons-material/Close";
import DateRangeIcon from "@mui/icons-material/DateRange";

import { useNavigate } from "react-router-dom";

import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

const salesTaxOptions = [
  { label: "C.S.T. 4%", taxId: 1 },
  { label: "CST 12.5%", taxId: 2 },
  { label: "Exempted", taxId: 3 },
  { label: "Expenses", taxId: 4 },
  { label: "GST 5%", taxId: 5 },
  { label: "GST 12%", taxId: 6 },
  { label: "GST 18%", taxId: 7 },
  { label: "GST 28%", taxId: 8 },
  { label: "IGST 5%", taxId: 9 },
  { label: "IGST 12%", taxId: 10 },
  { label: "IGST 18%", taxId: 11 },
  { label: "IGST 28%", taxId: 12 },
  { label: "Lbr Chgs.", taxId: 13 },
  { label: "R.D.", taxId: 14 }
];

export default function PurchaseRegister() {

  const navigate = useNavigate();

  const [startDate, setStartDate] = useState("2025-04-01");
  const [endDate, setEndDate] = useState("2026-03-31");
  const [showListing, setShowListing] = useState("no");

  const [party, setParty] = useState(null);
  const [parties, setParties] = useState([]);
  const [loadingParties, setLoadingParties] = useState(true);

  const [selectedTaxIds, setSelectedTaxIds] = useState([]);

  useEffect(() => {

    const fetchParties = async () => {

      try {

        const res = await fetch(
          "https://publication.microtechsolutions.net.in/php/Accountget.php"
        );

        const data = await res.json();

        setParties(Array.isArray(data) ? data : []);

      } catch (err) {

        console.error(err);

      } finally {

        setLoadingParties(false);

      }

    };

    fetchParties();

  }, []);

  /* ================= PRINT REPORT ================= */

  const handlePrint = async () => {

    try {

      const url =
        `https://publication.microtechsolutions.net.in/php/get/getPurchaseRegister.php` +
        `?fromdate=${startDate}` +
        `&todate=${endDate}` +
        `&showBillListing=${showListing}` +
        `&party=${party?.Id || ""}` +
        `&taxHead=${selectedTaxIds.join(",")}`;

      const response = await fetch(url);
      const data = await response.json();

      const rows = Array.isArray(data) ? data : [];

      const toNumber = (v) => Number(String(v || 0).replace(/,/g,""));

      const totalBill = rows.reduce((s,r)=>s+toNumber(r.Bill_Amt),0);
      const totalTax = rows.reduce((s,r)=>s+toNumber(r.Taxable_IGST_VAT),0);
      const totalCGST = rows.reduce((s,r)=>s+toNumber(r.CGST),0);
      const totalSGST = rows.reduce((s,r)=>s+toNumber(r.SGST),0);
      const totalAmount = rows.reduce((s,r)=>s+toNumber(r.Amount),0);

      const body = rows.map(r => [
        r.Date,
        r.PV_No,
        r.Supplier_Name,
        r.GSTIN,
        r.Bill_No,
        r.Bill_Date,
        r.Bill_Amt,
        r.Purchase_Type,
        r.Taxable_IGST_VAT,
        "",
        r.CGST,
        r.SGST,
        r.Account_Head,
        r.Amount
      ]);

      body.push([
        "", "", "Total", "", "", "",
        totalBill.toFixed(2),
        "",
        totalTax.toFixed(2),
        "",
        totalCGST.toFixed(2),
        totalSGST.toFixed(2),
        "",
        totalAmount.toFixed(2)
      ]);

      const pdf = new jsPDF("landscape","mm","a4");
      const pageWidth = pdf.internal.pageSize.getWidth();

      autoTable(pdf,{

        startY:35,
        tableWidth:"auto",

        head:[[
          "Date","PV No","Supplier Name","GSTIN",
          "Bill No","Bill Date","Bill Amt","Purchase Type",
          "Taxable","IGST/VAT","CGST","SGST","Account Head","Amount"
        ]],

        body,

        styles:{
          fontSize:7,
          cellPadding:2
        },

        columnStyles:{
          0:{cellWidth:18},
          1:{cellWidth:12},
          2:{cellWidth:40},
          3:{cellWidth:20},
          4:{cellWidth:18},
          5:{cellWidth:20},
          6:{cellWidth:18,halign:"right"},
          7:{cellWidth:28},
          8:{cellWidth:18,halign:"right"},
          9:{cellWidth:18,halign:"right"},
          10:{cellWidth:15,halign:"right"},
          11:{cellWidth:15,halign:"right"},
          12:{cellWidth:30},
          13:{cellWidth:22,halign:"right"}
        },

        margin:{left:8,right:8},

        didDrawPage:()=>{

          pdf.setFont("times","bold");
          pdf.setFontSize(14);

          pdf.text(
            "Phadke Prakashan, Kolhapur.",
            pageWidth/2,
            10,
            {align:"center"}
          );

          pdf.setFontSize(12);

          pdf.text(
            "Purchase Register",
            pageWidth/2,
            17,
            {align:"center"}
          );

          pdf.setFontSize(10);

          pdf.text(
            `Selected Party - ${party?.AccountName || "All Parties"}  From ${startDate} to ${endDate}`,
            pageWidth/2,
            23,
            {align:"center"}
          );

        }

      });

      window.open(pdf.output("bloburl"),"_blank");

    } catch(err){

      console.error(err);

    }

  };

  const handleClose = () => navigate(-1);

  return (

    <Box sx={{minHeight:"100vh",background:"#eef2f7",display:"flex",justifyContent:"center",pt:1}}>

      <Box width={700}>

        <Typography variant="h5" fontWeight={600} textAlign="center">
          Purchase Register
        </Typography>

        {/* PERIOD */}

        <Paper sx={{p:1,mb:1}}>

          <Box display="flex" alignItems="center" gap={1} mb={1}>
            <DateRangeIcon color="primary"/>
            <Typography fontWeight={600}>Period</Typography>
          </Box>

          <Grid container spacing={2}>

            <Grid item xs={6}>
              <TextField
                type="date"
                label="Start Date"
                size="small"
                fullWidth
                InputLabelProps={{shrink:true}}
                value={startDate}
                onChange={(e)=>setStartDate(e.target.value)}
              />
            </Grid>

            <Grid item xs={6}>
              <TextField
                type="date"
                label="End Date"
                size="small"
                fullWidth
                InputLabelProps={{shrink:true}}
                value={endDate}
                onChange={(e)=>setEndDate(e.target.value)}
              />
            </Grid>

          </Grid>

        </Paper>

        {/* SHOW BILL LISTING */}

        <Paper sx={{p:1,mb:1}}>

          <Typography fontWeight={600}>Show Bill Listing ?</Typography>

          <RadioGroup row value={showListing}
            onChange={(e)=>setShowListing(e.target.value)}>

            <FormControlLabel value="yes" control={<Radio/>} label="Yes"/>
            <FormControlLabel value="no" control={<Radio/>} label="No"/>

          </RadioGroup>

        </Paper>

        {/* PARTY */}

        <Paper sx={{p:1, mb:1}}>

          <Typography fontWeight={700} mb={1}>Party</Typography>

          <Autocomplete
            options={parties}
            loading={loadingParties}
            getOptionLabel={(option)=>option.AccountName || ""}
            value={party}
            onChange={(e,val)=>setParty(val)}
            renderInput={(params)=>(
              <TextField {...params} placeholder="Search Party"
                InputProps={{
                  ...params.InputProps,
                  endAdornment:(
                    <>
                      {loadingParties && <CircularProgress size={20}/>}
                      {params.InputProps.endAdornment}
                    </>
                  )
                }}
              />
            )}
          />

        </Paper>

        {/* TAX HEAD */}

        <Paper sx={{p:1,mb:1}}>

          <Typography fontWeight={700} mb={1}>Tax Head</Typography>

          <Select
            multiple
            fullWidth
            size="small"
            value={selectedTaxIds}
            onChange={(e)=>setSelectedTaxIds(e.target.value)}
          >

            {salesTaxOptions.map((tax)=>(
              <MenuItem key={tax.taxId} value={tax.taxId}>
                <Checkbox checked={selectedTaxIds.includes(tax.taxId)}/>
                {tax.label}
              </MenuItem>
            ))}

          </Select>

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