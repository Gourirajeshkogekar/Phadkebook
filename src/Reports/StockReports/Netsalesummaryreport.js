import React, { useState, useRef, useEffect } from "react";
import {
  TextField,
  Button,
  Box,
  Typography,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Paper,
  Autocomplete,
  Grid,
} from "@mui/material";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";

import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import dayjs from "dayjs";

function Netsalesummaryreport() {
  const componentRef = useRef();

  const [fromdate, setFromDate] = useState(dayjs());
  const [todate, setToDate] = useState(dayjs());
  const [data, setData] = useState([]);
  const [companyName, setCompanyName] = useState("");

  const totalValues = data.reduce(
    (acc, item) => {
      const other = Number(item.Other) || 0;
      const pp = Number(item.PP) || 0;
      return {
        other: acc.other + other,
        pp: acc.pp + pp,
        total: acc.total + (other + pp),
      };
    },
    { other: 0, pp: 0, total: 0 }
  );

  const fetchData = async () => {
    try {
      const res = await axios.get(
        `https://publication.microtechsolutions.net.in/php/getnetsalessummarypartywise.php?fromdate=${fromdate}&todate=${todate}`
      );
      if (res.data && res.data.length > 0) {
        setData(res.data);

        console.log(data, "data from netsale summary");
      } else {
        toast.info("No data found for the selected date range.");
      }
    } catch (err) {
      console.error("Fetch Error:", err);
      toast.error("Error fetching data");
    }
  };

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
    try {
      const res = await axios.get(
        `https://publication.microtechsolutions.net.in/php/getnetsalessummarypartywise.php?fromdate=${fromdate.format(
          "YYYY-MM-DD"
        )}&todate=${todate.format("YYYY-MM-DD")}`
      );
      if (res.data && res.data.length > 0) {
        setData(res.data);
        setTimeout(() => {
          openPreviewWindow(res.data); // Pass fetched data directly
        }, 100); // Give a small delay for rendering
      } else {
        toast.info("No data found for the selected date range.");
      }
    } catch (err) {
      console.error("Fetch Error:", err);
      toast.error("Error fetching data");
    }
  };

  const openPreviewWindow = async (reportData) => {
    const input = componentRef.current;
    if (!input) return;

    const canvas = await html2canvas(componentRef.current, {
      scale: 2,
      useCORS: true,
    });

    const pdf = new jsPDF("p", "mm", "a4");
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();

    const ratio = pdfWidth / canvas.width;
    const pageHeightPx = (pdfHeight - 30) / ratio;
    const totalPages = Math.ceil(canvas.height / pageHeightPx);

    for (let i = 0; i < totalPages; i++) {
      const sourceY = i * pageHeightPx;

      const pageCanvas = document.createElement("canvas");
      pageCanvas.width = canvas.width;
      pageCanvas.height = Math.min(pageHeightPx, canvas.height - sourceY);

      const ctx = pageCanvas.getContext("2d");
      ctx.drawImage(
        canvas,
        0,
        sourceY,
        canvas.width,
        pageCanvas.height,
        0,
        0,
        canvas.width,
        pageCanvas.height
      );

      const imgData = pageCanvas.toDataURL("image/png");
      if (i > 0) pdf.addPage();

      pdf.setFontSize(14);
      pdf.setFont("helvetica", "bold");
      pdf.text(companyName || "Phadke Prakashan, Kolhapur", pdfWidth / 2, 10, {
        align: "center",
      });

      pdf.setFontSize(11);
      pdf.text(
        `Net sale Summary from ${fromdate.format(
          "DD-MM-YYYY"
        )} to ${todate.format("DD-MM-YYYY")}`,
        pdfWidth / 2,
        16,
        { align: "center" }
      );

      pdf.setFontSize(10);
      pdf.setFont("helvetica", "normal");

      pdf.text(`Page ${i + 1} of ${totalPages}`, pdfWidth - 10, 10, {
        align: "right",
      });

      pdf.addImage(
        imgData,
        "PNG",
        0,
        20,
        pdfWidth,
        (pageCanvas.height * pdfWidth) / canvas.width
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
          textShadow: "2px 2px 4px rgba(0,0,0,0.2)",
          fontWeight: "bold",
        }}>
        Net Sale Summary
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

      {data.length > 0 && (
        <div
          ref={componentRef}
          style={{
            fontSize: "18px", // 👈 sets smaller font size
            width: "1000px", // 👈 ensure consistent width for pdf
            padding: "10px",
            position: "absolute",
            left: "-9999px", // hide from screen
          }}>
          {" "}
          {/* ← This is the missing ID */}
          <Paper elevation={3} style={{ marginTop: 20, overflowX: "auto" }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>
                    <strong>Sr.No</strong>
                  </TableCell>
                  <TableCell>
                    <strong>Account</strong>
                  </TableCell>
                  <TableCell align="right">
                    <strong>Other</strong>
                  </TableCell>
                  <TableCell align="right">
                    <strong>PP</strong>
                  </TableCell>
                  <TableCell align="right">
                    <strong>Total</strong>
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {data.map((row, idx) => {
                  const other = Number(row.Other) || 0;
                  const pp = Number(row.PP) || 0;
                  const total = other + pp;

                  return (
                    <TableRow key={idx}>
                      <TableCell>{idx + 1}</TableCell>
                      <TableCell>{row.AccountName}</TableCell>
                      <TableCell align="right">{other.toFixed(2)}</TableCell>
                      <TableCell align="right">{pp.toFixed(2)}</TableCell>
                      <TableCell align="right">{total.toFixed(2)}</TableCell>
                    </TableRow>
                  );
                })}
                <TableRow>
                  <TableCell />
                  <TableCell>
                    <strong>Total</strong>
                  </TableCell>
                  <TableCell align="right">
                    <strong>{totalValues.other.toFixed(2)}</strong>
                  </TableCell>
                  <TableCell align="right">
                    <strong>{totalValues.pp.toFixed(2)}</strong>
                  </TableCell>
                  <TableCell align="right">
                    <strong>
                      {(totalValues.other + totalValues.pp).toFixed(2)}
                    </strong>
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </Paper>
        </div>
      )}
    </Box>
  );
}

export default Netsalesummaryreport;
