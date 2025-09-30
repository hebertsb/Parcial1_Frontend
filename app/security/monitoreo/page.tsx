"use client"

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Eye, Camera, Wifi, AlertCircle, Activity, MapPin } from 'lucide-react'

const camarasEjemplo = [
  {
    id: 1,
    nombre: "Entrada Principal",
    ubicacion: "Lobby",
    estado: "activa",
    ultimaActividad: "2024-12-28 15:45",
    eventos: 15
  },
  {
    id: 2,
    nombre: "Torre A - Piso 3",
    ubicacion: "Pasillo Central",
    estado: "activa",
    ultimaActividad: "2024-12-28 15:30",
    eventos: 8
  },
  {
    id: 3,
    nombre: "Parking Subterráneo",
    ubicacion: "Sótano -1",
    estado: "mantenimiento",
    ultimaActividad: "2024-12-28 12:00",
    eventos: 0
  },
  {
    id: 4,
    nombre: "Torre B - Azotea",
    ubicacion: "Área de Servicios",
    estado: "activa",
    ultimaActividad: "2024-12-28 15:40",
    eventos: 3
  }
]

export default function MonitoreoPage() {
  const getEstadoColor = (estado: string) => {
    switch (estado) {
      case 'activa': return 'bg-green-100 text-green-800 border-green-200'
      case 'inactiva': return 'bg-red-100 text-red-800 border-red-200'
      case 'mantenimiento': return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-white">Centro de Monitoreo</h1>
          <p className="text-gray-400 mt-2">Supervisión en tiempo real del sistema de seguridad</p>
        </div>
        <Button className="bg-emerald-600 hover:bg-emerald-700">
          <Eye className="h-4 w-4 mr-2" />
          Vista General
        </Button>
      </div>

      {/* Estadísticas del sistema */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-300">Cámaras Activas</CardTitle>
            <Camera className="h-4 w-4 text-green-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">12</div>
            <p className="text-xs text-gray-400">de 15 total</p>
          </CardContent>
        </Card>

        <Card className="bg-gray-800 border-gray-700">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-300">Conexión</CardTitle>
            <Wifi className="h-4 w-4 text-blue-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">98%</div>
            <p className="text-xs text-gray-400">Estabilidad de red</p>
          </CardContent>
        </Card>

        <Card className="bg-gray-800 border-gray-700">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-300">Eventos Hoy</CardTitle>
            <Activity className="h-4 w-4 text-yellow-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">47</div>
            <p className="text-xs text-gray-400">Detecciones</p>
          </CardContent>
        </Card>

        <Card className="bg-gray-800 border-gray-700">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-300">Alertas</CardTitle>
            <AlertCircle className="h-4 w-4 text-red-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">2</div>
            <p className="text-xs text-gray-400">Requieren atención</p>
          </CardContent>
        </Card>
      </div>

      {/* Simulación de vista de cámaras */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white">Vista Principal - Entrada</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="aspect-video bg-gray-900 rounded-lg flex items-center justify-center border border-gray-600">
              <div className="text-center text-gray-400">
                <Camera className="h-12 w-12 mx-auto mb-2" />
                <p>Cámara en Vivo</p>
                <p className="text-sm">Entrada Principal</p>
                <div className="mt-2 flex items-center justify-center space-x-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-xs">ACTIVA</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white">Vista Secundaria - Parking</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="aspect-video bg-gray-900 rounded-lg flex items-center justify-center border border-gray-600">
              <div className="text-center text-gray-400">
                <Camera className="h-12 w-12 mx-auto mb-2" />
                <p>Cámara en Vivo</p>
                <p className="text-sm">Parking Subterráneo</p>
                <div className="mt-2 flex items-center justify-center space-x-2">
                  <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                  <span className="text-xs">MANTENIMIENTO</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Estado de las cámaras */}
      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white">Estado de Cámaras</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {camarasEjemplo.map((camara) => (
              <div key={camara.id} className="flex items-center justify-between p-4 border border-gray-600 rounded-lg">
                <div className="flex items-center space-x-4">
                  <Camera className="h-8 w-8 text-gray-400" />
                  <div>
                    <h3 className="font-semibold text-white">{camara.nombre}</h3>
                    <div className="flex items-center space-x-2 text-sm text-gray-400">
                      <MapPin className="h-4 w-4" />
                      <span>{camara.ubicacion}</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-4">
                  <div className="text-right">
                    <p className="text-sm text-gray-300">{camara.eventos} eventos</p>
                    <p className="text-xs text-gray-400">{camara.ultimaActividad}</p>
                  </div>
                  <Badge className={getEstadoColor(camara.estado)}>
                    {camara.estado}
                  </Badge>
                  <Button variant="outline" size="sm">
                    Ver
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}