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

export const getUmapData = async (dataset, samples, genes) => {
    try {
        const response = await axios.get(`${API_URL}/getumapdata`, {params: {dataset:dataset,samples:samples,genes:genes}});
        return response;
    } catch (error) {
        console.error("Error reading umap data:", error);
        throw error;
    }
}

export const getAllGenes_get = async (dataset_id="all") => {
    try {
        const response = await axios.get(`${API_URL}/getallgenes`, {params: {dataset_id: dataset_id}});
        return response;
    } catch (error) {
        console.error("Error reading gene records:", error);
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
    // console.log(conditions);
    try {
        const response = await axios.get(`${API_URL}/getsample`, {params: conditions});
        return response;
    } catch (error) {
        console.error("Error reading sample records:", error);
        throw error;
    }
}

export const getDataset_get = async (dataset_id="all") => {
    try {
        const response = await axios.get(`${API_URL}/getdataset/${dataset_id}`);
        return response;
    } catch (error) {
        console.error("Error reading dataset records:", error);
        throw error;
    }
}
