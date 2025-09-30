"use client"

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Badge } from '@/components/ui/badge'
import { 
  Settings, 
  Shield, 
  Camera, 
  Bell, 
  Database, 
  Wifi, 
  Lock,
  Save,
  RefreshCw
} from 'lucide-react'

export default function ConfiguracionPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-white">Configuración del Sistema</h1>
          <p className="text-gray-400 mt-2">Ajustes y configuraciones del sistema de seguridad</p>
        </div>
        <Button className="bg-emerald-600 hover:bg-emerald-700">
          <Save className="h-4 w-4 mr-2" />
          Guardar Cambios
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Configuración General */}
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-white">
              <Settings className="h-5 w-5" />
              Configuración General
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label className="text-gray-300">Nombre del Sistema</Label>
              <Input 
                defaultValue="Sistema de Seguridad Residencial"
                className="bg-gray-700 border-gray-600 text-white"
              />
            </div>
            
            <div className="space-y-2">
              <Label className="text-gray-300">Zona Horaria</Label>
              <Input 
                defaultValue="America/La_Paz"
                className="bg-gray-700 border-gray-600 text-white"
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-gray-300">Modo de Mantenimiento</Label>
                <p className="text-sm text-gray-400">Desactivar temporalmente el sistema</p>
              </div>
              <Switch />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-gray-300">Registro Detallado</Label>
                <p className="text-sm text-gray-400">Activar logs completos del sistema</p>
              </div>
              <Switch defaultChecked />
            </div>
          </CardContent>
        </Card>

        {/* Configuración de Reconocimiento Facial */}
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-white">
              <Camera className="h-5 w-5" />
              Reconocimiento Facial
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label className="text-gray-300">Umbral de Confianza (%)</Label>
              <Input 
                type="number"
                defaultValue="85"
                min="50"
                max="99"
                className="bg-gray-700 border-gray-600 text-white"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-gray-300">Intentos Máximos</Label>
              <Input 
                type="number"
                defaultValue="3"
                min="1"
                max="10"
                className="bg-gray-700 border-gray-600 text-white"
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-gray-300">Detección en Tiempo Real</Label>
                <p className="text-sm text-gray-400">Procesamiento continuo de cámaras</p>
              </div>
              <Switch defaultChecked />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-gray-300">Aprendizaje Automático</Label>
                <p className="text-sm text-gray-400">Mejorar reconocimiento con uso</p>
              </div>
              <Switch defaultChecked />
            </div>
          </CardContent>
        </Card>

        {/* Configuración de Seguridad */}
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-white">
              <Shield className="h-5 w-5" />
              Configuración de Seguridad
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label className="text-gray-300">Tiempo de Sesión (minutos)</Label>
              <Input 
                type="number"
                defaultValue="480"
                className="bg-gray-700 border-gray-600 text-white"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-gray-300">Intentos de Login Fallidos</Label>
              <Input 
                type="number"
                defaultValue="5"
                className="bg-gray-700 border-gray-600 text-white"
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-gray-300">Doble Factor de Autenticación</Label>
                <p className="text-sm text-gray-400">Seguridad adicional para admin</p>
              </div>
              <Switch />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-gray-300">Cifrado de Datos</Label>
                <p className="text-sm text-gray-400">Encriptar información sensible</p>
              </div>
              <Switch defaultChecked />
            </div>
          </CardContent>
        </Card>

        {/* Configuración de Notificaciones */}
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-white">
              <Bell className="h-5 w-5" />
              Notificaciones
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-gray-300">Alertas de Seguridad</Label>
                <p className="text-sm text-gray-400">Notificar incidentes críticos</p>
              </div>
              <Switch defaultChecked />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-gray-300">Reportes Diarios</Label>
                <p className="text-sm text-gray-400">Resumen automático de actividad</p>
              </div>
              <Switch defaultChecked />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-gray-300">Notificaciones Email</Label>
                <p className="text-sm text-gray-400">Enviar alertas por correo</p>
              </div>
              <Switch />
            </div>

            <div className="space-y-2">
              <Label className="text-gray-300">Email de Administrador</Label>
              <Input 
                type="email"
                defaultValue="admin@residential.com"
                className="bg-gray-700 border-gray-600 text-white"
              />
            </div>
          </CardContent>
        </Card>

        {/* Estado del Sistema */}
        <Card className="bg-gray-800 border-gray-700 lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-white">
              <Database className="h-5 w-5" />
              Estado del Sistema
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center p-4 bg-gray-700 rounded-lg">
                <Database className="h-8 w-8 mx-auto mb-2 text-green-400" />
                <h3 className="font-semibold text-white">Base de Datos</h3>
                <Badge className="bg-green-100 text-green-800 border-green-200 mt-2">
                  Operativa
                </Badge>
                <p className="text-xs text-gray-400 mt-1">Última copia: Hoy 03:00</p>
              </div>

              <div className="text-center p-4 bg-gray-700 rounded-lg">
                <Wifi className="h-8 w-8 mx-auto mb-2 text-blue-400" />
                <h3 className="font-semibold text-white">Conectividad</h3>
                <Badge className="bg-green-100 text-green-800 border-green-200 mt-2">
                  Estable
                </Badge>
                <p className="text-xs text-gray-400 mt-1">Latencia: 12ms</p>
              </div>

              <div className="text-center p-4 bg-gray-700 rounded-lg">
                <Lock className="h-8 w-8 mx-auto mb-2 text-purple-400" />
                <h3 className="font-semibold text-white">Seguridad</h3>
                <Badge className="bg-green-100 text-green-800 border-green-200 mt-2">
                  Protegido
                </Badge>
                <p className="text-xs text-gray-400 mt-1">SSL/TLS activo</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Acciones del sistema */}
      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white">Acciones del Sistema</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-4">
            <Button variant="outline" className="border-gray-600 text-gray-300 hover:bg-gray-700">
              <RefreshCw className="h-4 w-4 mr-2" />
              Reiniciar Servicios
            </Button>
            <Button variant="outline" className="border-gray-600 text-gray-300 hover:bg-gray-700">
              <Database className="h-4 w-4 mr-2" />
              Respaldar Base de Datos
            </Button>
            <Button variant="outline" className="border-gray-600 text-gray-300 hover:bg-gray-700">
              <Shield className="h-4 w-4 mr-2" />
              Ejecutar Diagnóstico
            </Button>
            <Button variant="outline" className="border-red-600 text-red-300 hover:bg-red-900">
              <Lock className="h-4 w-4 mr-2" />
              Modo de Emergencia
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}