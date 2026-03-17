import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from "react-router-dom";
import { 
  Box, Typography, Button, Stack, 
  CircularProgress, Table, TableBody, TableCell, 
  TableContainer, TableHead, TableRow, Paper 
} from "@mui/material";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import PrintIcon from '@mui/icons-material/Print';
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

const Canvassingareawisesummary = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const componentRef = useRef(); 
  
  const [reportData, setReportData] = useState([]);
  const [loading, setLoading] = useState(false);
const [printing, setPrinting] = useState(false)

  // Fallback filters if coming from direct navigation
  const filters = location.state?.filters || { startdate: '2025-04-01', enddate: '2026-03-31' };
  const isPrintMode = location.state?.printMode ?? true;

  useEffect(() => {
    if (isPrintMode) {
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


      const url = `https://publication.microtechsolutions.net.in/php/get/getCanvassingAreawiseSummary.php?${params.toString()}`;
      
      fetch(url)
        .then((res) => res.json())
        .then((data) => {
          if (Array.isArray(data)) {
            // 2. MASTER FILTER LOGIC
            const filteredData = data.filter((item) => {
              const matches = (filterList, itemValue) => {
                if (!filterList || filterList.length === 0) return true;
                return filterList.includes(itemValue);
              };

              return (
                matches(filters.areas, item.Area) &&
                matches(filters.cities, item.City) &&
                matches(filters.standards, item.Standard) &&
                matches(filters.books, item.BookCode)
                // Add matches() for your other 6 filters here if they exist in the JSON
              );
            });

            // 3. GROUPING
            const grouped = filteredData.reduce((acc, item) => {
              const area = item.Area || "Unknown Area";
              const city = item.City || "Unknown City";
              const key = `${area}-${city}`;
              
              if (!acc[key]) {
                acc[key] = { area, city, details: [] };
              }
              acc[key].details.push(item);
              return acc;
            }, {});
            
            setReportData(Object.values(grouped));
          }
          setLoading(false);
        })
        .catch((err) => {
          console.error("Fetch Error:", err);
          setLoading(false);
        });
    }
  }, [isPrintMode, filters]);

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
      const subTitle = "Canvassing Areawise Summary";
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
                pdf.text("Standard", 90, 32);

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
    <Box sx={{ width: '100%', minHeight: '100vh', bgcolor: '#525659', p: 2 }}>
      
      {/* Action Bar */}
      <Stack 
        direction="row" 
        spacing={2} 
        sx={{ p: 2, mb: 2, bgcolor: 'white', borderRadius: 1, "@media print": { display: 'none' } }}
      >
        <Button variant="outlined" startIcon={<ArrowBackIcon />} onClick={() => navigate(-1)}>
          Back
        </Button>
        <Button variant="contained" startIcon={<PrintIcon />} onClick={handlePrint}>
          Download PDF
        </Button>
      </Stack>

      {/* Printable Report Area */}
      <Box 
        ref={componentRef} 
        sx={{ 
          p: '10mm', 
          bgcolor: 'white', 
          width: '210mm', 
          margin: 'auto',
          boxShadow: 3 
        }}
      >
        {/* Header */}
        <Box sx={{ mb: 2, textAlign: 'center' }}>
          <Typography variant="h6" sx={{ fontWeight: 'bold', fontFamily: 'serif' }}>Phadke Prakashan, Kolhapur.</Typography>
          <Typography variant="subtitle2" fontWeight="bold">Canvassing Areawise Summary</Typography>
          <Typography variant="caption">            Period: From {filters?.period?.startdate || filters?.startdate} to {filters?.period?.enddate || filters?.enddate}
</Typography>
        </Box>
        
        {loading ? (
          <Box sx={{ textAlign: 'center', mt: 5 }}><CircularProgress /></Box>
        ) : (
          <TableContainer>
            <Table size="small" sx={{ 
              '& .MuiTableCell-root': { border: 'none', fontFamily: 'serif', fontSize: '11px', padding: '4px' } 
            }}>
              <TableHead>
                <TableRow sx={{ borderTop: '1.5pt solid black', borderBottom: '1.5pt solid black' }}>
                  <TableCell sx={{ fontWeight: 'bold', width: '15%' }}>Book Code</TableCell>
                  <TableCell sx={{ fontWeight: 'bold', width: '50%' }}>Book Name</TableCell>
                  <TableCell sx={{ fontWeight: 'bold', width: '20%' }}>Standard</TableCell>
                  <TableCell align="center" sx={{ fontWeight: 'bold', width: '15%' }}>Copies</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {reportData.map((group, gIdx) => (
                  <React.Fragment key={gIdx}>
                    {/* Area & City Header Row */}
                    <TableRow>
                      <TableCell colSpan={2} sx={{ fontWeight: 'bold', textAlign: 'center', fontSize: '12px', pt: 2 }}>
                        {group.area}
                      </TableCell>
                      <TableCell colSpan={2} sx={{ fontWeight: 'bold', textAlign: 'center', fontSize: '12px', pt: 2 }}>
                        {group.city}
                      </TableCell>
                    </TableRow>

                    {/* Items within this Area */}
                    {group.details.map((row, rIdx) => (
                      <TableRow key={rIdx} sx={{ borderBottom: rIdx === group.details.length - 1 ? '1px solid black' : 'none' }}>
                        <TableCell>{row.BookCode}</TableCell>
                        <TableCell>{row.BookName ||   "---"}</TableCell>
                        <TableCell>{row.Standard}</TableCell>
                        <TableCell align="center">
                           <Box sx={{ borderBottom: '1px solid black', display: 'inline-block', minWidth: '20px' }}>
                            {row.Copies}
                           </Box>
                        </TableCell>
                      </TableRow>
                    ))}
                  </React.Fragment>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}

        {/* Footer */}
        <Box sx={{ mt: 3, pt: 1, borderTop: '1.5pt solid black', display: 'flex', justifyContent: 'space-between' }}>
          <Typography sx={{ fontSize: '10px' }}>
            Total Records: {reportData.reduce((acc, g) => acc + g.details.length, 0)}
          </Typography>
          <Typography sx={{ fontSize: '10px' }}>
            Total Copies: {reportData.reduce((acc, g) => acc + g.details.reduce((sum, d) => sum + d.Copies, 0), 0)}
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default Canvassingareawisesummary;