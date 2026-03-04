import React, { useState, useMemo, useEffect, useRef } from "react";
import "./Maingroup.css";
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

function Maingroup() {
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

    fetchMaingroups();
  }, []);

  const [MainGroupName, setMainGroupName] = useState("");
  const [maingroups, setMaingroups] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingIndex, setEditingIndex] = useState(-1);
  const [isEditing, setIsEditing] = useState(false);
  const [id, setId] = useState("");
  const [errors, setErrors] = useState("");
  const [deleteId, setDeleteId] = useState(null);

  // Confirmation Dialog state
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [deleteIndex, setDeleteIndex] = useState(null);

  //   const maingroupRef = useRef(null);
  const saveRef = useRef(null);

  const handleKeyDown = (e, nextFieldRef) => {
    if (e.key === "Enter") {
      e.preventDefault();
      if (nextFieldRef && nextFieldRef.current) {
        nextFieldRef.current.focus();
      }
    }
  };

  const fetchMaingroups = async () => {
    try {
      const response = await axios.get(
        "https://publication.microtechsolutions.net.in/php/get/getMainGroup.php"
      );
      setMaingroups(response.data);
    } catch (error) {
      // toast.error("Error fetching maingroupegories:", error);
    }
  };

  useEffect(() => {
    fetchMaingroups();
  }, []);

  const resetForm = () => {
    setMainGroupName("");
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
    const mode = maingroups[row.index];
    setMainGroupName(mode.MainGroupName); // Ensure this matches your data field
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
      "https://publication.microtechsolutions.net.in/php/Maingroupdelete.php",
      requestOptions
    )
      .then((response) => response.text())
      .then((result) => console.log(result))
      .catch((error) => console.error(error));
    toast.success("Main Group Deleted Successfully");
    setIsDeleteDialogOpen(false);
    fetchMaingroups();
  };

  const cancelDelete = () => {
    setIsDeleteDialogOpen(false);
    setDeleteIndex(null);
  };

  const validateForm = () => {
    let formErrors = {};
    let isValid = true;

    if (!Maingroup) {
      formErrors.Maingroup = "Main group is required.";
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
      Maingroup: Maingroup,
      CreatedBy: userId,
      // UpdatedBy: userId,
    };

    const url = isEditing
      ? "https://publication.microtechsolutions.net.in/php/MainGroupupdate.php"
      : "https://publication.microtechsolutions.net.in/php/MainGrouppost.php";

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
        toast.success("Main group  updated successfully!");
      } else {
        toast.success("Main group added successfully!");
      }
      setIsModalOpen(false);
      resetForm();
      fetchMaingroups();
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
        accessorKey: "MainGroupName",
        header: "Main Group",
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
    [maingroups]
  );

  const table = useMaterialReactTable({
    columns,
    data: maingroups,
    muiTableHeadCellProps: {
      style: {
        backgroundColor: "#E9ECEF", // Replace with your desired color
        color: "black",
        fontSize: "16px",
      },
    },
  });
  return (
    <div className="maingroup-container">
      <h1>Main Group Master</h1>
      <div className="maingrouptable-master">
        <div className="maingrouptable1-master">
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
          <div className="maingrouptable-container">
            <MaterialReactTable table={table} />
          </div>
        </div>

        {isModalOpen && (
          <div
            className="maingroup-overlay"
            onClick={() => setIsModalOpen(false)}
          />
        )}

        <Modal open={isModalOpen}>
          <div className="maingroup-modal">
            <h2
              style={{
                textAlign: "center",
                fontWeight: "620",
                margin: "2px",
                fontSize: "27px",
                marginBottom: "10px",
              }}>
              {editingIndex >= 0 ? "Edit Main Group" : "Add Main Group"}
            </h2>
            <form onSubmit={handleSubmit} className="maingroup-form">
              <div>
                <label className="maingroup-label">Main Group Name</label>
                <div>
                  <input
                    type="text"
                    id="MainGroupName"
                    name="MainGroupName"
                    value={MainGroupName}
                    onChange={(e) => setMainGroupName(e.target.value)}
                    maxLength={50}
                    className="maingroup-control"
                    placeholder="Enter Main group  "
                  />
                </div>
              </div>
            </form>

            <div className="maingroup-btn-container">
              <Button
                type="submit"
                onClick={handleSubmit}
                ref={saveRef}
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

        <Dialog open={isDeleteDialogOpen} onClose={cancelDelete}>
          <DialogTitle style={{ color: "navy", fontWeight: "600" }}>
            Confirm Deletion
          </DialogTitle>
          <DialogContent>
            Are you sure you want to delete this{" "}
            <b style={{ color: "red" }}>
              <u>Main Group</u>
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
export default Maingroup;
