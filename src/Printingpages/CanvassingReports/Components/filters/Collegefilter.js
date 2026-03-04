import React, { useState, useEffect } from 'react';
import { Box, Typography, CircularProgress } from '@mui/material';
import MultiCheckboxList from '../MultiCheckboxList';

// 1. Create a cache outside the component
let cachedColleges = null;

const CollegeFilter = ({ filters, setFilters }) => {
  const [collegeList, setCollegeList] = useState(cachedColleges || []);
  const [loading, setLoading] = useState(!cachedColleges);


  // useEffect(() => {
  //     setFilters(prev => ({
  //       ...prev,
  //       collegeList: []  
  //     }));
  //   }, [setFilters]); 

  useEffect(() => {
    // 2. If we already have data, don't fetch again
    if (cachedColleges) {
      setLoading(false);
      return;
    }

    fetch('https://publication.microtechsolutions.net.in/php/Collegeget.php')
      .then(res => res.json())
      .then(jsonResponse => {
        if (jsonResponse.success && Array.isArray(jsonResponse.data)) {
          cachedColleges = jsonResponse.data; // Store in cache
          setCollegeList(jsonResponse.data);
        } else {
          setCollegeList([]);
        }
        setLoading(false);
      })
      .catch(err => {
        console.error("College fetch error:", err);
        setLoading(false);
      });
  }, []);

  if (loading) return (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', p: 4 }}>
       <CircularProgress size={30} sx={{ mb: 2 }} />
       <Typography variant="caption">Loading 4,800+ Colleges...</Typography>
    </Box>
  );

  return (
    <Box sx={{ border: '1px solid #ccc', p: 1, borderRadius: 1 }}>
      <Typography variant="subtitle1" fontWeight="bold" sx={{ mb: 1, textAlign: 'center' }}>
        College Filter
      </Typography>

      <MultiCheckboxList 
        title="Colleges"
        data={collegeList}
        selectedItems={filters.colleges || []} 
        onUpdate={(updateFn) => {
          setFilters(prev => ({
            ...prev,
            colleges: typeof updateFn === 'function' ? updateFn(prev.colleges) : updateFn
          }));
        }}
        labelKey="CollegeName" 
        idKey="Id" 
      />
    </Box>
  );
};

export default CollegeFilter;