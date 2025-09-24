/**
 * Servicio para envío de emails con credenciales
 * Maneja notificaciones por email para usuarios registrados
 */

import { apiClient } from '@/core/api/client';
import type { ApiResponse } from '@/core/types';

// ============================================================================
// TIPOS PARA EMAIL SERVICE
// ============================================================================

export interface EmailCredentialsData {
  email: string;
  nombres: string;
  apellidos: string;
  usuario_temporal: string;
  password_temporal: string;
  tipo_usuario: 'propietario' | 'inquilino';
}

export interface EmailNotificationData {
  email: string;
  nombres: string;
  apellidos: string;
  tipo_notificacion: 'registro_aprobado' | 'registro_rechazado' | 'credenciales_enviadas';
  mensaje_adicional?: string;
}

export interface EmailResponse {
  mensaje: string;
  email_enviado: boolean;
  fecha_envio: string;
}

// ============================================================================
// SERVICIOS DE EMAIL
// ============================================================================

/**
 * Envía credenciales de acceso por email después del registro
 */
export async function enviarCredencialesPorEmail(
  data: EmailCredentialsData
): Promise<ApiResponse<EmailResponse>> {
  console.log('📧 Enviando credenciales por email...', data.email);
  
  try {
    const response = await apiClient.post<ApiResponse<EmailResponse>>(
      '/api/authz/notificaciones/enviar-credenciales/',
      {
        destinatario: data.email,
        datos_usuario: {
          nombres: data.nombres,
          apellidos: data.apellidos,
          usuario_temporal: data.usuario_temporal,
          password_temporal: data.password_temporal,
          tipo_usuario: data.tipo_usuario
        },
        plantilla: 'credenciales_acceso'
      }
    );

    console.log('✅ Credenciales enviadas exitosamente');
    return response.data;
    
  } catch (error) {
    console.error('❌ Error enviando credenciales:', error);
    throw error;
  }
}

/**
 * Envía notificación de estado de solicitud
 */
export async function enviarNotificacionEstado(
  data: EmailNotificationData
): Promise<ApiResponse<EmailResponse>> {
  console.log('📧 Enviando notificación de estado...', data.email);
  
  try {
    const response = await apiClient.post<ApiResponse<EmailResponse>>(
      '/api/authz/notificaciones/estado-solicitud/',
      {
        destinatario: data.email,
        datos_usuario: {
          nombres: data.nombres,
          apellidos: data.apellidos
        },
        tipo_notificacion: data.tipo_notificacion,
        mensaje_adicional: data.mensaje_adicional,
        plantilla: `estado_${data.tipo_notificacion}`
      }
    );

    console.log('✅ Notificación enviada exitosamente');
    return response.data;
    
  } catch (error) {
    console.error('❌ Error enviando notificación:', error);
    throw error;
  }
}

/**
 * Solicita reenvío de credenciales
 */
export async function reenviarCredenciales(
  email: string
): Promise<ApiResponse<EmailResponse>> {
  console.log('📧 Reenviando credenciales...', email);
  
  try {
    const response = await apiClient.post<ApiResponse<EmailResponse>>(
      '/api/authz/notificaciones/reenviar-credenciales/',
      {
        email
      }
    );

    console.log('✅ Credenciales reenviadas exitosamente');
    return response.data;
    
  } catch (error) {
    console.error('❌ Error reenviando credenciales:', error);
    throw error;
  }
}

/**
 * Genera credenciales temporales para un usuario
 */
export async function generarCredencialesTemporales(
  usuarioId: number,
  tipoUsuario: 'propietario' | 'inquilino'
): Promise<ApiResponse<{
  usuario_temporal: string;
  password_temporal: string;
  fecha_expiracion: string;
}>> {
  console.log('🔑 Generando credenciales temporales...');
  
  try {
    const response = await apiClient.post<ApiResponse<{
      usuario_temporal: string;
      password_temporal: string;
      fecha_expiracion: string;
    }>>(
      '/api/authz/credenciales/generar-temporales/',
      {
        usuario_id: usuarioId,
        tipo_usuario: tipoUsuario,
        vigencia_dias: 7 // Credenciales válidas por 7 días
      }
    );

    console.log('✅ Credenciales temporales generadas');
    return response.data;
    
  } catch (error) {
    console.error('❌ Error generando credenciales:', error);
    throw error;
  }
}