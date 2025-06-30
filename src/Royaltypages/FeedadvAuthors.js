import React, { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  Button,
  Box,
  TextField,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import qs from "qs";

function FeedadvAuthors() {
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

  const [pageIndex, setPageIndex] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const navigate = useNavigate();
  const [authors, setAuthors] = useState([]);
  const [amounts, setAmounts] = useState({}); // Separate state for amounts

  useEffect(() => {
    fetchAuthors();
    console.log("this function is called");
  }, [pageIndex]); // Fetch data when page changes

  const fetchAuthors = async () => {
    try {
      const response = await axios.get(
        `https://publication.microtechsolutions.net.in/php/get/gettblpage.php?Table=Author&PageNo=${pageIndex}`
      );

      console.log(response.data, "response of Author");

      if (response.data.data.length === 0) {
        toast.info("No records to display");
        setAuthors([]); // Clear authors list
        return;
      }

      setAuthors(response.data.data);
      setTotalPages(response.data.total_pages);
    } catch (error) {
      toast.error("Error fetching authors");
    }
  };

  // Update Pagination Logic
  const handlePageChange = (newPage) => {
    if (newPage > totalPages) {
      toast.warning("No records to display");
      return;
    }
    setPageIndex(newPage);
  };

  // Handle amount input change
  const handleAmountChange = (id, value) => {
    setAmounts((prev) => ({
      ...prev,
      [id]: value, // Store entered amount with author ID
    }));
  };

  // const handleSave = () => {
  //   // Prepare payload with non-empty amounts
  //   const payload = Object.entries(amounts)
  //     .filter(([id, value]) => value !== "" && value !== null) // Remove empty values
  //     .map(([id, amount]) => ({
  //       Id: id, // Use Id as per database
  //       AuthorName:
  //         authors.find((author) => author.Id === id)?.AuthorName || "",
  //       Amount: Number(amount), // Convert to number
  //       YearId: yearid, // Foreign Key
  //     }));

  //   if (payload.length === 0) {
  //     toast.error("Please enter amounts before saving.");
  //     return;
  //   }

  //   axios
  //     .post(
  //       "https://publication.microtechsolutions.net.in/php/post/feedadvanceforauthor.php",
  //       payload
  //     )
  //     .then((response) => {
  //       console.log("Data saved successfully:", response.data);
  //       toast.success("Data saved successfully!");
  //       setAmounts({}); // Reset form after success
  //     })
  //     .catch((error) => {
  //       console.error("Error saving data:", error);
  //       toast.error("Failed to save data!");
  //     });
  // };

  const handleSave = async () => {
    const filteredAuthors = authors
      .map((author) => ({
        AuthorId: Number(author.Id) || 0,
        AuthorName: author.AuthorName || "",
        Amount: amounts[author.Id] ? Number(amounts[author.Id]) : 0,
        YearId: Number(yearid) || 0,
        CreatedBy: Number(userId) || 0,
      }))
      .filter(
        (entry) => entry.Amount > 0 && entry.AuthorId > 0 && entry.CreatedBy > 0
      );

    if (filteredAuthors.length === 0) {
      toast.error("Please enter amounts before saving.");
      return;
    }

    try {
      // Send multiple requests in parallel
      await Promise.all(
        filteredAuthors.map(async (author) => {
          await axios.post(
            "https://publication.microtechsolutions.net.in/php/post/feedadvanceforauthor.php",
            qs.stringify(author), // Send data as URL encoded form
            {
              headers: {
                "Content-Type": "application/x-www-form-urlencoded",
              },
            }
          );
        })
      );

      toast.success("Advance for Authors saved successfully!");

      setAmounts({}); // Reset amounts after success
    } catch (error) {
      console.error("Error saving data:", error);
      toast.error("Failed to save some records!");
    }
  };

  const handleCancel = () => {
    navigate(-1);
  };

  return (
    <Paper sx={{ padding: 2, margin: 2 }}>
      {/* Back Button */}
      <Button
        onClick={() => navigate(-1)}
        sx={{ marginBottom: 2, background: "#0a60bd", color: "white" }}>
        Back
      </Button>
      {/* Heading */}
      <Typography
        fontWeight="600"
        textAlign="center"
        style={{ color: "#0000ff" }}
        gutterBottom>
        Feed Advances of Authors{" "}
      </Typography>
      {/* Table Container */}
      <TableContainer
        component={Paper}
        sx={{ maxHeight: 300, overflow: "auto" }}>
        <Table stickyHeader>
          <TableHead>
            <TableRow>
              <TableCell>Sr. No</TableCell>
              <TableCell>Author Name</TableCell>
              <TableCell>Amount</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {authors.map((author, index) => (
              <TableRow key={author.Id} sx={{ height: "20px" }}>
                <TableCell>{index + 1}</TableCell>
                <TableCell>{author.AuthorName}</TableCell>
                <TableCell>
                  <TextField
                    type="number"
                    variant="outlined"
                    size="small"
                    value={amounts[author.Id] || ""} // Separate state for amount
                    onChange={(e) =>
                      handleAmountChange(author.Id, e.target.value)
                    }
                    sx={{
                      width: "80px",
                      height: "25px",
                      "& .MuiInputBase-root": { height: "25px" },
                    }}
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      {/* Pagination Controls */}
      <Box
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          marginTop: "10px",
        }}>
        <Button
          onClick={() => handlePageChange(pageIndex - 1)}
          disabled={pageIndex === 1}>
          ◀ Prev
        </Button>
        <input
          type="number"
          value={pageIndex}
          onChange={(e) => {
            const newPage = Number(e.target.value);
            if (!isNaN(newPage) && newPage >= 1) {
              handlePageChange(newPage);
            }
          }}
          style={{
            width: "50px",
            textAlign: "center",
            margin: "0 10px",
            marginBottom: "5px",
          }}
        />
        <Button
          onClick={() => handlePageChange(pageIndex + 1)}
          disabled={pageIndex >= totalPages}>
          Next ▶
        </Button>{" "}
        Total Pages : {totalPages}
      </Box>
      {/* Save Button */}
      <Box sx={{ display: "flex", justifyContent: "center", marginTop: 2 }}>
        <Button variant="contained" color="primary" onClick={handleSave}>
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

export default FeedadvAuthors;
