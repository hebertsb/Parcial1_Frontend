/**
 * Seguridad Servicesexport interface UsuarioReconocimientoData {
  copropietario_id: number;
  nombres_completos: string;
  documento_identidad: string;
  unidad_residencial: string;
  tipo_residente: string;
  foto_perfil_url?: string;
  reconocimiento_facial: {
    total_fotos: number;
    fotos_urls: string[]; // URLs REALES DE DROPBOX
    fecha_ultimo_enrolamiento: string;
    ultima_verificacion?: string;
  };
  activo: boolean;
}nsive service layer for security operations
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
// RECONOCIMIENTO FACIAL SERVICE - ENDPOINTS ACTUALIZADOS SEGÚN DOCUMENTACIÓN BACKEND
// =====================

export interface UsuarioReconocimientoData {
  copropietario_id: number;
  nombre_completo: string;
  documento: string;
  tipo_documento: string;
  unidad_residencial: string;
  tipo_residente: string;
  telefono: string;
  email: string;
  reconocimiento_id: number;
  total_fotos: number;
  fotos_urls: string[]; // URLs de Dropbox
  fecha_enrolamiento: string;
  ultima_actualizacion: string;
  activo: boolean;
}

export interface UsuariosConReconocimientoResponse {
  total_usuarios: number;
  usuarios: UsuarioReconocimientoData[];
}

export interface FotosUsuarioData {
  copropietario: {
    id: number;
    nombre_completo: string;
    documento: string;
    tipo_documento: string;
    unidad_residencial: string;
    tipo_residente: string;
    telefono: string;
    email: string;
    activo: boolean;
  };
  reconocimiento: {
    id: number;
    tiene_reconocimiento: boolean;
    total_fotos: number;
    fotos_urls: string[]; // TODAS LAS URLs DE DROPBOX
    fecha_enrolamiento: string;
    ultima_actualizacion: string;
    proveedor_ia: string;
    activo: boolean;
  };
}

export interface DashboardSeguridadData {
  totales: {
    copropietarios_activos: number;
    usuarios_con_reconocimiento: number;
    usuarios_con_fotos: number;
    total_fotos_sistema: number;
  };
  porcentajes: {
    cobertura_reconocimiento: number;
    usuarios_con_fotos: number;
  };
  por_tipo_residente: {
    Propietario: number;
    Inquilino: number;
    Familiar: number;
  };
  promedio_fotos_por_usuario: number;
}

// Función auxiliar para validar URLs de Dropbox
const esUrlDropboxValida = (url: string): boolean => {
  return url.includes('www.dropbox.com/scl/fi/') || 
         url.includes('dl.dropboxusercontent.com') ||
         url.includes('dropbox.com/scl/fi/');
};

// Función auxiliar para filtrar URLs válidas de Dropbox
const filtrarUrlsDropboxValidas = (urls: string[]): string[] => {
  const urlsValidas = urls.filter(esUrlDropboxValida);
  const urlsInvalidas = urls.filter(url => !esUrlDropboxValida(url));
  
  if (urlsInvalidas.length > 0) {
    console.warn('⚠️ URLs de fotos no válidas encontradas:', urlsInvalidas);
  }
  if (urlsValidas.length > 0) {
    console.log('✅ URLs válidas de Dropbox encontradas:', urlsValidas.length);
  }
  
  return urlsValidas;
};

export const reconocimientoFacialService = {
  /**
   * Dashboard de estadísticas del panel de seguridad
   * Endpoint: GET /api/authz/seguridad/dashboard/
   * SEGÚN DOCUMENTACIÓN BACKEND
   */
  async getDashboard(): Promise<ApiResponse<DashboardSeguridadData>> {
    console.log('� Obteniendo dashboard según documentación backend...');
    try {
      const response = await fetch('http://127.0.0.1:8000/api/authz/seguridad/dashboard/', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const result = await response.json();
        console.log('✅ Dashboard cargado:', result);
        return { success: true, data: result.data };
      } else {
        console.log('⚠️ Dashboard endpoint no disponible, calculando desde usuarios...');
        // Fallback: calcular desde usuarios
        const usuarios = await this.obtenerUsuariosConReconocimiento();
        
        if (usuarios.success && usuarios.data) {
          const totalFotos = usuarios.data.reduce((sum, user) => sum + (user.reconocimiento_facial?.total_fotos || 0), 0);
          const usuariosActivos = usuarios.data.filter(u => u.activo).length;
          const usuariosConFotos = usuarios.data.filter(u => u.reconocimiento_facial?.total_fotos > 0).length;
          const propietarios = usuarios.data.filter(u => u.tipo_residente === 'Propietario').length;
          const inquilinos = usuarios.data.filter(u => u.tipo_residente === 'Inquilino').length;
          
          const dashboardData: DashboardSeguridadData = {
            totales: {
              copropietarios_activos: usuariosActivos,
              usuarios_con_reconocimiento: usuarios.data.length,
              usuarios_con_fotos: usuariosConFotos,
              total_fotos_sistema: totalFotos
            },
            porcentajes: {
              cobertura_reconocimiento: usuariosActivos > 0 ? (usuarios.data.length / usuariosActivos) * 100 : 0,
              usuarios_con_fotos: usuariosActivos > 0 ? (usuariosConFotos / usuariosActivos) * 100 : 0
            },
            por_tipo_residente: {
              Propietario: propietarios,
              Inquilino: inquilinos,
              Familiar: 0
            },
            promedio_fotos_por_usuario: usuariosConFotos > 0 ? totalFotos / usuariosConFotos : 0
          };
          
          console.log('✅ Dashboard calculado desde usuarios:', dashboardData);
          return { success: true, data: dashboardData };
        } else {
          return { success: false, message: 'No se pudo calcular dashboard' };
        }
      }
    } catch (error) {
      console.error('❌ Error obteniendo dashboard:', error);
      return { success: false, message: 'Error de conexión con el servidor' };
    }
  },

  /**
   * Obtener usuarios con reconocimiento facial
   */
  async obtenerUsuariosConReconocimiento(): Promise<ApiResponse<UsuariosConReconocimientoResponse>> {
    console.log('🔍 Obteniendo usuarios con reconocimiento facial...');
    try {
      const response = await fetch('http://127.0.0.1:8000/api/authz/seguridad/usuarios-con-fotos/', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const backendResponse = await response.json();
        console.log('✅ Respuesta completa del backend:', backendResponse);
        
        // Extraer los datos correctos del backend
        const data = backendResponse.data;
        console.log('📦 Datos extraídos:', data);
        
        // 🔍 VERIFICAR Y FILTRAR URLs VÁLIDAS DE DROPBOX
        if (data && data.usuarios && Array.isArray(data.usuarios)) {
          console.log('🔍 Procesando y validando URLs de fotos...');
          
          // Procesar cada usuario para filtrar URLs válidas
          data.usuarios = data.usuarios.map((usuario: any) => {
            if (usuario.fotos_urls && Array.isArray(usuario.fotos_urls)) {
              const urlsOriginales = usuario.fotos_urls.length;
              usuario.fotos_urls = filtrarUrlsDropboxValidas(usuario.fotos_urls);
              const urlsValidas = usuario.fotos_urls.length;
              
              console.log(`👤 ${usuario.nombre_completo}: ${urlsOriginales} URLs originales → ${urlsValidas} URLs válidas`);
              
              // Actualizar total_fotos con el número real de URLs válidas
              usuario.total_fotos = urlsValidas;
            }
            return usuario;
          });
          
          console.log('✅ Filtrado de URLs completado');
        }
        
        return { success: true, data: data };
      } else {
        const errorData = await response.json();
        console.error('❌ Error obteniendo usuarios:', errorData);
        return { success: false, message: errorData.error || `Error ${response.status}` };
      }
    } catch (error) {
      console.error('❌ Error de conexión usuarios:', error);
      return { success: false, message: 'Error de conexión con el servidor' };
    }
  },

  /**
   * Obtener fotos completas de un usuario específico
   * Endpoint real: GET /api/authz/seguridad/usuario-fotos/{copropietario_id}/
   */
  async obtenerFotosUsuario(copropietarioId: number): Promise<ApiResponse<FotosUsuarioData>> {
    console.log(`🔍 Obteniendo fotos del copropietario ${copropietarioId}...`);
    try {
      const response = await fetch(`http://127.0.0.1:8000/api/authz/seguridad/usuario-fotos/${copropietarioId}/`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const result = await response.json();
        console.log('✅ Fotos del usuario cargadas:', result);
        
        // Mapear según la estructura real de la documentación
        const fotosData: FotosUsuarioData = {
          copropietario: {
            id: result.data.copropietario?.id || 0,
            nombre_completo: result.data.copropietario?.nombre_completo || '',
            documento: result.data.copropietario?.documento || '',
            tipo_documento: result.data.copropietario?.tipo_documento || 'CI',
            unidad_residencial: result.data.copropietario?.unidad_residencial || '',
            tipo_residente: result.data.copropietario?.tipo_residente || 'Propietario',
            telefono: result.data.copropietario?.telefono || '',
            email: result.data.copropietario?.email || '',
            activo: result.data.copropietario?.activo || true
          },
          reconocimiento: {
            id: result.data.reconocimiento?.id || 0,
            tiene_reconocimiento: result.data.reconocimiento?.tiene_reconocimiento || true,
            total_fotos: result.data.reconocimiento?.total_fotos || 0,
            fotos_urls: result.data.reconocimiento?.fotos_urls || [],
            fecha_enrolamiento: result.data.reconocimiento?.fecha_enrolamiento || new Date().toISOString(),
            ultima_actualizacion: result.data.reconocimiento?.ultima_actualizacion || new Date().toISOString(),
            proveedor_ia: result.data.reconocimiento?.proveedor_ia || 'Local',
            activo: result.data.reconocimiento?.activo || true
          }
        };
        
        return { success: true, data: fotosData };
      } else {
        const errorData = await response.json();
        console.error('❌ Error obteniendo fotos:', errorData);
        return { success: false, message: errorData.message || `Error ${response.status}` };
      }
    } catch (error) {
      console.error('❌ Error de conexión fotos:', error);
      return { success: false, message: 'Error de conexión con el servidor' };
    }
  }
};

// =====================
// INCIDENTES SERVICE
// =====================

export const incidentesService = {
  /**
   * Obtener lista de incidentes con filtros
   */
  async getIncidentes(filters: IncidenteFilters = {}): Promise<ApiResponse<PaginatedResponse<IncidenteSeguridad>>> {
    return apiClient.get('/authz/seguridad/incidentes/', { params: filters });
  },

  /**
   * Obtener incidente por ID
   */
  async getIncidenteById(id: number): Promise<ApiResponse<IncidenteSeguridad>> {
    return apiClient.get(`/authz/seguridad/incidentes/${id}/`);
  },

  /**
   * Crear nuevo incidente
   */
  async createIncidente(data: CreateIncidenteRequest): Promise<ApiResponse<IncidenteSeguridad>> {
    return apiClient.post('/authz/seguridad/incidentes/', data);
  },

  /**
   * Actualizar incidente existente
   */
  async updateIncidente(id: number, data: UpdateIncidenteRequest): Promise<ApiResponse<IncidenteSeguridad>> {
    return apiClient.patch(`/authz/seguridad/incidentes/${id}/`, data);
  },

  /**
   * Eliminar incidente
   */
  async deleteIncidente(id: number): Promise<ApiResponse<void>> {
    return apiClient.delete(`/authz/seguridad/incidentes/${id}/`);
  },

  /**
   * Eliminación en lote de incidentes
   */
  async bulkDeleteIncidentes(request: BulkDeleteRequest): Promise<ApiResponse<{ deleted_count: number }>> {
    return apiClient.post('/authz/seguridad/incidentes/bulk-delete/', request);
  },

  /**
   * Asignar incidente a personal de seguridad
   */
  async asignarIncidente(id: number, usuarioId: number): Promise<ApiResponse<IncidenteSeguridad>> {
    return apiClient.post(`/authz/seguridad/incidentes/${id}/asignar/`, { usuario_id: usuarioId });
  },

  /**
   * Cambiar estado del incidente
   */
  async cambiarEstado(id: number, estado: 'abierto' | 'en_proceso' | 'resuelto' | 'cerrado'): Promise<ApiResponse<IncidenteSeguridad>> {
    return apiClient.post(`/authz/seguridad/incidentes/${id}/cambiar-estado/`, { estado });
  },

  /**
   * Resolver incidente
   */
  async resolverIncidente(id: number, solucion: string): Promise<ApiResponse<IncidenteSeguridad>> {
    return apiClient.post(`/authz/seguridad/incidentes/${id}/resolver/`, { solucion });
  },

  /**
   * Adjuntar evidencia a incidente
   */
  async adjuntarEvidencia(id: number, files: File[], onProgress?: (progress: number) => void): Promise<ApiResponse<IncidenteSeguridad>> {
    const formData = new FormData();
    files.forEach((file, index) => {
      formData.append(`evidencia_${index}`, file);
    });
    
    return apiClient.upload(`/authz/seguridad/incidentes/${id}/evidencias/`, files[0], 'evidencias', undefined, onProgress);
  },

  /**
   * Obtener incidentes críticos
   */
  async getIncidentesCriticos(): Promise<ApiResponse<IncidenteSeguridad[]>> {
    return apiClient.get('/authz/seguridad/incidentes/criticos/');
  },

  /**
   * Obtener incidentes por ubicación
   */
  async getIncidentesByUbicacion(ubicacion: string): Promise<ApiResponse<IncidenteSeguridad[]>> {
    return apiClient.get('/authz/seguridad/incidentes/ubicacion/', { params: { ubicacion } });
  },

  /**
   * Generar reporte de incidentes
   */
  async generarReporte(fechaInicio: string, fechaFin: string): Promise<ApiResponse<Blob>> {
    return apiClient.get('/authz/seguridad/incidentes/reporte/', {
      params: { fecha_inicio: fechaInicio, fecha_fin: fechaFin },
      responseType: 'blob'
    });
  },

  /**
   * Obtener estadísticas de incidentes
   */
  async getEstadisticas(): Promise<ApiResponse<EstadisticasSeguridad>> {
    return apiClient.get('/authz/seguridad/incidentes/estadisticas/');
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
    return apiClient.get('/authz/seguridad/visitas/', { params: filters });
  },

  /**
   * Obtener visita por ID
   */
  async getVisitaById(id: number): Promise<ApiResponse<VisitaRegistro>> {
    return apiClient.get(`/authz/seguridad/visitas/${id}/`);
  },

  /**
   * Registrar nueva visita
   */
  async registrarVisita(data: CreateVisitaRequest): Promise<ApiResponse<VisitaRegistro>> {
    return apiClient.post('/authz/seguridad/visitas/', data);
  },

  /**
   * Registrar salida de visita
   */
  async registrarSalida(id: number): Promise<ApiResponse<VisitaRegistro>> {
    return apiClient.post(`/authz/seguridad/visitas/${id}/salida/`);
  },

  /**
   * Obtener visitas activas (sin salida registrada)
   */
  async getVisitasActivas(): Promise<ApiResponse<VisitaRegistro[]>> {
    return apiClient.get('/authz/seguridad/visitas/activas/');
  },

  /**
   * Obtener visitas por unidad
   */
  async getVisitasByUnidad(unidadId: number, filters: VisitaFilters = {}): Promise<ApiResponse<PaginatedResponse<VisitaRegistro>>> {
    return apiClient.get(`/authz/seguridad/visitas/unidad/${unidadId}/`, { params: filters });
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
    return apiClient.get('/authz/seguridad/visitas/frecuentes/');
  },

  /**
   * Autorizar visita previamente registrada
   */
  async autorizarVisita(id: number): Promise<ApiResponse<VisitaRegistro>> {
    return apiClient.post(`/authz/seguridad/visitas/${id}/autorizar/`);
  },

  /**
   * Denegar acceso a visita
   */
  async denegarVisita(id: number, motivo: string): Promise<ApiResponse<VisitaRegistro>> {
    return apiClient.post(`/authz/seguridad/visitas/${id}/denegar/`, { motivo });
  },

  /**
   * Tomar foto de visitante
   */
  async tomarFoto(id: number, foto: File): Promise<ApiResponse<VisitaRegistro>> {
    return apiClient.upload(`/authz/seguridad/visitas/${id}/foto/`, foto, 'foto');
  },

  /**
   * Exportar registro de visitas
   */
  async exportarVisitas(filters: VisitaFilters = {}): Promise<ApiResponse<Blob>> {
    return apiClient.get('/authz/seguridad/visitas/export/', { 
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
    return apiClient.get('/authz/seguridad/alertas/activas/');
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
    return apiClient.post('/authz/seguridad/alertas/', alerta);
  },

  /**
   * Activar protocolo de emergencia
   */
  async activarProtocoloEmergencia(tipo: string): Promise<ApiResponse<{ message: string }>> {
    return apiClient.post('/authz/seguridad/alertas/protocolo-emergencia/', { tipo });
  },

  /**
   * Desactivar alerta
   */
  async desactivarAlerta(id: number): Promise<ApiResponse<AlertaSeguridad>> {
    return apiClient.post(`/authz/seguridad/alertas/${id}/desactivar/`);
  },

  /**
   * Obtener historial de alertas
   */
  async getHistorialAlertas(): Promise<ApiResponse<AlertaSeguridad[]>> {
    return apiClient.get('/authz/seguridad/alertas/historial/');
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
    return apiClient.get('/authz/seguridad/acceso/logs/', { params: filtros });
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
    return apiClient.post('/authz/seguridad/acceso/manual/', acceso);
  },

  /**
   * Obtener configuración de acceso
   */
  async getConfiguracionAcceso(): Promise<ApiResponse<ConfiguracionSeguridad>> {
    return apiClient.get('/authz/seguridad/acceso/configuracion/');
  },

  /**
   * Actualizar configuración de acceso
   */
  async updateConfiguracionAcceso(config: ConfiguracionSeguridad): Promise<ApiResponse<ConfiguracionSeguridad>> {
    return apiClient.patch('/authz/seguridad/acceso/configuracion/', config);
  }
};

// =====================
// SEGURIDAD DASHBOARD SERVICE
// =====================

export const seguridadDashboardService = {
  /**
   * Obtener resumen del dashboard de seguridad
   * CORREGIDO según documentación del backend
   */
  async getDashboardData(): Promise<ApiResponse<{
    estadisticas: {
      total_copropietarios: number;
      total_con_reconocimiento: number;
      total_fotos: number;
      porcentaje_enrolamiento: number;
    };
    resumen: string;
  }>> {
    return apiClient.get('/api/authz/seguridad/dashboard/');
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
    return apiClient.get('/authz/seguridad/dashboard/metricas-tiempo-real/');
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
    return apiClient.get('/authz/seguridad/dashboard/mapa-estado/');
  }
};

// =====================
// TIPOS ADICIONALES SEGÚN DOCUMENTACIÓN BACKEND
// =====================

export interface VisitaActiva {
  id: number;
  nombre_visitante: string;
  unidad_residencial: string;
  hora_entrada: string;
  activo: boolean;
}

export interface AlertaActiva {
  id: number;
  tipo_alerta: string;
  unidad_residencial: string;
  hora_alerta: string;
  activo: boolean;
}



// Export all services
export default {
  incidentesService,
  visitasService,
  alertasService,
  accesoControlService,
  seguridadDashboardService,
  reconocimientoFacialService
};
