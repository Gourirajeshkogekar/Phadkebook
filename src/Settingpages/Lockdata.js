import React from "react";
import { useState, useEffect } from "react";
import axios from "axios";
import {
  Box,
  Button,
  Checkbox,
  FormControlLabel,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import qs from "qs"; // Make sure qs is imported if not already

function Lockdata() {
  const [userId, setUserId] = useState("");
  const [yearid, setYearId] = useState("");
  const [dateError, setDateError] = useState(false);
  const [fromdate, setFromdate] = useState("");
  const [todate, setTodate] = useState("");

  useEffect(() => {
    const storedUserId = sessionStorage.getItem("UserId");
    const storedYearId = sessionStorage.getItem("YearId");
    const storedFromdate = sessionStorage.getItem("FromDate");
    const storedTodate = sessionStorage.getItem("ToDate");

    if (storedUserId) {
      setUserId(storedUserId);
    }

    if (storedYearId) {
      setYearId(storedYearId);
    } else {
      toast.error("Year is not set.");
    }

    if (storedFromdate) {
      setFromdate(storedFromdate);
    } else {
      toast.error("Fromdate is not set.");
    }

    if (storedTodate) {
      setTodate(storedTodate);
    } else {
      toast.error("User is not logged in.");
    }

    // if (storedYearId) {
    //   setYearId(storedYearId);
    // } else {
    //   toast.error("Year is not set.");
    // }

    fetchlockdata();
  }, []);

  const [lockdatas, setLockdatas] = useState([]);
  const [screendata, setScreenData] = useState([]);
  const [autoLockStates, setAutoLockStates] = useState({});

  const handleAutoLockChange = (event, index) => {
    setAutoLockStates((prev) => ({
      ...prev,
      [index]: event.target.checked,
    }));
  };

  const fetchlockdata = async () => {
    try {
      const response = await axios.get(
        `https://publication.microtechsolutions.net.in/php/get/gettblpage.php?Table=LockData`
      );
      // setSellschallans(response.data);
      console.log(response.data, "response of sells challan header");

      setLockdatas(response.data.data);
    } catch (error) {
      // toast.error("Error fetching sells challans:", error);
    }
  };

  useEffect(() => {
    axios
      .get(
        "https://publication.microtechsolutions.net.in/php/get/gettable.php?Table=Screen"
      )
      .then((res) => {
        const filtered = res.data.filter(
          (item) => item.Active === 1 && item.MainGroup === "Transactions"
        );
        setScreenData(filtered);
      })
      .catch((err) => {
        console.error("Error fetching screen data:", err);
      });
  }, []);

  const handleLockData = async (e) => {
    e.preventDefault();

    const lockdataurl =
      "https://publication.microtechsolutions.net.in/php/update/lockdataupdate.php";

    try {
      for (let idx = 0; idx < screendata.length; idx++) {
        const tran = screendata[idx];

        const lockdata = {
          Transaction: tran.ScreenName,
          LockDate: fromdate, // Make sure fromdate is valid and defined
          AutoLock: autoLockStates[idx] || false,
          UpdatedBy: userId,
          Id: tran.Id,
        };

        const response = await axios.post(lockdataurl, qs.stringify(lockdata), {
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
        });

        console.log(`Updated ${tran.ScreenName}:`, response.data);
      }

      toast.success(
        "Data lock updated successfully for selected transactions."
      );
    } catch (error) {
      console.error("Error during data lock update:", error);
      toast.error("Failed to update some or all data locks.");
    }
  };

  return (
    <Box sx={{ p: 1 }}>
      <Paper variant="outlined" sx={{ width: "700px", p: 1 }}>
        <Typography variant="h6" sx={{ mb: 2, fontWeight: "bold" }}>
          Transactionwise Data Locking
        </Typography>

        <TableContainer
          style={{
            overflowY: "auto",
            height: "58vh",
          }}>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>
                  <b>Transaction</b>
                </TableCell>
                <TableCell>
                  <b>Lock Date</b>
                </TableCell>
                <TableCell>
                  <b>Auto Lock?</b>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {screendata.map((tran, idx) => (
                <TableRow key={idx}>
                  <TableCell>{tran.ScreenName}</TableCell>
                  <TableCell>
                    {new Date(fromdate).toLocaleDateString("en-GB")}
                  </TableCell>
                  <TableCell>
                    <Checkbox
                      checked={autoLockStates[idx] || false}
                      onChange={(e) => handleAutoLockChange(e, idx)}
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        <Box sx={{ display: "flex", gap: 2, mt: 2 }}>
          <Button
            variant="contained"
            color="primary"
            onClick={handleLockData} // This should trigger the lock data action
          >
            Lock Data
          </Button>
          <Button variant="outlined">Exit</Button>
        </Box>

        <Box sx={{ mt: 2, display: "flex", marginRight: "10px" }}>
          <FormControlLabel
            control={<Checkbox />}
            label={
              <Typography sx={{ color: "red", fontSize: "14px" }}>
                Lock Data irrespective of above Transaction lock?
              </Typography>
            }
          />
        </Box>
      </Paper>
      <ToastContainer />
    </Box>
  );
}

export default Lockdata;
