"use client"

/**
 * Panel de testing para endpoints de reconocimiento facial
 * Basado en la guía de implementación del backend
 */

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { 
  Camera, CheckCircle, XCircle, Loader2, Users, BarChart3, Search
} from "lucide-react"
import reconocimientoSeguridadService from '@/features/seguridad/reconocimiento-service'

export default function TestReconocimientoFacialPage() {
  // Estados para testing
  const [loading, setLoading] = useState(false)
  const [results, setResults] = useState<any>({})
  const [imagenSeleccionada, setImagenSeleccionada] = useState<File | null>(null)
  const [imagenPreview, setImagenPreview] = useState<string | null>(null)

  const handleImagenSeleccionada = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      setImagenSeleccionada(file)
      setImagenPreview(URL.createObjectURL(file))
    }
  }

  const testEndpoint = async (endpointName: string, testFunction: () => Promise<any>) => {
    setLoading(true)
    try {
      console.log(`🧪 Testing ${endpointName}...`)
      const result = await testFunction()
      setResults(prev => ({
        ...prev,
        [endpointName]: {
          success: result.success,
          data: result.data,
          error: result.error,
          timestamp: new Date().toLocaleTimeString()
        }
      }))
    } catch (error) {
      setResults(prev => ({
        ...prev,
        [endpointName]: {
          success: false,
          error: error instanceof Error ? error.message : 'Error desconocido',
          timestamp: new Date().toLocaleTimeString()
        }
      }))
    } finally {
      setLoading(false)
    }
  }

  const testReconocimientoFacial = async () => {
    if (!imagenSeleccionada) {
      alert('Por favor selecciona una imagen primero')
      return
    }

    const base64 = await reconocimientoSeguridadService.convertirImagenABase64(imagenSeleccionada)
    return reconocimientoSeguridadService.procesarReconocimiento(base64)
  }

  const testUsuariosActivos = () => {
    return reconocimientoSeguridadService.obtenerUsuariosActivos()
  }

  const testBuscarUsuarios = () => {
    return reconocimientoSeguridadService.buscarUsuarios('jose')
  }

  const testEstadisticas = () => {
    return reconocimientoSeguridadService.obtenerEstadisticas()
  }

  const renderResult = (endpointName: string) => {
    const result = results[endpointName]
    if (!result) return null

    return (
      <div className="mt-4 p-4 border rounded-lg">
        <div className="flex items-center gap-2 mb-2">
          {result.success ? (
            <CheckCircle className="w-5 h-5 text-green-500" />
          ) : (
            <XCircle className="w-5 h-5 text-red-500" />
          )}
          <span className="font-medium">
            {result.success ? 'Éxito' : 'Error'}
          </span>
          <Badge variant="outline" className="text-xs">
            {result.timestamp}
          </Badge>
        </div>
        
        {result.error && (
          <Alert variant="destructive" className="mb-2">
            <AlertDescription>{result.error}</AlertDescription>
          </Alert>
        )}
        
        {result.data && (
          <pre className="bg-gray-100 p-3 rounded text-xs overflow-auto max-h-40">
            {JSON.stringify(result.data, null, 2)}
          </pre>
        )}
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-3xl font-bold text-white mb-2">
            Test Reconocimiento Facial - Sistema de Seguridad
          </h1>
          <p className="text-gray-400">
            Testing de endpoints según la guía de implementación del backend
          </p>
        </div>

        {/* Status del servidor */}
        <Card>
          <CardHeader>
            <CardTitle>Estado del Backend</CardTitle>
            <CardDescription>
              Verificando conexión con los endpoints de reconocimiento facial
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="flex items-center gap-2 p-3 border rounded">
                <div className="w-3 h-3 bg-yellow-500 rounded-full animate-pulse"></div>
                <span className="text-sm">Backend: 127.0.0.1:8000</span>
              </div>
              <div className="flex items-center gap-2 p-3 border rounded">
                <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                <span className="text-sm">Token: Disponible</span>
              </div>
              <div className="flex items-center gap-2 p-3 border rounded">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span className="text-sm">Usuario: Seguridad</span>
              </div>
              <div className="flex items-center gap-2 p-3 border rounded">
                <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                <span className="text-sm">Endpoints: 4</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Test de subida de imagen */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Camera className="w-5 h-5" />
              1. Test Reconocimiento Facial
            </CardTitle>
            <CardDescription>
              POST /api/seguridad/reconocimiento-facial/
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImagenSeleccionada}
                  className="mb-4"
                />
                {imagenPreview && (
                  <div className="mb-4">
                    <img 
                      src={imagenPreview} 
                      alt="Imagen seleccionada" 
                      className="max-w-64 max-h-64 object-cover rounded"
                    />
                  </div>
                )}
              </div>
              
              <Button 
                onClick={() => testEndpoint('reconocimiento', testReconocimientoFacial)}
                disabled={loading || !imagenSeleccionada}
                className="w-full"
              >
                {loading ? (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <Camera className="w-4 h-4 mr-2" />
                )}
                Procesar Reconocimiento Facial
              </Button>
            </div>
            {renderResult('reconocimiento')}
          </CardContent>
        </Card>

        {/* Test de usuarios activos */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="w-5 h-5" />
              2. Test Lista Usuarios Activos
            </CardTitle>
            <CardDescription>
              GET /api/seguridad/lista-usuarios-activos/
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button 
              onClick={() => testEndpoint('usuarios', testUsuariosActivos)}
              disabled={loading}
              className="w-full"
            >
              {loading ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <Users className="w-4 h-4 mr-2" />
              )}
              Obtener Usuarios con Reconocimiento Activo
            </Button>
            {renderResult('usuarios')}
          </CardContent>
        </Card>

        {/* Test de búsqueda */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Search className="w-5 h-5" />
              3. Test Búsqueda de Usuarios
            </CardTitle>
            <CardDescription>
              GET /api/seguridad/buscar-usuarios/?q=jose
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button 
              onClick={() => testEndpoint('busqueda', testBuscarUsuarios)}
              disabled={loading}
              className="w-full"
            >
              {loading ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <Search className="w-4 h-4 mr-2" />
              )}
              Buscar Usuarios (término: "jose")
            </Button>
            {renderResult('busqueda')}
          </CardContent>
        </Card>

        {/* Test de estadísticas */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5" />
              4. Test Estadísticas del Guardia
            </CardTitle>
            <CardDescription>
              GET /api/seguridad/estadisticas/
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button 
              onClick={() => testEndpoint('estadisticas', testEstadisticas)}
              disabled={loading}
              className="w-full"
            >
              {loading ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <BarChart3 className="w-4 h-4 mr-2" />
              )}
              Obtener Estadísticas del Sistema
            </Button>
            {renderResult('estadisticas')}
          </CardContent>
        </Card>

        {/* Resumen de resultados */}
        {Object.keys(results).length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Resumen de Tests</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {Object.entries(results).map(([name, result]: [string, any]) => (
                  <div key={name} className="flex items-center gap-2 p-3 border rounded">
                    {result.success ? (
                      <CheckCircle className="w-4 h-4 text-green-500" />
                    ) : (
                      <XCircle className="w-4 h-4 text-red-500" />
                    )}
                    <span className="text-sm capitalize">{name}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Instrucciones */}
        <Card>
          <CardHeader>
            <CardTitle>Instrucciones</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-gray-600 space-y-2">
            <p><strong>1. Reconocimiento Facial:</strong> Sube una foto de una persona registrada</p>
            <p><strong>2. Lista Usuarios:</strong> Verifica que retorne usuarios con reconocimiento activo</p>
            <p><strong>3. Búsqueda:</strong> Busca usuarios por nombre (ejemplo: "jose")</p>
            <p><strong>4. Estadísticas:</strong> Obtiene métricas del sistema de seguridad</p>
            <p className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded">
              <strong>Nota:</strong> Si algún endpoint falla, significa que necesita ser implementado en el backend según la guía.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}