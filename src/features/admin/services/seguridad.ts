/**
 * Serv// Flag para alternar entre datos MOCK y API real
// ✅ USANDO CLIENTE ESPECÍFICO para endpoints sin /api prefix
const USE_MOCK_DATA = false; // Probar con API real usando cliente específico

console.log('� Modo seguridad: USANDO API REAL (cliente específico sin /api)'); para gestión de usuarios de seguridad
 * Según la guía del backend: GUIA_COMPLETA_GESTION_USUARIOS_SEGURIDAD.txt
 * 
 * ⚠️ ESTADO ACTUAL: USANDO DATOS MOCK
 * El backend aún no tiene implementados los endpoints de seguridad.
 * Una vez implementados, cambiar USE_MOCK_DATA a false.
 */

import { apiClient } from '../../../core/api/client';
import type { ApiResponse } from '../../../core/types';

// Cliente específico para endpoints de seguridad (sin /api prefix)
class SeguridadApiClient {
  private baseUrl = 'http://127.0.0.1:8000'; // Confirmado por backend

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<ApiResponse<T>> {
    const url = `${this.baseUrl}${endpoint}`;
    const token = localStorage.getItem('access_token');
    
    const config: RequestInit = {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
        ...options.headers,
      },
    };

    console.log(`🔐 SeguridadApiClient: ${options.method || 'GET'} ${url}`);

    const response = await fetch(url, config);
    
    console.log(`🔐 SeguridadApiClient: Status ${response.status} - ${response.statusText}`);
    
    const data = await response.json();
    
    console.log(`🔐 SeguridadApiClient: Response data:`, data);

    if (response.ok) {
      return { success: true, data };
    } else {
      return { success: false, message: data.detail || 'Error en la petición', errors: data };
    }
  }

  async get<T>(endpoint: string): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { method: 'GET' });
  }

  async post<T>(endpoint: string, data: any): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async put<T>(endpoint: string, data: any): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async patch<T>(endpoint: string, data: any): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  }

  async delete<T>(endpoint: string): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'DELETE',
    });
  }
}

const seguridadApiClient = new SeguridadApiClient();

// Flag para alternar entre datos MOCK y API real
// Según la guía del backend, todos los endpoints están implementados
const USE_MOCK_DATA = false; // ⚠️ CAMBIADO A FALSE - Usar API real

console.log('� Modo seguridad: USANDO API REAL del backend');

// =====================
// TYPES ESPECÍFICOS PARA SEGURIDAD
// =====================

export interface CrearUsuarioSeguridadRequest {
  email: string;
  password: string;
  persona: {
    nombre: string;
    apellido: string;
    ci: string;
    telefono: string;
    direccion?: string;
  };
}

export interface UsuarioSeguridad {
  id: number;
  email: string;
  persona: {
    nombre: string;
    apellido: string;
    ci: string;
    telefono: string;
    direccion?: string;
  };
  roles: string[];
  is_active: boolean;
  date_joined: string;
}

export interface ListarUsuariosSeguridadResponse {
  count: number;
  usuarios: UsuarioSeguridad[];
}

export interface CambiarEstadoRequest {
  is_active: boolean;
}

export interface ResetPasswordRequest {
  nueva_password: string;
}

// =====================
// DATOS MOCK PARA TESTING
// =====================

let mockUsuarios: UsuarioSeguridad[] = [
  {
    id: 1,
    email: "seguridad1@condominio.com",
    persona: {
      nombre: "Juan Carlos",
      apellido: "Pérez García",
      ci: "12345678",
      telefono: "70123456",
      direccion: "Av. Principal #123"
    },
    roles: ["Seguridad"],
    is_active: true,
    date_joined: "2025-09-20T10:30:00Z"
  },
  {
    id: 2,
    email: "seguridad2@condominio.com", 
    persona: {
      nombre: "María Elena",
      apellido: "López Morales",
      ci: "87654321",
      telefono: "71234567",
      direccion: "Calle Secundaria #456"
    },
    roles: ["Seguridad"],
    is_active: true,
    date_joined: "2025-09-22T14:15:00Z"
  },
  {
    id: 3,
    email: "seguridad3@condominio.com",
    persona: {
      nombre: "Carlos Alberto", 
      apellido: "Mendoza Silva",
      ci: "11223344",
      telefono: "72345678",
      direccion: "Av. Secundaria #789"
    },
    roles: ["Seguridad"],
    is_active: false,
    date_joined: "2025-09-18T08:45:00Z"
  }
];

let nextId = 4;

// =====================  
// SERVICIOS DE GESTIÓN DE USUARIOS DE SEGURIDAD
// =====================

export const seguridadAdminService = {
  /**
   * Crear nuevo usuario de seguridad (solo administradores)
   * POST /auth/admin/seguridad/crear/
   */
  async crearUsuarioSeguridad(userData: CrearUsuarioSeguridadRequest): Promise<ApiResponse<{
    message: string;
    usuario: UsuarioSeguridad;
  }>> {
    console.log('🔐 SeguridadAdminService: Creando usuario de seguridad...', userData.email);
    
    if (USE_MOCK_DATA) {
      // Simulamos un pequeño delay para que parezca real
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Verificar si el email ya existe
      const emailExiste = mockUsuarios.some(u => u.email === userData.email);
      if (emailExiste) {
        return {
          success: false,
          message: 'El email ya está registrado',
          errors: { email: ['Un usuario con este email ya existe en el sistema'] }
        };
      }
      
      const nuevoUsuario: UsuarioSeguridad = {
        id: nextId++,
        email: userData.email,
        persona: userData.persona,
        roles: ["Seguridad"],
        is_active: true,
        date_joined: new Date().toISOString()
      };
      
      mockUsuarios.push(nuevoUsuario);
      
      return {
        success: true,
        data: {
          message: "Usuario de seguridad creado exitosamente",
          usuario: nuevoUsuario
        }
      };
    }
    
    // Adaptar formato para el backend real
    const backendData = {
      email: userData.email,
      password: userData.password,
      nombres: userData.persona.nombre,
      apellidos: userData.persona.apellido,
      documento_identidad: userData.persona.ci,
      telefono: userData.persona.telefono,
      direccion: userData.persona.direccion || ''
    };
    
    console.log('🔄 SeguridadAdminService: Datos adaptados para backend:', backendData);
    
    return seguridadApiClient.post('/auth/admin/seguridad/crear/', backendData);
  },

  /**
   * Listar todos los usuarios de seguridad (solo administradores)
   * GET /auth/admin/seguridad/listar/
   */
  async listarUsuariosSeguridad(): Promise<ApiResponse<ListarUsuariosSeguridadResponse>> {
    console.log('📋 SeguridadAdminService: Listando usuarios de seguridad...');
    
    if (USE_MOCK_DATA) {
      // Simulamos un pequeño delay para que parezca real
      await new Promise(resolve => setTimeout(resolve, 300));
      
      return {
        success: true,
        data: {
          count: mockUsuarios.length,
          usuarios: [...mockUsuarios] // Copia para evitar mutaciones
        }
      };
    }
    
    return seguridadApiClient.get('/auth/admin/seguridad/listar/');
  },

  /**
   * Cambiar estado de usuario de seguridad (activar/desactivar)
   * PUT /auth/admin/seguridad/{id}/estado/
   */
  async cambiarEstadoUsuario(userId: number, isActive: boolean): Promise<ApiResponse<{
    message: string;
    usuario: {
      id: number;
      email: string;
      is_active: boolean;
    };
  }>> {
    console.log(`🔄 SeguridadAdminService: Cambiando estado usuario ${userId} a ${isActive ? 'activo' : 'inactivo'}...`);
    
    if (USE_MOCK_DATA) {
      // Simulamos un pequeño delay para que parezca real
      await new Promise(resolve => setTimeout(resolve, 400));
      
      const usuario = mockUsuarios.find(u => u.id === userId);
      if (!usuario) {
        return {
          success: false,
          message: 'Usuario no encontrado',
          errors: { usuario: [`No se encontró un usuario con ID ${userId}`] }
        };
      }
      
      // Actualizar el estado
      usuario.is_active = isActive;
      
      return {
        success: true,
        data: {
          message: `Usuario ${isActive ? 'activado' : 'desactivado'} exitosamente`,
          usuario: {
            id: usuario.id,
            email: usuario.email,
            is_active: usuario.is_active
          }
        }
      };
    }
    
    return seguridadApiClient.put(`/auth/admin/seguridad/${userId}/estado/`, { is_active: isActive });
  },

  /**
   * Resetear contraseña de usuario de seguridad
   * POST /auth/admin/seguridad/{id}/reset-password/
   */
  async resetearPassword(userId: number, nuevaPassword: string): Promise<ApiResponse<{
    message: string;
    usuario: {
      id: number;
      email: string;
    };
  }>> {
    console.log(`🔑 SeguridadAdminService: Reseteando contraseña usuario ${userId}...`);
    
    if (USE_MOCK_DATA) {
      // Simulamos un pequeño delay para que parezca real
      await new Promise(resolve => setTimeout(resolve, 600));
      
      const usuario = mockUsuarios.find(u => u.id === userId);
      if (!usuario) {
        return {
          success: false,
          message: 'Usuario no encontrado',
          errors: { usuario: [`No se encontró un usuario con ID ${userId}`] }
        };
      }
      
      return {
        success: true,
        data: {
          message: "Contraseña reseteada exitosamente",
          usuario: {
            id: usuario.id,
            email: usuario.email
          }
        }
      };
    }
    
    return seguridadApiClient.post(`/auth/admin/seguridad/${userId}/reset-password/`, { 
      nueva_password: nuevaPassword 
    });
  },

  /**
   * Ver detalle de usuario de seguridad
   * GET /auth/admin/seguridad/{id}/
   */
  async verUsuarioSeguridad(userId: number): Promise<ApiResponse<UsuarioSeguridad>> {
    console.log(`👁️ SeguridadAdminService: Obteniendo detalle usuario ${userId}...`);
    
    if (USE_MOCK_DATA) {
      // Simulamos un pequeño delay para que parezca real
      await new Promise(resolve => setTimeout(resolve, 300));
      
      const usuario = mockUsuarios.find(u => u.id === userId);
      if (!usuario) {
        return {
          success: false,
          message: 'Usuario no encontrado',
          errors: { usuario: [`No se encontró un usuario con ID ${userId}`] }
        };
      }
      
      return {
        success: true,
        data: { ...usuario } // Copia para evitar mutaciones
      };
    }
    
    return seguridadApiClient.get(`/auth/admin/seguridad/${userId}/`);
  },

  /**
   * Editar usuario de seguridad
   * PUT /auth/admin/seguridad/{id}/
   */
  async editarUsuarioSeguridad(userId: number, userData: {
    email?: string;
    persona?: {
      nombre?: string;
      apellido?: string;
      ci?: string;
      telefono?: string;
      direccion?: string;
    };
  }): Promise<ApiResponse<{
    message: string;
    usuario: UsuarioSeguridad;
  }>> {
    console.log(`✏️ SeguridadAdminService: Editando usuario ${userId}...`, userData);
    
    if (USE_MOCK_DATA) {
      // Simulamos un pequeño delay para que parezca real
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const usuario = mockUsuarios.find(u => u.id === userId);
      if (!usuario) {
        return {
          success: false,
          message: 'Usuario no encontrado',
          errors: { usuario: [`No se encontró un usuario con ID ${userId}`] }
        };
      }

      // Verificar si el email ya existe (solo si se está cambiando)
      if (userData.email && userData.email !== usuario.email) {
        const emailExiste = mockUsuarios.some(u => u.email === userData.email && u.id !== userId);
        if (emailExiste) {
          return {
            success: false,
            message: 'El email ya está registrado',
            errors: { email: ['Un usuario con este email ya existe en el sistema'] }
          };
        }
      }
      
      // Actualizar datos del usuario
      if (userData.email) {
        usuario.email = userData.email;
      }
      
      if (userData.persona) {
        if (userData.persona.nombre) usuario.persona.nombre = userData.persona.nombre;
        if (userData.persona.apellido) usuario.persona.apellido = userData.persona.apellido;
        if (userData.persona.ci) usuario.persona.ci = userData.persona.ci;
        if (userData.persona.telefono) usuario.persona.telefono = userData.persona.telefono;
        if (userData.persona.direccion) usuario.persona.direccion = userData.persona.direccion;
      }
      
      return {
        success: true,
        data: {
          message: "Usuario actualizado exitosamente",
          usuario: { ...usuario }
        }
      };
    }
    
    // Transformar datos para el backend
    const backendData: any = {};
    
    if (userData.email) {
      backendData.email = userData.email;
    }
    
    if (userData.persona) {
      if (userData.persona.nombre) backendData.nombres = userData.persona.nombre;
      if (userData.persona.apellido) backendData.apellidos = userData.persona.apellido;
      if (userData.persona.ci) backendData.documento_identidad = userData.persona.ci;
      if (userData.persona.telefono) backendData.telefono = userData.persona.telefono;
      if (userData.persona.direccion) backendData.direccion = userData.persona.direccion;
    }
    
    return seguridadApiClient.put(`/auth/admin/seguridad/${userId}/`, backendData);
  },

  /**
   * Eliminar lógico usuario de seguridad (desactivar)
   * DELETE /auth/admin/seguridad/{id}/ o PATCH para soft delete
   */
  async eliminarUsuarioSeguridad(userId: number): Promise<ApiResponse<{
    message: string;
    usuario: {
      id: number;
      email: string;
      is_active: boolean;
    };
  }>> {
    console.log(`🗑️ SeguridadAdminService: Eliminando lógicamente usuario ${userId}...`);
    
    if (USE_MOCK_DATA) {
      // Simulamos un pequeño delay para que parezca real
      await new Promise(resolve => setTimeout(resolve, 400));
      
      const usuario = mockUsuarios.find(u => u.id === userId);
      if (!usuario) {
        return {
          success: false,
          message: 'Usuario no encontrado',
          errors: { usuario: [`No se encontró un usuario con ID ${userId}`] }
        };
      }
      
      // Marcar como inactivo (eliminación lógica)
      usuario.is_active = false;
      
      return {
        success: true,
        data: {
          message: "Usuario eliminado exitosamente",
          usuario: {
            id: usuario.id,
            email: usuario.email,
            is_active: usuario.is_active
          }
        }
      };
    }
    
    // Intentar con DELETE (eliminación lógica)
    const response = await seguridadApiClient.delete<{
      message: string;
      usuario: {
        id: number;
        email: string;
        is_active: boolean;
      };
    }>(`/auth/admin/seguridad/${userId}/`);
    
    // Si DELETE no funciona, intentar con PATCH para desactivar
    if (!response.success) {
      console.log('🔄 DELETE no funcionó, intentando PATCH para desactivar...');
      return seguridadApiClient.patch<{
        message: string;
        usuario: {
          id: number;
          email: string;
          is_active: boolean;
        };
      }>(`/auth/admin/seguridad/${userId}/`, { is_active: false });
    }
    
    return response;
  },

  /**
   * Función helper para obtener datos MOCK (solo para desarrollo)
   */
  getMockData(): UsuarioSeguridad[] {
    return [...mockUsuarios];
  },

  /**
   * Función helper para resetear datos MOCK (solo para desarrollo)
   */
  resetMockData(): void {
    mockUsuarios = [
      {
        id: 1,
        email: "seguridad1@condominio.com",
        persona: {
          nombre: "Juan Carlos",
          apellido: "Pérez García",
          ci: "12345678",
          telefono: "70123456",
          direccion: "Av. Principal #123"
        },
        roles: ["Seguridad"],
        is_active: true,
        date_joined: "2025-09-20T10:30:00Z"
      },
      {
        id: 2,
        email: "seguridad2@condominio.com", 
        persona: {
          nombre: "María Elena",
          apellido: "López Morales",
          ci: "87654321",
          telefono: "71234567",
          direccion: "Calle Secundaria #456"
        },
        roles: ["Seguridad"],
        is_active: true,
        date_joined: "2025-09-22T14:15:00Z"
      },
      {
        id: 3,
        email: "seguridad3@condominio.com",
        persona: {
          nombre: "Carlos Alberto", 
          apellido: "Mendoza Silva",
          ci: "11223344",
          telefono: "72345678",
          direccion: "Av. Secundaria #789"
        },
        roles: ["Seguridad"],
        is_active: false,
        date_joined: "2025-09-18T08:45:00Z"
      }
    ];
    nextId = 4;
  }
};