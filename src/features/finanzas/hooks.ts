/**
 * Finanzas Hooks
 * Custom React hooks for financial operations
 */

import { useState, useEffect, useCallback } from 'react';
import { 
  transaccionesService, 
  cuotasService, 
  reportesService, 
  presupuestoService,
  finanzasDashboardService 
} from './services';
import type { 
  Transaccion, 
  CreateTransaccionRequest,
  UpdateTransaccionRequest,
  TransaccionFilters,
  PaginatedResponse,
  CuotaMantenimiento,
  CreateCuotaRequest,
  UpdateCuotaRequest,
  CuotaFilters,
  EstadisticasFinancieras,
  BalanceGeneral,
  ReporteFinanciero 
} from '../../core/types';

// =====================
// TRANSACCIONES HOOKS
// =====================

/**
 * Hook for fetching transactions with filters
 */
export function useTransacciones(filters: TransaccionFilters = {}) {
  const [data, setData] = useState<PaginatedResponse<Transaccion> | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTransacciones = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await transaccionesService.getTransacciones(filters);
      if (response.success && response.data) {
        setData(response.data);
      } else {
        setError(response.message || 'Error al cargar transacciones');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido');
    } finally {
      setLoading(false);
    }
  }, [JSON.stringify(filters)]);

  useEffect(() => {
    fetchTransacciones();
  }, [fetchTransacciones]);

  const refresh = useCallback(() => {
    fetchTransacciones();
  }, [fetchTransacciones]);

  return { data, loading, error, refresh };
}

/**
 * Hook for fetching a single transaction
 */
export function useTransaccion(id: number | null) {
  const [data, setData] = useState<Transaccion | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;

    const fetchTransaccion = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const response = await transaccionesService.getTransaccionById(id);
        if (response.success && response.data) {
          setData(response.data);
        } else {
          setError(response.message || 'Error al cargar transacción');
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error desconocido');
      } finally {
        setLoading(false);
      }
    };

    fetchTransaccion();
  }, [id]);

  return { data, loading, error };
}

/**
 * Hook for transaction CRUD operations
 */
export function useTransaccionMutations() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createTransaccion = useCallback(async (data: CreateTransaccionRequest) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await transaccionesService.createTransaccion(data);
      if (response.success) {
        return { success: true, data: response.data };
      } else {
        setError(response.message || 'Error al crear transacción');
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

  const updateTransaccion = useCallback(async (id: number, data: UpdateTransaccionRequest) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await transaccionesService.updateTransaccion(id, data);
      if (response.success) {
        return { success: true, data: response.data };
      } else {
        setError(response.message || 'Error al actualizar transacción');
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

  const deleteTransaccion = useCallback(async (id: number) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await transaccionesService.deleteTransaccion(id);
      if (response.success) {
        return { success: true };
      } else {
        setError(response.message || 'Error al eliminar transacción');
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

  const aprobarTransaccion = useCallback(async (id: number) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await transaccionesService.aprobarTransaccion(id);
      if (response.success) {
        return { success: true, data: response.data };
      } else {
        setError(response.message || 'Error al aprobar transacción');
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

  const adjuntarComprobante = useCallback(async (id: number, file: File, onProgress?: (progress: number) => void) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await transaccionesService.adjuntarComprobante(id, file, onProgress);
      if (response.success) {
        return { success: true, data: response.data };
      } else {
        setError(response.message || 'Error al adjuntar comprobante');
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
    createTransaccion,
    updateTransaccion,
    deleteTransaccion,
    aprobarTransaccion,
    adjuntarComprobante,
    loading,
    error
  };
}

// =====================
// CUOTAS HOOKS
// =====================

/**
 * Hook for fetching cuotas with filters
 */
export function useCuotas(filters: CuotaFilters = {}) {
  const [data, setData] = useState<PaginatedResponse<CuotaMantenimiento> | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCuotas = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await cuotasService.getCuotas(filters);
      if (response.success && response.data) {
        setData(response.data);
      } else {
        setError(response.message || 'Error al cargar cuotas');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido');
    } finally {
      setLoading(false);
    }
  }, [JSON.stringify(filters)]);

  useEffect(() => {
    fetchCuotas();
  }, [fetchCuotas]);

  const refresh = useCallback(() => {
    fetchCuotas();
  }, [fetchCuotas]);

  return { data, loading, error, refresh };
}

/**
 * Hook for cuotas CRUD operations
 */
export function useCuotaMutations() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createCuota = useCallback(async (data: CreateCuotaRequest) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await cuotasService.createCuota(data);
      if (response.success) {
        return { success: true, data: response.data };
      } else {
        setError(response.message || 'Error al crear cuota');
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

  const marcarComoPagada = useCallback(async (id: number) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await cuotasService.marcarComoPagada(id);
      if (response.success) {
        return { success: true, data: response.data };
      } else {
        setError(response.message || 'Error al marcar cuota como pagada');
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

  const generarCuotasAutomaticas = useCallback(async (monto: number, mes: number, año: number) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await cuotasService.generarCuotasAutomaticas(monto, mes, año);
      if (response.success) {
        return { success: true, data: response.data };
      } else {
        setError(response.message || 'Error al generar cuotas automáticas');
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
    createCuota,
    marcarComoPagada,
    generarCuotasAutomaticas,
    loading,
    error
  };
}

// =====================
// REPORTES HOOKS
// =====================

/**
 * Hook for financial statistics
 */
export function useEstadisticasFinancieras() {
  const [data, setData] = useState<EstadisticasFinancieras | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchEstadisticas = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await reportesService.getEstadisticasFinancieras();
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

/**
 * Hook for generating financial reports
 */
export function useReporteFinanciero() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generarReporte = useCallback(async (fechaInicio: string, fechaFin: string) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await reportesService.generarReporte(fechaInicio, fechaFin);
      if (response.success) {
        return { success: true, data: response.data };
      } else {
        setError(response.message || 'Error al generar reporte');
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

  const exportarPDF = useCallback(async (tipoReporte: string, fechaInicio?: string, fechaFin?: string) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await reportesService.exportarReportePDF(tipoReporte, fechaInicio, fechaFin);
      if (response.success && response.data) {
        // Create download link
        const url = window.URL.createObjectURL(response.data);
        const link = document.createElement('a');
        link.href = url;
        link.download = `reporte-${tipoReporte}-${new Date().toISOString().split('T')[0]}.pdf`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
        
        return { success: true };
      } else {
        setError(response.message || 'Error al exportar reporte');
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
    generarReporte,
    exportarPDF,
    loading,
    error
  };
}

// =====================
// DASHBOARD HOOKS
// =====================

/**
 * Hook for financial dashboard data
 */
export function useFinanzasDashboard() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDashboardData = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await finanzasDashboardService.getDashboardData();
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

// Export all hooks
export default {
  useTransacciones,
  useTransaccion,
  useTransaccionMutations,
  useCuotas,
  useCuotaMutations,
  useEstadisticasFinancieras,
  useReporteFinanciero,
  useFinanzasDashboard,
};