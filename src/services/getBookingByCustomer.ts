import apiClient from "./apiClient";


export async function getBookingByCustomer(id: number | string) {
  const resp = await apiClient.get(`/booking/customer?CustomerId=${id}`);

  return resp.data.data;
}
