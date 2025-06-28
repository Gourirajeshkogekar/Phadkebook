import React, { useState, useMemo, useEffect, useRef } from "react";
import "./PaperSize.css";
import {
  MaterialReactTable,
  useMaterialReactTable,
} from "material-react-table";
import axios from "axios";
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

function PaperSize() {
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

    fetchPaperSizes();
  }, []);
  const [papersize, setPapersize] = useState("");
  const [millname, setMillname] = useState([]);
  const [unit, setUnit] = useState("");
  const [multiplefactor, setMultiplefactor] = useState("");
  const [opstock, setOpstock] = useState("");
  const [STRSize_Code, setSTRSize_Code] = useState("");
  const [SizeCode, setSizeCode] = useState("");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingIndex, setEditingIndex] = useState(-1);
  const [id, setId] = useState("");
  const [isEditing, setIsEditing] = useState(false);

  const [errors, setErrors] = useState("");

  const [papersizes, setPapersizes] = useState([]);

  const [deleteId, setDeleteId] = useState(null);

  // Confirmation Dialog state
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [deleteIndex, setDeleteIndex] = useState(null);

  const papersizeRef = useRef(null);
  const millnameRef = useRef(null);
  const unitRef = useRef(null);
  const opstockRef = useRef(null);
  const multfactorRef = useRef(null);
  const strsizecodeRef = useRef(null);
  const sizecodeRef = useRef(null);
  const saveRef = useRef(null);

  const handleKeyDown = (e, nextFieldRef) => {
    if (e.key === "Enter") {
      e.preventDefault();
      if (nextFieldRef && nextFieldRef.current) {
        nextFieldRef.current.focus();
      }
    }
  };

  const fetchPaperSizes = async () => {
    try {
      const response = await axios.get(
        "https://publication.microtechsolutions.net.in/php/PaperSizeget.php"
      );
      setPapersizes(response.data);
    } catch (error) {
      // toast.error("Error fetching papersizes:", error);
    }
  };

  useEffect(() => {
    fetchPaperSizes();
  }, []);

  const resetForm = () => {
    setPapersize("");
    setUnit("");
    setOpstock("");
    setMillname("");
    setMultiplefactor("");
    setSTRSize_Code("");
    setSizeCode("");

    setIsModalOpen(false);
    setErrors({});
  };

  const handleNewClick = () => {
    resetForm();
    setIsModalOpen(true);
    setEditingIndex(-1);
  };

  const handleEdit = (row) => {
    const paper = papersizes[row.index];
    setPapersize(paper.PaperSizeName);
    setMillname(paper.MillName);
    setUnit(paper.Unit);
    setMultiplefactor(paper.MultipleFactor);
    setOpstock(paper.OpeningStock);
    setSTRSize_Code(paper.STRSize_Code);
    setSizeCode(paper.SizeCode);
    setEditingIndex(row.index);
    setId(paper.Id);
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
      "https://publication.microtechsolutions.net.in/php/Papersizedelete.php",
      requestOptions
    )
      .then((response) => response.text())
      .then((result) => console.log(result))
      .catch((error) => console.error(error));
    toast.success("Papersize Deleted Successfully");
    setIsDeleteDialogOpen(false);
    fetchPaperSizes();
  };

  const cancelDelete = () => {
    setIsDeleteDialogOpen(false);
    setDeleteIndex(null);
  };

  const validateForm = () => {
    let formErrors = {};
    let isValid = true;

    if (!papersize) {
      formErrors.papersize = "Paper Size Name is required.";
      isValid = false;
    }

    if (!millname) {
      formErrors.millname = "Mill Name is required.";
      isValid = false;
    }

    if (!unit) {
      formErrors.unit = "Unit Name is required.";
      isValid = false;
    }

    if (!multiplefactor) {
      formErrors.multiplefactor = "Multiple Factor is required.";
      isValid = false;
    }

    // if (!opstock) {
    //   formErrors.opstock = "Opening Stock is required.";
    //   isValid = false;
    // }

    // if (!STRSize_Code) {
    //   formErrors.STRSize_Code = "STRSize_Code is required.";
    //   isValid = false;
    // }
    // if (!SizeCode) {
    //   formErrors.SizeCode = "Size Code is required.";
    //   isValid = false;
    // }

    setErrors(formErrors);
    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return; // Exit if form is invalid

    const data = {
      PaperSizeName: papersize,
      MillName: millname,
      Unit: unit,
      OpeningStock: opstock,
      MultipleFactor: multiplefactor,
      STRSize_Code: STRSize_Code,
      SizeCode: SizeCode,
      CreatedBy: userId,
    };

    const url = isEditing
      ? "https://publication.microtechsolutions.net.in/php/PaperSizeupdate.php"
      : "https://publication.microtechsolutions.net.in/php/PaperSizepost.php";

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
        toast.success("PaperSize updated successfully!");
      } else {
        toast.success("PaperSize added successfully!");
      }
      setIsModalOpen(false);
      resetForm();
      fetchPaperSizes();
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
        accessorKey: "PaperSizeName",
        header: "Paper Size",
        size: 50,
      },

      {
        accessorKey: "MultipleFactor",
        header: "Multiple Factor",
        size: 50,
      },

      {
        accessorKey: "STRSize_Code",
        header: "Str Size Code",
        size: 50,
      },

      {
        accessorKey: "SizeCode",
        header: "Size code",
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
    [papersizes]
  );

  const table = useMaterialReactTable({
    columns,
    data: papersizes,
    muiTableHeadCellProps: {
      style: {
        backgroundColor: "#E9ECEF", // Replace with your desired color
        color: "black",
        fontSize: "16px",
      },
    },
  });

  return (
    <div className="papersize-container">
      <h1>PaperSize Master</h1>
      <div className="papersizetable-master">
        <div className="papersizetable1-master">
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

          <div className="papersizetable-container">
            <MaterialReactTable table={table} />
          </div>
        </div>
        {isModalOpen && (
          <div
            className="papersize-overlay"
            onClick={() => setIsModalOpen(false)}
          />
        )}

        <Modal open={isModalOpen}>
          <div className="papersize-modal">
            <h2
              style={{
                textAlign: "center",
                fontWeight: "620",
                margin: "2px",
                fontSize: "27px",
              }}>
              {editingIndex >= 0 ? "Edit Paper Size " : "Add Paper Size "}
            </h2>

            <form className="papersize-form">
              <div>
                <label className="papersize-label">
                  Paper Size <b className="required">*</b>
                </label>
                <div>
                  <Tooltip
                    title={
                      <span style={{ fontSize: "14px", fontWeight: "bold" }}>
                        {papersize}
                      </span>
                    }
                    arrow>
                    <input
                      type="text"
                      id="papersize"
                      name="papersize"
                      value={papersize}
                      onChange={(e) => setPapersize(e.target.value)}
                      maxLength={100}
                      ref={papersizeRef}
                      onKeyDown={(e) => handleKeyDown(e, millnameRef)}
                      className="papersize-control"
                      placeholder="Enter paper size"
                    />
                  </Tooltip>
                  <div>
                    {errors.papersize && (
                      <b className="error-text">{errors.papersize}</b>
                    )}
                  </div>
                </div>
              </div>

              <div>
                <label className="papersize-label">
                  Mill Name <b className="required">*</b>
                </label>
                <div>
                  <Tooltip
                    title={
                      <span style={{ fontSize: "14px", fontWeight: "bold" }}>
                        {millname}
                      </span>
                    }
                    arrow>
                    <input
                      type="text"
                      id="millname"
                      name="millname"
                      value={millname}
                      onChange={(e) => setMillname(e.target.value)}
                      maxLength={100}
                      ref={millnameRef}
                      onKeyDown={(e) => handleKeyDown(e, unitRef)}
                      className="papersize-control"
                      placeholder="Enter mill name"
                    />
                  </Tooltip>
                  <div>
                    {errors.millname && (
                      <b className="error-text">{errors.millname}</b>
                    )}
                  </div>
                </div>
              </div>
              <div>
                <label className="papersize-label">
                  Unit <b className="required">*</b>
                </label>
                <div>
                  <Tooltip
                    title={
                      <span style={{ fontSize: "14px", fontWeight: "bold" }}>
                        {unit}
                      </span>
                    }
                    arrow>
                    <input
                      type="text"
                      id="unit"
                      name="unit"
                      value={unit}
                      onChange={(e) => setUnit(e.target.value)}
                      maxLength={25}
                      ref={unitRef}
                      onKeyDown={(e) => handleKeyDown(e, opstockRef)}
                      className="papersize-control"
                      placeholder="Enter unit"
                    />
                  </Tooltip>

                  <div>
                    {errors.unit && <b className="error-text">{errors.unit}</b>}
                  </div>
                </div>
              </div>
              <div>
                <label className="papersize-label">
                  Opening stock <b className="required">*</b>
                </label>
                <div>
                  <input
                    type="number"
                    id="opstock"
                    name="opstock"
                    value={opstock}
                    onChange={(e) => {
                      const value = e.target.value;

                      // Regex to validate decimal numbers with at most 18 digits total and 2 decimal places
                      const regex = /^\d{0,18}(\.\d{0,2})?$/;

                      // Check if the value matches the regex
                      if (value === "" || regex.test(value)) {
                        setOpstock(value);
                      }
                    }}
                    ref={opstockRef}
                    onKeyDown={(e) => handleKeyDown(e, multfactorRef)}
                    className="papersize-control"
                    placeholder="Enter op stock"
                  />
                  <div>
                    {errors.opstock && (
                      <b className="error-text">{errors.opstock}</b>
                    )}
                  </div>
                </div>
              </div>

              <div>
                <label className="papersize-label">
                  Multiple Factor <b className="required">*</b>
                </label>

                <div>
                  <input
                    type="number"
                    id="multiplefactor"
                    name="multiplefactor"
                    value={multiplefactor}
                    onChange={(e) => setMultiplefactor(e.target.value)}
                    ref={multfactorRef}
                    onKeyDown={(e) => handleKeyDown(e, strsizecodeRef)}
                    className="papersize-control"
                    placeholder="Enter Multiple Factor"
                  />
                  <div>
                    {errors.multiplefactor && (
                      <b className="error-text">{errors.multiplefactor}</b>
                    )}
                  </div>
                </div>
              </div>

              <div>
                <label className="papersize-label">
                  STRSIZE_Code <b className="required">*</b>
                </label>

                <div>
                  <Tooltip
                    title={
                      <span style={{ fontSize: "14px", fontWeight: "bold" }}>
                        {STRSize_Code}
                      </span>
                    }
                    arrow>
                    <input
                      type="text"
                      id="STRSize_Code"
                      name="STRSize_Code"
                      value={STRSize_Code}
                      onChange={(e) => setSTRSize_Code(e.target.value)}
                      ref={strsizecodeRef}
                      onKeyDown={(e) => handleKeyDown(e, sizecodeRef)}
                      className="papersize-control"
                      placeholder="Enter STRSize_Code"
                    />
                  </Tooltip>
                  <div>
                    {errors.STRSize_Code && (
                      <b className="error-text">{errors.STRSize_Code}</b>
                    )}
                  </div>
                </div>
              </div>

              <div>
                <label className="papersize-label">
                  Size Code <b className="required">*</b>
                </label>

                <div>
                  <input
                    type="number"
                    id="SizeCode"
                    name="SizeCode"
                    value={SizeCode}
                    onChange={(e) => setSizeCode(e.target.value)}
                    ref={sizecodeRef}
                    onKeyDown={(e) => handleKeyDown(e, saveRef)}
                    className="papersize-control"
                    placeholder="Enter Size Code"
                  />
                  <div>
                    {errors.SizeCode && (
                      <b className="error-text">{errors.SizeCode}</b>
                    )}
                  </div>
                </div>
              </div>
            </form>

            <div className="papersize-btn-container">
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
              <u>Paper Size</u>
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

export default PaperSize;
