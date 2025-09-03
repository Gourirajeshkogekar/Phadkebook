import React, { useEffect, useState } from "react";
import {
  Container,
  Typography,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Paper,
} from "@mui/material";
import axios from "axios";

function TDSMasterlistingReports() {
  const [tdsList, setTdsList] = useState([]);

  useEffect(() => {
    axios
      .get(
        "http://publication.microtechsolutions.net.in/php/tdsmasterlisting.php"
      )
      .then((res) => {
        setTdsList(res.data);
      });
  }, []);

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Typography variant="h6" fontWeight="bold" align="center">
        M. V. Phadke & Co. Kolhapur
      </Typography>
      <Typography variant="subtitle1" align="center" gutterBottom>
        TDS Master Listing
      </Typography>

      <Paper sx={{ mt: 2 }}>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>
                <strong>Sr. #</strong>
              </TableCell>
              <TableCell>
                <strong>T.D.S. Head</strong>
              </TableCell>
              <TableCell>
                <strong>T.D.S. Section</strong>
              </TableCell>
              <TableCell>
                <strong>T.D.S. %</strong>
              </TableCell>
              <TableCell>
                <strong>Surcharge %</strong>
              </TableCell>
              <TableCell>
                <strong>Net %</strong>
              </TableCell>
              <TableCell>
                <strong>Account Head</strong>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {tdsList.map((row, idx) => (
              <TableRow key={idx}>
                <TableCell>{row.srNo}</TableCell>
                <TableCell>{row.tdsHead}</TableCell>
                <TableCell>{row.tdsSection}</TableCell>
                <TableCell>{row.tdsPercent}</TableCell>
                <TableCell>{row.surchargePercent || "-"}</TableCell>
                <TableCell>{row.netPercent}</TableCell>
                <TableCell>{row.accountHead}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>
    </Container>
  );
}

export default TDSMasterlistingReports;
