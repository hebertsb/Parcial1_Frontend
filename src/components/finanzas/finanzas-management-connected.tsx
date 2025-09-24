"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/hooks/use-toast"
import {
  Search,
  Filter,
  Download,
  Plus,
  MoreHorizontal,
  DollarSign,
  TrendingUp,
  TrendingDown,
  Calendar,
  Loader2,
} from "lucide-react"

// Import hooks and services
import { useEstadisticasFinancieras, useIngresos, useGastos, useFinanzasMutations } from "@/hooks/useFinanzas"
import { transaccionesService } from "@/lib/services"

// Format currency
const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('es-BO', {
    style: 'currency',
    currency: 'BOB',
    minimumFractionDigits: 2
  }).format(amount)
}

// Format date
const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('es-BO')
}

export function FinanzasManagementConnected() {
  const { toast } = useToast()
  const [searchTerm, setSearchTerm] = useState("")
  const [activeTab, setActiveTab] = useState("ingresos")

  // Fetch data using custom hooks
  const { data: estadisticas, loading: loadingStats, error: errorStats } = useEstadisticasFinancieras()
  const { data: ingresosData, loading: loadingIngresos, error: errorIngresos, refresh: refreshIngresos } = useIngresos({ 
    search: searchTerm,
    page_size: 10 
  })
  const { data: gastosData, loading: loadingGastos, error: errorGastos, refresh: refreshGastos } = useGastos({ 
    search: searchTerm,
    page_size: 10 
  })

  // Mutations
  const { createTransaccion, updateTransaccion, deleteTransaccion, changeEstado, loading: mutationLoading, error: mutationError } = useFinanzasMutations()

  // Handle errors
  useEffect(() => {
    if (errorStats || errorIngresos || errorGastos || mutationError) {
      toast({
        title: "Error",
        description: errorStats || errorIngresos || errorGastos || mutationError || "Error desconocido",
        variant: "destructive",
      })
    }
  }, [errorStats, errorIngresos, errorGastos, mutationError, toast])

  // Handle estado change
  const handleEstadoChange = async (id: number, newEstado: 'pendiente' | 'pagado' | 'cancelado') => {
    const result = await changeEstado(id, newEstado)
    if (result) {
      toast({
        title: "Estado actualizado",
        description: "El estado de la transacción ha sido actualizado correctamente.",
      })
      // Refresh data
      if (activeTab === 'ingresos') {
        refreshIngresos()
      } else {
        refreshGastos()
      }
    }
  }

  // Handle export
  const handleExport = async () => {
    try {
      const response = await transaccionesService.exportarTransacciones({ search: searchTerm })
      if (response.success && response.data) {
        // Crear URL para el blob y descargarlo
        const url = URL.createObjectURL(response.data as Blob)
        const link = document.createElement('a')
        link.href = url
        link.download = 'transacciones.xlsx'
        link.click()
        URL.revokeObjectURL(url)
        toast({
          title: "Exportación exitosa",
          description: "El archivo se ha generado correctamente.",
        })
      }
    } catch (error) {
      toast({
        title: "Error en exportación",
        description: "No se pudo generar el archivo de exportación.",
        variant: "destructive",
      })
    }
  }

  // Render statistics cards
  const renderStatsCards = () => {
    if (loadingStats) {
      return (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="bg-[#111111] border border-[#1f1f1f] rounded-lg p-4 animate-pulse">
              <div className="h-20 bg-[#1a1a1a] rounded"></div>
            </div>
          ))}
        </div>
      )
    }

    return (
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-[#111111] border border-[#1f1f1f] rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Ingresos del Mes</p>
              <p className="text-2xl font-semibold text-white">
                {estadisticas ? formatCurrency(estadisticas.ingresos_mes) : formatCurrency(0)}
              </p>
              <p className="text-green-500 text-sm flex items-center mt-1">
                <TrendingUp className="w-3 h-3 mr-1" />
                {estadisticas ? `${estadisticas.variacion_ingresos > 0 ? '+' : ''}${estadisticas.variacion_ingresos}%` : '0%'} vs mes anterior
              </p>
            </div>
            <DollarSign className="w-8 h-8 text-green-500" />
          </div>
        </div>
        <div className="bg-[#111111] border border-[#1f1f1f] rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Gastos del Mes</p>
              <p className="text-2xl font-semibold text-white">
                {estadisticas ? formatCurrency(estadisticas.gastos_mes) : formatCurrency(0)}
              </p>
              <p className="text-red-500 text-sm flex items-center mt-1">
                <TrendingUp className="w-3 h-3 mr-1" />
                {estadisticas ? `${estadisticas.variacion_gastos > 0 ? '+' : ''}${estadisticas.variacion_gastos}%` : '0%'} vs mes anterior
              </p>
            </div>
            <TrendingDown className="w-8 h-8 text-red-500" />
          </div>
        </div>
        <div className="bg-[#111111] border border-[#1f1f1f] rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Balance</p>
              <p className="text-2xl font-semibold text-white">
                {estadisticas ? formatCurrency(estadisticas.balance) : formatCurrency(0)}
              </p>
              <p className={`text-sm ${estadisticas && estadisticas.balance > 0 ? 'text-green-500' : 'text-red-500'}`}>
                {estadisticas && estadisticas.balance > 0 ? 'Positivo' : 'Negativo'}
              </p>
            </div>
            <TrendingUp className="w-8 h-8 text-blue-500" />
          </div>
        </div>
        <div className="bg-[#111111] border border-[#1f1f1f] rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Pagos Pendientes</p>
              <p className="text-2xl font-semibold text-white">
                {estadisticas ? formatCurrency(estadisticas.pagos_pendientes) : formatCurrency(0)}
              </p>
              <p className="text-yellow-500 text-sm">
                {estadisticas ? `${estadisticas.pagos_pendientes_count} facturas` : '0 facturas'}
              </p>
            </div>
            <Calendar className="w-8 h-8 text-yellow-500" />
          </div>
        </div>
      </div>
    )
  }

  // Render table rows for ingresos
  const renderIngresosRows = () => {
    if (loadingIngresos) {
      return (
        <TableRow>
          <TableCell colSpan={7} className="text-center py-8">
            <Loader2 className="w-6 h-6 animate-spin mx-auto" />
            <p className="text-gray-400 mt-2">Cargando ingresos...</p>
          </TableCell>
        </TableRow>
      )
    }

    if (!ingresosData?.results?.length) {
      return (
        <TableRow>
          <TableCell colSpan={7} className="text-center py-8">
            <p className="text-gray-400">No se encontraron ingresos</p>
          </TableCell>
        </TableRow>
      )
    }

    return ingresosData.results.map((ingreso) => (
      <TableRow key={ingreso.id} className="border-[#1f1f1f] hover:bg-[#1a1a1a]">
        <TableCell className="text-white font-medium">{ingreso.concepto}</TableCell>
        <TableCell className="text-gray-300 font-mono">{ingreso.unidad?.numero || 'N/A'}</TableCell>
        <TableCell className="text-green-400 font-semibold">{formatCurrency(ingreso.monto)}</TableCell>
        <TableCell className="text-gray-300">{formatDate(ingreso.fecha)}</TableCell>
        <TableCell>
          <Badge
            variant="default"
            className={
              ingreso.estado === "pagado"
                ? "bg-green-600 text-white hover:bg-green-700"
                : ingreso.estado === "pendiente"
                ? "bg-yellow-600 text-white hover:bg-yellow-700"
                : "bg-red-600 text-white hover:bg-red-700"
            }
          >
            {ingreso.estado.charAt(0).toUpperCase() + ingreso.estado.slice(1)}
          </Badge>
        </TableCell>
        <TableCell className="text-gray-300">{ingreso.metodo_pago || 'N/A'}</TableCell>
        <TableCell>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="text-gray-400 hover:text-white hover:bg-[#2a2a2a]"
                disabled={mutationLoading}
              >
                <MoreHorizontal className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="bg-[#1a1a1a] border-[#2a2a2a]">
              <DropdownMenuItem className="text-white hover:bg-[#2a2a2a]">Ver detalles</DropdownMenuItem>
              <DropdownMenuItem className="text-white hover:bg-[#2a2a2a]">Editar</DropdownMenuItem>
              {ingreso.estado === 'pendiente' && (
                <DropdownMenuItem 
                  className="text-white hover:bg-[#2a2a2a]"
                  onClick={() => handleEstadoChange(ingreso.id, 'pagado')}
                >
                  Marcar como pagado
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </TableCell>
      </TableRow>
    ))
  }

  // Render table rows for gastos
  const renderGastosRows = () => {
    if (loadingGastos) {
      return (
        <TableRow>
          <TableCell colSpan={7} className="text-center py-8">
            <Loader2 className="w-6 h-6 animate-spin mx-auto" />
            <p className="text-gray-400 mt-2">Cargando gastos...</p>
          </TableCell>
        </TableRow>
      )
    }

    if (!gastosData?.results?.length) {
      return (
        <TableRow>
          <TableCell colSpan={7} className="text-center py-8">
            <p className="text-gray-400">No se encontraron gastos</p>
          </TableCell>
        </TableRow>
      )
    }

    return gastosData.results.map((gasto) => (
      <TableRow key={gasto.id} className="border-[#1f1f1f] hover:bg-[#1a1a1a]">
        <TableCell className="text-white font-medium">{gasto.concepto}</TableCell>
        <TableCell className="text-gray-300">{gasto.categoria || 'Sin categoría'}</TableCell>
        <TableCell className="text-red-400 font-semibold">{formatCurrency(gasto.monto)}</TableCell>
        <TableCell className="text-gray-300">{formatDate(gasto.fecha)}</TableCell>
        <TableCell className="text-gray-300">{gasto.proveedor || 'N/A'}</TableCell>
        <TableCell>
          <Badge
            variant="default"
            className={
              gasto.estado === "pagado"
                ? "bg-green-600 text-white hover:bg-green-700"
                : gasto.estado === "pendiente"
                ? "bg-yellow-600 text-white hover:bg-yellow-700"
                : "bg-red-600 text-white hover:bg-red-700"
            }
          >
            {gasto.estado.charAt(0).toUpperCase() + gasto.estado.slice(1)}
          </Badge>
        </TableCell>
        <TableCell>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="text-gray-400 hover:text-white hover:bg-[#2a2a2a]"
                disabled={mutationLoading}
              >
                <MoreHorizontal className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="bg-[#1a1a1a] border-[#2a2a2a]">
              <DropdownMenuItem className="text-white hover:bg-[#2a2a2a]">Ver detalles</DropdownMenuItem>
              <DropdownMenuItem className="text-white hover:bg-[#2a2a2a]">Editar</DropdownMenuItem>
              {gasto.estado === 'pendiente' && (
                <DropdownMenuItem 
                  className="text-white hover:bg-[#2a2a2a]"
                  onClick={() => handleEstadoChange(gasto.id, 'pagado')}
                >
                  Marcar como pagado
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </TableCell>
      </TableRow>
    ))
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold text-white">Finanzas</h1>
        <p className="text-gray-400 text-sm mt-1">Gestión financiera del condominio (Conectado a Django)</p>
      </div>

      {/* Stats Cards */}
      {renderStatsCards()}

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="bg-[#1a1a1a] border-[#2a2a2a]">
          <TabsTrigger value="ingresos" className="data-[state=active]:bg-[#2a2a2a] data-[state=active]:text-white">
            Ingresos
          </TabsTrigger>
          <TabsTrigger value="gastos" className="data-[state=active]:bg-[#2a2a2a] data-[state=active]:text-white">
            Gastos
          </TabsTrigger>
          <TabsTrigger value="reportes" className="data-[state=active]:bg-[#2a2a2a] data-[state=active]:text-white">
            Reportes
          </TabsTrigger>
        </TabsList>

        <TabsContent value="ingresos" className="space-y-4">
          {/* Controls */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  placeholder="Buscar ingresos..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-80 bg-[#1a1a1a] border-[#2a2a2a] text-white placeholder-gray-400 pl-10"
                />
              </div>
              <Button variant="outline" className="bg-[#1a1a1a] border-[#2a2a2a] text-white hover:bg-[#2a2a2a]">
                <Filter className="w-4 h-4 mr-2" />
                Filtros
              </Button>
            </div>
            <div className="flex items-center space-x-2">
              <Button 
                variant="outline" 
                className="bg-[#1a1a1a] border-[#2a2a2a] text-white hover:bg-[#2a2a2a]"
                onClick={handleExport}
              >
                <Download className="w-4 h-4 mr-2" />
                Exportar
              </Button>
              <Button className="bg-white text-black hover:bg-gray-200">
                <Plus className="w-4 h-4 mr-2" />
                Nuevo Ingreso
              </Button>
            </div>
          </div>

          {/* Ingresos Table */}
          <div className="bg-[#111111] border border-[#1f1f1f] rounded-lg overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="border-[#1f1f1f] hover:bg-[#1a1a1a]">
                  <TableHead className="text-gray-300 font-medium">Concepto</TableHead>
                  <TableHead className="text-gray-300 font-medium">Unidad</TableHead>
                  <TableHead className="text-gray-300 font-medium">Monto</TableHead>
                  <TableHead className="text-gray-300 font-medium">Fecha</TableHead>
                  <TableHead className="text-gray-300 font-medium">Estado</TableHead>
                  <TableHead className="text-gray-300 font-medium">Método</TableHead>
                  <TableHead className="text-gray-300 font-medium w-12"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {renderIngresosRows()}
              </TableBody>
            </Table>
          </div>

          {/* Pagination for ingresos */}
          {ingresosData && (
            <div className="flex items-center justify-between text-sm text-gray-400">
              <div>
                Mostrando {ingresosData.results.length} de {ingresosData.count} resultados
              </div>
              <div className="flex items-center space-x-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  disabled={!ingresosData.previous}
                  className="bg-[#1a1a1a] border-[#2a2a2a] text-white hover:bg-[#2a2a2a]"
                >
                  Anterior
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  disabled={!ingresosData.next}
                  className="bg-[#1a1a1a] border-[#2a2a2a] text-white hover:bg-[#2a2a2a]"
                >
                  Siguiente
                </Button>
              </div>
            </div>
          )}
        </TabsContent>

        <TabsContent value="gastos" className="space-y-4">
          {/* Controls */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  placeholder="Buscar gastos..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-80 bg-[#1a1a1a] border-[#2a2a2a] text-white placeholder-gray-400 pl-10"
                />
              </div>
              <Button variant="outline" className="bg-[#1a1a1a] border-[#2a2a2a] text-white hover:bg-[#2a2a2a]">
                <Filter className="w-4 h-4 mr-2" />
                Filtros
              </Button>
            </div>
            <div className="flex items-center space-x-2">
              <Button 
                variant="outline" 
                className="bg-[#1a1a1a] border-[#2a2a2a] text-white hover:bg-[#2a2a2a]"
                onClick={handleExport}
              >
                <Download className="w-4 h-4 mr-2" />
                Exportar
              </Button>
              <Button className="bg-white text-black hover:bg-gray-200">
                <Plus className="w-4 h-4 mr-2" />
                Nuevo Gasto
              </Button>
            </div>
          </div>

          {/* Gastos Table */}
          <div className="bg-[#111111] border border-[#1f1f1f] rounded-lg overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="border-[#1f1f1f] hover:bg-[#1a1a1a]">
                  <TableHead className="text-gray-300 font-medium">Concepto</TableHead>
                  <TableHead className="text-gray-300 font-medium">Categoría</TableHead>
                  <TableHead className="text-gray-300 font-medium">Monto</TableHead>
                  <TableHead className="text-gray-300 font-medium">Fecha</TableHead>
                  <TableHead className="text-gray-300 font-medium">Proveedor</TableHead>
                  <TableHead className="text-gray-300 font-medium">Estado</TableHead>
                  <TableHead className="text-gray-300 font-medium w-12"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {renderGastosRows()}
              </TableBody>
            </Table>
          </div>

          {/* Pagination for gastos */}
          {gastosData && (
            <div className="flex items-center justify-between text-sm text-gray-400">
              <div>
                Mostrando {gastosData.results.length} de {gastosData.count} resultados
              </div>
              <div className="flex items-center space-x-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  disabled={!gastosData.previous}
                  className="bg-[#1a1a1a] border-[#2a2a2a] text-white hover:bg-[#2a2a2a]"
                >
                  Anterior
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  disabled={!gastosData.next}
                  className="bg-[#1a1a1a] border-[#2a2a2a] text-white hover:bg-[#2a2a2a]"
                >
                  Siguiente
                </Button>
              </div>
            </div>
          )}
        </TabsContent>

        <TabsContent value="reportes" className="space-y-4">
          <div className="bg-[#111111] border border-[#1f1f1f] rounded-lg p-6">
            <h3 className="text-lg font-semibold text-white mb-4">Reportes Financieros</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Button variant="outline" className="bg-[#1a1a1a] border-[#2a2a2a] text-white hover:bg-[#2a2a2a] h-20">
                <div className="text-center">
                  <Download className="w-6 h-6 mx-auto mb-2" />
                  <p>Reporte Mensual</p>
                </div>
              </Button>
              <Button variant="outline" className="bg-[#1a1a1a] border-[#2a2a2a] text-white hover:bg-[#2a2a2a] h-20">
                <div className="text-center">
                  <Download className="w-6 h-6 mx-auto mb-2" />
                  <p>Estado de Cuenta</p>
                </div>
              </Button>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
