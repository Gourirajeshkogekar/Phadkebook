import React, { useState, useEffect, useMemo, useRef } from "react";
import axios from "axios";
import "./State.css";
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
import { CiEdit } from "react-icons/ci";
import { Tooltip } from "@mui/material";

function State() {
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

    fetchStates();
  }, []);

  const [convassor, setConvassor] = useState("");
  const [StateName, setStateName] = useState("");
  const [StateCode, setStateCode] = useState("");

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

  const statenameRef = useRef(null);
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
  useEffect(() => {
    fetchStates();
  }, []);

  const fetchStates = async () => {
    try {
      const response = await axios.get(
        "https://publication.microtechsolutions.net.in/php/State.php"
      );

      setStates(response.data);
    } catch (error) {
      // toast.error("Error fetching states:", error);
    }
  };

  const resetForm = () => {
    setStateName("");
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
    const state = states[row.index];
    setStateName(state.StateName);
    setStateCode(state.StateCode);
    setEditingIndex(row.index);
    setId(state.Id);
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
      "https://publication.microtechsolutions.net.in/php/Statedelete.php",
      requestOptions
    )
      .then((response) => response.text())
      .then((result) => console.log(result))
      .catch((error) => console.error(error));
    toast.success("State Deleted Successfully");
    setIsDeleteDialogOpen(false);
    fetchStates();
  };

  const cancelDelete = () => {
    setIsDeleteDialogOpen(false);
    setDeleteIndex(null);
  };

  const validateForm = () => {
    let formErrors = {};
    let isValid = true;

    if (!StateName) {
      formErrors.StateName = "State Name is required.";
      isValid = false;
    }

    //   if (!StateCode) {
    //     formErrors.StateCode = "State Code is required.";
    //     isValid = false;

    // }

    setErrors(formErrors);
    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent the default form submission
    if (!validateForm()) return;

    const data = {
      StateName: StateName,
      StateCode: StateCode,
      CreatedBy: userId,
    };

    const url = isEditing
      ? "https://publication.microtechsolutions.net.in/php/Stateupdate.php"
      : "https://publication.microtechsolutions.net.in/php/Statepost.php";

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
        toast.success("State updated successfully!");
      } else {
        toast.success("State added successfully!");
      }
      setIsModalOpen(false);
      resetForm();
      fetchStates(); // Refresh the list after submit
    } catch (error) {
      console.error("Error saving record:", error);
      toast.error("Error saving record!");
    }
  };

  const removeDuplicateEntries = () => {
    const uniqueStates = states.filter(
      (state, index, self) =>
        index === self.findIndex((s) => s.StateName === state.StateName)
    );
    if (uniqueStates.length === states.length) {
      toast.info("No Duplicate States found");
    } else {
      setStates(uniqueStates);
      toast.success("Duplicate States removed");
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
        accessorKey: "StateName",
        header: "State Name",
        size: 50,
      },
      {
        accessorKey: "StateCode",
        header: "State Code",
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
    [states]
  );

  const table = useMaterialReactTable({
    columns,
    data: states,
    muiTableHeadCellProps: {
      style: {
        backgroundColor: "#E9ECEF", // Replace with your desired color
        color: "black",
        fontSize: "16px",
      },
    },
  });

  return (
    <div className="state-container">
      <h1>State Master</h1>
      <div className="statetable-master">
        <div className="statetable1-master">
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
              fontWeight: "700",
              marginLeft: "10px",
              background: "#0a60bd",
            }}>
            Remove Duplicate
          </Button>
          <div className="statetable-container">
            <MaterialReactTable table={table} />
          </div>
        </div>

        {isModalOpen && (
          <div
            className="state-overlay"
            onClick={() => setIsModalOpen(false)}
          />
        )}

        <Modal open={isModalOpen}>
          <div className="state-modal">
            <h2
              style={{
                textAlign: "center",
                fontWeight: "620",
                margin: "2px",
                fontSize: "27px",
              }}>
              {editingIndex >= 0 ? "Edit State " : "Add State "}
            </h2>

            <form className="state-form">
              <div>
                <label className="state-label">
                  {" "}
                  State Code<b className="required">*</b>
                </label>
                <div>
                  <input
                    type="number"
                    id="StateCode"
                    name="StateCode"
                    value={StateCode}
                    onChange={(e) => setStateCode(e.target.value)}
                    maxLength={50}
                    ref={statecodeRef}
                    onKeyDown={(e) => handleKeyDown(e, saveRef)}
                    className="state-control"
                    style={{ background: "	#D0D0D0" }}
                    placeholder="Auto-Incremented"
                    readOnly
                  />
                  <div>
                    {errors.StateCode && (
                      <b className="error-text">{errors.StateCode}</b>
                    )}
                  </div>
                </div>
              </div>

              <div>
                <label className="state-label">
                  {" "}
                  State Name<b className="required">*</b>
                </label>
                <div>
                  <Tooltip
                    title={
                      <span style={{ fontSize: "14px", fontWeight: "bold" }}>
                        {StateName}
                      </span>
                    }
                    arrow>
                    <input
                      type="text"
                      id="StateName"
                      name="StateName"
                      value={StateName}
                      onChange={(e) => setStateName(e.target.value)}
                      maxLength={50}
                      ref={statenameRef}
                      onKeyDown={(e) => handleKeyDown(e, statecodeRef)}
                      className="state-control"
                      placeholder="Enter State Name"
                    />
                  </Tooltip>
                  <div>
                    {errors.StateName && (
                      <b className="error-text">{errors.StateName}</b>
                    )}
                  </div>
                </div>
              </div>
            </form>

            <div className="state-btn-container">
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
              <u>State</u>
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

export default State;
