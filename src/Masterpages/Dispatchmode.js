import React, { useState, useMemo, useEffect, useRef } from "react";
import "./Dispatchmode.css";
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
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { RiDeleteBin5Line } from "react-icons/ri";
import { Tooltip } from "@mui/material";

function Dispatchmode() {
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

    fetchDispatchmodes();
  }, []);

  const [DispatchModeName, setDispatchModeName] = useState("");
  const [dispatchmodes, setDispatchmodes] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingIndex, setEditingIndex] = useState(-1);
  const [isEditing, setIsEditing] = useState(false);
  const [id, setId] = useState("");
  const [errors, setErrors] = useState("");
  // Confirmation Dialog state
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [deleteIndex, setDeleteIndex] = useState(null);
  const [deleteId, setDeleteId] = useState(null);

  const dispmodeRef = useRef(null);
  const saveRef = useRef(null);

  const handleKeyDown = (e, nextFieldRef) => {
    if (e.key === "Enter") {
      e.preventDefault();
      if (nextFieldRef && nextFieldRef.current) {
        nextFieldRef.current.focus();
      }
    }
  };
  const fetchDispatchmodes = async () => {
    try {
      const response = await axios.get(
        "https://publication.microtechsolutions.net.in/php/Dispatchmodeget.php"
      );
      setDispatchmodes(response.data);
    } catch (error) {
      // toast.error("Error fetching modes:", error);
    }
  };

  useEffect(() => {
    fetchDispatchmodes();
  }, []);

  const resetForm = () => {
    setDispatchModeName("");
    setIsEditing(false); // Reset isEditing to false
    setId(""); // Clear the id
    setErrors(""); // Clear any previous errors
    setIsModalOpen(false);
  };

  const handleNewClick = () => {
    resetForm();
    setIsModalOpen(true);
    setEditingIndex(-1);
  };

  const handleEdit = (row) => {
    const mode = dispatchmodes[row.index];
    setDispatchModeName(mode.DispatchModeName); // Ensure this matches your data field
    setEditingIndex(row.index);
    setId(mode.Id);
    setIsEditing(true); // Ensure isEditing is set to true for editing
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
      "https://publication.microtechsolutions.net.in/php/Dispatchmodedelete.php",
      requestOptions
    )
      .then((response) => response.text())
      .then((result) => console.log(result))
      .catch((error) => console.error(error));
    toast.success("Dispatch Mode Deleted Successfully");
    setIsDeleteDialogOpen(false);
    fetchDispatchmodes();
  };

  const cancelDelete = () => {
    setIsDeleteDialogOpen(false);
    setDeleteIndex(null);
  };

  const validateForm = () => {
    let formErrors = {};
    let isValid = true;

    if (!DispatchModeName) {
      formErrors.DispatchModeName = "Dispatch Mode Name is required.";
      isValid = false;
    }

    setErrors(formErrors);
    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Only validate form if it's a POST request (not editing)
    if (!isEditing && !validateForm()) return;

    const data = {
      DispatchModeName: DispatchModeName,
      CreatedBy: userId,
    };

    const url = isEditing
      ? "https://publication.microtechsolutions.net.in/php/Dispatchmodeupdate.php"
      : "https://publication.microtechsolutions.net.in/php/Dispatchmodepost.php";

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
        toast.success("Dispatch Mode updated successfully!");
      } else {
        toast.success("Dispatch Mode added successfully!");
      }
      setIsModalOpen(false);
      resetForm();
      fetchDispatchmodes();
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
        accessorKey: "DispatchModeName",
        header: "Dispatch Mode Name",
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
    [dispatchmodes]
  );

  const table = useMaterialReactTable({
    columns,
    data: dispatchmodes,
    muiTableHeadCellProps: {
      style: {
        backgroundColor: "#E9ECEF", // Replace with your desired color
        color: "black",
        fontSize: "16px",
      },
    },
  });

  return (
    <div className="dispatch-container">
      <h1>Dispatch Mode Master</h1>
      <div className="dispatchtable-master">
        <div className="dispatchtable1-master">
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
          <div className="dispatchtable-container">
            <MaterialReactTable table={table} />
          </div>
        </div>

        {isModalOpen && (
          <div
            className="dispatch-overlay"
            onClick={() => setIsModalOpen(false)}
          />
        )}

        <Modal open={isModalOpen}>
          <div className="dispatch-modal">
            <h2
              style={{
                textAlign: "center",
                fontWeight: "620",
                margin: "2px",
                fontSize: "27px",
                marginBottom: "10px",
              }}>
              {editingIndex >= 0 ? "Edit Dispatch Mode" : "Add Dispatch Mode"}
            </h2>
            <form onSubmit={handleSubmit} className="dispatch-form">
              <div>
                <label className="dispatch-label">
                  Dispatch Mode Name<b className="required">*</b>
                </label>
                <div>
                  <Tooltip
                    title={
                      <span style={{ fontSize: "14px", fontWeight: "bold" }}>
                        {DispatchModeName}
                      </span>
                    }
                    arrow>
                    <input
                      type="text"
                      id="DispatchModeName"
                      name="DispatchModeName"
                      value={DispatchModeName}
                      onChange={(e) => setDispatchModeName(e.target.value)}
                      maxLength={50}
                      ref={dispmodeRef}
                      onKeyDown={(e) => handleKeyDown(e, saveRef)}
                      className="dispatch-control"
                      placeholder="Enter dispatch Name"
                    />
                  </Tooltip>
                  <div>
                    {errors.DispatchModeName && (
                      <b className="error-text">{errors.DispatchModeName}</b>
                    )}
                  </div>
                </div>
              </div>
            </form>

            <div className="dispatch-btn-container">
              <Button
                type="submit"
                onClick={handleSubmit}
                ref={saveRef}
                // onKeyDown={(e) => handleKeyDown(e, accgroupnameRef)}
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
              <u>Dispatch Mode</u>
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

export default Dispatchmode;
