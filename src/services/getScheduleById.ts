import apiClient from "./apiClient"

export default async function getScheduleById(scheduleId: number) {
  const resp = await apiClient.get(`/schedule/${scheduleId}`);

  return resp.data.data;
}
