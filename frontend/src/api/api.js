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

export const getProject_get = async (project_id="all") => {
    try {
        const response = await axios.get(`${API_URL}/getproject/${project_id}`);
        return response;
    } catch (error) {
        console.error("Error reading project records:", error);
        throw error;
    }
}

export const getSampleCondition_get = async (conditions) => {
    try {
        const queryStr = jsonToQueryString(conditions);
        const response = await axios.get(`${API_URL}/getsample_by_conditions/?${queryStr}`);
        return response;
    } catch (error) {
        console.error("Error reading sample records:", error);
        throw error;
    }

}