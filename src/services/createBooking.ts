import apiClient from "./apiClient";

interface CreateBookingParams {
  customerId: number;
  scheduleId: number;
  numberSeats: number[];
  paymentDestinationId: string;
}

export default async function createBooking(params: CreateBookingParams) {
  console.log(params);
  const res = await apiClient.post("/booking", JSON.stringify(params));

  return res.data;
}
