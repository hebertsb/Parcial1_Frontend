"use client"

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Activity, Calendar, User, MapPin, Clock, Search, Download } from 'lucide-react'

const actividadEjemplo = [
  {
    id: 1,
    tipo: "reconocimiento_facial",
    usuario: "Carlos Mendoza",
    accion: "Acceso autorizado",
    ubicacion: "Entrada Principal",
    timestamp: "2024-12-28 15:45:22",
    estado: "exitoso",
    detalles: "Reconocimiento facial exitoso - Confianza: 98%"
  },
  {
    id: 2,
    tipo: "acceso_qr",
    usuario: "María Rodríguez",
    accion: "Escaneo QR",
    ubicacion: "Torre B - Entrance",
    timestamp: "2024-12-28 15:30:15",
    estado: "exitoso",
    detalles: "Código QR válido - Personal de limpieza autorizado"
  },
  {
    id: 3,
    tipo: "intento_acceso",
    usuario: "Desconocido",
    accion: "Intento fallido",
    ubicacion: "Entrada Principal",
    timestamp: "2024-12-28 15:15:33",
    estado: "fallido",
    detalles: "No se pudo identificar - Sin registro en base de datos"
  },
  {
    id: 4,
    tipo: "reconocimiento_facial",
    usuario: "Ana García",
    accion: "Acceso autorizado",
    ubicacion: "Parking Subterráneo",
    timestamp: "2024-12-28 14:50:08",
    estado: "exitoso",
    detalles: "Acceso vehicular autorizado - Confianza: 95%"
  },
  {
    id: 5,
    tipo: "visita_programada",
    usuario: "Luis Morales - Técnico Gas",
    accion: "Entrada autorizada",
    ubicacion: "Torre A - Piso 3",
    timestamp: "2024-12-28 14:20:45",
    estado: "exitoso",
    detalles: "Visita técnica programada - Código: VT-2024-001"
  }
]

export default function ActividadPage() {
  const getTipoIcon = (tipo: string) => {
    switch (tipo) {
      case 'reconocimiento_facial': return '🎭'
      case 'acceso_qr': return '📱'
      case 'intento_acceso': return '🚪'
      case 'visita_programada': return '👥'
      default: return '📋'
    }
  }

  const getEstadoColor = (estado: string) => {
    switch (estado) {
      case 'exitoso': return 'bg-green-100 text-green-800 border-green-200'
      case 'fallido': return 'bg-red-100 text-red-800 border-red-200'
      case 'pendiente': return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-white">Registro de Actividad</h1>
          <p className="text-gray-400 mt-2">Historial completo de eventos del sistema de seguridad</p>
        </div>
        <Button className="bg-emerald-600 hover:bg-emerald-700">
          <Download className="h-4 w-4 mr-2" />
          Exportar Reporte
        </Button>
      </div>

      {/* Estadísticas de actividad */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-300">Eventos Hoy</CardTitle>
            <Activity className="h-4 w-4 text-gray-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">142</div>
            <p className="text-xs text-gray-400">+12% vs ayer</p>
          </CardContent>
        </Card>

        <Card className="bg-gray-800 border-gray-700">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-300">Accesos Exitosos</CardTitle>
            <Activity className="h-4 w-4 text-green-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">128</div>
            <p className="text-xs text-gray-400">90% tasa de éxito</p>
          </CardContent>
        </Card>

        <Card className="bg-gray-800 border-gray-700">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-300">Intentos Fallidos</CardTitle>
            <Activity className="h-4 w-4 text-red-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">14</div>
            <p className="text-xs text-gray-400">10% del total</p>
          </CardContent>
        </Card>

        <Card className="bg-gray-800 border-gray-700">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-300">Usuarios Únicos</CardTitle>
            <User className="h-4 w-4 text-blue-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">47</div>
            <p className="text-xs text-gray-400">Personas diferentes</p>
          </CardContent>
        </Card>
      </div>

      {/* Filtros */}
      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white">Filtros de Búsqueda</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input 
                placeholder="Buscar usuario..." 
                className="pl-10 bg-gray-700 border-gray-600 text-white placeholder-gray-400"
              />
            </div>
            <Button variant="outline" className="border-gray-600 text-gray-300 hover:bg-gray-700">
              <Calendar className="h-4 w-4 mr-2" />
              Fecha
            </Button>
            <Button variant="outline" className="border-gray-600 text-gray-300 hover:bg-gray-700">
              Tipo de Evento
            </Button>
            <Button variant="outline" className="border-gray-600 text-gray-300 hover:bg-gray-700">
              Estado
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Timeline de actividades */}
      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white">Actividad Reciente</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {actividadEjemplo.map((evento, index) => (
              <div key={evento.id} className="relative">
                {/* Línea del timeline */}
                {index < actividadEjemplo.length - 1 && (
                  <div className="absolute left-6 top-12 w-0.5 h-16 bg-gray-600"></div>
                )}
                
                <div className="flex items-start space-x-4">
                  {/* Icono del evento */}
                  <div className="flex-shrink-0 w-12 h-12 bg-gray-700 rounded-full flex items-center justify-center text-lg">
                    {getTipoIcon(evento.tipo)}
                  </div>
                  
                  <div className="flex-1 border border-gray-600 rounded-lg p-4">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 className="font-semibold text-white">{evento.accion}</h3>
                        <p className="text-sm text-gray-300">{evento.usuario}</p>
                      </div>
                      <Badge className={getEstadoColor(evento.estado)}>
                        {evento.estado}
                      </Badge>
                    </div>
                    
                    <p className="text-sm text-gray-400 mb-3">{evento.detalles}</p>
                    
                    <div className="flex items-center space-x-4 text-xs text-gray-500">
                      <div className="flex items-center space-x-1">
                        <Clock className="h-3 w-3" />
                        <span>{evento.timestamp}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <MapPin className="h-3 w-3" />
                        <span>{evento.ubicacion}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          {/* Botón para cargar más */}
          <div className="text-center mt-6">
            <Button variant="outline" className="border-gray-600 text-gray-300 hover:bg-gray-700">
              Cargar más eventos
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}