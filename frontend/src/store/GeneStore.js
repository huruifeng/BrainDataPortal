import { create } from "zustand";
import {getUmapData} from "../api/api.js";

const useGeneStore = create((set, get) => ({
  selectedSamples: [],
  selectedGenes: [],
  umapData: null,
  loading: false,
  error: null,

  setSelections: async (samples, genes) => {
    set({ selectedSamples: samples, selectedGenes: genes });
    await get().fetchUmapData();
  },

  fetchUmapData: async () => {
    const { selectedSamples, selectedGenes } = get();
    if (selectedSamples.length === 0) selectedSamples.push("all");
    if (selectedGenes.length === 0) selectedGenes.push("all");

    set({ loading: true, error: null });
    try {
      const response = await getUmapData(selectedSamples, selectedGenes);
      set({ umapData: response.data, loading: false });
    } catch (error) {
      set({ error: "Failed to fetch UMAP data: " + error, loading: false });
    }
  },
}));

export default useGeneStore;
