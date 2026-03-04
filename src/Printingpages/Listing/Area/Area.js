// src/pages/AreaListing.jsx

import React, { useState } from "react";
import {
  Box,
  Container,
  Typography,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Paper,
} from "@mui/material";

export default function AreaListing() {

  // ✅ Empty structure (no hardcoded data)
  const [areaList] = useState([]);

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "#f3f3f3", py: 5 }}>
      <Container maxWidth="lg">

        <Paper elevation={0} sx={{ p: 4, bgcolor: "#f3f3f3" }}>

          {/* Title */}
          <Typography
            align="center"
            sx={{
              fontSize: 26,
              fontWeight: "bold",
              letterSpacing: 1,
            }}
          >
            PHADKE BOOK HOUSE
          </Typography>

          {/* Subtitle */}
          <Typography
            align="center"
            sx={{
              fontSize: 18,
              mt: 1,
              mb: 3,
            }}
          >
            Area Listing
          </Typography>

          {/* Double Line */}
          <Box sx={{ borderTop: "1px solid #999", mb: 1 }} />
          <Box sx={{ borderTop: "1px solid #999", mb: 3 }} />

          {/* Table */}
          <Table>

            <TableHead>
              <TableRow>
                <TableCell align="center" sx={{ fontWeight: "bold" }}>
                  City
                </TableCell>

                <TableCell align="center" sx={{ fontWeight: "bold" }}>
                  Area
                </TableCell>

                <TableCell align="center" sx={{ fontWeight: "bold" }}>
                  City Code
                </TableCell>

                <TableCell align="center" sx={{ fontWeight: "bold" }}>
                  Area Code
                </TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {areaList.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} align="center">
                    No Records Available
                  </TableCell>
                </TableRow>
              ) : (
                areaList.map((row, index) => (
                  <TableRow key={index}>
                    <TableCell align="center">{row.city}</TableCell>
                    <TableCell align="center">{row.area}</TableCell>
                    <TableCell align="center">{row.cityCode}</TableCell>
                    <TableCell align="center">{row.areaCode}</TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>

          </Table>

        </Paper>
      </Container>
    </Box>
  );
}