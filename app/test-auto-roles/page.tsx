'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { authService } from '@/features/auth/services'
import { getDashboardRoute } from '@/lib/roleUtils'

export default function TestAutoRolePage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [result, setResult] = useState<any>(null)
  const [loading, setLoading] = useState(false)

  const testLogin = async () => {
    setLoading(true)
    setResult(null)
    
    try {
      console.log('🧪 Test: Probando login con:', { email, password })
      
      const response = await authService.login({ email, password })
      
      console.log('🧪 Test: Respuesta completa:', response)
      
      if (response.success && response.data?.user) {
        const user = response.data.user
        const dashboardRoute = getDashboardRoute(user.role)
        
        setResult({
          success: true,
          user: user,
          role: user.role,
          dashboardRoute: dashboardRoute,
          message: `Usuario autenticado correctamente como ${user.role}`
        })
        
        console.log('🧪 Test: Usuario autenticado:', user)
        console.log('🧪 Test: Ruta calculada:', dashboardRoute)
      } else {
        setResult({
          success: false,
          error: 'Login falló',
          response: response
        })
      }
    } catch (error) {
      console.error('🧪 Test: Error en login:', error)
      setResult({
        success: false,
        error: error.message || 'Error desconocido'
      })
    } finally {
      setLoading(false)
    }
  }

  const presetUsers = [
    { email: 'carlos.rodriguez@facial.com', password: 'inquilino123', expectedRole: 'inquilino' },
    { email: 'maria.gonzalez@facial.com', password: 'propietario123', expectedRole: 'propietario' },
    { email: 'admin@facial.com', password: 'admin123', expectedRole: 'administrator' },
    { email: 'seguridad@facial.com', password: 'seguridad123', expectedRole: 'security' }
  ]

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>🧪 Test de Roles Automáticos</CardTitle>
            <p className="text-sm text-gray-600">
              Prueba que cualquier usuario sea redirigido a su panel correspondiente según su rol en el backend
            </p>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Email:</label>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="ejemplo@facial.com"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Password:</label>
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="password"
              />
            </div>
            
            <Button 
              onClick={testLogin} 
              disabled={loading || !email || !password}
              className="w-full"
            >
              {loading ? 'Probando...' : 'Probar Login'}
            </Button>
          </CardContent>
        </Card>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle>👥 Usuarios de Prueba</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {presetUsers.map((user, index) => (
                <Card key={index} className="p-4">
                  <div className="space-y-2">
                    <p><strong>Email:</strong> {user.email}</p>
                    <p><strong>Password:</strong> {user.password}</p>
                    <p><strong>Rol esperado:</strong> <span className="text-blue-600">{user.expectedRole}</span></p>
                    <Button
                      size="sm"
                      onClick={() => {
                        setEmail(user.email)
                        setPassword(user.password)
                      }}
                      className="w-full"
                    >
                      Usar este usuario
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>

        {result && (
          <Card>
            <CardHeader>
              <CardTitle>📊 Resultado del Test</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {result.success ? (
                  <div className="text-green-600">
                    <p>✅ <strong>Login exitoso</strong></p>
                    <p><strong>Usuario ID:</strong> {result.user.id}</p>
                    <p><strong>Email:</strong> {result.user.email}</p>
                    <p><strong>Nombre:</strong> {result.user.name}</p>
                    <p><strong>Rol detectado:</strong> <span className="text-blue-600 font-bold">{result.user.role}</span></p>
                    <p><strong>Ruta de redirección:</strong> <span className="text-purple-600 font-bold">{result.dashboardRoute}</span></p>
                    <p><strong>Mensaje:</strong> {result.message}</p>
                  </div>
                ) : (
                  <div className="text-red-600">
                    <p>❌ <strong>Login falló</strong></p>
                    <p><strong>Error:</strong> {result.error}</p>
                    {result.response && (
                      <pre className="text-xs bg-gray-100 p-2 rounded mt-2">
                        {JSON.stringify(result.response, null, 2)}
                      </pre>
                    )}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )}
        
        <div className="mt-8 text-center">
          <p className="text-sm text-gray-500">
            💡 Abre la consola del navegador para ver logs detallados del proceso de autenticación
          </p>
        </div>
      </div>
    </div>
  )
}