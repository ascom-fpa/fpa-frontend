import api from "./axios"

export interface Tag {
  id: string
  name: string
  slug: string
  description?: string
  color?: string
  is_active: boolean
  post_count: number
  created_at: string
  updated_at: string
}

export interface CreateTagData {
  name: string
  slug: string
  description?: string
  color?: string
  is_active: boolean
}

export interface UpdateTagData extends Partial<CreateTagData> {
  id: string
}

export interface TagsResponse {
  tags: Tag[]
  total: number
  page: number
  limit: number
}

// Get all tags with pagination and filters
export const getTags = async (params?: {
  page?: number
  limit?: number
  is_active?: boolean
  search?: string
}): Promise<TagsResponse> => {
  const response = await api.get("/tags", { params })
  return response.data
}

// Get active tags for public use
export const getActiveTags = async (): Promise<Tag[]> => {
  const response = await api.get("/tags/active")
  return response.data
}

// Get popular tags (most used)
export const getPopularTags = async (limit = 20): Promise<Tag[]> => {
  const response = await api.get("/tags/popular", { params: { limit } })
  return response.data
}

// Get single tag by ID
export const getTag = async (id: string): Promise<Tag> => {
  const response = await api.get(`/tags/${id}`)
  return response.data
}

// Get tag by slug
export const getTagBySlug = async (slug: string): Promise<Tag> => {
  const response = await api.get(`/tags/slug/${slug}`)
  return response.data
}

// Search tags by name
export const searchTags = async (query: string): Promise<Tag[]> => {
  const response = await api.get("/tags/search", { params: { q: query } })
  return response.data
}

// Create new tag
export const createTag = async (data: CreateTagData): Promise<Tag> => {
  const response = await api.post("/tags", data)
  return response.data
}

// Update tag
export const updateTag = async (data: UpdateTagData): Promise<Tag> => {
  const { id, ...updateData } = data
  const response = await api.put(`/tags/${id}`, updateData)
  return response.data
}

// Delete tag
export const deleteTag = async (id: string): Promise<void> => {
  await api.delete(`/tags/${id}`)
}

// Toggle tag status
export const toggleTagStatus = async (id: string): Promise<Tag> => {
  const response = await api.patch(`/tags/${id}/toggle`)
  return response.data
}

// Get posts by tag
export const getPostsByTag = async (tagId: string, params?: { page?: number; limit?: number }) => {
  const response = await api.get(`/tags/${tagId}/posts`, { params })
  return response.data
}

// Merge tags (combine multiple tags into one)
export const mergeTags = async (sourceTagIds: string[], targetTagId: string): Promise<void> => {
  await api.post("/tags/merge", { source_tag_ids: sourceTagIds, target_tag_id: targetTagId })
}

// Auto-suggest tags based on content
export const suggestTags = async (content: string): Promise<Tag[]> => {
  const response = await api.post("/tags/suggest", { content })
  return response.data
}

// Bulk operations
export const bulkDeleteTags = async (ids: string[]): Promise<void> => {
  await api.delete("/tags/bulk", { data: { ids } })
}

export const bulkUpdateTags = async (ids: string[], updates: Partial<Tag>): Promise<void> => {
  await api.patch("/tags/bulk", { ids, updates })
}

// Create or get existing tag by name (useful for auto-creation)
export const createOrGetTag = async (name: string): Promise<Tag> => {
  const response = await api.post("/tags/create-or-get", { name })
  return response.data
}
