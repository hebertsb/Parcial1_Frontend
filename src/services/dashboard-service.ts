'use client';

import { ApiResponse } from '@/core/types';
import { reconocimientoFacialService } from '@/features/seguridad/services';
import { sincronizacionReconocimientoService } from '@/features/seguridad/sincronizacion-service';

interface DashboardStats {
  total_usuarios_reconocimiento: number;
  usuarios_con_fotos: number;
  total_fotos: number;
  accesos_hoy: number;
  incidentes_abiertos: number;
  visitas_activas: number;
  porcentaje_enrolamiento: number;
  estado_sistema: 'activo' | 'mantenimiento' | 'error';
}

interface VisitaActiva {
  id: number;
  visitante: string;
  unidad: string;
  fecha_hora: string;
  estado: string;
}

interface Incidente {
  id: number;
  tipo: string;
  descripcion: string;
  fecha_hora: string;
  estado: string;
}

export class DashboardService {
  private static baseUrl = 'http://localhost:8000';
  
  private static getAuthHeaders() {
    const token = typeof window !== 'undefined' ? localStorage.getItem('access_token') : null;
    return {
      'Authorization': token ? `Bearer ${token}` : '',
      'Content-Type': 'application/json',
    };
  }

  /**
   * Obtener estadísticas principales del dashboard
   */
  static async obtenerEstadisticasDashboard(): Promise<ApiResponse<DashboardStats>> {
    try {
      console.log('📊 Obteniendo estadísticas del dashboard...');

      // 1. Obtener usuarios con reconocimiento facial
      const usuariosResponse = await reconocimientoFacialService.obtenerUsuariosConReconocimiento();
      let totalUsuarios = 0;
      let usuariosConFotos = 0;
      let totalFotos = 0;
      let porcentajeEnrolamiento = 0;

      if (usuariosResponse.success && usuariosResponse.data) {
        // Verificar si la respuesta tiene usuarios directamente o en una propiedad
        const usuarios = Array.isArray(usuariosResponse.data) 
          ? usuariosResponse.data 
          : usuariosResponse.data.usuarios || [];
        
        totalUsuarios = usuarios.length;
        
        usuariosConFotos = usuarios.filter((usuario: any) => {
          const tieneUrls = usuario.fotos_urls && usuario.fotos_urls.length > 0;
          const tieneFotos = usuario.total_fotos && usuario.total_fotos > 0;
          const tieneReconocimiento = usuario.fotos_reconocimiento && usuario.fotos_reconocimiento.cantidad > 0;
          return tieneUrls || tieneFotos || tieneReconocimiento;
        }).length;

        totalFotos = 0;
        usuarios.forEach((usuario: any) => {
          const fotasUsuario = usuario.total_fotos || 
                              usuario.fotos_urls?.length || 
                              usuario.fotos_reconocimiento?.cantidad || 0;
          totalFotos += fotasUsuario;
        });

        porcentajeEnrolamiento = totalUsuarios > 0 ? (usuariosConFotos / totalUsuarios) * 100 : 0;
      }

      // 2. Obtener visitas activas
      let visitasActivas = 0;
      try {
        const visitasResponse = await fetch(`${this.baseUrl}/api/authz/seguridad/visitas/activas/`, {
          headers: this.getAuthHeaders(),
        });
        
        if (visitasResponse.ok) {
          const visitasData = await visitasResponse.json();
          visitasActivas = Array.isArray(visitasData) ? visitasData.length : 
                          (visitasData.data && Array.isArray(visitasData.data)) ? visitasData.data.length : 0;
          console.log('✅ Visitas activas obtenidas:', visitasActivas);
        } else {
          console.log('⚠️ Endpoint de visitas no disponible, usando 0');
        }
      } catch (error) {
        console.log('⚠️ Error obteniendo visitas activas:', error);
      }

      // 3. Obtener incidentes abiertos
      let incidentesAbiertos = 0;
      try {
        const incidentesResponse = await fetch(`${this.baseUrl}/api/authz/seguridad/incidentes/`, {
          headers: this.getAuthHeaders(),
        });
        
        if (incidentesResponse.ok) {
          const incidentesData = await incidentesResponse.json();
          const incidentes = Array.isArray(incidentesData) ? incidentesData : 
                           (incidentesData.data && Array.isArray(incidentesData.data)) ? incidentesData.data : 
                           incidentesData.results ? incidentesData.results : [];
          
          // Filtrar solo incidentes abiertos/activos
          incidentesAbiertos = incidentes.filter((incidente: any) => 
            incidente.estado === 'abierto' || incidente.estado === 'activo' || incidente.estado === 'pendiente'
          ).length;
          
          console.log('✅ Incidentes abiertos obtenidos:', incidentesAbiertos);
        } else {
          console.log('⚠️ Endpoint de incidentes no disponible, usando 0');
        }
      } catch (error) {
        console.log('⚠️ Error obteniendo incidentes:', error);
      }

      const stats: DashboardStats = {
        total_usuarios_reconocimiento: totalUsuarios,
        usuarios_con_fotos: usuariosConFotos,
        total_fotos: totalFotos,
        accesos_hoy: 0, // Se actualizará desde ActivityContext
        incidentes_abiertos: incidentesAbiertos,
        visitas_activas: visitasActivas,
        porcentaje_enrolamiento: Math.round(porcentajeEnrolamiento * 100) / 100,
        estado_sistema: 'activo'
      };

      console.log('📊 Estadísticas calculadas:', stats);
      return { success: true, data: stats };

    } catch (error) {
      console.error('❌ Error obteniendo estadísticas del dashboard:', error);
      return { 
        success: false, 
        message: 'Error obteniendo estadísticas del dashboard',
        data: {
          total_usuarios_reconocimiento: 0,
          usuarios_con_fotos: 0,
          total_fotos: 0,
          accesos_hoy: 0,
          incidentes_abiertos: 0,
          visitas_activas: 0,
          porcentaje_enrolamiento: 0,
          estado_sistema: 'error'
        } as DashboardStats
      };
    }
  }

  /**
   * Obtener visitas activas detalladas
   */
  static async obtenerVisitasActivas(): Promise<ApiResponse<VisitaActiva[]>> {
    try {
      const response = await fetch(`${this.baseUrl}/api/authz/seguridad/visitas/activas/`, {
        headers: this.getAuthHeaders(),
      });

      if (response.ok) {
        const data = await response.json();
        const visitas = Array.isArray(data) ? data : (data.data || []);
        return { success: true, data: visitas };
      } else {
        console.log('⚠️ Endpoint de visitas no disponible');
        return { success: true, data: [] };
      }
    } catch (error) {
      console.error('❌ Error obteniendo visitas activas:', error);
      return { success: false, message: 'Error obteniendo visitas activas', data: [] };
    }
  }

  /**
   * Obtener incidentes abiertos detallados
   */
  static async obtenerIncidentesAbiertos(): Promise<ApiResponse<Incidente[]>> {
    try {
      const response = await fetch(`${this.baseUrl}/api/authz/seguridad/incidentes/`, {
        headers: this.getAuthHeaders(),
      });

      if (response.ok) {
        const data = await response.json();
        const incidentes = Array.isArray(data) ? data : 
                          (data.data && Array.isArray(data.data)) ? data.data : 
                          data.results ? data.results : [];
        
        // Filtrar solo incidentes abiertos
        const incidentesAbiertos = incidentes.filter((incidente: any) => 
          incidente.estado === 'abierto' || incidente.estado === 'activo' || incidente.estado === 'pendiente'
        );
        
        return { success: true, data: incidentesAbiertos };
      } else {
        console.log('⚠️ Endpoint de incidentes no disponible');
        return { success: true, data: [] };
      }
    } catch (error) {
      console.error('❌ Error obteniendo incidentes:', error);
      return { success: false, message: 'Error obteniendo incidentes', data: [] };
    }
  }

  /**
   * Obtener actividad reciente del backend (logs de acceso)
   */
  static async obtenerActividadReciente(limite: number = 10): Promise<ApiResponse<any[]>> {
    try {
      console.log('📋 Obteniendo actividad reciente del backend...');
      
      // Intentar obtener logs de acceso
      const response = await fetch(`${this.baseUrl}/api/authz/seguridad/acceso/logs/?limit=${limite}`, {
        headers: this.getAuthHeaders(),
      });

      if (response.ok) {
        const data = await response.json();
        const logs = Array.isArray(data) ? data : 
                    (data.data && Array.isArray(data.data)) ? data.data : 
                    data.results ? data.results : [];
        
        console.log('✅ Logs de acceso obtenidos:', logs.length);
        
        // Transformar logs del backend al formato de ActivityItem
        const actividades = logs.map((log: any, index: number) => ({
          id: `backend_${log.id || index}_${Date.now()}`,
          tipo: this.determinarTipoActividad(log),
          usuario: log.usuario_nombre || log.usuario || log.nombre_completo || 'Usuario desconocido',
          descripcion: this.generarDescripcionActividad(log),
          timestamp: log.fecha_hora || log.timestamp || new Date().toISOString(),
          estado: this.determinarEstadoActividad(log),
          detalles: {
            confianza: log.confianza || log.confidence,
            metodo: log.metodo_acceso || log.metodo || 'facial',
            unidad: log.unidad || log.apartamento,
            documento: log.documento || log.cedula,
            backend: true // Marcar como dato del backend
          }
        }));

        return { success: true, data: actividades };
      } else {
        console.log('⚠️ Endpoint de logs no disponible, intentando endpoint alternativo...');
        
        // Intentar endpoint alternativo de actividad
        const altResponse = await fetch(`${this.baseUrl}/api/seguridad/actividad/reciente/?limit=${limite}`, {
          headers: this.getAuthHeaders(),
        });

        if (altResponse.ok) {
          const altData = await altResponse.json();
          const actividades = Array.isArray(altData) ? altData : altData.data || [];
          console.log('✅ Actividad alternativa obtenida:', actividades.length);
          return { success: true, data: actividades };
        } else {
          console.log('⚠️ Endpoints de actividad no disponibles');
          return { success: true, data: [] };
        }
      }
    } catch (error) {
      console.error('❌ Error obteniendo actividad reciente:', error);
      return { success: false, message: 'Error obteniendo actividad reciente', data: [] };
    }
  }

  /**
   * Determinar tipo de actividad basado en los datos del backend
   */
  private static determinarTipoActividad(log: any): string {
    if (log.autorizado === true || log.acceso_autorizado === true) {
      return 'acceso_autorizado';
    } else if (log.autorizado === false || log.acceso_autorizado === false) {
      return 'acceso_denegado';
    } else if (log.tipo_acceso === 'qr' || log.metodo_acceso === 'qr') {
      return log.autorizado !== false ? 'qr_valido' : 'qr_invalido';
    } else if (log.tipo === 'incidente' || log.es_incidente) {
      return 'acceso_denegado';
    } else {
      return 'acceso_autorizado'; // Por defecto
    }
  }

  /**
   * Generar descripción de actividad basada en los datos del backend
   */
  private static generarDescripcionActividad(log: any): string {
    const metodo = log.metodo_acceso || log.metodo || 'reconocimiento facial';
    const confianza = log.confianza || log.confidence;
    const ubicacion = log.ubicacion || log.unidad || '';
    
    if (log.autorizado === true || log.acceso_autorizado === true) {
      let desc = `Acceso autorizado por ${metodo}`;
      if (confianza) desc += ` - Confianza: ${confianza.toFixed(1)}%`;
      if (ubicacion) desc += ` en ${ubicacion}`;
      return desc;
    } else if (log.autorizado === false || log.acceso_autorizado === false) {
      let desc = `Acceso denegado por ${metodo}`;
      if (log.razon || log.motivo) desc += ` - ${log.razon || log.motivo}`;
      if (ubicacion) desc += ` en ${ubicacion}`;
      return desc;
    } else {
      return log.descripcion || log.mensaje || `Actividad de ${metodo}`;
    }
  }

  /**
   * Determinar estado de actividad basado en los datos del backend
   */
  private static determinarEstadoActividad(log: any): string {
    if (log.autorizado === true || log.acceso_autorizado === true) {
      return 'exitoso';
    } else if (log.autorizado === false || log.acceso_autorizado === false) {
      return 'fallido';
    } else if (log.estado === 'pendiente' || log.estado === 'procesando') {
      return 'pendiente';
    } else {
      return 'exitoso'; // Por defecto
    }
  }

  /**
   * Probar conectividad con todos los endpoints
   */
  static async testearConectividad(): Promise<{ [endpoint: string]: boolean }> {
    const endpoints = [
      '/api/authz/seguridad/dashboard/',
      '/api/authz/seguridad/visitas/activas/',
      '/api/authz/seguridad/incidentes/',
      '/api/authz/seguridad/alertas/activas/',
      '/api/seguridad/usuarios-reconocimiento/',
      '/api/authz/seguridad/acceso/logs/',
      '/api/seguridad/actividad/reciente/'
    ];

    const resultados: { [endpoint: string]: boolean } = {};

    for (const endpoint of endpoints) {
      try {
        const response = await fetch(`${this.baseUrl}${endpoint}`, {
          headers: this.getAuthHeaders(),
        });
        resultados[endpoint] = response.ok;
        console.log(`${response.ok ? '✅' : '❌'} ${endpoint}: ${response.status}`);
      } catch (error) {
        resultados[endpoint] = false;
        console.log(`❌ ${endpoint}: Error de conexión`);
      }
    }

    return resultados;
  }
}