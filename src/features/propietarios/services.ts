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
  }
};

export default propietariosService;