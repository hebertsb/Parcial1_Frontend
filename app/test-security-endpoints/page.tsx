'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Shield, User, Check, X, Loader2 } from 'lucide-react';
import { reconocimientoFacialService } from '@/features/seguridad/services';

export default function TestSeguridadEndpoints() {
  const [email, setEmail] = useState('seguridad@facial.com');
  const [password, setPassword] = useState('seguridad123');
  const [token, setToken] = useState('');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<any>({});
  const [error, setError] = useState<string | null>(null);

  const testLogin = async () => {
    setLoading(true);
    setError(null);
    
    try {
      console.log('🔐 Intentando login de seguridad...');
      
      const response = await fetch('http://127.0.0.1:8000/api/authz/login/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
      });

      if (response.ok) {
        const data = await response.json();
        console.log('✅ Login exitoso:', data);
        
        setToken(data.access);
        localStorage.setItem('access_token', data.access);
        
        setResults({ ...results, login: { success: true, data } });
      } else {
        const errorData = await response.json();
        console.error('❌ Error en login:', errorData);
        setError(`Error en login: ${JSON.stringify(errorData)}`);
        setResults({ ...results, login: { success: false, error: errorData } });
      }
    } catch (error) {
      console.error('❌ Error de conexión:', error);
      setError(`Error de conexión: ${error}`);
      setResults({ ...results, login: { success: false, error: error } });
    } finally {
      setLoading(false);
    }
  };

  const testDashboard = async () => {
    if (!token) {
      setError('Primero debes hacer login');
      return;
    }

    setLoading(true);
    
    try {
      console.log('📊 Probando endpoint de dashboard...');
      const response = await reconocimientoFacialService.getDashboard();
      console.log('📊 Respuesta dashboard:', response);
      
      setResults({ ...results, dashboard: response });
    } catch (error) {
      console.error('❌ Error en dashboard:', error);
      setResults({ ...results, dashboard: { success: false, error } });
    } finally {
      setLoading(false);
    }
  };

  const testUsuarios = async () => {
    if (!token) {
      setError('Primero debes hacer login');
      return;
    }

    setLoading(true);
    
    try {
      console.log('👥 Probando endpoint de usuarios...');
      const response = await reconocimientoFacialService.obtenerUsuariosConReconocimiento();
      console.log('👥 Respuesta usuarios:', response);
      
      setResults({ ...results, usuarios: response });
    } catch (error) {
      console.error('❌ Error obteniendo usuarios:', error);
      setResults({ ...results, usuarios: { success: false, error } });
    } finally {
      setLoading(false);
    }
  };

  const testFotosUsuario = async () => {
    if (!token) {
      setError('Primero debes hacer login');
      return;
    }

    setLoading(true);
    
    try {
      // Usar ID de usuario de prueba
      const usuarioId = 8; // Según la documentación, Tito tiene ID 8
      console.log(`📸 Probando endpoint de fotos del usuario ${usuarioId}...`);
      
      const response = await reconocimientoFacialService.obtenerFotosUsuario(usuarioId);
      console.log('📸 Respuesta fotos:', response);
      
      setResults({ ...results, fotos: response });
    } catch (error) {
      console.error('❌ Error obteniendo fotos:', error);
      setResults({ ...results, fotos: { success: false, error } });
    } finally {
      setLoading(false);
    }
  };

  const testAllEndpoints = async () => {
    await testLogin();
    
    // Esperar un momento para que se guarde el token
    setTimeout(async () => {
      await testDashboard();
      await testUsuarios();
      await testFotosUsuario();
    }, 1000);
  };

  const ResultCard = ({ title, result }: { title: string; result: any }) => (
    <Card className="mb-4">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          {result?.success ? (
            <Check className="h-5 w-5 text-green-600" />
          ) : (
            <X className="h-5 w-5 text-red-600" />
          )}
          {title}
          <Badge variant={result?.success ? "default" : "destructive"}>
            {result?.success ? "Exitoso" : "Error"}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <pre className="text-xs bg-gray-100 p-2 rounded overflow-x-auto">
          {JSON.stringify(result, null, 2)}
        </pre>
      </CardContent>
    </Card>
  );

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <Shield className="h-8 w-8 text-blue-600" />
        <div>
          <h1 className="text-3xl font-bold">Test Endpoints de Seguridad</h1>
          <p className="text-gray-600">Verificación de la integración con el backend</p>
        </div>
      </div>

      {error && (
        <Alert variant="destructive" className="mb-6">
          <X className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Panel de Control */}
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Credenciales de Login
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Email:</label>
                <Input
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="seguridad@facial.com"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Password:</label>
                <Input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="seguridad123"
                />
              </div>

              {token && (
                <div>
                  <label className="block text-sm font-medium mb-1">Token Actual:</label>
                  <div className="text-xs bg-green-50 p-2 rounded border">
                    {token.substring(0, 50)}...
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Acciones de Test</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button 
                onClick={testLogin} 
                disabled={loading}
                className="w-full"
                variant="outline"
              >
                {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                1. Test Login
              </Button>
              
              <Button 
                onClick={testDashboard} 
                disabled={loading || !token}
                className="w-full"
                variant="outline"
              >
                {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                2. Test Dashboard
              </Button>
              
              <Button 
                onClick={testUsuarios} 
                disabled={loading || !token}
                className="w-full"
                variant="outline"
              >
                {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                3. Test Lista Usuarios
              </Button>
              
              <Button 
                onClick={testFotosUsuario} 
                disabled={loading || !token}
                className="w-full"
                variant="outline"
              >
                {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                4. Test Fotos Usuario
              </Button>

              <Button 
                onClick={testAllEndpoints} 
                disabled={loading}
                className="w-full"
              >
                {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                🚀 Test Todos los Endpoints
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Resultados */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Resultados</h2>
          
          {results.login && (
            <ResultCard title="1. Login" result={results.login} />
          )}
          
          {results.dashboard && (
            <ResultCard title="2. Dashboard" result={results.dashboard} />
          )}
          
          {results.usuarios && (
            <ResultCard title="3. Lista Usuarios" result={results.usuarios} />
          )}
          
          {results.fotos && (
            <ResultCard title="4. Fotos Usuario" result={results.fotos} />
          )}
        </div>
      </div>
    </div>
  );
}