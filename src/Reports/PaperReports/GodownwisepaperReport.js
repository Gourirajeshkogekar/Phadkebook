import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  Typography,
  CircularProgress,
  Grid,
  Divider,
  Paper,
} from "@mui/material";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import jsPDF from "jspdf";
import axios from "axios";

function GodownwisepaperReport() {
  const [fromDate, setFromDate] = useState(dayjs());
  const [toDate, setToDate] = useState(dayjs());
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

  const handleGenerateReport = async () => {
    setLoading(true);
    try {
      const res = await axios.get(
        `https://publication.microtechsolutions.net.in/php/getgodownpaper.php?fromdate=${fromDate.format(
          "YYYY-MM-DD"
        )}&todate=${toDate.format("YYYY-MM-DD")}`
      );
      const data = res.data || [];

      const grouped = data.reduce((acc, row) => {
        const godown = row.GodownName;
        const paper = row.PaperSizeName;

        if (!acc[godown]) acc[godown] = {};
        if (!acc[godown][paper]) acc[godown][paper] = [];
        acc[godown][paper].push(row);
        return acc;
      }, {});

      const doc = new jsPDF("p", "mm", "a4");
      const pageWidth = doc.internal.pageSize.getWidth();
      let y = 20;
      let pageNumber = 1;

      const addPageNumber = () => {
        doc.setFontSize(10);
        doc.text(`Page ${pageNumber}`, pageWidth - 20, 10);
      };
      const addHeader = () => {
        doc.setFontSize(13).setFont(undefined, "bold");
        doc.text(
          companyName || "Phadke Prakashan, Kolhapur",
          pageWidth / 2,
          y,
          {
            align: "center",
          }
        );
        y += 6;
        doc.setFontSize(12);
        doc.text("Godown-wise Paperwise Partywise Report", pageWidth / 2, y, {
          align: "center",
        });
        y += 6;
        doc.setFontSize(11);
        doc.text(
          `From: ${fromDate.format("DD-MM-YYYY")} To: ${toDate.format(
            "DD-MM-YYYY"
          )}`,
          pageWidth / 2,
          y,
          { align: "center" }
        );
        y += 10;
        addPageNumber();
      };

      addHeader();

      for (const [godown, paperGroups] of Object.entries(grouped)) {
        doc.setFont(undefined, "bold").setFontSize(11);
        doc.text(godown, pageWidth / 2, y, { align: "left" });
        y += 6;

        for (const [paper, entries] of Object.entries(paperGroups)) {
          doc.setFont(undefined, "bold").setFontSize(10);
          doc.text(paper, pageWidth / 2, y, { align: "center" });
          y += 6;

          const startX = 14;
          const rowHeight = 6;
          const cols = [
            { label: "DC No.", width: 20 },
            { label: "Date", width: 25 },
            { label: "Particulars", width: 60 },
            { label: "Bundles", width: 20 },
            { label: "Inward Qty", width: 25 },
            { label: "Outward Qty", width: 25 },
            { label: "Unit", width: 15 },
          ];

          doc.setFontSize(9).setFont(undefined, "bold");
          let colX = startX;
          cols.forEach((col) => {
            doc.rect(colX, y, col.width, rowHeight);
            doc.text(col.label, colX + 2, y + 4);
            colX += col.width;
          });
          y += rowHeight;
          doc.setFont(undefined, "normal");

          let totalInward = 0;
          let totalOutward = 0;

          for (const row of entries) {
            const values = [
              row.ChallanNo,
              dayjs(row.ChallanDate).format("DD-MM-YYYY"),
              row.AccountName,
              row.OutwardBundles,
              parseFloat(row.InwardQuantity || 0).toFixed(3),
              parseFloat(row.OutwardQuantity || 0).toFixed(3),
              row.Unit,
            ];

            colX = startX;
            cols.forEach((col, i) => {
              doc.rect(colX, y, col.width, rowHeight);
              const text = String(values[i]);
              const alignRight = [
                "Bundles",
                "Inward Qty",
                "Outward Qty",
              ].includes(col.label);
              if (alignRight) {
                const textWidth = doc.getTextWidth(text);
                doc.text(text, colX + col.width - 2 - textWidth, y + 4);
              } else {
                doc.text(text, colX + 2, y + 4);
              }
              colX += col.width;
            });

            totalInward += parseFloat(row.InwardQuantity || 0);
            totalOutward += parseFloat(row.OutwardQuantity || 0);
            y += rowHeight;

            if (y > 270) {
              doc.addPage();
              y = 20;
              pageNumber++;

              addHeader();
            }
          }

          // Subtotal row
          doc.setFont(undefined, "bold");
          colX = startX;
          const subtotalLabel = "Sub Total " + paper;
          const mergeCols = cols[0].width + cols[1].width + cols[2].width;
          doc.rect(colX, y, mergeCols, rowHeight);
          doc.text(subtotalLabel, colX + 2, y + 4);
          colX += mergeCols;

          doc.rect(colX, y, cols[3].width, rowHeight); // Bundles (skip)
          colX += cols[3].width;

          doc.rect(colX, y, cols[4].width, rowHeight);
          const inText = totalInward.toFixed(3);
          doc.text(
            inText,
            colX + cols[4].width - 2 - doc.getTextWidth(inText),
            y + 4
          );
          colX += cols[4].width;

          doc.rect(colX, y, cols[5].width, rowHeight);
          const outText = totalOutward.toFixed(3);
          doc.text(
            outText,
            colX + cols[5].width - 2 - doc.getTextWidth(outText),
            y + 4
          );
          colX += cols[5].width;

          doc.rect(colX, y, cols[6].width, rowHeight); // Unit
          y += rowHeight + 6;
        }
      }

      const blob = doc.output("blob");
      const url = URL.createObjectURL(blob);
      window.open(url, "_blank");
    } catch (err) {
      console.error("Error generating report", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Box sx={{ p: 3, display: "flex", justifyContent: "center" }}>
        <Paper elevation={3} sx={{ p: 4, width: "100%", maxWidth: 700 }}>
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
            {" "}
            Godown-wise Paper Report
          </Typography>
          <Divider sx={{ my: 2 }} />

          <Grid container spacing={2} mb={3}>
            <Grid item xs={12} sm={6}>
              <DatePicker
                label="From Date"
                value={fromDate}
                onChange={(newVal) => setFromDate(newVal)}
                slotProps={{ textField: { fullWidth: true } }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <DatePicker
                label="To Date"
                value={toDate}
                onChange={(newVal) => setToDate(newVal)}
                slotProps={{ textField: { fullWidth: true } }}
              />
            </Grid>
          </Grid>

          <Box textAlign="center">
            <Button
              variant="contained"
              color="primary"
              onClick={handleGenerateReport}
              disabled={loading}
              sx={{ minWidth: 200 }}>
              {loading ? "Generating..." : "Generate Report"}
            </Button>
          </Box>

          {loading && (
            <Box mt={3} textAlign="center">
              <CircularProgress />
              <Typography mt={1}>Generating PDF report...</Typography>
            </Box>
          )}
        </Paper>
      </Box>
    </LocalizationProvider>
  );
}

export default GodownwisepaperReport;
