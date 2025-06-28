import React, { useState, useEffect } from "react";
import { Grid, TextField, Button, Typography, Box, Paper } from "@mui/material";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";

function FeedOpeningStock() {
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
  }, []);

  const navigate = useNavigate("");
  const [BookId, setBookid] = useState("");
  const [BookCode, setBookCode] = useState("");
  const [BookNameMarathi, setBookName] = useState("");
  const [Rate, setRate] = useState("");
  const [PrintOrder, setPrintOrder] = useState("");
  const [OpeningStock, setOpeningStock] = useState("");
  const [OpUnbound, setOpUnbound] = useState("");
  const [ReceivedfromBinders, setRecdFromBinders] = useState("");
  const [Defective, setDefective] = useState("");
  const [Netsaleable, setNetSaleable] = useState("");
  const [Netsales, setNetSales] = useState("");
  const [Specimen, setSpecimen] = useState("");
  const [ClosingUnbound, setClosingUnbound] = useState("");
  const [Total, setTotal] = useState("");
  const [ClosingStock, setClosingStock] = useState("");

  const handleBookcodechange = (e) => {
    const value = e.target.value;
    setBookCode(value);
    if (value.length >= 0 || 2 || 3) {
      fetchBookcodedata(value);
    }
  };

  const fetchBookcodedata = async (BookCode) => {
    try {
      const cleanedBookCode = BookCode.trim();
      const response = await fetch(
        `https://publication.microtechsolutions.net.in/php/Bookcodeget.php?BookCode=${cleanedBookCode}`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch data");
      }

      const bookData = await response.json();
      if (Array.isArray(bookData) && bookData.length > 0) {
        const data = bookData.find(
          (item) => item.BookCode.toString() === cleanedBookCode
        );
        if (data) {
          setBookid(data.Id);
          setBookName(data.BookNameMarathi || "");
          setRate(data.BookRate || "");
          setOpeningStock(data.OpeningStock || "");
          setPrintOrder(data.PrintOrder || "");
          setOpeningStock(data.OpeningStock || "");
        } else {
          // toast.error("No data found for the provided Book Code");
        }
      }
    } catch (error) {
      toast.error("Error fetching book data");
    }
  };

  // Calculate total dynamically
  useEffect(() => {
    const totalValue =
      (parseFloat(Netsales) || 0) +
      (parseFloat(Specimen) || 0) +
      (parseFloat(ClosingUnbound) || 0) +
      (parseFloat(ClosingStock) || 0);
    setTotal(totalValue);
  }, [Netsales, Specimen, ClosingUnbound, ClosingStock]);

  const resetForm = () => {
    setBookCode("");
    setBookName("");
    setBookid("");
    setPrintOrder("");
    setClosingStock("");
    setClosingUnbound("");
    setDefective("");
    setNetSaleable("");
    setNetSales("");
    setOpUnbound("");
    setOpeningStock("");
    setRate("");
    setRecdFromBinders("");
    setSpecimen("");
    setTotal("");
  };

  const handleSave = async () => {
    const payload = new URLSearchParams();
    payload.append("BookId", BookId);
    payload.append("Rate", parseFloat(Rate) || 0);
    payload.append("PrintOrder", parseInt(PrintOrder) || 0);
    payload.append("OpeningStock", parseInt(OpeningStock) || 0);
    payload.append("OpUnbound", parseInt(OpUnbound) || 0);
    payload.append("RecdFromBinder", parseInt(ReceivedfromBinders) || 0);
    payload.append("Defective", parseInt(Defective) || 0);
    payload.append("NetSaleable", parseInt(Netsaleable) || 0);
    payload.append("NetSales", parseInt(Netsales) || 0);
    payload.append("Specimen", parseInt(Specimen) || 0);
    payload.append("ClosingUnbound", parseInt(ClosingUnbound) || 0);
    payload.append("Total", parseInt(Total) || 0);
    payload.append("ClosingStock", parseInt(ClosingStock) || 0);
    payload.append("CreatedBy", userId);
    try {
      const response = await fetch(
        "https://publication.microtechsolutions.net.in/php/post/feedopeningstock.php",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
          body: payload.toString(), // Convert to URL-encoded format
        }
      );

      const result = await response.json();
      if (response.ok) {
        toast.success("Opening Stock Saved Successfully!");
        resetForm();
      } else {
        toast.error(result.message || "Failed to save data");
      }
    } catch (error) {
      toast.error("Error saving data");
    }
  };

  const handleCancel = () => {
    toast.info("Action Canceled");
    navigate(-1);
  };

  return (
    <Paper elevation={5} sx={{ padding: 2, margin: "5px", maxWidth: 1000 }}>
      <Typography
        fontWeight="600"
        textAlign="center"
        style={{ color: "#0000ff" }}
        gutterBottom>
        Feed Opening Stock{" "}
      </Typography>
      <Typography fontWeight="600" gutterBottom>
        Editing Record
      </Typography>
      <Grid container spacing={2}>
        {/* Book Code */}
        <Grid item xs={3}>
          <Typography fontWeight="550">Book Code</Typography>
          <TextField
            value={BookCode}
            onChange={handleBookcodechange}
            placeholder="Enter Book code"
            fullWidth
            size="small"
          />
        </Grid>

        {/* Rate */}
        <Grid item xs={3}>
          <Typography fontWeight="550">Rate</Typography>
          <TextField
            value={Rate}
            onChange={(e) => setRate(e.target.value)}
            fullWidth
            size="small"
          />
        </Grid>

        {/* Book Name Marathi */}
        <Grid item xs={6}>
          <Typography fontWeight="550">Book Name (Marathi)</Typography>
          <TextField value={BookNameMarathi} fullWidth size="small" />
        </Grid>

        {/* Print Order */}
        <Grid item xs={3}>
          <Typography fontWeight="550">Print Order</Typography>
          <TextField
            value={PrintOrder}
            onChange={(e) => setPrintOrder(e.target.value)}
            placeholder="Enter Print order"
            fullWidth
            size="small"
          />
        </Grid>

        {/* Opening Stock */}
        <Grid item xs={3}>
          <Typography fontWeight="550">Opening Stock</Typography>
          <TextField
            value={OpeningStock}
            onChange={(e) => setOpeningStock(e.target.value)}
            placeholder="Enter Opening stock"
            fullWidth
            size="small"
          />
        </Grid>

        {/* Opening Unbound */}
        <Grid item xs={3}>
          <Typography fontWeight="550">Op. Unbound</Typography>
          <TextField
            value={OpUnbound}
            onChange={(e) => setOpUnbound(e.target.value)}
            placeholder="Enter Op unbound"
            fullWidth
            size="small"
          />
        </Grid>

        {/* Received from Binders */}
        <Grid item xs={3}>
          <Typography fontWeight="550">Received from Binders</Typography>
          <TextField
            value={ReceivedfromBinders}
            onChange={(e) => setRecdFromBinders(e.target.value)}
            placeholder="Enter Received from binder"
            fullWidth
            size="small"
          />
        </Grid>

        {/* Defective */}
        <Grid item xs={3}>
          <Typography fontWeight="550">Defective</Typography>
          <TextField
            value={Defective}
            onChange={(e) => setDefective(e.target.value)}
            placeholder="Enter Defective"
            fullWidth
            size="small"
          />
        </Grid>

        {/* Net Saleable */}
        <Grid item xs={3}>
          <Typography fontWeight="550">Net Saleable</Typography>
          <TextField
            value={Netsaleable}
            onChange={(e) => setNetSaleable(e.target.value)}
            placeholder="Enter Net Saleable"
            fullWidth
            size="small"
          />
        </Grid>
      </Grid>

      <Typography mt={1} margin={"5px"} fontWeight="600" gutterBottom>
        Consumption
      </Typography>

      <Grid container spacing={2}>
        {/* Net Sales */}
        <Grid item xs={2}>
          <Typography fontWeight="550">Net Sales</Typography>
          <TextField
            value={Netsales}
            onChange={(e) => setNetSales(e.target.value)}
            placeholder="Enter Net Sale"
            fullWidth
            size="small"
          />
        </Grid>

        {/* Specimen */}
        <Grid item xs={2}>
          <Typography fontWeight="550">Specimen</Typography>
          <TextField
            value={Specimen}
            onChange={(e) => setSpecimen(e.target.value)}
            placeholder="Enter Specimen"
            fullWidth
            size="small"
          />
        </Grid>

        {/* Closing Unbound */}
        <Grid item xs={2}>
          <Typography fontWeight="550">Closing Unbound</Typography>
          <TextField
            value={ClosingUnbound}
            onChange={(e) => setClosingUnbound(e.target.value)}
            placeholder="Enter Closing Unbound"
            fullWidth
            size="small"
          />
        </Grid>

        {/* Total */}
        <Grid item xs={2}>
          <Typography fontWeight="550">Total</Typography>
          <TextField
            value={Total}
            placeholder="Calculated Total"
            fullWidth
            size="small"
            disabled // Make it read-only
            InputProps={{
              style: { fontWeight: "bold" }, // Make text bold
            }}
          />
        </Grid>

        {/* Closing Stock */}
        <Grid item xs={2}>
          <Typography fontWeight="550">Closing Stock</Typography>
          <TextField
            value={ClosingStock}
            onChange={(e) => setClosingStock(e.target.value)}
            placeholder="Enter Closing Stock"
            fullWidth
            size="small"
          />
        </Grid>
      </Grid>

      {/* Save & Cancel Buttons */}
      {/* <Box mt={2} display="flex" justifyContent="center"> */}
      <Box display="flex" justifyContent="center" gap={2} mt={3}>
        <Button
          style={{ background: "#0a60bd", color: "white" }}
          onClick={handleSave}>
          Save
        </Button>
        <Button
          style={{ background: "red", marginLeft: "5px", color: "white" }}
          onClick={handleCancel}>
          Cancel
        </Button>
      </Box>

      <ToastContainer />
    </Paper>
  );
}

export default FeedOpeningStock;
