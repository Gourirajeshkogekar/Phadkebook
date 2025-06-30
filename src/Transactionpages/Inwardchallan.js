import React, { useState, useMemo, useEffect } from "react";
import "./Inwardchallan.css";
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
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { DatePicker } from "@mui/x-date-pickers";
import { Edit, Delete, Add, MoreVert, Print } from "@mui/icons-material";

function Invertchallan() {
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

    fetchInvertChallan();
  }, []);

  const [pageIndex, setPageIndex] = useState(1); // Current page
  const [totalPages, setTotalPages] = useState(1);
  const [InvertDate, setInvertDate] = useState("");
  const [InvertNo, setInvertNo] = useState(null);
  const [AccountId, setAccountId] = useState("");
  const [DCNo, setDcno] = useState("");
  const [DCDate, setDcdate] = useState("");
  const [TotalCopies, setTotalCopies] = useState("");
  const [TotalAmount, setTotalAmount] = useState("");
  const [Remark, setRemark] = useState("");
  const [IsPaperPurchase, setIsPaperPurchase] = useState("false");

  const [editingIndex, setEditingIndex] = useState(-1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [id, setId] = useState("");

  const [invertdetailId, setInvertDetailId] = useState("");
  const [errors, setErrors] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [invertchallans, setInvertchallans] = useState([]);
  const [invertdetails, setInvertdetails] = useState([]);

  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [deleteIndex, setDeleteIndex] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(null);

  const [currentRow, setCurrentRow] = useState(null);

  const handleMenuOpen = (event, row) => {
    setAnchorEl(event.currentTarget);
    setCurrentRow(row);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  //Dropdown for ID's
  const [bookOptions, setBookOptions] = useState([]);
  const [accountOptions, setAccountOptions] = useState([]);
  const [rows, setRows] = useState([
    {
      BookId: "", // Default value for the first row
      Copies: 0,
      Rate: 0,
      DiscountPercentage: 0,
      DiscountAmount: 0,
      Amount: 0,
    },
  ]);

  useEffect(() => {
    fetchInvertChallan();
    fetchInvertDetail();
    fetchBooks();
    fetchAccounts();
  }, []);

  // const fetchInvertChallan = async () => {
  //   try {
  //     const response = await axios.get("https://publication.microtechsolutions.net.in/php/Invertchallanheaderget.php");
  //     setInvertchallans(response.data);
  //   } catch (error) {
  //     // toast.error("Error fetching Inward challans:", error);
  //   }
  // };

  useEffect(() => {
    fetchInvertChallan();
    console.log("this function is called");
  }, [pageIndex]); // Fetch data when page changes

  const fetchInvertChallan = async () => {
    try {
      const response = await axios.get(
        `https://publication.microtechsolutions.net.in/php/get/gettblpage.php?Table=InvertChallanHeader&PageNo=${pageIndex}`
      );
      console.log(response.data, "response of inward challan header");

      setInvertchallans(response.data.data);
      setTotalPages(response.data.total_pages);
    } catch (error) {
      // toast.error("Error fetching sells challans:", error);
    }
  };

  // Fetch the purchase details
  const fetchInvertDetail = async () => {
    try {
      const response = await axios.get(
        "https://publication.microtechsolutions.net.in/php/Invertchallandetailget.php"
      );
      // console.log(response.data, 'response of purchase return details')
      setInvertdetails(response.data);
    } catch (error) {
      // toast.error("Error fetching Inward details:", error);
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

  // Calculation functions
  const calculateTotals = () => {
    let totalCopies = 0;
    let total = 0;

    rows.forEach((row) => {
      totalCopies += Number(row.Copies) || 0;
      total += Number(row.Amount) || 0;
    });
    setTotalCopies(totalCopies);
    setTotalAmount(total);
  };

  const handleInputChange = (index, field, value) => {
    const updatedRows = [...rows];

    // Update the value of the current field
    updatedRows[index][field] = value;

    // Calculate the Amount when Copies and Rate are entered
    if (field === "Copies" || field === "Rate") {
      const copies = updatedRows[index].Copies || 0;
      const rate = updatedRows[index].Rate || 0;
      updatedRows[index].Amount = copies * rate;
    }

    // Calculate the DiscountAmount and FinalAmount when DiscountPercentage is entered
    if (
      field === "DiscountPercentage" ||
      field === "Copies" ||
      field === "Rate"
    ) {
      const discountPercentage = updatedRows[index].DiscountPercentage || 0;
      const amount = updatedRows[index].Amount || 0;
      updatedRows[index].DiscountAmount = (amount * discountPercentage) / 100;
      updatedRows[index].Amount = amount - updatedRows[index].DiscountAmount;
    }

    // Update the state with the new row data
    setRows(updatedRows);
    calculateTotals();
  };

  const handleAddRow = () => {
    setRows([
      ...rows,
      {
        BookId: "", // This will be empty for new rows
        SerialNo: "",
        Copies: "",
        Rate: "",
        DiscountPercentage: "",
        DiscountAmount: "",
        Amount: "",
      },
    ]);
    calculateTotals();
  };

  const handleDeleteRow = (index) => {
    const updatedRows = rows.filter((_, i) => i !== index);
    setRows(updatedRows);
    toast.success("Book Details Deleted Succefully");
    calculateTotals();
  };

  const resetForm = () => {
    setInvertDate("");
    setInvertNo("");
    setAccountId("");
    setDcno("");
    setDcdate("");

    setTotalAmount("");
    setTotalCopies("");
    setRemark("");
    setIsPaperPurchase("");
    setRows([
      {
        BookId: "",
        Copies: 0,
        Rate: 0,
        DiscountPercentage: 0,
        DiscountAmount: 0,
        Amount: 0,
      },
    ]);
  };

  useEffect(() => {
    calculateTotals();
  }, [rows]);

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
    setIsLoading(true);
    const invertchallan = invertchallans[currentRow.index];

    // Filter purchase details to match the selected PurchaseId
    const invertchallandetail = invertdetails.filter(
      (detail) => detail.InvertId === invertchallan.Id
    );

    // Map the details to rows
    const mappedRows = invertchallandetail.map((detail) => ({
      // InvertId:200,
      InvertId: detail.InvertId,
      BookId: detail.BookId,
      Copies: detail.Copies,
      Rate: detail.Rate,
      DiscountPercentage: detail.DiscountPercentage,
      DiscountAmount: detail.DiscountAmount,
      Amount: detail.Amount,
      Id: detail.Id, // Include the detail Id in the mapped row for tracking
    }));

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

    const invertdate = convertDateForInput(invertchallan.InvertDate.date);
    const dcdate = convertDateForInput(invertchallan.DCDate.date);

    // Set the form fields
    setInvertDate(invertdate);
    setInvertNo(invertchallan.InvertNo);

    setAccountId(invertchallan.AccountId);
    setDcno(invertchallan.DCNo);
    setDcdate(dcdate);
    setTotalAmount(invertchallan.TotalAmount);
    setTotalCopies(invertchallan.TotalCopies);
    setRemark(invertchallan.Remark);
    setIsPaperPurchase(invertchallan.IsPaperPurchase);

    //   console.log(invertchallan, 'invert challan ');
    //   console.log(invertchallandetail, 'invert challan detail')
    // console.log(mappedRows, 'mapped rows')
    // Set the rows for the table with all the details
    setRows(mappedRows);

    // Set editing state
    setEditingIndex(currentRow.index);
    setIsModalOpen(true);
    setIsEditing(true);
    setId(invertchallan.Id);
    handleMenuClose();
    // Determine which specific detail to edit
    const specificDetail = invertchallandetail.find(
      (detail) => detail.Id === currentRow.original.Id
    );
    if (specificDetail) {
      setInvertDetailId(specificDetail.Id); // Set the specific detail Id
    }

    fetchInvertDetail().then(() => {
      setIsLoading(false); // Stop loading after data is fetched
    });
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

    const urlencoded = new URLSearchParams();
    urlencoded.append("Id", deleteId);

    const requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: urlencoded,
      redirect: "follow",
    };

    fetch(
      "https://publication.microtechsolutions.net.in/php/Invertchallanheaderdelete.php",
      requestOptions
    )
      .then((response) => response.text())
      .then((result) => console.log(result))
      .catch((error) => console.error(error));
    toast.success("Inward Challan Deleted Successfully");
    setIsDeleteDialogOpen(false);
    // setDeleteIndex(deleteIndex)
    fetchInvertChallan();
  };

  const cancelDelete = () => {
    setIsDeleteDialogOpen(false);
    setDeleteIndex(null);
  };

  const validateForm = () => {
    let formErrors = {};
    let isValid = true;

    // if (!InvertNo) {
    //   formErrors.InvertNo = "Inward No  is required.";
    //   isValid = false;
    // }
    if (!InvertDate) {
      formErrors.InvertDate = "Inward Date is required.";
      isValid = false;
    }

    if (!DCNo) {
      formErrors.DCNo = "DC No is required.";
      isValid = false;
    }
    if (!AccountId) {
      formErrors.AccountId = "Account Id is required.";
      isValid = false;
    }
    if (!DCDate) {
      formErrors.DCDate = "DC Date is required.";
      isValid = false;
    }

    if (!TotalAmount) {
      formErrors.TotalAmount = "Total Amount is required.";
      isValid = false;
    }
    if (!TotalCopies) {
      formErrors.TotalCopies = "Total Copies is required.";
      isValid = false;
    }
    if (!Remark) {
      formErrors.Remark = "Remark is required.";
      isValid = false;
    }

    setErrors(formErrors);
    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    const formattedInvertDate = moment(InvertDate).format("YYYY-MM-DD");

    const invertchallandata = {
      Id: isEditing ? id : "", // Include the Id for updating, null for new records
      InvertDate: formattedInvertDate,
      // InvertNo: InvertNo,
      AccountId: AccountId,
      DCNo: DCNo,
      DCDate: DCDate,
      TotalAmount: TotalAmount,
      TotalCopies: TotalCopies,
      Remark: Remark,
      IsPaperPurchase: IsPaperPurchase,
      CreatedBy: !isEditing ? userId : undefined,
      UpdatedBy: isEditing ? userId : undefined,
    };

    try {
      const invertchallanurl = isEditing
        ? "https://publication.microtechsolutions.net.in/php/Invertchallanheaderupdate.php"
        : "https://publication.microtechsolutions.net.in/php/Invertchallanheaderpost.php";

      // Submit purchase header data
      const response = await axios.post(
        invertchallanurl,
        // qs.stringify(invertchallandata),
        invertchallandata,
        {
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
        }
      );

      // const purchasereturnId = isEditing ? id : parseInt(response.data.newId, 10);
      const invertid = isEditing ? id : parseInt(response.data.Id, 10);

      for (const row of rows) {
        const rowData = {
          InvertId: invertid,
          SerialNo: rows.indexOf(row) + 1,
          BookId: parseInt(row.BookId, 10),
          Copies: parseInt(row.Copies, 10),
          Rate: parseFloat(row.Rate),
          DiscountPercentage: parseFloat(row.DiscountPercentage),
          DiscountAmount: parseFloat(row.DiscountAmount),
          Amount: parseFloat(row.Amount),
          Id: row.Id,
          CreatedBy: row.Id ? undefined : userId,
          UpdatedBy: row.Id ? userId : undefined,
        };

        const invertchallandetailurl =
          isEditing && row.Id
            ? "https://publication.microtechsolutions.net.in/php/Invertchallandetailupdate.php"
            : "https://publication.microtechsolutions.net.in/php/Invertchallandetailpost.php";

        await axios.post(invertchallandetailurl, qs.stringify(rowData), {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
        });
      }

      fetchInvertChallan();
      fetchInvertDetail();
      setIsModalOpen(false);
      toast.success(
        isEditing
          ? "Inward challan & Inward challan Details updated successfully!"
          : "Inward challan & Inward Challan Details added successfully!"
      );
      resetForm(); // Reset the form fields after successful submission
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
        accessorKey: "InvertNo",
        header: "Inward Challan No",
        size: 50,
      },
      {
        accessorKey: "InvertDate.date",
        header: "Inward Date",
        size: 50,
        Cell: ({ cell }) => {
          // Using moment.js to format the date
          const date = moment(cell.getValue()).format("DD-MM-YYYY");
          return <span>{date}</span>;
        },
      },

      {
        accessorKey: "TotalAmount",
        header: "Total",
        size: 50,
      },

      {
        accessorKey: "Remark",
        header: "Remark",
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
    [invertchallans]
  );

  const table = useMaterialReactTable({
    columns,
    data: invertchallans,
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
    <div className="invertc-container">
      <h1>Inward Challan</h1>

      <div className="invertctable-master">
        <div className="invertctable1-master">
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
          <div className="invertctable-container">
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

        {isModalOpen && (
          <div
            className="invertc-overlay"
            onClick={() => setIsModalOpen(false)}
          />
        )}

        <Modal open={isModalOpen}>
          <div className="invertc-modal">
            <h2
              style={{
                textAlign: "center",
                fontWeight: "620",
                margin: "2px",
                fontSize: "27px",
              }}>
              {editingIndex >= 0
                ? "Edit Inward Challan "
                : "Add Inward Challan"}
            </h2>
            <form className="invertc-form">
              <div>
                <label className="invertc-label">
                  Inward No <b className="required">*</b>
                </label>
                <div>
                  <input
                    type="text"
                    id="InvertNo"
                    name="InvertNo"
                    value={InvertNo}
                    onChange={(e) => setInvertNo(e.target.value)}
                    style={{ background: "#f5f5f5" }}
                    className="invertc-control"
                    placeholder="Auto-Incremented"
                    readOnly
                  />
                </div>

                <div>
                  {errors.InvertNo && (
                    <b className="error-text">{errors.InvertNo}</b>
                  )}
                </div>
              </div>

              <div>
                <label className="invertc-label">
                  Inward Date <b className="required">*</b>
                </label>
                <div>
                  <input
                    type="date"
                    id="InvertDate"
                    name="InvertDate"
                    value={InvertDate}
                    onChange={(e) => setInvertDate(e.target.value)}
                    className="invertc-control"
                    placeholder="Enter Inward Date"
                  />
                </div>

                <div>
                  {errors.InvertDate && (
                    <b className="error-text">{errors.InvertDate}</b>
                  )}
                </div>
              </div>

              <div>
                <label className="invertc-label">
                  {" "}
                  Account <b className="required">*</b>
                </label>
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

                <div>
                  {errors.AccountId && (
                    <b className="error-text">{errors.AccountId}</b>
                  )}
                </div>
              </div>

              <div>
                <label className="invertc-label">
                  DC No <b className="required">*</b>
                </label>
                <div>
                  <input
                    type="text"
                    id="DCNo"
                    name="DCNo"
                    value={DCNo}
                    onChange={(e) => setDcno(e.target.value)}
                    maxLength={20}
                    className="invertc-control"
                    placeholder="Enter DC No"
                  />
                </div>

                <div>
                  {errors.DCNo && <b className="error-text">{errors.DCNo}</b>}
                </div>
              </div>

              <div>
                <label className="invertc-label">
                  DC Date <b className="required">*</b>
                </label>
                <div>
                  <input
                    type="date"
                    id="DCDate"
                    name="DCDate"
                    value={DCDate}
                    onChange={(e) => setDcdate(e.target.value)}
                    className="invertc-control"
                    placeholder="Enter DC Date"
                  />
                </div>
                <div>
                  {errors.DCDate && (
                    <b className="error-text">{errors.DCDate}</b>
                  )}
                </div>
              </div>
            </form>

            <div className="invertc-table">
              <table>
                <thead>
                  <tr>
                    <th>Serial No</th>
                    <th>Book Code</th>
                    <th>
                      Book Name <b className="required">*</b>
                    </th>
                    <th>
                      Copies <b className="required">*</b>
                    </th>
                    <th>
                      Rate <b className="required">*</b>
                    </th>
                    <th>
                      Discount Percentage <b className="required">*</b>
                    </th>
                    <th>
                      Discount Amount <b className="required">*</b>
                    </th>
                    <th>
                      Amount <b className="required">*</b>
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
                            placeholder="Copies"
                          />
                        </td>
                        <td>
                          <input
                            type="number"
                            value={row.Rate}
                            onChange={(e) => {
                              const value = e.target.value;
                              // Regex to validate decimal numbers with at most 18 digits total and 2 decimal places
                              const regex = /^\d{0,18}(\.\d{0,2})?$/;

                              // Check if the value matches the regex
                              if (value === "" || regex.test(value)) {
                                handleInputChange(index, "Rate", value);
                              }
                            }}
                            placeholder="Rate"
                          />
                        </td>
                        <td>
                          <input
                            type="number"
                            value={row.DiscountPercentage}
                            onChange={(e) => {
                              const value = e.target.value;
                              // Regex to validate decimal numbers with at most 18 digits total and 2 decimal places
                              const regex = /^\d{0,18}(\.\d{0,2})?$/;

                              // Check if the value matches the regex
                              if (value === "" || regex.test(value)) {
                                handleInputChange(
                                  index,
                                  "DiscountPercentage",
                                  value
                                );
                              }
                            }}
                            placeholder="Discount %"
                          />
                        </td>
                        <td>
                          <input
                            type="number"
                            value={row.DiscountAmount}
                            readOnly
                            placeholder="Discount Amount"
                          />
                        </td>
                        <td>
                          <input
                            type="number"
                            value={row.Amount}
                            readOnly
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
              </table>
            </div>
            <form className="invertc-form">
              <div>
                <label className="invertc-label">
                  Total Copies <b className="required">*</b>
                </label>
                <div>
                  <input
                    type="text"
                    id="TotalCopies"
                    name="TotalCopies"
                    value={TotalCopies}
                    onChange={(e) => setTotalCopies(e.target.value)}
                    className="invertc-control"
                    placeholder="Enter Total Copies"
                  />
                </div>
                <div>
                  {errors.TotalCopies && (
                    <b className="error-text">{errors.TotalCopies}</b>
                  )}
                </div>
              </div>

              <div>
                <label className="invertc-label">
                  Total Amount <b className="required">*</b>
                </label>
                <div>
                  <input
                    type="text"
                    id="TotalAmount"
                    name="TotalAmount"
                    value={TotalAmount}
                    onChange={(e) => {
                      const value = e.target.value;

                      // Regex to validate decimal numbers with at most 18 digits total and 2 decimal places
                      const regex = /^\d{0,18}(\.\d{0,2})?$/;

                      // Check if the value matches the regex
                      if (value === "" || regex.test(value)) {
                        setTotalAmount(value);
                      }
                    }}
                    className="invertc-control"
                    placeholder="Enter Total Amount"
                  />
                </div>
                <div>
                  {errors.TotalAmount && (
                    <b className="error-text">{errors.TotalAmount}</b>
                  )}
                </div>
              </div>

              <div>
                <label className="invertc-label">
                  Remark <b className="required">*</b>
                </label>
                <div>
                  <input
                    type="text"
                    id="Remark"
                    name="Remark"
                    value={Remark}
                    onChange={(e) => setRemark(e.target.value)}
                    maxLength={200}
                    className="invertc-control"
                    placeholder="Enter Remark"
                  />
                </div>
                <div>
                  {errors.Remark && (
                    <b className="error-text">{errors.Remark}</b>
                  )}
                </div>
              </div>

              <div>
                <label className="invertc-label">Is Paper Purchase?:</label>

                <input
                  type="checkbox"
                  id="IsPaperPurchase"
                  name="IsPaperPurchase"
                  checked={IsPaperPurchase}
                  onChange={(e) => setIsPaperPurchase(e.target.checked)}
                  className="invertc-control"
                  placeholder="Enter Is Paper Purchase"
                />
              </div>
            </form>
            <div className="invertc-btn-container">
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

        {/* Confirmation Dialog for Delete */}
        <Dialog open={isDeleteDialogOpen} onClose={cancelDelete}>
          <DialogTitle style={{ color: "navy", fontWeight: "600" }}>
            Confirm Deletion
          </DialogTitle>
          <DialogContent>
            Are you sure you want to delete this{" "}
            <b style={{ color: "red" }}>
              <u>Inward Challan</u>
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

export default Invertchallan;
