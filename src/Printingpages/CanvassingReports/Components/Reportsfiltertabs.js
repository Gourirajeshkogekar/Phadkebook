import React from "react";
import { Tabs, Tab, Box } from "@mui/material";

const ReportFilterTabs = ({ value, onChange }) => {
  return (
    <Box sx={{ 
      borderRight: 1, 
      borderColor: 'divider', 
      bgcolor: '#f5f5f5', 
      minWidth: '160px' // Ensures sidebar doesn't shrink
    }}>
      <Tabs
        orientation="vertical"
        value={value}
        onChange={onChange}
        variant="scrollable"
        sx={{
          '& .MuiTab-root': { 
            fontSize: '0.75rem', 
            textAlign: 'left',
            alignItems: 'flex-start',
            minHeight: '45px',
            fontWeight: 500,
            color: '#555',
            '&.Mui-selected': { color: '#1976d2', bgcolor: '#e3f2fd' }
          }
        }}
      >
        <Tab label="AREAS" value="areas" />
        <Tab label="CITY/DISTRICT" value="cities" />
        <Tab label="PUBLICATIONS" value="publications" />
        <Tab label="COLLEGES" value="colleges" />
        <Tab label="CANVASSOR" value="canvassors" />
        <Tab label="PERIOD" value="period" />
        <Tab label="PARTY/ACCOUNTS" value="parties" />
        <Tab label="STANDARDS" value="standards" />
        <Tab label="BOOK GROUPS" value="bookgroups" />
        <Tab label="BOOKS SELECTION" value="books" />
      </Tabs>
    </Box>
  );
};

export default ReportFilterTabs;