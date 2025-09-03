import React, { useState, useRef, useEffect } from "react";
import { Box, TextField, Button, Typography, Paper, Grid } from "@mui/material";
import { LocalizationProvider, DatePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import axios from "axios";
import jsPDF from "jspdf";
import { ToastContainer, toast } from "react-toastify";

function PurchaseregisterReports() {
  const [fromdate, setFromDate] = useState(dayjs());
  const [todate, setToDate] = useState(dayjs());
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
        setCompanyName(response.data[0].CompanyName);
      }
    } catch (error) {
      console.error("Error fetching companies:", error);
    }
  };

  // const generateReport = async () => {
  //   if (!fromdate || !todate) {
  //     toast.error("Please select both dates");
  //     return;
  //   }

  //   try {
  //     const url = `https://publication.microtechsolutions.net.in/php/purchaseregister.php?fromdate=${dayjs(
  //       fromdate
  //     ).format("YYYY-MM-DD")}&todate=${dayjs(todate).format("YYYY-MM-DD")}`;
  //     const res = await axios.get(url);
  //     const data = res.data || [];

  //     // const doc = new jsPDF();

  //     const doc = new jsPDF("landscape", "mm", "a4");
  //     const pageWidth = doc.internal.pageSize.getWidth();
  //     const pageHeight = doc.internal.pageSize.getHeight();
  //     let y = 20;

  //     doc.setFontSize(14).setFont("times", "bold");
  //     doc.text(companyName || "M. V. Phadke & Co. Kolhapur", pageWidth / 2, y, {
  //       align: "center",
  //     });

  //     y += 8;
  //     doc.setFontSize(12);
  //     doc.text("Purchase Register", pageWidth / 2, y, { align: "center" });
  //     y += 6;
  //     doc.setFontSize(10);
  //     doc.text(
  //       `From ${dayjs(fromdate).format("DD-MM-YYYY")} to ${dayjs(todate).format(
  //         "DD-MM-YYYY"
  //       )}`,
  //       pageWidth / 2,
  //       y,
  //       { align: "center" }
  //     );

  //     y += 10;

  //     // ---------- Table Header ----------
  //     doc.setFont("times", "bold");
  //     doc.text("Date", 18, y, { align: "right" });
  //     doc.text("PV No", 30, y, { align: "right" });
  //     doc.text("Supplier Name", 90, y, { align: "right" });
  //     doc.text("GSTIN", 130, y, { align: "right" });
  //     doc.text("Bill No", 150, y, { align: "right" });
  //     doc.text("Bill Amount", 170, y, { align: "right" });
  //     doc.text("Type", 190, y, { align: "right" });
  //     doc.text("Account Head", 240, y, { align: "right" });
  //     doc.text("Amount", 260, y, { align: "right" });
  //     y += 6;
  //     doc.setFont("times", "normal");

  //     let totalbillamount = 0;
  //     data.forEach((row) => {
  //       const supplierText = doc.splitTextToSize(
  //         String(row.SupplierName || ""),
  //         90
  //       ); // width for Supplier Name
  //       const accountText = doc.splitTextToSize(
  //         String(row.Accounthead || ""),
  //         40
  //       ); // width for Account Head
  //       const maxLines = Math.max(supplierText.length, accountText.length);
  //       const rowHeight = maxLines * 5; // 5px per line for readability

  //       // Print Date & PV (single line fields)
  //       doc.text(String(row.PurchaseDate || ""), 18, y, { align: "right" });
  //       doc.text(String(row.PurchaseNo || ""), 30, y, { align: "right" });

  //       // Supplier Name (wrapped)
  //       supplierText.forEach((line, i) => {
  //         doc.text(line, 90, y + i * 5, { align: "right" });
  //       });

  //       // GSTIN
  //       doc.text(String(row.GSTNo || ""), 130, y, { align: "right" });

  //       // Bill No
  //       doc.text(String(row.BillNo || ""), 150, y, { align: "right" });

  //       // Bill Amount
  //       doc.text(String(row.BillAmt || "0.00"), 170, y, { align: "right" });

  //       // Type
  //       doc.text(String(row.Type || ""), 190, y, { align: "right" });

  //       // Account Head (wrapped)
  //       accountText.forEach((line, i) => {
  //         doc.text(line, 240, y + i * 5, { align: "right" });
  //       });

  //       // Amount
  //       doc.text(String(row.BillAmt || "0.00"), 260, y, { align: "right" });

  //       // After drawing all columns, move y for the next row
  //       y += rowHeight + 3; // Add some padding between rows

  //       if (y > 280) {
  //         doc.addPage();
  //         y = 20;
  //         // Re-draw headers here if needed
  //       }

  //       totalbillamount += parseFloat(row.BillAmt || 0);

  //       if (y > 280) {
  //         doc.addPage();
  //         y = 20;

  //         doc.setFont("times", "bold");
  //         doc.text("Date", 18, y, { align: "right" });
  //         doc.text("PV", 30, y, { align: "right" });
  //         doc.text("Supplier Name", 90, y, { align: "right" });
  //         doc.text("GSTIN", 130, y, { align: "right" });
  //         doc.text("Bill No", 150, y, { align: "right" });
  //         doc.text("Bill Amount", 170, y, { align: "right" });
  //         doc.text("Type", 190, y, { align: "right" });
  //         doc.text("Account Head", 240, y, { align: "right" });
  //         doc.text("Amount", 260, y, { align: "right" });
  //         y += 6;
  //         doc.setFont("times", "normal");
  //       }
  //     });

  //     y += 4;
  //     doc.setFont("times", "bold");
  //     doc.text("Total", 90, y);
  //     doc.text(totalbillamount.toFixed(2), 170, y, { align: "right" });
  //     doc.text(totalbillamount.toFixed(2), 260, y, { align: "right" });

  //     // ----------- ✅ Add Page Numbers -----------
  //     const pageCount = doc.internal.getNumberOfPages();
  //     for (let i = 1; i <= pageCount; i++) {
  //       doc.setPage(i);
  //       doc.setFontSize(9);
  //       doc.text(`Page ${i} of ${pageCount}`, pageWidth - 15, 10, {
  //         align: "right",
  //       });
  //     }

  //     window.open(doc.output("bloburl"), "_blank");
  //   } catch (err) {
  //     console.error(err);
  //     toast.error("Error generating report");
  //   }
  // };

  const generateReport = async () => {
    if (!fromdate || !todate) {
      toast.error("Please select both dates");
      return;
    }

    try {
      const url = `https://publication.microtechsolutions.net.in/php/purchaseregister.php?fromdate=${dayjs(
        fromdate
      ).format("YYYY-MM-DD")}&todate=${dayjs(todate).format("YYYY-MM-DD")}`;
      const res = await axios.get(url);
      const data = res.data || [];

      if (data.length === 0) {
        toast.error("No data found for the selected dates");
        return;
      }

      const doc = new jsPDF("landscape", "mm", "a4");
      const pageWidth = doc.internal.pageSize.getWidth();
      const pageHeight = doc.internal.pageSize.getHeight();
      let y = 20;

      // ✅ Header Function
      const addPageHeader = () => {
        doc.setFontSize(14).setFont("times", "bold");
        doc.text(
          companyName || "M. V. Phadke & Co. Kolhapur",
          pageWidth / 2,
          15,
          {
            align: "center",
          }
        );

        doc.setFontSize(12);
        doc.text("Purchase Register", pageWidth / 2, 23, { align: "center" });

        doc.setFontSize(10);
        doc.text(
          `From ${dayjs(fromdate).format("DD-MM-YYYY")} to ${dayjs(
            todate
          ).format("DD-MM-YYYY")}`,
          pageWidth / 2,
          30,
          { align: "center" }
        );

        y = 40;
        addTableHeader();
      };

      // ✅ Table Header Function
      const addTableHeader = () => {
        doc.setFont("times", "bold");
        doc.text("Date", 18, y, { align: "right" });
        doc.text("PV No", 30, y, { align: "right" });
        doc.text("Supplier Name", 90, y, { align: "right" });
        doc.text("GSTIN", 130, y, { align: "right" });
        doc.text("Bill No", 150, y, { align: "right" });
        doc.text("Bill Amount", 170, y, { align: "right" });
        doc.text("Type", 190, y, { align: "right" });
        doc.text("Account Head", 240, y, { align: "right" });
        doc.text("Amount", 260, y, { align: "right" });
        y += 6;
        doc.setFont("times", "normal");
      };

      addPageHeader();

      let totalbillamount = 0;

      for (const row of data) {
        const supplierText = doc.splitTextToSize(
          String(row.SupplierName || ""),
          90
        );
        const accountText = doc.splitTextToSize(
          String(row.Accounthead || ""),
          40
        );
        const maxLines = Math.max(supplierText.length, accountText.length);
        const rowHeight = maxLines * 5 + 3;

        // ✅ Check if row fits in current page
        if (y + rowHeight > pageHeight - 20) {
          doc.addPage();
          addPageHeader();
        }

        // ✅ Print row
        doc.text(String(row.PurchaseDate || ""), 18, y, { align: "right" });
        doc.text(String(row.PurchaseNo || ""), 30, y, { align: "right" });

        supplierText.forEach((line, i) => {
          doc.text(line, 90, y + i * 5, { align: "right" });
        });

        doc.text(String(row.GSTNo || ""), 130, y, { align: "right" });
        doc.text(String(row.BillNo || ""), 150, y, { align: "right" });
        doc.text(String(row.BillAmt || "0.00"), 170, y, { align: "right" });
        doc.text(String(row.Type || ""), 190, y, { align: "right" });

        accountText.forEach((line, i) => {
          doc.text(line, 240, y + i * 5, { align: "right" });
        });

        doc.text(String(row.BillAmt || "0.00"), 260, y, { align: "right" });

        y += rowHeight;

        totalbillamount += parseFloat(row.BillAmt || 0);
      }

      // ✅ Print Total
      if (y + 10 > pageHeight) {
        doc.addPage();
        addPageHeader();
      }
      y += 4;
      doc.setFont("times", "bold");
      doc.text("Total", 90, y);
      doc.text(totalbillamount.toFixed(2), 170, y, { align: "right" });
      doc.text(totalbillamount.toFixed(2), 260, y, { align: "right" });

      // ✅ Page Numbers
      const pageCount = doc.internal.getNumberOfPages();
      for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        doc.setFontSize(9);
        doc.text(`Page ${i} of ${pageCount}`, pageWidth - 15, 10, {
          align: "right",
        });
      }

      window.open(doc.output("bloburl"), "_blank");
    } catch (err) {
      console.error(err);
      toast.error("Error generating report");
    }
  };

  return (
    <Box
      sx={{
        p: 4,
        background: "linear-gradient(to bottom right, #f0f4f8, #ffffff)",
        minHeight: "100vh",
      }}>
      <Typography
        variant="h5"
        mb={4}
        sx={{
          textAlign: "center",
          fontWeight: "bold",
          background: "linear-gradient(to right, #007cf0, #00dfd8)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
        }}>
        Purchase Register Report
      </Typography>

      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <Paper
          elevation={3}
          sx={{
            p: 3,
            borderRadius: 3,
            background: "#ffffff",
            maxWidth: 700,
            mx: "auto",
            boxShadow: "0px 6px 20px rgba(0,0,0,0.1)",
          }}>
          <Grid container spacing={3} alignItems="center">
            <Grid item xs={12} sm={6}>
              <Typography variant="subtitle2" gutterBottom>
                From Date
              </Typography>
              <DatePicker
                value={fromdate}
                onChange={setFromDate}
                slotProps={{
                  textField: {
                    fullWidth: true,
                    size: "small",
                  },
                }}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <Typography variant="subtitle2" gutterBottom>
                To Date
              </Typography>
              <DatePicker
                value={todate}
                onChange={setToDate}
                slotProps={{
                  textField: {
                    fullWidth: true,
                    size: "small",
                  },
                }}
              />
            </Grid>

            <Grid item xs={12} textAlign="center" mt={2}>
              <Button
                variant="contained"
                onClick={generateReport}
                sx={{
                  px: 4,
                  py: 1.2,
                  borderRadius: 2,
                  fontWeight: "bold",
                  fontSize: "1rem",
                  background: "linear-gradient(to right, #007cf0, #00dfd8)",
                  boxShadow: "0px 4px 14px rgba(0,0,0,0.2)",
                  "&:hover": {
                    background: "linear-gradient(to right, #0062cc, #00c0b2)",
                  },
                }}>
                Generate Report
              </Button>
            </Grid>
          </Grid>
        </Paper>
      </LocalizationProvider>

      <ToastContainer />
    </Box>
  );
}

export default PurchaseregisterReports;
