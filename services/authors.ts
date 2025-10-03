import api from "./axios"

export interface Author {
  id: string
  name: string
  photoUrl: string
  created_at: string
  updated_at: string
}

export interface CreateAuthorData {
  name: string
  photoUrl: string
}

// Get all Authors
export const getAuthors = async (): Promise<Author[]> => {
  const response = await api.get("/author")
  return response.data.data
}

// Create new Author
export const createAuthor = async (payload: FormData): Promise<Author> => {
  const response = await api.postForm("/author", payload)
  return response.data.data
}

// Delete Author
export const deleteAuthor = async (id: string): Promise<void> => {
  await api.delete(`/author/${id}`)
}