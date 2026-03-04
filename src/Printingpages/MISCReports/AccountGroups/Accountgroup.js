import React, { useEffect, useRef } from "react";
import { Box, Typography } from "@mui/material";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

const AccountGroupListing = ({ data = [] }) => {
  const reportRef = useRef();

  useEffect(() => {
    // Only auto-print if data is available
    if (data.length > 0) {
      handlePrint();
    }
  }, [data]);

  const handlePrint = async () => {
    setTimeout(async () => {
      const element = reportRef.current;
      if (!element) return;

      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
      });

      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");

      pdf.addImage(imgData, "PNG", 0, 0, 210, 297);
      window.open(pdf.output("bloburl"), "_blank");
    }, 500);
  };

  return (
    <Box
      ref={reportRef}
      sx={{
        width: "210mm",
        minHeight: "297mm",
        p: "10mm 15mm",
        bgcolor: "#fff",
        // Using serif font for that official document look seen in screenshot
        fontFamily: "'Times New Roman', serif",
        color: "#000",
      }}
    >
      {/* HEADER SECTION */}
      <Box textAlign="center" mb={1}>
        <Typography variant="h6" sx={{ fontWeight: "bold", fontSize: "18px" }}>
          Phadke Publications
        </Typography>
        <Typography sx={{ fontSize: "14px", fontWeight: 500 }}>
          Account Groups
        </Typography>
      </Box>

      {/* DOUBLE HORIZONTAL LINE SEPARATOR */}
      <Box sx={{ borderTop: "1px solid black", borderBottom: "1px solid black", height: "2px", mb: 1 }} />

      <table width="100%" style={{ borderCollapse: "collapse", fontSize: "12px" }}>
        <thead>
          {/* TOP ROW OF HEADERS */}
          <tr>
            <th style={headerStyle} rowSpan={2}>Sr No</th>
            <th style={headerStyle} rowSpan={2}>Group Name</th>
            <th style={{ ...headerStyle, textAlign: "center" }} colSpan={2}>
              Print Details In
            </th>
            <th style={headerStyle} rowSpan={2}>Account Type</th>
          </tr>
          {/* SUB-HEADERS FOR PRINT DETAILS */}
          <tr>
            <th style={{ ...headerStyle, borderTop: "none" }}>B Sheet / P & L</th>
            <th style={{ ...headerStyle, borderTop: "none" }}>Trial Balance</th>
          </tr>
        </thead>

        <tbody>
          {data.map((item, index) => (
            <tr key={index}>
              <td style={cellStyle}>{index + 1}</td>
              <td style={cellStyle}>{item.GroupName}</td>
              <td style={cellStyle}>{item.IsPrintDetailsinBL ? "Yes" : ""}</td>
              <td style={cellStyle}>{item.IsPrintDetailsinTB ? "Yes" : ""}</td>
              <td style={cellStyle}>{item.TypeCode === 'B' ? 'Other' : item.TypeCode}</td>
            </tr>
          ))}
          
          {/* Example static rows to match your screenshot visual */}
          {[1, 2, 3].map((_, i) => (
             <tr key={`static-${i}`}>
                <td style={cellStyle}>{i + 1}</td>
                <td style={cellStyle}>ADVANCE INCOME TAX</td>
                <td style={cellStyle}>Yes</td>
                <td style={cellStyle}></td>
                <td style={cellStyle}>Other</td>
             </tr>
          ))}
        </tbody>
      </table>
      
      {/* BOTTOM BORDER TO CLOSE TABLE LIST */}
      <Box sx={{ borderTop: "1px solid black", mt: 1 }} />
    </Box>
  );
};

// Custom Styles to match the screenshot precisely
const headerStyle = {
  borderBottom: "1px solid black",
  padding: "4px 8px",
  textAlign: "left",
  fontWeight: "bold",
  fontSize: "12px",
};

const cellStyle = {
  padding: "4px 8px",
  textAlign: "left",
  verticalAlign: "top",
};

export default AccountGroupListing;