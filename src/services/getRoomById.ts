import { Room } from "./../types/Room";
import apiClient from "./apiClient"

export default async function getRoomById(roomId: number) {
  const resp = await apiClient.get(`/room/${roomId}`);

  return resp.data.data as Room;
}
