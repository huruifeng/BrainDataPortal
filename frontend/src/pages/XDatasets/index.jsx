import {useEffect, useState} from "react"
import {
    Typography, Box, Divider, Chip, IconButton, Paper,
    TextField, CircularProgress, Autocomplete, Tooltip,
    FormControl, Select, MenuItem,
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
            return dataset.assay;
        }
    }
    return undefined;
}

function XDatasetsView() {
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
    const {geneList, fetchGeneList, sampleList, fetchSampleList, metaList, fetchMetaList} = useSampleGeneMetaStore()
    const {setDataset, loading, error} = useSampleGeneMetaStore()
    const {
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

    const plotData = {}
    // Load dataset-specific data when datasets change
    useEffect(() => {
        datasets.forEach((dataset) => {
            if (dataset.id && dataset.id !== "") {
                if (!(dataset.id in plotData)) {
                    plotData[dataset.id] = {}
                    // Fetch gene and sample lists for this dataset
                    fetchGeneList(dataset.id)
                    plotData[dataset.id]["genelist"] = geneList

                    fetchSampleList(dataset.id)
                    plotData[dataset.id]["samplelist"] = sampleList

                    fetchMetaList(dataset.id)
                    plotData[dataset.id]["metadatalist"] = metaList

                    if (dataset.sample && dataset.sample !== "") {
                        setDataset(dataset.id)
                        useSampleGeneMetaStore.setState({
                            selectedSamples: [dataset.sample],
                            selectedGenes: [...dataset.features],
                        })
                        fetchExprData()
                        fetchImageData()
                        fetchMetaDataOfSample()
                    }
                }
            }
        })
    }, [datasets])

    console.log("Datasets:", datasets);

    // Update URL params when state changes
    useEffect(() => {
        const newParams = new URLSearchParams()

        // Add dataset params
        datasets.forEach((dataset, index) => {
            if (dataset.id) {
                newParams.set(`dataset${index}`, dataset.id)
                if (dataset.sample) {
                    newParams.set(`sample${index}`, dataset.sample)
                }
                dataset.features.forEach((feature) => {
                    newParams.append(`features${index}`, feature)
                })
                newParams.set(`plottype${index}`, dataset.plotType)
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
        const newDatasets = [...datasets]
        newDatasets[index] = {...newDatasets[index], id: newDatasetId, sample: "", features: []}
        setDatasets(newDatasets)
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

        datasets.forEach((dataset) => {
            if (dataset.id && dataset.sample) {
                setDataset(dataset.id)
                useSampleGeneMetaStore.setState({
                    selectedSamples: [dataset.sample],
                    selectedGenes: [...dataset.features],
                })
                fetchExprData()
                fetchImageData()
                fetchMetaDataOfSample()
            }
        })
    }

    // Refresh a specific dataset
    const handleRefreshDataset = (index) => {
        const dataset = datasets[index]
        if (dataset.id && dataset.sample) {
            // Set this specific dataset to loading state
            const newDatasets = [...datasets]
            newDatasets[index] = {...newDatasets[index], isLoading: true}
            setDatasets(newDatasets)

            setDataset(dataset.id)
            useSampleGeneMetaStore.setState({
                selectedSamples: [dataset.sample],
                selectedGenes: [...dataset.features],
            })
            fetchExprData()
            fetchImageData()
            fetchMetaDataOfSample()
        }
    }

    // Get all available features (genes + meta) for a dataset
    const getAvailableFeaturesForDataset = () => {
        const excludedKeys = new Set(["cs_id", "sample_id", "Cell", "Spot", "UMAP_1", "UMAP_2"])
        const metaOptions = metaList ? metaList.filter((option) => !excludedKeys.has(option)) : []
        return [...(geneList || []), ...metaOptions]
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
                return "33.33%"
            case 4:
                return "25%"
            default:
                return "50%" // Default to 50% for two columns
        }
    }

    // Get available plot types for a dataset
    const getAvailablePlotTypes = (datasetId) => {
        if (!datasetId) return ["auto"]

        const datasetType = getDatasetType(datasetRecords,datasetId)

        if (datasetType === "VisiumST") {
            // return ["auto","umap", "visium", "both"]
            return ["umap", "visium"]
        } else {
            return ["umap"]
        }
    }

    return (
        <div className="plot-page-container" style={{display: "flex", flexDirection: "column", flex: 1}}>
            {/* Title Row */}
            <Box className="title-row" sx={{display: "flex", justifyContent: "space-between", alignItems: "center"}}>
                <Typography variant="h6">Multi-Dataset Feature Comparison</Typography>
                <Box>
                    <Tooltip title="Add Dataset (Max 4)">
                        <span>
                          <IconButton color="primary" onClick={handleAddDataset} disabled={datasets.length >= 4}
                                      size="small">
                            <AddIcon/>
                          </IconButton>
                        </span>
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
                                <Box sx={{display: "flex", justifyContent: "space-between", alignItems: "center", mb: 1,}}>
                                    <Typography variant="subtitle1">Dataset {index + 1}: </Typography>
                                    {/* Dataset Selection */}
                                    <Autocomplete size="small"
                                        options={datasetRecords.map((d) => d.dataset_id) || []}
                                        value={dataset.id}
                                        onChange={(event, newValue) => handleDatasetChange(index, newValue)}
                                        sx={{
                                            flex: 1, pr: 2, pl: 2,
                                            "& .MuiInputBase-root": {height: "30px",},
                                            "& .MuiAutocomplete-input": {padding: "2px 4px !important",},
                                        }}
                                        renderInput={(params) => (
                                            <TextField {...params} placeholder="Select dataset" variant="standard"/>
                                        )}
                                    />
                                    <Box>
                                        {datasets.length > 1 && (
                                            <IconButton size="small" color="error"
                                                        onClick={() => handleRemoveDataset(index)}>
                                                <DeleteIcon fontSize="small"/>
                                            </IconButton>
                                        )}
                                        <IconButton size="small" color="primary"
                                                    onClick={() => handleRefreshDataset(index)}
                                                    disabled={!dataset.id || !dataset.sample || dataset.isLoading}
                                        >
                                            <RefreshIcon fontSize="small"/>
                                        </IconButton>
                                    </Box>
                                </Box>

                                {/* Sample Selection Row */}
                                <Box sx={{display: "flex", alignItems: "center", mb: 1}}>
                                    <Typography variant="subtitle1" sx={{minWidth: "80px"}}>Sample:{" "}</Typography>
                                    <Autocomplete size="small"
                                        sx={{
                                            flex: 1,
                                            "& .MuiInputBase-root": {height: "30px", marginTop: "0px"},
                                            "& .MuiAutocomplete-input": {padding: "2px 4px !important"},
                                        }}
                                        options={sampleList || []}
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

                                {/* Plot Type Selection Row */}
                                <Box sx={{display: "flex", alignItems: "center", mb: 1}}>
                                    <Typography variant="subtitle1" sx={{minWidth: "80px"}}>Plot Type:{" "}</Typography>
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
                                                    {type === "auto" ? "Auto" : type === "umap" ? "UMAP" : type === "visium" ? "Visium" : "Both UMAP & Visium"}
                                                </MenuItem>
                                            ))}
                                        </Select>
                                    </FormControl>
                                </Box>

                                {/* Feature Selection */}
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
                                        options={getAvailableFeaturesForDataset()}
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
                                    <Box sx={{
                                        position: "absolute",
                                        top: 0, left: 0, right: 0, bottom: 0,
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
                                                        <Box sx={{
                                                            height: 250,
                                                            mb: effectivePlotType === "both" ? 2 : 0,
                                                        }}>
                                                            <Typography variant="caption"
                                                                        sx={{display: "block", mb: 1}}>
                                                                UMAP View
                                                            </Typography>
                                                            {imageDataDict[dataset.sample] && sampleMetaDict[dataset.sample] ? (
                                                                <div>
                                                                    {/* Replace with your actual UMAP component */}
                                                                    <Box sx={{
                                                                        height: 220,
                                                                        bgcolor: "#f0f0f0",
                                                                        display: "flex",
                                                                        justifyContent: "center",
                                                                        alignItems: "center",
                                                                    }}>
                                                                        UMAP Plot for {feature}
                                                                    </Box>
                                                                </div>
                                                            ) : (
                                                                <Box sx={{
                                                                    display: "flex",
                                                                    justifyContent: "center",
                                                                    alignItems: "center",
                                                                    height: "100%",
                                                                    bgcolor: "#f5f5f5",
                                                                    borderRadius: 1,
                                                                }}>
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
                                                                <Box sx={{
                                                                    display: "flex",
                                                                    justifyContent: "center",
                                                                    alignItems: "center",
                                                                    height: "100%",
                                                                    bgcolor: "#f5f5f5",
                                                                    borderRadius: 1,
                                                                }}>
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
                                        <Box sx={{
                                            display: "flex",
                                            justifyContent: "center",
                                            alignItems: "center",
                                            height: 200,
                                            bgcolor: "#f5f5f5",
                                            borderRadius: 1,
                                        }}>
                                            <Typography variant="body1" color="text.secondary">
                                                No features selected
                                            </Typography>
                                        </Box>
                                    )
                                ) : (
                                    <Box sx={{
                                        display: "flex",
                                        justifyContent: "center",
                                        alignItems: "center",
                                        height: 200,
                                        bgcolor: "#f5f5f5",
                                        borderRadius: 1,
                                    }}>
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

