"use client"

import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import {
  Bell, MessageSquare, Calendar, Users, Send,
  Filter, Search, Plus, Eye, Trash2, Edit, AlertCircle,
  CheckCircle2, Clock, User, Building
} from 'lucide-react'

interface Comunicado {
  id: number
  titulo: string
  contenido: string
  fecha: string
  autor: string
  tipo: 'general' | 'urgente' | 'mantenimiento' | 'evento'
  estado: 'publicado' | 'borrador' | 'programado'
  leidos: number
  total: number
}

interface Notificacion {
  id: number
  mensaje: string
  fecha: string
  tipo: 'info' | 'warning' | 'success' | 'error'
  leida: boolean
  usuario: string
}

const comunicadosMock: Comunicado[] = [
  {
    id: 1,
    titulo: "Corte de agua programado - Torre A",
    contenido: "Se realizará mantenimiento en las tuberías principales de la Torre A el próximo sábado de 8:00 AM a 2:00 PM.",
    fecha: "2024-01-15",
    autor: "Administración",
    tipo: "mantenimiento",
    estado: "publicado",
    leidos: 28,
    total: 40
  },
  {
    id: 2,
    titulo: "Reunión de consorcio - Enero 2024",
    contenido: "Se convoca a todos los propietarios a la reunión mensual que se realizará el 20 de enero a las 10:00 AM en el salón comunal.",
    fecha: "2024-01-10",
    autor: "Consejo Administrativo",
    tipo: "general",
    estado: "publicado",
    leidos: 35,
    total: 40
  },
  {
    id: 3,
    titulo: "Nuevas medidas de seguridad",
    contenido: "A partir del 1 de febrero se implementará el sistema de reconocimiento facial en todos los accesos principales.",
    fecha: "2024-01-08",
    autor: "Seguridad",
    tipo: "urgente",
    estado: "publicado",
    leidos: 38,
    total: 40
  }
]

const notificacionesMock: Notificacion[] = [
  {
    id: 1,
    mensaje: "Su pago de cuota de mantenimiento ha sido procesado correctamente",
    fecha: "2024-01-15 14:30",
    tipo: "success",
    leida: false,
    usuario: "Sistema Financiero"
  },
  {
    id: 2,
    mensaje: "Recordatorio: Reunión de consorcio mañana a las 10:00 AM",
    fecha: "2024-01-14 16:45",
    tipo: "info",
    leida: true,
    usuario: "Administración"
  },
  {
    id: 3,
    mensaje: "Su reserva del salón comunal para el 20/01 ha sido confirmada",
    fecha: "2024-01-12 09:15",
    tipo: "success",
    leida: true,
    usuario: "Reservas"
  },
  {
    id: 4,
    mensaje: "Corte de agua programado en su torre para este sábado",
    fecha: "2024-01-10 11:20",
    tipo: "warning",
    leida: false,
    usuario: "Mantenimiento"
  }
]

export function ComunicadosNotificaciones() {
  const [activeTab, setActiveTab] = useState<'comunicados' | 'notificaciones'>('comunicados')
  const [searchTerm, setSearchTerm] = useState('')
  const [filtroTipo, setFiltroTipo] = useState<string>('todos')
  const [showNewComunicado, setShowNewComunicado] = useState(false)

  const getTipoColor = (tipo: string) => {
    const colors = {
      general: 'bg-blue-500',
      urgente: 'bg-red-500',
      mantenimiento: 'bg-yellow-500',
      evento: 'bg-green-500',
      info: 'bg-blue-500',
      warning: 'bg-yellow-500',
      success: 'bg-green-500',
      error: 'bg-red-500'
    }
    return colors[tipo as keyof typeof colors] || 'bg-gray-500'
  }

  const getTipoIcon = (tipo: string) => {
    const icons = {
      general: MessageSquare,
      urgente: AlertCircle,
      mantenimiento: Building,
      evento: Calendar,
      info: Bell,
      warning: AlertCircle,
      success: CheckCircle2,
      error: AlertCircle
    }
    const Icon = icons[tipo as keyof typeof icons] || MessageSquare
    return <Icon className="h-4 w-4" />
  }

  const comunicadosFiltrados = comunicadosMock.filter(comunicado => {
    const matchesSearch = comunicado.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         comunicado.contenido.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesTipo = filtroTipo === 'todos' || comunicado.tipo === filtroTipo
    return matchesSearch && matchesTipo
  })

  const notificacionesFiltradas = notificacionesMock.filter(notif => {
    const matchesSearch = notif.mensaje.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesTipo = filtroTipo === 'todos' || notif.tipo === filtroTipo
    return matchesSearch && matchesTipo
  })

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Header */}
      <div className="bg-gray-800 border-b border-gray-700 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white">Comunicados y Notificaciones</h1>
            <p className="text-gray-400 mt-1">Gestión de comunicación con residentes</p>
          </div>
          <Button 
            onClick={() => setShowNewComunicado(true)}
            className="bg-blue-600 hover:bg-blue-700"
          >
            <Plus className="h-4 w-4 mr-2" />
            Nuevo Comunicado
          </Button>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* Estadísticas Rápidas */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="bg-gray-800 border-gray-700">
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-2 bg-blue-500/20 rounded-lg">
                  <MessageSquare className="h-6 w-6 text-blue-400" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-400">Total Comunicados</p>
                  <p className="text-2xl font-bold text-white">12</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-800 border-gray-700">
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-2 bg-yellow-500/20 rounded-lg">
                  <Bell className="h-6 w-6 text-yellow-400" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-400">Notificaciones Activas</p>
                  <p className="text-2xl font-bold text-white">8</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-800 border-gray-700">
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-2 bg-green-500/20 rounded-lg">
                  <Users className="h-6 w-6 text-green-400" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-400">Tasa de Lectura</p>
                  <p className="text-2xl font-bold text-white">89%</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-800 border-gray-700">
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-2 bg-red-500/20 rounded-lg">
                  <AlertCircle className="h-6 w-6 text-red-400" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-400">Urgentes Pendientes</p>
                  <p className="text-2xl font-bold text-white">2</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs y Filtros */}
        <div className="flex flex-col space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex space-x-1 bg-gray-800 p-1 rounded-lg">
              <button
                onClick={() => setActiveTab('comunicados')}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  activeTab === 'comunicados'
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-300 hover:text-white hover:bg-gray-700'
                }`}
              >
                Comunicados
              </button>
              <button
                onClick={() => setActiveTab('notificaciones')}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  activeTab === 'notificaciones'
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-300 hover:text-white hover:bg-gray-700'
                }`}
              >
                Notificaciones
              </button>
            </div>

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
                {activeTab === 'comunicados' ? (
                  <>
                    <option value="general">General</option>
                    <option value="urgente">Urgente</option>
                    <option value="mantenimiento">Mantenimiento</option>
                    <option value="evento">Evento</option>
                  </>
                ) : (
                  <>
                    <option value="info">Información</option>
                    <option value="warning">Advertencia</option>
                    <option value="success">Éxito</option>
                    <option value="error">Error</option>
                  </>
                )}
              </select>
            </div>
          </div>
        </div>

        {/* Contenido Principal */}
        {activeTab === 'comunicados' ? (
          <div className="space-y-4">
            {comunicadosFiltrados.map((comunicado) => (
              <Card key={comunicado.id} className="bg-gray-800 border-gray-700">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-3">
                      <div className={`p-2 rounded-lg ${getTipoColor(comunicado.tipo)}/20`}>
                        {getTipoIcon(comunicado.tipo)}
                      </div>
                      <div>
                        <CardTitle className="text-lg text-white">{comunicado.titulo}</CardTitle>
                        <div className="flex items-center space-x-4 mt-2">
                          <Badge className={`${getTipoColor(comunicado.tipo)} text-white`}>
                            {comunicado.tipo}
                          </Badge>
                          <span className="text-sm text-gray-400">
                            Por {comunicado.autor} • {comunicado.fecha}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm" className="text-gray-400 hover:text-red-400">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-300 mb-4">{comunicado.contenido}</p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center space-x-2">
                        <Users className="h-4 w-4 text-gray-400" />
                        <span className="text-sm text-gray-400">
                          {comunicado.leidos}/{comunicado.total} leídos
                        </span>
                      </div>
                      <div className="w-32 bg-gray-700 rounded-full h-2">
                        <div
                          className="bg-blue-500 h-2 rounded-full"
                          style={{ width: `${(comunicado.leidos / comunicado.total) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                    <Badge variant={comunicado.estado === 'publicado' ? 'default' : 'secondary'}>
                      {comunicado.estado}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {notificacionesFiltradas.map((notificacion) => (
              <Card key={notificacion.id} className={`bg-gray-800 border-gray-700 ${!notificacion.leida ? 'ring-2 ring-blue-500/50' : ''}`}>
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-3">
                      <div className={`p-2 rounded-lg ${getTipoColor(notificacion.tipo)}/20`}>
                        {getTipoIcon(notificacion.tipo)}
                      </div>
                      <div className="flex-1">
                        <p className={`text-sm ${!notificacion.leida ? 'font-semibold text-white' : 'text-gray-300'}`}>
                          {notificacion.mensaje}
                        </p>
                        <div className="flex items-center space-x-4 mt-2">
                          <span className="text-xs text-gray-400">
                            {notificacion.usuario} • {notificacion.fecha}
                          </span>
                          {!notificacion.leida && (
                            <Badge className="bg-blue-500 text-white text-xs">Nueva</Badge>
                          )}
                        </div>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white">
                      <Eye className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}