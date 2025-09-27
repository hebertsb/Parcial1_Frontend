'use client'

/**
 * Componente para mostrar el estado de reconocimiento facial en el perfil del propietario
 */

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { 
  Camera, 
  Eye, 
  CheckCircle, 
  AlertCircle, 
  Shield, 
  Calendar,
  Fingerprint,
  Settings
} from 'lucide-react';

interface ReconocimientoFacialPerfilProps {
  fotosUrls?: string[];
  activo?: boolean;
  fechaEnrolamiento?: string;
  nombreUsuario: string;
}

export function ReconocimientoFacialPerfil({ 
  fotosUrls = [], 
  activo = false, 
  fechaEnrolamiento,
  nombreUsuario 
}: ReconocimientoFacialPerfilProps) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [fotoSeleccionada, setFotoSeleccionada] = useState<string | null>(null);

  const verFoto = (fotoUrl: string) => {
    setFotoSeleccionada(fotoUrl);
    setDialogOpen(true);
  };

  const formatearFecha = (fecha: string) => {
    return new Date(fecha).toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Obtener la primera foto como foto principal
  const fotoPrincipal = fotosUrls && fotosUrls.length > 0 ? fotosUrls[0] : null;

  return (
    <>
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Fingerprint className="h-5 w-5" />
            Reconocimiento Facial
            {activo ? (
              <Badge variant="default" className="bg-green-100 text-green-800">
                <CheckCircle className="w-3 h-3 mr-1" />
                Activo
              </Badge>
            ) : (
              <Badge variant="secondary" className="bg-gray-100 text-gray-600">
                <AlertCircle className="w-3 h-3 mr-1" />
                Inactivo
              </Badge>
            )}
          </CardTitle>
          <CardDescription>
            {activo 
              ? 'Tu reconocimiento facial está configurado y funcionando'
              : 'El reconocimiento facial no está disponible'
            }
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          {activo && fotoPrincipal ? (
            <div className="space-y-4">
              {/* Foto Principal */}
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <img
                    src={fotoPrincipal}
                    alt="Foto de reconocimiento facial"
                    className="w-20 h-20 object-cover rounded-full border-2 border-green-500 cursor-pointer hover:opacity-75 transition-opacity"
                    onClick={() => verFoto(fotoPrincipal)}
                  />
                  <div className="absolute -bottom-1 -right-1 bg-green-500 rounded-full p-1">
                    <CheckCircle className="w-4 h-4 text-white" />
                  </div>
                </div>
                
                <div className="flex-1 space-y-2">
                  <div className="flex items-center gap-2">
                    <Shield className="w-4 h-4 text-green-600" />
                    <span className="text-sm font-medium text-green-700">
                      Verificación Biométrica Activa
                    </span>
                  </div>
                  
                  {fechaEnrolamiento && (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Calendar className="w-3 h-3" />
                      <span>Configurado el {formatearFecha(fechaEnrolamiento)}</span>
                    </div>
                  )}
                  
                  <div className="text-xs text-muted-foreground">
                    {fotosUrls.length} foto{fotosUrls.length > 1 ? 's' : ''} registrada{fotosUrls.length > 1 ? 's' : ''}
                  </div>
                </div>
              </div>

              {/* Funcionalidades */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                    <Shield className="w-4 h-4 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-green-800">Acceso Seguro</p>
                    <p className="text-xs text-green-600">Al sistema del edificio</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <Camera className="w-4 h-4 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-blue-800">Control de Acceso</p>
                    <p className="text-xs text-blue-600">Físico al edificio</p>
                  </div>
                </div>
              </div>

              {/* Botones de acción */}
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => verFoto(fotoPrincipal)}
                >
                  <Eye className="w-4 h-4 mr-2" />
                  Ver Foto
                </Button>
                
                {fotosUrls.length > 1 && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      // Mostrar todas las fotos en un diálogo diferente
                      console.log('Ver todas las fotos');
                    }}
                  >
                    <Camera className="w-4 h-4 mr-2" />
                    Ver Todas ({fotosUrls.length})
                  </Button>
                )}
                
                <Button
                  variant="outline"
                  size="sm"
                  disabled
                >
                  <Settings className="w-4 h-4 mr-2" />
                  Configurar
                </Button>
              </div>
            </div>
          ) : (
            // Estado inactivo
            <div className="text-center py-6 space-y-4">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto">
                <Fingerprint className="w-8 h-8 text-gray-400" />
              </div>
              
              <div>
                <h4 className="font-medium text-gray-900 mb-1">
                  Reconocimiento Facial No Configurado
                </h4>
                <p className="text-sm text-muted-foreground">
                  {fotosUrls.length === 0 
                    ? 'No se han registrado fotos para reconocimiento facial'
                    : 'Las fotos están siendo procesadas por el administrador'
                  }
                </p>
              </div>
              
              {!activo && fotosUrls.length > 0 && (
                <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
                  <AlertCircle className="w-3 h-3 mr-1" />
                  Procesando...
                </Badge>
              )}
            </div>
          )}

          {/* Información de seguridad */}
          <div className="bg-blue-50 p-3 rounded-lg">
            <h4 className="text-sm font-medium text-blue-900 mb-2">Información de Seguridad</h4>
            <ul className="text-xs text-blue-800 space-y-1">
              <li>• Tus datos biométricos están encriptados y seguros</li>
              <li>• Solo se usan para autenticación en este edificio</li>
              <li>• Puedes solicitar su eliminación en cualquier momento</li>
              {activo && <li>• El sistema está funcionando correctamente</li>}
            </ul>
          </div>
        </CardContent>
      </Card>

      {/* Dialog para ver foto ampliada */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Foto de Reconocimiento Facial</DialogTitle>
            <DialogDescription>
              Foto registrada para {nombreUsuario}
            </DialogDescription>
          </DialogHeader>
          
          {fotoSeleccionada && (
            <div className="space-y-4">
              <img
                src={fotoSeleccionada}
                alt="Foto de reconocimiento facial"
                className="w-full max-h-80 object-contain rounded-lg border"
              />
              
              <div className="text-center space-y-2">
                <div className="flex items-center justify-center gap-2">
                  {activo ? (
                    <>
                      <CheckCircle className="w-4 h-4 text-green-600" />
                      <span className="text-sm text-green-600 font-medium">
                        Reconocimiento Activo
                      </span>
                    </>
                  ) : (
                    <>
                      <AlertCircle className="w-4 h-4 text-yellow-600" />
                      <span className="text-sm text-yellow-600 font-medium">
                        En Procesamiento
                      </span>
                    </>
                  )}
                </div>
                
                {fechaEnrolamiento && (
                  <p className="text-xs text-muted-foreground">
                    Registrado el {formatearFecha(fechaEnrolamiento)}
                  </p>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}

export default ReconocimientoFacialPerfil;