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
import "./User.css";
import Select from "react-select";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { RiDeleteBin5Line } from "react-icons/ri";
import { CiEdit } from "react-icons/ci";
import { Tooltip } from "@mui/material";

const User = () => {
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

    fetchUsers();
  }, []);

  const [Name, setName] = useState("");
  const [UserId, setUserid] = useState("");
  const [Password, setPassword] = useState("");
  const [LevelId, setLevelId] = useState("");
  const [LoginStatus, setLoginStatus] = useState("");
  const [BranchId, setBranchId] = useState("");
  const [CompanyId, setCompanyId] = useState("");
  const [levelOptions, setLevelOptions] = useState([]);
  const [branchOptions, setBranchOptions] = useState([]);
  const [companyOptions, setCompanyOptions] = useState([]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingIndex, setEditingIndex] = useState(-1);
  const [users, setUsers] = useState([]);

  const [errors, setErrors] = useState("");
  const [id, setId] = useState("");
  const [deleteId, setDeleteId] = useState(null);

  // Confirmation Dialog state
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [deleteIndex, setDeleteIndex] = useState(null);

  const nameRef = useRef(null);
  const userRef = useRef(null);
  const passwordRef = useRef(null);
  const levelRef = useRef(null);

  const loginstatusRef = useRef(null);
  const branchRef = useRef(null);
  const companyRef = useRef(null);

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
    fetchUsers();
    fetchCompanies();
    fetchLevels();
    fetchBranches();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await axios.get(
        "https://publication.microtechsolutions.net.in/php/Userget.php"
      );
      setUsers(response.data);
    } catch (error) {
      // toast.error("Error fetching users:", error);
    }
  };

  const fetchCompanies = async () => {
    try {
      const response = await axios.get(
        "https://publication.microtechsolutions.net.in/php/CompanyMasterget.php"
      );
      const companyOptions = response.data.map((comp) => ({
        value: comp.Id,
        label: comp.CompanyName,
      }));
      setCompanyOptions(companyOptions);
    } catch (error) {
      // toast.error("Error fetching Companies:", error);
    }
  };

  const fetchLevels = async () => {
    try {
      const response = await axios.get(
        "https://publication.microtechsolutions.net.in/php/Levelmasterget.php"
      );
      const levelOptions = response.data.map((level) => ({
        value: level.Id,
        label: level.LevelName,
      }));
      setLevelOptions(levelOptions);
    } catch (error) {
      // toast.error("Error fetching Levels:", error);
    }
  };

  const fetchBranches = async () => {
    try {
      const response = await axios.get(
        "https://publication.microtechsolutions.net.in/php/Branchmasterget.php"
      );
      const branchOptions = response.data.map((branch) => ({
        value: branch.Id,
        label: branch.BranchName,
      }));
      setBranchOptions(branchOptions);
    } catch (error) {
      // toast.error("Error fetching Branches:", error);
    }
  };

  const handleNewClick = () => {
    resetFormFields();
    setIsEditing(false);
    setEditingIndex(-1);
    setIsModalOpen(true);
  };

  const resetFormFields = () => {
    setName("");
    setUserid("");
    setPassword("");
    setLevelId("");
    setLoginStatus("");
    setBranchId("");
    setCompanyId("");
  };

  const handleEdit = (row) => {
    const user = users[row.index];
    setName(user.Name);
    setUserid(user.UserId);
    setPassword(user.Password);
    setLevelId(user.LevelId);
    setLoginStatus(user.LoginStatus);
    setBranchId(user.BranchId);
    setCompanyId(user.CompanyId);
    setEditingIndex(row.index);
    setIsEditing(true);
    setIsModalOpen(true);
    setId(user.Id);
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
      "https://publication.microtechsolutions.net.in/php/Userdelete.php",
      requestOptions
    )
      .then((response) => response.text())
      .then((result) => console.log(result))
      .catch((error) => console.error(error));
    toast.success("User Deleted Successfully");
    setIsDeleteDialogOpen(false);
    fetchUsers();
  };

  const cancelDelete = () => {
    setIsDeleteDialogOpen(false);
    setDeleteIndex(null);
  };

  const validateForm = () => {
    let formErrors = {};
    let isValid = true;

    if (!Name) {
      formErrors.Name = " Name is required.";
      isValid = false;
    }

    // if (!UserId) {
    //   formErrors.UserId = "User is required.";
    //   isValid = false;
    // }

    if (!Password) {
      formErrors.Password = "Password is required.";
      isValid = false;
    }

    //   if (!LevelId) {
    //     formErrors.LevelId = "Level is required.";
    //     isValid = false;
    // }

    // if (!BranchId) {
    //   formErrors.BranchId = "Branch is required.";
    //   isValid = false;
    // }

    // if (!CompanyId) {
    //   formErrors.CompanyId = "Company is required.";
    //   isValid = false;
    // }

    setErrors(formErrors);
    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent the default form submission
    if (!validateForm()) return;

    const data = {
      Name: Name,
      UserId: UserId,
      Password: Password,
      LevelId: LevelId,
      LoginStatus: LoginStatus,
      BranchId: BranchId,
      CompanyId: CompanyId,
      CreatedBy: userId,
    };

    // Determine the URL based on whether we're editing or adding
    const url = isEditing
      ? "https://publication.microtechsolutions.net.in/php/Userupdate.php"
      : "https://publication.microtechsolutions.net.in/php/Userpost.php";

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
        toast.success("User updated successfully!");
      } else {
        toast.success("User added successfully!");
      }
      setIsModalOpen(false);
      resetFormFields();
      fetchUsers(); // Refresh the list after submit
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
        accessorKey: "Name",
        header: " Name",
        size: 50,
      },
      {
        accessorKey: "UserId",
        header: "User Id",
        size: 50,
      },
      {
        accessorKey: "LoginStatus",
        header: "Login Status",
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
    [users]
  );

  const table = useMaterialReactTable({
    columns,
    data: users,
    muiTableHeadCellProps: {
      style: {
        backgroundColor: "#E9ECEF", // Replace with your desired color
        color: "black",
        fontSize: "16px",
      },
    },
  });

  return (
    <div className="user-container">
      <h1>User Master</h1>

      <div className="usertable-container">
        <div className="usertable1-container">
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
          <div className="usetable-container">
            <MaterialReactTable table={table} />
          </div>
        </div>

        {isModalOpen && (
          <div className="user-overlay" onClick={() => setIsModalOpen(false)} />
        )}

        <Modal open={isModalOpen}>
          <div className="user-modal">
            <h1
              style={{
                textAlign: "center",
                fontWeight: "620",
                margin: "2px",
                fontSize: "27px",
                marginBottom: "10px",
              }}>
              {isEditing ? "Edit User" : "Add New User"}
            </h1>
            <form className="user-form">
              <div>
                <label className="user-label">
                  {" "}
                  Name <b className="required">*</b>
                </label>
                <div>
                  <Tooltip
                    title={
                      <span style={{ fontSize: "14px", fontWeight: "bold" }}>
                        {Name}
                      </span>
                    }
                    arrow>
                    <input
                      type="text"
                      id="Name"
                      name="Name"
                      value={Name}
                      onChange={(e) => setName(e.target.value)}
                      maxLength={100}
                      ref={nameRef}
                      onKeyDown={(e) => handleKeyDown(e, userRef)}
                      className="user-control"
                      placeholder="Enter Name"
                    />
                  </Tooltip>
                  <div>
                    {errors.Name && <b className="error-text">{errors.Name}</b>}
                  </div>
                </div>
              </div>
              <div>
                <label className="user-label">
                  User Id <b className="required">*</b>
                </label>
                <div>
                  <input
                    type="number"
                    id="UserId"
                    name="UserId"
                    value={UserId}
                    onChange={(e) => setUserid(e.target.value)}
                    maxLength={50}
                    ref={userRef}
                    onKeyDown={(e) => handleKeyDown(e, passwordRef)}
                    className="user-control"
                    placeholder="Enter user id"
                  />
                  <div>
                    {errors.UserId && (
                      <b className="error-text">{errors.UserId}</b>
                    )}
                  </div>
                </div>
              </div>
              <div>
                <label className="user-label">
                  Password <b className="required">*</b>
                </label>
                <div>
                  <input
                    id="Password"
                    name="Password"
                    value={Password}
                    onChange={(e) => setPassword(e.target.value)}
                    maxLength={50}
                    ref={passwordRef}
                    onKeyDown={(e) => handleKeyDown(e, levelRef)}
                    placeholder="Enter Password"
                    className="user-control"
                  />
                  <div>
                    {errors.Password && (
                      <b className="error-text">{errors.Password}</b>
                    )}
                  </div>
                </div>
              </div>
              <div>
                <label className="user-label">
                  Level <b className="required">*</b>
                </label>
                <div>
                  <Select
                    id="LevelId"
                    name="LevelId"
                    value={levelOptions.find(
                      (option) => option.value.toString() === LevelId.toString()
                    )}
                    onChange={(option) => setLevelId(option.value)}
                    ref={levelRef}
                    onKeyDown={(e) => handleKeyDown(e, loginstatusRef)}
                    options={levelOptions}
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
                    placeholder="Select Level"
                  />

                  <div>
                    {errors.LevelId && (
                      <b className="error-text">{errors.LevelId}</b>
                    )}
                  </div>
                </div>
              </div>
              <div>
                <label className="user-label">Login Status</label>
                {/* <div> */}
                <input
                  type="checkbox"
                  id="LoginStatus"
                  name="LoginStatus"
                  checked={LoginStatus}
                  onChange={(e) => setLoginStatus(e.target.checked)}
                  ref={loginstatusRef}
                  onKeyDown={(e) => handleKeyDown(e, branchRef)}
                  // className="user-control"
                  style={{ marginLeft: "10px" }}
                  placeholder="Select Login Status"
                />
                <div>
                  {errors.LoginStatus && (
                    <b className="error-text">{errors.LoginStatus}</b>
                  )}
                </div>
                {/* </div> */}
              </div>
              <div>
                <label className="user-label">
                  Branch <b className="required">*</b>
                </label>
                <div>
                  <Select
                    id="BranchId"
                    name="BranchId"
                    value={branchOptions.find(
                      (option) =>
                        option.value.toString() === BranchId.toString()
                    )}
                    onChange={(option) => setBranchId(option.value)}
                    ref={branchRef}
                    onKeyDown={(e) => handleKeyDown(e, companyRef)}
                    options={branchOptions}
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
                    placeholder="Select Branch"
                  />

                  <div>
                    {errors.BranchId && (
                      <b className="error-text">{errors.BranchId}</b>
                    )}
                  </div>
                </div>
              </div>

              <div>
                <label className="user-label">
                  Company <b className="required">*</b>
                </label>
                <div>
                  <Select
                    id="CompanyId"
                    name="CompanyId"
                    value={companyOptions.find(
                      (option) =>
                        option.value.toString() === CompanyId.toString()
                    )}
                    onChange={(option) => setCompanyId(option.value)}
                    ref={companyRef}
                    onKeyDown={(e) => handleKeyDown(e, saveRef)}
                    options={companyOptions}
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
                    placeholder="Select Company"
                  />

                  <div>
                    {errors.CompanyId && (
                      <b className="error-text">{errors.CompanyId}</b>
                    )}
                  </div>
                </div>
              </div>
            </form>

            <div className="user-btn-container">
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
              <u>User</u>
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

export default User;
