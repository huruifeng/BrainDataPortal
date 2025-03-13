import {useEffect, useState} from "react";
import {
    Typography,
    Box,
    Divider,
    Chip,
    Button,
    TextField,
    LinearProgress,
    CircularProgress,
    Autocomplete,
} from "@mui/material";
import ScatterPlotIcon from '@mui/icons-material/ScatterPlot';
import {useParams, useSearchParams} from "react-router-dom";

import "./VisiumView.css";

import useSampleGeneMetaStore from "../../store/SempleGeneMetaStore.js";

import EChartFeaturePlot from "./VisiumEChartPlot.jsx";

function VisiumView() {

    // Get all the pre-selected values
    const {dataset_id} = useParams();
    const datasetId = dataset_id ?? "all";

    const [queryParams, setQueryParams] = useSearchParams();
    const initialGenes = queryParams.getAll("gene") ?? [];
    const initialSamples = queryParams.getAll("sample") ?? [];
    const initialMetas = queryParams.getAll("meta") ?? [];


    // Prepare all the  data
    const {
        setDataset,
        geneList, fetchGeneList,
        sampleList, fetchSampleList,
        metaList, fetchMetaList,
    } = useSampleGeneMetaStore();
    const {selectedSamples, setSelectedSamples, selectedGenes, setSelectedGenes} = useSampleGeneMetaStore();
    const {
        exprDataDict, fetchExprData,
        sampleMetaDict, fetchMetaDataOfSample,
        imageDataDict, fetchImageData
    } = useSampleGeneMetaStore();
    const {loading, error} = useSampleGeneMetaStore();

    const [selectedMetaFeatures, setSelectedMetaFeatures] = useState(initialMetas);

    useEffect(() => {
        const initialSelectedSamples = initialSamples.length ? initialSamples : [];
        const initialSelectedGenes = initialGenes.length ? initialGenes : [];

        setDataset(datasetId);
        fetchSampleList(datasetId);
        fetchGeneList(datasetId);
        fetchMetaList(datasetId);

        useSampleGeneMetaStore.setState({
            selectedSamples: initialSelectedSamples,
            selectedGenes: initialSelectedGenes
        });

        fetchExprData(); // Fetch data once after both are set
        fetchImageData();
        fetchMetaDataOfSample();
        // fetchAllMetaData(datasetId);

    }, [datasetId]);

    const excludedKeys = new Set(["cs_id", "sample_id", "Cell", "Spot", "UMAP_1", "UMAP_2"]);
    const metaOptions = metaList ? metaList.filter(option => !excludedKeys.has(option)): [];

    const [geneSearchText, setGeneSearchText] = useState("");
    const [sampleSearchText, setSampleSearchText] = useState("");
    const [metaSearchText, setMetaSearchText] = useState("");


    /** Updates the query parameters in the URL */
    const updateQueryParams = (genes, samples, metas = []) => {
        const newParams = new URLSearchParams();
        genes.forEach((gene) => newParams.append("gene", gene));
        samples.forEach((sample) => newParams.append("sample", sample));
        metas.forEach((meta) => newParams.append("meta", meta));

        setQueryParams(newParams);
    };

    /** Handles sample selection change */
    const handleSampleChange = (event, newValue) => {
        setSelectedSamples(newValue);
        updateQueryParams(selectedGenes, newValue);
        fetchImageData();
        fetchMetaDataOfSample();
    };

    /** Handles gene selection change */
    const handleGeneChange = (event, newValue) => {
        setSelectedGenes(newValue);
        updateQueryParams(newValue, selectedSamples);
        fetchExprData();
    };

    const handleGeneDelete = (delGene) => {
        const newGenes = selectedGenes.filter(g => g !== delGene);
        setSelectedGenes(newGenes);
        updateQueryParams(newGenes, selectedSamples);
        fetchExprData();
    }

    const handleMetaFeatureChange = (event, newValue) => {
        setSelectedMetaFeatures(newValue);
        updateQueryParams(selectedGenes, selectedSamples, newValue);
    }
    const handleMetaDelete = (delMeta) => {
        const newMetas = selectedMetaFeatures.filter(m => m !== delMeta);
        setSelectedMetaFeatures(newMetas);
        updateQueryParams(selectedGenes, selectedSamples, newMetas);
    }

    // click the button to fetch umap data
    const handleLoadPlot = () => {
        setDataset(datasetId)
        fetchExprData();
        fetchImageData();
        fetchMetaDataOfSample();
    }
    const selectedFeatures = [...new Set([...selectedGenes, ...selectedMetaFeatures])];
    // console.log(selectedFeatures);
    const plotClass = Object.keys(selectedFeatures).length <= 1
        ? "single-plot" : Object.keys(selectedFeatures).length === 2
            ? "two-plots" : Object.keys(selectedFeatures).length === 3
                ? "three-plots" : "four-plots";

    console.log("metaOptions", metaOptions);
    return (
        <div className="plot-page-container" style={{display: 'flex', flexDirection: 'column', flex: 1}}>
            {/* Title Row */}
            <Box className="title-row">
                <Typography variant="h6">Exploration of VisiumST Data Features</Typography>
            </Box>
            <Divider/>
            <div className="plot-content">
                {/* Right Panel for Sample & Gene Selection (20%) */}
                <div className="plot-panel">
                    <Typography variant="subtitle1">Select Samples</Typography>

                    {/* Sample Selection */}
                    <Autocomplete
                        multiple
                        size="small"
                        options={sampleList || []}
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
                                        onDelete={() => {
                                            const newSamples = selectedSamples.filter(s => s !== option);
                                            setSelectedSamples(newSamples);
                                            updateQueryParams(selectedGenes, newSamples);
                                            fetchImageData();
                                            fetchMetaDataOfSample();
                                        }}
                                    />
                                );
                            })
                        }
                        renderInput={(params) => <TextField {...params} label="Select sample" variant="standard"
                                                            style={{margin: "10px 0px"}}/>}
                    />

                    <Typography sx={{marginTop: "10px"}} variant="subtitle1">Select features:</Typography>

                    {/* Gene Selection with Fuzzy Search & Chips */}
                    <Autocomplete
                        sx={{marginLeft: "20px"}}
                        multiple
                        size="small"
                        options={geneList}
                        value={selectedGenes}
                        onChange={handleGeneChange}
                        inputValue={geneSearchText}
                        onInputChange={(event, newInputValue) => {
                            fetchGeneList(datasetId, newInputValue);
                            setGeneSearchText(newInputValue)
                        }}
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
                        renderInput={(params) => <TextField {...params} label="Search gene" variant="standard"/>}
                    />

                    {/* meta selection with Fuzzy Search & Chips */}
                    <Autocomplete
                        sx={{marginLeft: "20px"}}
                        multiple
                        size="small"
                        options={metaOptions || []}
                        value={selectedMetaFeatures}
                        onChange={handleMetaFeatureChange}
                        inputValue={metaSearchText}
                        onInputChange={(event, newInputValue) => setMetaSearchText(newInputValue)}
                        renderTags={(value, getTagProps) =>
                            value.map((option, index) => {
                                const {key, ...tagProps} = getTagProps({index});
                                return (
                                    <Chip
                                        key={`${key}-${option}`}
                                        label={option}
                                        {...tagProps}
                                        color="primary"
                                        onDelete={() => handleMetaDelete(option)}
                                    />
                                );
                            })
                        }
                        renderInput={(params) => <TextField {...params} label="Select meta feature"
                                                            variant="standard"/>}
                    />


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
                                    sample list and metadata...</Typography>
                            </Box>
                        </>
                    ) : error ? (
                        <Typography color="error">{error}</Typography>
                    ) : (
                        <div className="visium-container">
                            {Object.keys(imageDataDict).length < 1 ? (
                                <Box className="no-sample">
                                    <Typography sx={{color: "text.secondary"}} variant="h5">
                                        No sample selected for visualization
                                    </Typography>
                                </Box>
                            ) : Object.entries(imageDataDict).map(([sample_i, visiumData_i]) => (
                                <div key={sample_i} className="sample-row">
                                    {/* Sample Label */}
                                    <div className="sample-label">
                                        <Typography variant="subtitle1" align="center" sx={{mb: 1}}>
                                            Sample: {sample_i}
                                        </Typography>
                                    </div>

                                    {/* Features Container */}
                                    <div className={`features-container ${plotClass}`}>
                                        {selectedFeatures.length > 0 ? (
                                            selectedFeatures.map(feature => (
                                                <>
                                                    <div key={`${sample_i}-${feature}-echart`}
                                                         className="feature-plot-echart">
                                                        {sampleMetaDict[sample_i] && <EChartFeaturePlot visiumData={visiumData_i}
                                                                           geneData={exprDataDict}
                                                                           metaData={sampleMetaDict[sample_i] || {}}
                                                                           feature={feature}/>}
                                                        <Typography variant="caption" display="block" align="center">
                                                            {feature}
                                                        </Typography>
                                                    </div>
                                                </>
                                            ))
                                        ) : (
                                            <Box className="no-feature">
                                                <Typography sx={{color: "text.secondary"}} variant="h5">
                                                    No feature selected for visualization
                                                </Typography>
                                            </Box>
                                        )}
                                    </div>
                                    <Divider/>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default VisiumView;