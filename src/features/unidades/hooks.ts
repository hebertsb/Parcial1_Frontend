/**
 * Unidades Hooks
 * Custom React hooks for units management operations
 */

import { useState, useEffect, useCallback } from 'react';
import { 
  unidadesService, 
  propietariosService, 
  mantenimientoService,
  unidadesDashboardService 
} from './services';
import type { 
  Unidad, 
  CreateUnidadRequest,
  UpdateUnidadRequest,
  UnidadFilters,
  PaginatedResponse,
  Propietario,
  CreatePropietarioRequest,
  UpdatePropietarioRequest,
  PropietarioFilters,
  EstadisticasUnidades,
  HistorialCambio
} from '../../core/types';

// =====================
// UNIDADES HOOKS
// =====================

/**
 * Hook for fetching units with filters
 */
export function useUnidades(filters: UnidadFilters = {}) {
  const [data, setData] = useState<PaginatedResponse<Unidad> | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchUnidades = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await unidadesService.getUnidades(filters);
      if (response.success && response.data) {
        setData(response.data);
      } else {
        setError(response.message || 'Error al cargar unidades');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido');
    } finally {
      setLoading(false);
    }
  }, [JSON.stringify(filters)]);

  useEffect(() => {
    fetchUnidades();
  }, [fetchUnidades]);

  const refresh = useCallback(() => {
    fetchUnidades();
  }, [fetchUnidades]);

  return { data, loading, error, refresh };
}

/**
 * Hook for fetching a single unit
 */
export function useUnidad(id: number | null) {
  const [data, setData] = useState<Unidad | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;

    const fetchUnidad = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const response = await unidadesService.getUnidadById(id);
        if (response.success && response.data) {
          setData(response.data);
        } else {
          setError(response.message || 'Error al cargar unidad');
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error desconocido');
      } finally {
        setLoading(false);
      }
    };

    fetchUnidad();
  }, [id]);

  return { data, loading, error };
}

/**
 * Hook for unit CRUD operations
 */
export function useUnidadMutations() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createUnidad = useCallback(async (data: CreateUnidadRequest) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await unidadesService.createUnidad(data);
      if (response.success) {
        return { success: true, data: response.data };
      } else {
        setError(response.message || 'Error al crear unidad');
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

  const updateUnidad = useCallback(async (id: number, data: UpdateUnidadRequest) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await unidadesService.updateUnidad(id, data);
      if (response.success) {
        return { success: true, data: response.data };
      } else {
        setError(response.message || 'Error al actualizar unidad');
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

  const deleteUnidad = useCallback(async (id: number) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await unidadesService.deleteUnidad(id);
      if (response.success) {
        return { success: true };
      } else {
        setError(response.message || 'Error al eliminar unidad');
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

  const cambiarEstado = useCallback(async (id: number, estado: 'ocupada' | 'disponible' | 'mantenimiento') => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await unidadesService.cambiarEstadoUnidad(id, estado);
      if (response.success) {
        return { success: true, data: response.data };
      } else {
        setError(response.message || 'Error al cambiar estado');
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

  const asignarPropietario = useCallback(async (unidadId: number, propietarioId: number) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await unidadesService.asignarPropietario(unidadId, propietarioId);
      if (response.success) {
        return { success: true, data: response.data };
      } else {
        setError(response.message || 'Error al asignar propietario');
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
    createUnidad,
    updateUnidad,
    deleteUnidad,
    cambiarEstado,
    asignarPropietario,
    loading,
    error
  };
}

/**
 * Hook for unit statistics
 */
export function useEstadisticasUnidades() {
  const [data, setData] = useState<EstadisticasUnidades | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchEstadisticas = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await unidadesService.getEstadisticas();
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

// =====================
// PROPIETARIOS HOOKS
// =====================

/**
 * Hook for fetching owners with filters
 */
export function usePropietarios(filters: PropietarioFilters = {}) {
  const [data, setData] = useState<PaginatedResponse<Propietario> | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPropietarios = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await propietariosService.getPropietarios(filters);
      if (response.success && response.data) {
        setData(response.data);
      } else {
        setError(response.message || 'Error al cargar propietarios');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido');
    } finally {
      setLoading(false);
    }
  }, [JSON.stringify(filters)]);

  useEffect(() => {
    fetchPropietarios();
  }, [fetchPropietarios]);

  const refresh = useCallback(() => {
    fetchPropietarios();
  }, [fetchPropietarios]);

  return { data, loading, error, refresh };
}

/**
 * Hook for owner CRUD operations
 */
export function usePropietarioMutations() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createPropietario = useCallback(async (data: CreatePropietarioRequest) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await propietariosService.createPropietario(data);
      if (response.success) {
        return { success: true, data: response.data };
      } else {
        setError(response.message || 'Error al crear propietario');
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

  const updatePropietario = useCallback(async (id: number, data: UpdatePropietarioRequest) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await propietariosService.updatePropietario(id, data);
      if (response.success) {
        return { success: true, data: response.data };
      } else {
        setError(response.message || 'Error al actualizar propietario');
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

  const subirFoto = useCallback(async (id: number, file: File, onProgress?: (progress: number) => void) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await propietariosService.subirFoto(id, file, onProgress);
      if (response.success) {
        return { success: true, data: response.data };
      } else {
        setError(response.message || 'Error al subir foto');
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
    createPropietario,
    updatePropietario,
    subirFoto,
    loading,
    error
  };
}

// =====================
// HISTORIAL HOOKS
// =====================

/**
 * Hook for unit change history
 */
export function useHistorialUnidad(unidadId: number | null) {
  const [data, setData] = useState<HistorialCambio[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!unidadId) return;

    const fetchHistorial = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const response = await unidadesService.getHistorialCambios(unidadId);
        if (response.success && response.data) {
          setData(response.data);
        } else {
          setError(response.message || 'Error al cargar historial');
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error desconocido');
      } finally {
        setLoading(false);
      }
    };

    fetchHistorial();
  }, [unidadId]);

  return { data, loading, error };
}

// =====================
// DASHBOARD HOOKS
// =====================

/**
 * Hook for units dashboard data
 */
export function useUnidadesDashboard() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDashboardData = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await unidadesDashboardService.getDashboardData();
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
 * Hook for occupation map
 */
export function useMapaOcupacion() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchMapaOcupacion = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await unidadesDashboardService.getMapaOcupacion();
      if (response.success && response.data) {
        setData(response.data);
      } else {
        setError(response.message || 'Error al cargar mapa de ocupación');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMapaOcupacion();
  }, [fetchMapaOcupacion]);

  const refresh = useCallback(() => {
    fetchMapaOcupacion();
  }, [fetchMapaOcupacion]);

  return { data, loading, error, refresh };
}

// Export all hooks
export default {
  useUnidades,
  useUnidad,
  useUnidadMutations,
  useEstadisticasUnidades,
  usePropietarios,
  usePropietarioMutations,
  useHistorialUnidad,
  useUnidadesDashboard,
  useMapaOcupacion,
};