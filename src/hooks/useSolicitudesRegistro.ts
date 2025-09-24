/**
 * Hook para gestión de solicitudes de registro
 * Proporciona funcionalidades para cargar y procesar solicitudes de propietarios
 */

import { useState, useCallback, useEffect } from 'react';
import { 
  obtenerSolicitudesRegistro,
  obtenerEstadisticasSolicitudes,
  procesarSolicitudCompleta,
  type SolicitudRegistroAPI
} from '@/features/admin/solicitudes-service';

interface UseSolicitudesRegistroReturn {
  // Estado
  solicitudes: SolicitudRegistroAPI[];
  estadisticas: {
    total: number;
    pendientes: number;
    aprobadas: number;
    rechazadas: number;
    nuevas_hoy: number;
  } | null;
  isLoading: boolean;
  error: string | null;
  
  // Acciones
  cargarSolicitudes: () => Promise<void>;
  cargarEstadisticas: () => Promise<void>;
  procesarSolicitud: (solicitudId: number, decision: 'aprobar' | 'rechazar', observaciones?: string) => Promise<void>;
  
  // Utilidades
  clearError: () => void;
  obtenerSolicitudesPendientes: () => SolicitudRegistroAPI[];
  obtenerContadorPendientes: () => number;
}

export function useSolicitudesRegistro(): UseSolicitudesRegistroReturn {
  const [solicitudes, setSolicitudes] = useState<SolicitudRegistroAPI[]>([]);
  const [estadisticas, setEstadisticas] = useState<{
    total: number;
    pendientes: number;
    aprobadas: number;
    rechazadas: number;
    nuevas_hoy: number;
  } | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Carga todas las solicitudes de registro
   */
  const cargarSolicitudes = useCallback(async () => {
    console.log('📋 useSolicitudesRegistro: Cargando solicitudes...');
    
    try {
      setIsLoading(true);
      setError(null);

      const response = await obtenerSolicitudesRegistro();
      setSolicitudes(response.data || []);
      
      console.log('✅ useSolicitudesRegistro: Solicitudes cargadas exitosamente');
      
    } catch (error: any) {
      const errorMessage = error?.response?.data?.mensaje || 'Error al cargar solicitudes';
      setError(errorMessage);
      console.error('❌ useSolicitudesRegistro: Error cargando solicitudes:', error);
      
      // Limpiar solicitudes en caso de error
      setSolicitudes([]);
      console.log('📋 useSolicitudesRegistro: Solicitudes limpiadas por error');
      
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Carga las estadísticas de solicitudes
   */
  const cargarEstadisticas = useCallback(async () => {
    console.log('📊 useSolicitudesRegistro: Cargando estadísticas...');
    
    try {
      setError(null);

      const response = await obtenerEstadisticasSolicitudes();
      setEstadisticas(response.data);
      
      console.log('✅ useSolicitudesRegistro: Estadísticas cargadas exitosamente');
      
    } catch (error: any) {
      const errorMessage = error?.response?.data?.mensaje || 'Error al cargar estadísticas';
      console.error('❌ useSolicitudesRegistro: Error cargando estadísticas:', error);
      
      // Calcular estadísticas básicas desde los datos locales
      const pendientes = solicitudes.filter(s => s.estado === 'pendiente').length;
      const aprobadas = solicitudes.filter(s => s.estado === 'aprobado').length;
      const rechazadas = solicitudes.filter(s => s.estado === 'rechazado').length;
      
      setEstadisticas({
        total: solicitudes.length,
        pendientes,
        aprobadas,
        rechazadas,
        nuevas_hoy: pendientes // Simplificación
      });
    }
  }, [solicitudes]);

  /**
   * Procesa una solicitud (aprobar o rechazar)
   */
  const procesarSolicitud = useCallback(async (
    solicitudId: number, 
    decision: 'aprobar' | 'rechazar', 
    observaciones?: string
  ) => {
    console.log('🔄 useSolicitudesRegistro: Procesando solicitud...', solicitudId, decision);
    
    try {
      setIsLoading(true);
      setError(null);

      await procesarSolicitudCompleta(solicitudId, {
        decision: decision,
        observaciones_admin: observaciones
      });
      
      // Actualizar estado local
      setSolicitudes(prev => prev.map(s => 
        s.id === solicitudId 
          ? { ...s, estado: decision === 'aprobar' ? 'aprobado' : 'rechazado' }
          : s
      ));
      
      // Recargar estadísticas
      await cargarEstadisticas();
      
      console.log('✅ useSolicitudesRegistro: Solicitud procesada exitosamente');
      
    } catch (error: any) {
      const errorMessage = error?.response?.data?.mensaje || 'Error al procesar solicitud';
      setError(errorMessage);
      console.error('❌ useSolicitudesRegistro: Error procesando solicitud:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [cargarEstadisticas]);

  /**
   * Obtiene solo las solicitudes pendientes
   */
  const obtenerSolicitudesPendientes = useCallback(() => {
    return solicitudes.filter(s => s.estado === 'pendiente');
  }, [solicitudes]);

  /**
   * Obtiene el contador de solicitudes pendientes
   */
  const obtenerContadorPendientes = useCallback(() => {
    return solicitudes.filter(s => s.estado === 'pendiente').length;
  }, [solicitudes]);

  /**
   * Limpia el estado de error
   */
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  // Cargar datos iniciales
  useEffect(() => {
    cargarSolicitudes();
  }, [cargarSolicitudes]);

  // Cargar estadísticas cuando cambien las solicitudes
  useEffect(() => {
    if (solicitudes.length > 0) {
      cargarEstadisticas();
    }
  }, [solicitudes, cargarEstadisticas]);

  return {
    // Estado
    solicitudes,
    estadisticas,
    isLoading,
    error,
    
    // Acciones
    cargarSolicitudes,
    cargarEstadisticas,
    procesarSolicitud,
    
    // Utilidades
    clearError,
    obtenerSolicitudesPendientes,
    obtenerContadorPendientes,
  };
}