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
    Autocomplete, FormControl, InputLabel, Select, MenuItem,
} from "@mui/material";
import ScatterPlotIcon from '@mui/icons-material/ScatterPlot';
import {useParams, useSearchParams} from "react-router-dom";


import "./VisiumView.css";
import useDataStore from "../../store/DataStore.js";
import useVisiumStore from "../../store/VisiumStore.js";
import EChartFeaturePlot from "./VisiumPlot.jsx";


function VisiumView() {

    // Get all the pre-selected values
    const {dataset_id} = useParams();
    const datasetId = dataset_id ?? "all";

    const [queryParams, setQueryParams] = useSearchParams();
    const initialGenes = queryParams.getAll("gene") ?? [];
    const initialSamples = queryParams.getAll("sample") ?? [];
    const initialMetas = queryParams.getAll("meta") ?? [];


    // Prepare all the  data
    const {sampleRecords, fetchSampleData} = useDataStore();
    const {geneList, metaData} = useVisiumStore();
    const {selectedSamples, setSelectedSamples, selectedGenes, setSelectedGenes} = useVisiumStore();
    const {setDataset, exprDataList, imageDataList, loading, error} = useVisiumStore();

    const [metaFeature, setMetaFeature] = useState(initialMetas);

    useEffect(() => {
        fetchSampleData({dataset_id: datasetId});
        useVisiumStore.getState().fetchGeneMeta(datasetId);
    }, [datasetId]);

    const sampleOptions = sampleRecords.map((sample) => sample.sample_id);
    const geneOptions = geneList.map((gene) => gene);
    const metaOptions =  Object.keys(metaData[0]).map((meta) => meta);

    const [geneSearchText, setGeneSearchText] = useState("");
    const [sampleSearchText, setSampleSearchText] = useState("");

    useEffect(() => {
        const initialSelectedSamples = initialSamples.length ? initialSamples : [];
        const initialSelectedGenes = initialGenes.length ? initialGenes : [];

        setDataset(datasetId);

        useVisiumStore.setState({
            selectedSamples: initialSelectedSamples,
            selectedGenes: initialSelectedGenes
        });

        useVisiumStore.getState().fetchGeneExprData(); // Fetch data once after both are set
        useVisiumStore.getState().fetchImageData();
    }, []);

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
        updateQueryParams(selectedGenes, newValue); // Pass the new value instead of old state
    };

    /** Handles gene selection change */
    const handleGeneChange = (event, newValue) => {
        setSelectedGenes(newValue);
        updateQueryParams(newValue, selectedSamples); // Pass the new value instead of old state
        useVisiumStore.getState().fetchGeneExprData();
    };

    const handleGeneDelete = (delGene) => {
        const newGenes = selectedGenes.filter(g => g !== delGene);
        setSelectedGenes(newGenes);
        updateQueryParams(newGenes, selectedSamples);
        useVisiumStore.getState().fetchGeneExprData();
    }

     const handleMetaFeatureChange = (event) => {
        setMetaFeature(event.target.value);
        updateQueryParams(selectedGenes, selectedSamples, event.target.value);
    }

    // click the button to fetch umap data
    const handleLoadPlot = () => {
        setDataset(datasetId)
        useVisiumStore.getState().fetchGeneExprData();
        useVisiumStore.getState().fetchImageData();
    }

    // console.log("Dataset:", datasetId, "Selected Genes:", selectedGenes, "Selected Samples:", selectedSamples);
    const plotClass = Object.keys(exprDataList).length <= 1
        ? "single-plot" : Object.keys(exprDataList).length === 2
            ? "two-plots" : Object.keys(exprDataList).length === 3
                ? "three-plots" : "four-plots";

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
                    <Typography variant="subtitle1">Select Samples</Typography>

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
                                        onDelete={() => {
                                            const newSamples = selectedSamples.filter(s => s !== option);
                                            setSelectedSamples(newSamples);
                                            updateQueryParams(selectedGenes, newSamples);
                                        }}
                                    />
                                );
                            })
                        }
                        renderInput={(params) => <TextField {...params} label="Search Sample" variant="standard"
                                                            style={{margin: "10px 0px"}}/>}
                    />

                    <Typography sx={{marginTop: "10px"}} variant="subtitle1">Select features:</Typography>

                     {/* Gene Selection with Fuzzy Search & Chips */}
                    <Autocomplete
                        sx={{marginLeft: "20px"}}
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

                    {/* Gene Selection with Fuzzy Search & Chips */}
                    <Autocomplete
                        sx={{marginLeft: "20px"}}
                        multiple
                        size="small"
                        options={geneOptions}
                        value={metaFeature}
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
                        renderInput={(params) => <TextField {...params} label="Select meta feature" variant="standard"/>}
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
                                    samples and Metadata...</Typography>
                            </Box>
                        </>
                    ) : error ? (
                        <Typography color="error">{error}</Typography>
                    ) : (
                        <div className={`visium-container ${plotClass}`}>
                            {Object.keys(imageDataList).length <1 ? (
                                <Box sx={{display: "flex", justifyContent: "center", paddingTop: "100px"}}>
                                    <Typography sx={{marginLeft: "10px", color: "text.secondary"}} variant="h5">
                                        No sample selected for visualization</Typography>
                                </Box>
                            ): Object.entries(imageDataList).map(([sample_i, visiumData_i]) => (
                                <div key={sample_i} className="sample-container">
                                    {Object.entries(exprDataList).map(([gene, expr_data]) => (
                                        <div key={gene} className="visium-item">
                                            {metaData && <EChartFeaturePlot visumData={visiumData_i} geneData={expr_data} metaData={metaData}/>}
                                        </div>
                                    ))}
                                </div>
                                ))
                            }
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default VisiumView;
