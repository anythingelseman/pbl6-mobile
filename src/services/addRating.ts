import apiClient from "./apiClient";

export default async function addRating(params: {
  filmId: number;
  score: number;
}) {
  const res = await apiClient.post("/review", JSON.stringify(params));

  return res.data;
}