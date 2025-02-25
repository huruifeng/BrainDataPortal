// https://github.com/hustcc/echarts-for-react
import React from "react";
import EChartScatter from "./EChartScatter.jsx";

const UmapPlot = ({gene, data, color, group }) => {
  return <EChartScatter gene={gene} data={data} color={color} group={color} />;
};

export default UmapPlot;


