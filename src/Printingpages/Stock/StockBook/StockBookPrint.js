import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { Box, Typography, Divider } from "@mui/material";
import axios from "axios";

export default function StockBookPrint() {
  const location = useLocation();
  const { startDate, endDate, mode, selectedItems } = location.state || {};
  const [reportData, setReportData] = useState([]);

  useEffect(() => {
    // Replace with your actual reporting API endpoint
    // This should take the selected names/groups and dates
    const fetchData = async () => {
      try {
        const response = await axios.post("https://publication.microtechsolutions.net.in/php/StockBookReport.php", {
          startDate,
          endDate,
          items: selectedItems,
          mode
        });
        setReportData(response.data);
      } catch (error) {
        console.error("Error fetching report data:", error);
      }
    };

    if (selectedItems && selectedItems.length > 0) {
      fetchData();
    }
  }, [startDate, endDate, mode, selectedItems]);

  return (
    <Box sx={{ p: 4, bgcolor: "white", minHeight: "100vh" }} id="printable-area">
      <style>
        {`
          @media print {
            @page { size: portrait; margin: 10mm; }
            body { -webkit-print-color-adjust: exact; }
            .no-print { display: none; }
          }
          table { width: 100%; border-collapse: collapse; margin-top: 10px; }
          th { border-top: 2px solid black; border-bottom: 2px solid black; padding: 8px; font-size: 14px; }
          td { padding: 4px 8px; font-size: 13px; vertical-align: top; }
          .book-header { font-weight: bold; font-size: 16px; margin-top: 20px; border-bottom: 1px solid #ccc; }
          .opening-balance { font-style: italic; color: #555; }
          .text-right { text-align: right; }
          .text-center { text-align: center; }
        `}
      </style>

      {/* Header Section */}
      <Box className="text-center" sx={{ mb: 2 }}>
        <Typography variant="h5" sx={{ fontWeight: "bold", textTransform: "uppercase" }}>
          Phadke Book House
        </Typography>
        <Typography variant="subtitle1">Stock Book</Typography>
        <Typography variant="body2">
          From {startDate} to {endDate}
        </Typography>
      </Box>

      {/* Report Table */}
      <table>
        <thead>
          <tr>
            <th align="left" style={{ width: "10%" }}>Date</th>
            <th align="left" style={{ width: "12%" }}>Ref No</th>
            <th align="left">Particulars</th>
            <th className="text-right" style={{ width: "10%" }}>Inward</th>
            <th className="text-right" style={{ width: "10%" }}>Outward</th>
            <th className="text-right" style={{ width: "10%" }}>Balance</th>
          </tr>
        </thead>
        <tbody>
          {/* Mapping through Books/Groups */}
          {reportData.map((book, bIdx) => (
            <React.Fragment key={bIdx}>
              {/* Book Title Row */}
              <tr>
                <td colSpan={6} className="book-header">
                  {book.BookCode} &nbsp;&nbsp;&nbsp; {book.BookName}
                </td>
              </tr>
              
              {/* Opening Balance Row */}
              <tr className="opening-balance">
                <td>{startDate}</td>
                <td></td>
                <td>Opening Balance...</td>
                <td></td>
                <td></td>
                <td className="text-right">{book.OpeningBalance}</td>
              </tr>

              {/* Transaction Rows */}
              {book.Transactions?.map((tr, tIdx) => (
                <tr key={tIdx}>
                  <td>{tr.Date}</td>
                  <td>{tr.RefNo}</td>
                  <td>{tr.PartyName}</td>
                  <td className="text-right">{tr.Inward || "-"}</td>
                  <td className="text-right">{tr.Outward || "-"}</td>
                  <td className="text-right">{tr.Balance}</td>
                </tr>
              ))}

              {/* Book Total Footer */}
              <tr>
                <td colSpan={3}></td>
                <td style={{ borderTop: "1px solid black" }} className="text-right"><strong>{book.TotalInward}</strong></td>
                <td style={{ borderTop: "1px solid black" }} className="text-right"><strong>{book.TotalOutward}</strong></td>
                <td className="text-right"></td>
              </tr>
            </React.Fragment>
          ))}
        </tbody>
      </table>

      
    </Box>
  );
}