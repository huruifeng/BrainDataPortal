import {useEffect} from "react";
import {Box, Typography, Paper, Card, CardContent, LinearProgress, Container} from "@mui/material";
import useDatasetManageStore from "../../store/DatasetManageStore.js";

const ExtractInfoProcess = () => {
    const {datasetName, processingStatus, fetchExtractSeuratStatus,} = useDatasetManageStore();

    useEffect(() => {
        const interval = setInterval(() => {
            fetchExtractSeuratStatus(datasetName);
            // Stop polling if log indicates completion
            if (processingStatus.log && /Done!/.test(processingStatus.log)) {
                clearInterval(interval);
            }
        }, 5000); // fetch every 5 seconds

        return () => clearInterval(interval); // cleanup
    }, [datasetName]);

    const getMessageColor = (type) => {
        switch (type) {
            case "failed":
                return "error.main"
            case "processing":
                return "text.primary"
            case "completed":
                return "success.main"
            default:
                return "text.primary"
        }
    }

    return (
        <Box sx={{pb: 4, pt: 0}}>
            <Typography variant="h5" gutterBottom>Extracting data from Seurat</Typography>
            {/* Processing Output Section */}
            <Card elevation={2} sx={{mt: 2}}>
                <CardContent>
                    <Box sx={{p: 0}}>
                        {processingStatus.status !== "idle" && (
                            <Box sx={{width: "100%", mb: 2}}>
                                <Box sx={{display: "flex", alignItems: "center", mb: 1}}>
                                    <Typography variant="h6"
                                                sx={{mr: 1, color: getMessageColor(processingStatus.status)}}>
                                        {processingStatus.status === "processing" ? "Processing:"
                                            : processingStatus.status === "completed" ? "Completed:" : "Failed:"}
                                    </Typography>
                                </Box>
                                <LinearProgress
                                    variant={processingStatus.status === "processing" ? "indeterminate" : "determinate"}
                                    color={processingStatus.status === "completed" ? "success"
                                        : processingStatus.status === "failed" ? "error" : "primary"
                                    }
                                />
                            </Box>
                        )}

                        <Paper
                            variant="outlined"
                            sx={{
                                p: 1,
                                height: "600px",
                                overflowY: "auto",
                                bgcolor: "grey.900",
                                fontFamily: "monospace",
                                fontSize: "1.2rem",
                                color: "common.white",
                                whiteSpace: "pre-wrap",
                            }}>
                            <Box sx={{mb: 1}}>
                                <Typography component="span" variant="body1">
                                    {processingStatus.log || "Waiting for logs..."}
                                </Typography>
                            </Box>

                        </Paper>
                    </Box>
                </CardContent>
            </Card>
        </Box>
    );
};

export default ExtractInfoProcess;
