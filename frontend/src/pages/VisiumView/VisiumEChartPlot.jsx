import {useEffect, useRef, useState, useCallback, useMemo} from 'react';
import ReactECharts from 'echarts-for-react';
import PropTypes from "prop-types";

const EChartFeaturePlot = ({visiumData, geneData, metaData, feature}) => {
    const containerRef = useRef(null);
    const chartRef = useRef(null);
    const resizeObserver = useRef(null);
    const [version, setVersion] = useState(0);

    // Destructure required data
    const { coordinates, scales, image } = visiumData;
    const { hires, lowres} = scales;

    // State management
    const [naturalDimensions, setNaturalDimensions] = useState({width: 0, height: 0});
    const [displayScale, setDisplayScale] = useState(1);
    const [imageUrl, setImageUrl] = useState('');

    // Load image and get natural dimensions
    useEffect(() => {
        if (!image) return;

        const url = URL.createObjectURL(image);
        setImageUrl(url);

        const img = new Image();
        img.onload = () => {
            setNaturalDimensions({
                width: img.naturalWidth,
                height: img.naturalHeight
            });
        };
        img.src = url;

        return () => URL.revokeObjectURL(url);
    }, [image]);

    // Calculate display scale and force update
    const updateScale = useCallback(() => {
        if (!containerRef.current || !naturalDimensions.width) return;

        const containerWidth = containerRef.current.offsetWidth;
        const scale = containerWidth / naturalDimensions.width;

        console.log("scale: ", scale);
        console.log("containerWidth: ", containerWidth);

        if (scale !== displayScale) {
            setDisplayScale(scale);
            setVersion(v => v + 1); // Force chart re-render
        }
    }, [naturalDimensions.width, displayScale]);

    // Setup resize observer
    useEffect(() => {
        if (!containerRef.current) return;

        resizeObserver.current = new ResizeObserver(updateScale);
        resizeObserver.current.observe(containerRef.current);

        return () => {
            if (resizeObserver.current) {
                resizeObserver.current.disconnect();
            }
        };
    }, [updateScale]);

    // Process feature data
    const featuredData = useMemo(() => {
        const data = {};
        if (Object.keys(geneData).includes(feature)) {
            return geneData[feature];
        }
        if (metaData?.[0] && Object.keys(metaData[0]).includes(feature)) {
            metaData.forEach(item => {
                data[item.cs_id] = item[feature];
            });
        }
        return data;
    }, [geneData, metaData, feature]);

    // Generate scatter data with proper scaling
    const scatterData = useMemo(() => {
        return coordinates.map(item => ({
            name: item.cs_id,
            value: [
                item.imagerow * lowres , // X
                item.imagecol * lowres , // Y
                featuredData[item.cs_id] || 0         // Value
            ]
        }));
    }, [coordinates, hires, displayScale, featuredData]);

    // Calculate value range for visual mapping
    const { minFeature, maxFeature } = useMemo(() => {
        const values = Object.values(featuredData).filter(Number.isFinite);
        return {
            minFeature: Math.min(...values),
            maxFeature: Math.max(...values)
        };
    }, [featuredData]);

    // ECharts configuration
    const option = useMemo(() => ({
        grid: {
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            containLabel: false
        },
        tooltip: {
            trigger: 'item',
            formatter: params =>
                `ID: ${params.name}<br/>${feature}: ${params.value[2].toFixed(2)}`
        },
        visualMap: {
            min: minFeature,
            max: maxFeature,
            calculable: true,
            orient: 'horizontal',
            left: 'center',
            bottom: 10,
            inRange: {
                color: ['#313695', '#4575b4', '#74add1', '#abd9e9', '#e0f3f8', '#ffffbf', '#fee090', '#fdae61', '#f46d43', '#d73027', '#a50026']
            }
        },
        xAxis: { show: true, min: 0, max: naturalDimensions.width },
        yAxis: {
            show: true,
            min: 0,
            max: naturalDimensions.height,
            inverse: true
        },
        graphic: [{
            type: 'image',
            left: 0,
            top: 0,
            style: {
                image: imageUrl,
                width: naturalDimensions.width * displayScale,
                height: naturalDimensions.height * displayScale
            },
            z: 0
        }],
        series: [{
            type: 'scatter',
            coordinateSystem: 'cartesian2d',
            data: scatterData,
            symbolSize:  5 * displayScale,
            itemStyle: {
                borderColor: '#fff',
                borderWidth: 1 * displayScale
            },
            emphasis: {
                itemStyle: {
                    shadowBlur: 10,
                    shadowColor: 'rgba(0, 0, 0, 0.5)'
                }
            },
            z: 2
        }]
    }), [scatterData, displayScale, imageUrl, minFeature, maxFeature, feature, naturalDimensions]);

    return (
        <div
            ref={containerRef}
            style={{
                width: '100%',
                position: 'relative',
                aspectRatio: naturalDimensions.width > 0 ?
                    `${naturalDimensions.width / naturalDimensions.height}` : '1'
            }}
        >
            <ReactECharts
                key={`chart-${version}`}
                ref={chartRef}
                option={option}
                style={{
                    width: '100%',
                    height: '100%',
                    minWidth: '200px'
                }}
                opts={{
                    renderer: 'svg',
                    width: naturalDimensions.width * displayScale,
                    height: naturalDimensions.height * displayScale
                }}
                notMerge={true}
            />
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


export default EChartFeaturePlot;
