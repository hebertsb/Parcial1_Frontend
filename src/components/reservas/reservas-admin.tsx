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
    proposito: "Celebración de cumpleaños familiar - 25 años",
    asistentes: 25,
    costo: 200
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
    proposito: "Partido de fútbol entre familias del edificio",
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
    proposito: "Reunión familiar de fin de semana",
    asistentes: 15,
    costo: 120
  },
  {
    id: 4,
    espacio: "Salón de Eventos",
    solicitante: "Roberto Fernández",
    unidad: "A-505",
    fechaReserva: "2024-01-28",
    horaInicio: "19:00",
    horaFin: "23:00",
    estado: "aprobada",
    proposito: "Celebración de graduación universitaria",
    asistentes: 35,
    costo: 250
  },
  {
    id: 5,
    espacio: "Área de Parrillas",
    solicitante: "Sandra Morales",
    unidad: "B-403",
    fechaReserva: "2024-01-26",
    horaInicio: "12:00",
    horaFin: "18:00",
    estado: "pendiente",
    proposito: "Almuerzo familiar dominical",
    asistentes: 18,
    costo: 100
  },
  {
    id: 6,
    espacio: "Cancha de Básquet",
    solicitante: "Miguel Torres",
    unidad: "C-201",
    fechaReserva: "2024-01-24",
    horaInicio: "16:00",
    horaFin: "18:00",
    estado: "aprobada",
    proposito: "Entrenamiento de básquet juvenil",
    asistentes: 8,
    costo: 60
  },
  {
    id: 7,
    espacio: "Sala de Juegos",
    solicitante: "Patricia Rojas",
    unidad: "A-403",
    fechaReserva: "2024-01-27",
    horaInicio: "15:00",
    horaFin: "18:00",
    estado: "pendiente",
    proposito: "Fiesta infantil de cumpleaños",
    asistentes: 20,
    costo: 90
  },
  {
    id: 8,
    espacio: "Área de Piscina",
    solicitante: "Luis Mamani",
    unidad: "B-301",
    fechaReserva: "2024-01-29",
    horaInicio: "09:00",
    horaFin: "13:00",
    estado: "aprobada",
    proposito: "Clases de natación para niños",
    asistentes: 10,
    costo: 110
  },
  {
    id: 9,
    espacio: "Salón Multiuso",
    solicitante: "Elena Vargas",
    unidad: "C-305",
    fechaReserva: "2024-01-30",
    horaInicio: "20:00",
    horaFin: "22:30",
    estado: "pendiente",
    proposito: "Reunión de copropietarios extraordinaria",
    asistentes: 45,
    costo: 0
  },
  {
    id: 10,
    espacio: "Cancha de Fútbol",
    solicitante: "Diego Silva",
    unidad: "A-201",
    fechaReserva: "2024-01-23",
    horaInicio: "17:00",
    horaFin: "19:00",
    estado: "completada",
    proposito: "Entrenamiento de fútbol adultos",
    asistentes: 14,
    costo: 80
  },
  {
    id: 11,
    espacio: "Área de Parrillas",
    solicitante: "Carmen Jiménez",
    unidad: "B-102",
    fechaReserva: "2024-01-31",
    horaInicio: "18:00",
    horaFin: "22:00",
    estado: "pendiente",
    proposito: "Despedida de año familiar",
    asistentes: 22,
    costo: 130
  },
  {
    id: 12,
    espacio: "Sala de Reuniones",
    solicitante: "Administración",
    unidad: "N/A",
    fechaReserva: "2024-02-01",
    horaInicio: "19:00",
    horaFin: "21:00",
    estado: "aprobada",
    proposito: "Asamblea ordinaria de copropietarios",
    asistentes: 60,
    costo: 0
  }
]

export function ReservasAdmin() {
  const [searchTerm, setSearchTerm] = useState('')
  const [filtroEstado, setFiltroEstado] = useState<string>('todos')
  const [reservas, setReservas] = useState(reservasMock)
  const [showModal, setShowModal] = useState(false)
  const [selectedReserva, setSelectedReserva] = useState<Reserva | null>(null)

  const reservasFiltradas = reservas.filter(reserva => {
    const matchesSearch = reserva.espacio.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         reserva.solicitante.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         reserva.proposito.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesEstado = filtroEstado === 'todos' || reserva.estado === filtroEstado
    return matchesSearch && matchesEstado
  })

  // Función para mostrar notificaciones tipo servidor
  const showServerNotification = (message: string, type: 'success' | 'info' | 'warning' | 'error' = 'success') => {
    const colors = {
      success: 'bg-green-500',
      info: 'bg-blue-500', 
      warning: 'bg-yellow-500',
      error: 'bg-red-500'
    }
    
    const icons = {
      success: `<path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/>`,
      info: `<path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd"/>`,
      warning: `<path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd"/>`,
      error: `<path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd"/>`
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
  const handleCrearReserva = () => {
    showServerNotification('Formulario de nueva reserva cargado correctamente', 'info')
  }

  const handleAprobar = (id: number) => {
    setReservas(prev => prev.map(r => 
      r.id === id ? { ...r, estado: 'aprobada' } : r
    ))
    showServerNotification('Reserva aprobada exitosamente', 'success')
  }

  const handleRechazar = (id: number) => {
    const motivo = prompt('Motivo del rechazo:')
    if (motivo) {
      setReservas(prev => prev.map(r => 
        r.id === id ? { ...r, estado: 'rechazada' } : r
      ))
      showServerNotification(`Reserva rechazada exitosamente. Motivo: ${motivo}`, 'error')
    }
  }

  const handleVerDetalles = (reserva: Reserva) => {
    setSelectedReserva(reserva)
    setShowModal(true)
  }

  // Estadísticas dinámicas
  const stats = {
    pendientes: reservas.filter(r => r.estado === 'pendiente').length,
    aprobadas: reservas.filter(r => r.estado === 'aprobada').length,
    completadas: reservas.filter(r => r.estado === 'completada').length,
    ingresosMes: reservas
      .filter(r => r.estado === 'completada')
      .reduce((sum, r) => sum + r.costo, 0)
  }

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
        <Button onClick={handleCrearReserva} className="bg-blue-600 hover:bg-blue-700">
          <Plus className="h-4 w-4 mr-2" />
          Nueva Reserva
        </Button>
      </div>

      {/* Estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="bg-gray-800 border-gray-700 hover:bg-gray-750 transition-colors cursor-pointer" onClick={() => setFiltroEstado('todos')}>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Calendar className="h-8 w-8 text-blue-400 mr-3" />
              <div>
                <p className="text-sm font-medium text-gray-400">Reservas Este Mes</p>
                <p className="text-2xl font-bold text-white">{reservas.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-800 border-gray-700 hover:bg-gray-750 transition-colors cursor-pointer" onClick={() => setFiltroEstado('pendiente')}>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Clock className="h-8 w-8 text-yellow-400 mr-3" />
              <div>
                <p className="text-sm font-medium text-gray-400">Pendientes</p>
                <p className="text-2xl font-bold text-white">{stats.pendientes}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-800 border-gray-700 hover:bg-gray-750 transition-colors cursor-pointer" onClick={() => setFiltroEstado('aprobada')}>
          <CardContent className="p-6">
            <div className="flex items-center">
              <CheckCircle2 className="h-8 w-8 text-green-400 mr-3" />
              <div>
                <p className="text-sm font-medium text-gray-400">Aprobadas</p>
                <p className="text-2xl font-bold text-white">{stats.aprobadas}</p>
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
                <p className="text-2xl font-bold text-white">Bs {stats.ingresosMes.toLocaleString()}</p>
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