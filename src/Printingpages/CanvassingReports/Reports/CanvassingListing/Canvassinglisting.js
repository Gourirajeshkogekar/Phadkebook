import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from "react-router-dom";
import { 
  Box, Typography, Button, Stack, 
  CircularProgress, Table, TableBody, TableCell, 
  TableContainer, TableHead, TableRow 
} from "@mui/material";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import PrintIcon from '@mui/icons-material/Print';
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

const Canvassinglisting = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const componentRef = useRef(); 
  
  const [reportData, setReportData] = useState([]);
  const [loading, setLoading] = useState(false);

  const filters = location.state?.filters;
  const isPrintMode = location.state?.printMode;

  // Since your API returns "03-04-2025" directly, we just return the value
  const formatDate = (dateValue) => {
    if (!dateValue || dateValue === "0000-00-00") return "---";
    return dateValue;
  };

useEffect(() => {
  if (isPrintMode) {
    setLoading(true);

    // Helper: Converts [1, 2, 3] to "1,2,3" for the API
    const joinIds = (arr) => (Array.isArray(arr) ? arr.join(",") : "");

    const params = {
      // Accessing startdate/enddate from the 'period' sub-object in your state
      fromdate: filters?.period?.startdate || "2025-04-01",
      todate: filters?.period?.enddate || "2026-03-31",
      areaId: joinIds(filters?.areas),
      cityId: joinIds(filters?.cities),
      publicationId: joinIds(filters?.publications),
      collegeId: joinIds(filters?.colleges),
      canvassorId: joinIds(filters?.canvassors),
      standardId: joinIds(filters?.standards),
      bookGroupId: joinIds(filters?.bookgroups),
      bookId: joinIds(filters?.books),
    };

    const queryString = new URLSearchParams(params).toString();
    const url = `https://publication.microtechsolutions.net.in/php/get/getCanvassingListing.php?${queryString}`;

    fetch(url)
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          const groupedData = data.reduce((acc, item) => {
            const canvassorName = item.Canvassor || "General";
            if (!acc[canvassorName]) {
              acc[canvassorName] = { party_name: canvassorName, details: [] };
            }
            acc[canvassorName].details.push({
              standard: item.Standard || "",
              book_name: (item.BookName || item.BookNameMarathi ) || "",
              college_name: item["Name of College"] || "",
              professor: item["Name of Professor"] || "",
              date: item.Date,
              challan: item.Chln,
              copies: item.Copies,
              feeding_date: item["Feeding Date"],
              entry: item.Entry,
            });
            return acc;
          }, {});
          setReportData(Object.values(groupedData));
        } else {
          setReportData([]);
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
    const pdf = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
    const imgProps = pdf.getImageProperties(imgData);
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
    pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
    window.open(pdf.output("bloburl"), "_blank");
  };

  const handleBack = () => { navigate(-1); };

  if (!isPrintMode) return null;

  return (
    <Box sx={{ width: '100%', minHeight: '100vh', bgcolor: 'white' }}>
      
      <Stack direction="row" spacing={2} sx={{ p: 2, bgcolor: '#f8f9fa', "@media print": { display: 'none' } }}>
        <Button variant="outlined" startIcon={<ArrowBackIcon />} onClick={handleBack}>Back</Button>
        <Button variant="contained" startIcon={<PrintIcon />} onClick={handlePrint}>Print to PDF</Button>
      </Stack>

      <Box ref={componentRef} sx={{ p: '10mm', bgcolor: 'white' }}>
        <Box sx={{ mb: 2, textAlign: 'center' }}>
          <Typography variant="h6" fontWeight="bold">Phadke Prakashan, Kolhapur.</Typography>
          <Typography variant="subtitle2" fontWeight="bold">Canvassing Listing</Typography>
          <Typography variant="caption" sx={{ display: 'block' }}>
            From {filters?.startdate || "01-04-2025"} to {filters?.enddate || "31-03-2026"}
          </Typography>
        </Box>
        
        {loading ? (
          <Box sx={{ textAlign: 'center', mt: 5 }}><CircularProgress /></Box>
        ) : (
          <TableContainer>
            <Table size="small" sx={{ '& .MuiTableCell-root': { border: 'none', fontFamily: 'serif', fontSize: '11px', padding: '4px 2px' } }}>
              <TableHead>
                <TableRow sx={{ borderTop: '1.5pt solid black', borderBottom: '1.5pt solid black' }}>
                  <TableCell sx={{ fontWeight: 'bold', width: '10%' }}>Standard</TableCell>
                <TableCell sx={{ fontWeight: 'bold', width: '20%' }}>Book Name</TableCell>

                  <TableCell sx={{ fontWeight: 'bold', width: '20%' }}>Name Of College  </TableCell>
                  <TableCell sx={{ fontWeight: 'bold', width: '15%' }}>Name Of Professor</TableCell>
                  <TableCell sx={{ fontWeight: 'bold', width: '10%' }}>Date</TableCell>
                  <TableCell sx={{ fontWeight: 'bold', width: '8%' }}>Chln.</TableCell>
                  <TableCell sx={{ fontWeight: 'bold', textAlign: 'center', width: '7%' }}>Copies</TableCell>
                  <TableCell sx={{ fontWeight: 'bold', textAlign: 'center', width: '10%' }}>Feeding Dt.</TableCell>
                  <TableCell sx={{ fontWeight: 'bold', textAlign: 'center', width: '10%' }}>Entry</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {reportData.map((group, gIdx) => (
                  <React.Fragment key={gIdx}>
                    <TableRow>
                      <TableCell colSpan={7} sx={{ textAlign: 'center', fontWeight: 'bold', pt: 2, pb: 1, fontSize: '12px', borderBottom: '0.5pt solid #eee' }}>
                        {group.party_name.toUpperCase()}
                      </TableCell>
                    </TableRow>

                  {group.details.map((row, rIdx) => (
  <TableRow key={rIdx} sx={{ verticalAlign: 'top' }}>
    
    {/* 1. Standard Column (B.Com II) */}
    <TableCell sx={{ width: '10%', fontWeight: 'bold' }}>
      {row.standard}
    </TableCell>

    {/* 2. Book & College Name (Stacked) */}
    <TableCell sx={{ width:  '20%' }}>
   
        <Typography sx={{ fontSize: '11px', fontWeight: 500 }}>
          {row.book_name}
        </Typography> </TableCell>
        <TableCell sx={{width:'20%'}}>
        <Typography sx={{ fontSize: '10px',    fontWeight:500}}>
          {row.college_name}
        </Typography></TableCell>
    
   

    {/* 3. Professor Name */}
    <TableCell sx={{ width: '15%' }}>
      {row.professor}
    </TableCell>

    {/* 4. Date */}
    <TableCell sx={{ width: '10%' }}>
      {formatDate(row.date)}
    </TableCell>

    {/* 5. Challan */}
    <TableCell sx={{ width: '8%' }}>
      {row.challan}
    </TableCell>

    {/* 6. Copies (With the underline seen in screenshot) */}
    <TableCell align="center" sx={{ width: '7%' }}>
      <Box sx={{ 
        borderBottom: '1px solid black', 
        display: 'inline-block', 
        minWidth: '20px',
        textAlign: 'center' 
      }}>
        {row.copies}
      </Box>
    </TableCell>

    {/* 7. Feeding Date */}
    <TableCell align="center" sx={{ width: '10%' }}>
      {formatDate(row.feeding_date)}
    </TableCell>

    {/* 8. Entry */}
    <TableCell align="center" sx={{ width: '7%' }}>
      {row.entry}
    </TableCell>

  </TableRow>
))}                  </React.Fragment>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}

        <Box sx={{ borderTop: '1.5pt solid black', mt: 2, pt: 1, display: 'flex', justifyContent: 'space-between' }}>
          <Typography sx={{ fontSize: '10px' }}>Total Records: {reportData.reduce((acc, g) => acc + g.details.length, 0)}</Typography>
          <Typography sx={{ fontSize: '10px' }}>Printed on: {new Date().toLocaleString()}</Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default Canvassinglisting;