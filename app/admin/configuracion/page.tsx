/**
 * Página de configuración general del administrador
 */

'use client';

import { useState } from 'react';
import { useAuth } from '@/contexts/auth-context';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { 
  Settings, 
  Save,
  ArrowLeft,
  Shield,
  Bell,
  Eye,
  Database,
  Globe,
  Lock,
  Smartphone,
  Mail
} from 'lucide-react';
import Link from 'next/link';

export default function ConfiguracionAdmin() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  
  const [config, setConfig] = useState({
    // Notificaciones
    emailNotifications: true,
    pushNotifications: false,
    smsNotifications: false,
    securityAlerts: true,
    
    // Preferencias de Sistema
    language: 'es',
    timezone: 'America/La_Paz',
    dateFormat: 'DD/MM/YYYY',
    
    // Seguridad
    twoFactorAuth: false,
    sessionTimeout: '30',
    autoLogout: true,
    
    // Privacidad
    dataCollection: true,
    analyticsSharing: false,
    profileVisibility: 'admin'
  });

  const handleSwitchChange = (key: string, value: boolean) => {
    setConfig(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleSelectChange = (key: string, value: string) => {
    setConfig(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Simular guardado (aquí integrarías con tu API)
      await new Promise(resolve => setTimeout(resolve, 1000));
      console.log('Configuración guardada:', config);
    } catch (error) {
      console.error('Error al guardar configuración:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-2 text-gray-400">Cargando configuración...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button variant="outline" size="sm" asChild>
            <Link href="/admin/perfil">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Volver
            </Link>
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-white">Configuración</h1>
            <p className="text-gray-400">
              Personaliza las preferencias del sistema
            </p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid gap-6 md:grid-cols-2">
          <div className="space-y-6">
            {/* Notificaciones */}
            <Card className="bg-[#111111] border-[#2a2a2a]">
              <CardHeader>
                <CardTitle className="flex items-center text-white">
                  <Bell className="mr-2 h-5 w-5" />
                  Notificaciones
                </CardTitle>
                <CardDescription className="text-gray-400">
                  Configura cómo y cuándo recibir notificaciones
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-gray-300">Notificaciones por Email</Label>
                    <p className="text-sm text-gray-400">Recibir notificaciones en tu correo electrónico</p>
                  </div>
                  <Switch
                    checked={config.emailNotifications}
                    onCheckedChange={(value) => handleSwitchChange('emailNotifications', value)}
                  />
                </div>
                
                <Separator className="bg-[#2a2a2a]" />
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-gray-300">Notificaciones Push</Label>
                    <p className="text-sm text-gray-400">Notificaciones en tiempo real en el navegador</p>
                  </div>
                  <Switch
                    checked={config.pushNotifications}
                    onCheckedChange={(value) => handleSwitchChange('pushNotifications', value)}
                  />
                </div>
                
                <Separator className="bg-[#2a2a2a]" />
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-gray-300 flex items-center">
                      <Smartphone className="mr-1 h-4 w-4" />
                      Notificaciones SMS
                    </Label>
                    <p className="text-sm text-gray-400">Alertas importantes por mensaje de texto</p>
                  </div>
                  <Switch
                    checked={config.smsNotifications}
                    onCheckedChange={(value) => handleSwitchChange('smsNotifications', value)}
                  />
                </div>
                
                <Separator className="bg-[#2a2a2a]" />
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-gray-300 flex items-center">
                      <Shield className="mr-1 h-4 w-4" />
                      Alertas de Seguridad
                    </Label>
                    <p className="text-sm text-gray-400">Notificaciones sobre actividad sospechosa</p>
                  </div>
                  <Switch
                    checked={config.securityAlerts}
                    onCheckedChange={(value) => handleSwitchChange('securityAlerts', value)}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Preferencias del Sistema */}
            <Card className="bg-[#111111] border-[#2a2a2a]">
              <CardHeader>
                <CardTitle className="flex items-center text-white">
                  <Globe className="mr-2 h-5 w-5" />
                  Preferencias del Sistema
                </CardTitle>
                <CardDescription className="text-gray-400">
                  Idioma, zona horaria y formatos
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 gap-4">
                  <div className="space-y-2">
                    <Label className="text-gray-300">Idioma</Label>
                    <Select value={config.language} onValueChange={(value) => handleSelectChange('language', value)}>
                      <SelectTrigger className="bg-[#1a1a1a] border-[#2a2a2a] text-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-[#1a1a1a] border-[#2a2a2a] text-white">
                        <SelectItem value="es">Español</SelectItem>
                        <SelectItem value="en">English</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label className="text-gray-300">Zona Horaria</Label>
                    <Select value={config.timezone} onValueChange={(value) => handleSelectChange('timezone', value)}>
                      <SelectTrigger className="bg-[#1a1a1a] border-[#2a2a2a] text-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-[#1a1a1a] border-[#2a2a2a] text-white">
                        <SelectItem value="America/La_Paz">América/La Paz</SelectItem>
                        <SelectItem value="America/Lima">América/Lima</SelectItem>
                        <SelectItem value="America/Bogota">América/Bogotá</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label className="text-gray-300">Formato de Fecha</Label>
                    <Select value={config.dateFormat} onValueChange={(value) => handleSelectChange('dateFormat', value)}>
                      <SelectTrigger className="bg-[#1a1a1a] border-[#2a2a2a] text-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-[#1a1a1a] border-[#2a2a2a] text-white">
                        <SelectItem value="DD/MM/YYYY">DD/MM/YYYY</SelectItem>
                        <SelectItem value="MM/DD/YYYY">MM/DD/YYYY</SelectItem>
                        <SelectItem value="YYYY-MM-DD">YYYY-MM-DD</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            {/* Seguridad */}
            <Card className="bg-[#111111] border-[#2a2a2a]">
              <CardHeader>
                <CardTitle className="flex items-center text-white">
                  <Shield className="mr-2 h-5 w-5" />
                  Seguridad
                </CardTitle>
                <CardDescription className="text-gray-400">
                  Configuración de seguridad y autenticación
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-gray-300">Autenticación de Dos Factores</Label>
                    <p className="text-sm text-gray-400">Protección adicional para tu cuenta</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch
                      checked={config.twoFactorAuth}
                      onCheckedChange={(value) => handleSwitchChange('twoFactorAuth', value)}
                    />
                    {config.twoFactorAuth && (
                      <Badge variant="secondary" className="bg-green-100 text-green-800">
                        Activo
                      </Badge>
                    )}
                  </div>
                </div>
                
                <Separator className="bg-[#2a2a2a]" />
                
                <div className="space-y-2">
                  <Label className="text-gray-300">Tiempo de Sesión (minutos)</Label>
                  <Select value={config.sessionTimeout} onValueChange={(value) => handleSelectChange('sessionTimeout', value)}>
                    <SelectTrigger className="bg-[#1a1a1a] border-[#2a2a2a] text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-[#1a1a1a] border-[#2a2a2a] text-white">
                      <SelectItem value="15">15 minutos</SelectItem>
                      <SelectItem value="30">30 minutos</SelectItem>
                      <SelectItem value="60">1 hora</SelectItem>
                      <SelectItem value="120">2 horas</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <Separator className="bg-[#2a2a2a]" />
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-gray-300">Cierre Automático de Sesión</Label>
                    <p className="text-sm text-gray-400">Cerrar sesión por inactividad</p>
                  </div>
                  <Switch
                    checked={config.autoLogout}
                    onCheckedChange={(value) => handleSwitchChange('autoLogout', value)}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Privacidad */}
            <Card className="bg-[#111111] border-[#2a2a2a]">
              <CardHeader>
                <CardTitle className="flex items-center text-white">
                  <Lock className="mr-2 h-5 w-5" />
                  Privacidad
                </CardTitle>
                <CardDescription className="text-gray-400">
                  Control de datos y privacidad
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-gray-300">Recopilación de Datos</Label>
                    <p className="text-sm text-gray-400">Permitir recopilación de datos para mejorar el servicio</p>
                  </div>
                  <Switch
                    checked={config.dataCollection}
                    onCheckedChange={(value) => handleSwitchChange('dataCollection', value)}
                  />
                </div>
                
                <Separator className="bg-[#2a2a2a]" />
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-gray-300">Compartir Análisis</Label>
                    <p className="text-sm text-gray-400">Compartir datos analíticos anónimos</p>
                  </div>
                  <Switch
                    checked={config.analyticsSharing}
                    onCheckedChange={(value) => handleSwitchChange('analyticsSharing', value)}
                  />
                </div>
                
                <Separator className="bg-[#2a2a2a]" />
                
                <div className="space-y-2">
                  <Label className="text-gray-300">Visibilidad del Perfil</Label>
                  <Select value={config.profileVisibility} onValueChange={(value) => handleSelectChange('profileVisibility', value)}>
                    <SelectTrigger className="bg-[#1a1a1a] border-[#2a2a2a] text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-[#1a1a1a] border-[#2a2a2a] text-white">
                      <SelectItem value="admin">Solo Administradores</SelectItem>
                      <SelectItem value="staff">Personal del Sistema</SelectItem>
                      <SelectItem value="private">Privado</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* Acciones Rápidas */}
            <Card className="bg-[#111111] border-[#2a2a2a]">
              <CardHeader>
                <CardTitle className="text-lg text-white">Acciones Rápidas</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button variant="outline" size="sm" className="w-full justify-start" asChild>
                  <Link href="/admin/configuracion/password">
                    <Lock className="mr-2 h-4 w-4" />
                    Cambiar Contraseña
                  </Link>
                </Button>
                <Button variant="outline" size="sm" className="w-full justify-start" asChild>
                  <Link href="/admin/perfil/editar">
                    <Settings className="mr-2 h-4 w-4" />
                    Editar Perfil
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Botón Guardar */}
        <div className="flex justify-end pt-6">
          <Button type="submit" disabled={loading} className="min-w-32">
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Guardando...
              </>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                Guardar Configuración
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}