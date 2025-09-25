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
  
  // Credenciales de acceso
  username?: string;
  password?: string;
  
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

export interface InquilinosListResponse {
  count: number;
  inquilinos: InquilinoRegistrado[];
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
    // Generar credenciales si no se proporcionaron
    const username = data.username || data.email;
    const password = data.password || generateTemporaryPassword();
    
    console.log('🔥 Registrando inquilino con datos:', { 
      ...data, 
      credenciales: { username, password } 
    });
    
    // Transformar datos al formato esperado por el backend corregido
    const payload = {
      // Datos personales básicos
      nombre: data.nombre,
      apellido: data.apellido,
      documento_identidad: data.documento_identidad,
      fecha_nacimiento: data.fecha_nacimiento,
      telefono: data.telefono,
      email: data.email,
      genero: data.genero,
      // Credenciales (requeridas por el backend actualizado)
      password: password,
      confirm_password: password,
      // Datos del contrato
      fecha_inicio: data.fecha_inicio,
      fecha_fin: data.fecha_fin || null,
      monto_alquiler: data.monto_alquiler,
      observaciones: data.observaciones || '',
      // Datos de la vivienda si están disponibles
      ...(data.vivienda_id && { vivienda_id: data.vivienda_id })
    };

    console.log('🔐 Inquilinos: Credenciales generadas para inquilino:', { username, password });
    console.log('📦 Inquilinos: Payload enviado al backend:', JSON.stringify(payload, null, 2));
    console.log('🌐 Inquilinos: URL del endpoint:', '/authz/propietarios/panel/inquilinos/');
    console.log('🔑 Inquilinos: Token de autorización:', 
      localStorage.getItem('access_token') ? 'Token encontrado' : 'NO HAY TOKEN',
      localStorage.getItem('access_token')?.substring(0, 50) + '...'
    );

    // Usar endpoint real - el backend ya corrigió el error tipo_usuario
    console.log('🔄 Inquilinos: Enviando al backend corregido...');
    const response = await apiClient.post<InquilinoRegistrado>(
      '/authz/propietarios/panel/inquilinos/',
      payload
    );

    console.log('📋 Inquilinos: Respuesta del backend:', response);

    // Verificar si la respuesta es exitosa
    if (!response.success) {
      console.error('❌ Inquilinos: Error del backend:', response.message);
      console.error('❌ Inquilinos: Errores de validación:', response.errors);
      
      // Crear error con información detallada del backend
      const error = new Error(response.message || 'Error registrando inquilino');
      (error as any).errors = response.errors;
      throw error;
    }

    console.log('✅ Inquilinos: Inquilino registrado exitosamente');
    return response;
    
  } catch (error) {
    console.error('❌ Inquilinos: Error registrando inquilino:', error);
    if (error instanceof Error) {
      console.error('❌ Inquilinos: Mensaje de error:', error.message);
      console.error('❌ Inquilinos: Stack trace:', error.stack);
    }
    console.error('❌ Inquilinos: Error completo:', JSON.stringify(error, null, 2));
    throw error;
  }
}

/**
 * Obtiene la lista de inquilinos del propietario actual
 */
export async function getInquilinosPropios(): Promise<ApiResponse<InquilinoRegistrado[]>> {
  console.log('📝 Inquilinos: Obteniendo inquilinos propios...');
  
  try {
    // Usar endpoint correcto - sin /api inicial porque ya está en BASE_URL
    const response = await apiClient.get<InquilinosListResponse>(
      '/authz/propietarios/panel/inquilinos/'
    );

    console.log('✅ Inquilinos: Lista de inquilinos obtenida');
    // Extraer solo el array de inquilinos de la respuesta
    return {
      ...response,
      data: response.data.inquilinos
    };
    
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
      `/authz/propietarios/panel/inquilinos/${inquilinoId}/`,
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
      `/authz/propietarios/panel/inquilinos/${inquilinoId}/desactivar/`
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
 * Combina letras y números para mayor seguridad
 */
function generateTemporaryPassword(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let password = '';
  for (let i = 0; i < 8; i++) {
    password += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return password;
}