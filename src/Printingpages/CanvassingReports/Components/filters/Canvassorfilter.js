import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { 
  Box, 
  Typography, 
  CircularProgress,
  Paper,
  Button
} from '@mui/material';
import MultiCheckboxList from '../MultiCheckboxList'; 

const CanvassorFilterMUI = ({ filters, setFilters }) => {
  const [canvassors, setCanvassors] = useState([]);
  const [loading, setLoading] = useState(true);




  // useEffect(() => {
  //     setFilters(prev => ({
  //       ...prev,
  //       canvassors: []  
  //     }));
  //   }, [setFilters]); 
  useEffect(() => {
    fetch('https://publication.microtechsolutions.net.in/php/get/getCanvassorMaster.php')
      .then((res) => res.json())
      .then((data) => {
        // Ensure data is an array
        setCanvassors(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Fetch error:", err);
        setLoading(false);
      });
  }, []);

  // Exit handler (optional - usually navigates back or closes modal)
  const handleExit = () => {
    window.history.back(); 
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 2 }}>
        <CircularProgress />
      </Box>
    );
  }

 // Inside CanvassorFilterMUI.jsx (and apply same logic to Standards/BookGroups)
return (
  <Box sx={{ p: 2, bgcolor: 'transparent' }}> {/* Remove 100vh and f5f5f5 */}
    <Paper
      elevation={0} // Elevation 0 or 1 looks cleaner inside a panel
      sx={{
        width: '100%', // Use 100% of the 800px provided by parent
        p: 2,
        borderRadius: 2,
        border: '1px solid #eee',
        bgcolor: '#fff',
      }}
    >
      <Typography
        variant="subtitle1"
        sx={{   fontWeight: 600, mb: 2, textAlign: 'center' }}
      >
        Canvassor Filter
      </Typography>

      <Box sx={{ border: '1px solid #ccc', p: 1, borderRadius: 1 }}>
        <MultiCheckboxList 
          title="Canvassors"
          data={canvassors}
          selectedItems={filters.canvassors || []} 
          onUpdate={(updateFn) => {
            setFilters(prev => ({
              ...prev,
              canvassors: typeof updateFn === 'function' ? updateFn(prev.canvassors) : updateFn
            }));
          }}
          labelKey="CanvassorName" 
          idKey="Id" 
        />
      </Box>
    </Paper>
  </Box>
);
};

export default CanvassorFilterMUI;