import {useEffect, useState} from "react";
import {Box, Typography, Divider, Button, Link} from "@mui/material";

import FilterPanel from "./FilterPanel";
import DatasetDisplay from "./DatasetDisplay.jsx";
import "./DatasetPage.css";
import useDatatableStore from "../../store/DatatableStore.js";
import {useSearchParams} from "react-router-dom";

const DatasetsPage = () => {
    const {datasetRecords, fetchDatasetList} = useDatatableStore();
    const [searchParams, setSearchParams] = useSearchParams();

    // Initialize filters from URL params
    const [selectedFilters, setSelectedFilters] = useState({
        assayType: searchParams.getAll("assayType") || [],
        brainRegion: searchParams.getAll("brainRegion") || [],
        organism: searchParams.getAll("organism") || [],
        disease: searchParams.getAll("disease") || [],
    })

    useEffect(() => {
        fetchDatasetList()
    }, [fetchDatasetList]);

    // Update URL when filters change
    useEffect(() => {
        const newSearchParams = new URLSearchParams()

        Object.entries(selectedFilters).forEach(([key, values]) => {
            values.forEach((value) => {
                if (value) newSearchParams.append(key, value)
            })
        })

        setSearchParams(newSearchParams, {replace: true})
    }, [selectedFilters, setSearchParams])

    // Handle filter changes
    const handleFilterChange = (filterType, option, checked) => {
        setSelectedFilters((prev) => ({
            ...prev,
            [filterType]: checked ? [...prev[filterType], option] : prev[filterType].filter((item) => item !== option),
        }))
    }

    // Clear all filters
    const clearAllFilters = () => {
        setSelectedFilters({
            assayType: [],
            brainRegion: [],
            organism: [],
            disease: [],
        })
    }

    // Apply filters to dataset records
    const getFilteredRecords = () => {
        return datasetRecords.filter((record) => {
            // Check assay type filter
            if (selectedFilters.assayType.length > 0 && !selectedFilters.assayType.includes(record.assay)) {
                return false
            }

            // Check brain region filter
            if (selectedFilters.brainRegion.length > 0 && !selectedFilters.brainRegion.includes(record.brain_super_region)) {
                return false
            }

            // Check organism filter (assuming you have organism field in your data)
            if (selectedFilters.organism.length > 0 && record.organism && !selectedFilters.organism.includes(record.organism)) {
                return false
            }

            // Check disease filter (assuming you have disease field in your data)
            if (selectedFilters.disease.length > 0 && record.disease && !selectedFilters.disease.includes(record.disease)) {
                return false
            }

            return true
        })
    }

    const filteredRecords = getFilteredRecords()
    const hasActiveFilters = Object.values(selectedFilters).some((filters) => filters.length > 0)


    return (
        <div className="data-page-container" style={{display: 'flex', flexDirection: 'column', flex: 1}}>
            {/* Title Row */}
            <Box className="title-row" sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Typography variant="h4">
                    All datasets
                    {hasActiveFilters && (
                        <Typography component="span" variant="body2" sx={{ml: 2, color: "text.secondary"}}>
                            ({filteredRecords.length} of {datasetRecords.length} datasets)
                        </Typography>
                    )}
                </Typography>
                {/* Right-side Add Button */}
                <Button variant="contained" color="primary">
                    <Link href="/datasetmanager" color="inherit" underline="hover">+ Add a dataset</Link>
                </Button>
            </Box>
            <Divider/>

            {/* Main Content */}
            <Box className="main-content" style={{flex: 2, display: 'flex', flexDirection: 'row'}}>
                {/* Left Filter Panel */}
                <FilterPanel
                    selectedFilters={selectedFilters}
                    onFilterChange={handleFilterChange}
                    onClearAll={clearAllFilters}
                    hasActiveFilters={hasActiveFilters}
                />
                {/* Right Sample Display Area */}
                <DatasetDisplay dataRecords={filteredRecords}/>
            </Box>
        </div>
    );
};

export default DatasetsPage;
