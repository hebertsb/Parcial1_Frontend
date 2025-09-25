"use client"

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { quickLogin, checkLoginStatus, logout } from '@/utils/quickLogin';
import { useUsuarios } from '@/hooks/useUsuarios';

export default function TestBackendPage() {
  const [loginStatus, setLoginStatus] = useState(checkLoginStatus());
  const [loginLoading, setLoginLoading] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);

  const {
    usuarios,
    loading: usuariosLoading,
    error: usuariosError,
    totalCount,
    refetch
  } = useUsuarios();

  const handleLogin = async () => {
    try {
      setLoginLoading(true);
      setLoginError(null);
      await quickLogin();
      setLoginStatus(true);
    } catch (error: any) {
      setLoginError(error.message);
    } finally {
      setLoginLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    setLoginStatus(false);
  };

  const handleRefetch = async () => {
    await refetch();
  };

  return (
    <div className="min-h-screen bg-black text-white p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-2">🔗 Test Conexión Backend</h1>
          <p className="text-gray-400">
            Prueba de conectividad con el backend Django - Endpoint: /api/personas/
          </p>
        </div>

        {/* Estado de Autenticación */}
        <Card className="bg-gray-900 border-gray-700">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              🔐 Estado de Autenticación
              <Badge variant={loginStatus ? "default" : "destructive"}>
                {loginStatus ? "Autenticado" : "No Autenticado"}
              </Badge>
            </CardTitle>
            <CardDescription>
              Credenciales: admin@facial.com / admin123
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {!loginStatus && (
              <div className="space-y-2">
                <Button 
                  onClick={handleLogin} 
                  disabled={loginLoading}
                  className="w-full"
                >
                  {loginLoading ? "Iniciando sesión..." : "🚀 Login Automático"}
                </Button>
                {loginError && (
                  <div className="p-3 bg-red-900/20 border border-red-800 rounded text-red-200">
                    ❌ Error: {loginError}
                  </div>
                )}
              </div>
            )}
            
            {loginStatus && (
              <div className="space-y-2">
                <div className="p-3 bg-green-900/20 border border-green-800 rounded text-green-200">
                  ✅ Autenticado correctamente - Token JWT guardado
                </div>
                <Button 
                  onClick={handleLogout} 
                  variant="outline"
                  className="w-full"
                >
                  🚪 Cerrar Sesión
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Estado de la API */}
        <Card className="bg-gray-900 border-gray-700">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              📡 Estado de la API
              <Badge variant={usuariosError ? "destructive" : usuariosLoading ? "secondary" : "default"}>
                {usuariosError ? "Error" : usuariosLoading ? "Cargando" : "OK"}
              </Badge>
            </CardTitle>
            <CardDescription>
              Endpoint: http://127.0.0.1:8000/api/personas/
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold">{totalCount}</div>
                <div className="text-sm text-gray-400">Usuarios encontrados</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">{usuarios.length}</div>
                <div className="text-sm text-gray-400">Usuarios cargados</div>
              </div>
            </div>

            {usuariosError && (
              <div className="p-3 bg-red-900/20 border border-red-800 rounded text-red-200">
                ❌ Error de API: {usuariosError}
              </div>
            )}

            {usuariosLoading && (
              <div className="p-3 bg-blue-900/20 border border-blue-800 rounded text-blue-200">
                🔄 Cargando datos del backend...
              </div>
            )}

            {!usuariosLoading && !usuariosError && usuarios.length > 0 && (
              <div className="p-3 bg-green-900/20 border border-green-800 rounded text-green-200">
                ✅ Conexión exitosa - Datos recibidos del backend
              </div>
            )}

            <Button 
              onClick={handleRefetch} 
              disabled={usuariosLoading || !loginStatus}
              className="w-full"
            >
              {usuariosLoading ? "Cargando..." : "🔄 Recargar Datos"}
            </Button>
          </CardContent>
        </Card>

        {/* Lista de Usuarios */}
        {usuarios.length > 0 && (
          <Card className="bg-gray-900 border-gray-700">
            <CardHeader>
              <CardTitle>👥 Usuarios del Backend</CardTitle>
              <CardDescription>
                Datos reales desde http://127.0.0.1:8000/api/personas/
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {usuarios.slice(0, 5).map((usuario) => (
                  <div 
                    key={usuario.id}
                    className="flex items-center justify-between p-3 bg-gray-800 rounded border border-gray-700"
                  >
                    <div>
                      <div className="font-medium">
                        {usuario.persona.nombre_completo}
                      </div>
                      <div className="text-sm text-gray-400">
                        ID: {usuario.id} | Email: {usuario.email}
                      </div>
                    </div>
                    <Badge variant={usuario.estado === 'ACTIVO' ? "default" : "destructive"}>
                      {usuario.estado}
                    </Badge>
                  </div>
                ))}
                {usuarios.length > 5 && (
                  <div className="text-center text-gray-400 text-sm">
                    ... y {usuarios.length - 5} usuarios más
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Información Técnica */}
        <Card className="bg-gray-900 border-gray-700">
          <CardHeader>
            <CardTitle>🔧 Información Técnica</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <div><strong>Backend URL:</strong> http://127.0.0.1:8000</div>
            <div><strong>API Endpoint:</strong> /api/personas/</div>
            <div><strong>Autenticación:</strong> JWT Bearer Token</div>
            <div><strong>CORS:</strong> Configurado para localhost:3000</div>
            <div><strong>Estado del Hook:</strong> {usuariosLoading ? "Cargando" : "Listo"}</div>
            <div><strong>Token presente:</strong> {checkLoginStatus() ? "Sí" : "No"}</div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}