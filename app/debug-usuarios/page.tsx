'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function DebugUsuarios() {
  const [email, setEmail] = useState('carlos.rodriguez@facial.com');
  const [resultado, setResultado] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const buscarUsuario = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('access_token');
      if (!token) {
        setResultado({ error: 'No hay token de autenticación' });
        return;
      }

      const response = await fetch('http://127.0.0.1:8000/api/personas/', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        const usuario = data.find((p: any) => p.email === email);
        setResultado({
          encontrado: !!usuario,
          usuario: usuario || null,
          total: data.length,
          ejemplo: data[0] || null
        });
      } else {
        setResultado({ error: `HTTP ${response.status}: ${await response.text()}` });
      }
    } catch (error) {
      setResultado({ error: error.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto py-6 space-y-6">
      <h1 className="text-2xl font-bold">Debug: Verificar Usuario</h1>
      
      <Card>
        <CardHeader>
          <CardTitle>Buscar Usuario por Email</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email del usuario"
          />
          <Button onClick={buscarUsuario} disabled={loading}>
            {loading ? 'Buscando...' : 'Buscar Usuario'}
          </Button>
        </CardContent>
      </Card>

      {resultado && (
        <Card>
          <CardHeader>
            <CardTitle>Resultado</CardTitle>
          </CardHeader>
          <CardContent>
            <pre className="bg-gray-100 p-4 rounded text-sm overflow-auto">
              {JSON.stringify(resultado, null, 2)}
            </pre>
          </CardContent>
        </Card>
      )}
    </div>
  );
}