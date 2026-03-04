import React, { useState, useEffect } from 'react';
import {
  Box, Typography, Select, MenuItem, Button, TextField, Table,
  TableBody, TableCell, TableContainer, TableHead, TableRow,
  Paper, Grid, FormControl, CircularProgress, Autocomplete
} from '@mui/material';

const DisplayLedger = () => {
  // Month grid layout matching the screenshot
  const monthGroups = [
    ["Apr", "May", "Jun", "Jul"],
    ["Aug", "Sep", "Oct", "Nov"],
    ["Dec", "Jan", "Feb", "Mar"]
  ];

  const [accounts, setAccounts] = useState([]);
  const [areas, setAreas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedGroup, setSelectedGroup] = useState('');
  const [selectedArea, setSelectedArea] = useState('');
  const [selectedAccount, setSelectedAccount] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [accRes, areaRes] = await Promise.all([
          fetch('https://publication.microtechsolutions.net.in/php/AccountGroupget.php'),
          fetch('https://publication.microtechsolutions.net.in/php/Areaget.php')
        ]);
        const accData = await accRes.json();
        const areaData = await areaRes.json();
        const rawAccounts = Array.isArray(accData) ? accData : (accData.data || []);
        
        const cleanedAccounts = rawAccounts.map(item => ({
          ...item,
          displayLabel: (item.GroupName || item.AccountName || item.Name || `Group ${item.Id}`).replace(/[\n\r]+/g, ' ').trim()
        }));

        setAccounts(cleanedAccounts);
        setAreas(Array.isArray(areaData) ? areaData : []);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <Box sx={{ p: 2, bgcolor: '#f5f5f5', minHeight: '100vh', fontFamily: 'sans-serif' }}>
      
      {/* 1. Top Header Controls */}
      <Paper variant="outlined" sx={{ p: 2, mb: 1 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={6}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <Typography sx={{ width: 120, fontWeight: 'bold', fontSize: '0.85rem' }}>Account Group</Typography>
              <FormControl fullWidth size="small">
                <Select 
                  value={selectedGroup} 
                  onChange={(e) => setSelectedGroup(e.target.value)}
                  sx={{ height: 28, fontSize: '0.8rem', bgcolor: 'white' }}
                  displayEmpty
                  MenuProps={{ PaperProps: { sx: { maxHeight: 300 } } }}
                >
                  <MenuItem value=""><em>-- Select Group --</em></MenuItem>
                  {accounts.map((group) => (
                    <MenuItem key={group.Id} value={group.Id} sx={{ fontSize: '0.8rem' }}>
                      {group.displayLabel}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>

            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Typography sx={{ width: 120, fontWeight: 'bold', fontSize: '0.85rem' }}>Area</Typography>
              <FormControl fullWidth size="small">
                <Select 
                  value={selectedArea} 
                  onChange={(e) => setSelectedArea(e.target.value)}
                  sx={{ height: 28, fontSize: '0.8rem', bgcolor: 'white' }}
                  displayEmpty
                >
                  <MenuItem value=""><em>-- Select Area --</em></MenuItem>
                  {areas.map((area) => (
                    <MenuItem key={area.Id} value={area.Id} sx={{ fontSize: '0.8rem' }}>
                      {area.AreaName}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>
          </Grid>

       <Grid item xs={2}>
  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
    <Button 
      variant="contained" 
      size="small" 
      sx={{ 
        height: 28, 
        width: 80,
        bgcolor: '#e1e1e1', // Classic grey
        color: 'black', 
        textTransform: 'none', 
        borderRadius: '2px', // Sharper corners
        border: '1px solid #707070', // Darker border for depth
        fontSize: '0.8rem',
        boxShadow: 'inset 0px 1px 0px #fff', // Subtle top highlight
        '&:hover': {
          bgcolor: '#d5d5d5',
          border: '1px solid #333',
        }
      }}
    >
      Ok
    </Button>
    <Button 
      variant="contained" 
      size="small" 
      sx={{ 
        height: 28, 
        width: 80,
        bgcolor: '#e1e1e1', 
        color: 'black', 
        textTransform: 'none', 
        borderRadius: '2px',
        border: '1px solid #707070',
        fontSize: '0.8rem',
        boxShadow: 'inset 0px 1px 0px #fff',
        '&:hover': {
          bgcolor: '#d5d5d5',
          border: '1px solid #333',
        }
      }}
    >
      Cancel
    </Button>
  </Box>
</Grid>

          <Grid item xs={4}>
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', mb: 1, gap: 1 }}>
              <Typography sx={{ fontWeight: 'bold', fontSize: '0.85rem' }}>Start Dt</Typography>
              <TextField defaultValue="01-04-25" size="small" inputProps={{ style: { padding: '4px', textAlign: 'center', width: '80px', fontSize: '0.8rem', bgcolor: 'white' } }} />
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: 1 }}>
              <Typography sx={{ fontWeight: 'bold', fontSize: '0.85rem' }}>End Dt</Typography>
              <TextField defaultValue="31-03-26" size="small" inputProps={{ style: { padding: '4px', textAlign: 'center', width: '80px', fontSize: '0.8rem', bgcolor: 'white' } }} />
            </Box>
          </Grid>
        </Grid>

        <Box sx={{ mt: 1.5, display: 'flex', alignItems: 'center' }}>
          <Typography sx={{ width: 120, fontWeight: 'bold', fontSize: '0.85rem' }}>Account Name</Typography>
          <Autocomplete
            fullWidth size="small"
            options={accounts}
            getOptionLabel={(option) => option.displayLabel || ""}
            value={selectedAccount}
            onChange={(event, newValue) => setSelectedAccount(newValue)}
            renderInput={(params) => <TextField {...params} variant="standard" placeholder="Search account..." />}
            sx={{ '& .MuiInput-root': { fontSize: '0.85rem' } }}
          />
        </Box>
      </Paper>

      {/* 2. Main Data Table */}
      <TableContainer component={Paper} variant="outlined" sx={{ height: 200, mb: 1, bgcolor: 'white' }}>
        <Table stickyHeader size="small">
          <TableHead>
            <TableRow sx={{ '& th': { borderRight: '1px solid #e0e0e0', fontWeight: 'bold', bgcolor: '#f0f0f0', fontSize: '0.75rem' } }}>
              <TableCell width="80">Date</TableCell>
              <TableCell width="80">Trans. Cd</TableCell>
              <TableCell>Particulars</TableCell>
              <TableCell align="right" width="100">Debit</TableCell>
              <TableCell align="right" width="100">Credit</TableCell>
              <TableCell align="right" width="100">Balance</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            <TableRow>
              <TableCell colSpan={6} align="center" sx={{ color: 'gray', py: 8 }}>
                {loading ? <CircularProgress size={20} /> : "No records to display"}
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>

      {/* 3. Bottom Monthly and Total Section */}
      <Grid container spacing={1}>
        {/* Monthly Summary Boxes */}
        <Grid item xs={8}>
          <Box sx={{ p: 1, border: '1px solid #ccc', bgcolor: '#fff' }}>
            {monthGroups.map((row, rowIndex) => (
              <Grid container spacing={1} key={rowIndex} sx={{ mb: rowIndex < 2 ? 1 : 0 }}>
                {row.map((month) => (
                  <Grid item xs={3} key={month}>
                    <Typography align="center" sx={{ fontSize: '0.7rem', fontWeight: 'bold', mb: 0.5 }}>{month}</Typography>
                    <Box sx={{ bgcolor: '#c8a2c8', height: 22, border: '1px solid #999' }} />
                  </Grid>
                ))}
              </Grid>
            ))}
          </Box>
        </Grid>

        {/* Totals Section */}
        <Grid item xs={4}>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Box sx={{ flex: 1 }}>
              <Typography sx={{ fontSize: '0.75rem', fontWeight: 'bold', bgcolor: '#c8a2c8', p: 0.5, border: '1px solid #999' }}>Debit Total</Typography>
              <Box sx={{ bgcolor: '#c8a2c8', height: 30, mt: 0.5, border: '1px solid #999', display: 'flex', alignItems: 'center', px: 1 }}>
                <Typography sx={{ fontWeight: 'bold' }}>0.00</Typography>
              </Box>
            </Box>
            <Box sx={{ flex: 1 }}>
              <Typography sx={{ fontSize: '0.75rem', fontWeight: 'bold', bgcolor: '#c8a2c8', p: 0.5, border: '1px solid #999' }}>Credit Total</Typography>
              <Box sx={{ bgcolor: '#c8a2c8', height: 30, mt: 0.5, border: '1px solid #999', display: 'flex', alignItems: 'center', px: 1 }}>
                <Typography sx={{ fontWeight: 'bold' }}>0.00</Typography>
              </Box>
            </Box>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default DisplayLedger;