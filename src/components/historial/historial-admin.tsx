"use client"

import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import {
  Clock, User, Activity, Eye, Search, Filter, Calendar,
  MessageSquare, Settings, UserCheck, Building, Shield,
  AlertTriangle, CheckCircle2, Edit, Trash2, Plus
} from 'lucide-react'

interface ActividadHistorial {
  id: number
  usuario: string
  accion: string
  modulo: 'usuarios' | 'finanzas' | 'unidades' | 'seguridad' | 'comunicados' | 'reservas' | 'mantenimiento' | 'sistema'
  descripcion: string
  fechaHora: string
  direccionIP: string
  dispositivo: string
  resultado: 'exitoso' | 'fallido' | 'pendiente'
  detalles?: string
}

const actividadesMock: ActividadHistorial[] = [
  {
    id: 1,
    usuario: "María González - Admin",
    accion: "Crear Usuario",
    modulo: "usuarios",
    descripcion: "Se creó nuevo usuario: Carlos Rodríguez - Propietario Unidad B-205",
    fechaHora: "2024-01-15 14:30:22",
    direccionIP: "192.168.1.105",
    dispositivo: "Windows PC - Chrome",
    resultado: "exitoso"
  },
  {
    id: 2,
    usuario: "Sistema Automático",
    accion: "Generar Reporte",
    modulo: "finanzas",
    descripcion: "Reporte financiero mensual generado automáticamente",
    fechaHora: "2024-01-15 00:00:01",
    direccionIP: "127.0.0.1",
    dispositivo: "Servidor",
    resultado: "exitoso"
  },
  {
    id: 3,
    usuario: "Roberto Silva - Seguridad",
    accion: "Registrar Incidente",
    modulo: "seguridad",
    descripcion: "Registro de intento de acceso no autorizado en Entrada Principal",
    fechaHora: "2024-01-14 22:45:18",
    direccionIP: "192.168.1.89",
    dispositivo: "Android - Mobile App",
    resultado: "exitoso"
  },
  {
    id: 4,
    usuario: "Ana López - Admin",
    accion: "Aprobar Reserva",
    modulo: "reservas",
    descripcion: "Aprobada reserva del Salón de Eventos para María Gonzalez - A-301",
    fechaHora: "2024-01-14 16:20:45",
    direccionIP: "192.168.1.102",
    dispositivo: "MacOS - Safari",
    resultado: "exitoso"
  },
  {
    id: 5,
    usuario: "Carlos Mamani - Mantenimiento",
    accion: "Completar Solicitud",
    modulo: "mantenimiento",
    descripcion: "Solicitud de reparación de luminaria Torre A completada",
    fechaHora: "2024-01-14 11:15:30",
    direccionIP: "192.168.1.67",
    dispositivo: "Android - Mobile App",
    resultado: "exitoso"
  },
  {
    id: 6,
    usuario: "Sistema",
    accion: "Backup Automático",
    modulo: "sistema",
    descripcion: "Backup automático de la base de datos ejecutado",
    fechaHora: "2024-01-14 03:00:00",
    direccionIP: "127.0.0.1",
    dispositivo: "Servidor",
    resultado: "exitoso"
  },
  {
    id: 7,
    usuario: "María González - Admin",
    accion: "Publicar Comunicado",
    modulo: "comunicados",
    descripcion: "Publicado comunicado: Mantenimiento preventivo de ascensores",
    fechaHora: "2024-01-13 09:30:15",
    direccionIP: "192.168.1.105",
    dispositivo: "Windows PC - Chrome",
    resultado: "exitoso"
  },
  {
    id: 8,
    usuario: "Usuario Desconocido",
    accion: "Intento de Login",
    modulo: "sistema",
    descripcion: "Intento fallido de acceso con credenciales incorrectas",
    fechaHora: "2024-01-13 02:15:45",
    direccionIP: "203.45.67.89",
    dispositivo: "Unknown Browser",
    resultado: "fallido",
    detalles: "Múltiples intentos detectados - IP bloqueada"
  }
]

export function HistorialAdmin() {
  const [filtroModulo, setFiltroModulo] = useState<string>('todos')
  const [filtroResultado, setFiltroResultado] = useState<string>('todos')
  const [searchTerm, setSearchTerm] = useState('')
  const [filtroFecha, setFiltroFecha] = useState<string>('todos')

  const actividadesFiltradas = actividadesMock.filter(actividad => {
    const matchesSearch = actividad.usuario.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         actividad.descripcion.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         actividad.accion.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesModulo = filtroModulo === 'todos' || actividad.modulo === filtroModulo
    const matchesResultado = filtroResultado === 'todos' || actividad.resultado === filtroResultado
    return matchesSearch && matchesModulo && matchesResultado
  })

  const getModuloColor = (modulo: string) => {
    const colors = {
      usuarios: 'bg-blue-500',
      finanzas: 'bg-green-500',
      unidades: 'bg-purple-500',
      seguridad: 'bg-red-500',
      comunicados: 'bg-yellow-500',
      reservas: 'bg-indigo-500',
      mantenimiento: 'bg-orange-500',
      sistema: 'bg-gray-500'
    }
    return colors[modulo as keyof typeof colors] || 'bg-gray-500'
  }

  const getResultadoColor = (resultado: string) => {
    const colors = {
      exitoso: 'bg-green-500',
      fallido: 'bg-red-500',
      pendiente: 'bg-yellow-500'
    }
    return colors[resultado as keyof typeof colors] || 'bg-gray-500'
  }

  const getModuloIcon = (modulo: string) => {
    const icons = {
      usuarios: User,
      finanzas: CheckCircle2,
      unidades: Building,
      seguridad: Shield,
      comunicados: MessageSquare,
      reservas: Calendar,
      mantenimiento: Settings,
      sistema: Activity
    }
    const Icon = icons[modulo as keyof typeof icons] || Activity
    return Icon
  }

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Historial de Actividades</h1>
          <p className="text-gray-400 mt-1">Registro completo de todas las acciones del sistema</p>
        </div>
        <Button className="bg-blue-600 hover:bg-blue-700">
          <Eye className="h-4 w-4 mr-2" />
          Exportar Historial
        </Button>
      </div>

      {/* Estadísticas Rápidas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="bg-gray-800 border-gray-700">
          <CardContent className="p-6">
            <div className="flex items-center">
              <Activity className="h-8 w-8 text-blue-400 mr-3" />
              <div>
                <p className="text-sm font-medium text-gray-400">Actividades Hoy</p>
                <p className="text-2xl font-bold text-white">23</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-800 border-gray-700">
          <CardContent className="p-6">
            <div className="flex items-center">
              <CheckCircle2 className="h-8 w-8 text-green-400 mr-3" />
              <div>
                <p className="text-sm font-medium text-gray-400">Exitosas</p>
                <p className="text-2xl font-bold text-white">21</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-800 border-gray-700">
          <CardContent className="p-6">
            <div className="flex items-center">
              <AlertTriangle className="h-8 w-8 text-red-400 mr-3" />
              <div>
                <p className="text-sm font-medium text-gray-400">Fallidas</p>
                <p className="text-2xl font-bold text-white">2</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-800 border-gray-700">
          <CardContent className="p-6">
            <div className="flex items-center">
              <User className="h-8 w-8 text-purple-400 mr-3" />
              <div>
                <p className="text-sm font-medium text-gray-400">Usuarios Activos</p>
                <p className="text-2xl font-bold text-white">7</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Controles de búsqueda */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Buscar actividades..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-gray-800 border-gray-700 text-white placeholder-gray-400"
            />
          </div>
          <select
            value={filtroModulo}
            onChange={(e) => setFiltroModulo(e.target.value)}
            className="bg-gray-800 border-gray-700 text-white rounded-md px-3 py-2"
          >
            <option value="todos">Todos los módulos</option>
            <option value="usuarios">Usuarios</option>
            <option value="finanzas">Finanzas</option>
            <option value="unidades">Unidades</option>
            <option value="seguridad">Seguridad</option>
            <option value="comunicados">Comunicados</option>
            <option value="reservas">Reservas</option>
            <option value="mantenimiento">Mantenimiento</option>
            <option value="sistema">Sistema</option>
          </select>
          <select
            value={filtroResultado}
            onChange={(e) => setFiltroResultado(e.target.value)}
            className="bg-gray-800 border-gray-700 text-white rounded-md px-3 py-2"
          >
            <option value="todos">Todos los resultados</option>
            <option value="exitoso">Exitosas</option>
            <option value="fallido">Fallidas</option>
            <option value="pendiente">Pendientes</option>
          </select>
        </div>
      </div>

      {/* Lista de Actividades */}
      <div className="space-y-4">
        {actividadesFiltradas.map((actividad) => {
          const ModuloIcon = getModuloIcon(actividad.modulo)
          return (
            <Card key={actividad.id} className="bg-gray-800 border-gray-700">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-4">
                    <div className={`p-2 ${getModuloColor(actividad.modulo)}/20 rounded-lg`}>
                      <ModuloIcon className={`h-6 w-6 text-white`} />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="text-lg font-semibold text-white">{actividad.accion}</h3>
                        <Badge className={`${getModuloColor(actividad.modulo)} text-white`}>
                          {actividad.modulo}
                        </Badge>
                        <Badge className={`${getResultadoColor(actividad.resultado)} text-white`}>
                          {actividad.resultado}
                        </Badge>
                      </div>
                      
                      <p className="text-gray-300 mb-3">{actividad.descripcion}</p>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-400">
                        <div className="space-y-1">
                          <div className="flex items-center space-x-2">
                            <User className="h-4 w-4" />
                            <span>{actividad.usuario}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Clock className="h-4 w-4" />
                            <span>{actividad.fechaHora}</span>
                          </div>
                        </div>
                        <div className="space-y-1">
                          <div className="flex items-center space-x-2">
                            <span>📍</span>
                            <span>{actividad.direccionIP}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <span>💻</span>
                            <span>{actividad.dispositivo}</span>
                          </div>
                        </div>
                      </div>
                      
                      {actividad.detalles && (
                        <div className="mt-3 p-3 bg-gray-700 rounded-md">
                          <p className="text-sm text-gray-300">
                            <strong>Detalles:</strong> {actividad.detalles}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm" className="border-gray-600 text-gray-300 hover:bg-gray-700">
                      <Eye className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}