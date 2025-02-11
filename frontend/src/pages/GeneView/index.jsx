import {useEffect, useState} from "react";
import {Typography, Box, Divider, CircularProgress, Autocomplete, Chip, TextField} from "@mui/material";

import useGeneStore from "../../store/GeneStore.js";
import useDataStore from "../../store/DataStore.js"; // Import CSS file

import "./GeneView.css";
import {useParams, useSearchParams} from "react-router-dom";
import UmapPlot from "./UmapPlot.jsx";

const geneOptions = ["ABCD", "ACEE", "HIGH", "XXYT", "EGGH","HJJ"];

function GeneView() {
    const {dataset_id } = useParams(); // Extracts dataset_id from the URL
    const datasetId = dataset_id ?? "all"; // Use default if undefined

    // get the query parameters
    // const queryParams = new URLSearchParams(window.location.search);
    const [queryParams, setQueryParams] = useSearchParams();
    let gene = queryParams.getAll("gene");
    let sample = queryParams.getAll("sample");
    gene = gene ?? "all";
    sample = sample ?? "all";

    console.log(datasetId,gene, sample);

    const {sampleRecords,fetchSampleData} = useDataStore();
    useEffect(() => {
        fetchSampleData({dataset_id: datasetId})
    }, [fetchSampleData]);

    const sampleOptions = sampleRecords.map((sample) => sample.sample_id);
    sampleOptions.unshift("all");

    const { selectedSamples, setSelectedSamples, selectedGenes, setSelectedGenes, umapData, loading, error } = useGeneStore();
    const [geneSearchText, setGeneSearchText] = useState("");
    const [sampleSearchText, setSampleSearchText] = useState("");

    useEffect(() => {
        setSelectedSamples(sample);
        setSelectedGenes(gene);
    }, []);

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
            <Typography variant="h6">Exploration of gene expression</Typography>
        </Box>
        <Divider />
        <div className="umap-content">

          {/* Right Panel for Sample & Gene Selection (20%) */}
          <div className="umap-panel">
            <Typography variant="subtitle1">Select Samples & Genes</Typography>

            {/* Gene Selection with Fuzzy Search & Chips */}
            <Autocomplete
              multiple
              size={"small"}
              options={geneOptions}
              value={selectedGenes}
              onChange={handleGeneChange}
              inputValue={geneSearchText}
              onInputChange={(event, newInputValue) => setGeneSearchText(newInputValue)}
              renderTags={(value, getTagProps) =>
                  value.map((option, index) => {
                    const { key, ...tagProps } = getTagProps({ index }); // Destructure and remove `key`
                    return (
                      <Chip
                        key={key}  // Pass key explicitly
                        label={option}
                        {...tagProps} // Spread the remaining props
                        color="primary"
                        onDelete={() => setSelectedGenes(selectedGenes.filter(g => g !== option))}
                      />
                    );
                  })
                }
              renderInput={(params) => <TextField {...params} label="Search Gene" variant="standard" />}
            />

            {/* Sample Selection */}
            <Autocomplete
              multiple
              size={"small"}
              options={sampleOptions}
              value={selectedSamples}
              onChange={handleSampleChange}
              inputValue={sampleSearchText}
              onInputChange={(event, newInputValue) => setSampleSearchText(newInputValue)}
              renderTags={(value, getTagProps) =>
                  value.map((option, index) => {
                    const { key, ...tagProps } = getTagProps({ index }); // Destructure and remove `key`
                    return (
                      <Chip
                        key={key}  // Pass key explicitly
                        label={option}
                        {...tagProps} // Spread the remaining props
                        color="primary"
                        onDelete={() => setSelectedSamples(selectedSamples.filter(g => g !== option))}
                      />
                    );
                  })
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

export default GeneView;
