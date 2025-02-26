import {create} from "zustand";
import {getGeneExprData, getGeneMeta_get} from "../api/api.js";
import {toast} from "react-toastify";

const useGeneStore = create((set, get) => ({
    dataSet: null,
    metaData: null,
    geneList: [],
    genemetaStatus: null,

    selectedSamples: [],
    selectedGenes: [],
    exprDataList: {},// Store API response data

    loading: false,
    error: null,
    // currentGroup: {value: "MajorCellTypes", type: "Categorical"},
    // currentColor: {value: "MajorCellTypes", type: "Categorical"},
    currentGroup: "MajorCellTypes",
    currentColor: "MajorCellTypes",

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

    setCurrentColor: async (color) => {
        set({currentColor: color});
    },
    setCurrentGroup: async (group) => {
        set({currentGroup: group});
    },

    fetchGeneMeta: async (dataset_id = null) => {
        set({loading: true, error: null});
        // toast.info("Loading data...");

        if (!dataset_id) {
            set({error: "No dataset selected", loading: false});
            return;
        }

        try {
            const response = await getGeneMeta_get(dataset_id);
            // toast.success("Data loaded successfully!");
            // console.log(response);
            if (response.status === 200) {
                const data = await response.data;
                await set({geneList: data.genes, metaData: data.meta, genemetaStatus: "success"});

            } else {
                console.error("Error fetching data:", response.data);
                await set({geneList: [], metaData: [], genefetchStatus: "failed"});
                toast.error("Failed to fetch gene list and metadata.");
            }

        } catch (error) {
            console.error("Error fetching data:", error);
            await set({geneList: [], metaData: [], genefetchStatus: "error"});
            toast.error("Error while fetching gene list and metadata.");
        }
    },

    fetchGeneExprData: async () => {
        const {dataSet,selectedGenes} = get();
        if (!dataSet || dataSet ==="all") {
            set({error: "No dataset selected", loading: false});
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
        }
    },
}));

export default useGeneStore;
