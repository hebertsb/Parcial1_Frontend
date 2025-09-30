/**
 * 🔒 SERVICIO DE SINCRONIZACIÓN DE SEGURIDAD
 * ✅ USANDO ENDPOINTS REALES IMPLEMENTADOS EN EL BACKEND
 * 
 * TODAS LAS RUTAS ESTÁN FUNCIONANDO CORRECTAMENTE
 */

import { ApiResponse } from '@/core/types';
import { apiClient } from '@/core/api/client';

// 🎯 URLs REALES DEL BACKEND IMPLEMENTADAS
// ⚠️ IMPORTANTE: No incluir /api/ al inicio porque apiClient ya lo agrega
const SEGURIDAD_API = {
  // Lista completa de usuarios con reconocimiento facial
  USUARIOS_RECONOCIMIENTO: '/seguridad/usuarios-reconocimiento/',
  
  // Lista específica de propietarios con reconocimiento facial  
  PROPIETARIOS_RECONOCIMIENTO: '/seguridad/propietarios-reconocimiento/',
  
  // Estadísticas de sincronización
  ESTADISTICAS: '/seguridad/sincronizar-fotos/estadisticas/',
  
  // Dashboard principal de seguridad
  DASHBOARD: '/seguridad/dashboard/',
  
  // Endpoints de reconocimiento facial
  ENROLL: '/seguridad/reconocimiento-facial/enroll/',
  VERIFY: '/seguridad/reconocimiento-facial/verify/',
  
  // Sincronización manual
  SYNC_INDIVIDUAL: '/seguridad/sincronizar-fotos/',
  SYNC_TODOS: '/seguridad/sincronizar-fotos/todos/',
  
  // Verificación facial en tiempo real
  VERIFICACION_TIEMPO_REAL: '/seguridad/verificacion-tiempo-real/'
};

// ========================================
// INTERFACES SEGÚN DOCUMENTACIÓN BACKEND
// ========================================

export interface UsuarioReconocimientoSincronizado {
  copropietario_id: number;
  usuario_id: number;
  nombre_completo: string;
  documento: string;
  unidad: string;
  email: string;
  telefono?: string;
  foto_perfil?: string;
  fotos_reconocimiento: {
    cantidad: number;
    urls: string[];
    fecha_registro: string;
    ultima_actualizacion: string;
  };
  estado: string;
  tipo_residente: 'Propietario' | 'Inquilino' | 'Familiar';
}

export interface PropietarioReconocimiento {
  copropietario_id: number;
  usuario_id: number;
  nombre_completo: string;
  documento: string;
  unidad: string;
  email: string;
  telefono?: string;
  foto_perfil?: string;
  fotos_reconocimiento: {
    cantidad: number;
    urls: string[];
    fecha_registro: string;
    ultima_actualizacion: string;
  };
  estado: string;
}

export interface ResumenSincronizacion {
  total_usuarios: number;
  con_reconocimiento: number;
  sin_reconocimiento: number;
  porcentaje_cobertura: number;
  total_fotos: number;
  ultima_actualizacion: string;
}

export interface ResumenPropietarios {
  total_propietarios: number;
  con_fotos: number;
  sin_fotos: number;
  porcentaje_sincronizacion: number;
  total_fotos_sincronizadas: number;
  ultima_actualizacion: string;
}

export interface RespuestaUsuariosReconocimiento {
  usuarios: UsuarioReconocimientoSincronizado[];
  resumen: ResumenSincronizacion;
}

export interface RespuestaPropietariosReconocimiento {
  propietarios: PropietarioReconocimiento[];
  resumen: ResumenPropietarios;
}

export interface EstadisticasSincronizacion {
  total_usuarios_reconocimiento: number;
  usuarios_con_fotos_dropbox: number;
  usuarios_sin_fotos: number;
  total_fotos_sincronizadas: number;
  porcentaje_sincronizacion: number;
  ultima_actualizacion: string;
}

export interface SincronizacionIndividualRequest {
  usuario_id: number;
}

export interface SincronizacionIndividualResponse {
  success: boolean;
  usuario: {
    id: number;
    nombre: string;
    fotos_sincronizadas: number;
  };
  message: string;
}

export interface SincronizacionTodosResponse {
  success: boolean;
  usuarios_actualizados: number;
  total_fotos_sincronizadas: number;
  message: string;
}

// ========================================
// INTERFACES PARA RECONOCIMIENTO FACIAL
// ========================================

export interface VerificacionFacialRequest {
  foto_verificacion: File;
  umbral_confianza?: string;
  buscar_en?: 'propietarios' | 'inquilinos' | 'todos';
  usar_ia_real?: boolean;
}

export interface PersonaIdentificada {
  copropietario_id: number;
  nombre_completo: string;
  documento: string;
  unidad: string;
  tipo_residente: string;
  foto_perfil?: string;
}

export interface EstadisticasVerificacion {
  total_comparaciones: number;
  sobre_umbral: number;
  umbral_usado: number;
  tiempo_procesamiento_ms: number;
  personas_analizadas: number;
  mejor_coincidencia: number;
}

export interface VerificacionResult {
  persona_identificada: PersonaIdentificada | null;
  confianza: number;
  umbral_usado: number;
  resultado: 'ACEPTADO' | 'RECHAZADO';
  timestamp: string;
  foto_comparada?: string;
}

export interface VerificacionFacialResponse {
  success: boolean;
  verificacion: VerificacionResult;
  estadisticas: EstadisticasVerificacion;
  error?: string;
}

// ========================================
// SERVICIO PRINCIPAL
// ========================================

export const sincronizacionReconocimientoService = {
  /**
   * 🔍 OBTENER USUARIOS CON RECONOCIMIENTO FACIAL
   * ✅ Endpoint: GET /api/seguridad/usuarios-reconocimiento/ (IMPLEMENTADO)
   */
  async obtenerUsuariosConReconocimiento(): Promise<ApiResponse<RespuestaUsuariosReconocimiento>> {
    console.log('🔍 Obteniendo usuarios con reconocimiento facial desde endpoint real...');
    
    try {
      const response = await apiClient.get<RespuestaUsuariosReconocimiento>(SEGURIDAD_API.USUARIOS_RECONOCIMIENTO);
      console.log('✅ Respuesta de usuarios-reconocimiento:', response);

      if (response.success && response.data) {
        return {
          success: true,
          message: 'Usuarios con reconocimiento facial obtenidos correctamente',
          data: response.data
        };
      }
      
      return {
        success: false,
        message: response.message || 'No se pudieron obtener los usuarios con reconocimiento facial'
      };
    } catch (error) {
      console.error('❌ Error obteniendo usuarios con reconocimiento:', error);
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Error desconocido',
        data: {
          usuarios: [],
          resumen: {
            total_usuarios: 0,
            con_reconocimiento: 0,
            sin_reconocimiento: 0,
            porcentaje_cobertura: 0,
            total_fotos: 0,
            ultima_actualizacion: new Date().toISOString()
          }
        }
      };
    }
  },

  /**
   * � OBTENER PROPIETARIOS CON RECONOCIMIENTO FACIAL
   * ✅ Endpoint: GET /api/seguridad/propietarios-reconocimiento/ (IMPLEMENTADO)
   */
  async obtenerPropietariosConReconocimiento(): Promise<ApiResponse<RespuestaPropietariosReconocimiento>> {
    console.log('🏠 Obteniendo PROPIETARIOS con reconocimiento facial desde endpoint real...');
    
    try {
      const response = await apiClient.get<RespuestaPropietariosReconocimiento>(SEGURIDAD_API.PROPIETARIOS_RECONOCIMIENTO);
      console.log('✅ Respuesta de propietarios-reconocimiento:', response);

      if (response.success && response.data) {
        return {
          success: true,
          message: 'Propietarios con reconocimiento facial obtenidos correctamente',
          data: response.data
        };
      }
      
      return {
        success: false,
        message: response.message || 'No se pudieron obtener los propietarios con reconocimiento facial'
      };
    } catch (error) {
      console.error('❌ Error obteniendo propietarios con reconocimiento:', error);
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Error desconocido'
      };
    }
  },

  /**
   * 🔄 SINCRONIZAR FOTOS DE UN USUARIO ESPECÍFICO
   * ✅ Endpoint: POST /api/seguridad/sincronizar-fotos/ (IMPLEMENTADO)
   */
  async sincronizarFotosUsuario(usuarioId: number): Promise<ApiResponse<SincronizacionIndividualResponse>> {
    console.log(`🔄 Sincronizando fotos del usuario ${usuarioId}...`);
    
    try {
      const response = await apiClient.post<SincronizacionIndividualResponse>(SEGURIDAD_API.SYNC_INDIVIDUAL, {
        usuario_id: usuarioId
      });
      
      console.log('✅ Sincronización individual completada:', response);
      return response;
    } catch (error) {
      console.error('❌ Error en sincronización individual:', error);
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Error desconocido'
      };
    }
  },

  /**
   * 🔄 SINCRONIZAR FOTOS DE TODOS LOS USUARIOS
   * ✅ Endpoint: POST /api/seguridad/sincronizar-fotos/todos/ (IMPLEMENTADO)
   */
  async sincronizarTodasLasFotos(): Promise<ApiResponse<SincronizacionTodosResponse>> {
    console.log('🔄 Sincronizando fotos de TODOS los usuarios...');
    
    try {
      const response = await apiClient.post<SincronizacionTodosResponse>(SEGURIDAD_API.SYNC_TODOS, {});
      console.log('✅ Sincronización masiva completada:', response);
      return response;
    } catch (error) {
      console.error('❌ Error en sincronización masiva:', error);
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Error desconocido'
      };
    }
  },

  /**
   * 📊 OBTENER ESTADÍSTICAS DE SINCRONIZACIÓN
   * ✅ Endpoint: GET /api/seguridad/sincronizar-fotos/estadisticas/ (IMPLEMENTADO)
   */
  async obtenerEstadisticasSincronizacion(): Promise<ApiResponse<EstadisticasSincronizacion>> {
    console.log('📊 Obteniendo estadísticas de sincronización...');
    
    try {
      const response = await apiClient.get<EstadisticasSincronizacion>(SEGURIDAD_API.ESTADISTICAS);
      console.log('✅ Estadísticas obtenidas:', response);

      if (response.success && response.data) {
        return {
          success: true,
          message: 'Estadísticas obtenidas correctamente',
          data: response.data
        };
      }
      
      return {
        success: false,
        message: response.message || 'No se pudieron obtener las estadísticas'
      };
    } catch (error) {
      console.error('❌ Error obteniendo estadísticas:', error);
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Error desconocido'
      };
    }
  },

  /**
   * � OBTENER DASHBOARD DE SEGURIDAD
   * ✅ Endpoint: GET /api/seguridad/dashboard/ (IMPLEMENTADO)
   */
  async obtenerDashboardSeguridad(): Promise<ApiResponse<any>> {
    console.log('🏠 Obteniendo dashboard de seguridad...');
    
    try {
      const response = await apiClient.get(SEGURIDAD_API.DASHBOARD);
      console.log('✅ Dashboard obtenido:', response);

      if (response.success && response.data) {
        return {
          success: true,
          message: 'Dashboard obtenido correctamente',
          data: response.data
        };
      }
      
      return {
        success: false,
        message: response.message || 'No se pudo obtener el dashboard'
      };
    } catch (error) {
      console.error('❌ Error obteniendo dashboard:', error);
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Error desconocido'
      };
    }
  },

  /**
   * 🔍 ENROLL FACIAL - REGISTRAR CARA
   * ✅ Endpoint: POST /api/seguridad/reconocimiento-facial/enroll/ (IMPLEMENTADO)
   */
  async enrollFacial(data: { usuario_id: number; imagen: string }): Promise<ApiResponse<any>> {
    console.log('🔍 Registrando cara para reconocimiento facial...');
    
    try {
      const response = await apiClient.post(SEGURIDAD_API.ENROLL, data);
      console.log('✅ Registro facial completado:', response);

      return response;
    } catch (error) {
      console.error('❌ Error en registro facial:', error);
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Error desconocido'
      };
    }
  },

  /**
   * ✅ VERIFY FACIAL - VERIFICAR CARA
   * ✅ Endpoint: POST /api/seguridad/reconocimiento-facial/verify/ (IMPLEMENTADO)
   */
  async verifyFacial(data: { imagen: string }): Promise<ApiResponse<any>> {
    console.log('✅ Verificando cara con reconocimiento facial...');
    
    try {
      const response = await apiClient.post(SEGURIDAD_API.VERIFY, data);
      console.log('✅ Verificación facial completada:', response);

      return response;
    } catch (error) {
      console.error('❌ Error en verificación facial:', error);
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Error desconocido'
      };
    }
  },

  /**
   * �🎯 VALIDAR URLS DE DROPBOX
   * Función auxiliar para verificar que las URLs sean válidas
   */
  validarUrlsDropbox(urls: string[]): string[] {
    if (!Array.isArray(urls)) return [];
    
    return urls.filter(url => {
      if (!url || typeof url !== 'string') return false;
      
      // Validar que sea una URL de Dropbox válida
      const urlPatterns = [
        /^https:\/\/dl\.dropboxusercontent\.com\/.+/,
        /^https:\/\/www\.dropbox\.com\/.*\?dl=1$/,
        /^https:\/\/dropbox\.com\/.*\?dl=1$/
      ];
      
      return urlPatterns.some(pattern => pattern.test(url));
    });
  },

  /**
   * 🎯 GENERAR DATOS DE PRUEBA
   * Mientras no tengamos propietarios registrados, usar datos de ejemplo
   */
  generarDatosPrueba(): UsuarioReconocimientoSincronizado[] {
    return [
      {
        copropietario_id: 1,
        usuario_id: 1,
        nombre_completo: 'Juan Carlos Pérez',
        documento: '12345678',
        unidad: 'A-301',
        email: 'juan.perez@email.com',
        telefono: '591-70123456',
        foto_perfil: null,
        fotos_reconocimiento: {
          cantidad: 3,
          urls: [
            'https://dl.dropboxusercontent.com/s/abc123/foto1.jpg',
            'https://dl.dropboxusercontent.com/s/def456/foto2.jpg',
            'https://dl.dropboxusercontent.com/s/ghi789/foto3.jpg'
          ],
          fecha_registro: '2024-01-15T10:30:00Z',
          ultima_actualizacion: new Date().toISOString()
        },
        estado: 'Activo con reconocimiento',
        tipo_residente: 'Propietario'
      },
      {
        copropietario_id: 2,
        usuario_id: 2,
        nombre_completo: 'María Elena García',
        documento: '87654321',
        unidad: 'B-205',
        email: 'maria.garcia@email.com',
        telefono: '591-78987654',
        foto_perfil: null,
        fotos_reconocimiento: {
          cantidad: 0,
          urls: [],
          fecha_registro: '2024-01-20T14:15:00Z',
          ultima_actualizacion: new Date().toISOString()
        },
        estado: 'Pendiente de fotos',
        tipo_residente: 'Propietario'
      },
      {
        copropietario_id: 3,
        usuario_id: 3,
        nombre_completo: 'Carlos Alberto López',
        documento: '11223344',
        unidad: 'C-102',
        email: 'carlos.lopez@email.com',
        telefono: '591-69876543',
        foto_perfil: null,
        fotos_reconocimiento: {
          cantidad: 5,
          urls: [
            'https://dl.dropboxusercontent.com/s/jkl012/carlos1.jpg',
            'https://dl.dropboxusercontent.com/s/mno345/carlos2.jpg',
            'https://dl.dropboxusercontent.com/s/pqr678/carlos3.jpg',
            'https://dl.dropboxusercontent.com/s/stu901/carlos4.jpg',
            'https://dl.dropboxusercontent.com/s/vwx234/carlos5.jpg'
          ],
          fecha_registro: '2024-01-10T09:00:00Z',
          ultima_actualizacion: new Date().toISOString()
        },
        estado: 'Activo con reconocimiento',
        tipo_residente: 'Propietario'
      }
    ];
  },

  /**
   * 🎯 TRANSFORMAR PROPIETARIO A USUARIO
   * Convierte los datos del endpoint real /authz/propietarios/ al formato esperado
   */
  transformarPropietarioAUsuario(propietario: any): UsuarioReconocimientoSincronizado {
    return {
      copropietario_id: propietario.id || 0,
      usuario_id: propietario.user?.id || 0,
      nombre_completo: `${propietario.nombres || ''} ${propietario.apellidos || ''}`.trim(),
      documento: propietario.documento_identidad || '',
      unidad: propietario.numero_casa || propietario.numero_unidad || 'N/A',
      email: propietario.email || '',
      telefono: propietario.telefono || '',
      foto_perfil: propietario.foto_perfil || null,
      fotos_reconocimiento: {
        cantidad: 0, // Por ahora 0, más adelante implementaremos la lógica real
        urls: [],
        fecha_registro: propietario.fecha_registro || new Date().toISOString(),
        ultima_actualizacion: new Date().toISOString()
      },
      estado: 'Registrado',
      tipo_residente: 'Propietario'
    };
  },

  /**
   * 🎯 FORMATEAR USUARIO PARA DISPLAY
   * Convierte la respuesta del backend al formato requerido por el frontend
   */
  formatearUsuarioParaDisplay(usuario: any): UsuarioReconocimientoSincronizado {
    const fotosUrls = this.validarUrlsDropbox(usuario.fotos_reconocimiento?.urls || []);
    
    return {
      copropietario_id: usuario.copropietario_id,
      usuario_id: usuario.usuario_id,
      nombre_completo: usuario.nombre_completo,
      documento: usuario.documento,
      unidad: usuario.unidad,
      email: usuario.email,
      telefono: usuario.telefono,
      foto_perfil: usuario.foto_perfil,
      fotos_reconocimiento: {
        cantidad: fotosUrls.length,
        urls: fotosUrls,
        fecha_registro: usuario.fotos_reconocimiento?.fecha_registro || new Date().toISOString(),
        ultima_actualizacion: usuario.fotos_reconocimiento?.ultima_actualizacion || new Date().toISOString()
      },
      estado: usuario.estado || 'Activo con reconocimiento',
      tipo_residente: usuario.tipo_residente || 'Propietario'
    };
  },

  /**
   * 🤖 VERIFICACIÓN FACIAL EN TIEMPO REAL
   * ✅ Endpoint: POST /api/seguridad/verificacion-tiempo-real/
   * 
   * Procesa una foto para identificar a una persona usando IA
   * CONFIGURADO SEGÚN RECOMENDACIONES CRÍTICAS DEL BACKEND
   */
  async verificarIdentidadFacial(
    foto: File,
    opciones: {
      umbralConfianza?: string;
      buscarEn?: 'propietarios' | 'inquilinos' | 'todos';
      usarIAReal?: boolean;
    } = {}
  ): Promise<ApiResponse<VerificacionFacialResponse>> {
    console.log('🤖 Iniciando verificación facial con IA...', {
      archivo: foto.name,
      tamaño: foto.size,
      tipo: foto.type,
      opciones
    });

    try {
      // Validaciones del archivo (según documentación backend)
      if (!foto) {
        throw new Error('Se requiere una foto para la verificación');
      }

      if (!foto.type.startsWith('image/')) {
        throw new Error('El archivo debe ser una imagen (JPEG/PNG)');
      }

      if (foto.size > 5 * 1024 * 1024) { // 5MB máximo
        throw new Error('La imagen es muy grande. Máximo 5MB permitidos');
      }

      // Preparar FormData según especificaciones críticas
      const formData = new FormData();
      formData.append('foto_verificacion', foto);
      formData.append('umbral_confianza', opciones.umbralConfianza || '70.0');
      formData.append('buscar_en', opciones.buscarEn || 'propietarios');
      formData.append('usar_ia_real', opciones.usarIAReal ? 'true' : 'false');

      // Log para debugging (según recomendación backend)
      console.log('📤 FormData preparado:');
      for (let [key, value] of formData.entries()) {
        console.log(`  ${key}:`, value instanceof File ? `${value.name} (${value.size} bytes)` : value);
      }

      // 🚨 SOLUCIÓN INMEDIATA DEL BACKEND - PROBLEMA DE PROXY IDENTIFICADO
      console.log('🚨 Aplicando solución anti-proxy del backend...');
      
      // Usar la función exacta proporcionada por el backend
      const response = await fetch(
        'http://127.0.0.1:8000/api/seguridad/verificacion-tiempo-real/',
        {
          method: 'POST',
          body: formData
          // NO proxy, NO Content-Type manual (según backend)
        }
      );

      console.log('📊 Response status:', response.status);
      console.log('📊 Response headers:', Object.fromEntries(response.headers.entries()));

      // Parsear respuesta JSON
      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ Response error:', errorText);
        throw new Error(`HTTP Error ${response.status}: ${errorText}`);
      }

      const data: VerificacionFacialResponse = await response.json();
      console.log('📋 Response data:', JSON.stringify(data, null, 2));

      // Procesar respuesta según formato del backend
      if (data.success) {
        const verificacion = data.verificacion;
        const estadisticas = data.estadisticas;

        console.log('✅ Verificación facial completada:', {
          resultado: verificacion.resultado,
          confianza: verificacion.confianza,
          persona: verificacion.persona_identificada?.nombre_completo,
          tiempo_procesamiento: estadisticas?.tiempo_procesamiento_ms
        });

        return {
          success: true,
          data: data,
          message: verificacion.resultado === 'ACEPTADO' 
            ? `Acceso autorizado para ${verificacion.persona_identificada?.nombre_completo}`
            : 'Acceso denegado - Persona no identificada'
        };
      } else {
        console.error('❌ Error en verificación facial:', data.error);
        return {
          success: false,
          message: data.error || 'Error desconocido en verificación facial',
          data: data
        };
      }

    } catch (error: any) {
      console.error('💥 Error crítico en verificación facial:', error);
      
      // Manejo específico de errores de conexión/proxy
      let errorMessage = error.message;
      if (errorMessage.includes('proxy')) {
        errorMessage = 'Error de proxy - Verificar configuración de red';
      } else if (errorMessage.includes('CORS')) {
        errorMessage = 'Error CORS - Verificar que el backend esté en http://127.0.0.1:8000';
      } else if (errorMessage.includes('fetch')) {
        errorMessage = 'Error de conexión - Verificar que el backend esté corriendo';
      }

      return {
        success: false,
        message: errorMessage
      };
    }
  }
};

export default sincronizacionReconocimientoService;