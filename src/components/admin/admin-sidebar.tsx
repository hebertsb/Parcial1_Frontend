"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Building2,
  LayoutDashboard,
  Users,
  Shield,
  Home,
  CreditCard,
  MessageSquare,
  Calendar,
  Settings,
  Wrench,
  Car,
  BarChart3,
  Clock,
  Building,
  LogOut
} from "lucide-react"

const sidebarItems = [
  {
    title: "Dashboard",
    href: "/admin",
    icon: LayoutDashboard,
  },
  {
    title: "Usuarios",
    href: "/admin/usuarios",
    icon: Users,
  },
  {
    title: "Personal Seguridad", 
    href: "/admin/usuarios-seguridad",
    icon: Shield,
  },
  {
    title: "Unidades",
    href: "/admin/unidades",
    icon: Home,
  },
  {
    title: "Finanzas",
    href: "/admin/finanzas",
    icon: CreditCard,
  },
  {
    title: "Comunicados",
    href: "/admin/comunicados",
    icon: MessageSquare,
  },
  {
    title: "Reservas",
    href: "/admin/reservas", 
    icon: Calendar,
  },
  {
    title: "Mantenimiento",
    href: "/admin/mantenimiento",
    icon: Wrench,
  },
  {
    title: "Seguridad",
    href: "/admin/seguridad",
    icon: Shield,
  },
  {
    title: "Servicios",
    href: "/admin/servicios",
    icon: Building,
  },
  {
    title: "Reportes",
    href: "/admin/reportes", 
    icon: BarChart3,
  },
  {
    title: "Historial",
    href: "/admin/historial",
    icon: Clock,
  },
  {
    title: "Configuración",
    href: "/admin/configuracion",
    icon: Settings,
  },
]

export function AdminSidebar() {
  const pathname = usePathname()

  const handleLogout = () => {
    try {
      // Limpiar localStorage y sessionStorage
      localStorage.clear()
      sessionStorage.clear()
      
      // Redirigir al login
      window.location.href = "/"
    } catch (error) {
      console.error('Error durante logout:', error)
      // Forzar redirección incluso si hay error
      window.location.href = "/"
    }
  }

  return (
    <div className="w-64 bg-gray-900 border-r border-gray-700 flex flex-col">
      {/* Header */}
      <div className="p-6 border-b border-gray-700">
        <div className="flex items-center space-x-3">
          <Building2 className="h-8 w-8 text-emerald-500" />
          <div>
            <h1 className="text-lg font-bold text-white">Residencial Villa</h1>
            <h2 className="text-lg font-bold text-white">Esperanza</h2>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
        {sidebarItems.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center space-x-3 px-3 py-2 rounded-md text-sm font-medium transition-colors",
                isActive
                  ? "bg-emerald-600 text-white"
                  : "text-gray-300 hover:bg-gray-800 hover:text-white"
              )}
            >
              <item.icon className="h-5 w-5" />
              <span>{item.title}</span>
            </Link>
          )
        })}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-gray-700">
        <Button
          onClick={handleLogout}
          variant="ghost"
          className="w-full justify-start text-gray-300 hover:text-white hover:bg-gray-800"
        >
          <LogOut className="h-5 w-5 mr-3" />
          Cerrar Sesión
        </Button>
      </div>
    </div>
  )
}