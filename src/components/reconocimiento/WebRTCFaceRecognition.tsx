"use client"

import React, { useRef, useState, useCallback, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Camera, 
  Upload, 
  Users, 
  AlertCircle, 
  CheckCircle, 
  X, 
  Zap,
  Activity,
  Clock,
  Signal,
  Settings,
  Pause,
  Play,
  RotateCcw,
  Focus
} from 'lucide-react';

interface PersonaReconocida {
  nombre: string;
  vivienda?: string;
  id?: number;
}

interface ResultadoReconocimiento {
  reconocido: boolean;
  persona?: PersonaReconocida;
  confianza?: number;
  mensaje?: string;
  frame_id?: string;
  timestamp?: string;
  procesamiento_ms?: number;
  manual?: boolean;
}

interface ConfiguracionWebRTC {
  fps: number;
  calidad: number;
  umbralConfianza: number;
  streaming: boolean;
}

export default function WebRTCFaceRecognition() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Estados principales
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [conectado, setConectado] = useState(false);
  const [streaming, setStreaming] = useState(false);
  const [pausado, setPausado] = useState(false);
  const [procesando, setProcesando] = useState(false);
  const [procesandoCaptura, setProcesandoCaptura] = useState(false);
  
  // Estados de reconocimiento
  const [ultimoResultado, setUltimoResultado] = useState<ResultadoReconocimiento | null>(null);
  const [historialResultados, setHistorialResultados] = useState<ResultadoReconocimiento[]>([]);
  const [error, setError] = useState<string | null>(null);
  
  // Configuración
  const [configuracion, setConfiguracion] = useState<ConfiguracionWebRTC>({
    fps: 5, // Frames por segundo
    calidad: 0.8, // Calidad JPEG (0.1 - 1.0)
    umbralConfianza: 70,
    streaming: true
  });
  
  // Estadísticas
  const [estadisticas, setEstadisticas] = useState({
    framesEnviados: 0,
    reconocimientosExitosos: 0,
    tiempoPromedioMs: 0,
    ultimoPing: 0
  });

  // Obtener URLs de configuración
  // ✅ INTEGRADO: WebRTC usa el mismo puerto que Django (8000)
  const getWebRTCUrl = () => {
    return process.env.NEXT_PUBLIC_WEBRTC_URL || 'http://127.0.0.1:8000';
  };

  // API REST usa el mismo puerto (8000)
  const getApiUrl = () => {
    return process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000';
  };

  // 🔧 Funciones REST API para backend
  const verificarEstadoBackend = async () => {
    try {
      const response = await fetch(`${getApiUrl()}/webrtc/status/`);
      const data = await response.json();
      console.log('✅ Estado del backend:', data);
      return data;
    } catch (error) {
      console.error('❌ Error verificando estado del backend:', error);
      return null;
    }
  };

  const testearConexionBackend = async () => {
    try {
      const response = await fetch(`${getApiUrl()}/webrtc/test/`);
      const data = await response.json();
      console.log('🧪 Test de conexión:', data);
      return data;
    } catch (error) {
      console.error('❌ Error en test de conexión:', error);
      return null;
    }
  };

  const enviarFotoReconocimiento = async (imagenBase64: string) => {
    try {
      const response = await fetch(`${getApiUrl()}/webrtc/face/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          image: imagenBase64,
          timestamp: new Date().toISOString()
        })
      });
      const data = await response.json();
      console.log('🔍 Respuesta reconocimiento facial:', data);
      return data;
    } catch (error) {
      console.error('❌ Error en reconocimiento facial REST:', error);
      return null;
    }
  };

  // 🔌 Conectar WebRTC (solo REST API)
  const conectarWebRTC = useCallback(async () => {
    try {
      setError(null);
      console.log('🔌 Conectando a WebRTC via REST API:', getApiUrl());
      
      // Verificar estado del backend
      const estadoBackend = await verificarEstadoBackend();
      if (!estadoBackend) {
        throw new Error('Backend no disponible');
      }
      
      // Test de conexión REST
      const testConexion = await testearConexionBackend();
      if (!testConexion) {
        throw new Error('REST API no disponible');
      }
      
      console.log('✅ Conectado exitosamente via REST API');
      setConectado(true);
      
    } catch (error: any) {
      console.error('💥 Error conectando WebRTC:', error);
      setError(`Error de conexión: ${error.message}`);
    }
  }, []);

  // 📹 Iniciar cámara
  const iniciarCamara = useCallback(async () => {
    try {
      setError(null);
      
      const nuevoStream = await navigator.mediaDevices.getUserMedia({ 
        video: { 
          width: { ideal: 640 }, 
          height: { ideal: 480 },
          facingMode: 'user',
          frameRate: { ideal: configuracion.fps }
        } 
      });
      
      setStream(nuevoStream);
      
      if (videoRef.current) {
        videoRef.current.srcObject = nuevoStream;
      }

    } catch (error: any) {
      console.error('❌ Error cámara:', error);
      setError('Error al acceder a la cámara. Verifica los permisos.');
    }
  }, [configuracion.fps]);

  // 🎥 Iniciar streaming WebRTC (solo captura manual)
  const iniciarStreaming = useCallback(() => {
    if (!conectado || !stream) {
      setError('WebRTC no conectado o cámara no disponible');
      return;
    }

    setStreaming(true);
    setPausado(false);
    console.log('🎥 WebRTC listo para capturas manuales...');

  }, [conectado, stream]);

  // ⏸️ Pausar/Reanudar streaming
  const togglePausa = useCallback(() => {
    setPausado(prev => {
      const nuevoPausado = !prev;
      console.log(nuevoPausado ? '⏸️ Streaming pausado' : '▶️ Streaming reanudado');
      return nuevoPausado;
    });
  }, []);

  // 📸 Captura manual (solo REST API)
  const capturaManual = useCallback(async () => {
    if (!conectado || !videoRef.current || !canvasRef.current) {
      setError('Sistema no disponible para captura');
      return;
    }

    setProcesandoCaptura(true);
    console.log('📸 Iniciando captura manual via REST API...');

    try {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');

      if (!ctx || video.videoWidth === 0) {
        throw new Error('Video no disponible');
      }

      // Capturar frame actual con alta calidad
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      ctx.drawImage(video, 0, 0);

      // Convertir a base64 con máxima calidad
      const imageData = canvas.toDataURL('image/jpeg', 0.95);

      // Enviar por REST API
      const resultadoREST = await enviarFotoReconocimiento(imageData);
      if (resultadoREST) {
        console.log('🔍 Resultado REST API:', resultadoREST);
        // Procesar respuesta del backend y mostrar resultado
        setUltimoResultado({
          reconocido: resultadoREST.recognized || false,
          persona: resultadoREST.person ? {
            nombre: resultadoREST.person.nombre || 'Desconocido',
            vivienda: resultadoREST.person.unidad || '',
            id: resultadoREST.person.id
          } : undefined,
          confianza: resultadoREST.confidence ? resultadoREST.confidence * 100 : 0,
          mensaje: resultadoREST.message || (resultadoREST.recognized ? 'Persona reconocida' : 'Persona no reconocida'),
          manual: true,
          timestamp: new Date().toISOString(),
          procesamiento_ms: resultadoREST.processing_time || 0
        });

        // Agregar al historial
        setHistorialResultados(prev => [{
          reconocido: resultadoREST.recognized || false,
          persona: resultadoREST.person ? {
            nombre: resultadoREST.person.nombre || 'Desconocido',
            vivienda: resultadoREST.person.unidad || ''
          } : undefined,
          confianza: resultadoREST.confidence ? resultadoREST.confidence * 100 : 0,
          manual: true,
          timestamp: new Date().toISOString(),
          procesamiento_ms: resultadoREST.processing_time || 0
        }, ...prev.slice(0, 9)]);

        // Actualizar estadísticas
        setEstadisticas(prev => ({
          ...prev,
          reconocimientosExitosos: resultadoREST.recognized ? prev.reconocimientosExitosos + 1 : prev.reconocimientosExitosos,
          framesEnviados: prev.framesEnviados + 1,
          tiempoPromedioMs: resultadoREST.processing_time || prev.tiempoPromedioMs
        }));
      }

      console.log('📸 Captura procesada exitosamente via REST API');

    } catch (error: any) {
      console.error('Error en captura manual:', error);
      setError(`Error en captura: ${error.message}`);
    } finally {
      setProcesandoCaptura(false);
    }
  }, [conectado, configuracion.umbralConfianza]);

  // 🔄 Reiniciar reconocimiento
  const reiniciarReconocimiento = useCallback(() => {
    console.log('🔄 Reiniciando sistema de reconocimiento...');
    
    // Limpiar resultados anteriores
    setUltimoResultado(null);
    setError(null);
    setProcesando(false);
    setProcesandoCaptura(false);
    
    // Reiniciar estadísticas
    setEstadisticas(prev => ({
      ...prev,
      framesEnviados: 0,
      reconocimientosExitosos: 0
    }));

    console.log('✅ Sistema reiniciado');
  }, []);

  // 🖼️ Procesamiento automático eliminado (solo captura manual)
  // En modo WebRTC solo REST API, no hay streaming automático

  // 🛑 Detener streaming
  const detenerStreaming = useCallback(() => {
    setStreaming(false);
    setPausado(false);
    setProcesando(false);
    setProcesandoCaptura(false);
    
    console.log('🛑 WebRTC detenido');
  }, []);

  // 🔌 Desconectar
  const desconectar = useCallback(() => {
    detenerStreaming();
    
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
    
    setConectado(false);
    console.log('🔌 Desconectado completamente');
  }, [stream, detenerStreaming]);

  // 📤 Subir archivo (solo REST API)
  const subirArchivo = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !conectado) return;

    try {
      setProcesando(true);
      setError(null);

      const reader = new FileReader();
      reader.onload = async (e) => {
        const imageData = e.target?.result as string;
        
        // Enviar por REST API
        const resultadoREST = await enviarFotoReconocimiento(imageData);
        if (resultadoREST) {
          setUltimoResultado({
            reconocido: resultadoREST.recognized || false,
            persona: resultadoREST.person ? {
              nombre: resultadoREST.person.nombre || 'Desconocido',
              vivienda: resultadoREST.person.unidad || '',
              id: resultadoREST.person.id
            } : undefined,
            confianza: resultadoREST.confidence ? resultadoREST.confidence * 100 : 0,
            mensaje: resultadoREST.message || (resultadoREST.recognized ? 'Persona reconocida' : 'Persona no reconocida'),
            timestamp: new Date().toISOString(),
            procesamiento_ms: resultadoREST.processing_time || 0
          });

          // Actualizar estadísticas
          setEstadisticas(prev => ({
            ...prev,
            reconocimientosExitosos: resultadoREST.recognized ? prev.reconocimientosExitosos + 1 : prev.reconocimientosExitosos,
            framesEnviados: prev.framesEnviados + 1,
            tiempoPromedioMs: resultadoREST.processing_time || prev.tiempoPromedioMs
          }));
        }
      };
      
      reader.readAsDataURL(file);

    } catch (error: any) {
      setError(`Error procesando archivo: ${error.message}`);
    } finally {
      setProcesando(false);
    }
  };

  // 🧹 Limpiar recursos
  useEffect(() => {
    return () => {
      desconectar();
    };
  }, [desconectar]);

  // 📊 Ping eliminado (no necesario sin Socket.IO)

  return (
    <div className="space-y-6">
      {/* Header con estado */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Activity className="h-6 w-6" />
              🚀 Reconocimiento WebRTC - Solo REST API
            </div>
            <div className="flex items-center gap-2">
              <div className={`w-3 h-3 rounded-full ${conectado ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`}></div>
              <span className={`text-sm ${conectado ? 'text-green-600' : 'text-red-600'}`}>
                {conectado ? 'API Conectada' : 'API Desconectada'}
              </span>
            </div>
          </CardTitle>
          <CardDescription>
            Captura manual con procesamiento via REST API - Solo análisis bajo demanda
          </CardDescription>
        </CardHeader>
      </Card>

      {/* Alerta informativa */}
      <Alert className="border-blue-200 bg-blue-50">
        <Zap className="h-4 w-4 text-blue-600" />
        <AlertDescription className="text-blue-800">
          <strong>🎯 Modo REST API:</strong> Análisis de reconocimiento facial bajo demanda. 
          <strong>🎛️ Controles:</strong> Captura Manual para análisis inmediato via REST API. 
          Sin streaming automático - Solo procesamiento manual
        </AlertDescription>
      </Alert>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Panel de Control */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              Control WebRTC - REST API
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Botones principales */}
            <div className="grid grid-cols-2 gap-2">
              <Button
                onClick={conectarWebRTC}
                disabled={conectado || procesando}
                className="flex items-center gap-2"
              >
                <Signal className="h-4 w-4" />
                {conectado ? 'API Conectada' : 'Conectar API'}
              </Button>
              
              <Button
                onClick={iniciarCamara}
                disabled={!conectado || !!stream}
                variant="outline"
                className="flex items-center gap-2"
              >
                <Camera className="h-4 w-4" />
                {stream ? 'Cámara Activa' : 'Iniciar Cámara'}
              </Button>

              <Button
                onClick={iniciarStreaming}
                disabled={!stream || streaming || !conectado}
                variant="default"
                className="flex items-center gap-2"
              >
                <Activity className="h-4 w-4" />
                Activar Sistema
              </Button>

              <Button
                onClick={detenerStreaming}
                disabled={!streaming}
                variant="destructive"
                className="flex items-center gap-2"
              >
                <X className="h-4 w-4" />
                Detener Stream
              </Button>
            </div>

            {/* Controles de Streaming */}
            {streaming && (
              <div className="space-y-2 pt-4 border-t">
                <h5 className="font-medium text-sm text-gray-700">🎛️ Controles de Reconocimiento</h5>
                <div className="grid grid-cols-2 gap-2">
                  <Button
                    onClick={togglePausa}
                    disabled={!streaming}
                    variant={pausado ? "default" : "secondary"}
                    className="flex items-center gap-2"
                  >
                    {pausado ? <Play className="h-4 w-4" /> : <Pause className="h-4 w-4" />}
                    {pausado ? 'Reanudar IA' : 'Pausar IA'}
                  </Button>

                  <Button
                    onClick={capturaManual}
                    disabled={!conectado || procesandoCaptura}
                    variant="outline"
                    className="flex items-center gap-2"
                  >
                    <Focus className="h-4 w-4" />
                    {procesandoCaptura ? 'Analizando...' : 'Captura Híbrida'}
                  </Button>

                  <Button
                    onClick={reiniciarReconocimiento}
                    disabled={procesando || procesandoCaptura}
                    variant="outline"
                    className="flex items-center gap-2 col-span-2"
                  >
                    <RotateCcw className="h-4 w-4" />
                    Reiniciar Reconocimiento
                  </Button>
                </div>

                {/* Estado del streaming */}
                <div className="flex items-center justify-between text-sm bg-gray-50 p-2 rounded">
                  <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${pausado ? 'bg-yellow-500' : 'bg-green-500 animate-pulse'}`}></div>
                    <span>{pausado ? '⏸️ IA Pausada' : '🤖 IA + REST Activos'}</span>
                  </div>
                  <div className="text-gray-600">
                    {configuracion.fps} FPS • {Math.round(configuracion.calidad * 100)}% calidad
                  </div>
                </div>
              </div>
            )}

            {/* Configuración rápida */}
            <div className="space-y-3 pt-4 border-t">
              <div>
                <label className="text-sm font-medium">FPS: {configuracion.fps}</label>
                <input
                  type="range"
                  min="1"
                  max="15"
                  value={configuracion.fps}
                  onChange={(e) => setConfiguracion(prev => ({
                    ...prev,
                    fps: parseInt(e.target.value)
                  }))}
                  className="w-full mt-1"
                />
              </div>

              <div>
                <label className="text-sm font-medium">Calidad: {Math.round(configuracion.calidad * 100)}%</label>
                <input
                  type="range"
                  min="0.3"
                  max="1"
                  step="0.1"
                  value={configuracion.calidad}
                  onChange={(e) => setConfiguracion(prev => ({
                    ...prev,
                    calidad: parseFloat(e.target.value)
                  }))}
                  className="w-full mt-1"
                />
              </div>
            </div>

            {/* Upload fallback */}
            <div className="pt-4 border-t">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={subirArchivo}
                disabled={!conectado || procesando}
                className="w-full text-sm"
              />
            </div>
          </CardContent>
        </Card>

        {/* Video y Estadísticas */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Camera className="h-5 w-5" />
              Vista en Vivo
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Video */}
            <div className="relative">
              <video
                ref={videoRef}
                autoPlay
                muted
                className="w-full h-64 bg-black rounded-lg object-cover"
              />
              <canvas ref={canvasRef} className="hidden" />
              
              {/* Overlays */}
              {streaming && (
                <div className="absolute top-2 left-2">
                  <Badge 
                    variant={pausado ? "secondary" : "destructive"} 
                    className={pausado ? "" : "animate-pulse"}
                  >
                    {pausado ? '⏸️ IA PAUSADA' : '🔴 WEBRTC ACTIVO'}
                  </Badge>
                </div>
              )}

              {procesandoCaptura && (
                <div className="absolute top-2 right-2">
                  <Badge variant="default" className="animate-bounce">
                    📸 ANÁLISIS HÍBRIDO
                  </Badge>
                </div>
              )}

              {(procesando && !pausado) && (
                <div className="absolute bottom-2 right-2">
                  <Badge variant="secondary">
                    ⚡ Procesando Frame...
                  </Badge>
                </div>
              )}

              {pausado && streaming && (
                <div className="absolute bottom-2 right-2">
                  <Badge variant="outline" className="bg-yellow-100 text-yellow-800">
                    ⏸️ Streaming Pausado
                  </Badge>
                </div>
              )}
            </div>

            {/* Estadísticas */}
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="font-medium">Frames enviados:</span>
                <br />
                <span className="text-blue-600">{estadisticas.framesEnviados}</span>
              </div>
              <div>
                <span className="font-medium">Reconocimientos:</span>
                <br />
                <span className="text-green-600">{estadisticas.reconocimientosExitosos}</span>
              </div>
              <div>
                <span className="font-medium">Latencia:</span>
                <br />
                <span className="text-orange-600">{estadisticas.ultimoPing}ms</span>
              </div>
              <div>
                <span className="font-medium">Tiempo proceso:</span>
                <br />
                <span className="text-purple-600">{estadisticas.tiempoPromedioMs}ms</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Error */}
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Último Resultado */}
      {ultimoResultado && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              {ultimoResultado.manual && (
                <Focus className="h-5 w-5 text-blue-600" />
              )}
              {ultimoResultado.reconocido ? (
                <>
                  <CheckCircle className="h-6 w-6 text-green-600" />
                  <span className="text-green-600">
                    ✅ PERSONA RECONOCIDA {ultimoResultado.manual ? '(ANÁLISIS HÍBRIDO)' : ''}
                  </span>
                </>
              ) : (
                <>
                  <AlertCircle className="h-6 w-6 text-red-600" />
                  <span className="text-red-600">
                    ❌ NO RECONOCIDO {ultimoResultado.manual ? '(ANÁLISIS HÍBRIDO)' : ''}
                  </span>
                </>
              )}
              <Badge variant="outline" className="ml-auto">
                <Clock className="h-3 w-3 mr-1" />
                {ultimoResultado.procesamiento_ms}ms
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {ultimoResultado.reconocido && ultimoResultado.persona ? (
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Badge variant="default" className="text-lg">
                    👤 {ultimoResultado.persona.nombre}
                  </Badge>
                  {ultimoResultado.confianza && (
                    <Badge variant="secondary">
                      📊 {Math.round(ultimoResultado.confianza)}%
                    </Badge>
                  )}
                </div>
                {ultimoResultado.persona.vivienda && (
                  <p className="text-sm text-gray-600">
                    🏠 Vivienda: {ultimoResultado.persona.vivienda}
                  </p>
                )}
              </div>
            ) : (
              <p className="text-red-600">
                {ultimoResultado.mensaje || 'Persona no registrada en el sistema'}
              </p>
            )}
          </CardContent>
        </Card>
      )}

      {/* Historial Rápido */}
      {historialResultados.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Historial de Reconocimientos
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 max-h-40 overflow-y-auto">
              {historialResultados.slice(0, 5).map((resultado, index) => (
                <div key={index} className={`flex items-center justify-between text-sm p-2 rounded ${
                  resultado.manual ? 'bg-blue-50 border border-blue-200' : 'bg-gray-50'
                }`}>
                  <div className="flex items-center gap-2">
                    {resultado.manual && (
                      <Focus className="h-3 w-3 text-blue-600" />
                    )}
                    {resultado.reconocido ? (
                      <CheckCircle className="h-4 w-4 text-green-600" />
                    ) : (
                      <X className="h-4 w-4 text-red-600" />
                    )}
                    <span>
                      {resultado.reconocido ? resultado.persona?.nombre : 'No reconocido'}
                      {resultado.manual && <span className="text-blue-600 text-xs ml-1">(Híbrido)</span>}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    {resultado.confianza && (
                      <Badge variant="outline" className="text-xs">
                        {Math.round(resultado.confianza)}%
                      </Badge>
                    )}
                    <span className="text-gray-500 text-xs">
                      {resultado.procesamiento_ms}ms
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}