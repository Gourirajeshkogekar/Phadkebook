import React, { useState, useEffect,useRef } from 'react';
import { useLocation, useNavigate } from "react-router-dom";
import { Box, Typography, Button, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from "@mui/material";
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';




const Canvassingspecimenttotal = () => {
  const location = useLocation();
  const navigate = useNavigate();

    const componentRef = useRef();
  

  const [reportData, setReportData] = useState([]);
  const filters = location.state?.filters;
const [printing, setPrinting] = useState(false);


// Helper to convert YYYY-MM-DD to DD-MM-YYYY
  const formatDate = (dateStr) => {
    if (!dateStr) return "";
    // If it's already in DD-MM-YYYY (contains dashes/slashes in right place), return it
    const parts = dateStr.split("-");
    if (parts.length === 3 && parts[0].length === 4) {
      return `${parts[2]}-${parts[1]}-${parts[0]}`;
    }
    return dateStr;
  };
  // Helper to join IDs
  const joinIds = (arr) => (Array.isArray(arr) ? arr.join(",") : (arr || ""));

  useEffect(() => {
    const params = new URLSearchParams({
      fromdate: filters?.period?.startdate || filters?.startdate || "",
      todate: filters?.period?.enddate || filters?.enddate || "",
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

    // GET request with query strings
    fetch(`https://publication.microtechsolutions.net.in/php/get/getCanvassingSpecimenTotal.php?${params.toString()}`)
     .then(res => res.json())
    .then(json => {
      // Ensure we are setting an ARRAY. 
      // If json.data is missing, we set an empty array [].
      if (json && json.data && Array.isArray(json.data)) {
        setReportData(json.data);
      } else {
        console.error("API did not return an array in 'data':", json);
        setReportData([]); 
      }
    })
    .catch(err => {
      console.error("Fetch Error:", err);
      setReportData([]); // Reset on error to prevent crash
    });
}, [filters]);





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

    const title = "M. V. Phadke & Co. Kolhapur";
    const subTitle = "Canvassing Speciman Total";
    const dateRange = `From ${filters?.period?.startdate || ""} to ${filters?.period?.enddate || ""}`;

    // 1. Add the first page
    pdf.addImage(imgData, "PNG", 0, position, pdfWidth, imgHeight);
    heightLeft -= pdfHeight;

    // 2. Loop for subsequent pages
    while (heightLeft > 0) {
      position = heightLeft - imgHeight; 
      pdf.addPage();
      
      // Paste the continued image
      pdf.addImage(imgData, "PNG", 0, position, pdfWidth, imgHeight);

      // --- STAMP REPEATING HEADER (Covers the cut-off text at the top of new pages) ---
      pdf.setFillColor(255, 255, 255);
      pdf.rect(0, 0, pdfWidth, 40, 'F'); 

      pdf.setFont("helvetica", "bold");
      pdf.setFontSize(11);
      pdf.text(title, pdfWidth / 2, 10, { align: "center" });
      
      pdf.setFontSize(9);
      pdf.text(subTitle, pdfWidth / 2, 16, { align: "center" });
      
      pdf.setFontSize(8);
      pdf.text(dateRange, pdfWidth / 2, 21, { align: "center" });

      // --- DRAW COLUMN HEADERS ---
      pdf.setFontSize(7);      
      pdf.setLineWidth(0.3);
      pdf.line(10, 26, 200, 26); // Top line of header
      
      // Coordinates mapped to your 6 columns
      pdf.text("Name of the college", 12, 31);
      pdf.text("Name of the Professor", 60, 31);
      pdf.text("Chln. Dt.", 110, 31);
      pdf.text("Chln. No.", 135, 31);
      pdf.text("Total Copies", 165, 31, { align: "center" });
      pdf.text("Book Code", 185, 31);

      pdf.line(10, 34, 200, 34); // Bottom line of header

      heightLeft -= pdfHeight;
    }

    window.open(pdf.output("bloburl"), "_blank");
  } catch (error) {
    console.error("PDF Generation Error:", error);
  }

  setPrinting(false);
};






















 

  return (
    <Box sx={{ bgcolor: 'white' }}>
      {/* UI Elements hidden during print */}
      <Stack direction="row" spacing={2} sx={{ p: 2, "@media print": { display: "none" } }}>
        <Button variant="outlined" onClick={() => navigate(-1)}>Back</Button>
        <Button variant="contained" onClick={handlePrint} >Print Report</Button>
      </Stack>



        {/* The Loading Overlay/Message */}
    {printing && (
      <div className="loading-overlay" style={{color:'green', fontWeight:'bold', fontSize:'17px'}}>
        <p>Please wait, your report is being generated. This may take a few seconds...</p>
      </div>
    )}


      {/* Report Container */}
<Box ref={componentRef} sx={{ p: '10mm', width: '100%' }}>        <style>
          {`
            @media print {
              @page { size: auto; margin: 15mm; }
              body { margin: 0; }
              .MuiTableHead-root { display: table-header-group; } /* Forces header repeat */
              tr { page-break-inside: avoid; }
            }
          `}
        </style>

        <TableContainer component={Box}>
          <Table size="small" sx={{ '& .MuiTableCell-root': { border: '1px solid #ddd', fontSize: '11px' } }}>
            <TableHead>
              {/* Main Title Row - will repeat if inside TableHead */}
              <TableRow>
                <TableCell colSpan={6} align="center" sx={{ border: 'none !important', pb: 2 }}>
                  <Typography variant="h6" fontWeight="bold">M. V. Phadke & Co. Kolhapur</Typography>
                  <Typography variant="subtitle2" fontWeight="bold">Canvassing Speciman Total</Typography>


                    <Typography variant="caption">
                  From {filters?.period?.startdate  } 
                  to {filters?.period?.enddate  }              </Typography>
                </TableCell>
              </TableRow>
              
              {/* Column Names Row - will repeat on each page */}
              <TableRow sx={{ backgroundColor: '#f5f5f5', borderTop: '1.5pt solid black', borderBottom: '1.5pt solid black' }}>
                <TableCell sx={{ fontWeight: 'bold' }}>Name of the college</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Name of the Professor</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Chln. Dt.</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Chln. No.</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Total Copies</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Book Code</TableCell>
              </TableRow>
            </TableHead>

           <TableBody>
  {reportData.length > 0 ? (
    reportData.map((row, idx) => (
      <TableRow key={idx}>
        {/* Note the keys must match the JSON exactly including spaces */}
        <TableCell>{row["Name of the college"]}</TableCell>
        <TableCell>{row["Name of the Professor"]}</TableCell>
        <TableCell>{row["Chln. Dt."]}</TableCell>
        <TableCell>{row["Chln. No."]}</TableCell>
        <TableCell align="center">{row["Total Copies"]}</TableCell>
        <TableCell>{row["Book Code"]}</TableCell>
      </TableRow>
    ))
  ) : (
    <TableRow>
      <TableCell colSpan={6} align="center">No Data Found</TableCell>
    </TableRow>
  )}
</TableBody>
          </Table>
        </TableContainer>
      </Box>
    </Box>
  );
};

export default Canvassingspecimenttotal;