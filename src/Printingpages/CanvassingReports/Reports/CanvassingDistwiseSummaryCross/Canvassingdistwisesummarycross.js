import React, { useRef, useEffect, useState } from 'react';
import { 
  Box, Typography, Button, Stack, Table, TableBody, 
  TableCell, TableContainer, TableHead, TableRow, CircularProgress, Paper 
} from "@mui/material";
import { styled } from '@mui/material/styles';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import PrintIcon from '@mui/icons-material/Print';
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';

 




const StyledTableCell = styled(TableCell)({
  border: '1px solid black',
  padding: '4px 2px',  // Reduced horizontal padding to save space
  fontSize: '11px',
  color: 'black',
  fontFamily: 'serif',
  textAlign: 'center'
});

const CanvassingDistrictwiseSummary = () => {
  const [reportRows, setReportRows] = useState([]);
  const [columnNames, setColumnNames] = useState([]);
  const [loading, setLoading] = useState(true);
    const [reportData, setReportData] = useState([]);
  
  const componentRef = useRef();
  const navigate = useNavigate();
  const location = useLocation();
  
  const filters = location.state?.filters || {};
   const isPrintMode = location.state?.printMode;




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
  
        const url = `https://publication.microtechsolutions.net.in/php/get/getCanvassingDistrictwiseSummary.php?${params.toString()}`;
  
        fetch(url)
          .then((res) => res.json())
         .then((json) => {
    // Check if response is the array you provided or wrapped in a data property
    const rawData = Array.isArray(json) ? json : (json.data || []);
  
    if (rawData.length > 0) {
      const grouped = rawData.reduce((acc, item) => {
        // Accessing the key with spaces from your JSON
        const collegeName = item["Name of College"] || "UNKNOWN COLLEGE";
        if (!acc[collegeName]) {
          acc[collegeName] = { college: collegeName, details: [] };
        }
        acc[collegeName].details.push(item);
        return acc;
      }, {});
      setReportData(Object.values(grouped));
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
   
  
  const [printing, setPrinting] = useState(false)
  
     
  
   
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
  
      
  
  
  
  
      // ... after html2canvas ...
  const imgData = canvas.toDataURL("image/png");
  const pdf = new jsPDF("p", "mm", "a4");
  
   
  
   
      const pdfWidth = 210;
      const pdfHeight = 297;
      const imgHeight = (canvas.height * pdfWidth) / canvas.width;
  
      let heightLeft = imgHeight;
      let position = 0;
  
       const title = "M V Phadke & Co. Kolhapur";
    const subTitle = "Canvassing Citywise Summary Cross";
    const dateRange = `From ${filters?.period?.startdate || ""} to ${filters?.period?.enddate || ""}`;
  
      // 1. Add the first page
      pdf.addImage(imgData, "PNG", 0, position, pdfWidth, imgHeight);
      heightLeft -= pdfHeight;
  
      // 2. Loop for subsequent pages
      while (heightLeft > 0) {
        position = heightLeft - imgHeight; 
        pdf.addPage();
        
        pdf.addImage(imgData, "PNG", 0, position, pdfWidth, imgHeight);
  
        // --- STAMP REPEATING HEADER ---
        pdf.setFillColor(255, 255, 255);
        pdf.rect(0, 0, pdfWidth, 38, 'F'); 
  
        pdf.setFont("helvetica", "bold");
        pdf.setFontSize(11);
        pdf.text(title, pdfWidth / 2, 10, { align: "center" });
        
        pdf.setFontSize(9);
        pdf.text(subTitle, pdfWidth / 2, 15, { align: "center" });
        
        pdf.setFontSize(8);
        pdf.text(dateRange, pdfWidth / 2, 19, { align: "center" });
  
        // --- DRAW COLUMN HEADERS ---
  // pdf.setFont("helvetica", "normal"); // Changing from 'bold' to 'normal'
  pdf.setFontSize(6);     
        pdf.setLineWidth(0.3);
        pdf.line(10, 24, 200, 24); 
        
         
        
       pdf.text("Sr.no", 1,28)
      pdf.text("Name of the Canvassor", 8, 28);
      pdf.text("City", 15, 28)
      pdf.text("Book Name/Title", 25, 28);
      
      pdf.text("Quantity", 35, 28, { align: "center" });
  
  
        pdf.line(10, 30, 200, 30); 
  
        heightLeft -= pdfHeight;
      }
  
      window.open(pdf.output("bloburl"), "_blank");
    } catch (error) {
      console.error("PDF Generation Error:", error);
    }
  
    setPrinting(false);
  };

  if (loading) return <Box sx={{ display: 'flex', justifyContent: 'center', mt: 10 }}><CircularProgress /></Box>;

  return (
    <Box sx={{ p: 4, bgcolor: '#f0f0f0', minHeight: '100vh' }}>
      <Stack direction="row" spacing={2} sx={{ mb: 3, "@media print": { display: 'none' } }}>
        <Button variant="outlined" startIcon={<ArrowBackIcon />} onClick={() => navigate(-1)}>Back</Button>
        <Button variant="contained" startIcon={<PrintIcon />} onClick={handlePrint}>Download PDF</Button>
      </Stack>

      <Paper ref={componentRef} elevation={0} sx={{ p: '10mm', width: 'fit-content', mx: 'auto', bgcolor: 'white' }}>
        {/* Report Header */}
        <Box sx={{ textAlign: 'center', mb: 3 }}>
          <Typography sx={{ fontSize: '20px', fontWeight: 'bold', fontFamily: 'serif' }}>M. V. Phadke & Co. Kolhapur</Typography>
          <Typography sx={{ fontSize: '14px', fontWeight: 'bold' }}>Canvassing Citywise Summary Cross</Typography>
          <Typography sx={{ fontSize: '12px' }}>From {filters.period.startdate} to {filters.period.enddate  }</Typography>
        </Box>

        <TableContainer sx={{ border: '1px solid black' }}>
          <Table size="small" sx={{ borderCollapse: 'collapse' }}>
            <TableHead>
              <TableRow>
               <StyledTableCell sx={{ width: '200px', fontWeight: 'bold' }}>
      Name of the canvassor
    </StyledTableCell>
    <StyledTableCell sx={{ width: '120px', fontWeight: 'bold' }}>
      City
    </StyledTableCell>
    {/* NEW HORIZONTAL COLUMN */}
    <StyledTableCell sx={{ fontWeight: 'bold', textAlign: 'left' }}>Book Name /Title</StyledTableCell>
    <StyledTableCell sx={{ width: '80px', fontWeight: 'bold' }}>Qty</StyledTableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {reportRows.map((row, idx) => (
                <TableRow key={idx}>
                  {row.isFirstInGroup && (
                    <StyledTableCell 
                      rowSpan={row.groupSize} 
                      sx={{ verticalAlign: 'top', fontWeight: 'bold', textTransform: 'uppercase' }}
                    >
                      {row.canvassorName}
                    </StyledTableCell>
                  )}
                  <StyledTableCell>{row.city}</StyledTableCell>
                {/* DISPLAY BOOK NAME HORIZONTALLY */}
      <StyledTableCell sx={{ textAlign: 'left', paddingLeft: '10px' }}>
        {row.BookNameMarathi || row.BookName}
      </StyledTableCell>
      
      <StyledTableCell>{row.Qty || 1}</StyledTableCell>
                </TableRow>
              ))}
              
              {/* Grand Total Row */}
              <TableRow sx={{ bgcolor: '#f9f9f9' }}>
                <StyledTableCell colSpan={2} align="right" sx={{ fontWeight: 'bold' }}>TOTAL:</StyledTableCell>
              <StyledTableCell sx={{ fontWeight: 'bold' }}>
      {reportRows.reduce((sum, row) => sum + (parseInt(row.Qty) || 1), 0)}
    </StyledTableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Box>
  );
};

export default CanvassingDistrictwiseSummary;