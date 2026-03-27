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
  TextField,
} from "@mui/material";
import axios from "axios";
import "./college.css";
import Select from "react-select";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { RiDeleteBin5Line } from "react-icons/ri";
import { CiEdit } from "react-icons/ci";
import { CircularProgress } from "@mui/material"; // Import CircularProgress for spinner
import { Tooltip } from "@mui/material";
import { Autocomplete } from "@mui/material";

const College = () => {
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

    fetchColleges();
  }, []);

const [pageIndex, setPageIndex] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [activeCompany, setActiveCompany] = useState(null);
    
   useEffect(() => {
      const selected = localStorage.getItem("SelectedCompany");
      if (selected) {
        try {
          const parsedCompany = JSON.parse(selected);
          setActiveCompany(parsedCompany);
          
          // Load data immediately
          fetchColleges()
         fetchAllCities();
    fetchStates();
    fetchAreas();
    fetchCollegegroups();
        } catch (e) {
          console.error("Error parsing company data", e);
        }
      }
    }, [pageIndex]); 



       


  

  const [CollegeName, setCollegeName] = useState("");
  const [CollegeCode, setCollegeCode] = useState("");
  const [CollegeGroupCode, setCollegeGroupcode] = useState("");
  const [CollegeGroupId, setCollegeGroupId] = useState("");
  const [EmailId, setEmailId] = useState("");
  const [Address1, setAddress1] = useState("");
  const [Address2, setAddress2] = useState("");

  const [Address3, setAddress3] = useState("");

  const [CityId, setCityId] = useState("");
  const [StateId, setStateId] = useState("");
  const [AreaId, setAreaId] = useState("");

  const [MobileNo, setMobileNo] = useState("");
  const [Pincode, setPincode] = useState("");
  const [FaxNo, setFaxNo] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingIndex, setEditingIndex] = useState(-1);
  const [colleges, setColleges] = useState([]);
  const [cityOptions, setCityOptions] = useState([]);
  const [stateOptions, setStateOptions] = useState([]);
  const [areaOptions, setareaOptions] = useState([]);
  const [collegegroupOptions, setCollegegroupOptions] = useState([]);
  const [errors, setErrors] = useState("");
  const [id, setId] = useState("");
  const [deleteId, setDeleteId] = useState(null);

  const [loading, setLoading] = useState(true); // Add this state

  // Confirmation Dialog state
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [deleteIndex, setDeleteIndex] = useState(null);

  const collegenameRef = useRef(null);
  const collegecodeRef = useRef(null);
  const collgroupIdRef = useRef(null);
  const emailidRef = useRef(null);
  const address1Ref = useRef(null);
  const address2Ref = useRef(null);
  const address3Ref = useRef(null);
  const areaRef = useRef(null);
  const cityRef = useRef(null);
  const stateRef = useRef(null);
  const pinRef = useRef(null);
  const mobileRef = useRef(null);
  const faxRef = useRef(null);
  const saveRef = useRef(null);

  const handleKeyDown = (e, nextFieldRef) => {
    if (e.key === "Enter") {
      e.preventDefault();
      if (nextFieldRef && nextFieldRef.current) {
        nextFieldRef.current.focus();
      }
    }
  };



  

 

  const fetchColleges = async () => {
    try {
      const response = await axios.get(
        `https://publication.microtechsolutions.net.in/php/get/gettblpage.php?Table=College&PageNo=${pageIndex}`
      );
      // setSellschallans(response.data);
      console.log(response.data, "response of College");

      setColleges(response.data.data);
      setTotalPages(response.data.total_pages);
    } catch (error) {
      // toast.error("Error fetching colleges:", error);
    }
  };

  const fetchStates = async () => {
    try {
      const response = await axios.get(
        "https://publication.microtechsolutions.net.in/php/State.php",
      );
      const stateOptions = response.data.map((state) => ({
        value: state.Id,
        label: state.StateName,
      }));
      setStateOptions(stateOptions);
    } catch (error) {
      // toast.error("Error fetching states:", error);
    }
  };

  const fetchCollegegroups = async () => {
    try {
      const response = await axios.get(
        "https://publication.microtechsolutions.net.in/php/Collegegroupmasterget.php",
      );
      const collegegroupOptions = response.data.map((clggrp) => ({
        value: String(clggrp.Id),
        label: clggrp.CollegeGroupCode,
      }));
      setCollegegroupOptions(collegegroupOptions);
    } catch (error) {
      // toast.error("Error fetching colege groups:", error);
    }
  };

  const fetchAllCities = async () => {
    try {
      const response = await axios.get(
        "https://publication.microtechsolutions.net.in/php/Cityget.php",
      );
      const options = response.data.map((city) => ({
        value: city.Id,
        label: city.CityName,
      }));
      setCityOptions(options);
    } catch (error) {
      // toast.error("Error fetching cities:", error);
    }
  };
  const fetchAreas = async () => {
    try {
      const response = await axios.get(
        "https://publication.microtechsolutions.net.in/php/Areaget.php",
      );
      const areaOptions = response.data.map((area) => ({
        value: area.Id,
        label: area.AreaName,
      }));
      setareaOptions(areaOptions);
    } catch (error) {
      // toast.error("Error fetching areas:", error);
    }
  };

  const handleNewClick = () => {
    resetFormFields();
    setIsEditing(false);
    setIsModalOpen(true);
  };

  const handleEdit = (row) => {
    const college = colleges[row.index];
    console.log(college, "college record to edit");
    setCollegeName(college.CollegeName);
    setCollegeCode(college.CollegeCode);
    setCollegeGroupId(college.CollegeGroupId || "");
    setEmailId(college.EmailId);
    setAreaId(college.AreaId || "");
    setAddress1(college.Address1 || "");
    setCityId(college.CityId || "");
    setStateId(college.StateId || "");
    setMobileNo(college.MobileNo || "");
    setPincode(college.Pincode || "");
    setFaxNo(college.FaxNo || "");
    setEditingIndex(row.index);
    setIsEditing(true);
    setIsModalOpen(true);
    setId(college.Id);
  };

  const handleDelete = (index, Id) => {
    setDeleteIndex(index);
    setDeleteId(Id);
    setIsDeleteDialogOpen(true);
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
      "https://publication.microtechsolutions.net.in/php/Collegedelete.php",
      requestOptions,
    )
      .then((response) => response.text())
      .then((result) => console.log(result))
      .catch((error) => console.error(error));
    toast.success("College Deleted Successfully");
    setIsDeleteDialogOpen(false);
    fetchColleges();
  };

  const cancelDelete = () => {
    setIsDeleteDialogOpen(false);
    setDeleteIndex(null);
  };

  const validateForm = () => {
    let formErrors = {};

    let isValid = true;

    if (!CollegeName) {
      formErrors.CollegeName = "College Name is required.";
      isValid = false;
    }

    if (!EmailId) {
      formErrors.EmailId = "Email Id is required.";
      isValid = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(EmailId)) {
      formErrors.EmailId = "Email Id is invalid.";
      isValid = false;
    }

    if (!Address1) {
      formErrors.Address1 = "Address is required.";
      isValid = false;
    }

    if (!Address2) {
      formErrors.Address2 = "Address is required.";
      isValid = false;
    }

    if (!Address3) {
      formErrors.Address3 = "Address is required.";
      isValid = false;
    }

    if (!AreaId) {
      formErrors.AreaId = "Area is required.";
      isValid = false;
    }

    // // State
    // if (!StateId) {
    //     formErrors.StateId = "State is required.";
    //     isValid = false;
    // }

    // // City
    // if (!CityId) {
    //     formErrors.CityId = "City is required.";
    //     isValid = false;
    // }

    // Pincode
    if (!Pincode) {
      formErrors.Pincode = "Pincode is required.";
      isValid = false;
    } else if (!/^\d{6}$/.test(Pincode)) {
      formErrors.Pincode = "Pincode must be 6 digits.";
      isValid = false;
    }

    // Mobile No
    // if (!MobileNo) {
    //   formErrors.MobileNo = "Mobile No is required.";
    //   isValid = false;
    // } else if (!/^\d{11}$/.test(MobileNo)) {
    //   formErrors.MobileNo = "Mobile No must be 10 digits.";
    //   isValid = false;
    // }

    // if (!FaxNo) {
    //   formErrors.FaxNo = "Fax No is required.";
    //   isValid = false;
    // }

    setErrors(formErrors);
    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent the default form submission
    if (!validateForm()) return;

    const data = {
      CollegeName: CollegeName,
      CollegeCode: CollegeCode,
      CollegeGroupId: CollegeGroupId,
      Address1: Address1,
      Address2: Address1,
      Address3: Address1,
      AreaId: AreaId,
      CityId: CityId,
      StateId: StateId,
      Pincode: Pincode,
      MobileNo: MobileNo,
      FaxNo: 123456,
      EmailId: EmailId,
      CreatedBy: userId,
      CompanyId : activeCompany.Id
    };

    // Determine the URL based on whether we're editing or adding
    const url = isEditing
      ? "https://publication.microtechsolutions.net.in/php/Collegeupdate.php"
      : "https://publication.microtechsolutions.net.in/php/Collegepost.php";

    // If editing, include the author ID in the payload
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

      if (isEditing) {
        toast.success("College updated successfully!");
      } else {
        toast.success("College added successfully!");
      }
      setIsModalOpen(false);
      resetFormFields();
      fetchColleges(); // Refresh the list after submit
    } catch (error) {
      // console.error("Error saving record:", error);
      toast.error("Error saving record!");
    }
  };

  const resetFormFields = () => {
    setCollegeName("");
    setCollegeCode("");
    setCollegeGroupId("");
    setEmailId("");
    setAreaId("");
    setAddress1("");
    setCityId("");
    setStateId("");
    setMobileNo("");
    setPincode("");
    setFaxNo("");
    setEditingIndex(-1);
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
        accessorKey: "CollegeName",
        header: "College Name",
        size: 50,
      },
      {
        accessorKey: "CollegeCode",
        header: "College Code",
        size: 50,
      },
      {
        accessorKey: "CollegeGroupId",
        header: "College Group Code",
        size: 50,
      },

      // {
      //   accessorKey: "Address1",
      //   header: "Address",
      //   size: 50,
      // },
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
    [colleges],
  );

  const table = useMaterialReactTable({
    columns,
    data: colleges,
    enablePagination: false,
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
      <div className="college-container">
        <h1>College Master</h1>

      
        <div className="collegetable-container">
          <div className="collegetable1-container">
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
            <div className="colltable-container">
              <MaterialReactTable table={table} />
            </div>
            {/* Pagination Controls */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                marginTop: "10px",
              }}>
              <Button
                onClick={() =>
                  setPageIndex((prev) => Math.max(Number(prev) - 1, 1))
                }>
                ◀ Prev
              </Button>
              <input
                type="number"
                value={pageIndex}
                onChange={(e) => {
                  const newPage = Number(e.target.value); // Convert to Number
                  if (!isNaN(newPage) && newPage >= 1) {
                    setPageIndex(newPage);
                  }
                }}
                style={{
                  width: "50px",
                  textAlign: "center",
                  margin: "0 10px",
                  marginBottom: "5px",
                }}
              />
              <Button onClick={() => setPageIndex((prev) => Number(prev) + 1)}>
                Next ▶
              </Button>{" "}
              Total Pages : {totalPages}
            </div>
          </div>
        </div>

        {isModalOpen && (
          <div
            className="college-overlay"
            onClick={() => setIsModalOpen(false)}
          />
        )}

        <Modal open={isModalOpen}>
          <div className="college-modal">
            <h2
              style={{
                textAlign: "center",
                fontWeight: "620",
                margin: "2px",
                fontSize: "27px",
                marginBottom: "10px",
              }}>
              {isEditing ? "Edit College" : "Add College"}
            </h2>
            <form className="college-form">
              <div className="othercol-rows">
                <div>
                  <label className="college-label">College Name</label>
                  <div>
                    <Tooltip
                      title={
                        <span style={{ fontSize: "14px", fontWeight: "bold" }}>
                          {CollegeName}
                        </span>
                      }
                      arrow>
                      <input
                        type="text"
                        id="CollegeName"
                        name="CollegeName"
                        value={CollegeName}
                        onChange={(e) => setCollegeName(e.target.value)}
                        maxLength={100}
                        ref={collegenameRef}
                        onKeyDown={(e) => handleKeyDown(e, collegecodeRef)}
                        style={{ width: "400px" }}
                        className="college-control"
                        placeholder="Enter College Name"
                      />
                    </Tooltip>
                  </div>
                </div>

                <div>
                  <label className="college-label">Class Code</label>
                  <div>
                    <Select
                      id="CollegeGroupId"
                      name="CollegeGroupId"
                      value={collegegroupOptions.find(
                        (option) => option.value === CollegeGroupId,
                      )}
                      onChange={(option) => setCollegeGroupId(option.value)}
                      ref={collgroupIdRef}
                      onKeyDown={(e) => handleKeyDown(e, emailidRef)}
                      options={collegegroupOptions}
                      styles={{
                        control: (base) => ({
                          ...base,
                          width: "350px",
                          marginTop: "10px",
                          borderRadius: "4px",
                          border: "1px solid rgb(223, 222, 222)",
                          marginBottom: "5px",
                        }),
                      }}
                      placeholder="Select Class code"
                    />
                  </div>
                </div>

                <div className="address-box">
                  <label className="college-label">Address</label>
                  <div>
                    <input
                      className="college-control"
                      value={Address1}
                      onChange={(e) => setAddress1(e.target.value)}
                      placeholder="Enter Address 1"
                    />
                    <input
                      className="college-control"
                      value={Address2}
                      onChange={(e) => setAddress2(e.target.value)}
                      placeholder="Enter Address 2"
                    />
                    <input
                      className="college-control"
                      value={Address3}
                      onChange={(e) => setAddress3(e.target.value)}
                      placeholder="Enter Address 3"
                    />
                  </div>
                </div>

                <div>
                  <label className="college-label">City</label>
                  <div>
                    <Autocomplete
                      options={cityOptions}
                      value={
                        cityOptions.find((option) => option.value === CityId) ||
                        null
                      }
                      onChange={(event, newValue) =>
                        setCityId(newValue ? newValue.value : "")
                      }
                      getOptionLabel={(option) => option.label}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          placeholder="Select City"
                          size="small"
                          margin="none"
                          fullWidth
                        />
                      )}
                      sx={{
                        width: 300,
                        mt: 1.25, // same as marginTop 10px
                        mb: 0.625, // marginBottom 5px
                        "& .MuiOutlinedInput-root": {
                          borderRadius: "4px",
                        },
                      }}
                    />
                  </div>
                </div>

                <div>
                  <label className="college-label">Area</label>
                  <div>
                    <Autocomplete
                      options={areaOptions}
                      value={
                        areaOptions.find((option) => option.value === AreaId) ||
                        null
                      }
                      onChange={(event, newValue) =>
                        setAreaId(newValue ? newValue.value : "")
                      }
                      getOptionLabel={(option) => option.label}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          placeholder="Select Area"
                          size="small"
                          margin="none"
                          fullWidth
                        />
                      )}
                      sx={{
                        width: 300,
                        mt: 1.25, // same as marginTop 10px
                        mb: 0.625, // marginBottom 5px
                        "& .MuiOutlinedInput-root": {
                          borderRadius: "4px",
                        },
                      }}
                    />
                  </div>
                </div>

                <div>
                  <label className="college-label">Pincode</label>
                  <div>
                    <input
                      id="Pincode"
                      name="Pincode"
                      value={Pincode}
                      onChange={(e) => setPincode(e.target.value)}
                      maxLength={6}
                      ref={pinRef}
                      onKeyDown={(e) => handleKeyDown(e, mobileRef)}
                      className="college-control"
                      placeholder="Enter Pincode"
                    />
                  </div>
                </div>

                <div>
                  <label className="college-label">Mobile No</label>
                  <div>
                    <input
                      id="MobileNo"
                      name="MobileNo"
                      value={MobileNo}
                      onChange={(e) => setMobileNo(e.target.value)}
                      // maxLength={10}
                      ref={mobileRef}
                      s
                      onKeyDown={(e) => handleKeyDown(e, faxRef)}
                      className="college-control"
                      placeholder="Enter Tel No"
                    />
                  </div>
                </div>

                <div>
                  <label className="college-label">Email Id</label>
                  <div>
                    <input
                      id="EmailId"
                      name="EmailId"
                      value={EmailId}
                      onChange={(e) => setEmailId(e.target.value)}
                      maxLength={100}
                      ref={emailidRef}
                      onKeyDown={(e) => handleKeyDown(e, address1Ref)}
                      placeholder="Enter Email"
                      className="college-control"
                    />
                  </div>
                </div>
              </div>
            </form>

            <div className="clg-btn-container">
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
              <u>College</u>
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

      {/* </div> */}
    </>
  );
};

export default College;
