import api from "./axios"

export interface Banner {
  id: string
  text: string
  description?: string
  imageUrl: string
  link_url?: string
  position: number
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface CreateBannerData {
  text: string
  description?: string
  imageUrl: string
  link_url?: string
  is_active: boolean
}

interface CreateBannerPayload {
  title: string
  description?: string
  link_url?: string
  is_active: boolean
  imageFile: File
}

export interface UpdateBannerData extends Partial<CreateBannerData> {
  id: string
}

// Get all banners
export const getBanners = async (): Promise<Banner[]> => {
  const response = await api.get("/banners")
  return response.data.data
}

// Get active banners for homepage
export const getActiveBanners = async (): Promise<Banner[]> => {
  const response = await api.get("/banners/active")
  return response.data.data
}

// Create new banner
export const createBanner = async (payload: FormData): Promise<Banner> => {
  const response = await api.postForm("/banners", payload)
  return response.data.data
}

// Update banner
export const updateBanner = async (id: string, formData: FormData) => {
  const response = await api.patchForm(`/banners/${id}`, formData)
  return response.data.data
}

// Delete banner
export const deleteBanner = async (id: string): Promise<void> => {
  await api.delete(`/banners/${id}`)
}

// Upload banner image
export const uploadBannerImage = async (file: File): Promise<{ url: string }> => {
  const formData = new FormData()
  formData.append("image", file)

  const response = await api.post("/banners/upload-image", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  })

  return response.data.data
}

// Reorder banners
export const reorderBanners = async (bannerId: string, newIndex: number): Promise<void> => {
  await api.patch(`/banners/${bannerId}/reorder/${newIndex}`,)
}

// Toggle banner status
export const toggleBannerStatus = async (id: string): Promise<Banner> => {
  const response = await api.patch(`/banners/${id}/toggle`)
  return response.data.data
}
