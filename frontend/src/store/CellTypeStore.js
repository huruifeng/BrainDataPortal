import {create} from "zustand"

const useCellTypeStore = create((set, get) => ({
    // State
    cellTypeList: [],
    markerGenes: null,
    cellCounts: null,
    diffExpGenes: null,
    selectedCellTypes: [],
    loading: false,
    error: null,

    // Actions
    setSelectedCellTypes: (cellTypes) => set({selectedCellTypes: cellTypes}),

    fetchCellTypeList: async (datasetId) => {
        try {
            set({loading: true})
            // Mock API call - replace with actual API
            await new Promise((resolve) => setTimeout(resolve, 500))

            // Mock data
            const cellTypes = [
                "Astrocytes",
                "Microglia",
                "Neurons",
                "Oligodendrocytes",
                "OPCs",
                "Endothelial",
                "Pericytes",
                "Excitatory Neurons",
                "Inhibitory Neurons",
                "Dopaminergic Neurons",
            ]

            set({cellTypeList: cellTypes, loading: false})
        } catch (error) {
            set({error: error.message, loading: false})
        }
    },

    fetchMarkerGenes: async (datasetId) => {
        try {
            set({loading: true})
            // Mock API call - replace with actual API
            await new Promise((resolve) => setTimeout(resolve, 1000))

            const selectedCellTypes = get().selectedCellTypes
            const isAllSelected = selectedCellTypes.includes("all")

            // Generate mock marker genes data
            const cellTypes = isAllSelected
                ? ["Astrocytes", "Microglia", "Neurons", "Oligodendrocytes", "OPCs"]
                : selectedCellTypes

            const genePool = [
                "GFAP",
                "S100B",
                "AQP4",
                "ALDH1L1",
                "SLC1A3", // Astrocyte markers
                "CX3CR1",
                "P2RY12",
                "TMEM119",
                "ITGAM",
                "CSF1R", // Microglia markers
                "RBFOX3",
                "MAP2",
                "TUBB3",
                "SYP",
                "SYT1", // Neuron markers
                "MBP",
                "PLP1",
                "MOG",
                "MAG",
                "MOBP", // Oligodendrocyte markers
                "PDGFRA",
                "CSPG4",
                "OLIG1",
                "OLIG2",
                "SOX10", // OPC markers
            ]

            const mockMarkerGenes = {}

            cellTypes.forEach((cellType) => {
                // Generate 15 marker genes for each cell type (so we have more than 10)
                mockMarkerGenes[cellType] = Array.from({length: 15}, (_, i) => {
                    const randomGene = genePool[Math.floor(Math.random() * genePool.length)]
                    return {
                        name: `${randomGene}_${i}`,
                        score: Math.random() * 5 + 1, // Score between 1 and 6
                    }
                }).sort((a, b) => b.score - a.score) // Sort by score descending
            })

            set({markerGenes: mockMarkerGenes, loading: false})
        } catch (error) {
            set({error: error.message, loading: false})
        }
    },

    fetchCellCounts: async (datasetId) => {
        try {
            set({loading: true})
            // Mock API call - replace with actual API
            await new Promise((resolve) => setTimeout(resolve, 1000))

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

    fetchDiffExpGenes: async (datasetId) => {
        try {
            set({loading: true})
            // Mock API call - replace with actual API
            await new Promise((resolve) => setTimeout(resolve, 1000))

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

