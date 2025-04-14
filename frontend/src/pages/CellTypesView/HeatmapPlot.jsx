"use client"

import {useEffect, useRef, useState} from "react"
import PropTypes from "prop-types"
import Plotly from "plotly.js-dist-min"
import {FormControl, InputLabel, Select, MenuItem} from "@mui/material"

const HeatmapPlot = ({diffExpGenes, selectedCellTypes}) => {
    console.log(diffExpGenes)
    const plotRef = useRef(null)
    const [selectedCellType, setSelectedCellType] = useState("")

    useEffect(() => {
        // Set the first cell type as default when the component mounts or when selectedCellTypes changes
        if (selectedCellTypes.length > 0 && !selectedCellType) {
            setSelectedCellType(selectedCellTypes[0])
        }
    }, [selectedCellTypes, selectedCellType])

    useEffect(() => {
        if (!diffExpGenes || !plotRef.current || !selectedCellType || !diffExpGenes[selectedCellType]) return

        const cellTypeData = diffExpGenes[selectedCellType]

        // Get top 10 up and top 10 down genes
        const upGenes = cellTypeData
        .filter((gene) => gene.logFC > 0)
        .sort((a, b) => b.logFC - a.logFC)
        .slice(0, 10)

        const downGenes = cellTypeData
        .filter((gene) => gene.logFC < 0)
        .sort((a, b) => a.logFC - b.logFC)
        .slice(0, 10)

        // Combine genes for the heatmap
        const genes = [...upGenes, ...downGenes]

        // Prepare data for heatmap
        const geneNames = genes.map((gene) => gene.name)
        const pdSamples = genes[0].expression.filter((exp) => exp.condition === "PD").map((exp) => exp.sampleId)
        const controlSamples = genes[0].expression.filter((exp) => exp.condition === "Control").map((exp) => exp.sampleId)
        const allSamples = [...pdSamples, ...controlSamples]

        // Create z-values matrix (expression values)
        const zValues = genes.map((gene) => {
            return allSamples.map((sampleId) => {
                const sampleExp = gene.expression.find((exp) => exp.sampleId === sampleId)
                return sampleExp ? sampleExp.value : 0
            })
        })

        // Z-score normalize the expression values for better visualization
        const normalizedZValues = zValues.map((row) => {
            const mean = row.reduce((sum, val) => sum + val, 0) / row.length
            const stdDev = Math.sqrt(row.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / row.length)
            return row.map((val) => (val - mean) / (stdDev || 1)) // Avoid division by zero
        })

        // Create annotation to mark the boundary between PD and Control samples
        const annotations = [
            {
                x: pdSamples.length - 0.5,
                y: -1,
                xref: "x",
                yref: "y",
                text: "PD | Control",
                showarrow: false,
                font: {
                    family: "Arial",
                    size: 12,
                    color: "black",
                },
            },
        ]

        // Add annotations for up and down regulated genes
        annotations.push({
            x: -1,
            y: 4.5,
            xref: "x",
            yref: "y",
            text: "Up-regulated",
            showarrow: false,
            textangle: 270,
            font: {
                family: "Arial",
                size: 12,
                color: "red",
            },
        })

        annotations.push({
            x: -1,
            y: 14.5,
            xref: "x",
            yref: "y",
            text: "Down-regulated",
            showarrow: false,
            textangle: 270,
            font: {
                family: "Arial",
                size: 12,
                color: "blue",
            },
        })

        // Create heatmap trace
        const trace = {
            z: normalizedZValues,
            x: allSamples,
            y: geneNames,
            type: "heatmap",
            colorscale: "RdBu_r", // Red for high values, blue for low values
            colorbar: {
                title: "Z-score",
                titleside: "right",
                len: 0.5,
                thickness: 15,
            },
        }

        const layout = {
            title: `Differentially Expressed Genes: ${selectedCellType} (PD vs Control)`,
            xaxis: {
                title: "Samples",
                tickangle: 45,
                tickfont: {
                    size: 8,
                },
            },
            yaxis: {
                title: "Genes",
                tickfont: {
                    size: 10,
                },
            },
            annotations: annotations,
            margin: {
                l: 100,
                r: 50,
                b: 100,
                t: 0,
                pad: 4,
            },
            height: 600,
            plot_bgcolor: "rgba(0,0,0,0)",
            paper_bgcolor: "rgba(0,0,0,0)",
        }

        Plotly.newPlot(plotRef.current, [trace], layout, {
            responsive: true,
            displaylogo: false,
        })

        // Cleanup
        return () => {
            if (plotRef.current) {
                Plotly.purge(plotRef.current)
            }
        }
    }, [diffExpGenes, selectedCellType])

    const handleCellTypeChange = (event) => {
        setSelectedCellType(event.target.value)
    }

    return (
        <div style={{minHeight: "650px"}}>
            <FormControl variant="standard" sx={{width: "250px", marginBottom: "20px"}}>
                <InputLabel id="cell-type-label">Cell Type</InputLabel>
                <Select
                    labelId="cell-type-label"
                    id="cell-type-select"
                    value={selectedCellType}
                    onChange={handleCellTypeChange}
                    size="small"
                >
                    {selectedCellTypes.map((cellType) => (
                        <MenuItem key={cellType} value={cellType}>
                            {cellType}
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>
            <div ref={plotRef} style={{width: "100%", height: "600px", minHeight: "600px"}}/>
        </div>
    )
}

HeatmapPlot.propTypes = {
    diffExpGenes: PropTypes.object.isRequired,
    selectedCellTypes: PropTypes.array.isRequired,
}

export default HeatmapPlot

