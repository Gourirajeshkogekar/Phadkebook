import React, { useState, useMemo, useEffect, useRef } from "react";
import "./Commission.css";
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
import Select from "react-select";

function Commission() {
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

    fetchCommissions();
  }, []);
  const [TypeCode, setTypecode] = useState("");
  const [BookOrGroupId, setBookorGroupid] = useState("");
  const [StandardId, setStandardId] = useState("");
  const [ProfessorCategoryId, setProfessorCategoryId] = useState("");
  const [StartCopy, setStartCopy] = useState("");
  const [EndCopy, setEndCopy] = useState("");
  const [CommissionPercentage, setCommissionPercentage] = useState("");
  const [categories, setCategories] = useState([]);
  const [books, setBooks] = useState([]);
  const [bookgroups, setBookgroups] = useState([]);
  const [standards, setStandards] = useState([]);
  const [commissions, setCommissions] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingIndex, setEditingIndex] = useState(-1);
  const [isEditing, setIsEditing] = useState(false);
  const [id, setId] = useState("");
  const [errors, setErrors] = useState("");
  const [deleteId, setDeleteId] = useState(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [deleteIndex, setDeleteIndex] = useState(null);

  const typcodeRef = useRef(null);

  const bookorgroupidRef = useRef(null);
  const stdidRef = useRef(null);
  const profcatidRef = useRef(null);

  const startcopyRef = useRef(null);
  const endcopyRef = useRef(null);
  const commpercentageRef = useRef(null);

  const saveRef = useRef(null);

  const handleKeyDown = (e, nextFieldRef) => {
    if (e.key === "Enter") {
      e.preventDefault();
      if (nextFieldRef && nextFieldRef.current) {
        nextFieldRef.current.focus();
      }
    }
  };

  const fetchCommissions = async () => {
    try {
      const response = await axios.get(
        "https://publication.microtechsolutions.net.in/php/Commissionget.php"
      );
      setCommissions(response.data);
    } catch (error) {
      // toast.error("Error fetching commissions:", error);
    }
  };

  useEffect(() => {
    fetchCommissions();
    fetchStandards();
    fetchBookgroups();
    fetchBooks();
    fetchProfcategories();
  }, []);

  const fetchStandards = async () => {
    try {
      const response = await axios.get(
        "https://publication.microtechsolutions.net.in/php/Standardget.php"
      );
      const bookstandardOptions = response.data.map((std) => ({
        value: std.Id,
        label: std.StandardName,
      }));
      setStandards(bookstandardOptions);
    } catch (error) {
      // console.error("Error fetching  standards:", error);
    }
  };

  const fetchBooks = async () => {
    try {
      const response = await axios.get(
        "https://publication.microtechsolutions.net.in/php/Bookget.php"
      );
      setBooks(
        response.data.map((std) => ({
          value: std.Id,
          label: std.BookName,
        }))
      );
    } catch (error) {
      // console.error("Error fetching books:", error);
    }
  };

  const fetchBookgroups = async () => {
    try {
      const response = await axios.get(
        "https://publication.microtechsolutions.net.in/php/Bookgroupget.php"
      );
      setBookgroups(
        response.data.map((std) => ({
          value: std.Id,
          label: std.BookGroupName,
        }))
      );
    } catch (error) {
      // console.error("Error fetching book groups:", error);
    }
  };

  const fetchProfcategories = async () => {
    try {
      const response = await axios.get(
        "https://publication.microtechsolutions.net.in/php/Professorcategoryget.php"
      );
      const catOptions = response.data.map((cat) => ({
        value: cat.Id,
        label: cat.CategoryName,
      }));
      setCategories(catOptions);
    } catch (error) {
      // console.error("Error fetching  categories:", error);
    }
  };

  const resetForm = () => {
    setTypecode("");
    setBookorGroupid("");
    setStandardId("");
    setProfessorCategoryId("");
    setStartCopy("");
    setEndCopy("");
    setCommissionPercentage("");
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
    const comm = commissions[row.index];

    console.log(comm, "comm");
    setTypecode(comm.TypeCode); // Ensure this matches your data field
    setBookorGroupid(comm.BookOrGroupId);
    setStandardId(comm.StandardId);
    setProfessorCategoryId(comm.ProfessorCategoryId);
    setStartCopy(comm.StartCopy);
    setEndCopy(comm.EndCopy);
    setCommissionPercentage(comm.CommissionPercentage);
    setEditingIndex(row.index);
    setIsEditing(true); // Ensure isEditing is set to true for editing
    setIsModalOpen(true);
    setId(comm.Id);
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
      "https://publication.microtechsolutions.net.in/php/Commissiondelete.php",
      requestOptions
    )
      .then((response) => response.text())
      .then((result) => console.log(result))
      .catch((error) => console.error(error));
    toast.success("Commission Deleted Successfully");
    setIsDeleteDialogOpen(false);
    fetchCommissions();
  };

  const cancelDelete = () => {
    setIsDeleteDialogOpen(false);
    setDeleteIndex(null);
  };

  const validateForm = () => {
    let formErrors = {};
    let isValid = true;

    // if (!CommissionType) {
    //   formErrors.CommissionType = "Commission type is required.";
    //   isValid = false;
    // }

    // if (!Percentage) {
    //     formErrors.Percentage = "Percentage is required.";
    //     isValid = false;
    //   }

    setErrors(formErrors);
    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Only validate form if it's a POST request (not editing)
    if (!isEditing && !validateForm()) return;

    const data = {
      TypeCode: TypeCode,
      BookOrGroupId: BookOrGroupId,
      StandardId: StandardId,
      ProfessorCategoryId: ProfessorCategoryId,
      StartCopy: StartCopy,
      EndCopy: EndCopy,
      CommissionPercentage: CommissionPercentage,
      CreatedBy: userId,
    };

    const url = isEditing
      ? "https://publication.microtechsolutions.net.in/php/Commissionupdate.php"
      : "https://publication.microtechsolutions.net.in/php/Commissionpost.php";

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
        toast.success("Commission updated successfully!");
      } else {
        toast.success("Commission added successfully!");
      }
      setIsModalOpen(false);
      resetForm();
      fetchCommissions();
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
        accessorKey: "CommissionPercentage",
        header: "Commission Percentage",
        size: 50,
      },
      {
        accessorKey: "TypeCode",
        header: "Type Code",
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
    [commissions]
  );

  const table = useMaterialReactTable({
    columns,
    data: commissions,
    muiTableHeadCellProps: {
      style: {
        backgroundColor: "#E9ECEF", // Replace with your desired color
        color: "black",
        fontSize: "16px",
      },
    },
  });

  return (
    <>
      <div className="commission-container">
        <h1>Commission Master</h1>
        <div className="commissiontable-master">
          <div className="commissiontable1-master">
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
            <div className="commissiontable-container">
              <MaterialReactTable table={table} />
            </div>
          </div>

          {isModalOpen && (
            <div
              className="commission-overlay"
              onClick={() => setIsModalOpen(false)}
            />
          )}

          <Modal open={isModalOpen}>
            <div className="commission-modal">
              <h1
                style={{
                  textAlign: "center",
                  fontWeight: "620",
                  margin: "2px",
                  fontSize: "27px",
                  marginBottom: "10px",
                }}>
                {editingIndex >= 0 ? "Edit Commission" : "Add Commission"}
              </h1>

              <div>
                <label className="commission-label">
                  {" "}
                  Type Code<b className="required">*</b>
                </label>
                <div>
                  <label>
                    <input
                      type="radio"
                      name="TypeCode"
                      value="B"
                      checked={TypeCode === "B"}
                      onChange={(e) => setTypecode(e.target.value)}
                      ref={typcodeRef}
                      onKeyDown={(e) => handleKeyDown(e, bookorgroupidRef)}
                    />
                    <b> Bookwise </b>
                  </label>
                  <label style={{ marginLeft: "10px" }}>
                    <input
                      type="radio"
                      name="TypeCode"
                      value="G"
                      checked={TypeCode === "G"}
                      onChange={(e) => setTypecode(e.target.value)}
                      ref={typcodeRef}
                      onKeyDown={(e) => handleKeyDown(e, bookorgroupidRef)}
                    />
                    <b> Group + Standard</b>
                  </label>
                </div>
              </div>
              <hr
                style={{
                  borderColor: "#0a60bd",
                  marginBottom: "20px",
                  marginTop: "20px",
                }}
              />
              <form className="commission-form">
                <div>
                  <label className="commission-label">
                    Book or Group Id<b className="required">*</b>
                  </label>
                  {TypeCode === "B" ? (
                    <Select
                      id="BookOrGroupId"
                      name="BookOrGroupId"
                      value={books.find(
                        (option) => option.value === BookOrGroupId
                      )}
                      onChange={(option) => setBookorGroupid(option.value)}
                      ref={bookorgroupidRef}
                      onKeyDown={(e) => handleKeyDown(e, profcatidRef)}
                      options={books} // Only display books
                      styles={{
                        control: (base) => ({
                          ...base,
                          width: "170px",
                          marginTop: "10px",
                          borderRadius: "4px",
                          border: "1px solid rgb(223, 222, 222)",
                          marginBottom: "5px",
                        }),
                        menu: (base) => ({
                          ...base,
                          zIndex: 100,
                        }),
                      }}
                      placeholder="Select Book"
                    />
                  ) : TypeCode === "G" ? (
                    <Select
                      id="BookOrGroupId"
                      name="BookOrGroupId"
                      value={bookgroups.find(
                        (option) => option.value === BookOrGroupId
                      )}
                      onChange={(option) => setBookorGroupid(option.value)}
                      ref={bookorgroupidRef}
                      onKeyDown={(e) => handleKeyDown(e, profcatidRef)}
                      options={bookgroups} // Only display book groups
                      styles={{
                        control: (base) => ({
                          ...base,
                          width: "170px",
                          marginTop: "10px",
                          borderRadius: "4px",
                          border: "1px solid rgb(223, 222, 222)",
                          marginBottom: "5px",
                        }),
                        menu: (base) => ({
                          ...base,
                          zIndex: 100,
                        }),
                      }}
                      placeholder="Select BookGroup"
                    />
                  ) : null}
                </div>

                <div>
                  <label className="commission-label">
                    Party Category<b className="required">*</b>
                  </label>
                  <div>
                    <Select
                      id="ProfessorCategoryId"
                      name="ProfessorCategoryId"
                      value={categories.find(
                        (option) => option.value === ProfessorCategoryId
                      )}
                      onChange={(option) =>
                        setProfessorCategoryId(option.value)
                      }
                      ref={profcatidRef}
                      onKeyDown={(e) => handleKeyDown(e, stdidRef)}
                      options={categories}
                      styles={{
                        control: (base) => ({
                          ...base,
                          width: "170px",
                          marginTop: "10px",
                          borderRadius: "4px",
                          border: "1px solid rgb(223, 222, 222)",
                          marginBottom: "5px",
                        }),
                        menu: (base) => ({
                          ...base,
                          zIndex: 100,
                        }),
                      }}
                      placeholder="Professor category"
                    />
                  </div>
                </div>

                <div>
                  <label className="commission-label">
                    Standard Id<b className="required">*</b>
                  </label>
                  <div>
                    <Select
                      id="StandardId"
                      name="StandardId"
                      // value={standards.find(
                      //   (option) => option.value === StandardId
                      // )}

                      value={standards.find(
                        (option) =>
                          option.value.toString() === StandardId.toString()
                      )}
                      onChange={(option) => setStandardId(option.value)}
                      ref={stdidRef}
                      onKeyDown={(e) => handleKeyDown(e, startcopyRef)}
                      options={standards}
                      styles={{
                        control: (base) => ({
                          ...base,
                          width: "170px",
                          marginTop: "10px",
                          borderRadius: "4px",
                          border: "1px solid rgb(223, 222, 222)",
                          marginBottom: "5px",
                        }),
                        menu: (base) => ({
                          ...base,
                          zIndex: 100,
                        }),
                      }}
                      placeholder="Standard"
                    />
                  </div>
                </div>

                <div>
                  <label className="commission-label">
                    Start Copy<b className="required">*</b>
                  </label>
                  <div>
                    <input
                      type="number"
                      id="StartCopy"
                      name="StartCopy"
                      value={StartCopy}
                      onChange={(e) => setStartCopy(e.target.value)}
                      ref={startcopyRef}
                      onKeyDown={(e) => handleKeyDown(e, endcopyRef)}
                      className="commission-control"
                      placeholder="Enter Start Copy"
                    />
                  </div>

                  {errors.StartCopy && (
                    <b className="error-text">{errors.StartCopy}</b>
                  )}
                </div>

                <div>
                  <label className="commission-label">
                    End Copy<b className="required">*</b>
                  </label>
                  <div>
                    <input
                      type="number"
                      id="EndCopy"
                      name="EndCopy"
                      value={EndCopy}
                      onChange={(e) => setEndCopy(e.target.value)}
                      ref={endcopyRef}
                      onKeyDown={(e) => handleKeyDown(e, commpercentageRef)}
                      className="commission-control"
                      placeholder="Enter End Copy"
                    />{" "}
                  </div>
                  <div>
                    {errors.EndCopy && (
                      <b className="error-text">{errors.EndCopy}</b>
                    )}
                  </div>
                </div>

                <div>
                  <label className="commission-label">
                    Commission %<b className="required">*</b>
                  </label>
                  <div>
                    <input
                      type="text"
                      id="CommissionPercentage"
                      name="CommissionPercentage"
                      value={CommissionPercentage}
                      onChange={(e) => setCommissionPercentage(e.target.value)}
                      ref={commpercentageRef}
                      onKeyDown={(e) => handleKeyDown(e, saveRef)}
                      className="commission-control"
                      placeholder="Enter Commission Percentage"
                    />
                  </div>

                  {errors.CommissionPercentage && (
                    <b className="error-text">{errors.CommissionPercentage}</b>
                  )}
                </div>
              </form>

              <div className="commission-btn-container">
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

          <Dialog open={isDeleteDialogOpen} onClose={cancelDelete}>
            <DialogTitle style={{ color: "navy", fontWeight: "600" }}>
              Confirm Deletion
            </DialogTitle>
            <DialogContent>
              Are you sure you want to delete this{" "}
              <b style={{ color: "red" }}>
                <u>Commission</u>
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
    </>
  );
}

export default Commission;
