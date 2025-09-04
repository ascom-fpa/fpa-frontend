import api from "./axios"

export interface Live {
  id: string
  link: string
  isEnabled: boolean
}

export interface UpdateLiveData {
  link: string
  isEnabled: boolean
}

// Get all banners
export const getLive = async (): Promise<Live> => {
  const response = await api.get("/live")
  return response.data.data
}

// Create new banner
export const updateLive = async (dto: UpdateLiveData): Promise<Live> => {
  const response = await api.put("/live", dto)
  return response.data.data
}