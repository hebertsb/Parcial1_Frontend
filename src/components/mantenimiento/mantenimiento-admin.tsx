"use client"

import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import {
  Plus, Search, Wrench, AlertTriangle, CheckCircle2, Clock,
  Calendar, User, MapPin, DollarSign, Phone, Mail
} from 'lucide-react'

interface SolicitudMantenimiento {
  id: number
  titulo: string
  descripcion: string
  ubicacion: string
  solicitante: string
  unidad: string
  fechaSolicitud: string
  estado: 'pendiente' | 'programado' | 'en_proceso' | 'completado' | 'cancelado'
  prioridad: 'baja' | 'media' | 'alta' | 'urgente'
  categoria: 'electricidad' | 'plomeria' | 'jardineria' | 'limpieza' | 'seguridad' | 'otros'
  costoEstimado: number
  tecnicoAsignado?: string
}

const solicitudesMock: SolicitudMantenimiento[] = [
  {
    id: 1,
    titulo: "Reparación de luminaria en pasillo",
    descripcion: "Las luces del pasillo del 3er piso Torre A no funcionan",
    ubicacion: "Torre A - Piso 3 - Pasillo principal",
    solicitante: "María García",
    unidad: "A-301",
    fechaSolicitud: "2024-01-15",
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
    fechaSolicitud: "2024-01-10",
    estado: "completado",
    prioridad: "media",
    categoria: "jardineria",
    costoEstimado: 500,
    tecnicoAsignado: "Roberto Silva - Jardinero"
  }
]

export function MantenimientoAdmin() {
  const [searchTerm, setSearchTerm] = useState('')
  const [filtroEstado, setFiltroEstado] = useState<string>('todos')
  const [filtroPrioridad, setFiltroPrioridad] = useState<string>('todos')

  const solicitudesFiltradas = solicitudesMock.filter(solicitud => {
    const matchesSearch = solicitud.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         solicitud.ubicacion.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesEstado = filtroEstado === 'todos' || solicitud.estado === filtroEstado
    const matchesPrioridad = filtroPrioridad === 'todos' || solicitud.prioridad === filtroPrioridad
    return matchesSearch && matchesEstado && matchesPrioridad
  })

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

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Mantenimiento de Espacios Comunes</h1>
          <p className="text-gray-400 mt-1">Gestión de solicitudes y mantenimiento preventivo</p>
        </div>
        <Button className="bg-blue-600 hover:bg-blue-700">
          <Plus className="h-4 w-4 mr-2" />
          Nueva Solicitud
        </Button>
      </div>

      {/* Estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="bg-gray-800 border-gray-700">
          <CardContent className="p-6">
            <div className="flex items-center">
              <Clock className="h-8 w-8 text-yellow-400 mr-3" />
              <div>
                <p className="text-sm font-medium text-gray-400">Solicitudes Pendientes</p>
                <p className="text-2xl font-bold text-white">5</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-800 border-gray-700">
          <CardContent className="p-6">
            <div className="flex items-center">
              <Wrench className="h-8 w-8 text-blue-400 mr-3" />
              <div>
                <p className="text-sm font-medium text-gray-400">En Proceso</p>
                <p className="text-2xl font-bold text-white">3</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-800 border-gray-700">
          <CardContent className="p-6">
            <div className="flex items-center">
              <CheckCircle2 className="h-8 w-8 text-green-400 mr-3" />
              <div>
                <p className="text-sm font-medium text-gray-400">Completados Este Mes</p>
                <p className="text-2xl font-bold text-white">12</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-800 border-gray-700">
          <CardContent className="p-6">
            <div className="flex items-center">
              <DollarSign className="h-8 w-8 text-purple-400 mr-3" />
              <div>
                <p className="text-sm font-medium text-gray-400">Costos Este Mes</p>
                <p className="text-2xl font-bold text-white">Bs 3,200</p>
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
      </div>

      {/* Lista de Solicitudes */}
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
                </div>
                <div className="space-y-2">
                  {solicitud.tecnicoAsignado && (
                    <div className="flex items-center space-x-2">
                      <Wrench className="h-4 w-4 text-gray-400" />
                      <span className="text-sm text-gray-300">{solicitud.tecnicoAsignado}</span>
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
    </div>
  )
}