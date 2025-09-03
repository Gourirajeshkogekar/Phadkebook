import React, { useState, useRef, useEffect } from "react";
import { Box, Button, Typography, Paper, Grid } from "@mui/material";
import axios from "axios";
import jsPDF from "jspdf";
import { ToastContainer, toast } from "react-toastify";

function RoyaltyStatementsummary() {
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

  function getYearRange(yearid) {
    const startYear = parseInt(yearid);
    const endYear = startYear + 1;
    return `From 01-04-${String(startYear).slice(-2)} To 31-03-${String(
      endYear
    ).slice(-2)}`;
  }

  const generateReport = async () => {
    if (!yearid) {
      toast.error("Please Make Sure Year id is Available");
      return;
    }

    try {
      const url = `https://publication.microtechsolutions.net.in/php/royaltystatementsummary.php?YearId=${yearid}`;
      const res = await axios.get(url);
      const data = res.data || [];

      // Group data by AuthorName
      const groupedData = {};
      data.forEach((row) => {
        if (!groupedData[row.AuthorName]) {
          groupedData[row.AuthorName] = {
            CityName: row.CityName || "",
            Statements: [],
            Total: 0,
          };
        }
        groupedData[row.AuthorName].Statements.push({
          StatementNo: row.StatementNo,
          Amount: parseFloat(row.Amount || 0),
        });
        groupedData[row.AuthorName].Total += parseFloat(row.Amount || 0);
      });

      const doc = new jsPDF();
      const pageWidth = doc.internal.pageSize.getWidth();
      const pageHeight = doc.internal.pageSize.getHeight();
      let y = 20;
      let srNo = 1;
      let grandTotal = 0;

      // Company Name
      doc.setFontSize(14).setFont("times", "bold");
      doc.text(companyName || "Phadke Prakashan, Kolhapur.", pageWidth / 2, y, {
        align: "center",
      });

      // Report Title
      y += 8;
      doc.setFontSize(12).setFont("times", "normal");
      doc.text("Royalty Statement Summary", pageWidth / 2, y, {
        align: "center",
      });

      // Date Range
      y += 6;
      doc.setFontSize(11);
      doc.text(getYearRange(yearid), pageWidth / 2, y, { align: "center" });

      y += 10;

      // Table Header
      doc.setFontSize(10).setFont("times", "bold");
      doc.text("Sr. No.", 15, y);
      doc.text("Author Name", 30, y);
      doc.text("Place", 100, y);
      doc.text("Stmt No.", 130, y);
      doc.text("Amount", 160, y);
      doc.text("Total", pageWidth - 20, y, { align: "right" });

      y += 3;
      doc.line(15, y, pageWidth - 15, y); // underline header
      y += 6;

      // Loop through grouped authors
      // Loop through grouped authors
      for (const author in groupedData) {
        const group = groupedData[author];

        if (y > pageHeight - 40) {
          doc.addPage();
          y = 20;
        }

        doc.setFont("times", "normal").setFontSize(10);

        // Print first row with author + city + first statement
        const firstStmt = group.Statements[0];
        doc.text(`${srNo})`, 15, y);
        doc.text(author, 30, y);
        doc.text(group.CityName, 100, y);

        if (firstStmt) {
          doc.text(`${firstStmt.StatementNo}`, 130, y);
          doc.text(`${firstStmt.Amount.toFixed(2)}`, 170, y, {
            align: "right",
          });
        }
        y += 6;

        // Print remaining statements (if any)
        for (let i = 1; i < group.Statements.length; i++) {
          const s = group.Statements[i];
          doc.text(`${s.StatementNo}`, 130, y);
          doc.text(`${s.Amount.toFixed(2)}`, 170, y, { align: "right" });
          y += 6;
        }

        // Print total
        doc.setFont("times", "bold");
        doc.text(`${group.Total.toFixed(2)}`, pageWidth - 20, y, {
          align: "right",
        });
        y += 10;

        srNo++;
        grandTotal += group.Total;
      }

      // Grand Total
      if (y > pageHeight - 20) {
        doc.addPage();
        y = 20;
      }
      doc.setFont("times", "bold").setFontSize(11);
      doc.text("Grand Total:", pageWidth - 60, y);
      doc.text(`${grandTotal.toFixed(2)}`, pageWidth - 20, y, {
        align: "right",
      });

      // Page numbers
      const pageCount = doc.internal.getNumberOfPages();
      for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        doc.setFontSize(9);
        doc.text(`Page ${i} of ${pageCount}`, pageWidth - 15, 15, {
          align: "right",
        });
      }

      window.open(doc.output("bloburl"), "_blank");
    } catch (err) {
      console.error(err);
      toast.error("Error generating report");
    }
  };

  // const generateReport = async () => {
  //   if (!yearid) {
  //     toast.error("Please Make Sure Year id is Available");
  //     return;
  //   }

  //   try {
  //     const url = `https://publication.microtechsolutions.net.in/php/royaltystatementsummary.php?YearId=${yearid}`;
  //     const res = await axios.get(url);
  //     const data = res.data || [];

  //     // ✅ Group data by AuthorName
  //     const groupedData = {};
  //     data.forEach((row) => {
  //       if (!groupedData[row.AuthorName]) {
  //         groupedData[row.AuthorName] = {
  //           CityName: row.CityName || "",
  //           Statements: [],
  //           Total: 0,
  //         };
  //       }
  //       groupedData[row.AuthorName].Statements.push({
  //         StatementNo: row.StatementNo,
  //         Amount: parseFloat(row.Amount || 0),
  //       });
  //       groupedData[row.AuthorName].Total += parseFloat(row.Amount || 0);
  //     });

  //     const doc = new jsPDF();
  //     const pageWidth = doc.internal.pageSize.getWidth();
  //     const pageHeight = doc.internal.pageSize.getHeight();
  //     let y = 20;
  //     let srNo = 1;
  //     let grandTotal = 0;

  //     // ✅ Header
  //     doc.setFontSize(14).setFont("times", "bold");
  //     doc.text(companyName || "M. V. Phadke & Co. Kolhapur", pageWidth / 2, y, {
  //       align: "center",
  //     });

  //     y += 8;
  //     doc.setFontSize(12).text("Royalty Statement Summary", pageWidth / 2, y, {
  //       align: "center",
  //     });

  //     y += 12;

  //     // ✅ Loop through grouped authors
  //     for (const author in groupedData) {
  //       const group = groupedData[author];

  //       if (y > pageHeight - 40) {
  //         doc.addPage();
  //         y = 20;
  //       }

  //       doc.setFont("times", "bold").setFontSize(11);
  //       doc.text(`${srNo}) ${author}`, 20, y);
  //       doc.setFontSize(10);
  //       doc.text(group.CityName, pageWidth - 60, y);
  //       y += 6;

  //       doc.setFont("times", "normal");
  //       group.Statements.forEach((s) => {
  //         doc.text(`${s.StatementNo}`, 50, y);
  //         doc.text(`${s.Amount.toFixed(2)}`, pageWidth - 40, y, {
  //           align: "right",
  //         });
  //         y += 6;
  //       });

  //       doc.line(pageWidth - 60, y - 2, pageWidth - 20, y - 2);

  //       doc.setFont("times", "bold");
  //       doc.text(`${group.Total.toFixed(2)}`, pageWidth - 40, y, {
  //         align: "right",
  //       });

  //       y += 10;
  //       srNo++;
  //       grandTotal += group.Total;
  //     }

  //     // ✅ Grand Total
  //     if (y > pageHeight - 20) {
  //       doc.addPage();
  //       y = 20;
  //     }
  //     doc.setFontSize(12);
  //     doc.text("Grand Total:", pageWidth - 80, y);
  //     doc.text(`${grandTotal.toFixed(2)}`, pageWidth - 20, y, {
  //       align: "right",
  //     });

  //     // ✅ Page numbers
  //     const pageCount = doc.internal.getNumberOfPages();
  //     for (let i = 1; i <= pageCount; i++) {
  //       doc.setPage(i);
  //       doc.setFontSize(9);
  //       doc.text(`Page ${i} of ${pageCount}`, pageWidth - 10, 10, {
  //         align: "right",
  //       });
  //     }

  //     window.open(doc.output("bloburl"), "_blank");
  //   } catch (err) {
  //     console.error(err);
  //     toast.error("Error generating report");
  //   }
  // };

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
        Royalty Statement Summary Report
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

      <ToastContainer />
    </Box>
  );
}

export default RoyaltyStatementsummary;
