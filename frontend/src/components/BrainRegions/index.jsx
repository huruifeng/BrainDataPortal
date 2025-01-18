import { useState } from "react";
import {Box, Typography} from "@mui/material";
import RegionStore from "../../store/RegionStore.js";

import * as brainRegions_inner from "../../assets/images/brain_inner";
import * as brainRegions_outer from "../../assets/images/brain_outer";

import "./BrainRegions.css";

const brainRegions = {
    // Outermost regions
    default_outer: brainRegions_outer.Brain5_Color, // Default brain image
    frontalLobe_outer: brainRegions_outer.Brain5_FrontalLobe,
    parietalLobe_outer: brainRegions_outer.Brain5_ParietalLobe,
    occipitalLobe_outer: brainRegions_outer.Brain5_OccipitalLobe,
    temporalLobe_outer: brainRegions_outer.Brain5_TemporalLobe,

    // Inner regions
    default_inner: brainRegions_inner.Brain5M_Color,
    frontalLobe_inner: brainRegions_inner.Brain5M_FrontalLobe,
    parietalLobe_inner: brainRegions_inner.Brain5M_ParietalLobe,
    occipitalLobe_inner: brainRegions_inner.Brain5M_OccipitalLobe,
    temporalLobe_inner: brainRegions_inner.Brain5M_PrimarySomasensoryCortex,
    // Add more regions here
};


const BrainRegions = () => {
  const [hoveredRegion, setHoveredRegion] = useState(null);
  const { setRegion } = RegionStore();

  const regions = {
    default_outer: {name: "Default_outer", image: brainRegions.default_outer, assays: ["Assay 1", "Assay 2", "Assay 3"],},
    frontalLobe_outer: {name: "Frontal Lobe", image: brainRegions.frontalLobe_outer, assays: ["Assay 1", "Assay 2", "Assay 3"],},
    parietalLobe_outer: { name: "Parietal Lobe", image: brainRegions.parietalLobe_outer, assays: ["Assay A", "Assay B"],},
    occipitalLobe_outer: { name: "Occipital Lobe", image: brainRegions.occipitalLobe_outer, assays: ["Assay C", "Assay D"],},
    temporalLobe_outer: { name: "Temporal Lobe", image: brainRegions.temporalLobe_outer, assays: ["Assay E", "Assay F"],},

    default_inner: {name: "Default_inner", image: brainRegions.default_inner, assays: ["Assay 1", "Assay 2", "Assay 3"],},
    frontalLobe_inner: {name: "Frontal Lobe", image: brainRegions.frontalLobe_inner, assays: ["Assay 1", "Assay 2", "Assay 3"],},
    parietalLobe_inner: { name: "Parietal Lobe", image: brainRegions.parietalLobe_inner, assays: ["Assay A", "Assay B"],},
    occipitalLobe_inner: { name: "Occipital Lobe", image: brainRegions.occipitalLobe_inner, assays: ["Assay C", "Assay D"],},
    temporalLobe_inner: { name: "Temporal Lobe", image: brainRegions.temporalLobe_inner, assays: ["Assay E", "Assay F"],},
    // Add more regions here
  };

  const handleHover = (region) => {
    setHoveredRegion(region);
  };

  const handleClick = (region) => {
    setRegion(region.name, region.assays);
  };

  return (
   <Box sx={{ textAlign: "center" }} className="brain-image-container">
      <img
        src={hoveredRegion ? hoveredRegion.image : brainRegions.default_outer} // Default brain image
        alt="Brain Regions"
        className="brain-image"
        onMouseLeave={() => setHoveredRegion(null)}
      />
    <Typography variant="caption" className="image-caption">
      Hover over / Click on the regions to explore brain areas.
    </Typography>
      <Box className="regions-overlay">
        {Object.entries(regions).map(([key, region]) => (
          <Box
            key={key}
            className={`region ${key}`}
            onMouseEnter={() => handleHover(region)}
            onClick={() => handleClick(region)}
          >
            {region.name}
          </Box>
        ))}
      </Box>
    </Box>
  );
};

export default BrainRegions;
