import React, { useState, useEffect, useMemo, useRef } from "react";
import axios from "axios";
import "./Country.css";
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
import { Tooltip } from "@mui/material";

function Country() {
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

    fetchCountries();
  }, []);
  const [convassor, setConvassor] = useState("");
  const [CountryName, setCountryName] = useState("");
  const [countries, setCountries] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingIndex, setEditingIndex] = useState(-1);
  const [id, setId] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [errors, setErrors] = useState("");
  const [deleteId, setDeleteId] = useState(null);

  // Confirmation Dialog state
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [deleteIndex, setDeleteIndex] = useState(null);

  const countrynameRef = useRef(null);
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
    fetchCountries();
  }, []);

  const fetchCountries = async () => {
    try {
      const response = await axios.get(
        "https://publication.microtechsolutions.net.in/php/Countryget.php"
      );

      setCountries(response.data);
    } catch (error) {
      // toast.error("Error fetching countries:", error);
    }
  };

  const resetForm = () => {
    setCountryName("");

    setConvassor("");
    setIsModalOpen(false);
  };

  const handleNewClick = () => {
    resetForm();
    setIsModalOpen(true);
    setEditingIndex(-1);
  };

  const handleEdit = (row) => {
    const country = countries[row.index];
    setCountryName(country.CountryName);
    setEditingIndex(row.index);
    setId(country.Id);
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
      "https://publication.microtechsolutions.net.in/php/Countrydelete.php",
      requestOptions
    )
      .then((response) => response.text())
      .then((result) => console.log(result))
      .catch((error) => console.error(error));
    toast.success("Country Deleted Successfully");
    setIsDeleteDialogOpen(false);
    fetchCountries();
  };

  const cancelDelete = () => {
    setIsDeleteDialogOpen(false);
    setDeleteIndex(null);
  };

  const validateForm = () => {
    let formErrors = {};
    let isValid = true;
    if (!CountryName) {
      formErrors.CountryName = "Country Name is required.";
      isValid = false;
    }
    setErrors(formErrors);
    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    const data = {
      CountryName: CountryName,
      CreatedBy: userId,
    };

    const url = isEditing
      ? "https://publication.microtechsolutions.net.in/php/Countryupdate.php"
      : "https://publication.microtechsolutions.net.in/php/Countrypost.php";

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
        toast.success("Country updated successfully!");
      } else {
        toast.success("Country added successfully!");
      }
      setIsModalOpen(false);
      resetForm();
      fetchCountries();
    } catch (error) {
      toast.error("Error saving record!");
    }
  };

  const removeDuplicateEntries = () => {
    const uniqueCountries = countries.filter(
      (country, index, self) =>
        index === self.findIndex((c) => c.CountryName === country.CountryName)
    );
    if (uniqueCountries.length === countries.length) {
      toast.info("No Duplicate Countries found");
    } else {
      setCountries(uniqueCountries);
      toast.success("Duplicate Countries removed");
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
        accessorKey: "CountryName",
        header: "Country",
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
    [countries]
  );

  const table = useMaterialReactTable({
    columns,
    data: countries,
    muiTableHeadCellProps: {
      style: {
        backgroundColor: "#E9ECEF", // Replace with your desired color
        color: "black",
        fontSize: "16px",
      },
    },
  });

  return (
    <div className="country-container">
      <h1>Country Master</h1>
      <div className="countrytable-master">
        <div className="countrytable1-master">
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
          <Button
            onClick={removeDuplicateEntries}
            style={{
              color: "orange",
              fontWeight: "700",
              marginLeft: "10px",
              background: "#0a60bd",
            }}>
            Remove Duplicate
          </Button>
          <div className="countrytable-container">
            <MaterialReactTable table={table} />
          </div>
        </div>

        {isModalOpen && (
          <div
            className="country-overlay"
            onClick={() => setIsModalOpen(false)}
          />
        )}

        <Modal open={isModalOpen}>
          <div className="country-modal">
            <h1
              style={{
                textAlign: "center",
                fontWeight: "620",
                margin: "2px",
                fontSize: "27px",
              }}>
              {editingIndex >= 0 ? "Edit Country" : "Add Country"}
            </h1>

            <form className="country-form">
              <div>
                <label className="country-label">
                  {" "}
                  Country<b className="required">*</b>
                </label>
                <div>
                  <Tooltip
                    title={
                      <span style={{ fontSize: "14px", fontWeight: "bold" }}>
                        {CountryName}
                      </span>
                    }
                    arrow>
                    <input
                      type="text"
                      id="CountryName"
                      name="CountryName"
                      value={CountryName}
                      onChange={(e) => setCountryName(e.target.value)}
                      maxLength={50}
                      ref={countrynameRef}
                      onKeyDown={(e) => handleKeyDown(e, saveRef)}
                      className="country-control"
                      placeholder="Enter Country Name"
                    />
                  </Tooltip>
                  <div>
                    {errors.CountryName && (
                      <b className="error-text">{errors.CountryName}</b>
                    )}
                  </div>
                </div>
              </div>
            </form>

            <div className="country-btn-container">
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
              <u>Country</u>
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

export default Country;
