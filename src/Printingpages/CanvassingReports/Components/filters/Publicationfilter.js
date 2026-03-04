import React, { useState, useEffect } from 'react';
import { Box, Typography, CircularProgress } from '@mui/material';
import MultiCheckboxList from '../MultiCheckboxList';

const PublicationFilter = ({ filters, setFilters }) => {
  const [pubList, setPublist] = useState([]);
  const [loading, setLoading] = useState(true);


  // useEffect(() => {
  //     setFilters(prev => ({
  //       ...prev,
  //       publications: []  
  //     }));
  //   }, [setFilters]); 

  useEffect(() => {
    fetch('https://publication.microtechsolutions.net.in/php/Publicationget.php')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setPublist(data);
        } else {
          setPublist([]);
        }
        setLoading(false);
      })
      .catch(err => {
        console.error("Publication fetch error:", err);
        setLoading(false);
      });
  }, []);

  if (loading) return <CircularProgress size={24} sx={{ m: 2 }} />;

  return (
    <Box sx={{ border: '1px solid #ccc', p: 1, borderRadius: 1 }}>
      <Typography variant="subtitle1" fontWeight="bold" sx={{ mb: 1, textAlign: 'center' }}>
        Publication Filter
      </Typography>

      <MultiCheckboxList 
        title="Publications"
        data={pubList}
        selectedItems={filters.publications || []} 
        onUpdate={(updateFn) => {
          setFilters(prev => ({
            ...prev,
            publications: typeof updateFn === 'function' ? updateFn(prev.publications) : updateFn
          }));
        }}
        labelKey="PublicationName" 
        idKey="Id" 
      />
    </Box>
  );
};

export default PublicationFilter;