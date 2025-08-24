import api from "./axios"

export interface Category {
  id: string
  name: string
  slug: string
  description?: string
  parent_id?: string
  color?: string
  is_active: boolean
  post_count: number
  created_at: string
  updated_at: string
  children?: Category[]
}

export interface CreateCategoryData {
  name: string
  slug: string
  description?: string
  parent_id?: string
  color?: string
  is_active: boolean
}

export interface UpdateCategoryData extends Partial<CreateCategoryData> {
  id: string
}

export interface CategoriesResponse {
  categories: Category[]
  total: number
  page: number
  limit: number
}

// Get all categories with pagination and filters
export const getCategories = async (params?: {
  page?: number
  limit?: number
  parent_id?: string
  is_active?: boolean
  include_children?: boolean
}): Promise<CategoriesResponse> => {
  const response = await api.get("/categories", { params })
  return response.data
}

// Get categories in hierarchical tree structure
export const getCategoriesTree = async (): Promise<Category[]> => {
  const response = await api.get("/categories/tree")
  return response.data
}

// Get active categories for public use
export const getActiveCategories = async (): Promise<Category[]> => {
  const response = await api.get("/categories/active")
  return response.data
}

// Get single category by ID
export const getCategory = async (id: string): Promise<Category> => {
  const response = await api.get(`/categories/${id}`)
  return response.data
}

// Get category by slug
export const getCategoryBySlug = async (slug: string): Promise<Category> => {
  const response = await api.get(`/categories/slug/${slug}`)
  return response.data
}

// Create new category
export const createCategory = async (data: CreateCategoryData): Promise<Category> => {
  const response = await api.post("/categories", data)
  return response.data
}

// Update category
export const updateCategory = async (data: UpdateCategoryData): Promise<Category> => {
  const { id, ...updateData } = data
  const response = await api.put(`/categories/${id}`, updateData)
  return response.data
}

// Delete category
export const deleteCategory = async (id: string): Promise<void> => {
  await api.delete(`/categories/${id}`)
}

// Toggle category status
export const toggleCategoryStatus = async (id: string): Promise<Category> => {
  const response = await api.patch(`/categories/${id}/toggle`)
  return response.data
}

// Move category to different parent
export const moveCategoryToParent = async (id: string, parentId?: string): Promise<Category> => {
  const response = await api.patch(`/categories/${id}/move`, { parent_id: parentId })
  return response.data
}

// Get posts by category
export const getPostsByCategory = async (categoryId: string, params?: { page?: number; limit?: number }) => {
  const response = await api.get(`/categories/${categoryId}/posts`, { params })
  return response.data
}

// Bulk operations
export const bulkDeleteCategories = async (ids: string[]): Promise<void> => {
  await api.delete("/categories/bulk", { data: { ids } })
}

export const bulkUpdateCategories = async (ids: string[], updates: Partial<Category>): Promise<void> => {
  await api.patch("/categories/bulk", { ids, updates })
}
