'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Shield, Activity, CheckCircle } from 'lucide-react';

export default function SimpleDashboard() {
  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-6 rounded-lg">
        <div className="flex items-center space-x-3">
          <Shield className="h-8 w-8" />
          <div>
            <h1 className="text-3xl font-bold">Dashboard de Seguridad</h1>
            <p className="text-blue-100">Sistema funcionando correctamente</p>
          </div>
        </div>
      </div>

      {/* Estadísticas básicas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Sistema</p>
                <p className="text-2xl font-bold text-gray-900">Activo</p>
              </div>
              <Activity className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Estado</p>
                <p className="text-2xl font-bold text-gray-900">OK</p>
              </div>
              <CheckCircle className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Prueba</p>
                <p className="text-2xl font-bold text-gray-900">123</p>
              </div>
              <Shield className="h-8 w-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Test</p>
                <p className="text-2xl font-bold text-gray-900">456</p>
              </div>
              <Activity className="h-8 w-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Mensaje de estado */}
      <Card>
        <CardHeader>
          <CardTitle>Estado del Sistema</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-5 w-5 text-green-600" />
              <div>
                <p className="font-medium text-green-800">✅ Sistema funcionando correctamente</p>
                <p className="text-sm text-green-600 mt-1">
                  El dashboard se está cargando sin problemas. 
                  Timestamp: {new Date().toLocaleString()}
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Enlaces de navegación */}
      <Card>
        <CardHeader>
          <CardTitle>Navegación Rápida</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button
              onClick={() => window.location.href = '/security/reconocimiento-facial'}
              className="bg-blue-500 text-white px-4 py-3 rounded-lg hover:bg-blue-600 transition-colors"
            >
              📷 Reconocimiento Facial
            </button>
            <button
              onClick={() => window.location.href = '/security/diagnostico'}
              className="bg-green-500 text-white px-4 py-3 rounded-lg hover:bg-green-600 transition-colors"
            >
              🔧 Diagnóstico
            </button>
            <button
              onClick={() => window.location.href = '/security'}
              className="bg-purple-500 text-white px-4 py-3 rounded-lg hover:bg-purple-600 transition-colors"
            >
              🏠 Inicio Security
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}