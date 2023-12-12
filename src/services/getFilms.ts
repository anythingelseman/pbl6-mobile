import apiClient from "./apiClient"

export default async function getFilm() {
    const resp = await apiClient.get(`/film`)

    return resp.data.data
}