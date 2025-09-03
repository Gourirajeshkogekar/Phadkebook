import React, { useState, useEffect } from "react";
import "./Navbar.css";
import { Menu, MenuItem, IconButton, Avatar, Typography } from "@mui/material";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";

const Navbar = ({ onLogout }) => {
  const Name = sessionStorage.getItem("Name") || "Guest";
  const [anchorEl, setAnchorEl] = useState(null);
  const [companyName, setCompanyName] = useState("");
  const getInitials = (name) => {
    const splitName = name.split(" ");
    return splitName.map((word) => word[0].toUpperCase()).join("");
  };

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const navigate = useNavigate();
  const handleLogout = (e) => {
    e.preventDefault();
    sessionStorage.clear();
    toast.success("User Logged Out");
    navigate("/login");
  };

  useEffect(() => {
    fetchCompanies();
  }, []);

  const fetchCompanies = async () => {
    try {
      const response = await axios.get(
        "https://publication.microtechsolutions.net.in/php/CompanyMasterget.php"
      );
      if (response.data.length > 0) {
        setCompanyName(response.data[0].CompanyName); // Assuming you want the first one
      }
    } catch (error) {
      console.error("Error fetching companies:", error);
    }
  };

  return (
    <nav className="navbar">
      <div className="navbar-content">
        <h3 className="navbar-title">Welcome To {companyName}</h3>

        <div className="user-info">
          {/* Display Full Name Outside the Dropdown */}

          <IconButton onClick={handleMenuOpen}>
            <Avatar
              sx={{
                backgroundColor: "#f8a828",
                color: "white",
                fontWeight: "bold",
                fontSize: "20px",
              }}>
              {getInitials(Name)}
            </Avatar>

            {/* <Typography
              sx={{
                marginRight: "10px",
                fontWeight: "bold",
                fontSize: "16px",
                color: "white",
              }}>
              {Name}
            </Typography> */}
            <ArrowDropDownIcon sx={{ color: "#fff", fontSize: "30px" }} />
          </IconButton>

          {/* Enlarged and Styled Dropdown Menu */}
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
            sx={{
              marginTop: "10px",
              "& .MuiPaper-root": {
                backgroundColor: "white", // White Background
                minWidth: "200px", // Make Menu Bigger
                padding: "10px", // Add Padding
                borderRadius: "10px", // Rounded Corners
                boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.2)", // Soft Shadow
              },
            }}>
            <MenuItem disabled sx={{ fontSize: "16px", fontWeight: "bold" }}>
              {Name} {/* Full Name Displayed */}
            </MenuItem>
            <MenuItem
              onClick={handleLogout}
              sx={{
                fontSize: "14px",
                color: "#d32f2f", // Red Logout Button
              }}>
              <ExitToAppIcon sx={{ marginRight: 1 }} />
              Logout
            </MenuItem>
          </Menu>
        </div>
      </div>
      <ToastContainer />
    </nav>
  );
};

export default Navbar;
