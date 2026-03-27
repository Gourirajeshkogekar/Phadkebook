// import React, { useState, useEffect, useRef } from "react";
// import {
//   Box,
//   Paper,
//   Typography,
//   TextField,
//   Button,
//   Checkbox,
//   FormControlLabel,
//   Radio,
//   RadioGroup,
//   Grid,
//   CircularProgress,
//   Autocomplete
// } from "@mui/material";

// import PrintIcon from "@mui/icons-material/Print";
// import CloseIcon from "@mui/icons-material/Close";
// import { useNavigate } from "react-router-dom";
// import html2canvas from "html2canvas";
// import jsPDF from "jspdf";

// // Import your print component
// import SalesregsummaryPrint from "./SalesregSummaryPrint";

// export default function SalesRegSummary() {
//   const navigate = useNavigate();
//   const reportRef = useRef(null);
// const [reportRows, setReportRows] = useState([]);
//   // --- States ---
//   const [startDate, setStartDate] = useState("2026-04-01");
//   const [endDate, setEndDate] = useState("2026-03-31");
//   const [excelOutput, setExcelOutput] = useState(false);
//   const [showSummary, setShowSummary] = useState("no");
//   const [salesToCanvassors, setSalesToCanvassors] = useState(false);
//   const [accountGroup, setAccountGroup] = useState("");
  
//   // --- API & Printing States ---
//   const [groups, setGroups] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [printing, setPrinting] = useState(false);

//   // --- Fetch Account Groups ---
//   useEffect(() => {
//     fetch("https://publication.microtechsolutions.net.in/php/AccountGroupget.php")
//       .then((res) => res.json())
//       .then((data) => {
//         setGroups(data);
//         setLoading(false);
//       })
//       .catch((err) => {
//         console.error("Fetch error:", err);
//         setLoading(false);
//       });
//   }, []);

//   const handlePrint = async () => {
//     // 1. Validation
//     if (!accountGroup) {
//       alert("Please select an Account Group first");
//       return;
//     }

//     setPrinting(true);

//     try {
//       // 2. Fetch Data from API
//       // We use URLSearchParams to ensure the boolean and strings are formatted correctly
//       const queryParams = new URLSearchParams({
//         fromdate: startDate,
//         todate: endDate,
//         excelOutput: excelOutput, // string "true" or "false"
//         showSummary: showSummary === "yes" ? "Yes" : "No",
//         salesToCanvassors: salesToCanvassors,
//         accountGroup: accountGroup // Or accountGroupId if your API requires the ID
//       });

//       const response = await fetch(
//         `https://publication.microtechsolutions.net.in/php/get/getSalesRegisterSummary.php?${queryParams}`
//       );
//       const result = await response.json();

//       if (result.status === "success") {
//         // 3. Update state so the hidden Print component renders the rows
//         setReportRows(result.data || []);

//         // 4. Wait for React to re-render the hidden component with new data
//         await new Promise((resolve) => setTimeout(resolve, 800));

//         // 5. Generate PDF from the ref
//         if (reportRef.current) {
//           const element = reportRef.current;
//           const canvas = await html2canvas(element, {
//             scale: 2,
//             useCORS: true,
//             logging: false,
//           });

//           const imgData = canvas.toDataURL("image/png");
//           const pdf = new jsPDF("p", "mm", "a4");
//           const imgProps = pdf.getImageProperties(imgData);
//           const pdfWidth = pdf.internal.pageSize.getWidth();
//           const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

//           pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
//           window.open(pdf.output("bloburl"), "_blank");
//         }
//       } else {
//         alert("API Error: " + (result.message || "Failed to fetch data"));
//       }
//     } catch (error) {
//       console.error("Integration Error:", error);
//       alert("System error: Could not connect to the reporting server.");
//     } finally {
//       setPrinting(false);
//     }
//   };
//   const handleClose = () => navigate(-1);

//   return (
//     <Box
//       sx={{
//         minHeight: "100vh",
//         background: "linear-gradient(135deg,#eef2f7,#e3e8f0)",
//         display: "flex",
//         justifyContent: "center",
//         pt: 2
//       }}
//     >
//       <Box width={560}>
//         <Typography variant="h5" fontWeight={600} textAlign="center" mb={1}>
//           Sales Register Summary
//         </Typography>

//         <Paper sx={{ p: 2, borderRadius: 1, mb: 1 }}>
//           <Typography fontWeight={600} fontSize={15} mb={2}>Period</Typography>
//           <Grid container spacing={2}>
//             <Grid item xs={6}>
//               <TextField
//                 label="Start Date" type="date" size="small" fullWidth
//                 InputLabelProps={{ shrink: true }}
//                 value={startDate}
//                 onChange={(e) => setStartDate(e.target.value)}
//               />
//             </Grid>
//             <Grid item xs={6}>
//               <TextField
//                 label="End Date" type="date" size="small" fullWidth
//                 InputLabelProps={{ shrink: true }}
//                 value={endDate}
//                 onChange={(e) => setEndDate(e.target.value)}
//               />
//             </Grid>
//           </Grid>
//           <FormControlLabel
//             sx={{ mt: 1 }}
//             control={<Checkbox size="small" checked={excelOutput} onChange={(e) => setExcelOutput(e.target.checked)} />}
//             label="Excel output"
//           />
//         </Paper>

//         <Paper sx={{ p: 2, borderRadius: 1, mb: 2 }}>
//           <Typography fontWeight={600} fontSize={15}>Show Summary ?</Typography>
//           <RadioGroup row value={showSummary} onChange={(e) => setShowSummary(e.target.value)}>
//             <FormControlLabel value="yes" control={<Radio size="small" />} label="Yes" />
//             <FormControlLabel value="no" control={<Radio size="small" />} label="No" />
//           </RadioGroup>
//           <FormControlLabel
//             control={<Checkbox size="small" checked={salesToCanvassors} onChange={(e) => setSalesToCanvassors(e.target.checked)} />}
//             label="Sales To Canvassors"
//           />
//         </Paper>

//         <Paper sx={{ p: 2, borderRadius: 1, mb: 3 }}>
//           <Typography fontWeight={600} fontSize={15} mb={1}>Account Group</Typography>
//           <Autocomplete
//             size="small"
//             fullWidth
//             options={groups}
//             loading={loading}
//             getOptionLabel={(option) => option.GroupName || ""}
//             value={groups.find((g) => g.GroupName === accountGroup) || null}
//             onChange={(e, newValue) => setAccountGroup(newValue ? newValue.GroupName : "")}
//             renderInput={(params) => (
//               <TextField
//                 {...params}
//                 label="Select Account Group"
//                 InputProps={{
//                   ...params.InputProps,
//                   endAdornment: (
//                     <>
//                       {loading ? <CircularProgress color="inherit" size={20} /> : null}
//                       {params.InputProps.endAdornment}
//                     </>
//                   ),
//                 }}
//               />
//             )}
//           />
//         </Paper>

//         <Box display="flex" justifyContent="center" gap={2.5}>
//           <Button
//             variant="contained"
//             disabled={printing}
//             startIcon={printing ? <CircularProgress size={20} /> : <PrintIcon />}
//             onClick={handlePrint}
//             sx={{ px: 3.5, py: 1, fontWeight: 600, borderRadius: 2, minWidth: 170 }}
//           >
//             {printing ? "Generating..." : "Print Report"}
//           </Button>

//           <Button
//             variant="contained"
//             color="error"
//             startIcon={<CloseIcon />}
//             onClick={handleClose}
//             sx={{ px: 3.5, py: 1, fontWeight: 600, borderRadius: 2, minWidth: 120 }}
//           >
//             Close
//           </Button>
//         </Box>
//       </Box>

//       {/* HIDDEN PRINT AREA */}
//       <Box sx={{ position: "absolute", top: "-10000px", left: "-10000px",  }}>
//         <div ref={reportRef} style={{ width: "210mm" }}>
//           <SalesregsummaryPrint 
//             state={{ startDate, endDate, accountGroup, showSummary, salesToCanvassors,rows: reportRows   }} 
//           />
//         </div>
//       </Box>
//     </Box>
//   );
// }




import React, { useState, useEffect } from "react";
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Checkbox,
  FormControlLabel,
  Radio,
  RadioGroup,
  Grid,
  CircularProgress,
  Autocomplete
} from "@mui/material";

import PrintIcon from "@mui/icons-material/Print";
import CloseIcon from "@mui/icons-material/Close";

import axios from "axios";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

export default function SalesRegSummary() {

  const navigate = useNavigate();

  const [startDate, setStartDate] = useState("2026-04-01");
  const [endDate, setEndDate] = useState("2026-03-31");
  const [excelOutput, setExcelOutput] = useState(false);
  const [showSummary, setShowSummary] = useState("0");
  const [salesToCanvassors, setSalesToCanvassors] = useState(false);
  const [accountGroup, setAccountGroup] = useState("");

  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [printing, setPrinting] = useState(false);

  useEffect(() => {
    fetch("https://publication.microtechsolutions.net.in/php/AccountGroupget.php")
      .then((res) => res.json())
      .then((data) => {
        setGroups(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  // 1. Add a state to hold the API data
const [reportData, setReportData] = useState(null);

 const handlePrint = async () => {

    try {

      setPrinting(true);

      const response = await axios.get(
        "https://publication.microtechsolutions.net.in/php/get/getSalesRegisterSummary.php",
        {
          params: {
            fromdate: startDate,
            todate: endDate,
            excelOutput: excelOutput ? 1 : 0,
            showSummary: showSummary,
            salesToCanvassors: salesToCanvassors ? 1 : 0,
            accountGroup: accountGroup
          }
        }
      );

      const rows = response?.data?.data || [];

      generatePDF(rows);

    } catch (error) {

      console.error("API ERROR:", error);
      toast.error("API connection failed.");

    }

    setPrinting(false);
  };

  const generatePDF = (rows) => {

    const doc = new jsPDF("p", "mm", "a4");

    const tableRows = rows.map((r) => [
      r.Date || "",
      r.Particulars || "",
      r.NetAmount || "",
      r.OtherCharges || "",
      r.Cash || "",
      r.Credit || ""
    ]);

    autoTable(doc, {

      startY: 30,

      head: [[
        "Date",
        "Particulars",
        "Net Amount",
        "Other Charges",
        "Cash",
        "Credit"
      ]],

      body: tableRows,

      styles: { fontSize: 9 },

      headStyles: {
        fillColor: [255,255,255],
        textColor: 0
      },

      didDrawPage: function () {

        doc.setFontSize(16);
        doc.text("Phadke Prakashan, Kolhapur.", 105, 10, { align: "center" });

        doc.setFontSize(12);
        doc.text("Sales Register Summary", 105, 16, { align: "center" });

        doc.setFontSize(10);
        doc.text(`From ${startDate} to ${endDate}`, 105, 22, { align: "center" });

      }

    });

    window.open(doc.output("bloburl"));
  };

  const handleClose = () => navigate(-1);

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: "linear-gradient(135deg,#eef2f7,#e3e8f0)",
        display: "flex",
        justifyContent: "center",
        pt: 2
      }}
    >
      <Box width={560}>

        <Typography variant="h5" fontWeight={600} textAlign="center" mb={1}>
          Sales Register Summary
        </Typography>

        {/* PERIOD */}

        <Paper sx={{ p: 2, borderRadius: 1, mb: 1 }}>

          <Typography fontWeight={600} fontSize={15} mb={2}>
            Period
          </Typography>

          <Grid container spacing={2}>

            <Grid xs={6}  >
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

            <Grid xs={6}>
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
            sx={{ mt: 1 }}
            control={
              <Checkbox
                size="small"
                checked={excelOutput}
                onChange={(e) => setExcelOutput(e.target.checked)}
              />
            }
            label="Excel output"
          />

        </Paper>

        {/* SHOW SUMMARY */}

        <Paper sx={{ p: 2, borderRadius: 1, mb: 2 }}>

          <Typography fontWeight={600} fontSize={15}>
            Show Summary ?
          </Typography>

          <RadioGroup
            row
            value={showSummary}
            onChange={(e) => setShowSummary(e.target.value)}
          >
            <FormControlLabel value="1" control={<Radio size="small" />} label="Yes" />
            <FormControlLabel value="0" control={<Radio size="small" />} label="No" />
          </RadioGroup>

          <FormControlLabel
            control={
              <Checkbox
                size="small"
                checked={salesToCanvassors}
                onChange={(e) => setSalesToCanvassors(e.target.checked)}
              />
            }
            label="Sales To Canvassors"
          />

        </Paper>

        {/* ACCOUNT GROUP */}

        <Paper sx={{ p: 2, borderRadius: 1, mb: 3 }}>

          <Typography fontWeight={600} fontSize={15} mb={1}>
            Account Group
          </Typography>

          <Autocomplete
            size="small"
            fullWidth
            options={groups}
            loading={loading}
            getOptionLabel={(option) => option.GroupName || ""}
            onChange={(e, newValue) =>
              setAccountGroup(newValue ? newValue.GroupName : "")
            }
            renderInput={(params) => (
              <TextField {...params}   />
            )}
          />

        </Paper>

        <Box display="flex" justifyContent="center" gap={2.5}>

          <Button
            variant="contained"
            disabled={printing}
            startIcon={printing ? <CircularProgress size={20} /> : <PrintIcon />}
            onClick={handlePrint}
            sx={{
              px: 3.5,
              py: 1,
              fontWeight: 600,
              borderRadius: 2,
              minWidth: 170
            }}
          >
            {printing ? "Generating..." : "Print Report"}
          </Button>

          <Button
            variant="contained"
            color="error"
            startIcon={<CloseIcon />}
            onClick={handleClose}
            sx={{
              px: 3.5,
              py: 1,
              fontWeight: 600,
              borderRadius: 2,
              minWidth: 120
            }}
          >
            Close
          </Button>

        </Box>

      </Box>
    </Box>
  );
}