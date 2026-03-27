


















import React from "react";
import { Box, Typography } from "@mui/material";
import dayjs from "dayjs";

const StockDayBookPrint = ({ data = [], filters, company }) => {
  const rows = Array.isArray(data) ? data : [];

  // ✅ GROUP BY DATE → PARTY
  const grouped = {};

  rows.forEach((row) => {
    const date = row.Date;
    const party = row.Party;

    if (!grouped[date]) grouped[date] = {};
    if (!grouped[date][party]) grouped[date][party] = [];

    grouped[date][party].push(row);
  });

  return (
    <Box
      sx={{
        p: "10mm",
        width: "190mm",
        bgcolor: "white",
        color: "black",
        fontFamily: "Times New Roman"
      }}
    >
      {/* ===== HEADER ===== */}
      <Box textAlign="center" mb={2}>
        {/* ✅ DYNAMIC COMPANY NAME */}
        <Typography fontWeight="bold" fontSize="18px">
          {company?.CompanyName || "No Company Selected"}
        </Typography>

        {/* ✅ DYNAMIC ADDRESS */}
        <Typography fontSize="12px">
          {company?.Address1 || ""}
        </Typography>

        <Typography fontWeight="bold">
          Stock Day Book
        </Typography>

        <Typography fontSize="12px">
          Date From {dayjs(filters.startDate).format("DD-MM-YY")} To{" "}
          {dayjs(filters.endDate).format("DD-MM-YY")}
        </Typography>

        <Typography fontSize="10px">
          All Parties Inward & Outward All Transactions For All Books
        </Typography>
      </Box>

      {/* ===== TABLE ===== */}
      <table
        style={{
          width: "100%",
          borderCollapse: "collapse",
          fontSize: "11px"
        }}
      >
        <thead>
          <tr style={{ borderTop: "1px solid black", borderBottom: "1px solid black" }}>
            <th style={th}>Ref No</th>
            <th style={th}>Date</th>
            <th style={th}>Name of Party</th>
            <th style={th}>Particulars</th>
            <th style={{ ...th, textAlign: "right" }}>Inward</th>
            <th style={{ ...th, textAlign: "right" }}>Outward</th>
          </tr>
        </thead>

        <tbody>
          {Object.keys(grouped).map((date) => (
            <React.Fragment key={date}>
              
              {/* DATE HEADER */}
              <tr>
                <td colSpan={6} style={dateStyle}>
                  {dayjs(date).format("DD-MM-YY")}
                </td>
              </tr>

              {Object.keys(grouped[date]).map((party) => (
                <React.Fragment key={party}>
                  
                  {/* PARTY HEADER */}
                  <tr>
                    <td colSpan={6} style={partyStyle}>
                      {party}
                    </td>
                  </tr>

                  {/* ROWS */}
                  {grouped[date][party].map((row, i) => (
                    <tr key={i}>
                      <td style={td}>{row["Ref. no."]}</td>
                      <td style={td}>{dayjs(row.Date).format("DD-MM-YY")}</td>
                      <td style={{ ...td, textAlign: "left" }}>
                        {row["Name of the Party"]}
                      </td>
                      <td style={{ ...td, textAlign: "left" }}>
                        {row.Particulars}
                      </td>
                      <td style={{ ...td, textAlign: "right" }}>
                        {row.Inward}
                      </td>
                      <td style={{ ...td, textAlign: "right" }}>
                        {row.Outward}
                      </td>
                    </tr>
                  ))}
                </React.Fragment>
              ))}

            </React.Fragment>
          ))}
        </tbody>
      </table>

      {/* NO DATA */}
      {rows.length === 0 && (
        <Typography align="center">No Data Found</Typography>
      )}
    </Box>
  );
};

// STYLES
const th = {
  padding: "5px",
  textAlign: "center",
  fontWeight: "bold"
};

const td = {
  padding: "4px",
  textAlign: "center"
};

const dateStyle = {
  textAlign: "center",
  fontWeight: "bold",
  padding: "6px 0",
  borderTop: "1px solid black"
};

const partyStyle = {
  textAlign: "left",
  fontWeight: "bold",
  padding: "4px 0 4px 10px"
};

export default StockDayBookPrint;