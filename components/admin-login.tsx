"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useAuthStore } from "@/lib/auth-store"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useRouter } from "next/navigation"

export function AdminLogin() {

  const router = useRouter()

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [resetEmail, setResetEmail] = useState("")
  const [isResetting, setIsResetting] = useState(false)
  const [verificationCode, setVerificationCode] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [repeatPassword, setRepeatPassword] = useState("")
  const [isVerifying, setIsVerifying] = useState(false)

  const {
    isLoggedIn,
    showForgotPassword,
    resetEmailSent,
    showCodeVerification,
    resetEmail: storedResetEmail,
    login,
    showForgotPasswordForm,
    hideForgotPasswordForm,
    sendPasswordReset,
    proceedToCodeVerification,
    resetPasswordWithCode,
  } = useAuthStore()

  useEffect(() => {
    if (isLoggedIn) {
      router.push("/admin")
    }

  }, [isLoggedIn]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    await new Promise((resolve) => setTimeout(resolve, 1000))

    login(email, password)
    setIsLoading(false)
  }

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsResetting(true)
    await sendPasswordReset(resetEmail)
    proceedToCodeVerification(resetEmail)
    setIsResetting(false)
  }

  const handleCodeVerification = async (e: React.FormEvent) => {
    e.preventDefault()

    if (newPassword !== repeatPassword) {
      alert("Passwords don't match!")
      return
    }

    if (newPassword.length < 6) {
      alert("Password must be at least 6 characters long!")
      return
    }

    setIsVerifying(true)
    await resetPasswordWithCode(verificationCode, newPassword)
    setIsVerifying(false)
  }

  if (showCodeVerification) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center p-4">
        <div className="w-full max-w-md animate-in fade-in-0 slide-in-from-bottom-4 duration-700">
          <Card className="shadow-2xl border-0 bg-white">
            <CardHeader className="text-center pb-8">
              <div
                className="mx-auto w-16 h-16 rounded-full flex items-center justify-center mb-4"
                style={{ backgroundColor: "#419672" }}
              >
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 7a2 2 0 012 2m0 0a2 2 0 012 2m-2-2a2 2 0 00-2 2m2-2V5a2 2 0 00-2-2m0 0V3a2 2 0 00-2-2m2 2a2 2 0 012 2m0 0v2a2 2 0 002 2m-2-2a2 2 0 00-2-2"
                  />
                </svg>
              </div>
              <CardTitle className="text-2xl font-bold text-black">Reset Your Password</CardTitle>
              <CardDescription className="text-gray-600 mt-2">
                Enter the verification code sent to your email and create a new password.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleCodeVerification} className="space-y-6">
                <div className="space-y-2">
                  <label htmlFor="email-display" className="text-black font-medium">
                    Email Address
                  </label>
                  <Input
                    id="email-display"
                    type="email"
                    value={storedResetEmail}
                    disabled
                    className="h-12 rounded-xl border-gray-200 shadow-sm bg-gray-50 text-gray-600"
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="verification-code" className="text-black font-medium">
                    Verification Code
                  </label>
                  <Input
                    id="verification-code"
                    type="text"
                    placeholder="Enter 6-digit code"
                    value={verificationCode}
                    onChange={(e) => setVerificationCode(e.target.value)}
                    required
                    maxLength={6}
                    className="h-12 rounded-xl border-gray-200 shadow-sm focus:shadow-md transition-all duration-200 focus:border-transparent focus:ring-2 text-black placeholder:text-gray-400"
                    style={{ "--tw-ring-color": "#419672" } as React.CSSProperties}
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="new-password" className="text-black font-medium">
                    New Password
                  </label>
                  <Input
                    id="new-password"
                    type="password"
                    placeholder="Enter new password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                    minLength={6}
                    className="h-12 rounded-xl border-gray-200 shadow-sm focus:shadow-md transition-all duration-200 focus:border-transparent focus:ring-2 text-black placeholder:text-gray-400"
                    style={{ "--tw-ring-color": "#419672" } as React.CSSProperties}
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="repeat-password" className="text-black font-medium">
                    Repeat New Password
                  </label>
                  <Input
                    id="repeat-password"
                    type="password"
                    placeholder="Repeat new password"
                    value={repeatPassword}
                    onChange={(e) => setRepeatPassword(e.target.value)}
                    required
                    minLength={6}
                    className="h-12 rounded-xl border-gray-200 shadow-sm focus:shadow-md transition-all duration-200 focus:border-transparent focus:ring-2 text-black placeholder:text-gray-400"
                    style={{ "--tw-ring-color": "#419672" } as React.CSSProperties}
                  />
                </div>
                <div className="space-y-3">
                  <Button
                    type="submit"
                    disabled={isVerifying}
                    className="w-full h-12 rounded-xl font-semibold text-white shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed"
                    style={
                      {
                        backgroundColor: "#419672",
                        "--tw-shadow-color": "rgba(65, 150, 114, 0.3)",
                      } as React.CSSProperties
                    }
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = "#154B2B"
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = "#419672"
                    }}
                  >
                    {isVerifying ? (
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        Resetting Password...
                      </div>
                    ) : (
                      "Reset Password"
                    )}
                  </Button>
                  <Button
                    type="button"
                    onClick={hideForgotPasswordForm}
                    variant="ghost"
                    className="w-full h-12 rounded-xl font-medium text-gray-600 hover:text-black hover:bg-gray-50 transition-all duration-200"
                  >
                    Back to Login
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  if (showForgotPassword) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center p-4">
        <div className="w-full max-w-md animate-in fade-in-0 slide-in-from-bottom-4 duration-700">
          <Card className="shadow-2xl border-0 bg-white">
            <CardHeader className="text-center pb-8">
              <div
                className="mx-auto w-16 h-16 rounded-full flex items-center justify-center mb-4"
                style={{ backgroundColor: "#419672" }}
              >
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
              </div>
              <CardTitle className="text-2xl font-bold text-black">Reset Password</CardTitle>
              <CardDescription className="text-gray-600 mt-2">
                Enter your email address and we'll send you a verification code to reset your password.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleForgotPassword} className="space-y-6">
                <div className="space-y-2">
                  <label htmlFor="reset-email" className="text-black font-medium">
                    Email Address
                  </label>
                  <Input
                    id="reset-email"
                    type="email"
                    placeholder="admin@newsportal.com"
                    value={resetEmail}
                    onChange={(e) => setResetEmail(e.target.value)}
                    required
                    className="h-12 rounded-xl border-gray-200 shadow-sm focus:shadow-md transition-all duration-200 focus:border-transparent focus:ring-2 text-black placeholder:text-gray-400"
                    style={{ "--tw-ring-color": "#419672" } as React.CSSProperties}
                  />
                </div>
                <div className="space-y-3">
                  <Button
                    type="submit"
                    disabled={isResetting}
                    className="w-full h-12 rounded-xl font-semibold text-white shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed"
                    style={
                      {
                        backgroundColor: "#419672",
                        "--tw-shadow-color": "rgba(65, 150, 114, 0.3)",
                      } as React.CSSProperties
                    }
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = "#154B2B"
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = "#419672"
                    }}
                  >
                    {isResetting ? (
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        Sending Code...
                      </div>
                    ) : (
                      "Send Verification Code"
                    )}
                  </Button>
                  <Button
                    type="button"
                    onClick={hideForgotPasswordForm}
                    variant="ghost"
                    className="w-full h-12 rounded-xl font-medium text-gray-600 hover:text-black hover:bg-gray-50 transition-all duration-200"
                  >
                    Back to Login
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-4">
      <div className="w-full max-w-md animate-in fade-in-0 slide-in-from-bottom-4 duration-700">
        <Card className="shadow-2xl border-0 bg-white">
          <CardHeader className="text-center pb-8">
            <div
              className="mx-auto w-16 h-16 rounded-full flex items-center justify-center mb-4"
              style={{ backgroundColor: "#419672" }}
            >
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"
                />
              </svg>
            </div>
            <CardTitle className="text-2xl font-bold text-black">News Portal Admin</CardTitle>
            <CardDescription className="text-gray-600 mt-2">Sign in to access the admin dashboard</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-6">
              <div className="space-y-2">
                <label htmlFor="email" className="text-black font-medium">
                  Email
                </label>
                <Input
                  id="email"
                  type="email"
                  placeholder="admin@newsportal.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="h-12 rounded-xl border-gray-200 shadow-sm focus:shadow-md transition-all duration-200 focus:border-transparent focus:ring-2 text-black placeholder:text-gray-400"
                  style={{ "--tw-ring-color": "#419672" } as React.CSSProperties}
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="password" className="text-black font-medium">
                  Password
                </label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="h-12 rounded-xl border-gray-200 shadow-sm focus:shadow-md transition-all duration-200 focus:border-transparent focus:ring-2 text-black placeholder:text-gray-400"
                  style={{ "--tw-ring-color": "#419672" } as React.CSSProperties}
                />
              </div>
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={showForgotPasswordForm}
                  className="text-sm font-medium hover:underline transition-colors duration-200"
                  style={{ color: "#419672" }}
                >
                  Forgot your password?
                </button>
              </div>
              <Button
                type="submit"
                disabled={isLoading}
                className="cursor-pointer w-full h-12 rounded-xl font-semibold text-white shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed"
                style={
                  {
                    backgroundColor: "#419672",
                    "--tw-shadow-color": "rgba(65, 150, 114, 0.3)",
                  } as React.CSSProperties
                }
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = "#154B2B"
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = "#419672"
                }}
              >
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Signing in...
                  </div>
                ) : (
                  "Login"
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
