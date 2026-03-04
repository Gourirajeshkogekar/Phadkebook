import React, { useRef } from 'react';
import { 
  Table, TableBody, TableCell, TableContainer, TableHead, 
  TableRow, Paper, Typography, Box, Button 
} from '@mui/material';
import { Print as PrintIcon, ArrowBack as BackIcon } from '@mui/icons-material';
import dayjs from 'dayjs';

const PartywisePaperwiseInwardSummary = ({ reportData = [], params, onBack }) => {
  const reportRef = useRef();

  // Calculation for page count (as seen in legacy reports)
  const totalPages = 1; 

  return (
    <Box sx={{ p: 2, bgcolor: '#f5f5f5', minHeight: '100vh' }}>
      {/* Action Header */}
      <Paper sx={{ p: 2, mb: 2, display: 'flex', justifyContent: 'space-between', maxWidth: '1000px', mx: 'auto' }}>
        <Button startIcon={<BackIcon />} onClick={onBack} variant="outlined">Back to Form</Button>
        <Typography variant="h6" fontWeight="bold">Inward Summary</Typography>
        <Button variant="contained" startIcon={<PrintIcon />} onClick={() => window.print()}>Print PDF</Button>
      </Paper>

      {/* Actual Report Sheet */}
      <Paper ref={reportRef} sx={{ p: '10mm', width: '210mm', mx: 'auto', minHeight: '297mm', color: 'black' }}>
        
        {/* Header Section from Screenshot */}
        <Box sx={{ position: 'relative', mb: 1 }}>
          <Typography align="center" variant="h6" fontWeight="bold">Phadke Prakashan, Kolhapur.</Typography>
          <Typography align="center" variant="body1" fontWeight="bold">Party wise - Paper wise Paper Inward Summary</Typography>
          <Typography align="center" variant="body2">From {dayjs(params.startDate).format('DD-MM-YY')} to {dayjs(params.endDate).format('DD-MM-YY')}</Typography>
          <Typography sx={{ position: 'absolute', right: 0, top: 25, fontSize: '12px' }}>Page 1 of {totalPages}</Typography>
        </Box>

        <TableContainer>
          <Table size="small" sx={{ borderTop: '1.5px solid black' }}>
            <TableHead>
              <TableRow sx={{ borderBottom: '1.5px solid black' }}>
                <TableCell sx={thStyle} width="40%">Name of the Press/Party</TableCell>
                <TableCell sx={thStyle} width="30%">Paper Size</TableCell>
                <TableCell sx={thStyle} align="right">Paper Inward<br/>(incl. Wastage)</TableCell>
                <TableCell sx={thStyle} align="right">Reams</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {reportData.map((row, index) => (
                <TableRow key={index} sx={{ '& td': { border: 'none' } }}>
                  {/* Party Name - Only shows if different from previous row for clean look */}
                  <TableCell sx={tdStyle}>
                    {index === 0 || row.PartyName !== reportData[index-1].PartyName ? row.PartyName : ""}
                  </TableCell>
                  <TableCell sx={tdStyle}>{row.PaperSize || row.PaperName}</TableCell>
                  <TableCell sx={tdStyle} align="right">
                    {(parseFloat(row.TotalConsumption) || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                  </TableCell>
                  <TableCell sx={tdStyle} align="right">
                    {(parseFloat(row.Reams) || 0).toFixed(2)}
                  </TableCell>
                </TableRow>
              ))}
              
              {/* Final Bottom Border to match the screenshot style */}
              <TableRow sx={{ borderTop: '1.5px solid black' }}>
                <TableCell colSpan={4} sx={{ py: 0 }} />
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Box>
  );
};

// Styles to replicate the dot-matrix/legacy print look
const thStyle = { 
  fontWeight: 'bold', 
  fontSize: '11px', 
  color: 'black', 
  padding: '4px 8px',
  lineHeight: '1.2'
};

const tdStyle = { 
  fontSize: '11px', 
  color: 'black', 
  padding: '2px 8px',
  fontFamily: 'monospace' // Optional: gives it that legacy system feel
};

export default PartywisePaperwiseInwardSummary;