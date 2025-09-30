"use client"

import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  QrCode, Users, Clock, Building, Trash2, Scissors, 
  Wrench, Search, Filter, Plus, Eye, Edit, CheckCircle2,
  XCircle, Calendar, MapPin, Phone, IdCard, AlertTriangle,
  Download, UserCheck, LogIn, LogOut, Activity
} from 'lucide-react'

interface ServicioTercerizado {
  id: number
  empresa: string
  rubro: 'limpieza' | 'mantenimiento' | 'basura' | 'jardineria'
  contacto: string
  telefono: string
  estado: 'activo' | 'inactivo' | 'suspendido'
  fechaContrato: string
  personalAsignado: number
  codigoQR: string
}

interface PersonalServicio {
  id: number
  nombre: string
  apellido: string
  ci: string
  empresa: string
  rubro: 'limpieza' | 'mantenimiento' | 'basura' | 'jardineria'
  telefono: string
  estado: 'activo' | 'inactivo'
  codigoQR: string
  fechaRegistro: string
}

interface RegistroAcceso {
  id: number
  personalId: number
  nombrePersonal: string
  empresa: string
  rubro: 'limpieza' | 'mantenimiento' | 'basura' | 'jardineria'
  fechaHora: string
  tipoAcceso: 'entrada' | 'salida'
  ubicacion: string
  estado: 'activo' | 'completado'
  observaciones?: string
}

const serviciosMock: ServicioTercerizado[] = [
  {
    id: 1,
    empresa: "Limpieza Total S.R.L.",
    rubro: "limpieza",
    contacto: "María Gonzales",
    telefono: "+591 70123456",
    estado: "activo",
    fechaContrato: "2024-01-15",
    personalAsignado: 8,
    codigoQR: "QR_LIMP_001"
  },
  {
    id: 2,
    empresa: "Mantenimiento Integral",
    rubro: "mantenimiento",
    contacto: "Carlos Rodríguez",
    telefono: "+591 70234567",
    estado: "activo",
    fechaContrato: "2024-01-10",
    personalAsignado: 5,
    codigoQR: "QR_MANT_002"
  },
  {
    id: 3,
    empresa: "EcoRecolección",
    rubro: "basura",
    contacto: "Ana López",
    telefono: "+591 70345678",
    estado: "activo",
    fechaContrato: "2024-02-01",
    personalAsignado: 3,
    codigoQR: "QR_BASU_003"
  },
  {
    id: 4,
    empresa: "Jardines Verdes",
    rubro: "jardineria",
    contacto: "Roberto Silva",
    telefono: "+591 70456789",
    estado: "activo",
    fechaContrato: "2024-01-20",
    personalAsignado: 4,
    codigoQR: "QR_JARD_004"
  }
]

const personalMock: PersonalServicio[] = [
  {
    id: 1,
    nombre: "Juana",
    apellido: "Mamani Quispe",
    ci: "12345678 SC",
    empresa: "Limpieza Total S.R.L.",
    rubro: "limpieza",
    telefono: "+591 70111222",
    estado: "activo",
    codigoQR: "QR_PERS_001",
    fechaRegistro: "2024-01-15"
  },
  {
    id: 2,
    nombre: "Pedro",
    apellido: "García Mendoza",
    ci: "23456789 SC",
    empresa: "Mantenimiento Integral",
    rubro: "mantenimiento",
    telefono: "+591 70222333",
    estado: "activo",
    codigoQR: "QR_PERS_002",
    fechaRegistro: "2024-01-10"
  },
  {
    id: 3,
    nombre: "Rosa",
    apellido: "Flores Castro",
    ci: "34567890 SC",
    empresa: "EcoRecolección",
    rubro: "basura",
    telefono: "+591 70333444",
    estado: "activo",
    codigoQR: "QR_PERS_003",
    fechaRegistro: "2024-02-01"
  },
  {
    id: 4,
    nombre: "Miguel",
    apellido: "Vargas Torrez",
    ci: "45678901 SC",
    empresa: "Jardines Verdes",
    rubro: "jardineria",
    telefono: "+591 70444555",
    estado: "activo",
    codigoQR: "QR_PERS_004",
    fechaRegistro: "2024-01-20"
  }
]

const registrosMock: RegistroAcceso[] = [
  {
    id: 1,
    personalId: 1,
    nombrePersonal: "Juana Mamani Quispe",
    empresa: "Limpieza Total S.R.L.",
    rubro: "limpieza",
    fechaHora: "2024-01-15 08:30:00",
    tipoAcceso: "entrada",
    ubicacion: "Entrada Principal",
    estado: "activo"
  },
  {
    id: 2,
    personalId: 2,
    nombrePersonal: "Pedro García Mendoza",
    empresa: "Mantenimiento Integral",
    rubro: "mantenimiento",
    fechaHora: "2024-01-15 09:15:00",
    tipoAcceso: "entrada",
    ubicacion: "Torre A - Sótano",
    estado: "completado",
    observaciones: "Revisión de bombas de agua"
  },
  {
    id: 3,
    personalId: 1,
    nombrePersonal: "Juana Mamani Quispe",
    empresa: "Limpieza Total S.R.L.",
    rubro: "limpieza",
    fechaHora: "2024-01-15 16:00:00",
    tipoAcceso: "salida",
    ubicacion: "Entrada Principal",
    estado: "completado"
  }
]

export function ServiciosTercerizados() {
  const [activeTab, setActiveTab] = useState('servicios')
  const [searchTerm, setSearchTerm] = useState('')
  const [filtroRubro, setFiltroRubro] = useState<string>('todos')
  const [showQRModal, setShowQRModal] = useState(false)
  const [selectedQR, setSelectedQR] = useState<string>('')

  const getRubroColor = (rubro: string) => {
    const colors = {
      limpieza: 'bg-blue-500',
      mantenimiento: 'bg-orange-500',
      basura: 'bg-green-500',
      jardineria: 'bg-emerald-500'
    }
    return colors[rubro as keyof typeof colors] || 'bg-gray-500'
  }

  const getRubroIcon = (rubro: string) => {
    const icons = {
      limpieza: Building,
      mantenimiento: Wrench,
      basura: Trash2,
      jardineria: Scissors
    }
    const Icon = icons[rubro as keyof typeof icons] || Building
    return Icon
  }

  const getRubroNombre = (rubro: string) => {
    const nombres = {
      limpieza: 'Limpieza',
      mantenimiento: 'Mantenimiento',
      basura: 'Recolección de Basura',
      jardineria: 'Jardinería y Poda'
    }
    return nombres[rubro as keyof typeof nombres] || rubro
  }

  const handleGenerarQR = (codigo: string) => {
    setSelectedQR(codigo)
    setShowQRModal(true)
  }

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Servicios Tercerizados</h1>
          <p className="text-gray-400 mt-1">Gestión de empresas y personal externo con acceso QR</p>
        </div>
        <div className="flex space-x-3">
          <Button variant="outline" className="border-gray-600 text-gray-300 hover:bg-gray-700">
            <Download className="h-4 w-4 mr-2" />
            Exportar Registros
          </Button>
          <Button 
            className="bg-blue-600 hover:bg-blue-700"
            onClick={() => window.open('/admin/servicios/escaner', '_blank')}
          >
            <QrCode className="h-4 w-4 mr-2" />
            Escáner QR
          </Button>
          <Button className="bg-emerald-600 hover:bg-emerald-700">
            <Plus className="h-4 w-4 mr-2" />
            Nuevo Servicio
          </Button>
        </div>
      </div>

      {/* Estadísticas Rápidas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="bg-gray-800 border-gray-700">
          <CardContent className="p-6">
            <div className="flex items-center">
              <Building className="h-8 w-8 text-blue-400 mr-3" />
              <div>
                <p className="text-sm font-medium text-gray-400">Empresas Activas</p>
                <p className="text-2xl font-bold text-white">4</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-800 border-gray-700">
          <CardContent className="p-6">
            <div className="flex items-center">
              <Users className="h-8 w-8 text-green-400 mr-3" />
              <div>
                <p className="text-sm font-medium text-gray-400">Personal Registrado</p>
                <p className="text-2xl font-bold text-white">20</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-800 border-gray-700">
          <CardContent className="p-6">
            <div className="flex items-center">
              <LogIn className="h-8 w-8 text-emerald-400 mr-3" />
              <div>
                <p className="text-sm font-medium text-gray-400">Accesos Hoy</p>
                <p className="text-2xl font-bold text-white">8</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-800 border-gray-700">
          <CardContent className="p-6">
            <div className="flex items-center">
              <QrCode className="h-8 w-8 text-purple-400 mr-3" />
              <div>
                <p className="text-sm font-medium text-gray-400">Códigos QR Activos</p>
                <p className="text-2xl font-bold text-white">24</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4 bg-gray-800">
          <TabsTrigger value="servicios" className="data-[state=active]:bg-emerald-600">
            <Building className="h-4 w-4 mr-2" />
            Empresas
          </TabsTrigger>
          <TabsTrigger value="personal" className="data-[state=active]:bg-emerald-600">
            <Users className="h-4 w-4 mr-2" />
            Personal
          </TabsTrigger>
          <TabsTrigger value="registros" className="data-[state=active]:bg-emerald-600">
            <Activity className="h-4 w-4 mr-2" />
            Registros de Acceso
          </TabsTrigger>
          <TabsTrigger value="qr" className="data-[state=active]:bg-emerald-600">
            <QrCode className="h-4 w-4 mr-2" />
            Gestión QR
          </TabsTrigger>
        </TabsList>

        {/* Pestaña Empresas */}
        <TabsContent value="servicios" className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Buscar empresas..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-gray-800 border-gray-700 text-white placeholder-gray-400"
                />
              </div>
              <select
                value={filtroRubro}
                onChange={(e) => setFiltroRubro(e.target.value)}
                className="bg-gray-800 border-gray-700 text-white rounded-md px-3 py-2"
              >
                <option value="todos">Todos los rubros</option>
                <option value="limpieza">Limpieza</option>
                <option value="mantenimiento">Mantenimiento</option>
                <option value="basura">Recolección de Basura</option>
                <option value="jardineria">Jardinería</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {serviciosMock.map((servicio) => {
              const RubroIcon = getRubroIcon(servicio.rubro)
              return (
                <Card key={servicio.id} className="bg-gray-800 border-gray-700">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className={`p-2 ${getRubroColor(servicio.rubro)}/20 rounded-lg`}>
                          <RubroIcon className="h-6 w-6 text-white" />
                        </div>
                        <div>
                          <CardTitle className="text-white">{servicio.empresa}</CardTitle>
                          <Badge className={`${getRubroColor(servicio.rubro)} text-white mt-1`}>
                            {getRubroNombre(servicio.rubro)}
                          </Badge>
                        </div>
                      </div>
                      <Badge className={servicio.estado === 'activo' ? 'bg-green-500' : 'bg-red-500'}>
                        {servicio.estado}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-gray-400">Contacto</p>
                        <p className="text-white">{servicio.contacto}</p>
                      </div>
                      <div>
                        <p className="text-gray-400">Teléfono</p>
                        <p className="text-white">{servicio.telefono}</p>
                      </div>
                      <div>
                        <p className="text-gray-400">Personal Asignado</p>
                        <p className="text-white">{servicio.personalAsignado} personas</p>
                      </div>
                      <div>
                        <p className="text-gray-400">Contrato desde</p>
                        <p className="text-white">{servicio.fechaContrato}</p>
                      </div>
                    </div>
                    
                    <div className="flex justify-between items-center pt-4 border-t border-gray-700">
                      <div className="flex space-x-2">
                        <Button variant="outline" size="sm" className="border-gray-600 text-gray-300 hover:bg-gray-700">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="sm" className="border-gray-600 text-gray-300 hover:bg-gray-700">
                          <Edit className="h-4 w-4" />
                        </Button>
                      </div>
                      <Button 
                        size="sm" 
                        className="bg-emerald-600 hover:bg-emerald-700"
                        onClick={() => handleGenerarQR(servicio.codigoQR)}
                      >
                        <QrCode className="h-4 w-4 mr-2" />
                        Ver QR
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </TabsContent>

        {/* Pestaña Personal */}
        <TabsContent value="personal" className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-semibold text-white">Personal Registrado</h3>
            <Button className="bg-emerald-600 hover:bg-emerald-700">
              <Plus className="h-4 w-4 mr-2" />
              Registrar Personal
            </Button>
          </div>

          <div className="space-y-4">
            {personalMock.map((persona) => {
              const RubroIcon = getRubroIcon(persona.rubro)
              return (
                <Card key={persona.id} className="bg-gray-800 border-gray-700">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className={`p-2 ${getRubroColor(persona.rubro)}/20 rounded-lg`}>
                          <RubroIcon className="h-6 w-6 text-white" />
                        </div>
                        <div>
                          <h4 className="text-lg font-semibold text-white">
                            {persona.nombre} {persona.apellido}
                          </h4>
                          <p className="text-gray-400">{persona.empresa}</p>
                          <div className="flex items-center space-x-3 mt-1">
                            <Badge className={`${getRubroColor(persona.rubro)} text-white`}>
                              {getRubroNombre(persona.rubro)}
                            </Badge>
                            <Badge className={persona.estado === 'activo' ? 'bg-green-500' : 'bg-red-500'}>
                              {persona.estado}
                            </Badge>
                          </div>
                        </div>
                      </div>
                      
                      <div className="text-right">
                        <div className="flex items-center space-x-2 mb-2">
                          <IdCard className="h-4 w-4 text-gray-400" />
                          <span className="text-white">{persona.ci}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Phone className="h-4 w-4 text-gray-400" />
                          <span className="text-white">{persona.telefono}</span>
                        </div>
                      </div>
                      
                      <div className="flex space-x-2">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="border-gray-600 text-gray-300 hover:bg-gray-700"
                          onClick={() => handleGenerarQR(persona.codigoQR)}
                        >
                          <QrCode className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="sm" className="border-gray-600 text-gray-300 hover:bg-gray-700">
                          <Edit className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </TabsContent>

        {/* Pestaña Registros de Acceso */}
        <TabsContent value="registros" className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-semibold text-white">Registros de Acceso</h3>
            <div className="flex space-x-3">
              <select className="bg-gray-800 border-gray-700 text-white rounded-md px-3 py-2">
                <option>Hoy</option>
                <option>Esta semana</option>
                <option>Este mes</option>
              </select>
              <Button variant="outline" className="border-gray-600 text-gray-300 hover:bg-gray-700">
                <Filter className="h-4 w-4 mr-2" />
                Filtros
              </Button>
            </div>
          </div>

          <div className="space-y-4">
            {registrosMock.map((registro) => {
              const RubroIcon = getRubroIcon(registro.rubro)
              return (
                <Card key={registro.id} className="bg-gray-800 border-gray-700">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className={`p-2 ${getRubroColor(registro.rubro)}/20 rounded-lg`}>
                          <RubroIcon className="h-6 w-6 text-white" />
                        </div>
                        <div>
                          <h4 className="text-lg font-semibold text-white">{registro.nombrePersonal}</h4>
                          <p className="text-gray-400">{registro.empresa}</p>
                          <div className="flex items-center space-x-3 mt-1">
                            <Badge className={`${getRubroColor(registro.rubro)} text-white`}>
                              {getRubroNombre(registro.rubro)}
                            </Badge>
                            <Badge className={registro.tipoAcceso === 'entrada' ? 'bg-green-500' : 'bg-blue-500'}>
                              {registro.tipoAcceso === 'entrada' ? (
                                <><LogIn className="h-3 w-3 mr-1" /> Entrada</>
                              ) : (
                                <><LogOut className="h-3 w-3 mr-1" /> Salida</>
                              )}
                            </Badge>
                          </div>
                        </div>
                      </div>
                      
                      <div className="text-right">
                        <div className="flex items-center space-x-2 mb-2">
                          <Clock className="h-4 w-4 text-gray-400" />
                          <span className="text-white">{registro.fechaHora}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <MapPin className="h-4 w-4 text-gray-400" />
                          <span className="text-white">{registro.ubicacion}</span>
                        </div>
                        {registro.observaciones && (
                          <p className="text-sm text-gray-400 mt-2">{registro.observaciones}</p>
                        )}
                      </div>
                      
                      <Badge className={registro.estado === 'activo' ? 'bg-yellow-500' : 'bg-green-500'}>
                        {registro.estado === 'activo' ? 'En Trabajo' : 'Completado'}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </TabsContent>

        {/* Pestaña Gestión QR */}
        <TabsContent value="qr" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white">Generar Nuevo QR</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label className="text-gray-300">Tipo de Personal</Label>
                  <select className="w-full bg-gray-700 border-gray-600 text-white rounded-md px-3 py-2">
                    <option value="limpieza">Personal de Limpieza</option>
                    <option value="mantenimiento">Personal de Mantenimiento</option>
                    <option value="basura">Personal de Recolección</option>
                    <option value="jardineria">Personal de Jardinería</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <Label className="text-gray-300">Empresa</Label>
                  <select className="w-full bg-gray-700 border-gray-600 text-white rounded-md px-3 py-2">
                    <option>Limpieza Total S.R.L.</option>
                    <option>Mantenimiento Integral</option>
                    <option>EcoRecolección</option>
                    <option>Jardines Verdes</option>
                  </select>
                </div>
                <Button className="w-full bg-emerald-600 hover:bg-emerald-700">
                  <QrCode className="h-4 w-4 mr-2" />
                  Generar Código QR
                </Button>
              </CardContent>
            </Card>

            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white">Códigos QR Activos</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-gray-700 rounded-lg">
                    <div>
                      <p className="text-white font-medium">Personal de Limpieza</p>
                      <p className="text-gray-400 text-sm">8 códigos activos</p>
                    </div>
                    <Button variant="outline" size="sm" className="border-gray-600 text-gray-300">
                      <Eye className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gray-700 rounded-lg">
                    <div>
                      <p className="text-white font-medium">Personal de Mantenimiento</p>
                      <p className="text-gray-400 text-sm">5 códigos activos</p>
                    </div>
                    <Button variant="outline" size="sm" className="border-gray-600 text-gray-300">
                      <Eye className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gray-700 rounded-lg">
                    <div>
                      <p className="text-white font-medium">Personal de Recolección</p>
                      <p className="text-gray-400 text-sm">3 códigos activos</p>
                    </div>
                    <Button variant="outline" size="sm" className="border-gray-600 text-gray-300">
                      <Eye className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gray-700 rounded-lg">
                    <div>
                      <p className="text-white font-medium">Personal de Jardinería</p>
                      <p className="text-gray-400 text-sm">4 códigos activos</p>
                    </div>
                    <Button variant="outline" size="sm" className="border-gray-600 text-gray-300">
                      <Eye className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Modal QR (simulado) */}
      {showQRModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-gray-800 p-6 rounded-lg border border-gray-700 max-w-md w-full mx-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-white">Código QR</h3>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setShowQRModal(false)}
                className="border-gray-600 text-gray-300"
              >
                <XCircle className="h-4 w-4" />
              </Button>
            </div>
            <div className="text-center">
              <div className="bg-white p-4 rounded-lg mx-auto w-48 h-48 flex items-center justify-center mb-4">
                <QrCode className="h-32 w-32 text-black" />
              </div>
              <p className="text-gray-300 mb-2">Código: {selectedQR}</p>
              <p className="text-gray-400 text-sm mb-4">
                Escanea este código QR para registrar el acceso
              </p>
              <Button className="bg-emerald-600 hover:bg-emerald-700">
                <Download className="h-4 w-4 mr-2" />
                Descargar QR
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}