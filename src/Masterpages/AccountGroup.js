import React, { useState, useMemo, useEffect, useRef } from "react";
import "./Accountgroup.css";
import axios from "axios";
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
  FormControlLabel,
} from "@mui/material";
import Select from "react-select";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import qs from "qs";
import { RiDeleteBin5Line } from "react-icons/ri";
import { CiEdit } from "react-icons/ci";
import { Tooltip } from "@mui/material";
import { Grid, Checkbox, Radio } from "@mui/material";

function AccountGroup() {
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

    fetchAccgroups();
  }, []);

  const [AccountGroupName, setAccountGroupName] = useState("");

  const [TDS, setTDS] = useState(false);

  const [category, setCategory] = useState("");

  const [balanceDetails, setBalanceDetails] = useState(false);
  const [trialDetails, setTrialDetails] = useState(false);
  const [subsidiary, setSubsidiary] = useState(false);

  const [accountGroups, setAccountGroups] = useState([]);
  const [GroupCode, setGroupCode] = useState("");
  const [GroupName, setGroupName] = useState("");
  const [MainGroupId, setMainGroupId] = useState("");
  const [AccountType, setAccountType] = useState("");

  const [TypeCode, setTypeCode] = useState("");
  const [IsTDS, setIsTds] = useState(false);
  const [TDSId, setTDSId] = useState("");
  const [tdsOptions, setTdsOptions] = useState([]);
  const [mainGroupOptions, setMaingroupoptions] = useState([]);
  const [IsPrintDetailsinBL, setIsPrintDetailsinBL] = useState(false);
  const [IsPrintDetailsinTB, setIsPrintDetailsinTB] = useState(false);
  const [IsSubsidiary, setIsSubsidiary] = useState(false);
  const [editingIndex, setEditingIndex] = useState(-1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [errors, setErrors] = useState("");
  const [id, setId] = useState("");
  // Confirmation Dialog state
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [deleteIndex, setDeleteIndex] = useState(null);
  const [deleteId, setDeleteId] = useState(null);

  const accgroupcodeRef = useRef(null);

  const accgroupnameRef = useRef(null);
  const typecodeRef = useRef(null);
  const tdsidRef = useRef(null);

  const tdsappRef = useRef(null);
  const printdetbalRef = useRef(null);
  const printdettrialRef = useRef(null);
  const subsiaryaccRef = useRef(null);
  const saveRef = useRef(null);

  const handleKeyDown = (e, nextFieldRef) => {
    if (e.key === "Enter") {
      e.preventDefault();
      if (nextFieldRef && nextFieldRef.current) {
        nextFieldRef.current.focus();
      }
    }
  };

  // Define the options
  const typeCodeOptions = [
    { value: "T", label: "T" },
    { value: "P", label: "P" },
    { value: "B", label: "B" },
    { value: "S", label: "S" },
    { value: "C", label: "C" },
    { value: "O", label: "O" },
  ];

  const [activeCompany, setActiveCompany] = useState(null);
  
 useEffect(() => {
    const selected = localStorage.getItem("SelectedCompany");
    if (selected) {
      try {
        const parsedCompany = JSON.parse(selected);
        setActiveCompany(parsedCompany);
        
        // Load data immediately
        fetchAccgroups( ); // No ID needed here since it returns all
        fetchTds();
        fetchmaingroups();
      } catch (e) {
        console.error("Error parsing company data", e);
      }
    }
  }, []); // 👈 Keeping this [] is what stops the infinite loop!

  const fetchAccgroups = async () => {
  try {
    const response = await axios.get(
      `https://publication.microtechsolutions.net.in/php/AccountGroupget.php`
    );
    
    // The API returns { "status": "success", "data": [...] }
    // MaterialReactTable expects an ARRAY, not an object.
    if (response.data && response.data.data) {
      setAccountGroups(response.data.data); 
    } else {
      setAccountGroups([]); // Fallback to empty array if data is missing
    }
    
  } catch (error) {
    console.error("Error fetching acc groups:", error);
    toast.error("Failed to load account groups.");
  }
};
  const fetchTds = async () => {
    try {
      const response = await axios.get(
        "https://publication.microtechsolutions.net.in/php/TDSMasterget.php"
      );
      const tdsOptions = response.data.data.map((tds) => ({
        value: tds.Id,
        label: tds.TDSHead,
      }));
      setTdsOptions(tdsOptions);
    } catch (error) {
      // toast.error("Error fetching TDS:", error);
    }
  };

  const fetchmaingroups = async () => {
    try {
      const response = await axios.get(
        `https://publication.microtechsolutions.net.in/php/get/getMainGroup.php`
      );
      const mainoptions = response.data.map((main) => ({
        value: main.Id,
        label: main.MainGroupName,
      }));
      setMaingroupoptions(mainoptions);
    } catch (error) {
      // toast.error("Error fetching mainoptions:", error);
    }
  };

  const handleNewClick = () => {
    resetForm();
    setIsModalOpen(true);
    setEditingIndex(-1);
    setIsEditing(false);
  };

  const handleEdit = (row) => {
    const accountgroup = accountGroups[row.index];

    console.log(accountgroup, "selected row of account group");
    setGroupCode(accountgroup.GroupCode);
    setGroupName(accountgroup.GroupName);
    setTypeCode(accountgroup.TypeCode);
    setIsTds(accountgroup.IsTDS);
    setTDSId(accountgroup.TDSId);
    setIsPrintDetailsinBL(accountgroup.IsPrintDetailsinBL);
    setIsPrintDetailsinTB(accountgroup.IsPrintDetailsinTB);
    setIsSubsidiary(accountgroup.IsSubsidiary);
    setIsEditing(true);
    setEditingIndex(row.index);
    setIsModalOpen(true); // Ensure modal is opened after setting state
    setId(accountgroup.Id);
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
    urlencoded.append("CompanyId",activeCompany.Id);

    const requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: urlencoded,
      redirect: "follow",
    };

    fetch(
      "https://publication.microtechsolutions.net.in/php/Accountgroupdelete.php",
      requestOptions
    )
      .then((response) => response.text())
      .then((result) => console.log(result))
      .catch((error) => console.error(error));
    toast.success("Account Group Deleted Successfully");
    setIsDeleteDialogOpen(false);
    // setDeleteIndex(deleteIndex)
    fetchAccgroups();
  };

  const cancelDelete = () => {
    setIsDeleteDialogOpen(false);
    setDeleteIndex(null);
  };

  const resetForm = () => {
    setGroupCode("");
    setGroupName("");
    setTypeCode("");
    setIsTds(false);
    setTDSId("");
    setIsPrintDetailsinBL(false);
    setIsPrintDetailsinTB(false);
    setIsSubsidiary(false);
  };

  const validateForm = () => {
    let formErrors = {};
    let isValid = true;

    // if (!GroupCode) {
    //   formErrors.GroupCode = "Group Code is required.";
    //   isValid = false;
    // }

    if (!GroupName) {
      formErrors.GroupName = "Group Name is required.";
      isValid = false;
    }

    if (!TypeCode) {
      formErrors.TypeCode = "Type Code is required.";
      isValid = false;
    }

    if (!TDSId) {
      formErrors.TDSId = "TDS Id is required.";
      isValid = false;
    }

    setErrors(formErrors);
    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent the default form submission
    if (!validateForm()) return;

    // Prepare the data payload
    const data = {
      GroupCode: GroupCode,
      GroupName: GroupName,
      TypeCode: TypeCode,
      IsTDS: IsTDS ? 1 : 0,
      TDSId: TDSId,
      IsPrintDetailsinBL: IsPrintDetailsinBL ? 1 : 0,
      IsPrintDetailsinTB: IsPrintDetailsinTB ? 1 : 0,
      IsSubsidiary: IsSubsidiary ? 1 : 0,
      CreatedBy: userId,
      CompanyId:activeCompany.Id
    };

    // Determine the URL based on whether we're editing or adding
    const url = isEditing
      ? "https://publication.microtechsolutions.net.in/php/AccountGroupupdate.php"
      : "https://publication.microtechsolutions.net.in/php/AccountGrouppost.php";

    // If editing, include the author ID in the payload
    if (isEditing) {
      data.Id = id;
      data.UpdatedBy = userId;
      data.CompanyId = activeCompany.Id;
    }

    try {
      // console.log("Sending data to server:", data);
      const response = await axios.post(url, qs.stringify(data), {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      });
      // console.log("Server response:", response.data);

      if (isEditing) {
        toast.success("Account group updated successfully!");
      } else {
        toast.success("Account group added successfully!");
      }
      setIsModalOpen(false);
      resetForm();
      fetchAccgroups(); // Refresh the list after submit
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
        accessorKey: "GroupName",
        header: "Account Group Name",
        size: 50,
      },
      {
        accessorKey: "GroupCode",
        header: "Account Group Code",
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
                // background: "#3c7291",
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
    [accountGroups]
  );

  const table = useMaterialReactTable({
    columns,
    data: accountGroups,
    muiTableHeadCellProps: {
      style: {
        backgroundColor: "#E9ECEF", // Replace with your desired color
        color: "black",
        fontSize: "16px",
      },
    },
  });

  return (
    <div className="accountgroup-container">
      <h1>Account Group Master</h1>

      <div className="accountgrouptable-master">
        <div className="accountgrouptable1-master">
          {" "}
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
          <div className="accgrouptable-container">
            <MaterialReactTable table={table} />
          </div>
        </div>

        {isModalOpen && (
          <div
            className="accountgroup-overlay"
            onClick={() => setIsModalOpen(false)}
          />
        )}

        <Modal open={isModalOpen}>
          <div
            style={{
              position: "absolute",
              top: "45%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              background: "white",
              padding: "10px",
              width: "70%",
              maxHeight: "100vh",
              overflowY: "auto",
              borderRadius: "10px",
            }}>
            <h2
              style={{
                textAlign: "center",
                fontWeight: "620",
                margin: "2px",
                fontSize: "27px",
              }}>
              {isEditing ? "Edit Account Group" : "Add Account Group"}
            </h2>
           

            <Grid container spacing={3} sx={{ p: 2 }}>
              {/* LEFT COLUMN */}
              <Grid item xs={12} md={6}>
                <label className="account-label">Account Group Code</label>
                <Grid>
                  <input
                    type="text"
                    value="Auto-Incremented"
                    disabled
                    className="accountgroup-control"
                    placeholder="Auto-incremented"
                  />
                </Grid>
              </Grid>

              {/* RIGHT COLUMN */}
              <Grid item xs={12} md={6}>
                <label className="account-label">Account Group Name</label>
                <Grid>
                  <input
                    type="text"
                    value={GroupName}
                    onChange={(e) => setGroupName(e.target.value)}
                    className="accountgroup-control"
                    style={{ width: "250px" }}
                    placeholder="Enter group name"
                  />
                </Grid>
              </Grid>

              {/* MAIN GROUP DROPDOWN */}
              <Grid item xs={12} md={6}>
                <label className="account-label">Main Group</label>
                <Grid>
                  <Select
                    id="MainGroupId"
                    name="MainGroupId"
                    value={mainGroupOptions.find(
                      (option) => option.value === MainGroupId
                    )}
                    onChange={(option) => setMainGroupId(option.value)}
                    options={mainGroupOptions}
                    styles={{
                      control: (base) => ({
                        ...base,
                        width: "250px",
                        marginTop: "10px",
                        borderRadius: "4px",
                        border: "1px solid rgb(223, 222, 222)",
                        marginBottom: "5px",
                      }),
                    }}
                    placeholder="Select Main Group Id"
                  />
                </Grid>
              </Grid>

              {/* TDS CHECKBOX */}
              <Grid item xs={12} md={6}>
                <label className="account-label">
                  TDS Applicable to this group?
                </label>
                <Checkbox
                  checked={TDS}
                  onChange={(e) => setTDS(e.target.checked)}
                />
              </Grid>

              {/* RADIO BUTTONS SECTION */}
              <Grid item xs={12} container spacing={2}>
                <Grid item xs={12} md={3}>
                  <label className="account-label">Party?</label>
                  <Radio
                    checked={category === "party"}
                    onChange={() => setCategory("party")}
                  />
                </Grid>

                <Grid item xs={12} md={3}>
                  <label className="account-label">Fixed Asset?</label>
                  <Radio
                    checked={category === "fixedasset"}
                    onChange={() => setCategory("fixedasset")}
                  />
                </Grid>

                <Grid item xs={12} md={3}>
                  <label className="account-label">Cash/Bank?</label>
                  <Radio
                    checked={category === "cashbank"}
                    onChange={() => setCategory("cashbank")}
                  />
                </Grid>

                <Grid item xs={12} md={3}>
                  <label className="account-label">Other?</label>
                  <Radio
                    checked={category === "other"}
                    onChange={() => setCategory("other")}
                  />
                </Grid>
              </Grid>

              {/* CHECKBOX SECTION */}
              {/* BALANCE SHEET CHECKBOX */}
              <Grid item xs={12} md={4}>
                <label className="account-label">
                  Print Det in Bal Sheet / P & L A/c?
                </label>
                <Checkbox
                  checked={balanceDetails}
                  onChange={() => setBalanceDetails(!balanceDetails)}
                />
              </Grid>

              {/* TRIAL BALANCE CHECKBOX */}
              <Grid item xs={12} md={4}>
                <label className="account-label">
                  Print Details in Trial Balance?
                </label>
                <Checkbox
                  checked={trialDetails}
                  onChange={() => setTrialDetails(!trialDetails)}
                />
              </Grid>

              {/* SUBSIDIARY CHECKBOX */}
              <Grid item xs={12} md={4}>
                <label className="account-label">
                  Subsidiary Account exists?
                </label>
                <Checkbox
                  checked={subsidiary}
                  onChange={() => setSubsidiary(!subsidiary)}
                />
              </Grid>

              {/* BUTTONS */}
              <Grid className="accgroup-btn-container">
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
              </Grid>
            </Grid>
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
              <u>Account Group</u>
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

export default AccountGroup;
