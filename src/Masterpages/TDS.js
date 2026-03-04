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

  // Fix: Safe Date Extraction
  if (tds.Effectivedate && typeof tds.Effectivedate.date === 'string') {
    const datePart = tds.Effectivedate.date.split(" ")[0]; // Gets YYYY-MM-DD
    setEffectivedate(datePart);
  } else if (typeof tds.Effectivedate === 'string') {
    setEffectivedate(tds.Effectivedate.split(" ")[0]);
  } else {
    setEffectivedate(""); // Fallback for null dates
  }


    // console.log(Effectivedate, 'effective date')

    setTDSCode(tds.TDSCode || "");
    setNetPercentage(tds.NetPercentage || "");
    setEditingIndex(row.index);
    setIsModalOpen(true);
    setIsEditing(true);
    setId(tds.Id || "");
  };

// const handleEdit = (row) => {
//   const tds = tdses[row.index];
  
//   setTDSHead(tds.TDSHead || "");
//   setSection(tds.Section || "");
//   setHeading(tds.Heading || "");
//   setTDSPercentage(tds.TDSPercentage || "");
//   setTDSAccountId(tds.TDSAccountId || "");
//   setSurchargePercentage(tds.SurchargePercentage || "");
//   setSurchargeAccountId(tds.SurchargeAccountId || "");
//   setEducationSellsPercentage(tds.EducationSellsPercentage || "");
//   setEducationSellsAccountId(tds.EducationSellsAccountId || "");
//   setHigherEducationSellsPercentage(tds.HigherEducationSellsPercentage || "");
//   setHigherEducationPercentageSellsAccountId(tds.HigherEducationPercentageSellsAccountId || "");

//   // Fix: Safe Date Extraction
//   if (tds.Effectivedate && typeof tds.Effectivedate.date === 'string') {
//     const datePart = tds.Effectivedate.date.split(" ")[0]; // Gets YYYY-MM-DD
//     setEffectivedate(datePart);
//   } else if (typeof tds.Effectivedate === 'string') {
//     setEffectivedate(tds.Effectivedate.split(" ")[0]);
//   } else {
//     setEffectivedate(""); // Fallback for null dates
//   }

//   setTDSCode(tds.TDSCode || "");
//   setNetPercentage(tds.NetPercentage || "");
//   setEditingIndex(row.index);
//   setIsModalOpen(true);
//   setIsEditing(true);
//   setId(tds.Id || "");
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
      SurchargePercentage:SurchargePercentage,
      SurchargeAccountId: SurchargeAccountId,
      EducationSellsPercentage: EducationSellsPercentage,
      EducationSellsAccountId: EducationSellsAccountId,
      HigherEducationSellsPercentage: HigherEducationSellsPercentage,
      HigherEducationPercentageSellsAccountId:HigherEducationPercentageSellsAccountId,
      Effectivedate: Effectivedate,
      TDSCode: TDSCode,
      NetPercentage: NetPercentage,
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

            <form>
              <div className="mastertds-form">
                <div>
                  <label>TDS Head</label>
                  <div>
                    <input
                      type="text"
                      id="TDSHeadDisplay"
                      name="TDSHeadDisplay"
                      value={`${Section} : ${TDSHead}`} // 👈 combine here
                      readOnly // prevent editing
                      className="mastertds-control"
                      placeholder="Select TDS Head"
                    />
                  </div>
                </div>

                <div>
                  <label className="mastertds-label"> Section</label>
                  <div>
                    <input
                      type="text"
                      id="Section"
                      name="Section"
                      value={Section}
                      onChange={(e) => setSection(e.target.value)}
                      maxLength={50}
                      style={{ width: "150px" }}
                      className="mastertds-control"
                      placeholder="Enter Section"
                    />
                  </div>
                </div>
                <div>
                  <label className="mastertds-label"> Head</label>
                  <div>
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
                  </div>
                </div>
              </div>

              <div className="mastertds-form">
                <div>
                  <label className="mastertds-label">TDS %</label>
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
                      style={{ width: "150px" }}
                      className="mastertds-control"
                      placeholder="Enter tds"
                    />
                  </div>
                </div>

                <div>
                  <label className="mastertds-label">TDS A/C</label>

                  <div>
                    <Autocomplete
                      options={accountOptions}
                      value={
                        accountOptions.find(
                          (option) => option.value === TDSAccountId
                        ) || null
                      }
                      onChange={(event, newValue) => {
                        setTDSAccountId(newValue ? newValue.value : null);
                      }}
                      isOptionEqualToValue={(option, value) =>
                        option.value === value.value
                      }
                      getOptionLabel={(option) => option.label || ""}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          placeholder="Select Account"
                          size="small"
                          fullWidth
                        />
                      )}
                      sx={{ width: 300, mt: 1 }}
                    />
                  </div>
                </div>

                <div>
                  <label className="mastertds-label">SCHRG %</label>
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
                      style={{ width: "150px" }}
                      className="mastertds-control"
                      placeholder="Enter schrg"
                    />
                  </div>
                </div>

                <div>
                  <label className="mastertds-label">SCHRG A/C</label>
                  <div>
                    <Autocomplete
                      options={accountOptions}
                      value={
                        accountOptions.find(
                          (option) => option.value === SurchargeAccountId
                        ) || null
                      }
                      onChange={(event, newValue) =>
                        setSurchargeAccountId(newValue ? newValue.value : null)
                      }
                      getOptionLabel={(option) => option.label} // Display only label in dropdown
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          placeholder="Select Schrg Account"
                          size="small"
                          margin="none"
                          fullWidth
                        />
                      )}
                      sx={{ mt: 1.25, mb: 0.625, width: 300 }} // Equivalent to 10px and 5px
                    />
                  </div>
                </div>

                <div>
                  <label className="mastertds-label">Edu Cess %</label>
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
                      style={{ width: "150px" }}
                      className="mastertds-control"
                      placeholder="Enter edu cess"
                    />
                  </div>
                </div>

                <div>
                  <label className="mastertds-label">Edu Cess A/C</label>
                  <div>
                    <Autocomplete
                      options={accountOptions}
                      value={
                        accountOptions.find(
                          (option) => option.value === EducationSellsAccountId
                        ) || null
                      }
                      onChange={(event, newValue) =>
                        setEducationSellsAccountId(
                          newValue ? newValue.value : null
                        )
                      }
                      getOptionLabel={(option) => option.label} // Display only label in dropdown
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          placeholder="Select Edu cess Account"
                          size="small"
                          margin="none"
                          fullWidth
                        />
                      )}
                      sx={{ mt: 1.25, mb: 0.625, width: 300 }} // Equivalent to 10px and 5px
                    />
                  </div>
                </div>

                <div>
                  <label className="mastertds-label">H Edu Cess %</label>
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
                      style={{ width: "150px" }}
                      className="mastertds-control"
                      placeholder="Enter H edu cess"
                    />
                  </div>
                </div>

                <div>
                  <label className="mastertds-label">H Edu Cess A/C</label>
                  <div>
                    <Autocomplete
                      options={accountOptions}
                      value={
                        accountOptions.find(
                          (option) =>
                            option.value ===
                            HigherEducationPercentageSellsAccountId
                        ) || null
                      }
                      onChange={(event, newValue) =>
                        setHigherEducationPercentageSellsAccountId(
                          newValue ? newValue.value : null
                        )
                      }
                      getOptionLabel={(option) => option.label} // Display only label in dropdown
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          placeholder="Select H Edu cess Acc"
                          size="small"
                          margin="none"
                          fullWidth
                        />
                      )}
                      sx={{ mt: 1.25, mb: 0.625, width: 300 }} // Equivalent to 10px and 5px
                    />
                  </div>
                </div>

                <div>
                  <label className="mastertds-label">Effective date</label>
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
                  </div>
                </div>

                <div>
                  <label className="mastertds-label">TDS code</label>
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
                  </div>
                </div>

                <div>
                  <label className="mastertds-label">Net %</label>
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
