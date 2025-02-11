// https://github.com/hustcc/echarts-for-react
import React from "react";
import ReactECharts from "echarts-for-react";

const UmapPlot = ({ data }) => {
  if (!data || data.length === 0) return <p>No data available</p>;

  const option = {
    title: {
      text: "UMAP Projection",
      left: "center",
    },
    tooltip: {
      trigger: "item",
      formatter: (params) => `(${params.value[0]}, ${params.value[1]})`,
    },
    xAxis: {
      type: "value",
      name: "UMAP 1",
      splitLine: { show: false },
    },
    yAxis: {
      type: "value",
      name: "UMAP 2",
      splitLine: { show: false },
    },
    series: [
      {
        name: "Points",
        type: "scatter",
        data: data.map((point) => [point.x, point.y]), // Convert data to [x, y] format
        symbolSize: 6,
        itemStyle: {
          color: "steelblue",
        },
      },
    ],
  };

  return <ReactECharts option={option} style={{ width: "100%", height: "100%" }} autoResize={true} />;
};

export default UmapPlot;


// <ReactECharts
//     notMerge={true}
//     lazyUpdate={true}
//     theme="light"
//     // showLoading={true}
//
//     option={options}
//     style={{ width: '100%'}}
//     autoResize={true}
//     opts={{renderer: 'canvas'}} // use canvas to render the chart.
// />