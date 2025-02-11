import {create} from "zustand";
import { toast } from "react-toastify";
import {getData_get, getDataset_get, getSample_get} from "../api/api.js";

const useDataStore = create((set) => ({
    dataRecords: [],
    datafetchStatus: null,

    sampleRecords: [],
    samplefetchStatus: null,

    datasetRecords: [],
    datasetfetchStatus: null,

    fetchDataTable: async (data_id="all") => {
        try {
            const response = await getData_get(data_id);
            // console.log(response);
            if(response.status === 200){
                const data = await response.data;
                await set({ dataRecords: data, datafetchStatus: "success" });
                // toast.success("Sample loaded successfully!");
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

    fetchSampleData: async (conditions) => {
        try {
            conditions = {dataset_id: "all", sample_id: "all",...conditions}
            const response = await getSample_get(conditions);
            // console.log(response);
            if(response.status === 200){
                const data = await response.data;
                await set({ sampleRecords: data, samplefetchStatus: "success" });
                // toast.success("Sample loaded successfully!");
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
    },

    fetchDatasetTable: async () => {
        try {
            const response = await getDataset_get();
            // console.log(response);
            if(response.status === 200){
                const data = await response.data;
                await set({ datasetRecords: data, datasetfetchStatus: "success" });
                // toast.success("Sample loaded successfully!");
            }else{
                console.error("Error fetching data:", response.data);
                await set({ datasetRecords: [], datasetfetchStatus: "failed" });
                 toast.error("Failed to fetch dataset data.");
            }

        } catch (error) {
            console.error("Error fetching data:", error);
            await set({ datasetRecords: [], datasetfetchStatus: "error" });
            toast.error("Error while fetching dataset data.");
        }
    },
}));

export default useDataStore;
