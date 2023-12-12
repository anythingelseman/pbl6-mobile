import apiClient from "./apiClient";


export async function getCustomerById(id: number | string) {
  const resp = await apiClient.get(`/customer/${id}`);

  return resp.data.data;
}
