import React, { useState, useMemo, useEffect, useRef } from "react";
import axios from "axios";
import "./Platemaker.css";
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

function Platemaker() {
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

    fetchPlatemakers();
  }, []);

  const [platemakers, setPlatemakers] = useState([]);
  const [Name, setName] = useState("");
  const [editingIndex, setEditingIndex] = useState(-1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [id, setId] = useState("");
  const [errors, setErrors] = useState("");
  // Confirmation Dialog state
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [deleteIndex, setDeleteIndex] = useState(null);
  const [deleteId, setDeleteId] = useState(null);

  const plateRef = useRef(null);
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
    fetchPlatemakers();
  }, []);

  const fetchPlatemakers = async () => {
    try {
      const response = await axios.get(
        "https://publication.microtechsolutions.net.in/php/gettable.php?Table=PlateMaker"
      );

      setPlatemakers(response.data);
    } catch (error) {
      // toast.error("Error fetching plate makers:", error);
    }
  };

  const resetForm = () => {
    setName("");
  };

  const handleNewClick = () => {
    resetForm();
    setIsModalOpen(true);
    setEditingIndex(-1);
  };

  const handleEdit = (row) => {
    const plate = platemakers[row.index];
    setName(plate.Name);
    setEditingIndex(row.index);
    setIsModalOpen(true);
    setIsEditing(true);
    setId(plate.Id);
  };

  const handleDelete = (index, Id) => {
    setDeleteIndex(index);
    setDeleteId(Id);
    setIsDeleteDialogOpen(true); // Show confirmation dialog
  };

  const confirmDelete = () => {
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/x-www-form-urlencoded");

    // Prepare the data to send in the body
    const urlencoded = new URLSearchParams();
    urlencoded.append("Table", "PlateMaker"); // Specify the table name as "PlateMaker"
    urlencoded.append("Id", deleteId); // Send the Id of the record to be deleted

    const requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: urlencoded,
      redirect: "follow",
    };

    // Send the delete request to the new API endpoint
    fetch(
      "https://publication.microtechsolutions.net.in/php/delete/delrecord.php",
      requestOptions
    )
      .then((response) => response.text())
      .then((result) => {
        console.log(result); // Log the response from the server
        toast.success("Plate maker Deleted Successfully");
        setIsDeleteDialogOpen(false);
        fetchPlatemakers(); // Refresh the list after deletion
      })
      .catch((error) => {
        console.error("Error deleting plate maker:", error);
        toast.error("Error deleting plate maker!");
      });
  };

  const cancelDelete = () => {
    setIsDeleteDialogOpen(false);
    setDeleteIndex(null);
  };

  const validateForm = () => {
    let formErrors = {};
    let isValid = true;

    if (!Name) {
      formErrors.Name = "Name is required.";
      isValid = false;
    }

    setErrors(formErrors);
    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent the default form submission
    if (!validateForm()) return;

    const data = {
      Name: Name,
      CreatedBy: userId,
    };

    const url = isEditing
      ? "https://publication.microtechsolutions.net.in/php/update/platemaker.php"
      : "https://publication.microtechsolutions.net.in/php/post/platemaker.php";

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
        toast.success("PlateMaker updated successfully!");
      } else {
        toast.success("PlateMaker added successfully!");
      }
      setIsModalOpen(false);
      resetForm();
      fetchPlatemakers(); // Refresh the list after submit
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
        accessorKey: "Name",
        header: " Name",
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
    [platemakers]
  );

  const table = useMaterialReactTable({
    columns,
    data: platemakers,
    muiTableHeadCellProps: {
      style: {
        backgroundColor: "#E9ECEF", // Replace with your desired color
        color: "black",
        fontSize: "16px",
      },
    },
  });

  return (
    <div className="platemaker-container">
      <h1>Plate Maker</h1>

      <div className="platemakertable-master">
        <div className="platemakertable1-master">
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
          <div className="platemakertable-container">
            <MaterialReactTable table={table} />
          </div>
        </div>

        {isModalOpen && (
          <div
            className="platemaker-overlay"
            onClick={() => setIsModalOpen(false)}
          />
        )}

        <Modal open={isModalOpen}>
          <div className="platemaker-modal">
            <h2
              style={{
                textAlign: "center",
                fontWeight: "620",
                margin: "2px",
                fontSize: "27px",
              }}>
              {editingIndex >= 0 ? "Edit Plate Maker" : "Add Plate Maker"}
            </h2>
            <form className="platemaker-form">
              <div>
                <label className="platemaker-label">
                  Name <b className="required">*</b>
                </label>
                <div>
                  <Tooltip
                    title={
                      <span style={{ fontSize: "14px", fontWeight: "bold" }}>
                        {Name}
                      </span>
                    }
                    arrow>
                    <input
                      id="Name"
                      name="Name"
                      value={Name}
                      onChange={(e) => setName(e.target.value)}
                      maxLength={50}
                      ref={plateRef}
                      onKeyDown={(e) => handleKeyDown(e, saveRef)}
                      placeholder="Enter name"
                      className="platemaker-control"
                    />
                  </Tooltip>

                  <div>
                    {errors.Name && <b className="error-text">{errors.Name}</b>}
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
              <u>Plate Maker</u>
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

export default Platemaker;
