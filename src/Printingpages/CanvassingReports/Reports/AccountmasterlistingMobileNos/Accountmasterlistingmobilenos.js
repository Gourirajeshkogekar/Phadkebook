import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from "react-router-dom";
import { 
  Box, Typography, Button, Stack, Container, 
  Table, TableBody, TableCell, TableHead, TableRow, 
  TableContainer, CircularProgress 
} from "@mui/material";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import PrintIcon from '@mui/icons-material/Print';
import jsPDF from 'jspdf';

import html2canvas from 'html2canvas';


const Accountmasterlistingmobilenos = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // 1. Component States
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const isPrintMode = location.state?.printMode;
  const filters = location.state?.filters;
  const componentRef = useRef(); 


  const [printing, setPrinting] = useState(false)

  useEffect(() => {
  if (isPrintMode) {
    setLoading(true);

    // Helper to join array IDs
    const joinIds = (arr) => (Array.isArray(arr) ? arr.join(",") : (arr || ""));

    // Construct URL Parameters for GET request
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

    const url = `https://publication.microtechsolutions.net.in/php/get/getCanvassingAccountMasterListing.php?${params.toString()}`;

    fetch(url) // Default is GET
      .then((res) => res.json())
      .then((json) => {
        // Map the specific 'data' array from your response
        if (json.success && Array.isArray(json.data)) {
          setData(json.data);
        } else {
          setData([]);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error("API Error:", err);
        setLoading(false);
        setData([]);
      });
  }
}, [isPrintMode, filters]);

  // 3. Prevent rendering if not in print mode
  if (!isPrintMode) return null;


   

 
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
    const subTitle = "Account Master Listing- Mobile Numbers";
    const subTitle1 = "Bank Deposits";

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
      pdf.text(subTitle1, pdfWidth / 2, 19, { align: "center" });

      // --- DRAW COLUMN HEADERS ---
// pdf.setFont("helvetica", "normal"); // Changing from 'bold' to 'normal'
pdf.setFontSize(6);     
      pdf.setLineWidth(0.3);
      pdf.line(10, 24, 200, 24); 
      
      // /**
      //  * CALCULATION LOGIC (Starting from 10mm left padding):
      //  * Standard: 10% (~19mm) -> Starts @ 11
      //  * Book Name: 20% (~38mm) -> Starts @ 30
      //  * College: 20% (~38mm) -> Starts @ 68
      //  * Professor: 15% (~28mm) -> Starts @ 106
      //  * Date: 10% (~19mm) -> Starts @ 135
      //  * Chln: 8% (~15mm) -> Starts @ 154
      //  * Copies: 7% (~13mm) -> Starts @ 172 (Center @ 178)
      //  * Feeding: 10% (~19mm) -> Starts @ 185 (Center @ 194)
      //  */
      
      pdf.text("Account/Party Name", 8, 28);
      pdf.text("Telephone No", 27, 28);
      pdf.text("Mobile No", 64, 28);
      


      pdf.line(10, 30, 200, 30); 

      heightLeft -= pdfHeight;
    }

    window.open(pdf.output("bloburl"), "_blank");
  } catch (error) {
    console.error("PDF Generation Error:", error);
  }

  setPrinting(false);
};


const handleBack = () => { navigate(location.pathname, { state: null }); };

  return (
    <Box sx={{ width: '100%', minHeight: '100vh', bgcolor: 'white' }}>
      
      {/* ACTION BAR */}
      <Stack 
        direction="row" 
        spacing={2} 
        sx={{ 
          p: 2, bgcolor: '#f8f9fa', borderBottom: '1px solid #eee',
          "@media print": { display: 'none' } 
        }}
      >
        <Button variant="outlined" startIcon={<ArrowBackIcon />} onClick={handleBack}>
          Back to Filters
        </Button>
        <Button 
          variant="contained" 
          startIcon={<PrintIcon />} 
          onClick={handlePrint}
          disabled={loading}
        >
          Print / Save PDF
        </Button>
      </Stack>
{/* The Loading Overlay/Message */}
    {printing && (
      <div className="loading-overlay" style={{color:'green', fontWeight:'bold', fontSize:'17px'}}>
        <p>Please wait, your report is being generated. This may take a few seconds...</p>
      </div>
    )}

      {/* REPORT PAGE */}
<Container 
  maxWidth="lg" 
  ref={componentRef} // <--- ADD THIS LINE
  sx={{ py: 3, fontFamily: 'serif', bgcolor: 'white' }} // Ensure white background for canvas
>        


        
        {/* Header */}
        <Box sx={{ textAlign: 'center', mb: 2 }}>
          <Typography variant="h6" fontWeight="bold">Phadke Prakashan, Kolhapur.</Typography>
          <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>
            Account Master Listing : Mobile Numbers
          </Typography>

               <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>
Bank Deposits          </Typography>
        </Box>

        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 10 }}>
            <CircularProgress />
          </Box>
        ) : (
          <TableContainer>
            <Table size="small" sx={{ 
              '& .MuiTableCell-root': { 
                borderBottom: '1px solid black', 
                fontFamily: 'serif',
                fontSize: '0.85rem',
                padding: '4px 8px'
              } 
            }}>
              <TableHead>
                <TableRow sx={{ borderTop: '2px solid black', borderBottom: '2px solid black' }}>
                  <TableCell sx={{ fontWeight: 'bold' }}>ACCOUNT/PARTY NAME</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>TELEPHONE NO.</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>MOBILE NO.</TableCell>
                </TableRow>
              </TableHead>
             <TableBody>
  {data.map((row, index) => (
    <TableRow key={index}>
      {/* Note the bracket notation for keys with spaces */}
      <TableCell>{row["Account Party Name"]}</TableCell>
      <TableCell>{row["Telephone No"]}</TableCell>
      <TableCell>{row["Mobile No"]}</TableCell>
    </TableRow>
  ))}
</TableBody>
            </Table>
          </TableContainer>
        )}
      </Container>
    </Box>
  );
};

export default Accountmasterlistingmobilenos;