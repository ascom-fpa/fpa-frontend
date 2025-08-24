import api from "./axios"

export interface Post {
  id: string
  title: string
  content: string
  excerpt: string
  slug: string
  status: "draft" | "published" | "archived"
  featured_image?: string
  author_id: string
  category_id: string
  tags: string[]
  published_at?: string
  created_at: string
  updated_at: string
}

export interface CreatePostData {
  title: string
  content: string
  excerpt: string
  slug: string
  status: "draft" | "published"
  featured_image?: string
  category_id: string
  tags: string[]
  published_at?: string
}

export interface UpdatePostData extends Partial<CreatePostData> {
  id: string
}

export interface PostsResponse {
  posts: Post[]
  total: number
  page: number
  limit: number
}

// Get all posts with pagination and filters
export const getPosts = async (params?: {
  page?: number
  limit?: number
  status?: string
  category_id?: string
  search?: string
}): Promise<PostsResponse> => {
  const response = await api.get("/posts", { params })
  return response.data
}

// Get single post by ID
export const getPost = async (id: string): Promise<Post> => {
  const response = await api.get(`/posts/${id}`)
  return response.data
}

// Create new post
export const createPost = async (data: CreatePostData): Promise<Post> => {
  const response = await api.post("/posts", data)
  return response.data
}

// Update existing post
export const updatePost = async (data: UpdatePostData): Promise<Post> => {
  const { id, ...updateData } = data
  const response = await api.put(`/posts/${id}`, updateData)
  return response.data
}

// Delete post
export const deletePost = async (id: string): Promise<void> => {
  await api.delete(`/posts/${id}`)
}

// Upload featured image
export const uploadPostImage = async (file: File): Promise<{ url: string }> => {
  const formData = new FormData()
  formData.append("image", file)

  const response = await api.post("/posts/upload-image", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  })

  return response.data
}

// Bulk operations
export const bulkUpdatePosts = async (ids: string[], updates: Partial<Post>): Promise<void> => {
  await api.patch("/posts/bulk", { ids, updates })
}

export const bulkDeletePosts = async (ids: string[]): Promise<void> => {
  await api.delete("/posts/bulk", { data: { ids } })
}
