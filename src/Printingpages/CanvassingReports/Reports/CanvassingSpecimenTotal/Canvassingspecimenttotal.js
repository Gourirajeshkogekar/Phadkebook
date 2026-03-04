import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from "react-router-dom";
import { Box, Typography, Button, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@mui/material";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

const Canvassingspecimenttotal = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const componentRef = useRef();
  const [reportData, setReportData] = useState([]);
  const filters = location.state?.filters;

  useEffect(() => {
    fetch('https://publication.microtechsolutions.net.in/php/get/getCanvassingSpecimenTotal.php', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(filters) 
    })
    .then(res => res.json())
    .then(data => setReportData(data))
    .catch(err => console.error(err));
  }, [filters]);

  const handlePrint = async () => {
    const canvas = await html2canvas(componentRef.current, { scale: 2 });
    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF("p", "mm", "a4");
    pdf.addImage(imgData, "PNG", 0, 0, 210, (canvas.height * 210) / canvas.width);
    window.open(pdf.output("bloburl"), "_blank");
  };

  return (
    <Box sx={{ bgcolor: 'white' }}>
      <Stack direction="row" spacing={2} sx={{ p: 2 }}>
        <Button variant="outlined" onClick={() => navigate(-1)}>Back</Button>
        <Button variant="contained" onClick={handlePrint}>Print Report</Button>
      </Stack>

      <Box ref={componentRef} sx={{ p: '10mm' }}>
        <Box sx={{ textAlign: 'center', mb: 2 }}>
          <Typography variant="h6" fontWeight="bold">M. V. Phadke & Co. Kolhapur</Typography>
          <Typography variant="subtitle2" fontWeight="bold">Canvassing Specimen Total</Typography>
        </Box>

        <TableContainer>
          <Table size="small" sx={{ '& .MuiTableCell-root': { border: 'none', fontSize: '11px' } }}>
            <TableHead>
              <TableRow sx={{ borderTop: '1.5pt solid black', borderBottom: '1.5pt solid black' }}>
                <TableCell sx={{ fontWeight: 'bold' }}>Name of the college</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Name of the Professor</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Chln. Dt.</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Chln. No.</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Total Copies</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Book Code</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {reportData.map((group, idx) => (
                <React.Fragment key={idx}>
                  <TableRow>
                    <TableCell colSpan={6} sx={{ fontWeight: 'bold', pt: 2, textAlign: 'center' }}>
                      {group.party_header}
                    </TableCell>
                  </TableRow>
                  {group.details.map((row, rIdx) => (
                    <TableRow key={rIdx}>
                      <TableCell>{row.college}</TableCell>
                      <TableCell>{row.professor}</TableCell>
                      <TableCell>{row.date}</TableCell>
                      <TableCell>{row.chln_no}</TableCell>
                      <TableCell align="center">{row.total_copies}</TableCell>
                      <TableCell>{row.book_code}</TableCell>
                    </TableRow>
                  ))}
                </React.Fragment>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </Box>
  );
};

export default Canvassingspecimenttotal;