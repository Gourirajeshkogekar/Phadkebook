import React, {
  useState,
  useMemo,
  useEffect,
  useSyncExternalStore,
} from "react";
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
  const [selectedBranch, setSelectedbranch] = useState("");

  const [Date, setDate] = useState("");
  const [CanvassorId, setConvassorId] = useState("");
  const [CityId, setCityId] = useState("");
  const [TransactionDate, setTransactiondate] = useState("");
  const [CollegeId, setCollegeId] = useState("");
  const [colleges, setColleges] = useState([]);
  const [cities, setCities] = useState([]);
  const [convassors, setConvassors] = useState([]);
  const [bookOptions, setBookOptions] = useState([]);
  const [bookCodes, setBookcodes] = useState([]);
  const [professors, setProfessors] = useState([]);
  const [ProfessorId, setProfessorId] = useState("");
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

  const branchMapping = {
    Arts: 1,
    Commerce: 2,
    Science: 3,
    Other: 4,
  };

  const handleBranchChange = (branchName) => {
    setSelectedbranch(branchName);
    const branchValue = branchMapping[branchName]; // Get corresponding integer
    console.log("Selected Branch Value:", branchValue); // Send this to backend
  };

  const [rows, setRows] = useState([
    {
      SerialNo: "",
      BookId: "",
      ProfessorId: "",
      Copies: 0,
    },
  ]);

  useEffect(() => {
    fetchConvassors();
    fetchConvassordetails();
    fetchCities();
    fetchColleges();
    fetchBookNames();
  }, []);

  useEffect(() => {
    fetchCanvassorheaders();
    console.log("this function is called");
  }, [pageIndex]);

  const fetchCanvassorheaders = async () => {
    try {
      const response = await axios.get(
        `https://publication.microtechsolutions.net.in/php/get/gettblpage.php?Table=Canvassorheader&PageNo=${pageIndex}`
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
        "https://publication.microtechsolutions.net.in/php/get/gettable.php?Table=Canvassordetail"
      );
      console.log(response.data, "response of convassor details");
      setConvassordetails(response.data);
    } catch (error) {
      // toast.error("Error fetching sells challan details:", error);
      console.error("Error fetching convassor details:", error);
    }
  };

  const fetchConvassors = async () => {
    try {
      const response = await axios.get(
        "https://publication.microtechsolutions.net.in/php/AssignCanvassorget.php"
      );
      const convassorOptions = response.data.map((conv) => ({
        value: conv.Id,
        label: conv.CanvassorName,
      }));
      setConvassors(convassorOptions);
    } catch (error) {
      // toast.error("Error fetching convassors:", error);
    }
  };

  // useEffect(() => {
  //   if (Proftext.trim() === "") return; // Avoid empty calls
  //   const delayDebounce = setTimeout(() => {
  //     fetchProfessors();
  //   }, 500); // Debounce API call

  //   return () => clearTimeout(delayDebounce);
  // }, [Proftext]); // Fetch when Proftext changes

  // const fetchProfessors = async () => {
  //   if (Proftext.trim() === "") return; // Don't fetch if input is empty

  //   try {
  //     const response = await axios.get(
  //       `https://publication.microtechsolutions.net.in/php/get/search.php?Table=Professor&Colname=ProfessorName&Text=${Proftext}`
  //     );
  //     const profData = response.data;

  //     const profOptions = profData.map((prof) => ({
  //       value: prof.Id,
  //       label: prof.ProfessorName,
  //     }));
  //     setProfessors(profOptions);
  //   } catch (error) {
  //     // toast.error("Error fetching profs:", error);
  //   }
  // };

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
        `https://publication.microtechsolutions.net.in/php/get/search.php?Table=Professor&Colname=ProfessorName&Text=${text}`
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

  // const fetchProfessors = async (text) => {
  //   if (!text?.trim()) return;

  //   try {
  //     const response = await axios.get(
  //       `https://publication.microtechsolutions.net.in/php/get/search.php?Table=Professor&Colname=ProfessorName&Text=${text}`
  //     );
  //     const profData = response.data;

  //     const profOptions = profData.map((prof) => ({
  //       value: prof.Id,
  //       label: prof.ProfessorName,
  //     }));

  //     setProfessors(profOptions);
  //     console.log(professors, "professors");
  //   } catch (error) {
  //     // toast.error("Error fetching profs:", error);
  //   }
  // };

  const fetchCities = async () => {
    try {
      const response = await axios.get(
        "https://publication.microtechsolutions.net.in/php/Cityget.php"
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

  const fetchColleges = async () => {
    try {
      const response = await axios.get(
        "https://publication.microtechsolutions.net.in/php/Collegeget.php"
      );
      const colOptions = response.data.map((col) => ({
        value: col.Id,
        label: col.CollegeName,
      }));
      setColleges(colOptions);
    } catch (error) {
      // toast.error("Error fetching colleges:", error);
    }
  };

  const fetchBookNames = async () => {
    try {
      const response = await axios.get(
        "https://publication.microtechsolutions.net.in/php/Bookget.php"
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
                `https://publication.microtechsolutions.net.in/php/get/search.php?Table=Professor&Colname=Id&Text=${row.ProfessorId}`
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
        })
      );
      setProfessorsList(updatedList);
    };

    loadInitialProfessors();
  }, [rows]);

  const handleSearchChange = async (text, index) => {
    setRows((prevRows) =>
      prevRows.map((r, i) => (i === index ? { ...r, Proftext: text } : r))
    );

    try {
      const response = await axios.get(
        `https://publication.microtechsolutions.net.in/php/get/search.php?Table=Professor&Colname=ProfessorName&Text=${text}`
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
    setSelectedbranch(null);
    setSpecimenreportNo("");
    setDate("");
    setConvassorId(null);
    setCityId(null);
    setTransactiondate(null);
    setCollegeId(null);
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
        `https://publication.microtechsolutions.net.in/php/get/getbycolm.php?Table=Professor&Colname=Id&Colvalue=${professorId}`
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
        error
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
      (detail) => detail.CanvassorheaderId === convassorheader.Id
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
      })
    );

    setRows(updatedRows);

    // Update form fields
    const date = convertDateForInput(convassorheader.Date?.date);
    const transdate = convertDateForInput(
      convassorheader.TransactionDate?.date
    );
    const selectedBranchName = Object.keys(branchMapping).find(
      (key) => branchMapping[key] === convassorheader.Option
    );

    setSelectedbranch(selectedBranchName || "");
    setrefno(convassorheader.RefNo);
    setSpecimenreportNo(convassorheader.Specimen_report_no);
    setDate(date);
    setConvassorId(convassorheader.CanvassorId);
    setCityId(convassorheader.CityId);
    setTransactiondate(transdate);
    setCollegeId(convassorheader.CollegeId);

    console.log(convassorheader, "convassor header");
    console.log(convassordetails, "convassor detail");

    setIsLoading(false);
  };

  // const fetchProfessorName = async (professorId, index) => {
  //   if (professorCache[professorId]) {
  //     return professorCache[professorId]; // ✅ Return from cache if available
  //   }

  //   try {
  //     const response = await fetch(
  //       `https://publication.microtechsolutions.net.in/php/get/getbycolm.php?Table=Professor&Colname=Id&Colvalue=${professorId}`
  //     );
  //     const data = await response.json();
  //     const professorName = data?.[0]?.ProfessorName || 'Unknown';

  //     setProfessorCache((prevCache) => ({
  //       ...prevCache,
  //       [professorId]: professorName, // 🔹 Store in cache for future use
  //     }));

  //     // ✅ Update `rows` state dynamically
  //   setRows((prevRows) =>
  //     prevRows.map((row, i) =>
  //       i === index ? { ...row, ProfessorName: professorName } : row
  //     )
  //   );

  //     return professorName;
  //   } catch (error) {
  //     console.error(`Error fetching professor name for ID ${professorId}:`, error);
  //     return 'Unknown';
  //   }
  // };

  // const handleEdit = async () => {
  //   if (currentRow) {
  //     console.log("Editing item with ID:", currentRow.original.Id);
  //     setIdwiseData(currentRow.original.Id);
  //   }

  //   setIsLoading(true);

  //   console.log(currentRow, 'row');
  //   const convassorheader = convassorheaders[currentRow.index];

  //   const convassordetail = convassordetails.filter(
  //     (detail) => detail.CanvassorheaderId === convassorheader.Id
  //   );

  //   const convertDateForInput = (dateStr) => {
  //     if (typeof dateStr === 'string' && dateStr.includes('-')) {
  //       const [year, month, day] = dateStr.split(' ')[0].split('-');
  //       return `${year}-${month}-${day}`;
  //     } else {
  //       console.error('Invalid date format:', dateStr);
  //       return '';
  //     }
  //   };

  //   // 🔹 Set initial rows with ProfessorId (placeholder)
  //   const initialRows = convassordetail.map((detail) => ({
  //     CanvassorheaderId: detail.CanvassorheaderId,
  //     BookId: detail.BookId,
  //     ProfessorId: detail.ProfessorId,
  //     ProfessorName: professorCache[detail.ProfessorId] || `Fetching...`, // 🔹 Show ID initially
  //     Copies: detail.Copies,
  //     Id: detail.Id,
  //   }));

  //   setRows(initialRows); // ✅ Instantly update UI with placeholders

  //   // ✅ Open the drawer immediately
  //   setEditingIndex(currentRow.index);
  //   setIsDrawerOpen(true);
  //   setIsEditing(true);
  //   setId(convassorheader.Id);

  //   handleMenuClose();

  //   // ✅ Fetch professor names in the background (lazy loading)
  //   const updatedRows = await Promise.all(
  //     initialRows.map(async (row) => ({
  //       ...row,
  //       ProfessorName: await fetchProfessorName(row.ProfessorId), // ✅ Fetch dynamically
  //     }))
  //   );

  //   setRows(updatedRows); // ✅ Update names once fetched

  //   // ✅ Update form fields
  //   const date = convertDateForInput(convassorheader.Date?.date);
  //   const transdate = convertDateForInput(convassorheader.TransactionDate?.date);

  //   const selectedBranchName = Object.keys(branchMapping).find(
  //     (key) => branchMapping[key] === convassorheader.Option
  //   );
  //   setSelectedbranch(selectedBranchName || '');
  //   setrefno(convassorheader.RefNo);
  //   setSpecimenreportNo(convassorheader.Specimen_report_no);
  //   setDate(date);
  //   setConvassorId(convassorheader.CanvassorId);
  //   setCityId(convassorheader.CityId);
  //   setTransactiondate(transdate);
  //   setCollegeId(convassorheader.CollegeId);

  //   console.log(convassorheader, 'convassor header');
  //   console.log(convassordetails, 'convassor detail');

  //   // ✅ Finish loading
  //   fetchConvassordetails().then(() => {
  //     setIsLoading(false);
  //   });
  // };

  const validateForm = () => {
    let formErrors = {};
    let isValid = true;

    setErrors(formErrors);
    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    const formattedDate = moment(Date).format("YYYY-MM-DD");
    const formattedTransactionDate =
      moment(TransactionDate).format("YYYY-MM-DD");

    const convassorHeaderdata = {
      Id: isEditing ? id : "", // Include the Id for updating, null for new records
      RefNo: RefNo,
      Option: branchMapping[selectedBranch] || "", // Convert branch name to corresponding number
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
        }
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
          ? "Convassor header & Convassor Details updated successfully!"
          : "Convassor header & Convassor Details added successfully!"
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
    [convassorheaders]
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
              width: isSmallScreen ? "100%" : "70%",

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
              <label className="convassordetails-label">
                Ref No <b className="required">*</b>
              </label>
              <div>
                <input
                  type="text"
                  id="RefNo"
                  name="RefNo"
                  value={RefNo}
                  onChange={(e) => setrefno(e.target.value)}
                  style={{ background: "#f5f5f5" }}
                  className="convassordetails-control"
                  placeholder="Auto-Incremented"
                  readOnly
                />
              </div>
            </div>

            <div>
              <label className="convassordetails-label">
                Specimen Report No<b className="required">*</b>:
              </label>
              <div>
                <input
                  type="text"
                  id="Specimen_report_no"
                  name="Specimen_report_no"
                  value={Specimen_report_no}
                  onChange={(e) => setSpecimenreportNo(e.target.value)}
                  className="convassordetails-control"
                  placeholder="Enter Speciment Report No"
                />
              </div>

              {/* <div>
                          {errors.SpecimenReportno && <b className="error-text">{errors.SpecimenReportno}</b>}
                        </div> */}
            </div>

            <div>
              <label className="convassordetails-label">
                Date<b className="required">*</b>:
              </label>
              <div>
                <input
                  type="date"
                  id="Date"
                  name="Date"
                  value={Date}
                  onChange={(e) => setDate(e.target.value)}
                  className="convassordetails-control"
                  placeholder="Enter Date"
                />
              </div>

              {/* <div>
                          {errors.Date && <b className="error-text">{errors.Date}</b>}
                        </div> */}
            </div>

            <div>
              <label className="convassordetails-label">
                Canvassor Name<b className="required">*</b>:
              </label>
              <div>
                <Autocomplete
                  options={convassors}
                  value={
                    convassors.find((option) => option.value === CanvassorId) ||
                    null
                  }
                  onChange={(event, newValue) =>
                    setConvassorId(newValue ? newValue.value : null)
                  }
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
                  sx={{ mt: 1.25, mb: 0.625, width: 170 }} // Equivalent to 10px and 5px
                />
              </div>
              {/* <div>
                          {errors.ConvassorId && <b className="error-text">{errors.ConvassorId}</b>}
                        </div> */}
            </div>

            <div>
              <label className="convassordetails-label">
                {" "}
                City Of College<b className="required">*</b>:
              </label>
              <div>
                <Autocomplete
                  options={cities}
                  value={
                    cities.find((option) => option.value === CityId) || null
                  }
                  onChange={(event, newValue) =>
                    setCityId(newValue ? newValue.value : null)
                  }
                  getOptionLabel={(option) => option.label} // Display only label in dropdown
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      placeholder="Select City id"
                      size="small"
                      margin="none"
                      fullWidth
                    />
                  )}
                  sx={{ mt: 1.25, mb: 0.625, width: 170 }} // Equivalent to 10px and 5px
                />
              </div>
              {/* <div>
                          {errors.CityId && <b className="error-text">{errors.CityId}</b>}
                        </div> */}
            </div>

            <div>
              <label className="convassordetails-label">
                Transaction Date<b className="required">*</b>:
              </label>
              <div>
                <input
                  type="date"
                  id="TransactionDate"
                  name="TransactionDate"
                  value={TransactionDate}
                  onChange={(e) => setTransactiondate(e.target.value)}
                  className="convassordetails-control"
                  placeholder="Enter Transaction date"
                />
              </div>

              {/* <div>
                          {errors.TransactionDate && <b className="error-text">{errors.TransactionDate}</b>}
                        </div> */}
            </div>

            <div>
              <label className="convassordetails-label">
                College Name<b className="required">*</b>:
              </label>
              <div>
                <Autocomplete
                  options={colleges}
                  value={
                    colleges.find((option) => option.value === CollegeId) ||
                    null
                  }
                  onChange={(event, newValue) =>
                    setCollegeId(newValue ? newValue.value : null)
                  }
                  getOptionLabel={(option) => option.label} // Display only label in dropdown
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      placeholder="Select Coll id"
                      size="small"
                      margin="none"
                      fullWidth
                    />
                  )}
                  sx={{ mt: 1.25, mb: 0.625, width: 170 }} // Equivalent to 10px and 5px
                />
              </div>
              {/* <div>
                          {errors.CollegeName && <b className="error-text">{errors.CollegeName}</b>}
                        </div> */}
            </div>

            <div>
              <label className="convassordetails-label">Branch</label>
              {Object.keys(branchMapping).map((branch) => (
                <div key={branch}>
                  <label>
                    <input
                      type="radio"
                      name="Branch"
                      value={branch}
                      checked={selectedBranch === branch} // ✅ This now works correctly
                      onChange={() => handleBranchChange(branch)}
                      style={{ marginBottom: "10px" }}
                    />
                    {branch}
                  </label>
                </div>
              ))}
            </div>
          </form>

          <div className="convassordetails-table">
            <table>
              <thead>
                <tr>
                  <th>Serial No</th>
                  <th>
                    Book Code<b className="required">*</b>
                  </th>
                  <th>
                    Book Name<b className="required">*</b>
                  </th>
                  <th>
                    Name of Professor<b className="required">*</b>
                  </th>
                  <th>
                    Copies<b className="required">*</b>
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
                          sx={{ width: "200px" }} // Set width
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
                                  width: "200px", // Adjust height here
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
                        {/* <Select
                          inputValue={row.Proftext || ""}
                          onInputChange={(inputValue) =>
                            handleInputChange(index, "Proftext", inputValue)
                          }
                          value={
                            professorsList[index]?.find(
                              (opt) => opt.value === row.ProfessorId
                            ) || null
                          }
                          onChange={(selectedOption) => {
                            handleInputChange(
                              index,
                              "ProfessorId",
                              selectedOption?.value || ""
                            );
                            handleInputChange(
                              index,
                              "ProfessorName",
                              selectedOption?.label || ""
                            );
                            handleInputChange(index, "Proftext", ""); // Clear after selection
                          }}
                          options={professorsList[index] || []}
                          placeholder="Type to search professor..."
                          isClearable
                          styles={{
                            width: "200px",
                          }}
                        /> */}
                        <Select
                          inputValue={row.Proftext || ""}
                          options={professorsList[index] || []}
                          value={
                            professorsList[index]?.find(
                              (option) => option.value === row.ProfessorId
                            ) || null
                          }
                          onChange={(selectedOption) => {
                            handleInputChange(
                              index,
                              "ProfessorId",
                              selectedOption?.value || ""
                            );
                            handleInputChange(
                              index,
                              "ProfessorName",
                              selectedOption?.label || ""
                            );
                            handleInputChange(index, "Proftext", "");
                          }}
                          onInputChange={(inputValue) =>
                            handleSearchChange(inputValue, index)
                          }
                          placeholder="Type to search professor..."
                        />
                      </td>

                      <td>
                        <input
                          type="text"
                          value={row.Copies}
                          onChange={(e) =>
                            handleInputChange(index, "Copies", e.target.value)
                          }
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
              <u>Convassor details</u>
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
