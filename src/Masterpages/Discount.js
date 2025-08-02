import React, { useState, useMemo, useEffect } from "react";
import "./Discount.css";
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
  useRadioGroup,
} from "@mui/material";
import { toast, ToastContainer } from "react-toastify";
import Select from "react-select";
import axios from "axios";
import { RiDeleteBin5Line } from "react-icons/ri";

function Discount() {
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

    fetchDiscounts();
  }, []);

  const [discounts, setDiscounts] = useState([]);
  const [CommissionId, setCommissionId] = useState("");
  const [BookId, setBookId] = useState("");
  const [commissionOptions, setCommissionOptions] = useState([]);
  const [bookOptions, setBookOptions] = useState([]);
  const [editingIndex, setEditingIndex] = useState(-1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [id, setId] = useState("");
  const [errors, setErrors] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  // Confirmation Dialog state
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [deleteIndex, setDeleteIndex] = useState(null);

  useEffect(() => {
    fetchDiscounts();
    fetchBooks();
    fetchCommissions();
  }, []);

  const fetchDiscounts = async () => {
    try {
      const response = await axios.get(
        "https://publication.microtechsolutions.net.in/php/Discountget.php"
      );
      setDiscounts(response.data);
    } catch (error) {
      // toast.error("Error fetching discounts:", error);
    }
  };

  const fetchBooks = async () => {
    try {
      const response = await axios.get(
        "https://publication.microtechsolutions.net.in/php/Bookget.php"
      );
      const bookOptions = response.data.map((book) => ({
        value: book.Id,
        label: book.BookNameMarathi || book.BookName,
      }));
      setBookOptions(bookOptions);
    } catch (error) {
      // toast.error("Error fetching books:", error);
    }
  };

  const fetchCommissions = async () => {
    try {
      const response = await axios.get(
        "https://publication.microtechsolutions.net.in/php/Commissionget.php"
      );
      const commissionOptions = response.data.map((comm) => ({
        value: comm.Id,
        label: comm.TypeCode,
      }));
      setCommissionOptions(commissionOptions);
    } catch (error) {
      // toast.error("Error fetching commissions:", error);
    }
  };

  const resetForm = () => {
    setBookId("");
    setCommissionId("");
  };

  const handleNewClick = () => {
    resetForm();
    setIsModalOpen(true);
    setIsEditing(false);
    setEditingIndex(-1);
  };

  const handleEdit = (row) => {
    const discount = discounts[row.index];
    setCommissionId(discount.CommissionId);
    setBookId(discount.BookId);
    setEditingIndex(row.index);
    setIsModalOpen(true);
    setIsEditing(true);
    setId(discount.Id);
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
      "https://publication.microtechsolutions.net.in/php/Discountdelete.php",
      requestOptions
    )
      .then((response) => response.text())
      .then((result) => console.log(result))
      .catch((error) => console.error(error));
    toast.success("Discount Deleted Successfully");
    setIsDeleteDialogOpen(false);
    fetchDiscounts();
  };

  const cancelDelete = () => {
    setIsDeleteDialogOpen(false);
    setDeleteIndex(null);
  };

  const validateForm = () => {
    let formErrors = {};
    let isValid = true;

    if (!CommissionId) {
      formErrors.CommissionId = "Commission Id is required.";
      isValid = false;
    }

    if (!BookId) {
      formErrors.BookId = "Book Id is required.";
      isValid = false;
    }

    setErrors(formErrors);
    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent the default form submission
    if (!validateForm()) return;

    // Find the selected CommissionType and BookName
    const selectedCommission = commissionOptions.find(
      (option) => option.value === CommissionId
    );
    const selectedBook = bookOptions.find((option) => option.value === BookId);

    const data = {
      CommissionId: CommissionId,
      BookId: BookId,
      CommissionType: selectedCommission ? selectedCommission.label : "",
      BookName: selectedBook ? selectedBook.label : "",
      CreatedBy: userId,
    };

    // Determine the URL based on whether we're editing or adding
    const url = isEditing
      ? "https://publication.microtechsolutions.net.in/php/Discountupdate.php"
      : "https://publication.microtechsolutions.net.in/php/Discountpost.php";

    // If editing, include the discount ID in the payload
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
        toast.success("Discount updated successfully!");
      } else {
        toast.success("Discount added successfully!");
      }
      setIsModalOpen(false);
      resetForm();
      fetchDiscounts(); // Refresh the list after submit
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
        accessorKey: "CommissionType",
        header: "Commission",
        size: 50,
      },
      {
        accessorKey: "BookName",
        header: "Book Code",
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
    [discounts]
  );

  const table = useMaterialReactTable({
    columns,
    data: discounts,
    muiTableHeadCellProps: {
      style: {
        backgroundColor: "#E9ECEF", // Replace with your desired color
        color: "black",
        fontSize: "16px",
      },
    },
  });

  return (
    <div className="discount-container">
      <h1>Discount Master</h1>

      <div className="disctable-master">
        <div className="disctable1-master">
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
          <div className="disctable-container">
            <MaterialReactTable table={table} />
          </div>
        </div>

        {isModalOpen && (
          <div
            className="discount-overlay"
            onClick={() => setIsModalOpen(false)}
          />
        )}

        <Modal open={isModalOpen}>
          <div className="discount-modal">
            <h1
              style={{
                textAlign: "center",
                fontWeight: "620",
                margin: "2px",
                fontSize: "27px",
              }}>
              {editingIndex >= 0 ? "Edit Discount" : "Add Discount"}
            </h1>
            <form className="discount-form">
              <div>
                <label className="discount-label">
                  Commission <b className="required">*</b>
                </label>
                <div>
                  <Select
                    id="CommissionId"
                    name="CommissionId"
                    value={commissionOptions.find(
                      (option) => option.value === CommissionId
                    )}
                    onChange={(option) => setCommissionId(option.value)}
                    options={commissionOptions}
                    styles={{
                      control: (base) => ({
                        ...base,
                        width: "170px",
                        marginTop: "10px",
                        borderRadius: "4px",
                        border: "1px solid rgb(223, 222, 222)",
                        marginBottom: "5px",
                      }),
                    }}
                    placeholder="Select Comm id"
                  />

                  <div>
                    {errors.CommissionId && (
                      <b className="error-text">{errors.CommissionId}</b>
                    )}
                  </div>
                </div>
              </div>
              <div>
                <label className="discount-label">
                  Book <b className="required">*</b>
                </label>
                <div>
                  <Select
                    id="BookId"
                    name="BookId"
                    value={bookOptions.find(
                      (option) => option.value === BookId
                    )}
                    onChange={(option) => setBookId(option.value)}
                    options={bookOptions}
                    styles={{
                      control: (base) => ({
                        ...base,
                        width: "600px",
                        marginTop: "10px",
                        borderRadius: "4px",
                        border: "1px solid rgb(223, 222, 222)",
                        marginBottom: "5px",
                      }),
                    }}
                    placeholder="Select Book id"
                  />

                  <div>
                    {errors.BookId && (
                      <b className="error-text">{errors.BookId}</b>
                    )}
                  </div>
                </div>{" "}
              </div>
            </form>
            <div className="disc-btn-container">
              <Button
                type="submit"
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
              <u>Discount</u>
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

export default Discount;
