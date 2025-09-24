import { useState, useEffect } from 'react';
import { transaccionesService, reportesService } from '../lib/services';
import { type PaginatedResponse } from '../core/api/client';
import { type Transaccion, type TransaccionFilters, type EstadisticasFinancieras } from '../core/types';

export function useTransacciones(filters: TransaccionFilters = {}) {
  const [data, setData] = useState<PaginatedResponse<Transaccion> | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTransacciones = async () => {
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
  };

  useEffect(() => {
    fetchTransacciones();
  }, [JSON.stringify(filters)]);

  const refresh = () => fetchTransacciones();

  return { data, loading, error, refresh };
}

export function useIngresos(filters: Omit<TransaccionFilters, 'tipo'> = {}) {
  return useTransacciones({ ...filters, tipo: 'ingreso' });
}

export function useGastos(filters: Omit<TransaccionFilters, 'tipo'> = {}) {
  return useTransacciones({ ...filters, tipo: 'gasto' });
}

export function useEstadisticasFinancieras(mes?: string, anio?: string) {
  const [data, setData] = useState<EstadisticasFinancieras | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchEstadisticas = async () => {
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
    };

    fetchEstadisticas();
  }, [mes, anio]);

  return { data, loading, error };
}

export function useFinanzasMutations() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createTransaccion = async (transaccionData: any) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await transaccionesService.createTransaccion(transaccionData);
      if (response.success) {
        return response.data;
      } else {
        setError(response.message || 'Error al crear transacción');
        return null;
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido');
      return null;
    } finally {
      setLoading(false);
    }
  };

  const updateTransaccion = async (id: number, transaccionData: any) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await transaccionesService.updateTransaccion(id, transaccionData);
      if (response.success) {
        return response.data;
      } else {
        setError(response.message || 'Error al actualizar transacción');
        return null;
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido');
      return null;
    } finally {
      setLoading(false);
    }
  };

  const deleteTransaccion = async (id: number) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await transaccionesService.deleteTransaccion(id);
      if (response.success) {
        return true;
      } else {
        setError(response.message || 'Error al eliminar transacción');
        return false;
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const changeEstado = async (id: number, estado: 'pendiente' | 'pagado' | 'cancelado') => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await transaccionesService.updateTransaccion(id, { estado });
      if (response.success) {
        return response.data;
      } else {
        setError(response.message || 'Error al cambiar estado');
        return null;
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido');
      return null;
    } finally {
      setLoading(false);
    }
  };

  return {
    createTransaccion,
    updateTransaccion,
    deleteTransaccion,
    changeEstado,
    loading,
    error
  };
}
