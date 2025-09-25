/**
 * Hooks para gestión de usuarios de seguridad
 * Siguiendo la guía del backend
 */

import { useState, useEffect, useCallback } from 'react';
import { seguridadAdminService } from '../services/seguridad';
import type { 
  CrearUsuarioSeguridadRequest, 
  UsuarioSeguridad, 
  ListarUsuariosSeguridadResponse 
} from '../services/seguridad';

// =====================
// HOOK PRINCIPAL PARA USUARIOS DE SEGURIDAD
// =====================

interface UseSeguridadUsuariosReturn {
  usuarios: UsuarioSeguridad[];
  loading: boolean;
  error: string | null;
  totalCount: number;
  refetch: () => Promise<void>;
  crearUsuario: (userData: CrearUsuarioSeguridadRequest) => Promise<boolean>;
  cambiarEstado: (userId: number, isActive: boolean) => Promise<boolean>;
  resetearPassword: (userId: number, nuevaPassword: string) => Promise<boolean>;
  verUsuario: (userId: number) => Promise<UsuarioSeguridad | null>;
  editarUsuario: (userId: number, userData: {
    email?: string;
    persona?: {
      nombre?: string;
      apellido?: string;
      ci?: string;
      telefono?: string;
      direccion?: string;
    };
  }) => Promise<boolean>;
  eliminarUsuario: (userId: number) => Promise<boolean>;
}

export function useSeguridadUsuarios(): UseSeguridadUsuariosReturn {
  const [usuarios, setUsuarios] = useState<UsuarioSeguridad[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [totalCount, setTotalCount] = useState(0);

  // Cargar usuarios de seguridad
  const fetchUsuarios = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('🔄 useSeguridadUsuarios: Cargando usuarios de seguridad...');
      
      const response = await seguridadAdminService.listarUsuariosSeguridad();
      
      if (response.success && response.data) {
        // El backend devuelve: { success: true, data: Array(5), total: 5 }
        // Adaptamos a la estructura esperada
        const responseData = response.data as any;
        let usuarios: UsuarioSeguridad[] = [];
        let count = 0;
        
        console.log('🔍 useSeguridadUsuarios: Estructura de response.data:', responseData);
        
        // Función para adaptar datos del backend al formato esperado
        const adaptarUsuario = (usuario: any): UsuarioSeguridad => {
          return {
            id: usuario.usuario_id || usuario.id,
            email: usuario.email,
            persona: {
              nombre: usuario.nombres_completos ? usuario.nombres_completos.split(' ')[0] : 'Sin nombre',
              apellido: usuario.nombres_completos ? usuario.nombres_completos.split(' ').slice(1).join(' ') : 'Sin apellido',
              ci: usuario.documento_identidad || 'Sin CI',
              telefono: usuario.telefono || 'Sin teléfono',
              direccion: usuario.direccion || ''
            },
            roles: usuario.roles || ['Seguridad'],
            is_active: usuario.is_active ?? true,
            date_joined: usuario.fecha_creacion || usuario.date_joined || new Date().toISOString()
          };
        };
        
        if (Array.isArray(responseData)) {
          // Caso: response.data es directamente el array de usuarios
          usuarios = responseData.map(adaptarUsuario);
          count = usuarios.length;
          console.log('📋 useSeguridadUsuarios: Caso 1 - Array directo');
        } else if (responseData.usuarios && Array.isArray(responseData.usuarios)) {
          // Caso: response.data.usuarios contiene el array
          usuarios = responseData.usuarios.map(adaptarUsuario);
          count = responseData.count || usuarios.length;
          console.log('📋 useSeguridadUsuarios: Caso 2 - responseData.usuarios');
        } else if (responseData.data && Array.isArray(responseData.data)) {
          // Caso: response.data.data contiene el array
          usuarios = responseData.data.map(adaptarUsuario);
          count = responseData.total || usuarios.length;
          console.log('📋 useSeguridadUsuarios: Caso 3 - responseData.data');
        }
        
        setUsuarios(usuarios);
        setTotalCount(count);
        console.log(`✅ useSeguridadUsuarios: ${count} usuarios cargados exitosamente`);
        console.log('👥 useSeguridadUsuarios: Primeros usuarios:', usuarios.slice(0, 2));
      } else {
        setError(response.message || 'Error al cargar usuarios de seguridad');
        console.error('❌ useSeguridadUsuarios: Error cargando usuarios:', response.message);
      }
    } catch (err: any) {
      const errorMessage = err.message || 'Error de conexión con el servidor';
      setError(errorMessage);
      console.error('❌ useSeguridadUsuarios: Error de conexión:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Crear nuevo usuario de seguridad
  const crearUsuario = useCallback(async (userData: CrearUsuarioSeguridadRequest): Promise<boolean> => {
    try {
      console.log('➕ useSeguridadUsuarios: Creando usuario de seguridad...', userData.email);
      
      const response = await seguridadAdminService.crearUsuarioSeguridad(userData);
      
      if (response.success) {
        console.log('✅ useSeguridadUsuarios: Usuario creado exitosamente');
        // Recargar la lista
        await fetchUsuarios();
        return true;
      } else {
        console.error('❌ useSeguridadUsuarios: Error creando usuario:', response.message);
        setError(response.message || 'Error al crear usuario');
        return false;
      }
    } catch (err: any) {
      const errorMessage = err.message || 'Error de conexión al crear usuario';
      setError(errorMessage);
      console.error('❌ useSeguridadUsuarios: Error creando usuario:', err);
      return false;
    }
  }, [fetchUsuarios]);

  // Cambiar estado de usuario
  const cambiarEstado = useCallback(async (userId: number, isActive: boolean): Promise<boolean> => {
    try {
      console.log(`🔄 useSeguridadUsuarios: Cambiando estado usuario ${userId} a ${isActive ? 'activo' : 'inactivo'}...`);
      
      const response = await seguridadAdminService.cambiarEstadoUsuario(userId, isActive);
      
      if (response.success) {
        console.log('✅ useSeguridadUsuarios: Estado cambiado exitosamente');
        // Actualizar usuario en la lista local
        setUsuarios(prev => prev.map(usuario => 
          usuario.id === userId 
            ? { ...usuario, is_active: isActive }
            : usuario
        ));
        return true;
      } else {
        console.error('❌ useSeguridadUsuarios: Error cambiando estado:', response.message);
        setError(response.message || 'Error al cambiar estado del usuario');
        return false;
      }
    } catch (err: any) {
      const errorMessage = err.message || 'Error de conexión al cambiar estado';
      setError(errorMessage);
      console.error('❌ useSeguridadUsuarios: Error cambiando estado:', err);
      return false;
    }
  }, []);

  // Resetear contraseña
  const resetearPassword = useCallback(async (userId: number, nuevaPassword: string): Promise<boolean> => {
    try {
      console.log(`🔑 useSeguridadUsuarios: Reseteando contraseña usuario ${userId}...`);
      
      const response = await seguridadAdminService.resetearPassword(userId, nuevaPassword);
      
      if (response.success) {
        console.log('✅ useSeguridadUsuarios: Contraseña reseteada exitosamente');
        return true;
      } else {
        console.error('❌ useSeguridadUsuarios: Error reseteando contraseña:', response.message);
        setError(response.message || 'Error al resetear contraseña');
        return false;
      }
    } catch (err: any) {
      const errorMessage = err.message || 'Error de conexión al resetear contraseña';
      setError(errorMessage);
      console.error('❌ useSeguridadUsuarios: Error reseteando contraseña:', err);
      return false;
    }
  }, []);

  // Ver detalle de usuario
  const verUsuario = useCallback(async (userId: number): Promise<UsuarioSeguridad | null> => {
    try {
      console.log(`👁️ useSeguridadUsuarios: Obteniendo detalle usuario ${userId}...`);
      
      const response = await seguridadAdminService.verUsuarioSeguridad(userId);
      
      if (response.success && response.data) {
        console.log('✅ useSeguridadUsuarios: Usuario obtenido exitosamente');
        return response.data;
      } else {
        console.error('❌ useSeguridadUsuarios: Error obteniendo usuario:', response.message);
        setError(response.message || 'Error al obtener usuario');
        return null;
      }
    } catch (err: any) {
      const errorMessage = err.message || 'Error de conexión al obtener usuario';
      setError(errorMessage);
      console.error('❌ useSeguridadUsuarios: Error obteniendo usuario:', err);
      return null;
    }
  }, []);

  // Editar usuario
  const editarUsuario = useCallback(async (userId: number, userData: {
    email?: string;
    persona?: {
      nombre?: string;
      apellido?: string;
      ci?: string;
      telefono?: string;
      direccion?: string;
    };
  }): Promise<boolean> => {
    try {
      console.log(`✏️ useSeguridadUsuarios: Editando usuario ${userId}...`, userData);
      
      const response = await seguridadAdminService.editarUsuarioSeguridad(userId, userData);
      
      if (response.success) {
        console.log('✅ useSeguridadUsuarios: Usuario editado exitosamente');
        // Recargar la lista para obtener los datos actualizados
        await fetchUsuarios();
        return true;
      } else {
        console.error('❌ useSeguridadUsuarios: Error editando usuario:', response.message);
        setError(response.message || 'Error al editar usuario');
        return false;
      }
    } catch (err: any) {
      const errorMessage = err.message || 'Error de conexión al editar usuario';
      setError(errorMessage);
      console.error('❌ useSeguridadUsuarios: Error editando usuario:', err);
      return false;
    }
  }, [fetchUsuarios]);

  // Eliminar usuario (lógico)
  const eliminarUsuario = useCallback(async (userId: number): Promise<boolean> => {
    try {
      console.log(`🗑️ useSeguridadUsuarios: Eliminando usuario ${userId}...`);
      
      const response = await seguridadAdminService.eliminarUsuarioSeguridad(userId);
      
      if (response.success) {
        console.log('✅ useSeguridadUsuarios: Usuario eliminado exitosamente');
        // Actualizar usuario en la lista local (marcarlo como inactivo)
        setUsuarios(prev => prev.map(usuario => 
          usuario.id === userId 
            ? { ...usuario, is_active: false }
            : usuario
        ));
        return true;
      } else {
        console.error('❌ useSeguridadUsuarios: Error eliminando usuario:', response.message);
        setError(response.message || 'Error al eliminar usuario');
        return false;
      }
    } catch (err: any) {
      const errorMessage = err.message || 'Error de conexión al eliminar usuario';
      setError(errorMessage);
      console.error('❌ useSeguridadUsuarios: Error eliminando usuario:', err);
      return false;
    }
  }, []);

  // Cargar usuarios al montar el componente
  useEffect(() => {
    fetchUsuarios();
  }, [fetchUsuarios]);

  // Función para refrescar
  const refetch = useCallback(async () => {
    await fetchUsuarios();
  }, [fetchUsuarios]);

  return {
    usuarios,
    loading,
    error,
    totalCount,
    refetch,
    crearUsuario,
    cambiarEstado,
    resetearPassword,
    verUsuario,
    editarUsuario,
    eliminarUsuario
  };
}

// =====================
// HOOK PARA VALIDACIONES
// =====================

export function useValidacionesSeguridadUsuarios() {
  const validarEmail = useCallback((email: string): string | null => {
    if (!email) return 'El email es requerido';
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) return 'Formato de email inválido';
    return null;
  }, []);

  const validarPassword = useCallback((password: string): string | null => {
    if (!password) return 'La contraseña es requerida';
    if (password.length < 6) return 'La contraseña debe tener al menos 6 caracteres';
    return null;
  }, []);

  const validarCI = useCallback((ci: string): string | null => {
    if (!ci) return 'La cédula de identidad es requerida';
    if (ci.length < 7 || ci.length > 8) return 'La cédula debe tener entre 7 y 8 dígitos';
    if (!/^\d+$/.test(ci)) return 'La cédula solo debe contener números';
    return null;
  }, []);

  const validarTelefono = useCallback((telefono: string): string | null => {
    if (!telefono) return 'El teléfono es requerido';
    if (telefono.length < 8) return 'El teléfono debe tener al menos 8 dígitos';
    return null;
  }, []);

  const validarFormulario = useCallback((datos: CrearUsuarioSeguridadRequest): Record<string, string> => {
    const errores: Record<string, string> = {};

    const errorEmail = validarEmail(datos.email);
    if (errorEmail) errores.email = errorEmail;

    const errorPassword = validarPassword(datos.password);
    if (errorPassword) errores.password = errorPassword;

    if (!datos.persona.nombre.trim()) errores.nombre = 'El nombre es requerido';
    if (!datos.persona.apellido.trim()) errores.apellido = 'El apellido es requerido';

    const errorCI = validarCI(datos.persona.ci);
    if (errorCI) errores.ci = errorCI;

    const errorTelefono = validarTelefono(datos.persona.telefono);
    if (errorTelefono) errores.telefono = errorTelefono;

    return errores;
  }, [validarEmail, validarPassword, validarCI, validarTelefono]);

  return {
    validarEmail,
    validarPassword,
    validarCI,
    validarTelefono,
    validarFormulario
  };
}