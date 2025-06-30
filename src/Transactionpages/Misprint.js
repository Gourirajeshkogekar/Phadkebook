import React, {
  useState,
  useMemo,
  useEffect,
  useSyncExternalStore,
} from "react";
import "./Misprint.css";
import Select from "react-select";
import axios from "axios";
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  Button,
  TextField,
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
  MaterialReactTable,
  useMaterialReactTable,
} from "material-react-table";
import { ToastContainer, toast } from "react-toastify";
import {
  Alert,
  useMediaQuery,
  Autocomplete,
  Drawer,
  Divider,
} from "@mui/material";
import "react-toastify/dist/ReactToastify.css";
import moment from "moment";
import qs from "qs";
import { useTheme } from "@mui/material/styles";
import { Edit, Delete, Add, MoreVert, Print } from "@mui/icons-material";
import CloseIcon from "@mui/icons-material/Close";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { DatePicker } from "@mui/x-date-pickers";
import { RiDeleteBin5Line } from "react-icons/ri";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";

function Misprint() {
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

    fetchMisprints();
  }, []);

  const [pageIndex, setPageIndex] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(false);

  const [anchorEl, setAnchorEl] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(null);
  const [selectedIndex, setSelectedIndex] = useState(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [deleteIndex, setDeleteIndex] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const [ChallanNo, setChallanNo] = useState(null);
  const [Date, setDate] = useState("");
  const [Particulars, setParticulars] = useState("");
  const [AccountId, setAccountId] = useState("");

  const [editingIndex, setEditingIndex] = useState(-1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [id, setId] = useState("");

  const [misprintdetailId, setMisprintdetailId] = useState("");
  const [errors, setErrors] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [misprints, setMisprints] = useState([]);
  const [misprintdetails, setMisprintdetails] = useState([]);

  const [bookCodes, setBookcodes] = useState([]);
  const [bookOptions, setBookOptions] = useState([]);
  const [accountOptions, setAccountOptions] = useState([]);
  const [rows, setRows] = useState([
    {
      SerialNo: "",

      BookId: "", // Default value for the first row
      Copies: 0,
      BookRate: 0,
      Amount: 0,
    },
  ]);

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
    fetchAccounts();
    fetchMisprintdetails();
  }, []);

  useEffect(() => {
    fetchMisprints();
    console.log("this function is called");
  }, [pageIndex]);

  const fetchMisprints = async () => {
    try {
      const response = await axios.get(
        `https://publication.microtechsolutions.net.in/php/get/gettblpage.php?Table=Missprint&PageNo=${pageIndex}`
      );
      console.log(response.data, "response of missprint header");

      setMisprints(response.data.data);
      setTotalPages(response.data.total_pages);
    } catch (error) {
      console.error("Error fetching convassor headers:", error);
    }
  };

  const fetchMisprintdetails = async () => {
    try {
      const response = await axios.get(
        "https://publication.microtechsolutions.net.in/php/get/gettable.php?Table=Missprintdetail"
      );
      console.log(response.data, "response of misprint details");
      setMisprintdetails(response.data);
    } catch (error) {
      console.error("Error fetching missprint details:", error);
    }
  };

  const fetchBooks = async () => {
    try {
      const response = await axios.get(
        "https://publication.microtechsolutions.net.in/php/Bookget.php"
      );
      const bookOptions = response.data.map((book) => ({
        value: book.Id,
        label: book.BookName || book.BookNameMarathi,
        code: book.BookCode,
      }));
      setBookOptions(bookOptions);
    } catch (error) {
      // toast.error("Error fetching books:", error);
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
    }
  };

  const handleInputChange = (index, field, value) => {
    const updatedRows = [...rows];

    // Update the value of the current field
    updatedRows[index][field] = value;

    // Calculate the Amount when Copies and Rate are entered
    if (field === "Copies" || field === "BookRate") {
      const copies = updatedRows[index].Copies || 0;
      const rate = updatedRows[index].BookRate || 0;
      updatedRows[index].Amount = copies * rate;
    }

    // Update the state with the new row data
    setRows(updatedRows);
  };

  const handleAddRow = () => {
    setRows([
      ...rows,
      {
        SerialNo: "",
        BookId: "", // Default value for the first row
        Copies: 0,
        BookRate: 0,
        Amount: 0,
      },
    ]);
  };

  const handleDeleteRow = (index) => {
    const updatedRows = rows.filter((_, i) => i !== index);
    setRows(updatedRows);
  };

  const handleDelete = () => {
    const row = currentRow;
    const index = row?.index;
    const Id = row?.original?.Id;

    console.log(Id, "id to delete");
    if (!Id) {
      toast.error("No Id found for delete");
      return;
    }
    setDeleteIndex(index);
    setDeleteId(Id);
    setIsDeleteDialogOpen(true);
    handleMenuClose();
  };

  const confirmDelete = () => {
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/x-www-form-urlencoded");

    // Prepare URL with dynamic parameters
    const url = `https://publication.microtechsolutions.net.in/php/deletetable.php?Id=${deleteId}&Table=Missprint`;

    const urlencoded = new URLSearchParams();
    urlencoded.append("Id", deleteId);
    urlencoded.append("Table", "Missprint");

    const requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: urlencoded,
      redirect: "follow",
    };

    // Send the request to the server with dynamic URL
    fetch(url, requestOptions)
      .then((response) => response.text()) // Handle the response
      .then((result) => {
        console.log(result);
        toast.success("Misprint Deleted Successfully"); // Show success toast
        setIsDeleteDialogOpen(false); // Close delete dialog
        fetchMisprints(); // Refresh vouchers list
      })
      .catch((error) => {
        console.error("Error:", error);
        // toast.error('Failed to delete Sales challan'); // Show error toast if it fails
      });
  };

  const cancelDelete = () => {
    setIsDeleteDialogOpen(false);
    setDeleteIndex(null);
  };

  const resetForm = () => {
    setAccountId("");
    setChallanNo("");
    setDate("");
    setParticulars("");
    setRows([
      {
        SerialNo: "",
        BookId: "", // Default value for the first row
        Copies: 0,
        BookRate: 0,
        Amount: 0,
      },
    ]);
  };

  const handleNewClick = () => {
    resetForm();
    setIsDrawerOpen(true);
    setIsEditing(false);
    setEditingIndex(-1);
  };

  const [idwiseData, setIdwiseData] = useState("");

  const handleEdit = () => {
    if (currentRow) {
      console.log("Editing item with ID:", currentRow.original.Id);
      setIdwiseData(currentRow.original.Id);
    }
    setIsLoading(true);

    console.log(currentRow, "row");
    const misprint = misprints[currentRow.index];

    // Filter purchase details to match the selected PurchaseId
    const misprintdetail = misprintdetails.filter(
      (detail) => detail.MissprintId === misprint.Id
    );

    // Map the details to rows
    // Convert date strings to DD-MM-YYYY format
    const convertDateForInput = (dateStr) => {
      if (typeof dateStr === "string" && dateStr.includes("-")) {
        const [year, month, day] = dateStr.split(" ")[0].split("-");
        return `${year}-${month}-${day}`;
      } else {
        console.error("Invalid date format:", dateStr);
        return ""; // Return an empty string or handle it as needed
      }
    };

    const mappedRows = misprintdetail.map((detail) => ({
      // PurchaseReturnId: detail.PurchaseReturnId,

      MissprintId: detail.MissprintId,
      // SerialNo:detail.SerialNo,
      BookId: detail.BookId,
      Copies: detail.Copies,
      BookRate: detail.BookRate,
      Amount: detail.Amount,
      Id: detail.Id, // Include the detail Id in the mapped row for tracking
    }));

    const date = convertDateForInput(misprint.Date?.date);

    // Set the form fields
    setChallanNo(misprint.ChallanNo);
    setDate(date);
    setParticulars(misprint.Particulars);
    setAccountId(misprint.AccountId);

    console.log(misprint, "misprint");
    console.log(misprintdetail, "misprint detail");
    console.log(mappedRows, "mapped rows");
    // Set the rows for the table with all the details
    setRows(mappedRows);

    // Set editing state
    setEditingIndex(currentRow.index);
    setIsDrawerOpen(true);
    setIsEditing(true);
    setId(misprint.Id);
    handleMenuClose();
    // Determine which specific detail to edit
    const specificDetail = misprintdetail.find(
      (detail) => detail.Id === currentRow.original.Id
    );
    if (specificDetail) {
      setMisprintdetailId(specificDetail.Id); // Set the specific detail Id
    }

    fetchMisprintdetails().then(() => {
      setIsLoading(false); // Stop loading after data is fetched
    });
  };

  const totalCopies = rows.reduce(
    (sum, row) => sum + (parseInt(row.Copies) || 0),
    0
  );

  const validateForm = () => {
    let formErrors = {};
    let isValid = true;

    setErrors(formErrors);
    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    const formattedDate = moment(Date).format("YYYY-MM-DD");

    const misprintData = {
      Id: isEditing ? id : "", // Include the Id for updating, null for new records
      ChallanNo: ChallanNo,
      Date: formattedDate, // Convert branch name to corresponding number
      Particulars: Particulars,
      AccountId: AccountId,
      Ttl_Copies: totalCopies,
      CreatedBy: !isEditing ? userId : undefined,
      UpdatedBy: isEditing ? userId : undefined,
    };

    try {
      const misprinturl = isEditing
        ? "https://publication.microtechsolutions.net.in/php/update/missprint.php"
        : "https://publication.microtechsolutions.net.in/php/post/missprint.php";

      // Submit purchase header data
      const response = await axios.post(
        misprinturl,
        qs.stringify(misprintData),
        {
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
        }
      );

      // const purchasereturnId = isEditing ? id : parseInt(response.data.newId, 10);
      const missprintId = isEditing ? id : parseInt(response.data.Id, 10);

      for (const row of rows) {
        const rowData = {
          MissprintId: missprintId,
          SerialNo: rows.indexOf(row) + 1,
          BookId: row.BookId,
          Copies: row.Copies,
          BookRate: row.BookRate,
          Amount: row.Amount,
          Id: row.Id,
          CreatedBy: row.Id ? undefined : userId,
          UpdatedBy: row.Id ? userId : undefined,
        };

        const misprintdetailurl =
          isEditing && row.Id
            ? "https://publication.microtechsolutions.net.in/php/update/missprintdetail.php"
            : "https://publication.microtechsolutions.net.in/php/post/missprintdetail.php";

        await axios.post(misprintdetailurl, qs.stringify(rowData), {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
        });
      }

      fetchMisprints();
      fetchMisprintdetails();
      setIsDrawerOpen(false);
      toast.success(
        isEditing
          ? "Misprint & Misprint Details updated successfully!"
          : "Misprint  & Misprint Details added successfully!"
      );
      resetForm(); // Reset the form fields after successful submission
    } catch (error) {
      console.error("Error saving record:", error);
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
        accessorKey: "ChallanNo",
        header: "Challan No",
        size: 50,
      },
      {
        accessorKey: "Particulars",
        header: "Particulars",
        size: 50,
      },

      {
        accessorKey: "actions",
        header: "Actions",
        size: 150,
        Cell: ({ row }) => (
          <IconButton onClick={(event) => handleMenuOpen(event, row)}>
            <MoreVert />
          </IconButton>
        ),
      },
    ],
    [] // Remove misprints if it's not used inside the function
  );

  const table = useMaterialReactTable({
    columns,
    data: misprints,
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
    <div className="misprint-container">
      <h1>Misprint</h1>

      <div className="misprinttable-master">
        <div className="misprinttable1-master">
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
          <div className="misprinttable-container">
            <Box mt={2}>
              <MaterialReactTable table={table} />
              <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleMenuClose}>
                <MenuItem onClick={handleEdit}>Edit</MenuItem>
                <MenuItem onClick={handleDelete}>Delete</MenuItem>

                {/* <MenuItem onClick={handlePrint}>Print</MenuItem>  */}
              </Menu>
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

        {isDrawerOpen && <div onClick={() => setIsDrawerOpen(false)} />}

        <Drawer
          anchor="right"
          open={isDrawerOpen}
          // onClose={handleDrawerClose}
          PaperProps={{
            sx: {
              borderRadius: isSmallScreen ? "0" : "10px 0 0 10px",
              width: isSmallScreen ? "100%" : "90%",
              zIndex: 1000,
              paddingLeft: "16px",
            },
          }}>
          {/* <div className="bankreconcil-modal"> */}
          <Box
            sx={{
              padding: 2,
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}>
            <Typography variant="h6">
              <b>{isEditing ? "Edit Misprint" : "Create Misprint "}</b>
            </Typography>{" "}
            <CloseIcon sx={{ cursor: "pointer" }} onClick={handleDrawerClose} />
          </Box>
          <form className="misprint-form">
            <div>
              <label className="misprint-label">Challan No:</label>
              <div>
                <input
                  type="text"
                  id="ChallanNo"
                  name="ChallanNo"
                  value={ChallanNo}
                  onChange={(e) => setChallanNo(e.target.value)}
                  className="misprint-control"
                  style={{ background: "#f5f5f5" }}
                  placeholder="Auto-Incremented"
                  readOnly
                />
              </div>

              {/* <div>
                          {errors.ChallanNo && <b className="error-text">{errors.ChallanNo}</b>}
                        </div> */}
            </div>
            <div>
              <label className="misprint-label">Date:</label>
              <div>
                <input
                  type="date"
                  id="Date"
                  name="Date"
                  value={Date}
                  onChange={(e) => setDate(e.target.value)}
                  className="misprint-control"
                  placeholder="Enter Date"
                />
              </div>

              {/* <div>
                          {errors.Date && <b className="error-text">{errors.Date}</b>}
                        </div> */}
            </div>

            <div>
              <label className="misprint-label">Particulars:</label>
              <div>
                <input
                  type="text"
                  id="Particulars"
                  name="Particulars"
                  value={Particulars}
                  onChange={(e) => setParticulars(e.target.value)}
                  className="misprint-control"
                  placeholder="Enter Particulars"
                />
              </div>

              {/* <div>
                          {errors.Particulars && <b className="error-text">{errors.Particulars}</b>}
                        </div> */}
            </div>

            <div>
              <label className="misprint-label">Account Id:</label>
              <div>
                <Autocomplete
                  options={accountOptions}
                  value={
                    accountOptions.find(
                      (option) => option.value === AccountId
                    ) || null
                  }
                  onChange={(event, newValue) =>
                    setAccountId(newValue ? newValue.value : null)
                  }
                  getOptionLabel={(option) => option.label} // Display only label in dropdown
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      placeholder="Select Acc id"
                      size="small"
                      margin="none"
                      fullWidth
                    />
                  )}
                  sx={{ mt: 1.25, mb: 0.625, width: 170 }} // Equivalent to 10px and 5px
                />
              </div>
              {/* <div>
                          {errors.AccountId && <b className="error-text">{errors.AccountId}</b>}
                        </div> */}
            </div>
          </form>

          <div className="misprint-table">
            <table>
              <thead>
                <tr>
                  <th>Serial No</th>
                  <th style={{ width: "80px", minWidth: "150px" }}>
                    Book Code
                  </th>
                  <th>
                    Book Name<b className="required">*</b>
                  </th>
                  <th>
                    Copies<b className="required">*</b>
                  </th>
                  <th>
                    Book Rate<b className="required">*</b>
                  </th>
                  <th>
                    Amount<b className="required">*</b>
                  </th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  <tr>
                    <td
                      colSpan="10"
                      style={{
                        textAlign: "center",
                        fontWeight: "bold",
                        padding: "10px",
                        color: "blue",
                      }}>
                      Loading data...
                    </td>
                  </tr>
                ) : rows.length === 0 ? ( // Check if rows is empty
                  <tr>
                    <td
                      colSpan="10"
                      style={{
                        textAlign: "center",
                        fontWeight: "bold",
                        padding: "10px",
                        color: "red",
                      }}>
                      No data available
                    </td>
                  </tr>
                ) : (
                  rows.map((row, index) => (
                    <tr key={index}>
                      <td>{index + 1}</td>
                      <td style={{ width: "80px", minWidth: "150px" }}>
                        {bookOptions.find(
                          (option) => option.value === row.BookId
                        )?.code || ""}
                      </td>
                      <td>
                        <Autocomplete
                          options={bookOptions}
                          value={
                            bookOptions.find(
                              (option) => option.value === row.BookId
                            ) || null
                          }
                          onChange={(event, newValue) =>
                            handleInputChange(
                              index,
                              "BookId",
                              newValue ? newValue.value : ""
                            )
                          }
                          sx={{ width: 250 }} // Set width
                          getOptionLabel={(option) => option.label}
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              placeholder="Select Book"
                              size="big"
                              fullWidth
                              sx={{
                                "& .MuiInputBase-root": {
                                  height: "50px",
                                  // width: "200px", // Adjust height here
                                },
                                "& .MuiInputBase-input": {
                                  padding: "14px", // Adjust padding for better alignment
                                },
                              }}
                            />
                          )}
                        />
                      </td>
                      <td>
                        <input
                          type="number"
                          value={row.Copies}
                          onChange={(e) =>
                            handleInputChange(index, "Copies", e.target.value)
                          }
                          style={{
                            width: "150px",
                          }}
                          placeholder="Copies"
                        />
                      </td>
                      <td>
                        <input
                          type="number"
                          value={row.BookRate}
                          onChange={(e) =>
                            handleInputChange(index, "BookRate", e.target.value)
                          }
                          style={{
                            width: "150px",
                          }}
                          placeholder="Book Rate"
                        />
                      </td>
                      <td>
                        <input
                          type="number"
                          value={row.Amount}
                          readOnly
                          style={{
                            width: "150px",
                          }}
                          placeholder="Amount"
                        />
                      </td>
                      <td>
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                          }}>
                          <Button
                            onClick={handleAddRow}
                            style={{
                              background: "#0a60bd",
                              color: "white",
                              marginRight: "5px",
                            }}>
                            Add
                          </Button>
                          <Button
                            onClick={() => handleDeleteRow(index)}
                            style={{ background: "red", color: "white" }}>
                            <RiDeleteBin5Line />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
              <tfoot>
                <tr>
                  <td colSpan={2}></td>
                  <td>
                    <b>Total Copies:</b>
                  </td>
                  <td colSpan={3}>
                    <strong>{totalCopies}</strong>
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>

          <div className="misprint-btn-container">
            <Button
              type="submit"
              onClick={handleSubmit}
              style={{
                background: "#0a60bd",
                color: "white",
              }}>
              {editingIndex >= 0 ? "Update" : "Save"}
            </Button>
            <Button
              onClick={() => setIsDrawerOpen(false)}
              style={{
                background: "red",
                color: "white",
              }}>
              Cancel
            </Button>
          </div>
        </Drawer>

        <Dialog open={isDeleteDialogOpen} onClose={cancelDelete}>
          <DialogTitle style={{ color: "navy", fontWeight: "600" }}>
            Confirm Deletion
          </DialogTitle>
          <DialogContent>
            Are you sure you want to delete this{" "}
            <b style={{ color: "red" }}>
              <u>Misprint</u>
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
export default Misprint;
