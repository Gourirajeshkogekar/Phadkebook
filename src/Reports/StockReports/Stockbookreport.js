import React, { useState, useRef, useEffect } from "react";
import { Box, Button, Typography, Grid } from "@mui/material";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import axios from "axios";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { toast } from "react-toastify"; // Added toast import
import "react-toastify/dist/ReactToastify.css";
import CircularProgress from "@mui/material/CircularProgress";
import autoTable from "jspdf-autotable"; // Add this import

const StockBookReport = () => {
  const componentRef = useRef(); // This ref is not strictly needed for the corrected PDF generation approach
  const [fromdate, setFromDate] = useState(dayjs());
  const [todate, setToDate] = useState(dayjs());
  const [stockData, setStockData] = useState([]); // stockData state is not strictly needed for PDF generation if passing data directly
  const [loading, setLoading] = useState(false);
  const [companyName, setCompanyName] = useState("");

  useEffect(() => {
    fetchCompanies();
  }, []);

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

  const handleGeneratePDF = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `https://publication.microtechsolutions.net.in/php/getstockbook.php?fromdate=${fromdate.format(
          "YYYY-MM-DD"
        )}&todate=${todate.format("YYYY-MM-DD")}`
      );
      const data = response.data.data || [];

      if (data.length === 0) {
        toast.warn("No stock data found for the selected date range.");
        return;
      }

      // toast.info("Generating PDF, please wait...");
      await generateBookwisePDF(data);
      // toast.success("PDF generated successfully!");
    } catch (err) {
      console.error("Failed to generate PDF:", err);
      toast.error("Error generating PDF. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const generateBookwisePDF = async (dataToPrint) => {
    const pdf = new jsPDF("p", "mm", "a4");
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();
    const pxPerMm = 3.779528; // Pixels per mm (approx)

    const headerHeight = 20; // Height reserved for the header content (in mm)
    const footerHeight = 10; // Height reserved for the footer content (in mm)
    const contentMarginTop = 1; // Margin between header line and content image
    const contentMarginBottom = 5; // Margin between content image and footer line
    const sideMargin = 10; // 10mm on left and right

    // Calculate available space for the html2canvas content slice in mm
    const availableHeightForContentMm =
      pdfHeight -
      headerHeight -
      footerHeight -
      contentMarginTop -
      contentMarginBottom;
    const availableHeightForContentPx = availableHeightForContentMm * pxPerMm;

    const grouped = dataToPrint.reduce((acc, row) => {
      const title = row.BookNameMarathi || row.BookName || "—";
      const bookCode = row.BookCode || "—";
      const key = `${bookCode}-${title}`; // Use combined key for unique grouping
      if (!acc[key]) {
        acc[key] = {
          bookTitle: title,
          bookCode: bookCode,
          rows: [],
        };
      }
      acc[key].rows.push(row);
      return acc;
    }, {});

    // Create a hidden container for measuring and rendering HTML
    const measurementContainer = document.createElement("div");
    measurementContainer.style.position = "absolute";
    measurementContainer.style.top = "-9999px";
    measurementContainer.style.left = "-9999px";
    measurementContainer.style.width = "800px"; // Fixed width for rendering
    measurementContainer.style.padding = "0px"; // No padding to affect measurements
    measurementContainer.style.backgroundColor = "#fff";
    measurementContainer.style.fontFamily =
      "'Noto Sans Devanagari', sans-serif";
    document.body.appendChild(measurementContainer); // Append to body for measurement

    // Add CSS styles for rendering
    const style = document.createElement("style");
    style.textContent = `
      * {
        font-family: 'Noto Sans Devanagari', sans-serif;
        box-sizing: border-box;
      }
      table {
        width: 100%;
        border-collapse: collapse;
        font-size: 12px;
        margin-bottom: 0px;
      }
      th, td {
        border: 1px solid black;
        padding: 4px;
        text-align: center;
        vertical-align: top; /* Important for consistent row height calculation */
      }
      th {
        background-color: #2980b9;
        color: white;
      }
      .book-title {
        font-size: 14px;
        font-weight: bold;
        background-color: #eee;
        padding: 4px;
        margin-top: 10px; /* Space above title, adjust as needed */
        margin-bottom: 0px; /* No space below title before table starts */
        break-inside: avoid; /* Try to keep title with its table */
      }
      .totals {
        background-color: #ddd;
        font-weight: bold;
      }
      .table-row {
          break-inside: avoid; /* Prevent row from splitting across pages */
      }
    `;
    measurementContainer.appendChild(style);

    // Function to add header and footer to a PDF page
    const addPageHeaderAndFooter = (pageNumber) => {
      // Header
      pdf.setFontSize(14);
      pdf.setFont("helvetica", "bold");
      pdf.text(companyName || "Phadke Prakashan, Kolhapur", pdfWidth / 2, 10, {
        align: "center",
      });
      pdf.setFontSize(11);
      pdf.setFont("helvetica", "normal");
      pdf.text(
        `Stock Book Report from ${dayjs(fromdate).format(
          "DD-MM-YYYY"
        )} to ${dayjs(todate).format("DD-MM-YYYY")}`,
        pdfWidth / 2,
        16,
        { align: "center" }
      );
      // pdf.line(10, 20, pdfWidth - 10, 20); // Horizontal line after header

      // Footer
      // pdf.line(10, pdfHeight - 10, pdfWidth - 10, pdfHeight - 10); // Horizontal line before footer
      pdf.setFontSize(10);
      pdf.text(`Page ${pageNumber}`, pdfWidth - 10, 10, { align: "right" });

      // pdf.text(
      //   `Generated: ${dayjs().format("DD-MM-YYYY HH:mm")}`,
      //   10,
      //   pdfHeight - 5
      // );
    };

    let currentPageNumber = 1;
    addPageHeaderAndFooter(currentPageNumber);

    // This temporary div will hold content for the current PDF page
    let currentPageContentDiv = document.createElement("div");
    currentPageContentDiv.style.width = "100%"; // Span full width of 800px measurement container
    currentPageContentDiv.style.paddingTop = `${contentMarginTop * pxPerMm}px`; // Mimic top margin for content
    currentPageContentDiv.style.paddingBottom = `${
      contentMarginBottom * pxPerMm
    }px`; // Mimic bottom margin for content
    measurementContainer.appendChild(currentPageContentDiv);

    // Function to render the current page content and add it to PDF
    const renderCurrentPageToPdf = async () => {
      // Ensure the content is visible for html2canvas
      const currentContentHeight = currentPageContentDiv.offsetHeight;
      // console.log("Rendering page. Content height:", currentContentHeight);

      // If no content, just skip
      if (currentContentHeight === 0) return;

      const canvas = await html2canvas(currentPageContentDiv, { scale: 2 });
      const imgData = canvas.toDataURL("image/png");

      // Calculate actual height image will take on PDF
      const imgHeightMm =
        (canvas.height / pxPerMm) * (pdfWidth / (canvas.width / pxPerMm)); // Correct ratio
      // imgHeightMm = (canvas.height * pdfWidth) / canvas.width; // Simplified assuming 800px maps to pdfWidth

      pdf.addImage(
        imgData,
        "PNG",
        sideMargin, // X position
        headerHeight + contentMarginTop, // Y position
        pdfWidth - 2 * sideMargin, // Width minus left & right margin
        imgHeightMm
      );

      // Clear the current page content for the next page
      currentPageContentDiv.innerHTML = "";
      currentPageContentDiv.style.height = "auto"; // Reset height
    };

    for (const key of Object.keys(grouped)) {
      const bookData = grouped[key];
      const rows = bookData.rows;
      const bookTitle = bookData.bookTitle;
      const bookCode = bookData.bookCode;

      // Create the book title element
      const bookTitleDiv = document.createElement("div");
      bookTitleDiv.className = "book-title";
      bookTitleDiv.innerHTML = `${bookCode} - ${bookTitle}`;
      measurementContainer.appendChild(bookTitleDiv); // Temporarily append to measure
      const bookTitleHeightPx = bookTitleDiv.offsetHeight;
      measurementContainer.removeChild(bookTitleDiv); // Remove after measurement

      // Create the table header row
      const tableHeaderRowHTML = `
            <thead>
                <tr>
                    <th>Sr.No</th><th>Date</th><th>Ref No</th><th>Particulars</th>
                    <th>Inward</th><th>Outward</th><th>Balance</th>
                </tr>
            </thead>
        `;
      const tempTableForHeaderMeasurement = document.createElement("table");
      tempTableForHeaderMeasurement.innerHTML = tableHeaderRowHTML;
      tempTableForHeaderMeasurement.style.visibility = "hidden";
      tempTableForHeaderMeasurement.style.position = "absolute";
      tempTableForHeaderMeasurement.style.width = "800px"; // Match container width
      measurementContainer.appendChild(tempTableForHeaderMeasurement);
      const tableHeaderHeightPx = tempTableForHeaderMeasurement.offsetHeight;
      measurementContainer.removeChild(tempTableForHeaderMeasurement);

      // Check if book title + table header fits on current page
      const currentContentHeightPx = currentPageContentDiv.offsetHeight;
      if (
        currentContentHeightPx + bookTitleHeightPx + tableHeaderHeightPx >
        availableHeightForContentPx
      ) {
        await renderCurrentPageToPdf(); // Render existing content
        pdf.addPage();
        currentPageNumber++;
        addPageHeaderAndFooter(currentPageNumber);
      }

      // Add book title to current page content
      currentPageContentDiv.appendChild(bookTitleDiv); // Now add permanently for rendering

      // Start table for this book
      const bookTable = document.createElement("table");
      bookTable.innerHTML = tableHeaderRowHTML; // Add header to the actual table

      let currentRowCount = 0;
      const targetRowCount = 20; // Aim for 20 rows per page

      for (let i = 0; i < rows.length; i++) {
        const r = rows[i];
        const date = r.InvertNo
          ? dayjs(r.InvertDate?.date).format("YYYY-MM-DD")
          : r.ChallanNo
          ? dayjs(r.ChallanDate?.date).format("YYYY-MM-DD")
          : "—";

        const rowHTML = `
                <tr class="table-row">
                    <td>${i + 1}</td>
                    <td>${date}</td>
                    <td>${r.InvertNo || r.ChallanNo || "—"}</td>
                    <td style="text-align:left">${r.AccountName}</td>
                    <td style="text-align:right">${r.InwardTotal}</td>
                    <td style="text-align:right">${r.OutwardTotal}</td>
                    <td style="text-align:right">${r.Totalbalance}</td>
                </tr>`;

        // Temporarily create a row to measure its height
        const tempRowDiv = document.createElement("tbody");
        tempRowDiv.innerHTML = rowHTML;
        measurementContainer.appendChild(tempRowDiv); // Append to hidden container for measurement
        const rowHeightPx = tempRowDiv.offsetHeight;
        measurementContainer.removeChild(tempRowDiv);

        // Check if adding this row will exceed page height or row limit
        const estimatedNewHeightPx =
          currentPageContentDiv.offsetHeight + rowHeightPx;

        if (
          estimatedNewHeightPx > availableHeightForContentPx ||
          currentRowCount >= targetRowCount
        ) {
          // Render current page, add new page, and start new content div
          currentPageContentDiv.appendChild(bookTable); // Append current table to content div before rendering
          await renderCurrentPageToPdf();
          pdf.addPage();
          currentPageNumber++;
          addPageHeaderAndFooter(currentPageNumber);

          // Start a new table for the new page
          bookTable.remove(); // Remove previous table from DOM if it was appended
          const newBookTitleDiv = bookTitleDiv.cloneNode(true); // Clone title for new page if needed
          currentPageContentDiv.appendChild(newBookTitleDiv); // Add title to new page

          bookTable.innerHTML = tableHeaderRowHTML; // Reset table with header for new page
          currentRowCount = 0; // Reset row count for new page
        }

        // Add the row to the current table
        bookTable.insertAdjacentHTML("beforeend", rowHTML);
        currentRowCount++;
      }

      // After all rows for a book, add the totals row
      const totalInward = rows
        .reduce((a, b) => a + (+b.InwardTotal || 0), 0)
        .toFixed(2);
      const totalOutward = rows
        .reduce((a, b) => a + (+b.OutwardTotal || 0), 0)
        .toFixed(2);
      const totalBalance = rows
        .reduce((a, b) => a + (+b.Totalbalance || 0), 0)
        .toFixed(2);

      const totalsRowHTML = `
            <tr class="totals">
                <td colspan="4">Total</td>
                <td align="right">${totalInward}</td>
                <td align="right">${totalOutward}</td>
                <td align="right">${totalBalance}</td>
            </tr>`;

      // Measure totals row height
      const tempTotalsRowDiv = document.createElement("tbody");
      tempTotalsRowDiv.innerHTML = totalsRowHTML;
      measurementContainer.appendChild(tempTotalsRowDiv);
      const totalsRowHeightPx = tempTotalsRowDiv.offsetHeight;
      measurementContainer.removeChild(tempTotalsRowDiv);

      // Check if totals row fits or if we need a new page
      const estimatedNewHeightWithTotalsPx =
        currentPageContentDiv.offsetHeight + totalsRowHeightPx;
      if (estimatedNewHeightWithTotalsPx > availableHeightForContentPx) {
        currentPageContentDiv.appendChild(bookTable); // Append current table before rendering
        await renderCurrentPageToPdf();
        pdf.addPage();
        currentPageNumber++;
        addPageHeaderAndFooter(currentPageNumber);

        // Re-add title and table header on new page if breaking for totals
        const newBookTitleDiv = bookTitleDiv.cloneNode(true);
        currentPageContentDiv.appendChild(newBookTitleDiv);
        bookTable.innerHTML = tableHeaderRowHTML;
      }
      bookTable.insertAdjacentHTML("beforeend", totalsRowHTML);

      // Append the completed book table to the current page content div
      currentPageContentDiv.appendChild(bookTable);
    }

    // Render any remaining content on the last page
    if (currentPageContentDiv.offsetHeight > 0) {
      await renderCurrentPageToPdf();
    }

    // Clean up the measurement container
    document.body.removeChild(measurementContainer);

    const blob = pdf.output("blob");
    const blobUrl = URL.createObjectURL(blob);
    window.open(blobUrl, "_blank");
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
        Stock Book Report
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
    </Box>
  );
};

export default StockBookReport;
