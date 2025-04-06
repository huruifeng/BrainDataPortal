import {create} from "zustand"
import {getCellTypeList, getMarkerGenes} from "../api/api.js";
import {toast} from "react-toastify";

const useCellTypeStore = create((set, get) => ({
    // State
    cellTypeList: [],
    selectedCellTypes: [],
    cellCounts: null,

    markerGenes: null,
    diffExpGenes: null,

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
        try {
            set({loading: true})
            // Mock API call - replace with actual API
            await new Promise((resolve) => setTimeout(resolve, 300))

            // Generate mock cell count data
            const cellTypes = ["Astrocytes", "Microglia", "Neurons", "Oligodendrocytes", "OPCs"]
            const conditions = ["PD", "Control"]
            const sexes = ["Male", "Female"]

            const mockCellCounts = {}

            cellTypes.forEach((cellType) => {
                mockCellCounts[cellType] = []

                // Generate 5 samples for each combination of condition and sex
                conditions.forEach((condition) => {
                    sexes.forEach((sex) => {
                        for (let i = 0; i < 5; i++) {
                            mockCellCounts[cellType].push({
                                condition,
                                sex,
                                count: Math.floor(Math.random() * 1000) + 100, // Random count between 100 and 1100
                                sample_id: `sample_${condition}_${sex}_${i}`,
                            })
                        }
                    })
                })
            })

            set({cellCounts: mockCellCounts, loading: false})
        } catch (error) {
            set({error: error.message, loading: false})
        }
    },

    fetchDiffExpGenes: async (dataset_id) => {
        try {
            set({loading: true})
            // Mock API call - replace with actual API
            await new Promise((resolve) => setTimeout(resolve, 300))

            const selectedCellTypes = get().selectedCellTypes

            // Generate mock differentially expressed genes data
            const genePool = [
                // Up-regulated genes (higher in PD)
                "LRRK2",
                "SNCA",
                "PARK7",
                "PINK1",
                "PRKN",
                "GBA",
                "VPS35",
                "ATP13A2",
                "FBXO7",
                "PLA2G6",
                "DNAJC6",
                "SYNJ1",
                "VPS13C",
                "CHCHD2",
                "TMEM230",

                // Down-regulated genes (lower in PD)
                "TH",
                "SLC6A3",
                "SLC18A2",
                "DDC",
                "DBH",
                "ALDH1A1",
                "NR4A2",
                "PITX3",
                "EN1",
                "LMX1B",
                "FOXA2",
                "OTX2",
                "MSX1",
                "NEUROD1",
                "NEUROG2",
            ]

            const mockDiffExpGenes = {}

            selectedCellTypes.forEach((cellType) => {
                // Generate 30 differentially expressed genes for each cell type
                mockDiffExpGenes[cellType] = Array.from({length: 30}, (_, i) => {
                    const isUpregulated = i < 15 // First 15 are up-regulated, last 15 are down-regulated
                    const randomGene = genePool[Math.floor(Math.random() * genePool.length)]
                    const logFC = isUpregulated
                        ? Math.random() * 3 + 1 // LogFC between 1 and 4 for up-regulated
                        : -(Math.random() * 3 + 1) // LogFC between -1 and -4 for down-regulated

                    // Generate expression data for each sample
                    const expression = []

                    // PD samples (10 samples)
                    for (let j = 0; j < 10; j++) {
                        const baseValue = isUpregulated ? 8 : 4 // Higher base for up-regulated in PD
                        expression.push({
                            sampleId: `PD_sample_${j + 1}`,
                            condition: "PD",
                            value: baseValue + (Math.random() * 2 - 1), // Add some noise
                        })
                    }

                    // Control samples (10 samples)
                    for (let j = 0; j < 10; j++) {
                        const baseValue = isUpregulated ? 4 : 8 // Lower base for up-regulated in Control
                        expression.push({
                            sampleId: `Control_sample_${j + 1}`,
                            condition: "Control",
                            value: baseValue + (Math.random() * 2 - 1), // Add some noise
                        })
                    }

                    return {
                        name: `${randomGene}_${i % 15}`,
                        logFC: logFC,
                        pValue: Math.random() * 0.05, // p-value between 0 and 0.05
                        adjPValue: Math.random() * 0.05, // adjusted p-value between 0 and 0.05
                        expression: expression,
                    }
                })
            })

            set({diffExpGenes: mockDiffExpGenes, loading: false})
        } catch (error) {
            set({error: error.message, loading: false})
        }
    },
}))

export default useCellTypeStore

