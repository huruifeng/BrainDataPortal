import {create} from "zustand";
import {getGeneList, getSampleList, getMetaList, getUMAPData, getAllMetaData, getMetaDataOfSample} from "../api/api.js";
import {getAllSampleMetaData, getExprData, getPseudoExprData} from "../api/api.js";
import {getCoordinates, getImage} from "../api/visium.js";
import {toast} from "react-toastify";

const useSampleGeneMetaStore = create((set, get) => ({
    dataSet: null,
    geneList: [],
    sampleList: [],
    metaList: [],

    umapData: [],

    selectedSamples: [],
    imageDataDict: {},

    allMetaData: {},
    allSampleMetaData: {},
    sampleMetaDict: {},

    selectedGenes: [],
    exprDataDict: {},
    pseudoExprDict: {},

    loading: true,
    error: null,

    setDataset: async (dataset) => {
        set({dataSet: dataset});
    },

    setGeneList: async (genes) => {
        set({geneList: genes});
    },

    setSampleList: async (samples) => {
        set({sampleList: samples});
    },

    setAllMetaData: async (meta) => {
        set({allMetaData: meta});
    },

    setAllBulkMetaData: async (meta) => {
        set({allBulkMetaData: meta});
    },

    setSampleMetaDict: async (meta) => {
        set({sampleMetaDict: meta});
    },

    setExprDataDict: async (expr) => {
        set({exprDataDict: expr});
    },

    setSelectedSamples: async (samples) => {
        set({selectedSamples: samples});
    },

    setSelectedGenes: async (genes) => {
        set({selectedGenes: genes});
    },

    fetchGeneList: async (dataset_id = null, query_str = "") => {
        dataset_id = dataset_id ?? get().dataSet;
        if (!dataset_id) {
            set({error: "fetchGeneList: No dataset selected", loading: false});
            return;
        }
        if (query_str.length === 0) {
            query_str = "ABC";
        } else if (query_str.length < 3) {
            set({geneList: []});
            return;
        }

        try {
            const response = await getGeneList(dataset_id, query_str);
            if (response.status === 200) {
                const data = await response.data;
                await set({geneList: data});

            } else {
                console.error("Error fetching gene list:", response.message);
                await set({geneList: []});
                toast.error(response.message);
            }

        } catch (error) {
            console.error("Error fetching gene list:", error);
            await set({geneList: []});
            toast.error("Error while fetching gene list.");
            set({loading: false, error: "Error while fetching gene list."});
        } finally {
            set({loading: false}); // Ensure loading is false after completion
        }
    },

    fetchSampleList: async (dataset_id = null, query_str = "all") => {
        dataset_id = dataset_id ?? get().dataSet;
        if (!dataset_id) {
            set({error: "fetchSampleList: No dataset selected", loading: false});
            return;
        }

        try {
            const response = await getSampleList(dataset_id, query_str);
            if (response.status === 200) {
                const data = await response.data;
                await set({sampleList: data});

            } else {
                console.error("Error fetching sample list:", response.message);
                await set({sampleList: []});
                toast.error(response.message);
            }

        } catch (error) {
            console.error("Error fetching gene list:", error);
            await set({sampleList: []});
            toast.error("Error while fetching sample list.");
            set({loading: false, error: "Error while fetching sample list."});
        } finally {
            set({loading: false}); // Ensure loading is false after completion
        }
    },

    fetchMetaList: async (dataset_id = null, query_str = "all") => {
        dataset_id = dataset_id ?? get().dataSet;
        if (!dataset_id) {
            set({error: "fetchMetaList: No dataset selected", loading: false});
            return;
        }
        try {
            const response = await getMetaList(dataset_id, query_str);
            if (response.status === 200) {
                const data = await response.data;
                await set({metaList: data});

            } else {
                console.error("Error fetching meta list:", response.message);
                await set({metaList: []});
                toast.error(response.message);
            }

        } catch (error) {
            console.error("Error fetching meta list:", error);
            await set({metaList: []});
            toast.error("Error while fetching meta list.");
            set({loading: false, error: "Error while fetching meta list."});
        } finally {
            set({loading: false}); // Ensure loading is false after completion
        }
    },

    fetchMetaDataOfSample: async (dataset_id = null) => {
        dataset_id = dataset_id ?? get().dataSet;
        const {selectedSamples} = get();

        if (!dataset_id || dataset_id === "all") {
            set({error: "fetchSampleMetaData: No dataset selected", loading: false});
            return;
        }

        // Don't reset loading state if no genes selected
        if (selectedSamples.length === 0) {
            set({sampleMetaDict: {}}); // Clear data without affecting loading state
            return;
        }

        try {
            for (var sample of selectedSamples) {
                if (sample === "all") continue;
                if (!get().sampleMetaDict[sample]) {
                    const response = await getMetaDataOfSample(dataset_id, sample);
                    set({sampleMetaDict: {...get().sampleMetaDict, [sample]: response.data}});
                }
            }
        } catch (error) {
            set({error: "Failed to fetch sample meta data:" + error, loading: false});
        }

    },

    fetchAllSampleMetaData: async (dataset_id = null) => {
        dataset_id = dataset_id ?? get().dataSet;

        if (!dataset_id || dataset_id === "all") {
            set({error: "fetchAllSampleMetaData: No dataset selected", loading: false});
            return;
        }

        try {
            const response = await getAllSampleMetaData(dataset_id);
            set({allSampleMetaData: response.data});
        } catch (error) {
            set({error: "Failed to fetch sample meta data:" + error, loading: false});
        }


    },


    // In useSampleGeneMetaStore
    fetchAllMetaData: async (dataset_id = null) => {
        dataset_id = dataset_id ?? get().dataSet;
        if (!dataset_id || dataset_id === "all") {
            set({error: "fetchAllMetaData: No dataset selected"});
            return;
        }

        try {
            const response = await getAllMetaData(dataset_id);
            set({allMetaData: response.data}); // Update directly without loading state
        } catch (error) {
            console.error("Failed to fetch metadata:", error);
            set({error: "Failed to fetch all metadata:" + error});
        }
    },

    fetchUMAPData: async (dataset_id) => {
        dataset_id = dataset_id ?? get().dataSet;
        if (!dataset_id || dataset_id === "all") {
            set({error: "fetchUMAPData: No dataset selected", loading: false});
            return;
        }
        set({loading: true, error: null});

        try {
            const response = await getUMAPData(dataset_id);
            if (response.status === 200) {
                const data = await response.data;
                await set({umapData: data});
            } else {
                console.error("Error fetching UMAP data:", response.message);
                await set({umapData: []});
                toast.error(response.message);
            }

            set({loading: false});

        } catch (error) {
            set({error: "Failed to fetch UMAP data:" + error, loading: false});
        } finally {
            set({loading: false});
        }
    },

    fetchExprData: async (dataset_id) => {
        const {selectedGenes} = get();
        dataset_id = dataset_id ?? get().dataSet;
        if (!dataset_id || dataset_id === "all") {
            set({error: "fetchExprData: No dataset selected", loading: false});
            return;
        }

        // Don't reset loading state if no genes selected
        if (selectedGenes.length === 0) {
            set({exprDataDict: {}}); // Clear data without affecting loading state
            return;
        }

        set({loading: true, error: null});

        try {
            for (var gene of selectedGenes) {
                if (!get().exprDataDict[gene]) {
                    const response = await getExprData(dataset_id, gene);
                    set({exprDataDict: {...get().exprDataDict, [gene]: response.data}});
                }
            }
            // remove gene item if it is not selected
            for (var key in get().exprDataDict) {
                if (!selectedGenes.includes(key)) {
                    delete get().exprDataDict[key];
                }
            }

            set({loading: false});

        } catch (error) {
            set({error: "Failed to fetch expr data:" + error, loading: false});
        } finally {
            set({loading: false});
        }

    },

    fetchPseudoExprData: async (dataset_id) => {
        dataset_id = dataset_id ?? get().dataSet;
        const {selectedGenes} = get();
        if (!dataset_id || dataset_id === "all") {
            set({error: "fetchPseudoExprData: No dataset selected", loading: false});
            return;
        }

        set({loading: true, error: null});

        try {
            for (var gene of selectedGenes) {
                if (!get().pseudoExprDict[gene]) {
                    const response = await getPseudoExprData(dataset_id, gene);
                    set({pseudoExprDict: {...get().pseudoExprDict, [gene]: response.data}});
                }
            }
            // remove gene item if it is not selected
            for (var key in get().pseudoExprDict) {
                if (!selectedGenes.includes(key)) {
                    delete get().pseudoExprDict[key];
                }
            }

            set({loading: false});
        } catch (error) {
            set({error: "Failed to fetch pseudo expr data:" + error, loading: false});
        } finally {
            set({loading: false});
        }
    },

    fetchImageData: async (dataset_id) => {
        dataset_id = dataset_id ?? get().dataSet;
        const {selectedSamples} = get();
        if (!dataset_id || dataset_id === "all") {
            set({error: "fetchImageData: No dataset selected", loading: false});
            return;
        }

        set({loading: true, error: null});

        try {
            // get().imageDataDict = {};
            for (var sample of selectedSamples) {
                if (sample === "all") continue;
                if (!get().imageDataDict[sample]) {
                    const coor_response = await getCoordinates(dataset_id, sample);
                    const img_response = await getImage(dataset_id, sample);
                    set({
                        imageDataDict: {
                            ...get().imageDataDict, [sample]: {
                                coordinates: coor_response.data.coordinates,
                                scales: coor_response.data.scales,
                                image: img_response.data
                            }
                        }
                    })

                    // get().imageDataDict[sample] = {
                    //     coordinates: coor_response.data.coordinates,
                    //     scales: coor_response.data.scales,
                    //     image: img_response.data
                    // };
                }
            }
            // remove gene item if it is not selected
            for (var key in get().imageDataDict) {
                if (!selectedSamples.includes(key)) {
                    delete get().imageDataDict[key];
                }
            }

            set({loading: false});

        } catch (error) {
            set({error: "Failed to fetch VisiumST data:" + error, loading: false});
        }
    },


}));

export default useSampleGeneMetaStore;