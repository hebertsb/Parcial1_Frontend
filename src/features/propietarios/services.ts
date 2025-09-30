/**
 * Servicios para gestión de propietarios
 * Maneja registro de propietarios, solicitudes y aprobaciones
 */

import { apiClient } from '@/core/api/client';
import type { ApiResponse } from '@/core/types';

// ============================================================================
// TIPOS ESPECÍFICOS PARA PROPIETARIOS
// ============================================================================

export interface SolicitudRegistroPropietario {
  nombres: string;
  apellidos: string;
  documento_identidad: string;
  email: string;
  telefono: string;
  fecha_nacimiento: string;
  genero: 'masculino' | 'femenino';
  direccion: string;
  // Información de la propiedad
  numero_unidad?: string;
  tipo_unidad?: string;
  observaciones?: string;
  // NUEVO: Reconocimiento facial
  // Array de 5 fotos: [0] = perfil principal, [1-4] = reconocimiento facial para acceso
  fotos_base64?: string[];
  acepta_terminos?: boolean;
  password?: string;
  confirm_password?: string;
}

export interface SolicitudPendiente {
  id: number;
  nombres: string;
  apellidos: string;
  documento_identidad: string;
  email: string;
  telefono: string;
  numero_unidad?: string;
  estado: 'PENDIENTE' | 'APROBADA' | 'RECHAZADA';
  fecha_solicitud: string;
  observaciones?: string;
  motivo_rechazo?: string;
  // NUEVO: Reconocimiento facial
  fotos_reconocimiento_urls?: string[];
  tiene_reconocimiento_facial?: boolean;
}

export interface PropietarioRegistrado {
  id: number;
  persona: {
    id: number;
    nombre: string;
    apellido: string;
    documento_identidad: string;
    email: string;
    telefono: string;
    fecha_nacimiento: string;
    genero: string;
    direccion: string;
    nombre_completo: string;
  };
  unidades: Array<{
    numero: string;
    tipo: string;
    tiene_inquilino: boolean;
  }>;
  fecha_registro: string;
  activo: boolean;
}

// ============================================================================
// SERVICIOS DE PROPIETARIOS
// ============================================================================

export const propietariosService = {
  
  /**
   * Registro inicial de propietario (solicitud)
   */
  async registroInicial(data: SolicitudRegistroPropietario): Promise<ApiResponse<{ mensaje: string; solicitud_id: number }>> {
    try {
      console.log('📝 Propietarios: Enviando solicitud de registro...', data.email);
      
      // Transformar los datos al formato que espera el backend según la guía actualizada
      const backendData = {
        // Campos de persona (formato actualizado)
        primer_nombre: data.nombres.split(' ')[0] || data.nombres,
        primer_apellido: data.apellidos.split(' ')[0] || data.apellidos,
        cedula: data.documento_identidad,
        email: data.email,
        telefono: data.telefono,
        fecha_nacimiento: data.fecha_nacimiento,
        genero: data.genero === 'masculino' ? 'M' : data.genero === 'femenino' ? 'F' : 'M',
        
        // Campos de usuario (requeridos por el backend)
        password: 'TempPass123!', // Contraseña temporal más segura
        confirm_password: 'TempPass123!',
        
        // Campo de propiedad actualizado
        numero_casa: data.numero_unidad || '',
        observaciones: data.observaciones || ''
      };
      
      console.log('📝 Propietarios: Datos transformados para backend:', backendData);
      
      // NUEVO ENDPOINT: Usar el endpoint actualizado con reconocimiento facial
      const response = await apiClient.post<{ mensaje: string; solicitud_id: number }>(
        '/api/authz/propietarios/registrar-solicitud/',
        {
          ...backendData,
          // Agregar campos requeridos para reconocimiento facial
          fotos_base64: data.fotos_base64 || [],
          acepta_terminos: data.acepta_terminos || true
        }
      );
      
      console.log('✅ Propietarios: Solicitud enviada exitosamente');
      return response;
    } catch (error: any) {
      console.error('❌ Propietarios: Error enviando solicitud:', error);
      throw error;
    }
  },

  /**
   * Obtener solicitudes pendientes (solo admin)
   */
  async getSolicitudesPendientes(): Promise<ApiResponse<SolicitudPendiente[]>> {
    try {
      console.log('📋 Propietarios: Cargando solicitudes pendientes...');
      
      const response = await apiClient.get<SolicitudPendiente[]>(
        '/authz/propietarios/admin/solicitudes/'
      );
      
      console.log('✅ Propietarios: Solicitudes cargadas');
      return response;
    } catch (error: any) {
      console.error('❌ Propietarios: Error cargando solicitudes:', error);
      throw error;
    }
  },

  /**
   * Obtener detalle de una solicitud específica
   */
  async getDetalleSolicitud(solicitudId: number): Promise<ApiResponse<SolicitudPendiente>> {
    try {
      console.log('🔍 Propietarios: Cargando detalle solicitud...', solicitudId);
      
      const response = await apiClient.get<SolicitudPendiente>(
        `/authz/propietarios/admin/solicitudes/${solicitudId}/`
      );
      
      console.log('✅ Propietarios: Detalle cargado');
      return response;
    } catch (error: any) {
      console.error('❌ Propietarios: Error cargando detalle:', error);
      throw error;
    }
  },

  /**
   * Obtener todas las solicitudes (para historial)
   */
  async obtenerTodasLasSolicitudes(): Promise<ApiResponse<SolicitudPendiente[]>> {
    try {
      console.log('📋 Propietarios: Obteniendo todas las solicitudes...');
      
      const response = await apiClient.get<SolicitudPendiente[]>(
        '/authz/propietarios/admin/solicitudes/?incluir_todas=true'
      );
      
      console.log('✅ Propietarios: Todas las solicitudes obtenidas:', response.data?.length || 0);
      return response;
    } catch (error: any) {
      console.error('❌ Propietarios: Error obteniendo todas las solicitudes:', error);
      throw error;
    }
  },

  /**
   * Aprobar solicitud de propietario - CON ENVÍO AUTOMÁTICO DE EMAIL
   * Usa el endpoint del backend que ya tiene configurado el envío de emails
   */
  async aprobarSolicitud(solicitudId: number, observaciones?: string): Promise<ApiResponse<{ 
    mensaje: string;
    data?: {
      email_propietario: string;
      password_temporal: string;
      usuario_creado: boolean;
      email_enviado: boolean;
    }
  }>> {
    try {
      console.log('📧 Propietarios: Aprobando solicitud con envío automático de email...', solicitudId);
      
      // USAR ENDPOINT CORRECTO DEL BACKEND QUE ENVÍA EMAILS
      const response = await apiClient.post<{ 
        mensaje: string;
        data?: {
          email_propietario: string;
          password_temporal: string;
          usuario_creado: boolean;
          email_enviado: boolean;
        }
      }>(
        `/authz/propietarios/admin/solicitudes/${solicitudId}/aprobar/`,
        { 
          observaciones_aprobacion: observaciones || 'Solicitud aprobada por el administrador'
        }
      );
      
      // Debug: Mostrar toda la respuesta del backend
      console.log('🔍 Propietarios: Respuesta completa del backend:', response);
      console.log('🔍 Propietarios: Success flag:', response.success);
      console.log('🔍 Propietarios: Message:', response.message);
      
      // Análisis detallado de la estructura de respuesta
      console.log('🔍 Propietarios: response.data existe?', !!response.data);
      console.log('🔍 Propietarios: Tipo de response.data:', typeof response.data);
      console.log('🔍 Propietarios: Keys en response.data:', Object.keys(response.data || {}));
      
      // Verificar si la respuesta tiene la estructura esperada
      if (response.data?.data) {
        console.log('🔍 Propietarios: Keys en response.data.data:', Object.keys(response.data.data));
        console.log('🔍 Propietarios: email_enviado value:', response.data.data.email_enviado);
        console.log('🔍 Propietarios: email_enviado type:', typeof response.data.data.email_enviado);
        console.log('🔍 Propietarios: email_propietario:', response.data.data.email_propietario);
        console.log('🔍 Propietarios: password_temporal:', response.data.data.password_temporal);
        console.log('🔍 Propietarios: usuario_creado:', response.data.data.usuario_creado);
      } else {
        console.warn('⚠️ Propietarios: La respuesta no tiene la estructura esperada para email');
        console.warn('⚠️ Propietarios: Keys en response.data:', Object.keys(response.data || {}));
        console.warn('⚠️ Propietarios: Verificando si email_enviado está en otro lugar...');
        console.warn('⚠️ Propietarios: response.data completo:', JSON.stringify(response.data, null, 2));
      }
      
      if (response.data?.data?.email_enviado) {
        console.log('✅ Propietarios: Solicitud aprobada y email enviado exitosamente');
        console.log('📧 Email enviado a:', response.data.data.email_propietario);
        console.log('🔑 Contraseña temporal:', response.data.data.password_temporal);
      } else {
        console.warn('⚠️ Propietarios: Solicitud aprobada pero el email puede no haberse enviado');
        console.warn('⚠️ Campo email_enviado:', response.data?.data?.email_enviado);
        console.warn('⚠️ Respuesta data completa:', response.data?.data);
        console.warn('⚠️ PROBLEMA: El backend no está devolviendo el campo email_enviado correctamente');
        console.warn('⚠️ Esto indica que el backend no está configurado para enviar emails');
      }
      
      return response;
    } catch (error: any) {
      console.error('❌ Propietarios: Error aprobando solicitud:', error);
      throw error;
    }
  },

  /**
   * Rechazar solicitud de propietario
   */
  async rechazarSolicitud(solicitudId: number, motivo: string): Promise<ApiResponse<{ mensaje: string }>> {
    try {
      console.log('❌ Propietarios: Rechazando solicitud...', solicitudId);
      
      const response = await apiClient.post<{ mensaje: string }>(
        `/authz/propietarios/admin/solicitudes/${solicitudId}/rechazar/`,
        { motivo_rechazo: motivo }
      );
      
      console.log('✅ Propietarios: Solicitud rechazada');
      return response;
    } catch (error: any) {
      console.error('❌ Propietarios: Error rechazando solicitud:', error);
      throw error;
    }
  },

  /**
   * Obtener propietarios registrados
   */
  async getPropietarios(): Promise<ApiResponse<PropietarioRegistrado[]>> {
    try {
      console.log('👥 Propietarios: Cargando propietarios registrados...');
      
      const response = await apiClient.get<PropietarioRegistrado[]>(
        '/authz/propietarios/'
      );
      
      console.log('✅ Propietarios: Lista cargada');
      return response;
    } catch (error: any) {
      console.error('❌ Propietarios: Error cargando propietarios:', error);
      throw error;
    }
  },

  /**
   * Test para verificar configuración de email del backend
   */
  async testEmailConfiguration(): Promise<ApiResponse<{ 
    email_configured: boolean; 
    smtp_settings: any; 
    test_email_sent?: boolean;
    error?: string;
  }>> {
    try {
      console.log('🧪 Propietarios: Probando configuración de email del backend...');
      
      const response = await apiClient.get<{ 
        email_configured: boolean; 
        smtp_settings: any; 
        test_email_sent?: boolean;
        error?: string;
      }>('/authz/test-email-config/');
      
      console.log('🧪 Propietarios: Resultado test email:', response.data);
      return response;
    } catch (error: any) {
      console.error('❌ Propietarios: Error probando email config:', error);
      console.error('❌ Esto puede indicar que el endpoint de prueba no existe en el backend');
      throw error;
    }
  },

  /**
   * Enviar email de prueba
   */
  async sendTestEmail(email: string): Promise<ApiResponse<{ 
    success: boolean; 
    message: string;
    email_sent: boolean;
  }>> {
    try {
      console.log('📧 Propietarios: Enviando email de prueba a:', email);
      
      const response = await apiClient.post<{ 
        success: boolean; 
        message: string;
        email_sent: boolean;
      }>('/authz/send-test-email/', { email_destino: email });
      
      console.log('📧 Propietarios: Resultado email de prueba:', response.data);
      return response;
    } catch (error: any) {
      console.error('❌ Propietarios: Error enviando email de prueba:', error);
      throw error;
    }
  },

  /**
   * Subir fotos adicionales para reconocimiento facial
   * CORREGIDO según recomendaciones del backend
   */
  async subirFotosReconocimiento(usuarioId: string | number, fotos: File[]): Promise<ApiResponse<{ 
    fotos_urls: string[];
    total_fotos: number;
    mensaje: string;
  }>> {
    try {
      console.log('📸 Propietarios: Subiendo fotos de reconocimiento para usuario:', usuarioId);
      console.log('📸 Propietarios: Número de fotos:', fotos.length);
      
      // 1. CORRECTO: Usar FormData según documentación del backend
      if (fotos.length === 0) {
        throw new Error('No se seleccionaron fotos para subir');
      }
      
      console.log('📸 Fotos seleccionadas:', fotos.map(f => `${f.name} (${(f.size / 1024 / 1024).toFixed(2)}MB)`));
      console.log('📸 Usando endpoint: /api/authz/propietarios/subir-foto/ (BACKEND CONFIRMADO)');

      // 3. Obtener token de autenticación
      const token = localStorage.getItem('access_token') || 
                   localStorage.getItem('authToken') || 
                   sessionStorage.getItem('access_token') ||
                   sessionStorage.getItem('authToken');
      
      console.log('🔐 Token encontrado:', token ? 'Sí' : 'No');
      
      if (!token) {
        throw new Error('No se encontró token de autenticación. Por favor, inicia sesión nuevamente.');
      }
      
      console.log('🔄 Propietarios: Preparando subida de múltiples fotos...');
      console.log(`📸 Total fotos a subir: ${fotos.length}`);
      
      // 4. SUBIR MÚLTIPLES FOTOS: Una petición por cada foto
      const fotosSubidas: string[] = [];
      const errores: string[] = [];
      
      for (let i = 0; i < fotos.length; i++) {
        const foto = fotos[i];
        console.log(`📤 Subiendo foto ${i + 1}/${fotos.length}: ${foto.name}`);
        
        try {
          const formData = new FormData();
          formData.append('foto', foto);
          
          const fetchResponse = await fetch('http://localhost:8000/api/authz/propietarios/subir-foto/', {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${token}`
              // NO Content-Type - FormData lo maneja automáticamente
            },
            body: formData
          });
          
          // Verificar respuesta individual
          if (!fetchResponse.ok) {
            const errorData = await fetchResponse.json().catch(() => ({}));
            console.error(`❌ Error subiendo foto ${i + 1}:`, errorData);
            errores.push(`Foto ${i + 1} (${foto.name}): ${errorData.detail || fetchResponse.statusText}`);
            continue;
          }
          
          // Procesar respuesta exitosa
          const data = await fetchResponse.json();
          console.log(`✅ Foto ${i + 1} subida exitosamente:`, data);
          
          if (data.success && data.data && data.data.foto_url) {
            fotosSubidas.push(data.data.foto_url);
            console.log(`🎉 URL Dropbox ${i + 1}:`, data.data.foto_url);
          } else {
            errores.push(`Foto ${i + 1} (${foto.name}): No se recibió URL de Dropbox`);
          }
          
        } catch (fotoError: any) {
          console.error(`❌ Error procesando foto ${i + 1}:`, fotoError);
          errores.push(`Foto ${i + 1} (${foto.name}): ${fotoError.message}`);
        }
      }
      
      // 5. Evaluar resultados de múltiples subidas
      console.log(`📊 RESUMEN SUBIDA MÚLTIPLE:`);
      console.log(`   ✅ Fotos subidas exitosamente: ${fotosSubidas.length}/${fotos.length}`);
      console.log(`   ❌ Fotos con errores: ${errores.length}`);
      
      if (errores.length > 0) {
        console.log('❌ ERRORES DETALLADOS:');
        errores.forEach(error => console.log(`   • ${error}`));
      }
      
      if (fotosSubidas.length > 0) {
        console.log('✅ URLs DE DROPBOX GENERADAS:');
        fotosSubidas.forEach((url, index) => {
          console.log(`   📸 Foto ${index + 1}: ${url}`);
          console.log(`   🔗 Es Dropbox: ${url.includes('dropbox') ? 'SÍ ✅' : 'NO ❌'}`);
        });
      }
      
      // 6. Verificar si al menos una foto se subió
      if (fotosSubidas.length === 0) {
        const mensajeError = errores.length > 0 ? 
          `No se pudo subir ninguna foto: ${errores.join('; ')}` :
          'Error desconocido: No se subieron fotos';
        throw new Error(mensajeError);
      }
      
      // 7. Si hay errores parciales, mostrarlos pero continuar
      let mensajeRespuesta = `${fotosSubidas.length} foto(s) subida(s) exitosamente a Dropbox`;
      if (errores.length > 0) {
        mensajeRespuesta += `. ${errores.length} foto(s) fallaron: ${errores.join('; ')}`;
      }
      
      // 8. Respuesta adaptada para múltiples fotos
      const response = {
        success: true,
        data: {
          fotos_urls: fotosSubidas, // Array completo de URLs subidas
          total_fotos: fotosSubidas.length,
          mensaje: mensajeRespuesta,
          fotos_exitosas: fotosSubidas.length,
          fotos_fallidas: errores.length,
          errores_detalle: errores.length > 0 ? errores : undefined
        },
        message: mensajeRespuesta
      };
      
      console.log('✅ Propietarios: MÚLTIPLES FOTOS subidas exitosamente:', response.data);
      console.log(`🎉 TOTAL URLs de Dropbox generadas: ${fotosSubidas.length}`);
      return response;
    } catch (error: any) {
      console.error('❌ Propietarios: Error subiendo fotos:', error);
      throw error;
    }
  },

  /**
   * 🎉 Obtener MIS fotos de reconocimiento facial - ENDPOINT CORRECTO SEGÚN BACKEND
   * ✅ Usa el endpoint del backend: GET /api/authz/propietarios/mis-fotos/
   */
  async obtenerFotosReconocimiento(usuarioId: string | number): Promise<ApiResponse<{
    fotos_urls: string[];
    total_fotos: number;
    fecha_ultima_actualizacion?: string;
    tiene_reconocimiento?: boolean;
    usuario_email?: string;
    propietario_nombre?: string;
  }>> {
    try {
      console.log('🎉 Propietarios: Obteniendo MIS fotos desde ENDPOINT BACKEND CORRECTO');
      
      const fetchResponse = await fetch(`http://localhost:8000/api/authz/propietarios/mis-fotos/`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('access_token') || sessionStorage.getItem('access_token')}`,
          'Content-Type': 'application/json'
        }
      });

      if (!fetchResponse.ok) {
        if (fetchResponse.status === 404) {
          console.log('📸 Usuario no tiene fotos de reconocimiento registradas');
          return {
            success: true,
            data: {
              fotos_urls: [],
              total_fotos: 0,
              tiene_reconocimiento: false
            },
            message: 'Usuario no tiene fotos de reconocimiento'
          };
        }
        
        if (fetchResponse.status === 403) {
          throw new Error('No tienes permisos para ver estas fotos');
        }
        
        const errorData = await fetchResponse.json().catch(() => ({ error: 'Error desconocido' }));
        throw new Error(`Error ${fetchResponse.status}: ${errorData.error || fetchResponse.statusText}`);
      }

      const data = await fetchResponse.json();
      console.log('✅ GET MIS FOTOS: Respuesta del endpoint:', data);
      console.log('🔍 GET MIS FOTOS: Estructura completa de la respuesta:', JSON.stringify(data, null, 2));
      
      // DEBUG ESPECÍFICO PARA URLS - Según documentación del backend
      if (data.success && data.data) {
        console.log('🎉 GET MIS FOTOS: Respuesta exitosa del backend');
        
        // El backend puede devolver diferentes estructuras, verificamos todas
        const fotosUrls = data.data.fotos_urls || data.data.fotos || [];
        
        if (fotosUrls && fotosUrls.length > 0) {
          console.log('📸 GET MIS FOTOS: ¡URLs de Dropbox encontradas!');
          console.log('📸 GET MIS FOTOS: Cantidad de URLs:', fotosUrls.length);
          fotosUrls.forEach((url: string, index: number) => {
            console.log(`📸 GET MIS FOTOS: URL ${index + 1}: ${url}`);
            console.log(`📸 GET MIS FOTOS: Es Dropbox? ${url.includes('dropbox') ? 'SÍ ✅' : 'NO ❌'}`);
          });
        } else {
          console.log('📸 GET MIS FOTOS: Usuario no tiene fotos aún');
        }
      } else {
        console.log('❌ GET MIS FOTOS: Respuesta no exitosa o sin data');
        console.log('❌ GET MIS FOTOS: data.success:', data.success);
        console.log('❌ GET MIS FOTOS: data.data existe?', !!data.data);
        console.log('❌ GET MIS FOTOS: data.data keys:', data.data ? Object.keys(data.data) : 'N/A');
      }

      if (data.success && data.data) {
        // Procesar fotos_urls según documentación del backend
        const fotosUrls = data.data.fotos_urls || data.data.fotos || [];
        
        const response: ApiResponse<{
          fotos_urls: string[];
          total_fotos: number;
          fecha_ultima_actualizacion?: string;
          tiene_reconocimiento?: boolean;
          usuario_email?: string;
          propietario_nombre?: string;
        }> = {
          success: true,
          data: {
            fotos_urls: fotosUrls,
            total_fotos: fotosUrls.length || data.data.total_fotos || 0,
            fecha_ultima_actualizacion: data.data.fecha_ultima_actualizacion,
            tiene_reconocimiento: fotosUrls.length > 0,
            usuario_email: data.data.usuario_email,
            propietario_nombre: data.data.propietario_nombre
          },
          message: data.message || data.mensaje || 'Fotos obtenidas correctamente'
        };
        
        console.log(`✅ Usuario ${usuarioId} tiene ${response.data.total_fotos} fotos de reconocimiento`);
        return response;
      } else {
        console.log('📸 Respuesta no exitosa del endpoint:', data);
        return {
          success: true,
          data: {
            fotos_urls: [],
            total_fotos: 0,
            tiene_reconocimiento: false
          },
          message: 'No se encontraron fotos de reconocimiento'
        };
      }
      
    } catch (error: any) {
      console.error('❌ Propietarios: Error obteniendo fotos:', error);
      
      // Para errores de permisos, lanzar el error
      if (error.message.includes('permisos')) {
        throw error;
      }
      
      // Para otros errores, retornar datos vacíos
      return {
        success: true,
        data: {
          fotos_urls: [],
          total_fotos: 0,
          tiene_reconocimiento: false
        },
        message: 'Error al obtener fotos de reconocimiento'
      };
    }
  }
};

export default propietariosService;