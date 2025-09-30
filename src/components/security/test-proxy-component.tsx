'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { CheckCircle, XCircle, AlertTriangle, Wifi } from 'lucide-react';

// Interfaces para los tipos de datos
interface ErrorResult {
  error: string;
}

interface TestResult {
  name: string;
  localhost?: string;
  ip127?: string;
  status?: number;
  success?: boolean;
  message?: string;
  error?: string;
  isProxyError?: boolean;
  recommendation?: string;
  NEXT_PUBLIC_API_URL?: string;
  NODE_ENV?: string;
}

export default function TestProxyComponent() {
  const [testResults, setTestResults] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const runProxyTest = async () => {
    setLoading(true);
    setTestResults(null);

    try {
      // Test de proxy usando la función específica del backend
      console.log('🚨 Ejecutando test de proxy según solución del backend...');
      
      const results = {
        timestamp: new Date().toISOString(),
        tests: [] as TestResult[]
      };

      // Test 1: localhost vs 127.0.0.1
      try {
        console.log('Test 1: localhost vs 127.0.0.1');
        // Test localhost (usando endpoint sin autenticación)
        let localhostResult: Response | ErrorResult;
        try {
          localhostResult = await fetch('http://localhost:8000/api/seguridad/health/', { 
            method: 'GET',
            headers: { 'Accept': 'application/json' }
          });
        } catch (e: any) {
          localhostResult = { error: e.message };
        }

        // Test 127.0.0.1 (usando endpoint sin autenticación)
        let ip127Result: Response | ErrorResult;
        try {
          ip127Result = await fetch('http://127.0.0.1:8000/api/seguridad/health/', { 
            method: 'GET',
            headers: { 'Accept': 'application/json' }
          });
        } catch (e: any) {
          ip127Result = { error: e.message };
        }

        // Type guard para verificar si el resultado es un error
        const isErrorResult = (result: Response | ErrorResult): result is ErrorResult => {
          return 'error' in result;
        };

        const localhostError = isErrorResult(localhostResult);
        const ip127Error = isErrorResult(ip127Result);

        results.tests.push({
          name: 'Comparación localhost vs 127.0.0.1',
          localhost: localhostError ? 'ERROR: ' + (localhostResult as ErrorResult).error : 'OK',
          ip127: ip127Error ? 'ERROR: ' + (ip127Result as ErrorResult).error : 'OK',
          recommendation: localhostError && !ip127Error ? 'Usar 127.0.0.1' : 'Ambos OK'
        });
      } catch (error: any) {
        results.tests.push({
          name: 'Comparación localhost vs 127.0.0.1',
          error: error?.message || 'Error desconocido'
        });
      }

      // Test 2: Función específica del backend
      try {
        console.log('Test 2: Función específica anti-proxy del backend');
        const formData = new FormData();
        formData.append('umbral_confianza', '70.0');
        formData.append('buscar_en', 'propietarios');
        formData.append('usar_ia_real', 'false');

        const response = await fetch(
          'http://127.0.0.1:8000/api/seguridad/verificacion-tiempo-real/',
          {
            method: 'POST',
            body: formData
            // NO proxy, NO Content-Type manual
          }
        );

        const status = response.status;
        const data = await response.json().catch(() => ({}));

        results.tests.push({
          name: 'Endpoint verificación (sin foto - error esperado)',
          status: status,
          success: status === 400, // Error esperado sin foto
          message: data.error || 'Respuesta recibida',
          recommendation: status === 400 ? 'Endpoint funcionando correctamente' : 'Verificar configuración'
        });
      } catch (error: any) {
        const errorMessage = error?.message || 'Error desconocido';
        results.tests.push({
          name: 'Endpoint verificación',
          error: errorMessage,
          isProxyError: errorMessage.includes('proxy') || errorMessage.includes('ECONNREFUSED'),
          recommendation: errorMessage.includes('proxy') ? 'Configurar NO_PROXY=127.0.0.1' : 'Verificar que Django esté corriendo'
        });
      }

      // Test 3: Variables de entorno
      results.tests.push({
        name: 'Variables de entorno',
        NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
        NODE_ENV: process.env.NODE_ENV,
        recommendation: process.env.NEXT_PUBLIC_API_URL?.includes('127.0.0.1') ? 'Configuración correcta' : 'Usar 127.0.0.1'
      });

      setTestResults(results);

    } catch (error: any) {
      setTestResults({
        error: error?.message || 'Error desconocido en el test',
        timestamp: new Date().toISOString()
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Wifi className="h-5 w-5" />
            <span>🚨 Test de Proxy - Solución Backend</span>
          </CardTitle>
          <p className="text-sm text-gray-600">
            Diagnóstico específico para el problema de proxy identificado por el backend
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button 
            onClick={runProxyTest} 
            disabled={loading}
            className="w-full"
          >
            {loading ? 'Ejecutando tests...' : '🔍 Ejecutar Test de Proxy'}
          </Button>

          {testResults && (
            <div className="space-y-4">
              <div className="text-sm text-gray-500">
                Test ejecutado: {new Date(testResults.timestamp).toLocaleString()}
              </div>

              {testResults.error ? (
                <Alert variant="destructive">
                  <XCircle className="h-4 w-4" />
                  <AlertDescription>
                    Error general: {testResults.error}
                  </AlertDescription>
                </Alert>
              ) : (
                <div className="space-y-3">
                  {testResults.tests?.map((test, index) => (
                    <Card key={index} className="border-l-4 border-l-blue-500">
                      <CardContent className="pt-4">
                        <h4 className="font-medium text-gray-900 mb-2">
                          {test.name}
                        </h4>
                        
                        {test.localhost !== undefined && (
                          <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                              <span className="font-medium">localhost:</span>
                              <div className={test.localhost.includes('ERROR') ? 'text-red-600' : 'text-green-600'}>
                                {test.localhost}
                              </div>
                            </div>
                            <div>
                              <span className="font-medium">127.0.0.1:</span>
                              <div className={test.ip127.includes('ERROR') ? 'text-red-600' : 'text-green-600'}>
                                {test.ip127}
                              </div>
                            </div>
                          </div>
                        )}

                        {test.status !== undefined && (
                          <div className="text-sm">
                            <div className="flex items-center space-x-2">
                              {test.success ? (
                                <CheckCircle className="h-4 w-4 text-green-600" />
                              ) : (
                                <XCircle className="h-4 w-4 text-red-600" />
                              )}
                              <span>Status: {test.status}</span>
                            </div>
                            <div className="mt-1 text-gray-600">{test.message}</div>
                          </div>
                        )}

                        {test.error && (
                          <div className="text-sm">
                            <div className="flex items-center space-x-2">
                              {test.isProxyError ? (
                                <AlertTriangle className="h-4 w-4 text-yellow-600" />
                              ) : (
                                <XCircle className="h-4 w-4 text-red-600" />
                              )}
                              <span className="text-red-600">Error: {test.error}</span>
                            </div>
                          </div>
                        )}

                        {test.NEXT_PUBLIC_API_URL && (
                          <div className="text-sm">
                            <div>API URL: <code className="bg-gray-100 px-1 rounded">{test.NEXT_PUBLIC_API_URL}</code></div>
                            <div>NODE_ENV: <code className="bg-gray-100 px-1 rounded">{test.NODE_ENV}</code></div>
                          </div>
                        )}

                        {test.recommendation && (
                          <div className="mt-2 p-2 bg-blue-50 rounded text-sm text-blue-800">
                            💡 <strong>Recomendación:</strong> {test.recommendation}
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}

              <Alert>
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>
                  <strong>Solución del Backend:</strong> Si hay errores de proxy, usar fetch() directo 
                  con <code>http://127.0.0.1:8000</code> en lugar de localhost. 
                  Variables de entorno configuradas en <code>.env.local</code>.
                </AlertDescription>
              </Alert>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>🔧 Test Manual en Consola</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="bg-gray-100 p-4 rounded text-sm font-mono">
            <div className="text-gray-700 mb-2">// Abrir DevTools (F12) y ejecutar:</div>
            <div className="text-blue-600">await window.reconocimientoFacialDebug.testProxyIssue();</div>
            <div className="text-gray-700 mt-2">// Función específica anti-proxy:</div>
            <div className="text-blue-600">window.reconocimientoFacialDebug.verificarRostroSinProxy</div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}