import { create } from "zustand";
import {getUmapData} from "../api/api.js";

const useUmapStore = create((set, get) => ({
  selectedSamples: [],
  selectedGenes: [],
  umapData: null, // Store API response data
  loading: false,
  error: null,

  setSelectedSamples: async (samples) => {
    set({ selectedSamples: samples });
    await get().fetchUmapData();
  },

  setSelectedGenes: async (genes) => {
    set({ selectedGenes: genes });
    await get().fetchUmapData();
  },

  fetchUmapData: async () => {
    const { selectedSamples, selectedGenes } = get();
    if (selectedSamples.length === 0 || selectedGenes.length === 0) return;

    set({ loading: true, error: null });

    try {
      const response = await getUmapData(selectedSamples, selectedGenes);
      set({ umapData: response.data, loading: false });
    } catch (error) {
      set({ error: "Failed to fetch UMAP data", loading: false });
    }
  },
}));

export default useUmapStore;
