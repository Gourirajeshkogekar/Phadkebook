// import React, { useState ,useEffect, useRef} from "react";
// import {
//   Box,
//   Paper,
//   Typography,
//   TextField,
//   Button,
//   MenuItem,
//   Radio,
//   RadioGroup,
//   FormControlLabel,CircularProgress,
//   Grid
// } from "@mui/material";
// import AccountBalanceIcon from "@mui/icons-material/AccountBalance";

// import PrintIcon from "@mui/icons-material/Print";
// import CloseIcon from "@mui/icons-material/Close";
// import { useNavigate } from "react-router-dom";
// import InwardregPrint from "./InwardregPrint";
// import html2canvas from "html2canvas";
// import jsPDF from "jspdf";
// import Autocomplete from "@mui/material/Autocomplete"; // Ensure this is imported


// export default function InwardRegister() {


//   const navigate = useNavigate();
//   const [startDate, setStartDate] = useState("2026-04-01");
//   const [endDate, setEndDate] = useState("2026-03-31");
//   const [showBooks, setShowBooks] = useState("no");
//   const [accountGroup, setAccountGroup] = useState("");
//  const reportRef = useRef(null);
//   const [printing, setPrinting] = useState(false);
//  const [groups, setGroups] = useState([]);
//   const [loading, setLoading] = useState(true);
//  // --- FETCH DATA FROM API ---
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


//  const handlePrint = async () => {
//     if (!reportRef.current) return;
//     setPrinting(true);

//     try {
 
//       // Small delay to allow the hidden component to render the dynamic data
//       await new Promise((resolve) => setTimeout(resolve, 500));

//       const element = reportRef.current;
//       const canvas = await html2canvas(element, {
//         scale: 2,
//         useCORS: true,
//         logging: false,
//       });

//       const imgData = canvas.toDataURL("image/png");
//       const pdf = new jsPDF("p", "mm", "a4");
      
//       // A4 dimensions: 210mm x 297mm
//       pdf.addImage(imgData, "PNG", 0, 0, 210, 297);
//       window.open(pdf.output("bloburl"), "_blank");
//     } catch (error) {
//       console.error("PDF Generation Error:", error);
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
//         pt: 4
//       }}
//     >
//       <Box width={540}>

//         {/* TITLE */}

//         <Typography
//           variant="h5"
//           fontWeight={600}
//           textAlign="center"
//           mb={2}
//         >
//           Inward Register
//         </Typography>

//         {/* PERIOD */}

//         <Paper sx={{ p: 2.5, borderRadius: 2.5, mb: 2.5 }}>
//           <Typography fontWeight={600} fontSize={15} mb={2}>
//             Period
//           </Typography>

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

//         {/* SHOW BOOKS */}

//         <Paper sx={{ p: 2.5, borderRadius: 2.5, mb: 2.5 }}>
//           <Typography fontWeight={600} fontSize={15}>
//             Show Books ?
//           </Typography>

//           <RadioGroup
//             row
//             value={showBooks}
//             onChange={(e) => setShowBooks(e.target.value)}
//           >
//             <FormControlLabel value="yes" control={<Radio size="small" />} label="Yes" />
//             <FormControlLabel value="no" control={<Radio size="small" />} label="No" />
//           </RadioGroup>
//         </Paper>

 
//          {/* ACCOUNT GROUP SECTION */}
//         <Paper elevation={5} sx={{ p: 2.5, borderRadius: 2.5 }}>
//           <Box display="flex" alignItems="center" gap={1} mb={1.5}>
//             <AccountBalanceIcon fontSize="small" color="primary" />
//             <Typography fontWeight={600} fontSize={15}>Account Group</Typography>
//           </Box>

//         <Autocomplete
//     id="account-group-autocomplete"
//     options={groups}
//     loading={loading}
//     // Logic to find the current object based on the stored string value
//     value={groups.find((g) => g.GroupName === accountGroup) || null}
//     // Extract GroupName when an item is selected
//     onChange={(event, newValue) => {
//       setAccountGroup(newValue ? newValue.GroupName : "");
//     }}
//     // This tells Autocomplete which property to show in the list
//     getOptionLabel={(option) => option.GroupName.replace(/\r?\n|\r/g, " ") || ""}
//     renderInput={(params) => (
//       <TextField
//         {...params}
//          size="small"
//         fullWidth
//         placeholder="Type to filter..."
//         InputProps={{
//           ...params.InputProps,
//           endAdornment: (
//             <React.Fragment>
//               {loading ? <CircularProgress color="inherit" size={20} /> : null}
//               {params.InputProps.endAdornment}
//             </React.Fragment>
//           ),
//         }}
//       />
//     )}
//   />
//         </Paper>

//         {/* BUTTONS */}

//         <Box display="flex" justifyContent="center" gap={2.5} mt={3}>
//           <Button
//             variant="contained"
//             size="medium"
//             startIcon={<PrintIcon />}
//             onClick={handlePrint}
//             sx={{
//               px: 3.5,
//               py: 1,
//               fontSize: 14,
//               fontWeight: 600,
//               borderRadius: 2,
//               minWidth: 170
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
//               px: 3.5,
//               py: 1,
//               fontSize: 14,
//               fontWeight: 600,
//               borderRadius: 2,
//               minWidth: 120
//             }}
//           >
//             Close
//           </Button>
//         </Box>

//       </Box>

//         <Box sx={{ position: "absolute", top: "-10000px", left: "-10000px",  }}>
//               <div ref={reportRef} style={{ width: "210mm" }}>
//                 <InwardregPrint 
//                   state={{ startDate, endDate, accountGroup }} 
//                 />
//               </div>
//             </Box>
//     </Box>
//   );
// }

import React, { useState ,useEffect, useRef} from "react";
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  MenuItem,
  Radio,
  RadioGroup,
  FormControlLabel,CircularProgress,
  Grid
} from "@mui/material";
import AccountBalanceIcon from "@mui/icons-material/AccountBalance";

import PrintIcon from "@mui/icons-material/Print";
import CloseIcon from "@mui/icons-material/Close";
import { useNavigate } from "react-router-dom";
import InwardregPrint from "./InwardregPrint";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import Autocomplete from "@mui/material/Autocomplete"; // Ensure this is imported


export default function InwardRegister() {


  const navigate = useNavigate();
  const [startDate, setStartDate] = useState("2026-04-01");
  const [endDate, setEndDate] = useState("2026-03-31");
  const [showBooks, setShowBooks] = useState("no");
  const [accountGroup, setAccountGroup] = useState("");
 const reportRef = useRef(null);
  const [printing, setPrinting] = useState(false);
 const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);
 // --- FETCH DATA FROM API ---
  useEffect(() => {
    fetch("https://publication.microtechsolutions.net.in/php/AccountGroupget.php")
      .then((response) => response.json())
      .then((data) => {
        setGroups(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching account groups:", error);
        setLoading(false);
      });
  }, []);


 const handlePrint = async () => {
    if (!reportRef.current) return;
    setPrinting(true);

    try {
 
      // Small delay to allow the hidden component to render the dynamic data
      await new Promise((resolve) => setTimeout(resolve, 500));

      const element = reportRef.current;
      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        logging: false,
      });

      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");
      
      // A4 dimensions: 210mm x 297mm
      pdf.addImage(imgData, "PNG", 0, 0, 210, 297);
      window.open(pdf.output("bloburl"), "_blank");
    } catch (error) {
      console.error("PDF Generation Error:", error);
    } finally {
      setPrinting(false);
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
        pt: 4
      }}
    >
      <Box width={540}>

        {/* TITLE */}

        <Typography
          variant="h5"
          fontWeight={600}
          textAlign="center"
          mb={2}
        >
          Inward Register
        </Typography>

        {/* PERIOD */}

        <Paper sx={{ p: 2.5, borderRadius: 2.5, mb: 2.5 }}>
          <Typography fontWeight={600} fontSize={15} mb={2}>
            Period
          </Typography>

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
        </Paper>

        {/* SHOW BOOKS */}

        <Paper sx={{ p: 2.5, borderRadius: 2.5, mb: 2.5 }}>
          <Typography fontWeight={600} fontSize={15}>
            Show Books ?
          </Typography>

          <RadioGroup
            row
            value={showBooks}
            onChange={(e) => setShowBooks(e.target.value)}
          >
            <FormControlLabel value="yes" control={<Radio size="small" />} label="Yes" />
            <FormControlLabel value="no" control={<Radio size="small" />} label="No" />
          </RadioGroup>
        </Paper>

 
         {/* ACCOUNT GROUP SECTION */}
        <Paper elevation={5} sx={{ p: 2.5, borderRadius: 2.5 }}>
          <Box display="flex" alignItems="center" gap={1} mb={1.5}>
            <AccountBalanceIcon fontSize="small" color="primary" />
            <Typography fontWeight={600} fontSize={15}>Account Group</Typography>
          </Box>

        <Autocomplete
    id="account-group-autocomplete"
    options={groups}
    loading={loading}
    // Logic to find the current object based on the stored string value
    value={groups.find((g) => g.GroupName === accountGroup) || null}
    // Extract GroupName when an item is selected
    onChange={(event, newValue) => {
      setAccountGroup(newValue ? newValue.GroupName : "");
    }}
    // This tells Autocomplete which property to show in the list
    getOptionLabel={(option) => option.GroupName.replace(/\r?\n|\r/g, " ") || ""}
    renderInput={(params) => (
      <TextField
        {...params}
         size="small"
        fullWidth
        placeholder="Type to filter..."
        InputProps={{
          ...params.InputProps,
          endAdornment: (
            <React.Fragment>
              {loading ? <CircularProgress color="inherit" size={20} /> : null}
              {params.InputProps.endAdornment}
            </React.Fragment>
          ),
        }}
      />
    )}
  />
        </Paper>

        {/* BUTTONS */}

        <Box display="flex" justifyContent="center" gap={2.5} mt={3}>
          <Button
            variant="contained"
            size="medium"
            startIcon={<PrintIcon />}
            onClick={handlePrint}
            sx={{
              px: 3.5,
              py: 1,
              fontSize: 14,
              fontWeight: 600,
              borderRadius: 2,
              minWidth: 170
            }}
          >
            Print Report
          </Button>

          <Button
            variant="contained"
            color="error"
            size="medium"
            startIcon={<CloseIcon />}
            onClick={handleClose}
            sx={{
              px: 3.5,
              py: 1,
              fontSize: 14,
              fontWeight: 600,
              borderRadius: 2,
              minWidth: 120
            }}
          >
            Close
          </Button>
        </Box>

      </Box>

        <Box sx={{ position: "absolute", top: "-10000px", left: "-10000px",  }}>
              <div ref={reportRef} style={{ width: "210mm" }}>
                <InwardregPrint 
                  state={{ startDate, endDate, accountGroup }} 
                />
              </div>
            </Box>
    </Box>
  );
}