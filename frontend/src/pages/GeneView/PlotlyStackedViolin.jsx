import Plot from 'react-plotly.js';
import Plotly from "plotly.js-dist";
import PropTypes from "prop-types";
import React from "react";


const PlotlyStackedViolin = React.memo(function PlotlyStackedViolin({gene, exprData, metaData, group, group2, includeZeros, mainCluster, datasetId, type = "violin"}) {
    if (metaData.length === 0) return "Sample not found in the MetaData";
    if (gene !== "stackedviolin") return null;

    const colorPalette = [
        "#A7D16B", "#ADD9E9", "#A84D9D", "#F68D40", "#0A71B1", "#016B62", "#BFAFD4", "#6BAED6", "#7BCCC4",
        "#ff7f0e", "#1f77b4", "#2ca02c", "#da6f70", "#9467bd", "#8c564b", "#e377c2",
        "#0d1dd1", "#bcbd22", "#17becf", "#ff0000", "#00ff00", "#0000ff", "#ff00ff",
        "#00ffff", "#ffff00", "#9bed56", "#8000ff", "#0080ff", "#80ff00"
    ];

    // Group cells by primary group
    const groupedData = {};
    for (const [id, attrs] of Object.entries(metaData)) {
        const key = attrs[group];
        (groupedData[key] ||= []).push(id);
    }

    // If group2 is set, also group cells by secondary group
    const group2Values = group2
        ? [...new Set(Object.values(metaData).map(attrs => attrs[group2]))].sort()
        : null;

    // Build expression data grouped by primary (and optionally secondary) group
    const expressionData = {};
    for (const geneName of Object.keys(exprData)) {
        const geneGroupData = {};

        for (const [groupValue, cellIds] of Object.entries(groupedData)) {
            if (group2 && group2Values) {
                // Secondary grouping: split each primary group by group2
                const subGroups = {};
                for (const g2Val of group2Values) {
                    subGroups[g2Val] = [];
                }
                for (const id of cellIds) {
                    const g2Val = metaData[id]?.[group2];
                    if (g2Val === undefined) continue;
                    if (exprData[geneName]?.[id] !== undefined) {
                        subGroups[g2Val].push(exprData[geneName][id]);
                    } else {
                        includeZeros && subGroups[g2Val].push(0);
                    }
                }
                // Ensure at least a dummy value
                for (const g2Val of group2Values) {
                    if (subGroups[g2Val].length === 0) {
                        subGroups[g2Val].push(0);
                    }
                }
                geneGroupData[groupValue] = subGroups;
            } else {
                // No secondary grouping — original behavior
                const expressionValues = [];
                for (const id of cellIds) {
                    if (exprData[geneName]?.[id] !== undefined) {
                        expressionValues.push(exprData[geneName][id]);
                    } else {
                        includeZeros && expressionValues.push(0);
                    }
                }
                if (expressionValues.length === 0) {
                    expressionValues.push(0);
                }
                geneGroupData[groupValue] = expressionValues;
            }
        }
        expressionData[geneName] = geneGroupData;
    }

    const genes = Object.keys(exprData);
    const xCategories = Object.keys(groupedData).sort();

    // Compute numeric x offsets for grouped violins (group2 mode)
    const nGroups = group2Values ? group2Values.length : 0;
    const groupWidth = 0.8; // total width allocated per primary category
    const violinWidth = nGroups > 0 ? groupWidth / nGroups : 0;

    const getGroupedX = (catIndex, g2Index) => {
        // Center the sub-violins around the integer category position
        return catIndex - groupWidth / 2 + violinWidth * (g2Index + 0.5);
    };

    // Create Plotly traces for each gene
    const createTraces = () => {
        const traces = [];

        genes.forEach((geneName, geneIndex) => {
            if (group2 && group2Values) {
                // Secondary groupby: side-by-side violins via manual x offsets
                const legendShown = new Set();
                xCategories.forEach((x_i, catIndex) => {
                    group2Values.forEach((g2Val, g2Index) => {
                        const data = expressionData[geneName][x_i]?.[g2Val] || [0];
                        const sorted = [...data].sort((a, b) => a - b);
                        const minVal = sorted[0];
                        const maxVal = sorted[sorted.length - 1];
                        const medianVal = sorted[Math.floor(sorted.length / 2)];
                        const count = data.length;

                        const xPos = getGroupedX(catIndex, g2Index);

                        const showLegend = !legendShown.has(g2Val);
                        if (showLegend) legendShown.add(g2Val);

                        // Violin trace
                        traces.push({
                            x: Array(data.length).fill(xPos),
                            y: data,
                            type: 'violin',
                            name: g2Val,
                            legendgroup: g2Val,
                            box: {visible: type === "boxplot"},
                            points: type === "boxplot",
                            meanline: {visible: true},
                            showlegend: showLegend,
                            xaxis: `x${geneIndex + 1}`,
                            yaxis: `y${geneIndex + 1}`,
                            scalemode: "width",
                            width: violinWidth * 0.9,
                            line: {width: 1, color: "black"},
                            jitter: 0.3,
                            fillcolor: colorPalette[g2Index % colorPalette.length],
                            hoverinfo: 'skip',
                        });

                        // Overlay scatter trace for stats
                        traces.push({
                            type: 'scatter',
                            mode: 'markers',
                            x: [xPos, xPos, xPos],
                            y: [minVal, medianVal, maxVal],
                            marker: {color: colorPalette[g2Index % colorPalette.length], size: 2, symbol: 'circle'},
                            hovertemplate:
                                `${g2Val}<br>` +
                                `Min: ${minVal}<br>` +
                                `Median: ${medianVal}<br>` +
                                `Max: ${maxVal}<br>` +
                                `Total: ${count}<extra></extra>`,
                            showlegend: false,
                            xaxis: `x${geneIndex + 1}`,
                            yaxis: `y${geneIndex + 1}`,
                        });
                    });
                });
            } else {
                // Original single-group behavior
                xCategories.forEach((x_i, xIndex) => {
                    let data = expressionData[geneName][x_i];
                    if (data.length === 0) {
                        data = [0];
                    }

                    const sorted = data.sort((a, b) => a - b);
                    const minVal = sorted[0];
                    const maxVal = sorted[sorted.length - 1];
                    const medianVal = sorted[Math.floor(sorted.length / 2)];
                    const count = data.length;

                    const x_label = (group === mainCluster)
                        ? `<a href="/views/clusters?dataset=${datasetId}&cluster=${x_i}">${x_i}</a>`
                        : x_i;

                    traces.push({
                        x: Array(data.length).fill(x_label),
                        y: data,
                        type: 'violin',
                        name: `${geneName} - ${x_i}`,
                        box: {visible: type === "boxplot"},
                        points: type === "boxplot",
                        meanline: {visible: true},
                        showlegend: false,
                        xaxis: `x${geneIndex + 1}`,
                        yaxis: `y${geneIndex + 1}`,
                        scalemode: "count",
                        line: {width: 1, color: "black"},
                        jitter: 0.3,
                        fillcolor: colorPalette[xIndex % colorPalette.length],
                        hoverinfo: 'skip',
                    });

                    traces.push({
                        type: 'scatter',
                        mode: 'markers',
                        x: [x_label, x_label, x_label],
                        y: [minVal, medianVal, maxVal],
                        marker: {color: 'black', size: 2, symbol: 'circle'},
                        hovertemplate:
                            `Min: ${minVal}<br>` +
                            `Median: ${medianVal}<br>` +
                            `Max: ${maxVal}<br>` +
                            `Total: ${count}<extra></extra>`,
                        showlegend: false,
                        xaxis: `x${geneIndex + 1}`,
                        yaxis: `y${geneIndex + 1}`,
                    });
                });
            }
        });

        return traces;
    };

    // Create subplot layout
    const createLayout = () => {
        const rows = genes.length;
        const totalHeight = 150 * rows + 50;
        const layout = {
            grid: {rows, columns: 1, pattern: 'independent'},
            height: totalHeight,
            title: 'Stacked Plot',
            paper_bgcolor: '#F5F5F5',
            plot_bgcolor: '#F5F5F5',
            margin: {t: 5, b: (group2 ? 100 : 50), l: 50, r: 50},
            annotations: [],
        };

        if (group2 && group2Values) {
            layout.legend = {
                title: {text: group2},
                orientation: "h",
                y: -0.15,
                x: 0.5,
                xanchor: "center",
                yanchor: "top",
            };
        }

        // Tick positions and labels for grouped mode
        const tickvals = xCategories.map((_, i) => i);
        const ticktext = xCategories.map((x_i) => {
            return (group === mainCluster)
                ? `<a href="/views/clusters?dataset=${datasetId}&cluster=${x_i}">${x_i}</a>`
                : x_i;
        });

        genes.forEach((geneName, index) => {
            const rowHeightFraction = 1 / rows;
            const yMin = 1 - (index + 1) * rowHeightFraction;
            const yMax = 1 - index * rowHeightFraction;

            const xaxisDef = {
                title: index === genes.length - 1 ? group : '',
                range: [-0.5, xCategories.length - 0.5],
                showticklabels: index === genes.length - 1,
                automargin: true,
            };

            if (group2 && group2Values) {
                // Numeric axis with explicit tick labels
                xaxisDef.tickvals = tickvals;
                xaxisDef.ticktext = ticktext;
            } else {
                xaxisDef.type = "category";
            }

            layout[`xaxis${index + 1}`] = xaxisDef;
            layout.annotations.push({
                x: -0.01,
                y: (yMin + yMax) / 2,
                text: geneName,
                showarrow: false,
                xref: "paper",
                yref: "paper",
                font: {size: 12, color: "black"},
                yanchor: "middle",
                xanchor: "right",
                valign: "middle",
                textangle: 270,
            });
        });

        return layout;
    };

    return (
        <Plot
            divId={`geneview-gene-plot`}
            data={createTraces()}
            layout={createLayout()}
            style={{width: '100%', height: '100%'}}
            config={{
                displaylogo: false,
                responsive: true,
                doubleClick: false,
                scrollZoom: false,
                zoom2d: false,
                pan2d: false,
                select2d: false,
                lasso2d: false,
                staticPlot: true,
                modeBarButtonsToRemove: ["zoom2d", "pan2d", "select2d", "lasso2d", "pan2d"],
                toImageButtonOptions: {
                    name: "Save as SVG",
                    format: 'svg',
                    filename: `StackedViolin.${group}${group2 ? '.' + group2 : ''}.${genes.join('_')}`,
                    scale: 1,
                },
                modeBarButtonsToAdd: [
                    [
                        {
                            name: "Save as SVG",
                            icon: Plotly.Icons.disk,
                            click: function (gd) {
                                Plotly.downloadImage(gd, {format: "svg", filename: `StackedViolin.${group}${group2 ? '.' + group2 : ''}.${genes.join('_')}.Zeros_${includeZeros}`});
                            },
                        },
                    ],
                ],
            }}
        />
    );
});
PlotlyStackedViolin.propTypes = {
    gene: PropTypes.string.isRequired,
    exprData: PropTypes.object.isRequired,
    metaData: PropTypes.object.isRequired,
    group: PropTypes.string.isRequired,
    group2: PropTypes.string,
    includeZeros: PropTypes.bool.isRequired,
    mainCluster: PropTypes.string.isRequired,
    datasetId: PropTypes.string.isRequired,
    type: PropTypes.string.isRequired,
};
export default PlotlyStackedViolin;