import { useState } from "react";
import { Box, Typography, Collapse, Checkbox, FormControlLabel } from "@mui/material";

const FilterPanel = () => {
  const [openFilters, setOpenFilters] = useState({
    assayType: true,
    organism: true,
    cell: false,
    sex: false,
  });

  const toggleFilter = (filterName) => {
    setOpenFilters((prev) => ({ ...prev, [filterName]: !prev[filterName] }));
  };

  return (
    <Box className="filter-panel">
      {["Assay Type", "Organism", "Cell", "Sex"].map((filter, index) => (
        <Box key={index} className="filter-group">
          <Typography
            variant="h6"
            onClick={() => toggleFilter(filter.toLowerCase().replace(" ", ""))}
            className="filter-title"
          >
            {filter}
          </Typography>
          <Collapse in={openFilters[filter.toLowerCase().replace(" ", "")]}>
            <Box className="filter-options">
              {["Option 1", "Option 2", "Option 3"].map((option, i) => (
                <FormControlLabel
                  key={i}
                  control={<Checkbox />}
                  label={option}
                  className="filter-option"
                />
              ))}
            </Box>
          </Collapse>
        </Box>
      ))}
    </Box>
  );
};

export default FilterPanel;
