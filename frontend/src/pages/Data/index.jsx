import {useEffect} from "react";
import {Box, Typography, Divider} from "@mui/material";

import FilterPanel from "./FilterPanel";
import DataDisplay from "./DataDisplay";
import "./DataPage.css";
import useDataStore from "../../store/DataStore.js";
import {useParams} from "react-router-dom";

const DataPage = () => {
    // get project_id from url
    // const project_id = window.location.pathname.split("/")[2];
    const { project_id } = useParams(); // Extracts project_id from the URL

    const {sampleRecords,fetchSampleData} = useDataStore();
    useEffect(() => {
        fetchSampleData({project_id})
    }, [fetchSampleData]);

    return (
        <div className="data-page-container" style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
            {/* Title Row */}
            <Box className="title-row">
                <Typography variant="h4">Explore data resources
                </Typography>
            </Box>
            <Divider />

            {/* Main Content */}
            <Box className="main-content" style={{ flex: 2, display: 'flex', flexDirection: 'row' }}>
                {/* Left Filter Panel */}
                <FilterPanel />
                {/* Right Data Display Area */}
                <DataDisplay dataRecords={sampleRecords} />
            </Box>
        </div>
    );
};

export default DataPage;
