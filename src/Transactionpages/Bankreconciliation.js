import React, {
  useState,
  useMemo,
  useEffect,
  useSyncExternalStore,
} from "react";
import "./Bankreconciliation.css";
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
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { RiDeleteBin5Line } from "react-icons/ri";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";

function BankReconciliation() {
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

    fetchBankreconcils();
  }, []);

  const [pageIndex, setPageIndex] = useState(1); // Current page
  const [totalPages, setTotalPages] = useState(1);

  const [anchorEl, setAnchorEl] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(null);
  const [selectedIndex, setSelectedIndex] = useState(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [deleteIndex, setDeleteIndex] = useState(null);
  const [deleteId, setDeleteId] = useState(null);

  const [banks, setBanks] = useState([]);

  const [BankId, setBankId] = useState("");
  const [Startdate, setStartdate] = useState("");
  const [Enddate, setEnddate] = useState("");
  const [selectedOption, setSelectedOption] = useState("all_entries"); // Default to 'All Entries'
  const [Op_bal_ledge, setOpbalperledger] = useState("");
  const [Op_bal_passbook, setOpbalperpassbook] = useState("");
  const [Bal_ledge, setBalperledger] = useState("");
  const [Add_cheq_issued, setChqissuednotpresented] = useState("");
  const [Less_cheq_deposited, setLesschqdeponotrealised] = useState("");
  const [Bal_passbook, setBalaspassbook] = useState("");
  // const [Ttl_debit, setTtl_debit] = useState('');
  // const [Ttl_credit, setTtl_credit] = useState('')

  const [Bank_Reco_starting_dt, setBankrecostartingDate] = useState("");

  const [editingIndex, setEditingIndex] = useState(-1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [id, setId] = useState("");

  const [bankreconcildetailId, setBankreconcildetailId] = useState("");
  const [errors, setErrors] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [bankreconcils, setBankreconcils] = useState([]);
  const [bankreconcilDetails, setBankreconcilDetails] = useState([]);

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

  const [bookOptions, setBookOptions] = useState([]);
  const [accountOptions, setAccountOptions] = useState([]);
  const [rows, setRows] = useState([
    {
      SerialNo: "",

      Trans_dt: "",
      CheqNo: "",
      TrCc: "",
      AccountId: "",
      Cr_Amt: "",
      Deb_Amt: "",
      Passing_dt: "",
    },
  ]);

  useEffect(() => {
    // fetchBankreconcils();
    fetchBankreconcildetails();
    fetchBooks();
    fetchAccounts();
  }, []);

  useEffect(() => {
    fetchBankreconcils();
    console.log("this function is called");
  }, [pageIndex]); // Fetch data when page changes

  const fetchBankreconcils = async () => {
    try {
      const response = await axios.get(
        `https://publication.microtechsolutions.net.in/php/get/gettblpage.php?Table=BankReconcilation&PageNo=${pageIndex}`
      );
      // setBankreconcils(response.data);
      console.log(response.data, "response of bank reconcil header");

      setBankreconcils(response.data.data);
      setTotalPages(response.data.total_pages);
    } catch (error) {
      // toast.error("Error fetching bank reconcils:", error);
      console.error("Error fetching bank reconcils:", error);
    }
  };

  const fetchBankreconcildetails = async () => {
    try {
      const response = await axios.get(
        "https://publication.microtechsolutions.net.in/php/get/gettable.php?Table=BankReconcilationDetail"
      );
      console.log(response.data, "response of bank reconcil details");
      setBankreconcilDetails(response.data);
    } catch (error) {
      // toast.error("Error fetching sells challan details:", error);
      console.error("Error fetching sells challan details:", error);
    }
  };

  const handleInputChange = (index, field, value) => {
    const updatedRows = [...rows];

    // Update the value of the current field
    updatedRows[index][field] = value;

    // Ensure numeric fields are converted correctly
    if (field === "Cr_Amt" || field === "Deb_Amt") {
      updatedRows[index][field] = value ? parseFloat(value) || 0 : "";
    }

    // Update the state with the new row data
    setRows(updatedRows);
  };

  const handleAddRow = () => {
    setRows([
      ...rows,
      {
        SerialNo: "",

        Trans_dt: "",
        CheqNo: "",
        TrCc: "",
        AccountId: "",
        Cr_Amt: "",
        Deb_Amt: "",
        Passing_dt: "",
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
    const url = `https://publication.microtechsolutions.net.in/php/deletetable.php?Id=${deleteId}&Table=BankReconcilation`;

    const urlencoded = new URLSearchParams();
    urlencoded.append("Id", deleteId);
    urlencoded.append("Table", "BankReconcilation");

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
        toast.success("Bank Reconcilation Deleted Successfully"); // Show success toast
        setIsDeleteDialogOpen(false); // Close delete dialog
        fetchBankreconcils(); // Refresh vouchers list
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

  const fetchAccounts = async () => {
    try {
      const response = await axios.get(
        "https://publication.microtechsolutions.net.in/php/Accountget.php"
      );

      console.log(response.data, "accounts");
      const banks = response.data.map((acc) => ({
        value: acc.Id,
        label: acc.AccountName,
      }));
      setBanks(banks);
      setAccountOptions(banks);
    } catch (error) {
      // toast.error("Error fetching accs:", error);
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
      console.error("Error fetching books:", error);
    }
  };

  const resetForm = () => {
    setBankId("");
    setStartdate("");
    setEnddate("");
    setOpbalperledger("");
    setOpbalperpassbook("");
    setBalperledger("");
    setChqissuednotpresented("");
    setLesschqdeponotrealised("");
    setBalaspassbook("");
    setSelectedOption("");
    setBankrecostartingDate("");
    setRows([
      {
        SerialNo: "",

        Trans_dt: "",
        CheqNo: "",
        TrCc: "",
        AccountId: "",
        Cr_Amt: "",
        Deb_Amt: "",
        Passing_dt: "",
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
    setIsLoading(true);
    console.log(currentRow, "row");
    const bankreconcil = bankreconcils[currentRow.index];

    // Filter purchase details to match the selected PurchaseId
    const bankreconcildetail = bankreconcilDetails.filter(
      (detail) => detail.BankReconcilationId === bankreconcil.Id
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

    const mappedRows = bankreconcildetail.map((detail) => ({
      // PurchaseReturnId: detail.PurchaseReturnId,

      BankReconcilationId: detail.BankReconcilationId,
      // SerialNo:detail.SerialNo,
      Trans_dt: convertDateForInput(detail.Trans_dt?.date),
      CheqNo: detail.CheqNo,
      TrCc: detail.TrCc,
      AccountId: detail.AccountId,
      Cr_Amt: detail.Cr_Amt,
      Deb_Amt: detail.Deb_Amt,
      Passing_dt: convertDateForInput(detail.Passing_dt?.date),
      Id: detail.Id, // Include the detail Id in the mapped row for tracking
    }));

    const startdate = convertDateForInput(bankreconcil.Startdate?.date);
    const enddate = convertDateForInput(bankreconcil.Enddate?.date);
    const recostartingdate = convertDateForInput(
      bankreconcil.Bank_Reco_starting_dt?.date
    );

    // Set the form fields
    setBankId(bankreconcil.BankId);
    setStartdate(startdate);
    setEnddate(enddate);
    setSelectedOption(bankreconcil.Options);
    setOpbalperledger(bankreconcil.Op_bal_ledge);
    setOpbalperpassbook(bankreconcil.Op_bal_passbook);
    setBalperledger(bankreconcil.Bal_ledge);
    setChqissuednotpresented(bankreconcil.Add_cheq_issued);
    setLesschqdeponotrealised(bankreconcil.Less_cheq_deposited);
    setBalaspassbook(bankreconcil.Bal_passbook);
    // setTtl_debit(bankreconcil.Ttl_debit);
    // setTtl_credit(bankreconcil.Ttl_credit);

    setBankrecostartingDate(recostartingdate);

    console.log(bankreconcil, "bankre concil");
    console.log(bankreconcilDetails, "bank reconcil detail");
    console.log(mappedRows, "mapped rows");
    // Set the rows for the table with all the details
    setRows(mappedRows);

    // Set editing state
    setEditingIndex(currentRow.index);
    setIsDrawerOpen(true);
    setIsEditing(true);
    setId(bankreconcil.Id);
    handleMenuClose();
    // Determine which specific detail to edit
    const specificDetail = bankreconcildetail.find(
      (detail) => detail.Id === currentRow.original.Id
    );
    if (specificDetail) {
      setBankreconcildetailId(specificDetail.Id); // Set the specific detail Id
    }

    fetchBankreconcildetails().then(() => {
      setIsLoading(false);
    });
  };

  const validateForm = () => {
    let formErrors = {};
    let isValid = true;

    // if (!Startdate) {
    //   formErrors.Startdate = "Start date is required";
    //   isValid = false;
    // }

    // if (!Enddate) {
    //   formErrors.Enddate = "End date is required";
    //   isValid = false;
    // }

    setErrors(formErrors);
    return isValid;
  };

  // Calculate total credit and debit
  const Ttl_credit = useMemo(() => {
    return rows.reduce((sum, row) => sum + (parseFloat(row.Cr_Amt) || 0), 0);
  }, [rows]);

  const Ttl_debit = useMemo(() => {
    return rows.reduce((sum, row) => sum + (parseFloat(row.Deb_Amt) || 0), 0);
  }, [rows]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    const formattedStartDate = moment(Startdate).format("YYYY-MM-DD");
    const formattedEndDate = moment(Enddate).format("YYYY-MM-DD");
    const formattedbankrecoStartingdate = moment(Bank_Reco_starting_dt).format(
      "YYYY-MM-DD"
    );

    const bankreconcilData = {
      Id: isEditing ? id : "", // Include the Id for updating, null for new records
      BankId: BankId,
      Startdate: formattedStartDate,
      Enddate: formattedEndDate,
      Options: selectedOption,
      Op_bal_ledge: Op_bal_ledge,
      Op_bal_passbook: Op_bal_passbook,
      Bal_ledge: Bal_ledge,
      Add_cheq_issued: Add_cheq_issued,
      Less_cheq_deposited: Less_cheq_deposited,
      Bal_passbook: Bal_passbook,
      Ttl_debit: Ttl_debit,
      Ttl_credit: Ttl_credit,
      Bank_Reco_starting_dt: formattedbankrecoStartingdate,
      CreatedBy: !isEditing ? userId : undefined,
      UpdatedBy: isEditing ? userId : undefined,
    };

    try {
      const bankreconcilurl = isEditing
        ? "https://publication.microtechsolutions.net.in/php/update/bankreconcilation.php"
        : "https://publication.microtechsolutions.net.in/php/post/bankreconcilation.php";

      // Submit purchase header data
      const response = await axios.post(
        bankreconcilurl,
        qs.stringify(bankreconcilData),
        {
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
        }
      );

      // const purchasereturnId = isEditing ? id : parseInt(response.data.newId, 10);
      const bankreconcilId = isEditing ? id : parseInt(response.data.Id, 10);

      for (const row of rows) {
        const rowData = {
          BankReconcilationId: bankreconcilId,
          SerialNo: rows.indexOf(row) + 1,
          // Trans_dt: row.Trans_dt ? moment(row.Trans_dt).format('YYYY-MM-DD') : '',
          Trans_dt: row.Trans_dt || "",
          CheqNo: row.CheqNo || "",
          TrCc: row.TrCc || "",
          AccountId: row.AccountId || "",
          Cr_Amt: parseFloat(row.Cr_Amt) || 0, // Ensuring it's a float
          Deb_Amt: parseFloat(row.Deb_Amt) || 0, // Ensuring it's a float
          // Passing_dt: row.Passing_dt ? moment(row.Passing_dt).format('YYYY-MM-DD') : '',
          Passing_dt: row.Passing_dt,
          Id: row.Id,
          CreatedBy: !isEditing ? userId : undefined,
          UpdatedBy: isEditing ? userId : undefined,
        };

        // if (isEditing && row.Id) {
        //   // If editing, include PurchasedetailId for the update
        //   rowData.Id = row.PurchaseId;
        // }

        const bankreconcildetailurl =
          isEditing && row.Id
            ? "https://publication.microtechsolutions.net.in/php/update/bankreconcilationdetail.php"
            : "https://publication.microtechsolutions.net.in/php/post/bankreconcilationdetail.php";

        await axios.post(bankreconcildetailurl, qs.stringify(rowData), {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
        });
      }

      fetchBankreconcils();
      fetchBankreconcildetails();
      setIsDrawerOpen(false);
      toast.success(
        isEditing
          ? "Bank Reconcilation & Bank Reconcilation Details updated successfully!"
          : "Bank Reconcilation & Bank Reconcilation Details added successfully!"
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
      // {
      //   accessorKey: 'BankId',
      //   header: "Bank Name",
      //   size: 50,
      // },

      {
        accessorKey: "Startdate.date",
        header: "Start Date",
        size: 50,
        Cell: ({ cell }) => {
          // Using moment.js to format the date
          const date = moment(cell.getValue()).format("DD-MM-YYYY");
          return <span>{date}</span>;
        },
      },
      {
        accessorKey: "Enddate.date",
        header: "End Date",
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
    [bankreconcils]
  );

  const table = useMaterialReactTable({
    columns,
    data: bankreconcils,
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
    <div className="bankreconcil-container">
      <h1>Bank Reconcilation</h1>

      <div className="bankreconciltable-master">
        <div className="bankreconciltable1-master">
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
          <div className="bankreconciltable-container">
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
              width: isSmallScreen ? "100%" : "80%",
              zIndex: 1000,
              paddingLeft: "16px", // Adjust this value as needed
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
              <b>
                {isEditing
                  ? "Edit Bank Reconcilation"
                  : "Create Bank Reconcilation"}
              </b>
            </Typography>{" "}
            <CloseIcon sx={{ cursor: "pointer" }} onClick={handleDrawerClose} />
          </Box>
          <form className="bankreconcil-form">
            <div>
              <label className="bankreconcil-label">Bank</label>
              <div>
                <Autocomplete
                  options={banks}
                  value={
                    banks.find((option) => option.value === BankId) || null
                  }
                  onChange={(event, newValue) =>
                    setBankId(newValue ? newValue.value : null)
                  }
                  sx={{ width: "250px", mt: "10px", mb: "5px" }}
                  getOptionLabpxel={(option) => option.label} // Display only label in dropdown
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      placeholder="Select Bank"
                      size="small"
                      margin="none"
                      fullWidth
                    />
                  )}
                />

                {/* <Select
                   id="BankId"
                   name="BankId"
                   value={banks.find((option) => option.value === BankId)}
                   onChange={(option) => setBankId(option.value)}
                   options={banks} 
                   styles={{
                     control: (base) => ({
                       ...base,
                       width: "170px",
                              marginTop: "10px",
                              borderRadius: "4px",
                              border: "1px solid rgb(223, 222, 222)",
                               marginBottom: '5px'
                     }),
                     menu: (base) => ({
                      ...base,
                      zIndex: 100,
                    }),
                   }}
                    placeholder="Select Bank id"
                  />   */}
              </div>
              {/* <div>
                          {errors.BankId && <b className="error-text">{errors.BankId}</b>}
                        </div> */}
            </div>

            <div>
              <label className="bankreconcil-label">Start Date</label>
              <div>
                {/* <input
                    type="date" //mm-dd-yyyy
                    id="Startdate"
                     name="Startdate"
                      value={Startdate}  

                   onChange={(e)=> setStartdate(e.target.value)}
                    className="bankreconcil-control"
                    placeholder="dd-mm-yyyy"                    /> */}

                <LocalizationProvider dateAdapter={AdapterDateFns}>
                  <DatePicker
                    value={Startdate ? new Date(Startdate) : null} // Convert to Date object
                    // value={VoucherDate}
                    onChange={(newValue) => setStartdate(newValue)}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        error={!!errors.Startdate}
                        helperText={errors.Startdate}
                      />
                    )}
                    slotProps={{
                      textField: { size: "small", fullWidth: true },
                    }}
                    format="dd/MM/yyyy"
                    sx={{
                      marginTop: "10px",
                      marginBottom: "5px",
                      width: "250px",
                    }} // Apply margins here
                  />
                </LocalizationProvider>
              </div>
              {/* <div>
                          {errors.Startdate && <b className="error-text">{errors.Startdate}</b>}
                        </div> */}
            </div>

            <div>
              <label className="bankreconcil-label">End Date</label>
              <div>
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                  <DatePicker
                    value={Enddate ? new Date(Enddate) : null} // Convert to Date object
                    // value={VoucherDate}
                    onChange={(newValue) => setEnddate(newValue)}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        error={!!errors.Enddate}
                        helperText={errors.Enddate}
                      />
                    )}
                    slotProps={{
                      textField: { size: "small", fullWidth: true },
                    }}
                    format="dd/MM/yyyy"
                    sx={{
                      marginTop: "10px",
                      marginBottom: "5px",
                      width: "250px",
                    }} // Apply margins here
                  />
                </LocalizationProvider>
              </div>
              {/* <div>
                          {errors.endDate && <b className="error-text">{errors.endDate}</b>}
                        </div> */}
            </div>

            {/* Radio Buttons Section */}
            <div>
              <label className="bankreconcil-label">Options</label>
              <div>
                <label>
                  <input
                    type="radio"
                    name="options"
                    value="All entries"
                    checked={selectedOption === "All entries"}
                    onChange={() => setSelectedOption("All entries")}
                    style={{ marginBottom: "5px", marginTop: "10px" }}
                  />
                  All Entries
                </label>
              </div>
              <div>
                <label>
                  <input
                    type="radio"
                    name="options"
                    value="All reconciled"
                    checked={selectedOption === "All reconciled"}
                    onChange={() => setSelectedOption("All reconciled")}
                    style={{ marginBottom: "5px" }}
                  />
                  All Reconciled
                </label>
              </div>
              <div>
                <label>
                  <input
                    type="radio"
                    name="options"
                    value="Only Reconciled"
                    checked={selectedOption === "Only Reconciled"}
                    onChange={() => setSelectedOption("Only Reconciled")}
                    style={{ marginBottom: "5px" }}
                  />
                  Only Reconciled
                </label>
              </div>
            </div>

            <div>
              <label className="bankreconcil-label">
                Op Balance as per Ledger
              </label>
              <div>
                <input
                  type="number"
                  id="Op_bal_ledge"
                  name="Op_bal_ledge"
                  value={Op_bal_ledge}
                  onChange={(e) => setOpbalperledger(e.target.value)}
                  className="bankreconcil-control"
                  placeholder="Enter op bal per ledger"
                />
              </div>
              {/* <div>
                          {errors.endDate && <b className="error-text">{errors.endDate}</b>}
                        </div> */}
            </div>

            <div>
              <label className="bankreconcil-label">
                Op Balance per Passbook
              </label>
              <div>
                <input
                  type="number"
                  id="Op_bal_passbook"
                  name="Op_bal_passbook"
                  value={Op_bal_passbook}
                  onChange={(e) => setOpbalperpassbook(e.target.value)}
                  className="bankreconcil-control"
                  placeholder="Enter op bal per passbook"
                />
              </div>
              {/* <div>
                          {errors.endDate && <b className="error-text">{errors.endDate}</b>}
                        </div> */}
            </div>

            <div>
              <label className="bankreconcil-label">
                Balance as per Ledger
              </label>
              <div>
                <input
                  type="number"
                  id="Bal_ledge"
                  name="Bal_ledge"
                  value={Bal_ledge}
                  onChange={(e) => setBalperledger(e.target.value)}
                  className="bankreconcil-control"
                  placeholder="Enter bal per ledger"
                />
              </div>
              {/* <div>
                          {errors.endDate && <b className="error-text">{errors.endDate}</b>}
                        </div> */}
            </div>

            <div>
              <label className="bankreconcil-label">Add cheques issued </label>
              <div>
                <input
                  type="number"
                  id="Add_cheq_issued"
                  name="Add_cheq_issued"
                  value={Add_cheq_issued}
                  onChange={(e) => setChqissuednotpresented(e.target.value)}
                  className="bankreconcil-control"
                  placeholder="Enter cheques issued"
                />
              </div>
              {/* <div>
                          {errors.endDate && <b className="error-text">{errors.endDate}</b>}
                        </div> */}
            </div>
            <div>
              <label className="bankreconcil-label">
                Less cheques deposited{" "}
              </label>
              <div>
                <input
                  type="number"
                  id="Less_cheq_deposited"
                  name="Less_cheq_deposited"
                  value={Less_cheq_deposited}
                  onChange={(e) => setLesschqdeponotrealised(e.target.value)}
                  className="bankreconcil-control"
                  placeholder="Enter less cheques deposited"
                />
              </div>
              {/* <div>
                          {errors.endDate && <b className="error-text">{errors.endDate}</b>}
                        </div> */}
            </div>

            <div>
              <label className="bankreconcil-label">
                Balance as per Pass Book
              </label>
              <div>
                <input
                  type="number"
                  id="Bal_passbook"
                  name="Bal_passbook"
                  value={Bal_passbook}
                  onChange={(e) => setBalaspassbook(e.target.value)}
                  className="bankreconcil-control"
                  placeholder="Enter bal as per passbook"
                />
              </div>
              {/* <div>
                          {errors.endDate && <b className="error-text">{errors.endDate}</b>}
                        </div> */}
            </div>

            <div>
              <label className="bankreconcil-label">
                Bank reco starting date
              </label>
              <div>
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                  <DatePicker
                    value={
                      Bank_Reco_starting_dt
                        ? new Date(Bank_Reco_starting_dt)
                        : null
                    } // Convert to Date object
                    // value={VoucherDate}
                    onChange={(newValue) => setBankrecostartingDate(newValue)}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        error={!!errors.Bank_Reco_starting_dt}
                        helperText={errors.Bank_Reco_starting_dt}
                      />
                    )}
                    slotProps={{
                      textField: { size: "small", fullWidth: true },
                    }}
                    format="dd/MM/yyyy"
                    sx={{
                      marginTop: "10px",
                      marginBottom: "5px",
                      width: "250px",
                    }} // Apply margins here
                  />
                </LocalizationProvider>
              </div>
            </div>
          </form>

          <div className="bankreconcil-table">
            <table>
              <thead>
                <tr>
                  <th>Serial No</th>
                  <th>
                    Trans Date<b className="required">*</b>
                  </th>
                  <th>
                    Chq.No<b className="required">*</b>
                  </th>
                  <th>
                    Tr.cc<b className="required">*</b>
                  </th>
                  <th>
                    Acc<b className="required">*</b>
                  </th>
                  <th>
                    Cr. Amt<b className="required">*</b>
                  </th>
                  <th>
                    Dr.Amt<b className="required">*</b>
                  </th>
                  <th>Passing Date</th>
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
                          type="date"
                          value={row.Trans_dt}
                          onChange={(e) =>
                            handleInputChange(index, "Trans_dt", e.target.value)
                          }
                          style={{ width: "150px" }}
                        />
                      </td>
                      <td>
                        <input
                          type="text"
                          value={row.CheqNo}
                          onChange={(e) =>
                            handleInputChange(index, "CheqNo", e.target.value)
                          }
                          placeholder="Cheque no"
                          style={{ width: "150px" }}
                        />
                      </td>
                      <td>
                        <input
                          type="text"
                          value={row.TrCc}
                          onChange={(e) =>
                            handleInputChange(index, "TrCc", e.target.value)
                          }
                          style={{ width: "150px" }}
                          placeholder="Enter Tr cc"
                        />
                      </td>
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
                          sx={{ width: "200px" }} // Set width
                          getOptionLabel={(option) => option.label} // Fix the typo
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              placeholder="Select Acc"
                              size="small"
                              fullWidth
                            />
                          )}
                        />
                        {/* <Select
                          value={accountOptions.find(
                            (option) => option.value === row.AccountId
                          )}
                          onChange={(option) =>
                            handleInputChange(index, "AccountId", option.value)
                          }
                          options={accountOptions}
                          placeholder="Select Acc"
                          styles={{
                            control: (base) => ({
                              ...base,
                              width: "150px",
                            }),

                            menu: (base) => ({
                              ...base,
                              zIndex: 100,
                            }),
                          }}
                        /> */}
                      </td>
                      <td>
                        <input
                          type="number"
                          value={row.Cr_Amt}
                          onChange={(e) =>
                            handleInputChange(index, "Cr_Amt", e.target.value)
                          }
                          style={{ width: "150px" }}
                          placeholder="Enter Cr Amount"
                        />
                      </td>
                      <td>
                        <input
                          type="number"
                          value={row.Deb_Amt}
                          onChange={(e) =>
                            handleInputChange(index, "Deb_Amt", e.target.value)
                          }
                          style={{ width: "150px" }}
                          placeholder="Enter Dr Amount"
                        />
                      </td>
                      <td>
                        <input
                          type="date"
                          value={row.Passing_dt}
                          onChange={(e) =>
                            handleInputChange(
                              index,
                              "Passing_dt",
                              e.target.value
                            )
                          }
                          style={{ width: "150px" }}
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

          {/* Total Debit and Credit Inputs */}
          <div style={{ marginTop: "10px", display: "flex", gap: "20px" }}>
            <label className="bankreconcil-label">
              Total Credit:
              <input
                type="number"
                value={Ttl_credit}
                className="bankreconcil-control"
                readOnly
                style={{ marginLeft: "10px" }}
              />
            </label>
            <label className="bankreconcil-label">
              Total Debit:
              <input
                type="number"
                value={Ttl_debit}
                className="bankreconcil-control"
                readOnly
                style={{ marginLeft: "10px" }}
              />
            </label>
          </div>

          <div className="bankreconcil-btn-container">
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
              <u>Bank Reconcilation</u>
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
export default BankReconciliation;
