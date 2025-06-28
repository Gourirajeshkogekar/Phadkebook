import React, { useMemo, useState, useEffect, useRef } from "react";
import {
  MaterialReactTable,
  useMaterialReactTable,
} from "material-react-table";
import {
  Modal,
  Button,
  TextField,
  Box,
  Typography,
  FormLabel,
  FormControl,
  FormControlLabel,
  Radio,
  RadioGroup,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";
import axios from "axios";
import Select from "react-select";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { RiDeleteBin5Line } from "react-icons/ri";
import { CiEdit } from "react-icons/ci";
import { Tooltip } from "@mui/material";

export default function Interestcal() {
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

    fetchInterestCal();
  }, []);

  const [intType, setIntType] = useState("Monthly");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const [startNo, setStartNo] = useState("");
  const [tdsAmt, setTdsAmt] = useState();
  const [tdsPerc, setTdsPerc] = useState();
  const [surcharge, setSurcharge] = useState();
  const [eduCess, setEduCess] = useState();
  const [isEditing, setIsEditing] = useState("");
  const [interests, setInterests] = useState([]);
  const [id, setId] = useState("");

  useEffect(() => {
    fetchInterestCal();
  }, []);

  const fetchInterestCal = async () => {
    try {
      const response = await axios.get(
        "https://publication.microtechsolutions.net.in/php/get/gettable.php?Table=InterestCalculations"
      );
      setInterests(response.data);
    } catch (error) {
      // toast.error("Error fetching users:", error);
    }
  };

  const intTypeMapping = {
    Monthly: 1,
    Quarterly: 2,
    "Half Yearly": 3,
    Yearly: 4,
  };

  const resetFormFields = () => {
    setStartDate("");
    setEndDate("");
    setIntType("Monthly");
    setStartNo("");
    setEduCess("");
    setSurcharge("");
    setTdsAmt("");
    setTdsPerc("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent the default form submission

    const data = {
      Int_type: intTypeMapping[intType],
      StartDate: startDate,
      EndDate: endDate,
      StartNo: startNo,
      TDSDeductionAmount: parseFloat(tdsAmt),
      TDSPercentage: parseFloat(tdsPerc),
      Surcharge: parseFloat(surcharge),
      EduCess: parseFloat(eduCess),
      CreatedBy: userId,
    };

    // Determine the URL based on whether we're editing or adding
    const url = isEditing
      ? "https://publication.microtechsolutions.net.in/php/update/interestcalculationsupdate.php"
      : "https://publication.microtechsolutions.net.in/php/post/interestcalculationspost.php";

    // If editing, include the author ID in the payload
    if (isEditing) {
      data.Id = id;
      data.UpdatedBy = userId;
    }

    try {
      await axios.post(url, data, {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      });

      if (isEditing) {
        toast.success("Interest Calculation updated successfully!");
      } else {
        toast.success("Interest Calculation added successfully!");
      }
      resetFormFields();
      fetchInterestCal(); // Refresh the list after submit
    } catch (error) {
      // console.error("Error saving record:", error);
      toast.error("Error saving record!");
    }
  };

  return (
    <Box sx={{ p: 4 }}>
      <Typography
        variant="h5"
        sx={{ mb: 2, fontWeight: "700", textAlign: "center" }}>
        Interest Calculation
      </Typography>
      <Box
        sx={{
          display: "flex",
          border: "1px solid #ccc",
          p: 2,
          width: 700,
        }}>
        <Box sx={{ flex: 1, pr: 3 }}>
          <FormControl component="fieldset" sx={{ mb: 2 }}>
            <FormLabel component="legend">Int. Type</FormLabel>
            <RadioGroup
              row
              value={intType}
              onChange={(e) => setIntType(e.target.value)}>
              {["Monthly", "Quarterly", "Half Yearly", "Yearly"].map((type) => (
                <FormControlLabel
                  key={type}
                  value={type}
                  control={<Radio />}
                  label={type}
                />
              ))}
            </RadioGroup>
          </FormControl>

          <Box sx={{ mb: 2 }}>
            <Typography variant="subtitle2">Period</Typography>
            <Box sx={{ display: "flex", gap: 2, mt: 1 }}>
              <TextField
                label="Start Date"
                type="date"
                size="small"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                InputLabelProps={{ shrink: true }}
              />
              <TextField
                label="End Date"
                type="date"
                size="small"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                InputLabelProps={{ shrink: true }}
              />
            </Box>
          </Box>

          <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
            <Typography sx={{ width: 120, fontWeight: "650" }}>
              Start No
            </Typography>
            <TextField
              size="small"
              type="number"
              value={startNo}
              onChange={(e) => setStartNo(e.target.value)}
              sx={{
                bgcolor: "yellow",
                input: { textAlign: "right", fontWeight: "bold" },
                width: 120,
              }}
            />
          </Box>

          <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
            <Typography sx={{ width: 120, fontWeight: "650" }}>
              TDS Ded. Amt
            </Typography>
            <TextField
              size="small"
              type="number"
              value={tdsAmt}
              onChange={(e) => setTdsAmt(e.target.value)}
              sx={{
                bgcolor: "yellow",
                input: { textAlign: "right", fontWeight: "bold" },
                width: 120,
              }}
            />
          </Box>

          <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
            <Typography sx={{ width: 120, fontWeight: "650" }}>
              TDS Perc.
            </Typography>
            <TextField
              size="small"
              type="number"
              value={tdsPerc}
              onChange={(e) => setTdsPerc(e.target.value)}
              sx={{
                bgcolor: "yellow",
                input: { textAlign: "right", fontWeight: "bold" },
                width: 120,
              }}
            />
          </Box>

          <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
            <Typography sx={{ width: 120, fontWeight: "650" }}>
              Surcharge
            </Typography>
            <TextField
              size="small"
              type="number"
              value={surcharge}
              onChange={(e) => setSurcharge(e.target.value)}
              sx={{
                bgcolor: "yellow",
                input: { textAlign: "right", fontWeight: "bold" },
                width: 120,
              }}
            />
          </Box>

          <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
            <Typography sx={{ width: 120, fontWeight: "650" }}>
              Edu Cess
            </Typography>
            <TextField
              size="small"
              type="number"
              value={eduCess}
              onChange={(e) => setEduCess(e.target.value)}
              sx={{
                bgcolor: "yellow",
                input: { textAlign: "right", fontWeight: "bold" },
                width: 120,
              }}
            />
          </Box>
        </Box>

        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "flex-end",
            gap: 1,
          }}>
          <Button variant="contained" color="primary" onClick={handleSubmit}>
            Submit
          </Button>
          <Button variant="contained" color="primary">
            Int. List Printing
          </Button>
          <Button variant="outlined" color="error">
            Close
          </Button>
        </Box>
      </Box>
      <ToastContainer />
    </Box>
  );
}
