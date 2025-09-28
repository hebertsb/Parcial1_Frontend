import { useState, useEffect } from 'react';
import { getEstadisticasViviendas } from '@/features/viviendas/services';
import { apiClient } from '@/core/api/client';

export interface EstadisticasAdmin {
  totalUnidades: number;
  totalUsuarios: number;
  totalPropietarios: number;
  totalInquilinos: number;
  unidadesOcupadas: number;
  unidadesDisponibles: number;
  unidadesAlquiladas: number;
  solicitudesPendientes: number;
  problemasReportados: number;
  ingresosMensuales: number;
}

export function useEstadisticasAdmin() {
  const [estadisticas, setEstadisticas] = useState<EstadisticasAdmin>({
    totalUnidades: 0,
    totalUsuarios: 0,
    totalPropietarios: 0,
    totalInquilinos: 0,
    unidadesOcupadas: 0,
    unidadesDisponibles: 0,
    unidadesAlquiladas: 0,
    solicitudesPendientes: 0,
    problemasReportados: 0,
    ingresosMensuales: 0,
  });
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const cargarEstadisticas = async () => {
    try {
      setLoading(true);
      setError(null);

      // Obtener estadísticas de viviendas con manejo de errores
      let estadisticasViviendas = { total: 0, ocupadas: 0, disponibles: 0, alquiladas: 0 };
      try {
        const resultadoViviendas = await getEstadisticasViviendas();
        estadisticasViviendas = resultadoViviendas.estadisticas || estadisticasViviendas;
      } catch (err) {
        console.warn('Error cargando estadísticas de viviendas:', err);
      }
      
      // Obtener propietarios con manejo de errores
      let propietarios: any[] = [];
      try {
        const propietariosResponse = await apiClient.get('/propiedades/');
        propietarios = (propietariosResponse.data as any)?.results || propietariosResponse.data || [];
      } catch (err) {
        console.warn('Error cargando propietarios:', err);
      }
      
      // Obtener inquilinos con manejo de errores
      let inquilinos: any[] = [];
      try {
        const inquilinosResponse = await apiClient.get('/personas/inquilinos/');
        inquilinos = (inquilinosResponse.data as any)?.results || inquilinosResponse.data || [];
      } catch (err) {
        console.warn('Error cargando inquilinos:', err);
      }
      
      // Obtener solicitudes pendientes con manejo de errores
      let solicitudesPendientes = 0;
      try {
  const solicitudesResponse = await apiClient.get('/authz/propietarios/admin/solicitudes/');
        const solicitudes = (solicitudesResponse.data as any)?.results || solicitudesResponse.data || [];
        solicitudesPendientes = solicitudes.filter((s: any) => s.estado === 'pendiente').length;
      } catch (err) {
        console.warn('Error cargando solicitudes:', err);
      }

      // Calcular estadísticas con valores por defecto seguros
      const totalPropietarios = propietarios.filter((p: any) => p.tipo_tenencia === 'propietario').length;
      const totalInquilinos = inquilinos.length;
      const totalUsuarios = totalPropietarios + totalInquilinos;

      setEstadisticas({
        totalUnidades: estadisticasViviendas.total || 0,
        totalUsuarios,
        totalPropietarios,
        totalInquilinos,
        unidadesOcupadas: estadisticasViviendas.ocupadas || 0,
        unidadesDisponibles: estadisticasViviendas.disponibles || 0,
        unidadesAlquiladas: estadisticasViviendas.alquiladas || 0,
        solicitudesPendientes,
        problemasReportados: 0, // Por ahora 0, después implementaremos reportes
        ingresosMensuales: 0, // Por ahora 0, después implementaremos finanzas
      });

    } catch (err) {
      console.error('Error general cargando estadísticas del admin:', err);
      setError('Error al cargar las estadísticas del dashboard');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarEstadisticas();
  }, []);

  return {
    estadisticas,
    loading,
    error,
    recargar: cargarEstadisticas,
  };
}