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
import "./college.css";
import Select from "react-select";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { RiDeleteBin5Line } from "react-icons/ri";
import { CiEdit } from "react-icons/ci";
import { CircularProgress } from "@mui/material"; // Import CircularProgress for spinner
import { Tooltip } from "@mui/material";

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

  const [CollegeName, setCollegeName] = useState("");
  const [CollegeCode, setCollegeCode] = useState("");
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

  useEffect(() => {
    fetchAllCities();
    fetchStates();
    fetchAreas();
    fetchCollegegroups();
  }, []);

  // const fetchColleges = async () => {
  //   setLoading(true); // Set loading to true when fetching data
  //   try {
  //     const response = await axios.get("https://publication.microtechsolutions.net.in/php/Collegeget.php");
  //     setColleges(response.data);
  //   } catch (error) {
  //     // toast.error("Error fetching colleges:", error);
  //   } finally {
  //     setLoading(false); // Set loading to false after data is fetched
  //   }
  // };

  useEffect(() => {
    fetchColleges();
    console.log("this function is called");
  }, [pageIndex]); // Fetch data when page changes

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
        "https://publication.microtechsolutions.net.in/php/State.php"
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
        "https://publication.microtechsolutions.net.in/php/Collegegroupmasterget.php"
      );
      const collegegroupOptions = response.data.map((clggrp) => ({
        value: clggrp.Id,
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
        "https://publication.microtechsolutions.net.in/php/Cityget.php"
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
        "https://publication.microtechsolutions.net.in/php/Areaget.php"
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

    const requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: urlencoded,
      redirect: "follow",
    };

    fetch(
      "https://publication.microtechsolutions.net.in/php/Collegedelete.php",
      requestOptions
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
    if (!MobileNo) {
      formErrors.MobileNo = "Mobile No is required.";
      isValid = false;
    } else if (!/^\d{10}$/.test(MobileNo)) {
      formErrors.MobileNo = "Mobile No must be 10 digits.";
      isValid = false;
    }

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
    };

    // Determine the URL based on whether we're editing or adding
    const url = isEditing
      ? "https://publication.microtechsolutions.net.in/php/Collegeupdate.php"
      : "https://publication.microtechsolutions.net.in/php/Collegepost.php";

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
    [colleges]
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

        {/* {loading ? (
    <div className="loadingcollege-container">
      <CircularProgress /> 
      <p>Loading Colleges... Please wait.</p>
    </div>
  ) : (
    <div className="collegetable-container">
      <div className="collegetable1-container">
        <Button
          onClick={handleNewClick}
          style={{ color: "#FFFF", fontWeight: "700", background:'#0a60bd', width:'15%' }}
        >
          New
        </Button>
        <div className="colltable-container">
          <MaterialReactTable table={table} />

        </div>

        
      </div>
    </div>
  )} */}

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
              <div className="firstcol-row">
                <div>
                  <label className="college-label">
                    College Code <b className="required">*</b>
                  </label>
                  <div>
                    <input
                      type="text"
                      id="CollegeCode"
                      name="CollegeCode"
                      value={CollegeCode}
                      onChange={(e) => setCollegeCode(e.target.value)}
                      maxLength={10}
                      ref={collegecodeRef}
                      onKeyDown={(e) => handleKeyDown(e, collgroupIdRef)}
                      style={{ background: "	#D0D0D0", width: "100px" }}
                      className="college-control"
                      placeholder="Auto-Incremented"
                      readOnly
                    />
                    <div>
                      {errors.CollegeCode && (
                        <b className="error-text">{errors.CollegeCode}</b>
                      )}
                    </div>
                  </div>
                </div>

                <div>
                  <label className="college-label">
                    College Name <b className="required">*</b>
                  </label>
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
                    <div className="error-text">
                      {errors.CollegeName && (
                        <b className="error-text">{errors.CollegeName}</b>
                      )}
                    </div>
                  </div>
                </div>

                <div>
                  <label className="college-label">
                    College Group Code <b className="required">*</b>
                  </label>
                  <div>
                    <Select
                      id="CollegeGroupId"
                      name="CollegeGroupId"
                      value={collegegroupOptions.find(
                        (option) => option.value === CollegeGroupId
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
                      placeholder="Select College Group"
                    />
                    <div>
                      {errors.CollegeGroupId && (
                        <b className="error-text">{errors.CollegeGroupId}</b>
                      )}
                    </div>
                  </div>
                </div>
              </div>
              <br />

              <div className="othercol-rows">
                <div>
                  <label className="college-label">
                    Email Id <b className="required">*</b>
                  </label>
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
                    <div>
                      {errors.EmailId && (
                        <b className="error-text">{errors.EmailId}</b>
                      )}
                    </div>
                  </div>
                </div>

                <div>
                  <label className="college-label">
                    Address 1 <b className="required">*</b>
                  </label>
                  <div>
                    <Tooltip
                      title={
                        <span style={{ fontSize: "14px", fontWeight: "bold" }}>
                          {Address1}
                        </span>
                      }
                      arrow>
                      <input
                        id="Address1"
                        name="Address1"
                        value={Address1}
                        onChange={(e) => setAddress1(e.target.value)}
                        maxLength={100}
                        ref={address1Ref}
                        onKeyDown={(e) => handleKeyDown(e, address2Ref)}
                        placeholder="Enter Address"
                        className="college-control"
                      />
                    </Tooltip>

                    <div>
                      {errors.Address1 && (
                        <b className="error-text">{errors.Address1}</b>
                      )}
                    </div>
                  </div>
                </div>

                <div>
                  <label className="college-label">
                    Address 2 <b className="required">*</b>
                  </label>
                  <div>
                    <Tooltip
                      title={
                        <span style={{ fontSize: "14px", fontWeight: "bold" }}>
                          {Address2}
                        </span>
                      }
                      arrow>
                      <input
                        id="Address2"
                        name="Address2"
                        value={Address2}
                        onChange={(e) => setAddress2(e.target.value)}
                        maxLength={100}
                        ref={address2Ref}
                        onKeyDown={(e) => handleKeyDown(e, address3Ref)}
                        placeholder="Enter Address"
                        className="college-control"
                      />
                    </Tooltip>

                    <div>
                      {errors.Address2 && (
                        <b className="error-text">{errors.Address2}</b>
                      )}
                    </div>
                  </div>
                </div>

                <div>
                  <label className="college-label">
                    Address 3 <b className="required">*</b>
                  </label>
                  <div>
                    <Tooltip
                      title={
                        <span style={{ fontSize: "14px", fontWeight: "bold" }}>
                          {Address3}
                        </span>
                      }
                      arrow>
                      <input
                        id="Address3"
                        name="Address3"
                        value={Address3}
                        onChange={(e) => setAddress3(e.target.value)}
                        maxLength={100}
                        ref={address3Ref}
                        onKeyDown={(e) => handleKeyDown(e, areaRef)}
                        placeholder="Enter Address"
                        className="college-control"
                      />
                    </Tooltip>

                    <div>
                      {errors.Address3 && (
                        <b className="error-text">{errors.Address3}</b>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              <div className="othercol-rows">
                <div>
                  <label className="college-label">
                    State <b className="required">*</b>
                  </label>
                  <div>
                    <Select
                      id="StateId"
                      name="StateId"
                      value={stateOptions.find(
                        (option) => option.value === StateId
                      )}
                      onChange={(option) => setStateId(option.value)}
                      ref={stateRef}
                      onKeyDown={(e) => handleKeyDown(e, cityRef)}
                      options={stateOptions}
                      styles={{
                        control: (base) => ({
                          ...base,
                          width: "200px",
                          marginTop: "10px",
                          borderRadius: "4px",
                          border: "1px solid rgb(223, 222, 222)",
                          marginBottom: "5px",
                        }),
                      }}
                      placeholder="Select State"
                    />

                    <div>
                      {errors.StateId && (
                        <b className="error-text">{errors.StateId}</b>
                      )}
                    </div>
                  </div>
                </div>

                <div>
                  <label className="college-label">
                    City <b className="required">*</b>
                  </label>
                  <div>
                    <Select
                      id="CityId"
                      name="CityId"
                      value={cityOptions.find(
                        (option) => option.value === CityId
                      )}
                      onChange={(option) => setCityId(option.value)}
                      options={cityOptions}
                      styles={{
                        control: (base) => ({
                          ...base,
                          width: "200px",
                          marginTop: "10px",
                          borderRadius: "4px",
                          border: "1px solid rgb(223, 222, 222)",
                          marginBottom: "5px",
                        }),
                      }}
                      placeholder="Select City"
                    />
                    <div>
                      {errors.CityId && (
                        <b className="error-text">{errors.CityId}</b>
                      )}
                    </div>
                  </div>
                </div>

                <div>
                  <label className="college-label">
                    Area <b className="required">*</b>
                  </label>
                  <div>
                    <Select
                      id="AreaId"
                      name="AreaId"
                      value={areaOptions.find(
                        (option) => option.value === AreaId
                      )}
                      onChange={(option) => setAreaId(option.value)}
                      ref={areaRef}
                      onKeyDown={(e) => handleKeyDown(e, stateRef)}
                      options={areaOptions}
                      styles={{
                        control: (base) => ({
                          ...base,
                          width: "280px",
                          marginTop: "10px",
                          borderRadius: "4px",
                          border: "1px solid rgb(223, 222, 222)",
                          marginBottom: "5px",
                        }),
                      }}
                      placeholder="Select Area"
                    />
                    <div>
                      {errors.AreaId && (
                        <b className="error-text">{errors.AreaId}</b>
                      )}
                    </div>
                  </div>
                </div>

                <div>
                  <label className="college-label">
                    Pincode <b className="required">*</b>
                  </label>
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

                    <div>
                      {errors.Pincode && (
                        <b className="error-text">{errors.Pincode}</b>
                      )}
                    </div>
                  </div>
                </div>
                <div>
                  <label className="college-label">
                    Mobile No <b className="required">*</b>
                  </label>
                  <div>
                    <input
                      id="MobileNo"
                      name="MobileNo"
                      value={MobileNo}
                      onChange={(e) => setMobileNo(e.target.value)}
                      maxLength={10}
                      ref={mobileRef}
                      onKeyDown={(e) => handleKeyDown(e, faxRef)}
                      className="college-control"
                      placeholder="Enter Tel No"
                    />

                    <div>
                      {errors.MobileNo && (
                        <b className="error-text">{errors.MobileNo}</b>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              <div style={{ display: "none" }}>
                <label className="college-label">
                  Fax No <b className="required">*</b>
                </label>
                <div>
                  <input
                    id="FaxNo"
                    name="FaxNo"
                    value={FaxNo}
                    onChange={(e) => setFaxNo(e.target.value)}
                    maxLength={25}
                    ref={faxRef}
                    onKeyDown={(e) => handleKeyDown(e, saveRef)}
                    className="college-control"
                    placeholder="Enter Fax No"
                  />

                  {/* <div>
                    {errors.FaxNo && (
                      <b className="error-text">{errors.FaxNo}</b>
                    )}
                  </div> */}
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
