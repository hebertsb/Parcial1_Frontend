/**
 * Unidades Services
 * Comprehensive service layer for units management operations
 */

import { apiClient } from '../../core/api/client';
import type { 
  Unidad, 
  CreateUnidadRequest,
  UpdateUnidadRequest,
  UnidadFilters,
  PaginatedResponse,
  BulkDeleteRequest,
  ApiResponse,
  Propietario,
  CreatePropietarioRequest,
  UpdatePropietarioRequest,
  PropietarioFilters,
  HistorialCambio,
  EstadisticasUnidades
} from '../../core/types';

// =====================
// UNIDADES SERVICE
// =====================

export const unidadesService = {
  /**
   * Obtener lista de unidades con filtros
   */
  async getUnidades(filters: UnidadFilters = {}): Promise<ApiResponse<PaginatedResponse<Unidad>>> {
    return apiClient.get('/api/unidades/', { params: filters });
  },

  /**
   * Obtener unidad por ID
   */
  async getUnidadById(id: number): Promise<ApiResponse<Unidad>> {
    return apiClient.get(`/api/unidades/${id}/`);
  },

  /**
   * Crear nueva unidad
   */
  async createUnidad(data: CreateUnidadRequest): Promise<ApiResponse<Unidad>> {
    return apiClient.post('/api/unidades/', data);
  },

  /**
   * Actualizar unidad existente
   */
  async updateUnidad(id: number, data: UpdateUnidadRequest): Promise<ApiResponse<Unidad>> {
    return apiClient.patch(`/api/unidades/${id}/`, data);
  },

  /**
   * Eliminar unidad
   */
  async deleteUnidad(id: number): Promise<ApiResponse<void>> {
    return apiClient.delete(`/api/unidades/${id}/`);
  },

  /**
   * Eliminación en lote de unidades
   */
  async bulkDeleteUnidades(request: BulkDeleteRequest): Promise<ApiResponse<{ deleted_count: number }>> {
    return apiClient.post('/api/unidades/bulk-delete/', request);
  },

  /**
   * Obtener unidades por piso
   */
  async getUnidadesByPiso(piso: number): Promise<ApiResponse<Unidad[]>> {
    return apiClient.get(`/api/unidades/piso/${piso}/`);
  },

  /**
   * Obtener unidades por torre
   */
  async getUnidadesByTorre(torre: string): Promise<ApiResponse<Unidad[]>> {
    return apiClient.get(`/api/unidades/torre/${torre}/`);
  },

  /**
   * Obtener unidades disponibles (sin propietario)
   */
  async getUnidadesDisponibles(): Promise<ApiResponse<Unidad[]>> {
    return apiClient.get('/api/unidades/disponibles/');
  },

  /**
   * Obtener unidades ocupadas (con propietario)
   */
  async getUnidadesOcupadas(): Promise<ApiResponse<Unidad[]>> {
    return apiClient.get('/api/unidades/ocupadas/');
  },

  /**
   * Cambiar estado de unidad
   */
  async cambiarEstadoUnidad(id: number, estado: 'ocupada' | 'disponible' | 'mantenimiento'): Promise<ApiResponse<Unidad>> {
    return apiClient.post(`/api/unidades/${id}/cambiar-estado/`, { estado });
  },

  /**
   * Asignar propietario a unidad
   */
  async asignarPropietario(unidadId: number, propietarioId: number): Promise<ApiResponse<Unidad>> {
    return apiClient.post(`/api/unidades/${unidadId}/asignar-propietario/`, { propietario_id: propietarioId });
  },

  /**
   * Desasignar propietario de unidad
   */
  async desasignarPropietario(unidadId: number): Promise<ApiResponse<Unidad>> {
    return apiClient.post(`/api/unidades/${unidadId}/desasignar-propietario/`);
  },

  /**
   * Obtener historial de cambios de una unidad
   */
  async getHistorialCambios(unidadId: number): Promise<ApiResponse<HistorialCambio[]>> {
    return apiClient.get(`/api/unidades/${unidadId}/historial/`);
  },

  /**
   * Exportar unidades a Excel
   */
  async exportarUnidades(filters: UnidadFilters = {}): Promise<ApiResponse<Blob>> {
    return apiClient.get('/api/unidades/export/', { 
      params: filters,
      responseType: 'blob'
    });
  },

  /**
   * Importar unidades desde Excel
   */
  async importarUnidades(file: File, onProgress?: (progress: number) => void): Promise<ApiResponse<{ 
    created: number; 
    updated: number; 
    errors: string[] 
  }>> {
    return apiClient.upload('/api/unidades/import/', file, 'file', undefined, onProgress);
  },

  /**
   * Duplicar unidad
   */
  async duplicarUnidad(id: number): Promise<ApiResponse<Unidad>> {
    return apiClient.post(`/api/unidades/${id}/duplicar/`);
  },

  /**
   * Obtener estadísticas de unidades
   */
  async getEstadisticas(): Promise<ApiResponse<EstadisticasUnidades>> {
    return apiClient.get('/api/unidades/estadisticas/');
  }
};

// =====================
// PROPIETARIOS SERVICE
// =====================

export const propietariosService = {
  /**
   * Obtener lista de propietarios con filtros
   */
  async getPropietarios(filters: PropietarioFilters = {}): Promise<ApiResponse<PaginatedResponse<Propietario>>> {
    return apiClient.get('/api/propietarios/', { params: filters });
  },

  /**
   * Obtener propietario por ID
   */
  async getPropietarioById(id: number): Promise<ApiResponse<Propietario>> {
    return apiClient.get(`/api/propietarios/${id}/`);
  },

  /**
   * Crear nuevo propietario
   */
  async createPropietario(data: CreatePropietarioRequest): Promise<ApiResponse<Propietario>> {
    return apiClient.post('/api/propietarios/', data);
  },

  /**
   * Actualizar propietario existente
   */
  async updatePropietario(id: number, data: UpdatePropietarioRequest): Promise<ApiResponse<Propietario>> {
    return apiClient.patch(`/api/propietarios/${id}/`, data);
  },

  /**
   * Eliminar propietario
   */
  async deletePropietario(id: number): Promise<ApiResponse<void>> {
    return apiClient.delete(`/api/propietarios/${id}/`);
  },

  /**
   * Obtener propietarios sin unidad asignada
   */
  async getPropietariosSinUnidad(): Promise<ApiResponse<Propietario[]>> {
    return apiClient.get('/api/propietarios/sin-unidad/');
  },

  /**
   * Obtener unidades de un propietario
   */
  async getUnidadesPropietario(propietarioId: number): Promise<ApiResponse<Unidad[]>> {
    return apiClient.get(`/api/propietarios/${propietarioId}/unidades/`);
  },

  /**
   * Buscar propietarios por texto
   */
  async buscarPropietarios(query: string): Promise<ApiResponse<Propietario[]>> {
    return apiClient.get('/api/propietarios/buscar/', { params: { q: query } });
  },

  /**
   * Subir foto de propietario
   */
  async subirFoto(id: number, file: File, onProgress?: (progress: number) => void): Promise<ApiResponse<Propietario>> {
    return apiClient.upload(`/api/propietarios/${id}/foto/`, file, 'foto', undefined, onProgress);
  },

  /**
   * Obtener contactos de emergencia
   */
  async getContactosEmergencia(propietarioId: number): Promise<ApiResponse<Array<{
    id: number;
    nombre: string;
    telefono: string;
    relacion: string;
    es_principal: boolean;
  }>>> {
    return apiClient.get(`/api/propietarios/${propietarioId}/contactos-emergencia/`);
  },

  /**
   * Agregar contacto de emergencia
   */
  async agregarContactoEmergencia(propietarioId: number, contacto: {
    nombre: string;
    telefono: string;
    relacion: string;
    es_principal?: boolean;
  }): Promise<ApiResponse<{ message: string }>> {
    return apiClient.post(`/api/propietarios/${propietarioId}/contactos-emergencia/`, contacto);
  }
};

// =====================
// MANTENIMIENTO SERVICE
// =====================

export const mantenimientoService = {
  /**
   * Obtener solicitudes de mantenimiento por unidad
   */
  async getSolicitudesMantenimiento(unidadId: number): Promise<ApiResponse<Array<{
    id: number;
    tipo: string;
    descripcion: string;
    estado: 'pendiente' | 'en_proceso' | 'completado' | 'cancelado';
    fecha_solicitud: string;
    fecha_programada?: string;
    fecha_completado?: string;
    costo_estimado?: number;
    costo_real?: number;
    tecnico_asignado?: string;
  }>>> {
    return apiClient.get(`/api/unidades/${unidadId}/mantenimiento/`);
  },

  /**
   * Crear solicitud de mantenimiento
   */
  async crearSolicitudMantenimiento(unidadId: number, solicitud: {
    tipo: string;
    descripcion: string;
    prioridad: 'baja' | 'media' | 'alta' | 'urgente';
    fecha_preferida?: string;
  }): Promise<ApiResponse<{ message: string }>> {
    return apiClient.post(`/api/unidades/${unidadId}/mantenimiento/`, solicitud);
  },

  /**
   * Programar mantenimiento preventivo
   */
  async programarMantenimientoPreventivo(unidadId: number, programa: {
    tipo: string;
    frecuencia: 'mensual' | 'trimestral' | 'semestral' | 'anual';
    fecha_inicio: string;
    descripcion?: string;
  }): Promise<ApiResponse<{ message: string }>> {
    return apiClient.post(`/api/unidades/${unidadId}/mantenimiento-preventivo/`, programa);
  }
};

// =====================
// UNIDADES DASHBOARD SERVICE
// =====================

export const unidadesDashboardService = {
  /**
   * Obtener resumen del dashboard de unidades
   */
  async getDashboardData(): Promise<ApiResponse<{
    total_unidades: number;
    unidades_ocupadas: number;
    unidades_disponibles: number;
    unidades_mantenimiento: number;
    ocupacion_por_torre: Record<string, number>;
    ocupacion_por_piso: Record<string, number>;
    solicitudes_mantenimiento_pendientes: number;
    nuevos_propietarios_mes: number;
    estadisticas_mensuales: Array<{
      mes: string;
      nuevas_ocupaciones: number;
      liberaciones: number;
    }>;
  }>> {
    return apiClient.get('/api/unidades/dashboard/');
  },

  /**
   * Obtener ocupación en tiempo real
   */
  async getOcupacionTiempoReal(): Promise<ApiResponse<{
    porcentaje_ocupacion: number;
    unidades_disponibles_hoy: number;
    nuevas_asignaciones_hoy: number;
    solicitudes_mantenimiento_hoy: number;
  }>> {
    return apiClient.get('/api/unidades/dashboard/ocupacion-tiempo-real/');
  },

  /**
   * Obtener mapa de ocupación
   */
  async getMapaOcupacion(): Promise<ApiResponse<Array<{
    torre: string;
    piso: number;
    unidades: Array<{
      numero: string;
      estado: 'ocupada' | 'disponible' | 'mantenimiento';
      propietario?: string;
    }>;
  }>>> {
    return apiClient.get('/api/unidades/dashboard/mapa-ocupacion/');
  }
};

// Export all services
export default {
  unidadesService,
  propietariosService,
  mantenimientoService,
  unidadesDashboardService
};