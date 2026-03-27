

import React, { useState, useEffect } from "react";
import { Box, Typography } from "@mui/material";

export default function StockBookPrint({ data = [], filters = {} }) {
  const { startDate, endDate } = filters;

  const safeData = Array.isArray(data) ? data : [];

  // ✅ COMPANY STATE
  const [activeCompany, setActiveCompany] = useState(null);

  // ✅ LOAD FROM LOCALSTORAGE
  useEffect(() => {
    const selected = localStorage.getItem("SelectedCompany");

    if (selected) {
      try {
        const parsedCompany = JSON.parse(selected);
        setActiveCompany(parsedCompany);
      } catch (e) {
        console.error("Error parsing company data", e);
      }
    }
  }, []); // ✅ IMPORTANT (empty dependency)

  // ✅ GROUP DATA
  const groupedData = safeData.reduce((acc, item) => {
    const key = item?.Party || "Others";
    if (!acc[key]) acc[key] = [];
    acc[key].push(item);
    return acc;
  }, {});

  return (
    <Box
      sx={{
        p: 4,
        bgcolor: "white",
        width: "800px",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <style>
        {`
          table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 10px;
          }

          th {
            border-top: 2px solid black;
            border-bottom: 2px solid black;
            padding: 6px;
            font-size: 13px;
            text-align: left;
          }

          td {
            padding: 5px;
            font-size: 12px;
          }

          .text-right {
            text-align: right;
          }

          .header-title {
            font-weight: bold;
            font-size: 20px;
          }

          .sub-header {
            font-weight: bold;
            margin-top: 15px;
            margin-bottom: 5px;
          }
        `}
      </style>

      {/* ===== HEADER ===== */}
      <Box textAlign="center" mb={2}>
        <Typography className="header-title">
          {activeCompany?.CompanyName || "No Company Selected"}
        </Typography>

        <Typography variant="body2">
          {activeCompany?.Address1 || ""}
        </Typography>

        <Typography variant="body2">Stock Book</Typography>

        <Typography variant="body2">
          From {startDate} To {endDate}
        </Typography>
      </Box>

      {/* ===== GROUP LOOP ===== */}
      {Object.keys(groupedData).map((groupName, gIndex) => {
        let balance = 0;

        return (
          <Box key={gIndex} mb={2}>
            <Typography className="sub-header">
              {groupName}
            </Typography>

            <table>
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Ref No</th>
                  <th>Particulars</th>
                  <th className="text-right">Inward</th>
                  <th className="text-right">Outward</th>
                  <th className="text-right">Balance</th>
                </tr>
              </thead>

              <tbody>
                {groupedData[groupName].map((row, index) => {
                  const inward = parseFloat(row?.Inward || 0);
                  const outward = parseFloat(row?.Outward || 0);

                  balance = balance + inward - outward;

                  return (
                    <tr key={index}>
                      <td>{row?.Date || "-"}</td>
                      <td>{row?.["Ref. no."] || "-"}</td>
                      <td>{row?.Particulars || "-"}</td>

                      <td className="text-right">{inward}</td>
                      <td className="text-right">{outward}</td>
                      <td className="text-right">{balance}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </Box>
        );
      })}

      {/* ===== NO DATA ===== */}
      {safeData.length === 0 && (
        <Typography align="center">No Data Found</Typography>
      )}
    </Box>
  );
}