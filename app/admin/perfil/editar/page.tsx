/**
 * Página de edición de perfil del administrador
 */

'use client';

import { useState } from 'react';
import { useAuth } from '@/contexts/auth-context';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Save,
  ArrowLeft,
  Shield,
  Upload
} from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function EditarPerfilAdmin() {
  const { user, updateUser } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    telefono: user?.telefono || '',
    direccion: user?.direccion || '',
    ciudad: user?.ciudad || '',
    codigo_postal: user?.codigo_postal || ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Simular guardado (aquí integrarías con tu API)
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const updatedUser = {
        ...user!,
        ...formData
      };
      
      updateUser(updatedUser);
      router.push('/admin/perfil');
    } catch (error) {
      console.error('Error al actualizar perfil:', error);
    } finally {
      setLoading(false);
    }
  };

  const getUserInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-2 text-gray-400">Cargando perfil...</p>
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
            <h1 className="text-2xl font-bold text-white">Editar Perfil</h1>
            <p className="text-gray-400">
              Actualiza tu información personal
            </p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid gap-6 md:grid-cols-3">
          {/* Formulario Principal */}
          <div className="md:col-span-2 space-y-6">
            {/* Información Personal */}
            <Card className="bg-[#111111] border-[#2a2a2a]">
              <CardHeader>
                <CardTitle className="flex items-center text-white">
                  <User className="mr-2 h-5 w-5" />
                  Información Personal
                </CardTitle>
                <CardDescription className="text-gray-400">
                  Actualiza tus datos básicos
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-gray-300">Nombre Completo</Label>
                    <Input
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className="bg-[#1a1a1a] border-[#2a2a2a] text-white"
                      placeholder="Tu nombre completo"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-gray-300">Email</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="bg-[#1a1a1a] border-[#2a2a2a] text-white"
                      placeholder="tu@email.com"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="telefono" className="text-gray-300">Teléfono</Label>
                    <Input
                      id="telefono"
                      name="telefono"
                      value={formData.telefono}
                      onChange={handleChange}
                      className="bg-[#1a1a1a] border-[#2a2a2a] text-white"
                      placeholder="+591 000 000 000"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-gray-300">Rol</Label>
                    <div className="flex items-center space-x-2 mt-2">
                      <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                        <Shield className="mr-1 h-3 w-3" />
                        Administrador
                      </Badge>
                      <span className="text-xs text-gray-400">(No editable)</span>
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
                <div className="space-y-2">
                  <Label htmlFor="direccion" className="text-gray-300">Dirección</Label>
                  <Input
                    id="direccion"
                    name="direccion"
                    value={formData.direccion}
                    onChange={handleChange}
                    className="bg-[#1a1a1a] border-[#2a2a2a] text-white"
                    placeholder="Tu dirección completa"
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="ciudad" className="text-gray-300">Ciudad</Label>
                    <Input
                      id="ciudad"
                      name="ciudad"
                      value={formData.ciudad}
                      onChange={handleChange}
                      className="bg-[#1a1a1a] border-[#2a2a2a] text-white"
                      placeholder="Tu ciudad"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="codigo_postal" className="text-gray-300">Código Postal</Label>
                    <Input
                      id="codigo_postal"
                      name="codigo_postal"
                      value={formData.codigo_postal}
                      onChange={handleChange}
                      className="bg-[#1a1a1a] border-[#2a2a2a] text-white"
                      placeholder="00000"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Botones de Acción */}
            <div className="flex justify-end space-x-4">
              <Button variant="outline" type="button" asChild>
                <Link href="/admin/perfil">
                  Cancelar
                </Link>
              </Button>
              <Button type="submit" disabled={loading}>
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Guardando...
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    Guardar Cambios
                  </>
                )}
              </Button>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Avatar */}
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
                    <h3 className="font-semibold text-white">{formData.name || 'Administrador'}</h3>
                    <p className="text-sm text-gray-400">{formData.email}</p>
                    <Badge variant="secondary" className="mt-2 bg-blue-100 text-blue-800">
                      <Shield className="mr-1 h-3 w-3" />
                      Administrador
                    </Badge>
                  </div>
                  <Button variant="outline" size="sm" className="w-full">
                    <Upload className="mr-2 h-4 w-4" />
                    Cambiar Foto
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Información Adicional */}
            <Card className="bg-[#111111] border-[#2a2a2a]">
              <CardHeader>
                <CardTitle className="text-lg text-white">Nota</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-400">
                  Los cambios en tu perfil se aplicarán inmediatamente después de guardar.
                  Tu información de administrador es importante para el sistema.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </form>
    </div>
  );
}