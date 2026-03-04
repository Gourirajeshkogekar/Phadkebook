import React, { useRef, useState } from 'react';
import { Box, Typography, Paper, Table, TableHead, TableRow, TableCell, TableBody, Button, TableContainer } from '@mui/material';
import { Print as PrintIcon, ArrowBack as BackIcon } from '@mui/icons-material';
import dayjs from 'dayjs';
import jsPDF from 'jspdf';

import html2canvas from 'html2canvas';
const PaperConsumptionDetails = ({ reportData = [], params, onBack }) => {
  const reportRef = useRef();
  const [printing, setPrinting] = useState(false);

  const groupedData = reportData.reduce((acc, row) => {
    const key = row.OrderNo || row.BookName;
    if (!acc[key]) acc[key] = [];
    acc[key].push(row);
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
    <Box sx={{ p: 1, bgcolor: '#f5f5f5', minHeight: '100vh' }}>
      <Paper sx={{ p: 1, mb: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Button startIcon={<BackIcon />} onClick={onBack} size="small">Back</Button>
        <Typography variant="subtitle1" fontWeight="bold">Paper Consumption Details</Typography>
        <Button variant="contained" startIcon={<PrintIcon />} onClick={handlePrint} size="small">Print PDF</Button>
      </Paper>

      {/* Container that forces horizontal content to fit or scroll tightly */}
      <TableContainer component={Paper} elevation={3} sx={{ overflowX: 'auto', p: '2mm', backgroundColor: 'white' }}>
        <Box ref={reportRef} sx={{ minWidth: '1000px', color: 'black' }}>
          
          <Box textAlign="center" mb={1}>
            <Typography variant="subtitle2" fontWeight="bold">Phadke Prakashan, Kolhapur.</Typography>
            <Typography variant="caption" display="block" sx={{ textDecoration: 'underline', fontWeight: 'bold' }}>Paper Consumption Details</Typography>
            <Typography variant="caption">From {dayjs(params.startDate).format('DD-MM-YYYY')} to {dayjs(params.endDate).format('DD-MM-YYYY')}</Typography>
          </Box>

          <Table size="small" sx={{ tableLayout: 'fixed', width: '100%' }}>
            <TableHead>
              <TableRow sx={{ borderTop: '1px solid black', borderBottom: '1px solid black' }}>
                <TableCell sx={th} width="65px">Trans. Dt.</TableCell>
                <TableCell sx={th} width="60px">Order No.</TableCell>
                <TableCell sx={th} width="60px">Book Cd</TableCell>
                <TableCell sx={th}>Particulars / Book Name</TableCell>
                <TableCell sx={th} width="45px" align="right">Copies</TableCell>
                <TableCell sx={th} width="35px" align="center">Fr</TableCell>
                <TableCell sx={th} width="35px" align="center">To</TableCell>
                <TableCell sx={th} width="35px" align="center">Nos</TableCell>
                <TableCell sx={th} width="80px">Plate Maker</TableCell>
                <TableCell sx={th} width="70px">Paper Size</TableCell>
                <TableCell sx={th} width="40px" align="right">Pgs</TableCell>
                <TableCell sx={th} width="55px" align="right">Consum.</TableCell>
                <TableCell sx={th} width="50px" align="right">Reams</TableCell>
                <TableCell sx={th} width="80px">Remarks</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {Object.entries(groupedData).map(([key, rows]) => {
                const totalConsum = rows.reduce((sum, r) => sum + (parseFloat(r.Consumption) || 0), 0);
                const totalReams = rows.reduce((sum, r) => sum + (parseFloat(r.Reams) || 0), 0);
                
                return (
                  <React.Fragment key={key}>
                    {/* Header Row for Book */}
                    <TableRow sx={rowStyle}>
                      <TableCell sx={tdB}>{dayjs(rows[0].Date).format('DD-MM-YY')}</TableCell>
                      <TableCell sx={tdB}>{rows[0].OrderNo}</TableCell>
                      <TableCell sx={tdB}>{rows[0].BookCode}</TableCell>
                      <TableCell sx={{ ...tdB, textDecoration: 'underline' }} colSpan={11}>
                        {rows[0].BookName}
                      </TableCell>
                    </TableRow>

                    {/* Data Rows */}
                    {rows.map((row, i) => (
                      <TableRow key={i} sx={rowStyle}>
                        <TableCell colSpan={3} />
                        <TableCell sx={td}>{row.Particulars}</TableCell>
                        <TableCell sx={td} align="right">{row.Copies}</TableCell>
                        <TableCell sx={td} align="center">{row.FormsFrom}</TableCell>
                        <TableCell sx={td} align="center">{row.FormsTo}</TableCell>
                        <TableCell sx={td} align="center">{row.FormsNos}</TableCell>
                        <TableCell sx={td}>{row.PlateMaker}</TableCell>
                        <TableCell sx={td}>{row.PaperSize}</TableCell>
                        <TableCell sx={td} align="right">{row.BookPages}</TableCell>
                        <TableCell sx={td} align="right">{row.Consumption}</TableCell>
                        <TableCell sx={td} align="right">{row.Reams}</TableCell>
                        <TableCell sx={td}>{row.Remarks}</TableCell>
                      </TableRow>
                    ))}

                    {/* Compact Subtotal */}
                    <TableRow sx={rowStyle}>
                      <TableCell colSpan={10} />
                      <TableCell sx={tdB} align="right">Total:</TableCell>
                      <TableCell sx={subTotalStyle} align="right">{totalConsum.toFixed(2)}</TableCell>
                      <TableCell sx={subTotalStyle} align="right">{totalReams.toFixed(2)}</TableCell>
                      <TableCell />
                    </TableRow>
                  </React.Fragment>
                );
              })}
            </TableBody>
          </Table>
        </Box>
      </TableContainer>
    </Box>
  );
};

// Extremely compact legacy styles
const th = { 
  fontSize: '9px', 
  fontWeight: 'bold', 
  color: 'black', 
  border: 'none', 
  p: '2px', 
  whiteSpace: 'nowrap',
  lineHeight: 1
};

const td = { 
  fontSize: '9px', 
  color: 'black', 
  border: 'none', 
  p: '2px', 
  whiteSpace: 'nowrap',
  overflow: 'hidden',
  textOverflow: 'ellipsis' 
};

const tdB = { ...td, fontWeight: 'bold' };

const rowStyle = { '&:hover': { bgcolor: '#f9f9f9' }, height: '18px' };

const subTotalStyle = { 
  fontWeight: 'bold', 
  fontSize: '9px', 
  borderTop: '1px solid black', 
  borderBottom: '1.5px solid black', 
  p: '2px' 
};

export default PaperConsumptionDetails;