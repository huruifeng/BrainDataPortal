"use client"

import {useEffect, useState} from "react"
import {
    Typography,
    Box,
    Divider,
    Chip,
    IconButton,
    Paper,
    TextField,
    CircularProgress,
    Autocomplete,
    Tooltip,
    FormControl,
    Select,
    MenuItem,
} from "@mui/material"
import AddIcon from "@mui/icons-material/Add"
import DeleteIcon from "@mui/icons-material/Delete"
import RefreshIcon from "@mui/icons-material/Refresh"
import {useSearchParams} from "react-router-dom"

import useSampleGeneMetaStore from "../../store/SempleGeneMetaStore.js"
import useDataStore from "../../store/DataStore.js"
import {toast} from "react-toastify"
import PlotlyFeaturePlot from "../VisiumView/VisiumPlotlyPlot.jsx"

function getDatasetType(datasetRecords, datasetId) {
    for (const dataset of datasetRecords) {
        if (dataset.dataset_id === datasetId) {
            return dataset.assay
        }
    }
    return undefined
}

function getDatasetPlotType(datasets, datasetId) {
    return datasets.find(d => d.id === datasetId)?.plotType
}

function XDatasetsView() {
    // Create a state for plotData to ensure it triggers re-renders when updated
    const [plotData, setPlotData] = useState({})

    // Track loading state for metadata requests
    const [metadataLoading, setMetadataLoading] = useState({})

    const [queryParams, setQueryParams] = useSearchParams()

    // State for managing multiple datasets - initialize with TWO empty datasets
    const [datasets, setDatasets] = useState([
        {
            id: queryParams.get("dataset0") || "",
            sample: queryParams.get("sample0") || "",
            features: queryParams.getAll("features0") || [],
            plotType: queryParams.get("plottype0") || "auto", // auto, umap, visium
            isLoading: false, // Track loading state for each dataset
        },
        {
            id: queryParams.get("dataset1") || "",
            sample: queryParams.get("sample1") || "",
            features: queryParams.getAll("features1") || [],
            plotType: queryParams.get("plottype1") || "auto", // auto, umap, visium
            isLoading: false, // Track loading state for each dataset
        },
    ])

    // Store access
    const {datasetRecords, fetchDatasetList} = useDataStore()
    const {
        fetchGeneList,
        fetchSampleList,
        fetchMetaList,
        setDataset,
        loading,
        error,
        fetchUMAPData,
        fetchAllMetaData,
        exprDataDict,
        fetchExprData,
        sampleMetaDict,
        fetchMetaDataOfSample,
        imageDataDict,
        fetchImageData,
    } = useSampleGeneMetaStore()

    // Load initial data
    useEffect(() => {
        fetchDatasetList()

        // Initialize from URL params if available
        const urlDatasets = []
        let i = 0
        while (queryParams.get(`dataset${i}`) !== null) {
            urlDatasets.push({
                id: queryParams.get(`dataset${i}`) || "",
                sample: queryParams.get(`sample${i}`) || "",
                features: queryParams.getAll(`features${i}`) || [],
                plotType: queryParams.get(`plottype${i}`) || "auto",
                isLoading: false,
            })
            i++
        }

        // If we have URL datasets, use them; otherwise keep our default two columns
        if (urlDatasets.length > 0) {
            setDatasets(urlDatasets)
        }
    }, [])

    // Update loading state when global loading state changes
    useEffect(() => {
        if (!loading) {
            // When global loading is done, update all datasets to not loading
            setDatasets((prevDatasets) =>
                prevDatasets.map((dataset) => ({
                    ...dataset,
                    isLoading: false,
                })),
            )
        }
    }, [loading])

    // Check if a dataset has been loaded
    const isDatasetLoaded = (datasetId) => {
        if (!datasetId) return false;

        const data = plotData[datasetId]
        return !!(data?.genelist && data?.samplelist && data?.metalist && data?.allmetadata)
    }

    // Direct data loading function with request deduplication
    const loadDatasetData = async (datasetId) => {
        // Skip if no dataset ID
        if (!datasetId) {
            return
        }

        // Skip if already loading this dataset
        if (metadataLoading[datasetId]) {
            console.log(`Already loading metadata for dataset ${datasetId}, skipping duplicate request`)
            return
        }

        // Skip if already loaded
        if (isDatasetLoaded(datasetId)) {
            console.log(`Dataset ${datasetId} already loaded, skipping`)
            return
        }

        console.log(`Loading data for dataset ${datasetId}`)

        // Mark as loading
        setMetadataLoading((prev) => ({...prev, [datasetId]: true}))

        try {
            // Set the current dataset in the store
            setDataset(datasetId)

            // Fetch gene list if not already loaded
            if (!plotData[datasetId]?.genelist) {
                console.log(`Loading gene list for dataset ${datasetId}`)
                await fetchGeneList(datasetId)

                // Store the actual data from the store
                const storeGeneList = useSampleGeneMetaStore.getState().geneList

                setPlotData((prevData) => ({
                    ...prevData,
                    [datasetId]: {
                        ...prevData[datasetId],
                        genelist: storeGeneList,
                    },
                }))
            }

            // Fetch sample list if not already loaded
            if (!plotData[datasetId]?.samplelist) {
                console.log(`Loading sample list for dataset ${datasetId}`)
                await fetchSampleList(datasetId)

                // Store the actual data from the store
                const storeSampleList = useSampleGeneMetaStore.getState().sampleList

                setPlotData((prevData) => ({
                    ...prevData,
                    [datasetId]: {
                        ...prevData[datasetId],
                        samplelist: storeSampleList,
                    },
                }))
            }

            // Fetch meta list if not already loaded
            if (!plotData[datasetId]?.metalist) {
                console.log(`Loading meta list for dataset ${datasetId}`)
                await fetchMetaList(datasetId)

                // Store the actual data from the store
                const storeMetaList = useSampleGeneMetaStore.getState().metaList

                setPlotData((prevData) => ({
                    ...prevData,
                    [datasetId]: {
                        ...prevData[datasetId],
                        metalist: storeMetaList,
                    },
                }))
            }

            // Fetch UMAP data if selected and not already loaded
            if (getDatasetPlotType(datasets, datasetId) === "umap") {
                if (!plotData[datasetId]?.umapdata) {
                    console.log(`Loading UMAP data for dataset ${datasetId}`)
                    await fetchUMAPData(datasetId)

                    // Store the actual data from the store
                    const storeUMAPData = useSampleGeneMetaStore.getState().umapData

                    setPlotData((prevData) => ({
                        ...prevData,
                        [datasetId]: {
                            ...prevData[datasetId],
                            umapdata: storeUMAPData,
                        },
                    }))
                }
            }


            // Only fetch metadata once per dataset
            if (!plotData[datasetId]?.allmetadata) {
                console.log(`Loading all metadata for dataset ${datasetId}`)
                await fetchAllMetaData(datasetId)

                // Store the actual data from the store
                const storeAllMetaData = useSampleGeneMetaStore.getState().allMetaData

                setPlotData((prevData) => ({
                    ...prevData,
                    [datasetId]: {
                        ...prevData[datasetId],
                        allmetadata: storeAllMetaData,
                    },
                }))
            }
        } catch (error) {
            console.error(`Error loading data for dataset ${datasetId}:`, error)
        } finally {
            // Clear loading state
            setMetadataLoading((prev) => ({...prev, [datasetId]: false}))
        }
    }

    // Load dataset-specific data when datasets change
    useEffect(() => {
        // Get all datasets that need to be loaded
        const datasetsToLoad = datasets
        .filter((d) => d.id && !isDatasetLoaded(d.id))
        .map((d) => d.id)

        // Load data for each dataset that needs it
        if (datasetsToLoad.length > 0) {
            console.log(`Loading data for datasets: ${datasetsToLoad.join(", ")}`)

            // Load each dataset sequentially to avoid race conditions
            const loadDatasets = async () => {
                for (const datasetId of datasetsToLoad) {
                    await loadDatasetData(datasetId)
                }
            }

            loadDatasets()
        }
    }, [datasets.map((d) => d.id).join(",")])

    // Separate effect for loading sample-specific data
    const loadSampleData = async (datasetId, sample) => {
        // Skip if no sample is selected
        if (!sample) return;

        console.log(`Loading sample data for dataset ${datasetId}, sample ${sample}`);

        try {
            // Set the current dataset and sample in the store
            setDataset(datasetId);

            // Get the dataset object
            const dataset = datasets.find(d => d.id === datasetId);
            if (!dataset) return;

            // Set the selected samples and genes
            useSampleGeneMetaStore.setState({
                selectedSamples: [sample],
                selectedGenes: [...(dataset.features.filter(f => !plotData[datasetId]?.metalist?.includes(f)))],
            });

            // Fetch expression data
            await fetchExprData();
            setPlotData((prevData) => ({
                ...prevData,
                [datasetId]: {
                    ...prevData[datasetId],
                    exprdict: useSampleGeneMetaStore.getState().exprDataDict,
                },
            }));

            // Fetch metadata
            await fetchMetaDataOfSample();
            setPlotData((prevData) => ({
                ...prevData,
                [datasetId]: {
                    ...prevData[datasetId],
                    metadict: useSampleGeneMetaStore.getState().sampleMetaDict,
                },
            }));

            // Only fetch image data for Visium datasets
            if (getDatasetPlotType(datasets, datasetId) === "visium") {
                await fetchImageData();
                setPlotData((prevData) => ({
                    ...prevData,
                    [datasetId]: {
                        ...prevData[datasetId],
                        imagedict: useSampleGeneMetaStore.getState().imageDataDict,
                    },
                }));
            }
        } catch (error) {
            console.error(`Error loading sample data for dataset ${datasetId}:`, error);
        }
    };

    // Modified useEffect to only load data for datasets with samples
    useEffect(() => {
        // Only process datasets that have both an ID and a sample
        const datasetsWithSamples = datasets.filter(d => d.id && d.sample);

        // Process each dataset sequentially to avoid race conditions
        const processSampleData = async () => {
            for (const dataset of datasetsWithSamples) {
                await loadSampleData(dataset.id, dataset.sample);
            }
        };

        processSampleData();
    }, [datasets.map(d => `${d.id}-${d.sample}-${d.features.join(',')}`).join('|')]);

    // Update URL params when state changes
    useEffect(() => {
        const newParams = new URLSearchParams()

        // Add dataset params
        datasets.forEach((d, i) => {
            if (d.id) {
                newParams.set(`dataset${i}`, d.id)
                if (d.sample) {
                    newParams.set(`sample${i}`, d.sample)
                }
                d.features.forEach((f) => {
                    newParams.append(`features${i}`, f)
                })
                newParams.set(`plottype${i}`, d.plotType)
            }
        })

        setQueryParams(newParams)
    }, [datasets])

    // Add a new dataset slot (max 4)
    const handleAddDataset = () => {
        if (datasets.length < 4) {
            setDatasets([...datasets, {id: "", sample: "", features: [], plotType: "auto", isLoading: false}])
        } else {
            toast.info("Maximum of 4 datasets allowed.")
        }
    }

    // Remove a dataset
    const handleRemoveDataset = (index) => {
        const newDatasets = [...datasets]
        newDatasets.splice(index, 1)
        setDatasets(newDatasets)
    }

    // Update dataset ID
    const handleDatasetChange = (index, newDatasetId) => {
        // Skip if the dataset ID is the same
        if (datasets[index].id === newDatasetId) {
            return
        }

        console.log(`Changing dataset at index ${index} to ${newDatasetId}`)

        const newDatasets = [...datasets]
        newDatasets[index] = {...newDatasets[index], id: newDatasetId, sample: "", features: []}
        setDatasets(newDatasets)

        // Load the dataset data if needed
        if (newDatasetId && !isDatasetLoaded(newDatasetId)) {
            loadDatasetData(newDatasetId)
        }
    }

    // Update sample for a dataset
    const handleSampleChange = (index, newSample) => {
        const newDatasets = [...datasets]
        newDatasets[index] = {...newDatasets[index], sample: newSample}
        setDatasets(newDatasets)
    }

    // Update features for a dataset
    const handleFeaturesChange = (index, newFeatures) => {
        const newDatasets = [...datasets]
        newDatasets[index] = {...newDatasets[index], features: newFeatures}
        setDatasets(newDatasets)
    }

    // Update plot type for a dataset
    const handlePlotTypeChange = (index, newPlotType) => {
        const newDatasets = [...datasets]
        newDatasets[index] = {...newDatasets[index], plotType: newPlotType}
        setDatasets(newDatasets)

        // If changing to UMAP and we haven't loaded UMAP data yet, load it
        const dataset = newDatasets[index]
        if (newPlotType === "umap" && dataset.id && !plotData[dataset.id]?.umapdata) {
            setDataset(dataset.id)

            fetchUMAPData(dataset.id).then(() => {
                // Get the latest data from the store
                const storeUmapData = useSampleGeneMetaStore.getState().umapData

                setPlotData((prevData) => ({
                    ...prevData,
                    [dataset.id]: {
                        ...prevData[dataset.id],
                        umapdata: storeUmapData,
                    },
                }))
            })
        }
    }

    // Refresh all plots
    const handleRefreshPlots = () => {
        // Set all datasets with samples to loading state
        setDatasets((prevDatasets) =>
            prevDatasets.map((dataset) => ({
                ...dataset,
                isLoading: dataset.id && dataset.sample ? true : false,
            })),
        )
    }

    // Refresh a specific dataset
    const handleRefreshDataset = (index) => {
        const dataset = datasets[index]
        if (dataset.id && dataset.sample) {
            // Set this specific dataset to loading state
            const newDatasets = [...datasets]
            newDatasets[index] = {...newDatasets[index], isLoading: true}
            setDatasets(newDatasets)
        }
    }

    // Get all available features (genes + meta) for a dataset
    const getAvailableFeaturesForDataset = (datasetId) => {
        if (!datasetId) {
            return []
        }

        // Use our cached data from plotData state
        const datasetData = plotData[datasetId] || {}
        const geneOptions = datasetData.genelist || []
        const metaOptions = datasetData.metalist || []

        console.log(
            `Available features for dataset ${datasetId}:`,
            `genes: ${geneOptions.length}, meta: ${metaOptions.length}`,
        )

        const excludedKeys = new Set(["cs_id", "sample_id", "Cell", "Spot", "UMAP_1", "UMAP_2"])

        // Filter out excluded keys from meta options
        const filteredMetaOptions = metaOptions.filter((option) => !excludedKeys.has(option))

        // Combine gene and meta options
        return [...geneOptions, ...filteredMetaOptions]
    }

    // Get available samples for a dataset
    const getAvailableSamplesForDataset = (datasetId) => {
        if (!datasetId) {
            return []
        }

        // Use our cached data from plotData state
        const datasetData = plotData[datasetId] || {}
        const samples = datasetData.samplelist || []

        console.log(`Available samples for dataset ${datasetId}:`, samples.length)
        return samples
    }

    // Determine the appropriate plot type based on dataset type and user selection
    const getEffectivePlotType = (datasetId, userSelectedType) => {
        if (!datasetId) return null

        const datasetType = getDatasetType(datasetRecords, datasetId)

        if (userSelectedType === "auto") {
            // Auto-select based on datast type
            return datasetType === "VisiumST" ? "visium" : "umap"
        }

        return userSelectedType
    }

    // Calculate column width based on number of datasets
    const getColumnWidth = () => {
        switch (datasets.length) {
            case 1:
                return "100%"
            case 2:
                return "50%"
            case 3:
                return "33.3333%"
            case 4:
                return "25%"
            default:
                return "50%" // Default to 50% for two columns
        }
    }

    // Get available plot types for a dataset
    const getAvailablePlotTypes = (datasetId) => {
        if (!datasetId) return ["auto"]

        const datasetType = getDatasetType(datasetRecords, datasetId)

        if (datasetType === "VisiumST") {
            // return ["auto","umap", "visium", "both"]
            return ["umap", "visium"]
        } else {
            return ["umap"]
        }
    }
    console.log("======datasets", datasets)
    console.log("======plotData", plotData)

    return (
        <div className="plot-page-container" style={{display: "flex", flexDirection: "column", flex: 1}}>
            {/* Title Row */}
            <Box className="title-row" sx={{display: "flex", justifyContent: "space-between", alignItems: "center"}}>
                <Typography variant="h6">Multi-Dataset Feature Comparison</Typography>
                <Box>
                    <Tooltip title="Add Dataset (Max 4)">
                        <IconButton color="primary" onClick={handleAddDataset} disabled={datasets.length >= 4}
                                    size="small">
                            <AddIcon/>
                        </IconButton>
                    </Tooltip>
                    <Tooltip title="Refresh All Plots">
                        <IconButton color="primary" onClick={handleRefreshPlots} disabled={loading} size="small">
                            <RefreshIcon/>
                        </IconButton>
                    </Tooltip>
                </Box>
            </Box>
            <Divider/>

            {/* Table-like Layout */}
            <Box sx={{display: "flex", flex: 1, overflow: "auto"}}>
                {/* Error Message */}
                {error && (
                    <Box sx={{p: 2, width: "100%"}}>
                        <Typography color="error">{error}</Typography>
                    </Box>
                )}

                {/* Dataset Columns */}
                <Box sx={{display: "flex", width: "100%", height: "100%"}}>
                    {datasets.map((dataset, index) => (
                        <Box
                            key={`dataset-column-${index}`}
                            sx={{
                                width: getColumnWidth(),
                                display: "flex",
                                flexDirection: "column",
                                borderRight: index < datasets.length - 1 ? "1px solid #e0e0e0" : "none",
                                p: 1,
                                height: "100%",
                            }}
                            className="dataset-column"
                        >
                            {/* Dataset Header */}
                            <Paper elevation={1} sx={{p: 1, mb: 2}}>
                                <Box sx={{
                                    display: "flex",
                                    justifyContent: "space-between",
                                    alignItems: "center",
                                    mb: 1
                                }}>
                                    <Typography variant="subtitle1">Dataset {index + 1}: </Typography>
                                    {/* Dataset Selection */}
                                    <Autocomplete
                                        size="small"
                                        options={datasetRecords.map((d) => d.dataset_id) || []}
                                        value={dataset.id}
                                        onChange={(event, newValue) => handleDatasetChange(index, newValue)}
                                        sx={{
                                            flex: 1,
                                            pr: 2,
                                            pl: 2,
                                            "& .MuiInputBase-root": {height: "30px"},
                                            "& .MuiAutocomplete-input": {padding: "2px 4px !important"},
                                        }}
                                        renderInput={(params) => <TextField {...params} placeholder="Select dataset"
                                                                            variant="standard"/>}
                                    />
                                    <Box>
                                        {datasets.length > 1 && (
                                            <IconButton size="small" color="error"
                                                        onClick={() => handleRemoveDataset(index)}>
                                                <DeleteIcon fontSize="small"/>
                                            </IconButton>
                                        )}
                                        <IconButton
                                            size="small"
                                            color="primary"
                                            onClick={() => handleRefreshDataset(index)}
                                            disabled={!dataset.id || !dataset.sample || dataset.isLoading}
                                        >
                                            <RefreshIcon fontSize="small"/>
                                        </IconButton>
                                    </Box>
                                </Box>

                                {/* Plot Type Selection Row */}
                                <Box sx={{display: "flex", alignItems: "center", mb: 1}}>
                                    <Typography variant="subtitle1" sx={{minWidth: "80px"}}>
                                        Plot Type:{" "}
                                    </Typography>
                                    <FormControl fullWidth size="small" disabled={!dataset.id} sx={{flex: 1}}>
                                        <Select
                                            value={dataset.plotType}
                                            displayEmpty
                                            variant="standard"
                                            sx={{
                                                height: "30px",
                                                "& .MuiSelect-select": {padding: "2px 8px"},
                                            }}
                                            onChange={(e) => handlePlotTypeChange(index, e.target.value)}
                                        >
                                            {getAvailablePlotTypes(dataset.id).map((type) => (
                                                <MenuItem key={type} value={type}>
                                                    {type === "auto"
                                                        ? "Auto"
                                                        : type === "umap"
                                                            ? "UMAP"
                                                            : type === "visium"
                                                                ? "Visium"
                                                                : "Both UMAP & Visium"}
                                                </MenuItem>
                                            ))}
                                        </Select>
                                    </FormControl>
                                </Box>

                                {/* Sample Selection Row */}
                                <Box sx={{display: "flex", alignItems: "center", mb: 1}}>
                                    <Typography variant="subtitle1" sx={{minWidth: "80px"}}>
                                        Sample:{" "}
                                    </Typography>
                                    <Autocomplete
                                        size="small"
                                        sx={{
                                            flex: 1,
                                            "& .MuiInputBase-root": {height: "30px", marginTop: "0px"},
                                            "& .MuiAutocomplete-input": {padding: "2px 4px !important"},
                                        }}
                                        options={getAvailableSamplesForDataset(dataset.id)}
                                        value={dataset.sample}
                                        onChange={(event, newValue) => handleSampleChange(index, newValue)}
                                        disabled={!dataset.id}
                                        renderInput={(params) => (
                                            <TextField
                                                {...params}
                                                placeholder="Select sample"
                                                variant="standard"
                                                InputLabelProps={{shrink: false}}
                                            />
                                        )}
                                    />
                                </Box>

                                {/* Feature Selection Row */}
                                <Box sx={{display: "flex", alignItems: "flex-start", mb: 1}}>
                                    <Typography variant="subtitle1" sx={{minWidth: "80px", mt: 0.5}}>
                                        Features:{" "}
                                    </Typography>
                                    <Autocomplete
                                        multiple
                                        size="small"
                                        sx={{
                                            flex: 1,
                                            "& .MuiInputBase-root": {
                                                minHeight: "32px",
                                                marginTop: "0px",
                                            },
                                            "& .MuiAutocomplete-input": {padding: "2px 4px !important"},
                                        }}
                                        options={getAvailableFeaturesForDataset(dataset.id)}
                                        value={dataset.features}
                                        onChange={(event, newValue) => handleFeaturesChange(index, newValue)}
                                        disabled={!dataset.id}
                                        renderTags={(value, getTagProps) =>
                                            value.map((option, i) => {
                                                const {key, ...tagProps} = getTagProps({index: i})
                                                return (
                                                    <Chip
                                                        key={`${key}-${option}`}
                                                        label={option}
                                                        {...tagProps}
                                                        color="primary"
                                                        size="small"
                                                        onDelete={() => {
                                                            const newFeatures = dataset.features.filter((f) => f !== option)
                                                            handleFeaturesChange(index, newFeatures)
                                                        }}
                                                    />
                                                )
                                            })
                                        }
                                        renderInput={(params) => (
                                            <TextField
                                                {...params}
                                                placeholder="Select features"
                                                variant="standard"
                                                InputLabelProps={{shrink: false}}
                                            />
                                        )}
                                    />
                                </Box>
                            </Paper>

                            {/* Feature Plots */}
                            <Box sx={{flex: 1, overflow: "auto", position: "relative"}}>
                                {/* Dataset-specific loading indicator */}
                                {dataset.isLoading && (
                                    <Box
                                        sx={{
                                            position: "absolute",
                                            top: 0,
                                            left: 0,
                                            right: 0,
                                            bottom: 0,
                                            display: "flex",
                                            flexDirection: "column",
                                            justifyContent: "center",
                                            alignItems: "center",
                                            backgroundColor: "rgba(255, 255, 255, 0.7)",
                                            zIndex: 10,
                                        }}
                                    >
                                        <CircularProgress/>
                                        <Typography variant="body2" sx={{mt: 2}}>
                                            Loading data...
                                        </Typography>
                                    </Box>
                                )}

                                {dataset.id && dataset.sample ? (
                                    dataset.features.length > 0 ? (
                                        dataset.features.map((feature) => {
                                            const effectivePlotType = getEffectivePlotType(dataset.id, dataset.plotType)

                                            return (
                                                <Paper key={`${dataset.id}-${feature}`} sx={{p: 1, mb: 2}}>
                                                    <Typography variant="body2" sx={{mb: 1, fontWeight: "bold"}}>
                                                        {feature}
                                                    </Typography>

                                                    {/* UMAP Plot */}
                                                    {(effectivePlotType === "umap" || effectivePlotType === "both") && (
                                                        <Box
                                                            sx={{
                                                                height: 250,
                                                                mb: effectivePlotType === "both" ? 2 : 0,
                                                            }}
                                                        >
                                                            <Typography variant="caption"
                                                                        sx={{display: "block", mb: 1}}>
                                                                UMAP View
                                                            </Typography>
                                                            {imageDataDict[dataset.sample] && sampleMetaDict[dataset.sample] ? (
                                                                <div>
                                                                    {/* Replace with your actual UMAP component */}
                                                                    <Box
                                                                        sx={{
                                                                            height: 220,
                                                                            bgcolor: "#f0f0f0",
                                                                            display: "flex",
                                                                            justifyContent: "center",
                                                                            alignItems: "center",
                                                                        }}
                                                                    >
                                                                        UMAP Plot for {feature}
                                                                    </Box>
                                                                </div>
                                                            ) : (
                                                                <Box
                                                                    sx={{
                                                                        display: "flex",
                                                                        justifyContent: "center",
                                                                        alignItems: "center",
                                                                        height: "100%",
                                                                        bgcolor: "#f5f5f5",
                                                                        borderRadius: 1,
                                                                    }}
                                                                >
                                                                    <Typography variant="body2" color="text.secondary">
                                                                        No UMAP data available
                                                                    </Typography>
                                                                </Box>
                                                            )}
                                                        </Box>
                                                    )}

                                                    {/* Visium Plot */}
                                                    {(effectivePlotType === "visium" || effectivePlotType === "both") && (
                                                        <Box sx={{height: 250}}>
                                                            <Typography variant="caption"
                                                                        sx={{display: "block", mb: 1}}>
                                                                Visium View
                                                            </Typography>
                                                            {imageDataDict[dataset.sample] && sampleMetaDict[dataset.sample] ? (
                                                                <PlotlyFeaturePlot
                                                                    visiumData={imageDataDict[dataset.sample]}
                                                                    geneData={exprDataDict}
                                                                    metaData={sampleMetaDict[dataset.sample] || {}}
                                                                    feature={feature}
                                                                />
                                                            ) : (
                                                                <Box
                                                                    sx={{
                                                                        display: "flex",
                                                                        justifyContent: "center",
                                                                        alignItems: "center",
                                                                        height: "100%",
                                                                        bgcolor: "#f5f5f5",
                                                                        borderRadius: 1,
                                                                    }}
                                                                >
                                                                    <Typography variant="body2" color="text.secondary">
                                                                        No Visium data available
                                                                    </Typography>
                                                                </Box>
                                                            )}
                                                        </Box>
                                                    )}
                                                </Paper>
                                            )
                                        })
                                    ) : (
                                        <Box
                                            sx={{
                                                display: "flex",
                                                justifyContent: "center",
                                                alignItems: "center",
                                                height: 200,
                                                bgcolor: "#f5f5f5",
                                                borderRadius: 1,
                                            }}
                                        >
                                            <Typography variant="body1" color="text.secondary">
                                                No features selected
                                            </Typography>
                                        </Box>
                                    )
                                ) : (
                                    <Box
                                        sx={{
                                            display: "flex",
                                            justifyContent: "center",
                                            alignItems: "center",
                                            height: 200,
                                            bgcolor: "#f5f5f5",
                                            borderRadius: 1,
                                        }}
                                    >
                                        <Typography variant="body1" color="text.secondary">
                                            {dataset.id ? "Select a sample" : "Select a dataset"}
                                        </Typography>
                                    </Box>
                                )}
                            </Box>
                        </Box>
                    ))}
                </Box>
            </Box>
        </div>
    )
}

export default XDatasetsView

