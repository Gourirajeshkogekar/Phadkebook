import React, { forwardRef } from "react";
import { Box, Typography } from "@mui/material";

const ReceiptPrint = forwardRef(({ data }, ref) => {
  // If data isn't ready, show nothing
  if (!data) return null;

  return (
    <Box
      ref={ref}
      sx={{
        width: "210mm",
        height: "297mm",
        bgcolor: "white",
        p: "20mm",
        color: "black",
        fontFamily: "'Courier New', Courier, monospace", // Dot matrix style
        position: 'relative'
      }}
    >
      {/* Top Right Header Block */}
      <Box sx={{ position: 'absolute', top: '35mm', right: '45mm', textAlign: 'left' }}>
        <Typography sx={{ fontWeight: 'bold', fontSize: '1.2rem', mb: 1, pl: 5 }}>
          {data.serialNo}
        </Typography>
        <Typography sx={{ fontSize: '1rem', mb: 1 }}>
          {data.date}
        </Typography>
        <Typography sx={{ fontWeight: 'bold', fontSize: '1.1rem' }}>
          {data.amount}
        </Typography>
      </Box>

      {/* Main Body Content */}
      <Box sx={{ mt: '85mm', width: '100%', pl: '20mm' }}>
        {/* Bank Line */}
        <Typography sx={{ fontSize: '1rem', mb: 4 }}>
          {data.bankDetails}
        </Typography>

        {/* Amount Words */}
        <Typography sx={{ fontSize: '1rem', mb: 2, textAlign: 'center', pl: '20mm' }}>
          {data.amountInWords}
        </Typography>

        {/* Particulars */}
        <Typography sx={{ fontSize: '1rem', mb: 2, textAlign: 'center', pr: '20mm' }}>
          {data.particulars}
        </Typography>

        {/* Payment Mode */}
        <Typography sx={{ fontSize: '1.1rem', fontWeight: 'bold', mt: 5 }}>
          {data.paymentMode}
        </Typography>
      </Box>
    </Box>
  );
});

export default ReceiptPrint;