"use client"

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Calendar } from '@/components/ui/calendar'
import {
  ArrowLeft, Calendar as CalendarIcon, Clock, MapPin, Users, 
  CheckCircle2, XCircle, AlertCircle, Plus, Filter, Search,
  User, Phone, Mail, Building
} from 'lucide-react'

interface Reserva {
  id: number
  espacio: string
  solicitante: string
  fecha: string
  horaInicio: string
  horaFin: string
  estado: 'confirmada' | 'pendiente' | 'cancelada' | 'completada'
  unidad: string
  telefono: string
  email: string
  proposito: string
  cantidadPersonas: number
  costo: number
}

interface EspacioComun {
  id: number
  nombre: string
  capacidad: number
  disponible: boolean
  tarifaPorHora: number
  equipamiento: string[]
  imagen: string
}

const espaciosComunesMock: EspacioComun[] = [
  {
    id: 1,
    nombre: "Salón Comunal Principal",
    capacidad: 80,
    disponible: true,
    tarifaPorHora: 150,
    equipamiento: ["Sonido", "Proyector", "Cocina", "Mesas", "Sillas"],
    imagen: "salon-principal.jpg"
  },
  {
    id: 2,
    nombre: "Salón de Juegos",
    capacidad: 30,
    disponible: true,
    tarifaPorHora: 80,
    equipamiento: ["Mesa de Pool", "Futbolín", "TV", "PlayStation"],
    imagen: "salon-juegos.jpg"
  },
  {
    id: 3,
    nombre: "Área de BBQ",
    capacidad: 50,
    disponible: false,
    tarifaPorHora: 120,
    equipamiento: ["Parrillas", "Mesas", "Lavaplatos", "Refrigerador"],
    imagen: "area-bbq.jpg"
  },
  {
    id: 4,
    nombre: "Cancha Múltiple",
    capacidad: 20,
    disponible: true,
    tarifaPorHora: 100,
    equipamiento: ["Arcos", "Canasta", "Red de Volleyball", "Iluminación"],
    imagen: "cancha-multiple.jpg"
  }
]

const reservasMock: Reserva[] = [
  {
    id: 1,
    espacio: "Salón Comunal Principal",
    solicitante: "María García",
    fecha: "2024-01-20",
    horaInicio: "18:00",
    horaFin: "22:00",
    estado: "confirmada",
    unidad: "A-301",
    telefono: "591-70123456",
    email: "maria.garcia@email.com",
    proposito: "Cumpleaños familiar",
    cantidadPersonas: 45,
    costo: 600
  },
  {
    id: 2,
    espacio: "Área de BBQ",
    solicitante: "Carlos Mendoza",
    fecha: "2024-01-22",
    horaInicio: "12:00",
    horaFin: "16:00",
    estado: "pendiente",
    unidad: "B-205",
    telefono: "591-78987654",
    email: "carlos.mendoza@email.com",
    proposito: "Reunión familiar",
    cantidadPersonas: 25,
    costo: 480
  },
  {
    id: 3,
    espacio: "Cancha Múltiple",
    solicitante: "Ana López",
    fecha: "2024-01-18",
    horaInicio: "16:00",
    horaFin: "18:00",
    estado: "completada",
    unidad: "A-102",
    telefono: "591-65432109",
    email: "ana.lopez@email.com",
    proposito: "Torneo de volleyball",
    cantidadPersonas: 16,
    costo: 200
  }
]

export function ReservasEspaciosComunes() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState<'reservas' | 'espacios' | 'calendario'>('reservas')
  const [searchTerm, setSearchTerm] = useState('')
  const [filtroEstado, setFiltroEstado] = useState<string>('todos')
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date())
  const [notificacion, setNotificacion] = useState<{tipo: 'success' | 'error' | 'info'; mensaje: string} | null>(null)

  // Función para mostrar notificaciones del servidor
  const showServerNotification = (tipo: 'success' | 'error' | 'info', mensaje: string) => {
    setNotificacion({ tipo, mensaje })
    setTimeout(() => setNotificacion(null), 4000)
  }

  // Funciones para simular acciones del servidor
  const confirmarReserva = (id: number, espacio: string) => {
    showServerNotification('success', `Sistema CondoManager: Reserva confirmada para "${espacio}". Código de reserva: #RSV-2024-${id.toString().padStart(3, '0')}`)
  }

  const cancelarReserva = (id: number, espacio: string) => {
    showServerNotification('info', `Sistema CondoManager: Reserva de "${espacio}" cancelada. Depósito reembolsado en 24-48 horas`)
  }

  const crearNuevaReserva = () => {
    showServerNotification('success', 'Sistema CondoManager: Nueva reserva registrada exitosamente. Confirmación enviada por email')
  }

  // Navigation handled by sidebar
  const handleVolver = () => {
    router.back()
  }

  const getEstadoColor = (estado: string) => {
    const colors = {
      confirmada: 'bg-green-500',
      pendiente: 'bg-yellow-500',
      cancelada: 'bg-red-500',
      completada: 'bg-blue-500'
    }
    return colors[estado as keyof typeof colors] || 'bg-gray-500'
  }

  const getEstadoIcon = (estado: string) => {
    const icons = {
      confirmada: CheckCircle2,
      pendiente: Clock,
      cancelada: XCircle,
      completada: CheckCircle2
    }
    const Icon = icons[estado as keyof typeof icons] || AlertCircle
    return <Icon className="h-4 w-4" />
  }

  const reservasFiltradas = reservasMock.filter(reserva => {
    const matchesSearch = reserva.espacio.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         reserva.solicitante.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesEstado = filtroEstado === 'todos' || reserva.estado === filtroEstado
    return matchesSearch && matchesEstado
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
              <h1 className="text-2xl font-bold text-white">Reservas de Espacios Comunes</h1>
              <p className="text-gray-400 mt-1">Gestión de reservas y espacios comunitarios</p>
            </div>
          </div>
          <Button className="bg-blue-600 hover:bg-blue-700">
            <Plus className="h-4 w-4 mr-2" />
            Nueva Reserva
          </Button>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* Estadísticas Rápidas */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="bg-gray-800 border-gray-700">
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-2 bg-green-500/20 rounded-lg">
                  <CheckCircle2 className="h-6 w-6 text-green-400" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-400">Reservas Confirmadas</p>
                  <p className="text-2xl font-bold text-white">8</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-800 border-gray-700">
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-2 bg-yellow-500/20 rounded-lg">
                  <Clock className="h-6 w-6 text-yellow-400" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-400">Pendientes</p>
                  <p className="text-2xl font-bold text-white">3</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-800 border-gray-700">
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-2 bg-blue-500/20 rounded-lg">
                  <MapPin className="h-6 w-6 text-blue-400" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-400">Espacios Disponibles</p>
                  <p className="text-2xl font-bold text-white">3/4</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-800 border-gray-700">
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-2 bg-purple-500/20 rounded-lg">
                  <Users className="h-6 w-6 text-purple-400" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-400">Ingresos Este Mes</p>
                  <p className="text-2xl font-bold text-white">Bs 2,850</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <div className="flex items-center justify-between">
          <div className="flex space-x-1 bg-gray-800 p-1 rounded-lg">
            <button
              onClick={() => setActiveTab('reservas')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                activeTab === 'reservas'
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-300 hover:text-white hover:bg-gray-700'
              }`}
            >
              Reservas
            </button>
            <button
              onClick={() => setActiveTab('espacios')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                activeTab === 'espacios'
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-300 hover:text-white hover:bg-gray-700'
              }`}
            >
              Espacios
            </button>
            <button
              onClick={() => setActiveTab('calendario')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                activeTab === 'calendario'
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-300 hover:text-white hover:bg-gray-700'
              }`}
            >
              Calendario
            </button>
          </div>

          {activeTab === 'reservas' && (
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
                <option value="confirmada">Confirmadas</option>
                <option value="pendiente">Pendientes</option>
                <option value="completada">Completadas</option>
                <option value="cancelada">Canceladas</option>
              </select>
            </div>
          )}
        </div>

        {/* Contenido Principal */}
        {activeTab === 'reservas' && (
          <div className="space-y-4">
            {reservasFiltradas.map((reserva) => (
              <Card key={reserva.id} className="bg-gray-800 border-gray-700">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-3">
                      <div className={`p-2 rounded-lg ${getEstadoColor(reserva.estado)}/20`}>
                        {getEstadoIcon(reserva.estado)}
                      </div>
                      <div>
                        <CardTitle className="text-lg text-white">{reserva.espacio}</CardTitle>
                        <div className="flex items-center space-x-4 mt-2">
                          <Badge className={`${getEstadoColor(reserva.estado)} text-white`}>
                            {reserva.estado}
                          </Badge>
                          <span className="text-sm text-gray-400">
                            {reserva.fecha} • {reserva.horaInicio} - {reserva.horaFin}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-white">Bs {reserva.costo}</p>
                      <p className="text-sm text-gray-400">{reserva.cantidadPersonas} personas</p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <User className="h-4 w-4 text-gray-400" />
                        <span className="text-sm text-gray-300">{reserva.solicitante}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Building className="h-4 w-4 text-gray-400" />
                        <span className="text-sm text-gray-300">Unidad {reserva.unidad}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Phone className="h-4 w-4 text-gray-400" />
                        <span className="text-sm text-gray-300">{reserva.telefono}</span>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <Mail className="h-4 w-4 text-gray-400" />
                        <span className="text-sm text-gray-300">{reserva.email}</span>
                      </div>
                      <div className="flex items-start space-x-2">
                        <AlertCircle className="h-4 w-4 text-gray-400 mt-0.5" />
                        <span className="text-sm text-gray-300">{reserva.proposito}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex justify-end space-x-2 mt-4">
                    <Button variant="outline" size="sm" className="border-gray-600 text-gray-300 hover:bg-gray-700">
                      Ver Detalles
                    </Button>
                    {reserva.estado === 'pendiente' && (
                      <>
                        <Button size="sm" className="bg-green-600 hover:bg-green-700">
                          Aprobar
                        </Button>
                        <Button variant="outline" size="sm" className="border-red-600 text-red-400 hover:bg-red-600 hover:text-white">
                          Rechazar
                        </Button>
                      </>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {activeTab === 'espacios' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {espaciosComunesMock.map((espacio) => (
              <Card key={espacio.id} className="bg-gray-800 border-gray-700">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-lg text-white">{espacio.nombre}</CardTitle>
                      <div className="flex items-center space-x-4 mt-2">
                        <Badge className={espacio.disponible ? 'bg-green-500' : 'bg-red-500'}>
                          {espacio.disponible ? 'Disponible' : 'No disponible'}
                        </Badge>
                        <span className="text-sm text-gray-400">
                          Capacidad: {espacio.capacidad} personas
                        </span>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-white">Bs {espacio.tarifaPorHora}/h</p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm font-medium text-gray-400 mb-2">Equipamiento disponible:</p>
                      <div className="flex flex-wrap gap-2">
                        {espacio.equipamiento.map((item, index) => (
                          <Badge key={index} variant="secondary" className="bg-gray-700 text-gray-300">
                            {item}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <div className="flex justify-end space-x-2">
                      <Button variant="outline" size="sm" className="border-gray-600 text-gray-300 hover:bg-gray-700">
                        Ver Calendario
                      </Button>
                      <Button size="sm" className="bg-blue-600 hover:bg-blue-700" disabled={!espacio.disponible}>
                        Reservar
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {activeTab === 'calendario' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white">Seleccionar Fecha</CardTitle>
              </CardHeader>
              <CardContent>
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={setSelectedDate}
                  className="rounded-md border-gray-700"
                />
              </CardContent>
            </Card>
            
            <Card className="lg:col-span-2 bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white">
                  Reservas del {selectedDate?.toLocaleDateString('es-ES')}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {reservasMock.filter(r => r.fecha === selectedDate?.toISOString().split('T')[0]).length > 0 ? (
                    reservasMock
                      .filter(r => r.fecha === selectedDate?.toISOString().split('T')[0])
                      .map((reserva) => (
                        <div
                          key={reserva.id}
                          className="flex items-center justify-between p-4 bg-gray-700 rounded-lg"
                        >
                          <div>
                            <p className="font-medium text-white">{reserva.espacio}</p>
                            <p className="text-sm text-gray-400">
                              {reserva.horaInicio} - {reserva.horaFin} • {reserva.solicitante}
                            </p>
                          </div>
                          <Badge className={`${getEstadoColor(reserva.estado)} text-white`}>
                            {reserva.estado}
                          </Badge>
                        </div>
                      ))
                  ) : (
                    <div className="text-center py-8">
                      <CalendarIcon className="h-12 w-12 text-gray-500 mx-auto mb-4" />
                      <p className="text-gray-400">No hay reservas para esta fecha</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  )
}