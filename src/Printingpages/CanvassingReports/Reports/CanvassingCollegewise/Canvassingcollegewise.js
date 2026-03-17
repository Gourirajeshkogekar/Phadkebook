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

      const url = `https://publication.microtechsolutions.net.in/php/get/getCanvassingCollegewise.php?${params.toString()}`;

      fetch(url)
        .then((res) => res.json())
        .then((json) => {
          if (json.success && Array.isArray(json.data)) {
            const grouped = json.data.reduce((acc, item) => {
              const college = item.CollegeName || "UNKNOWN COLLEGE";
              const std = item.Standard || "N/A";

              if (!acc[college]) acc[college] = {};
              if (!acc[college][std]) acc[college][std] = [];
              
              acc[college][std].push(item);
              return acc;
            }, {});
            
            setReportData(grouped);
          } else {
            setReportData({});
          }
          setLoading(false);
        })
        .catch((err) => {
          console.error("Fetch error:", err);
          setLoading(false);

        });

                  console.log("Generated URL:", url); // Copy/Paste this into a new tab to test the API directly

    }
  }, [isPrintMode, filters]);

 


const [printing, setPrinting] = useState(false)
//   const handlePrint = async () => {
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
    const subTitle = "Canvassing Collegewise";
    const dateRange = `Period: From ${filters?.period?.startdate || filters?.startdate || ""} to ${filters?.period?.enddate || filters?.enddate || ""}`;

    // 1. Add the first page
    pdf.addImage(imgData, "PNG", 0, position, pdfWidth, imgHeight);
    heightLeft -= pdfHeight;

    // 2. Loop for subsequent pages
    while (heightLeft > 0) {
      position = heightLeft - imgHeight; 
      pdf.addPage();
      pdf.addImage(imgData, "PNG", 0, position, pdfWidth, imgHeight);

      // --- STAMP REPEATING HEADER (White Box) ---
      pdf.setFillColor(255, 255, 255);
      pdf.rect(0, 0, pdfWidth, 40, 'F'); 

      pdf.setFont("helvetica", "bold");
      pdf.setFontSize(11);
      pdf.text(title, pdfWidth / 2, 10, { align: "center" });
      
      pdf.setFontSize(9);
      pdf.text(subTitle, pdfWidth / 2, 16, { align: "center" });
      
      pdf.setFontSize(8);
      pdf.text(dateRange, pdfWidth / 2, 21, { align: "center" });

      // --- DRAW COLUMN HEADERS ---
      pdf.setFontSize(7.5); // Slightly smaller to accommodate many columns
      pdf.setLineWidth(0.3);
      pdf.line(10, 26, 200, 26); 
      
      // Coordinates based on your MUI widths (converted proportionally to mm)
      pdf.text("Book Code", 7, 31);
      pdf.text("Book Name", 27, 31);
      pdf.text("Professor Name", 72, 31);
      pdf.text("Chln No", 115, 31);
      pdf.text("Chln Dt", 135, 31);
      pdf.text("Copies", 160, 31, { align: "center" });
      pdf.text("Feeding Dt", 175, 31);
      pdf.text("Entry", 205, 31, { align: "right" });

      pdf.line(10, 34, 200, 34); 

      heightLeft -= pdfHeight;
    }

    window.open(pdf.output("bloburl"), "_blank");
  } catch (error) {
    console.error("PDF Generation Error:", error);
  }

  setPrinting(false);
};


  if (!isPrintMode) return null;

  return (
    <Box sx={{ bgcolor: '#f5f5f5', minHeight: '100vh' }}>
      <Stack direction="row" spacing={2} sx={{ p: 2, bgcolor: 'white', "@media print": { display: 'none' } }}>
        <Button variant="outlined" startIcon={<ArrowBackIcon />} onClick={() => navigate(-1)}>Back</Button>
        <Button variant="contained" startIcon={<PrintIcon />} onClick={handlePrint} disabled={loading || Object.keys(reportData).length === 0}>
          Print PDF
        </Button>
      </Stack>



{/* The Loading Overlay/Message */}
    {printing && (
      <div className="loading-overlay" style={{color:'green', fontWeight:'bold', fontSize:'17px'}}>
        <p>Please wait, your report is being generated. This may take a few seconds...</p>
      </div>
    )}


      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 10 }}><CircularProgress /></Box>
      ) : Object.keys(reportData).length === 0 ? (
        <Box sx={{ textAlign: 'center', mt: 10 }}><Typography>No records found for the selected filters.</Typography></Box>
      ) : (
        <Container maxWidth="lg" sx={{ py: 3 }}>
         <Paper
  ref={componentRef}
  elevation={0}
  sx={{
    width: "794px",
    minHeight: "1123px",
    margin: "0 auto",
      padding: "20px 15px 40px 15px",
     background: "white",
    fontFamily: "serif"
  }}
>
            
            <Box sx={{ textAlign: 'center', mb: 3 }}>
              <Typography variant="h6" fontWeight="bold">Phadke Prakashan, Kolhapur.</Typography>
              <Typography variant="subtitle2" fontWeight="bold">Canvassing Collegewise</Typography>
              <Typography variant="caption" sx={{ fontWeight: 'bold' }}>
                Period: From {filters?.period?.startdate || filters?.startdate} to {filters?.period?.enddate || filters?.enddate}
              </Typography>
            </Box>

<TableContainer sx={{ overflowX: "hidden" }}><Table
  size="small"
  sx={{
    width: "100%",
    tableLayout: "fixed",
  "& .MuiTableCell-root": {
  borderBottom: "none",
  py: 0.5,
  fontFamily: "serif",
  fontSize: "11px",
whiteSpace: "normal",  overflow: "hidden",
  textOverflow: "ellipsis"
}
    
  }}
>             

 <TableHead>
  <TableRow sx={{ borderTop: '1.5pt solid black', borderBottom: '1.5pt solid black' }}>

    <TableCell sx={{ fontWeight: 'bold', width: '40px' }}>
      Book Code
    </TableCell>

    <TableCell sx={{ fontWeight: 'bold', width: '150px' }}>
      Book Name
    </TableCell>

    <TableCell sx={{ fontWeight: 'bold', width: '130px' }}>
      Professor Name
    </TableCell>

    <TableCell sx={{ fontWeight: 'bold', width: '40px' }}>
      Chln No
    </TableCell>

    <TableCell sx={{ fontWeight: 'bold', width: '60px' }}>
      Chln Dt
    </TableCell>

    <TableCell sx={{ fontWeight: 'bold', width: '35px', textAlign:'center' }}>
      Copies
    </TableCell>

    <TableCell sx={{ fontWeight: 'bold', width: '60px' }}>
      Feeding Dt
    </TableCell>

    <TableCell sx={{ fontWeight: 'bold', width: '25px', textAlign:'right' }}>
      Entry
    </TableCell>

  </TableRow>
</TableHead>
                <TableBody>
                  {Object.entries(reportData).map(([college, standards]) => (
                    <React.Fragment key={college}>
                      <TableRow>
                        <TableCell colSpan={8} align="center" sx={{ pt: 3, pb: 0 }}>
                          <Typography sx={{ fontWeight: 'bold', fontSize: '13px', textTransform: 'uppercase', borderBottom: '1px solid black', display: 'inline-block' }}>
                            {college}
                          </Typography>
                        </TableCell>
                      </TableRow>

                      {Object.entries(standards).map(([std, items]) => (
                        <React.Fragment key={std}>
                          <TableRow>
                            <TableCell colSpan={8} align="center" sx={{ pb: 1 }}>
                              <Typography sx={{ fontWeight: 'bold', fontSize: '11px', mt: 1 }}>{std}</Typography>
                            </TableCell>
                          </TableRow>

                          {items.map((item, i) => (
                            <TableRow key={i}>
                              <TableCell>{item.BookCode}</TableCell>
                              <TableCell sx={{ maxWidth: '180px' }}>
                                {item.BookName !== "N/A" ? item.BookName : item.BookNameMarathi}
                              </TableCell>
                              <TableCell>{item["Professor Name"]}</TableCell> 
                              <TableCell>{item.ChlnNo}</TableCell>
                              <TableCell>{item["Chln Dt."]}</TableCell>
                             <TableCell align="center">
  <Box sx={{ borderBottom: '1px solid black', minWidth: '20px', display: 'inline-block' }}>
    {item.Copies || "____"}
  </Box>
</TableCell>
                              <TableCell>{item["Feeding Dt."]}</TableCell>
                              <TableCell align="right">{item.Entry}</TableCell>
                            </TableRow>
                          ))}
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