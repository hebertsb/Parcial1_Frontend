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
    // TODO: Implementar crear usuario
    console.log('Crear usuario:', userData);
    return false;
  };

  const actualizarUsuario = async (id, userData) => {
    // TODO: Implementar actualizar usuario  
    console.log('Actualizar usuario:', id, userData);
    return false;
  };

  const eliminarUsuario = async (id) => {
    // TODO: Implementar eliminar usuario
    console.log('Eliminar usuario:', id);
    return false;
  };

  const cambiarEstadoUsuario = async (id, activo) => {
    // TODO: Implementar cambiar estado
    console.log('Cambiar estado usuario:', id, activo);
    return false;
  };

  const verUsuario = async (id) => {
    // TODO: Implementar ver usuario
    console.log('Ver usuario:', id);
    return null;
  };

  const editarUsuario = async (id, userData) => {
    // TODO: Implementar editar usuario
    console.log('Editar usuario:', id, userData);
    return false;
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
    // Compatibilidad adicional
    roles: [],
    totalPages: 1,
    currentPage: 1,
    totalCount: usuarios.length,
    filters: { page: 1, page_size: 10 },
    setFilters: () => {}
  };
}