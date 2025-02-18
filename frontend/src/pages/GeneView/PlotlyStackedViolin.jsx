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
            height: `${200 * rows + 80}px`, // Adjust height based on number of genes
            title: 'Stacked Violin Plot',
            margin: { t: 5, b: 80, l: 50, r: 50 }, // Reduce white space
        };

        genes.forEach((gene, index) => {
            layout[`xaxis${index + 1}`] = {
                title: index === genes.length - 1 ? 'Cell Type' : '',
                range: [-0.5, xCategories.length - 0.5],
                showticklabels: index === genes.length - 1,
            };
            layout[`yaxis${index + 1}`] = {
                title: gene,
                titlefont: { size: 10 },
            };
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