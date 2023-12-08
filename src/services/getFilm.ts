import apiClient from "./apiClient"

export default async function getFilmById(id: number) {
    const resp = await apiClient.get(`/film/${id}`  )

    return resp.data.data
}