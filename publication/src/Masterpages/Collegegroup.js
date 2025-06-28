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
import "./Collegegroup.css";
import Select from "react-select";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { RiDeleteBin5Line } from "react-icons/ri";
import { CiEdit } from "react-icons/ci";
import { Tooltip } from "@mui/material";

const Collegegroup = () => {
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

    fetchCollegeGroups();
  }, []);
  const [CollegeGroupName, setCollegeGroupName] = useState("");
  const [CollegeGroupCode, setCollegeGroupCode] = useState("");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingIndex, setEditingIndex] = useState(-1);
  const [collegegroups, setCollegegroups] = useState([]);

  const [errors, setErrors] = useState("");
  const [id, setId] = useState("");
  const [deleteId, setDeleteId] = useState(null);

  // Confirmation Dialog state
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [deleteIndex, setDeleteIndex] = useState(null);

  const collnameRef = useRef(null);
  const collgroupcodeRef = useRef(null);
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
    fetchCollegeGroups();
  }, []);

  const fetchCollegeGroups = async () => {
    try {
      const response = await axios.get(
        "https://publication.microtechsolutions.net.in/php/Collegegroupmasterget.php"
      );
      setCollegegroups(response.data);
    } catch (error) {
      // toast.error("Error fetching college groups:", error);
    }
  };

  const handleNewClick = () => {
    resetFormFields();
    setIsEditing(false);
    setIsModalOpen(true);
  };

  const handleEdit = (row) => {
    const colgrp = collegegroups[row.index];
    setCollegeGroupName(colgrp.CollegeGroupName);
    setCollegeGroupCode(colgrp.CollegeGroupCode);

    setEditingIndex(row.index);
    setIsEditing(true);
    setIsModalOpen(true);
    setId(colgrp.Id); // Set the author ID
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
      "https://publication.microtechsolutions.net.in/php/Collegegroupmasterdelete.php",
      requestOptions
    )
      .then((response) => response.text())
      .then((result) => console.log(result))
      .catch((error) => console.error(error));
    toast.success("College Group Deleted Successfully");
    setIsDeleteDialogOpen(false);
    fetchCollegeGroups();
  };

  const cancelDelete = () => {
    setIsDeleteDialogOpen(false);
    setDeleteIndex(null);
  };

  const validateForm = () => {
    let formErrors = {};
    let isValid = true;

    if (!CollegeGroupName) {
      formErrors.CollegeGroupName = "College Group Name is required.";
      isValid = false;
    }

    if (!CollegeGroupCode) {
      formErrors.CollegeGroupCode = "College Group Code is required.";
      isValid = false;
    }

    setErrors(formErrors);
    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent the default form submission
    if (!validateForm()) return;

    const data = {
      CollegeGroupCode: CollegeGroupCode,
      CollegeGroupName: CollegeGroupName,
      CreatedBy: userId,
    };

    // Determine the URL based on whether we're editing or adding
    const url = isEditing
      ? "https://publication.microtechsolutions.net.in/php/Collegegroupmasterupdate.php"
      : "https://publication.microtechsolutions.net.in/php/Collegegroupmasterpost.php";

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
        toast.success("College Group updated successfully!");
      } else {
        toast.success("College Group added successfully!");
      }
      setIsModalOpen(false);
      resetFormFields();
      fetchCollegeGroups(); // Refresh the list after submit
    } catch (error) {
      // console.error("Error saving record:", error);
      toast.error("Error saving record!");
    }
  };

  const resetFormFields = () => {
    setCollegeGroupName("");
    setCollegeGroupCode("");

    setEditingIndex(-1);
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
        accessorKey: "CollegeGroupName",
        header: "College Group Name",
        size: 50,
      },

      {
        accessorKey: "CollegeGroupCode",
        header: "College Group Code",
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
    [collegegroups]
  );

  const table = useMaterialReactTable({
    columns,
    data: collegegroups,
    muiTableHeadCellProps: {
      style: {
        backgroundColor: "#E9ECEF", // Replace with your desired color
        color: "black",
        fontSize: "16px",
      },
    },
  });

  return (
    <div className="collegegroup-container">
      <h1>College Group Master</h1>
      <div className="collegegrouptable-container">
        <div className="collegegrouptable1-container">
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
          <div className="colgrouptable-container">
            <MaterialReactTable table={table} />
          </div>
        </div>

        {isModalOpen && (
          <div
            className="collegegroup-overlay"
            onClick={() => setIsModalOpen(false)}
          />
        )}

        <Modal open={isModalOpen}>
          <div className="collegegroup-modal">
            <h2
              style={{
                textAlign: "center",
                fontWeight: "620",
                margin: "2px",
                fontSize: "27px",
                marginBottom: "10px",
              }}>
              {isEditing ? "Edit College Group" : "Add College Group"}
            </h2>
            <form className="collegegroup-form">
              <div>
                <label className="collegegroup-label">
                  College Group Name <b className="required">*</b>
                </label>
                <div>
                  <Tooltip
                    title={
                      <span style={{ fontSize: "14px", fontWeight: "bold" }}>
                        {CollegeGroupName}
                      </span>
                    }
                    arrow>
                    <input
                      type="text"
                      id="CollegeGroupName"
                      name="CollegeGroupName"
                      value={CollegeGroupName}
                      onChange={(e) => setCollegeGroupName(e.target.value)}
                      maxLength={100}
                      ref={collnameRef}
                      onKeyDown={(e) => handleKeyDown(e, collgroupcodeRef)}
                      className="collegegroup-control"
                      placeholder="Enter College Group Name"
                    />
                  </Tooltip>
                  <div className="error-text">
                    {errors.CollegeGroupName && (
                      <b className="error-text">{errors.CollegeGroupName}</b>
                    )}
                  </div>
                </div>
              </div>
              <div>
                <label className="collegegroup-label">
                  College Group Code <b className="required">*</b>
                </label>
                <div>
                  <input
                    type="text"
                    id="CollegeGroupCode"
                    name="CollegeGroupCode"
                    value={CollegeGroupCode}
                    onChange={(e) => setCollegeGroupCode(e.target.value)}
                    maxLength={1}
                    ref={collgroupcodeRef}
                    onKeyDown={(e) => handleKeyDown(e, saveRef)}
                    className="collegegroup-control"
                    placeholder="Enter Collge group code"
                  />
                  <div>
                    {errors.CollegeGroupCode && (
                      <b className="error-text">{errors.CollegeGroupCode}</b>
                    )}
                  </div>
                </div>
              </div>
            </form>

            <div className="clggrp-btn-container">
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
              <u>College Group</u>
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

export default Collegegroup;
