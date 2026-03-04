import { Box, Paper, Typography, Button } from "@mui/material";
import PrintIcon from "@mui/icons-material/Print";
import { useLocation } from "react-router-dom";

export default function StockStatementPrint() {

  const { state } = useLocation() || {};
  const handlePrint = () => window.print();

  /* ===== DATA FROM NAVIGATION ===== */

  const rows = state?.rows || [];
  const startDate = state?.startDate;
  const endDate = state?.endDate;

  const generatedOn = new Date().toLocaleString();

  return (
    <Box sx={{ background: "#bdbdbd", minHeight: "100vh", p: 3 }}>

      {/* ===== REPORT PAGE ===== */}

      <Paper
        sx={{
          width: "210mm",
          minHeight: "297mm",
          mx: "auto",
          p: 5,
          background: "#fff",
          color: "#000",
          boxShadow: 6
        }}
      >

        {/* ===== HEADER ===== */}

        <Typography align="center" fontWeight={700} fontSize={20}>
          M. V. Phadke & Co. Kolhapur
        </Typography>

        <Typography align="center" fontWeight={600} mt={1}>
          Stock Statement
        </Typography>

        <Typography align="center" mt={1}>
          From {startDate || "____"} To {endDate || "____"}
        </Typography>

        <Typography align="right" mt={-5}>
          Page 1
        </Typography>

        <Box borderTop="2px solid #000" mt={2} mb={2} />

        {/* ===== TABLE HEADER ===== */}

        <Box
          display="grid"
          gridTemplateColumns="140px 1fr 160px"
          fontWeight={700}
          fontSize={14}
          borderBottom="1px solid #000"
          pb={1}
        >
          <div>Book Code</div>
          <div>Particulars</div>
          <div style={{ textAlign: "right" }}>Closing Stock</div>
        </Box>

        {/* ===== ROWS ===== */}

        {rows.length === 0 && (
          <Typography mt={3} align="center">
            No data received
          </Typography>
        )}

        {rows.map((r, i) => (
          <Box
            key={i}
            display="grid"
            gridTemplateColumns="140px 1fr 160px"
            fontSize={14}
            py={1.1}
            borderBottom="1px dashed #999"
          >
            <div>{r.code}</div>
            <div>{r.name}</div>
            <div style={{ textAlign: "right" }}>{r.stock}</div>
          </Box>
        ))}

        {/* ===== FOOTER ===== */}

        <Box mt={6} fontSize={13}>
          Generated on: {generatedOn}
        </Box>

      </Paper>

 
     
    </Box>
  );
}