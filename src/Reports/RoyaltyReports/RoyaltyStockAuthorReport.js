import React, { useState, useEffect } from "react";
import { Box, Button, Typography, Paper, Grid } from "@mui/material";
import axios from "axios";
import jsPDF from "jspdf";
import { ToastContainer, toast } from "react-toastify";

function RoyaltyStockAuthorReport() {
  const [userId, setUserId] = useState("");
  const [yearid, setYearId] = useState("");
  const [companyName, setCompanyName] = useState("");

  useEffect(() => {
    const storedUserId = sessionStorage.getItem("UserId");
    const storedYearId = sessionStorage.getItem("YearId");

    if (storedUserId) {
      setUserId(storedUserId);
    } else {
      toast.error("User is not logged in.");
    }

    if (storedYearId) {
      setYearId(storedYearId);
    } else {
      toast.error("Year is not set.");
    }
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

  useEffect(() => {
    fetchCompanies();
  }, []);

  const generatePDF = async () => {
    if (!userId || !yearid) {
      toast.error("User ID or Year ID missing.");
      return;
    }

    try {
      const response = await axios.get(
        "https://publication.microtechsolutions.net.in/php/royaltystockauthor.php",
        { params: { UserId: userId, YearId: yearid } }
      );

      const data = response.data || [];
      if (!Array.isArray(data) || data.length === 0) {
        toast.warn("No report data available.");
        return;
      }

      const doc = new jsPDF("l", "pt", "a4");
      const pageWidth = doc.internal.pageSize.getWidth();
      const pageHeight = doc.internal.pageSize.getHeight();

      // --- HEADER ---
      doc.setFontSize(10).setFont("helvetica", "bold");
      doc.text(companyName || "Phadke Prakashan, Kolhapur.", 40, 30);
      doc.text("STATEMENT OF COPIES", pageWidth / 2, 30, { align: "center" });
      doc.text("AUTHOR", pageWidth - 120, 30);
      doc.setFont("helvetica", "normal");
      doc.text(data[0].AuthorName || "", pageWidth - 120, 45);
      doc.setFont("helvetica", "bold");
      doc.text("Accounting Year 01-04-22 To 31-03-23", pageWidth / 2, 55, {
        align: "center",
      });

      // --- TABLE HEADER ---
      let startX = 20;
      let startY = 80;
      let rowHeight = 30;

      // Original widths
      const colWidths = [
        32, 60, 60, 100, 37, 45, 80, 80, 110, 90, 60, 50, 40, 40, 60, 60, 60,
      ];

      // Scale to fit within page
      const totalWidth = pageWidth - 2 * startX;
      const sumWidths = colWidths.reduce((a, b) => a + b, 0);
      const scaleFactor = totalWidth / sumWidths;
      const adjustedWidths = colWidths.map((w) => w * scaleFactor);

      const columnGroups = [
        { label: "Sr.No", span: 1 },
        { label: "Book Code", span: 1 },
        { label: "Class", span: 1 },
        { label: "Book Name", span: 1 },
        { label: "Edition", span: 1 },
        { label: "Price", span: 1 },
        { label: "Opening Stock", span: 1 },
        { label: "Printed in current Year", span: 3 }, // covers next 3
        { label: "Net Copies", span: 1 / 2 },
        { label: "Copy-wise Cons", span: 2 }, // covers next 3
        { label: "Closing Stock", span: 3 }, // covers next 3
      ];

      const firstRow = [
        "Sr.No",
        "Book Code",
        "CLASS",
        "Name of the Book",
        "Edition",
        "Price",
        "Opening Stock",
        "Printed in current Year",
        "",
        "",
        "",
        "Copies-wise Consumption",
        "",
        "",
        "Closing Stock",
        "",
        "",
      ];

      const secondRow = [
        "Sr. No",
        "Book Code",
        "CLASS",
        "Name of the Book",
        "Edition",
        "Price",
        "Opening Stock",
        "Print Order",
        "Recd From Binder",
        "Defective/Raddi",
        "Net Saleable",
        "Net Sales",
        "Specimen",
        "Total",
        "Bound",
        "Unbound",
        "Total",
      ];

      // Add this once, load font (Mangal.ttf must be in public folder)
      doc.addFont("/Mangal.ttf", "Mangal", "normal");
      doc.setFont("Mangal"); // for Marathi text
      doc.setFontSize(9);

      const drawHeader = (yPos) => {
        let x = startX;
        let headerHeight = rowHeight * 2; // make space for 2 rows

        // First row
        // firstRow.forEach((label, i) => {
        //   let span = 1;
        //   if (label === "Printed in current Year") span = 3;
        //   if (label === "Copies-wise Consumption") span = 3;
        //   if (label === "Closing Stock") span = 3;
        //   if (label) {
        //     let width = 0;
        //     for (let j = 0; j < span; j++) width += adjustedWidths[i + j];

        //     // Draw merged parent
        //     doc.rect(x, yPos, width, rowHeight);
        //     doc.text(label, x + width / 2, yPos + 13, { align: "center" });

        //     x += width;
        //   }
        // });

        columnGroups.forEach((group, i) => {
          let groupWidth = 0;
          for (let j = 0; j < group.span; j++) {
            groupWidth += adjustedWidths[i + j];
          }

          doc.rect(x, yPos, groupWidth, rowHeight);
          doc.text(group.label, x + groupWidth / 2, yPos + 13, {
            align: "center",
          });

          x += groupWidth;
          i += group.span;
        });

        // Second row
        // x = startX;
        // let y = yPos + rowHeight;
        // secondRow.forEach((label, i) => {
        //   if (!firstRow[i]) {
        //     doc.rect(x, y, adjustedWidths[i], rowHeight);
        //     doc.text(label, x + adjustedWidths[i] / 2, y + 13, {
        //       align: "center",
        //     });
        //   } else {
        //     doc.rect(x, y, adjustedWidths[i], rowHeight);
        //   }
        //   x += adjustedWidths[i];
        // });

        x = startX;
        let y = yPos + rowHeight;

        secondRow.forEach((label, i) => {
          doc.rect(x, y, adjustedWidths[i], rowHeight);
          doc.text(label, x + adjustedWidths[i] / 2, y + 13, {
            align: "center",
          });
          x += adjustedWidths[i];
        });

        return y + rowHeight;
      };

      let y = drawHeader(startY);

      // --- TABLE BODY ---
      data.forEach((row, index) => {
        let x = startX;
        const rowData = [
          index + 1,
          row.BookCode || "",
          row.StandardName || "",
          row.BookNameMarathi || row.BookName || "",
          row.CurrentEdition || "",
          row.BookRate || 0,
          row.OpeningStock || 0,
          row.PrintOrder || 0,
          row.RecdFromBinder || 0,
          row.DefectiveRaddi || 0,
          row.NetSaleable || 0,
          row.NetSales || 0,
          row.Specimen || 0,
          row.TotalConsumption || 0,
          row.ClosingStock || 0,
          row.ClosingUnbound || 0,
          (row.ClosingStock || 0) + (row.ClosingUnbound || 0),
        ];

        // --- calculate row height dynamically
        let maxLines = 1;
        rowData.forEach((cell, i) => {
          let text = String(cell);
          let wrapped = doc.splitTextToSize(text, adjustedWidths[i] - 4);
          if (wrapped.length > maxLines) maxLines = wrapped.length;
        });
        let dynamicHeight = rowHeight * maxLines;

        rowData.forEach((cell, i) => {
          // doc.rect(x, y, adjustedWidths[i], rowHeight);
          doc.rect(x, y, adjustedWidths[i], dynamicHeight);

          let text = String(cell);
          let splitText = doc.splitTextToSize(text, adjustedWidths[i] - 4);

          doc.text(splitText, x + 5, y + 7, { baseline: "top" }); // adds left & top padding
          x += adjustedWidths[i];
        });

        y += rowHeight;

        // --- PAGE BREAK ---
        if (y > pageHeight - 60) {
          doc.addPage();
          y = drawHeader(40);
        }
      });

      // --- OPEN PDF PREVIEW ---
      const pdfBlobUrl = doc.output("bloburl");
      window.open(pdfBlobUrl, "_blank");
    } catch (error) {
      console.error("❌ Error generating report:", error);
      toast.error("Failed to generate report.");
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
        Royalty Stock Author Report
      </Typography>

      <Paper
        elevation={3}
        sx={{
          p: 3,
          borderRadius: 3,
          background: "#ffffff",
          maxWidth: 500,
          mx: "auto",
          boxShadow: "0px 6px 20px rgba(0,0,0,0.1)",
        }}>
        <Grid container spacing={3} alignItems="center">
          <Grid item xs={12} textAlign="center">
            <Button
              variant="contained"
              onClick={generatePDF}
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

      <ToastContainer />
    </Box>
  );
}

export default RoyaltyStockAuthorReport;
