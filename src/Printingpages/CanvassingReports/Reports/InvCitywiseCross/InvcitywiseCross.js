import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from "react-router-dom";
import { 
  Box, Typography, Button, Stack, CircularProgress, 
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper
} from "@mui/material";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import PrintIcon from '@mui/icons-material/Print';
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

const InvcitywiseCross = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const componentRef = useRef();

  const [reportData, setReportData] = useState([]);
  const [bookColumns, setBookColumns] = useState([]);
  const [loading, setLoading] = useState(false);

  const filters = location.state?.filters;
  const isPrintMode = location.state?.printMode;
const [printing, setPrinting] = useState(false)

  const getRowSpans = (data, key) => {
    let spans = [];
    let currentSpanIndex = 0;
    for (let i = 0; i < data.length; i++) {
      if (i > 0 && data[i][key] === data[i - 1][key]) {
        spans[i] = 0;
        spans[currentSpanIndex]++;
      } else {
        spans[i] = 1;
        currentSpanIndex = i;
      }
    }
    return spans;
  };

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

    fetch(`https://publication.microtechsolutions.net.in/php/get/getInvCitywiseCross.php?${params.toString()}`)
      .then((res) => res.json())
      .then((resJson) => {
        // CHANGE HERE: Access resJson.data because your API returns an object
        const actualData = resJson.data; 

        if (Array.isArray(actualData)) {
          // 1. Extract unique book names for columns
          const uniqueBooks = [...new Set(actualData
            .map(item => item.BookName)
            .filter(name => name && name.trim() !== ""))]
            .sort(); 
          setBookColumns(uniqueBooks);

          // 2. Group data by Invoice Number to create the cross-tab
          const grouped = actualData.reduce((acc, item) => {
            const invKey = item.InvoiceNo;
            if (!acc[invKey]) {
              acc[invKey] = {
                city: item.City || "N/A",
                canvassor: item.Canvassor || "-",
                date: item.Date,
                inv_no: item.InvoiceNo,
                rr_no: item.RRNo || "-",
                transport: item.Transport || "-",
                books: {} 
              };
            }
            if (item.BookName && item.BookName.trim() !== "") {
              // Sum copies if the same book appears twice in one invoice
              acc[invKey].books[item.BookName] = (acc[invKey].books[item.BookName] || 0) + (parseInt(item.Copies) || 0);
            }
            return acc;
          }, {});

          setReportData(Object.values(grouped));
        } else {
          console.error("Data received is not an array:", resJson);
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

  const citySpans = getRowSpans(reportData, 'city');
  const canvassorSpans = getRowSpans(reportData, 'canvassor');



 
// const handlePrint = async () => {
//   setPrinting(true);
//   try {
//     const element = componentRef.current;
//     // Scale 3 ensures the Marathi text stays sharp
//     const canvas = await html2canvas(element, { 
//       scale: 3, 
//       useCORS: true,
//       logging: false 
//     });
    
//     const imgData = canvas.toDataURL("image/png");
//     const pdf = new jsPDF("l", "mm", "a4"); // Landscape
    
//     const pageWidth = 297;
//     const pageHeight = 210;
//     const margin = 7;
//     const headerHeight = 55; // Space reserved for header on each page
    
//     const imgProps = pdf.getImageProperties(imgData);
//     const pdfImgWidth = pageWidth - (margin * 2);
//     const pdfImgHeight = (imgProps.height * pdfImgWidth) / imgProps.width;

//     // Helper to draw the header on every page
//     const drawHeader = (pageNum) => {
//       pdf.setFillColor(255, 255, 255);
//       pdf.rect(0, 0, pageWidth, headerHeight, 'F'); // Clear header area
      
//       pdf.setFont("helvetica", "bold");
//       pdf.setFontSize(14);
//       pdf.text("M. V. Phadke & Co. Kolhapur", margin, 12);
      
//       pdf.setFontSize(10);
//       pdf.text("Inv. Citywise Cross", margin, 18);
//       pdf.text(`From ${filters?.startdate || ""} to ${filters?.enddate || ""}`, margin, 23);

//       // Re-draw Column Labels
//       pdf.setFontSize(6);
//       pdf.text("  City                Canvassor Name        Date          Inv.# R.R.# Transport", margin + 2, 50);
      
//       // Horizontal Line below header
//       pdf.setLineWidth(0.2);
//       pdf.line(margin, 52, pageWidth - margin, 52);
//     };

//     let heightLeft = pdfImgHeight;
//     let position = 0; // Vertical offset of the image

//     // PAGE 1
//     // We add the image starting at 0 because your componentRef 
//     // already includes its own header for the first page.
//     pdf.addImage(imgData, 'PNG', margin, 0, pdfImgWidth, pdfImgHeight);
//     heightLeft -= (pageHeight); 

//     // SUBSEQUENT PAGES
//     while (heightLeft > 0) {
//       pdf.addPage();
      
//       // Position is calculated to "slide" the image up. 
//       // We add headerHeight to push the table content below our stamp.
//       position = (heightLeft - pdfImgHeight) + headerHeight;
      
//       pdf.addImage(imgData, 'PNG', margin, position, pdfImgWidth, pdfImgHeight);
      
//       // Stamp the header on top of the image to hide overlapping rows
//       drawHeader();

//       heightLeft -= (pageHeight - headerHeight);
//     }

//     window.open(pdf.output("bloburl"), "_blank");
//   } catch (error) {
//     console.error("PDF Export Error:", error);
//   }
//   setPrinting(false);
// };


// const handlePrint = async () => {
//   setPrinting(true);
//   try {
//     const element = componentRef.current;
//     const canvas = await html2canvas(element, { 
//       scale: 3, 
//       useCORS: true,
//       logging: false 
//     });
    
//     const imgData = canvas.toDataURL("image/png");
//     const pdf = new jsPDF("l", "mm", "a4"); // Landscape
    
//     const pageWidth = 297;
//     const pageHeight = 210;
//     const margin = 7;
//     const headerHeight = 65; // Increased to fit vertical book names
    
//     const imgProps = pdf.getImageProperties(imgData);
//     const pdfImgWidth = pageWidth - (margin * 2);
//     const pdfImgHeight = (imgProps.height * pdfImgWidth) / imgProps.width;

//     const drawHeader = () => {
//       // 1. Clear Header Area
//       pdf.setFillColor(255, 255, 255);
//       pdf.rect(0, 0, pageWidth, headerHeight, 'F'); 
      
//       // 2. Company Info
//       pdf.setTextColor(0, 0, 0);
//       pdf.setFont("helvetica", "bold");
//       pdf.setFontSize(10);
//       pdf.text("M. V. Phadke & Co. Kolhapur", margin, 12);
      
//       pdf.setFontSize(10);
//       pdf.text("Inv. Citywise Cross", margin, 18);
//       pdf.text(`From ${filters?.startdate || ""} to ${filters?.enddate || ""}`, margin, 23);

//       // 3. Static Column Labels
//       pdf.setFontSize(6);
//       pdf.text("City", margin + 4, 60);
//       pdf.text("Canvassor Name", margin + 13, 60);
//       pdf.text("Date", margin + 40, 60);
//       pdf.text("Inv.#", margin + 48, 60);
//       pdf.text("R.R.#", margin + 52, 60);
//       pdf.text("Transport", margin + 59, 60);

//       // 4. DRAW VERTICAL BOOK NAMES
//       // This part repeats the book titles across the top
//       pdf.setFontSize(7);
//       const startX = margin + 72; // Adjusted to match where your book columns start
//       const columnWidth = 10;    // This must match the width of your 28px MUI table cell

//       bookColumns.forEach((book, idx) => {
//         const xPos = startX + (idx * columnWidth);
//         // rotate(90) makes it vertical. The coordinates (x, y) are the pivot point.
//         pdf.text(book, xPos, 58, { angle: 90 });
//       });
      
//       // 5. Header Bottom Line
//       pdf.setLineWidth(0.2);
//       pdf.line(margin, 62, pageWidth - margin, 62);
//     };

//     let heightLeft = pdfImgHeight;
//     let position = 0; 

//     // PAGE 1
//     pdf.addImage(imgData, 'PNG', margin, 0, pdfImgWidth, pdfImgHeight);
//     heightLeft -= pageHeight; 

//     // SUBSEQUENT PAGES
//     while (heightLeft > 0) {
//       pdf.addPage();
      
//       // Slide the image. headerHeight gives us room to stamp the new header.
//       position = (heightLeft - pdfImgHeight) + headerHeight;
      
//       pdf.addImage(imgData, 'PNG', margin, position, pdfImgWidth, pdfImgHeight);
      
//       // Stamp the header (Title + Static Columns + Vertical Books)
//       drawHeader();

//       heightLeft -= (pageHeight - headerHeight);
//     }

//     window.open(pdf.output("bloburl"), "_blank");
//   } catch (error) {
//     console.error("PDF Export Error:", error);
//   }
//   setPrinting(false);
// };


const handlePrint = async () => {
  setPrinting(true);
  try {
    const element = componentRef.current;
    const canvas = await html2canvas(element, { 
      scale: 3, 
      useCORS: true,
      logging: false 
    });
    
    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF("l", "mm", "a4"); 
    
    const pageWidth = 297;
    const pageHeight = 210;
    const margin = 7;
    const headerHeight = 65; 
    
    const imgProps = pdf.getImageProperties(imgData);
    const pdfImgWidth = pageWidth - (margin * 2);
    const pdfImgHeight = (imgProps.height * pdfImgWidth) / imgProps.width;

    const drawHeader = () => {
      pdf.setFillColor(255, 255, 255);
      pdf.rect(0, 0, pageWidth, headerHeight, 'F'); 
      
      pdf.setTextColor(0, 0, 0);
      pdf.setFont("helvetica", "bold");
      pdf.setFontSize(13);
      pdf.text("M. V. Phadke & Co. Kolhapur", margin, 12);
      
      pdf.setFontSize(9);
      pdf.text("Inv. Citywise Cross", margin, 18);
      pdf.text(`From ${filters?.startdate || ""} to ${filters?.enddate || ""}`, margin, 23);

      pdf.setFontSize(6);
      pdf.text("City", margin + 4, 60);
      pdf.text("Canvassor Name", margin + 13, 60);
      pdf.text("Date", margin + 40, 60);
      pdf.text("Inv.#", margin + 48, 60);
      pdf.text("R.R.#", margin + 53, 60);
      pdf.text("Transport", margin + 59, 60);

      // --- ALIGNMENT MATH ---
      // 28px cell width converts to roughly 7.41mm at standard scale
      const columnWidth = 7.1; 
      const startX = margin + 69 ; // Start of the first book column

      pdf.setFontSize(7);
      bookColumns.forEach((book, idx) => {
        const xPos = startX + (idx * columnWidth);
        
        // Draw the vertical text
        pdf.text(book, xPos + (columnWidth / 2), 58, { angle: 90 });

        // Draw vertical grid lines for the header
        pdf.setDrawColor(0, 0, 0);
        // pdf.setLineWidth(0.1);
        pdf.line(xPos, 28, xPos, 62); 
      });

      // Horizontal Header Lines
      // pdf.setLineWidth(0.1);
      pdf.line(margin, 28, pageWidth - margin, 28); // Top of book names
      pdf.line(margin, 62, pageWidth - margin, 62); // Bottom of header
    };

    let heightLeft = pdfImgHeight;
    let position = 0; 

    // PAGE 1
    pdf.addImage(imgData, 'PNG', margin, 0, pdfImgWidth, pdfImgHeight);
    heightLeft -= pageHeight; 

    // SUBSEQUENT PAGES
    while (heightLeft > 0) {
      pdf.addPage();
      position = (heightLeft - pdfImgHeight) + headerHeight;
      pdf.addImage(imgData, 'PNG', margin, position, pdfImgWidth, pdfImgHeight);
      
      drawHeader();

      heightLeft -= (pageHeight - headerHeight);
    }

    window.open(pdf.output("bloburl"), "_blank");
  } catch (error) {
    console.error("PDF Export Error:", error);
  }
  setPrinting(false);
};

  if (!isPrintMode) return null;

  return (
    <Box sx={{ width: '100%', minHeight: '100vh', bgcolor: '#f5f5f5' }}>
      <Stack direction="row" spacing={2} sx={{ p: 2, bgcolor: 'white', borderBottom: '1px solid #ddd', "@media print": { display: 'none' } }}>
        <Button variant="outlined" startIcon={<ArrowBackIcon />} onClick={() => navigate(-1)}>Back</Button>
        <Button variant="contained" color="primary" startIcon={<PrintIcon />} onClick={handlePrint} disabled={loading}>
          {loading ? "Loading..." : "Export PDF"}
        </Button>
      </Stack>


      {/* The Loading Overlay/Message */}
    {printing && (
      <div className="loading-overlay" style={{color:'green', fontWeight:'bold', fontSize:'17px'}}>
        <p>Please wait, your report is being generated. This may take a few seconds...</p>
      </div>
    )}

      <Box ref={componentRef} sx={{ p: '5mm', bgcolor: 'white', mx: 'auto', mt: 1, width: 'fit-content' }}>
        {/* Header - Matching Screen 1 Style */}
        <Box sx={{ mb: 1, textAlign: 'left', pl: 1 }}>
          <Typography variant="body1" sx={{ fontWeight: 'bold', fontSize: '14px' }}>M. V. Phadke & Co. Kolhapur</Typography>
          <Typography variant="body2" sx={{ fontSize: '12px', fontWeight:'bold' }}>Inv. Citywise Cross</Typography>
          <Typography variant="body2" sx={{ fontSize: '11px', fontWeight:'bold' }}>From {filters?.startdate || "01-04-2025"} to {filters?.enddate || "31-03-2026"}</Typography>
        </Box>

        {loading ? (
          <Box sx={{ textAlign: 'center', p: 10 }}><CircularProgress /></Box>
        ) : (
         <TableContainer component={Paper} elevation={0} sx={{ borderRadius: 0, border: '1px solid black' }}>
  <Table sx={{ 
      borderCollapse: 'collapse', 
      '& td, & th': { 
        border: '1px solid black', 
        p: '3px 5px', 
        fontSize: '10px', 
        color: 'black' 
      } 
  }}>
    <TableHead>
      <TableRow sx={{ height: '180px' }}>
        {["City", "Canvassor Name", "Date", "Inv. #", "R.R. #", "Transport"].map((h) => (
          <TableCell key={h} sx={{ fontWeight: 'bold', verticalAlign: 'bottom' }}>
            {h}
          </TableCell>
        ))}
        {bookColumns.map((book, idx) => (
          <TableCell key={idx} sx={{ width: '28px', p: 0, verticalAlign: 'bottom' }}>
            <Box sx={{ 
              height: '175px', 
              width: '28px', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              mb: 1
            }}>
              <span style={{ 
                transform: 'rotate(-90deg)', 
                whiteSpace: 'nowrap',
                fontWeight: 'bold',
                fontSize: '10px',
                width: '175px',
                textAlign: 'left',
                display: 'block'
              }}>
                {book}
              </span>
            </Box>
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
              <TableBody>
                {reportData.map((row, i) => (
                  <TableRow key={i}>
                    {citySpans[i] > 0 && (
                      <TableCell rowSpan={citySpans[i]} sx={{ fontWeight: 'bold', verticalAlign: 'top', textTransform: 'uppercase' }}>
                        {row.city}
                      </TableCell>
                    )}
                    {canvassorSpans[i] > 0 && (
                      <TableCell rowSpan={canvassorSpans[i]} sx={{ verticalAlign: 'top', textTransform: 'uppercase', minWidth: '100px' }}>
                        {row.canvassor}
                      </TableCell>
                    )}
                    <TableCell sx={{ whiteSpace: 'nowrap' }}>{row.date}</TableCell>
                    <TableCell align="center">{row.inv_no}</TableCell>
                    <TableCell align="center">{row.rr_no}</TableCell>
                    <TableCell sx={{ fontSize: '8px' }}>{row.transport}</TableCell>
                    {bookColumns.map((book, j) => (
                      <TableCell key={j} align="center" sx={{ fontWeight: row.books[book] ? 'bold' : 'normal' }}>
                        {row.books[book] || ""}
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
                {/* Footer Grand Total */}
                <TableRow sx={{ bgcolor: '#ffffff' }}>
                  <TableCell colSpan={6} align="right" sx={{ fontWeight: 'bold', fontSize: '10px' }}>Grand Total:</TableCell>
                  {bookColumns.map((book, idx) => {
                    const total = reportData.reduce((sum, row) => sum + (row.books[book] || 0), 0);
                    return (
                      <TableCell key={idx} align="center" sx={{ fontWeight: 'bold', fontSize: '10px' }}>
                        {total || ""}
                      </TableCell>
                    );
                  })}
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Box>
    </Box>
  );
};

export default InvcitywiseCross;