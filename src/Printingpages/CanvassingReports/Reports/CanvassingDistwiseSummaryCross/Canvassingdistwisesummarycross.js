import {React, useRef} from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow, 
  Paper, 
  Typography, 
  Box , Stack,Button, 
} from '@mui/material';
import { styled } from '@mui/material/styles';
 import {jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import PrintIcon from '@mui/icons-material/Print';

// Styled component for vertical text headers
const VerticalHeaderCell = styled(TableCell)({
  height: '220px', // Adjusted to fit long book names from your screenshots
  verticalAlign: 'bottom',
  padding: '8px 2px',
  border: '1px solid rgba(224, 224, 224, 1)',
  width: '40px',
  '& .verticalText': {
    writingMode: 'vertical-rl',
    transform: 'rotate(180deg)',
    whiteSpace: 'nowrap',
    fontSize: '0.75rem',
    fontWeight: 'bold',
    textAlign: 'left',
  },
});

const StyledTableCell = styled(TableCell)({
  border: '1px solid rgba(224, 224, 224, 1)',
  padding: '4px 8px',
  fontSize: '0.8rem',
});




function Canvassingdistwisesummarycross({ data = [] }) {
  // Extract columns dynamically from backend data
  const columnHeaders = data.length > 0 ? data[0].columns : [];
  const componentRef = useRef();
  const navigate = useNavigate();

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
    <Box sx={{ p: 3, bgcolor: '#fff' }}>


        {/* Action Buttons */}
            <Stack direction="row" spacing={2} sx={{ mb: 2, "@media print": { display: 'none' } }}>
              <Button variant="outlined" startIcon={<ArrowBackIcon />} onClick={() => navigate(-1)}>
                Back
              </Button>
              <Button variant="contained" startIcon={<PrintIcon />} onClick={handlePrint}>
                Generate PDF
              </Button>
            </Stack>
      {/* Report Header Section */}
      <Box sx={{ textAlign: 'center', mb: 3 }}>
        <Typography variant="h5" sx={{ fontWeight: 'bold', fontFamily: 'serif' }}>
          M. V. Phadke & Co. Kolhapur
        </Typography>
        <Typography variant="subtitle1" sx={{ textDecoration: 'underline', fontWeight: 'bold' }}>
          Canvassing Citywise Summary Cross
        </Typography>
        <Typography variant="body2">
          From 01-04-25 to 31-03-26
        </Typography>
      </Box>

      <TableContainer component={Paper} variant="outlined">
        <Table size="small" stickyHeader>
          <TableHead>
            <TableRow>
              <StyledTableCell sx={{ fontWeight: 'bold', minWidth: 200 }}>
                Name of the canvassor
              </StyledTableCell>
              <StyledTableCell sx={{ fontWeight: 'bold', minWidth: 120 }}>
                City
              </StyledTableCell>
              {columnHeaders.map((col, i) => (
                <VerticalHeaderCell key={i} align="center">
                  <div className="verticalText">{col.bookName}</div>
                </VerticalHeaderCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {data.map((row, idx) => (
              <TableRow key={idx} hover>
                <StyledTableCell>{row.canvassorName}</StyledTableCell>
                <StyledTableCell>{row.city}</StyledTableCell>
                {row.columns.map((col, i) => (
                  <StyledTableCell key={i} align="center">
                    {col.count || ''}
                  </StyledTableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}

export default Canvassingdistwisesummarycross;