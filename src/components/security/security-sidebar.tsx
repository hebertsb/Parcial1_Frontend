"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Shield,
  LayoutDashboard,
  Users,
  UserCheck,
  Camera,
  Activity,
  QrCode,
  AlertTriangle,
  Eye,
  Settings,
  LogOut,
  Home
} from "lucide-react"

const sidebarItems = [
  {
    title: "Dashboard",
    href: "/security",
    icon: LayoutDashboard,
  },
  {
    title: "Reconocimiento Facial",
    href: "/security/reconocimiento-facial",
    icon: Camera,
  },
  {
    title: "Verificación con IA",
    href: "/security/reconocimiento-facial-ia",
    icon: Eye,
  },
  {
    title: "Propietarios",
    href: "/security/propietarios-reconocimiento",
    icon: Home,
  },
  {
    title: "Control de Visitas",
    href: "/security/visitas",
    icon: UserCheck,
  },
  {
    title: "Escáner QR",
    href: "/security/escaner",
    icon: QrCode,
  },
  {
    title: "Incidentes",
    href: "/security/incidentes",
    icon: AlertTriangle,
  },
  {
    title: "Monitoreo",
    href: "/security/monitoreo",
    icon: Eye,
  },
  {
    title: "Usuarios",
    href: "/security/usuarios",
    icon: Users,
  },
  {
    title: "Actividad",
    href: "/security/actividad",
    icon: Activity,
  },
  {
    title: "🚨 Test Proxy",
    href: "/security/test-proxy",
    icon: Settings,
  },
  {
    title: "Configuración",
    href: "/security/configuracion",
    icon: Settings,
  },
]

export function SecuritySidebar() {
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
    <div className="pb-12 min-h-screen w-64 bg-gray-900 border-r border-gray-800">
      <div className="space-y-4 py-4">
        {/* Logo/Header */}
        <div className="px-3 py-2">
          <div className="flex items-center space-x-2 mb-4">
            <Shield className="h-8 w-8 text-emerald-400" />
            <div>
              <h2 className="text-lg font-bold text-white">Seguridad</h2>
              <p className="text-xs text-gray-400">Sistema de Control</p>
            </div>
          </div>
        </div>

        {/* Navigation Items */}
        <div className="px-3 py-2">
          <div className="space-y-1">
            {sidebarItems.map((item) => (
              <Link key={item.href} href={item.href}>
                <Button
                  variant={pathname === item.href ? "secondary" : "ghost"}
                  className={cn(
                    "w-full justify-start text-white hover:bg-gray-800 hover:text-white",
                    pathname === item.href && "bg-emerald-600 text-white hover:bg-emerald-700"
                  )}
                >
                  <item.icon className="mr-2 h-4 w-4" />
                  {item.title}
                </Button>
              </Link>
            ))}
          </div>
        </div>

        {/* Separador */}
        <div className="px-3">
          <div className="border-t border-gray-800"></div>
        </div>

        {/* Estado del Sistema */}
        <div className="px-3 py-2">
          <div className="bg-gray-800 rounded-lg p-3">
            <div className="flex items-center space-x-2 mb-2">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span className="text-sm font-medium text-green-400">Sistema Activo</span>
            </div>
            <div className="text-xs text-gray-400">
              <div>Cámaras: 8 activas</div>
              <div>Última actualización: hace 1 min</div>
            </div>
          </div>
        </div>

        {/* Logout Button */}
        <div className="px-3 py-2">
          <Button
            onClick={handleLogout}
            variant="ghost"
            className="w-full justify-start text-red-400 hover:bg-red-900/20 hover:text-red-300"
          >
            <LogOut className="mr-2 h-4 w-4" />
            Cerrar Sesión
          </Button>
        </div>
      </div>
    </div>
  )
}