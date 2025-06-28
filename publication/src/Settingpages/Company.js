import React, { useState, useMemo, useEffect } from "react";
import "./Company.css";
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
import axios from "axios";
import {
  MaterialReactTable,
  useMaterialReactTable,
} from "material-react-table";
import { RiDeleteBin5Line } from "react-icons/ri";

function Company() {
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

    fetchCompanies();
  }, []);

  const [CompanyName, setCompanyName] = useState("");
  const [Director, setDirector] = useState("");
  const [Designation, setDesignation] = useState("");
  const [Address1, setAddress1] = useState("");
  const [AreaId, setAreaId] = useState("");
  const [CityId, setCityId] = useState("");
  const [StateId, setStateId] = useState("");
  const [CountryId, setCountryId] = useState("");
  const [cityOptions, setCityOptions] = useState([]);
  const [stateOptions, setStateOptions] = useState([]);
  const [countryOptions, setCountryOptions] = useState([]);
  const [Pincode, setPincode] = useState("");
  const [Website, setWebsite] = useState("");
  const [FaxNo, setFaxNo] = useState("");
  const [MobileNo, setMobileNo] = useState("");
  const [EmailId, setEmailId] = useState("");
  const [companies, setCompanies] = useState([]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [id, setId] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [editingIndex, setEditingIndex] = useState(-1);
  const [errors, setErrors] = useState("");

  const [tinpanno, setTinpanno] = useState("");
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [deleteIndex, setDeleteIndex] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const resetForm = () => {
    setCompanyName("");
    setDirector("");
    setDesignation("");
    setAddress1("");
    setCityId("");
    setPincode("");
    setStateId("");
    setCountryId("");
    setMobileNo("");
    setEmailId("");
    setFaxNo("");
    setWebsite("");
    setTinpanno("");
  };

  useEffect(() => {
    fetchStates();
    fetchAllCities();
    fetchCountries();
    fetchCompanies();
  }, []);

  const fetchCompanies = async () => {
    try {
      const response = await axios.get(
        "https://publication.microtechsolutions.net.in/php/CompanyMasterget.php"
      );
      setCompanies(response.data);
    } catch (error) {
      console.error("Error fetching companies:", error);
    }
  };

  const fetchCountries = async () => {
    try {
      const response = await axios.get(
        "https://publication.microtechsolutions.net.in/php/Countryget.php"
      );
      const countryOptions = response.data.map((country) => ({
        value: country.Id,
        label: country.CountryName,
      }));
      setCountryOptions(countryOptions);
    } catch (error) {
      toast.error("Error fetching countries:", error);
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
      toast.error("Error fetching states:", error);
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
      toast.error("Error fetching cities:", error);
    }
  };

  const handleNewClick = () => {
    resetForm();
    setIsModalOpen(true);
    setIsEditing(false);
    setEditingIndex(-1);
  };

  const handleEdit = (row) => {
    const comp = companies[row.index];

    setCompanyName(comp.CompanyName);
    setDirector(comp.Director);
    setDesignation(comp.Designation);
    setAddress1(comp.Address1);
    setCityId(comp.CityId);
    setStateId(comp.StateId);
    setCountryId(comp.CountryId);
    setMobileNo(comp.MobileNo);
    setPincode(comp.Pincode);
    setFaxNo(comp.FaxNo);
    setEmailId(comp.EmailId);
    setWebsite(comp.Website);
    setTinpanno(comp.tinpanno);
    setEditingIndex(row.index);
    setIsModalOpen(true);
    setIsEditing(true);
    setId(comp.Id);
  };

  // const handleDelete = (index) => {
  //   setCompanies((prevCompanies) =>
  //     prevCompanies.filter((_, i) => i !== index)
  //   );
  //   toast.success("Company Deleted Successfully!");
  // };

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
      "https://publication.microtechsolutions.net.in/php/Companymasterdelete.php",
      requestOptions
    )
      .then((response) => response.text())
      .then((result) => console.log(result))
      .catch((error) => console.error(error));
    toast.success("Company Deleted Successfully");
    setIsDeleteDialogOpen(false);
    // setDeleteIndex(deleteIndex)
    fetchCompanies();
  };

  const cancelDelete = () => {
    setIsDeleteDialogOpen(false);
    setDeleteIndex(null);
  };

  const validateForm = () => {
    let formErrors = {};
    let isValid = true;

    if (!CompanyName) {
      formErrors.CompanyName = "Company Name is required.";
      isValid = false;
    }

    if (!Director) {
      formErrors.Director = "Director is required.";
      isValid = false;
    }

    if (!Designation) {
      formErrors.Designation = "Designation is required.";
      isValid = false;
    }

    if (!Address1) {
      formErrors.Address1 = "Address is required.";
      isValid = false;
    }

    if (!CityId) {
      formErrors.CityId = "City is required.";
      isValid = false;
    }

    if (!StateId) {
      formErrors.StateId = "State is required.";
      isValid = false;
    }
    if (!Pincode) {
      formErrors.Pincode = "Pincode is required.";
      isValid = false;
    } else if (!/^\d{6}$/.test(Pincode)) {
      formErrors.Pincode = "Pincode must be 6 digits.";
      isValid = false;
    }

    if (!CountryId) {
      formErrors.CountryId = "Country is required.";
      isValid = false;
    }

    if (!MobileNo) {
      formErrors.MobileNo = "Mobile No is required.";
      isValid = false;
    } else if (!/^\d{10}$/.test(MobileNo)) {
      formErrors.MobileNo = "MobileNo must be 10 digits.";
      isValid = false;
    }

    // Fax No
    if (!FaxNo) {
      formErrors.FaxNo = "FaxNo  is required.";
      isValid = false;
    } else if (!/^\d{10}$/.test(FaxNo)) {
      formErrors.FaxNo = "Fax No must be 10 digits.";
      isValid = false;
    }

    // Email ID
    if (!EmailId) {
      formErrors.EmailId = "Email Id is required.";
      isValid = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(EmailId)) {
      formErrors.EmailId = "Email Id is invalid.";
      isValid = false;
    }

    if (!Website) {
      formErrors.Website = "Website is required.";
      isValid = false;
    }

    if (!Address1) {
      formErrors.Address1 = "Address1 is required.";
      isValid = false;
    }

    setErrors(formErrors);
    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent the default form submission
    if (!validateForm()) return;

    const data = {
      CompanyName: CompanyName,
      Director: Director,
      Designation: Designation,
      Address1: Address1,
      CountryId: CountryId,
      StateId: StateId,
      CityId: CityId,
      Pincode: Pincode,
      MobileNo: MobileNo,
      FaxNo: FaxNo,
      EmailId: EmailId,
      Website: Website,
      CreatedBy: userId,
      UpdatedBy: userId,
    };

    // Determine the URL based on whether we're editing or adding
    const url = isEditing
      ? "https://publication.microtechsolutions.net.in/php/CompanyMasterupdate.php"
      : "https://publication.microtechsolutions.net.in/php/CompanyMasterpost.php";

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
        toast.success("Company updated successfully!");
      } else {
        toast.success("Company added successfully!");
      }
      setIsModalOpen(false);
      resetForm();
      fetchCompanies(); // Refresh the list after submit
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
        accessorKey: "CompanyName",
        header: "Company Name",
        size: 50,
      },
      {
        accessorKey: "Director",
        header: "Director",
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
    [companies]
  );

  const table = useMaterialReactTable({
    columns,
    data: companies,

    muiTableHeadCellProps: {
      style: {
        backgroundColor: "#E9ECEF", // Replace with your desired color
        color: "black",
        fontSize: "16px",
      },
    },
  });

  return (
    <div className="company-container">
      <h1>Company Master</h1>

      <div className="companytable-master">
        <div className="companytable1-master">
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
          <div className="companytable-container">
            <MaterialReactTable table={table} />
          </div>
        </div>

        {isModalOpen && (
          <div
            className="company-overlay"
            onClick={() => setIsModalOpen(false)}
          />
        )}

        <Modal open={isModalOpen}>
          <div className="company-modal">
            <h1
              style={{
                textAlign: "center",
                fontWeight: "500",
                margin: "2px",
              }}>
              {editingIndex >= 0 ? "Edit Company" : "Add Company"}
            </h1>
            <form onSubmit={handleSubmit} className="company-form">
              <div>
                <label className="company-label">Name of Company:</label>
                <div>
                  <input
                    type="text"
                    id="CompanyName"
                    name="CompanyName"
                    value={CompanyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    maxLength={50}
                    className="company-control"
                    placeholder="Enter Company Name"
                  />

                  <div>
                    {errors.CompanyName && (
                      <b className="error-text">{errors.CompanyName}</b>
                    )}
                  </div>
                </div>
              </div>

              <div>
                <label className="company-label">Name of Director:</label>
                <div>
                  <input
                    type="text"
                    id="Director"
                    name="Director"
                    value={Director}
                    onChange={(e) => setDirector(e.target.value)}
                    className="company-control"
                    placeholder="Enter Director Name "
                  />
                  <div>
                    {errors.Director && (
                      <b className="error-text">{errors.Director}</b>
                    )}
                  </div>
                </div>
              </div>
              <div>
                <label className="company-label">Designation:</label>
                <div>
                  <input
                    type="text"
                    id="Designation"
                    name="Designation"
                    value={Designation}
                    onChange={(e) => setDesignation(e.target.value)}
                    className="company-control"
                    placeholder="Enter Designation"
                  />

                  <div>
                    {errors.Designation && (
                      <b className="error-text">{errors.Designation}</b>
                    )}
                  </div>
                </div>
              </div>

              <div>
                <label className="company-label">Office Address:</label>
                <div>
                  <input
                    type="text"
                    id="Address1"
                    name="Address1"
                    value={Address1}
                    onChange={(e) => setAddress1(e.target.value)}
                    maxLength={100}
                    className="company-control"
                    placeholder="Enter office address"
                  />
                </div>

                <div>
                  {errors.Address1 && (
                    <b className="error-text">{errors.Address1}</b>
                  )}
                </div>
              </div>

              <div>
                <label className="company-label">Country:</label>
                <div>
                  <Select
                    id="CountryId"
                    name="CountryId"
                    value={countryOptions.find(
                      (option) => option.value === CountryId
                    )}
                    onChange={(option) => setCountryId(option.value)}
                    options={countryOptions}
                    styles={{
                      control: (base) => ({
                        ...base,
                        width: "170px",
                        marginTop: "10px",
                        marginBottom: "5px",
                        border: "1px solid rgb(223, 222, 222)",
                        borderRadius: "4px",
                      }),
                    }}
                    placeholder="Select Country"
                  />{" "}
                  <div>
                    {errors.CountryId && (
                      <b className="error-text">{errors.CountryId}</b>
                    )}
                  </div>
                </div>
              </div>

              <div>
                <label className="company-label">State:</label>
                <div>
                  <Select
                    id="StateId"
                    name="StateId"
                    value={stateOptions.find(
                      (option) => option.value === StateId
                    )}
                    onChange={(option) => setStateId(option.value)}
                    options={stateOptions}
                    styles={{
                      control: (base) => ({
                        ...base,
                        width: "170px",
                        marginTop: "10px",
                        marginBottom: "5px",
                        border: "1px solid rgb(223, 222, 222)",
                        borderRadius: "4px",
                      }),
                    }}
                    placeholder="Select State"
                  />{" "}
                  <div>
                    {errors.StateId && (
                      <b className="error-text">{errors.StateId}</b>
                    )}
                  </div>
                </div>
              </div>

              <div>
                <label className="company-label">City:</label>
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
                        width: "170px",
                        marginTop: "10px",
                        marginBottom: "5px",
                        border: "1px solid rgb(223, 222, 222)",
                        borderRadius: "4px",
                      }),
                    }}
                    placeholder="Select City"
                  />{" "}
                  <div>
                    {errors.CityId && (
                      <b className="error-text">{errors.CityId}</b>
                    )}
                  </div>
                </div>
              </div>
              <div>
                <label className="company-label">Pincode:</label>
                <div>
                  <input
                    type="text"
                    id="Pincode"
                    name="Pincode"
                    value={Pincode}
                    onChange={(e) => setPincode(e.target.value)}
                    maxLength={6}
                    className="company-control"
                    placeholder="Enter Pin"
                  />
                  <div>
                    {errors.Pincode && (
                      <b className="error-text">{errors.Pincode}</b>
                    )}
                  </div>
                </div>
              </div>

              <div>
                <label className="company-label">Mobile No:</label>
                <div>
                  <input
                    type="text"
                    id="MobileNo"
                    name="MobileNo"
                    value={MobileNo}
                    maxLength={10}
                    onChange={(e) => setMobileNo(e.target.value)}
                    className="company-control"
                    placeholder="Enter tel no"
                  />
                  <div>
                    {errors.MobileNo && (
                      <b className="error-text">{errors.MobileNo}</b>
                    )}
                  </div>
                </div>
              </div>

              <div>
                <label className="company-label">Fax No:</label>
                <div>
                  <input
                    type="text"
                    id="FaxNo"
                    name="FaxNo"
                    value={FaxNo}
                    onChange={(e) => setFaxNo(e.target.value)}
                    maxLength={10}
                    className="company-control"
                    placeholder="Enter fax no"
                  />
                  <div>
                    {errors.FaxNo && (
                      <b className="error-text">{errors.FaxNo}</b>
                    )}
                  </div>
                </div>
              </div>

              <div>
                <label className="company-label">Email Address:</label>
                <div>
                  <input
                    type="text"
                    id="EmailId"
                    name="EmailId"
                    value={EmailId}
                    onChange={(e) => setEmailId(e.target.value)}
                    maxLength={100}
                    className="company-control"
                    placeholder="Enter email"
                  />
                  <div>
                    {errors.EmailId && (
                      <b className="error-text">{errors.EmailId}</b>
                    )}
                  </div>
                </div>
              </div>

              <div>
                <label className="company-label">Website:</label>
                <div>
                  <input
                    type="text"
                    id="Website"
                    name="Website"
                    value={Website}
                    onChange={(e) => setWebsite(e.target.value)}
                    className="company-control"
                    placeholder="Enter website"
                  />
                  <div>
                    {errors.Website && (
                      <b className="error-text">{errors.Website}</b>
                    )}
                  </div>
                </div>
              </div>
            </form>

            <div className="book-btn-container">
              <Button
                onClick={handleSubmit}
                type="submit"
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
              <u>Company</u>
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

export default Company;
