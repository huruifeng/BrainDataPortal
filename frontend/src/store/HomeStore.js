import { create } from "zustand";
import {getHomeData} from "../api/api.js";

const useHomeStore = create((set) => ({
  homeData: {},
  side: "outer",
  region: null,
  assays: [],
  selectedRegion: null,

  setSide: (newSide) => set(() => ({ side: newSide })),
  setRegion: (side, region, assays) => set({ selectedRegion: side, region, assays }),

  fetchHomeData: async () => {
    try {
      const response = await getHomeData();
      console.log(response);
      set({ homeData: response.data });
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  },


}));

export default useHomeStore;
