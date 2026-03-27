import React, { useRef, useEffect, useState } from 'react';
import { 
  Box, Typography, Button, Stack, Table, TableBody, 
  TableCell, TableContainer, TableHead, TableRow, CircularProgress 
} from "@mui/material";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import PrintIcon from '@mui/icons-material/Print';
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';

const Canvassingsummarycross = () => {
   const [reportData, setReportData] = useState([]);
  const [loading, setLoading] = useState(true);
  const componentRef = useRef();
  const navigate = useNavigate();
  const location = useLocation();
  const filters = location.state?.filters;
    const isPrintMode = location.state?.printMode;

 const [columnNames, setColumnNames] = useState([])

 

 useEffect(() => {
  if (isPrintMode) {
    setLoading(true);
    const joinIds = (arr) => (Array.isArray(arr) ? arr.join(",") : (arr || ""));

    const params = new URLSearchParams({
      fromdate: filters?.period?.startdate || filters?.startdate || "",
      todate: filters?.period?.enddate || filters?.enddate || "",
      areaId: joinIds(filters?.areas),
      cityId: joinIds(filters?.cities),
      collegeId: joinIds(filters?.colleges),
      canvassorId: joinIds(filters?.canvassors),
      accountId: joinIds(filters?.accounts),
      standardId: joinIds(filters?.standards),
      bookId: joinIds(filters?.selectedBooks),
      bookGroupId: joinIds(filters?.bookGroups),
      publicationId: joinIds(filters?.publications)
    });

    const url = `https://publication.microtechsolutions.net.in/php/get/getCanvassingSummaryCross.php?${params.toString()}`;

    fetch(url)
      .then((res) => res.json())
      .then((json) => {
        const rawData = Array.isArray(json) ? json : (json.data || []);
        
        if (rawData.length > 0) {
          // Group by Canvassor to handle RowSpan
          const groupedByCanvassor = rawData.reduce((acc, item) => {
            const name = item.CanvassorName || "NO CANVASSOR";
            if (!acc[name]) acc[name] = [];
            acc[name].push(item);
            return acc;
          }, {});

          // Flatten with markers for the first row of each group
          const finalRows = [];
          Object.keys(groupedByCanvassor).forEach(name => {
            const group = groupedByCanvassor[name];
            group.forEach((item, index) => {
              finalRows.push({
                ...item,
                isFirstInGroup: index === 0,
                groupSize: group.length
              });
            });
          });
          setReportData(finalRows);
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

  // Extract vertical book headers from the first data object
  const columnHeaders = reportData.length > 0 ? reportData[0].columns : [];

const [printing, setPrinting] = useState(false)


 const handlePrint = async () => {
  setPrinting(true);

  try {
    const element = componentRef.current;
    if (!element) return;

    const canvas = await html2canvas(element, {
      scale: 2,
      useCORS: true,
      logging: false,
    });

    




    // ... after html2canvas ...
const imgData = canvas.toDataURL("image/png");
const pdf = new jsPDF("p", "mm", "a4");

 

 
    const pdfWidth = 210;
    const pdfHeight = 297;
    const imgHeight = (canvas.height * pdfWidth) / canvas.width;

    let heightLeft = imgHeight;
    let position = 0;

    const title = "M V Phadke & Co. Kolhapur";
    const subTitle = "Canvassing Summary Cross";
    const dateRange = `From ${filters?.period?.startdate || ""} to ${filters?.period?.enddate || ""}`;

    // 1. Add the first page
    pdf.addImage(imgData, "PNG", 0, position, pdfWidth, imgHeight);
    heightLeft -= pdfHeight;

    // 2. Loop for subsequent pages
    while (heightLeft > 0) {
      position = heightLeft - imgHeight; 
      pdf.addPage();
      
      pdf.addImage(imgData, "PNG", 0, position, pdfWidth, imgHeight);

      // --- STAMP REPEATING HEADER ---
      pdf.setFillColor(255, 255, 255);
      pdf.rect(0, 0, pdfWidth, 38, 'F'); 

      pdf.setFont("helvetica", "bold");
      pdf.setFontSize(11);
      pdf.text(title, pdfWidth / 2, 10, { align: "center" });
      
      pdf.setFontSize(9);
      pdf.text(subTitle, pdfWidth / 2, 15, { align: "center" });
      
      pdf.setFontSize(8);
      pdf.text(dateRange, pdfWidth / 2, 19, { align: "center" });

      // --- DRAW COLUMN HEADERS ---
// pdf.setFont("helvetica", "normal"); // Changing from 'bold' to 'normal'
pdf.setFontSize(6);     
      pdf.setLineWidth(0.3);
      pdf.line(10, 24, 200, 24); 
      
       
      
      pdf.text("Name of the Canvassor", 8, 28);
      pdf.text("Book Name/Title", 15, 28);
      
      pdf.text("Copies", 28, 28, { align: "center" });
      

      pdf.line(10, 30, 200, 30); 

      heightLeft -= pdfHeight;
    }

    window.open(pdf.output("bloburl"), "_blank");
  } catch (error) {
    console.error("PDF Generation Error:", error);
  }

  setPrinting(false);
};


  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 10 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ bgcolor: '#f5f5f5', minHeight: '100vh', p: 4 }}>
      <Stack direction="row" spacing={2} sx={{ mb: 2, "@media print": { display: 'none' } }}>
        <Button variant="outlined" startIcon={<ArrowBackIcon />} onClick={() => navigate(-1)}>
          Back
        </Button>
        <Button variant="contained" startIcon={<PrintIcon />} onClick={handlePrint}>
          Generate PDF
        </Button>
      </Stack>

      <Box ref={componentRef} sx={{ 
        width: '100%', 
        bgcolor: 'white', 
        p: '10mm', 
        mx: 'auto',
        fontFamily: '"Times New Roman", Times, serif'
      }}>
        
        {/* Header matching Phadke Prakashan style */}
        <Box sx={{ textAlign: 'center', mb: 3 }}>
          <Typography sx={{ fontSize: '18px', fontWeight: 'bold' }}>M. V. Phadke & Co. Kolhapur</Typography>
          <Typography sx={{ fontSize: '14px' }}>Canvassing Summary Cross</Typography>
          <Typography sx={{ fontSize: '12px' }}>From {filters?.period?.startdate  }   
            To  {filters?.period?.enddate  } 
</Typography>
        </Box>

        <TableContainer sx={{ boxShadow: 'none' }}>
          <Table sx={{ 
            borderCollapse: 'collapse',
            '& td, & th': { 
              border: '1px solid black', // Strict black borders like client screenshot
              p: '2px 4px', 
              fontSize: '10px',
              color: 'black'
            } 
          }}>
           <TableHead>
  <TableRow sx={{ bgcolor: '#eeeeee' }}>
    <TableCell sx={{ fontWeight: 'bold', width: '50px', textAlign: 'center' }}>Sr.No</TableCell>
    <TableCell sx={{ fontWeight: 'bold', width: '250px' }}>Name of the canvassor</TableCell>
    <TableCell sx={{ fontWeight: 'bold' }}>Book Name / Title</TableCell>
    <TableCell sx={{ fontWeight: 'bold', width: '80px', textAlign: 'center' }}>Copies</TableCell>
  </TableRow>
</TableHead>

            <TableBody>
            {reportData.map((row, idx) => (
    <TableRow key={idx}>
      {/* 1. Serial Number Column */}
      <TableCell align="center">{idx + 1}</TableCell>

      {/* 2. Canvassor Name with RowSpan */}
      {row.isFirstInGroup ? (
        <TableCell 
          rowSpan={row.groupSize} 
          sx={{ fontWeight: 'bold', verticalAlign: 'top', textTransform: 'uppercase' }}
        >
          {row.CanvassorName}
        </TableCell>
      ) : null}

      {/* 3. Horizontal Book Name */}
      <TableCell sx={{ fontSize: '11px' }}>
        {row.BookNameMarathi || row.BookName}
      </TableCell>

      {/* 4. Copies Column */}
      <TableCell align="center" sx={{ fontWeight: 'bold' }}>
        {row.Copies || 0}
      </TableCell>
    </TableRow>
  ))}

            {/* Grand Total Row */}
  <TableRow sx={{ bgcolor: '#f9f9f9' }}>
    <TableCell colSpan={3} align="right" sx={{ fontWeight: 'bold', fontSize: '14px' }}>
      GRAND TOTAL:
    </TableCell>
    <TableCell align="center" sx={{ fontWeight: 'bold', fontSize: '14px', borderDouble: '3px double black' }}>
      {reportData.reduce((sum, row) => sum + (Number(row.Copies) || 0), 0)}
    </TableCell>
  </TableRow>
            </TableBody>
          </Table>
        </TableContainer>

        <Box sx={{ mt: 2, display: 'flex', justifyContent: 'space-between' }}>
          <Typography sx={{ fontSize: '10px' }}>Total Canvassors: {reportData.length}</Typography>
          <Typography sx={{ fontSize: '10px' }}>Printed on: {new Date().toLocaleString()}</Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default Canvassingsummarycross;