import React, { useState, useRef, useEffect } from "react";
import {
  Box,
  TextField,
  Button,
  Typography,
  CircularProgress,
  Paper,
  Divider,
  Autocomplete,
  Grid,
} from "@mui/material";
import { LocalizationProvider, DatePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import axios from "axios";
import jsPDF from "jspdf";
import "jspdf-autotable";
import { ToastContainer, toast } from "react-toastify";
import html2canvas from "html2canvas";

function SalesreturnregisterReport() {
  const componentRef = useRef();
  const [fromdate, setFromDate] = useState(dayjs());
  const [todate, setToDate] = useState(dayjs());
  const [companyName, setCompanyName] = useState("");
  const [salesReportData, setSalesreportdata] = useState([]);

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
  const fetchData = async () => {
    try {
      const res = await axios.get(
        `https://publication.microtechsolutions.net.in/php/salesreturncreditnoteregister.php?fromdate=${fromdate.format(
          "YYYY-MM-DD"
        )}&todate=${todate.format("YYYY-MM-DD")}`
      );
      if (res.data && res.data.length > 0) {
        setSalesreportdata(res.data);
      } else {
        console.error("No data available for selected date range.");
        // setRenderPreview(false);
      }
    } catch (err) {
      toast.error("Error fetching data", err);
    }
  };

  const generateReport = async () => {
    if (!fromdate || !todate) {
      alert("Please select both dates");
      return;
    }

    try {
      const url = `https://publication.microtechsolutions.net.in/php/salesreturncreditnoteregister.php?fromdate=${dayjs(
        fromdate
      ).format("YYYY-MM-DD")}&todate=${dayjs(todate).format("YYYY-MM-DD")}`;
      const res = await axios.get(url);
      const data = res.data || [];

      // Group by Date & NoteNo
      const groupedData = {};
      let grandDebit = 0,
        grandCredit = 0;

      data.forEach((item) => {
        const date = item.Date;
        if (!groupedData[date]) groupedData[date] = {};
        if (!groupedData[date][item.NoteNo])
          groupedData[date][item.NoteNo] = [];
        groupedData[date][item.NoteNo].push(item);

        if (item.Type.toLowerCase() === "debit")
          grandDebit += parseFloat(item.Amount);
        else grandCredit += parseFloat(item.Amount);
      });

      const doc = new jsPDF();
      let y = 20;
      const pageWidth = doc.internal.pageSize.getWidth();

      // Fixed column positions
      const colX = {
        entry: 15,
        account: 35,
        particulars: 80,
        debit: 150,
        credit: 180,
      };

      const rowHeight = 6;

      const drawHeader = () => {
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
        doc.setFontSize(12);
        doc.text("Sales Return Credit Note Register", pageWidth / 2, y, {
          align: "center",
        });
        y += 7;
        doc.setFontSize(10);
        doc.text(
          `From ${dayjs(fromdate).format("DD-MM-YY")} to ${dayjs(todate).format(
            "DD-MM-YY"
          )}`,
          pageWidth / 2,
          y,
          { align: "center" }
        );
        y += 10;

        // Column headers
        doc.setFont("times", "bold");
        doc.text("Entry No", colX.entry, y);
        doc.text("Account Name", colX.account, y);
        doc.text("Particulars", colX.particulars, y);
        doc.text("Debit", colX.debit, y, { align: "right" });
        doc.text("Credit", colX.credit, y, { align: "right" });
        y += rowHeight;
        doc.setFont("times", "normal");
      };

      drawHeader();

      Object.keys(groupedData).forEach((date) => {
        doc.setFont("times", "bolditalic");
        doc.text(dayjs(date).format("dddd, DD MMM, YYYY"), colX.entry, y);
        y += rowHeight;
        doc.setFont("times", "normal");

        let dayDebit = 0,
          dayCredit = 0;

        Object.keys(groupedData[date]).forEach((noteNo) => {
          groupedData[date][noteNo].forEach((item, idx) => {
            const particulars = `Sales Return - Credit Note No. ${item.NoteNo}`;
            const particularsLines = doc.splitTextToSize(
              particulars,
              colX.debit - colX.particulars - 4
            );
            const accountNameLines = doc.splitTextToSize(
              item.AccountName,
              colX.particulars - colX.account - 4
            );

            const lineCount = Math.max(
              particularsLines.length,
              accountNameLines.length
            );
            const dynamicHeight = rowHeight * lineCount;

            // Entry No
            doc.text(idx === 0 ? String(item.NoteNo) : "", colX.entry, y);

            // Account Name (wrapped)
            doc.text(accountNameLines, colX.account, y);

            // Particulars (wrapped)
            doc.text(particularsLines, colX.particulars, y);

            // Debit / Credit values
            if (item.Type.toLowerCase() === "debit") {
              doc.text(Number(item.Amount).toFixed(2), colX.debit, y, {
                align: "right",
              });
              dayDebit += parseFloat(item.Amount);
            } else {
              doc.text(Number(item.Amount).toFixed(2), colX.credit, y, {
                align: "right",
              });
              dayCredit += parseFloat(item.Amount);
            }

            y += dynamicHeight;

            // Page break check
            if (y > 280) {
              doc.addPage();
              y = 20;
              drawHeader();
            }
          });
        });

        // Day Total
        doc.setFont("times", "bold");
        doc.text("Day Total", colX.particulars, y);
        doc.text(dayDebit.toFixed(2), colX.debit, y, { align: "right" });
        doc.text(dayCredit.toFixed(2), colX.credit, y, { align: "right" });
        doc.setFont("times", "normal");
        y += rowHeight + 2;

        if (y > 280) {
          doc.addPage();
          y = 20;
          drawHeader();
        }
      });

      // Grand Total
      doc.setFont("times", "bold");
      doc.text("Grand Total", colX.particulars, y);
      doc.text(grandDebit.toFixed(2), colX.debit, y, { align: "right" });
      doc.text(grandCredit.toFixed(2), colX.credit, y, { align: "right" });

      // ✅ Add Page Numbers after content is created
      const pageCount = doc.internal.getNumberOfPages();
      for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        doc.setFontSize(9);
        doc.text(
          `Page ${i} of ${pageCount}`,
          pageWidth - 10,
          10, // <-- Top margin
          { align: "right" }
        );
      }
      window.open(doc.output("bloburl"), "_blank");
    } catch (err) {
      console.error(err);
    }
  };

  const handleGeneratePDF = async () => {
    await fetchData();
    setTimeout(() => {
      // openPreviewWindow();
    }, 500); // wait for DOM to render
  };

  // const openPreviewWindow = async () => {
  //   const input = componentRef.current;
  //   if (!input) return;

  //   const canvas = await html2canvas(input, {
  //     scale: 2,
  //     useCORS: true,
  //   });

  //   const imgWidth = canvas.width;
  //   const imgHeight = canvas.height;

  //   const pdf = new jsPDF("p", "mm", "a4");
  //   const pdfWidth = pdf.internal.pageSize.getWidth();
  //   const pdfHeight = pdf.internal.pageSize.getHeight();

  //   const ratio = pdfWidth / imgWidth;
  //   const scaledHeight = imgHeight * ratio;

  //   const headerHeight = 15;
  //   const marginTop = 20;
  //   const marginBottom = 10;
  //   const availableHeight = pdfHeight - marginTop - marginBottom;

  //   const pageHeightPx = availableHeight / ratio;
  //   const totalPages = Math.ceil(imgHeight / pageHeightPx);

  //   for (let i = 0; i < totalPages; i++) {
  //     const sourceY = i * pageHeightPx;

  //     const pageCanvas = document.createElement("canvas");
  //     pageCanvas.width = imgWidth;
  //     pageCanvas.height = Math.min(pageHeightPx, imgHeight - sourceY);

  //     const ctx = pageCanvas.getContext("2d");
  //     ctx.drawImage(
  //       canvas,
  //       0,
  //       sourceY,
  //       imgWidth,
  //       pageCanvas.height,
  //       0,
  //       0,
  //       imgWidth,
  //       pageCanvas.height
  //     );

  //     const pageImgData = pageCanvas.toDataURL("image/png");

  //     if (i > 0) pdf.addPage();

  //     // Header
  //     pdf.setFontSize(14);
  //     pdf.setFont("helvetica", "bold");
  //     // pdf.text("Phadke Prakashan, Kolhapur", pdfWidth / 2, 10, {
  //     //   align: "center",
  //     // });

  //     pdf.text(companyName || "Phadke Prakashan, Kolhapur", pdfWidth / 2, 10, {
  //       align: "center",
  //     });

  //     pdf.setFontSize(11);
  //     pdf.setFont("helvetica", "normal");
  //     pdf.text(
  //       `Sales return Register Report from ${fromdate.format(
  //         "DD-MM-YYYY"
  //       )} to ${todate.format("DD-MM-YYYY")}`,
  //       pdfWidth / 2,
  //       16,
  //       { align: "center" }
  //     );

  //     // Page number at top right
  //     pdf.setFontSize(10);
  //     pdf.text(`Page ${i + 1} of ${totalPages}`, pdfWidth - 10, 10, {
  //       align: "right",
  //     });

  //     // Image content
  //     pdf.addImage(
  //       pageImgData,
  //       "PNG",
  //       0,
  //       marginTop,
  //       pdfWidth,
  //       (pageCanvas.height * pdfWidth) / imgWidth
  //     );
  //   }

  //   const blob = pdf.output("blob");
  //   const blobURL = URL.createObjectURL(blob);
  //   window.open(blobURL, "_blank");
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
        Sales return Register Report
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
                slotProps={{ textField: { fullWidth: true, size: "small" } }}
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
        {(() => {
          // Group data by Date, then by NoteNo
          const groupedByDate = salesReportData.reduce((acc, row) => {
            if (!acc[row.Date]) acc[row.Date] = {};
            if (!acc[row.Date][row.NoteNo]) acc[row.Date][row.NoteNo] = [];
            acc[row.Date][row.NoteNo].push(row);
            return acc;
          }, {});

          let grandDebit = 0;
          let grandCredit = 0;

          return Object.keys(groupedByDate)
            .map((date) => {
              let dayDebit = 0;
              let dayCredit = 0;

              return (
                <div key={date}>
                  <h4
                    style={{
                      backgroundColor: "#f2f2f2",
                      padding: "5px",
                      fontSize: "18px",
                    }}>
                    {dayjs(date).format("dddd, DD MMMM, YYYY")}
                  </h4>
                  <table
                    style={{
                      width: "100%",
                      borderCollapse: "collapse",
                      fontSize: "16px",
                    }}
                    border="1">
                    <thead>
                      <tr
                        style={{
                          backgroundColor: "#2980b9",
                          color: "white",
                          fontSize: "16px",
                        }}>
                        <th style={{ textAlign: "center" }}>Entry No/Ref No</th>
                        <th style={{ textAlign: "center" }}>Account Name</th>
                        <th style={{ textAlign: "center" }}>Particulars</th>
                        <th style={{ textAlign: "center" }}>Debit</th>
                        <th style={{ textAlign: "center" }}>Credit</th>
                      </tr>
                    </thead>
                    <tbody>
                      {Object.keys(groupedByDate[date]).map((noteNo) => {
                        return groupedByDate[date][noteNo].map((row, idx) => {
                          const particulars = `Sales Return - Credit Note No. ${noteNo}`;
                          let debitVal = "";
                          let creditVal = "";

                          if (row.Type === "Debit") {
                            debitVal = Number(row.Amount).toFixed(2);

                            dayDebit += Number(row.Amount);
                            grandDebit += Number(row.Amount);
                          } else {
                            creditVal = Number(row.Amount).toFixed(2);
                            dayCredit += Number(row.Amount);
                            grandCredit += Number(row.Amount);
                          }

                          return (
                            <tr key={`${noteNo}-${idx}`}>
                              <td style={{ textAlign: "center" }}>
                                {idx === 0 ? noteNo : ""}
                              </td>
                              <td style={{ textAlign: "left" }}>
                                {row.AccountName}
                              </td>
                              <td style={{ textAlign: "left" }}>
                                {particulars}
                              </td>
                              <td style={{ textAlign: "right" }}>{debitVal}</td>
                              <td style={{ textAlign: "right" }}>
                                {creditVal}
                              </td>
                            </tr>
                          );
                        });
                      })}
                      {/* Day total row */}
                      <tr
                        style={{
                          fontWeight: "bold",
                          backgroundColor: "#eaeaea",
                        }}>
                        <td colSpan="3" style={{ textAlign: "right" }}>
                          Day Total
                        </td>
                        <td style={{ textAlign: "right" }}>
                          {dayDebit.toFixed(2)}
                        </td>
                        <td style={{ textAlign: "right" }}>
                          {dayCredit.toFixed(2)}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                  <br />
                </div>
              );
            })
            .concat(
              // Grand Total Row at the very end
              <table
                key="grand-total"
                style={{
                  width: "100%",
                  borderCollapse: "collapse",
                  fontSize: "16px",
                }}
                border="1">
                <tbody>
                  <tr
                    style={{ fontWeight: "bold", backgroundColor: "#d9edf7" }}>
                    <td colSpan="3" style={{ textAlign: "right" }}>
                      Grand Total
                    </td>
                    <td style={{ textAlign: "right" }}>
                      {grandDebit.toFixed(2)}
                    </td>
                    <td style={{ textAlign: "right" }}>
                      {grandCredit.toFixed(2)}
                    </td>
                  </tr>
                </tbody>
              </table>
            );
        })()}
      </Box>

      <ToastContainer />
    </Box>
  );
}

export default SalesreturnregisterReport;
