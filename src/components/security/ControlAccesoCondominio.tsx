"use client"

import React from 'react';
import PanelReconocimientoFacial from '@/components/security/panel-reconocimiento-facial';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Shield, Lock, Users, AlertTriangle } from 'lucide-react';

export default function ControlAccesoCondominio() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header de Control de Acceso */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="p-3 bg-blue-600 rounded-full">
              <Shield className="h-8 w-8 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-white">
                🏢 Control de Acceso - Condominio
              </h1>
              <p className="text-blue-200 text-lg mt-2">
                Sistema de Verificación Facial WebRTC para Residentes e Invitados
              </p>
            </div>
          </div>
          
          {/* Estado del sistema */}
          <div className="flex items-center justify-center gap-6 text-sm">
            <div className="flex items-center gap-2 bg-green-900/30 px-3 py-1 rounded-full border border-green-500">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-green-200">Sistema Activo</span>
            </div>
            <div className="flex items-center gap-2 bg-blue-900/30 px-3 py-1 rounded-full border border-blue-500">
              <Lock className="h-3 w-3 text-blue-400" />
              <span className="text-blue-200">Acceso Controlado</span>
            </div>
            <div className="flex items-center gap-2 bg-purple-900/30 px-3 py-1 rounded-full border border-purple-500">
              <Users className="h-3 w-3 text-purple-400" />
              <span className="text-purple-200">MultiUsuario</span>
            </div>
          </div>
        </div>

        {/* Alerta de Seguridad */}
        <Alert className="mb-6 border-yellow-600 bg-yellow-900/20">
          <AlertTriangle className="h-4 w-4 text-yellow-500" />
          <AlertDescription className="text-yellow-200">
            <strong>⚠️ CONTROL DE ACCESO ACTIVO:</strong> Este sistema verifica la identidad de personas 
            que intentan acceder al condominio. Solo residentes y visitantes autorizados podrán ingresar. 
            Todos los intentos de acceso quedan registrados para auditoría de seguridad.
          </AlertDescription>
        </Alert>

        {/* Estadísticas de acceso rápidas */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card className="bg-gray-800/50 border-gray-700 backdrop-blur">
            <CardContent className="pt-6">
              <div className="flex items-center">
                <div className="p-2 bg-green-600/20 rounded-full">
                  <Shield className="h-5 w-5 text-green-400" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-300">Accesos Hoy</p>
                  <p className="text-2xl font-bold text-white">24</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-800/50 border-gray-700 backdrop-blur">
            <CardContent className="pt-6">
              <div className="flex items-center">
                <div className="p-2 bg-blue-600/20 rounded-full">
                  <Users className="h-5 w-5 text-blue-400" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-300">Residentes</p>
                  <p className="text-2xl font-bold text-white">156</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-800/50 border-gray-700 backdrop-blur">
            <CardContent className="pt-6">
              <div className="flex items-center">
                <div className="p-2 bg-purple-600/20 rounded-full">
                  <Lock className="h-5 w-5 text-purple-400" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-300">Seg. Activa</p>
                  <p className="text-2xl font-bold text-white">24/7</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-800/50 border-gray-700 backdrop-blur">
            <CardContent className="pt-6">
              <div className="flex items-center">
                <div className="p-2 bg-red-600/20 rounded-full">
                  <AlertTriangle className="h-5 w-5 text-red-400" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-300">Alertas</p>
                  <p className="text-2xl font-bold text-white">0</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Componente WebRTC Principal */}
        <div className="bg-gray-800/50 border border-gray-700 backdrop-blur rounded-lg p-6">
          <div className="mb-4">
            <h2 className="flex items-center gap-2 text-white text-xl font-semibold">
              <Shield className="h-5 w-5" />
              🎯 Sistema WebRTC de Verificación de Acceso
            </h2>
            <p className="text-gray-300 mt-1">
              Colócate frente a la cámara para verificar tu identidad y obtener acceso al condominio
            </p>
          </div>
          <PanelReconocimientoFacial />
        </div>

        {/* Instrucciones de uso */}
        <Card className="mt-6 bg-gray-800/30 border-gray-700 backdrop-blur">
          <CardHeader>
            <CardTitle className="text-white">📋 Instrucciones de Acceso</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-gray-300">
              <div>
                <h4 className="font-semibold text-white mb-2">🚀 Para Residentes:</h4>
                <ol className="space-y-1 text-sm">
                  <li>1. Presiona "Conectar WebRTC"</li>
                  <li>2. Presiona "Iniciar Cámara"</li>
                  <li>3. Presiona "Iniciar Stream"</li>
                  <li>4. Colócate frente a la cámara</li>
                  <li>5. Espera el reconocimiento automático</li>
                </ol>
              </div>
              <div>
                <h4 className="font-semibold text-white mb-2">👥 Para Visitantes:</h4>
                <ol className="space-y-1 text-sm">
                  <li>1. Contacta al residente que visitas</li>
                  <li>2. Espera autorización del residente</li>
                  <li>3. Sigue las instrucciones del personal</li>
                  <li>4. Presenta identificación si es requerida</li>
                  <li>5. Registro temporal para tu visita</li>
                </ol>
              </div>
              <div>
                <h4 className="font-semibold text-white mb-2">⚡ Controles Avanzados:</h4>
                <ul className="space-y-1 text-sm">
                  <li>• "Pausar IA" - Si el análisis demora</li>
                  <li>• "Captura Manual" - Análisis inmediato</li>
                  <li>• "Reiniciar" - Si hay problemas técnicos</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-white mb-2">🔒 Políticas de Seguridad:</h4>
                <ul className="space-y-1 text-sm">
                  <li>• Todos los accesos son registrados</li>
                  <li>• Cámaras de seguridad activas 24/7</li>
                  <li>• Personal de seguridad disponible</li>
                  <li>• Protocolo de emergencia activado</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}