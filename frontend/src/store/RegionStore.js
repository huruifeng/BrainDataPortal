import { create } from "zustand";

const BrainStore = create((set) => ({
  selectedRegion: null,
  assays: [],
  setRegion: (region, assays) => set({ selectedRegion: region, assays }),
}));

export default BrainStore;
