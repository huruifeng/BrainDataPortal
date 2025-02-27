import React from "react";
import Plot from "react-plotly.js";
import { groupBy } from "lodash";

const PlotlyViolinPlot = ({ gene, geneData, metaData, group }) => {
  if(gene==="all") return null;
  const groupedData = groupBy(metaData, group);

  const xCategories = Object.keys(groupedData);

  const traces = xCategories.map((cellType) => ({
    type: "violin",
    name: cellType,
    y: groupedData[cellType].map((d) => { return geneData[d.cs_id] ?? 0 }),
    box: { visible: false }, // Show box plot inside violin
    meanline: { visible: true }, // Show mean line
    points: false, // Show all data points
    jitter: 0.3, // Spread out points for visibility
    scalemode: "width",
    line: { width: 1 },
    fillcolor: "rgba(50, 100, 250, 0.5)",
  }));

  const layout = {
    title: {},
    yaxis: {
      title: { text: gene, font: { size: 12 } },
      automargin: true, // Prevent axis labels from being cut off
    },
    xaxis: {
      automargin: true,
      type: "category",
    },
    margin: { t: 5, b: 50, l: 50, r: 10 }, // Reduce white space
    showlegend: false,
  };

  return <Plot data={traces} layout={layout} style={{ width: "100%", height: "200px" }} />;
};

export default PlotlyViolinPlot;
