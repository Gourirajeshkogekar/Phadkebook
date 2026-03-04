import React, { useEffect, useState } from "react";
import { Box, Typography, Divider } from "@mui/material";

export default function BankBookPrint() {

  const [formData, setFormData] = useState(null);

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("bankBookFormData"));
    setFormData(stored);
  }, []);

  return (
    <Box sx={{ p: 4, bgcolor: "#f4f6f9", minHeight: "100vh" }}>

      <Box
        sx={{
          maxWidth: 1000,
          mx: "auto",
          bgcolor: "#fff",
          p: 5,
          borderRadius: 2,
          boxShadow: "0 10px 30px rgba(0,0,0,0.1)"
        }}
      >

        {/* HEADER */}
        <Typography align="center" fontWeight={700} fontSize={20}>
          PHADKE PRAKASHAN, KOLHAPUR
        </Typography>

        <Typography align="center" mt={1} fontWeight={600}>
          CASH / BANK BOOK
        </Typography>

        <Typography align="center" mt={1}>
          From {formData?.startDate} To {formData?.endDate}
        </Typography>

        <Divider sx={{ my: 3 }} />

        {/* COLUMN HEADER */}
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns:
              "120px 1.2fr 1.2fr 120px 120px 140px",
            fontWeight: 700,
            pb: 1
          }}
        >
          <div>Date</div>
          <div>Account</div>
          <div>Particulars</div>
          <div style={{ textAlign: "right" }}>Debit</div>
          <div style={{ textAlign: "right" }}>Credit</div>
          <div style={{ textAlign: "right" }}>Balance</div>
        </Box>

        <Divider sx={{ mb: 2 }} />

        {/* EMPTY STRUCTURE */}
        <Box py={5} textAlign="center" color="#607d8b">
          Transaction rows will appear here after API integration
        </Box>

      </Box>

    </Box>
  );
}