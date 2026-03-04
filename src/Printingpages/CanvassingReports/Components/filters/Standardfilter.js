import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Checkbox, 
  FormControlLabel, 
  Grid, 
  Paper, 
  Typography, 
  CircularProgress 
} from '@mui/material';

const StandardFilter = ({ filters, setFilters }) => {
  const [standards, setStandards] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Safety check for selectedIds
  const selectedIds = filters.standards || [];

  // useEffect(() => {
  //     setFilters(prev => ({
  //       ...prev,
  //       standards: []  
  //     }));
  //   }, [setFilters]); 

  useEffect(() => {
    fetch('https://publication.microtechsolutions.net.in//php/Standardget.php')
      .then((res) => res.json())
      .then((data) => {
        // Filter out items with garbage characters or empty names if necessary
        const validData = data.filter(item => 
          item.StandardName && 
          !item.StandardName.includes('Ã') && // Removes rows with encoding issues
          item.StandardName.trim() !== ""
        );
        setStandards(validData);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Fetch error:", err);
        setLoading(false);
      });
  }, []);

  const handleCheckboxChange = (id) => {
    const nextSelected = selectedIds.includes(id)
      ? selectedIds.filter((item) => item !== id)
      : [...selectedIds, id];
    
    setFilters({ ...filters, standards: nextSelected });
  };

  const handleSelectAll = (e) => {
    // We map using the ID string since your JSON IDs are strings "2", "3", etc.
    const nextSelected = e.target.checked ? standards.map((s) => s.Id) : [];
    setFilters({ ...filters, standards: nextSelected });
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 400 }}>
        <CircularProgress size={30} />
      </Box>
    );
  }

  return (
    <Box sx={{ border: '1px solid #ccc', p: 1, borderRadius: 1 }}>


        <Typography variant="subtitle1" textAlign='center' fontWeight={600} gutterBottom>
      Standard Filter
          </Typography> 
      <FormControlLabel
        control={
          <Checkbox 
            size="small" 
            checked={selectedIds.length === standards.length && standards.length > 0}
            indeterminate={selectedIds.length > 0 && selectedIds.length < standards.length}
            onChange={handleSelectAll} 
          />
        }
        label={<Typography sx={{ fontWeight: 'bold', fontSize: '0.9rem' }}>Select All Standards</Typography>}
      />

      <Paper 
        variant="outlined" 
        sx={{ 
          height: 350, 
          overflowY: 'auto', 
          p: 1.5, 
          mt: 1, 
          bgcolor: '#fafafa' 
        }}
      >
        <Grid container spacing={0.5}>
          {standards.map((item) => (
            <Grid item xs={12} sm={6} key={item.Id}>
              <Box 
                sx={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: 0.5,
                  '&:hover': { bgcolor: '#f0f0f0', borderRadius: 1 } 
                }}
              >
                <Checkbox 
                  size="small" 
                  checked={selectedIds.includes(item.Id)} 
                  onChange={() => handleCheckboxChange(item.Id)} 
                />
                <Typography 
                  variant="body2" 
                  sx={{ 
                    fontSize: '0.82rem',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis'
                  }}
                >
                  {item.StandardName}
                </Typography>
              </Box>
            </Grid>
          ))}
        </Grid>
      </Paper>
    </Box>
  );
};

export default StandardFilter;