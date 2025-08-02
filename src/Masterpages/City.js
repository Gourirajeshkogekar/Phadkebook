import React, { useState, useEffect, useMemo, useRef } from "react";
import axios from "axios";
import "./City.css";
import {
  MaterialReactTable,
  useMaterialReactTable,
} from "material-react-table";
import {
  Modal,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";
import Select from "react-select";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { RiDeleteBin5Line } from "react-icons/ri";
import { Tooltip } from "@mui/material";

function City() {
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

    fetchAllCities();
  }, []);
  const [CityName, setCityName] = useState("");
  const [CityCode, setCityCode] = useState("");
  const [StateCode, setStateCode] = useState("");

  const [convassor, setConvassor] = useState("");
  const [cities, setCities] = useState([]);
  const [states, setStates] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingIndex, setEditingIndex] = useState(-1);
  const [error, setError] = useState("");
  const [id, setId] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [errors, setErrors] = useState("");
  const [deleteId, setDeleteId] = useState(null);

  // Confirmation Dialog state
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [deleteIndex, setDeleteIndex] = useState(null);

  const citynameRef = useRef(null);
  const citycodeRef = useRef(null);
  const statecodeRef = useRef(null);

  const saveRef = useRef(null);

  const handleKeyDown = (e, nextFieldRef) => {
    if (e.key === "Enter") {
      e.preventDefault();
      if (nextFieldRef && nextFieldRef.current) {
        nextFieldRef.current.focus();
      }
    }
  };

  const fetchAllCities = async () => {
    try {
      const response = await axios.get(
        "https://publication.microtechsolutions.net.in/php/Cityget.php"
      );
      setCities(response.data);
    } catch (error) {
      toast.error("Error fetching cities:", error);
    }
  };

  useEffect(() => {
    fetchStates();
  }, []);

  const fetchStates = async () => {
    try {
      const response = await axios.get(
        "https://publication.microtechsolutions.net.in/php/State.php"
      );
      const stateOptions = response.data.map((state) => ({
        value: state.Id,
        label: state.StateName,
      }));
      setStates(stateOptions);
    } catch (error) {
      // toast.error("Error fetching states:", error);
    }
  };

  const resetForm = () => {
    setCityName("");
    setCityCode("");
    setStateCode("");
    setConvassor("");
    setIsModalOpen(false);
  };

  const handleNewClick = () => {
    resetForm();
    setIsModalOpen(true);
    setEditingIndex(-1);
  };

  const handleEdit = (row) => {
    const city = cities[row.index];
    setCityName(city.CityName);
    setCityCode(city.CityCode);
    setStateCode(city.StateCode);
    // setConvassor(city.convassor || ""); // Ensure convassor is correctly set
    setEditingIndex(row.index);
    setIsModalOpen(true);
    setId(city.Id);
    setIsEditing(true);
  };

  const handleDelete = (index, Id) => {
    setDeleteIndex(index);
    setDeleteId(Id);
    setIsDeleteDialogOpen(true); // Show confirmation dialog
  };

  const confirmDelete = () => {
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/x-www-form-urlencoded");

    const urlencoded = new URLSearchParams();
    urlencoded.append("Id", deleteId);

    const requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: urlencoded,
      redirect: "follow",
    };

    fetch(
      "https://publication.microtechsolutions.net.in/php/Citydelete.php",
      requestOptions
    )
      .then((response) => response.text())
      .then((result) => console.log(result))
      .catch((error) => console.error(error));
    toast.success("City Deleted Successfully");
    setIsDeleteDialogOpen(false);
    fetchAllCities();
  };

  const cancelDelete = () => {
    setIsDeleteDialogOpen(false);
    setDeleteIndex(null);
  };

  const validateForm = () => {
    let formErrors = {};
    let isValid = true;
    if (!CityName) {
      formErrors.CityName = "City Name is required.";
      isValid = false;
    }
    //     if (!CityCode) {
    //       formErrors.CityCode = "City Code is required.";
    //       isValid = false;
    //   }
    //   if (!StateCode) {
    //     formErrors.StateCode = "State Code is required.";
    //     isValid = false;
    // }
    setErrors(formErrors);
    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    const data = {
      CityName: CityName,
      CityCode: CityCode,
      StateCode: StateCode,
      CreatedBy: userId,
    };

    const url = isEditing
      ? "https://publication.microtechsolutions.net.in/php/Cityupdate.php"
      : "https://publication.microtechsolutions.net.in/php/Citypost.php";

    if (isEditing) {
      data.Id = id; // Add the record ID
      data.UpdatedBy = userId; // Add UpdatedBy with the UserId from sessionStorage
    }

    try {
      await axios.post(url, data, {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      });

      if (isEditing) {
        toast.success("City updated successfully!");
      } else {
        toast.success("City added successfully!");
      }
      setIsModalOpen(false);
      resetForm();
      fetchAllCities();
    } catch (error) {
      // console.error("Error saving record:", error);
      toast.error("Error saving record!");
    }
  };

  const removeDuplicateEntries = () => {
    const uniqueCities = cities.filter(
      (city, index, self) =>
        index === self.findIndex((c) => c.CityName === city.CityName)
    );
    if (uniqueCities.length === cities.length) {
      toast.info("No Duplicate Cities found");
    } else {
      setCities(uniqueCities);
      toast.success("Duplicate Cities removed");
    }
  };

  const columns = useMemo(
    () => [
      {
        accessorKey: "SrNo",
        header: "Sr.No",
        size: 50,
        Cell: ({ row }) => row.index + 1,
      },
      {
        accessorKey: "CityName",
        header: "City",
        size: 50,
      },

      {
        accessorKey: "actions",
        header: "Actions",
        size: 150,
        Cell: ({ row }) => (
          <div>
            <Button
              onClick={() => handleEdit(row)}
              style={{
                background: "#0a60bd",
                color: "white",
                marginRight: "5px",
              }}>
              Edit
              {/* <CiEdit style={{color: '#FFF', fontSize:'22px', fontWeight:700}}  /> */}
            </Button>
            <Button
              onClick={() => handleDelete(row.index, row.original.Id)}
              style={{
                background: "red",
                color: "white",
                fontSize: "22px",
              }}>
              <RiDeleteBin5Line />
            </Button>
          </div>
        ),
      },
    ],
    [cities]
  );

  const table = useMaterialReactTable({
    columns,
    data: cities,
    muiTableHeadCellProps: {
      style: {
        backgroundColor: "#E9ECEF", // Replace with your desired color
        color: "black",
        fontSize: "16px",
      },
    },
  });

  return (
    <div className="city-container">
      <h1>City Master</h1>
      <div className="citytable-master">
        <div className="citytable1-master">
          <Button
            onClick={handleNewClick}
            style={{
              color: "#FFFF",
              fontWeight: "700",
              background: "#0a60bd",
              width: "15%",
            }}>
            New
          </Button>
          <Button
            onClick={removeDuplicateEntries}
            style={{
              color: "orange",
              background: "#0a60bd",
              fontWeight: "700",
              marginLeft: "10px",
            }}>
            Remove Duplicate
          </Button>
          <div className="citytable-container">
            <MaterialReactTable table={table} />
          </div>
        </div>
        {isModalOpen && (
          <div className="city-overlay" onClick={() => setIsModalOpen(false)} />
        )}

        <Modal open={isModalOpen}>
          <div className="city-modal">
            <h2
              style={{
                textAlign: "center",
                fontWeight: "620",
                margin: "2px",
                fontSize: "27px",
              }}>
              {editingIndex >= 0 ? "Edit City " : "Add City "}
            </h2>

            <form className="city-form">
              <div>
                <label className="city-label">
                  City Name<b className="required">*</b>
                </label>
                <div>
                  <Tooltip
                    title={
                      <span style={{ fontSize: "14px", fontWeight: "bold" }}>
                        {CityName}
                      </span>
                    }
                    arrow>
                    <input
                      type="text"
                      id="CityName"
                      name="CityName"
                      value={CityName}
                      onChange={(e) => setCityName(e.target.value)}
                      maxLength={50}
                      ref={citynameRef}
                      onKeyDown={(e) => handleKeyDown(e, citycodeRef)}
                      className="city-control"
                      placeholder="Enter City Name"
                    />
                  </Tooltip>
                  <div>
                    {errors.CityName && (
                      <b className="error-text">{errors.CityName}</b>
                    )}
                  </div>
                </div>
              </div>

              <div>
                <label className="city-label">
                  City Code<b className="required">*</b>
                </label>
                <div>
                  <input
                    type="number"
                    id="CityCode"
                    name="CityCode"
                    value={CityCode}
                    onChange={(e) => setCityCode(e.target.value)}
                    maxLength={50}
                    ref={citycodeRef}
                    onKeyDown={(e) => handleKeyDown(e, statecodeRef)}
                    className="city-control"
                    placeholder="Enter City Code"
                  />
                  <div>
                    {errors.CityCode && (
                      <b className="error-text">{errors.CityCode}</b>
                    )}
                  </div>
                </div>
              </div>

              <div>
                <label className="city-label">
                  State Code<b className="required">*</b>
                </label>
                <div>
                  <Select
                    id="StateCode"
                    name="StateCode"
                    value={states.find((option) => option.value === StateCode)}
                    onChange={(selectedOption) =>
                      setStateCode(selectedOption ? selectedOption.value : "")
                    }
                    ref={statecodeRef}
                    onKeyDown={(e) => handleKeyDown(e, saveRef)}
                    options={states}
                    placeholder="Select State"
                    styles={{
                      control: (base) => ({
                        ...base,
                        marginTop: "5px",
                        minHeight: "38px",
                        borderRadius: "4px",
                        border: "1px solid #ccc",
                      }),
                    }}
                  />
                  <div>
                    {errors.StateCode && (
                      <b className="error-text">{errors.StateCode}</b>
                    )}
                  </div>
                </div>
              </div>
            </form>

            <div className="city-btn-container">
              <Button
                type="submit"
                ref={saveRef}
                // onKeyDown={(e) => handleKeyDown(e, accgroupnameRef)}
                style={{
                  background: "#0a60bd",
                  color: "white",
                }}
                onClick={handleSubmit}>
                {editingIndex >= 0 ? "Update" : "Save"}
              </Button>
              <Button
                onClick={() => setIsModalOpen(false)}
                style={{
                  background: "red",
                  color: "white",
                }}>
                Cancel
              </Button>
            </div>
          </div>
        </Modal>

        {/* Confirmation Dialog for Delete */}
        <Dialog open={isDeleteDialogOpen} onClose={cancelDelete}>
          <DialogTitle style={{ color: "navy", fontWeight: "600" }}>
            Confirm Deletion
          </DialogTitle>
          <DialogContent>
            Are you sure you want to delete this{" "}
            <b style={{ color: "red" }}>
              <u>City</u>
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
              onClick={confirmDelete}
              style={{
                background: "#0a60bd",
                color: "white",
                marginRight: "5px",
              }}>
              Confirm
            </Button>
          </DialogActions>
        </Dialog>
      </div>
      <ToastContainer />
    </div>
  );
}

export default City;
