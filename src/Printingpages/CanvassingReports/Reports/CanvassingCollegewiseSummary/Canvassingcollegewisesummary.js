import React, { useRef, useEffect, useState } from 'react';
import { 
  Box, Typography, Button, Stack, Table, TableBody, 
  TableCell, TableContainer, TableHead, TableRow, Paper, CircularProgress 
} from "@mui/material";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import PrintIcon from '@mui/icons-material/Print';
import { useNavigate, useLocation } from 'react-router-dom';
import { styled } from '@mui/material/styles';
import axios from 'axios';

const StyledTableCell = styled(TableCell)({
  border: '1px solid black',
  padding: '2px 4px',
  fontSize: '11px',
  fontFamily: '"Times New Roman", Times, serif',
  color: 'black',
  lineHeight: 1.2,
  textAlign: 'center'
});

const VerticalHeaderCell = styled(StyledTableCell)({
  height: '180px', 
  whiteSpace: 'nowrap',
  verticalAlign: 'bottom',
  padding: '10px 0',
  width: '35px',
  '& div': {
    // This part often causes the "reverse" issue in canvas, 
    // but works perfectly in native browser print.
    writingMode: 'vertical-rl',
    transform: 'rotate(180deg)',
    textAlign: 'left',
    width: '30px',
    margin: '0 auto',
    fontWeight: 'bold',
    fontSize: '10px'
  }
});

const CanvassingCollegeWiseSummary = () => {
  const [reportRows, setReportRows] = useState([]);
  const [bookList, setBookList] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const navigate = useNavigate();
  const location = useLocation();
  const filters = location.state?.filters || {};

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const joinIds = (arr) => (Array.isArray(arr) ? arr.join(",") : (arr || ""));
        const params = new URLSearchParams({
          fromdate: filters?.period?.startdate || filters?.startdate || "2026-01-01",
          todate: filters?.period?.enddate || filters?.enddate || "2026-03-01",
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

        const url = `https://publication.microtechsolutions.net.in/php/get/getCanvassingCollegewiseSummary.php?${params.toString()}`;
        const response = await axios.get(url);
        const rawData = response.data.data || [];

        if (rawData.length > 0) {
          const uniqueBooks = [...new Set(rawData.map(item => item.BookNameMarathi || item.BookName))].filter(Boolean);
          setBookList(uniqueBooks);

          const grouped = rawData.reduce((acc, item) => {
            const key = `${item["College Name"]}-${item["Chln.No." ]}-${item["Entry #"]}`;
            if (!acc[key]) {
              acc[key] = {
                canvassor: item.Canvassor,
                city: item.City,
                area: item.Area,
                collegeName: item["College Name"],
                chlnNo: item["Chln.No."],
                entryNo: item["Entry #"],
                quantities: {},
                rowTotal: 0
              };
            }
            const bookKey = item.BookNameMarathi || item.BookName;
            const qty = parseInt(item.Total) || 0;
            acc[key].quantities[bookKey] = (acc[key].quantities[bookKey] || 0) + qty;
            acc[key].rowTotal += qty;
            return acc;
          }, {});

          setReportRows(Object.values(grouped));
        }
      } catch (err) {
        console.error("API Error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [filters]);

  // NEW PRINT LOGIC: Native Browser Print
  const handlePrint = () => {
    window.print();
  };

  if (loading) return <Box sx={{ display: 'flex', justifyContent: 'center', mt: 10 }}><CircularProgress /></Box>;

  return (
    <Box sx={{ 
      bgcolor: '#f5f5f5', 
      minHeight: '100vh', 
      p: 4,
      // CSS to handle Print layout
      "@media print": {
        p: 0,
        bgcolor: 'white',
        "body": { visibility: "hidden" },
        ".print-area": { 
          visibility: "visible", 
          position: "absolute", 
          left: 0, 
          top: 0,
          width: '100%' 
        }
      }
    }}>
      <Stack direction="row" spacing={2} sx={{ mb: 2, "@media print": { display: 'none' } }}>
        <Button variant="outlined" startIcon={<ArrowBackIcon />} onClick={() => navigate(-1)} sx={{ bgcolor: 'white' }}>
          Back
        </Button>
        <Button variant="contained" startIcon={<PrintIcon />} onClick={handlePrint}>
          Print Report
        </Button>
      </Stack>

      {/* Added class 'print-area' for targetted printing */}
      <Paper 
        className="print-area"
        elevation={0}
        sx={{ 
          p: '10mm', 
          width: 'fit-content', 
          minWidth: '277mm', 
          mx: 'auto', 
          bgcolor: 'white',
          fontFamily: '"Times New Roman", Times, serif'
        }}
      >
        <Box sx={{ mb: 2, textAlign: 'center' }}>
          <Typography sx={{ fontSize: '18px', fontWeight: 'bold' }}>M. V. Phadke & Co. Kolhapur</Typography>
          <Typography sx={{ fontSize: '14px', fontWeight: 'bold' }}>Canvassing Collegewise Summary</Typography>
          <Typography sx={{ fontSize: '11px' }}>
            From {filters?.period?.startdate || "01-04-2025"} to {filters?.period?.enddate || "31-03-2026"}
          </Typography>
        </Box>

        <TableContainer>
          <Table size="small" sx={{ 
            borderCollapse: 'collapse', 
            // Ensure borders are sharp in print
            '& td, & th': { border: '1px solid black' } 
          }}>
            <TableHead sx={{ display: 'table-header-group' }}>
              <TableRow>
                <StyledTableCell sx={{ width: '120px', fontWeight: 'bold' }}>Canvassor</StyledTableCell>
                <StyledTableCell sx={{ width: '80px', fontWeight: 'bold' }}>City</StyledTableCell>
                <StyledTableCell sx={{ width: '80px', fontWeight: 'bold' }}>Area</StyledTableCell>
                <StyledTableCell sx={{ width: '180px', fontWeight: 'bold', textAlign: 'left' }}>College Name</StyledTableCell>
                <StyledTableCell sx={{ width: '40px', fontWeight: 'bold' }}>Chln.</StyledTableCell>
                <StyledTableCell sx={{ width: '40px', fontWeight: 'bold' }}>Entry</StyledTableCell>
                
                {bookList.map((book, idx) => (
                  <VerticalHeaderCell key={idx}>
                    <div>{book}</div>
                  </VerticalHeaderCell>
                ))}
                
                <StyledTableCell sx={{ width: '50px', fontWeight: 'bold' }}>Total</StyledTableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {reportRows.map((row, index) => (
                <TableRow key={index} sx={{ pageBreakInside: 'avoid' }}>
                  <StyledTableCell sx={{ textAlign: 'left' }}>{row.canvassor}</StyledTableCell>
                  <StyledTableCell>{row.city}</StyledTableCell>
                  <StyledTableCell>{row.area}</StyledTableCell>
                  <StyledTableCell sx={{ textAlign: 'left', fontSize: '10px' }}>{row.collegeName}</StyledTableCell>
                  <StyledTableCell>{row.chlnNo}</StyledTableCell>
                  <StyledTableCell>{row.entryNo}</StyledTableCell>
                  {bookList.map((book, bIdx) => (
                    <StyledTableCell key={bIdx}>{row.quantities[book] || ""}</StyledTableCell>
                  ))}
                  <StyledTableCell sx={{ fontWeight: 'bold' }}>{row.rowTotal}</StyledTableCell>
                </TableRow>
              ))}

              <TableRow sx={{ bgcolor: '#f9f9f9', WebkitPrintColorAdjust: 'exact' }}>
                <StyledTableCell colSpan={6} align="right" sx={{ fontWeight: 'bold' }}>GRAND TOTAL:</StyledTableCell>
                {bookList.map((book, i) => {
                  const colTotal = reportRows.reduce((sum, row) => sum + (row.quantities[book] || 0), 0);
                  return <StyledTableCell key={i} sx={{ fontWeight: 'bold' }}>{colTotal || ""}</StyledTableCell>
                })}
                <StyledTableCell sx={{ fontWeight: 'bold' }}>
                  {reportRows.reduce((sum, row) => sum + row.rowTotal, 0)}
                </StyledTableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Box>
  );
};

export default CanvassingCollegeWiseSummary;