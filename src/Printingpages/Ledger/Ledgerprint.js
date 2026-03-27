
import React, { useState, useEffect, useRef, useMemo } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TableFooter,
  Button
} from "@mui/material";
import { ArrowBack } from "@mui/icons-material";
import axios from "axios";
import { toast } from "react-toastify";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import "jspdf-autotable";
import autoTable from "jspdf-autotable";
const LedgerPrint = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const query = new URLSearchParams(location.search);
  const reportRef = useRef();

  const [ledgerData, setLedgerData] = useState([]);
  const [printing, setPrinting] = useState(false);

  const isPrePrinted = query.get("prePrinted") === "true";
  const fromDate = query.get("fromdate");
  const toDate = query.get("todate");
const [reportSummary, setReportSummary] = useState(null);
  // -----------------------------------------------------
  // FETCH DATA (Mock – Replace with API later)
  // -----------------------------------------------------
useEffect(() => {
    const fetchLedgerData = async () => {
      const ids = query.get("ids") || query.get("AccountId");
      const fromDate = query.get("fromdate");
      const toDate = query.get("todate");

      try {
        const response = await axios.get(
          `https://publication.microtechsolutions.net.in/php/ledgerreport.php?fromdate=${fromDate}&todate=${toDate}&AccountId=${ids}&GroupId=&TrType=`
        );
        
        // FIX: Access response.data.transactions instead of just response.data
        if (response.data && response.data.transactions) {
          setLedgerData(response.data.transactions);
          setReportSummary(response.data.summary);
        } else {
          setLedgerData([]);
          toast.info("No transactions found for this period.");
        }
      } catch (error) {
        console.error("Error fetching ledger data:", error);
        toast.error("Failed to load ledger data");
      }
    };

    fetchLedgerData();
  }, [location.search]);


   const [activeCompany, setActiveCompany] = useState(null);
                 
                 useEffect(()=>{
                  const selected = localStorage.getItem("SelectedCompany");
                     console.log(selected, 'selected');
                    if (selected) {
                      try {
                        const parsedCompany = JSON.parse(selected);
                        setActiveCompany(parsedCompany);
                      } catch (e) {
                        console.error("Error parsing company data", e);
                      }
                    }
                    },[activeCompany]);
    
    

  // -----------------------------------------------------
  // TOTAL CALCULATION
  // -----------------------------------------------------
  const totals = useMemo(() => {
    return ledgerData.reduce(
      (acc, curr) => ({
        debit: acc.debit + (curr.debit || 0),
        credit: acc.credit + (curr.credit || 0)
      }),
      { debit: 0, credit: 0 }
    );
  }, [ledgerData]);

  // -----------------------------------------------------
  // PRINT FUNCTION
  // -----------------------------------------------------
 const handlePrint = () => {
  if (ledgerData.length === 0) {
    toast.error("No data to print");
    return;
  }

  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();

  // 1. Header Section
  doc.setFontSize(18);
  doc.text("PHADKE BOOK HOUSE", pageWidth / 2, 15, { align: "center" });
  doc.setFontSize(10);
  doc.text("Phadke Bhavan, Near Hari Mandir, Dudhali, KOLHAPUR - 416012", pageWidth / 2, 22, { align: "center" });
  
  doc.setFontSize(14);
  doc.setFont("helvetica", "bold");
  doc.text("Account Ledger", pageWidth / 2, 32, { align: "center" });
  
  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.text(`Period: ${fromDate} to ${toDate}`, 14, 40);

  // 2. Prepare Table Data
  const tableColumn = ["Date", "Type","AccountName", "Particulars", "Chq No", "Debit", "Credit", "Balance"];
  const tableRows = ledgerData.map(row => [
    row.Date,
    row.TrType,
    row.AccountName,
    row.Particulars,
    row.ChequeNo || "-",
    row.Debit > 0 ? parseFloat(row.Debit).toFixed(2) : "",
    row.Credit > 0 ? parseFloat(row.Credit).toFixed(2) : "",
    row.Balance
  ]);

  // 3. Generate Table (FIXED CALL)
  autoTable(doc, { // Pass 'doc' as the first argument
    startY: 45,
    head: [tableColumn],
    body: tableRows,
    theme: 'grid',
    headStyles: { 
        fillColor: [220, 220, 220], // 'fillGray' isn't a standard property, use fillColor
        textColor: 0, 
        fontStyle: 'bold', 
        fontSize: 9 
    },
    bodyStyles: { fontSize: 8 },
    columnStyles: {
      4: { halign: 'right' },
      5: { halign: 'right' },
      6: { halign: 'right' },
    },
    didDrawPage: (data) => {
      doc.setFontSize(8);
      doc.text(`Page ${data.pageNumber}`, pageWidth - 20, doc.internal.pageSize.getHeight() - 10);
    },
    foot: [[
      { content: 'GRAND TOTAL:', colSpan: 4, styles: { halign: 'right', fontStyle: 'bold' } },
      { content: reportSummary?.total_debit || "0.00", styles: { halign: 'right', fontStyle: 'bold' } },
      { content: reportSummary?.total_credit || "0.00", styles: { halign: 'right', fontStyle: 'bold' } },
      { content: '', styles: { halign: 'right' } }
    ]],
  });

  window.open(doc.output("bloburl"), "_blank");
};

  // -----------------------------------------------------
  // LAYOUT A – NORMAL PRINT
  // -----------------------------------------------------
  const PlainPaperLayout = () => (
    <Box sx={{ p: "20mm" }}>
      <Box sx={{ textAlign: "center", pb: 3 }}>
        <Typography variant="h4" sx={{ fontWeight: "bold" }}>
          PHADKE BOOK HOUSE
        </Typography>
        <Typography variant="body1">
          Phadke Bhavan, Near Hari Mandir, Dudhali, KOLHAPUR - 416012.
        </Typography>
        <Typography variant="h5" sx={{ mt: 2 }}>
          Account Ledger
        </Typography>
      </Box>

      <TableContainer>
        <Table
          sx={{
            width: "100%",
            borderCollapse: "collapse",
            "& td, & th": {
              border: "1px solid black",
              fontFamily: "serif",
              fontSize: "13px",
              padding: "6px 4px"
            }
          }}
        >
          <TableHead>
            <TableRow>
              <TableCell>Date</TableCell>
              <TableCell>Type</TableCell>
              <TableCell>Account Name</TableCell>
              <TableCell>Particulars</TableCell>
              <TableCell>Cheque No</TableCell>
              <TableCell align="right">Debit</TableCell>
              <TableCell align="right">Credit</TableCell>
              <TableCell align="right">Balance</TableCell>
            </TableRow>
          </TableHead>

         <TableBody>
  {ledgerData.map((row, i) => (
    <TableRow key={i}>
      <TableCell>{row.Date}</TableCell> {/* Capital 'D' */}
      <TableCell>{row.TrType}</TableCell> {/* Match 'TrType' */}
      <TableCell>{row.AccountName}</TableCell>
      <TableCell>{row.Particulars}</TableCell> {/* Match 'Particulars' */}
      <TableCell>{row.ChequeNo}</TableCell>
      <TableCell align="right">
        {parseFloat(row.Debit) > 0 ? parseFloat(row.Debit).toFixed(2) : ""}
      </TableCell>
      <TableCell align="right">
        {parseFloat(row.Credit) > 0 ? parseFloat(row.Credit).toFixed(2) : ""}
      </TableCell>
      <TableCell align="right">
        {row.Balance} {/* Already includes 'Cr/Dr' from your API */}
      </TableCell>
    </TableRow>
  ))}
</TableBody>

          <TableFooter>
            <TableRow>
              <TableCell colSpan={4} align="right" sx={{ fontWeight: "bold" }}>
                GRAND TOTAL:
              </TableCell>
             <TableCell align="right">{reportSummary?.total_debit}</TableCell>
<TableCell align="right">{reportSummary?.total_credit}</TableCell>
              <TableCell />
            </TableRow>
          </TableFooter>
        </Table>
      </TableContainer>
    </Box>
  );

  // -----------------------------------------------------
  // LAYOUT B – PRE PRINTED
  // -----------------------------------------------------
  const PrePrintedLayout = () => (
    <Box sx={{ pt: "70mm", px: "20mm" }}>
      <TableContainer>
        <Table
          sx={{
            width: "100%",
            "& td": {
              fontSize: "13px",
              fontFamily: "monospace",
              padding: "4px"
            }
          }}
        >
          <TableBody>
            {ledgerData.map((row, i) => (
              <TableRow key={i}>
                <TableCell>{row.date}</TableCell>
                <TableCell>{row.accountName}</TableCell>
                <TableCell>{row.particulars}</TableCell>
                <TableCell>{row.chequeNo}</TableCell>
                <TableCell align="right">
                  {row.debit > 0 ? row.debit.toFixed(2) : ""}
                </TableCell>
                <TableCell align="right">
                  {row.credit > 0 ? row.credit.toFixed(2) : ""}
                </TableCell>
                <TableCell align="right">
                  {row.balance.toFixed(2)} {row.balanceType}
                </TableCell>
              </TableRow>
            ))}

            <TableRow>
              <TableCell colSpan={3} align="right" sx={{ fontWeight: "bold" }}>
                TOTAL:
              </TableCell>
              <TableCell align="right" sx={{ fontWeight: "bold" }}>
                {totals.debit.toFixed(2)}
              </TableCell>
              <TableCell align="right" sx={{ fontWeight: "bold" }}>
                {totals.credit.toFixed(2)}
              </TableCell>
              <TableCell />
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );

  // -----------------------------------------------------
  // MAIN RETURN
  // -----------------------------------------------------
  return (
    <Box sx={{ bgcolor: "#eef1f5", minHeight: "100vh", pb: 5 }}>
      {/* Top Bar */}
      <Box
        sx={{
          p: 2,
          bgcolor: "white",
          borderBottom: "1px solid #ddd",
          display: "flex",
          gap: 2
        }}
      >
        <Button startIcon={<ArrowBack />} onClick={() => navigate(-1)}>
          Back
        </Button>

        <Button variant="contained" onClick={handlePrint} disabled={printing}>
          {printing ? "Generating..." : "Print Ledger"}
        </Button>
      </Box>

      {/* A4 Page */}
      <Box
        ref={reportRef}
        sx={{
          width: "210mm",
          minHeight: "297mm",
          margin: "30px auto",
          bgcolor: "white",
          boxShadow: "0 4px 20px rgba(0,0,0,0.08)"
        }}
      >
        {isPrePrinted ? <PrePrintedLayout /> : <PlainPaperLayout />}
      </Box>
    </Box>
  );
};

export default LedgerPrint;