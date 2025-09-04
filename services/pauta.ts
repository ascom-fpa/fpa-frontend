import api from "./axios"

export interface Pauta {
  id: string
  imageUrl?: string
}

export interface UpdatePautaData {
  file: File | null
}

// Get all banners
export const getPauta = async (): Promise<Pauta> => {
  const response = await api.get("/pauta")
  return response.data.data
}

// Create new banner
export const updatePauta = async (payload: FormData): Promise<Pauta> => {
  const response = await api.putForm("/pauta", payload)
  return response.data.data
}