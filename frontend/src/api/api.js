import axios from "axios";

const BASE_URL = "http://localhost:8000"; // Replace with your backend URL


const API_URL = `${BASE_URL}/api`;

function jsonToQueryString(json) {
    const params = new URLSearchParams();

    for (const [key, value] of Object.entries(json)) {
      if (Array.isArray(value)) {
        value.forEach(val => params.append(key, val));
      } else {
        params.append(key, value);
      }
    }
    return params.toString();
}

export const getUmapData = async (samples, genes) => {
    try {
        const response = await axios.get(`${API_URL}/getumapdata/`, {params: {samples, genes}});
        return response;
    } catch (error) {
        console.error("Error reading umap data:", error);
        throw error;
    }
}

export const getData_get = async (data_id="all") => {
    try {
        const response = await axios.get(`${API_URL}/getdata/${data_id}`);
        return response;
    } catch (error) {
        console.error("Error reading data records:", error);
        throw error;
    }
}

export const getSample_get = async (conditions) => {
    console.log(conditions);
    try {
        const response = await axios.get(`${API_URL}/getsample`, {params: conditions});
        return response;
    } catch (error) {
        console.error("Error reading sample records:", error);
        throw error;
    }
}

export const getProject_get = async (project_id="all") => {
    try {
        const response = await axios.get(`${API_URL}/getproject/${project_id}`);
        return response;
    } catch (error) {
        console.error("Error reading project records:", error);
        throw error;
    }
}
