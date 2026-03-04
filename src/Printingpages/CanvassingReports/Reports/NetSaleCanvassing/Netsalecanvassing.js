import React, { useRef, useMemo } from 'react';
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
  fontSize: '10px',
  fontFamily: '"Times New Roman", Times, serif',
  color: 'black',
  height: '22px',
});

const VerticalHeaderCell = styled(StyledTableCell)({
  height: '220px', 
  whiteSpace: 'nowrap',
  verticalAlign: 'bottom',
  padding: '0 2px',
  width: '30px',
  '& .text-wrapper': {
    writingMode: 'vertical-rl',
    transform: 'rotate(180deg)',
    textAlign: 'left',
    fontWeight: 'bold',
    fontSize: '9px',
    margin: '0 auto',
    display: 'block',
    lineHeight: 1.1,
  }
});

const Netsalecanvassing = ({ 
  rawDbData = [], 
  dateRange = { from: "01-04-25", to: "31-03-26" } 
}) => {
  const componentRef = useRef();
  const navigate = useNavigate();

  const { bookList, rows } = useMemo(() => {
    if (!rawDbData.length) return { bookList: [], rows: [] };
    const books = [...new Set(rawDbData.map(item => item.bookName))].sort();
    const grouped = rawDbData.reduce((acc, item) => {
      const key = item.collegeName || item.canvassorName;
      if (!acc[key]) {
        acc[key] = { name: key, quantities: {} };
      }
      acc[key].quantities[item.bookName] = (acc[key].quantities[item.bookName] || 0) + item.copies;
      return acc;
    }, {});
    return { bookList: books, rows: Object.values(grouped) };
  }, [rawDbData]);

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
    // Changed bgcolor from #525659 to a very light, clean grey
    <Box sx={{ bgcolor: '#f8f9fa', minHeight: '100vh', p: 3 }}>
      
      {/* Navigation & Actions */}
      <Stack direction="row" spacing={2} sx={{ mb: 3, "@media print": { display: 'none' } }}>
         <Button variant="outlined" startIcon={<ArrowBackIcon />} onClick={() => navigate(-1)} sx={{ bgcolor: 'white' }}>
          Back
        </Button>
         <Button variant="contained" startIcon={<PrintIcon />} onClick={handlePrint}>
          Print Report
        </Button>
      </Stack>

      {/* Main Report Container */}
      <Paper 
        ref={componentRef} 
        elevation={1} // Minimal shadow for a clean look
        sx={{ 
          p: '10mm', 
          width: 'fit-content', 
          minWidth: '277mm', 
          bgcolor: 'white', 
          mx: 'auto',
          border: '1px solid #e0e0e0' 
        }}
      >
        {/* Header Section */}
        <Box sx={{ mb: 2, borderBottom: '2px solid #333', pb: 1 }}>
          <Typography sx={{ fontSize: '18px', fontWeight: 'bold', fontFamily: 'serif' }}>
            M. V. Phadke & Co. Kolhapur
          </Typography>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
            <Box>
              <Typography sx={{ fontSize: '14px', fontWeight: 'bold' }}>Net Sale Canvassing</Typography>
              <Typography sx={{ fontSize: '11px' }}>From {dateRange.from} to {dateRange.to}</Typography>
            </Box>
          </Box>
        </Box>

        <TableContainer>
          <Table sx={{ borderCollapse: 'collapse', tableLayout: 'fixed', width: 'auto' }}>
            <TableHead>
              <TableRow>
                <StyledTableCell sx={{ width: '250px', fontWeight: 'bold', bgcolor: '#f2f2f2' }}>
                  Name of the college / Canvassor
                </StyledTableCell>
                {bookList.map((book, i) => (
                  <VerticalHeaderCell key={i} sx={{ bgcolor: '#f2f2f2' }}>
                    <span className="text-wrapper">{book}</span>
                  </VerticalHeaderCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {rows.map((row, idx) => (
                <TableRow key={idx}>
                  <StyledTableCell sx={{ whiteSpace: 'nowrap', fontWeight: 500 }}>
                    {row.name}
                  </StyledTableCell>
                  {bookList.map((book, i) => (
                    <StyledTableCell key={i} align="center">
                      {row.quantities[book] || ""}
                    </StyledTableCell>
                  ))}
                </TableRow>
              ))}

              {/* Total Footer Row */}
              <TableRow>
                <StyledTableCell sx={{ fontWeight: 'bold', textAlign: 'right', bgcolor: '#f9f9f9' }}>
                  TOTAL
                </StyledTableCell>
                {bookList.map((book, i) => {
                  const total = rows.reduce((sum, r) => sum + (r.quantities[book] || 0), 0);
                  return (
                    <StyledTableCell key={i} align="center" sx={{ fontWeight: 'bold', bgcolor: '#f9f9f9' }}>
                      {total || ""}
                    </StyledTableCell>
                  );
                })}
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>

        {/* Footer Meta Info */}
        <Box sx={{ mt: 3, pt: 1, borderTop: '1px solid #eee', display: 'flex', justifyContent: 'space-between' }}>
           <Typography sx={{ fontSize: '10px', color: '#666' }}>
             Total Records: {rows.length}
           </Typography>
           <Typography sx={{ fontSize: '10px', color: '#666' }}>
             Printed on: {new Date().toLocaleString()}
           </Typography>
        </Box>
      </Paper>
    </Box>
  );
};

export default Netsalecanvassing;