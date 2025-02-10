import { create } from "zustand";

const useUmapStore = create((set) => ({
  selectedSamples: [],
  selectedGenes: [],
  setSelectedSamples: (samples) => set({ selectedSamples: samples }),
  setSelectedGenes: (genes) => set({ selectedGenes: genes }),
}));

export default useUmapStore;
