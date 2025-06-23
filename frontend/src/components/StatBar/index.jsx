import {Box, Typography, Link} from "@mui/material";
import {Description} from "@mui/icons-material";
import "./StatBar.css";
import {Dna, DnaOff, Images, Folders,LandPlot} from "lucide-react";

const StatBar = () => {

    const stats = [
        {icon: <Folders/>, value: "3", label: "Datasets", link: "/datasets"},
        {icon: <LandPlot/>, value: "3", label: "Primary sites", link: "/datasets"},
        {icon: <Description/>, value: "203", label: "Samples", link: "/samples/all"},
        {icon: <Images/>, value: "106", label: "Slices", link: "/views/visiumview"},
        {icon: <Dna/>, value: "22,534", label: "Genes", link: "/views/geneview"},
        {icon: <DnaOff/>, value: "2,940,240", label: "Mutations", link: "/views/regionsview"},
    ];

    return (
        <Box className="stat-bar-container">
            {stats.map((stat, index) => (
                <Box key={index} className="stat-item">
                    <Link href={stat.link} underline="hover">
                        <Box className="stat-icon">{stat.icon}</Box>
                        <Typography variant="h5" className="stat-number">{stat.value}</Typography>
                        <Typography variant="body1" className="stat-label">{stat.label}</Typography>
                    </Link>
                </Box>
            ))}
        </Box>
    );
};

export default StatBar;
