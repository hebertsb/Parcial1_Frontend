/**
 * Componente para probar conexión con Backend de Seguridad
 * Según respuesta oficial del backend - 24 septiembre 2025
 */

'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';

const TestBackendSeguridad: React.FC = () => {
  const [results, setResults] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [token, setToken] = useState<string>('');

  const addResult = (message: string) => {
    setResults(prev => [...prev, `${new Date().toLocaleTimeString()}: ${message}`]);
  };

  const testLogin = async () => {
    setLoading(true);
    addResult('🧪 Probando login con credenciales del backend...');
    
    try {
      const response = await fetch('http://127.0.0.1:8000/auth/login/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email: 'admin@facial.com',
          password: 'admin123'
        })
      });

      if (response.ok) {
        const data = await response.json();
        setToken(data.access);
        addResult('✅ Login exitoso! Token obtenido');
        addResult(`👤 Usuario: ${data.user.email} - Roles: ${data.user.roles.join(', ')}`);
        localStorage.setItem('access_token', data.access);
      } else {
        const errorData = await response.text();
        addResult(`❌ Login falló (${response.status}): ${errorData}`);
      }
    } catch (error) {
      addResult(`❌ Error de conexión: ${error}`);
    } finally {
      setLoading(false);
    }
  };

  const testListarUsuarios = async () => {
    if (!token) {
      addResult('⚠️ Primero haz login para obtener token');
      return;
    }

    setLoading(true);
    addResult('🧪 Probando listar usuarios de seguridad...');
    
    try {
      const response = await fetch('http://127.0.0.1:8000/auth/admin/seguridad/listar/', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        addResult(`✅ Lista obtenida! ${data.count} usuarios encontrados`);
        if (data.usuarios && data.usuarios.length > 0) {
          data.usuarios.forEach((usuario: any, index: number) => {
            addResult(`   ${index + 1}. ${usuario.persona.nombre} ${usuario.persona.apellido} (${usuario.email})`);
          });
        }
      } else {
        const errorData = await response.text();
        addResult(`❌ Listar falló (${response.status}): ${errorData}`);
      }
    } catch (error) {
      addResult(`❌ Error de conexión: ${error}`);
    } finally {
      setLoading(false);
    }
  };

  const testCrearUsuario = async () => {
    if (!token) {
      addResult('⚠️ Primero haz login para obtener token');
      return;
    }

    setLoading(true);
    addResult('🧪 Probando crear usuario de seguridad...');
    
    const testUser = {
      email: `test.seguridad.${Date.now()}@condominio.com`,
      password: 'temporal123',
      persona: {
        nombre: 'Test',
        apellido: 'Usuario Seguridad',
        ci: `${Date.now().toString().slice(-8)}`,
        telefono: '70123456',
        direccion: 'Dirección de prueba'
      }
    };

    try {
      const response = await fetch('http://127.0.0.1:8000/auth/admin/seguridad/crear/', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(testUser)
      });

      if (response.ok) {
        const data = await response.json();
        addResult(`✅ Usuario creado! ID: ${data.usuario.id}`);
        addResult(`📧 Email: ${data.usuario.email}`);
        addResult(`👤 Nombre: ${data.usuario.persona.nombre} ${data.usuario.persona.apellido}`);
      } else {
        const errorData = await response.text();
        addResult(`❌ Crear usuario falló (${response.status}): ${errorData}`);
      }
    } catch (error) {
      addResult(`❌ Error de conexión: ${error}`);
    } finally {
      setLoading(false);
    }
  };

  const clearResults = () => {
    setResults([]);
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            🧪 Test Backend Seguridad
            <span className="text-sm font-normal text-gray-500">
              (Según respuesta oficial del backend)
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Botones de prueba */}
          <div className="flex flex-wrap gap-2">
            <Button 
              onClick={testLogin} 
              disabled={loading}
              variant="outline"
            >
              1️⃣ Test Login (admin@facial.com)
            </Button>
            <Button 
              onClick={testListarUsuarios} 
              disabled={loading || !token}
              variant="outline"
            >
              2️⃣ Test Listar Usuarios
            </Button>
            <Button 
              onClick={testCrearUsuario} 
              disabled={loading || !token}
              variant="outline"
            >
              3️⃣ Test Crear Usuario
            </Button>
            <Button 
              onClick={clearResults} 
              variant="secondary"
              size="sm"
            >
              🗑️ Limpiar
            </Button>
          </div>

          {/* Token info */}
          {token && (
            <div className="p-2 bg-green-50 rounded border">
              <span className="text-sm text-green-700">
                ✅ Token activo: {token.substring(0, 50)}...
              </span>
            </div>
          )}

          {/* Resultados */}
          <div className="bg-gray-50 p-4 rounded-lg max-h-96 overflow-y-auto">
            <h3 className="font-semibold mb-2">📋 Resultados:</h3>
            {results.length === 0 ? (
              <p className="text-gray-500 italic">Haz clic en los botones para probar...</p>
            ) : (
              results.map((result, index) => (
                <div key={index} className="text-sm font-mono mb-1">
                  {result}
                </div>
              ))
            )}
          </div>

          {/* Info del backend */}
          <div className="p-3 bg-blue-50 rounded border">
            <h4 className="font-semibold text-blue-800 mb-2">📡 Configuración Backend:</h4>
            <ul className="text-sm text-blue-700 space-y-1">
              <li>• URL Base: http://127.0.0.1:8000</li>
              <li>• Login: POST /auth/login/</li>
              <li>• Listar: GET /auth/admin/seguridad/listar/</li>
              <li>• Crear: POST /auth/admin/seguridad/crear/</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TestBackendSeguridad;