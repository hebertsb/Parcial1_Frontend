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
  Zap
} from 'lucide-react';
import { sincronizacionReconocimientoService, VerificacionFacialResponse } from '@/features/seguridad/sincronizacion-service';
import { validarArchivo, testConexionBackend, analizarRespuesta } from '@/utils/reconocimiento-facial-debug';

interface ConfiguracionVerificacion {
  umbralConfianza: string;
  buscarEn: 'propietarios' | 'inquilinos' | 'todos';
  usarIAReal: boolean;
}

export default function PanelReconocimientoFacial() {
  // Estados principales
  const [foto, setFoto] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>('');
  const [cargando, setCargando] = useState(false);
  const [resultado, setResultado] = useState<VerificacionFacialResponse | null>(null);
  const [error, setError] = useState<string>('');
  
  // Configuración
  const [configuracion, setConfiguracion] = useState<ConfiguracionVerificacion>({
    umbralConfianza: '70.0',
    buscarEn: 'propietarios',
    usarIAReal: true
  });

  // Referencias
  const fotoInputRef = useRef<HTMLInputElement>(null);

  /**
   * Manejar selección de archivo con validaciones mejoradas
   */
  const handleFotoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const archivo = event.target.files?.[0];
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
   * Función principal de verificación
   * CONFIGURADA SEGÚN RECOMENDACIONES CRÍTICAS DEL BACKEND
   */
  const verificarIdentidad = async () => {
    if (!foto) {
      setError('Por favor selecciona una foto primero');
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

      console.log('🤖 Iniciando verificación facial...', {
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
      
      // Mensajes de error específicos según recomendaciones
      let mensajeError = error.message;
      
      if (error.message.includes('proxy')) {
        mensajeError = '🚨 Error de proxy detectado. Desactivar proxy para localhost/127.0.0.1';
      } else if (error.message.includes('CORS')) {
        mensajeError = '🔒 Error CORS. Verificar que el backend esté en http://127.0.0.1:8000';
      } else if (error.message.includes('fetch') || error.message.includes('Network')) {
        mensajeError = '🔌 Error de conexión. Verificar que Django esté corriendo: python manage.py runserver';
      } else if (error.message.includes('timeout')) {
        mensajeError = '⏱️ Timeout - La IA real puede tomar hasta 30 segundos. Intentar con IA desactivada';
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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-6 rounded-lg">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-white/20 rounded-lg">
            <Camera className="h-6 w-6" />
          </div>
          <div>
            <h2 className="text-2xl font-bold">Verificación Facial con IA</h2>
            <p className="text-blue-100">Sistema de reconocimiento automático para control de acceso</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Panel de Captura */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Camera className="h-5 w-5" />
              <span>Captura de Foto</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Input de archivo */}
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-400 transition-colors">
              <input
                ref={fotoInputRef}
                type="file"
                accept="image/*"
                capture="environment"
                onChange={handleFotoChange}
                className="hidden"
              />
              
              {!previewUrl ? (
                <div className="space-y-3">
                  <Camera className="h-12 w-12 text-gray-400 mx-auto" />
                  <div>
                    <p className="text-lg font-medium text-gray-700">Seleccionar o capturar foto</p>
                    <p className="text-sm text-gray-500">JPEG o PNG, máximo 5MB</p>
                  </div>
                  <Button
                    onClick={() => fotoInputRef.current?.click()}
                    variant="outline"
                    className="mt-2"
                  >
                    <Camera className="h-4 w-4 mr-2" />
                    Capturar Foto
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

            {/* Configuración */}
            <div className="bg-gray-50 p-4 rounded-lg space-y-3">
              <h4 className="font-medium text-gray-900">Configuración</h4>
              
              {/* Umbral de confianza */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Umbral de Confianza
                </label>
                <select
                  value={configuracion.umbralConfianza}
                  onChange={(e) => setConfiguracion(prev => ({
                    ...prev,
                    umbralConfianza: e.target.value
                  }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="60.0">60% - Flexible</option>
                  <option value="70.0">70% - Recomendado</option>
                  <option value="80.0">80% - Estricto</option>
                  <option value="90.0">90% - Muy estricto</option>
                </select>
              </div>

              {/* Buscar en */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Buscar en
                </label>
                <select
                  value={configuracion.buscarEn}
                  onChange={(e) => setConfiguracion(prev => ({
                    ...prev,
                    buscarEn: e.target.value as 'propietarios' | 'inquilinos' | 'todos'
                  }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="todos">Todos los residentes</option>
                  <option value="propietarios">Solo propietarios</option>
                  <option value="inquilinos">Solo inquilinos</option>
                </select>
              </div>

              {/* IA Real */}
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="usarIAReal"
                  checked={configuracion.usarIAReal}
                  onChange={(e) => setConfiguracion(prev => ({
                    ...prev,
                    usarIAReal: e.target.checked
                  }))}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <label htmlFor="usarIAReal" className="text-sm font-medium text-gray-700 flex items-center space-x-1">
                  <Zap className="h-4 w-4 text-yellow-500" />
                  <span>Usar IA Real (más preciso)</span>
                </label>
              </div>
            </div>

            {/* Botón de verificación */}
            <Button
              onClick={verificarIdentidad}
              disabled={!foto || cargando}
              className="w-full"
              size="lg"
            >
              {cargando ? (
                <>
                  <RefreshCw className="h-5 w-5 mr-2 animate-spin" />
                  Procesando...
                </>
              ) : (
                <>
                  <Eye className="h-5 w-5 mr-2" />
                  Verificar Identidad
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        {/* Panel de Resultado */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Eye className="h-5 w-5" />
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
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h4 className="font-medium text-gray-900 mb-3 flex items-center space-x-2">
                      <Clock className="h-4 w-4" />
                      <span>Estadísticas de Procesamiento</span>
                    </h4>
                    
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-gray-600">Personas analizadas:</span>
                        <p className="font-medium">{resultado.estadisticas.personas_analizadas}</p>
                      </div>
                      <div>
                        <span className="text-gray-600">Comparaciones:</span>
                        <p className="font-medium">{resultado.estadisticas.total_comparaciones}</p>
                      </div>
                      <div>
                        <span className="text-gray-600">Sobre umbral:</span>
                        <p className="font-medium">{resultado.estadisticas.sobre_umbral}</p>
                      </div>
                      <div>
                        <span className="text-gray-600">Tiempo:</span>
                        <p className="font-medium">
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
  );
}