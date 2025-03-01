import {useState, useEffect, useRef} from 'react';
import ReactECharts from 'echarts-for-react';
import PropTypes from "prop-types";

const EChartFeaturePlot = ({visiumData, geneData, metaData, feature}) => {
    const scaleFactors = visiumData.scales;
    const coordinates = visiumData.coordinates;
    const spotRadius = scaleFactors?.['spot.radius'] || 5;
    const sliceImage = visiumData.image;
    const imageBlob = sliceImage;

    // State to store the image URL and dimensions.
    const [imageUrl, setImageUrl] = useState('');
    const [imgDimensions, setImgDimensions] = useState({width: 1000, height: 800});

    // Create a URL from the blob and load the image to get its dimensions.
    useEffect(() => {
        if (imageBlob) {
            const url = URL.createObjectURL(imageBlob);
            setImageUrl(url);

            const img = new Image();
            img.src = url;
            img.onload = () => {
                setImgDimensions({width: img.width, height: img.height});
            };

            return () => {
                URL.revokeObjectURL(url);
            };
        }
    }, [imageBlob]);

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
        // Compute x,y coordinates (note: imagecol is x and imagerow is y)
        const x = item.imagecol * scaleFactors.lowres;
        const y = item.imagerow * scaleFactors.lowres;
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
        // Hide axes since we're displaying an image
        xAxis: {
            show: false,
            min: 0,
            max: imgDimensions.width
        },
        yAxis: {
            show: false,
            min: 0,
            max: imgDimensions.height,
            // Invert y-axis so that the origin (0,0) is at the top-left corner
            inverse: true
        },
        // The graphic component is used to render the background image.
        graphic: [{
            type: 'image',
            id: 'background',
            left: 0,
            top: 0,
            style: {
                image: imageUrl,
                width: imgDimensions.width,
                height: imgDimensions.height
            },
            z: 1
        }],
        // Scatter series for the spots
        series: [{
            type: 'scatter',
            coordinateSystem: 'cartesian2d',
            data: scatterData,
            // Adjust symbolSize using the spot.radius (multiplied by a factor for visibility)
            symbolSize: spotRadius * 660,
            z: 2,
            itemStyle: {
                borderColor: '#fff',
                borderWidth: 1
            }
        }]
    };

    return (
        <div style={{ height: '100%', width: '100%' }}>
            {option ? (
                <ReactECharts
                    option={option}
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