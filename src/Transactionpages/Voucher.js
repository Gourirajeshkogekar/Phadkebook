import React, {
  useState,
  useMemo,
  useEffect,
  useSyncExternalStore,
} from "react";
import "./Voucher.css";
import Select from "react-select";
import axios from "axios";
import { Button, TextField, Modal } from "@mui/material";
import {
  MaterialReactTable,
  useMaterialReactTable,
} from "material-react-table";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { RiDeleteBin5Line } from "react-icons/ri";
import { CiEdit } from "react-icons/ci";
import moment from "moment";
import qs from "qs";

function Voucher() {
  const [VoucherType, setVoucherType] = useState("");
  const [VoucherNo, setVoucherNo] = useState("");
  const [VoucherDate, setVoucherDate] = useState("");
  const [CheckNo, setCheckNo] = useState("");
  const [CheckDate, setCheckDate] = useState("");
  const [Narration, setNarration] = useState("");

  const [editingIndex, setEditingIndex] = useState(-1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [id, setId] = useState("");
  const [type, setType] = useState("");
  const [voucherdetailId, setVoucherdetailId] = useState("");
  const [errors, setErrors] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [voucherheaders, setVoucherheaders] = useState([]);
  const [voucherDetails, setVoucherDetails] = useState([]);

  const [costcenterOptions, setCostcenterOptions] = useState([]);
  const [accountOptions, setAccountOptions] = useState([]);

  useEffect(() => {
    fetchVouchers();
    fetchVoucherdetails();
    fetchAccounts();
    fetchCostcenters();
  }, []);

  const fetchVouchers = async () => {
    try {
      const response = await axios.get(
        "https://publication.microtechsolutions.net.in/php/Voucherhdget.php"
      );
      setVoucherheaders(response.data);
    } catch (error) {
      toast.error("Error fetching Vouchers:", error);
    }
  };

  const [rows, setRows] = useState([
    {
      AccountId: "", // Default value for the first row
      Amount: 0,
      DOrC: 0,
      CostCenterId: 0,
      Narration: 0,
      CheckNo: 0,
      CheckDate: "",
      CheckAmount: 0,
      MICRCode: "",
      BankName: "",
      BankBranch: "",
    },
  ]);

  // Fetch the purchase details
  const fetchVoucherdetails = async () => {
    try {
      const response = await axios.get(
        "https://publication.microtechsolutions.net.in/php/Voucherdetailget.php"
      );
      setVoucherDetails(response.data);
    } catch (error) {
      toast.error("Error fetching Voucher details:", error);
    }
  };

  const handleInputChange = (index, field, value) => {
    const updatedRows = [...rows];

    // Update the value of the current field
    updatedRows[index][field] = value;

    setRows(updatedRows);
    // calculateTotals();
  };

  const handleAddRow = () => {
    setRows([
      ...rows,
      {
        AccountId: "", // Default value for the first row
        Amount: 0,
        DOrC: 0,
        CostCenterId: 0,
        Narration: 0,
        CheckNo: 0,
        CheckDate: "",
        CheckAmount: 0,
        MICRCode: "",
        BankName: "",
        BankBranch: "",
      },
    ]);

    // calculateTotals();
  };

  const handleDeleteRow = (index) => {
    const updatedRows = rows.filter((_, i) => i !== index);
    setRows(updatedRows);
    // calculateTotals();
  };

  const fetchAccounts = async () => {
    try {
      const response = await axios.get(
        "https://publication.microtechsolutions.net.in/php/Accountget.php"
      );
      const accountOptions = response.data.map((acc) => ({
        value: acc.Id,
        label: acc.AccountName,
      }));
      setAccountOptions(accountOptions);
    } catch (error) {
      toast.error("Error fetching Accounts:", error);
    }
  };

  const fetchCostcenters = async () => {
    try {
      const response = await axios.get(
        "https://publication.microtechsolutions.net.in/php/Costcenterget.php"
      );
      const costcenterOptions = response.data.map((cost) => ({
        value: cost.Id,
        label: cost.CostCenterName,
      }));
      setCostcenterOptions(costcenterOptions);
    } catch (error) {
      toast.error("Error fetching CostCenters:", error);
    }
  };

  const resetForm = () => {
    setVoucherType("");
    setVoucherNo("");
    setVoucherDate("");
    setCheckNo("");
    setCheckDate("");
    setNarration("");

    setRows([
      {
        VoucherNo: "",
        VoucherDate: "",
        AccountId: "", // Default value for the first row
        Amount: "",
        DOrC: "",
        CostCenterId: "",
        Narration: "",
        CheckNo: "",
        CheckDate: "",
        CheckAmount: "",
        MICRCode: "",
        BankName: "",
        BankBranch: "",
      },
    ]);
  };

  // useEffect(() => {
  //   calculateTotals();
  // }, [rows]);

  const handleNewClick = () => {
    resetForm();
    setIsModalOpen(true);
    // setRows(rows);
    setIsEditing(false);
    setEditingIndex(-1);
  };

  //   const handleEdit = (row) => {
  //     const voucher = voucherheaders[row.index];

  //     // Filter purchase details to match the selected PurchaseId
  //     const voucherdetail = voucherDetails.filter(detail => detail.VoucherId === voucher.Id);

  //     console.log(voucherdetail, 'Voucher details');

  //  // Convert date strings to DD-MM-YYYY format
  //  const convertDateForInput = (dateStr) => {
  //   if (typeof dateStr === 'string' && dateStr.includes('-')) {
  //       const [year, month, day] = dateStr.split(' ')[0].split('-');
  //       return `${year}-${month}-${day}`;
  //   } else {
  //       console.error('Invalid date format:', dateStr);
  //       return ''; // Return an empty string or handle it as needed
  //   }
  // };

  //     // Map the details to rows
  //     const mappedRows = voucherdetail.map(detail => ({
  //       VoucherId: detail.VoucherId,
  //       VoucherType: detail.VoucherType,
  //       VoucherNo: detail.VoucherNo,
  //       VoucherDate: detail.VoucherDate,
  //       AccountId: detail.AccountId,
  //       Amount: detail.Amount,
  //       DOrC: detail.DOrC,
  //       CostCenterId: detail.CostCenterId,
  //       Narration: detail.Narration,
  //       CheckNo: detail.CheckNo,
  //       CheckDate: detail.CheckDate,
  //       CheckAmount: detail.CheckAmount,
  //       MICRCode: detail.MICRCode,
  //       BankName: detail.BankName,
  //       BankBranch: detail.BankBranch,
  //       Id: detail.Id, // Include the detail Id in the mapped row for tracking
  //     }));

  //     const voucherdate = convertDateForInput(voucher.VoucherDate.date);

  //     const checkdate = convertDateForInput(voucher.CheckDate.date);

  //     // Set the form fields
  //     setVoucherType(voucher.VoucherType);
  //     setVoucherNo(voucher.VoucherNo);
  //     setVoucherDate(voucherdate);
  //     setCheckNo(voucher.CheckNo);
  //     setCheckDate(checkdate);
  //     setNarration(voucher.Narration);

  //     console.log(voucher, 'voucher')

  //     // Set the rows for the table with all the details
  //     setRows(mappedRows);

  //     // Set editing state
  //     setEditingIndex(row.index);
  //     setIsModalOpen(true);
  //     setIsEditing(true);
  //     setId(voucher.Id);
  //     setType(voucher.VoucherType)
  //     // Determine which specific detail to edit
  //     const specificDetail = voucherdetail.find(detail => detail.Id === row.original.Id);
  //     if (specificDetail) {
  //       setVoucherdetailId(specificDetail.Id); // Set the specific detail Id
  //     }

  //     fetchVoucherdetails();
  //   };

  const handleEdit = (row) => {
    const voucher = voucherheaders[row.index];

    // Filter purchase details to match the selected PurchaseId
    const voucherdetail = voucherDetails.filter(
      (detail) => detail.VoucherId === voucher.Id
    );

    // console.log(voucherdetail, 'Voucher details');

    // Convert date strings to YYYY-MM-DD format for the input fields
    const convertDateForInput = (dateStr) => {
      if (typeof dateStr === "string" && dateStr.includes("-")) {
        const [year, month, day] = dateStr.split(" ")[0].split("-");
        return `${year}-${month}-${day}`;
      } else {
        console.error("Invalid date format:", dateStr);
        return ""; // Return an empty string or handle it as needed
      }
    };

    // Map the details to rows
    const mappedRows = voucherdetail.map((detail) => ({
      VoucherId: detail.VoucherId,
      VoucherType: detail.VoucherType,
      VoucherNo: detail.VoucherNo,
      VoucherDate: convertDateForInput(detail.VoucherDate.date), // Ensure proper format
      AccountId: detail.AccountId,
      Amount: detail.Amount,
      DOrC: detail.DOrC,
      CostCenterId: detail.CostCenterId,
      Narration: detail.Narration,
      CheckNo: detail.CheckNo,
      CheckDate: convertDateForInput(detail.CheckDate.date), // Ensure proper format
      CheckAmount: detail.CheckAmount,
      MICRCode: detail.MICRCode,
      BankName: detail.BankName,
      BankBranch: detail.BankBranch,
      Id: detail.Id, // Include the detail Id in the mapped row for tracking
    }));

    // Convert the voucher date and check date to the proper format for the input fields
    const voucherdate = convertDateForInput(voucher.VoucherDate.date);
    const checkdate = convertDateForInput(voucher.CheckDate.date);

    // Set the form fields with the correct date format
    setVoucherType(voucher.VoucherType);
    setVoucherNo(voucher.VoucherNo);
    setVoucherDate(voucherdate); // Properly formatted date
    setCheckNo(voucher.CheckNo);
    setCheckDate(checkdate); // Properly formatted date
    setNarration(voucher.Narration);

    // console.log(voucher, 'voucher');

    // Set the rows for the table with all the details
    setRows(mappedRows);

    // Set editing state
    setEditingIndex(row.index);
    setIsModalOpen(true);
    setIsEditing(true);
    setId(voucher.Id);
    setType(voucher.VoucherType);

    // Determine which specific detail to edit
    const specificDetail = voucherdetail.find(
      (detail) => detail.Id === row.original.Id
    );
    if (specificDetail) {
      setVoucherdetailId(specificDetail.Id); // Set the specific detail Id
    }

    fetchVoucherdetails();
  };

  const handleDelete = (index) => {
    setVoucherheaders((prevVouchers) =>
      prevVouchers.filter((_, i) => i !== index)
    );
    toast.error("Voucher Deleted Successfully!");
  };

  const validateForm = () => {
    let formErrors = {};
    let isValid = true;

    if (!VoucherType) {
      formErrors.VoucherType = "Voucher Type is required.";
      isValid = false;
    }
    if (!VoucherNo) {
      formErrors.VoucherNo = "Voucher No is required.";
      isValid = false;
    }

    if (!VoucherDate) {
      formErrors.VoucherDate = "Voucher Date is required.";
      isValid = false;
    }

    if (!CheckNo) {
      formErrors.CheckNo = "Check No is required.";
      isValid = false;
    }

    if (!CheckDate) {
      formErrors.CheckDate = "Check date is required.";
      isValid = false;
    }

    if (!Narration) {
      formErrors.Narration = "Narration is required.";
      isValid = false;
    }

    setErrors(formErrors);
    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    const formattedvoucherDate = moment(VoucherDate).format("YYYY-MM-DD");
    const formattedcheckDate = moment(CheckDate).format("YYYY-MM-DD");

    const voucherData = {
      Id: isEditing ? id : "", // Include the Id for updating, null for new records
      VoucherType: VoucherType,
      VoucherNo: VoucherNo,
      VoucherDate: formattedvoucherDate,
      CheckNo: CheckNo,
      CheckDate: formattedcheckDate,
      Narration: Narration,
    };

    try {
      const voucherurl = isEditing
        ? "https://publication.microtechsolutions.net.in/php/Voucherhdupdate.php"
        : "https://publication.microtechsolutions.net.in/php/Voucherhdpost.php";

      // Submit purchase header data
      const response = await axios.post(voucherurl, qs.stringify(voucherData), {
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
      });

      const voucherId = isEditing ? id : parseInt(response.data.Id, 10);
      const voucherType = isEditing ? type : response.data.VoucherType;
      for (const row of rows) {
        const rowData = {
          VoucherId: voucherId,
          VoucherType: voucherType,
          SerialNo: rows.indexOf(row) + 1,
          VoucherNo: parseInt(row.VoucherNo, 10),
          VoucherDate: row.VoucherDate,
          AccountId: parseInt(row.AccountId, 10),
          Amount: parseFloat(row.Amount),
          DOrC: row.DOrC,
          CostCenterId: parseInt(row.CostCenterId, 10),
          Narration: row.Narration,
          CheckNo: row.CheckNo,
          CheckDate: row.CheckDate,
          CheckAmount: parseFloat(row.CheckAmount, 10),
          MICRCode: row.MICRCode,
          BankName: row.BankName,
          BankBranch: row.BankBranch,
          Id: row.Id,
        };

        const voucherdetailurl =
          isEditing && row.Id
            ? "https://publication.microtechsolutions.net.in/php/Voucherdetailupdate.php"
            : "https://publication.microtechsolutions.net.in/php/Voucherdetailpost.php";

        await axios.post(voucherdetailurl, qs.stringify(rowData), {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
        });
      }
      fetchVouchers();
      fetchVoucherdetails();
      setIsModalOpen(false);
      toast.success(
        isEditing
          ? "Voucher & Voucher Details updated successfully!"
          : "Voucher & Voucher Details added successfully!"
      );
      resetForm(); // Reset the form fields after successful submission
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
        accessorKey: "VoucherNo",
        header: "Voucher No",
        size: 50,
      },
      {
        accessorKey: "VoucherDate.date",
        header: "Voucher Date",
        size: 50,
        Cell: ({ cell }) => {
          // Using moment.js to format the date
          const date = moment(cell.getValue()).format("DD-MM-YYYY");
          return <span>{date}</span>;
        },
      },
      {
        accessorKey: "CheckNo",
        header: "Check No",
        size: 50,
      },
      {
        accessorKey: "CheckDate.date",
        header: "Check Date",
        size: 50,

        Cell: ({ cell }) => {
          // Using moment.js to format the date
          const date = moment(cell.getValue()).format("DD-MM-YYYY");
          return <span>{date}</span>;
        },
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
                background: "#3c7291",
                color: "white",
                marginRight: "5px",
              }}>
              Edit
            </Button>
            <Button
              onClick={() => handleDelete(row.index)}
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
    [voucherheaders]
  );

  const table = useMaterialReactTable({
    columns,
    data: voucherheaders,
    muiTableHeadCellProps: {
      style: {
        backgroundColor: "#758694", // Replace with your desired color
        color: "white",
      },
    },
  });

  return (
    <div className="voucher-container">
      <h1>Voucher</h1>

      <div className="vouchertable-master">
        <div className="vouchertable1-master">
          <Button
            onClick={handleNewClick}
            style={{
              color: "#FFFF",
              fontWeight: "700",
              background: "#006989",
              width: "15%",
            }}>
            New
          </Button>
          <div className="vouchertable-container">
            <MaterialReactTable table={table} />
          </div>
        </div>

        {isModalOpen && (
          <div
            className="voucher-overlay"
            onClick={() => setIsModalOpen(false)}
          />
        )}

        <Modal open={isModalOpen}>
          <div className="voucher-modal">
            <h1
              style={{
                textAlign: "center",
                fontWeight: "500",
                margin: "2px",
              }}>
              {editingIndex >= 0 ? "Edit Book Purchase " : "Add Book Purchase"}
            </h1>
            <form className="voucher-form">
              <div>
                <label className="voucher-label">
                  Voucher Type<b className="required">*</b>:
                </label>
                <div>
                  <input
                    type="text"
                    id="VoucherType"
                    name="VoucherType"
                    value={VoucherType}
                    onChange={(e) => setVoucherType(e.target.value)}
                    className="voucher-control"
                    placeholder="Enter Voucher Type"
                  />
                </div>

                <div>
                  {errors.VoucherType && (
                    <b className="error-text">{errors.VoucherType}</b>
                  )}
                </div>
              </div>
              <div>
                <label className="voucher-label">
                  Voucher No<b className="required">*</b>:
                </label>
                <div>
                  <input
                    type="number"
                    id="VoucherNo"
                    name="VoucherNo"
                    value={VoucherNo}
                    onChange={(e) => setVoucherNo(e.target.value)}
                    className="voucher-control"
                    placeholder="Enter Voucher No"
                  />
                </div>

                <div>
                  {errors.VoucherNo && (
                    <b className="error-text">{errors.VoucherNo}</b>
                  )}
                </div>
              </div>

              <div>
                <label className="voucher-label">
                  Voucher Date<b className="required">*</b>:
                </label>
                <div>
                  <input
                    type="date"
                    id="VoucherDate"
                    name="VoucherDate"
                    value={VoucherDate}
                    onChange={(e) => setVoucherDate(e.target.value)}
                    className="voucher-control"
                    placeholder="Enter Voucher date"
                  />
                </div>

                <div>
                  {errors.VoucherDate && (
                    <b className="error-text">{errors.VoucherDate}</b>
                  )}
                </div>
              </div>

              <div>
                <label className="voucher-label">
                  Check No<b className="required">*</b>:
                </label>
                <div>
                  <input
                    type="text"
                    id="CheckNo"
                    name="CheckNo"
                    value={CheckNo}
                    onChange={(e) => setCheckNo(e.target.value)}
                    className="voucher-control"
                    placeholder="Enter Check No"
                  />
                </div>

                <div>
                  {errors.CheckNo && (
                    <b className="error-text">{errors.CheckNo}</b>
                  )}
                </div>
              </div>

              <div>
                <label className="voucher-label">
                  Check Date<b className="required">*</b>:
                </label>
                <div>
                  <input
                    type="date"
                    id="CheckDate"
                    name="CheckDate"
                    value={CheckDate}
                    onChange={(e) => setCheckDate(e.target.value)}
                    className="voucher-control"
                    placeholder="Enter Check date"
                  />
                </div>

                <div>
                  {errors.CheckDate && (
                    <b className="error-text">{errors.CheckDate}</b>
                  )}
                </div>
              </div>

              <div>
                <label className="voucher-label">
                  Narration<b className="required">*</b>:
                </label>
                <div>
                  <input
                    type="text"
                    id="Narration"
                    name="Narration"
                    value={Narration}
                    onChange={(e) => setNarration(e.target.value)}
                    className="voucher-control"
                    placeholder="Enter Narration"
                  />
                </div>

                <div>
                  {errors.Narration && (
                    <b className="error-text">{errors.Narration}</b>
                  )}
                </div>
              </div>
            </form>

            <div className="voucher-table">
              <table>
                <thead>
                  <tr>
                    <th>Serial No</th>
                    <th>Voucher No</th>
                    <th>Voucher Date</th>

                    <th>
                      Account Id<b className="required">*</b>
                    </th>
                    <th>
                      Amount<b className="required">*</b>
                    </th>
                    <th>
                      DOrC<b className="required">*</b>
                    </th>
                    <th>
                      Cost Center Id<b className="required">*</b>
                    </th>
                    <th>
                      Narration<b className="required">*</b>
                    </th>
                    <th>
                      Check No<b className="required">*</b>
                    </th>
                    <th>
                      Check Date<b className="required">*</b>
                    </th>

                    <th>
                      Check Amount<b className="required">*</b>
                    </th>
                    <th>
                      MICR Code<b className="required">*</b>
                    </th>
                    <th>
                      Bank Name<b className="required">*</b>
                    </th>
                    <th>
                      Bank Branch<b className="required">*</b>
                    </th>

                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((row, index) => (
                    <tr key={index}>
                      <td>{index + 1}</td>

                      <td>
                        <input
                          type="number"
                          value={row.VoucherNo}
                          onChange={(e) =>
                            handleInputChange(
                              index,
                              "VoucherNo",
                              e.target.value
                            )
                          }
                          placeholder="Voucher No"
                        />
                      </td>

                      <td>
                        <input
                          type="date"
                          value={row.VoucherDate}
                          onChange={(e) =>
                            handleInputChange(
                              index,
                              "VoucherDate",
                              e.target.value
                            )
                          }
                          placeholder="Voucher Date"
                        />
                      </td>
                      <td>
                        <Select
                          value={accountOptions.find(
                            (option) => option.value === row.AccountId
                          )}
                          onChange={(option) =>
                            handleInputChange(index, "AccountId", option.value)
                          }
                          options={accountOptions}
                          placeholder="Account Id"
                          styles={{
                            control: (base) => ({
                              ...base,
                              width: "150px",
                            }),

                            menu: (base) => ({
                              ...base,
                              zIndex: 100,
                            }),
                          }}
                        />
                      </td>
                      <td>
                        <input
                          type="number"
                          value={row.Amount}
                          onChange={(e) =>
                            handleInputChange(index, "Amount", e.target.value)
                          }
                          placeholder="Amount"
                        />
                      </td>
                      <td>
                        <input
                          type="text"
                          value={row.DOrC}
                          onChange={(e) =>
                            handleInputChange(index, "DOrC", e.target.value)
                          }
                          placeholder="DOrC"
                        />
                      </td>
                      <td>
                        <Select
                          value={costcenterOptions.find(
                            (option) => option.value === row.CostCenterId
                          )}
                          onChange={(option) =>
                            handleInputChange(
                              index,
                              "CostCenterId",
                              option.value
                            )
                          }
                          options={costcenterOptions}
                          placeholder="CostCenterId"
                          styles={{
                            control: (base) => ({
                              ...base,
                              width: "150px",
                            }),

                            menu: (base) => ({
                              ...base,
                              zIndex: 100,
                            }),
                          }}
                        />
                      </td>
                      <td>
                        <input
                          type="text"
                          value={row.Narration}
                          onChange={(e) =>
                            handleInputChange(
                              index,
                              "Narration",
                              e.target.value
                            )
                          }
                          placeholder="Enter Narration"
                        />
                      </td>
                      <td>
                        <input
                          type="text"
                          value={row.CheckNo}
                          onChange={(e) =>
                            handleInputChange(index, "CheckNo", e.target.value)
                          }
                          placeholder="CheckNo"
                        />
                      </td>

                      <td>
                        <input
                          type="date"
                          value={row.CheckDate}
                          onChange={(e) =>
                            handleInputChange(
                              index,
                              "CheckDate",
                              e.target.value
                            )
                          }
                          placeholder="Check Date"
                        />
                      </td>

                      <td>
                        <input
                          type="number"
                          value={row.CheckAmount}
                          onChange={(e) =>
                            handleInputChange(
                              index,
                              "CheckAmount",
                              e.target.value
                            )
                          }
                          placeholder="Check Amount"
                        />
                      </td>
                      <td>
                        <input
                          type="text"
                          value={row.MICRCode}
                          onChange={(e) =>
                            handleInputChange(index, "MICRCode", e.target.value)
                          }
                          placeholder="MICR Code"
                        />
                      </td>
                      <td>
                        <input
                          type="text"
                          value={row.BankName}
                          onChange={(e) =>
                            handleInputChange(index, "BankName", e.target.value)
                          }
                          placeholder="Bank Name"
                        />
                      </td>
                      <td>
                        <input
                          type="text"
                          value={row.BankBranch}
                          onChange={(e) =>
                            handleInputChange(
                              index,
                              "BankBranch",
                              e.target.value
                            )
                          }
                          placeholder="Bank Branch"
                        />
                      </td>
                      <td>
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                          }}>
                          <Button
                            onClick={handleAddRow}
                            style={{
                              background: "#3c7291",
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
                  ))}
                </tbody>
              </table>
            </div>

            <div className="voucher-btn-container">
              <Button
                type="submit"
                onClick={handleSubmit}
                style={{
                  background: "#3c7291",
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
      </div>
      <ToastContainer />
    </div>
  );
}
export default Voucher;
