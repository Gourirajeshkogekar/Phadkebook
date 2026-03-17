


import { Box, TextField, Typography, Button, Stack } from "@mui/material";
import { useEffect } from "react";

const PeriodFilter = ({ filters, setFilters }) => {

  const getFYDates = () => {
    const today = new Date();
    const currentYear = today.getFullYear();
    const startYear = today.getMonth() >= 3 ? currentYear : currentYear - 1;

    return {
      start: `${startYear}-04-01`,
      end: `${startYear + 1}-03-31`
    };
  };

  // ✅ Set default FY dates on first load
  useEffect(() => {
    if (!filters?.period?.startdate && !filters?.period?.enddate) {
      const fy = getFYDates();
      setFilters({
        ...filters,
        period: {
          startdate: fy.start,
          enddate: fy.end
        }
      });
    }
  }, []);

  const updateDate = (field, value) => {
    setFilters({
      ...filters,
      period: {
        ...(filters.period || {}),
        [field]: value
      }
    });
  };

  const handleResetFY = () => {
    const fy = getFYDates();
    setFilters({
      ...filters,
      period: { startdate: fy.start, enddate: fy.end }
    });
  };

  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="subtitle1" textAlign="center" fontWeight={600} gutterBottom>
        Period Filter
      </Typography>

      <Stack direction="row" spacing={3} justifyContent="center" mt={3}>
        <Box>
          <Typography variant="body2" sx={{ fontWeight: "bold", mb: 1 }}>
            Start Date:
          </Typography>
          <TextField
            type="date"
            size="small"
            value={filters?.period?.startdate || ""}
            onChange={(e) => updateDate("startdate", e.target.value)}
          />
        </Box>

        <Box>
          <Typography variant="body2" sx={{ fontWeight: "bold", mb: 1 }}>
            End Date:
          </Typography>
          <TextField
            type="date"
            size="small"
            value={filters?.period?.enddate || ""}
            onChange={(e) => updateDate("enddate", e.target.value)}
          />
        </Box>
      </Stack>

      <Box display="flex" justifyContent="center" mt={3}>
        <Button size="small" variant="text" onClick={handleResetFY}>
          Reset to Financial Year
        </Button>
      </Box>
    </Box>
  );
};

export default PeriodFilter;