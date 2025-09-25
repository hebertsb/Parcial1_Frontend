/**
 * Componente de confirmación para eliminar usuario de seguridad (lógico)
 * Modal de confirmación para desactivar usuario
 */

'use client';

import React, { useState } from 'react';
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/src/components/ui/dialog';
import { Button } from '@/src/components/ui/button';
import { Badge } from '@/src/components/ui/badge';
import { 
  Trash2, 
  AlertTriangle,
  Loader2,
  X,
  User
} from 'lucide-react';
import { useSeguridadUsuarios } from '@/src/features/admin/hooks/useSeguridadUsuarios';
import type { UsuarioSeguridad } from '@/src/features/admin/services/seguridad';

interface EliminarUsuarioSeguridadProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  usuario: UsuarioSeguridad | null;
}

export function EliminarUsuarioSeguridad({ 
  isOpen, 
  onClose, 
  onSuccess,
  usuario 
}: EliminarUsuarioSeguridadProps) {
  const { eliminarUsuario } = useSeguridadUsuarios();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleEliminar = async () => {
    if (!usuario) return;

    try {
      setLoading(true);
      setError(null);

      console.log('🗑️ EliminarUsuarioSeguridad: Eliminando usuario...', usuario.email);

      const success = await eliminarUsuario(usuario.id);

      if (success) {
        console.log('✅ EliminarUsuarioSeguridad: Usuario eliminado exitosamente');
        onSuccess();
        onClose();
      } else {
        setError('Error al eliminar el usuario. Por favor, inténtalo de nuevo.');
      }
    } catch (err: any) {
      console.error('❌ EliminarUsuarioSeguridad: Error:', err);
      setError(err.message || 'Error de conexión. Por favor, inténtalo de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  if (!usuario) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-red-600">
            <Trash2 className="w-5 h-5" />
            Eliminar Usuario de Seguridad
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Advertencia */}
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="text-amber-800 font-medium">¿Estás seguro?</h4>
                <p className="text-amber-700 mt-1 text-sm">
                  Esta acción desactivará el usuario de seguridad. El usuario no podrá acceder al sistema, 
                  pero sus datos se conservarán.
                </p>
              </div>
            </div>
          </div>

          {/* Información del Usuario */}
          <div className="bg-gray-50 rounded-lg p-4 space-y-3">
            <h4 className="font-medium text-gray-900 flex items-center gap-2">
              <User className="w-4 h-4" />
              Usuario a eliminar:
            </h4>
            
            <div className="space-y-2">
              <div>
                <span className="text-sm text-gray-600">Nombre:</span>
                <p className="text-gray-900 font-medium">
                  {usuario.persona.nombre} {usuario.persona.apellido}
                </p>
              </div>
              
              <div>
                <span className="text-sm text-gray-600">Email:</span>
                <p className="text-gray-900">{usuario.email}</p>
              </div>
              
              <div>
                <span className="text-sm text-gray-600">CI:</span>
                <p className="text-gray-900">{usuario.persona.ci}</p>
              </div>
              
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600">Estado actual:</span>
                <Badge variant={usuario.is_active ? "default" : "secondary"}>
                  {usuario.is_active ? 'Activo' : 'Inactivo'}
                </Badge>
              </div>
            </div>
          </div>

          {/* Error */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="flex items-center gap-2">
                <X className="w-5 h-5 text-red-600" />
                <p className="text-red-800 font-medium">Error</p>
              </div>
              <p className="text-red-700 mt-1">{error}</p>
            </div>
          )}

          {/* Nota informativa */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
            <p className="text-blue-800 text-sm">
              <strong>Nota:</strong> Esta es una eliminación lógica. El usuario será desactivado 
              pero podrá ser reactivado posteriormente por un administrador.
            </p>
          </div>

          {/* Botones de Acción */}
          <div className="flex justify-end gap-3 pt-2">
            <Button variant="outline" onClick={onClose} disabled={loading}>
              Cancelar
            </Button>
            <Button 
              variant="destructive" 
              onClick={handleEliminar} 
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin mr-2" />
                  Eliminando...
                </>
              ) : (
                <>
                  <Trash2 className="w-4 h-4 mr-2" />
                  Eliminar Usuario
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}