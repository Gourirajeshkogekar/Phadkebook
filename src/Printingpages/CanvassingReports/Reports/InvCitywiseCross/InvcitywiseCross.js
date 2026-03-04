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
      const params = new URLSearchParams({
        fromdate: filters?.startdate || "2025-04-01",
        todate: filters?.enddate || "2026-03-31",
        area: filters?.area || "",
        city: filters?.city || "",
        publication: filters?.publication || "",
        college: filters?.college || "",
        canvassor: filters?.canvassor || "",
        party: filters?.party || "",
        standard: filters?.standard || "",
        bookgroup: filters?.bookgroup || "",
        books: filters?.books || ""
      });

      fetch(`https://publication.microtechsolutions.net.in/php/get/getInvCitywiseCross.php?${params.toString()}`)
        .then((res) => res.json())
        .then((data) => {
          if (Array.isArray(data)) {
            const uniqueBooks = [...new Set(data
              .map(item => item.BookName)
              .filter(name => name && name.trim() !== ""))]
              .sort(); 
            setBookColumns(uniqueBooks);

            const grouped = data.reduce((acc, item) => {
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
                acc[invKey].books[item.BookName] = (acc[invKey].books[item.BookName] || 0) + (parseInt(item.Copies) || 0);
              }
              return acc;
            }, {});
            setReportData(Object.values(grouped));
          }
          setLoading(false);
        })
        .catch(() => setLoading(false));
    }
  }, [isPrintMode, filters]);

  const citySpans = getRowSpans(reportData, 'city');
  const canvassorSpans = getRowSpans(reportData, 'canvassor');

  const handlePrint = async () => {
    if (!componentRef.current) return;
    const canvas = await html2canvas(componentRef.current, { scale: 3, useCORS: true });
    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF({ orientation: "landscape", unit: "mm", format: "a4" });
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
    pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
    window.open(pdf.output("bloburl"), "_blank");
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

      <Box ref={componentRef} sx={{ p: '5mm', bgcolor: 'white', mx: 'auto', mt: 1, width: 'fit-content' }}>
        {/* Header - Matching Screen 1 Style */}
        <Box sx={{ mb: 1, textAlign: 'left', pl: 1 }}>
          <Typography variant="body1" sx={{ fontWeight: 'bold', fontSize: '14px' }}>M. V. Phadke & Co. Kolhapur</Typography>
          <Typography variant="body2" sx={{ fontSize: '12px' }}>Inv. Citywise Cross</Typography>
          <Typography variant="body2" sx={{ fontSize: '11px' }}>From {filters?.startdate || "01-04-2025"} to {filters?.enddate || "31-03-2026"}</Typography>
        </Box>

        {loading ? (
          <Box sx={{ textAlign: 'center', p: 10 }}><CircularProgress /></Box>
        ) : (
          <TableContainer component={Paper} elevation={0} sx={{ borderRadius: 0 }}>
            <Table sx={{ 
                borderCollapse: 'collapse', 
                '& td, & th': { border: '1px solid black', p: '2px 4px', fontSize: '9px', lineHeight: '1.2' } 
            }}>
              <TableHead>
                <TableRow sx={{ height: '180px' }}>
                  {["City", "Canvassor Name", "Date", "Inv. #", "R.R. #", "Transport"].map((h) => (
                    <TableCell key={h} sx={{ fontWeight: 'bold', verticalAlign: 'bottom', textAlign: 'left' }}>{h}</TableCell>
                  ))}
                  {bookColumns.map((book, idx) => (
                    <TableCell key={idx} sx={{ width: '25px', verticalAlign: 'bottom', p: 0 }}>
                      <Box sx={{ 
                        writingMode: 'vertical-rl', 
                        transform: 'rotate(180deg)', 
                        whiteSpace: 'nowrap', 
                        fontWeight: 'bold', 
                        fontSize: '9px',
                        height: '170px',
                        display: 'flex',
                        alignItems: 'flex-start',
                        justifyContent: 'center',
                        mx: 'auto'
                      }}>
                        {book}
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