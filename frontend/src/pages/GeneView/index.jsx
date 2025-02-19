import { useEffect, useState } from "react";
import {
    Typography,
    Box,
    Divider,
    CircularProgress,
    Autocomplete,
    Chip,
    TextField,
    Button,
    LinearProgress
} from "@mui/material";
import ScatterPlotIcon from '@mui/icons-material/ScatterPlot';
import { useParams, useSearchParams } from "react-router-dom";

import useGeneStore from "../../store/GeneStore.js";
import useDataStore from "../../store/DataStore.js";
import UmapPlot from "./UmapPlot.jsx";
import {ViolinPlot,StackedViolinPlot} from "./ViolinPlot.jsx";

import "./GeneView.css";

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

    const geneOptions = geneList.map((gene) => gene);

    const {selectedSamples, setSelectedSamples, selectedGenes, setSelectedGenes} = useGeneStore();
    const { setDataset,umapDataList, loading, error } = useGeneStore();

    const [geneSearchText, setGeneSearchText] = useState("");
    const [sampleSearchText, setSampleSearchText] = useState("");

    useEffect(() => {
        const initialSelectedSamples = initialSamples.length ? initialSamples : [];
        const initialSelectedGenes = initialGenes.length ? initialGenes : [];

        // console.log("Dataset:", datasetId, "Selected Genes:", initialSelectedGenes, "Selected Samples:", initialSelectedSamples);
        setDataset(datasetId);

        useGeneStore.setState({
            selectedSamples: initialSelectedSamples,
            selectedGenes: initialSelectedGenes
        });

        useGeneStore.getState().fetchUmapData(); // Fetch data once after both are set
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
        // if there is sample change, clear the umapDataList
        useGeneStore.getState().umapDataList = {};

    };

    /** Handles gene selection change */
    const handleGeneChange = (event, newValue) => {
        setSelectedGenes(newValue);
        updateQueryParams(newValue, selectedSamples); // Pass the new value instead of old state
    };

    // click the button to fetch umap data
    const handleLoadPlot = () => {
        setDataset(datasetId)
         useGeneStore.getState().fetchUmapData();
    }

    // console.log("Dataset:", datasetId, "Selected Genes:", selectedGenes, "Selected Samples:", selectedSamples);
    const plotClass = Object.keys(umapDataList).length <= 1
        ? "single-plot" : Object.keys(umapDataList).length === 2
            ? "two-plots" : Object.keys(umapDataList).length === 3
                ? "three-plots" : "four-plots";

    return (
        <div className="plot-page-container" style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
            {/* Title Row */}
            <Box className="title-row">
                <Typography variant="h6">Exploration of Gene Expression</Typography>
            </Box>
            <Divider />
            <div className="plot-content">
                {/* Right Panel for Sample & Gene Selection (20%) */}
                <div className="plot-panel">
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
                                        key={option}
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
                                        key={option}
                                        label={option}
                                        {...tagProps}
                                        color="primary"
                                        onDelete={() => {
                                            const newSamples = selectedSamples.filter(s => s !== option);
                                            setSelectedSamples(newSamples);
                                            updateQueryParams(selectedGenes, newSamples);
                                            useGeneStore.getState().umapDataList = {};
                                        }}
                                    />
                                );
                            })
                        }
                        renderInput={(params) => <TextField {...params} label="Search Sample" variant="standard" style={{ margin: "10px 0px" }} />}
                    />

                    {/* a button to fetch data and a loading indicator*/}
                    <Box sx={{ display: "flex", justifyContent: "center", margin: "10px 0px" }}>
                        <Button variant="outlined" endIcon={<ScatterPlotIcon />} disabled={loading} onClick={handleLoadPlot}>Load plots</Button>
                    </Box>

                </div>
                {/* Left UMAP Plot Area (80%) */}
                <div className="plot-main">
                    {loading ? (
                        <>
                           <Box sx={{ width: '100%'}}>
                              <LinearProgress />
                            </Box>
                            {/*<Box sx={{ display: "flex", justifyContent: "center",paddingTop: "100px" }}>*/}
                            {/*    <CircularProgress />*/}
                            {/*</Box>*/}
                        </>
                    ) : error ? (
                        <Typography color="error">{error}</Typography>
                    ) : Object.keys(umapDataList).length > 0 ? (
                        <>
                            <div className={`umap-container ${plotClass}`}>
                                {Object.entries(umapDataList).map(([gene, umap_data]) => (
                                    <div key={gene} className="umap-item">
                                        <div className="umap-wrapper">
                                            <UmapPlot gene={gene} data={umap_data} />
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/*plot the violin plot individually for each gene*/}
                            {/*<div className={`violin-container`}>*/}
                            {/*    {Object.entries(umapDataList).map(([gene, umap_data]) => (*/}
                            {/*        <div key={gene} className="violin-item">*/}
                            {/*            <div className="violin-wrapper">*/}
                            {/*                <ViolinPlot gene={gene} data={umap_data} />*/}
                            {/*            </div>*/}
                            {/*        </div>*/}
                            {/*    ))}*/}
                            {/*</div>*/}

                            {/*plot the stacked violin plot*/}
                            <div className={`violin-container`} style={{ marginTop: "20px", marginBottom: "20px", minHeight: `${Object.keys(umapDataList).length*100 + 80}px` }}>
                                <div key='stacked_violin' className="violin-item">
                                    <div className="violin-wrapper">
                                        <StackedViolinPlot gene={"stacked_violin"} data={umapDataList} />
                                    </div>
                                </div>
                            </div>
                        </>

                    ) : (
                        <Typography variant="h6">Click the button to load plots</Typography>
                    )}
                </div>
            </div>
        </div>
    );
}

export default GeneView;
