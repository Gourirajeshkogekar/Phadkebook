import React from 'react';
import { Box, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@mui/material";

const SalesChallanPrint = React.forwardRef((props, ref) => {
  // Mock data representing the items in your screenshot
  const items = [
    { id: 1, code: "P 5440", class: "School L.", desc: "Model Essays, Grammar & Communication Skill", qty: 2, rate: 45.00 },
    { id: 2, code: "P 6348", class: "School L.", desc: "सुबोध हिंदी लेखन", qty: 14, rate: 50.00 },
    { id: 3, code: "P 6425", class: "Std. XI", desc: "Basic Electricity & Semiconductor Devices", qty: 2, rate: 120.00 },
    // ... add more items as per your screenshot
  ];

  return (
    <Box 
      ref={ref} 
      sx={{ 
        width: "210mm", 
        minHeight: "297mm", 
        p: "10mm", 
        bgcolor: "white", 
        color: "black",
        fontFamily: "'Times New Roman', serif"
      }}
    >
      {/* HEADER SECTION */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 4, borderBottom: '1px solid black', pb: 2 }}>
        <Box>
          <Typography variant="h6" sx={{ fontWeight: 'bold' }}>Phadke Prakashan, Kolhapur.</Typography>
          <Typography variant="caption" display="block">Phadke Bhavan, Near Hari Mandir, Dudhali</Typography>
          <Typography variant="caption" display="block">Kolhapur - 416012. Tel No. - 2540 211</Typography>
        </Box>
        <Box sx={{ textAlign: 'right' }}>
          <Typography variant="h6" sx={{ fontWeight: 'bold' }}>PHADKE BOOK HOUSE, KOLHAPUR.</Typography>
          <Typography variant="caption" display="block">Phadke Bhavan, Kolhapur. Tel No.</Typography>
          <Typography variant="body2" sx={{ mt: 1, fontWeight: 'bold' }}>01-04-25</Typography>
        </Box>
      </Box>

      {/* ITEMS TABLE */}
      <TableContainer>
        <Table size="small" sx={{ "& td, & th": { border: "none", fontSize: "12px", py: 0.5 } }}>
          <TableHead>
            <TableRow sx={{ borderBottom: '1px solid black' }}>
              <TableCell sx={{ fontWeight: 'bold' }}>Sr.</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Code</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Class</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Description</TableCell>
              <TableCell align="right" sx={{ fontWeight: 'bold' }}>Qty</TableCell>
              <TableCell align="right" sx={{ fontWeight: 'bold' }}>Rate</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {items.map((item) => (
              <TableRow key={item.id}>
                <TableCell>{item.id}</TableCell>
                <TableCell>{item.code}</TableCell>
                <TableCell>{item.class}</TableCell>
                <TableCell>{item.desc}</TableCell>
                <TableCell align="right">{item.qty}</TableCell>
                <TableCell align="right">{item.rate.toFixed(2)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
});

export default SalesChallanPrint;