import React, { useRef } from 'react';
import { 
  Table, TableBody, TableCell, TableContainer, 
  TableHead, TableRow, Paper, Typography, Box, Button, Stack 
} from '@mui/material';
import { styled } from '@mui/material/styles';
import PrintIcon from '@mui/icons-material/Print';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { useNavigate } from 'react-router-dom';

// Styled cell for vertical text headers
const VerticalHeaderCell = styled(TableCell)({
  height: '240px', 
  verticalAlign: 'top', // Start text at the top
  padding: 0,
  border: '1px solid black',
  width: '32px',
  minWidth: '32px',
  '& .verticalTextWrapper': {
    writingMode: 'vertical-rl',
    textOrientation: 'mixed',
    whiteSpace: 'nowrap',
    fontSize: '10px',
    fontWeight: 'bold',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-start',
    height: '100%',
    width: '100%',
    paddingTop: '8px', // Space for the start of the book title
  },
});

const StyledTableCell = styled(TableCell)({
  border: '1px solid black',
  padding: '2px 4px',
  fontSize: '11px',
  fontFamily: '"Times New Roman", Times, serif',
  color: 'black',
});

const Canvassingcollegewisesummarycross = ({ 
  data = [], 
  dateRange = { from: "01-04-25", to: "31-03-26" } 
}) => {
  const componentRef = useRef();
  const navigate = useNavigate();

  // Extract unique book titles for columns from the first data entry
  const columnHeaders = data.length > 0 ? data[0].columns : [];

  const handlePrint = async () => {
    // scale: 4 ensures sharp Marathi text
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
      {/* Action Bar */}
      <Stack direction="row" spacing={2} sx={{ mb: 2, "@media print": { display: 'none' } }}>
        <Button 
          variant="outlined" 
          startIcon={<ArrowBackIcon />} 
          onClick={() => navigate(-1)}
        >
          Back
        </Button>
        <Button 
          variant="contained" 
          startIcon={<PrintIcon />} 
          onClick={handlePrint}
        >
          Generate PDF
        </Button>
      </Stack>

      {/* Main Report Container */}
      <Box 
        ref={componentRef} 
        sx={{ 
          width: '100%', 
          maxWidth: '277mm', 
          bgcolor: 'white', 
          p: '10mm', 
          mx: 'auto',
          boxShadow: '0 0 10px rgba(0,0,0,0.1)'
        }}
      >
        {/* Report Header */}
        <Box sx={{ textAlign: 'center', mb: 2 }}>
          <Typography variant="h6" sx={{ fontWeight: 'bold', fontFamily: 'serif', m: 0 }}>
            M. V. Phadke & Co. Kolhapur
          </Typography>
          <Typography variant="subtitle2" sx={{ fontWeight: 'bold', fontFamily: 'serif' }}>
            Canvassing Collegewise Summary Cross
          </Typography>
          <Typography variant="caption" sx={{ fontFamily: 'serif' }}>
            From {dateRange.from} to {dateRange.to}
          </Typography>
        </Box>

        <TableContainer sx={{ boxShadow: 'none' }}>
          <Table sx={{ borderCollapse: 'collapse', width: '100%' }}>
            <TableHead>
              <TableRow>
                <StyledTableCell sx={{ fontWeight: 'bold' }}>Canvassor</StyledTableCell>
                <StyledTableCell sx={{ fontWeight: 'bold' }}>City</StyledTableCell>
                <StyledTableCell sx={{ fontWeight: 'bold' }}>Area</StyledTableCell>
                <StyledTableCell sx={{ fontWeight: 'bold' }}>College Name</StyledTableCell>
                <StyledTableCell sx={{ fontWeight: 'bold' }}>Chln. #</StyledTableCell>
                <StyledTableCell sx={{ fontWeight: 'bold' }}>Entry #</StyledTableCell>
                
                {columnHeaders.map((col, i) => (
                  <VerticalHeaderCell key={i} align="center">
                    <div className="verticalTextWrapper">{col.bookName}</div>
                  </VerticalHeaderCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {data.length > 0 ? (
                data.map((row, idx) => (
                  <TableRow key={idx}>
                    <StyledTableCell>{row.canvassor}</StyledTableCell>
                    <StyledTableCell>{row.city}</StyledTableCell>
                    <StyledTableCell>{row.area}</StyledTableCell>
                    <StyledTableCell>{row.collegeName}</StyledTableCell>
                    <StyledTableCell align="center">{row.chlnNo}</StyledTableCell>
                    <StyledTableCell align="center">{row.entryNo}</StyledTableCell>
                    {row.columns.map((col, i) => (
                      <StyledTableCell key={i} align="center">
                        {col.count || ''}
                      </StyledTableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6 + columnHeaders.length} align="center" sx={{ py: 4 }}>
                    No Records Found
                  </TableCell>
                </TableRow>
              )}
              
              {/* Grand Total Row */}
              {data.length > 0 && (
                <TableRow sx={{ bgcolor: '#fafafa' }}>
                  <StyledTableCell colSpan={6} align="right" sx={{ fontWeight: 'bold' }}>
                    Total:
                  </StyledTableCell>
                  {columnHeaders.map((_, i) => {
                    const total = data.reduce((acc, row) => acc + (Number(row.columns[i].count) || 0), 0);
                    return (
                      <StyledTableCell key={i} align="center" sx={{ fontWeight: 'bold' }}>
                        {total > 0 ? total : ""}
                      </StyledTableCell>
                    );
                  })}
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>

        <Box sx={{ mt: 2, display: 'flex', justifyContent: 'space-between' }}>
          <Typography sx={{ fontSize: '10px' }}>Total Records: {data.length}</Typography>
          <Typography sx={{ fontSize: '10px' }}>Printed on: {new Date().toLocaleString()}</Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default Canvassingcollegewisesummarycross;