import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from "react-router-dom";
import { 
  Box, Typography, Button, Stack, Container, 
  Table, TableBody, TableCell, TableHead, TableRow, 
  TableContainer, CircularProgress 
} from "@mui/material";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import PrintIcon from '@mui/icons-material/Print';

const Accountmasterlistingmobilenos = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // 1. Component States
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const isPrintMode = location.state?.printMode;
  const filters = location.state?.filters;

  // 2. Fetch Data from Backend
  useEffect(() => {
    if (isPrintMode) {
      setLoading(true);
      // Replace this URL with your actual backend endpoint
      fetch('https://publication.microtechsolutions.net.in/php/get/getAccountMasterListing.php', {
        method: 'POST', // Or GET depending on your API
        body: JSON.stringify(filters) 
      })
        .then((res) => res.json())
        .then((json) => {
          setData(Array.isArray(json) ? json : []);
          setLoading(false);
        })
        .catch((err) => {
          console.error("API Error:", err);
          setLoading(false);
        });
    }
  }, [isPrintMode, filters]);

  // 3. Prevent rendering if not in print mode
  if (!isPrintMode) return null;

  const handlePrint = () => { window.print(); };
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

      {/* REPORT PAGE */}
      <Container maxWidth="lg" sx={{ py: 3, fontFamily: 'serif' }}>
        
        {/* Header */}
        <Box sx={{ textAlign: 'center', mb: 2 }}>
          <Typography variant="h6" fontWeight="bold">Phadke Prakashan, Kolhapur.</Typography>
          <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>
            Account Master Listing : Mobile Numbers
          </Typography>
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
                {data.length > 0 ? data.map((row, index) => (
                  <TableRow key={index}>
                    {/* Adjust these keys (AccountName, Phone, Mobile) to match your backend JSON */}
                    <TableCell>{row.AccountName || row.name}</TableCell>
                    <TableCell>{row.Telephone || row.tel}</TableCell>
                    <TableCell>{row.MobileNo || row.mobile}</TableCell>
                  </TableRow>
                )) : (
                  <TableRow>
                    <TableCell colSpan={3} align="center">No Data Found</TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Container>
    </Box>
  );
};

export default Accountmasterlistingmobilenos;