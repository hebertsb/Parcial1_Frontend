/**
 * Hook personalizado para gestión de usuarios
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

  // Cargar usuarios del backend real
  const fetchUsuarios = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('🔄 useUsuarios: Cargando personas desde backend...', filters);
      
      // ⚠️ IMPORTANTE: El backend aún no implementó /api/personas/
      // Los endpoints disponibles según el error 404 son solo:
      // - /api/authz/ (propietarios)  
      // - /api/viviendas/ (viviendas)
      // - /auth/ (autenticación)
      // Usando datos mock hasta que se implemente /api/personas/
      console.log('⚠️ useUsuarios: Endpoint /personas/ no disponible, usando datos temporales');
      console.log('📊 Estado actual del hook useUsuarios:', { filtrosAplicados: filters, fechaActual: new Date().toISOString() });
      
      // Simular respuesta exitosa con datos mock
      const mockUsuarios = [
        {
          id: 1,
          email: 'propietario1@condominio.com',
          estado: 'ACTIVO',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          persona: {
            id: 1,
            nombre: 'Juan Carlos',
            apellido: 'Pérez González',
            documento_identidad: '12345678',
            telefono: '70123456',
            email: 'propietario1@condominio.com',
            fecha_nacimiento: '1985-05-15',
            genero: 'masculino',
            pais: 'Bolivia',
            tipo_persona: 'propietario',
            direccion: 'Av. Principal 123',
            edad: 39,
            nombre_completo: 'Juan Carlos Pérez González',
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
          nombres: 'Juan Carlos',
          apellidos: 'Pérez González',
          telefono: '70123456',
          fecha_nacimiento: '1985-05-15',
          genero: 'masculino'
        },
        {
          id: 2,
          email: 'inquilino1@condominio.com',
          estado: 'ACTIVO',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          persona: {
            id: 2,
            nombre: 'María Elena',
            apellido: 'Silva Torres',
            documento_identidad: '87654321',
            telefono: '71234567',
            email: 'inquilino1@condominio.com',
            fecha_nacimiento: '1990-08-22',
            genero: 'femenino',
            pais: 'Bolivia',
            tipo_persona: 'inquilino',
            direccion: 'Calle Secundaria 456',
            edad: 34,
            nombre_completo: 'María Elena Silva Torres',
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
          nombres: 'María Elena',
          apellidos: 'Silva Torres',
          telefono: '71234567',
          fecha_nacimiento: '1990-08-22',
          genero: 'femenino'
        }
      ];

      // 📊 Usando datos MOCK temporales - Los datos ya están en formato correcto
      const usuariosConTipoCorregido = mockUsuarios.map(usuario => ({
        ...usuario,
        estado: usuario.estado as 'ACTIVO' | 'INACTIVO'
      }));
      
      setUsuarios(usuariosConTipoCorregido);
      setTotalCount(usuariosConTipoCorregido.length);
      setTotalPages(Math.ceil(usuariosConTipoCorregido.length / (filters.page_size || 10)));
      setCurrentPage(filters.page || 1);
      
      console.log(`✅ useUsuarios: ${usuariosConTipoCorregido.length} usuarios MOCK cargados correctamente`);
        console.log('✅ useUsuarios: Respuesta del backend:', response.data);
        
        // El backend puede devolver los datos en diferentes formatos
        let usuarios: any[] = [];
        let totalCount = 0;
        
        const responseData = response.data as any;
        
        if (Array.isArray(responseData)) {
          // Formato directo: [usuario1, usuario2, ...]
          usuarios = responseData;
          totalCount = usuarios.length;
        } else if (responseData.results && Array.isArray(responseData.results)) {
          // Formato paginado: { results: [...], count: 10 }
          usuarios = responseData.results;
          totalCount = responseData.count || usuarios.length;
        } else if (responseData.data && Array.isArray(responseData.data)) {
          // Formato: { data: [...], total: 10 }
          usuarios = responseData.data;
          totalCount = responseData.total || responseData.count || usuarios.length;
        } else {
          console.warn('⚠️ useUsuarios: Formato de respuesta no reconocido:', responseData);
          usuarios = [];
          totalCount = 0;
        }

        // Transformar datos del backend al formato esperado por el frontend
        const usuariosTransformados: UsuarioSistema[] = usuarios.map((usuario: any) => ({
          id: usuario.id,
          email: usuario.email || usuario.username,
          estado: usuario.is_active ? 'ACTIVO' : 'INACTIVO',
          created_at: usuario.date_joined || usuario.created_at,
          updated_at: usuario.updated_at || usuario.date_joined,
          persona: {
            id: usuario.id,
            nombre: usuario.first_name || usuario.nombres || 'N/A',
            apellido: usuario.last_name || usuario.apellidos || 'N/A',
            documento_identidad: usuario.document_id || usuario.documento_identidad || usuario.ci || 'N/A',
            telefono: usuario.phone || usuario.telefono || 'N/A',
            email: usuario.email || usuario.username,
            fecha_nacimiento: usuario.birth_date || usuario.fecha_nacimiento || null,
            genero: usuario.gender || usuario.genero || 'no_especificado',
            pais: usuario.country || usuario.pais || 'Bolivia',
            tipo_persona: usuario.role || usuario.user_type || 'usuario',
            direccion: usuario.address || usuario.direccion || '',
            edad: usuario.age || usuario.edad || null,
            nombre_completo: `${usuario.first_name || usuario.nombres || ''} ${usuario.last_name || usuario.apellidos || ''}`.trim(),
            activo: usuario.is_active !== false,
            created_at: usuario.date_joined || usuario.created_at,
            updated_at: usuario.updated_at || usuario.date_joined
          },
          roles: usuario.roles || [
            {
              id: 1,
              nombre: usuario.role || 'Usuario',
              descripcion: `Rol: ${usuario.role || 'Usuario'}`,
              activo: true,
              created_at: usuario.date_joined || usuario.created_at,
              updated_at: usuario.updated_at || usuario.date_joined
            }
          ],
          nombres: usuario.first_name || usuario.nombres || 'N/A',
          apellidos: usuario.last_name || usuario.apellidos || 'N/A',
          telefono: usuario.phone || usuario.telefono || 'N/A',
          fecha_nacimiento: usuario.birth_date || usuario.fecha_nacimiento || null,
          genero: usuario.gender || usuario.genero || 'no_especificado'
        }));

        setUsuarios(usuariosTransformados);
        setTotalCount(totalCount);
        setTotalPages(Math.ceil(totalCount / (filters.page_size || 10)));
        setCurrentPage(filters.page || 1);
        
        console.log(`✅ useUsuarios: ${usuariosTransformados.length} usuarios cargados desde backend`);
      } else {
        console.error('❌ useUsuarios: Error en respuesta del backend');
        setError('Error al cargar usuarios');
        setUsuarios([]);
      }

      // Datos MOCK de respaldo (comentados)
      const mockUsuariosRespaldo: UsuarioSistema[] = [
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
    } catch (err: any) {
      console.error('❌ useUsuarios: Error cargando usuarios:', err);
      setError(err.message || 'Error al cargar usuarios');
      setUsuarios([]);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  // Cargar roles disponibles
  const fetchRoles = useCallback(async () => {
    try {
      console.log('🔄 useUsuarios: Cargando roles...');
      
      // Roles estándar del sistema basados en el backend
      const systemRoles: Rol[] = [
        {
          id: 1,
          nombre: "Administrator",
          descripcion: "Administrador del sistema",
          activo: true,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        },
        {
          id: 2,
          nombre: "Security",
          descripcion: "Personal de seguridad",
          activo: true,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        },
        {
          id: 3,
          nombre: "Owner",
          descripcion: "Propietario de vivienda",
          activo: true,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        },
        {
          id: 4,
          nombre: "Tenant",
          descripcion: "Inquilino de vivienda",
          activo: true,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }
      ];
      
      setRoles(systemRoles);
      console.log(`✅ useUsuarios: ${systemRoles.length} roles cargados`);
    } catch (err: any) {
      console.error('❌ useUsuarios: Error cargando roles:', err);
    }
  }, []);

  // Crear usuario
  const crearUsuario = useCallback(async (userData: any): Promise<boolean> => {
    try {
      console.log('➕ useUsuarios: Creando usuario (TEMPORAL)...', userData);
      
      // TEMPORAL: Simular creación exitosa hasta que se implemente el endpoint
      console.log('⚠️ useUsuarios: Endpoint crear usuario no disponible, simulando éxito');
      
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simular delay
      await fetchUsuarios(); // Recargar lista
      
      console.log('✅ useUsuarios: Usuario creado exitosamente (simulado)');
      return true;
    } catch (err: any) {
      console.error('❌ useUsuarios: Error creando usuario:', err);
      setError(err.message || 'Error de conexión al crear usuario');
      return false;
    }
  }, [fetchUsuarios]);

  // Actualizar usuario
  const actualizarUsuario = useCallback(async (id: number, userData: any): Promise<boolean> => {
    try {
      console.log(`✏️ useUsuarios: Actualizando usuario ${id}...`, userData);
      
      const response = await apiClient.put(`/personas/${id}/`, userData);
      
      if (response.success) {
        console.log('✅ useUsuarios: Usuario actualizado exitosamente');
        await fetchUsuarios(); // Recargar lista
        return true;
      } else {
        console.error('❌ useUsuarios: Error actualizando usuario:', response.message);
        setError(response.message || 'Error al actualizar usuario');
        return false;
      }
    } catch (err: any) {
      console.error('❌ useUsuarios: Error actualizando usuario:', err);
      setError(err.message || 'Error de conexión al actualizar usuario');
      return false;
    }
  }, [fetchUsuarios]);

  // Eliminar usuario (eliminación lógica)
  const eliminarUsuario = useCallback(async (id: number): Promise<boolean> => {
    try {
      console.log(`🗑️ useUsuarios: Eliminando usuario ${id}...`);
      
      // Intentar primero con DELETE
      const response = await apiClient.delete(`/personas/${id}/`);
      
      if (response.success) {
        console.log('✅ useUsuarios: Usuario eliminado exitosamente');
        await fetchUsuarios(); // Recargar lista
        return true;
      } else {
        // Si DELETE no funciona, intentar desactivar con PATCH
        console.log('🔄 useUsuarios: DELETE no funcionó, intentando desactivar...');
        const patchResponse = await apiClient.patch(`/personas/${id}/`, { is_active: false });
        
        if (patchResponse.success) {
          console.log('✅ useUsuarios: Usuario desactivado exitosamente');
          await fetchUsuarios(); // Recargar lista
          return true;
        } else {
          console.error('❌ useUsuarios: Error eliminando usuario:', patchResponse.message);
          setError(patchResponse.message || 'Error al eliminar usuario');
          return false;
        }
      }
    } catch (err: any) {
      console.error('❌ useUsuarios: Error eliminando usuario:', err);
      setError(err.message || 'Error de conexión al eliminar usuario');
      return false;
    }
  }, [fetchUsuarios]);

  // Cambiar estado usuario
  const cambiarEstadoUsuario = useCallback(async (id: number, activo: boolean): Promise<boolean> => {
    try {
      console.log(`🔄 useUsuarios: Cambiando estado usuario ${id} a ${activo ? 'activo' : 'inactivo'}...`);
      
      const response = await apiClient.patch(`/personas/${id}/`, { is_active: activo });
      
      if (response.success) {
        console.log('✅ useUsuarios: Estado cambiado exitosamente');
        await fetchUsuarios(); // Recargar lista
        return true;
      } else {
        console.error('❌ useUsuarios: Error cambiando estado:', response.message);
        setError(response.message || 'Error al cambiar estado del usuario');
        return false;
      }
    } catch (err: any) {
      console.error('❌ useUsuarios: Error cambiando estado:', err);
      setError(err.message || 'Error de conexión al cambiar estado');
      return false;
    }
  }, [fetchUsuarios]);

  // Ver detalle de usuario
  const verUsuario = useCallback(async (id: number): Promise<UsuarioSistema | null> => {
    try {
      console.log(`👁️ useUsuarios: Obteniendo detalle usuario ${id}...`);
      
      const response = await apiClient.get(`/personas/${id}/`);
      
      if (response.success && response.data) {
        console.log('✅ useUsuarios: Usuario obtenido exitosamente');
        
        // Transformar datos del backend al formato esperado
        const usuario = response.data as any;
        const usuarioTransformado: UsuarioSistema = {
          id: usuario.id,
          email: usuario.email || usuario.username,
          estado: usuario.is_active ? 'ACTIVO' : 'INACTIVO',
          created_at: usuario.date_joined || usuario.created_at,
          updated_at: usuario.updated_at || usuario.date_joined,
          persona: {
            id: usuario.id,
            nombre: usuario.first_name || usuario.nombres || 'N/A',
            apellido: usuario.last_name || usuario.apellidos || 'N/A',
            documento_identidad: usuario.document_id || usuario.documento_identidad || usuario.ci || 'N/A',
            telefono: usuario.phone || usuario.telefono || 'N/A',
            email: usuario.email || usuario.username,
            fecha_nacimiento: usuario.birth_date || usuario.fecha_nacimiento || null,
            genero: usuario.gender || usuario.genero || 'no_especificado',
            pais: usuario.country || usuario.pais || 'Bolivia',
            tipo_persona: usuario.role || usuario.user_type || 'usuario',
            direccion: usuario.address || usuario.direccion || '',
            edad: usuario.age || usuario.edad || null,
            nombre_completo: `${usuario.first_name || usuario.nombres || ''} ${usuario.last_name || usuario.apellidos || ''}`.trim(),
            activo: usuario.is_active !== false,
            created_at: usuario.date_joined || usuario.created_at,
            updated_at: usuario.updated_at || usuario.date_joined
          },
          roles: usuario.roles || [
            {
              id: 1,
              nombre: usuario.role || 'Usuario',
              descripcion: `Rol: ${usuario.role || 'Usuario'}`,
              activo: true,
              created_at: usuario.date_joined || usuario.created_at,
              updated_at: usuario.updated_at || usuario.date_joined
            }
          ],
          nombres: usuario.first_name || usuario.nombres || 'N/A',
          apellidos: usuario.last_name || usuario.apellidos || 'N/A',
          telefono: usuario.phone || usuario.telefono || 'N/A',
          fecha_nacimiento: usuario.birth_date || usuario.fecha_nacimiento || null,
          genero: usuario.gender || usuario.genero || 'no_especificado'
        };
        
        return usuarioTransformado;
      } else {
        console.error('❌ useUsuarios: Error obteniendo usuario:', response.message);
        setError(response.message || 'Error al obtener usuario');
        return null;
      }
    } catch (err: any) {
      console.error('❌ useUsuarios: Error obteniendo usuario:', err);
      setError(err.message || 'Error de conexión al obtener usuario');
      return null;
    }
  }, []);

  // Editar usuario (alias para actualizarUsuario)
  const editarUsuario = useCallback(async (id: number, userData: any): Promise<boolean> => {
    return actualizarUsuario(id, userData);
  }, [actualizarUsuario]);

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
    verUsuario,
    editarUsuario,
  };
}