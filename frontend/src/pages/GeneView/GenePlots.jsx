import PlotlyStackedViolin from "./PlotlyStackedViolin.jsx";
import EChartMetaScatter from "./EChartMetaScatter.jsx";
import { useState, useEffect } from "react";
import "./GeneView.css";
import { isCategorical } from "../../utils/funcs.js";
import PropTypes from "prop-types";
import useSampleGeneMetaStore from "../../store/SempleGeneMetaStore.js";
import { toast } from "react-toastify";

function filterBySampleId(obj, sampleList) {
    const sampleSet = new Set(sampleList);
    return Object.fromEntries(
        Object.entries(obj).filter(([key, entry]) => sampleSet.has(entry.sample_id))
    );
}

const GeneMetaPlots = ({ sampleList, metaData, exprData, group, exprValueType }) => {
    const { pseudoExprDict, fetchPseudoExprData, sampleMetaData, fetchSampleMetaData } = useSampleGeneMetaStore();
    const [processedExprData, setProcessedExprData] = useState(exprData);
    const [processedMetaData, setProcessedMetaData] = useState(metaData);

    useEffect(() => {
        fetchPseudoExprData();
        fetchSampleMetaData();
    }, []);

    useEffect(() => {
        let newExprData = exprData;
        let newMetaData = metaData;

        let isValidPseudobulk = false;

        // Handle pseudobulk validation
        if (exprValueType === "pseudobulk") {
            const firstSampleMeta = Object.values(sampleMetaData)[0] || {};
            const keys = Object.keys(firstSampleMeta);
            isValidPseudobulk = keys.includes(group);

            if (!isValidPseudobulk) {
                toast.error(`${group} is not valid for pseudobulk plots.`);
            } else {
                newExprData = pseudoExprDict;
                newMetaData = sampleMetaData;
            }
        }

        // Apply sample filtering only for cell-level data
        if (!isValidPseudobulk && sampleList.length > 0 && !sampleList.includes("all")) {
            newMetaData = filterBySampleId(newMetaData, sampleList);
        }

        setProcessedExprData(newExprData);
        setProcessedMetaData(newMetaData);
    }, [exprValueType, group, sampleMetaData, pseudoExprDict, sampleList, metaData, exprData]);

    const metaValues = Object.values(processedMetaData).map((meta) => meta[group]);
    const isCat = isCategorical(metaValues);
    const isUsingPseudobulk = exprValueType === "pseudobulk" && processedExprData === pseudoExprDict;

    const plotClass = Object.keys(processedExprData).length <= 1
        ? "single-plot" : Object.keys(processedExprData).length === 2
            ? "two-plots" : Object.keys(processedExprData).length === 3
                ? "three-plots" : "four-plots";

    return (
        <>
            {isCat ? (
                isUsingPseudobulk ? (
                    <div id="meta_scatter_div" className={`umap-container ${plotClass}`}>
                        {Object.entries(processedExprData).map(([gene, expr_data]) => (
                            <div key={gene} className="umap-item">
                                <div className="umap-wrapper">
                                    {processedMetaData && (
                                        <EChartMetaScatter
                                            gene={gene}
                                            exprData={expr_data}
                                            metaData={processedMetaData}
                                            group={group}
                                        />
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div id="stacked_violin_div" className={`violin-container`}>
                        <div key="stacked_violin" className="violin-item">
                            <div className="violin-wrapper">
                                {processedMetaData && (
                                    <PlotlyStackedViolin
                                        gene={"stackedviolin"}
                                        exprData={processedExprData}
                                        metaData={processedMetaData}
                                        group={group}
                                    />
                                )}
                            </div>
                        </div>
                    </div>
                )
            ) : (
                <div id="meta_scatter_div" className={`umap-container ${plotClass}`}>
                    {Object.entries(processedExprData).map(([gene, expr_data]) => (
                        <div key={gene} className="umap-item">
                            <div className="umap-wrapper">
                                {processedMetaData && (
                                    <EChartMetaScatter
                                        gene={gene}
                                        exprData={expr_data}
                                        metaData={processedMetaData}
                                        group={group}
                                    />
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </>
    );
};

GeneMetaPlots.propTypes = {
    sampleList: PropTypes.array.isRequired,
    metaData: PropTypes.object.isRequired,
    exprData: PropTypes.object.isRequired,
    group: PropTypes.string.isRequired,
    exprValueType: PropTypes.string.isRequired
};

export default GeneMetaPlots;