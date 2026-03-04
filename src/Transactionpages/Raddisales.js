import React, { useState, useMemo, useEffect } from "react";
import "./Raddisales.css";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Button, TextField, Modal, Typography , Grid, TableCell, TableContainer, Table,Paper, TableHead, TableRow, TableBody} from "@mui/material";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import qs from "qs";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Box,
  Autocomplete,
} from "@mui/material";
import dayjs from "dayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
   
function Raddisales() {
  const [userId, setUserId] = useState("");
  const [yearid, setYearId] = useState("");
  const [pageIndex, setPageIndex] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [deleteIndex, setDeleteIndex] = useState(null);
  const [deleteId, setDeleteId] = useState(null);

  // Header fields
  const [DocNo, setDocNo] = useState("");

  const [BookId, setBookId] = useState("");
  const [Rate, setRate] = useState("");
  const [number, setNumber] = useState("");
  const [safedate, setsafedate] = useState(dayjs());
  const [dateerror, setdateerror] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [id, setId] = useState(""); // header id when editing

  // Book dropdowns + main dataset
  const [bookOptions, setBookOptions] = useState([]);
  const [raddisales, setRaddisales] = useState([]);

  // Rows for detail lines of current document (editable table)
  const [rows, setRows] = useState([]); // each: { BookId, Rate, Number, Id? , DocNo? }
  const [selectedRowIndex, setSelectedRowIndex] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    const storedUserId = sessionStorage.getItem("UserId");
    const storedYearId = sessionStorage.getItem("YearId");
    if (storedUserId) setUserId(storedUserId);
    if (storedYearId) setYearId(storedYearId);

    fetchBooks();
  }, []);

  useEffect(() => {
    fetchRaddisales();
  }, [pageIndex]);

  const fetchRaddisales = async () => {
    try {
      const response = await axios.get(
        `https://publication.microtechsolutions.net.in/php/get/gettblpage.php?Table=Raddisales&PageNo=${pageIndex}`
      );
      const allRows = response.data.data || [];
      // Accept Active as number 1 or string "1"
      const activeRows = allRows.filter(
        (r) => r?.Active === 1 || r?.Active === "1"
      );
      setRaddisales(activeRows);
      setTotalPages(response.data.total_pages || 1); // note: totalPages still reflects server-side count
    } catch (err) {
      console.error("fetchRaddisales error", err);
    }
  };

 const fetchBooks = async () => {
  try {
    const response = await axios.get(
      "https://publication.microtechsolutions.net.in/php/Bookget.php"
    );

    const opts = response.data.map((b) => ({
      Id: b.Id,
      BookCode: b.BookCode,
      BookName: b.BookName || b.BookNameMarathi,
      Rate: b.BookRate,
    }));

    setBookOptions(opts);
  } catch (err) {
    console.error("fetchBooks error", err);
  }
};


  const resetForm = () => {
    setDocNo("");
    setsafedate(dayjs());
    setdateerror("");
    setRows([]);
    setIsEditing(false);
    setId("");
    setRows([{
      BookId: null,
      BookCode: "",
      BookName: "",
      Rate: "",
      Number: "",
    },])
  };

  const handleNewClick = () => {
    resetForm();
    setIsModalOpen(true);
  };

  // Inline table operations
const handleAddEmptyRow = () => {
  setRows((prev) => [
    ...prev,
    {
      BookId: null,
      BookCode: "",
      BookName: "",
      Rate: "",
      Number: "",
    },
  ]);
};


  const handleChangeRow = (index, field, value) => {
    setRows((prev) => {
      const copy = [...prev];
      copy[index] = { ...copy[index], [field]: value };
      return copy;
    });
  };

  const handleDeleteRow = (index) => {
    // If row has server Id, optionally delete from server immediately
    const row = rows[index];
    if (row?.Id) {
      // delete server-side
      fetch(
        `https://publication.microtechsolutions.net.in/php/deletetable.php?Id=${row.Id}&Table=RaddiSales`,
        { method: "POST" }
      )
        .then(() => toast.success("Row deleted on server"))
        .catch(() => toast.error("Failed to delete row on server"));
    }
    setRows((prev) => prev.filter((_, i) => i !== index));
  };

  const handleEditDocument = async (raddisaleRow) => {
  try {
    if (bookOptions.length === 0) {
      toast.error("Books not loaded yet");
      return;
    }

    const docNo = raddisaleRow.DocNo;
    const backendDate = raddisaleRow.Date?.date;

    const res = await axios.get(
      `https://publication.microtechsolutions.net.in/php/get/getbycolm.php?Table=RaddiSales&Colname=DocNo&Colvalue=${docNo}`
    );

    const rowsData = res.data || [];
    const filteredRows = rowsData.filter(
      (r) =>
        Number(r.DocNo) === Number(docNo) &&
        (r.Active === 1 || r.Active === "1" || r.Active === true)
    );

    const mapped = filteredRows.map((r) => {
      const book = bookOptions.find(
        (b) => Number(b.Id) === Number(r.BookId)
      );

      return {
        Id: r.Id || null,
        BookId: r.BookId,
        BookCode: book?.BookCode || "",
        BookName: book?.BookName || "",
        Rate: r.Rate,
        Number: r.Number,
        DocNo: r.DocNo,
      };
    });

    setDocNo(docNo);
    setsafedate(backendDate ? dayjs(backendDate) : dayjs());
    setIsEditing(true);
    setId(raddisaleRow.Id || "");
    setRows(mapped);
    setIsModalOpen(true);
  } catch (err) {
    console.error("Error loading details:", err);
    toast.error("Failed to load document details");
  }
};

  const handleSubmit = async () => {
    const formattedDate = dayjs(safedate).format("YYYY-MM-DD");
    let generatedDocNo = DocNo; // store the first DocNo received from backend

    for (let i = 0; i < rows.length; i++) {
      const row = rows[i];

      const payload = {
        Id: id || "",
        Date: formattedDate,
        CreatedBy: !isEditing ? userId : undefined,
        UpdatedBy: isEditing ? userId : undefined,
        // ✅ If we already got a DocNo from first insert, reuse it
        DocNo: generatedDocNo || "",
        BookId: row.BookId,
        Rate: row.Rate,
        Number: row.Number,
      };

      const url = isEditing
        ? "https://publication.microtechsolutions.net.in/php/update/raddisales.php"
        : "https://publication.microtechsolutions.net.in/php/post/raddisales.php";

      try {
        const response = await axios.post(url, qs.stringify(payload), {
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
        });

        console.log("Response for row:", response.data);

        if (response.data.success) {
          // ✅ Capture DocNo from FIRST successful insert only
          if (i === 0 && response.data.DocNo) {
            generatedDocNo = response.data.DocNo;
          }
        } else {
          toast.error(`Failed to save BookId ${row.BookId}`);
          return;
        }
      } catch (error) {
        console.error("Axios error:", error);
        toast.error(`Error saving BookId ${row.BookId}`);
        return;
      }
    }

    toast.success(
      isEditing
        ? "Raddi Sales updated successfully!"
        : "Raddi Sales saved successfully!"
    );
    fetchRaddisales();
    resetForm();
    setIsModalOpen(false);
  };

  // Delete whole document
  const handleDeleteDocument = (index, Id) => {
    setDeleteIndex(index);
    setDeleteId(Id);
    setIsDeleteDialogOpen(true);
  };
  const confirmDelete = async () => {
    try {
      await fetch(
        `https://publication.microtechsolutions.net.in/php/deletetable.php?Id=${deleteId}&Table=RaddiSales`,
        { method: "POST" }
      );
      toast.success("Deleted");
      setIsDeleteDialogOpen(false);
      fetchRaddisales();
    } catch (err) {
      toast.error("Delete failed");
    }
  };
  const cancelDelete = () => {
    setIsDeleteDialogOpen(false);
    setDeleteIndex(null);
  };

  // helper to find Book option object
  const findBookOptionObj = (valueOrLabel) => {
    if (valueOrLabel == null) return null;
    return (
      bookOptions.find((b) => b.value === valueOrLabel) ||
      bookOptions.find((b) => b.label === valueOrLabel) ||
      null
    );
  };

  return (
    <>
      <div className="raddisales-container">
      <h1 style={{textAlign:'center', }}>Raddi Sales</h1>

  <Box
  sx={{
    position: "sticky",
    bottom: 10,
    display: "flex",
    justifyContent: "flex-start",
    mt: 1,mb:2
  }}
>
  <Button
    variant="contained"
    onClick={handleNewClick}
    sx={{ background: "#0a60bd" }}
  >
    New
  </Button>
</Box>


        {/* Main list (simple table showing server rows) */}
       <Box sx={{ mb: 2 }}>
  <TableContainer
    component={Paper}
    sx={{ maxHeight: 300 }}
  >
    <Table stickyHeader size="small">
<TableHead
  sx={{
     "& .MuiTableCell-root": {
       fontWeight: "500",fontSize:'16px',
      textAlign: "center",
    },
  }}
>        <TableRow>
          <TableCell align="center"><b>Sr</b></TableCell>
          <TableCell align="center"><b>Doc No</b></TableCell>
          <TableCell align="center"><b>Date</b></TableCell>
          <TableCell align="center"><b>Actions</b></TableCell>
        </TableRow>
      </TableHead>

      <TableBody>
        {raddisales && raddisales.length > 0 ? (
          raddisales.map((r, idx) => (
            <TableRow key={idx} hover>
              <TableCell align="center">{idx + 1}</TableCell>

              <TableCell align="center">
                {r.DocNo}
              </TableCell>

              <TableCell align="center">
                {r.Date?.date
                  ? dayjs(r.Date.date.substring(0, 10)).format("DD-MM-YYYY")
                  : ""}
              </TableCell>

              <TableCell align="center">
                <Button
                  size="small"
                  onClick={() => handleEditDocument(r, idx)}
                >
                  Edit
                </Button>
                <Button
                  size="small"
                  color="error"
                  sx={{ ml: 1 }}
                  onClick={() => handleDeleteDocument(idx, r.Id)}
                >
                  Delete
                </Button>
              </TableCell>
            </TableRow>
          ))
        ) : (
          <TableRow>
            <TableCell colSpan={4} align="center">
              No records found
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  </TableContainer>
</Box>


       <Box
  sx={{
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    gap: 2,
    mt: 1,
  }}
>
  <Button
    onClick={() =>
      setPageIndex((prev) => Math.max(prev - 1, 1))
    }
  >
    ◀ Prev
  </Button>

  <TextField
    type="number"
    size="small"
    value={pageIndex}
    onChange={(e) => {
      const val = Number(e.target.value);
      if (!isNaN(val) && val >= 1) setPageIndex(val);
    }}
    sx={{ width: 80 }}
  />

  <Button onClick={() => setPageIndex((prev) => prev + 1)}>
    Next ▶
  </Button>

  <Typography variant="body2">
    Total Pages: {totalPages}
  </Typography>
</Box>


        {/* Modal for Add/Edit Document */}
       

        <Modal open={isModalOpen} onClose={() => setIsModalOpen(false)}>
  <Box
    sx={{
      position: "absolute",
      top: "40%",
      left: "50%",
      transform: "translate(-50%, -50%)",
      width: 1000,
      bgcolor: "background.paper",
      boxShadow: 24,
      p: 3,
      borderRadius: 2,
    }}
  >
    <Typography variant="h6" align="center"  mb={2}>
    <b>{isEditing ? "Edit Raddi Sales" : "Create Raddi Sales"}</b>
    </Typography>

    {/* Header fields */}

     <Grid container spacing={2} mb={2}>
  <Grid item xs={4} md={6}>
  <Typography variant="subtitle2" sx={{ fontWeight: 'bold', mb: 1 }}>
  Doc No
</Typography>


    <TextField
       value={DocNo}
      onChange={(e) => setDocNo(e.target.value)}
                   sx={{ width: 200 }}

    />
  </Grid>

  <Grid item xs={6} md={6}>
    <Typography variant="subtitle2" sx={{ fontWeight: 'bold', mb: 1 }}>
  Date
</Typography>

    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DatePicker
        
        value={safedate}
        onChange={setsafedate}
        format="DD-MM-YYYY"
        slotProps={{ textField: { width:200 } }}
      />
    </LocalizationProvider>
  </Grid>
</Grid>


                {/* Editable details table (inline inputs) */}
                <div style={{ marginTop: 8 }}>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      marginBottom: 8,
                    }}>
                    <strong>Books</strong>
                    <div>
                      <Button
                        variant="contained"
                        sx={{ background: "#0a60bd", mr: 1 }}
                        onClick={handleAddEmptyRow}>
                        Add Item
                      </Button>
                      <Button
                        variant="contained"
                        color="error"
                        onClick={() => {
                          if (selectedRowIndex === null) {
                            toast.warning(
                              "Select a row to delete by clicking it"
                            );
                          } else {
                            handleDeleteRow(selectedRowIndex);
                            setSelectedRowIndex(null);
                          }
                        }}>
                        Delete Item
                      </Button>
                    </div>
                  </div>
                  <TableContainer component={Paper} sx={{ maxHeight: 200 }}>
  <Table stickyHeader size="small">
<TableHead
  sx={{
    "& .MuiTableCell-root": {
      fontWeight: "bold",
      textAlign: "center",
    },
  }}
>      <TableRow>
        <TableCell align="center">Sr</TableCell>
        <TableCell align="center">Book Code</TableCell>
        <TableCell>Book Name</TableCell>
        <TableCell align="center">Rate</TableCell>
        <TableCell align="center">Nos</TableCell>
      </TableRow>
    </TableHead>

    <TableBody>
      {rows.map((row, idx) => (
        <TableRow
          key={idx}
          hover
          selected={selectedRowIndex === idx}
          onClick={() => setSelectedRowIndex(idx)}
        >
          <TableCell align="center">{idx + 1}</TableCell>

          {/* Book Code */}
          <TableCell align="center">
            <TextField
              value={row.BookCode}
              size="small"
              sx={{ width: 100 }}
              onChange={(e) => {
                const code = e.target.value;
                handleChangeRow(idx, "BookCode", code);

                const matchedBook = bookOptions.find(
                  (b) => String(b.BookCode) === String(code)
                );

                if (matchedBook) {
                  handleChangeRow(idx, "BookId", matchedBook.Id);
                  handleChangeRow(idx, "BookName", matchedBook.BookName);
                  handleChangeRow(idx, "Rate", matchedBook.Rate);
                } else {
                  handleChangeRow(idx, "BookId", null);
                  handleChangeRow(idx, "BookName", "");
                  handleChangeRow(idx, "Rate", "");
                }
              }}
            />
          </TableCell>

          {/* Book Name */}
          <TableCell>
            <TextField
              value={row.BookName || row.BookNameMarathi}
              size="small"
                            sx={{ width: 500 }}

               
              InputProps={{ readOnly: true }}
            />
          </TableCell>

          {/* Rate */}
          <TableCell align="center">
            <TextField
              value={row.Rate}
              size="small"
              InputProps={{ readOnly: true }}
              sx={{ width: 100 }}
            />
          </TableCell>

          {/* Nos */}
          <TableCell align="center">
            <TextField
              value={row.Number}
              size="small"
              type="number"
              onChange={(e) =>
                handleChangeRow(idx, "Number", e.target.value)
              }
              sx={{ width: 100 }}
            />
          </TableCell>
        </TableRow>
      ))}
    </TableBody>
  </Table>
</TableContainer>

                <Box display="flex" justifyContent="center" gap={2} mt={3}>
  <Button variant="contained" onClick={handleSubmit}>
    {isEditing ? "Update" : "Save"}
  </Button>

  <Button
    variant="contained"
    color="error"
    onClick={() => setIsModalOpen(false)}
  >
    Cancel
  </Button>
</Box>

                  
                </div>
             
          
         
  </Box>
</Modal>


        <Dialog open={isDeleteDialogOpen} onClose={cancelDelete}>
          <DialogTitle>Confirm Deletion</DialogTitle>
          <DialogContent>
            Are you sure you want to delete this Raddi Sales?
          </DialogContent>
          <DialogActions>
            <Button
              onClick={cancelDelete}
              sx={{ background: "red", color: "white" }}>
              Cancel
            </Button>
            <Button
              onClick={confirmDelete}
              sx={{ background: "#0a60bd", color: "white" }}>
              Confirm
            </Button>
          </DialogActions>
        </Dialog>

        <ToastContainer />
      </div>
    </>
  );
}

export default Raddisales;
