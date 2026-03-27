// import React, { useState, useRef, useEffect } from "react"; // Added useEffect
// import {
//   Box,
//   Paper,
//   Typography,
//   TextField,
//   Button,
//   MenuItem,
//   Grid,
//   CircularProgress // Added for loading state
// } from "@mui/material";

// import DateRangeIcon from "@mui/icons-material/DateRange";
// import AccountBalanceIcon from "@mui/icons-material/AccountBalance";
// import PrintIcon from "@mui/icons-material/Print";
// import CloseIcon from "@mui/icons-material/Close";

// import { useNavigate } from "react-router-dom";
// import CashflowdaywisePrint from "./CashflowdaywisePrint";
// import jsPDF from "jspdf";
// import html2canvas from "html2canvas";
// import Autocomplete from "@mui/material/Autocomplete"; // Ensure this is imported
// export default function CashFlowDaywise() {
//   const navigate = useNavigate();

//   const [startDate, setStartDate] = useState("2026-04-01");
//   const [endDate, setEndDate] = useState("2026-03-31");
//   const [accountGroup, setAccountGroup] = useState("");
  
//   // --- NEW STATE FOR DYNAMIC OPTIONS ---
//   const [groups, setGroups] = useState([]);
//   const [loading, setLoading] = useState(true);

//   const reportRef = useRef(null);
//   const [printing, setPrinting] = useState(false);

//   // --- FETCH DATA FROM API ---
//   useEffect(() => {
//     fetch("https://publication.microtechsolutions.net.in/php/AccountGroupget.php")
//       .then((response) => response.json())
//       .then((data) => {
//         setGroups(data);
//         setLoading(false);
//       })
//       .catch((error) => {
//         console.error("Error fetching account groups:", error);
//         setLoading(false);
//       });
//   }, []);

//   const handlePrint = async () => {
//     setPrinting(true);
//     setTimeout(async () => {
//       try {
//         const element = reportRef.current;
//         if (!element) return;

//         const canvas = await html2canvas(element, {
//           scale: 2,
//           useCORS: true,
//           logging: false
//         });

//         const imgData = canvas.toDataURL("image/png");
//         const pdf = new jsPDF("p", "mm", "a4");
//         pdf.addImage(imgData, "PNG", 0, 0, 210, 297);
//         window.open(pdf.output("bloburl"), "_blank");
//       } catch (error) {
//         console.error("PDF Error:", error);
//       } finally {
//         setPrinting(false);
//       }
//     }, 500);
//   };

//   const handleClose = () => navigate(-1);

//   return (
//     <Box
//       sx={{
//         minHeight: "100vh",
//         background: "linear-gradient(135deg,#eef2f7,#e3e8f0)",
//         display: "flex",
//         justifyContent: "center",
//         pt: 4
//       }}
//     >
//       <Box width={540}>
//         <Typography variant="h5" fontWeight={600} textAlign="center" mb={2}>
//           Cash Flow Daywise
//         </Typography>

//         {/* PERIOD SECTION */}
//         <Paper elevation={5} sx={{ p: 2.5, borderRadius: 2.5, mb: 2.5 }}>
//           <Box display="flex" alignItems="center" gap={1} mb={1.5}>
//             <DateRangeIcon fontSize="small" color="primary" />
//             <Typography fontWeight={600} fontSize={15}>Period</Typography>
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
//                 onChange={(e) => setStartDate(e.target.value)}
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
//                 onChange={(e) => setEndDate(e.target.value)}
//               />
//             </Grid>
//           </Grid>
//         </Paper>

//         {/* ACCOUNT GROUP SECTION */}
//         <Paper elevation={5} sx={{ p: 2.5, borderRadius: 2.5 }}>
//           <Box display="flex" alignItems="center" gap={1} mb={1.5}>
//             <AccountBalanceIcon fontSize="small" color="primary" />
//             <Typography fontWeight={600} fontSize={15}>Account Group</Typography>
//           </Box>

//         <Autocomplete
//            id="account-group-autocomplete"
//            options={groups}
//            loading={loading}
//            // Logic to find the current object based on the stored string value
//            value={groups.find((g) => g.GroupName === accountGroup) || null}
//            // Extract GroupName when an item is selected
//            onChange={(event, newValue) => {
//              setAccountGroup(newValue ? newValue.GroupName : "");
//            }}
//            // This tells Autocomplete which property to show in the list
//            getOptionLabel={(option) => option.GroupName.replace(/\r?\n|\r/g, " ") || ""}
//            renderInput={(params) => (
//              <TextField
//                {...params}
//                 size="small"
//                fullWidth
//                placeholder="Type to filter..."
//                InputProps={{
//                  ...params.InputProps,
//                  endAdornment: (
//                    <React.Fragment>
//                      {loading ? <CircularProgress color="inherit" size={20} /> : null}
//                      {params.InputProps.endAdornment}
//                    </React.Fragment>
//                  ),
//                }}
//              />
//            )}
//          />
//         </Paper>

//         {/* BUTTONS */}
//         <Box display="flex" justifyContent="center" gap={2.5} mt={3}>
//           <Button
//             variant="contained"
//             startIcon={printing ? <CircularProgress size={20} color="inherit" /> : <PrintIcon />}
//             onClick={handlePrint}
//             disabled={printing}
//             sx={{ px: 3.5, py: 1, fontWeight: 600, borderRadius: 2, minWidth: 160 }}
//           >
//             {printing ? "Generating..." : "Print Report"}
//           </Button>

//           <Button
//             variant="contained"
//             color="error"
//             startIcon={<CloseIcon />}
//             onClick={handleClose}
//             sx={{ px: 3.5, py: 1, fontWeight: 600, borderRadius: 2, minWidth: 130 }}
//           >
//             Close
//           </Button>
//         </Box>
//       </Box>

//       {/* Hidden Print Area */}
//       <Box sx={{ position: "absolute", top: "-10000px", left: "-10000px" }}>
//         <div ref={reportRef}>
//           <CashflowdaywisePrint state={{ startDate, endDate, accountGroup }} />
//         </div>
//       </Box>
//     </Box>
//   );
// }





import React, { useState, useRef, useEffect } from "react";
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Grid,
  CircularProgress
} from "@mui/material";

import DateRangeIcon from "@mui/icons-material/DateRange";
import AccountBalanceIcon from "@mui/icons-material/AccountBalance";
import PrintIcon from "@mui/icons-material/Print";
import CloseIcon from "@mui/icons-material/Close";

import { useNavigate } from "react-router-dom";
import CashflowdaywisePrint from "./CashflowdaywisePrint";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import Autocomplete from "@mui/material/Autocomplete";
import axios from "axios";

export default function CashFlowDaywise() {

  const navigate = useNavigate();

  const [startDate, setStartDate] = useState("2025-04-01");
  const [endDate, setEndDate] = useState("2026-03-31");
  const [accountGroup, setAccountGroup] = useState("");

  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);

  const reportRef = useRef(null);

  const [printing, setPrinting] = useState(false);

  const [rows, setRows] = useState([]);

  /* FETCH ACCOUNT GROUP */

  useEffect(() => {

    fetch("https://publication.microtechsolutions.net.in/php/AccountGroupget.php")
      .then((res) => res.json())
      .then((data) => {

        setGroups(data);
        setLoading(false);

      })
      .catch(() => setLoading(false));

  }, []);

  /* FETCH CASH FLOW DATA */

  const fetchData = async () => {

    try {

      const res = await axios.get(
        "https://publication.microtechsolutions.net.in/php/get/getCashFlowDaywise.php",
        {
          params: {
            fromdate: startDate,
            todate: endDate,
            accountGroup: accountGroup
          }
        }
      );

      const data = res.data?.data || [];

      setRows(data);

      return data;

    } catch (error) {

      console.error("API ERROR:", error);
      return [];

    }

  };

  /* PRINT */

  const handlePrint = async () => {

    setPrinting(true);

    const data = await fetchData();

    if (!data.length) {

      alert("No Data Found");
      setPrinting(false);
      return;

    }

    setTimeout(async () => {

      try {

        const element = reportRef.current;

        const canvas = await html2canvas(element, {
          scale: 2,
          useCORS: true
        });

        const imgData = canvas.toDataURL("image/png");

        const pdf = new jsPDF("p", "mm", "a4");

        const imgWidth = 210;
        const imgHeight = canvas.height * imgWidth / canvas.width;

        pdf.addImage(imgData, "PNG", 0, 0, imgWidth, imgHeight);

        window.open(pdf.output("bloburl"), "_blank");

      } catch (error) {

        console.error(error);

      }

      setPrinting(false);

    }, 800);

  };

  const handleClose = () => navigate(-1);

  return (

    <Box sx={{
      minHeight: "100vh",
      background: "linear-gradient(135deg,#eef2f7,#e3e8f0)",
      display: "flex",
      justifyContent: "center",
      pt: 4
    }}>

      <Box width={540}>

        <Typography variant="h5" fontWeight={600} textAlign="center" mb={2}>
          Cash Flow Daywise
        </Typography>

        {/* PERIOD */}

        <Paper elevation={5} sx={{ p: 2.5, mb: 2.5 }}>

          <Box display="flex" gap={1} mb={1.5}>
            <DateRangeIcon color="primary"/>
            <Typography fontWeight={600}>Period</Typography>
          </Box>

          <Grid container spacing={2}>

            <Grid item xs={6}>
              <TextField
                label="Start Date"
                type="date"
                size="small"
                fullWidth
                value={startDate}
                InputLabelProps={{ shrink:true }}
                onChange={(e)=>setStartDate(e.target.value)}
              />
            </Grid>

            <Grid item xs={6}>
              <TextField
                label="End Date"
                type="date"
                size="small"
                fullWidth
                value={endDate}
                InputLabelProps={{ shrink:true }}
                onChange={(e)=>setEndDate(e.target.value)}
              />
            </Grid>

          </Grid>

        </Paper>

        {/* ACCOUNT GROUP */}

        <Paper elevation={5} sx={{ p: 2.5 }}>

          <Box display="flex" gap={1} mb={1.5}>
            <AccountBalanceIcon color="primary"/>
            <Typography fontWeight={600}>Account Group</Typography>
          </Box>

          <Autocomplete
            options={groups}
            loading={loading}
            value={groups.find(g=>g.GroupName===accountGroup) || null}
            onChange={(e,newVal)=>setAccountGroup(newVal?.GroupName || "")}
            getOptionLabel={(o)=>o.GroupName || ""}
            renderInput={(params)=>(
              <TextField
                {...params}
                size="small"
                placeholder="Type to filter..."
                InputProps={{
                  ...params.InputProps,
                  endAdornment: (
                    <>
                      {loading ? <CircularProgress size={20}/> : null}
                      {params.InputProps.endAdornment}
                    </>
                  )
                }}
              />
            )}
          />

        </Paper>

        {/* BUTTONS */}

        <Box display="flex" justifyContent="center" gap={2.5} mt={3}>

          <Button
            variant="contained"
            startIcon={<PrintIcon/>}
            onClick={handlePrint}
            disabled={printing}
          >
            {printing ? "Generating..." : "Print Report"}
          </Button>

          <Button
            variant="contained"
            color="error"
            startIcon={<CloseIcon/>}
            onClick={handleClose}
          >
            Close
          </Button>

        </Box>

      </Box>

      {/* HIDDEN PRINT */}

      <Box sx={{ position:"absolute", top:"-10000px" }}>

        <div ref={reportRef}>

          <CashflowdaywisePrint
            startDate={startDate}
            endDate={endDate}
            rows={rows}
          />

        </div>

      </Box>

    </Box>

  );

}