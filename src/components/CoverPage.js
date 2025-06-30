import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Box, Button } from "@mui/material";
import Select from "react-select";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import dayjs from "dayjs";

function CoverPage() {
  const [FromDate, setFromDate] = useState(dayjs()); // Default to today's date
  const [ToDate, setToDate] = useState(dayjs()); // Default to today's date
  const [years, setYears] = useState([]); // List of years for the dropdown
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // Fetch date ranges from API
  const fetchDateRange = async () => {
    try {
      const response = await axios.get(
        "https://publication.microtechsolutions.net.in/php/Yearsget.php"
      );
      setYears(response.data);
    } catch (error) {
      toast.error("Error fetching Years:", error);
    }
  };

  useEffect(() => {
    fetchDateRange();
  }, []);

  const handleSelectChange = (selectedOption) => {
    const selectedYear = years.find((year) => year.Id === selectedOption.value);
    console.log(selectedYear, "selected year");

    if (selectedYear) {
      const from = dayjs(selectedYear.FromDate.date);
      const to = dayjs(selectedYear.ToDate.date);

      setFromDate(from);
      setToDate(to);

      // Set in sessionStorage
      sessionStorage.setItem("FromDate", from.format("YYYY-MM-DD"));
      sessionStorage.setItem("ToDate", to.format("YYYY-MM-DD"));
      sessionStorage.setItem("YearId", selectedYear.Id);
    }

    setIsDropdownOpen(false); // Close dropdown after selection
  };

  const navigate = useNavigate();

  const handleOkClick = async (e) => {
    e.preventDefault();

    navigate("/dashboard");
  };

  return (
    <Box
      sx={{
        textAlign: "center",
        p: 2,
        width: "100vw",
        background: "linear-gradient(to right, rgb(21, 110, 148), #2c5364)",
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
        overflow: "hidden",
      }}>
      <Box
        sx={{
          position: "fixed",
          top: 200,
          left: "50%",
          transform: "translateX(-50%)",
          width: "300px",
          borderRadius: "8px",
          padding: "8px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          background: "transparent", // Remove background color
        }}>
        <Select
          options={years.map((year) => ({
            value: year.Id,
            label: year.DateRange,
          }))}
          onChange={handleSelectChange}
          onMenuOpen={() => setIsDropdownOpen(true)}
          onMenuClose={() => setIsDropdownOpen(false)}
          placeholder="Select Date Range"
          styles={{
            control: (base) => ({
              ...base,
              backgroundColor: "#ffffff",
              borderColor: "#AFC1D6",
              color: "black",
              width: "300px",
              marginBottom: "10px",
            }),
            singleValue: (provided) => ({ ...provided, color: "black" }),
            menu: (provided) => ({
              ...provided,
              backgroundColor: "#ffffff",
              zIndex: 9999,
            }),
            option: (provided, state) => ({
              ...provided,
              backgroundColor: state.isFocused ? "#AFC1D6" : "#ffffff",
              color: "black",
            }),
          }}
        />

        {!isDropdownOpen && (
          <Button
            variant="contained"
            color="primary"
            onClick={handleOkClick}
            sx={{
              width: "30%",
              mt: 1,
            }}>
            OK
          </Button>
        )}
      </Box>

      {/* Toast Notifications */}
      <ToastContainer position="top-right" autoClose={3000} />
    </Box>
  );
}

export default CoverPage;
