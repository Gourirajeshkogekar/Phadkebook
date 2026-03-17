import React, { useRef, useEffect, useState } from 'react';
import { 
  Box, Typography, Button, Stack, Table, TableBody, 
  TableCell, TableContainer, TableHead, TableRow, CircularProgress 
} from "@mui/material";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import PrintIcon from '@mui/icons-material/Print';
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';

const Canvassingsummarycross = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const componentRef = useRef();
  const navigate = useNavigate();
  const location = useLocation();

  // Parse filters from URL as required by the PHP API
  const queryParams = new URLSearchParams(location.search);
  
  const filters = {
    fromdate: queryParams.get("fromdate") || "01-04-2025",
    todate: queryParams.get("todate") || "31-03-2026",
    areaId: queryParams.get("areaId"),
    collegeId: queryParams.get("collegeId"),
    cityId: queryParams.get("cityId"),
    canvassorId: queryParams.get("canvassorId"),
    accountId: queryParams.get("accountId"),
    standardId: queryParams.get("standardId"),
    bookId: queryParams.get("bookId"),
    bookGroupId: queryParams.get("bookGroupId"),
    publicationId: queryParams.get("publicationId"),
    bookSelectionId: queryParams.get("bookSelectionId")
  };

  useEffect(() => {
    const fetchReportData = async () => {
      setLoading(true);
      try {
        const res = await axios.get(
          "https://publication.microtechsolutions.net.in/php/get/getCanvassingSummaryCross.php",
          { params: filters }
        );
        setData(res.data.data || []);
      } catch (error) {
        console.error("Fetch Error:", error);
        setData([]);
      } finally {
        setLoading(false);
      }
    };
    fetchReportData();
  }, [location.search]);

  // Extract vertical book headers from the first data object
  const columnHeaders = data.length > 0 ? data[0].columns : [];

  const handlePrint = async () => {
    const canvas = await html2canvas(componentRef.current, { 
      scale: 3, // High quality but memory efficient
      useCORS: true 
    });
    const imgData = canvas.toDataURL("image/png");
    
    // Landscape mode is essential for cross-summary reports
    const pdf = new jsPDF("l", "mm", "a4");
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
    
    pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
    window.open(pdf.output("bloburl"), "_blank");
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 10 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ bgcolor: '#f5f5f5', minHeight: '100vh', p: 4 }}>
      <Stack direction="row" spacing={2} sx={{ mb: 2, "@media print": { display: 'none' } }}>
        <Button variant="outlined" startIcon={<ArrowBackIcon />} onClick={() => navigate(-1)}>
          Back
        </Button>
        <Button variant="contained" startIcon={<PrintIcon />} onClick={handlePrint}>
          Generate PDF
        </Button>
      </Stack>

      <Box ref={componentRef} sx={{ 
        width: '100%', 
        bgcolor: 'white', 
        p: '10mm', 
        mx: 'auto',
        fontFamily: '"Times New Roman", Times, serif'
      }}>
        
        {/* Header matching Phadke Prakashan style */}
        <Box sx={{ textAlign: 'center', mb: 3 }}>
          <Typography sx={{ fontSize: '18px', fontWeight: 'bold' }}>M. V. Phadke & Co. Kolhapur</Typography>
          <Typography sx={{ fontSize: '14px' }}>Canvassing Summary Cross</Typography>
          <Typography sx={{ fontSize: '12px' }}>From {filters.fromdate} to {filters.todate}</Typography>
        </Box>

        <TableContainer sx={{ boxShadow: 'none' }}>
          <Table sx={{ 
            borderCollapse: 'collapse',
            '& td, & th': { 
              border: '1px solid black', // Strict black borders like client screenshot
              p: '2px 4px', 
              fontSize: '10px',
              color: 'black'
            } 
          }}>
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: 'bold', width: '220px', textAlign: 'center' }}>
                  Name of the canvassor
                </TableCell>
                
                {columnHeaders.map((col, i) => (
                  <TableCell key={i} sx={{ p: 0, height: '180px', width: '32px' }}>
                    <Box sx={{
                      writingMode: 'vertical-rl',
                      transform: 'rotate(180deg)', // Rotates Marathi text like the client screen
                      whiteSpace: 'nowrap',
                      fontSize: '9px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      height: '100%',
                      fontWeight: 'bold'
                    }}>
                      {col.bookName}
                    </Box>
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>

            <TableBody>
              {data.map((row, idx) => (
                <TableRow key={idx}>
                  <TableCell sx={{ textTransform: 'uppercase', fontWeight: 500 }}>
                    {row.canvassorName}
                  </TableCell>
                  {row.columns.map((col, i) => (
                    <TableCell key={i} align="center">
                      {col.count || ''}
                    </TableCell>
                  ))}
                </TableRow>
              ))}

              {/* Grand Total Row */}
              <TableRow>
                <TableCell align="right" sx={{ fontWeight: 'bold' }}>TOTAL:</TableCell>
                {columnHeaders.map((_, i) => {
                  const total = data.reduce((acc, row) => acc + (Number(row.columns[i].count) || 0), 0);
                  return (
                    <TableCell key={i} align="center" sx={{ fontWeight: 'bold' }}>
                      {total > 0 ? total : ""}
                    </TableCell>
                  );
                })}
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>

        <Box sx={{ mt: 2, display: 'flex', justifyContent: 'space-between' }}>
          <Typography sx={{ fontSize: '10px' }}>Total Canvassors: {data.length}</Typography>
          <Typography sx={{ fontSize: '10px' }}>Printed on: {new Date().toLocaleString()}</Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default Canvassingsummarycross;