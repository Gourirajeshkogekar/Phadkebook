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
import CircularProgress from "@mui/material/CircularProgress";

const Stockdaybookreport = () => {
  const [fromdate, setFromDate] = useState(dayjs());
  const [todate, setToDate] = useState(dayjs());
  const [bookName, setBookName] = useState("");
  const [selectedBookLabel, setSelectedBookLabel] = useState("");
  const [bookOptions, setBookOptions] = useState([]);
  const [previewImage, setPreviewImage] = useState(null);
  const [showPreview, setShowPreview] = useState(false);
  const [bookReportData, setBookreportdata] = useState([]);

  const [loading, setLoading] = useState("");
  const hiddenReportRef = useRef();
  const [stockDayData, setStockDayData] = useState({});
  const [companyName, setCompanyName] = useState("");

  useEffect(() => {
    fetchBooks();
    fetchCompanies();
  }, []);

  const fetchBooks = async () => {
    try {
      const response = await axios.get(
        "https://publication.microtechsolutions.net.in/php/Bookget.php"
      );
      const options = response.data.map((book) => ({
        value: book.Id,
        label: book.BookName || book.BookNameMarathi,
        code: book.BookCode,
      }));
      setBookOptions(options);
    } catch (error) {
      toast.error("Error fetching books:", error);
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

  const fetchStockDayBookData = async () => {
    try {
      const response = await axios.get(
        `https://publication.microtechsolutions.net.in/php/getstockdaybook.php?fromdate=${fromdate.format(
          "YYYY-MM-DD"
        )}&todate=${todate.format("YYYY-MM-DD")}`
      );
      setStockDayData(response.data.data || {});
    } catch (err) {
      toast.error("Failed to fetch stock day book data.");
    }
  };

  const handleGeneratePDF = async () => {
    setLoading(true);

    // Temporarily make the hidden report visible for html2canvas
    if (hiddenReportRef.current) {
      hiddenReportRef.current.style.display = "block";
      hiddenReportRef.current.style.position = "absolute";
      hiddenReportRef.current.style.left = "-9999px"; // Move off-screen
    }

    await fetchStockDayBookData();
    // A small delay to ensure React has rendered the updated stockDayData
    setTimeout(() => {
      openPreviewWindow();
      // After capturing, hide it again
      if (hiddenReportRef.current) {
        hiddenReportRef.current.style.display = "none";
        hiddenReportRef.current.style.position = "";
        hiddenReportRef.current.style.left = "";
      }

      setLoading(false);
    }, 500);
  };

  const openPreviewWindow = async () => {
    const input = hiddenReportRef.current;
    if (!input) return;

    const canvas = await html2canvas(input, { scale: 2, useCORS: true });
    const imgData = canvas.toDataURL("image/png");
    const imgWidth = canvas.width;
    const imgHeight = canvas.height;

    const pdf = new jsPDF("p", "mm", "a4");
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();
    const ratio = pdfWidth / imgWidth;
    const scaledHeight = imgHeight * ratio;

    const marginTop = 20;
    const marginBottom = 10;
    const availableHeight = pdfHeight - marginTop - marginBottom;
    const pageHeightPx = availableHeight / ratio;
    const totalPages = Math.ceil(imgHeight / pageHeightPx);

    for (let i = 0; i < totalPages; i++) {
      const pageCanvas = document.createElement("canvas");
      const sourceY = i * pageHeightPx;

      pageCanvas.width = imgWidth;
      pageCanvas.height = Math.min(pageHeightPx, imgHeight - sourceY);

      const ctx = pageCanvas.getContext("2d");
      ctx.drawImage(
        canvas,
        0,
        sourceY,
        imgWidth,
        pageCanvas.height,
        0,
        0,
        imgWidth,
        pageCanvas.height
      );

      const pageImage = pageCanvas.toDataURL("image/png");
      if (i > 0) pdf.addPage();

      pdf.setFontSize(14);
      pdf.setFont("helvetica", "bold");
      pdf.text(companyName || "Phadke Prakashan, Kolhapur", pdfWidth / 2, 10, {
        align: "center",
      });

      pdf.setFontSize(11);
      pdf.text(
        `Stock Day Book Report | From ${fromdate.format(
          "DD-MM-YYYY"
        )} To ${todate.format("DD-MM-YYYY")}`,
        pdfWidth / 2,
        16,
        { align: "center" }
      );

      pdf.setFontSize(10);
      pdf.text(`Page ${i + 1} of ${totalPages}`, pdfWidth - 10, 10, {
        align: "right",
      });

      pdf.addImage(
        pageImage,
        "PNG",
        0,
        marginTop,
        pdfWidth,
        (pageCanvas.height * pdfWidth) / imgWidth
      );
    }

    const blob = pdf.output("blob");
    const blobURL = URL.createObjectURL(blob);
    window.open(blobURL, "_blank");
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
        Stock Day Book Report
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
            <Grid item xs={12} sm={6} md={4}>
              <Typography variant="subtitle2" gutterBottom>
                From Date
              </Typography>
              <DatePicker
                value={fromdate}
                onChange={setFromDate}
                slotProps={{ textField: { size: "small", fullWidth: true } }}
              />
            </Grid>

            <Grid item xs={12} sm={6} md={4}>
              <Typography variant="subtitle2" gutterBottom>
                To Date
              </Typography>
              <DatePicker
                value={todate}
                onChange={setToDate}
                slotProps={{ textField: { size: "small", fullWidth: true } }}
              />
            </Grid>
          </Grid>

          <Box textAlign="center" mt={3}>
            <Button
              variant="contained"
              color="primary"
              onClick={handleGeneratePDF}
              sx={{ fontSize: "0.85rem", textTransform: "none" }}>
              Generate Report
            </Button>
          </Box>
        </Box>
      </LocalizationProvider>

      {loading && (
        <Box display="flex" alignItems="center" gap={1} mt={2}>
          <CircularProgress size={20} />
          <Typography variant="body2">
            Generating report, please wait...
          </Typography>
        </Box>
      )}

      {/* This Box is now made visible (but off-screen) when generating the PDF */}
      <Box
        ref={hiddenReportRef}
        sx={{
          display: "none",
          p: 3,
          width: "1000px",
          maxWidth: "100%",
          backgroundColor: "#fff",
          fontSize: "13px",
          textAlign: "center",
        }}>
        {/* {Object.entries(stockDayData).map(([type, rows], tIndex) => { */}
        {Object.entries(stockDayData).map(([typeRaw, rows], tIndex) => {
          const type = typeRaw.replace(/\s+/g, "").toLowerCase(); // normalize

          // Define fieldMap inside the render logic as well for consistency
          const fieldMap = {
            inwardchallan: {
              date: "InvertDate",
              refNo: "InvertNo",
              party: "AccountName",
              book1: "BookNameMarathi",
              book2: "BookName",
              inward: "inwardchallantotal",
              outward: null,
            },
            saleschallan: {
              date: "ChallanDate",
              refNo: "ChallanNo",
              party: "AccountName",
              book1: "BookNameMarathi",
              book2: "BookName",
              inward: null,
              outward: "saleschallantotal",
            },
            canvassorinvoice: {
              date: "InvoiceDate",
              refNo: "InvoiceNo",
              party: "AccountName",
              book1: "BookNameMarathi",
              book2: "BookName",
              inward: null,
              outward: "canvassortotal",
            },
            salesinvoice: {
              date: "InvoiceDate",
              refNo: "InvoiceNo",
              party: "AccountName",
              book1: "BookNameMarathi",
              book2: "BookName",
              inward: null,
              outward: "salesiinvoicetotal",
            },
            salesreturn: {
              date: "Date",
              refNo: "NoteNo",
              party: "AccountName",
              book1: "BookNameMarathi",
              book2: "BookName",
              inward: "salesreturntotal",
              outward: null,
            },
            paperoutward: {
              date: "ChallanDate",
              refNo: "ChallanNo",
              party: "AccountName",
              paper: "PaperSizeName",
              inward: null,
              outward: "PaperOutwardtotal",
            },
          };
          const fields = fieldMap[type];

          if (!fields) {
            return (
              <Box key={tIndex} mt={3}>
                <Typography variant="h6" color="error">
                  No field mapping defined for type: {type}
                </Typography>
              </Box>
            );
          }

          const totalInwardForType = rows.reduce(
            (sum, row) =>
              sum + (fields?.inward ? Number(row[fields?.inward] || 0) : 0),
            0
          );

          const totalOutwardForType = rows.reduce(
            (sum, row) =>
              sum + (fields?.outward ? Number(row[fields?.outward] || 0) : 0),
            0
          );

          return (
            <Box key={tIndex} mt={3}>
              <Typography
                variant="h6"
                style={{ fontSize: "15px", fontWeight: "bold" }}>
                {typeRaw.toUpperCase()}
              </Typography>
              <table
                style={{
                  width: "100%",
                  borderCollapse: "collapse",
                  border: "1px solid #000",
                  fontSize: "11px",
                  marginTop: "10px",
                  marginBottom: "10px",
                }}>
                <thead>
                  <tr style={{ backgroundColor: "#1976d2", color: "#fff" }}>
                    <th style={{ ...tableHeaderStyle, width: "40px" }}>
                      Sr.No
                    </th>
                    <th style={{ ...tableHeaderStyle, width: "65px" }}>
                      Party Ref No
                    </th>
                    <th style={{ ...tableHeaderStyle, width: "100px" }}>
                      Party Date
                    </th>{" "}
                    {/* Increased */}
                    <th style={{ ...tableHeaderStyle, width: "80px" }}>
                      Our Ref No
                    </th>
                    <th style={{ ...tableHeaderStyle, width: "120px" }}>
                      Name Of the Party
                    </th>{" "}
                    {/* Reduced */}
                    <th style={{ ...tableHeaderStyle, width: "100px" }}>
                      Particulars
                    </th>{" "}
                    {/* Reduced */}
                    <th style={{ ...tableHeaderStyle, width: "70px" }}>
                      Inward
                    </th>
                    <th style={{ ...tableHeaderStyle, width: "70px" }}>
                      Outward
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {rows.length === 0 ? (
                    <tr>
                      <td colSpan={8} style={tableCellStyle}>
                        No data available for this transaction type.
                      </td>
                    </tr>
                  ) : (
                    rows.map((row, i) => (
                      <tr key={i}>
                        <td style={{ ...tableCellStyle, width: "40px" }}>
                          {i + 1}
                        </td>
                        <td style={{ ...tableCellStyle, width: "65px" }}>
                          {row[fields.refNo] || "-"}
                        </td>
                        <td style={{ ...tableCellStyle, width: "100px" }}>
                          {dayjs(row[fields.date]).format("YYYY-MM-DD") || "-"}
                        </td>
                        <td style={{ ...tableCellStyle, width: "80px" }}>
                          {row["OurRefNo"] || "-"}
                        </td>
                        <td style={{ ...tableCellStyle, width: "120px" }}>
                          {row["AccountName"] || "-"}
                        </td>
                        <td style={{ ...tableCellStyle, width: "100px" }}>
                          {row[fields.book1] ||
                            row[fields.book2] ||
                            row[fields.paper] ||
                            "-"}
                        </td>
                        <td style={{ ...tableCellStyle, width: "70px" }}>
                          {fields.inward ? row[fields.inward] : "-"}
                        </td>
                        <td style={{ ...tableCellStyle, width: "70px" }}>
                          {fields.outward ? row[fields.outward] : "-"}
                        </td>
                      </tr>
                    ))
                  )}
                  {rows.length > 0 && (
                    <tr style={{ fontWeight: "bold" }}>
                      <td colSpan={5} style={tableCellStyle}></td>
                      <td style={{ ...tableCellStyle, textAlign: "center" }}>
                        TOTAL
                      </td>
                      <td style={tableCellStyle}>{totalInwardForType}</td>
                      <td style={tableCellStyle}>{totalOutwardForType}</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </Box>
          );
        })}

        {/* Removed the second hardcoded table as it seems redundant for html2canvas conversion */}
      </Box>

      <ToastContainer />
    </Box>
  );
};

// Common style for table cells and headers for hidden table
const tableCellStyle = {
  padding: "4px",
  border: "1px solid #ccc",
  textAlign: "center",
};

const tableHeaderStyle = {
  padding: "2px",
  border: "1px solid #ccc",
  textAlign: "center",
};

export default Stockdaybookreport;
