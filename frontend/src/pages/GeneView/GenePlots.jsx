import PlotlyStackedViolin from "./PlotlyStackedViolin.jsx";
import EChartMetaScatter from "./EChartMetaScatter.jsx";
import {useEffect, useMemo} from "react";
import "./GeneView.css";
import {isCategorical} from "../../utils/funcs.js";
import PropTypes from "prop-types";
import useSampleGeneMetaStore from "../../store/SempleGeneMetaStore.js";
import {toast} from "react-toastify";

function filterBySampleId(obj, sampleList) {
    const sampleSet = new Set(sampleList);
    return Object.fromEntries(
        Object.entries(obj).filter(([key, entry]) => sampleSet.has(entry.sample_id))
    );
}

const GeneMetaPlots = ({
                           geneList, sampleList, exprData,
                           cellMetaData, sampleMetaData, CellMetaMap, group, exprValueType
                       }) => {

    console.log("metaData", cellMetaData);

    const {pseudoExprDict, fetchPseudoExprData} = useSampleGeneMetaStore();

    // Calculate processed data directly using useMemo
    const {processedExprData, processedMetaData} = useMemo(() => {
        let newExprData = {...exprData};
        let newMetaData = Object.fromEntries(
            Object.entries(cellMetaData).map(([cs_id, csObj]) => {
                const newSubObj = {...csObj};  // shallow copy of inner object
                const targetValue = csObj[group];
                newSubObj[group] = CellMetaMap[group][targetValue][0];
                return [cs_id, newSubObj];
            })
        );
        let isValidPseudobulk = false;

        if (exprValueType === "pseudobulk") {
            const firstSampleMeta = Object.values(sampleMetaData)[0] || {};
            const keys = Object.keys(firstSampleMeta);
            isValidPseudobulk = keys.includes(group);

            if (!isValidPseudobulk) {
                toast.error(`${group} is not valid for pseudobulk plots.`);
            } else {
                newExprData = {...pseudoExprDict};
                newMetaData = {...sampleMetaData};
            }
        }

        if (!isValidPseudobulk && sampleList.length > 0 && !sampleList.includes("all")) {
            newMetaData = filterBySampleId(newMetaData, sampleList);
        }

        return {processedExprData: newExprData, processedMetaData: newMetaData};
    }, [exprValueType,geneList, group, sampleMetaData, pseudoExprDict, sampleList, cellMetaData, exprData]);

    useEffect(() => {
        fetchPseudoExprData();
    }, []);

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
                    <div id="stacked_violin_div" className={`violin-container`}>
                        <div key="stacked_violin" className="violin-item">
                            <div className="violin-wrapper">
                                {processedMetaData && (
                                    <PlotlyStackedViolin
                                        gene={"stackedviolin"}
                                        exprData={processedExprData}
                                        metaData={processedMetaData}
                                        group={group}
                                        type="boxplot"
                                    />
                                )}
                            </div>
                        </div>
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
                                        type="violin"
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
    exprData: PropTypes.object.isRequired,
    cellMetaData: PropTypes.object.isRequired,
    sampleMetaData: PropTypes.object.isRequired,
    CellMetaMap: PropTypes.object.isRequired,
    group: PropTypes.string.isRequired,
    exprValueType: PropTypes.string.isRequired
};

export default GeneMetaPlots;