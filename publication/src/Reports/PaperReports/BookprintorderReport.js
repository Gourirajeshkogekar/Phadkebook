import React, { useState } from "react";
import {
  Box,
  Button,
  Typography,
  CircularProgress,
  Paper,
  Divider,
  Grid,
} from "@mui/material";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import jsPDF from "jspdf";
import axios from "axios";

function BookprintorderReport() {
  const [fromDate, setFromDate] = useState(dayjs());
  const [toDate, setToDate] = useState(dayjs());
  const [loading, setLoading] = useState(false);

  const handleGenerateReport = async () => {
    setLoading(true);
    try {
      const res = await axios.get(
        `https://publication.microtechsolutions.net.in/php/getbookprintorder.php?fromdate=${fromDate.format(
          "YYYY-MM-DD"
        )}&todate=${toDate.format("YYYY-MM-DD")}`
      );

      const data = res.data || [];
      const grouped = data.reduce((acc, row) => {
        const group = row.StandardName;
        if (!acc[group]) acc[group] = [];
        acc[group].push(row);
        return acc;
      }, {});

      const doc = new jsPDF({
        orientation: "p",
        unit: "mm",
        format: "a4",
      });

      const pageWidth = doc.internal.pageSize.getWidth();
      let y = 20;
      let page = 1;

      const addHeader = () => {
        doc.setFontSize(13).setFont(undefined, "bold");
        doc.text("Phadke Prakashan, Kolhapur", pageWidth / 2, y, {
          align: "center",
        });
        y += 6;
        doc.setFontSize(12);
        doc.text("Paper Consumption Details", pageWidth / 2, y, {
          align: "center",
        });
        y += 6;
        doc.setFontSize(11);
        doc.text(
          `From ${fromDate.format("DD-MM-YYYY")} to ${toDate.format(
            "DD-MM-YYYY"
          )}`,
          pageWidth / 2,
          y,
          { align: "center" }
        );
        y += 6;
        doc.setFontSize(10);
        doc.text(`Page ${page}`, pageWidth - 20, 10);
        y += 4;
      };

      // Define grouped columns
      const groupedColumns = [
        { title: "Trans. Dt.", width: 17 },
        { title: "Order No.", width: 10 },
        { title: "Book Code", width: 11 },
        { title: "Book Name", width: 30 },
        { title: "Copies", width: 13 },
        { title: "Forms", sub: ["From", "To", "Nos"], widths: [9, 7, 7] },
        { title: "Particulars", width: 18 },
        { title: "Paper Size", width: 18 },
        { title: "Book Pages", width: 13 },
        { title: "Paper Consumption", width: 22 },
        { title: "Reams", width: 13 },
        { title: "Remarks", width: 14 },
      ];

      // Flatten widths for row rendering
      const flatWidths = groupedColumns.flatMap((col) =>
        col.widths ? col.widths : [col.width]
      );

      addHeader();

      for (const [standard, rows] of Object.entries(grouped)) {
        const requiredSpace = 20;
        if (y + requiredSpace > 280) {
          doc.addPage();
          y = 20;
          page++;
          addHeader();
        }
        y += 6;

        doc.setFontSize(10).setFont(undefined, "bold");
        doc.text(standard, 10, y);
        y += 8;

        // Draw 2-level header
        const firstRowHeight = 6;
        const secondRowHeight = 6;
        let x = 5;

        groupedColumns.forEach((col) => {
          const totalWidth = col.width || col.widths.reduce((a, b) => a + b, 0);
          if (col.sub) {
            doc.rect(x, y, totalWidth, firstRowHeight);
            doc.text(col.title, x + totalWidth / 2, y + 4, { align: "center" });
          } else {
            doc.rect(x, y, totalWidth, firstRowHeight + secondRowHeight);
            const lines = doc.splitTextToSize(col.title, totalWidth - 2);
            lines.forEach((line, idx) => {
              doc.text(line, x + 1, y + 4 + idx * 4);
            });
          }
          x += totalWidth;
        });

        x = 5;
        groupedColumns.forEach((col) => {
          if (col.sub) {
            col.sub.forEach((sub, i) => {
              const w = col.widths[i];
              doc.rect(x, y + firstRowHeight, w, secondRowHeight);
              doc.text(sub, x + 1, y + firstRowHeight + 4);
              x += w;
            });
          } else {
            x += col.width || col.widths.reduce((a, b) => a + b, 0);
          }
        });

        y += firstRowHeight + secondRowHeight;

        // Row Data
        doc.setFontSize(7.5).setFont(undefined, "normal");

        let totalConsumption = 0;
        let totalReams = 0;

        for (const row of rows) {
          const values = [
            dayjs(row.Trans_dt).format("DD-MM-YYYY"),
            row.OrderNo,
            row.BookCode,
            row.BookNameMarathi || row.BookName,
            row.Copies,
            row.From,
            row.To,
            row.No_of_forms,
            row.PressName,
            row.PaperSizeName,
            row.BookPages,
            parseFloat(row.Consumption).toFixed(2),
            parseFloat(row.Consumption).toFixed(2),
            row.Remarks || "",
          ];

          let x = 5;
          let rowHeight = 6;
          const cellHeights = [];

          flatWidths.forEach((w, i) => {
            const text = String(values[i]);
            const lines = doc.splitTextToSize(text, w - 2);
            const height = lines.length * 4;
            if (height > rowHeight) rowHeight = height;
            cellHeights.push(height);
          });

          x = 5;
          flatWidths.forEach((w) => {
            doc.rect(x, y, w, rowHeight);
            x += w;
          });

          x = 5;
          flatWidths.forEach((w, i) => {
            const val = String(values[i]);
            const split = doc.splitTextToSize(val, w - 2);
            const alignRight = [4, 5, 6, 7, 10, 11, 12].includes(i);
            split.forEach((line, j) => {
              const yOffset = y + 4 + j * 4;
              if (alignRight) {
                const tw = doc.getTextWidth(line);
                doc.text(line, x + w - tw - 1, yOffset);
              } else {
                doc.text(line, x + 1, yOffset);
              }
            });
            x += w;
          });

          totalConsumption += parseFloat(row.Consumption);
          totalReams += parseFloat(row.Consumption);
          y += rowHeight;

          if (y > 270) {
            doc.addPage();
            y = 20;
            page++;
            addHeader();
          }
        }

        // Sub Total Row
        doc.setFont(undefined, "bold");
        let xSub = 5;
        const rowHeight = 6;
        flatWidths.forEach((w, i) => {
          doc.rect(xSub, y, w, rowHeight);
          if (i === 0) {
            doc.text("Sub Total", xSub + 1, y + 4);
          } else if (i === 11) {
            const val = totalConsumption.toFixed(2);
            const tw = doc.getTextWidth(val);
            doc.text(val, xSub + w - tw - 1, y + 4);
          } else if (i === 12) {
            const val = totalReams.toFixed(2);
            const tw = doc.getTextWidth(val);
            doc.text(val, xSub + w - tw - 1, y + 4);
          }
          xSub += w;
        });
        y += rowHeight + 2;
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
          <Typography variant="h5" textAlign="center" fontWeight="bold">
            Book Print Order Report
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

export default BookprintorderReport;
