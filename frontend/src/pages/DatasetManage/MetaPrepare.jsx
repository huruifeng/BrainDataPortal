import {useState, useEffect} from "react";
import {
    Box,
    Typography,
    Card,
    CardContent,
    Select,
    MenuItem,
    InputLabel,
    FormControl,
    Checkbox,
    ListItemText,
    Button,
    Grid
} from "@mui/material";
import useDatasetManageStore from "../../store/DatasetManageStore.js";
import axios from "axios";

const MetaPrepare = () => {
    const {datasetName, metaFeatures, fetchMetaFeatures} = useDatasetManageStore();
    const [selectedFeatures, setSelectedFeatures] = useState([]);
    const [majorCellType, setMajorCellType] = useState("");
    const [conditionColumn, setConditionColumn] = useState("");
    const [sampleIDColumn, setSampleIDColumn] = useState("");
    const [loading, setLoading] = useState(false);

    // Fetch the meta features list when the page loads
    useEffect(() => {
        if (datasetName) {
            setLoading(true);
            fetchMetaFeatures(datasetName).finally(() => setLoading(false));
        }
    }, [datasetName, fetchMetaFeatures]);

    const handleFeatureChange = (event) => {
        const {value} = event.target;
        if (value.length <= 10) {
            setSelectedFeatures(value);
        }
    };

    const handleSubmit = () => {
        // Prepare the selected values to send to the backend
        const metaData = {
            dataset: datasetName,
            selected_features: selectedFeatures,
            major_cell_type: majorCellType,
            condition_column: conditionColumn,
        };

        axios
        .post("/api/prepare-meta", metaData)
        .then((response) => {
            console.log("Meta data prepared successfully", response.data);
        })
        .catch((error) => {
            console.error("Error preparing meta data:", error);
        });
    };

    return (
        <Box sx={{pb: 4}}>
            <Typography variant="h5" gutterBottom>Meta Preparation</Typography>

            {/* Dataset Selection */}
            <Card elevation={0} sx={{m: 0, p:0}}>
                <CardContent sx={{pl: 2}}>
                    <Typography variant="p" gutterBottom>Select dataset</Typography>
                    <FormControl fullWidth>
                        <InputLabel id="dataset-select-label">Dataset</InputLabel>
                        <Select
                            labelId="dataset-select-label"
                            value={datasetName}
                            size={"small"}
                            label="Dataset"
                            disabled
                        >
                            <MenuItem value={datasetName}>{datasetName}</MenuItem>
                        </Select>
                    </FormControl>
                </CardContent>
            </Card>

            {/* Meta Features Selection */}
            <Card elevation={0} sx={{mb: 0}}>
                <CardContent>
                    <Typography variant="p" gutterBottom>Select Meta Features (up to 10)</Typography>
                    <FormControl fullWidth>
                        <Select
                            multiple
                            size={"small"}
                            value={selectedFeatures}
                            onChange={handleFeatureChange}
                            renderValue={(selected) => selected.join(", ")}
                            MenuProps={{
                                PaperProps: {
                                    style: {
                                        maxHeight: 200,
                                    },
                                },
                            }}
                        >
                            {metaFeatures.map((feature) => (
                                <MenuItem key={feature} value={feature}>
                                    <Checkbox checked={selectedFeatures.indexOf(feature) > -1}/>
                                    <ListItemText primary={feature}/>
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </CardContent>
            </Card>

            {/* Major Cell Type and Condition Column Selection */}
            <Grid container spacing={2} sx={{mb: 6}}>
                <Grid item xs={4}>
                    <Card elevation={0}>
                        <CardContent>
                            <Typography variant="p" gutterBottom>Select SampleID Column</Typography>
                            <FormControl fullWidth>
                                <Select
                                    value={sampleIDColumn}
                                    size={"small"}
                                    onChange={(e) => setSampleIDColumn(e.target.value)}
                                    displayEmpty
                                >
                                    <MenuItem value="">None</MenuItem>
                                    {metaFeatures.map((feature) => (
                                        <MenuItem key={feature} value={feature}>
                                            {feature}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={4}>
                    <Card elevation={0}>
                        <CardContent>
                            <Typography variant="p" gutterBottom>Select Major Cell Type</Typography>
                            <FormControl fullWidth>
                                <Select
                                    value={majorCellType}
                                    size={"small"}
                                    onChange={(e) => setMajorCellType(e.target.value)}
                                    displayEmpty

                                >
                                    <MenuItem value="">None</MenuItem>
                                    {metaFeatures.map((feature) => (
                                        <MenuItem key={feature} value={feature}>
                                            {feature}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={4}>
                    <Card elevation={0}>
                        <CardContent>
                            <Typography variant="p" gutterBottom>Select Condition Column</Typography>
                            <FormControl fullWidth>
                                <Select
                                    value={conditionColumn}
                                    size={"small"}
                                    onChange={(e) => setConditionColumn(e.target.value)}
                                    displayEmpty
                                >
                                    <MenuItem value="">None</MenuItem>
                                    {metaFeatures.map((feature) => (
                                        <MenuItem key={feature} value={feature}>
                                            {feature}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>

            {/* Submit Button */}
            <Box sx={{display: "flex", justifyContent: "center"}}>
                <Button
                    variant="contained"
                    color="primary"
                    onClick={handleSubmit}
                    disabled={selectedFeatures.length < 1 || !majorCellType || !conditionColumn || loading}
                >
                    {loading ? "Processing..." : "Submit"}
                </Button>
            </Box>
        </Box>
    );
};

export default MetaPrepare;
