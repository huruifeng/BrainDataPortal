// https://github.com/hustcc/echarts-for-react
import React from "react";
import ReactECharts from "echarts-for-react";

const UmapPlot = ({gene, data }) => {
    // console.log(data)
  if (!data || data.length === 0) return <p>No data available</p>;
    const scatterData = data.map((p) => ({
      name: 'point',
      value: [p.UMAP_1, p.UMAP_2],
      itemStyle: { color: gene==="" ? p.color : p[gene] },
    }));

 var options = {
  xAxis: {},
  yAxis: {},
  series: [
    {
      symbolSize: 3,
      data:scatterData,
      type: 'scatter'
    }
  ]
};

  return <ReactECharts option={options} style={{ width: "100%", height: "100%" }} autoResize={true} />;
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