import React, { useRef, useState } from 'react';
import { 
  Table, TableBody, TableCell, TableContainer, 
  TableHead, TableRow, Paper, Typography, Box, Button, CircularProgress
} from '@mui/material';
import { Print as PrintIcon, ArrowBack as BackIcon } from '@mui/icons-material';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import dayjs from 'dayjs';

const GodownwisepaperReport = ({ reportData, params, onBack, title }) => {
  const reportRef = useRef();
  const [printing, setPrinting] = useState(false);

  // Grouping logic for the UI view
  const groupedData = reportData.reduce((acc, row) => {
    const godown = row.GodownName || "Unknown Godown";
    const paper = row.PaperSizeName || "Standard Paper";
    if (!acc[godown]) acc[godown] = {};
    if (!acc[godown][paper]) acc[godown][paper] = [];
    acc[godown][paper].push(row);
    return acc;
  }, {});

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
      
      {/* ACTION BAR */}
      <Paper sx={{ p: 1.5, mb: 1, maxWidth: '210mm', mx: 'auto', display: 'flex', justifyContent: 'space-between' }}>
        <Button startIcon={<BackIcon />} onClick={onBack} variant="outlined" size="small">
          Back to Form
        </Button>
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

      {/* PRINTABLE AREA */}
      <Paper 
        ref={reportRef} 
        sx={{ width: '210mm', minHeight: '297mm', mx: 'auto', p: '10mm', bgcolor: 'white', boxShadow: 3 }}
      >
        <Box sx={{ textAlign: 'center', mb: 2 }}>
          <Typography variant="h5" sx={{ fontWeight: 'bold' }}>PHADKE PRAKASHAN, KOLHAPUR</Typography>
          <Typography variant="subtitle1" sx={{ textDecoration: 'underline', fontWeight: 'bold' }}>
            {title}
          </Typography>
          <Typography variant="caption" display="block">
            From {dayjs(params.startDate).format('DD-04-YYYY')} To {dayjs(params.endDate).format('DD-03-YYYY')}
          </Typography>
        </Box>

        <TableContainer component={Box}>
          <Table size="small" sx={{ border: '1px solid #000' }}>
            <TableHead>
              <TableRow sx={{ bgcolor: '#eee', borderBottom: '2px solid #000' }}>
                <TableCell sx={headerStyle}>Tr.Cd</TableCell>
                <TableCell sx={headerStyle}>DC No.</TableCell>
                <TableCell sx={headerStyle}>Date</TableCell>
                <TableCell sx={headerStyle}>Particulars</TableCell>
                <TableCell sx={headerStyle}>Bundles</TableCell>
                <TableCell sx={{...headerStyle, textAlign: 'right'}}>Inward Qty.</TableCell>
                <TableCell sx={{...headerStyle, textAlign: 'right'}}>Outward Qty.</TableCell>
                <TableCell sx={headerStyle}>Unit</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {Object.entries(groupedData).map(([godown, papers]) => (
                <React.Fragment key={godown}>
                  {/* Godown Header */}
                  <TableRow>
                    <TableCell colSpan={8} sx={{ fontWeight: 'bold', textDecoration: 'underline', bgcolor: '#f9f9f9' }}>
                      {godown}
                    </TableCell>
                  </TableRow>

                  {Object.entries(papers).map(([paper, entries]) => {
                    const subIn = entries.reduce((s, r) => s + parseFloat(r.InwardQuantity || 0), 0);
                    const subOut = entries.reduce((s, r) => s + parseFloat(r.OutwardQuantity || 0), 0);

                    return (
                      <React.Fragment key={paper}>
                        {/* Paper Size Sub-Header */}
                        <TableRow>
                          <TableCell colSpan={8} sx={{ fontWeight: 'bold', textAlign: 'center', fontSize: '0.75rem' }}>
                            {paper}
                          </TableCell>
                        </TableRow>

                        {/* Data Rows */}
                        {entries.map((row, idx) => (
                          <TableRow key={idx}>
                            <TableCell sx={cellStyle}>{row.TrCd || 'OT'}</TableCell>
                            <TableCell sx={cellStyle}>{row.ChallanNo || row.DCNo}</TableCell>
                            <TableCell sx={cellStyle}>{dayjs(row.ChallanDate).format('DD-MM-YY')}</TableCell>
                            <TableCell sx={cellStyle}>{row.AccountName || row.Particulars}</TableCell>
                            <TableCell sx={cellStyle}>{row.OutwardBundles || 0}</TableCell>
                            <TableCell sx={{...cellStyle, textAlign: 'right'}}>{parseFloat(row.InwardQuantity || 0).toFixed(3)}</TableCell>
                            <TableCell sx={{...cellStyle, textAlign: 'right'}}>{parseFloat(row.OutwardQuantity || 0).toFixed(3)}</TableCell>
                            <TableCell sx={cellStyle}>{row.Unit}</TableCell>
                          </TableRow>
                        ))}

                        {/* Sub Total Row */}
                        <TableRow sx={{ borderTop: '1px solid #000' }}>
                          <TableCell colSpan={3} />
                          <TableCell sx={{ fontWeight: 'bold', fontSize: '0.7rem' }}>Sub Total: {paper}</TableCell>
                          <TableCell />
                          <TableCell sx={{ fontWeight: 'bold', textAlign: 'right', fontSize: '0.7rem' }}>{subIn.toFixed(3)}</TableCell>
                          <TableCell sx={{ fontWeight: 'bold', textAlign: 'right', fontSize: '0.7rem' }}>{subOut.toFixed(3)}</TableCell>
                          <TableCell />
                        </TableRow>
                      </React.Fragment>
                    );
                  })}
                </React.Fragment>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Box>
  );
};

const headerStyle = { fontWeight: 'bold', fontSize: '0.7rem', border: '1px solid #000', padding: '4px' };
const cellStyle = { fontSize: '0.7rem', border: 'none', padding: '4px' };

export default GodownwisepaperReport;