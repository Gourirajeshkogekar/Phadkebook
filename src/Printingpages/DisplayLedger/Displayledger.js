import React, { useState, useEffect } from 'react';
import {
  Box, Typography, Select, MenuItem, Button, TextField, Table,
  TableBody, TableCell, TableContainer, TableHead, TableRow,
  Paper, Grid, FormControl, CircularProgress, Autocomplete
} from '@mui/material';

const DisplayLedger = () => {
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

  // Data States for Integration
  const [totals, setTotals] = useState({ debit: 0, credit: 0 });
  const [monthlyTotals, setMonthlyTotals] = useState({});
  const [ledgerLoading, setLedgerLoading] = useState(false);
  const [transactions, setTransactions] = useState([]);

  // Date States
  const [fromDate, setFromDate] = useState("2025-04-01");
  const [toDate, setToDate] = useState("2026-03-31");

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

  const handleOkClick = async () => {
    try {
      setLedgerLoading(true);
      const params = new URLSearchParams({
        fromDate: fromDate,
        toDate: toDate,
        groupId: selectedGroup,
        area: selectedArea,
        accountId: selectedAccount?.Id || ''
      });

      const response = await fetch(`https://publication.microtechsolutions.net.in/php/get/getDisplayLedger.php?${params}`);
      const result = await response.json();

      if (result.success && result.data) {
        // 1. Map transactions from the API result
        const allTrans = result.data.flatMap(acc => acc.transactions || []);
        setTransactions(allTrans);

        // 2. Calculate Totals
        let dTotal = 0;
        let cTotal = 0;
        const monthMap = {};

        allTrans.forEach(t => {
          const d = parseFloat(t.Debit) || 0;
          const c = parseFloat(t.Credit) || 0;
          dTotal += d;
          cTotal += c;

          // 3. Group by Month for the purple boxes
          const mName = new Date(t.Date).toLocaleString('default', { month: 'short' });
          monthMap[mName] = (monthMap[mName] || 0) + (d - c);
        });

        setTotals({ debit: dTotal, credit: cTotal });
        setMonthlyTotals(monthMap);
      } else {
          setTransactions([]);
          setTotals({ debit: 0, credit: 0 });
          setMonthlyTotals({});
      }
    } catch (error) {
      console.error("Ledger Fetch Error:", error);
    } finally {
      setLedgerLoading(false);
    }
  };

  return (
    <Box sx={{ p:0.2,bgcolor: '#f5f5f5', minHeight: '90vh', fontFamily: 'sans-serif' }}>
      
      {/* 1. Top Header Controls */}
      <Paper variant="outlined" sx={{ p:0.2, mb: 1 }}>
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
                variant="contained" size="small" onClick={handleOkClick}
                sx={{ 
                  height: 28, width: 80, bgcolor: '#e1e1e1', color: 'black', textTransform: 'none', 
                  borderRadius: '2px', border: '1px solid #707070', fontSize: '0.8rem', boxShadow: 'inset 0px 1px 0px #fff',
                  '&:hover': { bgcolor: '#d5d5d5', border: '1px solid #333' }
                }}
              >
                {ledgerLoading ? <CircularProgress size={16} /> : "Ok"}
              </Button>
              <Button 
                variant="contained" size="small"
                sx={{ 
                  height: 28, width: 80, bgcolor: '#e1e1e1', color: 'black', textTransform: 'none', 
                  borderRadius: '2px', border: '1px solid #707070', fontSize: '0.8rem', boxShadow: 'inset 0px 1px 0px #fff'
                }}
              >
                Cancel
              </Button>
            </Box>
          </Grid>

          <Grid item xs={4}>
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', mb: 1, gap: 1 }}>
              <Typography sx={{ fontWeight: 'bold', fontSize: '0.85rem' }}>Start Dt</Typography>
              <TextField 
                value={fromDate} 
                onChange={(e) => setFromDate(e.target.value)}
                size="small" 
                inputProps={{ style: { padding: '4px', textAlign: 'center', width: '100px', fontSize: '0.8rem', bgcolor: 'white' } }} 
              />
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: 1 }}>
              <Typography sx={{ fontWeight: 'bold', fontSize: '0.85rem' }}>End Dt</Typography>
              <TextField 
                value={toDate} 
                onChange={(e) => setToDate(e.target.value)}
                size="small" 
                inputProps={{ style: { padding: '4px', textAlign: 'center', width: '100px', fontSize: '0.8rem', bgcolor: 'white' } }} 
              />
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

      {/* 2. Main Data Table - UPDATED TO SHOW DYNAMIC DATA */}
      <TableContainer component={Paper} variant="outlined" sx={{ height: 250, mb: 0.5, bgcolor: 'white' }}>
        <Table stickyHeader size="small">
          <TableHead>
            <TableRow sx={{ '& th': { borderRight: '1px solid #e0e0e0', fontWeight: 'bold', bgcolor: '#f0f0f0', fontSize: '0.75rem' } }}>
              <TableCell width="100">Date</TableCell>
              <TableCell width="100">Trans. Cd</TableCell>
              <TableCell>Particulars</TableCell>
              <TableCell align="right" width="100">Debit</TableCell>
              <TableCell align="right" width="100">Credit</TableCell>
              <TableCell align="right" width="100">Balance</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {transactions.length > 0 ? (
              transactions.map((row, index) => (
                <TableRow key={index} sx={{ '& td': { fontSize: '0.75rem', borderRight: '1px solid #f0f0f0' } }}>
                  <TableCell>{row.Date}</TableCell>
                  <TableCell>{row.TransCd}</TableCell>
                  <TableCell>{row.Particulars}</TableCell>
                  <TableCell align="right">{parseFloat(row.Debit).toFixed(2)}</TableCell>
                  <TableCell align="right">{parseFloat(row.Credit).toFixed(2)}</TableCell>
                  <TableCell align="right">{parseFloat(row.Balance).toFixed(2)}</TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} align="center" sx={{ color: 'gray', py: 8 }}>
                  {ledgerLoading ? <CircularProgress size={20} /> : "No records to display"}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* 3. Bottom Summary - UPDATED TO SHOW CALCULATED TOTALS */}
      <Grid container spacing={1}>
        <Grid item xs={8}>
          <Box sx={{ p: 1, border: '1px solid #ccc', bgcolor: '#fff' }}>
            {monthGroups.map((row, rowIndex) => (
              <Grid container spacing={1} key={rowIndex} sx={{ mb: rowIndex < 2 ? 1 : 0 }}>
                {row.map((month) => (
                  <Grid item xs={3} key={month}>
                    <Typography align="center" sx={{ fontSize: '0.7rem', fontWeight: 'bold', mb: 0.5 }}>{month}</Typography>
                    <Box sx={{ bgcolor: '#c8a2c8', height: 22, border: '1px solid #999', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Typography sx={{ fontSize: '0.7rem', fontWeight: 'bold' }}>
                        {monthlyTotals[month] ? monthlyTotals[month].toFixed(2) : ""}
                      </Typography>
                    </Box>
                  </Grid>
                ))}
              </Grid>
            ))}
          </Box>
        </Grid>

        <Grid item xs={4}>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Box sx={{ flex: 1 }}>
              <Typography sx={{ fontSize: '0.75rem', fontWeight: 'bold', bgcolor: '#c8a2c8', p: 0.5, border: '1px solid #999' }}>Debit Total</Typography>
              <Box sx={{ bgcolor: '#c8a2c8', height: 30, mt: 0.5, border: '1px solid #999', display: 'flex', alignItems: 'center', px: 1 }}>
                <Typography sx={{ fontWeight: 'bold' }}>{totals.debit.toFixed(2)}</Typography>
              </Box>
            </Box>
            <Box sx={{ flex: 1 }}>
              <Typography sx={{ fontSize: '0.75rem', fontWeight: 'bold', bgcolor: '#c8a2c8', p: 0.5, border: '1px solid #999' }}>Credit Total</Typography>
              <Box sx={{ bgcolor: '#c8a2c8', height: 30, mt: 0.5, border: '1px solid #999', display: 'flex', alignItems: 'center', px: 1 }}>
                <Typography sx={{ fontWeight: 'bold' }}>{totals.credit.toFixed(2)}</Typography>
              </Box>
            </Box>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default DisplayLedger;