import {useEffect, useRef, useState} from 'react';
import ReactECharts from 'echarts-for-react';
import PropTypes from "prop-types";

const EChartFeaturePlot2 = ({visiumData, geneData, metaData, feature}) => {
    const chartRef = useRef(null);
    const containerRef = useRef(null);
    const { coordinates, scales: scaleFactors, image: imageBlob } = visiumData;

    // State for image dimensions and aspect ratio
    const [imgAspectRatio, setImgAspectRatio] = useState(1);
    const [imageUrl, setImageUrl] = useState('');
    const [maxX, setMaxX] = useState(0);
    const [maxY, setMaxY] = useState(0);

    // Calculate max coordinates and aspect ratio
    useEffect(() => {
        if (coordinates.length > 0) {
            const maxImagerow = Math.max(...coordinates.map(c => c.imagerow));
            const maxImagecol = Math.max(...coordinates.map(c => c.imagecol));
            const calculatedMaxX = maxImagerow * scaleFactors.lowres;
            const calculatedMaxY = maxImagecol * scaleFactors.lowres;
            setMaxX(calculatedMaxX);
            setMaxY(calculatedMaxY);
            setImgAspectRatio(calculatedMaxY / calculatedMaxX);
        }
    }, [coordinates, scaleFactors.lowres]);

    // Handle image loading
    useEffect(() => {
        if (imageBlob) {
            const url = URL.createObjectURL(imageBlob);
            setImageUrl(url);
            return () => URL.revokeObjectURL(url);
        }
    }, [imageBlob]);

    // Prepare feature data
    const featuredData = {};
    const isGene = Object.keys(geneData).includes(feature);
    const isMetaFeature = metaData?.[0] && Object.keys(metaData[0]).includes(feature);

    if (isGene) {
        Object.assign(featuredData, geneData);
    } else if (isMetaFeature) {
        metaData.forEach(item => featuredData[item.cs_id] = item[feature]);
    }

    // Prepare scatter data
    const scatterData = coordinates.map(item => ({
        name: item.cs_id,
        value: [
            item.imagerow * scaleFactors.lowres,
            item.imagecol * scaleFactors.lowres,
            featuredData[item.cs_id] || 0
        ]
    }));

    // Visual mapping configuration
    const featureValues = Object.values(featuredData);
    const minFeature = Math.min(...featureValues);
    const maxFeature = Math.max(...featureValues);

    // ECharts configuration
    const option = {
         grid: {
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            containLabel: false
        },
        tooltip: {
            trigger: 'item',
            formatter: params => `ID: ${params.name}<br/>${feature}: ${params.value[2]}`
        },
        visualMap: {
            min: minFeature,
            max: maxFeature,
            calculable: true,
            orient: 'horizontal',
            left: 'center',
            bottom: 10,
            inRange: { color: ['blue', 'green', 'yellow', 'red'] }
        },
        xAxis: { min: 0, max: maxX, show: true },
        yAxis: { min: 0, max: maxY, inverse: true, show: true },
        graphic: [{
            type: 'image',
            left: 0,
            top: 0,
            style: {
                image: imageUrl,
                width: maxX,
                height: maxY
            },
            z: 0
        }],
        series: [{
            type: 'scatter',
            coordinateSystem: 'cartesian2d',
            data: scatterData,
            symbolSize: 5,
            itemStyle: { borderColor: '#fff', borderWidth: 1 }
        }]
    };

    return (
        <div ref={containerRef} style={{ width: '100%', position: 'relative' }}>
            <div style={{ paddingTop: `${imgAspectRatio * 100}%` }}>
                <ReactECharts
                    ref={chartRef}
                    option={option}
                    style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}
                    opts={{ renderer: 'svg' }}
                />
            </div>
        </div>
    );
};

EChartFeaturePlot2.propTypes = {
    visiumData: PropTypes.shape({
        coordinates: PropTypes.array.isRequired,
        scales: PropTypes.object.isRequired,
        image: PropTypes.instanceOf(Blob).isRequired
    }).isRequired,
    geneData: PropTypes.object.isRequired,
    metaData: PropTypes.array,
    feature: PropTypes.string
};

export default EChartFeaturePlot2;