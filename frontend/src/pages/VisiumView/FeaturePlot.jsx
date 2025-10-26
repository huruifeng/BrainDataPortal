import React from "react";
import {Box, Typography} from "@mui/material";
import PropTypes from "prop-types";
import PlotlyFeaturePlotMerfish from "./MerfishPlotlyPlot.jsx";
import PlotlyFeaturePlotVisium from "./VisiumPlotlyPlot.jsx";

const FeaturePlot = React.memo(function FeaturePlot({assayType, visiumData, geneData, metaData, feature}) {
    console.log("FeaturePlot", assayType);
    if (assayType.toLowerCase() === "visiumst") {
        return <PlotlyFeaturePlotVisium visiumData={visiumData} geneData={geneData} metaData={metaData} feature={feature}/>;
    } else if (assayType.toLowerCase() === "merfish") {
        // return <PlotlyFeaturePlotMerfish visiumData={visiumData} geneData={geneData} metaData={metaData} feature={feature}/>;
        return (
            <Box className="no-feature">
                <Typography sx={{color: "text.secondary"}} variant="h5">
                    MERFIS Hplot
                </Typography>
            </Box>
        )
    } else {
        return (
            <Box className="no-feature">
                <Typography sx={{color: "text.secondary"}} variant="h5">
                    Assay type not set correctly!
                </Typography>
            </Box>
        )
    }
});

FeaturePlot.propTypes = {
    assayType: PropTypes.string.isRequired,
    visiumData: PropTypes.shape({
        coordinates: PropTypes.object.isRequired,
        scales: PropTypes.object.isRequired,
        image: PropTypes.instanceOf(Blob).isRequired
    }).isRequired,
    geneData: PropTypes.object.isRequired,
    metaData: PropTypes.object.isRequired,
    feature: PropTypes.string.isRequired
};

export default FeaturePlot;
