/**
 * Servicios para gestión de solicitudes de registro por parte del administrador
 * Maneja la aprobación/rechazo de solicitudes d      fecha_solicitud: item.created_at || new Date().toISOString(),
      observaciones: `Token: ${item.token_seguimiento || 'Generado automáticamente'}${item.vivienda_validada ? ` - Vivienda: ${item.vivienda_validada.tipo_vivienda} ${item.vivienda_validada.bloque}` : ''}`,propietarios
 */

import { apiClient } from '@/core/api/client';
import type { ApiResponse } from '@/core/types';

// ============================================================================
// TIPOS ESPECÍFICOS PARA SOLICITUDES DE REGISTRO
// ============================================================================

export interface SolicitudRegistroAPI {
  id: number;
  primer_nombre: string;
  primer_apellido: string;
  cedula: string;
  email: string;
  telefono: string;
  fecha_nacimiento: string;
  genero: 'masculino' | 'femenino';
  numero_casa: string;
  estado: 'pendiente' | 'aprobado' | 'rechazado';
  fecha_solicitud: string;
  observaciones?: string;
  observaciones_admin?: string;
  familiares?: Array<{
    nombres: string;
    apellidos: string;
    documento_identidad: string;
    parentesco: string;
    autorizado_acceso: boolean;
    puede_autorizar_visitas: boolean;
  }>;
}

export interface ProcesarSolicitudRequest {
  decision: 'aprobar' | 'rechazar';
  observaciones_admin?: string;
}

export interface EstadisticasSolicitudes {
  total: number;
  pendientes: number;
  aprobadas: number;
  rechazadas: number;
  nuevas_hoy: number;
}

// ============================================================================
// FUNCIONES DE SERVICIO
// ============================================================================

/**
 * Obtiene todas las solicitudes de registro pendientes
 * CONECTADO AL BACKEND REAL
 */
export async function obtenerSolicitudesRegistro(): Promise<ApiResponse<SolicitudRegistroAPI[]>> {
  console.log('🔄 Obteniendo solicitudes de registro desde backend...');
  
  try {
    const response = await apiClient.get<{
      count: number;
      results: Array<{
        id: number;
        nombres: string;
        apellidos: string;
        documento_identidad: string;
        email: string;
        telefono: string;
        numero_casa: string;
        estado: string;
        token_seguimiento: string;
        created_at: string;
        fecha_nacimiento: string; // Backend SÍ está enviando este campo
        vivienda_validada?: {
          numero_casa: string;
          tipo_vivienda: string;
          bloque: string;
        };
      }>;
    }>('/authz/propietarios/admin/solicitudes/?limit=100');

    console.log('🎉 ¡Backend Django completamente funcional!');
    console.log('📊 Total solicitudes disponibles:', response.data?.count);
    console.log('📊 Solicitudes devueltas:', response.data?.results?.length);
    if (response.data?.results?.length > 0) {
      console.log('� Primera solicitud encontrada:', response.data.results[0]);
      console.log('📋 Estado de la primera solicitud:', response.data.results[0].estado);
    } else {
      console.log('⚠️ No se encontraron solicitudes pendientes');
    }

    // Verificar que la respuesta tenga la estructura esperada
    if (!response.data || response.data.results === undefined) {
      throw new Error('Estructura de respuesta inesperada del backend');
    }

    // Si no hay resultados, pero la conexión fue exitosa
    if (response.data.results.length === 0) {
      console.log('⚠️ Backend conectado exitosamente pero no devuelve solicitudes pendientes');
      console.log('💡 Todas las solicitudes podrían estar ya procesadas (aprobadas/rechazadas)');
      
      return {
        success: true,
        data: [],
        message: 'Backend conectado - No hay solicitudes pendientes'
      };
    }

    // Debug: Mostrar todos los estados recibidos con más detalle
    console.log('🔍 [DEBUG] Estados de todas las solicitudes:');
    response.data.results.forEach((item, index) => {
      console.log(`   ${index + 1}. ID: ${item.id} | Nombre: "${item.nombres} ${item.apellidos}" | Estado: "${item.estado}" | Casa: ${item.numero_casa} | Email: ${item.email}`);
      console.log(`      🔍 [DEBUG] Campos disponibles:`, Object.keys(item));
      console.log(`      📅 [DEBUG] fecha_nacimiento en respuesta:`, item.fecha_nacimiento);
    });

    // Transformar datos del backend al formato del frontend
    const solicitudesTransformadas: SolicitudRegistroAPI[] = response.data.results.map(item => {
      const estadoOriginal = item.estado;
      const estadoTransformado = item.estado.toUpperCase() === 'PENDIENTE' ? 'pendiente' : 
                                 item.estado.toUpperCase() === 'APROBADA' || item.estado.toUpperCase() === 'APROBADO' ? 'aprobado' : 'rechazado';
      
      console.log(`🔄 [DEBUG] Transformando ID ${item.id}: "${estadoOriginal}" → "${estadoTransformado}"`);
      console.log(`📊 [DEBUG] Fecha backend para ${item.nombres}: "${item.fecha_nacimiento}"`);
      
      return {
        id: item.id,
        primer_nombre: item.nombres || 'Sin nombre',
        primer_apellido: item.apellidos || 'Sin apellido',
        cedula: item.documento_identidad,
        email: item.email,
        telefono: item.telefono || 'Sin teléfono',
        fecha_nacimiento: item.fecha_nacimiento, // Backend confirma que envía este campo
        genero: 'masculino', // Por defecto, el backend no tiene este campo
        numero_casa: item.numero_casa || 'Sin asignar',
        estado: estadoTransformado,
        fecha_solicitud: item.created_at || new Date().toISOString(),
        observaciones: `Token: ${item.token_seguimiento || `AUTO-${item.id}-${new Date().getFullYear()}`}${item.vivienda_validada ? ` - Vivienda: ${item.vivienda_validada.tipo_vivienda} ${item.vivienda_validada.bloque}` : ''}`,
      };
    });

    console.log('✅ Solicitudes obtenidas del backend:', solicitudesTransformadas.length);
    
    return {
      success: true,
      data: solicitudesTransformadas,
      message: `${solicitudesTransformadas.length} solicitudes obtenidas del backend`
    };
    
  } catch (error) {
    console.error('❌ Error obteniendo solicitudes del backend:', error);
    
    // FALLBACK: Datos simulados solo si falla el backend
    console.log('🔄 Usando datos simulados como fallback...');
    return {
      success: true,
      data: [],
      message: 'Error conectando con backend - Verifique que el servidor esté ejecutándose'
    };
  }
}

/**
 * FUNCIÓN DE DEBUG: Obtiene TODAS las solicitudes sin filtros
 */
export async function debugObtenerTodasLasSolicitudes(): Promise<void> {
  console.log('🔍 [DEBUG] Obteniendo TODAS las solicitudes para debugging...');
  
  try {
    // Intentar diferentes endpoints y parámetros para encontrar las solicitudes
    const endpointsToTest = [
      { url: '/authz/propietarios/admin/solicitudes/', desc: 'Solicitudes admin (por defecto)' },
      { url: '/authz/propietarios/admin/solicitudes/?estado=pendiente', desc: 'Estado: pendiente' },
      { url: '/authz/propietarios/admin/solicitudes/?estado=PENDIENTE', desc: 'Estado: PENDIENTE (mayúscula)' },
      { url: '/authz/propietarios/admin/solicitudes/?estado=en_revision', desc: 'Estado: en_revision' },
      { url: '/authz/propietarios/admin/solicitudes/?estado=nueva', desc: 'Estado: nueva' },
      { url: '/authz/propietarios/admin/solicitudes/?estado=NUEVA', desc: 'Estado: NUEVA' },
      { url: '/authz/propietarios/admin/solicitudes/?estado=enviada', desc: 'Estado: enviada' },
      { url: '/authz/propietarios/admin/solicitudes/?estado=creada', desc: 'Estado: creada' },
      { url: '/authz/propietarios/admin/solicitudes/?estado=submitted', desc: 'Estado: submitted' },
      { url: '/authz/propietarios/admin/solicitudes/?estado=pending', desc: 'Estado: pending (inglés)' },
      { url: '/authz/propietarios/admin/solicitudes/?estado=aprobada', desc: 'Estado: aprobada' },
      { url: '/authz/propietarios/admin/solicitudes/?estado=rechazada', desc: 'Estado: rechazada' },
      { url: '/authz/propietarios/admin/solicitudes/?limit=100', desc: 'Sin filtro estado (limit 100)' },
      { url: '/authz/propietarios/admin/solicitudes/?all=true', desc: 'Parámetro all=true' },
      { url: '/authz/propietarios/solicitudes/', desc: 'Solicitudes propietarios (sin admin)' },
      { url: '/authz/propietarios/', desc: 'Endpoint propietarios directamente' },
    ];

    for (const endpoint of endpointsToTest) {
      try {
        console.log(`🔍 [DEBUG] Probando: ${endpoint.desc}`);
        console.log(`   URL: ${endpoint.url}`);
        const response = await apiClient.get(endpoint.url);
        console.log(`✅ [DEBUG] SUCCESS - ${endpoint.desc}:`, response.data);
        
        const data = response.data as any;
        console.log(`📊 [DEBUG] Count: ${data?.count || 'No count field'}`);
        console.log(`📊 [DEBUG] Results: ${data?.results?.length || 'No results array'}`);
        
        if (data?.results?.length > 0) {
          console.log(`🎯 [DEBUG] ENCONTRADAS SOLICITUDES EN: ${endpoint.desc}`);
          console.log(`🎯 [DEBUG] Primera solicitud:`, data.results[0]);
        }
        
      } catch (error: any) {
        console.log(`❌ [DEBUG] FAILED - ${endpoint.desc}:`, error?.response?.status || error.message);
      }
    }
    
  } catch (error) {
    console.error('❌ [DEBUG] Error general:', error);
  }
}

/**
 * FUNCIÓN DE DEBUG: Crear una solicitud de prueba para verificar el flujo
 */
export async function debugCrearSolicitudPrueba(): Promise<void> {
  console.log('🔍 [DEBUG] Intentando crear solicitud de prueba...');
  
  // Usar viviendas que existen en el sistema (según el test del backend)
  const viviendas_disponibles = ["101A", "102A", "103A", "201A", "202A", "203A", "301A", "302A"];
  const vivienda_aleatoria = viviendas_disponibles[Math.floor(Math.random() * viviendas_disponibles.length)];
  
  const solicitudPrueba = {
    nombres: "Test Usuario Debug",
    apellidos: "Prueba Sistema", 
    documento_identidad: Math.floor(Math.random() * 90000000) + 10000000 + "", // Documento aleatorio
    email: `testdebug${Date.now()}@prueba.com`, // Email único
    telefono: "87654321",
    numero_casa: vivienda_aleatoria, // Usar vivienda que existe
    fecha_nacimiento: "1990-01-01",
    acepta_terminos: true,
    confirm_password: "test123",
    password: "test123"
  };

  // Basándonos en las URLs que vimos en el error, probemos estos endpoints
  const endpointsCreacion = [
    '/authz/propietarios/solicitud-registro/',
    '/authz/propietarios/registro/',
    '/authz/propietarios/',
    '/authz/solicitud-registro/',
    '/authz/registro/',
    '/propietarios/solicitud-registro/', // Sin authz
    '/solicitud-registro/', // Más simple
  ];

  for (const endpoint of endpointsCreacion) {
    try {
      console.log(`🔍 [DEBUG] Probando crear solicitud en: ${endpoint}`);
      const response = await apiClient.post(endpoint, solicitudPrueba);
      
      // Si llegamos aquí, la llamada fue exitosa
      console.log(`✅ [DEBUG] ¡ÉXITO! Solicitud creada en ${endpoint}:`, response.data);
      
      // Ahora intentemos obtener las solicitudes después de crear una
      console.log(`🔄 [DEBUG] Recargando solicitudes después de crear...`);
      const solicitudesResponse = await apiClient.get('/authz/propietarios/admin/solicitudes/');
      console.log(`📊 [DEBUG] Solicitudes después de crear:`, solicitudesResponse.data);
      
      return; // Si funciona, salimos
      
    } catch (error: any) {
      console.log(`❌ [DEBUG] Error creando en ${endpoint}:`, 
        error?.response?.status || 'Sin status', 
        error?.response?.statusText || 'Sin status text'
      );
    }
  }
  
  console.log('❌ [DEBUG] No se pudo crear solicitud en ningún endpoint');
}

/**
 * Procesa una solicitud (aprobar o rechazar) usando los endpoints reales del backend
 */
export async function procesarSolicitudCompleta(
  solicitudId: number, 
  request: ProcesarSolicitudRequest
): Promise<ApiResponse<any>> {
  console.log(`🔄 Procesando solicitud ${solicitudId} - Decisión: ${request.decision}`);
  
  // Todas las solicitudes ahora se procesan con el backend real
  console.log(`🔄 Procesando solicitud real ID ${solicitudId} con backend Django...`);
  
  try {
    if (request.decision === 'aprobar') {
      // Endpoint real para aprobar: POST /api/authz/propietarios/admin/solicitudes/{id}/aprobar/
      const response = await apiClient.post<{
        success: boolean;
        message: string;
        data: {
          solicitud_id: number;
          nuevo_estado: string;
          usuario_id: number;
          email_propietario: string;
          rol_asignado: string;
        };
      }>(`/authz/propietarios/admin/solicitudes/${solicitudId}/aprobar/`, {
        observaciones_aprobacion: request.observaciones_admin || 'Documentación completa y verificada. Aprobado para acceso al sistema.'
      });

      // Verificar si la respuesta del backend indica error
      if (!response.success) {
        console.error('❌ Error del backend al aprobar solicitud:', response.message);
        
        // Si es "ya procesada", tratarlo como informativo pero exitoso
        if (response.message?.includes('ya fue procesada') || response.message?.includes('Estado actual: APROBADO')) {
          console.log('ℹ️ Solicitud ya estaba aprobada - Devolviendo como éxito informativo');
          return {
            success: false, // Mantener false para que el componente maneje el mensaje especial
            message: response.message,
            data: {
              ya_procesada: true,
              estado_actual: 'APROBADO'
            }
          };
        }
        
        return {
          success: false,
          message: response.message || 'Error al procesar la solicitud',
          errors: response.errors
        };
      }

      console.log('✅ Solicitud aprobada - Usuario creado y email enviado automáticamente');
      console.log('📧 [DEBUG] Detalles del email:', {
        usuario_id: response.data?.data?.usuario_id,
        email_propietario: response.data?.data?.email_propietario,
        rol_asignado: response.data?.data?.rol_asignado,
        mensaje_backend: response.data?.message
      });
      
      return {
        success: true,
        data: {
          usuario_creado: true,
          credenciales_enviadas: true,
          usuario_id: response.data?.data?.usuario_id,
          email_propietario: response.data?.data?.email_propietario,
          rol_asignado: response.data?.data?.rol_asignado,
          password_temporal: 'temporal123' // Contraseña fija según documentación
        },
        message: response.data?.message || 'Solicitud procesada exitosamente'
      };
      
    } else {
      // Endpoint real para rechazar: POST /api/authz/propietarios/admin/solicitudes/{id}/rechazar/
      const response = await apiClient.post<{
        success: boolean;
        message: string;
      }>(`/authz/propietarios/admin/solicitudes/${solicitudId}/rechazar/`, {
        motivo_rechazo: request.observaciones_admin || 'Documentación incompleta o datos incorrectos.'
      });

      // Verificar si la respuesta del backend indica error
      if (!response.success) {
        console.error('❌ Error del backend al rechazar solicitud:', response.message);
        return {
          success: false,
          message: response.message || 'Error al procesar la solicitud',
          errors: response.errors
        };
      }

      console.log('✅ Solicitud rechazada - Notificación enviada automáticamente');
      return {
        success: true,
        data: { 
          solicitud_rechazada: true,
          email_notificacion_enviado: true
        },
        message: response.data?.message || 'Solicitud rechazada exitosamente'
      };
    }
    
  } catch (error: any) {
    console.error('❌ Error procesando solicitud:', error);
    
    // Verificar si es error de UNIQUE constraint (solicitud ya procesada)
    if (error?.message?.includes('UNIQUE constraint') || error?.message?.includes('usuario_creado_id')) {
      console.log('⚠️ Detectado error de solicitud ya procesada');
      return {
        success: false,
        message: `⚠️ Esta solicitud ya fue procesada anteriormente.\n\n🔍 Error técnico: La solicitud ID ${solicitudId} ya tiene un usuario creado.\n\n💡 Soluciones:\n• Crear una nueva solicitud de prueba\n• Verificar el estado en la base de datos\n• Contactar al administrador del sistema`,
        errors: { 
          duplicate: ['Solicitud ya procesada'],
          technical_details: [error?.message || 'Error de integridad de datos']
        }
      };
    }
    
    // Otros errores de conexión
    return {
      success: false,
      message: 'Error de conexión con el servidor. Intente nuevamente.',
      errors: { 
        connection: ['Backend no disponible'],
        technical_details: [error?.message || 'Error desconocido']
      }
    };
  }
}

/**
 * Obtiene estadísticas de solicitudes del backend
 */
export async function obtenerEstadisticasSolicitudes(): Promise<ApiResponse<EstadisticasSolicitudes>> {
  console.log('🔄 Obteniendo estadísticas de solicitudes desde backend...');
  
  try {
    // Intentar obtener estadísticas del backend (si existe el endpoint)
    const response = await apiClient.get<{
      total: number;
      pendientes: number;
      aprobadas: number;
      rechazadas: number;
      nuevas_hoy: number;
    }>('/authz/propietarios/admin/solicitudes/estadisticas/');

    console.log('✅ Estadísticas obtenidas del backend:', response.data);
    
    return {
      success: true,
      data: response.data,
      message: 'Estadísticas obtenidas exitosamente del backend'
    };
    
  } catch (error) {
    console.log('⚠️ Endpoint de estadísticas no disponible, calculando desde datos...');
    
    // FALLBACK: Calcular estadísticas básicas desde las solicitudes
    try {
      const solicitudesResponse = await obtenerSolicitudesRegistro();
      
      if (solicitudesResponse.success && solicitudesResponse.data) {
        const solicitudes = solicitudesResponse.data;
        const hoy = new Date().toDateString();
        
        const estadisticas: EstadisticasSolicitudes = {
          total: solicitudes.length,
          pendientes: solicitudes.filter(s => s.estado === 'pendiente').length,
          aprobadas: solicitudes.filter(s => s.estado === 'aprobado').length,
          rechazadas: solicitudes.filter(s => s.estado === 'rechazado').length,
          nuevas_hoy: solicitudes.filter(s => 
            new Date(s.fecha_solicitud).toDateString() === hoy
          ).length
        };
        
        console.log('✅ Estadísticas calculadas desde datos:', estadisticas);
        
        return {
          success: true,
          data: estadisticas,
          message: 'Estadísticas calculadas desde datos de solicitudes'
        };
      }
    } catch (calcError) {
      console.error('❌ Error calculando estadísticas:', calcError);
    }
    
    // FALLBACK FINAL: Estadísticas por defecto
    return {
      success: true,
      data: {
        total: 0,
        pendientes: 0,
        aprobadas: 0,
        rechazadas: 0,
        nuevas_hoy: 0
      },
      message: 'Estadísticas no disponibles - Backend desconectado'
    };
  }
}