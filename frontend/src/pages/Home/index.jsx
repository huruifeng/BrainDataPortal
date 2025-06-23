import { useState } from "react";
import { Typography, Paper , Link} from "@mui/material";
import Grid2 from "@mui/material/Grid2"; // Correct Grid2 import
import "./Home.css"; // Import the CSS file

import DiseaseSelector from "../../components/DiseaseSelector";
import BrainsideSelector from "../../components/BrainsideSelector";
import BrainRegions from "../../components/BrainRegions";
import StatBar from "../../components/StatBar";

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

            <Grid2 container spacing={2} className="content-grid">
                {/* Left Section */}
                <Grid2 xs={12} md={2}>
                    <Typography variant="h6" className="section-title">
                        Brain regions
                    </Typography>
                    <Paper elevation={3} className="paper">
                        <Typography variant="subtitle1" className="subsection-title">
                            <strong><Link href={`datasets?brainRegion=Temporal Lobe`} underline="hover" color="inherit">Temporal Lobe(1)</Link></strong>
                        </Typography>
                        <ul>
                            <li><Link href={`datasets?brainSubregion=Middle temporal gyrus`} underline="hover">Middle temporal gyrus(1)</Link></li>
                        </ul>
                        <Typography variant="subtitle1" className="subsection-title">
                            <strong><Link href={`datasets?brainRegion=Brainstem`} underline="hover" color="inherit">Brainstem(1)</Link></strong>
                        </Typography>
                        <ul>
                            <li><Link href={`datasets?brainSubregion=Midbrain`} underline="hover">Midbrain(1)</Link></li>
                        </ul>
                    </Paper>
                </Grid2>

                {/* Middle Section (Brain Image) */}
                <Grid2 xs={12} md={5} className="middle-section">
                    <BrainsideSelector  />
                    <BrainRegions />
                </Grid2>

                {/* Right Section */}
                <Grid2 xs={12} md={2}>
                    <Typography variant="h6" className="section-title">
                        Available Assays
                    </Typography>
                    <Paper elevation={3} className="paper">
                        <Typography variant="subtitle1" className="subsection-title">
                            <strong>Omics Assays</strong>
                        </Typography>
                        <ul>
                            <li><Link href={`datasets?assayType=snRNAseq`} underline="hover">scRNASeq(1)</Link></li>
                            <li><Link href={`datasets?assayType=VisiumST`} underline="hover">10X Visium ST(1)</Link></li>
                        </ul>
                    </Paper>
                </Grid2>
            </Grid2>

            {/* Disease Selection */}
            {/*<Box className="disease-selection">*/}
            {/*  <Typography variant="h6" className="disease-title">Select a disease type to see more data</Typography>*/}
            {/*  <Box className="disease-buttons">*/}
            {/*    <Button*/}
            {/*      variant={disease === "Healthy" ? "contained" : "outlined"}*/}
            {/*      onClick={() => handleDiseaseChange("Healthy")}*/}
            {/*    >*/}
            {/*      Healthy*/}
            {/*    </Button>*/}
            {/*    <Button*/}
            {/*      variant={disease === "Alzheimer Disease" ? "contained" : "outlined"}*/}
            {/*      onClick={() => handleDiseaseChange("Alzheimer Disease")}*/}
            {/*    >*/}
            {/*      Alzheimer Disease*/}
            {/*    </Button>*/}
            {/*    <Button*/}
            {/*      variant={disease === "Parkinson's Disease" ? "contained" : "outlined"}*/}
            {/*      onClick={() => handleDiseaseChange("Parkinson's Disease")}*/}
            {/*    >*/}
            {/*      Parkinson&#39;s Disease*/}
            {/*    </Button>*/}
            {/*  </Box>*/}
            {/*</Box>*/}
            <DiseaseSelector  />
            <StatBar />
        </div>
    );
};

export default Home;
