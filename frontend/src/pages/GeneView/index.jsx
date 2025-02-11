import { useEffect, useState } from "react";
import { Typography, Box, Divider, CircularProgress, Autocomplete, Chip, TextField } from "@mui/material";
import { useParams, useSearchParams } from "react-router-dom";

import useGeneStore from "../../store/GeneStore.js";
import useDataStore from "../../store/DataStore.js";
import UmapPlot from "./UmapPlot.jsx";
import "./GeneView.css";

const geneOptions = ["ABCD", "ACEE", "HIGH", "XXYT", "EGGH", "HJJ"];

function GeneView() {
    const { dataset_id } = useParams();
    const datasetId = dataset_id ?? "all";

    const [queryParams, setQueryParams] = useSearchParams();
    const initialGenes = queryParams.getAll("gene");
    const initialSamples = queryParams.getAll("sample");

    const { sampleRecords, fetchSampleData, geneList, fetchGeneList } = useDataStore();
    useEffect(() => {
        fetchSampleData({ dataset_id: datasetId });
        fetchGeneList(datasetId);
    }, [fetchSampleData]);

    const sampleOptions = sampleRecords.map((sample) => sample.sample_id);
    sampleOptions.unshift("all");

    const { selectedSamples, setSelectedSamples, selectedGenes, setSelectedGenes, umapData, loading, error } = useGeneStore();

    const [geneSearchText, setGeneSearchText] = useState("");
    const [sampleSearchText, setSampleSearchText] = useState("");

    // Initialize state from URL parameters on first render
    useEffect(() => {
        setSelectedSamples(initialSamples.length ? initialSamples : []);
        setSelectedGenes(initialGenes.length ? initialGenes : []);
    }, []);

    /** Updates the query parameters in the URL */
    const updateQueryParams = (genes, samples) => {
        const newParams = new URLSearchParams();
        genes.forEach((gene) => newParams.append("gene", gene));
        samples.forEach((sample) => newParams.append("sample", sample));
        setQueryParams(newParams);
    };

    /** Handles sample selection change */
    const handleSampleChange = (event, newValue) => {
        setSelectedSamples(newValue);
        updateQueryParams(selectedGenes, newValue); // Pass the new value instead of old state
    };

    /** Handles gene selection change */
    const handleGeneChange = (event, newValue) => {
        setSelectedGenes(newValue);
        updateQueryParams(newValue, selectedSamples); // Pass the new value instead of old state
    };

    console.log("Dataset:", datasetId, "Selected Genes:", selectedGenes, "Selected Samples:", selectedSamples);

    return (
        <div className="umap-page-container" style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
            {/* Title Row */}
            <Box className="title-row">
                <Typography variant="h6">Exploration of Gene Expression</Typography>
            </Box>
            <Divider />
            <div className="umap-content">
                {/* Right Panel for Sample & Gene Selection (20%) */}
                <div className="umap-panel">
                    <Typography variant="subtitle1">Select Samples & Genes</Typography>

                    {/* Gene Selection with Fuzzy Search & Chips */}
                    <Autocomplete
                        multiple
                        size="small"
                        options={geneOptions}
                        value={selectedGenes}
                        onChange={handleGeneChange}
                        inputValue={geneSearchText}
                        onInputChange={(event, newInputValue) => setGeneSearchText(newInputValue)}
                        renderTags={(value, getTagProps) =>
                            value.map((option, index) => {
                                const { key, ...tagProps } = getTagProps({ index });
                                return (
                                    <Chip
                                        key={key}
                                        label={option}
                                        {...tagProps}
                                        color="primary"
                                        onDelete={() => {
                                            const newGenes = selectedGenes.filter(g => g !== option);
                                            setSelectedGenes(newGenes);
                                            updateQueryParams(newGenes, selectedSamples);
                                        }}
                                    />
                                );
                            })
                        }
                        renderInput={(params) => <TextField {...params} label="Search Gene" variant="standard" />}
                    />

                    {/* Sample Selection */}
                    <Autocomplete
                        multiple
                        size="small"
                        options={sampleOptions}
                        value={selectedSamples}
                        onChange={handleSampleChange}
                        inputValue={sampleSearchText}
                        onInputChange={(event, newInputValue) => setSampleSearchText(newInputValue)}
                        renderTags={(value, getTagProps) =>
                            value.map((option, index) => {
                                const { key, ...tagProps } = getTagProps({ index });
                                return (
                                    <Chip
                                        key={key}
                                        label={option}
                                        {...tagProps}
                                        color="primary"
                                        onDelete={() => {
                                            const newSamples = selectedSamples.filter(s => s !== option);
                                            setSelectedSamples(newSamples);
                                            updateQueryParams(selectedGenes, newSamples);
                                        }}
                                    />
                                );
                            })
                        }
                        renderInput={(params) => <TextField {...params} label="Search Sample" variant="standard" style={{ margin: "10px 0px" }} />}
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
