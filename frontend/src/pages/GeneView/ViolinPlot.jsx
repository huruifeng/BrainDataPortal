// https://github.com/hustcc/echarts-for-react
import React from "react";
import EChartViolin from "./EChartViolin.jsx";
import PlotlyViolin from "./PlotlyViolin.jsx";
import PlotlyStackedViolin from "./PlotlyStackedViolin.jsx";

export const ViolinPlot = ({gene, data }) => {
  return <PlotlyViolin  gene={gene} data={data} group={"MajorCellTypes"}/>;
};


export const StackedViolinPlot = ({gene, data }) => {
  return <PlotlyStackedViolin  gene={gene} data={data} group={"MajorCellTypes"} />;
};

export const EChartViolinPlot = ({gene, data }) => {
  return <EChartViolin  data={data} group={"MajorCellTypes"} />;
};