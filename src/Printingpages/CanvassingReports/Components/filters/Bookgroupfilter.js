import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Checkbox, 
  FormControlLabel, 
  Paper, 
  Typography, 
  Stack, 
  CircularProgress 
} from '@mui/material';

const BookGroupFilter = ({ filters, setFilters }) => {
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  

  const selectedIds = filters.bookGroups || [];


 
  

  useEffect(() => {
    fetch('https://publication.microtechsolutions.net.in/php/BookGroupget.php')
      .then((res) => res.json())
      .then((data) => {
        // Data is the array of objects you provided
        setGroups(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching book groups:", err);
        setLoading(false);
      });
  }, []);

 // Inside BookGroupFilter handleToggle
const handleToggle = (name) => {
   const nextSelected = selectedIds.includes(name)
     ? selectedIds.filter((n) => n !== name)
     : [...selectedIds, name];
   setFilters({ ...filters, bookGroups: nextSelected });
};
 
  const handleSelectAll = (e) => {
const nextSelected = e.target.checked ? groups.map((g) => g.BookGroupName) : [];
    setFilters({ ...filters, bookGroups: nextSelected });
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
        <CircularProgress size={24} />
      </Box>
    );
  }

  return (
    <Box sx={{ border: '1px solid #ccc', p: 1, borderRadius: 1 }}>
               <Typography variant="subtitle1" textAlign='center' fontWeight={600} gutterBottom>
            BookGroup Filter
                </Typography> 
      <FormControlLabel
        control={
          <Checkbox 
            size="small" 
            checked={groups.length > 0 && selectedIds.length === groups.length}
            indeterminate={selectedIds.length > 0 && selectedIds.length < groups.length}
            onChange={handleSelectAll} 
          />
        }
        label={<Typography sx={{ fontWeight: 'bold', fontSize: '0.9rem' }}>Select All Book Groups</Typography>}
      />

      {/* Scrollable List Area */}
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
        <Stack spacing={0.5}>
          {groups.map((group) => (
            <FormControlLabel
              key={group.Id}
              sx={{ margin: 0 }}
              control={
                <Checkbox 
                  size="small" 
                  checked={selectedIds.includes(group.Id)} 
                  onChange={() => handleToggle(group.Id)}
                />
              }
              label={
                <Typography 
                  variant="body2" 
                  sx={{ fontSize: '0.85rem', textTransform: 'uppercase' }}
                >
                  {group.BookGroupName}
                </Typography>
              }
            />
          ))}
        </Stack>
      </Paper>
    </Box>
  );
};

export default BookGroupFilter;