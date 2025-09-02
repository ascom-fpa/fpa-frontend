import api from "./axios"

export interface Magazine {
  id: string
  pdfUrl?: string
}

export interface CreateMagazineData {
  file: File | null
}

// Get all banners
export const getMagazine = async (): Promise<Magazine> => {
  const response = await api.get("/magazine")
  return response.data.data
}

// Create new banner
export const createMagazine = async (payload: FormData): Promise<Magazine> => {
  const response = await api.postForm("/magazine", payload)
  return response.data.data
}