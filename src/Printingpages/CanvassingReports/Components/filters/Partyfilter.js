import React, { useState, useEffect } from 'react';
import { Box, Typography, CircularProgress } from '@mui/material';
import MultiCheckboxList from '../MultiCheckboxList';

const Partyfilter = ({ filters, setFilters }) => {
  const [accountList, setAccountlist] = useState([]);
  const [loading, setLoading] = useState(true);


  // useEffect(() => {
  //     setFilters(prev => ({
  //       ...prev,
  //       accountList: []  
  //     }));
  //   }, [setFilters]); 

    
  useEffect(() => {
    fetch('https://publication.microtechsolutions.net.in/php/Accountget.php')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setAccountlist(data);
        } else {
          setAccountlist([]);
        }
        setLoading(false);
      })
      .catch(err => {
        console.error("Account fetch error:", err);
        setLoading(false);
      });
  }, []);

  if (loading) return <CircularProgress size={24} sx={{ m: 2 }} />;

  return (
    <Box sx={{ border: '1px solid #ccc', p: 1, borderRadius: 1 }}>
      <Typography variant="subtitle1" fontWeight="bold" sx={{ mb: 1, textAlign: 'center' }}>
        Party/Account Filter
      </Typography>

      <MultiCheckboxList 
        title="Accounts"
        data={accountList}
        selectedItems={filters.accounts || []} 
        onUpdate={(updateFn) => {
          setFilters(prev => ({
            ...prev,
            accounts: typeof updateFn === 'function' ? updateFn(prev.accounts) : updateFn
          }));
        }}
        labelKey="AccountName" 
        idKey="Id" 
      />
    </Box>
  );
};

export default Partyfilter;