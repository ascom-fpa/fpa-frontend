import api from "./axios"

export interface Video {
  id: string
  description: string
  url?: string
  createdAt: string
  updatedAt: string
}

export interface CreateVideoData {
  description: string
  file: string
}


// Get all videos
export const getVideos = async (): Promise<Video[]> => {
  const response = await api.get("/videos")
  return response.data.data
}

// Get active videos for homepage
export const getActiveVideos = async (): Promise<Video[]> => {
  const response = await api.get("/videos/active")
  return response.data.data
}

// Create new video
export const createVideo = async (payload: FormData): Promise<Video> => {
  const response = await api.postForm("/videos", payload)
  return response.data.data
}


// Delete video
export const deleteVideo = async (id: string): Promise<void> => {
  await api.delete(`/videos/${id}`)
}