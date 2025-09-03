import React, { useState, useRef, useEffect } from "react";
import {
  Box,
  Button,
  TextField,
  Typography,
  Autocomplete,
  Grid,
} from "@mui/material";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import axios from "axios";
import dayjs from "dayjs";
import autoTable from "jspdf-autotable";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Netsalereport = () => {
  const [fromdate, setFromDate] = useState(dayjs());
  const [todate, setToDate] = useState(dayjs());
  const [accountName, setAccountName] = useState("");
  const [selectedAccountlabel, setSelectedAccountlabel] = useState("");
  const [accountOptions, setAccountOptions] = useState([]);
  const [previewImage, setPreviewImage] = useState(null);
  const [showPreview, setShowPreview] = useState(false);
  const [reportData, setReportData] = useState([]);
  const [companyName, setCompanyName] = useState("");

  const hiddenReportRef = useRef();

  useEffect(() => {
    fetchAccounts();
    fetchCompanies();
  }, []);

  const fetchAccounts = async () => {
    try {
      const response = await axios.get(
        "https://publication.microtechsolutions.net.in/php/Accountget.php"
      );
      const options = response.data.map((acc) => ({
        value: acc.Id,
        label: acc.AccountName,
        code: acc.AccountCode,
      }));
      setAccountOptions(options);
    } catch (error) {
      toast.error("Error fetching accounts:", error);
    }
  };

  const fetchCompanies = async () => {
    try {
      const response = await axios.get(
        "https://publication.microtechsolutions.net.in/php/CompanyMasterget.php"
      );

      if (response.data.length > 0) {
        setCompanyName(response.data[0].CompanyName); // Assuming you want the first one
      }
    } catch (error) {
      console.error("Error fetching companies:", error);
    }
  };

  const handlePrint = async () => {
    console.log("Clicked Generate Preview");
    if (!accountName) {
      toast.error("Missing required fields");
      return;
    }

    try {
      const response = await axios.get(
        `https://publication.microtechsolutions.net.in/php/getnetsales.php?fromdate=${fromdate.format(
          "YYYY-MM-DD"
        )}&todate=${todate.format("YYYY-MM-DD")}&AccountId=${accountName}`
      );

      if (Array.isArray(response.data)) {
        setReportData(response.data);
      } else {
        console.warn("Unexpected API response:", response.data);
        setReportData([]);
        return;
      }

      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
      });

      const tableColumn = [
        "Sr.No",
        "Particulars",
        "Price",
        "Sale",
        "Sales Return",
        "Net",
        "PP",
        "MVP",
        "PPUB",
        "Other",
      ];

      const tableRows = response.data.map((item, index) => [
        index + 1,
        item.BookName,
        item.BookRate,
        item.salestotal,
        item.salesreturntotal,
        item.net,
        item.PP,
        item.MVP,
        item.PPUB,
        item.Other,
      ]);

      // // Add total row for PP

      autoTable(pdf, {
        head: [tableColumn],
        body: tableRows,
        startY: 30,
        theme: "grid",
        headStyles: {
          fillColor: [25, 118, 210],
          textColor: 255,
          fontWeight: "bold", // <-- Force bold header text
        },
        styles: {
          fontSize: 10,
          cellPadding: 2,
        },
        didParseCell: function (data) {
          const rowData = response.data[data.row.index];

          if (rowData && rowData.BookName?.toUpperCase() === "TOTAL") {
            // Make TOTAL row bold with gray background
            data.cell.styles.fontStyle = "bold";
            data.cell.styles.fillColor = [230, 230, 230];
          }

          // Bold 'Net' and 'PP' column cells
          if (
            data.section === "body" &&
            (data.column.index === 4 || data.column.index === 5)
          ) {
            data.cell.styles.fontStyle = "bold";
          }
        },

        didDrawPage: (data) => {
          const pageWidth = pdf.internal.pageSize.getWidth();

          // Company Name
          pdf.setFont("helvetica", "bold");
          pdf.setFontSize(13);
          pdf.text(
            companyName || "Phadke Prakashan, Kolhapur",
            pageWidth / 2,
            10,
            {
              align: "center",
            }
          );

          // Report Title
          pdf.setFont("helvetica", "bold");
          pdf.setFontSize(11);
          pdf.text("Net Sale Report", pageWidth / 2, 17, {
            align: "center",
          });

          // Account + Date Range (move it below title)
          pdf.setFont("helvetica", "normal");
          pdf.setFontSize(10);
          pdf.text(
            `Account: ${selectedAccountlabel}   From: ${fromdate.format(
              "DD-MM-YYYY"
            )}   To: ${todate.format("DD-MM-YYYY")}`,
            14,
            23
          );
          // Page number
          const pageNumber = pdf.internal.getCurrentPageInfo().pageNumber;
          pdf.text(`Page ${pageNumber}`, pageWidth - 30, 10);
        },
      });

      // Open PDF in new tab
      const blob = pdf.output("blob");
      const blobUrl = URL.createObjectURL(blob);
      window.open(blobUrl, "_blank");
    } catch (err) {
      toast.error("Error generating PDF:", err);
    }
  };

  const cellStyle = {
    padding: "7px",
    border: "1px solid #ccc",
    textAlign: "center",
    height: "50px",
  };

  return (
    <Box p={3}>
      <Typography
        variant="h5"
        mb={3}
        sx={{
          textAlign: "center",
          background: "linear-gradient(to right, #007cf0, #00dfd8)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          textShadow: "2px 2px 4px rgba(0,0,0,0.2)",
          fontWeight: "bold",
        }}>
        Net Sale Report
      </Typography>

      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <Box
          // component={Paper}
          elevation={2}
          sx={{
            p: 3,
            mb: 3,
            border: "1px solid #ccc",
            borderRadius: 2,
            backgroundColor: "#fdfdfd",
          }}>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} sm={4}>
              <Typography variant="subtitle2" gutterBottom>
                From Date
              </Typography>
              <DatePicker
                value={fromdate}
                onChange={(newValue) => setFromDate(newValue)}
                slotProps={{ textField: { size: "small", fullWidth: true } }}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <Typography variant="subtitle2" gutterBottom>
                To Date
              </Typography>
              <DatePicker
                value={todate}
                onChange={(newValue) => setToDate(newValue)}
                slotProps={{ textField: { size: "small", fullWidth: true } }}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <Typography variant="subtitle2" gutterBottom>
                Account Name
              </Typography>
              <Autocomplete
                options={accountOptions}
                value={
                  accountOptions.find(
                    (option) => option.value === accountName
                  ) || null
                }
                onChange={(event, newValue) => {
                  setAccountName(newValue ? newValue.value : "");
                  setSelectedAccountlabel(newValue ? newValue.label : "");
                }}
                getOptionLabel={(option) => option.label || ""}
                renderInput={(params) => (
                  <TextField {...params} size="small" fullWidth />
                )}
              />
            </Grid>
          </Grid>

          <Box textAlign="center" mt={3}>
            <Button
              variant="contained"
              color="primary"
              onClick={handlePrint}
              disabled={!accountName}
              sx={{ fontSize: "0.85rem", textTransform: "none" }}>
              Generate Preview
            </Button>
          </Box>
        </Box>
      </LocalizationProvider>

      <Box
        ref={hiddenReportRef}
        sx={{
          display: "none",
          p: 3,
          minWidth: "800px",
          overflowX: "auto",
          backgroundColor: "#fff",
          fontSize: "15px",
        }}>
        <Typography variant="h6" sx={{ mb: 1, textAlign: "center" }}>
          Phadke Prakashan, Kolhapur
        </Typography>
        <Typography
          variant="h6"
          sx={{ fontWeight: "bold", textAlign: "center" }}>
          Net Sale
        </Typography>
        <p style={{ textAlign: "center", fontSize: "18px" }}>
          <strong>Account:</strong> {selectedAccountlabel} &nbsp;&nbsp;&nbsp;
          <strong>From:</strong> {fromdate.format("YYYY-MM-DD")}{" "}
          &nbsp;&nbsp;&nbsp;
          <strong>To:</strong> {todate.format("YYYY-MM-DD")}
        </p>

        <Box mt={1}>
          <table
            style={{
              width: "100%",
              tableLayout: "auto", // Allow natural column width
              borderCollapse: "collapse",
              fontFamily: "Arial, sans-serif",
              fontSize: "15px",
              backgroundColor: "#f9f9f9",
            }}>
            <thead>
              <tr
                style={{
                  backgroundColor: "#1976d2",
                  color: "#fff",
                  height: "80px",
                }}>
                <th rowSpan="2" style={cellStyle}>
                  Particulars
                </th>

                <th colSpan="4" style={cellStyle}>
                  Copies
                </th>
                <th colSpan="4" style={cellStyle}>
                  Details of Net Amount
                </th>
              </tr>
              <tr style={{ backgroundColor: "#1976d2", color: "#fff" }}>
                <th style={cellStyle}>Price</th>
                <th style={cellStyle}>Sale</th>
                <th style={cellStyle}>Sales Return</th>
                <th style={cellStyle}>Net</th>
                <th style={cellStyle}>PP</th>
                <th style={cellStyle}>MVP</th>
                <th style={cellStyle}>PPUB</th>
                <th style={cellStyle}>Other</th>
              </tr>
            </thead>
            <tbody>
              {reportData.length > 0 ? (
                reportData.map((item, index) => {
                  const isTotalRow = item.BookName?.toUpperCase() === "TOTAL";
                  return (
                    <tr
                      key={index}
                      style={{
                        backgroundColor: isTotalRow ? "#e0e0e0" : "inherit",
                        fontWeight: isTotalRow ? "bold" : "normal",
                      }}>
                      <td style={cellStyle}>
                        {item.BookName || item.BookNameMarathi}
                      </td>
                      <td style={cellStyle}>{item.BookRate}</td>
                      <td style={cellStyle}>{item.salestotal}</td>
                      <td style={cellStyle}>{item.salesreturntotal}</td>
                      <td style={cellStyle}>{item.net}</td>
                      <td style={cellStyle}>{item.PP}</td>
                      <td style={cellStyle}>{item.MVP}</td>
                      <td style={cellStyle}>{item.PPUB}</td>
                      <td style={cellStyle}>{item.Other}</td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="9" style={cellStyle}>
                    No data available
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </Box>
      </Box>

      <ToastContainer />
    </Box>
  );
};

export default Netsalereport;
