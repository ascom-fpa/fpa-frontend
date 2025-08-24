import { create } from "zustand"
import { persist } from "zustand/middleware"
import * as authService from "@/services/auth"

interface User {
  id: string
  email: string
  name: string
  role: string
}

interface AuthState {
  // Authentication state
  isLoggedIn: boolean
  user: User | null
  isLoading: boolean
  error: string | null

  // Forgot password state
  showForgotPassword: boolean
  resetEmailSent: boolean
  showCodeVerification: boolean
  resetEmail: string

  // Actions
  login: (email: string, password: string) => Promise<void>
  logout: () => Promise<void>
  getCurrentUser: () => Promise<void>
  verifySession: () => Promise<void>

  // Forgot password actions
  showForgotPasswordForm: () => void
  hideForgotPasswordForm: () => void
  sendPasswordReset: (email: string) => Promise<void>
  proceedToCodeVerification: (email: string) => void
  resetPasswordWithCode: (code: string, newPassword: string) => Promise<void>
  resetForgotPasswordState: () => void

  // Utility actions
  clearError: () => void
  setLoading: (loading: boolean) => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      // Initial state
      isLoggedIn: false,
      user: null,
      isLoading: false,
      error: null,
      showForgotPassword: false,
      resetEmailSent: false,
      showCodeVerification: false,
      resetEmail: "",

      login: async (email: string, password: string) => {
        set({ isLoading: true, error: null })
        try {
          const response = await authService.login({ email, password })
          const user = response.user
          if (user.role !== "admin" && user.role !== "super_admin") {
            throw new Error("Access denied. Admin privileges required.")
          }
          set({
            isLoggedIn: true,
            user: user,
            isLoading: false,
            error: null,
          })
        } catch (error: any) {
          set({
            isLoading: false,
            error: error.response?.data?.message || error.message || "Login failed. Please try again.",
          })
          throw error
        }
      },

      logout: async () => {
        set({ isLoading: true })
        try {
          await authService.logout()
        } catch (error) {
          console.error("Logout error:", error)
        } finally {
          set({
            isLoggedIn: false,
            user: null,
            isLoading: false,
            error: null,
            showForgotPassword: false,
            resetEmailSent: false,
            showCodeVerification: false,
            resetEmail: "",
          })
        }
      },

      getCurrentUser: async () => {
        set({ isLoading: true, error: null })
        try {
          const user = await authService.getCurrentUser()
          set({ user, isLoading: false })
        } catch (error: any) {
          set({
            isLoading: false,
            error: error.response?.data?.message || "Failed to get user info",
          })
        }
      },

      verifySession: async () => {
        set({ isLoading: true })
        try {
          const isValid = await authService.verifySession()
          if (isValid) {
            await get().getCurrentUser()
            set({ isLoggedIn: true })
          } else {
            set({ isLoggedIn: false, user: null })
          }
        } catch (error) {
          set({ isLoggedIn: false, user: null })
        } finally {
          set({ isLoading: false })
        }
      },

      sendPasswordReset: async (email: string) => {
        set({ isLoading: true, error: null })
        try {
          await authService.forgotPassword(email)
          set({ resetEmailSent: true, isLoading: false })
        } catch (error: any) {
          set({
            isLoading: false,
            error: error.response?.data?.message || "Failed to send reset email",
          })
          throw error
        }
      },

      proceedToCodeVerification: (email: string) => {
        set({ showCodeVerification: true, resetEmail: email, resetEmailSent: false })
      },

      resetPasswordWithCode: async (code: string, newPassword: string) => {
        set({ isLoading: true, error: null })
        try {
          await authService.resetPassword({
            email: get().resetEmail,
            code,
            newPassword,
          })
          set({
            isLoggedIn: false, // Don't auto-login after password reset
            showForgotPassword: false,
            resetEmailSent: false,
            showCodeVerification: false,
            resetEmail: "",
            isLoading: false,
          })
        } catch (error: any) {
          set({
            isLoading: false,
            error: error.response?.data?.message || "Failed to reset password",
          })
          throw error
        }
      },

      resetForgotPasswordState: () =>
        set({ showForgotPassword: false, resetEmailSent: false, showCodeVerification: false, resetEmail: "" }),

      clearError: () => set({ error: null }),
      setLoading: (loading: boolean) => set({ isLoading: loading }),

      // Existing code
      showForgotPasswordForm: () =>
        set({ showForgotPassword: true, resetEmailSent: false, showCodeVerification: false }),
      hideForgotPasswordForm: () =>
        set({ showForgotPassword: false, resetEmailSent: false, showCodeVerification: false, resetEmail: "" }),
    }),
    {
      name: "auth-storage",
      partialize: (state) => ({
        isLoggedIn: state.isLoggedIn,
        user: state.user,
      }),
    },
  ),
)
