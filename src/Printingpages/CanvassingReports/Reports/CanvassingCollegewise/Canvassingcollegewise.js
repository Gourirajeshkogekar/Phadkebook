import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from "react-router-dom";
import { 
  Box, Typography, Button, Stack, Container, 
  CircularProgress, Table, TableBody, 
  TableCell, TableContainer, TableHead, TableRow, Paper 
} from "@mui/material";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import PrintIcon from '@mui/icons-material/Print';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

const Canvassingcollegewise = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const componentRef = useRef(); 

  const [reportData, setReportData] = useState({});
  const [loading, setLoading] = useState(true);

  const filters = location.state?.filters;
  const isPrintMode = location.state?.printMode;

  useEffect(() => {
    if (isPrintMode && filters) {
      setLoading(true);
      
      // Using GET params as per your provided URL structure
      const start = filters?.startdate || "2025-04-01";
      const end = filters?.enddate || "2026-03-31";
      const url = `https://publication.microtechsolutions.net.in/php/get/getCanvassingCollegewise.php?fromdate=${start}&todate=${end}`;

      fetch(url)
        .then((res) => res.json())
        .then((json) => {
          if (json.success && Array.isArray(json.data)) {
            // Transform: Group by CollegeName, then by Class (Standard)
            const grouped = json.data.reduce((acc, item) => {
              const college = item.CollegeName || "UNKNOWN COLLEGE";
              const std = item.Class || "B.Com II"; // Use item.Class from API if available

              if (!acc[college]) acc[college] = {};
              if (!acc[college][std]) acc[college][std] = [];
              
              acc[college][std].push(item);
              return acc;
            }, {});
            
            setReportData(grouped);
          }
          setLoading(false);
        })
        .catch((err) => {
          console.error("Fetch error:", err);
          setLoading(false);
        });
    }
  }, [isPrintMode, filters]);

  const handlePrint = async () => {
    if (!componentRef.current) return;
    const canvas = await html2canvas(componentRef.current, { scale: 2 });
    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
    pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
    window.open(pdf.output("bloburl"), "_blank");
  };

  if (!isPrintMode) return null;

  return (
    <Box sx={{ bgcolor: '#f5f5f5', minHeight: '100vh' }}>
      <Stack direction="row" spacing={2} sx={{ p: 2, bgcolor: 'white', "@media print": { display: 'none' } }}>
        <Button variant="outlined" startIcon={<ArrowBackIcon />} onClick={() => navigate(-1)}>Back</Button>
        <Button variant="contained" startIcon={<PrintIcon />} onClick={handlePrint} disabled={loading}>Print PDF</Button>
      </Stack>

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 10 }}><CircularProgress /></Box>
      ) : (
        <Container maxWidth="lg" sx={{ py: 3 }}>
          <Paper ref={componentRef} elevation={0} sx={{ p: '10mm', bgcolor: 'white', fontFamily: 'serif' }}>
            
            <Box sx={{ textAlign: 'center', mb: 3 }}>
              <Typography variant="h6" fontWeight="bold">Phadke Prakashan, Kolhapur.</Typography>
              <Typography variant="subtitle2" fontWeight="bold">Canvassing Collegewise</Typography>
 <Typography variant="caption">
  From {filters?.startdate || "Not Selected"} to {filters?.enddate || "Not Selected"}
 </Typography>
            </Box>

            <TableContainer>
              <Table size="small" sx={{ "& .MuiTableCell-root": { borderBottom: 'none', py: 0.5, fontFamily: 'serif', fontSize: '11px' } }}>
                <TableHead>
                  <TableRow sx={{ borderTop: '1.5pt solid black', borderBottom: '1.5pt solid black' }}>
                    <TableCell sx={{ fontWeight: 'bold' }}>Book Code</TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }}>Book Name</TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }}>Professor Name</TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }}>Chln. No</TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }}>Chln. Dt.</TableCell>
                    <TableCell sx={{ fontWeight: 'bold', textAlign: 'center' }}>Copies</TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }}>Feeding Dt</TableCell>
                    <TableCell sx={{ fontWeight: 'bold', textAlign: 'right' }}>Entry #</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {Object.keys(reportData).map((college) => (
                    <React.Fragment key={college}>
                      {/* College Name Header */}
                      <TableRow>
                        <TableCell colSpan={8} align="center" sx={{ pt: 3, pb: 0 }}>
                          <Typography sx={{ fontWeight: 'bold', fontSize: '13px', textTransform: 'uppercase', borderBottom: '1px solid black', display: 'inline-block' }}>
                            {college}
                          </Typography>
                        </TableCell>
                      </TableRow>

                      {Object.keys(reportData[college]).map((std) => (
                        <React.Fragment key={std}>
                          {/* Standard/Class Header */}
                          <TableRow>
                            <TableCell colSpan={8} align="center" sx={{ pb: 1 }}>
                              <Typography sx={{ fontWeight: 'bold', fontSize: '11px' }}>{std}</Typography>
                            </TableCell>
                          </TableRow>

                          {/* Data Rows */}
                          {reportData[college][std].map((item, i) => (
                            <TableRow key={i}>
                              <TableCell>{item.BookCode || "P 6609"}</TableCell>
                              <TableCell sx={{ maxWidth: '200px' }}>{item.BookName || "---"}</TableCell>
                              <TableCell>{item.ProfessorName || "---"}</TableCell>
                              <TableCell>{item.ChlnNo}</TableCell>
                              <TableCell>{item.ChlnDt || "---"}</TableCell>
                              <TableCell align="center">
                                <Box sx={{ borderBottom: '1px solid black', minWidth: '20px', display: 'inline-block' }}>
                                  {item.Copies || 1}
                                </Box>
                              </TableCell>
                              <TableCell>{item.FeedingDt || "---"}</TableCell>
                              <TableCell align="right">{item.Entry}</TableCell>
                            </TableRow>
                          ))}
                          {/* Underline after each group of entries */}
                          <TableRow>
                            <TableCell colSpan={8} sx={{ p: 0 }}><Box sx={{ borderBottom: '0.5pt solid black', mt: 1 }} /></TableCell>
                          </TableRow>
                        </React.Fragment>
                      ))}
                    </React.Fragment>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </Container>
      )}
    </Box>
  );
};

export default Canvassingcollegewise;