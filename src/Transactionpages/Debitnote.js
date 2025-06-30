import React, { useState, useMemo, useEffect } from "react";
import "./Debitnote.css";
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

function Debitnote() {
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

    fetchdebitheaders();
  }, []);

  const [anchorEl, setAnchorEl] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(null);
  const [selectedIndex, setSelectedIndex] = useState(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [deleteIndex, setDeleteIndex] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const [DebitNoteNo, setDebitnoteno] = useState("");
  const [VoucherDate, setVoucherDate] = useState(null);
  const [Narration, setNarration] = useState("");
  const [IsOldCheque, setIsoldcheque] = useState(false);
  const [AccountPayeeCheque, setAccountpayeecheque] = useState(false);
  const [TotalCredit, setTotalcredit] = useState("");
  const [TotalDebit, setTotaldebit] = useState("");
  const dOrCOptions = [
    { value: "D", label: "D" },
    { value: "C", label: "C" },
  ];

  const [costcenterOptions, setCostcenteroptions] = useState([]);

  const [rows, setRows] = useState([
    {
      AccountId: "",
      Amount: 0,
      DOrC: "",
      Narration: "",
    },
  ]);

  const [editingIndex, setEditingIndex] = useState(-1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [id, setId] = useState("");

  const [debitdetailId, setDebitdetailId] = useState("");
  const [errors, setErrors] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [debitheaders, setDebitheaders] = useState([]);
  const [debitdetails, setDebitdetails] = useState([]);

  //Dropdown for ID's
  const [accountOptions, setAccountOptions] = useState([]);

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
    const creditTotal = rows
      .filter((row) => row.DOrC === "C")
      .reduce((sum, row) => sum + (parseFloat(row.Amount) || 0), 0);

    const debitTotal = rows
      .filter((row) => row.DOrC === "D")
      .reduce((sum, row) => sum + (parseFloat(row.Amount) || 0), 0);

    setTotalcredit(creditTotal.toFixed(2)); // Set credit total
    setTotaldebit(debitTotal.toFixed(2)); // Set debit total
  }, [rows]);

  useEffect(() => {
    fetchdebitheaders();
    fetchdebitdetails();
    fetchAccounts();
    fetchCostcenters();
  }, []);

  const fetchdebitheaders = async () => {
    try {
      const response = await axios.get(
        "https://publication.microtechsolutions.net.in/php/Voucherhdget.php?VoucherType=DN"
      );
      setDebitheaders(response.data);
      console.log(debitheaders, "debit Note");
    } catch (error) {
      // toast.error("Error fetching debit headers:", error);
      console.error("Error fetching debit headers:", error);
    }
  };

  // Fetch the
  //  details
  const fetchdebitdetails = async () => {
    try {
      const response = await axios.get(
        "https://publication.microtechsolutions.net.in/php/Voucherdetailget.php"
      );
      // console.log(response.data, 'response of purchase return details')
      setDebitdetails(response.data);
    } catch (error) {
      console.error("Error fetching debit details:", error);
    }
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
        Amount: 0,
        DOrC: "",
        Narration: "",
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
    setIsDeleteDialogOpen(true); // Show confirmation dialog
    handleMenuClose();
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
      "https://publication.microtechsolutions.net.in/php/Voucherhddelete.php",
      requestOptions
    )
      .then((response) => response.text())
      .then((result) => console.log(result))
      .catch((error) => console.error(error));
    toast.success("Debit Note Deleted Successfully");
    setIsDeleteDialogOpen(false);
    // setDeleteIndex(deleteIndex)
    fetchdebitheaders();
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
      const accountOptions = response.data.map((acc) => ({
        value: acc.Id,
        label: acc.AccountName,
      }));
      setAccountOptions(accountOptions);
    } catch (error) {
      // toast.error("Error fetching Accounts:", error);
    }
  };

  const fetchCostcenters = async () => {
    try {
      const response = await axios.get(
        "https://publication.microtechsolutions.net.in/php/Costcenterget.php"
      );
      const costcenterOptions = response.data.map((cos) => ({
        value: cos.Id,
        label: cos.CostCenterName,
      }));
      setCostcenteroptions(costcenterOptions);
    } catch (error) {
      // toast.error("Error fetching cost centers:", error);
    }
  };

  const resetForm = () => {
    setDebitnoteno("");
    setVoucherDate("");
    setNarration("");
    setRows([
      {
        AccountId: "",
        Amount: 0,
        DOrC: "",
        Narration: "",
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
    const dnheader = debitheaders[currentRow.index];

    // Filter purchase details to match the selected PurchaseId
    const dndetail = debitdetails.filter(
      (detail) => detail.VoucherId === dnheader.Id
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

    const chequedetailDate = convertDateForInput(dndetail.ChequeDate?.date);

    // Map the details to rows
    const mappedRows = dndetail.map((detail) => ({
      VoucherId: detail.VoucherId,
      // SRN:detail.SRN ,
      AccountId: detail.AccountId,
      Amount: detail.Amount,
      DOrC: detail.DOrC,
      IsOldCheque: detail.IsOldCheque,
      AccountPayeeCheque: detail.AccountPayeeCheque,
      Narration: detail.Narration,
      CostCenterId: detail.CostCenterId,
      ChequeNo: detail.ChequeNo,
      ChequeAmount: detail.ChequeAmount,
      ChequeDate: detail.ChequeDate
        ? convertDateForInput(detail.ChequeDate.date)
        : "", // Ensure valid date
      MICRCode: detail.MICRCode,
      BankName: detail.BankName,
      BankBranch: detail.BankBranch,
      Id: detail.Id,
    }));

    const voucherdate = convertDateForInput(dnheader.VoucherDate?.date);

    // Set the form fields
    setDebitnoteno(dnheader.VoucherNo);
    setVoucherDate(voucherdate);
    setNarration(dnheader.Narration);
    // setRefNo(jvheader.RefNo);

    console.log(dnheader, "dn header");
    console.log(dndetail, "dn detail");
    console.log(mappedRows, "mapped rows");
    setRows(mappedRows);

    // Set editing state
    setEditingIndex(currentRow.index);
    setIsDrawerOpen(true);
    setIsEditing(true);
    setId(dnheader.Id);
    handleMenuClose();
    // Determine which specific detail to edit
    const specificDetail = dndetail.find(
      (detail) => detail.Id === currentRow.original.Id
    );
    if (specificDetail) {
      setDebitdetailId(specificDetail.Id); // Set the specific detail Id
    }

    fetchdebitdetails().then(() => {
      setIsLoading(false);
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // if (!validateForm()) return;

    const formattedVoucherDate = moment(VoucherDate).format("YYYY-MM-DD");

    const voucherData = {
      Id: isEditing ? id : "", // Include the Id for updating, null for new records
      VoucherType: "DN",
      VoucherNo: DebitNoteNo ? DebitNoteNo : null,
      VoucherDate: formattedVoucherDate,
      ChequeNo: 123,
      ChequeDate: formattedVoucherDate,
      Narration: Narration,
      RefNo: "RefNo",
      CreatedBy: !isEditing ? userId : undefined,
      UpdatedBy: isEditing ? userId : undefined,
    };

    try {
      const voucherUrl = isEditing
        ? "https://publication.microtechsolutions.net.in/php/Voucherhdupdate.php"
        : "https://publication.microtechsolutions.net.in/php/Voucherhdpost.php";

      // const response = await axios.post(voucherUrl, qs.stringify(voucherData), {
      const response = await axios.post(voucherUrl, voucherData, {
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
      });

      const voucherId = isEditing ? id : parseInt(response.data.Id, 10);
      const voucherNo = isEditing
        ? DebitNoteNo
        : parseInt(response.data.Id, 10);

      for (const [index, row] of rows.entries()) {
        const rowData = {
          VoucherId: voucherId,
          VoucherType: "DN",
          SRN: rows.indexOf(row) + 1,
          VoucherNo: DebitNoteNo ? DebitNoteNo : null, // Hardcoded VoucherNo
          VoucherDate: VoucherDate, // Hardcoded VoucherDate
          AccountId: parseInt(row.AccountId, 10),
          Amount: parseFloat(row.Amount),
          DOrC: row.DOrC, // Set to 'D' for the first row
          Narration: row.Narration,
          CostCenterId: row.CostCenterId,
          ChequeNo: row.ChequeNo,
          ChequeDate: row.ChequeDate,
          ChequeAmount: row.ChequeAmount,
          MICRCode: row.MICRCode,
          BankName: row.BankName,
          BankBranch: row.BankBranch,
          IsOldCheque: IsOldCheque,
          AccountPayeeCheque: AccountPayeeCheque,
          Id: row.Id,
          CreatedBy: row.Id ? undefined : userId,
          UpdatedBy: row.Id ? userId : undefined,
        };

        const voucherdetailurl =
          isEditing && row.Id
            ? "https://publication.microtechsolutions.net.in/php/Voucherdetailupdate.php"
            : "https://publication.microtechsolutions.net.in/php/Voucherdetailpost.php";

        await axios.post(voucherdetailurl, qs.stringify(rowData), {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
        });
      }

      if (isEditing) {
        setDebitheaders((prev) =>
          prev.map((voucher) =>
            voucher.Id === id ? { ...voucher, ...voucherData } : voucher
          )
        );
      } else {
        setDebitheaders((prev) => [...prev, { ...voucherData, Id: voucherId }]);
      }

      fetchdebitheaders();
      fetchdebitdetails();

      setIsDrawerOpen(false);
      toast.success(
        isEditing
          ? "DN & DN Details updated successfully!"
          : "DN & DN Details added successfully!"
      );
      resetForm(); // Reset the form fields after successful submission
    } catch (error) {
      // toast.error('Error saving record!');
      console.error("Error saving record!");
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
        accessorKey: "VoucherType",
        header: "Voucher Type",
        size: 50,
      },
      {
        accessorKey: "VoucherNo",
        header: "Voucher No",
        size: 50,
      },
      {
        accessorKey: "VoucherDate.date",
        header: "Voucher Date",
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
          <IconButton
            onClick={(event) => handleMenuOpen(event, row)} // Open the menu on click
          >
            <MoreVert />
          </IconButton>
        ),
      },
    ],
    [debitheaders]
  );

  const table = useMaterialReactTable({
    columns,
    data: debitheaders,
    muiTableHeadCellProps: {
      style: {
        backgroundColor: "#E9ECEF",
        color: "black",
        fontSize: "16px",
      },
    },
  });

  return (
    <div className="debitnote-container">
      <h1>Debit Note</h1>

      <div className="debitnotetable-master">
        <div className="debitnotetable1-master">
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
          <div className="debitnotetable-container">
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
        </div>

        <Drawer
          anchor="right"
          open={isDrawerOpen}
          // onClose={handleDrawerClose}
          PaperProps={{
            sx: {
              borderRadius: isSmallScreen ? "0" : "10px 0 0 10px",
              width: isSmallScreen ? "100%" : "70%",
              zIndex: 1000,
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
              <b>{isEditing ? "Edit Debit Note" : "Create Debit Note"}</b>
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
              <Box flex={1}>
                <Typography variant="body2" fontWeight="bold">
                  Debit Note No
                </Typography>
                <TextField
                  value={DebitNoteNo}
                  onChange={(e) => setDebitnoteno(e.target.value)}
                  size="small"
                  margin="none"
                  style={{ background: "#f5f5f5" }}
                  placeholder="Auto-Incremented"
                  InputProps={{ readOnly: true }}
                  fullWidth
                />
              </Box>

              <Box flex={1}>
                <Typography variant="body2" fontWeight="bold">
                  {" "}
                  Date
                </Typography>
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                  <DatePicker
                    value={VoucherDate ? new Date(VoucherDate) : null} // Convert to Date object
                    onChange={(newValue) => setVoucherDate(newValue)}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        error={!!errors.VoucherDate}
                        helperText={errors.VoucherDate}
                      />
                    )}
                    slotProps={{
                      textField: { size: "small", fullWidth: true },
                    }}
                    format="dd-MM-yyyy"
                  />
                </LocalizationProvider>
              </Box>

              <Box flex={1}>
                <Typography variant="body2" fontWeight="bold">
                  Narration
                </Typography>
                <TextField
                  value={Narration}
                  onChange={(e) => setNarration(e.target.value)}
                  size="small"
                  margin="none"
                  placeholder="Narration"
                  fullWidth
                />
              </Box>
            </Box>

            <div className="debitnote-table">
              <table>
                <thead>
                  <tr>
                    <th>Serial No</th>

                    <th>
                      Account Id <b className="required">*</b>
                    </th>
                    <th>
                      Dr/Cr <b className="required">*</b>
                    </th>
                    <th>
                      Narration <b className="required">*</b>
                    </th>
                    <th>
                      Amount <b className="required">*</b>
                    </th>

                    <th>
                      Cost Center Id <b className="required">*</b>
                    </th>
                    <th>
                      Cheque No <b className="required">*</b>
                    </th>
                    <th>
                      Cheque Date <b className="required">*</b>
                    </th>

                    <th>
                      Cheque Amount <b className="required">*</b>
                    </th>
                    <th>
                      MICR Code <b className="required">*</b>
                    </th>
                    <th>
                      Bank Name <b className="required">*</b>
                    </th>
                    <th>
                      Bank Branch <b className="required">*</b>
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
                          {/* {index === 0 ? (
          accountOptions.find(option => option.value === row.AccountId)?.label || ''
        ) : ( */}
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
                            sx={{ width: 250 }} // Set width
                            getOptionLabel={(option) => option.label}
                            renderInput={(params) => (
                              <TextField
                                {...params}
                                placeholder="Select Acc"
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
                          {/* )} */}
                        </td>

                        <td>
                          {/* {index === 0 ? (
          // row.DOrC
          // 'D'
          dOrCOptions.find(option => option.value === row.DOrC)?.label || 'C'

        ) : ( */}
                          <Autocomplete
                            options={dOrCOptions}
                            value={
                              dOrCOptions.find(
                                (option) => option.value === row.DOrC
                              ) || null
                            }
                            onChange={(event, newValue) =>
                              handleInputChange(
                                index,
                                "DOrC",
                                newValue ? newValue.value : ""
                              )
                            }
                            sx={{ width: 200 }} // Set width
                            getOptionLabel={(option) => option.label}
                            renderInput={(params) => (
                              <TextField
                                {...params}
                                placeholder="Select DOrC"
                                size="big"
                                fullWidth
                                sx={{
                                  "& .MuiInputBase-root": {
                                    height: "50px",
                                    // width: "150px", // Adjust height here
                                  },
                                  "& .MuiInputBase-input": {
                                    padding: "14px", // Adjust padding for better alignment
                                  },
                                }}
                              />
                            )}
                          />
                          {/* )} */}
                        </td>

                        <td>
                          {/* {index === 0 ? (
          row.Narration
        ) : ( */}
                          <input
                            type="text"
                            value={row.Narration}
                            onChange={(e) => {
                              const value = e.target.value;
                              // Limit to 500 characters
                              if (value.length <= 500) {
                                handleInputChange(index, "Narration", value);
                              }
                            }}
                            style={{
                              width: "150px",
                            }}
                            className="debitnote-control"
                            placeholder="Enter Narration"
                          />
                          {/* )} */}
                        </td>

                        <td>
                          {/* {index === 0 ? (
          row.Amount
        ) : ( */}
                          <input
                            type="number"
                            value={row.Amount}
                            onChange={(e) =>
                              handleInputChange(index, "Amount", e.target.value)
                            }
                            style={{
                              width: "150px",
                            }}
                            className="debitnote-control"
                            placeholder="Amount"
                          />
                          {/* )} */}
                        </td>

                        <td>
                          {/* {index === 0 ? (
          row.CostCenterId
        ) : ( */}

                          <Autocomplete
                            options={costcenterOptions}
                            value={
                              costcenterOptions.find(
                                (option) => option.value === row.CostCenterId
                              ) || null
                            }
                            onChange={(event, newValue) =>
                              handleInputChange(
                                index,
                                "CostCenterId",
                                newValue ? newValue.value : ""
                              )
                            }
                            sx={{ width: 250 }} // Set width
                            getOptionLabel={(option) => option.label}
                            renderInput={(params) => (
                              <TextField
                                {...params}
                                placeholder="Select Cost Center"
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
                          {/* )} */}
                        </td>

                        <td>
                          {/* {index === 0 ? (
          row.CheckNo
        ) : ( */}
                          <input
                            type="text"
                            value={row.ChequeNo}
                            onChange={(e) => {
                              const value = e.target.value;
                              if (value.length <= 15) {
                                handleInputChange(index, "ChequeNo", value);
                              }
                            }}
                            style={{
                              width: "150px",
                            }}
                            className="debitnote-control"
                            placeholder="ChequeNo"
                          />
                          {/* )} */}
                        </td>

                        <td>
                          {/* {index === 0 ? (
          row.CheckDate
        ) : ( */}

                          <input
                            type="date"
                            value={row.ChequeDate}
                            onChange={(e) =>
                              handleInputChange(
                                index,
                                "ChequeDate",
                                e.target.value
                              )
                            }
                            placeholder="Cheque Date"
                            className="debitnote-control"
                          />
                          {/* )} */}
                        </td>

                        <td>
                          {/* {index === 0 ? (
          row.CheckAmount
        ) : ( */}
                          <input
                            type="number"
                            value={row.ChequeAmount}
                            onChange={(e) => {
                              const value = e.target.value;
                              // Validate for Check Amount as well
                              const regex = /^\d{0,18}(\.\d{0,2})?$/;

                              // Check if the value matches the regex
                              if (value === "" || regex.test(value)) {
                                handleInputChange(index, "ChequeAmount", value);
                              }
                            }}
                            style={{
                              width: "150px",
                            }}
                            placeholder="Cheque Amount"
                            className="debitnote-control"
                          />
                          {/* )} */}
                        </td>
                        <td>
                          {/* {index === 0 ? (
          row.MICRCode
        ) : ( */}
                          <input
                            type="text"
                            value={row.MICRCode}
                            onChange={(e) => {
                              const value = e.target.value;
                              if (value.length <= 30) {
                                handleInputChange(index, "MICRCode", value);
                              }
                            }}
                            style={{
                              width: "150px",
                            }}
                            placeholder="MICR Code"
                            className="debitnote-control"
                          />
                          {/* )} */}
                        </td>
                        <td>
                          {/* {index === 0 ? (
          row.BankName
        ) : ( */}
                          <input
                            type="text"
                            value={row.BankName}
                            onChange={(e) => {
                              const value = e.target.value;
                              if (value.length <= 50) {
                                handleInputChange(index, "BankName", value);
                              }
                            }}
                            style={{
                              width: "150px",
                            }}
                            placeholder="Bank Name"
                            className="debitnote-control"
                          />
                          {/* )} */}
                        </td>
                        <td>
                          {/* {index === 0 ? (
          row.BankBranch
        ) : ( */}
                          <input
                            type="text"
                            value={row.BankBranch}
                            onChange={(e) => {
                              const value = e.target.value;
                              if (value.length <= 50) {
                                handleInputChange(index, "BankBranch", value);
                              }
                            }}
                            style={{
                              width: "150px",
                            }}
                            placeholder="Bank Branch"
                            className="debitnote-control"
                          />
                          {/* )} */}
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

            {/* Total Credit & Debit Inputs Below the Table */}
            <Box display="flex" justifyContent="flex-end" mt={1} gap={2}>
              <Box>
                <Typography variant="body2" fontWeight="bold">
                  Total Credit
                </Typography>
                <TextField
                  variant="outlined"
                  value={TotalCredit}
                  size="small"
                  margin="normal"
                  InputProps={{ readOnly: true }}
                />
              </Box>

              <Box>
                <Typography variant="body2" fontWeight="bold">
                  Total Debit
                </Typography>
                <TextField
                  variant="outlined"
                  value={TotalDebit}
                  size="small"
                  margin="normal"
                  InputProps={{ readOnly: true }}
                />
              </Box>
            </Box>
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
              <u>Debit Note</u>
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
export default Debitnote;
