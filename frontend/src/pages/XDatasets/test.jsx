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
import useDataStore from "../../store/DatatableStore.js"
import {toast} from "react-toastify"
import PlotlyFeaturePlot from "../VisiumView/VisiumPlotlyPlot.jsx"

function getDatasetType(datasetRecords, datasetId) {
    return datasetRecords.find(d => d.dataset_id === datasetId)?.assay
}

function XDatasetsView() {
    const [plotData, setPlotData] = useState({})
    const [queryParams, setQueryParams] = useSearchParams()

    const [datasets, setDatasets] = useState(() => {
        const initialDatasets = []
        let i = 0
        while (queryParams.get(`dataset${i}`) !== null) {
            initialDatasets.push({
                id: queryParams.get(`dataset${i}`) || "",
                sample: queryParams.get(`sample${i}`) || "",
                features: queryParams.getAll(`features${i}`) || [],
                plotType: queryParams.get(`plottype${i}`) || "auto",
                isLoading: false,
            })
            i++
        }
        return initialDatasets.length > 0 ? initialDatasets : [
            {id: "", sample: "", features: [], plotType: "auto", isLoading: false},
            {id: "", sample: "", features: [], plotType: "auto", isLoading: false}
        ]
    })

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

    useEffect(() => {
        fetchDatasetList()
    }, [])

    useEffect(() => {
        if (!loading) {
            setDatasets(prev => prev.map(d => ({...d, isLoading: false})))
        }
    }, [loading])

    const loadDatasetData = async (datasetId) => {
        if (!datasetId || plotData[datasetId]?.loaded) return

        try {
            setDataset(datasetId)

            const updatePlotData = (key, data) => setPlotData(prev => ({
                ...prev,
                [datasetId]: {
                    ...prev[datasetId],
                    [key]: data,
                    loaded: Boolean(
                        (key === 'genelist' ? data : prev[datasetId]?.genelist) &&
                        (key === 'samplelist' ? data : prev[datasetId]?.samplelist) &&
                        (key === 'metalist' ? data : prev[datasetId]?.metalist)
                    )
                }
            }))

            if (!plotData[datasetId]?.genelist) {
                await fetchGeneList(datasetId)
                updatePlotData('genelist', useSampleGeneMetaStore.getState().geneList)
            }

            if (!plotData[datasetId]?.samplelist) {
                await fetchSampleList(datasetId)
                updatePlotData('samplelist', useSampleGeneMetaStore.getState().sampleList)
            }

            if (!plotData[datasetId]?.metalist) {
                await fetchMetaList(datasetId)
                updatePlotData('metalist', useSampleGeneMetaStore.getState().metaList)
            }

            if (!plotData[datasetId]?.allmetadata) {
                await fetchAllMetaData(datasetId)
                setPlotData(prev => ({
                    ...prev,
                    [datasetId]: {
                        ...prev[datasetId],
                        allmetadata: useSampleGeneMetaStore.getState().allMetaData
                    }
                }))
            }

        } catch (error) {
            console.error(`Error loading ${datasetId}:`, error)
        }
    }

    useEffect(() => {
        datasets.forEach(d => {
            if (d.id && !plotData[d.id]?.loaded) {
                loadDatasetData(d.id)
            }
        })
    }, [datasets.map(d => d.id)])

    useEffect(() => {
        const newParams = new URLSearchParams()
        datasets.forEach((dataset, index) => {
            if (dataset.id) {
                newParams.set(`dataset${index}`, dataset.id)
                if (dataset.sample) newParams.set(`sample${index}`, dataset.sample)
                dataset.features.forEach(f => newParams.append(`features${index}`, f))
                newParams.set(`plottype${index}`, dataset.plotType)
            }
        })
        setQueryParams(newParams)
    }, [datasets])

    const handleAddDataset = () => {
        if (datasets.length < 4) {
            setDatasets([...datasets, {id: "", sample: "", features: [], plotType: "auto", isLoading: false}])
        } else {
            toast.info("Maximum of 4 datasets allowed.")
        }
    }

    const handleRemoveDataset = (index) => {
        const newDatasets = [...datasets]
        newDatasets.splice(index, 1)
        setDatasets(newDatasets)
    }

    const handleDatasetChange = (index, newDatasetId) => {
        if (datasets[index].id === newDatasetId) return
        const newDatasets = [...datasets]
        newDatasets[index] = {...newDatasets[index], id: newDatasetId, sample: "", features: []}
        setDatasets(newDatasets)
    }

    const handleSampleChange = (index, newSample) => {
        const newDatasets = [...datasets]
        newDatasets[index] = {...newDatasets[index], sample: newSample}
        setDatasets(newDatasets)
    }

    const handleFeaturesChange = (index, newFeatures) => {
        const newDatasets = [...datasets]
        newDatasets[index] = {...newDatasets[index], features: newFeatures}
        setDatasets(newDatasets)
    }

    const handlePlotTypeChange = (index, newPlotType) => {
        const newDatasets = [...datasets]
        newDatasets[index] = {...newDatasets[index], plotType: newPlotType}
        setDatasets(newDatasets)

        const dataset = newDatasets[index]
        if (newPlotType === "umap" && dataset.id && !plotData[dataset.id]?.umapData) {
            setDataset(dataset.id)
            fetchUMAPData(dataset.id).then(() => {
                setPlotData(prev => ({
                    ...prev,
                    [dataset.id]: {
                        ...prev[dataset.id],
                        umapdata: useSampleGeneMetaStore.getState().umapData
                    }
                }))
            })
        }
    }

    const handleRefreshPlots = () => {
        setDatasets(prev => prev.map(d => ({
            ...d,
            isLoading: d.id && d.sample ? true : false
        })))
    }

    const handleRefreshDataset = (index) => {
        const dataset = datasets[index]
        if (dataset.id && dataset.sample) {
            const newDatasets = [...datasets]
            newDatasets[index] = {...newDatasets[index], isLoading: true}
            setDatasets(newDatasets)
        }
    }

    const getAvailableFeaturesForDataset = (datasetId) => {
        const data = plotData[datasetId] || {}
        const excludedKeys = new Set(["cs_id", "sample_id", "Cell", "Spot", "UMAP_1", "UMAP_2"])
        return [
            ...(data.genelist || []),
            ...(data.metalist || []).filter(k => !excludedKeys.has(k))
        ]
    }

    const getAvailableSamplesForDataset = (datasetId) => {
        return plotData[datasetId]?.samplelist || []
    }

    const getEffectivePlotType = (datasetId, userSelectedType) => {
        if (!datasetId) return null
        const datasetType = getDatasetType(datasetRecords, datasetId)
        return userSelectedType === "auto"
            ? datasetType === "VisiumST" ? "visium" : "umap"
            : userSelectedType
    }

    const getColumnWidth = () => {
        switch (datasets.length) {
            case 1: return "100%"
            case 2: return "50%"
            case 3: return "33.3333%"
            case 4: return "25%"
            default: return "50%"
        }
    }

    const getAvailablePlotTypes = (datasetId) => {
        if (!datasetId) return ["auto"]
        const datasetType = getDatasetType(datasetRecords, datasetId)
        return datasetType === "VisiumST" ? ["umap", "visium"] : ["umap"]
    }

    return (
        <div className="plot-page-container" style={{display: "flex", flexDirection: "column", flex: 1}}>
            <Box className="title-row" sx={{display: "flex", justifyContent: "space-between", alignItems: "center"}}>
                <Typography variant="h6">Multi-Dataset Feature Comparison</Typography>
                <Box>
                    <Tooltip title="Add Dataset (Max 4)">
                        <IconButton color="primary" onClick={handleAddDataset} disabled={datasets.length >= 4} size="small">
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

            <Box sx={{display: "flex", flex: 1, overflow: "auto"}}>
                {error && (
                    <Box sx={{p: 2, width: "100%"}}>
                        <Typography color="error">{error}</Typography>
                    </Box>
                )}

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
                        >
                            <Paper elevation={1} sx={{p: 1, mb: 2}}>
                                <Box sx={{display: "flex", justifyContent: "space-between", alignItems: "center", mb: 1}}>
                                    <Typography variant="subtitle1">Dataset {index + 1}: </Typography>
                                    <Autocomplete
                                        size="small"
                                        options={datasetRecords.map(d => d.dataset_id) || []}
                                        value={dataset.id}
                                        onChange={(e, newValue) => handleDatasetChange(index, newValue)}
                                        sx={{
                                            flex: 1,
                                            pr: 2,
                                            pl: 2,
                                            "& .MuiInputBase-root": {height: "30px"},
                                            "& .MuiAutocomplete-input": {padding: "2px 4px !important"},
                                        }}
                                        renderInput={params => <TextField {...params} placeholder="Select dataset" variant="standard"/>}
                                    />
                                    <Box>
                                        {datasets.length > 1 && (
                                            <IconButton size="small" color="error" onClick={() => handleRemoveDataset(index)}>
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

                                <Box sx={{display: "flex", alignItems: "center", mb: 1}}>
                                    <Typography variant="subtitle1" sx={{minWidth: "80px"}}>Plot Type: </Typography>
                                    <FormControl fullWidth size="small" disabled={!dataset.id} sx={{flex: 1}}>
                                        <Select
                                            value={dataset.plotType}
                                            displayEmpty
                                            variant="standard"
                                            sx={{height: "30px", "& .MuiSelect-select": {padding: "2px 8px"}}}
                                            onChange={e => handlePlotTypeChange(index, e.target.value)}
                                        >
                                            {getAvailablePlotTypes(dataset.id).map(type => (
                                                <MenuItem key={type} value={type}>
                                                    {type === "auto" ? "Auto" :
                                                     type === "umap" ? "UMAP" :
                                                     "Visium"}
                                                </MenuItem>
                                            ))}
                                        </Select>
                                    </FormControl>
                                </Box>

                                <Box sx={{display: "flex", alignItems: "center", mb: 1}}>
                                    <Typography variant="subtitle1" sx={{minWidth: "80px"}}>Sample: </Typography>
                                    <Autocomplete
                                        size="small"
                                        sx={{
                                            flex: 1,
                                            "& .MuiInputBase-root": {height: "30px", marginTop: "0px"},
                                            "& .MuiAutocomplete-input": {padding: "2px 4px !important"},
                                        }}
                                        options={getAvailableSamplesForDataset(dataset.id)}
                                        value={dataset.sample}
                                        onChange={(e, newValue) => handleSampleChange(index, newValue)}
                                        disabled={!dataset.id}
                                        renderInput={params => (
                                            <TextField
                                                {...params}
                                                placeholder="Select sample"
                                                variant="standard"
                                                InputLabelProps={{shrink: false}}
                                            />
                                        )}
                                    />
                                </Box>

                                <Box sx={{display: "flex", alignItems: "flex-start", mb: 1}}>
                                    <Typography variant="subtitle1" sx={{minWidth: "80px", mt: 0.5}}>Features: </Typography>
                                    <Autocomplete
                                        multiple
                                        size="small"
                                        sx={{
                                            flex: 1,
                                            "& .MuiInputBase-root": {minHeight: "32px", marginTop: "0px"},
                                            "& .MuiAutocomplete-input": {padding: "2px 4px !important"},
                                        }}
                                        options={getAvailableFeaturesForDataset(dataset.id)}
                                        value={dataset.features}
                                        onChange={(e, newValue) => handleFeaturesChange(index, newValue)}
                                        disabled={!dataset.id}
                                        renderTags={(value, getTagProps) =>
                                            value.map((option, i) => (
                                                <Chip
                                                    key={option}
                                                    label={option}
                                                    {...getTagProps({index: i})}
                                                    color="primary"
                                                    size="small"
                                                    onDelete={() => handleFeaturesChange(index, value.filter(f => f !== option))}
                                                />
                                            ))
                                        }
                                        renderInput={params => (
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

                            <Box sx={{flex: 1, overflow: "auto", position: "relative"}}>
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
                                        <Typography variant="body2" sx={{mt: 2}}>Loading data...</Typography>
                                    </Box>
                                )}

                                {dataset.id && dataset.sample ? (
                                    dataset.features.length > 0 ? (
                                        dataset.features.map(feature => {
                                            const effectivePlotType = getEffectivePlotType(dataset.id, dataset.plotType)
                                            return (
                                                <Paper key={`${dataset.id}-${feature}`} sx={{p: 1, mb: 2}}>
                                                    <Typography variant="body2" sx={{mb: 1, fontWeight: "bold"}}>
                                                        {feature}
                                                    </Typography>

                                                    {(effectivePlotType === "umap" || effectivePlotType === "both") && (
                                                        <Box sx={{height: 250, mb: effectivePlotType === "both" ? 2 : 0}}>
                                                            <Typography variant="caption" sx={{display: "block", mb: 1}}>
                                                                UMAP View
                                                            </Typography>
                                                            {imageDataDict[dataset.sample] && sampleMetaDict[dataset.sample] ? (
                                                                <Box sx={{
                                                                    height: 220,
                                                                    bgcolor: "#f0f0f0",
                                                                    display: "flex",
                                                                    justifyContent: "center",
                                                                    alignItems: "center",
                                                                }}>
                                                                    UMAP Plot for {feature}
                                                                </Box>
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

                                                    {(effectivePlotType === "visium" || effectivePlotType === "both") && (
                                                        <Box sx={{height: 250}}>
                                                            <Typography variant="caption" sx={{display: "block", mb: 1}}>
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