"use client"

import {useEffect, useRef} from "react"
import PropTypes from "prop-types"
import Plotly from "plotly.js-dist-min"

const BubblePlot = ({markerGenes, selectedCellTypes, isAllCellTypesSelected}) => {
    const plotRef = useRef(null)

    useEffect(() => {
        if (!markerGenes || !plotRef.current) return

        let plotData = []
        let layout = {}

        if (isAllCellTypesSelected) {
            // Stacked bubble plots for all cell types
            // Each cell type gets its own row with top 10 marker genes
            const cellTypes = Object.keys(markerGenes)
            const yValues = []
            const xValues = []
            const sizeValues = []
            const colorValues = []
            const textValues = []

            cellTypes.forEach((cellType, cellTypeIndex) => {
                const topGenes = markerGenes[cellType].slice(0, 10) // Top 10 genes

                topGenes.forEach((gene, geneIndex) => {
                    yValues.push(cellType)
                    xValues.push(gene.name)
                    sizeValues.push(gene.score * 20) // Scale the size based on score
                    colorValues.push(cellTypeIndex) // Color by cell type
                    textValues.push(`Gene: ${gene.name}<br>Score: ${gene.score.toFixed(2)}<br>Cell Type: ${cellType}`)
                })
            })

            plotData = [
                {
                    x: xValues,
                    y: yValues,
                    mode: "markers",
                    marker: {
                        size: sizeValues,
                        color: colorValues,
                        colorscale: "Viridis",
                        showscale: true,
                        colorbar: {
                            title: "Cell Type Index",
                        },
                        opacity: 0.7,
                    },
                    text: textValues,
                    hoverinfo: "text",
                    type: "scatter",
                },
            ]

            layout = {
                title: "Top 10 Marker Genes for Each Cell Type",
                xaxis: {
                    title: "Gene",
                    tickangle: 45,
                },
                yaxis: {
                    title: "Cell Type",
                    categoryorder: "array",
                    categoryarray: cellTypes,
                },
                margin: {
                    l: 150,
                    r: 50,
                    b: 100,
                    t: 50,
                    pad: 4,
                },
                height: Math.max(400, cellTypes.length * 40 + 100), // Dynamic height based on number of cell types
            }
        } else {
            // Single bubble plot for selected cell types
            // Show top 10 marker genes for each selected cell type
            const genes = []
            const scores = []
            const cellTypeLabels = []
            const sizes = []
            const colors = []

            selectedCellTypes.forEach((cellType, index) => {
                if (markerGenes[cellType]) {
                    const topGenes = markerGenes[cellType].slice(0, 10) // Top 10 genes

                    topGenes.forEach((gene) => {
                        genes.push(gene.name)
                        scores.push(gene.score)
                        cellTypeLabels.push(cellType)
                        sizes.push(gene.score * 20) // Scale the size based on score
                        colors.push(index) // Color by cell type index
                    })
                }
            })

            plotData = [
                {
                    x: genes,
                    y: scores,
                    mode: "markers",
                    marker: {
                        size: sizes,
                        color: colors,
                        colorscale: "Viridis",
                        showscale: true,
                        colorbar: {
                            title: "Cell Type Index",
                        },
                        opacity: 0.7,
                    },
                    text: cellTypeLabels.map(
                        (ct, i) => `Gene: ${genes[i]}<br>Score: ${scores[i].toFixed(2)}<br>Cell Type: ${ct}`,
                    ),
                    hoverinfo: "text",
                    type: "scatter",
                },
            ]

            layout = {
                title: "Top 10 Marker Genes for Selected Cell Types",
                xaxis: {
                    title: "Gene",
                    tickangle: 45,
                },
                yaxis: {
                    title: "Score",
                    zeroline: true,
                },
                margin: {
                    l: 50,
                    r: 50,
                    b: 100,
                    t: 50,
                    pad: 4,
                },
                height: 400,
                autosize: true,
            }
        }

        Plotly.newPlot(plotRef.current, plotData, layout, {
            responsive: true,
            displayModeBar: true,
        })

        // Cleanup
        return () => {
            if (plotRef.current) {
                Plotly.purge(plotRef.current)
            }
        }
    }, [markerGenes, selectedCellTypes, isAllCellTypesSelected])

    return <div ref={plotRef} style={{width: "100%", height: "400px", minHeight: "400px"}}/>
}

BubblePlot.propTypes = {
    markerGenes: PropTypes.object.isRequired,
    selectedCellTypes: PropTypes.array.isRequired,
    isAllCellTypesSelected: PropTypes.bool.isRequired,
}

export default BubblePlot

