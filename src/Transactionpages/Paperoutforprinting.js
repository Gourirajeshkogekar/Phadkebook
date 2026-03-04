import React, { useState, useMemo, useEffect } from "react";
import "./Paperoutforprinting.css";
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
import { DatePicker } from "@mui/x-date-pickers";
import { Edit, Delete, Add, MoreVert, Print } from "@mui/icons-material";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";
import dayjs from "dayjs";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { TimePicker } from "@mui/x-date-pickers/TimePicker";
import { useRef } from "react";

function Paperoutforprinting() {
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

    fetchPaperheaders();
  }, []);
  const [pageIndex, setPageIndex] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const [ChallanNo, setChallanNo] = useState(null);
  const [ChallanDate, setChallanDate] = useState("");
  const [GodownId, setGodownId] = useState("");

  const [AccountId, setAccountId] = useState("");
  const [PartyStock, setPartyStock] = useState("");
  const [GodownStock, setGodownStock] = useState("");
  const [VehicleNo, setVehicleNo] = useState("");
  const [NameOfDriver, setNameOfDriver] = useState("");

  const [editingIndex, setEditingIndex] = useState(-1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [id, setId] = useState("");

  const [paperoutdetailId, setPaperoutdetailId] = useState("");
  const [errors, setErrors] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [paperoutheaders, setPaperoutheaders] = useState([]);
  const [paperoutdetails, setPaperoutdetails] = useState([]);

  //Dropdown for ID's
  const [godownOptions, setGodownOptions] = useState([]);
  const [accountOptions, setAccountOptions] = useState([]);
  const [paperOptions, setPaperOptions] = useState([]);
  const [PaperId, setPaperId] = useState("");
  const [rows, setRows] = useState([
    {
      PaperId: "",
      PaperCode: "",
      PaperSizeName: "",
      MillName: "",
      Bundles: "",
      Quantity: "",
      Unit: "",
      Papers: "",
      CurrentStock: "",
      OpeningStock: "", // ✅ needed
      SubName:"",
      BookCode: "",
      BookPages: "",
      PressPaperBalance: "",
      BookQuantity: ""
    },
    // Add more rows as needed
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

  const [anchorEl, setAnchorEl] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(null);
  const [selectedIndex, setSelectedIndex] = useState(null);
  const [currentRow, setCurrentRow] = useState(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [deleteIndex, setDeleteIndex] = useState(null);
  const [deleteId, setDeleteId] = useState(null);

  const handleMenuOpen = (event, row) => {
    setAnchorEl(event.currentTarget);
    setCurrentRow(row);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  useEffect(() => {
    fetchPaperdetails();
  }, []);

  useEffect(() => {
    fetchPaperheaders();
    console.log("this function is called");
  }, [pageIndex]);

  const fetchPaperheaders = async () => {
    try {
      const response = await axios.get(
        `https://publication.microtechsolutions.net.in/php/get/gettblpage.php?Table=PaperOutwardForPrintingHeader&PageNo=${pageIndex}`,
      );
      console.log(response.data, "response of Paper outward header");

      setPaperoutheaders(response.data.data);
      setTotalPages(response.data.total_pages);
    } catch (error) {
      console.error("Error fetching paper out for headers:", error);
    }
  };

  // Fetch the purchase details
  const fetchPaperdetails = async () => {
    try {
      const response = await axios.get(
        "https://publication.microtechsolutions.net.in/php/get/gettable.php?Table=PaperOutwardForPrintingDetail",
      );
      setPaperoutdetails(response.data);
    } catch (error) {
      // toast.error("Error fetching Paper details:", error);
    }
  };

  const handleAddRow = () => {
    setRows([
      ...rows,
      {
        PaperId: "", // Default value for the first row
        MillName: "",
        Bundles: "",
        Quantity: "",
        Unit: "",
        Papers: "",
        CurrentStock: "",
      },
    ]);
  };

  const handleDeleteRow = (index) => {
    const updatedRows = rows.filter((_, i) => i !== index);
    setRows(updatedRows);
    toast.success("Paper details Deleted Succefully");
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

    const url = `https://publication.microtechsolutions.net.in/php/deletetable.php?Id=${deleteId}&Table=PaperOutwardForPrintingHeader`;

    const urlencoded = new URLSearchParams();
    urlencoded.append("Id", deleteId);
    urlencoded.append("Table", "PaperOutwardForPrintingHeader");

    const requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: urlencoded,
      redirect: "follow",
    };

    fetch(url, requestOptions)
      .then((response) => response.text())
      .then((result) => {
        console.log(result);
        toast.success("Paper for printing Deleted Successfully");
        setIsDeleteDialogOpen(false);
        fetchPaperheaders();
      })
      .catch((error) => {
        console.error("Error:", error);
        toast.error("Failed to delete Paper for printing");
      });
  };

  const cancelDelete = () => {
    setIsDeleteDialogOpen(false);
    setDeleteIndex(null);
  };

  useEffect(() => {
    fetchPapers();
    fetchAccounts();
    fetchGodowns();
  }, []);

  const fetchPapers = async () => {
    try {
      const response = await axios.get(
        "https://publication.microtechsolutions.net.in/php/PaperSizeget.php",
      );
      const paperOptions = response.data.map((paper) => ({
        value: paper.Id,
        label: paper.PaperSizeName,
        code: paper.STRSize_Code,
        unit: paper.Unit,
        openingstock: paper.OpeningStock,
      }));
      setPaperOptions(paperOptions);
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
      // toast.error("Error fetching Accounts:", error);
    }
  };

  const fetchGodowns = async () => {
    try {
      const response = await axios.get(
        "https://publication.microtechsolutions.net.in/php/Godownget.php",
      );
      const godownOptions = response.data.map((god) => ({
        value: god.Id,
        label: god.GodownName,
      }));
      setGodownOptions(godownOptions);
    } catch (error) {
      // toast.error("Error fetching Godowns:", error);
    }
  };

  const resetForm = () => {
    // setChallanDate("");
    setChallandate(dayjs());
    setChallanerror("");
    setChallanNo("");
    setGodownId("");
    setAccountId("");
    setTimeOfRemoval(null);
    setTimeerror("");
    setVehicleNo("");
    setNameOfDriver("");
    setRows([
      {
        PaperId: "", // Default value for the first row
        MillName: "",
        Bundles: "",
        Quantity: "",
        Unit: "",
        Papers: "",
        CurrentStock: "",
        PartyStock: "",
      },
    ]);
  };

  const handleNewClick = () => {
    resetForm();
    setIsModalOpen(true);
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
    const paperheader = paperoutheaders[currentRow.index];

    // Filter purchase details to match the selected PurchaseId
    const paperdetail = paperoutdetails.filter(
      (detail) => detail.PaperOutwardId === paperheader.Id,
    );

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

    // Map the details to rows
    let mappedRows = paperdetail.map((detail) => ({
      PaperOutwardId: detail.PaperOutwardId,
      PaperId: detail.PaperId,
      MillName: detail.MillName,
      Bundles: detail.Bundles,
      Quantity: detail.Quantity,
      Unit: detail.Unit,
      Papers: detail.Papers,
      CurrentStock: detail.CurrentStock,
      PartyStock: detail.PartyStock,
      Id: detail.Id, // Include the detail Id in the mapped row for tracking
    }));

    mappedRows = mappedRows.map((row) => {
      const paper = paperOptions.find((b) => b.value === row.PaperId);

      return {
        ...row,
        STRSize_Code: paper?.code || "",
        PaperSizeName: paper?.label || "",
        Unit: row.Unit || "",
        OpeningStock: paper?.openingstock || "",
      };
    });

    const challandate = dayjs(paperheader.ChallanDate?.date);
    const extractTime = (dateObj) => {
      if (!dateObj?.date) return null;

      // "1900-01-01 12:00:00.000000"
      const timePart = dateObj.date.split(" ")[1]; // "12:00:00.000000"
      const cleanTime = timePart.split(".")[0]; // "12:00:00"

      return dayjs(cleanTime, "HH:mm:ss");
    };

    const timeofremoval = paperheader.TimeOfRemoval
      ? extractTime(paperheader.TimeOfRemoval)
      : null;

    setTimeOfRemoval(timeofremoval);

    setChallanNo(paperheader.ChallanNo);
    setChallandate(challandate);
    setGodownId(paperheader.GodownId);
    setAccountId(paperheader.AccountId);
    setVehicleNo(paperheader.VehicleNo);
    setNameOfDriver(paperheader.NameOfDriver);
    setPartyStock(paperheader.PartyStock);
    setGodownStock(paperheader.GodownStock);
    setTimeOfRemoval(
      paperheader.TimeOfRemoval?.date
        ? dayjs(paperheader.TimeOfRemoval.date, "HH:mm:ss")
        : null,
    );
    setRows(mappedRows);

    setIsEditing(true);
    setIsModalOpen(true);
    setEditingIndex(currentRow.index);
    setId(paperheader.Id);
    handleMenuClose();
    // Determine which specific detail to edit
    const specificDetail = paperdetail.find(
      (detail) => detail.Id === currentRow.original.Id,
    );
    if (specificDetail) {
      setPaperoutdetailId(specificDetail.Id); // Set the specific detail Id
    }

    fetchPaperdetails();
  };

  const handlePaperNameChange = (index, selectedId) => {
    const selectedPaper = paperOptions.find(
      (p) => p.value === Number(selectedId),
    );

    if (!selectedPaper) return;

    const updatedRows = [...rows];
    updatedRows[index] = {
      ...updatedRows[index],
      PaperId: selectedPaper.value,
      STRSize_Code: selectedPaper.code,
      Unit: selectedPaper.unit,
      OpeningStock: selectedPaper.openingstock, // 🔥 HERE
    };

    setRows(updatedRows);
  };

  // const validateForm = () => {
  //   let formErrors = {};
  //   let isValid = true;

  //   if (!challandate) {
  //     isValid = false;
  //     formErrors.challandate = "Challan Date is required";
  //   }

  //   if (!GodownId) {
  //     isValid = false;
  //     formErrors.GodownId = "Godown Id is required";
  //   }

  //   if (!AccountId) {
  //     isValid = false;
  //     formErrors.AccountId = "Account Id is required";
  //   }

  //   if (!timeofremoval) {
  //     isValid = false;
  //     formErrors.timeofremoval = "Time Of removal is required";
  //   }

  //   if (!VehicleNo) {
  //     isValid = false;
  //     formErrors.VehicleNo = "Vehicle No is required";
  //   }

  //   if (!NameOfDriver) {
  //     isValid = false;
  //     formErrors.NameOfDriver = "Name Of Driver is required";
  //   }

  //   setErrors(formErrors);
  //   return isValid;
  // };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // if (!validateForm()) return;

    if (
      !challandate ||
      !dayjs(challandate).isValid() ||
      challanerror ||
      !timeofremoval ||
      !dayjs(timeofremoval).isValid() ||
      timeerror
    ) {
      toast.error("Please correct all the date fields before submitting.");
      return;
    }

    const formattedChallandate = dayjs(challandate).format("YYYY-MM-DD");
    const formattedTime = timeofremoval
      ? dayjs(timeofremoval).format("HH:mm:ss")
      : null;

    const paperData = {
      Id: isEditing ? id : "", // Include the Id for updating, null for new records
      ChallanNo: ChallanNo,
      ChallanDate: formattedChallandate,
      GodownId: GodownId,
      AccountId: AccountId,
      TimeOfRemoval: formattedTime,
      VehicleNo: VehicleNo,
      NameOfDriver: NameOfDriver,
      PartyStock: PartyStock,
      GodownStock: GodownStock,
      CreatedBy: !isEditing ? userId : undefined,
      UpdatedBy: isEditing ? userId : undefined,
    };

    try {
      const paperurl = isEditing
        ? "https://publication.microtechsolutions.net.in/php/Paperoutwardheaderupdate.php"
        : "https://publication.microtechsolutions.net.in/php/Paperoutwardheaderpost.php";

      // Submit purchase header data
      const response = await axios.post(paperurl, qs.stringify(paperData), {
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
      });

      const paperOutwardId = isEditing ? id : parseInt(response.data?.data?.Id, 10);
console.log(paperOutwardId, 'PaperoutId')
      for (const row of rows) {
        const rowData = {
          PaperOutwardId: paperOutwardId,
          PaperId: parseInt(row.PaperId, 10),
          MillName: row.MillName,
          Bundles: parseInt(row.Bundles, 10),
          Quantity: parseFloat(row.Quantity),
          Unit: row.Unit, // ✅ FIX HERE
          Papers: parseInt(row.Papers, 10),
          CurrentStock: parseInt(row.CurrentStock, 10),
          partyStock: parseInt(row.PartyStock, 10),
          SubName: row.SubName,
          BookCode: row.BookCode,
          BookPages:row.BookPages,
          PressPaperBalance: row.PressPaperBalance,
          CreatedBy: row.Id ? undefined : userId,
          UpdatedBy: row.Id ? userId : undefined,
          Id: row.Id,
        };

        // console.log('Submitting Row Data:', rowData);

        const paperdetailurl =
          isEditing && row.Id
            ? "https://publication.microtechsolutions.net.in/php/Paperoutwarddetailupdate.php"
            : "https://publication.microtechsolutions.net.in/php/Paperoutwarddetailpost.php";

        await axios.post(paperdetailurl, qs.stringify(rowData), {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
        });
      }

      fetchPaperheaders();
      fetchPaperdetails();
      setIsModalOpen(false);
      toast.success(
        isEditing
          ? "Paper & Paper Details updated successfully!"
          : "Paper & Paper Details added successfully!",
      );
      resetForm(); // Reset the form fields after successful submission
    } catch (error) {
      // console.error("Error saving record:", error);
      toast.error("Error saving record!");
    }
  };

  const [challandate, setChallandate] = useState(dayjs());
  const [challanerror, setChallanerror] = useState("");

  const [timeofremoval, setTimeOfRemoval] = useState(null);
  const [timeerror, setTimeerror] = useState("");

  const handleTimeChange = (newValue) => {
    if (!dayjs.isDayjs(newValue) || !newValue.isValid()) {
      setTimeerror("Please select valid time");
      setTimeOfRemoval(null);
      return;
    }

    setTimeerror("");
    setTimeOfRemoval(newValue);
  };

  const handleDateChange1 = (newValue) => {
    if (!newValue || !dayjs(newValue).isValid()) {
      setChallanerror("Invalid date");
      setChallandate(null);
      return;
    }

    // const today = dayjs();
    // const minDate = today.subtract(3, "day");
    // const maxDate = today.add(2, "day");

    // if (newValue.isBefore(minDate) || newValue.isAfter(maxDate)) {
    //   setChallanerror("You can select only 2 days before or after today");
    // } else {
    //   setChallanerror("");
    // }

    setChallanerror("");

    setChallandate(dayjs(newValue));
  };

  const handleInputChange = (index, field, value) => {
    const updatedRows = [...rows];
    updatedRows[index][field] = value;
    setRows(updatedRows);
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
        accessorKey: "VehicleNo",
        header: "Vehicle No",
        size: 50,
      },
      {
        accessorKey: "ChallanDate.date",
        header: "Challan Date",
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
    [paperoutheaders],
  );

  const table = useMaterialReactTable({
    columns,
    data: paperoutheaders,
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
    <div className="paperout-container">
      <h1>Paper Outward for Book Printing</h1>

      <div className="paperouttable-master">
        <div className="paperouttable1-master">
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
          <div className="paperouttable-container">
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

        {isModalOpen && (
          <div
            className="paperout-overlay"
            onClick={() => setIsModalOpen(false)}
          />
        )}

        <Modal open={isModalOpen}>
          <div className="paperout-modal">
            <h2
              style={{
                textAlign: "center",
                fontWeight: "620",
                margin: "2px",
                fontSize: "27px",
              }}>
              {editingIndex >= 0
                ? "Edit Paper Outward for Printing"
                : "Add Paper Outward for Printing"}
            </h2>
            <form className="paperout-form">


               <div>
                <label className="paperout-label">Challan Date</label>
                <div>
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DatePicker
                      value={challandate}
                      onChange={handleDateChange1}
                      format="DD-MM-YYYY"
                      slotProps={{
                        textField: {
                          size: "small",
                          fullWidth: true,
                          error: !!challanerror,
                          helperText: challanerror,
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




              <div style={{marginLeft:'250px'}}>
                <label className="paperout-label">Challan No</label>
                <div>
                  <input
                    type="text"
                    id="ChallanNo"
                    name="ChallanNo"
                    value={ChallanNo}
                    onChange={(e) => setChallanNo(e.target.value)}
                    className="paperout-control"
                    style={{ background: "#f5f5f5" , }}
                    placeholder="Auto-Incremented"
                    readOnly
                  />
                </div>
              </div>

             
              <div>
                <label className="paperout-label"> Godown</label>
                <div>
                  <Autocomplete
                    options={godownOptions}
                    value={
                      godownOptions.find(
                        (option) => option.value === GodownId,
                      ) || null
                    }
                    onChange={(event, newValue) =>
                      setGodownId(newValue ? newValue.value : null)
                    }
                    getOptionLabel={(option) => option.label} // Display only label in dropdown
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        placeholder="Select Godown id"
                        size="small"
                        margin="none"
                        fullWidth
                      />
                    )}
                    sx={{ mt: 1.25, mb: 0.625, width: 300 }} // Equivalent to 10px and 5px
                  />
                </div>
              </div>
            </form>

            <form className="paperout-form">
              <div>
                <label className="paperout-label"> Party Name</label>
                <div>
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
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        placeholder="Select Acc id"
                        size="small"
                        margin="none"
                        fullWidth
                      />
                    )}
                    sx={{ mt: 1.25, mb: 0.625, width: 400 }} // Equivalent to 10px and 5px
                  />
                </div>
              </div>
            </form>

            <div className="paperout-table">
              <table>
                <thead>
                  <tr>
                    <th>Sr No</th>
                    <th> Code</th>
<th style={{ width: "500px" }}>Name of the Paper</th>   
                 {/* <th>Mill Name</th> */}
                    <th>Bundles</th>
                    <th>Quantity</th>
                    <th>Unit</th>
                    <th>Papers</th>
                    <th>CurrentStock</th>
                    <th>Party Stock</th>
                    <th  style={{ width: "400px" }}>Sub Name </th>
                   <th>Book Code</th>
                    <th>Book Pages</th>
                    <th >Press Paper Balance</th>
                    <th>Book Quantity</th>


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

<td  >             
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
                              sx={{ width: "100%" }}
                            isOptionEqualToValue={(option, value) =>
                              option.value === value.value
                            }
                          />
                        </td>

                        {/* <td>
                          <input
                            type="text"
                            value={row.MillName || ""}
                            onChange={(e) =>
                              handleInputChange(
                                index,
                                "MillName",
                                e.target.value,
                              )
                            }
                            style={{ width: "100px" }}
                            className="paperout-control"
                          />
                        </td> */}

                        <td>
                          <input
                            type="number"
                            value={row.Bundles || ""}
                            onChange={(e) =>
                              handleInputChange(
                                index,
                                "Bundles",
                                e.target.value,
                              )
                            }
                            style={{ width: "70px" }}
                            placeholder="Enter Bundles"
                            className="paperout-control"
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
                            style={{ width: "100px" }}
                            placeholder="Enter Qunatity"
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
                            type="text"
                            value={row.Papers || ""}
                            onChange={(e) =>
                              handleInputChange(index, "Papers", e.target.value)
                            }
                            style={{ width: "70px" }}
                            placeholder="Enter Papers"
                            className="paperout-control"
                          />
                        </td>

                        <td>
                          <input
                            type="number"
                            value={row.CurrentStock}
                            className="paperout-control"
                            placeholder="Enter CurrentStock"
                          />
                        </td>
                        <td>
                          <input
                            type="number"
                            value={row.OpeningStock || ""}
                            readOnly
                            style={{ width: "100px" }}
                            className="paperout-control"
                            placeholder="Party stock"
                          />
                        </td>

                            <td>
                          <input
                            type="text"
                            value={row.SubName || ""}
                              onChange={(e) =>
                              handleInputChange(index, "SubName", e.target.value)
                            }
                              style={{ width: "100%" }}
                            className="paperout-control"
                            placeholder="Sub Name"
                          />
                        </td>    <td>
                          <input
                            type="number"
                            value={row.BookCode || ""}
                              onChange={(e) =>
                              handleInputChange(index, "BookCode", e.target.value)
                            }
                            style={{ width: "100px" }}
                            className="paperout-control"
                            placeholder="Book Code"
                          />
                        </td>    <td>
                          <input
                            type="number"
                            value={row.BookPages || ""}
                              onChange={(e) =>
                              handleInputChange(index, "BookPages", e.target.value)
                            }
                            style={{ width: "100px" }}
                            className="paperout-control"
                            placeholder="Book Pages"
                          />
                        </td>    <td>
                          <input
                            type="number"
                            value={row.PressPaperBalance || ""}
                              onChange={(e) =>
                              handleInputChange(index, "PressPaperBalance", e.target.value)
                            }
                            style={{ width: "150px" }}
                            className="paperout-control"
                            placeholder="Press Paper Balance"
                          />
                        </td>    <td>
                          <input
                            type="number"
                            value={row.BookQuantity || ""}
                              onChange={(e) =>
                              handleInputChange(index, "BookQuantity", e.target.value)
                            }
                            style={{ width: "100px" }}
                            className="paperout-control"
                            placeholder="Book Quantity"
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

            <form className="paperout-form">
              <div>
                <label className="paperout-label">Vehicle No</label>
                <div>
                  <input
                    type="text"
                    id="VehicleNo"
                    name="VehicleNo"
                    value={VehicleNo}
                    onChange={(e) => setVehicleNo(e.target.value)}
                    maxLength={20}
                    className="paperout-control"
                    placeholder="Enter Vehicle No"
                  />
                </div>
              </div>

              <div>
                <label className="paperout-label">Name Of Driver</label>
                <div>
                  <input
                    type="text"
                    id="NameOfDriver"
                    name="NameOfDriver"
                    value={NameOfDriver}
                    onChange={(e) => setNameOfDriver(e.target.value)}
                    maxLength={50}
                    style={{ width: "300px" }}
                    className="paperout-control"
                    placeholder="Enter Name of Driver"
                  />
                </div>
              </div>

              <div>
                <label className="paperout-label">Time Of Removal</label>
                <div>
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <TimePicker
                      value={timeofremoval}
                      onChange={handleTimeChange}
                      ampm={true} // set false if you want 24-hour format
                      slotProps={{
                        textField: {
                          size: "small",
                          fullWidth: true,
                          error: !!timeerror,
                          helperText: timeerror,
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
            </form>

            <div className="paperout-btn-container">
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
              <u>Paper out for printing</u>
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

export default Paperoutforprinting;
