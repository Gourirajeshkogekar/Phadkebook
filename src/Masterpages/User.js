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


    const [activeCompany, setActiveCompany] = useState(null);
          
         useEffect(() => {
            const selected = localStorage.getItem("SelectedCompany");
            if (selected) {
              try {
                const parsedCompany = JSON.parse(selected);
                setActiveCompany(parsedCompany);
                
                // Load data immediately
 fetchUsers();
    fetchCompanies();
    fetchLevels();
    fetchBranches();
                } catch (e) {
                console.error("Error parsing company data", e);
              }
            }
          }, []); 

              

  
  const [Name, setName] = useState("");
  const [UserId, setUserid] = useState("");
  const [Password, setPassword] = useState("");
  const [ConfirmPassword, setConfirmPassword] = useState("");
  const [LevelId, setLevelId] = useState("");
  const [LoginStatus, setLoginStatus] = useState("");
  const [BranchId, setBranchId] = useState("");
  const [CompanyId, setCompanyId] = useState("");

  const [CreatedOn, setCreatedOn] = useState("");
  const [Designation, setDesignation] = useState("");
  const [AllowPayroll, setAllowPayroll] = useState("");
  const [CanChangeOnFirstLogin, setCanChangeOnFirstLogin] = useState("");
  const [Status, setStatus] = useState("");
  const [statusOptions, setStatusOptions] = useState([
    { value: "Active", label: "Active" },
    { value: "Inactive", label: "Inactive" },
  ]);

  const [designationOptions, setDesignationOptions] = useState([
    { value: "Administrator", label: "Administrator" },
    { value: "Clerk", label: "Clerk" },
    { value: "Salesman", label: "Salesman" },
    { value: "Auditor", label: "Auditor" },
  ]);

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



  const fetchUsers = async () => {
    try {
      const response = await axios.get(
        `https://publication.microtechsolutions.net.in/php/Userget.php`
      );
      setUsers(response.data.data);
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
    urlencoded.append("CompanyId", activeCompany.Id);

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

  // const handleSubmit = async (e) => {
  //   e.preventDefault();

  //   const data = {
  //     Name: Name,
  //     UserId: UserId,
  //     Password: Password,
  //     LevelId: LevelId,
  //     LoginStatus: LoginStatus,
  //     BranchId: BranchId,
  //     CompanyId: CompanyId,
  //     CreatedBy: userId,
  //   };

  //   const url = isEditing
  //     ? "https://publication.microtechsolutions.net.in/php/Userupdate.php"
  //     : "https://publication.microtechsolutions.net.in/php/Userpost.php";

  //   if (isEditing) {
  //     data.Id = id;
  //     data.UpdatedBy = userId;
  //   }

  //   try {
  //     await axios.post(url, data, {
  //       headers: {
  //         "Content-Type": "application/x-www-form-urlencoded",
  //       },
  //     });

  //     if (isEditing) {
  //       toast.success("User updated successfully!");
  //     } else {
  //       toast.success("User added successfully!");
  //     }
  //     setIsModalOpen(false);
  //     resetFormFields();
  //     fetchUsers(); // Refresh the list after submit
  //   } catch (error) {
  //     toast.error("Error saving record!");
  //   }
  // };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // === VALIDATION ===
    if (!Name.trim()) {
      toast.error("Please enter Name");
      return;
    }

    if (!UserId.trim()) {
      toast.error("Please enter User Id");
      return;
    }

    if (!Password.trim()) {
      toast.error("Please enter Password");
      return;
    }

    if (!ConfirmPassword.trim()) {
      toast.error("Please confirm the Password");
      return;
    }

    if (Password !== ConfirmPassword) {
      toast.error("Password and Confirm Password do not match");
      return;
    }

    if (!Designation) {
      toast.error("Please select Designation");
      return;
    }

    if (!Status) {
      toast.error("Please select Status");
      return;
    }

    // === DATA PREPARATION ===
    const data = {
      Name,
      UserId,
      Password,
      LevelId,
      LoginStatus,
      BranchId,
      CompanyId,
      Designation,
      Status,
      AllowPayroll: AllowPayroll ? 1 : 0,
      CanChangeOnFirstLogin: CanChangeOnFirstLogin ? 1 : 0,
      CreatedBy: userId,
      CompanyId: activeCompany.Id,
    };

    const url = isEditing
      ? "https://publication.microtechsolutions.net.in/php/Userupdate.php"
      : "https://publication.microtechsolutions.net.in/php/Userpost.php";

    if (isEditing) {
      data.Id = id;
      data.UpdatedBy = userId;
      data.CompanyId = activeCompany.Id
    }

    try {
      await axios.post(url, data, {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      });

      toast.success(
        isEditing ? "User updated successfully!" : "User added successfully!"
      );

      setIsModalOpen(false);
      resetFormFields();
      fetchUsers();
    } catch (error) {
      toast.error("Error saving user!");
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
              {isEditing ? "Edit User" : "Add User"}
            </h1>
            <form className="user-form">
              <div>
                <label className="user-label"> Name</label>
                <div>
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
                </div>
              </div>

              <div>
                <label className="user-label">User Id</label>
                <div>
                  <input
                    type="text"
                    id="UserId"
                    name="UserId"
                    value={UserId}
                    onChange={(e) => setUserid(e.target.value)} // ✅ FIXED
                    maxLength={50}
                    style={{ width: "150px" }}
                    placeholder="Enter User Id"
                    className="user-control"
                  />
                </div>
              </div>

              <div>
                <label className="user-label">Password</label>
                <div>
                  <input
                    id="Password"
                    name="Password"
                    value={Password}
                    onChange={(e) => setPassword(e.target.value)}
                    maxLength={50}
                    style={{ width: "250px" }}
                    ref={passwordRef}
                    onKeyDown={(e) => handleKeyDown(e, levelRef)}
                    placeholder="Enter Password"
                    className="user-control"
                  />
                </div>
              </div>

              <div>
                <label className="user-label">Confirm Password</label>
                <div>
                  <input
                    id="ConfirmPassword"
                    name="ConfirmPassword"
                    value={ConfirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    maxLength={50}
                    style={{ width: "250px" }}
                    ref={passwordRef}
                    onKeyDown={(e) => handleKeyDown(e, levelRef)}
                    placeholder="Enter confirm password"
                    className="user-control"
                  />
                </div>
              </div>

              <div>
                <label className="user-label"></label>
                <input
                  type="checkbox"
                  checked={CanChangeOnFirstLogin}
                  onChange={(e) => setCanChangeOnFirstLogin(e.target.checked)}
                />
                <span style={{ marginLeft: "10px" }}>
                  User can change password on first login
                </span>
              </div>

              <div>
                <label className="user-label"></label>

                <input
                  type="checkbox"
                  checked={AllowPayroll}
                  onChange={(e) => setAllowPayroll(e.target.checked)}
                />
                <span style={{ marginLeft: "10px" }}>
                  Allow to work in Payroll System?
                </span>
              </div>

              <div>
                <label className="user-label">Designation</label>

                <div>
                  {" "}
                  <Select
                    options={designationOptions}
                    value={designationOptions.find(
                      (o) => o.value === Designation
                    )}
                    onChange={(o) => setDesignation(o.value)}
                    styles={{
                      control: (base) => ({
                        ...base,
                        width: "300px",
                        marginTop: "10px",
                        border: "1px solid #cfcfcf",
                      }),
                    }}
                  />
                </div>
              </div>

              <div>
                <label className="user-label">Status</label>
                <div>
                  <Select
                    options={statusOptions}
                    value={statusOptions.find((o) => o.value === Status)}
                    onChange={(o) => setStatus(o.value)}
                    styles={{
                      control: (base) => ({
                        ...base,
                        width: "300px",
                        marginTop: "10px",

                        border: "1px solid #cfcfcf",
                      }),
                    }}
                  />
                </div>
              </div>
            </form>

            <div className="user-btn-container">
              <Button
                onClick={handleSubmit}
                ref={saveRef}
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
