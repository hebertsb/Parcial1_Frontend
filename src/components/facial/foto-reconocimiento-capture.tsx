'use client'

/**
 * Componente para capturar fotos de reconocimiento facial durante el registro
 * Permite tomar múltiples fotos o subir archivos
 */

import React, { useState, useRef, useCallback } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Camera, Upload, X, CheckCircle, AlertCircle } from 'lucide-react';

interface FotoReconocimientoProps {
  onFotosChange: (fotosBase64: string[]) => void;
  fotos: string[];
  maxFotos?: number;
  requeridas?: boolean;
  descripcion?: string;
}

export function FotoReconocimientoCapture({ 
  onFotosChange, 
  fotos, 
  maxFotos = 3, 
  requeridas = true,
  descripcion 
}: FotoReconocimientoProps) {
  const [camaraActiva, setCamaraActiva] = useState(false);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Iniciar cámara
  const iniciarCamara = useCallback(async () => {
    try {
      setError(null);
      const mediaStream = await navigator.mediaDevices.getUserMedia({ 
        video: { 
          width: 640, 
          height: 480,
          facingMode: 'user' // Cámara frontal preferida
        } 
      });
      
      setStream(mediaStream);
      setCamaraActiva(true);
      
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
    } catch (err) {
      console.error('Error accediendo a la cámara:', err);
      setError('No se pudo acceder a la cámara. Asegúrate de permitir el acceso.');
    }
  }, []);

  // Detener cámara
  const detenerCamara = useCallback(() => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
    setCamaraActiva(false);
  }, [stream]);

  // Tomar foto
  const tomarFoto = useCallback(() => {
    if (!videoRef.current || !canvasRef.current) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');

    if (!context) return;

    // Configurar canvas con las dimensiones del video
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    // Dibujar el frame actual del video en el canvas
    context.drawImage(video, 0, 0);

    // Convertir a base64
    const fotoBase64 = canvas.toDataURL('image/jpeg', 0.8);
    
    // Agregar a la lista de fotos
    const nuevasFotos = [...fotos, fotoBase64];
    onFotosChange(nuevasFotos);
    
    // Si alcanzamos el máximo, detener la cámara
    if (nuevasFotos.length >= maxFotos) {
      detenerCamara();
    }
  }, [fotos, onFotosChange, maxFotos, detenerCamara]);

  // Manejar subida de archivos
  const manejarSubidaArchivo = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    const fotosDisponibles = maxFotos - fotos.length;
    const archivosAProcesar = files.slice(0, fotosDisponibles);

    archivosAProcesar.forEach(file => {
      if (!file.type.startsWith('image/')) {
        setError('Solo se permiten archivos de imagen');
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        const fotoBase64 = e.target?.result as string;
        const nuevasFotos = [...fotos, fotoBase64];
        onFotosChange(nuevasFotos);
      };
      reader.readAsDataURL(file);
    });

    // Limpiar input
    if (event.target) {
      event.target.value = '';
    }
  }, [fotos, onFotosChange, maxFotos]);

  // Eliminar foto
  const eliminarFoto = useCallback((index: number) => {
    const nuevasFotos = fotos.filter((_, i) => i !== index);
    onFotosChange(nuevasFotos);
  }, [fotos, onFotosChange]);

  // Cleanup al desmontar
  React.useEffect(() => {
    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [stream]);

  const fotosRestantes = maxFotos - fotos.length;
  const puedeTomarMas = fotosRestantes > 0;

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Camera className="h-5 w-5" />
          Reconocimiento Facial
          {requeridas && <Badge variant="destructive" className="text-xs">Requerido</Badge>}
        </CardTitle>
        <CardDescription>
          {descripcion || `Necesitamos ${maxFotos} foto${maxFotos > 1 ? 's' : ''} tuya para configurar el reconocimiento facial. Asegúrate de que tu rostro esté bien iluminado y centrado.`}
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Estado de fotos */}
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">
            Fotos capturadas: {fotos.length} de {maxFotos}
          </span>
          {fotos.length >= maxFotos && (
            <Badge variant="default" className="bg-green-100 text-green-800">
              <CheckCircle className="w-3 h-3 mr-1" />
              Completo
            </Badge>
          )}
        </div>

        {/* Error */}
        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Controles de cámara */}
        {puedeTomarMas && (
          <div className="flex gap-2">
            {!camaraActiva ? (
              <>
                <Button onClick={iniciarCamara} variant="outline">
                  <Camera className="w-4 h-4 mr-2" />
                  Usar Cámara
                </Button>
                <Button onClick={() => fileInputRef.current?.click()} variant="outline">
                  <Upload className="w-4 h-4 mr-2" />
                  Subir Archivo
                </Button>
              </>
            ) : (
              <>
                <Button onClick={tomarFoto} className="bg-green-600 hover:bg-green-700">
                  <Camera className="w-4 h-4 mr-2" />
                  Tomar Foto
                </Button>
                <Button onClick={detenerCamara} variant="outline">
                  Cancelar
                </Button>
              </>
            )}
          </div>
        )}

        {/* Video para cámara */}
        {camaraActiva && (
          <div className="relative">
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className="w-full max-w-md mx-auto rounded-lg border"
            />
            <div className="absolute inset-0 border-2 border-dashed border-primary/50 rounded-lg pointer-events-none" />
          </div>
        )}

        {/* Canvas oculto para captura */}
        <canvas ref={canvasRef} className="hidden" />

        {/* Input de archivo oculto */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple={fotosRestantes > 1}
          onChange={manejarSubidaArchivo}
          className="hidden"
        />

        {/* Preview de fotos */}
        {fotos.length > 0 && (
          <div className="space-y-2">
            <h4 className="text-sm font-medium">Fotos capturadas:</h4>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {fotos.map((foto, index) => {
                const esFotoPerfil = index === 0;
                const numeroReconocimiento = index;
                
                return (
                  <div key={index} className="relative group">
                    <img
                      src={foto}
                      alt={esFotoPerfil ? 'Foto de perfil' : `Reconocimiento facial ${numeroReconocimiento}`}
                      className={`w-full h-32 object-cover rounded-lg border-2 ${
                        esFotoPerfil ? 'border-blue-400' : 'border-green-400'
                      }`}
                    />
                    <Button
                      size="sm"
                      variant="destructive"
                      className="absolute top-1 right-1 h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={() => eliminarFoto(index)}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                    <Badge 
                      className={`absolute bottom-1 left-1 text-xs ${
                        esFotoPerfil 
                          ? 'bg-blue-500 hover:bg-blue-600' 
                          : 'bg-green-500 hover:bg-green-600'
                      }`}
                    >
                      {esFotoPerfil ? '👤 Perfil' : `🔒 RF-${numeroReconocimiento}`}
                    </Badge>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Información adicional */}
        <div className="space-y-3">
          {maxFotos >= 5 && (
            <div className="bg-gradient-to-r from-blue-50 to-green-50 p-3 rounded-lg border">
              <h4 className="text-sm font-medium text-gray-900 mb-2">📸 Tipos de fotos requeridas:</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs">
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="bg-blue-100 text-blue-700 border-blue-200">👤 Foto 1</Badge>
                  <span className="text-blue-800">Foto de perfil principal</span>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="bg-green-100 text-green-700 border-green-200">🔒 Fotos 2-5</Badge>
                  <span className="text-green-800">Control de acceso facial</span>
                </div>
              </div>
            </div>
          )}
          
          <div className="bg-amber-50 p-3 rounded-lg border border-amber-200">
            <h4 className="text-sm font-medium text-amber-900 mb-1">💡 Consejos para mejores fotos:</h4>
            <ul className="text-xs text-amber-800 space-y-1">
              <li>• Mantén tu rostro centrado y bien iluminado</li>
              <li>• Evita sombras y reflejos</li>
              <li>• Mira directamente a la cámara</li>
              <li>• No uses gafas de sol ni gorros</li>
              {maxFotos > 1 && <li>• Toma fotos desde diferentes ángulos ligeramente (5°-10°)</li>}
              {maxFotos >= 5 && <li>• La 1ª foto será tu perfil, las otras 4 para acceso al condominio</li>}
            </ul>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default FotoReconocimientoCapture;