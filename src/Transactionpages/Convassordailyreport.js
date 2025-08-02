import React, {
  useState,
  useMemo,
  useEffect,
  useSyncExternalStore,
} from "react";
import "./Convassordailyreport.css";
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
import { Edit, Delete, Add, MoreVert, Print, Bed } from "@mui/icons-material";
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
import dayjs from "dayjs";

import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers";

function Convassordailyreport() {
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

    fetchConvassordailyreports();
  }, []);

  const [pageIndex, setPageIndex] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [ReportDate, setReportdate] = useState("");
  const [ReportNo, setReportNo] = useState(null);
  const [FeedingDate, setFeedingdate] = useState("");
  const [ConvassorId, setConvassorid] = useState("");
  const [convassorOptions, setConvassorOptions] = useState([]);
  const [Place_to_visit, setPlacetovisit] = useState("");
  const [HSC, setHSC] = useState("");
  const [JrCollege, setJrcollege] = useState("");
  const [SrCollege, setSrcollege] = useState("");
  const [Classes, setClasses] = useState("");
  const [BS, setBS] = useState("");
  const [DEd, setDEd] = useState("");
  const [BEd, setBEd] = useState("");
  const [Other, setOther] = useState("");
  const [Particulars, setParticulars] = useState("");
  const [Ttl_amount, setTtl_amount] = useState("");
  const [editingIndex, setEditingIndex] = useState(-1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [id, setId] = useState("");
  const [accountOptions, setAccountOptions] = useState([]);
  const [convassordailyreportdetailId, setConvassordailyreportdetailId] =
    useState("");
  const [errors, setErrors] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [convassordailyreports, setconvassordailyreports] = useState([]);
  const [convassordailyreportdetails, setConvassordailyreportdetails] =
    useState([]);

  const [anchorEl, setAnchorEl] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(null);
  const [selectedIndex, setSelectedIndex] = useState(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [deleteIndex, setDeleteIndex] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
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

  const [rows, setRows] = useState([
    {
      AccountId: "",
      Particulars: "",
      Amount: 0,
    },
  ]);

  useEffect(() => {
    fetchConvassordailydetails();
    fetchConvassors();
    fetchAccounts();
  }, []);

  useEffect(() => {
    fetchConvassordailyreports();
    console.log("this function is called");
  }, [pageIndex]);

  const fetchConvassordailyreports = async () => {
    try {
      const response = await axios.get(
        `https://publication.microtechsolutions.net.in/php/get/gettblpage.php?Table=CanvassorDailyReport&PageNo=${pageIndex}`
      );
      console.log(response.data, "response of convassor daily report");

      setconvassordailyreports(response.data.data);
      setTotalPages(response.data.total_pages);
    } catch (error) {
      console.error("Error fetching convassor daily reports:", error);
    }
  };

  const fetchConvassordailydetails = async () => {
    try {
      const response = await axios.get(
        "https://publication.microtechsolutions.net.in/php/get/gettable.php?Table=CanvassorDailyReportDetail"
      );
      console.log(response.data, "response of convassor daily details");
      setConvassordailyreportdetails(response.data);
    } catch (error) {
      console.error("Error fetching convassor daily details:", error);
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
      // toast.error("Error fetching books:", error);
    }
  };

  const fetchConvassors = async () => {
    try {
      const response = await axios.get(
        "https://publication.microtechsolutions.net.in/php/AssignCanvassorget.php"
      );
      const convOptions = response.data.map((conv) => ({
        value: conv.Id,
        label: conv.CanvassorName,
      }));
      setConvassorOptions(convOptions);
    } catch (error) {
      // toast.error("Error fetching books:", error);
    }
  };

  const [reportdate, setreportdate] = useState(dayjs());
  const [reporterror, setReporterror] = useState("");

  const [feedingdate, setfeedingdate] = useState(dayjs());
  const [feedingerror, setfeedingerror] = useState("");

  const handleDateChange1 = (newValue) => {
    if (!newValue || !dayjs(newValue).isValid()) {
      setReporterror("Invalid date");
      setreportdate(null);
      return;
    }

    const today = dayjs();
    const minDate = today.subtract(3, "day");
    const maxDate = today.add(2, "day");

    if (newValue.isBefore(minDate) || newValue.isAfter(maxDate)) {
      setReporterror("You can select only 2 days before or after today");
    } else {
      setReporterror("");
    }

    setreportdate(newValue);
  };

  const handleDateChange2 = (newValue) => {
    if (!newValue || !dayjs(newValue).isValid()) {
      setfeedingerror("Invalid date");
      setfeedingdate(null);
      return;
    }

    const today = dayjs();
    const minDate = today.subtract(3, "day");
    const maxDate = today.add(2, "day");

    if (newValue.isBefore(minDate) || newValue.isAfter(maxDate)) {
      setfeedingerror("You can select only 2 days before or after today");
    } else {
      setfeedingerror("");
    }

    setfeedingdate(newValue);
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
        AccountId: "",
        Particulars: "",
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
    const url = `https://publication.microtechsolutions.net.in/php/deletetable.php?Id=${deleteId}&Table=CanvassorDailyReport`;

    const urlencoded = new URLSearchParams();
    urlencoded.append("Id", deleteId);
    urlencoded.append("Table", "CanvassorDailyReport");

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
        toast.success("Canvassor Daily report Deleted Successfully"); // Show success toast
        setIsDeleteDialogOpen(false); // Close delete dialog
        fetchConvassordailyreports(); // Refresh vouchers list
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
    setReportNo("");
    // setReportdate("");
    setreportdate(dayjs());
    setReporterror("");
    // setFeedingdate("");
    setfeedingdate(dayjs());
    setfeedingerror("");
    setConvassorid("");
    setPlacetovisit("");
    setHSC("");
    setJrcollege("");
    setSrcollege("");
    setClasses("");
    setBS("");
    setDEd("");
    setBEd("");
    setOther("");
    setParticulars("");
    setTtl_amount("");
    setRows([
      {
        AccountId: "",
        Particulars: "",
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

  const [isLoading, setIsLoading] = useState(false);

  const [idwiseData, setIdwiseData] = useState("");

  const handleEdit = () => {
    if (currentRow) {
      console.log("Editing item with ID:", currentRow.original.Id);
      setIdwiseData(currentRow.original.Id);
    }

    console.log(currentRow, "row");
    const convdailyreport = convassordailyreports[currentRow.index];

    // Filter purchase details to match the selected PurchaseId
    const convassordailydetail = convassordailyreportdetails.filter(
      (detail) => detail.CanvassorDailyReportId === convdailyreport.Id
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

    const mappedRows = convassordailydetail.map((detail) => ({
      // PurchaseReturnId: detail.PurchaseReturnId,

      CanvassorDailyReportId: detail.CanvassorDailyReportId,
      // SerialNo:detail.SerialNo,
      AccountId: detail.AccountId,
      Particulars: detail.Particulars,
      Amount: detail.Amount,
      Id: detail.Id, // Include the detail Id in the mapped row for tracking
    }));

    const reportdate = dayjs(convdailyreport.ReportDate?.date);
    const feedingdate = dayjs(convdailyreport.FeedingDate?.date);

    // Set the form fields
    setReportNo(convdailyreport.ReportNo);
    // setReportdate(reportdate);
    setreportdate(reportdate);
    // setFeedingdate(feedingdate);
    setfeedingdate(feedingdate);
    setConvassorid(convdailyreport.CanvassorId);
    setPlacetovisit(convdailyreport.Place_to_visit);
    setHSC(convdailyreport.HSC);
    setJrcollege(convdailyreport.JrCollege);
    setSrcollege(convdailyreport.SrCollege);
    setClasses(convdailyreport.Classes);
    setBS(convdailyreport.BS);
    setDEd(convdailyreport.DEd);
    setBEd(convdailyreport.BEd);
    setOther(convdailyreport.Other);
    setParticulars(convdailyreport.Particulars);
    setTtl_amount(convdailyreport.Ttl_amount);

    console.log(convdailyreport, "convdailyreport");
    console.log(convassordailydetail, "convdailyreport detail");
    console.log(mappedRows, "mapped rows");
    // Set the rows for the table with all the details
    setRows(mappedRows);

    // Set editing state
    setEditingIndex(currentRow.index);
    setIsDrawerOpen(true);
    setIsEditing(true);
    setId(convdailyreport.Id);
    handleMenuClose();
    // Determine which specific detail to edit
    const specificDetail = convassordailydetail.find(
      (detail) => detail.Id === currentRow.original.Id
    );
    if (specificDetail) {
      setConvassordailyreportdetailId(specificDetail.Id); // Set the specific detail Id
    }

    fetchConvassordailydetails();
  };

  useEffect(() => {
    const total = rows
      .reduce((sum, row) => sum + Number(row.Amount || 0), 0)
      .toFixed(2);
    setTtl_amount(total);
  }, [rows]);

  const validateForm = () => {
    let formErrors = {};
    let isValid = true;

    if (!ConvassorId) {
      isValid = false;
      formErrors.ConvassorId = "Convassor is required";
    }

    setErrors(formErrors);
    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    if (
      !reportdate ||
      !dayjs(reportdate).isValid() ||
      reporterror ||
      !feedingdate ||
      !dayjs(feedingdate).isValid() ||
      feedingerror
    ) {
      toast.error("Please correct all the date fields before submitting.");
      return;
    }

    const formattedfeedingdate = dayjs(feedingdate).format("YYYY-MM-DD");
    const formattedreportdate = dayjs(reportdate).format("YYYY-MM-DD");

    const convdailyreportdata = {
      Id: isEditing ? id : "", // Include the Id for updating, null for new records
      ReportDate: formattedreportdate,
      FeedingDate: formattedfeedingdate,
      CanvassorId: ConvassorId,
      Place_to_visit: Place_to_visit,
      HSC: HSC,
      JrCollege: JrCollege,
      SrCollege: SrCollege,
      Classes: Classes,
      BS: BS,
      DEd: DEd,
      BEd: BEd,
      Other: Other,
      Particulars: Particulars,
      Ttl_amount: Ttl_amount,

      CreatedBy: !isEditing ? userId : undefined,
      UpdatedBy: isEditing ? userId : undefined,
    };

    try {
      const convdailyreporturl = isEditing
        ? "https://publication.microtechsolutions.net.in/php/update/canvassordailyreport.php"
        : "https://publication.microtechsolutions.net.in/php/post/canvassordailyreport.php";

      // Submit purchase header data
      const response = await axios.post(
        convdailyreporturl,
        qs.stringify(convdailyreportdata),
        {
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
        }
      );

      // const purchasereturnId = isEditing ? id : parseInt(response.data.newId, 10);
      const canvassorDailyReportId = isEditing
        ? id
        : parseInt(response.data.Id, 10);

      for (const row of rows) {
        const rowData = {
          CanvassorDailyReportId: canvassorDailyReportId,
          SerialNo: rows.indexOf(row) + 1,
          AccountId: row.AccountId,
          Particulars: row.Particulars,
          Amount: row.Amount,

          Id: row.Id,
          CreatedBy: row.Id ? undefined : userId,
          UpdatedBy: row.Id ? userId : undefined,
        };

        const convassordailydetailurl =
          isEditing && row.Id
            ? "https://publication.microtechsolutions.net.in/php/update/canvassordailyreportdetail.php"
            : "https://publication.microtechsolutions.net.in/php/post/canvassordailyreportdetail.php";

        await axios.post(convassordailydetailurl, qs.stringify(rowData), {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
        });
      }

      fetchConvassordailyreports();
      fetchConvassordailydetails();
      setIsDrawerOpen(false);
      toast.success(
        isEditing
          ? "Convassor daily report & Convassor daily report Details updated successfully!"
          : "Convassor daily report & Convassor daily report Details added successfully!"
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
        accessorKey: "ReportDate.date",
        header: "Report Date",
        size: 50,
        Cell: ({ row }) => {
          const date = row.original.ReportDate?.date;
          return date ? new Date(date).toLocaleDateString("en-GB") : "-";
        },
      },

      {
        accessorKey: "ReportNo",
        header: "Report No",
        size: 50,
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
    [convassordailyreports]
  );

  const table = useMaterialReactTable({
    columns,
    data: convassordailyreports,
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
    <div className="convassordailyreport-container">
      <h1>Convassor Daily Report</h1>

      <div className="convassordailyreporttable-master">
        <div className="convassordailyreporttable1-master">
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
          <div className="convassordailyreporttable-container">
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
            className="convassordailyreport-overlay"
            onClick={() => setIsModalOpen(false)}
          />
        )}

        <Drawer
          anchor="right"
          open={isDrawerOpen}
          // onClose={handleDrawerClose}
          PaperProps={{
            sx: {
              borderRadius: isSmallScreen ? "0" : "10px 0 0 10px",
              width: isSmallScreen ? "100%" : "85%",
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
                  ? "Edit Convassor Daily Report Details"
                  : "Create Convassor Daily Report "}
              </b>
            </Typography>{" "}
            <CloseIcon sx={{ cursor: "pointer" }} onClick={handleDrawerClose} />
          </Box>
          <form className="convassordailyreport-form">
            <div>
              <label className="convassordailyreport-label">
                Report No <b className="required">*</b>
              </label>
              <div>
                <input
                  type="text"
                  id="ReportNo"
                  name="ReportNo"
                  value={ReportNo}
                  onChange={(e) => setReportNo(e.target.value)}
                  style={{ background: "#f5f5f5" }}
                  className="convassordailyreport-control"
                  placeholder="Auto-Incremented"
                  readOnly
                />
              </div>
            </div>

            <div>
              <label className="convassordailyreport-label">
                Report Date<b className="required">*</b>
              </label>
              <div>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DatePicker
                    value={reportdate}
                    onChange={handleDateChange1}
                    format="DD-MM-YYYY"
                    slotProps={{
                      textField: {
                        size: "small",
                        fullWidth: true,
                        error: !!reporterror,
                        helperText: reporterror,
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

              {/* <div>
                          {errors.PurchaseReturnNo && <b className="error-text">{errors.PurchaseReturnNo}</b>}
                        </div> */}
            </div>
            <div>
              <label className="convassordailyreport-label">
                Feeding Date<b className="required">*</b>
              </label>
              <div>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DatePicker
                    value={feedingdate}
                    onChange={handleDateChange2}
                    format="DD-MM-YYYY"
                    slotProps={{
                      textField: {
                        size: "small",
                        fullWidth: true,
                        error: !!feedingerror,
                        helperText: feedingerror,
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

              {/* <div>
                          {errors.FeedingDate && <b className="error-text">{errors.FeedingDate}</b>}
                        </div> */}
            </div>

            <div>
              <label className="convassordailyreport-label">
                Convassor Name<b className="required">*</b>
              </label>
              <div>
                <Autocomplete
                  options={convassorOptions}
                  value={
                    convassorOptions.find(
                      (option) => option.value === ConvassorId
                    ) || null
                  }
                  onChange={(event, newValue) =>
                    setConvassorid(newValue ? newValue.value : null)
                  }
                  getOptionLabel={(option) => option.label} // Display only label in dropdown
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      placeholder="Select Canv id"
                      size="small"
                      margin="none"
                      fullWidth
                    />
                  )}
                  sx={{ mt: 1.25, mb: 0.625, width: 300 }} // Equivalent to 10px and 5px
                />
              </div>
              <div>
                {errors.ConvassorId && (
                  <b className="error-text">{errors.ConvassorId}</b>
                )}
              </div>
            </div>

            <div>
              <label className="convassordailyreport-label">
                Place of Visit<b className="required">*</b>
              </label>
              <div>
                <input
                  type="text"
                  id="Place_to_visit"
                  name="Place_to_visit"
                  value={Place_to_visit}
                  onChange={(e) => setPlacetovisit(e.target.value)}
                  className="convassordailyreport-control"
                  placeholder="Enter Place to visit"
                />
              </div>

              {/* <div>
                          {errors.ReportNo && <b className="error-text">{errors.ReportNo}</b>}
                        </div> */}
            </div>

            <div>
              <label className="convassordailyreport-label">
                Particulars<b className="required">*</b>
              </label>
              <div>
                <input
                  type="text"
                  id="Particulars"
                  name="Particulars"
                  value={Particulars}
                  onChange={(e) => setParticulars(e.target.value)}
                  className="convassordailyreport-control"
                  placeholder="Enter Particulars"
                />
              </div>

              {/* <div>
                          {errors.Particulars && <b className="error-text">{errors.Particulars}</b>}
                        </div> */}
            </div>

            <div>
              <label className="convassordailyreport-label">HSC</label>
              <div>
                <input
                  type="number"
                  id="HSC"
                  name="HSC"
                  value={HSC}
                  onChange={(e) => setHSC(e.target.value)}
                  className="convassordailyreport-control"
                  placeholder="Enter HSC"
                />
              </div>
            </div>
            <div>
              <label className="convassordailyreport-label">Jr College</label>
              <div>
                <input
                  type="number"
                  id="JrCollege"
                  name="JrCollege"
                  value={JrCollege}
                  onChange={(e) => setJrcollege(e.target.value)}
                  className="convassordailyreport-control"
                  placeholder="Enter Jr College"
                />
              </div>
            </div>
            <div>
              <label className="convassordailyreport-label">Sr College</label>
              <div>
                <input
                  type="number"
                  id="SrCollege"
                  name="SrCollege"
                  value={SrCollege}
                  onChange={(e) => setSrcollege(e.target.value)}
                  className="convassordailyreport-control"
                  placeholder="Enter Sr College"
                />
              </div>
            </div>
            <div>
              <label className="convassordailyreport-label">Classes</label>
              <div>
                <input
                  type="number"
                  id="Classes"
                  name="Classes"
                  value={Classes}
                  onChange={(e) => setClasses(e.target.value)}
                  className="convassordailyreport-control"
                  placeholder="Enter Classes"
                />{" "}
              </div>
            </div>
            <div>
              <label className="convassordailyreport-label">BS</label>
              <div>
                <input
                  type="number"
                  id="BS"
                  name="BS"
                  value={BS}
                  onChange={(e) => setBS(e.target.value)}
                  className="convassordailyreport-control"
                  placeholder="Enter BS"
                />{" "}
              </div>{" "}
            </div>
            <div>
              <label className="convassordailyreport-label">DEd</label>
              <div>
                <input
                  type="number"
                  id="DEd"
                  name="DEd"
                  value={DEd}
                  onChange={(e) => setDEd(e.target.value)}
                  className="convassordailyreport-control"
                  placeholder="Enter DEd"
                />
              </div>
            </div>
            <div>
              <label className="convassordailyreport-label">BEd</label>
              <div>
                <input
                  type="number"
                  id="BEd"
                  name="BEd"
                  value={BEd}
                  onChange={(e) => setBEd(e.target.value)}
                  className="convassordailyreport-control"
                  placeholder="Enter BEd"
                />{" "}
              </div>{" "}
            </div>
            <div>
              <label className="convassordailyreport-label">Other</label>
              <div>
                <input
                  type="number"
                  id="Other"
                  name="Other"
                  value={Other}
                  onChange={(e) => setOther(e.target.value)}
                  className="convassordailyreport-control"
                  placeholder="Enter Other"
                />{" "}
              </div>{" "}
            </div>
          </form>

          <div className="convassordailyreport-table">
            <table>
              <thead>
                <tr>
                  <th>Serial No</th>
                  <th>
                    Account Id<b className="required">*</b>
                  </th>
                  <th>
                    Particulars<b className="required">*</b>
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
                      <td>
                        <Autocomplete
                          options={accountOptions}
                          value={
                            accountOptions.find(
                              (option) => option.value === row.AccountId
                            ) || null
                          }
                          onChange={(event, newValue) =>
                            handleInputChange(
                              index,
                              "AccountId",
                              newValue ? newValue.value : ""
                            )
                          }
                          sx={{ width: 450 }}
                          getOptionLabel={(option) => option.label}
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              placeholder="Select AccountId"
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
                          type="text"
                          value={row.Particulars}
                          onChange={(e) =>
                            handleInputChange(
                              index,
                              "Particulars",
                              e.target.value
                            )
                          }
                          placeholder="Particulars"
                        />
                      </td>
                      <td>
                        <input
                          type="number"
                          value={row.Amount}
                          onChange={(e) =>
                            handleInputChange(index, "Amount", e.target.value)
                          }
                          placeholder="Amount"
                        />
                      </td>

                      <td>
                        <div style={{ display: "flex" }}>
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
            {/* Display Total Amount Below Table */}
            <div
              className="total-amount-container"
              style={{
                textAlign: "right",
                marginTop: "10px",
                marginRight: "350px",
              }}>
              <b>Total Amount: </b>₹{" "}
              <b>
                {rows
                  .reduce((sum, row) => sum + Number(row.Amount || 0), 0)
                  .toFixed(2)}
              </b>
            </div>
          </div>

          <div className="convassordailyreport-btn-container">
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
              <u>Convassor Daily Report</u>
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
export default Convassordailyreport;
