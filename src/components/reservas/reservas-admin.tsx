"use client"

import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import {
  Plus, Search, Calendar, MapPin, Users, Clock, CheckCircle2,
  AlertTriangle, User, Building
} from 'lucide-react'

interface Reserva {
  id: number
  espacio: string
  solicitante: string
  unidad: string
  fechaReserva: string
  horaInicio: string
  horaFin: string
  estado: 'pendiente' | 'aprobada' | 'rechazada' | 'completada'
  proposito: string
  asistentes: number
  costo: number
}

const reservasMock: Reserva[] = [
  {
    id: 1,
    espacio: "Salón de Eventos",
    solicitante: "María González",
    unidad: "A-301",
    fechaReserva: "2024-01-25",
    horaInicio: "18:00",
    horaFin: "22:00",
    estado: "aprobada",
    proposito: "Celebración de cumpleaños",
    asistentes: 25,
    costo: 150
  },
  {
    id: 2,
    espacio: "Cancha de Fútbol",
    solicitante: "Carlos Rodríguez",
    unidad: "B-205",
    fechaReserva: "2024-01-22",
    horaInicio: "15:00",
    horaFin: "17:00",
    estado: "pendiente",
    proposito: "Partido familiar",
    asistentes: 12,
    costo: 80
  },
  {
    id: 3,
    espacio: "Área de Piscina",
    solicitante: "Ana López",
    unidad: "C-102",
    fechaReserva: "2024-01-20",
    horaInicio: "10:00",
    horaFin: "14:00",
    estado: "completada",
    proposito: "Reunión familiar",
    asistentes: 15,
    costo: 120
  }
]

export function ReservasAdmin() {
  const [searchTerm, setSearchTerm] = useState('')
  const [filtroEstado, setFiltroEstado] = useState<string>('todos')

  const reservasFiltradas = reservasMock.filter(reserva => {
    const matchesSearch = reserva.espacio.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         reserva.solicitante.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesEstado = filtroEstado === 'todos' || reserva.estado === filtroEstado
    return matchesSearch && matchesEstado
  })

  const getEstadoColor = (estado: string) => {
    const colors = {
      pendiente: 'bg-yellow-500',
      aprobada: 'bg-green-500',
      rechazada: 'bg-red-500',
      completada: 'bg-blue-500'
    }
    return colors[estado as keyof typeof colors] || 'bg-gray-500'
  }

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Reservas de Espacios Comunes</h1>
          <p className="text-gray-400 mt-1">Gestión y calendario de espacios compartidos</p>
        </div>
        <Button className="bg-blue-600 hover:bg-blue-700">
          <Plus className="h-4 w-4 mr-2" />
          Nueva Reserva
        </Button>
      </div>

      {/* Estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="bg-gray-800 border-gray-700">
          <CardContent className="p-6">
            <div className="flex items-center">
              <Calendar className="h-8 w-8 text-blue-400 mr-3" />
              <div>
                <p className="text-sm font-medium text-gray-400">Reservas Este Mes</p>
                <p className="text-2xl font-bold text-white">18</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-800 border-gray-700">
          <CardContent className="p-6">
            <div className="flex items-center">
              <Clock className="h-8 w-8 text-yellow-400 mr-3" />
              <div>
                <p className="text-sm font-medium text-gray-400">Pendientes</p>
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
                <p className="text-sm font-medium text-gray-400">Aprobadas</p>
                <p className="text-2xl font-bold text-white">12</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-800 border-gray-700">
          <CardContent className="p-6">
            <div className="flex items-center">
              <Building className="h-8 w-8 text-purple-400 mr-3" />
              <div>
                <p className="text-sm font-medium text-gray-400">Ingresos</p>
                <p className="text-2xl font-bold text-white">Bs 2,450</p>
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
              placeholder="Buscar reservas..."
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
            <option value="aprobada">Aprobadas</option>
            <option value="rechazada">Rechazadas</option>
            <option value="completada">Completadas</option>
          </select>
        </div>
      </div>

      {/* Lista de Reservas */}
      <div className="space-y-4">
        {reservasFiltradas.map((reserva) => (
          <Card key={reserva.id} className="bg-gray-800 border-gray-700">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-lg text-white">{reserva.espacio}</CardTitle>
                  <div className="flex items-center space-x-3 mt-2">
                    <Badge className={`${getEstadoColor(reserva.estado)} text-white`}>
                      {reserva.estado}
                    </Badge>
                    <span className="text-sm text-gray-400">{reserva.fechaReserva}</span>
                    <span className="text-sm text-gray-400">
                      {reserva.horaInicio} - {reserva.horaFin}
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold text-white">Bs {reserva.costo}</p>
                  <p className="text-sm text-gray-400">{reserva.asistentes} asistentes</p>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <User className="h-4 w-4 text-gray-400" />
                    <span className="text-sm text-gray-300">{reserva.solicitante}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Building className="h-4 w-4 text-gray-400" />
                    <span className="text-sm text-gray-300">Unidad {reserva.unidad}</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Users className="h-4 w-4 text-gray-400" />
                    <span className="text-sm text-gray-300">{reserva.asistentes} personas</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <MapPin className="h-4 w-4 text-gray-400" />
                    <span className="text-sm text-gray-300">{reserva.proposito}</span>
                  </div>
                </div>
              </div>

              <div className="flex justify-end space-x-2">
                <Button variant="outline" size="sm" className="border-gray-600 text-gray-300 hover:bg-gray-700">
                  Ver Detalles
                </Button>
                {reserva.estado === 'pendiente' && (
                  <>
                    <Button size="sm" className="bg-green-600 hover:bg-green-700">
                      Aprobar
                    </Button>
                    <Button size="sm" className="bg-red-600 hover:bg-red-700">
                      Rechazar
                    </Button>
                  </>
                )}
                {reserva.estado === 'aprobada' && (
                  <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                    Marcar Completada
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