/**
 * Componente de prueba para verificar la conexión con el backend
 * Siguiendo la guía del backend
 */

'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { 
  TestTube, 
  CheckCircle, 
  XCircle, 
  Loader2, 
  AlertCircle,
  Server,
  Database,
  Shield
} from 'lucide-react';

import { seguridadAdminService } from '@/features/admin/services/seguridad';
import { USUARIOS_PRUEBA } from '@/features/admin/config/endpoints';

interface TestResult {
  name: string;
  status: 'pending' | 'success' | 'error';
  message: string;
  data?: any;
}

export function TestSeguridadBackend() {
  const [testing, setTesting] = useState(false);
  const [results, setResults] = useState<TestResult[]>([]);

  const updateResult = (name: string, status: TestResult['status'], message: string, data?: any) => {
    setResults(prev => {
      const existing = prev.find(r => r.name === name);
      if (existing) {
        existing.status = status;
        existing.message = message;
        existing.data = data;
        return [...prev];
      }
      return [...prev, { name, status, message, data }];
    });
  };

  const runTests = async () => {
    setTesting(true);
    setResults([]);

    // Test 1: Verificar conexión con backend
    updateResult('Conexión Backend', 'pending', 'Verificando conexión...');
    try {
      // Intentar hacer login como administrador (usando endpoint correcto)
      const loginResponse = await fetch('http://127.0.0.1:8000/authz/login/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: USUARIOS_PRUEBA.ADMINISTRADOR.email,
          password: USUARIOS_PRUEBA.ADMINISTRADOR.password
        })
      });

      if (loginResponse.ok) {
        const loginData = await loginResponse.json();
        updateResult('Conexión Backend', 'success', 'Backend Django conectado y funcionando', loginData);
        
        // Guardar token para siguientes pruebas
        if (loginData.access) {
          localStorage.setItem('access_token', loginData.access);
        }
      } else {
        const errorData = await loginResponse.json();
        updateResult('Conexión Backend', 'error', `Error de login: ${errorData.detail || 'Credenciales inválidas'}`);
        return;
      }
    } catch (error: any) {
      updateResult('Conexión Backend', 'error', `Error de conexión: ${error.message}`);
      return;
    }

    // Test 2: Listar usuarios de seguridad existentes
    updateResult('Listar Usuarios Seguridad', 'pending', 'Obteniendo lista de usuarios...');
    try {
      const response = await seguridadAdminService.listarUsuariosSeguridad();
      
      if (response.success && response.data) {
        updateResult(
          'Listar Usuarios Seguridad', 
          'success', 
          `${response.data.count} usuarios encontrados`,
          response.data.usuarios
        );
      } else {
        updateResult('Listar Usuarios Seguridad', 'error', response.message || 'Error desconocido');
      }
    } catch (error: any) {
      updateResult('Listar Usuarios Seguridad', 'error', `Error: ${error.message}`);
    }

    // Test 3: Intentar crear usuario de seguridad (datos de prueba)
    updateResult('Crear Usuario Seguridad', 'pending', 'Creando usuario de prueba...');
    try {
      const testUser = {
        email: `test.seguridad.${Date.now()}@condominio.com`,
        password: 'TestPass123!',
        persona: {
          nombre: 'Usuario',
          apellido: 'Prueba Sistema',
          ci: `${Math.floor(Math.random() * 9000000) + 1000000}`,
          telefono: `7${Math.floor(Math.random() * 9000000) + 1000000}`,
          direccion: 'Dirección de prueba automatizada'
        }
      };

      const response = await seguridadAdminService.crearUsuarioSeguridad(testUser);
      
      if (response.success && response.data) {
        updateResult(
          'Crear Usuario Seguridad', 
          'success', 
          `Usuario creado: ${response.data.usuario.email}`,
          response.data.usuario
        );
      } else {
        updateResult('Crear Usuario Seguridad', 'error', response.message || 'Error desconocido');
      }
    } catch (error: any) {
      updateResult('Crear Usuario Seguridad', 'error', `Error: ${error.message}`);
    }

    setTesting(false);
  };

  const getStatusIcon = (status: TestResult['status']) => {
    switch (status) {
      case 'pending':
        return <Loader2 className="w-4 h-4 animate-spin text-yellow-400" />;
      case 'success':
        return <CheckCircle className="w-4 h-4 text-green-400" />;
      case 'error':
        return <XCircle className="w-4 h-4 text-red-400" />;
    }
  };

  const getStatusColor = (status: TestResult['status']) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/20';
      case 'success':
        return 'bg-green-500/20 text-green-400 border-green-500/20';
      case 'error':
        return 'bg-red-500/20 text-red-400 border-red-500/20';
    }
  };

  return (
    <div className="space-y-6">
      <Card className="bg-[#111111] border-[#1f1f1f]">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 text-white">
            <TestTube className="w-5 h-5 text-blue-400" />
            <span>Pruebas de Integración - Backend Seguridad</span>
          </CardTitle>
          <p className="text-gray-400 text-sm">
            Verifica la conexión con el backend Django y las funcionalidades de usuarios de seguridad
          </p>
        </CardHeader>
        
        <CardContent className="space-y-4">
          {/* Información de configuración */}
          <Alert className="bg-blue-500/10 border-blue-500/20">
            <Server className="w-4 h-4 text-blue-400" />
            <AlertDescription className="text-blue-200">
              <strong>Configuración Backend:</strong><br />
              • URL: http://127.0.0.1:8000<br />
              • Admin: {USUARIOS_PRUEBA.ADMINISTRADOR.email}<br />
              • Usuarios existentes: {USUARIOS_PRUEBA.SEGURIDAD_EXISTENTES.length} cuentas de prueba
            </AlertDescription>
          </Alert>

          {/* Botón para ejecutar pruebas */}
          <div className="flex justify-center">
            <Button
              onClick={runTests}
              disabled={testing}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              {testing ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Ejecutando Pruebas...
                </>
              ) : (
                <>
                  <TestTube className="w-4 h-4 mr-2" />
                  Ejecutar Pruebas de Integración
                </>
              )}
            </Button>
          </div>

          {/* Resultados de las pruebas */}
          {results.length > 0 && (
            <div className="space-y-3">
              <h4 className="text-white font-medium flex items-center space-x-2">
                <Database className="w-4 h-4" />
                <span>Resultados de Pruebas</span>
              </h4>
              
              {results.map((result, index) => (
                <div key={index} className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      {getStatusIcon(result.status)}
                      <span className="text-white font-medium">{result.name}</span>
                    </div>
                    <Badge variant="outline" className={getStatusColor(result.status)}>
                      {result.status.toUpperCase()}
                    </Badge>
                  </div>
                  
                  <p className={`text-sm ${
                    result.status === 'error' ? 'text-red-300' : 
                    result.status === 'success' ? 'text-green-300' : 'text-yellow-300'
                  }`}>
                    {result.message}
                  </p>
                  
                  {result.data && (
                    <details className="mt-2">
                      <summary className="text-gray-400 text-xs cursor-pointer hover:text-white">
                        Ver detalles técnicos
                      </summary>
                      <pre className="mt-2 p-2 bg-[#0a0a0a] border border-[#2a2a2a] rounded text-xs text-gray-300 overflow-auto">
                        {JSON.stringify(result.data, null, 2)}
                      </pre>
                    </details>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Información adicional */}
          {!testing && results.length === 0 && (
            <Alert className="bg-gray-500/10 border-gray-500/20">
              <Shield className="w-4 h-4 text-gray-400" />
              <AlertDescription className="text-gray-300">
                <strong>Instrucciones:</strong><br />
                1. Asegúrate de que el backend Django esté ejecutándose en <code>http://127.0.0.1:8000</code><br />
                2. Verifica que las credenciales de administrador sean correctas<br />
                3. Ejecuta las pruebas para verificar la integración completa
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>
    </div>
  );
}