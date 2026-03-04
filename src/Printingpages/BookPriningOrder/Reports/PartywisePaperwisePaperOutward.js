import React, { useRef, useState } from 'react';
import { 
  Box, Typography, Paper, Table, TableBody, TableCell, 
  TableContainer, TableHead, TableRow, Button, Stack, CircularProgress 
} from "@mui/material";
import { Print as PrintIcon, ArrowBack as BackIcon } from '@mui/icons-material';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

function PartywisePaperwisePaperOutward({ reportData, params, onBack, title }) {
  const reportRef = useRef();
  const [printing, setPrinting] = useState(false);

  const handlePrint = async () => {
    setPrinting(true);
    const canvas = await html2canvas(reportRef.current, { scale: 2 });
    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF("p", "mm", "a4");
    const width = pdf.internal.pageSize.getWidth();
    const height = (canvas.height * width) / canvas.width;
    pdf.addImage(imgData, "PNG", 0, 0, width, height);
    window.open(pdf.output("bloburl"), "_blank");
    setPrinting(false);
  };

  return (
    // Changed bgcolor to a lighter 'normal' gray and reduced padding to p: 1
    <Box sx={{ bgcolor: '#f0f2f5', minHeight: '100vh', p: 1 }}> 
      
      {/* Action Bar - Reduced margin-bottom */}
      <Paper sx={{ p: 1.5, mb: 1, maxWidth: '210mm', mx: 'auto', display: 'flex', justifyContent: 'space-between', borderRadius: 1 }}>
        <Button startIcon={<BackIcon />} onClick={onBack} variant="outlined" size="small">Back</Button>
        <Typography variant="subtitle1" sx={{ fontWeight: 'bold', alignSelf: 'center' }}>
          Preview Mode
        </Typography>
        <Button 
          variant="contained" 
          size="small"
          startIcon={printing ? <CircularProgress size={16} color="inherit" /> : <PrintIcon />} 
          onClick={handlePrint}
        >
          Print PDF
        </Button>
      </Paper>

      {/* Report Paper - Reduced internal padding to 10mm */}
      <Paper ref={reportRef} sx={{ width: '210mm', minHeight: '297mm', mx: 'auto', p: '10mm', bgcolor: 'white', boxShadow: 3 }}>
        <Box sx={{ textAlign: 'center', mb: 2 }}>
          <Typography variant="h6" sx={{ fontWeight: 'bold' }}>Phadke Prakashan, Kolhapur.</Typography>
          {/* This now receives the title prop correctly */}
          <Typography variant="subtitle1" sx={{ textDecoration: 'underline', fontWeight: '500' }}>
            {title}
          </Typography>
          <Typography variant="caption">From {params.startDate} To {params.endDate}</Typography>
        </Box>

        <TableContainer>
          <Table size="small" sx={{ border: '1px solid black' }}>
            <TableHead>
              <TableRow sx={{ bgcolor: '#f5f5f5' }}>
                <TableCell sx={{ fontWeight: 'bold', border: '1px solid black', py: 0.5 }}>Date</TableCell>
                <TableCell sx={{ fontWeight: 'bold', border: '1px solid black', py: 0.5 }}>DC No</TableCell>
                <TableCell sx={{ fontWeight: 'bold', border: '1px solid black', py: 0.5 }}>Party / Paper</TableCell>
                <TableCell align="right" sx={{ fontWeight: 'bold', border: '1px solid black', py: 0.5 }}>Qty</TableCell>
                <TableCell sx={{ fontWeight: 'bold', border: '1px solid black', py: 0.5 }}>Unit</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {reportData.length > 0 ? reportData.map((row, i) => (
                <TableRow key={i}>
                  <TableCell sx={{ border: '1px solid #eee', py: 0.3 }}>{row.Date}</TableCell>
                  <TableCell sx={{ border: '1px solid #eee', py: 0.3 }}>{row.DCNo}</TableCell>
                  <TableCell sx={{ border: '1px solid #eee', py: 0.3 }}>{row.PartyName || row.PaperName}</TableCell>
                  <TableCell align="right" sx={{ border: '1px solid #eee', py: 0.3 }}>{row.Qty}</TableCell>
                  <TableCell sx={{ border: '1px solid #eee', py: 0.3 }}>{row.Unit}</TableCell>
                </TableRow>
              )) : (
                <TableRow><TableCell colSpan={5} align="center">No Data Found</TableCell></TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Box>
  );
}

export default PartywisePaperwisePaperOutward;