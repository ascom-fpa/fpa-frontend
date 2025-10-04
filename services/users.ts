import api from "./axios"

export interface User {
  id: string
  email: string
  role: any
  firstName: string
  lastName: string
  created_at: string
  updated_at: string
}

export interface UpdateUserData {
  email: any
  firstName: any
  lastName: any
  role: any
}

// Get all Users
export const getUsers = async (): Promise<User[]> => {
  const response = await api.get("/users")
  return response.data.data.users
}

// Delete User
export const deleteUser = async (id: string): Promise<void> => {
  await api.delete(`/users/${id}`)
}

// Update User
export const updateUser = async (id: string, dto: UpdateUserData) => {
  const { data } = await api.patch(`/users/${id}`, dto)
  return data.data;
}