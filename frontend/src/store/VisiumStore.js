import {create} from "zustand";
import {getGeneExprData, getGeneMeta} from "../api/api.js";
import {getImageData} from "../api/visium.js";
import {toast} from "react-toastify";

const useVisiumStore = create((set, get) => ({
    dataSet: null,
    metaData: [],
    geneList: [],
    genemetaStatus: null,

    selectedSamples: [],
    imageDataList: {},

    selectedGenes: [],
    exprDataList: {},

    loading: true,
    error: null,

    setDataset: async (dataset) => {
        set({dataSet: dataset});
    },

    setGeneList: async (genes) => {
        set({geneList: genes});
    },

    setMetaData: async (meta) => {
        set({metaData: meta});
    },

    setSelectedSamples: async (samples) => {
        set({selectedSamples: samples});
    },

    setSelectedGenes: async (genes) => {
        set({selectedGenes: genes});
    },

    fetchGeneMeta: async (dataset_id = null) => {
        set({loading: true, error: null});
        // toast.info("Loading data...");

        if (!dataset_id) {
            set({error: "No dataset selected", loading: false});
            return;
        }

        try {
            const response = await getGeneMeta(dataset_id,"visium");
            // toast.success("Data loaded successfully!");
            // console.log(response);
            if (response.status === 200) {
                const data = await response.data;
                await set({geneList: data.genes, metaData: data.meta, genemetaStatus: "success"});

            } else {
                console.error("Error fetching data:", response.message);
                await set({geneList: [], metaData: [], genefetchStatus: "failed"});
                toast.error(response.message);
            }

        } catch (error) {
            console.error("Error fetching data:", error);
            await set({geneList: [], metaData: [], genefetchStatus: "error"});
            toast.error("Error while fetching gene list and metadata.");
            set({loading: false, error: "Error while fetching gene list and metadata."});
        }finally {
            set({ loading: false }); // Ensure loading is false after completion
        }
    },

    fetchGeneExprData: async () => {
        const {dataSet,selectedGenes} = get();
        if (!dataSet || dataSet ==="all") {
            set({error: "No dataset selected", loading: false});
            return;
        }

        // Don't reset loading state if no genes selected
        if (selectedGenes.length === 0) {
            set({ exprDataList: {} }); // Clear data without affecting loading state
            return;
        }

        set({loading: true, error: null});

        try {
            // Clear the exprDataList
            get().exprDataList = {};
            for (var gene of selectedGenes) {
                if (!get().exprDataList[gene]) {
                    const response = await getGeneExprData(dataSet, gene);
                    get().exprDataList[gene] = response.data;
                }
            }
            // remove gene item if it is not selected
            for (var key in get().exprDataList) {
                if (!selectedGenes.includes(key)) {
                    delete get().exprDataList[key];
                }
            }

            set({loading: false});

        } catch (error) {
            set({error: "Failed to fetch UMAP data:" + error, loading: false});
        } finally {
            set({ loading: false });
        }

    },

    fetchImageData: async () => {
        const {dataSet,selectedSamples} = get();
        if (!dataSet || dataSet ==="all") {
            set({error: "No dataset selected", loading: false});
            return;
        }

        set({loading: true, error: null});

        try {
            // Clear the exprDataList
            get().imageDataList = {};
            for (var sample of selectedSamples) {
                if (!get().imageDataList[sample]) {
                    const response = await getImageData(dataSet, sample);
                    get().imageDataList[sample] = response.data;
                }
            }
            // remove gene item if it is not selected
            for (var key in get().imageDataList) {
                if (!selectedSamples.includes(key)) {
                    delete get().imageDataList[key];
                }
            }

            set({loading: false});

        } catch (error) {
            set({error: "Failed to fetch VisiumST data:" + error, loading: false});
        }
    },



}));

export default useVisiumStore;
