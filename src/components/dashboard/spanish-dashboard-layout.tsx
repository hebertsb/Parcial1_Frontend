"use client"

import type React from "react"
import { useAuth } from "@/contexts/auth-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Building2,
  Users,
  Home,
  CreditCard,
  Calendar,
  Settings,
  Menu,
  X,
  Shield,
  Car,
  FileText,
  History,
  MessageSquare,
  Wrench,
  Search,
  Bell,
  Moon,
  User,
  ChevronRight,
  ChevronDown,
  LogOut,
} from "lucide-react"
import { useState } from "react"
import { useRouter, usePathname } from "next/navigation"

interface SpanishDashboardLayoutProps {
  children: React.ReactNode
}

export function SpanishDashboardLayout({ children }: SpanishDashboardLayoutProps) {
  const { user, logout } = useAuth()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const router = useRouter()
  const pathname = usePathname()

  const handleLogout = async () => {
    try {
      console.log('🚪 Dashboard: Iniciando logout...')
      await logout()
      console.log('✅ Dashboard: Logout exitoso, redirigiendo...')
      router.push("/")
    } catch (error) {
      console.error('❌ Dashboard: Error durante logout:', error)
      // Aún así redirigir, por si falla el logout del servidor
      router.push("/")
    }
  }

  const getNavigationItems = () => {
    const baseItems = [{ icon: Home, label: "Dashboard", href: "/dashboard" }]

    switch (user?.role) {
      case "administrator":
        return [
          ...baseItems,
          { icon: Users, label: "Usuarios", href: "/admin/usuarios" },
          { icon: Building2, label: "Unidades", href: "/admin/unidades" },
          { icon: CreditCard, label: "Finanzas", href: "/admin/finanzas", hasSubmenu: true },
          { icon: MessageSquare, label: "Comunicados", href: "/admin/comunicados" },
          { icon: Calendar, label: "Reservas", href: "/admin/reservas" },
          { icon: Wrench, label: "Mantenimiento", href: "/admin/mantenimiento", hasSubmenu: true },
          { icon: Shield, label: "Seguridad", href: "/admin/seguridad", hasSubmenu: true },
          { icon: Car, label: "Vehículos", href: "/admin/vehiculos" },
          { icon: FileText, label: "Reportes", href: "/admin/reportes", hasSubmenu: true },
          { icon: History, label: "Historial", href: "/admin/historial" },
          { icon: Settings, label: "Configuración", href: "/admin/configuracion" },
        ]
      case "security":
        return [
          ...baseItems,
          { icon: Shield, label: "Monitor Seguridad", href: "/security/monitor" },
          { icon: Users, label: "Control Acceso", href: "/security/acceso" },
          { icon: FileText, label: "Incidentes", href: "/security/incidentes" },
          { icon: Car, label: "Vehículos", href: "/security/vehiculos" },
          { icon: History, label: "Historial", href: "/security/historial" },
        ]
      case "owner":
        return [
          ...baseItems,
          { icon: CreditCard, label: "Pagos", href: "/owner/pagos" },
          { icon: Calendar, label: "Reservas", href: "/owner/reservas" },
          { icon: Users, label: "Copropietarios", href: "/owner/copropietarios" },
          { icon: MessageSquare, label: "Comunicados", href: "/owner/comunicados" },
          { icon: Settings, label: "Perfil", href: "/owner/perfil" },
        ]
      case "tenant":
        return [
          ...baseItems,
          { icon: CreditCard, label: "Pagos Alquiler", href: "/tenant/pagos" },
          { icon: Calendar, label: "Reservas", href: "/tenant/reservas" },
          { icon: MessageSquare, label: "Comunicados", href: "/tenant/comunicados" },
          { icon: Settings, label: "Perfil", href: "/tenant/perfil" },
        ]
      default:
        return baseItems
    }
  }

  const navigationItems = getNavigationItems()

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-[#111111] border-r border-[#1f1f1f] transform transition-transform duration-200 ease-in-out lg:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between h-16 px-4 border-b border-[#1f1f1f]">
          <div className="flex items-center space-x-2">
            <Building2 className="w-6 h-6 text-white" />
            <span className="text-sm font-medium text-white">Los Vecinos Ruidosos</span>
            <ChevronRight className="w-4 h-4 text-gray-400" />
          </div>
          <Button
            variant="ghost"
            size="sm"
            className="lg:hidden text-white hover:bg-[#1f1f1f]"
            onClick={() => setSidebarOpen(false)}
          >
            <X className="w-4 h-4" />
          </Button>
        </div>

        <nav className="flex-1 px-2 py-4 space-y-1">
          {navigationItems.map((item) => (
            <Button
              key={item.href}
              variant="ghost"
              className={`w-full justify-start text-left text-sm font-normal h-9 px-3 ${
                pathname === item.href ? "bg-[#1f1f1f] text-white" : "text-gray-300 hover:bg-[#1a1a1a] hover:text-white"
              }`}
              onClick={() => {
                router.push(item.href)
                setSidebarOpen(false)
              }}
            >
              <item.icon className="w-4 h-4 mr-3" />
              {item.label}
              {'hasSubmenu' in item && item.hasSubmenu && <ChevronRight className="w-3 h-3 ml-auto" />}
            </Button>
          ))}
        </nav>
      </div>

      {/* Main content */}
      <div className="lg:pl-64">
        {/* Top bar */}
        <header className="h-16 bg-[#111111] border-b border-[#1f1f1f] flex items-center justify-between px-6">
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="sm"
              className="lg:hidden text-white hover:bg-[#1f1f1f]"
              onClick={() => setSidebarOpen(true)}
            >
              <Menu className="w-4 h-4" />
            </Button>
            <span className="text-sm font-medium text-white">Los Vecinos Ruidosos</span>
          </div>

          <div className="flex items-center space-x-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                placeholder="Buscar... (Ctrl+K)"
                className="w-64 bg-[#1a1a1a] border-[#2a2a2a] text-white placeholder-gray-400 pl-10 h-8 text-sm"
              />
              <kbd className="absolute right-3 top-1/2 transform -translate-y-1/2 text-xs text-gray-400 bg-[#2a2a2a] px-1.5 py-0.5 rounded">
                K
              </kbd>
            </div>
            <Button variant="ghost" size="sm" className="text-white hover:bg-[#1f1f1f]">
              <Bell className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="sm" className="text-white hover:bg-[#1f1f1f]">
              <Moon className="w-4 h-4" />
            </Button>
            
            {/* User Info and Logout */}
            <div className="flex items-center space-x-2">
              <div className="hidden md:flex flex-col text-right">
                <span className="text-sm font-medium text-white">{user?.name || 'Usuario'}</span>
                <span className="text-xs text-gray-400">{user?.role || 'Role'}</span>
              </div>
              <Button 
                variant="ghost" 
                size="sm" 
                className="text-red-400 hover:bg-red-500/10 hover:text-red-300 flex items-center space-x-2"
                onClick={handleLogout}
              >
                <LogOut className="w-4 h-4" />
                <span className="hidden md:inline text-sm">Cerrar Sesión</span>
              </Button>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="p-6">{children}</main>
      </div>
    </div>
  )
}
