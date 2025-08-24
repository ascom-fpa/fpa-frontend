import api from "./axios"

export interface LoginCredentials {
  email: string
  password: string
}

export interface AuthResponse {
  access_token: string
  refresh_token: string
  user: {
    id: string
    email: string
    name: string
    role: string
  }
}

export interface ResetPasswordData {
  email: string
  code: string
  newPassword: string
}

// Login user
export const login = async (credentials: LoginCredentials): Promise<AuthResponse> => {
  const response = await api.post("/auth/login", credentials)

  // Store tokens
  localStorage.setItem("auth_token", response.data.access_token)
  localStorage.setItem("refresh_token", response.data.refresh_token)

  return response.data
}

// Logout user
export const logout = async (): Promise<void> => {
  try {
    await api.post("/auth/logout")
  } finally {
    // Clear tokens regardless of API response
    localStorage.removeItem("auth_token")
    localStorage.removeItem("refresh_token")
  }
}

// Refresh access token
export const refreshToken = async (): Promise<string> => {
  const refreshToken = localStorage.getItem("refresh_token")
  if (!refreshToken) {
    throw new Error("No refresh token available")
  }

  const response = await api.post("/auth/refresh", {
    refresh_token: refreshToken,
  })

  const { access_token } = response.data
  localStorage.setItem("auth_token", access_token)

  return access_token
}

// Get current user profile
export const getCurrentUser = async () => {
  const response = await api.get("/auth/me")
  return response.data
}

// Send forgot password email
export const forgotPassword = async (email: string): Promise<void> => {
  await api.post("/auth/forgot-password", { email })
}

// Reset password with code
export const resetPassword = async (data: ResetPasswordData): Promise<void> => {
  await api.post("/auth/reset-password", data)
}

// Verify session
export const verifySession = async (): Promise<boolean> => {
  try {
    await api.get("/auth/verify")
    return true
  } catch {
    return false
  }
}
