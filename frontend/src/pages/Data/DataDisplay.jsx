import React from "react";
import { Box, Typography, Table, TableHead, TableRow, TableCell, TableBody, Paper } from "@mui/material";
// import "./DataDisplay.css";

const DataDisplay = ({ mode, searchQuery }) => {
  const mockData = [
    { id: 1, name: "Record 1", description: "Description of record 1" },
    { id: 2, name: "Record 2", description: "Description of record 2" },
    { id: 3, name: "Record 3", description: "Description of record 3" },
  ];

  const filteredData = mockData.filter(
    (item) =>
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Box className="data-display">
      {mode === "table" ? (
        <Paper className="data-table">
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>Name</TableCell>
                <TableCell>Description</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredData.map((record) => (
                <TableRow key={record.id}>
                  <TableCell>{record.id}</TableCell>
                  <TableCell>{record.name}</TableCell>
                  <TableCell>{record.description}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Paper>
      ) : (
        <Box className="data-list">
          {filteredData.map((record) => (
            <Box key={record.id} className="list-item">
              <Typography variant="h6">{record.name}</Typography>
              <Typography variant="body1">{record.description}</Typography>
            </Box>
          ))}
        </Box>
      )}
    </Box>
  );
};

export default DataDisplay;
