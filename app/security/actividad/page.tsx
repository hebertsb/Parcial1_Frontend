"use client"

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Activity, Calendar, User, MapPin, Clock, Search, Download, RefreshCw } from 'lucide-react'
import { useState, useEffect } from 'react'
import { Alert, AlertDescription } from '@/components/ui/alert'

// Interfaces para los datos del backend
interface ActividadBackend {
  id: number | string;
  tipo: string;
  usuario: string;
  usuario_nombre?: string;
  nombre_completo?: string;
  accion: string;
  descripcion?: string;
  ubicacion: string;
  unidad?: string;
  apartamento?: string;
  timestamp: string;
  fecha_hora?: string;
  estado: string;
  autorizado?: boolean;
  acceso_autorizado?: boolean;
  detalles: string;
  confianza?: number;
  confidence?: number;
  metodo_acceso?: string;
  metodo?: string;
  razon?: string;
  motivo?: string;
}

interface EstadisticasActividad {
  eventos_hoy: number;
  accesos_exitosos: number;
  intentos_fallidos: number;
  usuarios_unicos: number;
}

export default function ActividadPage() {
  // Estados para datos del backend
  const [actividades, setActividades] = useState<ActividadBackend[]>([]);
  const [estadisticas, setEstadisticas] = useState<EstadisticasActividad>({
    eventos_hoy: 0,
    accesos_exitosos: 0,
    intentos_fallidos: 0,
    usuarios_unicos: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filtroUsuario, setFiltroUsuario] = useState('');

  // Cargar datos del backend al montar el componente
  useEffect(() => {
    cargarDatosActividad();
  }, []);

  const cargarDatosActividad = async () => {
    setLoading(true);
    setError(null);
    
    try {
      console.log('📋 Cargando actividad desde el backend...');
      
      // 1. Obtener logs de acceso
      const logsResponse = await fetch('https://parcial1backend-production.up.railway.app/api/authz/seguridad/acceso/logs/?limit=50', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('access_token') || ''}`,
          'Content-Type': 'application/json',
        },
      });

      let actividadesData: ActividadBackend[] = [];

      if (logsResponse.ok) {
        const logsData = await logsResponse.json();
        const logs = Array.isArray(logsData) ? logsData : 
                   (logsData.data && Array.isArray(logsData.data)) ? logsData.data : 
                   logsData.results ? logsData.results : [];
        
        console.log('✅ Logs de acceso obtenidos:', logs.length);
        actividadesData = logs.map(transformarLogAActividad);
      } else {
        console.log('⚠️ Intentando endpoint alternativo de actividad...');
        
        // 2. Intentar endpoint alternativo
        const actResponse = await fetch('https://parcial1backend-production.up.railway.app/api/seguridad/actividad/reciente/?limit=50', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('access_token') || ''}`,
            'Content-Type': 'application/json',
          },
        });

        if (actResponse.ok) {
          const actData = await actResponse.json();
          const actividad = Array.isArray(actData) ? actData : actData.data || [];
          console.log('✅ Actividad alternativa obtenida:', actividad.length);
          actividadesData = actividad.map(transformarLogAActividad);
        }
      }

      // 3. Obtener incidentes para completar la actividad
      try {
        const incidentesResponse = await fetch('http://127.0.0.1:8000/api/authz/seguridad/incidentes/', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('access_token') || ''}`,
            'Content-Type': 'application/json',
          },
        });

        if (incidentesResponse.ok) {
          const incidentesData = await incidentesResponse.json();
          const incidentes = Array.isArray(incidentesData) ? incidentesData : 
                           incidentesData.data || incidentesData.results || [];
          
          console.log('✅ Incidentes obtenidos:', incidentes.length);
          
          // Agregar incidentes como actividades
          const incidentesActividades = incidentes.map((incidente: any) => ({
            id: `incidente_${incidente.id}`,
            tipo: 'incidente',
            usuario: incidente.usuario_reporta || incidente.reportado_por || 'Sistema',
            accion: 'Incidente reportado',
            ubicacion: incidente.ubicacion || incidente.unidad || 'No especificada',
            timestamp: incidente.fecha_hora || incidente.created_at || new Date().toISOString(),
            estado: incidente.estado === 'abierto' ? 'fallido' : 'exitoso',
            detalles: incidente.descripcion || incidente.detalle || 'Incidente de seguridad',
            metodo_acceso: 'sistema'
          }));

          actividadesData = [...actividadesData, ...incidentesActividades];
        }
      } catch (incidentesError) {
        console.log('⚠️ No se pudieron cargar incidentes:', incidentesError);
      }

      // Ordenar por timestamp descendente
      actividadesData.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
      
      setActividades(actividadesData);
      calcularEstadisticas(actividadesData);
      
      console.log('📊 Actividades procesadas:', actividadesData.length);
      
    } catch (error) {
      console.error('❌ Error cargando actividad:', error);
      setError('Error al cargar la actividad del sistema. Intente nuevamente.');
    } finally {
      setLoading(false);
    }
  };

  const transformarLogAActividad = (log: any): ActividadBackend => {
    const usuario = log.usuario_nombre || log.usuario || log.nombre_completo || 'Usuario desconocido';
    const autorizado = log.autorizado || log.acceso_autorizado;
    const metodo = log.metodo_acceso || log.metodo || 'reconocimiento_facial';
    
    return {
      id: log.id || `log_${Date.now()}_${Math.random()}`,
      tipo: determinarTipoLog(log),
      usuario: usuario,
      accion: autorizado ? 'Acceso autorizado' : 'Acceso denegado',
      ubicacion: log.ubicacion || log.unidad || log.apartamento || 'Entrada Principal',
      timestamp: log.fecha_hora || log.timestamp || new Date().toISOString(),
      estado: autorizado ? 'exitoso' : 'fallido',
      detalles: generarDetallesLog(log),
      confianza: log.confianza || log.confidence,
      metodo_acceso: metodo
    };
  };

  const determinarTipoLog = (log: any): string => {
    const metodo = log.metodo_acceso || log.metodo || '';
    const autorizado = log.autorizado || log.acceso_autorizado;
    
    if (metodo.includes('qr') || metodo.includes('QR')) {
      return 'acceso_qr';
    } else if (metodo.includes('facial') || metodo.includes('reconocimiento')) {
      return 'reconocimiento_facial';
    } else if (!autorizado) {
      return 'intento_acceso';
    } else {
      return 'reconocimiento_facial'; // Por defecto
    }
  };

  const generarDetallesLog = (log: any): string => {
    const metodo = log.metodo_acceso || log.metodo || 'reconocimiento facial';
    const confianza = log.confianza || log.confidence;
    const autorizado = log.autorizado || log.acceso_autorizado;
    
    if (autorizado) {
      let detalle = `${metodo} exitoso`;
      if (confianza) detalle += ` - Confianza: ${confianza.toFixed(1)}%`;
      return detalle;
    } else {
      let detalle = `${metodo} fallido`;
      if (log.razon || log.motivo) detalle += ` - ${log.razon || log.motivo}`;
      else detalle += ' - Sin autorización';
      return detalle;
    }
  };

  const calcularEstadisticas = (actividades: ActividadBackend[]) => {
    const hoy = new Date().toDateString();
    const actividadesHoy = actividades.filter(act => 
      new Date(act.timestamp).toDateString() === hoy
    );
    
    const exitosos = actividadesHoy.filter(act => act.estado === 'exitoso').length;
    const fallidos = actividadesHoy.filter(act => act.estado === 'fallido').length;
    const usuariosUnicos = new Set(actividadesHoy.map(act => act.usuario)).size;
    
    setEstadisticas({
      eventos_hoy: actividadesHoy.length,
      accesos_exitosos: exitosos,
      intentos_fallidos: fallidos,
      usuarios_unicos: usuariosUnicos
    });
  };

  const actividadesFiltradas = actividades.filter(actividad =>
    filtroUsuario === '' || actividad.usuario.toLowerCase().includes(filtroUsuario.toLowerCase())
  );
  const getTipoIcon = (tipo: string) => {
    switch (tipo) {
      case 'reconocimiento_facial': return '🎭'
      case 'acceso_qr': return '📱'
      case 'intento_acceso': return '🚪'
      case 'visita_programada': return '👥'
      default: return '📋'
    }
  }

  const getEstadoColor = (estado: string) => {
    switch (estado) {
      case 'exitoso': return 'bg-green-100 text-green-800 border-green-200'
      case 'fallido': return 'bg-red-100 text-red-800 border-red-200'
      case 'pendiente': return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-white">Registro de Actividad</h1>
          <p className="text-gray-400 mt-2">Historial completo de eventos del sistema de seguridad (Datos reales del backend)</p>
        </div>
        <div className="flex gap-2">
          <Button 
            onClick={cargarDatosActividad}
            disabled={loading}
            className="bg-blue-600 hover:bg-blue-700"
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Actualizar
          </Button>
          <Button className="bg-emerald-600 hover:bg-emerald-700">
            <Download className="h-4 w-4 mr-2" />
            Exportar
          </Button>
        </div>
      </div>

      {/* Error Alert */}
      {error && (
        <Alert className="bg-red-900 border-red-800 text-red-100">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Estadísticas de actividad */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-300">Eventos Hoy</CardTitle>
            <Activity className="h-4 w-4 text-gray-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">
              {loading ? <div className="animate-pulse bg-gray-600 h-8 w-12 rounded"></div> : estadisticas.eventos_hoy}
            </div>
            <p className="text-xs text-gray-400">
              {estadisticas.eventos_hoy > 0 ? 'Datos del backend' : 'Sin eventos hoy'}
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gray-800 border-gray-700">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-300">Accesos Exitosos</CardTitle>
            <Activity className="h-4 w-4 text-green-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">
              {loading ? <div className="animate-pulse bg-gray-600 h-8 w-12 rounded"></div> : estadisticas.accesos_exitosos}
            </div>
            <p className="text-xs text-gray-400">
              {estadisticas.eventos_hoy > 0 ? 
                `${Math.round((estadisticas.accesos_exitosos / estadisticas.eventos_hoy) * 100)}% tasa de éxito` : 
                'Sin datos hoy'
              }
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gray-800 border-gray-700">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-300">Intentos Fallidos</CardTitle>
            <Activity className="h-4 w-4 text-red-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">
              {loading ? <div className="animate-pulse bg-gray-600 h-8 w-12 rounded"></div> : estadisticas.intentos_fallidos}
            </div>
            <p className="text-xs text-gray-400">
              {estadisticas.eventos_hoy > 0 ? 
                `${Math.round((estadisticas.intentos_fallidos / estadisticas.eventos_hoy) * 100)}% del total` : 
                'Sin fallos hoy'
              }
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gray-800 border-gray-700">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-300">Usuarios Únicos</CardTitle>
            <User className="h-4 w-4 text-blue-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">
              {loading ? <div className="animate-pulse bg-gray-600 h-8 w-12 rounded"></div> : estadisticas.usuarios_unicos}
            </div>
            <p className="text-xs text-gray-400">
              {estadisticas.usuarios_unicos > 0 ? 'Personas diferentes hoy' : 'Sin actividad hoy'}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Filtros */}
      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white">Filtros de Búsqueda</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input 
                placeholder="Buscar usuario..." 
                value={filtroUsuario}
                onChange={(e) => setFiltroUsuario(e.target.value)}
                className="pl-10 bg-gray-700 border-gray-600 text-white placeholder-gray-400"
              />
            </div>
            <Button variant="outline" className="border-gray-600 text-gray-300 hover:bg-gray-700">
              <Calendar className="h-4 w-4 mr-2" />
              Fecha
            </Button>
            <Button variant="outline" className="border-gray-600 text-gray-300 hover:bg-gray-700">
              Tipo de Evento
            </Button>
            <Button variant="outline" className="border-gray-600 text-gray-300 hover:bg-gray-700">
              Estado
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Timeline de actividades */}
      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white">Actividad Reciente</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-gray-600 rounded-full"></div>
                    <div className="flex-1">
                      <div className="h-4 bg-gray-600 rounded w-3/4 mb-2"></div>
                      <div className="h-3 bg-gray-700 rounded w-1/2 mb-2"></div>
                      <div className="h-3 bg-gray-700 rounded w-1/4"></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : actividadesFiltradas.length === 0 ? (
            <div className="text-center py-8">
              <Activity className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-400">
                {filtroUsuario ? 'No se encontraron actividades para el filtro aplicado' : 'No hay actividad registrada'}
              </p>
              <p className="text-sm text-gray-500 mt-2">
                {filtroUsuario ? 'Intente con otro término de búsqueda' : 'Las actividades del sistema aparecerán aquí'}
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {actividadesFiltradas.slice(0, 20).map((evento, index) => (
                <div key={evento.id} className="relative">
                  {/* Línea del timeline */}
                  {index < Math.min(actividadesFiltradas.length - 1, 19) && (
                    <div className="absolute left-6 top-12 w-0.5 h-16 bg-gray-600"></div>
                  )}
                  
                  <div className="flex items-start space-x-4">
                    {/* Icono del evento */}
                    <div className="flex-shrink-0 w-12 h-12 bg-gray-700 rounded-full flex items-center justify-center text-lg">
                      {getTipoIcon(evento.tipo)}
                    </div>
                    
                    <div className="flex-1 border border-gray-600 rounded-lg p-4">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h3 className="font-semibold text-white">{evento.accion}</h3>
                          <p className="text-sm text-gray-300">{evento.usuario}</p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Badge className={getEstadoColor(evento.estado)}>
                            {evento.estado}
                          </Badge>
                          {evento.metodo_acceso && (
                            <Badge variant="outline" className="text-xs border-gray-500 text-gray-300">
                              {evento.metodo_acceso}
                            </Badge>
                          )}
                        </div>
                      </div>
                      
                      <p className="text-sm text-gray-400 mb-3">{evento.detalles}</p>
                      
                      <div className="flex items-center space-x-4 text-xs text-gray-500">
                        <div className="flex items-center space-x-1">
                          <Clock className="h-3 w-3" />
                          <span>{new Date(evento.timestamp).toLocaleString('es-ES')}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <MapPin className="h-3 w-3" />
                          <span>{evento.ubicacion}</span>
                        </div>
                        {evento.confianza && (
                          <div className="flex items-center space-x-1">
                            <span className="text-blue-400">Confianza: {evento.confianza.toFixed(1)}%</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              
              {actividadesFiltradas.length > 20 && (
                <div className="text-center mt-6">
                  <p className="text-sm text-gray-400 mb-4">
                    Mostrando 20 de {actividadesFiltradas.length} actividades
                  </p>
                </div>
              )}
            </div>
          )}
          
          {/* Información adicional */}
          <div className="text-center mt-6 p-4 bg-gray-700 rounded-lg">
            <p className="text-sm text-gray-300 mb-2">
              📡 <strong>Conectado al Backend:</strong> Los datos mostrados provienen directamente del sistema de control de acceso
            </p>
            <div className="flex justify-center space-x-6 text-xs text-gray-400">
              <span>🔗 API: /api/authz/seguridad/acceso/logs/</span>
              <span>📊 Total registros: {actividades.length}</span>
              <span>🕒 Última actualización: {new Date().toLocaleTimeString('es-ES')}</span>
            </div>
            {filtroUsuario && (
              <div className="mt-2">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => setFiltroUsuario('')}
                  className="border-gray-600 text-gray-300 hover:bg-gray-600"
                >
                  Limpiar filtro
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}