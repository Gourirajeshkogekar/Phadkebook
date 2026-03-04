import React from "react";
import { Box, Typography, Button, Divider } from "@mui/material";
import PrintIcon from "@mui/icons-material/Print";
import { useLocation } from "react-router-dom";

export default function TDSCertificatePrint() {
  const { state } = useLocation() || {};

  const startDate = state?.startDate || "01-04-25";
  const endDate = state?.endDate || "31-03-26";
  const party = state?.party || "ANAND OFFSET PRINTERS";

  // Example data structure to match screenshot columns
  const rows = state?.rows || [
    { sr: 1, paid: "3,350.00", date: "17/01/26", tds: "34.00", sur: "0.00", edu: "0.00", she: "", total: "34.00", chq: "", bsr: "", dateDep: "", trans: "" }
  ];

  return (
    <Box sx={{ background: "#eef2f7", minHeight: "100vh", py: 4 }}>
      <Box
        id="print-area"
        sx={{
          width: "210mm",
          minHeight: "297mm",
          margin: "auto",
          background: "#fff",
          p: "10mm",
          fontFamily: "'Times New Roman', serif",
          color: "#000",
          boxShadow: "0 0 10px rgba(0,0,0,0.1)"
        }}
      >
        {/* HEADER */}
        <Box textAlign="right" mb={1}>
          <Typography sx={{ fontSize: "12px", fontWeight: "bold" }}>Cert. No. :</Typography>
        </Box>

        <Typography align="center" variant="h6" sx={{ fontWeight: "bold", mb: 0 }}>
          FORM NO. 16 A
        </Typography>
        <Typography align="center" sx={{ fontSize: "11px", fontStyle: "italic", mb: 1 }}>
          [See rule 31(1)(b)]
        </Typography>

        <Typography align="center" sx={{ fontWeight: "bold", fontSize: "13px", mb: 1 }}>
          Certificate of deduction of tax at source under section 203 of the Income-tax Act, 1961.
        </Typography>

        <Typography sx={{ fontSize: "9px", textAlign: "justify", mb: 2, lineHeight: 1.2 }}>
          For interest on securities; dividends; interest other than 'interest on securities'; winning from lottery or crossword puzzle; winnings from
          horse race; payments to contractors and sub-contractors; insurance commission; payments to non-resident sportsmen/sports associations;
          payments in respect of deposits under National Savings Scheme; payments on account of repurchase of units by Mutual Fund or Unit Trust
          of India; Commission, remuneration or prize on sale of lottery tickets; rent, fees for professional or technical services; income in respect of
          units; Payment of compensation on acquisition of certain immovable property; other sums under section 195; income of foreign companies
          referred to in section 196 A (2); income from units referred to in section 196 B; income from foreign currency bonds or shares of an
          Indian company referred to in section 196 C; income of Foreign Institutional Investors from securities referred to in section 196 D.
        </Typography>

        {/* TOP INFO BOXES */}
        <table width="100%" style={{ borderCollapse: "collapse", border: "1px solid #000" }}>
          <tbody>
            <tr>
              <td width="33%" style={boxCell}>
                <Typography sx={labelStyle}>Name & address of the person deducting tax</Typography>
                <Divider sx={{ my: 0.5, borderColor: "#000" }} />
                <Typography sx={valStyle}><b>Phadke Prakashan, Kolhapur.</b></Typography>
                <Typography sx={valStyle}>Phadke Bhavan, Near Hari</Typography>
                <Typography sx={valStyle}>Mandir, Dudhali Kolhapur 416012</Typography>
              </td>
              <td width="33%" style={boxCell}>
                <Typography sx={labelStyle}>Acknowledgement Nos. of all Quarterly Statements of TDS under sub-section(3) of section 200 as provided by TIN Facilitation Centre or NSDL web-site</Typography>
                <table width="100%" style={{ borderCollapse: "collapse", marginTop: "5px", border: "1px solid #000" }}>
                  <thead>
                    <tr>
                      <th style={miniTh}>Quarter</th>
                      <th style={miniTh}>Acknowledgement No.</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[1, 2, 3, 4].map(q => <tr key={q}><td style={miniTd}>{q}</td><td style={miniTd}></td></tr>)}
                  </tbody>
                </table>
              </td>
              <td width="33%" style={boxCell}>
                <Typography sx={labelStyle}>Name & address of the person to whom payment made or in whose account it is credited</Typography>
                <Divider sx={{ my: 0.5, borderColor: "#000" }} />
                <Typography sx={valStyle}><b>{party}</b></Typography>
              </td>
            </tr>
            <tr>
              <td style={boxCell}>
                <Typography sx={labelStyle}>TAX DEDUCTION A/C OF THE DEDUCTOR</Typography>
                <Typography sx={valStyle}>KLPMO 1647 C</Typography>
              </td>
              <td style={boxCell}>
                <Typography sx={labelStyle}>NATURE OF PAYMENT</Typography>
                <Typography sx={valStyle}>194 C BOOK PRINTING CHARGES</Typography>
              </td>
              <td style={boxCell}>
                <Typography sx={labelStyle}>PAN / GIR NO. OF THE PAYEE</Typography>
                <Typography sx={valStyle}>AAJPC0647C</Typography>
              </td>
            </tr>
            <tr>
              <td style={boxCell}>
                <Typography sx={labelStyle}>PAN / GIR NO. OF THE DEDUCTOR</Typography>
                <Typography sx={valStyle}>AABFP 6962 F</Typography>
              </td>
              <td style={boxCell}></td>
              <td style={boxCell}>
                <Typography sx={labelStyle}>FOR THE PERIOD</Typography>
                <Typography sx={valStyle}>From {startDate} To {endDate}</Typography>
              </td>
            </tr>
          </tbody>
        </table>

        {/* DETAILS TABLE */}
        <Typography align="center" sx={{ fontWeight: "bold", fontSize: "11px", mt: 2, mb: 1 }}>
          DETAILS PAYMENT, TAX DEDUCTION AND DEPOSIT OF TAX INTO CENTRAL GOVERNMENT ACCOUNT
        </Typography>

        <table width="100%" style={{ borderCollapse: "collapse", border: "1px solid #000" }}>
          <thead>
            <tr>
              <th rowSpan="2" style={thStyle}>Sr. No.</th>
              <th rowSpan="2" style={thStyle}>Amount Paid / Credited</th>
              <th rowSpan="2" style={thStyle}>Date of Payment /Credit</th>
              <th colSpan="4" style={thStyle}>Tax Deducted</th>
              <th rowSpan="2" style={thStyle}>Total tax deposited (Rs.)</th>
              <th rowSpan="2" style={thStyle}>Cheque/ DD No.(If Any)</th>
              <th rowSpan="2" style={thStyle}>BSR Code of Bank branch</th>
              <th rowSpan="2" style={thStyle}>Date on which tax deposited (dd/mm/yy)</th>
              <th rowSpan="2" style={thStyle}>Transfer Voucher/ Challan</th>
            </tr>
            <tr>
              <th style={thStyle}>TDS Rs.</th>
              <th style={thStyle}>Surchar ge Rs.</th>
              <th style={thStyle}>Educati on Cess Rs.</th>
              <th style={thStyle}>S & H Ed. Cess</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r, i) => (
              <tr key={i}>
                <td style={tdStyle}>{r.sr}</td>
                <td style={tdStyle}>{r.paid}</td>
                <td style={tdStyle}>{r.date}</td>
                <td style={tdStyle}>{r.tds}</td>
                <td style={tdStyle}>{r.sur}</td>
                <td style={tdStyle}>{r.edu}</td>
                <td style={tdStyle}>{r.she}</td>
                <td style={tdStyle}>{r.total}</td>
                <td style={tdStyle}>{r.chq}</td>
                <td style={tdStyle}>{r.bsr}</td>
                <td style={tdStyle}>{r.dateDep}</td>
                <td style={tdStyle}>{r.trans}</td>
              </tr>
            ))}
            <tr>
              <td style={tdStyle}></td>
              <td style={tdStyle}>3350.00</td>
              <td style={tdStyle}></td>
              <td style={tdStyle}>34.00</td>
              <td style={tdStyle}></td>
              <td style={tdStyle}>0</td>
              <td style={tdStyle}></td>
              <td style={tdStyle}>34.00</td>
              <td colSpan="4" style={tdStyle}></td>
            </tr>
          </tbody>
        </table>

        {/* CERTIFICATION */}
        <Typography sx={{ fontSize: "11px", mt: 2 }}>
          Certified that a sum of Rs. (in words) <b>Thirty-four only</b> has been deducted at source and paid to the credit of the Central Government as per details given above.
        </Typography>

        <Box sx={{ mt: 2, display: "flex", justifyContent: "space-between" }}>
          <Box>
            <Typography sx={valStyle}>Place : KOLHAPUR</Typography>
            <Typography sx={valStyle}>Date : </Typography>
          </Box>
          <Box textAlign="right">
            <Typography sx={{ fontSize: "11px", fontWeight: "bold" }}>Signature of person responsible for deduction of tax</Typography>
            <Typography sx={{ fontSize: "11px", fontWeight: "bold" }}>For Phadke Prakashan, Kolhapur.</Typography>
            <Typography sx={{ fontSize: "11px", mt: 4 }}>Designation : Partner</Typography>
          </Box>
        </Box>
      </Box>

      {/* PRINT BUTTON */}
      <Box textAlign="center" mt={3}>
        <Button variant="contained" startIcon={<PrintIcon />} onClick={() => window.print()}>
          Print Certificate
        </Button>
      </Box>

      <style>{`
        @media print {
          body { background: none; }
          #print-area { box-shadow: none; margin: 0; width: 100%; }
          button { display: none !important; }
        }
      `}</style>
    </Box>
  );
}

// STYLES
const boxCell = { border: "1px solid #000", padding: "4px", verticalAlign: "top" };
const labelStyle = { fontSize: "9px", fontWeight: "bold", lineHeight: 1.1 };
const valStyle = { fontSize: "11px" };
const miniTh = { border: "1px solid #000", fontSize: "9px", padding: "2px" };
const miniTd = { border: "1px solid #000", fontSize: "9px", padding: "2px", height: "12px" };
const thStyle = { border: "1px solid #000", fontSize: "8.5px", padding: "3px", fontWeight: "bold", textAlign: "center" };
const tdStyle = { border: "1px solid #000", fontSize: "10px", padding: "3px", textAlign: "center", minHeight: "15px" };