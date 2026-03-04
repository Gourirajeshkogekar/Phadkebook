import React from "react";
import Drawer from "@mui/material/Drawer";
import PeriodFilter from "./filters/Periodfilter";
import AreaFilter from "./filters/Areafilter";
import Cityfilter from "./filters/Cityfilter";
import Publicationfilter from "./filters/Publicationfilter";
import Collegefilter from "./filters/Collegefilter";
import Canvassorfilter from "./filters/Canvassorfilter";
import Partyfilter from "./filters/Partyfilter";
import Standardfilter from "./filters/Standardfilter";
import Bookgroupfilter from "./filters/Bookgroupfilter";
import Bookselectionfilter from "./filters/Bookselectionfilter";
import { Box, Paper, Stack,Button, Divider,Typography } from "@mui/material";
import { useNavigate, useLocation } from "react-router-dom";

const ReportFiltersPanel = ({
  activeTab,
  filters,
  setFilters,
  onPrint,
  onExit,
}) => {
  const commonProps = { filters, setFilters, onPrint, onExit };



   const location = useLocation(); // Gets the current report URL
const navigate = useNavigate("");

 const handlePrint = () => {
    // Navigate to exactly where we are, but push the filters into state
    navigate(location.pathname, { 
      state: { 
        filters: filters, 
        printMode: true 
      } 
    });
  };

  const handleExit = () => {
    // Reset by navigating to the layout base without state
    navigate("/printing/canvassingreports", { state: null });
  };


  const getReportTitle = () => {
  const path = location.pathname.toLowerCase();

  const titles = {
    "canvlisting": "Canvassing Listing",
    "canvgroupwise": "Canvassing Groupwise",
    "canvbookwise": "Canvassing Bookwise",
    "canvbooksummary": "Canvassing Book Summary",
    "canvareawise": "Canvassing Areawise",
    "canvcollegewise": "Canvassing Collegewise",
    "canvareawisesummary": "Canvassing Area-wise Summary",
    "invcitywise": "Invoice City-wise Report",
    "invcitywisecross": "Invoice City-wise Cross  ",
    "canvspecimentotal": "Canvassing Specimen Total",
    "canvsummarycross": "Canvassing Summary Cross  ",
    "canvdistsummary": "Canvassing District Summary",
    "canvcollegewisesummarycross": "Canvassing Collegewise Summary Cross", // Longest one
    "canvcollegewisesummary": "Canvassing College-wise Summary",
    "accmasterlistingmobilenos": "Account Master Listing (Mobile Nos)",
    "canvexpenses": "Canvassing Expenses Detailed",
    "canvexpheadwisesummary": "Expense Head-wise Summary",
    "netsalecanvassing": "Net Sale Canvassing Report",
  };

  // FIX: Sort keys by length descending (longest string first)
  // This ensures "canvcollegewisesummarycross" matches before "canvcollegewise"
  const sortedKeys = Object.keys(titles).sort((a, b) => b.length - a.length);
  
  const match = sortedKeys.find((key) => path.includes(key));
  
  return match ? titles[match] : "Report Filter";
};

  const renderFilter = () => {
    switch (activeTab) {
      case "period":
        return <PeriodFilter {...commonProps} />;
      case "areas":
        return <AreaFilter {...commonProps} />;
      case "cities":
        return <Cityfilter {...commonProps} />;
      case "publications":
        return <Publicationfilter {...commonProps} />;
      case "colleges":
        return <Collegefilter {...commonProps} />;
      case "canvassors":
        return <Canvassorfilter {...commonProps} />;
      case "parties":
        return <Partyfilter {...commonProps} />;
      case "standards":
        return <Standardfilter {...commonProps} />;
      case "bookgroups":
        return <Bookgroupfilter {...commonProps} />;
      case "books":
        return <Bookselectionfilter {...commonProps} />;
      default:
        return null;
    }
  };

  return (
  <Paper 
    elevation={0} 
    sx={{ 
      width: '100%', // Let the parent Layout control the width (800px)
      p: 2, 
      height: "calc(100vh - 115px)", 
      display: 'flex', 
      flexDirection: 'column',
      border: 'none' // Remove extra borders
    }}
  >

    {/* ADD THIS HEADER SECTION */}
  <Typography 
  variant="h6" 
  sx={{ 
    color: '#1976d2', 
    fontWeight: '700', 
    textAlign: 'center', 
    textTransform: 'uppercase',
    fontSize: '1.1rem', // Slightly smaller if it's too long
    mb: 1
  }}
>
  {getReportTitle()}
</Typography>
    <Box sx={{ flexGrow: 1, overflowY: "auto" }}>
      {renderFilter()}
    </Box>
    
    <Divider sx={{ my: 2 }} />
    
    <Stack direction="row" spacing={2} justifyContent="center">
<Button variant="contained" onClick={handlePrint} sx={{ minWidth: 120 }}>Print
      </Button>
      <Button variant="outlined" color="error"  onClick={handleExit} sx={{ minWidth: 120 }}>
        Exit
      </Button>
    </Stack>
  </Paper>
  );
};

export default ReportFiltersPanel;


