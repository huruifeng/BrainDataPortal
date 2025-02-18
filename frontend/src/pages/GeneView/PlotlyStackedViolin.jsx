import React from 'react';
import Plot from 'react-plotly.js';
import {groupBy} from "lodash";

const PlotlyStackedViolin = ({gene, data, group}) => {
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
        return genes.map((gene, index) => {
            const x = [];
            const y = [];
            xCategories.forEach(x_i => {
                x.push(...Array(expressionData[gene][x_i].length).fill(x_i));
                y.push(...expressionData[gene][x_i]);
            });

            return {
                x,
                y,
                type: 'violin',
                name: gene,
                box: { visible: true },
                meanline: { visible: true },
                showlegend: false,
                xaxis: `x${index + 1}`,
                yaxis: `y${index + 1}`,
            };
        });
    };

    // Create subplot layout
    const createLayout = () => {
        const rows = genes.length;
        const layout = {
            grid: {
                rows,
                columns: 1,
                pattern: 'independent',
            },
            height: 200 * rows, // Adjust height based on number of genes
            title: 'Stacked Violin Plot',
        };

        genes.forEach((gene, index) => {
            layout[`xaxis${index + 1}`] = {
                title: index === genes.length - 1 ? 'Cell Type' : '',
                range: [-0.5, 13.5],
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