// import React, { useState, useRef } from "react";
// import {
//   Box,
//   Paper,
//   Typography,
//   TextField,
//   Button,
//   Grid,
//   CircularProgress
// } from "@mui/material";

// import DateRangeIcon from "@mui/icons-material/DateRange";
// import PrintIcon from "@mui/icons-material/Print";
// import CloseIcon from "@mui/icons-material/Close";

// import dayjs from "dayjs";

// import html2canvas from "html2canvas";
// import jsPDF from "jspdf";

// import TDSMasterListingPrint from "./TDSmasterlistingPrint";

// export default function TDSMasterListing() {

//   const reportRef = useRef();

//   const [printing, setPrinting] = useState(false);

//   /* ===============================
//      FINANCIAL YEAR DEFAULT
//   =============================== */

//   const today = dayjs();
//   const year = today.year();
//   const month = today.month();

//   let fyStart, fyEnd;

//   if (month < 3) {
//     fyStart = dayjs(`${year - 1}-04-01`);
//     fyEnd = dayjs(`${year}-03-31`);
//   } else {
//     fyStart = dayjs(`${year}-04-01`);
//     fyEnd = dayjs(`${year + 1}-03-31`);
//   }

//   const [startDate, setStartDate] =
//     useState(fyStart.format("YYYY-MM-DD"));

//   const [endDate, setEndDate] =
//     useState(fyEnd.format("YYYY-MM-DD"));


//   /* ===============================
//      HANDLE PRINT → PDF
//   =============================== */

//   const handlePrint = async () => {

//     setPrinting(true);

//     setTimeout(async () => {

//       try {

//         const element = reportRef.current;

//         if (!element) return;

//         const canvas = await html2canvas(element, {
//           scale: 2,
//           useCORS: true
//         });

//         const imgData = canvas.toDataURL("image/png");

//         const pdf = new jsPDF("p", "mm", "a4");

//         pdf.addImage(imgData, "PNG", 0, 0, 210, 297);

//         window.open(pdf.output("bloburl"), "_blank");

//       }
//       catch (error) {

//         console.error(error);

//       }
//       finally {

//         setPrinting(false);

//       }

//     }, 500);

//   };


//   const handleClose = () => window.history.back();


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

//       <Box width={520}>


//         <Typography
//           variant="h5"
//           fontWeight={600}
//           textAlign="center"
//           mb={2}
//         >
//           TDS Master Listing
//         </Typography>


//         <Paper elevation={5} sx={{ p: 2.5, borderRadius: 2.5 }}>

//           <Box display="flex" alignItems="center" gap={1} mb={1.5}>
//             <DateRangeIcon fontSize="small" color="primary"/>
//             <Typography fontWeight={600}>
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
//                 onChange={(e)=>setStartDate(e.target.value)}
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
//                 onChange={(e)=>setEndDate(e.target.value)}
//               />
//             </Grid>

//           </Grid>

//         </Paper>


//         <Box display="flex" justifyContent="center" gap={2.5} mt={3}>

//           <Button
//             variant="contained"
//             startIcon={<PrintIcon />}
//             onClick={handlePrint}
//             disabled={printing}
//           >
//             {printing ? "Generating..." : "Print"}
//           </Button>


//           <Button
//             variant="contained"
//             color="error"
//             startIcon={<CloseIcon />}
//             onClick={handleClose}
//           >
//             Close
//           </Button>

//         </Box>


//         {printing &&
//           <Box textAlign="center" mt={2}>
//             <CircularProgress size={24}/>
//           </Box>
//         }


//       </Box>


//       {/* HIDDEN PRINT AREA */}

//       <Box sx={{
//         position: "absolute",
//         top: "-10000px",
//         left: "-10000px"
//       }}>

//         <div ref={reportRef}>

//           <TDSMasterListingPrint
//             startDate={startDate}
//             endDate={endDate}
//           />

//         </div>

//       </Box>


//     </Box>

//   );
// }





import React, { useState, useRef } from "react";
import axios from "axios";
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
import PrintIcon from "@mui/icons-material/Print";
import CloseIcon from "@mui/icons-material/Close";

import dayjs from "dayjs";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

import TDSMasterListingPrint from "./TDSmasterlistingPrint";

export default function TDSMasterListing() {

  const reportRef = useRef();

  const [printing, setPrinting] = useState(false);
  const [rows, setRows] = useState([]);

  const today = dayjs();
  const year = today.year();
  const month = today.month();

  let fyStart, fyEnd;

  if (month < 3) {
    fyStart = dayjs(`${year - 1}-04-01`);
    fyEnd = dayjs(`${year}-03-31`);
  } else {
    fyStart = dayjs(`${year}-04-01`);
    fyEnd = dayjs(`${year + 1}-03-31`);
  }

  const [startDate, setStartDate] = useState(fyStart.format("YYYY-MM-DD"));
  const [endDate, setEndDate] = useState(fyEnd.format("YYYY-MM-DD"));

  /* ===============================
     FETCH API
  =============================== */

  const fetchData = async () => {

    try {

      const res = await axios.get(
        "https://publication.microtechsolutions.net.in/php/get/getTDSMasterListing.php",
        {
          params: {
            fromdate: startDate,
            todate: endDate
          }
        }
      );

      setRows(res.data || []);

    } catch (err) {

      console.error(err);

    }

  };

  /* ===============================
     PRINT
  =============================== */

  const handlePrint = async () => {

    setPrinting(true);

    await fetchData();

    setTimeout(async () => {

      try {

        const element = reportRef.current;

        const canvas = await html2canvas(element, {
          scale: 2,
          useCORS: true
        });

        const imgData = canvas.toDataURL("image/png");

        const pdf = new jsPDF("p", "mm", "a4");

        pdf.addImage(imgData, "PNG", 0, 0, 210, 297);

        window.open(pdf.output("bloburl"), "_blank");

      } catch (error) {

        console.error(error);

      } finally {

        setPrinting(false);

      }

    }, 600);

  };

  const handleClose = () => window.history.back();

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

      <Box width={520}>

        <Typography variant="h5" fontWeight={600} textAlign="center" mb={2}>
          TDS Master Listing
        </Typography>

        <Paper elevation={5} sx={{ p: 2.5, borderRadius: 2.5 }}>

          <Box display="flex" alignItems="center" gap={1} mb={1.5}>
            <DateRangeIcon fontSize="small" color="primary"/>
            <Typography fontWeight={600}>
              Period
            </Typography>
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
                onChange={(e)=>setStartDate(e.target.value)}
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
                onChange={(e)=>setEndDate(e.target.value)}
              />
            </Grid>

          </Grid>

        </Paper>

        <Box display="flex" justifyContent="center" gap={2.5} mt={3}>

          <Button
            variant="contained"
            startIcon={<PrintIcon />}
            onClick={handlePrint}
            disabled={printing}
          >
            {printing ? "Generating..." : "Print"}
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

        {printing &&
          <Box textAlign="center" mt={2}>
            <CircularProgress size={24}/>
          </Box>
        }

      </Box>

      {/* PRINT AREA */}

      <Box sx={{ position: "absolute", top: "-10000px", left: "-10000px" }}>

        <div ref={reportRef}>

          <TDSMasterListingPrint
            startDate={startDate}
            endDate={endDate}
            rows={rows}
          />

        </div>

      </Box>

    </Box>

  );

}