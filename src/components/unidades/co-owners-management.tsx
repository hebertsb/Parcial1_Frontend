"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Users, Phone, Mail, Calendar, Edit, Trash2, UserPlus, Home, Car } from "lucide-react"

// Mock data for co-owners
const coOwners = [
  {
    id: "1",
    name: "María González",
    email: "maria.gonzalez@email.com",
    phone: "+1 (555) 123-4567",
    unit: "A-301",
    role: "Propietario Principal",
    ownership: 60,
    joinDate: "2022-03-15",
    avatar: "/professional-woman-headshot.png",
    status: "activo",
    parkingSpots: ["P-A301-1", "P-A301-2"],
    emergencyContact: "Carlos González - +1 (555) 987-6543",
  },
  {
    id: "2",
    name: "Roberto Silva",
    email: "roberto.silva@email.com",
    phone: "+1 (555) 234-5678",
    unit: "A-301",
    role: "Copropietario",
    ownership: 40,
    joinDate: "2022-03-15",
    avatar: "/professional-man-headshot.png",
    status: "activo",
    parkingSpots: [],
    emergencyContact: "Ana Silva - +1 (555) 876-5432",
  },
  {
    id: "3",
    name: "Carmen Rodríguez",
    email: "carmen.rodriguez@email.com",
    phone: "+1 (555) 345-6789",
    unit: "B-205",
    role: "Propietario Principal",
    ownership: 100,
    joinDate: "2023-01-20",
    avatar: "/professional-woman-headshot-business.png",
    status: "activo",
    parkingSpots: ["P-B205-1"],
    emergencyContact: "Luis Rodríguez - +1 (555) 765-4321",
  },
  {
    id: "4",
    name: "Diego Martínez",
    email: "diego.martinez@email.com",
    phone: "+1 (555) 456-7890",
    unit: "C-102",
    role: "Propietario Principal",
    ownership: 70,
    joinDate: "2023-06-10",
    avatar: "/professional-man-headshot-casual.jpg",
    status: "pendiente",
    parkingSpots: ["P-C102-1"],
    emergencyContact: "Elena Martínez - +1 (555) 654-3210",
  },
  {
    id: "5",
    name: "Isabella Torres",
    email: "isabella.torres@email.com",
    phone: "+1 (555) 567-8901",
    unit: "C-102",
    role: "Copropietario",
    ownership: 30,
    joinDate: "2023-06-10",
    avatar: "/young-professional-woman-headshot.png",
    status: "activo",
    parkingSpots: [],
    emergencyContact: "Miguel Torres - +1 (555) 543-2109",
  },
]

export function CoOwnersManagement() {
  const [selectedUnit, setSelectedUnit] = useState("all")
  const [searchTerm, setSearchTerm] = useState("")
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)

  const filteredOwners = coOwners.filter((owner) => {
    const matchesUnit = selectedUnit === "all" || owner.unit === selectedUnit
    const matchesSearch =
      owner.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      owner.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      owner.unit.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesUnit && matchesSearch
  })

  const units = [...new Set(coOwners.map((owner) => owner.unit))].sort()

  return (
    <div className="space-y-6 bg-[#0a0a0a] text-white min-h-screen">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-balance text-white">Gestión de Copropietarios</h2>
          <p className="text-gray-400">Administra los copropietarios y su información</p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-blue-600 hover:bg-blue-700 text-white">
              <UserPlus className="w-4 h-4 mr-2" />
              Agregar Copropietario
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl bg-[#111111] border-[#1f1f1f] text-white">
            <DialogHeader>
              <DialogTitle className="text-white">Agregar Nuevo Copropietario</DialogTitle>
              <DialogDescription className="text-gray-400">
                Agregar un nuevo copropietario al sistema de gestión
              </DialogDescription>
            </DialogHeader>
            <div className="grid grid-cols-2 gap-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-white">
                  Nombre Completo
                </Label>
                <Input
                  id="name"
                  placeholder="Ingrese nombre completo"
                  className="bg-[#1a1a1a] border-[#2a2a2a] text-white"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email" className="text-white">
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Ingrese email"
                  className="bg-[#1a1a1a] border-[#2a2a2a] text-white"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone" className="text-white">
                  Teléfono
                </Label>
                <Input id="phone" placeholder="Ingrese teléfono" className="bg-[#1a1a1a] border-[#2a2a2a] text-white" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="unit" className="text-white">
                  Unidad
                </Label>
                <Select>
                  <SelectTrigger className="bg-[#1a1a1a] border-[#2a2a2a] text-white">
                    <SelectValue placeholder="Seleccionar unidad" />
                  </SelectTrigger>
                  <SelectContent className="bg-[#111111] border-[#1f1f1f]">
                    {units.map((unit) => (
                      <SelectItem key={unit} value={unit} className="text-white hover:bg-[#1a1a1a]">
                        {unit}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="role" className="text-white">
                  Rol
                </Label>
                <Select>
                  <SelectTrigger className="bg-[#1a1a1a] border-[#2a2a2a] text-white">
                    <SelectValue placeholder="Seleccionar rol" />
                  </SelectTrigger>
                  <SelectContent className="bg-[#111111] border-[#1f1f1f]">
                    <SelectItem value="primary" className="text-white hover:bg-[#1a1a1a]">
                      Propietario Principal
                    </SelectItem>
                    <SelectItem value="co-owner" className="text-white hover:bg-[#1a1a1a]">
                      Copropietario
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="ownership" className="text-white">
                  Porcentaje de Propiedad
                </Label>
                <Input
                  id="ownership"
                  type="number"
                  placeholder="Ingrese porcentaje"
                  className="bg-[#1a1a1a] border-[#2a2a2a] text-white"
                />
              </div>
              <div className="col-span-2 space-y-2">
                <Label htmlFor="emergency" className="text-white">
                  Contacto de Emergencia
                </Label>
                <Input
                  id="emergency"
                  placeholder="Nombre y teléfono"
                  className="bg-[#1a1a1a] border-[#2a2a2a] text-white"
                />
              </div>
              <div className="col-span-2 space-y-2">
                <Label htmlFor="notes" className="text-white">
                  Notas Adicionales
                </Label>
                <Textarea
                  id="notes"
                  placeholder="Información adicional..."
                  className="bg-[#1a1a1a] border-[#2a2a2a] text-white"
                />
              </div>
            </div>
            <div className="flex justify-end space-x-2">
              <Button
                variant="outline"
                onClick={() => setIsAddDialogOpen(false)}
                className="border-gray-600 text-gray-300 hover:bg-gray-800 bg-transparent"
              >
                Cancelar
              </Button>
              <Button onClick={() => setIsAddDialogOpen(false)} className="bg-blue-600 hover:bg-blue-700 text-white">
                Agregar Copropietario
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <Input
            placeholder="Buscar por nombre, email o unidad..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="max-w-sm bg-[#1a1a1a] border-[#2a2a2a] text-white placeholder:text-gray-400"
          />
        </div>
        <Select value={selectedUnit} onValueChange={setSelectedUnit}>
          <SelectTrigger className="w-48 bg-[#1a1a1a] border-[#2a2a2a] text-white">
            <SelectValue placeholder="Filtrar por unidad" />
          </SelectTrigger>
          <SelectContent className="bg-[#111111] border-[#1f1f1f]">
            <SelectItem value="all" className="text-white hover:bg-[#1a1a1a]">
              Todas las Unidades
            </SelectItem>
            {units.map((unit) => (
              <SelectItem key={unit} value={unit} className="text-white hover:bg-[#1a1a1a]">
                Unidad {unit}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Co-Owners Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredOwners.map((owner) => (
          <Card key={owner.id} className="bg-[#111111] border-[#1f1f1f] hover:shadow-lg transition-shadow">
            <CardHeader className="pb-4">
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-3">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={owner.avatar || "/placeholder.svg"} alt={owner.name} />
                    <AvatarFallback className="bg-[#2a2a2a] text-white">
                      {owner.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <CardTitle className="text-lg text-white">{owner.name}</CardTitle>
                    <div className="flex items-center space-x-2">
                      <Badge
                        variant={owner.role === "Propietario Principal" ? "default" : "secondary"}
                        className="text-xs"
                      >
                        {owner.role}
                      </Badge>
                      <Badge variant={owner.status === "activo" ? "default" : "secondary"} className="text-xs">
                        {owner.status}
                      </Badge>
                    </div>
                  </div>
                </div>
                <div className="flex space-x-1">
                  <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white hover:bg-[#1a1a1a]">
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white hover:bg-[#1a1a1a]">
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Contact Info */}
              <div className="space-y-2">
                <div className="flex items-center space-x-2 text-sm">
                  <Mail className="w-4 h-4 text-gray-400" />
                  <span className="truncate text-gray-300">{owner.email}</span>
                </div>
                <div className="flex items-center space-x-2 text-sm">
                  <Phone className="w-4 h-4 text-gray-400" />
                  <span className="text-gray-300">{owner.phone}</span>
                </div>
                <div className="flex items-center space-x-2 text-sm">
                  <Home className="w-4 h-4 text-gray-400" />
                  <span className="text-gray-300">Unidad {owner.unit}</span>
                  <span className="text-gray-400">({owner.ownership}% propiedad)</span>
                </div>
              </div>

              {/* Parking Spots */}
              {owner.parkingSpots.length > 0 && (
                <div className="space-y-2">
                  <div className="flex items-center space-x-2 text-sm">
                    <Car className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-300">Estacionamiento:</span>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {owner.parkingSpots.map((spot) => (
                      <Badge key={spot} variant="outline" className="text-xs border-gray-600 text-gray-300">
                        {spot}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {/* Join Date */}
              <div className="flex items-center space-x-2 text-sm text-gray-400">
                <Calendar className="w-4 h-4" />
                <span>Ingresó: {new Date(owner.joinDate).toLocaleDateString()}</span>
              </div>

              {/* Emergency Contact */}
              <div className="pt-2 border-t border-[#2a2a2a]">
                <div className="text-xs text-gray-400">Contacto de Emergencia:</div>
                <div className="text-sm font-medium text-gray-300">{owner.emergencyContact}</div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredOwners.length === 0 && (
        <Card className="bg-[#111111] border-[#1f1f1f]">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Users className="w-12 h-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-semibold mb-2 text-white">No se encontraron copropietarios</h3>
            <p className="text-gray-400 text-center">
              {searchTerm || selectedUnit !== "all"
                ? "Intenta ajustar tus criterios de búsqueda o filtros"
                : "Comienza agregando copropietarios al sistema"}
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
