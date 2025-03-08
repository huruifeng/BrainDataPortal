import PlotlyStackedViolin from "./PlotlyStackedViolin.jsx";
import EChartMetaScatter from "./EChartMetaScatter.jsx";
import {useState, useEffect} from "react";

import "./GeneView.css";
import {isCategorical} from "../../utils/funcs.js";
import PropTypes from "prop-types";
import useSampleGeneMetaStore from "../../store/SempleGeneMetaStore.js";

function filterBySampleId(obj, sampleList) {
    const sampleSet = new Set(sampleList);
    return Object.fromEntries(
        Object.entries(obj).filter(([key, entry]) => sampleSet.has(entry.sample_id)
        ));
}

const GeneMetaPlots = ({sampleList, metaData, exprData, group, exprValueType}) => {
    console.log("exprValueType", exprValueType)

    if (sampleList.length === 0) {
        sampleList = ["all"];
    }

    const [isCat, setIsCat] = useState(false);

    const {pseudoExprDict, fetchPseudoExprData} = useSampleGeneMetaStore();


    if (sampleList.length >= 1 && !sampleList.includes("all")) {
        metaData = filterBySampleId(metaData, sampleList);
    }

    if (sampleList.length <= 5 && !sampleList.includes("all")) {
        exprValueType = 'celllevel';
    }

    useEffect(() => {
        if (exprValueType === 'pseudobulk') {
            fetchPseudoExprData();
            exprData = pseudoExprDict;
        }
    }, [exprValueType]);

    const metaValues = Object.values(metaData).map((meta) => meta[group]);

    useEffect(() => {
        setIsCat(isCategorical(metaValues));
    }, [metaValues]); // Dependency array ensures this runs only when metaValues change


    const plotClass = Object.keys(exprData).length <= 1
        ? "single-plot" : Object.keys(exprData).length === 2
            ? "two-plots" : Object.keys(exprData).length === 3
                ? "three-plots" : "four-plots";


    return (
        <>
            {isCat ? (
                exprValueType === 'pseudobulk' ? (
                    <div id="meta_scatter_div" className={`umap-container ${plotClass}`}>
                        {Object.entries(exprData).map(([gene, expr_data]) => (
                            <div key={gene} className="umap-item">
                                <div className="umap-wrapper">
                                    {metaData && (
                                        <EChartMetaScatter
                                            gene={gene}
                                            exprData={expr_data}
                                            metaData={metaData}
                                            group={group}
                                        />
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                ):(
                    <div id="stacked_violin_div" className={`violin-container`}>
                        <div key="stacked_violin" className="violin-item">
                            <div className="violin-wrapper">
                                {metaData && (
                                    <PlotlyStackedViolin
                                        gene={"stackedviolin"}
                                        exprData={exprData}
                                        metaData={metaData}
                                        group={group}
                                    />
                                )}
                            </div>
                        </div>
                    </div>
                )
            ) : (
                <div id="meta_scatter_div" className={`umap-container ${plotClass}`}>
                    {Object.entries(exprData).map(([gene, expr_data]) => (
                        <div key={gene} className="umap-item">
                            <div className="umap-wrapper">
                                {metaData && (
                                    <EChartMetaScatter
                                        gene={gene}
                                        exprData={expr_data}
                                        metaData={metaData}
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

// {Object.keys(allMetaData).length >= 1 && isCat ?
// <div id="stacked_violin_div" className={`violin-container`}>
//     <div key='stacked_violin' className="violin-item">
//         <div className="violin-wrapper">
//             {allMetaData &&
//                 <PlotlyStackedViolin gene={"stackedviolin"}
//                                      sampleList={selectedSamples}
//                                      exprData={exprDataDict}
//                                      metaData={allMetaData}
//                                      group={grouping}/>}
//         </div>
//     </div>
// </div>
// :
// <div id="meta_scatter_div" className={`umap-container ${plotClass}`}>
//     {Object.entries(exprDataDict).map(([gene, expr_data]) => (
//         <div key={gene} className="umap-item">
//             <div className="umap-wrapper">
//                 {allMetaData && <EChartMetaScatter gene={gene}
//                                                    sampleList={selectedSamples}
//                                                    exprData={expr_data}
//                                                    metaData={allMetaData}
//                                                    group={grouping}/>}
//             </div>
//         </div>
//     ))}
// </div>
// }