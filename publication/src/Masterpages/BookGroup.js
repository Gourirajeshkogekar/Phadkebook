import React, { useState, useEffect, useMemo, useRef } from "react";
import axios from "axios";
import "./BookGroup.css";
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
  Tooltip,
} from "@mui/material";
import Select from "react-select";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { RiDeleteBin5Line } from "react-icons/ri";
import { CiEdit } from "react-icons/ci";

function BookGroup() {
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

    fetchBookgroups();
  }, []);

  // State variables
  const [BookGroupName, setBookGroupName] = useState("");
  const [BookGroupCode, setBookGroupCode] = useState("");
  const [Royalty, setRoyalty] = useState(false);
  const [bookgroups, setBookgroups] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingIndex, setEditingIndex] = useState(-1);
  const [id, setId] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [errors, setErrors] = useState("");
  const [deleteId, setDeleteId] = useState(null);

  const bookgroupnameRef = useRef(null);
  const bookgrcodeRef = useRef(null);
  const royaltyRef = useRef(null);
  const saveRef = useRef(null);

  const handleKeyDown = (e, nextFieldRef) => {
    if (e.key === "Enter") {
      e.preventDefault();
      if (nextFieldRef && nextFieldRef.current) {
        nextFieldRef.current.focus();
      }
    }
  };
  // Fetch book groups data
  useEffect(() => {
    fetchBookgroups();
  }, []);

  const fetchBookgroups = async () => {
    try {
      const response = await axios.get(
        "https://publication.microtechsolutions.net.in/php/BookGroupget.php"
      );
      setBookgroups(response.data);
    } catch (error) {
      // toast.error("Error fetching book groups:", error);
    }
  };

  const resetForm = () => {
    setBookGroupName("");
    setBookGroupCode("");
    setRoyalty("");
    setIsModalOpen(false);
  };

  const handleNewClick = () => {
    resetForm();
    setIsModalOpen(true);
    setEditingIndex(-1);
    setIsEditing(false);
  };

  const handleEdit = (row) => {
    const book = bookgroups[row.index];
    setBookGroupName(book.BookGroupName);
    setBookGroupCode(book.BookGroupCode);
    setRoyalty(book.Royalty);
    setEditingIndex(row.index);
    setId(book.Id);
    setIsEditing(true);
    setIsModalOpen(true);
  };

  // Confirmation Dialog state
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [deleteIndex, setDeleteIndex] = useState(null);
  // const handleDelete = (index) => {
  //   const newBookgroups = bookgroups.filter((_, i) => i !== index);
  //   setBookgroups(newBookgroups);
  //   toast.error("Book Group Deleted Successfully!");
  // };

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
      "https://publication.microtechsolutions.net.in/php/Bookgroupdelete.php",
      requestOptions
    )
      .then((response) => response.text())
      .then((result) => console.log(result))
      .catch((error) => console.error(error));
    toast.success("Book Group Deleted Successfully");
    setIsDeleteDialogOpen(false);
    fetchBookgroups();
  };

  const cancelDelete = () => {
    setIsDeleteDialogOpen(false);
    setDeleteIndex(null);
  };

  const validateForm = () => {
    let formErrors = {};
    let isValid = true;

    if (!BookGroupName) {
      formErrors.BookGroupName = "Book Group Name is required.";
      isValid = false;
    }
    if (!BookGroupCode) {
      formErrors.BookGroupCode = "Book Group Code is required.";
      isValid = false;
    }

    setErrors(formErrors);
    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    const data = {
      BookGroupName: BookGroupName,
      BookGroupCode: BookGroupCode,
      Royalty: Royalty,
      CreatedBy: userId,
    };
    const url = isEditing
      ? "https://publication.microtechsolutions.net.in/php/BookGroupupdate.php"
      : "https://publication.microtechsolutions.net.in/php/BookGrouppost.php";

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
        toast.success("Book Group updated successfully!");
      } else {
        toast.success("Book Group added successfully!");
      }
      setIsModalOpen(false);

      resetForm();
      fetchBookgroups(); // Refresh the list after submit
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
        accessorKey: "BookGroupName",
        header: "Book Group",
        size: 50,
      },
      {
        accessorKey: "BookGroupCode",
        header: "Book Group Code",
        size: 50,
      },
      {
        accessorKey: "Royalty",
        header: "Royalty",
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
    [bookgroups]
  );

  const table = useMaterialReactTable({
    columns,
    data: bookgroups,
    muiTableHeadCellProps: {
      style: {
        backgroundColor: "#E9ECEF", // Replace with your desired color
        color: "black",
        fontSize: "16px",
      },
    },
  });

  return (
    <div className="bookgroup-container">
      <h1>Book Group Master</h1>
      <div className="bookgrouptable-master">
        <div className="bookgrouptable1-master">
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
          <div className="bookgrouptable-container">
            <MaterialReactTable table={table} />
          </div>
        </div>

        {isModalOpen && (
          <div
            className="bookgroup-overlay"
            onClick={() => setIsModalOpen(false)}
          />
        )}

        <Modal open={isModalOpen}>
          <div className="bookgroup-modal">
            <h2
              style={{
                textAlign: "center",
                fontWeight: "620",
                margin: "2px",
                fontSize: "27px",
              }}>
              {editingIndex >= 0 ? "Edit Book Group " : "Add Book Group "}
            </h2>
            <form className="bookgroup-form">
              <div>
                <label className="bookgroup-label">
                  Book Group Name<b className="required">*</b>
                </label>
                <div>
                  <Tooltip
                    title={
                      <span style={{ fontSize: "14px", fontWeight: "bold" }}>
                        {BookGroupName}
                      </span>
                    }
                    arrow>
                    <input
                      type="text"
                      id="BookGroupName"
                      name="BookGroupName"
                      value={BookGroupName}
                      onChange={(e) => setBookGroupName(e.target.value)}
                      maxLength={50}
                      ref={bookgroupnameRef}
                      onKeyDown={(e) => handleKeyDown(e, bookgrcodeRef)}
                      className="bookgroup-control"
                      placeholder="Enter Book Group Name"
                    />
                  </Tooltip>
                  <div>
                    {errors.BookGroupName && (
                      <b className="error-text">{errors.BookGroupName}</b>
                    )}
                  </div>
                </div>
              </div>

              <div>
                <label className="bookgroup-label">
                  Book Group Code<b className="required">*</b>
                </label>
                <div>
                  <input
                    type="text"
                    id="BookGroupCode"
                    name="BookGroupCode"
                    value={BookGroupCode}
                    onChange={(e) => setBookGroupCode(e.target.value)}
                    maxLength={1}
                    ref={bookgrcodeRef}
                    onKeyDown={(e) => handleKeyDown(e, royaltyRef)}
                    className="bookgroup-control"
                    placeholder="Enter Book group code"
                  />
                  <div>
                    {errors.BookGroupCode && (
                      <b className="error-text">{errors.BookGroupCode}</b>
                    )}
                  </div>
                </div>
              </div>

              <div>
                <label className="bookgroup-label">Royalty</label>
                <div>
                  <input
                    type="checkbox"
                    id="Royalty"
                    name="Royalty"
                    checked={Royalty}
                    onChange={(e) => setRoyalty(e.target.checked)}
                    ref={royaltyRef}
                    onKeyDown={(e) => handleKeyDown(e, saveRef)}
                    style={{ marginTop: "10px", marginLeft: "20px" }}
                    // className="bookgroup-control"
                    placeholder="Enter Royalty"
                  />
                  <div>
                    {errors.Royalty && (
                      <b className="error-text">{errors.Royalty}</b>
                    )}
                  </div>
                </div>
              </div>
            </form>
            <div className="bookgroup-btn-container">
              <Button
                type="submit"
                style={{
                  background: "#0a60bd",
                  color: "white",
                }}
                onClick={handleSubmit}
                ref={saveRef}
                // onKeyDown={(e) => handleKeyDown(e, accgroupnameRef)}
              >
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
              <u>Book Group</u>
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

export default BookGroup;
