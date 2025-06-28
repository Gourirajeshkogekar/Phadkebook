import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Checkbox,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
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

export default function Userrights() {
  const [selectedUser, setSelectedUser] = useState("");
  const [selectedTab, setSelectedTab] = useState("Masters");
  const [screenData, setScreenData] = useState([]);
  const [rights, setRights] = useState([]);
  const [users, setUsers] = useState([]);
  const [selectAll, setSelectAll] = useState({
    add: false,
    edit: false,
    delete: false,
  });

  // Fetch users from API
  useEffect(() => {
    axios
      .get("https://publication.microtechsolutions.net.in/php/Userget.php")
      .then((res) => {
        const activeUsers = res.data.filter((user) => user.Active === "1");
        setUsers(activeUsers);
      })
      .catch((err) => {
        console.error("Error fetching users:", err);
      });
  }, []);

  // Fetch screen data on mount
  useEffect(() => {
    axios
      .get(
        "https://publication.microtechsolutions.net.in/php/get/gettable.php?Table=Screen"
      )
      .then((res) => {
        const filtered = res.data.filter((item) => item.Active === 1);
        setScreenData(filtered);
      })
      .catch((err) => {
        console.error("Error fetching screen data:", err);
      });
  }, []);

  // Update rights based on selected tab
  useEffect(() => {
    const filtered = screenData.filter(
      (item) => item.MainGroup === selectedTab
    );

    const grouped = {};

    filtered.forEach((item) => {
      const menu = item.ScreenName;
      const sub = item.SubGroup || item.ScreenName; // fallback if no subgroup

      if (!grouped[menu]) grouped[menu] = [];

      grouped[menu].push({
        submenu: sub,
        add: false,
        edit: false,
        delete: false,
      });
    });

    // convert object to array
    const final = Object.entries(grouped).map(([menu, subRights]) => ({
      menu,
      subRights,
    }));

    setRights(final);
  }, [screenData, selectedTab]);

  const handleCheckboxChange = (index, type) => {
    const updated = [...rights];
    updated[index][type] = !updated[index][type];
    setRights(updated);
  };

  const handleSelectAllChange = (type) => {
    const updated = rights.map((group) => ({
      ...group,
      subRights: group.subRights.map((sub) => ({
        ...sub,
        [type]: !selectAll[type],
      })),
    }));

    setRights(updated);
    setSelectAll((prev) => ({ ...prev, [type]: !prev[type] }));
  };

  useEffect(() => {
    const checkAll = (type) =>
      rights.every((group) =>
        group.subRights.every((sub) => sub[type] === true)
      );

    setSelectAll({
      add: checkAll("add"),
      edit: checkAll("edit"),
      delete: checkAll("delete"),
    });
  }, [rights]);

  return (
    <Box sx={{ p: 2 }}>
      {/* Heading */}
      <Typography variant="h5" fontWeight="700" textAlign="center" gutterBottom>
        User Rights Management
      </Typography>
      {/* User Selection */}
      <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2 }}>
        <FormControl size="small" sx={{ minWidth: 250 }}>
          <InputLabel>Select User</InputLabel>
          <Select
            value={selectedUser}
            onChange={(e) => setSelectedUser(e.target.value)}
            label="Select User">
            {users.map((user) => (
              <MenuItem key={user.Id} value={user.Name}>
                {user.Name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <Button variant="outlined">Exit</Button>
      </Box>

      {/* Tabs */}
      <Box sx={{ display: "flex", gap: 1, mb: 1 }}>
        {tabs.map((tab, i) => (
          <Button
            key={i}
            variant={selectedTab === tab ? "contained" : "outlined"}
            size="small"
            onClick={() => setSelectedTab(tab)}>
            {tab}
          </Button>
        ))}
      </Box>

      {/* Rights Table */}
      <Paper
        variant="outlined"
        sx={{ width: "700px", maxHeight: "400px", overflow: "auto" }}>
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
                    onChange={() => handleSelectAllChange("add")}
                  />
                  <b>Add?</b>
                </TableCell>
                <TableCell align="center">
                  <Checkbox
                    checked={selectAll.edit}
                    onChange={() => handleSelectAllChange("edit")}
                  />
                  <b>Edit?</b>
                </TableCell>
                <TableCell align="center">
                  <Checkbox
                    checked={selectAll.delete}
                    onChange={() => handleSelectAllChange("delete")}
                  />
                  <b>Delete?</b>
                </TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {rights.map((group, groupIndex) => (
                <React.Fragment key={groupIndex}>
                  <TableRow>
                    <TableCell colSpan={4}>
                      <Typography fontWeight="bold">{group.menu}</Typography>
                    </TableCell>
                  </TableRow>
                  {group.subRights.map((sub, subIndex) => (
                    <TableRow key={`${groupIndex}-${subIndex}`}>
                      <TableCell sx={{ pl: 4 }}>{sub.submenu}</TableCell>
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
                      <TableCell align="center">
                        <Checkbox
                          checked={sub.edit}
                          onChange={() => {
                            const updated = [...rights];
                            updated[groupIndex].subRights[subIndex].edit =
                              !sub.edit;
                            setRights(updated);
                          }}
                        />
                      </TableCell>
                      <TableCell align="center">
                        <Checkbox
                          checked={sub.delete}
                          onChange={() => {
                            const updated = [...rights];
                            updated[groupIndex].subRights[subIndex].delete =
                              !sub.delete;
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
