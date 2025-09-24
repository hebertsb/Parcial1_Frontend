/**
 * Servicios para gestión de inquilinos
 * Maneja registro y gestión de inquilinos por parte de propietarios
 */

import { apiClient } from '@/core/api/client';
import type { ApiResponse } from '@/core/types';

// ============================================================================
// TIPOS ESPECÍFICOS PARA INQUILINOS
// ============================================================================

export interface RegistroInquilinoData {
  // Información personal
  nombre: string;
  apellido: string;
  documento_identidad: string;
  email: string;
  telefono: string;
  fecha_nacimiento: string;
  genero: 'M' | 'F';
  
  // Información del contrato
  vivienda_id?: number;
  fecha_inicio: string;
  fecha_fin?: string;
  monto_alquiler: number;
  observaciones?: string;
}

export interface InquilinoRegistrado {
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
  };
  numero_unidad: string;
  tipo_unidad: string;
  fecha_registro: string;
  activo: boolean;
  observaciones?: string;
}

// ============================================================================
// SERVICIOS DE INQUILINOS
// ============================================================================

/**
 * Registra un nuevo inquilino directamente (sin aprobación del admin)
 */
export async function registrarInquilino(
  data: RegistroInquilinoData
): Promise<ApiResponse<InquilinoRegistrado>> {
  console.log('📝 Inquilinos: Registrando inquilino...', data.email);
  
  try {
    // Transformar datos al formato esperado por el backend según la guía actualizada
    const payload = {
      persona: {
        nombre: data.nombre,
        apellido: data.apellido,
        documento_identidad: data.documento_identidad,
        fecha_nacimiento: data.fecha_nacimiento,
        telefono: data.telefono,
        email: data.email,
        genero: data.genero,
      },
      vivienda_id: data.vivienda_id || 15, // Valor por defecto o del contexto del propietario
      fecha_inicio: data.fecha_inicio,
      fecha_fin: data.fecha_fin || null,
      monto_alquiler: data.monto_alquiler,
      observaciones: data.observaciones || '',
    };

    // Usar endpoint correcto según la guía
    const response = await apiClient.post<InquilinoRegistrado>(
      '/api/authz/propietarios/panel/inquilinos/',
      payload
    );

    console.log('✅ Inquilinos: Inquilino registrado exitosamente');
    return response;
    
  } catch (error) {
    console.error('❌ Inquilinos: Error registrando inquilino:', error);
    throw error;
  }
}

/**
 * Obtiene la lista de inquilinos del propietario actual
 */
export async function getInquilinosPropios(): Promise<ApiResponse<InquilinoRegistrado[]>> {
  console.log('📝 Inquilinos: Obteniendo inquilinos propios...');
  
  try {
    // Usar endpoint correcto según la guía actualizada
    const response = await apiClient.get<InquilinoRegistrado[]>(
      '/api/authz/propietarios/panel/inquilinos/'
    );

    console.log('✅ Inquilinos: Lista de inquilinos obtenida');
    return response;
    
  } catch (error) {
    console.error('❌ Inquilinos: Error obteniendo inquilinos:', error);
    throw error;
  }
}

/**
 * Actualiza información de un inquilino
 */
export async function actualizarInquilino(
  inquilinoId: number,
  data: Partial<RegistroInquilinoData>
): Promise<ApiResponse<InquilinoRegistrado>> {
  console.log('📝 Inquilinos: Actualizando inquilino...', inquilinoId);
  
  try {
    const payload = {
      ...data,
      genero: data.genero, // Ya está en formato correcto M/F
    };

    const response = await apiClient.put<InquilinoRegistrado>(
      `/api/authz/inquilinos/${inquilinoId}/`,
      payload
    );

    console.log('✅ Inquilinos: Inquilino actualizado exitosamente');
    return response;
    
  } catch (error) {
    console.error('❌ Inquilinos: Error actualizando inquilino:', error);
    throw error;
  }
}

/**
 * Desactiva un inquilino (no lo elimina, solo lo marca como inactivo)
 */
export async function desactivarInquilino(inquilinoId: number): Promise<ApiResponse<void>> {
  console.log('📝 Inquilinos: Desactivando inquilino...', inquilinoId);
  
  try {
    const response = await apiClient.patch<void>(
      `/api/authz/inquilinos/${inquilinoId}/desactivar/`
    );

    console.log('✅ Inquilinos: Inquilino desactivado exitosamente');
    return response;
    
  } catch (error) {
    console.error('❌ Inquilinos: Error desactivando inquilino:', error);
    throw error;
  }
}

// ============================================================================
// UTILIDADES
// ============================================================================

/**
 * Genera una contraseña temporal para el inquilino
 * En un sistema real, esto se haría en el backend
 */
function generateTemporaryPassword(): string {
  return Math.random().toString(36).slice(-8);
}