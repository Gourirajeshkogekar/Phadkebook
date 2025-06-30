import React, { useState } from "react";
import jsPDF from "jspdf";
import axios from "axios";
import dayjs from "dayjs";
import {
  Box,
  Button,
  Typography,
  Grid,
  Paper,
  Divider,
  CircularProgress,
} from "@mui/material";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";

const PaperwiseSummaryReport = () => {
  const [fromDate, setFromDate] = useState(dayjs());
  const [toDate, setToDate] = useState(dayjs());
  const [loading, setLoading] = useState(false);

  const generatePDF = async () => {
    try {
      const formattedFromDate = fromDate.format("YYYY-MM-DD");
      const formattedToDate = toDate.format("YYYY-MM-DD");

      const { data } = await axios.get(
        `https://publication.microtechsolutions.net.in/php/getbookprintordersummary.php?fromdate=${formattedFromDate}&todate=${formattedToDate}`
      );

      const doc = new jsPDF("p", "mm", "a4");
      const pageWidth = doc.internal.pageSize.getWidth();
      const pageHeight = doc.internal.pageSize.getHeight();

      const colWidths = [55, 40, 55, 40];
      const colX = [14];
      for (let i = 0; i < colWidths.length - 1; i++) {
        colX.push(colX[i] + colWidths[i]);
      }

      let y = 20;
      let page = 1;
      const lineHeight = 5;

      const drawHeader = () => {
        doc.setFont("times", "bold").setFontSize(14);
        doc.text("Phadke Prakashan, Kolhapur", pageWidth / 2, y, {
          align: "center",
        });

        doc.setFontSize(10);
        doc.text(`Page ${page}`, pageWidth - 20, 10); // Top-right page number

        y += 7;
        doc.setFont("times", "bold").setFontSize(11);
        doc.text("Party-wise Paper Consumption Summary", pageWidth / 2, y, {
          align: "center",
        });
        y += 6;
        doc.setFont("times", "bold").setFontSize(11);

        doc.text(
          `From ${fromDate.format("DD-MM-YYYY")} to ${toDate.format(
            "DD-MM-YYYY"
          )}`,
          pageWidth / 2,
          y,
          { align: "center" }
        );
        y += 10;

        // Header row
        const headers = [
          "Name of the Press/Party",
          "Paper Size",
          "Paper Consumption(Incl. Wastage)",
          "Reams",
        ];
        doc.setFont("times", "bold").setFontSize(10);
        const headerTopY = y;
        const headerBottomY = y + lineHeight;

        for (let i = 0; i < headers.length; i++) {
          const text = headers[i];
          const textWidth = doc.getTextWidth(text);
          const cellCenter = colX[i] + colWidths[i] / 2;
          doc.text(text, cellCenter - textWidth / 2, y + lineHeight - 2);
        }

        for (let i = 0; i < colX.length; i++) {
          const nextX = colX[i + 1] || colX[i] + colWidths[i];
          doc.line(colX[i], headerTopY, colX[i], headerBottomY);
          doc.line(nextX, headerTopY, nextX, headerBottomY);
          doc.line(colX[i], headerTopY, nextX, headerTopY);
          doc.line(colX[i], headerBottomY, nextX, headerBottomY);
        }
        y += lineHeight;
      };
      const drawRowBorder = (startY, rowHeight) => {
        for (let i = 0; i < colX.length; i++) {
          const nextX = colX[i + 1] || colX[i] + colWidths[i];
          doc.line(colX[i], startY, colX[i], startY + rowHeight);
          doc.line(nextX, startY, nextX, startY + rowHeight);
          doc.line(colX[i], startY + rowHeight, nextX, startY + rowHeight);
        }
      };

      drawHeader();
      doc.setFont("times", "normal").setFontSize(10);

      let total = 0;

      for (const row of data) {
        const values = [
          row.PressName,
          row.PaperSizeName,
          row.Consumption.toFixed(2),
          row.Consumption.toFixed(2),
        ];

        // Wrap text
        const wrapped = values.map((text, i) =>
          doc.splitTextToSize(text, colWidths[i] - 2)
        );

        const maxLines = Math.max(...wrapped.map((lines) => lines.length));
        const rowHeight = maxLines * lineHeight;

        if (y + rowHeight > pageHeight - 20) {
          doc.addPage();
          page++;
          y = 20;
          drawHeader();
        }

        for (let i = 0; i < wrapped.length; i++) {
          const lines = wrapped[i];
          lines.forEach((line, j) => {
            lines.forEach((line, j) => {
              const yPos = y + lineHeight * (j + 1) - 2;

              if (i === 2 || i === 3) {
                // Right-align the numeric columns
                const textWidth = doc.getTextWidth(line);
                const rightEdge = colX[i] + colWidths[i] - 2;
                doc.text(line, rightEdge - textWidth, yPos);
              } else {
                // Default left alignment
                doc.text(line, colX[i] + 1, yPos);
              }
            });
          });
        }

        drawRowBorder(y, rowHeight);
        y += rowHeight;
        total += parseFloat(row.Consumption);
      }

      // Grand Total
      // Grand Total Row
      const totalRowHeight = lineHeight;
      if (y + totalRowHeight > pageHeight - 20) {
        doc.addPage();
        page++;
        y = 20;
        drawHeader();
      }

      doc.setFont("times", "bold").setFontSize(9);

      // Combine label and value into one string
      const totalText = `Grand Total: ${total.toFixed(2)}`;

      // Right-align in the last column
      const totalTextWidth = doc.getTextWidth(totalText);
      const totalRightEdge = colX[3] + colWidths[3] - 2;
      doc.text(totalText, totalRightEdge - totalTextWidth, y + lineHeight - 2);

      // Draw border for the total row
      drawRowBorder(y, totalRowHeight);

      // Open in new tab
      const blob = doc.output("blob");
      const url = URL.createObjectURL(blob);
      window.open(url, "_blank");
    } catch (err) {
      console.error("Error generating PDF:", err);
    }
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Box sx={{ p: 3, display: "flex", justifyContent: "center" }}>
        <Paper elevation={3} sx={{ p: 4, width: "100%", maxWidth: 700 }}>
          <Typography variant="h5" textAlign="center" fontWeight="bold">
            Book Print Order Summary Report
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
              onClick={generatePDF}
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
};

export default PaperwiseSummaryReport;
