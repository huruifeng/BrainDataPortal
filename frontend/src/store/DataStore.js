import {create} from "zustand";
import { toast } from "react-toastify";
import {getData_get, getSample_get} from "../api/api.js";

const useDataStore = create((set) => ({
    dataRecords: [],
    datafetchStatus: null,

     sampleRecords: [],
    samplefetchStatus: null,

    setDatarecords: (dataRecords) => set({ dataRecords }),

    fetchDataTable: async (data_id="all") => {
        try {
            const response = await getData_get(data_id);
            // console.log(response);
            if(response.status === 200){
                const data = await response.data;
                await set({ dataRecords: data, datafetchStatus: "success" });
                // toast.success("Data loaded successfully!");
            }else{
                console.error("Error fetching data:", response.data);
                await set({ dataRecords: [], datafetchStatus: "failed" });
                 toast.error("Failed to fetch data.");
            }

        } catch (error) {
            console.error("Error fetching data:", error);
            await set({ dataRecords: [], datafetchStatus: "error" });
            toast.error("Error while fetching data.");
        }
    },

    fetchSampleData: async (sample_id) => {
        try {
            const response = await getSample_get(sample_id);
            // console.log(response);
            if(response.status === 200){
                const data = await response.data;
                await set({ sampleRecords: data, samplefetchStatus: "success" });
                // toast.success("Data loaded successfully!");
            }else{
                console.error("Error fetching data:", response.data);
                await set({ sampleRecords: [], samplefetchStatus: "failed" });
                 toast.error("Failed to fetch sample data.");
            }

        } catch (error) {
            console.error("Error fetching data:", error);
            await set({ sampleRecords: [], samplefetchStatus: "error" });
            toast.error("Error while fetching sample data.");
        }
    }
}));

export default useDataStore;
