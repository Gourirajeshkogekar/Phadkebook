import React, {
  useState,
  useMemo,
  useEffect,
  useSyncExternalStore,
} from "react";

import { Suspense, lazy } from "react";

import "./Convassordetails.css";
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
import { DatePicker } from "@mui/x-date-pickers";
import { RiDeleteBin5Line } from "react-icons/ri";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";
import dayjs from "dayjs";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { useRef } from "react";
import { useNavigate } from "react-router-dom";

function Convassordetails() {
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

    fetchCanvassorheaders();
  }, []);

  const [pageIndex, setPageIndex] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const [anchorEl, setAnchorEl] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(null);
  const [selectedIndex, setSelectedIndex] = useState(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [deleteIndex, setDeleteIndex] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const [RefNo, setrefno] = useState(null);
  const [Specimen_report_no, setSpecimenreportNo] = useState("");

  const [Date, setDate] = useState("");
  const [CanvassorId, setConvassorId] = useState("");
  const [CityId, setCityId] = useState("");
  const [TransactionDate, setTransactiondate] = useState("");
  const [CollegeId, setCollegeId] = useState("");
  const [colleges, setColleges] = useState([]);

  const [collegeProfessors, setCollegeProfessors] = useState([]);

  const [cities, setCities] = useState([]);
  const [areas, setareas] = useState([]);
  const [convassors, setConvassors] = useState([]);
  const [filteredCities, setFilteredCities] = useState([]);

  const [bookOptions, setBookOptions] = useState([]);
  const [bookCodes, setBookcodes] = useState([]);
  const [professors, setProfessors] = useState([]);
  const [ProfessorId, setProfessorId] = useState("");

  const [collegeAddress, setCollegeAddress] = useState("");

  // const [Proftext, setProftext] = useState("");
  const [editingIndex, setEditingIndex] = useState(-1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [id, setId] = useState("");

  const [convassordetailId, setConvassordetailId] = useState("");
  const [errors, setErrors] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [convassorheaders, setConvassorheaders] = useState([]);
  const [convassordetails, setConvassordetails] = useState([]);

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
  const [selectedBranch, setSelectedBranch] = useState("Other");

  const handleBranchChange = (value) => {
    setSelectedBranch(value);
  };

  const handleSpecimenChange = (e) => {
    const value = e.target.value.replace(/\D/g, ""); // allow only numbers
    setSpecimenNumber(value);
  };

  const [rows, setRows] = useState([
    {
      SerialNo: "",
      BookId: "",
      ProfessorId: "",
      Copies: 0,
    },
  ]);

  const totalCopies = useMemo(() => {
    return rows.reduce((sum, row) => sum + (Number(row.Copies) || 0), 0);
  }, [rows]);

  const navigate = useNavigate();
  const handleProfessorDetailsopen = () => {
    navigate("/masters/professors");
  };

  useEffect(() => {
    fetchcanvassors();
    fetchConvassordetails();
    fetchCities();
    fetchCollegesByCity();
    fetchBookNames();
    fetchAreas()
  }, []);

  useEffect(() => {
    fetchCanvassorheaders();
    console.log("this function is called");
  }, [pageIndex]);

  useEffect(() => {
    if (!CollegeId) {
      setCollegeProfessors([]);
      return;
    }

    fetchProfessorsByCollege(CollegeId);
  }, [CollegeId]);

  const fetchProfessorsByCollege = async (collegeId) => {
    try {
      const res = await axios.get(
        "https://publication.microtechsolutions.net.in/php/get/search.php",
        {
          params: {
            Table: "Professor",
            Colname: "CollegeId",
            Text: collegeId,
          },
        },
      );

      const list = (res.data || []).map((p) => ({
        value: Number(p.Id),
        label: p.ProfessorName,
      }));

      setCollegeProfessors(list);

      // 🔥 AUTO-SELECT if only ONE professor exists
      if (list.length === 1) {
        setRows((prev) =>
          prev.map((row) => ({
            ...row,
            ProfessorId: list[0].value,
            ProfessorName: list[0].label,
          })),
        );
      }
    } catch (err) {
      console.error(err);
      setCollegeProfessors([]);
    }
  };

  const fetchCanvassorheaders = async () => {
    try {
      const response = await axios.get(
        `https://publication.microtechsolutions.net.in/php/get/gettblpage.php?Table=Canvassorheader&PageNo=${pageIndex}`,
      );
      console.log(response.data, "response of canvassor header");

      setConvassorheaders(response.data.data);
      setTotalPages(response.data.total_pages);
    } catch (error) {
      // toast.error("Error fetching convassor header:", error);
      console.error("Error fetching convassor headers:", error);
    }
  };

  const fetchConvassordetails = async () => {
    try {
      const response = await axios.get(
        "https://publication.microtechsolutions.net.in/php/get/gettable.php?Table=Canvassordetail",
      );
      console.log(response.data, "response of convassor details");
      setConvassordetails(response.data);
    } catch (error) {
      // toast.error("Error fetching sells challan details:", error);
      console.error("Error fetching convassor details:", error);
    }
  };

  const fetchcanvassors = async () => {
    try {
      const response = await axios.get(
        "https://publication.microtechsolutions.net.in/php/get/getCanvassorMaster.php",
      );
      const canvassorOptions = response.data.map((can) => ({
        value: can.Id,
        label: can.CanvassorName,
      }));
      setConvassors(canvassorOptions);
    } catch (error) {
      // toast.error("Error fetching Canvassors:", error);
    }
  };

  const fetchCitiesByCanvassor = async (canvassorId) => {
    try {
      const res = await axios.get(
        "https://publication.microtechsolutions.net.in/php/get/getAssignCanvassor.php",
        { params: { CanvassorId: canvassorId } },
      );

      if (res.data?.cityList) {
        const apiCities = res.data.cityList
          .split(",")
          .map((name) => name.trim());

        const normalize = (str) => str.toLowerCase().replace(/[^a-z]/g, "");

        const mapped = apiCities.map((apiCity) => {
          // find matching city from master list
          const match = cities.find(
            (c) => normalize(c.label) === normalize(apiCity),
          );

          return {
            label: apiCity, // ✅ DISPLAY AS-IS
            value: match ? match.value : apiCity, // fallback if not found
          };
        });

        setFilteredCities(mapped);

        console.log(filteredCities, "filtered cities");
        setCityId(null);
      } else {
        setFilteredCities([]);
      }
    } catch (error) {
      console.error("Error fetching canvassor cities", error);
      setFilteredCities([]);
    }
  };

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      rows.forEach((row, index) => {
        if (row.Proftext && row.Proftext.length >= 2) {
          fetchProfessors(row.Proftext, index);
        }
      });
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [rows]);
  const [professorsList, setProfessorsList] = useState([]); // array of arrays

  const fetchProfessors = async (text, rowIndex) => {
    try {
      const response = await axios.get(
        `https://publication.microtechsolutions.net.in/php/get/search.php?Table=Professor&Colname=ProfessorName&Text=${text}`,
      );
      const data = response.data || [];

      const newList = [...professorsList];
      newList[rowIndex] = data.map((prof) => ({
        value: prof.Id,
        label: prof.ProfessorName,
      }));

      setProfessorsList(newList);
    } catch (error) {
      console.error("Error fetching professors", error);
    }
  };

   
  const fetchCities = async () => {
    try {
      const response = await axios.get(
        "https://publication.microtechsolutions.net.in/php/Cityget.php",
      );
      const cityOptions = response.data.map((city) => ({
        value: city.Id,
        label: city.CityName,
      }));
      setCities(cityOptions);
    } catch (error) {
      // toast.error("Error fetching cities:", error);
    }
  };

  const fetchAreas = async () => {
    try {
      const response = await axios.get(
        "https://publication.microtechsolutions.net.in/php/Areaget.php",
      );
      const areaOptions = response.data.map((area) => ({
        value: area.Id,
        label: area.AreaName,
      }));
      setareas(areaOptions);
    } catch (error) {
      // toast.error("Error fetching areas:", error);
    }
  };
  const [selectedCollege, setSelectedCollege] = useState(null);

  const fetchCollegesByCity = async (cityId) => {
    if (!cityId) {
      setColleges([]);
      return;
    }

    try {
      const response = await axios.get(
        "https://publication.microtechsolutions.net.in/php/Collegeget.php",
        {
          params: { CityId: cityId },
        },
      );

      // 🔥 FIX IS HERE
      const colOptions = response.data.data.map((col) => ({
        value: col.CollegeId,
        label: col.CollegeName,
        cityId: col.CityId,
        code: col.CollegeCode,
        active: col.Active,
      }));

      setColleges(colOptions);
    } catch (error) {
      console.error("Error fetching colleges", error);
      setColleges([]);
    }
  };

  const getAreaName = (areaId) =>
    areas.find((a) => a.value === areaId)?.label || "";

  const getCityName = (cityId) =>
    cities.find((c) => c.value === cityId)?.label || "";

  const fetchBookNames = async () => {
    try {
      const response = await axios.get(
        "https://publication.microtechsolutions.net.in/php/Bookget.php",
      );
      const books = response.data.map((book) => ({
        value: book.Id,
        label: book.BookName || book.BookNameMarathi,
        code: book.BookCode,
      }));
      setBookOptions(books);
    } catch (error) {
      // toast.error("Error fetching books:", error);
    }
  };

  useEffect(() => {
    const loadInitialProfessors = async () => {
      const updatedList = await Promise.all(
        rows.map(async (row, index) => {
          if (row.ProfessorId) {
            try {
              const response = await axios.get(
                `https://publication.microtechsolutions.net.in/php/get/search.php?Table=Professor&Colname=Id&Text=${row.ProfessorId}`,
              );
              const data = response.data || [];
              return data.map((prof) => ({
                value: prof.Id,
                label: prof.ProfessorName,
              }));
            } catch (error) {
              console.error("Error loading professor", error);
              return [];
            }
          }
          return [];
        }),
      );
      setProfessorsList(updatedList);
    };

    loadInitialProfessors();
  }, [rows]);

  const handleSearchChange = async (text, index) => {
    setRows((prevRows) =>
      prevRows.map((r, i) => (i === index ? { ...r, Proftext: text } : r)),
    );

    try {
      const response = await axios.get(
        `https://publication.microtechsolutions.net.in/php/get/search.php?Table=Professor&Colname=ProfessorName&Text=${text}`,
      );
      const data = response.data || [];

      const newOptions = data.map((prof) => ({
        value: prof.Id,
        label: prof.ProfessorName,
      }));

      setProfessorsList((prev) => {
        const updated = [...prev];
        updated[index] = newOptions;
        return updated;
      });
    } catch (error) {
      console.error("Error fetching professors", error);
    }
  };

  const [safedate, setSafedate] = useState(dayjs());
  const [safedateerror, setSafedateerror] = useState("");

  const [transdate, setTransdate] = useState(dayjs());
  const [transerror, setTranserror] = useState("");

  const handleDateChange1 = (newValue) => {
    if (!newValue || !dayjs(newValue).isValid()) {
      setSafedateerror("Invalid date");
      setSafedate(null);
      return;
    }

    // const today = dayjs();
    // const minDate = today.subtract(3, "day");
    // const maxDate = today.add(2, "day");

    // if (newValue.isBefore(minDate) || newValue.isAfter(maxDate)) {
    //   setSafedateerror("You can select only 2 days before or after today");
    // } else {
    //   setSafedateerror("");
    // }
    setSafedateerror("");
    setSafedate(dayjs(newValue));
  };

  const handleDateChange2 = (newValue) => {
    if (!newValue || !dayjs(newValue).isValid()) {
      setTranserror("Invalid date");
      setTransdate(null);
      return;
    }

    // const today = dayjs();
    // const minDate = today.subtract(3, "day");
    // const maxDate = today.add(2, "day");

    // if (newValue.isBefore(minDate) || newValue.isAfter(maxDate)) {
    //   setTranserror("You can select only 2 days before or after today");
    // } else {
    //   setTranserror("");
    // }
    setTranserror("");
    setTransdate(dayjs(newValue));
  };

  const handleInputChange = (index, field, value) => {
    const updatedRows = [...rows];

    // Update the value of the current field
    updatedRows[index][field] = value;

    // Update the state with the new row data
    setRows(updatedRows);
  };

  // const handleInputChange = (index, field, value) => {
  //   setRows((prevRows) =>
  //     prevRows.map((row, i) => (i === index ? { ...row, [field]: value } : row))
  //   );
  // };

  const handleAddRow = () => {
    setRows([
      ...rows,
      {
        SerialNo: "",
        BookId: "",
        ProfessorId: "",
        ProfessorName: "",
        Proftext: "", // ← This is important!
        Copies: 0,
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

    const url = `https://publication.microtechsolutions.net.in/php/deletetable.php?Id=${deleteId}&Table=Canvassorheader`;

    const urlencoded = new URLSearchParams();
    urlencoded.append("Id", deleteId);
    urlencoded.append("Table", "Canvassorheader");

    const requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: urlencoded,
      redirect: "follow",
    };

    fetch(url, requestOptions)
      .then((response) => response.text())
      .then((result) => {
        console.log(result);
        toast.success("Convassor details Deleted Successfully");
        setIsDeleteDialogOpen(false);
        fetchCanvassorheaders();
      })
      .catch((error) => {
        console.error("Error:", error);
        toast.error("Failed to delete Convassor details");
      });
  };

  const cancelDelete = () => {
    setIsDeleteDialogOpen(false);
    setDeleteIndex(null);
  };

  const resetForm = () => {
    setrefno("");
    setSelectedBranch(null);
    setSpecimenreportNo("");
    // setDate("");
    setSafedate(dayjs());
    setSafedateerror("");
    setConvassorId(null);
    setCityId(null);
    // setTransactiondate(null);
    setTransdate(dayjs());
    setTranserror("");
    setCollegeId(null);
    setSelectedCollege(null);

    setRows([
      {
        SerialNo: "",
        BookId: "",
        ProfessorId: "",
        Copies: 0,
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

  const [professorCache, setProfessorCache] = useState({}); // 🔹 Cache for professor names

  const fetchProfessorName = async (professorId) => {
    if (professorCache[professorId]) {
      return professorCache[professorId];
    }

    try {
      const response = await fetch(
        `https://publication.microtechsolutions.net.in/php/get/getbycolm.php?Table=Professor&Colname=Id&Colvalue=${professorId}`,
      );
      const data = await response.json();

      const profOptions = data.map((prof) => ({
        value: prof.Id,
        label: prof.ProfessorName,
      }));
      setProfessors(profOptions);

      // const professorName = data?.[0]?.ProfessorName || 'Unknown';

      // setProfessorCache((prevCache) => ({
      //   ...prevCache,
      //   [professorId]: professorName,
      // }));

      // return professorName;
    } catch (error) {
      console.error(
        `Error fetching professor name for ID ${professorId}:`,
        error,
      );
      return "Unknown";
    }
  };

  const handleEdit = async () => {
    if (currentRow) {
      console.log("Editing item with ID:", currentRow.original.Id);
      setIdwiseData(currentRow.original.Id);
    }

    setIsLoading(true);

    const convassorheader = convassorheaders[currentRow.index];
    const convassordetail = convassordetails.filter(
      (detail) => detail.CanvassorheaderId === convassorheader.Id,
    );

    const convertDateForInput = (dateStr) => {
      if (typeof dateStr === "string" && dateStr.includes("-")) {
        const [year, month, day] = dateStr.split(" ")[0].split("-");
        return `${year}-${month}-${day}`;
      } else {
        console.error("Invalid date format:", dateStr);
        return "";
      }
    };

    // Set placeholders first
    const initialRows = convassordetail.map((detail) => ({
      CanvassorheaderId: detail.CanvassorheaderId,
      BookId: detail.BookId,
      ProfessorId: detail.ProfessorId,
      ProfessorName: "Fetching...", // Temporary placeholder
      Copies: detail.Copies,
      Id: detail.Id,
    }));

    setRows(initialRows);
    setEditingIndex(currentRow.index);
    setIsDrawerOpen(true);
    setIsEditing(true);
    setId(convassorheader.Id);
    handleMenuClose();

    // Fetch professor names and update rows dynamically
    const updatedRows = await Promise.all(
      initialRows.map(async (row) => {
        const professorName = await fetchProfessorName(row.ProfessorId);
        return { ...row, ProfessorName: professorName };
      }),
    );

    setRows(updatedRows);

    // Update form fields
    const date = dayjs(convassorheader.Date?.date);
    const transdate = dayjs(convassorheader.TransactionDate?.date);

    setrefno(convassorheader.RefNo);
    setSpecimenreportNo(convassorheader.Specimen_report_no);
    // setDate(date);
    setSafedate(date);
    setConvassorId(convassorheader.CanvassorId);
    setCityId(convassorheader.CityId);
    // setTransactiondate(transdate);
    setTransdate(transdate);
    setCollegeId(convassorheader.CollegeId);

    console.log(convassorheader, "convassor header");
    console.log(convassordetails, "convassor detail");

    setIsLoading(false);
  };

  const bookCodeTimer = useRef(null);

  const handleBookCodeChange = (rowIndex, value) => {
    const updatedRows = [...rows];
    updatedRows[rowIndex].BookCode = value;
    setRows(updatedRows);

    // 🔴 Clear previous timer
    if (bookCodeTimer.current) {
      clearTimeout(bookCodeTimer.current);
    }

    // if book code is blank → reset row fields
    if (value.trim() === "") {
      updatedRows[rowIndex].BookName = "";
      updatedRows[rowIndex].BookNameMarathi = "";
      updatedRows[rowIndex].Price = "";
      updatedRows[rowIndex].BookRate = "";
      updatedRows[rowIndex].BookId = "";
      updatedRows[rowIndex].Copies = "";
      updatedRows[rowIndex].Amount = "";
      updatedRows[rowIndex].Discount = "";
      updatedRows[rowIndex].FinalAmount = "";

      setRows(updatedRows);
      return; // stop here
    }

    // 🟡 Wait until user finishes typing (500ms)
    bookCodeTimer.current = setTimeout(() => {
      // 🔒 Minimum length check (VERY IMPORTANT)
      if (value.length < 2) return;

      // Fetch data
      fetchBookDataForRow(rowIndex, value);
    }, 400);
  };

  const fetchBookDataForRow = async (rowIndex, bookCode) => {
    if (!bookCode) return; // guard clause

    try {
      const response = await fetch(
        `https://publication.microtechsolutions.net.in/php/Bookcodeget.php?BookCode=${bookCode}`,
      );
      const data = await response.json();

      if (Array.isArray(data) && data.length > 0) {
        const book = data[0];

        setRows((prevRows) => {
          const updatedRows = [...prevRows];
          updatedRows[rowIndex] = {
            ...updatedRows[rowIndex],
            BookName: book.BookName || book.BookNameMarathi || "",
            Price: book.BookRate || 0,
            BookId: book.Id || "", // This is important
          };
          return updatedRows;
        });
      } else {
        // ❌ Now this WILL fire correctly
        toast.error("Invalid Book Code");
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to fetch Book");
    }
  };
  const [specimenType, setSpecimenType] = useState(""); // "Other" | "Normal"
  const [specimenNumber, setSpecimenNumber] = useState(""); // only numeric part

  const branchPrefixMap = {
    Science: "S",
    Commerce: "C",
    Arts: "A",
    Other: "O",
  };

  const validateForm = () => {
    let formErrors = {};
    let isValid = true;

    setErrors(formErrors);
    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    if (
      !safedate ||
      !dayjs(safedate).isValid() ||
      safedateerror ||
      !transdate ||
      !dayjs(transdate).isValid() ||
      transerror
    ) {
      toast.error("Please correct all the date fields before submitting.");
      return;
    }

    const formattedDate = dayjs(safedate).format("YYYY-MM-DD");
    const formattedTransactionDate = dayjs(transdate).format("YYYY-MM-DD");

    const convassorHeaderdata = {
      Id: isEditing ? id : "", // Include the Id for updating, null for new records
      RefNo: RefNo,
      Option: selectedBranch || "", // Convert branch name to corresponding number
      Specimen_report_no: Specimen_report_no,
      Date: formattedDate,
      CanvassorId: CanvassorId,
      CityId: CityId,
      TransactionDate: formattedTransactionDate,
      CollegeId: CollegeId,
      CreatedBy: !isEditing ? userId : undefined,
      UpdatedBy: isEditing ? userId : undefined,
    };

    try {
      const convassorheaderurl = isEditing
        ? "https://publication.microtechsolutions.net.in/php/update/canvassorheader.php"
        : "https://publication.microtechsolutions.net.in/php/post/canvassorheader.php";

      // Submit purchase header data
      const response = await axios.post(
        convassorheaderurl,
        qs.stringify(convassorHeaderdata),
        {
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
        },
      );

      // const purchasereturnId = isEditing ? id : parseInt(response.data.newId, 10);
      const convassorheaderId = isEditing ? id : parseInt(response.data.Id, 10);

      for (const row of rows) {
        const rowData = {
          CanvassorheaderId: convassorheaderId,
          SerialNo: rows.indexOf(row) + 1,
          BookId: row.BookId,
          ProfessorId: row.ProfessorId,
          Copies: row.Copies,

          Id: row.Id,
          CreatedBy: row.Id ? undefined : userId,
          UpdatedBy: row.Id ? userId : undefined,
        };

        const convassordetailurl =
          isEditing && row.Id
            ? "https://publication.microtechsolutions.net.in/php/update/canvassordetail.php"
            : "https://publication.microtechsolutions.net.in/php/post/canvassordetail.php";

        await axios.post(convassordetailurl, qs.stringify(rowData), {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
        });
      }

      fetchCanvassorheaders();
      fetchConvassordetails();
      setIsDrawerOpen(false);
      toast.success(
        isEditing
          ? "Canvassor header & Canvassor Details updated successfully!"
          : "Canvassor header & Canvassor Details added successfully!",
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
      {
        accessorKey: "RefNo",
        header: "Ref No",
        size: 50,
      },

      {
        accessorKey: "Date.date",
        header: "Date",
        size: 50,
        Cell: ({ row }) =>
          row.original.Date ? row.original.Date.date.substring(0, 10) : "",
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
    [convassorheaders],
  );

  const table = useMaterialReactTable({
    columns,
    data: convassorheaders,
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
    <div className="convassordetails-container">
      <h1>Canvassor Details</h1>

      <div className="convassordetailstable-master">
        <div className="convassordetailstable1-master">
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
          <div className="convassordetailstable-container">
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
              width: isSmallScreen ? "100%" : "87%",

              zIndex: 1000,
              paddingLeft: "16px",
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
                  ? "Edit Canvassor Details"
                  : "Create Canvassor Details"}
              </b>
            </Typography>{" "}
            <CloseIcon sx={{ cursor: "pointer" }} onClick={handleDrawerClose} />
          </Box>
          <form className="convassordetails-form">
            <div>
              <label className="convassordetails-label">Our Ref No</label>
              <div>
                <input
                  type="text"
                  id="RefNo"
                  name="RefNo"
                  value={RefNo}
                  onChange={(e) => setrefno(e.target.value)}
                  style={{ background: "#f5f5f5", width: "100px" }}
                  className="convassordetails-control"
                  placeholder="Auto-Incremented"
                  readOnly
                />
              </div>
            </div>
            <div>
              <label className="convassordetails-label">Branch</label>

              <div>
                <input
                  type="radio"
                  name="branch"
                  value="Other"
                  style={{ paddingLeft: "20px", marginTop: "15px" }}
                  checked
                  readOnly
                />
                Other
              </div>
            </div>

            <div>
              <label className="convassordetails-label">
                Specimen Report No :
              </label>

              <div
                style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                {/* Prefix box – always O */}
                <input
                  type="text"
                  value="O"
                  readOnly
                  className="convassordetails-control"
                  style={{
                    width: "25px",
                    textAlign: "center",
                    background: "#f5f5f5",
                    fontWeight: "bold",
                    cursor: "not-allowed",
                  }}
                />

                {/* Number box */}
                <input
                  type="text"
                  value={specimenNumber}
                  onChange={handleSpecimenChange}
                  placeholder="Specimen Report No"
                  style={{ width: "150px" }}
                  className="convassordetails-control"
                />
              </div>
            </div>

            <div>
              <label className="convassordetails-label">Date :</label>
              <div>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DatePicker
                    value={safedate}
                    onChange={handleDateChange1}
                    format="DD-MM-YYYY"
                    slotProps={{
                      textField: {
                        size: "small",
                        fullWidth: true,
                        error: !!safedateerror,
                        helperText: safedateerror,
                      },
                    }}
                    sx={{
                      marginTop: "10px",
                      marginBottom: "5px",
                      width: "180px",
                    }}
                  />
                </LocalizationProvider>
              </div>
            </div>

            <div>
              <label className="convassordetails-label">Canvassor Name :</label>
              <div>
                <Autocomplete
                  options={convassors}
                  value={
                    convassors.find((option) => option.value === CanvassorId) ||
                    null
                  }
                  // onChange={(event, newValue) =>
                  //   setConvassorId(newValue ? newValue.value : null)
                  // }

                  onChange={(event, newValue) => {
                    const canvassorId = newValue ? newValue.value : null;
                    setConvassorId(canvassorId);

                    if (canvassorId) {
                      fetchCitiesByCanvassor(canvassorId);
                    } else {
                      setFilteredCities([]);
                    }
                  }}
                  getOptionLabel={(option) => option.label} // Display only label in dropdown
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      placeholder="Select Canv id"
                      size="small"
                      margin="none"
                      fullWidth
                    />
                  )}
                  sx={{ mt: 1.25, mb: 0.625, width: 320 }}
                />
              </div>
            </div>

            <div>
              <label className="convassordetails-label">
                {" "}
                City Of College :
              </label>
              <div>
                <Autocomplete
                  options={filteredCities}
                  value={filteredCities.find((c) => c.value === CityId) || null}
                  onChange={(event, newValue) => {
                    const cityId = newValue ? newValue.value : null;
                    setCityId(cityId);

                    // 🔥 IMPORTANT
                    setSelectedCollege(null);
                    setCollegeId(null);
                    setColleges([]);

                    if (cityId) {
                      fetchCollegesByCity(cityId);
                    }
                  }}
                  getOptionLabel={(option) => option.label}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      placeholder="Select City"
                      size="small"
                    />
                  )}
                  sx={{ mt: 1.25, mb: 0.625, width: 250 }} // Equivalent to 10px and 5px
                  disabled={!CanvassorId}
                />
              </div>
            </div>

            <div>
              <label className="convassordetails-label">College Name :</label>
              <div>
                <Autocomplete
                  options={colleges}
                  value={selectedCollege}
                  onChange={(e, newValue) => {
                    setSelectedCollege(newValue || null);
                    setCollegeId(newValue ? Number(newValue.value) : null);

                    // reset professor on college change
                    setRows((prev) =>
                      prev.map((row) => ({
                        ...row,
                        ProfessorId: "",
                        ProfessorName: "",
                      })),
                    );
                  }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      size="small"
                      placeholder="Select College"
                    />
                  )}
                  sx={{ mt: 1.25, mb: 0.625, width: 250 }} // Equivalent to 10px and 5px
                  disabled={!CityId}
                />
              </div>
            </div>
          </form>
          <form className="convassordetails-form">
            <div>
              <label className="convassordetails-label">
                Transaction Date :
              </label>
              <div>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DatePicker
                    value={transdate}
                    onChange={handleDateChange2}
                    format="DD-MM-YYYY"
                    slotProps={{
                      textField: {
                        size: "small",
                        fullWidth: true,
                        error: !!transerror,
                        helperText: transerror,
                      },
                    }}
                    sx={{
                      marginTop: "10px",
                      marginBottom: "5px",
                      width: "165px",
                    }}
                  />
                </LocalizationProvider>
              </div>
            </div>
          </form>

          <div className="convassordetails-table">
            <table>
              <thead>
                <tr>
                  <th>Sr No</th>
                  <th>Book Code</th>
                  <th>Book Name</th>
                  <th>Name of Professor</th>
                  <th>Copies</th>

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
                          type="text"
                          value={row.BookCode || ""}
                          onChange={(e) =>
                            handleBookCodeChange(index, e.target.value)
                          }
                          placeholder="Enter Book Code"
                          style={{ width: "80px" }}
                          className="convassordetails-control"
                        />
                      </td>
                      <td>
                        <input
                          type="text"
                          value={row.BookName || row.BookNameMarathi || ""}
                          readOnly
                          placeholder="Book Name / Book Name Marathi"
                          style={{ width: "380px" }}
                          className="convassordetails-control"
                        />
                      </td>
                      <td style={{ minWidth: 320 }}>
                        {collegeProfessors.length <= 1 ? (
                          <TextField
                            value={row.ProfessorName}
                            size="large"
                            fullWidth
                            InputProps={{ readOnly: true }}
                          />
                        ) : (
                          <Autocomplete
                            options={collegeProfessors}
                            sx={{ width: 320 }} // 👈 KEY LINE
                            value={
                              collegeProfessors.find(
                                (p) =>
                                  Number(p.value) === Number(row.ProfessorId),
                              ) || null
                            }
                            isOptionEqualToValue={(o, v) =>
                              Number(o.value) === Number(v.value)
                            }
                            onChange={(e, newValue) => {
                              handleInputChange(
                                index,
                                "ProfessorId",
                                newValue ? Number(newValue.value) : "",
                              );
                              handleInputChange(
                                index,
                                "ProfessorName",
                                newValue?.label || "",
                              );
                            }}
                            getOptionLabel={(option) => option.label || ""}
                            renderInput={(params) => (
                              <TextField
                                {...params}
                                placeholder="Select Professor"
                                size="large"
                                fullWidth
                              />
                            )}
                            disabled={!CollegeId}
                          />
                        )}
                      </td>

                      <td>
                        <input
                          type="number"
                          value={row.Copies}
                          onChange={(e) =>
                            handleInputChange(index, "Copies", e.target.value)
                          }
                          style={{
                            width: "65px",
                          }}
                          className="convassordetails-control"
                          placeholder="Copies"
                        />
                      </td>

                      <td>
                        <div style={{ display: "flex" }}>
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

          <div style={{ display: "flex", justifyContent: "space-around" }}>
            <div
              style={{
                display: "flex",
                justifyContent: "flex-start",
                marginTop: "12px",
              }}>
              <Button
                variant="contained"
                style={{
                  background: "#113d6bff",
                  color: "white",
                  fontWeight: "600",
                }}
                onClick={handleProfessorDetailsopen}>
                + New Professor Details
              </Button>
            </div>

            <div
              style={{
                display: "flex",
                justifyContent: "flex-end",
                marginTop: "10px",
                fontWeight: "bold",
                fontSize: "15px",
              }}>
              No of Copies :&nbsp;
              <span style={{ color: "#0a60bd" }}>{totalCopies}</span>
            </div>
          </div>

          {selectedCollege && (
            <div
              style={{
                marginTop: "12px",
                padding: "10px 14px",
                backgroundColor: "#376ec0ff",
                color: "#fff",
                fontSize: "14px",
                fontWeight: "500",
                borderRadius: "4px",
                maxWidth: "50%",
                lineHeight: "1.6",
              }}>
              {selectedCollege.label},
              <br />
              Address: {selectedCollege.address1},{" "}
              {getAreaName(selectedCollege.areaId)} – ,
              {getCityName(selectedCollege.cityId)} ,– Pincode: :
              {selectedCollege.pincode}, Telephone: {selectedCollege.MobileNo}
            </div>
          )}

          <div className="convassordetails-btn-container">
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

          {/* </div> */}
        </Drawer>

        {/* Confirmation Dialog for Delete */}
        <Dialog open={isDeleteDialogOpen} onClose={cancelDelete}>
          <DialogTitle style={{ color: "navy", fontWeight: "600" }}>
            Confirm Deletion
          </DialogTitle>
          <DialogContent>
            Are you sure you want to delete this{" "}
            <b style={{ color: "red" }}>
              <u>Canvassor details</u>
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
export default Convassordetails;
