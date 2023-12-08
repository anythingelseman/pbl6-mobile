import apiClient from "./apiClient";


export async function getBookingById(id: number | string) {
  const resp = await apiClient.get(`/booking/${id}`);

  return resp.data.data;
}
