"use client"

import { useEffect } from "react"
import { AdminLogin } from "@/components/admin-login"
import { DashboardLayout, DashboardOverview } from "@/components/dashboard-layout"
import { useAuthStore } from "@/lib/auth-store"

export default function Home() {
  const { isLoggedIn, verifySession, isLoading } = useAuthStore()

  useEffect(() => {
    verifySession()
  }, [verifySession])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (isLoggedIn) {
    return (
      <DashboardLayout>
        <DashboardOverview />
      </DashboardLayout>
    )
  }

  return <AdminLogin />
}
