import React, { useState, useEffect, useRef } from 'react';
import {
  Box, Typography, Paper, Grid, TextField, MenuItem, Button,
  FormControlLabel, Checkbox, Stack, Table, TableBody,
  TableCell, TableContainer, TableHead, TableRow, Divider, CircularProgress
} from "@mui/material";
import { ArrowBack, Print } from '@mui/icons-material';
import axios from 'axios';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

function Ageinganalysisamounwise() {
  const [view, setView] = useState('form');
  const [loading, setLoading] = useState(false);
  const [masters, setMasters] = useState({ canvassors: [], groups: [] });
  const [formData, setFormData] = useState({
    canvassorName: "-",
    groupHead: "",
    asOnDate: new Date().toISOString().split('T')[0],
  });
  const [reportData, setReportData] = useState([]);
  const reportRef = useRef();

  const [printing, setPrinting] = useState(false);

  // Fetch Masters
  useEffect(() => {
    const fetchMasters = async () => {
      try {
        const [canResponse, groupResponse] = await Promise.all([
          axios.get('https://publication.microtechsolutions.net.in/php/get/getCanvassorMaster.php'),
          axios.get('https://publication.microtechsolutions.net.in/php/AccountGroupget.php')
        ]);
        setMasters({
          canvassors: Array.isArray(canResponse.data) ? canResponse.data : [],
          groups: Array.isArray(groupResponse.data) ? groupResponse.data : []
        });
        if (groupResponse.data.length > 0) {
          setFormData(prev => ({ ...prev, groupHead: groupResponse.data[0].GroupName }));
        }
      } catch (error) {
        console.error("Error fetching masters:", error);
      }
    };
    fetchMasters();
  }, []);

  // FRONTEND FRIENDLY MOCK LOGIC
  const generateReport = async () => {
    setLoading(true);
    // Simulate API Delay
    setTimeout(() => {
      const mockBackendData = [
        {
          PartyName: "INCOME TAX TDS(BANK BOI)",
          OpeningBalance: 176872.00,
          Days30: 0,
          Days60: 0,
          Days90: 0,
          DaysAbove: 37418.00,
          ClosingBalance: 214290.00
        }
      ];
      setReportData(mockBackendData);
      setView('report');
      setLoading(false);
    }, 600);
  };


  const handlePrint = async () => {
      setPrinting(true);
      try {
        const canvas = await html2canvas(reportRef.current, { scale: 2 });
        const imgData = canvas.toDataURL("image/png");
        const pdf = new jsPDF("p", "mm", "a4");
        const width = pdf.internal.pageSize.getWidth();
        const height = (canvas.height * width) / canvas.width;
        pdf.addImage(imgData, "PNG", 0, 0, width, height);
        window.open(pdf.output("bloburl"), "_blank");
      } catch (error) {
        console.error("Print Error:", error);
      } finally {
        setPrinting(false);
      }
    };

  const handlePrintPDF = async () => {
    const canvas = await html2canvas(reportRef.current, { scale: 2 });
    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF("p", "mm", "a4");
    const width = pdf.internal.pageSize.getWidth();
    const height = (canvas.height * width) / canvas.width;
    pdf.addImage(imgData, "PNG", 0, 0, width, height);
    pdf.save(`Ageing_Report_${formData.asOnDate}.pdf`);
  };

  const calculateTotal = (key) => reportData.reduce((sum, row) => sum + (parseFloat(row[key]) || 0), 0).toFixed(2);

  if (view === 'report') {
    return (
      <Box sx={{ p: 2, bgcolor: 'white', minHeight: '100vh' }}>
        
        {/* Action Bar */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2, "@media print": { display: "none" } }}>
          <Button startIcon={<ArrowBack />} onClick={() => setView('form')} variant="outlined">BACK</Button>
          <Stack direction="row" spacing={1}>
            <Button startIcon={<Print />} onClick={handlePrint} variant="outlined">PRINT</Button>
            <Button startIcon={<Print />} onClick={handlePrintPDF} variant="contained">SAVE PDF</Button>
          </Stack>
        </Box>

        {/* Normal Report View */}
        <div ref={reportRef} style={{ padding: '10px' }}>
          <Box sx={{ textAlign: 'center', mb: 3 }}>
            <Typography variant="h5" sx={{ fontWeight: 'bold' }}>PHADKE BOOK HOUSE</Typography>
            <Typography variant="body1">Ageing Analysis - Amountwise</Typography>
            <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
              {formData.groupHead} As on {new Date(formData.asOnDate).toLocaleDateString('en-GB')}
            </Typography>
          </Box>

          <TableContainer component={Box}>
            <Table size="small" sx={{ 
                border: '1px solid black',
                "& td, & th": { border: "1px solid black", px: 1, py: 0.8, fontSize: '13px' } 
            }}>
              <TableHead>
                <TableRow sx={{ bgcolor: '#eeeeee' }}>
                  <TableCell sx={{ fontWeight: 'bold' }}>Name of the Party</TableCell>
                  <TableCell align="right" sx={{ fontWeight: 'bold' }}>Op. Balance</TableCell>
                  <TableCell align="right" sx={{ fontWeight: 'bold' }}>1 to 30 Days</TableCell>
                  <TableCell align="right" sx={{ fontWeight: 'bold' }}>31 to 60 Days</TableCell>
                  <TableCell align="right" sx={{ fontWeight: 'bold' }}>61 to 90 Days</TableCell>
                  <TableCell align="right" sx={{ fontWeight: 'bold' }}>Above 91 Days</TableCell>
                  <TableCell align="right" sx={{ fontWeight: 'bold' }}>Closing Bal.</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                <TableRow>
                  <TableCell colSpan={7} align="center" sx={{ fontWeight: 'bold' }}>
                    <span style={{ textDecoration: 'underline' }}>Above 1,00,000</span>
                  </TableCell>
                </TableRow>

                {reportData.map((row, index) => (
                  <TableRow key={index}>
                    <TableCell>{index + 1}. {row.PartyName}</TableCell>
                    <TableCell align="right">{row.OpeningBalance.toFixed(2)}</TableCell>
                    <TableCell align="right">{row.Days30 || "0.00"}</TableCell>
                    <TableCell align="right">{row.Days60 || "0.00"}</TableCell>
                    <TableCell align="right">{row.Days90 || "0.00"}</TableCell>
                    <TableCell align="right">{row.DaysAbove.toFixed(2)}</TableCell>
                    <TableCell align="right" sx={{ fontWeight: 'bold' }}>{row.ClosingBalance.toFixed(2)}</TableCell>
                  </TableRow>
                ))}

                <TableRow sx={{ bgcolor: '#f9f9f9' }}>
                  <TableCell align="right" sx={{ fontWeight: 'bold' }}>Total</TableCell>
                  <TableCell align="right" sx={{ fontWeight: 'bold' }}>{calculateTotal('OpeningBalance')}</TableCell>
                  <TableCell align="right" sx={{ fontWeight: 'bold' }}>0.00</TableCell>
                  <TableCell align="right" sx={{ fontWeight: 'bold' }}>0.00</TableCell>
                  <TableCell align="right" sx={{ fontWeight: 'bold' }}>0.00</TableCell>
                  <TableCell align="right" sx={{ fontWeight: 'bold' }}>{calculateTotal('DaysAbove')}</TableCell>
                  <TableCell align="right" sx={{ fontWeight: 'bold' }}>{calculateTotal('ClosingBalance')}</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
        </div>
      </Box>
    );
  }

  // --- FORM VIEW ---
  return (
    <Box sx={{ p: 4, bgcolor: '#f5f5f5', minHeight: '100vh', display: 'flex', justifyContent: 'center' }}>
      <Paper elevation={2} sx={{ p: 4, width: '100%', maxWidth: 850 }}>
        <Typography variant="h6" sx={{ mb: 4, fontWeight: 'bold', color: '#1976d2' }}>
          Ageing Analysis - Amountwise
        </Typography>
        <Grid container spacing={4}>
          <Grid item xs={12} md={5}>
            <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 'bold' }}>Canvassor Name</Typography>
            <Paper variant="outlined" sx={{ height: 250, overflow: 'auto', p: 1 }}>
              <FormControlLabel
                control={<Checkbox size="small" checked={formData.canvassorName === "-"} onChange={() => setFormData({...formData, canvassorName: "-"})} />}
                label="-"
                sx={{ display: 'block', m: 0 }}
              />
              {masters.canvassors.map((item) => (
                <FormControlLabel
                  key={item.Id}
                  control={<Checkbox size="small" checked={formData.canvassorName === item.CanvassorName} onChange={() => setFormData({...formData, canvassorName: item.CanvassorName})} />}
                  label={<Typography variant="body2">{item.CanvassorName}</Typography>}
                  sx={{ display: 'block', m: 0 }}
                />
              ))}
            </Paper>
          </Grid>
          <Grid item xs={12} md={7}>
            <Stack spacing={3}>
              <Box>
                <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 'bold' }}>Account Group</Typography>
                <TextField select fullWidth size="small" value={formData.groupHead} onChange={(e) => setFormData({ ...formData, groupHead: e.target.value })}>
                  {masters.groups.map((g) => (
                    <MenuItem key={g.Id} value={g.GroupName}>{g.GroupName}</MenuItem>
                  ))}
                </TextField>
              </Box>
              <Box>
                <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 'bold' }}>As On Date</Typography>
                <TextField type="date" fullWidth size="small" value={formData.asOnDate} onChange={(e) => setFormData({ ...formData, asOnDate: e.target.value })} />
              </Box>
              <Divider sx={{ my: 1 }} />
              <Stack direction="row" spacing={2} justifyContent="flex-end">
                <Button variant="outlined" color="inherit" onClick={() => window.location.reload()}>Cancel</Button>
                <Button variant="contained" disabled={loading} onClick={generateReport}>
                  {loading ? <CircularProgress size={24} /> : "Show Report"}
                </Button>
              </Stack>
            </Stack>
          </Grid>
        </Grid>
      </Paper>
    </Box>
  );
}

export default Ageinganalysisamounwise;