import React, { useMemo, useState, useEffect, useRef } from "react";
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
import axios from "axios";
import "./LevelMaster.css";
import Select from "react-select";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { RiDeleteBin5Line } from "react-icons/ri";
import { CiEdit } from "react-icons/ci";
import { Tooltip } from "@mui/material";

const LevelMaster = () => {
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

    fetchLevels();
  }, []);

  const [levels, setLevels] = useState([]);
  const [LevelName, setLevelName] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingIndex, setEditingIndex] = useState(-1);
  const [users, setUsers] = useState([]);

  const [errors, setErrors] = useState("");
  const [id, setId] = useState("");
  const [deleteId, setDeleteId] = useState(null);

  // Confirmation Dialog state
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [deleteIndex, setDeleteIndex] = useState(null);

  const levelRef = useRef(null);
  const saveRef = useRef(null);

  const handleKeyDown = (e, nextFieldRef) => {
    if (e.key === "Enter") {
      e.preventDefault();
      if (nextFieldRef && nextFieldRef.current) {
        nextFieldRef.current.focus();
      }
    }
  };

  const fetchLevels = async () => {
    try {
      const response = await axios.get(
        "https://publication.microtechsolutions.net.in/php/Levelmasterget.php"
      );

      setLevels(response.data);
    } catch (error) {
      // toast.error("Error fetching Levels:", error);
    }
  };

  useEffect(() => {
    fetchLevels();
  }, []);

  const handleNewClick = () => {
    resetFormFields();
    setIsEditing(false);
    setEditingIndex(-1);
    setIsModalOpen(true);
  };

  const resetFormFields = () => {
    setLevelName("");
  };

  const handleEdit = (row) => {
    const level = levels[row.index];
    setLevelName(level.LevelName);

    setEditingIndex(row.index);
    setIsEditing(true);
    setIsModalOpen(true);
    setId(level.Id); // Set the author ID
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
      "https://publication.microtechsolutions.net.in/php/Levelmasterdelete.php",
      requestOptions
    )
      .then((response) => response.text())
      .then((result) => console.log(result))
      .catch((error) => console.error(error));
    toast.success("Level Deleted Successfully");
    setIsDeleteDialogOpen(false);
    fetchLevels();
  };

  const cancelDelete = () => {
    setIsDeleteDialogOpen(false);
    setDeleteIndex(null);
  };

  const validateForm = () => {
    let formErrors = {};
    let isValid = true;

    if (!LevelName) {
      formErrors.LevelName = " Level Name is required.";
      isValid = false;
    }

    setErrors(formErrors);
    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent the default form submission
    if (!validateForm()) return;

    const data = {
      LevelName: LevelName,
      CreatedBy: userId,
    };

    // Determine the URL based on whether we're editing or adding
    const url = isEditing
      ? "https://publication.microtechsolutions.net.in/php/Levelmasterupdate.php"
      : "https://publication.microtechsolutions.net.in/php/Levelmasterpost.php";

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
        toast.success("Level updated successfully!");
      } else {
        toast.success("Level added successfully!");
      }
      setIsModalOpen(false);
      resetFormFields();
      fetchLevels(); // Refresh the list after submit
    } catch (error) {
      // console.error("Error saving record:", error);
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
        accessorKey: "LevelName",
        header: "Level Name",
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
    [levels]
  );

  const table = useMaterialReactTable({
    columns,
    data: levels,
    muiTableHeadCellProps: {
      style: {
        backgroundColor: "#E9ECEF", // Replace with your desired color
        color: "black",
        fontSize: "16px",
      },
    },
  });

  return (
    <div className="level-container">
      <h1>Level Master</h1>

      <div className="leveltable-container">
        <div className="leveltable1-container">
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
          <div className="levtable-container">
            <MaterialReactTable table={table} />
          </div>
        </div>

        {isModalOpen && (
          <div
            className="level-overlay"
            onClick={() => setIsModalOpen(false)}
          />
        )}

        <Modal open={isModalOpen}>
          <div className="level-modal">
            <h2
              style={{
                textAlign: "center",
                fontWeight: "620",
                margin: "2px",
                fontSize: "27px",
              }}>
              {isEditing ? "Edit Level" : "Add Level"}
            </h2>
            <form className="level-form">
              <div>
                <label className="level-label">
                  {" "}
                  Level Name <b className="required">*</b>
                </label>
                <div>
                  <Tooltip
                    title={
                      <span style={{ fontSize: "14px", fontWeight: "bold" }}>
                        {LevelName}
                      </span>
                    }
                    arrow>
                    <input
                      type="text"
                      id="LevelName"
                      name="LevelName"
                      value={LevelName}
                      onChange={(e) => setLevelName(e.target.value)}
                      maxLength={50}
                      ref={levelRef}
                      onKeyDown={(e) => handleKeyDown(e, saveRef)}
                      className="level-control"
                      placeholder="Enter Level Name"
                    />
                  </Tooltip>
                  <div>
                    {errors.LevelName && (
                      <b className="error-text">{errors.LevelName}</b>
                    )}
                  </div>
                </div>
              </div>
            </form>

            <div className="level-btn-container">
              <Button
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
              <u>Level</u>
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
};

export default LevelMaster;
