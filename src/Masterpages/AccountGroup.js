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
} from "@mui/material";
import Select from "react-select";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import qs from "qs";
import { RiDeleteBin5Line } from "react-icons/ri";
import { CiEdit } from "react-icons/ci";
import { Tooltip } from "@mui/material";

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

  const [accountGroups, setAccountGroups] = useState([]);
  const [GroupCode, setGroupCode] = useState("");
  const [GroupName, setGroupName] = useState("");
  const [TypeCode, setTypeCode] = useState("");
  const [IsTDS, setIsTds] = useState(false);
  const [TDSId, setTDSId] = useState("");
  const [tdsOptions, setTdsOptions] = useState([]);
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

  useEffect(() => {
    fetchAccgroups();
    fetchTds();
  }, []);

  const fetchAccgroups = async () => {
    try {
      const response = await axios.get(
        "https://publication.microtechsolutions.net.in/php/AccountGroupget.php"
      );
      setAccountGroups(response.data);
    } catch (error) {
      // toast.error("Error fetching acc groups:", error);
    }
  };

  const fetchTds = async () => {
    try {
      const response = await axios.get(
        "https://publication.microtechsolutions.net.in/php/TDSMasterget.php"
      );
      const tdsOptions = response.data.map((tds) => ({
        value: tds.Id,
        label: tds.TDSHead,
      }));
      setTdsOptions(tdsOptions);
    } catch (error) {
      // toast.error("Error fetching TDS:", error);
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
    };

    // Determine the URL based on whether we're editing or adding
    const url = isEditing
      ? "https://publication.microtechsolutions.net.in/php/AccountGroupupdate.php"
      : "https://publication.microtechsolutions.net.in/php/AccountGrouppost.php";

    // If editing, include the author ID in the payload
    if (isEditing) {
      data.Id = id;
      data.UpdatedBy = userId;
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
          <div className="accountgroup-modal" onSubmit={handleSubmit}>
            <h2
              style={{
                textAlign: "center",
                fontWeight: "620",
                margin: "2px",
                fontSize: "27px",
              }}>
              {isEditing ? "Edit Account Group" : "Add Account Group"}
            </h2>

            <div className="accountgroup-form">
              <div>
                <label className="accountgroup-label">
                  Account Group Code<b className="required">*</b>
                </label>
                <div>
                  <input
                    type="text"
                    id="GroupCode"
                    name="GroupCode"
                    value={GroupCode}
                    onChange={(e) => setGroupCode(e.target.value)}
                    maxLength={15}
                    ref={accgroupcodeRef}
                    onKeyDown={(e) => handleKeyDown(e, accgroupnameRef)}
                    style={{ background: "	#D0D0D0" }}
                    placeholder="Auto-Incremented"
                    className="accountgroup-control"
                    readOnly
                  />
                  <div>
                    {errors.GroupCode && (
                      <b className="error-text">{errors.GroupCode}</b>
                    )}
                  </div>
                </div>
              </div>

              <div>
                <label className="accountgroup-label">
                  Account Group Name<b className="required">*</b>
                </label>
                <div>
                  <Tooltip
                    title={
                      <span style={{ fontSize: "14px", fontWeight: "bold" }}>
                        {GroupName}
                      </span>
                    }
                    arrow>
                    <input
                      type="text"
                      id="GroupName"
                      name="GroupName"
                      value={GroupName}
                      onChange={(e) => setGroupName(e.target.value)}
                      maxLength={100}
                      ref={accgroupnameRef}
                      onKeyDown={(e) => handleKeyDown(e, typecodeRef)}
                      style={{ width: "300px" }}
                      placeholder="Enter Account Group Name"
                      className="accountgroup-control"
                    />
                  </Tooltip>
                  <div>
                    {errors.GroupName && (
                      <b className="error-text">{errors.GroupName}</b>
                    )}
                  </div>
                </div>
              </div>

              <div>
                <label className="accountgroup-label">
                  Type Code<b className="required">*</b>
                </label>
                <div>
                  <Select
                    id="TypeCode"
                    name="TypeCode"
                    options={typeCodeOptions}
                    value={
                      typeCodeOptions.find(
                        (option) => option.value === TypeCode
                      ) || null
                    }
                    onChange={(selectedOption) =>
                      setTypeCode(selectedOption?.value || "")
                    }
                    styles={{
                      control: (base) => ({
                        ...base,
                        width: "300px",
                        marginTop: "10px",
                        marginBottom: "5px",
                        borderRadius: "4px",
                        border: "1px solid rgb(223, 222, 222)",
                      }),
                    }}
                    placeholder="-- Select Type Code --"
                    className="react-select-container"
                    classNamePrefix="react-select"
                    onKeyDown={(e) => handleKeyDown(e, tdsidRef)}
                    ref={typecodeRef}
                  />
                  <div>
                    {errors.TypeCode && (
                      <b className="error-text">{errors.TypeCode}</b>
                    )}
                  </div>
                </div>
              </div>

              <div>
                <label className="accountgroup-label">
                  TDS<b className="required">*</b>
                </label>
                <div>
                  <Select
                    id="TDSId"
                    name="TDSId"
                    value={tdsOptions.find((option) => option.value === TDSId)}
                    onChange={(option) => setTDSId(option.value)}
                    ref={tdsidRef}
                    onKeyDown={(e) => handleKeyDown(e, tdsappRef)}
                    options={tdsOptions}
                    styles={{
                      control: (base) => ({
                        ...base,
                        width: "300px",
                        marginTop: "10px",
                        marginBottom: "5px",
                        borderRadius: "4px",
                        border: "1px solid rgb(223, 222, 222)",
                      }),
                    }}
                    placeholder="Select TDS Id"
                  />
                  <div>
                    {errors.TDSId && (
                      <b className="error-text">{errors.TDSId}</b>
                    )}
                  </div>
                </div>
              </div>

              <div>
                <label className="accountgroup-label">TDS Applicable ?</label>
                <input
                  type="checkbox"
                  id="IsTDS"
                  name="IsTDS"
                  checked={IsTDS}
                  // className="accountgroup-check-control"
                  onChange={(e) => setIsTds(e.target.checked)}
                  ref={tdsappRef}
                  onKeyDown={(e) => handleKeyDown(e, printdetbalRef)}
                />
              </div>

              <div>
                <label className="accountgroup-label">
                  Print det in Bal sheet?
                </label>
                {/* <div> */}
                <input
                  type="checkbox"
                  id="IsPrintDetailsinBL"
                  name="IsPrintDetailsinBL"
                  checked={IsPrintDetailsinBL}
                  // className="accountgroup-check-control"
                  onChange={(e) => setIsPrintDetailsinBL(e.target.checked)}
                  ref={printdetbalRef}
                  onKeyDown={(e) => handleKeyDown(e, printdettrialRef)}
                />
                {/* </div> */}
              </div>

              <div>
                <label className="accountgroup-label">
                  Print det in Trial Bal?
                </label>
                {/* <div> */}
                <input
                  type="checkbox"
                  id="IsPrintDetailsinTB"
                  name="IsPrintDetailsinTB"
                  checked={IsPrintDetailsinTB}
                  //  className="accountgroup-check-control"
                  onChange={(e) => setIsPrintDetailsinTB(e.target.checked)}
                  ref={printdettrialRef}
                  onKeyDown={(e) => handleKeyDown(e, subsiaryaccRef)}
                />
                {/* </div> */}
              </div>

              <div>
                <label className="accountgroup-label">
                  Subsidiary Acc exists?
                </label>

                <input
                  type="checkbox"
                  id="IsSubsidiary"
                  name="IsSubsidiary"
                  checked={IsSubsidiary}
                  //className="accountgroup-check-control"
                  onChange={(e) => setIsSubsidiary(e.target.checked)}
                  ref={subsiaryaccRef}
                  onKeyDown={(e) => handleKeyDown(e, saveRef)}
                />
              </div>
            </div>

            <div className="accgroup-btn-container">
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
