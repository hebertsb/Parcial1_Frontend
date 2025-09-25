/**
 * Hook useUsuarios - VERSIÓN CORREGIDA SEGÚN PAYLOAD REAL
 * Conecta con http://127.0.0.1:8000/api/personas/
 * 
 * CAMPOS DISPONIBLES EN BACKEND (confirmados):
 * - id, nombre, apellido, nombre_completo
 * - documento_identidad, telefono, email
 * - tipo_persona, activo
 * 
 * CAMPOS QUE NO EXISTEN:
 * - profesion ❌ (eliminar)
 * - unidad ❌ (está en /api/viviendas/ o /api/propiedades/)
 * - rol ❌ (usar tipo_persona)
 */

import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/contexts/auth-context';
import type { UserRole } from '@/core/types';

// Mapeo de tipo_persona a rol descriptivo
const mapearTipoPersonaARol = (tipo: string) => {
  const mapeo = {
    'administrador': {
      id: 1,
      nombre: 'Administrador',
      descripcion: 'Acceso completo al sistema',
      activo: true
    },
    'propietario': {
      id: 2, 
      nombre: 'Propietario',
      descripcion: 'Propietario de unidad',
      activo: true
    },
    'inquilino': {
      id: 3,
      nombre: 'Inquilino', 
      descripcion: 'Inquilino de unidad',
      activo: true
    },
    'seguridad': {
      id: 4,
      nombre: 'Seguridad',
      descripcion: 'Personal de seguridad',
      activo: true
    },
    'cliente': {
      id: 5,
      nombre: 'Cliente',
      descripcion: 'Cliente general',
      activo: true
    }
  };
  
  return mapeo[tipo] || {
    id: 0,
    nombre: tipo,
    descripcion: `Tipo: ${tipo}`,
    activo: true
  };
};

export function useUsuarios() {
  const { user, login } = useAuth();
  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const cargarUsuarios = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const token = localStorage.getItem('access_token');
      if (!token) {
        throw new Error('No hay token de autenticación');
      }

      console.log('🚀 Llamando a backend real: http://127.0.0.1:8000/api/personas/');
      
      const response = await fetch('http://127.0.0.1:8000/api/personas/', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('Token expirado. Inicia sesión nuevamente.');
        }
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      console.log('✅ Respuesta del backend:', data);
      
      if (Array.isArray(data) && data.length > 0) {
        console.log('🔍 Campos disponibles en primera persona:', Object.keys(data[0]));
        console.log('🔍 Ejemplo persona completa:', data[0]);
      }

      // Transformar datos del backend al formato del frontend
      const usuariosTransformados = data.map(persona => {
        const rolInfo = mapearTipoPersonaARol(persona.tipo_persona);
        
        return {
          // IDs
          id: persona.id,
          
          // Información personal (campos reales del backend)
          email: persona.email,
          nombres: persona.nombre,
          apellidos: persona.apellido,
          telefono: persona.telefono || 'N/A',
          documento_identidad: persona.documento_identidad,
          
          // Estado
          estado: persona.activo ? 'ACTIVO' : 'INACTIVO',
          activo: persona.activo,
          
          // Rol mapeado desde tipo_persona
          rol: rolInfo,
          
          // Fechas (no disponibles en este endpoint, usar valores por defecto)
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          fecha_registro: new Date().toISOString(),

          // Datos de la persona
          persona: {
            id: persona.id,
            nombre: persona.nombre,
            apellido: persona.apellido,
            nombre_completo: persona.nombre_completo,
            documento_identidad: persona.documento_identidad,
            telefono: persona.telefono,
            email: persona.email,
            tipo_persona: persona.tipo_persona,
            activo: persona.activo
          },
          
          // Array de roles para compatibilidad
          roles: [rolInfo]
        };
      });

      setUsuarios(usuariosTransformados);
      console.log(`✅ useUsuarios: ${usuariosTransformados.length} usuarios cargados desde backend REAL`);
      
    } catch (err) {
      console.error('❌ Error cargando usuarios:', err);
      setError(err.message || 'Error desconocido');
      setUsuarios([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    cargarUsuarios();
  }, [cargarUsuarios]);

  // Funciones adicionales para compatibilidad
  const refetch = cargarUsuarios;
  const recargar = cargarUsuarios;

  const crearUsuario = async (userData) => {
    try {
      const token = localStorage.getItem('access_token');
      if (!token) {
        throw new Error('No hay token de autenticación');
      }

      console.log('🚀 Creando usuario completo:', userData);

      // Verificar si es un usuario completo (con credenciales) o solo persona
      if (userData.usuario && userData.persona) {
        // OPCIÓN 1: Usuario completo con credenciales
        console.log('👤 Creando usuario del sistema con credenciales...');
        
        // Paso 1: Crear la persona primero
        const datosPersona = {
          nombre: userData.persona.nombre,
          apellido: userData.persona.apellido,
          documento_identidad: userData.persona.documento_identidad,
          telefono: userData.persona.telefono,
          email: userData.persona.email,
          tipo_persona: userData.persona.tipo_persona,
          activo: userData.persona.activo !== false
        };

        const responsePersona = await fetch('http://127.0.0.1:8000/api/personas/', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(datosPersona)
        });

        if (!responsePersona.ok) {
          const errorData = await responsePersona.json().catch(() => ({}));
          throw new Error(errorData.detail || `Error creando persona: HTTP ${responsePersona.status}`);
        }

        const nuevaPersona = await responsePersona.json();
        console.log('✅ Persona creada:', nuevaPersona);

        // Paso 2: Crear usuario del sistema con credenciales
        const datosUsuario = {
          username: userData.usuario.username,
          password: userData.usuario.password,
          email: userData.usuario.email,
          is_active: userData.usuario.is_active,
          is_staff: userData.usuario.is_staff,
          persona_id: nuevaPersona.id // Vincular con la persona creada
        };

        console.log('🔐 Creando credenciales de acceso...');
        const responseUsuario = await fetch('http://127.0.0.1:8000/api/usuarios/', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(datosUsuario)
        });

        if (!responseUsuario.ok) {
          // Si falla la creación del usuario, intentar eliminar la persona creada
          console.warn('⚠️ Error creando usuario, intentando limpiar persona creada...');
          try {
            await fetch(`http://127.0.0.1:8000/api/personas/${nuevaPersona.id}/`, {
              method: 'DELETE',
              headers: { 'Authorization': `Bearer ${token}` }
            });
          } catch (cleanupErr) {
            console.error('Error en cleanup:', cleanupErr);
          }
          
          const errorData = await responseUsuario.json().catch(() => ({}));
          throw new Error(errorData.detail || `Error creando usuario: HTTP ${responseUsuario.status}`);
        }

        const nuevoUsuario = await responseUsuario.json();
        console.log('✅ Usuario del sistema creado:', nuevoUsuario);

      } else {
        // OPCIÓN 2: Solo crear persona (compatibilidad con versión anterior)
        console.log('📄 Creando solo persona (sin credenciales)...');
        
        const datosPersona = {
          nombre: userData.nombre || userData.persona?.nombre,
          apellido: userData.apellido || userData.persona?.apellido,
          documento_identidad: userData.documento_identidad || userData.persona?.documento_identidad,
          telefono: userData.telefono || userData.persona?.telefono,
          email: userData.email || userData.persona?.email,
          tipo_persona: userData.tipo_persona || userData.persona?.tipo_persona,
          activo: (userData.activo !== false) && (userData.persona?.activo !== false)
        };

        const response = await fetch('http://127.0.0.1:8000/api/personas/', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(datosPersona)
        });

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(errorData.detail || `HTTP ${response.status}: ${response.statusText}`);
        }

        const nuevaPersona = await response.json();
        console.log('✅ Persona creada (sin credenciales):', nuevaPersona);
      }
      
      // Recargar la lista
      await cargarUsuarios();
      return true;

    } catch (err) {
      console.error('❌ Error creando usuario:', err);
      setError(err.message || 'Error creando usuario');
      return false;
    }
  };

  const actualizarUsuario = async (id, userData) => {
    try {
      const token = localStorage.getItem('access_token');
      if (!token) {
        throw new Error('No hay token de autenticación');
      }

      console.log('🚀 Actualizando usuario:', id, userData);

      // Preparar datos según la documentación del backend CRUD
      const datosPersona = {
        nombre: userData.nombre,
        apellido: userData.apellido,
        documento_identidad: userData.documento_identidad,
        telefono: userData.telefono || '',
        email: userData.email,
        tipo_persona: userData.tipo_persona,
        activo: userData.activo
      };

      console.log('📝 Datos a enviar:', datosPersona);

      // Usar PATCH que ahora está implementado en el backend CRUD
      const response = await fetch(`http://127.0.0.1:8000/api/personas/${id}/`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(datosPersona)
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.detail || errorData.error || `HTTP ${response.status}: ${response.statusText}`);
      }

      const personaActualizada = await response.json();
      console.log('✅ Usuario actualizado:', personaActualizada);
      
      // Recargar la lista
      await cargarUsuarios();
      return true;

    } catch (err) {
      console.error('❌ Error actualizando usuario:', err);
      setError(err.message || 'Error actualizando usuario');
      return false;
    }
  };

  const eliminarUsuario = async (id) => {
    try {
      const token = localStorage.getItem('access_token');
      if (!token) {
        throw new Error('No hay token de autenticación');
      }

      console.log('🚀 Eliminando usuario (lógico):', id);

      // Eliminación lógica: cambiar activo a false
      const response = await fetch(`http://127.0.0.1:8000/api/personas/${id}/`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ activo: false })
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.detail || `HTTP ${response.status}: ${response.statusText}`);
      }

      console.log('✅ Usuario eliminado (lógicamente)');
      
      // Recargar la lista
      await cargarUsuarios();
      return true;

    } catch (err) {
      console.error('❌ Error eliminando usuario:', err);
      setError(err.message || 'Error eliminando usuario');
      return false;
    }
  };

  const cambiarEstadoUsuario = async (id, activo) => {
    try {
      const token = localStorage.getItem('access_token');
      if (!token) {
        throw new Error('No hay token de autenticación');
      }

      console.log('🚀 Cambiando estado usuario:', id, activo);

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
        throw new Error(errorData.detail || `HTTP ${response.status}: ${response.statusText}`);
      }

      console.log('✅ Estado cambiado');
      
      // Recargar la lista
      await cargarUsuarios();
      return true;

    } catch (err) {
      console.error('❌ Error cambiando estado:', err);
      setError(err.message || 'Error cambiando estado');
      return false;
    }
  };

  const verUsuario = async (id) => {
    try {
      const token = localStorage.getItem('access_token');
      if (!token) {
        throw new Error('No hay token de autenticación');
      }

      console.log('🚀 Obteniendo usuario:', id);

      const response = await fetch(`http://127.0.0.1:8000/api/personas/${id}/`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.detail || `HTTP ${response.status}: ${response.statusText}`);
      }

      const persona = await response.json();
      console.log('✅ Usuario obtenido:', persona);
      
      // Transformar a formato del frontend
      const rolInfo = mapearTipoPersonaARol(persona.tipo_persona);
      return {
        id: persona.id,
        email: persona.email,
        nombres: persona.nombre,
        apellidos: persona.apellido,
        telefono: persona.telefono || 'N/A',
        documento_identidad: persona.documento_identidad,
        estado: persona.activo ? 'ACTIVO' : 'INACTIVO',
        activo: persona.activo,
        rol: rolInfo,
        persona: persona,
        roles: [rolInfo]
      };

    } catch (err) {
      console.error('❌ Error obteniendo usuario:', err);
      setError(err.message || 'Error obteniendo usuario');
      return null;
    }
  };

  const editarUsuario = async (id, userData) => {
    // Alias para actualizarUsuario
    return await actualizarUsuario(id, userData);
  };

  const transferirPropiedad = async (inquilinoId, accionPropietarioAnterior = 'desactivar') => {
    try {
      const token = localStorage.getItem('access_token');
      if (!token) {
        throw new Error('No hay token de autenticación');
      }

      console.log('🏠 Transfiriendo propiedad:', inquilinoId, accionPropietarioAnterior);

      const response = await fetch(`http://127.0.0.1:8000/api/personas/${inquilinoId}/transferir_propiedad/`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          accion_propietario_anterior: accionPropietarioAnterior
        })
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `HTTP ${response.status}: ${response.statusText}`);
      }

      const resultado = await response.json();
      console.log('✅ Transferencia completada:', resultado);
      
      // Si el usuario transferido es el usuario actual, actualizar su información de sesión
      if (user && user.id === inquilinoId) {
        console.log('🔄 Actualizando usuario actual después de transferencia');
        const usuarioActualizado = {
          ...user,
          role: 'propietario' as UserRole,
          tipo_persona: 'propietario'
        };
        login(usuarioActualizado);
        console.log('✅ Usuario actual actualizado a propietario');
      }
      
      // Recargar la lista para reflejar cambios
      await cargarUsuarios();
      return resultado;

    } catch (err) {
      console.error('❌ Error transfiriendo propiedad:', err);
      setError(err.message || 'Error transfiriendo propiedad');
      return null;
    }
  };

  const cambiarTipoPersona = async (id, nuevoTipo) => {
    try {
      const token = localStorage.getItem('access_token');
      if (!token) {
        throw new Error('No hay token de autenticación');
      }

      console.log('🔄 Cambiando tipo de persona:', id, nuevoTipo);

      const response = await fetch(`http://127.0.0.1:8000/api/personas/${id}/cambiar_tipo/`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          tipo_persona: nuevoTipo
        })
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `HTTP ${response.status}: ${response.statusText}`);
      }

      const resultado = await response.json();
      console.log('✅ Tipo cambiado:', resultado);
      
      // Recargar la lista
      await cargarUsuarios();
      return resultado;

    } catch (err) {
      console.error('❌ Error cambiando tipo:', err);
      setError(err.message || 'Error cambiando tipo');
      return false;
    }
  };

  return {
    usuarios,
    loading,
    error,
    refetch,
    recargar,
    crearUsuario,
    actualizarUsuario,
    eliminarUsuario,
    cambiarEstadoUsuario,
    verUsuario,
    editarUsuario,
    transferirPropiedad,
    cambiarTipoPersona,
    // Compatibilidad adicional
    roles: [],
    totalPages: 1,
    currentPage: 1,
    totalCount: usuarios.length,
    filters: { page: 1, page_size: 10 },
    setFilters: () => {}
  };
}