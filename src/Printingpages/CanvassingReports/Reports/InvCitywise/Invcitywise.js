import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from "react-router-dom";
import { Box, Typography, Button, Stack, CircularProgress, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@mui/material";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import PrintIcon from '@mui/icons-material/Print';
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

const Invcitywise = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const componentRef = useRef();
  const [reportData, setReportData] = useState([]);
  const [loading, setLoading] = useState(false);
  const filters = location.state?.filters;
  const isPrintMode = location.state?.printMode;
const [printing, setPrinting] = useState(false)

useEffect(() => {
  if (isPrintMode) {
    setLoading(true);
    

       const joinIds = (arr) => (Array.isArray(arr) ? arr.join(",") : (arr || ""));

 const params = new URLSearchParams({
        fromdate: filters?.period?.startdate || filters?.startdate || "",
        todate: filters?.period?.enddate || filters?.enddate || "",
        // Use the plural keys from state (areas, cities, etc.) joined by commas
        areaId: joinIds(filters?.areas),
        cityId: joinIds(filters?.cities),
        collegeId: joinIds(filters?.colleges),
        canvassorId: joinIds(filters?.canvassors),
        accountId: joinIds(filters?.accounts),
        standardId: joinIds(filters?.standards),
        bookId: joinIds(filters?.selectedBooks),
        bookGroupId: joinIds(filters?.bookGroups),
        publicationId: joinIds(filters?.publications)
      });

  
    const url = `https://publication.microtechsolutions.net.in/php/get/getInvCitywise.php?${params.toString()}`;

    fetch(url)
      .then((res) => res.json())
      .then((res) => {
        // 2. The API returns { success: true, data: [...] }
        if (res.success && Array.isArray(res.data)) {
          setReportData(res.data);
        } else {
          setReportData([]);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error("Fetch Error:", err);
        setLoading(false);
      });
  }
}, [isPrintMode, filters]);

// const handlePrint = async () => {
//   setPrinting(true);

//   try {
//     const element = componentRef.current;
//     if (!element) return;

//     const canvas = await html2canvas(element, {
//       scale: 2,
//       useCORS: true,
//       logging: false,
//     });

    




//     // ... after html2canvas ...
// const imgData = canvas.toDataURL("image/png");
// const pdf = new jsPDF("p", "mm", "a4");

 

 
//     const pdfWidth = 210;
//     const pdfHeight = 297;
//     const imgHeight = (canvas.height * pdfWidth) / canvas.width;

//     let heightLeft = imgHeight;
//     let position = 0;

//     const title = "M.V. Phadke & Co.Kolhapur";
//     const subTitle = "Inv Citywise";
//     const dateRange = `From ${filters?.period?.startdate || ""} to ${filters?.period?.enddate || ""}`;

//     // 1. Add the first page
//     pdf.addImage(imgData, "PNG", 0, position, pdfWidth, imgHeight);
//     heightLeft -= pdfHeight;

//     // 2. Loop for subsequent pages
//     while (heightLeft > 0) {
//       position = heightLeft - imgHeight; 
//       pdf.addPage();
      
//       pdf.addImage(imgData, "PNG", 0, position, pdfWidth, imgHeight);

//       // --- STAMP REPEATING HEADER ---
//       pdf.setFillColor(255, 255, 255);
//       pdf.rect(0, 0, pdfWidth, 38, 'F'); 

//       pdf.setFont("helvetica", "bold");
//       pdf.setFontSize(11);
//       pdf.text(title, pdfWidth / 2, 10, { align: "center" });
      
//       pdf.setFontSize(9);
//       pdf.text(subTitle, pdfWidth / 2, 15, { align: "center" });
      
//       pdf.setFontSize(8);
//       pdf.text(dateRange, pdfWidth / 2, 19, { align: "center" });

//       // --- DRAW COLUMN HEADERS ---
// // pdf.setFont("helvetica", "normal"); // Changing from 'bold' to 'normal'
// pdf.setFontSize(6);     
//       pdf.setLineWidth(0.3);
//       pdf.line(10, 24, 200, 24); 
      
      
//       //  */
//             pdf.text("Sr.No", 8, 28);

//       pdf.text("Book Code", 16, 28);
//       pdf.text("Book Name", , 28);
//       pdf.text("City", 64, 28);
     
//       pdf.text("Copies", 170, 28, { align: "center" });
   


//       pdf.line(10, 30, 200, 30); 

//       heightLeft -= pdfHeight;
//     }

//     window.open(pdf.output("bloburl"), "_blank");
//   } catch (error) {
//     console.error("PDF Generation Error:", error);
//   }

//   setPrinting(false);
// };


const handlePrint = async () => {
  setPrinting(true);

  try {
    const element = componentRef.current;
    if (!element) return;

    const canvas = await html2canvas(element, {
      scale: 2,
      useCORS: true,
      logging: false,
    });

    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF("p", "mm", "a4");

    const pdfWidth = 210;
    const pdfHeight = 297;
    const imgHeight = (canvas.height * pdfWidth) / canvas.width;

    let heightLeft = imgHeight;
    let position = 0;

    // --- Header Constants ---
    const title = "M.V. Phadke & Co. Kolhapur";
    const subTitle = "Inv Citywise";
    const dateRange = `From ${filters?.period?.startdate || ""} to ${filters?.period?.enddate || ""}`;

    // 1. Add the first page (The browser naturally captures the first header)
    pdf.addImage(imgData, "PNG", 0, position, pdfWidth, imgHeight);
    heightLeft -= pdfHeight;

    // 2. Loop for subsequent pages
    let pageCount = 1;
    while (heightLeft > 0) {
      position = heightLeft - imgHeight; 
      pdf.addPage();
      pageCount++;
      
      // Draw the image slice for the new page
      pdf.addImage(imgData, "PNG", 0, position, pdfWidth, imgHeight);

      // --- STAMP REPEATING HEADER (White Box cover-up) ---
      pdf.setFillColor(255, 255, 255);
      pdf.rect(0, 0, pdfWidth, 35, 'F'); // Slightly smaller box to save space

      // Main Titles
      pdf.setFont("helvetica", "bold");
      pdf.setFontSize(13);
      pdf.text(title, pdfWidth / 2, 10, { align: "center" });
      
      pdf.setFontSize(11);
      pdf.text(subTitle, pdfWidth / 2, 15, { align: "center" });
      
      pdf.setFontSize(13);
      pdf.text(dateRange, pdfWidth / 2, 19, { align: "center" });

      // --- DRAW COLUMN HEADERS ---
      pdf.setFontSize(10); // Increased from 6 for better readability since columns are fewer
      pdf.setLineWidth(0.2);
      
      // Top line of table header
      pdf.line(10, 23, 200, 23); 
      
      // Column Labels with calculated spacing
      // X-Coordinates:
      // Sr.No: 10, Book Code: 22, Book Name: 45, City: 140, Copies: 190
      pdf.text("Sr.No", 10, 28);
      pdf.text("Book Code", 22, 28);
      pdf.text("Book Name", 45, 28);
      pdf.text("City", 140, 28);
      pdf.text("Copies", 195, 28, { align: "right" });

      // Bottom line of table header
      pdf.line(10, 31, 200, 31); 

      // Optional: Add Page Number at the bottom
      pdf.setFontSize(7);
      pdf.text(`Page ${pageCount}`, pdfWidth - 15, pdfHeight - 10);

      heightLeft -= pdfHeight;
    }

    window.open(pdf.output("bloburl"), "_blank");
  } catch (error) {
    console.error("PDF Generation Error:", error);
  }

  setPrinting(false);
};
  if (!isPrintMode) return null;

  return (
    <Box sx={{ bgcolor: 'white' }}>
      <Stack direction="row" spacing={2} sx={{ p: 2, bgcolor: '#f8f9fa', "@media print": { display: 'none' } }}>
        <Button variant="outlined" startIcon={<ArrowBackIcon />} onClick={() => navigate(-1)}>Back</Button>
        <Button variant="contained" startIcon={<PrintIcon />} onClick={handlePrint}>Print PDF</Button>
      </Stack>

      {/* The Loading Overlay/Message */}
    {printing && (
      <div className="loading-overlay" style={{color:'green', fontWeight:'bold', fontSize:'17px'}}>
        <p>Please wait, your report is being generated. This may take a few seconds...</p>
      </div>
    )}

      <Box ref={componentRef} sx={{ p: '10mm' }}>
        <Box sx={{ textAlign: 'center', mb: 2 }}>
          <Typography variant="h6" fontWeight="bold">M. V. Phadke & Co. Kolhapur</Typography>
          <Typography variant="subtitle2" fontWeight="bold">Inv. Citywise</Typography>
          <Typography variant="caption">
From {filters?.period?.startdate  } 
to {filters?.period?.enddate  }              </Typography>
        </Box>

        <TableContainer>
          <Table size="small" sx={{ '& .MuiTableCell-root': { border: 'none', fontSize: '13px' } }}>
            <TableHead>
              <TableRow sx={{ borderTop: '1.5pt solid black', borderBottom: '1.5pt solid black' }}>
                <TableCell sx={{ fontWeight: 'bold' }}>Sr. No.</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Book Code</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Book Name</TableCell>
                <TableCell sx={{ fontWeight: 'bold', textAlign: 'center' }}>City</TableCell>
                <TableCell sx={{ fontWeight: 'bold', textAlign: 'right' }}>Copies</TableCell>
              </TableRow>
            </TableHead>
          <TableBody>
  {reportData.length === 0 && !loading ? (
    <TableRow>
      <TableCell colSpan={5} align="center">No Data Found</TableCell>
    </TableRow>
  ) : (
    reportData.map((row, index) => (
      <React.Fragment key={index}>
        <TableRow>
          <TableCell>{row.SrNo || index + 1}</TableCell>
          <TableCell>{row.BookCode}</TableCell>
<TableCell>
  {row.BookName || row.BookNameMarathi || "---"}
</TableCell>      

    <TableCell align="center">{row.City || "General"}</TableCell>
          <TableCell align="right">{row.Copies}</TableCell>
        </TableRow>
      </React.Fragment>
    ))
  )}
</TableBody>
          </Table>
        </TableContainer>
      </Box>
    </Box>
  );
};

export default Invcitywise;