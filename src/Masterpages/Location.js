import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  TextField,
  Button,
  MenuItem,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  RadioGroup,
  FormControlLabel,
  Radio,
  Autocomplete,
} from "@mui/material";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";
function LocationMaster() {
  const [userId, setUserId] = useState("");
  const [yearid, setYearId] = useState("");
  const [dateError, setDateError] = useState(false);

  useEffect(() => {
    const storedUserId = sessionStorage.getItem("UserId");
    const storedYearId = sessionStorage.getItem("YearId");

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

    fetchAll();
  }, []);

  const [mode, setMode] = useState("state");

  const [stateName, setStateName] = useState("");
  const [stateCode, setStateCode] = useState("");
  const [cityName, setCityName] = useState("");
  const [citycode, setCitycode] = useState("");
  const [areaName, setAreaName] = useState("");
  const [CanvassorId, setCanvassorId] = useState("");

  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);
  const [areas, setAreas] = useState([]);
  const [canvassors, setCanvassors] = useState([]);
  const [selectedStateId, setSelectedStateId] = useState("");
  const [selectedCityId, setSelectedCityId] = useState("");
  const [editId, setEditId] = useState(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [deleteIndex, setDeleteIndex] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const [searchText, setSearchText] = useState("");

  // const fetchAll = async () => {
  //   try {
  //     const areaRes = await axios.get(
  //       "https://publication.microtechsolutions.net.in/php/Areaget.php"
  //     );
  //     const cityRes = await axios.get(
  //       "https://publication.microtechsolutions.net.in/php/Cityget.php"
  //     );
  //     const stateRes = await axios.get(
  //       "https://publication.microtechsolutions.net.in/php/State.php"
  //     );

  //     const canvRes = await axios.get(
  //       "https://publication.microtechsolutions.net.in/php/get/getCanvassorMaster.php"
  //     );

  //     console.log(
  //       areaRes.data,
  //       cityRes.data,
  //       stateRes.data,
  //       canvRes.data,
  //       "All fetch data"
  //     );

  //     const states = stateRes.data;
  //     const cities = cityRes.data;
  //     const canvassors = canvRes.data;
  //     const mappedAreas = areaRes.data.map((a) => {
  //       const city = cities.find((c) => c.Id == a.CityId);
  //       const state = states.find(
  //         (s) => s.Id == (city?.StateCode || city?.StateId)
  //       );
  //       return {
  //         ...a,
  //         CityName: city?.CityName || "—",
  //         StateName: state?.StateName || "—",
  //       };
  //     });

  //     setAreas(mappedAreas);
  //     setStates(states);
  //     setCities(cities);
  //     setCanvassors(canvassors);
  //   } catch (err) {
  //     console.log(err);
  //   }
  // };

  const fetchAll = async () => {
    try {
      const areaRes = await axios.get(
        "https://publication.microtechsolutions.net.in/php/Areaget.php"
      );
      const cityRes = await axios.get(
        "https://publication.microtechsolutions.net.in/php/Cityget.php"
      );
      const stateRes = await axios.get(
        "https://publication.microtechsolutions.net.in/php/State.php"
      );
      const canvRes = await axios.get(
        "https://publication.microtechsolutions.net.in/php/get/getCanvassorMaster.php"
      );

      // 🔹 SORT BY CREATION ORDER (Id)
      const areas = [...areaRes.data].sort((a, b) => a.Id - b.Id);
      const cities = [...cityRes.data].sort((a, b) => a.Id - b.Id);
      const states = [...stateRes.data].sort((a, b) => a.Id - b.Id);
      const canvassors = [...canvRes.data].sort((a, b) => a.Id - b.Id);

      const mappedAreas = areas.map((a) => {
        const city = cities.find((c) => c.Id == a.CityId);
        const state = states.find(
          (s) => s.Id == (city?.StateCode || city?.StateId)
        );

        return {
          ...a,
          CityName: city?.CityName || "—",
          StateName: state?.StateName || "—",
        };
      });

      setAreas(mappedAreas);
      setStates(states);
      setCities(cities);
      setCanvassors(canvassors);
    } catch (err) {
      console.log(err);
    }
  };

  // ---------------- SAVE / UPDATE ----------------
  const handleSave = async () => {
    try {
      if (mode === "state") {
        if (!stateName) return toast.error("Enter State Name");

        if (editId) {
          await axios.post(
            "https://publication.microtechsolutions.net.in/php/Stateupdate.php",
            {
              Id: editId,
              StateName: stateName,
              StateCode: stateCode,
              UpdatedBy: userId,
            },
            {
              headers: { "Content-Type": "application/x-www-form-urlencoded" },
            }
          );
          toast.success("State Updated");
        } else {
          await axios.post(
            "https://publication.microtechsolutions.net.in/php/Statepost.php",
            { StateName: stateName, StateCode: stateCode, CreatedBy: userId },
            {
              headers: { "Content-Type": "application/x-www-form-urlencoded" },
            }
          );
          toast.success("State Saved");
        }
      }

      if (mode === "city") {
        if (!cityName) return toast.error("Enter City Name");
        if (!selectedStateId) return toast.error("Select State");

        if (editId) {
          await axios.post(
            "https://publication.microtechsolutions.net.in/php/Cityupdate.php",
            {
              Id: editId,
              CityName: cityName,
              CityCode: citycode,
              StateId: selectedStateId,
              StateCode: selectedStateId,

              UpdatedBy: userId,
            },
            {
              headers: { "Content-Type": "application/x-www-form-urlencoded" },
            }
          );
          toast.success("City Updated");
        } else {
          await axios.post(
            "https://publication.microtechsolutions.net.in/php/Citypost.php",
            {
              CityName: cityName,
              CityCode: citycode,
              StateId: selectedStateId,
              StateCode: selectedStateId,
              CreatedBy: userId,
            },
            {
              headers: { "Content-Type": "application/x-www-form-urlencoded" },
            }
          );
          toast.success("City Saved");
        }
      }

      if (mode === "area") {
        if (!areaName) return toast.error("Enter Area Name");
        if (!selectedCityId) return toast.error("Select City");

        if (editId) {
          await axios.post(
            "https://publication.microtechsolutions.net.in/php/Areaupdate.php",
            {
              Id: editId,
              AreaName: areaName,
              CityId: selectedCityId,
              StateId: selectedStateId,
              StateCode: selectedStateId,

              CanvassorId: CanvassorId,
              UpdatedBy: userId,
            },
            {
              headers: { "Content-Type": "application/x-www-form-urlencoded" },
            }
          );
          toast.success("Area Updated");
        } else {
          await axios.post(
            "https://publication.microtechsolutions.net.in/php/Areapost.php",
            {
              AreaName: areaName,
              StateId: selectedStateId,
              StateCode: selectedStateId,

              CityId: selectedCityId,
              CanvassorId: CanvassorId,
              CreatedBy: userId,
            },
            {
              headers: { "Content-Type": "application/x-www-form-urlencoded" },
            }
          );
          toast.success("Area Saved");
        }
      }

      resetForm();
      fetchAll();
    } catch (err) {
      console.log("ERROR:", err.response?.data || err.message);
      toast.error(err.response?.data?.message || "Something went wrong");
    }
  };

  const filteredStates = states.filter((s) =>
    s.StateName?.toLowerCase().includes(searchText.toLowerCase())
  );

  const filteredCities = cities.filter(
    (c) =>
      c.CityName?.toLowerCase().includes(searchText.toLowerCase()) ||
      states
        .find((s) => s.Id === c.StateCode)
        ?.StateName?.toLowerCase()
        .includes(searchText.toLowerCase())
  );

  const filteredAreas = areas.filter(
    (a) =>
      a.AreaName?.toLowerCase().includes(searchText.toLowerCase()) ||
      canvassors
        .find((c) => c.Id === a.CanvassorId)
        ?.CanvassorName?.toLowerCase()
        .includes(searchText.toLowerCase())
  );

  const modeLabel =
    mode === "state" ? "State" : mode === "city" ? "City" : "Area";

  const handleDelete = (Id) => {
    setDeleteId(Id);
    setIsDeleteDialogOpen(true);
  };

  const handleConfirm = async () => {
    try {
      const urlencoded = new URLSearchParams();
      urlencoded.append("Id", deleteId);

      let api =
        mode === "state"
          ? "Statedelete.php"
          : mode === "city"
          ? "Citydelete.php"
          : "Areadelete.php";

      await fetch(`https://publication.microtechsolutions.net.in/php/${api}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: urlencoded.toString(),
      });

      // 🔹 Dynamic toast message
      const label =
        mode === "state" ? "State" : mode === "city" ? "City" : "Area";

      toast.success(`${label} deleted successfully`);

      setIsDeleteDialogOpen(false);
      fetchAll();
    } catch (error) {
      console.error(error);
      toast.error("Delete failed");
    }
  };

  const cancelDelete = () => {
    setIsDeleteDialogOpen(false);
    setDeleteIndex(null);
    setDeleteId(null);
  };

  const handleEdit = (row) => {
    setEditId(row.Id);

    if (mode === "state") {
      setStateName(row.StateName);
      setStateCode(row.StateCode || "");
    }

    if (mode === "city") {
      setCityName(row.CityName);
      setSelectedStateId(row.StateId || row.StateCode);
      setCitycode(row.CityCode || "");
    }

    if (mode === "area") {
      setAreaName(row.AreaName || "");
      setSelectedCityId(row.CityId || "");
      setSelectedStateId(row.StateId || "");
      setCanvassorId(row.CanvassorId || "");
    }
  };

  const resetForm = () => {
    setEditId(null);
    setStateName("");
    setCityName("");
    setCitycode("");
    setStateCode("");
    setAreaName("");
    setCanvassorId("");
    setSelectedCityId("");
    setSelectedStateId("");
  };

  return (
    <Box p={3}>
      <Typography
        variant="h5"
        gutterBottom
        sx={{
          fontWeight: 600,
          letterSpacing: "0.5px",
          color: "#1f2937",
          textAlign: "center",
        }}>
        State · City · Area Master
      </Typography>

      {/* Mode */}
      <RadioGroup
        row
        value={mode}
        onChange={(e) => {
          resetForm();
          setMode(e.target.value);
        }}>
        <FormControlLabel value="state" control={<Radio />} label="State" />
        <FormControlLabel value="city" control={<Radio />} label="City" />
        <FormControlLabel value="area" control={<Radio />} label="Area" />
      </RadioGroup>

      <Grid container spacing={2} mt={1}>
        {/* FORM */}
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" mb={2}>
                {editId ? "Edit" : "Add"} {mode.toUpperCase()}
              </Typography>

              {mode === "state" && (
                <>
                  {" "}
                  <TextField
                    fullWidth
                    label="State Name"
                    value={stateName}
                    onChange={(e) => setStateName(e.target.value)}
                    margin="normal"
                  />
                  <TextField
                    fullWidth
                    label="State Code"
                    value={stateCode}
                    onChange={(e) => setStateCode(e.target.value)}
                    margin="normal"
                  />
                </>
              )}
              {mode === "city" && (
                <>
                  <Autocomplete
                    options={states}
                    getOptionLabel={(option) => option.StateName}
                    value={states.find((s) => s.Id === selectedStateId) || null}
                    onChange={(event, newValue) => {
                      setSelectedStateId(newValue ? newValue.Id : "");
                    }}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Select State"
                        margin="normal"
                        fullWidth
                      />
                    )}
                  />

                  <TextField
                    fullWidth
                    label="City Name"
                    value={cityName}
                    onChange={(e) => setCityName(e.target.value)}
                    margin="normal"
                  />

                  <TextField
                    fullWidth
                    label="City Code"
                    value={citycode}
                    onChange={(e) => setCitycode(e.target.value)}
                    margin="normal"
                  />
                </>
              )}

              {mode === "area" && (
                <>
                  <TextField
                    fullWidth
                    size="small"
                    label="Area Name"
                    value={areaName}
                    onChange={(e) => setAreaName(e.target.value)}
                    margin="dense"
                  />

                  <Autocomplete
                    options={states}
                    getOptionLabel={(option) => option.StateName}
                    value={states.find((s) => s.Id === selectedStateId) || null}
                    onChange={(event, newValue) => {
                      setSelectedStateId(newValue ? newValue.Id : "");
                    }}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Select State"
                        margin="normal"
                        fullWidth
                      />
                    )}
                  />

                  {/* CITY (FILTERED BY STATE) */}
                  <TextField
                    fullWidth
                    size="small"
                    select
                    label="Select City"
                    value={selectedCityId}
                    onChange={(e) => setSelectedCityId(e.target.value)}
                    margin="dense"
                    disabled={!selectedStateId}>
                    {cities
                      .filter(
                        (c) => Number(c.StateCode) === Number(selectedStateId)
                      )
                      .map((c) => (
                        <MenuItem key={c.Id} value={c.Id}>
                          {c.CityName}
                        </MenuItem>
                      ))}
                  </TextField>

                  <Autocomplete
                    size="small"
                    options={canvassors}
                    getOptionLabel={(option) => option.CanvassorName || ""}
                    value={canvassors.find((c) => c.Id === CanvassorId) || null}
                    onChange={(event, newValue) => {
                      setCanvassorId(newValue ? newValue.Id : "");
                    }}
                    isOptionEqualToValue={(option, value) =>
                      option.Id === value.Id
                    }
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Select Canvassor"
                        margin="dense"
                        fullWidth
                      />
                    )}
                  />
                </>
              )}

              <Button
                fullWidth
                variant="contained"
                sx={{ mt: 2 }}
                onClick={handleSave}>
                {editId ? "Update" : "Save"}
              </Button>
            </CardContent>
          </Card>
        </Grid>

        {/* TABLE */}
        <Grid item xs={12} md={8}>
          <Card>
            <CardContent>
              <Typography variant="h6" mb={2} style={{ fontWeight: "600" }}>
                {mode.toUpperCase()} LIST
              </Typography>

              <TableContainer
                component={Paper}
                sx={{
                  maxHeight: "50vh", // HEIGHT OF TABLE
                  overflowY: "auto",
                  width: "100%", // FULL WIDTH
                }}>
                <TextField
                  halfwidth
                  size="small"
                  placeholder={`Search ${modeLabel}...`}
                  value={searchText}
                  onChange={(e) => setSearchText(e.target.value)}
                  sx={{ mb: 2, ml: 2, mt: 2, width: "50%" }}
                />

                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>Sr</TableCell>
                      {mode === "state" && <TableCell>State</TableCell>}
                      {mode === "city" && (
                        <>
                          <TableCell>City</TableCell>
                          <TableCell>State</TableCell>
                        </>
                      )}
                      {mode === "area" && (
                        <>
                          <TableCell>Area</TableCell>
                          {/* <TableCell>City</TableCell> */}
                          {/* <TableCell>State</TableCell> */}
                          <TableCell>Canvassor</TableCell>
                        </>
                      )}
                      <TableCell>Actions</TableCell>
                    </TableRow>
                  </TableHead>

                  <TableBody>
                    {/* STATE TABLE */}
                    {mode === "state" &&
                      filteredStates.map((s, i) => (
                        <TableRow key={i}>
                          <TableCell>{i + 1}</TableCell>
                          <TableCell>{s.StateName}</TableCell>
                          <TableCell>
                            <Button onClick={() => handleEdit(s)}>Edit</Button>
                            <Button
                              color="error"
                              onClick={() => handleDelete(s.Id)}>
                              Delete
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}

                    {/* CITY TABLE */}
                    {mode === "city" &&
                      filteredCities.map((c, i) => (
                        <TableRow key={i}>
                          <TableCell>{i + 1}</TableCell>
                          <TableCell>{c.CityName}</TableCell>
                          <TableCell>
                            {filteredStates.find((s) => s.Id === c.StateCode)
                              ?.StateName || "—"}
                          </TableCell>
                          <TableCell>
                            <Button onClick={() => handleEdit(c)}>Edit</Button>
                            <Button
                              color="error"
                              onClick={() => handleDelete(c.Id)}>
                              Delete
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}

                    {/* AREA TABLE */}
                    {mode === "area" &&
                      filteredAreas.map((a, i) => (
                        <TableRow key={i}>
                          <TableCell>{i + 1}</TableCell>
                          <TableCell>{a.AreaName}</TableCell>
                          {/* <TableCell>{a.CityName}</TableCell>
                          <TableCell>{a.StateName}</TableCell> */}
                          <TableCell>
                            {canvassors.find((c) => c.Id === a.CanvassorId)
                              ?.Name || "-"}
                          </TableCell>
                          <TableCell>
                            <Button onClick={() => handleEdit(a)}>Edit</Button>
                            <Button
                              color="error"
                              onClick={() => handleDelete(a.Id)}>
                              Delete
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        </Grid>

        <Dialog open={isDeleteDialogOpen} onClose={cancelDelete}>
          <DialogTitle style={{ color: "navy", fontWeight: "600" }}>
            Delete {modeLabel}
          </DialogTitle>
          <DialogContent>
            Are you sure you want to delete this{" "}
            <b style={{ color: "red" }}>
              <u>{modeLabel}</u>
            </b>
            ?
          </DialogContent>
          <DialogActions>
            <Button
              onClick={cancelDelete}
              style={{
                background: "red",
                color: "white",
                marginRight: "5px",
              }}>
              Cancel
            </Button>
            <Button
              onClick={handleConfirm}
              style={{
                background: "#0a60bd",
                color: "white",
                marginRight: "5px",
              }}>
              Confirm
            </Button>
          </DialogActions>
        </Dialog>
      </Grid>

      <ToastContainer />
    </Box>
  );
}

export default LocationMaster;
