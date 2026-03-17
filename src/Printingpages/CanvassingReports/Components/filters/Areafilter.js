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

const AreaFilter = ({ filters, setFilters }) => {
  const [areaList, setAreaList] = useState([]);
  const [loading, setLoading] = useState(true);



     const selectedIds = filters.areas || [];



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


  const handleToggle = (name) => {
   const nextSelected = selectedIds.includes(name)
     ? selectedIds.filter((n) => n !== name)
     : [...selectedIds, name];
   setFilters({ ...filters, areas: nextSelected });
};
 
  const handleSelectAll = (e) => {
const nextSelected = e.target.checked ? areaList.map((g) => g.BookGroupName) : [];
    setFilters({ ...filters, areas: nextSelected });
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
               checked={areaList.length > 0 && selectedIds.length === areaList.length}
               indeterminate={selectedIds.length > 0 && selectedIds.length < areaList.length}
               onChange={handleSelectAll} 
             />
           }
           label={<Typography sx={{ fontWeight: 'bold', fontSize: '0.9rem' }}>Select All Areas</Typography>}
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
             {areaList.map((area) => (
               <FormControlLabel
                 key={area.Id}
                 sx={{ margin: 0 }}
                 control={
                   <Checkbox 
                     size="small" 
                     checked={selectedIds.includes(area.Id)} 
                     onChange={() => handleToggle(area.Id)}
                   />
                 }
                 label={
                   <Typography 
                     variant="body2" 
                     sx={{ fontSize: '0.85rem', textTransform: 'uppercase' }}
                   >
                     {area.AreaName}
                   </Typography>
                 }
               />
             ))}
           </Stack>
         </Paper>
       </Box>
  );
};

export default AreaFilter;