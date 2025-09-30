"use client"

import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import {
  QrCode, Camera, CheckCircle2, XCircle, Clock,
  User, Building, MapPin, AlertTriangle, LogIn,
  LogOut, Smartphone, RefreshCw, Download, Upload,
  Eye, Trash2, Plus
} from 'lucide-react'

interface AccesoQR {
  codigoQR: string
  nombre: string
  empresa: string
  rubro: 'limpieza' | 'mantenimiento' | 'basura' | 'jardineria' | 'seguridad' | 'delivery'
  estado: 'autorizado' | 'denegado' | 'suspendido'
  horaAcceso: string
  ubicacion: string
  telefono?: string
  observaciones?: string
}

interface PersonalQR {
  id: number
  codigoQR: string
  nombre: string
  empresa: string
  rubro: 'limpieza' | 'mantenimiento' | 'basura' | 'jardineria' | 'seguridad' | 'delivery'
  estado: 'activo' | 'suspendido' | 'bloqueado'
  fechaRegistro: string
  ultimoAcceso?: string
  telefono: string
}

const personalQRMock: PersonalQR[] = [
  {
    id: 1,
    codigoQR: "QR_PERS_001",
    nombre: "Juana Mamani Quispe",
    empresa: "Limpieza Total S.R.L.",
    rubro: "limpieza",
    estado: "activo",
    fechaRegistro: "2024-01-10",
    ultimoAcceso: "2024-01-20 08:30",
    telefono: "70123456"
  },
  {
    id: 2,
    codigoQR: "QR_PERS_002",
    nombre: "Carlos Rodriguez Fernández",
    empresa: "Mantenimiento Integral",
    rubro: "mantenimiento",
    estado: "activo",
    fechaRegistro: "2024-01-15",
    ultimoAcceso: "2024-01-19 14:15",
    telefono: "75987654"
  },
  {
    id: 3,
    codigoQR: "QR_PERS_003",
    nombre: "Miguel Torres Silva",
    empresa: "Jardines del Valle",
    rubro: "jardineria",
    estado: "suspendido",
    fechaRegistro: "2024-01-08",
    ultimoAcceso: "2024-01-18 09:45",
    telefono: "76543210"
  },
  {
    id: 4,
    codigoQR: "QR_PERS_004",
    nombre: "Ana Lucia Vargas",
    empresa: "Recolección Verde",
    rubro: "basura",
    estado: "activo",
    fechaRegistro: "2024-01-12",
    ultimoAcceso: "2024-01-20 06:00",
    telefono: "71234567"
  },
  {
    id: 5,
    codigoQR: "QR_PERS_005",
    nombre: "Roberto Mendoza Cruz",
    empresa: "Seguridad Privada Elite",
    rubro: "seguridad",
    estado: "activo",
    fechaRegistro: "2024-01-05",
    ultimoAcceso: "2024-01-20 22:00",
    telefono: "78901234"
  }
]

export function EscanerQR() {
  const [vistaActual, setVistaActual] = useState<'escaner' | 'personal'>('escaner')
  const [isScanning, setIsScanning] = useState(false)
  const [ultimoAcceso, setUltimoAcceso] = useState<AccesoQR | null>(null)
  const [estadoEscaner, setEstadoEscaner] = useState<'inactivo' | 'escaneando' | 'procesando'>('inactivo')
  const [personalQR, setPersonalQR] = useState(personalQRMock)
  const [searchTerm, setSearchTerm] = useState('')
  const [filtroRubro, setFiltroRubro] = useState<string>('todos')
  const [showModal, setShowModal] = useState(false)
  const [selectedPersonal, setSelectedPersonal] = useState<PersonalQR | null>(null)
  const [notificacion, setNotificacion] = useState<{tipo: 'success' | 'error' | 'info'; mensaje: string} | null>(null)

  // Simulación de datos que llegarían del QR escaneado
  const datosQRMock: AccesoQR[] = [
    {
      codigoQR: "QR_PERS_001",
      nombre: "Juana Mamani Quispe",
      empresa: "Limpieza Total S.R.L.",
      rubro: "limpieza",
      estado: "autorizado",
      horaAcceso: new Date().toLocaleString('es-BO'),
      ubicacion: "Entrada Principal",
      telefono: "70123456"
    },
    {
      codigoQR: "QR_PERS_006",
      nombre: "Pedro Gonzales",
      empresa: "Delivery Express",
      rubro: "delivery",
      estado: "denegado",
      horaAcceso: new Date().toLocaleString('es-BO'),
      ubicacion: "Entrada Principal",
      telefono: "77888999",
      observaciones: "No autorizado para este edificio"
    }
  ]

  const handleIniciarEscaneo = () => {
    setEstadoEscaner('escaneando')
    setIsScanning(true)
    
    // Simular proceso de escaneo
    setTimeout(() => {
      setEstadoEscaner('procesando')
      
      // Simular procesamiento - seleccionar un resultado aleatorio
      setTimeout(() => {
        const resultadoAleatorio = datosQRMock[Math.floor(Math.random() * datosQRMock.length)]
        setUltimoAcceso(resultadoAleatorio)
        setEstadoEscaner('inactivo')
        setIsScanning(false)
        
        // Registrar el acceso (aquí se haría la llamada al backend)
        console.log('Acceso registrado:', resultadoAleatorio)
      }, 1500)
    }, 2000)
  }

  // Funciones para gestión de personal
  const personalFiltrado = personalQR.filter(personal => {
    const matchesSearch = personal.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         personal.empresa.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesRubro = filtroRubro === 'todos' || personal.rubro === filtroRubro
    return matchesSearch && matchesRubro
  })

  // Función para mostrar notificaciones del servidor
  const showServerNotification = (message: string, type: 'success' | 'info' | 'warning' = 'success') => {
    console.log(`Sistema CondoManager: ${message} (${type})`)
    // Simulación de notificación - funcionalidad reducida para evitar conflictos
  }

  const handleCrearPersonal = () => {
    showServerNotification('Formulario de registro de personal cargado correctamente', 'info')
  }

  const handleEditarPersonal = (personal: PersonalQR) => {
    setSelectedPersonal(personal)
    setShowModal(true)
  }

  const handleCambiarEstado = (id: number, nuevoEstado: PersonalQR['estado']) => {
    setPersonalQR(prev => prev.map(p => 
      p.id === id ? { ...p, estado: nuevoEstado } : p
    ))
    showServerNotification(`Estado actualizado exitosamente: ${nuevoEstado}`, 'success')
  }

  const handleGenerarQR = (personal: PersonalQR) => {
    showServerNotification(`Código QR generado exitosamente para ${personal.nombre}`, 'success')
  }

  const handleDescargarQR = (personal: PersonalQR) => {
    showServerNotification(`Descarga iniciada: QR_${personal.nombre}.png`, 'info')
  }

  const getRubroColor = (rubro: string) => {
    const colors = {
      limpieza: 'bg-blue-500',
      mantenimiento: 'bg-orange-500',
      basura: 'bg-green-500',
      jardineria: 'bg-emerald-500',
      seguridad: 'bg-purple-500',
      delivery: 'bg-pink-500'
    }
    return colors[rubro as keyof typeof colors] || 'bg-gray-500'
  }

  const getRubroNombre = (rubro: string) => {
    const nombres = {
      limpieza: 'Limpieza',
      mantenimiento: 'Mantenimiento',
      basura: 'Recolección de Basura',
      jardineria: 'Jardinería y Poda',
      seguridad: 'Seguridad',
      delivery: 'Delivery'
    }
    return nombres[rubro as keyof typeof nombres] || rubro
  }

  const getEstadoColor = (estado: string) => {
    const colors = {
      activo: 'bg-green-500',
      suspendido: 'bg-yellow-500',
      bloqueado: 'bg-red-500',
      autorizado: 'bg-green-500',
      denegado: 'bg-red-500'
    }
    return colors[estado as keyof typeof colors] || 'bg-gray-500'
  }

  return (
    <div className="space-y-6 p-6">
      {/* Header con navegación */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Sistema QR - Personal Tercerizado</h1>
          <p className="text-gray-400">Gestión completa de accesos y personal autorizado</p>
        </div>
        <div className="flex space-x-2">
          <Button 
            variant={vistaActual === 'escaner' ? 'default' : 'outline'}
            onClick={() => setVistaActual('escaner')}
            className="bg-blue-600 hover:bg-blue-700"
          >
            <Camera className="h-4 w-4 mr-2" />
            Escáner
          </Button>
          <Button 
            variant={vistaActual === 'personal' ? 'default' : 'outline'}
            onClick={() => setVistaActual('personal')}
            className="bg-green-600 hover:bg-green-700"
          >
            <User className="h-4 w-4 mr-2" />
            Personal
          </Button>
        </div>
      </div>

      {vistaActual === 'escaner' ? (
        <>
          {/* Escáner Principal */}
          <Card className="bg-gray-800 border-gray-700 max-w-2xl mx-auto">
            <CardHeader>
              <CardTitle className="text-white text-center">
                {estadoEscaner === 'inactivo' && 'Listo para Escanear'}
                {estadoEscaner === 'escaneando' && 'Escaneando Código QR...'}
                {estadoEscaner === 'procesando' && 'Procesando Acceso...'}
              </CardTitle>
            </CardHeader>
            <CardContent className="text-center space-y-6">
              {/* Área del escáner */}
              <div className={`
                mx-auto w-64 h-64 border-4 border-dashed rounded-lg flex items-center justify-center
                ${estadoEscaner === 'escaneando' ? 'border-blue-500 animate-pulse' : 'border-gray-600'}
                ${estadoEscaner === 'procesando' ? 'border-yellow-500' : ''}
              `}>
                {estadoEscaner === 'inactivo' && (
                  <div className="text-center">
                    <QrCode className="h-16 w-16 text-gray-400 mx-auto mb-2" />
                    <p className="text-gray-400">Presiona para escanear</p>
                  </div>
                )}
                {estadoEscaner === 'escaneando' && (
                  <div className="text-center">
                    <Camera className="h-16 w-16 text-blue-400 mx-auto mb-2 animate-pulse" />
                    <p className="text-blue-400">Enfoca el código QR</p>
                  </div>
                )}
                {estadoEscaner === 'procesando' && (
                  <div className="text-center">
                    <RefreshCw className="h-16 w-16 text-yellow-400 mx-auto mb-2 animate-spin" />
                    <p className="text-yellow-400">Verificando acceso...</p>
                  </div>
                )}
              </div>

              {/* Botón de acción */}
              <Button
                onClick={handleIniciarEscaneo}
                disabled={isScanning}
                className={`
                  px-8 py-3 text-lg
                  ${estadoEscaner === 'inactivo' ? 'bg-emerald-600 hover:bg-emerald-700' : ''}
                  ${estadoEscaner === 'escaneando' ? 'bg-blue-600' : ''}
                  ${estadoEscaner === 'procesando' ? 'bg-yellow-600' : ''}
                `}
              >
                {estadoEscaner === 'inactivo' && (
                  <>
                    <Camera className="h-5 w-5 mr-2" />
                    Iniciar Escaneo
                  </>
                )}
                {estadoEscaner === 'escaneando' && (
                  <>
                    <Camera className="h-5 w-5 mr-2 animate-pulse" />
                    Escaneando...
                  </>
                )}
                {estadoEscaner === 'procesando' && (
                  <>
                    <RefreshCw className="h-5 w-5 mr-2 animate-spin" />
                    Procesando...
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        </>
      ) : (
        <>
          {/* Vista de Gestión de Personal */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Input
                placeholder="Buscar personal..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="bg-gray-800 border-gray-700 text-white placeholder-gray-400"
              />
              <select
                value={filtroRubro}
                onChange={(e) => setFiltroRubro(e.target.value)}
                className="bg-gray-800 border-gray-700 text-white rounded-md px-3 py-2"
              >
                <option value="todos">Todos los rubros</option>
                <option value="limpieza">Limpieza</option>
                <option value="mantenimiento">Mantenimiento</option>
                <option value="jardineria">Jardinería</option>
                <option value="basura">Recolección</option>
                <option value="seguridad">Seguridad</option>
                <option value="delivery">Delivery</option>
              </select>
            </div>
            <Button onClick={handleCrearPersonal} className="bg-green-600 hover:bg-green-700">
              <Plus className="h-4 w-4 mr-2" />
              Registrar Personal
            </Button>
          </div>

          {/* Lista de Personal */}
          <div className="grid gap-4">
            {personalFiltrado.map((personal) => (
              <Card key={personal.id} className="bg-gray-800 border-gray-700">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="text-lg font-semibold text-white">{personal.nombre}</h3>
                        <Badge className={`${getEstadoColor(personal.estado)} text-white`}>
                          {personal.estado}
                        </Badge>
                        <Badge className={`${getRubroColor(personal.rubro)} text-white`}>
                          {getRubroNombre(personal.rubro)}
                        </Badge>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <p className="text-gray-400">Empresa:</p>
                          <p className="text-white">{personal.empresa}</p>
                        </div>
                        <div>
                          <p className="text-gray-400">Teléfono:</p>
                          <p className="text-white">{personal.telefono}</p>
                        </div>
                        <div>
                          <p className="text-gray-400">Registro:</p>
                          <p className="text-white">{personal.fechaRegistro}</p>
                        </div>
                        <div>
                          <p className="text-gray-400">Último Acceso:</p>
                          <p className="text-white">{personal.ultimoAcceso || 'Nunca'}</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex flex-col space-y-2">
                      <Button
                        size="sm"
                        onClick={() => handleGenerarQR(personal)}
                        className="bg-blue-600 hover:bg-blue-700"
                      >
                        <QrCode className="h-4 w-4 mr-1" />
                        Ver QR
                      </Button>
                      <Button
                        size="sm"
                        onClick={() => handleDescargarQR(personal)}
                        className="bg-purple-600 hover:bg-purple-700"
                      >
                        <Download className="h-4 w-4 mr-1" />
                        Descargar
                      </Button>
                      <Button
                        size="sm"
                        onClick={() => handleEditarPersonal(personal)}
                        variant="outline"
                        className="border-gray-600 text-gray-300 hover:bg-gray-700"
                      >
                        <Eye className="h-4 w-4 mr-1" />
                        Editar
                      </Button>
                      {personal.estado === 'activo' ? (
                        <Button
                          size="sm"
                          onClick={() => handleCambiarEstado(personal.id, 'suspendido')}
                          className="bg-yellow-600 hover:bg-yellow-700"
                        >
                          Suspender
                        </Button>
                      ) : (
                        <Button
                          size="sm"
                          onClick={() => handleCambiarEstado(personal.id, 'activo')}
                          className="bg-green-600 hover:bg-green-700"
                        >
                          Activar
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </>
      )}

      {/* Resultado del último acceso - Solo en vista escáner */}
      {vistaActual === 'escaner' && ultimoAcceso && (
        <Card className="bg-gray-800 border-gray-700 max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle className="text-white flex items-center justify-center">
              {ultimoAcceso.estado === 'autorizado' ? (
                <>
                  <CheckCircle2 className="h-6 w-6 text-green-400 mr-2" />
                  Acceso Autorizado
                </>
              ) : (
                <>
                  <XCircle className="h-6 w-6 text-red-400 mr-2" />
                  Acceso Denegado
                </>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-center">
              <h3 className="text-xl font-semibold text-white mb-2">{ultimoAcceso.nombre}</h3>
              <p className="text-gray-400 mb-3">{ultimoAcceso.empresa}</p>
              
              <div className="flex justify-center space-x-3 mb-4">
                <Badge className={`${getRubroColor(ultimoAcceso.rubro)} text-white`}>
                  {getRubroNombre(ultimoAcceso.rubro)}
                </Badge>
                <Badge className={`${getEstadoColor(ultimoAcceso.estado)} text-white`}>
                  {ultimoAcceso.estado}
                </Badge>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div className="flex items-center space-x-2">
                <Clock className="h-4 w-4 text-gray-400" />
                <span className="text-gray-300">Hora:</span>
                <span className="text-white">{ultimoAcceso.horaAcceso}</span>
              </div>
              <div className="flex items-center space-x-2">
                <MapPin className="h-4 w-4 text-gray-400" />
                <span className="text-gray-300">Ubicación:</span>
                <span className="text-white">{ultimoAcceso.ubicacion}</span>
              </div>
              {ultimoAcceso.telefono && (
                <div className="flex items-center space-x-2">
                  <Smartphone className="h-4 w-4 text-gray-400" />
                  <span className="text-gray-300">Teléfono:</span>
                  <span className="text-white">{ultimoAcceso.telefono}</span>
                </div>
              )}
              <div className="flex items-center space-x-2">
                <QrCode className="h-4 w-4 text-gray-400" />
                <span className="text-gray-300">Código:</span>
                <span className="text-white">{ultimoAcceso.codigoQR}</span>
              </div>
            </div>

            {ultimoAcceso.estado === 'autorizado' && (
              <div className="bg-green-900/30 border border-green-700 rounded-lg p-4 text-center">
                <CheckCircle2 className="h-8 w-8 text-green-400 mx-auto mb-2" />
                <p className="text-green-400 font-medium">¡Bienvenido!</p>
                <p className="text-green-300 text-sm">Acceso registrado correctamente</p>
              </div>
            )}

            {ultimoAcceso.estado !== 'autorizado' && (
              <div className="bg-red-900/30 border border-red-700 rounded-lg p-4 text-center">
                <XCircle className="h-8 w-8 text-red-400 mx-auto mb-2" />
                <p className="text-red-400 font-medium">Acceso Denegado</p>
                <p className="text-red-300 text-sm">{ultimoAcceso.observaciones || 'Contacte con administración'}</p>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Modal de Edición */}
      {showModal && selectedPersonal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <Card className="bg-gray-800 border-gray-700 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <CardHeader>
              <div className="flex justify-between items-start">
                <CardTitle className="text-white text-xl">Detalles del Personal</CardTitle>
                <Button 
                  variant="ghost" 
                  onClick={() => setShowModal(false)}
                  className="text-gray-400 hover:text-white"
                >
                  ✕
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-semibold text-white mb-4">Información Personal</h3>
                  <div className="space-y-3">
                    <div>
                      <p className="text-sm text-gray-400">Nombre Completo</p>
                      <p className="text-white font-medium">{selectedPersonal.nombre}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-400">Empresa</p>
                      <p className="text-white">{selectedPersonal.empresa}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-400">Teléfono</p>
                      <p className="text-white">{selectedPersonal.telefono}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-400">Rubro</p>
                      <Badge className={`${getRubroColor(selectedPersonal.rubro)} text-white`}>
                        {getRubroNombre(selectedPersonal.rubro)}
                      </Badge>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold text-white mb-4">Estado y Accesos</h3>
                  <div className="space-y-3">
                    <div>
                      <p className="text-sm text-gray-400">Estado Actual</p>
                      <Badge className={`${getEstadoColor(selectedPersonal.estado)} text-white`}>
                        {selectedPersonal.estado}
                      </Badge>
                    </div>
                    <div>
                      <p className="text-sm text-gray-400">Fecha de Registro</p>
                      <p className="text-white">{selectedPersonal.fechaRegistro}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-400">Último Acceso</p>
                      <p className="text-white">{selectedPersonal.ultimoAcceso || 'Nunca'}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-400">Código QR</p>
                      <p className="text-white font-mono text-sm">{selectedPersonal.codigoQR}</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="flex justify-between items-center pt-4 border-t border-gray-700">
                <div className="flex space-x-2">
                  <Button 
                    onClick={() => handleGenerarQR(selectedPersonal)}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    <QrCode className="h-4 w-4 mr-2" />
                    Ver QR
                  </Button>
                  <Button 
                    onClick={() => handleDescargarQR(selectedPersonal)}
                    className="bg-purple-600 hover:bg-purple-700"
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Descargar QR
                  </Button>
                </div>
                <Button 
                  variant="outline" 
                  onClick={() => setShowModal(false)}
                  className="border-gray-600 text-gray-300"
                >
                  Cerrar
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}