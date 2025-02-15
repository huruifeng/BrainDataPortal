import ReactECharts from "echarts-for-react";
import React from "react";
const EChartScatter = ({gene, data }) => {
    // console.log(data)
    if (!data || data.length === 0) return <p>No data available</p>;
    if (gene==="all") {
        const scatterData = data.map((p) => ({
            name: 'point',
            value: [p.UMAP_1, p.UMAP_2],
            itemStyle: {color:  p.color},
        }));

        var options = {
            title: {
                text: gene === "all" ? "UMAP" : gene,
                left: 'center',
                top: 0
            },
            xAxis: {},
            yAxis: {},
            series: [
                {
                    symbolSize: 3,
                    data: scatterData,
                    type: 'scatter'
                }
            ]
        };

    }else{
        // Convert data to the format required by ECharts
        const scatterData = data.map((point) => [point["UMAP_1"], point["UMAP_2"], point[gene]]);
        console.log(scatterData)
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
                    color: ["#CCCCCCFF", "#F22424FF"], // Color gradient from low to high
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