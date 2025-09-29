/**
 * Servicio de reconocimiento facial para el personal de seguridad
 * ✅ BASADO EN LA GUÍA OFICIAL - APIs YA IMPLEMENTADAS EN EL BACKEND
 * 
 * Endpoints disponibles según GUIA_RECONOCIMIENTO_FACIAL_GUARDIA.txt:
 * - POST /api/seguridad/reconocimiento-facial/
 * - GET /api/seguridad/lista-usuarios-activos/
 * - GET /api/seguridad/buscar-usuarios/?q=termino
 * - GET /api/seguridad/estadisticas/
 * - GET /api/seguridad/panel-guardia/ (interfaz HTML)
 */

import { apiClient } from '@/core/api/client';

export interface ReconocimientoResponse {
  reconocido: boolean;
  persona?: {
    id: number;
    nombre: string;
    apellido: string;
    documento_identidad: string;
    numero_casa: string;
    telefono?: string;
    email?: string;
    tipo_residente: string;
    foto_perfil?: string;
  };
  confianza: number;
  mensaje: string;
  hora_acceso: string;
  fecha_acceso: string;
}

export interface UsuarioActivo {
  id: number;
  nombre: string;
  apellido: string;
  documento_identidad: string;
  numero_casa: string;
  telefono?: string;
  email?: string;
  tipo_residente: string;
  foto_perfil?: string;
  reconocimiento_facial_activo: boolean;
  fecha_registro: string;
  tipo_usuario: string;
}

export interface EstadisticasGuardia {
  usuarios_enrolados: number;
  accesos_hoy: number;
  accesos_exitosos_hoy: number;
  accesos_fallidos_hoy: number;
  ultimo_acceso: string;
  usuarios_activos_hoy: number;
}

export const reconocimientoSeguridadService = {
  /**
   * Procesar reconocimiento facial desde imagen
   */
  async procesarReconocimiento(imagenBase64: string): Promise<{ 
    success: boolean; 
    data?: ReconocimientoResponse; 
    error?: string 
  }> {
    try {
      console.log('🔍 Procesando reconocimiento facial...');
      
      const response = await fetch('http://localhost:8000/api/authz/seguridad/reconocimiento-facial/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
        },
        body: JSON.stringify({ imagen: imagenBase64 }),
      });

      if (response.ok) {
        const data: ReconocimientoResponse = await response.json();
        console.log('✅ Reconocimiento exitoso:', data);
        return { success: true, data };
      } else {
        const errorData = await response.json();
        console.error('❌ Error en reconocimiento:', errorData);
        return { 
          success: false, 
          error: errorData.error || `Error ${response.status}: ${response.statusText}` 
        };
      }
    } catch (error) {
      console.error('❌ Error de conexión:', error);
      return { 
        success: false, 
        error: 'Error de conexión con el servidor' 
      };
    }
  },

  /**
   * Obtener lista de usuarios con reconocimiento facial activo
   */
  async obtenerUsuariosActivos(): Promise<{ 
    success: boolean; 
    data?: { usuarios: UsuarioActivo[] }; 
    error?: string 
  }> {
    try {
      const response = await fetch('http://localhost:8000/api/authz/seguridad/lista-usuarios-activos/', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        return { success: true, data };
      } else {
        const errorData = await response.json();
        return { 
          success: false, 
          error: errorData.error || `Error ${response.status}` 
        };
      }
    } catch (error) {
      return { 
        success: false, 
        error: 'Error de conexión' 
      };
    }
  },

  /**
   * Buscar usuarios por término
   */
  async buscarUsuarios(termino: string): Promise<{ 
    success: boolean; 
    data?: { usuarios: UsuarioActivo[] }; 
    error?: string 
  }> {
    try {
      const response = await fetch(
        `http://localhost:8000/api/authz/seguridad/buscar-usuarios/?q=${encodeURIComponent(termino)}`,
        {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        return { success: true, data };
      } else {
        const errorData = await response.json();
        return { 
          success: false, 
          error: errorData.error || `Error ${response.status}` 
        };
      }
    } catch (error) {
      return { 
        success: false, 
        error: 'Error de conexión' 
      };
    }
  },

  /**
   * Obtener estadísticas para el guardia
   */
  async obtenerEstadisticas(): Promise<{ 
    success: boolean; 
    data?: EstadisticasGuardia; 
    error?: string 
  }> {
    try {
      const response = await fetch('http://localhost:8000/api/authz/seguridad/estadisticas/', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        return { success: true, data };
      } else {
        const errorData = await response.json();
        return { 
          success: false, 
          error: errorData.error || `Error ${response.status}` 
        };
      }
    } catch (error) {
      return { 
        success: false, 
        error: 'Error de conexión' 
      };
    }
  },

  /**
   * Convertir File a Base64
   */
  async convertirImagenABase64(archivo: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      
      reader.onload = () => {
        const base64 = reader.result as string;
        // Remover el prefijo "data:image/...;base64,"
        const base64Clean = base64.split(',')[1];
        resolve(base64Clean);
      };
      
      reader.onerror = (error) => {
        reject(new Error('Error leyendo el archivo: ' + error));
      };
      
      reader.readAsDataURL(archivo);
    });
  },

  /**
   * Validar archivo de imagen
   */
  validarImagen(archivo: File): { valid: boolean; error?: string } {
    const formatosPermitidos = ['image/jpeg', 'image/jpg', 'image/png'];
    const tamañoMaximo = 5 * 1024 * 1024; // 5MB

    if (!formatosPermitidos.includes(archivo.type)) {
      return { 
        valid: false, 
        error: 'Formato no válido. Solo se permiten JPG y PNG.' 
      };
    }

    if (archivo.size > tamañoMaximo) {
      return { 
        valid: false, 
        error: 'La imagen es demasiado grande. Máximo 5MB.' 
      };
    }

    return { valid: true };
  }
};

export default reconocimientoSeguridadService;