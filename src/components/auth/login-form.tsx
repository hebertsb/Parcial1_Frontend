"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Building2, Loader2 } from "lucide-react"
import { authService } from "@/lib/services"
import { useAuth } from "@/contexts/auth-context"

export function LoginForm() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const { login } = useAuth()
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    console.log('🔐 Iniciando login con:', { email, password: '***' })

    try {
      console.log('🚀 LoginForm: INICIANDO LOGIN PARA', email);
      console.log('🚀 LoginForm: Llamando a authService.login...')
      const response = await authService.login({ email, password })
      console.log('📡 LoginForm: Respuesta recibida del servidor:', response)
      
      if (response.success && response.data) {
        console.log('✅ LoginForm: Login exitoso, response.data:', response.data)
        console.log('🔍 LoginForm: Verificando si response.data.user existe:', response.data.user)
        console.log('🔍 LoginForm: Claves en response.data:', Object.keys(response.data))
        
        // Usar directamente el usuario que viene del AuthService
        if (response.data.user) {
          console.log('👤 LoginForm: Usuario del AuthService:', response.data.user)
          login(response.data.user)
          console.log('🚀 LoginForm: Redirigiendo a dashboard...')
          router.push("/dashboard")
        } else {
          // Fallback: leer desde localStorage si no viene el usuario
          const storedUser = localStorage.getItem('currentUser')
          console.log('🔍 LoginForm: Fallback - Usuario almacenado:', storedUser)
          
          if (storedUser) {
            const frontendUser = JSON.parse(storedUser)
            console.log('👤 LoginForm: Usuario frontal parseado:', frontendUser)
            login(frontendUser)
            console.log('🚀 LoginForm: Redirigiendo a dashboard...')
            router.push("/dashboard")
          } else {
            // Fallback si no hay usuario guardado
            const fallbackUser = {
              id: '1',
              email: email,
              name: 'Usuario',
              role: email.includes('admin') ? 'administrator' : 
                    email.includes('seguridad') ? 'security' :
                    email.includes('maria') ? 'owner' : 'tenant' as any,
            }
            login(fallbackUser)
            router.push("/dashboard")
          }
        }
      } else {
        console.log('❌ Login falló:', response)
        setError(response.message || "Invalid email or password")
      }
    } catch (err) {
      console.error('💥💥💥 ERROR DURANTE LOGIN:', err)
      console.error('💥💥💥 STACK TRACE:', err.stack)
      setError(`Error: ${err.message || 'An error occurred during login'}`)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background to-card p-4">
      <Card className="w-full max-w-md border-border/50 shadow-2xl">
        <CardHeader className="text-center space-y-4">
          <div className="mx-auto w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
            <Building2 className="w-6 h-6 text-primary" />
          </div>
          <div>
            <CardTitle className="text-2xl font-bold text-balance">CondoManager</CardTitle>
            <CardDescription className="text-muted-foreground">
              Sign in to your condominium management account
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="bg-input border-border"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="bg-input border-border"
              />
            </div>
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            <Button type="submit" className="w-full" disabled={isLoading}>
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
          <div className="mt-6 p-4 bg-muted/30 rounded-lg">
            <p className="text-sm text-muted-foreground mb-2">Demo Accounts:</p>
            <div className="space-y-1 text-xs">
              <p>
                <strong>Admin:</strong> admin@condomanager.com
              </p>
              <p>
                <strong>Security:</strong> security@condomanager.com
              </p>
              <p>
                <strong>Owner:</strong> owner@condomanager.com
              </p>
              <p>
                <strong>Tenant:</strong> tenant@condomanager.com
              </p>
              <p className="text-accent mt-2">
                <strong>Password:</strong> password123
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
