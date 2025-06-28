import React, { useState, useMemo, useEffect, useRef } from "react";
import "./University.css";
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
import axios from "axios";
import { RiDeleteBin5Line } from "react-icons/ri";
import { Tooltip } from "@mui/material";

function University() {
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

    fetchUniversities();
  }, []);
  const [UniversityName, setUniversityName] = useState("");
  const [UniversityCode, setUniversityCode] = useState("");
  const [universities, setUniversities] = useState([]);
  const [editingIndex, setEditingIndex] = useState(-1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [id, setId] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [errors, setErrors] = useState("");
  const [deleteId, setDeleteId] = useState(null);

  // Confirmation Dialog state
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [deleteIndex, setDeleteIndex] = useState(null);

  const uninameRef = useRef(null);
  const unicodeRef = useRef(null);
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
    fetchUniversities();
  }, []);

  const fetchUniversities = async () => {
    try {
      const response = await axios.get(
        "https://publication.microtechsolutions.net.in/php/Universityget.php"
      );

      setUniversities(response.data);
    } catch (error) {
      // toast.error("Error fetching Universities:", error);
    }
  };

  const resetForm = () => {
    setUniversityName("");
    setUniversityCode("");
  };

  const handleNewClick = () => {
    resetForm();
    setEditingIndex(-1);
    setIsModalOpen(true);
  };

  const handleEdit = (row) => {
    const university = universities[row.index];
    setUniversityName(university.UniversityName);
    setUniversityCode(university.UniversityCode);
    setEditingIndex(row.index);
    setIsModalOpen(true);
    setIsEditing(true);
    setId(university.Id);
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
      "https://publication.microtechsolutions.net.in/php/Universitydelete.php",
      requestOptions
    )
      .then((response) => response.text())
      .then((result) => console.log(result))
      .catch((error) => console.error(error));
    toast.success("University Deleted Successfully");
    setIsDeleteDialogOpen(false);
    fetchUniversities();
  };

  const cancelDelete = () => {
    setIsDeleteDialogOpen(false);
    setDeleteIndex(null);
  };

  const validateForm = () => {
    let formErrors = {};
    let isValid = true;

    if (!UniversityName) {
      formErrors.UniversityName = "University Name is required.";
      isValid = false;
    }

    //   if (!UniversityCode) {
    //     formErrors.UniversityCode = "University Code is required.";
    //     isValid = false;

    // }

    setErrors(formErrors);
    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent the default form submission
    if (!validateForm()) return;

    const data = {
      UniversityName: UniversityName,
      UniversityCode: UniversityCode,
      CreatedBy: userId,
    };

    const url = isEditing
      ? "https://publication.microtechsolutions.net.in/php/Universityupdate.php"
      : "https://publication.microtechsolutions.net.in/php/Universitypost.php";

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
        toast.success("University updated successfully!");
      } else {
        toast.success("University added successfully!");
      }
      setIsModalOpen(false);
      resetForm();
      fetchUniversities();
    } catch (error) {
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
        accessorKey: "UniversityName",
        header: "University Name",
        size: 50,
      },
      {
        accessorKey: "UniversityCode",
        header: "University Code",
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
    [universities]
  );

  const table = useMaterialReactTable({
    columns,
    data: universities,
    muiTableHeadCellProps: {
      style: {
        backgroundColor: "#E9ECEF", // Replace with your desired color
        color: "black",
        fontSize: "16px",
      },
    },
  });

  return (
    <div className="university-container">
      <h1>University Master</h1>
      <div className="universitytable-master">
        <div className="universitytable1-master">
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
          <div className="universitytable-container">
            <MaterialReactTable table={table} />
          </div>
        </div>

        {isModalOpen && (
          <div
            className="university-overlay"
            onClick={() => setIsModalOpen(false)}
          />
        )}

        <Modal open={isModalOpen}>
          <div className="university-modal">
            <h2
              style={{
                textAlign: "center",
                fontWeight: "620",
                margin: "2px",
                fontSize: "27px",
              }}>
              {editingIndex >= 0 ? "Edit University" : "Add University"}
            </h2>
            <form onSubmit={handleSubmit} className="university-form">
              <div>
                <label className="university-label">
                  University Name <b className="required">*</b>
                </label>
                <div>
                  <Tooltip
                    title={
                      <span style={{ fontSize: "14px", fontWeight: "bold" }}>
                        {UniversityName}
                      </span>
                    }
                    arrow>
                    <input
                      type="text"
                      id="UniversityName"
                      name="UniversityName"
                      value={UniversityName}
                      onChange={(e) => setUniversityName(e.target.value)}
                      maxLength={100}
                      ref={uninameRef}
                      onKeyDown={(e) => handleKeyDown(e, unicodeRef)}
                      placeholder="Enter university Name"
                      className="university-control"
                    />
                  </Tooltip>
                  <div>
                    {errors.UniversityName && (
                      <b className="error-text">{errors.UniversityName}</b>
                    )}
                  </div>
                </div>
              </div>
              <div>
                <label className="university-label">
                  University Code <b className="required">*</b>
                </label>
                <div>
                  <input
                    type="number"
                    id="UniversityCode"
                    name="UniversityCode"
                    value={UniversityCode}
                    onChange={(e) => setUniversityCode(e.target.value)}
                    maxLength={100}
                    ref={unicodeRef}
                    onKeyDown={(e) => handleKeyDown(e, saveRef)}
                    placeholder="Enter university Code"
                    className="university-control"
                  />
                  <div>
                    {errors.UniversityCode && (
                      <b className="error-text">{errors.UniversityCode}</b>
                    )}
                  </div>
                </div>
              </div>
            </form>

            <div className="univ-btn-container">
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
              <u>University</u>
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

export default University;
