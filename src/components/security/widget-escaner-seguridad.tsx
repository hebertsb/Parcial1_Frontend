"use client"

import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  QrCode, Camera, CheckCircle2, XCircle, Clock,
  User, Building, Shield, AlertTriangle, UserCheck
} from 'lucide-react'

interface UltimoAcceso {
  nombre: string
  empresa: string
  rubro: string
  estado: 'autorizado' | 'denegado'
  hora: string
}

export function WidgetEscanerSeguridad() {
  const [ultimoAcceso, setUltimoAcceso] = useState<UltimoAcceso>({
    nombre: "María Elena Vargas",
    empresa: "Limpieza Total S.R.L.",
    rubro: "limpieza",
    estado: "autorizado",
    hora: "08:30"
  })

  const handleOpenEscaner = () => {
    window.open('/admin/seguridad/visitas', '_blank')
  }

  return (
    <Card className="bg-gray-800 border-gray-700">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-white">
          <QrCode className="h-5 w-5" />
          Escáner QR - Acceso Rápido
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="text-center">
          <div className="w-16 h-16 bg-emerald-600 rounded-full mx-auto flex items-center justify-center mb-3">
            <Camera className="h-8 w-8 text-white" />
          </div>
          <p className="text-sm text-gray-300 mb-3">
            Escanea códigos QR de personal tercerizado para autorizar el acceso
          </p>
          <Button onClick={handleOpenEscaner} className="bg-emerald-600 hover:bg-emerald-700">
            <QrCode className="h-4 w-4 mr-2" />
            Abrir Escáner
          </Button>
        </div>

        {ultimoAcceso && (
          <div className="border-t border-gray-600 pt-4">
            <h4 className="text-sm font-medium text-white mb-2">Último Acceso Procesado:</h4>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-200">{ultimoAcceso.nombre}</p>
                <p className="text-xs text-gray-400">{ultimoAcceso.empresa}</p>
              </div>
              <div className="text-right">
                <Badge className={ultimoAcceso.estado === 'autorizado' ? 'bg-green-500' : 'bg-red-500'}>
                  {ultimoAcceso.estado === 'autorizado' ? (
                    <><CheckCircle2 className="h-3 w-3 mr-1" /> Autorizado</>
                  ) : (
                    <><XCircle className="h-3 w-3 mr-1" /> Denegado</>
                  )}
                </Badge>
                <p className="text-xs text-gray-400 mt-1">{ultimoAcceso.hora}</p>
              </div>
            </div>
          </div>
        )}

        <div className="bg-gray-700 p-3 rounded-lg">
          <div className="flex items-center space-x-2 text-gray-200">
            <Shield className="h-4 w-4" />
            <span className="text-sm font-medium">Estado del Sistema:</span>
          </div>
          <p className="text-sm text-gray-300 mt-1">
            ✅ Escáner operativo • 🔒 Seguridad activa
          </p>
        </div>
      </CardContent>
    </Card>
  )
}