import { create } from "zustand";
import {getUmapData} from "../api/api.js";

const useGeneStore = create((set, get) => ({
    dataSet: null,
    selectedSamples: [],
    selectedGenes: [],
    umapData: null, // Store API response data
    metaData: null,
    loading: false,
    error: null,

    setDataset: async (dataset) => {
        set({ dataSet: dataset });
    },
    setSelectedSamples: async (samples) => {
        set({ selectedSamples: samples });
    },

    setSelectedGenes: async (genes) => {
        set({ selectedGenes: genes });
    },

    fetchUmapData: async () => {
        const { dataSet, selectedSamples, selectedGenes } = get();
        if(!dataSet){
            set({ error: "No dataset selected", loading: false });
            return;
        }

        set({ loading: true, error: null });

        try {
            const response = await getUmapData(dataSet,selectedSamples, selectedGenes);
            set({ umapData: response.data, loading: false });
        } catch (error) {
            set({ error: "Failed to fetch UMAP data:"+error, loading: false });
        }
    },
}));

export default useGeneStore;
