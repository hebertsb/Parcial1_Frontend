/**
 * Seguridad Services
 * Comprehensive service layer for security operations
 */

import { apiClient } from '../../core/api/client';
import type { 
  IncidenteSeguridad, 
  CreateIncidenteRequest,
  UpdateIncidenteRequest,
  IncidenteFilters,
  VisitaRegistro,
  CreateVisitaRequest,
  VisitaFilters,
  PaginatedResponse,
  BulkDeleteRequest,
  ApiResponse,
  EstadisticasSeguridad,
  AlertaSeguridad,
  ConfiguracionSeguridad
} from '../../core/types';

// =====================
// INCIDENTES SERVICE
// =====================

export const incidentesService = {
  /**
   * Obtener lista de incidentes con filtros
   */
  async getIncidentes(filters: IncidenteFilters = {}): Promise<ApiResponse<PaginatedResponse<IncidenteSeguridad>>> {
    return apiClient.get('/api/seguridad/incidentes/', { params: filters });
  },

  /**
   * Obtener incidente por ID
   */
  async getIncidenteById(id: number): Promise<ApiResponse<IncidenteSeguridad>> {
    return apiClient.get(`/api/seguridad/incidentes/${id}/`);
  },

  /**
   * Crear nuevo incidente
   */
  async createIncidente(data: CreateIncidenteRequest): Promise<ApiResponse<IncidenteSeguridad>> {
    return apiClient.post('/api/seguridad/incidentes/', data);
  },

  /**
   * Actualizar incidente existente
   */
  async updateIncidente(id: number, data: UpdateIncidenteRequest): Promise<ApiResponse<IncidenteSeguridad>> {
    return apiClient.patch(`/api/seguridad/incidentes/${id}/`, data);
  },

  /**
   * Eliminar incidente
   */
  async deleteIncidente(id: number): Promise<ApiResponse<void>> {
    return apiClient.delete(`/api/seguridad/incidentes/${id}/`);
  },

  /**
   * Eliminación en lote de incidentes
   */
  async bulkDeleteIncidentes(request: BulkDeleteRequest): Promise<ApiResponse<{ deleted_count: number }>> {
    return apiClient.post('/api/seguridad/incidentes/bulk-delete/', request);
  },

  /**
   * Asignar incidente a personal de seguridad
   */
  async asignarIncidente(id: number, usuarioId: number): Promise<ApiResponse<IncidenteSeguridad>> {
    return apiClient.post(`/api/seguridad/incidentes/${id}/asignar/`, { usuario_id: usuarioId });
  },

  /**
   * Cambiar estado del incidente
   */
  async cambiarEstado(id: number, estado: 'abierto' | 'en_proceso' | 'resuelto' | 'cerrado'): Promise<ApiResponse<IncidenteSeguridad>> {
    return apiClient.post(`/api/seguridad/incidentes/${id}/cambiar-estado/`, { estado });
  },

  /**
   * Resolver incidente
   */
  async resolverIncidente(id: number, solucion: string): Promise<ApiResponse<IncidenteSeguridad>> {
    return apiClient.post(`/api/seguridad/incidentes/${id}/resolver/`, { solucion });
  },

  /**
   * Adjuntar evidencia a incidente
   */
  async adjuntarEvidencia(id: number, files: File[], onProgress?: (progress: number) => void): Promise<ApiResponse<IncidenteSeguridad>> {
    const formData = new FormData();
    files.forEach((file, index) => {
      formData.append(`evidencia_${index}`, file);
    });
    
    return apiClient.upload(`/api/seguridad/incidentes/${id}/evidencias/`, files[0], 'evidencias', undefined, onProgress);
  },

  /**
   * Obtener incidentes críticos
   */
  async getIncidentesCriticos(): Promise<ApiResponse<IncidenteSeguridad[]>> {
    return apiClient.get('/api/seguridad/incidentes/criticos/');
  },

  /**
   * Obtener incidentes por ubicación
   */
  async getIncidentesByUbicacion(ubicacion: string): Promise<ApiResponse<IncidenteSeguridad[]>> {
    return apiClient.get('/api/seguridad/incidentes/ubicacion/', { params: { ubicacion } });
  },

  /**
   * Generar reporte de incidentes
   */
  async generarReporte(fechaInicio: string, fechaFin: string): Promise<ApiResponse<Blob>> {
    return apiClient.get('/api/seguridad/incidentes/reporte/', {
      params: { fecha_inicio: fechaInicio, fecha_fin: fechaFin },
      responseType: 'blob'
    });
  },

  /**
   * Obtener estadísticas de incidentes
   */
  async getEstadisticas(): Promise<ApiResponse<EstadisticasSeguridad>> {
    return apiClient.get('/api/seguridad/incidentes/estadisticas/');
  }
};

// =====================
// VISITAS SERVICE
// =====================

export const visitasService = {
  /**
   * Obtener lista de visitas con filtros
   */
  async getVisitas(filters: VisitaFilters = {}): Promise<ApiResponse<PaginatedResponse<VisitaRegistro>>> {
    return apiClient.get('/api/seguridad/visitas/', { params: filters });
  },

  /**
   * Obtener visita por ID
   */
  async getVisitaById(id: number): Promise<ApiResponse<VisitaRegistro>> {
    return apiClient.get(`/api/seguridad/visitas/${id}/`);
  },

  /**
   * Registrar nueva visita
   */
  async registrarVisita(data: CreateVisitaRequest): Promise<ApiResponse<VisitaRegistro>> {
    return apiClient.post('/api/seguridad/visitas/', data);
  },

  /**
   * Registrar salida de visita
   */
  async registrarSalida(id: number): Promise<ApiResponse<VisitaRegistro>> {
    return apiClient.post(`/api/seguridad/visitas/${id}/salida/`);
  },

  /**
   * Obtener visitas activas (sin salida registrada)
   */
  async getVisitasActivas(): Promise<ApiResponse<VisitaRegistro[]>> {
    return apiClient.get('/api/seguridad/visitas/activas/');
  },

  /**
   * Obtener visitas por unidad
   */
  async getVisitasByUnidad(unidadId: number, filters: VisitaFilters = {}): Promise<ApiResponse<PaginatedResponse<VisitaRegistro>>> {
    return apiClient.get(`/api/seguridad/visitas/unidad/${unidadId}/`, { params: filters });
  },

  /**
   * Obtener visitas frecuentes
   */
  async getVisitasFrecuentes(): Promise<ApiResponse<Array<{
    nombre_visitante: string;
    documento_visitante: string;
    frecuencia: number;
    ultima_visita: string;
  }>>> {
    return apiClient.get('/api/seguridad/visitas/frecuentes/');
  },

  /**
   * Autorizar visita previamente registrada
   */
  async autorizarVisita(id: number): Promise<ApiResponse<VisitaRegistro>> {
    return apiClient.post(`/api/seguridad/visitas/${id}/autorizar/`);
  },

  /**
   * Denegar acceso a visita
   */
  async denegarVisita(id: number, motivo: string): Promise<ApiResponse<VisitaRegistro>> {
    return apiClient.post(`/api/seguridad/visitas/${id}/denegar/`, { motivo });
  },

  /**
   * Tomar foto de visitante
   */
  async tomarFoto(id: number, foto: File): Promise<ApiResponse<VisitaRegistro>> {
    return apiClient.upload(`/api/seguridad/visitas/${id}/foto/`, foto, 'foto');
  },

  /**
   * Exportar registro de visitas
   */
  async exportarVisitas(filters: VisitaFilters = {}): Promise<ApiResponse<Blob>> {
    return apiClient.get('/api/seguridad/visitas/export/', { 
      params: filters,
      responseType: 'blob'
    });
  }
};

// =====================
// ALERTAS SERVICE
// =====================

export const alertasService = {
  /**
   * Obtener alertas activas
   */
  async getAlertasActivas(): Promise<ApiResponse<AlertaSeguridad[]>> {
    return apiClient.get('/api/seguridad/alertas/activas/');
  },

  /**
   * Crear nueva alerta
   */
  async crearAlerta(alerta: {
    tipo: 'emergencia' | 'intrusion' | 'fuego' | 'medica' | 'otro';
    ubicacion: string;
    descripcion: string;
    nivel_prioridad: 'bajo' | 'medio' | 'alto' | 'critico';
  }): Promise<ApiResponse<AlertaSeguridad>> {
    return apiClient.post('/api/seguridad/alertas/', alerta);
  },

  /**
   * Activar protocolo de emergencia
   */
  async activarProtocoloEmergencia(tipo: string): Promise<ApiResponse<{ message: string }>> {
    return apiClient.post('/api/seguridad/alertas/protocolo-emergencia/', { tipo });
  },

  /**
   * Desactivar alerta
   */
  async desactivarAlerta(id: number): Promise<ApiResponse<AlertaSeguridad>> {
    return apiClient.post(`/api/seguridad/alertas/${id}/desactivar/`);
  },

  /**
   * Obtener historial de alertas
   */
  async getHistorialAlertas(): Promise<ApiResponse<AlertaSeguridad[]>> {
    return apiClient.get('/api/seguridad/alertas/historial/');
  }
};

// =====================
// ACCESO CONTROL SERVICE
// =====================

export const accesoControlService = {
  /**
   * Obtener logs de acceso
   */
  async getLogsAcceso(filtros: {
    fecha_inicio?: string;
    fecha_fin?: string;
    ubicacion?: string;
    tipo_acceso?: 'entrada' | 'salida';
    usuario_id?: number;
  } = {}): Promise<ApiResponse<Array<{
    id: number;
    usuario: string;
    ubicacion: string;
    tipo_acceso: 'entrada' | 'salida';
    fecha_hora: string;
    metodo_acceso: 'tarjeta' | 'codigo' | 'biometrico' | 'manual';
    autorizado: boolean;
  }>>> {
    return apiClient.get('/api/seguridad/acceso/logs/', { params: filtros });
  },

  /**
   * Registrar acceso manual
   */
  async registrarAccesoManual(acceso: {
    usuario_id: number;
    ubicacion: string;
    tipo_acceso: 'entrada' | 'salida';
    observaciones?: string;
  }): Promise<ApiResponse<{ message: string }>> {
    return apiClient.post('/api/seguridad/acceso/manual/', acceso);
  },

  /**
   * Obtener configuración de acceso
   */
  async getConfiguracionAcceso(): Promise<ApiResponse<ConfiguracionSeguridad>> {
    return apiClient.get('/api/seguridad/acceso/configuracion/');
  },

  /**
   * Actualizar configuración de acceso
   */
  async updateConfiguracionAcceso(config: ConfiguracionSeguridad): Promise<ApiResponse<ConfiguracionSeguridad>> {
    return apiClient.patch('/api/seguridad/acceso/configuracion/', config);
  }
};

// =====================
// SEGURIDAD DASHBOARD SERVICE
// =====================

export const seguridadDashboardService = {
  /**
   * Obtener resumen del dashboard de seguridad
   */
  async getDashboardData(): Promise<ApiResponse<{
    incidentes_abiertos: number;
    visitas_activas: number;
    alertas_criticas: number;
    accesos_hoy: number;
    incidentes_por_tipo: Record<string, number>;
    incidentes_por_gravedad: Record<string, number>;
    visitas_por_hora: Array<{ hora: string; cantidad: number }>;
    incidentes_recientes: IncidenteSeguridad[];
    alertas_activas: AlertaSeguridad[];
  }>> {
    return apiClient.get('/api/seguridad/dashboard/');
  },

  /**
   * Obtener métricas en tiempo real
   */
  async getMetricasEnTiempoReal(): Promise<ApiResponse<{
    personas_en_edificio: number;
    ultima_actividad: string;
    sistemas_activos: boolean;
    camaras_funcionando: number;
    sensores_activos: number;
  }>> {
    return apiClient.get('/api/seguridad/dashboard/metricas-tiempo-real/');
  },

  /**
   * Obtener mapa de estado de seguridad
   */
  async getMapaSeguridad(): Promise<ApiResponse<Array<{
    ubicacion: string;
    estado: 'normal' | 'alerta' | 'critico';
    dispositivos: Array<{
      tipo: 'camara' | 'sensor' | 'alarma';
      estado: 'activo' | 'inactivo' | 'error';
    }>;
  }>>> {
    return apiClient.get('/api/seguridad/dashboard/mapa-estado/');
  }
};

// Export all services
export default {
  incidentesService,
  visitasService,
  alertasService,
  accesoControlService,
  seguridadDashboardService
};