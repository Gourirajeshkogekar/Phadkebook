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

const CanvassorAreawise = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const componentRef = useRef(); 
  
  const [reportData, setReportData] = useState({});
  const [loading, setLoading] = useState(false);

  const filters = location.state?.filters || { startdate: '2025-04-01', enddate: '2026-03-31' };

  useEffect(() => {
    fetchData();
  }, []);

const fetchData = () => {
  setLoading(true);
  const url = `https://publication.microtechsolutions.net.in/php/get/getCanvassingAreawise.php?fromdate=${filters.startdate}&todate=${filters.enddate}`;

  fetch(url)
    .then((res) => res.json())
    .then((data) => {
      if (Array.isArray(data)) {
        const filteredData = data.filter((item) => {
          // Helper function: returns true if filter is empty OR if item matches selection
          const matches = (filterList, itemValue) => {
            if (!filterList || filterList.length === 0) return true;
            return filterList.includes(itemValue);
          };

          // Apply all 10 filters (ensure property names match your API response exactly)
          return (
            matches(filters.areas, item.AreaName) &&
            matches(filters.cities, item.CityName) &&
            matches(filters.publications, item.PublicationName) &&
            matches(filters.colleges, item.CollegeName) &&
            matches(filters.canvassors, item.CanvassorName) &&
            matches(filters.parties, item.PartyName) &&
            matches(filters.standards, item.StandardName) &&
            matches(filters.bookGroups, item.BookGroupName) && // Matches your BookGroup Filter
            matches(filters.books, item.BookCode)
          );
        });

        // 2. GROUPING (Group by Area then College)
        const grouped = filteredData.reduce((acc, item) => {
          const area = item.AreaName || "NO AREA";
          const college = item.CollegeName || "GENERAL COLLEGE";

          if (!acc[area]) acc[area] = {};
          if (!acc[area][college]) acc[area][college] = [];

          acc[area][college].push(item);
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
};

  // const handlePrint = async () => {
  //   const element = componentRef.current;
  //   const canvas = await html2canvas(element, { scale: 2 });
  //   const imgData = canvas.toDataURL("image/png");
  //   const pdf = new jsPDF("p", "mm", "a4");
  //   const pdfWidth = pdf.internal.pageSize.getWidth();
  //   const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
  //   pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
  //   pdf.save(`Canvassing_Report.pdf`);
  // };
  const reportRef = useRef();

  const [printing, setPrinting] = useState(false);

   const handlePrint = async () => {
  
      setPrinting(true);
  
      setTimeout(async () => {
  
        try {
  
          const element = reportRef.current;
  
          const canvas = await html2canvas(element, {
            scale: 2,
            useCORS: true
          });
  
          const imgData = canvas.toDataURL("image/png");
  
          const pdf = new jsPDF("p", "mm", "a4");
  
          pdf.addImage(imgData, "PNG", 0, 0, 210, 297);
  
          window.open(pdf.output("bloburl"), "_blank");
  
        }
        catch (err) {
  
          console.error(err);
  
        }
        finally {
  
          setPrinting(false);
  
        }
  
      }, 500);
  
    };
  

  return (
    <Box sx={{ width: '100%', minHeight: '100vh', bgcolor: '#525659', p: 2 }}>
      <Paper elevation={3} sx={{ p: 2, mb: 2, "@media print": { display: 'none' } }}>
        <Stack direction="row" spacing={2} justifyContent="center">
          <Button variant="outlined" startIcon={<ArrowBackIcon />} onClick={() => navigate(-1)}>
            Back to Filters
          </Button>
          <Button variant="contained" color="primary" startIcon={<PrintIcon />} onClick={handlePrint}>
            Download PDF
          </Button>
        </Stack>
      </Paper>

      <Box ref={componentRef} sx={{ bgcolor: 'white', width: '210mm', minHeight: '297mm', margin: 'auto', p: '15mm' }}>
      <Box sx={{ mb: 3, textAlign: 'center' }}>
  <Typography variant="h5" sx={{ fontWeight: 'bold', fontFamily: 'serif' }}>
    Phadke Prakashan, Kolhapur.
  </Typography>
  <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
    Canvassing Areawise
  </Typography>
  {/* IMPROVED DATE DISPLAY */}
  <Typography variant="body2" sx={{ fontWeight: 'bold', mt: 1 }}>
    Period: {filters.startdate} To {filters.enddate}
  </Typography>
</Box>
        
        {loading ? (
          <Box sx={{ textAlign: 'center', mt: 10 }}><CircularProgress /></Box>
        ) : (
          <TableContainer>
            <Table size="small" sx={{ '& .MuiTableCell-root': { border: 'none', fontFamily: 'serif', fontSize: '11px', py: 0.5 } }}>
              <TableHead>
                <TableRow sx={{ borderTop: '1.5pt solid black', borderBottom: '1.5pt solid black' }}>
                  <TableCell sx={{ fontWeight: 'bold' }}>Book Code</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Book Name</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Professor Name</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Chln. No</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Chln. Dt.</TableCell>
                  <TableCell align="center" sx={{ fontWeight: 'bold' }}>Copies</TableCell>
                  <TableCell align="center" sx={{ fontWeight: 'bold' }}>Feeding Dt.</TableCell>
                  <TableCell align="center" sx={{ fontWeight: 'bold' }}>Entry #</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {Object.entries(reportData).map(([areaName, colleges]) => (
                  <React.Fragment key={areaName}>
                    {/* AREA HEADER */}
                    <TableRow>
                      <TableCell colSpan={8} sx={{ textAlign: 'center', pt: 3 }}>
                        <Typography sx={{ fontWeight: 'bold', fontSize: '14px', textTransform: 'uppercase', letterSpacing: 1 }}>
                          {areaName}
                        </Typography>
                      </TableCell>
                    </TableRow>

                    {Object.entries(colleges).map(([collegeName, items]) => (
                      <React.Fragment key={collegeName}>
                        {/* COLLEGE HEADER */}
                        <TableRow>
                          <TableCell colSpan={8} sx={{ textAlign: 'center', pb: 1 }}>
                            <Typography sx={{ fontWeight: 'bold', fontSize: '12px', textDecoration: 'underline' }}>
                              {collegeName}
                            </Typography>
                          </TableCell>
                        </TableRow>

                     {items.map((row, rIdx) => (
  <TableRow key={rIdx} sx={{ verticalAlign: 'top' }}>
    <TableCell>{row.BookCode}</TableCell>
    <TableCell sx={{ maxWidth: '200px' }}>
      <Typography sx={{ fontSize: '11px', fontWeight: 'bold' }}>
        {row.BookName || "---"}
      </Typography>
    </TableCell>
    <TableCell>{row.ProfessorName}</TableCell>
    <TableCell>{row.ChlnNo}</TableCell>
    
    {/* FIXED: Directly render the string or check for object safely */}
    <TableCell>
      {typeof row.ChlnDt === 'string' ? row.ChlnDt : row.ChlnDt?.date?.split(' ')[0] || ""}
    </TableCell>
    
    <TableCell align="center">
      <Box sx={{ borderBottom: '1px solid black', display: 'inline-block', minWidth: '20px' }}>
        {row.Copies}
      </Box>
    </TableCell>
    
    {/* FIXED: Directly render the string */}
    <TableCell align="center">
      {typeof row.FeedingDt === 'string' ? row.FeedingDt : row.FeedingDt?.date?.split(' ')[0] || ""}
    </TableCell>
    
    <TableCell align="center">{row.Entry}</TableCell>
  </TableRow>
))}
                      </React.Fragment>
                    ))}
                  </React.Fragment>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Box>
    </Box>
  );
};

export default CanvassorAreawise;