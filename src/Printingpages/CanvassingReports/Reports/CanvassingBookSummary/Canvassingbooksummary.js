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

const Canvassingbooksummary = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const componentRef = useRef();

  const [reportData, setReportData] = useState({});
  const [summaryInfo, setSummaryInfo] = useState({ count: 0, totalCopies: 0 });
  const [loading, setLoading] = useState(false);

  const filters = location.state?.filters;
  const isPrintMode = location.state?.printMode;
const [printing, setPrinting] = useState(false)

  useEffect(() => {
    if (isPrintMode && filters) {
      setLoading(true);

      // Helper to join array IDs into a comma-separated string
      const joinIds = (arr) => (Array.isArray(arr) ? arr.join(",") : "");

      const baseUrl = 'https://publication.microtechsolutions.net.in/php/get/getCanvassingBookSummary.php';
      
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

      const queryString = new URLSearchParams(params).toString();

      fetch(`${baseUrl}?${queryString}`)
        .then((res) => res.json())
        .then((json) => {
          if (json.success && Array.isArray(json.data)) {
            setSummaryInfo({ count: json.count, totalCopies: json.totalCopies });
            
            // TRANSFORMATION LOGIC: Grouping by Standard
            const grouped = json.data.reduce((acc, item) => {
              const std = item.Standard || "Other"; 
              if (!acc[std]) acc[std] = [];
              acc[std].push(item);
              return acc;
            }, {});

            setReportData(grouped);
          } else {
            setReportData({});
          }
          setLoading(false);
        })
        .catch((err) => {
          console.error("Fetch Error:", err);
          setLoading(false);
        });
    }
  }, [isPrintMode, filters]);

//     const handlePrint = async () => {
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

    // --- Header Data Constants ---
    const title = "Phadke Prakashan, Kolhapur.";
    const subTitle = "Canvassing Book Summary Report";
    const dateRange = `Period: From ${filters?.period?.startdate || filters?.startdate || ""} to ${filters?.period?.enddate || filters?.enddate || ""}`;

    // 1. Add the first page
    pdf.addImage(imgData, "PNG", 0, position, pdfWidth, imgHeight);
    heightLeft -= pdfHeight;

    // 2. Loop for subsequent pages
    while (heightLeft > 0) {
      position = heightLeft - imgHeight; 
      pdf.addPage();
      
      // Draw the image slice for the new page
      pdf.addImage(imgData, "PNG", 0, position, pdfWidth, imgHeight);

      // --- STAMP REPEATING HEADER (White Box to cover old content) ---
      pdf.setFillColor(255, 255, 255);
      pdf.rect(0, 0, pdfWidth, 42, 'F'); 

      // Header Titles
      pdf.setFont("helvetica", "bold");
      pdf.setFontSize(11);
      pdf.text(title, pdfWidth / 2, 10, { align: "center" });
      
      pdf.setFontSize(9);
      pdf.text(subTitle, pdfWidth / 2, 16, { align: "center" });
      
      pdf.setFontSize(8);
      pdf.text(dateRange, pdfWidth / 2, 21, { align: "center" });

      // --- DRAW COLUMN HEADERS ---
      pdf.setFontSize(8.5); 
      pdf.setLineWidth(0.4);
      
      // Top line of header
      pdf.line(15, 26, 195, 26); 
      
      // Column Labels (Matching your TableHead)
      // x=17 (Book Code), x=45 (Book Name), x=195 (Copies - Right Aligned)
      pdf.text("Book Code", 17, 32);
      pdf.text("Book Name", 45, 32);
      pdf.text("Copies", 193, 32, { align: "right" });

      // Bottom line of header
      pdf.line(15, 35, 195, 35); 

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
    <Box sx={{ width: '100%', minHeight: '100vh', bgcolor: 'white' }}>
      <Stack direction="row" spacing={2} sx={{ p: 2, bgcolor: '#f8f9fa', "@media print": { display: 'none' } }}>
        <Button variant="outlined" startIcon={<ArrowBackIcon />} onClick={() => navigate(-1)}>Back</Button>
        <Button variant="contained" startIcon={<PrintIcon />} onClick={handlePrint} disabled={loading}>Print to PDF</Button>
      </Stack>


      {/* The Loading Overlay/Message */}
    {printing && (
      <div className="loading-overlay" style={{color:'green', fontWeight:'bold', fontSize:'17px'}}>
        <p>Please wait, your report is being generated. This may take a few seconds...</p>
      </div>
    )}

      <Box ref={componentRef} sx={{ p: 5, bgcolor: 'white', maxWidth: '900px', mx: 'auto' }}>
        <Box sx={{ mb: 3, textAlign: 'center' }}>
          <Typography variant="h6" fontWeight="bold">Phadke Prakashan, Kolhapur.</Typography>
          <Typography variant="subtitle2" fontWeight="bold">Canvassing Book Summary Report</Typography>
          <Typography variant="caption" sx={{ display: 'block' , fontWeight:'bold'}}>
            Period: From {filters?.period?.startdate || filters?.startdate} to {filters?.period?.enddate || filters?.enddate}
          </Typography>
        </Box>

        {loading ? (
          <Box sx={{ textAlign: 'center', py: 5 }}><CircularProgress /></Box>
        ) : (
          <TableContainer>
            <Table size="small" sx={{ 
              '& .MuiTableCell-root': { border: 'none', fontFamily: 'serif', fontSize: '0.85rem' } 
            }}>
              <TableHead>
                <TableRow sx={{ borderTop: '2pt solid black', borderBottom: '2pt solid black' }}>
                  <TableCell sx={{ fontWeight: 'bold', width: '20%' }}>Book Code</TableCell>
                  <TableCell sx={{ fontWeight: 'bold', width: '65%' }}>Book Name</TableCell>
                  <TableCell align="right" sx={{ fontWeight: 'bold', width: '15%' }}>Copies</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {Object.keys(reportData).length === 0 ? (
                  <TableRow><TableCell colSpan={3} align="center">No data found</TableCell></TableRow>
                ) : (
                  Object.entries(reportData).map(([std, items]) => (
                    <React.Fragment key={std}>
                      {/* STANDARD HEADER */}
                      <TableRow>
                        <TableCell colSpan={3} sx={{ pt: 2, pb: 0.5 }}>
                          <Typography sx={{ fontWeight: 'bold', fontSize: '1rem', borderBottom: '1px solid #ccc' }}>
                            {std}
                          </Typography>
                        </TableCell>
                      </TableRow>

                      {/* BOOK DATA */}
                      {items.map((item, i) => (
                        <TableRow key={i}>
                          <TableCell sx={{ py: 0.5 }}>{item.BookCode}</TableCell>
                          <TableCell sx={{ py: 0.5 }}>{item["Name of Book"] || item.BookNameMarathi}</TableCell>
                          <TableCell align="right" sx={{ py: 0.5 }}>{item.Copies}</TableCell>
                        </TableRow>
                      ))}
                    </React.Fragment>
                  ))
                )}
                
                {/* GRAND TOTAL ROW */}
                <TableRow sx={{ borderTop: '2pt solid black' }}>
                  <TableCell colSpan={2} sx={{ fontWeight: 'bold', pt: 2 }}>GRAND TOTAL</TableCell>
                  <TableCell align="right" sx={{ fontWeight: 'bold', pt: 2 }}>
                    {summaryInfo.totalCopies}
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
        )}

        <Box sx={{ mt: 4, display: 'flex', justifyContent: 'space-between' }}>
          <Typography variant="caption">Total Records: {summaryInfo.count}</Typography>
          <Typography variant="caption">Printed on: {new Date().toLocaleString()}</Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default Canvassingbooksummary;