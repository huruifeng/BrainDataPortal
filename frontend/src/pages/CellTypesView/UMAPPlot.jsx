"use client"

import {useEffect, useRef} from "react"
import PropTypes from "prop-types"
import Plotly from "plotly.js-dist-min"

const UMAPPlot = ({umapData, metaData, selectedCellTypes, isAllCellTypesSelected}) => {
    const plotRef = useRef(null)

    useEffect(() => {
        if (!umapData || !metaData || !plotRef.current) return

        // Filter data based on selected cell types
        let filteredData = umapData
        if (!isAllCellTypesSelected && selectedCellTypes.length > 0) {
            filteredData = umapData.filter((point) => {
                const cellType = metaData[point.id]?.cell_type
                return selectedCellTypes.includes(cellType)
            })
        }

        const traces = []

        if (isAllCellTypesSelected) {
            // Group by cell type for coloring
            const cellTypeGroups = {}

            filteredData.forEach((point) => {
                const cellType = metaData[point.id]?.cell_type || "Unknown"
                if (!cellTypeGroups[cellType]) {
                    cellTypeGroups[cellType] = {
                        x: [],
                        y: [],
                        text: [],
                        ids: [],
                    }
                }

                cellTypeGroups[cellType].x.push(point.UMAP_1)
                cellTypeGroups[cellType].y.push(point.UMAP_2)
                cellTypeGroups[cellType].text.push(cellType)
                cellTypeGroups[cellType].ids.push(point.id)
            })

            // Create a trace for each cell type
            Object.entries(cellTypeGroups).forEach(([cellType, points]) => {
                traces.push({
                    x: points.x,
                    y: points.y,
                    text: points.text,
                    ids: points.ids,
                    mode: "markers",
                    type: "scattergl",
                    name: cellType,
                    marker: {
                        size: 3,
                        opacity: 0.7,
                    },
                    hoverinfo: "text",
                })
            })
        } else {
            // Single trace with highlighted cell types
            const x = []
            const y = []
            const text = []
            const colors = []

            umapData.forEach((point) => {
                const cellType = metaData[point.id]?.cell_type || "Unknown"
                const isSelected = selectedCellTypes.includes(cellType)

                x.push(point.UMAP_1)
                y.push(point.UMAP_2)
                text.push(cellType)

                // Highlight selected cell types
                colors.push(isSelected ? "red" : "rgba(200, 200, 200, 0.3)")
            })

            traces.push({
                x,
                y,
                text,
                mode: "markers",
                type: "scattergl",
                marker: {
                    size: 3,
                    color: colors,
                },
                hoverinfo: "text",
            })
        }

        const layout = {
            title: "UMAP Visualization of Cell Types",
            xaxis: {
                title: "UMAP_1",
                zeroline: false,
            },
            yaxis: {
                title: "UMAP_2",
                zeroline: false,
            },
            hovermode: "closest",
            showlegend: isAllCellTypesSelected,
            legend: {
                x: 1,
                y: 0.5,
            },
            margin: {
                l: 50,
                r: 50,
                b: 50,
                t: 50,
                pad: 4,
            },
            height: 400,
            autosize: true,
        }

        Plotly.newPlot(plotRef.current, traces, layout, {
            responsive: true,
            displayModeBar: true,
            modeBarButtonsToRemove: ["lasso2d", "select2d"],
        })

        // Cleanup
        return () => {
            if (plotRef.current) {
                Plotly.purge(plotRef.current)
            }
        }
    }, [umapData, metaData, selectedCellTypes, isAllCellTypesSelected])

    return <div ref={plotRef} style={{width: "100%", height: "400px", minHeight: "400px"}}/>
}

UMAPPlot.propTypes = {
    umapData: PropTypes.array.isRequired,
    metaData: PropTypes.object.isRequired,
    selectedCellTypes: PropTypes.array.isRequired,
    isAllCellTypesSelected: PropTypes.bool.isRequired,
}

export default UMAPPlot

