import React from "react";
import { Box, Typography, Button } from "@mui/material";
import PrintIcon from "@mui/icons-material/Print";

function PurchaseregPrint({ state }) {
  
  const { 
    startDate = "01-04-25", 
    endDate = "31-03-26", 
    partyName = "ADHIKARI SWATI UMESH", 
    rows = [] 
  } = state || {};

   const calculateTotal = (key) => rows.reduce((sum, r) => sum + (Number(r[key]) || 0), 0);

  return (
    <Box sx={{ bgcolor: "#525659", minHeight: "100vh",   display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      
       <Box
        id="print-area"
        sx={{
          width: "297mm",  
          minHeight: "210mm",
          bgcolor: "#fff",
          
          fontFamily: '"Times New Roman", Times, serif',
          color: "#000",
        }}
      >
         <Typography align="center" sx={{ fontSize: "16px", fontWeight: "bold", mb: 0 }}>
          Phadke Prakashan, Kolhapur.
        </Typography>

        <Typography align="center" sx={{ fontSize: "13px", fontWeight: "bold", mb: 0 }}>
          Purchase Register ()
        </Typography>

        <Typography align="center" sx={{ fontSize: "11px", mb: 2 }}>
          Selected Party - {partyName} From {startDate} to {endDate}(BOOK PRINTING CHARGES)
          <span style={{ float: 'right' }}>Page 1 of 1</span>
        </Typography>

         <table
          width="100%"
          style={{
            borderCollapse: "collapse",
            fontSize: "10px", 
          }}
        >
          <thead>
            <tr style={{ borderTop: "1px solid #000", borderBottom: "1px solid #000" }}>
              <th align="left" style={{ padding: "4px 2px" }}>Date</th>
              <th align="left" style={{ padding: "4px 2px" }}>PV No.</th>
              <th align="left" style={{ padding: "4px 2px" }}>Supplier Name</th>
              <th align="left" style={{ padding: "4px 2px" }}>GSTIN</th>
              <th align="left" style={{ padding: "4px 2px" }}>Bill No.</th>
              <th align="left" style={{ padding: "4px 2px" }}>Bill Date</th>
              <th align="right" style={{ padding: "4px 2px" }}>Bill Amt.</th>
              <th align="left" style={{ padding: "4px 2px" }}>Purchase Type</th>
              <th align="right" style={{ padding: "4px 2px" }}>Taxable</th>
              <th align="right" style={{ padding: "4px 2px" }}>IGST/VAT</th>
              <th align="right" style={{ padding: "4px 2px" }}>CGST</th>
              <th align="right" style={{ padding: "4px 2px" }}>SGST</th>
              <th align="left" style={{ padding: "4px 2px" }}>Account Head</th>
              <th align="right" style={{ padding: "4px 2px" }}>Amount</th>
            </tr>
          </thead>

          <tbody>
            {rows.length === 0 ? (
              <tr>
                <td colSpan={14} style={{ padding: 40, textAlign: "center", fontStyle: "italic", borderBottom: "1px solid #000" }}>
                  No Data Available
                </td>
              </tr>
            ) : (
              rows.map((r, i) => (
                <tr key={i}>
                  <td style={{ padding: "2px" }}>{r.date}</td>
                  <td style={{ padding: "2px" }}>{r.pvNo}</td>
                  <td style={{ padding: "2px" }}>{r.supplierName}</td>
                  <td style={{ padding: "2px" }}>{r.gstin}</td>
                  <td style={{ padding: "2px" }}>{r.billNo}</td>
                  <td style={{ padding: "2px" }}>{r.billDate}</td>
                  <td align="right" style={{ padding: "2px" }}>{Number(r.billAmt).toFixed(2)}</td>
                  <td style={{ padding: "2px" }}>{r.purchaseType}</td>
                  <td align="right" style={{ padding: "2px" }}>{Number(r.taxable).toFixed(2)}</td>
                  <td align="right" style={{ padding: "2px" }}>{Number(r.igst).toFixed(2)}</td>
                  <td align="right" style={{ padding: "2px" }}>{Number(r.cgst).toFixed(2)}</td>
                  <td align="right" style={{ padding: "2px" }}>{Number(r.sgst).toFixed(2)}</td>
                  <td style={{ padding: "2px" }}>{r.accountHead}</td>
                  <td align="right" style={{ padding: "2px" }}>{Number(r.amount).toFixed(2)}</td>
                </tr>
              ))
            )}
          </tbody>

          <tfoot>
            <tr style={{ borderTop: "1px solid #000", borderBottom: "1px solid #000" }}>
              <td colSpan={6} align="center" style={{ padding: "4px", fontWeight: "bold" }}>Total</td>
              <td align="right" style={{ fontWeight: "bold" }}>{calculateTotal("billAmt").toFixed(2)}</td>
              <td></td>
              <td align="right" style={{ fontWeight: "bold" }}>{calculateTotal("taxable").toFixed(2)}</td>
              <td align="right" style={{ fontWeight: "bold" }}>{calculateTotal("igst").toFixed(2)}</td>
              <td align="right" style={{ fontWeight: "bold" }}>{calculateTotal("cgst").toFixed(2)}</td>
              <td align="right" style={{ fontWeight: "bold" }}>{calculateTotal("sgst").toFixed(2)}</td>
              <td></td>
              <td align="right" style={{ fontWeight: "bold" }}>{calculateTotal("amount").toFixed(2)}</td>
            </tr>
          </tfoot>
        </table>
      </Box>

      

      <style>{`
        @media print {
          @page { 
            size: A4 landscape; 
            margin: 5mm; 
          }
          body { background: none !important; }
          .no-print { display: none !important; }
          #print-area {
            box-shadow: none !important;
            width: 100% !important;
            margin: 0 !important;
            padding: 0 !important;
          }
        }
      `}</style>
    </Box>
  );
}

export default PurchaseregPrint;