import React from 'react';
import Plot from 'react-plotly.js';
import {groupBy} from "lodash";

const PlotlyStackedViolin = ({data, group}) => {
    const expressionData = {};
    const genes = Object.keys(data);
    let xCategories = []
    genes.forEach((gene) => {
        expressionData[gene] = {};
        const groupedData = groupBy(data[gene], group);
        xCategories = Object.keys(groupedData);
        xCategories.forEach((x_i) => {
            expressionData[gene][x_i]=groupedData[x_i].map((d) => d[gene])
        })
    });

    // Create Plotly traces for each gene
    const createTraces = () => {
        return genes.map((gene, geneIndex) => {
            const traces = xCategories.map((x_i, xIndex) => {
                return {
                    x: Array(expressionData[gene][x_i].length).fill(x_i),
                    y: expressionData[gene][x_i],
                    type: 'violin',
                    name: `${gene} - ${x_i}`,
                    box: { visible: false },
                    points: false, // Show all data points
                    meanline: { visible: true },
                    showlegend: false,
                    xaxis: `x${geneIndex + 1}`,
                    yaxis: `y${geneIndex + 1}`,
                    scalemode: "count",
                    line: { width: 1 },
                    jitter: 0.3,
                    // fillcolor: 'rgba(50, 100, 250, 0.5)',
                };
            });
            return traces;
        }).flat();
    };

    // Create subplot layout
    const createLayout = () => {
        const rows = genes.length;
        const layout = {
            grid: {rows, columns: 1, pattern: 'independent',},
            height: `${150 * rows + 80}px`, // Adjust height based on number of genes
            title: 'Stacked Violin Plot',
            margin: { t: 5, b: 80, l: 50, r: 50 }, // Reduce white space
            annotations: [],
        };

        genes.forEach((gene, index) => {
            const yPos = 1 - (index / rows) - 0.5 / rows; // Position annotation on the left of each row

            layout[`xaxis${index + 1}`] = {
                title: index === genes.length - 1 ? 'Cell Type' : '',
                range: [-0.5, xCategories.length - 0.5],
                showticklabels: index === genes.length - 1,
                automargin: true,
                type: "category",
            };
            layout[`yaxis${index + 1}`] = {
                title: { text: gene, font: { size: 12 } },
                automargin: true, // Prevent axis labels from being cut off
                domain: [1 - (index + 1) / rows, 1 - index / rows], // Reduce space between rows
            };
            layout.annotations.push({
                x: -0.2, // Position to the left of y-axis
                y: yPos,
                text: gene,
                showarrow: false,
                xref: "paper",
                yref: "paper",
                font: { size: 12, color: "black" },
                align: "right",
              });
        });

        return layout;
    };

    return (
        <Plot
            data={createTraces()}
            layout={createLayout()}
            style={{ width: '100%', height: '100%' }}
        />
    );
};

export default PlotlyStackedViolin;