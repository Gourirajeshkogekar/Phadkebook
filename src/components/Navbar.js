import React, { useState, useEffect } from "react";
import "./Navbar.css";
import { Menu, MenuItem, IconButton, Avatar, Typography, Box, Chip, Divider } from "@mui/material";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import BusinessIcon from "@mui/icons-material/Business"; // New Icon
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";

const Navbar = () => {
  const userName = sessionStorage.getItem("Name") || "Guest";
  const [anchorEl, setAnchorEl] = useState(null);
  const [company, setCompany] = useState(null);

  const navigate = useNavigate();

  const getInitials = (name) => {
    if (!name) return "G";
    const splitName = name.trim().split(" ");
    return splitName.length > 1 
      ? (splitName[0][0] + splitName[1][0]).toUpperCase() 
      : splitName[0][0].toUpperCase();
  };

  useEffect(() => {
    const selected = localStorage.getItem("SelectedCompany");
    if (selected) {
      try {
        setCompany(JSON.parse(selected));
      } catch (e) {
        console.error("Data error", e);
      }
    }
  }, []);

  const handleMenuOpen = (event) => setAnchorEl(event.currentTarget);
  const handleMenuClose = () => setAnchorEl(null);

  const handleLogout = () => {
    sessionStorage.clear();
    localStorage.removeItem("SelectedCompany");
    toast.success("User Logged Out");
    navigate("/login");
  };

  return (
    <nav className="navbar" style={{ background: '#156e94', padding: '10px 20px', boxShadow: '0 2px 10px rgba(0,0,0,0.1)' }}>
      <div className="navbar-content" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        
        {/* LEFT SIDE: Company Identity */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <BusinessIcon sx={{ color: '#f8a828' }} />
          <Box>
            <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.7)', display: 'block', lineHeight: 1 }}>
              ACTIVE COMPANY
            </Typography>
            <Typography variant="h6" sx={{ color: 'white', fontWeight: 'bold', fontSize: '1.1rem' }}>
              {company ? company.CompanyName : "Select Company"}
            </Typography>
          </Box>
          {/* Optional: Add a Badge for the City if available in your API */}
          {company?.Address1 && (
            <Chip 
              label={company.Address1} 
              size="small" 
              sx={{ bgcolor: 'rgba(255,255,255,0.2)', color: 'white', ml: 1, height: '20px', fontSize: '10px' }} 
            />
          )}
        </Box>

        {/* RIGHT SIDE: User Actions */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Box sx={{ textAlign: 'right', display: { xs: 'none', sm: 'block' } }}>
            <Typography sx={{ color: 'white', fontWeight: '600', fontSize: '0.9rem' }}>
              {userName}
            </Typography>
            <Typography variant="caption" sx={{ color: '#f8a828', display: 'block' }}>
              Administrator
            </Typography>
          </Box>
          
          <IconButton onClick={handleMenuOpen} sx={{ p: 0 }}>
            <Avatar
              sx={{
                bgcolor: "#f8a828",
                width: 40,
                height: 40,
                border: '2px solid rgba(255,255,255,0.3)'
              }}>
              {getInitials(userName)}
            </Avatar>
            <ArrowDropDownIcon sx={{ color: "#fff" }} />
          </IconButton>

          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
            PaperProps={{ sx: { width: '200px', mt: 1 } }}
          >
            <Box sx={{ px: 2, py: 1 }}>
              <Typography variant="subtitle2">User Profile</Typography>
              <Typography variant="caption" color="textSecondary">{userName}</Typography>
            </Box>
            <Divider />
            
            <MenuItem onClick={() => navigate("/companylist")}>
               🔄 Switch Company
            </MenuItem>
            
            {/* <MenuItem onClick={() => navigate("/settings/companymaster")}>
               👤 My Profile
            </MenuItem> */}
            
            <Divider />
            
            <MenuItem onClick={handleLogout} sx={{ color: 'error.main' }}>
              <ExitToAppIcon sx={{ mr: 1, fontSize: '20px' }} /> Logout
            </MenuItem>
          </Menu>
        </Box>
      </div>
      <ToastContainer />
    </nav>
  );
};

export default Navbar;