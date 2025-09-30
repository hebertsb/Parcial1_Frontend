/**
 * Configuración de endpoints para usuarios de seguridad
 * Siguiendo la guía del backend
 */

export const SEGURIDAD_API_ENDPOINTS = {
  // Autenticación
  LOGIN: '/authz/login/',
  REFRESH: '/auth/refresh/',

  // Gestión de usuarios de seguridad (Solo Administradores)
  ADMIN: {
    CREAR_USUARIO_SEGURIDAD: '/auth/admin/seguridad/crear/',
    LISTAR_USUARIOS_SEGURIDAD: '/auth/admin/seguridad/listar/',
    CAMBIAR_ESTADO_USUARIO: (id: number) => `/auth/admin/seguridad/${id}/estado/`,
    RESET_PASSWORD_USUARIO: (id: number) => `/auth/admin/seguridad/${id}/reset-password/`,
  }
} as const;

/**
 * Headers estándar para requests autenticados
 */
export const getAuthHeaders = () => {
  const token = typeof window !== 'undefined' ? localStorage.getItem('access_token') : null;
  return {
    'Authorization': token ? `Bearer ${token}` : '',
    'Content-Type': 'application/json'
  };
};

/**
 * Configuración de usuarios de prueba según la guía
 */
export const USUARIOS_PRUEBA = {
  ADMINISTRADOR: {
    email: 'admin@condominio.com',
    password: 'admin123',
    descripcion: 'Usuario administrador para crear personal de seguridad'
  },
  SEGURIDAD_EXISTENTES: [
    {
      email: 'prueba.seguridad@test.com',
      password: 'prueba123',
      nombre: 'Usuario Pruebas Seguridad'
    },
    {
      email: 'carlos.test@condominio.com',
      password: 'test123',
      nombre: 'Carlos Test Seguridad'
    },
    {
      email: 'seguridad@facial.com',
      password: '[Revisar con admin]',
      nombre: 'Juan Carlos Seguridad'
    }
  ]
} as const;