import React, { useState, useRef, useEffect } from "react";
import { Box, TextField, Button, Typography, Paper, Grid } from "@mui/material";
import { LocalizationProvider, DatePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import axios from "axios";
import jsPDF from "jspdf";
import { ToastContainer, toast } from "react-toastify";

function PurchaseregistersummaryReports() {
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

  const generateReport = async () => {
    if (!fromdate || !todate) {
      toast.error("Please select both dates");
      return;
    }

    try {
      const url = `https://publication.microtechsolutions.net.in/php/purchaseregistersummary.php?fromdate=${dayjs(
        fromdate
      ).format("YYYY-MM-DD")}&todate=${dayjs(todate).format("YYYY-MM-DD")}`;
      const res = await axios.get(url);
      const data = res.data || [];

      // Group data by AccountName
      const groupedData = data.reduce((acc, row) => {
        if (!acc[row.AccountName]) acc[row.AccountName] = [];
        acc[row.AccountName].push(row);
        return acc;
      }, {});

      const doc = new jsPDF();
      const pageWidth = doc.internal.pageSize.getWidth();
      let y = 20;
      let pageNumber = 1;

      // Totals for columns
      let totalBasic = 0,
        totalSalesTax = 0,
        totalOther = 0,
        totalServiceTax = 0,
        totalCess = 0,
        grandTotal = 0;

      const printPageNumber = () => {
        doc.setFontSize(10).setFont("times", "normal");
        doc.text(`Page ${pageNumber}`, pageWidth - 10, 10, { align: "right" });
      };

      // First page number
      printPageNumber();

      // Company Name
      doc.setFontSize(14).setFont("times", "bold");
      doc.text(companyName || "M. V. Phadke & Co. Kolhapur", pageWidth / 2, y, {
        align: "center",
      });

      y += 8;

      // Report title
      doc.setFontSize(12);
      doc.text("Purchase Register Summary", pageWidth / 2, y, {
        align: "center",
      });

      y += 6;

      doc.setFontSize(10);
      doc.text(
        `From ${dayjs(fromdate).format("DD-MM-YYYY")} to ${dayjs(todate).format(
          "DD-MM-YYYY"
        )}`,
        pageWidth / 2,
        y,
        { align: "center" }
      );

      y += 10;

      // Month in header
      const monthYear = dayjs(fromdate).format("MMMM YYYY");
      doc.setFontSize(10).setFont("times", "italic");
      // doc.text(`Month: ${monthYear}`, pageWidth / 2, y, { align: "center" });

      // y += 10;

      const printTableHeader = () => {
        doc.setFont("times", "bold");
        doc.text("Type of Purchase", 20, y);
        doc.text("Basic", 70, y, { align: "right" });
        doc.text("Sales Tax", 90, y, { align: "right" });
        doc.text("Other", 110, y, { align: "right" });
        doc.text("Service Tax", 130, y, { align: "right" });
        doc.text("Cess on Service tax", 160, y, { align: "right" });
        doc.text("Total", 180, y, { align: "right" });
        y += 6;
        doc.setFont("times", "normal");
      };

      // Loop through each AccountName group
      for (const accountName in groupedData) {
        // AccountName heading
        doc.setFont("times", "bold");
        doc.text(accountName, 20, y);
        y += 6;

        // Table header
        printTableHeader();

        groupedData[accountName].forEach((row) => {
          const basic = parseFloat(row.Basic) || 0;
          const salesTax = parseFloat(row.salestax) || 0;
          const other = parseFloat(row.other) || 0;
          const serviceTax = parseFloat(row.servicetax) || 0;
          const cess = parseFloat(row.cess) || 0;
          const rowTotal = basic + salesTax + other + serviceTax + cess;

          doc.text(row.Type, 20, y);
          doc.text(basic.toFixed(2), 70, y, { align: "right" });
          doc.text(salesTax.toFixed(2), 90, y, { align: "right" });
          doc.text(other.toFixed(2), 110, y, { align: "right" });
          doc.text(serviceTax.toFixed(2), 130, y, { align: "right" });
          doc.text(cess.toFixed(2), 160, y, { align: "right" });
          doc.text(rowTotal.toFixed(2), 180, y, { align: "right" });

          totalBasic += basic;
          totalSalesTax += salesTax;
          totalOther += other;
          totalServiceTax += serviceTax;
          totalCess += cess;
          grandTotal += rowTotal;

          y += 6;

          // Page break
          if (y > 280) {
            doc.addPage();
            pageNumber++;
            printPageNumber();
            y = 20;
          }
        });

        y += 4; // Space between groups
      }

      // Grand total row
      doc.setFont("times", "bold");
      doc.text("TOTAL", 20, y);
      doc.text(totalBasic.toFixed(2), 70, y, { align: "right" });
      doc.text(totalSalesTax.toFixed(2), 90, y, { align: "right" });
      doc.text(totalOther.toFixed(2), 110, y, { align: "right" });
      doc.text(totalServiceTax.toFixed(2), 130, y, { align: "right" });
      doc.text(totalCess.toFixed(2), 160, y, { align: "right" });
      doc.text(grandTotal.toFixed(2), 180, y, { align: "right" });

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
        Purchase Register Summary Report
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

export default PurchaseregistersummaryReports;
