import React, { useState } from "react";
import { Box, Typography, TextField, Autocomplete } from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";

function PaperReceivedPage() {
  const [InwardNo, setInwardno] = useState("");
  const [InwardDate, setInwarddate] = useState(null);
  const [DCNo, setDCno] = useState("");
  const [DCDate, setDCdate] = useState(null);
  const [PartyName, setPartyname] = useState("");
  const [partynames, setPartynames] = useState([]);
  const [godowns, setGodowns] = useState([]);
  const [GodownId, setGodownId] = useState("");

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Box m={2}>
        <Box display={"flex"} alignItems={"center"} gap={5}>
          <Box flex={1}>
            <Typography>Inward No</Typography>
            <TextField
              value={InwardNo}
              onChange={(e) => setInwardno(e.target.value)}
              size="small"
              margin="normal"
              placeholder="Inward No"
              fullWidth
            />
          </Box>

          <Box flex={1}>
            <Typography>Inward Date</Typography>
            <DatePicker
              format="dd/MM/yyyy"
              value={InwardDate}
              onChange={(newValue) => setInwarddate(newValue)}
              renderInput={(params) => (
                <TextField {...params} size="small" margin="normal" fullWidth />
              )}
            />
          </Box>

          <Box flex={1}>
            <Typography>Party Name</Typography>
            <Autocomplete
              options={partynames}
              value={PartyName}
              onChange={(event, newValue) => setPartyname(newValue)}
              renderInput={(params) => (
                <TextField
                  {...params}
                  placeholder="Select Party name"
                  size="small"
                  margin="normal"
                  fullWidth
                />
              )}
            />
          </Box>
        </Box>

        <Box flex={1}>
          <Typography>Party's DC No</Typography>
          <TextField
            value={DCNo}
            onChange={(e) => setDCno(e.target.value)}
            size="small"
            margin="normal"
            placeholder="DC No"
            fullWidth
          />
        </Box>

        <Box flex={1}>
          <Typography>DC Date</Typography>
          <DatePicker
            format="dd/MM/yyyy"
            value={DCDate}
            onChange={(newValue) => setDCdate(newValue)}
            renderInput={(params) => (
              <TextField {...params} size="small" margin="normal" fullWidth />
            )}
          />
        </Box>

        <Box flex={1}>
          <Typography>Godown</Typography>
          <Autocomplete
            options={godowns}
            value={GodownId}
            onChange={(event, newValue) => setGodownId(newValue)}
            renderInput={(params) => (
              <TextField
                {...params}
                placeholder="Select Godown"
                size="small"
                margin="normal"
                fullWidth
              />
            )}
          />
        </Box>
      </Box>
    </LocalizationProvider>
  );
}

export default PaperReceivedPage;
