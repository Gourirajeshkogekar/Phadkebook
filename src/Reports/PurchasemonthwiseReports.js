import React, { useState, useRef, useEffect } from "react";
import { Box, TextField, Button, Typography, Paper, Grid } from "@mui/material";
import { LocalizationProvider, DatePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import axios from "axios";
import jsPDF from "jspdf";
import { ToastContainer, toast } from "react-toastify";

function PurchasemonthwiseReports() {
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
      const url = `https://publication.microtechsolutions.net.in/php/purchasemonthwise.php?fromdate=${dayjs(
        fromdate
      ).format("YYYY-MM-DD")}&todate=${dayjs(todate).format("YYYY-MM-DD")}`;
      const res = await axios.get(url);
      const data = res.data || [];

      const doc = new jsPDF();
      const pageWidth = doc.internal.pageSize.getWidth();
      let y = 20;
      let pageNumber = 1;

      // Helper function to print page number at top-right
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
      doc.text("Purchase Register Monthly Summary", pageWidth / 2, y, {
        align: "center",
      });

      y += 6;

      // Show selected month/year in header
      const monthYear = dayjs(fromdate).format("MMMM YYYY");
      doc.setFontSize(10).setFont("times", "italic");
      doc.text(`Month: ${monthYear}`, pageWidth / 2, y, { align: "center" });

      y += 10;

      // Table header
      doc.setFont("times", "bold");
      doc.text("Type of Purchase", 20, y);
      doc.text("Basic", 70, y, { align: "right" });
      doc.text("Sales Tax", 100, y, { align: "right" });
      doc.text("Other", 130, y, { align: "right" });

      y += 6;
      doc.setFont("times", "normal");

      let totalbasic = 0;

      data.forEach((row) => {
        doc.text(row.Type, 20, y);
        doc.text(row.Basic.toString(), 70, y, { align: "right" });
        doc.text(row.salestax || "", 100, y, { align: "right" });
        doc.text(row.other || "", 130, y, { align: "right" });

        totalbasic += parseFloat(row.Basic || 0);

        y += 6;

        if (y > 280) {
          doc.addPage();
          pageNumber++;
          printPageNumber();
          y = 20;
          doc.setFont("times", "bold");
          doc.text("Type of Purchase", 20, y);
          doc.text("Basic", 70, y, { align: "right" });
          doc.text("Sales Tax", 100, y, { align: "right" });
          doc.text("Other", 130, y, { align: "right" });
          y += 6;
          doc.setFont("times", "normal");
        }
      });

      y += 4;
      doc.setFont("times", "bold");
      doc.text("**Total**", 20, y);
      doc.text(totalbasic.toFixed(2), 70, y, { align: "right" });

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
        Purchase Register Monthly Summary
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

export default PurchasemonthwiseReports;
