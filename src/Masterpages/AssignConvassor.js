import React, { useState, useMemo, useEffect, useRef } from "react";
import axios from "axios";
import "./AssignConvassor.css";
import {
  MaterialReactTable,
  useMaterialReactTable,
} from "material-react-table";
import Select from "react-select";
import {
  Modal,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { RiDeleteBin5Line } from "react-icons/ri";
import { Tooltip } from "@mui/material";

function Assignconvassor() {
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

    fetchConvassors();
  }, []);

  const [CanvassorName, setCanvassorName] = useState("");
  const [AreaId, setAreadId] = useState("");
  const [IsAssigned, setIsAssigned] = useState(false);
  const [canvassors, setCanvassors] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingIndex, setEditingIndex] = useState(-1);
  const [CityId, setCityId] = useState("");
  const [StateId, setStateId] = useState("");
  const [cityOptions, setCityOptions] = useState([]);
  const [stateOptions, setStateOptions] = useState([]);
  const [areaOptions, setareaOptions] = useState([]);

  const [errors, setErrors] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [id, setId] = useState("");
  const [deleteId, setDeleteId] = useState(null);

  // Confirmation Dialog state
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [deleteIndex, setDeleteIndex] = useState(null);

  //functionality of Enter next
  const canvassornameRef = useRef(null);
  const stateRef = useRef(null);
  const cityRef = useRef(null);
  const areaRef = useRef(null);
  const assignCanRef = useRef(null);

  const saveRef = useRef(null);

  const handleKeyDown = (e, nextFieldRef) => {
    if (e.key === "Enter") {
      e.preventDefault();
      if (nextFieldRef && nextFieldRef.current) {
        nextFieldRef.current.focus();
      }
    }
  };

  const resetForm = () => {
    setCanvassorName("");
    setAreadId("");
    setCityId("");
    setIsAssigned(false);
    setStateId("");
    setIsModalOpen(false);
  };

  const handleNewClick = () => {
    resetForm();
    setIsModalOpen(true);
    setEditingIndex(-1);
    setIsEditing(false);
  };

  const handleEdit = (row) => {
    // console.log("Editing row:", row);
    const canvassor = canvassors[row.index];
    // console.log("Canvassor data:", canvassor);
    setCanvassorName(canvassor.CanvassorName || "");
    setCityId(canvassor.CityId || "");
    setStateId(canvassor.StateId || "");
    setAreadId(canvassor.AreaId || "");
    setIsAssigned(canvassor.IsAssigned || false);
    setEditingIndex(row.index);
    setId(canvassor.Id || "");
    setIsEditing(true);
    setIsModalOpen(true);
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
      "https://publication.microtechsolutions.net.in/php/Assigncanvassordelete.php",
      requestOptions
    )
      .then((response) => response.text())
      .then((result) => console.log(result))
      .catch((error) => console.error(error));
    toast.success("Canvassor Deleted Successfully");
    setIsDeleteDialogOpen(false);
    fetchConvassors();
  };

  const cancelDelete = () => {
    setIsDeleteDialogOpen(false);
    setDeleteIndex(null);
  };

  const fetchConvassors = async () => {
    try {
      const response = await axios.get(
        "https://publication.microtechsolutions.net.in/php/AssignCanvassorget.php"
      );
      setCanvassors(response.data);
    } catch (error) {
      // toast.error("Error fetching convassors:", error);
    }
  };

  const fetchStates = async () => {
    try {
      const response = await axios.get(
        "https://publication.microtechsolutions.net.in/php/State.php"
      );
      const stateOptions = response.data.map((state) => ({
        value: state.Id,
        label: state.StateName,
      }));
      setStateOptions(stateOptions);
    } catch (error) {
      // toast.error("Error fetching states:", error);
    }
  };

  const fetchAllCities = async () => {
    try {
      const response = await axios.get(
        "https://publication.microtechsolutions.net.in/php/Cityget.php"
      );
      const cityOptions = response.data.map((city) => ({
        value: city.Id,
        label: city.CityName,
      }));
      setCityOptions(cityOptions);
    } catch (error) {
      // toast.error("Error fetching cities:", error);
    }
  };

  const fetchAreas = async () => {
    try {
      const response = await axios.get(
        "https://publication.microtechsolutions.net.in/php/Areaget.php"
      );
      const areaOptions = response.data.map((area) => ({
        value: area.Id,
        label: area.AreaName,
      }));
      setareaOptions(areaOptions);
    } catch (error) {
      // toast.error("Error fetching areas:", error);
    }
  };

  useEffect(() => {
    fetchConvassors();
    fetchAllCities();
    fetchStates();
    fetchAreas();
  }, []);

  const validateForm = () => {
    let formErrors = {};
    let isValid = true;

    if (!CanvassorName) {
      formErrors.CanvassorName = "Canvassor Name is required.";
      isValid = false;
    }

    setErrors(formErrors);
    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent the default form submission
    if (!validateForm()) return;

    // Prepare the data payload
    const data = {
      CanvassorName: CanvassorName,
      CityId: CityId,
      StateId: StateId,
      AreaId: AreaId,
      IsAssigned: IsAssigned,
      CreatedBy: userId,
    };

    // Determine the URL based on whether we're editing or adding
    const url = isEditing
      ? "https://publication.microtechsolutions.net.in/php/AssignCanvassorupdate.php"
      : "https://publication.microtechsolutions.net.in/php/AssignCanvassorpost.php";

    // If editing, include the ID in the payload
    if (isEditing) {
      data.Id = id;
      data.UpdatedBy = userId;
    }

    console.log("Submitting data:", data); // Debugging line

    try {
      await axios.post(url, data, {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      });

      if (isEditing) {
        toast.success("Canvassor updated successfully!");
      } else {
        toast.success("Canvassor added successfully!");
      }
      setIsModalOpen(false);
      resetForm();
      fetchConvassors(); // Refresh the list after submit
    } catch (error) {
      console.error("Error saving record:", error);
      toast.error("Error saving record!");
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
        accessorKey: "CanvassorName",
        header: "Canvassor Name",
        size: 50,
      },

      {
        accessorKey: "IsAssigned",
        header: "Convassor Assigned",
        size: 50,
        Cell: ({ cell }) => <span>{cell.getValue() === 1 ? "Yes" : "No"}</span>,
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
    [canvassors]
  );

  const table = useMaterialReactTable({
    columns,
    data: canvassors,
    muiTableHeadCellProps: {
      style: {
        backgroundColor: "#E9ECEF", // Replace with your desired color
        color: "black",
        fontSize: "16px",
      },
    },
  });

  return (
    <div className="canvassor-container">
      {/* <h1>
      Assign Canvassor Master
    </h1> */}

      <h1>Assign Canvassor Master</h1>

      <div className="canvassortable-master">
        <div className="canvassortable1-master">
          <Button
            onClick={handleNewClick}
            style={{
              color: "#FFFF",
              fontWeight: "700",
              background: "#0a60bd",
              width: "15%",
            }}>
            {" "}
            New
          </Button>
          <div className="canvassortable-container">
            <MaterialReactTable table={table} />
          </div>
        </div>

        {isModalOpen && (
          <div
            className="canvassor-overlay"
            onClick={() => setIsModalOpen(false)}
          />
        )}

        <Modal open={isModalOpen}>
          <div className="canvassor-modal">
            <h1
              style={{
                textAlign: "center",
                fontWeight: "620",
                margin: "2px",
                fontSize: "27px",
              }}>
              {editingIndex >= 0
                ? "Edit Assign Canvassor"
                : "Add Assign Canvassor"}
            </h1>
            <form onSubmit={handleSubmit} className="canvassor-form">
              <div>
                <label className="canvassor-label">
                  Canvassor Name <b className="required">*</b>
                </label>{" "}
                <div>
                  <Tooltip
                    title={
                      <span style={{ fontSize: "14px", fontWeight: "bold" }}>
                        {CanvassorName}
                      </span>
                    }
                    arrow>
                    <input
                      type="text"
                      id="CanvassorName"
                      name="CanvassorName"
                      value={CanvassorName || ""}
                      onChange={(e) => setCanvassorName(e.target.value)}
                      maxLength={50}
                      ref={canvassornameRef}
                      onKeyDown={(e) => handleKeyDown(e, stateRef)}
                      className="canvassor-control"
                      placeholder="Enter canvassor Name"
                    />
                  </Tooltip>

                  <div>
                    {errors.CanvassorName && (
                      <b className="error-text">{errors.CanvassorName}</b>
                    )}
                  </div>
                </div>
              </div>

              <div>
                <label className="canvassor-label">
                  State <b className="required">*</b>
                </label>{" "}
                <div>
                  <Select
                    id="StateId"
                    name="StateId"
                    value={
                      stateOptions.find((option) => option.value === StateId) ||
                      null
                    }
                    onChange={(option) => setStateId(option.value)}
                    ref={stateRef}
                    onKeyDown={(e) => handleKeyDown(e, cityRef)}
                    options={stateOptions}
                    styles={{
                      control: (base) => ({
                        ...base,
                        width: "170px",
                        marginTop: "10px",
                        borderRadius: "4px",
                        border: "1px solid rgb(223, 222, 222)",
                        marginBottom: "5px",
                      }),
                    }}
                    placeholder="Select State"
                  />{" "}
                  <div>
                    {errors.StateId && (
                      <b className="error-text">{errors.StateId}</b>
                    )}
                  </div>
                </div>
              </div>

              <div>
                <label className="canvassor-label">
                  City <b className="required">*</b>
                </label>{" "}
                <div>
                  <Select
                    id="CityId"
                    name="CityId"
                    value={
                      cityOptions.find((option) => option.value === CityId) ||
                      null
                    }
                    onChange={(option) => setCityId(option.value)}
                    ref={cityRef}
                    onKeyDown={(e) => handleKeyDown(e, areaRef)}
                    options={cityOptions}
                    styles={{
                      control: (base) => ({
                        ...base,
                        width: "170px",
                        marginTop: "10px",
                        borderRadius: "4px",
                        border: "1px solid rgb(223, 222, 222)",
                        marginBottom: "5px",
                      }),
                    }}
                    placeholder="Select City"
                  />{" "}
                  <div>
                    {errors.CityId && (
                      <b className="error-text">{errors.CityId}</b>
                    )}
                  </div>
                </div>
              </div>

              <div>
                <label className="canvassor-label">
                  Area <b className="required">*</b>
                </label>{" "}
                <div>
                  <Select
                    id="AreaId"
                    name="AreaId"
                    value={
                      areaOptions.find((option) => option.value === AreaId) ||
                      null
                    }
                    onChange={(option) => setAreadId(option.value)}
                    ref={areaRef}
                    onKeyDown={(e) => handleKeyDown(e, assignCanRef)}
                    options={areaOptions}
                    styles={{
                      control: (base) => ({
                        ...base,
                        width: "170px",
                        marginTop: "10px",
                        borderRadius: "4px",
                        border: "1px solid rgb(223, 222, 222)",
                        marginBottom: "5px",
                      }),
                    }}
                    placeholder="Enter Area"
                  />
                  <div>
                    {errors.AreaId && (
                      <b className="error-text">{errors.AreaId}</b>
                    )}
                  </div>
                </div>
              </div>
              <div>
                <label className="canvassor-label">Assign Canvassor</label>{" "}
                {/* <div> */}
                <input
                  type="checkbox"
                  id="IsAssigned"
                  name="IsAssigned"
                  checked={IsAssigned}
                  onChange={(e) => setIsAssigned(e.target.checked)}
                  ref={assignCanRef}
                  onKeyDown={(e) => handleKeyDown(e, saveRef)}
                  // className="canvassor-control"
                />
                {/* </div> */}
              </div>
            </form>
            <div className="canvassor-btn-container">
              <Button
                type="submit"
                onClick={handleSubmit}
                ref={saveRef}
                // onKeyDown={(e) => handleKeyDown(e, accgroupnameRef)}
                style={{
                  background: "#0a60bd",
                  color: "white",
                }}>
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
              <u>Canvassor</u>
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

export default Assignconvassor;
