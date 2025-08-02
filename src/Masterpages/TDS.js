import React, { useState, useMemo, useEffect, useRef } from "react";
import "./TDS.css";
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
import moment from "moment";
import { RiDeleteBin5Line } from "react-icons/ri";
import { Tooltip, TextField, Autocomplete } from "@mui/material";

function TDS() {
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

    fetchTDSMasters();
  }, []);

  const [TDSHead, setTDSHead] = useState("");
  const [Section, setSection] = useState("");
  const [Heading, setHeading] = useState("");
  const [TDSPercentage, setTDSPercentage] = useState("");
  const [TDSAccountId, setTDSAccountId] = useState(null);
  const [accountOptions, setAccountOptions] = useState([]);
  const [SurchargePercentage, setSurchargePercentage] = useState("");
  const [SurchargeAccountId, setSurchargeAccountId] = useState(null);
  const [EducationSellsPercentage, setEducationSellsPercentage] = useState("");
  const [EducationSellsAccountId, setEducationSellsAccountId] = useState(null);
  const [HigherEducationSellsPercentage, setHigherEducationSellsPercentage] =
    useState("");
  const [
    HigherEducationPercentageSellsAccountId,
    setHigherEducationPercentageSellsAccountId,
  ] = useState(null);
  const [Effectivedate, setEffectivedate] = useState(null);

  const [TDSCode, setTDSCode] = useState("");
  const [NetPercentage, setNetPercentage] = useState("");
  const [tdses, setTdses] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [id, setId] = useState("");
  const [errors, setErrors] = useState({});
  const [editingIndex, setEditingIndex] = useState(-1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  // Confirmation Dialog state
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [deleteIndex, setDeleteIndex] = useState(null);

  const tdsheadRef = useRef(null);

  const tdssectionRef = useRef(null);
  const headingRef = useRef(null);
  const tdsRef = useRef(null);

  const tdsaccRef = useRef(null);
  const schrgRef = useRef(null);
  const schrgaccRef = useRef(null);
  const educessRef = useRef(null);
  const educessaccRef = useRef(null);
  const heducessRef = useRef(null);
  const heducessaccRef = useRef(null);
  const effcetivedateRef = useRef(null);
  const tdscodeRef = useRef(null);
  const netpercentageRef = useRef(null);

  const saveRef = useRef(null);

  const handleKeyDown = (e, nextFieldRef) => {
    if (e.key === "Enter") {
      e.preventDefault();
      if (nextFieldRef && nextFieldRef.current) {
        nextFieldRef.current.focus();
      }
    }
  };

  const resetForm = () => {
    setTDSCode("");
    setSection("");
    setTDSHead("");
    setHeading("");
    setTDSPercentage("");
    setTDSAccountId("");
    setSurchargeAccountId("");
    setSurchargePercentage("");
    setEducationSellsAccountId("");
    setEducationSellsPercentage("");
    setHigherEducationSellsPercentage("");
    setHigherEducationPercentageSellsAccountId("");
    setEffectivedate("");
    setTDSCode("");
    setNetPercentage("");
  };

  const handleNewClick = () => {
    resetForm();
    setIsModalOpen(true);
    setEditingIndex(-1);
    setIsEditing(false);
  };

  const handleEdit = (row) => {
    const tds = tdses[row.index];
    console.log(tds, "tds"); // For debugging
    setTDSHead(tds.TDSHead || ""); // Ensure the property is defined
    setSection(tds.Section || "");
    setHeading(tds.Heading || "");
    setTDSPercentage(tds.TDSPercentage || "");
    setTDSAccountId(tds.TDSAccountId || "");
    setSurchargePercentage(tds.SurchargePercentage || "");
    setSurchargeAccountId(tds.SurchargeAccountId || "");
    setEducationSellsPercentage(tds.EducationSellsPercentage || "");
    setEducationSellsAccountId(tds.EducationSellsAccountId || "");
    setHigherEducationSellsPercentage(tds.HigherEducationSellsPercentage || "");
    setHigherEducationPercentageSellsAccountId(
      tds.HigherEducationPercentageSellsAccountId || ""
    );

    // Extract date portion (YYYY-MM-DD) from datetime string
    const datePart = tds.Effectivedate.date.split(" ")[0];
    setEffectivedate(datePart);

    // console.log(Effectivedate, 'effective date')

    setTDSCode(tds.TDSCode || "");
    setNetPercentage(tds.NetPercentage || "");
    setEditingIndex(row.index);
    setIsModalOpen(true);
    setIsEditing(true);
    setId(tds.Id || "");
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
      "https://publication.microtechsolutions.net.in/php/TDSmasterdelete.php",
      requestOptions
    )
      .then((response) => response.text())
      .then((result) => console.log(result))
      .catch((error) => console.error(error));
    toast.success("TDS Deleted Successfully");
    setIsDeleteDialogOpen(false);
    fetchTDSMasters();
  };

  const cancelDelete = () => {
    setIsDeleteDialogOpen(false);
    setDeleteIndex(null);
  };

  const validateForm = () => {
    let formErrors = {};
    let isValid = true;

    if (!TDSHead) {
      formErrors.TDSHead = "TDS head is required.";
      isValid = false;
    }

    if (!Section) {
      formErrors.Section = "Section is required.";
      isValid = false;
    }

    if (!Heading) {
      formErrors.Heading = "Heading is required.";
      isValid = false;
    }

    if (!TDSPercentage) {
      formErrors.TDSPercentage = "TDS% is required.";
      isValid = false;
    }

    if (!TDSAccountId) {
      formErrors.TDSAccountId = "TDS acc Id is required.";
      isValid = false;
    }

    // if (!SurchargePercentage) {
    //   formErrors.SurchargePercentage = "Schrg % is required.";
    //   isValid = false;
    // }

    // if (!SurchargeAccountId) {
    //   formErrors.SurchargeAccountId = "Schrg Acc Id is required.";
    //   isValid = false;
    // }

    // if (!EducationSellsPercentage) {
    //   formErrors.EducationSellsPercentage = "Edu Cess %  is required.";
    //   isValid = false;
    // }

    // if (!EducationSellsAccountId) {
    //   formErrors.EducationSellsAccountId = "Edu Cess Acc Id is required.";
    //   isValid = false;
    // }

    // if (!HigherEducationSellsPercentage) {
    //   formErrors.HigherEducationSellsPercentage = "H Edu Cess % is required.";
    //   isValid = false;
    // }

    // if (!HigherEducationPercentageSellsAccountId) {
    //   formErrors.HigherEducationPercentageSellsAccountId =
    //     "H Edu Cess Acc Id is required.";
    //   isValid = false;
    // }

    // if (!Effectivedate) {
    //   formErrors.Effectivedate = "Date is required.";
    //   isValid = false;
    // }

    // if (!TDSCode) {
    //   formErrors.TDSCode = "Tds code is required.";
    //   isValid = false;
    // }

    // if (!NetPercentage) {
    //   formErrors.NetPercentage = "Net% is required.";
    //   isValid = false;
    // }

    setErrors(formErrors);
    return isValid;
  };

  const fetchTDSMasters = async () => {
    try {
      const response = await axios.get(
        "https://publication.microtechsolutions.net.in/php/TDSMasterget.php"
      );
      setTdses(response.data);
    } catch (error) {
      // toast.error("Error fetching TDS masters:", error);
    }
  };

  const fetchAccounts = async () => {
    try {
      const response = await axios.get(
        "https://publication.microtechsolutions.net.in/php/Accountget.php"
      );
      const accountOptions = response.data.map((acc) => ({
        value: acc.Id,
        label: acc.AccountName,
      }));
      setAccountOptions(accountOptions);
    } catch (error) {
      // toast.error("Error fetching Accounts:", error);
      console.error("Error fetching Accounts:", error);
    }
  };

  useEffect(() => {
    fetchTDSMasters();
    fetchAccounts();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    // if (!validateForm()) return;

    // Format the date to YYYY-MM-DD HH:MM:SS if needed
    const formattedDate = moment(Effectivedate).format("YYYY-MM-DD");
    console.log(formattedDate, "eff date");

    const data = {
      TDSHead: TDSHead,
      Section: Section,
      Heading: Heading,
      TDSPercentage: TDSPercentage,
      TDSAccountId: TDSAccountId,
      SurchargePercentage: "10.00",
      SurchargeAccountId: 2,
      EducationSellsPercentage: "5.00",
      EducationSellsAccountId: 3,
      HigherEducationSellsPercentage: "10.00",
      HigherEducationPercentageSellsAccountId: 2,
      Effectivedate: "2025-01-01",
      TDSCode: 2,
      NetPercentage: "10.00",
      CreatedBy: userId,
    };

    const url = isEditing
      ? "https://publication.microtechsolutions.net.in/php/TDSMasterupdate.php"
      : "https://publication.microtechsolutions.net.in/php/TDSMasterpost.php";

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

      toast.success(
        isEditing ? "TDS updated successfully!" : "TDS added successfully!"
      );
      setIsModalOpen(false);
      resetForm();
      fetchTDSMasters();
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
        accessorKey: "TDSHead",
        header: "TDS Head",
        size: 50,
      },

      {
        accessorKey: "Heading",
        header: "Heading",
        size: 50,
      },
      {
        accessorKey: "Section",
        header: "Section",
        size: 50,
      },
      {
        accessorKey: "TDSPercentage",
        header: "TDS %",
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
    [tdses]
  );

  const table = useMaterialReactTable({
    columns,
    data: tdses,
    muiTableHeadCellProps: {
      style: {
        backgroundColor: "#E9ECEF", // Replace with your desired color
        color: "black",
        fontSize: "16px",
      },
    },
  });

  return (
    <div className="mastertds-master">
      <h1>TDS Master</h1>

      <div className="mastertdstable-master">
        <div className="mastertdstable1-master">
          {" "}
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
          <div className="mastertdstable-container">
            <MaterialReactTable table={table} />
          </div>
        </div>

        {isModalOpen && (
          <div
            className="mastertds-overlay"
            onClick={() => setIsModalOpen(false)}
          />
        )}

        <Modal open={isModalOpen}>
          <div className="mastertds-modal" onSubmit={handleSubmit}>
            <h1
              style={{
                textAlign: "center",
                fontWeight: "620",
                margin: "2px",
                fontSize: "27px",
              }}>
              {editingIndex >= 0 ? "Edit TDS " : "Add TDS "}
            </h1>

            <form className="mastertds-form">
              <div>
                <label className="mastertds-label">
                  {" "}
                  TDS Head <b className="required">*</b>
                </label>
                <div>
                  <Tooltip
                    title={
                      <span style={{ fontSize: "14px", fontWeight: "bold" }}>
                        {TDSHead}
                      </span>
                    }
                    arrow>
                    <input
                      type="text"
                      id="TDSHead"
                      name="TDSHead"
                      value={TDSHead}
                      onChange={(e) => setTDSHead(e.target.value)}
                      maxLength={50}
                      ref={tdsheadRef}
                      onKeyDown={(e) => handleKeyDown(e, tdssectionRef)}
                      className="mastertds-control"
                      placeholder="Enter TDS Head"
                    />
                  </Tooltip>

                  {/* <div>
                    {errors.TDSHead && (
                      <b className="error-text">{errors.TDSHead}</b>
                    )}
                  </div> */}
                </div>
              </div>
              <div>
                <label className="mastertds-label">
                  Section <b className="required">*</b>
                </label>
                <div>
                  <input
                    id="Section"
                    name="Section"
                    value={Section}
                    onChange={(e) => setSection(e.target.value)}
                    maxLength={25}
                    ref={tdssectionRef}
                    onKeyDown={(e) => handleKeyDown(e, headingRef)}
                    className="mastertds-control"
                    placeholder="Enter section"
                  />

                  {/* <div>
                    {errors.Section && (
                      <b className="error-text">{errors.Section}</b>
                    )}
                  </div> */}
                </div>
              </div>
              <div>
                <label className="mastertds-label">
                  Heading <b className="required">*</b>
                </label>
                <div>
                  <input
                    type="text"
                    id="Heading"
                    name="Heading"
                    value={Heading}
                    onChange={(e) => setHeading(e.target.value)}
                    maxLength={50}
                    ref={headingRef}
                    onKeyDown={(e) => handleKeyDown(e, tdsRef)}
                    className="mastertds-control"
                    placeholder="Enter heading"
                  />
                  {/* <div>
                    {errors.Heading && (
                      <b className="error-text">{errors.Heading}</b>
                    )}
                  </div> */}
                </div>
              </div>
              <div>
                <label className="mastertds-label">
                  TDS % <b className="required">*</b>
                </label>
                <div>
                  <input
                    type="text"
                    id="TDSPercentage"
                    name="TDSPercentage"
                    value={TDSPercentage}
                    onChange={(e) => {
                      const value = e.target.value;

                      // Regex to validate decimal numbers with at most 18 digits total and 2 decimal places
                      const regex = /^\d{0,18}(\.\d{0,2})?$/;

                      // Check if the value matches the regex
                      if (value === "" || regex.test(value)) {
                        setTDSPercentage(value);
                      }
                    }}
                    ref={tdsRef}
                    onKeyDown={(e) => handleKeyDown(e, tdsaccRef)}
                    className="mastertds-control"
                    placeholder="Enter tds"
                  />
                  {/* <div>
                    {errors.TDSPercentage && (
                      <b className="error-text">{errors.TDSPercentage}</b>
                    )}
                  </div> */}
                </div>
              </div>

              <div>
                <label className="mastertds-label">
                  TDS A/C <b className="required">*</b>
                </label>

                <div>
                  <Autocomplete
                    options={accountOptions}
                    value={
                      accountOptions.find(
                        (option) => option.value === TDSAccountId
                      ) || null
                    }
                    onChange={(event, newValue) =>
                      setTDSAccountId(newValue ? newValue.value : null)
                    }
                    getOptionLabel={(option) => option.label} // Display only label in dropdown
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        placeholder="Select Account id"
                        size="small"
                        margin="none"
                        fullWidth
                      />
                    )}
                    sx={{ mt: 1.25, mb: 0.625, width: 300 }} // Equivalent to 10px and 5px
                  />
                </div>

                {/* <div>
                  {errors.TDSAccountId && (
                    <b className="error-text">{errors.TDSAccountId}</b>
                  )}
                </div> */}
              </div>

              <div style={{ display: "none" }}>
                <label className="mastertds-label">
                  SCHRG % <b className="required">*</b>
                </label>
                <div>
                  <input
                    type="text"
                    id="SurchargePercentage"
                    name="SurchargePercentage"
                    value={SurchargePercentage}
                    onChange={(e) => {
                      const value = e.target.value;

                      // Regex to validate decimal numbers with at most 18 digits total and 2 decimal places
                      const regex = /^\d{0,18}(\.\d{0,2})?$/;

                      // Check if the value matches the regex
                      if (value === "" || regex.test(value)) {
                        setSurchargePercentage(value);
                      }
                    }}
                    ref={schrgRef}
                    onKeyDown={(e) => handleKeyDown(e, schrgaccRef)}
                    className="mastertds-control"
                    placeholder="Enter schrg"
                  />
                  <div>
                    {errors.SurchargePercentage && (
                      <b className="error-text">{errors.SurchargePercentage}</b>
                    )}
                  </div>
                </div>
              </div>

              <div style={{ display: "none" }}>
                <label className="mastertds-label">
                  SCHRG A/C <b className="required">*</b>
                </label>
                <div>
                  <input
                    type="number"
                    id="SurchargeAccountId"
                    name="SurchargeAccountId"
                    value={SurchargeAccountId}
                    onChange={(e) => setSurchargeAccountId(e.target.value)}
                    ref={schrgaccRef}
                    onKeyDown={(e) => handleKeyDown(e, educessRef)}
                    className="mastertds-control"
                    placeholder="Schrg A/C"
                  />

                  <div>
                    {errors.SurchargeAccountId && (
                      <b className="error-text">{errors.SurchargeAccountId}</b>
                    )}
                  </div>
                </div>
              </div>

              <div style={{ display: "none" }}>
                <label className="mastertds-label">
                  Edu Cess % <b className="required">*</b>
                </label>
                <div>
                  <input
                    type="text"
                    id="EducationSellsPercentage"
                    name="EducationSellsPercentage"
                    value={EducationSellsPercentage}
                    onChange={(e) => {
                      const value = e.target.value;

                      // Regex to validate decimal numbers with at most 18 digits total and 2 decimal places
                      const regex = /^\d{0,18}(\.\d{0,2})?$/;

                      // Check if the value matches the regex
                      if (value === "" || regex.test(value)) {
                        setEducationSellsPercentage(value);
                      }
                    }}
                    ref={educessRef}
                    onKeyDown={(e) => handleKeyDown(e, educessaccRef)}
                    className="mastertds-control"
                    placeholder="Enter edu cess"
                  />
                  <div>
                    {errors.EducationSellsPercentage && (
                      <b className="error-text">
                        {errors.EducationSellsPercentage}
                      </b>
                    )}
                  </div>
                </div>
              </div>

              <div style={{ display: "none" }}>
                <label className="mastertds-label">
                  Edu Cess A/C <b className="required">*</b>
                </label>
                <div>
                  <input
                    type="number"
                    id="EducationSellsAccountId"
                    name="EducationSellsAccountId"
                    value={EducationSellsAccountId}
                    onChange={(e) => setEducationSellsAccountId(e.target.value)}
                    ref={educessaccRef}
                    onKeyDown={(e) => handleKeyDown(e, heducessRef)}
                    className="mastertds-control"
                    placeholder="Edu cess A/C"
                  />

                  <div>
                    {errors.EducationSellsAccountId && (
                      <b className="error-text">
                        {errors.EducationSellsAccountId}
                      </b>
                    )}
                  </div>
                </div>
              </div>

              <div style={{ display: "none" }}>
                <label className="mastertds-label">
                  H Edu Cess % <b className="required">*</b>
                </label>
                <div>
                  <input
                    type="text"
                    id="HigherEducationSellsPercentage"
                    name="HigherEducationSellsPercentage"
                    value={HigherEducationSellsPercentage}
                    onChange={(e) => {
                      const value = e.target.value;

                      // Regex to validate decimal numbers with at most 18 digits total and 2 decimal places
                      const regex = /^\d{0,18}(\.\d{0,2})?$/;

                      // Check if the value matches the regex
                      if (value === "" || regex.test(value)) {
                        setHigherEducationSellsPercentage(value);
                      }
                    }}
                    ref={heducessRef}
                    onKeyDown={(e) => handleKeyDown(e, heducessaccRef)}
                    className="mastertds-control"
                    placeholder="Enter H edu cess"
                  />

                  <div>
                    {errors.HigherEducationSellsPercentage && (
                      <b className="error-text">
                        {errors.HigherEducationSellsPercentage}
                      </b>
                    )}
                  </div>
                </div>
              </div>

              <div style={{ display: "none" }}>
                <label className="mastertds-label">
                  H Edu Cess A/C <b className="required">*</b>
                </label>
                <div>
                  <input
                    type="number"
                    id="HigherEducationPercentageSellsAccountId"
                    name="HigherEducationPercentageSellsAccountId"
                    value={HigherEducationPercentageSellsAccountId}
                    onChange={(e) =>
                      setHigherEducationPercentageSellsAccountId(e.target.value)
                    }
                    ref={heducessaccRef}
                    onKeyDown={(e) => handleKeyDown(e, effcetivedateRef)}
                    className="mastertds-control"
                    placeholder="H Edu cess A/C"
                  />
                  <div>
                    {errors.HigherEducationPercentageSellsAccountId && (
                      <b className="error-text">
                        {errors.HigherEducationPercentageSellsAccountId}
                      </b>
                    )}
                  </div>
                </div>
              </div>

              <div style={{ display: "none" }}>
                <label className="mastertds-label">
                  Effective date <b className="required">*</b>
                </label>
                <div>
                  <input
                    type="date"
                    id="Effectivedate"
                    name="Effectivedate"
                    value={Effectivedate}
                    onChange={(e) => setEffectivedate(e.target.value)}
                    ref={effcetivedateRef}
                    onKeyDown={(e) => handleKeyDown(e, tdscodeRef)}
                    className="mastertds-control"
                    placeholder="Enter Effective date"
                  />

                  <div>
                    {errors.Effectivedate && (
                      <b className="error-text">{errors.Effectivedate}</b>
                    )}
                  </div>
                </div>
              </div>

              <div style={{ display: "none" }}>
                <label className="mastertds-label">
                  TDS code <b className="required">*</b>
                </label>
                <div>
                  <input
                    type="text"
                    id="TDSCode"
                    name="TDSCode"
                    value={TDSCode}
                    onChange={(e) => setTDSCode(e.target.value)}
                    maxLength={15}
                    ref={tdscodeRef}
                    onKeyDown={(e) => handleKeyDown(e, netpercentageRef)}
                    className="mastertds-control"
                    placeholder="Enter TDS Code"
                  />
                  <div>
                    {errors.TDSCode && (
                      <b className="error-text">{errors.TDSCode}</b>
                    )}
                  </div>
                </div>
              </div>

              <div style={{ display: "none" }}>
                <label className="mastertds-label">
                  Net % <b className="required">*</b>
                </label>
                <div>
                  <input
                    type="text"
                    id="NetPercentage"
                    name="NetPercentage"
                    value={NetPercentage}
                    onChange={(e) => {
                      const value = e.target.value;

                      // Regex to validate decimal numbers with at most 18 digits total and 2 decimal places
                      const regex = /^\d{0,18}(\.\d{0,2})?$/;

                      // Check if the value matches the regex
                      if (value === "" || regex.test(value)) {
                        setNetPercentage(value);
                      }
                    }}
                    ref={netpercentageRef}
                    onKeyDown={(e) => handleKeyDown(e, saveRef)}
                    className="mastertds-control"
                    placeholder="Enter Net"
                  />

                  <div>
                    {errors.NetPercentage && (
                      <b className="error-text">{errors.NetPercentage}</b>
                    )}
                  </div>
                </div>
              </div>
            </form>

            <div className="mastertds-btn-container">
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
              <u>TDS</u>
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

export default TDS;
