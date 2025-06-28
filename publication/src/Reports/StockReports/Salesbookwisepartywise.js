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

const Salesbookwisepartywise = () => {
  const componentRef = useRef();

  const [fromdate, setFromDate] = useState(dayjs());
  const [todate, setToDate] = useState(dayjs());
  const [bookName, setBookName] = useState("");
  const [selectedBookLabel, setSelectedBookLabel] = useState("");
  const [bookOptions, setBookOptions] = useState([]);
  const [previewImage, setPreviewImage] = useState(null);
  const [showPreview, setShowPreview] = useState(false);
  const [bookReportData, setBookreportdata] = useState([]);
  const hiddenReportRef = useRef();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchBooks();
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
      console.error("Error fetching books:", error);
    }
  };

  const totalInvoiceCopies = bookReportData.reduce(
    (sum, row) => sum + Number(row.salestotal || 0),
    0
  );
  const totalsalesreturnCopies = bookReportData.reduce(
    (sum, row) => sum + Number(row.salesreturntotal || 0),
    0
  );
  const totalnetsale = bookReportData.reduce(
    (sum, row) => sum + Number(row.netsale || 0),
    0
  );

  const fetchData = async () => {
    if (!bookName) return alert("Please select a book.");

    const selectedBook = bookOptions.find((b) => b.value === bookName);
    if (!selectedBook) return;

    const bookCode = selectedBook.code;
    try {
      const res = await axios.get(
        `https://publication.microtechsolutions.net.in/php/getsalesbookwiseparty.php?fromdate=${fromdate.format(
          "YYYY-MM-DD"
        )}&todate=${todate.format("YYYY-MM-DD")}&BookCode=${bookCode}`
      );
      if (res.data && res.data.length > 0) {
        setBookreportdata(res.data);
        // setRenderPreview(true);
      } else {
        console.error("No data available for selected date range.");
        // setRenderPreview(false);
      }
    } catch (err) {
      toast.error("Error fetching data", err);
    }
  };
  const handleGeneratePDF = async () => {
    setLoading(true);
    await fetchData();

    setTimeout(() => {
      openPreviewWindow().finally(() => {
        setLoading(false);
      });
    }, 500);
  };

  const openPreviewWindow = async () => {
    setLoading(true);

    const input = componentRef.current;
    if (!input) return;

    const canvas = await html2canvas(input, {
      scale: 2,
      useCORS: true,
    });

    const imgWidth = canvas.width;
    const imgHeight = canvas.height;

    const pdf = new jsPDF("p", "mm", "a4");
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();

    const ratio = pdfWidth / imgWidth;
    const scaledHeight = imgHeight * ratio;

    const headerHeight = 20;
    const marginTop = 20;
    const marginBottom = 10;
    const availableHeight = pdfHeight - marginTop - marginBottom;

    const pageHeightPx = availableHeight / ratio;
    const totalPages = Math.ceil(imgHeight / pageHeightPx);

    for (let i = 0; i < totalPages; i++) {
      const sourceY = i * pageHeightPx;

      const pageCanvas = document.createElement("canvas");
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

      const pageImgData = pageCanvas.toDataURL("image/png");

      if (i > 0) pdf.addPage();

      // header
      pdf.setFontSize(11);
      pdf.setFont("helvetica", "bold");
      pdf.text("Phadke Prakashan, Kolhapur", pdfWidth / 2, 8, {
        align: "center",
      });

      pdf.setFontSize(11);
      pdf.setFont("helvetica", "bold");
      pdf.text(
        `Sales Bookwise Partywise from ${fromdate.format(
          "DD-MM-YYYY"
        )} to ${todate.format("DD-MM-YYYY")}`,
        pdfWidth / 2,
        12,
        { align: "center" }
      );

      pdf.setFontSize(10);
      pdf.setFont("helvetica", "bold");
      pdf.text(`Book: ${selectedBookLabel}`, pdfWidth / 2, 17, {
        align: "center",
      });

      pdf.setFontSize(10);
      pdf.setFont("helvetica", "normal");
      pdf.text(`Page ${i + 1} of ${totalPages}`, pdfWidth - 10, 10, {
        align: "right",
      });

      // Image content
      pdf.addImage(
        pageImgData,
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
        variant="h4"
        mb={3}
        sx={{
          textAlign: "center",
          background: "linear-gradient(to right, #007cf0, #00dfd8)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          textShadow: "2px 2px 4px rgba(0,0,0,0.2)",
          fontWeight: "bold",
        }}>
        Sales Bookwise Partywise
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
                onChange={(newValue) => setFromDate(newValue)}
                slotProps={{ textField: { size: "small", fullWidth: true } }}
              />
            </Grid>

            <Grid item xs={12} sm={6} md={4}>
              <Typography variant="subtitle2" gutterBottom>
                To Date
              </Typography>
              <DatePicker
                value={todate}
                onChange={(newValue) => setToDate(newValue)}
                slotProps={{ textField: { size: "small", fullWidth: true } }}
              />
            </Grid>

            <Grid item xs={12} sm={12} md={4}>
              <Typography variant="subtitle2" gutterBottom>
                Select Book
              </Typography>
              <Autocomplete
                options={bookOptions}
                value={
                  bookOptions.find((option) => option.value === bookName) ||
                  null
                }
                onChange={(event, newValue) => {
                  setBookName(newValue ? newValue.value : "");
                  setSelectedBookLabel(newValue ? newValue.label : "");
                }}
                getOptionLabel={(option) => option.label || ""}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    size="small"
                    fullWidth
                    placeholder="Select Book"
                  />
                )}
              />
            </Grid>
          </Grid>

          <Box textAlign="center" mt={3}>
            <Button
              variant="contained"
              color="primary"
              onClick={handleGeneratePDF}
              sx={{ fontSize: "0.85rem", textTransform: "none" }}>
              Generate PDF
            </Button>
          </Box>
        </Box>
      </LocalizationProvider>

      {loading && (
        <Typography variant="body2" color="textSecondary" mt={1}>
          Generating report, please wait...
        </Typography>
      )}
      {/* Hidden content for PDF rendering */}
      <Box
        ref={componentRef}
        sx={{
          position: "absolute",
          top: "-9999px",
          left: "-9999px",
          width: "600px",
          backgroundColor: "#fff",
          fontSize: "13px",
          textAlign: "center",
        }}>
        <Box mt={3}>
          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
              fontSize: "11px", // Increased here
            }}
            border="1">
            <thead>
              <tr
                style={{
                  backgroundColor: "#2980b9",
                  color: "white",
                  fontSize: "11px",
                }}>
                <th style={{ textAlign: "center" }}>Sr.No</th>

                <th style={{ textAlign: "center" }}>Particulars</th>
                <th style={{ textAlign: "center" }}>Sales Invoice Copies</th>
                <th style={{ textAlign: "center" }}>Sales Return</th>
                <th style={{ textAlign: "center" }}>Net Sale</th>
              </tr>
            </thead>
            <tbody>
              {bookReportData.map((row, index) => (
                <tr key={index}>
                  <td>{index + 1}</td>

                  <td style={{ textAlign: "left" }}>{row.AccountName}</td>
                  <td style={{ textAlign: "right" }}>{row.salestotal}</td>
                  <td style={{ textAlign: "right" }}>{row.salesreturntotal}</td>
                  <td style={{ textAlign: "right" }}>{row.netsale}</td>
                </tr>
              ))}
            </tbody>

            <tfoot>
              <tr style={{ backgroundColor: "#e0e0e0", fontWeight: "bold" }}>
                <td></td>
                <td style={{ border: "1px solid #ccc" }}>Total</td>
                <td
                  style={{
                    border: "1px solid #ccc",
                    textAlign: "right",
                  }}>
                  {totalInvoiceCopies}
                </td>
                <td
                  style={{
                    border: "1px solid #ccc",
                    textAlign: "right",
                  }}>
                  {totalsalesreturnCopies}
                </td>
                <td
                  style={{
                    border: "1px solid #ccc",
                    textAlign: "right",
                  }}>
                  {totalnetsale}
                </td>
              </tr>
            </tfoot>
          </table>
        </Box>
      </Box>
      <ToastContainer />
    </Box>
  );
};

export default Salesbookwisepartywise;
