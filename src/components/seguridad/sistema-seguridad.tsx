"use client"

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import {
  ArrowLeft, Shield, Camera, Users, AlertTriangle, CheckCircle2,
  Clock, MapPin, User, Calendar, Search, Filter, Eye, Lock,
  Unlock, Bell, Activity, Phone, Car, Building, Settings
} from 'lucide-react'

interface RegistroAcceso {
  id: number
  persona: string
  tipo: 'residente' | 'visitante' | 'proveedor' | 'delivery' | 'trabajador'
  unidad: string
  fechaHora: string
  tipoAcceso: 'entrada' | 'salida'
  ubicacion: string
  metodoAcceso: 'tarjeta' | 'codigo' | 'reconocimiento_facial' | 'manual'
  autorizado: boolean
  observaciones?: string
  foto?: string
  vehiculo?: string
  acompañantes?: number
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
  guardia: string
  acciones: string[]
}

interface CamaraSeguridad {
  id: number
  nombre: string
  ubicacion: string
  estado: 'activa' | 'inactiva' | 'mantenimiento' | 'error'
  tipo: 'fija' | 'domo' | 'panoramica'
  grabando: boolean
  calidad: string
  ultimaActividad: string
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
    metodoAcceso: "reconocimiento_facial",
    autorizado: true,
    vehiculo: "ABC-1234",
    acompañantes: 2
  },
  {
    id: 2,
    persona: "Juan Pérez Morales",
    tipo: "visitante", 
    unidad: "B-205",
    fechaHora: "2024-01-15 17:30:00",
    tipoAcceso: "entrada",
    ubicacion: "Entrada Principal",
    metodoAcceso: "codigo",
    autorizado: true,
    observaciones: "Visita familiar autorizada"
  },
  {
    id: 3,
    persona: "Delivery Express",
    tipo: "delivery",
    unidad: "C-102",
    fechaHora: "2024-01-15 16:15:00",
    tipoAcceso: "entrada",
    ubicacion: "Entrada Servicio",
    metodoAcceso: "manual",
    autorizado: true,
    observaciones: "Entrega de pedido - Rappi"
  },
  {
    id: 4,
    persona: "Carlos Mamani",
    tipo: "trabajador",
    unidad: "N/A",
    fechaHora: "2024-01-15 14:20:00",
    tipoAcceso: "entrada",
    ubicacion: "Entrada Servicio",
    metodoAcceso: "tarjeta",
    autorizado: true,
    observaciones: "Mantenimiento plomería"
  },
  {
    id: 5,
    persona: "Luis Rodríguez",
    tipo: "visitante",
    unidad: "A-401",
    fechaHora: "2024-01-15 12:00:00",
    tipoAcceso: "salida",
    ubicacion: "Entrada Principal",
    metodoAcceso: "manual",
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
    estado: "resuelto",
    guardia: "Roberto Silva",
    acciones: ["Verificación de identidad", "Contacto con residente", "Acceso denegado"]
  },
  {
    id: 2,
    titulo: "Falla en cámara de seguridad",
    descripcion: "Cámara del estacionamiento no está transmitiendo",
    tipo: "sistema",
    severidad: "media",
    ubicacion: "Estacionamiento Subterráneo",
    fechaHora: "2024-01-15 20:15:00",
    estado: "en_proceso",
    guardia: "Miguel Torres",
    acciones: ["Notificación técnica", "Revisión manual aumentada"]
  },
  {
    id: 3,
    titulo: "Vehículo no autorizado en estacionamiento",
    descripcion: "Vehículo sin sticker de residente estacionado en área restringida",
    tipo: "incidente",
    severidad: "baja",
    ubicacion: "Estacionamiento Nivel 1",
    fechaHora: "2024-01-15 15:45:00",
    estado: "resuelto",
    guardia: "Roberto Silva",
    acciones: ["Localización del propietario", "Advertencia verbal", "Relocalización"]
  }
]

const camarasMock: CamaraSeguridad[] = [
  {
    id: 1,
    nombre: "Entrada Principal",
    ubicacion: "Lobby - Puerta Principal",
    estado: "activa",
    tipo: "domo",
    grabando: true,
    calidad: "4K",
    ultimaActividad: "2024-01-15 18:45:00"
  },
  {
    id: 2,
    nombre: "Estacionamiento Subterráneo",
    ubicacion: "Sótano - Nivel -1",
    estado: "error",
    tipo: "fija",
    grabando: false,
    calidad: "HD",
    ultimaActividad: "2024-01-15 20:15:00"
  },
  {
    id: 3,
    nombre: "Área de Juegos",
    ubicacion: "Planta Baja - Patio Trasero",
    estado: "activa",
    tipo: "panoramica",
    grabando: true,
    calidad: "HD",
    ultimaActividad: "2024-01-15 18:30:00"
  },
  {
    id: 4,
    nombre: "Pasillo Torre A",
    ubicacion: "Torre A - Piso 3",
    estado: "activa",
    tipo: "fija",
    grabando: true,
    calidad: "HD",
    ultimaActividad: "2024-01-15 18:20:00"
  },
  {
    id: 5,
    nombre: "Salón Comunal",
    ubicacion: "Torre A - Planta Baja",
    estado: "inactiva",
    tipo: "domo",
    grabando: false,
    calidad: "4K",
    ultimaActividad: "2024-01-14 22:00:00"
  }
]

export function SistemaSeguridad() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState<'accesos' | 'eventos' | 'camaras' | 'reportes'>('accesos')
  const [searchTerm, setSearchTerm] = useState('')
  const [filtroTipo, setFiltroTipo] = useState<string>('todos')
  const [filtroFecha, setFiltroFecha] = useState<string>('hoy')

  const handleVolver = () => {
    router.back()
  }

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

  const getEstadoCamaraColor = (estado: string) => {
    const colors = {
      activa: 'bg-green-500',
      inactiva: 'bg-gray-500',
      mantenimiento: 'bg-yellow-500',
      error: 'bg-red-500'
    }
    return colors[estado as keyof typeof colors] || 'bg-gray-500'
  }

  const getMetodoAccesoIcon = (metodo: string) => {
    const icons = {
      tarjeta: '💳',
      codigo: '🔢',
      reconocimiento_facial: '👤',
      manual: '👨‍💼'
    }
    return icons[metodo as keyof typeof icons] || '🔒'
  }

  const registrosFiltrados = registrosAccesoMock.filter(registro => {
    const matchesSearch = registro.persona.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         registro.unidad.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesTipo = filtroTipo === 'todos' || registro.tipo === filtroTipo
    return matchesSearch && matchesTipo
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
              <h1 className="text-2xl font-bold text-white">Sistema de Seguridad</h1>
              <p className="text-gray-400 mt-1">Control de acceso y monitoreo en tiempo real</p>
            </div>
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
      </div>

      <div className="p-6 space-y-6">
        {/* Estadísticas en Tiempo Real */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="bg-gray-800 border-gray-700">
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-2 bg-green-500/20 rounded-lg">
                  <Users className="h-6 w-6 text-green-400" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-400">Personas en el Edificio</p>
                  <p className="text-2xl font-bold text-white">47</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-800 border-gray-700">
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-2 bg-blue-500/20 rounded-lg">
                  <Camera className="h-6 w-6 text-blue-400" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-400">Cámaras Activas</p>
                  <p className="text-2xl font-bold text-white">8/10</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-800 border-gray-700">
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-2 bg-yellow-500/20 rounded-lg">
                  <AlertTriangle className="h-6 w-6 text-yellow-400" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-400">Eventos Pendientes</p>
                  <p className="text-2xl font-bold text-white">2</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-800 border-gray-700">
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-2 bg-purple-500/20 rounded-lg">
                  <Car className="h-6 w-6 text-purple-400" />
                </div>
                <div className="ml-4">
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
            <button
              onClick={() => setActiveTab('reportes')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                activeTab === 'reportes'
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-300 hover:text-white hover:bg-gray-700'
              }`}
            >
              Reportes
            </button>
          </div>

          {(activeTab === 'accesos' || activeTab === 'eventos') && (
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
                {activeTab === 'accesos' ? (
                  <>
                    <option value="todos">Todos los tipos</option>
                    <option value="residente">Residentes</option>
                    <option value="visitante">Visitantes</option>
                    <option value="proveedor">Proveedores</option>
                    <option value="delivery">Delivery</option>
                    <option value="trabajador">Trabajadores</option>
                  </>
                ) : (
                  <>
                    <option value="todos">Todos los eventos</option>
                    <option value="alarma">Alarmas</option>
                    <option value="incidente">Incidentes</option>
                    <option value="sistema">Sistema</option>
                    <option value="mantenimiento">Mantenimiento</option>
                  </>
                )}
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
                      <div className="text-2xl">{getMetodoAccesoIcon(registro.metodoAcceso)}</div>
                      <div className="flex-grow">
                        <div className="flex items-center space-x-3 mb-2">
                          <h3 className="text-lg font-semibold text-white">{registro.persona}</h3>
                          <Badge className={`${getTipoPersonaColor(registro.tipo)} text-white`}>
                            {registro.tipo}
                          </Badge>
                          <Badge className={registro.tipoAcceso === 'entrada' ? 'bg-green-500' : 'bg-red-500'}>
                            {registro.tipoAcceso === 'entrada' ? '↑ Entrada' : '↓ Salida'}
                          </Badge>
                          {registro.autorizado ? (
                            <Badge className="bg-green-500">
                              <CheckCircle2 className="h-3 w-3 mr-1" />
                              Autorizado
                            </Badge>
                          ) : (
                            <Badge className="bg-red-500">
                              <AlertTriangle className="h-3 w-3 mr-1" />
                              No Autorizado
                            </Badge>
                          )}
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
                            {registro.acompañantes && (
                              <div className="flex items-center space-x-2">
                                <Users className="h-4 w-4 text-gray-400" />
                                <span>Acompañantes: {registro.acompañantes}</span>
                              </div>
                            )}
                          </div>
                        </div>
                        
                        {registro.observaciones && (
                          <p className="text-sm text-gray-400 mt-2 italic">
                            Observaciones: {registro.observaciones}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm" className="border-gray-600 text-gray-300 hover:bg-gray-700">
                        <Eye className="h-4 w-4" />
                      </Button>
                      {registro.foto && (
                        <Button variant="outline" size="sm" className="border-gray-600 text-gray-300 hover:bg-gray-700">
                          <Camera className="h-4 w-4" />
                        </Button>
                      )}
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
                      <div className="flex items-center space-x-2">
                        <User className="h-4 w-4 text-gray-400" />
                        <span className="text-sm text-gray-300">Guardia: {evento.guardia}</span>
                      </div>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-400 mb-2">Acciones tomadas:</p>
                      <ul className="text-sm text-gray-300 space-y-1">
                        {evento.acciones.map((accion, index) => (
                          <li key={index} className="flex items-center space-x-2">
                            <CheckCircle2 className="h-3 w-3 text-green-400" />
                            <span>{accion}</span>
                          </li>
                        ))}
                      </ul>
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
            {camarasMock.map((camara) => (
              <Card key={camara.id} className="bg-gray-800 border-gray-700">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-lg text-white">{camara.nombre}</CardTitle>
                      <p className="text-gray-400">{camara.ubicacion}</p>
                    </div>
                    <Badge className={`${getEstadoCamaraColor(camara.estado)} text-white`}>
                      {camara.estado}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="aspect-video bg-gray-700 rounded-lg mb-4 flex items-center justify-center">
                    {camara.estado === 'activa' ? (
                      <div className="text-center">
                        <Camera className="h-12 w-12 text-green-400 mx-auto mb-2" />
                        <p className="text-sm text-green-400">EN VIVO</p>
                      </div>
                    ) : (
                      <div className="text-center">
                        <Camera className="h-12 w-12 text-gray-500 mx-auto mb-2" />
                        <p className="text-sm text-gray-500">SIN SEÑAL</p>
                      </div>
                    )}
                  </div>
                  
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Tipo:</span>
                      <span className="text-white">{camara.tipo}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Calidad:</span>
                      <span className="text-white">{camara.calidad}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Grabando:</span>
                      <span className={camara.grabando ? 'text-green-400' : 'text-red-400'}>
                        {camara.grabando ? 'Sí' : 'No'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Última actividad:</span>
                      <span className="text-white">{camara.ultimaActividad}</span>
                    </div>
                  </div>

                  <div className="flex justify-between mt-4">
                    <Button variant="outline" size="sm" className="border-gray-600 text-gray-300 hover:bg-gray-700">
                      <Eye className="h-4 w-4 mr-2" />
                      Ver
                    </Button>
                    <Button variant="outline" size="sm" className="border-gray-600 text-gray-300 hover:bg-gray-700">
                      <Settings className="h-4 w-4 mr-2" />
                      Config
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {activeTab === 'reportes' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="bg-gray-800 border-gray-700">
                <CardHeader>
                  <CardTitle className="text-white">Estadísticas de Acceso - Hoy</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400">Total accesos:</span>
                      <span className="text-2xl font-bold text-white">73</span>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-gray-400">Residentes:</span>
                        <span className="text-white">45</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Visitantes:</span>
                        <span className="text-white">18</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Proveedores:</span>
                        <span className="text-white">7</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Delivery:</span>
                        <span className="text-white">3</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gray-800 border-gray-700">
                <CardHeader>
                  <CardTitle className="text-white">Eventos de Seguridad - Esta Semana</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400">Total eventos:</span>
                      <span className="text-2xl font-bold text-white">12</span>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-gray-400">Alarmas:</span>
                        <Badge className="bg-red-500">3</Badge>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Incidentes:</span>
                        <Badge className="bg-orange-500">5</Badge>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Sistema:</span>
                        <Badge className="bg-blue-500">4</Badge>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white">Generar Reportes</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Button className="bg-blue-600 hover:bg-blue-700">
                    Reporte de Accesos
                  </Button>
                  <Button className="bg-green-600 hover:bg-green-700">
                    Reporte de Eventos
                  </Button>
                  <Button className="bg-purple-600 hover:bg-purple-700">
                    Reporte de Cámaras
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  )
}