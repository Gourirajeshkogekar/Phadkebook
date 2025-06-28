import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import React, { useState, useRef, useEffect } from "react";
import { Box, Button, Typography, Grid } from "@mui/material";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import axios from "axios";
import dayjs from "dayjs";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import CircularProgress from "@mui/material/CircularProgress";
import autoTable from "jspdf-autotable";

const Stockstmtdetailsreport = () => {
  const [fromdate, setFromDate] = useState(dayjs());
  const [todate, setToDate] = useState(dayjs());
  const hiddenReportRef = useRef();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchBooks();
  }, []);

  const [bookOptions, setBookOptions] = useState([]);

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

  const handleGenerateSummaryPDF = async () => {
    setLoading(true);
    try {
      const url = `https://publication.microtechsolutions.net.in/php/getstockstatementdetail.php?fromdate=${fromdate.format(
        "YYYY-MM-DD"
      )}&todate=${todate.format("YYYY-MM-DD")}`;
      const response = await axios.get(url);

      console.log("🔍 Full API response:", response);

      const summaryData = Array.isArray(response.data)
        ? response.data
        : response.data?.data || [];

      if (!Array.isArray(summaryData) || summaryData.length === 0) {
        toast.info("No data found for summary.");
        return;
      }

      const pdfBlob = await generateStockSummaryPDF(summaryData);
      const blobUrl = URL.createObjectURL(pdfBlob);

      const newWindow = window.open("", "_blank");
      if (!newWindow) {
        toast.error("Popup blocked. Please allow popups in your browser.");
        return;
      }

      newWindow.document.write(`
        <html>
          <head><title>Stock statement details Report</title></head>
          <body style="margin:0;">
            <embed src="${blobUrl}" type="application/pdf" width="100%" height="100%" />
          </body>
        </html>
      `);
      newWindow.document.close();
    } catch (err) {
      console.error("❌ Error during PDF generation:", err);
      toast.error("Error generating summary report.");
    } finally {
      setLoading(false);
    }
  };

  const generateStockSummaryPDF = async (summaryData) => {
    const pdf = new jsPDF("p", "mm", "a4");
    const pageWidth = pdf.internal.pageSize.getWidth();
    const margin = 10;

    const grouped = summaryData.reduce((acc, book) => {
      const standard = book.StandardName || "—";
      if (!acc[standard]) acc[standard] = [];
      acc[standard].push(book);
      return acc;
    }, {});

    const drawHeader = () => {
      pdf.setFontSize(14);
      pdf.setFont("helvetica", "normal");
      pdf.text("Phadke Prakashan, Kolhapur", pageWidth / 2, 10, {
        align: "center",
      });

      pdf.setFontSize(10);
      pdf.setFont("helvetica", "normal");
      pdf.text(
        `Stock Statement Details Report (${dayjs(fromdate).format(
          "DD-MM-YYYY"
        )} to ${dayjs(todate).format("DD-MM-YYYY")})`,
        pageWidth / 2,
        16,
        { align: "center" }
      );

      pdf.setFontSize(9);
      pdf.text(`Page ${pdf.internal.getNumberOfPages()}`, pageWidth - 10, 10, {
        align: "right",
      });
    };

    let isFirstTable = true;

    for (const [standard, books] of Object.entries(grouped)) {
      const body = books.map((book, idx) => {
        const bookRate = +book.BookRate || 0;
        const printOrder = +book.PrintOrder || 0;
        const opening = +book.OpeningStock || 0;
        const inward = +book.inwardtotal || 0;
        const missprint = +book.missprinttotal || 0;
        const sales = +book.invoicetotal || 0;
        const specimen = +book.Specimen || 0;
        const raddi = +book.radditotal || 0;
        const specimenvalue = +book.SpecimenValue || 0;

        const netSalable = opening + inward;
        const total = sales + specimen;
        const balance = netSalable - total;
        const diff = printOrder - inward;
        const amount = balance * bookRate;
        const salesValue = bookRate * sales;

        return [
          idx + 1,
          book.BookCode,
          book.BookNameMarathi || book.BookName || "—",
          bookRate.toFixed(0),
          printOrder,
          opening,
          inward,
          diff,
          missprint,
          netSalable,
          sales,
          specimen,
          raddi,
          total,
          balance,
          amount.toFixed(0),
          specimenvalue,
          salesValue.toFixed(0),
        ];
      });

      if (isFirstTable) {
        drawHeader(); // ✅ Draw header manually on the first page
      }

      const startY = pdf.lastAutoTable ? pdf.lastAutoTable.finalY + 10 : 40; // Enough margin below manual header

      pdf.setFontSize(10);
      pdf.setFont("helvetica", "bold");
      pdf.text(`Standard: ${standard}`, margin, startY);

      autoTable(pdf, {
        startY: startY + 6,
        head: [
          [
            "Sr No.",
            "Book Code",
            "Book Name",
            "Rate",
            "Print",
            "Opening",
            "Inward",
            "Diff",
            "Miss",
            "Net",
            "Sales",
            "Spec.",
            "Raddi",
            "Total",
            "Balance",
            "Amount",
            "Spec Val",
            "Sales Val",
          ],
        ],
        body,
        styles: {
          fontSize: 7,
          cellPadding: 1.5,
        },
        headStyles: {
          fillColor: [41, 128, 185],
          textColor: "#FFFFFF",
          halign: "center",
        },
        // ✅ Adjust this margin.top to give space for headers on every new page
        margin: { top: 28, left: margin, right: margin },
        didDrawPage: (data) => {
          if (!isFirstTable) {
            drawHeader();
          }
        },
      });

      // autoTable(pdf, {
      //   startY: startY + 6,
      //   head: [
      //     [
      //       "Sr No.",
      //       "Book Code",
      //       "Book Name",
      //       "Rate",
      //       "Print",
      //       "Opening",
      //       "Inward",
      //       "Diff",
      //       "Miss",
      //       "Net",
      //       "Sales",
      //       "Spec.",
      //       "Raddi",
      //       "Total",
      //       "Balance",
      //       "Amount",
      //       "Spec Val",
      //       "Sales Val",
      //     ],
      //   ],
      //   body,
      //   styles: {
      //     fontSize: 7,
      //     cellPadding: 1.5,
      //     lineWidth: 0.1, // 🟢 ADD this for visible border
      //     lineColor: [0, 0, 0], // 🟢 Border color: black
      //     halign: "center", // Optional: center-align content
      //   },
      //   headStyles: {
      //     fillColor: [41, 128, 185],
      //     textColor: "#FFFFFF",
      //     halign: "center",
      //     lineWidth: 0.2, // 🟢 Slightly thicker header borders
      //     lineColor: [0, 0, 0],
      //   },
      //   margin: { top: 28, left: margin, right: margin },
      //   didDrawPage: (data) => {
      //     if (!isFirstTable) {
      //       drawHeader();
      //     }
      //   },
      // });

      isFirstTable = false; // Flip the flag
    }

    return pdf.output("blob");
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
        Stock Statement Details Report
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
              <Typography variant="subtitle2" gutterBottom sx={{ opacity: 0 }}>
                Button
              </Typography>
              <Button
                variant="contained"
                color="primary"
                fullWidth
                onClick={handleGenerateSummaryPDF}
                sx={{
                  height: "40px",
                  textTransform: "none",
                  fontSize: "0.9rem",
                }}
                disabled={!fromdate || !todate || loading}>
                {loading ? "Generating PDF..." : "Create Report"}
              </Button>
            </Grid>
          </Grid>
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

      {/* Hidden div for html2canvas */}
      <Box
        id="summary-content"
        ref={hiddenReportRef}
        sx={{
          display: "none",
          padding: 2,
          backgroundColor: "#fff",
          width: "1000px",
        }}></Box>

      <ToastContainer position="top-right" autoClose={3000} />
    </Box>
  );
};

export default Stockstmtdetailsreport;
