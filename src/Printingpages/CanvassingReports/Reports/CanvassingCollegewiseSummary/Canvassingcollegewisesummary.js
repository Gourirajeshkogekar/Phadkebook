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
import { styled } from '@mui/material/styles';

const StyledTableCell = styled(TableCell)({
  border: '1px solid black',
  padding: '2px 4px',
  fontSize: '11px',
  fontFamily: '"Times New Roman", Times, serif',
  color: 'black',
  lineHeight: 1.2,
});

const VerticalHeaderCell = styled(StyledTableCell)({
  height: '150px',
  whiteSpace: 'nowrap',
  verticalAlign: 'bottom',
  padding: '10px 0',
  '& div': {
    writingMode: 'vertical-rl',
    transform: 'rotate(180deg)',
    textAlign: 'left',
    width: '30px',
    margin: '0 auto',
    fontWeight: 'bold',
  }
});

const CanvassingCollegeWiseSummaryCross = ({ 
  data = [], 
  bookList = [], // Array of unique book names/codes for columns
  dateRange = { from: "01-04-25", to: "31-03-26" } 
}) => {
  const componentRef = useRef();
  const navigate = useNavigate();

  const handlePrint = async () => {
    const canvas = await html2canvas(componentRef.current, { scale: 2 });
    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF("l", "mm", "a4"); // Landscape for cross reports
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
    pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
    window.open(pdf.output("bloburl"), "_blank");
  };

  return (
    <Box sx={{ bgcolor: '#f5f5f5', minHeight: '100vh', p: 4 }}>
      <Stack direction="row" spacing={2} sx={{ mb: 2, "@media print": { display: 'none' } }}>
        <Button variant="outlined" startIcon={<ArrowBackIcon />} onClick={() => navigate(-1)} sx={{ bgcolor: 'white' }}>
          Back
        </Button>
        <Button variant="contained" startIcon={<PrintIcon />} onClick={handlePrint}>
          Print Cross Report
        </Button>
      </Stack>

      <Paper 
        ref={componentRef} 
        elevation={0}
        sx={{ p: '10mm', width: '277mm', mx: 'auto', bgcolor: 'white' }}
      >
        <Box sx={{ mb: 2 }}>
          <Typography sx={{ fontSize: '16px', fontWeight: 'bold' }}>Phadke Prakashan, Kolhapur.</Typography>
          <Typography sx={{ fontSize: '13px' }}>Canvassing Collegewise Summary Cross</Typography>
          <Typography sx={{ fontSize: '11px' }}>From {dateRange.from} to {dateRange.to}</Typography>
        </Box>

        <TableContainer>
          <Table sx={{ borderCollapse: 'collapse', tableLayout: 'fixed' }}>
            <TableHead>
              <TableRow>
                <StyledTableCell sx={{ width: '100px', fontWeight: 'bold' }}>Canvassor</StyledTableCell>
                <StyledTableCell sx={{ width: '80px', fontWeight: 'bold' }}>City</StyledTableCell>
                <StyledTableCell sx={{ width: '80px', fontWeight: 'bold' }}>Area</StyledTableCell>
                <StyledTableCell sx={{ width: '150px', fontWeight: 'bold' }}>College Name</StyledTableCell>
                <StyledTableCell sx={{ width: '50px', fontWeight: 'bold' }}>Chln.No.</StyledTableCell>
                <StyledTableCell sx={{ width: '40px', fontWeight: 'bold' }}>Entry #</StyledTableCell>
                
                {/* Vertical Book Columns */}
                {bookList.map((book, idx) => (
                  <VerticalHeaderCell key={idx}>
                    <div>{book}</div>
                  </VerticalHeaderCell>
                ))}
                
                <StyledTableCell sx={{ width: '40px', fontWeight: 'bold', textAlign: 'center' }}>Total</StyledTableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {data.map((row, index) => (
                <TableRow key={index}>
                  <StyledTableCell>{row.canvassor}</StyledTableCell>
                  <StyledTableCell>{row.city}</StyledTableCell>
                  <StyledTableCell>{row.area}</StyledTableCell>
                  <StyledTableCell sx={{ fontSize: '10px' }}>{row.collegeName}</StyledTableCell>
                  <StyledTableCell>{row.chlnNo}</StyledTableCell>
                  <StyledTableCell>{row.entryNo}</StyledTableCell>
                  
                  {/* Dynamic Quantities per Book */}
                  {bookList.map((book, bIdx) => (
                    <StyledTableCell key={bIdx} sx={{ textAlign: 'center' }}>
                      {row.quantities?.[book] || ""}
                    </StyledTableCell>
                  ))}
                  
                  <StyledTableCell sx={{ textAlign: 'center', fontWeight: 'bold' }}>
                    {row.totalCopies}
                  </StyledTableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Box>
  );
};

export default CanvassingCollegeWiseSummaryCross;