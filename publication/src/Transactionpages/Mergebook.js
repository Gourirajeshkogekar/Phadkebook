import React, { useState, useEffect } from "react";
import "./Mergebook.css";
import { Button, TextField, Modal, Grid } from "@mui/material";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import {
  Autocomplete,
  Box,
  Typography,
  Drawer,
  Divider,
  FormControl,
  Select,
  MenuItem,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paperm,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

function Mergebook() {
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

    // fetchMergeBooks();
  }, []);

  const [bookcodetoMerge, setBookcodetomerge] = useState("");
  const [nameofbooktomerge, setNameofbooktomerge] = useState("");
  const [priceofbooktomerge, setPriceofbooktomerge] = useState("");
  const [nooftransactionsofmergebook, setNooftransactionsofmergebook] =
    useState("");

  const [newbookcode, setNewbookcode] = useState("");
  const [newNameofbook, setNewnameofbook] = useState("");
  const [newpriceofbook, setNewpriceofbook] = useState("");
  const [nooftransactionsofnewbook, setNooftransactionsofnewbook] =
    useState("");

  const [isModalOpen, setIsModalOpen] = useState(false);

  const [books, setBooks] = useState([]);

  useEffect(() => {
    fetchBooks();
  }, []);

  const fetchBooks = async () => {
    try {
      const response = await axios.get(
        "https://publication.microtechsolutions.net.in/php/Bookget.php"
      );
      const bookOptions = response.data.map((book) => ({
        value: book.Id,
        label: book.BookName,
      }));
      setBooks(bookOptions);
    } catch (error) {
      // toast.error("Error fetching books:", error);
    }
  };

  const handleSubmit = () => {
    if (
      bookcodetoMerge &&
      nameofbooktomerge &&
      priceofbooktomerge &&
      nooftransactionsofmergebook &&
      newbookcode &&
      newNameofbook &&
      newpriceofbook &&
      nooftransactionsofnewbook
    ) {
      // Simulate merging logic here
      // For example, you could combine the transaction numbers and calculate the new price as an average (or any other logic)

      const mergedPrice =
        (parseFloat(priceofbooktomerge) + parseFloat(newpriceofbook)) / 2;
      const mergedTransactions =
        parseInt(nooftransactionsofmergebook) +
        parseInt(nooftransactionsofnewbook);

      const mergedBook = {
        mergedBookCode: newbookcode,
        mergedBookName: newNameofbook,
        mergedPrice: mergedPrice,
        mergedTransactions: mergedTransactions,
      };

      // Show success toast with merged data (simulating a successful merge)
      toast.success(`Books merged successfully:
        \n New Book Code: ${mergedBook.mergedBookCode}
        \n New Book Name: ${mergedBook.mergedBookName}
        \n New Price: ${mergedBook.mergedPrice}
        \n Total Transactions: ${mergedBook.mergedTransactions}`);

      // Close modal and reset form after merging
      setIsModalOpen(false);
      resetForm();
    } else {
      toast.error("Please fill in all fields");
    }
  };

  // Reset form fields after successful merge
  const resetForm = () => {
    setBookcodetomerge("");
    setNameofbooktomerge("");
    setPriceofbooktomerge("");
    setNooftransactionsofmergebook("");
    setNewbookcode("");
    setNewnameofbook("");
    setNewpriceofbook("");
    setNooftransactionsofnewbook("");
  };

  useEffect(() => {
    console.log("Mergebook component rendered");
  }, []);

  return (
    <>
      <div className="mergebook-container">
        <h1>Merge Book</h1>

        {/* <Box sx={{ padding: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Typography m={2} variant="h6"><b>Receipt Voucher</b></Typography>
            <CloseIcon sx={{ cursor: 'pointer' }}
            //  onClick={handleDrawerClose} 
             />
          </Box> */}

        <form className="mergebook-form">
          <div>
            <h4 style={{ color: "navy" }}>
              <b>Book To Be Merged </b>
            </h4>

            <div className="bookmerge-form">
              <div>
                <label className="mergebook-label">
                  Book Code to be Merged:
                </label>
                <div>
                  <input
                    type="text"
                    id="bookcodetoMerge"
                    name="bookcodetoMerge"
                    value={bookcodetoMerge}
                    onChange={(e) => setBookcodetomerge(e.target.value)}
                    className="mergebook-control"
                    placeholder="Enter Book code"
                  />
                </div>
              </div>
              <div>
                <label className="mergebook-label">
                  Name of Book to be Merged:
                </label>
                <div>
                  <input
                    type="text"
                    id="nameofbooktomerge"
                    name="nameofbooktomerge"
                    value={nameofbooktomerge}
                    onChange={(e) => setNameofbooktomerge(e.target.value)}
                    className="mergebook-control"
                    placeholder="Enter name of Book "
                  />
                </div>
              </div>
              <div>
                <label className="mergebook-label">
                  Price of Book to be Merged:
                </label>
                <div>
                  <input
                    id="priceofbooktomerge"
                    name="priceofbooktomerge"
                    type="number"
                    value={priceofbooktomerge}
                    onChange={(e) => setPriceofbooktomerge(e.target.value)}
                    className="mergebook-control"
                    placeholder="Enter Price of book to merge"
                  />
                </div>
              </div>
              <div>
                <label className="mergebook-label">No of Transactions:</label>
                <div>
                  <input
                    type="number"
                    id="nooftransactionsofmergebook"
                    name="nooftransactionsofmergebook"
                    value={nooftransactionsofmergebook}
                    onChange={(e) =>
                      setNooftransactionsofmergebook(e.target.value)
                    }
                    className="mergebook-control"
                    placeholder="Enter No of transactions"
                  />
                </div>
              </div>
            </div>
          </div>

          <div>
            <h4 style={{ color: "navy" }}>
              <b>Book in which above book will be Merged?</b>
            </h4>

            <div className="newbookmerge-form">
              <div>
                <label className="mergebook-label">New Book Code:</label>
                <div>
                  <input
                    id="newbookcode"
                    name="newbookcode"
                    value={newbookcode}
                    onChange={(e) => setNewbookcode(e.target.value)}
                    className="mergebook-control"
                    placeholder="Enter New Bookcode"
                  />
                </div>
              </div>

              <div>
                <label className="mergebook-label">New Book Name:</label>
                <div>
                  <input
                    id="newNameofbook"
                    name="newNameofbook"
                    value={newNameofbook}
                    onChange={(e) => setNewnameofbook(e.target.value)}
                    className="mergebook-control"
                    placeholder="Enter Name of New Book"
                  />
                </div>
              </div>
              <div>
                <label className="mergebook-label">New Book Price:</label>
                <div>
                  <input
                    type="number"
                    id="newpriceofbook"
                    name="newpriceofbook"
                    value={newpriceofbook}
                    onChange={(e) => setNewpriceofbook(e.target.value)}
                    className="mergebook-control"
                    placeholder="Enter New price of book"
                  />
                </div>
              </div>

              <div>
                <label className="mergebook-label">No of Transactions:</label>
                <div>
                  <input
                    type="number"
                    id="nooftransactionsofnewbook"
                    name="nooftransactionsofnewbook"
                    value={nooftransactionsofnewbook}
                    onChange={(e) =>
                      setNooftransactionsofnewbook(e.target.value)
                    }
                    className="mergebook-control"
                    placeholder="Enter No of transactions for new book"
                  />
                </div>
              </div>
            </div>
          </div>
        </form>

        <div className="mergebook-btn-container">
          <Button
            type="button"
            onClick={handleSubmit}
            style={{ background: "#0a60bd", color: "white" }}>
            Merge
          </Button>
          {/* <Button
                onClick={() => setIsModalOpen(false)}
                style={{ background: "red", color: "white" }}
              >
                Cancel
              </Button> */}
        </div>

        <ToastContainer />
      </div>
    </>
  );
}

export default Mergebook;
