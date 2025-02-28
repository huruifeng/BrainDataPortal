import axios from "axios";

const BASE_URL = "http://localhost:8000"; // Replace with your backend URL

const VISIUM_URL = `${BASE_URL}/visium`;


export const getImageData = async (dataset,sample) => {
    try {
        const response = await axios.get(`${VISIUM_URL}/getimagedata`,
            {params: {dataset: dataset, sample: sample}});
        return response;
    } catch (error) {
        console.error("Error reading image data:", error);
        throw error;
    }
}