import { Box, Typography, Paper } from "@mui/material";

const About = () => {
  return (
    <Box sx={{ padding: 4, maxWidth: 800, margin: "auto" }}>
      <Paper elevation={3} sx={{ padding: 4, textAlign: "center" }}>
        <Typography variant="h4" gutterBottom>
          About BrainDataPortal
        </Typography>
        <Typography variant="body1" gutterBottom>
          BrainDataPortal is an advanced platform designed for the analysis and visualization of brain-related data.
          It empowers researchers, scientists, and healthcare professionals to explore and analyze a wide variety of
          omics data such as:
        </Typography>
        <Box component="ul" sx={{ textAlign: "left", paddingLeft: 4 }}>
          <li>scRNAseq</li>
          <li>scATACseq</li>
          <li>ChIPseq</li>
          <li>Spatial Transcriptomics</li>
          <li>And other omics data types</li>
        </Box>
        <Typography variant="body1" gutterBottom>
          With the integration of interactive tools and data filters, users can delve deeper into cell lines,
          brain regions, and specific diseases like Parkinson's and Alzheimer's.
        </Typography>
        <Typography variant="body1" gutterBottom>
          BrainDataPortal utilizes the latest technologies:
        </Typography>
        <Box component="ul" sx={{ textAlign: "left", paddingLeft: 4 }}>
          <li><strong>Frontend:</strong> React + Vite, Material UI</li>
          <li><strong>Backend:</strong> FastAPI</li>
          <li><strong>State Management:</strong> Zustand</li>
        </Box>
        <Typography variant="body1">
          We are committed to providing the research community with robust tools for advancing our understanding
          of the brain. Join us in pushing the boundaries of neuroscience!
        </Typography>
      </Paper>
    </Box>
  );
};

export default About;
