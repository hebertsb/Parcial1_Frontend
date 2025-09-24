/**
 * Hook para gestión de propietarios
 * Maneja solicitudes, aprobaciones y registro de propietarios
 */

import { useState, useEffect, useCallback } from 'react';
import { propietariosService } from '../features/propietarios/services';
import type { 
  SolicitudRegistroPropietario, 
  SolicitudPendiente, 
  PropietarioRegistrado 
} from '../features/propietarios/services';

interface UsePropietariosReturn {
  // Estados
  solicitudes: SolicitudPendiente[];
  propietarios: PropietarioRegistrado[];
  loading: boolean;
  error: string | null;
  
  // Acciones de solicitudes
  enviarSolicitudRegistro: (data: SolicitudRegistroPropietario) => Promise<boolean>;
  cargarSolicitudesPendientes: () => Promise<void>;
  aprobarSolicitud: (id: number, observaciones?: string) => Promise<boolean>;
  rechazarSolicitud: (id: number, motivo: string) => Promise<boolean>;
  
  // Acciones de propietarios
  cargarPropietarios: () => Promise<void>;
  
  // Utilidades
  refetch: () => Promise<void>;
}

export function usePropietarios(): UsePropietariosReturn {
  const [solicitudes, setSolicitudes] = useState<SolicitudPendiente[]>([]);
  const [propietarios, setPropietarios] = useState<PropietarioRegistrado[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // ============================================================================
  // GESTIÓN DE SOLICITUDES
  // ============================================================================

  const enviarSolicitudRegistro = useCallback(async (data: SolicitudRegistroPropietario): Promise<boolean> => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('📝 usePropietarios: Enviando solicitud de registro...', data.email);
      const response = await propietariosService.registroInicial(data);
      
      if (response.success) {
        console.log('✅ usePropietarios: Solicitud enviada exitosamente');
        return true;
      } else {
        throw new Error(response.message || 'Error al enviar solicitud');
      }
    } catch (err: any) {
      console.error('❌ usePropietarios: Error enviando solicitud:', err);
      setError(err.message || 'Error al enviar solicitud de registro');
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  const cargarSolicitudesPendientes = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('📋 usePropietarios: Cargando solicitudes pendientes...');
      const response = await propietariosService.getSolicitudesPendientes();
      
      if (response.success && response.data) {
        setSolicitudes(response.data);
        console.log(`✅ usePropietarios: ${response.data.length} solicitudes cargadas`);
      } else {
        throw new Error(response.message || 'Error al cargar solicitudes');
      }
    } catch (err: any) {
      console.error('❌ usePropietarios: Error cargando solicitudes:', err);
      setError(err.message || 'Error al cargar solicitudes pendientes');
      setSolicitudes([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const aprobarSolicitud = useCallback(async (id: number, observaciones?: string): Promise<boolean> => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('✅ usePropietarios: Aprobando solicitud...', id);
      const response = await propietariosService.aprobarSolicitud(id, observaciones);
      
      if (response.success) {
        console.log('✅ usePropietarios: Solicitud aprobada exitosamente');
        // Recargar solicitudes para actualizar la lista
        await cargarSolicitudesPendientes();
        return true;
      } else {
        throw new Error(response.message || 'Error al aprobar solicitud');
      }
    } catch (err: any) {
      console.error('❌ usePropietarios: Error aprobando solicitud:', err);
      setError(err.message || 'Error al aprobar solicitud');
      return false;
    } finally {
      setLoading(false);
    }
  }, [cargarSolicitudesPendientes]);

  const rechazarSolicitud = useCallback(async (id: number, motivo: string): Promise<boolean> => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('❌ usePropietarios: Rechazando solicitud...', id);
      const response = await propietariosService.rechazarSolicitud(id, motivo);
      
      if (response.success) {
        console.log('✅ usePropietarios: Solicitud rechazada exitosamente');
        // Recargar solicitudes para actualizar la lista
        await cargarSolicitudesPendientes();
        return true;
      } else {
        throw new Error(response.message || 'Error al rechazar solicitud');
      }
    } catch (err: any) {
      console.error('❌ usePropietarios: Error rechazando solicitud:', err);
      setError(err.message || 'Error al rechazar solicitud');
      return false;
    } finally {
      setLoading(false);
    }
  }, [cargarSolicitudesPendientes]);

  // ============================================================================
  // GESTIÓN DE PROPIETARIOS
  // ============================================================================

  const cargarPropietarios = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('👥 usePropietarios: Cargando propietarios...');
      const response = await propietariosService.getPropietarios();
      
      if (response.success && response.data) {
        setPropietarios(response.data);
        console.log(`✅ usePropietarios: ${response.data.length} propietarios cargados`);
      } else {
        throw new Error(response.message || 'Error al cargar propietarios');
      }
    } catch (err: any) {
      console.error('❌ usePropietarios: Error cargando propietarios:', err);
      setError(err.message || 'Error al cargar propietarios');
      setPropietarios([]);
    } finally {
      setLoading(false);
    }
  }, []);

  // ============================================================================
  // UTILIDADES
  // ============================================================================

  const refetch = useCallback(async () => {
    await Promise.all([
      cargarSolicitudesPendientes(),
      cargarPropietarios()
    ]);
  }, [cargarSolicitudesPendientes, cargarPropietarios]);

  // ============================================================================
  // EFECTOS
  // ============================================================================

  useEffect(() => {
    // Cargar datos iniciales solo si estamos en admin
    // En un caso real, esto dependería del rol del usuario
    cargarSolicitudesPendientes();
    cargarPropietarios();
  }, [cargarSolicitudesPendientes, cargarPropietarios]);

  return {
    // Estados
    solicitudes,
    propietarios,
    loading,
    error,
    
    // Acciones de solicitudes
    enviarSolicitudRegistro,
    cargarSolicitudesPendientes,
    aprobarSolicitud,
    rechazarSolicitud,
    
    // Acciones de propietarios
    cargarPropietarios,
    
    // Utilidades
    refetch
  };
}

export default usePropietarios;