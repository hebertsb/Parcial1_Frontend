"use client"

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { AlertTriangle, Clock, MapPin, User, Eye } from 'lucide-react'

const incidentesEjemplo = [
  {
    id: 1,
    tipo: "Acceso no autorizado",
    descripcion: "Intento de acceso sin credenciales válidas en puerta principal",
    estado: "abierto",
    prioridad: "alta",
    ubicacion: "Entrada Principal",
    fecha: "2024-12-28 14:30",
    reportadoPor: "Sistema Automático"
  },
  {
    id: 2,
    tipo: "Reconocimiento fallido",
    descripcion: "Múltiples intentos de reconocimiento facial fallidos",
    estado: "investigando",
    prioridad: "media",
    ubicacion: "Torre A - Piso 3",
    fecha: "2024-12-28 13:15",
    reportadoPor: "Cámara IA"
  },
  {
    id: 3,
    tipo: "Visita sin autorización",
    descripcion: "Personal de limpieza sin código QR válido",
    estado: "resuelto",
    prioridad: "baja",
    ubicacion: "Torre B - Piso 1",
    fecha: "2024-12-28 10:45",
    reportadoPor: "Guardia de Seguridad"
  }
]

export default function IncidentesPage() {
  const getPrioridadColor = (prioridad: string) => {
    switch (prioridad) {
      case 'alta': return 'bg-red-500'
      case 'media': return 'bg-yellow-500'
      case 'baja': return 'bg-green-500'
      default: return 'bg-gray-500'
    }
  }

  const getEstadoColor = (estado: string) => {
    switch (estado) {
      case 'abierto': return 'bg-red-100 text-red-800 border-red-200'
      case 'investigando': return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'resuelto': return 'bg-green-100 text-green-800 border-green-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-white">Gestión de Incidentes</h1>
          <p className="text-gray-400 mt-2">Monitor y gestión de incidentes de seguridad</p>
        </div>
        <Button className="bg-emerald-600 hover:bg-emerald-700">
          <AlertTriangle className="h-4 w-4 mr-2" />
          Reportar Incidente
        </Button>
      </div>

      {/* Estadísticas rápidas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-300">Total Incidentes</CardTitle>
            <AlertTriangle className="h-4 w-4 text-gray-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">23</div>
            <p className="text-xs text-gray-400">Este mes</p>
          </CardContent>
        </Card>

        <Card className="bg-gray-800 border-gray-700">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-300">Abiertos</CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">5</div>
            <p className="text-xs text-gray-400">Requieren atención</p>
          </CardContent>
        </Card>

        <Card className="bg-gray-800 border-gray-700">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-300">En Investigación</CardTitle>
            <Eye className="h-4 w-4 text-yellow-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">8</div>
            <p className="text-xs text-gray-400">En proceso</p>
          </CardContent>
        </Card>

        <Card className="bg-gray-800 border-gray-700">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-300">Resueltos</CardTitle>
            <AlertTriangle className="h-4 w-4 text-green-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">10</div>
            <p className="text-xs text-gray-400">Este mes</p>
          </CardContent>
        </Card>
      </div>

      {/* Lista de incidentes */}
      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white">Incidentes Recientes</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {incidentesEjemplo.map((incidente) => (
              <div key={incidente.id} className="border border-gray-600 rounded-lg p-4 space-y-3">
                <div className="flex justify-between items-start">
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <div className={`w-3 h-3 rounded-full ${getPrioridadColor(incidente.prioridad)}`}></div>
                      <h3 className="font-semibold text-white">{incidente.tipo}</h3>
                      <Badge className={getEstadoColor(incidente.estado)}>
                        {incidente.estado}
                      </Badge>
                    </div>
                    <p className="text-gray-300">{incidente.descripcion}</p>
                  </div>
                  <Button variant="outline" size="sm">
                    Ver Detalles
                  </Button>
                </div>
                
                <div className="flex items-center space-x-4 text-sm text-gray-400">
                  <div className="flex items-center space-x-1">
                    <MapPin className="h-4 w-4" />
                    <span>{incidente.ubicacion}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Clock className="h-4 w-4" />
                    <span>{incidente.fecha}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <User className="h-4 w-4" />
                    <span>{incidente.reportadoPor}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}