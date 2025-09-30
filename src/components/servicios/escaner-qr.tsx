"use client"

import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  QrCode, Camera, CheckCircle2, XCircle, Clock,
  User, Building, MapPin, AlertTriangle, LogIn,
  LogOut, Smartphone, RefreshCw
} from 'lucide-react'

interface AccesoQR {
  codigoQR: string
  nombre: string
  empresa: string
  rubro: 'limpieza' | 'mantenimiento' | 'basura' | 'jardineria'
  estado: 'autorizado' | 'denegado' | 'suspendido'
  horaAcceso: string
  ubicacion: string
}

export function EscanerQR() {
  const [isScanning, setIsScanning] = useState(false)
  const [ultimoAcceso, setUltimoAcceso] = useState<AccesoQR | null>(null)
  const [estadoEscaner, setEstadoEscaner] = useState<'inactivo' | 'escaneando' | 'procesando'>('inactivo')

  // Simulación de datos que llegarían del QR escaneado
  const datosQRMock: AccesoQR = {
    codigoQR: "QR_PERS_001",
    nombre: "Juana Mamani Quispe",
    empresa: "Limpieza Total S.R.L.",
    rubro: "limpieza",
    estado: "autorizado",
    horaAcceso: new Date().toLocaleString('es-BO'),
    ubicacion: "Entrada Principal"
  }

  const handleIniciarEscaneo = () => {
    setEstadoEscaner('escaneando')
    setIsScanning(true)
    
    // Simular proceso de escaneo
    setTimeout(() => {
      setEstadoEscaner('procesando')
      
      // Simular procesamiento
      setTimeout(() => {
        setUltimoAcceso(datosQRMock)
        setEstadoEscaner('inactivo')
        setIsScanning(false)
        
        // Registrar el acceso (aquí se haría la llamada al backend)
        console.log('Acceso registrado:', datosQRMock)
      }, 1500)
    }, 2000)
  }

  const getRubroColor = (rubro: string) => {
    const colors = {
      limpieza: 'bg-blue-500',
      mantenimiento: 'bg-orange-500',
      basura: 'bg-green-500',
      jardineria: 'bg-emerald-500'
    }
    return colors[rubro as keyof typeof colors] || 'bg-gray-500'
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

  return (
    <div className="space-y-6 p-6 max-w-2xl mx-auto">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-white mb-2">Escáner QR - Acceso de Personal</h1>
        <p className="text-gray-400">Sistema de registro para personal tercerizado</p>
      </div>

      {/* Escáner Principal */}
      <Card className="bg-gray-800 border-gray-700">
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

      {/* Resultado del último acceso */}
      {ultimoAcceso && (
        <Card className="bg-gray-800 border-gray-700">
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
                <Badge className={ultimoAcceso.estado === 'autorizado' ? 'bg-green-500' : 'bg-red-500'}>
                  {ultimoAcceso.estado}
                </Badge>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div className="flex items-center space-x-2">
                <Clock className="h-4 w-4 text-gray-400" />
                <span className="text-gray-300">Hora de Acceso:</span>
                <span className="text-white">{ultimoAcceso.horaAcceso}</span>
              </div>
              <div className="flex items-center space-x-2">
                <MapPin className="h-4 w-4 text-gray-400" />
                <span className="text-gray-300">Ubicación:</span>
                <span className="text-white">{ultimoAcceso.ubicacion}</span>
              </div>
              <div className="flex items-center space-x-2">
                <QrCode className="h-4 w-4 text-gray-400" />
                <span className="text-gray-300">Código QR:</span>
                <span className="text-white">{ultimoAcceso.codigoQR}</span>
              </div>
              <div className="flex items-center space-x-2">
                <LogIn className="h-4 w-4 text-green-400" />
                <span className="text-gray-300">Tipo:</span>
                <span className="text-white">Entrada</span>
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
                <p className="text-red-300 text-sm">Contacte con administración</p>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Instrucciones */}
      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white text-center">Instrucciones de Uso</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3 text-sm text-gray-300">
            <div className="flex items-start space-x-3">
              <div className="bg-emerald-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold mt-0.5">1</div>
              <p>Solicite al personal que muestre su código QR asignado</p>
            </div>
            <div className="flex items-start space-x-3">
              <div className="bg-emerald-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold mt-0.5">2</div>
              <p>Presione "Iniciar Escaneo" y enfoque la cámara hacia el código QR</p>
            </div>
            <div className="flex items-start space-x-3">
              <div className="bg-emerald-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold mt-0.5">3</div>
              <p>El sistema verificará automáticamente los permisos de acceso</p>
            </div>
            <div className="flex items-start space-x-3">
              <div className="bg-emerald-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold mt-0.5">4</div>
              <p>Se registrará la entrada/salida en el sistema automáticamente</p>
            </div>
          </div>
          
          <div className="mt-6 p-4 bg-blue-900/30 border border-blue-700 rounded-lg">
            <div className="flex items-center space-x-2 mb-2">
              <Smartphone className="h-5 w-5 text-blue-400" />
              <span className="text-blue-400 font-medium">Nota Importante:</span>
            </div>
            <p className="text-blue-300 text-sm">
              Cada personal debe tener su código QR único asignado por su empresa. 
              En caso de problemas de acceso, contacte con administración.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}