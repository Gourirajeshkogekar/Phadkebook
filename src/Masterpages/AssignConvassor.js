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
import CreatableSelect from "react-select/creatable";
import { TextField, MenuItem } from "@mui/material";
import Autocomplete from "@mui/material/Autocomplete";

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

  const [AreaId, setAreadId] = useState("");
  const [IsAssigned, setIsAssigned] = useState(false);
  const [canvassors, setCanvassors] = useState([]);
  const [assignCanvassors, setAssignCanvassors] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingIndex, setEditingIndex] = useState(-1);
  const [CityId, setCityId] = useState("");
  const [CanvassorId, setCanvassorId] = useState("");
  const [StateId, setStateId] = useState("");
  const [StateName, setStateName] = useState("");
  const [CityName, setCityName] = useState("");
  const [cityOptions, setCityOptions] = useState([]);
  const [stateOptions, setStateOptions] = useState([]);
  const [areaOptions, setareaOptions] = useState([]);
  // { value: Id, label: Name }
  const [selectedCities, setSelectedCities] = useState([]);

  const [errors, setErrors] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [id, setId] = useState("");
  const [deleteId, setDeleteId] = useState(null);
  const [assignTableData, setAssignTableData] = useState([]);

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
    setCanvassorId("");
    setAreadId("");
    setCityId("");
    setIsAssigned(false);
    setStateId("");
    setIsModalOpen(false);
    setAssignTableData([]); // 🔥 RESET TABLE
  };

  const handleNewClick = () => {
    resetForm();
    setIsModalOpen(true);
    setEditingIndex(-1);
    setIsEditing(false); // ✅ ADD MODE
  };

  const loadEditAreas = async (CityId, CanvassorId, AssignId) => {
    try {
      const res = await axios.get(
        "https://publication.microtechsolutions.net.in/php/get/getAssignCanvassor.php",
        { params: { CityId, CanvassorId } }
      );

      const data = res.data;

      const tableData = (data.Areas || []).map((area, index) => ({
        SrNo: index + 1,

        // ✅ STATE (FROM ROOT)
        StateId: data.State?.Id,
        StateName: data.State?.Name,

        // ✅ CITY (FROM ROOT)
        CityId: data.City?.Id,
        CityName: data.City?.Name,

        // ✅ AREA
        AreaId: area.Id,
        AreaName: area.Name,

        CanvassorId,
        AssignId,

        AlreadyAssigned:
          data.canvassorAlreadyAssigned?.status === 1 ? "Yes" : "No",
        IsAssigned: true, // edit mode = already assigned
      }));

      setAssignTableData(tableData);
    } catch (err) {
      toast.error("Failed to load edit data");
    }
  };

  const handleEdit = (row) => {
    const mode = row.original;

    setCanvassorId(mode.CanvassorId);
    setCityId(mode.CityId);
    setStateId(mode.StateId);
    setStateName(mode.StateName); // ✅ now works
    setCityName(mode.CityName); // ✅ now works
    setId(mode.Id);

    setIsEditing(true);
    setIsModalOpen(true);

    loadEditAreas(mode.CityId, mode.CanvassorId, mode.Id);
  };

  // const handleOkClick = async () => {
  //   if (!CityId || !CanvassorId) {
  //     toast.error("Please select City and Canvassor");
  //     return;
  //   }

  //   // 🚫 prevent duplicate city
  //   const cityAlreadyAdded = assignTableData.some(
  //     (row) => row.CityId === CityId
  //   );

  //   if (cityAlreadyAdded) {
  //     toast.warning("This city is already added");
  //     return;
  //   }

  //   try {
  //     const res = await axios.get(
  //       "https://publication.microtechsolutions.net.in/php/get/getAssignCanvassor.php",
  //       { params: { CityId, CanvassorId } }
  //     );

  //     const data = res.data;

  //     if (!data?.Areas?.length) {
  //       toast.info("No areas found for selected city");
  //       return;
  //     }

  //     const newRows = data.Areas.map((area, index) => ({
  //       SrNo: assignTableData.length + index + 1,

  //       StateId: data.State.Id,
  //       StateName: data.State.Name,

  //       CityId: data.City.Id,
  //       CityName: data.City.Name,

  //       AreaId: area.Id,
  //       AreaName: area.Name,

  //       CanvassorId: data.Canvassor.Id,
  //       CanvassorName: data.Canvassor.Name,

  //       AlreadyAssigned: data.AlreadyAssigned?.status === 1 ? "Yes" : "No",
  //       IsAssigned: false,
  //     }));

  //     // ✅ APPEND instead of replace
  //     setAssignTableData((prev) => [...prev, ...newRows]);

  //     // optional UX reset
  //     setCityId("");
  //   } catch (err) {
  //     toast.error("Failed to load city data");
  //   }
  // };

  const handleOkClick = async () => {
    if (!CityId || !CanvassorId) {
      toast.error("Please select City and Canvassor");
      return;
    }

    const cityAlreadyAdded = assignTableData.some(
      (row) => row.CityId === CityId
    );

    if (cityAlreadyAdded) {
      toast.warning("This city is already added");
      return;
    }

    try {
      const res = await axios.get(
        "https://publication.microtechsolutions.net.in/php/get/getAssignCanvassor.php",
        { params: { CityId, CanvassorId } }
      );

      const responseData = res.data;

      if (!responseData?.success || !responseData?.data?.length) {
        toast.info("No areas found for selected city");
        return;
      }

      const newRows = [];

      responseData.data.forEach((item) => {
        const assignedList =
          item.canvassorAlreadyAssigned &&
          item.canvassorAlreadyAssigned !== "No"
            ? item.canvassorAlreadyAssigned.split(",")
            : [];

        newRows.push({
          // ✅ IDs (THIS FIXES YOUR ISSUE)
          StateId: item.stateId,
          CityId: item.City?.Id || item.cityId || CityId, // ✅ FALLBACK to state
          AreaId: item.areaId,

          // ✅ Names (UI only)
          StateName: item.state,
          CityName: item.cityName,
          AreaName: item.area,

          canvassorAlreadyAssigned:
            assignedList.length > 0 ? assignedList.join(", ") : "No",

          IsAssigned: assignedList.length === 0 ? false : true,
        });
      });

      setAssignTableData(newRows);

      // ✅ ONLY THIS — ONCE
      setAssignTableData(newRows);

      toast.success(`${newRows.length} rows loaded`);
      setCityId("");
    } catch (err) {
      console.error(err);
      toast.error("Failed to load city data");
    }
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
        "https://publication.microtechsolutions.net.in/php/get/getCanvassorMaster.php"
      );
      setCanvassors(response.data);
    } catch (error) {
      // toast.error("Error fetching convassors:", error);
    }
  };

  const fetchAssignconvassors = async () => {
    try {
      const res = await axios.get(
        "https://publication.microtechsolutions.net.in/php/get/getAssignCanvassor.php"
      );

      const activeAssignments = (res.data.Assignments || [])
        .filter((item) => Number(item.Active) === 1)
        .map((item) => {
          const canvassor = res.data.Canvassors.find(
            (c) => c.Name === item.CanvassorName
          );

          return {
            ...item,
            CanvassorId: canvassor ? canvassor.Id : null,
          };
        });

      setAssignCanvassors(activeAssignments);
    } catch (err) {
      toast.error("Failed to load assignments");
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
      console.log("Fetched city options:", cityOptions);
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
    fetchAssignconvassors();
    fetchAllCities();
    fetchStates();
    fetchAreas();
  }, []);

  const validateForm = () => {
    let formErrors = {};
    let isValid = true;

    if (!CanvassorId) {
      formErrors.CanvassorId = "Canvassor Name is required.";
      isValid = false;
    }

    setErrors(formErrors);
    return isValid;
  };

  // const handleOkClick = async () => {
  //   if (!CityId || !CanvassorId) {
  //     toast.error("Please select City and Canvassor");
  //     return;
  //   }

  //   try {
  //     const res = await axios.get(
  //       "https://publication.microtechsolutions.net.in/php/get/getAssignCanvassor.php",
  //       {
  //         params: { CityId, CanvassorId },
  //       }
  //     );

  //     const data = res.data;

  //     // ✅ Proper validation
  //     if (
  //       !data ||
  //       !data.City ||
  //       !data.State ||
  //       !Array.isArray(data.Areas) ||
  //       data.Areas.length === 0
  //     ) {
  //       toast.info("No data found for selected City and Canvassor");
  //       setAssignTableData([]);
  //       return;
  //     }

  //     // ✅ Convert Areas array → table rows
  //     const tableData = data.Areas.map((area, index) => ({
  //       SrNo: index + 1,
  //       StateId: data.State.Id,
  //       StateName: data.State.Name,

  //       CityId: data.City.Id,
  //       CityName: data.City.Name,

  //       AreaId: area.Id,
  //       AreaName: area.Name,

  //       CanvassorId: data.Canvassor.Id,
  //       CanvassorName: data.Canvassor.Name,

  //       AlreadyAssigned: data.AlreadyAssigned?.status === 1 ? "Yes" : "No",
  //       IsAssigned: false,
  //     }));

  //     setAssignTableData(tableData);
  //     console.log("Assign Table Data:", tableData);
  //   } catch (err) {
  //     console.error(err);
  //     toast.error("Failed to load area data");
  //   }
  // };

  const handleSave = async (e) => {
    e.preventDefault();

    const selectedRows = assignTableData.filter(
      (row) => row.IsAssigned === true
    );

    if (selectedRows.length === 0) {
      toast.error("Please select at least one area");
      return;
    }

    // 🔑 choose URL based on mode
    const url = isEditing
      ? "https://publication.microtechsolutions.net.in/php/AssignCanvassorupdate.php"
      : "https://publication.microtechsolutions.net.in/php/AssignCanvassorpost.php";

    try {
      for (const row of selectedRows) {
        const body = new URLSearchParams();

        body.append("CanvassorId", CanvassorId);
        body.append("StateId", row.StateId);
        body.append("CityId", row.CityId);
        body.append("AreaId", row.AreaId);
        body.append("IsAssigned", 1);

        if (isEditing) {
          // 🔁 UPDATE CASE
          body.append("UpdatedBy", userId);
          body.append("Id", row.AssignId); // IMPORTANT: assignment primary key
        } else {
          // ✅ SAVE CASE
          body.append("CreatedBy", userId);
        }

        await axios.post(url, body, {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
        });
      }

      toast.success(
        isEditing
          ? "Canvassor assignment updated successfully ✅"
          : "Canvassor assigned successfully ✅"
      );

      setIsModalOpen(false);
      setAssignTableData([]);
      setIsEditing(false);
      fetchAssignconvassors(); // refresh main table
    } catch (err) {
      console.error(err);
      toast.error("Save / Update failed ❌");
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
        header: "Canvassor Name",
        Cell: ({ row }) => row.original.CanvassorName || "Unknown",
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
    []
  );

  const table = useMaterialReactTable({
    columns,
    data: assignCanvassors,
    muiTableHeadCellProps: {
      style: {
        backgroundColor: "#E9ECEF", // Replace with your desired color
        color: "black",
        fontSize: "16px",
      },
    },
  });

  return (
    <div className="assigncanvassor-container">
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
          <div className="assigncanvassor-modal">
            <h1
              style={{
                textAlign: "center",
                fontWeight: "620",
                margin: "2px",
                fontSize: "27px",
              }}>
              {isEditing ? "Edit Assign Canvassor" : "Add Assign Canvassor"}
            </h1>
            <form onSubmit={handleSave} className="assigncanvassor-form">
              <div className="assign-top-section">
                <div className="assign-row">
                  <div className="assign-field">
                    <label>Canvassor Name</label>
                    <TextField
                      select
                      // label="Canvassor"
                      fullWidth
                      value={CanvassorId || ""}
                      onChange={(e) => {
                        console.log("Selected CanvassorId:", e.target.value);
                        setCanvassorId(e.target.value);
                      }}>
                      {canvassors.map((c) => (
                        <MenuItem key={c.Id} value={c.Id}>
                          {c.CanvassorName}
                        </MenuItem>
                      ))}
                    </TextField>
                  </div>

                  <div className="assign-field">
                    <label>City</label>
                    <Autocomplete
                      options={cityOptions}
                      getOptionLabel={(option) => option.label}
                      value={
                        cityOptions.find((c) => c.value === CityId) || null
                      }
                      onChange={(event, newValue) => {
                        setCityId(newValue ? newValue.value : "");
                      }}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          placeholder="Type City name..."
                        />
                      )}
                      filterOptions={(options, { inputValue }) =>
                        options.filter((option) =>
                          option.label
                            .toLowerCase()
                            .startsWith(inputValue.toLowerCase())
                        )
                      }
                    />
                  </div>

                  <button
                    type="button"
                    className="assignok-btn"
                    onClick={handleOkClick}>
                    OK
                  </button>
                </div>
              </div>

              <table className="assign-table">
                <thead>
                  <tr>
                    <th>State</th>
                    <th>City/District</th>
                    <th>Area</th>
                    <th>Canvassor Already Assigned</th>
                    <th>Assign above Canvassor</th>
                  </tr>
                </thead>

                <tbody>
                  {assignTableData.map((row, index) => (
                    <tr key={index}>
                      <td>{row.StateName}</td>
                      <td>{row.CityName}</td>
                      <td>{row.AreaName}</td>
                      <td>{row.canvassorAlreadyAssigned || "No"}</td>
                      <td>
                        <input
                          type="checkbox"
                          checked={row.IsAssigned}
                          onChange={(e) => {
                            const updated = [...assignTableData];
                            updated[index].IsAssigned = e.target.checked;
                            setAssignTableData(updated);
                          }}
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <div className="assign-btn-container">
                <button
                  onClick={() => {
                    setAssignTableData(
                      assignTableData.map((row) => ({
                        ...row,
                        IsAssigned: true,
                      }))
                    );
                  }}>
                  Select All
                </button>

                <button
                  onClick={() => {
                    setAssignTableData(
                      assignTableData.map((row) => ({
                        ...row,
                        IsAssigned: false,
                      }))
                    );
                  }}>
                  Deselect All
                </button>

                <button
                  onClick={async () => {
                    const selectedRows = assignTableData.filter(
                      (r) => r.IsAssigned
                    );

                    if (selectedRows.length === 0) {
                      toast.error("No rows selected!");
                      return;
                    }

                    try {
                      await axios.post(
                        "https://publication.microtechsolutions.net.in/php/AssignCanvassorAssignPost.php",
                        {
                          CanvassorId: CanvassorId,
                          rows: selectedRows,
                          CreatedBy: userId,
                        },
                        {
                          headers: { "Content-Type": "application/json" },
                        }
                      );

                      toast.success("Data saved successfully!");
                      setIsModalOpen(false);
                    } catch (err) {
                      toast.error("Save failed!");
                    }
                  }}>
                  Save
                </button>
                <button onClick={() => setIsModalOpen(false)}>Exit</button>
              </div>
            </form>
            <div className="assigncanvassor-btn-container">
              <Button
                onClick={handleSave}
                ref={saveRef}
                type="submit"
                style={{
                  background: "#0a60bd",
                  alignContent: "center",
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
