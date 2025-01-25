import { useState } from "react";
import {Box, Typography, Pagination, TextField, ToggleButtonGroup, ToggleButton, Divider} from "@mui/material";
import ListIcon from '@mui/icons-material/List';
import TableChartIcon from '@mui/icons-material/TableChart';
import PivotTableChart from '@mui/icons-material/PivotTableChart';

import FilterPanel from "./FilterPanel";
import DataDisplay from "./DataDisplay";
import "./DataPage.css";

const DataPage = () => {
  const [displayMode, setDisplayMode] = useState("table"); // "table" or "list"
  const [searchQuery, setSearchQuery] = useState("");

  const handleDisplayModeChange = (event, newMode) => {
    setDisplayMode(newMode);
  };

  return (
    <div className="data-page-container">
      {/* Title Row */}
      <Box className="title-row">
        <Typography variant="h4">Explore data resources
        </Typography>
      </Box>
      <Divider />
      {/* Main Content */}
      <Box className="main-content">
        {/* Left Filter Panel */}
        <FilterPanel />

        {/* Right Data Display Area */}
        <Box className="data-display-area">
          {/* Search and Display Options */}
          <Box className="data-toolbar">
            <ToggleButtonGroup
                size="small"
              value={displayMode}
              exclusive
              onChange={handleDisplayModeChange}
              aria-label="display mode"
            >
              <ToggleButton value="table" aria-label="Table">
                <TableChartIcon />
              </ToggleButton>
              <ToggleButton value="list" aria-label="List">
                <ListIcon />
              </ToggleButton>
              <ToggleButton value="matrix" aria-label="Matrix">
                <PivotTableChart />
              </ToggleButton>
            </ToggleButtonGroup>

            <TextField
              label="Search"
              variant="outlined"
              size="small"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="search-input"
            />
          </Box>

          {/* Data Records */}
          <DataDisplay mode={displayMode} searchQuery={searchQuery} />

          {/* Pagination */}
          <Pagination
            count={10} // Replace with actual total pages
            color="primary"
            className="pagination"
          />
        </Box>
      </Box>
    </div>
  );
};

export default DataPage;
