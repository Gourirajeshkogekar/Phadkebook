import React from "react";
import {
  Box,
  Typography,
  Divider
} from "@mui/material";

export default function PurchaseRegisterMonthlySummaryPrint({
  startDate,
  endDate
}) {

  return (

    <Box
      sx={{
        width: "210mm",
        minHeight: "297mm",
        bgcolor: "#fff",
        px: "18mm",
        py: "14mm",
        fontFamily: '"Times New Roman", serif'
      }}
    >


      <Typography align="center" fontSize={18} fontWeight={700}>
        Phadke Prakashan, Kolhapur
      </Typography>


      <Typography align="center" fontSize={14} mt={0.5}>
        Purchase Register Monthly Summary
      </Typography>


      <Typography align="center" fontSize={12} mt={0.5}>
        From {startDate} to {endDate}
      </Typography>


      <Divider sx={{ my: 2, borderColor: "#000" }}/>


      <table
        width="100%"
        style={{
          borderCollapse: "collapse",
          fontSize: 12
        }}
      >

        <thead>

          <tr style={{ borderBottom: "1px solid #000" }}>
            <th align="left">Type Of Purchase</th>
            <th align="right">Basic</th>
            <th align="right">Sales Tax</th>
            <th align="right">Other</th>
            <th align="right">Total</th>
          </tr>

        </thead>


        <tbody>

          <tr>
            <td colSpan={5}
              style={{
                paddingTop: 10,
                fontWeight: 700,
                textAlign: "center"
              }}>
              Apr-25
            </td>
          </tr>


          <tr>
            <td>GST 12%</td>
            <td align="right">—</td>
            <td align="right">—</td>
            <td align="right">—</td>
            <td align="right">—</td>
          </tr>


          <tr>
            <td>GST 18%</td>
            <td align="right">—</td>
            <td align="right">—</td>
            <td align="right">—</td>
            <td align="right">—</td>
          </tr>


          <tr style={{
            borderTop: "1px solid #000",
            borderBottom: "1px solid #000"
          }}>
            <td style={{ fontWeight: 700 }}>
              Total - Apr-25
            </td>

            <td align="right">—</td>
            <td align="right">—</td>
            <td align="right">—</td>
            <td align="right">—</td>
          </tr>


        </tbody>

      </table>


    </Box>

  );
}