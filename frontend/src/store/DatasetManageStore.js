import {create} from 'zustand'
import axios from 'axios'

const BASE_URL = "http://localhost:8000"; // Replace with your backend URL
// const BASE_URL = "http://10.168.236.29:8000"; // Replace with your backend URL

const dmURL = `${BASE_URL}/datasetmanage`;

const useDatasetManageStore = create((set, get) => ({
    // Seurat objects
    seuratObjects: [],
    selectedSeurat: '',
    isLoading: false,

    // Dataset name
    datasetName: '',
    isNameUnique: null,
    isCheckingName: false,

    // Processing
    isProcessing: false,
    processingStatus: {
        status: 'idle',
        progress: 0,
        currentStep: '',
        outputs: [],
    },

    // Messages
    error: null,
    success: null,

    // Polling
    pollingInterval: null,

    // Setters
    setSelectedSeurat: (seurat) => set({selectedSeurat: seurat}),
    setDatasetName: (name) => set({datasetName: name}),

    // Actions
    fetchSeuratObjects: async () => {
        set({isLoading: true, error: null});
        try {
            const response = await axios.get(`${dmURL}/seurat-objects`);
            set({seuratObjects: response.data});
        } catch (error) {
            set({
                error: error.response?.data?.error || 'Failed to load Seurat objects. Please try again later.'
            });
            console.error('Error fetching Seurat objects:', error);
        } finally {
            set({isLoading: false});
        }
    },

    checkDatasetName: async (name) => {
        if (!name || name.length < 3) {
            set({isNameUnique: null});
            return;
        }

        set({isCheckingName: true});
        try {
            const response = await axios.get(`${dmURL}/check-name?name=${encodeURIComponent(name)}`);
            set({isNameUnique: response.data.isUnique});
        } catch (error) {
            console.error('Error checking dataset name:', error);
        } finally {
            set({isCheckingName: false});
        }
    },

    processDataset: async () => {
        const {selectedSeurat, datasetName} = get();

        if (!selectedSeurat || !datasetName) {
            set({error: 'Please select a Seurat object and provide a unique dataset name'});
            return;
        }

        set({
            isProcessing: true,
            error: null,
            success: null,
            processingStatus: {
                status: 'processing',
                progress: 0,
                currentStep: 'Initializing...',
                outputs: [
                    {
                        id: 'init',
                        timestamp: new Date().toISOString(),
                        message: 'Starting dataset processing...',
                        type: 'info',
                    },
                ],
            }
        });

        try {
            const response = await axios.post(`${dmURL}/process`, {
                seurat: selectedSeurat,
                datasetName,
            });

            const jobId = response.data.jobId;

            // Clear any existing polling
            if (get().pollingInterval) {
                clearInterval(get().pollingInterval);
            }

            // Start polling for status updates
            const interval = setInterval(() => {
                get().fetchProcessingStatus(jobId);
            }, 2000);

            set({pollingInterval: interval});

        } catch (error) {
            const errorMessage = error.response?.data?.error || 'An error occurred while processing the dataset';
            set({
                error: errorMessage,
                isProcessing: false,
                processingStatus: {
                    ...get().processingStatus,
                    status: 'failed',
                    outputs: [
                        ...get().processingStatus.outputs,
                        {
                            id: `error-${Date.now()}`,
                            timestamp: new Date().toISOString(),
                            message: errorMessage,
                            type: 'error',
                        },
                    ],
                }
            });
        }
    },

    fetchProcessingStatus: async (jobId) => {
        try {
            const response = await axios.get(`${dmURL}/status?jobId=${jobId}`);
            const data = response.data;

            set({processingStatus: data});

            // If processing is complete or failed, stop polling
            if (data.status === 'completed' || data.status === 'failed') {
                if (get().pollingInterval) {
                    clearInterval(get().pollingInterval);
                    set({pollingInterval: null});
                }

                if (data.status === 'completed') {
                    set({
                        success: `Dataset "${get().datasetName}" has been successfully processed!`,
                        isProcessing: false
                    });
                } else {
                    set({
                        error: 'Processing failed. Please check the output log for details.',
                        isProcessing: false
                    });
                }
            }
        } catch (error) {
            console.error('Error fetching processing status:', error);
        }
    },

    resetState: () => {
        // Clear polling if it exists
        if (get().pollingInterval) {
            clearInterval(get().pollingInterval);
        }

        set({
            selectedSeurat: '',
            datasetName: '',
            isNameUnique: null,
            error: null,
            success: null,
            isProcessing: false,
            pollingInterval: null,
            processingStatus: {
                status: 'idle',
                progress: 0,
                currentStep: '',
                outputs: [],
            }
        });
    }
}));

export default useDatasetManageStore;
