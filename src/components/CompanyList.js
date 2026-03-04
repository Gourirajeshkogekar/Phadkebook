import React, { useEffect, useState } from "react";
import axios from "axios";
import { AppBar, Toolbar, Typography, Box, Button, CircularProgress } from "@mui/material";
import Select from "react-select";
import { useNavigate } from "react-router-dom";

function CompanyList() {
  const [companies, setCompanies] = useState([]);
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [loading, setLoading] = useState(true); // Added loading state
  const navigate = useNavigate();

  // 1. Fetch Companies from the new API
  const getCompanies = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        "https://publication.microtechsolutions.net.in/php/CompanyMasterget.php"
      );
      // Ensure the response is an array before setting state
      setCompanies(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.error("Error loading companies:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getCompanies();
  }, []);

  // 2. Handle Select - Using "Id" as per your API response
  const handleSelectChange = (selectedOption) => {
    const company = companies.find((c) => c.Id === selectedOption.value);
    setSelectedCompany(company);
    localStorage.setItem("SelectedCompany", JSON.stringify(company));
  };

  // 3. OK button
  const handleOkClick = () => {
    if (!selectedCompany) {
      alert("Please select a company");
      return;
    }
    navigate("/dashboard");
  };

  // 4. Logoff
  const handleLogoff = () => {
    localStorage.clear();
    sessionStorage.clear();
    navigate("/login");
  };

  // 5. Exit
  const handleExit = () => {
    navigate("/coverpage"); // Added leading slash for best practice
  };

  return (
    <Box
      sx={{
        textAlign: "center",
        p: 1,
        width: "100vw",
        background: "linear-gradient(to right, rgb(21, 110, 148), #2c5364)",
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <AppBar position="fixed">
        <Toolbar>
          <Typography variant="h6">Select Company</Typography>
        </Toolbar>
      </AppBar>

      <Box sx={{ width: "400px", backgroundColor: "white", p: 3, borderRadius: 2 }}>
        {loading ? (
          <CircularProgress />
        ) : (
          <>
            <Select
              options={companies.map((c) => ({
                value: c.Id, // API uses "Id"
                label: c.CompanyName, // API uses "CompanyName"
              }))}
              onChange={handleSelectChange}
              placeholder="Select Company"
              isSearchable
            />

            <Button
              variant="contained"
              color="primary"
              onClick={handleOkClick}
              sx={{ mt: 2, width: "150px" }}
            >
              OK
            </Button>
          </>
        )}
      </Box>

      {/* Footer Buttons */}
      <Box
        sx={{
          position: "fixed",
          bottom: 20,
          display: "flex",
          gap: 3,
        }}
      >
        <Button variant="contained" sx={{ bgcolor: "#1976d2" }} onClick={handleLogoff}>
          Logoff
        </Button>

        <Button variant="contained" color="error" onClick={handleExit}>
          Exit
        </Button>
      </Box>
    </Box>
  );
}

export default CompanyList;