import axios from "axios";

const BASE_URL = "http://localhost:8000"; // Replace with your backend URL
// const BASE_URL = "http://10.168.236.29:8000"; // Replace with your backend URL

const API_URL = `${BASE_URL}/api`;

export const getGeneList = async (dataset,query_str) => {
    try {
        const response = await axios.get(`${API_URL}/getgenelist`,
            {params: {dataset:dataset,query_str:query_str}});
        return response;
    } catch (error) {
        console.error("Error reading umap data:", error);
        throw error;
    }
}

export const getSampleList = async (dataset,query_str) => {
    try {
        const response = await axios.get(`${API_URL}/getsamplelist`,
            {params: {dataset:dataset,query_str:query_str}});
        return response;
    } catch (error) {
        console.error("Error reading umap data:", error);
        throw error;
    }
}

export const getMetaList = async (dataset,query_str) => {
    try {
        const response = await axios.get(`${API_URL}/getmetalist`,
            {params: {dataset:dataset,query_str:query_str}});
        return response;
    } catch (error) {
        console.error("Error reading umap data:", error);
        throw error;
    }
}

export const getUMAPData = async (dataset) => {
    try {
        const response = await axios.get(`${API_URL}/getumapembedding`,
            {params: {dataset:dataset}});
        return response;
    } catch (error) {
        console.error("Error reading umap data:", error);
        throw error;
    }
}

export const getExprData = async (dataset,gene) => {
    try {
        const response = await axios.get(`${API_URL}/getexprdata`,
            {params: {dataset:dataset,gene:gene}});
        return response;
    } catch (error) {
        console.error("Error reading umap data:", error);
        throw error;
    }
}

export const getSampleMetaData = async (dataset,samples,meta) => {
    try {
        const response = await axios.get(`${API_URL}/getsamplemetadata`,
            {params: {dataset:dataset,samples:samples,meta:meta}});
        return response;
    } catch (error) {
        console.error("Error reading umap data:", error);
        throw error;
    }
}

export const getAllMetaData = async (dataset_id="all",dataset_type="all") => {
    try {
        const response = await axios.get(`${API_URL}/getallmetadata`,
            {params: {dataset_id: dataset_id, dataset_type: dataset_type}});
        return response;
    } catch (error) {
        console.error("Error reading gene/meta records:", error);
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
