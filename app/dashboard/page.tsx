"use client"

import { useAuth } from "@/contexts/auth-context"
import { SpanishDashboardLayout } from "@/components/dashboard/spanish-dashboard-layout"
import AdminDashboard from "@/components/admin/admin-dashboard"
import { SecurityDashboard } from "@/components/dashboard/security-dashboard"
import { OwnerDashboard } from "@/components/dashboard/owner-dashboard"
import { TenantDashboard } from "@/components/dashboard/tenant-dashboard"
import { useRouter } from "next/navigation"
import { useEffect } from "react"

export default function DashboardPage() {
  const { user, isLoading, isAuthenticated } = useAuth()
  const router = useRouter()

  console.log(
    "[v0] Dashboard page rendering, user:",
    user,
    "isLoading:",
    isLoading,
    "isAuthenticated:",
    isAuthenticated,
  )

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      console.log("[v0] User not authenticated, redirecting to login")
      router.push("/")
    }
  }, [isLoading, isAuthenticated, router])

  if (isLoading) {
    console.log("[v0] Dashboard loading...")
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0a0a0a]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  if (!user) {
    console.log("[v0] No user found")
    return null
  }

  console.log("[v0] Rendering dashboard for user role:", user.role)

  const renderDashboard = () => {
    switch (user.role) {
      case "administrator":
        return <AdminDashboard />
      case "security":
        return <SecurityDashboard />
      case "owner":
        return <OwnerDashboard />
      case "tenant":
        return <TenantDashboard />
      default:
        return <div className="text-white">Rol de usuario inválido</div>
    }
  }

  return <SpanishDashboardLayout>{renderDashboard()}</SpanishDashboardLayout>
}
