"use client"

import type React from "react"

import { useAuth } from "@/contexts/auth-context"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Building2, Users, Shield, Home, CreditCard, Calendar, Settings, LogOut, Menu, X } from "lucide-react"
import { useState } from "react"
import { useRouter } from "next/navigation"

interface DashboardLayoutProps {
  children: React.ReactNode
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const { user, logout } = useAuth()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const router = useRouter()

  const handleLogout = () => {
    logout()
    router.push("/")
  }

  const getNavigationItems = () => {
    const baseItems = [{ icon: Home, label: "Dashboard", href: "/dashboard" }]

    switch (user?.role) {
      case "administrator":
        return [
          ...baseItems,
          { icon: Users, label: "User Management", href: "/admin/users" },
          { icon: Building2, label: "Unit Management", href: "/admin/units" },
          { icon: CreditCard, label: "Expenses", href: "/admin/expenses" },
          { icon: Calendar, label: "Reservations", href: "/admin/reservations" },
          { icon: Settings, label: "Settings", href: "/admin/settings" },
        ]
      case "security":
        return [
          ...baseItems,
          { icon: Shield, label: "Security Monitor", href: "/security/monitor" },
          { icon: Users, label: "Visitor Access", href: "/security/visitors" },
          { icon: Settings, label: "Incidents", href: "/security/incidents" },
        ]
      case "owner":
        return [
          ...baseItems,
          { icon: CreditCard, label: "Payments", href: "/owner/payments" },
          { icon: Calendar, label: "Reservations", href: "/owner/reservations" },
          { icon: Settings, label: "Profile", href: "/owner/profile" },
        ]
      case "tenant":
        return [
          ...baseItems,
          { icon: CreditCard, label: "Payments", href: "/tenant/payments" },
          { icon: Calendar, label: "Reservations", href: "/tenant/reservations" },
          { icon: Settings, label: "Profile", href: "/tenant/profile" },
        ]
      default:
        return baseItems
    }
  }

  const navigationItems = getNavigationItems()

  return (
    <div className="min-h-screen bg-background">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-card border-r border-border transform transition-transform duration-200 ease-in-out lg:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between h-16 px-6 border-b border-border">
          <div className="flex items-center space-x-2">
            <Building2 className="w-8 h-8 text-primary" />
            <span className="text-xl font-bold">CondoManager</span>
          </div>
          <Button variant="ghost" size="sm" className="lg:hidden" onClick={() => setSidebarOpen(false)}>
            <X className="w-4 h-4" />
          </Button>
        </div>

        <nav className="flex-1 px-4 py-6 space-y-2">
          {navigationItems.map((item) => (
            <Button
              key={item.href}
              variant="ghost"
              className="w-full justify-start text-left hover:bg-accent/10"
              onClick={() => {
                router.push(item.href)
                setSidebarOpen(false)
              }}
            >
              <item.icon className="w-4 h-4 mr-3" />
              {item.label}
            </Button>
          ))}
        </nav>

        <div className="p-4 border-t border-border">
          <div className="flex items-center space-x-3 mb-4">
            <Avatar>
              <AvatarFallback className="bg-primary text-primary-foreground">
                {user?.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{user?.name}</p>
              <p className="text-xs text-muted-foreground capitalize">{user?.role}</p>
              {user?.unitNumber && <p className="text-xs text-accent">Unit {user.unitNumber}</p>}
            </div>
          </div>
          <Button variant="outline" size="sm" className="w-full bg-transparent" onClick={handleLogout}>
            <LogOut className="w-4 h-4 mr-2" />
            Sign Out
          </Button>
        </div>
      </div>

      {/* Main content */}
      <div className="lg:pl-64">
        {/* Top bar */}
        <header className="h-16 bg-card border-b border-border flex items-center justify-between px-6">
          <Button variant="ghost" size="sm" className="lg:hidden" onClick={() => setSidebarOpen(true)}>
            <Menu className="w-4 h-4" />
          </Button>
          <div className="flex items-center space-x-4">
            <span className="text-sm text-muted-foreground">Welcome back, {user?.name}</span>
          </div>
        </header>

        {/* Page content */}
        <main className="p-6">{children}</main>
      </div>
    </div>
  )
}
