// import React, { useState,useRef,useEffect } from "react";
// import {
//   Box,
//   Paper,
//   Typography,
//   TextField,
//   Checkbox,
//   FormControlLabel,
//   Button,
//   Radio,
//   RadioGroup,
//   Select,
//   MenuItem,
//   Grid, CircularProgress
// } from "@mui/material";
// import {Autocomplete} from "@mui/material";

// import PrintIcon from "@mui/icons-material/Print";
// import CloseIcon from "@mui/icons-material/Close";
// import DateRangeIcon from "@mui/icons-material/DateRange";
// import PeopleIcon from "@mui/icons-material/People";

// import { useNavigate } from "react-router-dom";
// import jsPDF from "jspdf";

// import html2canvas from "html2canvas";
// import SalesRegisterPrint from "./SalesregPrint";
// import axios from "axios";

// export default function SalesRegister() {
//   const navigate = useNavigate();

//   const [startDate, setStartDate] = useState("2026-04-01");
//   const [endDate, setEndDate] = useState("2026-03-31");
//   const [excelOutput, setExcelOutput] = useState(false);
//   const [summary, setSummary] = useState("no");
//   const [salesToCanvassor, setSalesToCanvassor] = useState(false);
// const [partyList, setPartyList] = useState([]);
// const [party, setParty] = useState("");
//  const [loading, setLoading] = useState(true);


// useEffect(() => {
//   const fetchAccounts = async () => {
//     try {
//       setLoading(true); // Ensure loading starts when the request begins
//       const res = await axios.get(
//         "https://publication.microtechsolutions.net.in/php/Accountget.php"
//       );
      
//       // Axios returns the JSON inside res.data
//       // Based on your JSON sample, res.data is the array directly
//       setPartyList(res.data || []);
//     } catch (err) {
//       console.error("Error fetching accounts:", err);
//       setPartyList([]); // Clear list on error
//     } finally {
//       setLoading(false); // THIS IS THE MISSING PIECE: It unlocks the dropdown
//     }
//   };

//   fetchAccounts();
// }, []);

//    const reportRef = useRef(null);
//         const [printing, setPrinting] = useState(false);
//      const handlePrint = async () => {
//          setPrinting(true);
//          // Give the DOM a moment to ensure the hidden report is ready
//          setTimeout(async () => {
//            try {
//              const element = reportRef.current;
//              if (!element) return;
     
//              // Capture the element as a canvas
//              const canvas = await html2canvas(element, { 
//                scale: 2, 
//                useCORS: true,
//                logging: false 
//              });
     
//              const imgData = canvas.toDataURL("image/png");
//              const pdf = new jsPDF("p", "mm", "a4");
             
//              // Add image to PDF (A4 size is 210mm x 297mm)
//              pdf.addImage(imgData, "PNG", 0, 0, 210, 297);
             
//              // Open the PDF in a new Chrome tab
//              window.open(pdf.output("bloburl"), "_blank");
//            } catch (error) {
//              console.error("PDF Error:", error);
//            } finally {
//              setPrinting(false);
//            }
//          }, 500); // 500ms is safer for rendering complex reports
//        };
 
 
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
//       <Box width={700}>

//         {/* ===== TITLE ===== */}

//         <Typography
//           variant="h5"
//           fontWeight={600}
//           textAlign="center"
//           mb={1}
//         >
//           Sales Register 
//         </Typography>

//         {/* ================= PERIOD ================= */}

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

//         {/* ================= SUMMARY ================= */}

//         <Paper elevation={4} sx={{ p: 2, mb: 2, borderRadius: 2.5 }}>
//           <Typography fontWeight={600} fontSize={15} mb={0.5}>
//             Show Summary ?
//           </Typography>

//           <RadioGroup
//             row
//             value={summary}
//             onChange={e => setSummary(e.target.value)}
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

//         {/* ================= CANVASSOR ================= */}

//         <Paper elevation={4} sx={{ p: 1, mb: 1, borderRadius: 1}}>
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

//       <Paper elevation={4} sx={{ p: 1, borderRadius: 1 }}>
//   <Box display="flex" alignItems="center" gap={1} mb={1}>
//     <PeopleIcon fontSize="small" color="primary" />
//     <Typography fontWeight={600} fontSize={15}>
//       Party
//     </Typography>
//   </Box>

//  <Autocomplete
//   id="party-autocomplete"
//   size="small"
//   fullWidth
//   options={partyList}
//   loading={loading}
//   // This tells Autocomplete to use 'AccountName' as the label in the list
//   getOptionLabel={(option) => option.AccountName || ""}
//   // This ensures the value is handled correctly even if multiple items have the same name
//   isOptionEqualToValue={(option, value) => option.Id === value.Id}
//   value={partyList.find((item) => item.AccountName === party) || null}
//   onChange={(event, newValue) => {
//     // We store the name in your 'party' state to keep it compatible with your print logic
//     setParty(newValue ? newValue.AccountName : "");
//   }}
//   renderInput={(params) => (
//     <TextField
//       {...params}
//        placeholder="Type to search..."
//       InputProps={{
//         ...params.InputProps,
//         endAdornment: (
//           <React.Fragment>
//             {loading ? <CircularProgress color="inherit" size={20} /> : null}
//             {params.InputProps.endAdornment}
//           </React.Fragment>
//         ),
//       }}
//     />
//   )}
//   // Optional: Custom styling for the list items
//   renderOption={(props, option) => (
//     <Box component="li" {...props} key={option.Id} sx={{ fontSize: 13 }}>
//       {option.AccountName}
//     </Box>
//   )}
// />
// </Paper>

 
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
//               px: 2,
//               py: 1,
//               fontSize: 14,
//               fontWeight: 500,
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
//               px: 2,
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


//        <Box sx={{ position: "absolute", top: "-10000px", left: "-10000px" }}>
//                       <div ref={reportRef}>
//                         <SalesRegisterPrint state={{ startDate, endDate }} />
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
  Button,
  Radio,
  RadioGroup,
  Grid,
  CircularProgress,
  Autocomplete
} from "@mui/material";

import PrintIcon from "@mui/icons-material/Print";
import CloseIcon from "@mui/icons-material/Close";
import DateRangeIcon from "@mui/icons-material/DateRange";
import PeopleIcon from "@mui/icons-material/People";

import { useNavigate } from "react-router-dom";
import axios from "axios";

import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export default function SalesRegister() {

  const navigate = useNavigate();

  const [startDate, setStartDate] = useState("2025-04-01");
  const [endDate, setEndDate] = useState("2026-03-31");

  const [excelOutput, setExcelOutput] = useState(false);
  const [summary, setSummary] = useState("no");
  const [salesToCanvassor, setSalesToCanvassor] = useState(false);

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
        "https://publication.microtechsolutions.net.in/php/get/getSalesRegister.php",
        {
          params: {
            fromdate: startDate,
            todate: endDate,
            excelOutput: excelOutput ? "yes" : "no",
            showSummary: summary,
            salesToCanvassors: salesToCanvassor ? "yes" : "no",
            party: party ? party : ""
          }
        }
      );

      const rows = Array.isArray(response.data) ? response.data : [];

      /* GROUP BY DATE */

      const getDate = (text = "") => {
        const match = text.match(/\d{2}-\d{2}-\d{4}/);
        return match ? match[0] : "";
      };

      const grouped = {};

      rows.forEach((row) => {

        const date = getDate(row["Particulars"]);

        if (!grouped[date]) grouped[date] = [];

        grouped[date].push(row);

      });

      const body = [];

      Object.keys(grouped).forEach((date) => {

        const list = grouped[date];

        body.push([
          {
            content: date,
            colSpan: 8,
            styles: { halign: "center", fontStyle: "bold" }
          }
        ]);

        let dayCash = 0;
        let dayCredit = 0;

        list.forEach((row) => {

          const amount = Number(row["Invoice Amount"] || 0);

          const cash = row["Cash Credit"] === "Cash" ? amount : "";
          const credit = row["Cash Credit"] === "Credit" ? amount : "";

          if (cash) dayCash += amount;
          if (credit) dayCredit += amount;

          body.push([
            row["Sr No"],
            row["Party Name & Place"],
            row["P.S"],
            row["Bill No"],
            row["No Books"],
            cash ? amount.toLocaleString("en-IN") : "",
            credit ? amount.toLocaleString("en-IN") : "",
            row["Dispatch Mode"]
          ]);

        });

        body.push([
          "",
          "*** Day Total ***",
          "",
          "",
          "",
          dayCash.toLocaleString("en-IN"),
          dayCredit.toLocaleString("en-IN"),
          ""
        ]);

      });

      const pdf = new jsPDF("p", "mm", "a4");

      const pageWidth = pdf.internal.pageSize.getWidth();

      autoTable(pdf, {

        startY: 40,

        head: [[
          "Sr No",
          "Party Name & Place",
          "P.S",
          "Bill No",
          "No Books",
          "Cash",
          "Credit",
          "Dispatch Mode"
        ]],

        body,

        styles: {
          fontSize: 9
        },

        columnStyles: {
          5: { halign: "right" },
          6: { halign: "right" }
        },

        didDrawPage: (data) => {

          pdf.setFontSize(14);
          pdf.setFont("times", "bold");

          pdf.text(
            "Phadke Prakashan, Kolhapur.",
            pageWidth / 2,
            10,
            { align: "center" }
          );

          pdf.setFontSize(12);

          pdf.text(
            "Sales Register",
            pageWidth / 2,
            16,
            { align: "center" }
          );

          pdf.setFontSize(10);

          pdf.text(
            `From ${startDate} to ${endDate}`,
            pageWidth / 2,
            22,
            { align: "center" }
          );

          const page = pdf.internal.getNumberOfPages();

          pdf.text(
            `Page ${page}`,
            pageWidth - 20,
            10
          );

        }

      });

      window.open(pdf.output("bloburl"), "_blank");

    } catch (error) {

      console.error("API Error:", error);

    }

  };

  const handleClose = () => navigate(-1);

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: "linear-gradient(135deg,#eef2f7,#e3e8f0)",
        display: "flex",
        justifyContent: "center",
        pt: 1
      }}
    >

      <Box width={700}>

        <Typography variant="h5" fontWeight={600} textAlign="center" mb={1}>
          Sales Register
        </Typography>

        <Paper elevation={4} sx={{ p: 2, mb: 1 }}>

          <Box display="flex" alignItems="center" gap={1} mb={1}>
            <DateRangeIcon fontSize="small" color="primary" />
            <Typography fontWeight={600}>Period</Typography>
          </Box>

          <Grid container spacing={2}>

            <Grid item xs={6}>
              <TextField
                label="Start Date"
                type="date"
                size="small"
                fullWidth
                InputLabelProps={{ shrink: true }}
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
            </Grid>

            <Grid item xs={6}>
              <TextField
                label="End Date"
                type="date"
                size="small"
                fullWidth
                InputLabelProps={{ shrink: true }}
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
              />
            </Grid>

          </Grid>

          <FormControlLabel
            control={
              <Checkbox
                size="small"
                checked={excelOutput}
                onChange={(e) => setExcelOutput(e.target.checked)}
              />
            }
            label="Excel Output?"
          />

        </Paper>

        <Paper elevation={4} sx={{ p: 2, mb: 2 }}>

          <Typography fontWeight={600}>Show Summary ?</Typography>

          <RadioGroup row value={summary} onChange={(e) => setSummary(e.target.value)}>
            <FormControlLabel value="yes" control={<Radio size="small" />} label="Yes" />
            <FormControlLabel value="no" control={<Radio size="small" />} label="No" />
          </RadioGroup>

        </Paper>

        <Paper elevation={4} sx={{ p: 1, mb: 1 }}>

          <FormControlLabel
            control={
              <Checkbox
                size="small"
                checked={salesToCanvassor}
                onChange={(e) => setSalesToCanvassor(e.target.checked)}
              />
            }
            label="Sales To Canvassors?"
          />

        </Paper>

        <Paper elevation={4} sx={{ p: 1 }}>

          <Box display="flex" alignItems="center" gap={1} mb={1}>
            <PeopleIcon fontSize="small" color="primary" />
            <Typography fontWeight={600}>Party</Typography>
          </Box>

          <Autocomplete
            size="small"
            fullWidth
            options={partyList}
            loading={loading}
            getOptionLabel={(option) => option.AccountName || ""}
            value={partyList.find((item) => item.Id === party) || null}
            onChange={(event, newValue) => {
              setParty(newValue ? newValue.Id : null);
            }}
            renderInput={(params) => (
              <TextField
                {...params}
                placeholder="Type to search..."
                InputProps={{
                  ...params.InputProps,
                  endAdornment: (
                    <>
                      {loading && <CircularProgress size={20} />}
                      {params.InputProps.endAdornment}
                    </>
                  )
                }}
              />
            )}
          />

        </Paper>

        <Box display="flex" justifyContent="center" gap={3} mt={3}>

          <Button
            variant="contained"
            startIcon={<PrintIcon />}
            onClick={handlePrint}
          >
            Print Report
          </Button>

          <Button
            variant="contained"
            color="error"
            startIcon={<CloseIcon />}
            onClick={handleClose}
          >
            Close
          </Button>

        </Box>

      </Box>

    </Box>
  );
}