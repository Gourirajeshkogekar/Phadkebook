import { Box, TextField, Typography, Button, Stack, Divider } from "@mui/material";
import { useState } from "react";
const PeriodFilter = ( ) => {


  // Helper function to get Financial Year
const getFYDates = () => {
  const today = new Date();
  const currentYear = today.getFullYear();
  const isAfterApril = today.getMonth() >= 3; // April is index 3
  
  const startYear = isAfterApril ? currentYear : currentYear - 1;
  const endYear = startYear + 1;

  return {
    start: `${startYear}-04-01`,
    end: `${endYear}-03-31`
  };
};

const fy = getFYDates();

const [filters, setFilters] = useState({
  // ... other filters
  startdate: fy.start, // Defaults to 2025-04-01
  enddate: fy.end,     // Defaults to 2026-03-31
});
  const handleResetFY = () => {
    const fy = getFYDates(); // use the helper from above
    setFilters({ ...filters, startdate: fy.start, enddate: fy.end });
  };

  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="subtitle1" textAlign='center' fontWeight={600} gutterBottom>
Period Filter      </Typography>

      <Stack direction="row" spacing={3} justifyContent="center" mt={3}>
        <Box>
          <Typography variant="body2" sx={{ fontWeight: 'bold', mb: 1 }}>Start Date:</Typography>
          <TextField
            type="date"
            size="small"
            value={filters?.startdate || ""}
            InputLabelProps={{ shrink: true }}
            onChange={(e) => setFilters({ ...filters, startdate: e.target.value })}
          />
        </Box>
        
        <Box>
          <Typography variant="body2" sx={{ fontWeight: 'bold', mb: 1 }}>End Date:</Typography>
          <TextField
            type="date"
            size="small"
            value={filters?.enddate || ""}
            InputLabelProps={{ shrink: true }}
            onChange={(e) => setFilters({ ...filters, enddate: e.target.value })}
          />
        </Box>
      </Stack>

      <Box display="flex" justifyContent="center" mt={3}>
        <Button size="small" variant="text" onClick={handleResetFY}>
          Reset to Financial Year
        </Button>
      </Box>
    </Box>
  );
};

export default PeriodFilter;
