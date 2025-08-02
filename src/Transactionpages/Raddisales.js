import React, {
  useState,
  useMemo,
  useEffect,
  useSyncExternalStore,
} from "react";
import "./Raddisales.css";
import { useNavigate } from "react-router-dom";
import Select from "react-select";
import axios from "axios";
import { Button, TextField, Modal, setRef } from "@mui/material";
import {
  MaterialReactTable,
  useMaterialReactTable,
} from "material-react-table";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { RiDeleteBin5Line } from "react-icons/ri";
import { CiEdit } from "react-icons/ci";
import moment from "moment";
import qs from "qs";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  MenuItem,
  InputLabel,
  FormControl,
  Menu,
  FormControlLabel,
  RadioGroup,
  Radio,
} from "@mui/material";
import {
  Alert,
  useMediaQuery,
  Autocomplete,
  Drawer,
  Divider,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { useTheme } from "@mui/material/styles";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers";
import {
  Edit,
  Delete,
  Add,
  MoreVert,
  Print,
  Discount,
} from "@mui/icons-material";
import dayjs from "dayjs";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";

function Raddisales() {
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

    fetchRaddisales();
  }, []);

  const [pageIndex, setPageIndex] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [editingIndex, setEditingIndex] = useState(-1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [deleteIndex, setDeleteIndex] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const [DocNo, setDocNo] = useState(null);
  const [Date, setDate] = useState("");
  const [BookId, setBookId] = useState("");
  const [Rate, setRate] = useState("");
  const [number, setNumber] = useState("");

  const [raddisales, setRaddisales] = useState([]);

  const [id, setId] = useState("");

  const [errors, setErrors] = useState("");
  const [isEditing, setIsEditing] = useState(false);

  //Dropdown for ID's
  const [bookOptions, setBookOptions] = useState([]);
  const [anchorEl, setAnchorEl] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(null);
  const [selectedIndex, setSelectedIndex] = useState(null);

  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const handleDrawerOpen = () => {
    setIsDrawerOpen(true);
  };

  const handleDrawerClose = () => {
    setIsDrawerOpen(false);
  };

  const [currentRow, setCurrentRow] = useState(null);

  const handleMenuOpen = (event, row) => {
    setAnchorEl(event.currentTarget);
    setCurrentRow(row);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  useEffect(() => {
    fetchBooks();
  }, []);

  useEffect(() => {
    fetchRaddisales();
    console.log("this function is called");
  }, [pageIndex]);

  const fetchRaddisales = async () => {
    try {
      const response = await axios.get(
        `https://publication.microtechsolutions.net.in/php/get/gettblpage.php?Table=Raddisales&PageNo=${pageIndex}`
      );
      console.log(response.data, "response of raddi sales");

      setRaddisales(response.data.data);
      setTotalPages(response.data.total_pages);
    } catch (error) {
      console.error("Error fetching raddi sales:", error);
    }
  };

  const fetchBooks = async () => {
    try {
      const response = await axios.get(
        "https://publication.microtechsolutions.net.in/php/Bookget.php"
      );
      const bookOptions = response.data.map((book) => ({
        value: book.Id,
        label: book.BookName,
      }));
      setBookOptions(bookOptions);
    } catch (error) {
      // toast.error("Error fetching books:", error);
    }
  };

  const resetForm = () => {
    setDocNo("");
    setBookId("");
    setRate("");
    setNumber("");
    // setDate("");
    setsafedate(dayjs());
    setdateerror("");
  };

  const handleNewClick = () => {
    resetForm();
    setIsModalOpen(true);
    setIsEditing(false);
    setEditingIndex(-1);
  };

  const navigate = useNavigate("");

  const handlePrint = () => {
    navigate("/transaction/raddisales/raddisalesprint");
  };

  const handleEdit = (row) => {
    const raddisale = raddisales[row.index];

    const backendDate = raddisale.Date?.date;

    console.log(raddisale, "selected row of raddi sale");
    setDocNo(raddisale.DocNo);
    // setDate(formattedDate);
    setsafedate(dayjs(backendDate));
    setNumber(raddisale.Number);
    setRate(raddisale.Rate);
    setBookId(raddisale.BookId);

    setIsEditing(true);
    setEditingIndex(row.index);
    setIsModalOpen(true); // Ensure modal is opened after setting state
    setId(raddisale.Id);
  };

  const handleDelete = (index, Id) => {
    console.log(Id, "id to delete");

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
      `https://publication.microtechsolutions.net.in/php/deletetable.php?Id=${deleteId}&Table=RaddiSales`,
      requestOptions
    )
      .then((response) => response.text())
      .then((result) => console.log(result))
      .catch((error) => console.error(error));
    toast.success("Raddi sales Deleted Successfully");
    setIsDeleteDialogOpen(false);
    // setDeleteIndex(deleteIndex)
    fetchRaddisales();
  };

  const cancelDelete = () => {
    setIsDeleteDialogOpen(false);
    setDeleteIndex(null);
  };

  const [safedate, setsafedate] = useState(dayjs());
  const [dateerror, setdateerror] = useState("");

  const handleDateChange1 = (newValue) => {
    if (!newValue || !dayjs(newValue).isValid()) {
      setdateerror("Invalid date");
      setsafedate(null);
      return;
    }

    const today = dayjs();
    const minDate = today.subtract(3, "day");
    const maxDate = today.add(2, "day");

    if (newValue.isBefore(minDate) || newValue.isAfter(maxDate)) {
      setdateerror("You can select only 2 days before or after today");
    } else {
      setdateerror("");
    }

    setsafedate(newValue);
  };

  const validateForm = () => {
    let formErrors = {};
    let isValid = true;

    setErrors(formErrors);
    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    if (!safedate || !dayjs(safedate).isValid() || dateerror) {
      toast.error("Please correct all the date fields before submitting.");
      return;
    }

    const formattedDate = dayjs(safedate).format("YYYY-MM-DD");
    const data = {
      Date: formattedDate,
      BookId: BookId,
      Rate: Rate,
      Number: number,
      CreatedBy: !isEditing ? userId : undefined,
      UpdatedBy: isEditing ? userId : undefined,
    };

    // Determine the URL based on whether we're editing or adding
    const url = isEditing
      ? "https://publication.microtechsolutions.net.in/php/update/raddisales.php"
      : "https://publication.microtechsolutions.net.in/php/post/raddisales.php";

    // If editing, include the author ID in the payload
    if (isEditing) {
      data.Id = id;
      data.UpdatedBy = userId;
    }

    try {
      // console.log("Sending data to server:", data);
      const response = await axios.post(url, qs.stringify(data), {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      });
      // console.log("Server response:", response.data);

      if (isEditing) {
        toast.success("Raddi sales updated successfully!");
      } else {
        toast.success("Raddi sales added successfully!");
      }
      setIsModalOpen(false);
      resetForm();
      fetchRaddisales(); // Refresh the list after submit
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
        accessorKey: "DocNo",
        header: "Doc no",
        size: 50,
      },
      {
        accessorKey: "BookId",
        header: "Book Name",
        size: 50,
      },

      {
        accessorKey: "Rate",
        header: "Rate",
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
    [raddisales]
  );

  const table = useMaterialReactTable({
    columns,
    data: raddisales,
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
    <div className="raddisales-container">
      <h1>Raddi Sales</h1>

      <div className="raddisalestable-master">
        <div className="raddisalestable1-master">
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
          <div className="raddisalestable-container">
            <Box mt={2}>
              <MaterialReactTable table={table} />
              {/* <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleMenuClose}>
                <MenuItem onClick={handleEdit}>Edit</MenuItem>
                <MenuItem onClick={handleDelete}>Delete</MenuItem>

                <MenuItem onClick={handlePrint}>Print</MenuItem>
              </Menu> */}
            </Box>{" "}
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

        {isModalOpen && (
          <div
            className="raddisales-overlay"
            onClick={() => setIsModalOpen(false)}
          />
        )}

        <Modal open={isModalOpen}>
          <div className="raddisales-modal" onSubmit={handleSubmit}>
            <h2
              style={{
                textAlign: "center",
                fontWeight: "620",
                margin: "2px",
                fontSize: "27px",
              }}>
              {isEditing ? "Edit Raddi sales" : "Add Raddi sales"}
            </h2>

            <div className="raddisales-form">
              <div>
                <label className="raddisales-label">Doc No</label>
                <div>
                  <input
                    type="text"
                    id="DocNo"
                    name="DocNo"
                    value={DocNo}
                    onChange={(e) => setDocNo(e.target.value)}
                    style={{ background: "#f5f5f5" }}
                    className="bookprinting-control"
                    placeholder="Auto-Incremented"
                    readOnly
                  />
                </div>
              </div>

              <div>
                <label className="raddisales-label">Date</label>
                <div>
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DatePicker
                      value={safedate}
                      onChange={handleDateChange1}
                      format="DD-MM-YYYY"
                      slotProps={{
                        textField: {
                          size: "small",
                          fullWidth: true,
                          error: !!dateerror,
                          helperText: dateerror,
                        },
                      }}
                      sx={{
                        marginTop: "10px",
                        marginBottom: "5px",
                        width: "165px",
                      }}
                    />
                  </LocalizationProvider>
                </div>
              </div>

              <div>
                <label className="raddisales-label">Book</label>
                <div>
                  <Autocomplete
                    options={bookOptions}
                    value={
                      bookOptions.find((option) => option.value === BookId) ||
                      null
                    }
                    onChange={(event, newValue) =>
                      setBookId(newValue ? newValue.value : null)
                    }
                    getOptionLabel={(option) => option.label} // Display only label in dropdown
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        placeholder="Select Book id"
                        size="small"
                        margin="none"
                        fullWidth
                      />
                    )}
                    sx={{ mt: 1.25, mb: 0.625, width: 350 }}
                  />
                </div>
              </div>

              <div>
                <label className="raddisales-label">Rate</label>
                <div>
                  <input
                    type="number"
                    id="Rate"
                    name="Rate"
                    value={Rate}
                    onChange={(e) => setRate(e.target.value)}
                    // ref={accgroupcodeRef}
                    // onKeyDown={(e) => handleKeyDown(e, accgroupnameRef)}
                    placeholder="Enter Rate"
                    className="raddisales-control"
                  />
                </div>
              </div>

              <div>
                <label className="raddisales-label">Number</label>
                <div>
                  <input
                    type="number"
                    id="number"
                    name="number"
                    value={number}
                    onChange={(e) => setNumber(e.target.value)}
                    // ref={accgroupcodeRef}
                    // onKeyDown={(e) => handleKeyDown(e, accgroupnameRef)}
                    placeholder="Enter Number"
                    className="raddisales-control"
                  />
                </div>
              </div>
            </div>

            <div className="raddisales-btn-container">
              <Button
                onClick={handleSubmit}
                // ref={saveRef}
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
              <u>Raddi Sales</u>
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
export default Raddisales;
