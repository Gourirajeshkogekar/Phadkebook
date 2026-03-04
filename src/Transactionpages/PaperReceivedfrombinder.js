import React, { useState, useMemo, useEffect } from "react";
import "./Paperreceivedfrombinder.css";
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
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { DatePicker } from "@mui/x-date-pickers";
import { Edit, Delete, Add, MoreVert, Print } from "@mui/icons-material";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import { useRef } from "react";

function PaperReceivedfrombinder() {
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

    fetchPaperreceived();
  }, []);

  const [isLoading, setIsLoading] = useState(false);

  const [anchorEl, setAnchorEl] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(null);
  const [selectedIndex, setSelectedIndex] = useState(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [deleteIndex, setDeleteIndex] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const [pageIndex, setPageIndex] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const [InwardNo, setInwardno] = useState(null);
  const [InwardDate, setInwarddate] = useState("");
  const [AccountId, setAccountId] = useState("");
  const [Party_dcno, setPartydcNo] = useState("");
  const [DC_date, setDcdate] = useState("");
  const [GodownId, setGodownId] = useState("");

  const [StartingNo, setStartingNo] = useState("");
  const [EndingNo, setEndingNo] = useState("");
  const [accountOptions, setAccountOptions] = useState([]);
  const [godownOptions, setGodownOptions] = useState([]);

  const [rows, setRows] = useState([
    {
      PaperId: "",
      STRSize_Code: "",
      Quantity: "",
      Unit: "",
      Papers: "",
    },
  ]);

  const [editingIndex, setEditingIndex] = useState(-1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [id, setId] = useState("");

  const [paperdetailId, setPaperdetailId] = useState("");
  const [errors, setErrors] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [papers, setPapers] = useState([]);
  const [paperdetails, setPaperdetails] = useState([]);

  //Dropdown for ID's

  const [paperOptions, setPaperoptions] = useState([]);
  const [papercodeoptions, setPapercodeoptions] = useState([]);

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
    fetchPaperdetails();
    fetchPapersize();
    fetchAccounts();
    fetchGodowns();
  }, []);

  useEffect(() => {
    fetchPaperreceived();
    console.log("this function is called");
  }, [pageIndex]);

  const fetchPaperreceived = async () => {
    try {
      const response = await axios.get(
        `https://publication.microtechsolutions.net.in/php/get/gettblpage.php?Table=Paper_recevied_binder&PageNo=${pageIndex}`,
      );
      console.log(response.data, "response of convassor daily report");

      setPapers(response.data.data);
      setTotalPages(response.data.total_pages);
    } catch (error) {
      console.error("Error fetching paper received:", error);
    }
  };

  const fetchPaperdetails = async () => {
    try {
      const response = await axios.get(
        "https://publication.microtechsolutions.net.in/php/get/gettable.php?Table=Paper_recevied_binder_detail",
      );
      console.log(response.data, "response of paper details");
      setPaperdetails(response.data);
    } catch (error) {
      console.error("Error fetching convassor daily details:", error);
    }
  };

  const fetchPapersize = async () => {
    try {
      const response = await axios.get(
        "https://publication.microtechsolutions.net.in/php/Papersizeget.php",
      );
      const paperOptions = response.data.map((pp) => ({
        value: pp.Id,
        label: pp.PaperSizeName,
        code: pp.STRSize_Code,
        unit: pp.Unit || "",
      }));
      setPaperoptions(paperOptions);
    } catch (error) {
      // toast.error("Error fetching Papers:", error);
    }
  };

  const fetchAccounts = async () => {
    try {
      const response = await axios.get(
        "https://publication.microtechsolutions.net.in/php/Accountget.php",
      );
      const accountOptions = response.data.map((acc) => ({
        value: acc.Id,
        label: acc.AccountName,
      }));
      setAccountOptions(accountOptions);
    } catch (error) {
      // toast.error("Error fetching parties:", error);
    }
  };

  const fetchGodowns = async () => {
    try {
      const response = await axios.get(
        "https://publication.microtechsolutions.net.in/php/Godownget.php",
      );
      const godownOptions = response.data.map((godown) => ({
        value: godown.Id,
        label: godown.GodownName,
      }));
      setGodownOptions(godownOptions);
    } catch (error) {
      // toast.error("Error fetching godowns:", error);
    }
  };

  const [inwarddate, setinwarddate] = useState(dayjs());
  const [dateerror, setdateerror] = useState("");

  const [dcdate, setdcdate] = useState(dayjs());
  const [dcdateerror, setdcdateerror] = useState("");

  const handleDateChange1 = (newValue) => {
    if (!newValue || !dayjs(newValue).isValid()) {
      setdateerror("Invalid date");
      setinwarddate(null);
      return;
    }

    // const today = dayjs();
    // const minDate = today.subtract(3, "day");
    // const maxDate = today.add(2, "day");

    // if (newValue.isBefore(minDate) || newValue.isAfter(maxDate)) {
    //   setdateerror("You can select only 2 days before or after today");
    // } else {
    //   setdateerror("");
    // }

    setdateerror("");

    setinwarddate(dayjs(newValue));
  };

  const handleDateChange2 = (newValue) => {
    if (!newValue || !dayjs(newValue).isValid()) {
      setdcdateerror("Invalid date");
      setdcdate(null);
      return;
    }

    // const today = dayjs();
    // const minDate = today.subtract(3, "day");
    // const maxDate = today.add(2, "day");

    // if (newValue.isBefore(minDate) || newValue.isAfter(maxDate)) {
    //   setdcdateerror("You can select only 2 days before or after today");
    // } else {
    //   setdcdateerror("");
    // }
    setdcdateerror("");
    setdcdate(dayjs(newValue));
  };

  const handleInputChange = (index, field, value) => {
    const updatedRows = [...rows];

    // Update the value of the current field
    updatedRows[index][field] = value;

    // Update the state with the new row data
    setRows(updatedRows);
  };

  const handleAddRow = () => {
    setRows([
      ...rows,
      {
        PaperId: "",
        STRSize_Code: "",
        Quantity: "",
        Unit: "",
        Papers: "",
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
    const url = `https://publication.microtechsolutions.net.in/php/deletetable.php?Id=${deleteId}&Table=Paper_recevied_binder`;

    const urlencoded = new URLSearchParams();
    urlencoded.append("Id", deleteId);
    urlencoded.append("Table", "Paper_recevied_binder");

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
        toast.success("Paper received from binder Deleted Successfully"); // Show success toast
        setIsDeleteDialogOpen(false); // Close delete dialog
        fetchPaperreceived(); // Refresh vouchers list
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
    // setInwarddate("");
    setinwarddate(dayjs());
    setdateerror("");
    setInwardno("");
    setPartydcNo("");
    // setDcdate("");
    setdcdate(dayjs());
    setdcdateerror("");
    setAccountId("");
    setGodownId("");
    setStartingNo("");
    setEndingNo("");

    setRows([
      {
        PaperId: "",
        Quantity: "",
        Unit: "",
        Papers: "",
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
    const paperreceivedheader = papers[currentRow.index];

    // Filter purchase details to match the selected PurchaseId
    const paperreceiveddetail = paperdetails.filter(
      (detail) => detail.PaperBinderRecevidId === paperreceivedheader.Id,
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

    let mappedRows = paperreceiveddetail.map((detail) => ({
      // PurchaseReturnId: detail.PurchaseReturnId,

      PaperBinderRecevidId: detail.PaperBinderRecevidId,
      // SerialNo:detail.SerialNo,
      STRSize_Code: detail.STRSize_Code,
      PaperId: detail.PaperId,
      Quantity: detail.Quantity,
      Unit: detail.Unit,
      Papers: detail.Papers,

      Id: detail.Id, // Include the detail Id in the mapped row for tracking
    }));

    // ⭐ No API call needed — match from local bookOptions
    mappedRows = mappedRows.map((row) => {
      const paper = paperOptions.find((b) => b.value === row.PaperId);

      return {
        ...row,
        STRSize_Code: paper?.code || "",
        PaperSizeName: paper?.label || "",
        Unit: row.Unit || "",
        Papers: row.Papers || "",
      };
    });

    const date = dayjs(paperreceivedheader.Date?.date);
    const dcdate = dayjs(paperreceivedheader.DC_date?.date);

    // Set the form fields
    setInwardno(paperreceivedheader.InwardNo);
    setinwarddate(date);
    setAccountId(paperreceivedheader.AccountId);
    setPartydcNo(paperreceivedheader.Party_dcno);
    setdcdate(dcdate);
    setGodownId(paperreceivedheader.GodownId);
    setStartingNo(paperreceivedheader.StartingNo);
    setEndingNo(paperreceivedheader.EndingNo);

    console.log(paperreceivedheader, "paperreceivedheader");
    console.log(paperreceiveddetail, "paperreceived detail");
    console.log(mappedRows, "mapped rows");
    // Set the rows for the table with all the details
    setRows(mappedRows);

    // Set editing state
    setEditingIndex(currentRow.index);
    setIsDrawerOpen(true);
    setIsEditing(true);
    setId(paperreceivedheader.Id);
    handleMenuClose();
    // Determine which specific detail to edit
    const specificDetail = paperreceiveddetail.find(
      (detail) => detail.Id === currentRow.original.Id,
    );
    if (specificDetail) {
      setPaperdetailId(specificDetail.Id); // Set the specific detail Id
    }

    fetchPaperdetails().then(() => {
      setIsLoading(false); // Stop loading after data is fetched
    });
  };

  const handlePaperNameChange = (index, paperId) => {
    const selectedPaper = paperOptions.find((p) => p.value === Number(paperId));

    if (!selectedPaper) return;

    const updatedRows = [...rows];
    updatedRows[index] = {
      ...updatedRows[index],
      PaperId: selectedPaper.value,
      STRSize_Code: selectedPaper.code,
      Unit: selectedPaper.unit,
      // Papers: selectedPaper.label,
    };
    setRows(updatedRows);
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

    if (
      !inwarddate ||
      !dayjs(inwarddate).isValid() ||
      dateerror ||
      !dcdate ||
      !dayjs(dcdate).isValid() ||
      dcdateerror
    ) {
      toast.error("Please correct all the date fields before submitting.");
      return;
    }

    const formatteddate = dayjs(inwarddate).format("YYYY-MM-DD");
    const formatteddcdate = dayjs(dcdate).format("YYYY-MM-DD");

    const paperreceiveddata = {
      Id: isEditing ? id : "", // Include the Id for updating, null for new records
      Date: formatteddate,
      AccountId: AccountId,
      Party_dcno: Party_dcno,
      DC_date: formatteddcdate,
      GodownId: GodownId,
      StartingNo: StartingNo,
      EndingNo: EndingNo,

      CreatedBy: !isEditing ? userId : undefined,
      UpdatedBy: isEditing ? userId : undefined,
    };

    try {
      const paperreceivedurl = isEditing
        ? "https://publication.microtechsolutions.net.in/php/update/paperreceviedbinder.php"
        : "https://publication.microtechsolutions.net.in/php/post/paperreceviedbinder.php";

      // Submit purchase header data
      const response = await axios.post(
        paperreceivedurl,
        qs.stringify(paperreceiveddata),
        {
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
        },
      );

      // const purchasereturnId = isEditing ? id : parseInt(response.data.newId, 10);
      const paperBinderRecevidId = isEditing
        ? id
        : parseInt(response.data.Id, 10);

      for (const row of rows) {
        const rowData = {
          PaperBinderRecevidId: paperBinderRecevidId,
          SerialNo: rows.indexOf(row) + 1,
          PaperId: row.PaperId,
          Quantity: row.Quantity,
          Unit: row.Unit, // ✅ FIX HERE
          Papers: row.Papers,
          STRSize_Code: row.STRSize_Code,
          Id: row.Id,
          CreatedBy: row.Id ? undefined : userId,
          UpdatedBy: row.Id ? userId : undefined,
        };

        const paperreceiveddetailurl =
          isEditing && row.Id
            ? "https://publication.microtechsolutions.net.in/php/update/paperreceviedbinderdetail.php"
            : "https://publication.microtechsolutions.net.in/php/post/paperreceviedbinderdetail.php";

        await axios.post(paperreceiveddetailurl, qs.stringify(rowData), {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
        });
      }

      fetchPaperreceived();
      fetchPaperdetails();
      setIsDrawerOpen(false);
      toast.success(
        isEditing
          ? "Paper Received & Paper Received Details updated successfully!"
          : "Paper Received & Paper Received Details added successfully!",
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
        accessorKey: "InwardNo",
        header: "Inward No",
        size: 50,
      },

      {
        accessorKey: "Date.date",
        header: "Date",
        size: 50,
        Cell: ({ cell }) => {
          // Using moment.js to format the date
          const date = moment(cell.getValue()).format("DD-MM-YYYY");
          return <span>{date}</span>;
        },
      },

      {
        accessorKey: "actions",
        header: "Actions",
        size: 150,
        Cell: ({ row }) => (
          <div>
            <IconButton
              onClick={(event) => handleMenuOpen(event, row)} // Open the menu on click
            >
              <MoreVert />
            </IconButton>
          </div>
        ),
      },
    ],
    [papers],
  );

  const table = useMaterialReactTable({
    columns,
    data: papers,
    enablePagination: false,
    muiTableHeadCellProps: {
      style: {
        backgroundColor: "#E9ECEF",
        color: "black",
        fontSize: "16px",
      },
    },
  });

  return (
    <div className="paperreceivedfrombinder-container">
      <h1>Paper Received From Binder</h1>

      <div className="paperreceivedfrombindertable-master">
        <div className="paperreceivedfrombindertable1-master">
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
          <div className="paperreceivedfrombindertable-container">
            <Box mt={2}>
              <MaterialReactTable table={table} />
              <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleMenuClose}>
                <MenuItem onClick={handleEdit}>Edit</MenuItem>
                <MenuItem onClick={handleDelete}>Delete</MenuItem>
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

        <Drawer
          anchor="right"
          open={isDrawerOpen}
          // onClose={handleDrawerClose}
          PaperProps={{
            sx: {
              borderRadius: isSmallScreen ? "0" : "10px 0 0 10px",
              width: isSmallScreen ? "100%" : "75%",
              zIndex: 1000,
              paddingLeft: "16px",
            },
          }}>
          <Box
            sx={{
              padding: 2,
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}>
            <Typography variant="h6">
              <b>
                {isEditing
                  ? "Edit Paper Received From Binder"
                  : "Create Paper Received From Binder"}
              </b>
            </Typography>{" "}
            <CloseIcon sx={{ cursor: "pointer" }} onClick={handleDrawerClose} />
          </Box>
          {/* <Divider
sx={{
width: '1000px',
borderColor: 'navy', 
borderWidth: 1, 

}}
/> */}

          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: 2,
              m: 1,
              mt: 3,
            }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              <Box>
                <Typography variant="body2" fontWeight="bold">
                  Inward No
                </Typography>

                <Box>
                  <TextField
                    value={InwardNo}
                    onChange={(e) => setInwardno(e.target.value)}
                    size="small"
                    margin="none"
                    placeholder="Auto-Incremented"
                    fullWidth
                    InputProps={{
                      readOnly: true, // Makes the field readonly
                    }}
                    sx={{
                      backgroundColor: "#f5f5f5", // Light gray background
                      "& .MuiInputBase-root": {
                        backgroundColor: "#f5f5f5", // Ensures input background color
                      },
                    }}
                  />
                </Box>
              </Box>

              <Box flex={1}>
                <Typography variant="body2" fontWeight="bold">
                  {" "}
                  Date
                </Typography>
                <div>
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DatePicker
                      value={inwarddate}
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
              </Box>

              <Box flex={1}>
                <Typography variant="body2" fontWeight="bold">
                  Party's DC No
                </Typography>
                <TextField
                  value={Party_dcno}
                  onChange={(e) => setPartydcNo(e.target.value)}
                  size="small"
                  margin="none"
                  placeholder="DC No"
                  fullWidth
                />
              </Box>

              <Box flex={1}>
                <Typography variant="body2" fontWeight="bold">
                  DC Date
                </Typography>
                <div>
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DatePicker
                      value={dcdate}
                      onChange={handleDateChange2}
                      format="DD-MM-YYYY"
                      slotProps={{
                        textField: {
                          size: "small",
                          fullWidth: true,
                          error: !!dcdateerror,
                          helperText: dcdateerror,
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
              </Box>
            </Box>

            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              <Box flex={1}>
                <Typography fontWeight="bold" variant="body2">
                  Party Name
                </Typography>
                <Autocomplete
                  options={accountOptions}
                  value={
                    accountOptions.find(
                      (option) => option.value === AccountId,
                    ) || null
                  }
                  onChange={(event, newValue) =>
                    setAccountId(newValue ? newValue.value : null)
                  }
                  getOptionLabel={(option) => option.label} // Display only label in dropdown
                  sx={{ width: "500" }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      placeholder="Select Party Name"
                      size="small"
                      margin="none"
                      fullWidth
                    />
                  )}
                />
              </Box>

              <Box flex={1}>
                <Typography fontWeight="bold" variant="body2">
                  Godown
                </Typography>
                <Autocomplete
                  options={godownOptions}
                  value={
                    godownOptions.find((option) => option.value === GodownId) ||
                    null
                  }
                  onChange={(event, newValue) =>
                    setGodownId(newValue ? newValue.value : null)
                  }
                  getOptionLabel={(option) => option.label} // Display only label in dropdown
                  sx={{ width: "500" }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      placeholder="Select Godown"
                      size="small"
                      margin="none"
                      fullWidth
                    />
                  )}
                />
              </Box>
            </Box>

            <div className="paperreceivedfrombinder-table">
              <table>
                <thead>
                  <tr>
                    <th>Serial No</th>
                    <th>Paper Code</th>

                    <th>Paper Name</th>
                    <th>Quantity</th>
                    <th>Unit</th>
                    <th>Papers</th>

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
                        <td>
                          <input
                            type="text"
                            value={row.STRSize_Code || ""}
                            readOnly
                            placeholder="Paper Code"
                            style={{ width: "100px" }}
                            className="paperout-control"
                          />
                        </td>

                        <td style={{ width: "400px" }}>
                          <Autocomplete
                            options={paperOptions}
                            getOptionLabel={(option) => option.label || ""}
                            value={
                              paperOptions.find(
                                (p) => p.value === row.PaperId,
                              ) || null
                            }
                            onChange={(event, newValue) => {
                              handlePaperNameChange(
                                index,
                                newValue ? newValue.value : "",
                              );
                            }}
                            renderInput={(params) => (
                              <TextField
                                {...params}
                                placeholder="Select Paper Name"
                                size="small"
                              />
                            )}
                            isOptionEqualToValue={(option, value) =>
                              option.value === value.value
                            }
                          />
                        </td>

                        <td>
                          <input
                            type="number"
                            value={row.Quantity || ""}
                            onChange={(e) =>
                              handleInputChange(
                                index,
                                "Quantity",
                                e.target.value,
                              )
                            }
                            style={{ width: "70px" }}
                            className="paperout-control"
                          />
                        </td>

                        <td>
                          <input
                            type="text"
                            value={row.Unit || ""}
                            readOnly
                            style={{ width: "70px" }}
                            className="paperout-control"
                          />
                        </td>
                        <td>
                          <input
                            type="number"
                            value={row.Papers || ""}
                            onChange={(e) =>
                              handleInputChange(index, "Papers", e.target.value)
                            }
                            style={{ width: "70px" }}
                            className="paperout-control"
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
              </table>
            </div>
          </Box>

          <Box
            display={"flex"}
            alignItems={"center"}
            justifyContent={"center"}
            gap={1}
            m={1}>
            <Button
              variant="contained"
              onClick={handleSubmit}
              sx={{
                backgroundColor: "#0a60bd",
                color: "white",
                "&:hover": {
                  backgroundColor: "navy", // Darker shade on hover (optional)
                },
              }}>
              {isEditing ? "Update" : "Save"}
            </Button>

            <Box>
              <Button
                onClick={handleDrawerClose}
                variant="contained" // Use 'contained' to apply background color styles
                sx={{
                  backgroundColor: "red", // Set background color to red
                  color: "white", // Optional: text color inside the button
                  "&:hover": {
                    backgroundColor: "darkred", // Darker shade on hover (optional)
                  },
                }}>
                Cancel
              </Button>
            </Box>
          </Box>
        </Drawer>

        <Dialog open={isDeleteDialogOpen} onClose={cancelDelete}>
          <DialogTitle style={{ color: "navy", fontWeight: "600" }}>
            Confirm Deletion
          </DialogTitle>
          <DialogContent>
            Are you sure you want to delete this{" "}
            <b style={{ color: "red" }}>
              <u>Paper received from binder</u>
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

export default PaperReceivedfrombinder;
