import React, { useState, useEffect, useMemo, useRef } from "react";
import axios from "axios";
import "./BookMedium.css";
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
import Select from "react-select";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { RiDeleteBin5Line } from "react-icons/ri";

function BookMedium() {
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

    fetchBookmediums();
  }, []);

  const [BookMediumName, setBookMediumName] = useState("");
  const [MediumCode, setMediumCode] = useState("");
  const [bookmediums, setBookmediums] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingIndex, setEditingIndex] = useState(-1);
  const [id, setId] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [errors, setErrors] = useState("");
  // Confirmation Dialog state
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [deleteIndex, setDeleteIndex] = useState(null);
  const [deleteId, setDeleteId] = useState(null);

  const bookmednameRef = useRef(null);
  const bookmedcodeRef = useRef(null);
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
    fetchBookmediums();
  }, []);

  const fetchBookmediums = async () => {
    try {
      const response = await axios.get(
        "https://publication.microtechsolutions.net.in/php/BookMediumget.php"
      );

      setBookmediums(response.data);
    } catch (error) {
      // toast.error("Error fetching Book mediums:", error);
    }
  };

  const resetForm = () => {
    setBookMediumName("");
    setMediumCode("");
    setIsModalOpen(false);
  };

  const handleNewClick = () => {
    resetForm();
    setIsModalOpen(true);
    setEditingIndex(-1);
  };

  const handleEdit = (row) => {
    const book = bookmediums[row.index];
    setBookMediumName(book.BookMediumName);
    setMediumCode(book.MediumCode);
    setEditingIndex(row.index);
    setId(book.Id);
    setIsEditing(true);
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
      "https://publication.microtechsolutions.net.in/php/Bookmediumdelete.php",
      requestOptions
    )
      .then((response) => response.text())
      .then((result) => console.log(result))
      .catch((error) => console.error(error));
    toast.success("Book Medium Deleted Successfully");
    setIsDeleteDialogOpen(false);
    fetchBookmediums();
  };

  const cancelDelete = () => {
    setIsDeleteDialogOpen(false);
    setDeleteIndex(null);
  };

  const validateForm = () => {
    let formErrors = {};
    let isValid = true;

    if (!BookMediumName) {
      formErrors.BookMediumName = "Book medium Name is required.";
      isValid = false;
    }

    //   if (!MediumCode) {
    //     formErrors.MediumCode = " Medium Code is required.";
    //     isValid = false;

    // }

    setErrors(formErrors);
    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent the default form submission
    if (!validateForm()) return;

    const data = {
      BookMediumName: BookMediumName,
      MediumCode: MediumCode,
      CreatedBy: userId,
    };

    const url = isEditing
      ? "https://publication.microtechsolutions.net.in/php/BookMediumupdate.php"
      : "https://publication.microtechsolutions.net.in/php/BookMediumpost.php";

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
        toast.success("Book Medium updated successfully!");
      } else {
        toast.success("Book medium added successfully!");
      }
      setIsModalOpen(false);
      resetForm();
      fetchBookmediums(); // Refresh the list after submit
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
        accessorKey: "BookMediumName",
        header: "Book Medium Name",
        size: 50,
        headerClassName: "center-align", // Center align header text
        cellClassName: "center-align",
      },
      {
        accessorKey: "MediumCode",
        header: "Medium Code",
        size: 50,
        headerClassName: "center-align", // Center align header text
        cellClassName: "center-align",
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
              {" "}
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
    [bookmediums]
  );

  const table = useMaterialReactTable({
    columns,
    data: bookmediums,
    muiTableHeadCellProps: {
      style: {
        backgroundColor: "#E9ECEF", // Replace with your desired color
        color: "black",
        fontSize: "16px",
      },
    },
  });

  return (
    <div className="bookmedium-container">
      <h1>Book Medium Master</h1>
      <div className="bookmediumtable-master">
        <div className="bookmediumtable1-master">
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

          <div className="bookmediumtable-container">
            <MaterialReactTable table={table} />
          </div>
        </div>

        {isModalOpen && (
          <div
            className="bookmedium-overlay"
            onClick={() => setIsModalOpen(false)}
          />
        )}

        <Modal open={isModalOpen}>
          <div className="bookmedium-modal">
            <h2
              style={{
                textAlign: "center",
                fontWeight: "620",
                margin: "2px",
                fontSize: "27px",
              }}>
              {editingIndex >= 0 ? "Edit Book Medium " : "Add Book Medium "}
            </h2>

            <form className="bookmedium-form">
              <div>
                <label className="bookmedium-label">
                  {" "}
                  Book Medium Name<b className="required">*</b>
                </label>
                <div>
                  <input
                    type="text"
                    id="BookMediumName"
                    name="BookMediumName"
                    value={BookMediumName}
                    onChange={(e) => setBookMediumName(e.target.value)}
                    maxLength={100}
                    ref={bookmednameRef}
                    onKeyDown={(e) => handleKeyDown(e, bookmedcodeRef)}
                    className="bookmedium-control"
                    placeholder="Enter Book Medium Name"
                  />
                  <div>
                    {errors.BookMediumName && (
                      <b className="error-text">{errors.BookMediumName}</b>
                    )}
                  </div>
                </div>
              </div>

              <div>
                <label className="bookmedium-label">
                  {" "}
                  Book Medium Code<b className="required">*</b>
                </label>
                <div>
                  <input
                    type="text"
                    id="MediumCode"
                    name="MediumCode"
                    value={MediumCode}
                    onChange={(e) => setMediumCode(e.target.value)}
                    maxLength={1}
                    ref={bookmedcodeRef}
                    onKeyDown={(e) => handleKeyDown(e, saveRef)}
                    className="bookmedium-control"
                    placeholder="Enter Book Medium Code"
                  />
                  {/* <div>
                    {errors.MediumCode && <b className="error-text">{errors.MediumCode}</b>}
                      </div>         */}
                </div>
              </div>
            </form>

            <div className="bookmedium-btn-container">
              <Button
                type="submit"
                style={{
                  background: "#0a60bd",
                  color: "white",
                }}
                ref={saveRef}
                // onKeyDown={(e) => handleKeyDown(e, accgroupnameRef)}
                onClick={handleSubmit}>
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
              <u>Book Medium</u>
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

export default BookMedium;
