import { Box, Typography } from "@mui/material";
import {People, Description, InsertDriveFile, Science, Biotech} from "@mui/icons-material";
import "./StatBar.css";

const StatBar = () => {

    const stats = [
      { icon: <People />, value: "86", label: "Datasets" },
      { icon: <Description />, value: "44,736", label: "Samples" },
      { icon: <InsertDriveFile />, value: "1,027,517", label: "Files" },
      { icon: <Biotech />, value: "22,534", label: "Assays" },
      { icon: <Science />, value: "2,940,240", label: "Mutations" },
    ];

  return (
    <Box className="stat-bar-container">
      {stats.map((stat, index) => (
        <Box key={index} className="stat-item">
          <Box className="stat-icon">{stat.icon}</Box>
          <Typography variant="h5" className="stat-number">
            {stat.value}
          </Typography>
          <Typography variant="body1" className="stat-label">
            {stat.label}
          </Typography>
        </Box>
      ))}
    </Box>
  );
};

export default StatBar;
