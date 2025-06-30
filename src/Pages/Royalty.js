import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Typography,
  Grid,
  TextField,
  Select,
  useRadioGroup,
} from "@mui/material";
import {
  FaCrown,
  FaBuilding,
  FaUserShield,
  FaCodeBranch,
  FaDatabase,
  FaCalculator,
  FaLock,
} from "react-icons/fa";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Label } from "@mui/icons-material";
import {
  Alert,
  useMediaQuery,
  Autocomplete,
  Drawer,
  Divider,
} from "@mui/material";

import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { DatePicker } from "@mui/x-date-pickers";
import { useNavigate } from "react-router-dom";

const Royalty = () => {
  const [userId, setUserId] = useState("");
  const [yearid, setYearId] = useState("");
  const [errors, setErrors] = useState("");
  const [dateError, setDateError] = useState(false);
  const [fromdate, setFromdate] = useState("");
  const [todate, setTodate] = useState("");
  const [Royalty, setRoyalty] = useState("");
  const [TDS, setTDS] = useState("");
  const [StatementDate, setStatementDate] = useState("");
  const [DeductTDCAmt, setDeductTDCAmt] = useState("");
  const [PublicationId, setPublicationId] = useState("");
  const [BookGroupId, setBookGroupId] = useState("");
  const [ProfessorId, setProfessorId] = useState("");
  const [publications, setPublications] = useState([]);
  const [bookgroups, setBookgroups] = useState([]);
  const [professors, setProfessors] = useState([]);
  const [isEditing, setIsEditing] = useState("");
  const [id, setId] = useState("");
  const [Proftext, setProftext] = useState("");

  useEffect(() => {
    const storedUserId = sessionStorage.getItem("UserId");
    const storedYearId = sessionStorage.getItem("YearId");
    const storedFromdate = sessionStorage.getItem("FromDate");
    const storedTodate = sessionStorage.getItem("ToDate");
    if (storedUserId) {
      setUserId(storedUserId);
    } else {
      toast.error("User is not logged in.");
    }

    if (storedYearId) {
      setYearId(storedYearId);
    } else {
      toast.error("Year is not set.");
    }

    if (storedFromdate) {
      setFromdate(storedFromdate);
    } else {
      toast.error("Fromdate is not set.");
    }

    if (storedTodate) {
      setTodate(storedTodate);
    } else {
      toast.error("Todate is not set.");
    }

    fetchRoyaltyTypes();
  }, []);

  useEffect(() => {
    fetchBookgroups();
    fetchPublications();
  }, []);

  const fetchBookgroups = async () => {
    try {
      const response = await axios.get(
        "https://publication.microtechsolutions.net.in/php/BookGroupget.php"
      );
      const bookgroups = response.data.map((bg) => ({
        value: bg.Id,
        label: bg.BookGroupName,
      }));
      setBookgroups(bookgroups);
    } catch (error) {
      // toast.error("Error fetching book groups:", error);
    }
  };

  const fetchPublications = async () => {
    try {
      const response = await axios.get(
        "https://publication.microtechsolutions.net.in/php/Publicationget.php"
      );
      const publications = response.data.map((pub) => ({
        value: pub.Id,
        label: pub.PublicationName,
      }));
      setPublications(publications);
    } catch (error) {
      // toast.error("Error fetching Publications:", error);
    }
  };

  // Fetch professors based on input text
  useEffect(() => {
    if (Proftext.trim() === "") return; // Avoid empty calls
    const delayDebounce = setTimeout(() => {
      fetchProfessors();
    }, 500); // Debounce API call

    return () => clearTimeout(delayDebounce);
  }, [Proftext]); // Fetch when Proftext changes

  const fetchProfessors = async () => {
    if (Proftext.trim() === "") return; // Don't fetch if input is empty

    try {
      const response = await axios.get(
        `https://publication.microtechsolutions.net.in/php/get/search.php?Table=Professor&Colname=ProfessorName&Text=${Proftext}`
      );
      const profData = response.data;

      const profOptions = profData.map((prof) => ({
        value: prof.Id,
        label: prof.ProfessorName,
      }));
      setProfessors(profOptions);
    } catch (error) {
      // toast.error("Error fetching profs:", error);
    }
  };

  const icons = [
    <FaBuilding />,
    <FaUserShield />,
    <FaCodeBranch />,
    <FaDatabase />,
    <FaCalculator />,
    <FaLock />,
  ];

  const royaltyForms = {
    "Royalty Letter": () => (
      <>
        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2 }}>
          <Grid container spacing={2}>
            <Grid item xs={4}>
              <Typography variant="body1" fontWeight="bold" gutterBottom>
                Accounting Year
              </Typography>
              <TextField
                fullWidth
                value={
                  fromdate && todate
                    ? `${new Date(fromdate).toLocaleDateString(
                        "en-GB"
                      )} - ${new Date(todate).toLocaleDateString("en-GB")}`
                    : ""
                }
                InputProps={{ readOnly: true }}
                size="small"
              />
            </Grid>

            <Grid item xs={4}>
              <Typography variant="body1" fontWeight="bold" gutterBottom>
                Royalty(%)
              </Typography>
              <TextField
                fullWidth
                type="number"
                value={Royalty}
                onChange={(e) => setRoyalty(e.target.value)}
                size="small"
                placeholder="Enter Royalty in %"
              />
            </Grid>
            <Grid item xs={4}>
              <Typography variant="body1" fontWeight="bold" gutterBottom>
                TDS(%)
              </Typography>
              <TextField
                fullWidth
                type="number"
                value={TDS}
                onChange={(e) => setTDS(e.target.value)}
                size="small"
                placeholder="Enter TDS in %"
              />
            </Grid>

            <Grid item xs={4}>
              <Typography variant="body1" fontWeight="bold" gutterBottom>
                Statement date
              </Typography>
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DatePicker
                  value={StatementDate ? new Date(StatementDate) : null} // Convert to Date object
                  onChange={(newValue) => setStatementDate(newValue)}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      error={!!errors.StatementDate}
                      helperText={errors.StatementDate}
                    />
                  )}
                  slotProps={{
                    textField: { size: "small", fullWidth: true },
                  }}
                  format="dd-MM-yyyy"
                />
              </LocalizationProvider>
            </Grid>

            <Grid item xs={4}>
              <Typography variant="body1" fontWeight="bold" gutterBottom>
                Deduct TDS Amt. above Rs.
              </Typography>
              <TextField
                fullWidth
                type="number"
                value={DeductTDCAmt}
                onChange={(e) => setDeductTDCAmt(e.target.value)}
                size="small"
                placeholder="Enter deduct tds in %"
              />
            </Grid>
          </Grid>

          {/* Buttons Section */}
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              gap: 2,
              mt: 2,
              mb: 1,
            }}>
            <Button
              sx={{
                minWidth: "max-content",
                padding: "8px",
                backgroundColor: "primary.main", // MUI theme primary color
                color: "white", // Ensure text is visible
                "&:hover": {
                  backgroundColor: "primary.dark", // Darker shade on hover
                },
              }}
              onClick={handleSubmit}>
              Save
            </Button>
            <Button
              sx={{
                minWidth: "max-content",
                padding: "8px",
                backgroundColor: "success.main", // MUI green
                color: "white",
                "&:hover": {
                  backgroundColor: "success.dark", // Darker green on hover
                },
              }}
              onClick={handleLetterprint}>
              Print
            </Button>

            <Button
              sx={{
                minWidth: "max-content",
                padding: "8px",
                background: "red",
                "&:hover": {
                  backgroundColor: "red", // Darker shade on hover
                },
                color: "white",
              }}>
              Cancel
            </Button>
          </Box>
        </Box>
      </>
    ),

    "Royalty Voucher": () => (
      <>
        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2 }}>
          <Grid container spacing={2}>
            <Grid item xs={4}>
              <Typography variant="body1" fontWeight="bold" gutterBottom>
                Accounting Year
              </Typography>
              <TextField
                fullWidth
                value={
                  fromdate && todate
                    ? `${new Date(fromdate).toLocaleDateString(
                        "en-GB"
                      )} - ${new Date(todate).toLocaleDateString("en-GB")}`
                    : ""
                }
                InputProps={{ readOnly: true }}
                size="small"
              />
            </Grid>

            <Grid item xs={4}>
              <Typography variant="body1" fontWeight="bold" gutterBottom>
                Royalty(%)
              </Typography>
              <TextField
                fullWidth
                type="number"
                value={Royalty}
                onChange={(e) => setRoyalty(e.target.value)}
                size="small"
                placeholder="Enter Royalty in %"
              />
            </Grid>
            <Grid item xs={4}>
              <Typography variant="body1" fontWeight="bold" gutterBottom>
                TDS(%)
              </Typography>
              <TextField
                fullWidth
                type="number"
                value={TDS}
                onChange={(e) => setTDS(e.target.value)}
                size="small"
                placeholder="Enter TDS in %"
              />
            </Grid>

            <Grid item xs={4}>
              <Typography variant="body1" fontWeight="bold" gutterBottom>
                Statement date
              </Typography>
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DatePicker
                  value={StatementDate ? new Date(StatementDate) : null} // Convert to Date object
                  onChange={(newValue) => setStatementDate(newValue)}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      error={!!errors.StatementDate}
                      helperText={errors.StatementDate}
                    />
                  )}
                  slotProps={{
                    textField: { size: "small", fullWidth: true },
                  }}
                  format="dd-MM-yyyy"
                />
              </LocalizationProvider>
            </Grid>

            <Grid item xs={4}>
              <Typography variant="body1" fontWeight="bold" gutterBottom>
                Deduct TDS Amt. above Rs.
              </Typography>
              <TextField
                fullWidth
                type="number"
                value={DeductTDCAmt}
                onChange={(e) => setDeductTDCAmt(e.target.value)}
                size="small"
                placeholder="Enter deduct tds in %"
              />
            </Grid>
            <Grid item xs={4}>
              <Typography variant="body1" fontWeight="bold" gutterBottom>
                Publication
              </Typography>
              <Autocomplete
                options={publications}
                value={
                  publications.find(
                    (option) => option.value === PublicationId
                  ) || null
                }
                onChange={(event, newValue) =>
                  setPublicationId(newValue ? newValue.value : null)
                }
                getOptionLabel={(option) => option.label} // Display only label in dropdown
                renderInput={(params) => (
                  <TextField
                    {...params}
                    placeholder="Select publication"
                    size="small"
                    margin="none"
                    fullWidth
                  />
                )}
              />
            </Grid>

            <Grid item xs={4}>
              <Typography variant="body1" fontWeight="bold" gutterBottom>
                Book group
              </Typography>
              <Autocomplete
                options={bookgroups}
                value={
                  bookgroups.find((option) => option.value === BookGroupId) ||
                  null
                }
                onChange={(event, newValue) =>
                  setBookGroupId(newValue ? newValue.value : null)
                }
                getOptionLabel={(option) => option.label} // Display only label in dropdown
                renderInput={(params) => (
                  <TextField
                    {...params}
                    placeholder="Select book group"
                    size="small"
                    margin="none"
                    fullWidth
                  />
                )}
              />
            </Grid>
          </Grid>
          {/* Buttons Section */}
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              gap: 2,
              mt: 2,
              mb: 1,
            }}>
            <Button
              sx={{
                minWidth: "max-content",
                padding: "8px",
                backgroundColor: "primary.main", // MUI theme primary color
                color: "white", // Ensure text is visible
                "&:hover": {
                  backgroundColor: "primary.dark", // Darker shade on hover
                },
              }}
              onClick={handleSubmit}>
              Save
            </Button>
            <Button
              sx={{
                minWidth: "max-content",
                padding: "8px",
                background: "red",
                "&:hover": {
                  backgroundColor: "red", // Darker shade on hover
                },
                color: "white",
              }}>
              Cancel
            </Button>
          </Box>
        </Box>
      </>
    ),
    "Royalty Statement": () => (
      <>
        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2 }}>
          <Grid container spacing={2}>
            <Grid item xs={4}>
              <Typography variant="body1" fontWeight="bold" gutterBottom>
                Accounting Year
              </Typography>
              <TextField
                fullWidth
                value={
                  fromdate && todate
                    ? `${new Date(fromdate).toLocaleDateString(
                        "en-GB"
                      )} - ${new Date(todate).toLocaleDateString("en-GB")}`
                    : ""
                }
                InputProps={{ readOnly: true }}
                size="small"
              />
            </Grid>

            <Grid item xs={4}>
              <Typography variant="body1" fontWeight="bold" gutterBottom>
                Royalty(%)
              </Typography>
              <TextField
                fullWidth
                type="number"
                value={Royalty}
                onChange={(e) => setRoyalty(e.target.value)}
                size="small"
                placeholder="Enter Royalty in %"
              />
            </Grid>
            <Grid item xs={4}>
              <Typography variant="body1" fontWeight="bold" gutterBottom>
                TDS(%)
              </Typography>
              <TextField
                fullWidth
                type="number"
                value={TDS}
                onChange={(e) => setTDS(e.target.value)}
                size="small"
                placeholder="Enter TDS in %"
              />
            </Grid>

            <Grid item xs={4}>
              <Typography variant="body1" fontWeight="bold" gutterBottom>
                Statement date
              </Typography>
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DatePicker
                  value={StatementDate ? new Date(StatementDate) : null} // Convert to Date object
                  onChange={(newValue) => setStatementDate(newValue)}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      error={!!errors.StatementDate}
                      helperText={errors.StatementDate}
                    />
                  )}
                  slotProps={{
                    textField: { size: "small", fullWidth: true },
                  }}
                  format="dd-MM-yyyy"
                />
              </LocalizationProvider>
            </Grid>

            <Grid item xs={4}>
              <Typography variant="body1" fontWeight="bold" gutterBottom>
                Deduct TDS Amt. above Rs.
              </Typography>
              <TextField
                fullWidth
                type="number"
                value={DeductTDCAmt}
                onChange={(e) => setDeductTDCAmt(e.target.value)}
                size="small"
                placeholder="Enter deduct tds in %"
              />
            </Grid>
            <Grid item xs={4}>
              <Typography variant="body1" fontWeight="bold" gutterBottom>
                Professor
              </Typography>
              <Autocomplete
                options={professors}
                getOptionLabel={(option) => option.label} // Display label
                value={
                  professors.find((option) => option.value === ProfessorId) ||
                  null
                }
                inputValue={Proftext} // Controlled input value
                onInputChange={(event, newValue) => setProftext(newValue)} // Handle input change
                onChange={(event, newValue) =>
                  setProfessorId(newValue ? newValue.value : null)
                }
                isOptionEqualToValue={(option, value) =>
                  option.value === value.value
                } // Ensure correct selection
                filterOptions={(options, { inputValue }) =>
                  options.filter((option) =>
                    option.label
                      .toLowerCase()
                      .includes(inputValue.toLowerCase())
                  )
                } // Custom filtering based on input
                renderInput={(params) => (
                  <TextField
                    {...params}
                    placeholder="Type to search professor..."
                    size="small"
                    fullWidth
                  />
                )}
              />
            </Grid>
          </Grid>
          {/* Buttons Section */}
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              gap: 2,
              mt: 2,
              mb: 1,
            }}>
            <Button
              sx={{
                minWidth: "max-content",
                padding: "8px",
                backgroundColor: "primary.main", // MUI theme primary color
                color: "white", // Ensure text is visible
                "&:hover": {
                  backgroundColor: "primary.dark", // Darker shade on hover
                },
              }}
              onClick={handleSubmit}>
              Save
            </Button>
            <Button
              sx={{
                minWidth: "max-content",
                padding: "8px",
                backgroundColor: "success.main", // MUI theme primary color
                color: "white", // Ensure text is visible
                "&:hover": {
                  backgroundColor: "success.dark", // Darker shade on hover
                },
              }}
              onClick={handlestatementprint}>
              Print
            </Button>
            <Button
              sx={{
                minWidth: "max-content",
                padding: "8px",
                background: "red",
                "&:hover": {
                  backgroundColor: "red", // Darker shade on hover
                },
                color: "white",
              }}>
              Cancel
            </Button>
          </Box>
        </Box>
      </>
    ),
    "Royalty Statement - Authorwise": () => (
      <>
        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2 }}>
          <Grid container spacing={2}>
            <Grid item xs={4}>
              <Typography variant="body1" fontWeight="bold" gutterBottom>
                Accounting Year
              </Typography>
              <TextField
                fullWidth
                value={
                  fromdate && todate
                    ? `${new Date(fromdate).toLocaleDateString(
                        "en-GB"
                      )} - ${new Date(todate).toLocaleDateString("en-GB")}`
                    : ""
                }
                InputProps={{ readOnly: true }}
                size="small"
              />
            </Grid>

            <Grid item xs={4}>
              <Typography variant="body1" fontWeight="bold" gutterBottom>
                Royalty(%)
              </Typography>
              <TextField
                fullWidth
                type="number"
                value={Royalty}
                onChange={(e) => setRoyalty(e.target.value)}
                size="small"
                placeholder="Enter Royalty in %"
              />
            </Grid>
            <Grid item xs={4}>
              <Typography variant="body1" fontWeight="bold" gutterBottom>
                TDS(%)
              </Typography>
              <TextField
                fullWidth
                type="number"
                value={TDS}
                onChange={(e) => setTDS(e.target.value)}
                size="small"
                placeholder="Enter TDS in %"
              />
            </Grid>

            <Grid item xs={4}>
              <Typography variant="body1" fontWeight="bold" gutterBottom>
                Statement date
              </Typography>
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DatePicker
                  value={StatementDate ? new Date(StatementDate) : null} // Convert to Date object
                  onChange={(newValue) => setStatementDate(newValue)}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      error={!!errors.StatementDate}
                      helperText={errors.StatementDate}
                    />
                  )}
                  slotProps={{
                    textField: { size: "small", fullWidth: true },
                  }}
                  format="dd-MM-yyyy"
                />
              </LocalizationProvider>
            </Grid>

            <Grid item xs={4}>
              <Typography variant="body1" fontWeight="bold" gutterBottom>
                Deduct TDS Amt. above Rs.
              </Typography>
              <TextField
                fullWidth
                type="number"
                value={DeductTDCAmt}
                onChange={(e) => setDeductTDCAmt(e.target.value)}
                size="small"
                placeholder="Enter deduct tds in %"
              />
            </Grid>
          </Grid>
          {/* Buttons Section */}
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              gap: 2,
              mt: 2,
              mb: 1,
            }}>
            <Button
              sx={{
                minWidth: "max-content",
                padding: "8px",
                backgroundColor: "primary.main", // MUI theme primary color
                color: "white", // Ensure text is visible
                "&:hover": {
                  backgroundColor: "primary.dark", // Darker shade on hover
                },
              }}
              onClick={handleSubmit}>
              Save
            </Button>
            <Button
              sx={{
                minWidth: "max-content",
                padding: "8px",
                background: "red",
                "&:hover": {
                  backgroundColor: "red", // Darker shade on hover
                },
                color: "white",
              }}>
              Cancel
            </Button>
          </Box>
        </Box>
      </>
    ),
    "Royalty Statement summary": () => (
      <>
        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2 }}>
          <Grid container spacing={2}>
            <Grid item xs={4}>
              <Typography variant="body1" fontWeight="bold" gutterBottom>
                Accounting Year
              </Typography>
              <TextField
                fullWidth
                value={
                  fromdate && todate
                    ? `${new Date(fromdate).toLocaleDateString(
                        "en-GB"
                      )} - ${new Date(todate).toLocaleDateString("en-GB")}`
                    : ""
                }
                InputProps={{ readOnly: true }}
                size="small"
              />
            </Grid>

            <Grid item xs={4}>
              <Typography variant="body1" fontWeight="bold" gutterBottom>
                Royalty(%)
              </Typography>
              <TextField
                fullWidth
                type="number"
                value={Royalty}
                onChange={(e) => setRoyalty(e.target.value)}
                size="small"
                placeholder="Enter Royalty in %"
              />
            </Grid>
            <Grid item xs={4}>
              <Typography variant="body1" fontWeight="bold" gutterBottom>
                TDS(%)
              </Typography>
              <TextField
                fullWidth
                type="number"
                value={TDS}
                onChange={(e) => setTDS(e.target.value)}
                size="small"
                placeholder="Enter TDS in %"
              />
            </Grid>

            <Grid item xs={4}>
              <Typography variant="body1" fontWeight="bold" gutterBottom>
                Statement date
              </Typography>
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DatePicker
                  value={StatementDate ? new Date(StatementDate) : null} // Convert to Date object
                  onChange={(newValue) => setStatementDate(newValue)}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      error={!!errors.StatementDate}
                      helperText={errors.StatementDate}
                    />
                  )}
                  slotProps={{
                    textField: { size: "small", fullWidth: true },
                  }}
                  format="dd-MM-yyyy"
                />
              </LocalizationProvider>
            </Grid>

            <Grid item xs={4}>
              <Typography variant="body1" fontWeight="bold" gutterBottom>
                Deduct TDS Amt. above Rs.
              </Typography>
              <TextField
                fullWidth
                type="number"
                value={DeductTDCAmt}
                onChange={(e) => setDeductTDCAmt(e.target.value)}
                size="small"
                placeholder="Enter deduct tds in %"
              />
            </Grid>
          </Grid>

          {/* Buttons Section */}
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              gap: 2,
              mt: 2,
              mb: 1,
            }}>
            <Button
              sx={{
                minWidth: "max-content",
                padding: "8px",
                backgroundColor: "primary.main", // MUI theme primary color
                color: "white", // Ensure text is visible
                "&:hover": {
                  backgroundColor: "primary.dark", // Darker shade on hover
                },
              }}
              onClick={handleSubmit}>
              Save
            </Button>
            <Button
              sx={{
                minWidth: "max-content",
                padding: "8px",
                background: "red",
                "&:hover": {
                  backgroundColor: "red", // Darker shade on hover
                },
                color: "white",
              }}>
              Cancel
            </Button>
          </Box>
        </Box>
      </>
    ),
    "Royalty Calculation": () => (
      <>
        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2 }}>
          <Grid container spacing={2}>
            <Grid item xs={4}>
              <Typography variant="body1" fontWeight="bold" gutterBottom>
                Accounting Year
              </Typography>
              <TextField
                fullWidth
                value={
                  fromdate && todate
                    ? `${new Date(fromdate).toLocaleDateString(
                        "en-GB"
                      )} - ${new Date(todate).toLocaleDateString("en-GB")}`
                    : ""
                }
                InputProps={{ readOnly: true }}
                size="small"
              />
            </Grid>

            <Grid item xs={4}>
              <Typography variant="body1" fontWeight="bold" gutterBottom>
                Royalty(%)
              </Typography>
              <TextField
                fullWidth
                type="number"
                value={Royalty}
                onChange={(e) => setRoyalty(e.target.value)}
                size="small"
                placeholder="Enter Royalty in %"
              />
            </Grid>
            <Grid item xs={4}>
              <Typography variant="body1" fontWeight="bold" gutterBottom>
                TDS(%)
              </Typography>
              <TextField
                fullWidth
                type="number"
                value={TDS}
                onChange={(e) => setTDS(e.target.value)}
                size="small"
                placeholder="Enter TDS in %"
              />
            </Grid>

            <Grid item xs={4}>
              <Typography variant="body1" fontWeight="bold" gutterBottom>
                Statement date
              </Typography>
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DatePicker
                  value={StatementDate ? new Date(StatementDate) : null} // Convert to Date object
                  onChange={(newValue) => setStatementDate(newValue)}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      error={!!errors.StatementDate}
                      helperText={errors.StatementDate}
                    />
                  )}
                  slotProps={{
                    textField: { size: "small", fullWidth: true },
                  }}
                  format="dd-MM-yyyy"
                />
              </LocalizationProvider>
            </Grid>

            <Grid item xs={4}>
              <Typography variant="body1" fontWeight="bold" gutterBottom>
                Deduct TDS Amt. above Rs.
              </Typography>
              <TextField
                fullWidth
                type="number"
                value={DeductTDCAmt}
                onChange={(e) => setDeductTDCAmt(e.target.value)}
                size="small"
                placeholder="Enter deduct tds in %"
              />
            </Grid>
            <Grid item xs={4}>
              <Typography variant="body1" fontWeight="bold" gutterBottom>
                Publication
              </Typography>
              <Autocomplete
                options={publications}
                value={
                  publications.find(
                    (option) => option.value === PublicationId
                  ) || null
                }
                onChange={(event, newValue) =>
                  setPublicationId(newValue ? newValue.value : null)
                }
                getOptionLabel={(option) => option.label} // Display only label in dropdown
                renderInput={(params) => (
                  <TextField
                    {...params}
                    placeholder="Select publication"
                    size="small"
                    margin="none"
                    fullWidth
                  />
                )}
              />
            </Grid>

            <Grid item xs={4}>
              <Typography variant="body1" fontWeight="bold" gutterBottom>
                Book group
              </Typography>
              <Autocomplete
                options={bookgroups}
                value={
                  bookgroups.find((option) => option.value === BookGroupId) ||
                  null
                }
                onChange={(event, newValue) =>
                  setBookGroupId(newValue ? newValue.value : null)
                }
                getOptionLabel={(option) => option.label} // Display only label in dropdown
                renderInput={(params) => (
                  <TextField
                    {...params}
                    placeholder="Select book group"
                    size="small"
                    margin="none"
                    fullWidth
                  />
                )}
              />
            </Grid>
          </Grid>

          {/* Buttons Section */}
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              gap: 2,
              mt: 2,
              mb: 1,
            }}>
            <Button
              sx={{
                minWidth: "max-content",
                padding: "8px",
                backgroundColor: "#0a60bd", // MUI theme primary color
                color: "white", // Ensure text is visible
                "&:hover": {
                  backgroundColor: "#0a60bd", // Darker shade on hover
                },
              }}
              onClick={handleSubmit}>
              Save
            </Button>

            <Button
              onClick={handleCalculate}
              sx={{
                minWidth: "max-content",
                padding: "8px",
                background: "green",
                color: "white", // Ensure text is visible
                "&:hover": {
                  backgroundColor: "green", // Darker shade on hover
                },
              }}>
              Calculate Royalty
            </Button>
            <Button
              sx={{
                minWidth: "max-content",
                padding: "8px",
                background: "red",
                color: "white", // Ensure text is visible
                "&:hover": {
                  backgroundColor: "red", // Darker shade on hover
                },
              }}>
              Cancel
            </Button>
          </Box>
        </Box>
      </>
    ),
  };

  const [royaltyOptions, setRoyaltyOptions] = useState([]);
  const [selectedForm, setSelectedForm] = useState(null);

  const [selectedRoyaltyOptionId, setSelectedRoyaltyOptionId] = useState(null);

  const handleRoyaltyOptionSelect = (option) => {
    setSelectedForm(option.Name);
    setSelectedRoyaltyOptionId(option.Id); // Store the selected option ID
  };

  const navigate = useNavigate();

  const handleFeedAdvances = () => {
    navigate("/royalty/feedadvauthor");
    // TODO: Implement actual functionality
  };

  const handleFeedStock = () => {
    navigate("/royalty/feedopeningstock");
    // TODO: Implement actual functionality
  };

  useEffect(() => {
    fetchRoyaltyTypes();
  }, []);

  useEffect(() => {
    // Reset the StatementDate when switching between form types
    resetFormFields();
  }, [selectedForm]); // Ensure selectedFormType is tracked

  // const fetchRoyaltyTypes = async () => {
  //   try {
  //     const response = await axios.get(
  //       "https://publication.microtechsolutions.net.in/php/gettable.php?Table=RoyaltyOptions"
  //     );
  //     setRoyaltyOptions(response.data);
  //   } catch (error) {
  //     console.error("Error fetching royalty options:", error);
  //   }
  // };

  const fetchRoyaltyTypes = async () => {
    try {
      const response = await axios.get(
        "https://publication.microtechsolutions.net.in/php/gettable.php?Table=RoyaltyOptions"
      );
      if (response.data.length > 0) {
        setRoyaltyOptions(response.data);
        setSelectedForm(response.data[0].Name); // Default selection
      }
    } catch (error) {
      console.error("Error fetching royalty options:", error);
    }
  };

  const resetFormFields = () => {
    // setFromdate("");
    // setTodate("");
    setRoyalty("");
    setTDS("");
    setPublicationId("");
    setBookGroupId("");
    setProfessorId("");
    setDeductTDCAmt("");
    setStatementDate("");
  };

  const handleCalculate = () => {
    window.prompt("Calculating Royalty ");
  };

  const handleLetterprint = () => {
    navigate("/royalty/royaltyletterprint");
  };

  const handlestatementprint = () => {
    navigate("/royalty/royaltystmtprint");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // if (!validateForm()) return;

    const data = {
      RoyaltyOptionId: selectedRoyaltyOptionId,
      AccountingFromYear: fromdate,
      AccountingToYear: todate,
      RoyaltyPercentage: Royalty, // Changed key to a valid format
      TDSPercentage: TDS, // Changed key to a valid format
      StatementDate: StatementDate,
      DeductTDCAmt: DeductTDCAmt,
      PublicationId: PublicationId,
      BookGroupId: BookGroupId,
      ProfessorId: ProfessorId,
      CreatedBy: userId,
    };

    // Determine the URL based on whether we're editing or adding
    const url = isEditing
      ? "https://publication.microtechsolutions.net.in/php/update/royalty.php"
      : "https://publication.microtechsolutions.net.in/php/post/royalty.php";

    // If editing, include the author ID in the payload
    if (isEditing) {
      data.Id = id;
      data.UpdatedBy = userId;
    }

    try {
      await axios.post(url, data, {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      });

      if (isEditing) {
        toast.success("Royalty updated successfully!");
      } else {
        toast.success("Royalty added successfully!");
      }
      resetFormFields();
    } catch (error) {
      // console.error("Error saving record:", error);
      toast.error("Error saving record!");
    }
  };

  return (
    <Grid container sx={{ height: "100vh" }}>
      {/* Sidebar Menu */}
      {/* <Grid
        item
        xs={3}
        sx={{
          bgcolor: "#f4f4f4",
          height: "90vh",
          padding: 3,
          overflowY: "auto",
        }}> */}

      <Grid
        item
        xs={12}
        md={3}
        sx={{
          bgcolor: "#f4f4f4",
          height: { xs: "auto", md: "90vh" },
          padding: 2,
          overflowY: "auto",
        }}>
        <Typography variant="h5">
          <FaCrown /> Royalty
        </Typography>

        {royaltyOptions.map((option, index) => (
          <Button
            key={option.Id}
            fullWidth
            variant={selectedForm === option.Name ? "contained" : "outlined"}
            startIcon={icons[index % icons.length]} // Assign icons in a loop
            onClick={() => handleRoyaltyOptionSelect(option)} // Call function
            sx={{ mb: 1, justifyContent: "flex-start" }}>
            {option.Name}
          </Button>
        ))}
      </Grid>
      {/* Main Content Area */}
      {/* <Grid
        item
        xs={9}
        sx={{
          display: "flex",
          flexDirection: "column",
          padding: 3,
          height: "100vh", // Ensure it takes full height
        }}> */}

      <Grid
        item
        xs={12}
        md={9}
        sx={{
          display: "flex",
          flexDirection: "column",
          padding: 2,
          height: { xs: "auto", md: "10vh" },
        }}>
        {selectedForm && (
          <>
            <Typography variant="h6">{selectedForm}</Typography>

            {/* Form Content should take available space */}
            <Box sx={{ flexGrow: 1, mt: 2 }}>
              {royaltyForms[selectedForm]
                ? royaltyForms[selectedForm]()
                : "Form not available"}
            </Box>

            {/* Buttons at the bottom */}
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                gap: "10px",
                mt: "auto", // Pushes it to the bottom
                pb: 9, // Adds padding at the bottom
              }}>
              <Button
                variant="contained"
                color="primary"
                onClick={handleFeedAdvances}
                sx={{ minWidth: "max-content", padding: "8px 16px" }}>
                Feed Advances of Authors
              </Button>
              <Button
                variant="contained"
                color="secondary"
                onClick={handleFeedStock}
                sx={{ minWidth: "max-content", padding: "8px 16px" }}>
                Feed Opening Stock
              </Button>
            </Box>
          </>
        )}
      </Grid>
      <ToastContainer />
    </Grid>
  );
};

export default Royalty;
