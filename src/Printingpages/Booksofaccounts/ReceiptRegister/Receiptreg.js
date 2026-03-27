// import React, { useState, useRef } from "react";
// import {
//   Box,
//   Paper,
//   Typography,
//   TextField,
//   Button,
//   IconButton,
//   Grid,
//   CircularProgress
// } from "@mui/material";

// import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
// import PrintIcon from "@mui/icons-material/Print";
// import CloseIcon from "@mui/icons-material/Close";

// import dayjs from "dayjs";
// import html2canvas from "html2canvas";
// import jsPDF from "jspdf";

// export default function ReceiptRegister() {

//   const reportRef = useRef();

//   const [printing, setPrinting] = useState(false);

 

//   const getFinancialYear = () => {

//     const today = dayjs();
//     const year = today.year();
//     const month = today.month();

//     if (month < 3) {
//       return {
//         start: `${year - 1}-04-01`,
//         end: `${year}-03-31`
//       };
//     } else {
//       return {
//         start: `${year}-04-01`,
//         end: `${year + 1}-03-31`
//       };
//     }

//   };

//   const fy = getFinancialYear();

//   const [startDate, setStartDate] = useState(fy.start);
//   const [endDate, setEndDate] = useState(fy.end);

//   /* ===============================
//      PRINT FUNCTION (FIXED)
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

//         const pageWidth = pdf.internal.pageSize.getWidth();
//         const pageHeight = pdf.internal.pageSize.getHeight();

//         const imgWidth = canvas.width;
//         const imgHeight = canvas.height;

//         const ratio = Math.min(
//           pageWidth / imgWidth,
//           pageHeight / imgHeight
//         );

//         const finalWidth = imgWidth * ratio;
//         const finalHeight = imgHeight * ratio;

//         const marginX = (pageWidth - finalWidth) / 2;
//         const marginY = 10;

//         pdf.addImage(
//           imgData,
//           "PNG",
//           marginX,
//           marginY,
//           finalWidth,
//           finalHeight
//         );

//         window.open(pdf.output("bloburl"), "_blank");

//       }
//       catch (error) {

//         console.error(error);

//       }
//       finally {

//         setPrinting(false);

//       }

//     }, 300);

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
//           Receipt Register
//         </Typography>


//         <Paper elevation={5} sx={{ p: 2.5 }}>

//           <Typography fontWeight={600} mb={2}>
//             Period
//           </Typography>

//           <Grid container spacing={2}>

//             <Grid item xs={6}>

//               <TextField
//                 label="Start Date"
//                 type="date"
//                 fullWidth
//                 size="small"
//                 value={startDate}
//                 onChange={(e)=>setStartDate(e.target.value)}
//                 InputLabelProps={{ shrink: true }}
//                 InputProps={{
//                   endAdornment: (
//                     <IconButton size="small">
//                       <CalendarMonthIcon/>
//                     </IconButton>
//                   )
//                 }}
//               />

//             </Grid>


//             <Grid item xs={6}>

//               <TextField
//                 label="End Date"
//                 type="date"
//                 fullWidth
//                 size="small"
//                 value={endDate}
//                 onChange={(e)=>setEndDate(e.target.value)}
//                 InputLabelProps={{ shrink: true }}
//                 InputProps={{
//                   endAdornment: (
//                     <IconButton size="small">
//                       <CalendarMonthIcon/>
//                     </IconButton>
//                   )
//                 }}
//               />

//             </Grid>

//           </Grid>

//         </Paper>


//         <Box display="flex" justifyContent="center" gap={2.5} mt={3}>

//           <Button
//             variant="contained"
//             startIcon={
//               printing
//               ? <CircularProgress size={18} color="inherit"/>
//               : <PrintIcon/>
//             }
//             onClick={handlePrint}
//             disabled={printing}
//           >
//             {printing ? "Generating PDF..." : "Print Report"}
//           </Button>


//           <Button
//             variant="contained"
//             color="error"
//             startIcon={<CloseIcon/>}
//             onClick={handleClose}
//           >
//             Close
//           </Button>

//         </Box>

//       </Box>


//       {/* ===============================
//          HIDDEN REPORT (PDF CONTENT)
//       =============================== */}

//       <Box
//         ref={reportRef}
//         sx={{
//           position: "absolute",
//           left: "-9999px",
//           width: "190mm",
//           background: "#fff",
//           padding: "6mm",
//           fontFamily: "Times New Roman",
//           fontSize: "11px"
//         }}
//       >

//         <div style={{
//           textAlign: "center",
//           fontWeight: "bold",
//           fontSize: "14px"
//         }}>
//           Phadke Prakashan, Kolhapur
//         </div>

//         <div style={{
//           textAlign: "center",
//           fontSize: "12px",
//           marginBottom: "6px"
//         }}>
//           Receipt Register
//         </div>

//         <div style={{
//           textAlign: "center",
//           fontSize: "11px",
//           marginBottom: "10px"
//         }}>
//           From {startDate} to {endDate}
//         </div>


//         <table width="100%" style={{
//           borderCollapse: "collapse",
//           fontSize: "11px"
//         }}>

//           <thead>

//             <tr>

//               <th style={th}>Rcpt No</th>
//               <th style={th}>Account Name</th>
//               <th style={th}>Particulars</th>
//               <th style={thRight}>Cash</th>
//               <th style={thRight}>Chq</th>
//               <th style={thRight}>DD</th>

//             </tr>

//           </thead>

//           <tbody>

//             <tr>

//               <td colSpan="6" style={{
//                 textAlign: "center",
//                 padding: "15px"
//               }}>
//                 Backend data will render here
//               </td>

//             </tr>

//           </tbody>

//         </table>

//       </Box>

//     </Box>

//   );

// }


 

// const th = {
//   border: "1px solid black",
//   padding: "4px",
//   textAlign: "left"
// };

// const thRight = {
//   border: "1px solid black",
//   padding: "4px",
//   textAlign: "right"
// };


import React, { useState } from "react";
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Grid,
  CircularProgress
} from "@mui/material";

import PrintIcon from "@mui/icons-material/Print";
import CloseIcon from "@mui/icons-material/Close";

import axios from "axios";
import dayjs from "dayjs";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export default function ReceiptRegister() {

  const [printing,setPrinting] = useState(false);

  const getFinancialYear = () => {

    const today = dayjs();
    const year = today.year();
    const month = today.month();

    if(month < 3){
      return {
        start:`${year-1}-04-01`,
        end:`${year}-03-31`
      };
    }else{
      return{
        start:`${year}-04-01`,
        end:`${year+1}-03-31`
      };
    }

  };

  const fy = getFinancialYear();

  const [startDate,setStartDate] = useState(fy.start);
  const [endDate,setEndDate] = useState(fy.end);

  const fetchData = async () => {

    try{

      const res = await axios.get(
        "https://publication.microtechsolutions.net.in/php/get/getReceiptRegister.php",
        {
          params:{
            fromdate:startDate,
            todate:endDate
          }
        }
      );

      return res.data || [];

    }catch(err){

      console.error(err);
      return [];

    }

  };

  const handlePrint = async () => {

    setPrinting(true);

    const data = await fetchData();

    if(!data.length){
      alert("No Data Found");
      setPrinting(false);
      return;
    }

    const pdf = new jsPDF("p","mm","a4");

    /* TABLE DATA PROCESS */

    const tableBody = [];

    data.forEach(row=>{

      /* DATE HEADER ROW */

      if(row["Account Name"] === "DATE HEADER"){

        const formattedDate = dayjs(row.Date).format("DD-MM-YYYY");

        tableBody.push([
          {
            content:`Date : ${formattedDate}`,
            colSpan:6,
            styles:{
              halign:"left",
              fontStyle:"bold",
              fillColor:[230,230,230]
            }
          }
        ]);

      }else{

        tableBody.push([
          row["Rcpt No"],
          row["Account Name"],
          row["Particulars"],
          row["Cash"],
          row["Chq"],
          row["DD"]
        ]);

      }

    });

    autoTable(pdf,{

      startY:35,

      head:[[
        "Rcpt No",
        "Account Name",
        "Particulars",
        "Cash",
        "Chq",
        "DD"
      ]],

      body:tableBody,

      theme:"grid",

      styles:{
        fontSize:9,
        cellPadding:2
      },

      columnStyles:{
        0:{halign:"center",cellWidth:18},
        1:{cellWidth:55},
        2:{cellWidth:50},
        3:{halign:"right",cellWidth:20},
        4:{halign:"right",cellWidth:20},
        5:{halign:"right",cellWidth:20}
      },

      margin:{
        top:35,
        left:10,
        right:10
      },

      /* HEADER EVERY PAGE */

      didDrawPage:function(){

        pdf.setFontSize(14);
        pdf.text("Phadke Prakashan, Kolhapur",105,15,{align:"center"});

        pdf.setFontSize(12);
        pdf.text("Receipt Register",105,22,{align:"center"});

        pdf.setFontSize(10);
        pdf.text(`Period : ${startDate} to ${endDate}`,105,28,{align:"center"});

      }

    });

    window.open(pdf.output("bloburl"),"_blank");

    setPrinting(false);

  };

  const handleClose = () => window.history.back();

  return (

    <Box
      sx={{
        minHeight:"100vh",
        background:"linear-gradient(135deg,#eef2f7,#e3e8f0)",
        display:"flex",
        justifyContent:"center",
        pt:4
      }}
    >

      <Box width={520}>

        <Typography
          variant="h5"
          fontWeight={600}
          textAlign="center"
          mb={2}
        >
          Receipt Register
        </Typography>

        <Paper elevation={5} sx={{p:2.5}}>

          <Typography fontWeight={600} mb={2}>
            Period
          </Typography>

          <Grid container spacing={2}>

            <Grid item xs={6}>
              <TextField
                label="Start Date"
                type="date"
                fullWidth
                size="small"
                value={startDate}
                InputLabelProps={{shrink:true}}
                onChange={(e)=>setStartDate(e.target.value)}
              />
            </Grid>

            <Grid item xs={6}>
              <TextField
                label="End Date"
                type="date"
                fullWidth
                size="small"
                value={endDate}
                InputLabelProps={{shrink:true}}
                onChange={(e)=>setEndDate(e.target.value)}
              />
            </Grid>

          </Grid>

        </Paper>

        <Box display="flex" justifyContent="center" gap={2} mt={3}>

          <Button
            variant="contained"
            startIcon={
              printing
              ? <CircularProgress size={18} color="inherit"/>
              : <PrintIcon/>
            }
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

    </Box>

  );

}