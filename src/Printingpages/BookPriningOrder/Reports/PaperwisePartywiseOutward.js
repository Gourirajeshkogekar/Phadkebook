import React, { useRef, useState } from 'react';
import { 
  Table, TableBody, TableCell, TableContainer, 
  TableHead, TableRow, Paper, Typography, Box, Button, CircularProgress, Stack
} from '@mui/material';
import { Print as PrintIcon, ArrowBack as BackIcon } from '@mui/icons-material';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

const PaperwisePartywiseOutward = ({ reportData, params, onBack, title }) => {
  const reportRef = useRef();
  const [printing, setPrinting] = useState(false);

  const handlePrint = async () => {
    setPrinting(true);
    try {
      const canvas = await html2canvas(reportRef.current, { scale: 2 });
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");
      const width = pdf.internal.pageSize.getWidth();
      const height = (canvas.height * width) / canvas.width;
      pdf.addImage(imgData, "PNG", 0, 0, width, height);
      window.open(pdf.output("bloburl"), "_blank");
    } catch (error) {
      console.error("Print Error:", error);
    } finally {
      setPrinting(false);
    }
  };

  return (
    <Box sx={{ bgcolor: '#f0f2f5', minHeight: '100vh', p: 1 }}>
      
      {/* ACTION BAR: Back and Print Buttons */}
      <Paper sx={{ p: 1.5, mb: 1, maxWidth: '210mm', mx: 'auto', display: 'flex', justifyContent: 'space-between', borderRadius: 1 }}>
        <Button startIcon={<BackIcon />} onClick={onBack} variant="outlined" size="small">
          Back
        </Button>
        <Typography variant="subtitle1" sx={{ fontWeight: 'bold', alignSelf: 'center' }}>
          Report Preview
        </Typography>
        <Button 
          variant="contained" 
          size="small"
          startIcon={printing ? <CircularProgress size={16} color="inherit" /> : <PrintIcon />} 
          onClick={handlePrint}
          disabled={printing}
        >
          {printing ? "Generating..." : "Print PDF"}
        </Button>
      </Paper>

      {/* PRINTABLE AREA (A4 Paper) */}
      <Paper 
        ref={reportRef} 
        sx={{ 
          width: '210mm', 
          minHeight: '297mm', 
          mx: 'auto', 
          p: '10mm', 
          bgcolor: 'white', 
          boxShadow: 3 
        }}
      >
        {/* Report Header */}
        <Box sx={{ textAlign: 'center', mb: 3 }}>
          <Typography variant="h5" sx={{ fontWeight: 'bold', letterSpacing: 1 }}>
            PHADKE BOOK HOUSE
          </Typography>
          <Typography variant="subtitle1" sx={{ textDecoration: 'underline', fontWeight: 'bold' }}>
            {title || "Paperwise Partywise Paper outward"}
          </Typography>
          <Typography variant="caption" display="block">
            From {params?.startDate || '01-04-25'} to {params?.endDate || '31-03-26'}
          </Typography>
        </Box>

        <TableContainer sx={{ border: '1px solid #000' }}>
          <Table size="small">
            <TableHead>
              <TableRow sx={{ backgroundColor: '#f5f5f5', borderBottom: '2px solid #000' }}>
                <TableCell sx={headerStyle}>Tr.Cd</TableCell>
                <TableCell sx={headerStyle}>DC No.</TableCell>
                <TableCell sx={headerStyle}>Date</TableCell>
                <TableCell sx={headerStyle}>Godown</TableCell>
                <TableCell sx={headerStyle}>Bundles</TableCell>
                <TableCell sx={{ ...headerStyle, textAlign: 'right' }}>Qty.</TableCell>
                <TableCell sx={headerStyle}>Unit</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {reportData && reportData.length > 0 ? reportData.map((group, gIdx) => (
                <React.Fragment key={gIdx}>
                  {/* Party Group Header */}
                  <TableRow>
                    <TableCell colSpan={7} sx={{ fontWeight: 'bold', bgcolor: '#fafafa', py: 1, borderBottom: '1px solid #000' }}>
                      Party: {group.partyName || "N/A"}
                    </TableCell>
                  </TableRow>
                  
                  {group.items?.map((row, index) => (
                    <TableRow key={index}>
                      <TableCell sx={cellStyle}>{row.trCd}</TableCell>
                      <TableCell sx={cellStyle}>{row.dcNo}</TableCell>
                      <TableCell sx={cellStyle}>{row.date}</TableCell>
                      <TableCell sx={cellStyle}>{row.godown}</TableCell>
                      <TableCell sx={cellStyle}>{row.bundles}</TableCell>
                      <TableCell sx={{ ...cellStyle, textAlign: 'right' }}>{row.qty}</TableCell>
                      <TableCell sx={cellStyle}>{row.unit}</TableCell>
                    </TableRow>
                  ))}

                  {/* Sub Total Row */}
                  <TableRow sx={{ borderTop: '1px double #000' }}>
                    <TableCell colSpan={4} />
                    <TableCell sx={{ fontWeight: 'bold', fontSize: '0.8rem' }}>Sub Total:</TableCell>
                    <TableCell sx={{ fontWeight: 'bold', textAlign: 'right', fontSize: '0.8rem', borderTop: '1px solid #000' }}>
                      {group.items?.reduce((sum, i) => sum + i.qty, 0).toFixed(3)}
                    </TableCell>
                    <TableCell />
                  </TableRow>
                </React.Fragment>
              )) : (
                <TableRow>
                  <TableCell colSpan={7} align="center">No data found for selected criteria.</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>

        <Box sx={{ mt: 2, textAlign: 'right', pr: 2 }}>
          <Typography variant="caption" sx={{ fontStyle: 'italic' }}>
            Page 1 of 1
          </Typography>
        </Box>
      </Paper>
    </Box>
  );
};

// Styles
const headerStyle = {
  fontWeight: 'bold',
  color: '#000',
  fontSize: '0.75rem',
  textTransform: 'uppercase',
  border: '1px solid #000'
};

const cellStyle = {
  fontSize: '0.75rem',
  borderBottom: 'none',
  padding: '4px'
};

export default PaperwisePartywiseOutward;