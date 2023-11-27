import axios, { AxiosInstance, InternalAxiosRequestConfig } from "axios";

const apiClient: AxiosInstance = axios.create({
    baseURL: "https://apideploy.azurewebsites.net/api/v1",
    transformRequest: [],
    headers: {
      Accept: "application/json; multipart/form-data",
      "Content-Type":
        "application/json; multipart/form-data; application/x-www-form-urlencoded; charset=UTF-8",
      "Access-Control-Allow-Headers": "Content-Type",
      "Access-Control-Allow-Origin": "*",
    },
  });

  export default apiClient;
