import React, { useState, useEffect,useRef } from 'react';
import { useLocation, useNavigate ,  } from "react-router-dom";
 
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

  // 1. States for Data and Loading
  const [reportData, setReportData] = useState(null);
  const [loading, setLoading] = useState(true);

  const isPrintMode = location.state?.printMode;
  const filters = location.state?.filters;
  console.log(filters, 'filters date')
  const componentRef = useRef(); // Reference for PDF capture

  useEffect(() => {
    if (isPrintMode && filters) {
      setLoading(true);
      
      // 1. Construct GET URL with fromdate and todate
      const baseUrl = 'https://publication.microtechsolutions.net.in/php/get/getCanvassingGroupwise.php';
      const queryParams = new URLSearchParams({
        fromdate: filters.startdate, // Mapping your filter to API param
        todate: filters.enddate      // Mapping your filter to API param
      }).toString();

      fetch(`${baseUrl}?${queryParams}`)
        .then((res) => res.json())
        .then((json) => {
          // 2. Set the whole response object (contains success, count, and data)
          setReportData(json);
          setLoading(false);
        })
        .catch((err) => {
          console.error("Fetch Error:", err);
          setLoading(false);
        });
    }
  }, [isPrintMode, filters]);

  if (!isPrintMode) return null;

const handlePrint = async () => {
  if (!componentRef.current) {
    console.error("Reference to report content not found.");
    return;
  }

  try {
    setLoading(true); // Show loader while processing canvas
    const canvas = await html2canvas(componentRef.current, {
      scale: 2,
      useCORS: true,
      logging: false, // Set to true if you need to debug canvas issues
    });

    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a4",
    });

    const pdfWidth = pdf.internal.pageSize.getWidth();
    const imgProps = pdf.getImageProperties(imgData);
    const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

    pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
    
    // Create the blob and open it
    const blobURL = pdf.output("bloburl");
    window.open(blobURL, "_blank");
    setLoading(false);
  } catch (error) {
    console.error("PDF Generation Error:", error);
    setLoading(false);
  }
};

  const handleBack = () => { navigate(location.pathname, { state: null }); };

  return (
    <Box sx={{ width: '100%', minHeight: '100vh', bgcolor: 'white' }}>
      
      {/* ACTION BUTTONS (Hidden on Paper) */}
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

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
          <CircularProgress />
          <Typography sx={{ ml: 2 }}>Generating Report...</Typography>
        </Box>
      ) : (
        <Container maxWidth="md" sx={{ py: 4, fontFamily: 'serif' }} ref={componentRef}>
          
          {/* Header Section */}
          <Box sx={{ textAlign: 'center', mb: 3 }}>
            <Typography variant="h5" fontWeight="bold">
              {reportData?.publisher || "Phadke Prakashan, Kolhapur."}
            </Typography>
            <Typography variant="h6" sx={{ textDecoration: 'underline', fontWeight: 'bold', mt: 1 }}>
              {reportData?.reportTitle || "Canvassing Groupwise"}
            </Typography>
            <Typography variant="body1">
Period: From {filters?.startdate || "---"} to {filters?.enddate || "---"}            </Typography>
          </Box>

          {/* Table Column Headers */}
          <Box sx={{ 
            display: 'flex', justifyContent: 'space-between', 
            borderTop: '2px solid black', borderBottom: '2px solid black', 
            py: 0.5, fontWeight: 'bold', mt: 2 
          }}>
            <Typography sx={{ width: '15%', fontWeight: 'bold' }}>Book Code</Typography>
            <Typography sx={{ width: '70%', fontWeight: 'bold' }}>Name of Book</Typography>
            <Typography sx={{ width: '15%', textAlign: 'right', fontWeight: 'bold' }}>Copies</Typography>
          </Box>

         {/* Data Mapping (Loops through reportData.data) */}
          {reportData?.data?.map((item, index) => (
            <Box key={index} sx={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              py: 0.5, 
              borderBottom: '0.5px solid #eee' 
            }}>
              <Typography sx={{ width: '15%', fontSize: '0.9rem' }}>
                {item.BookCode}
              </Typography>
              <Typography sx={{ width: '70%', fontSize: '0.9rem', pr: 2 }}>
                {item["Name of Book"] || "N/A"}
              </Typography>
              <Typography sx={{ width: '15%', textAlign: 'right', fontSize: '0.9rem' }}>
                {item.Copies}
              </Typography>
            </Box>
          ))}

          {/* Footer Border */}
          <Divider sx={{ borderBottomWidth: 2, borderColor: 'black', mt: 4 }} />
          <Typography variant="caption" sx={{ display: 'block', textAlign: 'right', mt: 1 }}>
            Generated on: {new Date().toLocaleString()}
          </Typography>
          
        </Container>
      )}
    </Box>
  );
};

export default Canvassinggroupwise;