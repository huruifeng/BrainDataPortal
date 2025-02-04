import { useState } from "react";
import { Typography, Divider, Checkbox, FormControlLabel } from "@mui/material";
import {ExpandLess, ExpandMore} from "@mui/icons-material";
import "./FilterPanel.css";
import useDataStore from "../../store/DataStore.js";
import {getData_get} from "../../api/api.js";

const FilterPanel = () => {
    const [expandedFilters, setExpandedFilters] = useState({
        assayType: true,
        organism: false,
        cell: false,
        sex: false,
    });

    const {datarecords, setDatarecords } = useDataStore();

    const fetchData = async (data_id="all") => {
        try {
            const response = await getData_get(data_id);
            console.log(response);
            const data = await response.data.json();
            setDatarecords(data);
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    };

    fetchData();

    const toggleFilter = (filter) => {
        setExpandedFilters((prev) => ({
            ...prev,
            [filter]: !prev[filter],
        }));
    };

    const filters = [
        {
            title: "Assay Type",
            options: ["DNA Binding", "Transcription", "RNA Binding", "Single Cell"],
            key: "assayType",
        },
        {
            title: "Organism",
            options: ["Homo Sapiens", "Mus Musculus", "Drosophila", "C. Elegans"],
            key: "organism",
        },
        {
            title: "Cell",
            options: ["T Cell", "B Cell", "Stem Cell", "Epithelial Cell"],
            key: "cell",
        },
        {
            title: "Sex",
            options: ["Male", "Female", "Unknown"],
            key: "sex",
        },
    ];

    return (
        <div className="filter-panel">
            <div className="panel-title">
                <Typography variant="h6">Data filters</Typography>
            </div>
            {filters.map((filter, index) => (
                <div key={filter.key} className="filter-section">
                    {/* Filter Header */}
                    <div className="filter-header" onClick={() => toggleFilter(filter.key)}>
                        <Typography variant="subtitle1">{filter.title}</Typography>
                        <span className="toggle-icon">
                             {expandedFilters[filter.key] ? <ExpandLess /> : <ExpandMore />}
                        </span>
                    </div>

                    {/* Filter Options */}
                    {expandedFilters[filter.key] && (
                        <div className="filter-options">
                            {filter.options.map((option, idx) => (
                                <FormControlLabel
                                    sx={{fontSize: "0.8rem", display:"block"}}
                                    key={idx}
                                    control={<Checkbox />}
                                    label={option}
                                    className="filter-option-item"
                                />
                            ))}
                        </div>
                    )}

                    {/* Separator */}
                    {index < filters.length - 1 && <Divider />}
                </div>
            ))}
        </div>
    );
};

export default FilterPanel;
