import React, { useState, useEffect } from "react";
import {
  Box, Paper, Typography, Select, MenuItem,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Button, FormControl, InputLabel
} from "@mui/material";

const SubAccountAllocation = ({ onClose }) => {
  const [accountName, setAccountName] = useState("");
  const [data, setData] = useState([]);

  // Mock data - replace with your actual API call
  const handleFetchData = () => {
    // fetch(`your_api_url?account=${accountName}`)
    console.log("Fetching for:", accountName);
  };

  return (
    <Paper sx={{ p: 2, m: 1, border: "1px solid #ccc" }}>
      <Box display="flex" gap={2} alignItems="center" mb={2}>
        <FormControl size="small" sx={{ minWidth: 300 }}>
          <InputLabel>Account Name</InputLabel>
          <Select
            value={accountName}
            label="Account Name"
            onChange={(e) => setAccountName(e.target.value)}
          >

                        <MenuItem value="SHRI CHAMKIRE RAJARAM SHANKAR">SHRI CHAMKIRE RAJARAM SHANKAR</MenuItem>

            <MenuItem value="SHRI PHADKE MANDAR">SHRI PHADKE MANDAR</MenuItem>
            <MenuItem value="SHRI PHADKE M. V.">SHRI PHADKE M. V.</MenuItem>
          </Select>
        </FormControl>
        <Button variant="contained" onClick={handleFetchData}>Ok</Button>
        <Button variant="outlined" color="error" onClick={onClose}>Cancel</Button>
      </Box>

      <TableContainer component={Paper} sx={{ maxHeight: 400 }}>
        <Table stickyHeader size="small">
          <TableHead sx={{ bgcolor: "#eee" }}>
            <TableRow>
              <TableCell>Date</TableCell>
              <TableCell>Trans. Cd</TableCell>
              <TableCell>Particulars</TableCell>
              <TableCell>Debit</TableCell>
              <TableCell>Credit</TableCell>
              <TableCell>Balance</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {/* Map your data here */}
            <TableRow><TableCell colSpan={6} align="center">Select an account to view allocations</TableCell></TableRow>
          </TableBody>
        </Table>
      </TableContainer>
      
      <Box mt={2} display="flex" justifyContent="flex-end">
        <Button variant="contained" color="inherit" onClick={onClose}>Close</Button>
      </Box>
    </Paper>
  );
};

export default SubAccountAllocation;