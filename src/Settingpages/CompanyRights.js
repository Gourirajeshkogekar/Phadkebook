import React, { useEffect, useState } from "react";
import Select from "react-select"; // 🔥 react-select
import {
  Box,
  Button,
  Checkbox,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Paper,
} from "@mui/material";
import axios from "axios";

const tabs = ["Masters", "Transactions", "Printing", "Settings", "Select All"];

export default function CompanyRights() {
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedTab, setSelectedTab] = useState("Masters");
  const [screenData, setScreenData] = useState([]);
  const [rights, setRights] = useState([]);
  const [selectAll, setSelectAll] = useState({ add: false });

  // 🔥 FETCH COMPANIES (YOUR FUNCTION)
  const getCompanies = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        "https://publication.microtechsolutions.net.in/php/CompanyMasterget.php"
      );

      setCompanies(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.error("Error loading companies:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getCompanies();
  }, []);

  // 🔥 FETCH SCREEN
  useEffect(() => {
    axios
      .get(
        "https://publication.microtechsolutions.net.in/php/get/gettable.php?Table=Screen"
      )
      .then((res) => {
        if (Array.isArray(res.data)) {
          const filtered = res.data.filter(
            (item) => item.Active === 1 || item.Active === "1"
          );
          setScreenData(filtered);
        }
      })
      .catch((err) => {
        console.error("Screen API Error:", err);
      });
  }, []);

  // GROUP RIGHTS
  useEffect(() => {
    const filtered = screenData.filter(
      (item) => item.MainGroup === selectedTab
    );

    const grouped = {};

    filtered.forEach((item) => {
      const menu = item.ScreenName;
      const sub = item.SubGroup || item.ScreenName;

      if (!grouped[menu]) grouped[menu] = [];

      grouped[menu].push({
        submenu: sub,
        add: false,
      });
    });

    const final = Object.entries(grouped).map(([menu, subRights]) => ({
      menu,
      subRights,
    }));

    setRights(final);
  }, [screenData, selectedTab]);

  const handleSelectAllChange = () => {
    const updated = rights.map((group) => ({
      ...group,
      subRights: group.subRights.map((sub) => ({
        ...sub,
        add: !selectAll.add,
      })),
    }));

    setRights(updated);
    setSelectAll((prev) => ({ ...prev, add: !prev.add }));
  };

  useEffect(() => {
    const checkAll =
      rights.length > 0 &&
      rights.every((group) =>
        group.subRights.every((sub) => sub.add === true)
      );

    setSelectAll({ add: checkAll });
  }, [rights]);

  // 🔥 HANDLE SELECT CHANGE
  const handleSelectChange = (selectedOption) => {
    setSelectedCompany(selectedOption);
    console.log("Selected Company:", selectedOption);
  };

  return (
    <Box sx={{ p: 2 }}>
      <Typography
        variant="h5"
        fontWeight="700"
        textAlign="center"
        gutterBottom>
        Company Rights Management
      </Typography>

      {/* 🔥 REACT SELECT DROPDOWN */}
      <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2, width: 700 }}>
        <Select
          options={companies.map((c) => ({
            value: c.Id,
            label: c.CompanyName,
          }))}
          value={selectedCompany}
          onChange={handleSelectChange}
          placeholder="Select Company"
          isSearchable
          isLoading={loading}
        />

        <Button variant="outlined">Exit</Button>
      </Box>

      {/* TABS */}
      <Box sx={{ display: "flex", gap: 1, mb: 1 }}>
        {tabs.map((tab) => (
          <Button
            key={tab}
            variant={selectedTab === tab ? "contained" : "outlined"}
            size="small"
            onClick={() => setSelectedTab(tab)}
          >
            {tab}
          </Button>
        ))}
      </Box>

      {/* TABLE */}
      <Paper
        variant="outlined"
        sx={{ width: "700px", maxHeight: "400px", overflow: "auto" }}
      >
        <TableContainer>
          <Table stickyHeader size="small">
            <TableHead>
              <TableRow>
                <TableCell>
                  <b>Menu Name</b>
                </TableCell>
                <TableCell align="center">
                  <Checkbox
                    checked={selectAll.add}
                    onChange={handleSelectAllChange}
                  />
                  <b>Display?</b>
                </TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {rights.map((group, groupIndex) => (
                <React.Fragment key={groupIndex}>
                  <TableRow>
                    <TableCell colSpan={2}>
                      <Typography fontWeight="bold">
                        {group.menu}
                      </Typography>
                    </TableCell>
                  </TableRow>

                  {group.subRights.map((sub, subIndex) => (
                    <TableRow key={`${groupIndex}-${subIndex}`}>
                      <TableCell sx={{ pl: 4 }}>
                        {sub.submenu}
                      </TableCell>
                      <TableCell align="center">
                        <Checkbox
                          checked={sub.add}
                          onChange={() => {
                            const updated = [...rights];
                            updated[groupIndex].subRights[subIndex].add =
                              !sub.add;
                            setRights(updated);
                          }}
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                </React.Fragment>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Box>
  );
}