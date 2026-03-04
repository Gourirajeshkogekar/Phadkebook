import React, { useState } from "react";
import {
  Box,
  Paper,
  Typography,
  TextField,
  Checkbox,
  FormControlLabel,
  Button,
  Divider
} from "@mui/material";

function Voucher() {
  const [startNo, setStartNo] = useState("");
  const [endNo, setEndNo] = useState("");
  const [allRequired, setAllRequired] = useState(false);

  const handlePrint = () => {
    window.print();
  };

  const handleClose = () => {
    setStartNo("");
    setEndNo("");
    setAllRequired(false);
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #f5f7fa 0%, #e4e8ee 100%)",
        display: "flex",
        justifyContent: "center",
        paddingTop: "60px"
      }}
    >
      <Box>
        {/* PAGE HEADING */}
        <Typography
          variant="h6"
          fontWeight="700"
          textAlign="center"
          mb={4}
        >
          Voucher
        </Typography>

        {/* CARD */}
        <Paper
          elevation={6}
          sx={{
            width: 520,
            padding: "32px 36px",
            borderRadius: "12px"
          }}
        >
          {/* START NO */}
          <Box display="flex" alignItems="center" mb={3}>
            <Typography sx={{ width: 140, fontWeight: 600 }}>
              Start No :
            </Typography>
            <TextField
              size="small"
              fullWidth
              value={startNo}
              onChange={(e) => setStartNo(e.target.value)}
            />
          </Box>

          {/* END NO */}
          <Box display="flex" alignItems="center" mb={3}>
            <Typography sx={{ width: 140, fontWeight: 600 }}>
              End No :
            </Typography>
            <TextField
              size="small"
              fullWidth
              value={endNo}
              onChange={(e) => setEndNo(e.target.value)}
            />
          </Box>

          <Divider sx={{ my: 2 }} />

          {/* CHECKBOX */}
          <FormControlLabel
            control={
              <Checkbox
                checked={allRequired}
                onChange={(e) => setAllRequired(e.target.checked)}
              />
            }
            label={
              <Typography fontWeight={600}>
                All Challans are Required
              </Typography>
            }
          />
        </Paper>

        {/* BUTTONS */}
        <Box display="flex" justifyContent="center" gap={3} mt={4}>
          <Button
            variant="contained"
            size="large"
            sx={{ px: 5 }}
            onClick={handlePrint}
          >
            Print Report
          </Button>

          <Button
            variant="contained"
            color="error"
            size="large"
            sx={{ px: 5 }}
            onClick={handleClose}
          >
            Close
          </Button>
        </Box>
      </Box>
    </Box>
  );
}

export default Voucher;