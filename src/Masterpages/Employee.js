import React, { useState, useMemo, useEffect, useRef } from "react";
import axios from "axios";
import "./Employee.css";
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
  Autocomplete,
  TextField,
} from "@mui/material";

import Select from "react-select";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { RiDeleteBin5Line } from "react-icons/ri";
import { Tooltip } from "@mui/material";

function Employee() {
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

    fetchEmployees();
  }, []);

  const [pageIndex, setPageIndex] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const [employees, setEmployees] = useState([]);
  const [publications, setPublications] = useState([]);
  const [EmployeeCode, setEmployeeCode] = useState("");
  const [EmployeeName, setEmployeeName] = useState("");
  const [CompanyCode, setCompanyCode] = useState("");
  const [Title, setTitle] = useState("");
  const [LastName, setLastName] = useState("");
  const [FirstName, setFirstName] = useState("");
  const [MiddleName, setMiddleName] = useState("");
  const [CategoryCode, setCategoryCode] = useState("");
  const [Address, setAddress] = useState("");
  const [JoiningDate, setJoiningDate] = useState("");
  const [DOB, setDOB] = useState("");
  const [BasicPay, setBasicPay] = useState("");
  const [PFApplicable, setPFApplicable] = useState(false);
  const [PFAccountNo, setPFAccountNo] = useState("");
  const [PFNominee, setPFNominee] = useState("");
  const [NomineeRelation, setNomineeRelation] = useState("");
  const [AccountStatus, setAccountStatus] = useState("");
  const [StatusDate, setStatusDate] = useState("");
  const [Qualification, setQualification] = useState("");
  const [GroupCode, setGroupCode] = useState("");
  const [PhoneNo, setPhoneNo] = useState("");
  const [DayGroup, setDayGroup] = useState("");
  const [DutyHours, setDutyHours] = useState("");
  const [PayDays, setPayDays] = useState("");
  const [P_Tax, setP_Tax] = useState(false);
  const [BonusAmount, setBonusAmount] = useState("");
  const [SalaryAccountCode, setSalaryAccountCode] = useState("");
  const [AdvanceAccountCode, setAdvanceAccountCode] = useState("");
  const [CashBankAccountCode, setCashBankAccountCode] = useState("");
  const [FirmSalaryAccountCode, setFirmSalaryAccountCode] = useState("");
  const [PF_JoinDate, setPF_JoiningDate] = useState("");
  const [ESI_Flag, setESI_Flag] = useState(false);
  const [Allowance, setAllowance] = useState("");
  const [UAN_No, setUAN_No] = useState("");
  const [ESI_No, setESI_No] = useState("");

  const [editingIndex, setEditingIndex] = useState(-1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [id, setId] = useState("");
  const [errors, setErrors] = useState("");
  const [deleteId, setDeleteId] = useState(null);

  // Confirmation Dialog state
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [deleteIndex, setDeleteIndex] = useState(null);

  const empcodeRef = useRef(null);

  const empnameRef = useRef(null);
  const compcodeRef = useRef(null);
  const titleRef = useRef(null);

  const lastnameRef = useRef(null);
  const firstnameRef = useRef(null);
  const midnameRef = useRef(null);
  const catcodeRef = useRef(null);
  const addressRef = useRef(null);
  const joiningdateRef = useRef(null);
  const dobRef = useRef(null);
  const basicpayRef = useRef(null);
  const pfappRef = useRef(null);
  const pfaccRef = useRef(null);
  const pfnomineeRef = useRef(null);
  const pfnomineeRelRef = useRef(null);
  const accstsRef = useRef(null);
  const statusdateRef = useRef(null);
  const qualRef = useRef(null);
  const grpcodeRef = useRef(null);
  const phoneRef = useRef(null);
  const daygrpRef = useRef(null);
  const dutyhoursRef = useRef(null);
  const paydaysRef = useRef(null);

  const ptaxRef = useRef(null);

  const bonusamtRef = useRef(null);
  const salaccRef = useRef(null);
  const advaccRef = useRef(null);
  const cashbackaccRef = useRef(null);
  const firmsalaccRef = useRef(null);

  const pfjoiningRef = useRef(null);

  const esiflagRef = useRef(null);
  const allowRef = useRef(null);

  const uannoRef = useRef(null);
  const esinoRef = useRef(null);
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
    fetchEmployees();
    console.log("this function is called");
  }, [pageIndex]); // Fetch data when page changes

  const fetchEmployees = async () => {
    try {
      const response = await axios.get(
        `https://publication.microtechsolutions.net.in/php/get/gettblpage.php?Table=EmployeeMaster&PageNo=${pageIndex}`
      );
      // setSellschallans(response.data);
      console.log(response.data, "response of Employee");

      setEmployees(response.data.data);
      setTotalPages(response.data.total_pages);
    } catch (error) {
      // toast.error("Error fetching employee:", error);
    }
  };

  useEffect(() => {
    fetchPublications();
  }, []);

  const fetchPublications = async () => {
    try {
      const response = await axios.get(
        "https://publication.microtechsolutions.net.in/php/Publicationget.php"
      );
      const publications = response.data.map((pub) => ({
        value: pub.Id,
        label: pub.PublicationCode,
      }));
      setPublications(publications);
    } catch (error) {
      // toast.error("Error fetching publications:", error);
    }
  };

  const resetForm = () => {
    setEmployeeCode("");
    setEmployeeName("");
    setCompanyCode("");
    setTitle("");
    setLastName("");
    setFirstName("");
    setMiddleName("");
    setCategoryCode("");
    setAddress("");
    setJoiningDate("");
    setDOB("");
    setBasicPay("");
    setPFApplicable("");
    setPFAccountNo("");
    setPFNominee("");
    setAccountStatus("");
    setStatusDate("");
    setQualification("");
    setGroupCode("");
    setPhoneNo("");
    setDayGroup("");
    setDutyHours("");
    setPayDays("");
    setP_Tax("");
    setBonusAmount("");
    setSalaryAccountCode("");
    setAdvanceAccountCode("");
    setCashBankAccountCode("");
    setFirmSalaryAccountCode("");
    setPF_JoiningDate("");
    setESI_Flag();
    setUAN_No("");
    setESI_No("");
    setAllowance("");
    setNomineeRelation("");
  };

  const handleNewClick = () => {
    resetForm();
    setIsModalOpen(true);
    setEditingIndex(-1);
  };

  const convertDateForInput = (dateStr) => {
    if (dateStr) {
      // Convert the full date string to a Date object
      const date = new Date(dateStr);

      // Ensure that the date is valid
      if (isNaN(date.getTime())) {
        return ""; // Return empty string if invalid date
      }

      // Format the date as YYYY-MM-DD for input fields (required format)
      const year = date.getFullYear();
      const month = (date.getMonth() + 1).toString().padStart(2, "0");
      const day = date.getDate().toString().padStart(2, "0");
      return `${year}-${month}-${day}`;
    }
    return ""; // Return empty string if no valid date
  };

  const handleEdit = (row) => {
    const emp = employees[row.index];

    setEmployeeCode(emp.EmployeeCode);
    setEmployeeName(emp.EmployeeName);
    setCompanyCode(emp.CompanyCode);
    setTitle(emp.Title);
    setLastName(emp.LastName);
    setFirstName(emp.FirstName);
    setMiddleName(emp.MiddleName);
    setCategoryCode(emp.CategoryCode);
    setAddress(emp.Address);
    setBasicPay(emp.BasicPay);
    setPFApplicable(emp.PFApplicable);
    setPFAccountNo(emp.PFAccountNo);
    setPFNominee(emp.PFNominee);
    setNomineeRelation(emp.NomineeRelation);
    setAccountStatus(emp.AccountStatus);
    setQualification(emp.Qualification);
    setGroupCode(emp.GroupCode);
    setPhoneNo(emp.PhoneNo);
    setDayGroup(emp.DayGroup);
    setDutyHours(emp.DutyHours);
    setPayDays(emp.PayDays);
    setP_Tax(emp.P_Tax);
    setBonusAmount(emp.BonusAmount);
    setSalaryAccountCode(emp.SalaryAccountCode);
    setAdvanceAccountCode(emp.AdvanceAccountCode);
    setCashBankAccountCode(emp.CashBankAccountCode);
    setFirmSalaryAccountCode(emp.FirmSalaryAccountCode);
    setESI_Flag(emp.ESI_Flag);
    setAllowance(emp.Allowance);
    setUAN_No(emp.UAN_No);
    setESI_No(emp.ESI_No);

    // Convert and set the date fields
    setJoiningDate(
      emp.JoiningDate ? convertDateForInput(emp.JoiningDate.date) : ""
    );
    setDOB(emp.DOB ? convertDateForInput(emp.DOB.date) : "");
    setPF_JoiningDate(
      emp.JoiningDate ? convertDateForInput(emp.PF_JoinDate.date) : ""
    );
    setStatusDate(
      emp.StatusDate ? convertDateForInput(emp.StatusDate.date) : ""
    );

    setEditingIndex(row.index);
    setIsModalOpen(true);
    setIsEditing(true);
    setId(emp.Id);
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
      "https://publication.microtechsolutions.net.in/php/Employeemasterdelete.php",
      requestOptions
    )
      .then((response) => response.text())
      .then((result) => console.log(result))
      .catch((error) => console.error(error));
    toast.success("Employee Deleted Successfully");
    setIsDeleteDialogOpen(false);
    fetchEmployees();
  };

  const cancelDelete = () => {
    setIsDeleteDialogOpen(false);
    setDeleteIndex(null);
  };

  const validateForm = () => {
    let formErrors = {};
    let isValid = true;

    // if (!EmployeeCode) {
    //   formErrors.EmployeeCode = "Employee Code is required";
    //   isValid = false;
    // }

    if (!EmployeeName) {
      formErrors.EmployeeName = "Employee Name is required";
      isValid = false;
    }

    if (!CompanyCode) {
      formErrors.CompanyCode = "Company Code is required";
      isValid = false;
    }
    // if (!Title) {
    //   formErrors.Title ="Title is required";
    //   isValid = false;
    // }

    // if (!LastName) {
    //   formErrors.LastName ="Last Name is required";
    //   isValid = false;
    // }

    // if (!FirstName) {
    //   formErrors.FirstName ="First Name is required";
    //   isValid = false;

    // }

    // if (!MiddleName) {
    //   formErrors.MiddleName ="Middle Name is required";
    //   isValid = false;

    // }

    // if (!CategoryCode) {
    //   formErrors.CategoryCode ="Category Code is required";
    //   isValid = false;

    // }

    // if (!Address) {
    //   formErrors.Address ="Address is required";
    //   isValid = false;

    // }

    if (!JoiningDate) {
      formErrors.JoiningDate = "Joining Date is required";
      isValid = false;
    }

    if (!DOB) {
      formErrors.DOB = "DOB is required";
      isValid = false;
    }
    // if (!BasicPay) {
    //   formErrors.BasicPay ="Basic Pay is required";
    //   isValid = false;

    // }

    // if (!PFAccountNo) {
    //   formErrors.PFAccountNo ="PF Account No is required";
    //   isValid = false;

    // }

    // if (!PFNominee) {
    //   formErrors.PFNominee ="PF Nominee is required";
    //   isValid = false;

    // }

    if (!AccountStatus) {
      formErrors.AccountStatus = "Acc Status is required";
      isValid = false;
    }

    if (!StatusDate) {
      formErrors.StatusDate = "Status Date is required";
      isValid = false;
    }

    // if (!Qualification) {
    //   formErrors.Qualification ="Qualification is required";
    //   isValid = false;

    // }

    // if (!GroupCode) {
    //   formErrors.GroupCode ="Group Code is required";
    //   isValid = false;

    // }
    // if (!PhoneNo) {
    //   formErrors.PhoneNo ="Phone No is required";
    //   isValid = false;

    // }

    if (!DayGroup) {
      formErrors.DayGroup = "Day Group is required";
      isValid = false;
    }

    if (!DutyHours) {
      formErrors.DutyHours = "Duty Hours is required";
      isValid = false;
    }

    // if (!PayDays) {
    //   formErrors.PayDays ="Pay Days is required";
    //   isValid = false;

    // }

    if (!BonusAmount) {
      formErrors.BonusAmount = "Bonus Amount is required";
      isValid = false;
    }

    if (!SalaryAccountCode) {
      formErrors.SalaryAccountCode = "Salary Acc Code is required";
      isValid = false;
    }

    if (!AdvanceAccountCode) {
      formErrors.AdvanceAccountCode = "Advance acc code is required";
      isValid = false;
    }

    if (!CashBankAccountCode) {
      formErrors.CashBankAccountCode = "Cashbank Acc code is required";
      isValid = false;
    }

    if (!FirmSalaryAccountCode) {
      formErrors.FirmSalaryAccountCode = "Firm salary Acc code is required";
      isValid = false;
    }
    if (!PF_JoinDate) {
      formErrors.PF_JoinDate = "PF Join Date is required";
      isValid = false;
    }

    // if (!Allowance) {
    //   formErrors.Allowance ="Allowance is required";
    //   isValid = false;

    // }

    // if (!UAN_No) {
    //   formErrors.UAN_No ="UAN No is required";
    //   isValid = false;

    // }

    // if (!ESI_No) {
    //   formErrors.ESI_No ="ESI No is required";
    //   isValid = false;

    // }

    setErrors(formErrors);
    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent the default form submission
    // if (!validateForm()) return;

    const data = {
      EmployeeCode: EmployeeCode,
      EmployeeName: EmployeeName,
      CompanyCode: CompanyCode,
      Title: Title,
      LastName: LastName,
      FirstName: FirstName,
      MiddleName: MiddleName,
      CategoryCode: CategoryCode,
      Address: Address,
      JoiningDate: JoiningDate,
      DOB: DOB,
      BasicPay: BasicPay,
      PFApplicable: PFApplicable,
      PFAccountNo: PFAccountNo,
      PFNominee: PFNominee,
      NomineeRelation: NomineeRelation,
      AccountStatus: AccountStatus,
      StatusDate: StatusDate,
      Qualification: Qualification,
      GroupCode: GroupCode,
      PhoneNo: PhoneNo,
      DayGroup: DayGroup,
      DutyHours: DutyHours,
      PayDays: PayDays,
      P_Tax: P_Tax,
      BonusAmount: BonusAmount,
      SalaryAccountCode: SalaryAccountCode,
      AdvanceAccountCode: AdvanceAccountCode,
      CashBankAccountCode: CashBankAccountCode,
      FirmSalaryAccountCode: FirmSalaryAccountCode,
      PF_JoinDate: PF_JoinDate,
      ESI_Flag: ESI_Flag,
      Allowance: Allowance,
      UAN_No: UAN_No,
      ESI_No: ESI_No,
      CreatedBy: userId,
    };

    const url = isEditing
      ? "https://publication.microtechsolutions.net.in/php/Employeemasterupdate.php"
      : "https://publication.microtechsolutions.net.in/php/Employeemasterpost.php";

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
        toast.success("Employee updated successfully!");
      } else {
        toast.success("Employee added successfully!");
      }
      setIsModalOpen(false);
      resetForm();
      fetchEmployees(); // Refresh the list after submit
    } catch (error) {
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
        accessorKey: "EmployeeCode",
        header: "Employee Code",
        size: 50,
      },
      {
        accessorKey: "EmployeeName",
        header: "Employee Name",
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
    [employees]
  );

  const table = useMaterialReactTable({
    columns,
    data: employees,
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
    <div className="employee-container">
      <h1>Employee Master</h1>

      <div className="employeetable-master">
        <div className="employeetable1-master">
          <Button
            onClick={handleNewClick}
            style={{
              color: "#FFFF",
              fontWeight: "700",
              background: "#0a60bd",
              width: "15%",
            }}>
            {" "}
            New
          </Button>
          <div className="employeetable-container">
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
            className="employee-overlay"
            onClick={() => setIsModalOpen(false)}
          />
        )}

        <Modal open={isModalOpen}>
          <div className="employee-modal">
            <h2
              style={{
                textAlign: "center",
                fontWeight: "620",
                margin: "2px",
                fontSize: "27px",
              }}>
              {editingIndex >= 0 ? "Edit Employee" : "Add Employee"}
            </h2>
            <form className="employee-form">
              <h3 className="empsection-title">Employee Details</h3>
              <div className="employee-section">
                {/* EmployeeCode, EmployeeName, CompanyCode, Title, LastName, FirstName, MiddleName */}
                <div>
                  <label className="employee-label">
                    Employee Code<b className="required">*</b>
                  </label>
                  <div>
                    <input
                      type="number"
                      id="EmployeeCode"
                      name="EmployeeCode"
                      value={EmployeeCode}
                      onChange={(e) => setEmployeeCode(e.target.value)}
                      maxLength={20}
                      ref={empcodeRef}
                      onKeyDown={(e) => handleKeyDown(e, empnameRef)}
                      style={{ background: "	#D0D0D0" }}
                      placeholder="Auto-Incremented"
                      className="employee-control"
                      readOnly
                    />

                    {/* <div>
                      {errors.EmployeeCode && (
                        <b className="error-text">{errors.EmployeeCode}</b>
                      )}
                    </div> */}
                  </div>
                </div>
                <div>
                  <label className="employee-label">
                    Employee Name<b className="required">*</b>
                  </label>
                  <div>
                    <Tooltip
                      title={
                        <span style={{ fontSize: "14px", fontWeight: "bold" }}>
                          {EmployeeName}
                        </span>
                      }
                      arrow>
                      <input
                        type="text"
                        id="EmployeeName"
                        name="EmployeeName"
                        value={EmployeeName}
                        onChange={(e) => setEmployeeName(e.target.value)}
                        maxLength={50}
                        ref={empnameRef}
                        onKeyDown={(e) => handleKeyDown(e, compcodeRef)}
                        placeholder="Enter Employee name"
                        className="employee-control"
                      />
                    </Tooltip>

                    {/* <div>
                      {errors.EmployeeName && (
                        <b className="error-text">{errors.EmployeeName}</b>
                      )}
                    </div> */}
                  </div>
                </div>
                <div>
                  <label className="employee-label">
                    Company Code<b className="required">*</b>
                  </label>
                  <div>
                    {/* <input
                      type="number"
                      id="CompanyCode"
                      name="CompanyCode"
                      value={CompanyCode}
                      onChange={(e) => setCompanyCode(e.target.value)}
                      maxLength={20}
                      ref={compcodeRef}
                      onKeyDown={(e) => handleKeyDown(e, qualRef)}
                      placeholder="Enter Company Code"
                      className="employee-control"
                    /> */}
                    <Autocomplete
                      options={publications} // comes from your fetchPublications function
                      getOptionLabel={(option) => option.label}
                      value={
                        publications.find(
                          (option) => option.value === CompanyCode
                        ) || null
                      }
                      onChange={(e, newValue) =>
                        setCompanyCode(newValue ? newValue.value : "")
                      }
                      sx={{ marginTop: "10px" }}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          placeholder="Select Company Code"
                          size="small"
                          className="employee-control"
                          inputRef={compcodeRef}
                          onKeyDown={(e) => handleKeyDown(e, qualRef)}
                          error={!!errors.CompanyCode}
                          helperText={errors.CompanyCode}
                        />
                      )}
                      isOptionEqualToValue={(option, value) =>
                        option.value === value.value
                      }
                    />
                    {/* <div>
                      {errors.CompanyCode && (
                        <b className="error-text">{errors.CompanyCode}</b>
                      )}
                    </div> */}
                  </div>
                </div>{" "}
                <div>
                  <label className="employee-label">Qualification</label>
                  <div>
                    <input
                      type="text"
                      id="Qualification"
                      name="Qualification"
                      value={Qualification}
                      onChange={(e) => setQualification(e.target.value)}
                      maxLength={50}
                      ref={qualRef}
                      onKeyDown={(e) => handleKeyDown(e, titleRef)}
                      placeholder="Enter Qualification"
                      className="employee-control"
                    />

                    {/* <div>
                    {errors.Qualification && <b className="error-text">{errors.Qualification}</b>}
                      </div>  */}
                  </div>
                </div>{" "}
                <div>
                  <label className="employee-label">Title</label>
                  <div>
                    <Tooltip
                      title={
                        <span style={{ fontSize: "14px", fontWeight: "bold" }}>
                          {Title}
                        </span>
                      }
                      arrow>
                      <input
                        type="text"
                        id="Title"
                        name="Title"
                        value={Title}
                        onChange={(e) => setTitle(e.target.value)}
                        maxLength={50}
                        ref={titleRef}
                        onKeyDown={(e) => handleKeyDown(e, lastnameRef)}
                        placeholder="Enter Title"
                        className="employee-control"
                      />
                    </Tooltip>

                    {/* <div>
                      {errors.Title && (
                        <b className="error-text">{errors.Title}</b>
                      )}
                    </div> */}
                  </div>
                </div>{" "}
                <div>
                  <label className="employee-label">Last Name</label>
                  <div>
                    <Tooltip
                      title={
                        <span style={{ fontSize: "14px", fontWeight: "bold" }}>
                          {LastName}
                        </span>
                      }
                      arrow>
                      <input
                        type="text"
                        id="LastName"
                        name="LastName"
                        value={LastName}
                        onChange={(e) => setLastName(e.target.value)}
                        maxLength={50}
                        ref={lastnameRef}
                        onKeyDown={(e) => handleKeyDown(e, firstnameRef)}
                        placeholder="Enter Last Name"
                        className="employee-control"
                      />
                    </Tooltip>

                    {/* <div>
                      {errors.LastName && (
                        <b className="error-text">{errors.LastName}</b>
                      )}
                    </div> */}
                  </div>
                </div>
                <div>
                  <label className="employee-label">First Name</label>
                  <div>
                    <Tooltip
                      title={
                        <span style={{ fontSize: "14px", fontWeight: "bold" }}>
                          {FirstName}
                        </span>
                      }
                      arrow>
                      <input
                        type="text"
                        id="FirstName"
                        name="FirstName"
                        value={FirstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        maxLength={50}
                        ref={firstnameRef}
                        onKeyDown={(e) => handleKeyDown(e, midnameRef)}
                        placeholder="Enter First Name"
                        className="employee-control"
                      />
                    </Tooltip>

                    {/* <div>
                      {errors.FirstName && (
                        <b className="error-text">{errors.FirstName}</b>
                      )}
                    </div> */}
                  </div>
                </div>
                <div>
                  <label className="employee-label">Middle Name</label>
                  <div>
                    <Tooltip
                      title={
                        <span style={{ fontSize: "14px", fontWeight: "bold" }}>
                          {MiddleName}
                        </span>
                      }
                      arrow>
                      <input
                        type="text"
                        id="MiddleName"
                        name="MiddleName"
                        value={MiddleName}
                        onChange={(e) => setMiddleName(e.target.value)}
                        maxLength={50}
                        ref={midnameRef}
                        onKeyDown={(e) => handleKeyDown(e, catcodeRef)}
                        placeholder="Enter Middle name"
                        className="employee-control"
                      />
                    </Tooltip>

                    {/* <div>
                      {errors.MiddleName && (
                        <b className="error-text">{errors.MiddleName}</b>
                      )}
                    </div> */}
                  </div>
                </div>{" "}
              </div>
              <h3 className="empsection-title">Address & Personal Info</h3>
              <div className="employee-section">
                {/* CategoryCode, Address, JoiningDate, DOB, PhoneNo, DayGroup */}
                <div>
                  <label className="employee-label">Category Code</label>
                  <div>
                    <input
                      type="text"
                      id="CategoryCode"
                      name="CategoryCode"
                      value={CategoryCode}
                      onChange={(e) => setCategoryCode(e.target.value)}
                      maxLength={50}
                      ref={catcodeRef}
                      onKeyDown={(e) => handleKeyDown(e, addressRef)}
                      placeholder="Enter Category Code"
                      className="employee-control"
                    />

                    {/* <div>
                      {errors.CategoryCode && (
                        <b className="error-text">{errors.CategoryCode}</b>
                      )}
                    </div> */}
                  </div>
                </div>{" "}
                <div>
                  <label className="employee-label">Address</label>
                  <div>
                    <Tooltip
                      title={
                        <span style={{ fontSize: "14px", fontWeight: "bold" }}>
                          {Address}
                        </span>
                      }
                      arrow>
                      <input
                        type="text"
                        id="Address"
                        name="Address"
                        value={Address}
                        onChange={(e) => setAddress(e.target.value)}
                        maxLength={50}
                        ref={addressRef}
                        onKeyDown={(e) => handleKeyDown(e, joiningdateRef)}
                        placeholder="Enter Address"
                        className="employee-control"
                      />
                    </Tooltip>

                    {/* <div>
                      {errors.Address && (
                        <b className="error-text">{errors.Address}</b>
                      )}
                    </div> */}
                  </div>
                </div>{" "}
                <div>
                  <label className="employee-label">
                    Joining Date<b className="required">*</b>
                  </label>
                  <div>
                    <input
                      type="date"
                      id="JoiningDate"
                      name="JoiningDate"
                      value={JoiningDate}
                      onChange={(e) => setJoiningDate(e.target.value)}
                      ref={joiningdateRef}
                      onKeyDown={(e) => handleKeyDown(e, dobRef)}
                      placeholder="Enter Joining Date"
                      className="employee-control"
                    />

                    {/* <div>
                      {errors.JoiningDate && (
                        <b className="error-text">{errors.JoiningDate}</b>
                      )}
                    </div> */}
                  </div>
                </div>{" "}
                <div>
                  <label className="employee-label">
                    DOB<b className="required">*</b>
                  </label>
                  <div>
                    <input
                      type="date"
                      id="DOB"
                      name="DOB"
                      value={DOB}
                      onChange={(e) => setDOB(e.target.value)}
                      maxLength={50}
                      ref={dobRef}
                      onKeyDown={(e) => handleKeyDown(e, phoneRef)}
                      placeholder="Enter DOB"
                      className="employee-control"
                    />

                    {/* <div>
                      {errors.DOB && <b className="error-text">{errors.DOB}</b>}
                    </div> */}
                  </div>
                </div>{" "}
              </div>
              <div>
                <label className="employee-label">Phone No</label>
                <div>
                  <input
                    type="number"
                    id="PhoneNo"
                    name="PhoneNo"
                    value={PhoneNo}
                    onChange={(e) => setPhoneNo(e.target.value)}
                    maxLength={15}
                    ref={phoneRef}
                    onKeyDown={(e) => handleKeyDown(e, daygrpRef)}
                    placeholder="Enter Phone No"
                    className="employee-control"
                  />

                  {/* <div>
                    {errors.PhoneNo && <b className="error-text">{errors.PhoneNo}</b>}
                      </div>  */}
                </div>
              </div>{" "}
              <div>
                <label className="employee-label">Day group</label>
                <div>
                  <input
                    type="text"
                    id="DayGroup"
                    name="DayGroup"
                    value={DayGroup}
                    onChange={(e) => setDayGroup(e.target.value)}
                    maxLength={1}
                    ref={daygrpRef}
                    onKeyDown={(e) => handleKeyDown(e, pfappRef)}
                    placeholder="Enter Day Group"
                    className="employee-control"
                  />

                  {/* <div>
                    {errors.DayGroup && (
                      <b className="error-text">{errors.DayGroup}</b>
                    )}
                  </div> */}
                </div>
              </div>{" "}
              <h3 className="empsection-title">PF Details</h3>
              <div className="employee-section">
                <div>
                  <label className="employee-label">PF Applicable</label>
                  <div>
                    <input
                      type="checkbox"
                      id="PFApplicable"
                      name="PFApplicable"
                      checked={PFApplicable}
                      onChange={(e) => setPFApplicable(e.target.checked)}
                      ref={pfappRef}
                      onKeyDown={(e) => handleKeyDown(e, pfnomineeRef)}
                      style={{
                        marginLeft: "20px",
                        marginTop: "20px",
                        marginBottom: "15px",
                      }}
                    />
                  </div>
                </div>

                <div style={{ display: "none" }}>
                  <label className="employee-label">PF Account No</label>
                  <input
                    type="number"
                    id="PFAccountNo"
                    name="PFAccountNo"
                    value={PFAccountNo}
                    onChange={(e) => setPFAccountNo(e.target.value)}
                    maxLength={50}
                    ref={pfaccRef}
                    onKeyDown={(e) => handleKeyDown(e, pfnomineeRef)}
                    placeholder="Enter Account No"
                    className="employee-control"
                  />
                </div>

                <div>
                  <label className="employee-label">PF Nominee</label>
                  <input
                    type="text"
                    id="PFNominee"
                    name="PFNominee"
                    value={PFNominee}
                    onChange={(e) => setPFNominee(e.target.value)}
                    maxLength={50}
                    ref={pfnomineeRef}
                    onKeyDown={(e) => handleKeyDown(e, pfnomineeRelRef)}
                    placeholder="Enter PF Nominee"
                    className="employee-control"
                  />
                </div>

                <div>
                  <label className="employee-label">PF Nominee Relation</label>
                  <input
                    type="text"
                    id="NomineeRelation"
                    name="NomineeRelation"
                    value={NomineeRelation}
                    onChange={(e) => setNomineeRelation(e.target.value)}
                    maxLength={50}
                    ref={pfnomineeRelRef}
                    onKeyDown={(e) => handleKeyDown(e, pfjoiningRef)}
                    placeholder="Enter PF Nominee Relation"
                    className="employee-control"
                  />
                </div>

                <div>
                  <label className="employee-label">PF Joining Date</label>
                  <input
                    type="date"
                    id="PF_JoinDate"
                    name="PF_JoinDate"
                    value={PF_JoinDate}
                    onChange={(e) => setPF_JoiningDate(e.target.value)}
                    ref={pfjoiningRef}
                    onKeyDown={(e) => handleKeyDown(e, uannoRef)}
                    className="employee-control"
                  />
                </div>

                <div>
                  <label className="employee-label">UAN No</label>
                  <input
                    type="text"
                    id="UAN_No"
                    name="UAN_No"
                    value={UAN_No}
                    onChange={(e) => setUAN_No(e.target.value)}
                    maxLength={20}
                    ref={uannoRef}
                    onKeyDown={(e) => handleKeyDown(e, esinoRef)}
                    placeholder="Enter UAN No"
                    className="employee-control"
                  />
                </div>

                <div>
                  <label className="employee-label">ESI No</label>
                  <input
                    type="number"
                    id="ESI_No"
                    name="ESI_No"
                    value={ESI_No}
                    onChange={(e) => setESI_No(e.target.value)}
                    maxLength={20}
                    ref={esinoRef}
                    onKeyDown={(e) => handleKeyDown(e, esiflagRef)}
                    placeholder="Enter ESI No"
                    className="employee-control"
                  />
                </div>

                <div>
                  <label className="employee-label">ESI Flag</label>
                  <div>
                    <input
                      type="checkbox"
                      id="ESI_Flag"
                      name="ESI_Flag"
                      checked={ESI_Flag}
                      onChange={(e) => setESI_Flag(e.target.checked)}
                      ref={esiflagRef}
                      onKeyDown={(e) => handleKeyDown(e, basicpayRef)}
                      style={{
                        marginLeft: "20px",
                        marginTop: "20px",
                        marginBottom: "15px",
                      }}
                    />
                  </div>
                </div>
              </div>
              <h3 className="empsection-title">Salary & Account Details</h3>
              <div className="employee-section">
                <div>
                  <label className="employee-label">Basic Pay</label>
                  <input
                    type="number"
                    id="BasicPay"
                    name="BasicPay"
                    value={BasicPay}
                    onChange={(e) => setBasicPay(e.target.value)}
                    maxLength={20}
                    ref={basicpayRef}
                    onKeyDown={(e) => handleKeyDown(e, dutyhoursRef)}
                    placeholder="Enter Basic Pay"
                    className="employee-control"
                  />
                </div>

                <div>
                  <label className="employee-label">Duty Hours</label>
                  <input
                    type="number"
                    id="DutyHours"
                    name="DutyHours"
                    value={DutyHours}
                    onChange={(e) => setDutyHours(e.target.value)}
                    ref={dutyhoursRef}
                    onKeyDown={(e) => handleKeyDown(e, paydaysRef)}
                    placeholder="Enter Duty Hours"
                    className="employee-control"
                  />
                </div>

                <div>
                  <label className="employee-label">Pay Days</label>
                  <input
                    type="number"
                    id="PayDays"
                    name="PayDays"
                    value={PayDays}
                    onChange={(e) => setPayDays(e.target.value)}
                    ref={paydaysRef}
                    onKeyDown={(e) => handleKeyDown(e, ptaxRef)}
                    className="employee-control"
                  />
                </div>

                <div>
                  <label className="employee-label">P_Tax</label>
                  <div>
                    <input
                      type="checkbox"
                      id="P_Tax"
                      name="P_Tax"
                      checked={P_Tax}
                      onChange={(e) => setP_Tax(e.target.checked)}
                      ref={ptaxRef}
                      onKeyDown={(e) => handleKeyDown(e, salaccRef)}
                      style={{
                        marginLeft: "20px",
                        marginTop: "20px",
                        marginBottom: "15px",
                      }}
                    />
                  </div>
                </div>

                <div style={{ display: "none" }}>
                  <label className="employee-label">Bonus Amount</label>
                  <input
                    type="number"
                    id="BonusAmount"
                    name="BonusAmount"
                    value={BonusAmount}
                    onChange={(e) => setBonusAmount(e.target.value)}
                    ref={bonusamtRef}
                    onKeyDown={(e) => handleKeyDown(e, salaccRef)}
                    className="employee-control"
                  />
                </div>

                <div>
                  <label className="employee-label">Salary Account Code</label>
                  <input
                    type="number"
                    id="SalaryAccountCode"
                    name="SalaryAccountCode"
                    value={SalaryAccountCode}
                    onChange={(e) => setSalaryAccountCode(e.target.value)}
                    ref={salaccRef}
                    onKeyDown={(e) => handleKeyDown(e, advaccRef)}
                    className="employee-control"
                  />
                </div>

                <div>
                  <label className="employee-label">Advance Account Code</label>
                  <input
                    type="number"
                    id="AdvanceAccountCode"
                    name="AdvanceAccountCode"
                    value={AdvanceAccountCode}
                    onChange={(e) => setAdvanceAccountCode(e.target.value)}
                    ref={advaccRef}
                    onKeyDown={(e) => handleKeyDown(e, cashbackaccRef)}
                    className="employee-control"
                  />
                </div>

                <div>
                  <label className="employee-label">
                    Cash Bank Account Code
                  </label>
                  <input
                    type="number"
                    id="CashBankAccountCode"
                    name="CashBankAccountCode"
                    value={CashBankAccountCode}
                    onChange={(e) => setCashBankAccountCode(e.target.value)}
                    ref={cashbackaccRef}
                    onKeyDown={(e) => handleKeyDown(e, firmsalaccRef)}
                    className="employee-control"
                  />
                </div>

                <div>
                  <label className="employee-label">
                    Firm Salary Account Code
                  </label>
                  <input
                    type="number"
                    id="FirmSalaryAccountCode"
                    name="FirmSalaryAccountCode"
                    value={FirmSalaryAccountCode}
                    onChange={(e) => setFirmSalaryAccountCode(e.target.value)}
                    ref={firmsalaccRef}
                    onKeyDown={(e) => handleKeyDown(e, allowRef)}
                    className="employee-control"
                  />
                </div>

                <div>
                  <label className="employee-label">Allowance</label>
                  <input
                    type="number"
                    id="Allowance"
                    name="Allowance"
                    value={Allowance}
                    onChange={(e) => setAllowance(e.target.value)}
                    ref={allowRef}
                    onKeyDown={(e) => handleKeyDown(e, statusdateRef)}
                    className="employee-control"
                  />
                </div>
              </div>
              <div style={{ display: "none" }}>
                <label className="employee-label">
                  Account Status<b className="required">*</b>
                </label>
                <div>
                  <input
                    type="text"
                    id="AccountStatus"
                    name="AccountStatus"
                    value={AccountStatus}
                    onChange={(e) => setAccountStatus(e.target.value)}
                    maxLength={1}
                    ref={accstsRef}
                    onKeyDown={(e) => handleKeyDown(e, statusdateRef)}
                    placeholder="Enter Account Status"
                    className="employee-control"
                  />

                  {/* <div>
                    {errors.AccountStatus && (
                      <b className="error-text">{errors.AccountStatus}</b>
                    )}
                  </div> */}
                </div>
              </div>{" "}
              <div>
                <label className="employee-label">
                  Status Date<b className="required">*</b>
                </label>
                <div>
                  <input
                    type="date"
                    id="StatusDate"
                    name="StatusDate"
                    value={StatusDate}
                    onChange={(e) => setStatusDate(e.target.value)}
                    maxLength={50}
                    ref={statusdateRef}
                    onKeyDown={(e) => handleKeyDown(e, grpcodeRef)}
                    placeholder="Enter Status Date"
                    className="employee-control"
                  />

                  {/* <div>
                    {errors.StatusDate && (
                      <b className="error-text">{errors.StatusDate}</b>
                    )}
                  </div> */}
                </div>
              </div>{" "}
              <div>
                <label className="employee-label">Group Code</label>
                <div>
                  <input
                    type="text"
                    id="GroupCode"
                    name="GroupCode"
                    value={GroupCode}
                    onChange={(e) => setGroupCode(e.target.value)}
                    maxLength={1}
                    ref={grpcodeRef}
                    onKeyDown={(e) => handleKeyDown(e, saveRef)}
                    placeholder="Enter Group Code"
                    className="employee-control"
                  />

                  {/* <div>
                    {errors.GroupCode && (
                      <b className="error-text">{errors.GroupCode}</b>
                    )}
                  </div> */}
                </div>
              </div>{" "}
            </form>
            <div className="employee-btn-container">
              <Button
                type="submit"
                onClick={handleSubmit}
                ref={saveRef}
                // onKeyDown={(e) => handleKeyDown(e, accgroupnameRef)}
                style={{
                  background: "#0a60bd",
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
              <u>Employee</u>
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

export default Employee;
