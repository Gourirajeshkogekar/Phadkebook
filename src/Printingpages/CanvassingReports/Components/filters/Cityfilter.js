import React, { useState, useEffect } from 'react';
import { Box, Typography, CircularProgress } from '@mui/material';
import MultiCheckboxList from '../MultiCheckboxList';

const CityFilter = ({ filters, setFilters }) => {
  const [cityList, setCitylist] = useState([]);
  const [loading, setLoading] = useState(true);


  // // 1. THIS IS THE RESET LOGIC
  // useEffect(() => {
  //   setFilters(prev => ({
  //     ...prev,
  //     cities: []  
  //   }));
  // }, [setFilters]);  

  useEffect(() => {
    fetch('https://publication.microtechsolutions.net.in/php/Cityget.php')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setCitylist(data);
        } else {
          setCitylist([]);
        }
        setLoading(false);
      })
      .catch(err => {
        console.error("City fetch error:", err);
        setLoading(false);
      });
  }, []);

  if (loading) return <CircularProgress size={24} sx={{ m: 2 }} />;

  return (
    <Box sx={{ border: '1px solid #ccc', p: 1, borderRadius: 1 }}>
      <Typography variant="subtitle1" fontWeight="bold" sx={{ mb: 1, textAlign: 'center' }}>
        City Filter
      </Typography>

      <MultiCheckboxList 
        title="Cities"
        data={cityList}
        selectedItems={filters.cities || []} 
        onUpdate={(updateFn) => {
          setFilters(prev => ({
            ...prev,
            cities: typeof updateFn === 'function' ? updateFn(prev.cities) : updateFn
          }));
        }}
        labelKey="CityName" 
        idKey="Id" 
      />
    </Box>
  );
};

export default CityFilter;