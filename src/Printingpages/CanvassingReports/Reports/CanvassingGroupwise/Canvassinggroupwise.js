import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from "react-router-dom";
import { 
  Box, Typography, Divider, Button, Stack, 
  Container, CircularProgress 
} from "@mui/material";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import PrintIcon from '@mui/icons-material/Print';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

const Canvassinggroupwise = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const [reportData, setReportData] = useState(null);
  const [loading, setLoading] = useState(true);

  const isPrintMode = location.state?.printMode;
  const filters = location.state?.filters;
  const componentRef = useRef();
  const [printing, setPrinting] = useState(false)
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



      const queryString = new URLSearchParams(params).toString();
      const url = `https://publication.microtechsolutions.net.in/php/get/getCanvassingGroupwise.php?${queryString}`;

      fetch(url)
        .then((res) => res.json())
        .then((json) => {
          if (json.success && Array.isArray(json.data)) {
            // --- GROUPING LOGIC TO MATCH SCREENSHOT ---
            const grouped = json.data.reduce((acc, item) => {
              const canvassor = item.CanvassorName  ;
              const group = item.BookGroup  ;
              const standard = item.StandardName  ; // Ensure your API returns this

              if (!acc[canvassor]) acc[canvassor] = {};
              if (!acc[canvassor][group]) acc[canvassor][group] = {};
              if (!acc[canvassor][group][standard]) acc[canvassor][group][standard] = [];
              
              acc[canvassor][group][standard].push(item);
              return acc;
            }, {});

            setReportData({ ...json, groupedData: grouped });
          } else {
            setReportData({ data: [], groupedData: {} });
          }
          setLoading(false);
        })
        .catch((err) => {
          console.error("Fetch Error:", err);
          setLoading(false);
        });
    }
  }, [isPrintMode, filters]);

  if (!isPrintMode) return null;



  

  // const handlePrint = async () => {
  //   setPrinting(true);
  
  //   try {
  //     const element = componentRef.current;
  //     if (!element) return;
  
  //     // 1. Capture the canvas
  //     const canvas = await html2canvas(element, {
  //       scale: 2, // Keeps quality high
  //       useCORS: true,
  //       logging: false,
  //     });
  
  //     const imgData = canvas.toDataURL("image/png");
  //     const pdf = new jsPDF("p", "mm", "a4");
  
  //     const pdfWidth = 210;
  //     const pdfHeight = 297;
  //     // Calculate how high the image should be to maintain aspect ratio
  //     const imgHeight = (canvas.height * pdfWidth) / canvas.width;
  
  //     let heightLeft = imgHeight;
  //     let position = 0;
  
  //     // 2. Add the first page
  //     pdf.addImage(imgData, "PNG", 0, position, pdfWidth, imgHeight);
  //     heightLeft -= pdfHeight;
  
  //     // 3. Loop through remaining height and add new pages
  //     while (heightLeft > 0) {
  //       position = heightLeft - imgHeight; // This slides the image up
  //       pdf.addPage();
  //       pdf.addImage(imgData, "PNG", 0, position, pdfWidth, imgHeight);
  //       heightLeft -= pdfHeight;
  //     }
  
  //     // REMOVED: The extra pdf.addImage call that was causing the "contraction"
      
  //     window.open(pdf.output("bloburl"), "_blank");
  //   } catch (error) {
  //     console.error("PDF Generation Error:", error);
  //   }
  
  //   setPrinting(false);
  // };


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

    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF("p", "mm", "a4");

    const pdfWidth = 210;
    const pdfHeight = 297;
    const imgHeight = (canvas.height * pdfWidth) / canvas.width;

    let heightLeft = imgHeight;
    let position = 0;

    const title = "Phadke Prakashan, Kolhapur.";
    const subTitle = "Canvassing Group Wise Report";
    const dateRange = `Period: From ${filters?.period?.startdate || ""} to ${filters?.period?.enddate || ""}`;

    // 1. Add the first page
    pdf.addImage(imgData, "PNG", 0, position, pdfWidth, imgHeight);
    heightLeft -= pdfHeight;

    // 2. Loop for subsequent pages
    while (heightLeft > 0) {
      position = heightLeft - imgHeight; 
      pdf.addPage();
      
      pdf.addImage(imgData, "PNG", 0, position, pdfWidth, imgHeight);

      // --- STAMP REPEATING HEADER (White Background Box) ---
      pdf.setFillColor(255, 255, 255);
      pdf.rect(0, 0, pdfWidth, 40, 'F'); 

      // Main Titles
      pdf.setFont("helvetica", "bold");
      pdf.setFontSize(11);
      pdf.text(title, pdfWidth / 2, 10, { align: "center" });
      
      pdf.setFontSize(9);
      pdf.text(subTitle, pdfWidth / 2, 16, { align: "center" });
      
      pdf.setFontSize(8);
      pdf.text(dateRange, pdfWidth / 2, 21, { align: "center" });

      // --- DRAW COLUMN HEADERS ---
      pdf.setFontSize(8.5); // Matches your 14px screen font better in PDF scale
      pdf.setLineWidth(0.4);
      
      // Top line of header
      pdf.line(10, 26, 200, 26); 
      
      // Column Labels (Adjusted for Bookwise Report)
      // Standard margins: Left 10mm, Right 200mm
      pdf.text("Book Code", 12, 31);
      pdf.text("Book Name", 42, 31);
      pdf.text("Total Copies", 198, 31, { align: "right" });

      // Bottom line of header
      pdf.line(10, 34, 200, 34); 

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
      <Stack direction="row" spacing={2} sx={{ p: 2, bgcolor: '#f8f9fa', "@media print": { display: 'none' } }}>
        <Button variant="outlined" startIcon={<ArrowBackIcon />} onClick={handleBack}>Back to Filters</Button>
        <Button variant="contained" startIcon={<PrintIcon />} onClick={handlePrint} disabled={loading}>Print / Save PDF</Button>
      </Stack>


      {/* The Loading Overlay/Message */}
    {printing && (
      <div className="loading-overlay" style={{color:'green', fontWeight:'bold', fontSize:'17px'}}>
        <p>Please wait, your report is being generated. This may take a few seconds...</p>
      </div>
    )}

    

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
          <CircularProgress /><Typography sx={{ ml: 2 }}>Generating Report...</Typography>
        </Box>
      ) : (
        <Container maxWidth="md" sx={{ py: 4, fontFamily: 'serif' }} ref={componentRef}>
          {/* Header Section */}
          <Box sx={{ textAlign: 'center', mb: 1 }}>
            <Typography variant="h6" fontWeight="bold">{reportData?.publisher || "Phadke Prakashan, Kolhapur."}</Typography>
            <Typography variant="body2" sx={{ fontWeight: 'bold' }}>Canvassing Groupwise</Typography>
            <Typography variant="caption" sx={{ display: 'block' }}>
              From {filters?.period?.startdate || filters?.startdate} to {filters?.period?.enddate || filters?.enddate}
            </Typography>
          </Box>

        {/* Table Headers */}
<Box sx={{ 
  display: 'flex', 
  justifyContent: 'space-between', // Ensures space is distributed
  borderTop: '1px solid black', 
  borderBottom: '1px solid black', 
  py: 0.3, 
  mt: 1 
}}>
  <Typography sx={{ width: '15%', fontWeight: 'bold', fontSize: '0.8rem' }}>
    Book Code
  </Typography>
  <Typography sx={{ width: '70%', fontWeight: 'bold', fontSize: '0.8rem' }}>
    Name of Book
  </Typography>
  <Typography sx={{ width: '15%', textAlign: 'right', fontWeight: 'bold', fontSize: '0.8rem' }}>
    Copies
  </Typography>
</Box>

         {/* Grouped Data Rendering */}
{Object.entries(reportData?.groupedData || {}).map(([canvassor, groups]) => (
  <Box 
    key={canvassor} 
    sx={{ 
      mt: 1, 
      pageBreakInside: 'avoid', // Prevents splitting a canvassor across pages
      breakInside: 'avoid' 
    }}
  >
    {/* Canvassor Name */}
    <Typography sx={{ fontSize: '0.85rem', fontWeight: 'bold', textTransform: 'uppercase', borderBottom: '1px solid #ccc' }}>
      {canvassor}
    </Typography>

    {Object.entries(groups).map(([groupName, standards]) => (
      <Box key={groupName} sx={{ pl: 1 }}>
        <Typography sx={{ fontSize: '0.75rem', fontWeight: 'bold', textAlign: 'center', bgcolor: '#f0f0f0', my: 0.5 }}>
          {groupName}
        </Typography>

        {Object.entries(standards).map(([std, books]) => (
          <Box key={std} sx={{ mb: 1 }}>
<Typography sx={{ fontSize: '0.75rem', fontWeight: 'bold', color: 'black' }}>              {std}
            </Typography>

            {books.map((book, bIdx) => (
              <Box key={bIdx} sx={{ display: 'flex', borderBottom: '0.1px solid #eee', py: 0.2 }}>
                <Typography sx={{ width: '15%', fontSize: '0.7rem' }}>{book.BookCode}</Typography>
                <Typography sx={{ width: '70%', fontSize: '0.7rem' }}>
                  {/* Priority to Marathi Name if available */}
                  {book.BookNameMarathi || book["Name of Book"]}
                </Typography>
                <Typography sx={{ width: '15%', textAlign: 'right', fontSize: '0.7rem', fontWeight: 'bold' }}>
                  {book.Copies}
                </Typography>
              </Box>
            ))}
          </Box>
        ))}
      </Box>
    ))}
  </Box>
))}
             
          

          <Typography variant="caption" sx={{ display: 'block', textAlign: 'right', mt: 1 }}>
            Generated on: {new Date().toLocaleString()}
          </Typography>
        </Container>
      )}
    </Box>
  );
};

export default Canvassinggroupwise;