import React, {
  useState,
  useMemo,
  useEffect,
  useSyncExternalStore,
} from "react";
import "./TDSEntry.css";
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

function TDSEntry() {
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

    fetchTDSentries();
  }, []);

  const [FromDate, setFromdate] = useState("");
  const [ToDate, setTodate] = useState("");
  const [NatureofPayment, setNatureofpayment] = useState("false");
  const [NameofBank, setNameofbank] = useState("");
  const [BSRCode, setBsrcode] = useState("");
  const [DateontaxDeposited, setDateontaxdeposited] = useState("");
  const [ChqorDDNo, setChqorddno] = useState("");
  const [TrVoucherNo, setTrvoucherno] = useState("");
  const [TotalTDS, setTotaltds] = useState("");

  const [editingIndex, setEditingIndex] = useState(-1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [id, setId] = useState("");

  const [tdsdetailId, setTDSdetailId] = useState("");
  const [errors, setErrors] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [tdsentries, setTDSentries] = useState([]);
  const [tdsentrydetails, setTDSentrydetails] = useState([]);

  //Dropdown for ID's
  const [bookOptions, setBookOptions] = useState([]);
  const [accountOptions, setAccountOptions] = useState([]);
  const [rows, setRows] = useState([
    {
      Particulars: "",
      Amount: "",
    },
  ]);

  useEffect(() => {
    fetchTDSentries();
    fetchTDSentrydetails();
  }, []);

  const fetchTDSentries = async () => {
    try {
      const response = await axios.get(
        "https://publication.microtechsolutions.net.in/php/Purchasereturnheaderget.php"
      );
      setTDSentries(response.data);
    } catch (error) {
      // toast.error("Error fetching TDS entries:", error);
    }
  };

  // Fetch the purchase details
  const fetchTDSentrydetails = async () => {
    try {
      const response = await axios.get(
        "https://publication.microtechsolutions.net.in/php/Purchasereturndetailget.php"
      );
      // console.log(response.data, 'response of purchase return details')
      setTDSentrydetails(response.data);
    } catch (error) {
      // toast.error("Error fetching TDS entry details:", error);
    }
  };

  const handleInputChange = (index, field, value) => {
    const updatedRows = [...rows];
    updatedRows[index][field] = value;
    setRows(updatedRows);
  };

  const handleAddRow = () => {
    setRows([
      ...rows,
      {
        Particulars: "",
        Amount: 0,
      },
    ]);
  };

  const handleDeleteRow = (index) => {
    const updatedRows = rows.filter((_, i) => i !== index);
    setRows(updatedRows);
  };

  const resetForm = () => {
    setFromdate();
    setTodate("");
    setNatureofpayment("");
    setNameofbank("");
    setBsrcode("");
    setDateontaxdeposited("");
    setChqorddno("");
    setTrvoucherno("");
    setTotaltds("");
    setRows([
      {
        Particulars: "",
        Amount: 0,
      },
    ]);
  };

  const handleNewClick = () => {
    resetForm();
    setIsModalOpen(true);
    setIsEditing(false);
    setEditingIndex(-1);
  };

  const handleEdit = (row) => {
    alert("record is editing");
  };

  const handleDelete = (index) => {
    setTDSentries((prevTDS) => prevTDS.filter((_, i) => i !== index));
    toast.success("TDS entry Deleted Successfully!");
  };

  const validateForm = () => {
    let formErrors = {};
    let isValid = true;

    if (!FromDate) {
      formErrors.FromDate = "FromDate is required.";
      isValid = false;
    }

    if (!ToDate) {
      formErrors.ToDate = "ToDate is required.";
      isValid = false;
    }

    setErrors(formErrors);
    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    // const formattedPurchaseReturnDate = moment(PurchaseReturnDate).format('YYYY-MM-DD');

    // const purchasereturnData = {
    //   Id: isEditing ? id : '',  // Include the Id for updating, null for new records
    //   PurchaseReturnNo: PurchaseReturnNo,
    //   PurchaseReturnDate: formattedPurchaseReturnDate,
    //   RefrenceNo: RefrenceNo,
    //   SupplierId: SupplierId,
    //   AccountId: AccountId,
    //   SubTotal: SubTotal,
    //   Extra1: Extra1,
    //   Extra1Amount: Extra1Amount,
    //   Extra2: Extra2,
    //   Extra2Amount: Extra2Amount,
    //   Total: Total,
    //   TotalCopies: TotalCopies,
    //   Remark: Remark,
    // };

    // try {
    //   const purchasereturnUrl = isEditing
    //     ? "https://publication.microtechsolutions.net.in/php/Purchasereturnheaderupdate.php"
    //     : "https://publication.microtechsolutions.net.in/php/Purchasereturnheaderpost.php";

    //   // Submit purchase header data
    //   const response = await axios.post(purchasereturnUrl, qs.stringify(purchasereturnData), {
    //     headers: { "Content-Type": "application/x-www-form-urlencoded" },
    //   });

    //   // const purchasereturnId = isEditing ? id : parseInt(response.data.newId, 10);
    //   const purchasereturnId = isEditing ? id : parseInt(response.data.Id, 10);

    //   for (const row of rows) {
    //     const rowData = {
    //       PurchaseReturnId: purchasereturnId,
    //       SerialNo: rows.indexOf(row) + 1,
    //       BookId: parseInt(row.BookId, 10),
    //       Copies: parseInt(row.Copies, 10),
    //       Rate: parseFloat(row.Rate),
    //       DiscountPercentage: parseFloat(row.DiscountPercentage),
    //       DiscountAmount: parseFloat(row.DiscountAmount),
    //       Amount: parseFloat(row.Amount),
    //       Id: row.Id,
    //     };

    //     // if (isEditing && row.Id) {
    //     //   // If editing, include PurchasedetailId for the update
    //     //   rowData.Id = row.PurchaseId;
    //     // }

    //     const purchasereturndetailUrl = isEditing && row.Id
    //       ? "https://publication.microtechsolutions.net.in/php/Purchasereturndetailupdate.php"
    //       : "https://publication.microtechsolutions.net.in/php/Purchasereturndetailpost.php";

    //     await axios.post(purchasereturndetailUrl, qs.stringify(rowData), {
    //       headers: {
    //         "Content-Type": "application/x-www-form-urlencoded",
    //       },
    //     });
    //   }

    //   fetchPurchasereturns();
    //   fetchPurchasereturnDetails();
    //   setIsModalOpen(false);
    //   toast.success(isEditing ? 'Purchase return & Purchase Return Details updated successfully!' : 'Purchase return & Purchase Return Details added successfully!');
    //   resetForm(); // Reset the form fields after successful submission
    // } catch (error) {
    //   // console.error("Error saving record:", error);
    //   toast.error('Error saving record!');
    // }
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
    [tdsentries]
  );

  const table = useMaterialReactTable({
    columns,
    data: tdsentries,
    muiTableHeadCellProps: {
      style: {
        backgroundColor: "#E9ECEF", // Replace with your desired color
        color: "black",
        fontSize: "16px",
      },
    },
  });

  return (
    <div className="tdsentry-container">
      <h1>TDS Entry</h1>

      <div className="tdsentrytable-master">
        <div className="tdsentrytable1-master">
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
          <div className="tdsentrytable-container">
            <MaterialReactTable table={table} />
          </div>
        </div>

        {isModalOpen && (
          <div
            className="tdsentry-overlay"
            onClick={() => setIsModalOpen(false)}
          />
        )}

        <Modal open={isModalOpen}>
          <div className="tdsentry-modal">
            <h2
              style={{
                textAlign: "center",
                fontWeight: "620",
                margin: "2px",
                fontSize: "27px",
              }}>
              {editingIndex >= 0 ? "Edit TDS Entry" : "Add TDS Entry"}
            </h2>
            <form className="tdsentry-form">
              <div>
                <label className="tdsentry-label">
                  From Date<b className="required">*</b>
                </label>
                <div>
                  <input
                    type="date"
                    id="FromDate"
                    name="FromDate"
                    value={FromDate}
                    onChange={(e) => setFromdate(e.target.value)}
                    className="tdsentry-control"
                    placeholder="Enter FromDate"
                  />
                </div>

                <div>
                  {errors.FromDate && (
                    <b className="error-text">{errors.FromDate}</b>
                  )}
                </div>
              </div>
              <div>
                <label className="tdsentry-label">
                  To Date <b className="required">*</b>
                </label>
                <div>
                  <input
                    type="date"
                    id="ToDate"
                    name="ToDate"
                    value={ToDate}
                    onChange={(e) => setTodate(e.target.value)}
                    className="tdsentry-control"
                    placeholder="Enter To Date"
                  />
                </div>

                <div>
                  {errors.ToDate && (
                    <b className="error-text">{errors.ToDate}</b>
                  )}
                </div>
              </div>

              <div>
                <label className="tdsentry-label">
                  Nature of Payment<b className="required">*</b>
                </label>
                <div>
                  <input
                    type="checkbox"
                    id="NatureofPayment"
                    name="NatureofPayment"
                    checked={NatureofPayment}
                    onChange={(e) => setNatureofpayment(e.target.checked)}
                    className="tdsentry-control"
                    placeholder="Enter NatureofPayment"
                  />
                </div>

                {/* <div>
                          {errors.NatureofPayment && <b className="error-text">{errors.NatureofPayment}</b>}
                        </div> */}
              </div>

              <div>
                <label className="tdsentry-label">
                  Name of Bank<b className="required">*</b>
                </label>
                <div>
                  <input
                    type="text"
                    id="NameofBank"
                    name="NameofBank"
                    checked={NameofBank}
                    onChange={(e) => setNameofbank(e.target.checked)}
                    className="tdsentry-control"
                    placeholder="Enter Name of Bank"
                  />
                </div>

                {/* <div>
                          {errors.NameofBank && <b className="error-text">{errors.NameofBank}</b>}
                        </div> */}
              </div>

              <div>
                <label className="tdsentry-label">
                  BSR Code<b className="required">*</b>
                </label>
                <div>
                  <input
                    type="text"
                    id="BSRCode"
                    name="BSRCode"
                    checked={BSRCode}
                    onChange={(e) => setBsrcode(e.target.checked)}
                    className="tdsentry-control"
                    placeholder="Enter BSRCode"
                  />
                </div>

                {/* <div>
                          {errors.BSRCode && <b className="error-text">{errors.BSRCode}</b>}
                        </div> */}
              </div>

              <div>
                <label className="tdsentry-label">
                  Date of Tax Deposited<b className="required">*</b>
                </label>
                <div>
                  <input
                    type="date"
                    id="DateontaxDeposited"
                    name="DateontaxDeposited"
                    checked={DateontaxDeposited}
                    onChange={(e) => setDateontaxdeposited(e.target.checked)}
                    className="tdsentry-control"
                    placeholder="Enter DateontaxDeposited"
                  />
                </div>

                {/* <div>
                          {errors.DateontaxDeposited && <b className="error-text">{errors.DateontaxDeposited}</b>}
                        </div> */}
              </div>

              <div>
                <label className="tdsentry-label">
                  Chq/DD No<b className="required">*</b>
                </label>
                <div>
                  <input
                    type="text"
                    id="ChqorDDNo"
                    name="ChqorDDNo"
                    checked={ChqorDDNo}
                    onChange={(e) => setChqorddno(e.target.checked)}
                    className="tdsentry-control"
                    placeholder="Enter ChqorDDNo"
                  />
                </div>

                {/* <div>
                          {errors.ChqorDDNo && <b className="error-text">{errors.ChqorDDNo}</b>}
                        </div> */}
              </div>

              <div>
                <label className="tdsentry-label">
                  Tr.Voucher No/Challan<b className="required">*</b>
                </label>
                <div>
                  <input
                    type="text"
                    id="TrVoucherNo"
                    name="TrVoucherNo"
                    checked={TrVoucherNo}
                    onChange={(e) => setTrvoucherno(e.target.checked)}
                    className="tdsentry-control"
                    placeholder="Enter TrVoucherNo"
                  />
                </div>

                {/* <div>
                          {errors.TrVoucherNo && <b className="error-text">{errors.TrVoucherNo}</b>}
                        </div> */}
              </div>
            </form>

            <div className="tdsentry-table">
              <table>
                <thead>
                  <tr>
                    <th>Serial No</th>
                    <th>
                      Particulars<b className="required"></b>
                    </th>
                    <th>
                      Amount<b className="required">*</b>
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
                          type="text"
                          value={row.Particulars}
                          onChange={(e) =>
                            handleInputChange(
                              index,
                              "Particulars",
                              e.target.value
                            )
                          }
                          placeholder="Particulars"
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
                  ))}
                </tbody>
              </table>
            </div>

            <div className="tdsentry-btn-container">
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
export default TDSEntry;
