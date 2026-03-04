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

useEffect(() => {
  if (isPrintMode) {
    setLoading(true);
    
    // 1. Construct URL with GET parameters
    const start = filters?.startdate || "2025-04-01";
    const end = filters?.enddate || "2026-03-31";
    const url = `https://publication.microtechsolutions.net.in/php/get/getInvCitywise.php?fromdate=${start}&todate=${end}`;

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

  const handlePrint = async () => {
    const canvas = await html2canvas(componentRef.current, { scale: 2 });
    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF("p", "mm", "a4");
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
    pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
    window.open(pdf.output("bloburl"), "_blank");
  };

  if (!isPrintMode) return null;

  return (
    <Box sx={{ bgcolor: 'white' }}>
      <Stack direction="row" spacing={2} sx={{ p: 2, bgcolor: '#f8f9fa', "@media print": { display: 'none' } }}>
        <Button variant="outlined" startIcon={<ArrowBackIcon />} onClick={() => navigate(-1)}>Back</Button>
        <Button variant="contained" startIcon={<PrintIcon />} onClick={handlePrint}>Print PDF</Button>
      </Stack>

      <Box ref={componentRef} sx={{ p: '10mm' }}>
        <Box sx={{ textAlign: 'center', mb: 2 }}>
          <Typography variant="h6" fontWeight="bold">M. V. Phadke & Co. Kolhapur</Typography>
          <Typography variant="subtitle2" fontWeight="bold">Inv. Citywise</Typography>
          <Typography variant="caption">From {filters?.startdate} to {filters?.enddate}</Typography>
        </Box>

        <TableContainer>
          <Table size="small" sx={{ '& .MuiTableCell-root': { border: 'none', fontSize: '11px' } }}>
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
          <TableCell>{row.BookName || "---"}</TableCell>
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