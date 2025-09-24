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
      
      const response = await apiClient.post<{ mensaje: string; solicitud_id: number }>(
        '/authz/propietarios/solicitud/',
        backendData
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
   * Aprobar solicitud de propietario
   */
  async aprobarSolicitud(solicitudId: number, observaciones?: string): Promise<ApiResponse<{ mensaje: string }>> {
    try {
      console.log('✅ Propietarios: Aprobando solicitud...', solicitudId);
      
      const response = await apiClient.post<{ mensaje: string }>(
        `/authz/propietarios/admin/solicitudes/${solicitudId}/aprobar/`,
        { observaciones }
      );
      
      console.log('✅ Propietarios: Solicitud aprobada exitosamente');
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
  }
};

export default propietariosService;