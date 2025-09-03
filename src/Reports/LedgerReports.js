import React, { useState, useRef, useEffect } from "react";
import { Box, TextField, Button, Typography, Paper, Grid } from "@mui/material";
import { LocalizationProvider, DatePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import axios from "axios";
import jsPDF from "jspdf";
import { ToastContainer, toast } from "react-toastify";

function LedgerReports() {
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

  // ✅ Function to add header and column titles
  const addHeader = (doc, pageWidth, fromdate, todate, companyName) => {
    let y = 20;

    // Header
    doc.setFontSize(14).setFont("times", "bold");
    doc.text(companyName || "M. V. Phadke & Co. Kolhapur", pageWidth / 2, y, {
      align: "center",
    });

    y += 8;
    doc.setFontSize(12).setFont("times", "bold");
    doc.text("LEDGER", pageWidth / 2, y, { align: "center" });

    y += 6;
    doc.setFontSize(10).setFont("times", "bold");
    doc.text(
      `From ${dayjs(fromdate).format("DD-MM-YYYY")} To ${dayjs(todate).format(
        "DD-MM-YYYY"
      )}`,
      pageWidth / 2,
      y,
      { align: "center" }
    );

    // Column Headers
    y += 10;
    doc.setFont("times", "bold");
    doc.text("Date", 12, y, { align: "right" });
    doc.text("Tr.Type", 32, y, { align: "right" });
    doc.text("Particulars", 100, y, { align: "right" });
    // doc.text("Particular", 120, y, { align: "right" });
    doc.text("ChequeNo", 150, y, { align: "right" });
    doc.text("Debit", 168, y, { align: "right" });
    doc.text("Credit", 185, y, { align: "right" });
    doc.text("Balance", 207, y, { align: "right" });

    return (y += 2); // return the next Y position
    doc.setFont("times", "normal");
  };

  const generateReport = async () => {
    if (!fromdate || !todate) {
      toast.error("Please select both dates");
      return;
    }

    try {
      const url = `https://publication.microtechsolutions.net.in/php/ledgerreport.php?fromdate=${dayjs(
        fromdate
      ).format("YYYY-MM-DD")}&todate=${dayjs(todate).format("YYYY-MM-DD")}`;
      const res = await axios.get(url);
      const data = res.data || [];

      if (data.length === 0) {
        toast.error("No data found for the selected dates");
        return;
      }

      // ✅ Group data by GroupName and AccountName
      const groupedData = {};
      data.forEach((row) => {
        const group = row.GroupName || "Others";
        const account = row.AccountName || "Unknown";
        if (!groupedData[group]) groupedData[group] = {};
        if (!groupedData[group][account]) groupedData[group][account] = [];
        groupedData[group][account].push(row);
      });

      const doc = new jsPDF("p", "mm", "a4");
      const pageWidth = doc.internal.pageSize.getWidth();
      let y = 0;

      // ✅ Function to add page header dynamically
      const addPageHeader = () => {
        y = 15;
        doc.setFontSize(14).setFont("times", "bold");
        doc.text(
          companyName || "M. V. Phadke & Co. Kolhapur",
          pageWidth / 2,
          y,
          {
            align: "center",
          }
        );

        y += 7;
        doc.setFontSize(12).setFont("times", "bold");
        doc.text("LEDGER", pageWidth / 2, y, { align: "center" });

        y += 6;
        doc.setFontSize(10).setFont("times", "bold");
        doc.text(
          `From ${dayjs(fromdate).format("DD-MM-YYYY")} To ${dayjs(
            todate
          ).format("DD-MM-YYYY")}`,
          pageWidth / 2,
          y,
          { align: "center" }
        );

        // Table header
        y += 10;
        doc.setFont("times", "bold");
        doc.text("Date", 12, y, { align: "right" });
        doc.text("Tr.Type", 32, y, { align: "right" });
        doc.text("Particulars", 90, y, { align: "right" });
        // doc.text("Particular", 120, y, { align: "right" });
        doc.text("ChequeNo", 150, y, { align: "right" });
        doc.text("Debit", 168, y, { align: "right" });
        doc.text("Credit", 185, y, { align: "right" });
        doc.text("Balance", 207, y, { align: "right" });
        y += 6;
        doc.setFont("times", "normal");
      };

      // ✅ Add header for first page
      addPageHeader();

      // ✅ Loop through each group and account
      Object.keys(groupedData).forEach((group) => {
        // Group header
        doc.setFont("times", "bold");
        doc.text(group, 90, y);
        y += 8;

        Object.keys(groupedData[group]).forEach((account) => {
          const transactions = groupedData[group][account];

          // Account header
          doc.setFont("times", "bold");
          doc.text(account, 90, y);
          y += 6;

          // Opening balance logic
          let balance = 0;
          let totalDebit = 0;
          let totalCredit = 0;

          doc.setFont("times", "italic");

          transactions.forEach((row) => {
            if (y > 280) {
              doc.addPage();
              addPageHeader();
            }

            const amount = parseFloat(row.Amount) || 0;
            const debit = row.DorC === "D" ? amount : 0;
            const credit = row.DorC === "C" ? amount : 0;

            totalDebit += debit;
            totalCredit += credit;
            balance = totalCredit - totalDebit;

            // FIX: Use DorC field to determine Dr/Cr for the transaction balance
            let balanceType = row.DorC === "D" ? "Dr" : "Cr";
            const displayBalance = `${Math.abs(balance).toFixed(
              2
            )} ${balanceType}`;

            doc.setFontSize(10);
            doc.text(row.Date, 18, y, { align: "right" });
            doc.text(row.TrType.toString(), 25, y, { align: "right" });
            doc.text(row.Particular || "", 80, y, { align: "right" });
            doc.text(row.Particulars || "", 130, y, { align: "right" });
            doc.text(row.ChequeNo || "", 148, y, { align: "right" });
            doc.text(debit ? debit.toFixed(2) : "", 168, y, { align: "right" });
            doc.text(credit ? credit.toFixed(2) : "", 185, y, {
              align: "right",
            });
            doc.text(displayBalance, 210, y, { align: "right" });

            y += 6;
          });

          // ✅ Account total
          if (y > 280) {
            doc.addPage();
            addPageHeader();
          }
          doc.setFont("times", "bold");
          doc.text("Total/Balance :", 130, y);
          doc.text(totalDebit.toFixed(2), 168, y, { align: "right" });
          doc.text(totalCredit.toFixed(2), 185, y, { align: "right" });
          doc.text(
            `${Math.abs(balance).toFixed(2)} ${balance >= 0 ? "Cr" : "Dr"}`,
            210,
            y,
            {
              align: "right",
            }
          );
          y += 8;
        });

        y += 4; // space after group
      });

      // ✅ Page numbers
      const pageCount = doc.internal.getNumberOfPages();
      for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        doc.setFontSize(9);
        doc.text(`Page ${i} of ${pageCount}`, pageWidth - 10, 10, {
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
        Ledger
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

export default LedgerReports;
