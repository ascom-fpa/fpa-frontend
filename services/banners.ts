import api from "./axios"

export interface Banner {
  id: string
  title: string
  description?: string
  image_url: string
  link_url?: string
  position: number
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface CreateBannerData {
  title: string
  description?: string
  image_url: string
  link_url?: string
  is_active: boolean
}

export interface UpdateBannerData extends Partial<CreateBannerData> {
  id: string
}

// Get all banners
export const getBanners = async (): Promise<Banner[]> => {
  const response = await api.get("/banners")
  return response.data
}

// Get active banners for homepage
export const getActiveBanners = async (): Promise<Banner[]> => {
  const response = await api.get("/banners/active")
  return response.data
}

// Create new banner
export const createBanner = async (data: CreateBannerData): Promise<Banner> => {
  const response = await api.post("/banners", data)
  return response.data
}

// Update banner
export const updateBanner = async (data: UpdateBannerData): Promise<Banner> => {
  const { id, ...updateData } = data
  const response = await api.put(`/banners/${id}`, updateData)
  return response.data
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

  return response.data
}

// Reorder banners
export const reorderBanners = async (bannerIds: string[]): Promise<void> => {
  await api.patch("/banners/reorder", { banner_ids: bannerIds })
}

// Toggle banner status
export const toggleBannerStatus = async (id: string): Promise<Banner> => {
  const response = await api.patch(`/banners/${id}/toggle`)
  return response.data
}
