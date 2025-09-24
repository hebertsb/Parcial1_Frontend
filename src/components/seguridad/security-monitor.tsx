"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Camera, Shield, AlertTriangle, Users, Clock, MapPin, Eye, Play, Pause } from "lucide-react"

const camaras = [
  {
    id: 1,
    nombre: "Entrada Principal",
    ubicacion: "Lobby",
    estado: "Activa",
    ultimaActividad: "Hace 2 min",
    imagen: "/modern-luxury-condominium-building-exterior-with-g.jpg",
  },
  {
    id: 2,
    nombre: "Estacionamiento A",
    ubicacion: "Sótano 1",
    estado: "Activa",
    ultimaActividad: "Hace 5 min",
    imagen: "/modern-luxury-condominium-building-exterior-with-g.jpg",
  },
  {
    id: 3,
    nombre: "Piscina",
    ubicacion: "Área Recreativa",
    estado: "Mantenimiento",
    ultimaActividad: "Hace 1 hora",
    imagen: "/modern-luxury-condominium-building-exterior-with-g.jpg",
  },
  {
    id: 4,
    nombre: "Ascensor Torre A",
    ubicacion: "Torre A",
    estado: "Activa",
    ultimaActividad: "Hace 1 min",
    imagen: "/modern-luxury-condominium-building-exterior-with-g.jpg",
  },
]

const incidentes = [
  {
    id: 1,
    tipo: "Acceso No Autorizado",
    ubicacion: "Entrada Principal",
    fecha: "2024-01-20 14:30",
    estado: "Resuelto",
    prioridad: "Alta",
    descripcion: "Persona no identificada intentó acceder sin autorización",
  },
  {
    id: 2,
    tipo: "Ruido Excesivo",
    ubicacion: "Unidad B-201",
    fecha: "2024-01-20 22:15",
    estado: "En Proceso",
    prioridad: "Media",
    descripcion: "Reporte de ruido excesivo en horario nocturno",
  },
  {
    id: 3,
    tipo: "Vehículo Mal Estacionado",
    ubicacion: "Estacionamiento B",
    fecha: "2024-01-19 16:45",
    estado: "Resuelto",
    prioridad: "Baja",
    descripcion: "Vehículo estacionado en espacio reservado",
  },
]

export function SecurityMonitor() {
  const [selectedCamera, setSelectedCamera] = useState(camaras[0])

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold text-white">Monitor de Seguridad</h1>
        <p className="text-gray-400 text-sm mt-1">Sistema de vigilancia y control de acceso</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-[#111111] border border-[#1f1f1f] rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Cámaras Activas</p>
              <p className="text-2xl font-semibold text-white">12</p>
            </div>
            <Camera className="w-8 h-8 text-green-500" />
          </div>
        </div>
        <div className="bg-[#111111] border border-[#1f1f1f] rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Incidentes Hoy</p>
              <p className="text-2xl font-semibold text-white">3</p>
            </div>
            <AlertTriangle className="w-8 h-8 text-yellow-500" />
          </div>
        </div>
        <div className="bg-[#111111] border border-[#1f1f1f] rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Visitantes</p>
              <p className="text-2xl font-semibold text-white">8</p>
            </div>
            <Users className="w-8 h-8 text-blue-500" />
          </div>
        </div>
        <div className="bg-[#111111] border border-[#1f1f1f] rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Estado Sistema</p>
              <p className="text-lg font-semibold text-green-400">Operativo</p>
            </div>
            <Shield className="w-8 h-8 text-green-500" />
          </div>
        </div>
      </div>

      <Tabs defaultValue="camaras" className="space-y-4">
        <TabsList className="bg-[#1a1a1a] border-[#2a2a2a]">
          <TabsTrigger value="camaras" className="data-[state=active]:bg-[#2a2a2a] data-[state=active]:text-white">
            Cámaras
          </TabsTrigger>
          <TabsTrigger value="incidentes" className="data-[state=active]:bg-[#2a2a2a] data-[state=active]:text-white">
            Incidentes
          </TabsTrigger>
          <TabsTrigger value="acceso" className="data-[state=active]:bg-[#2a2a2a] data-[state=active]:text-white">
            Control de Acceso
          </TabsTrigger>
        </TabsList>

        <TabsContent value="camaras" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Camera List */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-white">Cámaras Disponibles</h3>
              <div className="space-y-2">
                {camaras.map((camara) => (
                  <div
                    key={camara.id}
                    className={`bg-[#111111] border border-[#1f1f1f] rounded-lg p-4 cursor-pointer transition-colors ${
                      selectedCamera.id === camara.id ? "border-blue-500" : "hover:bg-[#1a1a1a]"
                    }`}
                    onClick={() => setSelectedCamera(camara)}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="text-white font-medium">{camara.nombre}</h4>
                        <p className="text-gray-400 text-sm flex items-center mt-1">
                          <MapPin className="w-3 h-3 mr-1" />
                          {camara.ubicacion}
                        </p>
                        <p className="text-gray-400 text-sm flex items-center mt-1">
                          <Clock className="w-3 h-3 mr-1" />
                          {camara.ultimaActividad}
                        </p>
                      </div>
                      <Badge
                        variant="default"
                        className={camara.estado === "Activa" ? "bg-green-600 text-white" : "bg-yellow-600 text-white"}
                      >
                        {camara.estado}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Camera View */}
            <div className="lg:col-span-2 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-white">{selectedCamera.nombre}</h3>
                <div className="flex items-center space-x-2">
                  <Button size="sm" className="bg-red-600 hover:bg-red-700">
                    <div className="w-2 h-2 bg-white rounded-full mr-2"></div>
                    En Vivo
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="bg-[#1a1a1a] border-[#2a2a2a] text-white hover:bg-[#2a2a2a]"
                  >
                    <Play className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="bg-[#1a1a1a] border-[#2a2a2a] text-white hover:bg-[#2a2a2a]"
                  >
                    <Pause className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              <div className="bg-[#111111] border border-[#1f1f1f] rounded-lg overflow-hidden">
                <div className="aspect-video bg-black flex items-center justify-center">
                  <div className="text-center">
                    <Camera className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                    <p className="text-gray-400">Vista en vivo de {selectedCamera.nombre}</p>
                    <p className="text-gray-500 text-sm mt-2">{selectedCamera.ubicacion}</p>
                  </div>
                </div>
                <div className="p-4 border-t border-[#1f1f1f]">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <Badge variant="default" className="bg-green-600 text-white">
                        {selectedCamera.estado}
                      </Badge>
                      <span className="text-gray-400 text-sm">{selectedCamera.ultimaActividad}</span>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      className="bg-[#1a1a1a] border-[#2a2a2a] text-white hover:bg-[#2a2a2a]"
                    >
                      <Eye className="w-4 h-4 mr-2" />
                      Pantalla Completa
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="incidentes" className="space-y-4">
          <div className="space-y-4">
            {incidentes.map((incidente) => (
              <div key={incidente.id} className="bg-[#111111] border border-[#1f1f1f] rounded-lg p-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h4 className="text-white font-medium">{incidente.tipo}</h4>
                      <Badge
                        variant="default"
                        className={
                          incidente.prioridad === "Alta"
                            ? "bg-red-600 text-white"
                            : incidente.prioridad === "Media"
                              ? "bg-yellow-600 text-white"
                              : "bg-gray-600 text-white"
                        }
                      >
                        {incidente.prioridad}
                      </Badge>
                      <Badge
                        variant="default"
                        className={
                          incidente.estado === "Resuelto" ? "bg-green-600 text-white" : "bg-blue-600 text-white"
                        }
                      >
                        {incidente.estado}
                      </Badge>
                    </div>
                    <p className="text-gray-300 mb-2">{incidente.descripcion}</p>
                    <div className="flex items-center space-x-4 text-sm text-gray-400">
                      <span className="flex items-center">
                        <MapPin className="w-3 h-3 mr-1" />
                        {incidente.ubicacion}
                      </span>
                      <span className="flex items-center">
                        <Clock className="w-3 h-3 mr-1" />
                        {incidente.fecha}
                      </span>
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    className="bg-[#1a1a1a] border-[#2a2a2a] text-white hover:bg-[#2a2a2a]"
                  >
                    Ver Detalles
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="acceso" className="space-y-4">
          <div className="bg-[#111111] border border-[#1f1f1f] rounded-lg p-6">
            <h3 className="text-lg font-semibold text-white mb-4">Control de Acceso</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="text-white font-medium mb-3">Visitantes de Hoy</h4>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-[#1a1a1a] rounded-lg">
                    <div>
                      <p className="text-white font-medium">Juan Carlos Mendez</p>
                      <p className="text-gray-400 text-sm">Visita a Unidad A-101</p>
                    </div>
                    <span className="text-gray-400 text-sm">14:30</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-[#1a1a1a] rounded-lg">
                    <div>
                      <p className="text-white font-medium">María Fernández</p>
                      <p className="text-gray-400 text-sm">Delivery - Unidad B-202</p>
                    </div>
                    <span className="text-gray-400 text-sm">16:15</span>
                  </div>
                </div>
              </div>
              <div>
                <h4 className="text-white font-medium mb-3">Accesos Recientes</h4>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-[#1a1a1a] rounded-lg">
                    <div>
                      <p className="text-white font-medium">Ana García</p>
                      <p className="text-gray-400 text-sm">Entrada Principal</p>
                    </div>
                    <span className="text-green-400 text-sm">Autorizado</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-[#1a1a1a] rounded-lg">
                    <div>
                      <p className="text-white font-medium">Carlos López</p>
                      <p className="text-gray-400 text-sm">Estacionamiento</p>
                    </div>
                    <span className="text-green-400 text-sm">Autorizado</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
