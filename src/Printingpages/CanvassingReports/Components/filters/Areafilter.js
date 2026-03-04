import React, { useState, useEffect } from 'react';
import { Box, Typography, CircularProgress } from '@mui/material';
import MultiCheckboxList from '../MultiCheckboxList';

const AreaFilter = ({ filters, setFilters }) => {
  const [areaList, setAreaList] = useState([]);
  const [loading, setLoading] = useState(true);



   


  useEffect(() => {
    fetch('https://publication.microtechsolutions.net.in/php/Areaget.php')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setAreaList(data);
        } else {
          setAreaList([]);
        }
        setLoading(false);
      })
      .catch(err => {
        console.error("Area fetch error:", err);
        setLoading(false);
      });
  }, []);

  if (loading) return <CircularProgress size={24} sx={{ m: 2 }} />;

  return (
    <Box sx={{ border: '1px solid #ccc', p: 1, borderRadius: 1 }}>
      <Typography variant="subtitle1" fontWeight="bold" sx={{ mb: 1, textAlign: 'center' }}>
        Area Filter
      </Typography>

      <MultiCheckboxList 
        title="Areas"
        data={areaList}
        selectedItems={filters.areas || []} 
        onUpdate={(updateFn) => {
          setFilters(prev => ({
            ...prev,
            areas: typeof updateFn === 'function' ? updateFn(prev.areas) : updateFn
          }));
        }}
        labelKey="AreaName" 
        idKey="Id" 
      />
    </Box>
  );
};

export default AreaFilter;