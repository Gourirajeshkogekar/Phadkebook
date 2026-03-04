import React, { useState, useMemo, useCallback, memo } from 'react';
import { Box, TextField, Checkbox, FormControlLabel, Paper, Grid, Typography, Divider } from '@mui/material';

// 1. Memoized Item: Only re-renders if 'isChecked' changes
const CheckboxItem = memo(({ item, isChecked, onToggle, labelKey, idKey }) => {
  return (
    <Grid item xs={12}>
      <FormControlLabel
        control={
          <Checkbox 
            size="small" 
            checked={isChecked} 
            onChange={() => onToggle(item[idKey])} 
          />
        }
        label={<Typography sx={{ fontSize: '0.85rem' }}>{item[labelKey]}</Typography>}
      />
    </Grid>
  );
}, (prev, next) => prev.isChecked === next.isChecked);

const MultiCheckboxList = ({ data = [], selectedItems = [], onUpdate, labelKey, idKey }) => {
  const [searchTerm, setSearchTerm] = useState('');

  // 2. Fast Search: Only filters when searchTerm or data changes
  const filteredData = useMemo(() => {
    if (!searchTerm) return data;
    return data.filter(item => 
      item[labelKey]?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [data, searchTerm, labelKey]);

  // 3. Fast Lookup: Using a Set makes checking 'isChecked' instant
  const selectedSet = useMemo(() => new Set(selectedItems), [selectedItems]);

 // Inside MultiCheckboxList.jsx

const handleToggle = useCallback((id) => {
  // We pass a function to onUpdate instead of a value
  onUpdate((prevSelected) => {
    const current = Array.isArray(prevSelected) ? prevSelected : [];
    if (current.includes(id)) {
      return current.filter(val => val !== id);
    } else {
      return [...current, id];
    }
  });
}, [onUpdate]); // REMOVE selectedItems and selectedSet from here!

 const handleSelectAll = (e) => {
    // Ensure selectedItems is treated as an array to prevent .filter or spread errors
    const currentSelected = Array.isArray(selectedItems) ? selectedItems : [];

    if (e.target.checked) {
      // Select only what is currently visible in the search
      const visibleIds = filteredData.map(item => item[idKey]);
      const uniqueNewSelection = Array.from(new Set([...currentSelected, ...visibleIds]));
      onUpdate(uniqueNewSelection);
    } else {
      // Unselect only what is currently visible
      const visibleIds = new Set(filteredData.map(item => item[idKey]));
      onUpdate(currentSelected.filter(id => !visibleIds.has(id)));
    }
  };

  return (
    <Box>
      {/* SEARCH BAR - Crucial for performance with 4800 items */}
      <TextField
        fullWidth
        size="small"
        placeholder="Search..."
        variant="outlined"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        sx={{ mb: 1, bgcolor: 'white' }}
      />

      <FormControlLabel
        control={
          <Checkbox 
            size="small"
            onChange={handleSelectAll}
            indeterminate={selectedItems.length > 0 && selectedItems.length < data.length}
          />
        }
        label={<Typography variant="caption">Select All (Filtered)</Typography>}
      />
      
      <Divider />

      <Paper variant="outlined" sx={{ height: 400, overflowY: 'auto', p: 1, mt: 1 }}>
        <Grid container>
          {filteredData.length > 0 ? (
            filteredData.map((item) => (
              <CheckboxItem
                key={item[idKey]}
                item={item}
                idKey={idKey}
                labelKey={labelKey}
                isChecked={selectedSet.has(item[idKey])}
                onToggle={handleToggle}
              />
            ))
          ) : (
            <Typography variant="body2" sx={{ p: 2, color: 'gray' }}>No results found</Typography>
          )}
        </Grid>
      </Paper>
    </Box>
  );
};

export default MultiCheckboxList;