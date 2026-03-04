import React, { useRef , useState} from 'react';
import { 
  Table, TableBody, TableCell, TableContainer, TableHead, 
  TableRow, Paper, Typography, Box, Button 
} from '@mui/material';
import { Print as PrintIcon, ArrowBack as BackIcon } from '@mui/icons-material';
import dayjs from 'dayjs';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
const PaperStockBook = ({ reportData = [], params, onBack }) => {
  const reportRef = useRef();
  const [printing, setPrinting] = useState(false);

  // Group by Paper Name (and Paper Code if available)
  const grouped = reportData.reduce((acc, row) => {
    const key = row.PaperName || "Unknown Paper";
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
    <Box sx={{ p: 2, bgcolor: '#f5f5f5', minHeight: '100vh' }}>
      {/* Action Bar */}
      <Paper sx={{ p: 2, mb: 2, display: 'flex', justifyContent: 'space-between', maxWidth: '1000px', mx: 'auto' }}>
        <Button startIcon={<BackIcon />} onClick={onBack} variant="outlined">Back to Form</Button>
        <Typography variant="h6" fontWeight="bold">Paper Stock Book</Typography>
        <Button variant="contained" startIcon={<PrintIcon />} onClick={handlePrint}>Print PDF</Button>
      </Paper>

      {/* Actual Printed Report Sheet */}
      <Paper ref={reportRef} sx={{ p: '10mm', width: '210mm', mx: 'auto', minHeight: '297mm', color: 'black' }}>
        
        {/* Company Header */}
        <Box textAlign="center" mb={1} position="relative">
          <Typography variant="h6" fontWeight="bold">Phadke Prakashan, Kolhapur.</Typography>
          <Typography variant="body1" sx={{ textDecoration: 'underline', fontWeight: 'bold' }}>Paper Stock Book</Typography>
          <Typography variant="body2">From {dayjs(params.startDate).format('DD-MM-YYYY')} to {dayjs(params.endDate).format('DD-MM-YYYY')}</Typography>
          <Typography sx={{ position: 'absolute', right: 0, top: 35, fontSize: '11px' }}>Page 1 of 1</Typography>
        </Box>

        <TableContainer>
          <Table size="small">
            <TableHead>
              <TableRow sx={{ borderTop: '1.5px solid black', borderBottom: '1.5px solid black' }}>
                <TableCell sx={th}>Tr.Cd</TableCell>
                <TableCell sx={th}>Gdn.</TableCell>
                <TableCell sx={th}>DC No.</TableCell>
                <TableCell sx={th}>Date</TableCell>
                <TableCell sx={th} width="30%">Particulars</TableCell>
                <TableCell sx={th} align="right">Bundles</TableCell>
                <TableCell sx={th} align="right">Inward Qty.</TableCell>
                <TableCell sx={th} align="right">Outward Qty.</TableCell>
                <TableCell sx={th} align="right">Balance</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {Object.entries(grouped).map(([paper, rows]) => {
                // Calculate Totals for this paper group
                const totalIn = rows.reduce((sum, r) => sum + (parseFloat(r.InwardQty) || 0), 0);
                const totalOut = rows.reduce((sum, r) => sum + (parseFloat(r.OutwardQty) || 0), 0);
                
                return (
                  <React.Fragment key={paper}>
                    {/* Paper Group Header row based on screenshot */}
                    <TableRow>
                      <TableCell sx={{ fontWeight: 'bold', fontSize: '12px', border: 'none' }}>
                        {rows[0].PaperCode || 'P---'}
                      </TableCell>
                      <TableCell colSpan={7} align="center" sx={{ fontWeight: 'bold', textDecoration: 'underline', fontSize: '12px', border: 'none' }}>
                        {paper.toUpperCase()}
                      </TableCell>
                      <TableCell align="right" sx={{ fontWeight: 'bold', fontSize: '11px', border: 'none' }}>
                        {rows[0].Unit || 'REAM'}
                      </TableCell>
                    </TableRow>

                    {/* Data Rows */}
                    {rows.map((row, i) => (
                      <TableRow key={i} sx={{ '& td': { border: 'none' } }}>
                        <TableCell sx={td}>{row.TrCd}</TableCell>
                        <TableCell sx={td}>{row.Gdn}</TableCell>
                        <TableCell sx={td}>{row.DCNo}</TableCell>
                        <TableCell sx={td}>{dayjs(row.Date).format('DD-MM-YY')}</TableCell>
                        <TableCell sx={td}>{row.Particulars}</TableCell>
                        <TableCell sx={td} align="right">{row.Bundles || 0}</TableCell>
                        <TableCell sx={td} align="right">{(parseFloat(row.InwardQty) || 0).toFixed(3)}</TableCell>
                        <TableCell sx={td} align="right">{(parseFloat(row.OutwardQty) || 0).toFixed(3)}</TableCell>
                        <TableCell sx={td} align="right" fontWeight="bold">{(parseFloat(row.Balance) || 0).toFixed(3)}</TableCell>
                      </TableRow>
                    ))}

                    {/* Sub Total Row with double lines */}
                    <TableRow>
                      <TableCell colSpan={5} align="right" sx={{ fontSize: '10px', fontWeight: 'bold', border: 'none' }}>
                        Sub Total &nbsp; {paper}:
                      </TableCell>
                      <TableCell sx={{ border: 'none' }} /> {/* Bundles column empty in subtotal */}
                      <TableCell align="right" sx={subTotalStyle}>
                        {totalIn.toFixed(3)}
                      </TableCell>
                      <TableCell align="right" sx={subTotalStyle}>
                        {totalOut.toFixed(3)}
                      </TableCell>
                      <TableCell sx={{ border: 'none' }} />
                    </TableRow>
                  </React.Fragment>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Box>
  );
};

// Styling to match the legacy dot-matrix system
const th = { fontWeight: 'bold', fontSize: '11px', color: 'black', border: 'none', py: 0.5 };
const td = { fontSize: '11px', color: 'black', border: 'none', py: 0.2 };
const subTotalStyle = { 
  fontWeight: 'bold', 
  fontSize: '11px', 
  borderTop: '1px solid black', 
  borderBottom: '2.5px double black', // Replicates the double line in screenshot
  py: 0.5 
};

export default PaperStockBook;