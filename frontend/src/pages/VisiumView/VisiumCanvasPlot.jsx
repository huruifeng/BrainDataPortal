import React, {useEffect, useRef, useState} from 'react';
import * as d3 from 'd3';
import PropTypes from "prop-types";

const FeaturePlot = ({visiumData, geneData, metaData, feature}) => {
    console.log("feature: ", feature);
    console.log("metaData: ", metaData);
    console.log("geneData: ", geneData);
    console.log("visiumData: ", visiumData);

    const canvasRef = useRef(null);
    const [data, setData] = useState(null);

    useEffect(() => {
        async function loadData() {
            try {
                // Fetch coordinates from the backend
                const coordinates = await visiumData.coordinates;
                const scaleFactors = await visiumData.scales;

                // Fetch gene expression data from the backend
                const colorValues = {};
                const isGene = Object.keys(geneData).includes(feature);
                const isMetaFeature = Object.keys(metaData[0]).includes(feature);
                if (isGene) {
                    const colorValues = geneData;
                    setData({coordinates, scaleFactors, colorValues});
                } else if (isMetaFeature) {
                    const colorValues = metaData.reduce((acc, meta) => {
                        acc[meta.cs_id] = meta[feature];
                        return acc;
                    }, {});
                    setData({coordinates, scaleFactors, colorValues});
                } else {
                    setData({coordinates, scaleFactors, colorValues: {}});
                }

                // Fetch the H&E image from the backend as a blob
                const imgResponse = await visiumData.image;
                const imgBlob = await imgResponse.blob();
                const imgUrl = URL.createObjectURL(imgBlob);

                // Create an Image element
                const img = new Image();
                img.src = imgUrl;
                img.crossOrigin = "Anonymous";
                img.onload = () => {
                    setData({coordinates, scaleFactors, colorValues, image: img});
                    // Clean up the object URL after the image has loaded
                    URL.revokeObjectURL(imgUrl);
                };
            } catch (error) {
                console.error("Error loading data:", error);
            }
        }

        loadData();
    }, []);

    useEffect(() => {
        if (!data || !canvasRef.current) return;

        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');

        // Set canvas dimensions to match the loaded image
        canvas.width = data.image.width;
        canvas.height = data.image.height;

        // Draw the H&E background image
        ctx.drawImage(data.image, 0, 0);

        // Use the "spot" scaling factor (adjust if needed, e.g., use "hires")
        const scale = data.scaleFactors.spot;

        // Get expression range to define a color scale
        const exprValues = Object.values(data.colorValues);
        const minExpr = Math.min(...exprValues);
        const maxExpr = Math.max(...exprValues);

        // Create a d3 color scale using Viridis
        const colorScale = d3.scaleSequential(d3.interpolateViridis)
        .domain([minExpr, maxExpr]);

        // Assume coordinates is an array of spot objects with keys:
        // spot_id, imagecol, and imagerow.
        data.coordinates.forEach(spot => {
            const spotId = spot.spot_id;
            const expr = data.colorValues[spotId] || 0;

            // Convert the spot's coordinates using the scale factor
            const x = spot.imagecol * scale;
            const y = spot.imagerow * scale;

            // Draw a circle for the spot
            ctx.beginPath();
            ctx.arc(x, y, 10, 0, 2 * Math.PI); // radius set to 10 (adjust as needed)
            ctx.fillStyle = colorScale(expr);
            ctx.fill();
            ctx.strokeStyle = 'white';
            ctx.lineWidth = 1;
            ctx.stroke();
        });
    }, [data]);

    return (
        <div>
            {!data ? (
                <p>Loading...</p>
            ) : (
                <canvas ref={canvasRef} style={{border: '1px solid #ccc'}}/>
            )}
        </div>
    );
};
FeaturePlot.propTypes = {
    visiumData: PropTypes.object.isRequired,
    geneData: PropTypes.object.isRequired,
    metaData: PropTypes.array.isRequired,
    feature: PropTypes.string.isRequired,
};
export default FeaturePlot;
