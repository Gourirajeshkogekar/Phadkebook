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
  
  // Updated state to track IDs/Codes for the API
  const [formData, setFormData] = useState({
    canvassorId: "0", // Default to 0 or "-"
    groupCode: "",
    groupName: "", // For display in report
    asOnDate: new Date().toISOString().split('T')[0],
  });

  const [reportData, setReportData] = useState([]);
  const [summary, setSummary] = useState({ grand_total: "0.00", op_balance_total: "0.00" });
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
        
        const canData = Array.isArray(canResponse.data) ? canResponse.data : [];
        const groupData = Array.isArray(groupResponse.data) ? groupResponse.data : [];

        setMasters({ canvassors: canData, groups: groupData });

        if (groupData.length > 0) {
          setFormData(prev => ({ 
            ...prev, 
            groupCode: groupData[0].GroupCode, // Store the code for API
            groupName: groupData[0].GroupName   // Store name for UI
          }));
        }
      } catch (error) {
        console.error("Error fetching masters:", error);
      }
    };
    fetchMasters();
  }, []);

  // INTEGRATED API CALL
  const generateReport = async () => {
    setLoading(true);
    try {
      const response = await axios.get('https://publication.microtechsolutions.net.in/php/get/getAgeingAnalysisAmountwise.php', {
        params: {
          asondate: formData.asOnDate,
          accountgroupcode: formData.groupCode,
          canvassorid: formData.canvassorId
        }
      });

      // Map the API data
      if (response.data) {
        setReportData(response.data.data || []);
        setSummary(response.data.summary || { grand_total: "0.00", op_balance_total: "0.00" });
        setView('report');
      }
    } catch (error) {
      alert("Error fetching report data");
      console.error("API Error:", error);
    } finally {
      setLoading(false);
    }
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

  if (view === 'report') {
    return (
      <Box sx={{ p: 2, bgcolor: 'white', minHeight: '100vh' }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2, "@media print": { display: "none" } }}>
          <Button startIcon={<ArrowBack />} onClick={() => setView('form')} variant="outlined">BACK</Button>
          <Stack direction="row" spacing={1}>
            <Button startIcon={<Print />} onClick={handlePrint} variant="outlined" disabled={printing}>
               {printing ? "PROCESSING..." : "PRINT"}
            </Button>
            <Button startIcon={<Print />} onClick={handlePrintPDF} variant="contained">SAVE PDF</Button>
          </Stack>
        </Box>

        <div ref={reportRef} style={{ padding: '10px' }}>
          <Box sx={{ textAlign: 'center', mb: 3 }}>
            <Typography variant="h5" sx={{ fontWeight: 'bold' }}>PHADKE BOOK HOUSE</Typography>
            <Typography variant="body1">Ageing Analysis - Amountwise</Typography>
            <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
              {formData.groupName} As on {new Date(formData.asOnDate).toLocaleDateString('en-GB')}
            </Typography>
          </Box>

          <TableContainer>
            <Table size="small" sx={{ 
                border: '1px solid black',
                "& td, & th": { border: "1px solid black", px: 1, py: 0.8, fontSize: '12px' } 
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
                {reportData.length > 0 ? reportData.map((row, index) => (
                  <TableRow key={index}>
                    <TableCell>{index + 1}. {row["Name of Party"]}</TableCell>
                    <TableCell align="right">{row["Op. Balance"]}</TableCell>
                    <TableCell align="right">{row["1 to 30 Days"]}</TableCell>
                    <TableCell align="right">{row["31 to 60 Days"]}</TableCell>
                    <TableCell align="right">{row["61 to 90 Days"]}</TableCell>
                    <TableCell align="right">{row["Above 91 Days"]}</TableCell>
                    <TableCell align="right" sx={{ fontWeight: 'bold' }}>{row["Closing Bal."]}</TableCell>
                  </TableRow>
                )) : (
                  <TableRow>
                    <TableCell colSpan={7} align="center">No Records Found</TableCell>
                  </TableRow>
                )}

                <TableRow sx={{ bgcolor: '#f9f9f9' }}>
                  <TableCell align="right" sx={{ fontWeight: 'bold' }}>Total</TableCell>
                  <TableCell align="right" sx={{ fontWeight: 'bold' }}>{summary.op_balance_total}</TableCell>
                  <TableCell align="right" sx={{ fontWeight: 'bold' }}>-</TableCell>
                  <TableCell align="right" sx={{ fontWeight: 'bold' }}>-</TableCell>
                  <TableCell align="right" sx={{ fontWeight: 'bold' }}>-</TableCell>
                  <TableCell align="right" sx={{ fontWeight: 'bold' }}>-</TableCell>
                  <TableCell align="right" sx={{ fontWeight: 'bold' }}>{summary.grand_total}</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
        </div>
      </Box>
    );
  }

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
                control={
                  <Checkbox 
                    size="small" 
                    checked={formData.canvassorId === "0"} 
                    onChange={() => setFormData({...formData, canvassorId: "0"})} 
                  />
                }
                label="-"
                sx={{ display: 'block', m: 0 }}
              />
              {masters.canvassors.map((item) => (
                <FormControlLabel
                  key={item.Id}
                  control={
                    <Checkbox 
                      size="small" 
                      checked={formData.canvassorId === item.Id} 
                      onChange={() => setFormData({...formData, canvassorId: item.Id})} 
                    />
                  }
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
                <TextField 
                  select fullWidth size="small" 
                  value={formData.groupCode} 
                  onChange={(e) => {
                    const selectedGroup = masters.groups.find(g => g.GroupCode === e.target.value);
                    setFormData({ 
                      ...formData, 
                      groupCode: e.target.value, 
                      groupName: selectedGroup ? selectedGroup.GroupName : "" 
                    });
                  }}
                >
                  {masters.groups.map((g) => (
                    <MenuItem key={g.Id} value={g.GroupCode}>{g.GroupName}</MenuItem>
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