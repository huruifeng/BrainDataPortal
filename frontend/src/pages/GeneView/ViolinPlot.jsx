// https://github.com/hustcc/echarts-for-react
import React from "react";
import EChartViolin from "./EChartViolin.jsx";
import PlotlyViolin from "./PlotlyViolin.jsx";
import PlotlyStackedViolin from "./PlotlyStackedViolin.jsx";

export const PlotlyViolinPlot = ({gene, data, color, group }) => {
  return <PlotlyViolin  gene={gene} data={data} color={color} group={"MajorCellTypes"}/>;
};


export const StackedViolinPlot = ({gene, data, color, group }) => {
  console.log("color:>"+color+"<  group:>"+ group+"<")
  return <PlotlyStackedViolin  gene={gene} data={data} color={color} group={group} />;
};

export const EChartViolinPlot = ({gene, data, color, group }) => {
  return <EChartViolin gene={gene} data={data} color={color} group={"MajorCellTypes"} />;
};