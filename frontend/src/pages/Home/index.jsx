import { useState } from "react";
import { Box, Typography, Grid, Button, Paper } from "@mui/material";
import brainImage from "../../assets/images/brainregions/Brain5_Color.png";

// import DiseaseSelector from "../../components/DiseaseSelector";
// import RegionSelector from "../../components/RegionSelector";

import "./Home.css";

const Home = () => {
  const [disease, setDisease] = useState("Healthy");

  const handleDiseaseChange = (newDisease) => {
    setDisease(newDisease);
  };

  return (
    <div className="landing-page">
      <Typography variant="h3" align="center" className="title">
        BrainDataPortal
      </Typography>
      <Typography variant="h5" align="center" className="subtitle">
        Explore and analyze brain-related omics data with ease.
      </Typography>

      <Grid container spacing={2} alignItems="center" justifyContent="center">
        {/* Left Section */}
        <Grid item xs={12} md={3}>
          <Paper elevation={3} sx={{ padding: 2 }}>
            <Typography variant="h6" gutterBottom>
              Cell Lines & Tissues
            </Typography>
            <Typography variant="subtitle1" gutterBottom>
              <strong>Ectoderm Tissues</strong>
            </Typography>
            <ul>
              <li>Brain: unrelated donors</li>
              <li>Sun-exposed skin</li>
            </ul>
            <Typography variant="subtitle1" gutterBottom>
              <strong>Endoderm Tissues</strong>
            </Typography>
            <ul>
              <li>Liver</li>
              <li>Lung</li>
              <li>Colon</li>
            </ul>
            <Typography variant="subtitle1" gutterBottom>
              <strong>Cell Line Mixtures</strong>
            </Typography>
            <ul>
              <li>COLO829 Mixture</li>
              <li>HapMap Mixture</li>
              <li>iPSC & Fibroblast</li>
            </ul>
          </Paper>
        </Grid>

        {/* Middle Section (Brain Image) */}
        <Grid item xs={12} md={5}>
          <Box sx={{ textAlign: "center" }}>
            <img
              src={brainImage} // Replace with the actual path to your brain image
              alt="Brain Regions"
              style={{
                maxWidth: "100%",
                height: "auto",
                borderRadius: "8px",
              }}
            />
            <Typography variant="caption">
              Hover over the regions to explore brain areas.
            </Typography>
          </Box>
        </Grid>

        {/* Right Section */}
        <Grid item xs={12} md={3}>
          <Paper elevation={3} sx={{ padding: 2 }}>
            <Typography variant="h6" gutterBottom>
              Available Assays
            </Typography>
            <ul>
              <li>Bulk WGS short read</li>
              <li>Bulk WGS long read</li>
              <li>Bulk RNA-seq</li>
              <li>Single-cell WGS</li>
              <li>Single-cell RNA-Seq</li>
              <li>Epigenome profiling</li>
            </ul>
          </Paper>
        </Grid>
      </Grid>

      {/* Disease Selection */}
      <Box sx={{ textAlign: "center", marginTop: 4 }}>
        <Typography variant="h6">Select a disease type to see more data</Typography>
        <Box sx={{ display: "flex", justifyContent: "center", gap: 2, marginTop: 2 }}>
          <Button
            variant={disease === "Healthy" ? "contained" : "outlined"}
            onClick={() => handleDiseaseChange("Healthy")}
          >
            Healthy
          </Button>
          <Button
            variant={disease === "Alzheimer Disease" ? "contained" : "outlined"}
            onClick={() => handleDiseaseChange("Tier 1")}
          >
            Alzheimer Disease
          </Button>
          <Button
            variant={disease === "Parkinson's Disease" ? "contained" : "outlined"}
            onClick={() => handleDiseaseChange("Tier 2")}
          >
            Parkinson&#39;s Disease
          </Button>
        </Box>
      </Box>
    </div>
  );
};

export default Home;
