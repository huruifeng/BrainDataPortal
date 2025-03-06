import {create} from "zustand";
import {getGeneList, getSampleList, getMetaList, getUMAPData, getAllMetaData} from "../api/api.js";
import {getSampleMetaData, getExprData} from "../api/api.js";
import {getCoordinates, getImage} from "../api/visium.js";
import {toast} from "react-toastify";

const useSampleGeneMetaStore = create((set, get) => ({
    dataSet: null,
    geneList: [],
    sampleList: [],
    metaList: [],

    umapData: {},

    selectedSamples: [],
    imageDataDict: {},

    allMetaData: {},
    metaData: {},

    selectedGenes: [],
    exprDataDict: {},

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

    setMetaDataDict: async (meta) => {
        set({metaDataDict: meta});
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

    fetchGeneList: async (dataset_id = null, query_str = "AB") => {
        if (!dataset_id) {
            set({error: "fetchGeneList: No dataset selected", loading: false});
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

    fetchMetaData: async (dataset_id = null, meta = null) => {
        const {selectedSamples} = get();
        if (!dataset_id || dataset_id === "all") {
            set({error: "fetchMetaData: No dataset selected", loading: false});
            return;
        }

        // Don't reset loading state if no genes selected
        if (selectedSamples.length === 0) {
            set({metaData: []}); // Clear data without affecting loading state
            return;
        }

        set({loading: true, error: null});

        if (selectedSamples.length >= 1 && selectedSamples.includes("all")) {
            set({selectedSamples: ["all"]});
        }
        if(meta===null || meta === "") {
           set({metaData: []});
           return;
        }

        try {
            const response = await getSampleMetaData(dataset_id, selectedSamples, meta);
            get().metaData = response.data;
            set({loading: false});
        } catch (error) {
            set({error: "Failed to fetch UMAP data:" + error, loading: false});
        } finally {
            set({loading: false});
        }

    },

    fetchAllMetaData: async (dataset_id = null) => {
        if (!dataset_id || dataset_id === "all") {
            set({error: "fetchSampleMetaData: No dataset selected", loading: false});
            return;
        }

        set({loading: true, error: null});

        try {
            const response = await getAllMetaData(dataset_id);
            get().allMetaData = response.data;
            set({loading: false});

        } catch (error) {
            set({error: "Failed to fetch UMAP data:" + error, loading: false});
        } finally {
            set({loading: false});
        }

    },

    fetchUMAPData: async (dataset_id) => {
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
        const {dataSet, selectedGenes} = get();
        if (!dataSet || dataSet === "all") {
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
                    const response = await getExprData(dataSet, gene);
                    get().exprDataDict[gene] = response.data;
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

    fetchImageData: async () => {
        const {dataSet, selectedSamples} = get();
        if (!dataSet || dataSet === "all") {
            set({error: "fetchImageData: No dataset selected", loading: false});
            return;
        }

        set({loading: true, error: null});

        try {
            // Clear imageDataDict
            get().imageDataDict = {};
            for (var sample of selectedSamples) {
                if (!get().imageDataDict[sample]) {
                    const coor_response = await getCoordinates(dataSet, sample);
                    const img_response = await getImage(dataSet, sample);
                    get().imageDataDict[sample] = {
                        coordinates: coor_response.data.coordinates,
                        scales: coor_response.data.scales,
                        image: img_response.data
                    };
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
