"use client"

/**
 * Header del dashboard de seguridad con información de usuario y logout
 */

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { 
  Shield, LogOut, User as UserIcon, Clock, AlertTriangle, CheckCircle, 
  Settings, HelpCircle, Loader2 
} from "lucide-react"
import { logoutUser } from "@/lib/auth"
import type { User } from "@/core/types"

interface SecurityHeaderProps {
  user: User | null
  lastUpdate: Date
  onLogout?: () => void
}

export function SecurityHeader({ user, lastUpdate, onLogout }: SecurityHeaderProps) {
  const [loggingOut, setLoggingOut] = useState(false)
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false)
  const router = useRouter()

  const handleLogout = async () => {
    setLoggingOut(true)
    try {
      console.log('🚪 SecurityHeader: Cerrando sesión...')
      await logoutUser()
      
      // Llamar callback si existe
      if (onLogout) {
        onLogout()
      }
      
      console.log('✅ SecurityHeader: Sesión cerrada, redirigiendo...')
      router.push('/security/login')
    } catch (error) {
      console.error('❌ SecurityHeader: Error durante logout:', error)
    } finally {
      setLoggingOut(false)
      setShowLogoutConfirm(false)
    }
  }

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('es-ES', { 
      hour: '2-digit', 
      minute: '2-digit', 
      second: '2-digit' 
    })
  }

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  const getUserRoleBadge = () => {
    if (!user?.role) return null
    
    const roleColors = {
      'seguridad': 'bg-blue-500',
      'security': 'bg-blue-500',
      'administrator': 'bg-purple-500',
      'owner': 'bg-green-500',
      'propietario': 'bg-green-500',
      'tenant': 'bg-yellow-500',
      'inquilino': 'bg-yellow-500',
      'empleado': 'bg-orange-500'
    }
    
    return (
      <Badge 
        className={`${roleColors[user.role as keyof typeof roleColors] || 'bg-gray-500'} text-white text-xs px-2 py-1`}
      >
        {user.role}
      </Badge>
    )
  }

  const getStatusIndicator = () => {
    const now = new Date()
    const timeDiff = now.getTime() - lastUpdate.getTime()
    const minutes = Math.floor(timeDiff / (1000 * 60))
    
    if (minutes < 2) {
      return { icon: CheckCircle, color: 'text-green-500', text: 'En línea' }
    } else if (minutes < 10) {
      return { icon: Clock, color: 'text-yellow-500', text: 'Activo' }
    } else {
      return { icon: AlertTriangle, color: 'text-red-500', text: 'Inactivo' }
    }
  }

  const status = getStatusIndicator()
  const StatusIcon = status.icon

  return (
    <Card className="w-full bg-gradient-to-r from-blue-900 via-blue-800 to-blue-900 text-white shadow-lg border-0">
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          {/* Logo y título */}
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Shield className="h-8 w-8 text-blue-300" />
              <div>
                <h1 className="text-xl font-bold text-white">
                  Panel de Seguridad
                </h1>
                <p className="text-blue-200 text-sm">
                  Sistema de Reconocimiento Facial
                </p>
              </div>
            </div>
          </div>

          {/* Centro - Información del sistema */}
          <div className="flex items-center space-x-6 text-sm">
            <div className="flex items-center space-x-2">
              <StatusIcon className={`h-4 w-4 ${status.color}`} />
              <span className="text-blue-100">
                Sistema {status.text}
              </span>
            </div>
            
            <div className="flex items-center space-x-2">
              <Clock className="h-4 w-4 text-blue-300" />
              <span className="text-blue-100">
                {formatDate(lastUpdate)} - {formatTime(lastUpdate)}
              </span>
            </div>
          </div>

          {/* Usuario y logout */}
          <div className="flex items-center space-x-4">
            {user && (
              <div className="flex items-center space-x-3">
                <div className="text-right">
                  <div className="flex items-center space-x-2">
                    <span className="font-medium text-white">
                      {user.name || 'Usuario'}
                    </span>
                    {getUserRoleBadge()}
                  </div>
                  <p className="text-blue-200 text-xs">
                    {user.email || 'Sin email'}
                  </p>
                </div>
                
                <Avatar className="h-10 w-10 border-2 border-blue-300">
                  <AvatarImage src={user.avatar} alt={user.name} />
                  <AvatarFallback className="bg-blue-600 text-white">
                    <UserIcon className="h-5 w-5" />
                  </AvatarFallback>
                </Avatar>
              </div>
            )}

            {/* Botón de logout */}
            <div className="flex items-center space-x-2">
              {!showLogoutConfirm ? (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowLogoutConfirm(true)}
                  className="bg-transparent border-blue-300 text-blue-100 hover:bg-blue-700 hover:text-white"
                  disabled={loggingOut}
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Salir
                </Button>
              ) : (
                <div className="flex items-center space-x-2">
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={handleLogout}
                    disabled={loggingOut}
                    className="bg-red-600 hover:bg-red-700"
                  >
                    {loggingOut ? (
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    ) : (
                      <LogOut className="h-4 w-4 mr-2" />
                    )}
                    {loggingOut ? 'Saliendo...' : 'Confirmar'}
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowLogoutConfirm(false)}
                    disabled={loggingOut}
                    className="bg-transparent border-blue-300 text-blue-100 hover:bg-blue-700"
                  >
                    Cancelar
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Mensaje de logout en progreso */}
        {loggingOut && (
          <div className="mt-3">
            <Alert className="bg-blue-800 border-blue-600">
              <Loader2 className="h-4 w-4 animate-spin" />
              <AlertDescription className="text-blue-100">
                Cerrando sesión y limpiando datos...
              </AlertDescription>
            </Alert>
          </div>
        )}
      </CardContent>
    </Card>
  )
}