'use client'

import { useEffect, useState } from 'react'
import { apiClient } from '@/core/api/client'

export default function TestEndpointsPage() {
  const [testResults, setTestResults] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    testEndpoints()
  }, [])

  const testEndpoints = async () => {
    const endpoints = [
      { name: 'Personas', url: '/personas/' },
      { name: 'Viviendas', url: '/viviendas/' },
      { name: 'Propietarios Menu', url: '/authz/propietarios/panel/menu/' },
      { name: 'Propietarios Familiares', url: '/authz/propietarios/panel/familiares/' },
      { name: 'Propietarios Inquilinos', url: '/authz/propietarios/panel/inquilinos/' },
    ]

    const results = []

    for (const endpoint of endpoints) {
      try {
        console.log(`🧪 Testing ${endpoint.name}: ${endpoint.url}`)
        const response = await apiClient.get(endpoint.url)
        
        results.push({
          name: endpoint.name,
          url: endpoint.url,
          status: response.success ? 'SUCCESS' : 'ERROR',
          data: response.data ? 'HAS_DATA' : 'NO_DATA',
          message: response.success ? 'OK' : 'Failed'
        })
      } catch (error: any) {
        results.push({
          name: endpoint.name,
          url: endpoint.url,
          status: 'ERROR',
          data: 'NO_DATA',
          message: error.message || 'Network error'
        })
      }
    }

    setTestResults(results)
    setLoading(false)
  }

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Prueba de Endpoints del Backend</h1>
        <p className="text-gray-400 mt-2">
          Verificando qué endpoints están disponibles en el backend
        </p>
      </div>

      {loading ? (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto mb-4"></div>
          <p className="text-gray-400">Probando endpoints...</p>
        </div>
      ) : (
        <div className="space-y-4">
          {testResults.map((result, index) => (
            <div 
              key={index}
              className={`p-4 rounded-lg border ${
                result.status === 'SUCCESS' 
                  ? 'bg-green-900/20 border-green-500' 
                  : 'bg-red-900/20 border-red-500'
              }`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium text-white">{result.name}</h3>
                  <p className="text-sm text-gray-400">{result.url}</p>
                </div>
                <div className="text-right">
                  <span className={`px-2 py-1 rounded text-xs font-medium ${
                    result.status === 'SUCCESS'
                      ? 'bg-green-600 text-white'
                      : 'bg-red-600 text-white'
                  }`}>
                    {result.status}
                  </span>
                  <p className="text-xs text-gray-400 mt-1">{result.data}</p>
                </div>
              </div>
              {result.message !== 'OK' && (
                <p className="text-sm text-red-400 mt-2">{result.message}</p>
              )}
            </div>
          ))}
        </div>
      )}

      <div className="bg-yellow-900/20 border border-yellow-500 rounded-lg p-4">
        <h3 className="font-medium text-yellow-400 mb-2">💡 Información:</h3>
        <ul className="text-sm text-gray-300 space-y-1">
          <li>• Si "Personas" falla con 404, el backend no implementó ese endpoint aún</li>
          <li>• Si "Viviendas" funciona, el backend está corriendo correctamente</li>
          <li>• Los endpoints de "Propietarios" requieren autenticación con rol de propietario</li>
        </ul>
      </div>

      <div className="bg-blue-900/20 border border-blue-500 rounded-lg p-4">
        <h3 className="font-medium text-blue-400 mb-2">🔧 Soluciones:</h3>
        <ul className="text-sm text-gray-300 space-y-1">
          <li>• <strong>Para administradores:</strong> Usar datos mock temporalmente en /admin/usuarios</li>
          <li>• <strong>Para propietarios:</strong> Usar el panel específico en /propietario/dashboard</li>
          <li>• <strong>Para inquilinos:</strong> Implementar vista limitada con datos del usuario logueado</li>
        </ul>
      </div>
    </div>
  )
}