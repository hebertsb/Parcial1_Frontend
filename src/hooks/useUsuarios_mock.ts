/**
 * Hook personalizado para gestión de usuarios - VERSIÓN LIMPIA
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

  // 📊 DATOS MOCK TEMPORALES - Backend /api/personas/ aún no implementado
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
        tipo_persona: 'administrador',
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
        tipo_persona: 'propietario',
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
        tipo_persona: 'inquilino',
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

  // Cargar usuarios - usando datos mock temporalmente
  const fetchUsuarios = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('🔄 useUsuarios: Cargando usuarios...', filters);
      console.log('⚠️ useUsuarios: Endpoint /api/personas/ no disponible, usando datos temporales');
      
      // Simular delay de red
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const mockUsuarios = getMockUsuarios();
      
      setUsuarios(mockUsuarios);
      setTotalCount(mockUsuarios.length);
      setTotalPages(Math.ceil(mockUsuarios.length / (filters.page_size || 10)));
      setCurrentPage(filters.page || 1);
      
      console.log(`✅ useUsuarios: ${mockUsuarios.length} usuarios MOCK cargados correctamente`);
      
    } catch (error: any) {
      console.error('❌ useUsuarios: Error al cargar usuarios:', error);
      setError(error.message || 'Error al cargar usuarios');
      setUsuarios([]);
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

  // Crear usuario
  const crearUsuario = useCallback(async (userData: any): Promise<boolean> => {
    try {
      console.log('🔄 Creando usuario:', userData);
      
      // Simular creación
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      console.log('✅ Usuario creado exitosamente');
      await fetchUsuarios(); // Recargar lista
      return true;
    } catch (error: any) {
      console.error('❌ Error al crear usuario:', error);
      setError(error.message || 'Error de conexión al crear usuario');
      return false;
    }
  }, [fetchUsuarios]);

  // Actualizar usuario
  const actualizarUsuario = useCallback(async (id: number, userData: any): Promise<boolean> => {
    try {
      console.log('🔄 Actualizando usuario:', id, userData);
      
      // Simular actualización
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      console.log('✅ Usuario actualizado exitosamente');
      await fetchUsuarios(); // Recargar lista
      return true;
    } catch (error: any) {
      console.error('❌ Error al actualizar usuario:', error);
      setError(error.message || 'Error de conexión al actualizar usuario');
      return false;
    }
  }, [fetchUsuarios]);

  // Eliminar usuario (eliminación lógica)
  const eliminarUsuario = useCallback(async (id: number): Promise<boolean> => {
    try {
      console.log('🔄 Eliminando usuario:', id);
      
      // Simular eliminación
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      console.log('✅ Usuario eliminado exitosamente');
      await fetchUsuarios(); // Recargar lista
      return true;
    } catch (error: any) {
      console.error('❌ Error al eliminar usuario:', error);
      setError(error.message || 'Error de conexión al eliminar usuario');
      return false;
    }
  }, [fetchUsuarios]);

  // Cambiar estado del usuario
  const cambiarEstadoUsuario = useCallback(async (id: number, activo: boolean): Promise<boolean> => {
    try {
      console.log('🔄 Cambiando estado usuario:', id, activo);
      
      // Simular cambio de estado
      await new Promise(resolve => setTimeout(resolve, 500));
      
      console.log('✅ Estado del usuario actualizado');
      await fetchUsuarios(); // Recargar lista
      return true;
    } catch (error: any) {
      console.error('❌ Error al cambiar estado:', error);
      setError(error.message || 'Error de conexión al cambiar estado');
      return false;
    }
  }, [fetchUsuarios]);

  // Ver detalles de un usuario
  const verUsuario = useCallback(async (id: number): Promise<UsuarioSistema | null> => {
    try {
      console.log('🔄 Obteniendo detalles del usuario:', id);
      const usuario = usuarios.find(u => u.id === id);
      return usuario || null;
    } catch (error: any) {
      console.error('❌ Error al obtener usuario:', error);
      setError(error.message || 'Error al obtener detalles del usuario');
      return null;
    }
  }, [usuarios]);

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