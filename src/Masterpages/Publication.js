import React, { useState, useEffect, useMemo, useRef } from "react";
import axios from "axios";
import "./Publication.css";
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
import { RiDeleteBin5Line } from "react-icons/ri";
import { Tooltip } from "@mui/material";

function Publication() {
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

    fetchPublications();
  }, []);

  const [PublicationName, setPublicationName] = useState("");
  const [Address, setAddress] = useState("");
  const [CityId, setCityId] = useState("");
  const [StateId, setStateId] = useState("");
  const [CountryId, setCountryId] = useState("");
  const [ContactNo, setContactNo] = useState("");
  const [PublicationCode, setPublicationCode] = useState("");
  const [ShortName, setShortName] = useState("");
  const [OtherPublicationFlag, setOtherPublicationFlag] = useState(false);

  const [publications, setPublications] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingIndex, setEditingIndex] = useState(-1);
  const [error, setError] = useState("");
  const [id, setId] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [errors, setErrors] = useState("");
  const [cityOptions, setCityOptions] = useState([]);
  const [stateOptions, setStateOptions] = useState([]);
  const [countryOptions, setCountryOptions] = useState([]);
  const [deleteId, setDeleteId] = useState(null);

  // Confirmation Dialog state
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [deleteIndex, setDeleteIndex] = useState(null);

  const pubnameRef = useRef(null);
  const addressRef = useRef(null);
  const countryRef = useRef(null);
  const stateRef = useRef(null);
  const cityRef = useRef(null);
  const contactnoRef = useRef(null);
  const pubcodeRef = useRef(null);
  const shortnameRef = useRef(null);
  const pubflagRef = useRef(null);
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
    fetchPublications();
    fetchAllCities();
    fetchCountries();
    fetchStates();
  }, []);

  const fetchPublications = async () => {
    try {
      const response = await axios.get(
        "https://publication.microtechsolutions.net.in/php/Publicationget.php"
      );

      setPublications(response.data);
    } catch (error) {
      // toast.error("Error fetching publications:", error);
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

  const fetchCountries = async () => {
    try {
      const response = await axios.get(
        "https://publication.microtechsolutions.net.in/php/Countryget.php"
      );
      const countryOptions = response.data.map((coun) => ({
        value: coun.Id,
        label: coun.CountryName,
      }));
      setCountryOptions(countryOptions);
    } catch (error) {
      // toast.error("Error fetching countries:", error);
    }
  };

  const resetForm = () => {
    setPublicationName("");
    setAddress("");
    setCityId("");
    setStateId("");
    setContactNo("");
    setCountryId("");
    setPublicationCode("");
    setShortName("");
    setOtherPublicationFlag("");
  };

  const handleNewClick = () => {
    resetForm();
    setIsModalOpen(true);
    setEditingIndex(-1);
    setIsEditing(false);
  };

  const handleEdit = (row) => {
    const publication = publications[row.index];

    // console.log(publication, 'publication')
    setPublicationName(publication.PublicationName);
    setAddress(publication.Address);
    setStateId(publication.StateId);
    setCityId(publication.CityId);
    setCountryId(publication.CountryId);
    setContactNo(publication.ContactNo);
    setPublicationCode(publication.PublicationCode);
    setShortName(publication.ShortName);
    setOtherPublicationFlag(publication.OtherPublicationFlag);
    setEditingIndex(row.index);
    setId(publication.Id);
    setIsEditing(true);
    setIsModalOpen(true);
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
      "https://publication.microtechsolutions.net.in/php/Publicationdelete.php",
      requestOptions
    )
      .then((response) => response.text())
      .then((result) => console.log(result))
      .catch((error) => console.error(error));
    toast.success("Publication Deleted Successfully");
    setIsDeleteDialogOpen(false);
    fetchPublications();
  };

  const cancelDelete = () => {
    setIsDeleteDialogOpen(false);
    setDeleteIndex(null);
  };

  const validateForm = () => {
    let formErrors = {};
    let isValid = true;

    if (!PublicationName) {
      formErrors.PublicationName = "Publication Name is required.";
      isValid = false;
    }

    if (!Address) {
      formErrors.Address = "Address is required.";
      isValid = false;
    }
    //   if (!CityId) {
    //     formErrors.CityId = "CityId is required.";
    //     isValid = false;

    // }
    // if (!StateId) {
    //   formErrors.StateId = "StateId is required.";
    //   isValid = false;

    // }
    // if (!CountryId) {
    //   formErrors.CountryId = "CountryId is required.";
    //   isValid = false;
    // }

    if (!ContactNo) {
      formErrors.ContactNo = "Contact No must be 10 digits.";
      isValid = false;
    }

    if (!PublicationCode) {
      formErrors.PublicationCode = "Publication Code is required.";
      isValid = false;
    }

    if (!ShortName) {
      formErrors.ShortName = "Short Name is required.";
      isValid = false;
    }
    // if (!OtherPublicationFlag) {
    //   formErrors.OtherPublicationFlag = "Other Publication Flag is required.";
    //   isValid = false;

    // }
    setErrors(formErrors);
    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent the default form submission
    // if (!validateForm()) return;

    const data = {
      PublicationName: PublicationName,
      Address: Address,
      CityId: CityId,
      StateId: StateId,
      CountryId: CountryId,
      ContactNo: ContactNo,
      PublicationCode: PublicationCode,
      ShortName: ShortName,
      OtherPublicationFlag: OtherPublicationFlag,
      CreatedBy: userId,
    };

    const url = isEditing
      ? "https://publication.microtechsolutions.net.in/php/Publicationupdate.php"
      : "https://publication.microtechsolutions.net.in/php/Publicationpost.php";

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
        toast.success("Publication updated successfully!");
      } else {
        toast.success("Publication added successfully!");
      }
      setIsModalOpen(false);
      resetForm();
      fetchPublications(); // Refresh the list after submit
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
        accessorKey: "PublicationName",
        header: "Publication",
        size: 50,
      },

      {
        accessorKey: "PublicationCode",
        header: "Publication Code",
        size: 50,
      },

      {
        accessorKey: "ShortName",
        header: "Short Name",
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
    [publications]
  );

  const table = useMaterialReactTable({
    columns,
    data: publications,
    muiTableHeadCellProps: {
      style: {
        backgroundColor: "#E9ECEF", // Replace with your desired color
        color: "black",
        fontSize: "16px",
      },
    },
  });

  return (
    <div className="publication-container">
      <h1>Publication Master</h1>
      <div className="publicationtable-master">
        <div className="publicationtable1-master">
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
          <div className="pubtable-container">
            <MaterialReactTable table={table} />
          </div>
        </div>

        {isModalOpen && (
          <div
            className="publication-overlay"
            onClick={() => setIsModalOpen(false)}
          />
        )}

        <Modal open={isModalOpen}>
          <div className="publication-modal">
            <h2
              style={{
                textAlign: "center",
                fontWeight: "620",
                margin: "2px",
                fontSize: "27px",
              }}>
              {editingIndex >= 0 ? "Edit  Publication" : "Add New Publication"}
            </h2>
            <form className="publication-form">
              <div>
                <label className="publication-label">
                  Publication Name <b className="required">*</b>
                </label>
                <div>
                  <Tooltip
                    title={
                      <span style={{ fontSize: "14px", fontWeight: "bold" }}>
                        {PublicationName}
                      </span>
                    }
                    arrow>
                    <input
                      type="text"
                      id="PublicationName"
                      name="PublicationName"
                      value={PublicationName}
                      onChange={(e) => setPublicationName(e.target.value)}
                      maxLength={100}
                      ref={pubnameRef}
                      onKeyDown={(e) => handleKeyDown(e, addressRef)}
                      placeholder="Enter Publication Name"
                      className="professor-control"
                    />
                  </Tooltip>

                  {/* <div>
                    {errors.PublicationName && (
                      <b className="error-text">{errors.PublicationName}</b>
                    )}
                  </div> */}
                </div>
              </div>

              <div>
                <label className="publication-label">
                  Publication Code<b className="required">*</b>
                </label>
                <div>
                  <input
                    type="text"
                    id="PublicationCode"
                    name="PublicationCode"
                    value={PublicationCode}
                    maxLength={1}
                    onChange={(e) => setPublicationCode(e.target.value)}
                    ref={pubcodeRef}
                    onKeyDown={(e) => handleKeyDown(e, shortnameRef)}
                    placeholder="Enter Publication code"
                    className="professor-control"
                  />

                  {/* <div>
                    {errors.PublicationCode && (
                      <b className="error-text">{errors.PublicationCode}</b>
                    )}
                  </div> */}
                </div>
              </div>

              <div>
                <label className="publication-label">
                  Short Name <b className="required">*</b>
                </label>
                <div>
                  <Tooltip
                    title={
                      <span style={{ fontSize: "14px", fontWeight: "bold" }}>
                        {ShortName}
                      </span>
                    }
                    arrow>
                    <input
                      type="text"
                      id="ShortName"
                      name="ShortName"
                      value={ShortName}
                      onChange={(e) => setShortName(e.target.value)}
                      ref={shortnameRef}
                      onKeyDown={(e) => handleKeyDown(e, pubflagRef)}
                      placeholder="Enter ShortName"
                      className="professor-control"
                    />
                  </Tooltip>

                  {/* <div>
                    {errors.ShortName && (
                      <b className="error-text">{errors.ShortName}</b>
                    )}
                  </div> */}
                </div>
              </div>

              <div>
                <label className="college-label">
                  Country <b className="required">*</b>
                </label>
                <div>
                  <Select
                    id="CountryId"
                    name="CountryId"
                    value={countryOptions.find(
                      (option) => option.value === CountryId
                    )}
                    onChange={(option) => setCountryId(option.value)}
                    ref={countryRef}
                    onKeyDown={(e) => handleKeyDown(e, stateRef)}
                    options={countryOptions}
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
                    placeholder="Select Country"
                  />

                  {/* <div>
                    {errors.CountryId && (
                      <b className="error-text">{errors.CountryId}</b>
                    )}
                  </div> */}
                </div>
              </div>

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
                    ref={cityRef}
                    onKeyDown={(e) => handleKeyDown(e, contactnoRef)}
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
                <label className="publication-label">
                  Address <b className="required">*</b>
                </label>
                <div>
                  <Tooltip
                    title={
                      <span style={{ fontSize: "14px", fontWeight: "bold" }}>
                        {Address}
                      </span>
                    }
                    arrow>
                    <input
                      type="text"
                      id="Address"
                      name="Address"
                      value={Address}
                      onChange={(e) => setAddress(e.target.value)}
                      maxLength={200}
                      ref={addressRef}
                      onKeyDown={(e) => handleKeyDown(e, countryRef)}
                      style={{ width: "300px" }}
                      placeholder="Enter Address"
                      className="professor-control"
                    />
                  </Tooltip>

                  <div>
                    {errors.Address && (
                      <b className="error-text">{errors.Address}</b>
                    )}
                  </div>
                </div>
              </div>

              <div>
                <label className="publication-label">
                  Contact No <b className="required">*</b>
                </label>
                <div>
                  <input
                    type="number"
                    id="ContactNo"
                    name="ContactNo"
                    value={ContactNo}
                    onChange={(e) => setContactNo(e.target.value)}
                    ref={contactnoRef}
                    onKeyDown={(e) => handleKeyDown(e, pubcodeRef)}
                    placeholder="Enter Contact No"
                    className="professor-control"
                  />

                  <div>
                    {errors.ContactNo && (
                      <b className="error-text">{errors.ContactNo}</b>
                    )}
                  </div>
                </div>
              </div>

              <div>
                <label className="publication-label">
                  Other Publication Flag <b className="required">*</b>
                </label>
                <div>
                  <input
                    type="checkbox"
                    id="OtherPublicationFlag"
                    name="OtherPublicationFlag"
                    checked={OtherPublicationFlag}
                    onChange={(e) => setOtherPublicationFlag(e.target.checked)}
                    ref={pubflagRef}
                    onKeyDown={(e) => handleKeyDown(e, saveRef)}
                    placeholder="Enter OtherPublicationFlag"
                    style={{ marginTop: "10px", marginLeft: "20px" }}
                  />
                </div>
              </div>
            </form>

            <div className="pub-btn-container">
              <Button
                onClick={handleSubmit}
                ref={saveRef}
                //  onKeyDown={(e) => handleKeyDown(e, groupIdRef)}
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
              <u>Publication</u>
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

export default Publication;
