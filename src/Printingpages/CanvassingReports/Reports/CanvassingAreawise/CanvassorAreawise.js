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

const filters = location.state?.filters;
  const isPrintMode = location.state?.printMode;


 useEffect(() => {
   if (isPrintMode && filters ) {
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

    const url = `https://publication.microtechsolutions.net.in/php/get/getCanvassingAreawise.php?${params.toString()}`;

    fetch(url)
      .then((res) => res.json())
      .then((json) => {
        if (json.success && Array.isArray(json.data)) {

          const grouped = json.data.reduce((acc, item) => {
  const area = item.AreaName?.trim() || "No Area Assigned";
  const college = item.CollegeName?.trim() || "No College Assigned";
  // Accessing the Standard key from your JSON
  const standard = item.Standard || item.StandardName || "N/A";




  if (!acc[area]) acc[area] = {};
  if (!acc[area][college]) acc[area][college] = {}; // Changed to object
  if (!acc[area][college][standard]) acc[area][college][standard] = [];

  acc[area][college][standard].push(item);
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
  }
}, [isPrintMode, filters]);

 
 
  const reportRef = useRef();

  const [printing, setPrinting] = useState(false);



//  const handlePrint = async () => {
//   setPrinting(true);
//   try {
//     const element = componentRef.current;
//     if (!element) return;

//     const canvas = await html2canvas(element, {
//       scale: 2,
//       useCORS: true,
//       logging: false
//     });

//     const imgData = canvas.toDataURL("image/png");
//     const pdf = new jsPDF("p", "mm", "a4");
//     
//     const pdfWidth = pdf.internal.pageSize.getWidth();
//     const pdfHeight = pdf.internal.pageSize.getHeight();
//     
//     const canvasWidth = canvas.width;
//     const canvasHeight = canvas.height;
//     
//     // Calculate how much height of the canvas fits on one PDF page
//     const pageHeightInCanvasPixels = (canvasWidth * pdfHeight) / pdfWidth;
//     
//     let heightLeft = canvasHeight;
//     let position = 0;

//     // Add first page
//     pdf.addImage(imgData, 'PNG', 0, position, pdfWidth, (canvasHeight * pdfWidth) / canvasWidth);
//     heightLeft -= pageHeightInCanvasPixels;

//     // Add subsequent pages if content remains
//     while (heightLeft > 0) {
//       position = heightLeft - canvasHeight; // Move the image up
//       pdf.addPage();
//       pdf.addImage(imgData, 'PNG', 0, (position * pdfWidth) / canvasWidth, pdfWidth, (canvasHeight * pdfWidth) / canvasWidth);
//       heightLeft -= pageHeightInCanvasPixels;
//     }

//     window.open(pdf.output("bloburl"), "_blank");
//   } catch (err) {
//     console.error("PDF Error:", err);
//   } finally {
//     setPrinting(false);
//   }
// };


// const handlePrint = async () => {
//   setPrinting(true);

//   try {
//     const element = componentRef.current;
//     if (!element) return;

//     const canvas = await html2canvas(element, {
//       scale: 2,
//       useCORS: true,
//     });

//     const imgData = canvas.toDataURL("image/png");

//     const pdf = new jsPDF("p", "mm", "a4");

//     const pdfWidth = 210;
//     const pdfHeight = 297;

//     const imgWidth = pdfWidth;
//     const imgHeight = (canvas.height * imgWidth) / canvas.width;

//     let heightLeft = imgHeight;
//     let position = 0;

//     pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
//     heightLeft -= pdfHeight;

//     while (heightLeft > 0) {
//       position = heightLeft - imgHeight;
//       pdf.addPage();
//       pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
//       heightLeft -= pdfHeight;
//     }

//     // pdf.save("Canvassing_Areawise.pdf");
// pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);

// console.log("PDF pages:", pdf.getNumberOfPages());
//     window.open(pdf.output("bloburl"), "_blank");
//   } catch (error) {
//     console.error(error);
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

    // --- Header Constants ---
    const title = "Phadke Prakashan, Kolhapur.";
    const subTitle = "Canvassing Areawise";
    const dateRange = `Period: ${filters?.period?.startdate || ""} To ${filters?.period?.enddate || ""}`;

    // 1. Add the first page
    pdf.addImage(imgData, "PNG", 0, position, pdfWidth, imgHeight);
    heightLeft -= pdfHeight;

    // 2. Loop for subsequent pages
    while (heightLeft > 0) {
      position = heightLeft - imgHeight; 
      pdf.addPage();
      
      // Draw the image slice
      pdf.addImage(imgData, "PNG", 0, position, pdfWidth, imgHeight);

      // --- STAMP REPEATING HEADER (White Box) ---
      pdf.setFillColor(255, 255, 255);
      pdf.rect(0, 0, pdfWidth, 40, 'F'); 

      // Header Text
      pdf.setFont("helvetica", "bold");
      pdf.setFontSize(11);
      pdf.text(title, pdfWidth / 2, 10, { align: "center" });
      
      pdf.setFontSize(9);
      pdf.text(subTitle, pdfWidth / 2, 16, { align: "center" });
      
      pdf.setFontSize(8);
      pdf.text(dateRange, pdfWidth / 2, 21, { align: "center" });

      // --- DRAW COLUMN HEADERS ---
      pdf.setFontSize(7); // Small font for 8-column layout
      pdf.setLineWidth(0.3);
      
      // Lines
      pdf.line(10, 26, 200, 26); 
      
      // Column Labels (Based on your width props)
      // Standard margins: Left 10mm, Right 200mm
      pdf.text("Book Code", 10, 31);
      pdf.text("Book Name", 26, 31);
      pdf.text("Professor Name", 78, 31);
      pdf.text("Chln. No", 112, 31);
      pdf.text("Chln. Dt.", 130, 31);
      pdf.text("Copies", 155, 31, { align: "center" });
      pdf.text("Feeding Dt.", 178, 31, { align: "center" });
      pdf.text("Entry #", 200, 31, { align: "right" });

      pdf.line(10, 34, 200, 34); 

      heightLeft -= pdfHeight;
    }

    window.open(pdf.output("bloburl"), "_blank");
  } catch (error) {
    console.error("PDF Generation Error:", error);
  }

  setPrinting(false);
};
   

const printStyles = (
<style>
{`
@media print {

  thead {
    display: table-header-group;
  }

  tr {
    page-break-inside: avoid;
  }

  table {
    page-break-inside: auto;
  }

}
`}
</style>
);

  return (
    <Box sx={{ width: '100%', minHeight: '100vh', bgcolor: '#525659', p: 2 }}>
      <Paper elevation={3} sx={{ p: 2, mb: 2, "@media print": { display: 'none' } }}>
        <Stack direction="row" spacing={2} justifyContent="center">
          <Button variant="outlined" startIcon={<ArrowBackIcon />} onClick={() => navigate(-1)}>
            Back to Filters
          </Button>
          <Button variant="contained" color="primary" startIcon={<PrintIcon />} 
          sx={{ "@media print": { display: "none" } }} // Hides button on the actual printout
          onClick={handlePrint}>
            Download PDF
          </Button>
        </Stack>
      </Paper>

<Box
 ref={componentRef}
 sx={{
  bgcolor: "white",
  width: "210mm",
  minHeight: "297mm",
  margin: "auto",
  p: "15mm"
 }}
>

{printStyles}

<Box sx={{ mb: 3, textAlign: "center" }}>
  <Typography variant="h5" sx={{ fontWeight: 'bold', fontFamily: 'serif' }}>
    Phadke Prakashan, Kolhapur.
  </Typography>
  <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
    Canvassing Areawise
  </Typography>
  {/* IMPROVED DATE DISPLAY */}
  <Typography variant="body2" sx={{ fontWeight: 'bold', mt: 1 }}>
Period: {filters?.period?.startdate  } To {filters?.period?.enddate  }  </Typography>
</Box>
        
        {loading ? (
          <Box sx={{ textAlign: 'center', mt: 10 }}><CircularProgress /></Box>
        ) : (
          <TableContainer>
<Table
 size="small"
 sx={{
  width: "100%",
  borderCollapse: "collapse",
  tableLayout: "fixed",
  "& .MuiTableCell-root": {
    fontFamily: "serif",
    fontSize: "11px",
    py: "2px",
    px: "4px"
  }
 }}
>       <TableHead>
<TableRow sx={{ borderTop: '1.5pt solid black', borderBottom: '1.5pt solid black' }}>

<TableCell sx={{ fontWeight: 'bold', width: '60px' }}>
Book Code
</TableCell>

<TableCell sx={{ fontWeight: 'bold', width: '200px' }}>
Book Name
</TableCell>

<TableCell sx={{ fontWeight: 'bold', width: '130px' }}>
Professor Name
</TableCell>

<TableCell sx={{ fontWeight: 'bold', width: '70px' }}>
Chln. No
</TableCell>

<TableCell sx={{ fontWeight: 'bold', width: '85px' }}>
Chln. Dt.
</TableCell>

<TableCell align="center" sx={{ fontWeight: 'bold', width: '50px' }}>
Copies
</TableCell>

<TableCell align="center" sx={{ fontWeight: 'bold', width: '85px' }}>
Feeding Dt.
</TableCell>

<TableCell align="center" sx={{ fontWeight: 'bold', width: '50px' }}>
Entry #
</TableCell>

</TableRow>
</TableHead>
            <TableBody>
  {Object.entries(reportData).map(([areaName, colleges]) => (
    <React.Fragment key={areaName}>
      {/* 1. AREA HEADER */}
<TableRow sx={{ pageBreakInside: 'avoid', breakInside: 'avoid' }} className="header-row">  
    <TableCell colSpan={8} sx={{ textAlign: 'center', pt: 1 }}>
          <Typography sx={{ fontWeight: 'bold', fontSize: '14px', textTransform: 'uppercase' }}>
            {areaName}
          </Typography>
        </TableCell>
      </TableRow>

      {Object.entries(colleges).map(([collegeName, standards]) => (
        <React.Fragment key={collegeName}>
          {/* 2. COLLEGE HEADER */}
<TableRow sx={{ pageBreakInside: 'avoid', breakInside: 'avoid' }} className="header-row">     
        <TableCell colSpan={8} sx={{ textAlign: 'center', pt: 1 }}>
              <Typography sx={{ fontWeight: 'bold', fontSize: '12px' }}>
                {collegeName}
              </Typography>
            </TableCell>
          </TableRow>

          {Object.entries(standards).map(([standardName, items]) => (
            <React.Fragment key={standardName}>
              {/* 3. STANDARD NAME (Matches Screenshot) */}
<TableRow sx={{ pageBreakInside: 'avoid', breakInside: 'avoid' }} className="header-row">
              <TableCell colSpan={8} sx={{ textAlign: 'center', pb: 1 }}>
                  <Typography sx={{ fontSize: '11px', fontWeight: 'bold' }}>
                    {standardName}
                  </Typography>
                </TableCell>
              </TableRow>

              {/* 4. DATA ROWS */}
              {items.map((row, rIdx) => (
<TableRow key={rIdx} sx={{ verticalAlign: 'top', pageBreakInside: 'avoid' }}>        
            <TableCell>{row.BookCode}</TableCell>
                  <TableCell sx={{ maxWidth: '200px' }}>
                    <Typography sx={{ fontSize: '11px' }}>
                      {row.BookName || "---"}
                    </Typography>
                  </TableCell>
                  {/* Note: Use bracket notation if keys have spaces like "Professor Name" */}
                  <TableCell>{row["Professor Name"] || row.ProfessorName}</TableCell>
                  <TableCell>{row.ChlnNo}</TableCell>
                  <TableCell>{row["Chln Dt."] || row.ChlnDt}</TableCell>
                  <TableCell align="center">
                    <Box sx={{   display: 'inline-block', minWidth: '20px' }}>
                      {row.Copies || 0}
                    </Box>
                  </TableCell>
                  <TableCell align="center">{row["Feeding Dt."] || row.FeedingDt}</TableCell>
                  <TableCell align="center">{row.Entry}</TableCell>
                </TableRow>
              ))}
              
              {/* Line separator after each standard group to match screenshot */}
              <TableRow>
                <TableCell colSpan={8} sx={{ p: 0 }}>
                  <Box sx={{  mt:0.5, mb:0.5 }} />
                </TableCell>
              </TableRow>
            </React.Fragment>
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