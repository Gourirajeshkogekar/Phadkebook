import React, { useState, useRef, useEffect } from "react";
import { Box, TextField, Button, Typography, Paper, Grid } from "@mui/material";
import { LocalizationProvider, DatePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import axios from "axios";
import jsPDF from "jspdf";
import { ToastContainer, toast } from "react-toastify";

function CashflowmonthwiseReports() {
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
      const url = `https://publication.microtechsolutions.net.in/php/cashflowmonth.php?fromdate=${dayjs(
        fromdate
      ).format("YYYY-MM-DD")}&todate=${dayjs(todate).format("YYYY-MM-DD")}`;
      const res = await axios.get(url);
      const data = res.data || [];

      const doc = new jsPDF();
      const pageWidth = doc.internal.pageSize.getWidth();
      let y = 20;

      doc.setFontSize(14).setFont("times", "bold");
      doc.text(companyName || "M. V. Phadke & Co. Kolhapur", pageWidth / 2, y, {
        align: "center",
      });

      y += 8;
      doc.setFontSize(11).setFont("times", "bold");
      doc.text(
        "Phadke Bhavan, Near Hari Mandir, Dudhali Kolhapur 416012",
        pageWidth / 2,
        y,
        { align: "center" }
      );

      y += 7;
      doc.setFontSize(12);
      doc.text("Cash Flow Monthwise Register", pageWidth / 2, y, {
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
      doc.setFont("times", "bold");
      doc.text("Month-Year", 20, y);
      doc.text("Opening Balance", 70, y, { align: "right" });
      doc.text("Debit", 100, y, { align: "right" });
      doc.text("Credit", 130, y, { align: "right" });
      doc.text("Closing Balance", 180, y, { align: "right" });

      y += 6;
      doc.setFont("times", "normal");

      let totalcredit = 0;
      let totalclosingstock = 0;

      data.forEach((row, index) => {
        const [day, month] = row.MonthName.split("-");
        const formattedMonthName = `${month}-${day}`;
        const openingBalance =
          index === 0 ? "" : data[index - 1].RunningTotal || "0.00";

        doc.text(formattedMonthName, 20, y);
        doc.text(openingBalance.toString(), 70, y, { align: "right" });
        doc.text(row.debit || "", 100, y, { align: "right" });
        doc.text(row.Ttl_AMt || "0.00", 130, y, { align: "right" });
        doc.text(row.RunningTotal || "0.00", 180, y, { align: "right" });

        totalcredit += parseFloat(row.Ttl_AMt || 0);
        totalclosingstock += parseFloat(row.RunningTotal || 0);

        y += 6;

        if (y > 280) {
          doc.addPage();
          y = 20;
          doc.setFont("times", "bold");
          doc.text("Month-Year", 20, y);
          doc.text("Opening Balance", 60, y, { align: "right" });
          doc.text("Debit", 100, y, { align: "right" });
          doc.text("Credit", 130, y, { align: "right" });
          doc.text("Closing Balance", 180, y, { align: "right" });
          y += 6;
          doc.setFont("times", "normal");
        }
      });

      y += 4;
      doc.setFont("times", "bold");
      doc.text("Grand Total", 90, y);
      doc.text(totalcredit.toFixed(2), 130, y, { align: "right" });
      doc.text(totalclosingstock.toFixed(2), 180, y, { align: "right" });

      // ✅ Add Page Numbers after content is created
      const pageCount = doc.internal.getNumberOfPages();
      for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        doc.setFontSize(9);
        doc.text(
          `Page ${i} of ${pageCount}`,
          pageWidth - 10,
          10, // <-- Top margin
          { align: "right" }
        );
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
        Cash Flow Monthwise Report
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

export default CashflowmonthwiseReports;
