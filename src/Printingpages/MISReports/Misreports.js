import { useState } from "react";
import {
  Box,
  Paper,
  Typography,
  List,
  ListItemButton,
  ListItemText,
  Button,
  Stack,
  Divider, Grid
} from "@mui/material";

import MenuBookIcon from "@mui/icons-material/MenuBook";
import CategoryIcon from "@mui/icons-material/Category";
import AssessmentIcon from "@mui/icons-material/Assessment";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import EventIcon from "@mui/icons-material/Event";
import TagIcon from "@mui/icons-material/Tag";
import PeopleIcon from "@mui/icons-material/People";
import BusinessIcon from "@mui/icons-material/Business";
import AccountTreeIcon from "@mui/icons-material/AccountTree";

import CloseIcon from "@mui/icons-material/Close";

/* ================= REPORT COMPONENTS ================= */

import SalesPublicationSummary from "./SalesPublicationwisesummary/SalesPubwisesummary";
import BooksDetails from "./BooksDetails/Booksdetails";
import SalesBookwisePartywise from "../../Reports/StockReports/Salesbookwisepartywise";
import PartywiseSalesReceipt from "./PartywiseSalesandReceiptStmt/PartywisesalesandReceiptstmt";
/* ================= REPORT TYPES ================= */

const reportTypes = [
  "MIS Reports",
  "Sales Publicationwise Summary",
  "Sales Bookwise Partywise",
  "Partywise Sales & Receipt",
  "Books Details"
];

export default function MISReport() {

  const [activeReport, setActiveReport] =
    useState("MIS Reports");
   const [activeFilter, setActiveFilter] = useState("publication");
  /* ================= FILTER BUTTONS DYNAMIC ================= */

  const getFilters = () => {

    if (activeReport === "Sales Publicationwise Summary")
      return [
        { label: "Publication", icon: <MenuBookIcon /> },
        { label: "Period", icon: <EventIcon /> }
      ];

    if (activeReport === "Sales Bookwise Partywise")
      return [
        { label: "Publication", icon: <MenuBookIcon /> },
        { label: "Period", icon: <EventIcon /> },
        { label: "Book Code", icon: <TagIcon /> }
      ];

    if (activeReport === "Partywise Sales & Receipt")
      return [
        { label: "Period", icon: <EventIcon /> },
        { label: "City/District", icon: <BusinessIcon /> }
      ];

    if (activeReport === "Books Details")
      return [
        { label: "Period", icon: <EventIcon /> },
        { label: "Book Code", icon: <TagIcon /> }
      ];

    return [];
  };

  /* ================= RENDER RIGHT PANEL ================= */

  const renderReport = ( ) => {

    if (activeReport === "Sales Publicationwise Summary")
      return <SalesPublicationSummary />;

    if (activeReport === "Sales Bookwise Partywise")
return <SalesBookwisePartywise   />

    if (activeReport === "Partywise Sales & Receipt")
      return <PartywiseSalesReceipt />;

    if (activeReport === "Books Details")
      return <BooksDetails />;

    return (
      <Typography color="text.secondary" sx={{fontWeight:'bold'}}>
        Select a report to begin..
      </Typography>
    );
  };

  return (
   <Box sx={{ p: 2, bgcolor: "#f0f2f5", minHeight: "100vh" }}>
      <Typography variant="h5" fontWeight={700} mb={2} color="primary.main">
        MIS Report Panel
      </Typography>

      <Grid container spacing={2}>
        {/* LEFT PANEL */}
        <Grid item xs={12} md={3} lg={2.5}>
          <Paper elevation={0} sx={{ p: 2, borderRadius: 2, border: "1px solid #e0e0e0" }}>
            <Typography variant="subtitle2" fontWeight={700} mb={1} color="text.secondary">
              TYPE OF REPORT
            </Typography>
            <List dense sx={{ mb: 3 }}>
              {reportTypes.map((r) => (
                <ListItemButton
                  key={r}
                  selected={activeReport === r}
                  onClick={() => { setActiveReport(r); setActiveFilter("publication"); }}
                  sx={{ borderRadius: 1, mb: 0.5 }}
                >
                  <ListItemText primary={r} primaryTypographyProps={{ fontSize: 13, fontWeight: activeReport === r ? 700 : 500 }} />
                </ListItemButton>
              ))}
            </List>

            <Divider sx={{ mb: 2 }} />
            
            <Typography variant="subtitle2" fontWeight={700} mb={1} color="text.secondary">
              FILTERS
            </Typography>
            <Stack spacing={1}>
              {getFilters().map((btn) => (
                <Button
                  key={btn.id}
                  variant={activeFilter === btn.id ? "contained" : "outlined"}
                  size="small"
                  startIcon={btn.icon}
                  fullWidth
                  onClick={() => setActiveFilter(btn.id)}
                  sx={{ justifyContent: "flex-start", textTransform: 'none' }}
                >
                  {btn.label}
                </Button>
              ))}
            </Stack>
          </Paper>
        </Grid>

        {/* RIGHT PANEL - Report Content */}
        <Grid item xs={12} md={9} lg={9.5}>
          <Paper elevation={0} sx={{ p: 1, borderRadius: 2, minHeight: "70vh", border: "1px solid #e0e0e0" }}>
             {/* Pass activeFilter to children so they know what to show */}
             {renderReport(activeFilter)}
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}

