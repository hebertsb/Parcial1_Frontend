"use client"

import React, { useRef, useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Camera, Upload, Users, AlertCircle, CheckCircle, X } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface PersonaReconocida {
  nombre: string;
  vivienda?: string;
  id?: number;
}

interface ReconocimientoResponse {
  reconocido: boolean;
  persona?: PersonaReconocida;
  confianza?: number;
  mensaje?: string;
}

export default function ReconocimientoFacial() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [camaraActiva, setCamaraActiva] = useState(false);
  const [procesando, setProcesando] = useState(false);
  const [resultado, setResultado] = useState<ReconocimientoResponse | null>(null);
  const [modo, setModo] = useState<'camara' | 'upload'>('camara');
  const [error, setError] = useState<string | null>(null);

  // Obtener la URL base de la API
  const getApiUrl = () => {
    if (typeof window !== 'undefined') {
      return process.env.NEXT_PUBLIC_API_URL || 'http://192.168.56.1:8000/api';
    }
    return 'http://192.168.56.1:8000/api';
  };

  const iniciarCamara = useCallback(async () => {
    try {
      setError(null);
      
      // Solicitar acceso a la cámara
      const newStream = await navigator.mediaDevices.getUserMedia({ 
        video: { 
          width: 640, 
          height: 480,
          facingMode: 'user' // Cámara frontal
        } 
      });
      
      setStream(newStream);
      
      if (videoRef.current) {
        videoRef.current.srcObject = newStream;
      }
      
      setCamaraActiva(true);
      
    } catch (error: any) {
      console.error('Error al acceder a la cámara:', error);
      setError('Error al acceder a la cámara. Verifica los permisos.');
    }
  }, []);

  const detenerCamara = useCallback(() => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
    setCamaraActiva(false);
  }, [stream]);

  const capturarYReconocer = async () => {
    if (!stream || !videoRef.current || !canvasRef.current) {
      setError('La cámara no está activa');
      return;
    }

    try {
      setProcesando(true);
      setError(null);
      setResultado(null);

      const video = videoRef.current;
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');

      if (!ctx) {
        throw new Error('No se pudo obtener el contexto del canvas');
      }

      // Capturar frame actual del video
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      ctx.drawImage(video, 0, 0);

      // Convertir canvas a blob
      const blob = await new Promise<Blob>((resolve) => {
        canvas.toBlob((blob) => {
          if (blob) resolve(blob);
        }, 'image/jpeg', 0.8);
      });

      await procesarImagen(blob);

    } catch (error: any) {
      console.error('Error en captura:', error);
      setError(`Error en captura: ${error.message}`);
    } finally {
      setProcesando(false);
    }
  };

  const subirArchivo = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validar que sea una imagen
    if (!file.type.startsWith('image/')) {
      setError('Por favor selecciona un archivo de imagen válido');
      return;
    }

    try {
      setProcesando(true);
      setError(null);
      setResultado(null);

      await procesarImagen(file);

    } catch (error: any) {
      console.error('Error al procesar archivo:', error);
      setError(`Error al procesar archivo: ${error.message}`);
    } finally {
      setProcesando(false);
    }
  };

  const procesarImagen = async (imagen: Blob | File) => {
    try {
      // Preparar FormData
      const formData = new FormData();
      formData.append('imagen', imagen, 'imagen.jpg');

      // Enviar al backend
      const response = await fetch(`${getApiUrl()}/seguridad/reconocer-tiempo-real/`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Error del servidor: ${response.status} - ${errorText}`);
      }

      const data: ReconocimientoResponse = await response.json();
      setResultado(data);

    } catch (error: any) {
      console.error('Error en reconocimiento:', error);
      setError(`Error en reconocimiento: ${error.message}`);
    }
  };

  const resetear = () => {
    setResultado(null);
    setError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Limpiar recursos al desmontar
  React.useEffect(() => {
    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [stream]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-6 w-6" />
            🎥 Reconocimiento Facial en Tiempo Real
          </CardTitle>
          <CardDescription>
            Verifica el acceso mediante reconocimiento facial usando la cámara o subiendo una foto
          </CardDescription>
        </CardHeader>
      </Card>

      {/* Selector de Modo */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Seleccionar Método</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <Button
              variant={modo === 'camara' ? 'default' : 'outline'}
              onClick={() => {
                setModo('camara');
                resetear();
              }}
              className="flex items-center gap-2"
            >
              <Camera className="h-4 w-4" />
              Opción A: Cámara en Vivo
            </Button>
            <Button
              variant={modo === 'upload' ? 'default' : 'outline'}
              onClick={() => {
                setModo('upload');
                resetear();
                detenerCamara();
              }}
              className="flex items-center gap-2"
            >
              <Upload className="h-4 w-4" />
              Opción B: Subir Foto
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Modo Cámara */}
      {modo === 'camara' && (
        <Card>
          <CardHeader>
            <CardTitle>📹 Reconocimiento con Cámara</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Controles de Cámara */}
            <div className="flex gap-4">
              <Button
                onClick={iniciarCamara}
                disabled={camaraActiva || procesando}
                className="flex items-center gap-2"
              >
                <Camera className="h-4 w-4" />
                {camaraActiva ? 'Cámara Activa' : 'Iniciar Cámara'}
              </Button>
              
              <Button
                onClick={detenerCamara}
                disabled={!camaraActiva}
                variant="outline"
                className="flex items-center gap-2"
              >
                <X className="h-4 w-4" />
                Detener Cámara
              </Button>

              <Button
                onClick={capturarYReconocer}
                disabled={!camaraActiva || procesando}
                className="flex items-center gap-2"
              >
                <Users className="h-4 w-4" />
                {procesando ? 'Procesando...' : 'Reconocer Rostro'}
              </Button>
            </div>

            {/* Video */}
            <div className="relative">
              <video
                ref={videoRef}
                autoPlay
                muted
                className="w-full max-w-2xl h-96 bg-black border-2 border-gray-300 rounded-lg"
                style={{ objectFit: 'cover' }}
              />
              <canvas
                ref={canvasRef}
                className="hidden"
              />
            </div>
          </CardContent>
        </Card>
      )}

      {/* Modo Upload */}
      {modo === 'upload' && (
        <Card>
          <CardHeader>
            <CardTitle>📤 Reconocimiento con Foto</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-4">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={subirArchivo}
                disabled={procesando}
                className="flex-1"
              />
              <Button
                onClick={() => fileInputRef.current?.click()}
                disabled={procesando}
                className="flex items-center gap-2"
              >
                <Upload className="h-4 w-4" />
                Seleccionar Imagen
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Loading */}
      {procesando && (
        <Card>
          <CardContent className="flex items-center justify-center py-8">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-lg font-medium">🔍 Procesando reconocimiento facial...</p>
              <p className="text-sm text-gray-600">Esto puede tomar unos segundos</p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Error */}
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Resultado */}
      {resultado && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              {resultado.reconocido ? (
                <>
                  <CheckCircle className="h-6 w-6 text-green-600" />
                  <span className="text-green-600">✅ ACCESO AUTORIZADO</span>
                </>
              ) : (
                <>
                  <AlertCircle className="h-6 w-6 text-red-600" />
                  <span className="text-red-600">❌ ACCESO DENEGADO</span>
                </>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {resultado.reconocido && resultado.persona ? (
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="text-lg px-3 py-1">
                    👤 {resultado.persona.nombre}
                  </Badge>
                </div>
                
                {resultado.confianza && (
                  <div className="flex items-center gap-2">
                    <span className="font-medium">📊 Confianza:</span>
                    <Badge variant="secondary">
                      {Math.round(resultado.confianza * 100)}%
                    </Badge>
                  </div>
                )}
                
                {resultado.persona.vivienda && (
                  <div className="flex items-center gap-2">
                    <span className="font-medium">🏠 Vivienda:</span>
                    <Badge variant="outline">
                      {resultado.persona.vivienda}
                    </Badge>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-4">
                <p className="text-lg font-medium text-red-600">
                  Persona no reconocida en el sistema
                </p>
                <p className="text-sm text-gray-600 mt-2">
                  {resultado.mensaje || 'Acceso denegado por seguridad'}
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}