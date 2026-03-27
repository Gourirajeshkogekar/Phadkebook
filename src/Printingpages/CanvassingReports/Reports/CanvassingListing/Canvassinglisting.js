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


             const joinIds = (arr) => (Array.isArray(arr) ? arr.join(",") : (arr || ""));

 const params = new URLSearchParams({
        fromdate: filters?.period?.startdate || filters?.startdate || "",
        todate: filters?.period?.enddate || filters?.enddate || "",
        // Use the plural keys from state (areas, cities, etc.) joined by commas
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

      const url = `https://publication.microtechsolutions.net.in/php/get/getCanvassingListing.php?${params.toString()}`;

      fetch(url)
        .then((res) => res.json())
       .then((json) => {
  // Check if response is the array you provided or wrapped in a data property
  const rawData = Array.isArray(json) ? json : (json.data || []);

  if (rawData.length > 0) {
    const grouped = rawData.reduce((acc, item) => {
      // Accessing the key with spaces from your JSON
      const collegeName = item["Name of College"] || "UNKNOWN COLLEGE";
      if (!acc[collegeName]) {
        acc[collegeName] = { college: collegeName, details: [] };
      }
      acc[collegeName].details.push(item);
      return acc;
    }, {});
    setReportData(Object.values(grouped));
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

    const title = "Phadke Prakashan, Kolhapur.";
    const subTitle = "Canvassing Listing";
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
      
       
      
      pdf.text("Standard", 8, 28);
      pdf.text("Book Name", 27, 28);
      pdf.text("Name Of College", 64, 28);
      pdf.text("Name Of Professor", 102, 28, );
      pdf.text("Date", 130, 28);
      pdf.text("Chln.", 150, 28);
      pdf.text("Copies", 170, 28, { align: "center" });
      pdf.text("Feeding Dt.", 185, 28, { align: "center" });
            pdf.text("Entry", 199, 28, { align: "center" });


      pdf.line(10, 30, 200, 30); 

      heightLeft -= pdfHeight;
    }

    window.open(pdf.output("bloburl"), "_blank");
  } catch (error) {
    console.error("PDF Generation Error:", error);
  }

  setPrinting(false);
};

const handleBack = () => { navigate(-1); };

  if (!isPrintMode) return null;

  return (
    <Box sx={{ width: '100%', minHeight: '100vh', bgcolor: 'white' }}>
      
      <Stack direction="row" spacing={2} sx={{ p: 2, bgcolor: '#f8f9fa', "@media print": { display: 'none' } }}>
        <Button variant="outlined" startIcon={<ArrowBackIcon />} onClick={handleBack}>Back</Button>
        <Button variant="contained" startIcon={<PrintIcon />} onClick={handlePrint}>Print to PDF</Button>
      </Stack>


      
{/* The Loading Overlay/Message */}
    {printing && (
      <div className="loading-overlay" style={{color:'green', fontWeight:'bold', fontSize:'17px'}}>
        <p>Please wait, your report is being generated. This may take a few seconds...</p>
      </div>
    )}

      <Box ref={componentRef} sx={{ p: '10mm', bgcolor: 'white' }}>
        <Box sx={{ mb: 2, textAlign: 'center' }}>
          <Typography variant="h6" fontWeight="bold">Phadke Prakashan, Kolhapur.</Typography>
          <Typography variant="subtitle2" fontWeight="bold">Canvassing Listing</Typography>
          <Typography variant="caption" sx={{ display: 'block',fontWeight:'bold' }}>
From {filters?.period?.startdate  } 
to {filters?.period?.enddate  }          </Typography>
        </Box>
        
        {loading ? (
          <Box sx={{ textAlign: 'center', mt: 5 }}><CircularProgress /></Box>
        ) : (
          <TableContainer>
            <Table size="small" sx={{ '& .MuiTableCell-root': { border: 'none', fontFamily: 'serif', fontSize: '12px', padding: '4px 2px' } }}>
              <TableHead>
                <TableRow sx={{ borderTop: '1.5pt solid black', borderBottom: '1.5pt solid black' }}>
                  <TableCell sx={{ fontWeight: 'bold', width: '10%' }}>Standard</TableCell>
                <TableCell sx={{ fontWeight: 'bold', width: '20%' }}>Book Name</TableCell>

                  <TableCell sx={{ fontWeight: 'bold', width: '20%' }}>Name Of College  </TableCell>
                  <TableCell sx={{ fontWeight: 'bold', width: '15%', textAlign:'center' }}>Name Of Professor</TableCell>
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
        <TableCell colSpan={9} sx={{ textAlign: 'center', pt: 3, pb: 1 }}>
          <Typography sx={{ borderBottom: '1px solid black', display: 'inline-block', textTransform: 'uppercase', fontWeight: 'bold' }}>
            {group.college}
          </Typography>
        </TableCell>
      </TableRow>

      {group.details.map((row, rIdx) => (
        <TableRow key={rIdx} sx={{ verticalAlign: 'top' }}>
          {/* 1. Standard */}
          <TableCell sx={{ width: '10%', fontWeight: 'bold' }}>{row["Standard"]}</TableCell>
          
          {/* 2. Book Name Logic (Handling the 'N/A' case from your JSON) */}
          <TableCell sx={{ width: '20%' }}>
            {row["BookName"] !== "N/A" ? row["BookName"] : row["BookNameMarathi"]}
          </TableCell>
          
          {/* 3. College Name */}
          <TableCell sx={{ width: '20%' }}>{row["Name of College"]}</TableCell>
          
          {/* 4. Professor Name */}
          <TableCell sx={{ width: '15%' }}>{row["Name of Professor"]}</TableCell>
          
          {/* 5. Date */}
          <TableCell sx={{ width: '10%' }}>{formatDate(row["Date"])}</TableCell>
          
          {/* 6. Chln */}
          <TableCell sx={{ width: '8%' }}>{row["Chln"]}</TableCell>
          
          {/* 7. Copies */}
          <TableCell align="center" sx={{ width: '7%' }}>
            <Box sx={{ borderBottom: '1px solid black', display: 'inline-block', minWidth: '20px' }}>
              {row["Copies"]}
            </Box>
          </TableCell>
          
          {/* 8. Feeding Date */}
          <TableCell align="center" sx={{ width: '10%' }}>{formatDate(row["Feeding Date"])}</TableCell>
          
          {/* 9. Entry */}
          <TableCell align="center" sx={{ width: '7%' }}>{row["Entry"]}</TableCell>
        </TableRow>
      ))}
    </React.Fragment>
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