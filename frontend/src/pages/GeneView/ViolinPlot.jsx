// https://github.com/hustcc/echarts-for-react
import React from "react";
import EChartViolin from "./EChartViolin.jsx";
import PlotlyViolin from "./PlotlyViolin.jsx";
import PlotlyStackedViolin from "./PlotlyStackedViolin.jsx";

const ViolinPlot = ({gene, data }) => {
  // return <PlotlyViolin  gene={gene} data={data} group={"MajorCellTypes"}/>;
  // return <EChartViolin  gene={gene} data={data} group={"MajorCellTypes"}/>;
  return <PlotlyStackedViolin  gene={gene} data={data} group={"MajorCellTypes"} />;

};

export default ViolinPlot;


