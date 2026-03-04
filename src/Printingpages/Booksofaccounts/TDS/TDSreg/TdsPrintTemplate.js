import React, { forwardRef } from "react";

const TDSPrintTemplate = forwardRef(({ data }, ref) => {
  const { dates, selectedParty } = data;

  return (
    <div ref={ref} className="print-page" style={{
      padding: "15mm",
      fontFamily: "'Times New Roman', serif",
      color: "#000",
      backgroundColor: "#fff"
    }}>
      <style>
        {`
          @media print {
            .print-page { width: 210mm; min-height: 297mm; }
            table { width: 100%; border-collapse: collapse; font-size: 10pt; }
            th { border-bottom: 1px dashed #000; border-top: 1px dashed #000; padding: 5px 2px; text-align: left; }
            td { padding: 4px 2px; }
          }
        `}
      </style>

      {/* HEADER */}
      <div style={{ textAlign: "center" }}>
        <h2 style={{ margin: 0 }}>Phadke Prakashan, Kolhapur.</h2>
        <div style={{ fontSize: "14pt", fontWeight: "bold", margin: "5px 0" }}>TDS Register</div>
        <div>Period: {dates.start} To {dates.end}</div>
      </div>

      <div style={{ textAlign: "right", marginTop: "-20px" }}>Page: 1</div>

      {/* TABLE */}
      <table style={{ marginTop: "20px" }}>
        <thead>
          <tr>
            <th>Trans Date</th>
            <th>Entry #</th>
            <th>Ref No.</th>
            <th>Trans Cd.</th>
            <th style={{ textAlign: "right" }}>Amount</th>
            <th style={{ textAlign: "right" }}>Rate</th>
            <th style={{ textAlign: "right" }}>TDS Amt</th>
            <th style={{ textAlign: "right" }}>Total TDS</th>
            <th>Bank Name</th>
            <th>Cert #</th>
          </tr>
        </thead>
        <tbody>
          {/* Mapping would happen here */}
          <tr>
             <td colSpan={10} style={{ paddingTop: '20px', fontWeight: 'bold' }}>
               PARTY: {selectedParty?.AccountName || "ALL PARTIES"}
             </td>
          </tr>
          {/* Dummy Row for visual check */}
          <tr>
            <td>01/04/2025</td>
            <td>E001</td>
            <td>REF/101</td>
            <td>TDS-94J</td>
            <td style={{ textAlign: "right" }}>10,000.00</td>
            <td style={{ textAlign: "right" }}>10%</td>
            <td style={{ textAlign: "right" }}>1,000.00</td>
            <td style={{ textAlign: "right" }}>1,000.00</td>
            <td>HDFC BANK</td>
            <td>C-882</td>
          </tr>
        </tbody>
      </table>

      {/* FOOTER AREA */}
      <div style={{ marginTop: "30px", borderTop: "1px solid #000", paddingTop: "10px" }}>
        <div style={{ fontWeight: "bold" }}>PAN NO: {selectedParty?.PanNo || "N/A"}</div>
        <div style={{ marginTop: "10px", textAlign: "right", fontWeight: "bold" }}>
          SUB TOTAL: 1,000.00
        </div>
      </div>
    </div>
  );
});

export default TDSPrintTemplate;