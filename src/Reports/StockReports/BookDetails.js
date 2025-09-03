import React, { useState, useRef, useEffect } from "react";
import {
  Box,
  TextField,
  Button,
  Typography,
  CircularProgress,
  Paper,
  Divider,
  Autocomplete,
  Grid,
} from "@mui/material";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import axios from "axios";
import dayjs from "dayjs";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const BookDetails = () => {
  const componentRef = useRef();

  const [fromdate, setFromDate] = useState(dayjs());
  const [todate, setToDate] = useState(dayjs());
  const [bookName, setBookName] = useState("");
  const [BookCode, setBookCode] = useState("");
  const [bookOptions, setBookOptions] = useState([]);
  const [bookReportData, setBookreportdata] = useState([]);
  const [companyName, setCompanyName] = useState("");

  useEffect(() => {
    fetchBooks();
    fetchCompanies();
  }, []);

  const fetchBooks = async () => {
    try {
      const res = await axios.get(
        "https://publication.microtechsolutions.net.in/php/Bookget.php"
      );
      const options = res.data.map((book) => ({
        value: book.Id,
        label: book.BookName || book.BookNameMarathi,
        code: book.BookCode,
      }));
      setBookOptions(options);
    } catch (error) {
      console.error("Error fetching books:", error);
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

  const fetchData = async () => {
    try {
      const res = await axios.get(
        `https://publication.microtechsolutions.net.in/php/getbookdetails.php?fromdate=${fromdate.format(
          "YYYY-MM-DD"
        )}&todate=${todate.format("YYYY-MM-DD")}&BookCode=${BookCode}`
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
    await fetchData();
    setTimeout(() => {
      openPreviewWindow();
    }, 500); // wait for DOM to render
  };

  const openPreviewWindow = async () => {
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

    const headerHeight = 15;
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

      // Header
      pdf.setFontSize(14);
      pdf.setFont("helvetica", "bold");
      // pdf.text("Phadke Prakashan, Kolhapur", pdfWidth / 2, 10, {
      //   align: "center",
      // });

      pdf.text(companyName || "Phadke Prakashan, Kolhapur", pdfWidth / 2, 10, {
        align: "center",
      });

      pdf.setFontSize(11);
      pdf.setFont("helvetica", "normal");
      pdf.text(
        `Book Details Report from ${fromdate.format(
          "DD-MM-YYYY"
        )} to ${todate.format("DD-MM-YYYY")}`,
        pdfWidth / 2,
        16,
        { align: "center" }
      );

      // Page number at top right
      pdf.setFontSize(10);
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
        variant="h5"
        mb={3}
        sx={{
          textAlign: "center",
          background: "linear-gradient(to right, #007cf0, #00dfd8)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          fontWeight: "bold",
        }}>
        Book Details Report
      </Typography>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <Box
          component={Paper}
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
                onChange={setFromDate}
                slotProps={{ textField: { fullWidth: true, size: "small" } }}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <Typography variant="subtitle2" gutterBottom>
                To Date
              </Typography>
              <DatePicker
                value={todate}
                onChange={setToDate}
                slotProps={{ textField: { fullWidth: true, size: "small" } }}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <Typography variant="subtitle2" gutterBottom>
                Book Name
              </Typography>
              <Autocomplete
                options={bookOptions}
                value={
                  bookOptions.find((option) => option.value === bookName) ||
                  null
                }
                onChange={(e, newValue) => {
                  setBookName(newValue?.value || "");
                  setBookCode(newValue?.code || "");
                }}
                getOptionLabel={(option) => option.label || ""}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    size="small"
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
              onClick={handleGeneratePDF}>
              Generate Report
            </Button>
          </Box>
        </Box>
      </LocalizationProvider>

      <Box
        ref={componentRef}
        sx={{
          position: "absolute",
          top: "-10000px",
          left: "-10000px",
          width: "1200px",
          padding: 2,
          backgroundColor: "#fff",
          zIndex: -999,
        }}>
        {Object.entries(
          bookReportData.reduce((acc, row) => {
            const title = row.BookNameMarathi || row.BookName || "—";
            if (!acc[title]) acc[title] = [];
            acc[title].push(row);
            return acc;
          }, {})
        ).map(([title, rows]) => {
          const totalSales = rows.reduce(
            (sum, r) => sum + Number(r.salestotal || 0),
            0
          );
          const totalChallan = rows.reduce(
            (sum, r) => sum + Number(r.challantotal || 0),
            0
          );
          const totalCombined = rows.reduce(
            (sum, r) => sum + Number(r.total || 0),
            0
          );

          return (
            <div key={title}>
              <h4
                style={{
                  backgroundColor: "#f2f2f2",
                  padding: "5px",
                  fontSize: "22px",
                }}>
                {title}
              </h4>
              <table
                style={{
                  width: "100%",
                  borderCollapse: "collapse",
                  fontSize: "22px",
                }}
                border="1">
                <thead>
                  <tr
                    style={{
                      backgroundColor: "#2980b9",
                      color: "white",
                      fontSize: "22px",
                    }}>
                    <th style={{ textAlign: "center" }}>Sr.No</th>
                    <th style={{ textAlign: "center" }}>Account Name</th>
                    <th style={{ textAlign: "center" }}>Sales</th>
                    <th style={{ textAlign: "center" }}>Challan</th>
                    <th style={{ textAlign: "center" }}>Total</th>
                  </tr>
                </thead>
                <tbody style={{ fontSize: "22px" }}>
                  {rows.map((r, i) => (
                    <tr key={i}>
                      <td style={{ textAlign: "center" }}>{i + 1}</td>
                      <td style={{ textAlign: "left" }}>{r.AccountName}</td>
                      <td style={{ textAlign: "right" }}>{r.salestotal}</td>
                      <td style={{ textAlign: "right" }}>{r.challantotal}</td>
                      <td style={{ textAlign: "right" }}>{r.total}</td>
                    </tr>
                  ))}
                  <tr
                    style={{
                      fontWeight: "bold",
                      backgroundColor: "#eaeaea",
                    }}>
                    <td colSpan="2" style={{ textAlign: "right" }}>
                      Total
                    </td>
                    <td style={{ textAlign: "right" }}>{totalSales}</td>
                    <td style={{ textAlign: "right" }}>{totalChallan}</td>
                    <td style={{ textAlign: "right" }}>{totalCombined}</td>
                  </tr>
                </tbody>
              </table>
              <br />
            </div>
          );
        })}
      </Box>
      <ToastContainer />
    </Box>
  );
};

export default BookDetails;
