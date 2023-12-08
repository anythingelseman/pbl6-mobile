import apiClient from "./apiClient";

export type ReserverSeatsParams = {
  customerId: number;
  scheduleId: number;
  numberSeats: number[];
};
export default async function reserveSeats(params: ReserverSeatsParams) {
  console.log(params);
  const res = await apiClient.post("/reserve",JSON.stringify(params) );

  return res.data;
}
