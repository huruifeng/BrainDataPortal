import {useEffect, useState} from "react";
import {
    Typography,
    Box,
    Divider,
    CircularProgress,
    Autocomplete,
    Chip,
    TextField,
    Button,
    LinearProgress, InputLabel, FormControl, Select, MenuItem
} from "@mui/material";
import "./GeneView.css";

import ScatterPlotIcon from '@mui/icons-material/ScatterPlot';
import {useParams, useSearchParams} from "react-router-dom";

import EChartScatterPlot from "./EChartScatter.jsx";
import EChartMetaScatter from "./EChartMetaScatter.jsx";

import PlotlyScatterPlot from "./PlotlyScatter.jsx";

import PlotlyViolinPlot from "./PlotlyViolin.jsx";
import PlotlyStackedViolin from "./PlotlyStackedViolin.jsx";

import {isCategorical} from "../../utils/funcs.js";

import useSampleGeneMetaStore from "../../store/SempleGeneMetaStore.js";


function GeneView() {

    // Get all the pre-selected values
    const {dataset_id} = useParams();
    const datasetId = dataset_id ?? "all";

    const [queryParams, setQueryParams] = useSearchParams();
    const initialGenes = queryParams.getAll("gene");
    const initialSamples = queryParams.getAll("sample") ?? ["all"];
    const initialColoring = queryParams.get("color") ?? "";
    const initialGrouping = queryParams.get("group") ?? "";

    // Prepare all the  data
    const {
        setDataset,
        geneList, fetchGeneList,
        sampleList, fetchSampleList,
        metaList, fetchMetaList,
        umapData, fetchUMAPData
    } = useSampleGeneMetaStore();
    const {selectedSamples, setSelectedSamples, selectedGenes, setSelectedGenes} = useSampleGeneMetaStore();
    const {metaData, fetchMetaData, exprDataDict, fetchExprData} = useSampleGeneMetaStore();
    const {loading, error} = useSampleGeneMetaStore();

    const [coloring, setColoring] = useState(initialColoring);
    const [grouping, setGrouping] = useState(initialGrouping);

    useEffect(() => {
        setDataset(datasetId);
        fetchUMAPData(datasetId);
        fetchSampleList(datasetId);
        fetchGeneList(datasetId);
        fetchMetaList(datasetId);

        const initialSelectedSamples = initialSamples.length ? initialSamples : ["all"];
        const initialSelectedGenes = initialGenes.length ? initialGenes : [];

        useSampleGeneMetaStore.setState({
            selectedSamples: initialSelectedSamples,
            selectedGenes: initialSelectedGenes
        });
        fetchExprData(datasetId);
        fetchMetaData(datasetId, coloring);

    }, [datasetId]);


    const sampleOptions = sampleList.map((sample) => sample) ?? [];
    sampleOptions.unshift("all");

    const geneOptions = geneList.map((gene) => gene) ?? [];

    const [geneSearchText, setGeneSearchText] = useState("");
    const [sampleSearchText, setSampleSearchText] = useState("");

    /** Updates the query parameters in the URL */
    const updateQueryParams = (genes, samples, color = null, group = null) => {
        const newParams = new URLSearchParams();
        genes.forEach((gene) => newParams.append("gene", gene));
        samples.forEach((sample) => newParams.append("sample", sample));
        if (color) newParams.append("color", color);
        if (group) newParams.append("group", group);
        setQueryParams(newParams);
    };

    /** Handles sample selection change */
    const handleSampleChange = (event, newValue) => {
        setSelectedSamples(newValue);
        updateQueryParams(selectedGenes, newValue); // Pass the new value instead of old state
        fetchMetaData(datasetId, coloring);
    };

    const handleSampleDelete = (delSample) => {
        const newSamples = selectedSamples.filter(s => s !== delSample);
        setSelectedSamples(newSamples);
        updateQueryParams(selectedGenes, newSamples);
        fetchMetaData(datasetId, coloring);
    }

    /** Handles gene selection change */
    const handleGeneChange = (event, newValue) => {
        setSelectedGenes(newValue);
        updateQueryParams(newValue, selectedSamples, coloring, grouping); // Pass the new value instead of old state
        fetchExprData();
    };

    const handleGeneDelete = (delGene) => {
        const newGenes = selectedGenes.filter(g => g !== delGene);
        setSelectedGenes(newGenes);
        updateQueryParams(newGenes, selectedSamples, coloring, grouping);
        fetchExprData();
    }

    // click the button to fetch umap data
    const handleLoadPlot = () => {
        setDataset(datasetId)
        fetchExprData();
    }

    const handleGroupingChange = (event) => {
        setGrouping(event.target.value);
        updateQueryParams(selectedGenes, selectedSamples, coloring, event.target.value);
    }

    const handleColoringChange = (event) => {
        setColoring(event.target.value);
        updateQueryParams(selectedGenes, selectedSamples, event.target.value, grouping);
        fetchMetaData(datasetId, event.target.value);
    }

    // console.log("Dataset:", datasetId, "Selected Genes:", selectedGenes, "Selected Samples:", selectedSamples);
    const plotClass = Object.keys(exprDataDict).length <= 1
        ? "single-plot" : Object.keys(exprDataDict).length === 2
            ? "two-plots" : Object.keys(exprDataDict).length === 3
                ? "three-plots" : "four-plots";


    const metaValues = Object.values(metaData);
    let isCat = true;
    if (isCategorical(metaValues)) {
        isCat = true;
    }

    return (
        <div className="plot-page-container" style={{display: 'flex', flexDirection: 'column', flex: 1}}>
            {/* Title Row */}
            <Box className="title-row">
                <Typography variant="h6">Exploration of Gene Expression</Typography>
            </Box>
            <Divider/>
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
                                const {key, ...tagProps} = getTagProps({index});
                                return (
                                    <Chip
                                        key={`${key}-${option}`}
                                        label={option}
                                        {...tagProps}
                                        color="primary"
                                        onDelete={() => handleGeneDelete(option)}
                                    />
                                );
                            })
                        }
                        renderInput={(params) => <TextField {...params} label="Search Gene" variant="standard"/>}
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
                                const {key, ...tagProps} = getTagProps({index});
                                return (
                                    <Chip
                                        key={`${key}-${option}`}
                                        label={option}
                                        {...tagProps}
                                        color="primary"
                                        onDelete={() => handleSampleDelete(option)}
                                    />
                                );
                            })
                        }
                        renderInput={(params) => <TextField {...params} label="Search Sample" variant="standard"
                                                            style={{margin: "10px 0px"}}/>}
                    />


                    <Typography sx={{marginTop: "10px", marginLeft: "20px"}} variant="subtitle1">Change plotting
                        options:</Typography>

                    {selectedGenes.length === 0 ?
                        // *a dropdown to select the options on how to color the plot*/
                        <Box sx={{display: "flex", justifyContent: "start", marginBottom: "10px", marginLeft: "20px"}}>
                            <FormControl variant="standard" sx={{width: "100%"}}>
                                <InputLabel id="coloring-label">UMAP coloring</InputLabel>
                                <Select
                                    labelId="coloring-label"
                                    id="coloring-select"
                                    value={coloring}
                                    onChange={handleColoringChange}
                                    size="small"
                                    variant="standard"
                                >
                                    {metaList && metaList.length > 0 ? (
                                        metaList.map((option) => {
                                            const excludedKeys = new Set(["cs_id", "sample_id", "Cell", "Spot", "UMAP_1", "UMAP_2"]);
                                            if (excludedKeys.has(option)) return null;
                                            return (<MenuItem key={option} value={option}>
                                                {option}
                                            </MenuItem>)
                                        })
                                    ) : (
                                        <MenuItem disabled>
                                            {loading ? "Loading metadata..." : "No metadata available"}
                                        </MenuItem>
                                    )}
                                </Select>
                            </FormControl>
                        </Box>
                        :
                        /*a dropdown to select the options on how to group the data*/
                        <Box sx={{display: "flex", justifyContent: "start", marginBottom: "10px", marginLeft: "20px"}}>
                            <FormControl variant="standard" sx={{width: "100%"}}>
                                <InputLabel id="grouping-label">Gene grouping</InputLabel>
                                <Select
                                    labelId="grouping-label"
                                    id="grouping-select"
                                    value={grouping}
                                    onChange={handleGroupingChange}
                                    size="small"
                                    variant="standard"
                                >
                                    {metaList && metaList.length > 0 ? (
                                        metaList.map((option) => {
                                            const excludedKeys = new Set(["cs_id", "sample_id", "Cell", "Spot", "UMAP_1", "UMAP_2"]);
                                            if (excludedKeys.has(option)) return null;
                                            return (<MenuItem key={option} value={option}>
                                                {option}
                                            </MenuItem>)
                                        })
                                    ) : (
                                        <MenuItem disabled>
                                            {loading ? "Loading metadata..." : "No metadata available"}
                                        </MenuItem>
                                    )}
                                </Select>
                            </FormControl>
                        </Box>
                    }

                    {/* a button to fetch data and a loading indicator*/}
                    <Box sx={{display: "flex", justifyContent: "center", margin: "20px 0px"}}>
                        <Button variant="outlined" endIcon={<ScatterPlotIcon/>} disabled={loading}
                                onClick={handleLoadPlot}>
                            {loading ? "Loading plots..." : "Refresh Plots"}
                        </Button>
                    </Box>

                </div>
                {/* Left UMAP Plot Area (80%) */}
                <div className="plot-main">
                    {loading ? (
                        <>
                            <Box sx={{width: '100%'}}>
                                <LinearProgress/>
                            </Box>
                            <Box sx={{display: "flex", justifyContent: "center", paddingTop: "100px"}}>
                                <CircularProgress/>
                            </Box>
                            <Box sx={{display: "flex", justifyContent: "center", paddingTop: "10px"}}>
                                <Typography sx={{marginLeft: "10px", color: "text.secondary"}} variant="h5">Loading
                                    data...</Typography>
                            </Box>
                        </>
                    ) : error ? (
                        <Typography color="error">{error}</Typography>
                    ) : Object.keys(exprDataDict).length > 0 ? (
                        <>
                            <Divider sx={{marginTop: "10px"}}>UMAP Plots</Divider>
                            <div className={`umap-container ${plotClass}`}>
                                {Object.entries(exprDataDict).map(([gene, expr_data]) => (
                                    <div key={gene} className="umap-item">
                                        <div className="umap-wrapper">
                                            {umapData && <EChartScatterPlot gene={gene} sampleList={selectedSamples} umapData={umapData}
                                                                            exprData={expr_data} metaData={metaData}
                                                                            group={coloring}/>}
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {Object.keys(exprDataDict).length >= 1 &&
                                <Divider sx={{marginTop: "10px"}} flexItem>Gene Expression Plots</Divider>}
                            {/*plot the violin plot individually for each gene*/}
                            {/*<div className={`violin-container`}>*/}
                            {/*    {Object.entries(exprDataDict).map(([gene, expr_data]) => (*/}
                            {/*        <div key={gene} className="violin-item">*/}
                            {/*            <div className="violin-wrapper">*/}
                            {/*                <PlotlyViolinPlot gene={gene} geneData={expr_data} sampleData={selectedSamples} metaData={metaData} group={grouping} />*/}
                            {/*            </div>*/}
                            {/*        </div>*/}
                            {/*    ))}*/}
                            {/*</div>*/}

                            {/*plot the stacked violin plot*/}
                            {/*{isCat ?*/}
                            {/*    <div id="stacked_violin_div" className={`violin-container`}>*/}
                            {/*        <div key='stacked_violin' className="violin-item">*/}
                            {/*            <div className="violin-wrapper">*/}
                            {/*                {umapData &&*/}
                            {/*                    <PlotlyStackedViolin gene={"stackedviolin"} geneData={exprDataDict}*/}
                            {/*                                         sampleData={selectedSamples} metaData={metaData}*/}
                            {/*                                         group={grouping}/>}*/}
                            {/*            </div>*/}
                            {/*        </div>*/}
                            {/*    </div>*/}
                            {/*    :*/}
                            {/*    <div id="meta_scatter_div" className={`umap-container ${plotClass}`}>*/}
                            {/*        {Object.entries(exprDataDict).map(([gene, expr_data]) => (*/}
                            {/*            <div key={gene} className="umap-item">*/}
                            {/*                <div className="umap-wrapper">*/}
                            {/*                    {umapData && <EChartMetaScatter gene={gene} geneData={expr_data}*/}
                            {/*                                                       sampleData={selectedSamples}*/}
                            {/*                                                       metaData={metaData}*/}
                            {/*                                                       group={grouping}/>}*/}
                            {/*                </div>*/}
                            {/*            </div>*/}
                            {/*        ))}*/}
                            {/*    </div>*/}
                            {/*}*/}

                        </>

                    ) : (
                        <div className={`umap-container single-plot`}>
                            <div key={'all_gene'} className="umap-item">
                                <div className="umap-wrapper">
                                    {umapData &&
                                        <EChartScatterPlot gene={"all"} sampleList={selectedSamples} umapData={umapData}
                                                           exprData={{"all": "all"}} metaData={metaData}
                                                           group={coloring}/>}
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default GeneView;
