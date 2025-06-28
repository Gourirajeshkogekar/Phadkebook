import React, { useState, useMemo, useEffect, useRef } from "react";
import axios from "axios";
import "./Standard.css";
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

function Standard() {
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

    fetchStandards();
  }, []);

  const [StandardName, setStandardName] = useState("");
  const [StandardCode, setStandardCode] = useState("");
  const [ShortName, setShortName] = useState("");

  const [standards, setStandards] = useState([]);
  const [editingIndex, setEditingIndex] = useState(-1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [id, setId] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [errors, setErrors] = useState("");

  // Confirmation Dialog state
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [deleteIndex, setDeleteIndex] = useState(null);

  const [deleteId, setDeleteId] = useState(null);

  const stdnameRef = useRef(null);
  const stdcodeRef = useRef(null);
  const shortcodeRef = useRef(null);
  const saveRef = useRef(null);

  const handleKeyDown = (e, nextFieldRef) => {
    if (e.key === "Enter") {
      e.preventDefault();
      if (nextFieldRef && nextFieldRef.current) {
        nextFieldRef.current.focus();
      }
    }
  };

  const fetchStandards = async () => {
    try {
      const response = await axios.get(
        "https://publication.microtechsolutions.net.in/php/Standardget.php"
      );
      setStandards(response.data);
    } catch (error) {
      // toast.error("Error fetching standards:", error);
    }
  };

  useEffect(() => {
    fetchStandards();
  }, []);

  const handleNewClick = () => {
    resetForm();
    setIsModalOpen(true);

    setEditingIndex(-1);
  };

  const handleEdit = (row) => {
    const standard = standards[row.index];
    setStandardName(standard.StandardName);
    setStandardCode(standard.StandardCode);
    setShortName(standard.ShortName);
    setEditingIndex(row.index);
    setId(standard.Id);
    setIsEditing(true);
    setIsModalOpen(true);
  };

  const resetForm = () => {
    setStandardName("");
    setStandardCode("");
    setShortName("");
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
      "https://publication.microtechsolutions.net.in/php/Standarddelete.php",
      requestOptions
    )
      .then((response) => response.text())
      .then((result) => console.log(result))
      .catch((error) => console.error(error));
    toast.success("Standard Deleted Successfully");
    setIsDeleteDialogOpen(false);
    fetchStandards();
  };

  const cancelDelete = () => {
    setIsDeleteDialogOpen(false);
    setDeleteIndex(null);
  };

  const validateForm = () => {
    let formErrors = {};
    let isValid = true;

    if (!StandardName) {
      formErrors.StandardName = "Standard Name is required.";
      isValid = false;
    }

    // if (!StandardCode) {
    //   formErrors.StandardCode = "Standard Code is required.";
    //   isValid = false;
    // }
    // if (!ShortName) {
    //   formErrors.ShortName = "Short Name is required.";
    //   isValid = false;
    // }

    setErrors(formErrors);
    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    const data = {
      StandardName: StandardName,
      StandardCode: StandardCode,
      ShortName: ShortName,
      CreatedBy: userId,
    };

    const url = isEditing
      ? "https://publication.microtechsolutions.net.in/php/Standardupdate.php"
      : "https://publication.microtechsolutions.net.in/php/Standardpost.php";

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
        toast.success("Standard updated successfully!");
      } else {
        toast.success("Standard added successfully!");
      }
      setIsModalOpen(false);
      resetForm();
      fetchStandards();
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
        accessorKey: "StandardName",
        header: "Standard Name",
        size: 50,
      },
      {
        accessorKey: "StandardCode",
        header: "Standard Code",
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
    [standards]
  );

  const table = useMaterialReactTable({
    columns,
    data: standards,
    muiTableHeadCellProps: {
      style: {
        backgroundColor: "#E9ECEF", // Replace with your desired color
        color: "black",
        fontSize: "16px",
      },
    },
  });

  return (
    <div className="standard-container">
      <h1>Standard Master</h1>
      <div className="standardtable-master">
        <div className="standardtable1-master">
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
          <div className="standardtable-container">
            <MaterialReactTable table={table} />
          </div>
        </div>

        {isModalOpen && (
          <div
            className="standard-overlay"
            onClick={() => setIsModalOpen(false)}
          />
        )}

        <Modal open={isModalOpen}>
          <div className="standard-modal">
            <h2
              style={{
                textAlign: "center",
                fontWeight: "620",
                margin: "2px",
                fontSize: "27px",
              }}>
              {editingIndex >= 0 ? "Edit Standard" : "Add Standard"}
            </h2>

            <form className="standard-form">
              <div>
                <label className="standard-label">
                  Standard Code<b className="required">*</b>
                </label>
                <div>
                  <input
                    type="number"
                    id="StandardCode"
                    name="StandardCode"
                    value={StandardCode}
                    onChange={(e) => setStandardCode(e.target.value)}
                    maxLength={20}
                    ref={stdcodeRef}
                    onKeyDown={(e) => handleKeyDown(e, shortcodeRef)}
                    placeholder="Auto Incremented"
                    style={{ background: "	#D0D0D0" }}
                    className="standard-control"
                    readOnly
                  />
                  <div>
                    {errors.StandardCode && (
                      <b className="error-text">{errors.StandardCode}</b>
                    )}
                  </div>
                </div>
              </div>

              <div>
                <label className="standard-label">
                  Standard Name<b className="required">*</b>
                </label>
                <div>
                  <Tooltip
                    title={
                      <span style={{ fontSize: "14px", fontWeight: "bold" }}>
                        {StandardName}
                      </span>
                    }
                    arrow>
                    <input
                      type="text"
                      id="StandardName"
                      name="StandardName"
                      value={StandardName}
                      onChange={(e) => setStandardName(e.target.value)}
                      maxLength={50}
                      ref={stdnameRef}
                      onKeyDown={(e) => handleKeyDown(e, stdcodeRef)}
                      placeholder="Enter standard Name"
                      className="standard-control"
                    />
                  </Tooltip>
                  <div>
                    {errors.StandardName && (
                      <b className="error-text">{errors.StandardName}</b>
                    )}
                  </div>
                </div>
              </div>

              <div>
                <label className="standard-label">
                  Short Name<b className="required">*</b>
                </label>
                <div>
                  <Tooltip
                    title={
                      <span style={{ fontSize: "14px", fontWeight: "bold" }}>
                        {ShortName}
                      </span>
                    }
                    arrow>
                    <input
                      type="text"
                      id="ShortName"
                      name="ShortName"
                      value={ShortName}
                      onChange={(e) => setShortName(e.target.value)}
                      maxLength={50}
                      ref={shortcodeRef}
                      onKeyDown={(e) => handleKeyDown(e, saveRef)}
                      placeholder="Enter Short Name"
                      className="standard-control"
                    />
                  </Tooltip>
                  <div>
                    {errors.ShortName && (
                      <b className="error-text">{errors.ShortName}</b>
                    )}
                  </div>
                </div>
              </div>
            </form>

            <div className="std-btn-container">
              <Button
                type="submit"
                ref={saveRef}
                // onKeyDown={(e) => handleKeyDown(e, accgroupnameRef)}
                onClick={handleSubmit}
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
              <u>Standard</u>
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

export default Standard;
