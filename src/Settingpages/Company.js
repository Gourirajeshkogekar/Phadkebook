import React, { useState, useMemo, useEffect } from "react";
import "./Company.css";

import Select from "react-select";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import {
  MaterialReactTable,
  useMaterialReactTable,
} from "material-react-table";
import { RiDeleteBin5Line } from "react-icons/ri";
import {
    Dialog, DialogActions, DialogContent, DialogTitle,Button,Modal,
  Tabs, Tab, Box, TextField, Checkbox, FormControlLabel, Grid, Typography, Paper, Divider
} from "@mui/material";


function Company() {
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

    fetchCompanies();
  }, []);
// Custom blue for the legacy input style
const legacyBlue = "#99d9ea";
const legacyYellow = "#ffff00"; 


  const [CompanyName, setCompanyName] = useState("");
  const [Director, setDirector] = useState("");
  const [Designation, setDesignation] = useState("");
  const [Address1, setAddress1] = useState("");
  const [AreaId, setAreaId] = useState("");
  const [CityId, setCityId] = useState("");
  const [StateId, setStateId] = useState("");
  const [CountryId, setCountryId] = useState("");
  const [cityOptions, setCityOptions] = useState([]);
  const [stateOptions, setStateOptions] = useState([]);
  const [countryOptions, setCountryOptions] = useState([]);
  const [Pincode, setPincode] = useState("");
  const [Website, setWebsite] = useState("");
  const [FaxNo, setFaxNo] = useState("");
  const [MobileNo, setMobileNo] = useState("");
  const [EmailId, setEmailId] = useState("");
  const [companies, setCompanies] = useState([]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [id, setId] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [editingIndex, setEditingIndex] = useState(-1);
  const [errors, setErrors] = useState("");

  const [tinpanno, setTinpanno] = useState("");
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [deleteIndex, setDeleteIndex] = useState(null);
  const [deleteId, setDeleteId] = useState(null);


  const [activeTab, setActiveTab] = useState(0);
 
  
  const [City, setCity] = useState("");
  const [Pin, setPin] = useState("");
  const [State, setState] = useState("");
  const [Country, setCountry] = useState("India");
  const [TelNo, setTelNo] = useState("");
   const [Email, setEmail] = useState("");
  const [WebSite, setWebSite] = useState("");

  // Tab 2: TIN/PAN
  const [tinNo, setTinNo] = useState("");
  const [cstTin, setCstTin] = useState("");
  const [serviceTaxNo, setServiceTaxNo] = useState("");
  const [panNo, setPanNo] = useState("");
  const [tanNo, setTanNo] = useState("");
  const [lbtNo, setLbtNo] = useState("");
  const [q1, setQ1] = useState("");
  const [q2, setQ2] = useState("");
  const [q3, setQ3] = useState("");
  const [q4, setQ4] = useState("");

  // Tab 3: Other Settings
  const [settings, setSettings] = useState({
    isBranch: false,
    genReceiptAuto: false,
    genInvoiceAuto: false,
    genInvoiceNoChallan: false,
    printReceiptSave: false,
    printInvoiceAdd: false,
    printInvoiceEdit: false,
    selectRateFromMaster: false,
    defaultInvoice: "Credit"
  });
  const [tdsRate, setTdsRate] = useState(10);
  const [surcharge, setSurcharge] = useState(0);
  const [eduCess, setEduCess] = useState(3);
  const [tdsDedAmt, setTdsDedAmt] = useState(5000);
  const [yearFrom, setYearFrom] = useState("2025-04-01");
  const [yearTo, setYearTo] = useState("2026-03-31");

  const inputSx = {
    backgroundColor: legacyBlue,
    "& .MuiInputBase-input": { padding: "4px 8px", fontSize: "0.85rem" },
    "& fieldset": { borderRadius: 0 }
  };

  const labelSx = { fontWeight: "bold", fontSize: "0.85rem", display: "flex", alignItems: "center" };


const legacyBox = {
  border: "1px solid #9e9e9e",
  width: 520,
  p: 1.2,   // 🔽 reduced
  mt: 0.5,
  ml: 2,
};


const legendSx = {
  fontSize: "0.8rem",
  fontWeight: "bold",
  px: 0.5,
};

const legacyInput = {
  backgroundColor: "#8fd7f0",
  "& .MuiInputBase-input": {
    fontSize: "0.8rem",
    padding: "4px 6px",
  },
};
const handleSettingChange = (key) => {
  setSettings((prev) => ({
    ...prev,
    [key]: !prev[key],
  }));
};

  const handleTabChange = (event, newValue) => setActiveTab(newValue);

  const resetForm = () => {
    setCompanyName("");
    setDirector("");
    setDesignation("");
    setAddress1("");
    setCity(""); setState(""); setPin("");

      setCountry("");
      setMobileNo("");
setWebSite("")   ;
 setTelNo("");
    setEmail("");
    setFaxNo("");
     setTinNo("");
     setCstTin("");
     setServiceTaxNo("");
     setPanNo("");
     setTanNo("");
     setLbtNo("");
     setQ1("");
     setQ2("");
     setQ3("");
     setQ4("");
     setSettings(false);
     setTdsRate(null);
     setTdsDedAmt(null);
     setSurcharge(null);
     setEduCess(null);

     
  };

  useEffect(() => {
    fetchStates();
    fetchAllCities();
    fetchCountries();
    fetchCompanies();
  }, []);

  const fetchCompanies = async () => {
    try {
      const response = await axios.get(
        "https://publication.microtechsolutions.net.in/php/CompanyMasterget.php"
      );
      setCompanies(response.data);
    } catch (error) {
      console.error("Error fetching companies:", error);
    }
  };

  const fetchCountries = async () => {
    try {
      const response = await axios.get(
        "https://publication.microtechsolutions.net.in/php/Countryget.php"
      );
      const countryOptions = response.data.map((country) => ({
        value: country.Id,
        label: country.CountryName,
      }));
      setCountryOptions(countryOptions);
    } catch (error) {
      toast.error("Error fetching countries:", error);
    }
  };

  const fetchStates = async () => {
    try {
      const response = await axios.get(
        "https://publication.microtechsolutions.net.in/php/State.php"
      );
      const stateOptions = response.data.map((state) => ({
        value: state.Id,
        label: state.StateName,
      }));
      setStateOptions(stateOptions);
    } catch (error) {
      toast.error("Error fetching states:", error);
    }
  };

  const fetchAllCities = async () => {
    try {
      const response = await axios.get(
        "https://publication.microtechsolutions.net.in/php/Cityget.php"
      );
      const cityOptions = response.data.map((city) => ({
        value: city.Id,
        label: city.CityName,
      }));
      setCityOptions(cityOptions);
    } catch (error) {
      toast.error("Error fetching cities:", error);
    }
  };

  const handleNewClick = () => {
    resetForm();
    setIsModalOpen(true);
    setIsEditing(false);
    setEditingIndex(-1);
  };

  const handleEdit = (row) => {
    const comp = companies[row.index];

    setCompanyName(comp.CompanyName);
    setDirector(comp.Director);
    setDesignation(comp.Designation);
    setAddress1(comp.Address1);
    setCityId(comp.CityId);
    setStateId(comp.StateId);
    setCountryId(comp.CountryId);
    setMobileNo(comp.MobileNo);
    setPincode(comp.Pincode);
    setFaxNo(comp.FaxNo);
    setEmailId(comp.EmailId);
    setWebsite(comp.Website);
    setTinpanno(comp.tinpanno);
    setEditingIndex(row.index);
    setIsModalOpen(true);
    setIsEditing(true);
    setId(comp.Id);
  };

  // const handleDelete = (index) => {
  //   setCompanies((prevCompanies) =>
  //     prevCompanies.filter((_, i) => i !== index)
  //   );
  //   toast.success("Company Deleted Successfully!");
  // };

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
      "https://publication.microtechsolutions.net.in/php/Companymasterdelete.php",
      requestOptions
    )
      .then((response) => response.text())
      .then((result) => console.log(result))
      .catch((error) => console.error(error));
    toast.success("Company Deleted Successfully");
    setIsDeleteDialogOpen(false);
    // setDeleteIndex(deleteIndex)
    fetchCompanies();
  };

  const cancelDelete = () => {
    setIsDeleteDialogOpen(false);
    setDeleteIndex(null);
  };

  // const validateForm = () => {
  //   let formErrors = {};
  //   let isValid = true;

  //   if (!CompanyName) {
  //     formErrors.CompanyName = "Company Name is required.";
  //     isValid = false;
  //   }

  //   if (!Director) {
  //     formErrors.Director = "Director is required.";
  //     isValid = false;
  //   }

  //   if (!Designation) {
  //     formErrors.Designation = "Designation is required.";
  //     isValid = false;
  //   }

  //   if (!Address1) {
  //     formErrors.Address1 = "Address is required.";
  //     isValid = false;
  //   }

  //   if (!CityId) {
  //     formErrors.CityId = "City is required.";
  //     isValid = false;
  //   }

  //   if (!StateId) {
  //     formErrors.StateId = "State is required.";
  //     isValid = false;
  //   }
  //   if (!Pincode) {
  //     formErrors.Pincode = "Pincode is required.";
  //     isValid = false;
  //   } else if (!/^\d{6}$/.test(Pincode)) {
  //     formErrors.Pincode = "Pincode must be 6 digits.";
  //     isValid = false;
  //   }

  //   if (!CountryId) {
  //     formErrors.CountryId = "Country is required.";
  //     isValid = false;
  //   }

  //   if (!MobileNo) {
  //     formErrors.MobileNo = "Mobile No is required.";
  //     isValid = false;
  //   } else if (!/^\d{10}$/.test(MobileNo)) {
  //     formErrors.MobileNo = "MobileNo must be 10 digits.";
  //     isValid = false;
  //   }

  //   // Fax No
  //   if (!FaxNo) {
  //     formErrors.FaxNo = "FaxNo  is required.";
  //     isValid = false;
  //   } else if (!/^\d{10}$/.test(FaxNo)) {
  //     formErrors.FaxNo = "Fax No must be 10 digits.";
  //     isValid = false;
  //   }

  //   // Email ID
  //   if (!EmailId) {
  //     formErrors.EmailId = "Email Id is required.";
  //     isValid = false;
  //   } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(EmailId)) {
  //     formErrors.EmailId = "Email Id is invalid.";
  //     isValid = false;
  //   }

  //   if (!Website) {
  //     formErrors.Website = "Website is required.";
  //     isValid = false;
  //   }

  //   if (!Address1) {
  //     formErrors.Address1 = "Address1 is required.";
  //     isValid = false;
  //   }

  //   setErrors(formErrors);
  //   return isValid;
  // };

 

  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent the default form submission
    // if (!validateForm()) return;

    const data = {
      CompanyName: CompanyName,
      Director: Director,
      Designation: Designation,
      Address1: Address1,
      CountryId: CountryId,
      StateId: StateId,
      CityId: CityId,
      Pincode: Pincode,
      MobileNo: MobileNo,
      FaxNo: FaxNo,
      EmailId: EmailId,
      Website: Website,
      CreatedBy: userId,
      // UpdatedBy: userId,
    };

    // Determine the URL based on whether we're editing or adding
    const url = isEditing
      ? "https://publication.microtechsolutions.net.in/php/CompanyMasterupdate.php"
      : "https://publication.microtechsolutions.net.in/php/CompanyMasterpost.php";

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
        toast.success("Company updated successfully!");
      } else {
        toast.success("Company added successfully!");
      }
      setIsModalOpen(false);
      resetForm();
      fetchCompanies(); // Refresh the list after submit
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
        accessorKey: "CompanyName",
        header: "Company Name",
        size: 50,
      },
      {
        accessorKey: "Director",
        header: "Director",
        size: 50,
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
              }}>
              <RiDeleteBin5Line />
            </Button>
          </div>
        ),
      },
    ],
    [companies]
  );

  const table = useMaterialReactTable({
    columns,
    data: companies,

    muiTableHeadCellProps: {
      style: {
        backgroundColor: "#E9ECEF", // Replace with your desired color
        color: "black",
        fontSize: "16px",
      },
    },
  });


   return (
    <Box p={3}>
      <Typography variant="h5" mb={2}>
        Company Master
      </Typography>

      <Button variant="contained" onClick={handleNewClick}>
        New
      </Button>

      <Box mt={2}>
        <MaterialReactTable table={table} />
      </Box>

      {/* ===================== MODAL ===================== */}
      <Modal open={isModalOpen} onClose={() => setIsModalOpen(false)}>
<Paper
  sx={{
    width: 1000,
    mx: "auto",
    mt: 2,     // 🔽 reduced
    p: 1.5,      // 🔽 reduced
    maxHeight: "95vh",
    overflowY: "auto", // safety
  }}
>
<Typography fontWeight="bold" sx={{ mb: 0.5, textAlign:'center', fontSize:'18px' }}>
            {isEditing ? "Edit Company" : "Add Company"}
          </Typography>

<Grid container columnSpacing={1} rowSpacing={0.5}>
  <Grid item xs={4} sx={{ fontWeight: "bold", alignSelf: "center" }}>
    Company Name
  </Grid>
  <Grid item xs={8}>
    <TextField
      fullWidth
      size="small"
      value={CompanyName}
      onChange={(e) => setCompanyName(e.target.value)}
    />
  </Grid>

  <Grid item xs={4} sx={{ fontWeight: "bold", alignSelf: "center" }}>
    Director
  </Grid>
  <Grid item xs={8}>
    <TextField
      fullWidth
      size="small"
      value={Director}
      onChange={(e) => setDirector(e.target.value)}
    />
  </Grid>

  <Grid item xs={4} sx={{ fontWeight: "bold", alignSelf: "center" }}>
    Designation
  </Grid>
  <Grid item xs={8}>
    <TextField
      fullWidth
      size="small"
      value={Designation}
      onChange={(e) => setDesignation(e.target.value)}
    />
  </Grid>
</Grid>


<Tabs
  value={activeTab}
  onChange={(e, v) => setActiveTab(v)}
  sx={{
    minHeight: 32,
    mt: 1,
    "& .MuiTab-root": {
      minHeight: 32,
      padding: "4px 12px",
      fontSize: "0.8rem",
      fontWeight: "bold",
    },
  }}
>
            <Tab label="Address" />
            <Tab label="TIN,PAN Number" />
                        <Tab label="Other Settings" />

          </Tabs>

  {activeTab === 0 && (
  <Box sx={legacyBox}>
    <Typography sx={legendSx}>Office Address</Typography>

    <Grid container spacing={1} sx={{ mt: 0.2 }}>

      {/* Address */}
      <Grid item xs={12}>
        <TextField
          multiline
          rows={2}
          fullWidth
          size="small"
          sx={legacyInput}
          value={Address1}
          onChange={(e) => setAddress1(e.target.value)}
        />
      </Grid>

      {/* City + PIN */}
      <Grid item xs={3} sx={labelSx}>City</Grid>
      <Grid item xs={5}>
        <TextField size="small" fullWidth sx={legacyInput} value={City} onChange={(e)=> setCity(e.target.value)} />
      </Grid>

      <Grid item xs={2} sx={labelSx}>PIN</Grid>
      <Grid item xs={2}>
        <TextField size="small" fullWidth sx={legacyInput} value={Pin} onChange={(e)=> setPin(e.target.value)}/>
      </Grid>

      {/* State + Country */}
      <Grid item xs={3} sx={labelSx}>State</Grid>
      <Grid item xs={5}>
        <TextField size="small" fullWidth sx={legacyInput} value={State} onChange={(e)=> setState(e.target.value)}/>
      </Grid>

      <Grid item xs={2} sx={labelSx}>Country</Grid>
      <Grid item xs={2}>
        <TextField size="small" fullWidth sx={legacyInput} value={Country} onChange={(e)=> setCountry(e.target.value)} />
      </Grid>

      {/* Tel */}
      <Grid item xs={3} sx={labelSx}>Tel. No</Grid>
      <Grid item xs={9}>
        <TextField size="small" fullWidth sx={legacyInput} value={TelNo} onChange={(e)=> setTelNo(e.target.value)}/>
      </Grid>

      {/* Fax */}
      <Grid item xs={3} sx={labelSx}>Fax No.</Grid>
      <Grid item xs={9}>
        <TextField size="small" fullWidth sx={legacyInput} value={FaxNo} onChange={(e)=> setFaxNo(e.target.value)}/>
      </Grid>

      {/* Email */}
      <Grid item xs={3} sx={labelSx}>E-Mail</Grid>
      <Grid item xs={9}>
        <TextField size="small" fullWidth sx={legacyInput} value={Email}onChange={(e)=> setEmail(e.target.value)} />
      </Grid>

      {/* Website */}
      <Grid item xs={3} sx={labelSx}>Web Site</Grid>
      <Grid item xs={9}>
        <TextField size="small" fullWidth sx={legacyInput} value={WebSite} onChange={(e)=> setWebSite(e.target.value)}/>
      </Grid>

    </Grid>
  </Box>
)}


{activeTab === 1 && (
  <Grid container spacing={2} sx={{ mt: 1 }}>
    
    {/* LEFT SIDE – TIN / PAN */}
    <Grid item xs={6}>
      <Grid container spacing={1}>
        <Grid item xs={4} sx={labelSx}>TIN No.</Grid>
        <Grid item xs={8}>
          <TextField fullWidth size="small" sx={inputSx} value={tinNo} onChange={(e) => setTinNo(e.target.value)} />
        </Grid>

        <Grid item xs={4} sx={labelSx}>CST TIN</Grid>
        <Grid item xs={8}>
          <TextField fullWidth size="small" sx={inputSx} value={cstTin} onChange={(e) => setCstTin(e.target.value)} />
        </Grid>

        <Grid item xs={4} sx={labelSx}>Service Tax No.</Grid>
        <Grid item xs={8}>
          <TextField fullWidth size="small" sx={inputSx} value={serviceTaxNo} onChange={(e) => setServiceTaxNo(e.target.value)} />
        </Grid>

        <Grid item xs={4} sx={labelSx}>PAN No.</Grid>
        <Grid item xs={8}>
          <TextField fullWidth size="small" sx={inputSx} value={panNo} onChange={(e) => setPanNo(e.target.value)} />
        </Grid>

        <Grid item xs={4} sx={labelSx}>TAN No.</Grid>
        <Grid item xs={4}>
          <TextField fullWidth size="small" sx={inputSx} value={tanNo} onChange={(e) => setTanNo(e.target.value)} />
        </Grid>
        <Grid item xs={4}></Grid>

        <Grid item xs={4} sx={labelSx}>LBT No.</Grid>
        <Grid item xs={4}>
          <TextField fullWidth size="small" sx={inputSx} value={lbtNo} onChange={(e) => setLbtNo(e.target.value)} />
        </Grid>
      </Grid>
    </Grid>

    {/* RIGHT SIDE – ACKNOWLEDGEMENT */}
    <Grid item xs={6}>
      <Typography
        sx={{
          fontWeight: "bold",
          fontSize: "0.75rem",
          textDecoration: "underline",
          mb: 1,
        }}
      >
        Acknowledgement Nos. given By TIN faci. Centre
      </Typography>

      <Grid container spacing={1}>
        <Grid item xs={4} sx={labelSx}>1st Quarter</Grid>
        <Grid item xs={8}>
          <TextField fullWidth size="small" sx={inputSx} value={q1} onChange={(e) => setQ1(e.target.value)} />
        </Grid>

        <Grid item xs={4} sx={labelSx}>2nd Quarter</Grid>
        <Grid item xs={8}>
          <TextField fullWidth size="small" sx={inputSx} value={q2} onChange={(e) => setQ2(e.target.value)} />
        </Grid>

        <Grid item xs={4} sx={labelSx}>3rd Quarter</Grid>
        <Grid item xs={8}>
          <TextField fullWidth size="small" sx={inputSx} value={q3} onChange={(e) => setQ3(e.target.value)} />
        </Grid>

        <Grid item xs={4} sx={labelSx}>4th Quarter</Grid>
        <Grid item xs={8}>
          <TextField fullWidth size="small" sx={inputSx} value={q4} onChange={(e) => setQ4(e.target.value)} />
        </Grid>
      </Grid>
    </Grid>

  </Grid>
)}



         {activeTab === 2 && (
  <Grid container spacing={2} sx={{ mt: 1 }}>

    {/* LEFT COLUMN – CHECKBOXES */}
   <Grid item xs={4} sx={{ borderRight: "1px dashed #ccc" }}>
  {[
    { label: "Is this a branch ?", key: "isBranch" },
    { label: "Generate receipt No. automatically?", key: "genReceiptAuto" },
    { label: "Generate invoice No. automatically?", key: "genInvoiceAuto" },
    { label: "Generate invoice without Challan?", key: "genInvoiceNoChallan" },
    { label: "Print Receipt after saving?", key: "printReceiptSave" },
    { label: "Print invoice in add mode?", key: "printInvoiceAdd" },
    { label: "Print invoice in edit mode?", key: "printInvoiceEdit" },
  ].map((item) => (
    <Grid
      key={item.key}
      container
      alignItems="center"
      sx={{ mb: 0.5 }}
    >
      <Grid item xs={9}>
        <Typography sx={{ fontSize: "0.8rem", fontWeight: "bold" }}>
          {item.label}
        </Typography>
      </Grid>
      <Grid item xs={3}>
<Checkbox
  size="small"
  checked={settings[item.key]}
  onChange={() => handleSettingChange(item.key)}
/>
      </Grid>
    </Grid>
  ))}
</Grid>


    {/* MIDDLE COLUMN – INVOICE + DEPOSIT */}
    <Grid item xs={4}>
      <FormControlLabel
  control={
    <Checkbox
      size="small"
      checked={settings.selectRateFromMaster}
      onChange={() => handleSettingChange("selectRateFromMaster")}
    />
  }
  label={
    <Typography sx={{ fontSize: "0.8rem", fontWeight: "bold" }}>
      For invoice select rate from master
    </Typography>
  }
/>


      <Box sx={{ border: "1px solid #ccc", p: 1, mt: 1 }}>
        <Typography
          sx={{
            fontSize: "0.75rem",
            fontWeight: "bold",
            mt: -2,
            bgcolor: "white",
            width: "fit-content",
            px: 0.5,
          }}
        >
          Deposit
        </Typography>

        <Grid container spacing={1} alignItems="center">
          <Grid item xs={7} sx={labelSx}>TDS %</Grid>
          <Grid item xs={5}>
            <TextField size="small" sx={{ ...inputSx, backgroundColor: legacyYellow }} value={tdsRate} onChange={(e)=> setTdsRate(e.target.value)}/>
          </Grid>

          <Grid item xs={7} sx={labelSx}>Surcharge %</Grid>
          <Grid item xs={5}>
            <TextField size="small" sx={{ ...inputSx, backgroundColor: legacyYellow }} value={surcharge} onChange={(e)=> setSurcharge(e.target.value)}/>
          </Grid>

          <Grid item xs={7} sx={labelSx}>Edu. Cess %</Grid>
          <Grid item xs={5}>
            <TextField size="small" sx={{ ...inputSx, backgroundColor: legacyYellow }} value={eduCess} onChange={(e)=> setEduCess(e.target.value)}/>
          </Grid>

          <Grid item xs={7} sx={labelSx}>TDS Ded Amt</Grid>
          <Grid item xs={5}>
            <TextField size="small" sx={{ ...inputSx, backgroundColor: legacyYellow }} value={tdsDedAmt} onChange={(e)=> setTdsDedAmt(e.target.value)}/>
          </Grid>
        </Grid>
      </Box>
    </Grid>

    {/* RIGHT COLUMN – ACCOUNTING YEAR */}
    <Grid item xs={4}>
      <Box sx={{ border: "1px solid #ccc", p: 1 }}>
        <Typography
          sx={{
            fontSize: "0.75rem",
            fontWeight: "bold",
            mt: -2,
            bgcolor: "white",
            width: "fit-content",
            px: 0.5,
          }}
        >
          Accounting Year
        </Typography>

        <Grid container spacing={1} alignItems="center">
          <Grid item xs={3} sx={labelSx}>From</Grid>
          <Grid item xs={9}>
            <TextField type="date" size="small" fullWidth sx={inputSx} value={yearFrom} />
          </Grid>

          <Grid item xs={3} sx={labelSx}>To</Grid>
          <Grid item xs={9}>
            <TextField type="date" size="small" fullWidth sx={inputSx} value={yearTo} />
          </Grid>
        </Grid>
      </Box>
    </Grid>

  </Grid>
)}


                
         

        <Box mt={3} textAlign="center">
  <Button onClick={handleSubmit} variant="contained">
    Save
  </Button>

  <Button
    onClick={() => setIsModalOpen(false)}
    variant="contained"
    color="error"
    sx={{ ml: 2 }}
  >
    Cancel
  </Button>
</Box>

        </Paper>
      </Modal>

      {/* ===================== DELETE DIALOG ===================== */}
      <Dialog open={isDeleteDialogOpen} onClose={() => setIsDeleteDialogOpen(false)}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>Are you sure?</DialogContent>
        <DialogActions>
          <Button onClick={() => setIsDeleteDialogOpen(false)}>Cancel</Button>
          <Button color="error" onClick={confirmDelete}>
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      <ToastContainer />
    </Box>
  );
}
 


export default Company;
