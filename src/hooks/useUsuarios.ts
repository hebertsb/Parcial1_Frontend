/**
 * Hook useUsuarios - VERSIÓN LIMPIA Y FUNCIONAL
 * Conecta con http://127.0.0.1:8000/api/authz/usuarios/
 */

import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/contexts/auth-context';
import type { UserRole } from '@/core/types';

// Mapeo de tipo_persona a rol descriptivo
const mapearTipoPersonaARol = (tipo: string) => {
  const mapeo = {
    'administrador': { id: 1, nombre: 'Administrador', descripcion: 'Acceso completo al sistema', activo: true },
    'propietario': { id: 3, nombre: 'Propietario', descripcion: 'Propietario de unidad', activo: true },
    'inquilino': { id: 4, nombre: 'Inquilino', descripcion: 'Inquilino de unidad', activo: true },
    'seguridad': { id: 2, nombre: 'Seguridad', descripcion: 'Personal de seguridad', activo: true }
  };
  return mapeo[tipo] || { id: 0, nombre: 'Sin rol', descripcion: 'Sin rol asignado', activo: false };
};

// Mapeo de rol ID a UserRole para contexto de autenticación
const mapearRolIdAUserRole = (rolId: number): UserRole => {
  const mapeo = {
    1: 'administrador' as UserRole,
    2: 'seguridad' as UserRole, 
    3: 'propietario' as UserRole,
    4: 'inquilino' as UserRole
  };
  return mapeo[rolId] || 'inquilino' as UserRole;
};

export interface Usuario {
  id: number;
  email: string;
  estado: string;
  nombres: string;
  apellidos: string;
  documento_identidad: string;
  telefono: string;
  fecha_nacimiento: string;
  genero: string;
  roles: Array<{
    id: number;
    nombre: string;
    descripcion: string;
  }>;
  persona?: {
    id: number;
    nombre: string;
    apellido: string;
    tipo_persona: string;
    nombre_completo: string;
  };
}

export const useUsuarios = () => {
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { user, login } = useAuth();

  // Cargar usuarios desde backend
  const cargarUsuarios = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const token = localStorage.getItem('access_token');
      if (!token) {
        throw new Error('No hay token de autenticación');
      }

      console.log('🚀 useUsuarios: Llamando a endpoint de authz para gestión de usuarios');
      
      const response = await fetch('http://127.0.0.1:8000/api/authz/usuarios/', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`Error HTTP: ${response.status}`);
      }

      const data = await response.json();
      console.log('✅ Respuesta del backend:', data);
      
      const usuariosFormateados = data.map((usuario: any) => ({
        id: usuario.id,
        email: usuario.email,
        estado: usuario.estado,
        nombres: usuario.nombres || '',
        apellidos: usuario.apellidos || '',
        documento_identidad: usuario.documento_identidad,
        telefono: usuario.telefono,
        fecha_nacimiento: usuario.fecha_nacimiento,
        genero: usuario.genero,
        roles: usuario.roles || [],
        persona: usuario.persona
      }));

      setUsuarios(usuariosFormateados);
      console.log('✅ useUsuarios:', usuariosFormateados.length, 'usuarios cargados desde backend REAL');
      
    } catch (err) {
      console.error('❌ Error cargando usuarios:', err);
      setError(err instanceof Error ? err.message : 'Error desconocido');
    } finally {
      setLoading(false);
    }
  }, []);

  // Ver usuario específico
  const verUsuario = async (id: number): Promise<Usuario | null> => {
    try {
      const token = localStorage.getItem('access_token');
      if (!token) {
        throw new Error('No hay token de autenticación');
      }

      console.log('🚀 Obteniendo usuario desde authz:', id);
      
      const response = await fetch(`http://127.0.0.1:8000/api/authz/usuarios/${id}/`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const usuario = await response.json();
      console.log('✅ Usuario obtenido desde authz:', usuario);
      
      return {
        id: usuario.id,
        email: usuario.email,
        estado: usuario.estado,
        nombres: usuario.nombres || '',
        apellidos: usuario.apellidos || '',
        documento_identidad: usuario.documento_identidad,
        telefono: usuario.telefono,
        fecha_nacimiento: usuario.fecha_nacimiento,
        genero: usuario.genero,
        roles: usuario.roles || [],
        persona: usuario.persona
      };
      
    } catch (err) {
      console.error('❌ Error obteniendo usuario:', err);
      throw err;
    }
  };

  // Eliminar usuario
  const eliminarUsuario = async (id: number): Promise<void> => {
    try {
      const token = localStorage.getItem('access_token');
      if (!token) {
        throw new Error('No hay token de autenticación');
      }

      const response = await fetch(`http://127.0.0.1:8000/api/authz/usuarios/${id}/`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      // Recargar lista después de eliminar
      await cargarUsuarios();
      
    } catch (err) {
      console.error('❌ Error eliminando usuario:', err);
      throw err;
    }
  };

  // Cambiar rol de usuario (SOLO UN PROPIETARIO A LA VEZ)
  const transferirPropiedad = async (inquilinoId: number): Promise<Usuario> => {
    try {
      const token = localStorage.getItem('access_token');
      if (!token) {
        throw new Error('No hay token de autenticación');
      }

      console.log('🏠 Iniciando transferencia de propiedad para usuario:', inquilinoId);
      
      // PASO 1: Obtener lista actualizada y buscar propietario actual
      console.log('🔍 Obteniendo lista actualizada de usuarios para buscar propietario actual...');
      
      const responseUsuarios = await fetch('http://127.0.0.1:8000/api/authz/usuarios/', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (!responseUsuarios.ok) {
        throw new Error('No se pudo obtener lista de usuarios');
      }
      
      const usuariosActualizados = await responseUsuarios.json();
      const propietarioActual = usuariosActualizados.find((usuario: any) => 
        usuario.roles.some((rol: any) => {
          const rolId = typeof rol === 'number' ? rol : rol.id;
          return rolId === 3;
        })
      );
      
      if (propietarioActual && propietarioActual.id !== inquilinoId) {
        console.log('👤 Propietario actual encontrado:', {
          id: propietarioActual.id,
          email: propietarioActual.email,
          nombres: propietarioActual.nombres + ' ' + propietarioActual.apellidos,
          roles: propietarioActual.roles
        });
        console.log('🔄 Convirtiéndolo a inquilino...');
        
        const requestBodyInquilino = { roles: [4] }; // ID 4 = Inquilino
        const responseInquilino = await fetch(`http://127.0.0.1:8000/api/authz/usuarios/${propietarioActual.id}/`, {
          method: 'PATCH',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(requestBodyInquilino)
        });
        
        console.log('📥 Response status (cambio a inquilino):', responseInquilino.status);
        
        if (responseInquilino.ok) {
          const resultadoInquilino = await responseInquilino.json();
          console.log('✅ Propietario anterior convertido a inquilino:', resultadoInquilino);
        } else {
          const errorInquilino = await responseInquilino.text();
          console.warn('⚠️ Error convirtiendo propietario anterior:', responseInquilino.status, errorInquilino);
          console.warn('⚠️ Continuando con la asignación del nuevo propietario...');
        }
      } else if (propietarioActual?.id === inquilinoId) {
        console.log('ℹ️ El usuario ya es propietario, no hay cambios necesarios');
        return propietarioActual;
      } else {
        if (!propietarioActual) {
          console.log('ℹ️ No hay propietario actual en el sistema');
        } else {
          console.log('ℹ️ El usuario ya es el propietario actual');
        }
        console.log('📝 Total usuarios en sistema:', usuariosActualizados.length);
        console.log('🔍 Usuarios con rol 3 (propietario):', 
          usuariosActualizados.filter((u: any) => 
            u.roles.some((r: any) => (typeof r === 'number' ? r : r.id) === 3)
          ).map((u: any) => ({ id: u.id, email: u.email, roles: u.roles }))
        );
      }
      
      // PASO 2: Cambiar el nuevo usuario a propietario
      console.log('🏠 Cambiando usuario', inquilinoId, 'a propietario');
      const requestBody = { roles: [3] }; // ID 3 = Propietario
      console.log('📤 Request body:', JSON.stringify(requestBody));
      
      const response = await fetch(`http://127.0.0.1:8000/api/authz/usuarios/${inquilinoId}/`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestBody)
      });
      
      console.log('📥 Response status:', response.status, response.statusText);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `HTTP ${response.status}: ${response.statusText}`);
      }

      const resultado = await response.json();
      console.log('✅ Nuevo propietario asignado:', resultado);
      
      // Verificar que el cambio se aplicó correctamente
      // El backend puede devolver roles como [3] o como [{id: 3}]
      const rolesIds = resultado.roles?.map((r: any) => 
        typeof r === 'number' ? r : r.id
      ) || [];
      const tieneRolPropietario = rolesIds.includes(3);
      console.log('🎯 Roles actuales del nuevo propietario:', rolesIds);
      console.log('🏠 ¿Es propietario?', tieneRolPropietario);
      
      if (tieneRolPropietario) {
        console.log('🎉 TRANSFERENCIA EXITOSA: Solo hay un propietario en el sistema');
      } else {
        console.warn('⚠️ PROBLEMA: El cambio no se aplicó correctamente');
      }
      
      // Si el usuario transferido es el usuario actual, actualizar su información de sesión
      if (user && Number(user.id) === inquilinoId) {
        console.log('🔄 Actualizando usuario actual después de transferencia');
        const usuarioActualizado = {
          ...user,
          role: 'propietario' as UserRole,
          tipo_persona: 'propietario'
        };
        login(usuarioActualizado);
        console.log('✅ Usuario actual actualizado a propietario');
      }

      // Recargar lista para reflejar cambios
      await cargarUsuarios();
      
      return resultado;
      
    } catch (err) {
      console.error('❌ Error cambiando rol a propietario:', err);
      throw err;
    }
  };

  // Cambiar tipo de persona genérico
  const cambiarTipoPersona = async (usuarioId: number, nuevoTipo: 'propietario' | 'inquilino'): Promise<Usuario> => {
    const rolId = nuevoTipo === 'propietario' ? 3 : 4;
    
    try {
      const token = localStorage.getItem('access_token');
      if (!token) {
        throw new Error('No hay token de autenticación');
      }

      console.log(`🔄 Cambiando rol de usuario ${usuarioId} a ${nuevoTipo} (rol ID: ${rolId})`);
      
      const requestBody = { roles: [rolId] };
      
      const response = await fetch(`http://127.0.0.1:8000/api/authz/usuarios/${usuarioId}/`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestBody)
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `HTTP ${response.status}: ${response.statusText}`);
      }

      const resultado = await response.json();
      console.log(`✅ Rol cambiado a ${nuevoTipo}:`, resultado);
      
      // Recargar lista para reflejar cambios
      await cargarUsuarios();
      
      return resultado;
      
    } catch (err) {
      console.error(`❌ Error cambiando rol a ${nuevoTipo}:`, err);
      throw err;
    }
  };

  // Cargar usuarios al montar el componente
  useEffect(() => {
    cargarUsuarios();
  }, [cargarUsuarios]);

  return {
    usuarios,
    loading,
    error,
    cargarUsuarios,
    verUsuario,
    eliminarUsuario,
    transferirPropiedad,
    cambiarTipoPersona,
    mapearTipoPersonaARol,
    mapearRolIdAUserRole
  };
};