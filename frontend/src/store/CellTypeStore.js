import {create} from "zustand"
import {
    getCellTypeList,
    getMarkerGenes,
    getCellCounts,
    getDEGsOfCellType
} from "../api/api.js";
import {toast} from "react-toastify";

const useCellTypeStore = create((set, get) => ({
    // State
    cellTypeList: [],
    selectedCellTypes: [],
    cellCounts: null,

    markerGenes: null,
    diffExpGenes: {},

    loading: false,
    error: null,

    // Actions
    setSelectedCellTypes: (cellTypes) => set({selectedCellTypes: cellTypes}),

    fetchCellTypeList: async (dataset_id) => {
        if (!dataset_id || dataset_id === "all") {
            set({error: "fetchCellTypeList: No dataset selected"});
            return;
        }
        try {
            set({loading: true})
            // Mock API call - replace with actual API
            const response = await getCellTypeList(dataset_id);
            if (response.status === 200) {
                const data = await response.data;
                await set({cellTypeList: data, loading: false, error: null});

            } else {
                const error_message = "Error fetching cell type list: " + response.message;
                await set({cellTypeList: [], error: error_message, loading: false});
                toast.error(response.message);
            }
        } catch (error) {
            set({error: error.message, loading: false})
        }
    },

    fetchMarkerGenes: async (dataset_id) => {
         if (!dataset_id || dataset_id === "all") {
            set({error: "fetchMarkerGenes: No dataset selected"});
            return;
        }
        try {
            set({loading: true})
            const response = await getMarkerGenes(dataset_id);
            if (response.status === 200) {
                const data = await response.data;
                await set({markerGenes: data, loading: false, error: null});

            } else {
                const error_message = "Error fetching cell type list: " + response.message;
                await set({markerGenes: [], error: error_message, loading: false});
                toast.error(response.message);
            }
        } catch (error) {
            set({error: error.message, loading: false})
        }
    },

    fetchCellCounts: async (dataset_id) => {
         if (!dataset_id || dataset_id === "all") {
            set({error: "fetchMarkerGenes: No dataset selected"});
            return;
        }
        try {
            set({loading: true})
            const response = await getCellCounts(dataset_id);
            if (response.status === 200) {
                const data = await response.data;
                await set({cellCounts: data, loading: false, error: null});

            } else {
                const error_message = "Error fetching cell counts: " + response.message;
                await set({cellCounts: [], error: error_message, loading: false});
                toast.error(response.message);
            }
        } catch (error) {
            set({error: error.message, loading: false})
        }
    },

    fetchDiffExpGenes: async (dataset_id) => {
        if (!dataset_id || dataset_id === "all") {
            set({error: "fetchDiffExpGenes: No dataset selected"});
            return;
        }
        try {
            set({loading: true})

            const selectedCellTypes = get().selectedCellTypes

            if (selectedCellTypes.length === 0) {
                set({error: "fetchDiffExpGenes: No cell types selected", loading: false});
                return;
            }

            for (var cellType of selectedCellTypes) {
                if (!get().diffExpGenes[cellType]) {
                    const response = await getDEGsOfCellType(dataset_id, cellType);
                    set({diffExpGenes: {...get().diffExpGenes, [cellType]: response.data}});
                }
            }

            // remove cell type item if it is not selected
            for (var key in get().diffExpGenes) {
                if (!selectedCellTypes.includes(key)) {
                    delete get().diffExpGenes[key];
                }
            }

            set({loading: false});

        } catch (error) {
            set({error: error.message, loading: false})
        }
    },
}))

export default useCellTypeStore

