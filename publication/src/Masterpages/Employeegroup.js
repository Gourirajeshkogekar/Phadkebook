import React, { useState, useMemo, useEffect, useRef } from "react";
import "./Employeegroup.css";
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
import { toast, ToastContainer } from "react-toastify";
import Select from "react-select";
import axios from "axios";
import { RiDeleteBin5Line } from "react-icons/ri";
import { Tooltip } from "@mui/material";

function Employeegroup() {
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

    fetchEmployeegroups();
  }, []);

  const [employeegroups, setEmployeegroups] = useState([]);
  const [CategoryCode, setCategoryCode] = useState("");
  const [CategoryName, setCategoryName] = useState("");

  const [editingIndex, setEditingIndex] = useState(-1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [id, setId] = useState("");
  const [errors, setErrors] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  // Confirmation Dialog state
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [deleteIndex, setDeleteIndex] = useState(null);

  const catcodeRef = useRef(null);
  const catnameRef = useRef(null);
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
    fetchEmployeegroups();
  }, []);

  const fetchEmployeegroups = async () => {
    try {
      const response = await axios.get(
        "https://publication.microtechsolutions.net.in/php/Employeegroupmasterget.php"
      );
      setEmployeegroups(response.data);
    } catch (error) {
      // toast.error("Error fetching employee groups:", error);
    }
  };

  const resetForm = () => {
    setCategoryCode("");
    setCategoryName("");
  };

  const handleNewClick = () => {
    resetForm();
    setIsModalOpen(true);
    setIsEditing(false);
    setEditingIndex(-1);
  };

  const handleEdit = (row) => {
    const empgroup = employeegroups[row.index];
    setCategoryCode(empgroup.CategoryCode);
    setCategoryName(empgroup.CategoryName);
    setEditingIndex(row.index);
    setIsModalOpen(true);
    setIsEditing(true);
    setId(empgroup.Id);
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
      "https://publication.microtechsolutions.net.in/php/Employeegroupmasterdelete.php",
      requestOptions
    )
      .then((response) => response.text())
      .then((result) => console.log(result))
      .catch((error) => console.error(error));
    toast.success("Employee Group Deleted Successfully");
    setIsDeleteDialogOpen(false);
    fetchEmployeegroups();
  };

  const cancelDelete = () => {
    setIsDeleteDialogOpen(false);
    setDeleteIndex(null);
  };

  const validateForm = () => {
    let formErrors = {};
    let isValid = true;

    if (!CategoryCode) {
      formErrors.CategoryCode = "Category Code is required.";
      isValid = false;
    }

    if (!CategoryName) {
      formErrors.CategoryName = "Category Name is required.";
      isValid = false;
    }

    setErrors(formErrors);
    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent the default form submission
    if (!validateForm()) return;

    const data = {
      CategoryCode: CategoryCode,
      CategoryName: CategoryName,
      CreatedBy: userId,
    };

    const url = isEditing
      ? "https://publication.microtechsolutions.net.in/php/Employeegroupmasterupdate.php"
      : "https://publication.microtechsolutions.net.in/php/Employeegroupmasterpost.php";

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
        toast.success("Employee Group updated successfully!");
      } else {
        toast.success("Employee Group added successfully!");
      }
      setIsModalOpen(false);
      resetForm();
      fetchEmployeegroups(); // Refresh the list after submit
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
        accessorKey: "CategoryName",
        header: "Category Name",
        size: 50,
      },
      {
        accessorKey: "CategoryCode",
        header: "Category Code",
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
    [employeegroups]
  );

  const table = useMaterialReactTable({
    columns,
    data: employeegroups,
    muiTableHeadCellProps: {
      style: {
        backgroundColor: "#E9ECEF", // Replace with your desired color
        color: "black",
        fontSize: "16px",
      },
    },
  });

  return (
    <div className="employeegroup-container">
      <h1>Employee Group Master</h1>

      <div className="empgrouptable-master">
        <div className="empgrouptable1-master">
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
          <div className="empgrouptable-container">
            <MaterialReactTable table={table} />
          </div>
        </div>

        {isModalOpen && (
          <div
            className="employeegroup-overlay"
            onClick={() => setIsModalOpen(false)}
          />
        )}

        <Modal open={isModalOpen}>
          <div className="employeegroup-modal">
            <h1
              style={{
                textAlign: "center",
                fontWeight: "620",
                margin: "2px",
                fontSize: "27px",
              }}>
              {editingIndex >= 0 ? "Edit Employee Group" : "Add Employee Group"}
            </h1>
            <form className="employeegroup-form">
              <div>
                <label className="employeegroup-label">
                  Category Name<b className="required">*</b>
                </label>
                <div>
                  <Tooltip
                    title={
                      <span style={{ fontSize: "14px", fontWeight: "bold" }}>
                        {CategoryName}
                      </span>
                    }
                    arrow>
                    <input
                      type="text"
                      id="CategoryName"
                      name="CategoryName"
                      value={CategoryName}
                      onChange={(e) => setCategoryName(e.target.value)}
                      ref={catnameRef}
                      onKeyDown={(e) => handleKeyDown(e, catcodeRef)}
                      className="employeegroup-control"
                      placeholder="Enter Category NAme"
                    />
                  </Tooltip>
                  <div>
                    {errors.CategoryName && (
                      <b className="error-text">{errors.CategoryName}</b>
                    )}
                  </div>
                </div>
              </div>

              <div>
                <label className="employeegroup-label">
                  Category Code<b className="required">*</b>
                </label>
                <div>
                  <input
                    type="text"
                    id="CategoryCode"
                    name="CategoryCode"
                    value={CategoryCode}
                    maxLength={1}
                    onChange={(e) => setCategoryCode(e.target.value)}
                    ref={catcodeRef}
                    onKeyDown={(e) => handleKeyDown(e, saveRef)}
                    className="employeegroup-control"
                    placeholder="Enter employee group code"
                  />

                  <div>
                    {errors.CategoryCode && (
                      <b className="error-text">{errors.CategoryCode}</b>
                    )}
                  </div>
                </div>
              </div>
            </form>
            <div className="employeegroup-btn-container">
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
              <u>Employee Group</u>
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

export default Employeegroup;
