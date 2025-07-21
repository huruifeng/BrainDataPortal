"use client"

import {useState} from "react"
import {
    Box,
    Grid,
    Paper,
    Typography,
    List,
    ListItem,
    ListItemText,
    Card,
    CardContent,
    Button,
    ButtonGroup,
    Chip,
    Divider,
    Container,
    useTheme,
    alpha,
} from "@mui/material"
import {
    Science as ScienceIcon,
    Biotech as BiotechIcon,
    Dataset as DatasetIcon,
    Analytics as AnalyticsIcon,
    Person as PersonIcon,
    Pets as PetsIcon,
} from "@mui/icons-material"

// Mock data for tissues
const tissueData = {
    human: [
        {name: "Brain", datasets: 1247, color: "#FF6B6B"},
        {name: "Heart", datasets: 892, color: "#4ECDC4"},
        {name: "Liver", datasets: 756, color: "#45B7D1"},
        {name: "Kidney", datasets: 634, color: "#96CEB4"},
        {name: "Lung", datasets: 523, color: "#FFEAA7"},
        {name: "Muscle", datasets: 445, color: "#DDA0DD"},
        {name: "Skin", datasets: 387, color: "#98D8C8"},
        {name: "Pancreas", datasets: 298, color: "#F7DC6F"},
    ],
    mouse: [
        {name: "Brain", datasets: 2156, color: "#FF6B6B"},
        {name: "Heart", datasets: 1543, color: "#4ECDC4"},
        {name: "Liver", datasets: 1234, color: "#45B7D1"},
        {name: "Kidney", datasets: 987, color: "#96CEB4"},
        {name: "Lung", datasets: 876, color: "#FFEAA7"},
        {name: "Muscle", datasets: 654, color: "#DDA0DD"},
        {name: "Skin", datasets: 543, color: "#98D8C8"},
        {name: "Pancreas", datasets: 432, color: "#F7DC6F"},
    ],
}

// Mock data for assays - now species-specific
const assayData = {
    human: [
        {name: "Single-cell RNA-seq", datasets: 3456, icon: <ScienceIcon/>},
        {name: "Spatial Transcriptomics", datasets: 2134, icon: <BiotechIcon/>},
        {name: "ATAC-seq", datasets: 1876, icon: <DatasetIcon/>},
        {name: "ChIP-seq", datasets: 1543, icon: <AnalyticsIcon/>},
        {name: "Proteomics", datasets: 987, icon: <ScienceIcon/>},
        {name: "Metabolomics", datasets: 765, icon: <BiotechIcon/>},
        {name: "Epigenomics", datasets: 654, icon: <DatasetIcon/>},
        {name: "Multi-omics", datasets: 432, icon: <AnalyticsIcon/>},
    ],
    mouse: [
        {name: "Single-cell RNA-seq", datasets: 5234, icon: <ScienceIcon/>},
        {name: "Spatial Transcriptomics", datasets: 3456, icon: <BiotechIcon/>},
        {name: "ATAC-seq", datasets: 2987, icon: <DatasetIcon/>},
        {name: "ChIP-seq", datasets: 2345, icon: <AnalyticsIcon/>},
        {name: "Proteomics", datasets: 1654, icon: <ScienceIcon/>},
        {name: "Metabolomics", datasets: 1234, icon: <BiotechIcon/>},
        {name: "Epigenomics", datasets: 987, icon: <DatasetIcon/>},
        {name: "Multi-omics", datasets: 765, icon: <AnalyticsIcon/>},
    ],
}

// Mock stats data - now species-specific
const statsData = {
    human: [
        {label: "Total Datasets", value: "12,547", icon: <DatasetIcon/>},
        {label: "Total Samples", value: "156,789", icon: <ScienceIcon/>},
        {label: "Total Cells", value: "2.3M", icon: <BiotechIcon/>},
        {label: "Publications", value: "1,234", icon: <AnalyticsIcon/>},
    ],
    mouse: [
        {label: "Total Datasets", value: "18,923", icon: <DatasetIcon/>},
        {label: "Total Samples", value: "234,567", icon: <ScienceIcon/>},
        {label: "Total Cells", value: "3.7M", icon: <BiotechIcon/>},
        {label: "Publications", value: "1,876", icon: <AnalyticsIcon/>},
    ],
}

// Simple body diagram component
const BodyDiagram = ({species, onTissueClick, hoveredTissue, setHoveredTissue}) => {
    const theme = useTheme()

    const bodyParts = tissueData[species].map((tissue, index) => ({
        ...tissue,
        x: 50 + (index % 3) * 30,
        y: 20 + Math.floor(index / 3) * 25,
        width: 25,
        height: 20,
    }))

    return (
        <Box sx={{display: "flex", justifyContent: "center", my: 2}}>
            <svg width="300" height="400" viewBox="0 0 300 400">
                {/* Body outline */}
                <ellipse
                    cx="150"
                    cy="200"
                    rx="80"
                    ry="150"
                    fill={alpha(theme.palette.primary.light, 0.1)}
                    stroke={theme.palette.primary.main}
                    strokeWidth="2"
                />

                {/* Head */}
                <circle
                    cx="150"
                    cy="80"
                    r="40"
                    fill={alpha(theme.palette.primary.light, 0.1)}
                    stroke={theme.palette.primary.main}
                    strokeWidth="2"
                />

                {/* Interactive tissue areas */}
                {bodyParts.map((part, index) => (
                    <g key={part.name}>
                        <rect
                            x={part.x}
                            y={part.y}
                            width={part.width}
                            height={part.height}
                            fill={hoveredTissue === part.name ? part.color : alpha(part.color, 0.6)}
                            stroke={theme.palette.common.white}
                            strokeWidth="1"
                            rx="3"
                            style={{cursor: "pointer"}}
                            onMouseEnter={() => setHoveredTissue(part.name)}
                            onMouseLeave={() => setHoveredTissue(null)}
                            onClick={() => onTissueClick(part)}
                        />
                        <text
                            x={part.x + part.width / 2}
                            y={part.y + part.height / 2 + 3}
                            textAnchor="middle"
                            fontSize="8"
                            fill={theme.palette.common.white}
                            style={{pointerEvents: "none", fontWeight: "bold"}}
                        >
                            {part.name.slice(0, 4)}
                        </text>
                    </g>
                ))}

                {/* Species label */}
                <text x="150" y="380" textAnchor="middle" fontSize="16" fill={theme.palette.text.primary}
                      fontWeight="bold">
                    {species.charAt(0).toUpperCase() + species.slice(1)} Model
                </text>
            </svg>
        </Box>
    )
}

export default function Home_HM() {
    const [selectedSpecies, setSelectedSpecies] = useState("human")
    const [hoveredTissue, setHoveredTissue] = useState(null)
    const theme = useTheme()

    const handleTissueClick = (tissue) => {
        console.log(`Clicked on ${tissue.name} with ${tissue.datasets} datasets`)
        // Here you would navigate to tissue-specific data or open a modal
    }

    const handleSpeciesChange = (species) => {
        setSelectedSpecies(species)
        setHoveredTissue(null)
    }

    return (
        <Container maxWidth="xl" sx={{py: 4}}>
            <Grid container spacing={3}>
                {/* Header */}
                <Grid item xs={12} textAlign="center">
                        <Typography variant="h3" component="h1" gutterBottom sx={{color: "primary.main", fontWeight: "bold"}}>
                            {/*{import.meta.env.VITE_APP_TITLE}*/}
                            MODE: Multi-Omics Data Exploration
                        </Typography>
                        <Typography variant="h6" sx={{color: "text.secondary", opacity: 0.9}}>
                            Single-cell, Spatial Transcriptomics and Multi-omics Data Analysis Platform
                        </Typography>
                </Grid>

                {/* Main Content */}
                <Grid item xs={12} md={3}>
                    {/* Tissues Panel */}
                    <Paper elevation={3} sx={{p: 2, height: "fit-content"}}>
                        <Typography variant="h6" gutterBottom sx={{display: "flex", alignItems: "center", gap: 1}}>
                            <DatasetIcon color="primary"/>
                            Datasets by Tissue
                        </Typography>
                        <Divider sx={{mb: 2}}/>
                        <List dense>
                            {tissueData[selectedSpecies].map((tissue) => (
                                <ListItem
                                    key={tissue.name}
                                    sx={{
                                        borderRadius: 1,
                                        mb: 1,
                                        backgroundColor: hoveredTissue === tissue.name ? alpha(tissue.color, 0.1) : "transparent",
                                        cursor: "pointer",
                                        transition: "all 0.2s ease",
                                    }}
                                    onClick={() => handleTissueClick(tissue)}
                                    onMouseEnter={() => setHoveredTissue(tissue.name)}
                                    onMouseLeave={() => setHoveredTissue(null)}
                                >
                                    <Box
                                        sx={{
                                            width: 12,
                                            height: 12,
                                            borderRadius: "50%",
                                            backgroundColor: tissue.color,
                                            mr: 2,
                                        }}
                                    />
                                    <ListItemText primary={tissue.name}
                                                  secondary={`${tissue.datasets.toLocaleString()} datasets`}/>
                                    <Chip
                                        label={tissue.datasets}
                                        size="small"
                                        sx={{
                                            backgroundColor: alpha(tissue.color, 0.2),
                                            color: theme.palette.text.primary,
                                        }}
                                    />
                                </ListItem>
                            ))}
                        </List>
                    </Paper>
                </Grid>

                <Grid item xs={12} md={6}>
                    {/* Interactive Body Model */}
                    <Paper elevation={3} sx={{p: 3, textAlign: "center"}}>
                        <Box sx={{mb: 3}}>
                            <ButtonGroup variant="contained" sx={{mb: 2}}>
                                <Button
                                    startIcon={<PersonIcon/>}
                                    onClick={() => handleSpeciesChange("human")}
                                    variant={selectedSpecies === "human" ? "contained" : "outlined"}
                                >
                                    Human
                                </Button>
                                <Button
                                    startIcon={<PetsIcon/>}
                                    onClick={() => handleSpeciesChange("mouse")}
                                    variant={selectedSpecies === "mouse" ? "contained" : "outlined"}
                                >
                                    Mouse
                                </Button>
                            </ButtonGroup>
                        </Box>

                        <BodyDiagram
                            species={selectedSpecies}
                            onTissueClick={handleTissueClick}
                            hoveredTissue={hoveredTissue}
                            setHoveredTissue={setHoveredTissue}
                        />

                        {hoveredTissue && (
                            <Box sx={{mt: 2}}>
                                <Chip
                                    label={`${hoveredTissue}: ${tissueData[selectedSpecies].find((t) => t.name === hoveredTissue)?.datasets} datasets`}
                                    color="primary"
                                    variant="filled"
                                />
                            </Box>
                        )}
                    </Paper>
                </Grid>

                <Grid item xs={12} md={3}>
                    {/* Assays Panel */}
                    <Paper elevation={3} sx={{p: 2, height: "fit-content"}}>
                        <Typography variant="h6" gutterBottom sx={{display: "flex", alignItems: "center", gap: 1}}>
                            <BiotechIcon color="primary"/>
                            Datasets by Assay ({selectedSpecies.charAt(0).toUpperCase() + selectedSpecies.slice(1)})
                        </Typography>
                        <Divider sx={{mb: 2}}/>
                        <List dense>
                            {assayData[selectedSpecies].map((assay) => (
                                <ListItem
                                    key={assay.name}
                                    sx={{
                                        borderRadius: 1,
                                        mb: 1,
                                        cursor: "pointer",
                                        "&:hover": {
                                            backgroundColor: alpha(theme.palette.primary.main, 0.05),
                                        },
                                    }}
                                >
                                    <Box sx={{mr: 2, color: theme.palette.primary.main}}>{assay.icon}</Box>
                                    <ListItemText
                                        primary={assay.name}
                                        secondary={`${assay.datasets.toLocaleString()} datasets`}
                                        primaryTypographyProps={{fontSize: "0.9rem"}}
                                    />
                                    <Chip label={assay.datasets.toLocaleString()} size="small" color="primary"
                                          variant="outlined"/>
                                </ListItem>
                            ))}
                        </List>
                    </Paper>
                </Grid>

                {/* Statistics Section */}
                <Grid item xs={12}>
                    <Paper elevation={3} sx={{p: 3}}>
                        <Typography variant="h5" gutterBottom sx={{textAlign: "center", mb: 3}}>
                            Portal Statistics
                            - {selectedSpecies.charAt(0).toUpperCase() + selectedSpecies.slice(1)} Data
                        </Typography>
                        <Grid container spacing={3}>
                            {statsData[selectedSpecies].map((stat) => (
                                <Grid item xs={12} sm={6} md={3} key={stat.label}>
                                    <Card elevation={2} sx={{textAlign: "center", p: 2}}>
                                        <CardContent>
                                            <Box sx={{color: theme.palette.primary.main, mb: 1}}>{stat.icon}</Box>
                                            <Typography variant="h4" component="div" gutterBottom color="primary">
                                                {stat.value}
                                            </Typography>
                                            <Typography variant="body2" color="text.secondary">
                                                {stat.label}
                                            </Typography>
                                        </CardContent>
                                    </Card>
                                </Grid>
                            ))}
                        </Grid>
                    </Paper>
                </Grid>
            </Grid>
        </Container>
    )
}
