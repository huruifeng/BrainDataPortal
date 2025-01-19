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
    regionPoints_outer: brainRegions_outer.regionPaths,

    // Inner regions
    default_inner: brainRegions_inner.Brain5I_Color,
    frontalLobe_inner: brainRegions_inner.Brain5I_FrontalLobe,
    parietalLobe_inner: brainRegions_inner.Brain5I_ParietalLobe,
    occipitalLobe_inner: brainRegions_inner.Brain5I_OccipitalLobe,
    temporalLobe_inner: brainRegions_inner.Brain5I_TemporalLobe,
    regionPoints_inner: brainRegions_outer.regionPaths,
    // Add more regions here
};


const BrainRegions = () => {
  const [hoveredRegion, setHoveredRegion] = useState(null);
  const { setRegion } = RegionStore();

  const default_outer= {name: "Default_outer", side: "outer", image: brainRegions.default_outer, assays: ["Assay 1", "Assay 2", "Assay 3"],points:"",}
  const default_inner= {name: "Default_inner (Inner)", side:"inner", image: brainRegions.default_inner, assays: ["Assay 1", "Assay 2", "Assay 3"],points: "",}

  const regions = {
    frontalLobe_outer: {name: "Frontal Lobe", side:"outer", image: brainRegions.frontalLobe_outer, assays: ["Assay 1", "Assay 2", "Assay 4"],points: brainRegions.regionPoints_outer.FrontalLobe,},
    parietalLobe_outer: { name: "Parietal Lobe", side:"outer", image: brainRegions.parietalLobe_outer, assays: ["Assay A", "Assay B"],points: brainRegions.regionPoints_outer.ParietalLobe,},
    occipitalLobe_outer: { name: "Occipital Lobe", side:"outer", image: brainRegions.occipitalLobe_outer, assays: ["Assay C", "Assay D"],points: brainRegions.regionPoints_outer.OccipitalLobe,},
    temporalLobe_outer: { name: "Temporal Lobe", side:"outer", image: brainRegions.temporalLobe_outer, assays: ["Assay E", "Assay F"],points: brainRegions.regionPoints_outer.TemporalLobe,},

    // frontalLobe_inner: {name: "Frontal Lobe (Inner)", side:"inner", image: brainRegions.frontalLobe_inner, assays: ["Assay 1", "Assay 2", "Assay 4"],points: brainRegions.regionPoints_inner.FrontalLobe,},
    // parietalLobe_inner: { name: "Parietal Lobe (Inner)", side:"inner", image: brainRegions.parietalLobe_inner, assays: ["Assay A", "Assay B"],points: brainRegions.regionPoints_inner.ParietalLobe,},
    // occipitalLobe_inner: { name: "Occipital Lobe (Inner)", side:"inner", image: brainRegions.occipitalLobe_inner, assays: ["Assay C", "Assay D"],points: brainRegions.regionPoints_inner.OccipitalLobe,},
    // temporalLobe_inner: { name: "Temporal Lobe (Inner)", side:"inner", image: brainRegions.temporalLobe_inner, assays: ["Assay E", "Assay F"],points: brainRegions.regionPoints_inner.TemporalLobe,},
    // Add more regions here
  };

  const handleHover = (region) => {
    setHoveredRegion(region);
  };

  const handleClick = (region) => {
    setRegion(region.side, region.name, region.assays);
  };

  return (
      <div className="brain-regions-container">
          <div className="image-overlay-container">
              <img
                  src={hoveredRegion ? hoveredRegion.image : default_outer.image}
                  alt="Brain Regions"
                  className="brain-image"
                  onMouseLeave={() => setHoveredRegion(null)}
              />
              <svg
                  className="regions-overlay"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="-2210 -1380 5000 3500"
                  preserveAspectRatio="xMidYMid meet"
              >
                  {Object.entries(regions).map(([key, region]) => (
                      <polygon
                          key={key}
                          points={region.points}
                          className="region"
                          onMouseEnter={() => handleHover(region)}
                          onClick={() => handleClick(region)}
                      >
                          <title>{region.name}</title>
                      </polygon>
                  ))}
              </svg>
          </div>
      </div>

  )
};

export default BrainRegions;
