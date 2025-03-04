import ReactECharts from "echarts-for-react";
import PropTypes from "prop-types";

const EChartMetaScatter = ({gene, geneData, sampleData, metaData, group}) => {
    // console.log("gene: ", gene);
    if (sampleData.length >= 1 && !sampleData.includes("all")) {
        metaData = metaData.filter((meta) => sampleData.includes(meta.sample_id));
    }

    if (metaData.length === 0) return "Sample not found in the MetaData";

    const scatterData = metaData.map((meta) => {
        return [meta[group], geneData[meta.cs_id] ?? 0];
    });

    // console.log("scatterData: ", scatterData);

    const options = {
        title: {
            text: `${gene} - ${group}`,
            left: 'center',
            top: 0
        },
        xAxis: {
            name: group
        },
        yAxis: {
            name: "Expression"
        },
        series: [
            {
                type: "scatter",
                symbolSize: 3,
                data: scatterData,
            },
        ]
    }

    return <ReactECharts
        key={`${gene}-${group}`}
        option={options}
        notMerge={true} lazyUpdate={true} theme="light"
        // showLoading={true}
        style={{width: "100%", height: "100%"}}
        autoResize={true}/>;
}

EChartMetaScatter.propTypes = {
    gene: PropTypes.string.isRequired,
    geneData: PropTypes.object.isRequired,
    sampleData: PropTypes.array.isRequired,
    metaData: PropTypes.array.isRequired,
    group: PropTypes.string.isRequired,
};

export default EChartMetaScatter

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