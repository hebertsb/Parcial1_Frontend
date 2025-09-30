"use client"

import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import {
  Shield, Camera, Users, AlertTriangle, CheckCircle2,
  Clock, MapPin, User, Search, Bell, Activity, Car, Building
} from 'lucide-react'

interface RegistroAcceso {
  id: number
  persona: string
  tipo: 'residente' | 'visitante' | 'proveedor' | 'delivery' | 'trabajador'
  unidad: string
  fechaHora: string
  tipoAcceso: 'entrada' | 'salida'
  ubicacion: string
  autorizado: boolean
  vehiculo?: string
}

interface EventoSeguridad {
  id: number
  titulo: string
  descripcion: string
  tipo: 'alarma' | 'incidente' | 'mantenimiento' | 'sistema'
  severidad: 'baja' | 'media' | 'alta' | 'critica'
  ubicacion: string
  fechaHora: string
  estado: 'activo' | 'en_proceso' | 'resuelto' | 'archivado'
}

const registrosAccesoMock: RegistroAcceso[] = [
  {
    id: 1,
    persona: "María García López",
    tipo: "residente",
    unidad: "A-301",
    fechaHora: "2024-01-15 18:45:00",
    tipoAcceso: "entrada",
    ubicacion: "Entrada Principal",
    autorizado: true,
    vehiculo: "ABC-1234"
  },
  {
    id: 2,
    persona: "Juan Pérez Morales",
    tipo: "visitante",
    unidad: "B-205",
    fechaHora: "2024-01-15 17:30:00",
    tipoAcceso: "entrada",
    ubicacion: "Entrada Principal",
    autorizado: true
  },
  {
    id: 3,
    persona: "Delivery Express",
    tipo: "delivery",
    unidad: "C-102",
    fechaHora: "2024-01-15 16:15:00",
    tipoAcceso: "entrada",
    ubicacion: "Entrada Servicio",
    autorizado: true
  }
]

const eventosSeguridadMock: EventoSeguridad[] = [
  {
    id: 1,
    titulo: "Intento de acceso no autorizado",
    descripcion: "Persona desconocida intentó ingresar usando tarjeta bloqueada",
    tipo: "alarma",
    severidad: "alta",
    ubicacion: "Entrada Principal",
    fechaHora: "2024-01-15 22:30:00",
    estado: "resuelto"
  },
  {
    id: 2,
    titulo: "Falla en cámara de seguridad",
    descripcion: "Cámara del estacionamiento no está transmitiendo",
    tipo: "sistema",
    severidad: "media",
    ubicacion: "Estacionamiento Subterráneo",
    fechaHora: "2024-01-15 20:15:00",
    estado: "en_proceso"
  }
]

export function SeguridadAdmin() {
  const [activeTab, setActiveTab] = useState<'accesos' | 'eventos' | 'camaras'>('accesos')
  const [searchTerm, setSearchTerm] = useState('')
  const [filtroTipo, setFiltroTipo] = useState<string>('todos')

  const getTipoPersonaColor = (tipo: string) => {
    const colors = {
      residente: 'bg-green-500',
      visitante: 'bg-blue-500',
      proveedor: 'bg-orange-500',
      delivery: 'bg-purple-500',
      trabajador: 'bg-yellow-500'
    }
    return colors[tipo as keyof typeof colors] || 'bg-gray-500'
  }

  const getSeveridadColor = (severidad: string) => {
    const colors = {
      baja: 'bg-green-500',
      media: 'bg-yellow-500',
      alta: 'bg-orange-500',
      critica: 'bg-red-500'
    }
    return colors[severidad as keyof typeof colors] || 'bg-gray-500'
  }

  const registrosFiltrados = registrosAccesoMock.filter(registro => {
    const matchesSearch = registro.persona.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         registro.unidad.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesTipo = filtroTipo === 'todos' || registro.tipo === filtroTipo
    return matchesSearch && matchesTipo
  })

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Sistema de Seguridad</h1>
          <p className="text-gray-400 mt-1">Control de acceso y monitoreo en tiempo real</p>
        </div>
        <div className="flex items-center space-x-3">
          <Badge className="bg-green-500 text-white">
            <Activity className="h-4 w-4 mr-1" />
            Sistema Activo
          </Badge>
          <Button className="bg-red-600 hover:bg-red-700">
            <Bell className="h-4 w-4 mr-2" />
            Emergencia
          </Button>
        </div>
      </div>

      {/* Estadísticas en Tiempo Real */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="bg-gray-800 border-gray-700">
          <CardContent className="p-6">
            <div className="flex items-center">
              <Users className="h-8 w-8 text-green-400 mr-3" />
              <div>
                <p className="text-sm font-medium text-gray-400">Personas en el Edificio</p>
                <p className="text-2xl font-bold text-white">47</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-800 border-gray-700">
          <CardContent className="p-6">
            <div className="flex items-center">
              <Camera className="h-8 w-8 text-blue-400 mr-3" />
              <div>
                <p className="text-sm font-medium text-gray-400">Cámaras Activas</p>
                <p className="text-2xl font-bold text-white">8/10</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-800 border-gray-700">
          <CardContent className="p-6">
            <div className="flex items-center">
              <AlertTriangle className="h-8 w-8 text-yellow-400 mr-3" />
              <div>
                <p className="text-sm font-medium text-gray-400">Eventos Pendientes</p>
                <p className="text-2xl font-bold text-white">2</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-800 border-gray-700">
          <CardContent className="p-6">
            <div className="flex items-center">
              <Car className="h-8 w-8 text-purple-400 mr-3" />
              <div>
                <p className="text-sm font-medium text-gray-400">Vehículos Hoy</p>
                <p className="text-2xl font-bold text-white">23</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <div className="flex items-center justify-between">
        <div className="flex space-x-1 bg-gray-800 p-1 rounded-lg">
          <button
            onClick={() => setActiveTab('accesos')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'accesos'
                ? 'bg-blue-600 text-white'
                : 'text-gray-300 hover:text-white hover:bg-gray-700'
            }`}
          >
            Control de Acceso
          </button>
          <button
            onClick={() => setActiveTab('eventos')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'eventos'
                ? 'bg-blue-600 text-white'
                : 'text-gray-300 hover:text-white hover:bg-gray-700'
            }`}
          >
            Eventos de Seguridad
          </button>
          <button
            onClick={() => setActiveTab('camaras')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'camaras'
                ? 'bg-blue-600 text-white'
                : 'text-gray-300 hover:text-white hover:bg-gray-700'
            }`}
          >
            Cámaras
          </button>
        </div>

        {activeTab === 'accesos' && (
          <div className="flex items-center space-x-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Buscar..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-gray-800 border-gray-700 text-white placeholder-gray-400"
              />
            </div>
            <select
              value={filtroTipo}
              onChange={(e) => setFiltroTipo(e.target.value)}
              className="bg-gray-800 border-gray-700 text-white rounded-md px-3 py-2"
            >
              <option value="todos">Todos los tipos</option>
              <option value="residente">Residentes</option>
              <option value="visitante">Visitantes</option>
              <option value="proveedor">Proveedores</option>
              <option value="delivery">Delivery</option>
              <option value="trabajador">Trabajadores</option>
            </select>
          </div>
        )}
      </div>

      {/* Contenido Principal */}
      {activeTab === 'accesos' && (
        <div className="space-y-4">
          {registrosFiltrados.map((registro) => (
            <Card key={registro.id} className="bg-gray-800 border-gray-700">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-4">
                    <div className="flex-grow">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="text-lg font-semibold text-white">{registro.persona}</h3>
                        <Badge className={`${getTipoPersonaColor(registro.tipo)} text-white`}>
                          {registro.tipo}
                        </Badge>
                        <Badge className={registro.tipoAcceso === 'entrada' ? 'bg-green-500' : 'bg-red-500'}>
                          {registro.tipoAcceso === 'entrada' ? '↑ Entrada' : '↓ Salida'}
                        </Badge>
                        <Badge className="bg-green-500">
                          <CheckCircle2 className="h-3 w-3 mr-1" />
                          Autorizado
                        </Badge>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-300">
                        <div className="space-y-1">
                          <div className="flex items-center space-x-2">
                            <Building className="h-4 w-4 text-gray-400" />
                            <span>Unidad: {registro.unidad}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <MapPin className="h-4 w-4 text-gray-400" />
                            <span>{registro.ubicacion}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Clock className="h-4 w-4 text-gray-400" />
                            <span>{registro.fechaHora}</span>
                          </div>
                        </div>
                        <div className="space-y-1">
                          {registro.vehiculo && (
                            <div className="flex items-center space-x-2">
                              <Car className="h-4 w-4 text-gray-400" />
                              <span>Vehículo: {registro.vehiculo}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {activeTab === 'eventos' && (
        <div className="space-y-4">
          {eventosSeguridadMock.map((evento) => (
            <Card key={evento.id} className="bg-gray-800 border-gray-700">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-lg text-white">{evento.titulo}</CardTitle>
                    <div className="flex items-center space-x-3 mt-2">
                      <Badge className={`${getSeveridadColor(evento.severidad)} text-white`}>
                        {evento.severidad}
                      </Badge>
                      <Badge className={
                        evento.estado === 'activo' ? 'bg-red-500' :
                        evento.estado === 'en_proceso' ? 'bg-yellow-500' :
                        evento.estado === 'resuelto' ? 'bg-green-500' : 'bg-gray-500'
                      }>
                        {evento.estado.replace('_', ' ')}
                      </Badge>
                      <span className="text-sm text-gray-400">{evento.fechaHora}</span>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-gray-300 mb-4">{evento.descripcion}</p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <MapPin className="h-4 w-4 text-gray-400" />
                      <span className="text-sm text-gray-300">{evento.ubicacion}</span>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end space-x-2">
                  <Button variant="outline" size="sm" className="border-gray-600 text-gray-300 hover:bg-gray-700">
                    Ver Detalles
                  </Button>
                  {evento.estado === 'activo' && (
                    <Button size="sm" className="bg-yellow-600 hover:bg-yellow-700">
                      Atender
                    </Button>
                  )}
                  {evento.estado === 'en_proceso' && (
                    <Button size="sm" className="bg-green-600 hover:bg-green-700">
                      Resolver
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {activeTab === 'camaras' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Placeholder para cámaras */}
          {[1, 2, 3, 4, 5, 6].map(id => (
            <Card key={id} className="bg-gray-800 border-gray-700">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-lg text-white">Cámara {id}</CardTitle>
                    <p className="text-gray-400">Ubicación {id}</p>
                  </div>
                  <Badge className="bg-green-500 text-white">Activa</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="aspect-video bg-gray-700 rounded-lg mb-4 flex items-center justify-center">
                  <div className="text-center">
                    <Camera className="h-12 w-12 text-green-400 mx-auto mb-2" />
                    <p className="text-sm text-green-400">EN VIVO</p>
                  </div>
                </div>
                
                <div className="flex justify-between">
                  <Button variant="outline" size="sm" className="border-gray-600 text-gray-300 hover:bg-gray-700">
                    Ver
                  </Button>
                  <Button variant="outline" size="sm" className="border-gray-600 text-gray-300 hover:bg-gray-700">
                    Config
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}