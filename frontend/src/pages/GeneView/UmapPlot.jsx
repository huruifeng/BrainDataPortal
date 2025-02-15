// https://github.com/hustcc/echarts-for-react
import React from "react";
import EChartScatter from "./EChartScatter.jsx";

const UmapPlot = ({gene, data }) => {
  return <EChartScatter gene={gene} data={data} group={"MajorCellTypes"} />;
};

export default UmapPlot;


