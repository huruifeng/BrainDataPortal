import { useState, useEffect, useRef } from 'react';
import ReactECharts from 'echarts-for-react';
import PropTypes from "prop-types";

const EChartFeaturePlot = ({ visiumData, geneData, metaData, feature }) => {
    const [options, setOptions] = useState(null);
    const imgUrlRef = useRef(null);

    useEffect(() => {
        if (!visiumData || !geneData) return;


        const coordinates = visiumData.coordinates;
        const scaleFactors = visiumData.scales;
        const sliceImage = visiumData.image;
        const imgBlob = sliceImage;
        const imgUrl = URL.createObjectURL(imgBlob);
        imgUrlRef.current = imgUrl;

        const img = new Image();
        img.src = imgUrl;
        img.crossOrigin = 'Anonymous';

        const handleImageLoad = () => {
            const scale = scaleFactors.spot; // Changed from 'spot' to 'hires' based on your data structure

            const dataPoints = coordinates.map(spot => {
                // Fetch gene expression data from the backend
                let colorValues = {};
                const isGene = Object.keys(geneData).includes(feature);
                const isMetaFeature = Object.keys(metaData[0]).includes(feature);
                if (isGene) {
                    colorValues = geneData;
                } else if (isMetaFeature) {
                    colorValues = metaData.reduce((acc, meta) => {
                        acc[meta.cs_id] = meta[feature];
                        return acc;
                    }, {});
                } else {
                    colorValues = {};
                }

                const expr = colorValues[spot.cs_id] ?? 0;
                return [
                    spot.imagecol * scale,
                    spot.imagerow * scale,
                    expr
                ];
            });

            const exprValues = dataPoints.map(d => d[2]);
            const minExpr = Math.min(...exprValues);
            const maxExpr = Math.max(...exprValues);

            setOptions({
                tooltip: {
                    trigger: 'item',
                    formatter: params =>
                        `X: ${params.data[0].toFixed(1)}<br/>
                         Y: ${params.data[1].toFixed(1)}<br/>
                         Expression: ${params.data[2].toFixed(2)}`
                },
                xAxis: { min: 0, max: img.width, show: false },
                yAxis: { min: 0, max: img.height, inverse: true, show: false },
                visualMap: {
                    min: minExpr,
                    max: maxExpr,
                    orient: 'vertical',
                    left: 'left',
                    top: 'middle',
                    inRange: { color: ['#2b73af', '#64b5f6', '#b3e5fc', '#ffeb3b', '#ff5722'] },
                    text: ['High', 'Low'],
                    calculable: true
                },
                series: [{
                    type: 'scatter',
                    symbolSize: 12,
                    data: dataPoints,
                    itemStyle: {
                        borderColor: '#fff',
                        borderWidth: 1
                    }
                }],
                graphic: [{
                    type: 'image',
                    id: 'background',
                    z: -1,
                    left: 0,
                    top: 0,
                    style: {
                        image: imgUrl,
                        width: img.width,
                        height: img.height
                    }
                }]
            });
        };

        img.addEventListener('load', handleImageLoad);

        // Cleanup
        return () => {
            img.removeEventListener('load', handleImageLoad);
            if (imgUrlRef.current) {
                URL.revokeObjectURL(imgUrlRef.current);
            }
        };
    }, [visiumData, geneData]);

    return (
        <div style={{ height: '100%', width: '100%' }}>
            {options ? (
                <ReactECharts
                    option={options}
                    style={{ height: '600px', width: '100%' }}
                    opts={{ renderer: 'svg' }} // Better for crisp images
                />
            ) : (
                <div style={{
                    height: '600px',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    color: '#666'
                }}>
                    Loading visualization...
                </div>
            )}
        </div>
    );
};

EChartFeaturePlot.propTypes = {
    visiumData: PropTypes.shape({
        coordinates: PropTypes.array.isRequired,
        scales: PropTypes.object.isRequired,
        image: PropTypes.instanceOf(Blob).isRequired
    }).isRequired,
    geneData: PropTypes.object.isRequired,
    metaData: PropTypes.array,
    feature: PropTypes.string
};

EChartFeaturePlot.defaultProps = {
    metaData: [],
    feature: ''
};

export default EChartFeaturePlot;