import { create } from "zustand"
import { persist } from "zustand/middleware"
import * as authService from "@/services/auth"
import axios from 'axios'
import * as jwtDecode from "jwt-decode"

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
  verifySession: () => Promise<unknown>

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

function isTokenValid(token: string | null) {
  if (!token) return false
  try {
    const decoded = jwtDecode.jwtDecode<{ exp: number }>(token)
    return decoded.exp > Date.now() / 1000
  } catch {
    return false
  }
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
        set({ isLoading: true, error: null });
        try {
          const response = await authService.login({ email, password });
          const { access_token } = response.data;

          // Salva o token nos cookies
          document.cookie = `auth_token=${access_token}; path=/; max-age=3600; secure; samesite=strict`;

          localStorage.setItem('auth_token', access_token)

          // Decodifica o token para recuperar o payload
          const payload = jwtDecode.jwtDecode<any>(access_token);

          if (!payload || payload.role === "READER") {
            throw new Error("Access denied");
          }

          // Atualiza o estado
          set({
            isLoggedIn: true,
            user: {
              id: payload.sub,
              email: payload.email,
              role: payload.role,
              name: payload.name
            },
            isLoading: false,
            error: null,
          });

          window.location.href = "/admin";
        } catch (error: any) {
          set({
            isLoading: false,
            error: error.response?.data?.message || error.message || "Login failed",
          });
          throw error;
        }
      },

      verifySession: async () => {
        const cookie = document.cookie
          .split("; ")
          .find(row => row.startsWith("auth_token="));
        const token = cookie?.split("=")[1];
        if (!token) return set({ isLoggedIn: false, user: null });

        try {
          const payload = jwtDecode.jwtDecode<any>(token);
          if (Date.now() >= payload.exp * 1000 || payload.role === "READER") {
            // Token expirado ou role inválida
            set({ isLoggedIn: false, user: null });
            window.location.href = "/";
            return;
          }

          set({
            isLoggedIn: true,
            user: {
              id: payload.sub,
              email: payload.email,
              role: payload.role,
              name: payload.name
            },
          });
        } catch (e) {
          set({ isLoggedIn: false, user: null });
          window.location.href = "/";
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
