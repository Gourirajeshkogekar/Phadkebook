import React, { useState, useMemo, useEffect, useRef } from "react";
import "./Canvassor.css";
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

function Canvassor() {
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

    fetchcanvassors();
  }, []);

  const [CanvassorName, setCanvassorName] = useState("");
  const [canvassors, setCanvassors] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingIndex, setEditingIndex] = useState(-1);
  const [isEditing, setIsEditing] = useState(false);
  const [id, setId] = useState("");
  const [errors, setErrors] = useState("");
  const [deleteId, setDeleteId] = useState(null);

  // Confirmation Dialog state
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [deleteIndex, setDeleteIndex] = useState(null);

  //   const canvassorRef = useRef(null);
  const saveRef = useRef(null);

  const handleKeyDown = (e, nextFieldRef) => {
    if (e.key === "Enter") {
      e.preventDefault();
      if (nextFieldRef && nextFieldRef.current) {
        nextFieldRef.current.focus();
      }
    }
  };

  const fetchcanvassors = async () => {
    try {
      const response = await axios.get(
        "https://publication.microtechsolutions.net.in/php/get/getCanvassorMaster.php"
      );

      // sort by Id (assuming higher Id = newer)
      const sortedData = [...response.data].sort(
        (a, b) => a.Id - b.Id // ASC
        // (b.Id - a.Id)        // DESC (latest first)
      );

      setCanvassors(sortedData);
    } catch (error) {
      toast.error("Error fetching canvassors");
    }
  };

  useEffect(() => {
    fetchcanvassors();
  }, []);

  const resetForm = () => {
    setCanvassorName("");
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
    const mode = canvassors[row.index];
    setCanvassorName(mode.CanvassorName); // Ensure this matches your data field
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
    const formData = new URLSearchParams();
    formData.append("Table", "CanvassorMaster");
    formData.append("Id", deleteId);

    fetch(
      "https://publication.microtechsolutions.co.in/php/delete/delrecord.php",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: formData,
      }
    )
      .then((res) => res.text())
      .then(() => {
        toast.success("Canvassor Deleted Successfully");
        setIsDeleteDialogOpen(false);
        fetchcanvassors();
      })
      .catch(() => toast.error("Delete failed"));
  };

  const cancelDelete = () => {
    setIsDeleteDialogOpen(false);
    setDeleteIndex(null);
  };

  const validateForm = () => {
    let formErrors = {};
    let isValid = true;

    if (!Canvassor) {
      formErrors.Canvassor = "Canvassor is required.";
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
      CanvassorName: CanvassorName,
      CreatedBy: userId,
      // UpdatedBy: userId,
    };

    const url = isEditing
      ? "https://publication.microtechsolutions.net.in/php/update/updateCanvassorMaster.php"
      : "https://publication.microtechsolutions.net.in/php/post/postCanvassorMaster.php";

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
        toast.success("Canvassor  updated successfully!");
      } else {
        toast.success("Canvassor added successfully!");
      }
      setIsModalOpen(false);
      resetForm();
      fetchcanvassors();
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
        accessorKey: "CanvassorName",
        header: "Canvassor Name",
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
      <h1>Canvassor Master</h1>
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
            <h2
              style={{
                textAlign: "center",
                fontWeight: "620",
                margin: "2px",
                fontSize: "27px",
                marginBottom: "10px",
              }}>
              {editingIndex >= 0 ? "Edit Canvassor" : "Add Canvassor"}
            </h2>
            <form onSubmit={handleSubmit} className="canvassor-form">
              <div>
                <label className="canvassor-label">Canvassor Name</label>
                <div>
                  <input
                    type="text"
                    id="CanvassorName"
                    name="CanvassorName"
                    value={CanvassorName}
                    onChange={(e) => setCanvassorName(e.target.value)}
                    maxLength={50}
                    className="canvassor-control"
                    placeholder="Enter Canvassor "
                  />
                </div>
              </div>
            </form>

            <div className="canvassor-btn-container">
              <Button
                onClick={handleSubmit}
                ref={saveRef}
                style={{
                  // background: "#3c7291",
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
export default Canvassor;
