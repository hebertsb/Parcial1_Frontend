"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
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
} from "lucide-react"

const ingresos = [
  {
    id: 1,
    concepto: "Cuota de Mantenimiento - Enero",
    unidad: "A-101",
    monto: "$150.00",
    fecha: "05/01/2024",
    estado: "Pagado",
    metodo: "Transferencia",
  },
  {
    id: 2,
    concepto: "Cuota de Mantenimiento - Enero",
    unidad: "A-102",
    monto: "$150.00",
    fecha: "08/01/2024",
    estado: "Pagado",
    metodo: "Efectivo",
  },
  {
    id: 3,
    concepto: "Multa por Ruido",
    unidad: "B-201",
    monto: "$50.00",
    fecha: "12/01/2024",
    estado: "Pendiente",
    metodo: "N/A",
  },
]

const gastos = [
  {
    id: 1,
    concepto: "Mantenimiento Ascensor",
    categoria: "Mantenimiento",
    monto: "$800.00",
    fecha: "10/01/2024",
    proveedor: "Elevadores SA",
    estado: "Pagado",
  },
  {
    id: 2,
    concepto: "Limpieza Áreas Comunes",
    categoria: "Servicios",
    monto: "$400.00",
    fecha: "15/01/2024",
    proveedor: "Limpieza Total",
    estado: "Pagado",
  },
  {
    id: 3,
    concepto: "Reparación Bomba de Agua",
    categoria: "Reparaciones",
    monto: "$350.00",
    fecha: "20/01/2024",
    proveedor: "Plomería Express",
    estado: "Pendiente",
  },
]

export function FinanzasManagement() {
  const [searchTerm, setSearchTerm] = useState("")

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold text-white">Finanzas</h1>
        <p className="text-gray-400 text-sm mt-1">Gestión financiera del condominio</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-[#111111] border border-[#1f1f1f] rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Ingresos del Mes</p>
              <p className="text-2xl font-semibold text-white">$3,450</p>
              <p className="text-green-500 text-sm flex items-center mt-1">
                <TrendingUp className="w-3 h-3 mr-1" />
                +12% vs mes anterior
              </p>
            </div>
            <DollarSign className="w-8 h-8 text-green-500" />
          </div>
        </div>
        <div className="bg-[#111111] border border-[#1f1f1f] rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Gastos del Mes</p>
              <p className="text-2xl font-semibold text-white">$1,550</p>
              <p className="text-red-500 text-sm flex items-center mt-1">
                <TrendingUp className="w-3 h-3 mr-1" />
                +8% vs mes anterior
              </p>
            </div>
            <TrendingDown className="w-8 h-8 text-red-500" />
          </div>
        </div>
        <div className="bg-[#111111] border border-[#1f1f1f] rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Balance</p>
              <p className="text-2xl font-semibold text-white">$1,900</p>
              <p className="text-green-500 text-sm">Positivo</p>
            </div>
            <TrendingUp className="w-8 h-8 text-blue-500" />
          </div>
        </div>
        <div className="bg-[#111111] border border-[#1f1f1f] rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Pagos Pendientes</p>
              <p className="text-2xl font-semibold text-white">$400</p>
              <p className="text-yellow-500 text-sm">2 facturas</p>
            </div>
            <Calendar className="w-8 h-8 text-yellow-500" />
          </div>
        </div>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="ingresos" className="space-y-4">
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
                  className="w-80 bg-[#1a1a1a] border-[#2a2a2a] text-white placeholder-gray-400 pl-10"
                />
              </div>
              <Button variant="outline" className="bg-[#1a1a1a] border-[#2a2a2a] text-white hover:bg-[#2a2a2a]">
                <Filter className="w-4 h-4 mr-2" />
                Filtros
              </Button>
            </div>
            <div className="flex items-center space-x-2">
              <Button variant="outline" className="bg-[#1a1a1a] border-[#2a2a2a] text-white hover:bg-[#2a2a2a]">
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
                {ingresos.map((ingreso) => (
                  <TableRow key={ingreso.id} className="border-[#1f1f1f] hover:bg-[#1a1a1a]">
                    <TableCell className="text-white font-medium">{ingreso.concepto}</TableCell>
                    <TableCell className="text-gray-300 font-mono">{ingreso.unidad}</TableCell>
                    <TableCell className="text-green-400 font-semibold">{ingreso.monto}</TableCell>
                    <TableCell className="text-gray-300">{ingreso.fecha}</TableCell>
                    <TableCell>
                      <Badge
                        variant="default"
                        className={
                          ingreso.estado === "Pagado"
                            ? "bg-green-600 text-white hover:bg-green-700"
                            : "bg-yellow-600 text-white hover:bg-yellow-700"
                        }
                      >
                        {ingreso.estado}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-gray-300">{ingreso.metodo}</TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-gray-400 hover:text-white hover:bg-[#2a2a2a]"
                          >
                            <MoreHorizontal className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="bg-[#1a1a1a] border-[#2a2a2a]">
                          <DropdownMenuItem className="text-white hover:bg-[#2a2a2a]">Ver detalles</DropdownMenuItem>
                          <DropdownMenuItem className="text-white hover:bg-[#2a2a2a]">Editar</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </TabsContent>

        <TabsContent value="gastos" className="space-y-4">
          {/* Controls */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  placeholder="Buscar gastos..."
                  className="w-80 bg-[#1a1a1a] border-[#2a2a2a] text-white placeholder-gray-400 pl-10"
                />
              </div>
              <Button variant="outline" className="bg-[#1a1a1a] border-[#2a2a2a] text-white hover:bg-[#2a2a2a]">
                <Filter className="w-4 h-4 mr-2" />
                Filtros
              </Button>
            </div>
            <div className="flex items-center space-x-2">
              <Button variant="outline" className="bg-[#1a1a1a] border-[#2a2a2a] text-white hover:bg-[#2a2a2a]">
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
                {gastos.map((gasto) => (
                  <TableRow key={gasto.id} className="border-[#1f1f1f] hover:bg-[#1a1a1a]">
                    <TableCell className="text-white font-medium">{gasto.concepto}</TableCell>
                    <TableCell className="text-gray-300">{gasto.categoria}</TableCell>
                    <TableCell className="text-red-400 font-semibold">{gasto.monto}</TableCell>
                    <TableCell className="text-gray-300">{gasto.fecha}</TableCell>
                    <TableCell className="text-gray-300">{gasto.proveedor}</TableCell>
                    <TableCell>
                      <Badge
                        variant="default"
                        className={
                          gasto.estado === "Pagado"
                            ? "bg-green-600 text-white hover:bg-green-700"
                            : "bg-yellow-600 text-white hover:bg-yellow-700"
                        }
                      >
                        {gasto.estado}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-gray-400 hover:text-white hover:bg-[#2a2a2a]"
                          >
                            <MoreHorizontal className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="bg-[#1a1a1a] border-[#2a2a2a]">
                          <DropdownMenuItem className="text-white hover:bg-[#2a2a2a]">Ver detalles</DropdownMenuItem>
                          <DropdownMenuItem className="text-white hover:bg-[#2a2a2a]">Editar</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
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
