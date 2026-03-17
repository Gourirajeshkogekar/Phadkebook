// // import React, { useState, useEffect, useRef, useMemo } from 'react';
// // import { useLocation, useNavigate } from 'react-router-dom';
// // import { 
// //   Box, Typography, Table, TableBody, TableCell, 
// //   TableContainer, TableHead, TableRow, TableFooter, Button
// // } from "@mui/material";
// // import { ArrowBack } from '@mui/icons-material';
// // import jsPDF from 'jspdf';
// // import html2canvas from 'html2canvas';

// // const LedgerPrint = () => {
// //   const location = useLocation();
// //   const navigate = useNavigate();
// //   const query = new URLSearchParams(location.search);
// //   const reportRef = useRef();
  
// //   const [loading, setLoading] = useState(false);
// //   const [ledgerData, setLedgerData] = useState([]);
// //   const [printing, setPrinting] = useState(false);

// //   const isPrePrinted = query.get("prePrinted") === "true";
// //   const fromDate = query.get("fromdate");
// //   const toDate = query.get("todate");

// //   useEffect(() => {
// //     const fetchLedgerData = async () => {
// //       setLoading(true);
// //       try {
// //         const mockResponse = [
// //           { date: "01-04-2025", trType: "OB", particulars: "Opening Balance", chequeNo: "", debit: 5000.00, credit: 0.00, balance: 5000.00, balanceType: "Dr" },
// //           { date: "15-05-2025", trType: "Sales", particulars: "Bill No: 405", chequeNo: "123456", debit: 0.00, credit: 2000.00, balance: 3000.00, balanceType: "Dr" }
// //         ];
// //         setTimeout(() => {
// //           setLedgerData(mockResponse);
// //           setLoading(false);
// //         }, 500);
// //       } catch (error) { setLoading(false); }
// //     };
// //     fetchLedgerData();
// //   }, [fromDate, toDate]);

// //   const totals = useMemo(() => {
// //     return ledgerData.reduce((acc, curr) => ({
// //       debit: acc.debit + (curr.debit || 0),
// //       credit: acc.credit + (curr.credit || 0)
// //     }), { debit: 0, credit: 0 });
// //   }, [ledgerData]);

// //   const handlePrint = async () => {
// //     setPrinting(true);
// //     try {
// //       const element = reportRef.current;
// //       const canvas = await html2canvas(element, { 
// //         scale: 2,
// //         useCORS: true,
// //         logging: false,
// //         backgroundColor: "#ffffff" // Ensures the PDF background is pure white
// //       });

// //       const imgData = canvas.toDataURL("image/png");
// //       const pdf = new jsPDF("p", "mm", "a4");
// //       const pdfWidth = pdf.internal.pageSize.getWidth();
// //       const pdfHeight = pdf.internal.pageSize.getHeight();

// //       pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
// //       window.open(pdf.output("bloburl"), "_blank");
// //     } catch (error) {
// //       console.error("Print Error:", error);
// //     } finally {
// //       setPrinting(false);
// //     }
// //   };
// // // ------------------------------------------------------------------
// //   // LAYOUT A: PLAIN PAPER (Single Line & Fit Fix)
// //   // ------------------------------------------------------------------
// //   const PlainPaperLayout = () => (
// //     <Box sx={{ p: '10mm', bgcolor: 'white' }}>
// //       <Box sx={{ textAlign: 'center', pb: 2 }}>
// //         <Typography variant="h5" sx={{ fontWeight: 'bold' }}>PHADKE BOOK HOUSE</Typography>
// //         <Typography variant="body2">Phadke Bhavan, Near Hari Mandir, Dudhali, KOLHAPUR - 416012.</Typography>
// //         <Typography variant="h6" sx={{ mt: 1 }}>Account Ledger</Typography>
// //       </Box>

// //       <TableContainer>
// //         <Table size="small" sx={{ 
// //           tableLayout: 'fixed', // Forces strict column widths
// //           width: '100%',
// //           "& td, & th": { 
// //             border: "1px solid black", 
// //             fontFamily: 'serif',
// //             fontSize: '11px', 
// //             padding: '4px 2px',
// //             whiteSpace: 'nowrap', // Prevents date and numbers from wrapping
// //             overflow: 'hidden',
// //             textOverflow: 'ellipsis' 
// //           } 
// //         }}>
// //           <TableHead>
// //             <TableRow>
// //               <TableCell sx={{ width: '18mm'}}>Date</TableCell>
// //               <TableCell sx={{ width: '9mm'}}>Type</TableCell>
// //               <TableCell sx={{ width: '55mm' }}>Particulars</TableCell>
// //                 <TableCell sx={{ width: '21mm' }}>CHEQUE NO</TableCell>
// //                 <TableCell sx={{ width: '27mm' }}align="right">Debit</TableCell>

// //               <TableCell sx={{ width: '26mm' }} align="right">Credit</TableCell>
// //               <TableCell sx={{ width: '29mm' }} align="right">Balance</TableCell>
// //             </TableRow>
// //           </TableHead>
// //           <TableBody>
// //             {ledgerData.map((row, i) => (
// //               <TableRow key={i}>
// //                 <TableCell>{row.date}</TableCell>
// //                 <TableCell>{row.trType}</TableCell>
// //                 <TableCell>{row.particulars}</TableCell>
// //                 <TableCell align="right">{row.chequeNo}</TableCell>
// //                 <TableCell align="right">
// //                     {row.debit > 0 ? row.debit.toFixed(2) : ""}
// //                 </TableCell>
// //                 <TableCell align="right">
// //                     {row.credit > 0 ? row.credit.toFixed(2) : ""}
// //                 </TableCell>
// //                 <TableCell align="right">
// //                     {row.balance.toFixed(2)} {row.balanceType}
// //                 </TableCell>
// //               </TableRow>
// //             ))}
// //           </TableBody>
// //           <TableFooter>
// //             <TableRow sx={{ fontWeight: 'bold' }}>
// //               <TableCell colSpan={4} align="right">GRAND TOTAL:</TableCell>
// //               <TableCell align="right">{totals.debit.toFixed(2)}</TableCell>
// //               <TableCell align="right">{totals.credit.toFixed(2)}</TableCell>
// //               <TableCell />
// //             </TableRow>
// //           </TableFooter>
// //         </Table>
// //       </TableContainer>
// //     </Box>
// //   );

// //   // ------------------------------------------------------------------
// //   // LAYOUT B: PRE-PRINTED STATIONERY (Pure White)
// //   // ------------------------------------------------------------------
// //   const PrePrintedLayout = () => (
// //     <Box sx={{ 
// //       pt: '70mm', 
// //       px: '10mm', 
// //       boxSizing: 'border-box',
// //       bgcolor: 'white' 
// //     }}>
// //       <TableContainer>
// //         <Table size="small" sx={{ 
// //           tableLayout: 'fixed', 
// //           width: '100%',
// //           "& td, & th": { 
// //             border: "none", 
// //             fontSize: '11px', 
// //             height: '8mm', 
// //             fontFamily: 'monospace',
// //             padding: '2px 2px', 
// //             whiteSpace: 'nowrap', 
// //             overflow: 'hidden'
// //           } 
// //         }}>
// //           <TableBody>
// //             {ledgerData.map((row, i) => (
// //               <TableRow key={i}>
// //                 <TableCell sx={{ width: '19mm' }}>{row.date}</TableCell>
// //                 <TableCell sx={{ width: '59mm' }}>{row.particulars}</TableCell>
// //                 <TableCell sx={{ width: '21mm' }}>{row.chequeNo}</TableCell>
// //                 <TableCell sx={{ width: '27mm' }} align="right">
// //                     {row.debit > 0 ? row.debit.toFixed(2) : ""}
// //                 </TableCell>
// //                 <TableCell sx={{ width: '26mm' }} align="right">
// //                     {row.credit > 0 ? row.credit.toFixed(2) : ""}
// //                 </TableCell>
// //                 <TableCell sx={{ width: '29mm' }} align="right">
// //                     {row.balance.toFixed(2)} {row.balanceType}
// //                 </TableCell>
// //               </TableRow>
// //             ))}
// //           </TableBody>
// //           <TableFooter>
// //              <TableRow>
// //                 <TableCell colSpan={3} sx={{ pt: '10mm', fontWeight: 'bold' }} align="right">TOTAL:</TableCell>
// //                 <TableCell sx={{ pt: '10mm', fontWeight: 'bold' }} align="right">{totals.debit.toFixed(2)}</TableCell>
// //                 <TableCell sx={{ pt: '10mm', fontWeight: 'bold' }} align="right">{totals.credit.toFixed(2)}</TableCell>
// //                 <TableCell />
// //              </TableRow>
// //           </TableFooter>
// //         </Table>
// //       </TableContainer>
// //     </Box>
// //   );

// //   return (
// //     <Box sx={{ bgcolor: '#f4f4f4', minHeight: '100vh', pb: 4 }}>
// //       {/* UI Navigation Bar */}
// //       <Box sx={{ p: 2, bgcolor: 'white', borderBottom: '1px solid #ddd', display: 'flex', gap: 2 }}>
// //         <Button startIcon={<ArrowBack />} onClick={() => navigate(-1)}>Back</Button>
// //         <Button variant="contained" onClick={handlePrint} disabled={printing}>
// //           {printing ? "Generating..." : "Print Ledger"}
// //         </Button>
// //       </Box>

// //       {/* Actual Printable Page Area */}
// //       <Box 
// //         ref={reportRef}
// //         sx={{ 
// //           width: '210mm',
// //           height: '297mm', 
// //           margin: '20px auto',
// //           bgcolor: 'white', // Ensure the ref container itself is white
// //           position: 'relative',
// //           overflow: 'hidden',
// //           boxShadow: '0 0 10px rgba(0,0,0,0.1)'
// //         }}
// //       >
// //         {isPrePrinted ? <PrePrintedLayout /> : <PlainPaperLayout />}
// //       </Box>
// //     </Box>
// //   );
// // };

// // export default LedgerPrint;



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
  const handlePrint = async () => {
   if (ledgerData.length === 0) {
    toast.error("No data to print");
    return;
  }
  setPrinting(true);
    try {
      const element = reportRef.current;

      const canvas = await html2canvas(element, {
        scale: 3,
        useCORS: true,
        backgroundColor: "#ffffff"
      });

      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");

      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();

      pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
      window.open(pdf.output("bloburl"), "_blank");
    } catch (error) {
      console.error("Print Error:", error);
    } finally {
      setPrinting(false);
    }
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


// import React, { useState, useEffect, useRef, useMemo } from "react";
// import { useLocation, useNavigate } from "react-router-dom";
// import {
//   Box,
//   Typography,
//   Table,
//   TableBody,
//   TableCell,
//   TableContainer,
//   TableHead,
//   TableRow,
//   TableFooter,
//   Button
// } from "@mui/material";
// import { ArrowBack } from "@mui/icons-material";
// import axios from "axios";
// import { toast } from "react-toastify";
// import jsPDF from "jspdf";
// import html2canvas from "html2canvas";

// const LedgerPrint = () => {
//   const location = useLocation();
//   const navigate = useNavigate();
//   const query = new URLSearchParams(location.search);
//   const reportRef = useRef();

//   const [ledgerData, setLedgerData] = useState([]); // This will store the transactions array
//   const [reportSummary, setReportSummary] = useState(null);
//   const [printing, setPrinting] = useState(false);

//   const isPrePrinted = query.get("prePrinted") === "true";

//   // -----------------------------------------------------
//   // FETCH DATA
//   // -----------------------------------------------------
//   useEffect(() => {
//     const fetchLedgerData = async () => {
//       const ids = query.get("ids") || query.get("AccountId");
//       const fromDate = query.get("fromdate");
//       const toDate = query.get("todate");

//       try {
//         const response = await axios.get(
//           `https://publication.microtechsolutions.net.in/php/ledgerreport.php?fromdate=${fromDate}&todate=${toDate}&AccountId=${ids}&GroupId=&TrType=`
//         );
        
//         // FIX: Access response.data.transactions instead of just response.data
//         if (response.data && response.data.transactions) {
//           setLedgerData(response.data.transactions);
//           setReportSummary(response.data.summary);
//         } else {
//           setLedgerData([]);
//           toast.info("No transactions found for this period.");
//         }
//       } catch (error) {
//         console.error("Error fetching ledger data:", error);
//         toast.error("Failed to load ledger data");
//       }
//     };

//     fetchLedgerData();
//   }, [location.search]);

//   // -----------------------------------------------------
//   // PRINT FUNCTION
//   // -----------------------------------------------------
//   const handlePrint = async () => {
//     if (ledgerData.length === 0) {
//       toast.error("No data to print");
//       return;
//     }
//     setPrinting(true);
//     try {
//       const element = reportRef.current;
//       const canvas = await html2canvas(element, {
//         scale: 3,
//         useCORS: true,
//         backgroundColor: "#ffffff"
//       });

//       const imgData = canvas.toDataURL("image/png");
//       const pdf = new jsPDF("p", "mm", "a4");
//       const pdfWidth = pdf.internal.pageSize.getWidth();
//       pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, (canvas.height * pdfWidth) / canvas.width);
//       window.open(pdf.output("bloburl"), "_blank");
//     } catch (error) {
//       console.error("Print Error:", error);
//     } finally {
//       setPrinting(false);
//     }
//   };

//   // -----------------------------------------------------
//   // LAYOUT A – NORMAL PRINT
//   // -----------------------------------------------------
//   const PlainPaperLayout = () => (
//     <Box sx={{ p: "15mm" }}>
//       <Box sx={{ textAlign: "center", pb: 3 }}>
//         <Typography variant="h5" sx={{ fontWeight: "bold" }}>PHADKE BOOK HOUSE</Typography>
//         <Typography variant="body2">Phadke Bhavan, Near Hari Mandir, Dudhali, KOLHAPUR - 416012.</Typography>
//         <Typography variant="subtitle1" sx={{ mt: 1, fontWeight: 'bold', textDecoration: 'underline' }}>
//           Account Ledger: {ledgerData[0]?.AccountName || ""}
//         </Typography>
//         <Typography variant="caption">Period: {reportSummary?.period}</Typography>
//       </Box>

//       <TableContainer>
//         <Table size="small" sx={{ 
//           width: "100%", 
//           "& td, & th": { border: "1px solid black", fontSize: "11px", padding: "4px" } 
//         }}>
//           <TableHead>
//             <TableRow sx={{ bgcolor: '#f5f5f5' }}>
//               <TableCell sx={{ width: '15%' }}>Date</TableCell>
//               <TableCell sx={{ width: '8%' }}>Type</TableCell>
//               <TableCell>Particulars</TableCell>
//               <TableCell align="right" sx={{ width: '12%' }}>Debit</TableCell>
//               <TableCell align="right" sx={{ width: '12%' }}>Credit</TableCell>
//               <TableCell align="right" sx={{ width: '15%' }}>Balance</TableCell>
//             </TableRow>
//           </TableHead>
//           <TableBody>
//             {ledgerData.map((row, i) => (
//               <TableRow key={i}>
//                 <TableCell>{row.Date}</TableCell>
//                 <TableCell>{row.TrType}</TableCell>
//                 <TableCell>
//                     <Typography variant="caption" display="block" sx={{ fontWeight: 'bold' }}>{row.Particular}</Typography>
//                     {row.Particulars}
//                 </TableCell>
//                 <TableCell align="right">{parseFloat(row.Debit) > 0 ? row.Debit : ""}</TableCell>
//                 <TableCell align="right">{parseFloat(row.Credit) > 0 ? row.Credit : ""}</TableCell>
//                 <TableCell align="right" sx={{ fontWeight: 'bold' }}>{row.Balance}</TableCell>
//               </TableRow>
//             ))}
//           </TableBody>
//           <TableFooter>
//             <TableRow>
//               <TableCell colSpan={3} align="right" sx={{ fontWeight: "bold" }}>TOTALS:</TableCell>
//               <TableCell align="right" sx={{ fontWeight: "bold" }}>{reportSummary?.total_debit}</TableCell>
//               <TableCell align="right" sx={{ fontWeight: "bold" }}>{reportSummary?.total_credit}</TableCell>
//               <TableCell align="right" sx={{ fontWeight: "bold", bgcolor: '#eee' }}>{reportSummary?.net_balance}</TableCell>
//             </TableRow>
//           </TableFooter>
//         </Table>
//       </TableContainer>
//     </Box>
//   );

//   return (
//     <Box sx={{ bgcolor: "#eef1f5", minHeight: "100vh" }}>
//       <Box sx={{ p: 2, bgcolor: "white", display: "flex", gap: 2, borderBottom: "1px solid #ddd" }}>
//         <Button startIcon={<ArrowBack />} onClick={() => navigate(-1)}>Back</Button>
//         <Button variant="contained" onClick={handlePrint} disabled={printing || ledgerData.length === 0}>
//           {printing ? "Generating PDF..." : "Print Ledger"}
//         </Button>
//       </Box>

//       <Box ref={reportRef} sx={{ width: "210mm", minHeight: "297mm", margin: "20px auto", bgcolor: "white", boxShadow: 3 }}>
//         {ledgerData.length > 0 ? <PlainPaperLayout /> : (
//             <Box sx={{ p: 5, textAlign: 'center' }}>
//                 <Typography>Loading ledger data...</Typography>
//             </Box>
//         )}
//       </Box>
//     </Box>
//   );
// };

// export default LedgerPrint;