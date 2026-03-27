import React, { useEffect, useState, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  Divider,
  Button
} from "@mui/material";
import { ArrowBack } from "@mui/icons-material";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import "jspdf-autotable";
import autoTable from "jspdf-autotable";


import { toast } from "react-toastify";
import axios from "axios";



const SummarisedLedgerPrint = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const query = new URLSearchParams(location.search);
  const reportRef = useRef();

  const fromDate = query.get("fromdate");
  const toDate = query.get("todate");

  const [ledgerData, setLedgerData] = useState([]);
const [reportSummary, setReportSummary] = useState(null);
 useEffect(() => {
  const fetchLedgerData = async () => {
    const ids = query.get("ids") || query.get("AccountId");
    try {
      const response = await axios.get(
        `https://publication.microtechsolutions.net.in/php/ledgerreport.php?fromdate=${fromDate}&todate=${toDate}&AccountId=${ids}&GroupId=&TrType=`
      );

      if (response.data && response.data.transactions) {
        // Group the flat transactions by GroupName
        const grouped = response.data.transactions.reduce((acc, curr) => {
          const groupName = curr.GroupName;
          if (!acc[groupName]) {
            acc[groupName] = { title: groupName, rows: [], balance: { amount: 0, type: "" } };
          }
          
          acc[groupName].rows.push({
            code: curr.Date, // Using Date as the 'code' column
            name: `${curr.AccountName} - ${curr.Particulars}`,
            amount: parseFloat(curr.Amount.replace(/,/g, ""))
          });

          // Update balance for the group (extracting numeric part and Dr/Cr)
          const balParts = curr.Balance.split(" ");
          acc[groupName].balance.amount = balParts[0];
          acc[groupName].balance.type = balParts[1];

          return acc;
        }, {});

        setLedgerData(Object.values(grouped));
        setReportSummary(response.data.summary);
      }
    } catch (error) {
      console.error("Error fetching ledger data:", error);
      toast.error("Failed to load ledger data");
    }
  };

  fetchLedgerData();
}, [location.search]);

 const handlePrint = () => {
  const doc = jsPDF(); // Note: No 'new' is fine if using the imported default
  const pageWidth = doc.internal.pageSize.getWidth();

  // Header
  doc.setFontSize(16);
  doc.setFont("helvetica", "bold");
  doc.text("PHADKE BOOK HOUSE", pageWidth / 2, 15, { align: "center" });
  doc.setFontSize(10);
  doc.text(`Summarised Ledger: ${fromDate} to ${toDate}`, pageWidth / 2, 22, { align: "center" });

  let finalY = 30;

  ledgerData.forEach((section) => {
    doc.setFontSize(11);
    doc.setFont("helvetica", "bold");
    doc.text(section.title, 14, finalY);

    const rows = section.rows.map(r => [
      r.code, 
      r.name, 
      r.amount.toLocaleString("en-IN", { minimumFractionDigits: 2 })
    ]);

    // CALLING AS A FUNCTION TO AVOID "NOT A FUNCTION" ERROR
    autoTable(doc, {
      startY: finalY + 2,
      head: [['Date', 'Particulars', 'Amount']],
      body: rows,
      theme: 'grid',
      styles: { fontSize: 8 },
      headStyles: { fillColor: [240, 240, 240], textColor: [0, 0, 0], fontStyle: 'bold' },
      columnStyles: {
        0: { cellWidth: 25 },
        2: { halign: 'right' }
      },
      didDrawPage: (data) => {
        finalY = data.cursor.y;
      }
    });

    // Section Balance
    doc.setFontSize(9);
    doc.text(`Group Balance: ${section.balance.amount} ${section.balance.type}`, pageWidth - 14, finalY + 7, { align: "right" });
    finalY += 15;
  });

  // Final Summary (from backend summary object)
  if (reportSummary) {
    if (finalY > 250) doc.addPage();
    doc.line(14, finalY, pageWidth - 14, finalY);
    doc.text(`Net Balance: ${reportSummary.net_balance}`, pageWidth - 14, finalY + 10, { align: "right" });
  }

  window.open(doc.output("bloburl"), "_blank");
};
  return (
    <Box sx={{ bgcolor: "#eef1f5", minHeight: "100vh" }}>
      
      {/* Top Bar */}
      <Box sx={{ p: 2, bgcolor: "white", display: "flex", gap: 2, boxShadow: 1 }}>
        <Button startIcon={<ArrowBack />} onClick={() => navigate(-1)}>
          Back
        </Button>
        <Button variant="contained" onClick={handlePrint}>
          Print
        </Button>
      </Box>

      {/* Printable Area */}
      <Box
        ref={reportRef}
        sx={{
          width: "210mm",
          minHeight: "297mm",
          margin: "30px auto",
          bgcolor: "white",
          p: "20mm",
          borderRadius: 2,
          boxShadow: "0 5px 20px rgba(0,0,0,0.1)",
          fontFamily: "serif"
        }}
      >
        {/* Header */}
        <Box textAlign="center" mb={3}>
          <Typography variant="h5" fontWeight="bold">
            PHADKE BOOK HOUSE
          </Typography>
          <Typography variant="body2" mt={1}>
            Summarised Ledger From {fromDate} To {toDate}
          </Typography>
        </Box>

        <Divider sx={{ mb: 2 }} />

        {/* Content */}
        {ledgerData.map((section, index) => (
          <Box key={index} mb={4}>
            
            {/* Section Title */}
            <Typography
              variant="subtitle1"
              fontWeight="bold"
              sx={{ mb: 1, letterSpacing: 1 }}
            >
              {section.title}
            </Typography>

            <Divider sx={{ mb: 1 }} />

            {/* Rows */}
            {section.rows.map((row, i) => (
              <Box
                key={i}
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                sx={{ py: 0.5 }}
              >
                <Box display="flex" gap={2}>
                  <Typography fontWeight="bold">{row.code}</Typography>
                  <Typography>{row.name}</Typography>
                </Box>

                <Typography>
                  {row.amount.toLocaleString("en-IN", {
                    minimumFractionDigits: 2
                  })}
                </Typography>
              </Box>
            ))}

            {/* Balance Line */}
            <Box
              display="flex"
              justifyContent="space-between"
              mt={2}
              pt={1}
              borderTop="2px solid black"
            >
              <Typography fontWeight="bold">Balance :</Typography>
              <Typography fontWeight="bold">
                {section.balance.amount.toLocaleString("en-IN", {
                  minimumFractionDigits: 2
                })}{" "}
                {section.balance.type}
              </Typography>
            </Box>
          </Box>
        ))}

      </Box>
    </Box>
  );
};

export default SummarisedLedgerPrint;