"use client"

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { 
  Shield, 
  Camera, 
  UserCheck, 
  AlertTriangle, 
  Activity, 
  Users,
  QrCode,
  Eye,
  Clock,
  CheckCircle2
} from 'lucide-react'

export default function SecurityDashboard() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-white">Dashboard de Seguridad</h1>
          <p className="text-gray-400 mt-2">Centro de control del sistema de seguridad residencial</p>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
          <span className="text-gray-300">Sistema Activo</span>
        </div>
      </div>

      {/* Estadísticas principales */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-300">Usuarios Activos</CardTitle>
            <Users className="h-4 w-4 text-gray-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">157</div>
            <p className="text-xs text-gray-400">
              +12 desde ayer
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gray-800 border-gray-700">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-300">Reconocimientos Hoy</CardTitle>
            <Camera className="h-4 w-4 text-gray-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">89</div>
            <p className="text-xs text-gray-400">
              Detecciones exitosas
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gray-800 border-gray-700">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-300">Incidentes Abiertos</CardTitle>
            <AlertTriangle className="h-4 w-4 text-gray-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">3</div>
            <p className="text-xs text-gray-400">
              Requieren atención
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gray-800 border-gray-700">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-300">Alertas Activas</CardTitle>
            <Shield className="h-4 w-4 text-gray-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">1</div>
            <p className="text-xs text-gray-400">
              Monitoreo continuo
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Accesos directos y control de visitas */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Accesos Rápidos */}
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white">Accesos Rápidos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <Button 
                className="h-20 flex flex-col items-center justify-center bg-emerald-600 hover:bg-emerald-700"
                onClick={() => window.open('/admin/seguridad/reconocimiento-facial', '_blank')}
              >
                <Camera className="h-6 w-6 mb-2" />
                <span className="text-sm">Reconocimiento</span>
              </Button>
              
              <Button 
                className="h-20 flex flex-col items-center justify-center bg-blue-600 hover:bg-blue-700"
                onClick={() => window.open('/admin/seguridad/visitas', '_blank')}
              >
                <UserCheck className="h-6 w-6 mb-2" />
                <span className="text-sm">Control Visitas</span>
              </Button>
              
              <Button 
                className="h-20 flex flex-col items-center justify-center bg-purple-600 hover:bg-purple-700"
                onClick={() => window.open('/admin/servicios/escaner', '_blank')}
              >
                <QrCode className="h-6 w-6 mb-2" />
                <span className="text-sm">Escáner QR</span>
              </Button>
              
              <Button 
                className="h-20 flex flex-col items-center justify-center bg-orange-600 hover:bg-orange-700"
                onClick={() => window.open('/security/monitoreo', '_blank')}
              >
                <Eye className="h-6 w-6 mb-2" />
                <span className="text-sm">Monitoreo</span>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Control de Visitas - Resumen */}
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-white">
              <UserCheck className="h-5 w-5" />
              Control de Visitas - Hoy
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-emerald-400">12</div>
                <p className="text-sm text-gray-300">Visitas Hoy</p>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-400">10</div>
                <p className="text-sm text-gray-300">Autorizadas</p>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-400">3</div>
                <p className="text-sm text-gray-300">En Trabajo</p>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-yellow-400">1</div>
                <p className="text-sm text-gray-300">Esperando</p>
              </div>
            </div>
            <Button 
              onClick={() => window.open('/admin/seguridad/visitas', '_blank')}
              className="w-full bg-emerald-600 hover:bg-emerald-700"
            >
              <UserCheck className="h-4 w-4 mr-2" />
              Abrir Control de Visitas
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Actividad reciente */}
      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-white">
            <Activity className="h-5 w-5" />
            Actividad Reciente
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center space-x-4 p-3 bg-gray-700 rounded-lg">
              <div className="w-10 h-10 bg-green-600 rounded-full flex items-center justify-center">
                <CheckCircle2 className="h-5 w-5 text-white" />
              </div>
              <div className="flex-1">
                <p className="text-white font-medium">Acceso autorizado - Carlos Mendoza</p>
                <p className="text-sm text-gray-400">Reconocimiento facial exitoso - Entrada principal</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-300">15:45</p>
                <Badge className="bg-green-100 text-green-800 border-green-200">
                  Exitoso
                </Badge>
              </div>
            </div>

            <div className="flex items-center space-x-4 p-3 bg-gray-700 rounded-lg">
              <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
                <QrCode className="h-5 w-5 text-white" />
              </div>
              <div className="flex-1">
                <p className="text-white font-medium">Visita autorizada - Personal de limpieza</p>
                <p className="text-sm text-gray-400">Código QR válido - Torre B</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-300">15:30</p>
                <Badge className="bg-blue-100 text-blue-800 border-blue-200">
                  QR Válido
                </Badge>
              </div>
            </div>

            <div className="flex items-center space-x-4 p-3 bg-gray-700 rounded-lg">
              <div className="w-10 h-10 bg-yellow-600 rounded-full flex items-center justify-center">
                <AlertTriangle className="h-5 w-5 text-white" />
              </div>
              <div className="flex-1">
                <p className="text-white font-medium">Intento de acceso no autorizado</p>
                <p className="text-sm text-gray-400">Reconocimiento fallido - 3 intentos</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-300">15:15</p>
                <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">
                  Alerta
                </Badge>
              </div>
            </div>
          </div>

          <div className="mt-4 text-center">
            <Button 
              variant="outline" 
              className="border-gray-600 text-gray-300 hover:bg-gray-700"
              onClick={() => window.open('/security/actividad', '_blank')}
            >
              <Clock className="h-4 w-4 mr-2" />
              Ver Toda la Actividad
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Estado del Sistema */}
      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-white">
            <Shield className="h-5 w-5" />
            Estado del Sistema
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-gray-700 rounded-lg">
              <div className="text-green-400 font-semibold">Reconocimiento Facial</div>
              <div className="text-sm text-green-300">✅ Operativo</div>
              <div className="text-xs text-gray-400 mt-1">15 cámaras activas</div>
            </div>
            <div className="text-center p-4 bg-gray-700 rounded-lg">
              <div className="text-blue-400 font-semibold">Monitoreo 24/7</div>
              <div className="text-sm text-blue-300">🔄 Activo</div>
              <div className="text-xs text-gray-400 mt-1">Sin interrupciones</div>
            </div>
            <div className="text-center p-4 bg-gray-700 rounded-lg">
              <div className="text-emerald-400 font-semibold">Control de Acceso</div>
              <div className="text-sm text-emerald-300">🔐 Funcionando</div>
              <div className="text-xs text-gray-400 mt-1">Última actualización: ahora</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}