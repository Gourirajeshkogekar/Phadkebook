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
  Autocomplete,
} from "@mui/material";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Select from "react-select";
import { RiDeleteBin5Line } from "react-icons/ri";
import { TextField } from "@mui/material";
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
  const [Category, setCategory] = useState("");
  const [CategoryOptions, setCategoryOptions] = useState([]);
  const [AreaId, setAreaId] = useState("");
  const [CityId, setCityId] = useState("");
  const [StateId, setStateId] = useState("");
  const [cityOptions, setCityOptions] = useState([]);
  const [stateOptions, setStateOptions] = useState([]);
  const [areaOptions, setareaOptions] = useState([]);
  const [colleges, setColleges] = useState([]);
  const [CollegeId, setCollegeId] = useState("");

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
    fetchAreas();
  }, []);

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
    setCategory("");
    setCollegeId("");
    setAreaId("");
    setCityId("");
    setStateId("");
    setCategory("");
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
    setCategory(professor.Category);
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

  const basicSelectStyle = {
    control: (base) => ({
      ...base,
      width: "500px",
      marginTop: "10px",
      borderRadius: "4px",
      border: "1px solid rgb(223, 222, 222)",
      marginBottom: "5px",
      minHeight: "38px",
    }),
  };

  const smallSelectStyle = {
    control: (base) => ({
      ...base,
      width: "170px",
      marginTop: "10px",
      borderRadius: "4px",
      border: "1px solid rgb(223, 222, 222)",
      marginBottom: "5px",
      minHeight: "38px",
    }),
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent the default form submission

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
  });

  return (
    <>
      <div className="professor-container">
        <h1>Professor Master</h1>

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
              <div>
                <label className="professor-label">College Name</label>

                <Tooltip
                  title={
                    <span style={{ fontSize: "14px", fontWeight: "bold" }}>
                      {colleges.find((c) => c.value === CollegeId)?.label || ""}
                    </span>
                  }
                  arrow>
                  <div>
                    <Autocomplete
                      options={colleges}
                      value={
                        colleges.find((option) => option.value === CollegeId) ||
                        null
                      }
                      onChange={(event, newValue) =>
                        setCollegeId(newValue ? newValue.value : null)
                      }
                      getOptionLabel={(option) => option.label} // Display only label in dropdown
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          placeholder="Select College id"
                          size="small"
                          margin="none"
                          fullWidth
                        />
                      )}
                      sx={{ mt: 1.25, mb: 0.625, width: 600 }} // Equivalent to 10px and 5px
                    />
                  </div>
                </Tooltip>
              </div>

              <div>
                <div>
                  <label className="professor-label">Professor Name</label>
                  <div>
                    <input
                      id="ProfessorName"
                      name="ProfessorName"
                      value={ProfessorName}
                      onChange={(e) => setProfessorName(e.target.value)}
                      maxLength={100}
                      ref={profnameRef}
                      onKeyDown={(e) => handleKeyDown(e, profcodeRef)}
                      className="professor-control"
                      style={{ width: "500px" }}
                      placeholder="Enter Professor Name"
                    />
                  </div>
                </div>

                <div>
                  <label className="professor-label">Professor Category</label>

                  <div className="prof-category-box">
                    <label>
                      <input
                        type="radio"
                        name="Category"
                        value="Staff"
                        checked={Category === "Staff"}
                        onChange={(e) => setCategory(e.target.value)}
                        ref={profcatRef}
                      />{" "}
                      Staff
                    </label>
                    <label>
                      <input
                        type="radio"
                        name="Category"
                        value="Professor"
                        checked={Category === "Professor"}
                        onChange={(e) => setCategory(e.target.value)}
                      />{" "}
                      Professor
                    </label>
                    <label>
                      <input
                        type="radio"
                        name="Category"
                        value="Other"
                        checked={Category === "Other"}
                        onChange={(e) => setCategory(e.target.value)}
                      />{" "}
                      Other
                    </label>
                  </div>
                </div>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <div>
                  <label className="professor-label">City</label>
                  <Autocomplete
                    options={cityOptions}
                    value={
                      cityOptions.find((option) => option.value === CityId) ||
                      null
                    }
                    onChange={(event, newValue) =>
                      setCityId(newValue ? newValue.value : null)
                    }
                    getOptionLabel={(option) => option.label} // Display only label in dropdown
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        placeholder="Select City id"
                        size="small"
                        margin="none"
                        fullWidth
                      />
                    )}
                    sx={{ mt: 1.25, mb: 0.625, width: 300 }} // Equivalent to 10px and 5px
                  />
                </div>

                <div>
                  <label className="professor-label">Area</label>
                  <Autocomplete
                    options={areaOptions}
                    value={
                      areaOptions.find((option) => option.value === AreaId) ||
                      null
                    }
                    onChange={(event, newValue) =>
                      setAreaId(newValue ? newValue.value : null)
                    }
                    getOptionLabel={(option) => option.label} // Display only label in dropdown
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        placeholder="Select Area id"
                        size="small"
                        margin="none"
                        fullWidth
                      />
                    )}
                    sx={{ mt: 1.25, mb: 0.625, width: 300 }} // Equivalent to 10px and 5px
                  />
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
