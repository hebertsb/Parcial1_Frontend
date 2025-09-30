"use client"

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import {
  ArrowLeft, Wrench, AlertTriangle, CheckCircle2, Clock, 
  Calendar, User, MapPin, DollarSign, Plus, Search,
  Filter, Settings, Building, Phone, Mail
} from 'lucide-react'

interface SolicitudMantenimiento {
  id: number
  titulo: string
  descripcion: string
  ubicacion: string
  solicitante: string
  unidad: string
  telefono: string
  email: string
  fechaSolicitud: string
  fechaProgramada?: string
  estado: 'pendiente' | 'programado' | 'en_proceso' | 'completado' | 'cancelado'
  prioridad: 'baja' | 'media' | 'alta' | 'urgente'
  categoria: 'electricidad' | 'plomeria' | 'jardineria' | 'limpieza' | 'seguridad' | 'otros'
  costoEstimado: number
  tecnicoAsignado?: string
  observaciones?: string
}

interface TecnicoMantenimiento {
  id: number
  nombre: string
  especialidad: string
  telefono: string
  email: string
  activo: boolean
  trabajosCompletados: number
  calificacion: number
}

const solicitudesMock: SolicitudMantenimiento[] = [
  {
    id: 1,
    titulo: "Reparación de luminaria en pasillo",
    descripcion: "Las luces del pasillo del 3er piso Torre A no funcionan desde hace 2 días",
    ubicacion: "Torre A - Piso 3 - Pasillo principal",
    solicitante: "María García",
    unidad: "A-301",
    telefono: "591-70123456",
    email: "maria.garcia@email.com",
    fechaSolicitud: "2024-01-15",
    fechaProgramada: "2024-01-17",
    estado: "programado",
    prioridad: "alta",
    categoria: "electricidad",
    costoEstimado: 150,
    tecnicoAsignado: "Juan Pérez - Electricista"
  },
  {
    id: 2,
    titulo: "Fuga de agua en área común",
    descripcion: "Hay una pequeña fuga en la tubería principal del sótano",
    ubicacion: "Sótano - Área de medidores",
    solicitante: "Administración",
    unidad: "N/A",
    telefono: "591-78987654",
    email: "admin@villaeperanza.com",
    fechaSolicitud: "2024-01-14",
    estado: "en_proceso",
    prioridad: "urgente",
    categoria: "plomeria",
    costoEstimado: 300,
    tecnicoAsignado: "Carlos Mamani - Plomero"
  },
  {
    id: 3,
    titulo: "Mantenimiento de jardines",
    descripcion: "Poda de árboles y mantenimiento general de áreas verdes",
    ubicacion: "Áreas verdes - Entrada principal",
    solicitante: "Consejo Administrativo",
    unidad: "N/A",
    telefono: "591-65432109",
    email: "consejo@villaeperanza.com",
    fechaSolicitud: "2024-01-10",
    fechaProgramada: "2024-01-20",
    estado: "programado",
    prioridad: "media",
    categoria: "jardineria",
    costoEstimado: 500,
    tecnicoAsignado: "Roberto Silva - Jardinero"
  },
  {
    id: 4,
    titulo: "Limpieza profunda del salón comunal",
    descripcion: "Limpieza después del evento del fin de semana",
    ubicacion: "Torre A - Planta Baja - Salón Comunal",
    solicitante: "Ana López",  
    unidad: "A-102",
    telefono: "591-69876543",
    email: "ana.lopez@email.com",
    fechaSolicitud: "2024-01-12",
    estado: "completado",
    prioridad: "baja",
    categoria: "limpieza",
    costoEstimado: 80,
    tecnicoAsignado: "Personal de Limpieza"
  }
]

const tecnicosMock: TecnicoMantenimiento[] = [
  {
    id: 1,
    nombre: "Juan Pérez",
    especialidad: "Electricista",
    telefono: "591-70111222",
    email: "juan.perez@mantenimiento.com",
    activo: true,
    trabajosCompletados: 45,
    calificacion: 4.8
  },
  {
    id: 2,
    nombre: "Carlos Mamani", 
    especialidad: "Plomero",
    telefono: "591-70333444",
    email: "carlos.mamani@mantenimiento.com",
    activo: true,
    trabajosCompletados: 38,
    calificacion: 4.6
  },
  {
    id: 3,
    nombre: "Roberto Silva",
    especialidad: "Jardinero",
    telefono: "591-70555666",
    email: "roberto.silva@mantenimiento.com", 
    activo: true,
    trabajosCompletados: 25,
    calificacion: 4.9
  }
]

export function MantenimientoEspaciosComunes() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState<'solicitudes' | 'tecnicos' | 'programacion'>('solicitudes')
  const [searchTerm, setSearchTerm] = useState('')
  const [filtroEstado, setFiltroEstado] = useState<string>('todos')
  const [filtroPrioridad, setFiltroPrioridad] = useState<string>('todos')

  const handleVolver = () => {
    router.back()
  }

  const getEstadoColor = (estado: string) => {
    const colors = {
      pendiente: 'bg-yellow-500',
      programado: 'bg-blue-500', 
      en_proceso: 'bg-orange-500',
      completado: 'bg-green-500',
      cancelado: 'bg-red-500'
    }
    return colors[estado as keyof typeof colors] || 'bg-gray-500'
  }

  const getPrioridadColor = (prioridad: string) => {
    const colors = {
      baja: 'bg-green-500',
      media: 'bg-yellow-500',
      alta: 'bg-orange-500', 
      urgente: 'bg-red-500'
    }
    return colors[prioridad as keyof typeof colors] || 'bg-gray-500'
  }

  const getCategoriaIcon = (categoria: string) => {
    const icons = {
      electricidad: '⚡',
      plomeria: '🔧', 
      jardineria: '🌱',
      limpieza: '🧽',
      seguridad: '🔒',
      otros: '🔨'
    }
    return icons[categoria as keyof typeof icons] || '🔨'
  }

  const solicitudesFiltradas = solicitudesMock.filter(solicitud => {
    const matchesSearch = solicitud.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         solicitud.ubicacion.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesEstado = filtroEstado === 'todos' || solicitud.estado === filtroEstado  
    const matchesPrioridad = filtroPrioridad === 'todos' || solicitud.prioridad === filtroPrioridad
    return matchesSearch && matchesEstado && matchesPrioridad
  })

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Header */}
      <div className="bg-gray-800 border-b border-gray-700 p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button
              onClick={handleVolver}
              variant="ghost" 
              size="sm"
              className="text-gray-300 hover:text-white hover:bg-gray-700"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Volver
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-white">Mantenimiento de Espacios Comunes</h1>
              <p className="text-gray-400 mt-1">Gestión de solicitudes y mantenimiento preventivo</p>
            </div>
          </div>
          <Button className="bg-blue-600 hover:bg-blue-700">
            <Plus className="h-4 w-4 mr-2" />
            Nueva Solicitud
          </Button>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* Estadísticas Rápidas */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="bg-gray-800 border-gray-700">
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-2 bg-yellow-500/20 rounded-lg">
                  <Clock className="h-6 w-6 text-yellow-400" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-400">Solicitudes Pendientes</p>
                  <p className="text-2xl font-bold text-white">5</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-800 border-gray-700">
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-2 bg-blue-500/20 rounded-lg">
                  <Settings className="h-6 w-6 text-blue-400" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-400">En Proceso</p>
                  <p className="text-2xl font-bold text-white">3</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-800 border-gray-700">
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-2 bg-green-500/20 rounded-lg">
                  <CheckCircle2 className="h-6 w-6 text-green-400" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-400">Completados Este Mes</p>
                  <p className="text-2xl font-bold text-white">12</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-800 border-gray-700">
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-2 bg-purple-500/20 rounded-lg">
                  <DollarSign className="h-6 w-6 text-purple-400" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-400">Costos Este Mes</p>
                  <p className="text-2xl font-bold text-white">Bs 3,200</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <div className="flex items-center justify-between">
          <div className="flex space-x-1 bg-gray-800 p-1 rounded-lg">
            <button
              onClick={() => setActiveTab('solicitudes')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                activeTab === 'solicitudes'
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-300 hover:text-white hover:bg-gray-700'
              }`}
            >
              Solicitudes
            </button>
            <button
              onClick={() => setActiveTab('tecnicos')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                activeTab === 'tecnicos'
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-300 hover:text-white hover:bg-gray-700'
              }`}
            >
              Técnicos
            </button>
            <button
              onClick={() => setActiveTab('programacion')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                activeTab === 'programacion'
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-300 hover:text-white hover:bg-gray-700'
              }`}
            >
              Programación
            </button>
          </div>

          {activeTab === 'solicitudes' && (
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Buscar solicitudes..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-gray-800 border-gray-700 text-white placeholder-gray-400"
                />
              </div>
              <select
                value={filtroEstado}
                onChange={(e) => setFiltroEstado(e.target.value)}
                className="bg-gray-800 border-gray-700 text-white rounded-md px-3 py-2"
              >
                <option value="todos">Todos los estados</option>
                <option value="pendiente">Pendientes</option>
                <option value="programado">Programadas</option>
                <option value="en_proceso">En proceso</option>
                <option value="completado">Completadas</option>
                <option value="cancelado">Canceladas</option>
              </select>
              <select
                value={filtroPrioridad}
                onChange={(e) => setFiltroPrioridad(e.target.value)}
                className="bg-gray-800 border-gray-700 text-white rounded-md px-3 py-2"
              >
                <option value="todos">Todas las prioridades</option>
                <option value="urgente">Urgente</option>
                <option value="alta">Alta</option>
                <option value="media">Media</option>
                <option value="baja">Baja</option>
              </select>
            </div>
          )}
        </div>

        {/* Contenido Principal */}
        {activeTab === 'solicitudes' && (
          <div className="space-y-4">
            {solicitudesFiltradas.map((solicitud) => (
              <Card key={solicitud.id} className="bg-gray-800 border-gray-700">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-3">
                      <div className="text-2xl">{getCategoriaIcon(solicitud.categoria)}</div>
                      <div>
                        <CardTitle className="text-lg text-white">{solicitud.titulo}</CardTitle>
                        <div className="flex items-center space-x-4 mt-2">
                          <Badge className={`${getEstadoColor(solicitud.estado)} text-white`}>
                            {solicitud.estado.replace('_', ' ')}
                          </Badge>
                          <Badge className={`${getPrioridadColor(solicitud.prioridad)} text-white`}>
                            {solicitud.prioridad}
                          </Badge>
                          <span className="text-sm text-gray-400">
                            {solicitud.fechaSolicitud}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-white">Bs {solicitud.costoEstimado}</p>
                      <p className="text-sm text-gray-400">Costo estimado</p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-300 mb-4">{solicitud.descripcion}</p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <MapPin className="h-4 w-4 text-gray-400" />
                        <span className="text-sm text-gray-300">{solicitud.ubicacion}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <User className="h-4 w-4 text-gray-400" />
                        <span className="text-sm text-gray-300">{solicitud.solicitante} - {solicitud.unidad}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Phone className="h-4 w-4 text-gray-400" />
                        <span className="text-sm text-gray-300">{solicitud.telefono}</span>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <Mail className="h-4 w-4 text-gray-400" />
                        <span className="text-sm text-gray-300">{solicitud.email}</span>
                      </div>
                      {solicitud.tecnicoAsignado && (
                        <div className="flex items-center space-x-2">
                          <Wrench className="h-4 w-4 text-gray-400" />
                          <span className="text-sm text-gray-300">{solicitud.tecnicoAsignado}</span>
                        </div>
                      )}
                      {solicitud.fechaProgramada && (
                        <div className="flex items-center space-x-2">
                          <Calendar className="h-4 w-4 text-gray-400" />
                          <span className="text-sm text-gray-300">Programada: {solicitud.fechaProgramada}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex justify-end space-x-2">
                    <Button variant="outline" size="sm" className="border-gray-600 text-gray-300 hover:bg-gray-700">
                      Ver Detalles
                    </Button>
                    {solicitud.estado === 'pendiente' && (
                      <>
                        <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                          Programar
                        </Button>
                        <Button size="sm" className="bg-green-600 hover:bg-green-700">
                          Asignar Técnico
                        </Button>
                      </>
                    )}
                    {solicitud.estado === 'en_proceso' && (
                      <Button size="sm" className="bg-green-600 hover:bg-green-700">
                        Marcar Completado
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {activeTab === 'tecnicos' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {tecnicosMock.map((tecnico) => (
              <Card key={tecnico.id} className="bg-gray-800 border-gray-700">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-lg text-white">{tecnico.nombre}</CardTitle>
                      <p className="text-gray-400">{tecnico.especialidad}</p>
                    </div>
                    <Badge className={tecnico.activo ? 'bg-green-500' : 'bg-red-500'}>
                      {tecnico.activo ? 'Activo' : 'Inactivo'}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-2">
                      <Phone className="h-4 w-4 text-gray-400" />
                      <span className="text-sm text-gray-300">{tecnico.telefono}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Mail className="h-4 w-4 text-gray-400" />
                      <span className="text-sm text-gray-300">{tecnico.email}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-400">Trabajos completados:</span>
                      <span className="text-sm font-semibold text-white">{tecnico.trabajosCompletados}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-400">Calificación:</span>
                      <div className="flex items-center space-x-1">
                        <span className="text-sm font-semibold text-white">{tecnico.calificacion}</span>
                        <span className="text-yellow-400">⭐</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex justify-end space-x-2 mt-4">
                    <Button variant="outline" size="sm" className="border-gray-600 text-gray-300 hover:bg-gray-700">
                      Ver Historial
                    </Button>
                    <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                      Asignar Trabajo
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {activeTab === 'programacion' && (
          <div className="space-y-6">
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white">Calendario de Mantenimiento</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-7 gap-4">
                  {/* Aquí iría un calendario visual */}
                  <div className="col-span-full text-center py-8">
                    <Calendar className="h-12 w-12 text-gray-500 mx-auto mb-4" />
                    <p className="text-gray-400">Vista de calendario en desarrollo</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white">Trabajos Programados</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {solicitudesMock
                    .filter(s => s.estado === 'programado')
                    .map((solicitud) => (
                      <div
                        key={solicitud.id}
                        className="flex items-center justify-between p-4 bg-gray-700 rounded-lg"
                      >
                        <div>
                          <p className="font-medium text-white">{solicitud.titulo}</p>
                          <p className="text-sm text-gray-400">
                            {solicitud.fechaProgramada} • {solicitud.ubicacion}
                          </p>
                          <p className="text-sm text-gray-400">
                            Técnico: {solicitud.tecnicoAsignado}
                          </p>
                        </div>
                        <div className="text-right">
                          <Badge className={`${getPrioridadColor(solicitud.prioridad)} text-white mb-2`}>
                            {solicitud.prioridad}
                          </Badge>
                          <p className="text-sm text-gray-400">Bs {solicitud.costoEstimado}</p>
                        </div>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  )
}