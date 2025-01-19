import { create } from "zustand";

const BrainStore = create((set) => ({
  side: "outer",
  region: null,
  assays: [],
  selectedRegion: null,
  setRegion: (side, region, assays) => set({ selectedRegion: side, region, assays }),
}));

export default BrainStore;
