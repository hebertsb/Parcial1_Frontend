/**
 * Seguridad Hooks
 * Custom React hooks for security operations
 */

import { useState, useEffect, useCallback } from 'react';
import { 
  incidentesService, 
  visitasService, 
  alertasService,
  accesoControlService,
  seguridadDashboardService 
} from './services';
import type { 
  IncidenteSeguridad, 
  CreateIncidenteRequest,
  UpdateIncidenteRequest,
  IncidenteFilters,
  VisitaRegistro,
  CreateVisitaRequest,
  VisitaFilters,
  PaginatedResponse,
  EstadisticasSeguridad,
  AlertaSeguridad,
  ConfiguracionSeguridad
} from '../../core/types';

// =====================
// INCIDENTES HOOKS
// =====================

/**
 * Hook for fetching incidents with filters
 */
export function useIncidentes(filters: IncidenteFilters = {}) {
  const [data, setData] = useState<PaginatedResponse<IncidenteSeguridad> | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchIncidentes = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await incidentesService.getIncidentes(filters);
      if (response.success && response.data) {
        setData(response.data);
      } else {
        setError(response.message || 'Error al cargar incidentes');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido');
    } finally {
      setLoading(false);
    }
  }, [JSON.stringify(filters)]);

  useEffect(() => {
    fetchIncidentes();
  }, [fetchIncidentes]);

  const refresh = useCallback(() => {
    fetchIncidentes();
  }, [fetchIncidentes]);

  return { data, loading, error, refresh };
}

/**
 * Hook for fetching a single incident
 */
export function useIncidente(id: number | null) {
  const [data, setData] = useState<IncidenteSeguridad | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;

    const fetchIncidente = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const response = await incidentesService.getIncidenteById(id);
        if (response.success && response.data) {
          setData(response.data);
        } else {
          setError(response.message || 'Error al cargar incidente');
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error desconocido');
      } finally {
        setLoading(false);
      }
    };

    fetchIncidente();
  }, [id]);

  return { data, loading, error };
}

/**
 * Hook for incident CRUD operations
 */
export function useIncidenteMutations() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createIncidente = useCallback(async (data: CreateIncidenteRequest) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await incidentesService.createIncidente(data);
      if (response.success) {
        return { success: true, data: response.data };
      } else {
        setError(response.message || 'Error al crear incidente');
        return { success: false, error: response.message };
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error desconocido';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  }, []);

  const updateIncidente = useCallback(async (id: number, data: UpdateIncidenteRequest) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await incidentesService.updateIncidente(id, data);
      if (response.success) {
        return { success: true, data: response.data };
      } else {
        setError(response.message || 'Error al actualizar incidente');
        return { success: false, error: response.message };
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error desconocido';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  }, []);

  const asignarIncidente = useCallback(async (id: number, usuarioId: number) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await incidentesService.asignarIncidente(id, usuarioId);
      if (response.success) {
        return { success: true, data: response.data };
      } else {
        setError(response.message || 'Error al asignar incidente');
        return { success: false, error: response.message };
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error desconocido';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  }, []);

  const resolverIncidente = useCallback(async (id: number, solucion: string) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await incidentesService.resolverIncidente(id, solucion);
      if (response.success) {
        return { success: true, data: response.data };
      } else {
        setError(response.message || 'Error al resolver incidente');
        return { success: false, error: response.message };
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error desconocido';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  }, []);

  const adjuntarEvidencia = useCallback(async (id: number, files: File[], onProgress?: (progress: number) => void) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await incidentesService.adjuntarEvidencia(id, files, onProgress);
      if (response.success) {
        return { success: true, data: response.data };
      } else {
        setError(response.message || 'Error al adjuntar evidencia');
        return { success: false, error: response.message };
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error desconocido';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    createIncidente,
    updateIncidente,
    asignarIncidente,
    resolverIncidente,
    adjuntarEvidencia,
    loading,
    error
  };
}

// =====================
// VISITAS HOOKS
// =====================

/**
 * Hook for fetching visits with filters
 */
export function useVisitas(filters: VisitaFilters = {}) {
  const [data, setData] = useState<PaginatedResponse<VisitaRegistro> | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchVisitas = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await visitasService.getVisitas(filters);
      if (response.success && response.data) {
        setData(response.data);
      } else {
        setError(response.message || 'Error al cargar visitas');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido');
    } finally {
      setLoading(false);
    }
  }, [JSON.stringify(filters)]);

  useEffect(() => {
    fetchVisitas();
  }, [fetchVisitas]);

  const refresh = useCallback(() => {
    fetchVisitas();
  }, [fetchVisitas]);

  return { data, loading, error, refresh };
}

/**
 * Hook for active visits
 */
export function useVisitasActivas() {
  const [data, setData] = useState<VisitaRegistro[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchVisitasActivas = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await visitasService.getVisitasActivas();
      if (response.success && response.data) {
        setData(response.data);
      } else {
        setError(response.message || 'Error al cargar visitas activas');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchVisitasActivas();
  }, [fetchVisitasActivas]);

  const refresh = useCallback(() => {
    fetchVisitasActivas();
  }, [fetchVisitasActivas]);

  return { data, loading, error, refresh };
}

/**
 * Hook for visit operations
 */
export function useVisitaMutations() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const registrarVisita = useCallback(async (data: CreateVisitaRequest) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await visitasService.registrarVisita(data);
      if (response.success) {
        return { success: true, data: response.data };
      } else {
        setError(response.message || 'Error al registrar visita');
        return { success: false, error: response.message };
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error desconocido';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  }, []);

  const registrarSalida = useCallback(async (id: number) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await visitasService.registrarSalida(id);
      if (response.success) {
        return { success: true, data: response.data };
      } else {
        setError(response.message || 'Error al registrar salida');
        return { success: false, error: response.message };
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error desconocido';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  }, []);

  const autorizarVisita = useCallback(async (id: number) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await visitasService.autorizarVisita(id);
      if (response.success) {
        return { success: true, data: response.data };
      } else {
        setError(response.message || 'Error al autorizar visita');
        return { success: false, error: response.message };
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error desconocido';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  }, []);

  const tomarFoto = useCallback(async (id: number, foto: File) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await visitasService.tomarFoto(id, foto);
      if (response.success) {
        return { success: true, data: response.data };
      } else {
        setError(response.message || 'Error al tomar foto');
        return { success: false, error: response.message };
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error desconocido';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    registrarVisita,
    registrarSalida,
    autorizarVisita,
    tomarFoto,
    loading,
    error
  };
}

// =====================
// ALERTAS HOOKS
// =====================

/**
 * Hook for active alerts
 */
export function useAlertasActivas() {
  const [data, setData] = useState<AlertaSeguridad[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAlertas = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await alertasService.getAlertasActivas();
      if (response.success && response.data) {
        setData(response.data);
      } else {
        setError(response.message || 'Error al cargar alertas');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAlertas();
  }, [fetchAlertas]);

  const refresh = useCallback(() => {
    fetchAlertas();
  }, [fetchAlertas]);

  return { data, loading, error, refresh };
}

/**
 * Hook for alert operations
 */
export function useAlertaMutations() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const crearAlerta = useCallback(async (alerta: {
    tipo: 'emergencia' | 'intrusion' | 'fuego' | 'medica' | 'otro';
    ubicacion: string;
    descripcion: string;
    nivel_prioridad: 'bajo' | 'medio' | 'alto' | 'critico';
  }) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await alertasService.crearAlerta(alerta);
      if (response.success) {
        return { success: true, data: response.data };
      } else {
        setError(response.message || 'Error al crear alerta');
        return { success: false, error: response.message };
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error desconocido';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  }, []);

  const activarProtocoloEmergencia = useCallback(async (tipo: string) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await alertasService.activarProtocoloEmergencia(tipo);
      if (response.success) {
        return { success: true, data: response.data };
      } else {
        setError(response.message || 'Error al activar protocolo');
        return { success: false, error: response.message };
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error desconocido';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    crearAlerta,
    activarProtocoloEmergencia,
    loading,
    error
  };
}

// =====================
// DASHBOARD HOOKS
// =====================

/**
 * Hook for security dashboard data
 */
export function useSeguridadDashboard() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDashboardData = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await seguridadDashboardService.getDashboardData();
      if (response.success && response.data) {
        setData(response.data);
      } else {
        setError(response.message || 'Error al cargar dashboard');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  const refresh = useCallback(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  return { data, loading, error, refresh };
}

/**
 * Hook for security statistics
 */
export function useEstadisticasSeguridad() {
  const [data, setData] = useState<EstadisticasSeguridad | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchEstadisticas = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await incidentesService.getEstadisticas();
      if (response.success && response.data) {
        setData(response.data);
      } else {
        setError(response.message || 'Error al cargar estadísticas');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchEstadisticas();
  }, [fetchEstadisticas]);

  const refresh = useCallback(() => {
    fetchEstadisticas();
  }, [fetchEstadisticas]);

  return { data, loading, error, refresh };
}

// Export all hooks
export default {
  useIncidentes,
  useIncidente,
  useIncidenteMutations,
  useVisitas,
  useVisitasActivas,
  useVisitaMutations,
  useAlertasActivas,
  useAlertaMutations,
  useSeguridadDashboard,
  useEstadisticasSeguridad,
};