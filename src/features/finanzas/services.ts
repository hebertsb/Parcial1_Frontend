/**
 * Finanzas Services
 * Comprehensive service layer for financial operations
 */

import { apiClient } from '../../core/api/client';
import type { 
  Transaccion, 
  CreateTransaccionRequest,
  UpdateTransaccionRequest,
  TransaccionFilters,
  PaginatedResponse,
  BulkDeleteRequest,
  ApiResponse,
  EstadisticasFinancieras,
  BalanceGeneral,
  ReporteFinanciero,
  CuotaMantenimiento,
  CreateCuotaRequest,
  UpdateCuotaRequest,
  CuotaFilters
} from '../../core/types';

// =====================
// TRANSACCIONES SERVICE
// =====================

export const transaccionesService = {
  /**
   * Obtener lista de transacciones con filtros
   */
  async getTransacciones(filters: TransaccionFilters = {}): Promise<ApiResponse<PaginatedResponse<Transaccion>>> {
    return apiClient.get('/api/finanzas/transacciones/', { params: filters });
  },

  /**
   * Obtener transacción por ID
   */
  async getTransaccionById(id: number): Promise<ApiResponse<Transaccion>> {
    return apiClient.get(`/api/finanzas/transacciones/${id}/`);
  },

  /**
   * Crear nueva transacción
   */
  async createTransaccion(data: CreateTransaccionRequest): Promise<ApiResponse<Transaccion>> {
    return apiClient.post('/api/finanzas/transacciones/', data);
  },

  /**
   * Actualizar transacción existente
   */
  async updateTransaccion(id: number, data: UpdateTransaccionRequest): Promise<ApiResponse<Transaccion>> {
    return apiClient.patch(`/api/finanzas/transacciones/${id}/`, data);
  },

  /**
   * Eliminar transacción
   */
  async deleteTransaccion(id: number): Promise<ApiResponse<void>> {
    return apiClient.delete(`/api/finanzas/transacciones/${id}/`);
  },

  /**
   * Eliminación en lote de transacciones
   */
  async bulkDeleteTransacciones(request: BulkDeleteRequest): Promise<ApiResponse<{ deleted_count: number }>> {
    return apiClient.post('/api/finanzas/transacciones/bulk-delete/', request);
  },

  /**
   * Aprobar transacción
   */
  async aprobarTransaccion(id: number): Promise<ApiResponse<Transaccion>> {
    return apiClient.post(`/api/finanzas/transacciones/${id}/aprobar/`);
  },

  /**
   * Rechazar transacción
   */
  async rechazarTransaccion(id: number, motivo?: string): Promise<ApiResponse<Transaccion>> {
    return apiClient.post(`/api/finanzas/transacciones/${id}/rechazar/`, { motivo });
  },

  /**
   * Obtener transacciones por unidad
   */
  async getTransaccionesByUnidad(unidadId: number, filters: TransaccionFilters = {}): Promise<ApiResponse<PaginatedResponse<Transaccion>>> {
    return apiClient.get(`/api/finanzas/transacciones/unidad/${unidadId}/`, { params: filters });
  },

  /**
   * Exportar transacciones a Excel
   */
  async exportarTransacciones(filters: TransaccionFilters = {}): Promise<ApiResponse<Blob>> {
    return apiClient.get('/api/finanzas/transacciones/export/', { 
      params: filters,
      responseType: 'blob'
    });
  },

  /**
   * Obtener estadísticas de transacciones
   */
  async getEstadisticasTransacciones(): Promise<ApiResponse<EstadisticasFinancieras>> {
    return apiClient.get('/api/finanzas/transacciones/estadisticas/');
  },

  /**
   * Duplicar transacción (para transacciones recurrentes)
   */
  async duplicarTransaccion(id: number): Promise<ApiResponse<Transaccion>> {
    return apiClient.post(`/api/finanzas/transacciones/${id}/duplicar/`);
  },

  /**
   * Adjuntar comprobante a transacción
   */
  async adjuntarComprobante(id: number, file: File, onProgress?: (progress: number) => void): Promise<ApiResponse<Transaccion>> {
    return apiClient.upload(`/api/finanzas/transacciones/${id}/comprobante/`, file, 'comprobante', undefined, onProgress);
  }
};

// =====================
// CUOTAS MANTENIMIENTO SERVICE
// =====================

export const cuotasService = {
  /**
   * Obtener lista de cuotas con filtros
   */
  async getCuotas(filters: CuotaFilters = {}): Promise<ApiResponse<PaginatedResponse<CuotaMantenimiento>>> {
    return apiClient.get('/api/finanzas/cuotas/', { params: filters });
  },

  /**
   * Obtener cuota por ID
   */
  async getCuotaById(id: number): Promise<ApiResponse<CuotaMantenimiento>> {
    return apiClient.get(`/api/finanzas/cuotas/${id}/`);
  },

  /**
   * Crear nueva cuota
   */
  async createCuota(data: CreateCuotaRequest): Promise<ApiResponse<CuotaMantenimiento>> {
    return apiClient.post('/api/finanzas/cuotas/', data);
  },

  /**
   * Actualizar cuota existente
   */
  async updateCuota(id: number, data: UpdateCuotaRequest): Promise<ApiResponse<CuotaMantenimiento>> {
    return apiClient.patch(`/api/finanzas/cuotas/${id}/`, data);
  },

  /**
   * Eliminar cuota
   */
  async deleteCuota(id: number): Promise<ApiResponse<void>> {
    return apiClient.delete(`/api/finanzas/cuotas/${id}/`);
  },

  /**
   * Marcar cuota como pagada
   */
  async marcarComoPagada(id: number): Promise<ApiResponse<CuotaMantenimiento>> {
    return apiClient.post(`/api/finanzas/cuotas/${id}/pagar/`);
  },

  /**
   * Generar cuotas automáticamente para todas las unidades
   */
  async generarCuotasAutomaticas(monto: number, mes: number, año: number): Promise<ApiResponse<{ created_count: number }>> {
    return apiClient.post('/api/finanzas/cuotas/generar-automaticas/', {
      monto,
      mes,
      año
    });
  },

  /**
   * Obtener cuotas por unidad
   */
  async getCuotasByUnidad(unidadId: number, filters: CuotaFilters = {}): Promise<ApiResponse<PaginatedResponse<CuotaMantenimiento>>> {
    return apiClient.get(`/api/finanzas/cuotas/unidad/${unidadId}/`, { params: filters });
  },

  /**
   * Obtener cuotas pendientes
   */
  async getCuotasPendientes(): Promise<ApiResponse<PaginatedResponse<CuotaMantenimiento>>> {
    return apiClient.get('/api/finanzas/cuotas/pendientes/');
  },

  /**
   * Enviar recordatorio de pago
   */
  async enviarRecordatorio(id: number): Promise<ApiResponse<{ message: string }>> {
    return apiClient.post(`/api/finanzas/cuotas/${id}/recordatorio/`);
  },

  /**
   * Aplicar descuento a cuota
   */
  async aplicarDescuento(id: number, descuento: number, motivo: string): Promise<ApiResponse<CuotaMantenimiento>> {
    return apiClient.post(`/api/finanzas/cuotas/${id}/descuento/`, {
      descuento,
      motivo
    });
  }
};

// =====================
// REPORTES SERVICE
// =====================

export const reportesService = {
  /**
   * Generar reporte financiero
   */
  async generarReporte(fechaInicio: string, fechaFin: string): Promise<ApiResponse<ReporteFinanciero>> {
    return apiClient.get('/api/finanzas/reportes/general/', {
      params: { fecha_inicio: fechaInicio, fecha_fin: fechaFin }
    });
  },

  /**
   * Obtener balance general
   */
  async getBalanceGeneral(): Promise<ApiResponse<BalanceGeneral>> {
    return apiClient.get('/api/finanzas/reportes/balance/');
  },

  /**
   * Obtener estadísticas financieras
   */
  async getEstadisticasFinancieras(): Promise<ApiResponse<EstadisticasFinancieras>> {
    return apiClient.get('/api/finanzas/reportes/estadisticas/');
  },

  /**
   * Generar reporte de morosidad
   */
  async getReporteMorosidad(): Promise<ApiResponse<{ 
    total_morosos: number; 
    monto_total_deuda: number; 
    detalles: Array<{
      unidad: number;
      propietario: string;
      cuotas_pendientes: number;
      monto_deuda: number;
      dias_atraso: number;
    }> 
  }>> {
    return apiClient.get('/api/finanzas/reportes/morosidad/');
  },

  /**
   * Generar reporte de ingresos por mes
   */
  async getReporteIngresosMensuales(año: number): Promise<ApiResponse<Array<{
    mes: number;
    ingresos: number;
    gastos: number;
    balance: number;
  }>>> {
    return apiClient.get('/api/finanzas/reportes/ingresos-mensuales/', {
      params: { año }
    });
  },

  /**
   * Exportar reporte a PDF
   */
  async exportarReportePDF(tipoReporte: string, fechaInicio?: string, fechaFin?: string): Promise<ApiResponse<Blob>> {
    return apiClient.get('/api/finanzas/reportes/export-pdf/', {
      params: { 
        tipo: tipoReporte,
        fecha_inicio: fechaInicio,
        fecha_fin: fechaFin
      },
      responseType: 'blob'
    });
  },

  /**
   * Exportar reporte a Excel
   */
  async exportarReporteExcel(tipoReporte: string, fechaInicio?: string, fechaFin?: string): Promise<ApiResponse<Blob>> {
    return apiClient.get('/api/finanzas/reportes/export-excel/', {
      params: { 
        tipo: tipoReporte,
        fecha_inicio: fechaInicio,
        fecha_fin: fechaFin
      },
      responseType: 'blob'
    });
  }
};

// =====================
// PRESUPUESTO SERVICE
// =====================

export const presupuestoService = {
  /**
   * Obtener presupuesto anual
   */
  async getPresupuestoAnual(año: number): Promise<ApiResponse<{
    año: number;
    total_presupuestado: number;
    total_ejecutado: number;
    porcentaje_ejecucion: number;
    categorias: Array<{
      categoria: string;
      presupuestado: number;
      ejecutado: number;
      disponible: number;
    }>;
  }>> {
    return apiClient.get('/api/finanzas/presupuesto/anual/', {
      params: { año }
    });
  },

  /**
   * Crear/actualizar presupuesto
   */
  async updatePresupuesto(año: number, categorias: Array<{
    categoria: string;
    monto: number;
  }>): Promise<ApiResponse<{ message: string }>> {
    return apiClient.post('/api/finanzas/presupuesto/actualizar/', {
      año,
      categorias
    });
  },

  /**
   * Obtener ejecución presupuestaria por categoría
   */
  async getEjecucionPorCategoria(categoria: string, año: number): Promise<ApiResponse<{
    categoria: string;
    presupuestado: number;
    ejecutado: number;
    transacciones: Transaccion[];
  }>> {
    return apiClient.get('/api/finanzas/presupuesto/categoria/', {
      params: { categoria, año }
    });
  }
};

// =====================
// FINANZAS DASHBOARD SERVICE
// =====================

export const finanzasDashboardService = {
  /**
   * Obtener resumen del dashboard financiero
   */
  async getDashboardData(): Promise<ApiResponse<{
    total_ingresos_mes: number;
    total_gastos_mes: number;
    balance_mes: number;
    cuotas_pendientes: number;
    monto_cuotas_pendientes: number;
    proximos_vencimientos: CuotaMantenimiento[];
    transacciones_recientes: Transaccion[];
    estadisticas_mensuales: Array<{
      mes: string;
      ingresos: number;
      gastos: number;
    }>;
  }>> {
    return apiClient.get('/api/finanzas/dashboard/');
  },

  /**
   * Obtener métricas en tiempo real
   */
  async getMetricasEnTiempoReal(): Promise<ApiResponse<{
    balance_actual: number;
    transacciones_hoy: number;
    pagos_recibidos_hoy: number;
    gastos_hoy: number;
    porcentaje_cobranza_mes: number;
  }>> {
    return apiClient.get('/api/finanzas/dashboard/metricas-tiempo-real/');
  }
};

// Export all services
export default {
  transaccionesService,
  cuotasService,
  reportesService,
  presupuestoService,
  finanzasDashboardService
};