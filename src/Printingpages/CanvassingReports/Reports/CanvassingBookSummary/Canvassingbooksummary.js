import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from "react-router-dom";
import { 
  Box, Typography, Button, Stack, 
  CircularProgress, Table, TableBody, TableCell, 
  TableContainer, TableHead, TableRow 
} from "@mui/material";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import PrintIcon from '@mui/icons-material/Print';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

const Canvassingbooksummary = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const componentRef = useRef();

  const [reportData, setReportData] = useState([]);
  const [loading, setLoading] = useState(false);

  const filters = location.state?.filters;
  const isPrintMode = location.state?.printMode;

  useEffect(() => {
    if (isPrintMode && filters) {
      setLoading(true);
      
      const start = filters?.startdate || "2025-04-01";
      const end = filters?.enddate || "2026-03-31";
      const url = `https://publication.microtechsolutions.net.in/php/get/getCanvassingBookSummary.php?fromdate=${start}&todate=${end}`;

      fetch(url)
        .then((res) => res.json())
        .then((json) => {
          if (json.success && Array.isArray(json.data)) {
            // TRANSFORMATION LOGIC: Grouping by Standard and Category
            const grouped = json.data.reduce((acc, item) => {
              // Replace 'item.Standard' with actual key if different (e.g., item.Class)
              const std = item.Standard || "B.Com. II"; 
              // Replace 'item.BookGroup' with actual key if different (e.g., item.Category)
              const cat = item.BookGroup || "TEXT"; 

              if (!acc[std]) acc[std] = {};
              if (!acc[std][cat]) acc[std][cat] = [];
              
              acc[std][cat].push(item);
              return acc;
            }, {});

            setReportData(grouped);
          }
          setLoading(false);
        })
        .catch((err) => {
          console.error("Fetch Error:", err);
          setLoading(false);
        });
    }
  }, [isPrintMode, filters]);

  const handlePrint = async () => {
    if (!componentRef.current) return;
    setLoading(true);
    const canvas = await html2canvas(componentRef.current, { scale: 2 });
    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
    pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
    window.open(pdf.output("bloburl"), "_blank");
    setLoading(false);
  };

  if (!isPrintMode) return null;

  return (
    <Box sx={{ width: '100%', minHeight: '100vh', bgcolor: 'white' }}>
      <Stack direction="row" spacing={2} sx={{ p: 2, bgcolor: '#f8f9fa', "@media print": { display: 'none' } }}>
        <Button variant="outlined" startIcon={<ArrowBackIcon />} onClick={() => navigate(-1)}>Back</Button>
        <Button variant="contained" startIcon={<PrintIcon />} onClick={handlePrint}>Print to PDF</Button>
      </Stack>

      <Box ref={componentRef} sx={{ p: 5, bgcolor: 'white' }}>
        <Box sx={{ mb: 3, textAlign: 'center' }}>
          <Typography variant="h6" fontWeight="bold">Phadke Prakashan, Kolhapur.</Typography>
          <Typography variant="subtitle2" fontWeight="bold">Canvassing Book Summary</Typography>
          <Typography variant="caption">
            From {filters?.startdate} to {filters?.enddate}
          </Typography>
        </Box>

        {loading ? (
          <Box sx={{ textAlign: 'center', py: 5 }}><CircularProgress /></Box>
        ) : (
          <TableContainer>
            <Table size="small" sx={{ '& .MuiTableCell-root': { border: 'none', fontFamily: 'serif' } }}>
              <TableHead>
                <TableRow sx={{ borderTop: '2pt solid black', borderBottom: '2pt solid black' }}>
                  <TableCell sx={{ fontWeight: 'bold', width: '20%' }}>Book Code</TableCell>
                  <TableCell sx={{ fontWeight: 'bold', width: '60%' }}>Book Name</TableCell>
                  <TableCell align="right" sx={{ fontWeight: 'bold', width: '20%' }}>Copies</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {Object.keys(reportData).map((std) => (
                  <React.Fragment key={std}>
                    {/* STANDARD HEADER */}
                    <TableRow>
                      <TableCell colSpan={3} align="center" sx={{ fontWeight: 'bold', fontSize: '1.1rem', pt: 2 }}>
                        {std}
                      </TableCell>
                    </TableRow>

                    {Object.keys(reportData[std]).map((cat) => (
                      <React.Fragment key={cat}>
                        {/* CATEGORY SUB-HEADER */}
                        <TableRow>
                          <TableCell />
                          <TableCell sx={{ fontWeight: 'bold', textDecoration: 'underline', fontSize: '0.9rem' }}>
                            {cat}
                          </TableCell>
                          <TableCell />
                        </TableRow>

                        {/* ACTUAL BOOK DATA */}
                        {reportData[std][cat].map((item, i) => (
                          <TableRow key={i}>
                            <TableCell>{item.BookCode}</TableCell>
                            <TableCell>{item["Name of Book"] || "---"}</TableCell>
                            <TableCell align="right">{item.Copies}</TableCell>
                          </TableRow>
                        ))}
                      </React.Fragment>
                    ))}
                  </React.Fragment>
                ))}
                <TableRow sx={{ borderTop: '2pt solid black' }}><TableCell colSpan={3} /></TableRow>
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Box>
    </Box>
  );
};

export default Canvassingbooksummary;