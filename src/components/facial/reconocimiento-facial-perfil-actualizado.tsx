'use client'

/**
 * Componente actualizado para mostrar fotos de reconocimiento facial desde el backend
 */

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { CargarFotosReconocimiento } from './cargar-fotos-reconocimiento';
import { useAuth } from '@/contexts/auth-context';
import propietariosService from '@/features/propietarios/services';
import { 
  Camera, 
  Eye, 
  CheckCircle, 
  AlertCircle, 
  Shield, 
  Calendar,
  Fingerprint,
  Settings,
  Plus,
  RefreshCw,
  Loader2
} from 'lucide-react';

interface ReconocimientoFacialPerfilProps {
  onFotosActualizadas?: (fotos: string[]) => void;
}

export function ReconocimientoFacialPerfil({ 
  onFotosActualizadas
}: ReconocimientoFacialPerfilProps) {
  const { user } = useAuth();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [fotoSeleccionada, setFotoSeleccionada] = useState<string | null>(null);
  const [cargarFotosOpen, setCargarFotosOpen] = useState(false);
  
  // Estados para datos reales del backend
  const [fotos, setFotos] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [totalFotos, setTotalFotos] = useState(0);
  const [fechaActualizacion, setFechaActualizacion] = useState<string | null>(null);

  // Cargar fotos al montar el componente
  useEffect(() => {
    if (user?.id) {
      cargarFotosReconocimiento();
    }
  }, [user?.id]);

  const cargarFotosReconocimiento = async () => {
    if (!user?.id) return;
    
    try {
      setLoading(true);
      setError(null);

      console.log('🔍 COMPONENTE: Iniciando carga de fotos para usuario:', user.id);
      console.log('🔍 COMPONENTE: Email del usuario:', user.email);
      
      const response = await propietariosService.obtenerFotosReconocimiento(user.id);
      
      console.log('🔍 COMPONENTE: Respuesta completa del servicio:', response);
      console.log('🔍 COMPONENTE: response.success:', response.success);
      console.log('🔍 COMPONENTE: response.data:', response.data);
      console.log('🔍 COMPONENTE: response.message:', response.message);
      
      if (response.success && response.data) {
        const fotosUrls = response.data.fotos_urls || [];
        const totalFotos = response.data.total_fotos || 0;
        
        console.log('📸 COMPONENTE: Procesando fotos:', {
          fotosUrls,
          totalFotos,
          tieneReconocimiento: response.data.tiene_reconocimiento,
          fechaActualizacion: response.data.fecha_ultima_actualizacion
        });
        
        // DEBUG ESPECÍFICO PARA URLS
        if (fotosUrls.length > 0) {
          console.log('🎉 COMPONENTE: SE ENCONTRARON FOTOS!');
          fotosUrls.forEach((url, index) => {
            console.log(`📸 Foto ${index + 1}: ${url}`);
            console.log(`📸 Es URL de Dropbox?: ${url.includes('dropbox') ? 'SÍ' : 'NO'}`);
          });
        } else {
          console.log('😞 COMPONENTE: NO se encontraron URLs de fotos');
          console.log('🔍 COMPONENTE: Datos recibidos del backend:', JSON.stringify(response.data, null, 2));
        }
        
        setFotos(fotosUrls);
        setTotalFotos(totalFotos);
        setFechaActualizacion(response.data.fecha_ultima_actualizacion || null);
        
        if (totalFotos === 0) {
          console.log('📝 COMPONENTE: Usuario no tiene fotos - mostrando opción de configurar');
        }
      } else {
        console.log('❌ COMPONENTE: Response no exitoso o sin data');
        console.log('❌ COMPONENTE: response.success:', response.success);
        console.log('❌ COMPONENTE: response.data exists:', !!response.data);
      }
    } catch (error: any) {
      console.error('❌ COMPONENTE: Error cargando fotos de reconocimiento:', error);
      setError(error.message || 'Error cargando fotos');
      setFotos([]);
      setTotalFotos(0);
    } finally {
      setLoading(false);
    }
  };  const handleFotosActualizadas = () => {
    // Recargar fotos después de subir nuevas
    console.log('🔄 COMPONENTE: Recargando fotos después de actualización...');
    
    // Esperar un momento para que el backend procese
    setTimeout(() => {
      cargarFotosReconocimiento();
    }, 2000);
    
    setCargarFotosOpen(false);
    
    if (onFotosActualizadas) {
      onFotosActualizadas(fotos);
    }
  };

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

  const activo = totalFotos > 0;
  const fotoPrincipal = fotos.length > 0 ? fotos[0] : null;

  if (loading) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Fingerprint className="h-5 w-5" />
            Reconocimiento Facial
            <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
              <Loader2 className="w-3 h-3 mr-1 animate-spin" />
              Cargando...
            </Badge>
          </CardTitle>
          <CardDescription>
            Obteniendo información de reconocimiento facial...
          </CardDescription>
        </CardHeader>
        <CardContent className="flex justify-center py-8">
          <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
        </CardContent>
      </Card>
    );
  }

  if (error && totalFotos === 0) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Fingerprint className="h-5 w-5" />
            Reconocimiento Facial
            <Badge variant="destructive" className="bg-red-100 text-red-800">
              <AlertCircle className="w-3 h-3 mr-1" />
              Error
            </Badge>
          </CardTitle>
          <CardDescription>
            Hubo un problema al cargar la información
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-center py-4">
            <AlertCircle className="h-8 w-8 text-red-500 mx-auto mb-2" />
            <p className="text-red-600 mb-4">{error}</p>
            <Button 
              onClick={cargarFotosReconocimiento}
              variant="outline"
              className="gap-2"
            >
              <RefreshCw className="h-4 w-4" />
              Reintentar
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

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
              ? `Tu reconocimiento facial está configurado con ${totalFotos} foto${totalFotos > 1 ? 's' : ''}`
              : 'El reconocimiento facial no está configurado'
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
                
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-1">
                    <Shield className="w-4 h-4 text-green-600" />
                    <span className="font-medium text-green-700">Sistema Activo</span>
                  </div>
                  
                  {fechaActualizacion && (
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      <Calendar className="w-3 h-3" />
                      <span>Actualizado: {formatearFecha(fechaActualizacion)}</span>
                    </div>
                  )}
                  
                  <p className="text-sm text-gray-600 mt-1">
                    {totalFotos} foto{totalFotos > 1 ? 's' : ''} registrada{totalFotos > 1 ? 's' : ''}
                  </p>
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => verFoto(fotoPrincipal)}
                  className="gap-2"
                >
                  <Eye className="w-4 h-4" />
                  Ver
                </Button>
              </div>

              {/* Galería completa de fotos */}
              {fotos.length > 1 && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-medium text-gray-700">
                      Todas las fotos ({fotos.length})
                    </h4>
                    <Badge variant="outline" className="text-xs">
                      Galería completa
                    </Badge>
                  </div>
                  
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                    {fotos.map((fotoUrl, index) => (
                      <div key={index} className="relative group">
                        <img
                          src={fotoUrl}
                          alt={`Foto de reconocimiento ${index + 1}`}
                          className="w-full h-24 object-cover rounded-lg cursor-pointer hover:scale-105 transition-transform shadow-sm border"
                          onClick={() => verFoto(fotoUrl)}
                        />
                        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 rounded-lg transition-opacity" />
                        
                        {/* Número de foto */}
                        <div className="absolute top-1 right-1 bg-blue-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs font-medium">
                          {index + 1}
                        </div>
                        
                        {/* Icono de verificación para foto principal */}
                        {index === 0 && (
                          <div className="absolute bottom-1 left-1 bg-green-500 rounded-full p-1">
                            <CheckCircle className="w-3 h-3 text-white" />
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Botones de acción */}
              <div className="flex space-x-2 pt-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCargarFotosOpen(true)}
                  className="gap-2"
                >
                  <Plus className="w-4 h-4" />
                  Actualizar Fotos
                </Button>
                
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={cargarFotosReconocimiento}
                  className="gap-2"
                >
                  <RefreshCw className="w-4 h-4" />
                  Recargar
                </Button>
              </div>
            </div>
          ) : (
            <div className="text-center py-8 space-y-4">
              <div className="w-20 h-20 mx-auto bg-gray-100 rounded-full flex items-center justify-center">
                <Camera className="w-8 h-8 text-gray-400" />
              </div>
              
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No se han registrado fotos para reconocimiento facial
                </h3>
                <p className="text-gray-600 mb-4">
                  Configura tu reconocimiento facial para acceder de forma rápida y segura al edificio.
                </p>
              </div>

              {/* Debug info cuando no hay fotos */}
              <div className="bg-gray-50 rounded-lg p-4 mb-4 text-left max-w-md mx-auto">
                <h4 className="text-sm font-medium text-gray-700 mb-2 text-center">🔍 Estado del sistema:</h4>
                <ul className="text-xs text-gray-600 space-y-1">
                  <li>• Total fotos: {totalFotos}</li>
                  <li>• URLs cargadas: {fotos.length}</li>
                  <li>• Última actualización: {fechaActualizacion || 'Nunca'}</li>
                  <li>• Usuario ID: {user?.id}</li>
                  <li>• Email: {user?.email}</li>
                </ul>
              </div>

              <Button
                onClick={() => setCargarFotosOpen(true)}
                className="gap-2"
              >
                <Plus className="w-4 h-4" />
                Configurar Reconocimiento
              </Button>
            </div>
          )}

          {/* Información de seguridad */}
          <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
            <div className="flex items-start space-x-2">
              <Shield className="w-4 h-4 text-blue-600 mt-0.5" />
              <div className="text-sm">
                <h4 className="font-medium text-blue-900 mb-1">Información de Seguridad</h4>
                <ul className="text-blue-700 space-y-1">
                  <li>• Tus datos biométricos están encriptados y seguros</li>
                  <li>• Solo se usan para autenticación en este edificio</li>
                  <li>• Puedes solicitar su eliminación en cualquier momento</li>
                  {activo && <li>• El sistema está funcionando correctamente</li>}
                </ul>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Dialog para ver foto ampliada */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Foto de Reconocimiento Facial</DialogTitle>
            <DialogDescription>
              Foto registrada para autenticación biométrica
            </DialogDescription>
          </DialogHeader>
          
          {fotoSeleccionada && (
            <div className="flex justify-center">
              <img
                src={fotoSeleccionada}
                alt="Foto de reconocimiento facial"
                className="max-w-full max-h-80 object-contain rounded-lg"
              />
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Dialog para cargar fotos */}
      <Dialog open={cargarFotosOpen} onOpenChange={setCargarFotosOpen}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Configurar Reconocimiento Facial</DialogTitle>
            <DialogDescription>
              Sube fotos de buena calidad para mejorar la precisión del reconocimiento
            </DialogDescription>
          </DialogHeader>
          
          <CargarFotosReconocimiento
            onFotosActualizadas={handleFotosActualizadas}
            fotosExistentes={fotos}
          />
        </DialogContent>
      </Dialog>
    </>
  );
}