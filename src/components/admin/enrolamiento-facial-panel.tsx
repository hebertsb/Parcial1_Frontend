/**
 * Panel de administrador para enrolamiento facial
 * Permite enrolar fotos después de aprobar solicitudes
 */

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Loader2, Camera, CheckCircle, AlertTriangle, Eye, Trash2 } from 'lucide-react';
import { useFaceRecognition } from '@/features/facial/hooks';
import { registroFacialService } from '@/features/facial/registro-service';

interface SolicitudConFoto {
  id: number;
  nombre: string;
  apellido: string;
  email: string;
  numero_casa: string;
  tipo: 'copropietario' | 'inquilino';
  personaId?: number;
  tieneFoto: boolean;
  fotoTemporal?: File;
}

export function EnrolamientoFacialPanel() {
  const [solicitudes, setSolicitudes] = useState<SolicitudConFoto[]>([]);
  const [loading, setLoading] = useState(true);
  const [procesando, setProcesando] = useState<number | null>(null);
  const { enrollFace, loading: enrollLoading, error: enrollError } = useFaceRecognition();

  useEffect(() => {
    cargarSolicitudesConFotos();
    // Limpiar fotos temporales antiguas al cargar
    registroFacialService.limpiezaFotosTemporales();
  }, []);

  const cargarSolicitudesConFotos = async () => {
    setLoading(true);
    try {
      // Obtener solicitudes aprobadas pendientes de enrolamiento
      // Esta es una función mock - necesitarías implementar el endpoint real
      const solicitudesData = await obtenerSolicitudesAprobadas();
      
      // Verificar cuáles tienen foto temporal
      const solicitudesConFoto = await Promise.all(
        solicitudesData.map(async (solicitud: any) => ({
          ...solicitud,
          tieneFoto: registroFacialService.tieneFotoTemporal(solicitud.id.toString()),
          fotoTemporal: await registroFacialService.recuperarFotoTemporal(solicitud.id.toString())
        }))
      );

      setSolicitudes(solicitudesConFoto.filter(s => s.tieneFoto));
    } catch (error) {
      console.error('Error cargando solicitudes:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEnrolar = async (solicitud: SolicitudConFoto) => {
    if (!solicitud.fotoTemporal || !solicitud.personaId) return;

    setProcesando(solicitud.id);
    
    try {
      const resultado = await enrollFace(
        solicitud.personaId,
        solicitud.fotoTemporal,
        solicitud.tipo
      );

      if (resultado.success) {
        // Limpiar foto temporal después del enrolamiento exitoso
        registroFacialService.limpiarFotoTemporal(solicitud.id.toString());
        
        // Remover de la lista
        setSolicitudes(prev => prev.filter(s => s.id !== solicitud.id));
        
        alert('✅ Enrolamiento facial completado exitosamente');
      } else {
        alert(`❌ Error en enrolamiento: ${resultado.error}`);
      }
    } catch (error) {
      console.error('Error enrolando:', error);
      alert('❌ Error procesando enrolamiento');
    } finally {
      setProcesando(null);
    }
  };

  const handleEliminarFoto = (solicitudId: number) => {
    registroFacialService.limpiarFotoTemporal(solicitudId.toString());
    setSolicitudes(prev => prev.filter(s => s.id !== solicitudId));
  };

  const handleVerFoto = (fotoTemporal: File) => {
    const url = URL.createObjectURL(fotoTemporal);
    window.open(url, '_blank');
    // Limpiar URL después de un tiempo
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  };

  // Mock function - reemplazar con llamada real al backend
  const obtenerSolicitudesAprobadas = async () => {
    // Esta función debería llamar al endpoint real del backend
    // Por ahora devuelve datos mock
    return [
      {
        id: 1,
        nombre: 'Juan',
        apellido: 'Pérez',
        email: 'juan@test.com',
        numero_casa: 'A-101',
        tipo: 'copropietario' as const,
        personaId: 1
      }
    ];
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center">
            <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
            <p>Cargando solicitudes con fotos...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Camera className="h-5 w-5" />
            Enrolamiento Facial Pendiente
          </CardTitle>
          <CardDescription>
            Solicitudes aprobadas con fotos pendientes de enrolamiento facial
          </CardDescription>
        </CardHeader>
        <CardContent>
          {enrollError && (
            <Alert className="mb-4 border-red-200 bg-red-50">
              <AlertTriangle className="h-4 w-4 text-red-600" />
              <AlertDescription className="text-red-800">
                {enrollError}
              </AlertDescription>
            </Alert>
          )}

          {solicitudes.length === 0 ? (
            <div className="text-center py-8">
              <Camera className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No hay enrolamientos pendientes</h3>
              <p className="text-gray-600">
                Todas las solicitudes con fotos han sido procesadas
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {solicitudes.map((solicitud) => (
                <div key={solicitud.id} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h4 className="font-semibold">
                          {solicitud.nombre} {solicitud.apellido}
                        </h4>
                        <Badge variant={solicitud.tipo === 'copropietario' ? 'default' : 'secondary'}>
                          {solicitud.tipo}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600">
                        Email: {solicitud.email} • Casa: {solicitud.numero_casa}
                      </p>
                      {solicitud.fotoTemporal && (
                        <p className="text-xs text-green-600 mt-1">
                          ✅ Foto disponible ({Math.round(solicitud.fotoTemporal.size / 1024)} KB)
                        </p>
                      )}
                    </div>

                    <div className="flex items-center gap-2">
                      {solicitud.fotoTemporal && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleVerFoto(solicitud.fotoTemporal!)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                      )}

                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEliminarFoto(solicitud.id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>

                      <Button
                        onClick={() => handleEnrolar(solicitud)}
                        disabled={enrollLoading || procesando === solicitud.id || !solicitud.personaId}
                        className="bg-blue-600 hover:bg-blue-700"
                      >
                        {procesando === solicitud.id ? (
                          <>
                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                            Enrolando...
                          </>
                        ) : (
                          <>
                            <CheckCircle className="h-4 w-4 mr-2" />
                            Enrolar
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <Alert className="bg-blue-50 border-blue-200">
        <Camera className="h-4 w-4 text-blue-600" />
        <AlertDescription className="text-blue-800">
          <strong>Proceso de Enrolamiento:</strong> Una vez que apruebes una solicitud, 
          si el usuario subió una foto, aparecerá aquí para que puedas enrolar su rostro 
          en el sistema de reconocimiento facial.
        </AlertDescription>
      </Alert>
    </div>
  );
}