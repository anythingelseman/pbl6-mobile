import axios, { AxiosInstance, InternalAxiosRequestConfig } from "axios";
import EncryptedStorage from 'react-native-encrypted-storage';

const apiClient: AxiosInstance = axios.create({
    baseURL: "http://cinephilewebapi.southeastasia.cloudapp.azure.com/api/v1",
    transformRequest: [],
    headers: {
      Accept: "application/json; multipart/form-data",
      "Content-Type":
        "application/json; multipart/form-data; application/x-www-form-urlencoded; charset=UTF-8",
      "Access-Control-Allow-Headers": "Content-Type",
      "Access-Control-Allow-Origin": "*",
    },
  });


  apiClient.interceptors.request.use(
    async (config: InternalAxiosRequestConfig) => {
        const user = await EncryptedStorage.getItem("USER") as any
        if (user) {
          config.headers.Authorization = `Bearer ${JSON.parse(user).token}`;
        }
      
      return config;
    },
    (error) => {
      return Promise.reject(error);
    },
  );    
  export default apiClient;
