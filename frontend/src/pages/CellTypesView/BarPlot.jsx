"use client"

import {useEffect, useRef, useState} from "react"
import PropTypes from "prop-types"
import Plotly from "plotly.js-dist-min"
import {FormControl, InputLabel, Select, MenuItem} from "@mui/material"

const BarPlot = ({cellCounts, selectedCellTypes}) => {
    const plotRef = useRef(null)
    const [comparisonType, setComparisonType] = useState("pd_vs_control")

    useEffect(() => {
        if (!cellCounts || !plotRef.current) return

        // Filter data based on selected cell types
        const filteredCounts = {}
        selectedCellTypes.forEach((cellType) => {
            if (cellCounts[cellType]) {
                filteredCounts[cellType] = cellCounts[cellType]
            }
        })

        const traces = []

        switch (comparisonType) {
            case "pd_vs_control":
                // PD vs Control comparison
                Object.entries(filteredCounts).forEach(([cellType, data]) => {
                    const pdData = data.filter((item) => item.condition === "PD")
                    const controlData = data.filter((item) => item.condition === "Control")

                    const pdAvg = pdData.reduce((sum, item) => sum + item.count, 0) / (pdData.length || 1)
                    const controlAvg = controlData.reduce((sum, item) => sum + item.count, 0) / (controlData.length || 1)

                    traces.push({
                        x: [`${cellType} - PD`],
                        y: [pdAvg],
                        type: "bar",
                        name: `${cellType} - PD`,
                        marker: {color: "red"},
                        error_y: {
                            type: "data",
                            array: [calculateStdError(pdData.map((item) => item.count))],
                            visible: true,
                        },
                    })

                    traces.push({
                        x: [`${cellType} - Control`],
                        y: [controlAvg],
                        type: "bar",
                        name: `${cellType} - Control`,
                        marker: {color: "blue"},
                        error_y: {
                            type: "data",
                            array: [calculateStdError(controlData.map((item) => item.count))],
                            visible: true,
                        },
                    })
                })
                break

            case "male_vs_female":
                // Male vs Female comparison
                Object.entries(filteredCounts).forEach(([cellType, data]) => {
                    const maleData = data.filter((item) => item.sex === "Male")
                    const femaleData = data.filter((item) => item.sex === "Female")

                    const maleAvg = maleData.reduce((sum, item) => sum + item.count, 0) / (maleData.length || 1)
                    const femaleAvg = femaleData.reduce((sum, item) => sum + item.count, 0) / (femaleData.length || 1)

                    traces.push({
                        x: [`${cellType} - Male`],
                        y: [maleAvg],
                        type: "bar",
                        name: `${cellType} - Male`,
                        marker: {color: "green"},
                        error_y: {
                            type: "data",
                            array: [calculateStdError(maleData.map((item) => item.count))],
                            visible: true,
                        },
                    })

                    traces.push({
                        x: [`${cellType} - Female`],
                        y: [femaleAvg],
                        type: "bar",
                        name: `${cellType} - Female`,
                        marker: {color: "purple"},
                        error_y: {
                            type: "data",
                            array: [calculateStdError(femaleData.map((item) => item.count))],
                            visible: true,
                        },
                    })
                })
                break

            case "pd_vs_control_male":
                // PD vs Control within Male
                Object.entries(filteredCounts).forEach(([cellType, data]) => {
                    const pdMaleData = data.filter((item) => item.condition === "PD" && item.sex === "Male")
                    const controlMaleData = data.filter((item) => item.condition === "Control" && item.sex === "Male")

                    const pdMaleAvg = pdMaleData.reduce((sum, item) => sum + item.count, 0) / (pdMaleData.length || 1)
                    const controlMaleAvg =
                        controlMaleData.reduce((sum, item) => sum + item.count, 0) / (controlMaleData.length || 1)

                    traces.push({
                        x: [`${cellType} - PD Male`],
                        y: [pdMaleAvg],
                        type: "bar",
                        name: `${cellType} - PD Male`,
                        marker: {color: "darkred"},
                        error_y: {
                            type: "data",
                            array: [calculateStdError(pdMaleData.map((item) => item.count))],
                            visible: true,
                        },
                    })

                    traces.push({
                        x: [`${cellType} - Control Male`],
                        y: [controlMaleAvg],
                        type: "bar",
                        name: `${cellType} - Control Male`,
                        marker: {color: "darkblue"},
                        error_y: {
                            type: "data",
                            array: [calculateStdError(controlMaleData.map((item) => item.count))],
                            visible: true,
                        },
                    })
                })
                break

            case "pd_vs_control_female":
                // PD vs Control within Female
                Object.entries(filteredCounts).forEach(([cellType, data]) => {
                    const pdFemaleData = data.filter((item) => item.condition === "PD" && item.sex === "Female")
                    const controlFemaleData = data.filter((item) => item.condition === "Control" && item.sex === "Female")

                    const pdFemaleAvg = pdFemaleData.reduce((sum, item) => sum + item.count, 0) / (pdFemaleData.length || 1)
                    const controlFemaleAvg =
                        controlFemaleData.reduce((sum, item) => sum + item.count, 0) / (controlFemaleData.length || 1)

                    traces.push({
                        x: [`${cellType} - PD Female`],
                        y: [pdFemaleAvg],
                        type: "bar",
                        name: `${cellType} - PD Female`,
                        marker: {color: "salmon"},
                        error_y: {
                            type: "data",
                            array: [calculateStdError(pdFemaleData.map((item) => item.count))],
                            visible: true,
                        },
                    })

                    traces.push({
                        x: [`${cellType} - Control Female`],
                        y: [controlFemaleAvg],
                        type: "bar",
                        name: `${cellType} - Control Female`,
                        marker: {color: "lightblue"},
                        error_y: {
                            type: "data",
                            array: [calculateStdError(controlFemaleData.map((item) => item.count))],
                            visible: true,
                        },
                    })
                })
                break

            default:
                break
        }

        const layout = {
            title: getComparisonTitle(comparisonType),
            yaxis: {
                title: "Average Cell Count",
                zeroline: true,
            },
            barmode: "group",
            margin: {
                l: 50,
                r: 50,
                b: 150,
                t: 50,
                pad: 4,
            },
            height: 400,
        }

        Plotly.newPlot(plotRef.current, traces, layout, {
            responsive: true,
            displayModeBar: true,
        })

        // Cleanup
        return () => {
            if (plotRef.current) {
                Plotly.purge(plotRef.current)
            }
        }
    }, [cellCounts, selectedCellTypes, comparisonType])

    // Helper function to calculate standard error
    const calculateStdError = (values) => {
        if (!values || values.length <= 1) return 0

        const mean = values.reduce((sum, val) => sum + val, 0) / values.length
        const variance = values.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / (values.length - 1)
        const stdDev = Math.sqrt(variance)
        return stdDev / Math.sqrt(values.length)
    }

    const getComparisonTitle = (type) => {
        switch (type) {
            case "pd_vs_control":
                return "Cell Counts: PD vs Control"
            case "male_vs_female":
                return "Cell Counts: Male vs Female"
            case "pd_vs_control_male":
                return "Cell Counts: PD vs Control (Male)"
            case "pd_vs_control_female":
                return "Cell Counts: PD vs Control (Female)"
            default:
                return "Cell Counts"
        }
    }

    return (
        <div style={{minHeight: "450px"}}>
            <FormControl variant="standard" sx={{width: "250px", marginBottom: "20px"}}>
                <InputLabel id="comparison-type-label">Comparison Type</InputLabel>
                <Select
                    labelId="comparison-type-label"
                    id="comparison-type-select"
                    value={comparisonType}
                    onChange={(e) => setComparisonType(e.target.value)}
                    size="small"
                >
                    <MenuItem value="pd_vs_control">PD vs Control</MenuItem>
                    <MenuItem value="male_vs_female">Male vs Female</MenuItem>
                    <MenuItem value="pd_vs_control_male">PD vs Control (Male)</MenuItem>
                    <MenuItem value="pd_vs_control_female">PD vs Control (Female)</MenuItem>
                </Select>
            </FormControl>
            <div ref={plotRef} style={{width: "100%", height: "400px", minHeight: "400px"}}/>
        </div>
    )
}

BarPlot.propTypes = {
    cellCounts: PropTypes.object.isRequired,
    selectedCellTypes: PropTypes.array.isRequired,
}

export default BarPlot

