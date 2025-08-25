"use client"

import type React from "react"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuthStore } from "@/lib/auth-store"
import { DashboardLayout } from "@/components/dashboard-layout"

import { ToastContainer } from "react-toastify"
import 'react-toastify/dist/ReactToastify.css'
import Loading from "../loading"

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()
  const { isLoggedIn, user, isLoading, verifySession } = useAuthStore()

  useEffect(() => {
    verifySession()
  }, [router])

  // Show loading while checking auth
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  // Don't render admin content if not authorized
  if (!isLoggedIn || !user || (!user.role || user?.role === "READER")) {
    return null
  }

  return <DashboardLayout>
    {children}
    <ToastContainer position="top-right" autoClose={false} />
    <Loading />
  </DashboardLayout>
}
