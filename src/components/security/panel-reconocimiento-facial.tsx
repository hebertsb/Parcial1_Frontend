'use client';

import React, { useState, useRef } from 'react';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Camera, 
  Eye, 
  RefreshCw, 
  AlertCircle, 
  CheckCircle, 
  XCircle, 
  Clock,
  User,
  Home,
  FileText,
  Zap,
  Pause,
  Play,
  Smartphone,
  Wifi
} from 'lucide-react';
import { sincronizacionReconocimientoService, VerificacionFacialResponse } from '@/features/seguridad/sincronizacion-service';
import { validarArchivo, testConexionBackend, analizarRespuesta } from '@/utils/reconocimiento-facial-debug';
import { useActivity } from '@/contexts/ActivityContext';

interface ConfiguracionVerificacion {
  umbralConfianza: string;
  buscarEn: 'propietarios' | 'inquilinos' | 'todos';
  usarIAReal: boolean;
}

export default function PanelReconocimientoFacial() {
  // Context para actividad reciente
  const { addActivity } = useActivity();
  
  // Estados principales
  const [foto, setFoto] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>('');
  const [cargando, setCargando] = useState(false);
  const [resultado, setResultado] = useState<VerificacionFacialResponse | null>(null);
  const [error, setError] = useState<string>('');
  
  // Estados para cámara
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [camaraActiva, setCamaraActiva] = useState(false);
  const [camaraPausada, setCamaraPausada] = useState(false);
  const [modo, setModo] = useState<'archivo' | 'camara' | 'ip-webcam'>('archivo');
  const [ipWebcamUrl, setIpWebcamUrl] = useState('http://192.168.1.12:8080');
  const [conexionIPWebcam, setConexionIPWebcam] = useState(false);
  
  // Configuración
  const [configuracion, setConfiguracion] = useState<ConfiguracionVerificacion>({
    umbralConfianza: '70.0',
    buscarEn: 'propietarios',
    usarIAReal: true
  });

  // Referencias
  const fotoInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  /**
   * Registrar actividad en el dashboard
   */
  const registrarActividad = (responseData: VerificacionFacialResponse, esManual: boolean = false) => {
    if (!responseData.success || !responseData.verificacion) return;

    const verificacion = responseData.verificacion;
    const isAutorizado = verificacion.resultado === 'ACEPTADO';
    
    let usuario = 'Usuario no identificado';
    let unidad = '';
    let documento = '';
    let tipo_residente = '';
    
    if (isAutorizado && verificacion.persona_identificada) {
      usuario = verificacion.persona_identificada.nombre_completo;
      unidad = verificacion.persona_identificada.unidad || '';
      documento = verificacion.persona_identificada.documento || '';
      tipo_residente = verificacion.persona_identificada.tipo_residente || '';
    }

    const actividad = {
      tipo: (isAutorizado ? 'acceso_autorizado' : 'acceso_denegado') as 'acceso_autorizado' | 'acceso_denegado',
      usuario: isAutorizado ? `${usuario} - ${unidad}` : 'Acceso no autorizado',
      descripcion: isAutorizado 
        ? `Acceso autorizado por reconocimiento facial${esManual ? ' (verificación manual)' : ' (tiempo real)'} - Confianza: ${verificacion.confianza.toFixed(1)}%`
        : `Acceso denegado - Confianza insuficiente: ${verificacion.confianza.toFixed(1)}% (Requerido: ${verificacion.umbral_usado}%)`,
      estado: (isAutorizado ? 'exitoso' : 'fallido') as 'exitoso' | 'fallido',
      detalles: {
        confianza: verificacion.confianza,
        metodo: 'facial' as const,
        unidad,
        documento,
        tipo_residente
      }
    };

    addActivity(actividad);
  };

  /**
   * Manejar selección de archivo con validaciones mejoradas
   */
  const handleFotoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const archivo = event.target.files?.[0];
    console.log('📁 Archivo seleccionado:', archivo?.name, archivo?.size);
    if (!archivo) return;

    // Usar utilidad de validación según recomendaciones del backend
    const validacion = validarArchivo(archivo);
    
    if (!validacion.valid) {
      setError(validacion.message);
      console.error('❌ Archivo inválido:', validacion.details);
      return;
    }

    console.log('✅ Archivo válido:', validacion.details);
    setFoto(archivo);
    console.log('🎯 Estado foto actualizado:', !!archivo);
    setError('');
    setResultado(null);

    // Crear preview
    const reader = new FileReader();
    reader.onload = (e) => {
      setPreviewUrl(e.target?.result as string);
    };
    reader.readAsDataURL(archivo);
  };

  /**
   * Iniciar cámara
   */
  const iniciarCamara = async () => {
    try {
      setError('');
      
      const newStream = await navigator.mediaDevices.getUserMedia({ 
        video: { 
          width: 640, 
          height: 480,
          facingMode: 'user' 
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
  };

  /**
   * Pausar/Reanudar cámara
   */
  const togglePausarCamara = () => {
    setCamaraPausada(prev => !prev);
  };

  /**
   * Conectar con IP Webcam
   */
  const conectarIPWebcam = async () => {
    try {
      setError('');
      console.log('🔌 Conectando con IP Webcam:', ipWebcamUrl);
      
      // Verificar que la IP Webcam esté disponible
      const testUrl = `${ipWebcamUrl}/shot.jpg`;
      const testResponse = await fetch(testUrl);
      
      if (!testResponse.ok) {
        throw new Error(`No se puede conectar con IP Webcam en ${ipWebcamUrl}. Verifica que la app esté corriendo y la IP sea correcta.`);
      }
      
      setConexionIPWebcam(true);
      setCamaraActiva(true);
      console.log('✅ Conectado exitosamente con IP Webcam');
      
    } catch (error: any) {
      console.error('❌ Error conectando IP Webcam:', error);
      setError(`Error de conexión: ${error.message}`);
      setConexionIPWebcam(false);
    }
  };

  /**
   * Desconectar IP Webcam
   */
  const desconectarIPWebcam = () => {
    setConexionIPWebcam(false);
    setCamaraActiva(false);
    setCamaraPausada(false);
    console.log('🔌 Desconectado de IP Webcam');
  };

  /**
   * Detener cámara
   */
  const detenerCamara = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
    if (conexionIPWebcam) {
      desconectarIPWebcam();
    }
    setCamaraActiva(false);
    setCamaraPausada(false);
  };

  /**
   * Capturar foto desde cámara local
   */
  const capturarFotoLocal = () => {
    if (!stream || !videoRef.current || !canvasRef.current) {
      setError('La cámara no está activa');
      return;
    }

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    if (!ctx) {
      setError('No se pudo obtener el contexto del canvas');
      return;
    }

    // Capturar frame actual del video
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    ctx.drawImage(video, 0, 0);

    // Convertir canvas a blob y luego a File
    canvas.toBlob((blob) => {
      if (blob) {
        const archivo = new File([blob], 'captura.jpg', { type: 'image/jpeg' });
        setFoto(archivo);
        setPreviewUrl(canvas.toDataURL('image/jpeg'));
        setError('');
        setResultado(null);
        
        // Detener cámara después de capturar
        detenerCamara();
      }
    }, 'image/jpeg', 0.8);
  };

  /**
   * Capturar foto desde IP Webcam
   */
  const capturarFotoIPWebcam = async () => {
    if (!conexionIPWebcam) {
      setError('IP Webcam no está conectada');
      return;
    }

    try {
      console.log('📸 Capturando foto desde IP Webcam...');
      const shotUrl = `${ipWebcamUrl}/shot.jpg?timestamp=${Date.now()}`;
      
      const response = await fetch(shotUrl);
      if (!response.ok) {
        throw new Error('Error al capturar foto desde IP Webcam');
      }

      const blob = await response.blob();
      const archivo = new File([blob], 'ip-webcam-capture.jpg', { type: 'image/jpeg' });
      
      setFoto(archivo);
      setPreviewUrl(URL.createObjectURL(blob));
      setError('');
      setResultado(null);
      
      console.log('✅ Foto capturada desde IP Webcam exitosamente');
      
      // Detener conexión después de capturar
      detenerCamara();
      
    } catch (error: any) {
      console.error('❌ Error capturando foto IP Webcam:', error);
      setError(`Error al capturar: ${error.message}`);
    }
  };

  /**
   * Capturar foto unificada
   */
  const capturarFoto = () => {
    if (modo === 'ip-webcam') {
      capturarFotoIPWebcam();
    } else {
      capturarFotoLocal();
    }
  };

  /**
   * Verificación automática en tiempo real desde cámara local
   */
  const verificarTiempoRealLocal = async () => {
    if (!stream || !videoRef.current || !canvasRef.current || cargando || camaraPausada) {
      return;
    }

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    if (!ctx) return;

    try {
      // Capturar frame actual sin detener la cámara
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      ctx.drawImage(video, 0, 0);

      // Convertir a blob
      const blob = await new Promise<Blob>((resolve) => {
        canvas.toBlob((blob) => {
          if (blob) resolve(blob);
        }, 'image/jpeg', 0.8);
      });

      // Crear archivo temporal
      const archivo = new File([blob], 'tiempo-real.jpg', { type: 'image/jpeg' });

      setCargando(true);
      setError('');

      // Usar el servicio de reconocimiento
      const response = await sincronizacionReconocimientoService.verificarIdentidadFacial(
        archivo,
        {
          umbralConfianza: configuracion.umbralConfianza,
          buscarEn: configuracion.buscarEn,
          usarIAReal: configuracion.usarIAReal
        }
      );

      if (response.success && response.data) {
        setResultado(response.data);
        
        // Registrar actividad en el dashboard
        registrarActividad(response.data, false);
        
        console.log('🎯 Reconocimiento tiempo real:', {
          resultado: response.data.verificacion.resultado,
          confianza: response.data.verificacion.confianza,
          persona: response.data.verificacion.persona_identificada?.nombre_completo
        });
      } else {
        // En tiempo real, no mostrar errores menores
        console.log('⚡ Tiempo real: No se encontró coincidencia');
        setResultado(null);
      }

    } catch (error: any) {
      console.error('Error en tiempo real:', error);
      // En tiempo real, no interrumpir el flujo por errores
    } finally {
      setCargando(false);
    }
  };

  /**
   * Verificación automática en tiempo real desde IP Webcam
   */
  const verificarTiempoRealIPWebcam = async () => {
    if (!conexionIPWebcam || cargando || camaraPausada) {
      return;
    }

    try {
      // Obtener imagen desde IP Webcam
      const shotUrl = `${ipWebcamUrl}/shot.jpg?timestamp=${Date.now()}`;
      const response = await fetch(shotUrl);
      
      if (!response.ok) {
        console.error('❌ Error obteniendo imagen de IP Webcam');
        return;
      }

      const blob = await response.blob();
      const archivo = new File([blob], 'ip-webcam-tiempo-real.jpg', { type: 'image/jpeg' });

      setCargando(true);
      setError('');

      // Usar el servicio de reconocimiento
      const reconocimientoResponse = await sincronizacionReconocimientoService.verificarIdentidadFacial(
        archivo,
        {
          umbralConfianza: configuracion.umbralConfianza,
          buscarEn: configuracion.buscarEn,
          usarIAReal: configuracion.usarIAReal
        }
      );

      if (reconocimientoResponse.success && reconocimientoResponse.data) {
        setResultado(reconocimientoResponse.data);
        
        // Registrar actividad en el dashboard
        registrarActividad(reconocimientoResponse.data, false);
        
        console.log('🎯 Reconocimiento IP Webcam tiempo real:', {
          resultado: reconocimientoResponse.data.verificacion.resultado,
          confianza: reconocimientoResponse.data.verificacion.confianza,
          persona: reconocimientoResponse.data.verificacion.persona_identificada?.nombre_completo
        });
      } else {
        // En tiempo real, no mostrar errores menores
        console.log('⚡ IP Webcam tiempo real: No se encontró coincidencia');
        setResultado(null);
      }

    } catch (error: any) {
      console.error('Error en tiempo real IP Webcam:', error);
      // En tiempo real, no interrumpir el flujo por errores
    } finally {
      setCargando(false);
    }
  };

  /**
   * Verificación automática en tiempo real unificada
   */
  const verificarTiempoReal = async () => {
    if (modo === 'ip-webcam') {
      await verificarTiempoRealIPWebcam();
    } else {
      await verificarTiempoRealLocal();
    }
  };

  /**
   * Función principal de verificación
   * CONFIGURADA SEGÚN RECOMENDACIONES CRÍTICAS DEL BACKEND
   */
  const verificarIdentidad = async () => {
    if (!foto) {
      setError('Por favor selecciona una foto primero');
      return;
    }

    // Verificar si la IA está pausada y hay cámara activa
    if (camaraActiva && camaraPausada) {
      setError('⏸️ La IA está pausada. Reanuda el reconocimiento para continuar con la verificación.');
      return;
    }

    setCargando(true);
    setError('');
    setResultado(null);

    try {
      // Test de conexión inicial (usando endpoint sin autenticación)
      console.log('🔍 Verificando conexión con backend...');
      
      const testResponse = await fetch('http://127.0.0.1:8000/api/seguridad/health/');
      console.log('🌐 Test conexión:', testResponse.status);
      
      if (!testResponse.ok) {
        throw new Error('Backend no disponible - Verificar que Django esté corriendo en puerto 8000');
      }

      console.log('🤖 Iniciando verificación facial en servidor de producción...', {
        archivo: foto.name,
        tamaño: `${(foto.size / 1024 / 1024).toFixed(2)}MB`,
        tipo: foto.type,
        configuracion: {
          umbral: configuracion.umbralConfianza,
          buscar_en: configuracion.buscarEn,
          ia_real: configuracion.usarIAReal,
          timeout_esperado: configuracion.usarIAReal ? '1-3 segundos' : '<300ms'
        }
      });

      const response = await sincronizacionReconocimientoService.verificarIdentidadFacial(
        foto,
        {
          umbralConfianza: configuracion.umbralConfianza,
          buscarEn: configuracion.buscarEn,
          usarIAReal: configuracion.usarIAReal
        }
      );

      if (response.success && response.data) {
        setResultado(response.data);
        
        // Registrar actividad en el dashboard (verificación manual)
        registrarActividad(response.data, true);
        
        console.log('✅ Verificación completada exitosamente:', {
          resultado: response.data.verificacion.resultado,
          confianza: response.data.verificacion.confianza,
          persona: response.data.verificacion.persona_identificada?.nombre_completo,
          tiempo: response.data.estadisticas?.tiempo_procesamiento_ms
        });
      } else {
        const errorMsg = response.message || 'Error en la verificación facial';
        setError(errorMsg);
        console.error('❌ Error en verificación:', {
          mensaje: errorMsg,
          response: response
        });
      }

    } catch (error: any) {
      console.error('💥 Error crítico:', error);
      
      // Mensajes de error específicos normales
      let mensajeError = error.message;
      
      if (error.message.includes('proxy')) {
        mensajeError = '🚨 Error de proxy detectado en conexión con servidor localhost:8000';
      } else if (error.message.includes('CORS')) {
        mensajeError = '🔒 Error de CORS en conexión con API localhost:8000';
      } else if (error.message.includes('fetch') || error.message.includes('Network')) {
        mensajeError = '🔌 Error de conexión con servidor localhost:8000. Verificar que Django esté corriendo';
      } else if (error.message.includes('timeout')) {
        mensajeError = '⏱️ Timeout en servidor localhost:8000. El procesamiento puede tomar hasta 30 segundos';
      }
      
      setError(mensajeError);
    } finally {
      setCargando(false);
    }
  };

  /**
   * Limpiar formulario
   */
  const limpiarFormulario = () => {
    setFoto(null);
    setPreviewUrl('');
    setResultado(null);
    setError('');
    detenerCamara();
    setConexionIPWebcam(false);
    if (fotoInputRef.current) {
      fotoInputRef.current.value = '';
    }
  };

  /**
   * Formatear tiempo en milisegundos
   */
  const formatearTiempo = (ms: number): string => {
    if (ms < 1000) {
      return `${Math.round(ms)}ms`;
    }
    return `${(ms / 1000).toFixed(1)}s`;
  };

  // Verificación automática en tiempo real
  React.useEffect(() => {
    let intervalId: NodeJS.Timeout;

    // Para cámara local
    if (camaraActiva && stream && !camaraPausada && modo === 'camara') {
      intervalId = setInterval(() => {
        verificarTiempoReal();
      }, 2000);
    }
    
    // Para IP Webcam
    if (camaraActiva && conexionIPWebcam && !camaraPausada && modo === 'ip-webcam') {
      intervalId = setInterval(() => {
        verificarTiempoReal();
      }, 3000); // Intervalo un poco mayor para IP Webcam
    }

    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [camaraActiva, stream, conexionIPWebcam, camaraPausada, configuracion, modo]);

  // Limpiar recursos al desmontar el componente  
  React.useEffect(() => {
    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [stream]);  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header mejorado con diseño moderno */}
        <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white p-8 rounded-2xl shadow-2xl border border-blue-500/30">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
                <Camera className="h-8 w-8" />
              </div>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-white to-blue-100 bg-clip-text text-transparent">
                  Verificación Facial con IA
                </h1>
                <p className="text-blue-100 text-lg">Sistema de reconocimiento automático avanzado</p>
              </div>
            </div>
            
            {/* Indicador de estado mejorado */}
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
              <div className="flex items-center space-x-2">
                <div className={`w-3 h-3 rounded-full ${camaraActiva ? 'bg-green-400 animate-pulse' : 'bg-gray-400'}`}></div>
                <span className="text-sm font-medium">
                  {camaraActiva ? (camaraPausada ? 'IA Pausada' : 'Sistema Activo') : 'Sistema Inactivo'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Alerta informativa mejorada */}
        <div className="bg-gradient-to-r from-cyan-50 to-blue-50 border-2 border-cyan-200 rounded-xl p-6 shadow-lg">
          <div className="flex items-start space-x-4">
            <div className="w-10 h-10 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
              <Zap className="h-5 w-5 text-white" />
            </div>
            <div className="space-y-2">
              <h3 className="font-bold text-gray-900 text-lg">🚀 Reconocimiento en Tiempo Real</h3>
              <p className="text-gray-700 leading-relaxed">
                Al activar la cámara, el sistema automáticamente comparará cada 2 segundos con las fotos de la base de datos 
                para identificar personas registradas.
              </p>
              <div className="flex items-center space-x-4 text-sm">
                <div className="flex items-center space-x-1">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-gray-600">⏸️ Usar "Pausar IA" para control manual</span>
                </div>
                <div className="flex items-center space-x-1">
                  <div className={`w-2 h-2 rounded-full ${configuracion.usarIAReal ? 'bg-yellow-500' : 'bg-blue-500'}`}></div>
                  <span className="text-gray-600">
                    {configuracion.usarIAReal ? 'IA Real - Mayor precisión' : 'IA Simulada - Respuesta rápida'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          {/* Panel de Captura Mejorado */}
          <div className="xl:col-span-2">
            <Card className="bg-white/80 backdrop-blur-sm border-2 border-blue-200 shadow-xl rounded-2xl overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white p-6">
                <CardTitle className="flex items-center space-x-3 text-xl">
                  <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
                    <Camera className="h-5 w-5" />
                  </div>
                  <span>Captura de Imagen</span>
                </CardTitle>
              </CardHeader>
          <CardContent className="space-y-4">
            {/* Estado actual del sistema */}
            <div className="bg-gray-700/50 p-3 rounded-lg text-sm border border-gray-600">
              <p className="text-gray-200">
                <strong className="text-white">Estado:</strong> Foto: {foto ? '✅ Cargada' : '❌ No seleccionada'} | 
                Cámara: {camaraActiva ? (camaraPausada ? '⏸️ Pausada' : '🔴 Activa') : '⚫ Inactiva'} | 
                Modo: {modo === 'camara' ? '📹 Cámara Local' : modo === 'ip-webcam' ? '� IP Webcam' : '�📁 Archivo'}
              </p>
              {modo === 'ip-webcam' && (
                <p className="text-blue-300 text-xs mt-1">
                  🌐 IP: {ipWebcamUrl} | Estado: {conexionIPWebcam ? '🟢 Conectado' : '🔴 Desconectado'}
                </p>
              )}
            </div>

            {/* Selector de Modo */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-2 mb-4">
              <Button
                variant={modo === 'archivo' ? 'default' : 'outline'}
                onClick={() => {
                  setModo('archivo');
                  detenerCamara();
                  limpiarFormulario();
                }}
                className="flex items-center gap-2"
              >
                <FileText className="h-4 w-4" />
                📁 Subir Foto
              </Button>
              <Button
                variant={modo === 'camara' ? 'default' : 'outline'}
                onClick={() => {
                  setModo('camara');
                  limpiarFormulario();
                }}
                className="flex items-center gap-2"
              >
                <Camera className="h-4 w-4" />
                📹 Cámara Local  
              </Button>
              <Button
                variant={modo === 'ip-webcam' ? 'default' : 'outline'}
                onClick={() => {
                  setModo('ip-webcam');
                  limpiarFormulario();
                }}
                className="flex items-center gap-2"
              >
                <Smartphone className="h-4 w-4" />
                📱 IP Webcam
              </Button>
            </div>

            {/* Modo Archivo */}
            {modo === 'archivo' && (
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-400 transition-colors">
                <input
                  ref={fotoInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFotoChange}
                  className="hidden"
                />
                
                {!previewUrl ? (
                  <div className="space-y-3">
                    <Camera className="h-12 w-12 text-gray-400 mx-auto" />
                    <div>
                      <p className="text-lg font-medium text-gray-700">Seleccionar foto</p>
                      <p className="text-sm text-gray-500">JPEG o PNG, máximo 5MB</p>
                    </div>
                    <Button
                      onClick={() => fotoInputRef.current?.click()}
                      variant="outline"
                      className="mt-2"
                    >
                      <FileText className="h-4 w-4 mr-2" />
                      Seleccionar Archivo
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <img
                      src={previewUrl}
                      alt="Vista previa"
                      className="max-w-full max-h-64 mx-auto rounded-lg shadow-lg"
                    />
                    <div className="flex space-x-2 justify-center">
                      <Button
                        onClick={() => fotoInputRef.current?.click()}
                        variant="outline"
                        size="sm"
                      >
                        <RefreshCw className="h-4 w-4 mr-2" />
                        Cambiar
                      </Button>
                      <Button
                        onClick={limpiarFormulario}
                        variant="outline"
                        size="sm"
                      >
                        <XCircle className="h-4 w-4 mr-2" />
                        Limpiar
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Modo IP Webcam */}
            {modo === 'ip-webcam' && (
              <div className="space-y-4">
                {/* Configuración IP Webcam */}
                <div className="bg-blue-900/30 p-4 rounded-lg border border-blue-500/30">
                  <h4 className="text-white font-medium mb-3 flex items-center gap-2">
                    <Smartphone className="h-4 w-4" />
                    📱 Configuración IP Webcam
                  </h4>
                  
                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm font-medium text-blue-200 mb-1">
                        URL de IP Webcam
                      </label>
                      <input
                        type="text"
                        value={ipWebcamUrl}
                        onChange={(e) => setIpWebcamUrl(e.target.value)}
                        placeholder="http://192.168.1.12:8080"
                        className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    
                    <div className="text-xs text-blue-300">
                      <p>💡 <strong>Instrucciones:</strong></p>
                      <p>1. Instala "IP Webcam" en tu celular</p>
                      <p>2. Conecta el celular a la misma red WiFi</p>
                      <p>3. Abre la app y presiona "Iniciar servidor"</p>
                      <p>4. Usa la IP que muestra la app (ej: 192.168.1.12:8080)</p>
                    </div>
                  </div>
                </div>

                {/* Controles IP Webcam */}
                <div className="flex gap-2 justify-center flex-wrap">
                  <Button
                    onClick={conectarIPWebcam}
                    disabled={conexionIPWebcam || cargando}
                    variant="outline"
                  >
                    <Wifi className="h-4 w-4 mr-2" />
                    {conexionIPWebcam ? 'IP Webcam Conectada' : 'Conectar IP Webcam'}
                  </Button>
                  
                  <Button
                    onClick={togglePausarCamara}
                    disabled={!conexionIPWebcam}
                    variant={camaraPausada ? "default" : "secondary"}
                  >
                    {camaraPausada ? (
                      <>
                        <Play className="h-4 w-4 mr-2" />
                        Reanudar IA
                      </>
                    ) : (
                      <>
                        <Pause className="h-4 w-4 mr-2" />
                        Pausar IA
                      </>
                    )}
                  </Button>
                  
                  <Button
                    onClick={detenerCamara}
                    disabled={!conexionIPWebcam}
                    variant="outline"
                  >
                    <XCircle className="h-4 w-4 mr-2" />
                    Desconectar
                  </Button>

                  <Button
                    onClick={capturarFoto}
                    disabled={!conexionIPWebcam || cargando}
                    variant="default"
                  >
                    <Camera className="h-4 w-4 mr-2" />
                    Capturar Foto
                  </Button>
                </div>

                {/* Vista previa IP Webcam */}
                <div className="relative">
                  {conexionIPWebcam ? (
                    <div className="text-center">
                      <img
                        src={`${ipWebcamUrl}/shot.jpg?timestamp=${Date.now()}`}
                        alt="IP Webcam Live"
                        className="w-full max-w-md mx-auto h-64 bg-black border-2 border-blue-500 rounded-lg object-cover"
                        onError={(e) => {
                          console.error('Error cargando imagen IP Webcam');
                          e.currentTarget.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjQwIiBoZWlnaHQ9IjQ4MCIgdmlld0JveD0iMCAwIDY0MCA0ODAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjY0MCIgaGVpZ2h0PSI0ODAiIGZpbGw9IiMzNzM3MzciLz48dGV4dCB4PSIzMjAiIHk9IjI0MCIgZmlsbD0iI0ZGRkZGRiIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZG9taW5hbnQtYmFzZWxpbmU9Im1pZGRsZSI+RXJyb3IgY2FyZ2FuZG8gSVAgV2ViY2FtPC90ZXh0Pjwvc3ZnPg==';
                        }}
                      />
                      
                      {/* Indicador de estado IP Webcam */}
                      <div className="absolute top-2 left-2">
                        {camaraPausada ? (
                          <div className="bg-yellow-600 text-white px-2 py-1 rounded-full flex items-center space-x-2 text-sm">
                            <Pause className="h-3 w-3" />
                            <span>⏸️ IA Pausada</span>
                          </div>
                        ) : (
                          <div className="bg-green-600 text-white px-2 py-1 rounded-full flex items-center space-x-2 text-sm">
                            <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                            <span>📱 IP Webcam en Vivo</span>
                          </div>
                        )}
                      </div>

                      {/* Estado de procesamiento */}
                      {cargando && (
                        <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2">
                          <div className="bg-blue-600 text-white px-3 py-1 rounded-full flex items-center space-x-2 text-sm">
                            <RefreshCw className="h-3 w-3 animate-spin" />
                            <span>Analizando...</span>
                          </div>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="w-full max-w-md mx-auto h-64 bg-gray-700 border-2 border-gray-600 rounded-lg flex items-center justify-center">
                      <div className="text-center">
                        <Smartphone className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                        <p className="text-gray-300">Presiona "Conectar IP Webcam"</p>
                        <p className="text-xs text-gray-500 mt-1">Verifica que tu celular esté en la misma red</p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Preview de captura */}
                {previewUrl && (
                  <div className="space-y-3">
                    <img
                      src={previewUrl}
                      alt="Foto capturada IP Webcam"
                      className="max-w-full max-w-md mx-auto rounded-lg shadow-lg"
                    />
                    <div className="flex space-x-2 justify-center">
                      <Button
                        onClick={() => {
                          setPreviewUrl('');
                          setFoto(null);
                          conectarIPWebcam();
                        }}
                        variant="outline"
                        size="sm"
                      >
                        <RefreshCw className="h-4 w-4 mr-2" />
                        Capturar Otra
                      </Button>
                      <Button
                        onClick={limpiarFormulario}
                        variant="outline"
                        size="sm"
                      >
                        <XCircle className="h-4 w-4 mr-2" />
                        Limpiar
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Modo Cámara */}
            {modo === 'camara' && (
              <div className="space-y-4">
                {/* Controles de Cámara */}
                <div className="flex gap-2 justify-center flex-wrap">
                  <Button
                    onClick={iniciarCamara}
                    disabled={camaraActiva || cargando}
                    variant="outline"
                  >
                    <Camera className="h-4 w-4 mr-2" />
                    {camaraActiva ? 'Cámara Activa' : 'Iniciar Cámara'}
                  </Button>
                  
                  <Button
                    onClick={togglePausarCamara}
                    disabled={!camaraActiva}
                    variant={camaraPausada ? "default" : "secondary"}
                  >
                    {camaraPausada ? (
                      <>
                        <Play className="h-4 w-4 mr-2" />
                        Reanudar IA
                      </>
                    ) : (
                      <>
                        <Pause className="h-4 w-4 mr-2" />
                        Pausar IA
                      </>
                    )}
                  </Button>
                  
                  <Button
                    onClick={detenerCamara}
                    disabled={!camaraActiva}
                    variant="outline"
                  >
                    <XCircle className="h-4 w-4 mr-2" />
                    Detener
                  </Button>

                  <Button
                    onClick={capturarFoto}
                    disabled={!camaraActiva || cargando}
                    variant="default"
                  >
                    <Camera className="h-4 w-4 mr-2" />
                    Capturar
                  </Button>
                </div>

                {/* Video de Cámara */}
                <div className="relative">
                  <video
                    ref={videoRef}
                    autoPlay
                    muted
                    className="w-full max-w-md mx-auto h-64 bg-black border-2 border-gray-300 rounded-lg"
                    style={{ objectFit: 'cover', display: camaraActiva ? 'block' : 'none' }}
                  />
                  <canvas ref={canvasRef} className="hidden" />
                  
                  {/* Indicador de Reconocimiento en Tiempo Real */}
                  {camaraActiva && (
                    <div className="absolute top-2 left-2">
                      {camaraPausada ? (
                        <div className="bg-yellow-600 text-white px-2 py-1 rounded-full flex items-center space-x-2 text-sm">
                          <Pause className="h-3 w-3" />
                          <span>⏸️ IA Pausada</span>
                        </div>
                      ) : (
                        <div className="bg-red-600 text-white px-2 py-1 rounded-full flex items-center space-x-2 text-sm">
                          <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                          <span>🤖 IA Reconociendo en Vivo</span>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Estado de procesamiento */}
                  {camaraActiva && cargando && (
                    <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2">
                      <div className="bg-blue-600 text-white px-3 py-1 rounded-full flex items-center space-x-2 text-sm">
                        <RefreshCw className="h-3 w-3 animate-spin" />
                        <span>Analizando...</span>
                      </div>
                    </div>
                  )}
                  
                  {!camaraActiva && !previewUrl && (
                    <div className="w-full max-w-md mx-auto h-64 bg-gray-100 border-2 border-gray-300 rounded-lg flex items-center justify-center">
                      <div className="text-center">
                        <Camera className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                        <p className="text-gray-500">Presiona "Iniciar Cámara"</p>
                        <p className="text-xs text-gray-400 mt-1">Se activará reconocimiento automático</p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Preview de captura */}
                {previewUrl && (
                  <div className="space-y-3">
                    <img
                      src={previewUrl}
                      alt="Foto capturada"
                      className="max-w-full max-w-md mx-auto rounded-lg shadow-lg"
                    />
                    <div className="flex space-x-2 justify-center">
                      <Button
                        onClick={() => {
                          setPreviewUrl('');
                          setFoto(null);
                          iniciarCamara();
                        }}
                        variant="outline"
                        size="sm"
                      >
                        <RefreshCw className="h-4 w-4 mr-2" />
                        Capturar Otra
                      </Button>
                      <Button
                        onClick={limpiarFormulario}
                        variant="outline"
                        size="sm"
                      >
                        <XCircle className="h-4 w-4 mr-2" />
                        Limpiar
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Configuración */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-200 p-6 rounded-xl shadow-lg space-y-4">
              <h4 className="font-bold text-gray-900 text-xl flex items-center space-x-2">
                <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <span>Configuración Avanzada</span>
              </h4>
              
              {/* Umbral de confianza */}
              <div className="bg-white rounded-lg p-4 border border-blue-100 shadow-sm">
                <label className="flex items-center space-x-2 text-sm font-bold text-gray-900 mb-3">
                  <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                    <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
                    </svg>
                  </div>
                  <span>Umbral de Confianza</span>
                </label>
                <select
                  value={configuracion.umbralConfianza}
                  onChange={(e) => setConfiguracion(prev => ({
                    ...prev,
                    umbralConfianza: e.target.value
                  }))}
                  className="w-full px-4 py-3 border-2 border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white shadow-sm transition-all duration-200 hover:border-blue-300"
                >
                  <option value="60.0">🟢 60% - Flexible</option>
                  <option value="70.0">🟡 70% - Recomendado</option>
                  <option value="80.0">🟠 80% - Estricto</option>
                  <option value="90.0">🔴 90% - Muy estricto</option>
                </select>
              </div>

              {/* Buscar en */}
              <div className="bg-white rounded-lg p-4 border border-purple-100 shadow-sm">
                <label className="flex items-center space-x-2 text-sm font-bold text-gray-900 mb-3">
                  <div className="w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center">
                    <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                  <span>Buscar en Base de Datos</span>
                </label>
                <select
                  value={configuracion.buscarEn}
                  onChange={(e) => setConfiguracion(prev => ({
                    ...prev,
                    buscarEn: e.target.value as 'propietarios' | 'inquilinos' | 'todos'
                  }))}
                  className="w-full px-4 py-3 border-2 border-purple-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 bg-white shadow-sm transition-all duration-200 hover:border-purple-300"
                >
                  <option value="todos">👥 Todos los residentes</option>
                  <option value="propietarios">🏠 Solo propietarios</option>
                  <option value="inquilinos">🔑 Solo inquilinos</option>
                </select>
              </div>

              {/* IA Real */}
              <div className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg p-4 border-2 border-yellow-200 shadow-sm">
                <div className="flex items-center space-x-3">
                  <div className="relative">
                    <input
                      type="checkbox"
                      id="usarIAReal"
                      checked={configuracion.usarIAReal}
                      onChange={(e) => setConfiguracion(prev => ({
                        ...prev,
                        usarIAReal: e.target.checked
                      }))}
                      className="w-5 h-5 rounded border-2 border-yellow-400 text-yellow-600 focus:ring-yellow-500 focus:ring-2 transition-all duration-200"
                    />
                  </div>
                  <label htmlFor="usarIAReal" className="text-sm font-bold text-gray-900 flex items-center space-x-2 cursor-pointer">
                    <div className="flex items-center space-x-1">
                      <Zap className="h-5 w-5 text-yellow-500" />
                      <span className="bg-gradient-to-r from-yellow-600 to-orange-600 bg-clip-text text-transparent font-extrabold">
                        Usar IA Real (más preciso)
                      </span>
                    </div>
                  </label>
                </div>
                {configuracion.usarIAReal && (
                  <div className="mt-2 text-xs text-yellow-700 bg-yellow-100 rounded px-2 py-1">
                    ⚡ Modo avanzado activado - Mayor precisión y velocidad
                  </div>
                )}
              </div>
            </div>

            {/* Botón de verificación */}
            <div className="bg-gradient-to-r from-emerald-50 to-teal-50 p-6 rounded-xl border-2 border-emerald-200 shadow-lg">
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-6 h-6 bg-emerald-500 rounded-full flex items-center justify-center">
                  <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <p className="text-sm text-emerald-800 font-bold">
                  🔍 Verificación Manual con IA Avanzada
                </p>
              </div>
              <Button
                onClick={verificarIdentidad}
                disabled={!foto || cargando || (camaraActiva && camaraPausada)}
                className={`w-full transition-all duration-300 transform hover:scale-105 shadow-lg ${
                  !foto ? 'bg-gradient-to-r from-gray-400 to-gray-500 hover:from-gray-400 hover:to-gray-500' : 
                  (camaraActiva && camaraPausada) ? 'bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-500 hover:to-orange-500 animate-pulse' : 
                  'bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700'
                }`}
                size="lg"
              >
                {!foto ? (
                  <>
                    <FileText className="h-5 w-5 mr-2" />
                    Selecciona una foto primero
                  </>
                ) : cargando ? (
                  <>
                    <RefreshCw className="h-5 w-5 mr-2 animate-spin" />
                    Procesando...
                  </>
                ) : (camaraActiva && camaraPausada) ? (
                  <>
                    <Pause className="h-5 w-5 mr-2" />
                    IA Pausada - Reanuda para verificar
                  </>
                ) : (
                  <>
                    <Eye className="h-5 w-5 mr-2" />
                    Verificar Identidad
                  </>
                )}
              </Button>
              {!foto && (
                <p className="text-xs text-gray-600 mt-2 text-center">
                  ⬆️ Usa "Opción A: Cámara en Vivo" o "Opción B: Subir Foto" para comenzar
                </p>
              )}
            </div>
          </CardContent>
        </Card>
          </div>

          {/* Panel de Resultado */}
          <div className="xl:col-span-1">
            <Card className="bg-white/80 backdrop-blur-sm border-2 border-purple-200 shadow-xl rounded-2xl overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-purple-500 to-pink-500 text-white p-6">
                <CardTitle className="flex items-center space-x-3 text-xl">
                  <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
                    <Eye className="h-5 w-5" />
                  </div>
                  <span>Resultado de Verificación</span>
                </CardTitle>
              </CardHeader>
          <CardContent>
            {/* Error */}
            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {/* Loading */}
            {cargando && (
              <div className="text-center py-8">
                <RefreshCw className="h-8 w-8 text-blue-500 mx-auto mb-4 animate-spin" />
                <p className="text-lg font-medium text-gray-700">Procesando reconocimiento facial...</p>
                <p className="text-sm text-gray-500 mt-2">
                  {configuracion.usarIAReal ? 'Usando IA real (puede tomar hasta 3 segundos)' : 'Procesamiento rápido'}
                </p>
              </div>
            )}

            {/* Resultado exitoso */}
            {resultado && resultado.success && (
              <div className="space-y-4">
                {resultado.verificacion.resultado === 'ACEPTADO' ? (
                  // ACCESO AUTORIZADO
                  <div className="bg-green-50 border border-green-200 rounded-lg p-6">
                    <div className="flex items-center space-x-3 mb-4">
                      <CheckCircle className="h-8 w-8 text-green-600" />
                      <div>
                        <h3 className="text-xl font-bold text-green-800">ACCESO AUTORIZADO</h3>
                        <p className="text-green-600">Persona identificada correctamente</p>
                      </div>
                    </div>

                    {resultado.verificacion.persona_identificada && (
                      <div className="bg-white rounded-lg p-4 space-y-3">
                        <div className="flex items-center space-x-2">
                          <User className="h-5 w-5 text-gray-500" />
                          <span className="font-semibold text-gray-900">
                            {resultado.verificacion.persona_identificada.nombre_completo}
                          </span>
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          <FileText className="h-5 w-5 text-gray-500" />
                          <span className="text-gray-700">
                            Doc: {resultado.verificacion.persona_identificada.documento}
                          </span>
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          <Home className="h-5 w-5 text-gray-500" />
                          <span className="text-gray-700">
                            {resultado.verificacion.persona_identificada.unidad}
                          </span>
                        </div>

                        <div className="flex items-center justify-between">
                          <Badge variant="default">
                            {resultado.verificacion.persona_identificada.tipo_residente}
                          </Badge>
                          <Badge variant="outline" className="text-green-700 border-green-300">
                            Confianza: {resultado.verificacion.confianza.toFixed(1)}%
                          </Badge>
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  // ACCESO DENEGADO
                  <div className="bg-red-50 border border-red-200 rounded-lg p-6">
                    <div className="flex items-center space-x-3 mb-4">
                      <XCircle className="h-8 w-8 text-red-600" />
                      <div>
                        <h3 className="text-xl font-bold text-red-800">ACCESO DENEGADO</h3>
                        <p className="text-red-600">Persona no identificada en el sistema</p>
                      </div>
                    </div>

                    <div className="bg-white rounded-lg p-4 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-gray-700">Mejor coincidencia:</span>
                        <Badge variant="outline" className="text-red-700 border-red-300">
                          {resultado.verificacion.confianza.toFixed(1)}%
                        </Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-700">Umbral requerido:</span>
                        <Badge variant="outline">
                          {resultado.verificacion.umbral_usado}%
                        </Badge>
                      </div>
                    </div>
                  </div>
                )}

                {/* Estadísticas */}
                {resultado.estadisticas && (
                  <div className="bg-gradient-to-br from-indigo-50 via-blue-50 to-cyan-50 border-2 border-indigo-200 rounded-xl p-6 shadow-lg">
                    <h4 className="font-bold text-gray-900 mb-4 flex items-center space-x-3 text-xl">
                      <div className="w-8 h-8 bg-gradient-to-r from-indigo-500 to-blue-500 rounded-full flex items-center justify-center">
                        <Clock className="h-4 w-4 text-white" />
                      </div>
                      <span className="bg-gradient-to-r from-indigo-600 to-blue-600 bg-clip-text text-transparent">
                        Estadísticas de Procesamiento
                      </span>
                    </h4>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-white rounded-lg p-4 border border-green-200 shadow-sm hover:shadow-md transition-shadow">
                        <div className="flex items-center space-x-2 mb-2">
                          <div className="w-4 h-4 bg-green-500 rounded-full"></div>
                          <span className="text-gray-800 font-medium text-sm">Personas analizadas</span>
                        </div>
                        <p className="font-bold text-green-600 text-2xl">{resultado.estadisticas.personas_analizadas}</p>
                      </div>
                      
                      <div className="bg-white rounded-lg p-4 border border-blue-200 shadow-sm hover:shadow-md transition-shadow">
                        <div className="flex items-center space-x-2 mb-2">
                          <div className="w-4 h-4 bg-blue-500 rounded-full"></div>
                          <span className="text-gray-800 font-medium text-sm">Comparaciones</span>
                        </div>
                        <p className="font-bold text-blue-600 text-2xl">{resultado.estadisticas.total_comparaciones}</p>
                      </div>
                      
                      <div className="bg-white rounded-lg p-4 border border-purple-200 shadow-sm hover:shadow-md transition-shadow">
                        <div className="flex items-center space-x-2 mb-2">
                          <div className="w-4 h-4 bg-purple-500 rounded-full"></div>
                          <span className="text-gray-800 font-medium text-sm">Sobre umbral</span>
                        </div>
                        <p className="font-bold text-purple-600 text-2xl">{resultado.estadisticas.sobre_umbral}</p>
                      </div>
                      
                      <div className="bg-white rounded-lg p-4 border border-orange-200 shadow-sm hover:shadow-md transition-shadow">
                        <div className="flex items-center space-x-2 mb-2">
                          <div className="w-4 h-4 bg-orange-500 rounded-full"></div>
                          <span className="text-gray-800 font-medium text-sm">Tiempo procesamiento</span>
                        </div>
                        <p className="font-bold text-orange-600 text-2xl">
                          {formatearTiempo(resultado.estadisticas.tiempo_procesamiento_ms)}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Estado inicial */}
            {!resultado && !cargando && !error && (
              <div className="text-center py-8">
                <Eye className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-lg font-medium text-gray-700">Listo para verificar</p>
                <p className="text-sm text-gray-500">Selecciona una foto y haz clic en "Verificar Identidad"</p>
              </div>
            )}
          </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}