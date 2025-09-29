/**
 * Dashboard principal de seguridad - Vista moderna
 */

'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
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
  TrendingUp,
  UserCheck,
  Building,
  Zap
} from 'lucide-react';
import Link from 'next/link';

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

interface RecentActivity {
  id: string;
  tipo: 'acceso' | 'incidente' | 'visita' | 'enrolamiento';
  usuario: string;
  descripcion: string;
  timestamp: string;
  estado: 'exitoso' | 'fallido' | 'pendiente';
}

export default function SecurityDashboard() {
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

  const [recentActivity, setRecentActivity] = useState<RecentActivity[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    cargarDashboardData();
  }, []);

  const cargarDashboardData = async () => {
    setLoading(true);
    
    // Simular datos del dashboard
    setTimeout(() => {
      setStats({
        total_usuarios_reconocimiento: 156,
        usuarios_con_fotos: 132,
        total_fotos: 468,
        accesos_hoy: 24,
        incidentes_abiertos: 2,
        visitas_activas: 8,
        porcentaje_enrolamiento: 84.6,
        estado_sistema: 'activo'
      });

      setRecentActivity([
        {
          id: '1',
          tipo: 'acceso',
          usuario: 'Juan Pérez - Apto 301',
          descripcion: 'Acceso autorizado por reconocimiento facial',
          timestamp: '2024-01-15 14:30:00',
          estado: 'exitoso'
        },
        {
          id: '2',
          tipo: 'incidente',
          usuario: 'Sistema de Seguridad',
          descripcion: 'Intento de acceso no autorizado detectado',
          timestamp: '2024-01-15 14:25:00',
          estado: 'pendiente'
        },
        {
          id: '3',
          tipo: 'visita',
          usuario: 'María González',
          descripcion: 'Visita registrada para Apto 205',
          timestamp: '2024-01-15 14:20:00',
          estado: 'exitoso'
        },
        {
          id: '4',
          tipo: 'enrolamiento',
          usuario: 'Carlos Mendoza - Apto 102',
          descripcion: 'Nuevo enrolamiento facial completado',
          timestamp: '2024-01-15 14:15:00',
          estado: 'exitoso'
        }
      ]);

      setLoading(false);
    }, 1000);
  };

  const getActivityIcon = (tipo: string) => {
    switch (tipo) {
      case 'acceso':
        return <Eye className="h-4 w-4" />;
      case 'incidente':
        return <AlertTriangle className="h-4 w-4" />;
      case 'visita':
        return <Users className="h-4 w-4" />;
      case 'enrolamiento':
        return <Camera className="h-4 w-4" />;
      default:
        return <Activity className="h-4 w-4" />;
    }
  };

  const getActivityColor = (estado: string) => {
    switch (estado) {
      case 'exitoso':
        return 'text-green-600 bg-green-50';
      case 'fallido':
        return 'text-red-600 bg-red-50';
      case 'pendiente':
        return 'text-yellow-600 bg-yellow-50';
      default:
        return 'text-gray-600 bg-gray-50';
    }
  };

  const getSystemStatusColor = (status: string) => {
    switch (status) {
      case 'activo':
        return 'text-green-600 bg-green-100';
      case 'mantenimiento':
        return 'text-yellow-600 bg-yellow-100';
      case 'error':
        return 'text-red-600 bg-red-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
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
          <Badge className={`${getSystemStatusColor(stats.estado_sistema)} border-0`}>
            <Activity className="h-3 w-3 mr-1" />
            Sistema {stats.estado_sistema}
          </Badge>
          <Button onClick={cargarDashboardData} size="sm">
            <Activity className="h-4 w-4 mr-2" />
            Actualizar
          </Button>
        </div>
      </div>

      {/* Estadísticas principales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="hover:shadow-md transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Usuarios Registrados</p>
                <p className="text-2xl font-bold text-gray-900">{stats.total_usuarios_reconocimiento}</p>
                <p className="text-xs text-green-600 mt-1">
                  {stats.usuarios_con_fotos} con fotos activas
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
                <p className="text-sm font-medium text-gray-600">Accesos Hoy</p>
                <p className="text-2xl font-bold text-gray-900">{stats.accesos_hoy}</p>
                <p className="text-xs text-blue-600 mt-1">
                  <TrendingUp className="h-3 w-3 inline mr-1" />
                  +12% vs ayer
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
                <p className="text-sm font-medium text-gray-600">Incidentes Abiertos</p>
                <p className="text-2xl font-bold text-red-600">{stats.incidentes_abiertos}</p>
                <p className="text-xs text-gray-600 mt-1">
                  Requieren atención
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
                <p className="text-sm font-medium text-gray-600">Visitas Activas</p>
                <p className="text-2xl font-bold text-gray-900">{stats.visitas_activas}</p>
                <p className="text-xs text-orange-600 mt-1">
                  En el edificio ahora
                </p>
              </div>
              <Building className="h-8 w-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Métricas de enrolamiento */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Camera className="h-5 w-5" />
            <span>Estado del Reconocimiento Facial</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Porcentaje de Enrolamiento</span>
              <span className="text-lg font-bold text-blue-600">{stats.porcentaje_enrolamiento}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-blue-600 h-2 rounded-full transition-all duration-300" 
                style={{ width: `${stats.porcentaje_enrolamiento}%` }}
              ></div>
            </div>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <p className="text-2xl font-bold text-gray-900">{stats.total_fotos}</p>
                <p className="text-xs text-gray-600">Total de Fotos</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-green-600">{stats.usuarios_con_fotos}</p>
                <p className="text-xs text-gray-600">Con Enrolamiento</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-orange-600">{stats.total_usuarios_reconocimiento - stats.usuarios_con_fotos}</p>
                <p className="text-xs text-gray-600">Pendientes</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Accesos rápidos y actividad reciente */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Accesos rápidos */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Zap className="h-5 w-5" />
              <span>Accesos Rápidos</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Link href="/security/monitor">
              <Button variant="outline" className="w-full justify-start">
                <Camera className="h-4 w-4 mr-2" />
                Reconocimiento Facial
              </Button>
            </Link>
            <Link href="/security/access-control">
              <Button variant="outline" className="w-full justify-start">
                <Eye className="h-4 w-4 mr-2" />
                Control de Acceso
              </Button>
            </Link>
            <Link href="/security/incidents">
              <Button variant="outline" className="w-full justify-start">
                <AlertTriangle className="h-4 w-4 mr-2" />
                Gestión de Incidentes
              </Button>
            </Link>
            <Link href="/security/visits">
              <Button variant="outline" className="w-full justify-start">
                <Users className="h-4 w-4 mr-2" />
                Registro de Visitas
              </Button>
            </Link>
            <Link href="/security/reports">
              <Button variant="outline" className="w-full justify-start">
                <FileText className="h-4 w-4 mr-2" />
                Reportes y Análisis
              </Button>
            </Link>
          </CardContent>
        </Card>

        {/* Actividad reciente */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Clock className="h-5 w-5" />
              <span>Actividad Reciente</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivity.map((activity) => (
                <div
                  key={activity.id}
                  className="flex items-start space-x-3 p-3 rounded-lg hover:bg-gray-50"
                >
                  <div className={`p-2 rounded-full ${getActivityColor(activity.estado)}`}>
                    {getActivityIcon(activity.tipo)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {activity.usuario}
                      </p>
                      <Badge variant="outline" className="text-xs">
                        {activity.tipo}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600">{activity.descripcion}</p>
                    <p className="text-xs text-gray-400 mt-1">{activity.timestamp}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}