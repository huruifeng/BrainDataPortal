import ReactECharts from "echarts-for-react";
import PropTypes from "prop-types";
import {isCategorical} from "../../utils/funcs.js";

function filterBySampleId(obj, sampleList) {
  const sampleSet = new Set(sampleList);
  return Object.fromEntries(
    Object.entries(obj).filter(([key, entry]) => sampleSet.has(entry.sample_id)
  ));
}

const EChartScatterPlot = ({gene, sampleList, umapData, exprData, metaData, group}) => {
    if (Object.keys(umapData).length === 0) return "UMAP data is loading...";

    if (sampleList.length >= 1 && !sampleList.includes("all")) {
        umapData = filterBySampleId(umapData, sampleList);
    }

    const createCategoryOptions = (plotData, colorGroup) => {
        // console.log("Categorical");

        // Step 0: Group the data by 'plotGroup'
        const groupedData = {};
        plotData.forEach((p) => {
            if (!groupedData[p[colorGroup]]) groupedData[p[colorGroup]] = [];
            groupedData[p[colorGroup]].push([p["UMAP_1"], p["UMAP_2"]]);
        });

        // Step 1: Generate distinct colors for each group and create a series for each group
        const colorPalette = [
            "#ff7f0e", "#1f77b4", "#2ca02c", "#da6f70", "#9467bd", "#8c564b", "#e377c2",
            "#0d1dd1", "#bcbd22", "#17becf", "#ff0000", "#00ff00", "#0000ff", "#ff00ff",
            "#00ffff", "#ffff00", "#9bed56", "#8000ff", "#0080ff", "#80ff00"
        ]; // Up to 20 unique colors


        const groupNames = Object.keys(groupedData);
        const series = groupNames.map((group_i, index) => ({
            name: `${group_i}`,
            type: "scatter",
            data: groupedData[group_i],
            symbolSize: 3,
            itemStyle: {color: colorPalette[index % colorPalette.length]}, // Cycle colors if >20 groups
        }));

        // Step 3: Configure ECharts options
        return {
            title: {
                text: "UMAP Scatter Plot - " + colorGroup,
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
                data: groupNames.map(group_i => `${group_i}`),
            },
            xAxis: {type: "value"},
            yAxis: {type: "value"},
            series: series,
        };
    }

    const createContinuousOptions = (plotData, colorGroup) => {
        // console.log("continuous");
        // Convert data to the format required by ECharts
        const scatterData = plotData.map((point) => [point["UMAP_1"], point["UMAP_2"], point[colorGroup]]);
        // console.log(scatterData);
        // Determine min/max values for visualMap
        const minValue = Math.min(...scatterData.map((p) => p[2]));
        const maxValue = Math.max(...scatterData.map((p) => p[2]));


        return {
            title: {
                text: colorGroup,
                left: 'center',
                top: 0
            },
            xAxis: {type: "value"},
            yAxis: {type: "value"},
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
            legend: {show: false},
            series: [
                {
                    type: "scatter",
                    symbolSize: 3,
                    data: scatterData,
                },
            ],
        };
    }

    var options = {};
    if (gene === "all") {
        //===============================
        // In this case the expression data is not needed, just use the metaData
        //===============================
        metaData = metaData ?? {}
        const plotData = Object.entries(umapData).map(([cs_id, item]) => ({
            "UMAP_1": item.UMAP_1,
            "UMAP_2": item.UMAP_2,
            [group]: metaData?.[cs_id] ?? 0,
        }))


        const isCategoricalGroup = isCategorical(Object.values(metaData).map((p) => p[group]));
        if (isCategoricalGroup) {
            options = createCategoryOptions(plotData, group);
        } else {
            options = createContinuousOptions(plotData, group);
        }
    } else {
        // data processing
        const plotData = umapData.map(item => ({
            "UMAP_1": item.UMAP_1,
            "UMAP_2": item.UMAP_2,
            [gene]: exprData?.[item.cs_id] ?? 0, // Works for both objects and arrays, returns 0 for undefined/null values
        })) || [];
        options = createContinuousOptions(plotData, gene);
    }
    return <ReactECharts
        key={`${gene}-${group}`}
        option={options}
        notMerge={true} lazyUpdate={true} theme="light"
        // showLoading={true}
        style={{width: "100%", height: "100%"}}
        autoResize={true}/>;
}

export default EChartScatterPlot

EChartScatterPlot.propTypes = {
    gene: PropTypes.string.isRequired,
    sampleList: PropTypes.array.isRequired,
    umapData: PropTypes.object.isRequired,
    exprData: PropTypes.object.isRequired,
    metaData: PropTypes.object.isRequired,
    group: PropTypes.string.isRequired,
}

// https://www.npmjs.com/package/echarts-for-react
// https://github.com/hustcc/echarts-for-react?tab=readme-ov-file
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