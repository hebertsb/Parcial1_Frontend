/**
 * Página de configuración general del propietario
 */

'use client';

import { useState } from 'react';
import { useAuth } from '@/contexts/auth-context';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import { 
  ArrowLeft,
  Settings,
  Bell,
  Mail,
  Phone,
  Shield,
  Moon,
  Sun,
  Globe,
  CheckCircle,
  AlertCircle,
  Monitor
} from 'lucide-react';
import Link from 'next/link';

export default function ConfiguracionPropietario() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const [config, setConfig] = useState({
    // Notificaciones
    emailNotifications: true,
    smsNotifications: false,
    pushNotifications: true,
    marketingEmails: false,
    
    // Privacidad
    profileVisibility: 'private',
    shareContactInfo: false,
    
    // Apariencia
    theme: 'system',
    language: 'es',
    
    // Seguridad
    twoFactorAuth: false,
    loginAlerts: true,
    
    // Comunicaciones
    inquilinoNotifications: true,
    maintenanceAlerts: true,
    paymentReminders: true,
  });

  const handleConfigChange = (key: string, value: boolean | string) => {
    setConfig(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleSaveConfig = async () => {
    setLoading(true);
    setMessage(null);

    try {
      // Aquí iría la llamada a la API para guardar la configuración
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulación

      setMessage({
        type: 'success',
        text: 'Configuración guardada correctamente'
      });
    } catch (error) {
      console.error('Error al guardar configuración:', error);
      setMessage({
        type: 'error',
        text: 'Error al guardar la configuración. Inténtalo de nuevo.'
      });
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-2 text-muted-foreground">Cargando configuración...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center space-x-4">
        <Button variant="outline" size="icon" asChild>
          <Link href="/propietario/perfil">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div>
          <h1 className="text-2xl font-bold">Configuración</h1>
          <p className="text-muted-foreground">
            Personaliza tu experiencia y configura tus preferencias
          </p>
        </div>
      </div>

      {/* Mensaje de estado */}
      {message && (
        <Alert className={message.type === 'success' ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'}>
          {message.type === 'success' ? (
            <CheckCircle className="h-4 w-4 text-green-600" />
          ) : (
            <AlertCircle className="h-4 w-4 text-red-600" />
          )}
          <AlertDescription className={message.type === 'success' ? 'text-green-800' : 'text-red-800'}>
            {message.text}
          </AlertDescription>
        </Alert>
      )}

      <div className="grid gap-6 md:grid-cols-2">
        {/* Notificaciones */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Bell className="mr-2 h-5 w-5" />
              Notificaciones
            </CardTitle>
            <CardDescription>
              Configura cómo y cuándo recibir notificaciones
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="flex items-center">
                  <Mail className="mr-2 h-4 w-4" />
                  Notificaciones por Email
                </Label>
                <p className="text-sm text-muted-foreground">
                  Recibir notificaciones importantes por correo
                </p>
              </div>
              <Switch
                checked={config.emailNotifications}
                onCheckedChange={(checked) => handleConfigChange('emailNotifications', checked)}
              />
            </div>
            
            <Separator />
            
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="flex items-center">
                  <Phone className="mr-2 h-4 w-4" />
                  Notificaciones SMS
                </Label>
                <p className="text-sm text-muted-foreground">
                  Recibir alertas urgentes por mensaje de texto
                </p>
              </div>
              <Switch
                checked={config.smsNotifications}
                onCheckedChange={(checked) => handleConfigChange('smsNotifications', checked)}
              />
            </div>
            
            <Separator />
            
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Notificaciones Push</Label>
                <p className="text-sm text-muted-foreground">
                  Recibir notificaciones en el navegador
                </p>
              </div>
              <Switch
                checked={config.pushNotifications}
                onCheckedChange={(checked) => handleConfigChange('pushNotifications', checked)}
              />
            </div>
            
            <Separator />
            
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Emails de Marketing</Label>
                <p className="text-sm text-muted-foreground">
                  Recibir noticias y promociones
                </p>
              </div>
              <Switch
                checked={config.marketingEmails}
                onCheckedChange={(checked) => handleConfigChange('marketingEmails', checked)}
              />
            </div>
          </CardContent>
        </Card>

        {/* Seguridad */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Shield className="mr-2 h-5 w-5" />
              Seguridad
            </CardTitle>
            <CardDescription>
              Configuración de seguridad y privacidad
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Autenticación de Dos Factores</Label>
                <p className="text-sm text-muted-foreground">
                  Añade una capa extra de seguridad
                </p>
              </div>
              <Switch
                checked={config.twoFactorAuth}
                onCheckedChange={(checked) => handleConfigChange('twoFactorAuth', checked)}
              />
            </div>
            
            <Separator />
            
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Alertas de Inicio de Sesión</Label>
                <p className="text-sm text-muted-foreground">
                  Notificar cuando alguien acceda a tu cuenta
                </p>
              </div>
              <Switch
                checked={config.loginAlerts}
                onCheckedChange={(checked) => handleConfigChange('loginAlerts', checked)}
              />
            </div>
            
            <Separator />
            
            <div className="space-y-2">
              <Label>Visibilidad del Perfil</Label>
              <Select
                value={config.profileVisibility}
                onValueChange={(value) => handleConfigChange('profileVisibility', value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="public">Público</SelectItem>
                  <SelectItem value="private">Privado</SelectItem>
                  <SelectItem value="contacts">Solo Contactos</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <Separator />
            
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Compartir Información de Contacto</Label>
                <p className="text-sm text-muted-foreground">
                  Permitir que inquilinos vean tu información
                </p>
              </div>
              <Switch
                checked={config.shareContactInfo}
                onCheckedChange={(checked) => handleConfigChange('shareContactInfo', checked)}
              />
            </div>
          </CardContent>
        </Card>

        {/* Apariencia */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Monitor className="mr-2 h-5 w-5" />
              Apariencia
            </CardTitle>
            <CardDescription>
              Personaliza la apariencia de la aplicación
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label className="flex items-center">
                <Sun className="mr-2 h-4 w-4" />
                Tema
              </Label>
              <Select
                value={config.theme}
                onValueChange={(value) => handleConfigChange('theme', value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="light">
                    <div className="flex items-center">
                      <Sun className="mr-2 h-4 w-4" />
                      Claro
                    </div>
                  </SelectItem>
                  <SelectItem value="dark">
                    <div className="flex items-center">
                      <Moon className="mr-2 h-4 w-4" />
                      Oscuro
                    </div>
                  </SelectItem>
                  <SelectItem value="system">
                    <div className="flex items-center">
                      <Monitor className="mr-2 h-4 w-4" />
                      Sistema
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label className="flex items-center">
                <Globe className="mr-2 h-4 w-4" />
                Idioma
              </Label>
              <Select
                value={config.language}
                onValueChange={(value) => handleConfigChange('language', value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="es">Español</SelectItem>
                  <SelectItem value="en">English</SelectItem>
                  <SelectItem value="pt">Português</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Comunicaciones Específicas */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Bell className="mr-2 h-5 w-5" />
              Comunicaciones del Condominio
            </CardTitle>
            <CardDescription>
              Configure notificaciones específicas del condominio
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Notificaciones de Inquilinos</Label>
                <p className="text-sm text-muted-foreground">
                  Recibir notificaciones sobre tus inquilinos
                </p>
              </div>
              <Switch
                checked={config.inquilinoNotifications}
                onCheckedChange={(checked) => handleConfigChange('inquilinoNotifications', checked)}
              />
            </div>
            
            <Separator />
            
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Alertas de Mantenimiento</Label>
                <p className="text-sm text-muted-foreground">
                  Notificaciones sobre trabajos de mantenimiento
                </p>
              </div>
              <Switch
                checked={config.maintenanceAlerts}
                onCheckedChange={(checked) => handleConfigChange('maintenanceAlerts', checked)}
              />
            </div>
            
            <Separator />
            
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Recordatorios de Pago</Label>
                <p className="text-sm text-muted-foreground">
                  Recordatorios sobre pagos y cuotas
                </p>
              </div>
              <Switch
                checked={config.paymentReminders}
                onCheckedChange={(checked) => handleConfigChange('paymentReminders', checked)}
              />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Botón de Guardar */}
      <div className="flex justify-end space-x-4">
        <Button variant="outline" asChild>
          <Link href="/propietario/perfil">
            Cancelar
          </Link>
        </Button>
        <Button onClick={handleSaveConfig} disabled={loading}>
          {loading ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              Guardando...
            </>
          ) : (
            <>
              <Settings className="mr-2 h-4 w-4" />
              Guardar Configuración
            </>
          )}
        </Button>
      </div>
    </div>
  );
}