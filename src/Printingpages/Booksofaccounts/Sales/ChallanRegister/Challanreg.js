// import React, { useState, useEffect, useRef } from "react";
// import {
//   Box,
//   Paper,
//   Typography,
//   TextField,
//   Radio,
//   RadioGroup,
//   FormControlLabel,
//   Button,
//   Grid,
//   Autocomplete,
//   CircularProgress
// } from "@mui/material";
// import axios from "axios";
// import PrintIcon from "@mui/icons-material/Print";
// import CloseIcon from "@mui/icons-material/Close";
// import html2canvas from "html2canvas";
// import jsPDF from "jspdf";
// import ChallanRegisterPrint from "./ChallanregisterPrint";

// export default function ChallanRegister() {
//   const [startDate, setStartDate] = useState("2025-04-01");
//   const [endDate, setEndDate] = useState("2026-03-31");
//   const [showBooks, setShowBooks] = useState("No");
  
//   // Single state for party list and loading
//   const [parties, setParties] = useState([]); 
//   const [party, setParty] = useState(null); 
//   const [loadingParties, setLoadingParties] = useState(false);

//   // Fetching accounts for the Party dropdown
//   useEffect(() => {
//     const fetchAccounts = async () => {
//       setLoadingParties(true);
//       try {
//         const res = await axios.get(
//           "https://publication.microtechsolutions.net.in/php/Accountget.php"
//         );
//         // The API returns an array of objects like { Id, AccountName, ... }
//         setParties(Array.isArray(res.data) ? res.data : []);
//       } catch (err) {
//         console.error("Error fetching accounts:", err);
//       } finally {
//         setLoadingParties(false);
//       }
//     };
//     fetchAccounts();
//   }, []);

//   const reportRef = useRef(null);
//   const [printing, setPrinting] = useState(false);

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

//   return (
//     <Box sx={{ 
//       display: "flex", 
//       justifyContent: "center", 
//       alignItems: "center", 
//       minHeight: "90vh", 
//       bgcolor: "#f5f5f5" ,   
//     }}>
//       <Paper elevation={3} sx={{  width: "100%", maxWidth: 800, bgcolor: "#fff",   }}>
//         <Typography variant="h5" fontWeight={600} textAlign="center" mb={1}>
//           Challan Register
//         </Typography>

//         <Grid container spacing={3}>
//           {/* Period Selection */}
//           <Grid item xs={12}>
//             <Box component="fieldset" sx={{ border: "1px solid #ccc", p: 2, borderRadius: 1 }}>
//               <legend style={{ fontSize: "14px", fontWeight: "bold", padding: "0 5px" }}>Period</legend>
//               <Grid container spacing={2} alignItems="center">
//                 <Grid item xs={4}><Typography variant="body2">Start Date</Typography></Grid>
//                 <Grid item xs={8}>
//                   <TextField type="date" size="small" fullWidth value={startDate} onChange={(e) => setStartDate(e.target.value)} />
//                 </Grid>
//                 <Grid item xs={4}><Typography variant="body2">End Date</Typography></Grid>
//                 <Grid item xs={8}>
//                   <TextField type="date" size="small" fullWidth value={endDate} onChange={(e) => setEndDate(e.target.value)} />
//                 </Grid>
//               </Grid>
//             </Box>
//           </Grid>

//           {/* Show Books Toggle */}
//           <Grid item xs={12}>
//             <Box component="fieldset" sx={{ border: "1px solid #ccc", p: 2, borderRadius: 1 }}>
//               <legend style={{ fontSize: "14px", fontWeight: "bold", padding: "0 5px" }}>Show Books ?</legend>
//               <RadioGroup row value={showBooks} onChange={(e) => setShowBooks(e.target.value)}>
//                 <FormControlLabel value="Yes" control={<Radio size="small" />} label="Yes" />
//                 <FormControlLabel value="No" control={<Radio size="small" />} label="No" />
//               </RadioGroup>
//             </Box>
//           </Grid>

//           {/* Party Selection - Now connected to the API state */}
//           <Grid item xs={12}>
//             <Box component="fieldset" sx={{ border: "1px solid #ccc", p: 1, borderRadius: 1 }}>
//               <legend style={{ fontSize: "14px", fontWeight: "bold", padding: "0 5px" }}>Party</legend>
//               <Autocomplete
//                 size="small"
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
//             </Box>
//           </Grid>

//           {/* Action Buttons */}
//           <Grid item xs={12} sx={{ display: "flex", justifyContent: "center", gap: 2, mt: 1 }}>
//             <Button variant="contained" startIcon={<PrintIcon />} onClick={handlePrint} disabled={printing}>
//               {printing ? "Generating..." : "Print"}
//             </Button>
//             <Button variant="contained" color="error" startIcon={<CloseIcon />} onClick={() => window.history.back()}>
//               Close
//             </Button>
//           </Grid>
//         </Grid>
//       </Paper>

//       {/* Hidden Print Section */}
//       <Box sx={{ position: "absolute", top: "-10000px", left: "-10000px" }}>
//         <div ref={reportRef}>
//           <ChallanRegisterPrint state={{ 
//             startDate, 
//             endDate, 
//             partyName: party?.AccountName || "All Parties" 
//           }} />
//         </div>
//       </Box>
//     </Box>
//   );
// }


import React, { useState, useEffect, useRef } from "react";
import {
  Box,
  Paper,
  Typography,
  TextField,
  Radio,
  RadioGroup,
  FormControlLabel,
  Button,
  Grid,
  Autocomplete,
  CircularProgress,
  Stack
} from "@mui/material";

import axios from "axios";
import PrintIcon from "@mui/icons-material/Print";
import CloseIcon from "@mui/icons-material/Close";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import ChallanRegisterPrint from "./ChallanregisterPrint";

export default function ChallanRegister() {

  const [startDate, setStartDate] = useState("2025-04-01");
  const [endDate, setEndDate] = useState("2026-03-31");
  const [showBooks, setShowBooks] = useState("No");

  const [parties, setParties] = useState([]);
  const [party, setParty] = useState(null);
  const [loadingParties, setLoadingParties] = useState(false);

  const [reportData, setReportData] = useState([]);
  const [printing, setPrinting] = useState(false);

  const reportRef = useRef(null);

  /* Fetch Party List */
  useEffect(() => {

    const fetchAccounts = async () => {

      setLoadingParties(true);

      try {

        const res = await axios.get(
          "https://publication.microtechsolutions.net.in/php/Accountget.php"
        );

        setParties(Array.isArray(res.data) ? res.data : []);

      } catch (err) {

        console.error("Error fetching accounts:", err);

      } finally {

        setLoadingParties(false);

      }

    };

    fetchAccounts();

  }, []);

  /* PRINT BUTTON */
  const handlePrint = async () => {

    try {

      setPrinting(true);

      const newTab = window.open("", "_blank");

      const showBooksValue = showBooks === "Yes" ? "yes" : "no";

      const response = await axios.get(
        "https://publication.microtechsolutions.net.in/php/get/getChallanRegister.php",
        {
          params: {
            fromdate: startDate,
            todate: endDate,
            showBooks: showBooksValue,
            party: party?.AccountId || party?.Id || ""
          }
        }
      );

      setReportData(Array.isArray(response.data) ? response.data : []);

      setTimeout(async () => {

        const element = reportRef.current;

        const canvas = await html2canvas(element, {
          scale: 2,
          useCORS: true
        });

        const imgData = canvas.toDataURL("image/png");

        const pdf = new jsPDF("p", "mm", "a4");

        const imgWidth = 210;
        const imgHeight = (canvas.height * imgWidth) / canvas.width;

        let heightLeft = imgHeight;
        let position = 0;

        pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
        heightLeft -= 297;

        while (heightLeft > 0) {

          position = heightLeft - imgHeight;

          pdf.addPage();
          pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);

          heightLeft -= 297;

        }

        const blob = pdf.output("blob");
        const url = URL.createObjectURL(blob);

        newTab.location.href = url;

        setPrinting(false);

      }, 600);

    } catch (error) {

      console.error("API Error:", error);
      setPrinting(false);

    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        mt: 6,
        px: 2
      }}
    >

      <Paper
        elevation={5}
        sx={{
          width: "100%",
          maxWidth: 1000,
          p: 4,
          borderRadius: 3
        }}
      >

        <Typography
          variant="h4"
          fontWeight="bold"
          textAlign="center"
          mb={4}
        >
          Challan Register
        </Typography>

        <Grid container spacing={3}>

          {/* PERIOD */}
          <Grid item xs={12} md={8}>
            <Paper variant="outlined" sx={{ p: 3, borderRadius: 2 }}>
              <Typography fontWeight="bold" mb={2}>
                Period
              </Typography>

              <Stack direction="row" spacing={2}>

                <TextField
                  label="Start Date"
                  type="date"
                  fullWidth
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                />

                <TextField
                  label="End Date"
                  type="date"
                  fullWidth
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                />

              </Stack>
            </Paper>
          </Grid>

          {/* SHOW BOOKS */}
          <Grid item xs={12} md={4}>
            <Paper variant="outlined" sx={{ p: 3, borderRadius: 2 }}>
              <Typography fontWeight="bold" mb={2}>
                Show Books ?
              </Typography>

              <RadioGroup
                row
                value={showBooks}
                onChange={(e) => setShowBooks(e.target.value)}
              >
                <FormControlLabel value="Yes" control={<Radio />} label="Yes" />
                <FormControlLabel value="No" control={<Radio />} label="No" />
              </RadioGroup>

            </Paper>
          </Grid>

          {/* PARTY */}
          <Grid item xs={12}>
            <Autocomplete
              options={parties}
              loading={loadingParties}
              getOptionLabel={(option) => option.AccountName || ""}
              value={party}
              onChange={(e, newValue) => setParty(newValue)}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Party"
                  fullWidth
                  InputProps={{
                    ...params.InputProps,
                    endAdornment: (
                      <>
                        {loadingParties && <CircularProgress size={20} />}
                        {params.InputProps.endAdornment}
                      </>
                    )
                  }}
                />
              )}
            />
          </Grid>

          {/* BUTTONS */}
          <Grid item xs={12}>
            <Stack direction="row" spacing={2}>

              <Button
                variant="contained"
                size="large"
                startIcon={<PrintIcon />}
                onClick={handlePrint}
                disabled={printing}
                sx={{ px: 4 }}
              >
                {printing ? "Generating..." : "Print"}
              </Button>

              <Button
                variant="contained"
                color="error"
                size="large"
                startIcon={<CloseIcon />}
                onClick={() => window.history.back()}
                sx={{ px: 4 }}
              >
                Close
              </Button>

            </Stack>
          </Grid>

        </Grid>

      </Paper>

      {/* Hidden Print Area */}
      <Box sx={{ position: "absolute", top: "-10000px", left: "-10000px" }}>
        <div ref={reportRef}>
          <ChallanRegisterPrint
            data={reportData}
            startDate={startDate}
            endDate={endDate}
            showBooks={showBooks}
          />
        </div>
      </Box>

    </Box>
  );
}