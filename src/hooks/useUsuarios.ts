/**
 * Hook personalizado para gestión de usuarios
 */

import { useState, useEffect, useCallback } from 'react';
import { authService } from '@/lib/services';
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

  // Cargar usuarios (MOCK DATA - Backend no implementado)
  const fetchUsuarios = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('🔄 useUsuarios: Cargando usuarios con MOCK DATA...', filters);
      
      // Simular delay de red
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // MOCK DATA - Simulando usuarios según la nueva estructura
      const mockUsuarios: UsuarioSistema[] = [
        {
          id: 1,
          email: "admin@facial.com",
          estado: "ACTIVO",
          created_at: "2025-09-23T10:30:00Z",
          updated_at: "2025-09-23T15:45:00Z",
          persona: {
            id: 1,
            nombre: "Juan Carlos",
            apellido: "Pérez López",
            documento_identidad: "12345678",
            telefono: "71234567",
            email: "admin@facial.com",
            fecha_nacimiento: "1990-05-15",
            genero: "masculino",
            pais: "Bolivia",
            tipo_persona: "administrador",
            direccion: "Av. América #123",
            edad: 35,
            nombre_completo: "Juan Carlos Pérez López",
            activo: true,
            created_at: "2025-09-23T10:30:00Z",
            updated_at: "2025-09-23T15:45:00Z"
          },
          roles: [
            {
              id: 1,
              nombre: "Administrador",
              descripcion: "Administrador del sistema",
              activo: true,
              created_at: "2025-09-23T10:00:00Z",
              updated_at: "2025-09-23T10:00:00Z"
            }
          ],
          nombres: "Juan Carlos",
          apellidos: "Pérez López",
          telefono: "71234567",
          fecha_nacimiento: "1990-05-15",
          genero: "masculino"
        },
        {
          id: 2,
          email: "ana.garcia@facial.com",
          estado: "ACTIVO",
          created_at: "2025-09-20T08:15:00Z",
          updated_at: "2025-09-23T12:30:00Z",
          persona: {
            id: 2,
            nombre: "Ana María",
            apellido: "García Silva",
            documento_identidad: "87654321",
            telefono: "72345678",
            email: "ana.garcia@facial.com",
            fecha_nacimiento: "1985-08-22",
            genero: "femenino",
            pais: "Bolivia",
            tipo_persona: "propietario",
            direccion: "Calle Libertad #456",
            edad: 40,
            nombre_completo: "Ana María García Silva",
            activo: true,
            created_at: "2025-09-20T08:15:00Z",
            updated_at: "2025-09-23T12:30:00Z"
          },
          roles: [
            {
              id: 2,
              nombre: "Propietario",
              descripcion: "Propietario de vivienda",
              activo: true,
              created_at: "2025-09-20T08:00:00Z",
              updated_at: "2025-09-20T08:00:00Z"
            }
          ],
          nombres: "Ana María",
          apellidos: "García Silva",
          telefono: "72345678",
          fecha_nacimiento: "1985-08-22",
          genero: "femenino"
        },
        {
          id: 3,
          email: "carlos.lopez@facial.com",
          estado: "INACTIVO",
          created_at: "2025-09-18T14:20:00Z",
          updated_at: "2025-09-22T09:45:00Z",
          persona: {
            id: 3,
            nombre: "Carlos Alberto",
            apellido: "López Morales",
            documento_identidad: "11223344",
            telefono: "73456789",
            email: "carlos.lopez@facial.com",
            fecha_nacimiento: "1992-03-10",
            genero: "masculino",
            pais: "Bolivia",
            tipo_persona: "inquilino",
            direccion: "Av. 6 de Agosto #789",
            edad: 33,
            nombre_completo: "Carlos Alberto López Morales",
            activo: false,
            created_at: "2025-09-18T14:20:00Z",
            updated_at: "2025-09-22T09:45:00Z"
          },
          roles: [
            {
              id: 3,
              nombre: "Inquilino",
              descripcion: "Inquilino de vivienda",
              activo: true,
              created_at: "2025-09-18T14:00:00Z",
              updated_at: "2025-09-18T14:00:00Z"
            }
          ],
          nombres: "Carlos Alberto",
          apellidos: "López Morales",
          telefono: "73456789",
          fecha_nacimiento: "1992-03-10",
          genero: "masculino"
        }
      ];

      // Simular filtros
      let filteredUsuarios = mockUsuarios;
      
      if (filters.search) {
        filteredUsuarios = filteredUsuarios.filter(u => 
          u.persona.nombre_completo.toLowerCase().includes(filters.search!.toLowerCase()) ||
          u.email.toLowerCase().includes(filters.search!.toLowerCase())
        );
      }

      if (filters.role) {
        filteredUsuarios = filteredUsuarios.filter(u => 
          u.roles.some(r => r.nombre.toLowerCase() === filters.role!.toLowerCase())
        );
      }

      if (filters.is_active !== undefined) {
        filteredUsuarios = filteredUsuarios.filter(u => 
          (filters.is_active && u.estado === 'ACTIVO') || 
          (!filters.is_active && u.estado === 'INACTIVO')
        );
      }

      // Simular paginación
      const pageSize = filters.page_size || 10;
      const currentPage = filters.page || 1;
      const startIndex = (currentPage - 1) * pageSize;
      const endIndex = startIndex + pageSize;
      const paginatedUsuarios = filteredUsuarios.slice(startIndex, endIndex);

      setUsuarios(paginatedUsuarios);
      setTotalCount(filteredUsuarios.length);
      setTotalPages(Math.ceil(filteredUsuarios.length / pageSize));
      setCurrentPage(currentPage);
      
      console.log('✅ useUsuarios: MOCK usuarios cargados exitosamente:', paginatedUsuarios.length);
    } catch (err: any) {
      console.error('❌ useUsuarios: Error cargando usuarios:', err);
      setError(err.message || 'Error al cargar usuarios');
      setUsuarios([]);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  // Cargar roles disponibles (MOCK DATA - Backend no implementado)
  const fetchRoles = useCallback(async () => {
    try {
      console.log('🔄 useUsuarios: Cargando roles con MOCK DATA...');
      
      // Simular delay de red
      await new Promise(resolve => setTimeout(resolve, 200));
      
      // MOCK DATA - Roles de prueba
      const mockRoles: Rol[] = [
        {
          id: 1,
          nombre: "Administrador",
          descripcion: "Administrador del sistema",
          activo: true,
          created_at: "2025-09-23T10:00:00Z",
          updated_at: "2025-09-23T10:00:00Z"
        },
        {
          id: 2,
          nombre: "Propietario",
          descripcion: "Propietario de vivienda",
          activo: true,
          created_at: "2025-09-20T08:00:00Z",
          updated_at: "2025-09-20T08:00:00Z"
        },
        {
          id: 3,
          nombre: "Inquilino",
          descripcion: "Inquilino de vivienda",
          activo: true,
          created_at: "2025-09-18T14:00:00Z",
          updated_at: "2025-09-18T14:00:00Z"
        },
        {
          id: 4,
          nombre: "Empleado",
          descripcion: "Empleado del condominio",
          activo: true,
          created_at: "2025-09-15T12:00:00Z",
          updated_at: "2025-09-15T12:00:00Z"
        }
      ];
      
      setRoles(mockRoles);
      console.log(`✅ useUsuarios: ${mockRoles.length} roles MOCK cargados`);
    } catch (err: any) {
      console.error('❌ useUsuarios: Error cargando roles:', err);
    }
  }, []);

  // Crear usuario (NO IMPLEMENTADO - Backend no tiene endpoint)
  const crearUsuario = useCallback(async (userData: any): Promise<boolean> => {
    console.log('⚠️ useUsuarios: Crear usuario NO IMPLEMENTADO - Backend no tiene endpoint');
    setError('Funcionalidad no disponible: El backend no tiene endpoint para crear usuarios');
    return false;
  }, []);

  // Actualizar usuario (NO IMPLEMENTADO - Backend no tiene endpoint)
  const actualizarUsuario = useCallback(async (id: number, userData: any): Promise<boolean> => {
    console.log('⚠️ useUsuarios: Actualizar usuario NO IMPLEMENTADO - Backend no tiene endpoint');
    setError('Funcionalidad no disponible: El backend no tiene endpoint para actualizar usuarios');
    return false;
  }, []);

  // Eliminar usuario (NO IMPLEMENTADO - Backend no tiene endpoint)
  const eliminarUsuario = useCallback(async (id: number): Promise<boolean> => {
    console.log('⚠️ useUsuarios: Eliminar usuario NO IMPLEMENTADO - Backend no tiene endpoint');
    setError('Funcionalidad no disponible: El backend no tiene endpoint para eliminar usuarios');
    return false;
  }, []);

  // Cambiar estado usuario (NO IMPLEMENTADO - Backend no tiene endpoint)
  const cambiarEstadoUsuario = useCallback(async (id: number, activo: boolean): Promise<boolean> => {
    console.log('⚠️ useUsuarios: Cambiar estado usuario NO IMPLEMENTADO - Backend no tiene endpoint');
    setError('Funcionalidad no disponible: El backend no tiene endpoint para cambiar estado de usuarios');
    return false;
  }, []);

  // Refetch función
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
  };
}