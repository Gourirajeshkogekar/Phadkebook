import React, { useState, useEffect } from "react";
import { Box, Typography, CircularProgress } from "@mui/material";
import axios from "axios";
import dayjs from "dayjs";

const StockDayBookPrint = ({ filters }) => {
  const [stockDayData, setStockDayData] = useState({});
  const [loading, setLoading] = useState(false);
  const [companyName, setCompanyName] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          `https://publication.microtechsolutions.net.in/php/getstockdaybook.php?fromdate=${filters.startDate}&todate=${filters.endDate}`
        );
        setStockDayData(response.data.data || {});
      } catch (err) {
        console.error("Failed to fetch data", err);
      } finally {
        setLoading(false);
      }
    };
    if (filters.startDate && filters.endDate) fetchData();
  }, [filters.startDate, filters.endDate]);

  useEffect(() => {
    axios.get("https://publication.microtechsolutions.net.in/php/CompanyMasterget.php")
      .then(res => { if(res.data.length > 0) setCompanyName(res.data[0].CompanyName); });
  }, []);

  const fieldMap = {
    inwardchallan: { date: "InvertDate", refNo: "InvertNo", book1: "BookNameMarathi", inward: "inwardchallantotal", outward: null },
    saleschallan: { date: "ChallanDate", refNo: "ChallanNo", book1: "BookNameMarathi", inward: null, outward: "saleschallantotal" },
    canvassorinvoice: { date: "InvoiceDate", refNo: "InvoiceNo", book1: "BookNameMarathi", inward: null, outward: "canvassortotal" },
    salesinvoice: { date: "InvoiceDate", refNo: "InvoiceNo", book1: "BookNameMarathi", inward: null, outward: "salesiinvoicetotal" },
    salesreturn: { date: "Date", refNo: "NoteNo", book1: "BookNameMarathi", inward: "salesreturntotal", outward: null },
    paperoutward: { date: "ChallanDate", refNo: "ChallanNo", paper: "PaperSizeName", inward: null, outward: "PaperOutwardtotal" },
  };

  return (
    <Box sx={{ p: "10mm", width: "190mm", bgcolor: "white", color: "black", fontFamily: "serif" }}>
      {/* HEADER SECTION - Matches your black & white screenshot */}
      <Box sx={{ textAlign: "center", mb: 1, borderBottom: "1px solid black", pb: 1 }}>
        <Typography variant="h5" sx={{ fontWeight: "bold", textTransform: "uppercase" }}>
          {companyName || "M. V. PHADKE & CO. KOLHAPUR"}
        </Typography>
        <Typography variant="body1" sx={{ fontWeight: "bold" }}>Stock Day Book</Typography>
        <Typography variant="body2">
          Date From {dayjs(filters.startDate).format("DD-MM-YY")} To {dayjs(filters.endDate).format("DD-MM-YY")}
        </Typography>
        <Typography variant="caption" sx={{ display: "block", fontSize: "10px" }}>
          All Parties Inward & Outward All Transactions For All Books
        </Typography>
      </Box>

      {loading ? (
        <Box textAlign="center" p={5}><CircularProgress /></Box>
      ) : (
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "11px" }}>
          <thead>
            <tr style={{ borderBottom: "1px solid black", borderTop: "1px solid black" }}>
              <th style={{ ...headerStyle, width: "10%" }}>Ref. No.</th>
              <th style={{ ...headerStyle, width: "10%" }}>Date</th>
              <th style={{ ...headerStyle, width: "30%" }}>Name of the Party</th>
              <th style={{ ...headerStyle, width: "30%" }}>Particulars</th>
              <th style={{ ...headerStyle, width: "10%" }}>Inward</th>
              <th style={{ ...headerStyle, width: "10%" }}>Outward</th>
            </tr>
          </thead>
          <tbody>
            {Object.entries(stockDayData).map(([typeRaw, rows]) => {
              const typeKey = typeRaw.replace(/\s+/g, "").toLowerCase();
              const fields = fieldMap[typeKey];
              if (!fields) return null;

              const filteredRows = filters.books?.length > 0 
                ? rows.filter(r => filters.books.some(b => b.BookCode === r.BookCode))
                : rows;

              if (filteredRows.length === 0) return null;

              return (
                <React.Fragment key={typeRaw}>
                  {/* Transaction Type Subheader */}
                  <tr>
                    <td colSpan={6} style={{ textAlign: "center", fontWeight: "bold", padding: "8px 0", textDecoration: "underline" }}>
                      {typeRaw}
                    </td>
                  </tr>
                  {filteredRows.map((row, i) => (
                    <tr key={i}>
                      <td style={cellStyle}>{row[fields.refNo] || "-"}</td>
                      <td style={cellStyle}>{dayjs(row[fields.date]).format("DD-MM-YY")}</td>
                      <td style={{ ...cellStyle, textAlign: "left" }}>{row.AccountName}</td>
                      <td style={{ ...cellStyle, textAlign: "left" }}>{row[fields.book1] || row[fields.paper] || "-"}</td>
                      <td style={{ ...cellStyle, textAlign: "right" }}>{row[fields.inward] || ""}</td>
                      <td style={{ ...cellStyle, textAlign: "right" }}>{row[fields.outward] || ""}</td>
                    </tr>
                  ))}
                </React.Fragment>
              );
            })}
          </tbody>
        </table>
      )}
    </Box>
  );
};

const headerStyle = { padding: "4px", textAlign: "center", fontWeight: "bold", borderLeft: "0.5px solid #eee", borderRight: "0.5px solid #eee" };
const cellStyle = { padding: "4px", textAlign: "center", verticalAlign: "top" };

export default StockDayBookPrint;