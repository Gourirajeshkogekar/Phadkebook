



import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Grid,
  Paper,
  Typography,
  RadioGroup,
  FormControlLabel,
  Radio,
  TextField,
  Checkbox,
  Button,
  List,
  ListItemButton,
  ListItemText,
  IconButton,
} from "@mui/material";
import { ChevronRight, ChevronLeft } from "@mui/icons-material";
import { toast } from "react-toastify";

const Ledger = () => {


 const [activeCompany, setActiveCompany] = useState(null);
               
               useEffect(()=>{
                const selected = localStorage.getItem("SelectedCompany");
                   console.log(selected, 'selected');
                  if (selected) {
                    try {
                      const parsedCompany = JSON.parse(selected);
                      setActiveCompany(parsedCompany);
                    } catch (e) {
                      console.error("Error parsing company data", e);
                    }
                  }
                  },[activeCompany]);
  
  
                  const [viewType, setViewType] = useState("AC");
  const [startDate, setStartDate] = useState("2025-04-01");
  const [endDate, setEndDate] = useState("2026-03-31");

  const [availableList, setAvailableList] = useState([]);
  const [selectedList, setSelectedList] = useState([]);
  const [selectedAvailable, setSelectedAvailable] = useState([]);
  const [selectedSelected, setSelectedSelected] = useState([]);

  const [printDues, setPrintDues] = useState(false);
  const [printTotals, setPrintTotals] = useState(false);
  const [prePrintedStationary, setPrePrintedStationary] = useState(false);
  const [summarisedLedger, setSummarisedLedger] = useState(false);
 



  useEffect(() => {
    viewType === "AC" ? fetchAccounts() : fetchGroups();
  }, [viewType]);

  
  

  const fetchAccounts = async () => {
    try {
      const res = await axios.get(
        `https://publication.microtechsolutions.net.in/php/Accountget.php?CompanyId=${activeCompany.Id}`
      );
      setAvailableList(res.data.data || []);
      setSelectedList([]);
    } catch {
      toast.error("Error fetching accounts");
    }
  };

  const fetchGroups = async () => {
    try {
      const res = await axios.get(
        "https://publication.microtechsolutions.net.in/php/gettable.php?Table=Accountgroup"
      );
      setAvailableList(res.data || []);
      setSelectedList([]);
    } catch {
      toast.error("Error fetching groups");
    }
  };

  const moveRight = () => {
    const picked = availableList.filter(i =>
      selectedAvailable.includes(i.Id)
    );
    setSelectedList(prev => [...prev, ...picked]);
    setAvailableList(prev =>
      prev.filter(i => !selectedAvailable.includes(i.Id))
    );
    setSelectedAvailable([]);
  };

  const moveLeft = () => {
    const back = selectedList.filter(i =>
      selectedSelected.includes(i.Id)
    );
    setAvailableList(prev => [...prev, ...back]);
    setSelectedList(prev =>
      prev.filter(i => !selectedSelected.includes(i.Id))
    );
    setSelectedSelected([]);
  };

  const toggleAvailable = (id) => {
  setSelectedAvailable((prev) =>
    prev.includes(id)
      ? prev.filter((x) => x !== id)
      : [...prev, id]
  );
};

const toggleSelected = (id) => {
  setSelectedSelected((prev) =>
    prev.includes(id)
      ? prev.filter((x) => x !== id)
      : [...prev, id]
  );
};


 const navigate = useNavigate();

const handlePrint = () => {
  if (selectedList.length === 0) {
    toast.warning("Please select at least one Account / Group");
    return;
  }

  const ids = selectedList.map(i => i.Id).join(",");

  if (summarisedLedger) {
    navigate(
      `/printing/ledger/summarised?fromdate=${startDate}&todate=${endDate}&ids=${ids}`
    );
  } else {
    navigate(
      `/printing/ledger/ledgerprint?fromdate=${startDate}&todate=${endDate}&ids=${ids}&prePrinted=${prePrintedStationary}`
    );
  }
};





  return (
    <Paper>
      <Typography variant="h5" mb={2} textAlign='center' fontWeight={700}>Ledger Report</Typography>

      {/* View Type */}
      <RadioGroup row value={viewType} onChange={e => setViewType(e.target.value)}>
        <FormControlLabel value="Groupwise" control={<Radio />} label="Groupwise" />
        <FormControlLabel value="AC" control={<Radio />} label="A/C Wise" />
      </RadioGroup>

      {/* Dates */}
      <Grid container spacing={2} mt={1}>
        <Grid item>
          <TextField
            type="date"
            label="Start Date"
            value={startDate}
            onChange={e => setStartDate(e.target.value)}
            InputLabelProps={{ shrink: true }}
          />
        </Grid>
        <Grid item>
          <TextField
            type="date"
            label="End Date"
            value={endDate}
            onChange={e => setEndDate(e.target.value)}
            InputLabelProps={{ shrink: true }}
          />
        </Grid>
      </Grid>

      {/* Dual List */}
     <Grid container spacing={1} mt={1}>
  <Grid item xs={5}>
    <Paper variant="outlined" sx={{ height: 250, overflow: "auto" }}>
      <List dense disablePadding>
        {availableList.map(item => (
       <ListItemButton
  key={item.Id}
  dense
  sx={{ py: 0.5 }}
  selected={selectedAvailable.includes(item.Id)}
  onClick={() => toggleAvailable(item.Id)}
>

            <ListItemText
              primary={viewType === "AC" ? item.AccountName : item.GroupName}
            />
          </ListItemButton>
        ))}
      </List>
    </Paper>
  </Grid>

  <Grid item xs={2} display="flex" flexDirection="column" justifyContent="center" gap={1}>
    <IconButton size="small" onClick={moveRight}><ChevronRight /></IconButton>
    <IconButton size="small" onClick={moveLeft}><ChevronLeft /></IconButton>
  </Grid>

  <Grid item xs={5}>
    <Paper variant="outlined" sx={{ height: 250, overflow: "auto" }}>
      <List dense disablePadding>
        {selectedList.map(item => (
        <ListItemButton
  key={item.Id}
  dense
  sx={{ py: 0.5 }}
  selected={selectedSelected.includes(item.Id)}
  onClick={() => toggleSelected(item.Id)}
>

            <ListItemText
              primary={viewType === "AC" ? item.AccountName : item.GroupName}
            />
          </ListItemButton>
        ))}
      </List>
    </Paper>
  </Grid>
</Grid>


      {/* Options */}
      <Grid container spacing={2} mt={1}>
        <Grid item><FormControlLabel control={<Checkbox checked={printDues} onChange={() => setPrintDues(!printDues)} />} label="Print Monthly Dues" /></Grid>
        <Grid item><FormControlLabel control={<Checkbox checked={printTotals} onChange={() => setPrintTotals(!printTotals)} />} label="Print Monthly Totals" /></Grid>
        <Grid item><FormControlLabel control={<Checkbox checked={prePrintedStationary} onChange={() => setPrePrintedStationary(!prePrintedStationary)} />} label="Pre-printed Stationary" /></Grid>
        <Grid item><FormControlLabel control={<Checkbox checked={summarisedLedger} onChange={() => setSummarisedLedger(!summarisedLedger)} />} label="Summarised Ledger" /></Grid>
      </Grid>

      {/* Actions */}
      <Box mt={1}>
        <Button variant="contained" onClick={handlePrint}>Print Report</Button>
        <Button sx={{ ml: 2 }} variant="outlined">Exit</Button>
      </Box>
    </Paper>
  );
};

export default Ledger;