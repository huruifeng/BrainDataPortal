import { useState } from "react";
import {Box, Typography, Button, Pagination, TextField, ToggleButtonGroup, ToggleButton} from "@mui/material";
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
        <Typography variant="h4">Data Records</Typography>
      </Box>

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
                Table
              </ToggleButton>
              <ToggleButton value="list" aria-label="List">
                List
              </ToggleButton>
              <ToggleButton value="matrix" aria-label="Matrix">
                Matrix
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
