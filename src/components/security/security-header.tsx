"use client"

/**
 * Header del dashboard de seguridad con estilo similar al admin
 */

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { 
  Shield, LogOut, User as UserIcon, Settings, 
  Eye, Activity, Camera, Clock, CheckCircle
} from "lucide-react"
import type { User } from "@/core/types"

interface SecurityHeaderProps {
  user: User | null
  lastUpdate: Date
  onLogout?: () => void
}

export function SecurityHeader({ user, lastUpdate, onLogout }: SecurityHeaderProps) {
  const { logout } = useAuth()
  const router = useRouter()

  const handleLogout = async () => {
    try {
      console.log('🚪 SecurityHeader: Cerrando sesión de seguridad...')
      await logout()
      
      if (onLogout) {
        onLogout()
      }
      
      console.log('✅ SecurityHeader: Sesión cerrada, redirigiendo...')
      router.push('/')
    } catch (error) {
      console.error('❌ SecurityHeader: Error durante logout:', error)
      router.push('/')
    }
  }

  const getUserInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('es-ES', { 
      hour: '2-digit', 
      minute: '2-digit', 
      second: '2-digit' 
    })
  }

  const getStatusIndicator = () => {
    const now = new Date()
    const timeDiff = now.getTime() - lastUpdate.getTime()
    const minutes = Math.floor(timeDiff / (1000 * 60))
    
    if (minutes < 2) {
      return { icon: CheckCircle, color: 'text-green-500', text: 'Sistema En línea' }
    } else if (minutes < 10) {
      return { icon: Clock, color: 'text-yellow-500', text: 'Sistema Activo' }
    } else {
      return { icon: Activity, color: 'text-orange-500', text: 'Sistema Inactivo' }
    }
  }

  const status = getStatusIndicator()

  return (
    <header className="border-b border-gray-800 bg-gray-900 backdrop-blur supports-[backdrop-filter]:bg-gray-900/95 sticky top-0 z-50">
      <div className="flex h-16 items-center justify-between px-4 md:px-6">
        {/* Logo/Brand - Lado izquierdo */}
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <Shield className="h-6 w-6 text-emerald-400" />
            <div>
              <h1 className="text-lg font-bold text-white">Panel de Seguridad</h1>
              <p className="text-xs text-gray-400">Sistema de Reconocimiento Facial</p>
            </div>
          </div>
          
          {/* Status indicator */}
          <div className="flex items-center space-x-2 bg-gray-800 px-3 py-1 rounded-full">
            <status.icon className={`h-4 w-4 ${status.color}`} />
            <span className="text-xs text-gray-300">{status.text}</span>
            <span className="text-xs text-gray-400">• {formatTime(lastUpdate)}</span>
          </div>
        </div>

        {/* User menu - Lado derecho */}
        <div className="flex items-center space-x-4">
          {user && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-10 w-auto px-3 hover:bg-gray-800">
                  <div className="flex items-center space-x-3">
                    <Avatar className="h-8 w-8 border-2 border-gray-600">
                      <AvatarImage src={user.avatar} alt={user.name} />
                      <AvatarFallback className="bg-emerald-600 text-white text-xs">
                        {user.name ? getUserInitials(user.name) : <UserIcon className="h-4 w-4" />}
                      </AvatarFallback>
                    </Avatar>
                    <div className="text-left">
                      <div className="flex items-center space-x-2">
                        <span className="text-sm font-medium text-white">
                          {user.name || 'Personal de Seguridad'}
                        </span>
                        <Badge className="bg-blue-500 text-white text-xs px-2 py-0.5">
                          {user.role === 'security' ? 'Seguridad' : 
                           user.role === 'administrator' ? 'Admin' : user.role}
                        </Badge>
                      </div>
                      <p className="text-xs text-blue-200">
                        {user.email || 'seguridad@facial.com'}
                      </p>
                    </div>
                  </div>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end">
                <DropdownMenuLabel>
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">
                      {user.name || 'Personal de Seguridad'}
                    </p>
                    <p className="text-xs leading-none text-muted-foreground">
                      {user.email || 'seguridad@facial.com'}
                    </p>
                    <div className="flex items-center space-x-2 mt-1">
                      <Shield className="h-3 w-3 text-blue-500" />
                      <span className="text-xs text-blue-600 font-medium">
                        Personal de Seguridad
                      </span>
                    </div>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                
                {/* Profile Menu Items */}
                <DropdownMenuItem className="cursor-pointer">
                  <UserIcon className="mr-2 h-4 w-4" />
                  <div className="flex flex-col">
                    <span className="text-sm">Ver Perfil</span>
                    <span className="text-xs text-muted-foreground">Información personal</span>
                  </div>
                </DropdownMenuItem>
                
                <DropdownMenuItem className="cursor-pointer">
                  <Settings className="mr-2 h-4 w-4" />
                  <div className="flex flex-col">
                    <span className="text-sm">Configuración</span>
                    <span className="text-xs text-muted-foreground">Ajustes del sistema</span>
                  </div>
                </DropdownMenuItem>
                
                <DropdownMenuItem className="cursor-pointer">
                  <Eye className="mr-2 h-4 w-4" />
                  <div className="flex flex-col">
                    <span className="text-sm">Monitoreo</span>
                    <span className="text-xs text-muted-foreground">Panel de vigilancia</span>
                  </div>
                </DropdownMenuItem>
                
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout} className="cursor-pointer text-red-600">
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Cerrar Sesión</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </div>
    </header>
  )
}