import {useEffect} from "react";
import {Box, Typography, Divider} from "@mui/material";

import FilterPanel from "./FilterPanel";
import ProjectDisplay from "./ProjectDisplay.jsx";
import "./ProjectPage.css";
import useDataStore from "../../store/DataStore.js";

const ProjectsPage = () => {
    const {projectRecords,fetchProjectTable} = useDataStore();
    useEffect(() => {
        fetchProjectTable()
    }, [fetchProjectTable]);

    return (
        <div className="data-page-container" style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
            {/* Title Row */}
            <Box className="title-row">
                <Typography variant="h4">All projects
                </Typography>
            </Box>
            <Divider />

            {/* Main Content */}
            <Box className="main-content" style={{ flex: 2, display: 'flex', flexDirection: 'row' }}>
                {/* Left Filter Panel */}
                <FilterPanel />
                {/* Right Data Display Area */}
                <ProjectDisplay dataRecords={projectRecords} />
            </Box>
        </div>
    );
};

export default ProjectsPage;
