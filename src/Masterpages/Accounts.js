import React, { useState, useMemo, useEffect } from "react";
import "./Accounts.css";
import {
  MaterialReactTable,
  useMaterialReactTable,
} from "material-react-table";
import axios from "axios";
import {
  Modal,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";

import Select from "react-select";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { Box, Grid, Typography } from "@mui/material";
import Tooltip from "@mui/material/Tooltip";
import { RiDeleteBin5Line, RiHeart2Fill } from "react-icons/ri";
import { CiEdit } from "react-icons/ci";
import qs from "qs";
import { useRef } from "react";
import { Checkbox, FormControlLabel, TextField } from "@mui/material";

function Accounts() {
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

    fetchAccounts();
  }, []);

  const [pageIndex, setPageIndex] = useState(1); // Current page
  const [totalPages, setTotalPages] = useState(1); // Total pages from backend

  const [IsSubsidiary, setIsSubsidiary] = useState(false);
  const [IsTDSApplicable, setIsTDSApplicable] = useState(false);
  const [IsFBT, setIsFBT] = useState(false);
  const [IsFreeze, setIsFreeze] = useState(false);
  const [editingIndex, setEditingIndex] = useState(-1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [AccountCode, setAccountCode] = useState("");
  const [AccountName, setAccountName] = useState("");
  const [GroupId, setGroupId] = useState("");
  const [SubGroupId, setSubGroupId] = useState("");
  const [OpeningBalance, setOpeningBalance] = useState("0.00");
  const [DrORCr, setDrOrCr] = useState("");
  const [TypeCode, setTypeCode] = useState("");
  const [IsSystem, setIsSystem] = useState(false);
  const [Depriciation, setDepriciation] = useState("");
  const [Canvassor, setCanvassor] = useState("");
  const [isAssigned, setIsAssigned] = useState(false);

  //All the Post parameters for the Address Post
  const [MobileNo, setMobileNo] = useState("");
  const [TelephoneNo, setTelephoneNo] = useState("");
  const [Pincode, setPincode] = useState("");
  const [FaxNo, setFaxNo] = useState("");
  const [PANNo, setPANNo] = useState("");
  const [GSTNo, setGSTNo] = useState("");
  const [EmailId, setEmailId] = useState("");
  const [Address1, setAddress1] = useState("");
  const [Address2, setAddress2] = useState("");
  const [Address3, setAddress3] = useState("");

  const [CityId, setCityId] = useState("");
  const [StateId, setStateId] = useState(1);
  const [AreaId, setAreaId] = useState("");
  const [CountryId, setCountryId] = useState(1);
  const [TDSId, setTDSId] = useState("");

  const [cityOptions, setCityOptions] = useState([]);
  const [stateOptions, setStateOptions] = useState([]);
  const [areaOptions, setareaOptions] = useState([]);
  const [countryOptions, setCountryOptions] = useState([]);
  const [tdsOptions, setTdsOptions] = useState([]);
  const [accountgroupOptions, setAccountgroupOptions] = useState([]);
  const [subgroupOptions, setSubgroupOptions] = useState([]);
  const [isAddressVisible, setIsAddressVisible] = useState(false); // State for address visibility

  const [errors, setErrors] = useState("");
  const [AccountId, setAccountid] = useState("");
  const [addressid, setAddressid] = useState("");
  const [accounts, setAccounts] = useState([]);
  const [addresses, setAddresses] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  //Enter button hit go to next input value in Account side
  const accountCodeRef = useRef(null);
  const accountNameRef = useRef(null);
  const groupIdRef = useRef(null);
  const subGroupIdRef = useRef(null);
  const openingBalanceRef = useRef(null);
  const debitcreditRef = useRef(null);
  const typecodeRef = useRef(null);
  const depreciationRef = useRef(null);
  const canvassorRef = useRef(null);
  const isassignedRef = useRef(null);
  const subsidiartRef = useRef(null);
  const tdsappRef = useRef(null);
  const fbtRef = useRef(null);
  const freezeRef = useRef(null);
  const systemRef = useRef(null);

  //Enter button hit go to next input value in Address side

  const address1Ref = useRef(null);

  const address2Ref = useRef(null);
  const address3Ref = useRef(null);

  const countryRef = useRef(null);
  const stateRef = useRef(null);
  const cityRef = useRef(null);
  const areaRef = useRef(null);
  const pinRef = useRef(null);
  const telephoneRef = useRef(null);
  const mobileRef = useRef(null);
  const faxRef = useRef(null);
  const panRef = useRef(null);
  const gstRef = useRef(null);
  const emailRef = useRef(null);
  const tdsRef = useRef(null);
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
    fetchGroupIds();
    fetchSubGroupIds();
    fetchCountries();
    fetchAllCities();
    fetchStates();
    fetchAreas();
    fetchTDS();
    fetchAddresses();
  }, []);

  useEffect(() => {
    fetchAccounts();
    console.log("this function is called");
  }, [pageIndex]); // Fetch data when page changes

  const fetchAccounts = async () => {
    try {
      const response = await axios.get(
        `https://publication.microtechsolutions.net.in/php/get/gettblpage.php?Table=Account&PageNo=${pageIndex}`
      );
      setAccounts(response.data.data);
      setTotalPages(response.data.total_pages);

      console.log(response.data);
    } catch (error) {
      // toast.error("Error fetching accounts:", error);
    }
  };

  const fetchAddresses = async () => {
    try {
      const response = await axios.get(
        "https://publication.microtechsolutions.net.in/php/Addressget.php"
      );
      console.log(response.data, "Fetched addresses"); // Log to ensure data is fetched
      setAddresses(response.data);
    } catch (error) {
      // toast.error("Error fetching addresses:", error);
    }
  };

  const fetchGroupIds = async () => {
    try {
      const response = await axios.get(
        "https://publication.microtechsolutions.net.in/php/AccountGroupget.php"
      );
      const accountgroupOptions = response.data.map((acc) => ({
        value: acc.Id,
        label: acc.GroupName,
        code: acc.TypeCode,
      }));
      setAccountgroupOptions(accountgroupOptions);
    } catch (error) {
      // toast.error("Error fetching group ids:", error);
    }
  };

  const fetchSubGroupIds = async () => {
    try {
      const response = await axios.get(
        "https://publication.microtechsolutions.net.in/php/SubAccountGroupget.php"
      );
      const subgroupOptions = response.data.map((sub) => ({
        value: sub.Id,
        label: sub.SubGroupName,
      }));
      setSubgroupOptions(subgroupOptions);
    } catch (error) {
      // toast.error("Error fetching subgroup ids:", error);
    }
  };

  const fetchCountries = async () => {
    try {
      const response = await axios.get(
        "https://publication.microtechsolutions.net.in/php/Countryget.php"
      );
      const countryOptions = response.data.map((con) => ({
        value: con.Id,
        label: con.CountryName,
      }));
      setCountryOptions(countryOptions);
    } catch (error) {
      // toast.error("Error fetching countries:", error);
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
      // toast.error("Error fetching states:", error);
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
      // toast.error("Error fetching cities:", error);
    }
  };

  const fetchAreas = async () => {
    try {
      const response = await axios.get(
        "https://publication.microtechsolutions.net.in/php/Areaget.php"
      );
      const areaOptions = response.data.map((area) => ({
        value: area.Id,
        label: area.AreaName,
      }));
      setareaOptions(areaOptions);
    } catch (error) {
      // toast.error("Error fetching areas:", error);
    }
  };

  const fetchTDS = async () => {
    try {
      const response = await axios.get(
        "https://publication.microtechsolutions.net.in/php/TDSMasterget.php"
      );
      const tdsOptions = response.data.map((tds) => ({
        value: tds.Id,
        label: tds.TDSHead,
      }));
      setTdsOptions(tdsOptions);
    } catch (error) {
      // toast.error("Error fetching tds ids:", error);
    }
  };

  const handleLabelClick = () => {
    setIsAddressVisible(!isAddressVisible); // Toggle visibility
  };

  const handleNewClick = () => {
    resetForm();
    setIsEditing(false);
    setIsModalOpen(true);
    setEditingIndex(-1);
  };

  // console.log(addresses, 'addresses')

  const handleEdit = (row) => {
    const account = accounts[row.index];

    console.log(account, "account");
    setAccountCode(account.AccountCode);
    setAccountName(account.AccountName);
    setGroupId(account.GroupId);
    setSubGroupId(account.SubGroupId);
    setOpeningBalance(account.OpeningBalance);
    setDrOrCr(account.DrORCr);
    setTypeCode(account.TypeCode);
    setIsSystem(account.IsSystem);
    setDepriciation(account.Depriciation);

    const address = addresses.find((addr) => addr.AccountId === account.Id);
    console.log(address, "adddress");

    // If address is not found, set default values for address fields
    if (address) {
      setAddress1(address.Address1);
      setAddress2(address.Address2);
      setAddress3(address.Address3);
      setAreaId(address.AreaId);
      setCityId(address.CityId);
      setStateId(address.StateId);
      setPincode(address.Pincode);
      setCountryId(address.CountryId);
      setTelephoneNo(address.TelephoneNo);
      setFaxNo(address.FaxNo);
      setMobileNo(address.MobileNo);
      setEmailId(address.EmailId);
      setPANNo(address.PANNo);
      setGSTNo(address.GSTNo);
      setIsSubsidiary(address.IsSubsidiary);
      setIsTDSApplicable(address.IsTDSApplicable);
      setIsFBT(address.IsFBT);
      setIsFreeze(address.ISFreeze);
      setTDSId(address.TDSId);
      setAddressid(address.Id);
      setAccountid(address.AccountId);
    } else {
      // If no address found, set default empty values (or you can use "null" or other placeholders)
      setAddress1("");
      setAddress2("");
      setAddress3("");
      setAreaId(null);
      setCityId(null);
      setStateId(null);
      setPincode("");
      setCountryId(null);
      setTelephoneNo("");
      setFaxNo("");
      setMobileNo("");
      setEmailId("");
      setPANNo("");
      setGSTNo("");
      setIsSubsidiary(false);
      setIsTDSApplicable(false);
      setIsFBT(false);
      setIsFreeze(false);
      setTDSId(null);
      setAddressid(null);
      setAccountid(account.Id);
    }
    setEditingIndex(row.index);
    setIsEditing(true);
    setIsModalOpen(true);
  };

  //   const handleEdit = (row) => {
  //     const account = accounts[row.index];
  //     if (!account) {
  //         toast.error("Invalid account data.");
  //         return;
  //     }
  //     console.log("Selected Account:", account);

  //     const address = addresses.find(addr => addr.AccountId === account.Id);

  //     if (!address) {
  //         toast.error("Address data is missing.");
  //         return;
  //     }

  //     console.log("Selected Address:", address);
  //     setAccountCode(account.AccountCode);
  //     setAccountName(account.AccountName);
  //     setGroupId(account.GroupId);
  //     setSubGroupId(account.SubGroupId);
  //     setOpeningBalance(account.OpeningBalance);
  //     setDrOrCr(account.DrORCr);
  //     setTypeCode(account.TypeCode);
  //     setIsSystem(account.IsSystem);
  //     setDepriciation(account.Depriciation);

  //     setAddress1(address.Address1);
  //     setAddress2(address.Address2);
  //     setAddress3(address.Address3);
  //     setAreaId(address.AreaId);
  //     setCityId(address.CityId);
  //     setStateId(address.StateId);
  //     setPincode(address.Pincode);
  //     setCountryId(address.CountryId);
  //     setTelephoneNo(address.TelephoneNo);
  //     setFaxNo(address.FaxNo);
  //     setMobileNo(address.MobileNo);
  //     setEmailId(address.EmailId);
  //     setPANNo(address.PANNo);
  //     setGSTNo(address.GSTNo);
  //     setIsSubsidiary(address.IsSubsidiary);
  //     setIsTDSApplicable(address.IsTDSApplicable);
  //     setIsFBT(address.IsFBT);
  //     setISFreeze(address.ISFreeze);
  //     setTDSId(address.TDSId);
  //     setAddressid(address.Id);
  //     setAccountid(address.AccountId);

  //  setEditingIndex(row.index);
  // setIsEditing(true);
  //  setIsModalOpen(true);
  // };

  const validateForm = () => {
    let formErrors = {};
    let isValid = true;

    if (!AccountName) {
      formErrors.AccountName = "Account Name is required.";
      isValid = false;
    }

    if (!GroupId) {
      formErrors.GroupId = "Group id is required.";
      isValid = false;
    }

    if (!SubGroupId) {
      formErrors.SubGroupId = "Sub Group id is required.";
      isValid = false;
    }
    // if (!OpeningBalance) {
    //   formErrors.OpeningBalance = "Opening Balance is required.";
    //   isValid = false;
    // }

    if (!DrORCr) {
      formErrors.DrORCr = "Debit or credit is required.";
      isValid = false;
    }

    if (!TypeCode) {
      formErrors.TypeCode = "Type code is required.";
      isValid = false;
    }

    if (!Depriciation) {
      formErrors.Depriciation = "Depriciation is required.";
      isValid = false;
    }

    // Email ID
    if (!EmailId) {
      formErrors.EmailId = "Email Id is required.";
      isValid = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(EmailId)) {
      formErrors.EmailId = "Email Id is invalid.";
      isValid = false;
    }

    // Address
    if (!Address1) {
      formErrors.Address1 = "Address is required.";
      isValid = false;
    }

    // Area
    if (!AreaId) {
      formErrors.AreaId = "Area is required.";
      isValid = false;
    }

    // State
    if (!StateId) {
      formErrors.StateId = "State is required.";
      isValid = false;
    }

    // City
    if (!CityId) {
      formErrors.CityId = "City is required.";
      isValid = false;
    }
    if (!CountryId) {
      formErrors.CountryId = "Country is required.";
      isValid = false;
    }

    // Pincode
    if (!Pincode) {
      formErrors.Pincode = "Pincode is required.";
      isValid = false;
    } else if (!/^\d{6}$/.test(Pincode)) {
      formErrors.Pincode = "Pincode must be 6 digits.";
      isValid = false;
    }

    // Mobile No
    if (!MobileNo) {
      formErrors.MobileNo = "Mobile No is required.";
      isValid = false;
    } else if (!/^\d{10}$/.test(MobileNo)) {
      formErrors.MobileNo = "Mobile No must be 10 digits.";
      isValid = false;
    }

    if (!TelephoneNo) {
      formErrors.TelephoneNo = "TelephoneNo is required.";
      isValid = false;
    } else if (!/^\d{10}$/.test(TelephoneNo)) {
      formErrors.TelephoneNo = "Telephone No must be 10 digits.";
      isValid = false;
    }

    // // Fax No
    // if (!FaxNo) {
    //   formErrors.FaxNo = "FaxNo  is required.";
    //   isValid = false;
    // } else if (!/^\d{10}$/.test(FaxNo)) {
    //   formErrors.FaxNo = "Fax No must be 10 digits.";
    //   isValid = false;
    // }

    if (!TDSId) {
      formErrors.TDSId = "TDS id is required.";
      isValid = false;
    }

    // PAN Validation
    const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;
    if (!PANNo) {
      formErrors.PANNo = "PAN is required.";
      isValid = false;
    } else if (!panRegex.test(PANNo)) {
      formErrors.PANNo = "Invalid PAN format.";
      isValid = false;
    }

    // GST Validation
    const gstRegex =
      /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}[Z]{1}[0-9A-Z]{1}$/;
    if (!GSTNo) {
      formErrors.GSTNo = "GST No is required.";
      isValid = false;
    } else if (!gstRegex.test(GSTNo)) {
      formErrors.GSTNo = "Invalid GST format.";
      isValid = false;
    }

    setErrors(formErrors);
    return isValid;
  };

  const resetForm = () => {
    setAccountCode("");
    setAccountName("");
    setGroupId("");
    setSubGroupId("");
    setOpeningBalance("");
    setDrOrCr("");
    setTypeCode("");
    setIsSystem("");
    setDepriciation("");
    setAddress1("");
    setAddress2("");
    setAddress3("");
    setAreaId("");
    setCityId("");
    setStateId("");
    setCountryId("");
    setPincode("");
    setTelephoneNo("");
    setMobileNo("");
    setFaxNo("");
    setGSTNo("");
    setPANNo("");
    setIsSubsidiary("");
    setEmailId("");
    setIsTDSApplicable("");
    setIsFBT("");
    setIsFreeze("");
    setTDSId("");
  };

  const fetchAccCodedata = async (AccountCode) => {
    try {
      const cleanedAccountCode = AccountCode.trim(); // Normalize AccountCode
      console.log("Fetching data for AccountCode:", cleanedAccountCode);

      const response = await fetch(
        `https://publication.microtechsolutions.net.in/php/Accountcodeget.php?AccountCode=${cleanedAccountCode}`
      );

      if (!response.ok) {
        throw new Error("Failed to fetch data");
      }

      const accountData = await response.json();
      console.log("API response:", accountData); // Log the entire API response

      if (Array.isArray(accountData) && accountData.length > 0) {
        // Compare AccountCode as a number
        const data = accountData.find((item) => {
          console.log("Item AccountCode:", item.AccountCode); // Log each AccountCode for debugging
          return item.AccountCode === parseInt(cleanedAccountCode, 10); // Convert cleanedAccountCode to number for comparison
        });

        if (data) {
          console.log("Found data:", data); // Log the matching data
          setAccountName(data.AccountName || "");
          setGroupId(data.GroupId || "");
          setSubGroupId(data.SubGroupId || "");
          setOpeningBalance(data.OpeningBalance || "");
          setDrOrCr(data.DrORCr || "");
          setTypeCode(data.TypeCode || "");
          setDepriciation(data.Depriciation || "");
        } else {
          console.log(
            "No matching data found for AccountCode:",
            cleanedAccountCode
          );
          toast.error("No data found for the provided Account Code");
        }
      } else {
        // toast.error('No data returned from the API');
      }
    } catch (error) {
      console.error("Error fetching account data:", error);
      // toast.error('Error fetching account data');
    }
  };

  // Handle Account Code input change
  const handleAccountCodeChange = (e) => {
    const value = e.target.value;
    setAccountCode(value);

    if (value.trim() === "") {
      // Reset all fields if input is cleared
      resetForm();
      return; // Don't fetch
    }

    // Fetch data when Account Code is changed
    if (value.length >= 0 || 2 || 3) {
      // Optional: Fetch after 3 characters to avoid excessive requests
      fetchAccCodedata(value);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    // Step 1: Prepare account data
    const accountData = {
      ...(isEditing && { Id: AccountId, UpdatedBy: userId }), // Use AccountId if editing
      // AccountCode: AccountCode,
      AccountName: AccountName,
      GroupId: GroupId,
      SubGroupId: SubGroupId,
      OpeningBalance: 0,
      DrORCr: DrORCr,
      TypeCode: TypeCode,
      IsSystem: true,
      Depriciation: Depriciation,
      CreatedBy: userId,
    };

    try {
      // Step 2: Post account data and get account ID
      const accounturl = isEditing
        ? "https://publication.microtechsolutions.net.in/php/Accountupdate.php"
        : "https://publication.microtechsolutions.net.in/php/Accountpost.php";

      const accresponse = await axios.post(
        accounturl,
        qs.stringify(accountData),
        {
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
        }
      );

      console.log(accresponse.data, "response of account");

      // Step 3: Capture the accountId from the response and update state
      const accId = parseInt(accresponse.data.Id, 10); // Parse the account ID from the response
      console.log(accId, "accountid");
      setAccountid(accId); // Update the state `accountid`

      // Step 4: Prepare address data (either from the state or empty for new records)
      const addressData = {
        ...(isEditing
          ? {
              Id: addressid,
              AccountId: AccountId,
              UpdatedBy: userId,
            }
          : {
              AccountId: accId,
            }),

        Address1: Address1,
        Address2: Address2,
        Address3: Address3,
        CountryId: CountryId,
        StateId: StateId,
        CityId: CityId,
        AreaId: AreaId,
        Pincode: Pincode,
        TelephoneNo: TelephoneNo,
        MobileNo: MobileNo,
        FaxNo: "123456",
        PANNo: PANNo,
        GSTNo: GSTNo,
        EmailId: EmailId,
        TDSId: TDSId,
        IsSubsidiary: true,
        IsTDSApplicable: IsTDSApplicable,
        IsFBT: true,
        IsFreeze: true,
        CreatedBy: userId,
        // UpdatedBy: userId,
      };

      const addressurl = isEditing
        ? "https://publication.microtechsolutions.net.in/php/Addressupdate.php"
        : "https://publication.microtechsolutions.net.in/php/Addresspost.php";

      await axios.post(addressurl, qs.stringify(addressData), {
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
      });

      fetchAccounts();
      fetchAddresses();
      setIsModalOpen(false);
      toast.success(
        isEditing
          ? "Account & Address updated successfully!"
          : "Account & Address added successfully!"
      );
      resetForm();
    } catch (error) {
      toast.error("Error saving record!");
    }
  };

  // Confirmation Dialog state
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [deleteIndex, setDeleteIndex] = useState(null);

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
      "https://publication.microtechsolutions.net.in/php/Accountdelete.php",
      requestOptions
    )
      .then((response) => response.text())
      .then((result) => console.log(result))
      .catch((error) => console.error(error));
    toast.success("Account Deleted Successfully");
    setIsDeleteDialogOpen(false);
    // setDeleteIndex(deleteIndex)
    fetchAccounts();
  };

  const cancelDelete = () => {
    setIsDeleteDialogOpen(false);
    setDeleteIndex(null);
    setDeleteId(null);
  };

  const columns = useMemo(
    () => [
      {
        accessorKey: "SrNo",
        header: "Sr.No",
        size: 10,
        Cell: ({ row }) => row.index + 1,
      },
      {
        accessorKey: "AccountName",
        header: "Account Name",
        size: 10,
      },
      {
        accessorKey: "AccountCode",
        header: "Account Code",
        size: 10,
      },

      // {
      //   accessorKey: "OpeningBalance",
      //   header: "Opening Balance",
      //   size: 10,
      // },

      {
        accessorKey: "actions",
        header: "Actions",
        size: 150,
        Cell: ({ row }) => (
          <div>
            <Button
              onClick={() => handleEdit(row)}
              style={{
                // background: "#3c7291",
                // background: '#023e7d',
                background: "#0a60bd",
                color: "white",
                marginRight: "5px",
              }}>
              Edit
              {/* <CiEdit style={{color: '#FFF', fontSize:'22px', fontWeight:700}}  /> */}
            </Button>
            <Button
              // onClick={() => handleDelete(row.index)}

              onClick={() => handleDelete(row.index, row.original.Id)} // Pass the ID of the account
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
    [accounts, addresses]
  );

  const table = useMaterialReactTable({
    columns,
    data: accounts,
    enablePagination: false, // Turn off frontend pagination

    muiTableHeadCellProps: {
      style: {
        // backgroundColor: "#758694",
        backgroundColor: "#E9ECEF",
        color: "black",
        fontSize: "16px",
      },
    },
  });

  return (
    <div className="account-master">
      <h1>Account Master</h1>

      <div className="accounttable-master">
        <div className="accounttable1-master">
          {" "}
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
          <div className="acctable-container">
            <MaterialReactTable table={table} />
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

        {isModalOpen && (
          <div
            className="account-overlay"
            onClick={() => setIsModalOpen(false)}
          />
        )}

        <Modal open={isModalOpen}>
          <div className="account-modal">
            <h2
              style={{
                textAlign: "center",
                fontWeight: "620",
                margin: "2px",
                fontSize: "27px",
              }}>
              {editingIndex >= 0 ? "Edit Account Master" : "Add Account Master"}
            </h2>

            {/* {yearid} */}

            <Box sx={{ padding: 5 }}>
              <form>
                <Grid container spacing={2}>
                  {/* Left Section */}
                  <Grid item xs={12} sm={6}>
                    <Typography
                      variant="h5"
                      gutterBottom
                      style={{ color: "#3c7291", fontWeight: "500" }}>
                      Account Details:
                    </Typography>
                    <div className="account-form">
                      <div>
                        <label className="account-label">
                          Account Code<b className="required">*</b>
                        </label>
                        <div>
                          <input
                            type="text"
                            id="AccountCode"
                            name="AccountCode"
                            value={AccountCode}
                            onChange={handleAccountCodeChange}
                            maxLength={100}
                            ref={accountCodeRef}
                            onKeyDown={(e) => handleKeyDown(e, accountNameRef)}
                            placeholder="Auto-Incremented"
                            className="account-control"
                            style={{ background: "	#D0D0D0" }}
                          />

                          <div>
                            {errors.AccountCode && (
                              <b className="error-text">{errors.AccountCode}</b>
                            )}
                          </div>
                        </div>
                      </div>
                      <div>
                        <label className="account-label">
                          Account Name<b className="required">*</b>
                        </label>
                        <div>
                          <Tooltip
                            title={
                              <span
                                style={{
                                  fontSize: "14px",
                                  fontWeight: "bold",
                                }}>
                                {AccountName}
                              </span>
                            }
                            arrow>
                            <input
                              type="text"
                              id="AccountName"
                              name="AccountName"
                              value={AccountName}
                              onChange={(e) => setAccountName(e.target.value)}
                              maxLength={100}
                              ref={accountNameRef}
                              onKeyDown={(e) => handleKeyDown(e, groupIdRef)}
                              style={{ width: "200px" }}
                              placeholder="Enter Account Name"
                              className="account-control"
                            />
                          </Tooltip>

                          <div>
                            {errors.AccountName && (
                              <b className="error-text">{errors.AccountName}</b>
                            )}
                          </div>
                        </div>
                      </div>
                      <br />
                      <div>
                        <label className="account-label">
                          Account Group<b className="required">*</b>
                        </label>
                        <Select
                          id="GroupId"
                          name="GroupId"
                          value={accountgroupOptions.find(
                            (option) => option.value === GroupId
                          )}
                          onChange={(option) => {
                            setGroupId(option?.value); // set selected group id
                            setTypeCode(option?.code || ""); // ✅ set type code from selected group
                          }}
                          ref={groupIdRef}
                          tabIndex={0}
                          onKeyDown={(e) => handleKeyDown(e, subGroupIdRef)}
                          options={accountgroupOptions}
                          styles={{
                            control: (base) => ({
                              ...base,
                              width: "170px",
                              marginTop: "10px",
                              borderRadius: "4px",
                              border: "1px solid rgb(223, 222, 222)",
                              marginBottom: "5px",
                            }),
                          }}
                          placeholder="Select Group id"
                        />

                        <div>
                          {errors.GroupId && (
                            <b className="error-text">{errors.GroupId}</b>
                          )}
                        </div>
                      </div>
                      <div>
                        <label className="account-label">
                          Sub Group<b className="required">*</b>
                        </label>
                        <div>
                          <Select
                            id="SubGroupId"
                            name="SubGroupId"
                            value={subgroupOptions.find(
                              (option) => option.value === SubGroupId
                            )}
                            onChange={(option) => setSubGroupId(option.value)}
                            ref={subGroupIdRef}
                            onKeyDown={(e) => handleKeyDown(e, debitcreditRef)}
                            options={subgroupOptions}
                            styles={{
                              control: (base) => ({
                                ...base,
                                width: "200px",
                                marginTop: "10px",
                                borderRadius: "4px",
                                border: "1px solid rgb(223, 222, 222)",
                                marginBottom: "5px",
                              }),
                            }}
                            placeholder="Select Id"
                          />

                          <div>
                            {errors.SubGroupId && (
                              <b className="error-text">{errors.SubGroupId}</b>
                            )}
                          </div>
                        </div>
                      </div>
                      <div style={{ display: "none" }}>
                        <label className="account-label">
                          Opening Balance<b className="required">*</b>
                        </label>
                        <div>
                          <input
                            type="text"
                            id="OpeningBalance"
                            name="OpeningBalance"
                            value={OpeningBalance}
                            onChange={(e) => {
                              const value = e.target.value;

                              // Regex to validate decimal numbers with at most 18 digits total and 2 decimal places
                              const regex = /^\d{0,18}(\.\d{0,2})?$/;

                              // Check if the value matches the regex
                              if (value === "" || regex.test(value)) {
                                setOpeningBalance(value);
                              }
                            }}
                            ref={openingBalanceRef}
                            onKeyDown={(e) => handleKeyDown(e, debitcreditRef)}
                            className="account-control"
                            placeholder="Enter Opening balance"
                          />

                          {/* <div>
                            {errors.OpeningBalance && (
                              <b className="error-text">
                                {errors.OpeningBalance}
                              </b>
                            )}
                          </div> */}
                        </div>
                      </div>
                      <div>
                        <label className="account-label">
                          Debit / Credit<b className="required">*</b>
                        </label>
                        <div>
                          <input
                            type="text"
                            id="DrORCr"
                            name="DrORCr"
                            value={DrORCr}
                            onChange={(e) => setDrOrCr(e.target.value)}
                            maxLength={1}
                            ref={debitcreditRef}
                            onKeyDown={(e) => handleKeyDown(e, typecodeRef)}
                            className="account-control"
                            placeholder="1 Digit Letter or Number"
                          />

                          <div>
                            {errors.DrORCr && (
                              <b className="error-text">{errors.DrORCr}</b>
                            )}
                          </div>
                        </div>
                      </div>
                      <div>
                        <label className="account-label">
                          Type Code<b className="required">*</b>
                        </label>
                        <div>
                          <input
                            type="text"
                            id="TypeCode"
                            name="TypeCode"
                            value={TypeCode}
                            ref={typecodeRef}
                            onKeyDown={(e) => handleKeyDown(e, depreciationRef)}
                            readOnly
                            className="account-control"
                            placeholder="Auto-filled from Group"
                          />
                          <div>
                            {errors.TypeCode && (
                              <b className="error-text">{errors.TypeCode}</b>
                            )}
                          </div>
                        </div>
                      </div>
                      <div>
                        <label className="account-label">
                          Depriciation<b className="required">*</b>
                        </label>
                        <div>
                          <input
                            type="text"
                            id="Depriciation"
                            name="Depriciation"
                            value={Depriciation}
                            onChange={(e) => {
                              const value = e.target.value;

                              // Regex to validate decimal numbers with at most 18 digits total and 2 decimal places
                              const regex = /^\d{0,18}(\.\d{0,2})?$/;

                              // Check if the value matches the regex
                              if (value === "" || regex.test(value)) {
                                setDepriciation(value);
                              }
                            }}
                            ref={depreciationRef}
                            onKeyDown={(e) => handleKeyDown(e, canvassorRef)}
                            className="account-control"
                            placeholder="Enter Depreciation in %"
                          />
                          <div>
                            {errors.Depriciation && (
                              <b className="error-text">
                                {errors.Depriciation}
                              </b>
                            )}
                          </div>
                        </div>
                      </div>

                      <div>
                        <label
                          className="account-label"
                          style={{ marginTop: "30px" }}>
                          Is TDS Applicable
                        </label>
                        <div>
                          <input
                            type="checkbox"
                            id="IsTDSApplicable"
                            name="IsTDSApplicable"
                            checked={IsTDSApplicable}
                            onChange={(e) =>
                              setIsTDSApplicable(e.target.checked)
                            }
                            ref={tdsappRef}
                            onKeyDown={(e) => handleKeyDown(e, fbtRef)}
                            style={{ marginTop: "10px" }}
                          />
                        </div>

                        <div>
                          {errors.IsTDSApplicable && (
                            <b className="error-text">
                              {errors.IsTDSApplicable}
                            </b>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="account-form" style={{ marginTop: "30px" }}>
                      <div style={{ display: "none" }}>
                        <label className="account-label">Is Subsidiary</label>
                        <div>
                          <input
                            type="checkbox"
                            id="IsSubsidiary"
                            name="IsSubsidiary"
                            checked={IsSubsidiary}
                            onChange={(e) => setIsSubsidiary(e.target.checked)}
                            ref={subsidiartRef}
                            onKeyDown={(e) => handleKeyDown(e, tdsappRef)}
                          />
                        </div>
                        {/* <div>
                          {errors.IsSubsidiary && (
                            <b className="error-text">{errors.IsSubsidiary}</b>
                          )}
                        </div> */}
                      </div>

                      <div style={{ display: "none" }}>
                        <label className="account-label">Is FBT</label>
                        <input
                          type="checkbox"
                          id="IsFBT"
                          name="IsFBT"
                          checked={IsFBT}
                          onChange={(e) => setIsFBT(e.target.checked)}
                          ref={fbtRef}
                          onKeyDown={(e) => handleKeyDown(e, freezeRef)}
                        />

                        {/* <div>
                          {errors.IsFBT && (
                            <b className="error-text">{errors.IsFBT}</b>
                          )}
                        </div> */}
                      </div>
                      <div style={{ marginTop: "10px", display: "none" }}>
                        <label className="account-label">Is Freeze</label>
                        <input
                          type="checkbox"
                          id="ISFreeze"
                          name="ISFreeze"
                          checked={IsFreeze}
                          onChange={(e) => setIsFreeze(e.target.checked)}
                          ref={freezeRef}
                          onKeyDown={(e) => handleKeyDown(e, systemRef)}
                        />

                        {/* <div>
                          {errors.ISFreeze && (
                            <b className="error-text">{errors.ISFreeze}</b>
                          )}
                        </div> */}
                      </div>
                      <div style={{ marginTop: "10px", display: "none" }}>
                        <label className="account-label">Is System</label>
                        <input
                          type="checkbox"
                          id="IsSystem"
                          name="IsSystem"
                          checked={IsSystem}
                          onChange={(e) => setIsSystem(e.target.checked)}
                          ref={systemRef}
                          onKeyDown={(e) => handleKeyDown(e, address1Ref)}
                        />

                        {/* <div>
                          {errors.IsSystem && (
                            <b className="error-text">{errors.IsSystem}</b>
                          )}
                        </div> */}
                      </div>
                    </div>

                    {/* Assign Canvassor Section 
                    <Box className="account-form" sx={{ mt: 4 }}>
                      <Typography
                        variant="subtitle1"
                        fontWeight="bold"
                        color="#3c7291"
                        gutterBottom>
                        Assign Options
                      </Typography>

                      <FormControlLabel
                        control={
                          <Checkbox
                            id="isAssigned"
                            name="isAssigned"
                            checked={isAssigned}
                            onChange={(e) => setIsAssigned(e.target.checked)}
                            inputRef={isassignedRef}
                            onKeyDown={(e) => handleKeyDown(e, canvassorRef)}
                          />
                        }
                        label="Assign Canvassor"
                        sx={{ ml: 1 }}
                      />
                    </Box>

                    {isAssigned && (
                      <Box className="account-form" sx={{ mt: 3 }}>
                        <Typography
                          variant="subtitle1"
                          fontWeight="bold"
                          color="#3c7291"
                          gutterBottom>
                          Canvassor
                        </Typography>

                        <TextField
                          id="Canvassor"
                          name="Canvassor"
                          label="Canvassor Name"
                          placeholder="Enter Canvassor Name"
                          variant="outlined"
                          size="small"
                          fullWidth
                          value={Canvassor}
                          onChange={(e) => setCanvassor(e.target.value)}
                          inputRef={canvassorRef}
                          onKeyDown={(e) => handleKeyDown(e, subsidiartRef)}
                          error={!!errors.Canvassor}
                          helperText={errors.Canvassor}
                          sx={{ mt: 1, width: "250px" }}
                        />
                      </Box>
                    )} */}
                  </Grid>

                  {/* Right Section */}
                  <Grid item xs={12} sm={6}>
                    <Typography
                      variant="h5"
                      gutterBottom
                      style={{ color: "#3c7291", fontWeight: "500" }}>
                      Address Details:
                    </Typography>

                    <div style={{ marginTop: "15px" }}>
                      <label
                        onClick={handleLabelClick}
                        style={{ cursor: "pointer", fontWeight: "500" }}>
                        Address<b className="required">*</b>
                      </label>{" "}
                      <br />
                      <div>
                        <Tooltip
                          title={
                            <span
                              style={{
                                fontSize: "14px",
                                fontWeight: "bold",
                              }}>
                              {Address1}
                            </span>
                          }
                          arrow>
                          <input
                            type="text"
                            id="Address1"
                            name="Address1"
                            value={Address1}
                            onChange={(e) => setAddress1(e.target.value)}
                            maxLength={500}
                            ref={address1Ref}
                            onKeyDown={(e) => handleKeyDown(e, address2Ref)}
                            style={{
                              marginRight: "10px",
                              width: "550px",
                              marginTop: "8px ",
                            }}
                            className="account-control"
                            placeholder="Enter Address Line 1"
                          />
                        </Tooltip>
                        {errors.Address1 && (
                          <b className="error-text">{errors.Address1}</b>
                        )}
                      </div>
                    </div>
                    {/* <label
                      style={{
                        color: "teal",
                        marginBottom: "30px",
                        fontWeight: "600",
                      }}>
                      Click on the{" "}
                      <label style={{ color: "red" }}>Address</label> label to
                      show the address fields and add an address.
                    </label> */}
                    {/* {isAddressVisible && (
                      <div className="address-fields">
                        <div>
                          <Tooltip
                            title={
                              <span
                                style={{
                                  fontSize: "14px",
                                  fontWeight: "bold",
                                }}>
                                {Address1}
                              </span>
                            }
                            arrow>
                            <input
                              type="text"
                              id="Address1"
                              name="Address1"
                              value={Address1}
                              onChange={(e) => setAddress1(e.target.value)}
                              maxLength={100}
                              ref={address1Ref}
                              onKeyDown={(e) => handleKeyDown(e, address2Ref)}
                              style={{ marginRight: "10px" }}
                              className="account-control"
                              placeholder="Enter Address Line 1"
                            />
                          </Tooltip>
                          {errors.Address1 && (
                            <b className="error-text">{errors.Address1}</b>
                          )}
                        </div>
                        <div>
                          <Tooltip
                            title={
                              <span
                                style={{
                                  fontSize: "14px",
                                  fontWeight: "bold",
                                }}>
                                {Address2}
                              </span>
                            }
                            arrow>
                            <input
                              type="text"
                              id="Address2"
                              name="Address2"
                              value={Address2}
                              onChange={(e) => setAddress2(e.target.value)}
                              maxLength={100}
                              ref={address2Ref}
                              onKeyDown={(e) => handleKeyDown(e, address3Ref)}
                              style={{ marginRight: "10px" }}
                              className="account-control"
                              placeholder="Enter Address Line 2"
                            />
                          </Tooltip>
                          <div>
                            {errors.Address2 && (
                              <b className="error-text">{errors.Address2}</b>
                            )}
                          </div>
                        </div>
                        <div>
                          <Tooltip
                            title={
                              <span
                                style={{
                                  fontSize: "14px",
                                  fontWeight: "bold",
                                }}>
                                {Address3}
                              </span>
                            }
                            arrow>
                            <input
                              type="text"
                              id="Address3"
                              name="Address3"
                              value={Address3}
                              onChange={(e) => setAddress3(e.target.value)}
                              maxLength={100}
                              ref={address3Ref}
                              onKeyDown={(e) => handleKeyDown(e, countryRef)}
                              style={{ marginRight: "10px" }}
                              className="account-control"
                              placeholder="Enter Address Line 3"
                            />
                          </Tooltip>
                          {errors.Address3 && (
                            <b className="error-text">{errors.Address3}</b>
                          )}
                        </div>
                      </div>
                    )} */}
                    <div className="account-form" style={{ marginTop: "15px" }}>
                      <div>
                        <label className="account-label">
                          Country<b className="required">*</b>
                        </label>
                        <div>
                          <Select
                            id="CountryId"
                            name="CountryId"
                            value={countryOptions.find(
                              (option) => option.value === 1
                            )}
                            onChange={(option) => setCountryId(option.value)}
                            ref={countryRef}
                            onKeyDown={(e) => handleKeyDown(e, stateRef)}
                            options={countryOptions}
                            styles={{
                              control: (base) => ({
                                ...base,
                                width: "170px",
                                marginTop: "10px",
                                borderRadius: "4px",
                                border: "1px solid rgb(223, 222, 222)",
                                marginBottom: "5px",
                              }),
                            }}
                            placeholder="Select country"
                          />
                          <div>
                            {errors.CountryId && (
                              <b className="error-text">{errors.CountryId}</b>
                            )}
                          </div>
                        </div>
                      </div>

                      <div>
                        <label className="account-label">
                          State<b className="required">*</b>
                        </label>
                        <div>
                          <Select
                            id="StateId"
                            name="StateId"
                            value={stateOptions.find(
                              (option) => option.value === StateId
                            )}
                            onChange={(option) => setStateId(option.value)}
                            ref={stateRef}
                            onKeyDown={(e) => handleKeyDown(e, cityRef)}
                            options={stateOptions}
                            styles={{
                              control: (base) => ({
                                ...base,
                                width: "170px",
                                marginTop: "10px",
                                borderRadius: "4px",
                                border: "1px solid rgb(223, 222, 222)",
                                marginBottom: "5px",
                              }),
                            }}
                            placeholder="Select State"
                          />

                          <div>
                            {errors.StateId && (
                              <b className="error-text">{errors.StateId}</b>
                            )}
                          </div>
                        </div>
                      </div>

                      <div>
                        <label className="account-label">
                          City<b className="required">*</b>
                        </label>
                        <div>
                          <Select
                            id="CityId"
                            name="CityId"
                            value={cityOptions.find(
                              (option) => option.value === CityId
                            )}
                            onChange={(option) => setCityId(option.value)}
                            ref={cityRef}
                            onKeyDown={(e) => handleKeyDown(e, areaRef)}
                            options={cityOptions}
                            styles={{
                              control: (base) => ({
                                ...base,
                                width: "170px",
                                marginTop: "10px",
                                borderRadius: "4px",
                                border: "1px solid rgb(223, 222, 222)",
                                marginBottom: "5px",
                              }),
                            }}
                            placeholder="Select City"
                          />

                          <div>
                            {errors.CityId && (
                              <b className="error-text">{errors.CityId}</b>
                            )}
                          </div>
                        </div>
                      </div>

                      <div>
                        <label className="account-label">
                          Area<b className="required">*</b>
                        </label>
                        <div>
                          <Select
                            id="AreaId"
                            name="AreaId"
                            value={areaOptions.find(
                              (option) => option.value === AreaId
                            )}
                            onChange={(option) => setAreaId(option.value)}
                            ref={areaRef}
                            onKeyDown={(e) => handleKeyDown(e, pinRef)}
                            options={areaOptions}
                            styles={{
                              control: (base) => ({
                                ...base,
                                width: "170px",
                                marginTop: "10px",
                                borderRadius: "4px",
                                border: "1px solid rgb(223, 222, 222)",
                                marginBottom: "5px",
                              }),
                            }}
                            placeholder="Select Area"
                          />
                          <div>
                            {errors.AreaId && (
                              <b className="error-text">{errors.AreaId}</b>
                            )}
                          </div>
                        </div>
                      </div>
                      <div>
                        <label className="account-label">
                          Pincode<b className="required">*</b>
                        </label>
                        <div>
                          <input
                            type="text"
                            id="Pincode"
                            name="Pincode"
                            value={Pincode}
                            onChange={(e) => setPincode(e.target.value)}
                            maxLength={6}
                            ref={pinRef}
                            onKeyDown={(e) => handleKeyDown(e, telephoneRef)}
                            className="account-control"
                            placeholder="Enter Pincode"
                          />

                          <div>
                            {errors.Pincode && (
                              <b className="error-text">{errors.Pincode}</b>
                            )}
                          </div>
                        </div>
                      </div>

                      <div>
                        <label className="account-label">
                          Telephone No<b className="required">*</b>
                        </label>
                        <div>
                          <input
                            type="number"
                            id="TelephoneNo"
                            name="TelephoneNo"
                            value={TelephoneNo}
                            onChange={(e) => {
                              const value = e.target.value;
                              if (value.length <= 10) setTelephoneNo(value);
                            }}
                            ref={telephoneRef}
                            onKeyDown={(e) => handleKeyDown(e, mobileRef)}
                            className="account-control"
                            placeholder="Enter Tel No"
                          />

                          <div>
                            {errors.TelephoneNo && (
                              <b className="error-text">{errors.TelephoneNo}</b>
                            )}
                          </div>
                        </div>
                      </div>
                      <div>
                        <label className="account-label">
                          Mobile No<b className="required">*</b>
                        </label>
                        <div>
                          <input
                            type="text"
                            id="MobileNo"
                            name="MobileNo"
                            value={MobileNo}
                            onChange={(e) => setMobileNo(e.target.value)}
                            maxLength={10}
                            ref={mobileRef}
                            onKeyDown={(e) => handleKeyDown(e, faxRef)}
                            className="account-control"
                            placeholder="Enter Mob No"
                          />

                          <div>
                            {errors.MobileNo && (
                              <b className="error-text">{errors.MobileNo}</b>
                            )}
                          </div>
                        </div>
                      </div>
                      <div style={{ display: "none" }}>
                        <label className="account-label">
                          Fax No<b className="required">*</b>
                        </label>
                        <div>
                          <input
                            type="text"
                            id="FaxNo"
                            name="FaxNo"
                            value={FaxNo}
                            onChange={(e) => setFaxNo(e.target.value)}
                            maxLength={10}
                            ref={faxRef}
                            onKeyDown={(e) => handleKeyDown(e, panRef)}
                            className="account-control"
                            placeholder="Enter Fax No"
                          />

                          {/* <div>
                            {errors.FaxNo && (
                              <b className="error-text">{errors.FaxNo}</b>
                            )}
                          </div> */}
                        </div>
                      </div>

                      <div>
                        <label className="account-label">
                          PAN No<b className="required">*</b>
                        </label>
                        <div>
                          <input
                            type="text"
                            id="PANNo"
                            name="PANNo"
                            value={PANNo}
                            onChange={(e) => {
                              const value = e.target.value.toUpperCase();
                              const filtered = value.replace(/[^A-Z0-9]/g, "");
                              setPANNo(filtered);
                            }}
                            // maxLength={25}
                            maxLength={10}
                            ref={panRef}
                            onKeyDown={(e) => handleKeyDown(e, gstRef)}
                            className="account-control"
                            placeholder="Enter Pan No"
                          />

                          <div>
                            {errors.PANNo && (
                              <b className="error-text">{errors.PANNo}</b>
                            )}
                          </div>
                        </div>
                      </div>

                      <div>
                        <label className="account-label">
                          GST No<b className="required">*</b>
                        </label>
                        <div>
                          <input
                            type="text"
                            id="GSTNo"
                            name="GSTNo"
                            value={GSTNo}
                            onChange={(e) => {
                              const value = e.target.value.toUpperCase();
                              const filtered = value.replace(/[^A-Z0-9]/g, "");
                              setGSTNo(filtered);
                            }}
                            maxLength={15}
                            ref={gstRef}
                            onKeyDown={(e) => handleKeyDown(e, emailRef)}
                            className="account-control"
                            placeholder="Enter GST No"
                          />

                          <div>
                            {errors.GSTNo && (
                              <b className="error-text">{errors.GSTNo}</b>
                            )}
                          </div>
                        </div>
                      </div>

                      <div>
                        <label className="account-label">
                          Email Id<b className="required">*</b>
                        </label>
                        <div>
                          <input
                            type="text"
                            id="EmailId"
                            name="EmailId"
                            value={EmailId}
                            onChange={(e) => setEmailId(e.target.value)}
                            maxLength={100}
                            ref={emailRef}
                            onKeyDown={(e) => handleKeyDown(e, tdsRef)}
                            className="account-control"
                            placeholder="Enter EmailId"
                          />

                          <div>
                            {errors.EmailId && (
                              <b className="error-text">{errors.EmailId}</b>
                            )}
                          </div>
                        </div>
                      </div>
                      <div>
                        <label className="account-label">
                          TDS<b className="required">*</b>:
                        </label>
                        <div>
                          <Select
                            id="TDSId"
                            name="TDSId"
                            value={tdsOptions.find(
                              (option) => option.value === TDSId
                            )}
                            onChange={(option) => setTDSId(option.value)}
                            ref={tdsRef}
                            onKeyDown={(e) => handleKeyDown(e, saveRef)}
                            options={tdsOptions}
                            getOptionLabel={(e) => (
                              <div
                                data-tooltip-id={`tooltip-${e.value}`}
                                data-tooltip-content={e.label}>
                                {e.label}
                                <Tooltip id={`tooltip-${e.value}`} />
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
                            }}
                            placeholder="Select TDS id"
                          />
                          <div>
                            {errors.TDSId && (
                              <b className="error-text">{errors.TDSId}</b>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </Grid>
                </Grid>
                <div className="acc-btn-container">
                  <Button
                    onClick={handleSubmit}
                    ref={saveRef}
                    style={{
                      // background: "#3c7291",
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
              </form>
            </Box>
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
              <u>Account</u>
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

export default Accounts;
