import api from "./axios"

export type TPage = "about-page" | "contact-page" | "usage-terms-page"

export interface Page {
  id?: string
  content: any
}

// Get all banners
export const getPage = async (type: TPage): Promise<Page> => {
  const response = await api.get(type)
  return response.data.data
}

// Create new banner
export const updatePage = async (dto: Page, type: TPage): Promise<Page> => {
  const response = await api.put(type, dto)
  return response.data.data
}