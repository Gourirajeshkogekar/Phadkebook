import React, { useState, useMemo, useEffect, useRef } from "react";
import "./Authors.css";
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
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { RiDeleteBin5Line } from "react-icons/ri";
import { TextField } from "@mui/material";
import { Autocomplete } from "@mui/material";
function Authors() {
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

    fetchAuthors();
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
 fetchAuthors();
  fetchStates();
    fetchAllCities();
    fetchAreas();
                } catch (e) {
                console.error("Error parsing company data", e);
              }
            }
          }, [pageIndex]); 


  

 
  

  const [AuthorCode, setAuthorCode] = useState("");
  const [authorName, setAuthorName] = useState("");
  const [authors, setAuthors] = useState([]);
  const [AreaId, setAreaId] = useState("");
  const [Address1, setAddress1] = useState("");
  const [Address2, setAddress2] = useState("");
  const [Address3, setAddress3] = useState("");
  const [Address4, setAddress4] = useState("");
  const [CityId, setCityId] = useState("");
  const [StateId, setStateId] = useState("");
  const [MobileNo, setMobileNo] = useState("");
  const [Pincode, setPincode] = useState("");
  const [FaxNo, setFaxno] = useState("");
  const [PanNo, setPanNo] = useState("");
  const [email, setEmail] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingIndex, setEditingIndex] = useState(-1);
  const [cityOptions, setCityOptions] = useState([]);
  const [stateOptions, setStateOptions] = useState([]);
  const [areaOptions, setareaOptions] = useState([]);
  const [errors, setErrors] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [id, setId] = useState(null); // New state for author ID
  const [deleteId, setDeleteId] = useState(null);

  // Confirmation Dialog state
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [deleteIndex, setDeleteIndex] = useState(null);

  const authorcodeRef = useRef(null);
  const authornameRef = useRef(null);
  const address1Ref = useRef(null);
  const address2Ref = useRef(null);
  const address3Ref = useRef(null);
  const address4Ref = useRef(null);
  const stateRef = useRef(null);
  const cityRef = useRef(null);
  const areaRef = useRef(null);
  const pincodeRef = useRef(null);
  const mobilenoRef = useRef(null);
  const pannoref = useRef(null);
  const emailRef = useRef(null);
  const saveRef = useRef(null);

  const handleKeyDown = (e, nextFieldRef) => {
    if (e.key === "Enter") {
      e.preventDefault();
      if (nextFieldRef && nextFieldRef.current) {
        nextFieldRef.current.focus();
      }
    }
  };



  

  

  const fetchAuthors = async () => {
    try {
      const response = await axios.get(
        `https://publication.microtechsolutions.net.in/php/get/gettblpage.php?Table=Author&PageNo=${pageIndex}`
      );
      // setSellschallans(response.data);
      console.log(response.data, "response of Author");

      setAuthors(response.data.data);
      setTotalPages(response.data.total_pages);
    } catch (error) {
      // toast.error("Error fetching authors:", error);
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

  const resetForm = () => {
    setAuthorCode("");
    setAuthorName("");
    setAddress1("");
    setAddress2("");
    setAddress3("");
    setAddress4("");
    setStateId("");
    setCityId("");
    setAreaId("");
    setMobileNo("");
    setPincode("");
    setPanNo("");
    setEmail("");
    setIsModalOpen(false);
    setId(null); // Reset the author ID
  };

  const handleNewClick = () => {
    resetForm();
    setIsModalOpen(true);
    setEditingIndex(-1);
    setIsEditing(false);
  };

  const handleEdit = (index) => {
    const author = authors[index];
    setAuthorName(author.AuthorName);
    setAuthorCode(author.AuthorCode);
    setAreaId(author.AreaId || "");
    setAddress1(author.Address1 || "");
    setAddress2(author.Address2 || "");

    setAddress3(author.Address3 || "");
    setAddress4(author.Address4 || "");

    setCityId(author.CityId || "");
    setStateId(author.StateId || "");
    setAreaId(author.AreaId || "");
    setMobileNo(author.MobileNo || "");
    setPincode(author.Pincode || "");
    setPanNo(author.PanNo || "");
    setEmail(author.EmailId);
    setEditingIndex(index);
    setIsModalOpen(true);
    setIsEditing(true);
    setId(author.Id); // Set the author ID
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
      "https://publication.microtechsolutions.net.in/php/Authordelete.php",
      requestOptions
    )
      .then((response) => response.text())
      .then((result) => console.log(result))
      .catch((error) => console.error(error));
    toast.success("Author Deleted Successfully");
    setIsDeleteDialogOpen(false);
    fetchAuthors();
  };

  const cancelDelete = () => {
    setIsDeleteDialogOpen(false);
    setDeleteIndex(null);
  };

  const validateForm = () => {
    let formErrors = {};
    let isValid = true;

    if (!AuthorCode) {
      formErrors.AuthorCode = "Author Code is required.";
      isValid = false;
    }

    if (!authorName) {
      formErrors.authorName = "Author Name is required.";
      isValid = false;
    }

    if (!Address1) {
      formErrors.Address1 = "Address1 is required.";
      isValid = false;
    }

    if (!Address2) {
      formErrors.Address2 = "Address2 is required.";
      isValid = false;
    }
    if (!Address3) {
      formErrors.Address3 = "Address3 is required.";
      isValid = false;
    }

    // City
    if (!CityId) {
      formErrors.CityId = "City is required.";
      isValid = false;
    }

    // City
    if (!PanNo) {
      formErrors.PanNo = "Pan No is required.";
      isValid = false;
    }

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

    // Email ID
    if (!email) {
      formErrors.email = "Email Id is required.";
      isValid = false;
    } else if (/[A-Z]/.test(email)) {
      formErrors.email = "Email must not contain uppercase letters.";
      isValid = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      formErrors.email = "Email Id is invalid.";
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
      AuthorCode: AuthorCode,
      AuthorName: authorName,
      Address1: Address1,
      Address2: Address2,
      Address3: Address3,
      Address4: Address4,
      CityId: CityId,
      StateId: StateId,
      AreaId: AreaId,
      Pincode: Pincode,
      FaxNo: 123456,
      MobileNo: MobileNo,
      PanNo: PanNo,
      EmailId: email,
      CreatedBy: userId,
   CompanyId: activeCompany.Id
    };

    // Determine the URL based on whether we're editing or adding
    const url = isEditing
      ? "https://publication.microtechsolutions.net.in/php/Authorupdate.php"
      : "https://publication.microtechsolutions.net.in/php/Authorpost.php";

    // If editing, include the author ID in the payload
    if (isEditing) {
      data.Id = id;
      data.UpdatedBy = userId;
      data.CompanyId = activeCompany.Id;
    }

    try {
      await axios.post(url, data, {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      });

      if (isEditing) {
        toast.success("Author updated successfully!");
      } else {
        toast.success("Author added successfully!");
      }
      setIsModalOpen(false);
      resetForm();
      fetchAuthors(); // Refresh the list after submit
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
        accessorKey: "AuthorCode",
        header: "Author Code",
        size: 50,
      },
      {
        accessorKey: "AuthorName",
        header: "Author Name",
        size: 50,
      },
      {
        accessorKey: "Address1",
        header: "Address",
        size: 50,
      },

      {
        accessorKey: "actions",
        header: "Actions",
        size: 150,
        Cell: ({ row }) => (
          <div>
            <Button
              onClick={() => handleEdit(row.index)}
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
    [authors]
  );

  const table = useMaterialReactTable({
    columns,
    data: authors,
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
      <div className="author-container">
        <h1>Author Master</h1>
        <div className="authortable-master">
          <div className="authortable1-master">
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
            <div className="authortable-container">
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
            className="author-overlay"
            onClick={() => setIsModalOpen(false)}
          />
        )}

        <Modal open={isModalOpen}>
          <div className="author-modal">
            <h2
              style={{
                textAlign: "center",
                fontWeight: "620",
                margin: "2px",
                fontSize: "27px",
              }}>
              {editingIndex >= 0 ? "Edit Author" : "Add Author"}
            </h2>
            <form onSubmit={handleSubmit} className="author-form">
              <div>
                <label className="author-label">Author Name</label>
                <div>
                  <input
                    type="text"
                    id="authorName"
                    name="authorName"
                    value={authorName}
                    onChange={(e) => setAuthorName(e.target.value)}
                    maxLength={100}
                    ref={authornameRef}
                    onKeyDown={(e) => handleKeyDown(e, address1Ref)}
                    style={{ width: "400px" }}
                    className="author-control"
                    placeholder="Enter Author Name"
                  />
                  <div>
                    {errors.authorName && (
                      <b className="error-text">{errors.authorName}</b>
                    )}
                  </div>
                </div>
              </div>
              <div className="address-box">
                <label className="author-label">Address</label>
                <div>
                  <input
                    className="author-control"
                    value={Address1}
                    onChange={(e) => setAddress1(e.target.value)}
                    style={{ width: "350px" }}
                    placeholder="Enter Address 1"
                  />
                  <input
                    className="author-control"
                    value={Address2}
                    onChange={(e) => setAddress2(e.target.value)}
                    style={{ width: "350px" }}
                    placeholder="Enter Address 2"
                  />
                  <input
                    className="author-control"
                    value={Address3}
                    onChange={(e) => setAddress3(e.target.value)}
                    style={{ width: "350px" }}
                    placeholder="Enter Address 3"
                  />
                </div>
              </div>

              <div>
                <label className="author-label">City</label>
                <div>
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
                  <div>
                    {errors.CityId && (
                      <b className="error-text">{errors.CityId}</b>
                    )}
                  </div>
                </div>
              </div>
              <div>
                <label className="author-label">Area</label>
                <div>
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

                  <div>
                    {errors.AreaId && (
                      <b className="error-text">{errors.AreaId}</b>
                    )}
                  </div>
                </div>
              </div>
              <div>
                <label className="author-label">Pincode</label>
                <div>
                  <input
                    type="text"
                    id="Pincode"
                    name="Pincode"
                    value={Pincode}
                    onChange={(e) => setPincode(e.target.value)}
                    maxLength={6}
                    style={{ width: "150px" }}
                    className="author-control"
                    ref={pincodeRef}
                    onKeyDown={(e) => handleKeyDown(e, mobilenoRef)}
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
                <label className="author-label">Mobile Number</label>
                <div>
                  <input
                    type="text"
                    id="MobileNo"
                    name="MobileNo"
                    value={MobileNo}
                    onChange={(e) => setMobileNo(e.target.value)}
                    maxLength={10}
                    ref={mobilenoRef}
                    onKeyDown={(e) => handleKeyDown(e, pannoref)}
                    className="author-control"
                    placeholder="Enter Mobile Number"
                  />

                  <div>
                    {errors.MobileNo && (
                      <b className="error-text">{errors.MobileNo}</b>
                    )}
                  </div>
                </div>
              </div>

              <div>
                <label className="author-label">Email</label>
                <div>
                  <input
                    type="text"
                    id="email"
                    name="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    maxLength={100}
                    ref={emailRef}
                    onKeyDown={(e) => handleKeyDown(e, saveRef)}
                    className="author-control"
                    placeholder="Enter Email"
                  />

                  <div>
                    {errors.email && (
                      <b className="error-text">{errors.email}</b>
                    )}
                  </div>
                </div>
              </div>
            </form>
            <div className="author-btn-container">
              <Button
                type="submit"
                onClick={handleSubmit}
                ref={saveRef}
                // onKeyDown={(e) => handleKeyDown(e, groupIdRef)}
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
              <u>Author</u>
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
    </>
  );
}

export default Authors;
