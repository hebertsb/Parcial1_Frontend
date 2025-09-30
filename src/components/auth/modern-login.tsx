"use client"

import React, { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Building2, Loader2, Eye, EyeOff, UserPlus, Shield, Home, Users } from "lucide-react"
import { authService } from "@/lib/auth"
import { useAuth } from "@/contexts/auth-context"
import { getDashboardRoute } from "@/lib/roleUtils"
import type { UserRole } from "@/core/types"

export function ModernLogin() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const { login, isAuthenticated, user } = useAuth()
  const router = useRouter()

  // Redirigir si ya está autenticado
  React.useEffect(() => {
    if (isAuthenticated && user) {
      const dashboardRoute = getDashboardRoute(user.role)
      router.replace(dashboardRoute)
    }
  }, [isAuthenticated, user, router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    try {
      const response = await authService.login({ email, password })
      if (response.success && response.data) {
        // Use the user that comes directly from AuthService (already formatted)
        const frontendUser = {
          id: response.data.user.id,
          email: response.data.user.email,
          name: response.data.user.name,  // Use the name that AuthService already created
          role: response.data.user.role,
          unitNumber: response.data.user.unitNumber,
          phone: response.data.user.phone,
          avatar: response.data.user.avatar
        }
        console.log('🔓 Login: Usuario antes de llamar login():', frontendUser);
        login(frontendUser)
        
        // Redirección basada en el rol del usuario
        const dashboardRoute = getDashboardRoute(frontendUser.role as UserRole);
        console.log(`🎯 Login: Usuario final:`, frontendUser);
        console.log(`🎯 Login: Rol del usuario:`, frontendUser.role);
        console.log(`🎯 Login: Tipo de rol:`, typeof frontendUser.role);
        console.log(`🎯 Login: Ruta calculada:`, dashboardRoute);
        console.log(`🎯 Login: Redirigiendo ${frontendUser.role} a ${dashboardRoute}`);
        
        // Debug de la función getDashboardRoute
        console.log(`🔍 Login: Verificando función getDashboardRoute para rol "${frontendUser.role}"`);
        
        router.push(dashboardRoute)
      } else {
        setError("Invalid email or password")
      }
    } catch (err) {
      setError("An error occurred during login")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 relative">
      {/* Imagen de fondo del condominio */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-30"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1564013799919-ab600027ffc6?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80')`
        }}
      ></div>
      
      <div className="container mx-auto px-4 py-8 flex items-center justify-center min-h-screen relative z-10">
        <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          
          {/* Left Side - Welcome Section */}
          <div className="hidden lg:block space-y-12 bg-white/80 backdrop-blur-sm rounded-3xl p-12 shadow-xl">
            <div className="space-y-8">
              <div className="inline-flex items-center space-x-4">
                <div className="w-16 h-16 bg-gradient-to-br from-slate-700 to-slate-800 rounded-2xl flex items-center justify-center shadow-lg">
                  <Building2 className="w-8 h-8 text-white" />
                </div>
                <h1 className="text-3xl font-bold text-gray-900">Residencial Villa Esperanza</h1>
              </div>
              
              <div className="space-y-6">
                <h2 className="text-5xl font-bold text-gray-900 leading-tight">
                  Sistema de Gestión<br />
                  <span className="text-slate-700">Residencial</span>
                </h2>
                <p className="text-xl text-gray-600 leading-relaxed">
                  Plataforma integral para la administración moderna de condominios y comunidades residenciales.
                </p>
              </div>

              <div className="grid grid-cols-1 gap-6">
                <div className="flex items-center space-x-5 p-6 bg-white/70 rounded-2xl border border-gray-200/50 shadow-sm">
                  <div className="w-14 h-14 bg-slate-100 rounded-2xl flex items-center justify-center">
                    <Shield className="w-7 h-7 text-slate-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">Seguridad Avanzada</h3>
                    <p className="text-gray-600">Control de acceso y reconocimiento facial</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-5 p-6 bg-white/70 rounded-2xl border border-gray-200/50 shadow-sm">
                  <div className="w-14 h-14 bg-blue-100 rounded-2xl flex items-center justify-center">
                    <Home className="w-7 h-7 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">Gestión Integral</h3>
                    <p className="text-gray-600">Administración completa de propiedades</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-5 p-6 bg-white/70 rounded-2xl border border-gray-200/50 shadow-sm">
                  <div className="w-14 h-14 bg-indigo-100 rounded-2xl flex items-center justify-center">
                    <Users className="w-7 h-7 text-indigo-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">Comunidad Conectada</h3>
                    <p className="text-gray-600">Comunicación eficiente entre residentes</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side - Login Form */}
          <div className="w-full max-w-lg mx-auto lg:mx-0">
            {/* Mobile Header */}
            <div className="lg:hidden text-center mb-8">
              <div className="inline-flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-slate-700 to-slate-800 rounded-xl flex items-center justify-center">
                  <Building2 className="w-5 h-5 text-white" />
                </div>
                <h1 className="text-xl font-bold text-gray-900">Residencial Villa Esperanza</h1>
              </div>
            </div>

            {/* Login Card */}
            <Card className="shadow-2xl border-0 bg-white/90 backdrop-blur-sm">
              <CardContent className="p-10">
                <div className="text-center mb-10">
                  <h2 className="text-3xl font-bold text-gray-900 mb-3">Iniciar Sesión</h2>
                  <p className="text-lg text-gray-600">Accede a tu panel de gestión residencial</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-8">
                  <div className="space-y-3">
                    <Label htmlFor="email" className="text-base font-semibold text-gray-700">
                      Correo Electrónico
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="tu@email.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="h-14 text-lg bg-gray-50 border-gray-200 focus:border-slate-500 focus:ring-slate-500/20 transition-all duration-200"
                    />
                  </div>

                  <div className="space-y-3">
                    <Label htmlFor="password" className="text-base font-semibold text-gray-700">
                      Contraseña
                    </Label>
                    <div className="relative">
                      <Input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="Tu contraseña"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        className="h-14 text-lg bg-gray-50 border-gray-200 focus:border-slate-500 focus:ring-slate-500/20 transition-all duration-200 pr-14"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 p-0 hover:bg-gray-100"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? <EyeOff className="h-4 w-4 text-gray-400" /> : <Eye className="h-4 w-4 text-gray-400" />}
                      </Button>
                    </div>
                  </div>

                  {error && (
                    <Alert variant="destructive" className="border-red-200 bg-red-50">
                      <AlertDescription className="text-red-700">
                        {error === "Invalid email or password" ? "Correo o contraseña incorrectos" : 
                         error === "An error occurred during login" ? "Ocurrió un error durante el inicio de sesión" : error}
                      </AlertDescription>
                    </Alert>
                  )}

                  <Button
                    type="submit"
                    className="w-full h-14 text-lg bg-gradient-to-r from-slate-700 to-slate-800 hover:from-slate-800 hover:to-slate-900 text-white font-semibold transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                        Iniciando sesión...
                      </>
                    ) : (
                      "Iniciar Sesión"
                    )}
                  </Button>
                </form>

                {/* Divider */}
                <div className="relative my-8">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-200"></div>
                  </div>
                  <div className="relative flex justify-center text-base">
                    <span className="px-4 bg-white text-gray-500">¿Nuevo en la plataforma?</span>
                  </div>
                </div>

                {/* Registro Link */}
                <div className="text-center">
                  <Link href="/solicitud-registro">
                    <Button variant="outline" className="w-full h-14 text-lg border-slate-300 text-slate-700 hover:bg-slate-50 hover:border-slate-400 transition-all duration-200">
                      <UserPlus className="w-5 h-5 mr-2" />
                      Solicitar Registro como Propietario
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
