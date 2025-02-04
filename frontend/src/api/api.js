import axios from "axios";

const BASE_URL = "http://localhost:8000"; // Replace with your backend URL
// const BASE_URL = "http://39.103.137.84:8000/api"; // Replace with your backend URL

const API_URL = `${BASE_URL}/api`;

export const getData_get = async (data_id="all") => {
    try {
        const response = await axios.get(`${API_URL}/getdata/${data_id}`);
        return response;
    } catch (error) {
        console.error("Error reading data records:", error);
        throw error;
    }
}

export const getSample_get = async (sample_id="all") => {
    try {
        const response = await axios.get(`${API_URL}/getsample/${sample_id}`);
        return response;
    } catch (error) {
        console.error("Error reading sample records:", error);
        throw error;
    }
}