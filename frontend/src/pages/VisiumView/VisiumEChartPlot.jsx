import {useEffect, useRef, useState} from 'react';
import ReactECharts from 'echarts-for-react';
import PropTypes from "prop-types";

const EChartFeaturePlot = ({visiumData, geneData, metaData, feature}) => {
    const chartRef = useRef(null);

    const scaleFactors = visiumData.scales;
    const coordinates = visiumData.coordinates;
    const imageBlob = visiumData.image;

    // State for responsive dimensions
    const [containerSize, setContainerSize] = useState({width: 400, height: 400});
    const [imgAspectRatio, setImgAspectRatio] = useState(1);


    // Create image URL and calculate aspect ratio
    const [imageUrl, setImageUrl] = useState('');
    useEffect(() => {
        if (imageBlob) {
            const url = URL.createObjectURL(imageBlob);
            setImageUrl(url);

            const img = new Image();
            img.src = url;
            img.onload = () => {
                const ar = img.height / img.width;
                setImgAspectRatio(ar);
            };
            return () => URL.revokeObjectURL(url);
        }
    }, [imageBlob]);

    // Responsive container sizing
    useEffect(() => {
        const updateSize = () => {
            if (chartRef.current) {
                const {width} = chartRef.current.ele.getBoundingClientRect();
                setContainerSize({
                    width,
                    height: width * imgAspectRatio
                });
            }
        };

        updateSize();
        window.addEventListener('resize', updateSize);
        return () => window.removeEventListener('resize', updateSize);
    }, [imgAspectRatio]);

    // Fetch gene expression data from the backend
    let featuredData = {};
    const isGene = Object.keys(geneData).includes(feature);
    const isMetaFeature = Object.keys(metaData?.[0] || []).includes(feature);
    if (isGene) {
        featuredData = geneData;
    } else if (isMetaFeature) {
        metaData.forEach((item) => {
            featuredData[item.cs_id] = item[feature];
        });
    } else {
        featuredData = {};
    }

    // Transform visiumData: scale coordinates and attach the feature value.
    const scatterData = coordinates.map(item => {
        // Compute x,y coordinates (note: imagerow is x and imagecol is y)
        const y = item.imagecol * scaleFactors.lowres;
        const x = item.imagerow * scaleFactors.lowres;
        // Get the nCount_Spatial value for the current spot (default to 0 if missing)
        const featureValue = featuredData[item.cs_id] || 0;
        return {
            name: item.cs_id,
            // We store the feature value in the third coordinate for later use.
            value: [x, y, featureValue]
        };
    });

    // Calculate min and max feature values for the visual mapping.
    const featureValues =  Object.values(featuredData);
    const minFeature = Math.min(...featureValues);
    const maxFeature = Math.max(...featureValues);

    // Configure the ECharts option.
    const option = {
        tooltip: {
            trigger: 'item',
            formatter: params => {
                return `ID: ${params.name}<br/>${feature}: ${params.value[2]}`;
            }
        },
        // visualMap maps the nCount_Spatial values to a color gradient.
        visualMap: {
            min: minFeature,
            max: maxFeature,
            calculable: true,
            orient: 'horizontal',
            left: 'center',
            bottom: 10,
            inRange: {
                color: ['blue', 'green', 'yellow', 'red']
            }
        },
        xAxis: {
            show: false,
            min: 0,
            max: containerSize.width
        },
        yAxis: {
            show: false,
            min: 0,
            max: containerSize.height,
            inverse: true
        },
        // The graphic component is used to render the background image.
        graphic: [{
            type: 'image',
            left: 0,
            top: 0,
            style: {
                image: imageUrl,
                width: '100%',
                height: '100%'
            },
            z: 1
        }],
        // Scatter series for the spots
        series: [{
            type: 'scatter',
            coordinateSystem: 'cartesian2d',
            data: scatterData,
            // Adjust symbolSize using the spot.radius (multiplied by a factor for visibility)
             symbolSize: 12 * (containerSize.width / 1000),
            z: 2,
            itemStyle: {
                borderColor: '#fff',
                borderWidth: 1
            }
        }]
    };

    return (
        <div style={{
            width: '100%',
            height: '100%',
            minWidth: '200px',
            position: 'relative'
        }}>
            <div style={{
                paddingTop: `${imgAspectRatio * 100}%`,
                position: 'relative'
            }}>
                <ReactECharts
                    ref={chartRef}
                    option={option}
                    style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%'
                    }}
                    opts={{
                        renderer: 'svg',
                        width: containerSize.width,
                        height: containerSize.height
                    }}
                />
            </div>
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