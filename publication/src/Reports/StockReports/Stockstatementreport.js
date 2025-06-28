import React, { useRef, useState } from "react";
import { Box, Button, Typography, TextField, Grid } from "@mui/material";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider, DatePicker } from "@mui/x-date-pickers";
import dayjs from "dayjs";
import axios from "axios";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

const StockStatement = () => {
  const componentRef = useRef();
  const [data, setData] = useState([]);
  const [fromdate, setFromDate] = useState(dayjs());
  const [todate, setToDate] = useState(dayjs());

  const fetchData = async () => {
    try {
      const res = await axios.get(
        `https://publication.microtechsolutions.net.in/php/getstockstatement.php?fromdate=${fromdate.format(
          "YYYY-MM-DD"
        )}&todate=${todate.format("YYYY-MM-DD")}`
      );
      setData(res.data.data || []);
    } catch (err) {
      console.error("Error fetching data", err);
    }
  };

  const handleGenerateReport = async () => {
    await fetchData();
    setTimeout(() => {
      openPreviewWindow();
    }, 500); // wait for DOM to render
  };

  const openPreviewWindow = async () => {
    const input = componentRef.current;
    if (!input) return;

    const canvas = await html2canvas(input, { scale: 2, useCORS: true });
    const imgData = canvas.toDataURL("image/png");

    const pdf = new jsPDF("p", "mm", "a4");
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();

    const imgWidth = pdfWidth;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;

    let heightLeft = imgHeight;
    let position = 0;
    let pageNumber = 1;

    // Add first page
    pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
    pdf.setFontSize(10);
    pdf.text(`Page ${pageNumber}`, pdfWidth - 20, 10);

    heightLeft -= pdfHeight;

    while (heightLeft > 0) {
      position = heightLeft - imgHeight;
      pdf.addPage();
      pageNumber++;
      pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
      pdf.text(`Page ${pageNumber}`, pdfWidth - 20, 10);
      heightLeft -= pdfHeight;
    }

    const blob = pdf.output("blob");
    const blobURL = URL.createObjectURL(blob);
    window.open(blobURL);
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
        Stock Statement Report
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
                onClick={handleGenerateReport}
                sx={{
                  height: "40px",
                  textTransform: "none",
                  fontSize: "0.9rem",
                }}>
                Generate Report
              </Button>
            </Grid>
          </Grid>
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
        <Typography align="center" fontWeight="bold" fontSize="20px">
          Phadke Prakashan, Kolhapur
        </Typography>
        <Typography align="center" fontSize="20px" fontWeight="bold">
          Stock Statement from {fromdate.format("DD-MM-YYYY")} to{" "}
          {todate.format("DD-MM-YYYY")}
        </Typography>

        <table
          border="1"
          cellPadding="5"
          style={{
            borderCollapse: "collapse",
            width: "100%",
            marginTop: 10,
            fontSize: "15px",
            fontFamily: "Devanagari, Arial",
          }}>
          <thead style={{ backgroundColor: "#2980b9", color: "#fff" }}>
            <tr>
              <th>Sr.No</th>
              <th>Particulars</th>
              <th>Opening Stock</th>
              <th>Inward</th>
              <th>Misprint</th>
              <th>Purchase</th>
              <th>Purchase Return</th>
              <th>Total</th>
              <th>Sales</th>
              <th>Sales Return</th>
              <th>Specimen</th>
              <th>Raddi</th>
              <th>Total</th>
              <th>Closing Stock</th>
            </tr>
          </thead>
          <tbody style={{ fontSize: "15px" }}>
            {data.map((row, i) => {
              const opening = Number(row.OpeningStock || 0);
              const inward = Number(row.inwardtotal || 0);
              const misprint = Number(row.missprinttotal || 0);
              const purchase = Number(row.purchasetotal || 0);
              const purchasereturn = Number(row.purchasereturntotal || 0);

              const sales = Number(row.invoicetotal || 0);
              const salesreturn = Number(row.salesreturntotal || 0);
              const specimen = Number(row.Specimen || 0);
              const raddi = Number(row.radditotal || 0);

              const total1 =
                opening + inward + misprint + purchase + purchasereturn;
              const total2 = sales - salesreturn + specimen + raddi;
              const closingStock = total1 - total2;

              return (
                <tr key={i}>
                  <td style={{ textAlign: "right" }}>{i + 1}</td>
                  <td style={{ textAlign: "left" }}>
                    {row.BookName || row.BookNameMarathi || "—"}
                  </td>
                  <td style={{ textAlign: "right" }}>{opening}</td>
                  <td style={{ textAlign: "right" }}>{inward}</td>
                  <td style={{ textAlign: "right" }}>{misprint}</td>
                  <td style={{ textAlign: "right" }}>{purchase}</td>
                  <td style={{ textAlign: "right" }}>{purchasereturn}</td>
                  <td style={{ textAlign: "right", fontWeight: "bold" }}>
                    {total1}
                  </td>
                  <td style={{ textAlign: "right" }}>{sales}</td>
                  <td style={{ textAlign: "right" }}>{salesreturn}</td>
                  <td style={{ textAlign: "right" }}>{specimen}</td>
                  <td style={{ textAlign: "right" }}>{raddi}</td>
                  <td style={{ textAlign: "right", fontWeight: "bold" }}>
                    {total2}
                  </td>
                  <td style={{ textAlign: "right" }}>{closingStock}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </Box>{" "}
    </Box>
  );
};

export default StockStatement;
