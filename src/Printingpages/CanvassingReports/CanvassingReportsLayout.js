import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { Box } from '@mui/material';
import { useState } from "react";
import ReportFilterTabs from "./Components/Reportsfiltertabs";
import ReportFiltersPanel from "./Components/Reportsfilterdrawer";

export default function CanvassingReportsLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Detect if we are in print preview mode
  const isPrintMode = location.state?.printMode;

  const [filters, setFilters] = useState({
    startdate: "",
    enddate: "",
    // ... add other filter keys as needed
  });
  const [activeTab, setActiveTab] = useState("period");

 

// inside CanvassingReportsLayout.js

return (
  <Box sx={{ display: 'flex', width: '100%', height: '100vh', bgcolor: '#f5f5f5' }}>
    
    {/* 1. SIDEBAR AREA (Filters) */}
    {!isPrintMode && (
      <Box sx={{ display: 'flex', bgcolor: 'white', borderRight: '1px solid #ddd' }}>
        <ReportFilterTabs value={activeTab} onChange={(e, val) => setActiveTab(val)} />
        <Box sx={{ width: 800 }}> 
          <ReportFiltersPanel 
            activeTab={activeTab} 
            filters={filters} 
            setFilters={setFilters} 
          />
        </Box>
      </Box>
    )}

    {/* 2. REPORT AREA (The Outlet) */}
    <Box 
      sx={{ 
        flexGrow: 1, 
        bgcolor: 'white', 
        overflowY: 'auto',
        /* This is the key: if printing, show it. If filtering, hide it completely. */
        display: isPrintMode ? 'block' : 'none',
        height: '100vh',
        width: '100%'
      }}
    >
      <Outlet context={{ filters }} />
    </Box>
  </Box>
);
}