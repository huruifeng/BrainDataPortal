import Plot from 'react-plotly.js';
import {groupBy} from "lodash";
import PropTypes from "prop-types";

const PlotlyStackedViolin = ({gene, exprData, metaData, group}) => {
    if (Object.keys(exprData).length === 0) return "Expression data is loading...";
    if(metaData.length === 0) return "Sample not found in the MetaData";
    console.log(exprData);
    console.log(metaData);
    console.log(group);
    console.log(gene);

    if (gene !== "stackedviolin") return null;
    const expressionData = {};
    const genes = Object.keys(exprData);

    let xCategories = [...new Set(Object.values(metaData))];
    genes.forEach((gene) => {
        const geneExpr = exprData[gene];
        expressionData[gene] = {};
        xCategories.forEach((x_i) => {
            expressionData[gene][x_i] = [];
            Object.keys(metaData).forEach((cs_id) => {
                expressionData[gene][x_i].push(geneExpr[cs_id] ?? 0);
            });
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
                    box: {visible: false},
                    points: false, // Show all data points
                    meanline: {visible: true},
                    showlegend: false,
                    xaxis: `x${geneIndex + 1}`,
                    yaxis: `y${geneIndex + 1}`,
                    scalemode: "count",
                    line: {width: 1},
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
        const totalHeight = 100 * rows + 50; // Dynamically adjust height
        const layout = {
            grid: {rows, columns: 1, pattern: 'independent',},
            height: totalHeight, // Adjust height based on number of genes
            title: 'Stacked Violin Plot',
            margin: {t: 5, b: 50, l: 50, r: 50}, // Reduce white space
            annotations: [],
        };

        genes.forEach((gene, index) => {
            const rowHeightFraction = 1 / rows;
            const yMin = 1 - (index + 1) * rowHeightFraction;
            const yMax = 1 - index * rowHeightFraction;

            layout[`xaxis${index + 1}`] = {
                title: index === genes.length - 1 ? 'Cell Type' : '',
                range: [-0.5, xCategories.length - 0.5],
                showticklabels: index === genes.length - 1,
                automargin: true,
                type: "category",
            };
            layout[`yaxis${index + 1}`] = {
                title: {text: gene, font: {size: 12}},
                automargin: true, // Prevent axis labels from being cut off
                domain: [yMin, yMax], // Reduce space between rows
            };
            layout.annotations.push({
                x: -0.2, // Position to the left of y-axis
                y: (yMin + yMax) / 2,
                text: gene,
                showarrow: false,
                xref: "paper",
                yref: "paper",
                font: {size: 12, color: "black"},
                align: "right",
            });
        });

        return layout;
    };

    return (
        <Plot
            data={createTraces()}
            layout={createLayout()}
            style={{width: '100%', height: '100%'}}
        />
    );
};
PlotlyStackedViolin.propTypes = {
    gene: PropTypes.string.isRequired,
    exprData: PropTypes.object.isRequired,
    metaData: PropTypes.object.isRequired,
    group: PropTypes.string.isRequired,
};
export default PlotlyStackedViolin;