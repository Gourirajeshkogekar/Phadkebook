import React, { useState, useMemo, useEffect, useRef } from "react";
import "./Professor.css";
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
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Select from "react-select";
import { RiDeleteBin5Line } from "react-icons/ri";
import { CircularProgress } from "@mui/material";
import { Tooltip } from "@mui/material";

function Professors() {
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

    fetchProfessors();
  }, []);

  const [pageIndex, setPageIndex] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const [professors, setProfessors] = useState([]);
  const [ProfessorName, setProfessorName] = useState("");
  const [ProfessorCode, setProfessorCode] = useState("");
  const [Address1, setAddress1] = useState("");
  const [Address2, setAddress2] = useState("");
  const [Address3, setAddress3] = useState("");
  const [Address4, setAddress4] = useState("");
  const [FaxNo, setFaxNo] = useState("");
  const [EmailId, setEmailId] = useState("");
  const [Pincode, setPincode] = useState("");
  const [Category, setCategoryId] = useState("");
  const [CategoryOptions, setCategoryOptions] = useState([]);
  const [AreaId, setAreaId] = useState("");
  const [CityId, setCityId] = useState("");
  const [StateId, setStateId] = useState("");
  const [cityOptions, setCityOptions] = useState([]);
  const [stateOptions, setStateOptions] = useState([]);
  const [areaOptions, setareaOptions] = useState([]);
  const [colleges, setColleges] = useState([]);
  const [CollegeId, setCollegeId] = useState("");

  // const [CategoryId, setCategoryId] = useState("");
  const [MobileNo, setMobileNo] = useState("");
  const [PanNo, setPanNo] = useState("");
  const [editingIndex, setEditingIndex] = useState(-1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [id, setId] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [errors, setErrors] = useState("");

  const [deleteId, setDeleteId] = useState(null);
  const [loading, setLoading] = useState(true);

  // Confirmation Dialog state
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [deleteIndex, setDeleteIndex] = useState(null);

  const profnameRef = useRef(null);

  const profcodeRef = useRef(null);
  const address1Ref = useRef(null);
  const address2Ref = useRef(null);

  const address3Ref = useRef(null);
  const address4Ref = useRef(null);
  const faxRef = useRef(null);
  const emailRef = useRef(null);
  const pincodeRef = useRef(null);
  const collegeRef = useRef(null);
  const profcatRef = useRef(null);
  const areaRef = useRef(null);
  const stateRef = useRef(null);
  const cityRef = useRef(null);
  const mobileRef = useRef(null);
  const panRef = useRef(null);
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
    // fetchProfessors();
    fetchStates();
    fetchAllCities();
    fetchColleges();
    fetchCategories();
    fetchAreas();
  }, []);

  // const fetchProfessors = async () => {
  //   try {
  //     const response = await axios.get("https://publication.microtechsolutions.net.in/php/Professorget.php");
  //     console.log(response.data, 'professors');
  //     // setProfessors(response.data.slice(84114, 84214)); // Slice the first 100 records
  //     setProfessors(response.data);
  //     setLoading(false); // Set loading to false after data is fetched
  //   } catch (error) {
  //     // toast.error("Error fetching Professors:", error);
  //     setLoading(false); // Set loading to false in case of an error
  //   }
  // };

  useEffect(() => {
    fetchProfessors();
    console.log("this function is called");
  }, [pageIndex]); // Fetch data when page changes

  const fetchProfessors = async () => {
    try {
      const response = await axios.get(
        `https://publication.microtechsolutions.net.in/php/get/gettblpage.php?Table=Professor&PageNo=${pageIndex}`
      );
      // setSellschallans(response.data);
      console.log(response.data, "response of Professor");

      setProfessors(response.data.data);
      setTotalPages(response.data.total_pages);
    } catch (error) {
      // toast.error("Error fetching professors:", error);
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

  const fetchAllCities = async () => {
    try {
      const response = await axios.get(
        "https://publication.microtechsolutions.net.in/php/Cityget.php"
      );
      const cityOptions = response.data.map((city) => ({
        value: city.Id,
        label: city.CityName,
      }));
      setCityOptions(cityOptions);
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

  const fetchColleges = async () => {
    try {
      const response = await axios.get(
        "https://publication.microtechsolutions.net.in/php/Collegeget.php"
      );
      const colleges = response.data.map((college) => ({
        value: college.Id,
        label: college.CollegeName,
      }));
      setColleges(colleges);
    } catch (error) {
      // toast.error("Error fetching colleges:", error);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await axios.get(
        "https://publication.microtechsolutions.net.in/php/ProfessorCategoryget.php"
      );
      const CategoryOptions = response.data.map((cat) => ({
        value: cat.Id,
        label: cat.CategoryName,
      }));
      setCategoryOptions(CategoryOptions);
    } catch (error) {
      // toast.error("Error fetching Categories:", error);
    }
  };

  const resetForm = () => {
    setProfessorName("");
    setProfessorCode("");
    setAddress1("");
    setAddress2("");
    setAddress3("");
    setAddress4("");
    setEmailId("");
    setFaxNo("");
    setPincode("");
    setCategoryId("");
    setCollegeId("");
    setAreaId("");
    setCityId("");
    setStateId("");
    setCategoryId("");
  };

  const handleNewClick = () => {
    resetForm();
    // setIsEditing(false);
    setEditingIndex(-1);
    setIsModalOpen(true);
  };

  const handleEdit = (row) => {
    const professor = professors[row.index];
    console.log(professor, "professor edit");
    setProfessorName(professor.ProfessorName);
    setProfessorCode(professor.ProfessorCode);
    setAddress1(professor.Address1);
    setAddress2(professor.Address2);
    setAddress3(professor.Address3);
    setAddress4(professor.Address4);
    setFaxNo(professor.FaxNo);
    setEmailId(professor.EmailId);
    setPincode(professor.Pincode);
    setCollegeId(professor.CollegeId);
    setAreaId(professor.AreaId);
    setCityId(professor.CityId);
    setStateId(professor.StateId);
    setCategoryId(professor.Category);
    setMobileNo(professor.MobileNo);
    setEditingIndex(row.index);
    setIsEditing(true);
    setIsModalOpen(true);
    setId(professor.Id);
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
      "https://publication.microtechsolutions.net.in/php/Professordelete.php",
      requestOptions
    )
      .then((response) => response.text())
      .then((result) => console.log(result))
      .catch((error) => console.error(error));
    toast.success("Professor Deleted Successfully");
    setIsDeleteDialogOpen(false);
    fetchProfessors();
  };

  const cancelDelete = () => {
    setIsDeleteDialogOpen(false);
    setDeleteIndex(null);
  };

  const validateForm = () => {
    let formErrors = {};
    let isValid = true;

    if (!ProfessorName) {
      formErrors.ProfessorName = "Professor Name is required.";
      isValid = false;
    }
    if (!ProfessorCode) {
      formErrors.ProfessorCode = "Professor Code is required.";
      isValid = false;
    }
    // if (!Address1) {
    //     formErrors.Address1 = "Address1 is required.";
    //     isValid = false;
    // }
    // if (!Address2) {
    //   formErrors.Address2 = "Address2 is required.";
    //   isValid = false;
    // }
    //  if (!Address3) {
    //   formErrors.Address3 = "Address3 is required.";
    //   isValid = false;
    // }
    // if (!Address4) {
    //   formErrors.Address4 = "Address4 is required.";
    //   isValid = false;
    // }
    // if (!FaxNo) {
    //   formErrors.FaxNo = "Fax No is required.";
    //   isValid = false;
    // }
    if (!EmailId) {
      formErrors.EmailId = "EmailId is required.";
      isValid = false;
    }
    if (!Pincode) {
      formErrors.Pincode = "Pincode is required.";
      isValid = false;
    }
    if (!Category) {
      formErrors.Category = "Professor Category is required.";
      isValid = false;
    }
    if (!CollegeId) {
      formErrors.CollegeId = "College Name is required.";
      isValid = false;
    }
    // if (!AreaId) {
    //         formErrors.AreaId = "Area is required.";
    //         isValid = false;
    //     }
    // if (!StateId) {
    //         formErrors.StateId = "State is required.";
    //         isValid = false;
    //     }
    // if (!CityId) {
    //         formErrors.CityId = "City is required.";
    //         isValid = false;
    //     }
    if (!MobileNo) {
      formErrors.MobileNo = "Mobile No is required.";
      isValid = false;
    } else if (!/^\d{10}$/.test(MobileNo)) {
      formErrors.MobileNo = "Mobile No must be 10 digits.";
      isValid = false;
    }

    if (!PanNo) {
      formErrors.PanNo = "PAN No is required.";
      isValid = false;
    }
    setErrors(formErrors);
    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent the default form submission

    if (!validateForm()) return;
    const data = {
      ProfessorName: ProfessorName,
      ProfessorCode: ProfessorCode,
      Address1: Address1,
      Address2: Address2,
      Address3: Address3,
      Address4: Address4,
      FaxNo: 123456,
      PanNo: PanNo,
      EmailId: EmailId,
      Pincode: Pincode,
      CollegeId: CollegeId,
      Category: Category, // Convert to integer
      AreaId: AreaId,
      CityId: CityId,
      StateId: StateId,
      MobileNo: MobileNo,
      CreatedBy: userId,
    };
    // Determine the URL based on whether we're editing or adding
    const url = isEditing
      ? "https://publication.microtechsolutions.net.in/php/Professorupdate.php"
      : "https://publication.microtechsolutions.net.in/php/Professorpost.php";
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
        toast.success("Professor updated successfully!");
      } else {
        toast.success("Professor added successfully!");
      }
      setIsModalOpen(false);
      resetForm();
      fetchProfessors(); // Refresh the list after submit
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
        accessorKey: "ProfessorName",
        header: "Professor Name",
        size: 50,
      },

      {
        accessorKey: "ProfessorCode",
        header: "Professor Code",
        size: 50,
      },
      // {
      //   accessorKey:'CreatedBy',
      //   header:'Created By',
      //   size: 50
      // },
      // {
      //   accessorKey:'UpdatedBy',
      //   header:'Updated By',
      //   size: 50
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
    [professors]
  );

  const table = useMaterialReactTable({
    columns,
    enablePagination: false,

    data: professors,

    muiTableHeadCellProps: {
      style: {
        backgroundColor: "#E9ECEF",
        color: "black",
        fontSize: "16px",
      },
    },

    // state: {
    //   pagination: { pageIndex: page, pageSize },
    //   paginationTotalCount: totalRecords,
    // },
    // onPaginationChange: (pagination) => {
    //   setPage(pagination.pageIndex);
    //   setPageSize(pagination.pageSize);
    // },
  });

  return (
    <>
      <div className="professor-container">
        <h1>Professor Master</h1>

        {/* {loading ? (
                <div className="loadingprofessor-container">
                  <CircularProgress /> 
                  <p>Loading Professors... Please wait.</p> 
                </div>
              ) : (
      <div className="professortable-master">
        <div className="professortable1-master">
          <Button
            onClick={handleNewClick}
            style={{ color: "#FFFF", 
            fontWeight: "700", background:'#0a60bd', width:'15%' }}
>            New
          </Button>
          <div className="proftable-container">
            <MaterialReactTable table={table} />
          </div>
        </div>
        </div>
              )} */}

        <div className="professortable-master">
          <div className="professortable1-master">
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
            <div className="proftable-container">
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
                  const newPage = Number(e.target.value);
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
            className="professor-overlay"
            onClick={() => setIsModalOpen(false)}
          />
        )}

        <Modal open={isModalOpen}>
          <div className="professor-modal">
            <h2
              style={{
                textAlign: "center",
                fontWeight: "620",
                margin: "2px",
                fontSize: "27px",
              }}>
              {editingIndex >= 0 ? "Edit Professor" : "Add Professor"}
            </h2>
            <form className="professor-form">
              <div className="firstprof-row">
                <div>
                  <label className="professor-label">
                    Professor Name <b className="required">*</b>
                  </label>
                  <div>
                    <Tooltip
                      title={
                        <span style={{ fontSize: "14px", fontWeight: "bold" }}>
                          {ProfessorName}
                        </span>
                      }
                      arrow>
                      <input
                        id="ProfessorName"
                        name="ProfessorName"
                        value={ProfessorName}
                        onChange={(e) => setProfessorName(e.target.value)}
                        maxLength={100}
                        ref={profnameRef}
                        onKeyDown={(e) => handleKeyDown(e, profcodeRef)}
                        className="professor-control"
                        style={{ width: "300px" }}
                        placeholder="Enter Professor Name"
                      />
                    </Tooltip>

                    {/* <div>
                      {errors.ProfessorName && (
                        <b className="error-text">{errors.ProfessorName}</b>
                      )}
                    </div> */}
                  </div>
                </div>

                <div>
                  <label className="professor-label">
                    Professor Category <b className="required">*</b>
                  </label>
                  <div>
                    <Select
                      id="Category"
                      name="Category"
                      value={CategoryOptions.find(
                        (option) => option.value === Number(Category)
                      )}
                      onChange={(option) => setCategoryId(option.value)}
                      ref={profcatRef}
                      onKeyDown={(e) => handleKeyDown(e, areaRef)}
                      options={CategoryOptions}
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
                      placeholder="Select Category"
                    />
                    {/* <div>
                      {errors.CategoryId && (
                        <b className="error-text">{errors.CategoryId}</b>
                      )}
                    </div> */}
                  </div>
                </div>

                <div>
                  <label className="professor-label">
                    Professor Code <b className="required">*</b>
                  </label>
                  <div>
                    <input
                      id="ProfessorCode"
                      name="ProfessorCode"
                      value={ProfessorCode}
                      onChange={(e) => setProfessorCode(e.target.value)}
                      maxLength={50}
                      ref={profcodeRef}
                      onKeyDown={(e) => handleKeyDown(e, address1Ref)}
                      placeholder="Enter Professor Code"
                      className="professor-control"
                    />

                    {/* <div>
                      {errors.ProfessorCode && (
                        <b className="error-text">{errors.ProfessorCode}</b>
                      )}
                    </div> */}
                  </div>
                </div>
              </div>

              <div className="otherprof-rows">
                <div>
                  <label className="professor-label">
                    Address1 <b className="required">*</b>
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
                        placeholder="Enter Address1"
                        className="professor-control"
                      />
                    </Tooltip>

                    {/* <div>
                      {errors.Address1 && (
                        <b className="error-text">{errors.Address1}</b>
                      )}
                    </div> */}
                  </div>
                </div>
                <div>
                  <label className="professor-label">
                    Address2 <b className="required">*</b>
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
                        placeholder="Enter Address2"
                        className="professor-control"
                      />
                    </Tooltip>

                    {/* <div>
                      {errors.Address2 && (
                        <b className="error-text">{errors.Address2}</b>
                      )}
                    </div> */}
                  </div>
                </div>
                <div>
                  <label className="professor-label">
                    Address3 <b className="required">*</b>
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
                        onKeyDown={(e) => handleKeyDown(e, address4Ref)}
                        placeholder="Enter Address3"
                        className="professor-control"
                      />
                    </Tooltip>

                    {/* <div>
                      {errors.Address3 && (
                        <b className="error-text">{errors.Address3}</b>
                      )}
                    </div> */}
                  </div>
                </div>
                <div>
                  <label className="professor-label">
                    Address4 <b className="required">*</b>
                  </label>
                  <div>
                    <Tooltip
                      title={
                        <span style={{ fontSize: "14px", fontWeight: "bold" }}>
                          {Address4}
                        </span>
                      }
                      arrow>
                      <input
                        id="Address4"
                        name="Address4"
                        value={Address4}
                        onChange={(e) => setAddress4(e.target.value)}
                        maxLength={100}
                        ref={address4Ref}
                        onKeyDown={(e) => handleKeyDown(e, faxRef)}
                        placeholder="Enter Address4"
                        className="professor-control"
                      />
                    </Tooltip>
                    {/* <div>
                      {errors.Address4 && (
                        <b className="error-text">{errors.Address4}</b>
                      )}
                    </div> */}
                  </div>
                </div>
                <div style={{ display: "none" }}>
                  <label className="professor-label">
                    Fax No <b className="required">*</b>
                  </label>
                  <div>
                    <input
                      id="FaxNo"
                      name="FaxNo"
                      value={FaxNo}
                      onChange={(e) => setFaxNo(e.target.value)}
                      maxLength={100}
                      ref={faxRef}
                      onKeyDown={(e) => handleKeyDown(e, emailRef)}
                      placeholder="Enter Fax No"
                      className="professor-control"
                    />

                    {/* <div>
                      {errors.FaxNo && (
                        <b className="error-text">{errors.FaxNo}</b>
                      )}
                    </div> */}
                  </div>
                </div>
                <div>
                  <label className="professor-label">
                    Email Id <b className="required">*</b>
                  </label>
                  <div>
                    <input
                      id="EmailId"
                      name="EmailId"
                      value={EmailId}
                      onChange={(e) => setEmailId(e.target.value)}
                      maxLength={25}
                      ref={emailRef}
                      onKeyDown={(e) => handleKeyDown(e, pincodeRef)}
                      placeholder="Enter Email Id"
                      className="professor-control"
                    />

                    {/* <div>
                      {errors.EmailId && (
                        <b className="error-text">{errors.EmailId}</b>
                      )}
                    </div> */}
                  </div>
                </div>

                <div>
                  <label className="professor-label">
                    Mobile No <b className="required">*</b>
                  </label>
                  <div style={{ display: "flex", alignItems: "center" }}>
                    <span
                      style={{
                        padding: "5px",
                        backgroundColor: "#f0f0f0",
                        border: "1px solid #ccc",
                        borderRight: "none",
                        borderRadius: "4px 0 0 4px",
                      }}>
                      +91
                    </span>
                    <input
                      type="text"
                      id="MobileNo"
                      name="MobileNo"
                      value={MobileNo}
                      onChange={(e) =>
                        setMobileNo(e.target.value.replace(/\D/g, ""))
                      } // Only digits
                      maxLength={10}
                      ref={mobileRef}
                      onKeyDown={(e) => handleKeyDown(e, panRef)}
                      className="professor-control"
                      placeholder="Enter Mobile Number"
                      style={{
                        flex: 1,
                        borderRadius: "0 4px 4px 0",
                        borderLeft: "none",
                        width: "100px",
                      }}
                    />
                  </div>

                  {/* <div>
                    {errors.MobileNo && (
                      <b className="error-text">{errors.MobileNo}</b>
                    )}
                  </div> */}
                </div>

                <div>
                  <label className="professor-label">
                    College Name <b className="required">*</b>
                  </label>
                  <div>
                    <Select
                      id="CollegeId"
                      name="CollegeId"
                      value={colleges.find(
                        (option) => option.value === CollegeId
                      )}
                      onChange={(option) => setCollegeId(option.value)}
                      ref={collegeRef}
                      onKeyDown={(e) => handleKeyDown(e, profcatRef)}
                      options={colleges}
                      getOptionLabel={(e) => (
                        <div
                          data-tooltip-id={`tooltip-${e.value}`}
                          data-tooltip-content={e.label}>
                          {e.label}
                          <Tooltip id={`tooltip-${e.value}`} />
                        </div>
                      )}
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
                      placeholder="Select College "
                    />
                    {/* <div>
                      {errors.CollegeId && (
                        <b className="error-text">{errors.CollegeId}</b>
                      )}
                    </div> */}
                  </div>
                </div>

                <div>
                  <label className="professor-label">
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
                          width: "170px",
                          marginTop: "10px",
                          borderRadius: "4px",
                          border: "1px solid rgb(223, 222, 222)",
                          marginBottom: "5px",
                        }),
                      }}
                      placeholder="Select State"
                    />

                    {/* <div>
                      {errors.StateId && (
                        <b className="error-text">{errors.StateId}</b>
                      )}
                    </div> */}
                  </div>
                </div>

                <div>
                  <label className="professor-label">
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
                      ref={cityRef}
                      onKeyDown={(e) => handleKeyDown(e, mobileRef)}
                      options={cityOptions}
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
                      placeholder="Select City"
                    />

                    {/* <div>
                      {errors.CityId && (
                        <b className="error-text">{errors.CityId}</b>
                      )}
                    </div> */}
                  </div>
                </div>

                <div>
                  <label className="professor-label">
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
                          width: "170px",
                          marginTop: "10px",
                          borderRadius: "4px",
                          border: "1px solid rgb(223, 222, 222)",
                          marginBottom: "5px",
                        }),
                      }}
                      placeholder="Enter Area"
                    />

                    {/* <div>
                      {errors.AreaId && (
                        <b className="error-text">{errors.AreaId}</b>
                      )}
                    </div> */}
                  </div>
                </div>

                <div>
                  <label className="professor-label">
                    Pincode <b className="required">*</b>
                  </label>
                  <div>
                    <input
                      id="Pincode"
                      name="Pincode"
                      value={Pincode}
                      onChange={(e) => setPincode(e.target.value)}
                      maxLength={6}
                      ref={pincodeRef}
                      onKeyDown={(e) => handleKeyDown(e, collegeRef)}
                      placeholder="Enter Pincode"
                      className="professor-control"
                    />

                    {/* <div>
                      {errors.Pincode && (
                        <b className="error-text">{errors.Pincode}</b>
                      )}
                    </div> */}
                  </div>
                </div>

                <div>
                  <label className="professor-label">
                    PAN No <b className="required">*</b>
                  </label>
                  <div>
                    <input
                      type="text"
                      id="PanNo"
                      name="PanNo"
                      value={PanNo}
                      onChange={(e) => {
                        const value = e.target.value.toUpperCase();
                        const filtered = value.replace(/[^A-Z0-9]/g, "");
                        setPanNo(filtered);
                      }}
                      // maxLength={25}
                      maxLength={10}
                      ref={panRef}
                      onKeyDown={(e) => handleKeyDown(e, saveRef)}
                      className="professor-control"
                      placeholder="Enter Pan No"
                    />

                    {/* <div>
                      {errors.PanNo && (
                        <b className="error-text">{errors.PanNo}</b>
                      )}
                    </div> */}
                  </div>
                </div>
              </div>
            </form>

            <div className="prof-btn-container">
              <Button
                onClick={handleSubmit}
                ref={saveRef}
                //  onKeyDown={(e) => handleKeyDown(e, accgroupnameRef)}
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
              <u>Professor</u>
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
}

export default Professors;
