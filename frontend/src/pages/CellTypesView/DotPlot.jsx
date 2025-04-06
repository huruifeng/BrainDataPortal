"use client"

import {useEffect, useRef} from "react"
import PropTypes from "prop-types"
import Plotly from "plotly.js-dist-min"

const DotPlot = ({markerGenes, selectedCellTypes, isAllCellTypesSelected}) => {
    const plotRef = useRef(null)

    useEffect(() => {
        if (!markerGenes || !plotRef.current || selectedCellTypes.length === 0) return

        // Get all unique cell types from the data
        const allCellTypes = Array.from(new Set(markerGenes.map((gene) => gene.MajorCellTypes))).filter(Boolean)

        // Filter genes for selected cell types (limit to 10 per cell type)
        let pooledGenes = []

        selectedCellTypes.forEach((cellType) => {
            // Filter genes that are markers for this cell type
            const cellTypeMarkers = markerGenes.filter((gene) => gene.MajorCellTypes === cellType && gene.is_marker)

            // Sort by score or another metric if available, then take top 10
            const topMarkers = cellTypeMarkers.sort((b, a) => (b.score || b.avg_expr) - (a.score || a.avg_expr)).slice(0, 10)

            // Add to pooled genes with source cell type
            pooledGenes = [
                ...pooledGenes,
                ...topMarkers.map((gene) => ({
                    ...gene,
                    sourceCellType: cellType, // Track which cell type this gene came from
                })),
            ]
        })

        // Get unique gene names from pooled marker genes
        const uniqueGeneNames = Array.from(new Set(pooledGenes.map((gene) => gene.gene)))

        // Prepare data for the dot plot
        const xValues = [] // Cell types
        const yValues = [] // Gene names
        const sizeValues = [] // Percentage of cells expressing the gene
        const colorValues = [] // Average expression
        const textValues = [] // Hover text

        // For each gene and cell type combination, find the expression data
        uniqueGeneNames.forEach((geneName) => {
            // Find the source cell type for this gene (which cell type it's a marker for)
            const sourceGene = pooledGenes.find((gene) => gene.gene === geneName)
            const sourceType = sourceGene ? sourceGene.sourceCellType : "Unknown"

            allCellTypes.forEach((cellType) => {
                // Find the gene data for this cell type
                const geneData = markerGenes.find((gene) => gene.gene === geneName && gene.MajorCellTypes === cellType)

                if (geneData) {
                    xValues.push(cellType)
                    yValues.push(geneName)

                    // Calculate percentage of cells expressing the gene
                    const percentage = geneData.n_expr_cells / geneData.celltype_n_cells
                    sizeValues.push(percentage * 100) // Scale to percentage

                    // Cap avg_expr at 6
                    const avgExpr = Math.min(geneData.avg_expr, 6)
                    colorValues.push(avgExpr)

                    textValues.push(
                        `Gene: ${geneName}<br>` +
                        `Cell Type: ${cellType}<br>` +
                        `Avg Expression: ${geneData.avg_expr.toFixed(2)}<br>` +
                        `% Cells: ${(percentage * 100).toFixed(1)}%<br>` +
                        `Marker for: ${sourceType}`,
                    )
                } else {
                    // If no data for this gene in this cell type, add placeholder with zero values
                    xValues.push(cellType)
                    yValues.push(geneName)
                    sizeValues.push(0)
                    colorValues.push(0)
                    textValues.push(
                        `Gene: ${geneName}<br>` +
                        `Cell Type: ${cellType}<br>` +
                        `Avg Expression: 0<br>` +
                        `% Cells: 0%<br>` +
                        `Marker for: ${sourceType}`,
                    )
                }
            })
        })

        // console.log(
        //     `Total data points: ${xValues.length} (${uniqueGeneNames.length} genes × ${allCellTypes.length} cell types)`,
        // )

        // Create the main dot plot trace
        const mainTrace = {
            x: xValues,
            y: yValues,
            mode: "markers",
            marker: {
                size: sizeValues,
                sizemode: "area",
                sizeref: 0.1, // Adjust this value to scale the dots appropriately
                sizemin: 1, // Minimum dot size
                color: colorValues,
                colorscale: "Viridis", // Use a color scale that works well for expression data
                colorbar: {
                    title: "Avg Expression",
                    thickness: 15,
                    tickvals: [0, 2, 4, 6],
                    ticktext: ["0", "2", "4", "6+"],
                    len: 1/selectedCellTypes.length,
                },
                opacity: 0.8,
            },
            text: textValues,
            hoverinfo: "text",
            type: "scatter",
            showlegend: false,
        }

        // Create size legend traces (invisible points with different sizes)
        const sizeLegendTraces = [
            {x: [null], y: [null],
                mode: "markers",
                marker: {size: 20, color: "rgba(0,0,0,0.5)",},
                name: "20% of cells",
                showlegend: true,
                hoverinfo: "none",
                legendgroup: "size-legend",
            },
            {x: [null], y: [null],
                mode: "markers",
                marker: {size: 40, color: "rgba(0,0,0,0.5)",},
                name: "40% of cells",
                showlegend: true,
                hoverinfo: "none",
                legendgroup: "size-legend",
            },
            {x: [null], y: [null],
                mode: "markers",
                marker: {size: 60, color: "rgba(0,0,0,0.5)",},
                name: "60% of cells",
                showlegend: true,
                hoverinfo: "none",
                legendgroup: "size-legend",
            },
            {x: [null], y: [null],
                mode: "markers",
                marker: {size: 80, color: "rgba(0,0,0,0.5)",},
                name: "80% of cells",
                showlegend: true,
                hoverinfo: "none",
                legendgroup: "size-legend",
            },
            {x: [null], y: [null],
                mode: "markers",
                marker: {size: 100, color: "rgba(0,0,0,0.5)",},
                name: "100% of cells",
                showlegend: true,
                hoverinfo: "none",
                legendgroup: "size-legend",
            },
        ]

        // Add a title for the size legend
        const sizeLegendTitle = {
            x: [null],
            y: [null],
            mode: "markers",
            marker: {size: 0, color: "rgba(0,0,0,0)",},
            name: "Percent of Cells",
            showlegend: true,
            hoverinfo: "none",
            legendgroup: "size-legend",
        }

        // Combine all traces
        const plotData = [mainTrace, sizeLegendTitle, ...sizeLegendTraces]

        const layout = {
            title: `Dot Plot (${uniqueGeneNames.length} genes across ${allCellTypes.length} cell types)`,
            xaxis: {
                title: "Cell Types",
                tickangle: 45,
            },
            yaxis: {
                title: "Genes",
                automargin: true,
            },
            margin: {
                l: 100,
                r: 50,
                b: 120,
                t: 30,
                pad: 4,
            },
            height: Math.max(400, uniqueGeneNames.length * 25 + 150), // Dynamic height based on number of genes
            autosize: true,
            hovermode: "closest",
            legend: {
                title: {
                    text: "Legend",
                },
                orientation: "v",
                x: 1.05,
                y: 1,
                traceorder: "grouped",
                itemsizing: "constant",
            },
        }

        Plotly.newPlot(plotRef.current, plotData, layout, {
            responsive: true,
            displayModeBar: true,
            displaylogo: false,
        })

        // Cleanup
        return () => {
            if (plotRef.current) {
                Plotly.purge(plotRef.current)
            }
        }
    }, [markerGenes, selectedCellTypes, isAllCellTypesSelected])

    return <div ref={plotRef} style={{width: "100%", height: "100%", minHeight: "400px"}}/>
}

DotPlot.propTypes = {
    markerGenes: PropTypes.array.isRequired,
    selectedCellTypes: PropTypes.array.isRequired,
    isAllCellTypesSelected: PropTypes.bool.isRequired,
}

export default DotPlot

