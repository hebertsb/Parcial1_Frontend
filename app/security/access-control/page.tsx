/**
 * Página de control de acceso
 */

'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Eye, Clock, CheckCircle, XCircle, User, Building } from 'lucide-react';

export default function AccessControlPage() {
  const [accessLogs, setAccessLogs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Datos de ejemplo para logs de acceso
    const mockAccessLogs = [
      {
        id: 1,
        usuario: 'Juan Pérez',
        ubicacion: 'Entrada Principal',
        tipo_acceso: 'entrada',
        fecha_hora: '2024-01-15 08:30:00',
        metodo_acceso: 'tarjeta',
        autorizado: true
      },
      {
        id: 2,
        usuario: 'María García',
        ubicacion: 'Estacionamiento',
        tipo_acceso: 'salida',
        fecha_hora: '2024-01-15 18:15:00',
        metodo_acceso: 'biometrico',
        autorizado: true
      },
      {
        id: 3,
        usuario: 'Pedro López',
        ubicacion: 'Entrada Principal',
        tipo_acceso: 'entrada',
        fecha_hora: '2024-01-15 09:45:00',
        metodo_acceso: 'codigo',
        autorizado: false
      }
    ];

    setTimeout(() => {
      setAccessLogs(mockAccessLogs);
      setIsLoading(false);
    }, 1000);
  }, []);

  const getAccessTypeColor = (tipo: string) => {
    return tipo === 'entrada' ? 'bg-green-500' : 'bg-orange-500';
  };

  const getMethodIcon = (metodo: string) => {
    switch (metodo) {
      case 'tarjeta':
        return '💳';
      case 'biometrico':
        return '👆';
      case 'codigo':
        return '🔢';
      default:
        return '🔑';
    }
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center space-x-2">
            <Eye className="h-8 w-8 text-blue-600" />
            <span>Control de Acceso</span>
          </h1>
          <p className="text-gray-600 mt-2">
            Monitoreo en tiempo real de accesos al edificio
          </p>
        </div>
      </div>

      {/* Estadísticas rápidas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Accesos Hoy</p>
                <p className="text-2xl font-bold text-gray-900">24</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Accesos Denegados</p>
                <p className="text-2xl font-bold text-red-600">3</p>
              </div>
              <XCircle className="h-8 w-8 text-red-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Personas Dentro</p>
                <p className="text-2xl font-bold text-blue-600">12</p>
              </div>
              <Building className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Sistema</p>
                <p className="text-lg font-semibold text-green-600">Activo</p>
              </div>
              <div className="h-3 w-3 bg-green-500 rounded-full animate-pulse"></div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Logs de acceso */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Clock className="h-5 w-5" />
            <span>Registro de Accesos Recientes</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
              <p className="text-gray-600 mt-2">Cargando registros...</p>
            </div>
          ) : (
            <div className="space-y-4">
              {accessLogs.map((log: any) => (
                <div
                  key={log.id}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                >
                  <div className="flex items-center space-x-4">
                    <div className="text-2xl">{getMethodIcon(log.metodo_acceso)}</div>
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="font-medium">{log.usuario}</span>
                        <Badge className={`${getAccessTypeColor(log.tipo_acceso)} text-white`}>
                          {log.tipo_acceso}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600">
                        {log.ubicacion} • {log.fecha_hora}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    {log.autorizado ? (
                      <CheckCircle className="h-5 w-5 text-green-500" />
                    ) : (
                      <XCircle className="h-5 w-5 text-red-500" />
                    )}
                    <span className={`text-sm font-medium ${
                      log.autorizado ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {log.autorizado ? 'Autorizado' : 'Denegado'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}