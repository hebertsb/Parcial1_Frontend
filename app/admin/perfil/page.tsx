/**
 * Página de visualización de perfil del administrador
 */

'use client';

import { useAuth } from '@/contexts/auth-context';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Building, 
  Calendar,
  Shield,
  Edit,
  Key,
  Bell,
  Users,
  FileText,
  DollarSign
} from 'lucide-react';
import Link from 'next/link';

export default function PerfilAdmin() {
  const { user } = useAuth();

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-2 text-muted-foreground">Cargando perfil...</p>
        </div>
      </div>
    );
  }

  const getUserInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Mi Perfil</h1>
          <p className="text-gray-400">
            Información personal y configuración de cuenta de administrador
          </p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" asChild>
            <Link href="/admin/perfil/editar">
              <Edit className="mr-2 h-4 w-4" />
              Editar Perfil
            </Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/admin/configuracion/password">
              <Key className="mr-2 h-4 w-4" />
              Cambiar Contraseña
            </Link>
          </Button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {/* Información Personal */}
        <div className="md:col-span-2 space-y-6">
          {/* Datos Básicos */}
          <Card className="bg-[#111111] border-[#2a2a2a]">
            <CardHeader>
              <CardTitle className="flex items-center text-white">
                <User className="mr-2 h-5 w-5" />
                Información Personal
              </CardTitle>
              <CardDescription className="text-gray-400">
                Datos básicos de tu cuenta de administrador
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-400">Nombre Completo</label>
                  <p className="text-sm mt-1 text-white">{user.name || 'No especificado'}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-400">Email</label>
                  <p className="text-sm mt-1 flex items-center text-white">
                    <Mail className="mr-2 h-4 w-4 text-gray-400" />
                    {user.email || 'No especificado'}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-400">Teléfono</label>
                  <p className="text-sm mt-1 flex items-center text-white">
                    <Phone className="mr-2 h-4 w-4 text-gray-400" />
                    {user.telefono || 'No especificado'}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-400">Rol</label>
                  <div className="mt-1">
                    <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                      <Shield className="mr-1 h-3 w-3" />
                      Administrador
                    </Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Información de Contacto */}
          <Card className="bg-[#111111] border-[#2a2a2a]">
            <CardHeader>
              <CardTitle className="flex items-center text-white">
                <MapPin className="mr-2 h-5 w-5" />
                Información de Contacto
              </CardTitle>
              <CardDescription className="text-gray-400">
                Dirección y datos de contacto
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-400">Dirección</label>
                <p className="text-sm mt-1 text-white">{user.direccion || 'No especificada'}</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-400">Ciudad</label>
                  <p className="text-sm mt-1 text-white">{user.ciudad || 'No especificada'}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-400">Código Postal</label>
                  <p className="text-sm mt-1 text-white">{user.codigo_postal || 'No especificado'}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Permisos de Administrador */}
          <Card className="bg-[#111111] border-[#2a2a2a]">
            <CardHeader>
              <CardTitle className="flex items-center text-white">
                <Shield className="mr-2 h-5 w-5" />
                Permisos de Administrador
              </CardTitle>
              <CardDescription className="text-gray-400">
                Accesos y permisos del sistema
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center justify-between p-3 bg-[#1a1a1a] rounded-lg">
                  <div className="flex items-center space-x-2">
                    <Users className="h-4 w-4 text-blue-400" />
                    <span className="text-sm text-white">Gestión de Usuarios</span>
                  </div>
                  <Badge variant="secondary" className="bg-green-100 text-green-800">
                    Activo
                  </Badge>
                </div>
                <div className="flex items-center justify-between p-3 bg-[#1a1a1a] rounded-lg">
                  <div className="flex items-center space-x-2">
                    <Building className="h-4 w-4 text-blue-400" />
                    <span className="text-sm text-white">Gestión de Unidades</span>
                  </div>
                  <Badge variant="secondary" className="bg-green-100 text-green-800">
                    Activo
                  </Badge>
                </div>
                <div className="flex items-center justify-between p-3 bg-[#1a1a1a] rounded-lg">
                  <div className="flex items-center space-x-2">
                    <DollarSign className="h-4 w-4 text-blue-400" />
                    <span className="text-sm text-white">Gestión Financiera</span>
                  </div>
                  <Badge variant="secondary" className="bg-green-100 text-green-800">
                    Activo
                  </Badge>
                </div>
                <div className="flex items-center justify-between p-3 bg-[#1a1a1a] rounded-lg">
                  <div className="flex items-center space-x-2">
                    <FileText className="h-4 w-4 text-blue-400" />
                    <span className="text-sm text-white">Reportes y Estadísticas</span>
                  </div>
                  <Badge variant="secondary" className="bg-green-100 text-green-800">
                    Activo
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Avatar y Estado */}
          <Card className="bg-[#111111] border-[#2a2a2a]">
            <CardContent className="pt-6">
              <div className="flex flex-col items-center text-center space-y-4">
                <Avatar className="h-24 w-24">
                  <AvatarImage src="/placeholder-user.jpg" alt={user.name || 'Usuario'} />
                  <AvatarFallback className="bg-blue-600 text-white text-xl">
                    {user.name ? getUserInitials(user.name) : 'A'}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="font-semibold text-white">{user.name || 'Administrador'}</h3>
                  <p className="text-sm text-gray-400">{user.email}</p>
                  <Badge variant="secondary" className="mt-2 bg-blue-100 text-blue-800">
                    <Shield className="mr-1 h-3 w-3" />
                    Administrador Sistema
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Estadísticas del Sistema */}
          <Card className="bg-[#111111] border-[#2a2a2a]">
            <CardHeader>
              <CardTitle className="text-lg text-white">Estadísticas</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-400">Total Usuarios</span>
                <Badge variant="outline" className="text-white border-gray-600">20</Badge>
              </div>
              <Separator className="bg-[#2a2a2a]" />
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-400">Unidades</span>
                <Badge variant="outline" className="text-white border-gray-600">31</Badge>
              </div>
              <Separator className="bg-[#2a2a2a]" />
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-400">Último Acceso</span>
                <span className="text-sm text-white">Hoy</span>
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
                <Link href="/admin/perfil/editar">
                  <Edit className="mr-2 h-4 w-4" />
                  Editar Perfil
                </Link>
              </Button>
              <Button variant="outline" size="sm" className="w-full justify-start" asChild>
                <Link href="/admin/configuracion/password">
                  <Key className="mr-2 h-4 w-4" />
                  Cambiar Contraseña
                </Link>
              </Button>
              <Button variant="outline" size="sm" className="w-full justify-start" asChild>
                <Link href="/admin/configuracion">
                  <Shield className="mr-2 h-4 w-4" />
                  Configuración
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}