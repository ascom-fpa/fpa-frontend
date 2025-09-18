import api from "./axios"

export interface WebStory {
  id: string
  title: string
  description?: string
  slides: WebstorySlideData[]
  createdAt: string
  updatedAt: string
}

export interface WebstorySlideData {
  file: File;
  imageUrl?: string
  text?: string;
  order?: number;
}


export interface CreateWebStoryData {
  title: string
  description?: string
  slides: WebstorySlideData[]
  isFeatured?:boolean
}

export interface UpdateWebStoryData extends Partial<CreateWebStoryData> {
  id: string
}

// Get all web stories with pagination
export const getWebStories = async (params?: {
  page?: number
  limit?: number
  is_active?: boolean
}): Promise<WebStory[]> => {
  const response = await api.get("/webstories", { params })
  return response.data.data
}

// Get active web stories for public display
export const getActiveWebStories = async (): Promise<WebStory[]> => {
  const response = await api.get("/webstories/active")
  return response.data
}

// Get single web story
export const getWebStory = async (id: string): Promise<WebStory> => {
  const response = await api.get(`/webstories/${id}`)
  return response.data
}

// Create new web story
export const createWebStory = async (data: FormData): Promise<WebStory> => {
  const response = await api.postForm("/webstories", data)
  return response.data
}

// Update web story
export const updateWebStory = async (data: UpdateWebStoryData): Promise<WebStory> => {
  const { id, ...updateData } = data
  const response = await api.put(`/webstories/${id}`, updateData)
  return response.data
}

// Delete web story
export const deleteWebStory = async (id: string): Promise<void> => {
  await api.delete(`/webstories/${id}`)
}

// Upload web story video
export const uploadWebStoryVideo = async (
  file: File,
  onProgress?: (progress: number) => void,
): Promise<{ url: string; duration: number }> => {
  const formData = new FormData()
  formData.append("video", file)

  const response = await api.post("/webstories/upload-video", formData, {
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
export const uploadWebStoryCover = async (file: File): Promise<{ url: string }> => {
  const formData = new FormData()
  formData.append("cover", file)

  const response = await api.post("/webstories/upload-cover", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  })

  return response.data
}

// Toggle web story status
export const toggleWebStoryStatus = async (id: string): Promise<WebStory> => {
  const response = await api.patch(`/webstories/${id}/toggle`)
  return response.data
}

// Increment view count
export const incrementWebStoryViews = async (id: string): Promise<void> => {
  await api.post(`/webstories/${id}/view`)
}

// Bulk delete web stories
export const bulkDeleteWebStories = async (ids: string[]): Promise<void> => {
  await api.delete("/webstories/bulk", { data: { ids } })
}

export const reorderWebstories = async (id: string, newIndex: number): Promise<void> => {
  await api.patch(`/webstories/${id}/reorder/${newIndex}`,)
}
