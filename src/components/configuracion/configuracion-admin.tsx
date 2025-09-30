"use client"

import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  User, Shield, Bell, Database, Mail, Lock, Settings, Save,
  Edit, Camera, Key, Globe, Clock, Smartphone, Eye, EyeOff,
  CheckCircle2, AlertTriangle, RefreshCw, Download, Upload
} from 'lucide-react'

interface PerfilAdmin {
  nombre: string
  apellido: string
  email: string
  telefono: string
  cargo: string
  fechaIngreso: string
  ultimoAcceso: string
  foto: string
}

interface ConfiguracionSistema {
  nombreComplejo: string
  direccion: string
  telefono: string
  email: string
  sitioWeb: string
  zonaHoraria: string
  moneda: string
}

const perfilAdminMock: PerfilAdmin = {
  nombre: "María",
  apellido: "González Pérez",
  email: "maria.gonzalez@residencial.com",
  telefono: "+591 70123456",
  cargo: "Administrador Principal",
  fechaIngreso: "2023-01-15",
  ultimoAcceso: "2024-01-15 14:30:22",
  foto: "/api/placeholder/150/150"
}

const configuracionSistemaMock: ConfiguracionSistema = {
  nombreComplejo: "Residencial Jardines del Sur",
  direccion: "Av. Santos Dumont #2847, Santa Cruz, Bolivia",
  telefono: "+591 3-3456789",
  email: "info@jardinesdelssur.com",
  sitioWeb: "www.jardinesdeelsur.com",
  zonaHoraria: "America/La_Paz",
  moneda: "BOB"
}

export function ConfiguracionAdmin() {
  const [perfilData, setPerfilData] = useState(perfilAdminMock)
  const [sistemaData, setSistemaData] = useState(configuracionSistemaMock)
  const [isEditing, setIsEditing] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [passwords, setPasswords] = useState({
    actual: '',
    nueva: '',
    confirmar: ''
  })

  const handleGuardarPerfil = () => {
    console.log('Guardando perfil:', perfilData)
    setIsEditing(false)
    // Aquí iría la llamada al backend
  }

  const handleCambiarPassword = () => {
    if (passwords.nueva !== passwords.confirmar) {
      alert('Las contraseñas no coinciden')
      return
    }
    if (passwords.nueva.length < 8) {
      alert('La contraseña debe tener al menos 8 caracteres')
      return
    }
    console.log('Cambiando contraseña...')
    setPasswords({ actual: '', nueva: '', confirmar: '' })
    // Aquí iría la llamada al backend
  }

  const handleGuardarConfiguracionSistema = () => {
    console.log('Guardando configuración del sistema:', sistemaData)
    // Aquí iría la llamada al backend
  }

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Configuración del Administrador</h1>
          <p className="text-gray-400 mt-1">Gestiona tu perfil y configuración del sistema</p>
        </div>
        <div className="flex space-x-3">
          <Button variant="outline" className="border-gray-600 text-gray-300 hover:bg-gray-700">
            <RefreshCw className="h-4 w-4 mr-2" />
            Recargar
          </Button>
          <Button className="bg-emerald-600 hover:bg-emerald-700">
            <Save className="h-4 w-4 mr-2" />
            Guardar Todo
          </Button>
        </div>
      </div>

      <Tabs defaultValue="perfil" className="w-full">
        <TabsList className="grid w-full grid-cols-4 bg-gray-800">
          <TabsTrigger value="perfil" className="data-[state=active]:bg-emerald-600">
            <User className="h-4 w-4 mr-2" />
            Mi Perfil
          </TabsTrigger>
          <TabsTrigger value="seguridad" className="data-[state=active]:bg-emerald-600">
            <Shield className="h-4 w-4 mr-2" />
            Seguridad
          </TabsTrigger>
          <TabsTrigger value="sistema" className="data-[state=active]:bg-emerald-600">
            <Settings className="h-4 w-4 mr-2" />
            Sistema
          </TabsTrigger>
          <TabsTrigger value="notificaciones" className="data-[state=active]:bg-emerald-600">
            <Bell className="h-4 w-4 mr-2" />
            Notificaciones
          </TabsTrigger>
        </TabsList>

        {/* Pestaña Mi Perfil */}
        <TabsContent value="perfil" className="space-y-6">
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-white">Información Personal</CardTitle>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsEditing(!isEditing)}
                  className="border-gray-600 text-gray-300 hover:bg-gray-700"
                >
                  <Edit className="h-4 w-4 mr-2" />
                  {isEditing ? 'Cancelar' : 'Editar'}
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Foto de perfil */}
              <div className="flex items-center space-x-6">
                <div className="relative">
                  <div className="w-24 h-24 bg-gray-700 rounded-full flex items-center justify-center">
                    <User className="h-12 w-12 text-gray-400" />
                  </div>
                  {isEditing && (
                    <Button
                      size="sm"
                      className="absolute -bottom-2 -right-2 bg-emerald-600 hover:bg-emerald-700 rounded-full p-2"
                    >
                      <Camera className="h-4 w-4" />
                    </Button>
                  )}
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-white">
                    {perfilData.nombre} {perfilData.apellido}
                  </h3>
                  <p className="text-gray-400">{perfilData.cargo}</p>
                  <Badge className="bg-emerald-600 text-white mt-1">Activo</Badge>
                </div>
              </div>

              {/* Formulario de datos */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="nombre" className="text-gray-300">Nombre</Label>
                  <Input
                    id="nombre"
                    value={perfilData.nombre}
                    onChange={(e) => setPerfilData({...perfilData, nombre: e.target.value})}
                    disabled={!isEditing}
                    className="bg-gray-700 border-gray-600 text-white disabled:opacity-60"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="apellido" className="text-gray-300">Apellido</Label>
                  <Input
                    id="apellido"
                    value={perfilData.apellido}
                    onChange={(e) => setPerfilData({...perfilData, apellido: e.target.value})}
                    disabled={!isEditing}
                    className="bg-gray-700 border-gray-600 text-white disabled:opacity-60"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-gray-300">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={perfilData.email}
                    onChange={(e) => setPerfilData({...perfilData, email: e.target.value})}
                    disabled={!isEditing}
                    className="bg-gray-700 border-gray-600 text-white disabled:opacity-60"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="telefono" className="text-gray-300">Teléfono</Label>
                  <Input
                    id="telefono"
                    value={perfilData.telefono}
                    onChange={(e) => setPerfilData({...perfilData, telefono: e.target.value})}
                    disabled={!isEditing}
                    className="bg-gray-700 border-gray-600 text-white disabled:opacity-60"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-gray-300">Cargo</Label>
                  <Input
                    value={perfilData.cargo}
                    disabled
                    className="bg-gray-700 border-gray-600 text-white opacity-60"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-gray-300">Fecha de Ingreso</Label>
                  <Input
                    value={perfilData.fechaIngreso}
                    disabled
                    className="bg-gray-700 border-gray-600 text-white opacity-60"
                  />
                </div>
              </div>

              {isEditing && (
                <div className="flex justify-end space-x-3">
                  <Button
                    variant="outline"
                    onClick={() => setIsEditing(false)}
                    className="border-gray-600 text-gray-300 hover:bg-gray-700"
                  >
                    Cancelar
                  </Button>
                  <Button onClick={handleGuardarPerfil} className="bg-emerald-600 hover:bg-emerald-700">
                    <Save className="h-4 w-4 mr-2" />
                    Guardar Cambios
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Pestaña Seguridad */}
        <TabsContent value="seguridad" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Cambiar Contraseña */}
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <Lock className="h-5 w-5 mr-2" />
                  Cambiar Contraseña
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="password-actual" className="text-gray-300">Contraseña Actual</Label>
                  <div className="relative">
                    <Input
                      id="password-actual"
                      type={showPassword ? "text" : "password"}
                      value={passwords.actual}
                      onChange={(e) => setPasswords({...passwords, actual: e.target.value})}
                      className="bg-gray-700 border-gray-600 text-white pr-10"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4 text-gray-400" />
                      ) : (
                        <Eye className="h-4 w-4 text-gray-400" />
                      )}
                    </Button>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password-nueva" className="text-gray-300">Nueva Contraseña</Label>
                  <Input
                    id="password-nueva"
                    type="password"
                    value={passwords.nueva}
                    onChange={(e) => setPasswords({...passwords, nueva: e.target.value})}
                    className="bg-gray-700 border-gray-600 text-white"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password-confirmar" className="text-gray-300">Confirmar Nueva Contraseña</Label>
                  <Input
                    id="password-confirmar"
                    type="password"
                    value={passwords.confirmar}
                    onChange={(e) => setPasswords({...passwords, confirmar: e.target.value})}
                    className="bg-gray-700 border-gray-600 text-white"
                  />
                </div>
                <Button onClick={handleCambiarPassword} className="w-full bg-emerald-600 hover:bg-emerald-700">
                  <Key className="h-4 w-4 mr-2" />
                  Cambiar Contraseña
                </Button>
              </CardContent>
            </Card>

            {/* Información de Seguridad */}
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <Shield className="h-5 w-5 mr-2" />
                  Estado de Seguridad
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-gray-700 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <CheckCircle2 className="h-5 w-5 text-green-400" />
                      <div>
                        <p className="text-white font-medium">Último Acceso</p>
                        <p className="text-gray-400 text-sm">{perfilData.ultimoAcceso}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 bg-gray-700 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <CheckCircle2 className="h-5 w-5 text-green-400" />
                      <div>
                        <p className="text-white font-medium">Autenticación 2FA</p>
                        <p className="text-gray-400 text-sm">Activada</p>
                      </div>
                    </div>
                    <Button variant="outline" size="sm" className="border-gray-600 text-gray-300">
                      Configurar
                    </Button>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 bg-gray-700 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <AlertTriangle className="h-5 w-5 text-yellow-400" />
                      <div>
                        <p className="text-white font-medium">Sesiones Activas</p>
                        <p className="text-gray-400 text-sm">3 dispositivos conectados</p>
                      </div>
                    </div>
                    <Button variant="outline" size="sm" className="border-gray-600 text-gray-300">
                      Ver Todas
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Pestaña Sistema */}
        <TabsContent value="sistema" className="space-y-6">
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white">Configuración del Sistema</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="nombreComplejo" className="text-gray-300">Nombre del Complejo</Label>
                  <Input
                    id="nombreComplejo"
                    value={sistemaData.nombreComplejo}
                    onChange={(e) => setSistemaData({...sistemaData, nombreComplejo: e.target.value})}
                    className="bg-gray-700 border-gray-600 text-white"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="direccionComplejo" className="text-gray-300">Dirección</Label>
                  <Input
                    id="direccionComplejo"
                    value={sistemaData.direccion}
                    onChange={(e) => setSistemaData({...sistemaData, direccion: e.target.value})}
                    className="bg-gray-700 border-gray-600 text-white"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="telefonoComplejo" className="text-gray-300">Teléfono Principal</Label>
                  <Input
                    id="telefonoComplejo"
                    value={sistemaData.telefono}
                    onChange={(e) => setSistemaData({...sistemaData, telefono: e.target.value})}
                    className="bg-gray-700 border-gray-600 text-white"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="emailComplejo" className="text-gray-300">Email Principal</Label>
                  <Input
                    id="emailComplejo"
                    type="email"
                    value={sistemaData.email}
                    onChange={(e) => setSistemaData({...sistemaData, email: e.target.value})}
                    className="bg-gray-700 border-gray-600 text-white"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="sitioWeb" className="text-gray-300">Sitio Web</Label>
                  <Input
                    id="sitioWeb"
                    value={sistemaData.sitioWeb}
                    onChange={(e) => setSistemaData({...sistemaData, sitioWeb: e.target.value})}
                    className="bg-gray-700 border-gray-600 text-white"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="zonaHoraria" className="text-gray-300">Zona Horaria</Label>
                  <select
                    id="zonaHoraria"
                    value={sistemaData.zonaHoraria}
                    onChange={(e) => setSistemaData({...sistemaData, zonaHoraria: e.target.value})}
                    className="w-full bg-gray-700 border-gray-600 text-white rounded-md px-3 py-2"
                  >
                    <option value="America/La_Paz">Bolivia (GMT-4)</option>
                    <option value="America/Lima">Perú (GMT-5)</option>
                    <option value="America/Bogota">Colombia (GMT-5)</option>
                  </select>
                </div>
              </div>
              
              <div className="flex justify-end">
                <Button onClick={handleGuardarConfiguracionSistema} className="bg-emerald-600 hover:bg-emerald-700">
                  <Save className="h-4 w-4 mr-2" />
                  Guardar Configuración
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Backup y Mantenimiento */}
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <Database className="h-5 w-5 mr-2" />
                Backup y Mantenimiento
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Button className="bg-blue-600 hover:bg-blue-700">
                  <Download className="h-4 w-4 mr-2" />
                  Crear Backup
                </Button>
                <Button variant="outline" className="border-gray-600 text-gray-300 hover:bg-gray-700">
                  <Upload className="h-4 w-4 mr-2" />
                  Restaurar Backup
                </Button>
                <Button variant="outline" className="border-gray-600 text-gray-300 hover:bg-gray-700">
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Limpiar Cache
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Pestaña Notificaciones */}
        <TabsContent value="notificaciones" className="space-y-6">
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white">Preferencias de Notificaciones</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-gray-700 rounded-lg">
                  <div>
                    <h4 className="text-white font-medium">Notificaciones por Email</h4>
                    <p className="text-gray-400 text-sm">Recibir notificaciones importantes por correo</p>
                  </div>
                  <input type="checkbox" defaultChecked className="toggle" />
                </div>
                
                <div className="flex items-center justify-between p-4 bg-gray-700 rounded-lg">
                  <div>
                    <h4 className="text-white font-medium">Alertas de Seguridad</h4>
                    <p className="text-gray-400 text-sm">Notificaciones inmediatas por incidentes de seguridad</p>
                  </div>
                  <input type="checkbox" defaultChecked className="toggle" />
                </div>
                
                <div className="flex items-center justify-between p-4 bg-gray-700 rounded-lg">
                  <div>
                    <h4 className="text-white font-medium">Reportes Automáticos</h4>
                    <p className="text-gray-400 text-sm">Resumen diario de actividades del sistema</p>
                  </div>
                  <input type="checkbox" defaultChecked className="toggle" />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}