import {useState} from 'react';
import ReactECharts from 'echarts-for-react';
import PropTypes from "prop-types";

const EChartFeaturePlot = ({visumData, geneData, metaData}) => {
    console.log("EChartFeaturePlot");
    const [options, setOptions] = useState({});

    const coordinates = visumData.coordinates;
    const scaleFactors = visumData.scaleFactors;
    const imgBlob = visumData.sliceImage;

    const imgUrl = URL.createObjectURL(imgBlob);
    // Create an Image object to get the image dimensions
    const img = new Image();
    img.src = imgUrl;
    img.crossOrigin = 'Anonymous';
    img.onload = () => {
        // Use the "spot" scaling factor to convert spot coordinates to image pixel space
        const scale = scaleFactors.spot;

        // Build an array of data points: each is [x, y, expression]
        const dataPoints = coordinates.map(spot => {
            const spotId = spot.cs_id;
            const expr = geneData[spotId] || 0;
            // Multiply raw imagecol and imagerow by the scale factor
            return [spot.imagecol * scale, spot.imagerow * scale, expr];
        });

        // Determine the min and max expression values for the visualMap
        const exprValues = dataPoints.map(d => d[2]);
        const minExpr = Math.min(...exprValues);
        const maxExpr = Math.max(...exprValues);

        // Configure the ECharts option
        const chartOption = {
            tooltip: {
                trigger: 'item',
                formatter: params => {
                    return `X: ${params.data[0]}<br/>Y: ${params.data[1]}<br/>Expression: ${params.data[2]}`;
                }
            },
            xAxis: {
                min: 0,
                max: img.width,
                show: false
            },
            yAxis: {
                min: 0,
                max: img.height,
                inverse: true, // reverse the y-axis to match image coordinates
                show: false
            },
            visualMap: {
                min: minExpr,
                max: maxExpr,
                orient: 'vertical',
                left: 'left',
                top: 'middle',
                inRange: {
                    // You can customize the color gradient as needed
                    color: ['blue', 'green', 'yellow', 'red']
                },
                text: ['High', 'Low'],
                calculable: true
            },
            series: [
                {
                    type: 'scatter',
                    symbolSize: 10, // Adjust spot size as needed
                    data: dataPoints,
                    itemStyle: {
                        borderColor: '#fff',
                        borderWidth: 1
                    }
                }
            ],
            // Use the graphic component to display the background image
            graphic: [
                {
                    type: 'image',
                    id: 'background',
                    z: -1, // Render behind the scatter series
                    left: 0,
                    top: 0,
                    style: {
                        image: imgUrl,
                        width: img.width,
                        height: img.height
                    }
                }
            ]
        };

        // Set the option to render the chart
        setOptions(chartOption);
        // Optionally, revoke the object URL if no longer needed
        URL.revokeObjectURL(imgUrl);

    }

    return (
        <div>
            {!options ? (
                <p>Loading...</p>
            ) : (
                <ReactECharts option={options} style={{height: '600px', width: '100%'}}/>
            )}
        </div>
    );
};

EChartFeaturePlot.propTypes = {
    visumData: PropTypes.object.isRequired,
    geneData: PropTypes.object.isRequired,
    metaData: PropTypes.array.isRequired,
};

export default EChartFeaturePlot;
