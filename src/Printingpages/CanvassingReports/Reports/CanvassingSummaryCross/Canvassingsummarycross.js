import React, { useRef } from 'react';
import { 
  Box, Typography, Button, Stack, Table, TableBody, 
  TableCell, TableContainer, TableHead, TableRow, Paper 
} from "@mui/material";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import PrintIcon from '@mui/icons-material/Print';
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { useNavigate } from 'react-router-dom';

const Canvassingsummarycross = ({ 
  data = [], 
  dateRange = { from: "01-04-25", to: "31-03-26" } 
}) => {
  const componentRef = useRef();
  const navigate = useNavigate();

  // backend-friendly check: Extract dynamic book headers from the first data object
  const columnHeaders = data.length > 0 ? data[0].columns : [];

  const handlePrint = async () => {
    const canvas = await html2canvas(componentRef.current, { scale: 4, useCORS: true });
    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF("l", "mm", "a4");
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
    pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
    window.open(pdf.output("bloburl"), "_blank");
  };

  return (
    <Box sx={{ bgcolor: '#f5f5f5', minHeight: '100vh', p: 4 }}>
      {/* Action Buttons */}
      <Stack direction="row" spacing={2} sx={{ mb: 2, "@media print": { display: 'none' } }}>
        <Button variant="outlined" startIcon={<ArrowBackIcon />} onClick={() => navigate(-1)}>
          Back
        </Button>
        <Button variant="contained" startIcon={<PrintIcon />} onClick={handlePrint}>
          Generate PDF
        </Button>
      </Stack>

      {/* Report Sheet */}
      <Box ref={componentRef} sx={{ 
        width: '90%', 
        maxWidth: '277mm', 
        bgcolor: 'white', 
        p: '10mm', 
        mx: 'auto',
        fontFamily: '"Times New Roman", Times, serif'
      }}>
        
        {/* Header Section */}
        <Box sx={{ textAlign: 'center', mb: 3 }}>
          <Typography sx={{ fontSize: '18px', fontWeight: 'bold' }}>M. V. Phadke & Co. Kolhapur</Typography>
          <Typography sx={{ fontSize: '14px' }}>Canvassing Summary Cross</Typography>
          <Typography sx={{ fontSize: '12px' }}>From {dateRange.from} to {dateRange.to}</Typography>
        </Box>

        <TableContainer sx={{ boxShadow: 'none' }}>
          <Table sx={{ 
            borderCollapse: 'collapse',
            '& td, & th': { 
              border: '0.5pt solid black', 
              p: '4px', 
              fontSize: '11px',
              color: 'black'
            } 
          }}>
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: 'bold', width: '220px', verticalAlign: 'middle' }}>
                  Name of the canvassor
                </TableCell>
                
                {/* Dynamic Vertical Headers */}
                {columnHeaders.map((col, i) => (
                  <TableCell key={i} sx={{ 
                    p: 0, height: '220px', width: '30px', minWidth: '30px', verticalAlign: 'top' 
                  }}>
                    <Box sx={{
                      writingMode: 'vertical-rl',
                      textOrientation: 'mixed',
                      whiteSpace: 'nowrap',
                      fontSize: '10px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'flex-start',
                      height: '100%',
                      width: '100%',
                      pt: 1.5,
                      fontWeight: 'bold'
                    }}>
                      {col.bookName}
                    </Box>
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>

            <TableBody>
              {data.length > 0 ? (
                data.map((row, idx) => (
                  <TableRow key={idx}>
                    <TableCell sx={{ fontWeight: 'bold' }}>{row.canvassorName}</TableCell>
                    {row.columns.map((col, i) => (
                      <TableCell key={i} align="center">
                        {col.count || ''}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={columnHeaders.length + 1} align="center" sx={{ py: 4 }}>
                    No Records Found
                  </TableCell>
                </TableRow>
              )}

              {/* Grand Total Row */}
              {data.length > 0 && (
                <TableRow sx={{ bgcolor: '#fafafa' }}>
                  <TableCell align="right" sx={{ fontWeight: 'bold' }}>Total:</TableCell>
                  {columnHeaders.map((_, i) => {
                    const total = data.reduce((acc, row) => acc + (Number(row.columns[i].count) || 0), 0);
                    return (
                      <TableCell key={i} align="center" sx={{ fontWeight: 'bold' }}>
                        {total > 0 ? total : ""}
                      </TableCell>
                    );
                  })}
                </TableRow>
              )}
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