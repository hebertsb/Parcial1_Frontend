"use client"

import React, { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  QrCode, Camera, Users, Clock, CheckCircle2, XCircle, 
  AlertTriangle, User, Building, MapPin, Phone, IdCard,
  LogIn, LogOut, RefreshCw, Search, Filter, Eye, Shield,
  Activity, UserCheck, Ban, Smartphone, Wifi
} from 'lucide-react'

interface VisitaTercerizada {
  id: number
  codigoQR: string
  nombre: string
  apellido: string
  ci: string
  empresa: string
  rubro: 'limpieza' | 'mantenimiento' | 'basura' | 'jardineria' | 'delivery' | 'tecnico'
  telefono: string
  horaLlegada: string
  estado: 'esperando' | 'autorizado' | 'denegado' | 'en_trabajo' | 'completado'
  ubicacionDestino: string
  motivoVisita: string
  autorizadoPor?: string
  observaciones?: string
  foto?: string
}

interface RegistroAccesoTercerizado {
  id: number
  visitaId: number
  tipoAcceso: 'entrada' | 'salida'
  fechaHora: string
  puestoSeguridad: string
  guardiaResponsable: string
  estado: 'exitoso' | 'fallido'
  observaciones?: string
}

const visitasMock: VisitaTercerizada[] = [
  {
    id: 1,
    codigoQR: "QR_TERCERIZADO_001",
    nombre: "María Elena",
    apellido: "Vargas Soto",
    ci: "12345678 SC",
    empresa: "Limpieza Total S.R.L.",
    rubro: "limpieza",
    telefono: "+591 70123456",
    horaLlegada: "08:30:00",
    estado: "en_trabajo",
    ubicacionDestino: "Torre A - Pisos 1-5",
    motivoVisita: "Limpieza general de áreas comunes",
    autorizadoPor: "Carlos Méndez - Seguridad",
    foto: "/api/placeholder/100/100"
  },
  {
    id: 2,
    codigoQR: "QR_TERCERIZADO_002",
    nombre: "Pedro Luis",
    apellido: "García Mamani",
    ci: "23456789 SC",
    empresa: "Mantenimiento Integral",
    rubro: "mantenimiento",
    telefono: "+591 70234567",
    horaLlegada: "09:15:00",
    estado: "esperando",
    ubicacionDestino: "Sótano - Bombas de agua",
    motivoVisita: "Revisión mensual de sistema de bombeo",
    observaciones: "Solicita acceso al cuarto de máquinas"
  },
  {
    id: 3,
    codigoQR: "QR_TERCERIZADO_003",
    nombre: "Rosa María",
    apellido: "Flores Castro",
    ci: "34567890 SC",
    empresa: "EcoRecolección",
    rubro: "basura",
    telefono: "+591 70345678",
    horaLlegada: "06:00:00",
    estado: "completado",
    ubicacionDestino: "Contenedores externos",
    motivoVisita: "Recolección de residuos sólidos",
    autorizadoPor: "Ana López - Seguridad"
  }
]

const registrosMock: RegistroAccesoTercerizado[] = [
  {
    id: 1,
    visitaId: 1,
    tipoAcceso: "entrada",
    fechaHora: "2024-01-15 08:30:22",
    puestoSeguridad: "Garita Principal",
    guardiaResponsable: "Carlos Méndez",
    estado: "exitoso"
  },
  {
    id: 2,
    visitaId: 3,
    tipoAcceso: "entrada",
    fechaHora: "2024-01-15 06:00:15",
    puestoSeguridad: "Garita Principal",
    guardiaResponsable: "Ana López",
    estado: "exitoso"
  },
  {
    id: 3,
    visitaId: 3,
    tipoAcceso: "salida",
    fechaHora: "2024-01-15 06:45:30",
    puestoSeguridad: "Garita Principal",
    guardiaResponsable: "Ana López",
    estado: "exitoso"
  }
]

export function ControlVisitasTercerizadas() {
  const [activeTab, setActiveTab] = useState('escaner')
  const [isScanning, setIsScanning] = useState(false)
  const [scanResult, setScanResult] = useState<VisitaTercerizada | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [filtroEstado, setFiltroEstado] = useState<string>('todos')
  const [estadoEscaner, setEstadoEscaner] = useState<'inactivo' | 'escaneando' | 'procesando'>('inactivo')

  const getRubroColor = (rubro: string) => {
    const colors = {
      limpieza: 'bg-blue-500',
      mantenimiento: 'bg-orange-500',
      basura: 'bg-green-500',
      jardineria: 'bg-emerald-500',
      delivery: 'bg-purple-500',
      tecnico: 'bg-red-500'
    }
    return colors[rubro as keyof typeof colors] || 'bg-gray-500'
  }

  const getEstadoColor = (estado: string) => {
    const colors = {
      esperando: 'bg-yellow-500',
      autorizado: 'bg-green-500',
      denegado: 'bg-red-500',
      en_trabajo: 'bg-blue-500',
      completado: 'bg-gray-500'
    }
    return colors[estado as keyof typeof colors] || 'bg-gray-500'
  }

  const getRubroNombre = (rubro: string) => {
    const nombres = {
      limpieza: 'Limpieza',
      mantenimiento: 'Mantenimiento',
      basura: 'Recolección',
      jardineria: 'Jardinería',
      delivery: 'Delivery',
      tecnico: 'Técnico'
    }
    return nombres[rubro as keyof typeof nombres] || rubro
  }

  const handleEscanearQR = () => {
    setEstadoEscaner('escaneando')
    setIsScanning(true)

    // Simular escaneo QR
    setTimeout(() => {
      setEstadoEscaner('procesando')
      
      setTimeout(() => {
        // Simular resultado del escaneo
        const visitaEncontrada = visitasMock.find(v => v.estado === 'esperando')
        if (visitaEncontrada) {
          setScanResult(visitaEncontrada)
        }
        setEstadoEscaner('inactivo')
        setIsScanning(false)
      }, 1500)
    }, 2000)
  }

  const handleAutorizarAcceso = (visitaId: number) => {
    console.log('Autorizando acceso para visita:', visitaId)
    // Aquí se actualizaría el estado en el backend
    if (scanResult) {
      setScanResult({...scanResult, estado: 'autorizado', autorizadoPor: 'Sistema Seguridad'})
    }
  }

  const handleDenegarAcceso = (visitaId: number) => {
    console.log('Denegando acceso para visita:', visitaId)
    // Aquí se actualizaría el estado en el backend
    if (scanResult) {
      setScanResult({...scanResult, estado: 'denegado'})
    }
  }

  const handleRegistrarSalida = (visitaId: number) => {
    console.log('Registrando salida para visita:', visitaId)
    // Aquí se registraría la salida en el backend
  }

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Control de Visitas - Personal Tercerizado</h1>
          <p className="text-gray-400 mt-1">Gestión de acceso y control de personal externo</p>
        </div>
        <div className="flex space-x-3">
          <Button variant="outline" className="border-gray-600 text-gray-300 hover:bg-gray-700">
            <Activity className="h-4 w-4 mr-2" />
            Registro de Hoy
          </Button>
          <Button className="bg-emerald-600 hover:bg-emerald-700">
            <Shield className="h-4 w-4 mr-2" />
            Nueva Autorización
          </Button>
        </div>
      </div>

      {/* Estadísticas Rápidas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="bg-gray-800 border-gray-700">
          <CardContent className="p-6">
            <div className="flex items-center">
              <Users className="h-8 w-8 text-blue-400 mr-3" />
              <div>
                <p className="text-sm font-medium text-gray-400">Visitas Hoy</p>
                <p className="text-2xl font-bold text-white">8</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-800 border-gray-700">
          <CardContent className="p-6">
            <div className="flex items-center">
              <UserCheck className="h-8 w-8 text-green-400 mr-3" />
              <div>
                <p className="text-sm font-medium text-gray-400">Autorizadas</p>
                <p className="text-2xl font-bold text-white">6</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-800 border-gray-700">
          <CardContent className="p-6">
            <div className="flex items-center">
              <Clock className="h-8 w-8 text-yellow-400 mr-3" />
              <div>
                <p className="text-sm font-medium text-gray-400">En Trabajo</p>
                <p className="text-2xl font-bold text-white">3</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-800 border-gray-700">
          <CardContent className="p-6">
            <div className="flex items-center">
              <Ban className="h-8 w-8 text-red-400 mr-3" />
              <div>
                <p className="text-sm font-medium text-gray-400">Denegadas</p>
                <p className="text-2xl font-bold text-white">1</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3 bg-gray-800">
          <TabsTrigger value="escaner" className="data-[state=active]:bg-emerald-600">
            <QrCode className="h-4 w-4 mr-2" />
            Escáner QR
          </TabsTrigger>
          <TabsTrigger value="visitas" className="data-[state=active]:bg-emerald-600">
            <Users className="h-4 w-4 mr-2" />
            Visitas Activas
          </TabsTrigger>
          <TabsTrigger value="registros" className="data-[state=active]:bg-emerald-600">
            <Activity className="h-4 w-4 mr-2" />
            Registro de Accesos
          </TabsTrigger>
        </TabsList>

        {/* Pestaña Escáner QR */}
        <TabsContent value="escaner" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Área de Escaneo */}
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white text-center">
                  {estadoEscaner === 'inactivo' && 'Escáner QR - Control de Acceso'}
                  {estadoEscaner === 'escaneando' && 'Escaneando Código QR...'}
                  {estadoEscaner === 'procesando' && 'Verificando Credenciales...'}
                </CardTitle>
              </CardHeader>
              <CardContent className="text-center space-y-6">
                <div className={`
                  mx-auto w-48 h-48 border-4 border-dashed rounded-lg flex items-center justify-center
                  ${estadoEscaner === 'escaneando' ? 'border-blue-500 animate-pulse' : 'border-gray-600'}
                  ${estadoEscaner === 'procesando' ? 'border-yellow-500' : ''}
                `}>
                  {estadoEscaner === 'inactivo' && (
                    <div className="text-center">
                      <QrCode className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                      <p className="text-gray-400 text-sm">Presiona para escanear</p>
                    </div>
                  )}
                  {estadoEscaner === 'escaneando' && (
                    <div className="text-center">
                      <Camera className="h-12 w-12 text-blue-400 mx-auto mb-2 animate-pulse" />
                      <p className="text-blue-400 text-sm">Enfoca el código QR</p>
                    </div>
                  )}
                  {estadoEscaner === 'procesando' && (
                    <div className="text-center">
                      <RefreshCw className="h-12 w-12 text-yellow-400 mx-auto mb-2 animate-spin" />
                      <p className="text-yellow-400 text-sm">Verificando...</p>
                    </div>
                  )}
                </div>

                <Button
                  onClick={handleEscanearQR}
                  disabled={isScanning}
                  className={`
                    px-6 py-3
                    ${estadoEscaner === 'inactivo' ? 'bg-emerald-600 hover:bg-emerald-700' : ''}
                    ${estadoEscaner === 'escaneando' ? 'bg-blue-600' : ''}
                    ${estadoEscaner === 'procesando' ? 'bg-yellow-600' : ''}
                  `}
                >
                  {estadoEscaner === 'inactivo' && (
                    <>
                      <Camera className="h-4 w-4 mr-2" />
                      Iniciar Escaneo
                    </>
                  )}
                  {estadoEscaner === 'escaneando' && 'Escaneando...'}
                  {estadoEscaner === 'procesando' && 'Procesando...'}
                </Button>
              </CardContent>
            </Card>

            {/* Resultado del Escaneo */}
            {scanResult && (
              <Card className="bg-gray-800 border-gray-700">
                <CardHeader>
                  <CardTitle className="text-white flex items-center justify-center">
                    <UserCheck className="h-6 w-6 text-blue-400 mr-2" />
                    Información del Visitante
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="text-center">
                    <div className="w-20 h-20 bg-gray-700 rounded-full mx-auto mb-3 flex items-center justify-center">
                      <User className="h-10 w-10 text-gray-400" />
                    </div>
                    <h3 className="text-xl font-semibold text-white">
                      {scanResult.nombre} {scanResult.apellido}
                    </h3>
                    <p className="text-gray-400">{scanResult.empresa}</p>
                    
                    <div className="flex justify-center space-x-2 mt-2">
                      <Badge className={`${getRubroColor(scanResult.rubro)} text-white`}>
                        {getRubroNombre(scanResult.rubro)}
                      </Badge>
                      <Badge className={`${getEstadoColor(scanResult.estado)} text-white`}>
                        {scanResult.estado}
                      </Badge>
                    </div>
                  </div>

                  <div className="space-y-3 text-sm">
                    <div className="flex items-center space-x-2">
                      <IdCard className="h-4 w-4 text-gray-400" />
                      <span className="text-gray-300">CI:</span>
                      <span className="text-white">{scanResult.ci}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Phone className="h-4 w-4 text-gray-400" />
                      <span className="text-gray-300">Teléfono:</span>
                      <span className="text-white">{scanResult.telefono}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <MapPin className="h-4 w-4 text-gray-400" />
                      <span className="text-gray-300">Destino:</span>
                      <span className="text-white">{scanResult.ubicacionDestino}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Clock className="h-4 w-4 text-gray-400" />
                      <span className="text-gray-300">Hora de llegada:</span>
                      <span className="text-white">{scanResult.horaLlegada}</span>
                    </div>
                  </div>

                  <div className="bg-gray-700 p-3 rounded-lg">
                    <p className="text-gray-300 text-sm">
                      <strong>Motivo:</strong> {scanResult.motivoVisita}
                    </p>
                    {scanResult.observaciones && (
                      <p className="text-gray-400 text-sm mt-1">
                        <strong>Observaciones:</strong> {scanResult.observaciones}
                      </p>
                    )}
                  </div>

                  {/* Botones de Acción */}
                  {scanResult.estado === 'esperando' && (
                    <div className="flex space-x-3">
                      <Button 
                        onClick={() => handleAutorizarAcceso(scanResult.id)}
                        className="flex-1 bg-green-600 hover:bg-green-700"
                      >
                        <CheckCircle2 className="h-4 w-4 mr-2" />
                        Autorizar
                      </Button>
                      <Button 
                        onClick={() => handleDenegarAcceso(scanResult.id)}
                        variant="outline"
                        className="flex-1 border-red-600 text-red-400 hover:bg-red-900"
                      >
                        <XCircle className="h-4 w-4 mr-2" />
                        Denegar
                      </Button>
                    </div>
                  )}

                  {scanResult.estado === 'en_trabajo' && (
                    <Button 
                      onClick={() => handleRegistrarSalida(scanResult.id)}
                      className="w-full bg-blue-600 hover:bg-blue-700"
                    >
                      <LogOut className="h-4 w-4 mr-2" />
                      Registrar Salida
                    </Button>
                  )}

                  {scanResult.estado === 'autorizado' && (
                    <div className="bg-green-900/30 border border-green-700 rounded-lg p-3 text-center">
                      <CheckCircle2 className="h-6 w-6 text-green-400 mx-auto mb-1" />
                      <p className="text-green-400 font-medium">Acceso Autorizado</p>
                      <p className="text-green-300 text-sm">El visitante puede ingresar</p>
                    </div>
                  )}

                  {scanResult.estado === 'denegado' && (
                    <div className="bg-red-900/30 border border-red-700 rounded-lg p-3 text-center">
                      <XCircle className="h-6 w-6 text-red-400 mx-auto mb-1" />
                      <p className="text-red-400 font-medium">Acceso Denegado</p>
                      <p className="text-red-300 text-sm">Contacte con administración</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>

        {/* Pestaña Visitas Activas */}
        <TabsContent value="visitas" className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Buscar visitantes..."
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
                <option value="esperando">Esperando</option>
                <option value="autorizado">Autorizado</option>
                <option value="en_trabajo">En Trabajo</option>
                <option value="completado">Completado</option>
                <option value="denegado">Denegado</option>
              </select>
            </div>
          </div>

          <div className="space-y-4">
            {visitasMock.map((visita) => (
              <Card key={visita.id} className="bg-gray-800 border-gray-700">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-gray-700 rounded-full flex items-center justify-center">
                        <User className="h-6 w-6 text-gray-400" />
                      </div>
                      <div>
                        <h4 className="text-lg font-semibold text-white">
                          {visita.nombre} {visita.apellido}
                        </h4>
                        <p className="text-gray-400">{visita.empresa}</p>
                        <div className="flex items-center space-x-3 mt-1">
                          <Badge className={`${getRubroColor(visita.rubro)} text-white`}>
                            {getRubroNombre(visita.rubro)}
                          </Badge>
                          <Badge className={`${getEstadoColor(visita.estado)} text-white`}>
                            {visita.estado}
                          </Badge>
                        </div>
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <div className="flex items-center space-x-2 mb-1">
                        <Clock className="h-4 w-4 text-gray-400" />
                        <span className="text-white text-sm">{visita.horaLlegada}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <MapPin className="h-4 w-4 text-gray-400" />
                        <span className="text-white text-sm">{visita.ubicacionDestino}</span>
                      </div>
                      {visita.autorizadoPor && (
                        <p className="text-gray-400 text-xs mt-1">
                          Por: {visita.autorizadoPor}
                        </p>
                      )}
                    </div>
                    
                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm" className="border-gray-600 text-gray-300 hover:bg-gray-700">
                        <Eye className="h-4 w-4" />
                      </Button>
                      {visita.estado === 'esperando' && (
                        <>
                          <Button size="sm" className="bg-green-600 hover:bg-green-700">
                            <CheckCircle2 className="h-4 w-4" />
                          </Button>
                          <Button variant="outline" size="sm" className="border-red-600 text-red-400">
                            <XCircle className="h-4 w-4" />
                          </Button>
                        </>
                      )}
                      {visita.estado === 'en_trabajo' && (
                        <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                          <LogOut className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Pestaña Registro de Accesos */}
        <TabsContent value="registros" className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-semibold text-white">Registro de Accesos de Hoy</h3>
            <Button variant="outline" className="border-gray-600 text-gray-300 hover:bg-gray-700">
              <Filter className="h-4 w-4 mr-2" />
              Filtrar por Fecha
            </Button>
          </div>

          <div className="space-y-4">
            {registrosMock.map((registro) => (
              <Card key={registro.id} className="bg-gray-800 border-gray-700">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className={`p-2 rounded-lg ${registro.tipoAcceso === 'entrada' ? 'bg-green-500/20' : 'bg-blue-500/20'}`}>
                        {registro.tipoAcceso === 'entrada' ? (
                          <LogIn className="h-5 w-5 text-green-400" />
                        ) : (
                          <LogOut className="h-5 w-5 text-blue-400" />
                        )}
                      </div>
                      <div>
                        <p className="text-white font-medium">
                          {registro.tipoAcceso === 'entrada' ? 'Entrada' : 'Salida'} - Visita #{registro.visitaId}
                        </p>
                        <p className="text-gray-400 text-sm">{registro.puestoSeguridad}</p>
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <p className="text-white">{registro.fechaHora}</p>
                      <p className="text-gray-400 text-sm">Por: {registro.guardiaResponsable}</p>
                    </div>
                    
                    <Badge className={registro.estado === 'exitoso' ? 'bg-green-500' : 'bg-red-500'}>
                      {registro.estado}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}