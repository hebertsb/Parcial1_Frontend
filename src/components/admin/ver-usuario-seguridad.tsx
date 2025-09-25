/**
 * Componente para ver detalles de un usuario de seguridad
 * Formulario modal para visualizar información completa del usuario
 */

'use client';

import React, { useState, useEffect } from 'react';
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/src/components/ui/dialog';
import { Button } from '@/src/components/ui/button';
import { Badge } from '@/src/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/src/components/ui/card';
import { Separator } from '@/src/components/ui/separator';
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  CreditCard, 
  Calendar,
  Shield,
  Loader2,
  X
} from 'lucide-react';
import { useSeguridadUsuarios } from '@/src/features/admin/hooks/useSeguridadUsuarios';
import type { UsuarioSeguridad } from '@/src/features/admin/services/seguridad';

interface VerUsuarioSeguridadProps {
  isOpen: boolean;
  onClose: () => void;
  userId: number | null;
}

export function VerUsuarioSeguridad({ isOpen, onClose, userId }: VerUsuarioSeguridadProps) {
  const { verUsuario } = useSeguridadUsuarios();
  const [usuario, setUsuario] = useState<UsuarioSeguridad | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Cargar datos del usuario cuando se abre el modal
  useEffect(() => {
    if (isOpen && userId) {
      cargarUsuario();
    } else {
      // Limpiar datos cuando se cierra
      setUsuario(null);
      setError(null);
    }
  }, [isOpen, userId]);

  const cargarUsuario = async () => {
    if (!userId) return;
    
    try {
      setLoading(true);
      setError(null);
      
      const usuarioData = await verUsuario(userId);
      
      if (usuarioData) {
        setUsuario(usuarioData);
      } else {
        setError('No se pudo cargar la información del usuario');
      }
    } catch (err: any) {
      setError(err.message || 'Error al cargar el usuario');
      console.error('Error cargando usuario:', err);
    } finally {
      setLoading(false);
    }
  };

  const formatearFecha = (fechaString: string) => {
    try {
      const fecha = new Date(fechaString);
      return fecha.toLocaleDateString('es-ES', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return fechaString;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-blue-600" />
            Detalles del Usuario de Seguridad
          </DialogTitle>
        </DialogHeader>

        {loading && (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
            <span className="ml-2 text-gray-600">Cargando información...</span>
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-center gap-2">
              <X className="w-5 h-5 text-red-600" />
              <p className="text-red-800 font-medium">Error</p>
            </div>
            <p className="text-red-700 mt-1">{error}</p>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={cargarUsuario}
              className="mt-2"
            >
              Reintentar
            </Button>
          </div>
        )}

        {usuario && !loading && (
          <div className="space-y-6">
            {/* Estado del Usuario */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <User className="w-5 h-5 text-gray-600" />
                <span className="font-medium text-gray-900">Estado:</span>
              </div>
              <Badge variant={usuario.is_active ? "default" : "secondary"}>
                {usuario.is_active ? 'Activo' : 'Inactivo'}
              </Badge>
            </div>

            <Separator />

            {/* Información Personal */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <User className="w-5 h-5" />
                  Información Personal
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-600">Nombre</label>
                    <p className="text-gray-900">{usuario.persona.nombre}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Apellido</label>
                    <p className="text-gray-900">{usuario.persona.apellido}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600 flex items-center gap-1">
                      <CreditCard className="w-4 h-4" />
                      Cédula de Identidad
                    </label>
                    <p className="text-gray-900">{usuario.persona.ci}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600 flex items-center gap-1">
                      <Phone className="w-4 h-4" />
                      Teléfono
                    </label>
                    <p className="text-gray-900">{usuario.persona.telefono}</p>
                  </div>
                </div>
                
                {usuario.persona.direccion && (
                  <div>
                    <label className="text-sm font-medium text-gray-600 flex items-center gap-1">
                      <MapPin className="w-4 h-4" />
                      Dirección
                    </label>
                    <p className="text-gray-900">{usuario.persona.direccion}</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Información de Cuenta */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Mail className="w-5 h-5" />
                  Información de Cuenta
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-600">Email</label>
                  <p className="text-gray-900">{usuario.email}</p>
                </div>
                
                <div>
                  <label className="text-sm font-medium text-gray-600">Roles</label>
                  <div className="flex gap-2 mt-1">
                    {usuario.roles.map((rol, index) => (
                      <Badge key={index} variant="outline">
                        {rol}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-600 flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    Fecha de Registro
                  </label>
                  <p className="text-gray-900">{formatearFecha(usuario.date_joined)}</p>
                </div>
              </CardContent>
            </Card>

            {/* Botones de Acción */}
            <div className="flex justify-end gap-3 pt-4">
              <Button variant="outline" onClick={onClose}>
                Cerrar
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}