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

  useEffect(() => {
    if (isPrintMode && filters) {
      setLoading(true);

      // 1. Construct GET URL with fromDate and toDate params
      const baseUrl = 'https://publication.microtechsolutions.net.in/php/get/getCanvassingBookwise.php';
      const queryParams = new URLSearchParams({
        fromDate: filters.startdate,
        toDate: filters.enddate
      }).toString();

      fetch(`${baseUrl}?${queryParams}`)
        .then((res) => res.json())
        .then((json) => {
          // 2. Save the whole JSON object (it contains success, totalCopies, and data)
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

  const handlePrint = async () => {
    if (!componentRef.current) return;
    try {
      setLoading(true);
      const canvas = await html2canvas(componentRef.current, { scale: 2, useCORS: true });
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const imgProps = pdf.getImageProperties(imgData);
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
      pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
      window.open(pdf.output("bloburl"), "_blank");
      setLoading(false);
    } catch (error) {
      console.error("PDF Generation Error:", error);
      setLoading(false);
    }
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

      {/* REPORT CONTENT */}
      <Box ref={componentRef} sx={{ p: 4, mx: 'auto', maxWidth: '1000px', bgcolor: 'white' }}>
        
        {/* Header Section */}
        <Box sx={{ mb: 2, textAlign: 'center' }}>
          <Typography variant="h6" fontWeight="bold">Phadke Prakashan, Kolhapur.</Typography>
          <Typography variant="subtitle2" fontWeight="bold">Canvassing Book Wise Report</Typography>
          <Typography variant="caption" sx={{ display: 'block' }}>
            Period: From {filters?.startdate || "---"} to {filters?.enddate || "---"}
          </Typography>
        </Box>
        
        {loading ? (
          <Box sx={{ textAlign: 'center', mt: 5 }}>
            <CircularProgress />
            <Typography variant="body2" sx={{ mt: 1 }}>Fetching Data...</Typography>
          </Box>
        ) : (
          <TableContainer>
            <Table size="small" sx={{ 
              '& .MuiTableCell-root': { border: 'none', fontFamily: 'serif', fontSize: '0.85rem', padding: '6px 8px' } 
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
                        {item["Name of Book"] || "---"}
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