'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Shield, 
  Users, 
  Camera, 
  Eye, 
  AlertTriangle, 
  CheckCircle, 
  Activity,
  FileText,
  Clock,
  UserCheck,
  UserX,
  QrCode,
  Zap
} from 'lucide-react';
import { useActivity } from '@/contexts/ActivityContext';
import { DashboardService } from '../../services/dashboard-service';

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

export default function SecurityDashboard() {
  const { activities, getRecentActivities } = useActivity();
  
  const [stats, setStats] = useState<DashboardStats>({
    total_usuarios_reconocimiento: 0,
    usuarios_con_fotos: 0,
    total_fotos: 0,
    accesos_hoy: 0,
    incidentes_abiertos: 0,
    visitas_activas: 0,
    porcentaje_enrolamiento: 0,
    estado_sistema: 'activo'
  });

  const [loading, setLoading] = useState(true);

  // Cargar datos reales del backend al montar el componente
  useEffect(() => {
    cargarDatosReales();
  }, []);

  // Actualizar estadísticas basadas en actividades en tiempo real
  useEffect(() => {
    const today = new Date().toDateString();
    const accessesToday = activities.filter(activity => {
      const activityDate = new Date(activity.timestamp).toDateString();
      return activityDate === today && (
        activity.tipo === 'acceso_autorizado' || 
        activity.tipo === 'acceso_denegado'
      );
    }).length;

    // Solo actualizar accesos_hoy desde actividades, mantener el resto desde backend
    setStats(prevStats => ({
      ...prevStats,
      accesos_hoy: accessesToday,
      estado_sistema: 'activo'
    }));
  }, [activities]);

  /**
   * Cargar datos reales desde el backend
   */
  const cargarDatosReales = async () => {
    setLoading(true);
    console.log('📊 Cargando estadísticas reales del dashboard...');

    try {
      const response = await DashboardService.obtenerEstadisticasDashboard();
      
      if (response.success && response.data) {
        setStats(prevStats => ({
          ...response.data,
          accesos_hoy: prevStats.accesos_hoy, // Mantener accesos del día desde actividades
        }));
        console.log('✅ Estadísticas cargadas:', response.data);
      } else {
        console.error('❌ Error cargando estadísticas:', response.message);
        setStats(prevStats => ({
          ...prevStats,
          estado_sistema: 'error'
        }));
      }
    } catch (error) {
      console.error('❌ Error cargando datos del dashboard:', error);
      setStats(prevStats => ({
        ...prevStats,
        estado_sistema: 'error'
      }));
    } finally {
      setLoading(false);
    }
  };

  /**
   * Probar conectividad con todos los endpoints del backend
   */
  const testearConectividad = async () => {
    setLoading(true);
    console.log('🔧 Probando conectividad con endpoints del backend...');
    
    try {
      const resultados = await DashboardService.testearConectividad();
      console.log('📊 Resultados de conectividad:', resultados);
      
      const endpointsActivos = Object.values(resultados).filter(Boolean).length;
      const totalEndpoints = Object.keys(resultados).length;
      
      console.log(`✅ ${endpointsActivos}/${totalEndpoints} endpoints funcionando`);
      
      // Mostrar resultado al usuario
      if (endpointsActivos === totalEndpoints) {
        setStats(prevStats => ({ ...prevStats, estado_sistema: 'activo' }));
      } else if (endpointsActivos > 0) {
        setStats(prevStats => ({ ...prevStats, estado_sistema: 'mantenimiento' }));
      } else {
        setStats(prevStats => ({ ...prevStats, estado_sistema: 'error' }));
      }
      
    } catch (error) {
      console.error('❌ Error probando conectividad:', error);
      setStats(prevStats => ({ ...prevStats, estado_sistema: 'error' }));
    } finally {
      setLoading(false);
    }
  };

  const getActivityIcon = (tipo: string) => {
    switch (tipo) {
      case 'acceso_autorizado':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'acceso_denegado':
        return <UserX className="h-4 w-4 text-red-500" />;
      case 'qr_valido':
        return <QrCode className="h-4 w-4 text-blue-500" />;
      case 'qr_invalido':
        return <AlertTriangle className="h-4 w-4 text-orange-500" />;
      case 'sistema':
        return <Activity className="h-4 w-4 text-gray-500" />;
      default:
        return <Activity className="h-4 w-4 text-gray-500" />;
    }
  };

  const formatTimeAgo = (timestamp: string): string => {
    const now = new Date();
    const time = new Date(timestamp);
    const diffMs = now.getTime() - time.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Ahora';
    if (diffMins < 60) return `Hace ${diffMins}m`;
    if (diffHours < 24) return `Hace ${diffHours}h`;
    return `Hace ${diffDays}d`;
  };

  const refreshData = () => {
    cargarDatosReales();
  };

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-32 bg-gray-200 rounded"></div>
            ))}
          </div>
          <div className="h-96 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center space-x-2">
            <Shield className="h-8 w-8 text-blue-600" />
            <span>Dashboard de Seguridad</span>
          </h1>
          <p className="text-gray-600 mt-2">
            Centro de control y monitoreo en tiempo real
          </p>
        </div>
        
        <div className="flex items-center space-x-3">
          <Badge className={`border-0 ${
            stats.estado_sistema === 'activo' ? 'bg-green-100 text-green-800' :
            stats.estado_sistema === 'error' ? 'bg-red-100 text-red-800' :
            'bg-yellow-100 text-yellow-800'
          }`}>
            <Activity className="h-3 w-3 mr-1" />
            Sistema {stats.estado_sistema}
          </Badge>
          <Badge variant="outline" className="text-xs">
            <FileText className="h-3 w-3 mr-1" />
            {stats.total_fotos} fotos totales
          </Badge>
          <Button onClick={refreshData} size="sm" disabled={loading}>
            <Activity className="h-4 w-4 mr-2" />
            {loading ? 'Cargando...' : 'Actualizar'}
          </Button>
          <Button 
            onClick={testearConectividad} 
            variant="outline" 
            size="sm"
            disabled={loading}
          >
            <Zap className="h-4 w-4 mr-2" />
            Test Backend
          </Button>
        </div>
      </div>

      {/* Estadísticas principales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="hover:shadow-md transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 flex items-center gap-1">
                  Usuarios Registrados
                  <Badge variant="outline" className="text-xs bg-blue-50 text-blue-700">
                    Backend
                  </Badge>
                </p>
                <p className="text-2xl font-bold text-gray-900">{stats.total_usuarios_reconocimiento}</p>
                <p className="text-xs text-green-600 mt-1">
                  {stats.usuarios_con_fotos} con fotos activas ({stats.porcentaje_enrolamiento.toFixed(1)}%)
                </p>
              </div>
              <UserCheck className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 flex items-center gap-1">
                  Accesos Hoy
                  <Badge variant="outline" className="text-xs bg-green-50 text-green-700">
                    Tiempo Real
                  </Badge>
                </p>
                <p className="text-2xl font-bold text-gray-900">{stats.accesos_hoy}</p>
                <p className="text-xs text-blue-600 mt-1">
                  Desde reconocimiento facial
                </p>
              </div>
              <Eye className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 flex items-center gap-1">
                  Incidentes
                  <Badge variant="outline" className="text-xs bg-red-50 text-red-700">
                    Backend
                  </Badge>
                </p>
                <p className="text-2xl font-bold text-gray-900">{stats.incidentes_abiertos}</p>
                <p className="text-xs text-red-600 mt-1">
                  {stats.incidentes_abiertos === 0 ? 'Sin incidentes activos' : 'Incidentes abiertos'}
                </p>
              </div>
              <AlertTriangle className="h-8 w-8 text-red-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 flex items-center gap-1">
                  Visitas Activas
                  <Badge variant="outline" className="text-xs bg-orange-50 text-orange-700">
                    Backend
                  </Badge>
                </p>
                <p className="text-2xl font-bold text-gray-900">{stats.visitas_activas}</p>
                <p className="text-xs text-blue-600 mt-1">
                  {stats.visitas_activas === 0 ? 'Sin visitas activas' : 'En la propiedad'}
                </p>
              </div>
              <Users className="h-8 w-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Actividades Recientes */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Activity className="h-5 w-5" />
            <span>Actividades Recientes</span>
            <Badge variant="outline" className="ml-2">
              {activities.length} total
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {activities && activities.length > 0 ? (
            <div className="space-y-4">
              {getRecentActivities(10).map((activity) => (
                <div key={activity.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                  <div className="flex items-center space-x-3">
                    {getActivityIcon(activity.tipo)}
                    <div>
                      <p className="font-medium text-gray-900">{activity.usuario}</p>
                      <p className="text-sm text-gray-600">{activity.descripcion}</p>
                      {activity.detalles && (
                        <div className="flex items-center space-x-2 mt-1">
                          {activity.detalles.confianza && (
                            <Badge variant="outline" className="text-xs">
                              {activity.detalles.confianza.toFixed(1)}%
                            </Badge>
                          )}
                          {activity.detalles.metodo && (
                            <Badge variant="outline" className="text-xs">
                              {activity.detalles.metodo}
                            </Badge>
                          )}
                          {activity.detalles.unidad && (
                            <Badge variant="outline" className="text-xs">
                              {activity.detalles.unidad}
                            </Badge>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="text-sm text-gray-500">
                    {formatTimeAgo(activity.timestamp)}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <Activity className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No hay actividades registradas</h3>
              <p className="text-gray-600 mb-4">
                Las actividades de reconocimiento facial aparecerán aquí en tiempo real
              </p>
              <Button variant="outline" onClick={() => window.location.href = '/security/reconocimiento-facial'}>
                <Camera className="h-4 w-4 mr-2" />
                Ir a Reconocimiento Facial
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Información sobre fuentes de datos */}
      <Card className="bg-blue-50 border-blue-200">
        <CardContent className="p-4">
          <div className="flex items-start space-x-3">
            <FileText className="h-5 w-5 text-blue-600 mt-1" />
            <div className="flex-1">
              <h4 className="font-medium text-blue-900 mb-2">Fuentes de Datos Activas</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="font-medium text-blue-800">Desde Backend:</p>
                  <ul className="text-blue-700 mt-1 space-y-1">
                    <li>• Usuarios registrados: API /usuarios-reconocimiento/</li>
                    <li>• Incidentes: API /incidentes/</li>
                    <li>• Visitas activas: API /visitas/activas/</li>
                    <li>• Fotos y enrolamiento: Calculado desde usuarios</li>
                  </ul>
                </div>
                <div>
                  <p className="font-medium text-blue-800">En Tiempo Real:</p>
                  <ul className="text-blue-700 mt-1 space-y-1">
                    <li>• Accesos del día: Desde reconocimiento facial</li>
                    <li>• Actividades recientes: Context global</li>
                    <li>• Estado del sistema: Conectividad endpoints</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Panel de acceso rápido */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="text-center space-y-3">
              <Camera className="h-12 w-12 text-blue-500 mx-auto" />
              <h3 className="font-semibold text-gray-900">Reconocimiento Facial</h3>
              <p className="text-sm text-gray-600">Sistema de verificación con IA</p>
              <Button 
                className="w-full" 
                onClick={() => window.location.href = '/security/reconocimiento-facial'}
              >
                <Zap className="h-4 w-4 mr-2" />
                Acceder
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="text-center space-y-3">
              <Users className="h-12 w-12 text-green-500 mx-auto" />
              <h3 className="font-semibold text-gray-900">Gestión de Usuarios</h3>
              <p className="text-sm text-gray-600">Administrar residentes</p>
              <Button 
                variant="outline" 
                className="w-full"
                onClick={() => window.location.href = '/security/usuarios'}
              >
                <UserCheck className="h-4 w-4 mr-2" />
                Ver Usuarios
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="text-center space-y-3">
              <FileText className="h-12 w-12 text-orange-500 mx-auto" />
              <h3 className="font-semibold text-gray-900">Reportes</h3>
              <p className="text-sm text-gray-600">Historial y estadísticas</p>
              <Button 
                variant="outline" 
                className="w-full"
                onClick={() => window.location.href = '/security/actividad'}
              >
                <Clock className="h-4 w-4 mr-2" />
                Ver Reportes
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}