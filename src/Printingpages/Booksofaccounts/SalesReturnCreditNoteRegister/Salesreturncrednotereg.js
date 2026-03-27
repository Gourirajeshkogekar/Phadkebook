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

// import PrintIcon from "@mui/icons-material/Print";
// import CloseIcon from "@mui/icons-material/Close";

// import dayjs from "dayjs";
// import html2canvas from "html2canvas";
// import jsPDF from "jspdf";

// export default function SalesReturnCreditNoteRegister() {

//   const reportRef = useRef();

//   const [printing, setPrinting] = useState(false);

//   /* ===============================
//      FINANCIAL YEAR DEFAULT
//   =============================== */

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
//      HANDLE PRINT → PDF → NEW TAB
//   =============================== */

//   const handlePrint = async () => {

//     setPrinting(true);

//     setTimeout(async () => {

//       try {

//         const element = reportRef.current;

//         if (!element) return;

//         const canvas = await html2canvas(element, {
//           scale: 1,   // IMPORTANT → prevent huge zoom
//           useCORS: true
//         });

//         const imgData = canvas.toDataURL("image/png");

//         const pdf = new jsPDF("p", "mm", "a4");

//         const imgWidth = 210;
//         const imgHeight = (canvas.height * imgWidth) / canvas.width;

//         pdf.addImage(imgData, "PNG", 0, 0, imgWidth, imgHeight);

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


//   const handleClose = () => {

//     window.history.back();

//   };


//   /* ===============================
//      UI
//   =============================== */

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
//           Sales Return Credit Note Register
//         </Typography>


//         <Paper elevation={5} sx={{ p: 3, borderRadius: 2 }}>

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
//               />
//             </Grid>

//           </Grid>

//         </Paper>


//         <Box display="flex" justifyContent="center" gap={3} mt={3}>

//           <Button
//             variant="contained"
//             startIcon={
//               printing ?
//               <CircularProgress size={18} color="inherit"/> :
//               <PrintIcon/>
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
//          HIDDEN PRINT REPORT
//       =============================== */}

//       <Box
//         ref={reportRef}
//         sx={{
//           position: "absolute",
//           left: "-9999px",
//           width: "210mm",
//           padding: "10mm",
//           fontFamily: "Times New Roman",
//           fontSize: "11px"
//         }}
//       >

//         <div style={{ textAlign: "center", fontWeight: "bold", fontSize: "14px" }}>
//           Phadke Prakashan, Kolhapur
//         </div>

//         <div style={{ textAlign: "center", fontSize: "12px", marginTop: "3px" }}>
//           Sales Return Credit Note Register
//         </div>

//         <div style={{ textAlign: "center", fontSize: "11px", marginBottom: "10px" }}>
//           From {startDate} to {endDate}
//         </div>


//         <table width="100%" style={{ borderCollapse: "collapse" }}>

//           <thead>
//             <tr>
//               <th style={th}>Entry No</th>
//               <th style={th}>Account Name</th>
//               <th style={th}>Particulars</th>
//               <th style={thRight}>Debit</th>
//               <th style={thRight}>Credit</th>
//             </tr>
//           </thead>

//           <tbody>
//             <tr>
//               <td colSpan="5" style={{ textAlign: "center", padding: "10px" }}>
//                 Backend data will render here
//               </td>
//             </tr>
//           </tbody>

//         </table>

//       </Box>

//     </Box>

//   );

// }


// /* TABLE STYLE */

// const th = {
//   border: "1px solid #000",
//   padding: "4px",
//   textAlign: "left"
// };

// const thRight = {
//   border: "1px solid #000",
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

export default function SalesReturnCreditNoteRegister() {

  const [loading,setLoading] = useState(false);
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
    }

    return {
      start:`${year}-04-01`,
      end:`${year+1}-03-31`
    }

  }

  const fy = getFinancialYear();

  const [startDate,setStartDate] = useState(fy.start);
  const [endDate,setEndDate] = useState(fy.end);


  /* FETCH REPORT */

  const fetchReport = async () => {

    try{

      setLoading(true);

      const response = await axios.get(
        "https://publication.microtechsolutions.net.in/php/get/getSalesReturnCreditNoteRegister.php",
        {
          params:{
            fromdate:startDate,
            todate:endDate
          }
        }
      )

      return response.data || {};

    }catch(err){

      console.log(err);
      return {};

    }finally{

      setLoading(false);

    }

  }


  /* GROUP BY DATE */

  const groupByDate = (rows)=>{

    const grouped = {};

    rows.forEach(row=>{

      if(!row.Date) return;

      if(!grouped[row.Date]){
        grouped[row.Date] = [];
      }

      grouped[row.Date].push(row);

    })

    return grouped;

  }


  /* PRINT */

  const handlePrint = async ()=>{

    setPrinting(true);

    try{

      const res = await fetchReport();

      const rows = res.data || [];

      const grouped = groupByDate(rows);

      const pdf = new jsPDF("p","mm","a4");

      const formatDate = (d)=> dayjs(d,"DD-MM-YYYY").format("DD MMM YYYY");


      /* HEADER */

      const drawHeader = ()=>{

        pdf.setFontSize(12);
        pdf.text("Phadke Prakashan, Kolhapur",105,10,{align:"center"});

        pdf.setFontSize(11);
        pdf.text("Sales Return Credit Note Register",105,16,{align:"center"});

        pdf.setFontSize(9);
        pdf.text(`From ${startDate} to ${endDate}`,105,21,{align:"center"});

      }


      const tableBody = [];

      Object.keys(grouped).forEach(date=>{

        const dateRows = grouped[date];

        /* DATE HEADER */

        tableBody.push([
          {
            content:formatDate(date),
            colSpan:5,
            styles:{
              fontStyle:"bold",
              fillColor:[245,245,245]
            }
          }
        ]);


        /* NORMAL ROWS */

        dateRows
        .filter(r=>!r.Account_Name.includes("DAY TOTAL"))
        .forEach(r=>{

          tableBody.push([
            r.Entry_No,
            r.Account_Name,
            r.Particulars,
            r.Debit,
            r.Credit
          ])

        })


        /* DAY TOTAL */

        const dayTotal = dateRows.find(r=>r.Account_Name === "**DAY TOTAL**");

        if(dayTotal){

          tableBody.push([
            {
              content:"Day Total",
              colSpan:4,
              styles:{
                halign:"right",
                fontStyle:"bold"
              }
            },
            {
              content:dayTotal.Credit,
              styles:{
                halign:"right",
                fontStyle:"bold"
              }
            }
          ])

        }

      });


      autoTable(pdf,{

        startY:30,

        margin:{
          top:30,
          left:14,
          right:14
        },

        head:[[
          "Entry No",
          "Account Name",
          "Particulars",
          "Debit",
          "Credit"
        ]],

        body:tableBody,

        styles:{
          fontSize:8,
          cellPadding:2
        },

        headStyles:{
          fillColor:[240,240,240],
          textColor:0
        },

        didDrawPage:()=>{

          drawHeader();

        }

      });


      /* GRAND TOTAL */

      const totalRow = rows.find(r=>r.Account_Name === "**TOTAL**");

      if(totalRow){

        const y = pdf.lastAutoTable.finalY + 6;

        pdf.setFontSize(10);

        pdf.text(
          `Grand Total : ${totalRow.Credit}`,
          190,
          y,
          {align:"right"}
        )

      }


      window.open(pdf.output("bloburl"),"_blank");

    }
    catch(err){

      console.log(err);

    }
    finally{

      setPrinting(false);

    }

  }



  const handleClose = ()=>{

    window.history.back();

  }


  return(

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
        textAlign="center"
        fontWeight={600}
        mb={2}
        >
          Sales Return Credit Note Register
        </Typography>


        <Paper sx={{p:3}} elevation={5}>

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
              onChange={(e)=>setStartDate(e.target.value)}
              InputLabelProps={{shrink:true}}
              />
            </Grid>

            <Grid item xs={6}>
              <TextField
              label="End Date"
              type="date"
              fullWidth
              size="small"
              value={endDate}
              onChange={(e)=>setEndDate(e.target.value)}
              InputLabelProps={{shrink:true}}
              />
            </Grid>

          </Grid>

        </Paper>


        <Box
        display="flex"
        justifyContent="center"
        gap={3}
        mt={3}
        >

          <Button
          variant="contained"
          startIcon={
            printing ?
            <CircularProgress size={18} color="inherit"/> :
            <PrintIcon/>
          }
          onClick={handlePrint}
          disabled={printing || loading}
          >
            {printing ? "Generating PDF..." : "Print Report"}
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

  )

}