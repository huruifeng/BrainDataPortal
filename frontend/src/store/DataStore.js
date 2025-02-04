import {create} from "zustand";

const useDataStore = create((set) => ({
    datarecords: null,

    setDatarecords: (datarecords) => set({ datarecords }),
}));

export default useDataStore;
