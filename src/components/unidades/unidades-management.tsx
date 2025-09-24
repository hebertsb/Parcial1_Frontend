"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import {
  Search,
  Filter,
  Download,
  Plus,
  MoreHorizontal,
  ChevronLeft,
  ChevronRight,
  Edit,
  Trash2,
  Eye,
  Home,
  Users,
} from "lucide-react"

const unidades = [
  {
    id: 1,
    numero: "A-101",
    tipo: "Apartamento",
    area: "85 m²",
    habitaciones: 2,
    banos: 2,
    propietario: "Juan Pérez",
    inquilino: "N/A",
    estado: "Ocupado",
    valorAlquiler: "$1,200",
    fechaCompra: "15/01/2020",
    imagen: "/modern-luxury-condominium-building-exterior-with-g.jpg",
  },
  {
    id: 2,
    numero: "A-102",
    tipo: "Apartamento",
    area: "90 m²",
    habitaciones: 2,
    banos: 2,
    propietario: "María González",
    inquilino: "Ana García",
    estado: "Alquilado",
    valorAlquiler: "$1,350",
    fechaCompra: "22/03/2019",
    imagen: "/modern-luxury-condominium-building-exterior-with-g.jpg",
  },
  {
    id: 3,
    numero: "B-201",
    tipo: "Apartamento",
    area: "120 m²",
    habitaciones: 3,
    banos: 2,
    propietario: "Carlos López",
    inquilino: "N/A",
    estado: "Ocupado",
    valorAlquiler: "$1,800",
    fechaCompra: "10/07/2021",
    imagen: "/modern-luxury-condominium-building-exterior-with-g.jpg",
  },
  {
    id: 4,
    numero: "B-202",
    tipo: "Apartamento",
    area: "95 m²",
    habitaciones: 2,
    banos: 2,
    propietario: "Luis Martínez",
    inquilino: "María Rodríguez",
    estado: "Alquilado",
    valorAlquiler: "$1,400",
    fechaCompra: "05/11/2020",
    imagen: "/modern-luxury-condominium-building-exterior-with-g.jpg",
  },
  {
    id: 5,
    numero: "C-301",
    tipo: "Penthouse",
    area: "180 m²",
    habitaciones: 4,
    banos: 3,
    propietario: "Roberto Silva",
    inquilino: "N/A",
    estado: "Disponible",
    valorAlquiler: "$2,500",
    fechaCompra: "18/09/2022",
    imagen: "/modern-luxury-condominium-building-exterior-with-g.jpg",
  },
]

export function UnidadesManagement() {
  const [searchTerm, setSearchTerm] = useState("")

  const filteredUnidades = unidades.filter(
    (unidad) =>
      unidad.numero.toLowerCase().includes(searchTerm.toLowerCase()) ||
      unidad.propietario.toLowerCase().includes(searchTerm.toLowerCase()) ||
      unidad.estado.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold text-white">Unidades</h1>
        <p className="text-gray-400 text-sm mt-1">Gestión de unidades del condominio</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-[#111111] border border-[#1f1f1f] rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Total Unidades</p>
              <p className="text-2xl font-semibold text-white">24</p>
            </div>
            <Home className="w-8 h-8 text-blue-500" />
          </div>
        </div>
        <div className="bg-[#111111] border border-[#1f1f1f] rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Ocupadas</p>
              <p className="text-2xl font-semibold text-white">18</p>
            </div>
            <Users className="w-8 h-8 text-green-500" />
          </div>
        </div>
        <div className="bg-[#111111] border border-[#1f1f1f] rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Alquiladas</p>
              <p className="text-2xl font-semibold text-white">8</p>
            </div>
            <Home className="w-8 h-8 text-yellow-500" />
          </div>
        </div>
        <div className="bg-[#111111] border border-[#1f1f1f] rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Disponibles</p>
              <p className="text-2xl font-semibold text-white">6</p>
            </div>
            <Home className="w-8 h-8 text-gray-500" />
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              placeholder="Buscar unidades..."
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
          <Button variant="outline" className="bg-[#1a1a1a] border-[#2a2a2a] text-white hover:bg-[#2a2a2a]">
            <Download className="w-4 h-4 mr-2" />
            Exportar
          </Button>
          <Button className="bg-white text-black hover:bg-gray-200">
            <Plus className="w-4 h-4 mr-2" />
            Nueva Unidad
          </Button>
        </div>
      </div>

      {/* Table */}
      <div className="bg-[#111111] border border-[#1f1f1f] rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="border-[#1f1f1f] hover:bg-[#1a1a1a]">
              <TableHead className="text-gray-300 font-medium">Unidad</TableHead>
              <TableHead className="text-gray-300 font-medium">Tipo</TableHead>
              <TableHead className="text-gray-300 font-medium">Área</TableHead>
              <TableHead className="text-gray-300 font-medium">Habitaciones</TableHead>
              <TableHead className="text-gray-300 font-medium">Propietario</TableHead>
              <TableHead className="text-gray-300 font-medium">Inquilino</TableHead>
              <TableHead className="text-gray-300 font-medium">Estado</TableHead>
              <TableHead className="text-gray-300 font-medium">Valor Alquiler</TableHead>
              <TableHead className="text-gray-300 font-medium w-12"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredUnidades.map((unidad) => (
              <TableRow key={unidad.id} className="border-[#1f1f1f] hover:bg-[#1a1a1a]">
                <TableCell className="text-white">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-[#2a2a2a] rounded-lg flex items-center justify-center">
                      <Home className="w-5 h-5 text-blue-500" />
                    </div>
                    <span className="font-medium font-mono">{unidad.numero}</span>
                  </div>
                </TableCell>
                <TableCell className="text-gray-300">{unidad.tipo}</TableCell>
                <TableCell className="text-gray-300">{unidad.area}</TableCell>
                <TableCell className="text-gray-300">
                  {unidad.habitaciones}H / {unidad.banos}B
                </TableCell>
                <TableCell className="text-gray-300">{unidad.propietario}</TableCell>
                <TableCell className="text-gray-300">{unidad.inquilino}</TableCell>
                <TableCell>
                  <Badge
                    variant="default"
                    className={
                      unidad.estado === "Ocupado"
                        ? "bg-green-600 text-white hover:bg-green-700"
                        : unidad.estado === "Alquilado"
                          ? "bg-blue-600 text-white hover:bg-blue-700"
                          : "bg-gray-600 text-white hover:bg-gray-700"
                    }
                  >
                    {unidad.estado}
                  </Badge>
                </TableCell>
                <TableCell className="text-gray-300 font-semibold">{unidad.valorAlquiler}</TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white hover:bg-[#2a2a2a]">
                        <MoreHorizontal className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="bg-[#1a1a1a] border-[#2a2a2a]">
                      <DropdownMenuItem className="text-white hover:bg-[#2a2a2a]">
                        <Eye className="w-4 h-4 mr-2" />
                        Ver detalles
                      </DropdownMenuItem>
                      <DropdownMenuItem className="text-white hover:bg-[#2a2a2a]">
                        <Edit className="w-4 h-4 mr-2" />
                        Editar
                      </DropdownMenuItem>
                      <DropdownMenuItem className="text-red-400 hover:bg-[#2a2a2a]">
                        <Trash2 className="w-4 h-4 mr-2" />
                        Eliminar
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-400">
          Mostrando {filteredUnidades.length} de {unidades.length} unidades
        </p>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm" className="bg-[#1a1a1a] border-[#2a2a2a] text-white hover:bg-[#2a2a2a]">
            <ChevronLeft className="w-4 h-4 mr-1" />
            Anterior
          </Button>
          <Button variant="outline" size="sm" className="bg-[#1a1a1a] border-[#2a2a2a] text-white hover:bg-[#2a2a2a]">
            Siguiente
            <ChevronRight className="w-4 h-4 ml-1" />
          </Button>
        </div>
      </div>
    </div>
  )
}
