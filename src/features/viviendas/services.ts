import { apiClient } from '@/core/api/client';

export interface Vivienda {
  id: number;
  numero_casa: string;
  bloque: string;
  tipo_vivienda: string;
  metros_cuadrados: string;
  tarifa_base_expensas: string;
  tipo_cobranza: string;
  estado: string;
  // Campos calculados para el frontend
  tiene_propietario?: boolean;
  tiene_inquilino?: boolean;
  estado_ocupacion?: 'disponible' | 'ocupada' | 'alquilada';
  cobranza_real?: number;
  propiedades?: any[];
  inquilinos_activos?: any[];
}

export interface ViviendaConPropiedades {
  id: number;
  numero_casa: string;
  bloque: string;
  tipo_vivienda: string;
  metros_cuadrados: string;
  tarifa_base_expensas: string;
  tipo_cobranza: string;
  estado: string;
  propiedades: Array<{
    id: number;
    propietario_info: {
      nombre: string;
      apellido: string;
      email: string;
    };
  }>;
  inquilinos_activos?: Array<{
    id: number;
    inquilino_info: {
      nombre: string;
      apellido: string;
      email: string;
    };
  }>;
}

export interface CreateViviendaRequest {
  numero_casa: string;
  bloque: string;
  tipo_vivienda: string;
  metros_cuadrados: string;
  tarifa_base_expensas: string;
  tipo_cobranza: string;
  estado?: string;
}

export interface UpdateViviendaRequest {
  numero_casa?: string;
  bloque?: string;
  tipo_vivienda?: string;
  metros_cuadrados?: string;
  tarifa_base_expensas?: string;
  tipo_cobranza?: string;
  estado?: string;
}

// Función para obtener todas las viviendas
export async function getViviendas(): Promise<Vivienda[]> {
  console.log('🔍 getViviendas() - Iniciando llamada a /viviendas/');
  try {
    const response = await apiClient.get<Vivienda[]>('/viviendas/');
    console.log('📡 getViviendas() - Respuesta del servidor:', response);
    console.log('📊 getViviendas() - response.data:', response.data);
    console.log('📊 getViviendas() - Tipo de data:', typeof response.data);
    console.log('📊 getViviendas() - Es array?', Array.isArray(response.data));
    
    // Verificar si la respuesta fue exitosa
    if (response && typeof response === 'object' && 'success' in response && !response.success) {
      console.error('❌ getViviendas() - API devolvió error:', response);
      throw new Error(response.message || 'Error de API');
    }
    
    // Si response.data existe y es un array, devolverlo
    if (response.data && Array.isArray(response.data)) {
      return response.data;
    }
    
    // Si response es un array directamente (algunas APIs devuelven así)
    if (Array.isArray(response)) {
      return response;
    }
    
    // Si llegamos aquí, algo está mal
    console.error('❌ getViviendas() - Respuesta inesperada:', response);
    throw new Error('Respuesta de API no válida');
    
  } catch (error) {
    console.error('❌ getViviendas() - Error:', error);
    throw error;
  }
}

// Función para obtener una vivienda por ID
export async function getViviendaById(id: number): Promise<Vivienda> {
  const response = await apiClient.get<Vivienda>(`/viviendas/${id}/`);
  return response.data;
}

// Función para crear nueva vivienda
export async function createVivienda(data: CreateViviendaRequest): Promise<Vivienda> {
  const response = await apiClient.post<Vivienda>('/viviendas/', data);
  return response.data;
}

// Función para actualizar vivienda
export async function updateVivienda(id: number, data: UpdateViviendaRequest): Promise<Vivienda> {
  const response = await apiClient.patch<Vivienda>(`/viviendas/${id}/`, data);
  return response.data;
}

// Función para eliminar vivienda
export async function deleteVivienda(id: number): Promise<void> {
  try {
    await apiClient.delete(`/viviendas/${id}/`);
  } catch (error: any) {
    // Re-lanzar el error con información adicional si es un error de vivienda con residentes activos
    if (error?.errors?.error) {
      const customError = new Error(error.errors.error);
      (customError as any).errors = error.errors;
      throw customError;
    }
    throw error;
  }
}

// Función para activar/desactivar vivienda
export async function toggleViviendaEstado(id: number): Promise<Vivienda> {
  const response = await apiClient.post<Vivienda>(`/viviendas/${id}/activar/`);
  return response.data;
}

// Función para obtener estadísticas reales de ocupación
export async function getEstadisticasViviendas() {
  try {
    const [viviendasResponse, propiedadesResponse, inquilinosResponse] = await Promise.all([
      apiClient.get('/viviendas/'),
      apiClient.get('/propiedades/').catch(() => ({ data: [] })),
      apiClient.get('/personas/inquilinos/').catch(() => ({ data: [] }))
    ]);

    const viviendas = Array.isArray(viviendasResponse.data) ? viviendasResponse.data : [];
    const propiedades = Array.isArray(propiedadesResponse.data) ? propiedadesResponse.data : [];
    const inquilinos = Array.isArray(inquilinosResponse.data) ? inquilinosResponse.data : [];

    // Mapear viviendas con información de ocupación
    const viviendasConInfo = viviendas.map((vivienda: any) => {
      const propiedad = propiedades.find((p: any) => p.vivienda === vivienda.id);
      const inquilino = inquilinos.find((i: any) => i.vivienda === vivienda.id || i.numero_unidad === vivienda.numero_casa);
      
      let estado_ocupacion: 'disponible' | 'ocupada' | 'alquilada' = 'disponible';
      let cobranza_real = '0.00';
      
      if (inquilino) {
        estado_ocupacion = 'alquilada';
        cobranza_real = inquilino.monto_alquiler || vivienda.tarifa_base_expensas;
      } else if (propiedad) {
        estado_ocupacion = 'ocupada';
        cobranza_real = vivienda.tarifa_base_expensas;
      }

      return {
        ...vivienda,
        estado_ocupacion,
        cobranza_real,
        tiene_propietario: !!propiedad,
        tiene_inquilino: !!inquilino,
        propietario_info: propiedad?.propietario_info || null,
        inquilino_info: inquilino?.inquilino_info || null
      };
    });

    const estadisticas = {
      total: viviendas.length,
      ocupadas: viviendasConInfo.filter((v: any) => v.estado_ocupacion === 'ocupada').length,
      alquiladas: viviendasConInfo.filter((v: any) => v.estado_ocupacion === 'alquilada').length,
      disponibles: viviendasConInfo.filter((v: any) => v.estado_ocupacion === 'disponible').length,
    };

    return { viviendas: viviendasConInfo, estadisticas };
  } catch (error) {
    console.error('Error obteniendo estadísticas:', error);
    // Fallback
    const viviendas = await getViviendas();
    return {
      viviendas: viviendas.map(v => ({
        ...v,
        estado_ocupacion: 'disponible' as const,
        cobranza_real: v.tarifa_base_expensas,
        tiene_propietario: false,
        tiene_inquilino: false
      })),
      estadisticas: {
        total: viviendas.length,
        ocupadas: 0,
        alquiladas: 0,
        disponibles: viviendas.length
      }
    };
  }
}

// ===== Interface para inquilinos =====
export interface Inquilino {
  id: number;
  vivienda_id: number;
  persona_id: number;
  monto_alquiler: number;
  fecha_inicio: string;
  fecha_fin?: string;
  estado: 'activo' | 'inactivo';
  nombre?: string;
  apellido?: string;
  email?: string;
  telefono?: string;
}

// ===== Obtener inquilinos activos =====
export const getInquilinos = async (): Promise<Inquilino[]> => {
  try {
    const response = await apiClient.get('/authz/propietarios/panel/inquilinos/');
    const data: any = response.data;
    return data?.results || data || [];
  } catch (error) {
    console.error('Error obteniendo inquilinos:', error);
    return [];
  }
};

// ===== Función para obtener vivienda específica con toda la información =====
export const getViviendaCompleta = async (id: number) => {
  try {
    const [viviendaResponse, inquilinosResponse, propiedadesResponse] = await Promise.all([
      apiClient.get(`/viviendas/${id}/`),
      apiClient.get('/authz/propietarios/panel/inquilinos/'),
      apiClient.get('/propiedades/')
    ]);

    const vivienda: any = viviendaResponse.data;
    const inquilinosData: any = inquilinosResponse.data;
    const propiedadesData: any = propiedadesResponse.data;
    
    const inquilinos = inquilinosData?.results || inquilinosData || [];
    const propiedades = propiedadesData?.results || propiedadesData || [];

    // Buscar inquilinos activos para esta vivienda
    const inquilinosActivos = inquilinos.filter((inq: any) => 
      inq.vivienda === vivienda.id
    );

    // Buscar propiedades para esta vivienda
    const propiedadesVivienda = propiedades.filter((prop: any) => 
      prop.vivienda === vivienda.id && prop.tipo_tenencia === 'propietario'
    );

    let estado_ocupacion = 'disponible';
    let cobranza_real = vivienda.tarifa_base_expensas || 0;
    
    if (inquilinosActivos.length > 0) {
      estado_ocupacion = 'alquilada';
      cobranza_real = inquilinosActivos[0].monto_alquiler || vivienda.tarifa_base_expensas || 0;
    } else if (propiedadesVivienda.length > 0) {
      estado_ocupacion = 'ocupada';
      cobranza_real = vivienda.tarifa_base_expensas || 0;
    }

    return {
      ...vivienda,
      estado_ocupacion,
      cobranza_real,
      tiene_propietario: propiedadesVivienda.length > 0,
      tiene_inquilino: inquilinosActivos.length > 0,
      propiedades: propiedadesVivienda,
      inquilinos_activos: inquilinosActivos
    };
  } catch (error) {
    console.error('Error obteniendo vivienda completa:', error);
    throw error;
  }
};
