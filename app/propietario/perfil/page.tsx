/**
 * Página de visualización de perfil del propietario
 */

'use client';

import { usePerfilPropietario } from '@/hooks/usePerfilPropietario';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ReconocimientoFacialPerfil } from '@/components/facial/reconocimiento-facial-perfil';
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
  RefreshCw
} from 'lucide-react';
import Link from 'next/link';

export default function PerfilPropietario() {
  // ...existing code...
  // Utilidad para transformar la URL de Dropbox a formato raw
  const getRawDropboxUrl = (url: string) => {
    if (!url) return "/placeholder-user.jpg";
    let rawUrl = url.replace("www.dropbox.com", "dl.dropboxusercontent.com");
    // Eliminar el parámetro dl=0 si existe
    rawUrl = rawUrl.replace(/([&?])dl=0(&)?/, (match, p1, p2) => p2 ? p1 : '');
    return rawUrl;
  };
  // Utilidad para obtener la URL de reconocimiento facial y convertirla en descarga directa si es de Dropbox
  // Utilidad para obtener la URL de imagen (perfil o reconocimiento) y convertirla en descarga directa si es de Dropbox
  const getImagenUrl = (user: any) => {
    let url = user.foto_perfil ||
      (Array.isArray(user.fotos_reconocimiento_urls)
        ? (typeof user.fotos_reconocimiento_urls[0] === 'string'
            ? user.fotos_reconocimiento_urls[0]
            : user.fotos_reconocimiento_urls[0]?.url)
        : undefined);
    if (url && url.includes('dropbox.com')) {
      url = url.replace('dl=0', 'dl=1');
    }
    return url || "/placeholder-user.jpg";
  };
  const { perfil: user, loading, error, refetch, debugUserData, tienePropiedades, totalPropiedades } = usePerfilPropietario();
  // Debug: mostrar el valor de la foto de perfil en consola
  console.log('Valor de user.foto_perfil:', user?.foto_perfil);

  if (loading || !user) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-2 text-muted-foreground">
            {loading ? 'Cargando perfil completo...' : 'Cargando perfil...'}
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center space-y-4">
          <div className="text-red-500">
            <Shield className="h-12 w-12 mx-auto mb-2" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-red-600">Error cargando perfil</h3>
            <p className="text-sm text-muted-foreground mt-1">{error}</p>
            <Button 
              onClick={refetch} 
              className="mt-4"
              variant="outline"
            >
              <RefreshCw className="mr-2 h-4 w-4" />
              Reintentar
            </Button>
          </div>
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
          <h1 className="text-2xl font-bold">Mi Perfil</h1>
          <p className="text-muted-foreground">
            Información personal y configuración de cuenta
          </p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" onClick={refetch}>
            <RefreshCw className="mr-2 h-4 w-4" />
            Actualizar
          </Button>
          <Button variant="outline" onClick={debugUserData} className="bg-yellow-100 hover:bg-yellow-200">
            🐛 Debug
          </Button>
          <Button variant="outline" asChild>
            <Link href="/propietario/perfil/editar">
              <Edit className="mr-2 h-4 w-4" />
              Editar Perfil
            </Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/propietario/configuracion/password">
              <Key className="mr-2 h-4 w-4" />
              Cambiar Contraseña
            </Link>
          </Button>
        </div>
      </div>

      {/* DEBUG: Información temporal para desarrollo */}
      <Card className="bg-yellow-50 border-yellow-200">
        <CardHeader>
          <CardTitle className="text-sm text-yellow-800">🐛 DEBUG - Datos del Usuario</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-xs space-y-1 text-yellow-700">
            <p><strong>ID:</strong> {user?.id || 'No disponible'}</p>
            <p><strong>Email:</strong> {user?.email || 'No disponible'}</p>
            <p><strong>Nombre:</strong> {user?.name || 'No disponible'}</p>
            <p><strong>Rol:</strong> {user?.role || 'No disponible'}</p>
            <p><strong>Teléfono:</strong> {user?.telefono || 'No disponible'}</p>
            <p><strong>Dirección:</strong> {user?.direccion || 'No disponible'}</p>
            <p><strong>Total Propiedades:</strong> {totalPropiedades}</p>
            <p><strong>Tiene Propiedades:</strong> {tienePropiedades ? 'Sí' : 'No'}</p>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 md:grid-cols-3">
        {/* Información Personal */}
        <div className="md:col-span-2 space-y-6">
          {/* Datos Básicos */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <User className="mr-2 h-5 w-5" />
                Información Personal
              </CardTitle>
              <CardDescription>
                Datos básicos de tu cuenta
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Nombre Completo</label>
                  <p className="text-sm mt-1">{user.name || 'No especificado'}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Email</label>
                  <p className="text-sm mt-1 flex items-center">
                    <Mail className="mr-2 h-4 w-4 text-muted-foreground" />
                    {user.email || 'No especificado'}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Teléfono</label>
                  <p className="text-sm mt-1 flex items-center">
                    <Phone className="mr-2 h-4 w-4 text-muted-foreground" />
                    {user.telefono || 'No especificado'}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Rol</label>
                  <div className="mt-1">
                    <Badge variant="secondary" className="bg-green-100 text-green-800">
                      <Shield className="mr-1 h-3 w-3" />
                      {user.role === 'propietario' ? 'Propietario' : 'Administrador'}
                    </Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Información de Contacto */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <MapPin className="mr-2 h-5 w-5" />
                Información de Contacto
              </CardTitle>
              <CardDescription>
                Dirección y datos de contacto
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium text-muted-foreground">Dirección</label>
                <p className="text-sm mt-1">{user.direccion || 'No especificada'}</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Ciudad</label>
                  <p className="text-sm mt-1">{user.ciudad || 'No especificada'}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Código Postal</label>
                  <p className="text-sm mt-1">{user.codigo_postal || 'No especificado'}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Información de Propiedades */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center">
                  <Building className="mr-2 h-5 w-5" />
                  Mis Propiedades
                </div>
                <Badge variant="secondary">
                  {totalPropiedades} {totalPropiedades === 1 ? 'propiedad' : 'propiedades'}
                </Badge>  
              </CardTitle>
              <CardDescription>
                Detalles sobre tus propiedades en el condominio
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {tienePropiedades ? (
                <div className="space-y-4">
                  {/* Propiedad Principal */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Número de Unidad</label>
                      <p className="text-sm mt-1 font-medium">{user.numero_unidad || 'No asignada'}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Tipo de Unidad</label>
                      <p className="text-sm mt-1">{user.tipo_unidad || 'No especificado'}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Torre/Bloque</label>
                      <p className="text-sm mt-1">{user.torre || 'No especificada'}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Área (m²)</label>
                      <p className="text-sm mt-1">{user.area_unidad || 'No especificada'}</p>
                    </div>
                  </div>

                  {/* Lista de todas las propiedades si tiene más de una */}
                  {user.propiedades && user.propiedades.length > 1 && (
                    <div className="mt-6">
                      <Separator />
                      <div className="mt-4">
                        <h4 className="text-sm font-medium text-muted-foreground mb-3">
                          Todas mis propiedades ({user.propiedades.length})
                        </h4>
                        <div className="grid gap-3">
                          {user.propiedades.map((propiedad, index) => (
                            <div key={propiedad.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                              <div className="flex items-center space-x-3">
                                <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                                  <Building className="h-4 w-4 text-primary" />
                                </div>
                                <div>
                                  <p className="font-medium text-sm">
                                    {propiedad.numero_casa} - {propiedad.bloque}
                                  </p>
                                  <p className="text-xs text-muted-foreground">
                                    {propiedad.tipo_vivienda} • {propiedad.metros_cuadrados} m²
                                  </p>
                                </div>
                              </div>
                              <Badge variant="outline" className="text-xs">
                                {propiedad.estado}
                              </Badge>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-6">
                  <Building className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
                  <p className="text-sm text-muted-foreground">
                    No tienes propiedades registradas en este momento
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Reconocimiento Facial */}
          <ReconocimientoFacialPerfil
            fotosUrls={user.fotos_reconocimiento_urls}
            activo={user.reconocimiento_facial_activo}
            fechaEnrolamiento={user.fecha_enrolamiento}
            nombreUsuario={user.name || 'Usuario'}
          />
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Avatar y Estado */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-col items-center text-center space-y-4">
                <Avatar className="h-24 w-24">
                  <AvatarImage
                    src={getRawDropboxUrl(
                      user.foto_perfil ||
                      (Array.isArray(user.fotos_reconocimiento_urls)
                        ? user.fotos_reconocimiento_urls[0]
                        : undefined)
                    )}
                    alt={user.name || 'Usuario'}
                  />
                  <AvatarFallback className="bg-primary text-primary-foreground text-xl">
                    {user.name ? getUserInitials(user.name) : 'U'}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="font-semibold">{user.name || 'Usuario'}</h3>
                  <p className="text-sm text-muted-foreground">{user.email}</p>
                  <Badge variant="secondary" className="mt-2 bg-green-100 text-green-800">
                    <Shield className="mr-1 h-3 w-3" />
                    Cuenta Verificada
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Estadísticas */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Estadísticas</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Total Propiedades</span>
                <Badge variant="outline">{totalPropiedades}</Badge>
              </div>
              <Separator />
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Estado Propiedades</span>
                <Badge variant="outline" className={tienePropiedades ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"}>
                  {tienePropiedades ? 'Activas' : 'Sin propiedades'}
                </Badge>
              </div>
              <Separator />
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Último Acceso</span>
                <span className="text-sm">Hoy</span>
              </div>
            </CardContent>
          </Card>

          {/* Acciones Rápidas */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Acciones Rápidas</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button variant="outline" size="sm" className="w-full justify-start" asChild>
                <Link href="/propietario/perfil/editar">
                  <Edit className="mr-2 h-4 w-4" />
                  Editar Perfil
                </Link>
              </Button>
              <Button variant="outline" size="sm" className="w-full justify-start" asChild>
                <Link href="/propietario/configuracion/password">
                  <Key className="mr-2 h-4 w-4" />
                  Cambiar Contraseña
                </Link>
              </Button>
              <Button variant="outline" size="sm" className="w-full justify-start" asChild>
                <Link href="/propietario/notificaciones">
                  <Bell className="mr-2 h-4 w-4" />
                  Notificaciones
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}