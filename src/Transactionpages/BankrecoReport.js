import React, { useEffect, useState } from "react";
import axios from "axios";
import dayjs from "dayjs";
import { CircularProgress, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";


function BankRecoReport() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  
 // Replace the top-level params logic with this:
const searchStr = window.location.search || window.location.hash.split('?')[1] || "";
const params = new URLSearchParams(searchStr);

const StartDate = params.get("StartDate");
const EndDate = params.get("EndDate");
const AccountId = params.get("AccountId");
const StatusFilter = params.get("StatusFilter");
const BankRecoStartDate = params.get("BankRecoStartDate");

useEffect(() => {
  // 1. Get the string after the '?' regardless of Router type
  const searchStr = window.location.href.split('?')[1] || "";
  const queryParams = new URLSearchParams(searchStr);
  
  // 2. Use the EXACT keys you sent in handleReport
  const sDate = queryParams.get("StartDate");
  const eDate = queryParams.get("EndDate");
  const accId = queryParams.get("AccountId"); // Matches 'AccountId' from handleReport
  const sFilter = queryParams.get("StatusFilter");
  const bRecoDate = queryParams.get("BankRecoStartDate");

  console.log("Params parsed:", { sDate, eDate, accId, sFilter, bRecoDate });

  if (accId) {
    fetchReport(sDate, eDate, accId, sFilter, bRecoDate);
  } else {
    console.error("AccountId is missing in the URL");
    setLoading(false);
  }
}, []);



const fetchReport = async (sDate, eDate, accId, sFilter, bRecoDate) => {
  setLoading(true);
  try {
    const res = await axios.get(
      "https://publication.microtechsolutions.net.in/php/get/getBankReconcilationReport.php",
      {
        params: {
          StartDate: sDate,
          EndDate: eDate,
          AccountId: accId,
          StatusFilter: sFilter, // Use the passed value
          BankRecoStartDate: bRecoDate // Use the passed value
        },
      }
    );
    setRows(res.data.data || []);
  } catch (error) {
    console.error("Error fetching report", error);
    setRows([]);
  } finally {
    setLoading(false);
  }
};
const navigate = useNavigate("")
const handleBack = () =>{
  navigate(-1)
}


const handlePrint = async () => {
  setLoading(true);

  try {
    const element = document.getElementById("report-table");
    if (!element) return;

    // 1. Capture with scale for high quality
    const canvas = await html2canvas(element, {
      scale: 2,
      useCORS: true,
      logging: false,
    });

    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF("p", "mm", "a4");

    const pdfWidth = 210;
    const pdfHeight = 297;
    const imgWidth = pdfWidth;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;

    const headerHeight = 42; // Slightly increased for better spacing
    const pageContentHeight = pdfHeight - headerHeight;

    let heightLeft = imgHeight;
    let position = 0;

    const drawHeader = (doc) => {
      // White rectangle to mask the table content sliding underneath
      doc.setFillColor(255, 255, 255);
      doc.rect(0, 0, pdfWidth, headerHeight, 'F'); 

      doc.setFont("helvetica", "bold");
      doc.setFontSize(14);
      doc.text("Phadke Prakashan, Kolhapur.", pdfWidth / 2, 12, { align: "center" });

      doc.setFontSize(11);
      doc.text("Bank Reconciliation Report", pdfWidth / 2, 20, { align: "center" });

      doc.setFontSize(9);
      doc.setFont("helvetica", "normal");
      doc.text(`Period: ${StartDate} to ${EndDate}`, pdfWidth / 2, 27, { align: "center" });

      // --- MANUAL COLUMN HEADERS ---
      doc.setFont("helvetica", "bold");
      doc.setFontSize(8);
      doc.line(10, 32, 200, 32); // Top line
      
      // Adjusted X-coordinates to match your table data columns
      doc.text("Sr", 12, 37);
      doc.text("Date", 22, 37);
      doc.text("Chq No", 45, 37);
      doc.text("Account", 72, 37);
      doc.text("Debit", 115, 37);
      doc.text("Credit", 135, 37);
      doc.text("Passing Date", 155, 37);
      doc.text("Status", 185, 37);
      
      doc.line(10, 40, 200, 40); // Bottom line
    };

    // --- First Page ---
    drawHeader(pdf);
    // Notice: We add the image starting at headerHeight
    pdf.addImage(imgData, "PNG", 0, headerHeight, imgWidth, imgHeight);
    
    // We adjust heightLeft by the amount of data space used on the first page
    // On page 1, the image also contains the HTML header, so we offset that
    heightLeft -= pageContentHeight;

    // --- Subsequent Pages ---
    while (heightLeft > 0) {
      pdf.addPage();
      // Calculate position to show the next slice of the image
      position = heightLeft - imgHeight + headerHeight; 
      
      pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
      
      // RE-DRAW HEADER ON EVERY NEW PAGE
      drawHeader(pdf);

      heightLeft -= pageContentHeight;
    }

    window.open(pdf.output("bloburl"), "_blank");
  } catch (error) {
    console.error("PDF Generation Error:", error);
  } finally {
    setLoading(false);
  }
};



  return (
    <div style={{ padding: "20px", fontFamily: "Arial" }}>
      <div style={{ alignContent: "space-between",display:'flex', marginBottom: "10px",gap:'5px'  }} className="no-print">
                <Button variant="outlined" style={{color:'red'} }onClick={handleBack}>Back</Button>

        <Button variant="outlined" onClick={handlePrint}>Print Report</Button>
      </div>

      <h2 style={{ textAlign: "center" }}>Bank Reconciliation Report</h2>
      <p style={{ textAlign: "center" }}>
        <b>Period:</b> {StartDate ? dayjs(StartDate).format("DD-MM-YYYY") : "N/A"} to{" "}
        {EndDate ? dayjs(EndDate).format("DD-MM-YYYY") : "N/A"}
      </p>

      {loading ? (
        <div style={{ textAlign: "center" }}><CircularProgress /></div>
      ) : (
        <table width="100%" border="1" cellPadding="6"  id="report-table"   style={{ borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ backgroundColor: "#f2f2f2" }}>
              <th>Sr</th>
              <th>Cheque Date</th>
              <th>Cheque No</th>
              <th>Account</th>
              <th>Debit</th>
              <th>Credit</th>
              <th>Passing Date</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {rows.length > 0 ? rows.map((r, i) => (
              <tr key={i}>
                <td>{i + 1}</td>
                {/* Note: Matching the exact keys from your JSON response */}
                <td>{r["Cheque Date"]}</td> 
                <td>{r["Cheque No"]}</td>
                <td>{r["Account"]}</td>
                <td style={{ textAlign: "right" }}>{r.Debit}</td>
                <td style={{ textAlign: "right" }}>{r.Credit}</td>
                <td>{r["Passing Date"] || "-"}</td>
                <td>{r.Status}</td>
              </tr>
            )) : (
              <tr><td colSpan="8" style={{ textAlign: "center" }}>No records found</td></tr>
            )}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default BankRecoReport;