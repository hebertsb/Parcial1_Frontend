/**
 * Hook personalizado para gestión de usuarios - CONECTADO AL BACKEND REAL
 * Basado en el informe del backend: TODOS los endpoints están funcionando
 */

import { useState, useEffect, useCallback } from 'react';
import { authService } from '@/lib/services';
import { apiClient } from '@/src/core/api/client';
import type { UsuarioSistema, UsuarioFilters, Rol, PaginatedResponse } from '../core/types';

interface UseUsuariosReturn {
  usuarios: UsuarioSistema[];
  roles: Rol[];
  loading: boolean;
  error: string | null;
  totalPages: number;
  currentPage: number;
  totalCount: number;
  filters: UsuarioFilters;
  setFilters: (filters: UsuarioFilters) => void;
  refetch: () => Promise<void>;
  crearUsuario: (userData: any) => Promise<boolean>;
  actualizarUsuario: (id: number, userData: any) => Promise<boolean>;
  eliminarUsuario: (id: number) => Promise<boolean>;
  cambiarEstadoUsuario: (id: number, activo: boolean) => Promise<boolean>;
  verUsuario: (id: number) => Promise<UsuarioSistema | null>;
  editarUsuario: (id: number, userData: any) => Promise<boolean>;
}

export function useUsuarios(): UseUsuariosReturn {
  const [usuarios, setUsuarios] = useState<UsuarioSistema[]>([]);
  const [roles, setRoles] = useState<Rol[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [filters, setFilters] = useState<UsuarioFilters>({
    page: 1,
    page_size: 10
  });

  // 📊 DATOS MOCK DE FALLBACK - Para cuando el backend falle
  const getMockUsuarios = (): UsuarioSistema[] => [
    {
      id: 1,
      email: 'admin@facial.com',
      estado: 'ACTIVO' as const,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      persona: {
        id: 1,
        nombre: 'Juan Carlos',
        apellido: 'Pérez González',
        documento_identidad: '12345678',
        telefono: '70123456',
        email: 'admin@facial.com',
        fecha_nacimiento: '1985-05-15',
        genero: 'masculino' as const,
        pais: 'Bolivia',
        tipo_persona: 'administrador' as const,
        direccion: 'Av. Principal 123',
        edad: 39,
        nombre_completo: 'Juan Carlos Pérez González',
        activo: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      },
      roles: [
        {
          id: 1,
          nombre: 'Administrador',
          descripcion: 'Administrador del sistema',
          activo: true,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }
      ],
      nombres: 'Juan Carlos',
      apellidos: 'Pérez González',
      telefono: '70123456',
      fecha_nacimiento: '1985-05-15',
      genero: 'masculino' as const
    },
    {
      id: 2,
      email: 'propietario1@condominio.com',
      estado: 'ACTIVO' as const,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      persona: {
        id: 2,
        nombre: 'María Elena',
        apellido: 'Silva Torres',
        documento_identidad: '87654321',
        telefono: '71234567',
        email: 'propietario1@condominio.com',
        fecha_nacimiento: '1990-08-22',
        genero: 'femenino' as const,
        pais: 'Bolivia',
        tipo_persona: 'propietario' as const,
        direccion: 'Calle Secundaria 456',
        edad: 34,
        nombre_completo: 'María Elena Silva Torres',
        activo: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      },
      roles: [
        {
          id: 2,
          nombre: 'Propietario',
          descripcion: 'Propietario de vivienda',
          activo: true,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }
      ],
      nombres: 'María Elena',
      apellidos: 'Silva Torres',
      telefono: '71234567',
      fecha_nacimiento: '1990-08-22',
      genero: 'femenino' as const
    },
    {
      id: 3,
      email: 'inquilino1@condominio.com',
      estado: 'ACTIVO' as const,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      persona: {
        id: 3,
        nombre: 'Carlos',
        apellido: 'Rodríguez Paz',
        documento_identidad: '11223344',
        telefono: '72345678',
        email: 'inquilino1@condominio.com',
        fecha_nacimiento: '1988-12-10',
        genero: 'masculino' as const,
        pais: 'Bolivia',
        tipo_persona: 'inquilino' as const,
        direccion: 'Av. Tercera 789',
        edad: 36,
        nombre_completo: 'Carlos Rodríguez Paz',
        activo: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      },
      roles: [
        {
          id: 3,
          nombre: 'Inquilino',
          descripcion: 'Inquilino de vivienda',
          activo: true,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }
      ],
      nombres: 'Carlos',
      apellidos: 'Rodríguez Paz',
      telefono: '72345678',
      fecha_nacimiento: '1988-12-10',
      genero: 'masculino' as const
    }
  ];

  // 🔄 Cargar usuarios del backend real - Endpoint confirmado: /api/personas/
  const fetchUsuarios = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('🔄 useUsuarios: Cargando personas desde backend REAL...', filters);
      console.log('🌐 Endpoint: http://127.0.0.1:8000/api/personas/');
      
      // Obtener token de autenticación
      const token = localStorage.getItem('access_token');
      if (!token) {
        throw new Error('Token de autenticación no encontrado. Por favor, inicia sesión.');
      }

      // Hacer request al backend real
      const response = await fetch('http://127.0.0.1:8000/api/personas/', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      console.log('📡 Response status:', response.status);

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('Token expirado. Por favor, inicia sesión nuevamente.');
        }
        if (response.status === 403) {
          throw new Error('No tienes permisos para acceder a esta información.');
        }
        if (response.status === 500) {
          console.error('🚨 ERROR 500: El servidor backend tiene un problema interno');
          console.error('💡 Esto indica un error en el código del backend Django');
          console.error('🔧 Usando datos de fallback mientras se corrige el backend...');
          
          // Usar datos de fallback cuando el backend falla
          const fallbackUsuarios = getMockUsuarios();
          setUsuarios(fallbackUsuarios);
          setTotalCount(fallbackUsuarios.length);
          setTotalPages(Math.ceil(fallbackUsuarios.length / (filters.page_size || 10)));
          setCurrentPage(filters.page || 1);
          
          setError('⚠️ Backend con error 500. Mostrando datos de ejemplo.');
          console.log(`✅ useUsuarios: ${fallbackUsuarios.length} usuarios de fallback cargados`);
          return; // Salir sin lanzar error
        }
        throw new Error(`Error HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      console.log('📊 Datos recibidos del backend:', data);
      
      // Manejar respuesta paginada según estructura del backend
      let personasArray: any[] = [];
      let totalCount = 0;
      
      if (data.results && Array.isArray(data.results)) {
        // Respuesta paginada: { count: X, results: [...] }
        personasArray = data.results;
        totalCount = data.count || 0;
      } else if (Array.isArray(data)) {
        // Respuesta directa: [persona1, persona2, ...]
        personasArray = data;
        totalCount = data.length;
      } else {
        throw new Error('Formato de respuesta no reconocido');
      }

      // Transformar datos del backend al formato del frontend
      const usuariosTransformados: UsuarioSistema[] = personasArray.map((persona: any) => ({
        id: persona.id,
        email: persona.email || `persona${persona.id}@condominio.com`,
        estado: persona.activo ? 'ACTIVO' as const : 'INACTIVO' as const,
        created_at: persona.created_at || new Date().toISOString(),
        updated_at: persona.updated_at || new Date().toISOString(),
        persona: {
          id: persona.id,
          nombre: persona.nombre || 'N/A',
          apellido: persona.apellido || 'N/A',
          documento_identidad: persona.documento_identidad || 'N/A',
          telefono: persona.telefono || 'N/A',
          email: persona.email || 'N/A',
          fecha_nacimiento: persona.fecha_nacimiento || null,
          genero: (persona.genero === 'masculino' || persona.genero === 'femenino' || persona.genero === 'otro') 
            ? persona.genero : 'otro',
          pais: 'Bolivia',
          tipo_persona: 'persona',
          direccion: persona.direccion || 'N/A',
          edad: persona.edad || 0,
          nombre_completo: `${persona.nombre || 'N/A'} ${persona.apellido || 'N/A'}`,
          activo: persona.activo !== undefined ? persona.activo : true,
          created_at: persona.created_at || new Date().toISOString(),
          updated_at: persona.updated_at || new Date().toISOString()
        },
        roles: [
          {
            id: 1,
            nombre: 'Usuario',
            descripcion: 'Usuario del sistema',
            activo: true,
            created_at: persona.created_at || new Date().toISOString(),
            updated_at: persona.updated_at || new Date().toISOString()
          }
        ],
        nombres: persona.nombre || 'N/A',
        apellidos: persona.apellido || 'N/A',
        telefono: persona.telefono || 'N/A',
        fecha_nacimiento: persona.fecha_nacimiento || null,
        genero: (persona.genero === 'masculino' || persona.genero === 'femenino' || persona.genero === 'otro') 
          ? persona.genero : 'otro'
      }));

      setUsuarios(usuariosTransformados);
      setTotalCount(totalCount);
      setTotalPages(Math.ceil(totalCount / (filters.page_size || 10)));
      setCurrentPage(filters.page || 1);
      
      console.log(`✅ useUsuarios: ${usuariosTransformados.length} usuarios cargados desde backend REAL`);
      
    } catch (error: any) {
      console.error('❌ useUsuarios: Error al cargar usuarios del backend:', error);
      setError(error.message || 'Error al cargar usuarios del backend');
      setUsuarios([]);
      
      // Si hay error de autenticación, limpiar tokens
      if (error.message?.includes('Token')) {
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
      }
    } finally {
      setLoading(false);
    }
  }, [filters]);

  // Cargar roles del sistema
  const fetchRoles = useCallback(async () => {
    try {
      const systemRoles: Rol[] = [
        {
          id: 1,
          nombre: 'Administrador',
          descripcion: 'Administrador del sistema',
          activo: true,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        },
        {
          id: 2,
          nombre: 'Propietario',
          descripcion: 'Propietario de vivienda',
          activo: true,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        },
        {
          id: 3,
          nombre: 'Inquilino',
          descripcion: 'Inquilino de vivienda',
          activo: true,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        },
        {
          id: 4,
          nombre: 'Seguridad',
          descripcion: 'Personal de seguridad',
          activo: true,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }
      ];
      setRoles(systemRoles);
    } catch (error) {
      console.error('Error al cargar roles:', error);
    }
  }, []);

  // Crear usuario - Conectado al backend
  const crearUsuario = useCallback(async (userData: any): Promise<boolean> => {
    try {
      console.log('🔄 Creando usuario en backend:', userData);
      
      const token = localStorage.getItem('access_token');
      if (!token) {
        throw new Error('Token de autenticación no encontrado');
      }

      const response = await fetch('http://127.0.0.1:8000/api/personas/', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(userData)
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `Error HTTP ${response.status}`);
      }

      console.log('✅ Usuario creado exitosamente en backend');
      await fetchUsuarios(); // Recargar lista
      return true;
    } catch (error: any) {
      console.error('❌ Error al crear usuario:', error);
      setError(error.message || 'Error de conexión al crear usuario');
      return false;
    }
  }, [fetchUsuarios]);

  // Actualizar usuario - Conectado al backend
  const actualizarUsuario = useCallback(async (id: number, userData: any): Promise<boolean> => {
    try {
      console.log('🔄 Actualizando usuario en backend:', id, userData);
      
      const token = localStorage.getItem('access_token');
      if (!token) {
        throw new Error('Token de autenticación no encontrado');
      }

      const response = await fetch(`http://127.0.0.1:8000/api/personas/${id}/`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(userData)
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `Error HTTP ${response.status}`);
      }

      console.log('✅ Usuario actualizado exitosamente en backend');
      await fetchUsuarios(); // Recargar lista
      return true;
    } catch (error: any) {
      console.error('❌ Error al actualizar usuario:', error);
      setError(error.message || 'Error de conexión al actualizar usuario');
      return false;
    }
  }, [fetchUsuarios]);

  // Eliminar usuario - Conectado al backend
  const eliminarUsuario = useCallback(async (id: number): Promise<boolean> => {
    try {
      console.log('🔄 Eliminando usuario en backend:', id);
      
      const token = localStorage.getItem('access_token');
      if (!token) {
        throw new Error('Token de autenticación no encontrado');
      }

      const response = await fetch(`http://127.0.0.1:8000/api/personas/${id}/`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `Error HTTP ${response.status}`);
      }

      console.log('✅ Usuario eliminado exitosamente en backend');
      await fetchUsuarios(); // Recargar lista
      return true;
    } catch (error: any) {
      console.error('❌ Error al eliminar usuario:', error);
      setError(error.message || 'Error de conexión al eliminar usuario');
      return false;
    }
  }, [fetchUsuarios]);

  // Cambiar estado del usuario - Conectado al backend
  const cambiarEstadoUsuario = useCallback(async (id: number, activo: boolean): Promise<boolean> => {
    try {
      console.log('🔄 Cambiando estado usuario en backend:', id, activo);
      
      const token = localStorage.getItem('access_token');
      if (!token) {
        throw new Error('Token de autenticación no encontrado');
      }

      const response = await fetch(`http://127.0.0.1:8000/api/personas/${id}/`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ activo })
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `Error HTTP ${response.status}`);
      }

      console.log('✅ Estado del usuario actualizado en backend');
      await fetchUsuarios(); // Recargar lista
      return true;
    } catch (error: any) {
      console.error('❌ Error al cambiar estado:', error);
      setError(error.message || 'Error de conexión al cambiar estado');
      return false;
    }
  }, [fetchUsuarios]);

  // Ver detalles de un usuario - Conectado al backend
  const verUsuario = useCallback(async (id: number): Promise<UsuarioSistema | null> => {
    try {
      console.log('🔄 Obteniendo detalles del usuario desde backend:', id);
      
      const token = localStorage.getItem('access_token');
      if (!token) {
        throw new Error('Token de autenticación no encontrado');
      }

      const response = await fetch(`http://127.0.0.1:8000/api/personas/${id}/`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`Error HTTP ${response.status}`);
      }

      const persona = await response.json();
      
      // Transformar datos del backend al formato del frontend
      const usuario: UsuarioSistema = {
        id: persona.id,
        email: persona.email || `persona${persona.id}@condominio.com`,
        estado: persona.activo ? 'ACTIVO' as const : 'INACTIVO' as const,
        created_at: persona.created_at || new Date().toISOString(),
        updated_at: persona.updated_at || new Date().toISOString(),
        persona: {
          id: persona.id,
          nombre: persona.nombre || 'N/A',
          apellido: persona.apellido || 'N/A',
          documento_identidad: persona.documento_identidad || 'N/A',
          telefono: persona.telefono || 'N/A',
          email: persona.email || 'N/A',
          fecha_nacimiento: persona.fecha_nacimiento || null,
          genero: (persona.genero === 'masculino' || persona.genero === 'femenino' || persona.genero === 'otro') 
            ? persona.genero : 'otro',
          pais: 'Bolivia',
          tipo_persona: 'persona',
          direccion: persona.direccion || 'N/A',
          edad: persona.edad || 0,
          nombre_completo: `${persona.nombre || 'N/A'} ${persona.apellido || 'N/A'}`,
          activo: persona.activo !== undefined ? persona.activo : true,
          created_at: persona.created_at || new Date().toISOString(),
          updated_at: persona.updated_at || new Date().toISOString()
        },
        roles: [
          {
            id: 1,
            nombre: 'Usuario',
            descripcion: 'Usuario del sistema',
            activo: true,
            created_at: persona.created_at || new Date().toISOString(),
            updated_at: persona.updated_at || new Date().toISOString()
          }
        ],
        nombres: persona.nombre || 'N/A',
        apellidos: persona.apellido || 'N/A',
        telefono: persona.telefono || 'N/A',
        fecha_nacimiento: persona.fecha_nacimiento || null,
        genero: (persona.genero === 'masculino' || persona.genero === 'femenino' || persona.genero === 'otro') 
          ? persona.genero : 'otro'
      };

      return usuario;
    } catch (error: any) {
      console.error('❌ Error al obtener usuario:', error);
      setError(error.message || 'Error al obtener detalles del usuario');
      return null;
    }
  }, []);

  // Editar usuario (alias de actualizarUsuario)
  const editarUsuario = useCallback(async (id: number, userData: any): Promise<boolean> => {
    return await actualizarUsuario(id, userData);
  }, [actualizarUsuario]);

  // Refetch manual
  const refetch = useCallback(async () => {
    await fetchUsuarios();
  }, [fetchUsuarios]);

  // Efectos
  useEffect(() => {
    fetchUsuarios();
  }, [fetchUsuarios]);

  useEffect(() => {
    fetchRoles();
  }, [fetchRoles]);

  return {
    usuarios,
    roles,
    loading,
    error,
    totalPages,
    currentPage,
    totalCount,
    filters,
    setFilters,
    refetch,
    crearUsuario,
    actualizarUsuario,
    eliminarUsuario,
    cambiarEstadoUsuario,
    verUsuario,
    editarUsuario
  };
}