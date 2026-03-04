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

const SummarisedLedgerPrint = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const query = new URLSearchParams(location.search);
  const reportRef = useRef();

  const fromDate = query.get("fromdate");
  const toDate = query.get("todate");

  const [ledgerData, setLedgerData] = useState([]);

  // 🔹 Mock structured data (group wise)
  useEffect(() => {
    const mockData = [
      {
        title: "BOOKS PURCHASE",
        rows: [
          { code: "IA", name: "Inward Challan", amount: 430161.00 },
          { code: "OC", name: "Sales Challan", amount: 1260.00 },
          { code: "PU", name: "Book Purchase", amount: 9272199.00 }
        ],
        balance: { amount: 10969215.00, type: "Dr" }
      },
      {
        title: "FREIGHT A/C",
        rows: [
          { code: "CN", name: "Credit Note", amount: 250.00 },
          { code: "DN", name: "Debit Note", amount: -614.00 }
        ],
        balance: { amount: 364.00, type: "Cr" }
      },
      {
        title: "PURCHASE RETURN",
        rows: [
          { code: "PN", name: "Purchase Return - Debit Note", amount: -791828.00 }
        ],
        balance: { amount: 791828.00, type: "Cr" }
      }
    ];

    setLedgerData(mockData);
  }, []);

  const handlePrint = async () => {
    const element = reportRef.current;
    const canvas = await html2canvas(element, { scale: 2 });
    const imgData = canvas.toDataURL("image/png");

    const pdf = new jsPDF("p", "mm", "a4");
    const width = pdf.internal.pageSize.getWidth();
    const height = pdf.internal.pageSize.getHeight();

    pdf.addImage(imgData, "PNG", 0, 0, width, height);
    window.open(pdf.output("bloburl"), "_blank");
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