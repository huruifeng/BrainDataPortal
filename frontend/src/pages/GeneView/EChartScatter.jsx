import ReactECharts from "echarts-for-react";
import React from "react";
const EChartScatter = ({gene, data, group}) => {

    if (!data || data.length === 0) return <p>No data available</p>;
    var options = {};
    if (gene==="all") {
        // Step 0: Generate distinct colors for each group
        const colorPalette = [
            "#ff7f0e", "#1f77b4", "#2ca02c", "#da6f70", "#9467bd", "#8c564b", "#e377c2",
            "#0d1dd1", "#bcbd22", "#17becf", "#ff0000", "#00ff00", "#0000ff", "#ff00ff",
            "#00ffff", "#ffff00", "#9bed56", "#8000ff", "#0080ff", "#80ff00"
        ]; // Up to 20 unique colors
        // Step 1: Group the data by 'group'
        const groupedData = {};
        data.forEach((p) => {
            if (!groupedData[p[group]]) groupedData[p[group]] = [];
            groupedData[p[group]].push([p["UMAP_1"], p["UMAP_2"]]);
        });
        const groupNames = Object.keys(groupedData);
        const series = groupNames.map((group, index) => ({
            name: `${group}`,
            type: "scatter",
            data: groupedData[group],
            symbolSize: 3,
            itemStyle: { color: colorPalette[index % colorPalette.length] }, // Cycle colors if >20 groups
        }));

         // Step 3: Configure ECharts options
        options = {
            title: {
                text: "Clustered UMAP Scatter Plot",
                left: "center",
                top: 0,
            },
            tooltip: {
                trigger: "item",
                formatter: (params) => `X: ${params.value[0]}<br>Y: ${params.value[1]}<br>Group: ${params.seriesName}`
            },
            legend: {
                type: "scroll", // Support for many groups
                orient: "vertical",
                right: 0,
                top: 0,
                data: groupNames.map(group =>  `${group}`),
            },
            xAxis: { type: "value" },
            yAxis: { type: "value" },
            series: series,
        };

    }else{
        // Convert data to the format required by ECharts
        const scatterData = data.map((point) => [point["UMAP_1"], point["UMAP_2"], point[gene]]);

        // Determine min/max values for visualMap
        const minValue = Math.min(...data.map((p) => p[gene]));
        const maxValue = Math.max(...data.map((p) => p[gene]));

        options = {
            title: {
                text: gene,
                left: 'center',
                top: 0
            },
            xAxis: { type: "value" },
            yAxis: { type: "value" },
            visualMap: {
                min: minValue,
                max: maxValue,
                dimension: 2, // Apply to the "value" dimension
                orient: "vertical",
                right: 10,
                top: "center",
                text: ["High", "Low"],
                calculable: true,
                inRange: {
                    color: ["#CCCCCCFF", "#FF0000FF"], // Color gradient from low to high
                },
            },
            series: [
                {
                    type: "scatter",
                    symbolSize:3,
                    data: scatterData,
                },
            ],
        };
    }


    return <ReactECharts option={options} style={{width: "100%", height: "100%"}} autoResize={true}/>;
}

export default EChartScatter

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