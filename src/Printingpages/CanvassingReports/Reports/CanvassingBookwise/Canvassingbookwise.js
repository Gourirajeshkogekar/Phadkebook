import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from "react-router-dom";
import { 
  Box, Typography, Button, Stack, 
  CircularProgress, Table, TableBody, TableCell, 
  TableContainer, TableHead, TableRow 
} from "@mui/material";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import PrintIcon from '@mui/icons-material/Print';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

const Canvassingbookwise = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  const [reportData, setReportData] = useState(null);
  const [loading, setLoading] = useState(false);

  const filters = location.state?.filters;
  const isPrintMode = location.state?.printMode;
  const componentRef = useRef();
  const [printing, setPrinting] = useState(false)

 useEffect(() => {
    if (isPrintMode && filters) {
      setLoading(true);

      // Helper to join array IDs into a comma-separated string
      const joinIds = (arr) => (Array.isArray(arr) ? arr.join(",") : "");

    
      
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


        const baseUrl = 'https://publication.microtechsolutions.net.in/php/get/getCanvassingBookwise.php';

      const queryParams = new URLSearchParams(params).toString();

      fetch(`${baseUrl}?${queryParams}`)
        .then((res) => res.json())
        .then((json) => {
          setReportData(json);
          setLoading(false);
        })
        .catch((err) => {
          console.error("Fetch Error:", err);
          setLoading(false);
        });
    }
  }, [isPrintMode, filters]);

  if (!isPrintMode) return null;




  
//   const handlePrint = async () => {
//   setPrinting(true);

//   try {
//     const element = componentRef.current;
//     if (!element) return;

//     // 1. Capture the canvas
//     const canvas = await html2canvas(element, {
//       scale: 2, // Keeps quality high
//       useCORS: true,
//       logging: false,
//     });

//     const imgData = canvas.toDataURL("image/png");
//     const pdf = new jsPDF("p", "mm", "a4");

//     const pdfWidth = 210;
//     const pdfHeight = 297;
//     // Calculate how high the image should be to maintain aspect ratio
//     const imgHeight = (canvas.height * pdfWidth) / canvas.width;

//     let heightLeft = imgHeight;
//     let position = 0;

//     // 2. Add the first page
//     pdf.addImage(imgData, "PNG", 0, position, pdfWidth, imgHeight);
//     heightLeft -= pdfHeight;

//     // 3. Loop through remaining height and add new pages
//     while (heightLeft > 0) {
//       position = heightLeft - imgHeight; // This slides the image up
//       pdf.addPage();
//       pdf.addImage(imgData, "PNG", 0, position, pdfWidth, imgHeight);
//       heightLeft -= pdfHeight;
//     }

//     // REMOVED: The extra pdf.addImage call that was causing the "contraction"
    
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

    const title = "Phadke Prakashan, Kolhapur.";
    const subTitle = "Canvassing Book Wise Report";
    const dateRange = `Period: From ${filters?.period?.startdate || ""} to ${filters?.period?.enddate || ""}`;

    // 1. Add the first page
    pdf.addImage(imgData, "PNG", 0, position, pdfWidth, imgHeight);
    heightLeft -= pdfHeight;

    // 2. Loop for subsequent pages
    while (heightLeft > 0) {
      position = heightLeft - imgHeight; 
      pdf.addPage();
      
      pdf.addImage(imgData, "PNG", 0, position, pdfWidth, imgHeight);

      // --- STAMP REPEATING HEADER (White Background Box) ---
      pdf.setFillColor(255, 255, 255);
      pdf.rect(0, 0, pdfWidth, 40, 'F'); 

      // Main Titles
      pdf.setFont("helvetica", "bold");
      pdf.setFontSize(11);
      pdf.text(title, pdfWidth / 2, 10, { align: "center" });
      
      pdf.setFontSize(9);
      pdf.text(subTitle, pdfWidth / 2, 16, { align: "center" });
      
      pdf.setFontSize(8);
      pdf.text(dateRange, pdfWidth / 2, 21, { align: "center" });

      // --- DRAW COLUMN HEADERS ---
      pdf.setFontSize(8.5); // Matches your 14px screen font better in PDF scale
      pdf.setLineWidth(0.4);
      
      // Top line of header
      pdf.line(10, 26, 200, 26); 
      
      // Column Labels (Adjusted for Bookwise Report)
      // Standard margins: Left 10mm, Right 200mm
      pdf.text("Book Code", 12, 31);
      pdf.text("Book Name", 42, 31);
      pdf.text("Total Copies", 198, 31, { align: "right" });

      // Bottom line of header
      pdf.line(10, 34, 200, 34); 

      heightLeft -= pdfHeight;
    }

    window.open(pdf.output("bloburl"), "_blank");
  } catch (error) {
    console.error("PDF Generation Error:", error);
  }

  setPrinting(false);
};


  const handleBack = () => { navigate(-1); };

  return (
    <Box sx={{ width: '100%', minHeight: '100vh', bgcolor: 'white' }}>
      
      {/* ACTION BAR */}
      <Stack 
        direction="row" 
        spacing={2} 
        sx={{ p: 2, bgcolor: '#f8f9fa', borderBottom: '1px solid #eee', "@media print": { display: 'none' } }}
      >
        <Button variant="outlined" startIcon={<ArrowBackIcon />} onClick={handleBack}>
          Back to Filters
        </Button>
        <Button variant="contained" startIcon={<PrintIcon />} onClick={handlePrint} disabled={loading}>
          Print / Save PDF
        </Button>
      </Stack>


      {/* The Loading Overlay/Message */}
    {printing && (
      <div className="loading-overlay" style={{color:'green', fontWeight:'bold', fontSize:'17px'}}>
        <p>Please wait, your report is being generated. This may take a few seconds...</p>
      </div>
    )}



      {/* REPORT CONTENT */}
      <Box ref={componentRef} sx={{ p: 4, mx: 'auto', maxWidth: '1000px', bgcolor: 'white' }}>
        
        {/* Header Section */}
        <Box sx={{ mb: 2, textAlign: 'center' }}>
          <Typography variant="h6" fontWeight="bold">Phadke Prakashan, Kolhapur.</Typography>
          <Typography variant="subtitle2" fontWeight="bold">Canvassing Book Wise Report</Typography>
          <Typography variant="caption" sx={{ display: 'block', fontWeight:'bold' }}>
            Period:
From {filters?.period?.startdate  } 
to {filters?.period?.enddate  }           </Typography>
        </Box>
        
        {loading ? (
          <Box sx={{ textAlign: 'center', mt: 5 }}>
            <CircularProgress />
            <Typography variant="body2" sx={{ mt: 1 }}>Fetching Data...</Typography>
          </Box>
        ) : (
          <TableContainer>
            <Table size="small" sx={{ 
              '& .MuiTableCell-root': { border: 'none', fontFamily: 'serif', fontSize: '14px', padding: '6px 8px' } 
            }}>
              <TableHead>
                <TableRow sx={{ borderTop: '2pt solid black', borderBottom: '2pt solid black' }}>
                  <TableCell sx={{ fontWeight: 'bold', width: '15%' }}>Book Code</TableCell>
                  <TableCell sx={{ fontWeight: 'bold', width: '70%' }}>Book Name</TableCell>
                  <TableCell sx={{ fontWeight: 'bold', textAlign: 'right', width: '15%' }}>Total Copies</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {reportData?.data?.map((item, index) => {
                  // Check if this is the Grand Total row to apply bold styling
                  const isGrandTotal = item["Name of Book"] === "GRAND TOTAL";
                  
                  return (
                    <TableRow 
                      key={index} 
                      sx={{ 
                        borderTop: isGrandTotal ? '1.5pt solid black' : 'none',
                        borderBottom: isGrandTotal ? '1.5pt solid black' : '0.5pt solid #eee' 
                      }}
                    >
                      <TableCell sx={{ fontWeight: isGrandTotal ? 'bold' : 'normal' }}>
                        {item.BookCode}
                      </TableCell>
                      <TableCell sx={{ fontWeight: isGrandTotal ? 'bold' : 'normal' }}>
                        {(item.BookNameMarathi && item.BookNameMarathi !== "N/A") 
    ? item.BookNameMarathi 
    : (item["Name of Book"] || item.BookName || "---")}
                      </TableCell>
                      <TableCell align="right" sx={{ fontWeight: isGrandTotal ? 'bold' : 'normal' }}>
                        {item.Total}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
        )}

        {/* PRINT FOOTER */}
        <Box sx={{ mt: 2, display: 'flex', justifyContent: 'space-between' }}>
          <Typography variant="caption">
            Total Records: {reportData?.count || 0}
          </Typography>
          <Typography variant="caption">
            Printed on: {new Date().toLocaleString()}
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default Canvassingbookwise;