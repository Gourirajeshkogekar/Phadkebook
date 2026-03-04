import React, { useState } from "react";
import {
  AppBar,
  Toolbar,
  Button,
  Menu,
  MenuItem,
  Box,
  Avatar,
  IconButton,
  Divider,
  ThemeProvider,
  createTheme,
} from "@mui/material";

import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import LightModeIcon from "@mui/icons-material/LightMode";
import DarkModeIcon from "@mui/icons-material/DarkMode";

import HomeIcon from "@mui/icons-material/Home";
import DashboardIcon from "@mui/icons-material/Dashboard";
import MenuBookIcon from "@mui/icons-material/MenuBook";
import PrintIcon from "@mui/icons-material/Print";
import SettingsIcon from "@mui/icons-material/Settings";
import ReportIcon from "@mui/icons-material/Assessment";

import { useNavigate, Outlet } from "react-router-dom";

/* ICONS */
const defaultIcons = {
  Home: <HomeIcon />,
  Dashboard: <DashboardIcon />,
  Masters: <MenuBookIcon />,
  Transactions: <MenuBookIcon />,
  Printing: <PrintIcon />,
  Settings: <SettingsIcon />,
  Reports: <ReportIcon />,
  Royalty: <MenuBookIcon />,
};

/* =====================================================
    RECURSIVE SUBMENU COMPONENT (CLICK TO OPEN)
===================================================== */
const SubMenu = ({ anchorEl, open, onClose, items, navigate }) => {
  const [childAnchor, setChildAnchor] = useState(null);
  const [childItems, setChildItems] = useState([]);

  const handleOpenChild = (event, sub) => {
    if (!sub.submenus) return navigate(sub.path);
    setChildItems(sub.submenus);
    setChildAnchor(event.currentTarget);
  };

  const handleCloseChild = () => {
    setChildAnchor(null);
    setChildItems([]);
  };

  return (
    <>
      {/* LEVEL-1 */}
      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={onClose}
        PaperProps={{ sx: { ml: 2, minWidth: 250, borderRadius: 1 } }}
        anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
        transformOrigin={{ vertical: "top", horizontal: "left" }}>
        {items.map((sub, idx) => (
          <MenuItem
            key={idx}
            onClick={(e) => handleOpenChild(e, sub)}
            sx={{
              display: "flex",
              justifyContent: "space-between",
              gap: 3,
            }}>
            {sub.title}
            {sub.submenus && <ChevronRightIcon fontSize="small" />}
          </MenuItem>
        ))}
      </Menu>

      {/* LEVEL-2 and LEVEL-3 */}
      {childItems.length > 0 && (
        <SubMenu
          anchorEl={childAnchor}
          open={Boolean(childAnchor)}
          onClose={handleCloseChild}
          items={childItems}
          navigate={navigate}
        />
      )}
    </>
  );
};

/* =====================================================
               TOP MENU BAR (CLICK-ONLY)
===================================================== */
const TopMenuBar = ({ menuItems }) => {
  const navigate = useNavigate();

  const [anchorEl, setAnchorEl] = useState(null);
  const [submenuItems, setSubmenuItems] = useState([]);

  const [darkMode, setDarkMode] = useState(false);

  const theme = createTheme({
    palette: {
      mode: darkMode ? "dark" : "light",
      primary: { main: "#0a60bd" },
    },
  });

  const openMainMenu = (e, item) => {
    if (!item.submenus) {
      navigate(item.path);
      return;
    }
    setAnchorEl(e.currentTarget);
    setSubmenuItems(item.submenus);
  };

  const closeMainMenu = () => {
    setAnchorEl(null);
    setSubmenuItems([]);
  };

  return (
    <ThemeProvider theme={theme}>
      <AppBar position="fixed" color="primary" sx={{ zIndex: 1200 }}>
        <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
          {/* LEFT SIDE MENU */}
          <Box sx={{ display: "flex", gap: 2 }}>
            {menuItems.map((item, i) => (
              <Button
                key={i}
                onClick={(e) => openMainMenu(e, item)} // CLICK ONLY
                sx={{
                  color: "white",
                  fontSize: "16px",
                  textTransform: "none",
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                }}
                endIcon={item.submenus ? <ExpandMoreIcon /> : null}>
                {defaultIcons[item.title] || null}
                {item.title}
              </Button>
            ))}

            {/* FIRST DROPDOWN */}
            {submenuItems.length > 0 && (
              <SubMenu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={closeMainMenu}
                items={submenuItems}
                navigate={navigate}
              />
            )}
          </Box>

          {/* RIGHT SIDE */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <IconButton
              sx={{ color: "white" }}
              onClick={() => setDarkMode(!darkMode)}>
              {darkMode ? <LightModeIcon /> : <DarkModeIcon />}
            </IconButton>

            <ProfileMenu />
          </Box>
        </Toolbar>
      </AppBar>

      <Box sx={{ mt: "80px", p: 2 }}>
        <Outlet />
      </Box>
    </ThemeProvider>
  );
};

/* =====================================================
                 PROFILE MENU
===================================================== */
const ProfileMenu = () => {
  const [anchor, setAnchor] = useState(null);

  return (
    <>
      <Avatar
        sx={{ bgcolor: "orange", cursor: "pointer" }}
        onClick={(e) => setAnchor(e.currentTarget)}>
        G
      </Avatar>

      <Menu
        anchorEl={anchor}
        open={Boolean(anchor)}
        onClose={() => setAnchor(null)}>
        <MenuItem>Profile</MenuItem>
        <Divider />
        <MenuItem>Logout</MenuItem>
      </Menu>
    </>
  );
};

export default TopMenuBar;
