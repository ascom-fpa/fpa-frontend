import { showToast } from "@/utils/show-toast"
import api from "./axios"

export interface Relevant {
  id: string
  title: string
  description?: string
  videoUrl: string
  coverImageUrl: string
  duration: number
  isActive: boolean
  viewCount: number
  createdAt: string
  updatedAt: string
}

export interface CreateRelevantData {
  title: string
  description?: string
  videoFile: File | null
  coverFile?: File | null
}

export interface UpdateRelevantData extends Partial<CreateRelevantData> {
  id: string
}

// Get all relevants with pagination
export const getRelevants = async (params?: {
  page?: number
  limit?: number
  is_active?: boolean
}): Promise<Relevant[]> => {
  const response = await api.get("/relevants", { params })
  return response.data.data
}

// Get active relevants for public display
export const getActiveRelevants = async (): Promise<Relevant[]> => {
  const response = await api.get("/relevants/active")
  return response.data
}

// Get single relevant
export const getRelevant = async (id: string): Promise<Relevant> => {
  const response = await api.get(`/relevants/${id}`)
  return response.data
}

// Create new relevant
export const createRelevant = async (data: {
  title: string
  description?: string
  videoFile: File
  coverFile?: File
}): Promise<Relevant> => {
  // 1. Get signed URL for video
  const videoRes = await api.get("/relevants/signed-url", {
    params: {
      filename: data.videoFile.name,
      contentType: data.videoFile.type,
    },
  })

  const { url: videoUrl, key: videoKey } = videoRes.data.data
  // 2. Upload video directly to R2
  await fetch(videoUrl, {
    method: "PUT",
    headers: { "Content-Type": data.videoFile.type },
    body: data.videoFile,
  })

  let coverKey: string | undefined
  if (data.coverFile) {
    const coverRes = await api.get("/relevants/signed-url", {
      params: {
        filename: data.coverFile.name,
        contentType: data.coverFile.type,
      },
    })
    const { url: coverUrl, key } = coverRes.data

    await fetch(coverUrl, {
      method: "PUT",
      headers: { "Content-Type": data.coverFile.type },
      body: data.coverFile,
    })

    coverKey = key
  }

  // 3. Send metadata to backend
  const response = await api.post("/relevants", {
    title: data.title,
    description: data.description,
    videoKey,
    coverKey,
  })

  return response.data
}

// Update relevant
export const updateRelevant = async (data: UpdateRelevantData): Promise<Relevant> => {
  const { id, ...updateData } = data
  const response = await api.put(`/relevants/${id}`, updateData)
  return response.data
}

// Delete relevant
export const deleteRelevant = async (id: string): Promise<void> => {
  await api.delete(`/relevants/${id}`)
}

// Upload relevant video
export const uploadRelevantVideo = async (
  file: File,
  onProgress?: (progress: number) => void,
): Promise<{ url: string; duration: number }> => {
  const formData = new FormData()
  formData.append("video", file)

  const response = await api.post("/relevants/upload-video", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
    onUploadProgress: (progressEvent) => {
      if (onProgress && progressEvent.total) {
        const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total)
        onProgress(progress)
      }
    },
  })

  return response.data
}

// Upload cover image
export const uploadRelevantCover = async (file: File): Promise<{ url: string }> => {
  const formData = new FormData()
  formData.append("cover", file)

  const response = await api.post("/relevants/upload-cover", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  })

  return response.data
}

// Toggle relevant status
export const toggleRelevantStatus = async (id: string): Promise<Relevant> => {
  const response = await api.patch(`/relevants/${id}/toggle`)
  return response.data
}

// Increment view count
export const incrementRelevantViews = async (id: string): Promise<void> => {
  await api.post(`/relevants/${id}/view`)
}

// Bulk delete relevants
export const bulkDeleteRelevants = async (ids: string[]): Promise<void> => {
  await api.delete("/relevants/bulk", { data: { ids } })
}

export const reorderRelevants = async (id: string, newIndex: number): Promise<void> => {
  await api.patch(`/relevants/${id}/reorder/${newIndex}`,)
}
