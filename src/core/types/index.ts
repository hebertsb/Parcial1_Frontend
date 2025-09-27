/**
 * Core Types and Interfaces
 * Defines all TypeScript types for the application
 */

// =====================
// AUTH & USER TYPES
// =====================

export type UserRole = "administrator" | "security" | "owner" | "tenant" | "propietario" | "inquilino" | "empleado";

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  unitNumber?: string;
  phone?: string;
  avatar?: string;
  telefono?: string;
  direccion?: string;
  ciudad?: string;
  codigo_postal?: string;
  numero_unidad?: string;
  torre?: string;
  area_unidad?: number;
  tipo_unidad?: string;
  // NUEVO: Reconocimiento facial
  fotos_reconocimiento_urls?: string[];
  reconocimiento_facial_activo?: boolean;
  fecha_enrolamiento?: string;
}

export interface DjangoUser {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  phone?: string;
  avatar?: string;
  role: UserRole;
  unit_number?: string;
  profession?: string;
  is_active: boolean;
  date_joined: string;
  created_at?: string;
  updated_at?: string;
}

export interface AuthState {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
}

// =====================
// REQUEST TYPES
// =====================

export interface LoginRequest {
  email: string;
  password: string;
}

export interface CreateUserRequest {
  // Campos obligatorios según nueva guía
  email: string;
  password: string;
  password_confirm: string;
  nombres: string;
  apellidos: string;
  documento_identidad: string;
  
  // Campos opcionales según nueva guía
  telefono?: string;
  fecha_nacimiento?: string;
  genero?: 'masculino' | 'femenino' | 'otro';
  pais?: string;
  tipo_persona?: 'inquilino' | 'propietario' | 'seguridad' | 'administrador';
  direccion?: string;
}

export interface UpdateUserRequest {
  // Campos actualizables según nueva guía
  email?: string;
  nombres?: string;
  apellidos?: string;
  telefono?: string;
  fecha_nacimiento?: string;
  genero?: 'masculino' | 'femenino' | 'otro';
  pais?: string;
  direccion?: string;
  estado?: 'ACTIVO' | 'INACTIVO';
}

// Usuario completo del sistema (según nueva guía)
export interface UsuarioSistema {
  id: number;
  email: string;
  estado: 'ACTIVO' | 'INACTIVO';
  created_at: string;
  updated_at: string;
  
  // Información de persona asociada (estructura completa de la nueva guía)
  persona: {
    id: number;
    nombre: string;
    apellido: string;
    documento_identidad: string;
    telefono?: string;
    email: string;
    fecha_nacimiento?: string;
    genero: 'masculino' | 'femenino' | 'otro';
    pais: string;
    tipo_persona: 'inquilino' | 'propietario' | 'seguridad' | 'administrador';
    direccion?: string;
    edad?: number;
    nombre_completo: string;
    activo: boolean;
    created_at: string;
    updated_at: string;
  };
  
  // Roles del usuario
  roles: Rol[];
  
  // Campos adicionales de la nueva guía
  nombres: string;
  apellidos: string;
  telefono?: string;
  fecha_nacimiento?: string;
  genero: 'masculino' | 'femenino' | 'otro';
  
  // Campos adicionales para UI
  unit_number?: string;
  profession?: string;
}

// Rol del sistema (según nueva guía)
export interface Rol {
  id: number;
  nombre: string;
  descripcion: string;
  activo: boolean;
  created_at: string;
  updated_at: string;
}

// Para filtros y búsquedas
export interface UsuarioFilters {
  search?: string;
  rol?: string;
  estado?: 'activo' | 'inactivo';
  tipo_usuario?: 'propietario' | 'inquilino' | 'admin' | 'seguridad';
  page?: number;
  page_size?: number;
}

// =====================
// UNIDADES TYPES
// =====================

export interface Unidad {
  id: number;
  numero: string;
  tipo: 'apartamento' | 'penthouse' | 'local';
  area: number;
  habitaciones: number;
  banos: number;
  propietario?: DjangoUser;
  inquilino?: DjangoUser;
  estado: 'disponible' | 'ocupado' | 'alquilado' | 'mantenimiento';
  valor_alquiler: number;
  fecha_compra: string;
  imagen?: string;
  created_at: string;
  updated_at: string;
}

export interface CreateUnidadRequest {
  numero: string;
  tipo: 'apartamento' | 'penthouse' | 'local';
  area: number;
  habitaciones: number;
  banos: number;
  propietario_id?: number;
  inquilino_id?: number;
  valor_alquiler: number;
  fecha_compra: string;
}

export interface UnidadEstadisticas {
  total: number;
  disponibles: number;
  ocupadas: number;
  alquiladas: number;
  mantenimiento: number;
  por_tipo: Record<string, number>;
}

// =====================
// FINANZAS TYPES
// =====================

export interface Transaccion {
  id: number;
  concepto: string;
  tipo: 'ingreso' | 'gasto';
  categoria?: string;
  monto: number;
  fecha: string;
  unidad?: Unidad;
  proveedor?: string;
  metodo_pago?: 'efectivo' | 'transferencia' | 'cheque' | 'tarjeta';
  estado: 'pendiente' | 'pagado' | 'cancelado';
  comprobante?: string;
  descripcion?: string;
  created_by: DjangoUser;
  created_at: string;
  updated_at: string;
}

export interface CreateTransaccionRequest {
  concepto: string;
  tipo: 'ingreso' | 'gasto';
  categoria?: string;
  monto: number;
  fecha: string;
  unidad_id?: number;
  proveedor?: string;
  metodo_pago?: 'efectivo' | 'transferencia' | 'cheque' | 'tarjeta';
  descripcion?: string;
}

export interface EstadisticasFinancieras {
  ingresos_mes: number;
  gastos_mes: number;
  balance: number;
  pagos_pendientes: number;
  pagos_pendientes_count: number;
  variacion_ingresos: number;
  variacion_gastos: number;
}

export interface BalanceGeneral {
  total_ingresos: number;
  total_gastos: number;
  balance: number;
  ingresos_por_mes: Record<string, number>;
  gastos_por_mes: Record<string, number>;
  gastos_por_categoria: Record<string, number>;
}

// =====================
// SEGURIDAD TYPES
// =====================

export interface IncidenteSeguridad {
  id: number;
  tipo: 'acceso' | 'incidente' | 'emergencia' | 'mantenimiento';
  titulo: string;
  descripcion: string;
  ubicacion: string;
  nivel_gravedad: 'bajo' | 'medio' | 'alto' | 'critico';
  estado: 'abierto' | 'en_proceso' | 'resuelto' | 'cerrado';
  reportado_por: DjangoUser;
  asignado_a?: DjangoUser;
  fecha_incidente: string;
  fecha_resolucion?: string;
  evidencias?: string[];
  created_at: string;
  updated_at: string;
}

export interface CreateIncidenteRequest {
  tipo: 'acceso' | 'incidente' | 'emergencia' | 'mantenimiento';
  titulo: string;
  descripcion: string;
  ubicacion: string;
  nivel_gravedad: 'bajo' | 'medio' | 'alto' | 'critico';
  fecha_incidente: string;
  asignado_a_id?: number;
}

export interface UpdateIncidenteRequest {
  tipo?: 'acceso' | 'incidente' | 'emergencia' | 'mantenimiento';
  titulo?: string;
  descripcion?: string;
  ubicacion?: string;
  nivel_gravedad?: 'bajo' | 'medio' | 'alto' | 'critico';
  estado?: 'abierto' | 'en_proceso' | 'resuelto' | 'cerrado';
  fecha_incidente?: string;
  fecha_resolucion?: string;
  asignado_a_id?: number;
}

export interface VisitaFilters {
  search?: string;
  unidad?: number;
  fecha_inicio?: string;
  fecha_fin?: string;
  estado?: 'activa' | 'finalizada' | 'autorizada' | 'denegada';
  tipo_visita?: 'social' | 'comercial' | 'servicio' | 'emergencia';
  page?: number;
  page_size?: number;
  ordering?: string;
}

export interface AlertaSeguridad {
  id: number;
  tipo: 'emergencia' | 'intrusion' | 'fuego' | 'medica' | 'otro';
  ubicacion: string;
  descripcion: string;
  nivel_prioridad: 'bajo' | 'medio' | 'alto' | 'critico';
  estado: 'activa' | 'resuelta' | 'falsa_alarma';
  fecha_activacion: string;
  fecha_resolucion?: string;
  usuario_activacion: DjangoUser;
  acciones_tomadas?: string;
}

export interface ConfiguracionSeguridad {
  id: number;
  horario_acceso_inicio: string;
  horario_acceso_fin: string;
  requiere_autorizacion_visitas: boolean;
  tiempo_maximo_visita: number; // en horas
  notificaciones_incidentes: boolean;
  backup_automatico: boolean;
  periodo_retencion_logs: number; // en días
  configuracion_camaras: {
    resolucion: string;
    fps: number;
    almacenamiento_dias: number;
  };
}

export interface VisitaRegistro {
  id: number;
  visitante_nombre: string;
  visitante_documento: string;
  unidad_destino: Unidad;
  tipo_visita: 'personal' | 'trabajo' | 'delivery' | 'servicio';
  hora_entrada: string;
  hora_salida?: string;
  autorizado_por: DjangoUser;
  observaciones?: string;
  foto_visitante?: string;
  created_at: string;
}

export interface CreateVisitaRequest {
  visitante_nombre: string;
  visitante_documento: string;
  unidad_destino_id: number;
  tipo_visita: 'personal' | 'trabajo' | 'delivery' | 'servicio';
  observaciones?: string;
}

export interface EstadisticasSeguridad {
  incidentes_mes: number;
  incidentes_abiertos: number;
  visitas_dia: number;
  visitas_mes: number;
  incidentes_por_tipo: Record<string, number>;
  incidentes_por_gravedad: Record<string, number>;
}

// =====================
// FILTER TYPES
// =====================

export interface PaginationParams {
  page?: number;
  page_size?: number;
}

export interface UsuarioFilters extends PaginationParams {
  search?: string;
  role?: UserRole;
  is_active?: boolean;
  unit_number?: string;
}

export interface UnidadFilters extends PaginationParams {
  search?: string;
  tipo?: string;
  estado?: string;
  propietario?: string;
}

export interface TransaccionFilters extends PaginationParams {
  search?: string;
  tipo?: 'ingreso' | 'gasto';
  categoria?: string;
  estado?: string;
  fecha_desde?: string;
  fecha_hasta?: string;
  unidad?: string;
}

export interface IncidenteFilters extends PaginationParams {
  search?: string;
  tipo?: string;
  estado?: string;
  nivel_gravedad?: string;
  fecha_desde?: string;
  fecha_hasta?: string;
}

// =====================
// RESPONSE TYPES
// =====================

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  errors?: Record<string, string[]>;
  meta?: {
    total?: number;
    page?: number;
    per_page?: number;
    last_page?: number;
  };
}

export interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

// =====================
// DASHBOARD TYPES
// =====================

export interface DashboardStats {
  usuarios_activos: number;
  unidades_ocupadas: number;
  ingresos_mes: number;
  incidentes_abiertos: number;
}

export interface RecentActivity {
  id: string;
  type: 'user' | 'transaction' | 'incident' | 'visit';
  title: string;
  description: string;
  timestamp: string;
  user: string;
  status?: string;
}

// =====================
// NOTIFICATION TYPES
// =====================

export interface Notification {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  action?: {
    label: string;
    url: string;
  };
}

// =====================
// FILE UPLOAD TYPES
// =====================

export interface FileUploadResponse {
  file_url: string;
  file_name: string;
  file_size: number;
  file_type: string;
}

export interface UploadProgress {
  loaded: number;
  total: number;
  percentage: number;
}

// =====================
// FORM TYPES
// =====================

export interface FormField {
  name: string;
  label: string;
  type: 'text' | 'email' | 'password' | 'number' | 'select' | 'textarea' | 'date' | 'file';
  required?: boolean;
  placeholder?: string;
  options?: { value: string; label: string }[];
  validation?: {
    min?: number;
    max?: number;
    pattern?: RegExp;
    custom?: (value: any) => boolean | string;
  };
}

export interface FormSchema {
  fields: FormField[];
  submitLabel?: string;
  resetLabel?: string;
}

// =====================
// UTILITY TYPES
// =====================

export type Optional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;
export type RequiredFields<T, K extends keyof T> = T & Required<Pick<T, K>>;
export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

// =====================
// ADDITIONAL FINANCIAL TYPES
// =====================

export interface UpdateTransaccionRequest {
  concepto?: string;
  tipo?: 'ingreso' | 'gasto';
  categoria?: string;
  monto?: number;
  fecha?: string;
  unidad_id?: number;
  proveedor?: string;
  metodo_pago?: 'efectivo' | 'transferencia' | 'cheque' | 'tarjeta';
  descripcion?: string;
  estado?: 'pendiente' | 'pagado' | 'cancelado';
}

export interface CuotaMantenimiento {
  id: number;
  unidad: Unidad;
  monto: number;
  mes: number;
  año: number;
  fecha_vencimiento: string;
  fecha_pago?: string;
  estado: 'pendiente' | 'pagado' | 'vencido';
  descuento?: number;
  motivo_descuento?: string;
  created_at: string;
  updated_at: string;
}

export interface CreateCuotaRequest {
  unidad_id: number;
  monto: number;
  mes: number;
  año: number;
  fecha_vencimiento: string;
  descuento?: number;
  motivo_descuento?: string;
}

export interface UpdateCuotaRequest {
  monto?: number;
  fecha_vencimiento?: string;
  descuento?: number;
  motivo_descuento?: string;
  estado?: 'pendiente' | 'pagado' | 'vencido';
}

export interface CuotaFilters {
  unidad?: number;
  mes?: number;
  año?: number;
  estado?: 'pendiente' | 'pagado' | 'vencido';
  fecha_vencimiento_from?: string;
  fecha_vencimiento_to?: string;
  search?: string;
  page?: number;
  page_size?: number;
  ordering?: string;
}

export interface ReporteFinanciero {
  periodo: string;
  total_ingresos: number;
  total_gastos: number;
  balance: number;
  detalle_ingresos: Array<{
    categoria: string;
    monto: number;
    porcentaje: number;
  }>;
  detalle_gastos: Array<{
    categoria: string;
    monto: number;
    porcentaje: number;
  }>;
  transacciones_destacadas: Transaccion[];
}

export interface BulkDeleteRequest {
  ids: number[];
}

// =====================
// ADDITIONAL UNIDADES TYPES
// =====================

export interface UpdateUnidadRequest {
  numero?: string;
  piso?: number;
  torre?: string;
  area?: number;
  dormitorios?: number;
  baños?: number;
  estado?: 'ocupada' | 'disponible' | 'mantenimiento';
  precio_alquiler?: number;
  descripcion?: string;
  caracteristicas?: string[];
}

export interface Propietario {
  id: number;
  nombres: string;
  apellidos: string;
  documento_identidad: string;
  telefono: string;
  email: string;
  fecha_nacimiento?: string;
  ocupacion?: string;
  estado_civil?: 'soltero' | 'casado' | 'divorciado' | 'viudo';
  foto?: string;
  fecha_registro: string;
  unidades: Unidad[];
  es_activo: boolean;
  created_at: string;
  updated_at: string;
}

export interface CreatePropietarioRequest {
  nombres: string;
  apellidos: string;
  documento_identidad: string;
  telefono: string;
  email: string;
  fecha_nacimiento?: string;
  ocupacion?: string;
  estado_civil?: 'soltero' | 'casado' | 'divorciado' | 'viudo';
}

export interface UpdatePropietarioRequest {
  nombres?: string;
  apellidos?: string;
  documento_identidad?: string;
  telefono?: string;
  email?: string;
  fecha_nacimiento?: string;
  ocupacion?: string;
  estado_civil?: 'soltero' | 'casado' | 'divorciado' | 'viudo';
  es_activo?: boolean;
}

export interface PropietarioFilters {
  search?: string;
  estado_civil?: 'soltero' | 'casado' | 'divorciado' | 'viudo';
  es_activo?: boolean;
  tiene_unidad?: boolean;
  page?: number;
  page_size?: number;
  ordering?: string;
}

export interface HistorialCambio {
  id: number;
  tipo_cambio: string;
  descripcion: string;
  valor_anterior?: string;
  valor_nuevo?: string;
  fecha_cambio: string;
  usuario: DjangoUser;
}

export interface EstadisticasUnidades {
  total_unidades: number;
  unidades_ocupadas: number;
  unidades_disponibles: number;
  unidades_mantenimiento: number;
  porcentaje_ocupacion: number;
  ingresos_mensuales_promedio: number;
  solicitudes_mantenimiento_mes: number;
  nuevos_propietarios_mes: number;
}

// =====================
// EXPORT ALL
// =====================

// Note: API client types are defined in ../api/client.ts