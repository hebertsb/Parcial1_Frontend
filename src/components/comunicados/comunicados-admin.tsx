"use client"

import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import {
  Plus, Search, Filter, Calendar, User, MapPin, 
  Eye, MessageSquare, Bell, CheckCircle2, Clock, AlertTriangle,
  Users, Building, Phone, Mail, Edit, Trash2
} from 'lucide-react'

interface Comunicado {
  id: number
  titulo: string
  contenido: string
  autor: string
  fechaCreacion: string
  fechaPublicacion: string
  tipo: 'informativo' | 'urgente' | 'mantenimiento' | 'evento' | 'administrativo'
  estado: 'borrador' | 'publicado' | 'archivado'
  dirigidoA: 'todos' | 'propietarios' | 'inquilinos' | 'torre_a' | 'torre_b'
  leido: number
  total: number
}

const comunicadosMock: Comunicado[] = [
  {
    id: 1,
    titulo: "Mantenimiento preventivo de ascensores - Torre A",
    contenido: "Se realizará el mantenimiento preventivo de los ascensores de la Torre A el próximo sábado 20 de enero de 8:00 AM a 12:00 PM. Durante este período los ascensores estarán fuera de servicio.",
    autor: "Administración",
    fechaCreacion: "2024-01-15",
    fechaPublicacion: "2024-01-15",
    tipo: "mantenimiento",
    estado: "publicado",
    dirigidoA: "torre_a",
    leido: 23,
    total: 45
  },
  {
    id: 2,
    titulo: "Celebración del Día del Niño - Área de Juegos",
    contenido: "¡Los invitamos a celebrar el Día del Niño! Habrá actividades recreativas, juegos y refrigerios para todos los niños del condominio.",
    autor: "Comité Social",
    fechaCreacion: "2024-01-14",
    fechaPublicacion: "2024-01-14",
    tipo: "evento",
    estado: "publicado",
    dirigidoA: "todos",
    leido: 67,
    total: 89
  },
  {
    id: 3,
    titulo: "Nuevas medidas de seguridad en el estacionamiento",
    contenido: "Se han implementado nuevas cámaras de seguridad y se requiere el uso obligatorio del sticker vehicular para acceder al estacionamiento subterráneo.",
    autor: "Jefe de Seguridad",
    fechaCreacion: "2024-01-13",
    fechaPublicacion: "2024-01-13",
    tipo: "informativo",
    estado: "publicado",
    dirigidoA: "todos",
    leido: 78,
    total: 89
  }
]

export function ComunicadosAdmin() {
  const [activeTab, setActiveTab] = useState<'comunicados' | 'notificaciones'>('comunicados')
  const [searchTerm, setSearchTerm] = useState('')
  const [filtroTipo, setFiltroTipo] = useState<string>('todos')

  const comunicadosFiltrados = comunicadosMock.filter(comunicado => {
    const matchesSearch = comunicado.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         comunicado.contenido.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesTipo = filtroTipo === 'todos' || comunicado.tipo === filtroTipo
    return matchesSearch && matchesTipo
  })

  const getTipoColor = (tipo: string) => {
    const colors = {
      informativo: 'bg-blue-500',
      urgente: 'bg-red-500',
      mantenimiento: 'bg-orange-500',
      evento: 'bg-green-500',
      administrativo: 'bg-purple-500'
    }
    return colors[tipo as keyof typeof colors] || 'bg-gray-500'
  }

  const getEstadoColor = (estado: string) => {
    const colors = {
      borrador: 'bg-yellow-500',
      publicado: 'bg-green-500',
      archivado: 'bg-gray-500'
    }
    return colors[estado as keyof typeof colors] || 'bg-gray-500'
  }

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Comunicados y Notificaciones</h1>
          <p className="text-gray-400 mt-1">Gestión de comunicación con residentes</p>
        </div>
        <Button className="bg-blue-600 hover:bg-blue-700">
          <Plus className="h-4 w-4 mr-2" />
          Nuevo Comunicado
        </Button>
      </div>

      {/* Estadísticas Rápidas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="bg-gray-800 border-gray-700">
          <CardContent className="p-6">
            <div className="flex items-center">
              <MessageSquare className="h-8 w-8 text-blue-400 mr-3" />
              <div>
                <p className="text-sm font-medium text-gray-400">Total Comunicados</p>
                <p className="text-2xl font-bold text-white">12</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-800 border-gray-700">
          <CardContent className="p-6">
            <div className="flex items-center">
              <Bell className="h-8 w-8 text-green-400 mr-3" />
              <div>
                <p className="text-sm font-medium text-gray-400">Publicados</p>
                <p className="text-2xl font-bold text-white">8</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-800 border-gray-700">
          <CardContent className="p-6">
            <div className="flex items-center">
              <Users className="h-8 w-8 text-purple-400 mr-3" />
              <div>
                <p className="text-sm font-medium text-gray-400">Alcance Total</p>
                <p className="text-2xl font-bold text-white">89</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-800 border-gray-700">
          <CardContent className="p-6">
            <div className="flex items-center">
              <CheckCircle2 className="h-8 w-8 text-emerald-400 mr-3" />
              <div>
                <p className="text-sm font-medium text-gray-400">Tasa de Lectura</p>
                <p className="text-2xl font-bold text-white">87%</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Controles */}
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
              placeholder="Buscar comunicados..."
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
            <option value="informativo">Informativos</option>
            <option value="urgente">Urgentes</option>
            <option value="mantenimiento">Mantenimiento</option>
            <option value="evento">Eventos</option>
            <option value="administrativo">Administrativos</option>
          </select>
        </div>
      </div>

      {/* Lista de Comunicados */}
      <div className="space-y-4">
        {comunicadosFiltrados.map((comunicado) => (
          <Card key={comunicado.id} className="bg-gray-800 border-gray-700">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-lg text-white mb-2">{comunicado.titulo}</CardTitle>
                  <div className="flex items-center space-x-3">
                    <Badge className={`${getTipoColor(comunicado.tipo)} text-white`}>
                      {comunicado.tipo}
                    </Badge>
                    <Badge className={`${getEstadoColor(comunicado.estado)} text-white`}>
                      {comunicado.estado}
                    </Badge>
                    <span className="text-sm text-gray-400">
                      {comunicado.fechaPublicacion}
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm text-gray-400 mb-1">
                    Leído por {comunicado.leido} de {comunicado.total}
                  </div>
                  <div className="text-sm font-semibold text-white">
                    {Math.round((comunicado.leido / comunicado.total) * 100)}%
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-gray-300 mb-4 line-clamp-2">{comunicado.contenido}</p>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4 text-sm text-gray-400">
                  <div className="flex items-center space-x-1">
                    <User className="h-4 w-4" />
                    <span>{comunicado.autor}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Building className="h-4 w-4" />
                    <span>{comunicado.dirigidoA.replace('_', ' ')}</span>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Button variant="outline" size="sm" className="border-gray-600 text-gray-300 hover:bg-gray-700">
                    <Eye className="h-4 w-4 mr-1" />
                    Ver
                  </Button>
                  <Button variant="outline" size="sm" className="border-gray-600 text-gray-300 hover:bg-gray-700">
                    <Edit className="h-4 w-4 mr-1" />
                    Editar
                  </Button>
                  <Button variant="outline" size="sm" className="border-gray-600 text-red-400 hover:bg-red-900/20">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}