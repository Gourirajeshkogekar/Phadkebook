import React, { useState, useMemo, useEffect, useRef } from "react";
import "./Book.css";
import {
  MaterialReactTable,
  useMaterialReactTable,
} from "material-react-table";
import {
  Modal,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
} from "@mui/material";
import axios from "axios";
import Select from "react-select";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { RiDeleteBin5Line } from "react-icons/ri";
import { CiEdit } from "react-icons/ci";
import moment from "moment";
import qs from "qs";
import VirtualKeyboard from "./VirtualKeyboard";
import { CircularProgress } from "@mui/material";
import { Tooltip } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { ReactTransliterate } from "react-transliterate";
import "react-transliterate/dist/index.css";

function Book() {
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

    fetchAllBooks();
  }, []);

  useEffect(() => {
    // Load Google Transliteration API
    const loadGoogleTransliteration = () => {
      if (window.google && window.google.elements) {
        const options = {
          sourceLanguage: "en",
          destinationLanguage: ["mr"],
          transliterationEnabled: true,
        };
        const control =
          new window.google.elements.transliteration.TransliterationControl(
            options
          );
        control.makeTransliteratable([booknamemarathiRef.current.id]);
      }
    };

    if (window.google) {
      loadGoogleTransliteration();
    } else {
      // Retry loading if not available yet
      const interval = setInterval(() => {
        if (window.google) {
          loadGoogleTransliteration();
          clearInterval(interval);
        }
      }, 500);
    }
  }, []);

  const [pageIndex, setPageIndex] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const [BookCode, setBookCode] = useState("");
  const [BookName, setBookName] = useState("");
  const [BookNameMarathi, setBookNameMarathi] = useState("");

  const [BookGroupId, setBookGroupId] = useState("");
  const [bookgroupOptions, setBookgroupOptions] = useState([]);

  const [BookStandardId, setBookStandardId] = useState("");
  const [bookstandardOptions, setBookstandardOptions] = useState([]);

  const [PublicationId, setPublicationId] = useState("");
  const [publicationOptions, setPublicationOptions] = useState([]);

  const [UniversityId, setUniversityId] = useState("");
  const [universityOptions, setUniversityOptions] = useState([]);

  const [BookMediumId, setBookMediumId] = useState("");
  const [bookmediumOptions, setBookmediumOptions] = useState([]);

  const [CurrentEdition, setCurrentEdition] = useState("");
  const [BookRate, setBookRate] = useState("");
  const [MRP, setMRP] = useState("");
  const [BookPages, setBookPages] = useState("");
  const [BookForms, setBookForms] = useState("");
  const [FillingDate, setFilingDate] = useState("");
  const [TitlePages, setTitlePages] = useState("");
  const [TitlePressId, setTitlePressId] = useState("");
  const [titlepressOptions, setTitlepressOptions] = useState([]);

  const [PaperSizeId, setPaperSizeId] = useState("");
  const [papersizeOptions, setPapersizeOptions] = useState([]);

  const [PressId, setPressId] = useState("");
  const [pressOptions, setPressOptions] = useState([]);

  const [Status, setStatus] = useState("");
  const [OpeningStock, setOpeningStock] = useState("");

  const [ReprintFlag, setReprintFlag] = useState("");
  const [PrintOrder, setPrintOrder] = useState("");
  const [BookId, setBookId] = useState("");
  const [CreationDate, setCreationDate] = useState("");
  const [CurrentEditionDate, setCurrentEditionDate] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [books, setBooks] = useState([]);
  const [editingIndex, setEditingIndex] = useState(-1);
  const [id, setId] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [errors, setErrors] = useState("");
  const [isKeyboardVisible, setIsKeyboardVisible] = useState(false);
  // Confirmation Dialog state
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [deleteIndex, setDeleteIndex] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const [loading, setLoading] = useState(true);

  //Enter button hit go to next input value in Address side

  const bookcodeRef = useRef(null);

  const booknameRef = useRef(null);
  const booknamemarathiRef = useRef(null);
  const bookgroupIdRef = useRef(null);

  const bookstandardidRef = useRef(null);
  const publicationRef = useRef(null);
  const universityRef = useRef(null);
  const bookmediumRef = useRef(null);
  const currenteditionRef = useRef(null);
  const bookrateRef = useRef(null);
  const bookpagesRef = useRef(null);
  const bookformsRef = useRef(null);
  const fillingdateRef = useRef(null);
  const titlepagesRef = useRef(null);
  const titlepressRef = useRef(null);
  const papersizeRef = useRef(null);
  const pressRef = useRef(null);
  const statusRef = useRef(null);
  const openingstockRef = useRef(null);
  const reprintflagRef = useRef(null);
  const printorderRef = useRef(null);
  const bookidRef = useRef(null);
  const creationdateRef = useRef(null);

  const curreditiondateRef = useRef(null);
  const saveRef = useRef(null);

  const handleKeyDown = (e, nextFieldRef) => {
    if (e.key === "Enter") {
      e.preventDefault();
      if (nextFieldRef && nextFieldRef.current) {
        nextFieldRef.current.focus();
      }
    }
  };

  useEffect(() => {
    fetchAllBooks();
    fetchBookgroups();
    fetchStandards();
    fetchPublications();
    fetchUniversities();
    fetchmediums();
    fetchTitlepresses();
    fetchPapersize();
    fetchPresses();
  }, []);

  // const fetchAllBooks = async () => {
  //   try {
  //     const response = await axios.get(
  //       "https://publication.microtechsolutions.net.in/php/Bookget.php"
  //     );
  //     setBooks(response.data);
  //     setLoading(false); // Set loading to false after data is fetched
  //   } catch (error) {
  //     // toast.error("Error fetching books:", error);
  //     setLoading(false); // Set loading to false in case of an error
  //   }
  // };

  useEffect(() => {
    fetchAllBooks();
    console.log("this function is called");
  }, [pageIndex]); // Fetch data when page changes

  const fetchAllBooks = async () => {
    try {
      const response = await axios.get(
        `https://publication.microtechsolutions.net.in/php/getbookbypg.php?PageNo=${pageIndex}`
      );
      // setSellschallans(response.data);
      console.log(response.data, "response of Book");

      setBooks(response.data.data);
      setTotalPages(response.data.total_pages);
    } catch (error) {
      // toast.error("Error fetching professors:", error);
    }
  };

  const fetchBookgroups = async () => {
    try {
      const response = await axios.get(
        "https://publication.microtechsolutions.net.in/php/BookGroupget.php"
      );

      const bookgroupOptions = response.data.map((group) => ({
        value: group.Id,
        label: group.BookGroupName,
      }));
      setBookgroupOptions(bookgroupOptions);
    } catch (error) {
      // toast.error("Error fetching book groups:", error);
    }
  };

  const fetchStandards = async () => {
    try {
      const response = await axios.get(
        "https://publication.microtechsolutions.net.in/php/Standardget.php"
      );
      const bookstandardOptions = response.data.map((std) => ({
        value: std.Id,
        label: std.StandardName,
      }));
      setBookstandardOptions(bookstandardOptions);
    } catch (error) {
      console.error("Error fetching  standards:", error);
    }
  };

  const fetchPublications = async () => {
    try {
      const response = await axios.get(
        "https://publication.microtechsolutions.net.in/php/Publicationget.php"
      );
      const publicationOptions = response.data.map((pub) => ({
        value: pub.Id,
        label: pub.PublicationName,
      }));
      setPublicationOptions(publicationOptions);
    } catch (error) {
      // toast.error("Error fetching  publications:", error);
    }
  };
  const fetchUniversities = async () => {
    try {
      const response = await axios.get(
        "https://publication.microtechsolutions.net.in/php/Universityget.php"
      );
      const universityOptions = response.data.map((uni) => ({
        value: uni.Id,
        label: uni.UniversityName,
      }));
      setUniversityOptions(universityOptions);
    } catch (error) {
      // toast.error("Error fetching  universities:", error);
    }
  };
  const fetchmediums = async () => {
    try {
      const response = await axios.get(
        "https://publication.microtechsolutions.net.in/php/BookMediumget.php"
      );
      const bookmediumOptions = response.data.map((med) => ({
        value: med.Id,
        label: med.BookMediumName,
      }));
      setBookmediumOptions(bookmediumOptions);
    } catch (error) {
      // toast.error("Error fetching  mediums:", error);
    }
  };
  const fetchTitlepresses = async () => {
    try {
      const response = await axios.get(
        "https://publication.microtechsolutions.net.in/php/TitlePressget.php"
      );
      const titlepressOptions = response.data.map((title) => ({
        value: title.Id,
        label: title.TitlePressName,
      }));
      setTitlepressOptions(titlepressOptions);
    } catch (error) {
      // toast.error("Error fetching  title press:", error);
    }
  };
  const fetchPapersize = async () => {
    try {
      const response = await axios.get(
        "https://publication.microtechsolutions.net.in/php/PaperSizeget.php"
      );
      const papersizeOptions = response.data.map((paper) => ({
        value: paper.Id,
        label: paper.PaperSizeName,
      }));
      setPapersizeOptions(papersizeOptions);
    } catch (error) {
      // toast.error("Error fetching  papersize:", error);
    }
  };
  const fetchPresses = async () => {
    try {
      const response = await axios.get(
        "https://publication.microtechsolutions.net.in/php/PressMasterget.php"
      );
      const pressOptions = response.data.map((press) => ({
        value: press.Id,
        label: press.PressName,
      }));
      setPressOptions(pressOptions);
    } catch (error) {
      // toast.error("Error fetching  presses:", error);
    }
  };

  const resetForm = () => {
    setBookCode("");
    setBookName("");
    setBookNameMarathi("");
    setBookGroupId("");
    setBookStandardId("");
    setPublicationId("");
    setUniversityId("");
    setBookMediumId("");
    setCurrentEdition("");
    setBookRate("");
    setMRP("");
    setBookPages("");
    setBookForms("");
    setFilingDate("");
    setTitlePages("");
    setTitlePressId("");
    setPaperSizeId("");
    setPressId("");
    setStatus("");
    setOpeningStock("");
    setReprintFlag("");
    setPrintOrder("");
    setBookId("");
    setCreationDate("");
    setCurrentEditionDate("");
  };

  const handleNewClick = () => {
    resetForm();
    setIsModalOpen(true);
    setIsEditing(false);
    setEditingIndex(-1);
  };

  const handleEdit = (row) => {
    // const convertDateForInput = (dateStr) => {
    //   if (typeof dateStr === "string" && dateStr.includes("-")) {
    //     const [year, month, day] = dateStr.split(" ")[0].split("-");
    //     return `${year}-${month}-${day}`;
    //   } else {
    //     // toast.error('Invalid date format:', dateStr);
    //     return "";
    //   }
    // };

    const convertDateForInput = (dateInput) => {
      if (!dateInput) return ""; // if null or undefined, return empty string

      if (typeof dateInput === "object" && dateInput.date) {
        // Laravel-like date object
        dateInput = dateInput?.date;
      }

      if (typeof dateInput === "string" && dateInput.includes("-")) {
        const [year, month, day] = dateInput.split(" ")[0].split("-");
        return `${year}-${month}-${day}`;
      }

      return "";
    };

    const book = books[row.index];
    console.log(book, "selected row of book");

    setBookCode(book.BookCode ?? "");
    setBookName(book.BookName ?? "");
    setBookNameMarathi(book.BookNameMarathi?.trim() ?? "");
    setBookGroupId(book.BookGroupId ?? "");
    setBookStandardId(book.BookStandardId ?? "");
    setPublicationId(book.PublicationId ?? "");
    setUniversityId(book.UniversityId ?? "");
    setBookMediumId(book.BookMediumId ?? "");
    setCurrentEdition(book.CurrentEdition ?? "");
    setBookRate(book.BookRate ?? "");
    setBookPages(book.BookPages ?? "");
    setBookForms(book.BookForms ?? "");
    setFilingDate(convertDateForInput(book.FillingDate));
    setTitlePages(book.TitlePages ?? "");
    setTitlePressId(book.TitlePressId ?? "");
    setPaperSizeId(book.PaperSizeId ?? "");
    setPressId(book.PressId ?? "");
    setStatus(book.Status ?? "");
    setOpeningStock(book.OpeningStock ?? "");
    setReprintFlag(book.ReprintFlag ?? "");
    setPrintOrder(book.PrintOrder ?? "");
    setBookId(book.BookId ?? "");
    setCreationDate(convertDateForInput(book.CreationDate));
    setCurrentEditionDate(convertDateForInput(book.CurrentEditionDate));

    // setBookCode(book.BookCode);
    // setBookName(book.BookName);
    // setBookNameMarathi(book.BookNameMarathi?.trim() || "");
    // setBookGroupId(book.BookGroupId);
    // setBookStandardId(book.BookStandardId);
    // setPublicationId(book.PublicationId);
    // setUniversityId(book.UniversityId);
    // setBookMediumId(book.BookMediumId);
    // setCurrentEdition(book.CurrentEdition);
    // setBookRate(book.BookRate);
    // setBookPages(book.BookPages);
    // setBookForms(book.BookForms);
    // setFilingDate(convertDateForInput(book.FillingDate));
    // setTitlePages(book.TitlePages);
    // setTitlePressId(book.TitlePressId);
    // setPaperSizeId(book.PaperSizeId);
    // setPressId(book.PressId);
    // setStatus(book.Status);
    // setOpeningStock(book.OpeningStock);
    // setReprintFlag(book.ReprintFlag);
    // setPrintOrder(book.PrintOrder);
    // setBookId(book.BookId);
    // setCreationDate(convertDateForInput(book.CreationDate));
    // setCurrentEditionDate(convertDateForInput(book.CurrentEditionDate));
    setEditingIndex(row.index);
    setIsModalOpen(true);
    setIsEditing(true);
    setId(book.Id);
  };

  const validateForm = () => {
    let formErrors = {};
    let isValid = true;

    // if (!BookCode) {
    //   formErrors.BookCode = "Book Code is required.";
    //   isValid = false;
    // }

    // if (!BookName) {
    //   formErrors.BookName = "Book Name is required.";
    //   isValid = false;
    // }

    // if (!BookNameMarathi) {
    //   formErrors.BookNameMarathi = "Book Name Marathi is required.";
    //   isValid = false;
    // }

    // if (!BookGroupId) {
    //     formErrors.BookGroupId = "Book group id is required.";
    //     isValid = false;
    // }

    // if (!BookStandardId) {
    //   formErrors.BookStandardId = "Book standard id is required.";
    //   isValid = false;
    // }

    //   if (!PublicationId) {
    //     formErrors.PublicationId = "Publication id is required.";
    //     isValid = false;
    // // }

    // if (!UniversityId) {
    //   formErrors.UniversityId = "University id is required.";
    //   isValid = false;
    // }

    // if (!BookMediumId) {
    //     formErrors.BookMediumId = "Book Medium Id is required.";
    //     isValid = false;
    // }

    // if (!CurrentEdition) {
    //     formErrors.CurrentEdition = "Current Edition is required.";
    //     isValid = false;
    // }

    // if (!BookRate) {
    //   formErrors.BookRate = "Book rate is required.";
    //   isValid = false;
    // }
    //   if (!BookPages) {
    // formErrors.BookPages = "Book pages are  required.";
    //     isValid = false;
    // }
    // if (!BookForms) {
    //   formErrors.BookForms = "Book forms are required.";
    //   isValid = false;
    // }

    // if (!TitlePages) {
    //   formErrors.TitlePages = "Title pages are required.";
    //   isValid = false;
    // }

    // if (!FillingDate) {
    //   formErrors.FillingDate = "Filing date is required.";
    //   isValid = false;
    // }

    // if (!TitlePressId) {
    //   formErrors.TitlePressId = "Title press id is required.";
    //   isValid = false;
    // }

    // if (!PaperSizeId) {
    //   formErrors.PaperSizeId = "Paper size id is required.";
    //   isValid = false;
    // }

    // if (!PressId) {
    //   formErrors.PressId = "Press id is required.";
    //   isValid = false;
    // }

    // if (!Status) {
    //     formErrors.Status = "Status is required.";
    //     isValid = false;
    // }

    //   if (!OpeningStock) {
    //     formErrors.OpeningStock = "Opening stock is required.";
    //     isValid = false;
    // }

    // if (!ReprintFlag) {
    //   formErrors.ReprintFlag = "Reprint Flag is required.";
    //   isValid = false;
    // }

    // if (!PrintOrder) {
    //     formErrors.PrintOrder = "Print Order is required.";
    //     isValid = false;
    // }

    // if (!BookId) {
    //   formErrors.BookId = "Book Id is required.";
    //   isValid = false;
    // }

    // if (!CreationDate) {
    //   formErrors.CreationDate = "Creation Date is required.";
    //   isValid = false;
    // }

    // if (!CurrentEditionDate) {
    //   formErrors.CurrentEditionDate = "Current Edition Date is required.";
    //   isValid = false;
    // }

    setErrors(formErrors);
    return isValid;
  };

  const handleBookcodechange = (e) => {
    const value = e.target.value;
    setBookCode(value);

    if (value.trim() === "") {
      // Reset all fields if input is cleared
      resetForm();
      return; // Don't fetch
    }

    // Fetch data when Account Code is changed
    if (value.length >= 0 || 2 || 3) {
      // Optional: Fetch after 3 characters to avoid excessive requests
      fetchBookcodedata(value);
    }
  };

  const fetchBookcodedata = async (BookCode) => {
    try {
      const cleanedBookCode = BookCode.trim(); // Normalize BookCode
      console.log("Fetching data for BookCode:", cleanedBookCode);

      const response = await fetch(
        `https://publication.microtechsolutions.net.in/php/Bookcodeget.php?BookCode=${cleanedBookCode}`
      );

      if (!response.ok) {
        throw new Error("Failed to fetch data");
      }

      const bookData = await response.json();
      console.log("API response:", bookData); // Log the entire API response

      if (Array.isArray(bookData) && bookData.length > 0) {
        // Compare BookCode as a string
        const data = bookData.find((item) => {
          console.log("Item Bookcode:", item.BookCode); // Log each BookCode for debugging
          return item.BookCode.toString() === cleanedBookCode; // Compare as strings
        });

        if (data) {
          console.log("Found data:", data); // Log the matching data

          const convertDateForInput = (dateStr) => {
            if (typeof dateStr === "string") {
              // Try to match 'YYYY-MM-DD' format first
              if (dateStr.includes("-")) {
                const [year, month, day] = dateStr.split(" ")[0].split("-");
                return `${year}-${month}-${day}`;
              }

              // Try to match 'MM/DD/YYYY' format
              if (dateStr.includes("/")) {
                const [month, day, year] = dateStr.split(" ")[0].split("/");
                return `${year}-${month}-${day}`;
              }

              // Handle invalid formats
              // toast.error('Invalid date format:', dateStr);
              return "";
            } else {
              return ""; // Handle non-string date values
            }
          };

          setBookName(data.BookName || "");
          setBookNameMarathi(data.BookNameMarathi || "");
          setBookGroupId(data.BookGroupId || "");
          setBookStandardId(data.BookStandardId || "");
          setPublicationId(data.PublicationId || "");
          setUniversityId(data.UniversityId || "");
          setBookMediumId(data.BookMediumId || "");
          setCurrentEdition(data.CurrentEdition || "");
          setBookRate(data.BookRate || "");
          setBookPages(data.BookPages || "");
          setBookForms(data.BookForms || "");
          setFilingDate(convertDateForInput(data.FillingDate) || "");
          setTitlePages(data.TitlePages || "");
          setTitlePressId(data.TitlePressId || "");
          setPaperSizeId(data.PaperSizeId || "");
          setPressId(data.PressId || "");
          setStatus(data.Status || "");
          setOpeningStock(data.OpeningStock || "");
          setReprintFlag(data.ReprintFlag || "");
          setPrintOrder(data.PrintOrder || "");
          setBookId(data.BookId || "");
          setCreationDate(convertDateForInput(data.CreationDate) || "");
          setCurrentEditionDate(
            convertDateForInput(data.CurrentEditionDate) || ""
          );
        } else {
          console.log("No matching data found for Book code:", cleanedBookCode);
          toast.error("No data found for the provided Book Code");
        }
      }
      //  else {
      //   toast.error('No data returned from the API');
      // }
    } catch (error) {
      console.error("Error fetching book data:", error);
      toast.error("Error fetching book data");
    }
  };
  // if (!validateForm()) return;

  // const handleSubmit = async (e) => {
  //   e.preventDefault();

  //   const formattedFilingDate = moment(FillingDate).format("YYYY-MM-DD");
  //   const formattedCreationdate = moment(CreationDate).format("YYYY-MM-DD");
  //   const fomattedCurrenteditiondate =
  //     moment(CurrentEditionDate).format("YYYY-MM-DD");

  //   const data = {
  //     // BookCode: BookCode,
  //     BookName: BookName,
  //     BookNameMarathi: BookNameMarathi,
  //     BookGroupId: BookGroupId,
  //     BookStandardId: BookStandardId,
  //     PublicationId: PublicationId,
  //     UniversityId: UniversityId,
  //     BookMediumId: BookMediumId,
  //     CurrentEdition: CurrentEdition,
  //     BookRate: BookRate,
  //     BookPages: BookPages,
  //     BookForms: BookForms,
  //     FillingDate: formattedFilingDate,
  //     TitlePages: TitlePages,
  //     TitlePressId: TitlePressId,
  //     PaperSizeId: PaperSizeId,
  //     PressId: PressId,
  //     Status: Status,
  //     OpeningStock: OpeningStock,
  //     ReprintFlag: ReprintFlag,
  //     PrintOrder: PrintOrder,
  //     BookId: BookId,
  //     CreationDate: formattedCreationdate,
  //     CurrentEditionDate: fomattedCurrenteditiondate,
  //     CreatedBy: !isEditing ? userId : undefined,
  //     // ...(isEditing && { Id: id}), // Only include Id if editing
  //   };

  //   console.log(data, "book data");

  //   const url = isEditing
  //     ? "https://publication.microtechsolutions.net.in/php/Bookupdate.php"
  //     : "https://publication.microtechsolutions.net.in/php/Bookpost.php";

  //   //     // If editing, include the author ID in the payload
  //   if (isEditing) {
  //     data.Id = id;
  //     data.UpdatedBy = userId;
  //   }

  //   try {
  //     await axios.post(url, data, {
  //       headers: {
  //         "Content-Type": "application/x-www-form-urlencoded",
  //       },
  //     });

  //     toast.success(
  //       isEditing ? "Book updated successfully!" : "Book added successfully!"
  //     );
  //     resetForm();
  //     setIsModalOpen(false);
  //     fetchAllBooks();
  //   } catch (error) {
  //     const errorMessage =
  //       error.response?.data?.message || "Error saving record!";
  //     toast.error(errorMessage);
  //   }
  // };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formatDate = (date) =>
      date ? moment(date).format("YYYY-MM-DD") : null;

    const data = {
      BookCode: BookCode || null,
      BookName: BookName || null,
      BookNameMarathi: BookNameMarathi || null,
      BookGroupId: BookGroupId || null,
      BookStandardId: BookStandardId || null,
      PublicationId: PublicationId || null,
      UniversityId: UniversityId || null,
      BookMediumId: BookMediumId || null,
      CurrentEdition: CurrentEdition || null,
      BookRate: BookRate || null,
      BookPages: BookPages || null,
      BookForms: BookForms || null,
      FillingDate: formatDate(FillingDate),
      TitlePages: TitlePages || null,
      TitlePressId: TitlePressId || null,
      PaperSizeId: PaperSizeId || null,
      PressId: PressId || null,
      Status: Status || null,
      OpeningStock: OpeningStock || null,
      ReprintFlag: ReprintFlag || null,
      PrintOrder: PrintOrder || null,
      BookId: BookId || null,
      CreationDate: formatDate(CreationDate),
      CurrentEditionDate: formatDate(CurrentEditionDate),
      CreatedBy: !isEditing ? userId : null,
    };

    if (isEditing) {
      data.Id = id;
      data.UpdatedBy = userId;
    }

    console.log(data, "book data");

    const url = isEditing
      ? "https://publication.microtechsolutions.net.in/php/Bookupdate.php"
      : "https://publication.microtechsolutions.net.in/php/Bookpost.php";

    try {
      await axios.post(url, data, {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      });

      toast.success(
        isEditing ? "Book updated successfully!" : "Book added successfully!"
      );
      resetForm();
      setIsModalOpen(false);
      fetchAllBooks();
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Error saving record!";
      toast.error(errorMessage);
    }
  };

  const handleDelete = (index, Id) => {
    setDeleteIndex(index);
    setDeleteId(Id);
    setIsDeleteDialogOpen(true); // Show confirmation dialog
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
      "https://publication.microtechsolutions.net.in/php/Bookdelete.php",
      requestOptions
    )
      .then((response) => response.text())
      .then((result) => console.log(result))
      .catch((error) => console.error(error));
    toast.success("Book Deleted Successfully");

    setIsDeleteDialogOpen(false);
    fetchAllBooks();
  };

  const cancelDelete = () => {
    setIsDeleteDialogOpen(false);
    setDeleteIndex(null);
  };

  const navigate = useNavigate();
  const handlePrint = (row) => {
    console.log(row); // Check what properties are available on the row object
    const book = books[row.index]; // Ensure that row.index exists
    console.log(book, "selected row of book");

    if (book) {
      navigate("/masters/book/bookprint", { state: { bookData: book } });
    } else {
      console.error("Book not found!");
    }
  };

  const columns = useMemo(
    () => [
      {
        accessorKey: "SrNo",
        header: "Sr.No",
        size: 5,
        Cell: ({ row }) => row.index + 1,
      },
      {
        accessorKey: "BookCode",
        header: "Book Code",
        size: 5,
      },
      {
        accessorKey: "BookName",
        header: "Book Name",
        size: 2,
      },

      {
        accessorKey: "BookNameMarathi",
        header: "Book Name Marathi",
        size: 2,
      },

      {
        accessorKey: "actions",
        header: "Actions",
        size: 150,
        Cell: ({ row }) => (
          <div>
            <Button
              onClick={() => handleEdit(row)}
              style={{
                background: "#0a60bd",
                color: "white",
                marginRight: "5px",
              }}>
              Edit
            </Button>
            <Button
              onClick={() => handleDelete(row.index, row.original.Id)}
              style={{
                background: "red",
                color: "white",
                fontSize: "22px",
                marginRight: "5px",
              }}>
              <RiDeleteBin5Line />
            </Button>

            {/* <Button
              onClick={handlePrint}
              style={{
                background: "green",
                color: "white",
              }}>
              Print

            </Button> */}
          </div>
        ),
      },
    ],
    [books]
  );

  const table = useMaterialReactTable({
    columns,
    data: books,
    // enablePagination: false,
    muiTableHeadCellProps: {
      style: {
        backgroundColor: "#E9ECEF",
        color: "black",
        fontSize: "16px",
      },
    },
  });

  return (
    <>
      <div className="book-container">
        <h1> Book Master </h1>

        {/* Show loading message/spinner if data is loading  */}
        {/* {loading ? (
          <div className="loadingbook-container">
            <CircularProgress />
            <p>Loading Books... Please wait.</p>
          </div>
        ) : ( */}
        <div className="booktable-master">
          <div className="booktable1-master">
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
            <div className="booktable-container">
              <MaterialReactTable table={table} />
            </div>

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
                  const newPage = Number(e.target.value);
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
        </div>
        {/* )} */}

        {isModalOpen && <div className="book-overlay" />}
        <Modal open={isModalOpen}>
          <div className="book-modal">
            <h2
              style={{
                textAlign: "center",
                fontWeight: "620",
                margin: "2px",
                fontSize: "27px",
              }}>
              {editingIndex >= 0 ? "Edit Book" : "Add Book"}
            </h2>

            <form
              onSubmit={handleSubmit}
              className="masterbook-form"
              noValidate>
              <div className="first-row">
                <div>
                  <label className="book-label">Book Code</label>{" "}
                  <div>
                    <input
                      type="text"
                      id="BookCode"
                      name="BookCode"
                      value={BookCode}
                      onChange={handleBookcodechange}
                      placeholder="Auto-Incremented" // dynamically passed value
                      // readOnly
                      style={{ background: "	#D0D0D0" }}
                      ref={bookcodeRef}
                      onKeyDown={(e) => handleKeyDown(e, booknameRef)}
                      className="masterbook-control"
                    />

                    {/* <div>
                    {errors.BookCode && (
                      <b className="error-text">{errors.BookCode}</b>
                    )}
                  </div> */}
                  </div>
                </div>
                <div>
                  <label className="book-label">Book Name</label>
                  <div>
                    <Tooltip
                      title={
                        <span style={{ fontSize: "14px", fontWeight: "bold" }}>
                          {BookName}
                        </span>
                      }
                      arrow>
                      <input
                        type="text"
                        id="BookName"
                        name="BookName"
                        value={BookName}
                        onChange={(e) => setBookName(e.target.value)}
                        maxLength={100}
                        ref={booknameRef}
                        onKeyDown={(e) => handleKeyDown(e, booknamemarathiRef)}
                        className="masterbook-control"
                        style={{ width: "500px" }}
                        placeholder="Enter Book Name"
                        title={BookName} // Shows full text on hover
                      />
                    </Tooltip>

                    {/* <div>
                    {errors.BookName && (
                      <b className="error-text">{errors.BookName}</b>
                    )}
                  </div> */}
                  </div>
                </div>
                <div>
                  <label className="book-label">Book Name Marathi</label>
                  <div>
                    <Tooltip
                      title={
                        <span style={{ fontSize: "14px", fontWeight: "bold" }}>
                          {BookNameMarathi}
                        </span>
                      }
                      arrow>
                      <span>
                        {" "}
                        <ReactTransliterate
                          key={isEditing ? "edit" : "new"} // Force re-mount on mode switch
                          value={BookNameMarathi}
                          onChangeText={(text) => {
                            console.log("Transliterated Text:", text); // Log the transliterated text
                            setBookNameMarathi(text); // Update the state with the new text
                          }}
                          lang="mr"
                          renderComponent={(props) => (
                            <input
                              {...props}
                              type="text"
                              id="BookNameMarathi"
                              name="BookNameMarathi"
                              maxLength={200}
                              style={{ width: "500px" }}
                              className="marathibook-control"
                              placeholder="पुस्तकाचे नाव प्रविष्ट करा"
                            />
                          )}
                        />
                      </span>
                    </Tooltip>
                    {/* <div>
                    {errors.BookNameMarathi && (
                      <b className="error-text">{errors.BookNameMarathi}</b>
                    )}
                  </div> */}
                  </div>
                </div>
              </div>
              <div className="other-rows">
                <div>
                  <label className="book-label">Book Group</label>
                  <div>
                    {/* <Tooltip title={<span style={{ fontSize: "14px", fontWeight: "bold" }}>{BookGroupId}</span>} arrow> */}

                    <Select
                      id="BookGroupId"
                      name="BookGroupId"
                      value={bookgroupOptions.find(
                        (option) => option.value === BookGroupId
                      )}
                      isClearable
                      onChange={(option) =>
                        setBookGroupId(option ? option.value : "")
                      }
                      ref={bookgroupIdRef}
                      onKeyDown={(e) => handleKeyDown(e, bookstandardidRef)}
                      options={bookgroupOptions}
                      styles={{
                        control: (base) => ({
                          ...base,
                          width: "170px",
                          marginTop: "10px",
                          borderRadius: "4px",
                          border: "1px solid rgb(223, 222, 222)",
                          marginBottom: "5px",
                        }),
                        menu: (base) => ({
                          ...base,
                          zIndex: 100,
                        }),
                      }}
                      placeholder="Select  Group"
                    />

                    {/* </Tooltip> */}

                    {/* <div>
                    {errors.BookGroupId && (
                      <b className="error-text">{errors.BookGroupId}</b>
                    )}
                  </div> */}
                  </div>
                </div>
                <div>
                  <label className="book-label">Book Standard</label>
                  <div>
                    {/* <Tooltip title={<span style={{ fontSize: "14px", fontWeight: "bold" }}>{BookStandardId}</span>} arrow> */}

                    <Select
                      id="BookStandardId"
                      name="BookStandardId"
                      // value={bookstandardOptions.find(
                      //   (option) => option.value === BookStandardId
                      // )}

                      value={bookstandardOptions.find(
                        (option) =>
                          option.value.toString() === BookStandardId.toString()
                      )}
                      isClearable
                      onChange={(option) =>
                        setBookStandardId(option ? option.value : "")
                      }
                      ref={bookstandardidRef}
                      onKeyDown={(e) => handleKeyDown(e, publicationRef)}
                      options={bookstandardOptions}
                      styles={{
                        control: (base) => ({
                          ...base,
                          width: "170px",
                          marginTop: "10px",
                          marginBottom: "5px",
                          border: "1px solid rgb(223, 222, 222)",
                          borderRadius: "4px",
                        }),
                        menu: (base) => ({
                          ...base,
                          zIndex: 100,
                        }),
                      }}
                      placeholder="Select Standard "
                    />
                    {/* </Tooltip> */}
                    {/* <div>
                    {errors.BookStandardId && (
                      <b className="error-text">{errors.BookStandardId}</b>
                    )}
                  </div> */}
                  </div>
                </div>
                <div>
                  <label className="book-label">Publication</label>{" "}
                  <div>
                    {/* <Tooltip title={<span style={{ fontSize: "14px", fontWeight: "bold" }}>{PublicationId}</span>} arrow> */}

                    <Select
                      id="PublicationId"
                      name="PublicationId"
                      value={publicationOptions.find(
                        (option) => option.value === PublicationId
                      )}
                      isClearable
                      onChange={(option) =>
                        setPublicationId(option ? option.value : "")
                      }
                      ref={publicationRef}
                      onKeyDown={(e) => handleKeyDown(e, universityRef)}
                      options={publicationOptions}
                      styles={{
                        control: (base) => ({
                          ...base,
                          width: "170px",
                          marginTop: "10px",
                          borderRadius: "4px",
                          border: "1px solid rgb(223, 222, 222)",
                          marginBottom: "5px",
                        }),
                        menu: (base) => ({
                          ...base,
                          zIndex: 100,
                        }),
                      }}
                      placeholder="Publication "
                    />
                    {/* </Tooltip> */}

                    {/* <div>
                    {errors.PublicationId && (
                      <b className="error-text">{errors.PublicationId}</b>
                    )}
                  </div> */}
                  </div>
                </div>
                <div>
                  <label className="book-label">
                    University
                    {/* <b className="required">*</b> */}
                  </label>
                  <div>
                    {/* <Tooltip title={<span style={{ fontSize: "14px", fontWeight: "bold" }}>{UniversityId}</span>} arrow> */}

                    <Select
                      id="UniversityId"
                      name="UniversityId"
                      value={universityOptions.find(
                        (option) => option.value === UniversityId
                      )}
                      isClearable
                      onChange={(option) =>
                        setUniversityId(option ? option.value : "")
                      }
                      ref={universityRef}
                      onKeyDown={(e) => handleKeyDown(e, bookmediumRef)}
                      options={universityOptions}
                      getOptionLabel={(e) => (
                        <div>
                          <span
                            data-tooltip-id={`tooltip-${e.value}`}
                            data-tooltip-content={e.label}
                            style={{ display: "flex" }}>
                            {e.label}
                          </span>
                          <Tooltip id={`tooltip-${e.label}`} />
                        </div>
                      )}
                      styles={{
                        control: (base) => ({
                          ...base,
                          width: "170px",
                          marginTop: "10px",
                          borderRadius: "4px",
                          border: "1px solid rgb(223, 222, 222)",
                          marginBottom: "5px",
                        }),
                        menu: (base) => ({
                          ...base,
                          zIndex: 100,
                        }),
                      }}
                      placeholder="Select University "
                    />
                    {/* </Tooltip> */}

                    {/* <div>
                    {errors.UniversityId && (
                      <b className="error-text">{errors.UniversityId}</b>
                    )}
                  </div> */}
                  </div>
                </div>
                <div>
                  <label className="book-label">Book Medium</label>
                  <div>
                    {/* <Tooltip title={<span style={{ fontSize: "14px", fontWeight: "bold" }}>{BookMediumId}</span>} arrow> */}

                    <Select
                      id="BookMediumId"
                      name="BookMediumId"
                      value={bookmediumOptions.find(
                        (option) => option.value === BookMediumId
                      )}
                      isClearable
                      onChange={(option) =>
                        setBookMediumId(option ? option.value : "")
                      }
                      ref={bookmediumRef}
                      onKeyDown={(e) => handleKeyDown(e, currenteditionRef)}
                      options={bookmediumOptions}
                      styles={{
                        control: (base) => ({
                          ...base,
                          width: "170px",
                          marginTop: "10px",
                          borderRadius: "4px",
                          border: "1px solid rgb(223, 222, 222)",
                          marginBottom: "5px",
                        }),
                        menu: (base) => ({
                          ...base,
                          zIndex: 100,
                        }),
                      }}
                      placeholder="Select Medium "
                    />
                    {/* </Tooltip> */}

                    {/* <div>
                    {errors.BookMediumId && (
                      <b className="error-text">{errors.BookMediumId}</b>
                    )}
                  </div> */}
                  </div>
                </div>
                <div>
                  <label className="book-label">Current Edition</label>
                  <div>
                    <input
                      type="text"
                      id="CurrentEdition"
                      name="CurrentEdition"
                      value={CurrentEdition}
                      onChange={(e) => setCurrentEdition(e.target.value)}
                      maxLength={20}
                      ref={currenteditionRef}
                      onKeyDown={(e) => handleKeyDown(e, bookrateRef)}
                      className="masterbook-control"
                      placeholder="Enter Current Edition"
                    />

                    {/* <div>
                    {errors.CurrentEdition && (
                      <b className="error-text">{errors.CurrentEdition}</b>
                    )}
                  </div> */}
                  </div>
                </div>
                <div>
                  <label className="book-label">Book Rate</label>{" "}
                  <div>
                    <input
                      type="text" // Change to "text" to handle decimal input more flexibly
                      id="BookRate"
                      name="BookRate"
                      value={BookRate}
                      onChange={(e) => {
                        const value = e.target.value;

                        // Regex to validate decimal numbers with at most 18 digits total and 2 decimal places
                        const regex = /^\d{0,18}(\.\d{0,2})?$/;

                        // Check if the value matches the regex
                        if (value === "" || regex.test(value)) {
                          setBookRate(value);
                        }
                      }}
                      ref={bookrateRef}
                      onKeyDown={(e) => handleKeyDown(e, bookpagesRef)}
                      className="masterbook-control"
                      placeholder="Enter Book Rate"
                    />

                    {/* <div>
                    {errors.BookRate && (
                      <b className="error-text">{errors.BookRate}</b>
                    )}
                  </div> */}
                  </div>
                </div>
                <div>
                  <label className="book-label">MRP</label>{" "}
                  <div>
                    <input
                      type="text" // Change to "text" to handle decimal input more flexibly
                      id="MRP"
                      name="MRP"
                      value={MRP}
                      onChange={(e) => {
                        const value = e.target.value;

                        // Regex to validate decimal numbers with at most 18 digits total and 2 decimal places
                        const regex = /^\d{0,18}(\.\d{0,2})?$/;

                        // Check if the value matches the regex
                        if (value === "" || regex.test(value)) {
                          setMRP(value);
                        }
                      }}
                      ref={bookrateRef}
                      onKeyDown={(e) => handleKeyDown(e, bookpagesRef)}
                      className="masterbook-control"
                      placeholder="Enter Book Rate"
                    />

                    {/* <div>
                    {errors.BookRate && (
                      <b className="error-text">{errors.BookRate}</b>
                    )}
                  </div> */}
                  </div>
                </div>
                <div style={{ display: "none" }}>
                  <label className="book-label">Book Pages</label>
                  <div>
                    <input
                      type="number"
                      id="BookPages"
                      name="BookPages"
                      value={BookPages}
                      onChange={(e) => setBookPages(e.target.value)}
                      ref={bookpagesRef}
                      onKeyDown={(e) => handleKeyDown(e, bookformsRef)}
                      className="masterbook-control"
                      placeholder="Enter Book Pages"
                    />

                    {/* <div>
                    {errors.BookPages && (
                      <b className="error-text">{errors.BookPages}</b>
                    )}
                  </div> */}
                  </div>
                </div>
                <div style={{ display: "none" }}>
                  <label className="book-label">Book Forms</label>
                  <div>
                    <input
                      type="number"
                      id="BookForms"
                      name="BookForms"
                      value={BookForms}
                      onChange={(e) => setBookForms(e.target.value)}
                      ref={bookformsRef}
                      onKeyDown={(e) => handleKeyDown(e, fillingdateRef)}
                      className="masterbook-control"
                      placeholder="Enter Book Forms"
                    />
                    {/* <div>
                    {errors.BookForms && (
                      <b className="error-text">{errors.BookForms}</b>
                    )}
                  </div> */}
                  </div>
                </div>
                <div>
                  <label className="book-label">Filling Date</label>
                  <div>
                    <input
                      type="date"
                      id="FillingDate"
                      name="FillingDate"
                      value={FillingDate}
                      onChange={(e) => setFilingDate(e.target.value)}
                      ref={fillingdateRef}
                      onKeyDown={(e) => handleKeyDown(e, titlepagesRef)}
                      className="masterbook-control"
                      placeholder="Enter Filing Date"
                    />

                    {/* <div>
                    {errors.FillingDate && (
                      <b className="error-text">{errors.FillingDate}</b>
                    )}
                  </div> */}
                  </div>
                </div>
                <div>
                  <label className="book-label">Title Pages</label>
                  <div>
                    <input
                      type="number"
                      id="TitlePages"
                      name="TitlePages"
                      value={TitlePages}
                      onChange={(e) => setTitlePages(e.target.value)}
                      ref={titlepagesRef}
                      onKeyDown={(e) => handleKeyDown(e, titlepressRef)}
                      className="masterbook-control"
                      placeholder="Enter Title pages"
                    />
                    {/* 
                  <div>
                    {errors.TitlePages && (
                      <b className="error-text">{errors.TitlePages}</b>
                    )}
                  </div> */}
                  </div>
                </div>
                <div>
                  <label className="book-label">Title Press</label>{" "}
                  <div>
                    <Select
                      id="TitlePressId"
                      name="TitlePressId"
                      value={titlepressOptions.find(
                        (option) => option.value === TitlePressId
                      )}
                      isClearable
                      onChange={(option) =>
                        setTitlePressId(option ? option.value : "")
                      }
                      ref={titlepressRef}
                      onKeyDown={(e) => handleKeyDown(e, papersizeRef)}
                      options={titlepressOptions}
                      styles={{
                        control: (base) => ({
                          ...base,
                          width: "170px",
                          marginTop: "10px",
                          borderRadius: "4px",
                          border: "1px solid rgb(223, 222, 222)",
                          marginBottom: "5px",
                        }),
                        menu: (base) => ({
                          ...base,
                          zIndex: 100,
                        }),
                      }}
                      placeholder="Select title press "
                    />

                    {/* <div>
                    {errors.TitlePressId && (
                      <b className="error-text">{errors.TitlePressId}</b>
                    )}
                  </div> */}
                  </div>
                </div>
                <div>
                  <label className="book-label">Paper Size</label>
                  <div>
                    {/* <Tooltip title={<span style={{ fontSize: "14px", fontWeight: "bold" }}>{PaperSizeId}</span>} arrow> */}

                    <Select
                      id="PaperSizeId"
                      name="PaperSizeId"
                      value={papersizeOptions.find(
                        (option) => option.value === PaperSizeId
                      )}
                      isClearable
                      onChange={(option) =>
                        setPaperSizeId(option ? option.value : "")
                      }
                      ref={papersizeRef}
                      onKeyDown={(e) => handleKeyDown(e, pressRef)}
                      options={papersizeOptions}
                      styles={{
                        control: (base) => ({
                          ...base,
                          width: "170px",
                          marginTop: "10px",
                          borderRadius: "4px",
                          border: "1px solid rgb(223, 222, 222)",
                          marginBottom: "5px",
                        }),
                        menu: (base) => ({
                          ...base,
                          zIndex: 100,
                        }),
                      }}
                      placeholder="Select papersize "
                    />
                    {/* </Tooltip> */}

                    {/* <div>
                    {errors.PaperSizeId && (
                      <b className="error-text">{errors.PaperSizeId}</b>
                    )}
                  </div> */}
                  </div>
                </div>
                <div>
                  <label className="book-label">Press</label>
                  <div>
                    <Select
                      id="PressId"
                      name="PressId"
                      value={
                        pressOptions.find(
                          (option) => option.value === PressId
                        ) || null
                      } // Ensure it does not break if `PressId` is null
                      isClearable
                      onChange={(option) =>
                        setPressId(option ? option.value : "")
                      }
                      ref={pressRef}
                      onKeyDown={(e) => handleKeyDown(e, statusRef)}
                      options={pressOptions}
                      styles={{
                        control: (base) => ({
                          ...base,
                          width: "170px",
                          marginTop: "10px",
                          borderRadius: "4px",
                          border: "1px solid rgb(223, 222, 222)",
                          marginBottom: "5px",
                        }),
                        menu: (base) => ({
                          ...base,
                          zIndex: 100,
                        }),
                      }}
                      getOptionLabel={(e) => e.label} // Ensures correct display of names
                      getOptionValue={(e) => e.value} // Ensures correct value selection
                      placeholder="Select Press"
                    />

                    {/* <div>
                    {errors.PressId && (
                      <b className="error-text">{errors.PressId}</b>
                    )}
                  </div> */}
                  </div>
                </div>{" "}
                <div>
                  <label className="book-label">Status</label>
                  <div>
                    <input
                      type="text"
                      id="Status"
                      name="Status"
                      value={Status}
                      onChange={(e) => setStatus(e.target.value)}
                      maxLength={50}
                      ref={statusRef}
                      onKeyDown={(e) => handleKeyDown(e, openingstockRef)}
                      className="masterbook-control"
                      placeholder="Enter Status"
                    />

                    {/* <div>
                    {errors.Status && (
                      <b className="error-text">{errors.Status}</b>
                    )}
                  </div> */}
                  </div>
                </div>
                <div style={{ display: "none" }}>
                  <label className="book-label">Opening stock</label>
                  <div>
                    <input
                      type="number"
                      id="OpeningStock"
                      name="OpeningStock"
                      value={OpeningStock}
                      onChange={(e) => setOpeningStock(e.target.value)}
                      ref={openingstockRef}
                      onKeyDown={(e) => handleKeyDown(e, reprintflagRef)}
                      className="masterbook-control"
                      placeholder="Enter Opening Stock"
                    />

                    {/* <div>
                    {errors.OpeningStock && (
                      <b className="error-text">{errors.OpeningStock}</b>
                    )}
                  </div> */}
                  </div>
                </div>
                <div style={{ display: "none" }}>
                  <label className="book-label">Reprint Flag</label>
                  <div>
                    <input
                      type="text"
                      id="ReprintFlag"
                      name="ReprintFlag"
                      value={ReprintFlag}
                      onChange={(e) => setReprintFlag(e.target.value)}
                      maxLength={1}
                      ref={reprintflagRef}
                      onKeyDown={(e) => handleKeyDown(e, printorderRef)}
                      className="masterbook-control"
                      placeholder="Enter Reprint Flag"
                    />

                    {/* <div>
                    {errors.ReprintFlag && (
                      <b className="error-text">{errors.ReprintFlag}</b>
                    )}
                  </div> */}
                  </div>
                </div>
                <div>
                  <label className="book-label">Print Order</label>
                  <div>
                    <input
                      type="number"
                      id="PrintOrder"
                      name="PrintOrder"
                      value={PrintOrder}
                      onChange={(e) => setPrintOrder(e.target.value)}
                      ref={printorderRef}
                      onKeyDown={(e) => handleKeyDown(e, bookidRef)}
                      className="masterbook-control"
                      placeholder="Enter Print Order"
                    />

                    {/* <div>
                    {errors.PrintOrder && (
                      <b className="error-text">{errors.PrintOrder}</b>
                    )}
                  </div> */}
                  </div>
                </div>
                <div>
                  <label className="book-label">Book Id</label>
                  <div>
                    <input
                      type="text"
                      id="BookId"
                      name="BookId"
                      value={BookId}
                      onChange={(e) => setBookId(e.target.value)}
                      ref={bookidRef}
                      onKeyDown={(e) => handleKeyDown(e, creationdateRef)}
                      className="masterbook-control"
                      placeholder="Enter Book Id"
                    />

                    {/* <div>
                    {errors.BookId && (
                      <b className="error-text">{errors.BookId}</b>
                    )}
                  </div> */}
                  </div>
                </div>
                <div>
                  <label className="book-label">Creation Date</label>
                  <div>
                    <input
                      type="date"
                      id="CreationDate"
                      name="CreationDate"
                      value={CreationDate}
                      onChange={(e) => setCreationDate(e.target.value)}
                      ref={creationdateRef}
                      onKeyDown={(e) => handleKeyDown(e, curreditiondateRef)}
                      className="masterbook-control"
                      placeholder="Enter Creation Date"
                    />

                    {/* <div>
                    {errors.CreationDate && (
                      <b className="error-text">{errors.CreationDate}</b>
                    )}
                  </div> */}
                  </div>
                </div>
                <div>
                  <label className="book-label">Current Edition Date</label>
                  <div>
                    <input
                      type="date"
                      id="CurrentEditionDate"
                      name="CurrentEditionDate"
                      value={CurrentEditionDate}
                      onChange={(e) => setCurrentEditionDate(e.target.value)}
                      ref={curreditiondateRef}
                      onKeyDown={(e) => handleKeyDown(e, saveRef)}
                      className="masterbook-control"
                      placeholder="Enter Current Edition Date"
                    />

                    {/* <div>
                    {errors.CurrentEditionDate && (
                      <b className="error-text">{errors.CurrentEditionDate}</b>
                    )}
                  </div> */}
                  </div>
                </div>
              </div>
            </form>

            <div className="book-btn-container">
              <Button
                onClick={handleSubmit}
                ref={saveRef}
                type="submit"
                style={{
                  background: "#0a60bd",
                  alignContent: "center",
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
              <u>Book</u>
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
      {/* </div> */}
    </>
  );
}

export default Book;
