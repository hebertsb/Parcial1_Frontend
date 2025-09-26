"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Building2, Loader2, Eye, EyeOff, Shield, Users, Home, Key, UserPlus } from "lucide-react"
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
  const { login } = useAuth()
  const router = useRouter()

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

  const demoAccounts = [
    { role: "Administrator", email: "admin@condomanager.com", icon: Shield, color: "text-red-500" },
    { role: "Security", email: "security@condomanager.com", icon: Key, color: "text-blue-500" },
    { role: "Owner", email: "owner@condomanager.com", icon: Home, color: "text-green-500" },
    { role: "Tenant", email: "tenant@condomanager.com", icon: Users, color: "text-purple-500" },
  ]

  return (
    <div className="min-h-screen flex">
      {/* Left Side - Hero Image */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
        <img
          src="/modern-luxury-condominium-building-exterior-with-g.jpg"
          alt="Modern Condominium"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900/80 via-purple-900/60 to-transparent" />
        <div className="relative z-10 flex flex-col justify-end p-12 text-white">
          <div className="space-y-4">
            <h1 className="text-4xl font-bold text-balance">Welcome to CondoManager</h1>
            <p className="text-xl text-blue-100 text-pretty">
              The most advanced condominium management platform designed for modern living communities.
            </p>
            <div className="flex items-center space-x-6 text-sm">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                <span>Real-time monitoring</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse" />
                <span>Secure payments</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse" />
                <span>Smart automation</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className="flex-1 flex items-center justify-center p-8 bg-gradient-to-br from-background via-background to-muted/20">
        <div className="w-full max-w-md space-y-8">
          {/* Logo and Header */}
          <div className="text-center space-y-4">
            <div className="mx-auto w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
              <Building2 className="w-8 h-8 text-white" />
            </div>
            <div>
              <h2 className="text-3xl font-bold text-balance">Sign In</h2>
              <p className="text-muted-foreground mt-2">Access your condominium management dashboard</p>
            </div>
          </div>

          {/* Login Form */}
          <Card className="border-border/50 shadow-xl bg-card/50 backdrop-blur-sm">
            <CardContent className="p-8">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-sm font-medium">
                    Email Address
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="h-12 bg-background/50 border-border/50 focus:border-primary/50 transition-colors"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password" className="text-sm font-medium">
                    Password
                  </Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter your password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      className="h-12 bg-background/50 border-border/50 focus:border-primary/50 transition-colors pr-12"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 p-0"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>

                {error && (
                  <Alert variant="destructive" className="border-destructive/50">
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}

                <Button
                  type="submit"
                  className="w-full h-12 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-medium transition-all duration-200 shadow-lg hover:shadow-xl"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Signing in...
                    </>
                  ) : (
                    "Sign In"
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Solicitar Registro */}
          <Card className="border-border/30 bg-muted/20 backdrop-blur-sm">
            <CardContent className="p-4 text-center">
              <p className="text-sm text-muted-foreground mb-3">
                ¿No tienes cuenta? ¿Eres propietario de una unidad?
              </p>
              <Link href="/solicitud-registro">
                <Button variant="outline" className="w-full">
                  <UserPlus className="w-4 h-4 mr-2" />
                  Solicitar Registro como Propietario
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* Demo Accounts */}
          <Card className="border-border/30 bg-muted/20 backdrop-blur-sm">
            <CardContent className="p-6">
              <h3 className="font-semibold mb-4 text-center">Demo Accounts</h3>
              <div className="grid grid-cols-2 gap-3">
                {demoAccounts.map((account) => (
                  <Button
                    key={account.role}
                    variant="ghost"
                    className="h-auto p-3 flex flex-col items-center space-y-2 hover:bg-background/50 transition-colors"
                    onClick={() => {
                      setEmail(account.email)
                      setPassword("password123")
                    }}
                  >
                    <account.icon className={`w-5 h-5 ${account.color}`} />
                    <div className="text-center">
                      <div className="font-medium text-xs">{account.role}</div>
                      <div className="text-xs text-muted-foreground truncate max-w-20">
                        {account.email.split("@")[0]}
                      </div>
                    </div>
                  </Button>
                ))}
              </div>
              <p className="text-xs text-center text-muted-foreground mt-4">
                Password: <span className="font-mono">password123</span>
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
