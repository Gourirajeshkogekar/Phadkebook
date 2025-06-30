import React, { useState, useMemo, useEffect, useRef } from "react";
import "./SubAccountGroup.css";
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
import Select from "react-select";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import { RiDeleteBin5Line } from "react-icons/ri";
import { Tooltip } from "@mui/material";

function SubAccountGroup() {
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

    fetchSubaccounts();
  }, []);

  const [SubGroupCode, setSubGroupCode] = useState("");
  const [SubGroupName, setSubGroupName] = useState("");
  const [subaccs, setSubaccs] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingIndex, setEditingIndex] = useState(-1);
  const [id, setId] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [errors, setErrors] = useState("");
  const [deleteId, setDeleteId] = useState(null);

  // Confirmation Dialog state
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [deleteIndex, setDeleteIndex] = useState(null);

  const subaccgrpcodeRef = useRef(null);
  const subaccgrpnameRef = useRef(null);
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
    fetchSubaccounts();
  }, []);

  const fetchSubaccounts = async () => {
    try {
      const response = await axios.get(
        "https://publication.microtechsolutions.net.in/php/SubAccountGroupget.php"
      );

      setSubaccs(response.data);
    } catch (error) {
      // toast.error("Error fetching Sub Account groups:", error);
    }
  };

  const resetForm = () => {
    setSubGroupCode("");
    setSubGroupName("");
    setIsModalOpen(false);
  };

  const handleNewClick = () => {
    resetForm();
    setIsModalOpen(true);
    setEditingIndex(-1);
  };

  const handleEdit = (row) => {
    const subacc = subaccs[row.index];
    setSubGroupCode(subacc.SubGroupCode);
    setSubGroupName(subacc.SubGroupName);
    setEditingIndex(row.index);
    setIsModalOpen(true);
    setIsEditing(true);
    setId(subacc.Id);
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
      "https://publication.microtechsolutions.net.in/php/Subaccountgroupdelete.php",
      requestOptions
    )
      .then((response) => response.text())
      .then((result) => console.log(result))
      .catch((error) => console.error(error));
    toast.success("Sub Acc Group Deleted Successfully");
    setIsDeleteDialogOpen(false);
    fetchSubaccounts();
  };

  const cancelDelete = () => {
    setIsDeleteDialogOpen(false);
    setDeleteIndex(null);
  };

  const validateForm = () => {
    let formErrors = {};
    let isValid = true;

    // if (!SubGroupCode) {
    //   formErrors.SubGroupCode = "Sub Group code is required.";
    //   isValid = false;
    // }

    if (!SubGroupName) {
      formErrors.SubGroupName = "Sub Group Name is required.";
      isValid = false;
    }

    setErrors(formErrors);
    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent the default form submission
    if (!validateForm()) return;

    const data = {
      SubGroupCode: SubGroupCode,
      SubGroupName: SubGroupName,
      CreatedBy: userId,
    };

    const url = isEditing
      ? "https://publication.microtechsolutions.net.in/php/SubAccountGroupupdate.php"
      : "https://publication.microtechsolutions.net.in/php/SubAccountGrouppost.php";

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
        toast.success("Sub Account updated successfully!");
      } else {
        toast.success("Sub Account  added successfully!");
      }
      setIsModalOpen(false);
      resetForm();
      fetchSubaccounts(); // Refresh the list after submit
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
        accessorKey: "SubGroupName",
        header: "Sub Account Name",
        size: 50,
      },
      {
        accessorKey: "SubGroupCode",
        header: "Sub Account Code",
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
    [subaccs]
  );

  const table = useMaterialReactTable({
    columns,
    data: subaccs,
    muiTableHeadCellProps: {
      style: {
        backgroundColor: "#E9ECEF", // Replace with your desired color
        color: "black",
        fontSize: "16px",
      },
    },
  });

  return (
    <div className="subaccgroup-container">
      <h1>Sub Account Group Master</h1>
      <div className="subaccgrouptable-master">
        <div className="subaccgrouptable1-master">
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
          <div className="subaccgrouptable-container">
            <MaterialReactTable table={table} />
          </div>
        </div>

        {isModalOpen && (
          <div
            className="subaccgroup-overlay"
            onClick={() => setIsModalOpen(false)}
          />
        )}

        <Modal open={isModalOpen}>
          <div className="subaccgroup-modal">
            <h2
              style={{
                textAlign: "center",
                fontWeight: "620",
                margin: "2px",
                fontSize: "27px",
              }}>
              {editingIndex >= 0
                ? "Edit Sub Account Group"
                : "Add Sub Account Group"}
            </h2>
            <form onSubmit={handleSubmit} className="subaccgroup-form">
              <div>
                <label className="subaccgroup-label">
                  {" "}
                  Sub Account Group Code <b className="required">*</b>
                </label>
                <div>
                  <input
                    type=""
                    id="SubGroupCode"
                    name="SubGroupCode"
                    value={SubGroupCode}
                    onChange={(e) => setSubGroupCode(e.target.value)}
                    maxLength={50}
                    ref={subaccgrpcodeRef}
                    onKeyDown={(e) => handleKeyDown(e, subaccgrpnameRef)}
                    className="subaccgroup-control"
                    style={{ background: "	#D0D0D0" }}
                    placeholder="Auto-Incremented"
                    readOnly
                  />

                  <div>
                    {errors.SubGroupCode && (
                      <b className="error-text">{errors.SubGroupCode}</b>
                    )}
                  </div>
                </div>
              </div>

              <div>
                <label className="subaccgroup-label">
                  Sub Account Name <b className="required">*</b>
                </label>
                <div>
                  <Tooltip
                    title={
                      <span style={{ fontSize: "14px", fontWeight: "bold" }}>
                        {SubGroupName}
                      </span>
                    }
                    arrow>
                    <input
                      id="SubGroupName"
                      name="SubGroupName"
                      value={SubGroupName}
                      onChange={(e) => setSubGroupName(e.target.value)}
                      maxLength={100}
                      ref={subaccgrpnameRef}
                      onKeyDown={(e) => handleKeyDown(e, saveRef)}
                      className="subaccgroup-control"
                      placeholder="Enter Sub Acc Name"
                    />
                  </Tooltip>
                  <div>
                    {errors.SubGroupName && (
                      <b className="error-text">{errors.SubGroupName}</b>
                    )}
                  </div>
                </div>
              </div>
            </form>

            <div className="subaccgroup-btn-container">
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
        {/* Confirmation Dialog for Delete */}
        <Dialog open={isDeleteDialogOpen} onClose={cancelDelete}>
          <DialogTitle style={{ color: "navy", fontWeight: "600" }}>
            Confirm Deletion
          </DialogTitle>
          <DialogContent>
            Are you sure you want to delete this{" "}
            <b style={{ color: "red" }}>
              <u>Sub Account Group</u>
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

export default SubAccountGroup;
