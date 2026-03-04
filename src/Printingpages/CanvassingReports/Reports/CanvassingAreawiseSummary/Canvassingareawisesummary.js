import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from "react-router-dom";
import { 
  Box, Typography, Button, Stack, 
  CircularProgress, Table, TableBody, TableCell, 
  TableContainer, TableHead, TableRow, Paper 
} from "@mui/material";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import PrintIcon from '@mui/icons-material/Print';
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

const Canvassingareawisesummary = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const componentRef = useRef(); 
  
  const [reportData, setReportData] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fallback filters if coming from direct navigation
  const filters = location.state?.filters || { startdate: '2025-04-01', enddate: '2026-03-31' };
  const isPrintMode = location.state?.printMode ?? true;

  useEffect(() => {
    if (isPrintMode) {
      setLoading(true);
      const url = `https://publication.microtechsolutions.net.in/php/get/getCanvassingAreawiseSummary.php?fromdate=${filters.startdate}&todate=${filters.enddate}`;
      
      fetch(url)
        .then((res) => res.json())
        .then((data) => {
          if (Array.isArray(data)) {
            // 2. MASTER FILTER LOGIC
            const filteredData = data.filter((item) => {
              const matches = (filterList, itemValue) => {
                if (!filterList || filterList.length === 0) return true;
                return filterList.includes(itemValue);
              };

              return (
                matches(filters.areas, item.Area) &&
                matches(filters.cities, item.City) &&
                matches(filters.standards, item.Standard) &&
                matches(filters.books, item.BookCode)
                // Add matches() for your other 6 filters here if they exist in the JSON
              );
            });

            // 3. GROUPING
            const grouped = filteredData.reduce((acc, item) => {
              const area = item.Area || "Unknown Area";
              const city = item.City || "Unknown City";
              const key = `${area}-${city}`;
              
              if (!acc[key]) {
                acc[key] = { area, city, details: [] };
              }
              acc[key].details.push(item);
              return acc;
            }, {});
            
            setReportData(Object.values(grouped));
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
    const canvas = await html2canvas(componentRef.current, { scale: 2, useCORS: true });
    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF("p", "mm", "a4");
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
    pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
    pdf.save(`Summary_Report_${filters.startdate}.pdf`);
  };

  if (!isPrintMode) return null;

  return (
    <Box sx={{ width: '100%', minHeight: '100vh', bgcolor: '#525659', p: 2 }}>
      
      {/* Action Bar */}
      <Stack 
        direction="row" 
        spacing={2} 
        sx={{ p: 2, mb: 2, bgcolor: 'white', borderRadius: 1, "@media print": { display: 'none' } }}
      >
        <Button variant="outlined" startIcon={<ArrowBackIcon />} onClick={() => navigate(-1)}>
          Back
        </Button>
        <Button variant="contained" startIcon={<PrintIcon />} onClick={handlePrint}>
          Download PDF
        </Button>
      </Stack>

      {/* Printable Report Area */}
      <Box 
        ref={componentRef} 
        sx={{ 
          p: '10mm', 
          bgcolor: 'white', 
          width: '210mm', 
          margin: 'auto',
          boxShadow: 3 
        }}
      >
        {/* Header */}
        <Box sx={{ mb: 2, textAlign: 'center' }}>
          <Typography variant="h6" sx={{ fontWeight: 'bold', fontFamily: 'serif' }}>Phadke Prakashan, Kolhapur.</Typography>
          <Typography variant="subtitle2" fontWeight="bold">Canvassing Areawise Summary</Typography>
          <Typography variant="caption">From {filters.startdate} to {filters.enddate}</Typography>
        </Box>
        
        {loading ? (
          <Box sx={{ textAlign: 'center', mt: 5 }}><CircularProgress /></Box>
        ) : (
          <TableContainer>
            <Table size="small" sx={{ 
              '& .MuiTableCell-root': { border: 'none', fontFamily: 'serif', fontSize: '11px', padding: '4px' } 
            }}>
              <TableHead>
                <TableRow sx={{ borderTop: '1.5pt solid black', borderBottom: '1.5pt solid black' }}>
                  <TableCell sx={{ fontWeight: 'bold', width: '15%' }}>Book Code</TableCell>
                  <TableCell sx={{ fontWeight: 'bold', width: '50%' }}>Book Name</TableCell>
                  <TableCell sx={{ fontWeight: 'bold', width: '20%' }}>Standard</TableCell>
                  <TableCell align="center" sx={{ fontWeight: 'bold', width: '15%' }}>Copies</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {reportData.map((group, gIdx) => (
                  <React.Fragment key={gIdx}>
                    {/* Area & City Header Row */}
                    <TableRow>
                      <TableCell colSpan={2} sx={{ fontWeight: 'bold', textAlign: 'center', fontSize: '12px', pt: 2 }}>
                        {group.area}
                      </TableCell>
                      <TableCell colSpan={2} sx={{ fontWeight: 'bold', textAlign: 'center', fontSize: '12px', pt: 2 }}>
                        {group.city}
                      </TableCell>
                    </TableRow>

                    {/* Items within this Area */}
                    {group.details.map((row, rIdx) => (
                      <TableRow key={rIdx} sx={{ borderBottom: rIdx === group.details.length - 1 ? '1px solid black' : 'none' }}>
                        <TableCell>{row.BookCode}</TableCell>
                        <TableCell>{row.BookName ||   "---"}</TableCell>
                        <TableCell>{row.Standard}</TableCell>
                        <TableCell align="center">
                           <Box sx={{ borderBottom: '1px solid black', display: 'inline-block', minWidth: '20px' }}>
                            {row.Copies}
                           </Box>
                        </TableCell>
                      </TableRow>
                    ))}
                  </React.Fragment>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}

        {/* Footer */}
        <Box sx={{ mt: 3, pt: 1, borderTop: '1.5pt solid black', display: 'flex', justifyContent: 'space-between' }}>
          <Typography sx={{ fontSize: '10px' }}>
            Total Records: {reportData.reduce((acc, g) => acc + g.details.length, 0)}
          </Typography>
          <Typography sx={{ fontSize: '10px' }}>
            Total Copies: {reportData.reduce((acc, g) => acc + g.details.reduce((sum, d) => sum + d.Copies, 0), 0)}
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default Canvassingareawisesummary;