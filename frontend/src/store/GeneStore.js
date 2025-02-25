import { create } from "zustand";
import {getUmapData} from "../api/api.js";

const useGeneStore = create((set, get) => ({
    dataSet: null,
    selectedSamples: [],
    selectedGenes: [],
    umapDataList: {},// Store API response data
    loading: false,
    error: null,
    currentGroup: "MajorCellTypes",
    currentColor: "MajorCellTypes",

    setDataset: async (dataset) => {
        set({ dataSet: dataset });
    },
    setSelectedSamples: async (samples) => {
        set({ selectedSamples: samples });
    },

    setSelectedGenes: async (genes) => {
        set({ selectedGenes: genes });
    },

    setCurrentGroup: async (group) => {
        set({ currentGroup: group });
    },

    setCurrentColor: async (color) => {
        set({ currentColor: color });
    },

    fetchUmapData: async (color,group) => {
        const { dataSet, selectedSamples, selectedGenes } = get();
        if(!dataSet){
            set({ error: "No dataset selected", loading: false });
            return;
        }

        set({ loading: true, error: null });

        try {
            if (!selectedGenes.length) {
                // Clear the umapDataList
                get().umapDataList = {};
                // if no gene selected, assign a value "all"
               const response = await getUmapData(dataSet,selectedSamples, ["all"],color,group);
               get().umapDataList["all"] = response.data;
            }else{
                for (var gene of selectedGenes) {
                    if(!get().umapDataList[gene]){
                        const response = await getUmapData(dataSet,selectedSamples, [gene],color,group);
                        get().umapDataList[gene] = response.data;
                    }
                }
                // remove gene item if it is not selected
                for (var key in get().umapDataList) {
                    if(!selectedGenes.includes(key)){
                        delete get().umapDataList[key];
                    }
                }
            }

            set({ umapDataList: get().umapDataList, loading: false });

            // const response = await getUmapData(dataSet,selectedSamples, selectedGenes);
            // set({ umapData: response.data, loading: false });
        } catch (error) {
            set({ error: "Failed to fetch UMAP data:"+error, loading: false });
        }
    },
}));

export default useGeneStore;
