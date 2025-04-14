import {Link} from "react-router-dom"
import {Container, Typography, Grid, Card, CardContent, CardActions, Button, Box, Paper} from "@mui/material"
import {Dna, TableCellsSplitIcon as Cells, Layers, Grid3X3, ScanSearch, CheckSquare} from "lucide-react"

export default function HomePage() {
    const viewOptions = [
        {
            title: "Gene View",
            description:
                "Explore gene expression patterns and analyze specific genes across different cell types and conditions.",
            icon: <Dna size={64} style={{color: "#10b981"}}/>,
            href: "/views/geneview",
        },
        {
            title: "Cell Type View",
            description: "Visualize and compare different cell types, their markers, and distribution across samples.",
            icon: <Cells size={64} style={{color: "#5154f1"}}/>,
            href: "/views/celltypes",
        },
        {
            title: "Layer View",
            description:
                "Examine tissue layers and their composition with detailed visualization of layer-specific features.",
            icon: <Layers size={64} style={{color: "#f59e0b"}}/>,
            href: "/views/layersview",
        },
        {
            title: "Visium ST View",
            description:
                "Analyze spatial transcriptomics data with Visium technology for tissue-wide gene expression patterns.",
            icon: <Grid3X3 size={64} style={{color: "#f43f5e"}}/>,
            href: "/views/visiumview",
        },
        {
            title: "Chr Region View",
            description: "Investigate specific chromosomal regions and their associated genes and regulatory elements.",
            icon: <ScanSearch size={64} style={{color: "#06b6d4"}}/>,
            href: "/views/regionsview",
        },
        {
            title: "XCheck View",
            description: "Cross-check and compare data across different modalities, samples, or experimental conditions.",
            icon: <CheckSquare size={64} style={{color: "#8b5cf6"}}/>,
            href: "/views/xcheck",
        },
    ]

    return (
        <Paper sx={{minHeight: "100vh", py: 5, backgroundColor: "#f5f5f5"}}>
            <Container maxWidth="lg">
                <Box sx={{textAlign: "center", mb: 6}}>
                    <Typography variant="h3">
                        BrainDataPortal Views
                    </Typography>
                    <Typography variant="h6" color="text.secondary" sx={{maxWidth: 700, mx: "auto"}}>
                        Explore and analyze single-cell, spatial transcriptomics, and other omics data through
                        specialized views
                    </Typography>
                </Box>

                <Grid container spacing={4} alignItems="stretch">
                    {viewOptions.map((option, index) => (
                        <Grid item xs={12} sm={6} md={4} key={index} sx={{display: "flex"}}>
                            <Card
                                sx={{
                                    width: "100%",
                                    display: "flex",
                                    flexDirection: "column",
                                    transition: "all 0.3s",
                                    borderRadius: 1,
                                    overflow: "hidden",
                                    boxShadow: 1,
                                    "&:hover": {
                                        boxShadow: 8,
                                        transform: "translateY(-3px)",
                                    },
                                }}
                            >
                                <CardContent
                                    sx={{
                                        flexGrow: 1,
                                        display: "flex",
                                        flexDirection: "column",
                                        alignItems: "center",
                                        textAlign: "center",
                                        p: 2,
                                    }}
                                >
                                    <Box
                                        sx={{
                                            mb: 0,
                                            display: "flex",
                                            justifyContent: "center",
                                            alignItems: "center",
                                            width: 80,
                                            height: 80,
                                            borderRadius: "50%",
                                            backgroundColor: "rgba(0,0,0,0.04)",
                                        }}
                                    >
                                        {option.icon}
                                    </Box>
                                    <Typography variant="h5" component="h2" gutterBottom sx={{fontWeight: 600, mb: 1,}}>
                                        {option.title}
                                    </Typography>
                                    <Typography variant="body1" color="text.secondary" sx={{mb: 3}}>
                                        {option.description}
                                    </Typography>
                                </CardContent>
                                <CardActions sx={{p: 2, pt: 0}}>
                                    <Button
                                        component={Link}
                                        href={option.href}
                                        variant="contained"
                                        fullWidth
                                        size="medium"
                                        style={{backgroundColor: "#2f2f2f", color: "#fff"}}
                                        sx={{
                                            borderRadius: 1,
                                            py: 1,
                                            textTransform: "none",
                                            fontSize: "1rem",
                                            fontWeight: 500,
                                        }}
                                    >
                                        Explore {option.title}
                                    </Button>
                                </CardActions>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            </Container>
        </Paper>
    )
}
