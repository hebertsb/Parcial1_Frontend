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
    descripcion: "Las luces del pasillo del 3er piso Torre A no funcionan. Requiere reemplazo de 6 focos LED y revisión del tablero eléctrico",
    ubicacion: "Torre A - Piso 3 - Pasillo principal",
    solicitante: "María García",
    unidad: "A-301",
    fechaSolicitud: "2024-01-15",
    estado: "programado",
    prioridad: "alta",
    categoria: "electricidad",
    costoEstimado: 350,
    tecnicoAsignado: "Juan Pérez - Electricista Certificado"
  },
  {
    id: 2,
    titulo: "Fuga de agua en área común",
    descripcion: "Fuga significativa en tubería principal del sótano que está afectando la presión de agua en los pisos 1-3",
    ubicacion: "Sótano - Área de medidores",
    solicitante: "Administración",
    unidad: "N/A",
    fechaSolicitud: "2024-01-14",
    estado: "en_proceso",
    prioridad: "urgente",
    categoria: "plomeria",
    costoEstimado: 850,
    tecnicoAsignado: "Carlos Mamani - Plomero Master"
  },
  {
    id: 3,
    titulo: "Mantenimiento de jardines",
    descripcion: "Poda de árboles, limpieza general de áreas verdes, replantación de flores de temporada",
    ubicacion: "Áreas verdes - Entrada principal",
    solicitante: "Consejo Administrativo",
    unidad: "N/A",
    fechaSolicitud: "2024-01-10",
    estado: "completado",
    prioridad: "media",
    categoria: "jardineria",
    costoEstimado: 750,
    tecnicoAsignado: "Roberto Silva - Jardinero Profesional"
  },
  {
    id: 4,
    titulo: "Limpieza profunda de ascensores",
    descripcion: "Limpieza y desinfección completa de todos los ascensores, incluyendo mantenimiento de botones y espejos",
    ubicacion: "Torre A y B - Todos los ascensores",
    solicitante: "Sandra Morales",
    unidad: "B-405",
    fechaSolicitud: "2024-01-18",
    estado: "pendiente",
    prioridad: "media",
    categoria: "limpieza",
    costoEstimado: 280,
    tecnicoAsignado: undefined
  },
  {
    id: 5,
    titulo: "Revisión sistema de seguridad cámaras",
    descripcion: "3 cámaras del área de parqueo no están grabando correctamente. Requiere revisión técnica del DVR",
    ubicacion: "Parqueo subterráneo - Sectores B y C",
    solicitante: "Personal de Seguridad",
    unidad: "N/A",
    fechaSolicitud: "2024-01-17",
    estado: "pendiente",
    prioridad: "alta",
    categoria: "seguridad",
    costoEstimado: 450,
    tecnicoAsignado: undefined
  },
  {
    id: 6,
    titulo: "Reparación puerta de ingreso principal",
    descripcion: "La puerta automática principal se traba ocasionalmente y hace ruidos extraños",
    ubicacion: "Entrada principal - Puerta automática",
    solicitante: "Luis Fernández",
    unidad: "A-102",
    fechaSolicitud: "2024-01-16",
    estado: "programado",
    prioridad: "alta",
    categoria: "otros",
    costoEstimado: 320,
    tecnicoAsignado: "Miguel Torres - Técnico en Automatización"
  },
  {
    id: 7,
    titulo: "Pintura de pasillos Torre B",
    descripcion: "Los pasillos de los pisos 2, 4 y 6 de la Torre B necesitan repintado por humedad y desgaste",
    ubicacion: "Torre B - Pisos 2, 4 y 6",
    solicitante: "Administración",
    unidad: "N/A",
    fechaSolicitud: "2024-01-12",
    estado: "programado",
    prioridad: "media",
    categoria: "otros",
    costoEstimado: 1200,
    tecnicoAsignado: "Equipo de Pintura Profesional"
  },
  {
    id: 8,
    titulo: "Mantenimiento sistema de bombas de agua",
    descripcion: "Mantenimiento preventivo anual de las bombas de agua y limpieza de tanques",
    ubicacion: "Cuarto de máquinas - Sótano 2",
    solicitante: "Administración",
    unidad: "N/A",
    fechaSolicitud: "2024-01-08",
    estado: "completado",
    prioridad: "media",
    categoria: "plomeria",
    costoEstimado: 950,
    tecnicoAsignado: "Hidro Servicios SRL"
  },
  {
    id: 9,
    titulo: "Reparación intercomunicador Torre A",
    descripcion: "El sistema de intercomunicador del piso 5 no permite comunicación con portería",
    ubicacion: "Torre A - Piso 5",
    solicitante: "Patricia Rojas",
    unidad: "A-503",
    fechaSolicitud: "2024-01-19",
    estado: "pendiente",
    prioridad: "media",
    categoria: "electricidad",
    costoEstimado: 180,
    tecnicoAsignado: undefined
  },
  {
    id: 10,
    titulo: "Fumigación áreas comunes",
    descripcion: "Fumigación preventiva contra insectos en áreas comunes, pasillos y sótanos",
    ubicacion: "Todas las áreas comunes",
    solicitante: "Consejo Administrativo",
    unidad: "N/A",
    fechaSolicitud: "2024-01-13",
    estado: "completado",
    prioridad: "baja",
    categoria: "otros",
    costoEstimado: 380,
    tecnicoAsignado: "Fumigaciones del Valle"
  }
]

export function MantenimientoAdmin() {
  const [searchTerm, setSearchTerm] = useState('')
  const [filtroEstado, setFiltroEstado] = useState<string>('todos')
  const [filtroPrioridad, setFiltroPrioridad] = useState<string>('todos')
  const [solicitudes, setSolicitudes] = useState(solicitudesMock)
  const [showModal, setShowModal] = useState(false)
  const [selectedSolicitud, setSelectedSolicitud] = useState<SolicitudMantenimiento | null>(null)

  const solicitudesFiltradas = solicitudes.filter(solicitud => {
    const matchesSearch = solicitud.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         solicitud.ubicacion.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         solicitud.solicitante.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesEstado = filtroEstado === 'todos' || solicitud.estado === filtroEstado
    const matchesPrioridad = filtroPrioridad === 'todos' || solicitud.prioridad === filtroPrioridad
    return matchesSearch && matchesEstado && matchesPrioridad
  })

  // Función para mostrar notificaciones tipo servidor
  const showServerNotification = (message: string, type: 'success' | 'info' | 'warning' = 'success') => {
    const colors = {
      success: 'bg-green-500',
      info: 'bg-blue-500', 
      warning: 'bg-yellow-500'
    }
    
    const icons = {
      success: `<path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/>`,
      info: `<path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd"/>`,
      warning: `<path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd"/>`
    }

    setTimeout(() => {
      const notification = document.createElement('div')
      notification.className = `fixed top-4 right-4 ${colors[type]} text-white px-6 py-3 rounded-lg shadow-lg z-50 flex items-center gap-2 transition-all duration-300`
      notification.innerHTML = `
        <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
          ${icons[type]}
        </svg>
        <span>${message}</span>
      `
      document.body.appendChild(notification)
      setTimeout(() => {
        notification.style.opacity = '0'
        notification.style.transform = 'translateX(100%)'
        setTimeout(() => document.body.removeChild(notification), 300)
      }, 3000)
    }, 300)
  }

  // Funciones simuladas
  const handleCrearSolicitud = () => {
    showServerNotification('Formulario de nueva solicitud cargado correctamente', 'info')
  }

  const handleCambiarEstado = (id: number, nuevoEstado: SolicitudMantenimiento['estado']) => {
    setSolicitudes(prev => prev.map(s => 
      s.id === id ? { ...s, estado: nuevoEstado } : s
    ))
    showServerNotification(`Estado actualizado exitosamente: ${nuevoEstado.replace('_', ' ')}`, 'success')
  }

  const handleAsignarTecnico = (id: number) => {
    const tecnicos = [
      'Juan Pérez - Electricista', 'Carlos Mamani - Plomero', 
      'Roberto Silva - Jardinero', 'Ana Torres - Limpieza',
      'Miguel Santos - Técnico General'
    ]
    const tecnicoAleatorio = tecnicos[Math.floor(Math.random() * tecnicos.length)]
    
    setSolicitudes(prev => prev.map(s => 
      s.id === id ? { ...s, tecnicoAsignado: tecnicoAleatorio, estado: 'programado' } : s
    ))
    
    showServerNotification(`Técnico asignado exitosamente: ${tecnicoAleatorio}`, 'success')
  }

  const handleVerDetalles = (solicitud: SolicitudMantenimiento) => {
    setSelectedSolicitud(solicitud)
    setShowModal(true)
  }

  // Calcular estadísticas dinámicas
  const stats = {
    pendientes: solicitudes.filter(s => s.estado === 'pendiente').length,
    enProceso: solicitudes.filter(s => s.estado === 'en_proceso').length,
    completados: solicitudes.filter(s => s.estado === 'completado').length,
    costoTotal: solicitudes
      .filter(s => s.estado === 'completado')
      .reduce((sum, s) => sum + s.costoEstimado, 0)
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

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Mantenimiento de Espacios Comunes</h1>
          <p className="text-gray-400 mt-1">Gestión de solicitudes y mantenimiento preventivo</p>
        </div>
        <Button onClick={handleCrearSolicitud} className="bg-blue-600 hover:bg-blue-700">
          <Plus className="h-4 w-4 mr-2" />
          Nueva Solicitud
        </Button>
      </div>

      {/* Estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="bg-gray-800 border-gray-700 hover:bg-gray-750 transition-colors cursor-pointer" onClick={() => setFiltroEstado('pendiente')}>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Clock className="h-8 w-8 text-yellow-400 mr-3" />
              <div>
                <p className="text-sm font-medium text-gray-400">Solicitudes Pendientes</p>
                <p className="text-2xl font-bold text-white">{stats.pendientes}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-800 border-gray-700 hover:bg-gray-750 transition-colors cursor-pointer" onClick={() => setFiltroEstado('en_proceso')}>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Wrench className="h-8 w-8 text-blue-400 mr-3" />
              <div>
                <p className="text-sm font-medium text-gray-400">En Proceso</p>
                <p className="text-2xl font-bold text-white">{stats.enProceso}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-800 border-gray-700 hover:bg-gray-750 transition-colors cursor-pointer" onClick={() => setFiltroEstado('completado')}>
          <CardContent className="p-6">
            <div className="flex items-center">
              <CheckCircle2 className="h-8 w-8 text-green-400 mr-3" />
              <div>
                <p className="text-sm font-medium text-gray-400">Completados Este Mes</p>
                <p className="text-2xl font-bold text-white">{stats.completados}</p>
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
                <p className="text-2xl font-bold text-white">Bs {stats.costoTotal.toLocaleString()}</p>
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
          <Button 
            variant="outline" 
            onClick={() => {
              setSearchTerm('')
              setFiltroEstado('todos')
              setFiltroPrioridad('todos')
            }}
            className="border-gray-600 text-gray-300 hover:bg-gray-700"
          >
            Limpiar Filtros
          </Button>
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
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => handleVerDetalles(solicitud)}
                  className="border-gray-600 text-gray-300 hover:bg-gray-700"
                >
                  Ver Detalles
                </Button>
                {solicitud.estado === 'pendiente' && (
                  <>
                    <Button 
                      size="sm" 
                      onClick={() => handleCambiarEstado(solicitud.id, 'programado')}
                      className="bg-blue-600 hover:bg-blue-700"
                    >
                      Programar
                    </Button>
                    <Button 
                      size="sm" 
                      onClick={() => handleAsignarTecnico(solicitud.id)}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      Asignar Técnico
                    </Button>
                  </>
                )}
                {solicitud.estado === 'programado' && (
                  <Button 
                    size="sm" 
                    onClick={() => handleCambiarEstado(solicitud.id, 'en_proceso')}
                    className="bg-orange-600 hover:bg-orange-700"
                  >
                    Iniciar Trabajo
                  </Button>
                )}
                {solicitud.estado === 'en_proceso' && (
                  <Button 
                    size="sm" 
                    onClick={() => handleCambiarEstado(solicitud.id, 'completado')}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    Marcar Completado
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Modal de Detalles */}
      {showModal && selectedSolicitud && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <Card className="bg-gray-800 border-gray-700 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <CardHeader>
              <div className="flex justify-between items-start">
                <CardTitle className="text-white text-xl">{selectedSolicitud.titulo}</CardTitle>
                <Button 
                  variant="ghost" 
                  onClick={() => setShowModal(false)}
                  className="text-gray-400 hover:text-white"
                >
                  ✕
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-400">Estado</p>
                  <Badge className={`${getEstadoColor(selectedSolicitud.estado)} text-white`}>
                    {selectedSolicitud.estado.replace('_', ' ')}
                  </Badge>
                </div>
                <div>
                  <p className="text-sm text-gray-400">Prioridad</p>
                  <Badge className={`${getPrioridadColor(selectedSolicitud.prioridad)} text-white`}>
                    {selectedSolicitud.prioridad}
                  </Badge>
                </div>
              </div>
              
              <div>
                <p className="text-sm text-gray-400">Descripción Completa</p>
                <p className="text-white">{selectedSolicitud.descripcion}</p>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-400">Ubicación</p>
                  <p className="text-white">{selectedSolicitud.ubicacion}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-400">Fecha de Solicitud</p>
                  <p className="text-white">{selectedSolicitud.fechaSolicitud}</p>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-400">Solicitante</p>
                  <p className="text-white">{selectedSolicitud.solicitante} - {selectedSolicitud.unidad}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-400">Costo Estimado</p>
                  <p className="text-white font-bold">Bs {selectedSolicitud.costoEstimado.toLocaleString()}</p>
                </div>
              </div>
              
              {selectedSolicitud.tecnicoAsignado && (
                <div>
                  <p className="text-sm text-gray-400">Técnico Asignado</p>
                  <p className="text-white">{selectedSolicitud.tecnicoAsignado}</p>
                </div>
              )}
              
              <div className="flex justify-end space-x-2 mt-6">
                <Button 
                  variant="outline" 
                  onClick={() => setShowModal(false)}
                  className="border-gray-600 text-gray-300"
                >
                  Cerrar
                </Button>
                {selectedSolicitud.estado === 'pendiente' && (
                  <Button 
                    onClick={() => {
                      handleAsignarTecnico(selectedSolicitud.id)
                      setShowModal(false)
                    }}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    Asignar Técnico
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}