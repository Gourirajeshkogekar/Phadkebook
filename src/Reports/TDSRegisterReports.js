import React, { useEffect, useState } from "react";
import {
  Container,
  Typography,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Paper,
  Divider,
  Box,
} from "@mui/material";
import { TextField, Button, Grid } from "@mui/material";

import axios from "axios";

import { LocalizationProvider, DatePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import jsPDF from "jspdf";
import { ToastContainer, toast } from "react-toastify";

function TDSRegisterReports() {
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
  //     const url = `https://publication.microtechsolutions.net.in/php/TDSregister.php?fromdate=${dayjs(
  //       fromdate
  //     ).format("YYYY-MM-DD")}&todate=${dayjs(todate).format("YYYY-MM-DD")}`;
  //     const res = await axios.get(url);
  //     const data = res.data || [];

  //     const doc = new jsPDF();
  //     const pageWidth = doc.internal.pageSize.getWidth();
  //     let y = 20;

  //     doc.setFontSize(14).setFont("times", "bold");
  //     doc.text(companyName || "M. V. Phadke & Co. Kolhapur", pageWidth / 2, y, {
  //       align: "center",
  //     });

  //     y += 8;
  //     // doc.setFontSize(11).setFont("times", "bold");
  //     // doc.text(
  //     //   "Phadke Bhavan, Near Hari Mandir, Dudhali Kolhapur 416012",
  //     //   pageWidth / 2,
  //     //   y,
  //     //   { align: "center" }
  //     // );

  //     // y += 7;
  //     doc.setFontSize(12);
  //     doc.text("TDS Register", pageWidth / 2, y, {
  //       align: "center",
  //     });

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
  //     doc.setFont("times", "bold");
  //     doc.text("Trans-Date", 20, y);
  //     doc.text("Entry No", 65, y, { align: "right" });
  //     doc.text("Trans-Code", 100, y, { align: "right" });
  //     doc.text("Amount", 130, y, { align: "right" });
  //     doc.text("Rate", 150, y, { align: "right" });
  //     doc.text("TDS Amount", 180, y, { align: "right" });

  //     y += 6;
  //     doc.setFont("times", "normal");

  //     let totalamount = 0;
  //     let totaltdsamount = 0;
  //     let section = 0;
  //     data.forEach((row) => {
  //       doc.text(row.PurchaseDate?.toString() || "", 20, y);
  //       doc.text(row.PurchaseNo?.toString() || "", 60, y, { align: "right" });
  //       doc.text(row.TransCD?.toString() || "", 90, y, { align: "right" });
  //       doc.text(row.AMT?.toString() || "0", 130, y, { align: "right" });
  //       doc.text(row.TDSPercentage?.toString() || "0", 150, y, {
  //         align: "right",
  //       });
  //       doc.text(parseFloat(row.TDSAmount || 0).toFixed(2), 180, y, {
  //         align: "right",
  //       });

  //       totalamount += parseFloat(row.AMT) || 0;
  //       totaltdsamount += parseFloat(row.TDSAmount) || 0;
  //       section = row.Section || "";
  //       y += 6;

  //       if (y > 280) {
  //         doc.addPage();
  //         y = 20;
  //         doc.setFont("times", "bold");
  //         doc.text("Trans-Date", 20, y);
  //         doc.text("Entry No", 65, y, { align: "right" });
  //         doc.text("Trans-Code", 100, y, { align: "center" });
  //         doc.text("Amount", 130, y, { align: "right" });
  //         doc.text("Rate", 150, y, { align: "right" });
  //         doc.text("TDS Amount", 180, y, { align: "right" });
  //         y += 6;
  //         doc.setFont("times", "normal");
  //       }
  //     });

  //     y += 4;
  //     doc.setFont("times", "bold");
  //     doc.text("Sub Total", 20, y);

  //     doc.text(section, 65, y, { align: "right" });

  //     doc.text(totalamount.toFixed(2), 130, y, { align: "right" });
  //     doc.text(totaltdsamount.toFixed(2), 180, y, { align: "right" });

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
      const url = `https://publication.microtechsolutions.net.in/php/TDSregister.php?fromdate=${dayjs(
        fromdate
      ).format("YYYY-MM-DD")}&todate=${dayjs(todate).format("YYYY-MM-DD")}`;
      const res = await axios.get(url);
      const data = res.data || [];

      // Group data by section -> vendor
      const grouped = {};
      data.forEach((row) => {
        const section = `${row.Section} : ${row.TDSHead} `;
        const vendorKey = `${row.AccountName}##${row.PANNo}##${row.Address1}##${row.StateName}##${row.CityName}`;
        if (!grouped[section]) grouped[section] = {};
        if (!grouped[section][vendorKey]) grouped[section][vendorKey] = [];
        grouped[section][vendorKey].push(row);
      });

      const doc = new jsPDF();
      const pageWidth = doc.internal.pageSize.getWidth();
      let pageNumber = 1;
      let y = 20;

      // Function to print page number
      const printPageNumber = () => {
        doc.setFontSize(10).setFont("times", "normal");
        doc.text(`Page ${pageNumber}`, pageWidth - 20, 10, { align: "right" });
      };

      // First page number
      printPageNumber();

      // Title
      doc.setFontSize(14).setFont("times", "bold");
      doc.text(companyName || "M. V. Phadke & Co. Kolhapur", pageWidth / 2, y, {
        align: "center",
      });
      y += 8;
      doc.setFontSize(12);
      doc.text("TDS Register", pageWidth / 2, y, { align: "center" });
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

      Object.keys(grouped).forEach((section) => {
        doc.setFont("times", "bold");
        doc.text(section, 20, y);
        y += 6;

        let sectionTotalAmt = 0;
        let sectionTotalTDS = 0;

        Object.keys(grouped[section]).forEach((vendorKey) => {
          const [vendorName, vendorPAN, vendorAddr] = vendorKey.split("##");

          // Vendor header
          doc.setFont("times", "bold");
          doc.text(`${vendorName}   PAN NO.: ${vendorPAN}`, 20, y);
          y += 5;
          doc.setFont("times", "normal");
          doc.text(vendorAddr, 20, y);
          y += 6;

          // Table header
          doc.setFont("times", "bold");
          doc.text("Trans Date", 20, y);
          doc.text("Entry No", 55, y, { align: "right" });
          doc.text("Trans Cd", 85, y, { align: "right" });
          doc.text("Amount", 115, y, { align: "right" });
          doc.text("Rate", 140, y, { align: "right" });
          doc.text("TDS Amount", 180, y, { align: "right" });
          y += 5;
          doc.setFont("times", "normal");

          let vendorTotalAmt = 0;
          let vendorTotalTDS = 0;

          grouped[section][vendorKey].forEach((row) => {
            doc.text(row.PurchaseDate?.toString() || "", 20, y);
            doc.text(row.PurchaseNo?.toString() || "", 55, y, {
              align: "right",
            });
            doc.text(row.TransCD?.toString() || "", 85, y, { align: "right" });
            doc.text(parseFloat(row.AMT || 0).toFixed(2), 115, y, {
              align: "right",
            });
            doc.text(`${row.TDSPercentage || 0}%`, 140, y, { align: "right" });
            doc.text(parseFloat(row.TDSAmount || 0).toFixed(2), 180, y, {
              align: "right",
            });

            vendorTotalAmt += parseFloat(row.AMT) || 0;
            vendorTotalTDS += parseFloat(row.TDSAmount) || 0;

            y += 5;
            if (y > 280) {
              doc.addPage();
              pageNumber++;
              printPageNumber();
              y = 20;
            }
          });

          // Vendor subtotal
          doc.setFont("times", "bold");
          doc.text("Sub Total", 20, y);
          doc.text(vendorTotalAmt.toFixed(2), 115, y, { align: "right" });
          doc.text(vendorTotalTDS.toFixed(2), 180, y, { align: "right" });
          y += 8;

          sectionTotalAmt += vendorTotalAmt;
          sectionTotalTDS += vendorTotalTDS;
        });

        // Section total
        doc.setFont("times", "bold");
        doc.text("Section Total", 20, y);
        doc.text(sectionTotalAmt.toFixed(2), 115, y, { align: "right" });
        doc.text(sectionTotalTDS.toFixed(2), 180, y, { align: "right" });
        y += 10;
      });

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
        TDS Register Report
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

export default TDSRegisterReports;
