"use client"

import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  Home, 
  Calendar,
  Filter,
  Download,
  Plus,
  MoreHorizontal,
  Search
} from 'lucide-react'

// Datos mock para las finanzas de viviendas
const mockFinanzasData = {
  resumen: {
    ingresosMes: 18500,
    gastosMes: 8200,
    balance: 10300,
    pagosPendientes: 3400,
    totalUnidades: 26,
    unidadesPagadas: 22,
    unidadesPendientes: 4
  },
  transacciones: [
    {
      id: 1,
      concepto: "Cuota de Mantenimiento - Enero",
      unidad: "A-101",
      propietario: "María González",
      monto: 450,
      fecha: "05/01/2024",
      estado: "pagado",
      metodo: "Transferencia"
    },
    {
      id: 2,
      concepto: "Cuota de Mantenimiento - Enero", 
      unidad: "A-102",
      propietario: "Juan Pérez",
      monto: 450,
      fecha: "08/01/2024",
      estado: "pagado",
      metodo: "Efectivo"
    },
    {
      id: 3,
      concepto: "Cuota de Mantenimiento - Enero",
      unidad: "B-201",
      propietario: "Ana Rodríguez",
      monto: 450,
      fecha: "12/01/2024",
      estado: "pendiente",
      metodo: "N/A"
    },
    {
      id: 4,
      concepto: "Multa por Ruido Excesivo",
      unidad: "B-203",
      propietario: "Carlos Silva",
      monto: 150,
      fecha: "15/01/2024",
      estado: "pendiente",
      metodo: "N/A"
    },
    {
      id: 5,
      concepto: "Cuota Extraordinaria - Reparaciones",
      unidad: "A-103",
      propietario: "Laura Mendoza",
      monto: 800,
      fecha: "18/01/2024",
      estado: "pagado",
      metodo: "QR"
    },
    {
      id: 6,
      concepto: "Cuota de Mantenimiento - Enero",
      unidad: "C-301",
      propietario: "Roberto Vega",
      monto: 450,
      fecha: "20/01/2024",
      estado: "pagado",
      metodo: "Transferencia"
    },
    {
      id: 7,
      concepto: "Servicio de Limpieza Adicional",
      unidad: "A-104",
      propietario: "Patricia Morales",
      monto: 200,
      fecha: "22/01/2024",
      estado: "pendiente",
      metodo: "N/A"
    },
    {
      id: 8,
      concepto: "Cuota de Seguridad - Enero",
      unidad: "B-202",
      propietario: "Miguel Torres",
      monto: 300,
      fecha: "25/01/2024",
      estado: "pagado",
      metodo: "Efectivo"
    }
  ]
}

export function FinanzasViviendas() {
  const [filtroEstado, setFiltroEstado] = useState<'todos' | 'pagado' | 'pendiente'>('todos')
  const [busqueda, setBusqueda] = useState('')

  const transaccionesFiltradas = mockFinanzasData.transacciones.filter(transaccion => {
    const coincideBusqueda = transaccion.concepto.toLowerCase().includes(busqueda.toLowerCase()) ||
                            transaccion.unidad.toLowerCase().includes(busqueda.toLowerCase()) ||
                            transaccion.propietario.toLowerCase().includes(busqueda.toLowerCase())
    
    const coincideEstado = filtroEstado === 'todos' || transaccion.estado === filtroEstado
    
    return coincideBusqueda && coincideEstado
  })

  const formatearMonto = (monto: number) => {
    return `Bs ${monto.toLocaleString('es-BO')}`
  }

  const obtenerColorEstado = (estado: string) => {
    switch (estado) {
      case 'pagado':
        return 'bg-green-100 text-green-800 border-green-200'
      case 'pendiente':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Header */}
      <div className="bg-gray-800 shadow-lg border-b border-gray-700">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-white">Finanzas</h1>
              <p className="text-gray-300">Gestión financiera de Residencial Villa Esperanza</p>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-8 space-y-8">
        {/* Tarjetas de Resumen */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="bg-gray-800 border-gray-700">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-400">Ingresos del Mes</p>
                  <p className="text-2xl font-bold text-white">{formatearMonto(mockFinanzasData.resumen.ingresosMes)}</p>
                  <p className="text-xs text-green-600 flex items-center mt-1">
                    <TrendingUp className="h-3 w-3 mr-1" />
                    +12% vs mes anterior
                  </p>
                </div>
                <div className="h-8 w-8 bg-green-100 rounded-lg flex items-center justify-center">
                  <DollarSign className="h-4 w-4 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-800 border-gray-700">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-400">Gastos del Mes</p>
                  <p className="text-2xl font-bold text-white">{formatearMonto(mockFinanzasData.resumen.gastosMes)}</p>
                  <p className="text-xs text-red-600 flex items-center mt-1">
                    <TrendingUp className="h-3 w-3 mr-1" />
                    +8% vs mes anterior
                  </p>
                </div>
                <div className="h-8 w-8 bg-red-100 rounded-lg flex items-center justify-center">
                  <TrendingDown className="h-4 w-4 text-red-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-800 border-gray-700">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-400">Balance</p>
                  <p className="text-2xl font-bold text-white">{formatearMonto(mockFinanzasData.resumen.balance)}</p>
                  <p className="text-xs text-green-600">Positivo</p>
                </div>
                <div className="h-8 w-8 bg-blue-100 rounded-lg flex items-center justify-center">
                  <TrendingUp className="h-4 w-4 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-800 border-gray-700">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-400">Pagos Pendientes</p>
                  <p className="text-2xl font-bold text-white">{formatearMonto(mockFinanzasData.resumen.pagosPendientes)}</p>
                  <p className="text-xs text-orange-600">{mockFinanzasData.resumen.unidadesPendientes} viviendas</p>
                </div>
                <div className="h-8 w-8 bg-orange-100 rounded-lg flex items-center justify-center">
                  <Calendar className="h-4 w-4 text-orange-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Estadísticas de Viviendas */}
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-white">
              <Home className="h-5 w-5" />
              Estado de Pagos por Vivienda
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center p-4 bg-green-900/50 rounded-lg border border-green-700">
                <div className="text-2xl font-bold text-green-400">{mockFinanzasData.resumen.unidadesPagadas}</div>
                <div className="text-sm text-green-300">Viviendas al Día</div>
                <div className="text-xs text-green-400 mt-1">85% del total</div>
              </div>
              <div className="text-center p-4 bg-orange-900/50 rounded-lg border border-orange-700">
                <div className="text-2xl font-bold text-orange-400">{mockFinanzasData.resumen.unidadesPendientes}</div>
                <div className="text-sm text-orange-300">Viviendas Pendientes</div>
                <div className="text-xs text-orange-400 mt-1">15% del total</div>
              </div>
              <div className="text-center p-4 bg-blue-900/50 rounded-lg border border-blue-700">
                <div className="text-2xl font-bold text-blue-400">{mockFinanzasData.resumen.totalUnidades}</div>
                <div className="text-sm text-blue-300">Total Viviendas</div>
                <div className="text-xs text-blue-400 mt-1">Villa Esperanza</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Transacciones */}
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-white">Transacciones Recientes</CardTitle>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm">
                  <Download className="h-4 w-4 mr-2" />
                  Exportar
                </Button>
                <Button size="sm">
                  <Plus className="h-4 w-4 mr-2" />
                  Nueva Transacción
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {/* Filtros */}
            <div className="flex items-center gap-4 mb-6">
              <div className="relative flex-1 max-w-sm">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Buscar transacciones..."
                  value={busqueda}
                  onChange={(e) => setBusqueda(e.target.value)}
                  className="pl-10"
                />
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant={filtroEstado === 'todos' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setFiltroEstado('todos')}
                >
                  Todos
                </Button>
                <Button
                  variant={filtroEstado === 'pagado' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setFiltroEstado('pagado')}
                >
                  Pagados
                </Button>
                <Button
                  variant={filtroEstado === 'pendiente' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setFiltroEstado('pendiente')}
                >
                  Pendientes
                </Button>
              </div>
            </div>

            {/* Tabla de Transacciones */}
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-600">
                    <th className="text-left py-3 px-4 font-medium text-gray-300">Concepto</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-300">Vivienda</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-300">Propietario</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-300">Monto</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-300">Fecha</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-300">Estado</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-300">Método</th>
                    <th className="text-center py-3 px-4 font-medium text-gray-300">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {transaccionesFiltradas.map((transaccion) => (
                    <tr key={transaccion.id} className="border-b border-gray-700 hover:bg-gray-700/50">
                      <td className="py-4 px-4">
                        <div className="font-medium text-white">{transaccion.concepto}</div>
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-2">
                          <Home className="h-4 w-4 text-gray-400" />
                          <span className="font-medium">{transaccion.unidad}</span>
                        </div>
                      </td>
                      <td className="py-4 px-4 text-gray-300">{transaccion.propietario}</td>
                      <td className="py-4 px-4">
                        <span className="font-semibold text-white">{formatearMonto(transaccion.monto)}</span>
                      </td>
                      <td className="py-4 px-4 text-gray-300">{transaccion.fecha}</td>
                      <td className="py-4 px-4">
                        <Badge className={`${obtenerColorEstado(transaccion.estado)} border`}>
                          {transaccion.estado === 'pagado' ? 'Pagado' : 'Pendiente'}
                        </Badge>
                      </td>
                      <td className="py-4 px-4 text-gray-300">{transaccion.metodo}</td>
                      <td className="py-4 px-4 text-center">
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {transaccionesFiltradas.length === 0 && (
              <div className="text-center py-8 text-gray-400">
                <Home className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No se encontraron transacciones que coincidan con los filtros.</p>
              </div>
            )}
          </CardContent>  
        </Card>
      </div>
    </div>
  )
}