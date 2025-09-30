"use client"

import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import {
  BarChart3, Download, Calendar, TrendingUp, Users, Building,
  DollarSign, FileText, PieChart, LineChart, Filter, Search,
  Printer, Mail, AlertTriangle, CheckCircle2
} from 'lucide-react'

interface Reporte {
  id: number
  nombre: string
  tipo: 'financiero' | 'ocupacion' | 'mantenimiento' | 'seguridad' | 'usuarios'
  descripcion: string
  fechaGeneracion: string
  generadoPor: string
  estado: 'generado' | 'pendiente' | 'error'
  tamano: string
  formato: 'PDF' | 'Excel' | 'CSV'
}

const reportesMock: Reporte[] = [
  {
    id: 1,
    nombre: "Reporte Financiero Mensual - Enero 2024",
    tipo: "financiero",
    descripcion: "Estado financiero completo del condominio incluyendo ingresos, gastos y pendientes",
    fechaGeneracion: "2024-01-31",
    generadoPor: "Sistema Automático",
    estado: "generado",
    tamano: "2.4 MB",
    formato: "PDF"
  },
  {
    id: 2,
    nombre: "Ocupación por Torres - Q4 2023",
    tipo: "ocupacion",
    descripcion: "Análisis de ocupación de unidades por torre y tipo de residencia",
    fechaGeneracion: "2024-01-15",
    generadoPor: "María González - Admin",
    estado: "generado",
    tamano: "1.8 MB",
    formato: "Excel"
  },
  {
    id: 3,
    nombre: "Mantenimiento y Reparaciones - Diciembre 2023",
    tipo: "mantenimiento",
    descripcion: "Resumen de solicitudes de mantenimiento, costos y tiempos de resolución",
    fechaGeneracion: "2024-01-10",
    generadoPor: "Carlos Mamani - Supervisor",
    estado: "generado",
    tamano: "1.2 MB",
    formato: "PDF"
  },
  {
    id: 4,
    nombre: "Incidentes de Seguridad - Enero 2024",
    tipo: "seguridad",
    descripcion: "Registro de eventos de seguridad, accesos y alertas del período",
    fechaGeneracion: "2024-01-08",
    generadoPor: "Roberto Silva - Seguridad",
    estado: "pendiente",
    tamano: "-",
    formato: "PDF"
  },
  {
    id: 5,
    nombre: "Registro de Usuarios - Actualizado",
    tipo: "usuarios",
    descripcion: "Base de datos completa de propietarios, inquilinos y contactos",
    fechaGeneracion: "2024-01-05",
    generadoPor: "Sistema Automático",
    estado: "generado",
    tamano: "856 KB",
    formato: "CSV"
  }
]

export function ReportesAdmin() {
  const [filtroTipo, setFiltroTipo] = useState<string>('todos')
  const [searchTerm, setSearchTerm] = useState('')

  const reportesFiltrados = reportesMock.filter(reporte => {
    const matchesSearch = reporte.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         reporte.descripcion.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesTipo = filtroTipo === 'todos' || reporte.tipo === filtroTipo
    return matchesSearch && matchesTipo
  })

  const getTipoColor = (tipo: string) => {
    const colors = {
      financiero: 'bg-green-500',
      ocupacion: 'bg-blue-500',
      mantenimiento: 'bg-orange-500',
      seguridad: 'bg-red-500',
      usuarios: 'bg-purple-500'
    }
    return colors[tipo as keyof typeof colors] || 'bg-gray-500'
  }

  const getEstadoColor = (estado: string) => {
    const colors = {
      generado: 'bg-green-500',
      pendiente: 'bg-yellow-500',
      error: 'bg-red-500'
    }
    return colors[estado as keyof typeof colors] || 'bg-gray-500'
  }

  const getTipoIcon = (tipo: string) => {
    const icons = {
      financiero: DollarSign,
      ocupacion: Building,
      mantenimiento: AlertTriangle,
      seguridad: CheckCircle2,
      usuarios: Users
    }
    const Icon = icons[tipo as keyof typeof icons] || FileText
    return Icon
  }

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Reportes</h1>
          <p className="text-gray-400 mt-1">Generación y gestión de reportes del sistema</p>
        </div>
        <Button className="bg-blue-600 hover:bg-blue-700">
          <FileText className="h-4 w-4 mr-2" />
          Generar Nuevo Reporte
        </Button>
      </div>

      {/* Estadísticas Rápidas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="bg-gray-800 border-gray-700">
          <CardContent className="p-6">
            <div className="flex items-center">
              <BarChart3 className="h-8 w-8 text-blue-400 mr-3" />
              <div>
                <p className="text-sm font-medium text-gray-400">Reportes Este Mes</p>
                <p className="text-2xl font-bold text-white">12</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-800 border-gray-700">
          <CardContent className="p-6">
            <div className="flex items-center">
              <Download className="h-8 w-8 text-green-400 mr-3" />
              <div>
                <p className="text-sm font-medium text-gray-400">Descargas</p>
                <p className="text-2xl font-bold text-white">47</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-800 border-gray-700">
          <CardContent className="p-6">
            <div className="flex items-center">
              <TrendingUp className="h-8 w-8 text-purple-400 mr-3" />
              <div>
                <p className="text-sm font-medium text-gray-400">Automáticos</p>
                <p className="text-2xl font-bold text-white">8</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-800 border-gray-700">
          <CardContent className="p-6">
            <div className="flex items-center">
              <Calendar className="h-8 w-8 text-emerald-400 mr-3" />
              <div>
                <p className="text-sm font-medium text-gray-400">Programados</p>
                <p className="text-2xl font-bold text-white">5</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Acciones Rápidas */}
      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white">Generar Reportes Rápidos</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button variant="outline" className="border-gray-600 text-gray-300 hover:bg-gray-700 justify-start">
              <DollarSign className="h-4 w-4 mr-2" />
              Reporte Financiero
            </Button>
            <Button variant="outline" className="border-gray-600 text-gray-300 hover:bg-gray-700 justify-start">
              <Building className="h-4 w-4 mr-2" />
              Estado de Ocupación
            </Button>
            <Button variant="outline" className="border-gray-600 text-gray-300 hover:bg-gray-700 justify-start">
              <AlertTriangle className="h-4 w-4 mr-2" />
              Mantenimiento
            </Button>
            <Button variant="outline" className="border-gray-600 text-gray-300 hover:bg-gray-700 justify-start">
              <CheckCircle2 className="h-4 w-4 mr-2" />
              Eventos de Seguridad
            </Button>
            <Button variant="outline" className="border-gray-600 text-gray-300 hover:bg-gray-700 justify-start">
              <Users className="h-4 w-4 mr-2" />
              Registro de Usuarios
            </Button>
            <Button variant="outline" className="border-gray-600 text-gray-300 hover:bg-gray-700 justify-start">
              <BarChart3 className="h-4 w-4 mr-2" />
              Reporte Personalizado
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Controles de búsqueda */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Buscar reportes..."
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
            <option value="financiero">Financieros</option>
            <option value="ocupacion">Ocupación</option>
            <option value="mantenimiento">Mantenimiento</option>
            <option value="seguridad">Seguridad</option>
            <option value="usuarios">Usuarios</option>
          </select>
        </div>
      </div>

      {/* Lista de Reportes */}
      <div className="space-y-4">
        {reportesFiltrados.map((reporte) => {
          const TipoIcon = getTipoIcon(reporte.tipo)
          return (
            <Card key={reporte.id} className="bg-gray-800 border-gray-700">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-3">
                    <div className="p-2 bg-gray-700 rounded-lg">
                      <TipoIcon className="h-6 w-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <CardTitle className="text-lg text-white mb-2">{reporte.nombre}</CardTitle>
                      <div className="flex items-center space-x-3">
                        <Badge className={`${getTipoColor(reporte.tipo)} text-white`}>
                          {reporte.tipo}
                        </Badge>
                        <Badge className={`${getEstadoColor(reporte.estado)} text-white`}>
                          {reporte.estado}
                        </Badge>
                        <span className="text-sm text-gray-400">
                          {reporte.fechaGeneracion}
                        </span>
                        <span className="text-sm text-gray-400">
                          {reporte.formato} • {reporte.tamano}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-gray-300 mb-4">{reporte.descripcion}</p>
                
                <div className="flex items-center justify-between">
                  <div className="text-sm text-gray-400">
                    Generado por: {reporte.generadoPor}
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    {reporte.estado === 'generado' && (
                      <>
                        <Button variant="outline" size="sm" className="border-gray-600 text-gray-300 hover:bg-gray-700">
                          <Download className="h-4 w-4 mr-1" />
                          Descargar
                        </Button>
                        <Button variant="outline" size="sm" className="border-gray-600 text-gray-300 hover:bg-gray-700">
                          <Mail className="h-4 w-4 mr-1" />
                          Enviar
                        </Button>
                        <Button variant="outline" size="sm" className="border-gray-600 text-gray-300 hover:bg-gray-700">
                          <Printer className="h-4 w-4" />
                        </Button>
                      </>
                    )}
                    {reporte.estado === 'pendiente' && (
                      <Button variant="outline" size="sm" className="border-yellow-600 text-yellow-400 hover:bg-yellow-900/20">
                        Procesando...
                      </Button>
                    )}
                    {reporte.estado === 'error' && (
                      <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                        Regenerar
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}