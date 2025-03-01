import React, {useEffect, useRef, useState} from 'react';
import * as d3 from 'd3';
import PropTypes from "prop-types";

const FeaturePlot = ({visiumData, geneData, metaData, feature}) => {
    console.log("feature: ", feature);
    console.log("metaData: ", metaData);
    console.log("geneData: ", geneData);
    console.log("visiumData: ", visiumData);

    const coordinates = visiumData.coordinates;
    const scaleFactors = visiumData.scales;
    const sliceImage = visiumData.image;
    const imgBlob = sliceImage;
    const imgUrl = URL.createObjectURL(imgBlob);

    let featuredData = {};
    const isMetaFeature = Object.keys(metaData[0]).includes(feature);
    if (isMetaFeature) {
        metaData.forEach((item) => {
            featuredData[item.cs_id] = item[feature];
        });
    } else {
        geneData.forEach((item) => {
            featuredData[item.cs_id] = item[feature];
        });
    }

    const containerRef = useRef(null);
    const imgRef = useRef(null);
    const canvasRef = useRef(null);

    useEffect(() => {
        const img = imgRef.current;
        if (!img) return;

        const redraw = () => {
            const naturalWidth = img.naturalWidth;
            const naturalHeight = img.naturalHeight;
            const displayedWidth = img.offsetWidth;
            const displayedHeight = img.offsetHeight;

            if (!naturalWidth || !naturalHeight) return;

            const scaleX = displayedWidth / naturalWidth;
            const scaleY = displayedHeight / naturalHeight;

            const canvas = canvasRef.current;
            if (!canvas) return;

            canvas.width = displayedWidth;
            canvas.height = displayedHeight;
            const ctx = canvas.getContext('2d');
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            // Get valid data values
            const validEntries = coordinates
            .map(spot => ({
                ...spot,
                value: featuredData[spot.cs_id]
            }))
            .filter(entry => typeof entry.value === 'number');

            if (validEntries.length === 0) return;

            // Calculate min/max for color scaling
            const values = validEntries.map(entry => entry.value);
            const min = Math.min(...values);
            const max = Math.max(...values);

            // Color interpolation function (blue to red)
            const getColor = (value) => {
                const ratio = (value - min) / (max - min || 1);
                const hue = 240 - (ratio * 240); // 240 (blue) to 0 (red)
                return `hsl(${hue}, 100%, 50%)`;
            };

            // Calculate spot positions and draw
            validEntries.forEach(spot => {
                const x = spot.imagecol * scaleFactors.hires * scaleX;
                const y = spot.imagerow * scaleFactors.hires * scaleY;

                ctx.beginPath();
                ctx.arc(x, y, 3, 0, 2 * Math.PI); // Fixed radius of 3px
                ctx.fillStyle = getColor(spot.value);
                ctx.fill();
            });
        };

        img.addEventListener('load', redraw);

        // Handle container resize
        const resizeObserver = new ResizeObserver(redraw);
        if (containerRef.current) {
            resizeObserver.observe(containerRef.current);
        }

        return () => {
            img.removeEventListener('load', redraw);
            resizeObserver.disconnect();
        };
    }, [coordinates, scaleFactors, featuredData, imgBlob]);

    return (
        <div ref={containerRef} style={{position: 'relative', width: '100%', height: '100%'}}>
            <img
                ref={imgRef}
                src={imgUrl}
                style={{
                    width: '100%',
                    height: 'auto',
                    display: 'block' // Remove extra space under image
                }}
                alt="Spatial tissue"
            />
            <canvas
                ref={canvasRef}
                style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    pointerEvents: 'none' // Allow interactions with underlying elements
                }}
            />
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
