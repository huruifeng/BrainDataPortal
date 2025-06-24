import { create } from "zustand";

const useHomeStore = create((set) => ({
  side: "outer",
  region: null,
  assays: [],
  selectedRegion: null,

  setSide: (newSide) => set(() => ({ side: newSide })),
  setRegion: (side, region, assays) => set({ selectedRegion: side, region, assays }),

  fetchHomeData: async () => {
    try {
      const response = await fetch("/api/home");
      if (response.ok) {
        const data = await response.json();
        set({ side: data.side, region: data.region, assays: data.assays });
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  },


}));

export default useHomeStore;
