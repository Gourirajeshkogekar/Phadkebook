import React, { useState, useEffect } from "react";
import axios from "axios";
import dayjs from "dayjs";
import {
  Box,
  Button,
  Typography,
  CircularProgress,
  Grid,
  Paper,
  Divider,
} from "@mui/material";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import jsPDF from "jspdf";

function Paperoutwardpaperwise() {
  const [loading, setLoading] = useState(false);
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
        `https://publication.microtechsolutions.net.in/php/getpaperoutward.php?todate=${todate.format(
          "YYYY-MM-DD"
        )}&fromdate=${fromdate.format("YYYY-MM-DD")}`
      );
      const data = res.data || [];

      const groupedData = data.reduce((acc, row) => {
        const paper = row.PaperSizeName;
        const party = row.AccountName;
        if (!acc[paper]) acc[paper] = {};
        if (!acc[paper][party]) acc[paper][party] = [];
        acc[paper][party].push(row);
        return acc;
      }, {});

      const doc = new jsPDF("p", "mm", "a4");
      const pageWidth = doc.internal.pageSize.getWidth();

      let y = 20;
      let pageNumber = 1;

      const addPageNumber = (doc, pageNum) => {
        doc.setTextColor(0);
        doc.setFontSize(10);

        doc.text(`Page ${pageNum}`, pageWidth - 20, 10);
      };

      doc.setTextColor(0);

      const addHeader = () => {
        doc.setFontSize(13);
        doc.setFont(undefined, "bold");

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
        doc.setFont(undefined, "bold");

        doc.text("Paper Outward Paperwise Report", pageWidth / 2, y, {
          align: "center",
        });
        y += 6;
        doc.setFontSize(11);
        doc.setFont(undefined, "bold");

        doc.text(
          `From Date: ${fromdate.format(
            "DD-MM-YYYY"
          )}  To Date: ${todate.format("DD-MM-YYYY")}`,
          pageWidth / 2,
          y,
          { align: "center", marginBottom: "10px" }
        );
        y += 10; // 👈 Adds space below the header
      };
      addPageNumber(doc, pageNumber);

      addHeader();
      for (const [paperType, parties] of Object.entries(groupedData)) {
        doc.setTextColor(0);
        doc.setFont(undefined, "bold");
        doc.setFontSize(11);
        doc.text(paperType, pageWidth / 2, y, { align: "center" });
        y += 6;

        for (const [partyName, entries] of Object.entries(parties)) {
          doc.setFont(undefined, "bold");
          doc.setFontSize(11);
          doc.text(partyName, pageWidth / 2, y, { align: "center" });
          y += 6;

          const startX = 14;
          const rowHeight = 6;

          const cols = [
            { label: "Tr.Cd.", width: 20 },
            { label: "DC No.", width: 20 },
            { label: "Date", width: 25 },
            { label: "Godown", width: 50 },
            { label: "Bundles", width: 30 },
            { label: "Qty", width: 25 },
            { label: "Unit", width: 20 },
          ];

          doc.setFont(undefined, "bold");
          doc.setFontSize(10);
          doc.setDrawColor(0);
          doc.setLineWidth(0.1);

          let colX = startX;
          cols.forEach((col) => {
            doc.rect(colX, y, col.width, rowHeight);
            doc.text(col.label, colX + 2, y + 4);
            colX += col.width;
          });
          y += rowHeight;

          doc.setFont(undefined, "normal");
          let totalQty = 0;

          for (const row of entries) {
            colX = startX;
            const values = [
              "OT",
              row.ChallanNo || "",
              dayjs(row.ChallanDate).format("DD-MM-YYYY"),
              row.GodownName || "",
              row.Bundle || "",
              parseFloat(row.Quantity || 0).toFixed(2),
              row.Unit || "",
            ];

            cols.forEach((col, i) => {
              doc.rect(colX, y, col.width, rowHeight);
              const text = String(values[i]);

              if (["Bundles", "Qty"].includes(col.label)) {
                const textWidth = doc.getTextWidth(text);
                doc.text(text, colX + col.width - 2 - textWidth, y + 4);
              } else {
                doc.text(text, colX + 2, y + 4);
              }

              colX += col.width;
            });

            totalQty += parseFloat(row.Quantity || 0);
            y += rowHeight;

            if (y > 270) {
              doc.addPage();
              y = 20;
              pageNumber++;
              addPageNumber(doc, pageNumber);
              addHeader(); // 👈 Add header here as well
            }
          }

          // Total row
          doc.setFont(undefined, "bold");
          colX = startX;
          let mergedWidth =
            cols[0].width +
            cols[1].width +
            cols[2].width +
            cols[3].width +
            cols[4].width;

          doc.rect(colX, y, mergedWidth, rowHeight);
          doc.text("Total Qty", colX + 2, y + 4);
          colX += mergedWidth;

          doc.rect(colX, y, cols[5].width, rowHeight); // Qty column
          const totalText = totalQty.toFixed(2);
          const textWidth = doc.getTextWidth(totalText);
          doc.text(totalText, colX + cols[5].width - 2 - textWidth, y + 4);
          colX += cols[5].width;

          // Draw Unit column box (empty cell)
          doc.rect(colX, y, cols[6].width, rowHeight);
          y += rowHeight + 6;

          if (y > 270) {
            doc.addPage();
            y = 20;
            pageNumber++;
            addPageNumber(doc, pageNumber);
          }
        }
      }

      const blob = doc.output("blob");
      const url = URL.createObjectURL(blob);
      window.open(url, "_blank");
    } catch (error) {
      console.error("Error generating PDF report", error);
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
            Paper Outward Paperwise Report
          </Typography>
          <Divider sx={{ my: 2 }} />

          <Grid container spacing={2} mb={3}>
            <Grid item xs={12} sm={6}>
              <DatePicker
                label="From Date"
                value={fromdate}
                onChange={(newVal) => setFromDate(newVal)}
                slotProps={{ textField: { fullWidth: true } }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <DatePicker
                label="To Date"
                value={todate}
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

export default Paperoutwardpaperwise;
