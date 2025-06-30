import React, { useState, useMemo, useEffect, useRef } from "react";
import axios from "axios";
import "./Godown.css";
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

import Select from "react-select"; // Import from react-select
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { RiDeleteBin5Line } from "react-icons/ri";
import { Tooltip } from "@mui/material";

function Godown() {
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

    fetchGodowns();
  }, []);

  const [godowns, setGodowns] = useState([]);
  const [GodownName, setGodownName] = useState("");
  const [editingIndex, setEditingIndex] = useState(-1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [id, setId] = useState("");
  const [errors, setErrors] = useState("");
  // Confirmation Dialog state
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [deleteIndex, setDeleteIndex] = useState(null);
  const [deleteId, setDeleteId] = useState(null);

  const godownRef = useRef(null);
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
    fetchGodowns();
  }, []);

  const fetchGodowns = async () => {
    try {
      const response = await axios.get(
        "https://publication.microtechsolutions.net.in/php/Godownget.php"
      );

      setGodowns(response.data);
    } catch (error) {
      // toast.error("Error fetching Godowns:", error);
    }
  };

  const resetForm = () => {
    setGodownName("");
  };

  const handleNewClick = () => {
    resetForm();
    setIsModalOpen(true);
    setEditingIndex(-1);
  };

  const handleEdit = (row) => {
    const godown = godowns[row.index];
    setGodownName(godown.GodownName);
    setEditingIndex(row.index);
    setIsModalOpen(true);
    setIsEditing(true);
    setId(godown.Id);
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
      "https://publication.microtechsolutions.net.in/php/Godowndelete.php",
      requestOptions
    )
      .then((response) => response.text())
      .then((result) => console.log(result))
      .catch((error) => console.error(error));
    toast.success("Godown Deleted Successfully");
    setIsDeleteDialogOpen(false);
    fetchGodowns();
  };

  const cancelDelete = () => {
    setIsDeleteDialogOpen(false);
    setDeleteIndex(null);
  };

  const validateForm = () => {
    let formErrors = {};
    let isValid = true;

    if (!GodownName) {
      formErrors.GodownName = "Godown Name is required.";
      isValid = false;
    }

    setErrors(formErrors);
    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent the default form submission
    if (!validateForm()) return;

    const data = {
      GodownName: GodownName,
      CreatedBy: userId,
    };

    const url = isEditing
      ? "https://publication.microtechsolutions.net.in/php/Godownupdate.php"
      : "https://publication.microtechsolutions.net.in/php/Godownpost.php";

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
        toast.success("Godown updated successfully!");
      } else {
        toast.success("Godown added successfully!");
      }
      setIsModalOpen(false);
      resetForm();
      fetchGodowns(); // Refresh the list after submit
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
        accessorKey: "GodownName",
        header: "Godown Name",
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
    [godowns]
  );

  const table = useMaterialReactTable({
    columns,
    data: godowns,
    muiTableHeadCellProps: {
      style: {
        backgroundColor: "#E9ECEF", // Replace with your desired color
        color: "black",
        fontSize: "16px",
      },
    },
  });

  return (
    <div className="godown-container">
      <h1>Godown Master</h1>

      <div className="godowntable-master">
        <div className="godowntable1-master">
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
          <div className="godowntable-container">
            <MaterialReactTable table={table} />
          </div>
        </div>

        {isModalOpen && (
          <div
            className="godown-overlay"
            onClick={() => setIsModalOpen(false)}
          />
        )}

        <Modal open={isModalOpen}>
          <div className="godown-modal">
            <h2
              style={{
                textAlign: "center",
                fontWeight: "620",
                margin: "2px",
                fontSize: "27px",
              }}>
              {editingIndex >= 0 ? "Edit Godown" : "Add Godown"}
            </h2>
            <form className="godown-form">
              <div>
                <label className="godown-label">
                  Godown Name <b className="required">*</b>
                </label>
                <div>
                  <Tooltip
                    title={
                      <span style={{ fontSize: "14px", fontWeight: "bold" }}>
                        {GodownName}
                      </span>
                    }
                    arrow>
                    <input
                      id="GodownName"
                      name="GodownName"
                      value={GodownName}
                      onChange={(e) => setGodownName(e.target.value)}
                      maxLength={50}
                      ref={godownRef}
                      onKeyDown={(e) => handleKeyDown(e, saveRef)}
                      placeholder="Enter godown name"
                      className="godown-control"
                    />
                  </Tooltip>

                  <div>
                    {errors.GodownName && (
                      <b className="error-text">{errors.GodownName}</b>
                    )}
                  </div>
                </div>
              </div>
            </form>
            <div className="godown-btn-container">
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
              <u>Godown</u>
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

export default Godown;
