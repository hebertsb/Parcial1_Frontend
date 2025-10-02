'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Shield, Activity, CheckCircle, AlertTriangle } from 'lucide-react';
import { useActivity } from '@/contexts/ActivityContext';

export default function DebugSecurityDashboard() {
  const { activities, addActivity } = useActivity();

  const testAddActivity = () => {
    addActivity({
      tipo: 'acceso_autorizado',
      usuario: 'Usuario de Prueba',
      descripcion: 'Test de acceso desde debug dashboard',
      estado: 'exitoso',
      detalles: {
        confianza: 85.5,
        metodo: 'facial',
        unidad: 'Unidad 101',
        documento: '12345678',
        tipo_residente: 'Propietario'
      }
    });
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header de Debug */}
      <div className="bg-yellow-100 border border-yellow-400 rounded-lg p-4">
        <h1 className="text-2xl font-bold text-yellow-800 flex items-center space-x-2">
          <Shield className="h-6 w-6" />
          <span>🔧 DEBUG - Dashboard de Seguridad</span>
        </h1>
        <p className="text-yellow-700 mt-1">
          Versión de prueba para diagnosticar problemas
        </p>
      </div>

      {/* Test de Contexto */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Activity className="h-5 w-5" />
            <span>Test de ActivityContext</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Estado del contexto:</p>
              <p className="font-mono text-lg">
                {activities ? '✅ Contexto cargado' : '❌ Contexto no disponible'}
              </p>
              <p className="text-sm text-gray-500">
                Actividades registradas: {activities?.length || 0}
              </p>
            </div>
            <button
              onClick={testAddActivity}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              Añadir Actividad de Prueba
            </button>
          </div>
        </CardContent>
      </Card>

      {/* Lista de Actividades */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <CheckCircle className="h-5 w-5" />
            <span>Actividades Recientes ({activities?.length || 0})</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {activities && activities.length > 0 ? (
            <div className="space-y-3">
              {activities.slice(0, 5).map((activity) => (
                <div key={activity.id} className="border rounded-lg p-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      {activity.tipo === 'acceso_autorizado' ? (
                        <CheckCircle className="h-4 w-4 text-green-500" />
                      ) : (
                        <AlertTriangle className="h-4 w-4 text-red-500" />
                      )}
                      <span className="font-medium">{activity.usuario}</span>
                    </div>
                    <span className="text-xs text-gray-500">
                      {new Date(activity.timestamp).toLocaleTimeString()}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">{activity.descripcion}</p>
                  {activity.detalles && (
                    <div className="text-xs text-gray-500 mt-2">
                      Confianza: {activity.detalles.confianza}% | 
                      Método: {activity.detalles.metodo} | 
                      Unidad: {activity.detalles.unidad}
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <AlertTriangle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">No hay actividades registradas</p>
              <p className="text-sm text-gray-400 mt-1">
                Usa el reconocimiento facial para generar actividades
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Estadísticas básicas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-green-600">
                {activities?.filter(a => a.tipo === 'acceso_autorizado').length || 0}
              </p>
              <p className="text-sm text-gray-600">Accesos Autorizados</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-red-600">
                {activities?.filter(a => a.tipo === 'acceso_denegado').length || 0}
              </p>
              <p className="text-sm text-gray-600">Accesos Denegados</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-blue-600">
                {activities?.length || 0}
              </p>
              <p className="text-sm text-gray-600">Total Actividades</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Instrucciones */}
      <Card>
        <CardHeader>
          <CardTitle>🚀 Instrucciones de Prueba</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 text-sm">
            <p>1. <strong>Verificar contexto:</strong> ¿Se muestra "✅ Contexto cargado"?</p>
            <p>2. <strong>Añadir actividad:</strong> Haz clic en el botón para añadir una actividad de prueba.</p>
            <p>3. <strong>Verificar actualización:</strong> ¿Se actualiza la lista automáticamente?</p>
            <p>4. <strong>Probar reconocimiento:</strong> Ve a <code>/security/reconocimiento-facial</code> y realiza una verificación.</p>
            <p>5. <strong>Comprobar sincronización:</strong> Regresa aquí y verifica si aparece la nueva actividad.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}