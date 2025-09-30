'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { sincronizacionReconocimientoService } from '@/features/seguridad/sincronizacion-service';
import { 
  RefreshCw, 
  Users, 
  Home, 
  CheckCircle, 
  AlertCircle, 
  Camera,
  Database
} from 'lucide-react';

interface TestResult {
  success: boolean;
  data?: any;
  message?: string;
  timestamp?: string;
}

interface TestResults {
  todos_usuarios: TestResult | null;
  propietarios: TestResult | null;
  sincronizar_individual: TestResult | null;
  sincronizar_todos: TestResult | null;
  estadisticas: TestResult | null;
}

export default function TestSincronizacionPage() {
  const [results, setResults] = useState<TestResults>({
    todos_usuarios: null,
    propietarios: null,
    sincronizar_individual: null,
    sincronizar_todos: null,
    estadisticas: null
  });
  const [loading, setLoading] = useState(false);

  const ejecutarTest = async (testName: keyof TestResults, testFunction: () => Promise<any>) => {
    setLoading(true);
    
    try {
      console.log(`🧪 Ejecutando test: ${testName}`);
      const response = await testFunction();
      
      setResults(prev => ({
        ...prev,
        [testName]: {
          success: response.success,
          data: response.data,
          message: response.message,
          timestamp: new Date().toLocaleTimeString()
        }
      }));
      
      console.log(`✅ Test ${testName} completado:`, response);
    } catch (error) {
      console.error(`❌ Error en test ${testName}:`, error);
      
      setResults(prev => ({
        ...prev,
        [testName]: {
          success: false,
          message: error instanceof Error ? error.message : 'Error desconocido',
          timestamp: new Date().toLocaleTimeString()
        }
      }));
    } finally {
      setLoading(false);
    }
  };

  const testTodosUsuarios = () => {
    return ejecutarTest('todos_usuarios', () => 
      sincronizacionReconocimientoService.obtenerUsuariosConReconocimiento()
    );
  };

  const testPropietarios = () => {
    return ejecutarTest('propietarios', () =>
      sincronizacionReconocimientoService.obtenerPropietariosConReconocimiento()
    );
  };

  const testSincronizarIndividual = () => {
    // Usar ID de usuario de prueba (ajustar según tu BD)
    const usuarioId = 1; 
    return ejecutarTest('sincronizar_individual', () =>
      sincronizacionReconocimientoService.sincronizarFotosUsuario(usuarioId)
    );
  };

  const testSincronizarTodos = () => {
    return ejecutarTest('sincronizar_todos', () =>
      sincronizacionReconocimientoService.sincronizarTodasLasFotos()
    );
  };

  const testEstadisticas = () => {
    return ejecutarTest('estadisticas', () =>
      sincronizacionReconocimientoService.obtenerEstadisticasSincronizacion()
    );
  };

  const ejecutarTodosLosTests = async () => {
    setLoading(true);
    
    try {
      console.log('🚀 Ejecutando TODOS los tests de sincronización...');
      
      await testEstadisticas();
      await testTodosUsuarios();
      await testPropietarios();
      
      // Tests de sincronización al final (pueden ser destructivos)
      console.log('⚠️ Ejecutando tests de sincronización (pueden modificar datos)...');
      // await testSincronizarIndividual();
      // await testSincronizarTodos();
      
      console.log('✅ Todos los tests completados');
    } catch (error) {
      console.error('❌ Error ejecutando tests:', error);
    } finally {
      setLoading(false);
    }
  };

  const renderTestResult = (testName: string, result: TestResult | null, description: string) => {
    return (
      <Card key={testName}>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>{testName.replace(/_/g, ' ').toUpperCase()}</span>
            {result && (
              result.success ? 
                <CheckCircle className="h-5 w-5 text-green-600" /> : 
                <AlertCircle className="h-5 w-5 text-red-600" />
            )}
          </CardTitle>
          <p className="text-sm text-gray-600">{description}</p>
        </CardHeader>
        <CardContent>
          {result ? (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Badge variant={result.success ? "default" : "destructive"}>
                  {result.success ? "ÉXITO" : "ERROR"}
                </Badge>
                <span className="text-xs text-gray-500">
                  {result.timestamp}
                </span>
              </div>
              
              {result.message && (
                <p className="text-sm">{result.message}</p>
              )}
              
              {result.data && (
                <div className="bg-gray-50 p-3 rounded text-xs font-mono overflow-auto max-h-32">
                  <pre>{JSON.stringify(result.data, null, 2)}</pre>
                </div>
              )}
            </div>
          ) : (
            <p className="text-gray-500 text-sm">No ejecutado</p>
          )}
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Database className="h-8 w-8 text-blue-600" />
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Test Sincronización Reconocimiento Facial
            </h1>
            <p className="text-gray-600">
              Pruebas de los endpoints de integración entre propietarios y seguridad
            </p>
          </div>
        </div>
        
        <Button 
          onClick={ejecutarTodosLosTests}
          disabled={loading}
          className="gap-2"
        >
          <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
          Ejecutar Todos los Tests
        </Button>
      </div>

      {/* Control Buttons */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <Button
          onClick={testEstadisticas}
          variant="outline"
          disabled={loading}
          className="gap-2"
        >
          <Database className="h-4 w-4" />
          Estadísticas
        </Button>
        
        <Button
          onClick={testTodosUsuarios}
          variant="outline"
          disabled={loading}
          className="gap-2"
        >
          <Users className="h-4 w-4" />
          Todos Usuarios
        </Button>
        
        <Button
          onClick={testPropietarios}
          variant="outline"
          disabled={loading}
          className="gap-2"
        >
          <Home className="h-4 w-4" />
          Propietarios
        </Button>
        
        <Button
          onClick={testSincronizarIndividual}
          variant="outline"
          disabled={loading}
          className="gap-2"
        >
          <RefreshCw className="h-4 w-4" />
          Sinc. Individual
        </Button>
        
        <Button
          onClick={testSincronizarTodos}
          variant="outline"
          disabled={loading}
          className="gap-2"
        >
          <Camera className="h-4 w-4" />
          Sinc. Todos
        </Button>
      </div>

      {/* Warning */}
      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          <strong>IMPORTANTE:</strong> Los tests de sincronización pueden modificar datos en el backend. 
          Úsalos solo en entorno de desarrollo o con datos de prueba.
        </AlertDescription>
      </Alert>

      {/* Test Results */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {renderTestResult(
          'estadisticas',
          results.estadisticas,
          'Obtiene métricas de sincronización del sistema'
        )}
        
        {renderTestResult(
          'todos_usuarios',
          results.todos_usuarios,
          'Lista todos los usuarios con reconocimiento facial (propietarios + inquilinos)'
        )}
        
        {renderTestResult(
          'propietarios',
          results.propietarios,
          'Lista únicamente propietarios con reconocimiento facial'
        )}
        
        {renderTestResult(
          'sincronizar_individual',
          results.sincronizar_individual,
          'Sincroniza fotos de Dropbox de un usuario específico'
        )}
        
        {renderTestResult(
          'sincronizar_todos',
          results.sincronizar_todos,
          'Sincroniza fotos de Dropbox de todos los usuarios'
        )}
      </div>

      {/* Summary */}
      {Object.values(results).some(r => r !== null) && (
        <Card>
          <CardHeader>
            <CardTitle>Resumen de Tests</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <p className="text-2xl font-bold text-green-600">
                  {Object.values(results).filter(r => r?.success).length}
                </p>
                <p className="text-sm text-gray-600">Exitosos</p>
              </div>
              
              <div className="text-center">
                <p className="text-2xl font-bold text-red-600">
                  {Object.values(results).filter(r => r && !r.success).length}
                </p>
                <p className="text-sm text-gray-600">Fallidos</p>
              </div>
              
              <div className="text-center">
                <p className="text-2xl font-bold text-gray-600">
                  {Object.values(results).filter(r => r === null).length}
                </p>
                <p className="text-sm text-gray-600">Pendientes</p>
              </div>
              
              <div className="text-center">
                <p className="text-2xl font-bold text-blue-600">
                  {Object.values(results).filter(r => r !== null).length}
                </p>
                <p className="text-sm text-gray-600">Total</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}