import React, { useState, useMemo, useEffect, useRef } from "react";
import "./DepositorGroup.css";
import axios from "axios";
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
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { RiDeleteBin5Line } from "react-icons/ri";
import { Tooltip } from "@mui/material";

function DepositerGroup() {
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

    fetchDepositerGroups();
  }, []);

  const [DepositerGroupName, setDepositerGroupName] = useState("");
  const [DepositerGroupCode, setDepositerGroupCode] = useState("");
  const [depositerGroups, setDepositerGroups] = useState([]);
  const [editingIndex, setEditingIndex] = useState(-1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [id, setId] = useState("");
  const [errors, setErrors] = useState("");
  const [deleteId, setDeleteId] = useState(null);

  // Confirmation Dialog state
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [deleteIndex, setDeleteIndex] = useState(null);

  const depogrpnameRef = useRef(null);
  const depogrpcodeRef = useRef(null);

  const saveRef = useRef(null);

  const handleKeyDown = (e, nextFieldRef) => {
    if (e.key === "Enter") {
      e.preventDefault();
      if (nextFieldRef && nextFieldRef.current) {
        nextFieldRef.current.focus();
      }
    }
  };

  const fetchDepositerGroups = async () => {
    try {
      const response = await axios.get(
        "https://publication.microtechsolutions.net.in/php/DepositerGroupget.php"
      );
      setDepositerGroups(response.data);
    } catch (error) {
      // toast.error("Error fetching Depositor groups:", error);
    }
  };

  useEffect(() => {
    fetchDepositerGroups();
  }, []);

  const handleNewClick = () => {
    resetForm();
    setIsEditing(false);
    setEditingIndex(-1);
    setIsModalOpen(true);
  };

  const resetForm = () => {
    setDepositerGroupName("");
  };

  const handleEdit = (row) => {
    const depo = depositerGroups[row.index];
    setDepositerGroupName(depo.DepositerGroupName);
    setDepositerGroupCode(depo.DepositerGroupCode);
    setEditingIndex(row.index);
    setIsEditing(true);
    setIsModalOpen(true);
    setId(depo.Id);
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
      "https://publication.microtechsolutions.net.in/php/Depositergroupdelete.php",
      requestOptions
    )
      .then((response) => response.text())
      .then((result) => console.log(result))
      .catch((error) => console.error(error));
    toast.success("Depositer Group Deleted Successfully");
    setIsDeleteDialogOpen(false);
    fetchDepositerGroups();
  };

  const cancelDelete = () => {
    setIsDeleteDialogOpen(false);
    setDeleteIndex(null);
  };

  const validateForm = () => {
    let formErrors = {};
    let isValid = true;
    if (!DepositerGroupName) {
      formErrors.DepositerGroupName = "Depositer Group Name is required.";
      isValid = false;
    }
    //   if (!DepositerGroupCode) {
    //     formErrors.DepositerGroupCode = "Depositer Group code is required.";
    //     isValid = false;
    // }
    setErrors(formErrors);
    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent the default form submission
    if (!validateForm()) return;

    const data = {
      DepositerGroupName: DepositerGroupName,
      DepositerGroupCode: DepositerGroupCode,
      CreatedBy: userId,
    };

    // Determine the URL based on whether we're editing or adding
    const url = isEditing
      ? "https://publication.microtechsolutions.net.in/php/DepositerGroupupdate.php"
      : "https://publication.microtechsolutions.net.in/php/DepositerGrouppost.php";

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
        toast.success("Depositer Group updated successfully!");
      } else {
        toast.success("Depositer Group added successfully!");
      }
      setIsModalOpen(false);
      resetForm();
      fetchDepositerGroups(); // Refresh the list after submit
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
        accessorKey: "DepositerGroupName",
        header: "Depositer Name",
        size: 50,
      },

      {
        accessorKey: "DepositerGroupCode",
        header: "Depositer Code",
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
    [depositerGroups]
  );

  const table = useMaterialReactTable({
    columns,
    data: depositerGroups,
    muiTableHeadCellProps: {
      style: {
        backgroundColor: "#E9ECEF", // Replace with your desired color
        color: "black",
        fontSize: "16px",
      },
    },
  });

  return (
    <div className="depositor-container">
      <h1>Depositer Group Master</h1>
      <div className="depotable-master">
        <div className="depotable1-master">
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
          <div className="depotable-container">
            <MaterialReactTable table={table} />
          </div>
        </div>

        {isModalOpen && (
          <div
            className="depositor-overlay"
            onClick={() => setIsModalOpen(false)}
          />
        )}

        <Modal open={isModalOpen}>
          <div className="depositor-modal">
            <h2
              style={{
                textAlign: "center",
                fontWeight: "620",
                margin: "2px",
                fontSize: "27px",
              }}>
              {isEditing ? "Edit Depositer Group" : "Add Depositer Group"}
            </h2>
            <form onSubmit={handleSubmit} className="depomaster-form">
              <div>
                <label className="depositor-label">
                  Depositer Code <b className="required">*</b>
                </label>
                <div>
                  <input
                    type="text"
                    id="DepositerGroupCode"
                    name="DepositerGroupCode"
                    value={DepositerGroupCode}
                    onChange={(e) => setDepositerGroupCode(e.target.value)}
                    maxLength={50}
                    ref={depogrpcodeRef}
                    onKeyDown={(e) => handleKeyDown(e, saveRef)}
                    style={{ background: "	#D0D0D0" }}
                    placeholder="Auto-Incremented"
                    className="depo-control"
                    readOnly
                  />

                  <div>
                    {errors.DepositerGroupCode && (
                      <b className="error-text">{errors.DepositerGroupCode}</b>
                    )}
                  </div>
                </div>
              </div>
              <div>
                <label className="depositor-label">
                  Depositer Name <b className="required">*</b>
                </label>
                <div>
                  <Tooltip
                    title={
                      <span style={{ fontSize: "14px", fontWeight: "bold" }}>
                        {DepositerGroupName}
                      </span>
                    }
                    arrow>
                    <input
                      type="text"
                      id="DepositerGroupName"
                      name="DepositerGroupName"
                      value={DepositerGroupName}
                      onChange={(e) => setDepositerGroupName(e.target.value)}
                      maxLength={50}
                      ref={depogrpnameRef}
                      onKeyDown={(e) => handleKeyDown(e, depogrpcodeRef)}
                      placeholder="Enter DepositerGroup Name"
                      className="depo-control"
                    />
                  </Tooltip>

                  <div>
                    {errors.DepositerGroupName && (
                      <b className="error-text">{errors.DepositerGroupName}</b>
                    )}
                  </div>
                </div>
              </div>
            </form>
            <div className="depo-btn-container">
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
              <u>Depositer Group</u>
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

export default DepositerGroup;
