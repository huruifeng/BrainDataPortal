import {useEffect, useState} from "react";
import {Typography, Box, Divider, CircularProgress, Autocomplete, Chip, TextField} from "@mui/material";

import useGeneStore from "../../store/GeneStore.js";
import useDataStore from "../../store/DataStore.js"; // Import CSS file

import "./GeneView.css";
import {useParams} from "react-router-dom";
import UmapPlot from "./UmapPlot.jsx";

const geneOptions = ["ABCD", "ACEE", "HIGH", "XXYT", "EGGH","HJJ"];
const sampleOptions = ["ABCD", "ACEE", "HIGH", "XXYT", "EGGH","HJJ"];


function UmapView() {
    const {sampleRecords,fetchSampleData} = useDataStore();
    useEffect(() => {
        fetchSampleData({dataset_id: "all"})
    }, [fetchSampleData]);

    const sampleOptions = sampleRecords.map((sample) => sample.sample_id);


    const { dataset_id } = useParams(); // Extracts dataset_id from the URL

    const { selectedSamples, setSelectedSamples, selectedGenes, setSelectedGenes, umapData, loading, error } = useGeneStore();
    const [searchText, setSearchText] = useState("");


    const handleSampleChange = (event, newValue) => {
        setSelectedSamples(newValue);
    }

    const handleGeneChange = (event, newValue) => {
        setSelectedGenes(newValue);
    }

  return (
    <div className="umap-page-container" style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
       {/* Title Row */}
        <Box className="title-row">
            <Typography variant="h5">UMAP Visualization</Typography>
        </Box>
        <Divider />
        <div className="umap-content">

          {/* Right Panel for Sample & Gene Selection (20%) */}
          <div className="umap-panel">
            <Typography variant="h6">Select Samples & Genes</Typography>

            {/* Gene Selection with Fuzzy Search & Chips */}
            <Autocomplete
              multiple
              autoSelect={true}
              size={"small"}
              options={geneOptions}
              value={selectedGenes}
              onChange={handleGeneChange}
              inputValue={searchText}
              onInputChange={(event, newInputValue) => setSearchText(newInputValue)}
              renderTags={(value, getTagProps) =>
                value.map((option, index) => (
                  <Chip
                    key={option}
                    label={option}
                    {...getTagProps({ index })}
                    color="primary"
                    onDelete={() => setSelectedGenes(selectedGenes.filter(g => g !== option))}
                  />
                ))
              }
              renderInput={(params) => <TextField {...params} label="Search Gene" variant="standard" />}
            />

            {/* Sample Selection */}
            <Autocomplete
              multiple
              autoSelect={true}
              size={"small"}
              options={sampleOptions}
              value={selectedSamples}
              onChange={handleSampleChange}
              inputValue={searchText}
              onInputChange={(event, newInputValue) => setSearchText(newInputValue)}
              renderTags={(value, getTagProps) =>
                value.map((option, index) => (
                  <Chip
                    key={option}
                    label={option}
                    {...getTagProps({ index })}
                    color="primary"
                    onDelete={() => setSelectedSamples(selectedSamples.filter(g => g !== option))}
                  />
                ))
              }
              renderInput={(params) => <TextField {...params} label="Search Sample" variant="standard" style={{margin:"10px 0px"}}/>}
            />
          </div>
          {/* Left UMAP Plot Area (80%) */}
          <div className="umap-main">
            {loading ? (
              <CircularProgress />
            ) : error ? (
              <Typography color="error">{error}</Typography>
            ) : umapData ? (
              <UmapPlot data={umapData} />
            ) : (
              <Typography variant="h6">Select Samples & Genes to Load UMAP</Typography>
            )}
          </div>
        </div>
    </div>
  );
}

export default UmapView;
